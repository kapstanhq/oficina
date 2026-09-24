/**
 * OS CONECTORES — o servidor MCP que sabe o que existe para ligar, faz as
 * chamadas de rede no lugar do agente e RECUSA gasto acima do teto.
 *
 * ── O QUE ELE RESOLVE ──────────────────────────────────────────────────
 * Das quatro bordas em que o agente toca o mundo (D229), esta é a de GASTAR
 * — e, de carona, a de SABER: o que a máquina tem ligado não se adivinha.
 *
 * O teto de envios do WhatsApp funciona porque mora no daemon, e não na
 * skill. O teto de gasto segue a mesma regra: instrução em prosa o modelo
 * esquece na décima chamada, e a fatura não esquece. Aqui a regra é código
 * no único caminho por onde a chamada paga passa.
 *
 * ── DUAS PORTAS NUM ARQUIVO SÓ, E ELAS NÃO SE MISTURAM ─────────────────
 *
 *   sem argumento     o servidor MCP, por stdio — é o AGENTE falando
 *   com subcomando    a CLI — é o HUMANO digitando
 *
 * O que muda o que o agente PODE fazer — ligar, guardar chave, escrever
 * teto — só existe na segunda porta. Não é esquecimento: o agente que
 * pudesse subir o próprio teto não teria teto, e uma chave de serviço que
 * passasse pela conversa estaria na transcrição para sempre. É o mesmo
 * desenho do `whatsapp-reader nao-contatar`.
 *
 * Elas moram no mesmo arquivo porque o `como_ligar` que o agente repassa
 * precisa do caminho REAL deste servidor dentro do cache de plugins, e quem
 * sabe esse caminho é o próprio processo.
 *
 * ── QUATRO FERRAMENTAS, E POR QUE NÃO UMA POR CONECTOR ─────────────────
 * É a razão do painel, de novo: `gupy_buscar`, `apify_rodar`… faria o
 * `tools/list` de todo mundo crescer com o catálogo, e conector novo
 * deixaria de ser uma entrada de JSON. O conector é um CAMPO.
 *
 * O contrato voltado ao agente é `oficina/_motor/referencias/conectores.md`.
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import { servirPorStdio } from "../painel/nucleo/protocolo.mjs";
import { carregarCatalogo, nasceDesligado, ehPago } from "./nucleo/catalogo.mjs";
import { criarConectores } from "./nucleo/conectores.mjs";
import { diretorio } from "./nucleo/cofre.mjs";
/* os quatro gestos moram em `nucleo/gestos.mjs` desde que o painel passou a
   ser a segunda porta da PESSOA — ver o cabeçalho de lá sobre por que não
   podem existir dois */
import { exigirConector, ligarConector, guardarChaveDe, escreverTetoDe,
  valorDeTeto, tetoValido } from "./nucleo/gestos.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/* o `registrar` do protocolo carimba `[painel]`, e dois servidores com o
   mesmo carimbo no stderr da mesma sessão é registro que ninguém desembaraça */
const registrar = (...partes) => process.stderr.write("[conectores] " + partes.join(" ") + "\n");

/* ── OS ARGUMENTOS ────────────────────────────────────────────────────
   `--catalogo <arquivo>` pode repetir, e vale nas duas portas: na
   árvore-fonte é como se funde o catálogo de um pack; no pack instalado o
   montador já entregou um `catalogo.json` fundido e ninguém passa nada. */
const argumentos = process.argv.slice(2);
const extras = [];
const resto = [];
for (let i = 0; i < argumentos.length; i++) {
  if (argumentos[i] === "--catalogo") extras.push(resolve(argumentos[++i] || ""));
  else resto.push(argumentos[i]);
}
const [subcomando, ...alvo] = resto;

/* a linha que o humano digita. Aspas sempre: o cache de plugins mora debaixo
   do nome do usuário, e nome de usuário com espaço existe. */
const comando = ["node", `"${process.argv[1]}"`,
  ...extras.map((e) => `--catalogo "${e}"`)].join(" ");

const catalogo = await carregarCatalogo([join(AQUI, "catalogo.json"), ...extras]);

