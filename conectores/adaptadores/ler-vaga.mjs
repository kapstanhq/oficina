/**
 * LER A VAGA DE UM LINK COLADO — a página de UMA vaga, que a pessoa colou,
 * lida pelo bloco `schema.org/JobPosting` que o site publica para o Google.
 *
 * ── POR QUE O JSON-LD, E SÓ ELE ────────────────────────────────────────
 * Quase todo site brasileiro de vaga põe o bloco na página da vaga (medido
 * em 24/09: Vagas.com, InfoJobs, Catho, BNE, Trabalha Brasil), e os campos
 * são os mesmos em todos. Ler o HTML em volta seria um adaptador por site, e
 * quebraria na primeira troca de layout. Sem o bloco a operação diz que não
 * achou e pede o texto: campo de vaga não se chuta.
 *
 * ── AS TRÊS PORTAS QUE NÃO BAIXAM NADA ─────────────────────────────────
 * Vêm do catálogo, e são conferidas antes da rede — e antes do DNS:
 *   `recusa`      o site cujo termo proíbe acesso automatizado. A frase é
 *                 a da recusa, e a pessoa cola o texto
 *   `encaminha`   o site que outro conector lê melhor (a Gupy não publica o
 *                 bloco; o LinkedIn tem o `linkedin-vagas`)
 *   o resto       as guardas de `nucleo/pagina.mjs`: rede privada, porta,
 *                 protocolo, tamanho e tempo
 */
import { baixarPagina, noDominio } from "../nucleo/pagina.mjs";
import { textoDeHtml, dataCurta } from "../nucleo/chamada.mjs";

/** os blocos JSON-LD da página, já parseados; o torto tenta uma segunda vez */
export function blocosJsonLd(html) {
  const blocos = [];
  const re = /<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\s*>/gi;
  for (const m of html.matchAll(re)) {
    const cru = m[1].trim().replace(/^<!\[CDATA\[|\]\]>$/g, "").replace(/^<!--|-->$/g, "").trim();
    try { blocos.push(JSON.parse(cru)); continue; } catch { /* abaixo */ }
    /* medido: há site que põe quebra de linha crua dentro da descrição */
    try { blocos.push(JSON.parse(cru.replace(/[\u0000-\u001f]+/g, " "))); } catch { /* ignora o bloco */ }
  }
  return blocos;
}

