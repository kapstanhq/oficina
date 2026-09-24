/* ═══ A marcação em linha do manifesto ════════════════════════════════════
   Uma frase de copy precisa, de vez em quando, de um link, de uma palavra em
   negrito ou de um nome de comando em mono. Três coisas, e só três.

   As alternativas eram piores: guardar HTML no manifesto obriga quem escreve
   copy a escrever tag (e a lembrar de escapar); quebrar a frase em três
   campos — antes, link, depois — não sobrevive à segunda frase que tem dois
   links. Isto é a mesma marca que o autor já digita em qualquer lugar.

     [texto](href)   vira <a>
     **forte**       vira <b>
     `código`        vira <code>

   ── O ESCAPE VEM PRIMEIRO, E ISSO É A SEGURANÇA INTEIRA ────────────────
   `escapar()` roda ANTES da conversão, então um `<script>` escrito no
   manifesto sai como texto e não como tag. O que a função gera depois disso
   é marcação que ela mesma escreveu, com o `href` restrito a caracteres sem
   espaço e com a aspa escapada. O consumidor é `{@html}` — e é por isso que
   esta é a única saída não escapada da Oficina, e o único arquivo em que a
   ordem das duas operações não é detalhe.

   O `href` NÃO é validado por esquema: a fonte é o manifesto do repositório,
   não entrada de visitante. Se um dia vier de fora, é aqui que a peneira
   entra — e é por isso que ela é uma função e não três `replace` soltos. */

const escapar = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function marcado(texto) {
  return escapar(texto)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
      (_, rotulo, href) => `<a href="${href.replace(/"/g, "&quot;")}">${rotulo}</a>`);
}

/**
 * O TEXTO DE UM BLOCO LITERAL — escapado, com os cabeçalhos `##` em `<b>`.
 *
 * Aqui NÃO vale a marcação de linha: o que está no bloco é o que se cola na
 * IA, e um `**forte**` do prompt tem de sair `**forte**` na área de
 * transferência. A única coisa que ele ganha é tinta nos cabeçalhos —
 * `--accent` sobre `--carvao` dá 7,54:1, a única superfície do site em que o
 * dourado passa como texto —, e ela existe porque dez telas de mono cinza
 * não dão uma âncora ao olho.
 *
 * O `##` FICA DENTRO do `<b>`: o que se copia é o `textContent`, e um `##`
 * fora da marca sairia na cor do corpo e leria como erro de digitação.
 *
 * O `[^<\n]*` é o portão: o texto já vem escapado, então uma linha com `<` é
 * uma linha que já ganhou tag de alguém. Embrulhá-la produziria tags
 * cruzadas, que o navegador desfaz de um jeito que ninguém escolheu.
 */
export const comoBloco = (texto) =>
  escapar(texto).replace(/^(#{1,6} [^<\n]*)$/gm, "<b>$1</b>");

/** o mesmo texto SEM marcação — para `aria-label`, `<title>` e o grafo */
export const semMarcas = (texto) => String(texto)
  .replace(/`([^`]+)`/g, "$1")
  .replace(/\*\*([^*]+)\*\*/g, "$1")
  .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