const conectores = criarConectores({
  catalogo, comando,
  raizDosAdaptadores: pathToFileURL(AQUI + "/"),
  aoRegistrar: registrar,
});

/* ═══ A PORTA DO HUMANO ═══════════════════════════════════════════════ */

/**
 * Lê a chave do teclado SEM ECO, e nunca de argumento.
 *
 * Argumento de linha de comando fica no histórico do shell e aparece na
 * lista de processos de qualquer programa da máquina. Sem terminal de
 * verdade (a entrada veio por pipe — é o caso da prova, e do `!` de algumas
 * ferramentas), lê a primeira linha e pronto: não há eco a esconder.
 */
function lerSegredo(pergunta) {
  return new Promise((resolver, rejeitar) => {
    const entrada = process.stdin;
    process.stderr.write(pergunta);
    let lido = "";
    const fim = (valor) => {
      if (entrada.isTTY) entrada.setRawMode(false);
      entrada.pause();
      entrada.off("data", aoChegar);
      process.stderr.write("\n");
      resolver(valor.trim());
    };
    const aoChegar = (pedaco) => {
      for (const c of pedaco.toString("utf8")) {
        if (c === "\u0003") { if (entrada.isTTY) entrada.setRawMode(false); rejeitar(new Error("cancelado")); return; }
        if (c === "\r" || c === "\n") return fim(lido);
        if (c === "\u007f" || c === "\b") lido = lido.slice(0, -1);
        else lido += c;
      }
    };
    if (entrada.isTTY) entrada.setRawMode(true);
    entrada.resume();
    entrada.on("data", aoChegar);
    entrada.on("end", () => fim(lido));
  });
}

const AJUDA = `conectores — quem liga, dá a chave e escreve o teto é VOCÊ

  ${comando} estado              o que existe e como está
  ${comando} ligar <nome>        mostra o aviso do conector e liga
  ${comando} desligar <nome>
  ${comando} chave <nome>        pergunta a chave, sem mostrar. Nunca em argumento
  ${comando} teto <nome> <valor> quanto ele pode gastar por mês
  ${comando} extrato [AAAA-MM]   o que foi gasto

o que você escreve fica em ${diretorio()}
`;

