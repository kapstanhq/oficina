/**
 * A SEGUNDA PORTA DA PESSOA — os conectores vistos e mexidos pelo PAINEL.
 *
 * ── O PRINCÍPIO NÃO MUDA, E É ELE QUE DESENHA ESTE ARQUIVO ─────────────
 * O agente não liga conector, não guarda chave e não sobe o próprio teto.
 * Não existe ferramenta MCP para nada disso e não vai passar a existir — a
 * lista de `servidor.mjs` tem quatro, e as quatro são de LER e de CHAMAR.
 *
 * Até aqui "quem faz é gente" queria dizer "linha de comando", e o dono do
 * produto apontou o erro: quem instala o pack é leigo. O painel é a
 * interface DA PESSOA — o clique dela ali é ela agindo. Então os gestos
 * viram ROTAS HTTP do painel, atrás das MESMAS quatro guardas de
 * `painel/nucleo/http.mjs` (127.0.0.1, `Host`, `Origin`, chave/cookie), e
 * nunca ferramenta.
 *
 * ── A BRECHA QUE SOBRA, E ELA ESTÁ DITA EM VOZ ALTA ────────────────────
 * O agente não tem o cookie nem a chave do painel. Mas ele TEM ferramenta
 * de navegador em algumas sessões, e um navegador que já entrou no painel
 * carrega o cookie. Por isso toda ação que GASTA ou que ABRE — ligar,
 * guardar chave, mudar teto, rodar um teste que custa — exige um segundo
 * gesto: o corpo do pedido precisa vir com `confirmo: true`, e o primeiro
 * pedido devolve o AVISO em vez de fazer. Quem clica lê o aviso na tela
 * antes de confirmar.
 *
 * **Isto é mitigação, e não prova.** Um agente que dirija o navegador pode
 * mandar os dois pedidos. O que o segundo gesto garante é que ninguém —
 * pessoa ou agente — liga um conector com aviso sem que o aviso tenha
 * passado na frente, e que uma ação de dinheiro nunca acontece por um
 * pedido só. Quem quiser a garantia forte tira o pack do alcance do
 * navegador, e isso é decisão de quem usa (D197: informar em vez de
 * impedir).
 *
 * O que sai daqui carimba `por: "painel"` no cofre — a pergunta "quem ligou
 * isto?" tem duas respostas possíveis, e nenhuma delas é o agente.
 *
 * ── E A CHAVE DO SERVIÇO NUNCA VOLTA ───────────────────────────────────
 * `POST /conectores/chave` responde `{ ok, guardada }`. Não ecoa o valor,
 * não o mascara com os últimos dígitos e não o registra. `GET /conectores`
 * diz `guardada: true` e mais nada: uma resposta que carregue quatro
 * dígitos é uma resposta que vai para o registro do navegador, para a
 * captura de tela e para o relato de defeito que alguém cola num chat.
 */
import { ehPago } from "./catalogo.mjs";
import { aplicarChave, ler } from "./chamada.mjs";
import { lerChaves } from "./cofre.mjs";
import { criarJanelas, estadoDasSessoes, lerSessoes, agentesUsamAsSessoes, arquivoDasSessoes } from "./sessoes.mjs";
import { exigirConector, ligarConector, guardarChaveDe, escreverTetoDe,
  valorDeTeto, tetoValido } from "./gestos.mjs";

/* ── A RECUSA QUE A PESSOA LÊ ─────────────────────────────────────────
   O miolo fala com o agente, e as frases dele trazem a linha de comando que
   a pessoa digitaria — `sem teto · … Quem escreve é a pessoa:\nnode "…"
   teto apify <valor>`. Numa tela isso é pior que inútil: manda alguém abrir
   um terminal para fazer o que tem um campo a dois centímetros dali.

   A tradução é por PREFIXO porque é o prefixo que o miolo fixa (ver a ordem
   das recusas no topo de `conectores.mjs`); o resto da frase é detalhe que
   muda. O que não casa com nenhum sai pela primeira linha, que é curta de
   propósito em todas elas. */
