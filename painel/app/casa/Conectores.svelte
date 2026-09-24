<script>
  /**
   * OS CONECTORES — a tela em que uma PESSOA liga um serviço.
   *
   * ── POR QUE ELA EXISTE ────────────────────────────────────────────────
   * Ligar um conector, guardar a chave dele e dizer quanto ele pode gastar
   * sempre foram gestos de gente — o agente não faz nenhum dos três, e não
   * há ferramenta para isso. Só que "gente" vinha querendo dizer "linha de
   * comando": o estado do conector trazia o `como_ligar`, uma linha com
   * `node "<caminho do cache de plugins>"` dentro, e o agente a repetia. O
   * dono do produto apontou o erro no primeiro uso real: quem instala o pack
   * é leigo, e leigo não abre terminal.
   *
   * Esta tela é o mesmo gesto com outra porta. O clique aqui é a pessoa
   * agindo — as rotas estão atrás das mesmas quatro guardas do resto do
   * painel, e nenhuma delas é ferramenta do agente (ver
   * `conectores/nucleo/painel.mjs`).
   *
   * ── O SEGUNDO CLIQUE NÃO É CERIMÔNIA ──────────────────────────────────
   * Tudo que ABRE alguma coisa (ligar, guardar chave) ou que GASTA (teto,
   * teste pago) pede "Confirmo" com o aviso na frente. São duas razões, e a
   * primeira vale mesmo sem a segunda:
   *
   *   · o aviso de um conector — risco de conta, termos do serviço, custo —
   *     precisa ter passado na frente de alguém ANTES de a coisa ficar de pé
   *   · o agente tem ferramenta de navegador em algumas sessões, e um
   *     navegador que já entrou no painel carrega o cookie. Duas idas com um
   *     texto no meio é mitigação, não prova — está escrito no servidor
   *
   * DESLIGAR não pede confirmação: ele fecha. Pôr cerimônia no gesto que
   * reduz risco treina a pessoa a confirmar sem ler.
   *
   * ── E O QUE NUNCA APARECE AQUI ────────────────────────────────────────
   * O valor de uma chave guardada. Nem inteiro, nem com os quatro últimos
   * dígitos: o servidor devolve `guardada: true` e nada mais, e a tela não
   * teria de onde tirar o resto. O que ela diz é "há uma chave guardada".
   */
  import { pedirConectores, ligarConector, desligarConector, guardarChaveDe,
    escreverTetoDe, testarConector, pedirExtrato, mexerNaSessao } from "../ponte.js";
  import { nomeDeGente } from "../rota.js";

  let { recarga = 0 } = $props();

  let lista = $state(null);
  let semConectores = $state(false);
  let falha = $state("");

  /* um painel aberto por vez na página inteira: `{ nome, qual }`. Dois
     abertos ao mesmo tempo dariam dois campos e um botão "Confirmo" que não
     diz a qual dos dois pertence. */
  let aberto = $state(null);
  /* a ação que já foi pedida uma vez e voltou pedindo confirmação */
  let pendente = $state(null);
  let ocupado = $state("");
  let recado = $state({});
  let erro = $state({});

  let chaveDigitada = $state("");
  let tetoDigitado = $state("");
  let extratos = $state({});

  $effect(() => {
    recarga;
    let vivo = true;
    (async () => {
      try {
        const lido = await pedirConectores();
        if (vivo) { lista = lido; semConectores = false; falha = ""; }
      } catch (e) {
        if (!vivo) return;
        /* 404 é a rota não existir: o pack subiu sem o diretório irmão de
           conectores. Não é defeito, e a frase é a que a pessoa entende. */
        if (e?.status === 404) semConectores = true;
        else falha = String(e?.message || e);
      }
    })();
    return () => { vivo = false; };
  });

  /* ── O DINHEIRO, escrito como se escreve ──────────────────────────────
     `0.0061` não se mostra como `0,0061` a quem está decidindo se liga um
     serviço: o que ela precisa saber é que foi menos de um centavo. E um
     teto redondo sai redondo — "US$ 5", e não "US$ 5,00". */
  const SIMBOLO = { USD: "US$", BRL: "R$", EUR: "€" };
  function dinheiro(n, moeda) {
    const v = Number(n) || 0;
    const s = SIMBOLO[moeda] || (moeda ? moeda + " " : "");
    if (v > 0 && v < 0.01) return `menos de ${s} 0,01`;
    return `${s} ${Number.isInteger(v) ? v : v.toFixed(2).replace(".", ",")}`;
  }

  const PALAVRA = {
    ligado: "ligado",
    desligado: "desligado",
    "sem-chave": "falta a chave",
    prove: "liga-se pela conversa",
  };

  /* ── TRÊS GRUPOS, PELA PERGUNTA "PRECISO FAZER ALGUMA COISA?" (D231) ──
     Eram dez cartões iguais na ordem do catálogo, e o único que pedia um gesto
     — o que falta chave — estava no meio, com a mesma cara de cinco fontes
     grátis que já funcionam. A ordem agora é a da atenção:

       pedem      nasce desligado e ainda não está de pé: falta ligar, ou chave
       conversa   tipo `mcp`: quem liga é o Claude, e aqui só se lê como
       prontos    já funcionam; os que têm teto ou chave continuam com botões

     O grupo é derivado do ESTADO, e não escrito no catálogo: um conector muda
     de grupo no clique que o liga. */
  const grupos = $derived((() => {
    const todos = lista?.conectores || [];
    const de = (filtro) => todos.filter(filtro);
    return [
      { id: "pedem", titulo: "Precisam de você",
        linha: "Estão desligados ou sem chave. Nada aqui funciona até você ligar.",
        itens: de((c) => c.tipo !== "mcp" && c.estado !== "ligado") },
      { id: "prontos", titulo: "Funcionando",
        linha: "O assistente já pode usar estes.",
        itens: de((c) => c.tipo !== "mcp" && c.estado === "ligado") },
      { id: "conversa", titulo: "Ligam-se pela conversa com o Claude",
        linha: "Estes não têm botão: são ligados na sua conta do Claude, e o assistente guia você.",
        itens: de((c) => c.tipo === "mcp") },
    ].filter((g) => g.itens.length);
  })());

  const nomeDe = (c) => c.rotulo || nomeDeGente(c.nome);

  /* ── ONDE O ASSISTENTE ENTRA COM A SUA CONTA (D272) ─────────────────
     Os sites que o pack declara no navegador. "Entrar" abre uma janela nesta
     máquina; o login é lido quando ela FECHA (o Google recusa entrar num
     Chrome com porta de depuração — ver `conectores/nucleo/sessoes.mjs`). A
     tela relê de três em três segundos enquanto há janela. */
  const sessoes = $derived((lista?.conectores || []).find((c) => c.sessoes)?.sessoes || null);
  let recadoDaSessao = $state("");
  let naSessao = $state("");
  const dia = (iso) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const fraseDaSessao = (s) => s.janela === "aberta" ? "Entre na janela que abriu e feche-a quando terminar — o login é lido ao fechar."
    : s.janela === "lendo" ? "Lendo o login…"
    : s.estado === "logada" ? (s.ate ? `Entrou. Vale até ${dia(s.ate)}, ou até o site pedir de novo.`
      /* cookie de sessão (a Gupy, D260): o site não diz até quando */
      : "Entrou. O site não diz até quando vale: se o assistente disser que caiu, entre de novo.")
    : s.estado === "vencida" ? `A sessão venceu em ${dia(s.ate)}. Entre de novo.`
    : "Ainda não entrou. Sem isso, o assistente vê o site como visitante.";
  async function sessao(nome, acao) {
    recadoDaSessao = ""; naSessao = nome;
    try {
      await mexerNaSessao({ nome, acao });
      lista = await pedirConectores();
    } catch (e) { recadoDaSessao = String(e?.message || e); }
    naSessao = "";
  }
  $effect(() => {
    if (!sessoes?.sites?.some((s) => s.janela)) return;
    const r = setInterval(async () => { try { lista = await pedirConectores(); } catch { /* a próxima volta */ } }, 3000);
    return () => clearInterval(r);
  });

  function custoEmPalavra(c) {
    if (c.tipo === "mcp") return "";
    if (!c.pago) return "grátis";
    const moeda = c.custo?.moeda;
    if (!(c.teto_do_mes > 0)) {
      return "pago por uso — ainda sem limite de gasto, e sem limite ele não gasta nada";
    }
    return `pago por uso — gastou ${dinheiro(c.gasto_no_mes, moeda)} de ` +
      `${dinheiro(c.teto_do_mes, moeda)} neste mês`;
  }

  const abrir = (nome, qual) => {
    pendente = null;
    erro = { ...erro, [nome]: "" };
    recado = { ...recado, [nome]: "" };
    aberto = aberto && aberto.nome === nome && aberto.qual === qual ? null : { nome, qual };
    if (qual === "chave") chaveDigitada = "";
    if (qual === "teto") {
      const c = (lista?.conectores || []).find((x) => x.nome === nome);
      tetoDigitado = String(c?.teto_do_mes || c?.teto_sugerido || "");
    }
  };

  const fechar = () => { aberto = null; pendente = null; chaveDigitada = ""; };

  /**
   * Uma ida ao servidor.
   *
   * Três desfechos, e a tela distingue os três: veio pedindo confirmação
   * (guarda o pedido e mostra o aviso), deu certo (a vista nova vem junto,
   * então nada aqui precisa recarregar a lista), ou foi recusado — e aí a
   * frase já vem de gente, porque quem a traduz é o servidor.
   */
  async function mandar(nome, qual, enviar, corpo) {
    ocupado = nome;
    erro = { ...erro, [nome]: "" };
    try {
      const r = await enviar({ nome, ...corpo });
      if (r?.precisa_confirmar) {
        pendente = { nome, qual, corpo, ...r };
        return null;
      }
      pendente = null;
      if (r?.vista) lista = r.vista;
      return r;
    } catch (e) {
      erro = { ...erro, [nome]: String(e?.message || e) };
      return null;
    } finally {
      ocupado = "";
    }
  }

  const ENVIA = {
    ligar: ligarConector,
    chave: guardarChaveDe,
    teto: escreverTetoDe,
    testar: testarConector,
  };

  async function confirmar() {
    const p = pendente;
    if (!p) return;
    const r = await mandar(p.nome, p.qual, ENVIA[p.qual],
      { ...p.corpo, confirmo: true, ...(p.orcamento ? { orcamento: p.orcamento } : {}) });
    if (r) fimDe(p.nome, p.qual, r);
  }

  /* a frase do que acabou de acontecer. Ela é curta e some no próximo
     gesto: um painel que empilha recados vira um registro que ninguém lê */
  function fimDe(nome, qual, r) {
    if (qual === "chave") {
      recado = { ...recado, [nome]: r.guardada
        ? "Guardei a chave. Ela fica só neste computador."
        : "Apaguei a chave guardada." };
      chaveDigitada = "";
      aberto = null;
      return;
    }
    if (qual === "teto") {
      recado = { ...recado, [nome]: `Pronto: até ${dinheiro(r.teto, r.moeda)} por mês.` };
      aberto = null;
      return;
    }
    if (qual === "ligar") {
      recado = { ...recado, [nome]: r.jaEstava
        ? "Este já estava de pé — não tem nada a ligar."
        : "Liguei." };
      aberto = null;
      return;
    }
    if (qual === "testar") {
      recado = { ...recado, [nome]: r.ok
        ? `Funcionou: ${r.diz}.` + (r.gratis ? " Não custou nada."
          : ` Custou ${dinheiro(r.custou, r.moeda)}${r.medido ? " (medido)" : " (estimado)"}.`)
        : `Não deu certo: ${r.motivo}.` };
      aberto = null;
    }
  }

  const acao = (nome, qual, corpo) => async () => {
    const r = await mandar(nome, qual, ENVIA[qual], corpo);
    if (r) fimDe(nome, qual, r);
  };

  async function desligar(nome) {
    ocupado = nome;
    erro = { ...erro, [nome]: "" };
    try {
      const r = await desligarConector({ nome });
      if (r?.vista) lista = r.vista;
      recado = { ...recado, [nome]: "Desliguei. A chave e o teto continuam guardados." };
      aberto = null;
    } catch (e) {
      erro = { ...erro, [nome]: String(e?.message || e) };
    } finally {
      ocupado = "";
    }
  }

  /* o extrato é buscado só quando alguém abre o `<details>`: ele lê o livro
     inteiro do mês, e fazer isso por conector em toda pintura da tela seria
     pagar uma leitura de disco por cartão para mostrar nada */
  async function verExtrato(nome) {
    if (extratos[nome]) return;
    extratos = { ...extratos, [nome]: { lendo: true } };
    try {
      extratos = { ...extratos, [nome]: await pedirExtrato(nome) };
    } catch (e) {
      extratos = { ...extratos, [nome]: { falha: String(e?.message || e) } };
    }
  }

  const quando = (iso) => String(iso || "").slice(0, 16).replace("T", " ");
