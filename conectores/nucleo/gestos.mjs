/**
 * OS QUATRO GESTOS DA PESSOA — ligar, desligar, guardar a chave, escrever o
 * teto. Nenhum deles é do agente, e nenhum deles vira ferramenta MCP.
 *
 * ── POR QUE ELES SAÍRAM DE DENTRO DA CLI ───────────────────────────────
 * Até aqui os quatro moravam no `switch` de `servidor.mjs`, e isso bastava
 * enquanto "gente" queria dizer "linha de comando". O dono do produto
 * apontou o erro: quem instala o pack é leigo, e leigo não abre terminal. O
 * painel é a interface DA PESSOA — o clique dela ali é ela agindo —, então
 * ele precisa dos MESMOS quatro gestos.
 *
 * O que não pode existir é DOIS. Duas regras de teto divergem na primeira
 * correção, e a que sobrar errada é a que guarda dinheiro; duas regras de
 * chave divergem no dia em que uma esquecer de aparar o espaço colado junto.
 * A regra mora aqui, e as duas portas a chamam.
 *
 * ── E O AGENTE CONTINUA SEM ALCANÇAR NENHUM DOS QUATRO ─────────────────
 * O agente fala MCP por stdio, e a lista de ferramentas de `servidor.mjs`
 * não tem nada que chegue aqui — ela tem quatro, e as quatro são de LER e de
 * CHAMAR. Este arquivo é importado pela CLI e pelo painel, que são os dois
 * lugares em que quem está do outro lado é a pessoa.
 *
 * ── O QUE CADA UM DEVOLVE, E O QUE NENHUM DEVOLVE ──────────────────────
 * `guardarChaveDe` devolve se HÁ uma chave guardada, e nunca o valor dela —
 * nem cortado, nem mascarado. Uma resposta que carregue os quatro últimos
 * dígitos é uma resposta que vai para o registro do navegador, para a
 * captura de tela e para o relato de defeito que alguém cola num chat.
 */
import { nasceDesligado, ehPago } from "./catalogo.mjs";
import { ligar, guardarChave, escreverTeto, lerChaves, lerTetos } from "./cofre.mjs";

/** o conector pelo nome, ou a recusa que diz quais existem */
export function exigirConector(catalogo, nome) {
  const qual = String(nome || "").trim();
  const existem = Object.keys(catalogo).join(", ");
  if (!qual) throw new Error(`falta o nome do conector. Os que existem: ${existem}`);
  if (!catalogo[qual]) throw new Error(`conector desconhecido: ${qual}. Os que existem: ${existem}`);
  return catalogo[qual];
}

/**
 * O que a pessoa escreveu no teto, virado número — ou `NaN`.
 *
 * `Number("")` é ZERO, e sem esta guarda `teto apify` sem valor gravava teto
 * zero e dizia que deu certo. Quem pegou foi a prova. A vírgula entra porque
 * quem digita em português digita `2,5`, e `Number("2,5")` também é `NaN`.
 */
export function valorDeTeto(escrito) {
  const t = String(escrito ?? "").trim().replace(",", ".");
  return t === "" ? NaN : Number(t);
}

/** zero vale: zero fecha a torneira, e é diferente de não ter escrito nada */
export const tetoValido = (v) => Number.isFinite(v) && v >= 0;

/**
 * Liga ou desliga. `jaEstava` é o conector que não precisa ser ligado —
 * quem não tem aviso nem chave já nasce de pé, e gravar um estado para ele
 * seria inventar um interruptor que não existe.
 */
export async function ligarConector({ catalogo, nome, ligado, por }) {
  const c = exigirConector(catalogo, nome);
  if (ligado && !nasceDesligado(c)) return { nome, c, ligado: true, jaEstava: true };
  await ligar(nome, ligado, por);
  return { nome, c, ligado: Boolean(ligado), jaEstava: false };
}

/**
 * Guarda (ou apaga) a chave do serviço.
 *
 * Chave vazia APAGA — é o gesto de quem trocou de conta ou quer parar de
 * deixar o segredo no disco, e ele precisa existir nos dois lugares.
 */
export async function guardarChaveDe({ catalogo, nome, chave }) {
  const c = exigirConector(catalogo, nome);
  if (!c.chave) throw new Error(`${nome} não usa chave`);
  const valor = String(chave ?? "").trim();
  await guardarChave(nome, valor);
  return { nome, c, guardada: Boolean(valor) };
}

/** quanto ele pode gastar por mês. O número já vem conferido por quem chama,
    e é conferido outra vez aqui: a gravação é o lugar que não pode confiar */
export async function escreverTetoDe({ catalogo, nome, valor, por }) {
  const c = exigirConector(catalogo, nome);
  if (!ehPago(c)) throw new Error(`${nome} não custa nada — não há o que limitar`);
  if (!tetoValido(valor)) {
    throw new Error(`o teto é um número de ${c.custo.moeda} por mês, zero ou mais`);
  }
  await escreverTeto(nome, valor, por);
  return { nome, c, valor, moeda: c.custo.moeda };
}

/** há chave guardada para este conector? O valor não sai daqui */
export async function temChaveGuardada(nome) {
  return Boolean((await lerChaves())[nome]);
}

/** o teto escrito, ou zero. Zero e "não escrito" são a mesma recusa no
    miolo — o que muda é a frase, e quem a escolhe é quem mostra */
export async function tetoDe(nome) {
  return Number((await lerTetos())[nome]?.mes) || 0;
}
