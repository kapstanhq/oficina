/**
 * O MASCOTE — o núcleo, sem DOM (D279).
 *
 * Um personagem é um JSON (`personagens/*.json`): o corpo, as cores, as
 * EXPRESSÕES — um rosto parado: olhos, pálpebras, boca, bochechas, para onde
 * olha, quanto inclina — e as ANIMAÇÕES — passos `{ expressao, transicao,
 * segura }` em laço ou uma vez, com piscada e um movimento de fundo.
 *
 * Aqui só há conta: dado o personagem, a animação e o tempo, que rosto se vê
 * e onde fica cada forma. Quem desenha é `svg.js`, e quem vira etiqueta de
 * HTML é `elemento.js`. Por isso isto roda no Node, e a prova não abre
 * navegador (`node mascote/prova.mjs`).
 *
 *   quadro(p, "lendo", decorrido, { origem })   → { expressao, fim }
 *   movimento("flutua", t)                      → { dx, dy, giro, sx, sy }
 *   abertura(t, 160)                            → 0…1, o olho na piscada
 *   cena(p, expressao, { mov, olhos })          → a geometria de cada forma
 *
 * O tempo é sempre injetado, e o acaso também (`proximaPiscada`): a mesma
 * entrada dá o mesmo quadro, que é o que deixa a prova medir.
 */

export const FORMATO = "kapstan/mascote";

/* o rosto de partida de qualquer personagem: o `neutra` dele vem por cima */
const BASE = {
  olhos: {
    afastamento: 46, y: -4,
    esquerdo: { largura: 19, altura: 32, x: 0, y: 0, angulo: 0, tampa: 0, tampaAngulo: 0, base: 0, baseCurva: 0 },
    direito: { largura: 19, altura: 32, x: 0, y: 0, angulo: 0, tampa: 0, tampaAngulo: 0, base: 0, baseCurva: 0 },
  },
  olhar: { x: 0, y: 0 },
  cabeca: { inclina: 0, x: 0, y: 0 },
  corpo: { largura: 1, altura: 1 },
  boca: { largura: 14, curva: 0.3, abertura: 0, y: 24 },
  bochechas: 0.3,
};

const ehObjeto = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/* junta `por` em cima de `de`, e `olhos.ambos` vale para os dois olhos antes
   do que for de um só */
function juntar(de, por) {
  if (!ehObjeto(por)) return de;
  const saida = { ...de };
  for (const [k, v] of Object.entries(por)) {
    if (k === "de") continue;
    if (k === "ambos") continue;
    saida[k] = ehObjeto(v) && ehObjeto(de[k]) ? juntar(de[k], v) : v;
  }
  if (ehObjeto(por.ambos)) {
    for (const lado of ["esquerdo", "direito"]) {
      saida[lado] = juntar(saida[lado], { ...por.ambos, ...(por[lado] || {}) });
    }
  }
  return saida;
}

/** a expressão INTEIRA de uma chave: `neutra` e, se ela diz `de`, a mãe dela */
export function expressaoDe(p, chave = "neutra", caminho = []) {
  const neutra = juntar(BASE, p?.neutra || {});
  if (chave === "neutra") return neutra;
  const parcial = p?.expressoes?.[chave];
  if (!parcial || caminho.includes(chave)) return null;
  const mae = parcial.de ? expressaoDe(p, parcial.de, [...caminho, chave]) : neutra;
  return mae ? juntar(mae, parcial) : null;
}

/** o meio do caminho entre dois rostos: número por número */
export function misturar(a, b, k) {
  if (typeof a === "number" && typeof b === "number") return a + (b - a) * k;
  if (ehObjeto(a) && ehObjeto(b)) {
    const saida = {};
    for (const chave of Object.keys(b)) saida[chave] = chave in a ? misturar(a[chave], b[chave], k) : b[chave];
    return saida;
  }
  return k < 0.5 ? a : b;
}

export const CURVAS = {
  linear: (t) => t,
  suave: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  /* passa um pouco do ponto e volta: é o que dá vida à mudança de rosto */
  mola: (t) => { const c = 1.6; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; },
  seco: (t) => (t < 1 ? 0 : 1),
};

