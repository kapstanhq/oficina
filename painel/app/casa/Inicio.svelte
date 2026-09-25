<script>
  /**
   * O INÍCIO — responde "o que eu faço agora?" (D231).
   *
   * O D230 deu ao painel o lugar de onde se volta, e ele nasceu como espelho
   * do `INDICE.md`: tudo o que o arquivo tem, na ordem do arquivo. Quem abre
   * não abre para ler o índice — abre para saber de quem é a vez. A ordem
   * agora é a da pergunta:
   *
   *   a vez            o assistente está esperando? então é isso, e é o topo
   *   a régua          as etapas com o número de cada uma, no cabeçalho
   *   o começo         base sem item nenhum: os primeiros passos do pack (D234)
   *   agora (`hoje`)   um item por linha, com o botão do próximo passo:
   *                    o que o `hoje.md` apontou e não foi feito, e então as
   *                    etapas mais adiantadas primeiro (D264)
   *   a julgar         (`funil`) a primeira etapa, pela escala do pack, e o
   *                    baralho para o resto
   *   o que mudou      desde a última visita, dobrado (D234)
   *   quanto tem       os contadores, só sem `funil.md`
   *   o que pedir      a tabela do README do pack, dobrada
   *
   * "Quem é", "Como eu trabalho", "Pulado no começo" e o que está conectado
   * são referência, e moram em `Sobre.svelte`.
   *
   * ── NADA AQUI SABE DE OFÍCIO ──────────────────────────────────────────
   * `hoje.md` e `funil.md` são do FORMATO, não de um pack. O que dá para
   * pedir vem de `acoes.json`, que o montador deriva do README — é dado.
   * Página inicial escrita por pack é o acoplamento que o D229 tirou do motor.
   *
   * ── O QUE ESTA TELA NÃO FAZ ───────────────────────────────────────────
   * Marcar a caixa, mover de etapa, editar o campo. O painel não grava na
   * base. O botão de uma ação COPIA o comando; onde o painel pode chamar o
   * assistente sozinho (D232) há também o "Fazer agora", com o custo dito
   * antes. O que NÃO existe é botão que aceita um pedido que ninguém vai ler.
   */
  import { getContext } from "svelte";
  import { paraArquivo, paraTarefa, paraFunil, idsDaLinha, partirLinha, partirId, nomeDoArquivo,
    nomeDeGente, caudaParaLer, ehLinhaVazia, comFicha, pegarDoItem, ordenar as emOrdem,
    valorCurto, semResposta, fichaDoItem, passosDoItem, faseDe, trechosDoFunil, noTrecho, trechoDe } from "../rota.js";
  import Proximo from "./Proximo.svelte";
  import { textos } from "../textos.svelte.js";
  import { BLOCOS_DO_INICIO } from "../../nucleo/molde.mjs";
  const { pedirArquivo, pedirMudancas } = getContext("ponte");

  let { mapa, indice, recarga = 0, doc = null, esperaResposta = false, agenteEsperando = false,
    agente = false, aoResponder = () => {}, funil = null, andamento = null,
    decisoes = [], decidir = () => {}, acoes = [], podeChamar = false,
    chamar = () => {}, comeco = [], pastasDoPack = {}, visitaAnterior = 0, proximos = {}, rotulos = {},
    inicio = [], fichas = null, destaque = [], documentos = null, documentosDoPack = {}, ordens = {}, fases = {},
    ordemDosItens = { chave: "", desc: false }, ordenar = () => {}, ocupados = [] } = $props();

  const ordem = $derived(inicio.length ? inicio : BLOCOS_DO_INICIO);

  let dia = $state(null);
  let mudou = $state([]);

  /* ── O MARCADOR DE VAZIO NÃO É UM ITEM ────────────────────────────────
     O contrato §4.2 manda a seção vazia continuar no ARQUIVO com uma linha só
     — `- nada aqui hoje.`. Sem esta peneira ela vira um item, e a tela escreve
     "Vence hoje · 1" num dia em que não vence nada (medido em 2026-09-20: as
     quatro seções diziam 1, e as quatro estavam vazias). Só pega linha SEM
     caixa de marcar: tarefa de verdade tem `- [ ]`. */
  const ehVazio = (i) => (i.caixa === null || i.caixa === undefined) && ehLinhaVazia(i.texto);
  const linhasDe = (s) =>
    (s.itens || []).filter((i) => i.tipo === "linha" && !ehVazio(i));

  const temArquivo = (nome) =>
    (mapa?.arvore || []).some((i) => i.tipo === "arquivo" && i.nome === nome);

  /* `GET /base` é o INDICE e a árvore — o que a NAVEGAÇÃO precisa. O dia e o
     funil são conteúdo desta tela, e pô-los no mapa faria toda troca de tela
     recarregar os dois. `recarga` é lido de propósito: a volta do foco e a
     resposta de uma tarefa reexecutam isto, porque o agente acabou de gravar. */
  $effect(() => {
    recarga;
    let vivo = true;
    (async () => {
      /* o funil vem da casca, que o lê uma vez para as três telas (D232) */
      const h = temArquivo("hoje.md") ? await pedirArquivo("hoje.md").catch(() => null) : null;
      if (!vivo) return;
      dia = h;
    })();
    return () => { vivo = false; };
  });

  /* ── DESDE A ÚLTIMA VISITA (D234) ─────────────────────────────────────
     Relido a cada `recarga`, como o dia: o assistente grava com a aba aberta,
     e a lista cresce enquanto ela está na frente. Sem visita anterior — a
     primeira abertura neste navegador — não há "desde", e a seção não existe. */
  $effect(() => {
    recarga;
    const desde = visitaAnterior;
    if (!desde) { mudou = []; return; }
    let vivo = true;
    pedirMudancas(desde).then((m) => { if (vivo) mudou = m || []; }).catch(() => {});
    return () => { vivo = false; };
  });
  const TETO_DE_MUDANCAS = 6;
  let todasAsMudancas = $state(false);
  const tipoDa = (m) => m.caminho.startsWith("arquivo-morto/") ? "saiu" : m.novo ? "novo" : "mudou";
  const ondeMora = (m) => {
    const pasta = m.caminho.includes("/") ? m.caminho.split("/")[0] : "";
    return pasta && pasta !== "arquivo-morto" ? nomeDeGente(pasta) : "";
  };
  const quando = (ms) => {
    const d = new Date(ms);
    return d.toLocaleString("pt-BR", { day: "numeric", month: "long",
      ...(d.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}),
      hour: "2-digit", minute: "2-digit" });
  };
  const contaDo = (tipo) => mudou.filter((m) => tipoDa(m) === tipo).length;

  /* ── O COMEÇO (D234) ──────────────────────────────────────────────────
     Enquanto a pasta dos itens não tem nenhum, o início abre pelos passos que
     o pack declarou — a ordem é do ofício, e mora no `painel.json` dele. */
  const RE_ITEM = /^\p{Lu}{1,4}-\d{1,6}-/u;
  const semItens = $derived(!(mapa?.arvore || []).some((p) => p.tipo === "pasta" &&
    p.nome === pastasDoPack?.item && (p.itens || []).some((n) => RE_ITEM.test(n))));
  const passosDoComeco = $derived(comeco
    .map((c) => acoes.flatMap((g) => g.acoes || []).find((a) => a.comando === c))
    .filter(Boolean));


  /* ── AS ETAPAS ────────────────────────────────────────────────────────
     A régua do cabeçalho, o "agora" e a pilha leem daqui. O quadro de
     colunas e a lista de uma etapa com quatro botões por cartão caíram
     (D264): a régua leva à página da etapa. */
  /* os cartões com a ficha de cada item e na ordem escolhida — a mesma da
     tabela e da lista do leitor (D274) */
  const rotulosDasEtapas = $derived((funil?.secoes || []).map((s) => s.titulo));
  const etapas = $derived((funil?.secoes || []).map((s) => ({
    rotulo: s.titulo,
    cartoes: emOrdem(linhasDe(s).map((i) => {
      const { titulo, cauda } = partirLinha(i.texto);
      const ids = idsDaLinha(i.texto, indice);
      const p = partirId(titulo);
      return comFicha({ ...p, titulo: p.nome, cauda: caudaParaLer(cauda), item: ids[0] || "",
        caminho: ids.length ? indice.get(ids[0]) : "", etapa: s.titulo },
      { fichas, destaque, documentos, documentosDoPack, etapas: rotulosDasEtapas });
    }), ordemDosItens, pegarDoItem, ordens),
  })));
  /* o que o cartão diz da ficha: os campos do destaque que têm resposta, curtos */
  /* a escala do pack ("alto", "intermediário") sozinha não diz de quê: leva o nome do campo */
  const fatosDe = (c) => destaque.filter((d) => !semResposta(c.campos?.[d]))
    .map((d) => (ordens[d] ? `${d} ${valorCurto(c.campos[d], 26)}` : valorCurto(c.campos[d], 26)));


  /* ── AGORA ────────────────────────────────────────────────────────────
     O que o `hoje.md` apontou e ainda não foi feito, e depois as etapas mais
     adiantadas primeiro — candidatura antes de vaga salva. A primeira etapa
     do funil é a pilha a julgar, e tem bloco próprio. */
  const cartaoDe = $derived(new Map(etapas.flatMap((e) => e.cartoes).filter((c) => c.item).map((c) => [c.item, c])));
  /* a nota do dia sem o comando que ela cita: o comando já é o botão */
  const RE_COMANDO = /\/[\w-]+:[\w-]+/;
  const semComando = (t) => String(t || "").split(/;\s*/).filter((p) => !RE_COMANDO.test(p)).join("; ").trim();
  const doDia = $derived((dia?.secoes || []).flatMap((s) => linhasDe(s).map((i) => ({
    ids: idsDaLinha(i.texto, indice), feito: i.caixa === true, secao: s.titulo,
    texto: i.texto, nota: semComando(partirLinha(i.texto).cauda) }))));
  const agora = $derived.by(() => {
    const vistos = new Set();
    const out = [];
    const por = (item, nota) => {
      const c = cartaoDe.get(item);
      if (!c || vistos.has(item)) return;
      vistos.add(item);
      out.push({ c, nota });
    };
    /* a primeira etapa é a pilha, com bloco próprio: não se repete aqui */
    for (const l of doDia) if (!l.feito && l.ids[0] && cartaoDe.get(l.ids[0])?.etapa !== etapas[0]?.rotulo) por(l.ids[0], l.nota);
    for (const e of etapas.slice(1).reverse()) {
      /* dentro da etapa, a fase mais adiantada primeiro, e então a escala */
      const cs = ordemDosItens.chave ? e.cartoes
        : [...e.cartoes].sort((x, y) => grauDaFase(y) - grauDaFase(x) || nivelDe(x) - nivelDe(y));
      for (const c of cs) por(c.item, "");
    }
    return out;
  });
  const feitos = $derived(doDia.filter((l) => l.feito));
  /* ── A RÉGUA É O PIPELINE (D266): as etapas e as fases lidas da ficha ── */
  const regua = $derived(trechosDoFunil(rotulosDasEtapas, fases).map((t) => ({ ...t,
    quantos: (etapas.find((e) => e.rotulo === t.etapa)?.cartoes || []).filter((c) => noTrecho(c, t, fases)).length })));
  const grauDaFase = (c) => (fases[c.etapa] || []).findIndex((f) => f.nome === faseDe(c, fases)) + 1;
  const porqueDe = (c) => passosDoItem({ id: c.item, andamento, acoes, proximos, rotulos,
    ficha: fichaDoItem(c), ocupados }).destaque?.porque || "";
  const TETO_DE_AGORA = 8;
  let todoAgora = $state(false);

  /* a lista do dia leva a data no título; de ontem, ela ainda serve, e diz */
  const hojeISO = () => new Date().toLocaleDateString("sv-SE");
  const dataDoDia = $derived((String(dia?.titulo || "").match(/\d{4}-\d{2}-\d{2}/) || [""])[0]);
  const diaVelho = $derived(Boolean(dataDoDia) && dataDoDia < hojeISO());
  const refazerODia = $derived(acoes.flatMap((g) => g.acoes || [])
    .find((a) => /(^|:)o-que-fazer-hoje$/.test(a.comando)) || null);

  /* ── A PILHA A JULGAR ─────────────────────────────────────────────────
     A primeira etapa, pela primeira escala de `ordens` que está no destaque.
     Enquanto o campo é `?`, vale o que a linha do funil ou a última linha do
     histórico que cita a escala dizem dele (`encaixe proposto: alto`): a
     ficha chega sem a procedência, que é onde a proposta da triagem mora. */
  const pilha = $derived(etapas[0] || null);
  const escala = $derived(Object.keys(ordens).find((k) => destaque.includes(k)) || "");
  const valorNaEscala = (c) => {
    if (!escala) return "";
    if (!semResposta(c.campos?.[escala])) return String(c.campos[escala]).toLowerCase();
    const re = new RegExp(`${escala}[^·;]*?\\b(${ordens[escala].join("|")})\\b`, "iu");
    for (const t of [c.cauda, ...[...(c.historico || [])].reverse()]) {
      const m = String(t || "").match(re);
      if (m) return m[1].toLowerCase();
    }
    return "";
  };
  const propostoDe = (c) => (semResposta(c.campos?.[escala]) && valorNaEscala(c) ? `${escala} proposto: ${valorNaEscala(c)}` : "");
  /* a cauda sem o pedaço que a proposta já disse em cima */
  const caudaDaPilha = (c) => (propostoDe(c) ? String(c.cauda || "").split(" · ")
    .filter((p) => !p.toLowerCase().includes(escala.toLowerCase())).join(" · ") : c.cauda);
  const nivelDe = (c) => {
    const v = valorNaEscala(c);
    const i = v ? ordens[escala].findIndex((x) => v.startsWith(x)) : -1;
    return i < 0 ? 99 : i;
  };
  const doTopo = $derived(pilha ? [...pilha.cartoes].sort((a, b) => nivelDe(a) - nivelDe(b)) : []);
  const TETO_DA_PILHA = 5;

  /* zero, e só zero: "0" e "0 — no teto" contam, "56" não. O `?` NÃO entra —
     ele é ausência de resposta, e não de trabalho. */
  const ehZero = (v) => /^0\b/.test(String(v ?? "").trim());

  const atualizado = $derived(
    (mapa?.campos || []).find((c) => /^atualizad/i.test(c.rotulo))?.valor || "");

  /* ── COPIAR O COMANDO ─────────────────────────────────────────────────
     `127.0.0.1` é contexto seguro, então a área de transferência existe. Se
     o navegador recusar, o comando continua escrito ao lado: dá para
     selecionar à mão, e a tela diz isso em vez de fingir que copiou. */
  let copiado = $state("");
  async function copiar(comando) {
    try {
      await navigator.clipboard.writeText(comando);
      copiado = comando;
    } catch {
      copiado = "!" + comando;
    }
    setTimeout(() => { copiado = ""; }, 2500);
  }
