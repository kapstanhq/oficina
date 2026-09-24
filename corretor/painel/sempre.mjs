/**
 * O PAINEL SEMPRE LIGADO (D243) — um processo por máquina, fora do Claude.
 *
 * O painel que o Claude abre é filho da sessão: fechar, reabrir ou atualizar
 * a conversa o encerra, e a página que a pessoa deixou aberta fica sem
 * contato. Este arquivo é o supervisor do painel SOLTO:
 *
 *     sempre.mjs (supervisor) ⇄ servidor.mjs --base <pasta> (troca à vontade)
 *
 *   CAIU        sobe de novo, com espera crescente (1 s … 30 s); ficou de pé
 *               um minuto, a espera volta a 1 s
 *   MUDOU       `.mjs`/`.json` do painel ou dos conectores mudou: troca o
 *               servidor — mas NÃO com um assistente rodando pelo botão nem
 *               com uma tela esperando resposta; tenta de novo em 10 s
 *   UM SÓ       por máquina: o segundo vê o `sempre.pid` vivo e sai
 *
 * As sessões do Claude continuam subindo o servidor delas, que acha este de
 * pé e vira HÓSPEDE (D232), com o sinal de presença do D243.
 *
 *   node painel/sempre.mjs --base <pasta> [--pack <pasta do pack>]
 *   node painel/sempre.mjs --instalar --base <pasta>   sobe com o login, e já sobe
 *   node painel/sempre.mjs --desinstalar               tira do login e desliga (`--remover` também)
 *   node painel/sempre.mjs --estado                    diz se está de pé, e onde
 *
 * O registro vai para `sempre.log`, ao lado da chave — com a chave RISCADA
 * do endereço que o servidor escreve ao subir.
 */
import { spawn, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, watch, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { atalhoDoLogin, chaveDaMaquina, conteudoDaUnidade, conteudoDoLogin, pastaDaChave, ROTULO_DO_LOGIN,
  unidadeDoLogin } from "./nucleo/http.mjs";
import { acharAnfitriao } from "./nucleo/hospede.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SERVIDOR = join(AQUI, "servidor.mjs");
const ESTE = fileURLToPath(import.meta.url);
const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] || "" : ""; };
const tem = (n) => process.argv.includes(n);
const PASTA = pastaDaChave();
const PID = join(PASTA, "sempre.pid");
const LOG = join(PASTA, "sempre.log");
const PORTA = Number(process.env.PAINEL_PORTA || 4180);
const WINDOWS = process.platform === "win32";
const MAC = process.platform === "darwin";
const LINUX = !WINDOWS && !MAC;
/* no login do usuário, sem administrador — onde, por sistema, em `nucleo/http.mjs` */
const ATALHO = atalhoDoLogin();
const UNIDADE = LINUX ? unidadeDoLogin() : "";
/* com a pasta trocada (a prova), escreve os arquivos e não chama launchctl nem systemctl */
const DE_PROVA = !!process.env.KAPSTAN_INICIALIZAR_DIR;
const sistema = (programa, args) => DE_PROVA ? { status: 0 }
  : spawnSync(programa, args, { stdio: "ignore", windowsHide: true, timeout: 15_000 });
const temSystemdDeUsuario = () => LINUX && !DE_PROVA && sistema("systemctl", ["--user", "show-environment"]).status === 0;
const alvoDoLaunchd = () => `gui/${process.getuid?.() ?? ""}`;

mkdirSync(PASTA, { recursive: true });
const TETO_DO_LOG = 512 * 1024;
function dizer(...p) {
  const linha = `${new Date().toISOString()} ${p.join(" ")}`.replace(/#[A-Za-z0-9_-]{32,}/g, "#…") + "\n";
  try {
    if (existsSync(LOG) && statSync(LOG).size > TETO_DO_LOG) renameSync(LOG, LOG + ".1");
    appendFileSync(LOG, linha);
  } catch { /* registro é conforto */ }
  if (process.stderr.isTTY) process.stderr.write(linha);
}

const vivo = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; } };
const lerPid = () => { try { return JSON.parse(readFileSync(PID, "utf8")); } catch { return null; } };
async function ondeEsta(base = "") {
  const a = await acharAnfitriao({ segredo: await chaveDaMaquina(), portaInicial: PORTA, base }).catch(() => null);
  return a ? a.url : "";
}
function matarArvore(pid) {
  if (!pid || !vivo(pid)) return;
  if (WINDOWS) spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
  else { try { process.kill(pid, "SIGTERM"); } catch { /* já foi */ } }
}

