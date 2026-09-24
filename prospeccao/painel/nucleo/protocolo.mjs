/**
 * O TRANSPORTE MCP POR stdio — JSON-RPC newline-delimited, escrito à mão.
 *
 * ── POR QUE NÃO O SDK OFICIAL ──────────────────────────────────────────
 * `@modelcontextprotocol/sdk` (1.30.0) é o SDK Tier 1 e seria a escolha
 * óbvia. Ele traz DEZESSETE dependências — express, hono, jose, ajv, cors,
 * zod, eventsource, pkce-challenge — porque cobre HTTP, SSE e OAuth. Um
 * servidor stdio não usa nenhuma delas.
 *
 * O que este arquivo faz é o que sobra depois de tirar tudo isso, e o que
 * sobra é pequeno porque a especificação é pequena:
 *
 *   "O servidor lê mensagens JSON-RPC de `stdin` e escreve mensagens
 *    JSON-RPC em `stdout`. Cada mensagem é uma requisição, notificação ou
 *    resposta. As mensagens são delimitadas por quebra de linha e NÃO PODEM
 *    conter quebras embutidas."
 *                    — spec 2026-07-28, transports/stdio
 *
 * A regra de "sem dependência" deste repositório vale para o NAVEGADOR, e
 * aqui o alvo é o Node. Mas a razão é a mesma e neste caso é mais forte: o
 * que roda aqui é instalado na máquina de quem usa a Oficina por
 * `/plugin install`, e um plugin que exige `npm install` antes de funcionar
 * não é instalável por quem não é desenvolvedor — que é exatamente o
 * público desta ferramenta.
 *
 * ── A ERA, E ELA NÃO É A MAIS NOVA ─────────────────────────────────────
 * O MCP mudou de era: a revisão `2026-07-28` é "moderna" (versão por
 * requisição em `_meta`, sem handshake, `server/discover` obrigatório), e a
 * `2025-11-25` e anteriores são "legacy" (handshake `initialize`).
 *
 * **O Claude Code em stdio fala LEGACY**, e só troca com
 * `MCP_PROTOCOL_NEGOTIATION=auto`. Então é legacy que este arquivo
 * implementa — e ele NÃO implementa `server/discover` DE PROPÓSITO:
 *
 *   "O servidor devolve qualquer outro erro: o servidor é legacy. Volte
 *    para o handshake `initialize`."          — stdio/backward-compatibility
 *
 * Um `-32601 Method not found` no `server/discover` é a resposta CERTA de um
 * servidor legacy, e é o que faz um cliente dual-era cair no `initialize`
 * sozinho. Implementá-lo pela metade é que quebraria a detecção.
 *
 * ── AS DUAS REGRAS QUE MATAM UM SERVIDOR stdio ─────────────────────────
 * 1 · **Nada em `stdout` que não seja mensagem MCP.** Um `console.log` de
 *     depuração no meio do código derruba a conexão inteira, e o sintoma é
 *     o cliente dizendo que o servidor não respondeu. Por isso o `registrar`
 *     daqui escreve em `stderr`, que a spec libera:
 *     "O servidor PODE escrever UTF-8 em `stderr` para qualquer registro."
 *     É a razão de este módulo não exportar nada que imprima.
 *
 * 2 · **Sair quando `stdin` fechar.** É o sinal portátil de desligamento —
 *     "o único portátil", diz a spec. Sem isso o processo fica vivo depois
 *     de o cliente sumir, e no Windows vira um node órfão segurando a porta
 *     do painel, que é o defeito que aparece na segunda execução.
 */
import { createInterface } from "node:readline";

/* As versões que este servidor aceita, da mais nova para a mais velha.
   Negociação legacy: o cliente manda a dele; se estiver aqui, ecoamos a
   MESMA — a spec exige —, senão respondemos com a nossa mais nova e o
   cliente decide se desconecta. */
export const VERSOES = ["2025-06-18", "2025-03-26", "2024-11-05"];

