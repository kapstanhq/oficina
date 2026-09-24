/**
 * O HÓSPEDE (D232) — um painel só por máquina.
 *
 * ── O DEFEITO QUE ISTO FECHA ───────────────────────────────────────────
 * Cada sessão do Claude sobe o PRÓPRIO servidor de painel, e o segundo anda
 * de porta: 4180 ocupada, vai para 4181. Para a pessoa são dois endereços, e
 * ela está olhando um só. Medido em 20/09: uma sessão antiga segurava a 4180
 * com o painel velho, e a tela nova nasceu na 4181, onde ninguém estava. Com o
 * assistente disparado PELO painel isso deixa de ser incômodo e vira defeito:
 * a execução sem terminal perguntaria numa porta que ninguém abriu.
 *
 * Agora o segundo servidor procura o primeiro antes de abrir porta. Se acha —
 * mesma máquina, mesma chave, mesma base —, não sobe HTTP nenhum: vira
 * HÓSPEDE, e cada chamada de ferramenta é repassada INTEIRA ao anfitrião por
 * `POST /agente/chamar`. Uma rota, e não uma por ferramenta: o que o anfitrião
 * executa é a mesma função que ele executaria se a chamada viesse por stdio.
 *
 * ── A PROVA DE QUE É O NOSSO É A CHAVE ─────────────────────────────────
 * Qualquer programa pode estar ouvindo na 4180. O hóspede só se entrega a
 * quem aceita a chave desta máquina (`~/.kapstan/painel/chave`) — um servidor
 * alheio responde 401, 404 ou nada, e nos três casos o hóspede sobe o próprio.
 *
 * ── E BASE DIFERENTE NÃO SE HOSPEDA ────────────────────────────────────
 * O anfitrião tem UMA base. Dois packs abertos ao mesmo tempo, cada um com a
 * sua, continuam sendo dois painéis em duas portas, como sempre foram: trocar
 * a base debaixo de quem está lendo a outra é pior que ter dois endereços.
 *
 * ── A ESPERA VAI EM FATIAS ─────────────────────────────────────────────
 * `painel_esperar` pode pendurar 900 s, e o `fetch` do Node desiste de uma
 * resposta sem cabeçalho aos 300. Fatias de 100 s, repetidas até o teto: a
 * intenção que chegar no intervalo entre duas fica guardada na sessão do
 * anfitrião e é a primeira coisa que a fatia seguinte recebe.
 */
import { realpath } from "node:fs/promises";
import { resolve } from "node:path";

const FATIA_DE_ESPERA = 100;       // segundos
const PORTAS_A_OLHAR = 6;

const mesmaPasta = async (a, b) => {
  const real = async (p) => { try { return (await realpath(resolve(p))).toLowerCase(); } catch { return ""; } };
  const [x, y] = await Promise.all([real(a), real(b)]);
  return !!x && x === y;
};

/**
 * Procura um painel desta máquina já de pé. Devolve `null` quando não há —
 * e aí quem chamou sobe o seu, como sempre.
 *
 * `base` é a pasta que este processo quer abrir (pode ser vazia: tarefa sem
 * base). Anfitrião com OUTRA base não serve.
 */
export async function acharAnfitriao({ segredo, portaInicial = 4180, base = "", buscar = fetch }) {
  const cabecalhos = { "X-Painel-Chave": segredo, "Content-Type": "application/json" };
  for (let porta = portaInicial; porta < portaInicial + PORTAS_A_OLHAR; porta++) {
    const raiz = `http://127.0.0.1:${porta}`;
    try {
      const r = await buscar(`${raiz}/estado`, { headers: cabecalhos, signal: AbortSignal.timeout(700) });
      if (!r.ok) continue;
      const estado = await r.json();
      if (estado?.painel !== "kapstan") continue;
      if (estado.base && base) {
        const mapa = await (await buscar(`${raiz}/base`, { headers: cabecalhos,
          signal: AbortSignal.timeout(3000) })).json();
        if (!(await mesmaPasta(mapa?.raiz, base))) continue;
      }
      return criarHospede({ raiz, porta, cabecalhos, buscar });
    } catch { /* ninguém ali, ou não é dos nossos */ }
  }
  return null;
}

function criarHospede({ raiz, porta, cabecalhos, buscar }) {
  async function repassar(ferramenta, args, tetoMs = 30_000) {
    const r = await buscar(`${raiz}/agente/chamar`, {
      method: "POST", headers: cabecalhos,
      body: JSON.stringify({ ferramenta, args }),
      signal: AbortSignal.timeout(tetoMs),
    });
    const corpo = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(corpo?.erro || `o painel respondeu ${r.status}`);
    return corpo;
  }

  return {
    porta,
    url: `${raiz}/`,
    /* "a conversa continua aberta" (D243): o anfitrião solto não tem stdio, e
       sem este sinal não sabe se há assistente do outro lado */
    async presenca() {
      const r = await buscar(`${raiz}/agente/presenca`, { method: "POST", headers: cabecalhos,
        body: "{}", signal: AbortSignal.timeout(3000) });
      if (!r.ok) throw new Error(`o painel respondeu ${r.status}`);
    },
    async chamar(ferramenta, args = {}) {
      if (ferramenta !== "painel_esperar") return repassar(ferramenta, args);
      const total = Math.min(Math.max(Number(args.segundos) || 240, 5), 900);
      let esperei = 0;
      while (esperei < total) {
        const fatia = Math.min(FATIA_DE_ESPERA, total - esperei);
        const r = await repassar(ferramenta, { segundos: fatia }, (fatia + 30) * 1000);
        if (!r?.expirou) return r;
        esperei += fatia;
      }
      return { expirou: true, esperei: total, diga: "Ninguém mexeu no painel. Sigo por aqui mesmo." };
    },
  };
}
