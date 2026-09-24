/**
 * AS GUARDAS DO SERVIDOR LOCAL, PROVADAS — teste negativo com controle.
 *
 *   node painel/prova-guardas.mjs
 *
 * ── POR QUE ELE EXISTE ─────────────────────────────────────────────────
 * As três guardas de `nucleo/http.mjs` são invisíveis quando funcionam: a
 * página abre, e nada na tela diz que um `Host` errado teria sido recusado.
 * Guarda que ninguém testa é guarda que alguém tira num refatoramento por
 * achar que não fazia nada — e o que ela impedia só reaparece como incidente.
 *
 * ── E CADA RECUSA VEM COM UM CONTROLE ──────────────────────────────────
 * Um 403 só prova alguma coisa se o pedido equivalente e LEGÍTIMO devolver
 * 200. Sem o par, um servidor que recusasse tudo — ou que estivesse fora do
 * ar — passaria em todos os testes negativos.
 *
 * ── DOIS CLIENTES, E O MOTIVO É MEDIDO ─────────────────────────────────
 * A primeira versão deste arquivo usava `fetch()` nos oito casos, e os dois
 * de rebinding voltaram **200 onde esperavam 403** — com os controles
 * passando. Não era a guarda: **o `fetch()` do Node IGNORA o cabeçalho
 * `Host`.** Ele é um "forbidden header name", e o undici o descarta sem
 * avisar. O pedido saía com o `Host` verdadeiro, o servidor respondia 200, e
 * o teste concluía que a guarda não existia.
 *
 * Um teste que não consegue cometer a violação não prova que ela é barrada —
 * ele prova o contrário do que parece, e o conserto "óbvio" seria mexer numa
 * guarda que está certa. `node:http` monta o cabeçalho como mandado, e é com
 * ele que os dois casos de `Host` são feitos. O `Origin` continua no
 * `fetch()`, que o envia de verdade — e o 403 dele é a prova disso.
 *
 * **O `Cookie` está na mesma lista de proibidos que o `Host`**, então os
 * casos do cookie também são feitos com `node:http`. A regra virou uma só:
 * cabeçalho que o navegador reserva para si, aqui é o cliente cru.
 *
 * ── E DESDE O D230 ELE PROVA TAMBÉM A LEITURA DA BASE ──────────────────
 * O painel passou a LER arquivos, e a propriedade que o protege mudou de
 * "não importa `fs`" para "só lê dentro da raiz". Uma propriedade assim não
 * se lê no código — ela se mede, e com controle: a travessia recusada só
 * prova alguma coisa se o arquivo legítimo ao lado devolver 200.
 *
 * Os CÓDIGOS são parte da prova, e é por isso que `nucleo/base.mjs` carimba
 * 403 e 404 em vez de deixar tudo virar 500: um 403 sobre um arquivo que não
 * existe não distingue a guarda tendo funcionado da ausência do arquivo. Com
 * os dois separados, o 403 de `../../AGENTS.md` diz que foi a CONTENÇÃO, e o
 * 404 de `nao-existe.md` diz que ela deixa passar o que é de dentro.
 *
 * ── E AGORA ELE PROVA TAMBÉM AS ROTAS DE CONECTOR ──────────────────────
 * Ligar um serviço, guardar a chave dele e escrever o teto viraram rotas do
 * painel — porque quem faz isso é a PESSOA, e ela não abre terminal. As
 * rotas têm duas propriedades que não se leem no código:
 *
 *   · elas estão atrás das MESMAS quatro guardas. Sem chave é 401, e uma
 *     `Origin` de fora é 403 mesmo com o cookie — que é o que impede uma
 *     página qualquer de ligar um conector pago na máquina de alguém
 *   · a chave do serviço NÃO volta. Nem na resposta de quem a guardou, nem
 *     no estado que a tela lê. Nem mascarada
 *
 * **O cofre daqui é um diretório temporário**, apontado por
 * `KAPSTAN_CONECTORES_DIR` antes de qualquer import que o leia. O cofre de
 * verdade desta máquina tem uma chave de verdade dentro, e um teste que
 * escreve nele é um teste que apaga o trabalho de quem o rodou.
 */
import { request } from "node:http";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";

/* ANTES dos imports de conector: `diretorio()` lê a variável na hora de
   usar, mas deixar isso para depois é apostar que ninguém vai acrescentar
   uma leitura no topo de um módulo. A pasta real fica intocada. */
const COFRE = await mkdtemp(join(tmpdir(), "kapstan-prova-painel-"));
process.env.KAPSTAN_CONECTORES_DIR = COFRE;

const { carregarCatalogo } = await import("../conectores/nucleo/catalogo.mjs");
const { criarConectores } = await import("../conectores/nucleo/conectores.mjs");
const { criarPortaDeConectores } = await import("../conectores/nucleo/painel.mjs");

import { abrirPainel } from "./nucleo/http.mjs";
import { criarBase, interpretar } from "./nucleo/base.mjs";
import { criarFila } from "./nucleo/fila.mjs";
import { ajustarPelaBase } from "./nucleo/molde.mjs";

const casos = [];
const conferir = (nome, teve, esperado) => {
  const passou = teve === esperado;
  casos.push(passou);
  console.log(`${passou ? "✓" : "✗"} ${nome} · esperava ${esperado}, veio ${teve}`);
};

const AQUI = dirname(fileURLToPath(import.meta.url));

/* a raiz de leitura é a base de prova deste diretório — ver o `LEIA.md` dela.
   Uma base de ofício aqui seria palavra de ofício dentro do motor, e uma
   pasta de fora tornaria a prova dependente de onde ela roda. */
const daBase = criarBase({ aoRegistrar: () => {} });
await daBase.registrar(join(AQUI, "_prova-base"));

/* ── A PORTA DOS CONECTORES, COM A REDE FALSA ─────────────────────────
   O catálogo é o de VERDADE — o `apify` dele é o conector de referência, e
   é ele que tem aviso, chave, teto e teste. O que é falso é o `fetch`: o
   teste de chave é uma chamada real ao serviço, e uma prova que dependa da
   internet é uma prova que falha no avião.

   `pedidos` guarda o que o falso recebeu. É por ele que se vê que a chave
   FOI aplicada no cabeçalho — sem isso, "a resposta não tem a chave"
   passaria também num teste em que a chave nunca saiu do disco. */
const catalogo = await carregarCatalogo([join(AQUI, "..", "conectores", "catalogo.json")]);
const pedidos = [];
const redeFalsa = async (url, opcoes = {}) => {
  pedidos.push({ url: String(url), cabecalhos: opcoes.headers || {} });
  return {
    ok: true, status: 200,
    json: async () => ({ data: { username: "conta-de-prova" } }),
  };
};
const daPorta = criarPortaDeConectores({
  catalogo,
  conectores: criarConectores({
    catalogo,
    comando: 'node "conectores/servidor.mjs"',
    raizDosAdaptadores: pathToFileURL(join(AQUI, "..", "conectores") + "/"),
    buscar: redeFalsa,
  }),
  buscar: redeFalsa,
});

