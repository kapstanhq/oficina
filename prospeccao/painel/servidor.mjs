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
 * ── QUATRO FERRAMENTAS, E POR QUE SÓ QUATRO ────────────────────────────
 *   painel_inicio    aponta o painel para a base e abre a página inicial
 *   painel_fila      lê e confirma o que a pessoa decidiu sem ser perguntada
 *   painel_mostrar   desenha, e devolve na hora
 *   painel_esperar   bloqueia até a pessoa agir, com teto
 *
 * A ordem da lista é a ordem de USO — é assim que o `tools/list` as entrega,
 * e é o que o modelo lê primeiro: o começo de uma execução é `painel_inicio`.
 *
 * A tentação é ter uma por vista — `painel_lista`, `painel_ficha`… — e ela
 * está errada por duas razões. A primeira é que o modelo teria sete
 * descrições para escolher em vez de uma, e escolher a vista é a parte
 * FÁCIL. A segunda é que cada vista nova viraria uma ferramenta nova no
 * `tools/list` de todo mundo: o custo de vocabulário do pack cresceria com o
 * desenho da interface, que é exatamente o acoplamento que não se quer.
 *
 * A vista é um CAMPO. Vista nova custa um componente e zero ferramenta — e
 * foi o que a sétima custou. O lote e os blocos custaram menos ainda: o
 * primeiro é um campo de `dados`, o segundo é um campo ao lado de `vista`.
 *
 * A terceira ferramenta passou pela mesma régua e a atravessou porque o que
 * ela faz não é uma tela: é DIZER ONDE A BASE ESTÁ. Nenhum campo de
 * `painel_mostrar` carregaria isso sem virar um modo escondido dentro de uma
 * ferramenta que existe para desenhar (D230).
 *
 * ── E O PAINEL CONTINUA NÃO ESCREVENDO NA BASE ─────────────────────────
 * Ver `nucleo/sessao.mjs`: o painel propõe, o agente dispõe. O que mudou com
 * a página inicial é que ele LÊ — e a propriedade verificável mudou junto:
 * de "não importa `fs`" para **"não importa função de ESCRITA, e só lê
 * dentro da raiz da base"**. As guardas de caminho estão em
 * `nucleo/base.mjs`; o que o painel escreve é estado DELE, em
 * `~/.kapstan/painel/` — a chave desta máquina e a fila de decisões (D232) —,
 * e nada disso fica na base. A quarta ferramenta atravessou a mesma régua da
 * terceira: confirmar o que foi gravado não é uma tela, e não cabe num campo
 * de `painel_mostrar`.
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve, sep } from "node:path";
import { servirPorStdio, registrar, avisarOcupado } from "./nucleo/protocolo.mjs";
import { abrirPainel, atalhoDoLogin, chaveDaMaquina, pastaDaChave } from "./nucleo/http.mjs";
import { criarSessao, conferirTela, TETO_DE_BLOCOS } from "./nucleo/sessao.mjs";
import { criarBase } from "./nucleo/base.mjs";
import { criarFila } from "./nucleo/fila.mjs";
import { acharAnfitriao } from "./nucleo/hospede.mjs";
import { ajustarPelaBase } from "./nucleo/molde.mjs";
import { criarLancador, resolverLancamento } from "./nucleo/lancar.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/* ── AS SETE VISTAS ───────────────────────────────────────────────────
   O vocabulário é fechado de propósito, e o teto tinha número: SEIS. O
   Estúdio chegou a 26 componentes porque é uma bancada de autoria — quem
   trabalha lá passa o dia lá. O painel é uma JANELA: quem o abre está no
   meio de outra coisa e volta para ela. Sem teto declarado, ele vira o
   Estúdio, e aí precisa de manutenção de bancada.

   ── E O TETO CONTINUA SENDO SETE DEPOIS DA PÁGINA INICIAL ──────────
   As telas da casa — início, pasta, arquivo — NÃO entram nesta conta, e a
   distinção não é contábil: uma vista é vocabulário que o AGENTE escreve
   (ele escolhe `vista: "ficha"` e monta os `dados`), e o custo dela é o
   modelo ter mais uma coisa para decidir. As telas da casa desenham o que
   a BASE já tem, ninguém as pede, e nada que o agente escreva muda o que
   elas mostram. Vista nova continua custando a justificativa escrita aqui;
   tela de casa custa o que custa qualquer tela.

   A sétima custava justificativa escrita, aqui, com o caso que as seis não
   cobriram. É esta: **revisar o que vai ser respondido EM NOME da pessoa —
   campo a campo, antes de sair — não cabe em `ficha`, que só mostra, nem em
   `texto`, que é um bloco só.** Doze respostas num `texto` editável viram um
   parágrafo em que ela precisa achar a linha, e a volta é prosa que o agente
   teria de reler para saber o que mudou. No `formulario` a volta é
   `campos: { chave: valor }`, e o `?` — o que o agente declarou não saber —
   vira o campo vazio que só ela preenche.

   A oitava custa o mesmo: o caso, escrito aqui. */
const VISTAS = {
  lista: "itens, opcionalmente agrupados. O funil é isto, agrupado por etapa; " +
    "a lista do dia é isto, agrupada por seção. Com `decisoes`, cada item " +
    "ganha um seletor e a pessoa julga vários de uma vez — e aí dê a cada " +
    "item o `detalhe` e o `link` que sustentam a decisão: os dois abrem SEM " +
    "trocar a tela, e é o que impede que conferir um item apague as marcas " +
    "dos outros.",
  ficha: "UM item por inteiro: os campos com a procedência de cada um, e as " +
    "seções de texto.",
  texto: "markdown para ler, aprovar ou pedir mudança. A mensagem antes de sair.",
  escolha: "de duas a quatro opções, cada uma com o custo escrito. É a " +
    "bifurcação do copiloto (contrato §5 e §8).",
  feedback: "o que a skill fez e o que ficou faltando. É o fecho do contrato " +
    "§10 — `## Guardei` e `## Falta saber` — desenhado.",
  laudo: "certo · errado · dúvida. A saída de uma régua.",
  formulario: "o que a PESSOA preenche ou corrige, campo a campo. `valor` é o " +
    "que você já sabe, com a procedência em `de`; `?` sai vazio e marcado.",
};

/* ── O ESQUEMA DE ENTRADA ─────────────────────────────────────────────
   Escrito à mão e não gerado por biblioteca de esquema: são quarenta linhas
   de JSON Schema, e a alternativa custava `zod` + `zod-to-json-schema` na
   máquina de quem instala o plugin.

   `dados` é `object` sem propriedades declaradas DE PROPÓSITO: o formato
   muda com a vista, e um `oneOf` de sete ramos faria o modelo gastar
   atenção a decidir o ramo em vez de a preencher o conteúdo. Quem valida o
   formato de verdade é o componente, que desenha o que entende e ignora o
   resto — e essa é a degradação certa numa tela.

   ── `vista` SAIU DO `required`, E O ESQUEMA NÃO DIZ "UM OU OUTRO" ─────
   A tela é `vista` + `dados` OU `blocos`. Em JSON Schema isso é um `oneOf`
   na raiz, e há cliente que recusa esquema de ferramenta com combinador no
   topo. Quem cobra o "ou" é `conferirTela`, com uma frase que ensina — que é
   também o que o modelo lê melhor do que um erro de validador. */
