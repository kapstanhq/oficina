/**
 * A BASE, LIDA — e SÓ lida.
 *
 * ── O QUE MUDOU NA PROPRIEDADE DO PAINEL, E O QUE NÃO MUDOU ────────────
 * Até o D230 o painel não abria arquivo nenhum, e isso era verificável de um
 * jeito grosseiro: `painel/` não importava `fs`. A página inicial precisa LER
 * — o mapa, a lista do dia, a ficha de um item —, então a propriedade muda de
 * forma e não de conteúdo:
 *
 *     não se importa função de ESCRITA, e só se lê DENTRO da raiz.
 *
 * Quem grava continua sendo o agente, pelas regras do contrato. O painel
 * propõe; o que a pessoa faz aqui volta como intenção (ver `sessao.mjs`).
 * Este módulo importa `readFile`, `readdir`, `stat` e `realpath`, e nenhuma
 * das quatro escreve. É a lista inteira, e ela cabe numa linha de propósito.
 *
 * ── AS GUARDAS DE CAMINHO, E POR QUE SÃO TRÊS E NÃO UMA ────────────────
 * O caminho chega da URL, e a URL chega de uma página. Mesmo com as quatro
 * guardas de `http.mjs` de pé, um caminho é entrada externa:
 *
 *   1 · a EXTENSÃO, conferida antes de encostar no disco. A base é texto —
 *       `.md`, `.csv`, `.txt`. Sem ela, `caminho=../../.ssh/id_rsa` seria
 *       barrado pela guarda 2, mas `chaves.pem` dentro da raiz não seria.
 *   2 · a CONTENÇÃO por `resolve`, que já normaliza `..`. O prefixo é
 *       comparado com `raiz + sep` e não com `raiz` cru: sem o separador,
 *       uma pasta irmã chamada `busca-velha` passaria pelo teste de prefixo
 *       de `busca`.
 *   3 · o `realpath`, e a contenção OUTRA VEZ depois dele. É a única que
 *       pega link simbólico: `atalho.md` dentro da raiz pode apontar para
 *       fora dela, e as duas primeiras guardas o aprovam — o caminho
 *       textual está dentro.
 *
 * A ordem importa: a contenção vem ANTES do `realpath` porque `realpath` de
 * um caminho de fora responde se ele existe, e responder isso já é vazar.
 *
 * ── E O INTERPRETADOR É PEQUENO E TOLERANTE, DE PROPÓSITO ──────────────
 * Ele não é um renderizador de markdown: é o que reconhece as CINCO formas
 * que o contrato fixa — o título, a linha `campo: valor  ← procedência`, a
 * linha de lista (com ou sem caixa), a tabela e o cabeçalho de seção. O que
 * ele não reconhece vira texto, e texto desenha bem. Um parser que recusasse
 * o que não entende transformaria uma linha torta num arquivo que não abre.
 */
import { readFile, readdir, realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, resolve, sep } from "node:path";

/* A base é TEXTO. Três extensões, e nenhuma delas é binária — o painel não
   serve imagem nem baixa anexo, e abrir essa porta seria abrir uma rota de
   arquivo genérica com um nome disfarçado. */
const EXTENSOES = new Set([".md", ".csv", ".txt"]);

/* Teto por arquivo. Um `_bruto/` com a página inteira de um portal colada
   dentro passa de 100 kB sem esforço; meio mega já é coisa que ninguém
   escreveu à mão, e ler 40 MB para a memória de um servidor que vive na
   máquina de quem trabalha é como se derruba o processo que segura a aba. */
const TETO_DE_ARQUIVO = 512 * 1024;

/* Teto de nomes por pasta na árvore. É só para o menu não virar uma parede:
   o índice de verdade de uma pasta é o `_indice.md` dela. */
const TETO_DA_PASTA = 400;

/* Teto do "o que mudou". Mais que isto numa visita é a base inteira mudando,
   e a lista deixa de ser resumo */
const TETO_DE_MUDANCAS = 60;
const VISTAS_DA_RAIZ = new Set(["INDICE.md", "hoje.md", "funil.md"]);

