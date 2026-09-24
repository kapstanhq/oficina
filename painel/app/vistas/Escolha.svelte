<script>
  /**
   * ESCOLHA — a bifurcação do copiloto, desenhada.
   *
   * Esta vista não é uma ideia de interface: é o contrato §5 e §8 ganhando
   * forma. O §5 manda o copiloto "parar na bifurcação, entregar o que já
   * ficou pronto, perguntar UMA coisa e esperar". O §8 diz como a pergunta se
   * parece:
   *
   *   "Use a UI de perguntas do harness — não escreva as opções em prosa e
   *    peça para ele digitar o número. Cada opção traz O CUSTO ESCRITO: o que
   *    ela exige e quanto demora. Rótulo curto, até quatro palavras. A
   *    descrição declara o custo, não vende a opção."
   *
   * Cada regra dessas está aqui como mecanismo, não como recomendação.
   *
   * ── O TETO É QUATRO, E ELE VEM DO CONTRATO ────────────────────────────
   * "Escolha entre dois e quatro caminhos. Mais de quatro: escolha os três
   * melhores e diga que há outros." Acima de quatro a tela avisa em vez de
   * desenhar uma parede — o defeito de uma lista longa não é a altura, é a
   * pessoa parar de ler no terceiro item e escolher o primeiro.
   *
   * ── E O CUSTO NÃO É OPCIONAL ──────────────────────────────────────────
   * Opção sem custo escrito é opção que se escolhe no escuro. Quando o agente
   * não mandar um, a tela DIZ que falta — em vez de desenhar um botão
   * silencioso, que é o que faria a regra do §8 sumir sem alarme.
   */
  let { dados = {}, agir = () => {}, extra = $bindable({}) } = $props();

  const opcoes = $derived(dados.opcoes || []);
  const demais = $derived(opcoes.length > 4);
</script>

{#if dados.pergunta}
  <p class="c-chamada">{dados.pergunta}</p>
{/if}

{#if !opcoes.length}
  <p class="c-nota p-falta">
    O agente pediu uma escolha e não mandou opção nenhuma.
  </p>
{:else}
  {#if demais}
    <p class="c-nota p-falta">
      São {opcoes.length} caminhos, e o contrato pede no máximo quatro —
      mostro todos, mas vale reduzir na skill.
    </p>
  {/if}

  <!-- ── UM BOTÃO POR OPÇÃO, E ELE É A LINHA INTEIRA ──────────────────
       Alvo grande e rótulo à esquerda: a pessoa está lendo o custo, e o
       gesto de escolher não pode exigir mira. É o mesmo desenho do garfo da
       página do pack. -->
  <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--s2)">
    {#each opcoes as o, i (o.chave || i)}
      <li>
        <button type="button"
          class="c-caixa"
          style="display:block;width:100%;text-align:left;padding:var(--s3);cursor:pointer"
          onclick={() => agir("escolheu", { escolha: o.chave, rotulo: o.rotulo })}>
          <span style="font-size:var(--t-interface);font-weight:var(--peso-objeto)">{o.rotulo}</span>
          {#if o.custo}
            <span class="c-corpo" style="display:block;margin-top:4px">{o.custo}</span>
          {:else}
            <span class="c-nota p-falta" style="display:block;margin-top:4px">
              sem custo escrito — o contrato §8 pede um
            </span>
          {/if}
        </button>
      </li>
    {/each}
  </ul>
{/if}