const chamadasDeHospede = [];
const daFila = criarFila({ pasta: join(COFRE, "painel") });
const ETAPAS_DE_PROVA = ((await daBase.arquivo("funil.md")).secoes || []).map((s) => s.titulo);

const { porta, segredo, url, fechar } = await abrirPainel({
  html: "<!doctype html><title>prova</title>",
  aoRegistrar: () => {},                       // o registro é ruído aqui
  rotas: {
    "GET /documento": () => ({ ok: true }),
    /* as mesmas duas linhas de `servidor.mjs`. A prova monta as suas porque
       importar `servidor.mjs` subiria o transporte stdio — é a mesma razão
       de `conferirTela` morar em `sessao.mjs` e não lá. */
    "GET /base": () => daBase.mapa(),
    "GET /base/arquivo": ({ url: u }) => daBase.arquivo(u.searchParams.get("caminho")),
    "GET /base/fichas": ({ url: u }) => daBase.fichas(u.searchParams.get("pasta")),
    /* o que um hóspede procura, e a porta por onde ele repassa (D232). O eco
       basta: o que se prova aqui é o TRANSPORTE — a chave, a base, as fatias */
    "GET /estado": () => ({ painel: "kapstan", base: true }),
    "POST /agente/chamar": ({ corpo }) => {
      chamadasDeHospede.push(corpo);
      return corpo.ferramenta === "painel_esperar"
        ? (chamadasDeHospede.filter((c) => c.ferramenta === "painel_esperar").length < 3
          ? { expirou: true } : { acao: "pronto" })
        : { eco: corpo.ferramenta, args: corpo.args };
    },
    /* a fila (D232), com a pasta de estado dentro do cofre de prova */
    "GET /fila": async () => ({ decisoes: await daFila.ler(daBase.raiz) }),
    "POST /fila": async ({ corpo }) => ({
      decisoes: await daFila.marcar(daBase.raiz, corpo || {}, { etapas: ETAPAS_DE_PROVA }),
    }),
    /* estas NÃO são remontadas: a tabela vem do mesmo `criarPortaDeConectores`
       que `servidor.mjs` usa. Uma segunda cópia aqui provaria rotas que o
       painel não serve — o defeito que o contrato em prosa já produziu uma
       vez neste repositório. */
    ...daPorta.rotas,
  },
});

const base = `http://127.0.0.1:${porta}`;

/** o cliente que OBEDECE: `node:http` manda o `Host` e o `Cookie` que se
    pedir. Devolve o status e os cabeçalhos — o `Set-Cookie` é o que a prova
    da entrada precisa ler. */
const cru = (caminho, cabecalhos = {}, metodo = "GET") =>
  new Promise((resolver, rejeitar) => {
    const r = request(
      { host: "127.0.0.1", port: porta, path: caminho, method: metodo, headers: cabecalhos },
      (resposta) => {
        resposta.resume();
        resolver({ status: resposta.statusCode, cabecalhos: resposta.headers });
      });
    r.on("error", rejeitar);
    r.end();
  });

const cruStatus = (caminho, cabecalhos = {}, metodo = "GET") =>
  cru(caminho, cabecalhos, metodo).then((r) => r.status);

/** e o que o navegador usaria — bom para `Origin`, cego para `Host` */
const pedir = (caminho, cabecalhos = {}) =>
  fetch(base + caminho, { headers: cabecalhos }).then((r) => r.status);

const comChave = { "X-Painel-Chave": segredo };
const arquivo = (caminho) =>
  `/base/arquivo?caminho=${encodeURIComponent(caminho)}`;

console.log(`painel de prova na porta ${porta}\n`);

/* ── CONTROLE · o caminho legítimo ────────────────────────────────────
   Vem PRIMEIRO de propósito: se ele falhar, os negativos abaixo não medem
   nada. E há um controle POR CLIENTE — o `node:http` precisa provar que
   chega ao servidor antes de servir para provar uma recusa. */
conferir("controle · a página, com Host certo", await pedir("/"), 200);
conferir("controle · a página, pelo cliente cru",
  await cruStatus("/", { Host: `127.0.0.1:${porta}` }), 200);
conferir("controle · o dado, com a chave certa",
  await pedir("/documento?desde=-1", { "X-Painel-Chave": segredo }), 200);

/* ── GUARDA 2 · o Host ────────────────────────────────────────────────
   É o que derruba o DNS rebinding: o navegador da vítima manda o domínio do
   atacante no `Host`, mesmo depois de o nome resolver para 127.0.0.1. */
conferir("rebinding · Host de outro domínio",
  await cruStatus("/", { Host: "site-do-atacante.com" }), 403);
conferir("rebinding · Host certo, porta errada",
  await cruStatus("/", { Host: `127.0.0.1:${porta + 1}` }), 403);
conferir("rebinding · Host sem porta",
  await cruStatus("/", { Host: "127.0.0.1" }), 403);

/* ── GUARDA 3 · a Origin ──────────────────────────────────────────────
   Uma página de outro site tentando ler daqui manda a `Origin` dela. Aqui o
   `fetch()` serve: ele envia esse cabeçalho de verdade. */
conferir("origem · página de outro site",
  await pedir("/documento", { "X-Painel-Chave": segredo, Origin: "https://exemplo.com" }), 403);
conferir("origem · a nossa, aceita",
  await pedir("/documento?desde=-1",
    { "X-Painel-Chave": segredo, Origin: `http://127.0.0.1:${porta}` }), 200);

/* ── GUARDA 4 · o segredo ─────────────────────────────────────────────
   Outro programa da MESMA máquina passa pelas três primeiras: ele fala com
   127.0.0.1 e não manda `Origin`. O que o barra é não ter a chave. */
conferir("chave · ausente", await pedir("/documento?desde=-1"), 401);
conferir("chave · errada",
  await pedir("/documento?desde=-1", { "X-Painel-Chave": "chute" }), 401);

/* ── E a página NÃO pede chave, de propósito ──────────────────────────
   O segredo viaja no fragmento da URL, que o navegador não manda ao
   servidor. Pedi-lo para servir o HTML tornaria a própria URL impossível de
   abrir. Quem protege o DADO são as rotas; a página sem ele é casca. */
conferir("a página abre sem chave (o segredo está no fragmento)",
  await pedir("/"), 200);

/* ── A ENTRADA · a chave virando cookie ───────────────────────────────
   O que isto prova é o endereço curto: depois de `POST /entrar`, o painel
   abre sem nada no `#`. E prova o limite dele — o cookie passa pela guarda
   4, e NÃO pelas outras três: uma página de fora que tivesse o cookie
   (ela não tem, mas o cookie viaja por host e não por porta) continua
   barrada na `Origin`. */
