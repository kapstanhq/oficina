/**
 * O SERVIDOR LOCAL DO PAINEL — `node:http` puro, com as guardas que um
 * servidor de localhost precisa ter e quase nunca tem.
 *
 * ── POR QUE ISTO NÃO É "SÓ UM SERVIDORZINHO LOCAL" ─────────────────────
 * Um processo escutando em 127.0.0.1 parece privado e não é: qualquer página
 * que o usuário abrir no navegador pode falar com ele. O ataque tem nome —
 * **DNS rebinding** — e funciona assim: um site controlado pelo atacante
 * resolve o próprio domínio para 127.0.0.1 depois de carregado, e aí o
 * JavaScript dele passa a fazer pedidos ao servidor local com a política de
 * mesma origem satisfeita, porque para o navegador o host não mudou.
 *
 * Isso não é teoria de segurança: é a classe da CVE-2026-11624, que atingiu
 * servidores MCP, e a razão de a especificação do MCP ter virado normativa:
 *
 *   "Os servidores DEVEM validar o cabeçalho `Origin` em todas as conexões
 *    para prevenir ataques de DNS rebinding, e, se ele estiver presente e for
 *    inválido, DEVEM responder 403 Forbidden."
 *
 * São TRÊS guardas, e nenhuma sozinha basta:
 *
 *   1 · escutar em 127.0.0.1 e não em 0.0.0.0 — senão a máquina inteira da
 *       rede alcança o painel, e o Wi-Fi da cafeteria vira porta de entrada
 *   2 · validar `Host` contra uma lista fechada — é o que derruba o rebinding,
 *       porque o `Host` carrega o domínio do atacante e não `127.0.0.1`
 *   3 · validar `Origin` quando ele vem — é o que derruba a página de outro
 *       site que tente escrever aqui, mesmo sem rebinding
 *
 * E uma quarta, que é nossa e não da especificação: **uma chave**. As três
 * acima protegem contra um site; a chave protege contra qualquer outro
 * programa da mesma máquina que varra portas. Ela viaja no fragmento da URL
 * que o agente entrega, e o navegador não a manda ao servidor — quem a manda
 * de volta é a página, em cabeçalho.
 *
 * ── A CHAVE DEIXOU DE NASCER A CADA EXECUÇÃO (D230) ───────────────────
 * Ela nascia por processo, e isso tinha um preço que só apareceu no uso: o
 * endereço mudava toda vez, então NÃO HAVIA endereço — havia uma linha para
 * copiar do terminal a cada sessão. A página inicial existe para ser o lugar
 * de onde se volta, e um lugar tem endereço.
 *
 * Agora ela é FIXA POR MÁQUINA e mora em `~/.kapstan/painel/chave`. **É o
 * único arquivo que o painel escreve**, e ele não é na base — ver
 * `nucleo/base.mjs` sobre a propriedade que isso preserva. Se o disco
 * recusar a escrita, o painel volta a uma chave por processo e diz isso: uma
 * ferramenta que não abre por causa de uma permissão de HOME é pior que uma
 * que abre com endereço novo.
 *
 * ── E NA PRIMEIRA ABERTURA ELA VIRA COOKIE ────────────────────────────
 * `POST /entrar` troca a chave do cabeçalho por um cookie
 * `HttpOnly; SameSite=Strict`, e dali em diante `http://127.0.0.1:4180/`
 * abre sozinho — o que libera o `#` para ser ROTA da página, que é o que a
 * página inicial precisava dele.
 *
 * O que vai no cookie NÃO é a chave: é um BILHETE derivado dela. A razão é
 * mecânica e pouca gente a tem na ponta da língua — **cookie não distingue
 * porta**. Um cookie posto em `127.0.0.1` é enviado a QUALQUER servidor de
 * 127.0.0.1 que o navegador visite, em qualquer porta. Com a chave crua lá
 * dentro, visitar um servidor local qualquer entregaria a ele a chave que
 * mora no HOME e vale para todas as execuções futuras. O bilhete vale só
 * contra este painel, e a chave do disco nunca viaja em cabeçalho que outra
 * porta possa ler.
 */
import { createServer } from "node:http";
import { createHmac, randomBytes } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, posix, win32 } from "node:path";