</script>

<header class="c-secao" style="gap:var(--s2)">
  <h1 class="c-h2">{mapa.titulo}</h1>
  {#if etapas.length}
    <nav class="p-etapas" aria-label="etapas">
      {#each regua as t, i (t.chave)}
        {#if i}<span class="p-etapas-seta" aria-hidden="true">›</span>{/if}
        <a class="p-etapa" href={paraFunil(t.chave)} data-vazia={t.quantos ? undefined : ""} data-fase={t.fase ? "" : undefined}>
          <b>{t.quantos}</b><span>{t.rotulo}</span>
        </a>
      {/each}
    </nav>
  {:else if atualizado}<p class="c-nota">Atualizado em {atualizado}</p>{/if}
</header>

<!-- ── A VEZ ─────────────────────────────────────────────────────────────
     Só existe quando é da pessoa. Em repouso o início não inventa um "próximo
     passo": quem sabe o que vem é a lista do dia, logo abaixo. -->
{#if esperaResposta}
  <a class="p-vez" href={paraTarefa} onclick={aoResponder}>
    <span class="p-pulso" data-tom="vivo" aria-hidden="true"></span>
    <span class="p-vez-texto">
      <b>{agenteEsperando ? "O assistente está esperando você" : "Uma tela sua está aberta"}</b>
      <span>{doc?.titulo || "Ele precisa de uma resposta sua para continuar."}{agenteEsperando ? "" : " — ele parou de esperar; o que você responder fica guardado."}</span>
    </span>
    <span class="p-vez-botao">Responder →</span>
  </a>
{/if}


<!-- ── OS BLOCOS, NA ORDEM DO MOLDE (D244) ──────────────────────────────────
     A ordem vem de `inicio` no painel.json do pack, e a base pode trocá-la
     pelo dela. A vez não entra: quando é da pessoa, é sempre o topo. -->
{#snippet bloco_comeco()}
{#if semItens && passosDoComeco.length}
  <section class="c-secao" style="gap:var(--s2)" aria-label="por onde começar">
    <h2 class="c-h3">Por onde começar</h2>
    <p class="c-nota">Ainda não há nada aqui. Estes são os primeiros passos, nesta ordem.</p>
    <ol class="p-comeco">
      {#each passosDoComeco as a, i (a.comando)}
        <li>
          <span class="p-comeco-n" aria-hidden="true">{i + 1}</span>
          <div>
            <b>{a.nome}</b>
            <span>{a.oque}</span>
            {#if podeChamar && (a.sobre || []).includes("nada")}
              <button type="button" class="c-acao" onclick={() => chamar(a.comando)}>Fazer agora</button>
            {:else}
              <button type="button" class="p-pedido-copiar" onclick={() => copiar(a.comando)}
                aria-label={"copiar o pedido " + a.comando}>
                <code>{a.comando}</code>
                <em>{copiado === a.comando ? "Copiado ✓"
                  : copiado === "!" + a.comando ? "Selecione e copie" : "Copiar e colar no Claude"}</em>
              </button>
            {/if}
          </div>
        </li>
      {/each}
    </ol>
  </section>
{/if}
{/snippet}

{#snippet bloco_novidades()}
{#if mudou.length}
  <details class="c-secao p-dobra" aria-label="o que mudou">
    <summary class="p-cabeca">
      <h2 class="c-h3">Novidades</h2>
      <span class="c-nota">{[
        contaDo("novo") && `${contaDo("novo")} ${contaDo("novo") === 1 ? "novo" : "novos"}`,
        contaDo("mudou") && `${contaDo("mudou")} ${contaDo("mudou") === 1 ? "mudou" : "mudaram"}`,
        contaDo("saiu") && `${contaDo("saiu")} ${contaDo("saiu") === 1 ? "arquivado" : "arquivados"}`,
      ].filter(Boolean).join(" · ")} desde {quando(visitaAnterior)}</span>
    </summary>
    <ul class="p-mudou">
      {#each (todasAsMudancas ? mudou : mudou.slice(0, TETO_DE_MUDANCAS)) as m (m.caminho)}
        <li>
          <a href={paraArquivo(m.caminho)}>
            <span class="p-mudou-tipo" data-tipo={tipoDa(m)}>{textos[tipoDa(m)]}</span>
            <b>{nomeDoArquivo(m.caminho)}</b>
            {#if ondeMora(m)}<span class="p-mudou-onde">{ondeMora(m)}</span>{/if}
          </a>
        </li>
      {/each}
    </ul>
    {#if mudou.length > TETO_DE_MUDANCAS}
      <button type="button" class="c-chip" style="align-self:flex-start"
        onclick={() => { todasAsMudancas = !todasAsMudancas; }}
      >{todasAsMudancas ? "Mostrar menos" : "Ver as outras " + (mudou.length - TETO_DE_MUDANCAS)}</button>
    {/if}
  </details>
{/if}
{/snippet}

{#snippet bloco_numeros()}
<!-- os contadores são o `## Quanto tem` do INDICE, e onde há funil a régua das
     etapas já diz os mesmos números, com o clique junto: duas fileiras de
     números iguais, uma em cima da outra, é a tela se repetindo. Ficam para a
     base que não tem `funil.md`. -->
{#if mapa.contadores.length && !temArquivo("funil.md")}
  <section aria-label="quanto tem">
    <div class="p-numeros">
      <!-- zero continua na tela, com menos tinta: sumir com ele esconderia
           que a etapa existe, e cinco zeros ao lado de um 56 com o mesmo peso
           fazem os seis disputarem o olho -->
      {#each mapa.contadores as c, i (i)}
        <div class="p-numero" class:p-numero-zero={ehZero(c.valor)}>
          <b>{c.valor}</b><span>{c.rotulo}</span>
        </div>
      {/each}
    </div>
  </section>
{/if}
{/snippet}

{#snippet bloco_hoje()}
{#if agora.length || dia}
  <section class="c-secao" style="gap:var(--s2)" aria-label="agora">
    <div class="p-cabeca">
      <h2 class="c-h3">Agora</h2>
      <span class="c-nota">{agora.length} {agora.length === 1 ? "item espera" : "itens esperam"} um passo seu</span>
      {#if dia}<a class="p-cabeca-link" href={paraArquivo("hoje.md")}>lista do dia</a>{/if}
    </div>
    {#if diaVelho}
      <div class="p-aviso-dia">
        <span>A lista do dia é de {dataDoDia.split("-").reverse().join("/")}: o que vem dela pode já ter mudado.</span>
        {#if refazerODia && podeChamar}
          <button type="button" class="c-chip" onclick={() => chamar(refazerODia.comando)}>Refazer a de hoje</button>
        {:else if refazerODia}
          <button type="button" class="c-chip" onclick={() => copiar(refazerODia.comando)}
          >{copiado === refazerODia.comando ? "Copiado ✓" : "Copiar o pedido da de hoje"}</button>
        {/if}
      </div>
    {/if}
    {#if agora.length}
      <ul class="p-agora">
        {#each (todoAgora ? agora : agora.slice(0, TETO_DE_AGORA)) as { c, nota } (c.item)}
          <li class="p-agora-linha" data-marcado={decisoes.some((d) => d.item === c.item) ? "" : undefined}>
            <div class="p-agora-texto">
              <a href={paraFunil(trechoDe(c, fases), c.item)}><b>{c.nome}</b><span class="p-id">{c.id}</span></a>
              <span class="p-agora-etapa">{faseDe(c, fases) ? `${c.etapa} · ${faseDe(c, fases)}` : c.etapa}</span>
              <p>{nota || porqueDe(c) || c.cauda}</p>
            </div>
            <Proximo id={c.item} nome={c.nome} {andamento} {decisoes} {decidir}
              {acoes} {proximos} {rotulos} {podeChamar} {chamar} modo="linha" ficha={fichaDoItem(c)} {ocupados} />
          </li>
        {/each}
      </ul>
      {#if agora.length > TETO_DE_AGORA}
        <button type="button" class="c-chip" style="align-self:flex-start" onclick={() => { todoAgora = !todoAgora; }}
        >{todoAgora ? "Mostrar só os " + TETO_DE_AGORA + " primeiros" : "Ver os outros " + (agora.length - TETO_DE_AGORA)}</button>
      {/if}
    {:else}
      <p class="p-vazio">Nada esperando um passo seu além da pilha a julgar.</p>
    {/if}
    {#if feitos.length}
      <details class="p-feitos">
        <summary>Feito nos últimos dias · {feitos.length}</summary>
        <ul>
          {#each feitos as l, k (k)}
            <li>✓ {l.texto.replace(/^\d{4}-\d{2}-\d{2}\s*[—·-]\s*/, "")}</li>
          {/each}
        </ul>
      </details>
    {/if}
  </section>
{/if}
{/snippet}

{#snippet bloco_funil()}
{#if pilha && pilha.cartoes.length}
  <section class="c-secao" style="gap:var(--s2)" aria-label="a julgar">
    <div class="p-cabeca">
      <h2 class="c-h3">Para julgar</h2>
      <span class="c-nota">{pilha.cartoes.length} em “{pilha.rotulo}”{escala ? `, as de melhor ${escala} primeiro` : ""}</span>
    </div>
    {#if pilha.cartoes.some((c) => c.caminho)}
      <div class="p-revisar">
        <a class="c-acao c-acao-cheia" href={paraFunil(pilha.rotulo)}>Julgar {pilha.cartoes.length === 1 ? "a" : `as ${pilha.cartoes.length}`}, uma por vez</a>
        <span class="c-nota">a lista de um lado, o item inteiro do outro</span>
      </div>
    {/if}
    <ul class="p-agora">
      {#each doTopo.slice(0, TETO_DA_PILHA) as c (c.item || c.nome)}
        <li class="p-agora-linha" data-marcado={decisoes.some((d) => d.item === c.item) ? "" : undefined}>
          <div class="p-agora-texto">
            {#if c.caminho}<a href={paraFunil(trechoDe(c, fases), c.item)}><b>{c.nome}</b><span class="p-id">{c.id}</span></a>
            {:else}<b>{c.nome}</b>{/if}
            {#if fatosDe(c).length || propostoDe(c)}<span class="p-agora-etapa">{[propostoDe(c), ...fatosDe(c)].filter(Boolean).join(" · ")}</span>{/if}
            {#if caudaDaPilha(c)}<p>{caudaDaPilha(c)}</p>{/if}
          </div>
          {#if c.caminho}
            <Proximo id={c.item} nome={c.nome} {andamento} {decisoes} {decidir}
              {acoes} {proximos} {rotulos} {podeChamar} {chamar} modo="par" ficha={fichaDoItem(c)} {ocupados} />
          {/if}
        </li>
      {/each}
    </ul>
  </section>
{/if}
{/snippet}

{#snippet bloco_acoes()}
{#if acoes.length}
  <details class="c-secao p-dobra">
    <summary class="p-cabeca">
      <h2 class="c-h3">Pedir outra coisa</h2>
      <span class="c-nota">{acoes.reduce((n, g) => n + g.acoes.length, 0)} pedidos · ou peça no Claude com as suas palavras</span>
    </summary>
    {#each acoes as g, k (k)}
      {#if k && g.rotulo}<span class="p-lado-rotulo" style="padding:0">{g.rotulo}</span>{/if}
      <ul class="p-pedidos-lista">
        {#each g.acoes as a (a.comando)}
          {@const sozinha = (a.sobre || []).includes("nada")}
          {@const doItem = (a.sobre || []).length && !sozinha}
          <li>
            <div><b>{a.nome}</b><span>{a.oque}</span></div>
            {#if podeChamar && sozinha}
              <button type="button" class="c-chip" onclick={() => chamar(a.comando)}>Fazer agora</button>
            {:else if doItem}
              <span class="c-nota">na página de cada item</span>
            {:else}
              <button type="button" class="c-chip" onclick={() => copiar(a.comando)}
                title={a.comando}>{copiado === a.comando ? "Copiado ✓" : copiado === "!" + a.comando ? "Selecione e copie" : "Copiar o pedido"}</button>
            {/if}
          </li>
        {/each}
      </ul>
    {/each}
  </details>
{/if}
{/snippet}

{#each ordem as b (b)}
  {#if b === "comeco"}{@render bloco_comeco()}
  {:else if b === "novidades"}{@render bloco_novidades()}
  {:else if b === "numeros"}{@render bloco_numeros()}
  {:else if b === "hoje"}{@render bloco_hoje()}
  {:else if b === "funil"}{@render bloco_funil()}
  {:else if b === "acoes"}{@render bloco_acoes()}
  {/if}
{/each}