/* ── OS TRÊS COMANDOS DE QUEM USA ──────────────────────────────────────── */
if (tem("--estado")) {
  const p = lerPid();
  const url = await ondeEsta(p?.base || "");
  console.log(p && vivo(p.pid)
    ? `ligado · pid ${p.pid} · ${p.base}${url ? " · " + url : " · o servidor está subindo"}`
    : "desligado");
  console.log(existsSync(ATALHO) ? `sobe com o login (${ATALHO})` : "não sobe com o login");
  if (UNIDADE && existsSync(UNIDADE)) console.log(`unidade do systemd escrita (${UNIDADE})`);
  process.exit(0);
}

if (tem("--desinstalar") || tem("--remover")) {
  if (MAC && existsSync(ATALHO)) {
    if (sistema("launchctl", ["bootout", alvoDoLaunchd(), ATALHO]).status !== 0) sistema("launchctl", ["unload", ATALHO]);
  }
  if (existsSync(ATALHO)) { rmSync(ATALHO); console.log(`tirado do login (${ATALHO})`); }
  if (UNIDADE && existsSync(UNIDADE)) {
    sistema("systemctl", ["--user", "disable", "--now", "kapstan-painel.service"]);
    rmSync(UNIDADE);
    console.log(`unidade do systemd tirada (${UNIDADE})`);
  }
  const p = lerPid();
  if (p && vivo(p.pid)) { matarArvore(p.pid); matarArvore(p.filho); console.log(`desligado (pid ${p.pid})`); }
  rmSync(PID, { force: true });
  process.exit(0);
}

const BASE = arg("--base") ? resolve(arg("--base")) : "";
const PACK = arg("--pack") ? ["--pack", resolve(arg("--pack"))] : [];
if (!BASE || !existsSync(join(BASE, "INDICE.md"))) {
  console.error(`\n  falta a pasta da base, com o INDICE.md dentro: node painel/sempre.mjs ${tem("--instalar") ? "--instalar " : ""}--base <pasta>\n`);
  process.exit(1);
}

if (tem("--instalar")) {
  const comando = [process.execPath, ESTE, "--base", BASE, ...PACK];
  const caminhos = process.env.PATH || "";
  mkdirSync(dirname(ATALHO), { recursive: true });
  writeFileSync(ATALHO, conteudoDoLogin(process.platform, { comando, caminhos }));
  console.log(`sobe com o login: ${ATALHO}`);
  /* no Mac o launchd já o põe de pé (RunAtLoad): subir daqui também daria dois */
  let subiuPeloSistema = false;
  if (MAC && !DE_PROVA) {
    sistema("launchctl", ["bootout", alvoDoLaunchd(), ATALHO]);
    subiuPeloSistema = sistema("launchctl", ["bootstrap", alvoDoLaunchd(), ATALHO]).status === 0
      || sistema("launchctl", ["load", "-w", ATALHO]).status === 0;
    if (!subiuPeloSistema) console.log(`o launchctl não carregou ${ROTULO_DO_LOGIN}: ele sobe no próximo login`);
  }
  /* Linux sem sessão gráfica não lê o autostart: a unidade fica escrita, e ligá-la é da pessoa */
  if (UNIDADE && (DE_PROVA || temSystemdDeUsuario())) {
    mkdirSync(dirname(UNIDADE), { recursive: true });
    writeFileSync(UNIDADE, conteudoDaUnidade({ comando, caminhos }));
    console.log(`sem sessão gráfica, use a unidade do systemd no lugar do autostart: ${UNIDADE}\n`
      + "  systemctl --user enable --now kapstan-painel.service   (e apague o .desktop)");
  }
  const p = lerPid();
  if (!subiuPeloSistema && !(p && vivo(p.pid))) {
    spawn(process.execPath, [ESTE, "--base", BASE, ...PACK], { detached: true, stdio: "ignore", windowsHide: true }).unref();
  }
  let url = "";
  for (let i = 0; i < 20 && !url; i++) { await new Promise((ok) => setTimeout(ok, 500)); url = await ondeEsta(BASE); }
  console.log(url ? `ligado: ${url}` : `subindo — o registro está em ${LOG}`);
  process.exit(0);
}

