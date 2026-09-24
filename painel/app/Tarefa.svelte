<script>
  /**
   * A TELA DE TAREFA — o que o agente mandou desenhar, e o botão que responde.
   *
   * Ela era o corpo do `Painel.svelte` até a página inicial existir. O que
   * mudou foi o LUGAR: a tarefa agora mora dentro da casa, em `#/tarefa`, e
   * a casca ficou com o laço, a barra e a navegação. O que NÃO mudou é o que
   * este arquivo faz, e isso é deliberado —
   *
   *   **a volta é a mesma, byte a byte.** Vista única devolve a intenção
   *   PLANA (`{ acao, texto }`), como sempre devolveu; só a tela de `blocos`
   *   devolve `{ acao, blocos: { <id>: {...} } }`. Toda skill escrita antes
   *   da casa lê esse formato, e o painel de tarefa é o contrato — a casa é
   *   conveniência em volta dele.
   *
   * ── UMA TELA É UMA LISTA DE BLOCOS, E QUASE SEMPRE DE UM SÓ ───────────
   * O documento chega de dois jeitos — `{ vista, dados }` ou `{ blocos }` —,
   * e o mesmo laço desenha os dois: a tela de vista única é uma de um bloco,
   * sem id e sem rótulo. É a mesma normalização da `Lista` com os grupos, e
   * evita o que ela evita lá: dois caminhos de renderização, e o segundo
   * esquecendo o conserto feito no primeiro.
   *
   * ── O COMPONENTE INTEIRO É REMONTADO A CADA VERSÃO ────────────────────
   * Quem monta o `{#key doc.versao}` é a casca. Antes o `#key` ficava em
   * volta das vistas e o `extras` era zerado à mão ao lado; com o corte, as
   * duas coisas viraram uma só — documento novo é um `Tarefa` novo, e não
   * há estado de tela velha para carregar adiante. O defeito que isso
   * impedia continua impedido: o `texto` aberto para correção seguia aberto
   * na mensagem seguinte, com o rascunho da anterior dentro.
   */
  import Lista from "./vistas/Lista.svelte";
  import Ficha from "./vistas/Ficha.svelte";
  import Texto from "./vistas/Texto.svelte";
  import Escolha from "./vistas/Escolha.svelte";
  import Feedback from "./vistas/Feedback.svelte";
  import Laudo from "./vistas/Laudo.svelte";
  import Formulario from "./vistas/Formulario.svelte";

  /* ── O MAPA DE VISTAS É FECHADO ───────────────────────────────────────
     Vista que o servidor mande e que não esteja aqui não quebra a tela: cai
     no aviso do fim, que DIZ qual chegou. Uma tela em branco seria a mesma
     informação com zero pistas, e é o modo de falha que obriga alguém a
     abrir o console para descobrir o nome de um campo. */
  const VISTAS = { lista: Lista, ficha: Ficha, texto: Texto, escolha: Escolha,
    feedback: Feedback, laudo: Laudo, formulario: Formulario };

  let { doc, mandado = false, guardada = false, recusa = "", mandar = async () => {},
    esperando = true } = $props();

  /* o que cada bloco coletou — o texto editado, os campos, as decisões. Cada
     vista é dona do formato do seu; esta tela só o carrega até o botão.

     ── ELE NASCE PREENCHIDO, E ISSO NÃO É ZELO ────────────────────────
     `bind:extra={extras[i]}` com a posição ainda `undefined` é ERRO DE
     EXECUÇÃO no Svelte 5 — as vistas declaram `extra = $bindable({})`, e
     ligar `undefined` a uma prop com valor padrão é recusado. Por isso a
     lista tem SEMPRE três posições, que é o teto de blocos do servidor. */
  let extras = $state([{}, {}, {}]);

  const emBlocos = $derived(Array.isArray(doc?.blocos) && doc.blocos.length > 0);
  const blocos = $derived(!doc ? []
    : emBlocos ? doc.blocos
    : [{ id: null, vista: doc.vista, titulo: "", dados: doc.dados }]);
  const temAcoes = $derived(!!doc?.acoes?.length);
  /* a procedência sai da primeira leitura e volta por um interruptor, como na
     trajetória (D258): uma pilha de doze linhas lia com doze `← trajetoria.md`
     embaixo (D265) */
  let comOrigem = $state(false);
  const temOrigem = $derived(blocos.some((b) => [...(b.dados?.campos || []),
    ...(b.dados?.secoes || []).flatMap((s) => s?.linhas || [])].some((x) => x && typeof x === "object" && x.de)));
  /* a tela responde por gesto de DENTRO de um bloco (a opção de uma
     `escolha`, o botão de um item) mesmo sem rodapé — e o recado vai junto */
  const respondeDeDentro = $derived(blocos.some((b) => b.vista === "escolha" ||
    [...(b.dados?.itens || []), ...(b.dados?.grupos || []).flatMap((g) => g?.itens || [])]
      .some((it) => it?.acoes?.length)));

  /* as chaves com `_` são recado da vista para a casca — o que falta num
     formulário, quantos itens foram marcados — e não saem daqui. */
  const limpo = (e) => Object.fromEntries(
    Object.entries(e || {}).filter(([k]) => !k.startsWith("_")));

  /* ── O QUE SEGURA O BOTÃO FORTE ───────────────────────────────────────
     Campo obrigatório vazio segura o botão de tom `forte`, e SÓ ele: "vejo
     depois" e "não mande" são saídas que não dependem do formulário estar
     completo, e travá-las prenderia a pessoa numa tela que ela quer largar. */
  const faltam = $derived(extras.flatMap((e) => e?._faltam || []));
  const lote = $derived(extras.find((e) => e && "_julgaveis" in e) || null);

  let apertado = $state("");
  async function agir(acao, dele = {}, bloco = null) {
    if (!doc) return;
    apertado = acao;
    /* a volta de `blocos` traz só o bloco que COLETOU alguma coisa: `ficha`,
       `laudo` e `feedback` não coletam, e uma chave vazia por bloco faria o
       agente procurar resposta onde nunca houve pergunta.

       O gesto que nasce DENTRO de um bloco — o botão de um item, a opção de
       uma `escolha` — continua plano (`item`, `escolha`), e leva `bloco` com
       o id de onde veio: duas listas na mesma tela podem ter o mesmo botão. */
    const coletado = emBlocos
      ? { blocos: Object.fromEntries(doc.blocos
          .map((b, i) => [b.id, limpo(extras[i])])
          .filter(([, e]) => Object.keys(e).length)) }
      : limpo(extras[0]);
    await mandar({ versao: doc.versao, acao, ...coletado, ...dele,
      ...(emBlocos && bloco ? { bloco } : {}),
      ...(comentario.trim() ? { comentario: comentario.trim() } : {}) });
  }
  /* o recado geral (D259): vai em QUALQUER gesto, e só quando há texto */
  let comentario = $state("");
  /* o botão que equivale a um gesto sobre o item (D262): sem ninguém
     esperando, ele vira decisão da fila — a tela diz, antes do clique */
  const comGesto = $derived((doc?.acoes || []).filter((a) => a.gesto && a.item).map((a) => `“${a.rotulo}”`));
  const principal = $derived((doc?.acoes || []).some((a) => a.tom === "forte") ? -1
    : (doc?.acoes || []).findIndex((a) => !a.tom));
