/**
 * A SESSÃO DO PAINEL — o documento que está na tela e a intenção que voltou.
 *
 * ── O PRINCÍPIO, E ELE É A COISA MAIS IMPORTANTE DESTE DIRETÓRIO ───────
 *
 *     O PAINEL PROPÕE. O AGENTE DISPÕE.
 *
 * O painel **não escreve na base**. Ele desenha o que o agente mandou
 * desenhar e devolve a INTENÇÃO de quem clicou; quem grava é o agente, pelas
 * regras do contrato — procedência, histórico, id com apelido, teto.
 *
 * A alternativa parece mais simples e não é: com o painel gravando, a
 * base passa a ter duas fontes de escrita, e as regras do contrato
 * valeriam só numa delas. É o mesmo erro que o Estúdio evitou tendo UMA rota
 * de escrita (`servir.mjs`), e pelo mesmo motivo.
 *
 * O painel passou a LER a base na página inicial (D230), e isso não mexe no
 * princípio: ler não é gravar. A propriedade verificável mudou de forma —
 * "não importa `fs`" virou "não importa função de ESCRITA, e só lê dentro da
 * raiz" —, e quem a sustenta é `nucleo/base.mjs`.
 *
 * ── DUAS COISAS, E ELAS ANDAM EM SENTIDOS OPOSTOS ──────────────────────
 *
 *   documento   agente → painel    o que desenhar. Versionado.
 *   intenção    painel → agente    o que a pessoa fez. Consumida uma vez.
 *
 * ── POR QUE A VERSÃO EXISTE ────────────────────────────────────────────
 * A aba do navegador pergunta "mudou desde a versão N?" e fica pendurada até
 * mudar. Sem o número, a escolha seria entre perguntar a cada segundo
 * (desperdício) e perder uma atualização que chegou entre duas perguntas
 * (defeito silencioso, o pior dos dois).
 *
 * É o mesmo desenho do par `X-Mtime`/`X-Mtime-Base` de `scripts/servir.mjs`,
 * que existe lá pela razão irmã: saber de que versão o outro lado partiu.
 *
 * ── E POR QUE A INTENÇÃO CARREGA A VERSÃO QUE ELA VIU ──────────────────
 * Quem clica está respondendo ao que estava na tela. Se o agente já trocou o
 * documento, o clique responde a uma pergunta que não está mais lá — e
 * entregá-lo como se fosse resposta à nova é o modo de falha que faz uma
 * mensagem sair para a pessoa errada. A intenção velha é RECUSADA, e o
 * agente é avisado de que ela chegou tarde.
 */

const NADA = { vista: "nada", titulo: "", dados: {} };

/* ── A TELA, CONFERIDA ANTES DE SER DESENHADA ─────────────────────────────
   Uma tela é UMA vista com os seus `dados`, ou de um a três `blocos` — cada
   um com `id`, `vista` e `dados`. A conferência mora aqui, e não no
   `servidor.mjs`, por uma razão prática: aquele arquivo sobe o transporte
   stdio ao ser importado, e o que não se consegue importar não se consegue
   provar. Esta função é pura, e a `prova-guardas.mjs` a chama direto.

   ── O TETO É TRÊS, E ELE É RECUSA — NÃO AVISO NA TELA ────────────────
   A `escolha` com cinco opções desenha as cinco e avisa: ali o excesso é de
   conteúdo, e esconder uma opção seria decidir pela pessoa. Aqui o excesso é
   de FORMA — quatro blocos são duas telas —, e quem pode consertar é o
   agente, que lê o erro na hora. A pessoa não faz nada com um aviso desses.

   ── E O `id` É OBRIGATÓRIO PORQUE É POR ELE QUE A RESPOSTA VOLTA ─────
   `{ acao, blocos: { <id>: {...} } }`. Bloco sem `id` devolveria o que
   coletou numa chave inventada, e dois `formulario` na mesma tela se
   sobrescreveriam sem ninguém ver. Id repetido é o mesmo defeito.

   Devolve a tela NORMALIZADA. A de vista única sai com as chaves de sempre —
   `{ vista, dados }` —, porque é a cintura fina: o que já chamava o painel
   continua mandando e recebendo o mesmo formato. */
export const TETO_DE_BLOCOS = 3;

