<script>
  /**
   * A PASTA DAS PESSOAS (D258) — um cartão por pessoa.
   *
   * O `_indice.md` dela é uma tabela, e a tabela era a tela: cinco colunas
   * espremidas e nada sobre como chegar à pessoa. O cartão lê o cabeçalho de
   * cada arquivo (`/base/fichas`) e diz, em ordem de uso:
   *
   *   quem é          o nome, o cargo e a organização
   *   por que importa o papel, e por qual item ela fala — com o link
   *   como chegar     e-mail, telefone, perfil, canal; e o "não contatar",
   *                   que vale para todas as skills, à vista e em vermelho
   *   o que houve     a última linha do histórico
   *
   * Não sabe de ofício: os rótulos são os do arquivo. O que ele escolhe é só
   * a FORMA do valor — endereço vira link, `?` não aparece.
   */
  import { pedirFichas } from "../ponte.js";
  import { nomeDeGente, paraArquivo, partirId, semResposta, valorCurto } from "../rota.js";
  import ComIds from "./ComIds.svelte";

  let { nome, indice = null, recarga = 0, descricao = "" } = $props();

  let fichas = $state(null);
  let erro = $state("");
  let procura = $state("");
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

  const sa = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const pega = (campos, ...nomes) => {
    for (const n of nomes) {
      const k = Object.keys(campos).find((c) => sa(c) === sa(n));
      if (k && !semResposta(campos[k])) return String(campos[k]);
    }
    return "";
  };
  const dia = (linha) => {
    const m = String(linha || "").match(/^(\d{4})-(\d{2})-(\d{2})\s+(.*)$/);
    return m ? { quando: `${m[3]}/${m[2]}`, texto: m[4] } : { quando: "", texto: String(linha || "") };
  };

  const pessoas = $derived((fichas || []).map((f) => {
    const c = f.campos || {};
    const { id, nome: quem } = partirId(f.titulo || nomeDeGente(f.caminho.split("/").pop()));
    const url = pega(c, "perfil profissional", "perfil", "linkedin", "site");
    const email = pega(c, "e-mail", "email");
    const tel = pega(c, "telefone", "celular", "whatsapp");
    const naoContatar = /^sim\b/i.test(pega(c, "não contatar", "nao contatar"));
    const falaPor = Object.entries(f.secoes || {}).find(([t]) => /^fala por/i.test(sa(t)))?.[1] || [];
    return {
      caminho: f.caminho, id, quem,
      cargo: valorCurto(pega(c, "cargo", "função"), 60),
      org: valorCurto(pega(c, "empresa", "organização", "organizacao"), 60),
      papel: valorCurto(pega(c, "papel"), 40),
      canal: valorCurto(pega(c, "canal"), 50),
      url, email: valorCurto(email, 80), tel: valorCurto(tel, 40), naoContatar, falaPor,
      ultimo: dia(f.ultimo), em: f.em || 0,
      busca: sa([f.titulo, ...Object.values(c), ...falaPor].join(" ")),
    };
  }).sort((a, b) => b.em - a.em));
  const visiveis = $derived(procura.trim() ? pessoas.filter((p) => p.busca.includes(sa(procura))) : pessoas);
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
  {#if fichas}<p class="c-nota">{pessoas.length === 1 ? "1 pessoa" : `${pessoas.length} pessoas`} · a mais recente em cima</p>{/if}
</header>

{#if erro}
  <p class="c-nota p-falta">{erro}</p>
{:else if !fichas}
  <p class="c-corpo">lendo…</p>
{:else if !pessoas.length}
  <p class="p-vazio">Ninguém aqui ainda. Quem aparece numa candidatura ou numa conversa entra aqui, com a origem.</p>
{:else}
  {#if pessoas.length > 8}
    <input class="p-campo" type="search" bind:value={procura} placeholder="Procurar por nome, empresa, item" aria-label="procurar" />
  {/if}
  <div class="p-pessoas">
    {#each visiveis as p (p.caminho)}
      <article class="p-pessoa" data-nao-contatar={p.naoContatar ? "" : undefined}>
        <header>
          <a class="p-pessoa-nome" href={paraArquivo(p.caminho)}>{p.quem}</a>
          {#if p.id}<span class="p-id">{p.id}</span>{/if}
          {#if p.papel}<span class="p-pessoa-papel">{p.papel}</span>{/if}
        </header>
        {#if p.cargo || p.org}<p class="p-pessoa-onde">{[p.cargo, p.org].filter(Boolean).join(" · ")}</p>{/if}
        {#if p.naoContatar}<p class="p-pessoa-alerta">Não contatar — vale para toda mensagem, em qualquer canal.</p>{/if}
        {#if p.falaPor.length}
          <div class="p-pessoa-bloco">
            <span>Fala por</span>
            {#each p.falaPor as l, i (i)}<p><ComIds texto={l} {indice} /></p>{/each}
          </div>
        {/if}
        {#if p.url || p.email || p.tel || p.canal}
          <div class="p-pessoa-contato">
            {#if p.url}<a class="c-chip" href={p.url.split(/\s/)[0]} target="_blank" rel="noopener">Perfil ↗</a>{/if}
            {#if p.email}<a class="c-chip" href={"mailto:" + p.email}>{p.email}</a>{/if}
            {#if p.tel}<span class="c-chip">{p.tel}</span>{/if}
            {#if p.canal}<span class="p-pessoa-canal">canal: {p.canal}</span>{/if}
          </div>
        {/if}
        {#if p.ultimo.texto}
          <p class="p-pessoa-ultimo"><time>{p.ultimo.quando}</time> {p.ultimo.texto}</p>
        {/if}
      </article>
    {/each}
  </div>
{/if}