</script>

<header class="c-secao" style="gap:var(--s1)">
  <h1 class="c-h2">Integrações</h1>
  <p class="c-corpo">
    Os serviços que o assistente pode usar no seu lugar. Quem liga, cola a
    chave e diz quanto cada um pode gastar é você, aqui nesta tela — o
    assistente nunca faz isso sozinho.
  </p>
</header>

{#if semConectores}
  <p class="c-corpo">Este pack não traz conectores. Nada a ligar por aqui.</p>
{:else if falha}
  <p class="c-nota p-falta">{falha}</p>
{:else if !lista}
  <p class="c-corpo">lendo…</p>
{:else}
  {#snippet cartao(c)}
    {@const meu = aberto?.nome === c.nome ? aberto.qual : ""}
    {@const confirma = pendente?.nome === c.nome ? pendente : null}
    <section class="c-caixa p-conector">
      <div class="p-conector-topo">
        <h3 class="p-conector-nome">{nomeDe(c)}</h3>
        <span class="c-etiqueta {c.estado === 'ligado' ? 'p-etiqueta-viva'
          : c.estado === 'desligado' ? 'c-etiqueta-cinza' : 'c-etiqueta-ambar'}"
          >{PALAVRA[c.estado] || c.estado}</span>
      </div>

      <p class="c-corpo" style="overflow-wrap:anywhere">{c.para_voce || c.oque}</p>

      {#if custoEmPalavra(c)}
        <p class="c-nota">{custoEmPalavra(c)}</p>
      {/if}

      {#if c.chave}
        <p class="c-nota">
          {c.chave.guardada
            ? "Há uma chave guardada neste computador."
            : "Falta a chave deste serviço."}
        </p>
      {/if}

      {#if c.tipo === "mcp"}
        <!-- ── O TIPO `mcp` NÃO TEM CHAVE NEM TETO ──────────────────────
             Quem faz as chamadas dele é o próprio Claude, com as ferramentas
             do servidor dele — não há chave para guardar aqui nem gasto para
             limitar. O que existe é o guia (o que a pessoa faz para ligar) e
             a ferramenta que PROVA que ligou. -->
        <!-- a frase para DIZER vem antes do guia: o guia foi escrito para o
             assistente seguir, e quem o segue com a pessoa é ele -->
        <div class="p-guia">
          <span class="c-selo">Como ligar</span>
          <p class="c-corpo">Diga ao Claude, na conversa:
            <b>“me ajuda a ligar: {nomeDe(c)}”</b>. Ele mostra o passo a passo
            e confere se ficou funcionando.</p>
          {#if c.guia}
            <details>
              <summary class="c-nota" style="cursor:pointer">ver o passo a passo que ele segue</summary>
              <p class="c-nota" style="margin-top:var(--s1);overflow-wrap:anywhere">{c.guia}</p>
            </details>
          {/if}
        </div>
      {/if}

      <!-- ── OS BOTÕES ────────────────────────────────────────────────── -->
      <div class="p-acoes">
        <!-- ── SÓ TEM INTERRUPTOR QUEM NASCE DESLIGADO ──────────────────
             Quem não tem aviso nem chave já está de pé por desenho (uma
             fonte pública de graça, por exemplo): um botão "Desligar" ali
             gravaria um estado que o miolo nunca lê, e a pessoa apertaria e
             não veria nada mudar. É o mesmo `nasceDesligado` da CLI, lido
             pelos dois campos que a vista traz. -->
        {#if c.aviso || c.chave}
          {#if c.estado === "desligado"}
            <button type="button" class="c-acao c-acao-cheia" disabled={ocupado === c.nome}
              onclick={acao(c.nome, "ligar", {})}
              >{c.tipo === "mcp" ? "Autorizar o uso" : "Ligar"}</button>
          {:else}
            <button type="button" class="c-acao" disabled={ocupado === c.nome}
              onclick={() => desligar(c.nome)}>Desligar</button>
          {/if}
        {/if}

        {#if c.chave}
          <button type="button" class="c-acao" aria-expanded={meu === "chave"}
            onclick={() => abrir(c.nome, "chave")}
            >{c.chave.guardada ? "Trocar a chave" : "Colar a chave"}</button>
        {/if}

        {#if c.pago}
          <button type="button" class="c-acao" aria-expanded={meu === "teto"}
            onclick={() => abrir(c.nome, "teto")}>Limite de gasto</button>
        {/if}

        {#if c.teste}
          <button type="button" class="c-acao" disabled={ocupado === c.nome}
            onclick={acao(c.nome, "testar", {})}>Testar</button>
        {/if}
      </div>

      <!-- ── COLAR A CHAVE ────────────────────────────────────────────── -->
      {#if meu === "chave"}
        <!-- ── É UM `<form>`, E POR DUAS RAZÕES ─────────────────────────
             Enter guarda, que é o gesto de quem acabou de colar; e o Chrome
             para de avisar no console que há um campo de senha fora de
             formulário. Ele nunca submete de verdade — a CSP do painel tem
             `form-action 'none'`, e o `preventDefault` chega antes. -->
        <form class="p-gaveta" onsubmit={(e) => {
          e.preventDefault();
          if (chaveDigitada.trim()) acao(c.nome, "chave", { chave: chaveDigitada })();
        }}>
          <label class="p-campo-linha" style="width:100%">
            <span class="c-selo">{c.chave.nome}</span>
            <!-- `type=password` porque alguém vai colar isto com outra pessoa
                 olhando a tela, e porque a captura de tela de um relato de
                 defeito é o jeito mais comum de um segredo vazar -->
            <input class="p-campo" type="password" autocomplete="off"
              spellcheck="false" bind:value={chaveDigitada}
              placeholder="cole aqui" />
          </label>
          <p class="c-nota">A chave fica só neste computador, e o assistente
            nunca a lê.</p>
          {#if c.chave.passos.length}
            <div>
              <span class="c-selo">onde pegar</span>
              <ol class="p-passos">
                {#each c.chave.passos as passo, i (i)}<li>{passo}</li>{/each}
              </ol>
            </div>
          {/if}
          <div class="p-acoes">
            <button type="submit" class="c-acao c-acao-cheia"
              disabled={ocupado === c.nome || !chaveDigitada.trim()}>Guardar</button>
            {#if c.chave.guardada}
              <!-- apagar não pede confirmação, pela mesma razão de desligar
                   não pedir: ele tira, e o que tem cerimônia é o que põe -->
              <button type="button" class="c-acao c-acao-ambar" disabled={ocupado === c.nome}
                onclick={acao(c.nome, "chave", { chave: "" })}>Apagar a que está guardada</button>
            {/if}
            <button type="button" class="c-acao" onclick={fechar}>Deixa</button>
          </div>
        </form>
      {/if}

      <!-- ── O TETO ───────────────────────────────────────────────────── -->
      {#if meu === "teto"}
        <div class="p-gaveta">
          <label class="p-campo-linha">
            <span class="c-selo">quanto ele pode gastar por mês, em {c.custo?.moeda}</span>
            <input class="p-campo p-campo-curto" type="number" min="0" step="0.5"
              inputmode="decimal" bind:value={tetoDigitado} />
          </label>
          <p class="c-nota">
            Acima disto ele para de começar chamada nova. Zero fecha a torneira.
            {#if c.teto_sugerido}Para começar, {dinheiro(c.teto_sugerido, c.custo?.moeda)}
              costuma bastar.{/if}
          </p>
          <div class="p-acoes">
            <button type="button" class="c-acao c-acao-cheia" disabled={ocupado === c.nome}
              onclick={acao(c.nome, "teto", { teto: tetoDigitado })}>Guardar</button>
            <button type="button" class="c-acao" onclick={fechar}>Deixa</button>
          </div>
        </div>
      {/if}

      <!-- ── O SEGUNDO CLIQUE ─────────────────────────────────────────── -->
      {#if confirma}
        <div class="c-caixa c-caixa-ambar p-gaveta">
          {#if confirma.oque}
            <p class="c-chamada" style="margin:0">{confirma.oque}</p>
          {/if}
          {#if confirma.aviso}
            <p class="c-corpo" style="overflow-wrap:anywhere">{confirma.aviso}</p>
          {/if}
          {#if confirma.estimativa !== undefined}
            <p class="c-corpo">
              Deve custar {dinheiro(confirma.estimativa, confirma.moeda)}, e sobram
              {dinheiro(confirma.resta, confirma.moeda)} do teto deste mês.
            </p>
          {/if}
          <div class="p-acoes">
            <button type="button" class="c-acao c-acao-cheia" disabled={ocupado === c.nome}
              onclick={confirmar}>Confirmo</button>
            <button type="button" class="c-acao" onclick={() => { pendente = null; }}
              >Agora não</button>
          </div>
        </div>
      {/if}

      {#if recado[c.nome]}<p class="c-nota c-selo-verd">{recado[c.nome]}</p>{/if}
      {#if erro[c.nome]}<p class="c-nota p-falta">{erro[c.nome]}</p>{/if}

      <!-- ── O EXTRATO, RECOLHIDO ─────────────────────────────────────── -->
      {#if c.pago}
        <details ontoggle={(e) => { if (e.currentTarget.open) verExtrato(c.nome); }}>
          <summary class="c-nota" style="cursor:pointer">o que foi gasto neste mês</summary>
          {#if extratos[c.nome]?.lendo}
            <p class="c-nota" style="margin-top:var(--s2)">lendo…</p>
          {:else if extratos[c.nome]?.falha}
            <p class="c-nota p-falta" style="margin-top:var(--s2)">{extratos[c.nome].falha}</p>
          {:else if extratos[c.nome]}
            {@const e = extratos[c.nome]}
            {#if !e.pagas?.length}
              <p class="c-nota" style="margin-top:var(--s2)">Nenhuma chamada paga neste mês.</p>
            {:else}
              <ul class="p-extrato">
                {#each e.pagas as l, i (i)}
                  <li>
                    <span>{quando(l.em)}</span>
                    <span>{l.operacao}</span>
                    <span>{dinheiro(l.custo, l.moeda)}{l.medido ? "" : " (estimado)"}{l.ok ? "" : " · falhou"}</span>
                  </li>
                {/each}
              </ul>
            {/if}
          {/if}
        </details>
      {/if}
    </section>
  {/snippet}

  {#if sessoes?.sites?.length}
    <section class="c-secao" style="gap:var(--s2)" aria-label="onde o assistente entra com a sua conta">
      <div>
        <h2 class="c-h3">Onde o assistente entra com a sua conta</h2>
        <p class="c-nota">Você entra uma vez; todo assistente que abrir o navegador usa esse login.
          Senha e código de verificação são sempre seus.</p>
      </div>
      <div class="c-secao" style="gap:var(--s1)">
        {#each sessoes.sites as s (s.nome)}
          <div class="c-caixa p-sessao" data-estado={s.janela || s.estado}>
            <div>
              <b>{s.rotulo}</b>
              <span class="c-nota">{fraseDaSessao(s)}</span>
              {#if s.aviso && !s.janela}<span class="c-nota p-falta">{s.aviso}</span>{/if}
            </div>
            <div class="p-acoes">
              {#if s.janela}
                <button type="button" class="c-acao c-acao-cheia" disabled={naSessao === s.nome || s.janela === "lendo"}
                  onclick={() => sessao(s.nome, "concluir")}>Já entrei</button>
              {:else}
                <button type="button" class={s.estado === "logada" ? "c-acao" : "c-acao c-acao-cheia"}
                  disabled={naSessao === s.nome} onclick={() => sessao(s.nome, "entrar")}
                  >{s.estado === "logada" ? "Entrar de novo" : "Entrar"}</button>
                {#if s.estado !== "sem-sessao"}
                  <button type="button" class="c-acao" disabled={naSessao === s.nome}
                    onclick={() => sessao(s.nome, "sair")}>Sair</button>
                {/if}
              {/if}
            </div>
          </div>
        {/each}
      </div>
      {#if recadoDaSessao}<p class="c-nota p-falta">{recadoDaSessao}</p>{/if}
      {#if sessoes.agentes_usam === false}
        <div class="c-caixa c-caixa-ambar">
          <p class="c-corpo" style="margin:0">O navegador do assistente ainda não usa estas sessões:
            ele abre sem login. Diga ao Claude, na conversa:
            <b>“me ajuda a ligar as sessões do navegador”</b>.</p>
          <details>
            <summary class="c-nota" style="cursor:pointer">ver o que ele faz</summary>
            <p class="c-nota" style="overflow-wrap:anywhere">Troca a configuração do Playwright para abrir
              cada navegador com <code>--isolated --storage-state "{sessoes.arquivo}"</code>.</p>
          </details>
        </div>
      {/if}
      <p class="c-nota">O que o assistente faz nesses sites, fez a sua conta. O LinkedIn restringe
        contas que usam automação em volume: o assistente lê, e para antes de qualquer botão que envie.</p>
    </section>
  {/if}

  {#each grupos as g (g.id)}
    <section class="c-secao" style="gap:var(--s2)">
      <div>
        <h2 class="c-h3">{g.titulo} <span class="p-conta-titulo">{g.itens.length}</span></h2>
        <p class="c-nota">{g.linha}</p>
      </div>
      <!-- os que já funcionam e não pedem nada vão lado a lado: são para
           conferir de relance, e não para ler um por um -->
      <div class={g.id === "prontos" ? "p-conectores-grade" : "c-secao"} style="gap:var(--s2)">
        {#each g.itens as c (c.nome)}
          {@render cartao(c)}
        {/each}
      </div>
    </section>
  {/each}

  <p class="c-nota">
    O assistente nunca liga um serviço, nunca guarda uma chave e nunca muda um
    limite de gasto. Ele só pergunta o que está ligado e usa o que estiver.
  </p>
{/if}
