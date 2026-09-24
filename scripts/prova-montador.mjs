/**
 * A PROVA DO MONTADOR — o que ele recusa num `painel.json` de pack, sem mexer
 * em pack nenhum: o pack é de mentira, numa pasta temporária, e quem monta é o
 * MESMO `acoesDoPack` do `npm run montar`.
 *
 *   node scripts/prova-montador.mjs
 */
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { acoesDoPack } from "./oficina.mjs";

const TEMP = await mkdtemp(join(tmpdir(), "kapstan-prova-montador-"));
const casos = [];
const conferir = (nome, teve, esperado) => {
  const passou = teve === esperado;
  casos.push(passou);
  console.log(`${passou ? "✓" : "✗"} ${nome} · esperava ${esperado}, veio ${teve}`);
};

/* o pack: só o funil (as etapas saem dos `## `) e o painel.json da vez */
await mkdir(join(TEMP, "p", "contrato"), { recursive: true });
await writeFile(join(TEMP, "p", "contrato", "04-3-funil.md"), "# Funil\n\n## nova\n\n## proposta\n", "utf8");
const montar = async (painel) => {
  await writeFile(join(TEMP, "p", "painel.json"), JSON.stringify(painel), "utf8");
  try { return { acoes: JSON.parse(await acoesDoPack("p", TEMP)) }; }
  catch (e) { return { erro: String(e?.message || e) }; }
};
const FIM = { de: "proposta", rotulo: "Aceitei a proposta", motivo: "aceitei" };

try {
  /* ── O CONTROLE: o fim certo passa, e chega ao acoes.json ────────────── */
  const certo = await montar({ fim: FIM });
  conferir("fim · o certo passa e vai ao acoes.json", JSON.stringify(certo.acoes?.fim), JSON.stringify(FIM));
  conferir("fim · pack sem fim não ganha a chave", "fim" in ((await montar({})).acoes || { fim: 1 }), false);

  /* ── O QUE ELE RECUSA ─────────────────────────────────────────────────── */
  const recusa = async (nome, fim, trecho) => {
    const r = await montar({ fim });
    conferir(`fim · recusa ${nome}`, Boolean(r.erro?.includes("painel.json: fim ·") && r.erro.includes(trecho)), true);
  };
  await recusa("etapa que o funil não tem", { ...FIM, de: "contratada" }, "“contratada” não é uma etapa do funil");
  await recusa("rótulo com mais de 40 caracteres", { ...FIM, rotulo: "x".repeat(41) }, "até 40 caracteres");
  await recusa("rótulo vazio", { ...FIM, rotulo: " " }, "rotulo é o texto do botão");
  await recusa("motivo com espaço", { ...FIM, motivo: "aceitei a proposta" }, "sem espaço");
  await recusa("motivo vazio", { ...FIM, motivo: "" }, "sem espaço");
  await recusa("campo que não existe", { ...FIM, cor: "verde" }, "“cor” não é campo do fim");
  await recusa("o que não é objeto", "proposta", "um objeto { de, rotulo, motivo }");
} finally {
  await rm(TEMP, { recursive: true, force: true }).catch(() => {});
}

const mal = casos.filter((c) => !c).length;
console.log(`\n${casos.length - mal} de ${casos.length}`);
process.exit(mal ? 1 : 0);
