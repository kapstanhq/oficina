/**
 * A PROVA DO VIGIA — com o servidor de verdade atrás dele.
 *
 * O que se mede é o que o Claude veria: uma conexão só, do começo ao fim, com
 * o código trocando por baixo. "Mudar um arquivo" aqui é regravar um módulo
 * com o MESMO conteúdo — o disco avisa do mesmo jeito, e a árvore não suja.
 *
 * Roda com o estado do painel e o cofre em pasta temporária: nada desta
 * máquina é tocado.  `node painel/prova-vigia.mjs`
 */
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const TEMP = await mkdtemp(join(tmpdir(), "kapstan-prova-vigia-"));
const casos = [];
const conferir = (nome, teve, esperado) => {
  const passou = teve === esperado;
  casos.push(passou);
  console.log(`${passou ? "✓" : "✗"} ${nome} · esperava ${esperado}, veio ${teve}`);
};
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

const p = spawn(process.execPath, [join(AQUI, "nucleo", "vigia.mjs"), join(AQUI, "servidor.mjs")], {
  stdio: ["pipe", "pipe", "pipe"],
  env: { ...process.env, KAPSTAN_PAINEL_DIR: join(TEMP, "painel"),
    KAPSTAN_CONECTORES_DIR: join(TEMP, "cofre"), PAINEL_PORTA: "4290" },
});
let registro = "";
p.stderr.on("data", (d) => { registro += d; });
let buf = ""; const espera = new Map(); const avisos = [];
p.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) {
  const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (!l) continue;
  const m = JSON.parse(l);
  if (m.id !== undefined && espera.has(m.id)) { espera.get(m.id)(m); espera.delete(m.id); }
  else avisos.push(m); } });
