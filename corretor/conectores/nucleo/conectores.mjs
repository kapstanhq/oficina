/**
 * O MIOLO — estado, orçamento, chamada e extrato, sem saber de stdio.
 *
 * Ele mora separado do `servidor.mjs` pela mesma razão de `sessao.mjs` no
 * painel: o que tem regra é testável sem subir um processo, e a `prova.mjs`
 * exercita ESTE objeto com um `fetch` falso e um relógio falso.
 *
 * ── A ORDEM DAS RECUSAS É A REGRA ──────────────────────────────────────
 *
 *   desligado · sem-chave     ninguém autorizou este conector
 *   sem teto                  é pago, e ninguém disse até quanto
 *   orçamento …               é pago, e a chamada não passou pelo `orcar`
 *   acima do teto             a ESTIMATIVA já não cabe no que sobra do mês
 *   devagar                   o ritmo da fonte estourou
 *   ── só aqui a rede é tocada ──
 *   o serviço respondeu …     a fonte recusou; o custo que houver É anotado
 *
 * Tudo acima da linha custa zero e não conta no ritmo. O teto é conferido
 * DUAS vezes — no `orcar`, para o agente saber cedo, e no `chamar`, porque
 * entre um e outro podem ter passado dez minutos e outra chamada.
 *
 * ── O QUE O TETO NÃO GARANTE, E ESTÁ DITO ──────────────────────────────
 * A recusa é pela ESTIMATIVA; o custo real só existe depois. Uma chamada
 * pode estourar o teto pela diferença entre os dois — e a seguinte é
 * recusada. O teto é "não começa chamada nova acima disto", e não "nunca
 * passa disto": a segunda promessa só o serviço pode cumprir, e é por isso
 * que o guia manda escrever o limite TAMBÉM no console dele.
 */
import { createHash, randomBytes } from "node:crypto";
import { lerLigados, lerChaves, lerTetos } from "./cofre.mjs";
import { anotar, lerLivro, gastoDoMes, mesDe, arredondar } from "./livro.mjs";
import { nasceDesligado, ehPago } from "./catalogo.mjs";
import { conferirParametros, chamarHttp } from "./chamada.mjs";
import { criarRitmo } from "./ritmo.mjs";
import { estadoDasSessoes, lerSessoes, arquivoDasSessoes } from "./sessoes.mjs";

const VALIDADE_DO_ORCAMENTO = 10 * 60_000;

/* a ordem das chaves não pode mudar o hash: o agente monta o mesmo objeto
   duas vezes e nada garante que na mesma ordem */
const canonico = (v) => {
  if (Array.isArray(v)) return v.map(canonico);
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.keys(v).sort().map((k) => [k, canonico(v[k])]));
  }
  return v;
};
const hashDe = (conector, operacao, parametros) => createHash("sha256")
  .update(JSON.stringify([conector, operacao, canonico(parametros || {})])).digest("hex");