const DADOS_POR_VISTA =
  "lista: { grupos: [{ rotulo, itens: [{ id, titulo, linha, marca, detalhe, link, acoes }] }], " +
    "decisoes?: [{ chave, rotulo, tom }] } · `detalhe` é texto que abre na " +
    "própria linha (a razão inteira, o trecho do documento) e `link` é uma " +
    "âncora para a fonte, em aba nova: nenhum dos dois volta ao agente, e por " +
    "isso nenhum dos dois perde o que já foi marcado · " +
  "Em `decisoes`, declare `gesto` — `etapa:<nome da etapa>` ou `descartar` — na chave que " +
    "equivale a esse gesto do formato: se a pessoa responder depois de você parar de esperar, " +
    "a marca vai para a fila e é gravada pelo caminho de sempre. · " +
  "ficha: { campos: [{ rotulo, valor, de, nota }], secoes: [{ titulo, linhas }] } · " +
  "texto: { markdown, editavel } · " +
  "escolha: { pergunta, opcoes: [{ chave, rotulo, custo }] } · " +
  "feedback: { guardei: [], faltaSaber: [], decidiSozinho: [] } · " +
  "laudo: { certo: [], errado: [], duvida: [] } · " +
  "formulario: { campos: [{ chave, rotulo, tipo, valor, opcoes, obrigatorio, de, nota }] } " +
    "com tipo em texto · texto-longo · numero · data · sim-nao · escolha · varias";

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
    dados: { type: "object", description: DADOS_POR_VISTA },
    blocos: {
      type: "array",
      maxItems: TETO_DE_BLOCOS,
      description: "NO LUGAR de `vista` e `dados`, quando a decisão depende de " +
        "ver duas coisas juntas — a ficha e o formulário, a lista e o texto. " +
        `De um a ${TETO_DE_BLOCOS} blocos; quatro coisas na mesma tela são duas ` +
        "telas. O `id` é obrigatório: é por ele que a resposta volta, em " +
        "`{ acao, blocos: { <id>: {...} } }`. Os botões continuam sendo os de " +
        "`acoes`, um conjunto só para a tela.",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "curto, sem espaço: `respostas`" },
          vista: { type: "string", enum: Object.keys(VISTAS) },
          titulo: { type: "string", description: "o rótulo do bloco. Opcional." },
          dados: { type: "object", description: "o mesmo formato de `dados`, pela vista" },
        },
        required: ["id", "vista", "dados"],
      },
    },
    acoes: {
      type: "array",
      description: "os botões do rodapé. Cada um vira uma intenção com essa " +
        "`chave` quando clicado. Sem isto, a tela é só de leitura. Num " +
        "`formulario`, campo obrigatório vazio segura o botão de tom `forte`, " +
        "e só ele.",
      items: {
        type: "object",
        properties: {
          chave: { type: "string" },
          rotulo: { type: "string", description: "o que a PESSOA vai fazer, " +
            "nunca o nome interno — “Eu mesmo mando”, e não “só o bloco”" },
          tom: { type: "string", enum: ["normal", "forte", "recusa"] },
          item: { type: "string", description: "o id do item de que a tela trata, " +
            "quando o botão equivale a um gesto sobre ele (D262)" },
          gesto: { type: "string", description: "`etapa:<nome da etapa>` ou " +
            "`descartar`, com `item`: se a pessoa apertar depois de você parar de " +
            "esperar, o clique vira decisão da fila, e é gravado pelo caminho de sempre" },
          nota: { type: "string", description: "com `gesto`: o que quem gravar a " +
            "decisão precisa saber — o arquivo que você já deixou pronto. Até 300 caracteres" },
        },
        required: ["chave", "rotulo"],
      },
    },
  },
  required: ["titulo"],
};

const sessao = criarSessao({ aoRegistrar: registrar, aoGuardar: (i) => guardarTardia(i) });
const base = criarBase({ aoRegistrar: registrar });
/* a fila de decisões mora ao lado da chave, e fora da base — ver `nucleo/fila.mjs` */
const fila = criarFila({ pasta: pastaDaChave(), aoRegistrar: registrar });

/* as etapas são as seções do `funil.md`: é o que impede a página de mandar
   um item para uma etapa que a base não tem. E a etapa de cada item AGORA,
   pelo primeiro id de cada linha — é o que envelhece a decisão velha (D234) */
const RE_ID = /\b\p{Lu}{1,4}-\d{1,6}\b/u;
async function lerFunil() {
  const etapaAgora = new Map();
  try {
    const secoes = (await base.arquivo("funil.md")).secoes || [];
    for (const s of secoes) {
      for (const i of s.itens || []) {
        const id = i.tipo === "linha" ? String(i.texto || "").match(RE_ID)?.[0] : "";
        if (id && !etapaAgora.has(id)) etapaAgora.set(id, s.titulo);
      }
    }
    return { etapas: secoes.map((s) => s.titulo), etapaAgora };
  } catch { return { etapas: [], etapaAgora: null }; }
}
const filaComEstado = async () =>
  fila.paraOAgente(base.raiz, { etapaAgora: (await lerFunil()).etapaAgora });

/* ── A RESPOSTA TARDIA (D238) ─────────────────────────────────────────
   Chegou sem ninguém esperando. As marcas cujo `gesto` a skill declarou
   viram entradas da FILA — e são gravadas pelo caminho de sempre, por
   qualquer skill. O resto (texto, campos, chave sem gesto) fica guardado
   como resposta, com o título da tela, para quem perguntou. */
const GESTO = /^(etapa:(.+)|descartar)$/;
const RE_ITEM_TARDIO = /^[\p{Lu}]{1,4}-\d{1,6}$/u;
function gestosDoDocumento(doc) {
  const de = new Map();
  const blocos = Array.isArray(doc?.blocos) ? doc.blocos : [{ id: null, dados: doc?.dados }];
  for (const b of blocos) {
    for (const d of b?.dados?.decisoes || []) {
      const m = String(d?.gesto || "").match(GESTO);
      if (d?.chave && m) de.set(`${b.id ?? ""} ${d.chave}`, m[2] ? { gesto: "etapa", para: m[2].trim() } : { gesto: "descartar" });
    }
  }
  return de;
}
function guardarTardia(intencao) {
  if (!base.ligada) return false;
  const doc = sessao.documento;
  (async () => {
    const gestos = gestosDoDocumento(doc);
    const funil = await lerFunil();
    const naFila = [];
    /* o apelido de cada item, do título que a skill escreveu na lista: sem ele
       a barra da fila mostrava "X-002 · X-002" */
    const nomes = new Map();
    const blocosDoc = Array.isArray(doc?.blocos) ? doc.blocos : [{ dados: doc?.dados }];
    for (const b of blocosDoc) {
      for (const g of b?.dados?.grupos || []) {
        for (const it of g?.itens || []) {
          if (it?.id) nomes.set(String(it.id), String(it.titulo || "").replace(/^[\p{Lu}]{1,4}-\d{1,6}\s*/u, "").replace(/^\((.*)\)$/, "$1").trim());
        }
      }
    }
    /* o botão do rodapé com gesto (D262): "Enviei", apertado depois que a
       execução acabou, é a mesma decisão que "Já me candidatei" no funil */
    const botao = (doc?.acoes || []).find((a) => a?.chave === intencao.acao);
    const doBotao = String(botao?.gesto || "").match(GESTO);
    if (doBotao && RE_ITEM_TARDIO.test(String(botao?.item || ""))) {
      try {
        await fila.marcar(base.raiz, { item: botao.item, gesto: doBotao[2] ? "etapa" : "descartar",
          para: doBotao[2]?.trim() || "", nome: String(doc?.titulo || "").match(/^[\p{Lu}]{1,4}-\d{1,6}\s*\(([^)]*)\)/u)?.[1] || "",
          motivo: "", nota: [botao.nota, intencao.comentario ? `recado: ${intencao.comentario}` : ""].filter(Boolean).join(" · ") }, funil);
        naFila.push(botao.item);
      } catch (e) { registrar(`resposta tardia · ${botao.item} não entrou na fila: ${e?.message || e}`); }
    }
    const porBloco = Array.isArray(doc?.blocos)
      ? Object.entries(intencao.blocos || {}).map(([id, e]) => [id, e?.decisoes || {}])
      : [[null, intencao.decisoes || {}]];
    for (const [bloco, decisoes] of porBloco) {
      for (const [item, chave] of Object.entries(decisoes)) {
        const g = gestos.get(`${bloco ?? ""} ${chave}`);
        if (!g) continue;
        try {
          await fila.marcar(base.raiz, { item, gesto: g.gesto, para: g.para || "", nome: nomes.get(item) || "", motivo: "" }, funil);
          naFila.push(item);
        } catch (e) { registrar(`resposta tardia · ${item} não entrou na fila: ${e?.message || e}`); }
      }
    }
    await fila.guardarResposta(base.raiz, {
      ...intencao, versao: Number(intencao.versao) || sessao.versao,
      titulo: String(doc?.titulo || ""), na_fila: naFila,
    });
    registrar(`resposta tardia guardada · “${doc?.titulo || ""}” · ${naFila.length} marca(s) na fila`);
  })().catch((e) => registrar(`resposta tardia: ${e?.message || e}`));
  return true;
}
const respostasTardias = async () => base.ligada ? fila.lerRespostas(base.raiz) : [];
const FACA_DAS_RESPOSTAS = "A pessoa respondeu tela(s) do painel enquanto ninguém esperava (`respostas`). " +
  "As marcas com gesto já estão na fila. O que sobrou é resposta à tela nomeada em `titulo`: " +
  "se você é a skill que a mostrou, trate como a resposta; senão, diga em uma linha o que chegou. " +
  "Chame `painel_fila` com `respostas_lidas: [<em>, …]` para tirá-las.";

