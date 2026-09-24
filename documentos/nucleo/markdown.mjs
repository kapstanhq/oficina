/**
 * O MARKDOWN DE UM DOCUMENTO, EM HTML (D270).
 *
 * Só o que um documento de base usa: títulos, parágrafos, listas, negrito,
 * itálico, link e endereço solto. Sem dependência — o pack instalado não roda
 * `npm install` —, e sem tabela nem imagem: documento que vai para uma empresa
 * é texto numa coluna, e é isso que um sistema de triagem lê.
 *
 * O que muda de um documento para outro é dado, e vem do `modelo.json`:
 *
 *   abertura    classe dos parágrafos antes do primeiro `##` — no currículo,
 *               a linha de contato; os itens separados por " · " viram
 *               pedaços que não se partem ao meio
 *   direita     separador do `###` cuja ÚLTIMA parte vai para a direita —
 *               `cargo · empresa · período`. Continua DEPOIS no texto: é a
 *               ordem que o leitor de triagem extrai
 *   blocos      junta cada `###` com o que vem abaixo dele num bloco, e as
 *               regras de quebra da página o mantêm inteiro quando cabe
 *
 * Comentário de HTML sai: é recado de quem escreveu, e não conteúdo.
 */

export const escapar = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* negrito, itálico, link, e-mail e endereço solto — nesta ordem, e o
   endereço só onde ainda não há `<a>` */
function emLinha(texto) {
  let s = escapar(texto)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
  const partes = s.split(/(<a [^>]*>.*?<\/a>)/);
  return partes.map((p) => p.startsWith("<a ") ? p : p
    .replace(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g, '<a href="mailto:$1">$1</a>')
    .replace(/(^|[\s(])((?:https?:\/\/)?(?:[\w-]+\.)+(?:com|br|io|dev|org|net|app|me)(?:\.br)?(?:\/[\w\-./?=&%#]*)?)(?=$|[\s),;.])/g,
      (m, antes, url) => url.includes("@") ? m
        : `${antes}<a href="${url.startsWith("http") ? url : "https://" + url}">${url}</a>`)).join("");
}

/**
 * `{ html, titulo }` — `titulo` é o texto do primeiro `#`, para o `<title>`
 * do documento (é o nome que o PDF carrega nas propriedades).
 */
export function markdownParaHtml(md, { abertura = "", direita = "", blocos = false } = {}) {
  const linhas = String(md || "").replace(/<!--[\s\S]*?-->/g, "").replace(/\r\n/g, "\n").split("\n");
  const saida = [];
  let lista = null;              // "ul" | "ol"
  let paragrafo = [];
  let bloco = false;
  let antesDoPrimeiroH2 = true;
  let titulo = "";

  const fecharParagrafo = () => {
    if (!paragrafo.length) return;
    const texto = paragrafo.join(" ");
    paragrafo = [];
    if (antesDoPrimeiroH2 && abertura) {
      /* os itens da abertura não se partem ao meio: a linha quebra ENTRE eles */
      const pedacos = texto.split(" · ").map((p) => `<span class="pedaco">${emLinha(p)}</span>`);
      saida.push(`<p class="${escapar(abertura)}">${pedacos.join('<span class="sep"> · </span>')}</p>`);
    } else saida.push(`<p>${emLinha(texto)}</p>`);
  };
  const fecharLista = () => { if (lista) { saida.push(`</${lista}>`); lista = null; } };
  const fecharBloco = () => { if (bloco) { saida.push("</section>"); bloco = false; } };
  const fecharTudo = () => { fecharParagrafo(); fecharLista(); };

  for (const bruta of linhas) {
    const t = bruta.trim();
    let m;
    if (!t) { fecharTudo(); continue; }
    if ((m = t.match(/^(#{1,4})\s+(.+)$/))) {
      fecharTudo();
      const nivel = m[1].length;
      if (nivel <= 2) fecharBloco();
      if (nivel === 1) { titulo = titulo || m[2].trim(); saida.push(`<h1>${emLinha(m[2])}</h1>`); continue; }
      if (nivel === 2) { antesDoPrimeiroH2 = false; saida.push(`<h2>${emLinha(m[2])}</h2>`); continue; }
      if (nivel === 3) {
        fecharBloco();
        if (blocos) { saida.push('<section class="bloco">'); bloco = true; }
        const partes = direita ? m[2].split(direita) : [m[2]];
        if (direita && partes.length > 1) {
          const lado = partes.pop();
          const [primeira, ...resto] = partes;
          saida.push(`<h3><span class="esquerda"><strong>${emLinha(primeira)}</strong>` +
            `${resto.length ? escapar(direita) + emLinha(resto.join(direita)) : ""}</span>` +
            `<span class="direita">${emLinha(lado)}</span></h3>`);
        } else saida.push(`<h3>${emLinha(m[2])}</h3>`);
        continue;
      }
      saida.push(`<h4>${emLinha(m[2])}</h4>`);
      continue;
    }
    if ((m = t.match(/^[-*+]\s+(.+)$/)) || (m = t.match(/^\d+[.)]\s+(.+)$/))) {
      fecharParagrafo();
      const tipo = /^\d/.test(t) ? "ol" : "ul";
      if (lista !== tipo) { fecharLista(); saida.push(`<${tipo}>`); lista = tipo; }
      saida.push(`<li>${emLinha(m[1])}</li>`);
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(t)) { fecharTudo(); saida.push("<hr>"); continue; }
    fecharLista();
    paragrafo.push(t);
  }
  fecharTudo();
  fecharBloco();
  return { html: saida.join("\n"), titulo };
}