/* ── A NORMALIZAÇÃO QUE ACHA A SEÇÃO PELO NOME ────────────────────────
   As seções do `INDICE.md` têm nome fixo no contrato, mas com acento e com
   cauda — `## Quanto tem (recontar ao gravar)`. Comparar a string crua faria
   a página inicial depender da pontuação do título. */
const chave = (s) => String(s || "").normalize("NFD")
  .replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/* ── A PROCEDÊNCIA ────────────────────────────────────────────────────
   `valor  ← origem, AAAA-MM-DD`. A seta é U+2190 e é a marca que separa esta
   base de um CRM que inventa — ela vem separada do valor porque a tela a
   mostra em outra tinta, e não porque ela seja secundária. */
function comProcedencia(texto) {
  const i = texto.indexOf("←");
  if (i < 0) return { texto: texto.trim(), de: "" };
  return { texto: texto.slice(0, i).trim(), de: texto.slice(i + 1).trim() };
}

/* ── O QUE É CAMPO E O QUE É FRASE ────────────────────────────────────
   O primeiro caractere não pode ser o de nenhuma outra forma (`#` título,
   `-`/`*` lista, `|` tabela, `>` citação), e o rótulo não pode ter dois
   pontos dentro nem passar de 58 caracteres.

   O `:` precisa vir seguido de ESPAÇO ou de fim de linha, e é isso que
   impede `https://boards.greenhouse.io/...` — uma linha inteira de URL, comum
   em `_bruto/` — de virar um campo chamado "https".

   E a linha que abre com um nome e DOIS espaços é coluna do menu, não campo:
   `trajetoria.md    o que eu fiz: …` virava campo de rótulo comprido e sumia
   do menu sem aviso, porque o menu só lê colunas. */
