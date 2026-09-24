/**
 * `npm run prova-oficina -- [--seco [pasta] | --rodar [skill]] [--pack <pack>] [--fixture <pasta>]`
 *
 * A PROVA DO PACK DO CORRETOR — o que o `npm run prova` é para as figuras do
 * Estúdio, este é para as dez skills da Oficina: mecânico, sem julgar
 * qualidade, pegando o que QUEBRA O CONTRATO.
 *
 * ── POR QUE ESTE ARQUIVO EXISTE ────────────────────────────────────────
 * O `oficina/corretor/CONTRATO.md` é normativo — formatos literais, tetos em
 * número, id que nunca anda sozinho — e até aqui nada executava contra ele.
 * Skill que inventa nome de seção, deixa `<AAAA-MM-DD>` de gabarito no arquivo
 * do corretor ou escreve `dd/mm` num campo abre a carteira normalmente: o
 * defeito só aparece na skill seguinte, que lê aquilo e erra em cima.
 *
 * ── OS DOIS MODOS, E POR QUE SÃO DOIS ──────────────────────────────────
 *   --seco [pasta]   lê uma carteira e aplica as regras mecânicas. Não chama
 *                    modelo nenhum, roda em dois segundos, e é o que confere
 *                    a PRÓPRIA FIXTURE — prova que não passa na fixture está
 *                    medindo a fixture, não a skill.
 *   --rodar [skill]  copia a fixture, executa `claude -p /corretor:<skill>`
 *                    com a entrada do roteiro, e mede a resposta E a carteira
 *                    resultante contra a fixture.
 *
 * O controle é o `--seco`: sem ele, um ✗ do `--rodar` não distingue "a skill
 * quebrou o contrato" de "a régua está torta".
 *
 * ── O QUE ELE NÃO FAZ ──────────────────────────────────────────────────
 * Não julga texto. Não diz se a mensagem ficou boa, se o anúncio vende, se a
 * ordem da visita faz sentido. Quem julga isso é gente lendo. Ele pega o que
 * é verificável por regra: gabarito sobrando, id sem apelido, teto estourado,
 * etapa inventada, seção fora de ordem, arquivo apagado, bruto mexido, data
 * em dd/mm, e o arquivo que a skill tocou sem ter licença.
 */
import { readFile, writeFile, mkdir, readdir, rm, cp } from "node:fs/promises";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ── O PACK DEIXA DE SER CONSTANTE ─────────────────────────────────────
   Isto tinha `corretor` escrito em seis lugares: os três caminhos, as seis
   etapas do funil, as quatro seções do hoje, o formato do id e o nome das
   duas pastas. Um pack de outro ofício passava em branco em duas regras sem
   nada acusar — que é o modo de falha que o resto da Oficina existe para
   combater.

   O que se deriva sai do GABARITO, e não de uma segunda lista: `modelos/`
   é a fonte literal do formato e é o mesmo arquivo que a skill copia para
   a carteira. Uma etapa nova no funil chega aqui sozinha. */
/* a fixture mora numa pasta com o nome que o PACK dá ao lugar — a
   {pasta-base} do vocabulário: `carteira` nos dois primeiros, `busca` no de
   vagas. Era `carteira` escrito à mão, e o terceiro pack ficava sem prova. */
