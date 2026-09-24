/**
 * OS CONECTORES, PROVADOS — teste negativo com controle, sem rede.
 *
 *   node conectores/prova.mjs            tudo contra servidores falsos locais
 *   node conectores/prova.mjs --rede     e mais as fontes públicas de verdade
 *
 * ── POR QUE ELE EXISTE ─────────────────────────────────────────────────
 * Tudo o que este diretório promete é RECUSA — não gastar acima do teto, não
 * deixar o agente escolher o host, não atropelar o ritmo da fonte —, e recusa
 * que funciona é invisível: a chamada boa passa, e nada na tela diz que a
 * ruim teria sido barrada. Guarda que ninguém exercita é a que some num
 * refatoramento por parecer que não fazia nada.
 *
 * ── E CADA RECUSA VEM COM O SEU CONTROLE ───────────────────────────────
 * A regra do `painel/prova-guardas.mjs`, inteira: uma recusa só prova alguma
 * coisa se o pedido equivalente e LEGÍTIMO passar. O caso que mais importa
 * aqui é o do segundo servidor, o `intruso`: ele tem de terminar com ZERO
 * pedidos recebidos — e antes disso tem de responder 200 a um pedido direto,
 * porque um servidor que não subiu também termina com zero.
 *
 * ── O QUE FICA DE FORA, E ESTÁ DITO ────────────────────────────────────
 * O adaptador da Apify é provado contra um servidor que IMITA a API, escrito
 * a partir da documentação. Os nomes dos campos da corrida não foram vistos
 * numa resposta de verdade — não havia token em 19/09/2026. O que a prova
 * garante é a mecânica: dois passos, o custo medido no livro, a falha que
 * custou.
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const COM_REDE = process.argv.includes("--rede");

/* o cofre é lido da variável a CADA chamada, então ela pode ser escrita
   aqui, antes do primeiro uso — e a prova nunca encosta no cofre da pessoa */
process.env.KAPSTAN_CONECTORES_DIR = await mkdtemp(join(tmpdir(), "conectores-prova-"));

const { carregarCatalogo, conferirCatalogo } = await import("./nucleo/catalogo.mjs");
const { criarConectores } = await import("./nucleo/conectores.mjs");
const { projetar, montarUrl } = await import("./nucleo/chamada.mjs");
const { lerCartoes } = await import("./adaptadores/linkedin-vagas.mjs");
const cofre = await import("./nucleo/cofre.mjs");
const { lerLivro } = await import("./nucleo/livro.mjs");

const casos = [];
const conferir = (nome, teve, esperado) => {
  const passou = teve === esperado;
  casos.push(passou);
  console.log(`${passou ? "✓" : "✗"} ${nome}` + (passou ? "" : ` · esperava ${JSON.stringify(esperado)}, veio ${JSON.stringify(teve)}`));
};
/** a palavra-chave da recusa, que é o que o `conectores.md` promete ao agente */
const recusa = async (promessa) => {
  try { await promessa; return "PASSOU"; } catch (e) { return String(e.message); }
};
const comeca = (texto, chave) => (String(texto).startsWith(chave) ? chave : texto);
const titulo = (t) => console.log(`\n── ${t}`);

/* ═══ OS DOIS SERVIDORES FALSOS ═══════════════════════════════════════ */

const recebidos = [];
const fonte = createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  recebidos.push({ metodo: req.method, caminho: url.pathname, consulta: url.search,
    autorizacao: req.headers.authorization || "" });
  const json = (status, corpo) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(corpo));
  };
  let m;
  if ((m = url.pathname.match(/^\/v1\/boards\/([^/]+)\/jobs$/))) {
    if (decodeURIComponent(m[1]) !== "acme") return json(404, { erro: "não existe" });
    return json(200, { jobs: [
      { id: 1, title: "Gerente de Produto Sênior", company_name: "Acme",
        location: { name: "Remoto · Brasil" }, absolute_url: "https://exemplo.test/1",
        first_published: "2026-09-10T12:00:00-03:00",
        content: "&lt;p&gt;Descri&amp;ccedil;&amp;atilde;o com &lt;strong&gt;marca&amp;ccedil;&amp;atilde;o&lt;/strong&gt;.&lt;/p&gt;&lt;ul&gt;&lt;li&gt;um&lt;/li&gt;&lt;li&gt;dois&lt;/li&gt;&lt;/ul&gt;" },
      { id: 2, title: "Pessoa Engenheira de Dados", company_name: "Acme",
        location: { name: "Belo Horizonte" }, absolute_url: "https://exemplo.test/2",
        first_published: 1757505600000, content: "x".repeat(900) },
    ] });
  }
  if (url.pathname === "/segredo") return json(200, { vazou: true });
  if (url.pathname === "/pago") return json(200, { itens: [{ id: "a" }] });
  if ((m = url.pathname.match(/^\/v2\/acts\/([^/]+)\/runs$/)) && req.method === "POST") {
    const falha = decodeURIComponent(m[1]).startsWith("falha~");
    return json(201, { data: { id: falha ? "r-falha" : "r-boa",
      status: falha ? "FAILED" : "SUCCEEDED",
      usageTotalUsd: falha ? 0.02 : 0.123, defaultDatasetId: "d1" } });
  }
  if (url.pathname === "/v2/datasets/d1/items") return json(200, [{ titulo: "item da corrida" }]);
  return json(404, { erro: "rota desconhecida" });
});