const FRASES = [
  ["desligado ·", "Este ainda não foi ligado. Aperte “Ligar” aqui em cima."],
  ["sem-chave ·", "Falta colar a chave deste serviço."],
  ["sem teto ·", "Falta dizer quanto ele pode gastar por mês. Escreva o teto aqui em cima."],
  ["acima do teto ·", "Isto passaria do teto que você escreveu para este mês."],
  ["devagar ·", "Chamadas demais em pouco tempo. Espere um minuto e tente de novo."],
  ["orçamento", "A conta de quanto custaria venceu. Aperte de novo."],
  ["o serviço não respondeu", "O serviço não respondeu. Pode ser a internet, pode ser ele."],
  ["o serviço respondeu", "O serviço recusou. Confira a chave e tente de novo."],
];

export function emFrase(erro) {
  const bruto = String(erro?.message || erro || "").trim();
  for (const [prefixo, frase] of FRASES) if (bruto.startsWith(prefixo)) return frase;
  return bruto.split("\n")[0] || "não deu certo, e não sei dizer por quê";
}

const recusar = (frase) => Object.assign(new Error(frase), { codigo: 400 });

/**
 * A porta do painel para os conectores.
 *
 * Devolve uma tabela de rotas no formato que `abrirPainel` espera, e é essa
 * MESMA tabela que a `prova-guardas.mjs` monta — uma segunda cópia lá
 * provaria rotas que o painel não serve.
 *
 * @param {object} opcoes
 * @param {object} opcoes.catalogo    o catálogo já carregado e conferido
 * @param {object} opcoes.conectores  o miolo de `criarConectores`
 * @param {Function} [opcoes.buscar]  o `fetch`, injetável para a prova
 */
