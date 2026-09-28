/**
 * A VERSÃO NOVA (D281) — quem instalou fica sabendo que há outra, e o
 * assistente atualiza por ele.
 *
 * ── O DEFEITO QUE ISTO FECHA ───────────────────────────────────────────
 * Marketplace de terceiros não se atualiza sozinho no Claude Code. Quem
 * instalou a 0.3.0 continuava nela na 0.3.3, sem saber que havia conserto —
 * e o único jeito de saber era ler o GitHub.
 *
 * ── O QUE ELE FAZ ──────────────────────────────────────────────────────
 * Compara a versão do `plugin.json` instalado com a do mesmo arquivo no
 * repositório público, uma vez a cada doze horas, e AVISA uma vez por dia.
 * O aviso leva os dois comandos que o assistente roda por conta própria —
 * a pessoa só diz sim e reabre o programa.
 *
 * ── E O QUE ELE NÃO FAZ ────────────────────────────────────────────────
 * Não atualiza: atualizar é trocar o código que roda, e isso passa por um
 * sim da pessoa. Não confere cópia que não veio do marketplace — quem roda
 * com `--plugin-dir` está na árvore-fonte, e a versão dela é a que ele está
 * escrevendo. E não derruba nada: rede fora, GitHub lento ou arquivo torto
 * viram silêncio, nunca erro no `painel_inicio`.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const DOZE_HORAS = 12 * 60 * 60 * 1000;
const TEMPO_DA_REDE = 4000;

/**
 * De onde este pack foi instalado, pelo caminho: o Claude Code guarda cada
 * plugin em `~/.claude/plugins/cache/<marketplace>/<plugin>/<versão>`.
 * Fora dali, `null` — não veio do marketplace, e não há o que atualizar.
 */
export function origemDoPack(pastaDoPack) {
  const partes = String(pastaDoPack || "").split(/[\\/]+/).filter(Boolean);
  const i = partes.lastIndexOf("cache");
  if (i < 1 || partes[i - 1] !== "plugins" || partes.length < i + 4) return null;
  return { marketplace: partes[i + 1], plugin: partes[i + 2] };
}

/** "0.10.1" > "0.9.9": número a número, e não como texto */
export function maisNova(a, b) {
  const pa = String(a || "").split(".").map((n) => parseInt(n, 10) || 0);
  const pb = String(b || "").split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0);
  }
  return false;
}

/** `https://github.com/dono/repo` → o `plugin.json` do pack na ponta do ramo principal */
export function enderecoPublicado(repositorio, plugin) {
  const m = /github\.com[/:]([^/]+)\/([^/#?]+?)(?:\.git)?\/?$/.exec(String(repositorio || ""));
  if (!m || !plugin) return "";
  return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/HEAD/${plugin}/.claude-plugin/plugin.json`;
}

const hojeDe = (ms) => new Date(ms).toISOString().slice(0, 10);

/**
 * Confere e decide se avisa.
 *
 * @returns {Promise<null | { instalada, nova, comandos: string[], faca: string }>}
 *   `null` quando não há o que dizer: está em dia, não veio do marketplace,
 *   já avisou hoje, ou não deu para saber.
 */
export async function conferirVersao({
  pastaDoPack, pastaDeEstado, buscar = fetch, agora = Date.now,
} = {}) {
  try {
    const origem = origemDoPack(pastaDoPack);
    if (!origem || !pastaDeEstado) return null;
    const local = JSON.parse(await readFile(join(pastaDoPack, ".claude-plugin", "plugin.json"), "utf8"));
    const arquivo = join(pastaDeEstado, `versao-${origem.plugin}.json`);
    const guardado = await readFile(arquivo, "utf8").then(JSON.parse).catch(() => ({}));
    const t = agora();

    let publicada = guardado.publicada;
    if (!publicada || !(t - (guardado.conferidoEm || 0) < DOZE_HORAS)) {
      const url = enderecoPublicado(local.repository?.url || local.repository, origem.plugin);
      if (!url) return null;
      const r = await buscar(url, { signal: AbortSignal.timeout(TEMPO_DA_REDE) });
      if (!r.ok) return null;
      publicada = JSON.parse(await r.text()).version;
      guardado.publicada = publicada;
      guardado.conferidoEm = t;
    }

    const ha = maisNova(publicada, local.version);
    const avisar = ha && guardado.avisadoEm !== hojeDe(t);
    if (avisar) guardado.avisadoEm = hojeDe(t);
    await mkdir(pastaDeEstado, { recursive: true });
    await writeFile(arquivo, JSON.stringify(guardado) + "\n", "utf8");
    if (!avisar) return null;

    const id = `${origem.plugin}@${origem.marketplace}`;
    const comandos = [
      `claude plugin marketplace update ${origem.marketplace}`,
      `claude plugin update ${id}`,
    ];
    return {
      instalada: local.version,
      nova: publicada,
      comandos,
      faca: `Há uma versão nova deste plugin: a ${publicada} (a pessoa está na ${local.version}). ` +
        "Diga isso em uma linha e pergunte, pela ferramenta de perguntas, se pode atualizar agora " +
        "— o custo é um minuto e reabrir o programa. Com o sim, RODE VOCÊ os dois comandos, um " +
        "depois do outro, sem pedir que ela digite nada; depois siga com o que veio fazer e, no " +
        "fim, peça em palavras simples para fechar e abrir o Claude Code de novo, que é quando a " +
        "versão nova passa a valer. Com o não, siga, e não pergunte de novo nesta conversa.",
    };
  } catch {
    return null;
  }
}
