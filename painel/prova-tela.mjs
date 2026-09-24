/**
 * A PROVA DA TELA (D234) — o Chrome percorre o painel como a pessoa percorre.
 *
 * As outras duas provas medem o servidor. Esta mede o que só um navegador vê:
 * a página abre sem erro no console, cada tela da casa e cada uma das sete
 * vistas desenha, nada rola para o lado — a 1300 px e a 390, que é o
 * telefone —, a gaveta abre e fecha, a fila aparece e some, e o botão que
 * chama o assistente PEDE CONFIRMAÇÃO (a prova nunca confirma: não gasta).
 *
 * Roda com o estado do painel e o cofre em pasta temporária, sobre CÓPIAS da
 * base de prova: nada desta máquina é tocado. As capturas vão para
 * `proc/prova-tela/`, que o git ignora — são para olhar, não para guardar.
 *
 *   node painel/prova-tela.mjs            (CHROME=<caminho> se não for o padrão)
 */
import { spawn } from "node:child_process";
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { acharNavegador } from "../documentos/nucleo/imprimir.mjs";
import { compilarPainel } from "../scripts/svelte-build-painel.mjs";
import { juntarPainel } from "../scripts/painel.mjs";
import { packsDoMarketplace, vistasDoPack } from "../scripts/vistas-do-pack.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME || acharNavegador();
const CAPTURAS = join(AQUI, "..", "proc", "prova-tela");
const TEMP = await mkdtemp(join(tmpdir(), "kapstan-prova-tela-"));
const casos = [];
const conferir = (nome, teve, esperado) => {
  const passou = teve === esperado;
  casos.push(passou);
  console.log(`${passou ? "✓" : "✗"} ${nome} · esperava ${esperado}, veio ${teve}`);
};
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── AS DUAS BASES: a de prova, e uma sem item nenhum (o começo) ───────── */
const BASE = join(TEMP, "base");
const VAZIA = join(TEMP, "vazia");
await cp(join(AQUI, "_prova-base"), BASE, { recursive: true });
await cp(join(AQUI, "_prova-base"), VAZIA, { recursive: true });
for (const n of await readdir(join(VAZIA, "itens"))) {
  if (n !== "_indice.md") await rm(join(VAZIA, "itens", n));
}
/* o agente apontou o próximo passo do X-002 na linha do funil (D235): a
   skill vem na frente do que o pack declarou, e o resto da frase é a nota */
const FUNIL = join(BASE, "funil.md");
await writeFile(FUNIL, (await readFile(FUNIL, "utf8"))
  .replace("· próximo: julgar", "· próximo: sobre-item — a nota do agente"));

/* ── O PACK DE MENTIRA: a lista do que se pede, com o começo declarado ── */
const PACK = join(TEMP, "pack");
await mkdir(join(PACK, "painel"), { recursive: true });
await writeFile(join(PACK, "painel", "acoes.json"), JSON.stringify({
  pack: "x", pastas: { item: "itens", pessoa: "" }, fila: "/x:gravar-o-que-marquei",
  comeco: ["/x:perfil", "/x:buscar"],
  destaque: ["preço", "nota", "regime"],
  resumo: ["O que ele pede"],
  motivos: ["longe demais", "caro demais"],
  rotulos: { "em andamento": "Começar", "/x:completar": "Completar informações" },
  completar: "/x:completar",
  documentos: { documentos: "curriculo" },
  proximo: { "por julgar": ["marcar", "descartar", "/x:buscar"],
    "em andamento": ["marcar", "/x:sobre-item", "descartar"] },
  /* a terceira camada (D267): a vista que só este pack tem, e um texto trocado */
  vistas: { contagem: "a contagem de prova: dados { itens: [{ rotulo, n }] }" },
  textos: { integracoes: "Serviços ligados" },
  grupos: [{ rotulo: "", acoes: [
    { comando: "/x:perfil", nome: "Escrever o perfil", oque: "O que você procura", sobre: [] },
    { comando: "/x:buscar", nome: "Buscar", oque: "Busca nas fontes", sobre: ["nada"] },
    { comando: "/x:sobre-item", nome: "Sobre um item", oque: "Age sobre um item", sobre: ["item"] },
    { comando: "/x:completar", nome: "Completar a ficha", oque: "Procura o que falta", sobre: ["item"] },
  ] }],
}));

/* o modelo de documento de verdade, do pack de vagas: a prévia do painel (D270) */
await cp(join(AQUI, "..", "documentos", "_prova", "documentos", "modelos"), join(PACK, "documentos", "modelos"), { recursive: true });

/* a página DO PACK, com a vista de `_prova-pack/painel/componentes/` dentro:
   o mesmo caminho do `npm run painel`, e o servidor a serve por `--pack` */
await compilarPainel({ pack: join(AQUI, "_prova-pack"), saida: join(TEMP, "entrada-do-pack.js") });
await writeFile(join(PACK, "painel", "painel.html"), await juntarPainel(join(TEMP, "entrada-do-pack.js")));

const servidor = spawn(process.execPath, [join(AQUI, "servidor.mjs"), "--pack", PACK], {
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, KAPSTAN_PAINEL_DIR: join(TEMP, "painel"),
    KAPSTAN_CONECTORES_DIR: join(TEMP, "cofre"), PAINEL_PORTA: "4296" },
});
servidor.stderr.on("data", () => {});
let buf = ""; const espera = new Map();
servidor.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) {
  const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (!l) continue;
  const m = JSON.parse(l);
  if (m.id !== undefined && espera.has(m.id)) { espera.get(m.id)(m); espera.delete(m.id); } } });
