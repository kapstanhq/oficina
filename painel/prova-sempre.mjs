/**
 * A PROVA DO SEMPRE LIGADO (D243) — o painel que não morre com a conversa.
 *
 *   sobe          o supervisor põe o servidor de pé, sem Claude nenhum
 *   um só         o segundo supervisor vê o primeiro e sai
 *   cai e volta   o servidor morto é substituído, na mesma porta
 *   presença      a sessão que entra vira hóspede, e "assistente conectado"
 *                 acende; fechou a sessão, apaga
 *   não disputa   com uma sessão segurando o painel da mesma base, o solto
 *                 espera ela fechar em vez de abrir outra porta
 *   instalar      o atalho do login nasce, e `--remover` o tira e desliga
 *   gerar         o que vai no login dos TRÊS sistemas — .vbs, LaunchAgent,
 *                 .desktop e a unidade do systemd —, gerado daqui e escrito
 *                 numa pasta temporária: roda em qualquer sistema
 *
 * Tudo em pastas temporárias e numa porta própria: nada desta máquina é
 * tocado, e o atalho vai para uma pasta Inicializar de mentira.
 *
 *   node painel/prova-sempre.mjs
 *   node painel/prova-sempre.mjs --so-geracao   só os casos de gerar, sem processo
 */
import { spawn, spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { atalhoDoLogin, conteudoDaUnidade, conteudoDoLogin, unidadeDoLogin } from "./nucleo/http.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const TEMP = await mkdtemp(join(tmpdir(), "kapstan-prova-sempre-"));
const BASE = join(TEMP, "base");
await cp(join(AQUI, "_prova-base"), BASE, { recursive: true });
const PORTA = 4310;
const ENV = { ...process.env, KAPSTAN_PAINEL_DIR: join(TEMP, "painel"), KAPSTAN_CONECTORES_DIR: join(TEMP, "cofre"),
  KAPSTAN_INICIALIZAR_DIR: join(TEMP, "inicializar"), PAINEL_PORTA: String(PORTA), KAPSTAN_PRESENCA_MS: "1000" };

const casos = [];
const conferir = (nome, teve, esperado) => {
  const passou = teve === esperado;
  casos.push(passou);
  console.log(`${passou ? "✓" : "✗"} ${nome} · esperava ${esperado}, veio ${teve}`);
};
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const vivos = [];
const correr = (args, opcoes = {}) => { const p = spawn(process.execPath, args, { env: ENV, stdio: ["pipe", "pipe", "pipe"], ...opcoes }); vivos.push(p); return p; };
const sempre = (...a) => spawnSync(process.execPath, [join(AQUI, "sempre.mjs"), ...a], { env: ENV, encoding: "utf8", timeout: 30_000 });

const chave = async () => (await readFile(join(TEMP, "painel", "chave"), "utf8").catch(() => "")).trim();
async function estado(porta = PORTA) {
  try {
    const r = await fetch(`http://127.0.0.1:${porta}/estado`, { headers: { "X-Painel-Chave": await chave() }, signal: AbortSignal.timeout(1500) });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}
async function ate(condicao, teto = 15_000) {
  const fim = Date.now() + teto;
  while (Date.now() < fim) { if (await condicao()) return true; await dormir(300); }
  return false;
}
const pid = async () => JSON.parse(await readFile(join(TEMP, "painel", "sempre.pid"), "utf8").catch(() => "{}"));

/* uma sessão do Claude: o servidor por stdio, nascido dentro da base */
function sessao(onde = BASE) {
  const p = correr([join(AQUI, "servidor.mjs")], { cwd: onde });
  let buf = ""; const espera = new Map(); let n = 0;
  p.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) {
    const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (!l) continue;
    const m = JSON.parse(l); if (m.id !== undefined && espera.has(m.id)) { espera.get(m.id)(m); espera.delete(m.id); } } });
  const pedir = (method, params) => new Promise((ok) => { const id = ++n; espera.set(id, ok);
    p.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n"); });
  return { p, pedir, async chamar(name, args = {}) {
    const r = await pedir("tools/call", { name, arguments: args });
    try { return JSON.parse(r.result?.content?.[0]?.text); } catch { return r; } } };
}

/* ── GERAR: o login dos três sistemas, sem instalar nada ─────────────── */
{
  const casa = "/home/ana";
  const onde = (plataforma, env = {}) => atalhoDoLogin({ plataforma, env, casa });
  conferir("gerar · Windows: a pasta Inicializar do APPDATA",
    atalhoDoLogin({ plataforma: "win32", env: { APPDATA: "C:\\Users\\ana\\AppData\\Roaming" }, casa: "C:\\Users\\ana" }),
    "C:\\Users\\ana\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\kapstan-painel.vbs");
  conferir("gerar · Windows sem APPDATA não vira caminho relativo",
    atalhoDoLogin({ plataforma: "win32", env: {}, casa: "C:\\Users\\ana" }).startsWith("C:\\Users\\ana\\AppData\\Roaming\\"), true);
  conferir("gerar · Mac: LaunchAgent do usuário", onde("darwin"), "/home/ana/Library/LaunchAgents/br.com.kapstan.painel.plist");
  conferir("gerar · Linux: autostart do XDG", onde("linux"), "/home/ana/.config/autostart/kapstan-painel.desktop");
  conferir("gerar · Linux: XDG_CONFIG_HOME vale", onde("linux", { XDG_CONFIG_HOME: "/cfg" }), "/cfg/autostart/kapstan-painel.desktop");
  conferir("gerar · Linux: a unidade do systemd de usuário", unidadeDoLogin({ env: {}, casa }),
    "/home/ana/.config/systemd/user/kapstan-painel.service");

  /* um caminho com espaço, acento, `%`, `$`, `&` e aspas: o que quebra cada formato */
  const base = '/home/ana/Minha base & 100% $HOME "ó"';
  const comando = ["/usr/bin/node", "/opt/oficina/painel/sempre.mjs", "--base", base];
  const PASTA = join(TEMP, "gerar");
  await mkdir(PASTA, { recursive: true });
  const escrito = async (nome, buf) => { await writeFile(join(PASTA, nome), buf); return readFile(join(PASTA, nome)); };

  const vbs = await escrito("kapstan-painel.vbs", conteudoDoLogin("win32", { comando }));
  conferir("gerar · .vbs em UTF-16 com BOM", vbs[0] === 0xff && vbs[1] === 0xfe, true);
  conferir("gerar · .vbs dobra as aspas do caminho",
    vbs.toString("utf16le").includes('""/home/ana/Minha base & 100% $HOME ""ó"""""'), true);

  const plist = (await escrito("br.com.kapstan.painel.plist",
    conteudoDoLogin("darwin", { comando, caminhos: "/opt/homebrew/bin:/usr/bin" }))).toString("utf8");
  conferir("gerar · plist: sobe no login e não se relança",
    plist.includes("<key>RunAtLoad</key><true/>") && plist.includes("<key>KeepAlive</key><false/>"), true);
  conferir("gerar · plist: um <string> por argumento, com & escapado",
    plist.includes('<string>/home/ana/Minha base &amp; 100% $HOME "ó"</string>') && plist.includes("<string>--base</string>"), true);
  conferir("gerar · plist: o node e o PATH de quem instalou",
    plist.includes("<string>/usr/bin/node</string>") && plist.includes("<string>/opt/homebrew/bin:/usr/bin</string>"), true);
  conferir("gerar · plist: nenhum & cru", /&(?!amp;|lt;|gt;)/.test(plist), false);

  const desktop = (await escrito("kapstan-painel.desktop", conteudoDoLogin("linux", { comando }))).toString("utf8");
  conferir("gerar · .desktop: Exec com aspas, % dobrado, $ e aspas escapados duas vezes",
    desktop.split("\n").find((l) => l.startsWith("Exec=")),
    String.raw`Exec="/usr/bin/node" "/opt/oficina/painel/sempre.mjs" --base "/home/ana/Minha base & 100%% \\$HOME \\"ó\\""`);
  conferir("gerar · .desktop: é uma entrada de aplicativo do autostart",
    desktop.startsWith("[Desktop Entry]\nType=Application\n") && desktop.includes("X-GNOME-Autostart-enabled=true"), true);

  const unidade = (await escrito("kapstan-painel.service",
    conteudoDaUnidade({ comando, caminhos: "/usr/local/bin:/usr/bin" }))).toString("utf8");
  conferir("gerar · unidade: ExecStart com % e $ neutralizados",
    unidade.split("\n").find((l) => l.startsWith("ExecStart=")),
    String.raw`ExecStart="/usr/bin/node" "/opt/oficina/painel/sempre.mjs" --base "/home/ana/Minha base & 100%% $$HOME \"ó\""`);
  conferir("gerar · unidade: o PATH vai junto, e liga com o login do usuário",
    unidade.includes('Environment="PATH=/usr/local/bin:/usr/bin"') && unidade.includes("WantedBy=default.target"), true);
}

try {
  if (process.argv.includes("--so-geracao")) throw Object.assign(new Error("pular"), { pular: true });
  /* ── NÃO DISPUTA: a sessão chegou primeiro ─────────────────────────── */
  const primeira = sessao();
  await primeira.pedir("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "prova", version: "0" } });
  const aberta = await primeira.chamar("painel_inicio", { base: BASE });
  conferir("sessão · sem painel solto, a sessão abre o dela na porta de sempre", new URL(aberta.painel).port, String(PORTA));

  const sup = correr([join(AQUI, "sempre.mjs"), "--base", BASE]);
  await dormir(2500);
  conferir("não disputa · com a sessão segurando a base, o solto NÃO abre a porta seguinte", await estado(PORTA + 1), null);
  primeira.p.kill();
  conferir("não disputa · a sessão fechou, e o solto assume a mesma porta",
    await ate(async () => (await estado())?.painel === "kapstan"), true);
  conferir("sobe · sem conversa aberta, o painel diz que não há assistente",
    await ate(async () => (await estado())?.agente === false, 6000), true);

  /* ── UM SÓ ─────────────────────────────────────────────────────────── */
  const segundo = sempre("--base", BASE);
  conferir("um só · o segundo supervisor sai dizendo que já há um", /já está de pé/.test(segundo.stderr), true);

  /* ── CAI E VOLTA ───────────────────────────────────────────────────── */
  const antes = (await pid()).filho;
  spawnSync("taskkill", ["/PID", String(antes), "/T", "/F"], { stdio: "ignore" });
  conferir("cai e volta · o servidor morto é substituído",
    await ate(async () => { const f = (await pid()).filho; return !!f && f !== antes && (await estado())?.painel === "kapstan"; }), true);

  /* ── PRESENÇA ──────────────────────────────────────────────────────── */
  const hospede = sessao();
  await hospede.pedir("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "prova", version: "0" } });
  conferir("presença · a sessão aberta acende o assistente conectado",
    await ate(async () => (await estado())?.agente === true, 8000), true);
  const inicio = await hospede.chamar("painel_inicio", { base: BASE });
  conferir("presença · a sessão é hóspede: o endereço é o do solto", new URL(inicio.painel).port, String(PORTA));
  hospede.p.kill();
  conferir("presença · fechou a sessão, o assistente apaga sozinho",
    await ate(async () => (await estado())?.agente === false, 8000), true);

  /* a sessão aberta FORA da base só a conhece pelo `painel_inicio`, que
     vai inteiro para o solto — e o sinal de presença tem de ir assim mesmo */
  const fora = sessao(TEMP);
  await fora.pedir("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "prova", version: "0" } });
  await fora.chamar("painel_inicio", { base: BASE });
  await dormir(3500);
  conferir("presença · a sessão aberta fora da base também acende, e continua acesa",
    (await estado())?.agente, true);
  fora.p.kill();
  await ate(async () => (await estado())?.agente === false, 8000);

  /* ── INSTALAR E REMOVER ────────────────────────────────────────────── */
  const inst = sempre("--instalar", "--base", BASE);
  const atalho = atalhoDoLogin({ env: ENV });
  conferir("instalar · o atalho do login nasce", existsSync(atalho), true);
  conferir("instalar · e aponta para esta base",
    existsSync(atalho) && (await readFile(atalho)).toString(process.platform === "win32" ? "utf16le" : "utf8").includes(BASE), true);
  conferir("instalar · diz o endereço", /ligado: http:\/\/127\.0\.0\.1:4310\//.test(inst.stdout), true);
  conferir("estado · diz que está ligado e sobe com o login",
    /^ligado/.test(sempre("--estado").stdout) && /sobe com o login/.test(sempre("--estado").stdout), true);
  sempre("--remover");
  conferir("remover · o atalho sai", existsSync(atalho), false);
  conferir("remover · e o painel desliga", await ate(async () => (await estado()) === null, 8000), true);
  conferir("remover · o supervisor sai junto", await ate(async () => sup.exitCode !== null || sup.signalCode !== null, 5000), true);
  conferir("registro · a chave não vai para o log",
    !(await readFile(join(TEMP, "painel", "sempre.log"), "utf8")).includes(await chave()), true);
} catch (e) {
  if (!e?.pular) throw e;
} finally {
  for (const p of vivos) { try { p.kill(); } catch { /* já foi */ } }
  const p = await pid();
  for (const x of [p.pid, p.filho]) if (x) spawnSync("taskkill", ["/PID", String(x), "/T", "/F"], { stdio: "ignore" });
  await dormir(300);
  await rm(TEMP, { recursive: true, force: true }).catch(() => {});
}
const mal = casos.filter((c) => !c).length;
console.log(`\n${casos.length - mal} de ${casos.length}`);
process.exit(mal ? 1 : 0);
