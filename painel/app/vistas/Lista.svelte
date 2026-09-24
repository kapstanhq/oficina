<script>
  /**
   * LISTA — itens, opcionalmente agrupados.
   *
   * É a vista mais usada do pack porque três coisas dele são listas de
   * naturezas diferentes: a lista do dia (agrupada por seção — vence hoje,
   * travado, prometido), o funil (agrupado por etapa) e os índices de
   * `contas/` e `contatos/` (sem grupo).
   *
   * ── UMA VISTA, E NÃO TRÊS ─────────────────────────────────────────────
   * "Funil" foi a sétima vista candidata, e ela caiu: um funil é uma lista
   * agrupada por etapa, e escrevê-lo à parte daria dois componentes com a
   * mesma mecânica — o segundo a envelhecer. O que muda é o rótulo do grupo,
   * e rótulo é dado.
   *
   * ── O `id` NUNCA ANDA SOZINHO ─────────────────────────────────────────
   * O contrato manda o id vir com o apelido — `P-017 (Carla Menezes)` —, e
   * aqui isso vira coluna própria: a marca à esquerda, o texto à direita. O
   * agente manda os dois juntos no `titulo`; o campo `marca` é para o que
   * qualifica o item sem ser o nome dele (a etapa, os dias parados).
   *
   * ── O LOTE: DOZE ITENS PARA JULGAR NÃO SÃO DOZE TELAS ─────────────────
   * Com `dados.decisoes`, cada item que tem `id` ganha um seletor, e o que
   * volta é `decisoes: { <id>: <chave> }` — **só com o que foi marcado**. A
   * ausência é informação: item sem marca não foi JULGADO, e gravá-lo como
   * recusado seria o painel decidindo pela pessoa. Por isso não há "marcar
   * todos" e não há padrão pré-selecionado.
   *
   * Ele é campo de `dados`, e não uma oitava vista, pela mesma conta que
   * derrubou o "funil": a mecânica é a da lista, e o que muda é um controle
   * por linha.
   *
   * ── CONSULTAR NÃO PODE CUSTAR A TELA ──────────────────────────────────
   * O lote tinha um buraco que só aparece com ele em uso: para decidir, a
   * pessoa às vezes precisa LER mais do que cabe na `linha` — e o único jeito
   * de pedir mais era o botão de item, que devolve a intenção ao agente. A
   * resposta dele troca o documento, e trocar o documento APAGA as marcas.
   *
   * Medido em 2026-09-20, numa triagem de 27 vagas: abrir uma para conferir
   * perdia as outras 26 já marcadas, e a pessoa descobria isso depois.
   *
   * Daí os dois campos desta revisão, e os dois evitam a ida ao agente:
   *   `detalhe`  texto que JÁ VEIO junto, e abre na própria linha
   *   `link`     âncora para a fonte, em aba nova — o navegador, não nós
   * Nenhum dos dois toca em `marcadas`: abrir, ler e fechar deixa a decisão
   * exatamente onde estava.
   */
  import { getContext } from "svelte";
  import Leitor from "../Leitor.svelte";
  import Arquivo from "../casa/Arquivo.svelte";
  import { partirId } from "../rota.js";

  let { dados = {}, agir = () => {}, extra = $bindable({}) } = $props();

  /* ── LISTA E DETALHE (D244) ───────────────────────────────────────────
     O lote pode ser lido no mesmo `Leitor` da rota do funil — a lista de um
     lado, o item inteiro do outro —, e as marcas são AS MESMAS: trocar de
     modo não perde nada. O agente abre nele com `modo: "leitor"` (e
     `um_por_vez: true`, do D242, vale como apelido); a pessoa troca quando
     quiser. Com base aberta, o item cujo id tem arquivo mostra o arquivo. */
  const casa = getContext("casa") || null;
  let noLeitorEscolhido = $state(null);
  const noLeitor = $derived(noLeitorEscolhido ?? (dados.modo === "leitor" || !!dados.um_por_vez));
  let aberto = $state("");

  const decisoes = $derived(
    (Array.isArray(dados.decisoes) ? dados.decisoes : []).filter((d) => d && d.chave));
  const emLote = $derived(decisoes.length > 0);

  /* item sem `id` não ganha seletor: não há chave por onde a decisão voltar.
     O `String()` é porque o id pode chegar número, e a chave de objeto é
     texto — comparar os dois crus faria a marca não acender. */
  const temId = (it) => it && it.id !== undefined && it.id !== null && String(it.id) !== "";

  let marcadas = $state({});
  /* o comentário de UM item (D259), no lote: só onde a skill pediu */
  let comentarios = $state({});
  let comentando = $state({});
  const comenta = (it) => temId(it) && (it.comentar === true || (dados.comentar === true && it.comentar !== false));

  /* qual detalhe está aberto. É estado SÓ de leitura da tela: não entra no
     `extra`, não sobe para a casca e não vira resposta — abrir para conferir
     não é decidir, e o painel não guarda o que a pessoa leu. */
  let abertas = $state({});

  /* a chave do item para os dois mapas. Item sem `id` não ganha seletor (não
     há por onde a decisão voltar), mas PODE ter detalhe: a posição serve de
     chave para abrir e fechar, e nunca sai daqui. */
  const chave = (it, k) => (temId(it) ? String(it.id) : "_" + k);

  function alternar(c) {
    if (abertas[c]) delete abertas[c];
    else abertas[c] = true;
  }

  /* clicar na que já está marcada DESMARCA. Sem isso um clique errado só se
     conserta escolhendo outra decisão — e "não julguei" deixa de existir no
     instante em que a pessoa encosta na linha. */
  function marcar(id, chave) {
    if (marcadas[id] === chave) delete marcadas[id];
    else marcadas[id] = chave;
  }

  /* lista sem grupo e lista com grupo são o mesmo desenho: a sem grupo é uma
     com um grupo só, sem rótulo. Normalizar aqui evita dois caminhos de
     renderização e o `{#if}` que os separa. */
  const grupos = $derived(
    Array.isArray(dados.grupos) && dados.grupos.length
      ? dados.grupos
      : [{ rotulo: "", itens: dados.itens || [] }]);

  const vazia = $derived(!grupos.some((g) => (g.itens || []).length));

  /* o leitor: só o que tem id (é o que se decide), com o grupo de etiqueta */
  const paraOLeitor = $derived(grupos.flatMap((g) => (g.itens || []).filter(temId).map((it) => {
    const p = partirId(it.titulo ?? "");
    const id = String(it.id);
    return { comentar: comenta(it), chave: id, id: p.id || (/^\p{Lu}{1,4}-\d{1,6}$/u.test(id) ? id : ""),
      titulo: p.id ? p.nome : String(it.titulo ?? id), sub: it.linha || "", detalhe: it.detalhe || "",
      link: it.link || "", etiqueta: it.marca || g.rotulo || "",
      caminho: casa?.indice?.get(p.id || id) || "" };
  })));
  const opcoesDoLeitor = $derived(decisoes.map((d) => ({ chave: d.chave, rotulo: d.rotulo || d.chave,
    tom: d.tom === "recusa" ? "recusa" : "", tipo: "marca" })));
  /* abre no primeiro sem marca — uma vez: no telefone, "‹ Lista" fecha o
     item, e reabrir sozinho prenderia a pessoa nele */
  let abriu = false;
  $effect(() => {
    if (abriu || !noLeitor || !paraOLeitor.length) return;
    abriu = true;
    aberto = (paraOLeitor.find((it) => !marcadas[it.chave]) || paraOLeitor[0]).chave;
  });

  const julgaveis = $derived(
    grupos.reduce((n, g) => n + (g.itens || []).filter(temId).length, 0));

  /* ── O QUE SOBE PARA A CASCA ──────────────────────────────────────────
     Só em lote: a lista comum continua sem coletar nada, e a intenção dela
     sai com as chaves de sempre. Escreve o objeto inteiro sem ler `extra` —
     ver o `Texto` sobre o laço que isso evita. `_marcados` e `_julgaveis` são
     recado para a casca, que os mostra ao lado do botão e os tira da volta. */
  $effect(() => {
    if (!emLote) return;
    const ditos = Object.fromEntries(Object.entries(comentarios)
      .map(([k, v]) => [k, String(v || "").trim()]).filter(([, v]) => v));
    extra = { decisoes: { ...marcadas }, ...(Object.keys(ditos).length ? { comentarios: ditos } : {}),
      _marcados: Object.keys(marcadas).length, _julgaveis: julgaveis };
  });