let pedidosAoIntruso = 0;
const intruso = createServer((req, res) => { pedidosAoIntruso++; res.writeHead(200); res.end("intruso"); });

const subir = (s) => new Promise((r) => s.listen(0, "127.0.0.1", () => r(s.address().port)));
const P = await subir(fonte);
const PI = await subir(intruso);
const BASE = `http://127.0.0.1:${P}`;

/* ═══ O CATÁLOGO DA PROVA ═════════════════════════════════════════════
   Aponta para os servidores falsos — e é por isso que o endereço é do
   CATÁLOGO e não do agente: aqui quem escolhe o host é este arquivo. */
const catalogo = {
  fonte: {
    tipo: "http", oque: "o quadro falso", custo: { modelo: "gratis" }, ritmo: { porMinuto: 12 },
    operacoes: { buscar: {
      url: `${BASE}/v1/boards/<empresa>/jobs`, consulta: { content: "true" },
      parametros: { empresa: { oque: "a empresa", obrigatorio: true }, termo: {}, limite: {} },
      lista: "jobs",
      campos: { id: "id", titulo: "title", empresa: "company_name", local: "location.name",
        remoto: { de: "location.name", contem: "remot" }, link: "absolute_url",
        publicada: "first_published", descricao: "content" },
      html: ["descricao"], datas: ["publicada"], filtra: ["titulo"],
      corta: { descricao: 600 }, limite: 50,
    } },
  },
  lenta: {
    tipo: "http", oque: "a de ritmo curto", custo: { modelo: "gratis" }, ritmo: { porMinuto: 3 },
    operacoes: { buscar: { url: `${BASE}/pago`, parametros: {}, lista: "itens", campos: { id: "id" } } },
  },
  estimada: {
    tipo: "http", oque: "paga, sem o serviço dizer quanto",
    custo: { modelo: "estimado", moeda: "USD", estimativa: 0.1 },
    operacoes: { buscar: { url: `${BASE}/pago`, parametros: { q: {} }, lista: "itens", campos: { id: "id" } } },
  },
  "apify-falsa": {
    tipo: "http", oque: "a Apify de mentira", base: BASE,
    aviso: "cobra por uso", chave: { nome: "APIFY_TOKEN", como: "cabecalho Authorization: Bearer <chave>" },
    custo: { modelo: "medido", moeda: "USD", estimativa: 0.05, porItem: 0.005 },
    adaptador: "adaptadores/apify.mjs",
    operacoes: { rodar: { parametros: { ator: { obrigatorio: true }, entrada: {}, limite: {} }, limite: 100 } },
  },
  conversa: { tipo: "mcp", oque: "outro servidor", prova: "estado_da_ponte", guia: "conectar-x.md" },
};

let relogio = Date.parse("2026-09-19T12:00:00Z");
const con = criarConectores({
  catalogo, comando: 'node "servidor.mjs"',
  agora: () => relogio,
  raizDosAdaptadores: pathToFileURL(AQUI + "/"),
});

/* ═══ 1 · O CATÁLOGO ══════════════════════════════════════════════════ */
titulo("o catálogo");
conferir("o da prova é válido", conferirCatalogo(catalogo).length, 0);
{
  const real = await carregarCatalogo([join(AQUI, "catalogo.json"),
    join(AQUI, "_prova", "conectores.json")]);
  conferir("controle · base + vagas fundem sem erro, com dez conectores", Object.keys(real).length, 10);
  conferir("nome repetido entre camadas é erro",
    comeca(await recusa(carregarCatalogo([join(AQUI, "catalogo.json"), join(AQUI, "catalogo.json")])), "catálogo"),
    "catálogo");
  conferir("pago sem estimativa é acusado ao subir",
    conferirCatalogo({ x: { tipo: "http", oque: "x", custo: { modelo: "medido", moeda: "USD" },
      operacoes: { a: { url: "https://a.test/", parametros: {} } } } }).length, 1);
  conferir("parâmetro usado e não declarado é acusado ao subir",
    conferirCatalogo({ x: { tipo: "http", oque: "x", custo: { modelo: "gratis" },
      operacoes: { a: { url: "https://a.test/<quem>" } } } }).length, 1);
}

