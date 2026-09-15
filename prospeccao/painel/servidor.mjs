/**
 * O PAINEL — o servidor MCP que dá corpo visual ao modo copiloto.
 *
 * ── O QUE ELE RESOLVE ──────────────────────────────────────────────────
 * As skills da Oficina têm muito humano no laço: o contrato §5 manda o
 * copiloto "parar na bifurcação, entregar o que já ficou pronto, perguntar
 * uma coisa e esperar", e o §10 manda toda skill fechar dizendo o que
 * guardou e o que falta saber. Tudo isso acontece hoje como TEXTO ROLANDO
 * num terminal — inclusive a lista do dia, que é uma tabela, e o funil, que
 * é um quadro de etapas.
 *
 * O painel não acrescenta capacidade nenhuma: ele dá **forma** ao que o
 * contrato já obriga. `escolha` é o §5. `feedback` é o §10. Nada aqui é uma
 * regra nova — é a mesma regra, desenhada.
 *
 * ── DUAS FERRAMENTAS, E POR QUE SÓ DUAS ────────────────────────────────
 *   painel_mostrar   desenha, e devolve na hora
 *   painel_esperar   bloqueia até a pessoa agir, com teto
 *
 * A tentação é ter uma por vista — `painel_lista`, `painel_ficha`… — e ela
 * está errada por duas razões. A primeira é que o modelo teria seis
 * descrições para escolher em vez de uma, e escolher a vista é a parte
 * FÁCIL. A segunda é que cada vista nova viraria uma ferramenta nova no
 * `tools/list` de todo mundo: o custo de vocabulário do pack cresceria com o
 * desenho da interface, que é exatamente o acoplamento que não se quer.
 *
 * A vista é um CAMPO. Vista nova custa um componente e zero ferramenta.
 *
 * ── E O PAINEL NÃO ESCREVE NA CARTEIRA ─────────────────────────────────
 * Ver `nucleo/sessao.mjs`: o painel propõe, o agente dispõe. Este processo
 * não tem `fs` e não abre um arquivo da carteira em lugar nenhum — é
 * verificável lendo os imports do diretório inteiro.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { servirPorStdio, registrar } from "./nucleo/protocolo.mjs";
import { abrirPainel } from "./nucleo/http.mjs";
import { criarSessao } from "./nucleo/sessao.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/* ── AS SEIS VISTAS ───────────────────────────────────────────────────
   O vocabulário é fechado de propósito, e o teto tem número: SEIS. O
   Estúdio chegou a 26 componentes porque é uma bancada de autoria — quem
   trabalha lá passa o dia lá. O painel é uma JANELA: quem o abre está no
   meio de outra coisa e volta para ela. Sem teto declarado, ele vira o
   Estúdio, e aí precisa de manutenção de bancada.

   A sétima vista custa justificativa escrita, aqui, com o caso que as seis
   não cobriram. */
const VISTAS = {
  lista: "itens, opcionalmente agrupados. O funil é isto, agrupado por etapa; " +
    "a lista do dia é isto, agrupada por seção.",
  ficha: "UM item por inteiro: os campos com a procedência de cada um, e as " +
    "seções de texto.",
  texto: "markdown para ler, aprovar ou pedir mudança. A mensagem antes de sair.",
  escolha: "de duas a quatro opções, cada uma com o custo escrito. É a " +
    "bifurcação do copiloto (contrato §5 e §8).",
  feedback: "o que a skill fez e o que ficou faltando. É o fecho do contrato " +
    "§10 — `## Guardei` e `## Falta saber` — desenhado.",
  laudo: "certo · errado · dúvida. A saída de uma régua.",
};

/* ── O ESQUEMA DE ENTRADA ─────────────────────────────────────────────
   Escrito à mão e não gerado por biblioteca de esquema: são trinta linhas
   de JSON Schema, e a alternativa custava `zod` + `zod-to-json-schema` na
   máquina de quem instala o plugin.

   `dados` é `object` sem propriedades declaradas DE PROPÓSITO: o formato
   muda com a vista, e um `oneOf` de seis ramos faria o modelo gastar
   atenção a decidir o ramo em vez de a preencher o conteúdo. Quem valida o
   formato de verdade é o componente, que desenha o que entende e ignora o
   resto — e essa é a degradação certa numa tela. */
