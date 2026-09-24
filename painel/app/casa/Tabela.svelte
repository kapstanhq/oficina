<script>
  /**
   * A TABELA DOS ITENS (D274) — todos de uma vez, para bater o olho antes de
   * abrir um.
   *
   * Não sabe de ofício: as colunas chegam prontas de quem a monta, cada uma
   * com o `tipo` que diz como desenhar a célula. A ordem também chega de fora
   * (`ordem` + `ordenar`), porque é a mesma da lista do leitor e do funil do
   * início — o clique no título da coluna escolhe, o segundo inverte.
   *
   * No telefone a tabela vira cartões: a mesma linha, com o rótulo de cada
   * célula escrito ao lado do valor.
   */
  import { valorCurto, semResposta } from "../rota.js";

  let { itens = [], colunas = [], ordem = { chave: "", desc: false }, ordenar = () => {},
    abrir = () => {}, hrefDe = () => "", filtros = [], filtro = "", filtrar = () => {},
    marcadaDe = () => "", vazio = "Nada aqui." } = $props();

  let procura = $state("");
  const semAcento = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const visiveis = $derived(procura.trim()
    ? itens.filter((it) => semAcento(`${it.titulo} ${it.id} ${Object.values(it.campos || {}).join(" ")}`)
      .includes(semAcento(procura.trim())))
    : itens);

  const hoje = new Date();
  const dia = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  function quando(ms) {
    if (!ms) return "";
    const d = new Date(ms);
    const dias = Math.floor((new Date(hoje.toDateString()) - new Date(d.toDateString())) / 86400000);
    if (dias <= 0) return `hoje, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return dias === 1 ? "ontem" : dia(d);
  }
  /* "2026-09-23 completado: regime, inglês…" → "23/09 · completado" */
  function passo(linha) {
    const m = /^(\d{4})-(\d{2})-(\d{2})\s+(.*)$/.exec(String(linha || ""));
    const resto = (m ? m[4] : String(linha || "")).split(/[:—←]/)[0].trim();
    return m ? `${m[3]}/${m[2]} · ${resto}` : resto;
  }
  const seta = (c) => (ordem.chave === c.chave ? (ordem.desc ? " ↓" : " ↑") : "");
</script>

<div class="p-tabela">
  <div class="p-tabela-topo">
    {#if filtros.length}
      <div class="p-leitor-filtros" role="group" aria-label="filtrar">
        {#each filtros as f (f.chave)}
          <button type="button" class="c-chip" aria-pressed={filtro === f.chave}
            onclick={() => filtrar(f.chave)}>{f.rotulo}{#if f.quantos !== undefined}<span> {f.quantos}</span>{/if}</button>
        {/each}
      </div>
    {/if}
    {#if itens.length > 8}
      <input class="p-campo p-tabela-procura" type="search" bind:value={procura}
        placeholder="Procurar" aria-label="procurar na tabela" />
    {/if}
  </div>

  {#if !visiveis.length}
    <p class="p-vazio">{procura.trim() ? `Nada com “${procura}”.` : vazio}</p>
  {:else}
    <div class="p-tabela-rolo">
      <table>
        <thead>
          <tr>
            {#each colunas as c (c.chave)}
              <th data-tipo={c.tipo} aria-sort={ordem.chave === c.chave ? (ordem.desc ? "descending" : "ascending") : undefined}>
                <button type="button" onclick={() => ordenar(c.chave)} title={`ordenar por ${c.rotulo.toLowerCase()}`}>{c.rotulo}{seta(c)}</button>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each visiveis as it (it.chave)}
            {@const marca = marcadaDe(it)}
            <tr onclick={(e) => { if (!e.target.closest("a")) abrir(it.chave); }} data-marcada={marca || undefined}>
              {#each colunas as c (c.chave)}
                <td data-tipo={c.tipo} data-rotulo={c.rotulo}>
                  {#if c.tipo === "nome"}
                    <a href={hrefDe(it)}><b>{it.titulo}</b></a>{#if it.id}<span class="p-id">{it.id}</span>{/if}
                    {#if marca}<em class="p-tabela-marca" data-recusa={marca === "descartar" ? "" : undefined}>{marca === "descartar" ? "✕ descartar" : "✓ marcada"}</em>{/if}
                  {:else if c.tipo === "etapa"}
                    <span class="p-tabela-etapa">{it.etiqueta || it.etapa || ""}</span>
                  {:else if c.tipo === "campo"}
                    {@const v = it.campos?.[c.chave]}
                    <span data-vazio={semResposta(v) ? "" : undefined} title={v || "sem resposta"}>{valorCurto(v) || "—"}</span>
                  {:else if c.tipo === "documentos"}
                    {#if it.docs?.length}
                      {#each it.docs as d (d.caminho)}<span class="p-tabela-doc" title={d.caminho + (d.pdf ? " — com PDF" : " — sem PDF")}>{d.rotulo}</span>{/each}
                    {:else}<span data-vazio="">—</span>{/if}
                  {:else if c.tipo === "faltam"}
                    {#if !it.ficha}<span data-vazio="">—</span>
                    {:else if it.faltam.length}<span class="p-tabela-falta" title={"sem resposta: " + it.faltam.join(", ")}>{it.faltam.length}</span>
                    {:else}<span class="p-tabela-completo" title="nenhum campo em destaque sem resposta">✓</span>{/if}
                  {:else if c.tipo === "atualizada"}
                    <!-- quando mudou, e o que foi: a última linha do histórico -->
                    <span title={it.em ? new Date(it.em).toLocaleString("pt-BR") : ""}>{quando(it.em) || "—"}</span>
                    {#if it.ultimo}<small title={it.ultimo}>{passo(it.ultimo)}</small>{/if}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
