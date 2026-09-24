/**
 * O LIVRO — uma linha por chamada, e nada se reescreve.
 *
 * ── POR QUE `appendFile`, SE TODO O RESTO É .tmp + rename ──────────────
 * O rename troca o arquivo INTEIRO, e o livro tem dois escritores possíveis:
 * dois packs instalados são dois processos. Reescrever-e-renomear entre eles
 * é corrida de perder linha — o segundo rename apaga a que o primeiro acabou
 * de gravar, e linha perdida aqui é gasto que some da conta do teto. O
 * append de uma linha curta é a operação que o sistema de arquivos faz
 * inteira, e o que ele arrisca é o contrário: uma linha pela metade, se o
 * processo morrer no meio. Por isso a leitura PULA linha ilegível em vez de
 * parar — e conta quantas pulou, para o extrato dizer.
 *
 * ── E O GASTO DO MÊS SAI DAQUI, SEMPRE ─────────────────────────────────
 * Não existe um "total.json" ao lado: total guardado é total que diverge do
 * livro na primeira queda entre as duas escritas, e quem perderia a disputa
 * é o teto. O livro é pequeno — centenas de linhas por mês —, e relê-lo a
 * cada chamada custa menos que a chamada de rede que vem depois.
 */
import { appendFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { diretorio } from "./cofre.mjs";

const arquivo = () => join(diretorio(), "livro.jsonl");

/** `AAAA-MM` de um instante, em UTC — o mês do teto é o do livro, e o livro
 *  grava ISO. Usar a hora local faria a virada do mês depender do fuso. */
export const mesDe = (quando) => new Date(quando).toISOString().slice(0, 7);

/* ponto flutuante: 0.1 + 0.2 aparece no extrato como 0.30000000000000004, e
   "resta 4.699999999" é o número que faz alguém desconfiar da conta toda.
   Seis casas porque o serviço mede em frações de centavo. */
export const arredondar = (n) => Math.round(n * 1e6) / 1e6;

export async function anotar(linha) {
  await mkdir(diretorio(), { recursive: true });
  await appendFile(arquivo(), JSON.stringify(linha) + "\n", "utf8");
}

export async function lerLivro() {
  if (!existsSync(arquivo())) return { linhas: [], ilegiveis: 0 };
  const linhas = [];
  let ilegiveis = 0;
  for (const bruta of (await readFile(arquivo(), "utf8")).split("\n")) {
    if (!bruta.trim()) continue;
    try { linhas.push(JSON.parse(bruta)); } catch { ilegiveis++; }
  }
  return { linhas, ilegiveis };
}

/**
 * Quanto um conector já gastou no mês.
 *
 * Chamada que FALHOU com custo também soma: o serviço cobra a corrida que
 * morreu no meio, e um teto que só contasse sucesso deixaria passar
 * exatamente o mês em que tudo deu errado.
 */
export async function gastoDoMes(conector, mes = mesDe(Date.now())) {
  const { linhas } = await lerLivro();
  let total = 0;
  for (const l of linhas) {
    if (l.conector === conector && mesDe(l.em) === mes) total += Number(l.custo) || 0;
  }
  return arredondar(total);
}
