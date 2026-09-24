<script>
  /**
   * UMA PASTA — a tabela do `_indice.md`, e cada linha abre o arquivo.
   *
   * ── A TABELA É A DO ARQUIVO, INTEIRA ──────────────────────────────────
   * O `_indice.md` de uma pasta tem UMA tabela, e as colunas dela são as que
   * o ofício escolheu mostrar. A tela não reordena, não esconde e não
   * acrescenta coluna: escolher o que importa é decisão de quem escreveu o
   * índice. O que ela faz é de LEITURA (D231): a primeira coluna vira o nome
   * com o id de etiqueta, o `?` sai em âmbar como em toda ficha, a linha
   * inteira abre o arquivo, e acima de oito linhas há um campo de procurar —
   * que filtra o que está na tela e não muda nada em lugar nenhum.
   *
   * ── PASTA SEM `_indice.md` NÃO É ERRO ─────────────────────────────────
   * `curriculos/` e `_bruto/` não têm um, e não deviam ter: são markdown
   * comum e origem crua. A tela cai na árvore — os nomes, em ordem —, que é
   * a informação que existe. Dizer "não achei o índice" onde nunca houve um
   * seria inventar um defeito.
   */
  import { getContext } from "svelte";
  import { paraArquivo, paraFunil, idsDaLinha, nomeDeGente, partirId, ehLinhaVazia } from "../rota.js";
  import Itens from "./Itens.svelte";
  import Proximo from "./Proximo.svelte";
  const { pedirArquivo } = getContext("ponte");

  let { nome, mapa, indice, recarga = 0, andamento = null, decisoes = [],
    decidir = () => {}, acoes = [], proximos = {}, rotulos = {}, pastasDoPack = {},
    podeChamar = false, chamar = () => {}, funil = null } = $props();

  /* a pasta diz se as linhas são itens ou pessoas — é o que decide se a
     skill do próximo passo leva o id (D235) */
  const tipoDaqui = $derived(nome === pastasDoPack.item ? "item"
    : nome === pastasDoPack.pessoa ? "pessoa" : "item");

  let indiceDaPasta = $state(null);
  let erro = $state("");
  let procura = $state("");

  const naArvore = $derived(
    (mapa?.arvore || []).find((i) => i.tipo === "pasta" && i.nome === nome) || null);

  /* o índice só é pedido se existe: a árvore do mapa já diz o que há na
     pasta, e um 404 previsível aparece no console do navegador como ERRO —
     o ruído que faz alguém parar de olhar para o console */
  const temIndice = $derived((naArvore?.itens || []).includes("_indice.md"));

  $effect(() => {
    recarga;
    const qual = nome;
    const pedir = temIndice;
    let vivo = true;
    indiceDaPasta = null;
    erro = "";
    if (!pedir) return;
    (async () => {
      try {
        const lido = await pedirArquivo(`${qual}/_indice.md`);
        if (vivo && qual === nome) indiceDaPasta = lido;
      } catch (e) {
        /* aqui só chega defeito de verdade: a existência já foi conferida */
        if (vivo && qual === nome) erro = String(e?.message || e);
      }
    })();
    return () => { vivo = false; };
  });
  $effect(() => { nome; procura = ""; });

  /* a tabela pode estar antes da primeira seção (é onde ela está nas duas
     bases de prova) ou dentro de uma. Procurar nos dois lugares custa uma
     linha e evita uma pasta que abre vazia porque alguém pôs um `##` acima. */
  const tabela = $derived((() => {
    const de = (lista) => (lista || []).find((i) => i.tipo === "tabela");
    return de(indiceDaPasta?.abertura)
      || (indiceDaPasta?.secoes || []).map((s) => de(s.itens)).find(Boolean)
      || null;
  })());

  const caminhoDaCelula = (celula) => {
    const ids = idsDaLinha(celula, indice);
    return ids.length ? indice.get(ids[0]) : "";
  };

  const semAcento = (s) => String(s || "").normalize("NFD")
    .replace(/[̀-ͯ]/g, "").toLowerCase();
  const linhas = $derived((() => {
    const todas = (tabela?.linhas || []).map((celulas) => ({
      celulas, caminho: caminhoDaCelula(celulas[0]), ...partirId(celulas[0]),
    }));
    const p = semAcento(procura.trim());
    return p ? todas.filter((l) => semAcento(l.celulas.join(" ")).includes(p)) : todas;
  })());

  /* as seções do índice que não são a tabela — `## Arquivo morto` é a que
     existe nas duas bases. Elas vão inteiras, pelo que são. */
  const secoes = $derived((indiceDaPasta?.secoes || [])
    .map((s) => ({ ...s, itens: (s.itens || []).filter((i) => i.tipo !== "tabela") }))
    .filter((s) => s.itens.length));

  /* o título do índice é `Vagas — 56 vivas · atualizado em …`: o nome é o
     `<h1>`, e o resto é a linha de baixo */
  const titulo = $derived((() => {
    const t = String(indiceDaPasta?.titulo || "");
    const i = t.indexOf(" — ");
    return i > 0 ? { nome: t.slice(0, i), resto: t.slice(i + 3) }
      : { nome: t || nomeDeGente(nome), resto: "" };
  })());

  /* a coluna de decidir só existe se ALGUM item desta pasta está no funil:
     em `contatos/` ela seria uma coluna vazia de ponta a ponta */
  const temDecisao = $derived(linhas.some((l) => l.id && andamento?.de?.has(l.id)));

  /* na pasta dos itens, o atalho para o baralho de cada etapa que tem coisa (D242) */
  const etapasComItens = $derived(nome === pastasDoPack.item
    ? (funil?.secoes || []).map((s) => ({ rotulo: s.titulo,
        quantos: (s.itens || []).filter((i) => i.tipo === "linha" && !ehLinhaVazia(i.texto)).length }))
      .filter((e) => e.quantos)
    : []);

  const naoSabe = (v) => /^\?(\s|$)/.test(String(v ?? "").trim());
  const abrir = (caminho) => { if (caminho) location.hash = paraArquivo(caminho); };
