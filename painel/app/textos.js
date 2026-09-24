/**
 * OS TEXTOS DA INTERFACE — o padrão em pt-BR, que o pack pode trocar.
 *
 * `<pack>/painel.json` → `"textos": { "<chave>": "texto" }`. O montador cobra
 * que a chave exista aqui e leva a troca ao `acoes.json`; a página a aplica
 * por cima deste padrão (`textos.svelte.js`). Chave fora da tabela é recusa
 * no montador, e não texto ignorado em silêncio.
 *
 * Este arquivo é dado puro, sem runa: o montador (Node) o importa.
 */
export const TEXTOS_PADRAO = {
  /* o menu */
  inicio: "Início",
  suaVez: "Sua vez",
  configuracoes: "Configurações",
  integracoes: "Integrações",
  conta: "Conta",
  arquivo: "Arquivo",
  menu: "Menu",
  /* as duas pastas guardadas do formato (D242) */
  originais: "Originais",
  arquivados: "Arquivados",
  /* o que mudou desde a última visita (D234) */
  novo: "Novo",
  mudou: "Mudou",
  saiu: "Saiu",
};

/** o padrão com a troca do pack por cima; só texto não vazio troca */
export function textosCom(doPack = {}) {
  const saida = { ...TEXTOS_PADRAO };
  for (const k of Object.keys(TEXTOS_PADRAO)) {
    const v = doPack?.[k];
    if (typeof v === "string" && v.trim()) saida[k] = v.trim();
  }
  return saida;
}