export function conferirTela(args, vistas) {
  const existem = "As que existem: " + Object.keys(vistas).join(", ");
  const temBlocos = args?.blocos !== undefined && args?.blocos !== null;

  if (!temBlocos) {
    if (!args?.vista) {
      throw new Error("falta `vista` — ou `blocos`, quando a tela tem mais de " +
        "uma coisa. " + existem);
    }
    if (!vistas[args.vista]) {
      throw new Error(`vista desconhecida: ${args.vista}. ${existem}`);
    }
    return { vista: args.vista, dados: args.dados || {} };
  }

  if (args.vista) {
    throw new Error("mande `vista` e `dados`, OU `blocos` — os dois juntos não " +
      "dizem qual é a tela. Com `blocos`, cada bloco traz a vista dele");
  }
  if (!Array.isArray(args.blocos) || !args.blocos.length) {
    throw new Error("`blocos` precisa ser uma lista com pelo menos um bloco: " +
      "[{ id, vista, dados }]");
  }
  if (args.blocos.length > TETO_DE_BLOCOS) {
    throw new Error(`são ${args.blocos.length} blocos, e o teto é ${TETO_DE_BLOCOS} — ` +
      "quatro coisas na mesma tela são duas telas. Mostre a primeira, espere, " +
      "e mostre a segunda");
  }
  const vistos = new Set();
  const blocos = args.blocos.map((b, i) => {
    const id = String(b?.id ?? "").trim();
    if (!id) {
      throw new Error(`o bloco ${i + 1} não tem \`id\` — é por ele que a resposta ` +
        "volta: { acao, blocos: { <id>: {...} } }");
    }
    if (vistos.has(id)) {
      throw new Error(`dois blocos com o id "${id}" — o que o segundo coletar ` +
        "apagaria o do primeiro");
    }
    vistos.add(id);
    if (!b.vista || !vistas[b.vista]) {
      throw new Error(`o bloco "${id}" pede a vista ` +
        `${b.vista ? `"${b.vista}"` : "nenhuma"}. ${existem}`);
    }
    return { id, vista: b.vista, titulo: b.titulo ? String(b.titulo) : "",
      dados: b.dados || {} };
  });
  return { vista: "blocos", blocos };
}

/**
 * `aoGuardar(intencao)` (D238): chamado quando a intenção chega SEM ninguém
 * esperando. Quem o dá (o servidor, com base ligada) a põe em disco; devolve
 * `true` para dizer que guardou — e aí a sessão não a segura na memória, onde
 * a próxima `mostrar` a apagaria e a troca do vigia a perderia.
 */