/* ── OCUPADO FORA DO STDIO (D234) ─────────────────────────────────────
   O assistente que o botão lançou e a chamada de um hóspede correm por HTTP,
   e o vigia não os vê: sem este aviso, trocaria o processo no meio deles. */
let ocupacoes = 0;
const ocupar = () => { if (ocupacoes++ === 0) avisarOcupado(true); };
const liberar = () => { if (ocupacoes > 0 && --ocupacoes === 0) avisarOcupado(false); };

/* ── O PACK, E O QUE DÁ PARA PEDIR (D231, D232) ───────────────────────
   No pack instalado o painel mora em `<pack>/painel/`: o pack é a pasta de
   cima, e o `acoes.json` está ao lado deste arquivo. Na árvore-fonte não há
   pack em volta — `--pack <pasta>` aponta para um, e `--acoes <arquivo>`
   continua valendo para quem só quer ver a lista.

   A lista tem dois usos, e o segundo é o que pede cuidado: ela é o que o
   início MOSTRA, e é a LISTA FECHADA do que o botão pode disparar. */
const argumento = (nome) => {
  const i = process.argv.indexOf(nome);
  return i >= 0 ? resolve(process.argv[i + 1] || "") : "";
};
const PASTA_DO_PACK = argumento("--pack")
  || (existsSync(join(AQUI, "..", ".claude-plugin", "plugin.json")) ? join(AQUI, "..") : "");
const ARQUIVO_DE_ACOES = argumento("--acoes")
  || (argumento("--pack") ? join(PASTA_DO_PACK, "painel", "acoes.json") : join(AQUI, "acoes.json"));

async function lerAcoes() {
  try { return JSON.parse(await readFile(ARQUIVO_DE_ACOES, "utf8")); }
  catch { return { pack: "", pastas: {}, grupos: [] }; }
}

/* o molde do pack com o ajuste da base por cima (D244): o `painel.json` que
   o agente escreve na base quando a pessoa pede outro arranjo. Só a TELA lê
   isto — a lista fechada do que o botão pode chamar continua sendo a do pack */
async function acoesComABase() {
  const acoes = await lerAcoes();
  if (!base.ligada) return acoes;
  let bruto;
  try { bruto = await readFile(join(base.raiz, "painel.json"), "utf8"); } catch { return acoes; }
  try { return ajustarPelaBase(acoes, JSON.parse(bruto)); }
  catch (e) { return { ...acoes, daBase: [], avisos: [`o painel.json da base não é JSON válido: ${e?.message || e}`] }; }
}

/* o motor de documentos é IRMÃO do painel (`../documentos/`), e pack sem ele
   é pack que não tem prévia — o resto do painel não fica sabendo */
let documentosCarregados;
async function moduloDeDocumentos() {
  if (documentosCarregados !== undefined) return documentosCarregados;
  documentosCarregados = existsSync(join(AQUI, "..", "documentos", "nucleo", "documento.mjs"))
    ? await import("../documentos/nucleo/documento.mjs").catch(() => null) : null;
  return documentosCarregados;
}

/* ── O QUE A PESSOA LIGOU ENTRA NO `claude -p` (D271) ─────────────────
   O conector de tipo `mcp` com `ferramentas` no catálogo (o navegador) só é
   liberado ligado — e ligado se lê a CADA execução, não uma vez: desligar na
   tela vale para o próximo da fila. */
async function ferramentasDosConectores() {
  try {
    const { carregarCatalogo, nasceDesligado } = await import("../conectores/nucleo/catalogo.mjs");
    const { diretorio } = await import("../conectores/nucleo/cofre.mjs");
    const catalogo = await carregarCatalogo([join(DOS_CONECTORES, "catalogo.json"), ...catalogosExtras]);
    const com = Object.entries(catalogo).filter(([, c]) => c.tipo === "mcp" && c.ferramentas);
    return () => {
      let ligados = {};
      try { ligados = JSON.parse(readFileSync(join(diretorio(), "estado.json"), "utf8")) || {}; } catch { /* nenhum */ }
      return com.filter(([nome, c]) => !nasceDesligado(c) || ligados[nome]).map(([, c]) => c.ferramentas);
    };
  } catch { return () => []; }
}

let lancador = null;
async function oLancador() {
  if (lancador) return lancador;
  const { pack } = await lerAcoes();
  const liberaveis = await ferramentasDosConectores();
  lancador = criarLancador({
    pack, pastaDoPack: PASTA_DO_PACK,
    instalado: AQUI.includes(`${sep}.claude${sep}plugins${sep}`),
    pastaDeRegistro: pastaDaChave(),
    aoRegistrar: registrar,
    aoComecar: ocupar,
    aoTerminar: liberar,
    extras: liberaveis,
  });
  await lancador.pronto;
  return lancador;
}
/* a última execução é guardada com a base em que rodou: com outra base aberta,
   o resultado dela não é desta tela */
async function estadoDaExecucao() {
  const e = (await oLancador()).estado();
  return { ...e, ultima: e.ultima && e.ultima.base === base.raiz ? e.ultima : null };
}

/* a LISTA FECHADA mora em `nucleo/lancar.mjs` (`resolverLancamento`), onde a
   prova a alcança: é a propriedade de segurança do botão, e função que só
   existe dentro deste arquivo não se prova sem subir o stdio. */
const ESFORCO_EM_PT = { low: "baixo", medium: "médio", high: "alto", xhigh: "muito alto", max: "máximo" };
const resolver = async (pedido) => {
  const acoes = await lerAcoes();
  return resolverLancamento(pedido, {
    grupos: acoes.grupos, pastas: acoes.pastas || {}, fila: acoes.fila || "",
    esforco: acoes.esforco || {},
    arvore: (await base.mapa()).arvore,
  });
};

/* a última base dita a este painel, para o processo novo saber onde estava
     (ver o fim do arquivo). É estado do painel, ao lado da chave. */
const ARQUIVO_DA_BASE = join(pastaDaChave(), "ultima-base");
const ARQUIVO_DE_ABERTO = join(pastaDaChave(), "aberto-por");
async function lembrarBase() {
  try {
    await mkdir(pastaDaChave(), { recursive: true });
    await writeFile(ARQUIVO_DA_BASE, base.raiz, "utf8");
  } catch { /* lembrar é conforto: não pode derrubar o `painel_inicio` */ }
}

/* ── HÁ AGENTE DO OUTRO LADO? ─────────────────────────────────────────
   Em `--base` não há: o painel sobe sozinho, só de leitura, e o botão de
   pedir alguma coisa fica desligado dizendo que não há sessão aberta. Um
   botão que aceita o pedido e o guarda para um agente que nunca virá é pior
   que um botão desligado — a pessoa escreve e acha que mandou. */
let temAgente = true;
/* um painel que subiu sozinho, em `--base`, tem assistente do outro lado
   enquanto um HÓSPEDE (`nucleo/hospede.mjs`) manda o sinal de presença — a
   cada 30 s, com a sessão dele aberta (D243). Três sinais perdidos e a conversa é dada como fechada: "chamou nos
   últimos 20 minutos", que era a regra, dizia conectado muito depois de ela
   fechar. Uma chamada de ferramenta conta como sinal. */
const PRESENCA_MS = Number(process.env.KAPSTAN_PRESENCA_MS) || 30_000;
let ultimaPresenca = 0;
const haAgente = () => temAgente || sessao.esperando || Date.now() - ultimaPresenca < PRESENCA_MS * 3;