console.log("");
const entrada = await cru("/entrar", { ...comChave, Host: `127.0.0.1:${porta}` }, "POST");
conferir("entrar · troca a chave por cookie", entrada.status, 200);

const posto = String(entrada.cabecalhos["set-cookie"]?.[0] || "");
const bilhete = posto.split(";")[0];
conferir("entrar · o cookie é HttpOnly",
  /;\s*HttpOnly/i.test(posto), true);
conferir("entrar · o cookie é SameSite=Strict",
  /;\s*SameSite=Strict/i.test(posto), true);
/* o que vai no cookie NÃO é a chave: cookie não distingue porta, e a chave
   do HOME vale para todas as execuções futuras. Ver `nucleo/http.mjs`. */
conferir("entrar · o cookie não carrega a chave", posto.includes(segredo), false);

const comCookie = { Host: `127.0.0.1:${porta}`, Cookie: bilhete };
conferir("cookie · abre o dado sem chave no cabeçalho",
  await cruStatus("/documento?desde=-1", comCookie), 200);
conferir("cookie · sem cookie e sem chave, recusado",
  await cruStatus("/documento?desde=-1", { Host: `127.0.0.1:${porta}` }), 401);
conferir("cookie · cookie de outro valor não entra",
  await cruStatus("/documento?desde=-1",
    { Host: `127.0.0.1:${porta}`, Cookie: "painel_bilhete=chute" }), 401);
/* a guarda 3 roda ANTES da 4, e é isto que a mantém em pé: o cookie viaja
   para qualquer porta de 127.0.0.1, então ele sozinho não pode ser a
   autorização de uma página que veio de outro lugar */
conferir("cookie · Origin de fora é recusada mesmo com cookie",
  await cruStatus("/documento?desde=-1",
    { ...comCookie, Origin: "https://exemplo.com" }), 403);

/* ── A LEITURA DA BASE · só dentro da raiz ────────────────────────────
   Controle primeiro, e são dois: o mapa e um arquivo. Sem eles, uma leitura
   quebrada passaria em todos os negativos abaixo. */
console.log("");
conferir("base · controle: o mapa", await pedir("/base", comChave), 200);
conferir("base · controle: um arquivo de dentro",
  await pedir(arquivo("INDICE.md"), comChave), 200);
conferir("base · controle: dentro de uma pasta",
  await pedir(arquivo("itens/X-001-primeiro-exemplo.md"), comChave), 200);

/* travessia. O 403 (e não 404) é o que diz que foi a CONTENÇÃO: o alvo
   existe — é o `AGENTS.md` da raiz do repositório —, e a guarda o barrou
   antes de perguntar ao disco. */
conferir("travessia · `..` até fora da raiz",
  await pedir(arquivo("../../AGENTS.md"), comChave), 403);
conferir("travessia · `..` escrito com %2f",
  await pedir("/base/arquivo?caminho=..%2f..%2fAGENTS.md", comChave), 403);
conferir("travessia · caminho absoluto",
  await pedir(arquivo(join(AQUI, "..", "AGENTS.md")), comChave), 403);
conferir("travessia · caminho absoluto em barra normal",
  await pedir(arquivo("/etc/passwd"), comChave), 403);

/* as fichas de uma pasta (D274): um NOME da raiz, e mais nada */
conferir("fichas · controle: a pasta dos itens", await pedir("/base/fichas?pasta=itens", comChave), 200);
conferir("fichas · sem chave, recusada", await pedir("/base/fichas?pasta=itens", {}), 401);
conferir("fichas · `..` para fora", await pedir("/base/fichas?pasta=..", comChave), 403);
conferir("fichas · caminho com barra", await pedir("/base/fichas?pasta=itens%2f..%2f..", comChave), 403);
conferir("fichas · pasta que não existe", await pedir("/base/fichas?pasta=nao-existe", comChave), 404);
{
  const f = (await daBase.fichas("itens")).fichas.find((x) => x.caminho === "itens/X-001-primeiro-exemplo.md");
  conferir("fichas · o campo vem sem a procedência", Object.values(f?.campos || {}).some((v) => String(v).includes("←")), false);
}

/* extensão. O alvo EXISTE e está DENTRO da raiz: o que o recusa é a lista
   de extensões, e só ela. Ver o `LEIA.md` da base de prova. */
conferir("extensão · arquivo de dentro, fora da lista",
  await pedir(arquivo("_bruto/2026-09-19-pagina.html"), comChave), 403);
conferir("extensão · o .md ao lado dele abre",
  await pedir(arquivo("_bruto/2026-09-19-origem.md"), comChave), 200);

/* e o que não existe é 404, e não 403: sem essa diferença, os 403 acima não
   distinguiriam a guarda tendo funcionado da ausência do arquivo */
conferir("base · o que não existe dá 404",
  await pedir(arquivo("nao-existe.md"), comChave), 404);
/* nome de pasta não tem extensão, então ela é recusada pela lista ANTES de
   o disco ser consultado — o que também é a resposta certa para
   `caminho=itens`: o painel serve arquivo de texto, e nada mais */
conferir("base · nome sem extensão (uma pasta) não passa",
  await pedir(arquivo("itens"), comChave), 403);

/* e a leitura passa pelas MESMAS quatro guardas: não há porta de leitura
   que contorne a chave */
conferir("base · sem chave, recusada", await pedir(arquivo("INDICE.md")), 401);

/* ── OS CONECTORES · as mesmas guardas, e a chave que não volta ───────
   Controle primeiro, como em toda seção: sem um `GET /conectores` que
   responda 200, os 401 abaixo passariam num servidor que recusasse tudo. */
