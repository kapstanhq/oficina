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
   * ── E, ENQUANTO RODA, O QUE ELE ESTÁ FAZENDO (D234, D279) ─────────────
   * Sete minutos de "trabalhando" não distinguem trabalho de travamento. O
   * servidor traduz cada ferramenta num passo com tipo e detalhe
   * (`nucleo/lancar.mjs`, `passoDe`), com começo e fim; daqui sai o ESTADO
   * dele — lendo, no navegador, pensando, esperando você, sem sinal —, que o
   * mascote interpreta e a frase diz. O que está acontecendo AGORA vem grande,
   * o caminho até aqui vem embaixo, repetições juntas, e a lista inteira atrás
   * de um "ver". A leitura de tela ouve só a frase do agora: o relógio que
   * anda de segundo em segundo fica fora dela.
   *
   * ── E A FILA (D271) ───────────────────────────────────────────────────
   * O pedido feito com um rodando espera a vez, já confirmado. Falha ou
   * Parar pausa a fila: o que espera fica, e só segue com "Continuar".
   */
  import Mascote from "../Mascote.svelte";
  import { nomeDoArquivo, nomeDeGente, paraArquivo, paraFunil, paraTarefa, TODAS } from "../rota.js";

  let { execucao = null, confirmando = null, confirmar = () => {},
    desistir = () => {}, parar = () => {}, mexer = () => {}, recusa = "",
    /* o apelido de um id — "Triar as vagas · V-035" diz de QUAL vaga, e leva a ela */
    nomeDoItem = () => "", pastas = {}, continuar = () => {} } = $props();

  /* sem linha do `claude` por mais que isto, e sem ele esperar ninguém: a
     tela deixa de dizer "trabalhando" e diz que está sem sinal */
  const SEM_SINAL_MS = 90_000;
  const AVISO_DO_TETO_MS = 5 * 60_000;

  let agora = $state(Date.now());
  $effect(() => {
    if (!execucao?.rodando) return;
    const r = setInterval(() => { agora = Date.now(); }, 1000);
    return () => clearInterval(r);
  });
  /* o `trabalhado` vem do servidor a cada volta; entre uma e outra, anda aqui */
  let recebido = $state(Date.now());
  $effect(() => { if (execucao?.rodando) recebido = Date.now(); });

  const rodando = $derived(execucao?.rodando || null);
  const passos = $derived(rodando?.passos || []);
  const atual = $derived(passos.at(-1) || null);
  const ms = (iso) => (iso ? Date.parse(iso) : NaN);
  const semSinal = $derived(rodando?.sinal ? agora - ms(rodando.sinal) : 0);

  const estado = $derived.by(() => {
    if (!rodando) return "";
    if (rodando.esperando) return "esperando";
    if (semSinal > SEM_SINAL_MS) return "sem-sinal";
    if (!atual) return "comecando";
    if (atual.fim) return atual.erro ? "tropecou" : "pensando";
    return atual.tipo || "outro";
  });
  const ANIMACAO = { comecando: "acordando", esperando: "esperando", "sem-sinal": "sem-sinal", pensando: "pensando",
    tropecou: "confuso", ler: "lendo", instrucoes: "lendo", procurar: "procurando", gravar: "escrevendo",
    mensagem: "escrevendo", documento: "escrevendo", navegar: "navegando", internet: "navegando", organizar: "pensando" };
  const SELO = { comecando: "começando", esperando: "esperando você", "sem-sinal": "sem sinal", pensando: "pensando",
    tropecou: "um passo falhou", ler: "lendo", instrucoes: "lendo as instruções", procurar: "procurando", gravar: "gravando",
    mensagem: "escrevendo", documento: "fazendo o documento", navegar: "no navegador", internet: "na internet",
    mostrar: "no painel", organizar: "organizando", conector: "consultando", comando: "trabalhando", ajudante: "com um ajudante" };

  /* ── OS NOMES QUE SE LEEM ─────────────────────────────────────────── */
  const ID = /^(\p{Lu}{1,4}-\d{1,6})\b/u;
  /* o arquivo pelo nome de gente: a vaga pelo apelido, o documento dela pela
     pasta e pelo apelido, e o resto como o menu o chama */
  const nomeDoAlvo = (alvo) => {
    const partes = String(alvo || "").split("/");
    const id = (partes.at(-1).match(ID) || [])[1];
    const apelido = id ? nomeDoItem(id) : "";
    const pasta = partes.length > 1 ? partes[0] : "";
    /* o original datado (`_bruto/2026-09-14-candidatura-V-012.md`) pelo que
       ele é e pelo dia, e não pela data escrita com espaços */
    const datado = partes.at(-1).match(/^(\d{4})-(\d{2})-(\d{2})-(.+?)(\.\w+)?$/);
    if (datado) return `${pasta ? nomeDeGente(pasta) + " · " : ""}${datado[4].replace(/-(?!\d)/g, " ")}, ${datado[3]}/${datado[2]}`;
    /* gente pelo nome como se escreve: o arquivo guarda "helena-prates" */
    if (!apelido) return pasta === pastas?.pessoa ? deGente(nomeDoArquivo(alvo)) : nomeDoArquivo(alvo);
    const doItem = !pasta || pasta === pastas?.item || pasta === pastas?.pessoa;
    return `${doItem ? "" : nomeDeGente(pasta) + " · "}${id} (${apelido})`;
  };
  const maiuscula = (t) => (t ? t[0].toUpperCase() + t.slice(1) : "");
  const deGente = (t) => t.replace(/\(([^)]*)\)/, (_, n) =>
    `(${n.split(" ").map((w, i) => (i && /^(da|de|do|das|dos|e)$/.test(w) ? w : maiuscula(w))).join(" ")})`);
  const complemento = (p) => (p?.alvo ? nomeDoAlvo(p.alvo) : p?.detalhe || "");
  const frase = (p) => maiuscula(String(p?.verbo || "trabalhando")) + (complemento(p) ? ": " + complemento(p) : "");

  const duracao = (valor) => {
    const s = Math.max(0, Math.round(valor / 1000));
    if (s < 60) return `${s} s`;
    const m = Math.floor(s / 60), r = s % 60;
    if (m < 60) return r && m < 10 ? `${m} min ${r} s` : `${m} min`;
    return `${Math.floor(m / 60)} h ${m % 60} min`;
  };
  const ha = (iso) => {
    const d = agora - ms(iso);
    return d < 5000 ? "agora mesmo" : `há ${duracao(d)}`;
  };
  const dinheiro = (v) => v < 0.01 ? "menos de US$ 0,01" : "US$ " + v.toFixed(2).replace(".", ",");
  const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

  /* ── O AGORA, E O CAMINHO ATÉ ELE ──────────────────────────────────── */
  const agoraDiz = $derived.by(() => {
    if (!rodando) return { verbo: "", resto: "", desde: "" };
    /* o separador fica com o verbo: "Clicando: botão Continuar", e o passo que
       falhou vem depois de um travessão, e não de outros dois-pontos */
    if (estado === "esperando") return { verbo: "Esperando você no painel", resto: "", desde: rodando.esperando };
    if (estado === "sem-sinal") return { verbo: "Sem sinal do assistente", resto: "", desde: rodando.sinal };
    if (estado === "comecando") return { verbo: "Abrindo o trabalho", resto: "", desde: rodando.desde };
    if (estado === "pensando") return { verbo: "Pensando no próximo passo", resto: "", desde: atual.fim };
    if (estado === "tropecou") return { verbo: "O último passo não deu certo — ", resto: frase(atual), desde: atual.fim };
    return { verbo: maiuscula(atual.verbo) + (complemento(atual) ? ": " : ""), resto: complemento(atual), desde: atual.em };
  });
  /* passos iguais em seguida viram um só, com as vezes — "Procurando na base
     ×3" diz mais que três linhas iguais */
  const chaveDe = (p) => `${p.verbo}|${p.alvo || ""}|${p.detalhe || ""}|${p.erro ? 1 : 0}`;
  const grupos = $derived.by(() => {
    const g = [];
    for (const p of passos) {
      const ultimo = g.at(-1);
      if (ultimo && ultimo.chave === chaveDe(p)) { ultimo.vezes++; ultimo.fim = p.fim; ultimo.aberto = !p.fim; continue; }
      g.push({ chave: chaveDe(p), passo: p, vezes: 1, em: p.em, fim: p.fim, aberto: !p.fim, erro: p.erro });
    }
    return g;
  });
  /* o caminho: os anteriores ao de agora, do mais novo ao mais velho */
  const caminho = $derived((atual && !atual.fim ? grupos.slice(0, -1) : grupos).slice(-5).reverse());
  const tempoDe = (g) => duracao((g.fim ? ms(g.fim) : agora) - ms(g.em));

  const contagem = $derived(rodando?.contagem || {});
  const resumoDoTrabalho = $derived([
    contagem.passos ? plural(contagem.passos, "passo", "passos") : "",
    contagem.lidos ? `leu ${plural(contagem.lidos, "arquivo", "arquivos")}` : "",
    contagem.gravados ? `gravou ${contagem.gravados}` : "",
    contagem.paginas ? `abriu ${plural(contagem.paginas, "página", "páginas")}` : "",
    contagem.erros ? plural(contagem.erros, "passo falhou", "passos falharam") : "",
  ].filter(Boolean).join(" · "));
  const trabalhado = $derived(rodando ? (rodando.trabalhado ?? 0) + (rodando.esperando ? 0 : agora - recebido) : 0);
  const faltaParaOTeto = $derived(rodando?.teto ? rodando.teto - trabalhado : Infinity);

  /* ── O QUE TERMINOU ────────────────────────────────────────────────── */
  /* o resultado some quando a pessoa o dispensa — e volta só com uma execução nova */
  let dispensada = $state("");
  const ultima = $derived(execucao?.ultima && execucao.ultima.ate !== dispensada ? execucao.ultima : null);
  /* o desfecho, e o que dizer depois do motivo: a causa vem do lançador
     (D279); o resultado guardado antes dela só tem o motivo */
  const desfecho = $derived(!ultima ? "" : ultima.ok ? "feito"
    : ultima.causa === "parado" || ultima.motivo === "você mandou parar" ? "parado" : "falhou");
  const SELO_DO_FIM = { feito: "terminou", parado: "você parou", falhou: "não terminou" };
  const motivoDito = $derived.by(() => {
    if (desfecho !== "falhou" || !ultima.motivo) return "";
    const codigo = ultima.motivo.match(/^saiu com (-?\d+)$/);
    return maiuscula(codigo ? `o programa do assistente fechou com erro (código ${codigo[1]})` : ultima.motivo);
  });
  /* o corte por limite, com a conversa guardada, se continua (D280) */
  const continuavel = $derived(Boolean(ultima?.retomavel) && !execucao?.rodando);
  const conselho = $derived.by(() => {
    if (desfecho !== "falhou") return "";
    if (continuavel) return ultima.causa === "limite-de-espera"
      ? "Ele esperou a sua resposta no painel e parou. Continue de onde ele parou quando puder responder."
      : "Ele parou no meio, sem ter errado: continue de onde parou, com a mesma conversa. O que ele gravou até ali ficou salvo.";
    if (ultima.causa === "limite-de-espera") return "Ele esperou a sua resposta no painel e desistiu. Peça de novo quando puder responder.";
    return ultima.gravados?.length
      ? "O que ele gravou até ali ficou salvo. Confira antes de pedir de novo, para ele não refazer o que já fez."
      : ultima.causa === "limite-de-rodadas" || ultima.causa === "limite-de-tempo" ? "Nada foi gravado: pedir de novo começa do zero." : "";
  });
  const resumoDoFim = $derived(!ultima ? "" : [
    `Levou ${duracao(ms(ultima.ate) - ms(ultima.desde))}`,
    ultima.contagem?.passos ? plural(ultima.contagem.passos, "passo", "passos") : "",
    ultima.custo ? dinheiro(ultima.custo) : "",
  ].filter(Boolean).join(" · "));
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