let n = 0;
const pedir = (method, params) => new Promise((ok) => { const id = ++n; espera.set(id, ok);
  p.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n"); });
const chamar = async (name, args = {}) => {
  const r = await pedir("tools/call", { name, arguments: args });
  try { return JSON.parse(r.result?.content?.[0]?.text); } catch { return r; }
};
const mexer = async () => {
  const f = join(AQUI, "nucleo", "fila.mjs");
  await writeFile(f, await readFile(f, "utf8"), "utf8");
};
const trocas = () => (registro.match(/troco o servidor/g) || []).length;

const ini = await pedir("initialize", { protocolVersion: "2025-06-18", capabilities: {},
  clientInfo: { name: "prova-vigia", version: "0" } });
p.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
conferir("controle · o aperto de mão atravessa o vigia", ini.result?.serverInfo?.name, "painel");
conferir("vigiado, o servidor promete avisar quando a lista muda",
  ini.result?.capabilities?.tools?.listChanged, true);

const inicio = await chamar("painel_inicio", { base: join(AQUI, "_prova-base") });
const porta = new URL(inicio.painel).port;
const chave = new URL(inicio.painel).hash.slice(1);
const deNoAr = () => fetch(`http://127.0.0.1:${porta}/estado`, { headers: { "X-Painel-Chave": chave } })
  .then((r) => r.status).catch(() => 0);
conferir("controle · o painel está no ar", await deNoAr(), 200);

/* ── a troca ── */
await mexer();
for (let i = 0; i < 40 && !avisos.some((a) => a.method === "notifications/tools/list_changed"); i++) await dormir(250);
conferir("arquivo mudou → o servidor foi trocado", trocas(), 1);
conferir("e o Claude é avisado de que a lista pode ter mudado",
  avisos.some((a) => a.method === "notifications/tools/list_changed"), true);
conferir("a resposta do aperto refeito NÃO vaza para o Claude",
  avisos.some((a) => String(a.id || "").startsWith("vigia-")), false);

const lista = await pedir("tools/list", {});
conferir("depois da troca, a MESMA conexão lista as ferramentas",
  (lista.result?.tools || []).map((t) => t.name).includes("painel_fila"), true);
for (let i = 0; i < 20 && (await deNoAr()) !== 200; i++) await dormir(250);
conferir("e o painel voltou sozinho, na mesma porta", await deNoAr(), 200);
const fila = await chamar("painel_fila");
conferir("e ele lembra da base — a ferramenta responde sem novo `painel_inicio`",
  Array.isArray(fila.fila), true);

/* ── a troca espera quem está no meio de uma tela ── */
await chamar("painel_mostrar", { titulo: "x", vista: "texto", dados: { markdown: "x" },
  acoes: [{ chave: "ok", rotulo: "ok" }] });
const esperando = chamar("painel_esperar", { segundos: 5 });
await dormir(800);
await mexer();
await dormir(1500);
conferir("com um pedido em curso, a troca NÃO acontece", trocas(), 1);
const voltou = await esperando;
conferir("o pedido em curso volta inteiro", voltou.expirou, true);
for (let i = 0; i < 40 && trocas() < 2; i++) await dormir(250);
conferir("e só então o servidor é trocado", trocas(), 2);

/* ── D234: trabalho que corre FORA do stdio também segura a troca ──────
   A chamada de um hóspede é HTTP, e o vigia não a vê passar: quem avisa é o
   servidor. O botão que lança o assistente usa o mesmo aviso. */
for (let i = 0; i < 20 && (await deNoAr()) !== 200; i++) await dormir(250);
await chamar("painel_mostrar", { titulo: "y", vista: "texto", dados: { markdown: "y" },
  acoes: [{ chave: "ok", rotulo: "ok" }] });
const hospede = fetch(`http://127.0.0.1:${porta}/agente/chamar`, { method: "POST",
  headers: { "X-Painel-Chave": chave, "Content-Type": "application/json" },
  body: JSON.stringify({ ferramenta: "painel_esperar", args: { segundos: 5 } }) })
  .then((r) => r.json()).catch(() => ({ caiu: true }));   // o servidor morto no meio: o defeito
await dormir(800);
await mexer();
await dormir(1500);
conferir("com um hóspede esperando por HTTP, a troca NÃO acontece", trocas(), 2);
const doHospede = await hospede;
conferir("e a chamada dele volta inteira", doHospede.expirou, true);
if (!doHospede.expirou) console.log("  veio:", JSON.stringify(doHospede).slice(0, 300));
for (let i = 0; i < 40 && trocas() < 3; i++) await dormir(250);
conferir("e só então o servidor é trocado", trocas(), 3);

p.stdin.end();
await dormir(300);
p.kill();

/* ── D234: mudança NO MEIO de uma troca não sobe dois filhos ──────────
   Com o servidor de verdade a troca dura poucas centenas de milissegundos, e
   acertar o meio dela dependia de sorte: a prova passava em uma de três. O
   servidor daqui é LENTO de propósito — o aperto refeito leva 1,5 s —, e a
   segunda mudança cai no meio sempre. Cada filho escreve o pid ao nascer; no
   fim, vivo tem de haver UM. */
{
  const RAIZ = join(TEMP, "lento");
  await mkdir(join(RAIZ, "painel"), { recursive: true });
  const LENTO = join(RAIZ, "painel", "servidor.mjs");
  const PIDS = join(RAIZ, "pids.txt");
  await writeFile(LENTO, [
    "import { createInterface } from \"node:readline\";",
    "import { appendFileSync } from \"node:fs\";",
    "appendFileSync(process.env.PIDS_DA_PROVA, process.pid + \"\\n\");",
    "const atraso = process.env.KAPSTAN_REINICIO ? 1500 : 0;",
    "const dizer = (m) => process.stdout.write(JSON.stringify(m) + \"\\n\");",
    "createInterface({ input: process.stdin }).on(\"line\", (l) => {",
    "  const m = JSON.parse(l);",
    "  if (m.method === \"initialize\") setTimeout(() => dizer({ jsonrpc: \"2.0\", id: m.id,",
    "    result: { protocolVersion: \"2025-06-18\", capabilities: {}, serverInfo: { name: \"lento\", version: \"0\" } } }), atraso);",
    "  else if (m.id !== undefined) dizer({ jsonrpc: \"2.0\", id: m.id, result: {} });",
    "}).on(\"close\", () => process.exit(0));",
  ].join("\n"));
  const v = spawn(process.execPath, [join(AQUI, "nucleo", "vigia.mjs"), LENTO], {
    stdio: ["pipe", "pipe", "pipe"], env: { ...process.env, PIDS_DA_PROVA: PIDS },
  });
  let dele = "";
  v.stderr.on("data", (d) => { dele += d; });
  v.stdout.on("data", () => {});
  v.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }) + "\n");
  await dormir(600);
  const tocar = () => writeFile(join(RAIZ, "painel", "outro.mjs"), `// ${Date.now()}\n`);
  await tocar();
  /* até 10 s: o `fs.watch` do Windows às vezes leva mais de 4 s para avisar, e
     aí a segunda mudança caía ANTES da primeira troca em vez de no meio dela —
     a prova falhava dizendo que o vigia trocou uma vez só (22/09, 1 em 3) */
  for (let i = 0; i < 100 && !/troco o servidor \(1/.test(dele); i++) await dormir(100);
  await tocar();
  for (let i = 0; i < 60 && !/troco o servidor \(2/.test(dele); i++) await dormir(100);
  await dormir(2500);
  const vivos = (await readFile(PIDS, "utf8")).split("\n").filter(Boolean).map(Number)
    .filter((pid) => { try { process.kill(pid, 0); return true; } catch { return false; } });
  conferir("controle: a segunda mudança caiu no meio da troca", /troco de novo/.test(dele), true);
  conferir("e a troca pedida no meio acontece depois", /troco o servidor \(2/.test(dele), true);
  conferir("no fim, o vigia tem UM filho vivo", vivos.length, 1);
  v.stdin.end();
  await dormir(300);
  v.kill();
}
await rm(TEMP, { recursive: true, force: true }).catch(() => {});
const mal = casos.filter((c) => !c).length;
console.log(`\n${casos.length - mal} de ${casos.length}`);
process.exit(mal ? 1 : 0);
