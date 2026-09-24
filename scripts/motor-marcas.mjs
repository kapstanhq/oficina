// que marcas o motor usa, e quais o pack <arg> ainda não resolve
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { vocabularioDe, resolverMarcas } from "./oficina.mjs";
const pack = process.argv[2] || "prospeccao";
const andar = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? andar(p) : [p]; });
let vocab = {};
try { vocab = await vocabularioDe(pack); } catch (e) { console.log("!", e.message); }
const faltam = new Map();
for (const p of andar("_motor").filter((p) => p.endsWith(".md") && !p.endsWith("MOLDE.md"))) {
  const t = resolverMarcas(readFileSync(p, "utf8"), { ...vocab, "etapa-de": vocab["etapa-de"] || "item" });
  for (const m of t.matchAll(/\{([\w-]+)\}/g)) {
    if (/^[A-Z_]+$/.test(m[1])) continue;
    faltam.set(m[1], (faltam.get(m[1]) || 0) + 1);
  }
}
console.log([...faltam].sort().map(([k, n]) => `${k} (${n})`).join("\n"));
console.log("\ntotal:", faltam.size);