const ESQUEMA_MOSTRAR = {
  type: "object",
  properties: {
    vista: {
      type: "string",
      enum: Object.keys(VISTAS),
      description: Object.entries(VISTAS).map(([k, v]) => `${k}: ${v}`).join(" · "),
    },
    titulo: { type: "string", description: "o cabeçalho da tela, curto" },
    linha: {
      type: "string",
      description: "uma linha abaixo do título — a razão da ordem, o custo, o " +
        "que a pessoa precisa saber antes de olhar a lista. Opcional.",
    },
    dados: {
      type: "object",
      description:
        "lista: { grupos: [{ rotulo, itens: [{ id, titulo, linha, marca }] }] } · " +
        "ficha: { campos: [{ rotulo, valor, de }], secoes: [{ titulo, linhas }] } · " +
        "texto: { markdown } · " +
        "escolha: { pergunta, opcoes: [{ chave, rotulo, custo }] } · " +
        "feedback: { guardei: [], faltaSaber: [], decidiSozinho: [] } · " +
        "laudo: { certo: [], errado: [], duvida: [] }",
    },
    acoes: {
      type: "array",
      description: "os botões do rodapé. Cada um vira uma intenção com essa " +
        "`chave` quando clicado. Sem isto, a tela é só de leitura.",
      items: {
        type: "object",
        properties: {
          chave: { type: "string" },
          rotulo: { type: "string", description: "o que a PESSOA vai fazer, " +
            "nunca o nome interno — “Eu mesmo mando”, e não “só o bloco”" },
          tom: { type: "string", enum: ["normal", "forte", "recusa"] },
        },
        required: ["chave", "rotulo"],
      },
    },
  },
  required: ["vista", "titulo", "dados"],
};

const sessao = criarSessao({ aoRegistrar: registrar });

/* ── O PAINEL SÓ SOBE QUANDO ALGUÉM O PEDE ────────────────────────────
   Abrir a porta no `initialize` poria um servidor HTTP de pé em toda sessão
   do Claude Code que tivesse o plugin instalado, inclusive nas que nunca
   chamam o painel. Ele sobe na primeira `painel_mostrar` e morre com o
   processo. */
let aberto = null;
async function garantirAberto() {
  if (aberto) return aberto;
  const html = await readFile(join(AQUI, "painel.html"), "utf8");
  aberto = await abrirPainel({
    html,
    aoRegistrar: registrar,
    rotas: {
      /* a aba pergunta o que desenhar e fica pendurada até mudar */
      "GET /documento": async ({ url, res }) => {
        const doc = await sessao.aguardarDocumento(url.searchParams.get("desde"));
        if (doc === null) {
          res.writeHead(204, { "Cache-Control": "no-store" });
          res.end();
          return;
        }
        return doc;
      },
      /* e devolve o que a pessoa fez */
      "POST /intencao": ({ corpo }) => sessao.registrarIntencao(corpo),
    },
  });
  registrar(`painel de pé em ${aberto.url}`);
  return aberto;
}

const ferramentas = [
  {
    name: "painel_mostrar",
    title: "Mostrar no painel",
    description:
      "Desenha alguma coisa no painel do navegador e devolve o endereço dele. " +
      "Use quando o que você tem para mostrar é uma LISTA, uma FICHA, um TEXTO " +
      "para aprovar, uma ESCOLHA entre caminhos, o FECHO do que você fez, ou um " +
      "LAUDO — ou seja, sempre que a resposta seria uma tabela ou um formulário " +
      "rolando no terminal. Não bloqueia: desenha e volta na hora. Para esperar " +
      "a pessoa agir, chame `painel_esperar` depois. O painel NÃO grava nada na " +
      "carteira — quem grava é você, com as regras do contrato, depois de " +
      "receber a intenção.",
    inputSchema: ESQUEMA_MOSTRAR,
    async executar(args) {
      if (!VISTAS[args.vista]) {
        throw new Error(`vista desconhecida: ${args.vista}. ` +
          `As que existem: ${Object.keys(VISTAS).join(", ")}`);
      }
      const { url } = await garantirAberto();
      const versao = sessao.mostrar({
        vista: args.vista,
        titulo: String(args.titulo || ""),
        linha: args.linha ? String(args.linha) : "",
        dados: args.dados || {},
        acoes: Array.isArray(args.acoes) ? args.acoes : [],
      });
      return {
        painel: url,
        versao,
        /* a frase que o agente repassa a quem está lendo o terminal. Sem ela,
           o painel abre e a pessoa não sabe que abriu — a tela do terminal
           continua sendo onde ela está olhando. */
        diga: `Abri o painel: ${url}`,
      };
    },
  },
  {
    name: "painel_esperar",
    title: "Esperar a pessoa no painel",
    description:
      "Bloqueia até a pessoa clicar em alguma coisa no painel e devolve o que " +
      "ela fez. Use logo depois de `painel_mostrar` com `acoes`. Devolve " +
      "`{ acao, item, escolha, texto }` — ou `{ expirou: true }` se ninguém " +
      "agiu dentro do tempo, e aí SIGA EM TEXTO no terminal e diga que o " +
      "painel não foi usado. Nunca chame duas vezes seguidas sem mostrar algo " +
      "novo no meio.",
    inputSchema: {
      type: "object",
      properties: {
        segundos: {
          type: "number",
          description: "quanto esperar antes de desistir. Padrão 240, teto 900.",
          minimum: 5,
          maximum: 900,
        },
      },
    },
    async executar(args) {
      if (!aberto) {
        throw new Error("o painel não está aberto — chame `painel_mostrar` antes");
      }
      /* ── O TETO, E ELE É NOSSO E NÃO DO CLIENTE ────────────────────
         O Claude Code corta uma tool de stdio por ociosidade em 30 minutos, e
         o que a pessoa vê quando isso acontece não é "ninguém respondeu": é a
         ferramenta tendo FALHADO. Estourar antes, com uma resposta que diz que
         estourou, é o que deixa a skill voltar ao texto e contar o que houve —
         a mesma degradação elegante do conector do WhatsApp. */
      const segundos = Math.min(Math.max(Number(args.segundos) || 240, 5), 900);
      const intencao = await sessao.aguardarIntencao(segundos * 1000);
      if (!intencao) {
        return {
          expirou: true,
          esperei: segundos,
          diga: "Ninguém mexeu no painel. Sigo por aqui mesmo.",
        };
      }
      return intencao;
    },
  },
];

