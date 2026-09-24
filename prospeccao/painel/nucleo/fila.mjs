/**
 * A FILA DE DECISÕES (D232) — o que a pessoa decidiu sem o assistente estar
 * perguntando, guardado até ele gravar.
 *
 * ── ELA MORA FORA DA BASE, E ISSO É O PONTO ────────────────────────────
 * O painel não escreve na base: com ele escrevendo, a base teria dois
 * escritores e as regras do contrato valeriam só num. A fila é estado DO
 * PAINEL — `~/.kapstan/painel/fila-<base>.json`, ao lado da chave —, e o que
 * está nela ainda não é fato: vira fato quando o assistente grava, com
 * procedência e histórico, e confirma por `concluir()`.
 *
 * ── OS DOIS GESTOS SÃO DO FORMATO ──────────────────────────────────────
 *   etapa      o item passa para outra etapa do funil
 *   descartar  o item sai — vai para o arquivo-morto, que todo pack tem
 * A etapa de destino precisa EXISTIR no `funil.md` da base: quem confere é
 * quem chama, que é quem sabe ler a base. Nada aqui sabe de ofício — "vale" é
 * só o nome que uma etapa tem num pack.
 *
 * ── UMA DECISÃO POR ITEM ───────────────────────────────────────────────
 * Marcar de novo o mesmo gesto DESMARCA; marcar outro SUBSTITUI. É a mesma
 * regra do lote da vista `lista`: sem isso um clique errado só se conserta
 * escolhendo outra decisão, e "ainda não decidi" deixa de existir.
 *
 * ── E A ESCRITA É ATÔMICA, E EM SÉRIE ──────────────────────────────────
 * `.tmp` ao lado e `rename`: dois painéis da mesma máquina (dois packs
 * abertos) podem apontar para a mesma base, e um JSON cortado ao meio faria a
 * fila inteira sumir na próxima leitura. E cada escrita espera a anterior
 * (D234): dois cliques rápidos liam o mesmo arquivo, e a segunda escrita
 * apagava a primeira.
 *
 * ── A DECISÃO ENVELHECE ────────────────────────────────────────────────
 * Entre o clique e a gravação o assistente pode ter mexido no item. Quem
 * entrega a fila diz em que etapa cada item está AGORA, e a decisão cujo `de`
 * não bate sai `envelheceu` — o assistente não grava, e a barra avisa.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

const GESTOS = new Set(["etapa", "descartar"]);
const RE_ITEM = /^[\p{Lu}]{1,4}-\d{1,6}$/u;
export const TETO_DA_FILA = 200;
/* respostas TARDIAS de telas (D238): poucas, e a mais velha sai primeiro */
export const TETO_DE_RESPOSTAS = 20;

const limpo = (v, teto) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, teto);

/** a frase que o assistente lê — e que trata como dita no terminal */
function frase(d) {
  const quem = d.nome ? `${d.item} (${d.nome})` : d.item;
  const velha = !d.envelheceu ? ""
    : d.agora ? `. ATENÇÃO: hoje está em “${d.agora}” — a decisão envelheceu`
    : ". ATENÇÃO: já não está no funil — a decisão envelheceu";
  if (d.gesto === "descartar") {
    return `${quem}: descartar` + (d.de ? ` — estava em “${d.de}”` : "") +
      (d.motivo ? `. Motivo: ${d.motivo}` : "") + velha;
  }
  /* a nota é da skill que mostrou a tela (D262): o que ela deixou pronto */
  return `${quem}: passar` + (d.de ? ` de “${d.de}”` : "") + ` para “${d.para}”` +
    (d.nota ? `. Nota de quem perguntou: ${d.nota}` : "") + velha;
}