</script>

<header class="c-secao" style="gap:var(--s0)">
  <h1 class="c-h2">{titulo.nome}</h1>
  {#if titulo.resto}<p class="c-nota">{titulo.resto}</p>{/if}
</header>

{#if etapasComItens.length}
  <div class="p-revisar">
    <span class="c-nota">Abrir no funil:</span>
    {#each etapasComItens as e (e.rotulo)}
      <a class="c-chip" href={paraFunil(e.rotulo)}>{e.rotulo} · {e.quantos}</a>
    {/each}
  </div>
{/if}

{#if erro}
  <p class="c-nota p-falta">{erro}</p>
{/if}

{#if tabela}
  {#if (tabela.linhas || []).length > 8}
    <label class="p-procura">
      <span class="c-selo">Procurar nesta lista</span>
      <input class="p-campo" type="search" bind:value={procura}
        placeholder="um nome, uma empresa, uma palavra…" />
    </label>
  {/if}
  {#if !tabela.linhas.length}
    <p class="p-vazio">Nada aqui ainda.</p>
  {:else if !linhas.length}
    <p class="p-vazio">Nada com “{procura}” nesta lista.</p>
  {:else}
    <div class="c-caixa" style="overflow-x:auto">
      <table class="p-tabela p-tabela-abre">
        <thead><tr>{#each tabela.cabecalho as c, k (k)}<th>{c}</th>{/each}
          {#if temDecisao}<th>próximo passo</th>{/if}</tr></thead>
        <tbody>
          {#each linhas as l, k (k)}
            <!-- a linha inteira abre; o link de verdade continua na primeira
                 célula, que é por onde o teclado e o leitor de tela chegam -->
            <tr data-abre={l.caminho ? "" : undefined} onclick={() => abrir(l.caminho)}>
              {#each l.celulas as celula, j (j)}
                <td class:p-curta={j > 0 && String(celula).length <= 12}>
                  {#if j === 0}
                    {#if l.caminho}
                      <a href={paraArquivo(l.caminho)} onclick={(e) => e.stopPropagation()}>{l.nome}</a>
                    {:else}{l.nome}{/if}
                    {#if l.id}<span class="p-id">{l.id}</span>{/if}
                  {:else if naoSabe(celula)}
                    <!-- só o `?` vai em âmbar: em "? · proposto: alto" o que
                         falta é a resposta, e a proposta ao lado é informação -->
                    <span class="p-falta">?</span>{String(celula).trim().slice(1)}
                  {:else}{celula}{/if}
                </td>
              {/each}
              {#if temDecisao}
                <td><Proximo id={l.id} nome={l.nome} {andamento} {decisoes} {decidir}
                  {acoes} {proximos} {rotulos} tipo={tipoDaqui} {podeChamar} {chamar} modo="linha" {ocupados} /></td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#if procura.trim()}
      <p class="c-nota">{linhas.length} de {tabela.linhas.length}.</p>
    {/if}
  {/if}
{:else if naArvore}
  <!-- sem índice: os nomes que estão no disco, e cada um abre. É o caso de
       `curriculos/` e de `_bruto/`, e é a informação que existe. -->
  {#if !naArvore.itens.length}
    <p class="p-vazio">Nada aqui ainda.</p>
  {:else}
    <ul class="c-caixa" style="list-style:none">
      {#each naArvore.itens as arquivo (arquivo)}
        <li class="p-item">
          <span></span>
          <span class="p-item-titulo">
            {#if /\.(md|csv|txt)$/i.test(arquivo)}
              <a href={paraArquivo(`${nome}/${arquivo}`)}
                style="color:inherit;text-decoration:underline;text-underline-offset:3px"
                >{nomeDeGente(arquivo)}</a>
            {:else}{arquivo}{/if}
          </span>
          <span class="p-item-linha" style="font-family:var(--mono);font-size:12px">{arquivo}</span>
        </li>
      {/each}
    </ul>
  {/if}
{:else}
  <p class="c-corpo">Esta pasta não existe mais na sua base.</p>
{/if}

{#each secoes as s (s.titulo)}
  <section class="c-secao" style="gap:var(--s2)">
    <h2 class="c-h3">{s.titulo}</h2>
    <Itens itens={s.itens} />
  </section>
{/each}