/* ── A DEMONSTRAÇÃO, que é também o teste de fumaça ────────────────────
   `node painel/servidor.mjs --demonstracao` abre o painel com uma tela de
   exemplo e imprime o endereço. Serve para duas coisas que normalmente
   exigiriam duas ferramentas:

   · VER a interface enquanto se mexe nela, sem precisar de um agente do
     outro lado nem de uma carteira montada
   · PROVAR, numa linha, que as três guardas do servidor estão de pé — a
     página abre com a chave e não abre sem ela

   Os dados são inventados e genéricos de propósito: este arquivo mora no
   motor e é copiado para todo pack, então um exemplo de ofício aqui seria a
   palavra do ofício vazando para o lugar que o `conferir` vigia.

   O `setInterval` existe porque o servidor HTTP está `unref`-ado (ver
   `nucleo/http.mjs`): sem alguém segurando o laço de eventos, o processo
   sairia no instante em que terminasse de subir. */
if (process.argv.includes("--demonstracao")) {
  const { url } = await garantirAberto();
  sessao.mostrar({
    vista: "lista",
    titulo: "Exemplo — o painel está de pé",
    linha: "Esta tela é de mentira. Clique em alguma coisa: a intenção " +
      "aparece no terminal que abriu este processo.",
    dados: {
      grupos: [
        { rotulo: "Vence hoje", itens: [
          { id: "X-001", marca: "hoje", titulo: "X-001 (exemplo)",
            linha: "É assim que uma linha de lista se parece.",
            acoes: [{ chave: "abrir", rotulo: "Abrir" }] },
        ] },
        { rotulo: "Travado", itens: [] },
      ],
    },
    acoes: [
      { chave: "seguir", rotulo: "Seguir", tom: "forte" },
      { chave: "parar", rotulo: "Parar por aqui", tom: "recusa" },
    ],
  });
  registrar(`demonstração no ar · abra ${url}`);
  process.stderr.write(`\n  ${url}\n\n`);
  (async () => {
    for (;;) {
      const i = await sessao.aguardarIntencao(3600_000);
      if (i) registrar("intenção:", JSON.stringify(i));
    }
  })();
  setInterval(() => {}, 1 << 30);
} else {
servirPorStdio({
  servidor: { name: "painel", title: "Painel da Oficina", version: "0.1.0" },
  instrucoes:
    "O painel é a cara visual do modo copiloto. Mostre nele o que seria uma " +
    "tabela ou um formulário no terminal — a lista do dia, o funil, a ficha de " +
    "um item, a mensagem antes de sair, a bifurcação com o custo de cada " +
    "caminho, e o fecho do que foi guardado. Ele NÃO escreve na carteira: " +
    "devolve o que a pessoa escolheu, e quem grava é você. Quando ele não " +
    "estiver disponível, ou quando o tempo estourar, faça o mesmo trabalho em " +
    "texto e diga em uma linha que foi assim.",
  ferramentas,
});
}