const ehVaga = (o) => o && typeof o === "object"
  && [].concat(o["@type"] || []).some((t) => String(t).replace(/^.*[/#]/, "") === "JobPosting");

/** o primeiro JobPosting, em lista, em `@graph` ou aninhado */
export function acharJobPosting(blocos) {
  const fila = [...blocos];
  while (fila.length) {
    const o = fila.shift();
    if (Array.isArray(o)) { fila.push(...o); continue; }
    if (!o || typeof o !== "object") continue;
    if (ehVaga(o)) return o;
    for (const v of Object.values(o)) if (v && typeof v === "object") fila.push(v);
  }
  return null;
}

const texto = (v) => {
  if (v === undefined || v === null) return null;
  if (typeof v === "object") return texto(v.name ?? v["@value"] ?? v.value ?? null);
  const t = textoDeHtml(String(v)).trim();
  return t || null;
};

/* ── A PALAVRA DO ANÚNCIO VIRA A DO CONTRATO ──────────────────────────
   `employmentType` mistura duas coisas: o VÍNCULO (INTERN, TEMPORARY) e a
   CARGA (FULL_TIME, PART_TIME). O vínculo vai para `contrato`, a carga para
   `jornada`. CONTRACTOR fica de fora de propósito: é PJ, autônomo ou
   cooperado conforme o país, e o anúncio diz qual — o valor cru segue em
   `tipo_de_emprego` para quem for ler. */
const CONTRATO = { clt: "CLT", efetivo: "CLT", intern: "estágio", internship: "estágio", estagio: "estágio",
  temporary: "temporário", temporario: "temporário", aprendiz: "aprendiz", "jovem aprendiz": "aprendiz",
  pj: "PJ", autonomo: "autônomo", intermitente: "intermitente", cooperado: "cooperado" };
const JORNADA = { full_time: "tempo integral", part_time: "meio período", "full-time": "tempo integral",
  "part-time": "meio período", integral: "tempo integral", "meio periodo": "meio período" };
const chave = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const UNIDADE = { HOUR: "por hora", DAY: "por dia", WEEK: "por semana", MONTH: "por mês", YEAR: "por ano" };
function faixa(base) {
  if (!base || typeof base !== "object") return base ? texto(base) : null;
  const v = base.value && typeof base.value === "object" ? base.value : { value: base.value };
  const de = Number(v.minValue ?? v.value), ate = Number(v.maxValue);
  if (!(de > 0) && !(ate > 0)) return null;
  const moeda = base.currency || v.currency || "";
  const num = (n) => (moeda === "BRL" ? "R$ " : moeda ? moeda + " " : "") + n.toLocaleString("pt-BR");
  const unidade = UNIDADE[String(v.unitText || base.unitText || "").toUpperCase()] || "";
  return [de > 0 && ate > 0 && ate !== de ? `${num(de)} a ${num(ate)}` : num(de > 0 ? de : ate), unidade]
    .filter(Boolean).join(" ");
}

function lugares(jobLocation) {
  const saida = [];
  for (const l of [].concat(jobLocation || [])) {
    const a = l?.address || l;
    if (typeof a === "string") { saida.push(a); continue; }
    const cidade = texto(a?.addressLocality), uf = texto(a?.addressRegion);
    const junto = [cidade, uf].filter(Boolean).join(" - ");
    if (junto) saida.push(junto);
  }
  return [...new Set(saida)].join(" · ") || null;
}

/** do JobPosting aos campos da vaga — os mesmos oito das buscas, e o resto do contrato */
export function vagaDe(jp, { link, fonte, lidoEm, corta = 8000 }) {
  const tipos = [].concat(jp.employmentType || []).map(String);
  const contratos = [...new Set(tipos.map((t) => CONTRATO[chave(t)]).filter(Boolean))];
  const jornadas = [...new Set(tipos.map((t) => JORNADA[chave(t)]).filter(Boolean))];
  const remoto = [].concat(jp.jobLocationType || []).some((t) => /telecommute|remot/i.test(String(t)));
  let descricao = texto(jp.description);
  let cortado = false;
  if (descricao && [...descricao].length > corta) {
    descricao = [...descricao].slice(0, corta).join("") + "…";
    cortado = true;
  }
  const id = jp.identifier && typeof jp.identifier === "object"
    ? texto(jp.identifier.value ?? jp.identifier.name) : texto(jp.identifier);
  return {
    id,
    titulo: texto(jp.title),
    empresa: texto(jp.hiringOrganization),
    local: lugares(jp.jobLocation),
    /* o bloco diz "remoto" (TELECOMMUTE); ele não diz "presencial" — ausência não é fato */
    remoto: remoto || null,
    link,
    publicada: dataCurta(jp.datePosted) || null,
    descricao,
    regime: remoto ? "remoto" : null,
    contrato: contratos.join(" · ") || null,
    jornada: jornadas.join(" · ") || texto(jp.workHours),
    faixa: faixa(jp.baseSalary),
    inscricoes_ate: dataCurta(jp.validThrough) || null,
    tipo_de_emprego: tipos.join(", ") || null,
    procedencia: `${fonte}, ${lidoEm}`,
    ...(cortado ? { cortado: true } : {}),
  };
}

export default {
  async ler({ conector, op, parametros, buscar, resolver }) {
    const colada = String(parametros.url || "").trim();
    let host = "";
    try { host = new URL(colada).hostname; } catch { /* `baixarPagina` diz */ }
    /* o encaminhamento vem ANTES da rede, como a recusa: não é proibição,
       é que outro conector lê aquilo melhor */
    for (const [dominio, diga] of Object.entries(conector.encaminha || {})) {
      if (host && noDominio(host, dominio)) {
        const erro = new Error(diga);
        erro.encaminhado = true;
        throw erro;
      }
    }
    const { url, html, cortada } = await baixarPagina(colada, {
      buscar, resolver, recusados: conector.recusa || [],
      maxBytes: Number(op?.maxBytes) || undefined,
    });
    const jp = acharJobPosting(blocosJsonLd(html));
    if (!jp) {
      throw new Error("a página abriu e não traz o bloco da vaga (schema.org JobPosting)" +
        (cortada ? ", até onde foi lida" : "") + " — cole o texto do anúncio. Nenhum campo foi adivinhado");
    }
    const lidoEm = new Date().toISOString().slice(0, 10);
    const link = colada.split("#")[0];
    const item = vagaDe(jp, { link, fonte: url.hostname.replace(/^www\./, ""), lidoEm,
      corta: Number(op?.corta?.descricao) || 8000 });
    return { itens: [item], total: 1, ...(url.href !== new URL(colada).href ? { lida_em: url.href } : {}) };
  },
};
