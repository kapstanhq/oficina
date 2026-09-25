/**
 * O MASCOTE NA TELA — o desenho em SVG, sobre o núcleo (D279).
 *
 *   import { montarMascote } from "mascote/svg.js";
 *   const m = montarMascote(elemento, personagem, { animacao: "lendo", rotulo: "" });
 *   m.tocar("comemorando");   m.expressao("feliz");   m.pausar();   m.retomar();
 *   m.estado();               m.destruir();
 *
 * As cores são variáveis de CSS com a do personagem por reserva —
 * `--mascote-corpo`, `-luz`, `-sombra`, `-olhos`, `-brilho`, `-boca`,
 * `-bochechas`, `-chao` —, e é assim que outro plugin veste o mesmo boneco
 * com a marca dele sem mexer no JSON.
 *
 * Três cuidados que custam caro quando faltam:
 *   · o laço dorme com a aba escondida ou o mascote fora da tela: um relógio
 *     de 60 quadros por segundo que ninguém vê é bateria de quem trabalha
 *   · `prefers-reduced-motion` desliga transição e movimento de fundo; a
 *     piscada fica, porque sem ela o rosto parece travado
 *   · trocar de animação parte do rosto que ESTÁ na tela: sem isso o rosto
 *     salta, e o salto lê como defeito
 * A cor vai por `style.setProperty`, e não por atributo `style`: é CSSOM, e
 * passa por CSP que proíbe estilo embutido.
 */
import { abertura, cena, expressaoDe, movimento, proximaPiscada, quadro, validarPersonagem, VISTA } from "./nucleo.js";

const NS = "http://www.w3.org/2000/svg";
let contador = 0;

const COR = (p, nome) => `var(--mascote-${nome}, ${p?.cores?.[nome] || "#888"})`;

function criar(nome, atributos = {}, pai = null) {
  const el = document.createElementNS(NS, nome);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  if (pai) pai.appendChild(el);
  return el;
}
const pintar = (el, prop, valor) => { el.style.setProperty(prop, valor); return el; };