async function cli() {
  const nome = alvo[0];
  const exigir = () => exigirConector(catalogo, nome);

  switch (subcomando) {
    case "estado": {
      const { mes, conectores: lista } = await conectores.estado();
      console.log(`conectores · ${mes}\n`);
      for (const c of lista) {
        const gasto = c.teto_do_mes === null ? ""
          : ` · gastou ${c.gasto_no_mes} de ${c.teto_do_mes || "SEM TETO"} ${c.custo.moeda}`;
        console.log(`  ${c.estado.padEnd(10)} ${c.nome.padEnd(18)} ${c.tipo}${gasto}`);
        console.log(`  ${"".padEnd(10)} ${c.oque}`);
        if (c.como_ligar && c.estado !== "ligado") {
          for (const l of c.como_ligar.split("\n")) console.log(`  ${"".padEnd(10)} → ${l}`);
        }
        console.log("");
      }
      return;
    }

    case "ligar": {
      const c = exigir();
      if (!nasceDesligado(c)) {
        console.log(`${nome} não precisa ser ligado: não tem chave nem aviso, e já está de pé.`);
        return;
      }
      /* ── O AVISO É DITO AQUI, UMA VEZ, NO ATO ───────────────────────
         É a regra do D197: informar em vez de impedir. Quem decide é quem
         digita este comando; o que cabe à ferramenta é que ele decida com o
         que há para saber — e não ouvir a mesma coisa a cada uso.

         O painel diz o MESMO aviso no mesmo momento, e o segundo clique
         ("Confirmo") é o equivalente de teclar este comando. */
      if (c.aviso) console.log(`\n${c.aviso}\n`);
      await ligarConector({ catalogo, nome, ligado: true });
      console.log(`✓ ${nome} ligado.`);
      if (c.chave) console.log(`  falta a chave:  ${comando} chave ${nome}`);
      if (ehPago(c)) console.log(`  e o teto:       ${comando} teto ${nome} <valor em ${c.custo.moeda} por mês>`);
      if (c.tipo === "mcp") console.log(`  e ligar de fato: ${c.guia}`);
      return;
    }

    case "desligar":
      exigir();
      await ligarConector({ catalogo, nome, ligado: false });
      console.log(`✓ ${nome} desligado. A chave e o teto ficam guardados; \`chave ${nome}\` com resposta vazia apaga a chave.`);
      return;

    case "chave": {
      const c = exigir();
      if (!c.chave) throw new Error(`${nome} não usa chave`);
      if (alvo.length > 1) {
        throw new Error("a chave não vai em argumento — ela ficaria no histórico do shell. " +
          `Rode só \`${comando} chave ${nome}\` e cole quando ele perguntar`);
      }
      const chave = await lerSegredo(`${c.chave.nome} (não aparece enquanto você digita; vazio apaga): `);
      const { guardada } = await guardarChaveDe({ catalogo, nome, chave });
      console.log(guardada ? `✓ chave de ${nome} guardada em ${diretorio()}` : `✓ chave de ${nome} apagada`);
      return;
    }

    case "teto": {
      const c = exigir();
      if (!ehPago(c)) throw new Error(`${nome} não custa nada — não há o que limitar`);
      /* `Number("")` é ZERO: sem esta guarda, `teto apify` sem valor gravava
         teto zero e dizia que deu certo. Quem pegou foi a prova. A conta mora
         em `gestos.mjs`; a FRASE é da CLI, porque ela cita o comando. */
      const valor = valorDeTeto(alvo[1]);
      if (!tetoValido(valor)) {
        throw new Error(`falta o valor: ${comando} teto ${nome} <valor em ${c.custo.moeda} por mês>. Zero fecha a torneira`);
      }
      await escreverTetoDe({ catalogo, nome, valor });
      console.log(`✓ ${nome} pode gastar até ${valor} ${c.custo.moeda} por mês.`);
      console.log("  Isto impede de COMEÇAR chamada nova acima do teto. Para nenhuma passar, escreva o mesmo limite no console do serviço.");
      return;
    }

    case "extrato": {
      const e = await conectores.extrato({ mes: alvo[0] });
      console.log(`extrato · ${e.mes}\n`);
      if (!e.por_conector.length) console.log("  nenhuma chamada neste mês.");
      for (const p of e.por_conector) {
        console.log(`  ${p.conector.padEnd(18)} ${String(p.chamadas).padStart(4)} chamadas` +
          (p.falhas ? ` · ${p.falhas} falharam` : "") +
          (p.gasto ? ` · ${p.gasto} ${p.moeda}${p.teto_do_mes ? " de " + p.teto_do_mes : ""}` : ""));
      }
      if (e.pagas.length) console.log("");
      for (const l of e.pagas) {
        console.log(`  ${l.em.slice(0, 16).replace("T", " ")}  ${l.conector} ${l.operacao}  ` +
          `${l.custo} ${l.moeda}${l.medido ? "" : " (estimado)"}${l.ok ? "" : " · FALHOU"}`);
      }
      if (e.aviso) console.log(`\n  ! ${e.aviso}`);
      return;
    }

    default:
      console.log(AJUDA);
      if (subcomando && !["ajuda", "--help", "-h"].includes(subcomando)) process.exitCode = 1;
  }
}

/* ═══ A PORTA DO AGENTE ═══════════════════════════════════════════════ */

const PARAMETROS_DA_CHAMADA = {
  conector: { type: "string", description: "o nome, como veio no `conectores_estado`" },
  operacao: { type: "string", description: "uma das `operacoes` daquele conector" },
  parametros: {
    type: "object",
    description: "os parâmetros da operação, pelos nomes que o `conectores_estado` listou. " +
      "Parâmetro que ela não declara é recusado.",
  },
};