</script>

<header class="c-secao" style="gap:var(--s1)">
  <h1 class="c-h2">{doc.titulo}</h1>
  {#if doc.linha}<p class="c-corpo">{doc.linha}</p>{/if}
  {#if temOrigem}
    <label class="p-arq-origem"><input type="checkbox" bind:checked={comOrigem} /> Mostrar de onde veio cada linha</label>
  {/if}
</header>

{#each blocos as b, i (b.id ?? i)}
  {@const Vista = VISTAS[b.vista]}
  <section class="c-secao" style="gap:var(--s2)">
    {#if b.titulo}<h2 class="c-h3">{b.titulo}</h2>{/if}
    {#if Vista}
      <Vista dados={b.dados || {}} agir={(acao, dele) => agir(acao, dele, b.id)}
        bind:extra={extras[i]} origem={comOrigem} />
    {:else}
      <p class="c-nota p-falta">
        O agente pediu a vista <code>{b.vista}</code>, que este painel não
        desenha. As que existem: {Object.keys(VISTAS).join(", ")}.
      </p>
    {/if}
  </section>
{/each}

<!-- ── O RODAPÉ ────────────────────────────────────────────────────────
     Os botões vêm do agente, com o rótulo que ele escreveu — o contrato §6
     manda que o rótulo diga o que a PESSOA vai fazer ("Eu mesmo mando"),
     nunca o nome interno da peça ("só o bloco"). A tela não inventa botão e
     não reordena: a ordem é a que a skill escolheu, e ela é parte do que o
     contrato §7.1 fixa. -->
{#snippet recado()}
  <!-- o recado geral (D259): corrigir o assistente sem escrever dentro do
       valor que vai sair em nome da pessoa -->
  <label class="p-recado">
    <span class="c-selo">Recado para o assistente <span class="c-nota">· opcional</span></span>
    <textarea class="p-campo" rows="2" disabled={mandado} bind:value={comentario}
      placeholder="Correções, contexto, o que mudar antes de seguir. Vai junto com o que você apertar."></textarea>
  </label>
{/snippet}

{#if !temAcoes && respondeDeDentro}
  <footer class="c-secao" style="gap:var(--s2)">{@render recado()}</footer>
{/if}

{#if temAcoes}
  <footer class="c-secao" style="gap:var(--s2)">
    {#if lote}
      <p class="c-nota">{lote._marcados} de {lote._julgaveis}
        {lote._marcados === 1 ? "marcado" : "marcados"} — o que ficar sem
        marca não foi julgado.</p>
    {/if}
    <!-- ── O AGENTE PAROU DE ESPERAR, E A TELA DIZ (D238) ─────────────
         Antes ela dizia "está esperando você" por haver botões. O que a
         pessoa responder aqui fica guardado e chega por todos os canais. -->
    {#if !esperando && !mandado}
      <p class="c-nota">O assistente não está mais esperando esta tela — o
        tempo dele acabou. Pode responder mesmo assim: a resposta fica guardada,
        e ele pega quando voltar ao painel.{#if comGesto.length}{" "}{comGesto.join(" e ")}
          {comGesto.length === 1 ? " vai" : " vão"} direto para a fila de decisões, e “Gravar agora” registra.{/if}</p>
    {/if}
    {@render recado()}
    <div style="display:flex;flex-wrap:wrap;gap:var(--s2)">
      <!-- sempre há UM botão cheio: o que a skill marcou `forte`, ou, se ela
           não marcou nenhum, o primeiro que não é recusa. Uma fileira de
           botões iguais faz quem não conhece a tela ler todos para achar o
           caminho; o peso é só visual, e a ordem continua a da skill. -->
      {#each doc.acoes as a, i (a.chave)}
        <button type="button"
          class="c-acao {a.tom === 'forte' || i === principal ? 'c-acao-cheia' : ''} {a.tom === 'recusa' ? 'c-acao-ambar' : ''}"
          disabled={mandado || (a.tom === "forte" && faltam.length > 0)}
          onclick={() => agir(a.chave)}>{a.rotulo}</button>
      {/each}
    </div>
    {#if faltam.length && !mandado}
      <p class="c-nota p-falta">Falta preencher: {faltam.join(" · ")}.</p>
    {/if}
    <!-- ── RECUSA NÃO SE ENGOLE ──────────────────────────────────────
         O servidor recusa a intenção que responde a uma tela que já mudou.
         Silenciar isso deixaria a pessoa achando que mandou — e ela não
         mandou. A frase aparece onde ela clicou. -->
    {#if recusa}<p class="c-nota p-falta">{recusa}</p>{/if}
    {#if mandado && guardada && (doc?.acoes || []).some((a) => a.chave === apertado && a.gesto && a.item)}
      <p class="c-nota">Foi para a fila de decisões. “Gravar agora”, na barra de cima, registra — sem precisar
        chamar o assistente para mais nada.</p>
    {:else if mandado && guardada}
      <p class="c-nota">Guardado. O assistente pega quando voltar ao painel — se
        quiser agora, diga a ele: “pega o que eu respondi no painel”.</p>
    {:else if mandado}
      <p class="c-nota">Pode voltar para a conversa com o Claude — ou esperar
        aqui, que a próxima tela chega sozinha.</p>
    {/if}
  </footer>
{/if}