/* ── A PORTA ──────────────────────────────────────────────────────────
   3000 é o `npm run dev`, 3001 o `--dist`, 4173 a auditoria. O painel começa
   em 4180 e ANDA quando a porta está ocupada, em vez de morrer: duas
   bases abertas ao mesmo tempo é o caso normal de quem usa dois packs, e
   "porta em uso" é a mensagem mais inútil que uma ferramenta pode dar a quem
   não é desenvolvedor. */
/* ── E HÁ PORTAS QUE O NAVEGADOR SE RECUSA A ABRIR ────────────────────
   Isto não é teoria: foi medido nesta máquina. Um painel subido em **4190**
   respondeu 200 a um cliente de linha de comando e devolveu `bad port` ao
   `fetch()`. A 4190 é ManageSieve, e está na lista de portas bloqueadas do
   Chrome e do Firefox — eles recusam a CONEXÃO, antes de qualquer pedido.

   O defeito que isso causaria é do pior tipo: o painel sobe, o agente
   imprime o endereço, e o navegador diz `ERR_UNSAFE_PORT` — uma mensagem que
   não tem nada a ver com a causa e que ninguém liga a uma porta ocupada. E
   ele só apareceria com as dez primeiras portas tomadas, ou seja, tarde.

   A lista abaixo é só a faixa que esta busca alcança. A lista inteira do
   navegador tem ~80 portas, quase todas abaixo de 1024, e copiá-la aqui
   seria carregar ruído para sempre. */
const PORTAS_BLOQUEADAS = new Set([4045, 4190, 5060, 5061, 6000, 6566]);
const livre = (p) => (PORTAS_BLOQUEADAS.has(p) ? p + 1 : p);

const PORTA_INICIAL = livre(Number(process.env.PAINEL_PORTA || 4180));
const TENTATIVAS = 12;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

/* ── A CHAVE DA MÁQUINA ───────────────────────────────────────────────
   `KAPSTAN_PAINEL_DIR` existe para a prova: sem ele, provar a criação do
   arquivo exigiria escrever no HOME de quem roda o teste.

   O formato é conferido ao LER, e não só ao escrever: um arquivo truncado
   pela metade por um desligamento no meio da gravação daria uma chave curta
   que continuaria funcionando, com a entropia que sobrou. Chave que não
   passa no formato é refeita. */
const FORMATO_DA_CHAVE = /^[A-Za-z0-9_-]{32,}$/;

export const pastaDaChave = () =>
  process.env.KAPSTAN_PAINEL_DIR || join(homedir(), ".kapstan", "painel");

/* ── O QUE PÕE O PAINEL SOLTO NO LOGIN (D243) ─────────────────────────
   Quem escreve é `sempre.mjs --instalar`; o servidor só confere se existe,
   para a página Conta dizer. Tudo no nível do USUÁRIO, sem administrador:

     win32    `.vbs` na pasta Inicializar
     darwin   LaunchAgent em ~/Library/LaunchAgents
     linux    `.desktop` no autostart do XDG — sobe com a sessão gráfica. A
              unidade do systemd de usuário é a alternativa para quem não tem
              sessão gráfica: `sempre.mjs` a escreve, e quem a liga é a pessoa

   `KAPSTAN_INICIALIZAR_DIR` troca a pasta, e é o que a prova usa. As funções
   recebem plataforma, ambiente e casa para a prova gerar as três daqui. */
export const ROTULO_DO_LOGIN = "br.com.kapstan.painel";
const NOME_NO_LOGIN = { win32: "kapstan-painel.vbs", darwin: `${ROTULO_DO_LOGIN}.plist`, linux: "kapstan-painel.desktop" };
const plat = (p) => (p === "win32" || p === "darwin" ? p : "linux");
/* caminho de outra plataforma se monta com o separador DELA */
const juntar = (p, ...partes) => (p === "win32" ? win32 : posix).join(...partes);

export function atalhoDoLogin({ plataforma = process.platform, env = process.env, casa = homedir() } = {}) {
  const p = plat(plataforma);
  if (env.KAPSTAN_INICIALIZAR_DIR) return join(env.KAPSTAN_INICIALIZAR_DIR, NOME_NO_LOGIN[p]);
  if (p === "win32") return juntar(p, env.APPDATA || juntar(p, casa, "AppData", "Roaming"),
    "Microsoft", "Windows", "Start Menu", "Programs", "Startup", NOME_NO_LOGIN[p]);
  if (p === "darwin") return juntar(p, casa, "Library", "LaunchAgents", NOME_NO_LOGIN[p]);
  return juntar(p, env.XDG_CONFIG_HOME || juntar(p, casa, ".config"), "autostart", NOME_NO_LOGIN[p]);
}

