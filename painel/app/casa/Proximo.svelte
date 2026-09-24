<script>
  /**
   * O PRÓXIMO PASSO de um item (D235) — um em destaque, os outros ao lado.
   *
   * ── DE ONDE VEM A ORDEM ───────────────────────────────────────────────
   *   1 · o AGENTE apontou, na linha do funil: `· próximo: candidatar — …`
   *       começa pelo nome de uma skill, e ela vira o destaque deste item
   *   2 · o PACK declarou por etapa (`painel.json` → `proximo`, via
   *       `acoes.json`): "salva" → candidatar, adaptar o currículo, …
   *   3 · nada declarado: os dois gestos do formato, marcar e descartar
   * O que o agente apontou vai na frente do que o pack declarou, sem repetir.
   *
   * ── TRÊS TIPOS DE ENTRADA, DOIS DESTINOS ──────────────────────────────
   *   marcar      a etapa seguinte do funil — vai para a FILA (D232)
   *   descartar   o arquivo-morto — vai para a FILA, com motivo opcional
 *   fim         o fim BOM do pack, na etapa dele: o mesmo descarte, com o
 *               motivo fixo do `fim` — sem vermelho e sem "o que pesou contra"
   *   skill       chama o assistente (D232), com o id se ela age sobre o
   *               item e sem ele se roda sozinha; sem botão, copia o pedido
   * Skill que é conversa (sem `sobre`) não vira botão: aparece só para copiar.
   *
   * ── TRÊS LUGARES, UM DESENHO ──────────────────────────────────────────
   *   cheio    a página do item: o destaque com o nome e a nota, e "ou:"
   *   cartao   o cartão do início: o destaque cheio e os chips
   *   linha    a célula da tabela: o destaque e até dois chips, sem quebrar
   * Substitui `Decidir.svelte`: eram dois botões iguais em três lugares, e
   * a pergunta "e agora?" ficava sem resposta em todos.
   */
  import { getContext } from "svelte";
  import { passosDoItem, notaQueDiz, ehFim, gestoDoPasso } from "../rota.js";

  let { id = "", nome = "", andamento = null, decisoes = [], decidir = () => {},
    anotar = () => {}, acoes = [], proximos = {}, rotulos = {}, tipo = "item", podeChamar = false,
    chamar = () => {}, modo = "cheio", comMotivo = false, motivos = [], ficha = null, ocupados = [] } = $props();

  const molde = getContext("molde");
  const fim = $derived(molde?.fim || null);
  const passos = $derived(passosDoItem({ id, andamento, acoes, proximos, rotulos, tipo, ficha, ocupados, fim }));
  const etapa = $derived(passos.etapa);
  const seguinte = $derived(passos.seguinte);
  const doAgente = $derived({ ...passos.doAgente, nota: notaQueDiz(passos.doAgente.nota) });
  const marcada = $derived(decisoes.find((d) => d.item === id) || null);
  const marcouFim = $derived(ehFim(marcada, fim));
  /* o gesto que já está na fila fica pressionado */
  const pressionado = (p) => p.tipo === "marcar" ? marcada?.gesto === "etapa" && marcada.para === seguinte
    : p.tipo === "fim" ? marcouFim
    : p.tipo === "descartar" ? marcada?.gesto === "descartar" && !marcouFim : undefined;
  const lista = $derived(passos.lista);
  /* o destaque é o que o estado do item pede (D257); os outros, na ordem */
  const destaque = $derived(passos.destaque || lista[0] || null);
  /* no cartão, dois e o descarte — triar a pilha é descartar em um clique */
  const outros = $derived.by(() => {
    const resto = lista.filter((p) => p !== destaque);
    if (modo === "linha") return resto.slice(0, 2);
    if (modo === "par") return resto.filter((p) => p.tipo === "descartar");
    if (modo === "cartao") return [...resto.filter((p) => p.tipo !== "descartar").slice(0, 2), ...resto.filter((p) => p.tipo === "descartar")];
    return resto;
  });

  /* sem sessão, o pedido se copia — e o botão diz que copiou */
  let copiado = $state("");
  async function copiar(texto) {
    try { await navigator.clipboard.writeText(texto); copiado = texto; }
    catch { copiado = "!" + texto; }
    setTimeout(() => { copiado = ""; }, 2500);
  }

  const agir = (p) => (e) => {
    /* o cartão e a linha da tabela abrem o arquivo ao clique: o gesto não pode abrir */
    e.preventDefault();
    e.stopPropagation();
    const g = gestoDoPasso(p, { id, nome, etapa, marcada, fim });
    if (g?.decidir) decidir(g.decidir);
    else if (g?.anotar) anotar(g.anotar);
    else if (p.tipo === "skill" && p.ocupado) return;
    else if (p.tipo === "skill" && podeChamar) chamar(p.comando, p.item);
    else copiar(p.pedido);
  };
  const rotuloDe = (p) => {
    const base = p.ocupado ? `${p.rotulo} · ${p.ocupado}` : p.rotulo;
    if (p.tipo === "marcar" || p.tipo === "descartar" || p.tipo === "fim") return base;
    if (p.tipo === "skill" && podeChamar) return base;
    return copiado === p.pedido ? "Copiado ✓" : copiado === "!" + p.pedido ? "Selecione e copie" : base + " ⧉";
  };