/* ═══ 2 · O AGENTE NÃO ESCOLHE O HOST ═════════════════════════════════ */
titulo("o endereço é do catálogo (SSRF)");
{
  const boa = await con.chamar({ conector: "fonte", operacao: "buscar", parametros: { empresa: "acme" } });
  conferir("controle · o parâmetro legítimo chega e volta com itens", boa.itens.length, 2);
  conferir("controle · e chegou no caminho esperado", recebidos.at(-1).caminho, "/v1/boards/acme/jobs");
  conferir("controle · o intruso está de pé e responde",
    (await fetch(`http://127.0.0.1:${PI}/`)).status, 200);
  pedidosAoIntruso = 0;

  const tentar = (empresa) => recusa(con.chamar({ conector: "fonte", operacao: "buscar", parametros: { empresa } }));
  conferir("`..` é recusado antes da rede", comeca(await tentar(".."), "parâmetro recusado"), "parâmetro recusado");
  conferir("`.` é recusado antes da rede", comeca(await tentar("."), "parâmetro recusado"), "parâmetro recusado");

  const antes = recebidos.length;
  conferir("travessia por barra vira 404 da fonte, não outra rota",
    await tentar("x/../../../segredo"), "o serviço respondeu 404 — confira o nome que entra no endereço");
  conferir("  e o que chegou foi UM segmento codificado", recebidos.at(-1).caminho.includes("%2F"), true);
  conferir("  e a rota /segredo nunca foi tocada",
    recebidos.slice(antes).some((r) => r.caminho === "/segredo"), false);

  await tentar(`@127.0.0.1:${PI}/`);
  await tentar(`acme#@127.0.0.1:${PI}`);
  await tentar(`127.0.0.1:${PI}\\`);
  await tentar(`acme?x=1&host=127.0.0.1:${PI}`);
  conferir("quatro tentativas de trocar o host: o intruso recebeu zero pedidos", pedidosAoIntruso, 0);
  conferir("  e a consulta forjada não virou consulta",
    recebidos.at(-1).consulta, "?content=true");

  conferir("parâmetro que a operação não declara é recusado",
    comeca(await recusa(con.chamar({ conector: "fonte", operacao: "buscar",
      parametros: { empresa: "acme", url: `http://127.0.0.1:${PI}/` } })), "parâmetro desconhecido"),
    "parâmetro desconhecido");
  conferir("a origem montada é conferida contra a do modelo",
    montarUrl({ url: `${BASE}/a/<p>`, parametros: {} }, { p: "b" }).origin, BASE);
}

/* ═══ 3 · A PROJEÇÃO ══════════════════════════════════════════════════ */
titulo("o que volta vem enxuto");
{
  const { itens } = await con.chamar({ conector: "fonte", operacao: "buscar", parametros: { empresa: "acme" } });
  conferir("HTML escapado duas vezes vira texto", itens[0].descricao, "Descrição com marcação.\n· um\n· dois");
  conferir("data ISO com fuso sai AAAA-MM-DD", itens[0].publicada, "2026-09-10");
  conferir("data em milissegundos sai AAAA-MM-DD", itens[1].publicada, "2025-09-10");
  conferir("`{ de, contem }` vira booleano · verdadeiro", itens[0].remoto, true);
  conferir("`{ de, contem }` vira booleano · falso", itens[1].remoto, false);
  conferir("descrição longa é cortada e MARCADA", itens[1].cortado === true && itens[1].descricao.length === 601, true);
  conferir("a curta não leva a marca", "cortado" in itens[0], false);

  const filtrada = await con.chamar({ conector: "fonte", operacao: "buscar",
    parametros: { empresa: "acme", termo: "engenheiro, senior" } });
  conferir("`termo` filtra pelo título, sem acento e com alternativas", filtrada.itens.length, 1);
  conferir("  e diz de quantas o filtro partiu", filtrada.total, 2);
  conferir("resposta sem a lista esperada é dita como mudança de formato",
    comeca(await recusa(Promise.resolve().then(() => projetar({ lista: "jobs" }, { outra: [] }))),
      "a resposta da fonte não trouxe a lista"), "a resposta da fonte não trouxe a lista");
  conferir("cartão do LinkedIn: id, título, link sem rastreio e data",
    JSON.stringify(lerCartoes(`<li><div data-entity-urn="urn:li:jobPosting:42">
      <a class="base-card__full-link x" href="https://www.linkedin.com/jobs/view/pm-at-x-42?position=1&amp;refId=abc">z</a>
      <h3 class="base-search-card__title"> PM &amp; Growth </h3>
      <h4 class="base-search-card__subtitle"><a href="#"> Acme </a></h4>
      <span class="job-search-card__location"> Porto Alegre </span>
      <time class="job-search-card__listdate--new" datetime="2026-09-14">x</time></div></li>`)[0]),
    JSON.stringify({ id: "42", titulo: "PM & Growth", empresa: "Acme", local: "Porto Alegre", remoto: null,
      link: "https://www.linkedin.com/jobs/view/pm-at-x-42", publicada: "2026-09-14", descricao: null }));
}