/* JSON-RPC: os códigos são do padrão, não nossos. */
const ERRO = {
  parse: -32700,
  requisicaoInvalida: -32600,
  metodoDesconhecido: -32601,
  parametroInvalido: -32602,
  interno: -32603,
};

/** registro que NÃO polui o stdout — ver a regra 1 no topo */
export const registrar = (...partes) => {
  process.stderr.write("[painel] " + partes.join(" ") + "\n");
};

/* ── OCUPADO FORA DO STDIO (D234) ─────────────────────────────────────
   Uma notificação JSON-RPC que só o vigia ouve, e que ele engole: ver
   `AVISO_DE_OCUPADO` em `vigia.mjs`. Sem vigia não sai nada — um cliente MCP
   de verdade receberia um método que não conhece. */
export const avisarOcupado = (ocupado) => {
  if (!process.env.KAPSTAN_VIGIADO) return;
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0",
    method: "notifications/kapstan/ocupado", params: { ocupado: Boolean(ocupado) } }) + "\n");
};

/**
 * Sobe um servidor MCP legacy sobre stdin/stdout.
 *
 * @param {object} opcoes
 * @param {{name:string, version:string, title?:string}} opcoes.servidor
 * @param {string} [opcoes.instrucoes]  o `instructions` do initialize
 * @param {Array}  opcoes.ferramentas   [{ name, title, description,
 *                                        inputSchema, outputSchema?, executar }]
 */
