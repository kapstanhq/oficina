/**
 * UM DOCUMENTO: o markdown da base, o modelo do pack e a página do motor (D270).
 *
 *   pagina.css      do motor: A4, margens, quebras, a fonte embutida, e a
 *                   folha na TELA (a prévia do painel é este mesmo HTML)
 *   <modelo>/       do pack: `modelo.css` por cima da página e `modelo.json`
 *                   — título, teto de páginas, e como ler o markdown
 *
 * Quem monta o HTML é uma função só, `montarHtml`: a prévia do painel e o PDF
 * não podem divergir, senão a prévia mente sobre o arquivo que vai sair.
 *
 * ── ELE SÓ ESCREVE O DERIVADO ─────────────────────────────────────────
 * `gerar` lê um `.md` de DENTRO da base e escreve um `.pdf` de DENTRO da base,
 * ao lado dele por padrão. Não edita texto nenhum: o texto é da skill, e o PDF
 * se refaz dele. A contenção é a mesma do painel — antes do disco (contra `..`
 * e caminho absoluto) e depois do `realpath` (contra link que escapa).
 */
import { existsSync } from "node:fs";
import { readdir, readFile, realpath, rename, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { escapar, markdownParaHtml } from "./markdown.mjs";
import { conferirPdf, imprimir } from "./imprimir.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ_DO_MOTOR = join(AQUI, "..");

/** as pastas em que um modelo pode morar: a do pacote instalado e a do pack
    na árvore-fonte (`--pack`). O primeiro nome achado vence. */
export function pastasDeModelos(pastaDoPack = "") {
  return [join(RAIZ_DO_MOTOR, "modelos"), pastaDoPack && join(pastaDoPack, "documentos", "modelos")]
    .filter((p) => p && existsSync(p));
}

export async function listarModelos(pastas) {
  const vistos = new Map();
  for (const pasta of pastas) {
    for (const nome of await readdir(pasta).catch(() => [])) {
      if (vistos.has(nome) || !existsSync(join(pasta, nome, "modelo.json"))) continue;
      const def = JSON.parse(await readFile(join(pasta, nome, "modelo.json"), "utf8"));
      vistos.set(nome, { nome, titulo: def.titulo || nome, paginas_max: def.paginas_max || 0, pasta: join(pasta, nome) });
    }
  }
  return [...vistos.values()];
}

async function carregarModelo(nome, pastas) {
  if (!/^[a-z0-9-]+$/.test(String(nome || ""))) throw new Error(`modelo inválido: “${nome}”`);
  const achado = (await listarModelos(pastas)).find((m) => m.nome === nome);
  if (!achado) {
    const existem = (await listarModelos(pastas)).map((m) => m.nome).join(", ") || "nenhum";
    throw new Error(`não há o modelo “${nome}” (os que existem: ${existem})`);
  }
  const def = JSON.parse(await readFile(join(achado.pasta, "modelo.json"), "utf8"));
  const css = existsSync(join(achado.pasta, "modelo.css")) ? await readFile(join(achado.pasta, "modelo.css"), "utf8") : "";
  return { ...def, nome, css };
}

/* as fontes ficam na memória; a folha, não — ela é lida a cada documento, e
   mudar a página não pede trocar o processo (o vigia só olha .mjs e .json) */
let fontesEmCache = null;
async function cssDaPagina() {
  const css = await readFile(join(RAIZ_DO_MOTOR, "pagina.css"), "utf8");
  if (fontesEmCache !== null) return fontesEmCache + css;
  /* a fonte vai DENTRO do CSS: `file://` numa página `file://` é recusado
     por CORS, e o PDF sairia com a fonte do sistema sem ninguém saber. E ela é
     ESTÁTICA, um arquivo por peso: a variável o Chrome embute como Type 3 (cada
     letra vira desenho) — medido em 22/09, 175 kB contra 79, e é o tipo de
     fonte que leitor de triagem entende mal */
  let faces = "";
  for (const peso of [400, 600]) {
    const fonte = await readFile(join(RAIZ_DO_MOTOR, "fontes", `plex-sans-${peso}.woff2`)).catch(() => null);
    if (fonte) faces += `@font-face{font-family:"Plex Documento";font-weight:${peso};font-style:normal;` +
      `src:url(data:font/woff2;base64,${fonte.toString("base64")}) format("woff2")}\n`;
  }
  fontesEmCache = faces;
  return faces + css;
}

/** o HTML inteiro de um documento — para a prévia e para o PDF */
export async function montarHtml(markdown, nomeDoModelo, pastas, idioma = "") {
  const modelo = await carregarModelo(nomeDoModelo, pastas);
  const { html, titulo } = markdownParaHtml(markdown, modelo.markdown || {});
  const nomeDoDoc = [titulo, modelo.titulo].filter(Boolean).join(" — ");
  return {
    modelo,
    html: `<!doctype html><html lang="${escapar(idioma || modelo.idioma || "pt-BR")}"><head><meta charset="utf-8">` +
      `<meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<title>${escapar(nomeDoDoc)}</title>${titulo ? `<meta name="author" content="${escapar(titulo)}">` : ""}` +
      `<style>${await cssDaPagina()}\n${modelo.css}</style></head>` +
      `<body class="modelo-${escapar(modelo.nome)}"><main class="folha">${html}</main></body></html>`,
  };
}

/* ── A CONTENÇÃO ───────────────────────────────────────────────────────── */
async function dentroDaBase(raiz, relativo, { precisaExistir }) {
  const pedido = String(relativo || "").trim();
  if (!pedido || pedido.includes("\0")) throw new Error("falta o caminho");
  if (isAbsolute(pedido)) throw new Error("o caminho é relativo à base, e este é absoluto");
  const dentro = (a) => a === raiz || a.startsWith(raiz + sep);
  const alvo = resolve(raiz, pedido);
  if (!dentro(alvo)) throw new Error("fora da base");
  const real = precisaExistir ? await realpath(alvo) : join(await realpath(dirname(alvo)), basename(alvo));
  if (!dentro(real)) throw new Error("fora da base");
  return real;
}

/**
 * Gera o PDF de `origem` (um `.md` da base) com o modelo, e confere.
 * Devolve `{ pdf, paginas, paginas_max, cabe, fonte_embutida, links, kb }`.
 */
export async function gerar({ base, origem, modelo, saida = "", pastas, idioma = "" }) {
  if (!base) throw new Error("falta a base: o caminho inteiro da pasta dela");
  const raiz = await realpath(resolve(String(base)));
  if (!/\.md$/i.test(String(origem || ""))) throw new Error("a origem é um arquivo .md da base");
  const deOnde = await dentroDaBase(raiz, origem, { precisaExistir: true });
  const pedidoDeSaida = saida || String(origem).replace(/\.md$/i, ".pdf");
  if (!/\.pdf$/i.test(pedidoDeSaida)) throw new Error("a saída é sempre um .pdf — este servidor não escreve outra coisa");
  const paraOnde = await dentroDaBase(raiz, pedidoDeSaida, { precisaExistir: false });

  if (idioma && !/^[a-z]{2}(-[A-Z]{2})?$/.test(String(idioma))) throw new Error("idioma é um código como \"en\" ou \"pt-BR\"");
  const { html, modelo: def } = await montarHtml(await readFile(deOnde, "utf8"), modelo, pastas, idioma);
  const bytes = await imprimir(html);
  /* `.tmp` e rename: o leitor de PDF aberto no arquivo antigo não pega um
     arquivo pela metade (e no Windows, o `writeFile` direto falha com ele aberto) */
  await writeFile(paraOnde + ".tmp", bytes);
  await rename(paraOnde + ".tmp", paraOnde);
  const c = conferirPdf(bytes);
  const max = Number(def.paginas_max) || 0;
  return {
    pdf: relative(raiz, paraOnde).split(sep).join("/"),
    paginas: c.paginas, paginas_max: max || null, cabe: !max || c.paginas <= max,
    fonte_embutida: c.fonteEmbutida, links: c.links, kb: c.kb,
  };
}
