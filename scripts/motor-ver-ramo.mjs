// node scripts/motor-ver-ramo.mjs <arquivo do motor> [pessoa|item] [f|m]
// mostra o arquivo GERADO com o vocabulário sintético, no ramo pedido.
// zarvil = {item} · mirnal = {pessoa} · vuldar = {base}
import { readFileSync } from "node:fs";
import { resolverMarcas, vocabularioSintetico } from "./oficina.mjs";
const [arq, ramo = "item", genero = "f"] = process.argv.slice(2);
const t = readFileSync(arq, "utf8");
process.stdout.write(resolverMarcas(t, vocabularioSintetico([t], genero, ramo)));
