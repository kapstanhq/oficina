// o que falta para o pack <arg> nascer: as marcas do motor que ele ainda não
// resolve e os `<<preencher…>>` que o molde (`_modelo/`) deixou na fonte dele.
// `total: 0` é a condição para `npm run montar -- --escrever`.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { vocabularioDe, resolverMarcas } from "./oficina.mjs";
const pack = process.argv[2] || "prospeccao";
const andar = (d) => existsSync(d) ? readdirSync(d).flatMap((n) => {
  const p = join(d, n); return statSync(p).isDirectory() ? andar(p) : [p]; }) : [];
let vocab = {};
try { vocab = await vocabularioDe(pack); } catch (e) { console.log("!", e.message); }
const faltam = new Map();
for (const p of andar("_motor").filter((p) => p.endsWith(".md") && !p.endsWith("MOLDE.md"))) {
  /* `{{item}}` é marca ESCAPADA (o preâmbulo ensina a regra com ela) e o
     `resolverMarcas` a devolve como `{item}`, igual a uma de pé: sai antes. */
  const fonte = readFileSync(p, "utf8").replace(/\{\{[\w-]+\}\}/g, "");
  const t = resolverMarcas(fonte, { ...vocab, "etapa-de": vocab["etapa-de"] || "item" });
  for (const m of t.matchAll(/\{([\w-]+)\}/g)) {
    if (/^[A-Z_]+$/.test(m[1])) continue;
    faltam.set(m[1], (faltam.get(m[1]) || 0) + 1);
  }
}
console.log([...faltam].sort().map(([k, n]) => `${k} (${n})`).join("\n"));

/* o que o molde deixou por escrever. Só nas pastas que são FONTE do pack — o
   gerado (skills do motor, painel, conectores) é refeito pelo montador. */
const PREENCHER = /<<preencher/;
const pendentes = [];
const fontes = [
  ...["README.md", "painel.json", "conectores.json", "LICENSE", ".claude-plugin/plugin.json"]
    .map((n) => join(pack, n)),
  ...["contrato", "exemplos", "modelos", "referencias"].flatMap((d) => andar(join(pack, d))),
  ...andar(join("_prova", pack)),
];
if (existsSync(join(pack, "skills"))) {
  for (const s of readdirSync(join(pack, "skills"))) fontes.push(join(pack, "skills", s, "SKILL.md"));
}
for (const p of fontes.filter((p) => existsSync(p) && statSync(p).isFile())) {
  readFileSync(p, "utf8").split("\n").forEach((l, i) => {
    if (PREENCHER.test(l)) pendentes.push(`${p.split("\\").join("/")}:${i + 1}  ${l.trim().slice(0, 100)}`);
  });
}
const entrada = existsSync(".claude-plugin/marketplace.json")
  ? JSON.parse(readFileSync(".claude-plugin/marketplace.json", "utf8")).plugins.find((p) => p.name === pack) : null;
if (entrada && PREENCHER.test(entrada.description || "")) {
  pendentes.push(`.claude-plugin/marketplace.json: a description de “${pack}”`);
}
/* seção do pack com marca no nome (`04-4-arquivo-de-{item}.md`) resolve na
   montagem; resolvida com acento, ela não casa com o padrão de seção e SOME
   do contrato sem erro. */
const RE_SECAO = /^\d\d-\d-[a-z0-9-]+[.]md$/;
for (const n of existsSync(join(pack, "contrato")) && Object.keys(vocab).length ? readdirSync(join(pack, "contrato")) : []) {
  if (!n.endsWith(".md") || !n.includes("{")) continue;
  const r = resolverMarcas(n, vocab);
  if (!RE_SECAO.test(r)) pendentes.push(`${pack}/contrato/${n}: resolve para “${r}”, que não é nome de seção — renomeie para kebab-case sem acento`);
}
const fixture = join("_prova", pack, vocab["pasta-base"] || "base");
if (existsSync(join("_prova", pack)) && !existsSync(fixture)) {
  pendentes.push(`${fixture.split("\\").join("/")}: não existe — a fixture mora na pasta com o nome de {pasta-base}`);
}
if (pendentes.length) console.log("\npor preencher:\n" + pendentes.join("\n"));
console.log("\ntotal:", faltam.size + pendentes.length);
