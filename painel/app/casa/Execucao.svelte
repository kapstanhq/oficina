<script>
  /**
   * A EXECUÇÃO — o assistente chamado pelo painel (D232): o pedido de
   * confirmação, o "está trabalhando", e o que ele disse ao terminar.
   *
   * ── O SEGUNDO CLIQUE É O DO CUSTO ─────────────────────────────────────
   * Chamar o assistente gasta do plano da pessoa, e o painel é o único lugar
   * em que ela faz isso sem digitar nada. O aviso vem do servidor, antes, com
   * o modelo e a ordem de grandeza do tempo — é a mesma cerimônia de ligar um
   * conector pago, e pela mesma razão.
   *
   * ── E O RESULTADO DIZ QUANTO CUSTOU ───────────────────────────────────
   * Quando o `claude` informa o custo da execução, ele aparece. Previsão de
   * gasto sem o número medido depois é metade da conversa.
   *
   * O texto final do assistente vai INTEIRO, em texto puro: nada aqui
   * interpreta marcação vinda de fora.
   *
   * ── E, ENQUANTO RODA, O QUE ELE ESTÁ FAZENDO (D234) ───────────────────
   * Sete minutos de "trabalhando" não distinguem trabalho de travamento. O
   * servidor traduz cada ferramenta usada num verbo — `nucleo/lancar.mjs`,
   * `passoDe` — e a tela mostra o último, com os anteriores apagados embaixo.
   *
   * ── E A FILA (D271) ───────────────────────────────────────────────────
   * O pedido feito com um rodando espera a vez, já confirmado. Falha ou
   * Parar pausa a fila: o que espera fica, e só segue com "Continuar".
   */
  import { nomeDoArquivo, paraFunil, TODAS } from "../rota.js";

  let { execucao = null, confirmando = null, confirmar = () => {},
    desistir = () => {}, parar = () => {}, mexer = () => {}, recusa = "",
    /* o apelido de um id — "Triar as vagas · V-035" diz de QUAL vaga, e leva a ela */
    nomeDoItem = () => "" } = $props();

  const frase = (p) => {
    const verbo = String(p?.verbo || "trabalhando");
    return verbo[0].toUpperCase() + verbo.slice(1) + (p?.alvo ? ": " + nomeDoArquivo(p.alvo) : "");
  };
  const passos = $derived([...(execucao?.rodando?.passos || [])].reverse());

  let agora = $state(Date.now());
  $effect(() => {
    if (!execucao?.rodando) return;
    const r = setInterval(() => { agora = Date.now(); }, 5000);
    return () => clearInterval(r);
  });
  const ha = (desde) => {
    const min = Math.max(0, Math.round((agora - new Date(desde).getTime()) / 60000));
    return min < 1 ? "agora mesmo" : min === 1 ? "há 1 minuto" : `há ${min} minutos`;
  };
  const dinheiro = (v) => v < 0.01 ? "menos de US$ 0,01" : "US$ " + v.toFixed(2).replace(".", ",");

  /* o resultado some quando a pessoa o dispensa — e volta só com uma execução nova */
  let dispensada = $state("");
  const ultima = $derived(execucao?.ultima && execucao.ultima.ate !== dispensada ? execucao.ultima : null);
  const fila = $derived(execucao?.fila || []);
  /* o que a fila já fez só se lista quando houve fila — um pedido só é a `ultima` */
  const feitas = $derived((execucao?.feitas || []).length > 1 || (fila.length && execucao?.feitas?.length)
    ? execucao.feitas : []);
</script>

