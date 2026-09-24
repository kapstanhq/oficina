/**
 * A ROTA — sete telas, no fragmento da URL.
 *
 *   #/                       o início
 *   #/pasta/<nome>           uma pasta
 *   #/arquivo/<caminho>      um arquivo
 *   #/funil/<etapa>/<id>     a lista e o item aberto ao lado (D244); `todas`
 *                            no lugar da etapa, e sem id é a TABELA (D274).
 *                            O `#/revisar/<etapa>` do D242 cai aqui
 *   #/tarefa                 a tela que o agente mandou
 *   #/conectores             o que está ligado, e o que a PESSOA liga
 *   #/sobre                  a conta: o resto do INDICE — quem é, como trabalha
 *
 * ── POR QUE NO `#`, E NÃO EM CAMINHO DE VERDADE ───────────────────────
 * Caminho de verdade exigiria o servidor devolver a página em toda URL que
 * ele não reconhece — um `*` na tabela de rotas —, e isso apaga a diferença
 * entre "esta rota não existe" e "esta rota é da interface". O servidor tem
 * quatro guardas e uma tabela fechada; um curinga no fim dela é a porta que
 * ninguém lembra de fechar depois.
 *
 * E o `#` está livre justamente porque a chave saiu de lá (ver `ponte.js`).
 *
 * ── O CAMINHO VAI INTEIRO NUM SEGMENTO SÓ ─────────────────────────────
 * `#/arquivo/vagas%2FV-012-lumina.md`, e não `#/arquivo/vagas/V-012…`. A
 * barra codificada é o que faz o nome de arquivo com barra, acento ou espaço
 * atravessar sem ambiguidade — e é também o que impede uma rota de parecer
 * um caminho de servidor, que é a confusão que faz alguém escrever `..` ali
 * achando que vai a algum lugar. Quem confere o caminho é `nucleo/base.mjs`,
 * e ele o recebe como parâmetro de busca, não como caminho de URL.
 */

import { TEXTOS_PADRAO } from "./textos.js";

export const paraInicio = "#/";
export const paraTarefa = "#/tarefa";
/* ── ESTA É DO SISTEMA, E NÃO DO `INDICE.md` ──────────────────────────
   Todas as outras rotas da casa saem do menu da base: `## Onde está o quê`
   é o único lugar de onde a navegação nasce, e foi essa a condição do D230
   para a página inicial não ser escrita por pack. Os conectores não são da
   base — são da MÁQUINA (o cofre mora em `~/.kapstan/conectores/`, e quem
   instala dois packs tem um teto só). Por isso a entrada é fixa, escrita
   aqui, e não some quando o `INDICE.md` muda. */
export const paraConectores = "#/conectores";
/* também do sistema: o resto do INDICE — quem é, como trabalha, o que ficou
   para depois, onde a base mora. É referência, e saiu do início (D231). */
export const paraSobre = "#/sobre";
export const TODAS = "todas";
export const paraFunil = (etapa = TODAS, id = "") =>
  `#/funil/${encodeURIComponent(etapa || TODAS)}${id ? "/" + encodeURIComponent(id) : ""}`;
export const paraPasta = (nome) => `#/pasta/${encodeURIComponent(nome)}`;
export const paraArquivo = (caminho) => `#/arquivo/${encodeURIComponent(caminho)}`;

/** o fragmento virado em `{ tela, nome?, caminho? }`. O que não casa é o
    início: rota inventada não merece uma tela de erro própria. */
