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
  traduzirParametros(op, parametros);   // valor fora da lista ou do formato: recusa aqui, antes da rede
}

/**
 * Da palavra da pessoa à da fonte, e o teto que a fonte aguenta.
 *
 * `valores` é a tabela: a CHAVE é como se diz (`estágio`, `BA`) e o valor é
 * o que a fonte entende (`vacancy_type_internship`, `Bahia`). Compara sem
 * acento e sem caixa, e aceita também o próprio valor da fonte — `bahia` sai
 * `Bahia`, com a grafia da tabela. Fora dela é recusa com a lista: a Gupy
 * devolve ZERO para um `type` que não conhece, sem erro, e zero é a resposta
 * errada com cara de certa. `formato` é a mesma recusa por regex — a Sólides
 * devolve zero para `Curitiba` sem a UF. `maximo` corta o número: a Sólides dá
 * 500 com `take` acima de 20 (medido em 24/09).
 */
export function traduzirParametros(op, parametros = {}) {
  const saida = { ...parametros };
  for (const [nome, d] of Object.entries(op.parametros || {})) {
    const v = saida[nome];
    if (v === undefined || v === null || v === "") continue;
    if (d.valores) {
      const alvo = semAcento(String(v).trim());
      const achado = Object.entries(d.valores).find(([k]) => semAcento(k) === alvo)?.[1]
        ?? Object.values(d.valores).find((x) => semAcento(x) === alvo);
      if (achado === undefined) {
        throw new Error(`parâmetro recusado: ${nome} = "${v}". Os que a fonte entende: ` +
          Object.keys(d.valores).join(" · "));
      }
      saida[nome] = achado;
    }
    if (d.formato && !new RegExp(d.formato, "u").test(String(v).trim())) {
      throw new Error(`parâmetro recusado: ${nome} = "${v}" — ${d.oque || "fora do formato"}`);
    }
    if (d.maximo !== undefined && Number(v) > Number(d.maximo)) saida[nome] = Number(d.maximo);
  }
  return saida;
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
 * Um campo que não é caminho simples. Quatro formas, e uma de cada vez:
 *
 *   { de, contem }                 booleano — `remoto` de um `jobType`
 *   { de, cada?, mapa?, junta? }   a palavra da fonte vira a do contrato
 *                                  (`vacancy_type_internship` → `estágio`);
 *                                  lista vira texto, pelo `cada` de cada item.
 *                                  Valor fora do `mapa` sai como veio: feio,
 *                                  e não mentira
 *   { de, maior_que }              número, ou null — a Sólides manda faixa 0
 *                                  quando a empresa não mostra
 *   { primeiro, molde, se? }       o primeiro caminho preenchido; senão o
 *                                  endereço montado do ITEM (`{id}` lê o campo
 *                                  dele, codificado), só quando cada `se`
 *                                  casar. É o link da Sólides: o que ela manda
 *                                  vem quebrado (medido em 24/09)
 */
export function regraDeCampo(bruto, regra) {
  if (regra.primeiro || regra.molde) {
    for (const c of regra.primeiro || []) {
      const v = ler(bruto, c);
      if (v !== undefined && v !== null && String(v).trim()) return v;
    }
    if (!regra.molde) return null;
    for (const [c, re] of Object.entries(regra.se || {})) {
      if (!new RegExp(re).test(String(ler(bruto, c) ?? ""))) return null;
    }
    let falta = false;
    const url = regra.molde.replace(/\{([\w.-]+)\}/g, (m, c) => {
      const v = ler(bruto, c);
      if (v === undefined || v === null || String(v) === "") falta = true;
      return encodeURIComponent(String(v ?? ""));
    });
    return falta ? null : url;
  }
  const v = ler(bruto, regra.de);
  if (v === undefined || v === null) return null;
  if (regra.contem !== undefined) return semAcento(v).includes(semAcento(regra.contem));
  if (regra.maior_que !== undefined) return Number(v) > Number(regra.maior_que) ? Number(v) : null;
  const mapa = regra.mapa
    ? Object.fromEntries(Object.entries(regra.mapa).map(([k, x]) => [semAcento(k), x])) : null;
  const um = (x) => {
    const bruto1 = regra.cada ? ler(x, regra.cada) : x;
    if (bruto1 === undefined || bruto1 === null || bruto1 === "") return null;
    return mapa && semAcento(bruto1) in mapa ? mapa[semAcento(bruto1)] : bruto1;
  };
  if (!Array.isArray(v)) return um(v);
  const lista = [...new Set(v.map(um).filter((x) => x !== null && x !== ""))];
  return lista.length ? lista.join(regra.junta ?? " · ") : null;
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
 * `workplaceType: "remote"`. As outras formas estão em `regraDeCampo`.
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
        item[nosso] = regraDeCampo(bruto, regra);
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
export async function chamarHttp({ conector, op, parametros: pedidos, chave, buscar = fetch }) {
  const parametros = traduzirParametros(op, pedidos);
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
  /* `total` é o que veio NESTA página; o da fonte inteira, quando ela diz,
     é o que responde "a primeira página veio cheia?" */
  if (op.total_em) {
    const n = Number(ler(corpo, op.total_em));
    if (Number.isFinite(n)) saida.total_na_fonte = n;
  }
  /* zero é resultado — mas zero com um parâmetro que a fonte lê de um jeito
     só (a cidade sem acento, na Gupy) é mais provável ser a grafia */
  if (!saida.itens.length) {
    const dicas = Object.entries(op.parametros || {})
      .filter(([nome, d]) => d.se_vazio && pedidos[nome] !== undefined && pedidos[nome] !== "")
      .map(([nome, d]) => `${nome}: ${d.se_vazio}`);
    if (dicas.length) saida.aviso = "nada voltou — confira " + dicas.join(" · ");
  }
  const medido = conector.custo?.campo ? Number(ler(corpo, conector.custo.campo)) : NaN;
  return { ...saida, ...(Number.isFinite(medido) ? { custo: medido, medido: true } : {}) };
}