const ferramentas = [
  {
    name: "conectores_estado",
    title: "O que existe para ligar",
    description:
      "Lista os conectores — fontes públicas, serviços pagos, e os que são outros " +
      "servidores (WhatsApp, e-mail, navegador) — com o estado de cada um: `ligado`, " +
      "`desligado`, `sem-chave`, ou `prove` (tipo mcp: chame a ferramenta de `prova`; se " +
      "ela não existe na sessão, está desligado). Traz as operações com os parâmetros, " +
      "o gasto do mês, o teto e o `como_ligar` — a linha que a PESSOA digita. Chame uma " +
      "vez por execução, ANTES de prometer o que depende de conector. Você nunca liga, " +
      "nunca guarda chave e nunca muda teto: diga o `como_ligar` uma vez e siga sem ele.",
    inputSchema: { type: "object", properties: {} },
    executar: () => conectores.estado(),
  },
  {
    name: "conectores_orcar",
    title: "Quanto uma chamada paga deve custar",
    description:
      "Para conector PAGO: devolve `{ orcamento, estimativa, moeda, resta, teto_do_mes }` " +
      "sem gastar nada. Mostre à pessoa o que vai buscar, quanto deve custar e quanto " +
      "sobra — em copiloto sempre; em automático só se ela autorizou gasto nesta execução. " +
      "O `orcamento` vale dez minutos, para UMA chamada com os MESMOS parâmetros. Recusa " +
      "com `sem teto` ou `acima do teto`, e aí não há o que contornar. Conector gratuito " +
      "não precisa disto.",
    inputSchema: {
      type: "object", properties: PARAMETROS_DA_CHAMADA,
      required: ["conector", "operacao"],
    },
    executar: (a) => conectores.orcar(a),
  },
  {
    name: "conectores_chamar",
    title: "Fazer a chamada",
    description:
      "Faz a chamada de um conector do tipo http e devolve `{ itens, custo, medido, resta }` " +
      "— os itens já enxutos, com `cortado: true` no que veio truncado (não complete de " +
      "cabeça: peça o detalhe ou deixe `?`). Pago exige o `orcamento` do `conectores_orcar`. " +
      "O que volta é ORIGEM, e entra na base com a procedência `← <conector>, AAAA-MM-DD`. " +
      "`devagar` não é erro: espere os segundos que ele disser. `o serviço respondeu …` é " +
      "a fonte recusando: diga e siga com as outras, sem repetir em laço.",
    inputSchema: {
      type: "object",
      properties: {
        ...PARAMETROS_DA_CHAMADA,
        orcamento: { type: "string", description: "o id que o `conectores_orcar` devolveu. Só para conector pago." },
      },
      required: ["conector", "operacao"],
    },
    executar: (a) => conectores.chamar(a),
  },
  {
    name: "conectores_extrato",
    title: "O que foi gasto",
    description:
      "O gasto do mês por conector e, chamada a chamada, as que custaram — com `medido: " +
      "false` onde o número é estimativa, e ali ele não se repete como fato. Serve para " +
      "responder “quanto isso já me custou?” e para a vista `lista` do painel.",
    inputSchema: {
      type: "object",
      properties: {
        mes: { type: "string", description: "AAAA-MM. Sem ele, o mês corrente." },
        conector: { type: "string", description: "só este conector. Opcional." },
      },
    },
    executar: (a) => conectores.extrato(a),
  },
];

if (subcomando) {
  try { await cli(); } catch (e) {
    console.error(`erro: ${e?.message || e}`);
    process.exitCode = 1;
  }
} else {
  registrar(`${Object.keys(catalogo).length} conectores no catálogo · cofre em ${diretorio()}`);
  servirPorStdio({
    servidor: { name: "conectores", title: "Conectores da Oficina", version: "0.1.0" },
    instrucoes:
      "Os conectores dizem o que existe para ligar nesta máquina e fazem as chamadas de " +
      "rede no seu lugar — fonte pública de graça, serviço pago com orçamento antes e teto " +
      "por mês. Comece por `conectores_estado`. Quem liga, dá chave e escreve teto é a " +
      "pessoa, por comando: diga o `como_ligar` uma vez e siga sem o conector. Recusa por " +
      "teto não se contorna. O que um conector devolve é origem, não fato apurado.",
    ferramentas,
  });
}