/* ── OS CONECTORES, QUANDO O PACK OS TRAZ ─────────────────────────────
   `conectores/` é IRMÃO de `painel/` — na árvore-fonte e dentro do pack
   instalado, onde o montador põe `<pack>/painel/` e `<pack>/conectores/`
   lado a lado. Os dois viajam juntos ou nenhum viaja, e o import relativo
   vale nos dois lugares.

   "Ou nenhum" é um caso real: um pack pode não ter conector nenhum, e um
   painel que quebrasse por causa disso seria um painel que não abre por
   falta do que não é obrigatório. Sem o diretório, a tela de conectores diz
   que este pack não os traz, e o resto do painel não fica sabendo.

   ── POR QUE ISTO NÃO É UMA FERRAMENTA ──────────────────────────────
   Ligar conector, guardar chave e mudar teto são gestos da PESSOA. Eles
   entram no painel como ROTAS, atrás das mesmas quatro guardas de
   `nucleo/http.mjs`, e nunca no `tools/list` — ver o cabeçalho de
   `conectores/nucleo/painel.mjs` sobre a brecha que sobra (o agente com
   ferramenta de navegador) e sobre o segundo clique que a estreita.

   `--catalogo <arquivo>` repete e funde uma camada, igual ao servidor de
   conectores: na árvore-fonte é como se abre o painel com o catálogo de um
   pack. No pack instalado o montador já entregou um `catalogo.json` fundido
   ao lado, e ninguém passa nada. */
const DOS_CONECTORES = join(AQUI, "..", "conectores");
const catalogosExtras = [];
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === "--catalogo") catalogosExtras.push(resolve(process.argv[++i] || ""));
}
let temConectores = false;

async function portaDeConectores() {
  if (!existsSync(join(DOS_CONECTORES, "nucleo", "painel.mjs"))) return null;
  try {
    const { carregarCatalogo } = await import("../conectores/nucleo/catalogo.mjs");
    const { criarConectores } = await import("../conectores/nucleo/conectores.mjs");
    const { criarPortaDeConectores } = await import("../conectores/nucleo/painel.mjs");
    const catalogo = await carregarCatalogo(
      [join(DOS_CONECTORES, "catalogo.json"), ...catalogosExtras]);
    const conectores = criarConectores({
      catalogo,
      /* a linha que o humano digitaria. Ela não vai para a tela — o painel
         existe para ninguém precisar dela —, mas o miolo a escreve dentro
         das recusas dele, e `conectores/nucleo/painel.mjs` as traduz */
      comando: `node "${join(DOS_CONECTORES, "servidor.mjs")}"`,
      raizDosAdaptadores: pathToFileURL(DOS_CONECTORES + "/"),
      aoRegistrar: registrar,
    });
    /* a janela de login (D272) abre o mesmo navegador que imprime os documentos */
    const { acharNavegador } = await import("../documentos/nucleo/imprimir.mjs").catch(() => ({}));
    return criarPortaDeConectores({ catalogo, conectores, aoRegistrar: registrar, acharNavegador });
  } catch (e) {
    /* catálogo torto não pode derrubar o painel: o resto dele — a base, a
       tarefa — continua valendo, e a tela de conectores diz o que houve */
    registrar(`os conectores não subiram: ${e?.message || e}`);
    return null;
  }
}

/* ── O PAINEL SÓ SOBE QUANDO ALGUÉM O PEDE ────────────────────────────
   Abrir a porta no `initialize` poria um servidor HTTP de pé em toda sessão
   do Claude Code que tivesse o plugin instalado, inclusive nas que nunca
   chamam o painel. Ele sobe na primeira `painel_mostrar` (ou `painel_inicio`)
   e morre com o processo. */
