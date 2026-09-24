/**
 * APIFY — o adaptador existe porque a chamada são DOIS passos, e porque o
 * custo de verdade só aparece no objeto da corrida.
 *
 *   1  POST /v2/acts/<ator>/runs?waitForFinish=60   → a corrida: `status`,
 *                                                     `usageTotalUsd`,
 *                                                     `defaultDatasetId`
 *   2  GET  /v2/datasets/<id>/items                 → o que ela achou
 *
 * O atalho `run-sync-get-dataset-items` faz os dois numa chamada e devolve
 * só os itens — sem o `usageTotalUsd`. Serviria para buscar; não serve para
 * MEDIR, que é metade da razão de este servidor existir.
 *
 * ── NÃO PROVADO CONTRA A API REAL ──────────────────────────────────────
 * Em 19/09/2026 não havia token para testar. O que está provado, na
 * `prova.mjs`, é este arquivo contra um servidor HTTP falso que imita os
 * dois passos: a ordem, os cabeçalhos, o custo medido indo para o livro e a
 * falha que custou. O que NÃO está provado: os nomes exatos dos campos da
 * corrida (`usageTotalUsd`, `defaultDatasetId`), que `maxTotalChargeUsd` e
 * `maxItems` sejam aceitos como consulta, e o `abort`. Quem tiver o token
 * roda uma corrida pequena e troca este parágrafo pelo que viu.
 *
 * E uma ressalva da própria plataforma, a confirmar: o `usageTotalUsd` pode
 * fechar alguns segundos DEPOIS de a corrida terminar. O número gravado é o
 * da última leitura, e pode ficar abaixo do que a fatura dirá.
 */
import { projetar } from "../nucleo/chamada.mjs";

const BASE = "https://api.apify.com";
const TERMINAIS = new Set(["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"]);
/* cada volta espera até 60 s do lado do serviço; quatro voltas é o que cabe
   com folga abaixo do teto de ociosidade de uma ferramenta stdio */
const VOLTAS = 4;

async function pedir(buscar, url, chave, opcoes = {}) {
  let r;
  try {
    r = await buscar(url, {
      ...opcoes,
      headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json",
        ...(opcoes.headers || {}) },
      signal: AbortSignal.timeout(90_000),
    });
  } catch (e) {
    throw new Error(`o serviço não respondeu (${e?.name || "erro"}: ${e?.message || e})`);
  }
  if (!r.ok) throw new Error(`o serviço respondeu ${r.status}`);
  return r.json();
}

/* ── A ENTRADA PRONTA ────────────────────────────────────────────────────
   O catálogo escreve a entrada do ator com `<param>` onde entra o que a skill
   passou, e `<param|padrão>` onde há padrão. Parâmetro que não veio e não tem
   padrão LEVA A CHAVE EMBORA — mandar `workTypes: [""]` a um ator é pedir um
   filtro que não existe, e ele devolve zero sem dizer por quê.
   `<param:lista>` parte por vírgula: é como "2,3" vira dois valores. */
const RE_PARAM = /^<([\w-]+)(:lista)?(?:\|(.*))?>$/;
export function preencher(molde, parametros) {
  if (Array.isArray(molde)) {
    const saida = molde.flatMap((m) => {
      const v = preencher(m, parametros);
      return v === undefined ? [] : (Array.isArray(v) ? v : [v]);
    });
    return saida.length ? saida : undefined;
  }
  if (molde && typeof molde === "object") {
    const saida = {};
    for (const [k, m] of Object.entries(molde)) {
      const v = preencher(m, parametros);
      if (v !== undefined) saida[k] = v;
    }
    return saida;
  }
  if (typeof molde !== "string") return molde;
  const m = molde.match(RE_PARAM);
  if (!m) return molde;
  const bruto = parametros[m[1]] ?? m[3];
  if (bruto === undefined || bruto === "") return undefined;
  if (m[2]) return String(bruto).split(",").map((s) => s.trim()).filter(Boolean);
  if (bruto === "true" || bruto === "false") return bruto === "true";
  return typeof bruto === "string" && /^\d+$/.test(bruto) ? Number(bruto) : bruto;
}

