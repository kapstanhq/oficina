<script>
  /**
   * OS ITENS DE UMA SEÇÃO — as quatro formas que o interpretador reconhece.
   *
   * `campo`, `linha`, `tabela` e `colunas`, na ordem em que estão no
   * arquivo. A ordem é o ponto: `## Quanto` de um perfil tem dois campos e
   * uma frase, nessa ordem, e agrupar por tipo reescreveria o arquivo na
   * tela. Quem lê está conferindo o que está no disco.
   *
   * ── O QUE NÃO FOI RECONHECIDO CHEGA AQUI COMO `linha` ─────────────────
   * O interpretador é tolerante de propósito (ver `nucleo/base.mjs`): linha
   * torta vira frase. Então este componente não tem ramo de erro — tudo
   * desenha, e o pior caso é um parágrafo onde alguém queria uma lista.
   *
   * ── E A PROCEDÊNCIA APARECE EM TODA LINHA QUE TEM UMA ─────────────────
   * Mesma regra da `Ficha`: o `←` é o que separa esta base de um CRM que
   * inventa, e escondê-lo faria a regra do contrato existir sem ninguém ver.
   */
  import ComIds from "./ComIds.svelte";

  /* com `indice`, todo id citado vira link para o arquivo dele (D239) */
  /* `discreta` (D257): a origem sai da linha e vai para o `title` — a página
     do item a mostra inteira atrás de um clique, na ficha */
  let { itens = [], indice = null, origem = "visivel" } = $props();
  const escondida = (l) => (origem === "discreta" && l.de ? "← " + l.de : undefined);

  const naoSabe = (v) => String(v ?? "").trim() === "?" || String(v ?? "").trim() === "";

  /* uma corrida de `linha` seguidas vira UMA lista, e `campo` seguidos viram
     UMA grade. Sem isso, cada item nasceria na própria caixa e uma seção de
     quatro marcadores leria como quatro seções. */
  const blocos = $derived((() => {
    const saida = [];
    for (const item of itens) {
      const fim = saida[saida.length - 1];
      const tipo = item.tipo === "linha" && item.lista ? "lista"
        : item.tipo === "linha" ? "prosa"
        : item.tipo;
      if (fim && fim.tipo === tipo && tipo !== "tabela") fim.itens.push(item);
      else saida.push({ tipo, itens: [item] });
    }
    return saida;
  })());
</script>

{#each blocos as b, i (i)}
  {#if b.tipo === "campo"}
    <!-- a mesma grade da `Ficha`, e a mesma classe: um campo é um campo,
         venha ele do topo do arquivo ou de dentro de uma seção -->
    <dl class="c-caixa c-faixa p-ficha" style="margin:0">
      {#each b.itens as c, k (k)}
        <dt class="c-selo" style="align-self:baseline">{c.rotulo}</dt>
        <dd style="margin:0;overflow-wrap:anywhere">
          <span class:p-falta={naoSabe(c.valor)} style="font-size:var(--t-interface)"
            >{#if naoSabe(c.valor)}?{:else}<ComIds texto={c.valor} {indice} />{/if}</span>
          {#if c.de}<span class="p-de">← {c.de}</span>{/if}
        </dd>
      {/each}
    </dl>
  {:else if b.tipo === "lista"}
    <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--s1)">
      {#each b.itens as l, k (k)}
        <li class="c-corpo" style="display:grid;grid-template-columns:auto 1fr;gap:var(--s0) var(--s2)" title={escondida(l)}>
          <!-- a caixa é SÓ DE LEITURA, e por isso é um glifo e não um
               `<input type=checkbox>` desligado: caixa desligada convida o
               clique e não responde. Quem marca a caixa do arquivo é o
               agente — o painel propõe, ele dispõe. -->
          {#if l.caixa !== null && l.caixa !== undefined}
            <span class="c-etiqueta c-etiqueta-cinza" role="img"
              aria-label={l.caixa ? "feito" : "por fazer"}>{l.caixa ? "✓" : "☐"}</span>
          {:else}
            <span style="color:var(--fio-forte)">·</span>
          {/if}
          <span style="grid-column:2">
            <ComIds texto={l.texto} {indice} />
            {#if l.de && origem !== "discreta"}<span class="p-de">← {l.de}</span>{/if}
          </span>
        </li>
      {/each}
    </ul>
  {:else if b.tipo === "tabela"}
    <div class="c-caixa" style="overflow-x:auto">
      <table class="p-tabela">
        <thead><tr>{#each b.itens[0].cabecalho as c, k (k)}<th>{c}</th>{/each}</tr></thead>
        <tbody>
          {#each b.itens[0].linhas as linha, k (k)}
            <tr>{#each linha as celula, j (j)}<td><ComIds texto={celula} {indice} /></td>{/each}</tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else if b.tipo === "colunas"}
    <dl style="display:grid;grid-template-columns:auto 1fr;gap:var(--s1) var(--s3);margin:0">
      {#each b.itens as c, k (k)}
        <dt style="font-family:var(--mono);font-size:var(--t-comando)">{c.alvo}</dt>
        <dd class="c-nota" style="margin:0">{c.texto}</dd>
      {/each}
    </dl>
  {:else}
    {#each b.itens as l, k (k)}
      <p class="p-corpo-prosa" title={escondida(l)}>
        <ComIds texto={l.texto} {indice} />
        {#if l.de && origem !== "discreta"}<span class="p-de">← {l.de}</span>{/if}
      </p>
    {/each}
  {/if}
{/each}
