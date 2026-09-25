/**
 * O CONTRATO da Oficina tem UMA fonte e N cópias, e este script é o que
 * mantém as duas coisas verdadeiras ao mesmo tempo.
 *
 * ── por que existe ─────────────────────────────────────────────────────
 * As dez skills do pack citavam o contrato por `${CLAUDE_PLUGIN_ROOT}`, que
 * é variável do Claude Code: em ChatGPT, Codex, Copilot ou Cursor ela não é
 * substituída e vira texto literal — a skill manda ler um arquivo num caminho
 * que não existe, e segue sem ele. O padrão aberto Agent Skills resolve isso
 * com a pasta `references/` DENTRO da skill, que é relativa a ela e funciona
 * em qualquer ferramenta.
 *
 * O preço é a cópia: dez `references/CONTRATO.md`, um por skill, porque as dez
 * citam o contrato. Os GABARITOS não seguem a mesma regra: cada um vai só para
 * a skill que o cita, e a diferença é grande — copiar os sete em todas dava
 * setenta arquivos, dos quais dez eram lidos, e `funil.md` existia onze vezes
 * para ser aberto em uma. Cópia à mão
 * diverge na primeira correção — dez contratos, dez comportamentos, e o
 * defeito aparece meses depois numa skill só. Por isso a cópia é GERADA, e
 * por isso o modo padrão deste script é CONFERIR e não escrever: rodar sem
 * argumento em qualquer momento diz se alguma cópia saiu do lugar.
 *
 *   node scripts/oficina.mjs              confere
 *   node scripts/oficina.mjs --escrever   regenera as cópias
 *
 * ── e quem confere quando ninguém pede ─────────────────────────────────
 * "Rodar em qualquer momento" era a parte frágil: este arquivo era um comando
 * à parte, fora do `conferir` e fora do `construir`, e cópia divergida não
 * acusava em lugar nenhum — o modo de falha que o CONTRATO.md:15-21 declara
 * resolvido. O `conferir.mjs` agora IMPORTA `conferirOficina()`. Por isso o
 * corpo mora numa função exportada e a CLI só roda quando este arquivo é o
 * EXECUTADO: se ela rodasse no import, a conferência do site ganharia uma
 * segunda voz e um `process.exit` alheio no meio da lista.
 */
import { readFile, writeFile as gravarCru, readdir, mkdir, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fatiar, achatar } from "./prompt-do-pack.mjs";
import { por, maiuscula } from "./texto.mjs";
import { BLOCOS_DO_INICIO } from "../painel/nucleo/molde.mjs";
import { TEXTOS_PADRAO } from "../painel/app/textos.js";
import { vistasDoPack } from "./vistas-do-pack.mjs";

/* ── ESCREVER É .tmp + rename, E NÃO writeFile ─────────────────────────
   `UNKNOWN: open` no Windows quando outro processo segura o arquivo — o
   AGENTS.md já registra isso para o `post.json` com a bancada aberta, e a
   geração do pack tem o mesmo problema com escala pior: são 246 arquivos, e
   uma falha no meio deixa metade das cópias novas e metade velhas, sem nada
   dizer qual metade. Medido nesta sessão, no
   `escrever-abordagem/references/CONTRATO.md`: falhou numa passada e passou
   na seguinte, com o mesmo comando. O rename é atômico e não disputa o
   descritor. */
const writeFile = async (p, texto, codificacao) => {
  await gravarCru(p + ".tmp", texto, codificacao);
  await rename(p + ".tmp", p);
};

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const OFICINA = RAIZ;
/* as seções do contrato que valem para QUALQUER profissão. Diretório com `_`
   na frente porque ele NÃO é um pack: `packs()` lê o marketplace.json, e
   `_motor` não está lá — se estivesse, o script iria procurar
   `oficina/_motor/CONTRATO.md` e falhar. */
const MOTOR = join(OFICINA, "_motor");
/* a fonte do PROMPT.md de cada pack, com os blocos condicionais que a página
   da Kapstan liga e desliga (D267: desceu do site para cá). */
const PROMPTS = join(RAIZ, "prompts");
/* os blocos ligados no PROMPT.md público; `tarefas` são todas as do pack. */
const PROMPT_PADRAO = ["sem-identidade", "tarefas", "modo-ambos", "sem-carteira", "carteira"];
const PAINEL = join(RAIZ, "painel");

/**
 * O QUE O PAINEL LEVA PARA DENTRO DE UM PACK, e por que ele leva.
 *
 * `${CLAUDE_PLUGIN_ROOT}` aponta para o cache de UM plugin, e o
 * `/plugin install` copia SÓ o subdiretório dele: diretórios irmãos do
 * repositório NÃO existem na máquina de quem instala. Um `oficina/_painel/`
 * compartilhado seria invisível para o plugin instalado — e o sintoma seria
 * a ferramenta existir no `tools/list` e falhar ao abrir o arquivo.
 *
 * Isso não é exceção: é a mesma razão de `_motor/` ser FONTE e as skills
 * dele viajarem resolvidas dentro de cada pack. O painel entra pela mesma
 * porta e ganha a mesma régua — cópia divergindo da fonte é erro.
 *
 * ── O SERVIDOR VAI COMO ESTÁ, NÃO EMPACOTADO ──────────────────────────
 * Os quatro `.mjs` são ESM puro, sem uma dependência. Empacotá-los daria um
 * arquivo ilegível no repositório público, e o que se perderia é o que este
 * repositório protege: o registro mora no código. Quem abrir o plugin
 * instalado lê por que cada guarda de segurança existe.
 *
 * O `painel.html` é o único derivado, e ele é UM arquivo com tudo dentro —
 * quem instala não roda build e pode não ter rede.
 */
const DO_PAINEL = [
  "painel.html",
  "servidor.mjs",
  "nucleo/protocolo.mjs",
  "nucleo/http.mjs",
  "nucleo/sessao.mjs",
  /* lê a base para a página inicial (D230). Faltou aqui no dia em que nasceu, e
     a régua não acusava: ela só itera esta lista — o pack instalado subiria com
     um import quebrado. o laço logo antes da cópia é o que cobra agora. */
  "nucleo/base.mjs",
  /* a fila de decisões (D232) */
  "nucleo/fila.mjs",
  /* um painel só por máquina, e o botão que chama o assistente (D232) */
  "nucleo/hospede.mjs",
  "nucleo/lancar.mjs",
  /* o processo que o Claude segura de verdade — ver MCP_DO_PACK */
  "nucleo/vigia.mjs",
  /* o painel solto, que não morre com a conversa (D243) */
  "sempre.mjs",
  /* o molde do pack e o ajuste da base (D244) */
  "nucleo/molde.mjs",
];

/* ── E A DECLARAÇÃO DO SERVIDOR, que é o que liga tudo ─────────────────
   `.mcp.json` na raiz do plugin é a forma documentada de um plugin do
   Claude Code declarar um servidor MCP. O nome é `painel` nos dois packs
   de propósito: quem instalar os dois vê UM `painel_mostrar`, e não dois
   com nomes diferentes para a mesma coisa.

   `node` sem caminho: é o que está no PATH de quem instalou o Node. Um
   caminho absoluto aqui seria o da MINHA máquina. */
const MCP_DO_PACK = JSON.stringify({
  mcpServers: {
    /* os dois sobem ATRÁS do vigia (`painel/nucleo/vigia.mjs`): é ele que o
       Claude segura, e é ele que troca o servidor quando o código muda — sem
       ninguém fechar a sessão */
    painel: {
      command: "node",
      args: ["${CLAUDE_PLUGIN_ROOT}/painel/nucleo/vigia.mjs", "${CLAUDE_PLUGIN_ROOT}/painel/servidor.mjs"],
    },
    conectores: {
      command: "node",
      args: ["${CLAUDE_PLUGIN_ROOT}/painel/nucleo/vigia.mjs", "${CLAUDE_PLUGIN_ROOT}/conectores/servidor.mjs"],
    },
    /* o terceiro (D270): o markdown da base em PDF, pelo modelo do pack */
    documentos: {
      command: "node",
      args: ["${CLAUDE_PLUGIN_ROOT}/painel/nucleo/vigia.mjs", "${CLAUDE_PLUGIN_ROOT}/documentos/servidor.mjs"],
    },
  },
}, null, 2) + "\n";

/* ── OS DOCUMENTOS (D270) ─────────────────────────────────────────────
   O motor vai inteiro para `<pack>/documentos/`, ao lado de `painel/` (o
   servidor importa `../painel/nucleo/protocolo.mjs`). Os MODELOS não são
   cópia: `<pack>/documentos/modelos/` é fonte do pack, escrita à mão, e o
   montador só confere que cada um tem um `modelo.json` que se lê. As fontes
   são binárias, e a comparação é por bytes. */
const DOCUMENTOS = join(RAIZ, "documentos");
const DO_DOCUMENTOS = ["servidor.mjs", "pagina.css", "nucleo/markdown.mjs", "nucleo/imprimir.mjs",
  "nucleo/documento.mjs", "fontes/plex-sans-400.woff2", "fontes/plex-sans-600.woff2", "fontes/OFL.txt", "fontes/LEIA.md"];

/* ── OS CONECTORES, QUE ENTRAM PELA MESMA PORTA DO PAINEL ─────────────
   O servidor importa `../painel/nucleo/protocolo.mjs`, e o caminho relativo
   vale nos dois lugares porque `<pack>/conectores/` nasce ao lado de
   `<pack>/painel/`. Os dois viajam juntos ou nenhum viaja.

   O que NÃO é cópia é o `catalogo.json`: ele é a FUSÃO da base
   (`conectores/catalogo.json`, de qualquer ofício) com o que o pack declara
   em `<pack>/conectores.json` — as fontes do ofício dele. O servidor
   instalado lê um arquivo só e não recebe argumento. Nome repetido entre as
   camadas é erro aqui também: o pack que redefinisse um conector herdaria a
   chave e o teto que a pessoa escreveu para o outro.

   Adaptador só viaja se o catálogo fundido o cita — um pack que não busca
   vaga não carrega o leitor de vaga. */
const CONECTORES = join(RAIZ, "conectores");
async function conectoresDoPack(pack) {
  if (!existsSync(join(CONECTORES, "servidor.mjs"))) return null;
  const base = JSON.parse(await readFile(join(CONECTORES, "catalogo.json"), "utf8"));
  const doPack = join(OFICINA, pack, "conectores.json");
  const extra = existsSync(doPack) ? JSON.parse(await readFile(doPack, "utf8")) : {};
  const fundido = { ...base };
  for (const [nome, entrada] of Object.entries(extra)) {
    if (nome.startsWith("_")) continue;
    /* a mesma regra do `carregarCatalogo`: nome que já existe só aceita
       `operacoes+` — a operação PRONTA que o ofício pede daquele serviço — e
       `sessoes+`, os sites em que o navegador entra com a conta (D272) */
    if (nome in base) {
      const ACRESCIMOS = { "operacoes+": "operacoes", "sessoes+": "sessoes" };
      const chaves = Object.keys(entrada).filter((k) => !k.startsWith("_"));
      if (!chaves.length || chaves.some((k) => !ACRESCIMOS[k])) {
        throw new Error(`${pack}/conectores.json: “${nome}” já existe no catálogo base — ` +
          "o pack só pode acrescentar `operacoes+` ou `sessoes+`");
      }
      for (const k of chaves) {
        const campo = ACRESCIMOS[k];
        for (const [chave, def] of Object.entries(entrada[k])) {
          if (chave in (base[nome][campo] || {})) {
            throw new Error(`${pack}/conectores.json: ${nome} já tem ${chave} em ${campo}`);
          }
          fundido[nome] = { ...fundido[nome], [campo]: { ...fundido[nome][campo], [chave]: def } };
        }
      }
      continue;
    }
    fundido[nome] = entrada;
  }
  const adaptadores = new Set(Object.values(fundido)
    .map((c) => c && c.adaptador).filter(Boolean));
  const nucleo = (await readdir(join(CONECTORES, "nucleo"))).filter((n) => n.endsWith(".mjs"));
  const arquivos = [
    ["servidor.mjs", await readFile(join(CONECTORES, "servidor.mjs"), "utf8")],
    ...(await Promise.all(nucleo.map(async (n) =>
      ["nucleo/" + n, await readFile(join(CONECTORES, "nucleo", n), "utf8")]))),
    ...(await Promise.all([...adaptadores].sort().map(async (rel) => {
      const p = join(CONECTORES, ...rel.split("/"));
      if (!existsSync(p)) throw new Error(`${pack}: o catálogo cita ${rel}, que não existe em conectores/`);
      return [rel, await readFile(p, "utf8")];
    }))),
    ["catalogo.json", JSON.stringify(fundido, null, 2) + "\n"],
  ];
  return arquivos;
}

/* o aviso que vai no topo de cada cópia. Ele existe para o caso que este
   script não cobre: alguém abre `references/CONTRATO.md` para consertar uma
   frase, conserta, e a correção morre no próximo `--escrever`. */
const AVISO = (pack) => `<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte são as seções em oficina/_motor/ e oficina/${pack}/contrato/, que
     este script funde em oficina/${pack}/CONTRATO.md — e daí sai esta cópia,
     por \`npm run oficina -- --escrever\`. Correção feita aqui é perdida na
     próxima geração, e correção feita no CONTRATO.md também: ele é montado.

     A cópia existe porque o padrão Agent Skills quer a referência DENTRO da
     skill, em references/ — é o que faz o pack funcionar fora do Claude
     Code, onde \${CLAUDE_PLUGIN_ROOT} não é substituído. -->

`;

const AVISO_REFERENCIA = (nome) => `<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/referencias/${nome}, e ela vale para qualquer
     profissão: as marcas do ofício são resolvidas na geração, pelo
     vocabulario.json do pack. Correção feita aqui é perdida no próximo
     \`npm run oficina -- --escrever\`. -->

`;

const AVISO_SECAO = "<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->\n\n";

/* O vocabulário da transcrição é `.txt` e o aviso dele tem que ser comentário
   DAQUELE formato: a ponte lê o arquivo linha a linha e tudo o que não começa
   com `#` vira termo. Um `<!--` ali dentro entraria na dica que vai junto com
   o áudio. */
const AVISO_VOCABULARIO = (pack) =>
  `# CÓPIA GERADA · não edite este arquivo.\n` +
  `# A fonte é oficina/${pack}/vocabulario.txt, e \`npm run oficina -- --escrever\`\n` +
  `# refaz a cópia. Correção feita aqui se perde na próxima passada.\n\n`;

const avisoDe = (nome, pack) =>
  nome.endsWith(".txt") ? AVISO_VOCABULARIO(pack) : AVISO_REFERENCIA(nome);

/* a seção do fecho — a única que TODA skill precisa citar. Ver o comentário
   em `conferirOficina`, onde a cobrança mora. */
const FECHO = "10-0-comeca-e-termina.md";

