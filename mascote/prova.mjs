/**
 * A PROVA DO MASCOTE (D279) — o núcleo, sem navegador.
 *
 *   node mascote/prova.mjs
 *
 * O que ela cobra é o que quebraria o desenho sem avisar: o personagem que
 * não se valida, a expressão que não herda, a animação que salta ou não
 * termina, o olho que sai do corpo em alguma expressão, e o número que vira
 * NaN no meio de uma transição. Cada recusa tem o controle ao lado.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { abertura, cena, expressaoDe, movimento, proximaPiscada, quadro, recorte, validarPersonagem } from "./nucleo.js";

const AQUI = dirname(fileURLToPath(import.meta.url));
const casos = [];
const conferir = (nome, teve, esperado) => {
  const passou = teve === esperado;
  casos.push(passou);
  console.log(`${passou ? "✓" : "✗"} ${nome} · esperava ${esperado}, veio ${teve}`);
};
const kap = JSON.parse(await readFile(join(AQUI, "personagens", "kap.json"), "utf8"));
/* número a número: `JSON.stringify` escreve NaN como `null`, e `null` é o
   reflexo que some de propósito no olho fechado */
const semNumeroTorto = (o) => typeof o === "number" ? Number.isFinite(o)
  : o && typeof o === "object" ? Object.values(o).every(semNumeroTorto) : true;

/* ── O PERSONAGEM ──────────────────────────────────────────────────────── */
conferir("personagem · o Kap se valida", validarPersonagem(kap).erros.map((e) => e.onde).join(",") || "ok", "ok");
{
  const torto = structuredClone(kap);
  torto.animacoes.lendo.passos[0].expressao = "nao-existe";
  conferir("personagem · passo com expressão que não existe é recusado",
    validarPersonagem(torto).erros[0]?.onde, "animacoes.lendo.passos.0");
  const outro = { ...structuredClone(kap), formato: "outra-coisa" };
  conferir("personagem · formato de outro programa é recusado", validarPersonagem(outro).ok, false);
  const volta = structuredClone(kap);
  volta.expressoes.a = { de: "b" }; volta.expressoes.b = { de: "a" };
  conferir("personagem · herança que volta a si é recusada",
    validarPersonagem(volta).erros.some((e) => e.onde === "expressoes.a"), true);
  const texto = structuredClone(kap);
  texto.expressoes.feliz.boca.curva = "muita";
  conferir("personagem · número que é texto é recusado",
    validarPersonagem(texto).erros[0]?.onde, "expressoes.feliz.boca.curva");
}

/* ── AS EXPRESSÕES ─────────────────────────────────────────────────────── */
const neutra = expressaoDe(kap);
/* o esperado sai do personagem: o desenho se ajusta sem a prova mudar */
const largura = kap.neutra.olhos.ambos.largura;
const inicio = kap.expressoes["lendo-inicio"].olhar.x, fim = kap.expressoes["lendo-fim"].olhar.x;
conferir("expressão · `ambos` vale para os dois olhos",
  `${neutra.olhos.esquerdo.largura},${neutra.olhos.direito.largura}`, `${largura},${largura}`);
conferir("expressão · o que o personagem não diz vem da base", neutra.olhos.esquerdo.tampa, 0);
const radiante = expressaoDe(kap, "radiante");
conferir("expressão · herda da mãe (`de`) e acrescenta", `${radiante.olhos.direito.baseCurva} · ${radiante.boca.abertura}`, "0.75 · 0.55");
const piscadela = expressaoDe(kap, "piscadela");
conferir("expressão · o de um olho só não passa para o outro",
  `${piscadela.olhos.esquerdo.tampa} · ${piscadela.olhos.direito.tampa}`, "0.9 · 0");
conferir("expressão · chave que não existe é nula", expressaoDe(kap, "nao-existe"), null);

/* ── A LINHA DO TEMPO ──────────────────────────────────────────────────── */
const lendo = (t, o = {}) => quadro(kap, "lendo", t, { origem: neutra, ...o }).expressao;
conferir("animação · no instante zero, o rosto é o que estava na tela", lendo(0).olhar.x, 0);
conferir("animação · no fim da transição, o rosto é o do passo", lendo(280).olhar.x, inicio);
conferir("animação · no meio, o caminho entre os dois", lendo(140).olhar.x > inicio && lendo(140).olhar.x < 0, true);
conferir("animação · o segundo passo chega ao dele", lendo(280 + 200 + 1500).olhar.x, fim);
conferir("animação · no laço, a volta parte do último passo, e não da origem", lendo(2140).olhar.x, fim);
conferir("animação · com movimento reduzido, a transição some", lendo(1, { reduzido: true }).olhar.x, inicio);
const festa = quadro(kap, "comemorando", 99_999);
conferir("animação · `uma` termina, e fica no último rosto",
  `${festa.fim} · ${festa.expressao.boca.abertura}`, "true · 0.55");