export function criarFila({ pasta, aoRegistrar = () => {} }) {
  const marcaDe = (raiz) => createHash("sha256").update(String(raiz).toLowerCase()).digest("hex").slice(0, 16);
  const arquivoDe = (raiz) => join(pasta, `fila-${marcaDe(raiz)}.json`);
  const arquivoDeRespostas = (raiz) => join(pasta, `respostas-${marcaDe(raiz)}.json`);

  async function lerRespostas(raiz) {
    try {
      const bruto = JSON.parse(await readFile(arquivoDeRespostas(raiz), "utf8"));
      return Array.isArray(bruto?.respostas) ? bruto.respostas : [];
    } catch { return []; }
  }
  async function gravarRespostas(raiz, respostas) {
    await mkdir(pasta, { recursive: true });
    const alvo = arquivoDeRespostas(raiz);
    const tmp = `${alvo}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify({ base: raiz, respostas }, null, 2), "utf8");
    await rename(tmp, alvo);
  }

  async function ler(raiz) {
    try {
      const bruto = JSON.parse(await readFile(arquivoDe(raiz), "utf8"));
      return Array.isArray(bruto?.decisoes) ? bruto.decisoes : [];
    } catch {
      return [];                                   // sem arquivo, ou arquivo torto: fila vazia
    }
  }

  async function gravar(raiz, decisoes) {
    await mkdir(pasta, { recursive: true });
    const alvo = arquivoDe(raiz);
    const tmp = `${alvo}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify({ base: raiz, decisoes }, null, 2), "utf8");
    await rename(tmp, alvo);
  }

  let cadeia = Promise.resolve();
  const emSerie = (fazer) => {
    const vez = cadeia.then(fazer);
    cadeia = vez.catch(() => {});
    return vez;
  };

  return {
    ler,
    lerRespostas,

    /* ── AS RESPOSTAS TARDIAS (D238) ──────────────────────────────────── */
    /** guarda a resposta de uma tela que ninguém esperava; a mesma versão substitui */
    guardarResposta(raiz, resposta) {
      return emSerie(async () => {
        const atual = (await lerRespostas(raiz)).filter((r) => r.versao !== resposta.versao);
        atual.push({ ...resposta, em: resposta.em || new Date().toISOString() });
        while (atual.length > TETO_DE_RESPOSTAS) atual.shift();
        await gravarRespostas(raiz, atual);
        return atual;
      });
    },
    /** o assistente leu (ou a pessoa dispensou): saem as de `em` listado */
    concluirRespostas(raiz, ems) {
      return emSerie(async () => {
        const fora = new Set((Array.isArray(ems) ? ems : []).map(String));
        const atual = await lerRespostas(raiz);
        const resto = atual.filter((r) => !fora.has(String(r.em)));
        await gravarRespostas(raiz, resto);
        return { saiu: atual.length - resto.length, resta: resto.length };
      });
    },

    /**
     * As decisões, cada uma com a frase pronta — é o que o assistente recebe
     * e o que a barra mostra. `etapaAgora` é id → etapa, lido do `funil.md`
     * por quem chama; sem ele ninguém envelhece.
     */
    async paraOAgente(raiz, { etapaAgora = null } = {}) {
      return (await ler(raiz)).map((d) => {
        const agora = etapaAgora ? etapaAgora.get(d.item) || "" : d.de;
        const e = { ...d, ...(d.de && agora !== d.de ? { envelheceu: true, agora } : {}) };
        return { ...e, frase: frase(e) };
      });
    },

    /**
     * Marca, troca ou desmarca a decisão de UM item.
     * `etapas` são os títulos das seções do `funil.md`, lidos por quem chama.
     */
    marcar(raiz, pedido, opcoes) { return emSerie(() => marcarJa(raiz, pedido, opcoes)); },

    /** o motivo de um descarte, escrito depois do clique — não desmarca nada */
    anotar(raiz, pedido) {
      return emSerie(async () => {
        const item = limpo(pedido?.item, 12);
        const atual = await ler(raiz);
        const d = atual.find((x) => x.item === item);
        if (!d) throw recusa(`${item || "o item"} não está na fila`);
        if (d.gesto !== "descartar") throw recusa("só o descarte leva motivo");
        d.motivo = limpo(pedido?.motivo, 300);
        await gravar(raiz, atual);
        return atual;
      });
    },

    /**
     * O assistente confirma o que GRAVOU, e só isso sai da fila. O que ele
     * não conseguiu gravar continua esperando — com a fila esvaziada no ato
     * de entregar, uma execução que morresse no meio perderia as decisões.
     */
    concluir(raiz, itens) {
      return emSerie(async () => {
        const feitos = new Set((Array.isArray(itens) ? itens : []).map((i) => limpo(i, 12)));
        const atual = await ler(raiz);
        const resto = atual.filter((d) => !feitos.has(d.item));
        await gravar(raiz, resto);
        aoRegistrar(`fila · ${atual.length - resto.length} gravadas, ${resto.length} esperando`);
        return { saiu: atual.length - resto.length, resta: resto.length };
      });
    },
  };

  /* `etapaAgora` (id → etapa do `funil.md`) decide o `de`: a página manda o
     que ELA leu, e a página pode estar velha */
  async function marcarJa(raiz, pedido, { etapas = [], etapaAgora = null } = {}) {
    const item = limpo(pedido?.item, 12);
    const gesto = limpo(pedido?.gesto, 12);
    if (!RE_ITEM.test(item)) throw recusa("falta o item, na forma do id — `V-012`");
    if (!GESTOS.has(gesto)) throw recusa(`gesto “${gesto}” — os que existem: etapa, descartar`);
    const para = gesto === "etapa" ? limpo(pedido?.para, 60) : "";
    if (gesto === "etapa" && !etapas.includes(para)) {
      throw recusa(`“${para}” não é uma etapa do funil desta base`);
    }
    const atual = await ler(raiz);
    const antiga = atual.find((d) => d.item === item);
    const resto = atual.filter((d) => d.item !== item);
    const mesma = antiga && antiga.gesto === gesto && antiga.para === para;
    if (!mesma) {
      if (resto.length >= TETO_DA_FILA) {
        throw recusa(`a fila chegou a ${TETO_DA_FILA} decisões — peça ao assistente para gravar antes de marcar mais`);
      }
      resto.push({
        item, gesto, para,
        de: etapaAgora ? etapaAgora.get(item) || "" : limpo(pedido?.de, 60),
        nome: limpo(pedido?.nome, 160),
        motivo: limpo(pedido?.motivo, 300),
        ...(limpo(pedido?.nota, 300) ? { nota: limpo(pedido?.nota, 300) } : {}),
        em: new Date().toISOString(),
      });
    }
    await gravar(raiz, resto);
    aoRegistrar(`fila · ${mesma ? "desmarcou" : "marcou"} ${item}` + (mesma ? "" : ` (${gesto}${para ? " → " + para : ""})`));
    return resto;
  }
}

function recusa(mensagem) {
  return Object.assign(new Error(mensagem), { codigo: 400 });
}