const CAMPO = /^(?!\S+[ \t]{2,}\S)([^:#|>\-*\s][^:]{0,58}):(?:[ \t]+(.*))?$/;
const TITULO = /^(#{1,6})[ \t]+(.*)$/;
const CAIXA = /^[-*][ \t]+\[([ xX])\][ \t]+(.*)$/;
const MARCADOR = /^[-*][ \t]+(.*)$/;
const NUMERADA = /^\d{1,3}[.)][ \t]+(.*)$/;
const LINHA_DE_TABELA = /^[ \t]*\|/;
const SO_FILETE = /^[ \t]*\|[\s:|-]+\|[ \t]*$/;

/* ── A COLUNA DE DOIS ESPAÇOS ─────────────────────────────────────────
   `## Onde está o quê` é o MENU, e cada linha dele é `<alvo>   <descrição>`
   alinhada por espaço. Esse é o único lugar do formato em que o espaço
   duplo carrega significado — e é por ele que a linha do menu não é
   emendada no parágrafo de cima quando duas vêm seguidas. */
const COLUNAS = /^(\S+)[ \t]{2,}(.+)$/;

const celulas = (linha) => linha.trim().replace(/^\|/, "").replace(/\|$/, "")
  .split("|").map((c) => c.trim());

/**
 * O texto de um arquivo da base virado em forma.
 *
 * Devolve `{ titulo, campos, abertura, secoes }`, e cada seção traz os seus
 * `itens` NA ORDEM em que estão no arquivo — `{ tipo: "campo" | "linha" |
 * "tabela" | "colunas" }`. A ordem é o que deixa `## Quanto` de um perfil
 * (dois campos e uma frase, nessa ordem) sair na tela como está no arquivo.
 */
export function interpretar(texto) {
  const linhas = String(texto).replace(/\r\n/g, "\n").split("\n");

  let titulo = "";
  const abertura = [];
  const secoes = [];
  let alvo = abertura;                    // onde os itens caem agora
  let paragrafo = null;                   // linhas soltas seguidas viram uma
  let tabela = null;
  let emComentario = false;

  const fecharParagrafo = () => {
    if (paragrafo) alvo.push(paragrafo);
    paragrafo = null;
  };
  const fecharTabela = () => {
    if (tabela && (tabela.cabecalho.length || tabela.linhas.length)) alvo.push(tabela);
    tabela = null;
  };
  const fechar = () => { fecharParagrafo(); fecharTabela(); };

  for (const bruta of linhas) {
    const linha = bruta.replace(/\s+$/, "");

    /* comentário de HTML: o currículo abre com um, dizendo de onde ele foi
       derivado. Ele é registro para quem edita o arquivo, não conteúdo. */
    if (emComentario) {
      if (linha.includes("-->")) emComentario = false;
      continue;
    }
    if (/^[ \t]*<!--/.test(linha)) {
      if (!linha.includes("-->")) emComentario = true;
      continue;
    }

    if (!linha.trim()) { fechar(); continue; }

    const t = TITULO.exec(linha);
    if (t) {
      fechar();
      if (t[1].length === 1 && !titulo) { titulo = t[2].trim(); continue; }
      const nova = { titulo: t[2].trim(), nivel: t[1].length, itens: [] };
      secoes.push(nova);
      alvo = nova.itens;
      continue;
    }

    if (LINHA_DE_TABELA.test(linha)) {
      fecharParagrafo();
      if (SO_FILETE.test(linha)) continue;          // o filete do cabeçalho
      if (!tabela) tabela = { tipo: "tabela", cabecalho: celulas(linha), linhas: [] };
      else tabela.linhas.push(celulas(linha));
      continue;
    }
    fecharTabela();

    const cx = CAIXA.exec(linha);
    if (cx) {
      fecharParagrafo();
      const { texto: tx, de } = comProcedencia(cx[2]);
      alvo.push({ tipo: "linha", texto: tx, de, caixa: cx[1].toLowerCase() === "x", lista: true });
      continue;
    }

    const mc = MARCADOR.exec(linha) || NUMERADA.exec(linha);
    if (mc) {
      fecharParagrafo();
      const { texto: tx, de } = comProcedencia(mc[1]);
      alvo.push({ tipo: "linha", texto: tx, de, caixa: null, lista: true });
      continue;
    }

    const cp = CAMPO.exec(linha);
    if (cp) {
      fecharParagrafo();
      const { texto: valor, de } = comProcedencia(cp[2] ?? "");
      alvo.push({ tipo: "campo", rotulo: cp[1].trim(), valor, de });
      continue;
    }

    const col = COLUNAS.exec(linha);
    if (col) {
      fecharParagrafo();
      alvo.push({ tipo: "colunas", alvo: col[1].trim(), texto: col[2].trim() });
      continue;
    }

    /* sobrou frase. Linhas seguidas são UM parágrafo: o resumo de um
       currículo vem quebrado em três linhas de 80 colunas no arquivo, e
       desenhá-las como três itens daria três blocos onde há um. */
    const { texto: tx, de } = comProcedencia(linha.trim());
    if (paragrafo) paragrafo.texto += " " + tx;
    else paragrafo = { tipo: "linha", texto: tx, de, caixa: null, lista: false };
    if (de) { paragrafo.de = de; fecharParagrafo(); }
  }
  fechar();

  return {
    titulo,
    /* os campos do CABEÇALHO — os que vêm antes da primeira seção. São eles
       que a ficha mostra no topo, com a procedência de cada um. */
    campos: abertura.filter((i) => i.tipo === "campo")
      .map(({ rotulo, valor, de }) => ({ rotulo, valor, de })),
    abertura: abertura.filter((i) => i.tipo !== "campo"),
    secoes,
  };
}

const camposDe = (secao) => (secao?.itens || []).filter((i) => i.tipo === "campo")
  .map(({ rotulo, valor, de }) => ({ rotulo, valor, de }));

const acharSecao = (secoes, prefixo) =>
  secoes.find((s) => chave(s.titulo).startsWith(prefixo)) || null;

/**
 * A RAIZ, e tudo o que se lê dentro dela.
 *
 * Uma instância por processo. `registrar()` é chamado pela ferramenta
 * `painel_inicio` e pelo modo avulso — e é o único lugar em que a raiz muda.
 */
export function criarBase({ aoRegistrar = () => {} } = {}) {
  let raiz = "";
  let titulo = "";

  /* ── A CONTENÇÃO, e ela roda duas vezes ─────────────────────────────
     Antes do disco (contra `..` e caminho absoluto) e depois do `realpath`
     (contra link simbólico que escapa). Ver a nota do topo sobre a ordem. */
  const dentroDaRaiz = (absoluto) =>
    absoluto === raiz || absoluto.startsWith(raiz + sep);

  async function resolverDentro(relativo) {
    if (!raiz) throw new Error("não há base registrada — chame `painel_inicio` antes");
    const pedido = String(relativo || "").trim();
    if (!pedido) throw new Error("falta o caminho");
    if (pedido.includes("\0")) throw new Error("caminho inválido");
    if (isAbsolute(pedido)) {
      throw new Error("o caminho é relativo à base, e este é absoluto");
    }
    const alvo = resolve(raiz, pedido);
    if (!dentroDaRaiz(alvo)) throw new Error("fora da base");
    /* `realpath` também é o que confere existência — e ele falha com ENOENT,
       que vira "não existe" lá em cima, depois de a contenção já ter passado */
    const real = await realpath(alvo);
    if (!dentroDaRaiz(real)) throw new Error("fora da base");
    return real;
  }

  return {
    get raiz() { return raiz; },
    get titulo() { return titulo; },
    get ligada() { return !!raiz; },

    /**
     * Aponta o painel para uma pasta. Recusa o que não é base: o `INDICE.md`
     * é o que diz que aquela pasta É uma, e apontar para a pasta errada é o
     * erro mais provável de quem digita o caminho à mão — dizê-lo aqui custa
     * uma linha e economiza uma página inicial vazia sem explicação.
     */
    async registrar(caminho) {
      const pedido = String(caminho || "").trim();
      if (!pedido) throw new Error("falta `base` — o caminho inteiro da pasta");
      let real;
      try {
        real = await realpath(resolve(pedido));
      } catch {
        throw new Error(`não achei a pasta ${pedido}`);
      }
      if (!(await stat(real)).isDirectory()) {
        throw new Error(`${pedido} é um arquivo, e a base é uma pasta`);
      }
      let indice;
      try {
        indice = await readFile(resolve(real, "INDICE.md"), "utf8");
      } catch {
        throw new Error(`${pedido} não tem INDICE.md — não é a pasta da base`);
      }
      raiz = real;
      titulo = interpretar(indice).titulo || "";
      aoRegistrar(`base registrada: ${raiz}`);
      return { raiz, titulo };
    },

    /**
     * O MAPA — o `INDICE.md` interpretado, mais a árvore rasa.
     *
     * A navegação sai daqui e de nenhum outro lugar (D230): `## Onde está o
     * quê` é o menu, `## Quanto tem` são os números, `## O que está
     * conectado` é o estado. Nenhuma linha deste arquivo sabe de ofício.
     *
     * A árvore desce UM nível e leva só nomes. Não é zelo: é o que permite a
     * página resolver `V-031` no arquivo `vagas/V-031-cobre-energia.md` sem
     * um pedido por cartão do funil — o formato garante `ID-apelido.md`, e o
     * nome basta.
     */
    async mapa() {
      if (!raiz) throw new Error("não há base registrada");
      const indice = interpretar(await readFile(resolve(raiz, "INDICE.md"), "utf8"));
      const menu = (acharSecao(indice.secoes, "onde esta")?.itens || [])
        .filter((i) => i.tipo === "colunas")
        .map((i) => ({
          alvo: i.alvo.replace(/\/$/, ""),
          tipo: i.alvo.endsWith("/") ? "pasta" : "arquivo",
          descricao: i.texto,
        }));

      const arvore = [];
      for (const item of await readdir(raiz, { withFileTypes: true })) {
        if (item.name.startsWith(".")) continue;
        if (item.isDirectory()) {
          let dentro = [];
          try {
            dentro = (await readdir(resolve(raiz, item.name)))
              .filter((n) => !n.startsWith(".")).slice(0, TETO_DA_PASTA);
          } catch { /* pasta sem permissão de leitura entra vazia, e não para o mapa */ }
          arvore.push({ nome: item.name, tipo: "pasta", itens: dentro });
        } else if (item.isFile() && EXTENSOES.has(extname(item.name).toLowerCase())) {
          arvore.push({ nome: item.name, tipo: "arquivo" });
        }
      }

      return {
        raiz,
        titulo: indice.titulo,
        campos: indice.campos,
        quem: camposDe(acharSecao(indice.secoes, "quem sou")),
        menu,
        contadores: camposDe(acharSecao(indice.secoes, "quanto tem")),
        conectado: camposDe(acharSecao(indice.secoes, "o que esta conectado")),
        /* as seções INTEIRAS vão junto, cruas: `## Como eu trabalho` e
           `## Pulado no começo` não têm papel fixo, e a página as desenha
           pelo que são em vez de pelo nome que têm */
        secoes: indice.secoes,
        arvore,
      };
    },

    /**
     * O QUE MUDOU desde um instante (D234), pela data do arquivo e só por ela.
     * Desce dois níveis — o bastante para `arquivo-morto/<pasta>/`, que é onde
     * o que saiu vai parar. `novo` é o arquivo que NASCEU depois do instante:
     * mover não faz nascer, então o que foi aposentado sai como mudado.
     *
     * O painel não sabe QUEM mudou. A tela diz "mudou", e não "o assistente
     * fez" — a pessoa também pode ter aberto um arquivo num editor.
     *
     * As VISTAS ficam de fora — `INDICE.md`, `hoje.md`, `funil.md` e todo `_`
     * (o `_indice.md` de cada pasta, o `_bruto/`): são refeitas a cada gravação,
     * e na primeira captura ocupavam metade da lista dizendo "mudou" sobre o
     * que o início já mostra.
     */
    async mudancas(desde) {
      if (!raiz) throw new Error("não há base registrada");
      const limite = Number(desde) || 0;
      const saida = [];
      const olhar = async (rel, nivel) => {
        let entradas = [];
        try { entradas = await readdir(resolve(raiz, rel), { withFileTypes: true }); } catch { return; }
        for (const e of entradas) {
          if (e.name.startsWith(".") || e.name.startsWith("_")) continue;
          if (!rel && VISTAS_DA_RAIZ.has(e.name)) continue;
          const caminho = rel ? `${rel}/${e.name}` : e.name;
          if (e.isDirectory() && nivel < 2) await olhar(caminho, nivel + 1);
          else if (e.isFile() && EXTENSOES.has(extname(e.name).toLowerCase())) {
            const s = await stat(resolve(raiz, caminho));
            if (s.mtimeMs > limite) {
              saida.push({ caminho, novo: s.birthtimeMs > limite, em: Math.round(s.mtimeMs) });
            }
          }
        }
      };
      await olhar("", 0);
      return saida.sort((a, b) => b.em - a.em).slice(0, TETO_DE_MUDANCAS);
    },

    /** os bytes de um PDF da base — o que os documentos geraram (D270). Só
        `.pdf`: o painel continua sem servir arquivo cru de outro tipo */
    async pdf(relativo) {
      if (!/\.pdf$/i.test(String(relativo || ""))) throw Object.assign(new Error("só .pdf"), { codigo: 403 });
      const real = await resolverDentro(relativo).catch((e) => {
        throw Object.assign(e, { codigo: e?.code === "ENOENT" ? 404 : 403 });
      });
      return readFile(real);
    },

    /**
     * AS FICHAS de uma pasta, de uma vez (D274): o que a tabela da pasta dos
     * itens mostra sem abrir um por um. Por arquivo, os campos do cabeçalho
     * SEM a procedência, a última linha do `## Histórico` e quando ele mudou.
     * A pasta é UM nome da raiz — `vagas`, e não `vagas/../x` —, e o que
     * começa com `_` é vista, e fica de fora.
     */
    async fichas(pasta) {
      const nome = String(pasta || "").trim();
      if (!/^[^\\/.][^\\/]*$/.test(nome)) throw Object.assign(new Error("a pasta é um nome só"), { codigo: 403 });
      let real;
      try { real = await resolverDentro(nome); } catch (e) {
        throw Object.assign(e, { codigo: e.code === "ENOENT" ? 404 : 403 });
      }
      if (!(await stat(real)).isDirectory()) throw Object.assign(new Error("isto não é uma pasta"), { codigo: 404 });
      const nomes = (await readdir(real)).filter((n) => !/^[._]/.test(n) && extname(n).toLowerCase() === ".md")
        .slice(0, TETO_DA_PASTA);
      const saida = [];
      for (const n of nomes) {
        try {
          const s = await stat(resolve(real, n));
          if (!s.isFile() || s.size > TETO_DE_ARQUIVO) continue;
          const texto = await readFile(resolve(real, n), "utf8");
          const forma = interpretar(texto);
          const historico = (acharSecao(forma.secoes, "historico")?.itens || []).filter((i) => i.tipo === "linha");
          /* a primeira linha em comentário é o estado de um documento —
             "rascunho · derivado de … · para V-012" (D273, D258) */
          const nota = (texto.match(/^﻿?\s*<!--\s*([\s\S]*?)\s*-->/) || [])[1] || "";
          saida.push({
            caminho: `${nome}/${n}`,
            titulo: forma.titulo,
            campos: Object.fromEntries(forma.campos.map((c) => [c.rotulo, c.valor])),
            ultimo: historico.at(-1)?.texto || "",
            /* as linhas do histórico, curtas: é o que as condições do fluxo
               leem ("já foi completado?", D257) sem abrir o arquivo */
            historico: historico.slice(-40).map((i) => String(i.texto || "").slice(0, 160)),
            nota: nota.replace(/\s+/g, " ").slice(0, 400),
            /* o começo de cada seção com conteúdo, sem o histórico: é o que o
               cartão de uma pessoa mostra ("Fala por") sem abrir o arquivo */
            secoes: Object.fromEntries(forma.secoes
              .filter((s) => s.nivel <= 2 && !/^hist[óo]rico$/i.test(s.titulo.trim()))
              .map((s) => [s.titulo, s.itens.filter((i) => i.tipo === "linha" && !/^nada\s+(ainda|aqui)\b/i.test(String(i.texto || "").trim()))
                .slice(0, 3).map((i) => String(i.texto || "").slice(0, 200))])
              .filter(([, l]) => l.length)),
            em: Math.round(s.mtimeMs),
          });
        } catch { /* arquivo que não se lê não derruba a tabela */ }
      }
      return { pasta: nome, fichas: saida };
    },

    /**
     * UM arquivo: o texto cru e a interpretação ao lado.
     *
     * Os dois, e não um: a interpretação é o que desenha a ficha, e o cru é
     * o que sobra quando o arquivo não tem a forma que ela espera — um
     * currículo é markdown comum, e mostrar prosa como "seção vazia" seria
     * pior que mostrar o texto.
     */
    async arquivo(relativo) {
      const pedido = String(relativo || "").trim();
      const ext = extname(pedido).toLowerCase();
      /* a extensão é conferida ANTES do disco, no caminho PEDIDO: é o que
         faz `chaves.pem` ser recusado mesmo estando dentro da raiz */
      if (!EXTENSOES.has(ext)) {
        throw Object.assign(
          new Error(`o painel lê ${[...EXTENSOES].join(", ")} — e isto é "${ext || "sem extensão"}"`),
          { codigo: 403 });
      }
      let real;
      try {
        real = await resolverDentro(pedido);
      } catch (e) {
        /* "fora da base" é recusa (403); "não existe" é 404. Misturar os dois
           daria ao de fora a mesma resposta do inexistente — o que parece
           discrição e é o contrário: some a diferença entre a guarda ter
           funcionado e o arquivo não estar lá, e a prova deixa de medir. */
        throw Object.assign(e, { codigo: e.code === "ENOENT" ? 404 : 403 });
      }
      const dados = await stat(real);
      if (!dados.isFile()) {
        throw Object.assign(new Error("isto é uma pasta"), { codigo: 404 });
      }
      if (dados.size > TETO_DE_ARQUIVO) {
        throw Object.assign(
          new Error(`o arquivo tem ${Math.round(dados.size / 1024)} kB e o teto é ` +
            `${TETO_DE_ARQUIVO / 1024} kB`), { codigo: 413 });
      }
      const texto = await readFile(real, "utf8");
      const forma = interpretar(texto);
      return {
        caminho: pedido.replace(/\\/g, "/"),
        nome: pedido.split(/[\\/]/).pop(),
        bytes: dados.size,
        ...forma,
        texto,
      };
    },
  };
}
