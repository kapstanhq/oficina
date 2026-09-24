/* As imagens do painel do vagas sobre a fixture fictícia (`_prova/vagas`),
   numa cópia temporária — a fixture não muda.

     npm run captura                  o início · .github/imagens/painel-vagas.jpg
     npm run captura -- --candidatura a candidatura da V-012 campo a campo, como
                                      o /vagas:candidatar a mostra (passo 5)

   `--largura 1000 --altura 700 --saida <arquivo>` muda a medida e o destino:
   é assim que sai a da página do site, que as mostra numa coluna de 656 px. */
import { spawn } from "node:child_process";
import { cp, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { acharNavegador } from "../documentos/nucleo/imprimir.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (nome, padrao) => { const i = process.argv.indexOf("--" + nome); return i > 0 ? process.argv[i + 1] : padrao; };
const CANDIDATURA = process.argv.includes("--candidatura");
const TEMP = await mkdtemp(join(tmpdir(), "kapstan-captura-"));
const BASE = join(TEMP, "busca");
await cp(join(RAIZ, "_prova", "vagas", "busca"), BASE, { recursive: true });
const PACK = join(RAIZ, "vagas");

const servidor = spawn(process.execPath, [join(PACK, "painel", "servidor.mjs")], {
  stdio: ["pipe", "pipe", "ignore"],
  env: { ...process.env, CLAUDE_PLUGIN_ROOT: PACK, KAPSTAN_PAINEL_DIR: join(TEMP, "painel"),
    KAPSTAN_CONECTORES_DIR: join(TEMP, "cofre"), PAINEL_PORTA: "4297" },
});
let buf = ""; let n = 0; const espera = new Map();
servidor.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) {
  const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (!l) continue;
  const m = JSON.parse(l); if (espera.has(m.id)) { espera.get(m.id)(m); espera.delete(m.id); } } });
const pedir = (method, params) => new Promise((ok) => { const id = ++n; espera.set(id, ok);
  servidor.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n"); });
const chamar = (name, args) => pedir("tools/call", { name, arguments: args });

await pedir("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "captura", version: "0" } });
servidor.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
const r = await chamar("painel_inicio", { base: BASE });
const url = JSON.parse(r.result.content[0].text).painel;

/* a tela do passo 5 do `candidatar`: a vaga em `ficha` e as respostas em
   `formulario`, na ordem do portal, com a origem de cada uma, o `?` que só
   ele responde e as ações do regime "eu aperto". Tudo sai da fixture. */
if (CANDIDATURA) {
  await chamar("painel_mostrar", {
    titulo: "Candidatura · V-012 (PM de IA, Lumina Pagamentos)",
    linha: "Confira as respostas. Nada sai sem você.",
    blocos: [
      { id: "respostas", vista: "formulario", titulo: "As respostas, na ordem do formulário", dados: { campos: [
        { chave: "nome", rotulo: "Nome completo", tipo: "texto", valor: "Rafael Duarte", de: "INDICE.md", obrigatorio: true },
        { chave: "email", rotulo: "E-mail", tipo: "texto", valor: "rafael@rafaelduarte.example", de: "INDICE.md", obrigatorio: true },
        { chave: "linkedin", rotulo: "Perfil no LinkedIn", tipo: "texto", valor: "https://linkedin.com/in/exemplo-rafael-duarte", de: "INDICE.md" },
        { chave: "ingles", rotulo: "Nível de inglês", tipo: "escolha", valor: "Intermediário",
          opcoes: ["Básico", "Intermediário", "Avançado", "Fluente"], de: "trajetoria.md", obrigatorio: true },
        { chave: "ia", rotulo: "Conte sobre um produto de IA que você pôs em produção", tipo: "texto-longo",
          valor: "Na Âncora Pagamentos, pus em produção em 2025 o primeiro fluxo de atendimento com IA da empresa, para a base de 31 mil lojistas do produto de antecipação.",
          de: "trajetoria.md", comentar: true },
        { chave: "inicio", rotulo: "Disponibilidade para começar", tipo: "texto", valor: "?", obrigatorio: true,
          nota: "é seu, na hora" },
      ] } },
    ],
    acoes: [
      { chave: "preencher", rotulo: "Preencher no navegador", tom: "forte" },
      { chave: "colo", rotulo: "Eu mesmo colo" },
      { chave: "nao", rotulo: "Não agora", tom: "recusa" },
    ],
  });
  /* o assistente ESPERANDO, como na candidatura de verdade — sem isto a tela
     diz que ele parou de esperar. A resposta nunca vem: a captura sai antes. */
  chamar("painel_esperar", { segundos: 120 });
}

const navegador = await chromium.launch({ executablePath: process.env.CHROME || acharNavegador() });
const pagina = await (await navegador.newContext({ viewport: { width: Number(arg("largura", 1440)), height: Number(arg("altura", 900)) }, deviceScaleFactor: 2 })).newPage();
await pagina.goto(url, { waitUntil: "domcontentloaded" });
await pagina.waitForSelector("main h1", { timeout: 15000 });
if (CANDIDATURA) {
  await pagina.evaluate(() => { location.hash = "#/tarefa"; });
  await pagina.waitForSelector("text=Candidatura · V-012", { timeout: 15000 });
}
await pagina.waitForTimeout(1500);
const saida = arg("saida", join(RAIZ, ".github", "imagens", CANDIDATURA ? "candidatura-vagas.jpg" : "painel-vagas.jpg"));
await pagina.screenshot({ path: saida, type: "jpeg", quality: 82 });
console.log("✓", saida);
await navegador.close(); servidor.kill(); process.exit(0);
