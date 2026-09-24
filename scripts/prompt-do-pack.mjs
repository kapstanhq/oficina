/**
 * O PROMPT DE UM PACK TEM UMA FONTE E DUAS SAÍDAS, e este módulo é o que
 * mantém as duas verdadeiras ao mesmo tempo.
 *
 *   site/oficina/<slug>/prompt.md      a fonte, com blocos condicionais
 *        ├─→ a página                  todos os blocos no HTML, ligáveis
 *        └─→ oficina/<plugin>/PROMPT.md  achatado, sem marca nenhuma
 *
 * ── POR QUE A FONTE MORA NO SITE ──────────────────────────────────────
 * O balcão que monta variantes é a vitrine, e vitrine não desce para o
 * repositório público: quem clona `kapstanhq/oficina` leva o plugin — o
 * instalável, que é o que vira fonte de terceiro — e não a ferramenta que
 * traz visitante para cá. O arquivo que vai ao GitHub é o texto limpo, o
 * mesmo de sempre, e ele é GERADO: cópia à mão diverge na primeira correção,
 * e a divergência aqui é a página ensinando um prompt que o pack não tem.
 *
 * ── AS MARCAS ─────────────────────────────────────────────────────────
 *   [[se <id>]] … [[fim]]   condicional. Vale em linha inteira e no meio de
 *                           uma frase. Não aninha, e o parser recusa se
 *                           alguém tentar.
 *   [[campo <nome>]]        o que o corretor digita no balcão.
 *
 * ── E ELE É PURO, DE PROPÓSITO ────────────────────────────────────────
 * Sem leitura de disco e sem HTML próprio: quem escapa texto passa a função
 * de escape. É o que deixa o mesmo parser servir ao gerador da página, ao
 * `oficina.mjs` e ao `conferir.mjs` sem que nenhum dos três importe os
 * outros. O custo é um só, e vai declarado: o `servir.mjs` recarrega o
 * `artigo.mjs` a cada pedido, mas a importação DESTE arquivo é estática —
 * editar as regras de parsing aqui pede reiniciar o `npm run dev`.
 */

export const ABRE = "---8<--- COMEÇA O PROMPT";
export const FECHA = "---8<--- FIM DO PROMPT";

const RE_MARCA = /\[\[(se|fim|campo)(?:\s+([^\]]+))?\]\]/g;

/** o texto entre as tesouras, sem o cabeçalho nem o rodapé do arquivo */
export function entreTesouras(arquivo, ondeVeio) {
  const abre = arquivo.indexOf(ABRE);
  const fecha = arquivo.indexOf(FECHA);
  if (abre < 0 || fecha < abre) {
    throw new Error(ondeVeio + ": as duas marcas ---8<--- sumiram ou trocaram" +
      " de ordem — sem elas não há como saber onde o prompt começa");
  }
  return arquivo.slice(arquivo.indexOf("\n", abre) + 1, fecha).replace(/\s+$/, "");
}

/**
 * Fatia o prompt numa lista plana de pedaços:
 *   { tipo: "texto", texto }
 *   { tipo: "bloco", id, pedacos }     — os pedaços de dentro dele
 *   { tipo: "campo", nome }
 *
 * ── A RECUSA É O QUE FAZ ISTO VALER ─────────────────────────────────
 * `[[fim]]` sem abertura, `[[se]]` que nunca fecha, `[[se]]` dentro de
 * `[[se]]`: os três produziriam um prompt truncado ou com bloco preso
 * ligado, e o defeito seria silencioso — a página abre, o texto sai, e só
 * quem conhece o prompt inteiro percebe o que falta.
 */
export function fatiar(prompt, ondeVeio = "o prompt") {
  const raiz = [];
  let pilha = null;
  let ultimo = 0;

  const solto = (ate) => {
    const texto = prompt.slice(ultimo, ate);
    if (!texto) return;
    (pilha ? pilha.pedacos : raiz).push({ tipo: "texto", texto });
  };

  RE_MARCA.lastIndex = 0;
  for (let m; (m = RE_MARCA.exec(prompt)); ) {
    solto(m.index);
    ultimo = m.index + m[0].length;
    const [, verbo, arg] = m;

    if (verbo === "se") {
      if (!arg) throw new Error(ondeVeio + ": [[se]] sem id");
      if (pilha) {
        throw new Error(ondeVeio + `: [[se ${arg}]] dentro de [[se ${pilha.id}]]` +
          " — bloco não aninha, e ligar o de fora ligaria o de dentro sem querer");
      }
      pilha = { tipo: "bloco", id: arg.trim(), pedacos: [] };
    } else if (verbo === "fim") {
      if (!pilha) throw new Error(ondeVeio + ": [[fim]] sem [[se]] antes");
      raiz.push(pilha);
      pilha = null;
    } else {
      if (!arg) throw new Error(ondeVeio + ": [[campo]] sem nome");
      (pilha ? pilha.pedacos : raiz).push({ tipo: "campo", nome: arg.trim() });
    }
  }
  solto(prompt.length);
  if (pilha) {
    throw new Error(ondeVeio + `: [[se ${pilha.id}]] nunca fecha — um bloco` +
      " aberto engole o resto do prompt e ainda assim produz uma página que abre");
  }
  return raiz;
}

/** todos os ids de bloco que a fonte declara, na ordem em que aparecem */
export const idsDosBlocos = (pedacos) =>
  pedacos.filter((p) => p.tipo === "bloco").map((p) => p.id);

/** todos os nomes de campo, sem repetir */
export function nomesDosCampos(pedacos) {
  const nomes = new Set();
  const anda = (lista) => lista.forEach((p) => {
    if (p.tipo === "campo") nomes.add(p.nome);
    if (p.tipo === "bloco") anda(p.pedacos);
  });
  anda(pedacos);
  return [...nomes];
}

/**
 * O texto plano, com os blocos de `ligados` e os campos de `valores`.
 * É o que vira o `PROMPT.md` público — e é o mesmo caminho que o balcão
 * percorre no navegador, para que os dois nunca discordem.
 */
export function achatar(pedacos, ligados, valores = {}) {
  const liga = (id) => (ligados instanceof Set ? ligados.has(id) : !!ligados[id]);
  const texto = (lista) => lista.map((p) => {
    if (p.tipo === "texto") return p.texto;
    if (p.tipo === "campo") return valores[p.nome] || "";
    return liga(p.id) ? texto(p.pedacos) : "";
  }).join("");
  return texto(pedacos).replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * O mesmo prompt em HTML, com cada bloco num `<span data-bloco>` e cada
 * campo num `<span data-campo>`.
 *
 * ── O BLOCO DESLIGADO NASCE NO HTML, E ESCONDIDO ───────────────────────
 * Ele precisa estar lá para o balcão poder LIGÁ-LO sem ir buscar texto em
 * lugar nenhum — não há segunda cópia do prompt em JSON, e o que está na
 * tela é a fonte. Sem JavaScript o que sobra é o estado inicial, que é o
 * mesmo texto do repositório público: a página não fica pior, fica igual à
 * de antes do balcão existir.
 */
export function emHtml(pedacos, ligados, escapar) {
  const liga = (id) => (ligados instanceof Set ? ligados.has(id) : !!ligados[id]);
  const monta = (lista) => lista.map((p) => {
    if (p.tipo === "texto") return escapar(p.texto);
    if (p.tipo === "campo") return `<span data-campo="${escapar(p.nome)}"></span>`;
    return `<span data-bloco="${escapar(p.id)}"${liga(p.id) ? "" : " hidden"}>` +
      monta(p.pedacos) + "</span>";
  }).join("");
  return monta(pedacos);
}