conferir("animação · o laço não termina", quadro(kap, "lendo", 99_999).fim, false);
conferir("animação · a mesma entrada dá o mesmo quadro",
  JSON.stringify(quadro(kap, "pensando", 1234)) === JSON.stringify(quadro(kap, "pensando", 1234)), true);
{
  let torto = "";
  for (const chave of Object.keys(kap.animacoes)) {
    for (let t = 0; t < 9000; t += 37) {
      if (!semNumeroTorto(quadro(kap, chave, t, { origem: neutra }).expressao)) { torto = `${chave} em ${t}`; break; }
    }
  }
  conferir("animação · nenhuma vira NaN em nove segundos, de 37 em 37 ms", torto || "nenhuma", "nenhuma");
}

/* ── MOVIMENTO E PISCADA ───────────────────────────────────────────────── */
conferir("movimento · reduzido fica parado", JSON.stringify(movimento("pula", 400, { reduzido: true })),
  JSON.stringify({ dx: 0, dy: 0, giro: 0, sx: 1, sy: 1 }));
{
  let fora = false;
  for (let t = 0; t < 6000; t += 50) { const m = movimento("flutua", t); if (m.dy > 0 || m.dy < -3.5) fora = true; }
  conferir("movimento · flutuar sobe e desce sem entrar no chão", fora, false);
  let pousou = false;
  for (let t = 0; t < 900; t += 10) { const m = movimento("pula", t); if (m.sy < 0.95) pousou = true; }
  conferir("movimento · o pulo achata ao pousar", pousou, true);
}
conferir("piscada · aberto antes", abertura(-1, 160), 1);
conferir("piscada · fechado no meio", abertura(80, 160), 0.08);
conferir("piscada · aberto depois", abertura(160, 160), 1);
conferir("piscada · a próxima cai entre o mínimo e o máximo",
  proximaPiscada({ min: 2000, max: 4000 }, 1000, () => 0.5), 4000);
conferir("piscada · sem piscar, nunca", proximaPiscada(null, 0), Infinity);

/* ── A GEOMETRIA ───────────────────────────────────────────────────────── */
{
  const fora = [];
  for (const chave of ["neutra", ...Object.keys(kap.expressoes)]) {
    const c = cena(kap, expressaoDe(kap, chave));
    const { largura: W, altura: H } = c.corpo;
    for (const o of c.olhos) {
      if (Math.abs(o.cx) + o.largura / 2 > W / 2 - 6 || o.cy - o.altura / 2 < -H + 6 || o.cy + o.altura / 2 > -6) fora.push(chave);
    }
    if (c.boca && (Math.abs(c.boca.x) > W / 2 - 16 || c.boca.y > -8)) fora.push(chave + " (boca)");
    if (!semNumeroTorto(c)) fora.push(chave + " (NaN)");
  }
  conferir("cena · em toda expressão, olhos e boca ficam dentro do corpo", fora.join(", ") || "todas", "todas");
}
{
  /* a pálpebra de 93% deixa ver só a faixa de baixo do olho */
  const y = Number(recorte({ largura: 20, altura: 33, tampa: 0.93, tampaAngulo: 0, base: 0, baseCurva: 0 }, 1).split(" ")[1].split("L")[0]);
  conferir("cena · o olho quase fechado mostra só a faixa de baixo", y > 33 / 2 - 0.1 * 33, true);
  const bravo = recorte({ largura: 20, altura: 33, tampa: 0.2, tampaAngulo: 12, base: 0, baseCurva: 0 }, 1);
  const [, , esq, , dir] = bravo.match(/^M(\S+) (\S+)L(\S+) (\S+)L/).map(Number);
  conferir("cena · no olho direito, o ângulo positivo baixa o canto de dentro", esq > dir, true);
}
conferir("cena · o corpo sobe quando o movimento sobe, e a sombra encolhe",
  cena(kap, neutra, { mov: { dx: 0, dy: -10, giro: 0, sx: 1, sy: 1 } }).chao.rx < cena(kap, neutra).chao.rx, true);

const mal = casos.filter((c) => !c).length;
console.log(`\n${casos.length - mal} de ${casos.length}`);
process.exit(mal ? 1 : 0);