/** a unidade do systemd de usuário — só no Linux, e só a alternativa */
export function unidadeDoLogin({ env = process.env, casa = homedir() } = {}) {
  if (env.KAPSTAN_INICIALIZAR_DIR) return join(env.KAPSTAN_INICIALIZAR_DIR, "kapstan-painel.service");
  return posix.join(env.XDG_CONFIG_HOME || posix.join(casa, ".config"), "systemd", "user", "kapstan-painel.service");
}

/**
 * O CONTEÚDO do que vai no login, por plataforma — puro, sem tocar o disco.
 * `comando` é a linha inteira, sem aspas: [node, sempre.mjs, "--base", pasta, …].
 * `caminhos` é o PATH de quem instalou: o launchd e o systemd sobem com um
 * PATH mínimo, e o lançador precisa achar o `claude`.
 */
export function conteudoDoLogin(plataforma, { comando, caminhos = "" }) {
  const p = plat(plataforma);
  const aviso = "O painel da Kapstan sempre ligado (D243). Criado por sempre.mjs --instalar; tire com --desinstalar.";
  if (p === "win32") {
    /* `.vbs` porque o `Run` com 0 sobe o node SEM janela; e em UTF-16, que é
       o que o wscript lê sem estragar acento no caminho */
    const linha = comando.map((x) => x.startsWith("--") ? x : `"${x}"`).join(" ");
    const vbs = `' ${aviso}\r\n`
      + `CreateObject("WScript.Shell").Run "${linha.replace(/"/g, '""')}", 0, False\r\n`;
    return Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(vbs, "utf16le")]);
  }
  if (p === "darwin") {
    const xml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return Buffer.from([
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">`,
      `<!-- ${xml(aviso)} -->`,
      `<plist version="1.0">`, `<dict>`,
      `  <key>Label</key><string>${ROTULO_DO_LOGIN}</string>`,
      `  <key>ProgramArguments</key>`, `  <array>`,
      ...comando.map((x) => `    <string>${xml(x)}</string>`),
      `  </array>`,
      /* o supervisor já sobe o servidor de novo quando ele cai; o launchd só o põe de pé */
      `  <key>RunAtLoad</key><true/>`,
      `  <key>KeepAlive</key><false/>`,
      ...(caminhos ? [`  <key>EnvironmentVariables</key>`, `  <dict><key>PATH</key><string>${xml(caminhos)}</string></dict>`] : []),
      `</dict>`, `</plist>`, ``].join("\n"), "utf8");
  }
  /* no Exec do .desktop a barra invertida passa por DOIS escapes (aspas e
     string), e `%` é código de campo */
  const desktop = (x) => x.startsWith("--") ? x
    : `"${x.replace(/[\\"`$]/g, "\\$&")}"`.replace(/\\/g, "\\\\").replace(/%/g, "%%");
  return Buffer.from([
    `[Desktop Entry]`, `Type=Application`, `Name=Painel da Kapstan`, `Comment=${aviso}`,
    `Exec=${comando.map(desktop).join(" ")}`,
    `Terminal=false`, `NoDisplay=true`, `X-GNOME-Autostart-enabled=true`, ``].join("\n"), "utf8");
}

/** a unidade do systemd de usuário, para quem prefere `systemctl --user enable` ao autostart */
export function conteudoDaUnidade({ comando, caminhos = "" }) {
  /* aspas do systemd: `\` e `"` escapam, `%` é especificador e `$` expande */
  const aspas = (x) => `"${x.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/%/g, "%%").replace(/\$/g, "$$$$")}"`;
  return Buffer.from([
    `# O painel da Kapstan sempre ligado (D243), para quem não tem sessão gráfica.`,
    `# Ligar: systemctl --user enable --now kapstan-painel.service (e apagar o .desktop do autostart)`,
    `[Unit]`, `Description=Painel da Kapstan sempre ligado`, ``,
    `[Service]`, `ExecStart=${comando.map((x) => x.startsWith("--") ? x : aspas(x)).join(" ")}`,
    ...(caminhos ? [`Environment=${aspas("PATH=" + caminhos)}`] : []),
    `Restart=no`, ``,
    `[Install]`, `WantedBy=default.target`, ``].join("\n"), "utf8");
}

