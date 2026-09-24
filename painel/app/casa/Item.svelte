<script>
  /**
   * A PÁGINA DE UM ITEM (D257) — em ordem de pergunta.
   *
   *   quem é          o título, de quem, a etapa, e os endereços (o anúncio,
   *                   onde se candidata)
   *   e agora?        o próximo passo, com o porquê e a trilha da etapa: o que
   *                   já foi feito, o de agora e o que vem
   *   cabe para mim?  os campos do `destaque`, no trecho curto; o valor inteiro
   *                   e a origem ficam atrás de um clique
   *   o que se sabe   as seções com conteúdo. As vazias viram UMA linha, e não
   *                   três "nada ainda"
   *   documentos      o que existe para ele, com o PDF
   *   histórico       as últimas linhas; o resto e a ficha inteira, com a
   *                   procedência de cada campo, atrás de um clique
   *
   * A procedência não some (é a regra 2 do contrato): sai da primeira leitura.
   * Não sabe de ofício — "vaga", "encaixe", "currículo" chegam do pack.
   */
  import Ficha from "../vistas/Ficha.svelte";
  import Itens from "./Itens.svelte";
  import ComIds from "./ComIds.svelte";
  import { passosDoItem, notaQueDiz, valorCurto, ehLinhaVazia, nomeDeGente, nomeDoArquivo, paraArquivo } from "../rota.js";

  let { arquivo, cabeca, chaves = [], faltam = [], meusDocumentos = [], arvore = [], indice = null,
    andamento = null, acoes = [], proximos = {}, rotulos = {}, motivos = [], decisoes = [],
    decidir = () => {}, anotar = () => {}, podeChamar = false, chamar = () => {}, ocupados = [],
    embutido = false, documentosDoPack = {}, tipo = "item" } = $props();

  const id = $derived(cabeca?.id || "");
  const etapa = $derived(andamento?.de?.get(id) || "");

  /* ── QUEM É ─────────────────────────────────────────────────────────── */
  /* o apelido é "<o que>, <de quem>": a vírgula final separa os dois */
  const titulo = $derived.by(() => {
    const t = String(cabeca?.nome || "");
    const i = t.lastIndexOf(", ");
    return i > 0 ? { oque: t.slice(0, i), quem: t.slice(i + 2) } : { oque: t, quem: "" };
  });
  const campo = (rotulo) => (arquivo?.campos || []).find((c) => c.rotulo.toLowerCase() === rotulo);
  const desde = $derived.by(() => {
    const m = String(campo("etapa")?.valor || "").match(/desde\s+(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[3]}/${m[2]}` : "";
  });
  /* todo campo cujo valor começa por um endereço vira um botão: o rótulo diz
     o que é, o domínio diz para onde vai */
  const enderecos = $derived((arquivo?.campos || []).flatMap((c) => {
    const m = String(c.valor || "").match(/^(https?:\/\/\S+?)(?:\s+—\s+(.*))?$/);
    if (!m) return [];
    let onde = "";
    try { onde = new URL(m[1]).hostname.replace(/^www\./, ""); } catch { return []; }
    return [{ rotulo: c.rotulo, url: m[1], onde, nota: m[2] || "" }];
  }));

  /* ── E AGORA? ───────────────────────────────────────────────────────── */
  const ficha = $derived({
    campos: Object.fromEntries((arquivo?.campos || []).map((c) => [c.rotulo, c.valor])),
    faltam,
    pastasDeDocs: [...new Set(meusDocumentos.map((d) => d.split("/")[0]))],
    historico: (historico?.itens || []).map((i) => i.texto || ""),
  });
  const passos = $derived(passosDoItem({ id, andamento, acoes, proximos, rotulos, tipo, ficha, ocupados }));
  const destaque = $derived(passos.destaque || passos.lista.find((p) => p.tipo !== "descartar") || null);
  const outros = $derived(passos.lista.filter((p) => p !== destaque));
  const notaDoAgente = $derived(notaQueDiz(passos.doAgente?.nota));
  const marcada = $derived(decisoes.find((d) => d.item === id) || null);

  let copiado = $state("");
  async function agir(p) {
    if (!p) return;
    if (p.tipo === "marcar") decidir({ item: id, nome: cabeca.nome, de: etapa, gesto: "etapa", para: passos.seguinte });
    else if (p.tipo === "descartar") decidir({ item: id, nome: cabeca.nome, de: etapa, gesto: "descartar" });
    else if (p.tipo === "skill" && p.ocupado) return;
    else if (p.tipo === "skill" && podeChamar) chamar(p.comando, p.item);
    else {
      try { await navigator.clipboard.writeText(p.pedido); copiado = p.chave; } catch { copiado = ""; }
      setTimeout(() => { copiado = ""; }, 2500);
    }
  }
  const rotuloDe = (p) => (copiado === p.chave ? "Copiado — cole no Claude"
    : p.ocupado ? `${p.rotulo} · ${p.ocupado}`
    : p.tipo === "conversa" || (p.tipo === "skill" && !podeChamar) ? p.rotulo + " ⧉" : p.rotulo);

  /* ── O QUE SE SABE ──────────────────────────────────────────────────── */
  const ehHistorico = (s) => /^hist[óo]rico$/i.test(String(s.titulo || "").trim());
  const vazia = (s) => !s.itens.length || s.itens.every((i) => i.tipo === "linha" && ehLinhaVazia(i.texto));
  const historico = $derived((arquivo?.secoes || []).find(ehHistorico) || null);
  const secoes = $derived((arquivo?.secoes || []).filter((s) => !ehHistorico(s) && s.nivel <= 2));
  const cheias = $derived(secoes.filter((s) => !vazia(s)));
  const vazias = $derived(secoes.filter(vazia));

  /* o valor inteiro de um campo do destaque, e o resto dele depois do trecho
     curto — é o que se abre com um clique */
  const abertas = $state({});
  const detalheDe = (c) => {
    const inteiro = String(campo(c.rotulo.toLowerCase())?.valor || "").trim();
    const curto = valorCurto(inteiro, 60);
    return inteiro && inteiro !== curto && !inteiro.startsWith("?") ? inteiro : "";
  };

  /* ── HISTÓRICO ──────────────────────────────────────────────────────── */
  const linhasDoHistorico = $derived((historico?.itens || []).filter((i) => i.tipo === "linha").map((i) => {
    const m = String(i.texto || "").match(/^(\d{4})-(\d{2})-(\d{2})\s+(.*)$/);
    return { quando: m ? `${m[3]}/${m[2]}` : "", texto: m ? m[4] : i.texto, de: i.de || "" };
  }).reverse());
  let historicoInteiro = $state(false);
  const TETO_DO_HISTORICO = 4;

  /* ── DOCUMENTOS ─────────────────────────────────────────────────────── */
  const docs = $derived(meusDocumentos.filter((d) => /\.md$/i.test(d)).map((d) => {
    const pasta = d.split("/")[0];
    const pdf = d.replace(/\.md$/i, ".pdf");
    const temPdf = (arvore || []).some((p) => p.tipo === "pasta" && p.nome === pasta && (p.itens || []).includes(pdf.split("/").pop()));
    return { caminho: d, rotulo: nomeDeGente(pasta).replace(/s$/, ""), nome: nomeDoArquivo(d),
      pdf: temPdf ? `/base/pdf?caminho=${encodeURIComponent(pdf)}` : "", comModelo: pasta in (documentosDoPack || {}) };
  }));
</script>

<article class="p-pag">
  <!-- ── QUEM É ───────────────────────────────────────────────────────── -->
  <header class="p-pag-cabeca">
    <div class="p-pag-sobre">
      {#if etapa}<span class="p-pag-etapa" data-etapa={etapa}>{etapa[0].toUpperCase() + etapa.slice(1)}{#if desde} · desde {desde}{/if}</span>{/if}
      {#if id}<span class="p-id">{id}</span>{/if}
    </div>
    <h1 class="p-pag-titulo">{titulo.oque}</h1>
    {#if titulo.quem}<p class="p-pag-quem">{titulo.quem}</p>{/if}
    {#if enderecos.length}
      <div class="p-pag-enderecos">
        {#each enderecos as e (e.url)}
          <a class="c-chip" href={e.url} target="_blank" rel="noopener" title={e.nota || e.url}>
            {e.rotulo === "link" ? "Anúncio" : e.rotulo[0].toUpperCase() + e.rotulo.slice(1)} · {e.onde} ↗</a>
        {/each}
      </div>
    {/if}
  </header>

  <!-- ── E AGORA? ─────────────────────────────────────────────────────── -->
  {#if destaque}
    <section class="p-pag-proximo" aria-label="próximo passo">
      <div class="p-pag-proximo-texto">
        <span class="p-pag-rotulo">Próximo passo</span>
        <b>{destaque.rotulo}</b>
        {#if destaque.porque}<p>{destaque.porque}</p>{:else if destaque.oque}<p>{destaque.oque}</p>{:else if destaque.dica}<p>{destaque.dica}</p>{/if}
        {#if notaDoAgente}<p class="p-pag-nota">O assistente anotou: {notaDoAgente}</p>{/if}
        {#if destaque.ocupado}<p class="p-pag-nota">Já está {destaque.ocupado === "rodando" ? "rodando agora" : "na fila do assistente"} — a página se atualiza quando ele terminar.</p>{/if}
      </div>
      <div class="p-pag-proximo-acao">
        <button type="button" class="c-acao c-acao-cheia" disabled={!!destaque.ocupado}
          class:p-chip-recusa={destaque.tipo === "descartar"} onclick={() => agir(destaque)}>{rotuloDe(destaque)}</button>
        {#if embutido}<span class="c-nota">As outras ações estão em “Mais ações”, lá em cima.</span>{/if}
      </div>
      {#if passos.trilha.length > 1}
        <ol class="p-pag-trilha" aria-label="o caminho desta etapa">
          {#each passos.trilha as t (t.chave)}
            <li data-feito={t.feito && !t.agora ? "" : undefined} data-agora={t.agora ? "" : undefined}>
              <span aria-hidden="true">{t.agora ? "●" : t.feito ? "✓" : "○"}</span>{t.rotulo}
            </li>
          {/each}
        </ol>
      {/if}
      {#if !embutido && outros.length}
        <div class="p-pag-outros">
          <span>ou:</span>
          {#each outros as p (p.chave)}
            <button type="button" class="c-chip" class:p-chip-recusa={p.tipo === "descartar"} disabled={!!p.ocupado}
              title={p.dica || p.oque || undefined} onclick={() => agir(p)}>{rotuloDe(p)}</button>
          {/each}
        </div>
      {/if}
      {#if marcada}
        <p class="p-pag-nota">{marcada.gesto === "descartar" ? "Descarte marcado" : `Mudança para “${marcada.para}” marcada`} — o assistente grava quando você mandar.</p>
      {/if}
    </section>
  {/if}

  <!-- ── CABE PARA MIM? ───────────────────────────────────────────────── -->
  {#if chaves.length}
    <section class="p-pag-bloco" aria-label="o que decide se cabe">
      <h2 class="p-pag-h2">Cabe para mim?{#if faltam.length}<span>{faltam.length} sem resposta</span>{/if}</h2>
      <dl class="p-pag-fatos">
        {#each chaves as c (c.rotulo)}
          {@const detalhe = detalheDe(c)}
          <div class="p-pag-fato" data-falta={c.semResposta ? "" : undefined}>
            <dt>{c.rotulo}</dt>
            <dd>
              <b title={c.semResposta ? undefined : String(campo(c.rotulo.toLowerCase())?.valor || "")}>{c.semResposta ? c.valor : valorCurto(campo(c.rotulo.toLowerCase())?.valor || c.valor, 60)}</b>
              {#if detalhe}
                <button type="button" class="p-pag-mais" aria-expanded={!!abertas[c.rotulo]}
                  onclick={() => { abertas[c.rotulo] = !abertas[c.rotulo]; }}>{abertas[c.rotulo] ? "menos" : "detalhes"}</button>
                {#if abertas[c.rotulo]}<span class="p-pag-detalhe">{detalhe}</span>{/if}
              {/if}
              {#if c.semResposta && c.de}<span class="p-pag-detalhe">{c.de}</span>{/if}
            </dd>
          </div>
        {/each}
      </dl>
    </section>
  {/if}

  <!-- ── O QUE SE SABE ────────────────────────────────────────────────── -->
  {#if cheias.length}
    <div class="p-pag-secoes">
      {#each cheias as s, i (i)}
        <section class="p-pag-bloco">
          <h2 class="p-pag-h2">{s.titulo}</h2>
          <Itens itens={s.itens} {indice} origem="discreta" />
        </section>
      {/each}
    </div>
  {/if}
  {#if vazias.length}
    <p class="p-pag-vazias"><span>Ainda sem nada:</span> {vazias.map((s) => s.titulo).join(" · ")}</p>
  {/if}

  <!-- ── DOCUMENTOS ───────────────────────────────────────────────────── -->
  {#if docs.length}
    <section class="p-pag-bloco" aria-label="documentos deste item">
      <h2 class="p-pag-h2">Documentos</h2>
      <ul class="p-pag-docs">
        {#each docs as d (d.caminho)}
          <li>
            <a href={paraArquivo(d.caminho)}><b>{d.rotulo}</b><span>{d.nome}</span></a>
            {#if d.pdf}<a class="c-chip" href={d.pdf} target="_blank" rel="noopener">PDF ↗</a>
            {:else if d.comModelo}<span class="c-nota">sem PDF ainda</span>{/if}
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <!-- ── HISTÓRICO ────────────────────────────────────────────────────── -->
  {#if linhasDoHistorico.length}
    <section class="p-pag-bloco" aria-label="histórico">
      <h2 class="p-pag-h2">Histórico<span>{linhasDoHistorico.length} {linhasDoHistorico.length === 1 ? "passo" : "passos"}, o mais novo em cima</span></h2>
      <ol class="p-pag-historico">
        {#each historicoInteiro ? linhasDoHistorico : linhasDoHistorico.slice(0, TETO_DO_HISTORICO) as l, i (i)}
          <li title={l.de ? "← " + l.de : undefined}><time>{l.quando}</time><span><ComIds texto={l.texto} {indice} /></span></li>
        {/each}
      </ol>
      {#if linhasDoHistorico.length > TETO_DO_HISTORICO}
        <button type="button" class="p-pag-mais" onclick={() => { historicoInteiro = !historicoInteiro; }}>
          {historicoInteiro ? "mostrar menos" : `mostrar os ${linhasDoHistorico.length}`}</button>
      {/if}
    </section>
  {/if}

  <!-- ── A FICHA INTEIRA, COM A ORIGEM DE CADA CAMPO ──────────────────── -->
  {#if arquivo.campos.length}
    <details class="p-pag-ficha">
      <summary>Todos os campos, e de onde veio cada um</summary>
      <Ficha dados={{ campos: arquivo.campos, secoes: [] }} {indice} />
    </details>
  {/if}
</article>