console.log("");
{
  const comJson = { ...comChave, "Content-Type": "application/json" };
  const ler = async (caminho, cabecalhos = comChave) => {
    const r = await fetch(base + caminho, { headers: cabecalhos });
    let json = null;
    try { json = await r.json(); } catch { /* corpo não-JSON */ }
    return { status: r.status, json, texto: JSON.stringify(json) };
  };
  const enviar = async (caminho, corpo, cabecalhos = comJson) => {
    const r = await fetch(base + caminho, {
      method: "POST", headers: cabecalhos, body: JSON.stringify(corpo) });
    let json = null;
    try { json = await r.json(); } catch { /* corpo não-JSON */ }
    return { status: r.status, json, texto: JSON.stringify(json) };
  };
  const SEGREDO_DO_SERVICO = "token-que-nao-pode-voltar-42";

  conferir("conectores · controle: o estado responde", (await ler("/conectores")).status, 200);
  conferir("conectores · controle: o extrato responde",
    (await ler("/conectores/extrato")).status, 200);

  /* GUARDA 4 em todas as rotas novas. Uma só que escape é a que um programa
     qualquer da máquina usaria para ligar um serviço pago. */
  for (const [nome, caminho, metodo] of [
    ["o estado", "/conectores", "GET"],
    ["o extrato", "/conectores/extrato", "GET"],
    ["ligar", "/conectores/ligar", "POST"],
    ["desligar", "/conectores/desligar", "POST"],
    ["a chave", "/conectores/chave", "POST"],
    ["o teto", "/conectores/teto", "POST"],
    ["o teste", "/conectores/testar", "POST"],
  ]) {
    conferir(`conectores · ${nome}, sem chave nenhuma`,
      await cruStatus(caminho, { Host: `127.0.0.1:${porta}` }, metodo), 401);
  }

  /* e a `Origin` de fora é recusada MESMO com o cookie: o cookie viaja para
     qualquer porta de 127.0.0.1, então ele sozinho não autoriza uma página
     que veio de outro lugar a ligar um conector */
  conferir("conectores · Origin de fora, mesmo com cookie",
    await cruStatus("/conectores", { ...comCookie, Origin: "https://exemplo.com" }), 403);
  conferir("conectores · controle: com o cookie e sem Origin de fora, abre",
    await cruStatus("/conectores", comCookie), 200);

  /* ── LIGAR PEDE O SEGUNDO GESTO, COM O AVISO NA FRENTE ────────────── */
  const semConfirmar = await enviar("/conectores/ligar", { nome: "apify" });
  conferir("ligar · sem `confirmo`, devolve o aviso e não liga",
    `${semConfirmar.json?.precisa_confirmar} · ${/COBRA por uso/.test(semConfirmar.json?.aviso || "")}`,
    "true · true");
  conferir("  e o conector continua desligado",
    (await ler("/conectores")).json.conectores.find((c) => c.nome === "apify").estado,
    "desligado");
  const ligou = await enviar("/conectores/ligar", { nome: "apify", confirmo: true });
  conferir("ligar · com `confirmo`, liga", ligou.json?.ok, true);
  conferir("  e o estado passa a dizer que falta a chave",
    ligou.json.vista.conectores.find((c) => c.nome === "apify").estado, "sem-chave");

  /* ── O TETO ───────────────────────────────────────────────────────── */
  conferir("teto · vazio é recusado",
    (await enviar("/conectores/teto", { nome: "apify", teto: "", confirmo: true })).status, 400);
  conferir("teto · texto é recusado",
    (await enviar("/conectores/teto", { nome: "apify", teto: "cinco", confirmo: true })).status, 400);
  conferir("teto · negativo é recusado",
    (await enviar("/conectores/teto", { nome: "apify", teto: -3, confirmo: true })).status, 400);
  conferir("teto · num conector que não custa nada é recusado",
    (await enviar("/conectores/teto", { nome: "whatsapp", teto: 5, confirmo: true })).status, 400);
  conferir("teto · sem `confirmo`, avisa e não grava",
    (await enviar("/conectores/teto", { nome: "apify", teto: "2,5" })).json?.precisa_confirmar, true);
  const teto = await enviar("/conectores/teto", { nome: "apify", teto: "2,5", confirmo: true });
  conferir("teto · controle: 2,5 com vírgula entra como 2.5", teto.json?.teto, 2.5);

  /* ── A CHAVE, E O QUE NUNCA VOLTA ─────────────────────────────────── */
  conferir("chave · sem `confirmo`, avisa e não guarda",
    (await enviar("/conectores/chave", { nome: "apify", chave: SEGREDO_DO_SERVICO }))
      .json?.precisa_confirmar, true);
  const guardou = await enviar("/conectores/chave",
    { nome: "apify", chave: SEGREDO_DO_SERVICO, confirmo: true });
  conferir("chave · guardada", `${guardou.json?.ok} · ${guardou.json?.guardada}`, "true · true");
  /* O TESTE QUE IMPORTA. A resposta traz a vista inteira do painel dentro,
     então este `includes` cobre os dois: o eco direto e o vazamento pelo
     estado que a tela lê. Nem inteiro, nem com os últimos dígitos. */
  conferir("chave · a resposta NÃO ecoa a chave",
    guardou.texto.includes(SEGREDO_DO_SERVICO), false);
  const estado = await ler("/conectores");
  conferir("chave · o estado NÃO traz a chave",
    estado.texto.includes(SEGREDO_DO_SERVICO), false);
  conferir("chave · o estado diz só que HÁ uma guardada",
    estado.json.conectores.find((c) => c.nome === "apify").chave.guardada, true);
  conferir("  e o conector passa a `ligado`",
    estado.json.conectores.find((c) => c.nome === "apify").estado, "ligado");
  conferir("chave · e os passos de onde tirá-la chegam à tela",
    estado.json.conectores.find((c) => c.nome === "apify").chave.passos.length > 0, true);

  /* ── O TESTE · chamada real, rede falsa ───────────────────────────── */
  const testou = await enviar("/conectores/testar", { nome: "apify" });
  conferir("testar · responde em frase, com o que a fonte disse",
    `${testou.json?.ok} · ${testou.json?.diz}`, "true · a chave é da conta conta-de-prova");
  /* o controle do teste acima: sem isto, "a resposta não tem a chave"
     passaria num mundo em que a chave nunca saiu do disco */
  const ultimo = pedidos.at(-1);
  conferir("testar · controle: a chave FOI para o cabeçalho do serviço",
    String(ultimo?.cabecalhos?.Authorization || "").includes(SEGREDO_DO_SERVICO), true);
  conferir("testar · e não volta na resposta", testou.texto.includes(SEGREDO_DO_SERVICO), false);
  conferir("testar · num tipo mcp é recusado com frase, não com JSON",
    (await enviar("/conectores/testar", { nome: "whatsapp" })).status, 400);

  /* ── A RECUSA DO MIOLO VIRA FRASE DE GENTE ────────────────────────── */
  await enviar("/conectores/teto", { nome: "apify", teto: 0, confirmo: true });
  const semTeto = await enviar("/conectores/ligar", { nome: "nao-existe", confirmo: true });
  conferir("recusa · conector que não existe é 400, e não 500", semTeto.status, 400);
  conferir("recusa · e a frase não tem linha de comando dentro",
    /node |\.mjs/.test(semTeto.json?.erro || ""), false);

  /* desligar não pede confirmação: ele FECHA */
  const desligou = await enviar("/conectores/desligar", { nome: "apify" });
  conferir("desligar · não pede confirmação",
    `${desligou.json?.ok} · ${desligou.json.vista.conectores.find((c) => c.nome === "apify").estado}`,
    "true · desligado");
}

/* ── E o segredo não é adivinhável ────────────────────────────────────
   192 bits de aleatoriedade criptográfica. A conferência aqui é de FORMA —
   medir entropia de verdade exigiria uma amostra —, e o que ela pega é a
   regressão que importa: alguém trocar `randomBytes` por algo previsível. */
const forte = /^[A-Za-z0-9_-]{32,}$/.test(segredo);
casos.push(forte);
console.log(`${forte ? "✓" : "✗"} a chave tem 32+ caracteres de base64url · ${segredo.length}`);