/**
 * A chave fixa desta máquina — lida do disco, ou criada na primeira vez.
 *
 * Nunca lança: quem não consegue escrever recebe uma chave de processo e o
 * aviso. Ver a nota do topo sobre por que a degradação é essa.
 */
export async function chaveDaMaquina({ aoRegistrar = () => {} } = {}) {
  const arquivo = join(pastaDaChave(), "chave");
  try {
    const guardada = (await readFile(arquivo, "utf8")).trim();
    if (FORMATO_DA_CHAVE.test(guardada)) return guardada;
    aoRegistrar(`a chave guardada não tem o formato esperado · refazendo`);
  } catch { /* não existe ainda: o caminho normal da primeira execução */ }

  const nova = randomBytes(24).toString("base64url");
  try {
    await mkdir(pastaDaChave(), { recursive: true });
    /* `.tmp` + rename, como todo o resto do repositório: no Windows um
       `writeFile` sobre um arquivo que outro processo tem aberto lança
       `UNKNOWN` de forma intermitente, e dois painéis subindo juntos é o
       caso normal de quem usa dois packs. `mode` é 0600 porque isto é um
       segredo — no Windows o bit é ignorado, e no resto não. */
    await writeFile(arquivo + ".tmp", nova + "\n", { encoding: "utf8", mode: 0o600 });
    await rename(arquivo + ".tmp", arquivo);
    aoRegistrar(`chave desta máquina criada em ${arquivo}`);
  } catch (e) {
    aoRegistrar(`não consegui guardar a chave (${e?.message || e}) · ` +
      "ela vale só enquanto este processo viver");
  }
  return nova;
}

/* ── O BILHETE, e por que ele é derivado e não sorteado ───────────────
   Derivado da chave, o bilhete é o MESMO em toda execução do painel nesta
   máquina — então o cookie sobrevive a fechar o terminal e abrir de novo,
   que é justamente o que faz o endereço curto valer a pena. Sorteado, ele
   morreria com o processo e a pessoa teria de recolar a URL com `#` toda
   vez, que é o defeito que o D230 foi consertar. */
const NOME_DO_COOKIE = "painel_bilhete";
const bilheteDe = (chave) =>
  createHmac("sha256", chave).update("painel:cookie:v1").digest("base64url");

const doCookie = (cabecalho, nome) => {
  for (const parte of String(cabecalho || "").split(";")) {
    const i = parte.indexOf("=");
    if (i < 0) continue;
    if (parte.slice(0, i).trim() === nome) return parte.slice(i + 1).trim();
  }
  return null;
};

/** o corpo de um pedido, com teto — sem teto, um POST grande é um jeito de
    derrubar o processo que segura o painel */
const TETO_DE_CORPO = 2 * 1024 * 1024;
async function corpoDe(req) {
  const pedacos = [];
  let total = 0;
  for await (const p of req) {
    total += p.length;
    if (total > TETO_DE_CORPO) {
      req.destroy();
      throw new Error("corpo acima de 2 MB");
    }
    pedacos.push(p);
  }
  return Buffer.concat(pedacos).toString("utf8");
}

/**
 * Sobe o painel numa porta livre de 127.0.0.1.
 *
 * @param {object} opcoes
 * @param {string} opcoes.html      a página inteira, autocontida
 * @param {object} opcoes.rotas     { "GET /documento": (req,res,url)=>… }
 * @param {string} [opcoes.segredo] a chave. Sem ela, uma por processo — é o
 *                                  que a prova usa, e o que sobra quando o
 *                                  disco recusa guardar a da máquina
 * @returns {Promise<{url:string, curto:string, porta:number, segredo:string,
 *                    fechar:()=>void}>}
 */
