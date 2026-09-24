/**
 * O VIGIA — o servidor MCP se atualiza sem fechar o Claude.
 *
 * ── O DEFEITO QUE ISTO FECHA ───────────────────────────────────────────
 * O servidor do painel é um processo que o CLAUDE abre e segura pela sessão
 * inteira, e Node não recarrega módulo: mudou uma linha, a versão de pé é a
 * velha até alguém fechar e reabrir a sessão. O fundador pediu isso três vezes
 * em dois dias, e a cada vez a instrução era "feche o Claude".
 *
 * O vigia fica ENTRE o Claude e o servidor. Ele é o processo que o `.mcp.json`
 * declara, segura o stdio, e abre o servidor de verdade como filho. Arquivo
 * mudou → o filho é trocado por um novo, e o Claude nem fica sabendo: a
 * conexão dele é com o vigia, que não caiu.
 *
 *     Claude ⇄ vigia (este arquivo, não muda) ⇄ servidor.mjs (troca à vontade)
 *
 * ── TRÊS CUIDADOS, E CADA UM JÁ FOI UM DEFEITO EM ALGUM LUGAR ──────────
 *   SÓ TROCA OCIOSO   um `painel_esperar` pendurado é uma pessoa no meio de
 *                     uma tela. A troca espera todo pedido em curso voltar.
 *   REFAZ O APERTO    o filho novo não viu o `initialize` — o vigia guardou a
 *   DE MÃO            linha, reenvia, e ENGOLE a resposta: para o Claude,
 *                     responder duas vezes ao mesmo pedido é erro de protocolo.
 *   FILHO QUE NÃO     arquivo salvo pela metade não sobe. O vigia não entra
 *   SOBE NÃO É LAÇO   em laço de reinício: responde erro ao que chegar e
 *                     espera a PRÓXIMA mudança de arquivo para tentar de novo.
 *
 * E dois que o D234 acrescentou, os dois achados relendo este arquivo:
 *   UMA TROCA         o `oficina -- --escrever` grava dezenas de arquivos, e
 *   POR VEZ           uma mudança no meio da troca subia um SEGUNDO filho — o
 *                     primeiro ficava órfão, segurando a porta. A que chega
 *                     no meio espera o filho novo ficar pronto.
 *   OCUPADO FORA      o vigia só vê os pedidos que passam por ele. O
 *   DO STDIO          assistente que o botão lançou e a chamada de um hóspede
 *                     correm por outra porta — trocado no meio, o servidor
 *                     deixava a execução sem dono, sem Parar e sem custo. O
 *                     servidor avisa (`AVISO_DE_OCUPADO`), e o vigia espera.
 *
 * Depois da troca ele avisa `notifications/tools/list_changed`: ferramenta
 * nova aparece sem reconectar. O servidor só declara essa capacidade quando
 * roda vigiado (`KAPSTAN_VIGIADO`), porque sem o vigia a lista não muda mesmo.
 *
 * ── O QUE ELE NÃO VIGIA ────────────────────────────────────────────────
 * `painel.html` — a página é lida do disco a cada pedido, e trocar o processo
 * por causa dela derrubaria a aba à toa. Nem `app/`, que é fonte da página, nem
 * prova, nem fixture. E ele NÃO se vigia: mudar este arquivo pede, aí sim,
 * reconectar o servidor no Claude (`/mcp`).
 *
 * Uso: `node vigia.mjs <servidor.mjs> [argumentos do servidor…]`
 */
import { spawn } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { createInterface } from "node:readline";
import { basename, dirname, join, resolve } from "node:path";

const [alvo, ...resto] = process.argv.slice(2);
if (!alvo) {
  process.stderr.write("uso: node vigia.mjs <servidor.mjs> [argumentos]\n");
  process.exit(1);
}
const SERVIDOR = resolve(alvo);
const nome = basename(dirname(SERVIDOR));
const dizer = (...p) => process.stderr.write(`[vigia · ${nome}] ${p.join(" ")}\n`);

/* os três servidores de um pack são irmãos e se importam (`conectores` e
   `documentos` usam o núcleo do painel, o painel abre a porta dos conectores e
   a prévia dos documentos): mudança num vale para os outros, e o vigia de cada
   um olha as três pastas */
