<script>
  /**
   * UM TEXTO COM OS IDS VIRANDO LINK (D239).
   *
   * `contato: P-005 (Helena Prates)`, a linha de `## Fala por`, o histórico —
   * onde há um id que existe como arquivo na base, há um link para ele. É a
   * `idsDaLinha` do funil, desenhada em todo texto da casa. Sem `indice`, ou
   * sem id conhecido, é só o texto: nada aqui inventa destino.
   */
  import { paraArquivo } from "../rota.js";

  let { texto = "", indice = null } = $props();

  const RE = /\b([\p{Lu}]{1,4}-\d{1,6})\b/gu;
  const partes = $derived((() => {
    const t = String(texto ?? "");
    if (!indice?.size) return [{ texto: t }];
    const saida = [];
    let i = 0;
    for (const m of t.matchAll(RE)) {
      const caminho = indice.get(m[1]);
      if (!caminho) continue;
      if (m.index > i) saida.push({ texto: t.slice(i, m.index) });
      saida.push({ texto: m[1], href: paraArquivo(caminho) });
      i = m.index + m[1].length;
    }
    if (i < t.length) saida.push({ texto: t.slice(i) });
    return saida;
  })());
</script>

{#each partes as p, k (k)}{#if p.href}<a class="p-id-link" href={p.href}>{p.texto}</a>{:else}{p.texto}{/if}{/each}
