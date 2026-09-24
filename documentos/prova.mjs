/**
 * A PROVA DOS DOCUMENTOS (D270) — pelo stdio, como o Claude chama.
 *
 *   gera       um currículo de mentira vira PDF ao lado dele, com o modelo
 *              do pack: páginas dentro do teto, fonte EMBUTIDA e estática (a
 *              variável saía como Type 3), links
 *   teto       o que passa de duas páginas volta `cabe: false`
 *   contenção  fora da base, caminho absoluto e saída que não é .pdf são
 *              recusados — cada recusa com o controle ao lado, que passa
 *
 * Base e dados em pasta temporária; o currículo é inventado. Precisa de
 * Chrome, Edge ou Chromium na máquina (KAPSTAN_NAVEGADOR aponta outro).
 *
 *   node documentos/prova.mjs
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { acharNavegador } from "./nucleo/imprimir.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const casos = [];
const conferir = (nome, teve, esperado) => {
  const passou = teve === esperado;
  casos.push(passou);
  console.log(`${passou ? "✓" : "✗"} ${nome} · esperava ${esperado}, veio ${teve}`);
};
if (!acharNavegador()) {
  console.log("sem Chrome, Edge ou Chromium nesta máquina — a prova não tem com o que imprimir");
  process.exit(1);
}

const BASE = await mkdtemp(join(tmpdir(), "kapstan-prova-documentos-"));
await mkdir(join(BASE, "curriculos"), { recursive: true });
await writeFile(join(BASE, "INDICE.md"), "# Base de prova\n");
const experiencia = (n) => `### Cargo ${n} · Empresa Fictícia ${n} · jan/20${10 + n} a dez/20${11 + n}\n\n` +
  "- conduziu um projeto de exemplo com três times e uma meta medida em porcentagem\n" +
  "- escreveu o plano, acompanhou a execução e apresentou o resultado à diretoria\n\n";
const curriculo = "<!-- derivado de trajetoria.md, atualizada em 2026-09-22 · currículo base -->\n\n" +
  "# Pessoa de Exemplo\n\nCidade, UF · pessoa@exemplo.invalido · (00) 00000-0000 · linkedin.com/in/pessoa-de-exemplo\n\n" +
  "## Resumo\n\nProfissional de exemplo, com uma linha de resumo que não é de ninguém.\n\n" +
  "## Experiência\n\n" + [1, 2, 3].map(experiencia).join("") + "## Formação\n\n- Curso de exemplo, 2010\n";
await writeFile(join(BASE, "curriculos", "CV-base.md"), curriculo);
await writeFile(join(BASE, "curriculos", "longo.md"), curriculo.replace("## Formação",
  Array.from({ length: 40 }, (_, k) => experiencia(k + 4)).join("") + "## Formação"));
await writeFile(join(dirname(BASE), "fora-da-base.md"), "# fora\n").catch(() => {});

const servidor = spawn(process.execPath, [join(AQUI, "servidor.mjs"), "--pack", join(AQUI, "_prova")],
  { stdio: ["pipe", "pipe", "pipe"] });
servidor.stderr.on("data", () => {});
let buf = ""; const espera = new Map(); let n = 0;
servidor.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) {
  const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (!l) continue;
  const m = JSON.parse(l); if (m.id !== undefined && espera.has(m.id)) { espera.get(m.id)(m); espera.delete(m.id); } } });
const pedir = (method, params) => new Promise((ok) => { const id = ++n; espera.set(id, ok);
  servidor.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n"); });
const chamar = async (name, args = {}) => {
  const r = await pedir("tools/call", { name, arguments: args });
  const texto = r.result?.content?.[0]?.text || "";
  try { return { ...JSON.parse(texto), _erro: !!r.result?.isError }; } catch { return { _erro: true, _texto: texto || r.error?.message || "" }; }
};

try {
  await pedir("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "prova", version: "0" } });
  const lista = await pedir("tools/list", {});
  conferir("servidor · as duas ferramentas", (lista.result?.tools || []).map((t) => t.name).sort().join(","), "documento_gerar,documento_modelos");
  const modelos = await chamar("documento_modelos");
  conferir("modelos · os do pack aparecem, com o teto (D273: a carta de uma página)", modelos.modelos?.map((m) => `${m.nome}:${m.paginas_max}`).join(","), "carta:1,curriculo:2");

  const r = await chamar("documento_gerar", { base: BASE, origem: "curriculos/CV-base.md", modelo: "curriculo" });
  conferir("gera · o PDF nasce ao lado do markdown", `${r.pdf} · ${existsSync(join(BASE, "curriculos", "CV-base.pdf"))}`, "curriculos/CV-base.pdf · true");
  if (!r.pdf) console.log("  veio:", JSON.stringify(r).slice(0, 600));
  conferir("gera · dentro do teto", `${r.paginas} · ${r.cabe}`, "1 · true");
  conferir("gera · com a fonte embutida", r.fonte_embutida, true);
  const bytes = (await readFile(join(BASE, "curriculos", "CV-base.pdf"))).toString("latin1");
  conferir("gera · e estática: nenhuma fonte Type 3", /\/Subtype\s*\/Type3/.test(bytes), false);
  conferir("gera · os endereços viram links", r.links >= 2, true);
  conferir("gera · o markdown não foi tocado", (await readFile(join(BASE, "curriculos", "CV-base.md"), "utf8")) === curriculo, true);

  const longo = await chamar("documento_gerar", { base: BASE, origem: "curriculos/longo.md", modelo: "curriculo" });
  conferir("teto · passou de duas páginas, volta cabe: false", `${longo.paginas > 2} · ${longo.cabe}`, "true · false");

  const fora = await chamar("documento_gerar", { base: BASE, origem: "../fora-da-base.md", modelo: "curriculo" });
  conferir("contenção · origem fora da base é recusada", fora._erro && /fora da base/.test(fora._texto), true);
  const absoluto = await chamar("documento_gerar", { base: BASE, origem: join(BASE, "curriculos", "CV-base.md"), modelo: "curriculo" });
  conferir("contenção · caminho absoluto é recusado", absoluto._erro && /absoluto/.test(absoluto._texto), true);
  const naoPdf = await chamar("documento_gerar", { base: BASE, origem: "curriculos/CV-base.md", modelo: "curriculo", saida: "curriculos/CV-base.md" });
  conferir("contenção · saída que não é .pdf é recusada — ele não escreve outra coisa", naoPdf._erro && /\.pdf/.test(naoPdf._texto), true);
  const saidaFora = await chamar("documento_gerar", { base: BASE, origem: "curriculos/CV-base.md", modelo: "curriculo", saida: "../escapou.pdf" });
  conferir("contenção · saída fora da base é recusada", saidaFora._erro && !existsSync(join(dirname(BASE), "escapou.pdf")), true);
  const controle = await chamar("documento_gerar", { base: BASE, origem: "curriculos/CV-base.md", modelo: "curriculo", saida: "curriculos/outro-nome.pdf" });
  conferir("contenção · controle: saída .pdf dentro da base passa", controle.pdf, "curriculos/outro-nome.pdf");
  const semModelo = await chamar("documento_gerar", { base: BASE, origem: "curriculos/CV-base.md", modelo: "nao-existe" });
  conferir("modelo · o que não existe é recusado, dizendo os que existem", semModelo._erro && /curriculo/.test(semModelo._texto), true);
} finally {
  servidor.stdin.end();
  servidor.kill();
  await rm(BASE, { recursive: true, force: true }).catch(() => {});
  await rm(join(dirname(BASE), "fora-da-base.md"), { force: true }).catch(() => {});
}
const mal = casos.filter((c) => !c).length;
console.log(`\n${casos.length - mal} de ${casos.length}`);
process.exit(mal ? 1 : 0);
