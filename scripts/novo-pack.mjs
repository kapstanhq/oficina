// npm run novo-pack -- <slug> [--nome "Nome do ofício"]
//
// Um pack novo nasce do `_modelo/` (D267): copia o esqueleto para `<slug>/`,
// a fixture para `_prova/<slug>/` e registra o pack no marketplace — que é a
// lista que o montador lê. O que o ofício diz fica marcado `<<preencher…>>`, e
// `npm run marcas <slug>` conta o que falta até zero.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODELO = join(RAIZ, "_modelo");
const MARKETPLACE = join(RAIZ, ".claude-plugin", "marketplace.json");

const args = process.argv.slice(2);
const iNome = args.indexOf("--nome");
const nome = iNome >= 0 ? args[iNome + 1] : undefined;
const slug = args.find((a, i) => !a.startsWith("--") && (iNome < 0 || i !== iNome + 1));
const parar = (msg) => { console.error(`✗ ${msg}`); process.exit(1); };

if (!slug) parar("uso: npm run novo-pack -- <slug> [--nome \"Nome do ofício\"]");
/* o slug vira pasta, nome do plugin e o prefixo de todo comando (`/<slug>:…`) */
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  parar(`“${slug}” não serve de slug — minúsculas, dígitos e hífen, sem acento: ele vira a pasta e o /${slug}: de cada comando`);
}
if (iNome >= 0 && !nome) parar("--nome pede um valor");
const marketplace = JSON.parse(readFileSync(MARKETPLACE, "utf8"));
if (marketplace.plugins.some((p) => p.name === slug)) parar(`já existe um pack “${slug}” no marketplace`);
if (existsSync(join(RAIZ, slug))) parar(`a pasta ${slug}/ já existe — escolha outro slug ou apague a pasta`);
if (existsSync(join(RAIZ, "_prova", slug))) parar(`_prova/${slug}/ já existe — apague antes de recriar o pack`);
if (!existsSync(MODELO)) parar("não achei _modelo/");

const titulo = nome || slug.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
const trocar = (texto) => texto.replaceAll("__slug__", slug).replaceAll("__nome__", titulo);

const andar = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? andar(p) : [p];
});
const criados = [];
const copiar = (de, para) => {
  mkdirSync(dirname(para), { recursive: true });
  /* tudo no molde é texto; o LF da fonte vai como está */
  writeFileSync(para, trocar(readFileSync(de, "utf8")));
  criados.push(para.slice(RAIZ.length + 1).split(sep).join("/"));
};

for (const p of andar(MODELO)) {
  const rel = p.slice(MODELO.length + 1);
  if (rel.startsWith("_prova" + sep)) {
    copiar(p, join(RAIZ, "_prova", slug, rel.slice("_prova".length + 1)));
  } else {
    copiar(p, join(RAIZ, slug, rel));
  }
}

marketplace.plugins.push({
  name: slug,
  source: `./${slug}`,
  description: "<<preencher: para quem é o pack e o que ele faz, numa frase — é o que o /plugin mostra antes de instalar>>",
});
writeFileSync(MARKETPLACE, JSON.stringify(marketplace, null, 2) + "\n");

console.log(`✓ ${slug} · ${criados.length} arquivos do _modelo/ e a entrada no marketplace`);
console.log(`
O próximo passo:
  npm run marcas ${slug}              o que falta, até dar “total: 0”
  npm run painel                      a página do painel, uma por pack do marketplace
  npm run montar -- --escrever        gera as skills do motor, o painel e o contrato
  npm run montar                      confere: tem de sair tudo ✓
  npm run provar -- --seco --pack ${slug}

No Claude Code, a skill /criar-pack faz a entrevista e preenche.`);