/* ═══ 4 · O RITMO ═════════════════════════════════════════════════════ */
titulo("o ritmo");
{
  const chamar = () => recusa(con.chamar({ conector: "lenta", operacao: "buscar" }));
  conferir("controle · as três primeiras do minuto passam",
    [await chamar(), await chamar(), await chamar()].join(), "PASSOU,PASSOU,PASSOU");
  const antes = recebidos.length;
  conferir("a quarta é `devagar`, com os segundos", comeca(await chamar(), "devagar"), "devagar");
  conferir("  e ela NÃO tocou a rede", recebidos.length, antes);
  relogio += 61_000;
  conferir("um minuto depois, passa de novo", await chamar(), "PASSOU");
}

/* ═══ 5 · O GASTO ═════════════════════════════════════════════════════ */
titulo("o gasto");
{
  const p = { ator: "alguem~coletor", limite: 10 };
  const chamada = (extra = {}) => ({ conector: "apify-falsa", operacao: "rodar", parametros: p, ...extra });

  conferir("nasce desligado, porque tem aviso e chave",
    comeca(await recusa(con.orcar(chamada())), "desligado"), "desligado");
  await cofre.ligar("apify-falsa", true);
  conferir("ligado sem chave é `sem-chave`", comeca(await recusa(con.orcar(chamada())), "sem-chave"), "sem-chave");
  await cofre.guardarChave("apify-falsa", "segredo-da-prova");
  conferir("com chave e SEM teto escrito: `sem teto`", comeca(await recusa(con.orcar(chamada())), "sem teto"), "sem teto");
  conferir("  e o `chamar` direto diz o mesmo, não “falta orçamento”",
    comeca(await recusa(con.chamar(chamada())), "sem teto"), "sem teto");

  await cofre.escreverTeto("apify-falsa", 1);
  const antes = recebidos.length;
  conferir("pago sem orçamento é recusado",
    comeca(await recusa(con.chamar(chamada())), "orçamento ausente"), "orçamento ausente");
  conferir("orçamento inventado é recusado",
    comeca(await recusa(con.chamar(chamada({ orcamento: "chute" }))), "orçamento ausente"), "orçamento ausente");

  const o1 = await con.orcar(chamada());
  conferir("o orçamento soma a base e o por-item", o1.estimativa, 0.1);
  conferir("  e diz quanto sobra do teto", `${o1.resta} de ${o1.teto_do_mes} ${o1.moeda}`, "1 de 1 USD");
  conferir("com OUTROS parâmetros ele não vale",
    comeca(await recusa(con.chamar({ ...chamada({ orcamento: o1.orcamento }), parametros: { ...p, limite: 99 } })),
      "orçamento de outra chamada"), "orçamento de outra chamada");
  relogio += 11 * 60_000;
  conferir("onze minutos depois, venceu",
    comeca(await recusa(con.chamar(chamada({ orcamento: o1.orcamento }))), "orçamento vencido"), "orçamento vencido");
  conferir("  e nenhuma dessas recusas tocou a rede", recebidos.length, antes);

  const o2 = await con.orcar({ ...chamada(), parametros: { limite: 10, ator: "alguem~coletor" } });
  const boa = await con.chamar(chamada({ orcamento: o2.orcamento }));
  conferir("controle · com orçamento válido (chaves em outra ordem) a chamada passa", boa.itens.length, 1);
  conferir("o custo é o MEDIDO pelo serviço, não a estimativa", `${boa.custo} ${boa.medido}`, "0.123 true");
  conferir("  e o que resta desconta o medido", boa.resta, 0.877);
  conferir("a chave viajou no cabeçalho, nos dois passos",
    recebidos.slice(-2).every((r) => r.autorizacao === "Bearer segredo-da-prova"), true);
  conferir("o limite do teto foi repassado à corrida como segundo cinto",
    recebidos.at(-2).consulta.includes("maxTotalChargeUsd=1"), true);
  conferir("o mesmo orçamento não paga duas chamadas",
    comeca(await recusa(con.chamar(chamada({ orcamento: o2.orcamento }))), "orçamento ausente"), "orçamento ausente");

  /* a falha que custou */
  const pf = { ator: "falha~coletor", limite: 1 };
  const o3 = await con.orcar({ conector: "apify-falsa", operacao: "rodar", parametros: pf });
  conferir("corrida que falha é erro dito",
    comeca(await recusa(con.chamar({ conector: "apify-falsa", operacao: "rodar", parametros: pf, orcamento: o3.orcamento })),
      "a corrida terminou como FAILED"), "a corrida terminou como FAILED");
  const livro = (await lerLivro()).linhas.filter((l) => l.conector === "apify-falsa");
  conferir("  e o que ela custou ESTÁ no livro", `${livro.at(-1).custo} ${livro.at(-1).ok}`, "0.02 false");
  conferir("a chave não está no livro", JSON.stringify(livro).includes("segredo-da-prova"), false);

  await cofre.escreverTeto("apify-falsa", 0.15);
  conferir("teto de 0,15 com 0,143 gastos: `acima do teto`, no orçamento",
    comeca(await recusa(con.orcar(chamada())), "acima do teto"), "acima do teto");
  await cofre.escreverTeto("apify-falsa", 1);
  conferir("controle · com o teto de volta, o mesmo orçamento sai",
    typeof (await con.orcar(chamada())).orcamento, "string");

  /* o modelo `estimado`, em que o serviço não diz quanto */
  await cofre.escreverTeto("estimada", 1);
  const oe = await con.orcar({ conector: "estimada", operacao: "buscar", parametros: {} });
  const re = await con.chamar({ conector: "estimada", operacao: "buscar", parametros: {}, orcamento: oe.orcamento });
  conferir("sem custo medido, o livro guarda a estimativa e DIZ que é estimativa",
    `${re.custo} ${re.medido}`, "0.1 false");

  const ext = await con.extrato();
  const daApify = ext.por_conector.find((x) => x.conector === "apify-falsa");
  conferir("o extrato soma sucesso e falha", `${daApify.gasto} em ${daApify.chamadas}, ${daApify.falhas} falha`, "0.143 em 2, 1 falha");
  conferir("  e lista só as que custaram", ext.pagas.length, 3);

  conferir("tipo mcp não se chama por aqui",
    comeca(await recusa(con.chamar({ conector: "conversa", operacao: "x" })), "conversa é do tipo mcp"), "conversa é do tipo mcp");
  conferir("conector que não existe", comeca(await recusa(con.chamar({ conector: "nada", operacao: "x" })),
    "conector desconhecido"), "conector desconhecido");
  const est = (await con.estado()).conectores;
  conferir("o estado do tipo mcp é `prove`, com a ferramenta",
    `${est.find((x) => x.nome === "conversa").estado} ${est.find((x) => x.nome === "conversa").prova}`, "prove estado_da_ponte");
}

