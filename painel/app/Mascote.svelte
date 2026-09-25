<script>
  /**
   * O MASCOTE NO PAINEL (D279) — a casca Svelte de `mascote/svg.js`. O
   * boneco, as expressões e as animações moram em `mascote/`, fora do
   * painel, para outro plugin usar o mesmo sem Svelte (`mascote/elemento.js`).
   *
   * `animacao` troca na hora, partindo do rosto que está na tela. Sem
   * `rotulo` ele é enfeite: quem o usa diz o estado em texto, ao lado.
   */
  import { untrack } from "svelte";
  import { montarMascote } from "../../mascote/svg.js";
  import kap from "../../mascote/personagens/kap.json";

  let { animacao = "parado", personagem = kap, tamanho = 64, rotulo = "" } = $props();

  let alvo = $state(null);
  let mascote = null;
  $effect(() => {
    if (!alvo) return;
    mascote = montarMascote(alvo, personagem, { animacao: untrack(() => animacao), rotulo });
    return () => { mascote?.destruir(); mascote = null; };
  });
  $effect(() => { mascote?.tocar(animacao); });
</script>

<span class="p-mascote" bind:this={alvo} style:--mascote-tamanho="{tamanho}px"></span>
