<script>
  /* A VISTA DE PROVA de um pack (D267): `vista: "contagem"`, com
     `dados: { itens: [{ rotulo, n }] }`. Existe para a prova da tela, e não
     vai para pack nenhum. Usa uma peça comum pelo alias, devolve um gesto
     próprio e traz `<style>` — as três coisas que um componente de pack faz. */
  import ComIds from "@oficina/painel/comum/ComIds.svelte";

  let { dados = {}, agir = () => {}, extra = $bindable({}) } = $props();
  const itens = $derived(Array.isArray(dados.itens) ? dados.itens : []);
  const total = $derived(itens.reduce((n, it) => n + (Number(it?.n) || 0), 0));
</script>

<ul class="contagem">
  {#each itens as it, i (i)}
    <li><ComIds texto={String(it?.rotulo ?? "")} /> <b>{Number(it?.n) || 0}</b></li>
  {/each}
</ul>
<p class="c-nota">Total: <b data-total>{total}</b></p>
<button type="button" class="c-acao" onclick={() => agir("contei", { total })}>Conferir a contagem</button>

<style>
  .contagem { list-style: none; display: grid; gap: var(--s1); }
  .contagem li { display: flex; justify-content: space-between; }
</style>
