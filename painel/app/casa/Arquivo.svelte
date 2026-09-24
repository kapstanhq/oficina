<script>
  /**
   * UM ARQUIVO — a ficha, e o pedido que nasce dela.
   *
   * O arquivo de um item tem duas metades, e elas se leem de jeitos
   * diferentes: os CAMPOS no topo, cada um com a procedência ao lado, e as
   * SEÇÕES embaixo. É a mesma forma da vista `ficha`, e é por isso que o
   * topo dela é a `Ficha` — a mesma regra desenhada uma vez, venha ela do
   * agente ou do disco.
   *
   * Um currículo não tem campo nenhum: é markdown comum. Ele cai nas seções,
   * e as seções desenham prosa. O que sobra — um `_bruto/` com uma página
   * colada dentro — cai no texto cru, que é a última forma legível.
   *
   * ── "PEDIR AO AGENTE" É O ÚNICO GESTO DA CASA QUE SAI DELA ────────────
   * A pessoa está lendo um arquivo e quer alguma coisa a partir dele —
   * "prepara a mensagem para este". Isso vira a intenção
   * `{ acao: "pedir", pedido, sobre }`, e o agente a recebe pelo
   * `painel_esperar` como qualquer outra. O contrato manda tratá-la como
   * trataria a mesma frase dita no terminal.
   *
   * **Ele não grava nada.** É a mesma linha de sempre: o painel propõe, o
   * agente dispõe. O que distingue este botão dos outros é que ele não
   * responde a uma tela — ele começa uma conversa.
   *
   * ── E ELE FICA DESLIGADO QUANDO NÃO HÁ SESSÃO ─────────────────────────
   * Em `--base` não há agente nenhum do outro lado. Um botão que aceitasse
   * o pedido e o guardasse para quem nunca vem é pior que um desligado: a
   * pessoa escreve, aperta, e acha que mandou.
   */
  import { pedirArquivo, enviarPedido } from "../ponte.js";
  import Ficha from "../vistas/Ficha.svelte";
  import { partirId, nomeDeGente, partirProximo, nomeDoArquivo, paraArquivo, paraFunil, chavesDoArquivo } from "../rota.js";
  import Itens from "./Itens.svelte";
  import ComIds from "./ComIds.svelte";
  import Proximo from "./Proximo.svelte";
  import Item from "./Item.svelte";

  let { caminho, recarga = 0, agente = false, esperando = false, andamento = null,
    indice = null, documentos = null, destaque = [], rotulos = {}, motivos = [],
    decisoes = [], decidir = () => {}, anotar = () => {}, acoes = [], proximos = {},
    pastasDoPack = {}, podeChamar = false, chamar = () => {},
    /* dentro do leitor do funil (D244): o próximo passo é a barra de lá */
    embutido = false,
    /* a skill que procura o que falta num item (D245) */
    completar = "",
    /* pasta → modelo de documento, e a árvore para saber se o PDF já existe (D270) */
    documentosDoPack = {}, arvore = [], ocupados = [] } = $props();

  /* ── O DOCUMENTO EM PDF (D270) ────────────────────────────────────────
     Arquivo `.md` numa pasta que o pack liga a um modelo: a prévia é o mesmo
     HTML que vira PDF, e o PDF é o que a skill gerou. Os dois abrem em outra
     aba — sair daqui perderia o lugar — e nenhum dos dois escreve nada. */
  const documento = $derived((() => {
    const partes = String(caminho || "").split("/");
    const modelo = partes.length > 1 ? documentosDoPack?.[partes[0]] : "";
    if (!modelo || !/\.md$/i.test(caminho)) return null;
    const nomePdf = partes[partes.length - 1].replace(/\.md$/i, ".pdf");
    const pasta = (arvore || []).find((p) => p.tipo === "pasta" && p.nome === partes[0]);
    const temPdf = !!pasta && (pasta.itens || []).includes(nomePdf);
    const q = (c) => encodeURIComponent(c);
    return { previa: `/base/documento?caminho=${q(caminho)}&modelo=${q(modelo)}`,
      pdf: temPdf ? `/base/pdf?caminho=${q(caminho.replace(/\.md$/i, ".pdf"))}` : "" };
  })());

  /* ── SÓ O QUE SE FAZ SOBRE ESTE ARQUIVO ───────────────────────────────
     A pasta diz se isto é um item ou uma pessoa, e cada ação do pack declara
     sobre o que age (`<pack>/painel.json`). A primeira versão mostrava o
     primeiro grupo inteiro, e "Buscar vagas" aparecia na página de UMA vaga —
     o fundador viu no primeiro uso. O servidor cobra a mesma regra. */
  const tipoDaqui = $derived((() => {
    const pasta = String(caminho || "").split("/")[0];
    return pasta && pasta === pastasDoPack.item ? "item"
      : pasta && pasta === pastasDoPack.pessoa ? "pessoa" : "";
  })());
  const todas = $derived(acoes.flatMap((g) => g.acoes || []));
  /* o que já está no próximo passo não se repete embaixo (D235): a lista de
     baixo é o RESTO — o que a etapa não pede agora, mas dá para pedir */
  const noProximo = $derived((() => {
    const id = cabeca?.id || "";
    const etapa = id ? andamento?.de?.get(id) || "" : "";
    if (!etapa) return new Set();
    const doPack = Array.isArray(proximos?.[etapa]) ? proximos[etapa] : [];
    const doAgente = partirProximo(andamento?.proximo?.get(id) || "", todas.map((a) => a.comando)).comando;
    return new Set([...doPack, doAgente].filter(Boolean));
  })());
  const acoesDaqui = $derived(tipoDaqui
    ? todas.filter((a) => (a.sobre || []).includes(tipoDaqui) && !noProximo.has(a.comando) && a.comando !== completar)
    : []);

  let arquivo = $state(null);
  /* a procedência de cada linha, atrás de um interruptor (D258): o arquivo
     longo — a trajetória — era uma parede com a origem sob cada linha */
  let comOrigem = $state(false);
  const temOrigem = $derived(!!arquivo && [...arquivo.abertura, ...arquivo.secoes.flatMap((s) => s.itens)].some((i) => i.de));
  const principais = $derived((arquivo?.secoes || []).map((s, i) => ({ s, i })).filter(({ s }) => s.nivel <= 2));
  /* "Kapstan · AI Product Manager · 2026-04 a hoje — nota ← origem": o título
     é o que vem antes do travessão; o resto é nota, e vai com a origem */
  const partirTitulo = (t) => { const k = String(t).indexOf(" — "); return k > 0 ? [t.slice(0, k), t.slice(k + 3)] : [t, ""]; };
  let erro = $state("");
  let cru = $state(false);

  let abrindoPedido = $state(false);
  let pedido = $state("");
  let mandado = $state("");
  let recusa = $state("");

  $effect(() => {
    recarga;
    const qual = caminho;
    let vivo = true;
    arquivo = null;
    erro = "";
    cru = false;
    (async () => {
      try {
        const lido = await pedirArquivo(qual);
        if (vivo && qual === caminho) arquivo = lido;
      } catch (e) {
        if (vivo && qual === caminho) erro = String(e?.message || e);
      }
    })();
    return () => { vivo = false; };
  });

  /* o pedido é sobre ESTE arquivo: trocar de arquivo com o campo aberto
     mandaria a frase com o `sobre` errado */
  $effect(() => {
    caminho;
    abrindoPedido = false;
    pedido = "";
    mandado = "";
    recusa = "";
  });

  const vazio = $derived(!!arquivo && !arquivo.campos.length
    && !arquivo.secoes.length && !arquivo.abertura.length);

  /* ── AS RELAÇÕES POR ID (D239) ────────────────────────────────────────
     Este arquivo é o DONO do id (está na pasta de itens ou de pessoas)? Então
     os outros que começam com o mesmo id são documentos dele. Não é o dono
     mas começa com um id? Então pertence a quem é. */
  const idDoNome = $derived((String(caminho || "").split("/").pop().match(/^([\p{Lu}]{1,4}-\d{1,6})-/u) || [])[1] || "");
  const souODono = $derived(!!idDoNome && indice?.get(idDoNome) === String(caminho || "").replace(/\\/g, "/"));
  const meusDocumentos = $derived(souODono ? documentos?.get(idDoNome) || [] : []);
  const donoDaqui = $derived(!souODono && idDoNome ? indice?.get(idDoNome) || "" : "");
  const pastaDe = (c) => nomeDeGente(String(c).split("/")[0]);

  /* ── O QUE SE LÊ ANTES DE TUDO (D240) ─────────────────────────────────
     Os campos que o pack declarou em `destaque`, na ordem dele, casados com
     os do arquivo sem acento e sem caixa. `?` é "não diz"; campo que o
     arquivo não tem é "não consta" — os dois em âmbar, porque são o que
     decide se cabe, e não estão respondidos. */
  const chaves = $derived(souODono ? chavesDoArquivo(arquivo, destaque) : []);
  const faltam = $derived(chaves.filter((c) => c.semResposta).map((c) => c.rotulo));
  /* o arquivo DONO de um item, com os campos do destaque: a página própria
     do item (D257). O resto — currículo, perfil, um _bruto — segue aqui */
  const ehItem = $derived(souODono && chaves.length > 0 && !!tipoDaqui);
  let copiado = $state(false);
  async function copiarPedido(texto) {
    try { await navigator.clipboard.writeText(texto); copiado = true; } catch { copiado = false; }
    setTimeout(() => { copiado = false; }, 2500);
  }

  /* o `<h1>` é o apelido, e o id vai de etiqueta — ver `partirId`. Arquivo
     sem `# título` cai no nome de gente, e não no nome de disco. */
  /* e o que vem depois de " — " ("Perfil — atualizado em …") é nota, não nome */
  const cabeca = $derived.by(() => {
    const t = String(arquivo?.titulo || nomeDeGente(arquivo?.nome || ""));
    const i = t.indexOf(" — ");
    const c = partirId(i > 0 && !/^[\p{Lu}]{1,4}-\d/u.test(t) ? t.slice(0, i) : t);
    return { ...c, resto: i > 0 && !c.id ? t.slice(i + 3) : "" };
  });

  async function mandarPedido() {
    recusa = "";
    try {
      const r = await enviarPedido(pedido, caminho);
      if (r?.aceita === false) { recusa = r.motivo || "não deu para mandar"; return; }
      mandado = r?.naHora
        ? "Mandei — o assistente estava esperando e já pegou."
        : "Mandei. O assistente pega quando voltar a olhar o painel.";
      abrindoPedido = false;
      pedido = "";
    } catch (e) {
      recusa = String(e?.message || e);
    }
  }