export function criarSessao({ aoRegistrar = () => {}, aoGuardar = () => false } = {}) {
  let documento = NADA;
  let versao = 0;
  let intencao = null;

  /* quem está pendurado esperando — a aba, no `GET /documento`, e o agente,
     no `painel_esperar`. São filas separadas porque esperam coisas opostas. */
  const esperandoDocumento = new Set();
  const esperandoIntencao = new Set();

  const acordar = (fila, valor) => {
    for (const resolver of fila) resolver(valor);
    fila.clear();
  };

  return {
    get versao() { return versao; },
    get documento() { return { ...documento, versao }; },
    /* há alguém do outro lado, pendurado agora? É o que a página inicial usa
       para dizer se o pedido chega na hora ou espera o agente voltar a olhar
       — e é diferente de "há agente", que é o processo estar em modo MCP. */
    get esperando() { return esperandoIntencao.size > 0; },
    get temTarefa() { return documento !== NADA; },

    /** o agente manda desenhar. Toda troca invalida a intenção pendente. */
    mostrar(novo) {
      documento = novo;
      versao++;
      /* ── A INTENÇÃO NÃO ATRAVESSA A TROCA ──────────────────────────
         Um clique que chegou enquanto o agente já estava trocando a tela
         responde à tela velha. Guardá-lo para entregar depois é pior que
         perdê-lo: o agente o leria como resposta à pergunta NOVA.

         O PEDIDO é a exceção, e ela não é conveniência: ele nunca foi
         resposta a tela nenhuma — nasce na página inicial, sobre um arquivo
         que a pessoa estava lendo. Descartá-lo pela troca de documento
         apagaria uma frase que ninguém respondeu ainda. */
      if (intencao && intencao.acao !== "pedir") {
        aoRegistrar(`intenção descartada pela troca de documento: ${intencao.acao}`);
        intencao = null;
      }
      acordar(esperandoDocumento, { ...documento, versao });
      return versao;
    },

    /**
     * A aba pergunta o que desenhar. Devolve na hora se já mudou; senão
     * fica pendurada até mudar ou até o teto.
     *
     * O teto é do LADO DO NAVEGADOR, não do agente: uma conexão pendurada
     * indefinidamente morre sozinha em qualquer proxy ou suspensão de
     * laptop, e o sintoma é uma aba que para de atualizar sem dizer nada. A
     * aba repergunta, e o laço se conserta.
     */
    aguardarDocumento(desde, tetoMs = 25000) {
      if (Number(desde) !== versao) {
        return Promise.resolve({ ...documento, versao });
      }
      return new Promise((resolver) => {
        const fim = setTimeout(() => {
          esperandoDocumento.delete(resolver);
          resolver(null);                    // 204 · nada mudou, pergunte de novo
        }, tetoMs);
        const encerrar = (v) => { clearTimeout(fim); resolver(v); };
        esperandoDocumento.add(encerrar);
      });
    },

    /** a aba devolve o que a pessoa fez */
    registrarIntencao(nova) {
      if (Number(nova?.versao) !== versao) {
        aoRegistrar(`intenção fora de tempo: viu a v${nova?.versao}, a tela é v${versao}`);
        return { aceita: false, motivo: "a tela mudou desde que você clicou" };
      }
      intencao = { ...nova, em: new Date().toISOString() };
      if (!esperandoIntencao.size) {
        /* ninguém pendurado: a resposta é TARDIA. Guardada em disco, sai da
           memória; sem quem guarde, fica aqui e o próximo `painel_esperar` a
           leva — o comportamento de sempre, sem base */
        let guardada = false;
        try { guardada = Boolean(aoGuardar(intencao)); }
        catch (e) { aoRegistrar(`não guardei a resposta tardia: ${e?.message || e}`); }
        if (guardada) { intencao = null; aoRegistrar("resposta tardia guardada"); }
        return { aceita: true, guardada };
      }
      acordar(esperandoIntencao, intencao);
      return { aceita: true };
    },

    /**
     * O PEDIDO — a intenção que nasce sem o agente ter mostrado nada.
     *
     * A pessoa está lendo um arquivo na página inicial e escreve "prepara a
     * mensagem para este". Chega ao agente pelo `painel_esperar`, como
     * qualquer intenção, e o contrato manda tratá-la como trataria a mesma
     * frase dita no terminal.
     *
     * ── ELE NÃO CONFERE VERSÃO, E ISSO É O PONTO ────────────────────
     * `registrarIntencao` recusa o que responde a uma tela que já mudou,
     * porque a resposta seria dada à pergunta errada. Um pedido não responde
     * a pergunta nenhuma — ele faz uma —, então não há tela a que ele possa
     * chegar atrasado. Passá-lo pela mesma porta obrigaria a página inicial
     * a carregar um número de versão que não significa nada ali.
     *
     * Ele SUBSTITUI um pedido anterior não entregue: dois pedidos seguidos
     * sem ninguém do outro lado são a pessoa reescrevendo o primeiro, e
     * entregar os dois faria o agente atender duas vezes.
     */
    registrarPedido({ pedido, sobre }) {
      const texto = String(pedido || "").trim();
      if (!texto) return { aceita: false, motivo: "escreva o que você quer pedir" };
      if (texto.length > 4000) {
        return { aceita: false, motivo: "o pedido passou de 4 mil caracteres" };
      }
      intencao = {
        acao: "pedir",
        pedido: texto,
        sobre: String(sobre || ""),
        em: new Date().toISOString(),
      };
      aoRegistrar(`pedido da página inicial sobre ${intencao.sobre || "a base"}`);
      /* medido antes de acordar: `acordar` esvazia a fila, e ler o tamanho
         depois devolveria `false` sempre — a página diria "ele pega quando
         voltar" justamente no caso em que ele acabou de pegar */
      const naHora = esperandoIntencao.size > 0;
      acordar(esperandoIntencao, intencao);
      return { aceita: true, naHora };
    },

    /**
     * O agente espera a pessoa agir.
     *
     * ── O TETO NÃO É OPCIONAL ───────────────────────────────────────
     * Uma tool que bloqueia sem limite é uma tool que o cliente MATA: o
     * Claude Code tem teto de ociosidade de 30 minutos em stdio, e o que o
     * usuário vê quando ele estoura não é "a pessoa não respondeu" — é a
     * ferramenta tendo falhado. Estourar por conta própria, com uma resposta
     * que DIZ que estourou, é o que deixa a skill seguir em texto e contar o
     * que aconteceu. É a mesma degradação do conector do WhatsApp: quando o
     * caminho bom não existe, o caminho de sempre continua lá.
     */
    aguardarIntencao(tetoMs) {
      if (intencao) {
        const pronta = intencao;
        intencao = null;
        return Promise.resolve(pronta);
      }
      return new Promise((resolver) => {
        const fim = setTimeout(() => {
          esperandoIntencao.delete(encerrar);
          resolver(null);
        }, tetoMs);
        const encerrar = (v) => {
          clearTimeout(fim);
          intencao = null;
          resolver(v);
        };
        esperandoIntencao.add(encerrar);
      });
    },
  };
}
