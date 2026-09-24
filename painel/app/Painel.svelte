<script>
  /**
   * A CASCA DO PAINEL — a entrada, o laço, a navegação e a barra.
   *
   * Ela faz quatro coisas e nenhuma delas é desenhar conteúdo: troca a chave
   * por cookie, mantém o laço que pergunta ao servidor o que mostrar, escolhe
   * a tela pela rota, e diz em que estado a conversa está.
   *
   * ── OS TRÊS ESTADOS QUE A PESSOA PRECISA DISTINGUIR ──────────────────
   * Uma tela parada é ambígua, e cada leitura possível dela leva a uma ação
   * diferente de quem está olhando:
   *
   *   esperando você    há botões · a bola de vez é sua
   *   mandei            você clicou · o agente está trabalhando
   *   sem contato       o servidor não responde · aqui tem defeito
   *
   * Sem os três nomeados na barra, "o agente está pensando" e "isto travou"
   * têm a mesma aparência — e a segunda leitura é a que faz alguém fechar a
   * aba no meio de uma tarefa.
   *
   * ── A CASA E A TAREFA, E QUAL DAS DUAS MANDA ─────────────────────────
   * Com base registrada, o painel tem CASA: início, pastas, arquivos, e a
   * tarefa como mais uma rota. Sem base, ele é o que sempre foi — a tela de
   * tarefa, sozinha, sem menu.
   *
   * A tarefa não rouba a tela quando chega: aparece um AVISO preso ao topo,
   * e quem vai para lá é a pessoa. Trocar a tela debaixo de quem está lendo
   * um arquivo é a mesma classe de erro que fazer um painel que grava — o
   * painel decidindo. O que ele faz é não deixar passar despercebido, porque
   * o custo de não ver é o agente pendurado até o teto do `painel_esperar`.
   *
   * Depois de responder, a página VOLTA para onde estava. O atraso de um
   * segundo é para a linha "mandei" ser lida antes: voltar no mesmo quadro
   * faz o clique parecer não ter acontecido.
   */
  import { entrar, aguardarDocumento, enviarIntencao, pedirEstado,
    pedirMapa, pedirArquivo, pedirFila, marcarNaFila, anotarNaFila, mandarFila, tirarResposta, pedirAcoes,
    pedirExecucao, lancarAssistente, pararAssistente, mexerNaFilaDeExecucao, pedirFichas } from "./ponte.js";
  import { lerRota, indicePorId, documentosPorId, idsDaLinha, agruparMenu, nomeDeGente, paraInicio, paraTarefa,
    paraPasta, paraArquivo, paraConectores, paraSobre, paraFunil, TODAS, proximoDaLinha, ocupadosDe, partirId } from "./rota.js";
  import { setContext } from "svelte";
  import Tarefa from "./Tarefa.svelte";
  import Inicio from "./casa/Inicio.svelte";
  import Pasta from "./casa/Pasta.svelte";
  import Arquivo from "./casa/Arquivo.svelte";
  import Conectores from "./casa/Conectores.svelte";
  import Sobre from "./casa/Sobre.svelte";
  import Fila from "./casa/Fila.svelte";
  import Execucao from "./casa/Execucao.svelte";
  import Funil from "./casa/Funil.svelte";
  import Documentos from "./casa/Documentos.svelte";
  import Pessoas from "./casa/Pessoas.svelte";

  /* ── A ENTRADA ────────────────────────────────────────────────────────
     `entrando` enquanto a troca não voltou, `sem-chave` quando o servidor
     recusa. A tela de "falta a chave" deixou de poder ser decidida na hora
     de montar: com o cookie, uma URL SEM `#` é o caso normal — e a única
     forma de saber se ele vale é perguntando. */
  let acesso = $state("entrando");
  let doc = $state(null);
  let erro = $state("");
  let mandado = $state(false);
  let recusa = $state("");

  let rota = $state(lerRota());
  let mapa = $state(null);
  let estado = $state({ agente: true, esperando: false, base: false, conectores: false });
  /* um contador, e não um gesto: as telas o LEEM num `$effect`, então mudar
     o número é o que as faz reler o disco. Uma função de recarga por tela
     obrigaria a casca a saber qual está montada. */
  let recarga = $state(0);
  let voltarPara = $state("");

  /* o dono de cada id, e os documentos que carregam o id de outro (D239) */
  const indice = $derived(indicePorId(mapa?.arvore, pastasDoPack));
  const documentos = $derived(documentosPorId(mapa?.arvore, indice));

  /* o menu em grupos, e o agrupamento é mecânico — ver `agruparMenu` (D231) */
  const temFunil = $derived((mapa?.arvore || []).some((i) => i.tipo === "arquivo" && i.nome === "funil.md"));
  const menu = $derived(agruparMenu(mapa, { itens: pastasDoPack?.item || "", funil: temFunil }));
  /* a pasta dos itens É o funil (D245): o endereço velho da pasta cai nele */
  const pastaEhFunil = $derived(rota.tela === "pasta" && temFunil && rota.nome === pastasDoPack?.item);
  const nomeDosItens = $derived(pastasDoPack?.item ? nomeDeGente(pastasDoPack.item) : "Funil");
  /* a vista `lista` que o agente manda mostra a ficha do item quando o id tem
     arquivo (D242) — ela não recebe a casa por prop, porque a tarefa também
     existe sem base */
  setContext("casa", { get indice() { return indice; }, get destaque() { return destaque; },
    get resumo() { return resumo; }, get documentos() { return documentos; },
    get agente() { return estado.agente; }, get esperando() { return estado.esperando; },
    get completar() { return completar; }, get rotulos() { return rotulos; } });
  /* a gaveta do telefone. Fecha a cada troca de rota: menu que fica aberto
     por cima da tela que a pessoa acabou de escolher é um clique a mais. */
  let gaveta = $state(false);
  /* ── O FUNIL E A FILA MORAM NA CASCA (D232) ───────────────────────────
     Três telas precisam saber em que etapa cada item está — o início, a
     lista de uma pasta e o arquivo —, e as três mostram a mesma fila. Uma
     leitura aqui, e não uma por tela: três cópias da fila divergiriam no
     primeiro clique. */
  let funil = $state(null);
  let decisoes = $state([]);
  /* as respostas tardias (D238): telas respondidas sem ninguém esperando */
  let respostas = $state([]);
  let recusaDaFila = $state("");
  const andamento = $derived((() => {
    const etapas = (funil?.secoes || []).map((s) => s.titulo);
    const de = new Map();
    /* e o `· próximo:` de cada linha — é por ele que o agente aponta o
       destaque de um item (D235) */
    const proximo = new Map();
    for (const s of funil?.secoes || []) {
      for (const i of s.itens || []) {
        const id = i.tipo === "linha" ? idsDaLinha(i.texto, indice)[0] : "";
        if (id && !de.has(id)) {
          de.set(id, s.titulo);
          const p = proximoDaLinha(i.texto);
          if (p) proximo.set(id, p);
        }
      }
    }
    return { etapas, de, proximo };
  })());

  /* ── SÓ A ÚLTIMA RESPOSTA VALE ────────────────────────────────────────
     O motivo sai no `blur` do campo, e o clique em Desfazer vem logo atrás:
     duas escritas em voo, e a resposta da primeira pode chegar DEPOIS da
     segunda — a tela voltava a mostrar a decisão desfeita (medido na prova
     de tela em 22/09, de vez em quando). O servidor grava em série; aqui só
     a resposta do último pedido escreve na tela. */
  let vezDaFila = 0;
  async function escreverNaFila(pedido, mandar) {
    recusaDaFila = "";
    const minha = ++vezDaFila;
    try {
      const r = await mandar(pedido);
      if (minha === vezDaFila) {
        decisoes = r?.decisoes || decisoes;
        if (Array.isArray(r?.respostas)) respostas = r.respostas;
      }
    } catch (e) { recusaDaFila = String(e?.message || e); }
  }
  const decidir = (pedido) => escreverNaFila(pedido, marcarNaFila);
  const anotar = (pedido) => escreverNaFila(pedido, anotarNaFila);
  const dispensar = (em) => escreverNaFila(em, tirarResposta);

  /* ── CHAMAR O ASSISTENTE (D232) ───────────────────────────────────────
     O estado da execução vem no `/estado`, que o laço relê a cada volta — e,
     enquanto há uma rodando, de três em três segundos: 25 s de atraso para
     saber que ele terminou é tempo de a pessoa achar que travou. */
  let acoes = $state([]);
  let pastasDoPack = $state({});
  let comeco = $state([]);
  let proximos = $state({});
  /* os campos que respondem "cabe para mim?" — grandes, abaixo do título (D240) */
  let destaque = $state([]);
  /* o texto dos botões, as seções do baralho e os descartes de um clique (D242) */
  let rotulos = $state({});
  let resumo = $state([]);
  let motivos = $state([]);
  /* a skill que procura o que falta num item (D245) */
  let completar = $state("");
  /* pasta da base → modelo de documento (D270): a prévia em PDF */
  let documentosDoPack = $state({});
  /* ── A TABELA E A ORDEM (D274) ─────────────────────────────────────────
     As fichas são os cabeçalhos da pasta dos itens, relidos a cada volta. A
     ordem é UMA para a tabela, a lista do leitor e o funil do início, e fica
     no navegador — é conforto de quem olha, e não estado da base. */
  let fichas = $state(null);
  let ordens = $state({});
  /* os degraus lidos da ficha dentro de uma etapa (D266) */
  let fases = $state({});
  let umItem = $state("");
  const CHAVE_DA_ORDEM = "kapstan.painel.ordem";
  function lerOrdem() {
    try {
      const o = JSON.parse(localStorage.getItem(CHAVE_DA_ORDEM) || "null");
      if (o && typeof o.chave === "string") return { chave: o.chave, desc: Boolean(o.desc) };
    } catch { /* sem armazenamento */ }
    return { chave: "", desc: false };
  }
  let ordem = $state(lerOrdem());
  /* a mesma chave de novo inverte; outra chave entra no sentido que ela pede */
  function ordenar(chave, desc = false) {
    ordem = ordem.chave === chave && chave ? { chave, desc: !ordem.desc } : { chave, desc };
    try { localStorage.setItem(CHAVE_DA_ORDEM, JSON.stringify(ordem)); } catch { /* sem armazenamento */ }
  }
  /* a ordem dos blocos do início, e o que a base ajustou por cima do molde (D244) */
  let inicio = $state([]);
  let ajuste = $state({ daBase: [], avisos: [] });
  /* "Sua busca", "Sua carteira": a base é feminina por contrato (D236) */
  let baseDoPack = $state("");
  let execucao = $state(null);
  let confirmando = $state(null);
  let recusaDoLancar = $state("");
  /* com uma rodando, o botão continua: o pedido entra na fila (D271) */
  const podeChamar = $derived(!!execucao?.disponivel);
  /* o que está na fila ou rodando, por item: o passo não se oferece de novo (D257) */
  const ocupados = $derived(ocupadosDe(execucao));
  /* o apelido do item pelo id, do cabeçalho do arquivo dele */
  const nomeDoItem = (id) => {
    const t = fichas?.get(indice.get(id) || "")?.titulo || "";
    return t ? partirId(t).nome : "";
  };

  async function chamar(o, item = "") {
    recusaDoLancar = "";
    try {
      const r = await lancarAssistente({ o, item });
      if (r?.precisa_confirmar) confirmando = { o, item, ...r };
    } catch (e) { recusaDoLancar = String(e?.message || e); }
  }
  /* ── O AVISO DE QUE TERMINOU (D234) ──────────────────────────────────
     Ninguém fica sete minutos olhando uma aba. Com ela escondida, o título
     muda e — se a pessoa deixou — o navegador avisa. A permissão é pedida no
     clique de "Chamar agora", que é o único momento em que ela faz sentido. */
  let tituloAntes = "";
  function avisarFim(u) {
    if (!u || !document.hidden) return;
    const titulo = u.ok ? "O assistente terminou" : "O assistente parou";
    tituloAntes = tituloAntes || document.title;
    document.title = `● ${titulo} — ${mapa?.titulo || "painel"}`;
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(titulo, { body: u.nome || "", tag: "kapstan-execucao" });
      }
    } catch { /* sem notificação, o título basta */ }
  }
  $effect(() => {
    const ouvir = () => {
      if (!document.hidden && tituloAntes) { document.title = tituloAntes; tituloAntes = ""; }
    };
    addEventListener("visibilitychange", ouvir);
    return () => removeEventListener("visibilitychange", ouvir);
  });

  async function confirmarChamada() {
    const c = confirmando;
    confirmando = null;
    if (!c) return;
    try {
      if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    } catch { /* navegador sem a API */ }
    try {
      await lancarAssistente({ o: c.o, item: c.item, confirmo: true });
      execucao = await pedirExecucao();
    } catch (e) { recusaDoLancar = String(e?.message || e); }
  }
  async function mexerNaFila(corpo) {
    recusaDoLancar = "";
    try { await mexerNaFilaDeExecucao(corpo); execucao = await pedirExecucao(); }
    catch (e) { recusaDoLancar = String(e?.message || e); }
  }
  async function pararChamada() {
    try { await pararAssistente(); execucao = await pedirExecucao(); } catch { /* o laço conta */ }
  }
  $effect(() => {
    if (!execucao?.rodando) return;
    const r = setInterval(async () => {
      try {
        const novo = await pedirExecucao();
        const terminou = !novo?.rodando;
        /* da fila, o próximo começa no mesmo instante: o que muda é o `desde` */
        const andou = novo?.rodando?.desde !== execucao?.rodando?.desde;
        execucao = novo;
        if (terminou) avisarFim(novo?.ultima);
        if (terminou || andou) recarregarMapa();
      } catch { /* o laço principal conta o erro */ }
    }, 3000);
    return () => clearInterval(r);
  });

  /* ── A PÁGINA SABE QUANDO ENVELHECEU ──────────────────────────────────
     O servidor serve o `painel.html` do disco, e diz no `/estado` de quando
     ele é. A aba guarda o valor com que abriu: divergiu, há tela nova — e ela
     OFERECE atualizar, em vez de recarregar sozinha, porque recarregar
     debaixo de quem está marcando uma lista apaga as marcas. */
  let paginaAoAbrir = 0;
  const haTelaNova = $derived.by(() => {
    const agora = Number(estado?.pagina) || 0;
    if (!paginaAoAbrir) { paginaAoAbrir = agora; return false; }
    return agora !== paginaAoAbrir;
  });

  /* ── A ÚLTIMA VISITA (D234) ───────────────────────────────────────────
     É do NAVEGADOR, por base, no `localStorage`: o painel não escreve estado
     de quem olha, e perder a data só esconde o resumo. Lida uma vez ao abrir
     a base; gravada quando a aba some — trocar de aba não apaga o resumo que
     está na tela, e a próxima abertura conta a partir dali. */
  let visitaAnterior = $state(0);
  const raizAtual = $derived(mapa?.raiz || "");
  $effect(() => {
    const raiz = raizAtual;
    if (!raiz) return;
    const chave = "kapstan-painel-visto:" + raiz;
    try { visitaAnterior = Number(localStorage.getItem(chave)) || 0; } catch { visitaAnterior = 0; }
    const marcar = () => { try { localStorage.setItem(chave, String(Date.now())); } catch { /* sem armazenamento */ } };
    const ouvir = () => { if (document.hidden) marcar(); };
    if (!visitaAnterior) marcar();
    addEventListener("visibilitychange", ouvir);
    addEventListener("pagehide", marcar);
    return () => { removeEventListener("visibilitychange", ouvir); removeEventListener("pagehide", marcar); };
  });

  const temCasa = $derived(!!mapa);
  /* a tarefa que traz a lista e detalhe (D244) pede a largura do funil */
  const tarefaLarga = $derived([doc?.dados, ...(doc?.blocos || []).map((b) => b?.dados)]
    .some((d) => d && Array.isArray(d.decisoes) && (d.modo === "leitor" || d.um_por_vez)));
  const temTarefa = $derived(!!doc && doc.vista !== "nada");
  const esperaResposta = $derived(temTarefa && !!doc?.acoes?.length && !mandado);
  /* há botões, mas há alguém pendurado? É o `esperando` da sessão que diz —
     a tela dizia "está esperando você" com base nos botões, e mentia (D238) */
  const agenteEsperando = $derived(esperaResposta && !!estado.esperando);
  let guardada = $state(false);

  async function recarregarMapa() {
    try {
      const novo = await pedirEstado();
      estado = novo;
      execucao = novo?.execucao || null;
      acesso = "dentro";
      mapa = novo?.base ? await pedirMapa() : null;
      /* relido a cada volta, e não uma vez: o ajuste da base (D244) muda
         quando o agente escreve o painel.json dela */
      if (mapa) {
        const lidas = await pedirAcoes().catch(() => null);
        acoes = lidas?.grupos || [];
        pastasDoPack = lidas?.pastas || {};
        comeco = lidas?.comeco || [];
        proximos = lidas?.proximo || {};
        destaque = lidas?.destaque || [];
        rotulos = lidas?.rotulos || {};
        resumo = lidas?.resumo || [];
        motivos = lidas?.motivos || [];
        completar = lidas?.completar || "";
        documentosDoPack = lidas?.documentos || {};
        ordens = lidas?.ordens || {};
        fases = lidas?.fases || {};
        umItem = lidas?.item || "";
        baseDoPack = lidas?.base || "";
        inicio = lidas?.inicio || [];
        ajuste = { daBase: lidas?.daBase || [], avisos: lidas?.avisos || [] };
      }
      if (mapa) {
        const temFunil = (mapa.arvore || []).some((i) => i.tipo === "arquivo" && i.nome === "funil.md");
        let daFila, lidas;
        [funil, daFila, lidas] = await Promise.all([
          temFunil ? pedirArquivo("funil.md").catch(() => null) : null,
          pedirFila().catch(() => null),
          pastasDoPack?.item ? pedirFichas(pastasDoPack.item).catch(() => null) : null,
        ]);
        fichas = lidas ? new Map(lidas.fichas.map((x) => [x.caminho, x])) : null;
        decisoes = daFila?.decisoes || [];
        respostas = daFila?.respostas || [];
      }
      recarga++;
    } catch (e) {
      if (e?.status === 401) acesso = "sem-chave";
      else erro = String(e?.message || e);
    }
  }

  /* ── O LAÇO ───────────────────────────────────────────────────────────
     Uma execução por vida da página, e por isso a guarda: `$effect` reexecuta
     quando qualquer coisa lida dentro dele muda, e um segundo laço faria a
     tela piscar entre duas respostas pendentes.

     `desde = -1` na primeira volta é deliberado: o servidor compara com a
     versão dele (que nasce em 0) e devolve NA HORA, sem pendurar. Sem isso a
     primeira pintura esperaria até o agente mandar algo novo — e a página
     abriria em branco por 25 segundos. */
  let ligado = false;
  $effect(() => {
    if (ligado) return;
    ligado = true;
    (async () => {
      /* a troca da chave pelo cookie vem antes de tudo: sem ela, o primeiro
         pedido de uma página aberta com `#<chave>` funcionaria pelo
         cabeçalho e o endereço curto nunca passaria a valer */
      try { await entrar(); } catch { /* sem chave no `#`: ou já há cookie, ou o 401 abaixo conta */ }
      rota = lerRota();
      await recarregarMapa();
      let desde = -1;
      for (;;) {
        try {
          const novo = await aguardarDocumento(desde);
          erro = "";
          if (novo) {
            doc = novo;
            desde = novo.versao;
            recusa = "";
            mandado = false;
          }
          /* o estado — se há agente, se ele está pendurado — muda sem a
             versão mudar, então ele é relido a cada volta do poll. No pior
             caso, uma vez a cada 25 segundos. */
          try {
            estado = await pedirEstado();
            execucao = estado.execucao || execucao;
            /* a fila encolheu sem clique daqui: o assistente gravou, e o que
               está no disco mudou — relê tudo */
            if ((estado.fila ?? decisoes.length) !== decisoes.length
              || (estado.respostas ?? respostas.length) !== respostas.length) recarregarMapa();
          } catch { /* o laço acima já conta o erro */ }
        } catch (e) {
          if (e?.status === 401) { acesso = "sem-chave"; return; }
          erro = String(e?.message || e);
          /* dois segundos e tenta de novo. Repetir na hora faria um laço
             quente contra um servidor que caiu, e o navegador o mataria. */
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    })();
  });

  /* a rota mora no `#`, e quem a muda é o navegador — os links são `<a>` de
     verdade, então voltar e avançar funcionam sem uma linha de código */
  $effect(() => {
    const ouvir = () => {
      /* ── CHAVE COLADA NA ABA QUE JÁ ESTÁ ABERTA ────────────────────
         Medido: com a tela de "falta a chave" na frente, colar o endereço
         INTEIRO na mesma aba muda só o `#` — e o navegador NÃO recarrega. A
         chave é lida uma vez, quando `ponte.js` é carregado, então a página
         ficava parada no erro com a chave certa na barra de endereços. É o
         caminho de recuperação mais óbvio que existe, e era o único que não
         funcionava. */
      if (/^#[A-Za-z0-9_-]{32,}$/.test(location.hash)) { location.reload(); return; }
      rota = lerRota();
      gaveta = false;
      /* tela nova começa do topo: trocar o `#` não rola a página sozinho */
      scrollTo(0, 0);
    };
    addEventListener("hashchange", ouvir);
    return () => removeEventListener("hashchange", ouvir);
  });

  /* Esc fecha a gaveta: é o gesto de quem abriu sem querer */
  $effect(() => {
    const ouvir = (e) => { if (e.key === "Escape") gaveta = false; };
    addEventListener("keydown", ouvir);
    return () => removeEventListener("keydown", ouvir);
  });

  /* ── A VOLTA DO FOCO ──────────────────────────────────────────────────
     A pessoa sai para o terminal, o agente grava, ela volta. Sem isto a tela
     mostraria o disco de antes da gravação — e a regra do contrato ("escreveu,
     diz onde") teria um painel dizendo o contrário. */
  $effect(() => {
    const ouvir = () => { if (acesso === "dentro") recarregarMapa(); };
    addEventListener("focus", ouvir);
    return () => removeEventListener("focus", ouvir);
  });

  async function mandar(intencao) {
    recusa = "";
    try {
      const r = await enviarIntencao(intencao);
      if (r?.aceita === false) { recusa = r.motivo || "não deu para mandar"; return; }
      mandado = true;
      guardada = !!r?.guardada;
      recarregarMapa();
      if (voltarPara) {
        const destino = voltarPara;
        voltarPara = "";
        setTimeout(() => { location.hash = destino; }, 1000);
      }
    } catch (e) {
      recusa = String(e?.message || e);
    }
  }

  /* o link para a tarefa é um `<a href>` como qualquer outro — quem navega é
     o navegador. O que esta função faz é só ANOTAR de onde se saiu, para a
     volta depois da resposta. Mexer no `location.hash` aqui navegaria duas
     vezes, e a segunda entraria no histórico. */
  function lembrarVolta() {
    if (rota.tela !== "tarefa") voltarPara = atual;
  }

  /* a rota atual escrita como link, para o `aria-current` do menu. Vem de
     `rota` e não de `location.hash`: o segundo não é reativo, e o realce
     ficaria preso na pílula em que a página abriu. */
  const atual = $derived(
    rota.tela === "pasta" ? paraPasta(rota.nome)
    : rota.tela === "arquivo" ? paraArquivo(rota.caminho)
    : rota.tela === "tarefa" ? paraTarefa
    : rota.tela === "conectores" ? paraConectores
    : rota.tela === "sobre" ? paraSobre
    : rota.tela === "funil" || pastaEhFunil ? paraFunil(TODAS)
    : paraInicio);

  /* ── O ESTADO, DITO PARA QUEM NUNCA VIU UM TERMINAL (D231) ────────────
     Os mesmos três estados do cabeçalho, mais os dois de repouso. "Só leitura
     · sem sessão" era verdade e não dizia nada: o que a pessoa precisa saber é
     de quem é a vez, e o que fazer se quiser alguma coisa. */
  const situacao = $derived(
    erro ? { tom: "falha", titulo: "Sem contato com o painel",
      linha: "Tentando de novo sozinho. Se não voltar, abra o Claude na pasta da sua " + (baseDoPack || "base") + "." }
    : execucao?.rodando && !esperaResposta ? { tom: "vivo", titulo: "O assistente está trabalhando",
      linha: execucao.rodando.nome }
    : mandado && guardada ? { tom: "calmo", titulo: "Resposta guardada",
      linha: "O assistente pega quando voltar ao painel." }
    : mandado ? { tom: "calmo", titulo: "Resposta enviada",
      linha: "O assistente está trabalhando com o que você respondeu." }
    : agenteEsperando ? { tom: "vivo", titulo: "O assistente está esperando você",
      linha: doc?.titulo || "Ele precisa de uma resposta sua para continuar." }
    : esperaResposta ? { tom: "calmo", titulo: "Uma tela sua está aberta",
      linha: "O assistente parou de esperar. O que você responder fica guardado para ele." }
    : !estado.agente ? { tom: "calmo", titulo: "Nenhuma conversa aberta",
      linha: "Dá para ler tudo. Para pedir alguma coisa, abra o Claude." }
    : { tom: "calmo", titulo: "Assistente conectado",
      linha: "Peça o que quiser na conversa com o Claude." });

  /* a trilha: onde estou, e o caminho de volta. Só até a pasta — o título do
     arquivo é o `<h1>` da própria tela, e repeti-lo aqui seria lê-lo duas vezes */
  const trilha = $derived((() => {
    menu; /* o vocabulário dos nomes é aprendido ao agrupar o menu */
    if (rota.tela === "pasta") return [{ nome: nomeDeGente(rota.nome) }];
    if (rota.tela === "funil") return [{ nome: nomeDosItens }];
    if (rota.tela === "arquivo") {
      const partes = String(rota.caminho || "").split("/");
      return partes.length > 1
        ? [{ nome: nomeDeGente(partes[0]), href: paraPasta(partes[0]) }]
        : [];
    }
    if (rota.tela === "conectores") return [{ nome: "Integrações" }];
    if (rota.tela === "sobre") return [{ nome: "Conta" }];
    if (rota.tela === "tarefa") return [{ nome: "Sua vez" }];
    return [];
  })());
</script>

{#if acesso === "entrando"}
  <div class="p-miolo"><p class="c-corpo">abrindo…</p></div>
{:else if acesso === "sem-chave"}
  <!-- ── SEM CHAVE NÃO HÁ PÁGINA ────────────────────────────────────────
       Acontece quando alguém copia o endereço sem o que vem depois do `#`,
       que é justamente a parte que alguns programas cortam ao encurtar um
       link — e também na primeira abertura num navegador que ainda não tem
       o cookie. Dizer isso é mais útil que uma tela vazia com 401 no
       console. -->
  <div class="p-miolo">
    <h1 class="c-h2">Falta a chave no endereço</h1>
    <p class="c-corpo">
      Na primeira vez, o endereço do painel termina com <code>#</code> e uma
      sequência de letras. Copie-o inteiro do terminal — sem essa parte, o
      painel abre e não mostra nada. Depois dessa primeira vez, o endereço
      curto passa a abrir sozinho.
    </p>
  </div>
{:else if !temCasa}
  <!-- ── SEM BASE, O PAINEL É SÓ A TAREFA ────────────────────────────────
       É o que ele sempre foi para quem chama `painel_mostrar` sem ter
       apontado uma base: uma coluna de leitura, e o estado em cima. Os
       conectores continuam abrindo — são da MÁQUINA, e não da base. -->
  <div class="p-topo p-topo-sempre">
    <span class="p-pulso" data-tom={situacao.tom} aria-hidden="true"></span>
    <span class="p-topo-titulo">{situacao.titulo}</span>
  </div>
  <main class="p-miolo">
    {#if erro}<p class="c-nota p-falta">{situacao.linha}</p>{/if}
    {#if rota.tela === "conectores"}
      <Conectores {recarga} />
    {:else if !temTarefa}
      <p class="c-corpo">Nada por aqui ainda. Quando o assistente tiver o que
        mostrar, aparece nesta tela.</p>
    {:else}
      {#key doc.versao}
        <Tarefa {doc} {mandado} {recusa} {mandar} />
      {/key}
    {/if}
  </main>
{:else}
  <div class="p-casca">
    <!-- ── A BARRA DO TELEFONE ───────────────────────────────────────────
         Abaixo de 900 px o menu vira gaveta, e esta barra é o que sobra à
         vista: o botão do menu, o nome da base e o ponto de estado. -->
    <div class="p-topo">
      <button type="button" class="p-topo-menu" aria-expanded={gaveta}
        aria-controls="p-lado" onclick={() => { gaveta = !gaveta; }}>
        <span aria-hidden="true">☰</span> Menu
      </button>
      <span class="p-topo-titulo">{mapa.titulo}</span>
      <span class="p-pulso" data-tom={situacao.tom} title={situacao.titulo}
        role="img" aria-label={situacao.titulo}></span>
    </div>
    {#if gaveta}
      <button type="button" class="p-veu" aria-label="fechar o menu"
        onclick={() => { gaveta = false; }}></button>
    {/if}

    <!-- ── O MENU: TRÊS LUGARES (D231) ───────────────────────────────────
         Início responde "o que eu faço agora", "Sua busca" responde "onde
         está o que eu tenho", Configurações responde "como isto está
         configurado". O que é da base sai do `INDICE.md` (D230) e o
         agrupamento é mecânico; o que é do sistema — Integrações, Conta
         — é fixo. Os nomes são os de plataforma (D236): a pessoa já os
         conhece de qualquer produto que usa. -->
    <nav id="p-lado" class="p-lado" data-aberto={gaveta ? "" : undefined} aria-label="menu">
      <a class="p-lado-marca" href={paraInicio}>{mapa.titulo}</a>

      <div class="p-lado-grupo">
        <a class="p-lado-item" href={paraInicio}
          aria-current={atual === paraInicio ? "page" : undefined}>Início</a>
        {#if temTarefa}
          <a class="p-lado-item" href={paraTarefa} onclick={lembrarVolta}
            aria-current={rota.tela === "tarefa" ? "page" : undefined}>
            Sua vez
            {#if esperaResposta}<span class="p-lado-conta p-lado-conta-viva">1</span>{/if}
          </a>
        {/if}
      </div>

      {#if menu.material.length}
        <div class="p-lado-grupo">
          <span class="p-lado-rotulo">Sua {baseDoPack || "base"}</span>
          {#each menu.material as m (m.alvo)}
            <a class="p-lado-item" href={m.href} title={m.descricao || undefined}
              aria-current={atual === m.href ? "page" : undefined}>
              {m.nome}
              {#if m.quantos !== null}<span class="p-lado-conta">{m.quantos}</span>{/if}
            </a>
          {/each}
        </div>
      {/if}

      <div class="p-lado-grupo">
        <span class="p-lado-rotulo">Configurações</span>
        {#if estado.conectores}
          <a class="p-lado-item" href={paraConectores}
            title="ligar um serviço, colar a chave dele e dizer quanto ele pode gastar"
            aria-current={rota.tela === "conectores" ? "page" : undefined}>Integrações</a>
        {/if}
        <a class="p-lado-item" href={paraSobre}
          title="quem você é, como trabalha e onde a {baseDoPack || 'base'} mora"
          aria-current={rota.tela === "sobre" ? "page" : undefined}>Conta</a>
      </div>

      <!-- ── O GUARDADO, RECOLHIDO ──────────────────────────────────────
           `_bruto` e `arquivo-morto` existem, abrem e têm de continuar
           alcançáveis — é de lá que vem a procedência. Mas não são o
           trabalho, e ao lado de "Vagas" com o mesmo peso eles viram dúvida.
           Abre sozinho quando a pessoa já está dentro de um deles. -->
      {#if menu.guardado.length}
        <details class="p-lado-grupo"
          open={menu.guardado.some((m) => atual === m.href) || undefined}>
          <summary class="p-lado-rotulo p-lado-rotulo-abre">Arquivo</summary>
          {#each menu.guardado as m (m.alvo)}
            <a class="p-lado-item" href={m.href} title={m.descricao || undefined}
              aria-current={atual === m.href ? "page" : undefined}>
              {m.nome}
              {#if m.quantos !== null}<span class="p-lado-conta">{m.quantos}</span>{/if}
            </a>
          {/each}
        </details>
      {/if}

      <!-- ── DE QUEM É A VEZ ────────────────────────────────────────────
           No pé do menu, sempre à vista no computador. É a resposta às três
           leituras de uma tela parada — ver o cabeçalho deste arquivo. -->
      <div class="p-situacao" data-tom={situacao.tom} role="status">
        <span class="p-pulso" data-tom={situacao.tom} aria-hidden="true"></span>
        <div>
          <b>{situacao.titulo}</b>
          <span>{situacao.linha}</span>
          {#if esperaResposta && rota.tela !== "tarefa"}
            <a href={paraTarefa} onclick={lembrarVolta}>Responder agora →</a>
          {/if}
        </div>
      </div>
    </nav>

    <div class="p-palco">
      <!-- ── O AVISO ─────────────────────────────────────────────────────
           Só fora da tarefa e do início: na tarefa apontaria para a tela que
           já está na frente, e o início abre com a mesma frase em destaque. No computador o pé do menu diz o mesmo; o aviso fica
           porque no telefone o menu está fechado. -->
      {#if esperaResposta && !["tarefa", "inicio"].includes(rota.tela)}
        <div class="p-aviso">
          <span>{agenteEsperando ? "O assistente está esperando você" : "Uma tela sua está aberta"}{doc?.titulo ? ": " + doc.titulo : "."}</span>
          <a href={paraTarefa} onclick={lembrarVolta}>Responder →</a>
        </div>
      {/if}

      <!-- a coluna larga é da lista de uma pasta e do início. A tarefa, os
           conectores e um arquivo são leitura e campo: 72ch é a medida deles. -->
      <main class="p-miolo"
        class:p-miolo-larga={["inicio", "pasta"].includes(rota.tela)}
        class:p-miolo-inteira={rota.tela === "funil" || (rota.tela === "tarefa" && tarefaLarga)}>
        {#if trilha.length}
          <nav class="p-trilha" aria-label="onde você está">
            <a href={paraInicio}>Início</a>
            {#each trilha as t, i (i)}
              <span aria-hidden="true">›</span>
              {#if t.href}<a href={t.href}>{t.nome}</a>{:else}<span>{t.nome}</span>{/if}
            {/each}
          </nav>
        {/if}

        {#if erro}<p class="c-nota p-falta">{situacao.titulo}. {situacao.linha}</p>{/if}

        {#if haTelaNova}
          <div class="p-execucao">
            <div><b>O painel foi atualizado</b>
              <span>Há uma versão nova desta tela. Atualize quando terminar o que está fazendo.</span></div>
            <button type="button" class="c-acao c-acao-cheia" onclick={() => location.reload()}>Atualizar</button>
          </div>
        {/if}

        <Execucao {execucao} {confirmando} {nomeDoItem} recusa={recusaDoLancar}
          confirmar={confirmarChamada} desistir={() => { confirmando = null; }}
          parar={pararChamada} mexer={mexerNaFila} />

        {#if rota.tela === "conectores"}
          <Conectores {recarga} />
        {:else if rota.tela === "sobre"}
          <Sobre {mapa} conectores={estado.conectores} sempre={estado.sempre} {ajuste} />
        {:else if rota.tela === "tarefa"}
          {#if !temTarefa}
            <p class="c-corpo">O assistente não pediu nada agora. Quando ele
              precisar de uma resposta sua, ela aparece aqui.
              <a href={paraInicio}>Voltar ao início</a>.</p>
          {:else}
            <!-- documento novo é um `Tarefa` novo: o `#key` é o que impede o
                 texto aberto para correção de uma tela atravessar para a
                 seguinte, com o rascunho da anterior dentro -->
            {#key doc.versao}
              <Tarefa {doc} {mandado} {guardada} {recusa} {mandar} esperando={!!estado.esperando} />
            {/key}
          {/if}
        {:else if rota.tela === "funil" || pastaEhFunil}
          {#key rota.etapa}
            <Funil etapa={rota.etapa || TODAS} id={rota.id || ""} nome={nomeDosItens} {mapa} {completar} {funil} {indice} {documentos} {andamento} {decisoes} {decidir} {anotar}
              {acoes} {proximos} {rotulos} {motivos} {destaque} {pastasDoPack} {podeChamar} {chamar} {recarga}
              {fichas} {documentosDoPack} {ordens} {fases} {ordem} {ordenar} {umItem} {ocupados}
              agente={estado.agente} esperando={estado.esperando} />
          {/key}
        {:else if rota.tela === "pasta" && documentosDoPack?.[rota.nome]}
          <Documentos nome={rota.nome} {mapa} {andamento} {nomeDoItem} {recarga} {umItem} nomeDosItens={nomeDosItens}
            descricao={(mapa?.menu || []).find((m) => m.alvo === rota.nome)?.descricao || ""} />
        {:else if rota.tela === "pasta" && rota.nome === pastasDoPack?.pessoa}
          <Pessoas nome={rota.nome} {indice} {recarga}
            descricao={(mapa?.menu || []).find((m) => m.alvo === rota.nome)?.descricao || ""} />
        {:else if rota.tela === "pasta"}
          <Pasta nome={rota.nome} {mapa} {indice} {recarga} {andamento} {decisoes} {decidir}
            {acoes} {proximos} {rotulos} {pastasDoPack} {podeChamar} {chamar} {funil} {ocupados} />
        {:else if rota.tela === "arquivo"}
          <Arquivo caminho={rota.caminho} {recarga} {indice} {documentos} {destaque} {andamento} {decisoes} {decidir} {anotar}
            {acoes} {proximos} {rotulos} {motivos} {completar} {documentosDoPack} arvore={mapa?.arvore || []} {pastasDoPack} {podeChamar} {chamar}
            {ocupados} agente={estado.agente} esperando={estado.esperando} />
        {:else}
          <Inicio {mapa} {indice} {recarga} {doc} {esperaResposta} {agenteEsperando} {funil} {andamento} {decisoes} {decidir}
            {acoes} {proximos} {rotulos} {inicio} {podeChamar} {chamar} {comeco} {pastasDoPack} {visitaAnterior}
            {fichas} {destaque} {documentos} {documentosDoPack} {ordens} {fases} ordemDosItens={ordem} {ordenar} {ocupados}
            agente={estado.agente} aoResponder={lembrarVolta} />
        {/if}
      </main>
      {#if recusaDaFila}<p class="c-nota p-falta" style="padding:0 var(--s3)">{recusaDaFila}</p>{/if}
      <Fila {decisoes} {respostas} {decidir} {anotar} {dispensar} esperando={estado.esperando} agente={estado.agente}
        mandar={mandarFila} {podeChamar} trabalhando={!!execucao?.rodando}
        chamar={() => chamar("fila")} />
    </div>
  </div>
{/if}