/**
 * A animação no instante `decorrido` (ms desde que começou). No laço, o
 * primeiro passo do primeiro ciclo parte de `origem` — o rosto que estava na
 * tela —, e os seguintes partem do último passo. `uma` para no último passo e
 * devolve `fim`. `reduzido` pula as transições.
 */
export function quadro(p, chave, decorrido, { origem = null, reduzido = false } = {}) {
  const anim = p?.animacoes?.[chave];
  const passos = (anim?.passos || []).map((s) => ({
    rosto: expressaoDe(p, s.expressao) || expressaoDe(p),
    transicao: reduzido ? 0 : Math.max(0, s.transicao ?? 300),
    segura: Math.max(0, s.segura ?? 1000),
    curva: CURVAS[s.curva] || CURVAS.suave,
  }));
  if (!passos.length) return { expressao: origem || expressaoDe(p), fim: true, passo: -1 };
  const ciclo = passos.reduce((n, s) => n + s.transicao + s.segura, 0) || 1;
  const t = Math.max(0, decorrido);
  const uma = anim.modo === "uma";
  if (uma && t >= ciclo) return { expressao: passos.at(-1).rosto, fim: true, passo: passos.length - 1 };
  const volta = Math.floor(t / ciclo);
  let resto = t % ciclo;
  for (let i = 0; i < passos.length; i++) {
    const s = passos[i];
    if (resto < s.transicao + s.segura) {
      const antes = i > 0 ? passos[i - 1].rosto : volta === 0 ? origem || s.rosto : passos.at(-1).rosto;
      const k = s.transicao && resto < s.transicao ? s.curva(resto / s.transicao) : 1;
      return { expressao: k >= 1 ? s.rosto : misturar(antes, s.rosto, k), fim: false, passo: i };
    }
    resto -= s.transicao + s.segura;
  }
  return { expressao: passos.at(-1).rosto, fim: uma, passo: passos.length - 1 };
}

/* ── O MOVIMENTO DE FUNDO ─────────────────────────────────────────────
   O corpo nunca fica parado de todo — parado é o que parece travado, e o
   bloco de status existe para distinguir trabalho de travamento. Cada um é
   uma senoide de período próprio, em ms. */
const onda = (t, periodo) => Math.sin((2 * Math.PI * t) / periodo);
const PARADO = { dx: 0, dy: 0, giro: 0, sx: 1, sy: 1 };

export function movimento(tipo, t, { reduzido = false } = {}) {
  if (reduzido) return PARADO;
  const respira = onda(t, 3400);
  const base = { ...PARADO, sy: 1 + 0.016 * respira, sx: 1 - 0.008 * respira };
  switch (tipo) {
    case "respira": return base;
    case "flutua": return { ...base, dy: -3.5 * (0.5 + 0.5 * onda(t, 2800)) };
    case "balanca": return { ...base, giro: 3.2 * onda(t, 2600), dx: 1.8 * onda(t, 2600) };
    case "trabalha": return { ...base, dy: -1.6 * Math.abs(onda(t, 760)), giro: 1.1 * onda(t, 1520) };
    case "treme": return { ...base, dx: 1.3 * onda(t, 96), giro: 0.5 * onda(t, 140) };
    case "pula": {
      const fase = (t % 860) / 860;
      const salto = Math.sin(Math.PI * fase);
      /* achata ao tocar o chão, estica no ar */
      const pouso = salto < 0.25 ? 1 - salto / 0.25 : 0;
      return { dx: 0, dy: -15 * salto, giro: 0, sx: 1 - 0.03 * salto + 0.06 * pouso, sy: 1 + 0.05 * salto - 0.08 * pouso };
    }
    default: return PARADO;
  }
}

/** o olho durante a piscada: 1 aberto, perto de 0 fechado, e 1 de novo */
export function abertura(desde, duracao = 160) {
  if (!(desde >= 0) || desde >= duracao) return 1;
  return Math.max(0.08, 1 - Math.sin((Math.PI * desde) / duracao));
}