export async function abrirPainel({ html, rotas = {}, aoRegistrar = () => {}, segredo }) {
  /* 24 bytes de aleatoriedade criptográfica. Em base64url ela cabe numa URL
     sem escape e não convida ninguém a digitá-la à mão. */
  if (!segredo) segredo = randomBytes(24).toString("base64url");
  const bilhete = bilheteDe(segredo);
  let porta = PORTA_INICIAL;

  const anfitrioesValidos = (p) => new Set([
    `127.0.0.1:${p}`, `localhost:${p}`, `[::1]:${p}`,
  ]);
  const origensValidas = (p) => new Set([
    `http://127.0.0.1:${p}`, `http://localhost:${p}`, `http://[::1]:${p}`,
  ]);

  const servidor = createServer(async (req, res) => {
    const p = porta;
    const negar = (codigo, texto) => {
      res.writeHead(codigo, { "Content-Type": TIPOS[".json"], "Cache-Control": "no-store" });
      res.end(JSON.stringify({ erro: texto }));
    };

    /* ── GUARDA 2 · o `Host` ──────────────────────────────────────────
       Primeira coisa, antes de olhar caminho ou método. Um pedido cujo
       `Host` não é o nosso chegou por um nome que não é o nosso — que é
       precisamente o que o rebinding faz. */
    if (!anfitrioesValidos(p).has(String(req.headers.host || "").toLowerCase())) {
      aoRegistrar(`403 · Host recusado: ${req.headers.host}`);
      return negar(403, "host nao autorizado");
    }

    /* ── GUARDA 3 · o `Origin`, quando ele vem ────────────────────────
       Navegador manda `Origin` em toda escrita e em pedido cruzado. Ausente
       quer dizer "não veio de página" (curl, o próprio agente) — e aí a
       guarda 4, o segredo, é quem decide. */
    const origem = req.headers.origin;
    if (origem && !origensValidas(p).has(String(origem).toLowerCase())) {
      aoRegistrar(`403 · Origin recusada: ${origem}`);
      return negar(403, "origem nao autorizada");
    }

    const url = new URL(req.url, `http://127.0.0.1:${p}`);

    /* ── A PÁGINA ─────────────────────────────────────────────────────
       Ela é pública de propósito: o segredo viaja no FRAGMENTO (`#`), que o
       navegador não manda ao servidor, então pedir segredo para servir o
       HTML tornaria a própria URL impossível de abrir. O que o segredo
       protege são os dados — as rotas abaixo. A página sem eles é uma casca
       vazia.

       `X-Content-Type-Options` e a CSP não são enfeite: a página é
       autocontida (todo o JS e o CSS estão nela), então uma política que
       proíbe buscar qualquer coisa de fora não tira nada e fecha a porta de
       exfiltração — se um dado da base chegar aqui, ele não sai. */
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      /* `html` pode ser uma FUNÇÃO: aí a página é lida a cada pedido, e o
         painel reconstruído aparece com um F5 — sem reiniciar o processo, que
         é o servidor MCP de uma sessão do Claude. São 190 kB de disco local
         por abertura de aba; guardar em memória economizava isso e custava
         fechar o Claude a cada mudança de tela. */
      const corpo = Buffer.from(typeof html === "function" ? await html() : html, "utf8");
      res.writeHead(200, {
        "Content-Type": TIPOS[".html"],
        "Content-Length": corpo.length,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; " +
          "img-src data:; connect-src 'self'; base-uri 'none'; form-action 'none'",
        "Referrer-Policy": "no-referrer",
      });
      return res.end(corpo);
    }

    /* ── GUARDA 4 · a chave, em toda rota de dado ─────────────────────
       Comparação de tempo constante não vale a pena aqui — a chave tem 192
       bits e o atacante não tem o oráculo de repetição que um ataque de
       tempo exige.

       DUAS portas, e as duas são a mesma chave: o cabeçalho, que é o que a
       página manda quando ainda tem o `#` na URL, e o cookie, que é o que
       sobra depois de `POST /entrar`. Sem a segunda, o endereço curto não
       existiria; sem a primeira, a primeira abertura não teria como
       acontecer. */
    const dado = req.headers["x-painel-chave"] || url.searchParams.get("chave");
    const entrou = doCookie(req.headers.cookie, NOME_DO_COOKIE) === bilhete;
    if (dado !== segredo && !entrou) {
      aoRegistrar(`401 · ${req.method} ${url.pathname} sem a chave`);
      return negar(401, "chave ausente ou errada");
    }

    /* ── A TROCA ──────────────────────────────────────────────────────
       Ela mora aqui, no núcleo, e não na tabela de rotas de quem chamou:
       é assunto das guardas, não da aplicação. Chegar até esta linha já
       significa que as quatro passaram — inclusive a `Origin`, que é o que
       impede uma página de outro site de pedir o cookie.

       `Max-Age` de um ano e não cookie de sessão: sem ele, fechar o
       navegador apagaria o cookie e o endereço curto pararia de abrir na
       manhã seguinte — que é exatamente o incômodo que o D230 veio tirar. */
    if (req.method === "POST" && url.pathname === "/entrar") {
      req.resume();                                   // o corpo não interessa
      res.writeHead(200, {
        "Content-Type": TIPOS[".json"],
        "Cache-Control": "no-store",
        "Set-Cookie": `${NOME_DO_COOKIE}=${bilhete}; Max-Age=31536000; ` +
          "Path=/; HttpOnly; SameSite=Strict",
      });
      return res.end(JSON.stringify({ entrou: true }));
    }

    const rota = rotas[`${req.method} ${url.pathname}`];
    if (!rota) return negar(404, `sem rota para ${req.method} ${url.pathname}`);

    try {
      const corpo = req.method === "POST" || req.method === "PUT"
        ? await corpoDe(req) : null;
      const saida = await rota({ url, corpo: corpo ? JSON.parse(corpo) : null, req, res });
      if (res.writableEnded) return;                 // a rota respondeu sozinha
      const texto = Buffer.from(JSON.stringify(saida ?? null), "utf8");
      res.writeHead(200, {
        "Content-Type": TIPOS[".json"],
        "Content-Length": texto.length,
        "Cache-Control": "no-store",
      });
      res.end(texto);
    } catch (e) {
      /* ── O `codigo` DA ROTA VALE MAIS QUE O 500 ─────────────────────
         A leitura da base recusa por três razões diferentes — fora da raiz,
         extensão que não se lê, arquivo que não existe — e as três saíam
         como 500 antes. Um 500 diz "o servidor quebrou", e quem lê a prova
         não consegue distinguir a guarda tendo funcionado de um defeito.
         Ver `nucleo/base.mjs`, que carimba 403, 404 e 413. */
      const codigo = Number(e?.codigo) || 500;
      aoRegistrar(`${codigo} · ${url.pathname} · ${e?.message || e}`);
      if (!res.writableEnded) negar(codigo, String(e?.message || e));
    }
  });

  /* ── SUBIR, ANDANDO DE PORTA EM PORTA ────────────────────────────────
     `EADDRINUSE` é o único erro que faz andar; qualquer outro é defeito de
     verdade e sobe. Sem essa distinção, um erro de permissão viraria doze
     tentativas silenciosas e uma mensagem final que não diz o que houve. */
  await new Promise((resolver, rejeitar) => {
    let restam = TENTATIVAS;
    const tentar = () => {
      servidor.once("error", (e) => {
        if (e.code === "EADDRINUSE" && --restam > 0) {
          /* `livre` pula a porta que o navegador recusa — ver a nota dela lá
             em cima. Sem isso, a décima primeira tentativa cai justamente na
             4190, e o painel sobe num endereço que não abre. */
          porta = livre(porta + 1);
          return tentar();
        }
        rejeitar(e);
      });
      servidor.listen(porta, "127.0.0.1", resolver);   // GUARDA 1
    };
    tentar();
  });

  /* o processo não deve ficar vivo POR CAUSA do servidor: quem manda no
     tempo de vida é o stdin do MCP (ver `protocolo.mjs`). Sem isto, fechar o
     cliente deixaria um node escutando a porta para sempre. */
  servidor.unref();

  return {
    porta,
    segredo,
    /* ANDOU ou não. Quem avisa a pessoa é o `diga` do agente, e ele não pode
       comparar com 4180 na mão: `PAINEL_PORTA` existe, e nessas execuções a
       frase sairia dizendo que 4180 estava ocupada quando ninguém tentou
       4180 — medido, e ele mentiu na primeira vez em que foi usado. */
    andou: porta !== PORTA_INICIAL,
    /* o endereço INTEIRO, que abre sempre — a página troca o `#` por cookie
       na primeira vez —, e o CURTO, que é o que passa a valer depois dela */
    url: `http://127.0.0.1:${porta}/#${segredo}`,
    curto: `http://127.0.0.1:${porta}/`,
    fechar: () => servidor.close(),
  };
}
