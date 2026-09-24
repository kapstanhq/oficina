/**
 * A PROVA DO MODELO TROCÁVEL E DA PASTA DA EXECUÇÃO (D267) — sem `claude`
 * nenhum: o processo é falso, e o que se mede é o que SAI para ele.
 *
 *   modelo   opus por padrão; `KAPSTAN_MODELO` e o `painel.json` da base
 *            trocam, nessa ordem; valor torto cai no padrão com aviso
 *   livro    a execução registra o modelo, e o custo de antes é o de mesmo modelo
 *   pasta    o `cwd` é a base e só ela; texto de fora é dado, no prompt de sistema
 *
 *   node painel/prova-lancar.mjs
 */
import { EventEmitter } from "node:events";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { criarLancador, modeloValido, nomeDoModelo, REGRA_DO_TEXTO_DE_FORA, resolverModelo } from "./nucleo/lancar.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const TEMP = await mkdtemp(join(tmpdir(), "kapstan-prova-lancar-"));
const BASE = join(TEMP, "base");
await cp(join(AQUI, "_prova-base"), BASE, { recursive: true });

const casos = [];
const conferir = (nome, teve, esperado) => {
  const passou = teve === esperado;
  casos.push(passou);
  console.log(`${passou ? "✓" : "✗"} ${nome} · esperava ${esperado}, veio ${teve}`);
};
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const lancados = [];
const gerar = (programa, args, opcoes) => {
  const filho = new EventEmitter();
  filho.pid = 0;
  filho.stdout = new EventEmitter();
  filho.stderr = new EventEmitter();
  filho.stdin = { end: (texto) => { filho.recebeu = texto; } };
  filho.kill = () => filho.emit("close", 1);
  lancados.push({ programa, args, opcoes, filho });
  return filho;
};
const valor = (x, flag) => x.args[x.args.indexOf(flag) + 1];
const terminar = (x, custo) => {
  x.filho.stdout.emit("data", JSON.stringify({ type: "result", subtype: "success", result: "feito", total_cost_usd: custo }) + "\n");
  x.filho.emit("close", 0);
};
const painelDaBase = (dela) => writeFile(join(BASE, "painel.json"), JSON.stringify(dela), "utf8");

