/**
 * O COFRE — o que o HUMANO escreveu, e só ele: o que está ligado, as chaves
 * e os tetos.
 *
 * ── POR QUE ISTO NÃO MORA NA BASE DA PESSOA ────────────────────────────
 * A base é de UM ofício, e o que está aqui é da MÁQUINA: quem instala dois
 * packs tem dois servidores de conectores de pé, e o teto de um serviço pago
 * é um só. Por isso o diretório é `~/.kapstan/conectores/`, irmão do
 * `~/.kapstan/whatsapp-reader/` — e por isso nada aqui é guardado em memória
 * entre duas chamadas: o outro processo pode ter escrito no meio.
 *
 * ── E POR QUE NENHUMA FERRAMENTA MCP ESCREVE AQUI ──────────────────────
 * Quem escreve neste diretório é a CLI de `servidor.mjs`, que é o humano
 * digitando. O agente que pudesse subir o próprio teto não teria teto — é a
 * mesma razão de o `nao-contatar` da ponte do WhatsApp ser subcomando e não
 * ferramenta.
 */
import { readFile, writeFile, rename, mkdir, chmod } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

/* a variável existe para a prova, que não pode encostar no cofre de verdade */
export const diretorio = () =>
  process.env.KAPSTAN_CONECTORES_DIR || join(homedir(), ".kapstan", "conectores");

/* ── ESCREVER É .tmp + rename ─────────────────────────────────────────
   A mesma regra do `scripts/oficina.mjs`, pela mesma razão: no Windows um
   `writeFile` direto disputa o descritor com quem estiver lendo, e um
   processo morto no meio deixa meio JSON — que na próxima leitura vira
   "nenhum teto escrito", o pior modo de falhar de um arquivo de tetos. */
async function gravar(nome, valor, { secreto = false } = {}) {
  const dir = diretorio();
  await mkdir(dir, { recursive: true });
  const p = join(dir, nome);
  await writeFile(p + ".tmp", JSON.stringify(valor, null, 2) + "\n", "utf8");
  /* 600 onde o sistema tem o conceito. No Windows o chmod não restringe
     nada e não falha — a proteção ali é a do perfil do usuário. */
  if (secreto) await chmod(p + ".tmp", 0o600).catch(() => {});
  await rename(p + ".tmp", p);
}

/* JSON ilegível NÃO vira objeto vazio em silêncio: um `tetos.json` quebrado
   lido como `{}` transformaria "teto de 5" em "sem teto", e a recusa que o
   agente veria mandaria a pessoa escrever um teto que ela já escreveu. */
async function ler(nome) {
  const p = join(diretorio(), nome);
  if (!existsSync(p)) return {};
  try {
    const v = JSON.parse(await readFile(p, "utf8"));
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  } catch (e) {
    throw new Error(`${p} não é JSON legível (${e.message}) — conserte ou apague o arquivo`);
  }
}

export const lerLigados = () => ler("estado.json");
export const lerChaves = () => ler("chaves.json");
export const lerTetos = () => ler("tetos.json");

/* ── DE QUE PORTA VEIO O GESTO ────────────────────────────────────────
   `terminal` ou `painel`. São as duas portas em que quem está do outro lado
   é a PESSOA, e o registro as distingue porque a pergunta "quem ligou isto?"
   tem duas respostas possíveis e nenhuma delas é o agente. O padrão é
   `terminal` para a CLI não precisar dizer o que sempre foi.

   Quem LÊ isto é gente abrindo o arquivo, e não o código: `lerLigados` só
   pergunta se a chave existe. Campo novo aqui não muda decisão nenhuma. */
const DE_ONDE = (por) => (por === "painel" ? "painel" : "terminal");

export async function ligar(nome, ligado, por) {
  const e = await lerLigados();
  if (ligado) e[nome] = { ligado_em: new Date().toISOString(), por: DE_ONDE(por) };
  else delete e[nome];
  await gravar("estado.json", e);
}

export async function guardarChave(nome, chave) {
  const c = await lerChaves();
  if (chave) c[nome] = chave; else delete c[nome];
  await gravar("chaves.json", c, { secreto: true });
}

/* `chaves.json` é nome → chave, uma string, e continua sendo: pôr a
   procedência ao lado viraria nome → objeto, e o que lê isto é o adaptador,
   que passa o valor adiante como token. Um campo a mais ali seria um token
   quebrado em toda chamada paga. */

export async function escreverTeto(nome, mes, por) {
  const t = await lerTetos();
  t[nome] = { mes, em: new Date().toISOString(), por: DE_ONDE(por) };
  await gravar("tetos.json", t);
}