let n = 0;
const pedir = (method, params) => new Promise((ok) => { const id = ++n; espera.set(id, ok);
  servidor.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n"); });
const chamar = async (name, args = {}) => {
  const r = await pedir("tools/call", { name, arguments: args });
  try { return JSON.parse(r.result?.content?.[0]?.text); } catch { return r; }
};
await pedir("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "prova-tela", version: "0" } });
servidor.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

const inicio = await chamar("painel_inicio", { base: BASE });
const url = inicio.painel;
const origem = new URL(url).origin;

const navegador = await chromium.launch({ executablePath: CHROME });
const contexto = await navegador.newContext({ viewport: { width: 1300, height: 900 } });
const pagina = await contexto.newPage();
const erros = [];
pagina.on("pageerror", (e) => erros.push(String(e?.message || e)));
pagina.on("console", (m) => { if (m.type() === "error") erros.push(m.text()); });

/* a última visita fica para 1970: tudo na base conta como mudado, e o resumo
   "desde a sua última visita" tem o que mostrar. Entra ANTES do script da
   página, a cada carga — a página grava a hora de agora quando sai, e um
   valor posto depois dela seria apagado no primeiro reload. */
const chave = new URL(url).hash.slice(1);
const raizDaBase = (await (await fetch(origem + "/base", { headers: { "X-Painel-Chave": chave } })).json()).raiz;
await pagina.addInitScript((raiz) => {
  try { localStorage.setItem("kapstan-painel-visto:" + raiz, "1000"); } catch { /* sem armazenamento */ }
}, raizDaBase);
await pagina.goto(url, { waitUntil: "domcontentloaded" });
await pagina.waitForSelector("main h1", { timeout: 15000 });

const rolaDeLado = () => pagina.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth > 1);
const ir = async (hash, seletor = "main h1") => {
  await pagina.evaluate((h) => { location.hash = h; }, hash);
  /* o seletor que não aparece quase sempre é um erro de página: dizê-lo aqui
     poupa uma segunda rodada só para ler o console */
  await pagina.waitForSelector(seletor, { timeout: 10000 })
    .catch((e) => { if (erros.length) console.log("  console:\n  " + erros.join("\n  ")); throw e; });
  await dormir(400);
};
const tem = (seletor) => pagina.locator(seletor).count().then((c) => c > 0);
await mkdir(CAPTURAS, { recursive: true });
const capturar = (nome) => pagina.screenshot({ path: join(CAPTURAS, nome + ".png"), fullPage: true });

/* ── A CASA, a 1300 px ─────────────────────────────────────────────────── */
const TELAS = [
  ["início", "#/"],
  ["pasta", "#/pasta/itens"],
  ["arquivo", "#/arquivo/" + encodeURIComponent("itens/X-001-primeiro-exemplo.md")],
  ["conectores", "#/conectores"],
  ["conta", "#/sobre"],
  ["funil", "#/funil/todas"],
];
for (const [nome, hash] of TELAS) {
  await ir(hash);
  conferir(`casa · ${nome} desenha`, await tem("main h1"), true);
  conferir(`casa · ${nome} não rola para o lado (1300)`, await rolaDeLado(), false);
  conferir(`casa · ${nome} sem erro no console`, erros.join(" | "), "");
  await capturar(`1300-${nome.replace(/\s/g, "-")}`);
}

/* ── O PRÓXIMO PASSO (D235): a página do item, o cartão e a tabela ──────── */
await ir("#/arquivo/" + encodeURIComponent("itens/X-002-segundo-exemplo.md"), ".p-pag-proximo");
conferir("próximo · a página do item abre por quem é, e logo o próximo passo (D257)",
  await pagina.evaluate(() => [...document.querySelectorAll(".p-pag > *")].slice(0, 2).map((e) => e.className.split(" ")[0]).join("|")),
  "p-pag-cabeca|p-pag-proximo");
conferir("próximo · o que o agente apontou na linha do funil é o destaque",
  await pagina.locator(".p-pag-proximo-texto b").textContent(), "Sobre um item");
conferir("próximo · e o resto da frase é a nota",
  await pagina.locator(".p-pag-proximo-texto .p-pag-nota").first().textContent(), "O assistente anotou: a nota do agente");
conferir("próximo · os outros vêm ao lado: o fluxo da etapa, as outras ações do item e, no fim, descartar",
  (await pagina.locator(".p-pag-outros .c-chip").allTextContents()).join(" | "),
  "Começar | Buscar | Completar informações | Descartar");
await pagina.locator(".p-pag-proximo-acao .c-acao").click();
await pagina.waitForSelector(".p-confirma", { timeout: 5000 });
conferir("próximo · o destaque que chama o assistente só pergunta",
  (await pagina.locator(".p-confirma .c-chamada").textContent()).includes("Sobre um item · X-002"), true);
await capturar("1300-proximo");
await pagina.getByRole("button", { name: "Agora não" }).click();
await ir("#/arquivo/" + encodeURIComponent("itens/X-001-primeiro-exemplo.md"), ".p-pag-proximo");
conferir("próximo · sem aponte do agente, o destaque é o primeiro da etapa",
  (await pagina.locator(".p-pag-proximo-acao .c-acao").textContent()).trim(), "Mover para “fechado”");
/* ── A PASTA DOS ITENS É O FUNIL (D245) ────────────────────────────────── */
conferir("pasta · a entrada da pasta dos itens no menu abre o funil",
  await pagina.locator("nav#p-lado a", { hasText: "Itens" }).getAttribute("href"), "#/funil/todas");
await ir("#/pasta/itens", ".p-tabela");
conferir("pasta · o endereço velho da pasta cai na tabela, com o nome dela",
  (await pagina.locator("main h1").first().textContent()).trim(), "Itens");

/* ── COMPLETAR O QUE FALTA (D245) ─────────────────────────────────────── */
await ir("#/arquivo/" + encodeURIComponent("itens/X-002-segundo-exemplo.md"), ".p-pag-fatos");
conferir("completar · o título do essencial diz quantos campos estão sem resposta",
  (await pagina.locator('[aria-label="o que decide se cabe"] h2 span').textContent()).trim(), "3 sem resposta");
conferir("completar · a página não tem mais a lista do que dá para pedir: está tudo nas ações (D257)",
  await tem(".p-pedido"), false);
await pagina.locator(".p-pag-outros .c-chip", { hasText: "Completar informações" }).click();
await pagina.waitForSelector(".p-confirma", { timeout: 5000 });
conferir("completar · o botão chama a skill do pack com o id, e só pergunta antes",
  (await pagina.locator(".p-confirma .c-chamada").textContent()).includes("X-002"), true);
await pagina.getByRole("button", { name: "Agora não" }).click();

/* ── AS RELAÇÕES POR ID (D239): o dono, os documentos, e os ids que viram link ── */
await ir("#/", '[aria-label="agora"]');
conferir("relações · a linha do agora abre o item pelo id — o leitor resolve o DONO, não o documento",
  await pagina.locator('[aria-label="agora"] .p-agora-linha').filter({ hasText: "X-001" }).locator("a").first().getAttribute("href"), "#/funil/em%20andamento/X-001");
conferir("agora · o que o dia apontou vem primeiro, e cada linha tem o botão do próximo passo (D264)",
  await pagina.locator('[aria-label="agora"] .p-agora-linha').first().locator(".p-proximo-curto").count(), 1);
conferir("agora · a lista do dia de outra data avisa que envelheceu",
  await tem(".p-aviso-dia"), true);
await ir("#/arquivo/" + encodeURIComponent("itens/X-001-primeiro-exemplo.md"), '[aria-label="documentos deste item"]');
conferir("relações · a página do item lista os documentos dele",
  (await pagina.locator('[aria-label="documentos deste item"] a').allTextContents()).join("|").includes("X-001 (anexo)"), true);
conferir("destaque · os campos declarados pelo pack vêm em ladrilhos, na ordem dele",
  (await pagina.locator(".p-pag-fato dt").allTextContents()).join("|"), "preço|nota|regime");
conferir("destaque · o `?` é “não diz” e o campo que não existe é “não consta”, em âmbar",
  (await pagina.locator(".p-pag-fato[data-falta] dd b").allTextContents()).join("|"), "não diz|não consta");
conferir("relações · um id citado no histórico vira link para o arquivo dele",
  await tem('main a.p-id-link[href*="X-002"]'), true);
await ir("#/arquivo/" + encodeURIComponent("documentos/X-001-anexo.md"), ".p-pertence");
conferir("relações · o documento diz a quem pertence, e leva até lá",
  (await pagina.locator(".p-pertence a").getAttribute("href")).includes("itens%2FX-001"), true);

await ir("#/");
conferir("início · o resumo da última visita aparece", await tem('[aria-label="o que mudou"]'), true);
conferir("início · com item na base, o começo NÃO aparece", await tem('[aria-label="por onde começar"]'), false);

/* ── A FILA: marcar, ver a barra, anotar o motivo, desfazer ────────────── */
conferir("próximo · a linha da pilha a julgar mostra o destaque",
  await pagina.locator('[aria-label="a julgar"] .p-agora-linha').filter({ hasText: "X-002" }).locator(".p-proximo-curto").textContent(), "Sobre um item");
await pagina.locator('[aria-label="a julgar"] .p-agora-linha').filter({ hasText: "X-002" }).getByRole("button", { name: "Descartar" }).click();
await pagina.waitForSelector(".p-fila", { timeout: 5000 });
conferir("fila · marcar faz a barra aparecer", await tem(".p-fila"), true);
await pagina.locator(".p-fila-conta").click();
await pagina.locator(".p-fila-motivo input").fill("longe demais");
await pagina.locator(".p-fila-motivo input").press("Enter");
await pagina.locator(".p-fila-motivo input").blur();
await dormir(500);
const naFila = await pagina.evaluate(() => fetch("/fila").then((r) => r.json()));
conferir("fila · o motivo escrito na barra chega ao servidor", naFila.decisoes?.[0]?.motivo, "longe demais");
await capturar("1300-fila-aberta");
await pagina.locator(".p-fila-lista").getByRole("button", { name: "Desfazer" }).click();
/* espera a barra SUMIR, e não um instante: o motivo saiu no `blur` um clique
   antes, e a resposta dele pode chegar depois da do Desfazer */
await pagina.waitForSelector(".p-fila", { state: "detached", timeout: 3000 }).catch(() => {});
conferir("fila · desfazer esvazia a barra", await tem(".p-fila"), false);

/* ── O SEMPRE LIGADO NA CONTA (D243) ──────────────────────────────────── */
await ir("#/sobre", '[aria-label="painel sempre ligado"]');
conferir("conta · o painel da conversa diz que para quando ela fecha, e dá a linha que o liga",
  (await pagina.locator('[aria-label="painel sempre ligado"] code').first().textContent()).includes("sempre.mjs\" --instalar --base"), true);
await ir("#/");

/* ── O MENU (D242) ──────────────────────────────────────────────────────── */
conferir("menu · a conta do sistema não se chama “perfil”", await tem('nav#p-lado a:text-is("Conta")'), true);
conferir("menu · o bruto e o arquivo-morto têm nome de gente",
  (await pagina.locator("nav#p-lado details a").allTextContents()).map((t) => t.replace(/\d+/g, "").trim()).join("|"), "Originais");

/* ── A LISTA E O DETALHE (D244) ────────────────────────────────────────── */
const hash = () => pagina.evaluate(() => decodeURIComponent(location.hash));
const fila = () => pagina.evaluate(() => fetch("/fila").then((r) => r.json()));
/* o endereço muda antes de a tela redesenhar: quem lê a posição espera um quadro */
const posicao = async () => { await dormir(150); return pagina.locator(".p-leitor-pos").textContent(); };
conferir("leitor · o início leva a etapa para a lista e detalhe",
  await pagina.locator(".p-revisar a").getAttribute("href"), "#/funil/por%20julgar");
conferir("leitor · a linha da pilha abre o item no leitor",
  await pagina.locator('[aria-label="a julgar"] .p-agora-linha').filter({ hasText: "X-002" }).locator("a").first().getAttribute("href"), "#/funil/por%20julgar/X-002");
/* ── A TABELA E A ORDEM (D274) ─────────────────────────────────────────── */
const nomesDaTabela = async () => (await pagina.locator(".p-tabela td[data-tipo='nome'] b").allTextContents()).join("|");
await ir("#/funil/todas", ".p-tabela");
conferir("tabela · sem item no endereço, a tabela — e nenhum item abre sozinho", await tem(".p-leitor"), false);
conferir("tabela · uma linha por item, da etapa mais avançada para a menos", await nomesDaTabela(), "primeiro exemplo|segundo exemplo");
const titulos = (await pagina.locator(".p-tabela th").allTextContents()).map((x) => x.trim());
conferir("tabela · as colunas trazem o destaque do pack que tem resposta", titulos.includes("Nota"), true);
conferir("tabela · e a coluna em que ninguém tem resposta não toma lugar", titulos.includes("Preço") || titulos.includes("Regime"), false);
conferir("tabela · e o que falta e quando mudou", ["Falta", "Atualizada"].every((c) => titulos.includes(c)), true);
await capturar("1300-tabela");
await pagina.locator(".p-tabela th button").first().click();
await dormir(200);
conferir("tabela · o título da coluna ordena", await nomesDaTabela(), "primeiro exemplo|segundo exemplo");
await pagina.locator(".p-tabela th button").first().click();
await dormir(200);
conferir("tabela · e o segundo clique inverte", await nomesDaTabela(), "segundo exemplo|primeiro exemplo");
await pagina.locator(".p-tabela tbody tr", { hasText: "primeiro exemplo" }).locator("td").nth(2).click();
await pagina.waitForFunction(() => location.hash.endsWith("/X-001"), null, { timeout: 5000 });
await pagina.waitForSelector(".p-leitor-barra", { timeout: 5000 }).catch(() => {});
conferir("tabela · clicar na linha abre o item no leitor", await tem(".p-leitor-barra"), true);
conferir("tabela · e a lista do leitor vem na MESMA ordem",
  (await pagina.locator(".p-leitor-linha b").allTextContents()).join("|"), "segundo exemplo|primeiro exemplo");
await pagina.locator(".p-leitor-ordem select").selectOption("");
await dormir(200);
conferir("leitor · o seletor de ordem volta à ordem do funil",
  (await pagina.locator(".p-leitor-linha b").allTextContents()).join("|"), "primeiro exemplo|segundo exemplo");
conferir("leitor · e a posição acompanha", await posicao(), "1 de 2");
conferir("leitor · o item vem INTEIRO: a página do arquivo, com o destaque",
  (await pagina.locator(".p-leitor-item .p-pag-fato dt").allTextContents()).join("|"), "preço|nota|regime");
conferir("leitor · o próximo passo da página é o mesmo da barra",
  (await pagina.locator(".p-leitor-item .p-pag-proximo-texto b").textContent()).trim(),
  (await pagina.locator(".p-leitor-gestos .c-acao-cheia").textContent()).trim());
conferir("leitor · e, embutido, a página não repete as outras ações: estão em “Mais ações”",
  await tem(".p-leitor-item .p-pag-outros"), false);
await capturar("1300-leitor");
await pagina.getByRole("button", { name: "próxima" }).click();
await pagina.waitForFunction(() => location.hash.endsWith("/X-002"), null, { timeout: 5000 });
conferir("leitor · “Próxima ›” anda, e a posição acompanha", await posicao(), "2 de 2");
conferir("leitor · o passo principal é o que o agente apontou",
  (await pagina.locator(".p-leitor-gestos .c-acao-cheia").textContent()).trim(), "Sobre um item");
await pagina.evaluate(() => { for (const t of ["mousedown", "mouseup"]) window.dispatchEvent(new MouseEvent(t, { button: 3, bubbles: true, cancelable: true })); });
await pagina.waitForFunction(() => location.hash.endsWith("/X-001"), null, { timeout: 5000 });
conferir("leitor · o botão lateral de voltar do mouse volta um item", await posicao(), "1 de 2");
const palco = await pagina.locator(".p-leitor-palco").boundingBox();
await pagina.mouse.move(palco.x + palco.width / 2, palco.y + 200);
await pagina.mouse.wheel(220, 0);
await pagina.waitForFunction(() => location.hash.endsWith("/X-002"), null, { timeout: 5000 });
conferir("leitor · o gesto lateral do trackpad anda um item", await posicao(), "2 de 2");
await pagina.getByRole("button", { name: "Mais ações" }).click();
conferir("leitor · “Mais ações” tem TODAS, com o próximo passo marcado e Descartar no fim",
  (await pagina.locator(".p-leitor-pop [role=menuitem] > span").allTextContents()).map((s) => s.trim()).join(" | "),
  "Sobre um item | Começar | Buscar | Completar informações | Descartar ›");
await capturar("1300-leitor-mais");
await pagina.getByRole("menuitem", { name: /^Descartar/ }).click();
await capturar("1300-leitor-motivos");
await pagina.getByRole("menuitem", { name: "longe demais" }).click();
await pagina.waitForSelector('.p-leitor-linha[data-estado="recusa"]', { timeout: 5000 });
await dormir(300);
conferir("leitor · descartar com motivo, num clique, chega à fila",
  (await fila()).decisoes.map((d) => `${d.item} ${d.gesto} ${d.motivo}`).join(","), "X-002 descartar longe demais");
conferir("leitor · e a linha da lista mostra", (await pagina.locator('.p-leitor-linha[data-estado="recusa"] strong').textContent()).trim(), "✕ Descartar");
await pagina.getByRole("button", { name: "Desfazer descarte" }).click();
await dormir(400);
conferir("leitor · desfazer tira da fila", (await fila()).decisoes.length, 0);
await pagina.keyboard.press("k");
await pagina.waitForFunction(() => location.hash.endsWith("/X-001"), null, { timeout: 5000 });
await pagina.locator(".p-leitor-gestos .c-acao-cheia").click();
await pagina.waitForFunction(() => location.hash.endsWith("/X-002"), null, { timeout: 5000 });
conferir("leitor · marcar avança para o próximo, como o e-mail depois de arquivar",
  (await fila()).decisoes.map((d) => d.item + " → " + d.para).join(","), "X-001 → fechado");
await pagina.locator(".p-leitor-linha", { hasText: "primeiro exemplo" }).click();
await pagina.waitForFunction(() => location.hash.endsWith("/X-001"), null, { timeout: 5000 });
await pagina.locator(".p-leitor-gestos .c-acao-cheia").click();
await dormir(400);
conferir("leitor · o passo marcado, clicado de novo, desmarca e não anda",
  (await fila()).decisoes.length + " · " + (await hash()).split("/").pop(), "0 · X-001");
await pagina.locator(".p-leitor-filtros .c-chip", { hasText: "Por julgar" }).click();
await pagina.waitForFunction(() => decodeURIComponent(location.hash).startsWith("#/funil/por julgar"), null, { timeout: 5000 });
await dormir(300);
conferir("leitor · o filtro é a etapa, e mora no endereço", (await pagina.locator(".p-leitor-linha b").allTextContents()).join("|"), "segundo exemplo");
conferir("leitor · e o filtro não fecha o item: abre o primeiro da etapa", (await hash()).split("/").pop(), "X-002");

/* ── A PASTA DE DOCUMENTOS (D258): por item, com o nome dele ─────────── */
await ir("#/pasta/documentos", ".p-docs-grupo");
conferir("documentos · a pasta ligada a um modelo agrupa por item, com o apelido dele",
  (await pagina.locator(".p-docs-cabeca h2").allTextContents()).map((s) => s.trim()).join("|").includes("primeiro exemplo"), true);
conferir("documentos · e o cabeçalho do grupo leva ao item", await tem('.p-docs-cabeca a[href*="X-001"]'), true);
await capturar("1300-documentos");

/* ── O DOCUMENTO EM PDF, SÓ PARA LER (D270) ──────────────────────────── */
await ir("#/arquivo/" + encodeURIComponent("documentos/X-001-anexo.md"), ".p-documento-botoes");
const previa = await pagina.locator(".p-documento-botoes a").first().getAttribute("href");
conferir("documento · o arquivo da pasta ligada a um modelo tem a prévia", previa.startsWith("/base/documento?"), true);
conferir("documento · e diz que o PDF ainda não foi gerado", await tem('.p-documento-botoes :text("ainda não foi gerado")'), true);
const lida = await pagina.evaluate(async (u) => { const r = await fetch(u);
  return { status: r.status, tipo: r.headers.get("content-type"), csp: r.headers.get("content-security-policy"), html: await r.text() }; }, previa);
conferir("documento · a prévia é o HTML do modelo, numa folha", `${lida.status} · ${lida.tipo.startsWith("text/html")} · ${lida.html.includes('class="folha"')}`, "200 · true · true");
conferir("documento · e sai sem script: a CSP não abre script-src", lida.csp.includes("default-src 'none'") && !lida.csp.includes("script-src"), true);
/* pelo Node, com a chave no cabeçalho: o 403 pedido pela página sujaria o
   console, e o console limpo é outro caso desta prova */
const recusas = await Promise.all(["INDICE.md", "../fora.pdf"].map((c) =>
  fetch(origem + "/base/pdf?caminho=" + encodeURIComponent(c), { headers: { "X-Painel-Chave": chave } }).then((r) => r.status)));
conferir("documento · a rota do PDF recusa o que não é .pdf e o que está fora da base", recusas.join(","), "403,403");

/* ── O QUE ESTÁ NA PASTA E NÃO ESTÁ NO FUNIL (D245) ───────────────────── */
await writeFile(join(BASE, "itens", "X-003-terceiro-exemplo.md"), "# X-003 (terceiro exemplo)\n\npreço: ?\n");
await pagina.reload({ waitUntil: "domcontentloaded" });
await ir("#/funil/todas", ".p-tabela");
conferir("pasta · o item sem etapa entra no fim de “todas”, marcado, em vez de sumir",
  (await pagina.locator(".p-tabela tbody tr").last().locator("td[data-tipo='etapa']").textContent()).includes("fora do funil"), true);
await rm(join(BASE, "itens", "X-003-terceiro-exemplo.md"));
await pagina.reload({ waitUntil: "domcontentloaded" });
await ir("#/");

/* ── O MOLDE E O AJUSTE DA BASE (D244) ──────────────────────────────────── */
await writeFile(join(BASE, "painel.json"), JSON.stringify({ inicio: ["funil", "hoje"], cor: "azul" }));
await pagina.reload({ waitUntil: "domcontentloaded" });
await ir("#/", "main h2.c-h3");
conferir("molde · o painel.json da base reordena o início",
  (await pagina.locator("main h2.c-h3").allTextContents()).slice(0, 2).join("|"), "Para julgar|Agora");
await ir("#/sobre", '[aria-label="arranjo do painel"]');
conferir("molde · a Conta diz o que a base ajustou",
  (await pagina.locator('[aria-label="arranjo do painel"] .c-corpo').textContent()).includes("inicio"), true);
conferir("molde · e o que ela ignorou, com o nome da chave",
  (await pagina.locator('[aria-label="arranjo do painel"] .p-falta').textContent()).includes("“cor”"), true);
await rm(join(BASE, "painel.json"));
await pagina.reload({ waitUntil: "domcontentloaded" });
await ir("#/");

/* ── O BOTÃO QUE CHAMA O ASSISTENTE PEDE CONFIRMAÇÃO — e a prova desiste ─ */
await pagina.locator("summary", { hasText: "Pedir outra coisa" }).click();
await pagina.getByRole("button", { name: "Fazer agora" }).first().click();
await pagina.waitForSelector(".p-confirma", { timeout: 5000 });
conferir("chamar · o primeiro clique só pergunta", await tem(".p-confirma"), true);
await capturar("1300-confirmar");
await pagina.getByRole("button", { name: "Agora não" }).click();
await dormir(300);
conferir("chamar · “Agora não” fecha sem chamar", await tem(".p-confirma"), false);
const execucao = await pagina.evaluate(() => fetch("/lancar").then((r) => r.json()));
conferir("chamar · nada está rodando", execucao.rodando, null);

/* ── A RESPOSTA TARDIA (D238): ninguém esperando, e nada se perde ──────── */
const TRIAGEM = { titulo: "Triagem tardia", vista: "lista",
  dados: { grupos: [{ rotulo: "por julgar", itens: [{ id: "X-002", titulo: "X-002 (segundo exemplo)", linha: "uma linha" }] }],
    decisoes: [{ chave: "sim", rotulo: "Sim", gesto: "etapa:em andamento" },
      { chave: "nao", rotulo: "Não", tom: "recusa", gesto: "descartar" }, { chave: "depois", rotulo: "Depois" }] },
  acoes: [{ chave: "ok", rotulo: "Está bom", tom: "forte" }] };
await chamar("painel_mostrar", TRIAGEM);                      // e NENHUM painel_esperar
await ir("#/tarefa", "text=Triagem tardia");
conferir("tardia · a tela diz que o assistente não está mais esperando",
  await tem("text=não está mais esperando esta tela"), true);
conferir("tardia · e o menu não diz “esperando você”", await tem("text=Uma tela sua está aberta"), true);
await pagina.locator(".c-chip[aria-pressed]").filter({ hasText: "Sim" }).first().click();
await pagina.getByRole("button", { name: "Está bom" }).click();
await pagina.waitForSelector("text=Guardado.", { timeout: 5000 });
conferir("tardia · a tela diz que guardou", await tem("text=Guardado."), true);
const guardado = await pagina.evaluate(() => fetch("/fila").then((r) => r.json()));
conferir("tardia · a marca com gesto virou decisão da fila",
  guardado.decisoes?.find((d) => d.item === "X-002")?.para, "em andamento");
conferir("tardia · e a resposta ficou guardada com o título da tela",
  guardado.respostas?.[0]?.titulo + " · " + (guardado.respostas?.[0]?.na_fila || []).join(","), "Triagem tardia · X-002");
await capturar("1300-tardia");
await chamar("painel_mostrar", TRIAGEM);                      // o agente reabre a mesma pilha
const tardia = await chamar("painel_esperar", { segundos: 5 });
conferir("tardia · ao reabrir a pilha, painel_esperar devolve a resposta na hora", tardia.tardia, true);
conferir("tardia · com a decisão marcada dentro", tardia.decisoes?.["X-002"], "sim");
conferir("tardia · e ela sai da guarda", (await pagina.evaluate(() => fetch("/fila").then((r) => r.json()))).respostas.length, 0);
await chamar("painel_fila", { gravadas: ["X-002"] });         // limpa a fila para o resto da prova

/* ── O BOTÃO COM GESTO, APERTADO DEPOIS (D262) ─────────────────────────── */
await chamar("painel_mostrar", { titulo: "X-001 (primeiro exemplo) — sua vez", vista: "feedback",
  dados: { guardei: ["o registro está pronto, esperando o seu envio"] },
  acoes: [{ chave: "enviei", rotulo: "Enviei", tom: "forte", item: "X-001", gesto: "etapa:em andamento",
    nota: "registro em _bruto/prova.md: trocar o estado" }, { chave: "nao", rotulo: "Não vou", tom: "recusa" }] });
await ir("#/tarefa", "text=sua vez");
conferir("gesto · sem ninguém esperando, a tela diz que o botão vai para a fila",
  await tem("text=vai direto para a fila de decisões"), true);
await pagina.getByRole("button", { name: "Enviei" }).click();
await pagina.waitForSelector("text=Foi para a fila de decisões", { timeout: 5000 });
const comGesto = (await pagina.evaluate(() => fetch("/fila").then((r) => r.json()))).decisoes?.find((d) => d.item === "X-001");
conferir("gesto · o clique virou decisão da fila, com a nota", `${comGesto?.para} · ${comGesto?.nota}`,
  "em andamento · registro em _bruto/prova.md: trocar o estado");
await chamar("painel_fila", { gravadas: ["X-001"], respostas_lidas: (await chamar("painel_fila", {})).respostas?.map((r) => r.em) || [] });
await ir("#/");
await ir("#/");

/* ── A LISTA DO AGENTE, EM LISTA E DETALHE (D244) ───────────────────────── */
await chamar("painel_mostrar", { titulo: "Pilha no leitor", vista: "lista",
  dados: { modo: "leitor", grupos: [{ rotulo: "por julgar", itens: [
    { id: "X-001", titulo: "X-001 (primeiro exemplo)", linha: "a primeira" },
    { id: "X-002", titulo: "X-002 (segundo exemplo)", linha: "a segunda" }] }],
    decisoes: [{ chave: "sim", rotulo: "Salvar" }, { chave: "nao", rotulo: "Descartar", tom: "recusa" }] },
  acoes: [{ chave: "ok", rotulo: "Mandar", tom: "forte" }] });
await ir("#/tarefa", ".p-leitor-barra");
conferir("lista · `modo: leitor` abre na lista e detalhe", await tem(".p-leitor-lista"), true);
conferir("lista · com base aberta, o item com arquivo mostra o arquivo",
  (await pagina.locator(".p-leitor-item .p-chave dt").allTextContents()).join("|"), "preço|nota|regime");
await capturar("1300-lista-leitor");
await pagina.locator(".p-leitor-gestos .c-acao-cheia").click();
await pagina.waitForSelector(".p-leitor-linha[aria-current='true']:has-text('segundo exemplo')", { timeout: 3000 });
await pagina.getByRole("button", { name: "Lista compacta" }).click();
conferir("lista · a marca feita no leitor continua na lista compacta",
  await pagina.locator(".p-item", { hasText: "primeiro exemplo" }).locator('.c-chip[aria-pressed="true"]').textContent(), "Salvar");

/* ── AS SETE VISTAS ────────────────────────────────────────────────────── */
const VISTAS = {
  lista: { grupos: [{ rotulo: "um grupo", itens: [{ id: "X-001", titulo: "X-001 (exemplo)", linha: "uma linha" }] }],
    decisoes: [{ chave: "sim", rotulo: "Sim" }, { chave: "nao", rotulo: "Não", tom: "recusa" }] },
  ficha: { campos: [{ rotulo: "o quê", valor: "exemplo", de: "prova, 2026-09-21" }],
    secoes: [{ titulo: "Seção", linhas: ["uma linha"] }] },
  texto: { markdown: "Um parágrafo **com** marcação.\n\n- e uma lista", editavel: true },
  escolha: { pergunta: "Por onde?", opcoes: [{ chave: "a", rotulo: "Por aqui", custo: "barato" },
    { chave: "b", rotulo: "Por ali", custo: "caro" }] },
  feedback: { guardei: ["um arquivo"], faltaSaber: ["uma dúvida"], decidiSozinho: [] },
  laudo: { certo: ["isto"], errado: ["aquilo"], duvida: ["talvez"] },
  formulario: { campos: [{ chave: "nome", rotulo: "Nome", tipo: "texto", valor: "?", obrigatorio: true },
    { chave: "quando", rotulo: "Quando", tipo: "data", valor: "2026-09-21", comentar: true }] },
};
for (const [vista, dados] of Object.entries(VISTAS)) {
  await chamar("painel_mostrar", { titulo: `Vista ${vista}`, vista, dados,
    acoes: [{ chave: "ok", rotulo: "Está bom", tom: "forte" }, { chave: "nao", rotulo: "Não", tom: "recusa" }] });
  await ir("#/tarefa", `text=Vista ${vista}`);
  conferir(`vista · ${vista} desenha o título`, await tem(`text=Vista ${vista}`), true);
  conferir(`vista · ${vista} não rola para o lado`, await rolaDeLado(), false);
  if (vista === "formulario" || vista === "lista") await capturar(`1300-vista-${vista}`);
}
/* a última é o formulário: o recado geral e o comentário do campo (D259) */
conferir("recado · toda tela com botões tem o recado geral", await tem("text=Recado para o assistente"), true);
await pagina.locator(".p-recado textarea").fill("a data certa é outra");
await pagina.getByRole("button", { name: "Comentar este campo" }).click();
await pagina.locator(".p-comentario").fill("confira no e-mail");
await capturar("1300-recado");
const esperando = chamar("painel_esperar", { segundos: 15 });
await dormir(300);
await pagina.getByRole("button", { name: "Não", exact: true }).last().click();
const volta = await esperando;
conferir("vista · o clique volta ao assistente", volta.acao, "nao");
conferir("recado · volta em `comentario`, mesmo na recusa", volta.comentario, "a data certa é outra");
conferir("recado · o do campo volta em `comentarios`, fora do valor",
  JSON.stringify(volta.comentarios) + " · " + volta.campos?.quando, '{"quando":"confira no e-mail"} · 2026-09-21');

/* ── A VISTA DO PACK (D267) ──────────────────────────────────────────────
   A que vem de `componentes/` passa pela mesma porta das comuns: está no
   esquema, desenha, e o gesto dela volta ao assistente. */
const lista = await pedir("tools/list", {});
conferir("pack · a vista do pack está no esquema de painel_mostrar",
  lista.result.tools.find((t) => t.name === "painel_mostrar").inputSchema.properties.vista.enum.includes("contagem"), true);
await chamar("painel_mostrar", { titulo: "Vista do pack", vista: "contagem",
  dados: { itens: [{ rotulo: "primeiro", n: 2 }, { rotulo: "segundo", n: 3 }] } });
await ir("#/tarefa", "text=Vista do pack");
conferir("pack · a vista do pack desenha", await pagina.locator("main [data-total]").textContent(), "5");
conferir("pack · e não rola para o lado", await rolaDeLado(), false);
await capturar("1300-vista-do-pack");
const esperandoOPack = chamar("painel_esperar", { segundos: 15 });
await dormir(300);
await pagina.getByRole("button", { name: "Conferir a contagem" }).click();
const doPack = await esperandoOPack;
conferir("pack · o gesto da vista do pack volta ao assistente", `${doPack.acao} · ${doPack.total}`, "contei · 5");
const recusada = await chamar("painel_mostrar", { titulo: "x", vista: "nenhuma", dados: {} });
conferir("pack · vista desconhecida é recusada dizendo as que existem, com a do pack",
  /vista desconhecida: nenhuma.*contagem/.test(JSON.stringify(recusada)), true);
conferir("pack · o texto que o pack trocou está no menu", await tem('nav#p-lado a:text-is("Serviços ligados")'), true);
/* o pack sem `componentes/` leva a página comum, byte a byte */
const comum = await readFile(join(AQUI, "painel.html"), "utf8");
for (const { nome } of packsDoMarketplace().filter((x) => !vistasDoPack(x.pasta).vistas.length)) {
  conferir(`pack · ${nome}, sem componentes, tem o painel comum byte a byte`,
    (await readFile(join(AQUI, `painel.${nome}.html`), "utf8").catch(() => "")) === comum, true);
}

/* ── O TELEFONE, a 390 px ──────────────────────────────────────────────── */
await pagina.setViewportSize({ width: 390, height: 844 });
for (const [nome, hash] of TELAS) {
  await ir(hash);
  conferir(`telefone · ${nome} não rola para o lado (390)`, await rolaDeLado(), false);
  if (nome === "início" || nome === "arquivo") await capturar(`390-${nome}`);
}
await pagina.locator(".p-topo-menu").click();
conferir("telefone · o botão Menu abre a gaveta", await tem("nav#p-lado[data-aberto]"), true);
await capturar("390-gaveta");
await pagina.keyboard.press("Escape");
await dormir(200);
conferir("telefone · Esc fecha a gaveta", await tem("nav#p-lado[data-aberto]"), false);

/* ── A BASE VAZIA abre pelo começo ─────────────────────────────────────── */
await pagina.setViewportSize({ width: 1300, height: 900 });
await chamar("painel_inicio", { base: VAZIA });
await pagina.reload({ waitUntil: "domcontentloaded" });
await ir("#/", '[aria-label="por onde começar"]');
conferir("começo · base sem item abre por “Por onde começar”", await tem('[aria-label="por onde começar"]'), true);
conferir("começo · os passos vêm na ordem do pack",
  (await pagina.locator(".p-comeco b").allTextContents()).join(" › "), "Escrever o perfil › Buscar");
await capturar("1300-comeco");

conferir("console · nenhum erro na página inteira", erros.length, 0);
if (erros.length) console.log("  " + erros.slice(0, 5).join("\n  "));

await navegador.close();
servidor.stdin.end();
await dormir(300);
servidor.kill();
await rm(TEMP, { recursive: true, force: true }).catch(() => {});
const mal = casos.filter((c) => !c).length;
console.log(`\n${casos.length - mal} de ${casos.length} · capturas em proc/prova-tela/ · ${origem}`);
process.exit(mal ? 1 : 0);