const RAIZ = dirname(dirname(SERVIDOR));
const PASTAS = ["painel", "conectores", "documentos"].map((p) => join(RAIZ, p)).filter(existsSync);
const INTERESSA = (arquivo) => {
  const a = String(arquivo || "").replace(/\\/g, "/");
  if (!/\.(mjs|json)$/.test(a)) return false;
  if (/(^|\/)(app|_prova-base|node_modules)\//.test(a)) return false;
  if (/(^|\/)(prova[^/]*\.mjs|vigia\.mjs)$/.test(a)) return false;
  return true;
};

/* o mesmo nome de `avisarOcupado`, em `protocolo.mjs` */
const AVISO_DE_OCUPADO = "notifications/kapstan/ocupado";

let filho = null;
let pronto = false;            // o filho já passou pelo aperto de mão
let trocaPedida = false;
let trocando = false;          // do velho morrendo até o novo ficar pronto
let ocupadoPeloFilho = false;  // trabalho que o filho faz fora do stdio
let parado = false;            // o filho caiu sozinho: espera mudança de arquivo
let reinicios = 0;
let linhaDoInitialize = "";
let linhaDoInitialized = "";
const emCurso = new Set();     // ids de pedidos do Claude ainda sem resposta
const engolir = new Set();     // ids dos `initialize` que o vigia mesmo mandou
const represados = [];         // linhas do Claude que chegaram durante a troca
const ocioso = () => !emCurso.size && !ocupadoPeloFilho;

const paraOClaude = (obj) => process.stdout.write(JSON.stringify(obj) + "\n");
const paraOFilho = (linha) => { try { filho?.stdin.write(linha + "\n"); } catch { /* filho morrendo */ } };

function subir() {
  pronto = false;
  parado = false;
  ocupadoPeloFilho = false;
  filho = spawn(process.execPath, [SERVIDOR, ...resto], {
    stdio: ["pipe", "pipe", "inherit"],
    env: { ...process.env, KAPSTAN_VIGIADO: "1", ...(reinicios ? { KAPSTAN_REINICIO: "1" } : {}) },
  });
  const meu = filho;
  createInterface({ input: meu.stdout }).on("line", (linha) => {
    if (meu !== filho || !linha.trim()) return;
    let msg = null;
    try { msg = JSON.parse(linha); } catch { /* não é JSON: passa como veio */ }
    if (msg?.method === AVISO_DE_OCUPADO) {
      ocupadoPeloFilho = Boolean(msg.params?.ocupado);
      if (trocaPedida && ocioso()) trocar();
      return;
    }
    if (msg && engolir.has(msg.id)) {
      engolir.delete(msg.id);
      if (linhaDoInitialized) paraOFilho(linhaDoInitialized);
      ficarPronto();
      paraOClaude({ jsonrpc: "2.0", method: "notifications/tools/list_changed" });
      return;
    }
    if (msg && msg.id !== undefined && !msg.method) emCurso.delete(msg.id);
    process.stdout.write(linha + "\n");
    if (trocaPedida && ocioso()) trocar();
  });
  meu.on("exit", (codigo) => {
    if (meu !== filho) return;                 // era o velho, saindo por ordem nossa
    filho = null;
    pronto = false;
    parado = true;
    trocando = false;
    ocupadoPeloFilho = false;
    dizer(`o servidor saiu sozinho (${codigo}) — espero a próxima mudança de arquivo para subir de novo`);
    responderErroAoQueEspera();
  });

  if (reinicios && linhaDoInitialize) {
    /* o aperto de mão refeito, com um id que é só nosso */
    const id = `vigia-${reinicios}`;
    engolir.add(id);
    paraOFilho(JSON.stringify({ ...JSON.parse(linhaDoInitialize), id }));
  } else {
    ficarPronto();
  }
}

function ficarPronto() {
  pronto = true;
  trocando = false;
  while (represados.length) encaminhar(represados.shift());
  if (trocaPedida && ocioso()) trocar();
}

function responderErroAoQueEspera() {
  const erro = { code: -32000, message: "o servidor está reiniciando — tente de novo em instantes" };
  for (const id of emCurso) paraOClaude({ jsonrpc: "2.0", id, error: erro });
  emCurso.clear();
  for (const linha of represados.splice(0)) {
    try { const m = JSON.parse(linha); if (m.id !== undefined && m.method) paraOClaude({ jsonrpc: "2.0", id: m.id, error: erro }); }
    catch { /* linha torta não tem a quem responder */ }
  }
}

function trocar() {
  if (trocando) { trocaPedida = true; return; }
  trocaPedida = false;
  trocando = true;
  reinicios++;
  dizer(`arquivo mudou — troco o servidor (${reinicios}ª vez)`);
  const velho = filho;
  filho = null;
  pronto = false;
  /* a porta HTTP é do filho: o novo só sobe depois de o velho soltar */
  if (velho) { velho.once("exit", subir); velho.kill(); } else subir();
}

function encaminhar(linha) {
  let msg = null;
  try { msg = JSON.parse(linha); } catch { /* o servidor que reclame */ }
  if (msg?.method === "initialize") linhaDoInitialize = linha;
  if (msg?.method === "notifications/initialized") linhaDoInitialized = linha;
  if (parado) {
    if (msg?.id !== undefined && msg.method) {
      paraOClaude({ jsonrpc: "2.0", id: msg.id,
        error: { code: -32000, message: "o servidor não subiu depois da última mudança — confira o arquivo salvo" } });
    }
    return;
  }
  if (!pronto) { represados.push(linha); return; }
  if (msg?.id !== undefined && msg.method) emCurso.add(msg.id);
  paraOFilho(linha);
}

/* ── A VIGIA ──────────────────────────────────────────────────────────
   Um editor grava em rajada (temporário, renomeia, toca a data): 400 ms de
   silêncio é o que separa uma gravação de quatro eventos. */
let relogio = null;
for (const pasta of PASTAS) {
  try {
    watch(pasta, { recursive: true }, (_evento, arquivo) => {
      if (!INTERESSA(arquivo)) return;
      clearTimeout(relogio);
      relogio = setTimeout(() => {
        if (trocando) { trocaPedida = true; dizer("arquivo mudou no meio da troca — troco de novo quando o novo estiver pronto"); }
        else if (parado || ocioso()) trocar();
        else { trocaPedida = true; dizer("arquivo mudou — troco quando o trabalho em curso terminar"); }
      }, 400);
    });
  } catch (e) {
    dizer(`não consegui vigiar ${pasta} (${e?.message || e}) — sigo sem recarga automática`);
  }
}

createInterface({ input: process.stdin }).on("line", (linha) => { if (linha.trim()) encaminhar(linha); })
  .on("close", () => { filho?.kill(); process.exit(0); });
process.on("SIGTERM", () => { filho?.kill(); process.exit(0); });

subir();