let aberto = null;
async function garantirAberto() {
  if (aberto) return aberto;
  /* lida a cada pedido, e não uma vez: ver a nota em `nucleo/http.mjs` */
  const html = () => readFile(join(AQUI, "painel.html"), "utf8");
  await html();                    // sem o arquivo, falha AQUI, com a mensagem de sempre
  const conectores = await portaDeConectores();
  temConectores = !!conectores;
  aberto = await abrirPainel({
    html,
    aoRegistrar: registrar,
    segredo: await chaveDaMaquina({ aoRegistrar: registrar }),
    rotas: {
      /* as seis dos conectores vêm primeiro e não colidem com nenhuma
         daqui — nomear uma rota `/conectores…` em duas tabelas seria o
         mesmo defeito das duas chaves `mural` no package.json */
      ...(conectores?.rotas || {}),

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

      /* ── O ESTADO, que é o que a casa pergunta e a tarefa não ──────
         Três coisas que mudam SEM o documento mudar: se a base está ligada,
         se há agente, e se ele está pendurado agora. O longo poll do
         `/documento` não serve para isso — ele só volta quando a VERSÃO
         muda, e nenhuma das três mexe nela. Esta rota é barata e a página a
         chama no foco, depois de cada volta do poll e depois de cada
         intenção: uma por 25 segundos, no pior caso. */
      /* ── A PORTA DO HÓSPEDE (D232) ─────────────────────────────────
         Outro servidor de painel desta máquina, que achou este de pé, repassa
         para cá as chamadas de ferramenta dele — inteiras. O que roda é a
         MESMA função que rodaria por stdio: não há uma segunda implementação
         de `mostrar` para divergir da primeira. Está atrás das quatro
         guardas, e quem a chama provou ter a chave desta máquina. */
      "POST /agente/chamar": async ({ corpo, res }) => {
        const f = locais.find((x) => x.name === corpo?.ferramenta);
        if (!f) throw Object.assign(new Error("ferramenta desconhecida"), { codigo: 404 });
        ultimaPresenca = Date.now();
        registrar(`um hóspede chamou ${f.name}`);
        /* libera quando a RESPOSTA sai, e não quando a ferramenta volta: o vigia
           troca o servidor no instante do aviso, e a resposta escrita depois
           morria no caminho — o hóspede recebia conexão caída (CI Linux, 24/09) */
        ocupar();
        res.once("close", liberar);
        return await f.executar(corpo.args || {});
      },

      "POST /agente/presenca": async () => { ultimaPresenca = Date.now(); return { ok: true }; },

      "GET /estado": async () => ({
        /* a versão da PÁGINA que está no disco. A aba guarda a que carregou e,
           quando as duas divergem, oferece atualizar — ver `Painel.svelte` */
        pagina: await stat(join(AQUI, "painel.html")).then((s) => Math.round(s.mtimeMs)).catch(() => 0),
        /* é por este campo, atrás da chave, que um hóspede reconhece o anfitrião */
        painel: "kapstan",
        /* a execução disparada pelo painel: se dá, se há uma rodando, e a última */
        execucao: await estadoDaExecucao(),
        /* quantas decisões esperam o assistente (D232): é o número do menu */
        fila: base.ligada ? (await fila.ler(base.raiz)).length : 0,
        /* e quantas respostas tardias (D238) */
        respostas: (await respostasTardias()).length,
        agente: haAgente(),
        /* o painel sempre ligado (D243): se ESTE processo é o solto, se ele sobe
           com o login, e a linha que o liga — a página Conta mostra os três */
        sempre: base.ligada ? { solto: !!process.env.KAPSTAN_SEMPRE, noLogin: existsSync(atalhoDoLogin()),
          comando: `node "${join(AQUI, "sempre.mjs")}" --instalar --base "${base.raiz}"` } : null,
        esperando: sessao.esperando,
        temTarefa: sessao.temTarefa,
        versao: sessao.versao,
        /* um booleano, e não a ficha da base: quem precisa do título e da
           raiz pede `/base`. Repetir os dois aqui daria duas fontes para o
           mesmo dado, e a segunda envelheceria na primeira troca de base */
        base: base.ligada,
        /* e outro: se este pack traz conectores. É o que decide se a
           entrada fixa do menu aparece — um item de menu que abre sempre
           numa tela dizendo "aqui não tem nada" é pior que item nenhum */
        conectores: temConectores,
      }),

      /* ── A BASE, SÓ DE LEITURA ─────────────────────────────────────
         As duas rotas passam pelas MESMAS quatro guardas de `http.mjs` — não
         há caminho de leitura que contorne a chave —, e as guardas de
         caminho moram em `nucleo/base.mjs`. */
      "GET /base": () => base.mapa(),
      "GET /base/arquivo": ({ url }) => base.arquivo(url.searchParams.get("caminho")),
      /* os cabeçalhos de uma pasta inteira, para a tabela dos itens (D274) */
      "GET /base/fichas": ({ url }) => base.fichas(url.searchParams.get("pasta")),
      /* ── OS DOCUMENTOS, SÓ PARA LER (D270) ─────────────────────────────
         A prévia é o MESMO HTML que vira PDF (`montarHtml`), e o PDF é o que
         a skill gerou. Nenhuma das duas escreve: gerar é do servidor de
         documentos, chamado pela skill. A prévia sai com uma CSP sem script —
         é texto da base desenhado, e nada nela precisa rodar. */
      "GET /base/documento": async ({ url, res }) => {
        const docs = await moduloDeDocumentos();
        if (!docs) throw Object.assign(new Error("este pack não traz os documentos"), { codigo: 404 });
        const lido = await base.arquivo(url.searchParams.get("caminho"));
        const { html } = await docs.montarHtml(lido.texto, url.searchParams.get("modelo"), docs.pastasDeModelos(PASTA_DO_PACK));
        const corpo = Buffer.from(html, "utf8");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Content-Length": corpo.length,
          "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer",
          "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; font-src data:; img-src data:; base-uri 'none'; form-action 'none'" });
        res.end(corpo);
      },
      "GET /base/pdf": async ({ url, res }) => {
        const caminho = String(url.searchParams.get("caminho") || "");
        const corpo = await base.pdf(caminho);
        res.writeHead(200, { "Content-Type": "application/pdf", "Content-Length": corpo.length, "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "Content-Disposition": `inline; filename="${caminho.split("/").pop().replace(/[^\w.-]/g, "_")}"` });
        res.end(corpo);
      },
      /* o que mudou desde a última visita — que é do navegador (D234) */
      "GET /base/mudancas": ({ url }) => base.mudancas(url.searchParams.get("desde")),

      /* ── O QUE DÁ PARA PEDIR (D231) ────────────────────────────────
         `acoes.json` é derivado do README do pack pelo montador e mora ao
         lado deste arquivo no pack instalado. Na árvore-fonte não há pack:
         `--acoes <arquivo>` aponta para o de um. Sem ele a lista vem vazia e
         o início não desenha a seção — não é defeito, é painel sem pack. */
      "GET /acoes": () => acoesComABase(),

      /* ── CHAMAR O ASSISTENTE PELO PAINEL (D232) ────────────────────
         Três rotas, e a do meio é a que gasta: por isso ela tem o segundo
         clique, como ligar um conector. A lista é fechada em
         `resolverLancamento`; o limite de uma execução por vez, o teto de
         tempo e o registro do custo moram em `nucleo/lancar.mjs`. */
      "GET /lancar": () => estadoDaExecucao(),
      "POST /lancar": async ({ corpo }) => {
        const l = await oLancador();
        if (!base.ligada) throw Object.assign(new Error("não há base aberta no painel"), { codigo: 400 });
        const { nome, prompt, esforco = "" } = await resolver(corpo || {});
        const agora = l.estado();
        if (corpo?.confirmo !== true) {
          const antes = await l.daUltimaVez(String(corpo?.o), prompt, esforco);
          /* com uma rodando, o pedido entra na fila (D271) — e o aviso diz */
          const naFrente = agora.rodando ? 1 + agora.fila.length : 0;
          const dolar = (v) => "US$ " + v.toFixed(2).replace(".", ",");
          return {
            precisa_confirmar: true, oque: nome, fila: naFrente,
            aviso: (naFrente
              ? `O assistente já está trabalhando em “${agora.rodando.nome}”: este pedido entra na fila` +
                (naFrente > 1 ? `, com ${naFrente - 1} na frente,` : "") +
                " e começa sozinho quando chegar a vez. Ele consome do seu plano do Claude "
              : "Isto chama o assistente agora, e consome do seu plano do Claude ") +
              `(modelo Opus${esforco ? `, esforço ${ESFORCO_EM_PT[esforco] || esforco}` : ""}). ` + (antes
                ? `Da última vez que você pediu isto, custou ${dolar(antes.custo)} e levou ` +
                  `${antes.minutos} ${antes.minutos === 1 ? "minuto" : "minutos"}. `
                : "Costuma levar de um a quinze minutos e custar de um a três dólares; " +
                  "depois da primeira vez, o valor medido aparece aqui. ") +
              "Se ele precisar de uma resposta sua no meio, a pergunta aparece aqui no painel.",
          };
        }
        /* quem ocupa e libera é o lançador, a cada execução — da fila também */
        return l.lancar({ o: String(corpo.o), nome, prompt, base: base.raiz, naFila: true, esforco });
      },
      "POST /lancar/parar": async () => (await oLancador()).parar(),
      "POST /lancar/fila": async ({ corpo }) =>
        (await oLancador()).mexerNaFila({ acao: String(corpo?.acao || ""), n: corpo?.n }),

      /* ── A FILA DE DECISÕES (D232) ─────────────────────────────────
         A pessoa marca quando quiser; o assistente grava quando vier. As
         três rotas escrevem em `~/.kapstan/painel/`, NUNCA na base. */
      "GET /fila": async () => ({ decisoes: base.ligada ? await filaComEstado() : [],
        respostas: await respostasTardias() }),
      /* a pessoa dispensa uma resposta tardia que não quer mais entregar (D238) */
      "POST /fila/resposta/tirar": async ({ corpo }) => {
        if (!base.ligada) throw Object.assign(new Error("não há base aberta no painel"), { codigo: 400 });
        await fila.concluirRespostas(base.raiz, [corpo?.em]);
        return { respostas: await respostasTardias() };
      },
      "POST /fila": async ({ corpo }) => {
        if (!base.ligada) throw Object.assign(new Error("não há base aberta no painel"), { codigo: 400 });
        await fila.marcar(base.raiz, corpo || {}, await lerFunil());
        return { decisoes: await filaComEstado() };
      },
      /* o motivo do descarte, escrito depois do clique (D234) */
      "POST /fila/motivo": async ({ corpo }) => {
        if (!base.ligada) throw Object.assign(new Error("não há base aberta no painel"), { codigo: 400 });
        await fila.anotar(base.raiz, corpo || {});
        return { decisoes: await filaComEstado() };
      },
      /* "gravar agora": só tem efeito com o assistente parado no painel. Vira
         um PEDIDO — a mesma porta do "pedir algo sobre isto" —, e ele lê a
         fila por `painel_fila`: um caminho só para a fila chegar a ele. */
      "POST /fila/mandar": async () => {
        if (!haAgente()) return { aceita: false, motivo: "não há conversa aberta agora" };
        if (!(await fila.ler(base.raiz)).length && !(await respostasTardias()).length) {
          return { aceita: false, motivo: "a fila está vazia" };
        }
        return sessao.registrarPedido({
          pedido: "Grave as decisões que eu marquei no painel — elas estão em `painel_fila`, junto com o que respondi.",
          sobre: "",
        });
      },

      /* e o único gesto da casa que sai dela: o pedido */
      "POST /pedido": ({ corpo }) => {
        if (!haAgente()) {
          return { aceita: false, motivo: "não há sessão aberta — este painel " +
            "subiu sozinho, só para ler" };
        }
        return sessao.registrarPedido(corpo || {});
      },
    },
  });
  registrar(`painel de pé em ${aberto.url}`);
  /* quem abriu foi ESTE vigia: é o que autoriza o processo seguinte a reabrir
     sozinho. Sem a marca, uma troca de código poria um servidor HTTP de pé
     numa sessão que nunca pediu painel — o contrário da regra acima. */
  if (process.env.KAPSTAN_VIGIADO) {
    await mkdir(pastaDaChave(), { recursive: true }).catch(() => {});
    await writeFile(ARQUIVO_DE_ABERTO, String(process.ppid), "utf8").catch(() => {});
  }
  return aberto;
}

/* ── A FRASE QUE O AGENTE REPASSA ─────────────────────────────────────
   Ela diz o endereço CURTO, que é o que passa a valer, e o inteiro, que é o
   que precisa ser aberto uma vez para o curto começar a valer. Dizer só o
   curto faria a primeira abertura cair numa tela que pede a chave; dizer só
   o inteiro jogaria fora o que o D230 foi buscar.

   E ela avisa quando a porta ANDOU: 4180 ocupada é o caso normal de quem
   tem dois packs abertos, e "abra 127.0.0.1:4180" com o painel na 4181 é uma
   instrução que leva a pessoa à ferramenta errada. */
const comoAbrir = ({ url, curto, andou, porta }) =>
  (andou ? `a porta de sempre estava ocupada, então o painel subiu na ${porta}. ` : "") +
  `Abra ${url} — desta vez inteiro, com o que vem depois do #. ` +
  `Depois disso ${curto} abre sozinho.`;