const pastaBaseDe = (pack) => {
  const p = join(RAIZ, pack, "contrato", "vocabulario.json");
  const v = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
  return v["pasta-base"] || String(v.base || "base").normalize("NFD")
    .replace(/[^a-zA-Z0-9 -]/g, "").toLowerCase().replace(/ +/g, "-");
};
const PACK = (() => {
  const i = process.argv.indexOf("--pack");
  if (i > 0 && process.argv[i + 1]) return process.argv[i + 1];
  const m = JSON.parse(readFileSync(
    join(RAIZ, ".claude-plugin", "marketplace.json"), "utf8"));
  const comFixture = m.plugins
    .map((p) => p.source.replace(/^\.\//, ""))
    .filter((p) => existsSync(join(RAIZ, "_prova", p, pastaBaseDe(p))));
  return comFixture[0] || "corretor";
})();

/* ── A FIXTURE NÃO É SÓ UMA POR PACK ───────────────────────────────────
   `--fixture vagas-b` troca a pasta de `_prova/` e mantém o pack: a mesma
   régua, o mesmo plugin, outra pessoa. Uma persona só deixa passar a skill
   que escreve o ofício da fixture em vez do ofício de quem usa — e o pack de
   vagas vai a público para qualquer profissão. Sem a opção, a pasta é a do
   pack, como sempre foi. */
const FIXTURE_PASTA = (() => {
  const i = process.argv.indexOf("--fixture");
  const f = i > 0 ? process.argv[i + 1] : undefined;
  if (i > 0 && (!f || f.startsWith("--"))) {
    console.error("--fixture pede o nome de uma pasta de _prova/, ex.: --fixture vagas-b");
    process.exit(1);
  }
  return f || PACK;
})();
/* a segunda fixture traz roteiro só do que faz sentido checar noutra persona:
   skill sem roteiro ali é pulada, e não erro de cobertura — a cobertura é
   cobrada na fixture principal do pack */
const SEGUNDA = FIXTURE_PASTA !== PACK;

const PASTA_BASE = pastaBaseDe(PACK);
const FIXTURE = join(RAIZ, "_prova", FIXTURE_PASTA, PASTA_BASE);
const ROTEIROS = join(RAIZ, "_prova", FIXTURE_PASTA, "roteiros");
if (SEGUNDA && !existsSync(FIXTURE)) {
  console.error(`--fixture ${FIXTURE_PASTA}: não há ${join("_prova", FIXTURE_PASTA, PASTA_BASE)}`);
  process.exit(1);
}
/* o laudo e as execuções da segunda fixture moram numa subpasta: rodar as
   duas em seguida não apaga a resposta da outra */
const PROC = join(RAIZ, "proc", "prova-oficina", ...(SEGUNDA ? [FIXTURE_PASTA] : []));
const PLUGIN = join(RAIZ, PACK);
const MODELOS = join(PLUGIN, "modelos");

const vocabDoPack = (() => {
  const p = join(PLUGIN, "contrato", "vocabulario.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
})();

/** os `## ` de um gabarito, que é onde as etapas e as seções moram */
const titulosDe = (arquivo) => {
  const p = join(MODELOS, arquivo);
  if (!existsSync(p)) return [];
  return readFileSync(p, "utf8").split(/\r?\n/)
    .filter((l) => /^## /.test(l)).map((l) => l.trim());
};

const ETAPAS = titulosDe("funil.md").map((l) => l.replace(/^##\s+/, ""));
const SECOES_HOJE = titulosDe("hoje.md");

// O que os gabaritos marcam como campo a preencher, e nenhum chega a quem
// usa (CONTRATO §4). O prefixo do id é do ofício; o FORMATO é do contrato.
const GABARITO = /<(AAAA|nome|apelido|tipo|[A-Z]{1,2}-000)/;

// dd/mm só vale dentro de `_bruto/`, que é material colado (CONTRATO §3 e §7).
// Exige dígito depois da barra: senão `R$ 96/mês` vira data.
const DATA_CURTA = /\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/;

const RE_ID = /\b([A-Z]{1,2}-\d{3})\b/g;
const RE_VALOR = /R\$\s*\d[\d.]*(?:,\d{2})?/g;

// ── a régua ────────────────────────────────────────────────────────────

const linhas = (t) => t.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");

function globRe(g) {
  let out = "";
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === "*") {
      if (g[i + 1] === "*") {
        out += ".*";
        i++;
      } else out += "[^/]*";
    } else if ("\\^$.|?+()[]{}".includes(c)) out += "\\" + c;
    else out += c;
  }
  return new RegExp("^" + out + "$");
}

const casa = (caminho, globs) => globs.some((g) => globRe(g).test(caminho));

async function arvore(raiz, sub = "") {
  const mapa = new Map();
  const dir = sub ? join(raiz, sub) : raiz;
  if (!existsSync(dir)) return mapa;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = sub ? `${sub}/${e.name}` : e.name;
    if (e.isDirectory()) {
      for (const [k, v] of await arvore(raiz, rel)) mapa.set(k, v);
    } else {
      mapa.set(rel, await readFile(join(raiz, ...rel.split("/")), "utf8"));
    }
  }
  return mapa;
}

const teto = (caminho) => {
  if (caminho === "INDICE.md") return 120;
  const f = caminho.split("/").pop();
  if (f === "_indice.md") return null;
  const naPasta = (nome) => nome && new RegExp("(^|/)" + nome + "/").test(caminho);
  if (naPasta(vocabDoPack["pasta-pessoas"])) return Number(vocabDoPack["teto-pessoa"]) || 60;
  if (naPasta(vocabDoPack["pasta-itens"])) return Number(vocabDoPack["teto-item"]) || 40;
  return null;
};

/* ── OS GABARITOS SÃO A FONTE DO FORMATO, E NINGUÉM OS LIA ──────────────
   A fixture é a coisa contra a qual toda skill é medida, e até aqui nada a
   media contra o contrato. Ela podia divergir do gabarito sem uma linha de
   alarme — e divergiu: a proposta da P-031 saía em 17/08 com a promessa de
   levá-la ao jurídico datada de 13/08, e sete campos apontavam para um
   `_bruto/` que não existia. As duas foram achadas por EXECUÇÃO DE MODELO,
   que é a régua mais cara que existe, e as duas eram mecânicas.

   O mapeamento sai do próprio gabarito: cada um abre dizendo "Vai para
   ~/carteira/<caminho>", e é daí que se sabe qual arquivo da carteira ele
   governa. Sem isso seria uma segunda lista, e segunda lista envelhece.

   O que ela cobra é o MÍNIMO do gabarito — todo campo e toda seção dele
   existem no arquivo. Campo A MAIS só é erro fora de `arquivo-morto/`: lá a
   ficha ganha o carimbo `aposentado:`, que o gabarito da ficha viva não tem
   e não deve ter. */

const semComentario = (t) => t.replace(/<!--[\s\S]*?-->/g, "");
const titulosDoTexto = (t) =>
  linhas(semComentario(t)).filter((l) => /^## /.test(l)).map((l) => l.trim());
const camposDoTexto = (t) => {
  const out = [];
  for (const l of linhas(semComentario(t))) {
    if (/^## /.test(l)) break;
    const m = l.match(/^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ 0-9_-]*):/);
    if (m) out.push(m[1].trim());
  }
  return out;
};

/** os gabaritos, indexados pelo destino que eles mesmos declaram */
const GABARITOS = (() => {
  const porDestino = new Map(), porPasta = new Map();
  if (!existsSync(MODELOS)) return { porDestino, porPasta };
  for (const n of readdirSync(MODELOS)) {
    if (!n.endsWith(".md")) continue;
    const texto = readFileSync(join(MODELOS, n), "utf8");
    const m = texto.match(new RegExp("Vai para ~[/]" + PASTA_BASE + "[/]([A-Za-z0-9_./-]+[.]md)"));
    if (!m) continue;
    porDestino.set(m[1], [n, texto]);
    /* gabarito de FICHA: o destino tem pasta e o nome não é `_indice.md`.
       Ele governa todo arquivo daquela pasta, e o exemplo do cabeçalho é só
       um deles. */
    const i = m[1].lastIndexOf("/");
    if (i > 0 && m[1].slice(i + 1) !== "_indice.md") {
      porPasta.set(m[1].slice(0, i), [n, texto]);
    }
  }
  return { porDestino, porPasta };
})();

const gabaritoDe = (caminho) => {
  /* `arquivo-morto/` é a mesma ficha noutra pasta */
  const vivo = caminho.replace(/^arquivo-morto[/]/, "");
  if (GABARITOS.porDestino.has(vivo)) return GABARITOS.porDestino.get(vivo);
  const i = vivo.lastIndexOf("/");
  return i > 0 ? GABARITOS.porPasta.get(vivo.slice(0, i)) : undefined;
};

// ── as regras sobre a carteira ─────────────────────────────────────────

function regrasDaCarteira(mapa) {
  const r = [];
  const falha = (regra, msg) => r.push({ regra, ok: false, msg });
  const passa = (regra, msg) => r.push({ regra, ok: true, msg });

  // (a) nenhum <…> de gabarito sobrando
  let a = 0;
  for (const [caminho, texto] of mapa) {
    linhas(texto).forEach((l, i) => {
      if (GABARITO.test(l)) {
        a++;
        falha("a · gabarito", `${caminho}:${i + 1} — ${l.trim()}`);
      }
    });
  }
  if (!a) passa("a · gabarito", `nenhum <…> de gabarito em ${mapa.size} arquivos`);

  // (b) id nunca anda sozinho: V-071 vem seguido de " ("
  let b = 0;
  for (const [caminho, texto] of mapa) {
    if (caminho.startsWith("_bruto/")) continue;
    linhas(texto).forEach((l, i) => {
      for (const m of l.matchAll(RE_ID)) {
        const ini = l.lastIndexOf(" ", m.index) + 1;
        const fimEsp = l.indexOf(" ", m.index);
        const token = l.slice(ini, fimEsp === -1 ? l.length : fimEsp);
        if (token.includes("/") || /\.(md|csv)$/.test(token)) continue; // nome de arquivo
        if (l.slice(m.index + m[1].length, m.index + m[1].length + 2) === " (") continue;
        b++;
        falha("b · id sozinho", `${caminho}:${i + 1} — ${m[1]} sem apelido · ${l.trim()}`);
      }
    });
  }
  if (!b) passa("b · id sozinho", "todo id aparece com o apelido junto");

  // (c) os tetos do CONTRATO §9
  let c = 0;
  for (const [caminho, texto] of mapa) {
    const t = teto(caminho);
    if (t) {
      const n = linhas(texto).length;
      if (n > t) {
        c++;
        falha("c · teto", `${caminho} — ${n} linhas, teto ${t}`);
      }
    }
    if (caminho === "hoje.md") {
      const caixas = linhas(texto).filter((l) => /^\s*- \[[ xX]\]/.test(l)).length;
      if (caixas > 15) {
        c++;
        falha("c · teto", `hoje.md — ${caixas} caixas, teto 15`);
      }
    }
  }
  if (!c) passa("c · teto", "INDICE 120 · os do vocabulário do pack · hoje 15 caixas");

  // (d) etapa: só uma das seis
  let d = 0;
  for (const [caminho, texto] of mapa) {
    linhas(texto).forEach((l, i) => {
      const m = l.match(/^etapa:\s*(.+)$/);
      if (!m) return;
      const valor = m[1].split("·")[0].trim();
      if (!ETAPAS.includes(valor)) {
        d++;
        falha("d · etapa", `${caminho}:${i + 1} — "${valor}" não é uma das seis`);
      }
    });
  }
  if (!d) passa("d · etapa", "as seis etapas do CONTRATO §4.3, e nenhuma inventada");

  // (e) hoje.md com as quatro seções, nesta ordem
  const hoje = mapa.get("hoje.md");
  if (hoje === undefined) {
    passa("e · hoje.md", "não existe nesta carteira");
  } else {
    const ls = linhas(hoje);
    const pos = SECOES_HOJE.map((s) => ls.findIndex((l) => l.trim() === s));
    const faltando = SECOES_HOJE.filter((_, i) => pos[i] === -1);
    if (faltando.length) falha("e · hoje.md", `seção faltando: ${faltando.join(" · ")}`);
    else if (!pos.every((p, i) => i === 0 || p > pos[i - 1]))
      falha("e · hoje.md", `as quatro seções estão fora de ordem (linhas ${pos.join(", ")})`);
    else passa("e · hoje.md", "as quatro seções, nesta ordem");
  }

  // (g) data de campo em AAAA-MM-DD; dd/mm só dentro de _bruto/
  let g = 0;
  for (const [caminho, texto] of mapa) {
    if (caminho.startsWith("_bruto/")) continue;
    linhas(texto).forEach((l, i) => {
      if (DATA_CURTA.test(l)) {
        g++;
        falha("g · data", `${caminho}:${i + 1} — ${l.trim()}`);
      }
    });
  }
  if (!g) passa("g · data", "toda data de campo em AAAA-MM-DD");

  // (l) a estrutura de cada arquivo contra o gabarito que o governa
  let l = 0, comGabarito = 0;
  for (const [caminho, texto] of mapa) {
    if (caminho.startsWith("_bruto/")) continue;
    const alvo = gabaritoDe(caminho);
    if (!alvo) continue;
    comGabarito++;
    const [nome, modelo] = alvo;
    const morto = caminho.startsWith("arquivo-morto/");
    const secoes = titulosDoTexto(texto), campos = camposDoTexto(texto);
    const faltamS = titulosDoTexto(modelo).filter((s) => !secoes.includes(s));
    const faltamC = camposDoTexto(modelo).filter((s) => !campos.includes(s));
    const sobramC = morto ? []
      : campos.filter((s) => !camposDoTexto(modelo).includes(s));
    for (const [rotulo, itens] of [["seção", faltamS], ["campo", faltamC]]) {
      if (itens.length) {
        l++;
        falha("l · gabarito", `${caminho} — ${rotulo} do modelos/${nome} que não está aqui: ${itens.join(" · ")}`);
      }
    }
    if (sobramC.length) {
      l++;
      falha("l · gabarito", `${caminho} — campo que modelos/${nome} não tem: ${sobramC.join(" · ")}`);
    }
  }
  if (!l) passa("l · gabarito", `${comGabarito} arquivos com os campos e as seções do gabarito`);

  /* (m) procedência que aponta para arquivo ausente.
     "Procedência que não abre não é conferível por ninguém — e parece
     apurada." Sete campos da fixture apontavam para dois brutos que não
     existiam, e quem os achou foi uma execução de modelo. */
  let m = 0;
  for (const [caminho, texto] of mapa) {
    if (caminho.startsWith("_bruto/")) continue;
    linhas(texto).forEach((linha, i) => {
      for (const achado of linha.matchAll(/←[^\n]*?((?:[A-Za-z0-9_./-]*[/])?_bruto[/][A-Za-z0-9_.-]+[.]md)/g)) {
        const alvo = achado[1].replace(/^.*_bruto[/]/, "_bruto/");
        if (!mapa.has(alvo)) {
          m++;
          falha("m · procedência", `${caminho}:${i + 1} — aponta para ${alvo}, que não existe na carteira`);
        }
      }
    });
  }
  if (!m) passa("m · procedência", "todo ← que nomeia um bruto abre");

  return r;
}

// ── as regras sobre a execução ─────────────────────────────────────────

function regrasDaExecucao({ antes, depois, resposta, roteiro, entrada }) {
  const r = [];
  const falha = (regra, msg) => r.push({ regra, ok: false, msg });
  const passa = (regra, msg) => r.push({ regra, ok: true, msg });
  const aviso = (regra, msg) => r.push({ regra, ok: null, msg });

  const criados = [...depois.keys()].filter((k) => !antes.has(k));
  const apagados = [...antes.keys()].filter((k) => !depois.has(k));
  const alterados = [...depois.keys()].filter(
    (k) => antes.has(k) && antes.get(k) !== depois.get(k),
  );
  const mexidos = [...criados, ...alterados];

  // (f) nada some, e bruto pré-existente não se toca
  let f = 0;
  for (const k of apagados) {
    f++;
    falha("f · nada some", `${k} — apagado da carteira`);
  }
  for (const k of alterados) {
    if (k.startsWith("_bruto/") && antes.has(k)) {
      f++;
      falha("f · nada some", `${k} — bruto pré-existente alterado`);
    }
  }
  if (!f) passa("f · nada some", `nada apagado; ${antes.size} arquivos de partida intactos ou editados no lugar`);

  // (h) o fecho do CONTRATO §10, e nada de moldura desenhada
  const iG = resposta.indexOf("## Guardei");
  const iF = resposta.indexOf("## Falta saber");
  if (iG === -1) falha("h · fecho", "a resposta não tem `## Guardei`");
  else if (iF !== -1 && iF < iG) falha("h · fecho", "`## Falta saber` veio antes de `## Guardei`");
  else passa("h · fecho", iF === -1 ? "`## Guardei` presente" : "`## Guardei` antes de `## Falta saber`");

  const moldura = ["┌", "└", "│"].filter((ch) => resposta.includes(ch));
  if (moldura.length) falha("h · moldura", `a resposta tem moldura de traços: ${moldura.join(" ")}`);
  else passa("h · moldura", "sem moldura de traços em volta do bloco");

  // (i) os globs do roteiro
  let i = 0;
  for (const k of mexidos) {
    if (!casa(k, roteiro.pode_mudar)) {
      i++;
      falha("i · licença", `${k} — tocado sem estar em pode_mudar`);
    }
  }
  /* `nao_muda` vale para o que JÁ EXISTIA — alterado ou apagado —, e não para
     arquivo novo. `_bruto/**` está nas duas listas dos roteiros de propósito:
     a skill CRIA o bruto da conversa que acabou de chegar (contrato §4.7, e é
     a primeira coisa que ela faz) e NÃO TOCA no que já estava lá. Contando o
     criado como "mudou", a régua acusava duas skills por obedecerem o
     contrato. */
  for (const k of [...alterados, ...apagados]) {
    if (casa(k, roteiro.nao_muda)) {
      i++;
      falha("i · licença", `${k} — está em nao_muda e mudou`);
    }
  }
  if (!i)
    passa(
      "i · licença",
      mexidos.length ? `tocou só o que podia: ${mexidos.join(" · ")}` : "não tocou em arquivo nenhum",
    );

  /* (j) o que a resposta precisa ter — LITERAL, e não expressão regular.
     Quem escreve roteiro escreve `C-019 (Rita Camargo)`, que é como o texto
     sai; lido como regex, os parênteses viram grupo e o padrão passa a exigir
     `C-019 Rita Camargo` SEM eles — exatamente o contrário do que o contrato
     §2 manda, e sem erro em lugar nenhum. Quem quiser regex a escreve entre
     barras, e aí é escolha declarada. */
  let j = 0;
  for (const p of roteiro.deve_conter) {
    const re = p.startsWith("/") && p.lastIndexOf("/") > 0;
    const bate = re
      ? new RegExp(p.slice(1, p.lastIndexOf("/")), "i").test(resposta)
      : resposta.toLowerCase().includes(p.toLowerCase());
    if (!bate) {
      j++;
      falha("j · deve conter", `a resposta não tem ${re ? p : `“${p}”`}`);
    }
  }
  if (!j) passa("j · deve conter", `${roteiro.deve_conter.length} padrões do roteiro`);

  // (k) AVISO: valor que não veio nem da carteira nem da entrada
  const normal = (v) => v.replace(/\s+/g, "").replace(/[.,]$/, "");
  const conhecidos = new Set();
  for (const t of [...antes.values(), entrada])
    for (const m of t.matchAll(RE_VALOR)) conhecidos.add(normal(m[0]));
  const inventados = [...new Set([...resposta.matchAll(RE_VALOR)].map((m) => normal(m[0])))].filter(
    (v) => !conhecidos.has(v),
  );
  if (inventados.length)
    aviso("k · valor", `na resposta e em lugar nenhum: ${inventados.join(" · ")}`);
  else passa("k · valor", "todo R$ da resposta existe na carteira ou na entrada");

  /* (l) O QUE VEIO DE TRANSCRIÇÃO NÃO VIRA CAMPO SOZINHO ─────────────────
     Áudio pelo conector chega transcrito, e o contrato §7 separa as duas
     coisas: o que foi dito é fato, mas número, valor, data e nome próprio
     saídos dali só viram campo depois de confirmados — transcrição troca
     justamente esses, e campo preenchido não levanta suspeita em ninguém.

     É a única regra do pack que se obedece escrevendo MENOS, e por isso
     nenhuma das outras a alcança: (i) mede licença para tocar o arquivo, (j)
     mede o que a resposta diz, (k) só avisa sobre R$ que não existe em lugar
     nenhum — e o valor daqui EXISTE, está no bruto. O que se mede aqui é o
     campo que tinha de continuar `?`. */
  let l = 0;
  for (const alvo of roteiro.nao_preenche) {
    const corte = alvo.lastIndexOf(":");
    const arq = alvo.slice(0, corte), campo = alvo.slice(corte + 1).trim();
    const texto = depois.get(arq);
    if (texto === undefined) {
      l++;
      falha("l · sem confirmar", `${arq} — o roteiro protege um campo dele e o arquivo não está na carteira`);
      continue;
    }
    const linha = linhas(texto).find((x) => x.toLowerCase().startsWith(campo.toLowerCase() + ":"));
    if (linha === undefined) {
      l++;
      falha("l · sem confirmar", `${arq} — não tem a linha \`${campo}:\``);
      continue;
    }
    const valor = linha.slice(campo.length + 1).trim();
    if (!valor.startsWith("?")) {
      l++;
      falha("l · sem confirmar",
        `${arq} — \`${campo}:\` virou “${valor}”, e a fonte é transcrição de áudio (contrato §7)`);
    }
  }
  if (!l)
    passa("l · sem confirmar", roteiro.nao_preenche.length
      ? `${roteiro.nao_preenche.length} campo(s) de áudio continuam \`?\``
      : "o roteiro não declara campo vindo de transcrição");

  return r;
}

// ── o roteiro ──────────────────────────────────────────────────────────

function lerRoteiro(texto) {
  const ls = linhas(texto);
  if (ls[0].trim() !== "---") throw new Error("roteiro sem frontmatter");
  const fim = ls.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (fim === -1) throw new Error("frontmatter não fecha");
  const corpo = ls.slice(1, fim);
  const dados = {};
  let chave = null;
  let modo = null;
  for (let i = 0; i < corpo.length; i++) {
    const l = corpo[i];
    const m = l.match(/^([a-z_]+):\s*(.*)$/);
    if (m && !/^\s/.test(l)) {
      chave = m[1];
      const v = m[2].trim();
      if (v === "|" || v === "|-") {
        modo = "bloco";
        dados[chave] = [];
      } else if (v === "[]") {
        modo = null;
        dados[chave] = [];
      } else if (v === "") {
        modo = "lista";
        dados[chave] = [];
      } else {
        modo = null;
        dados[chave] = v;
      }
      continue;
    }
    if (modo === "bloco") dados[chave].push(l.replace(/^ {2}/, ""));
    else if (modo === "lista") {
      const it = l.match(/^\s*-\s*(.*)$/);
      if (it) dados[chave].push(desaspar(it[1]));
    }
  }
  for (const k of ["pode_mudar", "nao_muda", "deve_conter", "nao_preenche"])
    if (!Array.isArray(dados[k])) dados[k] = dados[k] ? [dados[k]] : [];
  dados.entrada = Array.isArray(dados.entrada) ? dados.entrada.join("\n").trim() : String(dados.entrada ?? "").trim();
  return dados;
}

// YAML de aspas duplas trata a barra invertida como escape, e as simples não.
// Importa porque o `deve_conter` já foi lido como expressão regular: um
// `"V-071 \(casa…"` chegava aqui sem a barra e o parêntese virava grupo. Hoje
// o padrão é literal (ver a regra j), e o que sobra desta função é tirar as
// aspas do valor.
function desaspar(v) {
  const t = v.trim();
  if (t.startsWith('"') && t.endsWith('"'))
    return t.slice(1, -1).replace(/\\(.)/g, (_, c) => (c === "n" ? "\n" : c));
  if (t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
  return t;
}

// ── a chamada ──────────────────────────────────────────────────────────

/* ── O MODELO DA PROVA É ESCOLHIDO, E O PADRÃO É O BARATO ──────────────
   Sem `--model` o `claude -p` usa o padrão da máquina de quem roda — e em
   19/09 isso era o modelo mais caro da conta, em treze execuções seguidas que
   ninguém tinha pedido nesse preço. O padrão daqui é `opus`, por decisão do
   fundador; `-- --modelo sonnet` desce, e é também a prova mais DURA: skill
   que o modelo menor obedece, o maior obedece. Acima do opus a régua não vai. */
const MODELOS_DA_PROVA = ["haiku", "sonnet", "opus"];
const MODELO = (() => {
  const i = process.argv.indexOf("--modelo");
  const m = i > 0 ? process.argv[i + 1] : "opus";
  if (!MODELOS_DA_PROVA.includes(m)) {
    console.error(`--modelo ${m}: a prova roda em ${MODELOS_DA_PROVA.join(", ")} — ` +
      `é régua, e régua não precisa do modelo mais caro`);
    process.exit(1);
  }
  return m;
})();

function chamarClaude(skill, entrada, carteira) {
  const prompt = `/${PACK}:${skill}\n${entrada}\n`;
  const args = [
    "-p",
    "--model",
    MODELO,
    "--plugin-dir",
    PLUGIN,
    "--permission-mode",
    "acceptEdits",
    "--add-dir",
    carteira,
    "--max-turns",
    "40",
    "--output-format",
    "json",
  ];
  const win = process.platform === "win32";
  const r = spawnSync(win ? "claude" : "claude", win ? args.map((a) => (/[ &|<>^]/.test(a) ? `"${a}"` : a)) : args, {
    cwd: carteira,
    input: prompt,
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
    shell: win,
  });
  if (r.error) return { erro: `não deu para chamar o \`claude\`: ${r.error.message}` };
  if (r.status !== 0)
    return { erro: `o \`claude\` saiu com ${r.status}: ${String(r.stderr || r.stdout).trim().split("\n").slice(-2).join(" · ").slice(0, 300)}` };
  let resposta = r.stdout;
  try {
    const j = JSON.parse(r.stdout);
    resposta = typeof j.result === "string" ? j.result : JSON.stringify(j, null, 2);
  } catch {
    /* saída não veio em json — vale o texto cru */
  }
  return { resposta };
}

// ── o laudo ────────────────────────────────────────────────────────────

const marca = (ok) => (ok === null ? "!" : ok ? "✓" : "✗");

function imprimir(titulo, achados) {
  const linhasTxt = [`## ${titulo}`, ""];
  for (const a of achados) linhasTxt.push(`${marca(a.ok)} ${a.regra} — ${a.msg}`);
  linhasTxt.push("");
  return linhasTxt;
}

async function main() {
  const args = process.argv.slice(2);
  const iSeco = args.indexOf("--seco");
  const iRodar = args.indexOf("--rodar");
  const laudo = [`# Prova da Oficina — ${new Date().toISOString().slice(0, 19).replace("T", " ")}`, ""];
  const resumo = [];
  /* ── O LAUDO GRAVA A CADA SKILL, e não no fim ────────────────────────
     A bateria de `--rodar` levou três interrupções por falta de memória do
     sistema, e cada uma custou o que já estava pronto: QUATRO execuções de
     modelo concluídas — as respostas ficaram no disco, em
     `proc/prova-oficina/<skill>/resposta.md`, e o laudo delas morreu no
     array. Uma execução custa uns quatro minutos de modelo; gravar o laudo
     custa uma escrita de arquivo. */
  const gravar = async () => {
    await mkdir(PROC, { recursive: true });
    await writeFile(join(PROC, "laudo.md"), laudo.join("\n"));
  };
  let erros = 0;
  let avisos = 0;

  const contar = (achados) => {
    for (const a of achados) {
      if (a.ok === false) erros++;
      if (a.ok === null) avisos++;
    }
  };

  if (iRodar === -1) {
    // ── modo seco
    const alvoArg = iSeco !== -1 ? args[iSeco + 1] : undefined;
    const alvo = alvoArg && !alvoArg.startsWith("--") ? resolve(alvoArg) : FIXTURE;
    const mapa = await arvore(alvo);
    if (!mapa.size) {
      console.error(`não achei carteira em ${alvo}`);
      process.exit(1);
    }
    const achados = regrasDaCarteira(mapa);
    contar(achados);
    const titulo = `seco · ${alvo.replace(RAIZ, "").replace(/^[\\/]/, "") || alvo}`;
    laudo.push(...imprimir(titulo, achados));
    resumo.push([titulo, achados]);
  } else {
    // ── modo rodar
    const alvoArg = args[iRodar + 1];
    const todas = (await readdir(ROTEIROS)).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));

    /* ── A COBERTURA, e ela vinha de graça e errada ────────────────────
       A lista provada saía dos ROTEIROS, e não das SKILLS: skill sem roteiro
       nunca era executada e nada acusava — o laudo fechava com "10 ✓" sobre
       um plugin de catorze, que é a forma mais convincente de alarme cego.
       Apareceu quando as quatro skills do motor entraram e a prova continuou
       dizendo dez.

       A régua é a do `conferir`: a lista do plugin manda. Uma skill sem
       roteiro é ERRO, não ausência — e o erro sai antes da primeira execução,
       porque descobrir isso depois de vinte minutos de modelo é caro. */
    const noPlugin = (await readdir(join(PLUGIN, "skills"), { withFileTypes: true }))
      .filter((e) => e.isDirectory()).map((e) => e.name);
    const puladas = noPlugin.filter((s) => !todas.includes(s));
    if (SEGUNDA && puladas.length) {
      laudo.push(`pulada(s) na fixture ${FIXTURE_PASTA}, sem roteiro: ${puladas.join(" · ")}`, "");
    } else {
      for (const s of puladas) {
        laudo.push(...imprimir(s, [{ regra: "cobertura", ok: false,
          msg: `está em oficina/${PACK}/skills/ e não tem roteiro em _prova/${FIXTURE_PASTA}/roteiros/${s}.md` }]));
        erros++;
      }
    }
    for (const r of todas) {
      if (!noPlugin.includes(r)) {
        laudo.push(...imprimir(r, [{ regra: "cobertura", ok: false,
          msg: "tem roteiro e não existe mais no plugin — apague o roteiro" }]));
        erros++;
      }
    }

    const skills = alvoArg && !alvoArg.startsWith("--") ? [alvoArg] : todas;
    const antes = await arvore(FIXTURE);

    for (const skill of skills) {
      const arq = join(ROTEIROS, `${skill}.md`);
      if (!existsSync(arq)) {
        laudo.push(...imprimir(skill, [{ regra: "roteiro", ok: false, msg: `não há roteiro em ${arq}` }]));
        erros++;
        continue;
      }
      const roteiro = lerRoteiro(await readFile(arq, "utf8"));
      const base = join(PROC, skill);
      const carteira = join(base, PASTA_BASE);
      await rm(base, { recursive: true, force: true });
      await mkdir(base, { recursive: true });
      await cp(FIXTURE, carteira, { recursive: true });
      const indice = join(carteira, "INDICE.md");
      await writeFile(indice, (await readFile(indice, "utf8")).replaceAll("{CAMINHO}", carteira));

      const { resposta, erro } = chamarClaude(skill, roteiro.entrada, carteira);
      if (erro) {
        const achados = [{ regra: "chamada", ok: false, msg: erro }];
        contar(achados);
        laudo.push(...imprimir(`rodar · ${skill}`, achados));
        resumo.push([`rodar · ${skill}`, achados]);
        await gravar();
        continue;
      }
      await writeFile(join(base, "resposta.md"), resposta);

      // O caminho absoluto que entrou no lugar de {CAMINHO} volta a ser {CAMINHO}
      // antes de comparar: senão o INDICE.md conta como alterado em toda execução.
      const bruto = await arvore(carteira);
      const depois = new Map();
      for (const [k, v] of bruto)
        depois.set(k, v.replaceAll(carteira, "{CAMINHO}").replaceAll(carteira.replace(/\\/g, "/"), "{CAMINHO}"));

      const achados = [
        ...regrasDaCarteira(depois),
        ...regrasDaExecucao({ antes, depois, resposta, roteiro, entrada: roteiro.entrada }),
      ];
      contar(achados);
      laudo.push(...imprimir(`rodar · ${skill}`, achados));
      resumo.push([`rodar · ${skill}`, achados]);
      await gravar();
    }
  }

  await gravar();

  for (const [titulo, achados] of resumo) {
    const mal = achados.filter((a) => a.ok === false);
    const av = achados.filter((a) => a.ok === null);
    console.log(`\n${titulo} — ${achados.length - mal.length - av.length} ✓ · ${mal.length} ✗ · ${av.length} !`);
    for (const a of [...mal, ...av]) console.log(`  ${marca(a.ok)} ${a.regra} — ${a.msg}`);
  }
  console.log(`\nlaudo: ${join(PROC, "laudo.md").replace(RAIZ, "").replace(/^[\\/]/, "")}`);
  process.exit(erros ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