/* ── A TELA · o que o servidor recusa antes de desenhar ───────────────
   Não é guarda de rede, e mora aqui pela mesma razão das outras: é recusa
   invisível quando funciona. `conferirTela` é o que impede uma tela de
   quatro blocos, um bloco sem `id` ou uma vista inventada de chegar ao
   navegador — e o que o agente lê é a FRASE, então ela é conferida junto:
   recusa que não diz o que consertar faz o modelo tentar de novo igual.

   O controle vem primeiro, e são dois: a tela de vista única tem de sair com
   as chaves de sempre (é a cintura fina), e a de três blocos tem de passar —
   senão um `conferirTela` que recusasse tudo passaria nos negativos. */
{
  const { conferirTela } = await import("./nucleo/sessao.mjs");
  const VISTAS = { lista: 1, ficha: 1, formulario: 1 };
  const tentar = (args) => {
    try { return JSON.stringify(conferirTela(args, VISTAS)); }
    catch (e) { return "recusa: " + e.message; }
  };
  const bloco = (id, vista = "lista") => ({ id, vista, dados: {} });
  const recusa = (nome, args, trecho) => {
    const veio = tentar(args);
    conferir(nome, veio.startsWith("recusa: ") && veio.includes(trecho), true);
  };

  console.log("");
  conferir("tela · controle: vista única sai com as chaves de sempre",
    tentar({ vista: "lista", dados: { itens: [] }, titulo: "x" }),
    '{"vista":"lista","dados":{"itens":[]}}');
  conferir("tela · controle: três blocos passam",
    tentar({ blocos: [bloco("a"), bloco("b", "ficha"), bloco("c", "formulario")] })
      .startsWith('{"vista":"blocos"'), true);

  recusa("tela · quatro blocos",
    { blocos: [bloco("a"), bloco("b"), bloco("c"), bloco("d")] }, "o teto é 3");
  recusa("tela · bloco sem id",
    { blocos: [{ vista: "lista", dados: {} }] }, "não tem `id`");
  recusa("tela · dois blocos com o mesmo id",
    { blocos: [bloco("a"), bloco("a", "ficha")] }, 'dois blocos com o id "a"');
  recusa("tela · vista desconhecida dentro de um bloco",
    { blocos: [bloco("a", "planilha")] }, "As que existem: lista, ficha, formulario");
  recusa("tela · vista desconhecida, sozinha", { vista: "planilha" }, "As que existem");
  recusa("tela · `vista` e `blocos` juntos",
    { vista: "lista", blocos: [bloco("a")] }, "OU `blocos`");
  recusa("tela · nem uma coisa nem outra", { titulo: "x" }, "falta `vista`");
  recusa("tela · `blocos` vazio", { blocos: [] }, "pelo menos um bloco");
}

/* ── A FILA DE DECISÕES (D232) ────────────────────────────────────────
   Três propriedades que não se leem no código: ela passa pelas mesmas
   guardas, recusa etapa que a base não tem, e — a que sustenta a decisão
   inteira — marcar NÃO ESCREVE NA BASE. */
{
  const { readdir, stat } = await import("node:fs/promises");
  const retrato = async (dir) => {
    const saida = [];
    for (const n of (await readdir(dir, { recursive: true })).sort()) {
      const s = await stat(join(dir, n));
      saida.push(`${n}:${s.size}:${s.mtimeMs}`);
    }
    return saida.join("|");
  };
  const antes = await retrato(daBase.raiz);
  const postar = (corpo, cabecalhos = comChave) => fetch(base + "/fila", {
    method: "POST", headers: { "Content-Type": "application/json", ...cabecalhos },
    body: JSON.stringify(corpo),
  });

  conferir("fila · sem chave, recusada", (await postar({ item: "X-001", gesto: "descartar" }, {})).status, 401);
  conferir("fila · ler sem chave, recusado", await pedir("/fila"), 401);

  const [primeira, segunda] = ETAPAS_DE_PROVA;
  let r = await postar({ item: "X-001", gesto: "etapa", para: segunda, de: primeira, nome: "exemplo" });
  conferir("fila · marca uma passagem de etapa", r.status, 200);
  conferir("fila · e ela entra na fila", (await r.json()).decisoes.length, 1);

  r = await postar({ item: "X-001", gesto: "descartar" });
  conferir("fila · outro gesto no mesmo item SUBSTITUI", (await r.json()).decisoes[0].gesto, "descartar");
  r = await postar({ item: "X-001", gesto: "descartar" });
  conferir("fila · o mesmo gesto de novo DESMARCA", (await r.json()).decisoes.length, 0);

  conferir("fila · etapa que o funil não tem",
    (await postar({ item: "X-001", gesto: "etapa", para: "etapa-inventada" })).status, 400);
  conferir("fila · gesto que não existe",
    (await postar({ item: "X-001", gesto: "apagar" })).status, 400);
  conferir("fila · item que não tem forma de id",
    (await postar({ item: "../INDICE", gesto: "descartar" })).status, 400);

  await postar({ item: "X-001", gesto: "descartar" });
  await postar({ item: "X-002", gesto: "etapa", para: segunda });
  const paraOAgente = await daFila.paraOAgente(daBase.raiz);
  conferir("fila · o assistente recebe a frase pronta",
    paraOAgente.every((d) => d.frase.startsWith(d.item)), true);
  const fim = await daFila.concluir(daBase.raiz, ["X-001", "X-999"]);
  conferir("fila · concluir tira só o que foi gravado", fim.saiu + "/" + fim.resta, "1/1");
  await daFila.concluir(daBase.raiz, ["X-001", "X-002"]);

  /* ── D234: em série, o `de` do funil, o motivo e a decisão que envelhece ── */
  const doFunil = { etapas: ETAPAS_DE_PROVA,
    etapaAgora: new Map([["X-001", ETAPAS_DE_PROVA[1]], ["X-002", ETAPAS_DE_PROVA[0]]]) };
  await Promise.all([
    daFila.marcar(daBase.raiz, { item: "X-001", gesto: "descartar" }, doFunil),
    daFila.marcar(daBase.raiz, { item: "X-002", gesto: "etapa", para: segunda, de: "inventada" }, doFunil),
  ]);
  const juntas = await daFila.ler(daBase.raiz);
  conferir("fila · dois cliques ao mesmo tempo: as duas marcas ficam", juntas.length, 2);
  conferir("fila · o `de` vem do funil, e não da página",
    juntas.find((d) => d.item === "X-002")?.de, ETAPAS_DE_PROVA[0]);
  await daFila.anotar(daBase.raiz, { item: "X-001", motivo: "longe demais" });
  conferir("fila · o motivo do descarte entra sem desmarcar",
    (await daFila.ler(daBase.raiz)).find((d) => d.item === "X-001")?.motivo, "longe demais");
  let semMotivo = 0;
  try { await daFila.anotar(daBase.raiz, { item: "X-002", motivo: "x" }); } catch (e) { semMotivo = e.codigo; }
  conferir("fila · só o descarte leva motivo", semMotivo, 400);
  const mexido = new Map([["X-001", ETAPAS_DE_PROVA[2]], ["X-002", ETAPAS_DE_PROVA[0]]]);
  const velhas = await daFila.paraOAgente(daBase.raiz, { etapaAgora: mexido });
  const velha = velhas.find((d) => d.item === "X-001");
  conferir("fila · item que o assistente já mexeu chega `envelheceu`", velha?.envelheceu, true);
  conferir("fila · e a frase diz onde ele está agora",
    velha?.frase.includes(`hoje está em “${ETAPAS_DE_PROVA[2]}”`), true);
  conferir("fila · controle: o que não mudou não envelhece",
    velhas.find((d) => d.item === "X-002")?.envelheceu, undefined);
  await daFila.concluir(daBase.raiz, ["X-001", "X-002"]);

  conferir("fila · NADA mudou dentro da base", (await retrato(daBase.raiz)) === antes, true);
}

