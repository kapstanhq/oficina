<script>
  /**
   * TEXTO — o que vai ser lido, aprovado ou corrigido.
   *
   * No pack de prospecção esta é a tela do clímax: a mensagem antes de sair.
   * O contrato §7.1 é literal sobre o que ela tem de mostrar — "o texto
   * INTEIRO, do jeito que vai sair. Nunca 'a resposta que combinamos'" — e é
   * por isso que aqui não há resumo, reticências nem altura máxima.
   *
   * ── ELE NASCE EM CERCA, NUNCA EM MOLDURA ──────────────────────────────
   * O contrato §10: "O bloco vai em cerca de código, e NUNCA dentro de
   * moldura desenhada. Uma caixa de `┌─┐` parece organizada na tela e é
   * armadilha: a pessoa seleciona, copia e leva as bordas junto para dentro
   * do WhatsApp." A `.p-bloco` é fundo e filete — o que se seleciona é só o
   * texto.
   *
   * ── O ESCAPE NÃO É ESCRITO AQUI ───────────────────────────────────────
   * `comoBloco()` vem de `site/svelte/casca/marcacao.js`, o mesmo arquivo que
   * a Oficina usa. Ele escapa ANTES de converter — é a única saída não
   * escapada da casa, e ter um dono só é o que a mantém auditável. Escrever
   * um segundo escapador aqui seria a segunda coisa a divergir, e a divergência
   * de um escapador tem nome.
   */
  import { comoBloco } from "../../casca/marcacao.js";

  let { dados = {}, agir = () => {}, extra = $bindable({}) } = $props();

  const original = $derived(String(dados.markdown ?? dados.texto ?? ""));
  let editando = $state(false);
  let rascunho = $state("");

  /* ── O QUE SOBE PARA A CASCA ──────────────────────────────────────────
     O `extra` é lido pelo botão do rodapé no momento do clique. Ele leva o
     texto SEMPRE — mesmo sem edição —, porque o contrato §7.1 exige que o que
     sai seja exatamente o que foi mostrado: mandar só o que mudou obrigaria o
     agente a lembrar do original, e "lembrar" é onde a prévia e o envio
     divergem.

     ── E ELE ATRIBUI SEM LER O QUE JÁ ESTAVA LÁ ───────────────────────
     A primeira versão era `extra = { ...extra, texto }`, e isso é um LAÇO
     INFINITO no Svelte 5: o efeito lê `extra` para espalhá-lo e escreve
     `extra` no fim, então ele é a própria dependência e reexecuta para
     sempre. O sintoma não é um erro — é a aba esquentando.

     Escrever o objeto inteiro resolve, e é honesto: esta vista é a única
     que coleta alguma coisa, então não há o que preservar de outra. */
  $effect(() => {
    extra = { texto: editando ? rascunho : original };
  });

  /* ── O DOCUMENTO SE LÊ COMO DOCUMENTO (D265) ──────────────────────────
     Texto com título `#` é um documento — o currículo, a carta —, e em mono
     ele lia como código: `## Experiência`, `**Kapstan**`, noventa linhas numa
     cerca. A mensagem (sem título) continua na cerca, como vai sair. O que se
     copia e o que volta é o markdown inteiro nos dois; "texto puro" é a cerca.
     Sem `{@html}`: a árvore sai de linhas, e o Svelte escapa cada pedaço. */
  const ehDocumento = $derived(/^#{1,3}\s/m.test(original));
  let cru = $state(false);
  const pedacos = (t) => String(t).split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
    .map((p) => (p.length > 4 && p.startsWith("**") && p.endsWith("**") ? { forte: true, t: p.slice(2, -2) } : { forte: false, t: p }));
  const doc = $derived.by(() => {
    const out = [];
    let lista = null, par = null;
    for (const bruta of original.split(/\r?\n/)) {
      const l = bruta.trimEnd();
      let m;
      if (!l.trim()) { lista = null; par = null; continue; }
      if ((m = l.match(/^(#{1,3})\s+(.*)$/))) { lista = null; par = null; out.push({ tipo: "h" + m[1].length, t: m[2] }); continue; }
      if ((m = l.match(/^\s*[-*]\s+(.*)$/))) {
        par = null;
        if (!lista) { lista = { tipo: "ul", itens: [] }; out.push(lista); }
        lista.itens.push(m[1]);
        continue;
      }
      if (lista && /^\s{2,}\S/.test(bruta)) { lista.itens[lista.itens.length - 1] += " " + l.trim(); continue; }
      lista = null;
      if (!par) { par = { tipo: "p", linhas: [] }; out.push(par); }
      par.linhas.push(l.trim());
    }
    return out;
  });

  function abrirEdicao() {
    rascunho = original;
    editando = true;
  }

  /* ── COPIAR É O CAMINHO QUE NUNCA FALTA ───────────────────────────────
     Sem conector de WhatsApp — que é o caso em toda ferramenta de chat na
     web — a saída do pack é "eu mesmo mando", e ela depende de a pessoa
     conseguir levar o texto daqui. O botão do navegador é mais confiável que
     pedir seleção manual num bloco de doze linhas. */
  let copiado = $state(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(editando ? rascunho : original);
      copiado = true;
      setTimeout(() => (copiado = false), 1800);
    } catch {
      /* `clipboard` exige contexto seguro, e `http://127.0.0.1` conta como
         um — mas um navegador antigo ou uma permissão negada caem aqui. A
         saída é selecionar o bloco, que é o que o aviso manda fazer. */
      copiado = false;
      alert("Não consegui copiar por aqui. Selecione o texto do bloco e copie.");
    }
  }
</script>

{#if editando}
  <textarea class="p-bloco" rows="14" bind:value={rascunho}
    style="width:100%;resize:vertical" aria-label="o texto, para corrigir"></textarea>
  <p class="c-nota">Corrija o que quiser. O que estiver aqui é o que vai.</p>
{:else if ehDocumento && !cru}
  {#snippet linha(t)}{#each pedacos(t) as p, k (k)}{#if p.forte}<b>{p.t}</b>{:else}{p.t}{/if}{/each}{/snippet}
  <article class="p-doc">
    {#each doc as b, i (i)}
      {#if b.tipo === "h1"}<h1>{@render linha(b.t)}</h1>
      {:else if b.tipo === "h2"}<h2>{@render linha(b.t)}</h2>
      {:else if b.tipo === "h3"}<h3>{@render linha(b.t)}</h3>
      {:else if b.tipo === "ul"}<ul>{#each b.itens as it, k (k)}<li>{@render linha(it)}</li>{/each}</ul>
      {:else}<p>{#each b.linhas as l, k (k)}{#if k}<br />{/if}{@render linha(l)}{/each}</p>{/if}
    {/each}
  </article>
{:else}
  <!-- `{@html}` com o texto já escapado por `comoBloco` — ver a nota acima.
       O que ele acrescenta é tinta nos cabeçalhos `##`, e mais nada. -->
  <pre class="p-bloco">{@html comoBloco(original)}</pre>
{/if}

<div style="display:flex;flex-wrap:wrap;gap:var(--s2)">
  <button type="button" class="c-acao" onclick={copiar}>
    {copiado ? "Copiado" : "Copiar o texto"}</button>
  {#if dados.editavel !== false && !editando}
    <button type="button" class="c-acao" onclick={abrirEdicao}>Corrigir aqui</button>
  {/if}
  {#if ehDocumento && !editando}
    <button type="button" class="c-chip" style="align-self:center" onclick={() => { cru = !cru; }}
    >{cru ? "Ver como documento" : "Ver como texto puro"}</button>
  {/if}
</div>