{#if confirmando}
  <div class="p-confirma" role="dialog" aria-modal="true" aria-label="chamar o assistente">
    <div class="c-caixa c-caixa-ambar p-confirma-caixa">
      <p class="c-chamada" style="margin:0">Chamar o assistente: {confirmando.oque}</p>
      <p class="c-corpo">{confirmando.aviso}</p>
      <div class="p-acoes">
        <button type="button" class="c-acao c-acao-cheia" onclick={confirmar}>{confirmando.fila ? "Pôr na fila" : "Chamar agora"}</button>
        <button type="button" class="c-acao" onclick={desistir}>Agora não</button>
      </div>
    </div>
  </div>
{/if}

{#if recusa}<p class="c-nota p-falta">{recusa}</p>{/if}

{#if execucao?.rodando}
  <div class="p-execucao" data-tom="vivo" role="status">
    <span class="p-pulso" data-tom="vivo" aria-hidden="true"></span>
    <div>
      <b>O assistente está trabalhando: {@render comItem(execucao.rodando.nome)}</b>
      <span>Começou {ha(execucao.rodando.desde)}. Pode continuar olhando — a tela se atualiza quando ele terminar.</span>
      {#if passos.length}
        <ol class="p-execucao-passos" aria-label="o que ele está fazendo">
          {#each passos.slice(0, 4) as p, i (p.em + i)}
            <li data-agora={i === 0 ? "" : undefined}>{i === 0 ? "Agora — " : ""}{frase(p)}</li>
          {/each}
        </ol>
      {/if}
    </div>
    <button type="button" class="c-acao" onclick={parar}>Parar</button>
  </div>
{:else if ultima}
  <div class="p-execucao" data-tom={ultima.ok ? "feito" : "falha"}>
    <div>
      <b>{ultima.ok ? "O assistente terminou" : "O assistente não terminou"}: {@render comItem(ultima.nome)}</b>
      <span>
        {#if !ultima.ok && ultima.motivo}{ultima.motivo}. {/if}
        {#if ultima.custo}Custou {dinheiro(ultima.custo)}.{/if}
      </span>
      {#if ultima.resumo}
        <details>
          <summary>ver o que ele disse</summary>
          <pre class="p-execucao-texto">{ultima.resumo}</pre>
        </details>
      {/if}
    </div>
    <button type="button" class="c-acao" onclick={() => { dispensada = ultima.ate; }}>Fechar</button>
  </div>
{/if}

{#if fila.length || feitas.length}
  <div class="p-execucao p-execucao-fila" data-tom={execucao?.pausada ? "falha" : undefined}>
    <div>
      {#if execucao?.pausada && fila.length}
        <b>A fila parou: {execucao.pausada}</b>
        <span>{fila.length === 1 ? "1 pedido espera" : `${fila.length} pedidos esperam`}. Continue quando quiser, ou tire o que não vale mais.</span>
      {:else if fila.length}
        <b>Na fila: {fila.length === 1 ? "1 pedido" : `${fila.length} pedidos`}</b>
        <span>Começam sozinhos, um depois do outro. Cada um já foi confirmado.</span>
      {:else}
        <b>A fila terminou</b>
      {/if}
      {#if fila.length}
        <ol class="p-execucao-lista">
          {#each fila as p (p.n)}
            <li>{@render comItem(p.nome)} <button type="button" onclick={() => mexer({ acao: "tirar", n: p.n })}>tirar</button></li>
          {/each}
        </ol>
      {/if}
      {#if feitas.length}
        <ol class="p-execucao-lista" aria-label="o que a fila já fez">
          {#each feitas as f, i (i)}
            <li data-feita={f.ok ? "ok" : "falha"}>{f.ok ? "✓" : "✗"} {@render comItem(f.nome)}{f.custo ? ` · ${dinheiro(f.custo)}` : ""}{!f.ok && f.motivo ? ` — ${f.motivo}` : ""}</li>
          {/each}
        </ol>
      {/if}
    </div>
    {#if execucao?.pausada && fila.length}
      <div class="p-acoes">
        <button type="button" class="c-acao c-acao-cheia" onclick={() => mexer({ acao: "continuar" })}>Continuar</button>
        <button type="button" class="c-acao" onclick={() => mexer({ acao: "esvaziar" })}>Esvaziar</button>
      </div>
    {:else if fila.length}
      <button type="button" class="c-acao" onclick={() => mexer({ acao: "esvaziar" })}>Esvaziar</button>
    {/if}
  </div>
{/if}

{#snippet comItem(nome)}
  {@const m = String(nome || "").match(/^(.*?)\s*·\s*(\p{Lu}{1,4}-\d{1,6})\s*$/u)}
  {#if m}{m[1]} · <a class="p-execucao-item" href={paraFunil(TODAS, m[2])}><span>{m[2]}</span>{#if nomeDoItem(m[2])}{" " + nomeDoItem(m[2])}{/if}</a>{:else}{nome}{/if}
{/snippet}
