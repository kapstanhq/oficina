/**
 * BAIXAR UMA PÁGINA QUE A PESSOA COLOU — o único lugar deste diretório em
 * que o HOST não é do catálogo.
 *
 * `chamada.mjs` fecha o SSRF dizendo que o endereço é do catálogo. Aqui ele
 * vem da conversa, e a guarda muda de natureza: não há host certo para
 * comparar, há hosts ERRADOS para recusar. As recusas, todas ANTES da rede:
 *
 *   protocolo          só http e https
 *   credencial         `usuario:senha@` na URL não é anúncio de vaga
 *   porta              só a padrão — a porta 8080 de um host é outro serviço
 *   nome local         localhost, *.local, *.internal, *.localhost
 *   endereço privado   IP literal OU o que o nome resolve: loopback, rede
 *                      privada, link-local (169.254 é o metadado de nuvem),
 *                      CGNAT, multicast — v4 e v6, e o v4 dentro do v6
 *   domínio recusado   a lista do CATÁLOGO: quem chama decide a política
 *
 * E as duas da resposta: tempo (20 s no total, redirecionamentos incluídos)
 * e tamanho (lê até o teto e para — o resto não chega a descer). Cada
 * redirecionamento passa por TODAS as recusas de novo: um encurtador que
 * aponte para a rede interna ou para um site recusado é o caso que a
 * primeira conferência sozinha deixaria passar.
 *
 * ── O QUE FICA DE FORA, E ESTÁ DITO ────────────────────────────────────
 * O `fetch` resolve o nome de novo depois da conferência. Um DNS hostil que
 * responda público na primeira e privado na segunda passa (DNS rebinding).
 * Fechar isso pede fixar o IP na conexão, o que o `fetch` do Node não expõe
 * sem dependência. O risco é aceito porque a URL é colada pela pessoa, uma
 * por vez, e a resposta só é lida como texto — nada nela é executado.
 */
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const resolverPadrao = (host) => lookup(host, { all: true, verbatim: true });

const v4 = (ip) => ip.split(".").map(Number);
function privadoV4(ip) {
  const [a, b] = v4(ip);
  return a === 0 || a === 10 || a === 127 || a >= 224
    || (a === 100 && b >= 64 && b <= 127)          // CGNAT
    || (a === 169 && b === 254)                     // link-local, metadado de nuvem
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 192 && b === 0 && v4(ip)[2] === 0)
    || (a === 198 && (b === 18 || b === 19));
}
export function enderecoPrivado(ip) {
  const s = String(ip).replace(/^\[|\]$/g, "").toLowerCase();
  if (isIP(s) === 4) return privadoV4(s);
  if (isIP(s) !== 6) return true;                  // o que não se entende não passa
  const mapeado = s.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapeado) return privadoV4(mapeado[1]);
  if (/^::ffff:[0-9a-f]{1,4}:[0-9a-f]{1,4}$/.test(s)) {
    const [, x, y] = s.match(/^::ffff:([0-9a-f]+):([0-9a-f]+)$/);
    const n = [parseInt(x, 16) >> 8, parseInt(x, 16) & 255, parseInt(y, 16) >> 8, parseInt(y, 16) & 255];
    return privadoV4(n.join("."));
  }
  return s === "::" || s === "::1" || /^f[cd]/.test(s) || /^fe[89ab]/.test(s) || /^ff/.test(s)
    || s.startsWith("64:ff9b:") || s.startsWith("2001:db8");
}

/** `www.catho.com.br` está em `catho.com.br`; `catho.com.br.example` não */
export const noDominio = (host, dominio) => {
  const h = String(host).toLowerCase().replace(/\.$/, "");
  const d = String(dominio).toLowerCase();
  return h === d || h.endsWith("." + d);
};

/**
 * Confere uma URL sem tocar a rede, fora o DNS. Devolve a URL, ou lança.
 * `recusados` é `[{ dominios, diga }]`: o primeiro que casar dá a frase.
 */