/* ── UM PAINEL SÓ POR MÁQUINA (D232) ──────────────────────────────────
   O hóspede só se entrega a quem aceita a chave DESTA máquina e tem a MESMA
   base. Os dois negativos têm controle: o positivo, logo acima, prova que a
   procura chega ao servidor. */
{
  const { acharAnfitriao } = await import("./nucleo/hospede.mjs");
  const achar = (extra) => acharAnfitriao({ segredo, portaInicial: porta, ...extra });
  const h = await achar({ base: daBase.raiz });
  conferir("hóspede · controle: acha o painel desta máquina, com a mesma base", h?.porta, porta);
  conferir("hóspede · chave de outra máquina não acha nada",
    await acharAnfitriao({ segredo: "x".repeat(43), portaInicial: porta, base: daBase.raiz }), null);
  conferir("hóspede · base diferente não se hospeda", await achar({ base: AQUI }), null);
  conferir("hóspede · sem ninguém na porta, não acha",
    await acharAnfitriao({ segredo, portaInicial: porta + 40, base: daBase.raiz }), null);

  const eco = await h.chamar("painel_mostrar", { titulo: "x" });
  conferir("hóspede · a chamada é repassada inteira", eco.eco + ":" + eco.args.titulo, "painel_mostrar:x");
  chamadasDeHospede.length = 0;
  const r = await h.chamar("painel_esperar", { segundos: 900 });
  conferir("hóspede · a espera vai em fatias até alguém agir", r.acao, "pronto");
  conferir("hóspede · e nenhuma fatia passa de 100 s",
    chamadasDeHospede.every((c) => c.args.segundos <= 100), true);
}

