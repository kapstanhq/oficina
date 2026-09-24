<script>
  /**
   * A BARRA DA FILA — "N decisões esperando o assistente" (D232).
   *
   * Presa ao pé do palco enquanto há decisão marcada e não gravada. Ela existe
   * para uma coisa: a pessoa não pode sair achando que o clique já valeu. A
   * marca só vira fato quando o assistente grava, e até lá a barra diz isso —
   * e diz COMO fazer acontecer.
   *
   * ── TRÊS SITUAÇÕES, TRÊS JEITOS DE GRAVAR ─────────────────────────────
   *   o assistente está parado no painel   → "Gravar agora" manda na hora
   *   o painel pode chamá-lo sozinho        → "Gravar agora" o chama, com o
   *                                           custo dito antes (ver `Execucao`)
   *   nem uma coisa nem outra               → a frase para dizer a ele
   * Botão que aceita o clique e guarda para quem não está olhando é pior que
   * botão nenhum (D230) — por isso ele só aparece no primeiro caso.
   *
   * ── A MARCA QUE ENVELHECEU, E O MOTIVO (D234) ─────────────────────────
   * O servidor confere cada decisão contra o `funil.md`: se o assistente já
   * mexeu no item, ela chega `envelheceu`, e a barra diz — ele vai tirá-la
   * da fila sem gravar. O descarte ganha o motivo, opcional, escrito depois
   * do clique: é o que ensina a triagem seguinte.
   */
  import { getContext } from "svelte";
  import { ehFim } from "../rota.js";

  let { decisoes = [], respostas = [], esperando = false, agente = false, podeChamar = false,
    trabalhando = false, decidir = () => {}, anotar = () => {}, dispensar = () => {},
    mandar = async () => ({}), chamar = () => {} } = $props();

  /* as respostas tardias (D238) contam na barra junto com as decisões */
  const total = $derived(decisoes.length + respostas.length);
  const conta = $derived([
    decisoes.length && `${decisoes.length} ${decisoes.length === 1 ? "decisão" : "decisões"}`,
    respostas.length && `${respostas.length} ${respostas.length === 1 ? "resposta" : "respostas"}`,
  ].filter(Boolean).join(" e "));

  const velhas = $derived(decisoes.filter((d) => d.envelheceu).length);

  let aberta = $state(false);
  let recado = $state("");
  let copiado = $state(false);
  const FRASE = "grava o que eu marquei no painel";

  async function gravar() {
    recado = "";
    try {
      const r = await mandar();
      recado = r?.aceita === false ? (r.motivo || "não deu para mandar")
        : "Mandei. Ele grava e a lista se atualiza sozinha.";
    } catch (e) {
      recado = String(e?.message || e);
    }
  }
  async function copiar() {
    try { await navigator.clipboard.writeText(FRASE); copiado = true; }
    catch { copiado = false; }
    setTimeout(() => { copiado = false; }, 2500);
  }

  /* a altura da barra vira `--altura-fila` na página: o que também gruda no
     pé — os gestos do baralho (D242) — sobe junto, em vez de ficar por baixo */
  let altura = $state(0);
  $effect(() => {
    const raiz = document.documentElement.style;
    raiz.setProperty("--altura-fila", (total ? altura : 0) + "px");
    return () => raiz.setProperty("--altura-fila", "0px");
  });

  /* o fim bom do pack é um descarte para a fila, e não para quem lê a barra */
  const molde = getContext("molde");
  const resumo = (d) => ehFim(d, molde?.fim) ? molde.fim.rotulo : d.gesto === "descartar" ? "descartar" : `→ ${d.para}`;
</script>

{#if total}
  <div class="p-fila" role="region" aria-label="decisões esperando o assistente" bind:clientHeight={altura}>
    {#if aberta}
      <ul class="p-fila-lista">
        {#each respostas as r (r.em)}
          <li>
            <span><b>Resposta à tela “{r.titulo || "sem título"}”</b></span>
            <span class="p-fila-gesto">{r.na_fila?.length ? `${r.na_fila.length} na fila` : "guardada"}</span>
            <button type="button" class="c-chip" onclick={() => dispensar(r.em)}>Dispensar</button>
          </li>
        {/each}
        {#each decisoes as d (d.item)}
          <li>
            <span><b>{d.nome || d.item}</b> <span class="p-id">{d.item}</span></span>
            <span class="p-fila-gesto">{resumo(d)}</span>
            <!-- desfazer é marcar de novo o mesmo gesto: a fila trata como desmarca -->
            <button type="button" class="c-chip"
              onclick={() => decidir({ item: d.item, gesto: d.gesto, para: d.para })}>Desfazer</button>
            {#if d.envelheceu}
              <span class="p-fila-velha">Mudou desde que você marcou —
                {d.agora ? `hoje está em “${d.agora}”` : "já não está no funil"}. O assistente
                vai tirar esta da fila sem gravar; se ainda quiser, desfaça e marque de novo.</span>
            {/if}
            {#if d.gesto === "descartar" && !ehFim(d, molde?.fim)}
              <label class="p-fila-motivo">
                <span>Por quê? (opcional)</span>
                <input type="text" maxlength="300" value={d.motivo || ""}
                  placeholder="o que pesou contra"
                  onchange={(e) => anotar({ item: d.item, motivo: e.currentTarget.value })} />
              </label>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
    <div class="p-fila-barra">
      <button type="button" class="p-fila-conta" aria-expanded={aberta}
        onclick={() => { aberta = !aberta; }}>
        <b>{total}</b>
        {conta} esperando o assistente
        <span aria-hidden="true">{aberta ? "▾" : "▴"}</span>
      </button>
      {#if velhas && !aberta}
        <span class="p-fila-velhas">{velhas === 1 ? "1 mudou" : `${velhas} mudaram`} desde que você marcou</span>
      {/if}
      {#if esperando}
        <button type="button" class="c-acao c-acao-clara" onclick={gravar}>Gravar agora</button>
      {:else if trabalhando}
        <span class="p-fila-frase">O assistente está trabalhando — ele grava isto ao começar o próximo pedido.</span>
      {:else if podeChamar}
        <button type="button" class="c-acao c-acao-clara" onclick={chamar}>Gravar agora</button>
      {:else}
        <span class="p-fila-frase">
          {agente ? "Para gravar, diga ao Claude:" : "Quando abrir o Claude, diga:"}
          <button type="button" onclick={copiar}>“{FRASE}” <em>{copiado ? "copiado ✓" : "copiar"}</em></button>
        </span>
      {/if}
    </div>
    {#if recado}<p class="p-fila-recado">{recado}</p>{/if}
  </div>
{/if}