/* ── O SUPERVISOR ─────────────────────────────────────────────────────── */
const outro = lerPid();
if (outro && outro.pid !== process.pid && vivo(outro.pid)) {
  console.error(`o painel sempre ligado já está de pé (pid ${outro.pid}, ${outro.base})`);
  process.exit(0);
}

let filho = null;
let subiuEm = 0;
let espera = 1000;
let parando = false;
let trocando = false;
const gravarPid = () => writeFileSync(PID, JSON.stringify({ pid: process.pid, filho: filho?.pid || 0, base: BASE }));

function subir() {
  if (parando) return;
  subiuEm = Date.now();
  filho = spawn(process.execPath, [SERVIDOR, "--base", BASE, ...PACK], {
    stdio: ["ignore", "ignore", "pipe"], windowsHide: true,
    env: { ...process.env, KAPSTAN_SEMPRE: "1" },
  });
  gravarPid();
  const meu = filho;
  meu.stderr.on("data", (d) => String(d).split("\n").filter((l) => l.trim()).forEach((l) => dizer("[servidor]", l.trim())));
  meu.on("exit", (codigo) => {
    if (meu !== filho) return;
    filho = null;
    if (parando) return;
    if (trocando) { trocando = false; subir(); return; }
    espera = Date.now() - subiuEm > 60_000 ? 1000 : Math.min(espera * 2, 30_000);
    dizer(`o servidor saiu (${codigo}) — subo de novo em ${Math.round(espera / 1000)} s`);
    setTimeout(subir, espera);
  });
  dizer(`servidor de pé · pid ${meu.pid} · ${BASE}`);
}

/* não troca debaixo de quem está trabalhando: o assistente rodando pelo botão
   ficaria sem dono, e a tela esperando resposta perderia a resposta */
async function ocupado() {
  try {
    const url = await ondeEsta(BASE);
    if (!url) return false;
    const r = await fetch(url + "estado", { headers: { "X-Painel-Chave": await chaveDaMaquina() }, signal: AbortSignal.timeout(3000) });
    const e = await r.json();
    return !!(e?.execucao?.rodando || e?.esperando);
  } catch { return false; }
}
let relogio = null;
async function trocar() {
  if (!filho || trocando) return;
  if (await ocupado()) { dizer("arquivo mudou — troco quando o trabalho em curso terminar"); relogio = setTimeout(trocar, 10_000); return; }
  dizer("arquivo mudou — trocando o servidor");
  trocando = true;
  matarArvore(filho.pid);
}
/* o mesmo recorte do vigia (D233): código do painel e dos conectores, e não a
   página, a fonte dela, as provas ou este arquivo */
const RAIZ = dirname(AQUI);
const INTERESSA = (arquivo) => {
  const a = String(arquivo || "").replace(/\\/g, "/");
  if (!/\.(mjs|json)$/.test(a)) return false;
  if (/(^|\/)(app|_prova-base|node_modules)\//.test(a)) return false;
  return !/(^|\/)(prova[^/]*\.mjs|vigia\.mjs|sempre\.mjs)$/.test(a);
};
for (const pasta of ["painel", "conectores", "documentos"].map((p) => join(RAIZ, p)).filter(existsSync)) {
  try {
    watch(pasta, { recursive: true }, (_e, arquivo) => {
      if (!INTERESSA(arquivo)) return;
      clearTimeout(relogio);
      relogio = setTimeout(trocar, 600);
    });
  } catch (e) { dizer(`não consegui vigiar ${pasta} (${e?.message || e}) — sigo sem troca automática`); }
}

function parar() {
  parando = true;
  if (filho) matarArvore(filho.pid);
  const p = lerPid();
  if (p?.pid === process.pid) rmSync(PID, { force: true });
  process.exit(0);
}
process.on("SIGINT", parar);
process.on("SIGTERM", parar);
dizer(`supervisor de pé · pid ${process.pid}`);
subir();