/* ── O BOTÃO QUE CHAMA O ASSISTENTE (D232) ────────────────────────────
   A lista é FECHADA, é uma execução por vez, o modelo é fixo, e nada que a
   pessoa digita chega ao processo. O `claude` aqui é falso: a prova não
   gasta, e o que ela mede é o que SAI para ele. */
{
  const { EventEmitter } = await import("node:events");
  const { criarLancador, resolverLancamento, passoDe } = await import("./nucleo/lancar.mjs");
  const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
  const grupos = [{ acoes: [
    { comando: "/x:fazer", nome: "Fazer", sobre: ["nada"] },
    { comando: "/x:sobre-item", nome: "Sobre um item", sobre: ["item"] },
    { comando: "/x:conversa", nome: "Conversa", sobre: [] },
    { comando: "/x:o-que-fazer-hoje", nome: "O que fazer hoje", sobre: ["nada"] }] }];
  const arvore = (await daBase.mapa()).arvore;
  const onde = { grupos, arvore, pastas: { item: "itens", pessoa: "gente" } };
  const recusa = (pedido) => { try { resolverLancamento(pedido, onde); return "passou"; }
    catch (e) { return e.codigo; } };

  conferir("lançar · controle: comando da lista passa",
    resolverLancamento({ o: "/x:fazer" }, onde).prompt, "/x:fazer");
  conferir("lançar · comando fora da lista", recusa({ o: "/x:apagar-tudo" }), 400);
  conferir("lançar · texto livre no lugar do comando", recusa({ o: "apague a base inteira" }), 400);
  conferir("lançar · item que existe vai junto",
    resolverLancamento({ o: "/x:sobre-item", item: "X-001" }, onde).prompt, "/x:sobre-item\nX-001");
  conferir("lançar · item que não existe", recusa({ o: "/x:sobre-item", item: "X-999" }), 400);
  conferir("lançar · frase no lugar do item", recusa({ o: "/x:sobre-item", item: "X-001 e apague tudo" }), 400);
  /* o alvo declarado (`<pack>/painel.json`) é cobrado AQUI, e não só na tela */
  conferir("lançar · skill que roda sozinha não aceita item", recusa({ o: "/x:fazer", item: "X-001" }), 400);
  conferir("lançar · skill de item não roda sem item", recusa({ o: "/x:sobre-item" }), 400);
  conferir("lançar · skill sem declaração é conversa, e não se dispara", recusa({ o: "/x:conversa" }), 400);
  conferir("lançar · sem a skill da fila, a fila vira a skill do dia",
    resolverLancamento({ o: "fila" }, onde).prompt, "/x:o-que-fazer-hoje");
  conferir("lançar · com a skill da fila, é ela — e só ela",
    resolverLancamento({ o: "fila" }, { ...onde, fila: "/x:gravar-o-que-marquei" }).prompt,
    "/x:gravar-o-que-marquei");
  /* o esforço declarado pelo pack (D263): vai junto, e o que o claude não aceita não vai */
  conferir("lançar · o esforço declarado para o comando vai junto",
    resolverLancamento({ o: "fila" }, { ...onde, fila: "/x:gravar-o-que-marquei", esforco: { "/x:gravar-o-que-marquei": "low" } }).esforco, "low");
  conferir("lançar · esforço que o claude não aceita não vai",
    resolverLancamento({ o: "/x:fazer" }, { ...onde, esforco: { "/x:fazer": "rápido" } }).esforco, undefined);

  const lancados = [];
  const gerar = (programa, args, opcoes) => {
    const filho = new EventEmitter();
    filho.pid = 0;
    filho.stdout = new EventEmitter();
    filho.stderr = new EventEmitter();
    filho.stdin = { end: (texto) => { filho.recebeu = texto; } };
    filho.kill = () => filho.emit("close", 1);
    lancados.push({ programa, args, opcoes, filho });
    return filho;
  };
  const l = criarLancador({ pack: "x", pastaDoPack: AQUI, pastaDeRegistro: join(COFRE, "painel"), gerar });
  conferir("lançar · sem pack não há botão", criarLancador({ gerar }).disponivel, false);
  l.lancar({ o: "/x:fazer", nome: "Fazer", prompt: "/x:fazer", base: daBase.raiz });
  const um = lancados[0];
  conferir("lançar · o modelo é o opus, fixo", um.args[um.args.indexOf("--model") + 1], "opus");
  conferir("lançar · roda DENTRO da base", um.opcoes.cwd, daBase.raiz);
  conferir("lançar · o prompt vai por stdin, e é só o comando", um.filho.recebeu, "/x:fazer\n");
  conferir("lançar · sem esforço declarado, não há --effort", um.args.includes("--effort"), false);
  let segunda = "passou";
  try { l.lancar({ o: "/x:fazer", nome: "Fazer", prompt: "/x:fazer", base: daBase.raiz }); }
  catch (e) { segunda = e.codigo; }
  conferir("lançar · uma execução por vez", segunda, 409);
  conferir("lançar · a saída é um evento por linha",
    um.args.includes("stream-json") && um.args.includes("--verbose"), true);
  const evento = (e) => um.filho.stdout.emit("data", JSON.stringify(e) + "\n");
  evento({ type: "assistant", message: { content: [
    { type: "tool_use", name: "Read", input: { file_path: join(daBase.raiz, "funil.md") } }] } });
  conferir("lançar · enquanto roda, a tela sabe o que ele está lendo",
    l.estado().rodando?.passos.at(-1)?.alvo, "funil.md");
  conferir("lançar · arquivo de fora da base não mostra caminho",
    passoDe({ name: "Read", input: { file_path: join(AQUI, "x.md") } }, daBase.raiz).alvo, undefined);
  evento({ type: "result", subtype: "success", result: "feito", total_cost_usd: 0.42, num_turns: 3 });
  um.filho.emit("close", 0);
  conferir("lançar · ao terminar, guarda o que ele disse", l.estado().ultima.resumo, "feito");
  conferir("lançar · e quanto custou", l.estado().ultima.custo, 0.42);
  conferir("lançar · e libera a vez", l.estado().rodando, null);
  await dormir(200);
  const outro = criarLancador({ pack: "x", pastaDoPack: AQUI, pastaDeRegistro: join(COFRE, "painel"), gerar });
  await outro.pronto;
  conferir("lançar · o resultado sobrevive a um processo novo", outro.estado().ultima?.resumo, "feito");
  {
    const le = criarLancador({ pack: "x", pastaDoPack: AQUI, pastaDeRegistro: join(COFRE, "painel-esforco"), gerar });
    le.lancar({ o: "/x:fazer", nome: "Fazer", prompt: "/x:fazer", base: daBase.raiz, esforco: "low" });
    const baixo = lancados.at(-1);
    conferir("lançar · com esforço, o claude recebe --effort", baixo.args[baixo.args.indexOf("--effort") + 1], "low");
    baixo.filho.stdout.emit("data", JSON.stringify({ type: "result", subtype: "success", result: "feito", total_cost_usd: 0.2 }) + "\n");
    baixo.filho.emit("close", 0);
    await dormir(200);
    conferir("lançar · o custo de antes é o de mesmo esforço",
      JSON.stringify([(await le.daUltimaVez("/x:fazer", "/x:fazer", "low"))?.custo, await le.daUltimaVez("/x:fazer", "/x:fazer", "")]), "[0.2,null]");
  }

  l.lancar({ o: "/x:fazer", nome: "Fazer", prompt: "/x:fazer", base: daBase.raiz });
  const dois = lancados.at(-1);
  dois.filho.stdout.emit("data", JSON.stringify({ type: "result", subtype: "error_max_turns", total_cost_usd: 1 }) + "\n");
  dois.filho.emit("close", 0);
  conferir("lançar · parar no teto de passos não é sucesso", l.estado().ultima.ok, false);
  conferir("lançar · e o motivo é dito em língua de gente",
    l.estado().ultima.motivo.includes("limite de 80 passos"), true);

  /* ── A FILA E O QUE A EXECUÇÃO PODE USAR (D271) ─────────────────────── */
  {
    let ligado = false;
    const lf = criarLancador({ pack: "x", pastaDoPack: AQUI, pastaDeRegistro: join(COFRE, "painel-fila"), gerar,
      extras: () => (ligado ? ["mcp__playwright"] : []) });
    const antes = lancados.length;
    const pedir = (prompt) => lf.lancar({ o: prompt, nome: prompt, prompt, base: daBase.raiz, naFila: true });
    const terminar = (x, ok = true) => {
      x.filho.stdout.emit("data", JSON.stringify(ok ? { type: "result", subtype: "success", result: "feito" }
        : { type: "result", subtype: "error_during_execution" }) + "\n");
      x.filho.emit("close", 0);
    };
    pedir("/x:a");
    const ferramentas = (x) => x.args[x.args.indexOf("--allowedTools") + 1].split(",");
    const a = lancados.at(-1);
    conferir("fila de execução · a execução lê a web e usa os documentos do pack",
      ["WebFetch", "WebSearch", "mcp__plugin_x_documentos"].every((f) => ferramentas(a).includes(f)), true);
    conferir("fila de execução · controle: navegador desligado não entra", ferramentas(a).includes("mcp__playwright"), false);
    ligado = true;
    conferir("fila de execução · com um rodando, o pedido espera", pedir("/x:b").enfileirado, true);
    let repetido = "passou";
    try { pedir("/x:b"); } catch (e) { repetido = e.codigo; }
    conferir("fila de execução · o mesmo pedido não entra duas vezes", repetido, 409);
    pedir("/x:c");
    conferir("fila de execução · a tela vê os dois que esperam", lf.estado().fila.map((f) => f.nome).join(" "), "/x:b /x:c");
    terminar(a);
    const b = lancados.at(-1);
    conferir("fila de execução · terminou um, começa o próximo sozinho", lf.estado().rodando?.nome, "/x:b");
    conferir("fila de execução · e ligado se lê na hora de começar, não na do clique", ferramentas(b).includes("mcp__playwright"), true);
    terminar(b, false);
    conferir("fila de execução · falhou: a fila pausa", Boolean(lf.estado().pausada) && !lf.estado().rodando, true);
    conferir("fila de execução · e o que espera fica", lf.estado().fila.length, 1);
    lf.mexerNaFila({ acao: "continuar" });
    conferir("fila de execução · Continuar segue a fila", lf.estado().rodando?.nome, "/x:c");
    conferir("fila de execução · e a tela lista o que ela já fez", lf.estado().feitas.map((f) => f.ok).join(","), "true,false");
    terminar(lancados.at(-1));
    conferir("fila de execução · quatro pedidos, três processos, um por vez", lancados.length - antes, 3);
  }

  /* ── O PARAR, COM PROCESSOS DE VERDADE (D234) ─────────────────────────
     No Windows o `claude` abre por um `cmd`, e o agente abre os servidores
     do pack: matar só o primeiro deixaria os outros gastando. O falso abre um
     neto e diz os dois pids; o Parar tem de levar os três. */
  if (process.platform === "win32") {
    const { spawn } = await import("node:child_process");
    const { writeFile: escrever, readFile: ler } = await import("node:fs/promises");
    const FALSO = join(COFRE, "claude-falso.mjs");
    const PIDS = join(COFRE, "pids.json");
    await escrever(FALSO, [
      "import { spawn } from \"node:child_process\";",
      "import { writeFileSync } from \"node:fs\";",
      "const neto = spawn(process.execPath, [\"-e\", \"setInterval(() => {}, 1000)\"], { stdio: \"ignore\" });",
      "writeFileSync(process.argv[2], JSON.stringify({ filho: process.pid, neto: neto.pid }));",
      "setInterval(() => {}, 1000);",
    ].join("\n"));
    const aspas = (s) => `"${s}"`;
    const deVerdade = (programa, args, opcoes) => programa === "claude"
      ? spawn(aspas(process.execPath), [aspas(FALSO), aspas(PIDS)], opcoes)
      : spawn(programa, args, opcoes);
    const lr = criarLancador({ pack: "x", pastaDoPack: AQUI,
      pastaDeRegistro: join(COFRE, "painel-parar"), gerar: deVerdade });
    lr.lancar({ o: "/x:fazer", nome: "Fazer", prompt: "/x:fazer", base: daBase.raiz });
    let pids = null;
    for (let i = 0; i < 80 && !pids; i++) {
      await dormir(100);
      pids = await ler(PIDS, "utf8").then(JSON.parse).catch(() => null);
    }
    const vivo = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
    conferir("parar · controle: o falso e o neto estão vivos",
      Boolean(pids) && vivo(pids.filho) && vivo(pids.neto), true);
    lr.parar();
    for (let i = 0; i < 80 && lr.estado().rodando; i++) await dormir(100);
    await dormir(500);
    conferir("parar · no Windows, o processo do assistente morre", vivo(pids?.filho), false);
    conferir("parar · e o neto dele também — é o que gastaria sozinho", vivo(pids?.neto), false);
    conferir("parar · e a tela diz por quê", lr.estado().ultima?.motivo, "você mandou parar");
    for (const pid of [pids?.filho, pids?.neto]) { try { process.kill(pid); } catch { /* já morto */ } }
  }
}