const locais = [
  {
    name: "painel_inicio",
    title: "Abrir a página inicial do painel",
    description:
      "Aponta o painel para a pasta da base e abre a PÁGINA INICIAL dela — o " +
      "mapa do INDICE.md, a lista do dia, o funil por etapa, cada arquivo com " +
      "a procedência de cada campo, e o que está conectado. Chame uma vez, no " +
      "começo de toda execução que tem uma base, com o caminho inteiro da " +
      "pasta. O endereço é sempre o mesmo naquela máquina: diga-o na primeira " +
      "execução do dia e não repita. A página inicial fica de pé entre uma " +
      "tarefa e outra, e a tela de `painel_mostrar` aparece DENTRO dela — " +
      "nada muda no par mostrar/esperar. Ela LÊ a base e NÃO grava nada: o " +
      "que a pessoa fizer ali volta como intenção, e quem grava é você. Pode " +
      "voltar pelo `painel_esperar`, sem você ter mostrado nada, " +
      "`{ acao: \"pedir\", pedido, sobre }` — é a pessoa pedindo alguma coisa a " +
      "partir do arquivo que está lendo; trate como a mesma frase dita no " +
      "terminal.",
    inputSchema: {
      type: "object",
      properties: {
        base: {
          type: "string",
          description: "o caminho inteiro da pasta da base — a mesma que está " +
            "na linha do topo do INDICE.md. A pasta precisa ter um INDICE.md " +
            "dentro; sem ele não é a pasta da base.",
        },
      },
      required: ["base"],
    },
    async executar(args) {
      /* registrar ANTES de abrir a porta, pela mesma razão de `conferirTela`
         vir antes lá em cima: caminho errado não deixa um servidor HTTP de pé
         por causa de uma pasta que não existe. */
      const { titulo } = await base.registrar(args.base);
      await lembrarBase();
      const painel = await garantirAberto();
      const pendentes = await filaComEstado();
      const respostas = await respostasTardias();
      return {
        painel: painel.url,
        diga: `${titulo || "A base"} está no painel. ${comoAbrir(painel)}`,
        /* a fila vem JUNTO com o início porque toda skill chama o início ao
           começar: é o único momento em que é certo que o assistente olha */
        ...(pendentes.length ? {
          fila: pendentes,
          faca: `A pessoa deixou ${pendentes.length} decisão(ões) marcada(s) no painel. ` +
            "Grave-as ANTES de qualquer outra coisa, como se cada `frase` tivesse sido " +
            "dita no terminal, com a procedência `← <quem>, no painel, AAAA-MM-DD`. " +
            "Depois chame `painel_fila` com `gravadas` — só os itens que você gravou — " +
            "e diga em uma linha o que gravou.",
        } : {}),
        ...(respostas.length ? { respostas, faca_respostas: FACA_DAS_RESPOSTAS } : {}),
      };
    },
  },
  {
    name: "painel_fila",
    title: "Ler e confirmar a fila de decisões do painel",
    description:
      "A pessoa pode decidir SEM você estar perguntando: na página inicial ela " +
      "marca que um item passa para outra etapa, ou que sai. Essas marcas " +
      "ficam numa fila do painel, fora da base, até você gravar. Sem " +
      "argumento, devolve a fila — cada decisão com `item`, `gesto` " +
      "(`etapa` ou `descartar`), `para`, `de`, `motivo` e a `frase` pronta; " +
      "trate cada frase como dita no terminal, e grave pelas regras de sempre " +
      "(etapa, histórico, índices, contadores), com a procedência " +
      "`← <quem>, no painel, AAAA-MM-DD`. Com `gravadas: [\"V-001\", …]` tira " +
      "da fila SÓ o que você gravou de verdade — o que falhou fica esperando. " +
      "`painel_inicio` já devolve a fila quando há; use esta para reler, e " +
      "sempre para confirmar. Devolve também `respostas`: telas que a pessoa " +
      "respondeu quando ninguém esperava — as marcas com gesto já viraram fila; " +
      "o resto é resposta à tela em `titulo`. `respostas_lidas: [<em>, …]` as tira.",
    inputSchema: {
      type: "object",
      properties: {
        gravadas: {
          type: "array",
          items: { type: "string" },
          description: "os ids que você acabou de gravar na base, e só eles",
        },
        respostas_lidas: {
          type: "array",
          items: { type: "string" },
          description: "o `em` de cada resposta tardia que você já tratou",
        },
      },
    },
    async executar(args) {
      if (!base.ligada) throw new Error("não há base registrada — chame `painel_inicio` antes");
      const saida = {};
      if (Array.isArray(args.gravadas) && args.gravadas.length) {
        Object.assign(saida, await fila.concluir(base.raiz, args.gravadas));
      }
      if (Array.isArray(args.respostas_lidas) && args.respostas_lidas.length) {
        saida.respostas_tiradas = (await fila.concluirRespostas(base.raiz, args.respostas_lidas)).saiu;
      }
      const respostas = await respostasTardias();
      return { ...saida, fila: await filaComEstado(),
        ...(respostas.length ? { respostas, faca_respostas: FACA_DAS_RESPOSTAS } : {}) };
    },
  },
  {
    name: "painel_mostrar",
    title: "Mostrar no painel",
    description:
      "Desenha alguma coisa no painel do navegador e devolve o endereço dele. " +
      "Use quando o que você tem para mostrar é uma LISTA, uma FICHA, um TEXTO " +
      "para aprovar, uma ESCOLHA entre caminhos, um FORMULÁRIO para a pessoa " +
      "conferir campo a campo, o FECHO do que você fez, ou um LAUDO — ou seja, " +
      "sempre que a resposta seria uma tabela ou um formulário rolando no " +
      "terminal. Vários itens para julgar são UMA lista com `decisoes`, e não " +
      "uma tela por item. Duas coisas que se decidem juntas vão em `blocos`. " +
      "Não bloqueia: desenha e volta na hora. Para esperar a pessoa agir, " +
      "chame `painel_esperar` depois. O painel NÃO grava nada na base — quem " +
      "grava é você, com as regras do contrato, depois de receber a intenção.",
    inputSchema: ESQUEMA_MOSTRAR,
    async executar(args) {
      /* a conferência vem ANTES de abrir a porta: tela recusada não deixa um
         servidor HTTP de pé por causa de um nome de vista errado. */
      const tela = conferirTela(args, VISTAS);
      const jaEstava = !!aberto;
      const painel = await garantirAberto();
      const versao = sessao.mostrar({
        ...tela,
        titulo: String(args.titulo || ""),
        linha: args.linha ? String(args.linha) : "",
        acoes: Array.isArray(args.acoes) ? args.acoes : [],
      });
      return {
        painel: painel.url,
        versao,
        /* a frase que o agente repassa a quem está lendo o terminal. Sem ela,
           o painel abre e a pessoa não sabe que abriu — a tela do terminal
           continua sendo onde ela está olhando.

           Na segunda tela em diante ela NÃO repete o endereço: a aba já está
           aberta, e repetir uma URL a cada passo é o ruído que faz parar de
           ler o terminal. */
        diga: jaEstava ? "A tela nova está no painel." : comoAbrir(painel),
      };
    },
  },
  {
    name: "painel_esperar",
    title: "Esperar a pessoa no painel",
    description:
      "Bloqueia até a pessoa clicar em alguma coisa no painel e devolve o que " +
      "ela fez. Use logo depois de `painel_mostrar` com `acoes`. Devolve " +
      "`{ acao, item, escolha, texto }` — com `campos` quando a vista era " +
      "`formulario`, com `decisoes: { <id do item>: <chave> }` quando a lista " +
      "tinha `decisoes` (só o que ela MARCOU: item ausente não foi julgado, e " +
      "não é recusa), e com `blocos: { <id>: {...} }` quando a tela tinha " +
      "`blocos` — ou `{ expirou: true }` se ninguém agiu dentro do tempo. A " +
      "tela continua no painel e o que a pessoa responder depois fica GUARDADO: " +
      "se ela ainda está olhando (uma pilha grande leva mais que o teto), chame " +
      "de novo, até três vezes na mesma tela; senão siga em texto e diga que a " +
      "resposta chega por `painel_inicio` na próxima vez. Uma resposta guardada " +
      "para a tela atual volta na hora, com `tardia: true`.",
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
      /* uma resposta GUARDADA para esta mesma tela (mesmo título) volta na
         hora — é o caso do agente que reabre a pilha depois de expirar (D238) */
      const doc = sessao.documento;
      const guardada = (await respostasTardias()).find((r) => r.titulo && r.titulo === doc?.titulo);
      if (guardada) {
        await fila.concluirRespostas(base.raiz, [guardada.em]);
        const { titulo: _t, na_fila, ...resposta } = guardada;
        return { ...resposta, tardia: true, na_fila,
          diga: "A pessoa respondeu esta tela enquanto ninguém esperava; a resposta estava guardada" +
            (na_fila?.length ? `, e ${na_fila.length} marca(s) já foram para a fila` : "") + "." };
      }
      const intencao = await sessao.aguardarIntencao(segundos * 1000);
      if (!intencao) {
        return {
          expirou: true,
          esperei: segundos,
          diga: "Ninguém mexeu no painel ainda. A tela continua lá, e o que a pessoa " +
            "responder fica guardado. Se ela ainda está olhando, espere de novo; " +
            "senão sigo em texto, e a resposta chega no próximo `painel_inicio`.",
        };
      }
      return intencao;
    },
  },
];

