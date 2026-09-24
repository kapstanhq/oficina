<script>
  /**
   * UMA PASTA DE DOCUMENTOS (D258) — o currículo, a carta: o que existe para
   * cada item, e em que estado.
   *
   * A pasta ligada a um modelo (`documentos` do pack) guarda arquivos com o id
   * do item no nome — `V-007-cv-en.md`, `V-007-carta.pdf`. A lista crua dizia
   * o nome do arquivo e mais nada; aqui eles se juntam POR ITEM, o `.md` e o
   * `.pdf` na mesma linha, e cada linha diz:
   *
   *   o que é      o tipo (da pasta) e a língua (`-en`, `-es` no nome)
   *   em que pé    o estado da primeira linha do arquivo, em comentário —
   *                `rascunho`, `aprovada em …` — e de que trajetória derivou
   *   quando       a data do arquivo
   *
   * O documento sem id (o currículo base) vem primeiro, sozinho. Não sabe de
   * ofício: "vaga" e "currículo" chegam da pasta e do apelido do item.
   */
  import { pedirFichas } from "../ponte.js";
  import { nomeDeGente, paraArquivo, paraFunil, TODAS } from "../rota.js";

  let { nome, mapa = null, andamento = null, nomeDoItem = () => "", recarga = 0, descricao = "",
    umItem = "Item", nomeDosItens = "Itens" } = $props();

  let fichas = $state(null);
  let erro = $state("");
  $effect(() => {
    recarga;
    const qual = nome;
    let vivo = true;
    fichas = null;
    erro = "";
    (async () => {
      try {
        const lidas = await pedirFichas(qual);
        if (vivo && qual === nome) fichas = lidas.fichas || [];
      } catch (e) { if (vivo && qual === nome) erro = String(e?.message || e); }
    })();
    return () => { vivo = false; };
  });

  const naPasta = $derived(new Set((mapa?.arvore || []).find((p) => p.tipo === "pasta" && p.nome === nome)?.itens || []));
  const tipo = $derived(nomeDeGente(nome).replace(/s$/, ""));
  const IDIOMAS = { en: "em inglês", es: "em espanhol", pt: "em português" };
  const dia = (iso) => { const m = String(iso || "").match(/(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}` : ""; };
  const hoje = new Date();
  const quando = (ms) => {
    if (!ms) return "";
    const d = new Date(ms);
    const mesmoDia = d.toDateString() === hoje.toDateString();
    const hm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return mesmoDia ? `hoje, ${hm}` : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const docs = $derived((fichas || []).map((f) => {
    const arquivo = f.caminho.split("/").pop();
    const id = (arquivo.match(/^([\p{Lu}]{1,4}-\d{1,6})-/u) || [])[1] || "";
    const lingua = (arquivo.match(/-(en|es|pt)\.md$/i) || [])[1]?.toLowerCase() || "";
    const nota = String(f.nota || "");
    const aprovada = nota.match(/aprovad[ao]\s+em\s+(\d{4}-\d{2}-\d{2})/i);
    const estado = aprovada ? { tom: "ok", texto: `Aprovada em ${dia(aprovada[1])}` }
      : /^rascunho\b/i.test(nota) ? { tom: "rascunho", texto: "Rascunho — falta você ler" } : null;
    const origem = nota.match(/derivad[ao]\s+de\s+([\w.-]+?)(?:\.md)?,\s*atualizada\s+em\s+(\d{4}-\d{2}-\d{2})/i);
    const pdf = arquivo.replace(/\.md$/i, ".pdf");
    return {
      caminho: f.caminho, id, lingua, estado, em: f.em || 0,
      origem: origem ? `da ${nomeDeGente(origem[1]).toLowerCase()} de ${dia(origem[2])}` : "",
      pdf: naPasta.has(pdf) ? `/base/pdf?caminho=${encodeURIComponent(`${nome}/${pdf}`)}` : "",
      nota,
    };
  }));
  /* por item, o que mudou por último em cima; o sem id, antes de todos */
  const grupos = $derived.by(() => {
    const por = new Map();
    for (const d of docs) {
      const k = d.id || "";
      if (!por.has(k)) por.set(k, []);
      por.get(k).push(d);
    }
    return [...por.entries()].map(([id, lista]) => ({
      id, lista: lista.sort((a, b) => (a.lingua ? 1 : 0) - (b.lingua ? 1 : 0)),
      em: Math.max(...lista.map((d) => d.em)),
      /* o item que saiu da base (arquivo-morto) não tem mais ficha: o nome
         vem da primeira linha do próprio documento, "para V-014 (…)" */
      nome: id ? nomeDoItem(id) || (lista.map((d) => d.nota.match(/para\s+[\p{Lu}]{1,4}-\d{1,6}\s+\(([^)]+)\)/u)?.[1]).find(Boolean) || "") : "",
      etapa: id ? andamento?.de?.get(id) || "" : "",
      vivo: !!(id && andamento?.de?.has(id)),
    })).sort((a, b) => (a.id ? 1 : 0) - (b.id ? 1 : 0) || b.em - a.em);
  });
  const comPdf = $derived(docs.filter((d) => d.pdf).length);
  const itens = $derived(grupos.filter((g) => g.id).length);
  /* a linha do `## Onde está o quê`, sem o pedaço que fala do `_indice.md`:
     aquilo é para quem edita a base, e não para quem lê a página */
  const frase = $derived.by(() => {
    const f = String(descricao || "").split(/;\s*/).filter((p) => !/^_indice\b/.test(p.trim())).join("; ").trim();
    return f ? f[0].toUpperCase() + f.slice(1).replace(/\.?$/, ".") : "";
  });
</script>

<header class="c-secao" style="gap:var(--s1)">
  <h1 class="c-h2">{nomeDeGente(nome)}</h1>
  {#if frase}<p class="p-docs-descricao">{frase}</p>{/if}
  {#if fichas}
    <p class="c-nota">{docs.length} {docs.length === 1 ? tipo.toLowerCase() : nomeDeGente(nome).toLowerCase()}{#if itens}{" para " + itens + " " + (itens === 1 ? umItem.toLowerCase() : nomeDosItens.toLowerCase())}{/if} · {comPdf} com PDF</p>
  {/if}
</header>

{#if erro}
  <p class="c-nota p-falta">{erro}</p>
{:else if !fichas}
  <p class="c-corpo">lendo…</p>
{:else if !docs.length}
  <p class="p-vazio">Nada aqui ainda.</p>
{:else}
  <div class="p-docs">
    {#each grupos as g (g.id)}
      <section class="p-docs-grupo" aria-label={g.id ? `${g.id} ${g.nome}` : "sem " + umItem.toLowerCase()}>
        <header class="p-docs-cabeca">
          {#if g.id}
            <div>
              <span class="p-docs-id">{g.id}{g.etapa ? " · " + g.etapa : g.vivo ? "" : " · fora do funil"}</span>
              <h2>{#if g.vivo}<a href={paraFunil(TODAS, g.id)}>{g.nome || g.id}</a>{:else}{g.nome || g.id}{/if}</h2>
            </div>
            {#if g.vivo}<a class="c-chip" href={paraFunil(TODAS, g.id)}>Abrir {umItem.toLowerCase()} ›</a>{/if}
          {:else}
            <div>
              <span class="p-docs-id">sem {umItem.toLowerCase()}</span>
              <h2>O ponto de partida</h2>
            </div>
          {/if}
        </header>
        <ul class="p-docs-lista">
          {#each g.lista as d (d.caminho)}
            <li>
              <a class="p-docs-doc" href={paraArquivo(d.caminho)} title={d.nota || undefined}>
                <b>{g.id ? tipo : nomeDeGente(d.caminho.split("/").pop().replace(/\.md$/i, ""))}{#if d.lingua}{" " + (IDIOMAS[d.lingua] || d.lingua)}{/if}</b>
                <span>
                  {#if d.estado}<em data-tom={d.estado.tom}>{d.estado.texto}</em>{/if}
                  {[d.origem, d.em ? "mudou " + quando(d.em) : ""].filter(Boolean).join(" · ")}
                </span>
              </a>
              <div class="p-docs-botoes">
                <a class="c-chip" href={paraArquivo(d.caminho)}>Abrir</a>
                {#if d.pdf}<a class="c-chip" href={d.pdf} target="_blank" rel="noopener">PDF ↗</a>
                {:else}<span class="c-nota">sem PDF</span>{/if}
              </div>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
{/if}
