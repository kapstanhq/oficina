/**
 * A SESSÃO DO PAINEL — o documento que está na tela e a intenção que voltou.
 *
 * ── O PRINCÍPIO, E ELE É A COISA MAIS IMPORTANTE DESTE DIRETÓRIO ───────
 *
 *     O PAINEL PROPÕE. O AGENTE DISPÕE.
 *
 * O painel **não escreve na carteira**. Ele desenha o que o agente mandou
 * desenhar e devolve a INTENÇÃO de quem clicou; quem grava é o agente, pelas
 * regras do contrato — procedência, histórico, id com apelido, teto.
 *
 * A alternativa parece mais simples e não é: com o painel gravando, a
 * carteira passa a ter duas fontes de escrita, e as regras do contrato
 * valeriam só numa delas. É o mesmo erro que o Estúdio evitou tendo UMA rota
 * de escrita (`servir.mjs`), e pelo mesmo motivo.
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

export function criarSessao({ aoRegistrar = () => {} } = {}) {
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

    /** o agente manda desenhar. Toda troca invalida a intenção pendente. */
    mostrar(novo) {
      documento = novo;
      versao++;
      /* ── A INTENÇÃO NÃO ATRAVESSA A TROCA ──────────────────────────
         Um clique que chegou enquanto o agente já estava trocando a tela
         responde à tela velha. Guardá-lo para entregar depois é pior que
         perdê-lo: o agente o leria como resposta à pergunta NOVA. */
      if (intencao) {
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
      acordar(esperandoIntencao, intencao);
      return { aceita: true };
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
