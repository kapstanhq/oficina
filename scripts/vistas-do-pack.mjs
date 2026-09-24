/**
 * AS VISTAS DE UM PACK — quem lê `<pack>/painel/componentes/`.
 *
 * O contrato (D267, a terceira camada): cada `.svelte` no NÍVEL DE CIMA de
 * `<pack>/painel/componentes/` é uma vista, e o nome dela é o do arquivo em
 * minúsculas (`Contagem.svelte` → `contagem`). Subpasta é peça privada das
 * vistas, e não vista. O nome não pode ser o de uma vista comum
 * (`painel/app/vistas/`), que segue a mesma regra.
 *
 * Três leitores, e um só lugar: o build do painel (que as embute no bundle do
 * pack), o montador (que cobra a descrição em `painel.json` → `vistas`) e a
 * prova da tela.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

/* minúsculas, e o hífen do meio: é um valor de `vista` que o agente escreve */
export const NOME_DE_VISTA = /^[a-z][a-z0-9-]{1,30}$/;

const svelteDe = (pasta) => (existsSync(pasta) ? readdirSync(pasta, { withFileTypes: true }) : [])
  .filter((e) => e.isFile() && e.name.endsWith(".svelte"))
  .map((e) => ({ nome: e.name.slice(0, -".svelte".length).toLowerCase(), arquivo: join(pasta, e.name) }))
  .sort((a, b) => a.nome.localeCompare(b.nome));

export const vistasComuns = () => svelteDe(join(RAIZ, "painel", "app", "vistas")).map((v) => v.nome);

/** `[{ nome, arquivo }]`, e `erros` com o que quebra o contrato */
export function vistasDoPack(pastaDoPack) {
  const vistas = svelteDe(join(pastaDoPack, "painel", "componentes"));
  const comuns = vistasComuns();
  const erros = [];
  for (const v of vistas) {
    if (!NOME_DE_VISTA.test(v.nome)) erros.push(`${v.nome}: nome de vista é minúscula, dígito e hífen`);
    if (comuns.includes(v.nome)) erros.push(`${v.nome}: já é uma vista comum do painel`);
  }
  return { vistas, erros };
}

/** os packs do marketplace: `[{ nome, pasta }]`, e o nome é o da PASTA — o
    mesmo `pack` do montador */
export function packsDoMarketplace() {
  const m = JSON.parse(readFileSync(join(RAIZ, ".claude-plugin", "marketplace.json"), "utf8"));
  return m.plugins.map((p) => {
    const nome = p.source.replace(/^\.\//, "").replace(/\/+$/, "");
    return { nome, pasta: join(RAIZ, nome) };
  });
}
