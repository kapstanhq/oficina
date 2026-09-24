<script>
  /**
   * FICHA — UM item por inteiro.
   *
   * O arquivo de uma conta ou de um contato tem duas metades, e elas se leem
   * de jeitos diferentes: os CAMPOS no topo (`cargo:`, `e-mail:`, `etapa:`),
   * cada um com a procedência ao lado, e as SEÇÕES de texto embaixo
   * (`## O que a conta faz`, `## O que já mandei`).
   *
   * ── A PROCEDÊNCIA É MOSTRADA, NÃO ESCONDIDA ───────────────────────────
   * Cada fato da base carrega de onde veio — `← LinkedIn, 2026-08-12` —,
   * e é essa seta que separa esta base de um CRM que inventa. A primeira
   * versão desta tela a punha num `title=`, e a regra 2 do contrato passaria
   * a existir sem ninguém nunca ver. Ela fica na tela, em mono e apagada:
   * secundária na tinta, obrigatória na presença.
   *
   * ── E O `?` É CONTEÚDO ────────────────────────────────────────────────
   * `faturamento: ?` não é campo vazio: é a skill declarando que não sabe, em
   * vez de chutar. Ele ganha tinta âmbar porque é o que a próxima skill vai
   * atacar — é a mesma informação que vira `## Falta saber` no fecho.
   */
  import ComIds from "../comum/ComIds.svelte";

  /* `indice` só existe na casa: com ele, o id citado num valor vira link
     (D239). A ficha que o agente manda numa tarefa vem sem, e é só texto. */
  /* `origem` falso guarda a procedência no `title` (D258, D265): a tela de
     tarefa a esconde atrás do interruptor; quem não passa nada a vê */
  let { dados = {}, agir = () => {}, extra = $bindable({}), indice = null, origem = true } = $props();

  const campos = $derived(dados.campos || []);
  const secoes = $derived(dados.secoes || []);
  const ehEndereco = (v) => /^https?:\/\/\S+$/i.test(String(v ?? "").trim());
  const naoSabe = (v) => String(v ?? "").trim() === "?" || String(v ?? "").trim() === "";
</script>

{#if campos.length}
  <div class="c-caixa">
    <!-- `p-ficha` existe por UMA regra: abaixo de 560 px o rótulo e o valor
         empilham. Medido a 375: com as duas colunas, "o que eu faço" comia
         160 px e o valor lia em cinco linhas de quatro palavras. -->
    <dl class="c-faixa p-ficha" style="margin:0">
      {#each campos as c, i (c.rotulo || i)}
        <dt class="c-selo" style="align-self:baseline">{c.rotulo}</dt>
        <!-- `anywhere` é o par do `minmax(0,…)` da `.p-ficha`: um deixa a
             faixa encolher, o outro parte a URL que não tem espaço. Sem os
             dois o valor sai cortado pelo `overflow-clip` da caixa. -->
        <dd style="margin:0;overflow-wrap:anywhere" title={!origem && c.de ? "← " + c.de : undefined}>
          <!-- o valor que É um endereço abre em aba nova. Só `http(s)` e só
               quando o valor inteiro é o endereço: frase com link dentro
               continua texto, e nada aqui interpreta marcação. -->
          {#if ehEndereco(c.valor)}
            <a href={String(c.valor).trim()} target="_blank" rel="noopener noreferrer"
              style="font-size:var(--t-interface);text-decoration:underline;text-underline-offset:3px"
              >{c.valor}</a>
          {:else}
            <span class:p-falta={naoSabe(c.valor)}
              style="font-size:var(--t-interface)">{#if naoSabe(c.valor)}?{:else}<ComIds texto={c.valor} {indice} />{/if}</span>
          {/if}
          <!-- o `de` é a procedência; `nota` é o que fazer quando ela falta -->
          {#if c.de}{#if origem}<span class="p-de">← {c.de}</span>{/if}
          {:else if naoSabe(c.valor) && c.nota}<span class="p-de">← {c.nota}</span>{/if}
        </dd>
      {/each}
    </dl>
  </div>
{/if}

{#each secoes as s, i (s.titulo || i)}
  <section class="c-secao" style="gap:var(--s1)">
    <span class="c-selo">{s.titulo}</span>
    {#if !(s.linhas || []).length}
      <p class="c-nota">nada aqui.</p>
    {:else}
      <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--s1)">
        {#each s.linhas as l, k (k)}
          <li class="c-corpo" style="display:grid;gap:2px"
            title={!origem && typeof l === "object" && l.de ? "← " + l.de : undefined}>
            <!-- a linha pode vir como texto puro ou como `{ texto, de }`. Os
                 dois formatos existem porque nem todo fato tem procedência —
                 uma linha de `## Combinado` é do próprio profissional. -->
            <span>{typeof l === "string" ? l : l.texto}</span>
            {#if origem && typeof l === "object" && l.de}<span class="p-de">← {l.de}</span>{/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
{/each}
