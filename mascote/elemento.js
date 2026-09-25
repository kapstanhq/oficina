/**
 * O MASCOTE COMO ETIQUETA DE HTML (D279) — para quem não usa Svelte: outro
 * plugin, a página que uma skill gera, o site.
 *
 *   import { definirMascote } from "mascote/elemento.js";
 *   import kap from "mascote/personagens/kap.json";
 *   definirMascote({ personagem: kap });              // <kapstan-mascote>
 *
 *   <kapstan-mascote animacao="lendo" tamanho="64"></kapstan-mascote>
 *   <kapstan-mascote expressao="feliz" rotulo="Kap, contente"></kapstan-mascote>
 *
 * `animacao` e `expressao` mudam na hora. `tamanho` é número (px) ou medida
 * de CSS. Sem `rotulo`, o boneco é enfeite e fica fora da leitura de tela —
 * quem o usa diz o estado em texto, ao lado. Outro personagem é outra
 * etiqueta: `definirMascote({ nome: "outro-mascote", personagem })`.
 */
import { montarMascote } from "./svg.js";

export function definirMascote({ nome = "kapstan-mascote", personagem } = {}) {
  if (typeof customElements === "undefined") return null;
  const ja = customElements.get(nome);
  if (ja) return ja;

  class Mascote extends HTMLElement {
    static observedAttributes = ["animacao", "expressao", "tamanho", "rotulo"];
    #m = null;

    connectedCallback() {
      this.#medir();
      this.style.display ||= "inline-block";
      this.#m = montarMascote(this, personagem, {
        animacao: this.getAttribute("animacao") || undefined,
        expressao: this.getAttribute("expressao") || undefined,
        rotulo: this.getAttribute("rotulo") || "",
      });
    }
    disconnectedCallback() { this.#m?.destruir(); this.#m = null; }
    attributeChangedCallback(atributo, _antes, agora) {
      if (atributo === "tamanho") return this.#medir();
      if (!this.#m) return;
      if (atributo === "animacao" && agora) this.#m.tocar(agora);
      if (atributo === "expressao" && agora) this.#m.expressao(agora);
      if (atributo === "rotulo") { this.#m.destruir(); this.#m = null; this.connectedCallback(); }
    }
    /** o controle do desenho: tocar, expressao, pausar, retomar, estado */
    get mascote() { return this.#m; }
    #medir() {
      const t = this.getAttribute("tamanho") || "64";
      const medida = /^\d+(\.\d+)?$/.test(t) ? `${t}px` : t;
      this.style.width = medida;
      this.style.height = medida;
    }
  }
  customElements.define(nome, Mascote);
  return Mascote;
}