/* ── UM PAINEL SÓ POR MÁQUINA (D232) ──────────────────────────────────
   As ferramentas que o stdio entrega são as locais, embrulhadas: antes de
   abrir porta, este processo procura um painel desta máquina já de pé — e, se
   acha, repassa a chamada em vez de executar. Ver `nucleo/hospede.mjs`.

   A procura se refaz a cada `painel_inicio`, que é onde a base é dita: um
   anfitrião com OUTRA base não serve. E quem já abriu a própria porta não
   procura mais — virar hóspede no meio da conversa deixaria uma aba aberta
   apontando para um servidor mudo. */
let anfitriao = null;
let jaProcurei = false;
async function anfitriaoPara(nome, args) {
  if (aberto) return null;
  if (!jaProcurei || nome === "painel_inicio") {
    jaProcurei = true;
    anfitriao = await acharAnfitriao({
      segredo: await chaveDaMaquina({ aoRegistrar: registrar }),
      portaInicial: Number(process.env.PAINEL_PORTA || 4180),
      base: nome === "painel_inicio" ? String(args?.base || "") : "",
    }).catch(() => null);
    if (anfitriao) registrar(`já há um painel desta máquina na porta ${anfitriao.porta} — viro hóspede dele`);
  }
  return anfitriao;
}
/* ── LANÇADO PELO BOTÃO (D234) ────────────────────────────────────────
   Quem pediu está olhando a aba, e o endereço com a chave só iria parar no
   "ver o que ele disse". Vale também quando quem respondeu foi o anfitrião,
   que não sabe quem o chamou — por isso mora aqui, no embrulho. */
const semEndereco = (nome, r) => !process.env.KAPSTAN_LANCADO || !r?.diga ? r
  : { ...r, diga: nome === "painel_inicio"
    ? "Quem pediu está olhando o painel: não diga o endereço."
    : "A tela nova está no painel." };

const ferramentas = locais.map((f) => ({
  ...f,
  async executar(args) {
    const a = await anfitriaoPara(f.name, args);
    if (a) {
      try { return semEndereco(f.name, await a.chamar(f.name, args)); } catch (e) {
        /* o anfitrião morreu no meio (a sessão dele fechou). O trabalho não
           para por isso: este processo sobe o próprio painel e segue. */
        registrar(`o painel anfitrião não respondeu (${e?.message || e}) — subo o meu`);
        anfitriao = null;
      }
    }
    return semEndereco(f.name, await f.executar(args));
  },
}));

/* ── A DEMONSTRAÇÃO, que é também o teste de fumaça ────────────────────
   `node painel/servidor.mjs --demonstracao` abre o painel com uma tela de
   exemplo e imprime o endereço. Serve para duas coisas que normalmente
   exigiriam duas ferramentas:

   · VER a interface enquanto se mexe nela, sem precisar de um agente do
     outro lado nem de uma base montada
   · PROVAR, numa linha, que as três guardas do servidor estão de pé — a
     página abre com a chave e não abre sem ela

   `--demonstracao formulario`, `lote` e `blocos` abrem as três telas que
   chegaram depois. Elas passam por `conferirTela`, como as do agente: uma
   demonstração que pulasse a conferência provaria uma tela que o agente não
   consegue mandar.

   Os dados são inventados e genéricos de propósito: este arquivo mora no
   motor e é copiado para todo pack, então um exemplo de ofício aqui seria a
   palavra do ofício vazando para o lugar que o `conferir` vigia.

   O `setInterval` existe porque o servidor HTTP está `unref`-ado (ver
   `nucleo/http.mjs`): sem alguém segurando o laço de eventos, o processo
   sairia no instante em que terminasse de subir. */
const FORMULARIO_DE_EXEMPLO = {
  campos: [
    { chave: "nome", rotulo: "Nome completo", tipo: "texto",
      valor: "Pessoa de Exemplo", de: "perfil.md", obrigatorio: true },
    { chave: "desde", rotulo: "Disponível a partir de", tipo: "data",
      valor: "?", obrigatorio: true, nota: "o primeiro dia em que você pode começar" },
    { chave: "anos", rotulo: "Anos de experiência", tipo: "numero",
      valor: 14, de: "perfil.md" },
    { chave: "distancia", rotulo: "Aceita trabalhar à distância", tipo: "sim-nao",
      valor: true, de: "perfil.md" },
    { chave: "regime", rotulo: "Regime", tipo: "escolha", valor: "b",
      opcoes: [{ chave: "a", rotulo: "Regime A" }, { chave: "b", rotulo: "Regime B" },
        { chave: "c", rotulo: "Tanto faz" }], de: "perfil.md" },
    { chave: "temas", rotulo: "Temas de interesse", tipo: "varias",
      valor: ["um"], opcoes: ["um", "dois", "três"] },
    { chave: "porque", rotulo: "Por que este item", tipo: "texto-longo",
      valor: "Um parágrafo que o agente escreveu e a pessoa pode corrigir.",
      de: "rascunho do agente" },
  ],
};
const DEMONSTRACOES = {
  lista: {
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
  },
  formulario: {
    vista: "formulario",
    titulo: "Exemplo — confira antes de sair",
    linha: "O que tem seta veio de algum lugar. O que está em âmbar, só você sabe.",
    dados: FORMULARIO_DE_EXEMPLO,
    acoes: [
      { chave: "mandar", rotulo: "Está certo, pode ir", tom: "forte" },
      { chave: "depois", rotulo: "Vejo depois" },
      { chave: "parar", rotulo: "Não mande", tom: "recusa" },
    ],
  },
  lote: {
    vista: "lista",
    titulo: "Exemplo — cinco linhas, quatro para julgar",
    linha: "Marque o que quiser e aperte o botão. O que ficar sem marca não foi julgado.",
    dados: {
      decisoes: [
        { chave: "vale", rotulo: "Vale" },
        { chave: "talvez", rotulo: "Talvez" },
        { chave: "fora", rotulo: "Não vale", tom: "recusa" },
      ],
      grupos: [
        { rotulo: "Nota alta", itens: [
          { id: "X-001", marca: "9", titulo: "X-001 (primeiro exemplo)",
            linha: "Bate com três dos quatro critérios." },
          { id: "X-002", marca: "8", titulo: "X-002 (segundo exemplo)",
            linha: "Bate com dois, e o terceiro é dúvida." },
        ] },
        { rotulo: "Nota média", itens: [
          { id: "X-003", marca: "6", titulo: "X-003 (terceiro exemplo)",
            linha: "Falta saber o principal." },
          { id: "X-004", marca: "5", titulo: "X-004 (quarto exemplo)",
            linha: "Está longe, mas o resto serve." },
          { marca: "—", titulo: "linha sem id",
            linha: "Não ganha seletor: não há por onde a resposta voltar." },
        ] },
      ],
    },
    acoes: [
      { chave: "gravar", rotulo: "Gravar o que marquei", tom: "forte" },
      { chave: "parar", rotulo: "Parar por aqui", tom: "recusa" },
    ],
  },
  blocos: {
    titulo: "Exemplo — a ficha, o formulário e o texto, juntos",
    linha: "Três blocos é o teto. A resposta volta pelo id de cada um.",
    blocos: [
      { id: "item", vista: "ficha", titulo: "O item", dados: {
        campos: [
          { rotulo: "o quê", valor: "X-001 (exemplo)", de: "link, 2026-09-19" },
          { rotulo: "prazo", valor: "?", nota: "a página não diz" },
        ],
      } },
      { id: "respostas", vista: "formulario", titulo: "O que vai ser respondido",
        dados: { campos: FORMULARIO_DE_EXEMPLO.campos.slice(0, 3) } },
      { id: "carta", vista: "texto", titulo: "O texto que acompanha",
        dados: { markdown: "Bom dia.\n\nEste é o texto que iria junto.\n\nAbraço." } },
    ],
    acoes: [
      { chave: "mandar", rotulo: "Está certo, pode ir", tom: "forte" },
      { chave: "parar", rotulo: "Não mande", tom: "recusa" },
    ],
  },
};