export function lerRota(fragmento = location.hash) {
  const bruto = String(fragmento || "").replace(/^#\/?/, "");
  if (!bruto) return { tela: "inicio" };
  if (bruto === "tarefa") return { tela: "tarefa" };
  if (bruto === "conectores") return { tela: "conectores" };
  if (bruto === "sobre") return { tela: "sobre" };
  const corte = bruto.indexOf("/");
  if (corte < 0) return { tela: "inicio" };
  const onde = bruto.slice(0, corte);
  let resto = bruto.slice(corte + 1);
  if (onde === "funil" || onde === "revisar") {
    const [etapa = "", id = ""] = resto.split("/").map((p) => { try { return decodeURIComponent(p); } catch { return p; } });
    return { tela: "funil", etapa: etapa || TODAS, id: onde === "funil" ? id : "" };
  }
  try { resto = decodeURIComponent(resto); } catch { /* fragmento torto */ }
  if (onde === "pasta") return { tela: "pasta", nome: resto };
  if (onde === "arquivo") return { tela: "arquivo", caminho: resto };
  return { tela: "inicio" };
}

/* ── A ORDEM DOS IDENTIFICADORES ──────────────────────────────────────
   Todo item de uma base tem id com apelido — `V-012 (PM de IA, Lumina)` —, e
   o arquivo dele se chama `<ID>-<apelido>.md`. É o contrato que garante isso,
   e é o que deixa um cartão do funil abrir o arquivo do item sem um pedido
   por cartão: o nome do arquivo já está na árvore.

   A letra é qualquer uma: `V-012`, `P-003`, `E-071`, `X-001`. Nada aqui sabe
   de ofício — e é essa a condição de a página inicial servir a dois packs
   sem uma linha de diferença. */
const IDENTIFICADOR = /\b([\p{Lu}]{1,4}-\d{1,6})\b/gu;

/**
 * O índice `ID → caminho do DONO`, montado da árvore rasa do mapa.
 *
 * ── O DONO É O ARQUIVO NA PASTA DE ITENS OU DE PESSOAS (D239) ─────────
 * `curriculos/V-014-cv.md` e `vagas/V-014-c6-bank.md` começam com o mesmo id,
 * e a primeira versão ficava com o que encontrasse primeiro: o cartão do
 * funil abria o currículo. As pastas de itens e de pessoas vêm do pack
 * (`acoes.json` → `pastas`); o que está nelas é o dono, e o resto é documento
 * (ver `documentosPorId`). Sem pastas declaradas, vale a ordem da árvore.
 */
export function indicePorId(arvore = [], pastas = {}) {
  const mapa = new Map();
  const donas = new Set([pastas?.item, pastas?.pessoa].filter(Boolean));
  const ordem = [...(arvore || [])].filter((i) => i.tipo === "pasta")
    .sort((a, b) => Number(donas.has(b.nome)) - Number(donas.has(a.nome)));
  for (const item of ordem) {
    for (const nome of item.itens || []) {
      const casou = /^([\p{Lu}]{1,4}-\d{1,6})-/u.exec(nome);
      if (casou && !mapa.has(casou[1])) mapa.set(casou[1], `${item.nome}/${nome}`);
    }
  }
  return mapa;
}

/** os OUTROS arquivos que carregam um id: `ID → [caminho, …]`, sem o dono */
export function documentosPorId(arvore = [], indice = new Map()) {
  const mapa = new Map();
  for (const item of arvore || []) {
    if (item.tipo !== "pasta") continue;
    for (const nome of item.itens || []) {
      const casou = /^([\p{Lu}]{1,4}-\d{1,6})-/u.exec(nome);
      if (!casou) continue;
      const caminho = `${item.nome}/${nome}`;
      if (indice.get(casou[1]) === caminho) continue;
      if (!mapa.has(casou[1])) mapa.set(casou[1], []);
      mapa.get(casou[1]).push(caminho);
    }
  }
  return mapa;
}

/** os ids de uma linha que EXISTEM como arquivo, na ordem em que aparecem */
export function idsDaLinha(texto, indice) {
  const achados = [];
  for (const [, id] of String(texto || "").matchAll(IDENTIFICADOR)) {
    if (indice.has(id) && !achados.includes(id)) achados.push(id);
  }
  return achados;
}

/* ── O QUE VEM DEPOIS DE `· próximo:` (D235) ──────────────────────────
   A linha do funil termina em `· próximo: <ação>` nos dois packs. Se a ação
   COMEÇA pelo nome de uma skill — `/vagas:candidatar` ou só `candidatar`,
   seguido do fim, de um travessão, de um ponto medial ou de vírgula —, o
   agente apontou o destaque daquele item, e o resto é a nota. Senão, é só a
   nota. "candidatar até sexta" NÃO casa: o nome tem de vir sozinho. */
export function proximoDaLinha(texto) {
  const m = String(texto || "").match(/(?:^|[·—,;])\s*pr[óo]ximo:\s*(.+?)\s*$/iu);
  return m ? m[1].trim() : "";
}
export function partirProximo(texto, comandos = []) {
  const t = String(texto || "").trim();
  const m = t.match(/^(\/[\w-]+:[\w-]+|[\w-]+)(?:\s*(?:—|·|,|:)\s*(.*))?$/u);
  if (m) {
    const comando = comandos.find((c) => c === m[1] || c.split(":").pop() === m[1]);
    if (comando) return { comando, nota: (m[2] || "").trim() };
  }
  return { comando: "", nota: t };
}

/* ── OS PASSOS DE UM ITEM (D235, D242) ────────────────────────────────
   A lista do "e agora?" de um item, na ordem: o que o agente apontou na
   linha do funil, depois o que o pack declarou para a etapa, e — sem
   declaração — os dois gestos do formato. Três telas a desenham (o
   `Proximo` nos três modos e o baralho), e uma cópia por tela divergiria.

     marcar      a etapa seguinte do funil, pela FILA
     descartar   o arquivo-morto, pela FILA
     skill       chama o assistente; com o id se ela age sobre o item
     conversa    skill sem `sobre`: não vira botão, copia o pedido

   O texto do botão é do pack (`rotulos`, por etapa de destino e por
   comando); sem ele, "Mover para “X”" — o verbo de todo quadro kanban. O
   "Marcar como “salva”" de antes escrevia a etapa como estado num botão
   que é gesto. */
export function passosDoItem({ id = "", andamento = null, acoes = [], proximos = {}, rotulos = {}, tipo = "item",
  ficha = null, ocupados = [], fim = null } = {}) {
  const etapa = andamento?.de?.get(id) || "";
  const todas = acoes.flatMap((g) => g.acoes || []);
  const doAgente = partirProximo(andamento?.proximo?.get(id) || "", todas.map((a) => a.comando));
  if (!etapa) return { etapa, seguinte: "", doAgente, lista: [], destaque: null, trilha: [] };
  const i = (andamento.etapas || []).indexOf(etapa);
  const seguinte = i >= 0 ? andamento.etapas[i + 1] || "" : "";
  const resolver = (entrada) => {
    if (entrada === "marcar") {
      return seguinte ? { tipo: "marcar", chave: "marcar", para: seguinte,
        rotulo: rotulos?.[seguinte] || `Mover para “${seguinte}”`,
        dica: `Só registra: passa de “${etapa}” para “${seguinte}”. Não pede ao assistente para fazer nada.` } : null;
    }
    if (entrada === "descartar") {
      return { tipo: "descartar", chave: "descartar", rotulo: "Descartar",
        dica: "Tirar da lista — vai para o arquivo-morto, com a data." };
    }
    /* o fim BOM do pack (`acoes.json` → `fim`): na etapa dele, um descarte
       com motivo fixo — sai do funil pela mesma porta, e não é recusa */
    if (entrada === "fim") {
      return { tipo: "fim", chave: "fim", rotulo: fim.rotulo, motivo: fim.motivo,
        dica: `Terminou bem: sai do funil para o arquivo-morto, com o motivo “${fim.motivo}”.` };
    }
    const a = todas.find((x) => x.comando === entrada);
    if (!a) return null;
    const sobre = a.sobre || [];
    const comItem = sobre.includes(tipo);
    const rotulo = (comItem && rotulos?.[a.comando]) || a.nome;
    if (!comItem && !sobre.includes("nada")) {
      return { tipo: "conversa", chave: a.comando, rotulo, oque: a.oque, pedido: `${a.comando} ${id}` };
    }
    const ocupado = comItem ? ocupados.find((o) => o.comando === a.comando && o.item === id) : null;
    return { tipo: "skill", chave: a.comando, rotulo, oque: a.oque, comando: a.comando,
      item: comItem ? id : "", pedido: comItem ? `${a.comando} ${id}` : a.comando,
      ocupado: ocupado ? ocupado.como : "" };
  };
  /* ── O FLUXO DA ETAPA (D257) ─────────────────────────────────────────
     Entrada é o comando, ou `{ faz, se, porque }`. O destaque é a primeira
     cujas condições valem — e sem a ficha do item não há como saber, então
     a condicional fica de fora do destaque e a lista segue igual. */
  const doPack = (Array.isArray(proximos?.[etapa]) ? proximos[etapa] : ["marcar", "descartar"])
    .map((e) => (typeof e === "string" ? { faz: e, se: [], porque: "" } : { faz: e.faz, se: e.se || [], porque: e.porque || "" }));
  const vale = (e) => e.se.every((c) => condicaoVale(c, ficha));
  const conta = (e) => !e.se.length || (ficha && vale(e));
  /* o agente apontou um passo que a ficha diz que já foi feito: vale a ficha */
  const apontado = doPack.find((e) => e.faz === doAgente.comando);
  const doAgenteVale = doAgente.comando && (!apontado || conta(apontado));
  const escolhida = doAgenteVale ? (apontado || { faz: doAgente.comando, se: [], porque: "" })
    : doPack.find((e) => conta(e)) || null;
  /* a trilha: as condicionais e o primeiro passo firme depois delas — o que
     já foi feito, o de agora e o que vem */
  const trilha = [];
  if (ficha && doPack.some((e) => e.se.length)) {
    for (const e of doPack) {
      if (e.faz === "marcar" || e.faz === "descartar") continue;
      const r = resolver(e.faz);
      if (!r) continue;
      trilha.push({ chave: r.chave, rotulo: r.rotulo, feito: e.se.length ? !vale(e) : false,
        agora: e === escolhida || (escolhida && escolhida.faz === e.faz) });
      if (!e.se.length) break;
    }
  }
  /* "Mais" tem TUDO o que se faz sobre o item: o fluxo da etapa, as outras
     skills que agem sobre ele, mover e descartar — nesta ordem */
  const doFluxo = doPack.map((e) => e.faz);
  const fimAqui = !!(fim?.de && fim.de === etapa);
  const outras = todas.filter((a) => (a.sobre || []).includes(tipo) && !doFluxo.includes(a.comando)).map((a) => a.comando);
  const ordem = [...new Set([escolhida?.faz, ...doFluxo.filter((e) => e !== "descartar"), ...outras,
    ...(doFluxo.includes("marcar") ? [] : ["marcar"]), fimAqui && "fim", "descartar"].filter(Boolean))];
  const lista = ordem.map(resolver).filter(Boolean);
  const destaque = escolhida ? lista.find((x) => x.chave === resolver(escolhida.faz)?.chave) || null : null;
  if (destaque) {
    destaque.recomendado = true;
    destaque.porque = escolhida.porque;
  }
  return { etapa, seguinte, doAgente, lista, destaque, trilha };
}

/** a decisão da fila é o fim bom, e não um descarte */
export const ehFim = (d, fim) => !!(fim?.motivo && d?.gesto === "descartar" && d.motivo === fim.motivo);

/**
 * O gesto de um passo na FILA: `{ decidir }` ou `{ anotar }`, ou null quando
 * o passo não é de fila. Descartar sobre o fim marcado troca o motivo em vez
 * de desmarcar — os dois são o mesmo gesto para a fila.
 */
export function gestoDoPasso(p, { id = "", nome = "", etapa = "", marcada = null, fim = null } = {}) {
  const de = { item: id, nome, de: etapa };
  if (p?.tipo === "marcar") return { decidir: { ...de, gesto: "etapa", para: p.para } };
  if (p?.tipo === "fim") return { decidir: { ...de, gesto: "descartar", motivo: p.motivo } };
  if (p?.tipo === "descartar") {
    return marcada?.item === id && ehFim(marcada, fim) ? { anotar: { item: id, motivo: "" } }
      : { decidir: { ...de, gesto: "descartar" } };
  }
  return null;
}

/* ── AS CONDIÇÕES DO FLUXO (D257) ─────────────────────────────────────
   Leem a ficha do item — campos, o que falta do destaque, os documentos e o
   histórico — e não sabem de ofício: "encaixe" e "completado" são palavras
   do pack, e aqui são só texto. */
export function condicaoVale(cond, ficha) {
  if (!ficha) return false;
  const [tipo, ...resto] = String(cond).split(":");
  const alvo = semAcentoNem(resto.join(":"));
  const campo = () => {
    const k = Object.keys(ficha.campos || {}).find((c) => semAcentoNem(c) === alvo);
    return k === undefined ? "" : ficha.campos[k];
  };
  const temDoc = () => (ficha.pastasDeDocs || []).some((p) => semAcentoNem(p) === alvo);
  const noHistorico = () => (ficha.historico || []).some((l) => semAcentoNem(l).includes(alvo));
  switch (tipo) {
    case "faltam": return (ficha.faltam || []).length > 0;
    case "sem": return semResposta(campo());
    case "com": return !semResposta(campo());
    case "sem-documento": return !temDoc();
    case "com-documento": return temDoc();
    case "nunca": return !noHistorico();
    case "ja": return noHistorico();
    /* o ESTADO, e não o passado (D262): só a última linha do histórico */
    case "agora": return semAcentoNem((ficha.historico || []).at(-1) || "").includes(alvo);
    default: return false;
  }
}

/* ── AS FASES DENTRO DE UMA ETAPA (D266) ──────────────────────────────
   O pack declara, por etapa, degraus que se LEEM da ficha — `{ nome, se }`,
   com as mesmas condições do fluxo —, e o item está no último cujas condições
   valem. Ninguém move o item para uma fase: ela é o que a base já diz, e por
   isso não envelhece. A etapa sem fase que valha fica com o nome dela. */
export function faseDe(it, fases = {}) {
  const ficha = fichaDoItem(it);
  const lista = fases?.[it?.etapa] || [];
  let achada = "";
  for (const f of lista) if (ficha && (f.se || []).every((c) => condicaoVale(c, ficha))) achada = f.nome;
  return achada;
}
/** a régua: as etapas e, logo depois de cada uma, as fases dela, na ordem */
export const trechosDoFunil = (etapas = [], fases = {}) => etapas.flatMap((e) => [
  { chave: e, rotulo: e, etapa: e, fase: "" },
  ...(fases?.[e] || []).map((f) => ({ chave: f.nome, rotulo: f.nome, etapa: e, fase: f.nome })),
]);
/** o item está neste trecho? a etapa com fases só leva quem não subiu a nenhuma */
export const noTrecho = (it, t, fases = {}) => it.etapa === t.etapa && faseDe(it, fases) === t.fase;

/** a ficha de um item para as condições, a partir do que a tabela já tem */
export const fichaDoItem = (it) => (it?.ficha ? { campos: it.campos || {}, faltam: it.faltam || [],
  pastasDeDocs: [...new Set((it.docs || []).map((d) => d.caminho.split("/")[0]))], historico: it.historico || [] } : null);

/** o que está na fila ou rodando, como `{ comando, item, como }` */
export function ocupadosDe(execucao) {
  const de = (x, como) => {
    const m = String(x?.nome || "").match(/·\s*(\p{Lu}{1,4}-\d{1,6})\s*$/u);
    return x?.o && m ? { comando: x.o, item: m[1], como } : null;
  };
  return [de(execucao?.rodando, "rodando"), ...(execucao?.fila || []).map((x) => de(x, "na fila"))].filter(Boolean);
}

/* a nota de UMA palavra (`próximo: julgar`) é o plano do agente escrito para
   ele mesmo; na tela ela lia "O assistente anotou: julgar", e não diz nada */
export const notaQueDiz = (nota) => /\s/.test(String(nota || "").trim()) ? String(nota).trim() : "";

/* ── O QUE SE LÊ DE UM ARQUIVO DE ITEM SEM ABRI-LO INTEIRO (D240, D242) ─
   A página do item e o baralho mostram o mesmo resumo: os campos do
   `destaque`, o link da fonte e as seções do `resumo` — declarados pelo
   pack, casados sem acento e sem caixa. O painel não sabe o que são. */
const semAcentoNem = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** `?` é "não diz"; campo que o arquivo não tem é "não consta" — os dois em âmbar */
export function chavesDoArquivo(arquivo, destaque = []) {
  if (!destaque.length || !arquivo?.campos?.length) return [];
  return destaque.map((rotulo) => {
    const c = arquivo.campos.find((x) => semAcentoNem(x.rotulo) === semAcentoNem(rotulo));
    const v = String(c?.valor ?? "").trim();
    const semResposta = !c || v === "" || /^\?/.test(v);
    return { rotulo, valor: !c ? "não consta" : semResposta ? "não diz" : v, semResposta, de: c?.de || c?.nota || "" };
  });
}

/** o primeiro campo cujo valor é um endereço: é a fonte, e abre no navegador */
export function linkDoArquivo(arquivo) {
  const c = (arquivo?.campos || []).find((x) => /^https?:\/\/\S+$/.test(String(x.valor || "").trim()));
  if (!c) return null;
  const url = String(c.valor).trim();
  let onde = "";
  try { onde = new URL(url).hostname.replace(/^www\./, ""); } catch { /* endereço torto: fica sem o nome */ }
  return { url, onde };
}

/* o contrato manda seção vazia continuar no arquivo com uma linha só —
   `- nada ainda.`, `- nada aqui hoje.` —, e ela não é conteúdo */
export const ehLinhaVazia = (texto) => /^nada\s+(ainda|aqui|por\s+aqui)\b/i.test(String(texto || "").trim());

/** as seções do `resumo`, na ordem do pack; sem `resumo`, as três primeiras
    de nível 2 que têm conteúdo, tirando o histórico */
export function resumoDoArquivo(arquivo, titulos = []) {
  const secoes = (arquivo?.secoes || []).map((s) => ({
    titulo: s.titulo, nivel: s.nivel,
    linhas: (s.itens || []).filter((i) => i.tipo === "linha" && !ehLinhaVazia(i.texto))
      .map((i) => ({ texto: i.texto, de: i.de || "" })),
  }));
  if (titulos.length) {
    return titulos.map((t) => secoes.find((s) => semAcentoNem(s.titulo) === semAcentoNem(t)) || { titulo: t, linhas: [] });
  }
  return secoes.filter((s) => s.nivel <= 2 && s.linhas.length && !/^hist[oó]rico/i.test(s.titulo)).slice(0, 3);
}

/* ── A CAUDA DE UMA LINHA DO FUNIL, PARA LER ──────────────────────────
   `desde 2026-09-20 · regime ? · veio de linkedin-vagas · próximo: julgar`
   é a linha como o agente a grava. No cartão, `desde` vira "há 2 dias" e o
   `próximo:` sai: quando nomeia uma skill ele JÁ É o botão em destaque, e
   quando não nomeia é uma nota que a página do item mostra. */
export function caudaParaLer(cauda, hoje = new Date()) {
  return String(cauda || "").split(" · ").map((p) => p.trim()).filter(Boolean)
    .filter((p) => !/^pr[óo]ximo:/iu.test(p))
    .map((p) => {
      const m = p.match(/^desde (\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return p;
      const dias = Math.round((Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
        - Date.UTC(+m[1], +m[2] - 1, +m[3])) / 864e5);
      return dias <= 0 ? "desde hoje" : dias === 1 ? "desde ontem" : `há ${dias} dias`;
    }).join(" · ");
}

/* ── O TÍTULO E A CAUDA DE UMA LINHA ──────────────────────────────────
   As linhas do funil e da lista do dia têm a mesma forma nos dois packs: o
   item, um travessão ou um ponto medial, e o resto. Partir ali é o que faz
   um cartão ter TÍTULO em vez de uma frase de 120 caracteres em negrito.

   O travessão vem antes do ponto medial de propósito: no funil, `·` separa
   campos (`desde …`, `próximo: …`) e o primeiro campo é o item; na lista do
   dia, ` — ` separa o item do motivo. Quem tem os dois quebra no primeiro. */
export function partirLinha(texto) {
  const t = String(texto || "").trim();
  /* corta no marcador que vem PRIMEIRO NO TEXTO, e não no primeiro da lista:
     `X-002 (…) · desde … · próximo: sobre-item — a nota` cortava no travessão,
     e o cartão inteiro virava título (visto em 22/09) */
  const cortes = [" — ", " · "].map((marca) => ({ marca, i: t.indexOf(marca) })).filter((c) => c.i > 0);
  if (!cortes.length) return { titulo: t, cauda: "" };
  const { marca, i } = cortes.reduce((a, b) => (b.i < a.i ? b : a));
  return { titulo: t.slice(0, i).trim(), cauda: t.slice(i + marca.length).trim() };
}

/* ── O NOME DE GENTE ──────────────────────────────────────────────────
   O menu sai do `## Onde está o quê` (D230), e lá os alvos são arquivos:
   `perfil.md`, `_bruto`, `arquivo-morto`. A limpeza é MECÂNICA de propósito —
   tira a extensão, troca `_` e `-` por espaço, sobe a primeira letra — e é
   por isso que não fere o D230: não há tabela de nomes bonitos por ofício. */
/** `vagas/V-014-c6-bank.md` → "V-014 (c6 bank)"; o resto, pelo nome de gente */
export function nomeDoArquivo(caminho) {
  const ultimo = String(caminho || "").split("/").pop();
  const m = ultimo.replace(/\.(md|csv|txt)$/i, "").match(/^(\p{Lu}{1,4}-\d{1,6})-(.+)$/u);
  return m ? `${m[1]} (${m[2].replace(/-/g, " ")})` : nomeDeGente(ultimo);
}

/* as duas pastas guardadas são do FORMATO, e não de um ofício: o nome delas é
   do motor (D242). "Bruto" lia como erro, e "Arquivo › Arquivo morto" repetia.
   O texto é da tabela de textos; o pack o troca, e `agruparMenu` o renova */
let DO_FORMATO = { "_bruto": TEXTOS_PADRAO.originais, "arquivo-morto": TEXTOS_PADRAO.arquivados };

export function nomeDeGente(alvo) {
  const formato = DO_FORMATO[String(alvo || "").trim().replace(/\/+$/, "")];
  if (formato) return formato;
  const cru =String(alvo || "").trim().replace(/\.(md|csv|txt)$/i, "").replace(/^[_.]+/, "");
  const limpo = cru.replace(/[_-]+/g, " ").trim().split(" ").map(comAcento).join(" ");
  return limpo ? limpo[0].toUpperCase() + limpo.slice(1) : String(alvo || "");
}

/* ── O ACENTO QUE O NOME DE ARQUIVO NÃO TEM ───────────────────────────
   `trajetoria.md` e `curriculos/` são nomes de disco, e nome de disco não
   leva acento. "Trajetoria" no menu lê como erro de digitação. A palavra
   certa quase sempre está escrita no próprio INDICE — na descrição ao lado, no
   título de uma seção —, e é de lá que ela vem: casa a palavra sem acento com
   a que o arquivo usa, e aceita o plural simples. Não achou, fica como está.
   Continua mecânico: o vocabulário é o da base aberta, e não uma tabela. */
const semAcento = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
let vocabulario = new Map();
export function aprenderNomes(mapa) {
  const texto = [mapa?.titulo, ...(mapa?.menu || []).map((m) => m.descricao),
    ...(mapa?.secoes || []).flatMap((s) => [s.titulo,
      ...(s.itens || []).map((i) => i.texto || i.valor || "")]),
    ...(mapa?.contadores || []).map((c) => c.rotulo)].join(" ");
  vocabulario = new Map();
  for (const [palavra] of texto.matchAll(/[\p{L}]{4,}/gu)) {
    const p = palavra.toLowerCase();
    if (p !== semAcento(p) && !vocabulario.has(semAcento(p))) vocabulario.set(semAcento(p), p);
  }
}
function comAcento(palavra) {
  const p = palavra.toLowerCase();
  if (vocabulario.has(p)) return vocabulario.get(p);
  if (p.endsWith("s") && vocabulario.has(p.slice(0, -1))) return vocabulario.get(p.slice(0, -1)) + "s";
  return palavra;
}

/* ── O ID E O APELIDO ─────────────────────────────────────────────────
   O contrato escreve `V-012 (PM de IA, Lumina)`: o id primeiro, o apelido
   entre parênteses. Para a máquina o id é o nome; para a pessoa o nome é o
   apelido, e `V-012` é a etiqueta. A tela inverte o peso dos dois e não
   esconde nenhum — o id é o que ela dita ao assistente. */
export function partirId(texto) {
  const m = /^\s*([\p{Lu}]{1,4}-\d{1,6})\s*\((.+)\)\s*$/u.exec(String(texto || ""));
  return m ? { id: m[1], nome: m[2].trim() } : { id: "", nome: String(texto || "").trim() };
}

/* ── O MENU EM GRUPOS, E O AGRUPAMENTO É MECÂNICO (D231) ──────────────
   material   o que a pessoa tem: pastas primeiro (são as listas), depois os
              documentos soltos
   guardado   o que começa com `_` ou é o `arquivo-morto` do formato — existe,
              abre, e não disputa o menu com o trabalho
   `hoje.md` e `funil.md` são do FORMATO e já SÃO o início: saem do menu
   quando existem. Nada aqui sabe de ofício. */
const JA_NO_INICIO = new Set(["hoje.md", "funil.md"]);
const ehGuardado = (alvo) => /^[_.]/.test(alvo) || alvo === "arquivo-morto";

/* `itens` é a pasta dos itens do pack e `funil`, se a base tem `funil.md`:
   com os dois, a entrada da pasta abre o funil em lista e detalhe (D245) —
   uma tela só para as mesmas vagas */
export function agruparMenu(mapa, { itens = "", funil = false, textos = TEXTOS_PADRAO } = {}) {
  DO_FORMATO = { "_bruto": textos.originais, "arquivo-morto": textos.arquivados };
  aprenderNomes(mapa);
  const pastas = new Map((mapa?.arvore || [])
    .filter((i) => i.tipo === "pasta").map((i) => [i.nome, i.itens || []]));
  const soltos = new Set((mapa?.arvore || [])
    .filter((i) => i.tipo === "arquivo").map((i) => i.nome));
  const grupos = { material: [], guardado: [] };
  for (const m of mapa?.menu || []) {
    if (m.tipo !== "pasta" && JA_NO_INICIO.has(m.alvo) && soltos.has(m.alvo)) continue;
    const dentro = pastas.get(m.alvo);
    const item = {
      alvo: m.alvo, tipo: m.tipo, descricao: m.descricao || "",
      nome: nomeDeGente(m.alvo),
      href: m.tipo === "pasta" ? (funil && m.alvo === itens ? paraFunil(TODAS) : paraPasta(m.alvo)) : paraArquivo(m.alvo),
      /* quantos arquivos há na pasta — o `_indice.md` é a lista, e não um item */
      quantos: dentro ? dentro.filter((n) => n !== "_indice.md").length : null,
    };
    (ehGuardado(m.alvo) ? grupos.guardado : grupos.material).push(item);
  }
  grupos.material.sort((a, b) => (a.tipo === "pasta" ? 0 : 1) - (b.tipo === "pasta" ? 0 : 1));
  return grupos;
}

/* ── A TABELA DOS ITENS E A ORDEM (D274) ─────────────────────────────────
   O valor de um campo tem a explicação junto — "remoto — o selo da própria
   vaga no LinkedIn…". Na tabela vai o trecho curto, até o primeiro
   separador; o inteiro vai no `title`. `?` é "sem resposta", e fica `?`. */
const SEPARADORES = / — | · |, |; /;
export function valorCurto(valor, teto = 34) {
  const v = String(valor ?? "").trim();
  if (!v || v.startsWith("?")) return v ? "?" : "";
  const curto = v.split(SEPARADORES)[0].trim();
  return curto.length > teto ? curto.slice(0, teto - 1).trimEnd() + "…" : curto;
}
export const semResposta = (valor) => !String(valor ?? "").trim() || String(valor).trim().startsWith("?");

const semAcentoMinusculo = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const DATA = /\b(\d{4})-(\d{2})-(\d{2})\b/;
const NUMERO = /(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?/;

/**
 * O que se compara de um valor: `[grupo, chave]`. Grupo 0 é o que tem
 * resposta, 1 o que não tem — o `?` vai sempre para o fim, nos dois sentidos.
 * `escala` é a do pack (`ordens`), e ganha dos outros tipos: "alto" antes de
 * "baixo" não é ordem de letra.
 */
export function chaveDeOrdem(valor, escala = null) {
  if (typeof valor === "number") return [0, valor];
  if (semResposta(valor)) return [1, 0];
  const v = String(valor);
  if (escala?.length) {
    const curto = semAcentoMinusculo(valorCurto(v, 200));
    const i = escala.findIndex((e) => curto.startsWith(semAcentoMinusculo(e)));
    return i >= 0 ? [0, i] : [1, 0];
  }
  const d = DATA.exec(v);
  if (d) return [0, Date.UTC(+d[1], +d[2] - 1, +d[3])];
  /* "R$ 15 a 19 mil": o "mil" vale para o trecho, e não só para o número colado nele */
  const curto = valorCurto(v, 200);
  const n = NUMERO.exec(curto);
  if (n && /^\D{0,4}\d/.test(curto)) {
    const inteiro = Number(n[1].replace(/\./g, "")) + (n[2] ? Number("0." + n[2]) : 0);
    return [0, /\bmil\b/i.test(curto) ? inteiro * 1000 : inteiro];
  }
  return [0, semAcentoMinusculo(v)];
}

/**
 * Ordena uma cópia. `pegar(item, chave)` devolve o valor; `desc` inverte só
 * os que têm resposta. Empate fica na ordem de chegada — que é a do funil.
 */
export function ordenar(itens, { chave = "", desc = false } = {}, pegar = (it, k) => it[k], escalas = {}) {
  if (!chave) return [...itens];
  const comChave = itens.map((it, i) => ({ it, i, k: chaveDeOrdem(pegar(it, chave), escalas[chave]) }));
  comChave.sort((a, b) => {
    if (a.k[0] !== b.k[0]) return a.k[0] - b.k[0];
    const x = a.k[1], y = b.k[1];
    const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "pt-BR");
    return (desc ? -c : c) || a.i - b.i;
  });
  return comChave.map((x) => x.it);
}

/**
 * O item do funil com a ficha dele (D274): os campos do cabeçalho, os
 * documentos que existem para ele (as pastas do `documentos` do pack), o que
 * do destaque está sem resposta, a última linha do histórico, e a posição
 * da etapa no funil — a última é a mais avançada.
 */
export function comFicha(item, { fichas = null, destaque = [], documentos = null, documentosDoPack = {}, etapas = [] } = {}) {
  const f = fichas?.get(item.caminho) || null;
  const campos = f?.campos || {};
  const deles = documentos?.get(item.id) || [];
  const docs = deles.filter((c) => /\.md$/i.test(c) && c.split("/")[0] in documentosDoPack)
    .map((c) => ({ caminho: c, rotulo: nomeDeGente(c.split("/")[0]).replace(/s$/, ""),
      pdf: deles.includes(c.replace(/\.md$/i, ".pdf")) }));
  return { ...item, campos, docs, ficha: Boolean(f), historico: f?.historico || [],
    faltam: f ? destaque.filter((d) => semResposta(campos[d])) : [],
    ultimo: f?.ultimo || "", em: f?.em || 0, etapaIndice: etapas.indexOf(item.etapa) };
}

/** o valor que se ordena, por chave — as do motor e os campos do destaque */
export function pegarDoItem(it, chave) {
  switch (chave) {
    case "nome": return it.titulo;
    case "etapa": return it.etapaIndice >= 0 ? it.etapaIndice : "?";
    case "documentos": return it.docs?.length || 0;
    case "faltam": return it.ficha ? it.faltam.length : "?";
    case "ultimo": return it.ultimo || "?";
    case "atualizada": return it.em || "?";
    default: return it.campos?.[chave];
  }
}

export const ordenacoesDe = (destaque = []) => [
  { chave: "", rotulo: "Ordem do funil" },
  { chave: "atualizada", rotulo: "Atualizada por último" },
  { chave: "etapa", rotulo: "Etapa" },
  ...destaque.map((d) => ({ chave: d, rotulo: d[0].toUpperCase() + d.slice(1) })),
  { chave: "faltam", rotulo: "O que falta" },
  { chave: "nome", rotulo: "Nome" },
];

/** de cima para baixo, o que se espera ver primeiro: o mais novo, o mais
    avançado, o maior número, o começo da escala do pack, e A antes de Z */
export function sentidoPadrao(chave, itens = [], escalas = {}) {
  if (["atualizada", "ultimo", "faltam", "etapa", "documentos"].includes(chave)) return true;
  if (escalas[chave]) return false;
  const chaves = itens.map((it) => chaveDeOrdem(pegarDoItem(it, chave))).filter((k) => k[0] === 0);
  return chaves.length > 0 && chaves.filter((k) => typeof k[1] === "number").length > chaves.length / 2;
}