try {
  /* ── O VALOR ───────────────────────────────────────────────────────── */
  conferir("modelo · os três apelidos passam", ["opus", "Sonnet", " haiku "].map(modeloValido).join(","), "opus,sonnet,haiku");
  conferir("modelo · id claude-… passa", modeloValido("claude-opus-5-5[1m]"), "claude-opus-5-5[1m]");
  conferir("modelo · outro fornecedor não passa", modeloValido("gpt-5"), "");
  conferir("modelo · nada de shell: & no valor não passa", modeloValido("opus & calc"), "");
  conferir("modelo · nada de shell: aspas no id não passam", modeloValido('claude-x" --dangerously'), "");
  conferir("modelo · o nome no aviso de custo", [nomeDoModelo("opus"), nomeDoModelo("sonnet"), nomeDoModelo("claude-x")].join(","), "Opus,Sonnet,claude-x");

  /* ── A ORDEM ───────────────────────────────────────────────────────── */
  conferir("modelo · sem nada, opus", resolverModelo({ env: {}, base: BASE }).modelo, "opus");
  await painelDaBase({ modelo: "haiku" });
  conferir("modelo · o painel.json da base troca", resolverModelo({ env: {}, base: BASE }).modelo, "haiku");
  conferir("modelo · o ambiente vence a base", resolverModelo({ env: { KAPSTAN_MODELO: "sonnet" }, base: BASE }).modelo, "sonnet");
  const torto = resolverModelo({ env: { KAPSTAN_MODELO: "gpt-5" }, base: BASE });
  conferir("modelo · ambiente torto cai para a base", torto.modelo, "haiku");
  conferir("modelo · e diz por quê", /KAPSTAN_MODELO/.test(torto.avisos[0] || ""), true);
  await painelDaBase({ modelo: "rm -rf" });
  conferir("modelo · base torta cai no padrão", resolverModelo({ env: {}, base: BASE }).modelo, "opus");

  /* ── O QUE SAI PARA O CLAUDE ───────────────────────────────────────── */
  await painelDaBase({ modelo: "sonnet" });
  const registro = [];
  const l = criarLancador({ pack: "x", pastaDoPack: AQUI, pastaDeRegistro: join(TEMP, "painel"), gerar, env: {},
    aoRegistrar: (t) => registro.push(t) });
  conferir("lançar · o aviso de custo sabe o modelo desta base", l.modeloPara(BASE), "sonnet");
  l.lancar({ o: "/x:fazer", nome: "Fazer", prompt: "/x:fazer", base: BASE });
  const um = lancados.at(-1);
  conferir("lançar · o claude recebe o modelo da base", valor(um, "--model"), "sonnet");
  conferir("lançar · a tela vê o modelo em curso", l.estado().rodando?.modelo, "sonnet");
  conferir("lançar · roda NA base", um.opcoes.cwd, BASE);
  /* no Windows o argumento com espaço vai entre aspas, para o cmd */
  conferir("lançar · texto de fora é dado, no prompt de sistema",
    valor(um, "--append-system-prompt").replace(/^"(.*)"$/, "$1"), REGRA_DO_TEXTO_DE_FORA);
  conferir("lançar · a regra passa pelo cmd do Windows sem virar comando", /["%!^]/.test(REGRA_DO_TEXTO_DE_FORA), false);
  conferir("lançar · o prompt continua sendo só o comando", um.filho.recebeu, "/x:fazer\n");
  terminar(um, 0.3);
  await dormir(200);
  const livro = (await readFile(join(TEMP, "painel", "execucoes.jsonl"), "utf8")).trim().split("\n").map((x) => JSON.parse(x));
  conferir("livro · registra o modelo usado", livro.at(-1).modelo, "sonnet");
  conferir("livro · a última execução guarda o modelo", l.estado().ultima?.modelo, "sonnet");

  await painelDaBase({ modelo: "opus" });
  conferir("livro · o custo de antes é o de mesmo modelo",
    JSON.stringify([await l.daUltimaVez("/x:fazer", "/x:fazer", "", BASE), (await l.daUltimaVez("/x:fazer", "/x:fazer", ""))?.custo]),
    "[null,0.3]");

  await painelDaBase({ modelo: "claude-x!" });
  l.lancar({ o: "/x:fazer", nome: "Fazer", prompt: "/x:fazer", base: BASE });
  conferir("lançar · modelo torto na base: vai o opus", valor(lancados.at(-1), "--model"), "opus");
  conferir("lançar · e o aviso vai para o registro", registro.some((t) => /painel\.json da base/.test(t)), true);
  terminar(lancados.at(-1), 0.1);

  /* ── A PASTA ───────────────────────────────────────────────────────── */
  const recusa = (base) => { try { l.lancar({ o: "/x:fazer", nome: "Fazer", prompt: "/x:fazer", base }); return "passou"; }
    catch (e) { return e.codigo; } };
  const antes = lancados.length;
  conferir("pasta · controle: a base passa", recusa(BASE), "passou");
  terminar(lancados.at(-1), 0.1);
  conferir("pasta · a pasta de cima da base não é base", recusa(TEMP), 409);
  conferir("pasta · a casa do usuário não é base", recusa(homedir()), 409);
  conferir("pasta · caminho relativo não é base", recusa("base"), 409);
  conferir("pasta · nenhuma recusa pôs processo de pé", lancados.length - antes, 1);
} finally {
  await rm(TEMP, { recursive: true, force: true }).catch(() => {});
}
const mal = casos.filter((c) => !c).length;
console.log(`\n${casos.length - mal} de ${casos.length}`);
process.exit(mal ? 1 : 0);
