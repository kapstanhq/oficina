/**
 * AS SESSÕES DO NAVEGADOR (D272) — entrar uma vez, e todo agente usa.
 *
 * O pack declara os sites em `navegador.sessoes` (pelo `sessoes+` do
 * `conectores.json` dele): onde se entra, os domínios, e o cookie que diz
 * "logado". Este módulo faz três coisas, e nenhuma é do agente:
 *
 *   abrir      o Chrome da máquina, num perfil do Kapstan, na página de
 *              login — um Chrome comum, sem porta de depuração. A pessoa
 *              entra; senha e dois fatores são dela
 *   ler        fechada a janela, o mesmo perfil sem tela lê os cookies dos
 *              domínios do site, por `Storage.getCookies`. Há o de sinal: grava
 *   gravar     `~/.kapstan/navegador/sessoes.json`, no formato de estado do
 *              Playwright — é o `--storage-state` de cada agente
 *
 * **O valor de um cookie não sai daqui.** `estadoDasSessoes` devolve nome,
 * estado e validade. E só os cookies dos domínios declarados entram no
 * arquivo: a janela de login não leva o resto do que o perfil tiver.
 */
import { spawn } from "node:child_process";
import { existsSync, lstatSync, rmSync } from "node:fs";
import { chmod, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { abrirCdp } from "./cdp.mjs";

/* a variável existe para a prova, que não pode encostar nas sessões de verdade */
export const pastaDoNavegador = () =>
  process.env.KAPSTAN_NAVEGADOR_DIR || join(homedir(), ".kapstan", "navegador");
export const arquivoDasSessoes = () => join(pastaDoNavegador(), "sessoes.json");

const semPonto = (d) => String(d || "").replace(/^\./, "").toLowerCase();
export const doSite = (dominio, dominios = []) => {
  const d = semPonto(dominio);
  return dominios.some((x) => d === semPonto(x) || d.endsWith("." + semPonto(x)));
};

export async function lerSessoes() {
  try {
    const v = JSON.parse(await readFile(arquivoDasSessoes(), "utf8"));
    return { cookies: Array.isArray(v?.cookies) ? v.cookies : [], origins: Array.isArray(v?.origins) ? v.origins : [] };
  } catch { return { cookies: [], origins: [] }; }
}

/* .tmp + rename, como o cofre: um processo morto no meio não deixa meio JSON */
async function gravarSessoes(sessoes) {
  await mkdir(pastaDoNavegador(), { recursive: true });
  const p = arquivoDasSessoes();
  await writeFile(p + ".tmp", JSON.stringify(sessoes, null, 1) + "\n", "utf8");
  await chmod(p + ".tmp", 0o600).catch(() => {});
  await rename(p + ".tmp", p);
}

/** o arquivo existe, mesmo vazio — o Playwright recusa `--storage-state` que não existe */
export async function garantirArquivo() {
  if (!existsSync(arquivoDasSessoes())) await gravarSessoes({ cookies: [], origins: [] });
  return arquivoDasSessoes();
}

/** do formato do Chrome para o do Playwright */
const paraPlaywright = (c) => ({
  name: c.name, value: c.value, domain: c.domain, path: c.path || "/",
  expires: c.session || !(c.expires > 0) ? -1 : c.expires,
  httpOnly: Boolean(c.httpOnly), secure: Boolean(c.secure),
  sameSite: ["Strict", "Lax", "None"].includes(c.sameSite) ? c.sameSite : "Lax",
});

/**
 * `{ <site>: { rotulo, estado, ate } }` — `logada`, `vencida` ou `sem-sessao`.
 * Logada é ter um dos cookies de `sinal` dentro da validade.
 */
export function estadoDasSessoes(definicoes = {}, sessoes = { cookies: [] }, agora = Date.now()) {
  return Object.fromEntries(Object.entries(definicoes).map(([nome, d]) => {
    const sinais = sessoes.cookies.filter((c) => doSite(c.domain, d.dominios) && (d.sinal || []).includes(c.name));
    const rotulo = d.rotulo || nome;
    if (!sinais.length) return [nome, { rotulo, estado: "sem-sessao", ate: null }];
    const validade = Math.max(...sinais.map((c) => (c.expires > 0 ? c.expires * 1000 : Infinity)));
    if (validade <= agora) return [nome, { rotulo, estado: "vencida", ate: new Date(validade).toISOString() }];
    return [nome, { rotulo, estado: "logada", ate: Number.isFinite(validade) ? new Date(validade).toISOString() : null }];
  }));
}

/** troca os cookies de UM site no arquivo, e não encosta nos outros */
export async function trocarCookiesDoSite(d, novos) {
  const s = await lerSessoes();
  const outros = s.cookies.filter((c) => !doSite(c.domain, d.dominios));
  await gravarSessoes({ ...s, cookies: [...outros, ...novos] });
}

/**
 * O navegador dos agentes lê este arquivo? `true`, `false`, ou `null` quando
 * não dá para saber. Olha só o `args` dos servidores MCP do `~/.claude.json`.
 */
export async function agentesUsamAsSessoes() {
  let config;
  try {
    config = JSON.parse(await readFile(process.env.KAPSTAN_CLAUDE_JSON || join(homedir(), ".claude.json"), "utf8"));
  } catch { return null; }
  const alvo = arquivoDasSessoes().replace(/\\/g, "/").toLowerCase();
  const servidores = [config?.mcpServers, ...Object.values(config?.projects || {}).map((p) => p?.mcpServers)]
    .filter(Boolean).flatMap((m) => Object.values(m));
  return servidores.some((s) => {
    const a = Array.isArray(s?.args) ? s.args : [];
    const i = a.indexOf("--storage-state");
    return i >= 0 && String(a[i + 1] || "").replace(/\\/g, "/").toLowerCase() === alvo;
  });
}

const recusa = (m) => Object.assign(new Error(m), { codigo: 400 });


/* fechar como quem clica no X: à força, o Chrome perde o que ainda não gravou
   no disco — e o cookie do login é justamente o mais novo. SEM `/T`: com ele
   o taskkill tenta os processos de página, que só fecham à força, e desiste
   da árvore inteira — a janela ficava aberta (medido em 23/09). Sem ele, o
   pedido vai à janela, e o Chrome fecha sozinho, com código 0 */
function fecharComGentileza(filho) {
  if (!filho?.pid) return;
  if (process.platform === "win32") spawn("taskkill", ["/PID", String(filho.pid)], { windowsHide: true, stdio: "ignore" });
  else filho.kill("SIGTERM");
}

const saiu = (filho, teto) => new Promise((pronto) => {
  if (!filho || filho.exitCode !== null) return pronto(true);
  const relogio = setTimeout(() => pronto(false), teto);
  filho.once?.("exit", () => { clearTimeout(relogio); pronto(true); });
});

/**
 * A janela de login — uma por vez, em DOIS tempos:
 *
 *   1  a janela de verdade, SEM porta de depuração. Com ela, o Google recusa
 *      entrar ("Esse navegador ou app pode não ser seguro") — medido em 23/09
 *      no "Entrar com o Google" do LinkedIn
 *   2  fechada a janela, o MESMO perfil abre sem tela, com a porta, só para
 *      ler os cookies que ficaram no disco, e fecha
 *
 * Por isso o login só é lido quando a janela fecha: o perfil é de um Chrome
 * por vez. "Já entrei" a fecha pela pessoa, com gentileza.
 *
 * `acharNavegador` vem de `documentos/nucleo/imprimir.mjs`; `gerar`,
 * `conectar` e `fecharJanela` são injetáveis para a prova.
 */
export function criarJanelas({ definicoes = {}, acharNavegador, gerar = spawn, conectar = abrirCdp,
  fecharJanela = fecharComGentileza, aoRegistrar = () => {} }) {
  let janela = null;           // { nome, filho, lendo }
  let ultimo = null;           // { nome, logada, cookies_do_site?, erro? } — a última leitura
  const perfil = () => join(pastaDoNavegador(), "perfil");
  const exigir = (nome) => {
    const d = definicoes[nome];
    if (!d) throw recusa(`não conheço o site “${nome}”`);
    return d;
  };
  const exigirNavegador = () => {
    const n = acharNavegador?.();
    if (!n) throw recusa("Não achei Chrome, Edge ou Chromium nesta máquina.");
    return n;
  };
  /* o perfil é de um Chrome por vez: um segundo entrega o pedido ao primeiro
     e sai. O Windows mostra isso pelo `lockfile`, que o Chrome segura aberto
     (apagar falha); os outros, pelo `SingletonLock` */
  const perfilEmUso = () => {
    if (process.platform === "win32") {
      const trava = join(perfil(), "lockfile");
      if (!existsSync(trava)) return false;
      try { rmSync(trava); return false; } catch { return true; }
    }
    try { lstatSync(join(perfil(), "SingletonLock")); return true; } catch { return false; }
  };
  const EM_USO = "Há uma janela aberta pelo Kapstan. Feche-a e aperte de novo.";
  /* `--restore-last-session` nas DUAS aberturas (D260): o login só se lê com
     a janela fechada, e o Chrome joga fora ao fechar o cookie sem validade — a
     Gupy guarda o login num desses (`candidate_token`). Com a bandeira ele o
     grava no disco e o devolve ao abrir de novo. Medido em 23/09 num perfil
     descartável: sem ela, só o cookie com data volta; com ela, os dois. A
     preferência "continuar de onde parou" NÃO bastou no Chrome sem tela. O
     preço: a janela de login reabre as abas da vez anterior. */
  const ARGS = () => [`--user-data-dir=${perfil()}`, "--no-first-run", "--no-default-browser-check",
    "--restore-last-session"];

  /* a porta vem do arquivo que o Chrome escreve no perfil: `porta\n/devtools/browser/<id>` */
  async function enderecoDoPerfil(teto) {
    const arquivo = join(perfil(), "DevToolsActivePort");
    for (let i = 0; ; i++) {
      try {
        const [porta, caminho] = (await readFile(arquivo, "utf8")).split(/\r?\n/);
        if (porta && caminho) return `ws://127.0.0.1:${porta.trim()}${caminho.trim()}`;
      } catch { /* ainda não escreveu */ }
      if (i * 250 >= teto) return "";
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  /** o segundo tempo: o perfil sem tela, os cookies do site, e fecha */
  async function lerDoPerfil(nome) {
    const d = exigir(nome);
    if (perfilEmUso()) throw recusa(EM_USO);
    await rm(join(perfil(), "DevToolsActivePort"), { force: true });
    const filho = gerar(exigirNavegador(), ["--headless=new", ...ARGS(), "--remote-debugging-port=0", "about:blank"],
      { stdio: "ignore" });
    filho.on?.("error", () => {});
    try {
      const endereco = await enderecoDoPerfil(15_000);
      if (!endereco) throw recusa("Não consegui ler o login: feche as janelas abertas pelo Kapstan e aperte “Já entrei” de novo.");
      const cdp = await conectar(endereco);
      try {
        const { cookies = [] } = await cdp.enviar("Storage.getCookies");
        const doSiteAqui = cookies.filter((c) => doSite(c.domain, d.dominios));
        /* só grava com login: ler um perfil que saiu da conta não apaga a sessão salva */
        if (doSiteAqui.some((c) => (d.sinal || []).includes(c.name))) {
          await trocarCookiesDoSite(d, doSiteAqui.map(paraPlaywright));
          aoRegistrar(`sessão de ${nome} gravada`);
          return { logada: true };
        }
        /* os NOMES, sem valor: é por eles que se acerta o `sinal` de um site novo */
        return { logada: false, cookies_do_site: [...new Set(doSiteAqui.map((c) => c.name))] };
      } finally {
        await cdp.enviar("Browser.close").catch(() => {});
        cdp.fechar();
      }
    } finally {
      if (!(await saiu(filho, 5000))) filho.kill?.();
    }
  }

  async function lerEGuardar(nome) {
    try { ultimo = { nome, ...(await lerDoPerfil(nome)) }; }
    catch (e) { ultimo = { nome, logada: false, erro: String(e?.message || e) }; }
    return ultimo;
  }

  return {
    estado: () => (janela ? { nome: janela.nome, fase: janela.lendo ? "lendo" : "aberta" } : null),
    ultimo: () => ultimo,

    async abrir(nome) {
      const d = exigir(nome);
      if (janela) {
        if (janela.nome === nome) return { aberta: true };
        throw recusa(`Já há uma janela de login aberta (${definicoes[janela.nome]?.rotulo || janela.nome}). Termine lá primeiro.`);
      }
      await mkdir(perfil(), { recursive: true });
      if (perfilEmUso()) throw recusa(EM_USO);
      const filho = gerar(exigirNavegador(), [...ARGS(), "--new-window", d.entrar], { stdio: "ignore" });
      const esta = { nome, filho, lendo: false };
      janela = esta;
      ultimo = null;
      filho.on?.("error", (e) => {
        if (janela !== esta) return;
        janela = null;
        ultimo = { nome, logada: false, erro: `a janela não abriu (${e?.code || e?.message || e})` };
      });
      filho.on?.("exit", async () => {
        if (janela !== esta) return;
        esta.lendo = true;
        await lerEGuardar(nome);
        if (janela === esta) janela = null;
      });
      aoRegistrar(`janela de login aberta: ${nome}`);
      return { aberta: true };
    },

    /** "Já entrei": fecha a janela, se ainda está aberta, e devolve a leitura */
    async concluir(nome) {
      exigir(nome);
      if (janela && janela.nome !== nome) throw recusa("A janela aberta é de outro site.");
      if (!janela) return lerEGuardar(nome);      // o painel trocou de processo com a janela aberta
      const esta = janela;
      if (!esta.lendo) fecharJanela(esta.filho);
      for (let i = 0; i < 120 && janela === esta; i++) await new Promise((r) => setTimeout(r, 250));
      if (janela === esta) throw recusa("A janela não fechou. Feche-a você, e o painel lê o login.");
      return ultimo;
    },

    /** tira o site do arquivo. O perfil de login continua com a conta */
    async sair(nome) {
      await trocarCookiesDoSite(exigir(nome), []);
      aoRegistrar(`sessão de ${nome} apagada`);
      return { ok: true };
    },
  };
}
