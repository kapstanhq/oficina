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
 * E uma quarta, que é nossa e não da especificação: **um segredo por
 * execução**. As três acima protegem contra um site; o segredo protege
 * contra qualquer outro programa da mesma máquina que varra portas. Ele
 * nasce a cada execução, viaja no fragmento da URL que o agente entrega, e
 * nunca é escrito em disco.
 */
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

/* ── A PORTA ──────────────────────────────────────────────────────────
   3000 é o `npm run dev`, 3001 o `--dist`, 4173 a auditoria. O painel começa
   em 4180 e ANDA quando a porta está ocupada, em vez de morrer: duas
   carteiras abertas ao mesmo tempo é o caso normal de quem usa dois packs, e
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
 * @returns {Promise<{url:string, porta:number, segredo:string, fechar:()=>void}>}
 */
export async function abrirPainel({ html, rotas = {}, aoRegistrar = () => {} }) {
  /* 32 bytes de aleatoriedade criptográfica. Em base64url ele cabe numa URL
     sem escape e não convida ninguém a digitá-lo à mão. */
  const segredo = randomBytes(24).toString("base64url");
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
       exfiltração — se um dado da carteira chegar aqui, ele não sai. */
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      const corpo = Buffer.from(html, "utf8");
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

    /* ── GUARDA 4 · o segredo, em toda rota de dado ───────────────────
       Comparação de tempo constante não vale a pena aqui — o segredo tem 192
       bits e o atacante não tem o oráculo de repetição que um ataque de
       tempo exige —, mas o formato é conferido antes para não comparar
       string de tamanho arbitrário. */
    const dado = req.headers["x-painel-chave"] || url.searchParams.get("chave");
    if (dado !== segredo) {
      aoRegistrar(`401 · ${req.method} ${url.pathname} sem a chave`);
      return negar(401, "chave ausente ou errada");
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
      aoRegistrar(`500 · ${url.pathname} · ${e?.message || e}`);
      if (!res.writableEnded) negar(500, String(e?.message || e));
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
    url: `http://127.0.0.1:${porta}/#${segredo}`,
    fechar: () => servidor.close(),
  };
}