</script>

{#if erro}
  <p class="c-nota p-falta">{erro}</p>
{:else if !arquivo}
  <p class="c-corpo">lendo…</p>
{:else if ehItem}
  <Item {arquivo} {cabeca} {chaves} {faltam} {meusDocumentos} {arvore} {indice} {andamento} {acoes} {proximos}
    {rotulos} {motivos} {decisoes} {decidir} {anotar} {podeChamar} {chamar} {ocupados} {embutido}
    {documentosDoPack} tipo={tipoDaqui} />
  <details>
    <summary class="c-nota" style="cursor:pointer">ver o arquivo como está no disco
      (<span style="font-family:var(--mono);font-size:12.5px">{arquivo.caminho}</span>)</summary>
    <pre class="p-bloco" style="margin-top:var(--s2)">{arquivo.texto}</pre>
  </details>
  {@render rodape()}
{:else}
  <header class="c-secao" style="gap:var(--s1)">
    <h1 class="c-h2">{cabeca.nome}{#if cabeca.id}<span class="p-id" style="font-size:13px">{cabeca.id}</span>{/if}</h1>
    {#if cabeca.resto}<p class="c-nota">{cabeca.resto[0].toUpperCase() + cabeca.resto.slice(1)}</p>{/if}
    {#if documento}
      <div class="p-documento-botoes">
        <a class="c-acao" href={documento.previa} target="_blank" rel="noopener">Ver como PDF ↗</a>
        {#if documento.pdf}
          <a class="c-acao c-acao-cheia" href={documento.pdf} target="_blank" rel="noopener">Abrir o PDF ↗</a>
        {:else}
          <span class="c-nota">O PDF ainda não foi gerado: peça ao assistente, ou monte o currículo de novo.</span>
        {/if}
      </div>
    {/if}
    {#if donoDaqui}
      <!-- um documento de outro item: diz de quem é, e leva até lá (D239) -->
      <p class="p-pertence">Pertence a <a href={paraArquivo(donoDaqui)}>{nomeDoArquivo(donoDaqui)}</a>
        <span class="c-nota">· {pastaDe(caminho)}</span></p>
    {/if}
  </header>

  <!-- ── O PRÓXIMO PASSO (D235) ───────────────────────────────────────
       Antes da ficha, porque é a pergunta de quem abriu o item: "e agora?".
       Só para item que está numa etapa do funil — sem etapa não há depois. -->
  {#if !embutido && cabeca.id && andamento?.de?.has(cabeca.id)}
    <Proximo id={cabeca.id} nome={cabeca.nome} {andamento} {decisoes} {decidir} {anotar}
      {acoes} {proximos} {rotulos} {motivos} tipo={tipoDaqui || "item"} {podeChamar} {chamar} modo="cheio" comMotivo />
    {@const etapaDaqui = andamento.de.get(cabeca.id)}
    {@const naEtapa = [...andamento.de.values()].filter((e) => e === etapaDaqui).length}
    {#if naEtapa > 1}
      <!-- do item para a lista da etapa dele (D244): quem abriu um quer ver o seguinte -->
      <p class="c-nota">Está em “{etapaDaqui}” com mais {naEtapa - 1}. <a href={paraFunil(etapaDaqui, cabeca.id)}>Ver na lista do funil</a></p>
    {/if}
  {/if}

  {#if chaves.length}
    <dl class="p-chaves" aria-label="o que se lê antes de tudo">
      {#each chaves as c (c.rotulo)}
        <div class="p-chave" class:p-chave-falta={c.semResposta} title={c.de ? "← " + c.de : undefined}>
          <dt>{c.rotulo}</dt>
          <dd>{c.valor}</dd>
        </div>
      {/each}
    </dl>
    <!-- ── O QUE FALTA, E QUEM VAI ATRÁS (D245) ────────────────────────
         Ver "não diz" sem ter o que fazer era o defeito: o botão fica colado
         nos campos, e diz quais são. Ele só chama — o assistente procura,
         grava com a origem, e o que nenhuma fonte diz continua "não diz". -->
    {#if completar && tipoDaqui === "item" && cabeca.id && faltam.length}
      <div class="p-completar">
        <span>{faltam.length === 1 ? "1 campo" : `${faltam.length} campos`} sem resposta: {faltam.join(", ")}.</span>
        {#if podeChamar}
          <button type="button" class="c-acao" onclick={() => chamar(completar, cabeca.id)}>{rotulos[completar] || "Completar informações"}</button>
        {:else}
          <button type="button" class="c-acao" onclick={() => copiarPedido(`${completar} ${cabeca.id}`)}
            >{copiado ? "Copiado — cole no Claude" : (rotulos[completar] || "Completar informações") + " ⧉"}</button>
        {/if}
      </div>
    {/if}
  {/if}

  {#if arquivo.campos.length}
    <!-- a `Ficha` desenha os campos com a procedência visível e o `?` em
         âmbar. É a mesma vista que o agente manda, com os mesmos `dados`:
         um segundo desenho para a mesma coisa divergiria na primeira
         correção, e a procedência é justamente o que não pode sumir. -->
    <Ficha dados={{ campos: arquivo.campos, secoes: [] }} {indice} />
  {/if}

  {#if meusDocumentos.length}
    <!-- ── OS DOCUMENTOS DESTE ITEM (D239) ─────────────────────────────
         Tudo o que começa com o id dele e mora em outra pasta: o currículo
         feito para esta vaga, a carta, o laudo. -->
    <section class="c-secao" style="gap:var(--s1)" aria-label="documentos deste item">
      <h2 class="c-h3">Documentos deste item</h2>
      <ul class="p-documentos">
        {#each meusDocumentos as d (d)}
          <li><a href={paraArquivo(d)}><span class="p-documentos-pasta">{pastaDe(d)}</span> {nomeDoArquivo(d)}</a></li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if temOrigem || principais.length >= 4}
    <div class="p-arq-topo">
      {#if principais.length >= 4}
        <nav class="p-arq-indice" aria-label="seções deste arquivo">
          {#each principais as { s, i } (i)}<button type="button" class="c-chip" onclick={() => document.getElementById("secao-" + i)?.scrollIntoView({ block: "start", behavior: "smooth" })}>{s.titulo}</button>{/each}
        </nav>
      {/if}
      {#if temOrigem}
        <label class="p-arq-origem"><input type="checkbox" bind:checked={comOrigem} /> Mostrar de onde veio cada linha</label>
      {/if}
    </div>
  {/if}

  {#if arquivo.abertura.length}
    <section class="c-secao" style="gap:var(--s2)">
      <Itens itens={arquivo.abertura} {indice} origem={comOrigem ? "visivel" : "discreta"} />
    </section>
  {/if}

  {#each arquivo.secoes as s, i (i)}
    <!-- o `###` de um currículo é subtítulo, e não seção: desenhá-los
         iguais faria "Experiência" e "Gerente de produto · Âncora · 2022"
         lerem como duas coisas do mesmo nível. Ele vira um bloco (D258) -->
    {#if s.nivel <= 2}
      <section class="c-secao p-arq-secao" style="gap:var(--s2)" id={"secao-" + i}>
        <h2 class="c-h3">{s.titulo}</h2>
        <Itens itens={s.itens} {indice} origem={comOrigem ? "visivel" : "discreta"} />
      </section>
    {:else}
      {@const [cabeca, nota] = partirTitulo(s.titulo)}
      <section class="p-arq-sub" title={nota && !comOrigem ? nota : undefined}>
        <h3>{cabeca}</h3>
        {#if nota && comOrigem}<p class="p-arq-nota">{nota}</p>{/if}
        <Itens itens={s.itens} {indice} origem={comOrigem ? "visivel" : "discreta"} />
      </section>
    {/if}
  {/each}

  {#if vazio}
    <p class="c-corpo">Não reconheci nada com forma neste arquivo — está aqui
      como ele está no disco.</p>
    <pre class="p-bloco">{arquivo.texto}</pre>
  {:else}
    <!-- ── O TEXTO CRU, ATRÁS DE UM CLIQUE ────────────────────────────
         A interpretação é leve e pode ter perdido alguma coisa. Poder ver o
         arquivo como ele está no disco é o que impede a tela de virar a
         versão oficial dele — e é barato: o texto já veio junto. -->
    <details>
      <summary class="c-nota" style="cursor:pointer">ver o arquivo como está no disco
        (<span style="font-family:var(--mono);font-size:12.5px">{arquivo.caminho}</span>)</summary>
      <pre class="p-bloco" style="margin-top:var(--s2)">{arquivo.texto}</pre>
    </details>
  {/if}

  <!-- ── O QUE MAIS DÁ PARA PEDIR SOBRE ISTO (D232) ──────────────────
       Só em arquivo de ITEM (tem id). O que vai é o comando da lista do pack
       mais o id — nada digitado. Com o próximo passo lá em cima, esta lista
       é o RESTO: o que a etapa não pede agora, mas dá para pedir. -->
  {#if cabeca.id && acoesDaqui.length}
    <section class="c-secao" style="gap:var(--s2)">
      <h2 class="c-h3">{andamento?.de?.has(cabeca.id) ? "O que mais dá para pedir sobre isto" : "O que o assistente pode fazer com isto"}</h2>
      <div class="p-pedidos">
        {#each acoesDaqui as a (a.comando)}
          <div class="p-pedido">
            <b>{rotulos[a.comando] || a.nome}</b>
            <span>{a.oque}</span>
            {#if podeChamar}
              <button type="button" class="c-acao" style="align-self:flex-start"
                onclick={() => chamar(a.comando, cabeca.id)}>Fazer agora</button>
            {:else}
              <!-- sem o botão, o que resolve é a frase pronta, já com o código -->
              <span class="c-nota">Peça ao Claude: <code>{a.comando} {cabeca.id}</code></span>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  {@render rodape()}
{/if}

{#snippet rodape()}
  <footer class="c-secao" style="gap:var(--s2)">
    {#if !agente}
      <!-- com os botões acima na tela, "não dá para pedir nada" seria mentira:
           o que não dá é pedir OUTRA coisa, com as próprias palavras -->
      <p class="c-nota">{podeChamar && acoesDaqui.length
        ? "Para pedir outra coisa, com as suas palavras, abra o Claude e peça por lá."
        : "Não há conversa aberta agora, então daqui não dá para pedir nada. Abra o Claude e peça por lá."}</p>
    {:else if abrindoPedido}
      <label class="p-campo-linha" style="width:100%">
        <span class="c-selo">O que você quer pedir sobre isto?</span>
        <textarea class="p-campo" rows="4" bind:value={pedido}
          placeholder="prepara a mensagem para este"></textarea>
      </label>
      <div style="display:flex;flex-wrap:wrap;gap:var(--s2)">
        <button type="button" class="c-acao c-acao-cheia" disabled={!pedido.trim()}
          onclick={mandarPedido}>Mandar ao assistente</button>
        <button type="button" class="c-acao"
          onclick={() => { abrindoPedido = false; pedido = ""; }}>Deixa</button>
      </div>
      <p class="c-nota">
        {esperando
          ? "O assistente está esperando: o pedido chega na hora."
          : "O assistente não está olhando o painel agora. O pedido fica guardado até ele voltar a olhar — se tiver pressa, peça direto na conversa."}
      </p>
    {:else}
      <div style="display:flex;flex-wrap:wrap;gap:var(--s2);align-items:center">
        <button type="button" class="c-acao"
          onclick={() => { abrindoPedido = true; mandado = ""; }}>Pedir algo sobre isto…</button>
        {#if mandado}<span class="c-nota">{mandado}</span>{/if}
      </div>
    {/if}
    {#if recusa}<p class="c-nota p-falta">{recusa}</p>{/if}
  </footer>
{/snippet}