/* ── E O AVISO DA SKILL GERADA, que não pode ser o primeiro byte ────────
   Os outros avisos abrem o arquivo. Este NÃO PODE: um `SKILL.md` começa com
   o frontmatter YAML, e todo leitor do padrão Agent Skills exige o `---` na
   primeira linha. Comentário antes dele faz o frontmatter não ser lido — a
   skill perde nome, description e allowed-tools de uma vez, e nada acusa: ela
   simplesmente deixa de ser encontrada. Por isso ele entra DEPOIS do fecho do
   frontmatter, e por isso `comAviso()` existe em vez de uma concatenação. */
const AVISO_SKILL = (nome) => `<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/${nome}/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     \`npm run oficina -- --escrever\`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->

`;

/** O aviso entra depois do frontmatter — ver AVISO_SKILL. */
const comAviso = (corpo, aviso) => {
  const m = corpo.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  return m ? m[0] + aviso + corpo.slice(m[0].length) : aviso + corpo;
};

/**
 * As referências que moram no motor — hoje `conectar-whatsapp.md`, 196 linhas
 * que valem para qualquer ofício — resolvidas com o vocabulário do pack. Elas
 * eram um arquivo escrito à mão dentro da `comecar`, que nenhum script
 * gerava: um segundo pack que ligasse o conector copiaria as 196 linhas e
 * elas divergiriam na primeira correção. Vão para a skill que as CITA por
 * `references/<nome>`, pela mesma leitura de texto dos gabaritos.
 */
async function referenciasDoMotor(pack) {
  const dir = join(MOTOR, "referencias");
  if (!existsSync(dir)) return [];
  const vocab = await vocabularioDe(pack);
  return Promise.all((await readdir(dir)).filter((n) => n.endsWith(".md"))
    .map(async (n) => [n, resolverMarcas(await readFile(join(dir, n), "utf8"), vocab)]));
}

/**
 * O VOCABULÁRIO DA TRANSCRIÇÃO, que é do ofício e não do motor.
 *
 * A ponte transcreve os áudios com um vocabulário em camadas, e a de ofício é
 * um arquivo que o plugin instala (`whatsapp-reader vocabulario instalar`).
 * O conteúdo não pode morar no motor — CRECI e ITBI são do corretor —, mas o
 * caminho é o mesmo das referências: quem o CITA por `references/` leva a
 * cópia, e a fonte é uma só.
 *
 * Pack sem o arquivo simplesmente não tem vocabulário: a transcrição funciona
 * com o base embutido, e o degrau da instalação diz isso.
 */
async function vocabularioDeAudio(pack) {
  const p = join(OFICINA, pack, "vocabulario.txt");
  return existsSync(p) ? [["vocabulario.txt", await readFile(p, "utf8")]] : [];
}

/**
 * O QUE DÁ PARA PEDIR (D231) — `<pack>/painel/acoes.json`, derivado.
 *
 * Cada linha `| \`/pack:skill\` | o que faz |` do README vira uma ação. As
 * tabelas ficam na ordem do arquivo, e a PRIMEIRA é a principal: é a do
 * ofício em todo pack, e é a que o início mostra aberta. O rótulo do grupo é
 * a linha de prosa logo acima da tabela, sem os dois-pontos.
 *
 * ── SOBRE O QUE CADA UMA AGE vem de `<pack>/painel.json` ───────────────
 * `nada` roda sozinha, `item` age sobre um item, `pessoa` sobre uma pessoa.
 * É o que decide ONDE o painel oferece o botão — e a ausência é o padrão
 * seguro: skill que não está lá é conversa, e o painel só mostra o comando.
 * A primeira versão oferecia o grupo inteiro na página de uma vaga, com
 * "Buscar vagas" ao lado de "Candidatar". As pastas saem do vocabulário: é por
 * elas que a página sabe se o arquivo aberto é item ou pessoa.
 */
const ALVOS = new Set(["nada", "item", "pessoa"]);
/* ── A SKILL QUE SÓ GRAVA A FILA (D234) ───────────────────────────────
   Ela não entra em "O que você pode pedir": o lugar dela é a barra da fila, e
   o painel a acha por `fila`. Um botão dela no meio dos pedidos do ofício
   seria o mesmo gesto em dois lugares. */
const SKILL_DA_FILA = "gravar-o-que-marquei";

