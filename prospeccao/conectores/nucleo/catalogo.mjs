/**
 * O CATÁLOGO — o que EXISTE para ligar. É dado, e não código: conector novo
 * é uma entrada de JSON, e só o que não é JSON ou não cabe numa chamada
 * ganha adaptador.
 *
 * ── DUAS CAMADAS, UM ARQUIVO NO FIM ────────────────────────────────────
 * `conectores/catalogo.json` é a base, de qualquer ofício; o pack acrescenta
 * o dele em `<pack>/conectores.json`. No pack instalado o montador entrega
 * os dois já fundidos em `<pack>/conectores/catalogo.json` — é o mesmo
 * caminho relativo daqui, e por isso o servidor instalado não recebe
 * argumento nenhum. Na árvore-fonte, `--catalogo <arquivo>` funde um extra.
 *
 * Nome repetido entre camadas é ERRO, e não "o último vence": um pack que
 * redefinisse `apify` com outro endereço herdaria a chave e o teto que a
 * pessoa escreveu para o primeiro.
 *
 * ── E ELE É CONFERIDO AO SUBIR, NÃO AO USAR ────────────────────────────
 * Catálogo torto descoberto na chamada é descoberto pelo agente, no meio de
 * uma tarefa, com uma mensagem que fala de JSON. Descoberto ao subir, é
 * descoberto por quem escreveu a entrada.
 */
import { readFile } from "node:fs/promises";

const TIPOS = ["http", "mcp"];
const MODELOS = ["gratis", "medido", "estimado"];
const ACRESCIMOS = { "operacoes+": "operacoes", "sessoes+": "sessoes" };

export async function carregarCatalogo(arquivos) {
  const catalogo = {};
  for (const arquivo of arquivos) {
    let bruto;
    try { bruto = JSON.parse(await readFile(arquivo, "utf8")); } catch (e) {
      throw new Error(`catálogo ${arquivo}: ${e.message}`);
    }
    for (const [nome, entrada] of Object.entries(bruto)) {
      if (nome.startsWith("_")) continue;          // anotação, como no vocabulario.json
      /* ── A CAMADA DE CIMA ACRESCENTA OPERAÇÃO, E SÓ ISSO ─────────────────
         O pack não redefine um conector da base — herdaria a chave e o teto
         que a pessoa escreveu para outro endereço. Mas ele sabe o que o
         OFÍCIO dele pede daquele serviço: a entrada inteira de um ator, já
         com os filtros no lugar. `operacoes+` e `sessoes+` (D272: os sites
         em que o navegador entra) são as únicas chaves que ele pode pôr num
         nome que já existe, e repetida continua sendo erro. */
      if (nome in catalogo) {
        const chaves = Object.keys(entrada).filter((k) => !k.startsWith("_"));
        if (!chaves.length || chaves.some((k) => !ACRESCIMOS[k])) {
          throw new Error(`catálogo ${arquivo}: “${nome}” já existe em outra camada — ` +
            "a camada de cima só pode acrescentar `operacoes+` ou `sessoes+`");
        }
        for (const k of chaves) {
          const campo = ACRESCIMOS[k];
          for (const [chave, def] of Object.entries(entrada[k])) {
            if (chave in (catalogo[nome][campo] || {})) {
              throw new Error(`catálogo ${arquivo}: ${nome} já tem ${chave} em ${campo}`);
            }
            catalogo[nome] = { ...catalogo[nome], [campo]: { ...catalogo[nome][campo], [chave]: def } };
          }
        }
        continue;
      }
      catalogo[nome] = entrada;
    }
  }
  const erros = conferirCatalogo(catalogo);
  if (erros.length) throw new Error("catálogo:\n  " + erros.join("\n  "));
  return catalogo;
}