export function montarMascote(alvo, personagem, opcoes = {}) {
  const validado = validarPersonagem(personagem);
  if (!validado.ok) {
    const e = validado.erros[0];
    throw new Error(`mascote: ${e.onde} — ${e.oque}`);
  }
  const p = personagem;
  const id = `mascote-${++contador}`;
  const agoraDe = opcoes.relogio || (() => performance.now());
  const acaso = opcoes.acaso || Math.random;

  /* ── O ESQUELETO: criado uma vez; o quadro só muda atributos ───────── */
  const svg = criar("svg", { viewBox: `0 0 ${VISTA} ${VISTA}`, width: "100%", height: "100%", focusable: "false" });
  svg.style.display = "block";
  svg.style.overflow = "visible";
  if (opcoes.rotulo) { svg.setAttribute("role", "img"); svg.setAttribute("aria-label", opcoes.rotulo); }
  else svg.setAttribute("aria-hidden", "true");
  const defs = criar("defs", {}, svg);
  const grad = criar("linearGradient", { id: `${id}-pele`, x1: "0", y1: "0", x2: "0", y2: "1" }, defs);
  pintar(criar("stop", { offset: "0" }, grad), "stop-color", COR(p, "luz"));
  pintar(criar("stop", { offset: "0.55" }, grad), "stop-color", COR(p, "corpo"));
  pintar(criar("stop", { offset: "1" }, grad), "stop-color", COR(p, "sombra"));
  const recortes = [0, 1].map((i) => criar("path", {}, criar("clipPath", { id: `${id}-olho-${i}` }, defs)));

  const chao = pintar(criar("ellipse", {}, svg), "fill", COR(p, "chao"));
  const corpo = criar("g", {}, svg);
  const pele = criar("rect", { fill: `url(#${id}-pele)` }, corpo);
  const brilho = pintar(criar("ellipse", { opacity: "0.22" }, corpo), "fill", COR(p, "brilho"));
  const bochechas = criar("g", {}, corpo);
  const bocheca = [0, 1].map(() => pintar(criar("ellipse", {}, bochechas), "fill", COR(p, "bochechas")));
  const olhos = [0, 1].map((i) => {
    const g = criar("g", {}, corpo);
    const dentro = criar("g", { "clip-path": `url(#${id}-olho-${i})` }, g);
    const forma = pintar(criar("rect", {}, dentro), "fill", COR(p, "olhos"));
    const reflexo = pintar(criar("circle", {}, dentro), "fill", COR(p, "brilho"));
    return { g, forma, reflexo };
  });
  const boca = criar("path", { "stroke-width": "3.2", "stroke-linecap": "round", "stroke-linejoin": "round" }, corpo);
  pintar(pintar(boca, "fill", COR(p, "boca")), "stroke", COR(p, "boca"));
  alvo.appendChild(svg);

  /* ── O ESTADO DO QUE TOCA ────────────────────────────────────────────── */
  const midia = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  let reduzido = opcoes.reduzido ?? Boolean(midia?.matches);
  const aoMudarMidia = () => { if (opcoes.reduzido === undefined) reduzido = Boolean(midia?.matches); };
  midia?.addEventListener?.("change", aoMudarMidia);

  let animacao = "";
  let inicio = agoraDe();
  let origem = null;
  let rosto = expressaoDe(p);
  let fixo = null;
  let pausado = false;
  let avisado = false;
  let piscaEm = Infinity, piscaDesde = -Infinity;
  const t0 = agoraDe();

  function tocar(chave) {
    const nova = p.animacoes[chave] ? chave : p.padrao || Object.keys(p.animacoes)[0];
    if (nova === animacao && !fixo) return nova;
    origem = rosto;
    fixo = null;
    avisado = false;
    animacao = nova;
    inicio = agoraDe();
    piscaEm = proximaPiscada(p.animacoes[nova].piscar, inicio, acaso);
    return nova;
  }
  function expressao(chave) {
    const e = expressaoDe(p, chave);
    if (!e) return false;
    fixo = e;
    return true;
  }

  function desenhar(agora) {
    const anim = p.animacoes[animacao];
    const q = fixo ? { expressao: fixo, fim: false } : quadro(p, animacao, agora - inicio, { origem, reduzido });
    rosto = q.expressao;
    if (q.fim && !avisado) {
      avisado = true;
      const acabou = animacao;
      if (anim?.depois) tocar(anim.depois);
      opcoes.aoTerminar?.(acabou);
    }
    const piscar = anim?.piscar;
    if (piscar && agora >= piscaEm) { piscaDesde = agora; piscaEm = proximaPiscada(piscar, agora + (piscar.duracao ?? 160), acaso); }
    const olhosAbertos = piscar ? abertura(agora - piscaDesde, piscar.duracao ?? 160) : 1;
    const c = cena(p, rosto, { mov: movimento(anim?.movimento, agora - t0, { reduzido }), olhos: olhosAbertos });

    chao.setAttribute("cx", c.chao.cx); chao.setAttribute("cy", c.chao.cy);
    chao.setAttribute("rx", c.chao.rx); chao.setAttribute("ry", c.chao.ry); chao.setAttribute("opacity", c.chao.opacidade);
    const k = c.corpo;
    corpo.setAttribute("transform", `translate(${k.x} ${k.y}) rotate(${k.giro}) scale(${k.sx} ${k.sy})`);
    pele.setAttribute("x", -k.largura / 2); pele.setAttribute("y", -k.altura);
    pele.setAttribute("width", k.largura); pele.setAttribute("height", k.altura);
    pele.setAttribute("rx", k.raio);
    brilho.setAttribute("cx", c.brilho.cx); brilho.setAttribute("cy", c.brilho.cy);
    brilho.setAttribute("rx", c.brilho.rx); brilho.setAttribute("ry", c.brilho.ry);
    bochechas.setAttribute("opacity", c.bochechas.opacidade);
    c.bochechas.formas.forEach((f, i) => {
      bocheca[i].setAttribute("cx", f.cx); bocheca[i].setAttribute("cy", f.cy);
      bocheca[i].setAttribute("rx", f.rx); bocheca[i].setAttribute("ry", f.ry);
    });
    c.olhos.forEach((o, i) => {
      const { g, forma, reflexo } = olhos[i];
      g.setAttribute("transform", `translate(${o.cx} ${o.cy}) rotate(${o.angulo}) scale(1 ${o.escalaY})`);
      recortes[i].setAttribute("d", o.recorte);
      forma.setAttribute("x", -o.largura / 2); forma.setAttribute("y", -o.altura / 2);
      forma.setAttribute("width", o.largura); forma.setAttribute("height", o.altura);
      forma.setAttribute("rx", o.raio);
      if (o.reflexo) {
        reflexo.setAttribute("cx", o.reflexo.cx); reflexo.setAttribute("cy", o.reflexo.cy);
        reflexo.setAttribute("r", o.reflexo.r); reflexo.removeAttribute("visibility");
      } else reflexo.setAttribute("visibility", "hidden");
    });
    if (c.boca) {
      boca.setAttribute("d", c.boca.d);
      boca.setAttribute("transform", `translate(${c.boca.x} ${c.boca.y})`);
      boca.removeAttribute("visibility");
    } else boca.setAttribute("visibility", "hidden");
  }

  /* ── O LAÇO, QUE DORME QUANDO NINGUÉM VÊ ───────────────────────────── */
  let quadroPedido = 0;
  let visivel = true;
  const passo = () => {
    quadroPedido = 0;
    if (pausado || !visivel || document.hidden) return;
    desenhar(agoraDe());
    quadroPedido = requestAnimationFrame(passo);
  };
  const acordar = () => { if (!quadroPedido && !pausado && visivel && !document.hidden) quadroPedido = requestAnimationFrame(passo); };
  const aoMudarAba = () => acordar();
  document.addEventListener("visibilitychange", aoMudarAba);
  const observador = typeof IntersectionObserver === "function"
    ? new IntersectionObserver((ents) => { visivel = ents.some((e) => e.isIntersecting); acordar(); })
    : null;
  observador?.observe(alvo);

  tocar(opcoes.animacao || p.padrao);
  if (opcoes.expressao) expressao(opcoes.expressao);
  desenhar(agoraDe());
  acordar();

  return {
    tocar(chave) { const t = tocar(chave); acordar(); return t; },
    expressao(chave) { const ok = expressao(chave); acordar(); return ok; },
    pausar() { pausado = true; if (quadroPedido) cancelAnimationFrame(quadroPedido); quadroPedido = 0; },
    retomar() { pausado = false; acordar(); },
    estado() { return { animacao, expressao: fixo ? "fixa" : "", pausado, reduzido }; },
    /** desenha um instante exato — para prova e captura, sem depender do relógio */
    desenharEm(ms) { desenhar(ms); },
    destruir() {
      if (quadroPedido) cancelAnimationFrame(quadroPedido);
      observador?.disconnect();
      document.removeEventListener("visibilitychange", aoMudarAba);
      midia?.removeEventListener?.("change", aoMudarMidia);
      svg.remove();
    },
  };
}