export function criarConectores({
  catalogo,
  comando,                          // a linha que o HUMANO digita: `node "<caminho>"`
  buscar = fetch,
  agora = () => Date.now(),
  carregarAdaptador = (caminho) => import(caminho),
  raizDosAdaptadores,               // URL do diretório de `servidor.mjs`
  aoRegistrar = () => {},
}) {
  const ritmo = criarRitmo({ agora });
  const orcamentos = new Map();

  const achar = (nome) => {
    const c = catalogo[nome];
    if (!c) {
      throw new Error(`conector desconhecido: ${nome}. Os que existem: ` +
        Object.keys(catalogo).join(", "));
    }
    return c;
  };

  /* ── O `como_ligar` É A LINHA PRONTA ──────────────────────────────────
     O caminho do servidor instalado é o do cache de plugins, que ninguém
     sabe de cor e que o agente erraria ao adivinhar. Quem sabe é este
     processo. E são até três linhas porque são três decisões — ligar, dar a
     chave, dizer até quanto —, cada uma de quem digita. */
  function comoLigar(nome, c, { ligado, temChave, teto }) {
    const linhas = [];
    if (c.tipo === "mcp") linhas.push(c.guia);
    if (nasceDesligado(c) && !ligado) linhas.push(`${comando} ligar ${nome}`);
    if (c.chave && !temChave) {
      linhas.push(`${comando} chave ${nome}     (num terminal seu, fora desta conversa: ` +
        `a chave ${c.chave.nome} não passa por aqui)`);
    }
    if (ehPago(c) && !(teto > 0)) {
      linhas.push(`${comando} teto ${nome} <valor em ${c.custo.moeda} por mês>`);
    }
    return linhas.join("\n");
  }

  async function estadoDe(nome) {
    const c = achar(nome);
    const [ligados, chaves, tetos] = await Promise.all([lerLigados(), lerChaves(), lerTetos()]);
    const ligado = !nasceDesligado(c) || Boolean(ligados[nome]);
    const temChave = !c.chave || Boolean(chaves[nome]);
    const teto = Number(tetos[nome]?.mes) || 0;

    let estado;
    if (!ligado) estado = "desligado";
    else if (c.tipo === "mcp") estado = "prove";
    else if (!temChave) estado = "sem-chave";
    else estado = "ligado";

    const pago = ehPago(c);
    const gasto = pago ? await gastoDoMes(nome, mesDe(agora())) : 0;
    return {
      c, estado, pago, gasto, teto, chave: chaves[nome],
      como_ligar: comoLigar(nome, c, { ligado, temChave, teto }),
    };
  }

  const estimar = (c, op, parametros) => {
    /* a operação pronta sabe o preço do ator DELA; a genérica fica com o do conector */
    const porItem = Number(op?.custo?.porItem ?? c.custo.porItem) || 0;
    const itens = Number(parametros?.limite) || Number(op.limite) || 0;
    return arredondar(Number(c.custo.estimativa) + porItem * itens);
  };

  /** as três recusas que valem para `orcar` e para `chamar` */
  function conferirPermissao(nome, e, op, parametros) {
    if (e.c.tipo === "mcp") {
      throw new Error(`${nome} é do tipo mcp: quem chama é você, com as ferramentas dele. ` +
        `Prove que está ligado com \`${e.c.prova}\``);
    }
    if (e.estado === "desligado" || e.estado === "sem-chave") {
      throw new Error(`${e.estado} · ${nome} existe e ninguém ligou. Diga UMA vez e siga sem ele:\n` +
        e.como_ligar);
    }
    if (!e.pago) return 0;
    if (!(e.teto > 0)) {
      throw new Error(`sem teto · ${nome} é pago e não tem teto escrito — sem teto, não gasta. ` +
        `Quem escreve é a pessoa:\n${e.como_ligar}`);
    }
    const estimativa = estimar(e.c, op, parametros);
    const resta = arredondar(e.teto - e.gasto);
    if (estimativa > resta) {
      throw new Error(`acima do teto · ${nome}: a chamada deve custar ${estimativa} ${e.c.custo.moeda} ` +
        `e sobram ${resta} de ${e.teto} neste mês. Não contorne por outra operação. ` +
        `Para mudar o teto, a pessoa digita:\n${comando} teto ${nome} <valor>`);
    }
    return estimativa;
  }

  const operacaoDe = (nome, c, operacao) => {
    const op = c.operacoes?.[operacao];
    if (!op) {
      throw new Error(`${nome} não tem a operação ${operacao}. As que existem: ` +
        Object.keys(c.operacoes || {}).join(", "));
    }
    return op;
  };

  return {
    /** o que existe, o que está ligado, quanto já gastou */
    async estado() {
      const conectores = [];
      for (const nome of Object.keys(catalogo)) {
        const e = await estadoDe(nome);
        conectores.push({
          nome, tipo: e.c.tipo, oque: e.c.oque, estado: e.estado,
          ...(e.c.tipo === "mcp" ? { prova: e.c.prova } : {}),
          /* onde o navegador já entra com a conta (D272): nome e validade, nunca o cookie */
          ...(e.c.sessoes ? { sessoes: estadoDasSessoes(e.c.sessoes, await lerSessoes(), agora()),
            arquivo_das_sessoes: arquivoDasSessoes() } : {}),
          custo: e.c.tipo === "mcp" ? null : e.c.custo,
          gasto_no_mes: e.gasto,
          teto_do_mes: e.pago ? e.teto : null,
          resta: e.pago ? arredondar(Math.max(0, e.teto - e.gasto)) : null,
          operacoes: Object.entries(e.c.operacoes || {}).map(([op, d]) =>
            ({ nome: op, ...(d.oque ? { oque: d.oque } : {}), parametros: d.parametros || {} })),
          como_ligar: e.como_ligar,
        });
      }
      return { mes: mesDe(agora()), conectores };
    },

    async orcar({ conector, operacao, parametros = {} }) {
      const e = await estadoDe(conector);
      const op = e.c.tipo === "http" ? operacaoDe(conector, e.c, operacao) : null;
      if (op) conferirParametros(op, parametros);
      const estimativa = conferirPermissao(conector, e, op, parametros);
      if (!e.pago) {
        return { gratis: true, diga: `${conector} não custa nada — chame direto, sem orçamento.` };
      }
      const orcamento = randomBytes(9).toString("base64url");
      orcamentos.set(orcamento, {
        hash: hashDe(conector, operacao, parametros), expira: agora() + VALIDADE_DO_ORCAMENTO });
      return {
        orcamento, estimativa, moeda: e.c.custo.moeda,
        resta: arredondar(e.teto - e.gasto), teto_do_mes: e.teto,
        vale_por: "10 minutos, para UMA chamada com estes mesmos parâmetros",
      };
    },

    async chamar({ conector, operacao, parametros = {}, orcamento }) {
      const e = await estadoDe(conector);
      const op = e.c.tipo === "http" ? operacaoDe(conector, e.c, operacao) : null;
      if (op) conferirParametros(op, parametros);

      if (e.pago) {
        /* a permissão vem ANTES do orçamento de propósito: "sem teto" é a
           recusa que a pessoa resolve, e escondê-la atrás de "falta o
           orçamento" mandaria o agente orçar o que não pode ser chamado */
        conferirPermissao(conector, e, op, parametros);
        const o = orcamento && orcamentos.get(orcamento);
        if (!o) {
          throw new Error("orçamento ausente · chamada paga exige o `orcamento` que " +
            "`conectores_orcar` devolve — e o que ele devolve se mostra à pessoa antes");
        }
        if (agora() > o.expira) {
          orcamentos.delete(orcamento);
          throw new Error("orçamento vencido · passaram dez minutos. Orce de novo");
        }
        if (o.hash !== hashDe(conector, operacao, parametros)) {
          throw new Error("orçamento de outra chamada · os parâmetros mudaram desde o `orcar`. Orce de novo");
        }
        /* consumido ANTES da rede: vale para UMA chamada, e a que falhou no
           meio pode ter custado */
        orcamentos.delete(orcamento);
      } else {
        conferirPermissao(conector, e, op, parametros);
      }

      const espera = ritmo.pedir(conector, e.c.ritmo?.porMinuto);
      if (espera) {
        throw new Error(`devagar · ${conector} aceita ${e.c.ritmo.porMinuto} chamadas por minuto. ` +
          `Espere ${espera} s. Não é erro`);
      }

      const linha = {
        em: new Date(agora()).toISOString(), conector, operacao,
        custo: 0, moeda: e.c.custo?.moeda || null, medido: true, ok: false,
        parametros: JSON.stringify(parametros).slice(0, 200),
      };
      try {
        let saida;
        if (e.c.adaptador) {
          const modulo = await carregarAdaptador(new URL(e.c.adaptador, raizDosAdaptadores).href);
          /* `usa` é a operação PRONTA: outro nome, outra entrada, a mesma função */
          const fazer = (modulo.default || modulo)[op.usa || operacao];
          if (typeof fazer !== "function") {
            throw new Error(`catálogo: o adaptador de ${conector} não tem a operação ${operacao}`);
          }
          saida = await fazer({
            conector: e.c, op, parametros, chave: e.chave, buscar,
            /* o cinto do adaptador pago: quanto AINDA cabe, para ele repassar
               ao serviço como limite da própria corrida */
            resta: e.pago ? arredondar(e.teto - e.gasto) : null,
          });
        } else {
          saida = await chamarHttp({ conector: e.c, op, parametros, chave: e.chave, buscar });
        }
        const { custo: medido, medido: foiMedido, ...resto } = saida;
        if (e.pago) {
          linha.medido = Boolean(foiMedido);
          linha.custo = foiMedido ? arredondar(Number(medido) || 0) : estimar(e.c, op, parametros);
        }
        linha.ok = true;
        await anotar(linha);
        const gasto = e.pago ? arredondar(e.gasto + linha.custo) : 0;
        return {
          ...resto,
          custo: linha.custo, medido: linha.medido,
          resta: e.pago ? arredondar(Math.max(0, e.teto - gasto)) : null,
          ...(e.pago && gasto > e.teto
            ? { aviso: `o custo real passou do teto em ${arredondar(gasto - e.teto)} ${e.c.custo.moeda} — ` +
                "a próxima chamada paga deste mês será recusada" } : {}),
        };
      } catch (erro) {
        /* a falha que CUSTOU traz o custo pendurado no erro — é o adaptador
           quem sabe. Sem isso o mês em que tudo deu errado sairia de graça
           no livro e caro na fatura. */
        if (e.pago && Number.isFinite(Number(erro?.custo))) {
          linha.custo = arredondar(Number(erro.custo));
          linha.medido = true;
        }
        linha.erro = String(erro?.message || erro).slice(0, 200);
        await anotar(linha).catch((x) => aoRegistrar("o livro não gravou:", x?.message));
        throw erro;
      }
    },

    /**
     * O que foi gasto, chamada a chamada. As gratuitas entram como CONTAGEM:
     * elas estão no livro — é o que deixa auditar o ritmo —, e linha a linha
     * afogariam as três que custaram.
     */
    async extrato({ mes = mesDe(agora()), conector } = {}) {
      const { linhas, ilegiveis } = await lerLivro();
      const doMes = linhas.filter((l) => mesDe(l.em) === mes && (!conector || l.conector === conector));
      const tetos = await lerTetos();
      const por = {};
      for (const l of doMes) {
        const p = (por[l.conector] ||= { conector: l.conector, chamadas: 0, falhas: 0,
          gasto: 0, moeda: l.moeda, teto_do_mes: Number(tetos[l.conector]?.mes) || null });
        p.chamadas++;
        if (!l.ok) p.falhas++;
        p.gasto = arredondar(p.gasto + (Number(l.custo) || 0));
      }
      return {
        mes,
        por_conector: Object.values(por),
        pagas: doMes.filter((l) => Number(l.custo) > 0)
          .map(({ em, conector: c, operacao, custo, moeda, medido, ok, parametros }) =>
            ({ em, conector: c, operacao, custo, moeda, medido, ok, parametros })),
        ...(ilegiveis ? { aviso: `${ilegiveis} linha(s) do livro não puderam ser lidas e ficaram de fora` } : {}),
      };
    },
  };
}
