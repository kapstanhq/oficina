/**
 * O PDF PELO NAVEGADOR QUE A MÁQUINA JÁ TEM (D270).
 *
 * Chrome, Edge e Chromium imprimem HTML em PDF por linha de comando
 * (`--print-to-pdf`), com a mesma máquina de layout que desenha a página na
 * tela. Nenhuma biblioteca: o pack instalado não roda `npm install`, e o
 * Edge vem em todo Windows. `KAPSTAN_NAVEGADOR` aponta outro, se for preciso.
 *
 * ── DUAS ARMADILHAS, AS DUAS MEDIDAS ──────────────────────────────────
 *   o perfil       sem `--user-data-dir` próprio, com o Chrome da pessoa
 *                  aberto, a impressão disputa o perfil dela. Cada impressão
 *                  usa uma pasta temporária, apagada no fim
 *   a fonte        `@font-face` com `file://` é recusada por CORS numa página
 *                  `file://` (origem nula). A fonte vai DENTRO do CSS, em
 *                  `data:` — ver `documento.mjs`
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { inflateSync } from "node:zlib";

const CANDIDATOS = {
  win32: [
    join(process.env.PROGRAMFILES || "C:/Program Files", "Google/Chrome/Application/chrome.exe"),
    join(process.env["PROGRAMFILES(X86)"] || "C:/Program Files (x86)", "Google/Chrome/Application/chrome.exe"),
    join(process.env.LOCALAPPDATA || "", "Google/Chrome/Application/chrome.exe"),
    join(process.env["PROGRAMFILES(X86)"] || "C:/Program Files (x86)", "Microsoft/Edge/Application/msedge.exe"),
    join(process.env.PROGRAMFILES || "C:/Program Files", "Microsoft/Edge/Application/msedge.exe"),
  ],
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ],
  linux: ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium",
    "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge", "/snap/bin/chromium"],
};

/** o caminho do navegador, ou "" — quem chama diz à pessoa o que falta */
export function acharNavegador() {
  const pedido = process.env.KAPSTAN_NAVEGADOR;
  if (pedido) return existsSync(pedido) ? pedido : "";
  return (CANDIDATOS[process.platform] || CANDIDATOS.linux).find((c) => c && existsSync(c)) || "";
}

/** imprime o HTML (texto) em PDF e devolve os bytes */
export async function imprimir(html, { navegador = acharNavegador(), teto = 60_000 } = {}) {
  if (!navegador) {
    throw new Error("não achei Chrome, Edge nem Chromium nesta máquina — o PDF sai de um deles " +
      "(KAPSTAN_NAVEGADOR aponta outro caminho)");
  }
  const pasta = await mkdtemp(join(tmpdir(), "kapstan-documento-"));
  try {
    const pagina = join(pasta, "documento.html");
    const pdf = join(pasta, "documento.pdf");
    await writeFile(pagina, html, "utf8");
    /* `--use-mock-keychain`: no macOS o perfil novo consulta o Keychain e a
       impressão trava sem erro até o teto (CI, 24/09). Só vale aqui, porque o
       perfil é descartável; no perfil de login ele tornaria os cookies ilegíveis. */
    await new Promise((ok, falha) => {
      const p = spawn(navegador, ["--headless=new", "--disable-gpu", "--no-first-run",
        "--no-default-browser-check", "--use-mock-keychain", "--no-pdf-header-footer", "--run-all-compositor-stages-before-draw",
        `--user-data-dir=${join(pasta, "perfil")}`, `--print-to-pdf=${pdf}`, pathToFileURL(pagina).href],
      { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
      let erro = "";
      p.stderr.on("data", (d) => { erro += d; });
      const relogio = setTimeout(() => { p.kill(); falha(new Error("o navegador não terminou a impressão a tempo")); }, teto);
      p.on("error", (e) => { clearTimeout(relogio); falha(e); });
      p.on("exit", () => { clearTimeout(relogio); existsSync(pdf) ? ok() : falha(new Error("o navegador não gerou o PDF: " + erro.slice(-300))); });
    });
    return await readFile(pdf);
  } finally {
    await rm(pasta, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * O que se confere num PDF sem biblioteca: as páginas, se a fonte foi
 * embutida (sem ela, o leitor da empresa troca a letra) e quantos links há.
 * A ORDEM do texto não se confere aqui: ela é a ordem do HTML, que é o que o
 * navegador imprime — e o HTML é montado nessa ordem de propósito.
 */
export function conferirPdf(bytes) {
  /* o Chrome guarda a descrição da fonte dentro de fluxos COMPRIMIDOS: a
     busca só no texto cru dizia "fonte não embutida" num PDF que a tinha */
  const cru = Buffer.from(bytes).toString("latin1");
  const abertos = [];
  for (const m of cru.matchAll(/stream\r?\n/g)) {
    const fim = cru.indexOf("endstream", m.index);
    if (fim < 0) continue;
    try { abertos.push(inflateSync(Buffer.from(cru.slice(m.index + m[0].length, fim), "latin1")).toString("latin1")); }
    catch { /* fluxo que não é deflate: imagem, ou já cru */ }
  }
  const s = cru + abertos.join("\n");
  return {
    paginas: (s.match(/\/Type\s*\/Page(?!s)/g) || []).length,
    fonteEmbutida: /\/FontFile[23]?\b/.test(s),
    links: (s.match(/\/URI\s*\(/g) || []).length,
    kb: Math.round(bytes.length / 1024),
  };
}