</script>

{#if emLote && julgaveis > 1}
  <div class="p-lista-modo" role="group" aria-label="como ver a lista">
    <button type="button" class="c-chip" aria-pressed={!noLeitor} onclick={() => { noLeitorEscolhido = false; }}>Lista compacta</button>
    <button type="button" class="c-chip" aria-pressed={noLeitor} onclick={() => { noLeitorEscolhido = true; }}>Lista e detalhe</button>
  </div>
{/if}

{#if emLote && (decisoes.length < 2 || decisoes.length > 4)}
  <!-- desenha assim mesmo e avisa, como a `escolha` com cinco opções: aqui o
       excesso é de conteúdo, e esconder uma decisão seria escolher por ela -->
  <p class="c-nota p-falta">
    {decisoes.length === 1
      ? "Veio uma decisão só — com uma, não há o que decidir."
      : `São ${decisoes.length} decisões por item, e o contrato pede de duas a quatro.`}
    Vale ajustar na skill.
  </p>
{/if}

{#if emLote && noLeitor}
  <Leitor itens={paraOLeitor} selecionado={aberto} selecionar={(c) => { aberto = c; }}
    opcoesDe={() => opcoesDoLeitor} marcadaDe={(it) => marcadas[it.chave] || ""}
    escolher={(it, o) => marcar(it.chave, o.chave)} rotuloDaLista="itens para decidir">
    {#snippet detalhe(it)}
      {#if it.caminho}
        <Arquivo caminho={it.caminho} embutido indice={casa?.indice} documentos={casa?.documentos}
          destaque={casa?.destaque || []} agente={casa?.agente} esperando={casa?.esperando}
          completar={casa?.completar || ""} rotulos={casa?.rotulos || {}} />
      {:else}
        <h2 class="c-h2">{it.titulo}</h2>
        {#if it.etiqueta}<span class="c-etiqueta c-etiqueta-cinza" style="align-self:flex-start">{it.etiqueta}</span>{/if}
        {#if it.sub}<p class="c-corpo">{it.sub}</p>{/if}
        {#if it.detalhe}<div class="p-item-detalhe">{it.detalhe}</div>{/if}
        {#if it.link}<a class="c-acao" style="align-self:flex-start" href={it.link} target="_blank" rel="noopener noreferrer">Abrir a fonte ↗</a>{/if}
      {/if}
      {#if it.comentar}{@render comentario(it.chave)}{/if}
    {/snippet}
  </Leitor>
  <p class="c-nota">{Object.keys(marcadas).length} de {julgaveis} marcados. O botão lá embaixo manda as marcas ao assistente.</p>
{:else}
{#if vazia}
  <!-- ── GRUPO VAZIO CONTINUA NA PÁGINA ──────────────────────────────────
       O contrato §4.2 escreve isso para o `hoje.md`: "Seção vazia continua na
       página, com uma linha só. Sumir com a seção faz o prospector achar que
       a skill esqueceu." A tela obedece à mesma regra, pela mesma razão. -->
  <p class="c-corpo">Nada aqui.</p>
{/if}

{#each grupos as g, i (g.rotulo || i)}
  {#if (g.itens || []).length || g.rotulo}
    <section class="c-secao" style="gap:var(--s1)">
      {#if g.rotulo}
        <span class="c-selo">{g.rotulo}{#if (g.itens || []).length}
          <span style="color:var(--fio-forte)"> · {g.itens.length}</span>{/if}</span>
      {/if}
      {#if !(g.itens || []).length}
        <p class="c-nota">nada aqui.</p>
      {:else}
        <ul class="c-caixa" style="list-style:none">
          {#each g.itens as it, k (it.id || k)}
            <li class="p-item">
              {#if it.marca}<span class="c-etiqueta c-etiqueta-cinza">{it.marca}</span>
              {:else}<span></span>{/if}
              <span class="p-item-titulo">{it.titulo ?? it.id ?? ""}</span>
              {#if it.linha}<span class="p-item-linha">{it.linha}</span>{/if}
              {#if it.detalhe || it.link}
                <span class="p-item-consulta">
                  {#if it.detalhe}
                    <button type="button" class="c-chip"
                      aria-expanded={!!abertas[chave(it, k)]}
                      onclick={() => alternar(chave(it, k))}
                    >{abertas[chave(it, k)] ? "Fechar" : "Ver por quê"}</button>
                  {/if}
                  <!-- ── A FONTE ABRE NO NAVEGADOR, NÃO NO AGENTE ─────────
                       É uma âncora de verdade, com `target` e `rel`: quem
                       abre é o navegador dela, a tela daqui não muda, e o
                       que estava marcado continua marcado quando ela volta. -->
                  {#if it.link}
                    <a class="c-chip" href={it.link}
                      target="_blank" rel="noopener noreferrer"
                    >Abrir a fonte ↗</a>
                  {/if}
                </span>
              {/if}
              {#if it.detalhe && abertas[chave(it, k)]}
                <div class="p-item-detalhe">{it.detalhe}</div>
              {/if}
              {#if emLote && temId(it)}
                <span class="p-item-acoes" role="group"
                  aria-label={"decisão para " + (it.titulo ?? it.id)}>
                  {#each decisoes as d (d.chave)}
                    <button type="button"
                      class="c-chip {d.tom === 'recusa' ? 'p-chip-recusa' : ''}"
                      aria-pressed={marcadas[String(it.id)] === d.chave}
                      onclick={() => marcar(String(it.id), d.chave)}
                    >{d.rotulo || d.chave}</button>
                  {/each}
                </span>
              {/if}
              {#if emLote && comenta(it)}
                <span class="p-item-comentario">{@render comentario(String(it.id))}</span>
              {/if}
              {#if (it.acoes || []).length}
                <span class="p-item-acoes">
                  {#each it.acoes as a (a.chave)}
                    <button type="button" class="c-chip"
                      onclick={() => agir(a.chave, { item: it.id, titulo: it.titulo })}
                    >{a.rotulo}</button>
                  {/each}
                </span>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}
{/each}
{/if}

{#snippet comentario(c)}
  {#if comentando[c] || comentarios[c]}
    <label class="p-recado" style="width:100%">
      <span class="c-nota">Comentário para o assistente sobre {c}</span>
      <textarea class="p-campo p-comentario" rows="2"
        placeholder="O que pesa neste item, o que fazer com ele."
        bind:value={comentarios[c]}></textarea>
    </label>
  {:else}
    <button type="button" class="p-comentar" onclick={() => (comentando[c] = true)}>Comentar este item</button>
  {/if}
{/snippet}
