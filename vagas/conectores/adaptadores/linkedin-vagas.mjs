/**
 * A LISTAGEM PÚBLICA DE VAGAS DO LINKEDIN — o adaptador existe porque ela
 * responde HTML, e o catálogo só sabe projetar JSON.
 *
 * ── O QUE ELA É, E O QUE NÃO É ─────────────────────────────────────────
 * É a página que qualquer visitante SEM LOGIN recebe ao buscar vagas: os
 * mesmos cartões, pelo mesmo endereço que o próprio site usa para carregar
 * "ver mais". Nada aqui toca a conta de ninguém — não há cookie, sessão nem
 * chave —, e é essa a diferença para automatizar o navegador logado, que é o
 * que faz conta ser restringida (D229).
 *
 * Não é API: não há contrato, e o HTML muda quando eles quiserem. Por isso a
 * leitura é por CLASSE de elemento, campo a campo, e campo que não foi achado
 * sai `null` em vez de derrubar a busca — e por isso a operação que não acha
 * NENHUM cartão num HTML que não está vazio diz que o formato mudou, em vez
 * de devolver "zero vagas", que é a resposta errada com cara de certa.
 *
 * ── MEDIDO EM 19/09/2026 ───────────────────────────────────────────────
 * · dez cartões por página; `start` anda de dez em dez
 * · `location=Brasil` é IGNORADO em silêncio (voltou Seattle); `Brazil`
 *   funciona. O padrão do catálogo é o que funciona
 * · `f_WT=2` é remoto; 1 presencial, 3 híbrido
 * · o link do cartão vem com quatro parâmetros de rastreio; sai só o caminho
 * · a data vem em `<time datetime="AAAA-MM-DD">`, já no formato do contrato
 */
import { textoDeHtml } from "../nucleo/chamada.mjs";

const BASE = "https://www.linkedin.com";
const MODOS = { remoto: "2", presencial: "1", hibrido: "3" };

async function pagina(buscar, url) {
  let r;
  try {
    r = await buscar(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8" },
      signal: AbortSignal.timeout(20_000),
    });
  } catch (e) {
    throw new Error(`o serviço não respondeu (${e?.name || "erro"}: ${e?.message || e})`);
  }
  if (!r.ok) {
    throw new Error(`o serviço respondeu ${r.status}` +
      (r.status === 429 ? " — a fonte pediu para ir mais devagar; espere alguns minutos" : ""));
  }
  return r.text();
}

/** o miolo do primeiro elemento com aquela classe, já como texto */
const porClasse = (html, classe) => {
  const m = html.match(new RegExp(`class="[^"]*\\b${classe}\\b[^"]*"[^>]*>([\\s\\S]*?)</(?:h\\d|span|a|div|time)>`));
  return m ? textoDeHtml(m[1]) || null : null;
};

export function lerCartoes(html) {
  const itens = [];
  for (const bloco of html.split(/<li[\s>]/).slice(1)) {
    const id = bloco.match(/data-entity-urn="urn:li:jobPosting:(\d+)"/)?.[1];
    if (!id) continue;
    const href = bloco.match(/class="[^"]*base-card__full-link[^"]*"[^>]*href="([^"]+)"/)?.[1]
      || bloco.match(/href="([^"]*\/jobs\/view\/[^"]+)"/)?.[1];
    itens.push({
      id,
      titulo: porClasse(bloco, "base-search-card__title"),
      empresa: porClasse(bloco, "base-search-card__subtitle"),
      local: porClasse(bloco, "job-search-card__location"),
      remoto: null,                                  // o cartão não diz; quem diz é o filtro
      link: href ? href.replace(/&amp;/g, "&").split("?")[0] : `${BASE}/jobs/view/${id}`,
      publicada: bloco.match(/<time[^>]*datetime="(\d{4}-\d{2}-\d{2})"/)?.[1] || null,
      descricao: null,                               // só na operação `detalhe`
    });
  }
  return itens;
}