export async function conferirUrl(bruta, { recusados = [], resolver = resolverPadrao } = {}) {
  let url;
  try { url = new URL(String(bruta).trim()); } catch {
    throw new Error("endereço recusado: isto não é um endereço de página");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`endereço recusado: só se lê página http ou https (veio ${url.protocol})`);
  }
  if (url.username || url.password) throw new Error("endereço recusado: tem usuário e senha dentro");
  if (url.port && !["80", "443"].includes(url.port)) {
    throw new Error(`endereço recusado: a porta ${url.port} não é a de uma página pública`);
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  for (const r of recusados) {
    if ((r.dominios || []).some((d) => noDominio(host, d))) {
      const erro = new Error(r.diga);
      erro.recusado = true;
      throw erro;
    }
  }
  if (/^localhost$|\.(localhost|local|internal|home|lan)$/i.test(host) || !host.includes(".") && !isIP(host)) {
    throw new Error(`endereço recusado: ${host} é nome de rede local`);
  }
  if (isIP(host)) {
    if (enderecoPrivado(host)) throw new Error(`endereço recusado: ${host} é endereço de rede privada`);
    return url;
  }
  let enderecos;
  try { enderecos = await resolver(host); } catch {
    throw new Error(`o endereço ${host} não existe (o nome não resolveu)`);
  }
  const lista = (Array.isArray(enderecos) ? enderecos : [enderecos]).map((x) => x?.address ?? x);
  if (!lista.length || lista.some(enderecoPrivado)) {
    throw new Error(`endereço recusado: ${host} aponta para a rede privada`);
  }
  return url;
}

/**
 * Baixa o HTML de uma página, com as guardas acima. Devolve `{ url, html,
 * cortada }` — `url` é a final, depois dos redirecionamentos.
 */
export async function baixarPagina(bruta, {
  buscar = fetch, resolver = resolverPadrao, recusados = [],
  maxBytes = 3_000_000, tempo = 20_000, saltos = 4,
} = {}) {
  const sinal = AbortSignal.timeout(tempo);
  let url = await conferirUrl(bruta, { recusados, resolver });
  for (let salto = 0; ; salto++) {
    let r;
    try {
      r = await buscar(url, {
        redirect: "manual", signal: sinal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; oficina-vagas; um anuncio colado pela pessoa)",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "pt-BR,pt;q=0.9",
        },
      });
    } catch (e) {
      throw new Error(`a página não respondeu (${e?.name || "erro"}: ${e?.message || e})`);
    }
    if (r.status >= 300 && r.status < 400 && r.headers.get("location")) {
      await r.body?.cancel().catch(() => {});
      if (salto >= saltos) throw new Error("a página redireciona demais — cole o texto do anúncio");
      url = await conferirUrl(new URL(r.headers.get("location"), url).href, { recusados, resolver });
      continue;
    }
    if (!r.ok) {
      await r.body?.cancel().catch(() => {});
      throw new Error(`a página respondeu ${r.status}` +
        (r.status === 404 || r.status === 410 ? " — a vaga pode ter saído do ar" : "") +
        (r.status === 403 || r.status === 429 ? " — o site não deixa ler daqui; cole o texto do anúncio" : ""));
    }
    const tipo = r.headers.get("content-type") || "";
    if (tipo && !/html|xml/i.test(tipo)) {
      await r.body?.cancel().catch(() => {});
      throw new Error(`o endereço não é uma página (veio ${tipo.split(";")[0]}) — cole o texto do anúncio`);
    }
    const partes = [];
    let lidos = 0, cortada = false;
    if (!r.body) throw new Error("a página respondeu vazia — cole o texto do anúncio");
    const leitor = r.body.getReader();
    for (;;) {
      const { done, value } = await leitor.read();
      if (done) break;
      partes.push(value);
      lidos += value.length;
      if (lidos >= maxBytes) { cortada = true; await leitor.cancel().catch(() => {}); break; }
    }
    const bytes = Buffer.concat(partes.map((p) => Buffer.from(p))).subarray(0, maxBytes);
    const charset = (tipo.match(/charset=([\w-]+)/i)?.[1] || "utf-8").toLowerCase();
    let html;
    try { html = new TextDecoder(charset).decode(bytes); } catch { html = new TextDecoder("utf-8").decode(bytes); }
    return { url, html, cortada };
  }
}