/* ── O MODO AVULSO · `node painel/servidor.mjs --base <pasta>` ─────────
   O painel sem agente: sobe a página inicial só de leitura e imprime o
   endereço. Serve para duas coisas que valem por si —

   · ABRIR a base para olhar, sem sessão de agente nenhuma. É a versão
     mínima do "sempre ligado" que o D229 adiou: vive enquanto o processo
     viver, e não sobe sozinho com a máquina
   · VER a página inicial enquanto se mexe nela, contra uma base de verdade,
     que é o que o `--demonstracao` faz para as telas de tarefa

   `temAgente` fica falso, e é isso que desliga o botão de pedir — ver a nota
   dele lá em cima. */
const iBase = process.argv.indexOf("--base");
if (iBase >= 0) {
  const pasta = process.argv[iBase + 1];
  if (!pasta) {
    process.stderr.write("\n  falta a pasta: `node painel/servidor.mjs --base <pasta>`\n\n");
    process.exit(1);
  }
  temAgente = false;
  try {
    const { titulo } = await base.registrar(pasta);
    /* ── O SOLTO NÃO DISPUTA A PORTA (D243) ─────────────────────────────
       Uma sessão pode ter aberto o PRÓPRIO painel com esta base enquanto o
       solto estava fora (subindo com a máquina, ou reiniciando). Subir agora
       seria abrir na porta seguinte: dois endereços para a mesma base. Ele
       espera aquela fechar — a aba reconecta sozinha quando ele entra. */
    for (let avisou = false; ; avisou = true) {
      const outro = await acharAnfitriao({ segredo: await chaveDaMaquina({ aoRegistrar: registrar }),
        portaInicial: Number(process.env.PAINEL_PORTA || 4180), base: base.raiz }).catch(() => null);
      if (!outro) break;
      if (!avisou) registrar(`uma sessão já tem o painel desta base na porta ${outro.porta} — espero ela fechar`);
      await new Promise((ok) => setTimeout(ok, PRESENCA_MS / 2));
    }
    const painel = await garantirAberto();
    registrar(`${titulo} · solto, sem conversa até uma sessão entrar · ${painel.url}`);
    process.stderr.write(`\n  ${painel.url}\n  (depois da primeira vez, ${painel.curto})\n\n`);
  } catch (e) {
    process.stderr.write(`\n  ${e?.message || e}\n\n`);
    process.exit(1);
  }
  /* o servidor HTTP está `unref`-ado (ver `nucleo/http.mjs`): sem alguém
     segurando o laço de eventos, o processo sairia agora mesmo */
  setInterval(() => {}, 1 << 30);
} else {

const iDemo = process.argv.indexOf("--demonstracao");
if (iDemo >= 0) {
  const qual = process.argv[iDemo + 1] || "lista";
  const demo = DEMONSTRACOES[qual];
  if (!demo) {
    process.stderr.write(`\n  não há demonstração "${qual}". As que existem: ` +
      `${Object.keys(DEMONSTRACOES).join(", ")}\n\n`);
    process.exit(1);
  }
  const { url } = await garantirAberto();
  sessao.mostrar({ ...conferirTela(demo, VISTAS), titulo: demo.titulo,
    linha: demo.linha, acoes: demo.acoes });
  registrar(`demonstração "${qual}" no ar · abra ${url}`);
  process.stderr.write(`\n  ${url}\n\n`);
  (async () => {
    for (;;) {
      const i = await sessao.aguardarIntencao(3600_000);
      if (i) registrar("intenção:", JSON.stringify(i));
    }
  })();
  setInterval(() => {}, 1 << 30);
} else {

/* ── A BASE DEBAIXO DO PÉ ─────────────────────────────────────────────
   Se o processo nasceu DENTRO de uma base, ela já é a base — sem esperar a
   chamada. É o caso mais comum do modo copiloto: quem trabalha com a skill
   abre o terminal na pasta da base, e o agente herda o diretório.

   Isto não tira `painel_inicio` do contrato: a chamada continua sendo o que
   o agente faz, e continua valendo quando o diretório é outro. O que ela
   evita é a página inicial nascer vazia numa sessão em que o caminho estava
   a um `cwd` de distância. */
try {
  await base.registrar(process.cwd());
} catch { /* o normal é não ser uma base, e isso não é erro nenhum */ }

/* ── TROCADO PELO VIGIA, O PAINEL VOLTA SOZINHO ───────────────────────
   Quando `nucleo/vigia.mjs` troca este processo por causa de um arquivo que
   mudou, a aba da pessoa está aberta e apontando para cá. Sem isto ela ficaria
   em "sem contato" até a próxima chamada de ferramenta — que pode demorar uma
   hora. A base é a última que foi dita, e a porta é a que o processo velho
   acabou de soltar. */
if (process.env.KAPSTAN_REINICIO) {
  try {
    const abriuAntes = (await readFile(ARQUIVO_DE_ABERTO, "utf8").catch(() => "")).trim() === String(process.ppid);
    if (abriuAntes) {
      if (!base.ligada) await base.registrar((await readFile(ARQUIVO_DA_BASE, "utf8")).trim());
      /* o painel solto (D243) pode ter entrado na porta enquanto este processo
         era trocado: aí esta sessão vira hóspede dele, e não abre a seguinte */
      if (!(await anfitriaoPara("painel_inicio", { base: base.raiz }))) await garantirAberto();
    }
  } catch (e) { registrar(`não reabri o painel depois da troca: ${e?.message || e}`); }
}

/* ── A PRESENÇA (D243) ────────────────────────────────────────────────
   Enquanto esta sessão estiver aberta e não tiver aberto o próprio painel,
   ela diz ao painel solto da mesma base que está aqui. Procurar custa seis
   `fetch` locais com teto de 700 ms, e só se repete quando o anfitrião some. */
setInterval(async () => {
  /* sem base e sem anfitrião achado, não há painel solto que seja desta
     sessão. Com anfitrião achado por uma chamada (o `painel_inicio` de uma
     sessão aberta FORA da base), a base mora só nele, e o sinal vai assim mesmo */
  if (aberto || (!base.ligada && !anfitriao)) return;
  try {
    if (!anfitriao) {
      anfitriao = await acharAnfitriao({ segredo: await chaveDaMaquina({ aoRegistrar: registrar }),
        portaInicial: Number(process.env.PAINEL_PORTA || 4180), base: base.raiz }).catch(() => null);
      if (anfitriao) jaProcurei = true;
    }
    await anfitriao?.presenca();
  } catch { anfitriao = null; }
}, PRESENCA_MS).unref();

servirPorStdio({
  servidor: { name: "painel", title: "Painel da Oficina", version: "0.3.0" },
  instrucoes:
    "O painel é a cara visual do modo copiloto. Chame `painel_inicio` uma vez, " +
    "no começo de toda execução que tem uma base: ele abre a PÁGINA INICIAL — " +
    "o mapa, a lista do dia, o funil, cada arquivo com a procedência de cada " +
    "campo — e o endereço é sempre o mesmo naquela máquina. Mostre no painel o " +
    "que seria uma tabela ou um formulário no terminal — a ficha de um item, a " +
    "mensagem antes de sair, a bifurcação com o custo de cada caminho, o que " +
    "vai ser respondido em nome da pessoa, e o fecho do que foi guardado. " +
    "Vários itens para julgar vão numa lista com `decisoes`; duas coisas que " +
    "se decidem juntas vão em `blocos`, no máximo três. Ele LÊ a base e NÃO " +
    "escreve nela: devolve o que a pessoa escolheu, e quem grava é você. " +
    "Quando ele não estiver disponível, ou quando o tempo estourar, faça o " +
    "mesmo trabalho em texto e diga em uma linha que foi assim.",
  ferramentas,
});
}
}