/** quando é a próxima piscada: entre `min` e `max` depois de `agora` */
export function proximaPiscada(piscar, agora, acaso = Math.random) {
  if (!piscar) return Infinity;
  const min = piscar.min ?? 2400, max = Math.max(min, piscar.max ?? 5200);
  return agora + min + acaso() * (max - min);
}

/* ── A GEOMETRIA ──────────────────────────────────────────────────────
   Tudo em coordenadas do CORPO, com a origem no meio da base dele: o `svg.js`
   põe o grupo do corpo no chão e escala a partir dali, e o achatado do pulo
   sai natural. A vista é 200 × 200. */
export const VISTA = 200;
export const CHAO = 186;

const rad = (g) => (g * Math.PI) / 180;
const r1 = (n) => Math.round(n * 100) / 100;

/* o recorte das pálpebras, no espaço do olho (centro em 0,0): acima da linha
   de cima e abaixo da curva de baixo não se vê. `lado` 1 é o olho direito,
   cujo canto de dentro é o esquerdo — o ângulo positivo baixa o canto de
   dentro nos dois olhos, e é a cara de bravo */
export function recorte(o, lado) {
  const { largura: w, altura: h } = o;
  const W = w / 2 + 4;
  const topo = -h / 2 + clamp(o.tampa, 0, 1) * h;
  const inclina = Math.tan(rad(o.tampaAngulo || 0)) * (w / 2);
  const naEsquerda = lado > 0 ? topo + inclina : topo - inclina;
  const naDireita = lado > 0 ? topo - inclina : topo + inclina;
  const em = (x) => (naEsquerda + naDireita) / 2 + ((naDireita - naEsquerda) / w) * x;
  const baixo = h / 2 - clamp(o.base, 0, 1) * h;
  /* o topo da curva de baixo fica abaixo da pálpebra, senão o recorte vira */
  let controle = baixo - (o.baseCurva || 0) * h * 1.6;
  controle = Math.max(controle, 2 * (Math.max(naEsquerda, naDireita) + 1.5) - baixo);
  return `M${r1(-W)} ${r1(em(-W))}L${r1(W)} ${r1(em(W))}L${r1(W)} ${r1(baixo)}Q0 ${r1(controle)} ${r1(-W)} ${r1(baixo)}Z`;
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, Number(v) || 0));

/** onde fica cada forma, para um rosto e um instante do movimento */
export function cena(p, e, { mov = PARADO, olhos = 1 } = {}) {
  const C = { largura: 150, altura: 128, raio: 44, ...(p?.corpo || {}) };
  const W = C.largura * e.corpo.largura, H = C.altura * e.corpo.altura;
  const ox = e.olhar.x, oy = e.olhar.y;
  const nivel = -H / 2 + e.olhos.y + oy;
  /* virar o rosto aproxima os olhos e encurta o do lado para onde ele vira */
  const meio = (e.olhos.afastamento / 2) * (1 - Math.min(0.4, Math.abs(ox) / 120));
  const olho = (o, lado) => {
    const encurta = 1 - clamp((lado * ox) / 85, -0.18, 0.18);
    const w = o.largura * encurta, h = o.altura;
    return {
      cx: r1(lado * meio + ox + o.x), cy: r1(nivel + o.y), largura: r1(w), altura: r1(h),
      raio: r1(Math.min(w, h) / 2), angulo: r1(o.angulo), escalaY: r1(clamp(olhos, 0.05, 1)),
      recorte: recorte({ ...o, largura: w }, lado),
      reflexo: o.tampa > 0.6 || o.baseCurva > 0.45 ? null
        : { cx: r1(-w * 0.2), cy: r1(-h * 0.24 + clamp(o.tampa, 0, 1) * h * 0.5), r: r1(Math.min(w, h) * 0.14) },
    };
  };
  const L = Math.max(0, e.boca.largura);
  const c1 = e.boca.curva * L * 0.55, c2 = c1 + clamp(e.boca.abertura, 0, 1.2) * L * 0.8;
  const subiu = Math.max(0, -(mov.dy + e.cabeca.y));
  return {
    vista: VISTA,
    chao: { cx: r1(VISTA / 2 + e.cabeca.x + mov.dx * 0.5), cy: CHAO + 2, rx: r1((W / 2) * 0.8 * (1 - subiu / 70)),
      ry: r1(7 * (1 - subiu / 90)), opacidade: r1(0.16 * (1 - subiu / 45)) },
    corpo: { x: r1(VISTA / 2 + e.cabeca.x + mov.dx), y: r1(CHAO + e.cabeca.y + mov.dy),
      giro: r1(e.cabeca.inclina + mov.giro), sx: r1(mov.sx), sy: r1(mov.sy),
      largura: r1(W), altura: r1(H), raio: r1(Math.min(C.raio, W / 2, H / 2)) },
    brilho: { cx: r1(-W * 0.2 - ox * 0.25), cy: r1(-H * 0.83), rx: r1(W * 0.17), ry: r1(H * 0.065) },
    olhos: [olho(e.olhos.esquerdo, -1), olho(e.olhos.direito, 1)],
    boca: L < 1 ? null : { x: r1(ox * 0.85), y: r1(-H / 2 + e.boca.y + oy * 0.7),
      d: `M${r1(-L / 2)} 0Q0 ${r1(c1)} ${r1(L / 2)} 0Q0 ${r1(c2)} ${r1(-L / 2)} 0Z` },
    bochechas: {
      opacidade: r1(clamp(e.bochechas, 0, 1) * 0.7),
      formas: [-1, 1].map((lado) => ({ cx: r1(lado * (meio + 12) + ox * 0.8), cy: r1(nivel + e.olhos.direito.altura / 2 + 7),
        rx: 11, ry: 6 })),
    },
  };
}

