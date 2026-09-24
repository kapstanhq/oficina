/* ═══ As três operações de texto que a Oficina faz, e só elas ═══════════
   Elas moravam em `scripts/artigo.mjs`, no meio do gerador dos guias, e a
   página do pack as usava de lá. Aqui elas ficam ao lado do manifesto que
   as consome — o gerador dos guias não precisa de nenhuma, e o dia em que a
   Oficina virar um pacote próprio ela leva as três junto.

   Nenhuma delas escapa HTML: quem escapa é o Svelte, em toda interpolação
   `{…}`. A única saída não escapada da Oficina é a `Linha.svelte`, e ela
   escapa antes de converter — ver o comentário de lá. */

/* ── NÚMERO POR EXTENSO ──────────────────────────────────────────────────
   "Dez skills" e não "10 skills": a página é prosa. Ele é DERIVADO da
   contagem, nunca digitado — no dia em que a décima primeira nascer, a copy
   acompanha sozinha. Número escrito à mão em copy é a linha que ninguém
   lembra de corrigir. */
const EXTENSO = ["zero", "uma", "duas", "três", "quatro", "cinco", "seis",
  "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze",
  "quinze", "dezesseis", "dezessete", "dezoito", "dezenove", "vinte"];
export const por = (n) => EXTENSO[n] || String(n);
export const maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ── AS SUBSTITUIÇÕES DO MANIFESTO ─────────────────────────────────────
   `{n}`, `{N}`, `{pasta}`, `{tarefa}`… O que NÃO estiver em `valores` FICA
   DE PÉ no texto, e isso é o mecanismo, não descuido: apagar a marca
   desconhecida daria frase mutilada sem erro nenhum, que é o defeito mais
   caro que uma substituição tem. */
export const preencher = (frase, valores) => String(frase).replace(
  /\{(\w+)\}/g, (marca, nome) => (nome in valores ? valores[nome] : marca));

/**
 * O VOCABULÁRIO DE NÚMERO de um pack, montado uma vez e passado a tudo que
 * escreve copy. As seis marcas saem da lista de ferramentas — nenhuma é
 * digitada — e é por isso que a frase "as outras nove" continua verdadeira
 * quando a décima primeira nascer.
 *
 *   {n}     dez      o total, por extenso
 *   {N}     Dez      o mesmo, começando frase
 *   {n1}    nove     o total menos um — "as outras nove"
 *   {c}     cinco    quantas se resolvem colando
 *   {i}     cinco    quantas exigem instalação
 *   {total} 10       o total em algarismo, para onde a prosa não vai
 */
export function contagens(pack) {
  const total = pack.ferramentas.length;
  const colam = pack.ferramentas.filter((f) => f.atalho).length;
  return {
    n: por(total), N: maiuscula(por(total)), n1: por(total - 1),
    c: por(colam), C: maiuscula(por(colam)), i: por(total - colam),
    total: String(total), plugin: pack.plugin,
  };
}
