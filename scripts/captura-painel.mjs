/* A imagem do README: o painel do vagas sobre a fixture fictícia
   (`_prova/vagas`), numa cópia temporária — a fixture não muda.
   `npm run captura` reescreve `.github/imagens/painel-vagas.jpg`. */
import { spawn } from "node:child_process";
import { cp, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { acharNavegador } from "../documentos/nucleo/imprimir.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
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

await pedir("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "captura", version: "0" } });
servidor.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
const r = await pedir("tools/call", { name: "painel_inicio", arguments: { base: BASE } });
const url = JSON.parse(r.result.content[0].text).painel;

const navegador = await chromium.launch({ executablePath: process.env.CHROME || acharNavegador() });
const pagina = await (await navegador.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
await pagina.goto(url, { waitUntil: "domcontentloaded" });
await pagina.waitForSelector("main h1", { timeout: 15000 });
await pagina.waitForTimeout(1500);
const saida = join(RAIZ, ".github", "imagens", "painel-vagas.jpg");
await pagina.screenshot({ path: saida, type: "jpeg", quality: 82 });
console.log("✓", saida);
await navegador.close(); servidor.kill(); process.exit(0);