/**
 * O personagem serve? Devolve `{ ok, erros }` — cada erro com o caminho.
 * O que se confere é o que quebraria o desenho sem avisar: expressão que não
 * existe, passo sem tempo, número que não é número.
 */
export function validarPersonagem(p) {
  const erros = [];
  const erro = (onde, oque) => erros.push({ onde, oque });
  if (!ehObjeto(p)) return { ok: false, erros: [{ onde: "", oque: "o personagem não é um objeto" }] };
  if (p.formato !== FORMATO) erro("formato", `esperava "${FORMATO}"`);
  const numeros = (o, onde) => {
    for (const [k, v] of Object.entries(o || {})) {
      if (ehObjeto(v)) numeros(v, `${onde}.${k}`);
      else if (k !== "de" && typeof v !== "number") erro(`${onde}.${k}`, "não é número");
      else if (typeof v === "number" && !Number.isFinite(v)) erro(`${onde}.${k}`, "não é finito");
    }
  };
  numeros(p.neutra, "neutra");
  for (const [k, e] of Object.entries(p.expressoes || {})) {
    numeros(e, `expressoes.${k}`);
    if (e.de && e.de !== "neutra" && !p.expressoes[e.de]) erro(`expressoes.${k}.de`, `“${e.de}” não existe`);
    if (!expressaoDe(p, k)) erro(`expressoes.${k}`, "não se resolve (a mãe dela volta a ela?)");
  }
  const animacoes = Object.entries(p.animacoes || {});
  if (!animacoes.length) erro("animacoes", "não há nenhuma");
  for (const [k, a] of animacoes) {
    if (!Array.isArray(a.passos) || !a.passos.length) erro(`animacoes.${k}.passos`, "não há passo");
    (a.passos || []).forEach((s, i) => {
      if (s.expressao !== "neutra" && !p.expressoes?.[s.expressao]) erro(`animacoes.${k}.passos.${i}`, `a expressão “${s.expressao}” não existe`);
      if (s.curva && !CURVAS[s.curva]) erro(`animacoes.${k}.passos.${i}.curva`, `“${s.curva}” não é uma curva`);
    });
    if (a.depois && !p.animacoes[a.depois]) erro(`animacoes.${k}.depois`, `“${a.depois}” não existe`);
    if (a.modo && !["laco", "uma"].includes(a.modo)) erro(`animacoes.${k}.modo`, "é `laco` ou `uma`");
  }
  if (p.padrao && !p.animacoes?.[p.padrao]) erro("padrao", `a animação “${p.padrao}” não existe`);
  return { ok: !erros.length, erros };
}
