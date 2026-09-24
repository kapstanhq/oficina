/**
 * A CHAMADA — do catálogo e dos parâmetros a uma URL, e da resposta a itens
 * enxutos. É o único lugar deste diretório que monta endereço.
 *
 * ── A GUARDA QUE MORA AQUI: O AGENTE NUNCA ESCOLHE O HOST ──────────────
 * O endereço é do CATÁLOGO, que é arquivo do pack. O que vem do agente entra
 * em dois lugares só — valor de consulta e segmento de caminho —, e nos dois
 * passa por `encodeURIComponent`. Sem isso, um conector de "buscar na fonte
 * X" seria um `fetch()` genérico com o IP da pessoa: bastaria
 * `empresa = "x/../../outra-rota"` ou `empresa = "@outro-host"`.
 *
 * A codificação fecha quase tudo (`/`, `?`, `#` e `@` viram `%xx`), e sobram
 * dois casos que ela NÃO pega: `.` e `..` não têm o que codificar, e o
 * analisador de URL os resolve DEPOIS — `boards/../x` vira `x` no mesmo
 * host. Por isso a recusa explícita abaixo, e por isso a conferência final
 * compara a origem da URL montada com a do modelo: é o cinto sobre o
 * suspensório, e é o que a `prova.mjs` exercita com um segundo servidor que
 * tem de terminar o teste sem ter recebido um pedido sequer.
 */

const RE_PARAM = /<([\w-]+)(?:\|([^>]*))?>/g;

/** lê `a.b.c` de um objeto; caminho vazio devolve o próprio objeto */
export function ler(obj, caminho) {
  if (!caminho) return obj;
  let v = obj;
  for (const parte of String(caminho).split(".")) {
    if (v === null || v === undefined) return undefined;
    v = v[parte];
  }
  return v;
}

/* ── HTML VIRA TEXTO, E ÀS VEZES EM DUAS DEMÃOS ───────────────────────
   Medido em 19/09: o Greenhouse devolve a descrição como HTML ESCAPADO
   dentro do JSON — `&lt;p&gt;If joining…` —, então decodificar uma vez
   entrega marcação, e é a segunda passada que entrega texto. A ordem é
   decodificar · tirar marcação · decodificar o que sobrou dentro dela. */
/* As entidades com NOME distinguem caixa — `&Ccedil;` e `&ccedil;` são letras
   diferentes —, e a primeira versão daqui conhecia seis e as buscava em
   minúsculas: uma descrição em português saía `Descri&ccedil;&atilde;o`. Quem
   pegou foi a prova. A tabela cobre o que um texto em português, espanhol ou
   inglês traz; o que ficar de fora sai como veio, que é feio e não é mentira. */
const ENTIDADES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  ndash: "–", mdash: "—", hellip: "…", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  bull: "•", middot: "·", ordf: "ª", ordm: "º", deg: "°", euro: "€", copy: "©",
  reg: "®", trade: "™", laquo: "«", raquo: "»", iexcl: "¡", iquest: "¿" };
for (const [letra, nomes] of Object.entries({
  a: "aacute:á agrave:à acirc:â atilde:ã auml:ä", e: "eacute:é egrave:è ecirc:ê euml:ë",
  i: "iacute:í igrave:ì icirc:î iuml:ï", o: "oacute:ó ograve:ò ocirc:ô otilde:õ ouml:ö",
  u: "uacute:ú ugrave:ù ucirc:û uuml:ü", c: "ccedil:ç", n: "ntilde:ñ" })) {
  for (const par of nomes.split(" ")) {
    const [nome, valor] = par.split(":");
    ENTIDADES[nome] = valor;
    ENTIDADES[letra.toUpperCase() + nome.slice(1)] = valor.toUpperCase();
  }
}
const decodificar = (t) => t.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
  if (e[0] === "#") {
    const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
  }
  return ENTIDADES[e] ?? ENTIDADES[e.toLowerCase()] ?? m;
});
export function textoDeHtml(bruto) {
  if (typeof bruto !== "string") return bruto;
  return decodificar(decodificar(bruto)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\s*(br|\/p|\/li|\/h\d|\/div|\/tr)\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "· ")
    /* marcação DE LINHA some sem deixar espaço: `<strong>fim</strong>.` com
       um espaço no lugar da marca vira "fim ." */
    .replace(/<\/?(strong|b|em|i|u|a|span|small|sup|sub|code)(\s[^>]*)?>/gi, "")
    .replace(/<[^>]+>/g, " "))
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* A data sai `AAAA-MM-DD`, que é a única forma que o contrato aceita fora de
   `_bruto/`. Cada fonte manda a sua: ISO com fuso, ISO sem, e o Lever manda
   MILISSEGUNDOS — que, passados adiante como estão, o agente copiaria para a
   base como um número de treze dígitos. O que não se entende fica como veio:
   inventar data é pior que devolver a estranha. */
