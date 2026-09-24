/**
 * A PONTE — o único lugar da interface que fala com o servidor.
 *
 * Ela existe separada dos componentes por uma razão que já custou caro no
 * Estúdio: quando o acesso ao servidor mora dentro do componente, cada tela
 * nova reescreve o tratamento de erro, e as versões divergem — uma repete,
 * outra desiste, uma terceira fica em silêncio. Aqui há um dono.
 *
 * ── A CHAVE MORA NO FRAGMENTO, E DEPOIS NÃO MORA EM LUGAR NENHUM ───────
 * A URL que o agente entrega é `http://127.0.0.1:4180/#<chave>`. O que vem
 * depois do `#` **não é enviado ao servidor pelo navegador** e não entra em
 * histórico de proxy nem em log de servidor — é o lugar certo para um
 * segredo que precisa viajar numa URL.
 *
 * Na primeira abertura a página TROCA a chave por um cookie (`POST /entrar`,
 * ver `nucleo/http.mjs`) e apaga o fragmento com `replaceState`. Duas coisas
 * saem daí, e a segunda é a que fez a página inicial ser possível:
 *
 *   · `http://127.0.0.1:4180/` passa a abrir sozinho — há um endereço, e
 *     não uma linha para copiar do terminal a cada sessão
 *   · o `#` fica LIVRE, e vira a rota da página (`rota.js`)
 *
 * O `replaceState` e não `location.hash = …`: trocar o hash empilharia a URL
 * com a chave no histórico, e o botão "voltar" a traria de volta à barra de
 * endereços depois de ela já ter sido consumida.
 *
 * ── E POR QUE LONG POLL, E NÃO SSE NEM WEBSOCKET ───────────────────────
 * O que o painel precisa é: "me avise quando mudar". As três formas
 * resolvem. O long poll é a que não tem estado no servidor além de uma
 * promessa pendurada — sem reconexão a tratar, sem quadro de keep-alive, sem
 * um segundo protocolo dentro do HTTP. Com um ou dois espectadores, que é o
 * caso real, o custo é o mesmo e o código é metade.
 */

/* ── O QUE É CHAVE E O QUE É ROTA ─────────────────────────────────────
   O mesmo `#` carrega as duas coisas em momentos diferentes da vida da
   página, e o que as separa é o FORMATO: a chave é base64url de 32
   caracteres para cima e nunca começa com `/`; toda rota começa com `/`.
   Sem esse teste, `#/arquivo/perfil.md` viraria uma tentativa de entrar com
   a chave "/arquivo/perfil.md" e a página abriria pedindo a chave. */