export function criarPortaDeConectores({ catalogo, conectores, buscar = fetch,
  aoRegistrar = () => {}, acharNavegador = () => "", janelas = null }) {

  /* os sites em que se entra uma vez (D272) — do conector que os declara */
  const comSessoes = Object.entries(catalogo).find(([, c]) => c.sessoes && Object.keys(c.sessoes).length);
  const definicoes = comSessoes ? comSessoes[1].sessoes : {};
  const login = janelas || criarJanelas({ definicoes, acharNavegador, aoRegistrar });

  /**
   * O ESTADO DE TODOS, em linguagem de tela.
   *
   * O miolo já sabe o que a CLI mostra — estado, custo, gasto, teto, resta,
   * operações —, e isso vem dele sem uma linha reescrita. O que esta função
   * acrescenta é o que só a TELA precisa: o aviso inteiro (a CLI o diz no
   * ato de ligar; a tela o mostra antes do segundo clique), se há chave
   * guardada, os passos de onde tirar uma, o teto que o catálogo sugere, e
   * se há um teste para apertar.
   *
   * O `como_ligar` do miolo NÃO vem: ele é a linha de comando, e esta tela
   * existe justamente para ninguém precisar dela.
   */
  async function vista() {
    const { mes, conectores: lista } = await conectores.estado();
    const chaves = await lerChaves();
    return {
      mes,
      conectores: await Promise.all(lista.map(async (c) => {
        const d = catalogo[c.nome] || {};
        return {
          nome: c.nome,
          /* o nome e a frase de GENTE (D231). O `oque` é do agente; sem os
             dois a tela cai nele e no nome de máquina */
          rotulo: d.rotulo || "",
          para_voce: d.para_voce || "",
          tipo: c.tipo,
          oque: c.oque,
          estado: c.estado,
          aviso: d.aviso || "",
          /* só o tipo `mcp`: quem liga esses é o Claude, e o guia é o texto
             que a pessoa lê para fazer isso */
          guia: d.tipo === "mcp" ? (d.guia || "") : "",
          prova: c.prova || "",
          chave: d.chave
            ? {
              nome: d.chave.nome,
              guardada: Boolean(chaves[c.nome]),       // NUNCA o valor
              passos: Array.isArray(d.como_obter_chave) ? d.como_obter_chave : [],
            }
            : null,
          pago: ehPago(d),
          custo: c.custo,
          gasto_no_mes: c.gasto_no_mes,
          teto_do_mes: c.teto_do_mes,
          teto_sugerido: Number(d.teto_sugerido) > 0 ? Number(d.teto_sugerido) : null,
          resta: c.resta,
          teste: d.teste
            ? { oque: d.teste.oque || "", custa: Boolean(d.teste.operacao) }
            : null,
          operacoes: (c.operacoes || []).map((o) => ({ nome: o.nome, oque: o.oque || "" })),
          ...(d.sessoes ? { sessoes: await vistaDasSessoes() } : {}),
        };
      })),
    };
  }

  /** nome, estado e validade de cada site — o valor do cookie não vem */
  async function vistaDasSessoes() {
    const estados = estadoDasSessoes(definicoes, await lerSessoes());
    const janela = login.estado();
    const ultimo = login.ultimo?.();
    /* a última leitura que não achou login diz por quê — com os NOMES dos
       cookies que o site deixou, que é como se acerta o `sinal` */
    const aviso = (nome) => (ultimo?.nome !== nome || ultimo.logada ? "" : ultimo.erro
      || "Não achei o login. Entrou mesmo antes de fechar a janela?" +
        (ultimo.cookies_do_site?.length ? ` (o site deixou: ${ultimo.cookies_do_site.join(", ")})` : ""));
    return {
      sites: Object.entries(estados).map(([nome, e]) => ({ nome, ...e,
        janela: janela?.nome === nome ? janela.fase : "", aviso: aviso(nome) })),
      /* sem isto o painel diria "logado" a um navegador de agente que não lê o arquivo */
      agentes_usam: await agentesUsamAsSessoes(),
      arquivo: arquivoDasSessoes(),
    };
  }

  /** o segundo gesto. Sem ele, o pedido devolve o aviso e não faz nada */
  const confirmado = (corpo) => corpo?.confirmo === true;

  /** toda rota que muda alguma coisa passa por aqui: a recusa vira frase de
      gente e o código diz que foi recusa, e não defeito do servidor */
  const gesto = (fn) => async (entrada) => {
    try {
      return await fn(entrada);
    } catch (e) {
      throw Object.assign(new Error(emFrase(e)), { codigo: Number(e?.codigo) || 400 });
    }
  };

  /**
   * O TESTE — uma chamada mínima e REAL.
   *
   * Duas formas, e o catálogo declara qual (ver `nucleo/catalogo.mjs`):
   *
   *   `url`        a conferência que não custa: o serviço aceita esta chave?
   *                É o que um leigo precisa no segundo seguinte ao de colar
   *                a chave, e a resposta é sim ou não
   *   `operacao`   uma chamada de verdade, pelo caminho de sempre — orçamento
   *                antes, teto conferido, custo medido no fim. O painel mostra
   *                a estimativa e espera o segundo clique
   *
   * Nenhuma das duas devolve JSON à tela: o que sai é `{ ok, diz, custou }`.
   */
  async function testar(corpo) {
    const nome = String(corpo?.nome || "");
    const c = exigirConector(catalogo, nome);

    if (c.tipo === "mcp") {
      throw recusar("Este não se testa daqui: quem prova que ele está de pé é o " +
        "Claude, na conversa.");
    }
    if (!c.teste) {
      throw recusar("Este conector não traz um teste pronto — quem prova que ele " +
        "funciona é a primeira busca de verdade.");
    }

    /* ── A FORMA QUE NÃO CUSTA ──────────────────────────────────────── */
    if (c.teste.url) {
      const chave = (await lerChaves())[nome];
      if (c.chave && !chave) {
        throw recusar("Cole a chave primeiro — é ela que este teste vai conferir.");
      }
      const url = new URL(c.teste.url);
      const cabecalhos = { Accept: "application/json", "User-Agent": "Mozilla/5.0 (conectores)" };
      aplicarChave(url, cabecalhos, c, chave);
      let resposta;
      try {
        resposta = await buscar(url, {
          method: c.teste.metodo || "GET",
          headers: cabecalhos,
          signal: AbortSignal.timeout(20_000),
        });
      } catch (e) {
        return { ok: false, gratis: true,
          motivo: `não consegui falar com o serviço (${e?.name || "erro"})` };
      }
      if (resposta.status === 401 || resposta.status === 403) {
        return { ok: false, gratis: true, motivo: "o serviço não aceitou esta chave" };
      }
      if (!resposta.ok) {
        return { ok: false, gratis: true,
          motivo: `o serviço respondeu ${resposta.status}` };
      }
      let quem = "";
      try {
        const corpoJson = await resposta.json();
        quem = String(ler(corpoJson, c.teste.mostra) ?? "");
      } catch { /* respondeu bem e não era JSON: o que importa é o 200 */ }
      aoRegistrar(`teste de ${nome} pelo painel · ok`);
      return { ok: true, gratis: true, custou: 0,
        diz: quem ? `a chave é da conta ${quem}` : "o serviço aceitou a chave" };
    }

    /* ── A FORMA QUE CUSTA ──────────────────────────────────────────── */
    const alvo = { conector: nome, operacao: c.teste.operacao,
      parametros: c.teste.parametros || {} };
    const orcamento = await conectores.orcar(alvo);
    if (!orcamento.gratis && !confirmado(corpo)) {
      return {
        precisa_confirmar: true,
        oque: c.teste.oque,
        estimativa: orcamento.estimativa,
        moeda: orcamento.moeda,
        resta: orcamento.resta,
        orcamento: orcamento.orcamento,
      };
    }
    const feito = await conectores.chamar(
      orcamento.gratis ? alvo : { ...alvo, orcamento: corpo?.orcamento || orcamento.orcamento });
    aoRegistrar(`teste de ${nome} pelo painel · custou ${feito.custo ?? 0}`);
    return {
      ok: true,
      gratis: Boolean(orcamento.gratis),
      custou: feito.custo ?? 0,
      medido: feito.medido !== false,
      moeda: c.custo?.moeda || "",
      resta: feito.resta,
      diz: `o serviço respondeu${Array.isArray(feito.itens) ? ` com ${feito.itens.length} item(ns)` : ""}`,
    };
  }

  return {
    rotas: {
      "GET /conectores": () => vista(),

      /* ── ENTRAR NUM SITE (D272) ──────────────────────────────────────
         `entrar` abre a janela na máquina; quem digita a senha é a pessoa, e
         por isso não há segundo clique — abrir uma página de login não gasta
         nem expõe nada. `concluir` grava e fecha; `sair` tira o site do
         arquivo. Nenhuma devolve cookie. */
      "POST /conectores/sessao": gesto(async ({ corpo }) => {
        const nome = String(corpo?.nome || "");
        const acao = String(corpo?.acao || "");
        if (!(nome in definicoes)) throw recusar("Este site não está entre os que o pack conhece.");
        let r;
        if (acao === "entrar") r = await login.abrir(nome);
        else if (acao === "concluir") r = await login.concluir(nome);
        else if (acao === "sair") r = await login.sair(nome);
        else throw recusar("Isto não é algo que se faz com uma sessão.");
        return { ok: true, ...r, sessoes: await vistaDasSessoes() };
      }),

      "GET /conectores/extrato": ({ url }) => conectores.extrato({
        mes: url.searchParams.get("mes") || undefined,
        conector: url.searchParams.get("conector") || undefined,
      }),

      "POST /conectores/ligar": gesto(async ({ corpo }) => {
        const nome = String(corpo?.nome || "");
        const c = exigirConector(catalogo, nome);
        /* o aviso vai na FRENTE, e é o mesmo texto que a CLI imprime no ato
           de ligar. Quem não confirmou ainda não ligou nada. */
        if (!confirmado(corpo)) {
          /* o `oque` é o que o segundo clique VAI FAZER, e não o que o
             conector é: o que ele é já está escrito no cartão, duas linhas
             acima, e repeti-lo na caixa de confirmação faz a pessoa reler o
             mesmo parágrafo achando que é outro */
          return { precisa_confirmar: true, aviso: c.aviso || "", oque: `Ligar ${nome}` };
        }
        const { jaEstava } = await ligarConector({ catalogo, nome, ligado: true, por: "painel" });
        aoRegistrar(`${nome} ligado pelo painel`);
        return { ok: true, jaEstava, vista: await vista() };
      }),

      /* desligar não pede confirmação: ele FECHA. O gesto que precisa de
         cerimônia é o que abre ou o que gasta — pôr uma aqui treinaria
         alguém a confirmar sem ler. */
      "POST /conectores/desligar": gesto(async ({ corpo }) => {
        const nome = String(corpo?.nome || "");
        await ligarConector({ catalogo, nome, ligado: false, por: "painel" });
        aoRegistrar(`${nome} desligado pelo painel`);
        return { ok: true, vista: await vista() };
      }),

      "POST /conectores/chave": gesto(async ({ corpo }) => {
        const nome = String(corpo?.nome || "");
        const c = exigirConector(catalogo, nome);
        if (!c.chave) throw recusar(`${nome} não usa chave.`);
        const apagando = String(corpo?.chave ?? "").trim() === "";
        if (!apagando && !confirmado(corpo)) {
          return {
            precisa_confirmar: true,
            oque: `Guardar a ${c.chave.nome} neste computador`,
            aviso: "A chave fica só neste computador, num arquivo do seu usuário. " +
              "O assistente nunca a lê, e ela não aparece nesta tela depois de guardada.",
          };
        }
        const { guardada } = await guardarChaveDe({ catalogo, nome, chave: corpo?.chave });
        /* o registro diz QUE guardou, e de onde veio o gesto. O valor não
           entra nem aqui — o stderr do painel vai para o terminal da sessão */
        aoRegistrar(`chave de ${nome} ${guardada ? "guardada" : "apagada"} pelo painel`);
        return { ok: true, guardada, vista: await vista() };
      }),

      "POST /conectores/teto": gesto(async ({ corpo }) => {
        const nome = String(corpo?.nome || "");
        const c = exigirConector(catalogo, nome);
        if (!ehPago(c)) throw recusar(`${nome} não custa nada — não há o que limitar.`);
        const valor = valorDeTeto(corpo?.teto);
        if (!tetoValido(valor)) {
          throw recusar("Escreva quanto ele pode gastar por mês — um número, " +
            "zero ou mais. Zero fecha a torneira.");
        }
        if (!confirmado(corpo)) {
          return {
            precisa_confirmar: true,
            oque: `Deixar ${nome} gastar até ${valor} ${c.custo.moeda} por mês`,
            aviso: "Isto impede de COMEÇAR uma chamada nova acima do teto. Para " +
              "garantir que nenhuma passe, escreva o mesmo limite no site do serviço.",
          };
        }
        await escreverTetoDe({ catalogo, nome, valor, por: "painel" });
        aoRegistrar(`teto de ${nome} em ${valor} pelo painel`);
        return { ok: true, teto: valor, moeda: c.custo.moeda, vista: await vista() };
      }),

      /* o teste não usa `gesto`: uma chamada que FALHA é um resultado da
         tela ("não deu certo, e por quê"), e não uma recusa do servidor.
         O que sobe como erro é o que nem chegou a ser tentado. */
      "POST /conectores/testar": async ({ corpo }) => {
        try {
          return await testar(corpo);
        } catch (e) {
          if (Number(e?.codigo) === 400) {
            throw Object.assign(new Error(emFrase(e)), { codigo: 400 });
          }
          return { ok: false, motivo: emFrase(e) };
        }
      },
    },
  };
}