{#if rodando}
  <section class="p-execucao p-agente" data-estado={estado} aria-label="o assistente trabalhando">
    <div class="p-agente-mascote"><Mascote animacao={ANIMACAO[estado] || "trabalhando"} tamanho={76} /></div>
    <div class="p-agente-corpo">
      <p class="p-agente-titulo">
        <b>{@render comItem(rodando.nome)}</b>
        <span class="p-agente-selo">{SELO[estado] || "trabalhando"}</span>
      </p>

      <p class="p-agente-agora">
        <span role="status"><b>{agoraDiz.verbo}</b>{agoraDiz.resto}</span>
        {#if agoraDiz.desde}<span class="p-agente-tempo">{ha(agoraDiz.desde)}</span>{/if}
      </p>
      {#if estado === "esperando"}
        <p class="p-agente-nota">Ele parou para você decidir. <a href={paraTarefa}>Abrir a tela dele</a> — o tempo parado não conta no limite.</p>
      {:else if estado === "sem-sinal"}
        <p class="p-agente-nota">O último sinal foi {ha(rodando.sinal)}. Pode ser um passo longo; se continuar assim, você pode parar.</p>
      {/if}
      {#if rodando.fala && estado !== "sem-sinal"}
        <p class="p-agente-fala"><span class="p-agente-rotulo">Ele disse</span> “{rodando.fala}”</p>
      {/if}

      {#if caminho.length}
        <ol class="p-agente-trilha" aria-label="os passos de antes, do mais novo ao mais velho">
          {#each caminho as g, i (g.em + i)}
            <li data-erro={g.erro ? "" : undefined}>
              <span class="p-agente-marca" aria-hidden="true">{g.erro ? "✗" : "✓"}</span>
              <span class="p-agente-passo">{frase(g.passo)}{#if g.vezes > 1}<span class="p-agente-vezes">{" ×" + g.vezes}</span>{/if}</span>
              <span class="p-agente-tempo">{tempoDe(g)}</span>
            </li>
          {/each}
        </ol>
      {/if}

      <p class="p-agente-meta">
        Começou {ha(rodando.desde)}{#if resumoDoTrabalho}{" · " + resumoDoTrabalho}{/if}
        {#if estado !== "sem-sinal" && estado !== "esperando"} · último sinal {ha(rodando.sinal)}{/if}
      </p>
      {#if faltaParaOTeto < AVISO_DO_TETO_MS}
        <p class="p-agente-nota" data-tom="falha">Faltam {duracao(Math.max(0, faltaParaOTeto))} para o limite de {duracao(rodando.teto)} trabalhando: aí a execução é encerrada.</p>
      {/if}
      {#if rodando.gravados?.length}
        <div class="p-agente-gravados"><span class="p-agente-rotulo">Gravou</span>
          <ul>{#each rodando.gravados as g (g)}<li><a href={paraArquivo(g)}>{nomeDoAlvo(g)}</a></li>{/each}</ul>
        </div>
      {/if}
      {#if passos.length > 1}
        <details class="p-agente-todos">
          <summary>Ver todos os passos{contagem.passos > passos.length ? ` (os últimos ${passos.length} de ${contagem.passos})` : ` (${passos.length})`}</summary>
          <ol>
            {#each passos as p, i (p.id || p.em + i)}
              <li data-erro={p.erro ? "" : undefined} data-aberto={p.fim ? undefined : ""}>
                <span class="p-agente-passo">{frase(p)}</span>
                <span class="p-agente-tempo">{p.fim ? duracao(ms(p.fim) - ms(p.em)) : "agora"}{p.erro ? " · falhou" : ""}</span>
              </li>
            {/each}
          </ol>
        </details>
      {/if}
    </div>
    <button type="button" class="c-acao" onclick={parar}>Parar</button>
  </section>
{:else if ultima}
  <section class="p-execucao p-agente" data-estado={desfecho} aria-label="o que o assistente fez">
    <div class="p-agente-mascote"><Mascote animacao={{ feito: "comemorando", parado: "dormindo", falhou: "triste" }[desfecho]} tamanho={60} /></div>
    <div class="p-agente-corpo">
      <p class="p-agente-titulo">
        <b>{@render comItem(ultima.nome)}</b>
        <span class="p-agente-selo">{SELO_DO_FIM[desfecho]}</span>
      </p>
      {#if motivoDito}<p class="p-agente-motivo">{motivoDito}.</p>{/if}
      {#if conselho}<p class="p-agente-nota">{conselho}</p>{/if}
      <p class="p-agente-meta">{resumoDoFim}</p>
      {#if ultima.gravados?.length}
        <div class="p-agente-gravados"><span class="p-agente-rotulo">Gravou</span>
          <ul>{#each ultima.gravados as g (g)}<li><a href={paraArquivo(g)}>{nomeDoAlvo(g)}</a></li>{/each}</ul>
        </div>
      {/if}
      {#if ultima.resumo}
        <details>
          <summary>ver o que ele disse</summary>
          <pre class="p-execucao-texto">{ultima.resumo}</pre>
        </details>
      {/if}
    </div>
    <div class="p-agente-botoes">
      {#if continuavel}<button type="button" class="c-acao c-acao-cheia" onclick={continuar}>Continuar de onde parou</button>{/if}
      <button type="button" class="c-acao" onclick={() => { dispensada = ultima.ate; }}>Fechar</button>
    </div>
  </section>
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
