/**
 * O MOLDE E O AJUSTE (D244) — o painel montado de blocos.
 *
 * O pack traz o MOLDE no `painel.json` dele (o montador o leva ao
 * `acoes.json`): a ordem dos blocos do início, os campos em destaque, as
 * seções do resumo, os textos dos botões, os motivos de descarte e o próximo
 * passo de cada etapa. A base pode ter o PRÓPRIO `painel.json`, que o agente
 * escreve quando a pessoa pede — "põe o funil primeiro", "mostra o salário em
 * destaque" —, e o que ele diz vale por cima do molde.
 *
 * O painel só LÊ os dois. Chave desconhecida ou valor torto não derruba nada:
 * é ignorado, e vira um aviso que a página Conta mostra. É o mesmo princípio
 * do resto: o que a base diz errado se conserta na base, e a tela diz onde.
 */

/** os blocos do início, e a ordem quando ninguém disse outra */
export const BLOCOS_DO_INICIO = ["comeco", "novidades", "numeros", "hoje", "funil", "acoes"];

/** as chaves que a base pode ajustar */
/* o modelo do botão que lança o assistente (D267 emenda D263): mora aqui, e
   não no lancar.mjs, porque a página importa este arquivo e não pode levar Node. */
export const MODELO_PADRAO = "opus";
const APELIDOS = { opus: "Opus", sonnet: "Sonnet", haiku: "Haiku" };
/** o valor normalizado, ou "" quando não é um modelo que o botão aceita */
export function modeloValido(v) {
  const m = String(v ?? "").trim().toLowerCase();
  return APELIDOS[m] || /^claude-[a-z0-9][a-z0-9.-]{0,60}(\[1m\])?$/.test(m) ? m : "";
}
/** o nome que a tela escreve no aviso de custo */
export const nomeDoModelo = (m) => APELIDOS[m] || m || APELIDOS[MODELO_PADRAO];


/* `lancar: false` desliga o botão que chama o assistente: o painel mostra o
   pedido para copiar, e o servidor recusa o `POST /lancar` (`lancar.mjs`) */
export const CHAVES_DA_BASE = ["inicio", "destaque", "resumo", "rotulos", "motivos", "proximo", "modelo", "lancar"];

const listaDeTextos = (v, teto, largura) => Array.isArray(v) && v.length <= teto
  && v.every((x) => typeof x === "string" && x.trim() && x.length <= largura);

/**
 * O molde do pack (`acoes`) com o ajuste da base (`dela`, já lido como JSON)
 * por cima. Devolve o molde ajustado, mais `daBase` (as chaves que valeram) e
 * `avisos` (o que foi ignorado, e por quê).
 */
export function ajustarPelaBase(acoes, dela) {
  const saida = { ...acoes, daBase: [], avisos: [] };
  if (!dela || typeof dela !== "object" || Array.isArray(dela)) {
    saida.avisos.push("o painel.json da base não é um objeto");
    return saida;
  }
  const todas = (acoes.grupos || []).flatMap((g) => g.acoes || []);
  /* a base escreve o nome da skill ("candidatar"), como no painel.json do pack */
  const comandoDe = (s) => s === "marcar" || s === "descartar" ? s
    : todas.find((a) => a.comando === s || a.comando.endsWith(":" + s))?.comando || "";
  const etapas = Object.keys(acoes.proximo || {});
  const vale = (chave, valor) => { saida[chave] = valor; saida.daBase.push(chave); };
  const recusa = (texto) => saida.avisos.push(texto);

  for (const [chave, valor] of Object.entries(dela)) {
    if (chave.startsWith("_")) continue;                      // comentário, como no do pack
    if (!CHAVES_DA_BASE.includes(chave)) { recusa(`“${chave}” não é uma chave que o painel lê (as que ele lê: ${CHAVES_DA_BASE.join(", ")})`); continue; }
    if (chave === "inicio") {
      if (listaDeTextos(valor, BLOCOS_DO_INICIO.length, 20) && valor.every((b) => BLOCOS_DO_INICIO.includes(b))) vale(chave, valor);
      else recusa(`inicio: uma lista com os blocos ${BLOCOS_DO_INICIO.join(", ")} — o que não estiver nela some do início`);
    } else if (chave === "modelo") {
      const m = modeloValido(valor);
      if (m) vale(chave, m); else recusa("modelo: opus, sonnet, haiku ou um id claude-…");
    } else if (chave === "lancar") {
      if (typeof valor === "boolean") vale(chave, valor); else recusa("lancar: true ou false — false desliga o botão que chama o assistente");
    } else if (chave === "destaque") {
      if (listaDeTextos(valor, 8, 40)) vale(chave, valor); else recusa("destaque: até oito rótulos de campo, como estão no arquivo do item");
    } else if (chave === "resumo") {
      if (listaDeTextos(valor, 4, 60)) vale(chave, valor); else recusa("resumo: até quatro títulos de seção");
    } else if (chave === "motivos") {
      if (listaDeTextos(valor, 8, 60)) vale(chave, valor); else recusa("motivos: até oito textos curtos");
    } else if (chave === "rotulos") {
      if (!valor || typeof valor !== "object" || Array.isArray(valor)) { recusa("rotulos: um objeto { etapa ou skill: texto do botão }"); continue; }
      const novos = { ...(acoes.rotulos || {}) };
      for (const [k, v] of Object.entries(valor)) {
        if (typeof v !== "string" || !v.trim() || v.length > 32) { recusa(`rotulos · “${k}”: um texto de botão, com até 32 caracteres`); continue; }
        const comando = comandoDe(k);
        if (!etapas.includes(k) && !comando) { recusa(`rotulos · “${k}” não é etapa do funil nem skill do pack`); continue; }
        novos[etapas.includes(k) ? k : comando] = v.trim();
      }
      vale(chave, novos);
    } else if (chave === "proximo") {
      if (!valor || typeof valor !== "object" || Array.isArray(valor)) { recusa("proximo: um objeto { etapa: [passos] }"); continue; }
      const novo = { ...(acoes.proximo || {}) };
      for (const [etapa, lista] of Object.entries(valor)) {
        if (!etapas.includes(etapa)) { recusa(`proximo · “${etapa}” não é uma etapa do funil`); continue; }
        const resolvida = Array.isArray(lista) ? lista.map(comandoDe) : [];
        if (!resolvida.length || resolvida.some((c) => !c)) { recusa(`proximo · “${etapa}”: uma lista com marcar, descartar e skills do pack`); continue; }
        novo[etapa] = resolvida;
      }
      vale(chave, novo);
    }
  }
  return saida;
}
