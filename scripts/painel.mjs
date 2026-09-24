/**
 * `npm run painel` — junta a página do painel num ÚNICO arquivo.
 *
 * ── POR QUE UM ARQUIVO SÓ ──────────────────────────────────────────────
 * `painel/index.html` é a fonte, e ela cita três derivados por `<link>` e
 * `<script src>` — que é como se trabalha, com os `--watch` de pé. O que é
 * COPIADO para dentro de cada pack e instalado por `/plugin install` não pode
 * ser assim: quem instala não tem build, pode não ter rede, e não vai abrir o
 * console para descobrir por que a página abriu sem estilo.
 *
 * Este script resolve os três `<link>`/`<src>` para dentro do HTML e grava
 * `painel/painel.html`. É o mesmo gesto do `construir.mjs` para o site — só
 * que ali o alvo é um diretório servido, e aqui é um arquivo que viaja.
 *
 * ── E ELE NÃO COPIA NADA PARA OS PACKS ─────────────────────────────────
 * Quem põe arquivo dentro de `oficina/<pack>/` é `scripts/oficina.mjs`, e
 * continua sendo: ele já é o dono de todas as cópias geradas do pack — as
 * skills do motor, as seções do contrato, os gabaritos, as referências — e
 * é ele quem as CONFERE quando roda sem `--escrever`. Dois donos para "o que
 * entra num pack" é o começo de duas listas, e a segunda envelhece.
 *
 * ── O SERVIDOR NÃO É COMPILADO, E ISSO É DE PROPÓSITO ──────────────────
 * `painel/servidor.mjs` e `painel/nucleo/*.mjs` são ESM puro, sem uma única
 * dependência, e vão para o pack COMO ESTÃO. Empacotá-los daria um arquivo
 * ilegível de 40 kB no repositório público, e o que se perderia é justamente
 * o que este repositório protege: o registro mora no código. Quem abrir o
 * plugin instalado lê por que cada guarda existe.
 */