/* `raiz` é a pasta dos packs: a prova do montador a troca por uma temporária */
export async function acoesDoPack(pack, raiz = OFICINA) {
  const doPainel = join(raiz, pack, "painel.json");
  const declarado = existsSync(doPainel) ? JSON.parse(await readFile(doPainel, "utf8")) : {};
  const sobre = declarado.sobre || {};
  /* `comeco`: os passos de quem acabou de instalar, na ordem do ofício. O
     painel os mostra enquanto a base não tem item nenhum (D234) */
  const comeco = Array.isArray(declarado.comeco) ? declarado.comeco : [];
  for (const skill of comeco) {
    if (!existsSync(join(raiz, pack, "skills", skill))) {
      throw new Error(`${pack}/painel.json: comeco · “${skill}” não é uma skill deste pack`);
    }
  }
  /* `proximo` (D235): por etapa do funil, o que vem depois, na ordem. As
     etapas são os `## ` do exemplo em `04-3-funil.md` do pack — é o mesmo
     texto que o contrato entrega às skills, e não uma segunda lista */
  const proximo = declarado.proximo && typeof declarado.proximo === "object" ? declarado.proximo : {};
  /* `destaque` (D240): os campos que respondem "cabe para mim?" — rótulos como
     estão no arquivo do item. O painel só os mostra grandes; não sabe o que são */
  const destaque = Array.isArray(declarado.destaque) ? declarado.destaque.map(String) : [];
  if (destaque.some((d) => !d.trim() || d.length > 40)) throw new Error(`${pack}/painel.json: destaque · rótulo vazio ou longo demais`);
  const doFunil = join(raiz, pack, "contrato", "04-3-funil.md");
  const etapas = existsSync(doFunil)
    ? [...(await readFile(doFunil, "utf8")).matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()) : [];
  /* D242: `resumo` (seções que o baralho mostra), `motivos` (descartes de um
     clique) e `rotulos` (o texto do botão, por etapa de destino ou por skill) */
  const listaCurta = (campo, teto, largura) => {
    const v = declarado[campo];
    if (v === undefined) return [];
    if (!Array.isArray(v) || v.length > teto || v.some((x) => typeof x !== "string" || !x.trim() || x.length > largura)) {
      throw new Error(`${pack}/painel.json: ${campo} · lista de até ${teto} textos, cada um com até ${largura} caracteres`);
    }
    return v.map((x) => x.trim());
  };
  const resumo = listaCurta("resumo", 4, 60);
  /* `completar` (D245): a skill que procura o que falta num item — o painel a
     oferece ao lado dos campos em destaque sem resposta */
  /* `ordens` (D274): as escalas que não são alfabéticas — campo → valores do
     primeiro ao último. É o que deixa a tabela pôr "alto" antes de "baixo" */
  const ordens = declarado.ordens && typeof declarado.ordens === "object" ? declarado.ordens : {};
  for (const [campo, valores] of Object.entries(ordens)) {
    if (!destaque.includes(campo)) throw new Error(`${pack}/painel.json: ordens · “${campo}” não está no destaque`);
    if (!Array.isArray(valores) || !valores.length || valores.length > 8
      || valores.some((v) => typeof v !== "string" || !v.trim() || v.length > 30)) {
      throw new Error(`${pack}/painel.json: ordens · “${campo}” é uma lista de até oito valores curtos`);
    }
  }
  /* `fases` (D266): degraus DENTRO de uma etapa, lidos da ficha pelas mesmas
     condições do fluxo — `{ etapa: [{ nome, se }] }`. O nome não pode ser o
     de uma etapa: é a chave do filtro na mesma URL */
  const fases = declarado.fases && typeof declarado.fases === "object" ? declarado.fases : {};
  const CONDICOES = /^(faltam|sem|com|sem-documento|com-documento|nunca|ja|agora)(:.+)?$/;
  const nomesDeFase = new Set();
  for (const [etapa, lista] of Object.entries(fases)) {
    if (etapas.length && !etapas.includes(etapa)) throw new Error(`${pack}/painel.json: fases · “${etapa}” não é uma etapa do funil`);
    if (!Array.isArray(lista) || !lista.length || lista.length > 4) throw new Error(`${pack}/painel.json: fases · “${etapa}” é uma lista de uma a quatro fases`);
    for (const f of lista) {
      const nome = String(f?.nome || "").trim();
      if (!nome || nome.length > 30 || etapas.includes(nome) || nomesDeFase.has(nome)) {
        throw new Error(`${pack}/painel.json: fases · “${nome}” precisa de nome curto, que não seja o de uma etapa nem se repita`);
      }
      nomesDeFase.add(nome);
      if (!Array.isArray(f.se) || !f.se.length || f.se.some((c) => !CONDICOES.test(String(c)))) {
        throw new Error(`${pack}/painel.json: fases · “${nome}” precisa de \`se\` com as condições do fluxo`);
      }
    }
  }
  /* `documentos` (D270): pasta da base → modelo de documento do pack */
  const documentos = declarado.documentos && typeof declarado.documentos === "object" ? declarado.documentos : {};
  for (const [pasta, modelo] of Object.entries(documentos)) {
    if (!existsSync(join(raiz, pack, "documentos", "modelos", String(modelo), "modelo.json"))) {
      throw new Error(`${pack}/painel.json: documentos · “${pasta}” aponta o modelo “${modelo}”, que não existe em ${pack}/documentos/modelos/`);
    }
  }
  const completar = declarado.completar ? String(declarado.completar) : "";
  if (completar && !String(sobre[completar] || "").split(/\s+/).includes("item")) {
    throw new Error(`${pack}/painel.json: completar · “${completar}” precisa de \`sobre\` com item`);
  }
  /* `inicio` (D244): a ordem dos blocos da página inicial — o molde; a base
     pode reordenar pelo painel.json dela */
  const inicio = listaCurta("inicio", BLOCOS_DO_INICIO.length, 20);
  const bloco = inicio.find((b) => !BLOCOS_DO_INICIO.includes(b));
  if (bloco) throw new Error(`${pack}/painel.json: inicio · “${bloco}” não é um bloco do início (os que existem: ${BLOCOS_DO_INICIO.join(", ")})`);
  const motivos = listaCurta("motivos", 8, 60);
  /* `fim`: o fim BOM — na etapa `de`, um botão próprio (`rotulo`) que tira o
     item do funil como o descarte, com o `motivo` fixo, e não é descarte */
  let fim = null;
  if (declarado.fim !== undefined) {
    const f = declarado.fim;
    const erro = (texto) => new Error(`${pack}/painel.json: fim · ${texto}`);
    if (!f || typeof f !== "object" || Array.isArray(f)) throw erro("um objeto { de, rotulo, motivo }");
    const sobra = Object.keys(f).filter((k) => !["de", "rotulo", "motivo"].includes(k));
    if (sobra.length) throw erro(`“${sobra.join(", ")}” não é campo do fim (os que existem: de, rotulo, motivo)`);
    const de = typeof f.de === "string" ? f.de.trim() : "";
    if (!etapas.includes(de)) throw erro(`“${f.de ?? ""}” não é uma etapa do funil deste pack (as que existem: ${etapas.join(", ")})`);
    const rotulo = typeof f.rotulo === "string" ? f.rotulo.trim() : "";
    if (!rotulo || rotulo.length > 40) throw erro("rotulo é o texto do botão, com até 40 caracteres");
    const motivo = typeof f.motivo === "string" ? f.motivo : "";
    if (!/^\S{1,40}$/u.test(motivo)) throw erro(`motivo é uma palavra só, sem espaço, com até 40 caracteres — veio “${f.motivo ?? ""}”`);
    fim = { de, rotulo, motivo };
  }
  /* `esforco` (D263): o `--effort` do `claude` por skill. A skill tem de
     existir no pack, e o valor, ser um dos que o `claude` aceita */
  const esforco = {};
  for (const [skill, valor] of Object.entries(declarado.esforco && typeof declarado.esforco === "object" ? declarado.esforco : {})) {
    if (!["low", "medium", "high", "xhigh", "max"].includes(valor)) {
      throw new Error(`${pack}/painel.json: esforco · “${skill}” pede “${valor}” — os que existem: low, medium, high, xhigh, max`);
    }
    if (!existsSync(join(raiz, pack, "skills", skill, "SKILL.md"))) {
      throw new Error(`${pack}/painel.json: esforco · “${skill}” não é uma skill deste pack`);
    }
    esforco[`/${pack}:${skill}`] = valor;
  }
  /* `rodadas` (D280): o `--max-turns` por skill, para a que precisa de mais
     que o padrão de 80. Inteiro de 10 a 300, e a skill tem de existir */
  const rodadas = {};
  for (const [skill, valor] of Object.entries(declarado.rodadas && typeof declarado.rodadas === "object" ? declarado.rodadas : {})) {
    if (!Number.isInteger(valor) || valor < 10 || valor > 300) {
      throw new Error(`${pack}/painel.json: rodadas · “${skill}” pede “${valor}” — é um número inteiro de 10 a 300`);
    }
    if (!existsSync(join(raiz, pack, "skills", skill, "SKILL.md"))) {
      throw new Error(`${pack}/painel.json: rodadas · “${skill}” não é uma skill deste pack`);
    }
    rodadas[`/${pack}:${skill}`] = valor;
  }
  const rotulos = declarado.rotulos && typeof declarado.rotulos === "object" ? declarado.rotulos : {};
  for (const [chave, texto] of Object.entries(rotulos)) {
    if (!etapas.includes(chave) && !existsSync(join(raiz, pack, "skills", chave))) {
      throw new Error(`${pack}/painel.json: rotulos · “${chave}” não é etapa do funil nem skill deste pack`);
    }
    if (typeof texto !== "string" || !texto.trim() || texto.length > 32) {
      throw new Error(`${pack}/painel.json: rotulos · “${chave}” pede um texto de botão, com até 32 caracteres`);
    }
  }
  for (const [etapa, lista] of Object.entries(proximo)) {
    if (!etapas.includes(etapa)) {
      throw new Error(`${pack}/painel.json: proximo · “${etapa}” não é uma etapa do funil deste pack ` +
        `(as que existem: ${etapas.join(", ")})`);
    }
    if (!Array.isArray(lista) || !lista.length) throw new Error(`${pack}/painel.json: proximo · “${etapa}” pede uma lista`);
    for (const bruta of lista) {
      /* entrada com condição (D257): `{ faz, se, porque }` — o vocabulário
         de `se` é do motor (`condicaoVale`, no painel) */
      const e = typeof bruta === "string" ? bruta : bruta?.faz;
      if (typeof bruta === "object") {
        const se = Array.isArray(bruta.se) ? bruta.se : [];
        const torta = se.filter((c) => !/^(faltam|(sem|com|sem-documento|com-documento|nunca|ja|agora):[^:]+)$/.test(String(c)));
        /* sem `se`, a entrada só dá o porquê: vale sempre */
        if ((bruta.se !== undefined && !se.length) || torta.length) {
          throw new Error(`${pack}/painel.json: proximo · “${e}” — “se” pede condições como faltam, sem:<campo>, ` +
            `sem-documento:<pasta>, nunca:<palavra>${torta.length ? ` (torta: ${torta.join(", ")})` : ""}`);
        }
        if (bruta.porque && (typeof bruta.porque !== "string" || bruta.porque.length > 90)) {
          throw new Error(`${pack}/painel.json: proximo · “${e}” — “porque” é uma frase de até 90 caracteres`);
        }
      }
      if (e === "marcar" || e === "descartar") continue;
      if (!existsSync(join(raiz, pack, "skills", e))) {
        throw new Error(`${pack}/painel.json: proximo · “${e}” não é uma skill deste pack, nem marcar/descartar`);
      }
      if (!sobre[e]) throw new Error(`${pack}/painel.json: proximo · “${e}” não declara \`sobre\` — conversa não vira botão`);
    }
  }
  for (const [skill, alvos] of Object.entries(sobre)) {
    if (!existsSync(join(raiz, pack, "skills", skill))) {
      throw new Error(`${pack}/painel.json: “${skill}” não é uma skill deste pack`);
    }
    const torto = String(alvos).split(/\s+/).filter((a) => !ALVOS.has(a));
    if (torto.length) throw new Error(`${pack}/painel.json: ${skill} · “${torto.join(" ")}” — os que existem: nada, item, pessoa`);
  }
  /* `textos` (D267): o que o pack troca na tabela de `painel/app/textos.js` */
  const textos = declarado.textos && typeof declarado.textos === "object" ? declarado.textos : {};
  for (const [chave, texto] of Object.entries(textos)) {
    if (!(chave in TEXTOS_PADRAO)) {
      throw new Error(`${pack}/painel.json: textos · “${chave}” não é um texto do painel (os que existem: ${Object.keys(TEXTOS_PADRAO).join(", ")})`);
    }
    if (typeof texto !== "string" || !texto.trim() || texto.length > 40) {
      throw new Error(`${pack}/painel.json: textos · “${chave}” pede um texto curto, com até 40 caracteres`);
    }
  }
  /* `vistas` (D267): a frase que o agente lê sobre cada vista de
     `<pack>/painel/componentes/` — uma por componente, e nenhuma sem ele */
  const vistas = declarado.vistas && typeof declarado.vistas === "object" ? declarado.vistas : {};
  {
    const { vistas: dosComponentes, erros } = vistasDoPack(join(raiz, pack));
    if (erros.length) throw new Error(`${pack}/painel/componentes: ${erros.join(" · ")}`);
    const nomes = dosComponentes.map((v) => v.nome);
    for (const nome of nomes) {
      if (typeof vistas[nome] !== "string" || vistas[nome].trim().length < 20) {
        throw new Error(`${pack}/painel.json: vistas · “${nome}” tem componente e não tem a frase que o agente lê — o que ela mostra, quando usar e o formato de \`dados\``);
      }
    }
    const orfas = Object.keys(vistas).filter((n) => !nomes.includes(n));
    if (orfas.length) throw new Error(`${pack}/painel.json: vistas · ${orfas.join(", ")} sem ${pack}/painel/componentes/<Nome>.svelte`);
  }
  const vocab = await vocabularioDe(pack).catch(() => ({}));
  const readme = join(raiz, pack, "README.md");
  const linhas = existsSync(readme) ? (await readFile(readme, "utf8")).split(/\r?\n/) : [];
  const grupos = [];
  const vistos = new Set();
  let prosa = "", dentro = null;
  for (const linha of linhas) {
    const m = linha.match(/^\|\s*`(\/[\w-]+:([\w-]+))`\s*\|\s*(.+?)\s*\|\s*$/);
    if (!m) {
      if (!linha.startsWith("|")) { dentro = null; if (linha.trim()) prosa = linha.trim(); }
      continue;
    }
    if (!dentro) {
      dentro = { rotulo: /^#|^\*\*|^>/.test(prosa) ? "" : prosa.replace(/[:：]\s*$/, ""), acoes: [] };
      grupos.push(dentro);
    }
    /* o mesmo comando em duas tabelas (o corretor repete os dele na tabela
       "sem carteira") entra uma vez só, onde apareceu primeiro */
    if (vistos.has(m[1])) continue;
    vistos.add(m[1]);
    if (m[2] === SKILL_DA_FILA) continue;
    const skill = join(raiz, pack, "skills", m[2], "SKILL.md");
    const titulo = existsSync(skill)
      ? ((await readFile(skill, "utf8")).match(/^# (.+)$/m) || [])[1] : "";
    const oque = m[3].replace(/`/g, "");
    dentro.acoes.push({
      sobre: String(sobre[m[2]] || "").split(/\s+/).filter(Boolean),
      comando: m[1],
      nome: (titulo || m[2].replace(/-/g, " ")).trim(),
      oque: oque[0].toUpperCase() + oque.slice(1),
    });
  }
  const todas = grupos.flatMap((g) => g.acoes);
  const faltam = comeco.filter((s) => !todas.some((a) => a.comando.endsWith(":" + s)));
  if (faltam.length) {
    throw new Error(`${pack}/painel.json: comeco · ${faltam.join(", ")} não está nas tabelas do README`);
  }
  const comandoDe = (s) => s === "marcar" || s === "descartar" ? s
    : todas.find((a) => a.comando.endsWith(":" + s))?.comando;
  const proximoResolvido = {};
  for (const [etapa, lista] of Object.entries(proximo)) {
    const faz = (s) => (typeof s === "string" ? s : s.faz);
    const semTabela = lista.filter((s) => !comandoDe(faz(s))).map(faz);
    if (semTabela.length) {
      throw new Error(`${pack}/painel.json: proximo · ${semTabela.join(", ")} não está nas tabelas do README`);
    }
    proximoResolvido[etapa] = lista.map((s) => (typeof s === "string" ? comandoDe(s)
      : { faz: comandoDe(s.faz), se: s.se, ...(s.porque ? { porque: s.porque } : {}) }));
  }
  return JSON.stringify({
    pack,
    pastas: { item: vocab["pasta-itens"] || "", pessoa: vocab["pasta-pessoas"] || "" },
    /* o nome de UM item, para o título da coluna da tabela (D274) */
    item: vocab.Item || "",
    /* a palavra da base ("busca", "carteira"): é o rótulo do grupo do menu (D236) */
    base: vocab.base || "",
    fila: existsSync(join(raiz, pack, "skills", SKILL_DA_FILA)) ? `/${pack}:${SKILL_DA_FILA}` : "",
    comeco: comeco.map((s) => todas.find((a) => a.comando.endsWith(":" + s)).comando),
    proximo: proximoResolvido,
    destaque,
    resumo,
    motivos,
    ...(inicio.length ? { inicio } : {}),
    ...(fim ? { fim } : {}),
    ...(completar ? { completar: comandoDe(completar) } : {}),
    ...(Object.keys(documentos).length ? { documentos } : {}),
    ...(Object.keys(ordens).length ? { ordens } : {}),
    ...(Object.keys(fases).length ? { fases } : {}),
    ...(Object.keys(esforco).length ? { esforco } : {}),
    ...(Object.keys(rodadas).length ? { rodadas } : {}),
    ...(Object.keys(textos).length ? { textos: Object.fromEntries(Object.entries(textos).map(([k, v]) => [k, v.trim()])) } : {}),
    ...(Object.keys(vistas).length ? { vistas: Object.fromEntries(Object.entries(vistas).map(([k, v]) => [k, v.trim()])) } : {}),
    /* a skill vira o comando, que é a chave que o painel tem na mão */
    rotulos: Object.fromEntries(Object.entries(rotulos).map(([k, v]) => [etapas.includes(k) ? k : comandoDe(k) || k, v.trim()])),
    grupos: grupos.filter((g) => g.acoes.length),
  }, null, 2) + "\n";
}

/**
 * AS REFERÊNCIAS QUE SÃO DO OFÍCIO. O motor tem as dele (`_motor/referencias/`,
 * de qualquer profissão); um pack pode ter as suas em `<pack>/referencias/` —
 * o roteiro de um site que só aquele ofício usa, por exemplo. Viajam pela
 * mesma regra: só para a skill que as cita por `references/<nome>`. Não
 * passam pelas marcas — pack é fonte, e escreve o valor. Nome igual ao de uma
 * do motor é erro: a skill receberia uma das duas, e ninguém saberia qual.
 */
async function referenciasDoPack(pack, doMotor) {
  const dir = join(OFICINA, pack, "referencias");
  if (!existsSync(dir)) return [];
  const nomes = (await readdir(dir)).filter((n) => n.endsWith(".md"));
  for (const n of nomes) {
    if (doMotor.some(([m]) => m === n)) {
      throw new Error(`${pack}/referencias/${n}: já existe uma referência do motor com esse nome`);
    }
  }
  return Promise.all(nomes.map(async (n) => [n,
    `<!-- CÓPIA GERADA · não edite: a fonte é oficina/${pack}/referencias/${n}, e ` +
    "`npm run oficina -- --escrever` refaz. -->\n\n" + await readFile(join(dir, n), "utf8"), true]));
}

/** os packs do marketplace, lidos do próprio marketplace */
async function packs() {
  const m = JSON.parse(
    await readFile(join(OFICINA, ".claude-plugin", "marketplace.json"), "utf8"));
  return m.plugins.map((p) => p.source.replace(/^\.\//, ""));
}

/**
 * O CONTRATO.md de um pack, montado das seções dos dois diretórios.
 *
 * `null` quando não há `contrato/` nem `CONTRATO.md` — quem decide o que
 * fazer com isso é quem chamou. Se `contrato/` não existe mas o `CONTRATO.md`
 * sim, ele é a fonte: é o pack que ainda não foi partido, e partir é
 * migração, não pré-requisito.
 */
export async function montarContrato(pack) {
  const secoes = await secoesDoContrato(pack);
  if (!secoes) {
    const antigo = join(OFICINA, pack, "CONTRATO.md");
    return existsSync(antigo) ? await readFile(antigo, "utf8") : null;
  }
  return secoes.map((s) => s.texto).join("\n");
}

/* ── AS MARCAS DO MOTOR, e o vocabulário que as resolve ─────────────────
   As seções de `_motor/` não dizem "corretor", "imóvel" nem `/corretor:` —
   dizem `{profissional}`, `{item}`, `/{plugin}:`, e o valor vem de
   `oficina/<pack>/contrato/vocabulario.json`. Medido antes das marcas: o
   motor tinha 127 ocorrências do ofício em onze arquivos, e um pack de
   médico que o herdasse chamaria o médico de corretor cinquenta e cinco
   vezes. Marca sem valor FICA DE PÉ no texto (a mesma regra do `preencher()`
   da página) e o `conferir` a acusa — apagá-la daria frase mutilada sem
   erro. Chave que começa com `_` é anotação do vocabulário, não marca. */
const RE_MARCA = /\{([\w-]+)\}/g;
/* ── O EXEMPLO DO OFÍCIO É TEXTO, E TEXTO MORA EM ARQUIVO ─────────────
   Ao subir as skills de memória para o motor, o que sobrou de ofício não foi
   a mecânica: foram os EXEMPLOS. Medido nas quatro: 26 blocos e 356 linhas de
   saída de exemplo, o maior com 69 linhas — e o resto, 83%, atravessa
   qualquer profissão sem uma palavra nova.

   Esses blocos poderiam ser marcas do vocabulario.json, e não são: um JSON
   com vinte e seis strings de trinta linhas cada, com 
 escrito à mão, é
   ilegível de ler e pior de editar. Cada arquivo .md de `<pack>/exemplos/`
   vira a marca com o nome dele — `retomada-recusada.md` responde por
   `{retomada-recusada}` —, sem sintaxe nova e sem entrada no JSON. */
async function exemplosDe(pack) {
  const dir = join(OFICINA, pack, "exemplos");
  if (!existsSync(dir)) return {};
  const nomes = (await readdir(dir)).filter((n) => n.endsWith(".md"));
  return Object.fromEntries(await Promise.all(nomes.map(async (n) =>
    [n.slice(0, -3), (await readFile(join(dir, n), "utf8")).replace(/\s+$/, "")])));
}

/* ── O GÊNERO DA MARCA, DERIVADO ──────────────────────────────────────
   O preâmbulo do contrato manda escrever de forma que a concordância não
   dependa da marca, e o motor tinha QUARENTA E UM pontos que dependiam: "o
   {item}", "do {item}", "um {item}". O corretor nunca os expôs porque
   "imóvel" é masculino; o segundo pack, em que {item} é "conta", os expôs
   todos de uma vez — e nenhum alarme pegava, porque a fonte está certa e o
   erro nasce na geração.

   Reformular os quarenta e um daria português pior ("o arquivo de conta", "a
   página de conta"). O que se deriva aqui é o ARTIGO: o pack declara
   `item-genero`, e o motor escreve {o-item}, {do-item}, {um-item}. O nome da
   marca usa a forma masculina como RÓTULO e não como valor — {o-pessoa} sai
   "a paciente" num pack de médico. */
/* A chave é o RÓTULO da marca e também a forma masculina, e por isso ela é
   kebab-case: `{o-primeiro-item}` sai "o primeiro imóvel" num pack e "a
   primeira conta" no outro. Sem o par composto, "o primeiro {item}" ficava
   escrito à mão — seis vezes na `comecar` —, e nada acusava enquanto o
   ofício fosse masculino. */
const FLEXAO = {
  o: "a", do: "da", no: "na", ao: "à", um: "uma", pelo: "pela",
  esse: "essa", este: "esta", aquele: "aquela", outro: "outra",
  todo: "toda", mesmo: "mesma", certo: "certa",
  "o-primeiro": "a primeira", "do-primeiro": "da primeira",
  "no-primeiro": "na primeira", "um-primeiro": "uma primeira",
  "o-proximo": "a próxima", "do-proximo": "da próxima",
  "o-ultimo": "a última", "do-ultimo": "da última",
};
const FLEXAO_PL = {
  os: "as", dos: "das", nos: "nas", aos: "às", uns: "umas", pelos: "pelas",
  esses: "essas", estes: "estas", todos: "todas", dois: "duas", outros: "outras",
};
const PARES = [
  ["item", "itens", "item-genero"],
  ["pessoa", "pessoas", "pessoa-genero"],
  ["andante", "andantes", "andante-genero"],
];

/* ── {andante}: QUEM ANDA NO FUNIL ────────────────────────────────────
   Os dois primeiros packs eram de venda, e nos dois quem tem `etapa:` é a
   PESSOA — o cliente, o contato. O motor saiu com essa forma, e só o terceiro
   pack a expôs: numa busca de vaga quem anda é a VAGA, e muita vaga nem tem
   pessoa. Pessoa e dono da etapa eram a mesma marca em ~200 lugares.

   O pack declara `etapa-de` (`pessoa`, que é o padrão, ou `item`), e o motor
   escreve {andante} onde fala de quem tem etapa, e {pessoa} onde fala de quem
   RECEBE a mensagem. Não é um terceiro tipo: é apelido de um dos dois, com as
   mesmas flexões, resolvido na geração — quem lê a skill continua lendo
   "cliente" ou "vaga", nunca "andante". */
const DONOS = { pessoa: ["pessoa", "pessoas"], item: ["item", "itens"] };
function comAndante(pack, bruto) {
  const de = bruto["etapa-de"] || "pessoa";
  if (!DONOS[de]) {
    throw new Error(`${pack}: etapa-de é “${de}” — só existe pessoa ou item`);
  }
  const [s, p] = DONOS[de];
  const apelido = {};
  for (const [nosso, dele] of [["andante", s], ["Andante", maiuscula(s)],
    ["andantes", p], ["andante-genero", s + "-genero"], ["pasta-andantes", "pasta-" + p],
    ["teto-andante", "teto-" + s]]) {
    if (bruto[dele] !== undefined) apelido[nosso] = bruto[dele];
  }
  return { ...apelido, ...bruto, "etapa-de": de };
}

/* ── O BLOCO CONDICIONAL, que é de LINHA INTEIRA ──────────────────────
   Onde o apelido não basta — o passo que muda de natureza quando a etapa é
   do item —, o motor escreve:

       [[se etapa-de:item]]
       …
       [[fim]]

   As duas marcas ocupam a linha SOZINHAS e somem com a quebra delas; o que
   sobra é exatamente o texto de dentro, ou nada. Não reaproveita o `achatar`
   do prompt: ele apara espaço e junta linha em branco, e aqui o invariante é
   de BYTE — o pack que não entra no bloco tem de sair idêntico ao de antes.
   Não aninha, pela mesma razão de lá. */
const RE_BLOCO = /^\[\[se ([\w-]+):([\w-]+)\]\][ \t]*\r?\n([\s\S]*?)^\[\[fim\]\][ \t]*(?:\r?\n|$)/gm;
const resolverBlocos = (texto, vocab) =>
  texto.replace(RE_BLOCO, (m, chave, valor, dentro) => {
    if (/^\[\[se /m.test(dentro)) {
      throw new Error(`bloco [[se ${chave}:${valor}]] com outro [[se]] dentro — não aninha`);
    }
    return String(vocab[chave] ?? "") === valor ? dentro : "";
  });

function flexoesDe(vocab) {
  const saida = {};
  for (const [chave, plural, genero] of PARES) {
    if (!vocab[chave]) continue;
    const f = vocab[genero] === "f";
    for (const [m, fem] of Object.entries(FLEXAO)) {
      const escrita = `${f ? fem : m.replace(/-/g, " ")} ${vocab[chave]}`;
      saida[`${m}-${chave}`] = escrita;
      /* a mesma marca com inicial maiúscula, porque a frase que começa com
         ela existe — "### Passo 6 · O primeiro {item}". Sem o par, o título
         voltava a ser escrito à mão. */
      saida[`${maiuscula(m)}-${chave}`] = maiuscula(escrita);
    }
    if (!vocab[plural]) continue;
    for (const [m, fem] of Object.entries(FLEXAO_PL)) {
      saida[`${m}-${plural}`] = `${f ? fem : m} ${vocab[plural]}`;
    }
  }
  return saida;
}

/* ── {base}: O NOME DO LUGAR ONDE TUDO MORA ───────────────────────────
   O motor dizia "carteira" 351 vezes, e carteira é palavra de quem vende. A
   marca tem PADRÃO — `base` —, que é o que a separa de {item} e {pessoa}: o
   pack que não a declara não fica com marca de pé, fica com a palavra neutra.

   Ela é FEMININA POR CONTRATO, e a cobrança é deliberada: o motor escreve
   "da {base} inteira", "{base} montada", "a {base} está pronta" — concordância
   a distância que nenhuma flexão de artigo alcança. Carteira, base e busca
   são as três femininas; no dia em que um pack precisar de "acervo", o custo
   é reescrever essas frases, e o pack sintético já sabe achar as presas.

   `pasta-base` é a mesma palavra onde ela é CAMINHO: a pasta, o campo do
   INDICE.md, o nome da skill e o da seção. Sem acento e sem espaço. */
const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function comBase(pack, bruto) {
  const base = bruto.base || "base";
  if ((bruto["base-genero"] || "f") !== "f") {
    throw new Error(`${pack}: {base} é feminina por contrato — o motor concorda ` +
      `com ela a distância ("{base} montada"), e base-genero só aceita f`);
  }
  const pasta = bruto["pasta-base"] || semAcento(base);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(pasta)) {
    throw new Error(`${pack}: pasta-base “${pasta}” não é kebab-case — ela vira ` +
      `pasta, campo do INDICE.md e nome de comando`);
  }
  return { Base: maiuscula(base), bases: base + "s", ...bruto, base, "pasta-base": pasta };
}

export async function vocabularioDe(pack) {
  const p = join(OFICINA, pack, "contrato", "vocabulario.json");
  const bruto = comAndante(pack,
    comBase(pack, existsSync(p) ? JSON.parse(await readFile(p, "utf8")) : {}));
  const exemplos = await exemplosDe(pack);
  /* colisão silenciosa daria dois valores para a mesma marca e o vencedor
     seria a ordem do spread, que ninguém lê. */
  for (const n of Object.keys(exemplos)) {
    if (n in bruto) {
      throw new Error(`${pack}: a marca {${n}} está no vocabulario.json E em ` +
        `exemplos/${n}.md — escolha um dos dois`);
    }
  }
  const flexoes = flexoesDe(bruto);
  for (const n of Object.keys(flexoes)) {
    if (n in bruto || n in exemplos) {
      throw new Error(`${pack}: {${n}} é derivada do gênero e não se escreve à mão`);
    }
  }
  /* o gênero é COBRADO e não tem padrão: quem esquecer de declará-lo num pack
     feminino sai com "o conta" em quarenta e um lugares, e nada acusa. */
  for (const [chave, , genero] of PARES) {
    if (bruto[chave] && !["m", "f"].includes(bruto[genero])) {
      throw new Error(`${pack}: declara {${chave}} e não declara ${genero} (m ou f) — sem ele o artigo sai errado e nenhuma régua vê`);
    }
  }
  return { ...exemplos, ...flexoes, ...bruto,
    ...(await contagensDoPack(pack, bruto)) };
}
/* `{{item}}` é a marca ESCRITA, e não a resolvida. Ela existe por causa de
   um parágrafo só: o do preâmbulo que ENSINA a regra do gênero. Sem escape
   ele saía dizendo “`conta` e `contato` resolvem para um substantivo
   masculino”, que é o exemplo virado do avesso.

   O sentinela protege ANTES de resolver, porque a expressão da marca casa
   dentro de `{{…}}` e comeria a chave de fora. */
const ESCAPE = "\uE000";
export const resolverMarcas = (texto, vocab) => {
  const cruas = [];
  const protegido = resolverBlocos(texto, vocab).replace(/\{\{([\w-]+)\}\}/g, (m, nome) => {
    cruas.push(nome);
    return ESCAPE + (cruas.length - 1) + ESCAPE;
  });
  return protegido
    .replace(RE_MARCA, (m, nome) =>
      (!nome.startsWith("_") && nome in vocab ? vocab[nome] : m))
    .replace(new RegExp(ESCAPE + "(\\d+)" + ESCAPE, "g"),
      (m, i) => `{${cruas[i]}}`);
};

/* ── AS SKILLS DO MOTOR QUE ESTE OFÍCIO NÃO QUER ───────────────────────
   Nem toda skill do motor serve a todo pack, e quem descobriu isso foi o
   segundo: `compartilhar-com-{pessoa}` resolve para
   `compartilhar-com-contato` num pack de prospecção, e ninguém compartilha a
   própria carteira de prospecção com quem está prospectando. Gerar a skill
   assim mesmo entrega um comando que não faz sentido no ofício, e o comando
   é o que a pessoa digita.

   É um OBJETO e não uma lista porque a chave leva o motivo escrito ao lado:
   recusa sem motivo é a linha que ninguém sabe se ainda vale, e o
   `conferir` cobra que ele exista. */
/* A marca escapada chega ao montado como `{item}` e é indistinguível de
   uma que ficou de pé. Quem sabe a diferença é a FONTE, e é lá que a régua
   pergunta. */
async function marcasEscapadas(pack) {
  const fontes = [
    ...(existsSync(MOTOR) ? await readdir(MOTOR) : []).map((n) => join(MOTOR, n)),
    ...(existsSync(join(OFICINA, pack, "contrato"))
      ? (await readdir(join(OFICINA, pack, "contrato")))
        .map((n) => join(OFICINA, pack, "contrato", n)) : []),
  ].filter((p) => p.endsWith(".md"));
  const saida = new Set();
  for (const p of fontes) {
    for (const m of (await readFile(p, "utf8"))
      .matchAll(/\{\{([\w-]+)\}\}/g)) saida.add(`{${m[1]}}`);
  }
  return saida;
}

const recusadas = (vocab) =>
  new Set(Object.keys(vocab["_skills-do-motor-fora"] || {}));

/* ── E A CONTRAPARTIDA DA RECUSA, QUE EU NÃO TINHA PREVISTO ────────────
   Recusar uma skill do motor deixa órfã a seção do contrato que só ela
   usava. Medido no segundo pack: `compartilhar-com-{pessoa}` saiu por
   `_skills-do-motor-fora`, e o CONTRATO.md de prospecção continuou
   carregando a §4.8 inteira — o formato da vista, o que entra e o que nunca
   entra — sem uma única skill que a abrisse. Ninguém acusava: a seção estava
   correta, o vocabulário estava correto, e o contrato ficou com uma casa a
   mais que ninguém visita.

   Objeto e não lista, pela mesma razão de `_skills-do-motor-fora`: a chave
   leva o motivo escrito ao lado, e o `conferir` cobra que ele exista. */
const secoesRecusadas = (vocab) =>
  new Set(Object.keys(vocab["_secoes-do-motor-fora"] || {}));

/* o padrão de nome de seção. Ele decide três coisas ao mesmo tempo: o que
   entra no contrato montado, o que a skill leva em `references/contrato/` e
   o que a régua da órfã cobra. */
const RE_NOME_SECAO = /^\d\d-\d-[a-z0-9-]+[.]md$/;

/**
 * QUANTAS SKILLS O PACK TEM — e por que o número é marca, e não palavra.
 *
 * Seis frases de `_motor/` traziam a contagem por extenso: "o padrão comum
 * das dez skills do pack", "as outras nove", "nove das dez skills existem
 * para mudar arquivo que já existe". O motor é herdado INTEIRO, então um pack
 * de outro ofício nascia dizendo dez na primeira linha que o agente lê — e
 * nenhum alarme pegava, porque a fonte está correta e o erro nasce na
 * geração. É a mesma classe que o D200 consertou para as palavras do ofício,
 * e que ficou faltando para o número.
 *
 * A conta é a UNIÃO do que está no disco com o que a geração vai escrever,
 * menos as recusadas. União porque depender só do disco faria o primeiro
 * `--escrever` de um pack novo dar um número e o segundo dar outro.
 */
async function contagensDoPack(pack, bruto) {
  const fora = new Set([...recusadas(bruto)].map((n) => resolverMarcas(n, bruto)));
  const doMotor = (await skillsDoMotor()).map(([n]) => resolverMarcas(n, bruto));
  const todas = new Set([...(await skillsDe(pack)), ...doMotor]);
  const total = [...todas].filter((n) => !fora.has(n)).length;
  return {
    "n-skills": por(total),
    "N-skills": maiuscula(por(total)),
    "n-skills-1": por(total - 1),
    "total-skills": String(total),
  };
}

/* ── A VITRINE ENVELHECE, E NADA A LIA ────────────────────────────────
   O pack do corretor foi ao ar com CATORZE skills e onze frases dizendo
   "dez" — cinco no README do pack, uma no plugin.json, três no README da
   Oficina e uma no PROMPT.md. A página já se protegia, porque a copy dela sai
   de `{N}`; o que se escreve à mão não tinha régua nenhuma, e o número é a
   primeira coisa que quem instala confere.

   Ela é LITERAL de propósito — procura o numeral por extenso colado no
   substantivo e não tenta entender a frase. Subconjunto legítimo ("cinco
   ferramentas colam") se declara com `<!-- de N -->` na mesma linha: a
   exceção fica visível ao lado do número, que é onde ela se lê.

   O número público conta o que a pessoa PEDE: a `gravar-o-que-marquei` é do
   painel e fica fora, como fica fora da página do site. As marcas
   `{n-skills}` do contrato continuam contando todas as pastas — ali o
   leitor é o modelo, e a da fila também lê o contrato. */
const NUMERAIS = {
  uma: 1, duas: 2, três: 3, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7,
  oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14,
  quatorze: 14, quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18,
  dezenove: 19, vinte: 20,
};
const RE_CONTAGEM = new RegExp(
  String.raw`\b(` + Object.keys(NUMERAIS).join("|") +
  String.raw`)\s+(skills?|ferramentas?|pastas|tarefas)\b`,
  "giu");

function conferirVitrine(arquivos, total) {
  const erros = [];
  for (const [nome, texto] of arquivos) {
    if (texto === null) continue;
    const linhas = texto.split(/\r?\n/);
    for (const m of texto.matchAll(RE_CONTAGEM)) {
      const n = texto.slice(0, m.index).split(/\r?\n/).length;
      if (/<!--\s*de \d+\s*-->/.test(linhas[n - 1] || "")) continue;
      const dito = NUMERAIS[m[1].toLowerCase()];
      if (dito === total) continue;
      erros.push(`${nome}:${n}: diz “${m[0].replace(/\s+/g, " ")}” e o pack tem ${total} — ` +
        `derive o número ou declare o recorte com <!-- de ${total} -->`);
    }
  }
  return erros;
}

/* ── E A LISTA DE TAREFAS DO PROMPT PÚBLICO ─────────────────────────
   O prompt do corretor foi ao ar dizendo “serve para as catorze tarefas”
   e listando DEZ: as quatro do motor nunca ganharam bloco `[[se tarefa:]]`,
   e o de prospecção repetiu o erro com duas. A régua da vitrine não pega
   porque o numeral está CERTO — quatorze skills, catorze escrito. O que
   está errado é a lista embaixo dele, e ela não era conferida por nada.

   O gerador liga um bloco por ferramenta do manifesto (`PROMPT_PADRAO`),
   então bloco que não existe some sem deixar rastro: o prompt sai menor e
   parece completo. */
function conferirTarefasDoPrompt(texto, nome, ferramentas) {
  if (texto === null) return [];
  const escritos = new Set([...texto.matchAll(/\[\[se tarefa:([a-z0-9-]+)\]\]/g)]
    .map((m) => m[1]));
  const ids = new Set(ferramentas.map((f) => f.id));
  const erros = [];
  for (const id of ids) {
    if (!escritos.has(id)) {
      erros.push(`${nome}: a skill ${id} não tem bloco [[se tarefa:${id}]] — ` +
        `ela some do prompt colado sem nada acusar`);
    }
  }
  for (const id of escritos) {
    if (!ids.has(id)) {
      erros.push(`${nome}: tem [[se tarefa:${id}]] e o pack não tem essa skill`);
    }
  }
  return erros;
}

/* ── E A LISTA DE COMANDOS DO README ──────────────────────────────────
   A página já é cobrada assim: o `oficina-paginas.mjs` derruba o build
   quando o manifesto e `skills/` discordam de um id. O README do pack não
   era cobrado por nada, e foi ao ar com dez comandos para catorze skills —
   quatro ferramentas publicadas, instaláveis, e ausentes da única
   documentação que quem instala lê. */
function conferirIndice(texto, nome, plugin, skills) {
  if (texto === null) return [];
  const re = new RegExp("/" + plugin.replace(/[.*+?^${}()|[]\]/g, "\$&") +
    ":([a-z0-9-]+)", "g");
  const citadas = new Set([...texto.matchAll(re)].map((m) => m[1]));
  const erros = [];
  for (const s of skills) {
    if (!citadas.has(s)) {
      erros.push(`${nome}: não cita /${plugin}:${s}, que está em ${plugin}/skills/ — ` +
        `quem instala lê este arquivo, e a skill não existe para ele`);
    }
  }
  for (const c of citadas) {
    if (!skills.includes(c)) {
      erros.push(`${nome}: cita /${plugin}:${c}, que não existe em ${plugin}/skills/`);
    }
  }
  return erros;
}

/** as skills do motor que ESTE pack leva */
async function skillsDoMotorPara(vocab) {
  const fora = recusadas(vocab);
  return (await skillsDoMotor()).filter(([nome]) => !fora.has(nome));
}

/**
 * As seções do contrato de um pack, na ordem, já resolvidas — `null` quando
 * o pack não foi partido (não tem `contrato/`). É daqui que saem o
 * `CONTRATO.md` inteiro e as cópias por seção em `references/contrato/`.
 */
export async function secoesDoContrato(pack) {
  const dir = join(OFICINA, pack, "contrato");
  if (!existsSync(dir)) return null;
  const vocab = await vocabularioDe(pack);
  /* SÓ arquivo com nome de seção entra no contrato. Era `.endsWith(".md")`,
     e qualquer .md solto na raiz do motor virava seção do contrato de todos os
     packs — o MOLDE.md, que é documentação de quem ESCREVE uma skill, entraria
     no fim de cada CONTRATO.md porque "M" ordena depois de "0". O padrão é o
     mesmo da RE_SECAO, que é quem decide o que a skill leva em references/. */
  /* o nome do arquivo passa pelas marcas ANTES do filtro: uma seção do motor
     leva o nome do lugar — `01-0-onde-a-{pasta-base}-mora.md` —, e é o nome
     RESOLVIDO que a skill cita e que viaja em references/contrato/. A recusa
     (`_secoes-do-motor-fora`) continua sendo pelo nome da FONTE. */
  const de = async (base) =>
    (await readdir(base)).map((n) => [n, resolverMarcas(n, vocab), join(base, n)])
      .filter(([, resolvido]) => RE_NOME_SECAO.test(resolvido));
  /* a recusa vale só para o MOTOR: seção do próprio pack que ele não quer
     não se declara, se apaga. */
  const fora = secoesRecusadas(vocab);
  const todas = [...(existsSync(MOTOR) ? (await de(MOTOR)).filter(([n]) => !fora.has(n)) : []),
    ...(await de(dir))]
    .sort(([, a], [, b]) => (a < b ? -1 : a > b ? 1 : 0));
  return Promise.all(todas.map(async ([, nome, p]) =>
    ({ nome, texto: resolverMarcas(await readFile(p, "utf8"), vocab) })));
}

/* as tarefas do prompt colado são as skills do pack, menos estas: a
   `gravar-o-que-marquei` só existe para a fila do painel, e a
   `completar-ficha` ainda não tem bloco escrito (dívida, commit be351a2). */
const FORA_DO_PROMPT = new Set(["gravar-o-que-marquei", "completar-ficha"]);
async function tarefasDe(pack) {
  return (await skillsDe(pack)).filter((s) => !FORA_DO_PROMPT.has(s));
}

async function skillsDe(pack) {
  const dir = join(OFICINA, pack, "skills");
  if (!existsSync(dir)) return [];
  return (await readdir(dir, { withFileTypes: true }))
    .filter((e) => e.isDirectory()).map((e) => e.name);
}

/**
 * AS SKILLS QUE SÃO DO MOTOR, e não do ofício.
 *
 * Doze packs escreveriam a mesma skill com doze nomes — foi o que a pesquisa
 * de 2026-09-08 mediu, e `cobrar-o-que-falta` apareceu em doze fichas como
 * `cobrar-documento`, `cobrar-a-guia`, `cobrar-aprovacao`, `cobrar-parcela`.
 * O gesto é sempre o mesmo: uma pendência DE TERCEIRO, com dono, canal e dias
 * parados, virando mensagem. Isso é `{item}` e `{pessoa}`, que o vocabulário
 * já resolve.
 *
 * O mecanismo é o mesmo do contrato e das referências, um nível acima: a
 * fonte mora em `_motor/skills/`, com marcas, e a geração escreve a cópia
 * resolvida dentro de cada pack. **A marca vale também no NOME DA PASTA** —
 * `compartilhar-com-{pessoa}` vira `compartilhar-com-cliente` aqui e
 * `compartilhar-com-paciente` no pack seguinte —, porque o nome da pasta é o
 * comando que a pessoa digita, e um comando genérico num pack de ofício lê
 * como software de outra pessoa.
 *
 * Uma vez geradas elas são skills como as outras: o laço abaixo lhes dá o
 * contrato e as seções que elas citam, o `conferirSkills` cobra os tetos e o
 * molde, e o `conferirMotor` — que varre `_motor/**` — cobra que elas não
 * digam uma palavra do ofício. É a régua da modularidade rodando sozinha.
 */
async function skillsDoMotor() {
  const dir = join(MOTOR, "skills");
  if (!existsSync(dir)) return [];
  const nomes = (await readdir(dir, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && existsSync(join(dir, e.name, "SKILL.md")))
    .map((e) => e.name);
  return Promise.all(nomes.map(async (n) =>
    [n, await readFile(join(dir, n, "SKILL.md"), "utf8")]));
}

/**
 * Confere as cópias geradas, e as reescreve com `{ escrever: true }`.
 *
 * Devolve os problemas em LISTA, e não em `console.log`: quem imprime é o
 * chamador — a CLI lá embaixo, ou a lista de ✓ do `conferir.mjs`.
 */
export async function conferirOficina({ escrever = false } = {}) {
  const erros = [];
  let copias = 0, bytes = 0;

  for (const pack of await packs()) {
    const fonte = join(OFICINA, pack, "CONTRATO.md");
    /* ── O CONTRATO É MONTADO, e o próprio CONTRATO.md é uma cópia ──────
       As seções vivem partidas em dois lugares: `oficina/_motor/` tem as que
       valem para QUALQUER profissão (68,8% das linhas, medido) e
       `oficina/<pack>/contrato/` tem as que mudam com o ofício. O pack de
       médico herda o primeiro diretório inteiro e escreve só o segundo.

       A fusão é por ORDENAÇÃO DO NOME, e o formato `NN-N-` do prefixo é o que
       a torna segura: com `07` e `07-1` soltos o `.sort()` põe `07-1` na
       FRENTE, porque '1' vem antes de 'c' na tabela de caracteres — o
       contrato sairia com a §7.1 antes da §7 e nada acusaria. Os dois
       diretórios entram na MESMA ordenação: concatenar um depois do outro
       sairia fora de ordem, com a §4.4 depois da §10.

       Sem separador no join: cada seção já termina com a própria régua `---`,
       e inserir uma no meio duplicaria as vinte e uma. Provado byte a byte
       contra o arquivo escrito à mão antes da partição. */
    const secoes = await montarContrato(pack);
    const lista = (await secoesDoContrato(pack)) || [];
    {
      const vocab = await vocabularioDe(pack);
      const ler = async (p) => (existsSync(p) ? await readFile(p, "utf8") : null);
      const prompt = join(PROMPTS, pack + ".md");
      erros.push(...conferirVitrine([
        [`${pack}/README.md`, await ler(join(OFICINA, pack, "README.md"))],
        [`${pack}/.claude-plugin/plugin.json`,
          await ler(join(OFICINA, pack, ".claude-plugin", "plugin.json"))],
        ...(existsSync(prompt) ? [[`prompts/${pack}.md`, await ler(prompt)]] : []),
      ], Number(vocab["total-skills"]) -
        (existsSync(join(OFICINA, pack, "skills", SKILL_DA_FILA)) ? 1 : 0)));
      /* as do motor entram pelo nome que VÃO ter: na primeira montagem de um
         pack novo elas ainda não estão no disco, e o README acusava falta. */
      const doMotor = (await skillsDoMotorPara(vocab)).map(([n]) => resolverMarcas(n, vocab));
      erros.push(...conferirIndice(
        await ler(join(OFICINA, pack, "README.md")),
        `${pack}/README.md`, pack, [...new Set([...await skillsDe(pack), ...doMotor])]));
      if (existsSync(prompt)) {
        erros.push(...conferirTarefasDoPrompt(await ler(prompt), `prompts/${pack}.md`,
          (await tarefasDe(pack)).map((id) => ({ id }))));
      }
    }
    const refsDoMotor = await referenciasDoMotor(pack);
    const referencias = [...refsDoMotor, ...await vocabularioDeAudio(pack),
                         ...await referenciasDoPack(pack, refsDoMotor)];
    if (secoes === null) {
      erros.push(`${pack}: não tem contrato/ nem CONTRATO.md`);
      continue;
    }
    if (!existsSync(fonte) || (await readFile(fonte, "utf8")) !== secoes) {
      if (!escrever) {
        erros.push(`${pack}/CONTRATO.md: montado das seções e diferente do disco`);
      } else {
        await writeFile(fonte, secoes, "utf8");
      }
    }
    copias++; bytes += secoes.length;
    const texto = AVISO(pack) + secoes;

    /* o contrato manda os gabaritos morarem em references/modelos/, dentro da
       skill, pela mesma razão do contrato (§4). Eles vão SEM o aviso de cópia
       gerada: `comecar` copia o modelo para a carteira do corretor tirando só os
       comentários `<!-- MODELO · … -->`, e um banner a mais sobreviveria à
       limpeza e chegaria ao corretor dentro do arquivo dele. */
    const dirModelos = join(OFICINA, pack, "modelos");
    const modelos = existsSync(dirModelos)
      ? await Promise.all((await readdir(dirModelos))
          .filter((n) => n.endsWith(".md"))
          .map(async (n) => [n, await readFile(join(dirModelos, n), "utf8")]))
      : [];

    /* ── QUEM PRECISA DE QUAL GABARITO, LIDO DA PRÓPRIA SKILL ────────────
       A skill que nomeia `references/modelos/cliente.md` leva esse arquivo e mais
       nenhum. A que cita a PASTA sem nomear arquivo — hoje só a `comecar`, que
       monta a carteira inteira — leva os sete. A que não cita nada não leva nada,
       e é a maioria: seis das dez.

       Ler isto do TEXTO da skill, em vez de manter uma lista aqui, é o que impede
       a lista de envelhecer: skill que passa a citar um gabarito o recebe na
       próxima geração, sem ninguém lembrar de vir aqui escrever o nome dela. */
    /* ── E A MESMA REGRA VALE PARA AS SEÇÕES ────────────────────────────
       A skill que nomeia `references/contrato/04-5-arquivo-de-cliente.md`
       leva esse arquivo e mais nenhum. Copiar as 21 em todas dava 210
       arquivos por pack, dos quais cada skill abre umas oito — é a mesma
       conta que o comentário dos gabaritos já fez, e a mesma resposta. O
       `CONTRATO.md` inteiro continua indo para as dez, porque uma seção
       cita outra e o inteiro é onde a outra está.

       O nome do arquivo É a citação: a skill abre dizendo `references/contrato/`
       uma vez e depois nomeia os arquivos soltos — `04-5-arquivo-de-cliente.md`
       —, que é como se lê em prosa. Procurar o caminho inteiro em cada menção
       acharia uma seção por skill. */
    const RE_SECAO = /(\d\d-\d-[a-z0-9-]+[.]md)/g;
    const nomesDeSecao = new Set(lista.map((s) => s.nome));
    /* toda seção que alguma skill deste pack nomeia. É o outro lado de
       `conferirCitacoes`: aquela pergunta se a citação existe, esta pergunta
       se a seção é citada. */
    const citadas = new Set();
    /* ── SEÇÃO CITADA QUE NÃO EXISTE É ERRO, e não ausência ─────────────
       O filtro abaixo é por interseção: uma skill que cita
       `09-0-os-tetos.md` num pack que não tem essa seção simplesmente não
       recebe o arquivo, e a cópia sai coerente — com a skill mandando ler um
       caminho que não existe. Nada acusa, e o agente segue sem ele.

       Isso não era teórico: as skills de `_motor/skills/` valem para qualquer
       ofício e citam seções dos DOIS diretórios. `09-0-os-tetos.md` é do
       ofício, e o primeiro pack que não a escrevesse herdaria uma skill quebrada
       sem nenhum sinal. O custo de descobrir isso é o do pack novo inteiro. */
    const registrarCitacoes = (texto) => {
      for (const m of texto.matchAll(RE_SECAO)) citadas.add(m[1]);
    };
    const conferirCitacoes = (texto, onde) => {
      /* Set e não laço direto: uma skill cita a mesma seção duas ou três vezes
         (a leitura obrigatória no "Antes de tudo", e depois no passo que a usa),
         e três linhas iguais no terminal fazem o leitor procurar três defeitos. */
      for (const nome of new Set([...texto.matchAll(RE_SECAO)].map((m) => m[1]))) {
        if (!nomesDeSecao.has(nome)) {
          erros.push(`${onde}: cita a seção ${nome}, que não existe no contrato de ${pack}`);
        }
      }
    };
    const secoesDe = (texto) => {
      const querem = new Set([...texto.matchAll(RE_SECAO)].map((m) => m[1]));
      return lista.filter((sec) => querem.has(sec.nome));
    };

    const RE_ARQUIVO = /references[/]modelos[/]([A-Za-z0-9_-]+[.]md)/g;
    const RE_PASTA = /references[/]modelos[/](?![A-Za-z0-9_-]+[.]md)/;
    const gabaritosDe = (texto) => {
      if (RE_PASTA.test(texto)) return modelos;
      const querem = new Set([...texto.matchAll(RE_ARQUIVO)].map((m) => m[1]));
      return modelos.filter(([n]) => querem.has(n));
    };

    /* ── AS SKILLS DO MOTOR, GERADAS ANTES DE TUDO ──────────────────────
       Antes do laço, e não dentro dele: o laço lê `skillsDe(pack)` do disco
       para dar a cada skill o contrato e as seções que ela cita. Uma skill do
       motor gerada DEPOIS dele nasceria sem `references/` e ficaria assim até
       a geração seguinte — dois `--escrever` para um resultado, que é o tipo
       de defeito que só aparece no pack novo de outra pessoa. */
    const vocabPack = await vocabularioDe(pack);
    /* recusada que ficou no disco é pior que recusada nenhuma: o comando
       continua instalável, o `--escrever` não a toca mais, e a lista de
       skills do pack passa a discordar da contagem. */
    for (const nome of recusadas(vocabPack)) {
      const pasta = resolverMarcas(nome, vocabPack);
      if (existsSync(join(OFICINA, pack, "skills", pasta, "SKILL.md"))) {
        erros.push(`${pack}/skills/${pasta}: está no disco e o pack a recusa em ` +
          `_skills-do-motor-fora — apague a pasta`);
      }
    }
    for (const [nome, fonte] of await skillsDoMotorPara(vocabPack)) {
      const pasta = resolverMarcas(nome, vocabPack);
      const conteudo = comAviso(resolverMarcas(fonte, vocabPack), AVISO_SKILL(nome));
      const alvo = join(OFICINA, pack, "skills", pasta, "SKILL.md");
      const atual = existsSync(alvo) ? await readFile(alvo, "utf8") : null;
      if (atual === conteudo) { copias++; bytes += conteudo.length; continue; }
      if (!escrever) {
        erros.push(`${pack}/skills/${pasta}/SKILL.md: ` +
          (atual === null ? "sem cópia — é uma skill do motor" : "a cópia divergiu de _motor/skills/" + nome));
        continue;
      }
      await mkdir(dirname(alvo), { recursive: true });
      await writeFile(alvo, conteudo, "utf8");
      copias++;
      bytes += conteudo.length;
    }
    for (const [nome, fonte] of await skillsDoMotorPara(vocabPack)) {
      registrarCitacoes(resolverMarcas(fonte, vocabPack));
    }

    for (const skill of await skillsDe(pack)) {
      const base = join(OFICINA, pack, "skills", skill, "references");
      const corpo = await readFile(
        join(OFICINA, pack, "skills", skill, "SKILL.md"), "utf8");
      conferirCitacoes(corpo, `${pack}/${skill}/SKILL.md`);
      registrarCitacoes(corpo);

      /* ── E O FECHO VAI PARA TODAS, PORQUE ELE É DE TODAS ────────────────
         O `conferirSkills` já cobra `## Guardei` e `## Falta saber` no corpo
         da SKILL.md. Isso prova que a skill CONHECE o fecho — não que ela o
         tenha por perto na hora de executar, porque a seção só é copiada para
         quem a cita.

         A diferença apareceu na prova: a `importar-a-conversa` acertou o
         trabalho inteiro e reprovou por escrever `## Não gravei nada`. O
         contrato §10 nomeia esse título como errado, palavra por palavra — e
         ela era uma das quatro que não recebiam a seção. As dez antigas
         citavam; as quatro novas, não, e o exemplo do corpo só cobre o caminho
         feliz. O caminho em que nada é gravado é justamente o que improvisa. */
      if (!corpo.includes(FECHO)) {
        erros.push(`${pack}/${skill}/SKILL.md: não cita \`references/contrato/${FECHO}\` — ` +
          `o fecho é obrigatório em toda skill, e a seção só chega a quem a cita`);
      }

      /* ── E O CONTRATO VAI TAMBÉM POR SEÇÃO, em references/contrato/ ──────
         O inteiro tem 52 mil caracteres, e cinco das dez skills mandavam
         lê-lo INTEIRO antes da primeira pergunta — 20 a 30 mil tokens por
         invocação, em toda ferramenta. A montagem já produz as seções; copiá-las
         como arquivos custa nada, e "leia `04-5-arquivo-de-cliente.md`" vira
         uma leitura de dois mil caracteres. O inteiro fica, para quando uma
         seção cita outra. Cada seção leva um aviso de UMA linha: o de três
         parágrafos, em 21 arquivos por skill, seria mais aviso que contrato. */
      for (const [nome, conteudo] of [["CONTRATO.md", texto],
                                      ...gabaritosDe(corpo).map(([n, c]) => [join("modelos", n), c]),
                                      ...secoesDe(corpo).map((sec) => [join("contrato", sec.nome), AVISO_SECAO + sec.texto]),
                                      ...referencias.filter(([n]) => corpo.includes("references/" + n))
                                        .map(([n, c, comAvisoProprio]) => [n, comAvisoProprio ? c : avisoDe(n, pack) + c])]) {
        const alvo = join(base, nome);
        const atual = existsSync(alvo) ? await readFile(alvo, "utf8") : null;

        if (atual === conteudo) { copias++; bytes += conteudo.length; continue; }

        if (!escrever) {
          erros.push(`${pack}/${skill}/${nome.split(sep).join("/")}: ` +
            (atual === null ? "sem cópia" : "a cópia divergiu da fonte"));
          continue;
        }
        await mkdir(dirname(alvo), { recursive: true });
        await writeFile(alvo, conteudo, "utf8");
        copias++;
        bytes += conteudo.length;
      }
    }

    /* ── O PAINEL, COPIADO PARA DENTRO DO PACK ─────────────────────────
       Ver `DO_PAINEL` no topo sobre por que ele não pode ser compartilhado.

       O `painel.html` é DERIVADO e não é versionado na fonte (só a cópia
       dentro do pack é). Quem clonar o repositório e rodar isto antes de
       `npm run painel` não tem o arquivo — e aí a mensagem NOMEIA o
       comando, em vez de dizer "sem cópia", que mandaria a pessoa procurar
       um arquivo que ninguém escreveu à mão. */
    /* módulo novo em `painel/nucleo/` que não entrou na lista é import quebrado
       no pack instalado, e nada daqui o via: a régua só iterava a lista. */
    for (const n of existsSync(join(PAINEL, "nucleo")) ? await readdir(join(PAINEL, "nucleo")) : []) {
      if (n.endsWith(".mjs") && !DO_PAINEL.includes("nucleo/" + n)) {
        erros.push(`painel/nucleo/${n}: não está em DO_PAINEL — o pack instalado sobe sem ele`);
      }
    }
    for (const rel of DO_PAINEL) {
      /* a página é a DO PACK — as vistas de `<pack>/painel/componentes/` vão
         dentro dela (D267); `npm run painel` escreve uma por pack */
      const deOrigem = rel === "painel.html" ? `painel.${pack}.html` : rel;
      const origem = join(PAINEL, ...deOrigem.split("/"));
      const alvo = join(OFICINA, pack, "painel", ...rel.split("/"));
      if (!existsSync(origem)) {
        erros.push(`painel/${deOrigem}: não existe — rode \`npm run painel\` antes`);
        continue;
      }
      const conteudo = await readFile(origem, "utf8");
      const atual = existsSync(alvo) ? await readFile(alvo, "utf8") : null;
      if (atual === conteudo) { copias++; bytes += conteudo.length; continue; }
      if (!escrever) {
        erros.push(`${pack}/painel/${rel}: ` +
          (atual === null ? "sem cópia — é o painel" : "a cópia divergiu de painel/"));
        continue;
      }
      await mkdir(dirname(alvo), { recursive: true });
      await writeFile(alvo, conteudo, "utf8");
      copias++;
      bytes += conteudo.length;
    }
    /* ── OS DOCUMENTOS, por bytes (D270) ───────────────────────────────── */
    for (const n of existsSync(join(DOCUMENTOS, "nucleo")) ? await readdir(join(DOCUMENTOS, "nucleo")) : []) {
      if (n.endsWith(".mjs") && !DO_DOCUMENTOS.includes("nucleo/" + n)) {
        erros.push(`documentos/nucleo/${n}: não está em DO_DOCUMENTOS — o pack instalado sobe sem ele`);
      }
    }
    for (const rel of existsSync(DOCUMENTOS) ? DO_DOCUMENTOS : []) {
      const origem = join(DOCUMENTOS, ...rel.split("/"));
      const alvo = join(OFICINA, pack, "documentos", ...rel.split("/"));
      if (!existsSync(origem)) { erros.push(`documentos/${rel}: não existe`); continue; }
      const conteudo = await readFile(origem);
      const atual = existsSync(alvo) ? await readFile(alvo) : null;
      if (atual && atual.equals(conteudo)) { copias++; bytes += conteudo.length; continue; }
      if (!escrever) {
        erros.push(`${pack}/documentos/${rel}: ` + (atual === null ? "sem cópia — são os documentos" : "a cópia divergiu de documentos/"));
        continue;
      }
      await mkdir(dirname(alvo), { recursive: true });
      await writeFile(alvo, conteudo);
      copias++;
      bytes += conteudo.length;
    }
    const modelosDoPack = join(OFICINA, pack, "documentos", "modelos");
    for (const nome of existsSync(modelosDoPack) ? await readdir(modelosDoPack) : []) {
      try { JSON.parse(await readFile(join(modelosDoPack, nome, "modelo.json"), "utf8")); }
      catch (e) { erros.push(`${pack}/documentos/modelos/${nome}/modelo.json: ${e.message}`); }
    }
    /* ── O QUE DÁ PARA PEDIR, tirado do README do pack (D231) ────────────
       A página inicial mostra a quem nunca decorou comando o que ele pode
       pedir. A fonte é a tabela `comando · o que faz` do README — que já
       existe em todo pack e já está em língua de gente — e o `# Título` de
       cada SKILL.md, que tem o acento que o nome da pasta não tem. */
    {
      const conteudo = await acoesDoPack(pack);
      const alvo = join(OFICINA, pack, "painel", "acoes.json");
      const atual = existsSync(alvo) ? await readFile(alvo, "utf8") : null;
      if (atual === conteudo) { copias++; bytes += conteudo.length; }
      else if (!escrever) {
        erros.push(`${pack}/painel/acoes.json: ` +
          (atual === null ? "sem cópia — é o que o início mostra em “o que dá para pedir”"
            : "divergiu do README do pack"));
      } else {
        await mkdir(dirname(alvo), { recursive: true });
        await writeFile(alvo, conteudo, "utf8");
        copias++;
        bytes += conteudo.length;
      }
    }
    /* ── E OS CONECTORES, pelo mesmo laço ─────────────────────────────── */
    try {
      for (const [rel, conteudo] of (await conectoresDoPack(pack)) || []) {
        const alvo = join(OFICINA, pack, "conectores", ...rel.split("/"));
        const atual = existsSync(alvo) ? await readFile(alvo, "utf8") : null;
        if (atual === conteudo) { copias++; bytes += conteudo.length; continue; }
        if (!escrever) {
          erros.push(`${pack}/conectores/${rel}: ` +
            (atual === null ? "sem cópia — são os conectores" : "a cópia divergiu de conectores/"));
          continue;
        }
        await mkdir(dirname(alvo), { recursive: true });
        await writeFile(alvo, conteudo, "utf8");
        copias++;
        bytes += conteudo.length;
      }
    } catch (e) {
      erros.push(e.message);
    }
    {
      const alvo = join(OFICINA, pack, ".mcp.json");
      const atual = existsSync(alvo) ? await readFile(alvo, "utf8") : null;
      if (atual !== MCP_DO_PACK) {
        if (!escrever) {
          erros.push(`${pack}/.mcp.json: ` +
            (atual === null ? "não existe — é o que declara o painel" : "divergiu"));
        } else {
          await writeFile(alvo, MCP_DO_PACK, "utf8");
          copias++;
          bytes += MCP_DO_PACK.length;
        }
      } else { copias++; bytes += MCP_DO_PACK.length; }
    }

    /* ── SEÇÃO QUE CHEGA AO CONTRATO E NINGUÉM ABRE ────────────────────
       A cópia por citação (`RE_SECAO`) fez a seção viajar só para a skill
       que a nomeia — e criou, sem que ninguém visse, a seção que não viaja
       para lugar nenhum. Ela continua no `CONTRATO.md` inteiro, correta e
       morta: custa tokens em toda skill que lê o inteiro, e promete um
       comportamento que nenhum comando executa.

       Duas apareceram no segundo pack, por razões diferentes: a §4.8 ficou
       órfã pela RECUSA da skill que a usava (ver `_secoes-do-motor-fora`) e
       a §4.6 por esquecimento — a `estudar-conta` grava a linha do índice e
       não citava a seção que define o formato dela.

       A faixa `00-` é isenta e não se declara: preâmbulo e sumário são o
       cabeçalho do contrato, lidos por quem abre o inteiro, e nenhuma skill
       os nomeia por arquivo. Da `01-` em diante, seção sem skill se declara
       em `_secoes-sem-skill` COM O MOTIVO, ou é defeito. */
    {
      const isentas = vocabPack["_secoes-sem-skill"] || {};
      for (const sec of lista) {
        if (sec.nome.startsWith("00-")) continue;
        if (sec.nome in isentas || citadas.has(sec.nome)) continue;
        erros.push(`${pack}/CONTRATO.md: a seção ${sec.nome} não é citada por ` +
          `skill nenhuma — ela viaja no contrato inteiro e nenhum comando a abre`);
      }
      for (const [nome, motivo] of Object.entries(isentas)) {
        if (!nomesDeSecao.has(nome)) {
          erros.push(`${pack}: _secoes-sem-skill isenta ${nome}, que não está no contrato`);
        } else if (citadas.has(nome)) {
          erros.push(`${pack}: _secoes-sem-skill isenta ${nome} e alguma skill a cita — ` +
            `apague a isenção`);
        } else if (!String(motivo || "").trim()) {
          erros.push(`${pack}: _secoes-sem-skill isenta ${nome} sem motivo`);
        }
      }
    }
  }

  /* ── E O PROMPT PÚBLICO, QUE É DERIVADO ────────────────────────────────
     A fonte é `prompts/<pack>.md`, com os blocos condicionais que a página
     do pack no site liga e desliga. O PROMPT.md é ela achatada em
     PROMPT_PADRAO: todas as tarefas, os dois regimes, marca nenhuma. A fonte
     morava no site até o D267.

     O aviso vai em COMENTÁRIO HTML: o GitHub não o renderiza, então quem
     abre a página do arquivo lê o prompt e não um banner de manutenção — e
     quem abre o arquivo cru, que é quem poderia editá-lo por engano, lê. */
  for (const pack of await packs()) {
    const fonte = join(PROMPTS, pack + ".md");
    const alvo = join(OFICINA, pack, "PROMPT.md");
    if (!existsSync(fonte)) continue;
    /* os comentários de manutenção saem: eles falam do parser e do balcão,
       que são coisas que o arquivo público não tem. */
    const bruto = (await readFile(fonte, "utf8")).replace(/<!--[\s\S]*?-->\s*/g, "");
    const tarefas = await tarefasDe(pack);
    const ligados = new Set(PROMPT_PADRAO.flatMap((id) =>
      id === "tarefas" ? tarefas.map((t) => "tarefa:" + t) : [id]));

    const conteudo =
      `<!-- ARQUIVO GERADO · não edite.\n\n` +
      `     A fonte é prompts/${pack}.md, e este arquivo sai dela\n` +
      `     por \`npm run oficina -- --escrever\`. Correção feita aqui é perdida na\n` +
      `     próxima geração. -->\n\n` +
      achatar(fatiar(bruto, `prompts/${pack}.md`), ligados) + "\n";

    const atual = existsSync(alvo) ? await readFile(alvo, "utf8") : null;
    if (atual === conteudo) { copias++; bytes += conteudo.length; continue; }
    if (!escrever) {
      erros.push(`${pack}/PROMPT.md: ` +
        (atual === null ? "sem cópia" : "a cópia divergiu da fonte"));
    } else {
      await writeFile(alvo, conteudo, "utf8");
      copias++;
      bytes += conteudo.length;
    }
  }

  return { erros, copias, bytes };
}

/**
 * O MOTOR NÃO FALA O OFÍCIO. Cada pack declara em `_proibido-no-motor` as
 * palavras dele, e nenhuma pode aparecer em `oficina/_motor/**` — nem em
 * exemplo, nem em cerca de código: exemplo é marca, e marca se resolve.
 * Medido antes da regra: 127 ocorrências em onze arquivos, e a partição por
 * seção parecia pronta. E o contrato montado não pode sair com marca de pé,
 * fora as de ambiente (`${CLAUDE_PLUGIN_ROOT}`, que é texto literal citado).
 *
 * ── O QUE ESTA RÉGUA NÃO PEGA, E POR QUE NÃO VALE A PENA ENSINÁ-LA ────
 * A busca é `includes`, sem fronteira de palavra, e isso é certo para o
 * vocabulário que a inaugurou: "imóve", "matrícula" e "creci" só existem
 * naquele ofício, e o prefixo é o que faz "imóve" pegar imóvel e imóveis.
 *
 * Ela NÃO escala para ofício cujo substantivo é palavra comum do português.
 * Medido no pack de prospecção, cujo `{item}` é "conta" e `{pessoa}` é
 * "contato": as duas aparecem 47 vezes em `_motor/**`, e nenhuma é o ofício
 * — "por conta própria", "não conta nada de novo", "a sua conta do WhatsApp",
 * "último contato", "/{plugin}:retomar-contato". Espalhadas por OITO
 * arquivos, em trinta formas distintas: nem fronteira de palavra (11 e 11
 * sobrevivem), nem isenção por arquivo (19 sobrevivem sem o
 * conectar-whatsapp.md), nem lista de exceções de trinta linhas — que seria
 * uma lista que ninguém relê.
 *
 * Então a regra do vocabulário é esta, e ela vale para o próximo pack:
 * **declare aqui só a palavra que não existe fora do ofício.** A que é
 * comum fica de fora COM O MOTIVO escrito no `_` do vocabulario.json, senão
 * a próxima mão a acrescenta de boa-fé e o `conferir` do repositório inteiro
 * passa a acusar quarenta e sete linhas corretas.
 */
export async function conferirMotor() {
  const erros = [];
  let palavras = 0;
  const lerTudo = async (dir) => {
    const saida = [];
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) saida.push(...(await lerTudo(p)));
      /* o MOLDE.md é o único arquivo do motor que FALA do ofício de
         propósito: ele explica a partição com o exemplo do primeiro pack, e
         quem o lê está escrevendo a fonte. Vigiá-lo obrigaria a explicar
         marca sem poder nomear uma. */
      else if (e.name.endsWith(".md") && e.name !== "MOLDE.md") {
        saida.push([p, await readFile(p, "utf8")]);
      }
    }
    return saida;
  };
  const textos = existsSync(MOTOR) ? await lerTudo(MOTOR) : [];
  for (const pack of await packs()) {
    const vocab = await vocabularioDe(pack);
    const proibidas = vocab["_proibido-no-motor"] || [];
    palavras += proibidas.length;
    for (const [p, t] of textos) {
      t.split("\n").forEach((linha, i) => {
        const l = linha.toLowerCase();
        for (const w of proibidas) {
          if (l.includes(w)) {
            erros.push(`_motor/${p.slice(MOTOR.length + 1).split(sep).join("/")}:${i + 1} tem “${w}” — no motor isso é marca, não palavra`);
            break;
          }
        }
      });
    }
    const montado = await montarContrato(pack);
    const escapadas = await marcasEscapadas(pack);
    for (const m of new Set((montado || "").match(RE_MARCA) || [])) {
      if (/^\{[A-Z_]+\}$/.test(m) || escapadas.has(m)) continue;
      erros.push(`${pack}/CONTRATO.md: a marca ${m} ficou de pé — falta no vocabulario.json`);
    }
    /* bloco condicional que não fechou, ou cuja marca divide a linha com
       outra coisa, não casa com a expressão e chega ao pack como texto. */
    const blocoDePe = (texto, onde) => {
      const m = (texto || "").match(/\[\[(?:se [^\]]*|fim)\]\]/);
      if (m) erros.push(`${onde}: ${m[0]} ficou de pé — as marcas de bloco ocupam a linha sozinhas, e todo [[se]] fecha com [[fim]]`);
    };
    blocoDePe(montado, `${pack}/CONTRATO.md`);
    for (const [nome, fonte] of await skillsDoMotorPara(vocab)) {
      blocoDePe(resolverMarcas(fonte, vocab), `_motor/skills/${nome}/SKILL.md (no pack ${pack})`);
    }

    /* ── E A MESMA COBRANÇA NAS SKILLS DO MOTOR ────────────────────────
       Marca de pé numa skill é pior que num contrato: o contrato é lido pelo
       agente, a skill é o COMANDO — `/{plugin}:` sem valor vira uma barra e
       uma chave na cara de quem instalou.

       O nome da pasta é conferido à parte porque ele não é texto: é caminho e
       é comando. `{pessoa}` que resolva para "Cliente Final" daria a pasta
       `compartilhar-com-Cliente Final`, que quebra no shell e no marketplace
       sem erro nenhum aqui. A regra é kebab-case, e ela vale para o vocabulário
       do próximo pack — que é quem vai descobrir isto tarde. */
    /* a recusa é declarada contra um nome de _motor/skills/, e ela apodrece
       calada: a skill muda de nome, a linha continua lá, e o pack volta a
       gerar o que tinha recusado sem ninguém ver. */
    const nomesDoMotor = new Set((await skillsDoMotor()).map(([n]) => n));
    for (const [nome, motivo] of Object.entries(vocab["_skills-do-motor-fora"] || {})) {
      if (!nomesDoMotor.has(nome)) {
        erros.push(`${pack}: _skills-do-motor-fora recusa “${nome}”, que não é ` +
          `uma skill de _motor/skills/`);
      } else if (!String(motivo || "").trim()) {
        erros.push(`${pack}: _skills-do-motor-fora recusa “${nome}” sem motivo — ` +
          `recusa sem motivo é a linha que ninguém sabe se ainda vale`);
      }
    }
    const secoesDoMotor = new Set((existsSync(MOTOR) ? await readdir(MOTOR) : [])
      .filter((n) => RE_NOME_SECAO.test(resolverMarcas(n, vocab))));
    for (const [nome, motivo] of Object.entries(vocab["_secoes-do-motor-fora"] || {})) {
      if (!secoesDoMotor.has(nome)) {
        erros.push(`${pack}: _secoes-do-motor-fora recusa “${nome}”, que não é ` +
          `uma seção de _motor/`);
      } else if (!String(motivo || "").trim()) {
        erros.push(`${pack}: _secoes-do-motor-fora recusa “${nome}” sem motivo`);
      }
    }
    for (const [nome, fonte] of await skillsDoMotorPara(vocab)) {
      const pasta = resolverMarcas(nome, vocab);
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(pasta)) {
        erros.push(`${pack}/skills/${pasta}: o nome da pasta saiu de _motor/skills/${nome} ` +
          `e não é kebab-case — a marca precisa resolver para minúsculas sem acento`);
      }
      for (const m of new Set((resolverMarcas(fonte, vocab).match(RE_MARCA) || []))) {
        if (/^\{[A-Z_]+\}$/.test(m)) continue;
        erros.push(`_motor/skills/${nome}/SKILL.md: a marca ${m} ficou de pé no pack ${pack}`);
      }
    }
  }
  return { erros, arquivos: textos.length, palavras };
}


/**
 * ── O PACK SINTÉTICO: A CONCORDÂNCIA QUE SÓ EXISTE DEPOIS DE GERAR ─────
 *
 * O preâmbulo do contrato manda escrever o motor de forma que a concordância
 * não dependa da marca, e o \`flexoesDe()\` deriva o ARTIGO a partir do gênero
 * declarado. O que nem um nem outro alcança é o ADJETIVO colado na marca:
 * "{pessoa} nenhum", "{pessoa} repetido", "{pessoa} aposentado". A fonte está
 * certa, a marca resolve, e o erro nasce na geração — que é a mesma classe de
 * defeito que o D200 pagou para as palavras e o {n-skills} pagou para o
 * número.
 *
 * Ele não apareceu nos dois primeiros packs por sorte: {item} é "imóvel" e
 * "conta", {pessoa} é "cliente" e "contato", e três dos quatro são
 * masculinos. O terceiro pack — {pessoa} = "paciente", "aluna", "hóspede" —
 * herdaria os pontos presos de uma vez, e a única régua que os pegou até aqui
 * foi eu lendo o pack gerado: o filtro automático que escrevi para achá-los
 * deixou passar SEIS DOS SETE que consertei.
 *
 * Esta régua gera o motor contra um vocabulário INVENTADO, nas duas variantes
 * de gênero, e olha o que ficou colado. Não chama modelo, não escreve nada,
 * roda em milissegundos.
 *
 * As palavras são sem gênero na terminação — \`zarvil\`, \`mirnal\` — de
 * propósito: assim a MESMA busca serve às duas variantes, e o que muda entre
 * elas é só o que o gerador derivou. E são impronunciáveis de propósito: uma
 * palavra plausível se confundiria com o texto ao redor no laudo.
 *
 * ── OS DOIS LADOS NÃO SÃO SIMÉTRICOS, E ISSO É DELIBERADO ─────────────
 * Na variante FEMININA, toda palavra vizinha terminada em -o/-os é suspeita,
 * menos uma lista de invariáveis: em português quase nada termina em -o sem
 * flexionar, então a heurística pega adjetivo novo sozinha.
 *
 * Na variante MASCULINA o mesmo truque não vale: -a é a terminação da terceira
 * pessoa do singular de todo verbo em -ar. Medido no motor, "entra", "cria",
 * "copia", "exporta", "menciona" e mais treze davam alarme. Esse lado vai por
 * LISTA FECHADA, e a lista mora aqui embaixo.
 */
const SINTETICO = {
  item: "zarvil", itens: "zarvis", "pasta-itens": "zarvis",
  pessoa: "mirnal", pessoas: "mirnais", "pasta-pessoas": "mirnais",
  /* {base} não entra na varredura de gênero: ela é feminina por contrato (ver
     `comBase`), e acusar "a vuldar" seria a régua cobrando o que o contrato
     decidiu não prometer. Entra aqui para a marca não ficar de pé. */
  base: "vuldar", Base: "Vuldar", bases: "vuldares", "pasta-base": "vuldar",
  plugin: "sintetico",
};

/* palavra terminada em -o que NÃO flexiona, ou que concorda com o que vem
   DEPOIS dela e não com a marca ("a zarvil do vazil"). */
const INVARIAVEIS = new Set([
  "não", "nao", "como", "dentro", "isso", "aquilo", "quando", "enquanto",
  "abaixo", "acima", "embaixo", "cedo", "logo", "zero", "apenas", "ou",
  /* os dois numerais em -o que não flexionam */
  "quatro", "oito",
  "do", "no", "ao", "pelo", "dos", "nos", "aos", "pelos", "o", "os",
]);
/* e o gerúndio, que é a outra família inteira: -ando, -endo, -indo. */
const GERUNDIO = /(?:a|e|i)ndo$/i;

/* o lado masculino, por lista: as flexionáveis na forma feminina. */
const FEMININAS = new Set([
  /* `dela` e `delas` NÃO entram: o possessivo concorda com o dono, e não
     com o que ele possui — "{o-item} dela" está certo nos dois gêneros. */
  "outra", "outras", "inteira", "inteiras", "mesma", "mesmas",
  "própria", "próprias", "primeira", "primeiras", "nova", "novas", "antiga",
  "antigas", "parada", "paradas", "repetida", "repetidas", "candidata",
  "candidatas", "aposentada", "aposentadas", "sozinha", "sozinhas", "certa",
  "certas", "toda", "todas", "uma", "umas", "essa", "essas", "esta", "estas",
  "aquela", "aquelas", "cuja", "cujas", "muita", "muitas", "pouca", "poucas",
  "ambas", "duas", "ligada", "ligadas", "vazia", "vazias", "cheia", "cheias",
  "aberta", "abertas", "fechada", "fechadas", "nenhuma", "alguma", "algumas",
  "várias", "meia", "última", "últimas", "próxima", "próximas", "mostrada",
  "mostradas", "achada", "achadas", "guardada", "guardadas", "escrita",
  "escritas", "lida", "lidas", "sua", "suas", "minha", "minhas",
]);

const PALAVRA = "[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ-]*";
const RE_ANTES = new RegExp("(" + PALAVRA + ")\\s*$");
const RE_DEPOIS = new RegExp("^\\s*(" + PALAVRA + ")");

/** o vocabulário sintético de uma variante, com o resto das marcas preenchido */
export function vocabularioSintetico(textos, genero, etapaDe = "pessoa") {
  const base = comAndante("sintético", { ...SINTETICO, "item-genero": genero,
    "pessoa-genero": genero, "etapa-de": etapaDe });
  const vocab = { ...flexoesDe(base), ...base };
  /* toda marca que o motor usa e que não é do gênero ganha um valor visível.
     Ele não participa da concordância — o que se mede é o texto AO REDOR das
     palavras do gênero —, e sem ele a marca ficaria de pé e a régua acusaria
     um defeito que é dela. */
  for (const texto of textos) {
    for (const m of texto.matchAll(RE_MARCA)) {
      if (!m[1].startsWith("_") && !(m[1] in vocab)) vocab[m[1]] = "«" + m[1] + "»";
    }
  }
  return vocab;
}

export async function conferirSintetico() {
  const erros = [];
  const fontes = [];
  const andar = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) await andar(p);
      else if (e.name.endsWith(".md") && e.name !== "MOLDE.md") {
        fontes.push([p.slice(MOTOR.length + 1).split(sep).join("/"),
          await readFile(p, "utf8")]);
      }
    }
  };
  if (existsSync(MOTOR)) await andar(MOTOR);

  const alvos = ["zarvil", "zarvis", "mirnal", "mirnais"];
  const RE_ALVO = new RegExp("\\b(" + alvos.join("|") + ")\\b", "g");
  let pontos = 0;

  /* quatro passadas, e não duas: o bloco `[[se etapa-de:item]]` é texto que
     só existe num dos ramos, e adjetivo preso dentro dele só aparece se o
     ramo for gerado. O mesmo ponto acusado nos dois ramos sai uma vez só. */
  const vistos = new Set();
  for (const etapaDe of ["pessoa", "item"])
  for (const genero of ["f", "m"]) {
    const vocab = vocabularioSintetico(fontes.map(([, t]) => t), genero, etapaDe);
    for (const [nome, bruto] of fontes) {
      const texto = resolverMarcas(bruto, vocab);
      /* marca de pé no sintético é defeito do PREENCHIMENTO, não do motor —
         mas se aparecer, a varredura abaixo está lendo texto pela metade. */
      texto.split("\n").forEach((linha, i) => {
        for (const m of linha.matchAll(RE_ALVO)) {
          const antes = linha.slice(0, m.index).match(RE_ANTES);
          const depois = linha.slice(m.index + m[0].length).match(RE_DEPOIS);
          for (const [lado, achado] of [["antes", antes], ["depois", depois]]) {
            if (!achado) continue;
            const w = achado[1];
            const b = w.toLowerCase();
            const presa = genero === "f"
              ? /(o|os)$/i.test(w) && !INVARIAVEIS.has(b) && !GERUNDIO.test(b)
              : FEMININAS.has(b);
            if (!presa) continue;
            /* a linha muda de número entre os ramos, porque o bloco que sai
               leva as linhas dele: a chave é o TEXTO, não a posição. */
            const chave = nome + "|" + w + "|" + lado + "|" + linha.trim();
            if (vistos.has(chave)) continue;
            vistos.add(chave);
            pontos++;
            erros.push("_motor/" + nome + ":" + (i + 1) + ": “" + w + "” " +
              (lado === "antes" ? "antes de" : "depois de") + " {" +
              (m[1].startsWith("z") ? "item" : "pessoa") + "} — " +
              "concorda com o gênero, e a marca não tem um. " + linha.trim().slice(0, 90));
          }
        }
      });
    }
  }
  return { erros, arquivos: fontes.length, pontos };
}