export function conferirCatalogo(catalogo) {
  const erros = [];
  for (const [nome, c] of Object.entries(catalogo)) {
    const e = (texto) => erros.push(`${nome}: ${texto}`);
    /* o nome vira argumento de linha de comando e chave de três arquivos */
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(nome)) e("o nome precisa ser kebab-case");
    if (!TIPOS.includes(c.tipo)) { e(`tipo “${c.tipo}” — os que existem: ${TIPOS.join(", ")}`); continue; }
    if (!String(c.oque || "").trim()) e("sem `oque` — é a frase que o agente repete à pessoa");
    /* os dois que são só da TELA (D231), opcionais: `oque` é escrito para o
       agente, em terceira pessoa e com nome de ferramenta dentro; `rotulo` é
       o nome que a pessoa lê e `para_voce` a frase dita a ela. Sem eles a
       tela cai no nome de máquina e no `oque`. */
    for (const k of ["rotulo", "para_voce"]) {
      if (c[k] !== undefined && !String(c[k] || "").trim()) e(`\`${k}\` vazio — ou escreve, ou tira`);
    }

    if (c.tipo === "mcp") {
      if (!c.prova) e("tipo mcp sem `prova` — sem ela ninguém sabe se ligou");
      if (!c.guia) e("tipo mcp sem `guia` — é o como_ligar dele");
      /* `ferramentas` é o que o botão do painel libera no `claude -p` quando a
         pessoa ligou o conector (D271) — por isso só em quem nasce desligado */
      if (c.ferramentas !== undefined) {
        if (!/^mcp__[\w-]+$/.test(String(c.ferramentas))) e("`ferramentas` é o prefixo do servidor: mcp__<nome>");
        else if (!nasceDesligado(c)) e("`ferramentas` num conector que não nasce desligado — ninguém o liberaria");
      }
      /* os sites em que se entra uma vez (D272): onde, de que domínios, e o
         cookie que diz "logado" — sem ele a tela não distingue entrar de abrir */
      for (const [site, d] of Object.entries(c.sessoes || {})) {
        const s = (texto) => e(`sessoes.${site}: ${texto}`);
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(site)) s("o nome precisa ser kebab-case");
        if (!String(d?.rotulo || "").trim()) s("sem `rotulo`");
        let https = false;
        try { https = new URL(d?.entrar).protocol === "https:"; } catch { /* abaixo */ }
        if (!https) s("`entrar` precisa ser um endereço https");
        for (const k of ["dominios", "sinal"]) {
          if (!Array.isArray(d?.[k]) || !d[k].length || d[k].some((x) => !String(x || "").trim())) {
            s(`\`${k}\` é uma lista não vazia`);
          }
        }
      }
      continue;
    }

    const modelo = c.custo?.modelo;
    if (!MODELOS.includes(modelo)) e(`custo.modelo “${modelo}” — os que existem: ${MODELOS.join(", ")}`);
    if (modelo && modelo !== "gratis") {
      if (!c.custo.moeda) e("pago sem `custo.moeda`");
      /* sem estimativa não há como recusar ANTES de gastar, que é a metade
         do teto que importa */
      if (!(Number(c.custo.estimativa) > 0)) e("pago sem `custo.estimativa` maior que zero");
    }
    if (c.chave && !(c.chave.nome && c.chave.como)) e("`chave` precisa de `nome` e `como`");

    /* ── OS TRÊS CAMPOS QUE EXISTEM PARA O PAINEL ────────────────────────
       Os três são OPCIONAIS e nenhum muda o que o agente vê: eles são o que
       uma PESSOA leiga precisa para ligar um serviço sem abrir terminal —
       onde se pega a chave, quanto costuma bastar de teto, e um botão que
       prove que aquilo ficou de pé. Conector sem eles continua certo; o que
       ele perde é a tela ficar com menos a dizer.

       Conferidos aqui, ao subir, pela mesma razão do resto do arquivo: um
       `como_obter_chave` que virou string em vez de lista descoberto na
       tela é descoberto por quem não pode consertá-lo. */
    if (c.como_obter_chave !== undefined) {
      if (!Array.isArray(c.como_obter_chave) || !c.como_obter_chave.length
        || c.como_obter_chave.some((p) => !String(p || "").trim())) {
        e("`como_obter_chave` é uma lista de passos curtos, em linguagem de gente");
      }
      if (!c.chave) e("`como_obter_chave` num conector que não pede chave");
    }
    if (c.teto_sugerido !== undefined) {
      if (!(Number(c.teto_sugerido) > 0)) e("`teto_sugerido` precisa ser maior que zero");
      else if (!ehPago(c)) e("`teto_sugerido` num conector que não custa nada");
    }
    if (c.teste !== undefined) {
      if (!String(c.teste.oque || "").trim()) {
        e("`teste` sem `oque` — é a frase que a pessoa lê antes de apertar");
      }
      /* DUAS formas, e uma de cada vez: `url` é a conferência que não custa
         (a chave é aceita?) e `operacao` é uma chamada de verdade, que passa
         pelo orçamento e pelo teto como qualquer outra. Aceitar as duas
         juntas deixaria a tela decidir qual vale. */
      const formas = [c.teste.url, c.teste.operacao].filter(Boolean).length;
      if (formas !== 1) {
        e("`teste` é OU `url` (uma conferência que não custa) OU `operacao` (uma chamada de verdade)");
      }
      if (c.teste.url) {
        try {
          const u = new URL(c.teste.url);
          if (!["https:", "http:"].includes(u.protocol)) e(`teste: protocolo ${u.protocol}`);
        } catch { e("`teste.url` não é endereço"); }
      }
      if (c.teste.operacao && !(c.teste.operacao in (c.operacoes || {}))) {
        e(`\`teste.operacao\` ${c.teste.operacao} não existe em \`operacoes\``);
      }
    }

    if (!c.operacoes || !Object.keys(c.operacoes).length) e("tipo http sem `operacoes`");
    for (const [op, d] of Object.entries(c.operacoes || {})) {
      if (c.adaptador) continue;                   // quem sabe o endereço é o adaptador
      if (!d.url) { e(`${op}: sem \`url\``); continue; }
      try {
        const u = new URL(d.url.replace(/<[^>]+>/g, "x"));
        if (!["https:", "http:"].includes(u.protocol)) e(`${op}: protocolo ${u.protocol}`);
      } catch { e(`${op}: \`url\` não é endereço`); }
      /* parâmetro usado e não declarado passaria pela recusa de "parâmetro
         desconhecido" e a operação nunca poderia ser chamada */
      const usados = [...JSON.stringify([d.url, d.consulta || {}, d.campos || {}])
        .matchAll(/<([\w-]+)(?:\|[^>]*)?>/g)].map((m) => m[1]);
      for (const p of new Set(usados)) {
        if (!(p in (d.parametros || {}))) e(`${op}: usa <${p}> e não o declara em \`parametros\``);
      }
    }
  }
  return erros;
}

/** quem precisa ser LIGADO por alguém — ver `conectores.md`, "Os três estados" */
export const nasceDesligado = (c) => Boolean(c.aviso || c.chave);
export const ehPago = (c) => c.tipo === "http" && c.custo?.modelo && c.custo.modelo !== "gratis";