import { readFile, writeFile as gravarCru, rename, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAINEL = join(RAIZ, "painel");

/* `.tmp` + rename, como a geração da Oficina e o Estúdio: no Windows um
   `writeFile` num arquivo que outro processo tem aberto lança `UNKNOWN` de
   forma intermitente, e o rename não disputa o descritor. */
const escrever = async (destino, texto) => {
  await gravarCru(destino + ".tmp", texto, "utf8");
  await rename(destino + ".tmp", destino);
};

const precisa = async (caminho, comando) => {
  if (!existsSync(caminho)) {
    console.error(`✗ falta ${caminho.slice(RAIZ.length + 1)} — rode \`${comando}\``);
    process.exit(1);
  }
  return readFile(caminho, "utf8");
};

const fonte = await readFile(join(PAINEL, "index.html"), "utf8");
const folhaTw = await precisa(join(PAINEL, "estilo.generated.css"), "npm run tw:painel");
const folhaComp = existsSync(join(PAINEL, "app", "entrada.generated.css"))
  ? await readFile(join(PAINEL, "app", "entrada.generated.css"), "utf8") : "";
const script = await precisa(join(PAINEL, "app", "entrada.generated.js"), "npm run svelte:painel");

/* ── A SUBSTITUIÇÃO É POR LINHA INTEIRA, E ELA COBRA ───────────────────
   Trocar por regex frouxa deixaria um `<link>` de pé se alguém reordenasse o
   `<head>`, e o sintoma seria uma página que busca um arquivo que não existe
   — 404 silencioso, tela sem estilo. Cada troca exige achar exatamente uma
   ocorrência. */
const trocar = (texto, de, para) => {
  const n = texto.split(de).length - 1;
  if (n !== 1) {
    console.error(`✗ painel/index.html: achei ${n}x ${JSON.stringify(de)} — ` +
      `o build espera exatamente uma`);
    process.exit(1);
  }
  /* ── `split().join()` E NUNCA `replace()` COM STRING ─────────────────
     Numa string de substituição de `String.replace`, `$` é SINTAXE: `$&` é o
     trecho casado, `$\`` é o que vem antes, `$'` é o que vem depois, `$$` é
     um cifrão. O que se insere aqui é um bundle MINIFICADO, e o Svelte
     minificado usa `$` como nome de variável em quase toda linha.

     Medido: a primeira versão usava `replace`, e a página abriu mostrando o
     JAVASCRIPT COMO TEXTO, com um `Unexpected token '<'` no console. O
     bundle tinha sido picado e recosturado com pedaços do próprio HTML no
     meio dele. Nada no build acusou — ele imprimiu ✓ e o peso certo.

     `split().join()` não interpreta nada, e é a mesma escolha que os scripts
     de correção deste repositório já fazem. */
  return texto.split(de).join(para);
};

/* ── O `</script>` DENTRO DO JS PARTIRIA A TAG ─────────────────────────
   Um bundle que contenha a sequência `</script>` — numa string, num
   comentário — fecha a tag no lugar errado e o resto do arquivo vira texto na
   página. É o defeito clássico de embutir script, e ele não dá erro: a página
   carrega pela metade. A barra escapada resolve e não muda o que o JS faz.

   O mesmo vale para `<!--`, que abriria um comentário HTML dentro do script. */
const seguro = (js) => js
  .replace(/<\/script>/gi, "<\\/script>")
  .replace(/<!--/g, "<\\!--");

let saida = fonte;
saida = trocar(saida,
  `<link rel="stylesheet" href="/estilo.generated.css">`,
  `<style>\n${folhaTw.trim()}\n</style>`);
saida = trocar(saida,
  `<link rel="stylesheet" href="/app/entrada.generated.css">`,
  folhaComp.trim() ? `<style>\n${folhaComp.trim()}\n</style>` : "<!-- os componentes não têm <style> próprio -->");
saida = trocar(saida,
  `<script type="module" src="/app/entrada.generated.js"></script>`,
  `<script type="module">\n${seguro(script.trim())}\n</script>`);

/* o aviso de cópia gerada, na primeira linha depois do doctype — o mesmo
   gesto dos `references/` da Oficina, e pela mesma razão: alguém vai abrir
   este arquivo para consertar alguma coisa, e precisa saber que a correção
   morre no próximo build. */
saida = saida.replace(/^<!doctype html>\r?\n/i,
  "<!doctype html>\n<!-- ARQUIVO GERADO · não edite.\n" +
  "     A fonte é painel/index.html, painel/estilo.css e painel/app/**,\n" +
  "     e `npm run painel` refaz este arquivo. -->\n");

/* ── E O QUE SAIU É CONFERIDO, porque o defeito foi MUDO ──────────────
   A versão com `replace()` (ver `trocar`) produziu um HTML com o bundle
   picado e pedaços do próprio HTML costurados dentro dele — e imprimiu ✓ com
   o peso certo. O erro só apareceu num navegador, como JAVASCRIPT NA TELA.

   As três cobranças abaixo são o que aquele defeito teria estourado. Elas
   não medem gosto nem desenho: medem se o arquivo é um documento HTML com
   UM script inteiro dentro, que é a única coisa que este build promete. */
{
  const abre = (saida.match(/<script/gi) || []).length;
  const fecha = (saida.match(/<\/script>/gi) || []).length;
  const queixas = [];
  if (abre !== 1 || fecha !== 1) {
    queixas.push(`são ${abre} <script> e ${fecha} </script> — o esperado é um de cada`);
  }
  /* o `src` da fonte não pode sobreviver: se ele está aqui, ou a troca não
     aconteceu, ou o trecho casado foi reinjetado como texto */
  if (saida.includes("entrada.generated.js")) {
    queixas.push("o `src` da fonte ficou no arquivo — a página buscaria um " +
      "arquivo que não existe ao lado dela");
  }
  /* o bundle inteiro tem de estar lá dentro. Comparar o TAMANHO pega a
     costura: um bundle picado sai menor que a fonte. */
  const dentro = saida.length - fonte.length - folhaTw.length - folhaComp.length;
  if (dentro < script.trim().length) {
    queixas.push(`o script embutido tem ~${dentro} caracteres e a fonte tem ` +
      `${script.trim().length} — faltou pedaço`);
  }
  if (queixas.length) {
    console.error("✗ o painel.html saiu quebrado:");
    for (const q of queixas) console.error("    " + q);
    process.exit(1);
  }
}

const destino = join(PAINEL, "painel.html");
await escrever(destino, saida);

const kb = (n) => (n / 1024).toFixed(1) + " kB";
const { size } = await stat(destino);
console.log(`✓ painel · painel.html com tudo dentro · ${kb(size)}`);
console.log(`  (css ${kb(folhaTw.length + folhaComp.length)} · js ${kb(script.length)})`);
console.log(`  para levá-lo aos packs: \`npm run oficina -- --escrever\``);