/* ── O FRONTMATTER, do jeito que o padrão o escreve ───────────────────
   `>-` dobra as linhas com espaço e tira a quebra final: é assim que a
   Skills API mede os 1.024 da description, e é assim que se mede aqui. */
function frontmatterDe(corpo) {
  const m = corpo.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  const campos = {};
  let chave = null, dobra = false;
  /* CRLF: um checkout no Windows devolve o arquivo assim, e o `` que
     sobrava no fim de cada linha derrubava o dobramento YAML — a skill
     reprovava por `sem description` com a description inteira na tela. */
  for (const linha of m[1].split(/\r?\n/)) {
    const k = linha.match(/^([\w-]+):\s*(.*)$/);
    if (k && !linha.startsWith(" ")) {
      chave = k[1];
      dobra = /^[>|]-?$/.test(k[2].trim());
      campos[chave] = dobra ? "" : k[2].trim();
    } else if (chave && dobra) {
      campos[chave] = (campos[chave] ? campos[chave] + " " : "") + linha.trim();
    }
  }
  return campos;
}

/**
 * OS TETOS E O MOLDE DE UMA SKILL. Os três números são os que mordem: 1.024
 * e 500 são o teto duro da Skills API para `description` e `compatibility`
 * (uma vírgula a mais recusa o upload — cinco descriptions estavam a menos
 * de 16 caracteres disso); 45.000 no SKILL.md é "não cresce" — a maior tem
 * 41 mil, e o alvo de 25 mil deixaria oito das catorze vermelhas, o que é
 * dívida a pagar skill a skill, não alarme.
 *
 * O molde é o que todas têm em comum e o que um pack novo precisa ter para
 * o resto do contrato funcionar: os quatro campos, uma seção "Antes de tudo",
 * uma "O modo", uma "Onde ela para", e o fecho com `## Guardei` antes de
 * `## Falta saber` (contrato §10). Está escrito em `oficina/_motor/MOLDE.md`.
 */