export function servirPorStdio({ servidor, instrucoes = "", ferramentas = [] }) {
  const porNome = new Map(ferramentas.map((f) => [f.name, f]));
  let iniciado = false;

  /* ── A ESCRITA É UMA LINHA, E O JSON.stringify JÁ GARANTE ISSO ───────
     Quebra de linha dentro de uma string JSON sai escapada como `\n` — dois
     caracteres —, então nenhum texto de ferramenta pode partir uma mensagem
     em duas. É a garantia que a regra "não podem conter quebras embutidas"
     exige, e ela vem de graça: o que a quebraria seria montar o JSON à mão. */
  const responder = (mensagem) => {
    process.stdout.write(JSON.stringify(mensagem) + "\n");
  };

  const comResultado = (id, result) => responder({ jsonrpc: "2.0", id, result });
  const comErro = (id, code, message, data) =>
    responder({ jsonrpc: "2.0", id, error: { code, message, ...(data ? { data } : {}) } });

  /* ── O RESULTADO DE UMA FERRAMENTA TEM DUAS METADES ──────────────────
     `content` é o que o modelo LÊ (texto), e `structuredContent` é o que um
     programa consome. A spec manda que quem devolve estruturado devolva
     TAMBÉM o JSON serializado em texto, "para compatibilidade" — e aqui isso
     tem um segundo uso, mais concreto: é essa metade que aparece na
     transcrição, e uma ferramenta cujo resultado não aparece em lugar nenhum
     é uma que ninguém depura. */
  const resultadoDeFerramenta = (saida) => {
    if (saida && typeof saida === "object" && Array.isArray(saida.content)) {
      return saida;                                  // a ferramenta montou tudo
    }
    if (saida && typeof saida === "object") {
      return {
        content: [{ type: "text", text: JSON.stringify(saida, null, 2) }],
        structuredContent: saida,
      };
    }
    return { content: [{ type: "text", text: String(saida ?? "") }] };
  };

  async function despachar(msg) {
    const { id, method, params } = msg;
    const ehNotificacao = id === undefined || id === null;

    switch (method) {
      case "initialize": {
        iniciado = true;
        const pedida = params?.protocolVersion;
        /* a spec: "Se o servidor suporta a versão pedida, ele DEVE responder
           com a MESMA versão. Senão, DEVE responder com outra que suporte." */
        const versao = VERSOES.includes(pedida) ? pedida : VERSOES[0];
        registrar(`initialize · cliente ${params?.clientInfo?.name || "?"}`,
          `· pediu ${pedida} · vai ${versao}`);
        return comResultado(id, {
          protocolVersion: versao,
          /* declaramos SÓ o que temos. Sozinho, a lista de ferramentas deste
             servidor é fixa, e prometer notificação de mudança que nunca vem
             faria um cliente esperar por ela. VIGIADO (`nucleo/vigia.mjs`) a
             lista muda quando o código muda, e quem avisa é o vigia. */
          capabilities: { tools: { listChanged: Boolean(process.env.KAPSTAN_VIGIADO) } },
          serverInfo: servidor,
          ...(instrucoes ? { instructions: instrucoes } : {}),
        });
      }

      /* o cliente avisa que está pronto. Não se responde a notificação. */
      case "notifications/initialized":
        return;

      /* cancelamento: a spec manda parar e NÃO mandar mais nada para aquele
         id. Como nenhuma ferramenta daqui segura recurso externo, parar é
         não responder — e quem espera (o `painel_esperar`) tem teto próprio. */
      case "notifications/cancelled":
        registrar("cancelado o pedido", String(params?.requestId));
        return;

      case "ping":
        return comResultado(id, {});

      case "tools/list":
        return comResultado(id, {
          tools: ferramentas.map(({ name, title, description, inputSchema, outputSchema }) =>
            ({ name, title, description, inputSchema,
               ...(outputSchema ? { outputSchema } : {}) })),
        });

      case "tools/call": {
        const ferramenta = porNome.get(params?.name);
        if (!ferramenta) {
          return comErro(id, ERRO.parametroInvalido, `Unknown tool: ${params?.name}`);
        }
        /* ── ERRO DE FERRAMENTA NÃO É ERRO DE PROTOCOLO ────────────────
           A spec separa os dois, e a diferença importa: erro de protocolo
           some da conversa e o modelo não aprende nada com ele; `isError`
           volta como CONTEÚDO, e o modelo lê o que deu errado e tenta
           outra coisa. Falha de negócio — porta ocupada, painel fechado,
           tempo esgotado — é sempre a segunda. */
        try {
          const saida = await ferramenta.executar(params?.arguments || {});
          return comResultado(id, resultadoDeFerramenta(saida));
        } catch (e) {
          registrar(`tools/call ${params?.name} falhou:`, e?.message || String(e));
          return comResultado(id, {
            content: [{ type: "text", text: String(e?.message || e) }],
            isError: true,
          });
        }
      }

      default:
        /* `server/discover` cai aqui, e é assim que tem de ser — ver a nota
           sobre a era, no topo. */
        if (ehNotificacao) return;
        return comErro(id, ERRO.metodoDesconhecido, `Method not found: ${method}`);
    }
  }

  const linhas = createInterface({ input: process.stdin });

  linhas.on("line", (linha) => {
    const texto = linha.trim();
    if (!texto) return;
    let msg;
    try {
      msg = JSON.parse(texto);
    } catch {
      return comErro(null, ERRO.parse, "Parse error");
    }
    if (msg?.jsonrpc !== "2.0" || typeof msg.method !== "string") {
      /* resposta do cliente não existe neste transporte ("O cliente NÃO PODE
         escrever respostas JSON-RPC"), então o que chega sem `method` é lixo */
      return comErro(msg?.id ?? null, ERRO.requisicaoInvalida, "Invalid Request");
    }
    if (!iniciado && msg.method !== "initialize" && msg.method !== "ping") {
      registrar("antes do initialize:", msg.method);
    }
    /* cada mensagem é despachada sem esperar a anterior: `painel_esperar`
       bloqueia por minutos, e um laço sequencial faria o `ping` do cliente
       morrer atrás dele — o cliente concluiria que o servidor caiu. JSON-RPC
       correlaciona por `id`, então responder fora de ordem é legítimo. */
    despachar(msg).catch((e) => {
      registrar("despacho falhou:", e?.message || String(e));
      if (msg.id !== undefined && msg.id !== null) {
        comErro(msg.id, ERRO.interno, String(e?.message || e));
      }
    });
  });

  /* o sinal de desligamento portátil — ver a regra 2 no topo */
  linhas.on("close", () => {
    registrar("stdin fechou · saindo");
    process.exit(0);
  });

  return { responder, registrar };
}
