<script>
  /**
   * O FUNIL EM LISTA E DETALHE (D244) — o `Leitor` sobre o `funil.md`.
   *
   * A lista é a da etapa escolhida, na ordem do funil; em `todas`, da etapa
   * mais avançada para a menos, porque o que está perto do fim é o que pede
   * atenção primeiro. O item aberto é a página INTEIRA do arquivo, embutida:
   * um resumo escolhe por quem lê o que ler, e foi o que fez o baralho parecer
   * um cartão pequeno. Os gestos são os do próximo passo (`passosDoItem`).
   *
   * A seleção mora no endereço: voltar do navegador volta ao item anterior,
   * e o link para uma vaga aberta funciona colado em outra aba.
   *
   * SEM item no endereço, a TABELA (D274): todos de uma vez, com a ficha de
   * cada um, e clicar abre. A ordem é uma só para a tabela e para a lista do
   * leitor — e é a mesma do funil do início; quem a guarda é a casca.
   */
  import { getContext } from "svelte";
  import Leitor from "../Leitor.svelte";
  import Arquivo from "./Arquivo.svelte";
  import Tabela from "./Tabela.svelte";
  import { partirLinha, idsDaLinha, partirId, passosDoItem, caudaParaLer, ehLinhaVazia,
    paraFunil, TODAS, nomeDoArquivo, comFicha, pegarDoItem, ordenar as emOrdem, ordenacoesDe,
    sentidoPadrao, semResposta, fichaDoItem, valorCurto, faseDe, trechosDoFunil, noTrecho, ehFim, gestoDoPasso } from "../rota.js";

  let { etapa = TODAS, id = "", funil = null, indice, documentos = null, andamento = null,
    decisoes = [], decidir = async () => {}, anotar = () => {}, acoes = [], proximos = {},
    rotulos = {}, motivos = [], destaque = [], pastasDoPack = {}, podeChamar = false,
    chamar = () => {}, recarga = 0, agente = false, esperando = false,
    nome = "Funil", mapa = null, completar = "", fichas = null, documentosDoPack = {}, ordens = {}, fases = {},
    ordem = { chave: "", desc: false }, ordenar = () => {}, umItem = "", ocupados = [] } = $props();
  const molde = getContext("molde");
  const fim = $derived(molde?.fim || null);

  const linhasDe = (s) => (s?.itens || []).filter((i) => i.tipo === "linha" && !ehLinhaVazia(i.texto));
  const secoes = $derived((funil?.secoes || []).map((s) => ({
    rotulo: s.titulo,
    itens: linhasDe(s).map((i) => {
      const { titulo, cauda } = partirLinha(i.texto);
      const ids = idsDaLinha(i.texto, indice);
      const p = partirId(titulo);
      const idDaLinha = ids[0] || p.id;
      return { chave: idDaLinha || titulo, id: idDaLinha, titulo: p.nome, sub: caudaParaLer(cauda),
        etapa: s.titulo, caminho: ids.length ? indice.get(ids[0]) : "" };
    }),
  })));
  const todas = $derived(etapa === TODAS);
  /* o que está na pasta dos itens e não está no funil entra no fim de "todas",
     marcado — a pasta virou esta tela (D245), e nada pode sumir por não ter etapa */
  const foraDoFunil = $derived((() => {
    const noFunil = new Set(secoes.flatMap((s) => s.itens.map((it) => it.id)));
    const pasta = (mapa?.arvore || []).find((p) => p.tipo === "pasta" && p.nome === pastasDoPack?.item);
    return (pasta?.itens || []).map((n) => ({ n, id: (n.match(/^(\p{Lu}{1,4}-\d{1,6})-/u) || [])[1] || "" }))
      .filter((x) => x.id && !noFunil.has(x.id))
      .map((x) => ({ chave: x.id, id: x.id, titulo: nomeDoArquivo(x.n).replace(/^\S+ \((.*)\)$/, "$1"),
        sub: "", etiqueta: "fora do funil", caminho: `${pastasDoPack.item}/${x.n}` }));
  })());
  /* os itens de uma etapa (ou de todas), com a ficha de cada um e na ordem
     escolhida — a mesma nas duas vistas */
  const etapas = $derived(secoes.map((s) => s.rotulo));
  /* o filtro é um TRECHO do pipeline: uma etapa, ou uma fase dela (D266) */
  const trechos = $derived(trechosDoFunil(etapas, fases));
  const comFase = (it) => { const f = faseDe(it, fases); return f ? { ...it, etiqueta: `${it.etapa} · ${f}` } : it; };
  const listaDe = (qual) => {
    const todosOs = secoes.flatMap((s) => s.itens)
      .map((it) => comFase(comFicha(it, { fichas, destaque, documentos, documentosDoPack, etapas })));
    const t = trechos.find((x) => x.chave === qual);
    const escolhidos = qual === TODAS
      ? [...[...todosOs].reverse().map((it) => ({ ...it, etiqueta: it.etiqueta || it.etapa })),
        ...foraDoFunil.map((it) => comFicha(it, { fichas, destaque, documentos, documentosDoPack, etapas }))]
      : t ? todosOs.filter((it) => noTrecho(it, t, fases)) : [];
    return emOrdem(escolhidos, ordem, pegarDoItem, ordens);
  };
  /* o que se lê passando o mouse na linha do leitor: quem é, a etapa, os
     campos do destaque que têm resposta e o último passo */
  const dicaDe = (it) => [`${it.id ? it.id + " · " : ""}${it.titulo}`, it.etiqueta || it.etapa || "",
    ...destaque.filter((d) => !semResposta(it.campos?.[d])).map((d) => `${d}: ${valorCurto(it.campos[d], 60)}`),
    it.ultimo ? "último passo: " + it.ultimo : ""].filter(Boolean).join("\n");
  const itens = $derived(listaDe(etapa).map((it) => ({ ...it, dica: dicaDe(it) })));
  /* no leitor, o filtro não fecha o item: fica nele se ele é da etapa, senão
     abre o primeiro dela. Etapa vazia cai na tabela, que diz que está vazia */
  function filtrarNoLeitor(qual) {
    const lista = listaDe(qual);
    location.hash = paraFunil(qual, lista.some((it) => it.chave === id) ? id : lista[0]?.chave || "");
  }
  const porChave = (chave) => ordenar(chave, sentidoPadrao(chave, itens, ordens));
  const colunas = $derived([
    { chave: "nome", rotulo: umItem || "Nome", tipo: "nome" },
    ...(todas ? [{ chave: "etapa", rotulo: "Etapa", tipo: "etapa" }] : []),
    /* coluna em que NENHUM item tem resposta é só "?" de cima a baixo, e toma
       a largura que falta às outras — medido: a 1300 px, com as seis do
       destaque, o encaixe ficava fora da tela */
    ...destaque.filter((d) => itens.some((it) => !semResposta(it.campos?.[d])))
      .map((d) => ({ chave: d, rotulo: d[0].toUpperCase() + d.slice(1), tipo: "campo" })),
    ...(Object.keys(documentosDoPack).length ? [{ chave: "documentos", rotulo: "Documentos", tipo: "documentos" }] : []),
    { chave: "faltam", rotulo: "Falta", tipo: "faltam" },
    { chave: "atualizada", rotulo: "Atualizada", tipo: "atualizada" },
  ]);
  const filtros = $derived([
    { chave: TODAS, rotulo: "Todas", quantos: secoes.reduce((n, s) => n + s.itens.length, 0) + foraDoFunil.length },
    ...trechos.map((t) => ({ ...t, quantos: listaDe(t.chave).length }))
      .filter((t) => t.quantos || t.chave === etapa)
      .map((t) => ({ chave: t.chave, rotulo: t.rotulo[0].toUpperCase() + t.rotulo.slice(1), quantos: t.quantos })),
  ]);

  const opcoesDe = (it) => {
    const p = passosDoItem({ id: it.id, andamento, acoes, proximos, rotulos, ficha: fichaDoItem(it), ocupados, fim });
    return p.lista.map((x) => ({
      chave: x.chave, passo: x, dica: x.porque || x.dica || x.oque || "",
      tipo: x.tipo === "marcar" || x.tipo === "descartar" || x.tipo === "fim" ? "marca" : "acao",
      tom: x.tipo === "descartar" ? "recusa" : "", motivo: x.tipo === "descartar",
      destaque: !!x.recomendado, ocupado: x.ocupado || "",
      rotulo: x.tipo === "conversa" || (x.tipo === "skill" && !podeChamar) ? x.rotulo + " ⧉" : x.rotulo,
    }));
  };
  const marcadaDe = (it) => {
    const d = decisoes.find((x) => x.item === it.id);
    return d ? (ehFim(d, fim) ? "fim" : d.gesto === "descartar" ? "descartar" : "marcar") : "";
  };
  async function escolher(it, op, motivo = "") {
    const x = op.passo;
    const de = andamento?.de?.get(it.id) || it.etapa;
    const g = gestoDoPasso(x, { id: it.id, nome: it.titulo, etapa: de, marcada: decisoes.find((d) => d.item === it.id), fim });
    if (g?.anotar) anotar({ ...g.anotar, motivo });
    else if (g?.decidir) {
      await decidir(g.decidir);
      if (motivo && x.tipo === "descartar") anotar({ item: it.id, motivo });
    } else if (x.tipo === "skill" && podeChamar) chamar(x.comando, x.item);
    else { try { await navigator.clipboard.writeText(x.pedido); } catch { /* o rótulo mostra o pedido */ } }
  }