export function dataCurta(v) {
  if (v === null || v === undefined || v === "") return v;
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const d = new Date(typeof v === "string" && /^\d+$/.test(v) ? Number(v) : v);
  return Number.isNaN(d.getTime()) ? v : d.toISOString().slice(0, 10);
}

const semAcento = (t) => String(t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** os parâmetros que a operação declara, conferidos contra o que chegou */
export function conferirParametros(op, parametros = {}) {
  const declarados = op.parametros || {};
  for (const nome of Object.keys(parametros)) {
    if (!(nome in declarados)) {
      throw new Error(`parâmetro desconhecido: ${nome}. Os que esta operação aceita: ` +
        (Object.keys(declarados).join(", ") || "nenhum"));
    }
  }
  for (const [nome, d] of Object.entries(declarados)) {
    const v = parametros[nome];
    if (d.obrigatorio && (v === undefined || v === null || v === "")) {
      throw new Error(`falta o parâmetro obrigatório ${nome} — ${d.oque || ""}`.trim());
    }
  }
}

/**
 * A URL de uma operação, com os parâmetros no lugar.
 *
 * `<nome>` no caminho é segmento; em `consulta`, `"<nome|padrão>"` é valor.
 * Chave de consulta cujo parâmetro não veio e não tem padrão é OMITIDA — é
 * diferente de mandar vazio, e há fonte que trata `?termo=` como "nada".
 */
export function montarUrl(op, parametros = {}) {
  const modelo = String(op.url || "");
  const origemDoModelo = new URL(modelo.replace(RE_PARAM, "x")).origin;

  const caminho = modelo.replace(RE_PARAM, (m, nome, padrao) => {
    const v = parametros[nome] ?? padrao;
    if (v === undefined || v === null || String(v).trim() === "") {
      throw new Error(`falta o parâmetro ${nome}, que entra no endereço`);
    }
    const s = String(v).trim();
    if (s === "." || s === "..") {
      throw new Error(`parâmetro recusado: ${nome} = "${s}" andaria pelo caminho do endereço`);
    }
    return encodeURIComponent(s);
  });

  const url = new URL(caminho);
  for (const [chave, molde] of Object.entries(op.consulta || {})) {
    const m = String(molde).match(/^<([\w-]+)(?:\|([^>]*))?>$/);
    if (!m) { url.searchParams.set(chave, String(molde)); continue; }
    const v = parametros[m[1]] ?? m[2];
    if (v === undefined || v === null || v === "") continue;
    url.searchParams.set(chave, String(v));
  }

  if (url.origin !== origemDoModelo) {
    throw new Error(`parâmetro recusado: o endereço montado sairia de ${origemDoModelo}`);
  }
  return url;
}

/** onde a chave do serviço viaja — `como` é texto do catálogo */
export function aplicarChave(url, cabecalhos, conector, chave) {
  const como = conector.chave?.como || "";
  if (!chave || !como) return;
  const cab = como.match(/^cabecalho\s+([\w-]+):\s*(.+)$/i);
  if (cab) { cabecalhos[cab[1]] = cab[2].replace("<chave>", chave); return; }
  const con = como.match(/^consulta\s+([\w-]+)$/i);
  if (con) { url.searchParams.set(con[1], chave); return; }
  throw new Error(`catálogo: não sei aplicar a chave “${como}”`);
}

/**
 * Da resposta crua aos itens que o agente lê.
 *
 * ── POR QUE PROJETAR, E NÃO DEVOLVER O JSON DA FONTE ──────────────────
 * Medido: um quadro do Ashby devolve 818 vagas com a descrição inteira em
 * HTML E em texto — megabytes, e tudo iria para o contexto do modelo. O
 * catálogo diz quais campos importam (`campos`), quais chegam como HTML
 * (`html`), quais são data (`datas`) e quanto de cada um cabe (`corta`).
 *
 * ── E O FILTRO É DAQUI PORQUE TRÊS DAS FONTES NÃO TÊM BUSCA ───────────
 * Greenhouse, Lever e Ashby devolvem o quadro INTEIRO de uma empresa; quem
 * procura "produto" entre 800 linhas é este laço, antes do `limite`, e não o
 * modelo depois dele. `termo` aceita alternativas separadas por vírgula, e
 * compara sem acento e sem caixa.
 *
 * Um valor de `campos` é um caminho (`location.name`), um parâmetro ecoado
 * (`<empresa>` — a fonte que não repete o nome da empresa em cada item) ou
 * `{ de, contem }`, que vira booleano: é como `remoto` sai de um
 * `workplaceType: "remote"`.
 */
export function projetar(op, corpo, parametros = {}) {
  /* `um: true` é a operação que devolve UM objeto — o detalhe de um item —,
     e ele passa pela mesma projeção de uma lista de um. */
  const lido = ler(corpo, op.lista);
  const lista = op.um && lido && !Array.isArray(lido) ? [lido] : lido;
  if (!Array.isArray(lista)) {
    throw new Error("a resposta da fonte não trouxe a lista esperada" +
      (op.lista ? ` em “${op.lista}”` : "") + " — o formato dela pode ter mudado");
  }
  const campos = op.campos || {};
  let itens = lista.map((bruto) => {
    const item = {};
    for (const [nosso, regra] of Object.entries(campos)) {
      if (regra && typeof regra === "object") {
        const v = ler(bruto, regra.de);
        item[nosso] = v === undefined || v === null ? null
          : semAcento(v).includes(semAcento(regra.contem));
      } else {
        const eco = String(regra).match(/^<([\w-]+)>$/);
        item[nosso] = eco ? (parametros[eco[1]] ?? null) : (ler(bruto, regra) ?? null);
      }
    }
    for (const c of op.html || []) item[c] = textoDeHtml(item[c]);
    for (const c of op.datas || []) item[c] = dataCurta(item[c]);
    return item;
  });

  const total = itens.length;
  if (op.filtra?.length && parametros.termo) {
    const termos = semAcento(parametros.termo).split(",").map((t) => t.trim()).filter(Boolean);
    itens = itens.filter((it) => op.filtra.some((c) => {
      const alvo = semAcento(it[c]);
      return termos.some((t) => alvo.includes(t));
    }));
  }
  const casaram = itens.length;

  const teto = Number(op.limite) || 50;
  const pedido = Number(parametros.limite) || teto;
  itens = itens.slice(0, Math.max(1, Math.min(pedido, teto)));

  /* o corte vem por ÚLTIMO: filtrar sobre texto já cortado perderia o termo
     que estava no segundo parágrafo. */
  for (const item of itens) {
    for (const [c, max] of Object.entries(op.corta || {})) {
      if (typeof item[c] === "string" && [...item[c]].length > max) {
        item[c] = [...item[c]].slice(0, max).join("") + "…";
        item.cortado = true;
      }
    }
  }
  return { itens, total, casaram };
}

/**
 * A chamada HTTP genérica — a que o catálogo descreve sem código.
 *
 * `buscar` é o `fetch`, injetável: o adaptador de dois passos e a prova usam
 * o mesmo caminho, e nenhum dos dois pode depender de rede de verdade.
 */
export async function chamarHttp({ conector, op, parametros, chave, buscar = fetch }) {
  const url = montarUrl(op, parametros);
  const cabecalhos = { "User-Agent": "Mozilla/5.0 (conectores)", Accept: "application/json" };
  aplicarChave(url, cabecalhos, conector, chave);

  let resposta;
  try {
    resposta = await buscar(url, {
      method: op.metodo || "GET",
      headers: cabecalhos,
      signal: AbortSignal.timeout(20_000),
    });
  } catch (e) {
    throw new Error(`o serviço não respondeu (${e?.name || "erro"}: ${e?.message || e})`);
  }
  if (!resposta.ok) {
    throw new Error(`o serviço respondeu ${resposta.status}` +
      (resposta.status === 404 ? " — confira o nome que entra no endereço" : ""));
  }
  let corpo;
  try { corpo = await resposta.json(); } catch {
    throw new Error("o serviço respondeu algo que não é JSON — o formato dele pode ter mudado");
  }
  const saida = projetar(op, corpo, parametros);
  const medido = conector.custo?.campo ? Number(ler(corpo, conector.custo.campo)) : NaN;
  return { ...saida, ...(Number.isFinite(medido) ? { custo: medido, medido: true } : {}) };
}