/* ═══ 6 · AS DUAS PORTAS DO PROCESSO DE VERDADE ═══════════════════════ */
titulo("o processo: a CLI do humano e o stdio do agente");
{
  const rodar = (args, entrada = "") => new Promise((resolver) => {
    const f = spawn(process.execPath, [join(AQUI, "servidor.mjs"), ...args], { env: process.env });
    let saida = "", erro = "";
    f.stdout.on("data", (d) => { saida += d; });
    f.stderr.on("data", (d) => { erro += d; });
    f.on("close", (codigo) => resolver({ codigo, saida, erro }));
    f.stdin.end(entrada);
  });

  conferir("a chave em argumento é RECUSADA", (await rodar(["chave", "apify", "abc123"])).codigo, 1);
  const c = await rodar(["chave", "apify"], "token-pelo-teclado\n");
  conferir("controle · pelo teclado ela entra", c.codigo, 0);
  conferir("  e não é ecoada em lugar nenhum", (c.saida + c.erro).includes("token-pelo-teclado"), false);
  conferir("  e foi parar no cofre", (await cofre.lerChaves()).apify, "token-pelo-teclado");
  conferir("teto sem valor é recusado", (await rodar(["teto", "apify"])).codigo, 1);
  conferir("teto de conector gratuito é recusado",
    (await rodar(["--catalogo", join(AQUI, "_prova", "conectores.json"), "teto", "gupy", "5"])).codigo, 1);
  const ligou = await rodar(["ligar", "apify"]);
  conferir("`ligar` mostra o aviso no ato", ligou.saida.includes("COBRA por uso"), true);

  /* e o stdio: handshake, a lista, e uma chamada */
  const resposta = await new Promise((resolver) => {
    const f = spawn(process.execPath, [join(AQUI, "servidor.mjs")], { env: process.env });
    const vistas = [];
    let resto = "";
    f.stdout.on("data", (d) => {
      resto += d;
      const linhas = resto.split("\n");
      resto = linhas.pop();
      for (const l of linhas) if (l.trim()) vistas.push(JSON.parse(l));
      if (vistas.length === 3) { f.stdin.end(); resolver(vistas); }
    });
    const mandar = (m) => f.stdin.write(JSON.stringify({ jsonrpc: "2.0", ...m }) + "\n");
    mandar({ id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", clientInfo: { name: "prova" } } });
    mandar({ method: "notifications/initialized" });
    mandar({ id: 2, method: "tools/list" });
    mandar({ id: 3, method: "tools/call", params: { name: "conectores_estado", arguments: {} } });
  });
  const porId = Object.fromEntries(resposta.map((r) => [r.id, r]));
  conferir("o stdout só tem mensagem MCP (três linhas, três JSON)", resposta.length, 3);
  conferir("as quatro ferramentas, e nenhuma que ligue, guarde chave ou mude teto",
    porId[2].result.tools.map((t) => t.name).sort().join(),
    "conectores_chamar,conectores_estado,conectores_extrato,conectores_orcar");
  const apify = porId[3].result.structuredContent.conectores.find((x) => x.nome === "apify");
  conferir("o estado reflete o que a CLI escreveu: ligado, com chave, e sem teto no `como_ligar`",
    `${apify.estado} · ${/ teto apify /.test(apify.como_ligar)}`, "ligado · true");
  conferir("a chave não aparece no que o agente lê",
    JSON.stringify(porId[3]).includes("token-pelo-teclado"), false);
}

/* ═══ 7 · A REDE DE VERDADE ═══════════════════════════════════════════ */
/* ── AS SESSÕES DO NAVEGADOR (D272) ─────────────────────────────────────
   Entrar uma vez e todo agente usar. O que se prova: o pack acrescenta sites
   ao navegador e só isso; o estado sai de nome e validade; a janela lê os
   cookies de um Chrome DE VERDADE (sem tela, com perfil de prova) e grava só
   os do site; e o valor do cookie não aparece em nenhuma resposta. */
{
  titulo("sessões do navegador");
  const { writeFile: escrever, readFile: lerArquivo } = await import("node:fs/promises");
  process.env.KAPSTAN_NAVEGADOR_DIR = await mkdtemp(join(tmpdir(), "navegador-prova-"));
  const sessoesMod = await import("./nucleo/sessoes.mjs");
  const { criarPortaDeConectores } = await import("./nucleo/painel.mjs");

  const base = join(AQUI, "catalogo.json");
  const camada = join(process.env.KAPSTAN_NAVEGADOR_DIR, "camada.json");
  const site = { rotulo: "Exemplo", entrar: "https://exemplo.test/entrar", dominios: ["exemplo.test"], sinal: ["sessao"] };
  await escrever(camada, JSON.stringify({ navegador: { "sessoes+": { exemplo: site } } }));
  const cat = await carregarCatalogo([base, camada]);
  conferir("sessões · o pack acrescenta o site ao navegador", Object.keys(cat.navegador.sessoes || {}).join(), "exemplo");
  await escrever(camada, JSON.stringify({ navegador: { "sessoes+": { exemplo: site }, oque: "outro" } }));
  conferir("sessões · e não redefine o resto do navegador",
    (await recusa(carregarCatalogo([base, camada]))).includes("só pode acrescentar"), true);
  const torto = { navegador: { ...cat.navegador, sessoes: { exemplo: { ...site, entrar: "http://exemplo.test", sinal: [] } } } };
  const errosTortos = conferirCatalogo(torto).join(" | ");
  conferir("sessões · entrar sem https é recusado", errosTortos.includes("https"), true);
  conferir("sessões · e sem cookie de sinal também", errosTortos.includes("`sinal`"), true);
  conferir("sessões · controle: o site certo passa", conferirCatalogo({ navegador: cat.navegador }).length, 0);

  const agora = Date.parse("2026-09-23T12:00:00Z");
  const s = (name, domain, expires) => ({ name, value: "V", domain, path: "/", expires });
  const est = (cookies) => sessoesMod.estadoDasSessoes({ exemplo: site }, { cookies }, agora).exemplo.estado;
  conferir("sessões · controle: sem cookie, sem sessão", est([]), "sem-sessao");
  conferir("sessões · o cookie de sinal no domínio é logado", est([s("sessao", ".exemplo.test", agora / 1000 + 3600)]), "logada");
  conferir("sessões · vencido é vencida", est([s("sessao", ".exemplo.test", agora / 1000 - 1)]), "vencida");
  conferir("sessões · o mesmo nome em outro domínio não conta", est([s("sessao", ".alheio.test", agora / 1000 + 3600)]), "sem-sessao");
  conferir("sessões · subdomínio conta", est([s("sessao", "www.exemplo.test", -1)]), "logada");

  /* o arquivo é do Playwright, e trocar um site não encosta nos outros */
  const outroSite = { dominios: ["alheio.test"] };
  await sessoesMod.trocarCookiesDoSite(outroSite, [s("fica", ".alheio.test", -1)]);
  await sessoesMod.trocarCookiesDoSite(site, [s("sessao", ".exemplo.test", -1)]);
  await sessoesMod.trocarCookiesDoSite(site, []);
  const nomes = (await sessoesMod.lerSessoes()).cookies.map((c) => c.name).join();
  conferir("sessões · sair de um site deixa o outro no arquivo", nomes, "fica");

  /* o navegador dos agentes lê o arquivo? só pelo `args` do ~/.claude.json */
  const claudeJson = join(process.env.KAPSTAN_NAVEGADOR_DIR, "claude.json");
  process.env.KAPSTAN_CLAUDE_JSON = claudeJson;
  await escrever(claudeJson, JSON.stringify({ mcpServers: { playwright: { command: "x", args: ["--isolated"] } } }));
  conferir("sessões · controle: --isolated sozinho não usa", await sessoesMod.agentesUsamAsSessoes(), false);
  await escrever(claudeJson, JSON.stringify({ mcpServers: { playwright: { command: "x",
    args: ["--isolated", "--storage-state", sessoesMod.arquivoDasSessoes()] } } }));
  conferir("sessões · com --storage-state no arquivo, usa", await sessoesMod.agentesUsamAsSessoes(), true);

  /* ── A JANELA, COM UM CHROME DE VERDADE ─────────────────────────────
     Os dois tempos do login. A janela da pessoa abre SEM porta de depuração
     (o Google recusa entrar com ela — medido em 23/09); a prova acrescenta a
     porta e o `--headless=new` só para pôr o cookie como o site o poria, e
     fecha pela porta, com gentileza. O que se prova de verdade é o segundo
     tempo: o cookie que ficou no DISCO do perfil é lido por outro processo. */
  const { acharNavegador } = await import("../documentos/nucleo/imprimir.mjs");
  if (!acharNavegador()) {
    console.log("  (sem Chrome, Edge ou Chromium nesta máquina: a janela não se prova aqui)");
  } else {
    const { abrirCdp } = await import("./nucleo/cdp.mjs");
    const filhos = [];
    const pedidos = [];
    const gerar = (programa, args, opcoes) => {
      pedidos.push(args);
      const extra = args.includes("--headless=new") ? [] : ["--headless=new", "--remote-debugging-port=0"];
      const f = spawn(programa, [...extra, ...args], opcoes);
      filhos.push(f);
      return f;
    };
    let daJanela = null;
    const janelas = sessoesMod.criarJanelas({ definicoes: { exemplo: site }, acharNavegador, gerar,
      fecharJanela: () => { daJanela?.enviar("Browser.close").catch(() => {}); } });
    const porta = criarPortaDeConectores({ catalogo: { navegador: { ...cat.navegador, sessoes: { exemplo: site } } },
      conectores: { estado: async () => ({ mes: "2026-09", conectores: [{ nome: "navegador", tipo: "mcp", estado: "prove" }] }) },
      janelas });
    const rota = porta.rotas["POST /conectores/sessao"];
    const vistaDoSite = async () => (await porta.rotas["GET /conectores"]()).conectores[0].sessoes.sites[0];
    const SEGREDO = "valor-que-nao-pode-sair-" + Date.now();
    try {
      const aberta = await rota({ corpo: { nome: "exemplo", acao: "entrar" } });
      conferir("janela · abre", aberta.aberta, true);
      conferir("janela · a da pessoa abre SEM porta de depuração — com ela o Google recusa entrar",
        pedidos[0].some((a) => a.startsWith("--remote-debugging-port")), false);
      const portaArq = join(process.env.KAPSTAN_NAVEGADOR_DIR, "perfil", "DevToolsActivePort");
      let linhas = [];
      for (let i = 0; i < 240 && linhas.length < 2; i++) {   // 60 s: a primeira abertura no CI passou de 15
        await new Promise((r) => setTimeout(r, 250));
        linhas = (await lerArquivo(portaArq, "utf8").catch(() => "")).split(/\r?\n/).filter(Boolean);
      }
      if (linhas.length < 2) throw new Error("o navegador não escreveu o DevToolsActivePort em 60 s");
      daJanela = await abrirCdp(`ws://127.0.0.1:${linhas[0]}${linhas[1]}`);
      const validade = Math.round(Date.now() / 1000) + 30 * 86400;
      await daJanela.enviar("Storage.setCookies", { cookies: [
        { name: "sessao", value: SEGREDO, domain: ".exemplo.test", path: "/", expires: validade, secure: true, httpOnly: true },
        { name: "rastreio", value: SEGREDO, domain: ".alheio.test", path: "/", expires: validade }] });
      conferir("janela · enquanto aberta, a tela diz para entrar e fechar", (await vistaDoSite()).janela, "aberta");
      conferir("janela · e ainda não há sessão: o login é lido ao fechar", (await vistaDoSite()).estado, "sem-sessao");
      const fim = await rota({ corpo: { nome: "exemplo", acao: "concluir" } });
      conferir("janela · “Já entrei” fecha e acha o login no disco do perfil", fim.logada, true);
      conferir("janela · e a resposta não leva o valor", JSON.stringify(fim).includes(SEGREDO), false);
      conferir("janela · e não há mais janela", janelas.estado(), null);
      const noSite = await vistaDoSite();
      conferir("janela · a tela diz logada, com a validade", noSite.estado === "logada" && Boolean(noSite.ate), true);
      conferir("janela · a tela NÃO leva o valor do cookie",
        JSON.stringify(await porta.rotas["GET /conectores"]()).includes(SEGREDO), false);
      const noArquivo = (await sessoesMod.lerSessoes()).cookies;
      conferir("janela · controle: o arquivo tem o cookie, com o valor", noArquivo.some((c) => c.name === "sessao" && c.value === SEGREDO), true);
      conferir("janela · só os do site — o de outro domínio não entra", noArquivo.some((c) => c.name === "rastreio"), false);
      conferir("janela · no formato do Playwright", noArquivo.find((c) => c.name === "sessao")?.sameSite, "Lax");
      const saiu = await rota({ corpo: { nome: "exemplo", acao: "sair" } });
      conferir("janela · sair tira o site", saiu.sessoes.sites[0].estado, "sem-sessao");
      /* o perfil é de um Chrome por vez: com ele aberto por fora, o segundo
         entregaria o pedido ao primeiro e sairia — e a janela que a pessoa
         fechasse não seria de ninguém */
      const deFora = spawn(acharNavegador(), ["--headless=new",
        `--user-data-dir=${join(process.env.KAPSTAN_NAVEGADOR_DIR, "perfil")}`, "about:blank"], { stdio: "ignore" });
      filhos.push(deFora);
      await new Promise((r) => setTimeout(r, 2500));
      conferir("janela · com o perfil aberto por outro Chrome, recusa e diz para fechar",
        (await recusa(rota({ corpo: { nome: "exemplo", acao: "entrar" } }))).includes("Feche-a"), true);
      conferir("janela · e não fica janela pendurada", janelas.estado(), null);
      conferir("janela · site que o pack não declarou é recusado",
        (await recusa(rota({ corpo: { nome: "banco", acao: "entrar" } }))).includes("não está entre"), true);
    } finally {
      daJanela?.fechar();
      for (const f of filhos) { try { f.kill(); } catch { /* já fechou */ } }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  await rm(process.env.KAPSTAN_NAVEGADOR_DIR, { recursive: true, force: true }).catch(() => {});
}

if (COM_REDE) {
  titulo("as fontes públicas, de verdade");
  const real = await carregarCatalogo([join(AQUI, "catalogo.json"),
    join(AQUI, "_prova", "conectores.json")]);
  const vivo = criarConectores({ catalogo: real, comando: "node servidor.mjs",
    raizDosAdaptadores: pathToFileURL(AQUI + "/") });
  await cofre.ligar("linkedin-vagas", true);
  const CAMPOS = "id,titulo,empresa,local,remoto,link,publicada,descricao";
  for (const [conector, parametros] of [
    ["gupy", { termo: "product manager", modo: "remote", limite: 3 }],
    ["greenhouse", { empresa: "vtex", limite: 3 }],
    ["ashby", { empresa: "ramp", termo: "product", limite: 3 }],
    /* o quadro de demonstração do próprio Lever: nenhuma das empresas-alvo
       testadas em 19/09 tinha quadro lá, e sem um que responda não há prova */
    ["lever", { empresa: "leverdemo", limite: 3 }],
    ["linkedin-vagas", { termo: "product manager", modo: "remoto", limite: 3 }],
  ]) {
    try {
      const r = await vivo.chamar({ conector, operacao: "buscar", parametros });
      conferir(`${conector} · respondeu com itens (${r.itens.length} de ${r.total ?? "?"})`, r.itens.length > 0, true);
      conferir(`${conector} · os oito campos, com os mesmos nomes`,
        Object.keys(r.itens[0]).filter((k) => k !== "cortado").join(), CAMPOS);
      conferir(`${conector} · a data sai AAAA-MM-DD`, /^\d{4}-\d{2}-\d{2}$/.test(r.itens[0].publicada || ""), true);
      for (const it of r.itens) {
        console.log(`    ${it.publicada} · ${it.titulo} — ${it.empresa} · ${it.local}` +
          ` · remoto:${it.remoto}\n      ${it.link}`);
      }
    } catch (e) {
      conferir(`${conector} · respondeu`, e.message, "itens");
    }
  }
  try {
    const lista = await vivo.chamar({ conector: "linkedin-vagas", operacao: "buscar",
      parametros: { termo: "product manager", limite: 1 } });
    const d = await vivo.chamar({ conector: "linkedin-vagas", operacao: "detalhe", parametros: { id: lista.itens[0].id } });
    conferir("linkedin-vagas · o detalhe traz a descrição", (d.itens[0].descricao || "").length > 200, true);
    console.log(`    ${d.itens[0].titulo} — ${d.itens[0].empresa}\n      ${d.itens[0].descricao.slice(0, 160).replace(/\n/g, " ")}…` +
      `\n      critérios: ${JSON.stringify(d.itens[0].criterios)}`);
  } catch (e) {
    conferir("linkedin-vagas · o detalhe respondeu", e.message, "descrição");
  }
}

const mal = casos.filter((c) => !c).length;
console.log(`\n${casos.length - mal} de ${casos.length}` + (COM_REDE ? "" : " · sem rede (rode com --rede para as fontes de verdade)"));
fonte.close(); intruso.close();
await rm(process.env.KAPSTAN_CONECTORES_DIR, { recursive: true, force: true }).catch(() => {});
process.exit(mal ? 1 : 0);