export default {
  async buscar({ conector, op, parametros, buscar }) {
    const url = new URL("/jobs-guest/jobs/api/seeMoreJobPostings/search", conector.base || BASE);
    url.searchParams.set("keywords", String(parametros.termo));
    url.searchParams.set("location", String(parametros.local || "Brazil"));
    const modo = MODOS[String(parametros.modo || "").toLowerCase()];
    if (parametros.modo && !modo) {
      throw new Error(`modo desconhecido: ${parametros.modo}. Os que existem: ${Object.keys(MODOS).join(", ")}`);
    }
    if (modo) url.searchParams.set("f_WT", modo);
    /* `dias` vira o filtro de recência da própria fonte, em segundos */
    if (Number(parametros.dias) > 0) url.searchParams.set("f_TPR", "r" + Math.round(Number(parametros.dias) * 86400));
    url.searchParams.set("start", String(Math.max(0, Number(parametros.desde) || 0)));

    const html = await pagina(buscar, url);
    const itens = lerCartoes(html);
    if (!itens.length && /<li[\s>]/.test(html)) {
      throw new Error("a fonte respondeu e nenhum cartão foi lido — o formato dela pode ter mudado");
    }
    /* ── O FILTRO NÃO É FATO (D241) ────────────────────────────────────
       Até 22/09 isto marcava `remoto: true` em TODO resultado de uma busca
       com `f_WT=2`. O LinkedIn devolve no filtro o que a empresa cadastrou, e
       a empresa cadastra errado: a vaga da C6 Bank saiu "remoto" e o anúncio
       diz presencial em São Paulo. O cartão não diz o regime, e o que a busca
       PEDIU vai em `filtro` — quem lê o anúncio é quem decide. */
    const nomeDoModo = Object.entries(MODOS).find(([, v]) => v === modo)?.[0] || null;
    for (const it of itens) { it.remoto = null; it.filtro = nomeDoModo; }
    const teto = Number(op?.limite) || 10;
    return { itens: itens.slice(0, Math.min(Number(parametros.limite) || teto, teto)), total: itens.length };
  },

  async detalhe({ conector, op, parametros, buscar }) {
    const id = String(parametros.id || "").trim();
    /* o id entra no CAMINHO, e é número: recusar o resto é mais simples e
       mais seguro que codificar */
    if (!/^\d+$/.test(id)) throw new Error("parâmetro recusado: o id de uma vaga é só número");
    const html = await pagina(buscar, new URL(`/jobs-guest/jobs/api/jobPosting/${id}`, conector.base || BASE));
    const corpo = html.match(/class="[^"]*show-more-less-html__markup[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    if (!corpo) throw new Error("a fonte respondeu sem a descrição — a vaga saiu do ar, ou o formato mudou");

    let descricao = textoDeHtml(corpo);
    const max = Number(op?.corta?.descricao) || 0;
    const cortado = max > 0 && [...descricao].length > max;
    if (cortado) descricao = [...descricao].slice(0, max).join("") + "…";

    /* os critérios vêm em pares título/valor: senioridade, tipo, função, setor */
    const criterios = {};
    for (const m of html.matchAll(/description__job-criteria-subheader[^>]*>([\s\S]*?)<\/h3>[\s\S]*?description__job-criteria-text[^>]*>([\s\S]*?)<\/span>/g)) {
      criterios[textoDeHtml(m[1])] = textoDeHtml(m[2]);
    }
    return {
      itens: [{
        id,
        titulo: porClasse(html, "top-card-layout__title"),
        empresa: porClasse(html, "topcard__org-name-link"),
        local: porClasse(html, "topcard__flavor--bullet"),
        remoto: null,
        link: `${BASE}/jobs/view/${id}`,
        publicada: null,                 // aqui a fonte só diz "há 4 dias"; a data está no cartão
        descricao,
        criterios,
        candidatos: porClasse(html, "num-applicants__caption"),
        ...(cortado ? { cortado: true } : {}),
      }],
      total: 1,
    };
  },
};