const doFragmento = location.hash.replace(/^#/, "");
export const CHAVE = /^[A-Za-z0-9_-]{32,}$/.test(doFragmento) ? doFragmento : "";

const cabecalhos = {
  "Content-Type": "application/json",
  ...(CHAVE ? { "X-Painel-Chave": CHAVE } : {}),
};

/** o erro carrega o `status`: 401 é "sem chave" e pede outra tela, 404 é
    "não tem isso" e é resposta, não falha */
async function pegar(caminho, opcoes = {}) {
  const r = await fetch(caminho, { headers: cabecalhos, ...opcoes });
  if (r.status === 204) return null;
  if (!r.ok) {
    let motivo = `o servidor respondeu ${r.status}`;
    try { motivo = (await r.json())?.erro || motivo; } catch { /* corpo não-JSON */ }
    throw Object.assign(new Error(motivo), { status: r.status });
  }
  return r.json();
}

/**
 * A TROCA — a chave do fragmento por um cookie.
 *
 * Devolve `true` quando entrou agora, `false` quando não havia chave para
 * trocar (e aí ou o cookie já está lá, ou a página vai receber 401 no
 * primeiro pedido e dizer o que falta).
 */
export async function entrar() {
  if (!CHAVE) return false;
  await pegar("/entrar", { method: "POST" });
  /* o fragmento cumpriu o papel dele. Some da barra de endereços, do
     histórico e de qualquer captura de tela que alguém faça daqui em diante */
  history.replaceState(null, "", location.pathname + "#/");
  return true;
}

/**
 * Pergunta ao servidor o que desenhar e fica pendurado até mudar.
 *
 * Devolve `null` quando nada mudou dentro do tempo — e aí quem chamou
 * pergunta de novo. Não é erro: é o laço funcionando.
 */
export async function aguardarDocumento(desde, sinal) {
  return pegar(`/documento?desde=${encodeURIComponent(desde)}`, { signal: sinal });
}

/**
 * Devolve ao agente o que a pessoa fez.
 *
 * `versao` viaja junto porque a resposta é a ESTA tela: se o agente já trocou
 * o documento, o clique respondia a uma pergunta que não está mais lá, e o
 * servidor recusa (ver `nucleo/sessao.mjs`). Quem chama recebe a recusa e
 * mostra — silenciar seria deixar a pessoa achando que mandou.
 */
export async function enviarIntencao(intencao) {
  return pegar("/intencao", { method: "POST", body: JSON.stringify(intencao) });
}

/* ── A CASA ───────────────────────────────────────────────────────────
   Três leituras e um gesto. Nenhuma das três escreve, e o gesto não escreve
   na base: ele vira intenção, como todo gesto do painel. */

/** se há agente, se ele está pendurado agora, e se há base — ver a nota da
    rota `/estado` em `servidor.mjs` sobre por que isto não cabe no long poll */
export const pedirEstado = () => pegar("/estado");

/** o mapa: o INDICE.md interpretado mais a árvore rasa */
export const pedirMapa = () => pegar("/base");

/** um arquivo: o texto cru e a interpretação ao lado */
export const pedirArquivo = (caminho) =>
  pegar(`/base/arquivo?caminho=${encodeURIComponent(caminho)}`);

/** os cabeçalhos de uma pasta inteira: `{ fichas: [{ caminho, campos, ultimo, em }] }` (D274) */
export const pedirFichas = (pasta) => pegar(`/base/fichas?pasta=${encodeURIComponent(pasta)}`);

/** os arquivos que mudaram depois de `desde` (ms): `[{ caminho, novo, em }]` (D234) */
export const pedirMudancas = (desde) => pegar(`/base/mudancas?desde=${encodeURIComponent(desde)}`);

/** o que dá para pedir: `{ pack, grupos: [{ rotulo, acoes }] }` (D231) */
export const pedirAcoes = () => pegar("/acoes");

/** o pedido que nasce na casa, sem o agente ter mostrado nada */
export const enviarPedido = (pedido, sobre) =>
  pegar("/pedido", { method: "POST", body: JSON.stringify({ pedido, sobre }) });

/* ── A FILA DE DECISÕES (D232) ────────────────────────────────────────
   O que a pessoa decide sem o assistente estar perguntando. Vai para o
   estado do PAINEL, e não para a base: quem grava continua sendo ele. */
export const pedirFila = () => pegar("/fila");
export const marcarNaFila = (decisao) =>
  pegar("/fila", { method: "POST", body: JSON.stringify(decisao) });
export const mandarFila = () => pegar("/fila/mandar", { method: "POST", body: "{}" });
/** dispensa uma resposta tardia que a pessoa não quer mais entregar (D238) */
export const tirarResposta = (em) =>
  pegar("/fila/resposta/tirar", { method: "POST", body: JSON.stringify({ em }) });
/** o motivo de um descarte já marcado — não desmarca nada (D234) */
export const anotarNaFila = (pedido) =>
  pegar("/fila/motivo", { method: "POST", body: JSON.stringify(pedido) });

/* ── CHAMAR O ASSISTENTE PELO PAINEL (D232) ───────────────────────────
   `o` é "fila" ou um comando da lista do pack — o servidor recusa o resto. O
   primeiro pedido volta `{ precisa_confirmar, oque, aviso }`; o segundo leva
   `confirmo: true`, e é o clique em "Chamar agora" que o manda. */
export const pedirExecucao = () => pegar("/lancar");
export const lancarAssistente = (corpo) =>
  pegar("/lancar", { method: "POST", body: JSON.stringify(corpo) });
export const pararAssistente = () => pegar("/lancar/parar", { method: "POST", body: "{}" });
/* a fila de execuções (D271): `continuar`, `tirar` (com `n`), `esvaziar` */
export const mexerNaFilaDeExecucao = (corpo) =>
  pegar("/lancar/fila", { method: "POST", body: JSON.stringify(corpo) });

/* ── OS CONECTORES ────────────────────────────────────────────────────
   Uma leitura e cinco gestos, e os cinco são da PESSOA: ligar um serviço,
   desligar, guardar a chave dele, dizer quanto ele pode gastar e testar.
   Nenhum deles existe como ferramenta do agente, e nenhum vai existir —
   ver `conectores/nucleo/painel.mjs`.

   Os que ABREM ou GASTAM (ligar, chave, teto, teste pago) voltam
   `{ precisa_confirmar: true, aviso, … }` no primeiro pedido: o segundo
   leva `confirmo: true`, e é o clique em "Confirmo" que o manda. Quem
   chama NÃO pode mandar os dois de uma vez — o aviso existe para ser lido
   entre um e outro. */
export const pedirConectores = () => pegar("/conectores");

const gestoDeConector = (rota) => (corpo) =>
  pegar(`/conectores/${rota}`, { method: "POST", body: JSON.stringify(corpo) });

export const ligarConector = gestoDeConector("ligar");
export const desligarConector = gestoDeConector("desligar");
export const guardarChaveDe = gestoDeConector("chave");
export const escreverTetoDe = gestoDeConector("teto");
export const testarConector = gestoDeConector("testar");
/* entrar num site, concluir, sair (D272): `{ nome, acao }`. Nunca volta cookie */
export const mexerNaSessao = gestoDeConector("sessao");

export const pedirExtrato = (conector) =>
  pegar(`/conectores/extrato${conector ? `?conector=${encodeURIComponent(conector)}` : ""}`);
