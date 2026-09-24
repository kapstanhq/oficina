/**
 * O RITMO — quantas chamadas por minuto um conector aguenta.
 *
 * Fonte pública sem chave devolve 429 quando se abusa, e depois do 429 vem o
 * bloqueio do IP — que é o da pessoa. O agente não tem como sentir isso:
 * para ele, quarenta chamadas em paralelo são uma linha de plano.
 *
 * Janela deslizante de 60 s, em memória. **O limite declarado:** ela é por
 * PROCESSO. Dois packs instalados são dois processos e duas janelas, então o
 * teto real é o dobro do escrito. Aceito de propósito: a alternativa é um
 * arquivo de trava disputado a cada chamada, e o ritmo do catálogo já é
 * escrito com folga.
 *
 * A recusa NÃO dorme e tenta de novo por conta própria: uma ferramenta que
 * segura a resposta por cinquenta segundos parece travada, e o agente tem
 * coisa melhor a fazer nesse tempo. Ela diz quantos segundos faltam.
 */
export function criarRitmo({ agora = () => Date.now() } = {}) {
  const janelas = new Map();
  return {
    /** 0 se pode chamar (e a chamada já conta), ou os segundos a esperar */
    pedir(nome, porMinuto) {
      if (!porMinuto) return 0;
      const t = agora();
      const vivas = (janelas.get(nome) || []).filter((x) => t - x < 60_000);
      if (vivas.length >= porMinuto) {
        janelas.set(nome, vivas);
        return Math.max(1, Math.ceil((60_000 - (t - vivas[0])) / 1000));
      }
      vivas.push(t);
      janelas.set(nome, vivas);
      return 0;
    },
  };
}