const TETO_SKILL = 45000, TETO_DESCRIPTION = 1024, TETO_COMPATIBILITY = 500;
export async function conferirSkills() {
  const erros = [];
  let skills = 0;
  const doMotor = new Set((await skillsDoMotor()).map(([n]) => n));
  for (const pack of await packs()) {
    const vocabPack = await vocabularioDe(pack);
    for (const [nome] of await skillsDoMotor()) {
      doMotor.add(resolverMarcas(nome, vocabPack));
    }
    for (const skill of await skillsDe(pack)) {
      skills++;
      const onde = `${pack}/${skill}/SKILL.md`;
      const corpo = await readFile(join(OFICINA, pack, "skills", skill, "SKILL.md"), "utf8");
      const fm = frontmatterDe(corpo);
      if (!fm) { erros.push(`${onde}: sem frontmatter`); continue; }
      for (const campo of ["name", "description", "compatibility", "allowed-tools"]) {
        if (!fm[campo]) erros.push(`${onde}: sem \`${campo}\` no frontmatter`);
      }
      if (fm.name && fm.name !== skill) erros.push(`${onde}: name “${fm.name}” não é o nome da pasta`);
      const n = (t) => [...(t || "")].length;
      if (n(fm.description) > TETO_DESCRIPTION) erros.push(`${onde}: description com ${n(fm.description)} caracteres, teto ${TETO_DESCRIPTION}`);
      if (n(fm.compatibility) > TETO_COMPATIBILITY) erros.push(`${onde}: compatibility com ${n(fm.compatibility)} caracteres, teto ${TETO_COMPATIBILITY}`);
      if (n(corpo) > TETO_SKILL) erros.push(`${onde}: ${n(corpo)} caracteres, teto ${TETO_SKILL}`);
      for (const [rotulo, re] of [["Antes de tudo", /^#+ .*Antes de tudo/m],
                                  ["O modo", /^#+ .*O modo/m],
                                  ["Onde ela para", /^#+ .*Onde ela para/m]]) {
        if (!re.test(corpo)) erros.push(`${onde}: sem a seção “${rotulo}” do molde`);
      }
      /* ancorado em começo de linha, e não `indexOf`: as dez citam
         “vira uma linha em `## Falta saber`” no meio da prosa, e a busca solta
         achava a citação antes do título — duas skills acusadas de ter o fecho
         fora de ordem quando o defeito era da régua. */
      const g = corpo.search(/^## Guardei\r?$/m), f = corpo.search(/^## Falta saber\r?$/m);
      if (g < 0 || f < 0) erros.push(`${onde}: o fecho precisa de \`## Guardei\` e \`## Falta saber\``);
      else if (f < g) erros.push(`${onde}: \`## Falta saber\` aparece antes de \`## Guardei\``);

      /* ── MARCA DE PÉ NUMA SKILL PRÓPRIA ────────────────────────────
         Skill do MOTOR é gerada e tem as marcas resolvidas; skill PRÓPRIA do
         pack é fonte, e ninguém a resolve. Escrevi as três de prospecção com
         marca, como se fossem geradas, e vinte e oito chegaram ao disco
         inteiras — `{exemplo-mensagem}` no lugar do exemplo, `{plugin}` no
         lugar do comando. A régua dos tetos não via, porque o arquivo estava
         dentro do teto.

         O cabeçalho das geradas fica de fora: ele EXPLICA o mecanismo, e para
         isso precisa nomear uma marca. */
      if (!doMotor.has(skill)) {
        for (const m of new Set(corpo.match(RE_MARCA) || [])) {
          if (/^\{[A-Z_]+\}$/.test(m)) continue;
          erros.push(`${onde}: a marca ${m} ficou de pé — skill própria do ` +
            `pack é fonte, e ninguém a resolve. Escreva o valor`);
        }
      }
    }
  }
  return { erros, skills };
}

/**
 * O ATRASO DO REPOSITÓRIO PÚBLICO, medido contra a árvore do GitHub. O sha
 * de blob é o do git — `sha1("blob " + tamanho + "\0" + bytes)` —, então
 * comparar não precisa de clone. Sem rede, ou com a API recusando, devolve
 * `pulou` com o motivo e o `conferir` imprime ○ em vez de ✗: o atraso é
 * esperado enquanto se trabalha, e o alarme existe para a hora de publicar.
 */
export const REPOSITORIO_PUBLICO = "kapstanhq/oficina";

/**
 * O QUE NÃO SOBE, e por que a lista existe.
 *
 * O `publicar-oficina` espelhava `oficina/` INTEIRO — tudo que estivesse no
 * diretório na hora, sem critério nenhum —, e o `conferirPublicacao` comparava
 * a mesma árvore inteira. Nenhum dos dois tinha lista, e por isso nenhum dos
 * dois tinha como excluir nada.
 *
 * O risco deixou de ser teórico nesta sessão: a geração passou a escrever por
 * `.tmp` + rename (ver `writeFile` no topo), e um processo morto no meio deixa
 * um `.tmp` dentro de `oficina/<pack>/skills/…/references/`. Com o espelho
 * cru ele ia ao repositório público, e o `conferir` diria que está tudo em dia.
 *
 * ── E O QUE **SOBE**, QUE É O RESTO ────────────────────────────────────
 * `_motor/`, `<pack>/contrato/` e `<pack>/exemplos/` são FONTE DE GERAÇÃO e
 * não são instaláveis — 111 arquivos, 306 kB, que o `/plugin install` não
 * abre. Eles sobem assim mesmo, e a razão é o D145: **é o fork que faz a
 * fonte de terceiro existir**, e um fork sem a fonte não regenera nada — ele
 * teria de editar 251 cópias geradas à mão, que é exatamente o modo de falha
 * que este script inteiro existe para impedir.
 *
 * Se um dia a escolha for outra — o público levando só o instalável —, ela é
 * uma linha aqui: `"_motor/**", "*​/contrato/**", "*​/exemplos/**"`. O que a
 * decisão custa está medido acima, e é o fork.
 */
export const NAO_PUBLICA = [
  "**/*.tmp",        // o rename atômico da geração, se o processo morrer no meio
  "**/.DS_Store", "**/Thumbs.db",
  "**/*.log",
];

/* glob simples: `**` atravessa barra, `*` não. É o mesmo desenho do
   `globRe` da prova, e as duas listas são pequenas o bastante para não
   valerem uma dependência. */
const globRe = (g) => {
  let re = "";
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === "*") {
      if (g[i + 1] === "*") { re += ".*"; i++; } else re += "[^/]*";
    } else if ("\\^$.|?+()[]{}".includes(c)) re += "\\" + c;
    else re += c;
  }
  return new RegExp("^" + re + "$");
};
const FORA = NAO_PUBLICA.map(globRe);
export const publicavel = (rel) => !FORA.some((re) => re.test(rel.split(sep).join("/")));
/* CRLF vira LF, e só isso: arquivo binário não passa por aqui porque a
   `oficina/` é markdown, JSON e texto. Um `\r` sozinho, sem `\n` atrás, fica
   como está — ele é conteúdo, não fim de linha. */
const normalizar = (b) => {
  const i = b.indexOf(0x0d);
  return i < 0 ? b : Buffer.from(b.toString("binary").replace(/\r\n/g, "\n"), "binary");
};

export async function conferirPublicacao() {
  const { createHash } = await import("node:crypto");
  const locais = new Map();
  const andar = async (dir, rel) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name), r = rel ? rel + "/" + e.name : e.name;
      if (e.isDirectory()) await andar(p, r);
      else if (!publicavel(r)) continue;
      else {
        // O sha é o do BLOB DO GIT, e o git guarda LF. Com `core.autocrlf`
        // ligado — o padrão no Windows — o disco tem CRLF, e comparar os bytes
        // crus acusava divergência em todo arquivo que o git tivesse escrito no
        // checkout. Medido: 16 acusados logo DEPOIS de publicar, com o
        // `publicar-oficina` (que passa pelo git) dizendo que estava tudo
        // igual. Os dois estavam certos; era a régua que media outra coisa.
        const bytes = normalizar(await readFile(p));
        locais.set(r, createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex"));
      }
    }
  };
  await andar(OFICINA, "");
  let arvore;
  try {
    const r = await fetch(`https://api.github.com/repos/${REPOSITORIO_PUBLICO}/git/trees/main?recursive=1`,
      { headers: { "User-Agent": "kapstan-conferir" }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return { pulou: `a API do GitHub respondeu ${r.status}` };
    arvore = await r.json();
  } catch (e) {
    return { pulou: `sem rede (${e.name})` };
  }
  const publicos = new Map(arvore.tree.filter((t) => t.type === "blob").map((t) => [t.path, t.sha]));
  const faltam = [...locais.keys()].filter((p) => !publicos.has(p));
  const diferem = [...locais].filter(([p, sha]) => publicos.has(p) && publicos.get(p) !== sha).map(([p]) => p);
  const sobram = [...publicos.keys()].filter((p) => !locais.has(p));
  return { faltam, diferem, sobram, total: locais.size };
}

const kb = (n) => (n / 1024).toFixed(1) + " kB";

/* a CLI roda só quando este arquivo é o EXECUTADO. Importado, ele não imprime
   nada e não sai. */
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const { erros, copias, bytes } =
    await conferirOficina({ escrever: process.argv.includes("--escrever") });

  /* cópia divergida não cala as outras três réguas: quem mexe no motor quer
     saber, na mesma passada, se quebrou a cópia E se deixou marca de pé. A CLI
     saía no primeiro erro, e o resto só aparecia depois de um `--escrever`. */
  for (const e of erros) console.log(`✗ ${e}`);
  if (erros.length) {
    console.log(`✗ oficina · ${erros.length} problema(s) — rode \`npm run oficina -- --escrever\``);
  } else {
    console.log(`✓ oficina · ${copias} cópias em dia · ${kb(bytes)} no total`);
  }
  const motor = await conferirMotor();
  for (const e of motor.erros) console.log(`✗ ${e}`);
  console.log(`${motor.erros.length ? "✗" : "✓"} motor · ${motor.arquivos} arquivos sem palavra do ofício`);
  const sk = await conferirSkills();
  for (const e of sk.erros) console.log(`✗ ${e}`);
  console.log(`${sk.erros.length ? "✗" : "✓"} skills · ${sk.skills} dentro dos tetos e do molde`);
  const sin = await conferirSintetico();
  for (const e of sin.erros) console.log(`✗ ${e}`);
  console.log(`${sin.erros.length ? "✗" : "✓"} sintético · ${sin.arquivos} arquivos gerados nos dois gêneros`);
  if (erros.length || motor.erros.length || sk.erros.length || sin.erros.length) process.exit(1);
}