</script>

<header class="c-secao p-funil-cabeca" style="gap:var(--s0)">
  <h1 class="c-h2">{nome}</h1>
  <p class="c-nota">{id ? "Decida em cima do item. O que você marca vai para a barra de baixo, e o assistente grava quando você mandar."
    : "Todas de uma vez. Clique no título de uma coluna para ordenar, e numa linha para abrir."}</p>
</header>

{#if !funil}
  <p class="c-corpo">lendo…</p>
{:else if !id}
  <Tabela {itens} {colunas} {ordem} ordenar={porChave} abrir={(c) => { location.hash = paraFunil(etapa, c); }}
    hrefDe={(it) => paraFunil(etapa, it.chave)} {filtros} filtro={etapa} filtrar={(f) => { location.hash = paraFunil(f); }}
    {marcadaDe} vazio={todas ? "O funil está vazio." : `Nada em “${etapa}” agora.`} />
{:else}
  <Leitor {itens} selecionado={id} selecionar={(c) => { location.hash = c ? paraFunil(etapa, c) : paraFunil(etapa); }}
    ordenacoes={ordenacoesDe(destaque)} {ordem} ordenar={porChave} voltar="‹ Tabela" voltarSempre
    {filtros} filtro={etapa} filtrar={filtrarNoLeitor}
    {opcoesDe} {marcadaDe} {escolher} {motivos} rotuloDaLista="itens do funil"
    vazio={todas ? "O funil está vazio." : `Nada em “${etapa}” agora.`}>
    {#snippet detalhe(it)}
      {#if it.caminho}
        <Arquivo caminho={it.caminho} embutido {recarga} {indice} {documentos} {destaque} {andamento}
          {decisoes} {decidir} {anotar} {acoes} {proximos} {rotulos} {motivos} {pastasDoPack}
          {podeChamar} {chamar} {agente} {esperando} {completar} {ocupados} {documentosDoPack} arvore={mapa?.arvore || []} />
      {:else}
        <h2 class="c-h2">{it.titulo}</h2>
        <p class="c-nota">Este item não tem arquivo na base.</p>
      {/if}
    {/snippet}
  </Leitor>
{/if}
