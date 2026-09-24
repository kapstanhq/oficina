<script>
  /**
   * FEEDBACK — o fecho do contrato §10, desenhado.
   *
   * Os três títulos são exatos e a ordem não muda, porque ela é normativa:
   *
   *   ## Guardei          o que foi para a base, com o caminho
   *   ## Falta saber      os `?` que esta execução criou ou não resolveu
   *   ## Decidi sozinho   só em modo automático
   *
   * ── `## GUARDEI` NÃO SOME NUNCA ───────────────────────────────────────
   * É a regra mais importante do §10, e ela é contraintuitiva: uma skill que
   * não gravou nada mostra a seção assim mesmo, com o motivo.
   *
   *   "Omitir a seção é o que faz o profissional achar que ficou guardado, e
   *    a regra aqui é a mesma do 'escreveu, diz onde', virada do avesso: ele
   *    precisa saber que NÃO ficou."
   *
   * A tela obedece: sem `guardei`, ela escreve a linha em vez de esconder o
   * bloco. Um painel que mostrasse só o que aconteceu seria pior que o
   * terminal, porque parece completo.
   *
   * ── E `DECIDI SOZINHO` TEM TRÊS PARTES ────────────────────────────────
   * "Uma linha por escolha: o que fiz — por que — como desfazer." A tela
   * aceita a linha pronta (string) ou as três partes separadas, e quando vêm
   * separadas ela marca a ausência do desfazer — que o contrato permite num
   * caso só, a mensagem que já saiu.
   */
  let { dados = {}, agir = () => {}, extra = $bindable({}) } = $props();

  const guardei = $derived(dados.guardei || []);
  const falta = $derived(dados.faltaSaber || dados.falta || []);
  const decidi = $derived(dados.decidiSozinho || dados.decidi || []);
</script>

<section class="c-secao" style="gap:var(--s1)">
  <span class="c-selo c-selo-verd">Guardei</span>
  {#if !guardei.length}
    <p class="c-corpo">
      {dados.motivo || "nada foi gravado nesta rodada"} — a base não mudou.
    </p>
  {:else}
    <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--s1)">
      {#each guardei as g, i (i)}
        <li class="c-corpo" style="display:grid;gap:2px">
          <!-- o caminho vem em mono porque é um endereço de arquivo: ele
               existe para a pessoa ACHAR a coisa, e não para ler bonito -->
          <span style="font-family:var(--mono);font-size:var(--t-comando)">
            {typeof g === "string" ? g : g.onde}</span>
          {#if typeof g === "object" && g.oque}
            <span class="c-nota">{g.oque}</span>{/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>

{#if falta.length}
  <section class="c-secao" style="gap:var(--s1)">
    <span class="c-selo c-selo-ambar">Falta saber</span>
    <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--s1)">
      {#each falta as f, i (i)}
        <li class="c-corpo">{typeof f === "string" ? f : f.texto}</li>
      {/each}
    </ul>
  </section>
{/if}

{#if decidi.length}
  <section class="c-secao" style="gap:var(--s1)">
    <span class="c-selo">Decidi sozinho</span>
    <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--s2)">
      {#each decidi as d, i (i)}
        <li class="c-corpo" style="display:grid;gap:2px">
          <span>{typeof d === "string" ? d : d.oque}</span>
          {#if typeof d === "object"}
            {#if d.porque}<span class="c-nota">porque {d.porque}</span>{/if}
            {#if d.desfazer}<span class="c-nota">para desfazer: {d.desfazer}</span>
            {:else}<span class="c-nota p-falta">isto não se desfaz</span>{/if}
          {/if}
        </li>
      {/each}
    </ul>
  </section>
{/if}