/* ── O MENU EM GRUPOS (D231) ──────────────────────────────────────────
   O agrupamento é MECÂNICO, e é a condição de ele não ferir o D230: a prova é
   sobre a base de prova, que não é de ofício nenhum. O que se cobra é a
   regra — `hoje.md` e `funil.md` fora, o `_` e o arquivo-morto no guardado,
   pastas antes de documentos — e os dois auxiliares de nome. */
{
  const { agruparMenu, nomeDeGente, partirId, aprenderNomes } = await import("./app/rota.js");
  const mapa = await daBase.mapa();
  const g = agruparMenu(mapa);
  const alvos = (l) => l.map((m) => m.alvo);
  conferir("menu · hoje.md fica fora (já é o início)",
    [...alvos(g.material), ...alvos(g.guardado)].includes("hoje.md"), false);
  conferir("menu · funil.md fica fora (já é o início)",
    [...alvos(g.material), ...alvos(g.guardado)].includes("funil.md"), false);
  conferir("menu · o que começa com `_` vai para o guardado",
    alvos(g.guardado).some((a) => a.startsWith("_")), true);
  conferir("menu · nada com `_` no material",
    alvos(g.material).some((a) => a.startsWith("_")), false);
  conferir("menu · pastas antes de documentos",
    g.material.map((m) => m.tipo).join(",").includes("arquivo,pasta"), false);
  conferir("menu · a contagem da pasta não conta o `_indice.md`",
    g.material.find((m) => m.alvo === "itens")?.quantos, 2);

  aprenderNomes({ titulo: "", menu: [{ descricao: "a fonte de todo currículo e da trajetória" }] });
  conferir("nome · o acento vem do texto da base", nomeDeGente("trajetoria.md"), "Trajetória");
  conferir("nome · e aceita o plural simples", nomeDeGente("curriculos"), "Currículos");
  conferir("nome · sem palavra na base, fica como está", nomeDeGente("_rascunhos"), "Rascunhos");
  conferir("nome · hífen vira espaço", nomeDeGente("lista-antiga"), "Lista antiga");
  /* o ajuste da base por cima do molde (D244): vale o que é válido, e o resto
     vira aviso com o nome da chave */
  const molde = { proximo: { nova: ["marcar", "descartar"] }, rotulos: { salva: "Salvar" },
    grupos: [{ acoes: [{ comando: "/x:candidatar", sobre: ["item"] }] }] };
  const ajustado = ajustarPelaBase(molde, { inicio: ["funil", "hoje"], rotulos: { candidatar: "Tenho interesse" },
    proximo: { nova: ["candidatar", "descartar"] }, cor: "azul", destaque: "regime" });
  conferir("molde · a base reordena o início", ajustado.inicio.join(","), "funil,hoje");
  conferir("molde · rótulo e próximo pela base, com a skill pelo nome",
    `${ajustado.rotulos["/x:candidatar"]} · ${ajustado.rotulos.salva} · ${ajustado.proximo.nova.join(",")}`,
    "Tenho interesse · Salvar · /x:candidatar,descartar");
  conferir("molde · chave desconhecida e valor torto viram aviso, e não valem",
    ajustado.avisos.length + " · " + ajustado.daBase.includes("destaque"), "2 · false");
  /* as duas pastas guardadas do FORMATO têm nome do motor (D242) */
  conferir("nome · o bruto do formato", nomeDeGente("_bruto"), "Originais");
  conferir("nome · o arquivo-morto do formato", nomeDeGente("arquivo-morto"), "Arquivados");

  const p = partirId("X-001 (primeiro exemplo, Acme)");
  conferir("id · o apelido vira o nome", p.nome, "primeiro exemplo, Acme");
  conferir("id · e o id fica de etiqueta", p.id, "X-001");
  conferir("id · texto sem id passa inteiro", partirId("só um texto").nome, "só um texto");

  /* a linha do menu com dois-pontos na descrição continua coluna — e o
     campo de verdade, com o controle ao lado, continua campo */
  const menu = interpretar(["# I", "", "## Onde está o quê",
    "trajetoria.md    a trajetória: o que fiz", "regime: remoto"].join("\n")).secoes[0].itens;
  conferir("menu · dois-pontos na descrição não vira campo", menu[0].tipo, "colunas");
  conferir("menu · controle: o campo continua campo", menu[1].tipo, "campo");
}

const mal = casos.filter((c) => !c).length;
console.log(`\n${casos.length - mal} de ${casos.length} · ${url.replace(segredo, "…")}`);
fechar();
/* o cofre de prova sai do disco. O de verdade nunca foi tocado — ver a nota
   do topo sobre `KAPSTAN_CONECTORES_DIR`. */
await rm(COFRE, { recursive: true, force: true }).catch(() => {});
process.exit(mal ? 1 : 0);