</script>

{#if destaque}
  <div class="p-proximo" data-modo={modo}>
    {#if modo === "cheio"}
      <span class="p-proximo-rotulo">Próximo passo</span>
      <div class="p-proximo-destaque">
        <div>
          <!-- o gesto de etapa não tem o que explicar além da dica: o nome dele já
               está no botão, e repeti-lo em cima lia "Salvar · Salvar" -->
          {#if destaque.oque}<b>{destaque.rotulo}</b><span>{destaque.oque}</span>
          {:else if destaque.dica}<span>{destaque.dica}</span>{/if}
          {#if doAgente.nota}<em>O assistente anotou: {doAgente.nota}</em>{/if}
          {#if destaque.tipo === "skill" && !podeChamar}
            <span>Sem conversa aberta, o botão copia o pedido: cole no Claude.</span>
          {:else if destaque.tipo === "conversa"}
            <span>É uma conversa: ele vai fazer perguntas. O botão copia o pedido para o Claude.</span>
          {/if}
        </div>
        <button type="button" class="c-acao c-acao-cheia" class:p-chip-recusa={destaque.tipo === "descartar"}
          aria-pressed={pressionado(destaque)}
          title={destaque.dica || undefined} onclick={agir(destaque)}>{rotuloDe(destaque)}</button>
      </div>
    {:else}
      <button type="button" class="c-acao c-acao-cheia p-proximo-curto"
        class:p-chip-recusa={destaque.tipo === "descartar"}
        aria-pressed={pressionado(destaque)}
        title={destaque.dica || destaque.oque || undefined} onclick={agir(destaque)}>{rotuloDe(destaque)}</button>
    {/if}

    {#if outros.length}
      <div class="p-proximo-outros">
        {#if modo === "cheio"}<span>ou:</span>{/if}
        {#each outros as p (p.chave)}
          <button type="button" class="c-chip" class:p-chip-recusa={p.tipo === "descartar"}
            aria-pressed={pressionado(p)}
            title={p.dica || p.oque || undefined} onclick={agir(p)}>{rotuloDe(p)}</button>
        {/each}
      </div>
    {/if}

    {#if marcada && modo !== "linha"}
      <span class="p-proximo-nota">
        {marcouFim ? `“${fim.rotulo}” marcado` : marcada.gesto === "descartar" ? "Descarte marcado" : `Mudança para “${marcada.para}” marcada`} — o assistente grava quando você mandar.
      </span>
    {/if}
    {#if marcada?.gesto === "descartar" && !marcouFim && comMotivo}
      <!-- o motivo é opcional, e vai para o arquivo-morto junto (D234); os do
           pack são de um clique (D242) -->
      {#if motivos.length}
        <div class="p-motivos" role="group" aria-label="motivo do descarte">
          {#each motivos as m (m)}
            <button type="button" class="c-chip" aria-pressed={marcada.motivo === m}
              onclick={() => anotar({ item: id, motivo: marcada.motivo === m ? "" : m })}>{m}</button>
          {/each}
        </div>
      {/if}
      <label class="p-decidir-motivo">
        <span>Por quê? (opcional)</span>
        <input type="text" maxlength="300" value={marcada.motivo || ""}
          placeholder="o que pesou contra"
          onchange={(e) => anotar({ item: id, motivo: e.currentTarget.value })} />
      </label>
    {/if}
  </div>
{/if}