export default {
  async rodar({ conector, op, parametros, chave, buscar, resta }) {
    const base = conector.base || BASE;
    /* a operação pronta fixa o ator; a genérica o recebe de quem chama */
    const ator = String(op?.ator || parametros.ator || "").trim();
    /* `usuario~ator`, que é como a API o nomeia. Entra no caminho. */
    if (!/^[\w.-]+~[\w.-]+$/.test(ator)) {
      throw new Error("parâmetro recusado: `ator` tem a forma usuario~nome-do-ator");
    }
    const limite = Math.min(Number(parametros.limite) || Number(op?.limite) || 25, Number(op?.limite) || 100);

    const inicio = new URL(`/v2/acts/${encodeURIComponent(ator)}/runs`, base);
    inicio.searchParams.set("waitForFinish", "60");
    inicio.searchParams.set("maxItems", String(limite));
    /* o segundo cinto: o que AINDA cabe no teto vai como limite da própria
       corrida. O primeiro cinto é a recusa pela estimativa, antes daqui. */
    if (Number(resta) > 0) inicio.searchParams.set("maxTotalChargeUsd", String(resta));

    let corrida = (await pedir(buscar, inicio, chave, {
      method: "POST",
      body: JSON.stringify(op?.entrada ? preencher(op.entrada, { ...parametros, limite })
        : (parametros.entrada || {})) })).data;

    for (let i = 0; corrida && !TERMINAIS.has(corrida.status) && i < VOLTAS; i++) {
      const volta = new URL(`/v2/actor-runs/${encodeURIComponent(corrida.id)}`, base);
      volta.searchParams.set("waitForFinish", "60");
      corrida = (await pedir(buscar, volta, chave)).data;
    }
    if (!corrida) throw new Error("o serviço respondeu sem o objeto da corrida");

    const custo = Number(corrida.usageTotalUsd) || 0;
    /* ── A FALHA QUE CUSTOU LEVA O CUSTO NO ERRO ────────────────────────
       Corrida que não terminou é ABORTADA — senão ela continua gastando
       depois de esta ferramenta ter desistido dela —, e o que ela já gastou
       vai pendurado no erro, que é como o miolo o anota no livro. */
    const falhar = (mensagem) => Object.assign(new Error(mensagem), { custo });
    if (!TERMINAIS.has(corrida.status)) {
      await pedir(buscar, new URL(`/v2/actor-runs/${encodeURIComponent(corrida.id)}/abort`, base),
        chave, { method: "POST" }).catch(() => {});
      throw falhar(`a corrida não terminou em ${VOLTAS + 1} minutos e foi abortada — ` +
        `gastou ${custo} USD até ali. Tente com \`limite\` menor`);
    }
    if (corrida.status !== "SUCCEEDED") {
      throw falhar(`a corrida terminou como ${corrida.status} — gastou ${custo} USD`);
    }

    const dados = new URL(`/v2/datasets/${encodeURIComponent(corrida.defaultDatasetId)}/items`, base);
    dados.searchParams.set("clean", "true");
    dados.searchParams.set("limit", String(limite));
    let itens;
    try { itens = await pedir(buscar, dados, chave); } catch (e) { throw falhar(e.message); }

    /* ator é de terceiro e cada um devolve o que quer: sem `campos` no
       catálogo os itens passam como vieram, e o `corta` do catálogo é o que
       impede uma descrição de vinte mil caracteres por item */
    const saida = op?.campos
      ? projetar({ ...op, lista: "" }, itens, parametros)
      : { itens: Array.isArray(itens) ? itens.slice(0, limite) : [], total: Array.isArray(itens) ? itens.length : 0 };
    return { ...saida, corrida: corrida.id, custo, medido: true };
  },
};
