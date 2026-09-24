<script>
  /**
   * LAUDO — certo · errado · dúvida.
   *
   * A saída de uma régua. No pack é a `laudo-da-carteira`, que mede a
   * base contra o contrato; a forma vale para qualquer régua, e é a mesma
   * do `npm run laudo` do Estúdio, que também abre pelo que está errado.
   *
   * ── A ORDEM É ERRADO PRIMEIRO, E ISSO É DELIBERADO ────────────────────
   * Um laudo existe para ser agido, não para ser admirado. Abrir pelos ✓ faz
   * quem lê rolar uma tela de acertos antes de chegar ao que precisa
   * consertar — e num laudo de base grande o que precisa de conserto fica
   * abaixo da dobra. O Estúdio aprendeu isso: o `npm run prova` "abre pelo
   * que mais custa na nota".
   *
   * ── E A DÚVIDA NÃO É UM ERRO FRACO ────────────────────────────────────
   * É a terceira categoria porque a ação dela é outra: erro se conserta,
   * dúvida se APURA. Misturar as duas faz alguém tentar consertar o que só
   * precisava ser perguntado — e a régua perde a confiança de quem a lê.
   */
  let { dados = {}, agir = () => {}, extra = $bindable({}) } = $props();

  /* errado primeiro, dúvida no meio, certo por último — ver a nota acima */
  const filas = $derived([
    { chave: "errado", rotulo: "Errado", classe: "p-falta", itens: dados.errado || [] },
    { chave: "duvida", rotulo: "Dúvida", classe: "", itens: dados.duvida || [] },
    { chave: "certo", rotulo: "Certo", classe: "c-selo-verd", itens: dados.certo || [] },
  ]);
  const nada = $derived(!filas.some((f) => f.itens.length));
</script>

{#if nada}
  <p class="c-corpo">A régua não achou nada — nem certo, nem errado. Provavelmente
    ela não rodou.</p>
{/if}

{#each filas as f (f.chave)}
  {#if f.itens.length}
    <section class="c-secao" style="gap:var(--s1)">
      <span class="c-selo {f.classe}">{f.rotulo}
        <span style="color:var(--fio-forte)"> · {f.itens.length}</span></span>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--s1)">
        {#each f.itens as it, i (i)}
          <li class="c-corpo" style="display:grid;gap:2px">
            <span class:p-falta={f.chave === "errado"}>
              {typeof it === "string" ? it : it.texto}</span>
            <!-- `onde` é o arquivo, e `conserto` é o que fazer. Um laudo que
                 diz o que está errado e não diz onde obriga quem lê a procurar,
                 e procurar é o custo que a régua existia para poupar. -->
            {#if typeof it === "object"}
              {#if it.onde}<span class="p-de">{it.onde}</span>{/if}
              {#if it.conserto}<span class="c-nota">{it.conserto}</span>{/if}
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/if}
{/each}
