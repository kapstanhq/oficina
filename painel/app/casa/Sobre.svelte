<script>
  /**
   * A CONTA — o resto do `INDICE.md`, que é REFERÊNCIA (D231). Chamava-se
   * "Seu perfil" e dividia o nome com o `perfil.md` do menu (D242).
   *
   * Quem é, como trabalha, o que ficou para depois, o que a base anotou como
   * conectado e onde ela mora no disco. Tudo isto abria a página inicial, e
   * nada disto é o que se abre o painel para ver: a pessoa vem saber o que
   * fazer, e não conferir o próprio telefone.
   *
   * ── NADA AQUI SABE DE OFÍCIO ──────────────────────────────────────────
   * As seções sem papel fixo — `## Como eu trabalho`, `## Pulado no começo` —
   * vão inteiras, com o título que têm no arquivo. O motor não sabe quais
   * existem, e esconder o que ele não reconhece apagaria da tela o que o
   * ofício escreveu.
   *
   * ── E ELA NÃO EDITA ───────────────────────────────────────────────────
   * O painel não grava na base. O que a pessoa quer mudar, ela pede ao
   * assistente — e a frase do topo diz isso antes que alguém procure o lápis.
   */
  import { paraConectores } from "../rota.js";
  import Ficha from "../vistas/Ficha.svelte";
  import Itens from "./Itens.svelte";

  let { mapa, conectores = false, sempre = null, ajuste = { daBase: [], avisos: [] }, execucao = null } = $props();

  let copiado = $state(false);
  async function copiar(texto) {
    try { await navigator.clipboard.writeText(texto); copiado = true; } catch { copiado = false; }
    setTimeout(() => { copiado = false; }, 2500);
  }

  const RESERVADAS = ["quem sou", "onde esta", "quanto tem", "o que esta conectado"];
  const semAcento = (s) => String(s || "").normalize("NFD")
    .replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const demais = $derived((mapa?.secoes || [])
    .filter((s) => !RESERVADAS.some((r) => semAcento(s.titulo).startsWith(r))));

  /* `sempre.plataforma` é o `process.platform` do servidor; sem ele, o texto não nomeia sistema */
  const ENTRADA = { win32: "no Windows", darwin: "no Mac", linux: "na sua sessão do Linux" };
  const entrada = $derived(ENTRADA[sempre?.plataforma] || "no computador");

  const desligado = (v) => /^(não|nao|—|-|\?)(\s|$)/i.test(String(v || "").trim());
</script>

<header class="c-secao" style="gap:var(--s1)">
  <h1 class="c-h2">Conta</h1>
  <p class="c-corpo">O que o assistente sabe sobre você e sobre o seu jeito de
    trabalhar. Esta tela só mostra: para mudar qualquer coisa, peça a ele na
    conversa — “muda o meu telefone para…”.</p>
</header>

{#if mapa.quem.length}
  <section class="c-secao" style="gap:var(--s2)">
    <h2 class="c-h3">Como você se apresenta</h2>
    <p class="c-nota">É com estes dados que as mensagens saem assinadas. O que
      está com <span class="p-falta">?</span> o assistente ainda não sabe.</p>
    <Ficha dados={{ campos: mapa.quem, secoes: [] }} />
  </section>
{/if}

{#each demais as s (s.titulo)}
  <section class="c-secao" style="gap:var(--s2)">
    <h2 class="c-h3">{s.titulo}</h2>
    <Itens itens={s.itens} />
  </section>
{/each}

{#if mapa.conectado.length}
  <section class="c-secao" style="gap:var(--s2)">
    <h2 class="c-h3">O que o assistente anotou como ligado</h2>
    <ul class="p-linhas">
      {#each mapa.conectado as c, i (i)}
        <li>
          <span class="p-ponto" data-tom={desligado(c.valor) ? "falta" : "vivo"} aria-hidden="true"></span>
          <span><b>{c.rotulo}</b> — {c.valor}</span>
        </li>
      {/each}
    </ul>
    {#if conectores}
      <p class="c-nota">Isto é o que está escrito na sua base. Para ligar ou
        desligar um serviço de verdade, vá em <a href={paraConectores}>Integrações</a>.</p>
    {/if}
  </section>
{/if}

<!-- ── O PAINEL SEMPRE LIGADO (D243) ─────────────────────────────────────
     O painel que o Claude abre vive enquanto a conversa vive. A página diz em
     qual dos dois estados está, e dá a linha que muda isso — ela não liga
     nada sozinha: o que sobe com o login é decisão de quem usa o computador. -->
{#if sempre}
  <section class="c-secao" style="gap:var(--s2)" aria-label="painel sempre ligado">
    <h2 class="c-h3">Painel sempre ligado</h2>
    <ul class="p-linhas">
      <li>
        <span class="p-ponto" data-tom={sempre.solto ? "vivo" : "falta"} aria-hidden="true"></span>
        <span>{sempre.solto
          ? "Esta página não depende do Claude: fechar ou reabrir a conversa não a derruba."
          : "Esta página vive dentro da conversa com o Claude: fechou a conversa, ela para de responder."}</span>
      </li>
      <li>
        <span class="p-ponto" data-tom={sempre.noLogin ? "vivo" : "falta"} aria-hidden="true"></span>
        <span>{sempre.noLogin ? `Ela sobe sozinha quando você entra ${entrada}.` : `Ela não sobe sozinha quando você entra ${entrada}.`}</span>
      </li>
    </ul>
    {#if !sempre.solto || !sempre.noLogin}
      <p class="c-nota">Para deixá-la sempre ligada, rode uma vez no terminal (ou peça ao Claude que rode):</p>
      <button type="button" class="p-pedido-copiar" onclick={() => copiar(sempre.comando)} aria-label="copiar o comando">
        <code>{sempre.comando}</code><em>{copiado ? "Copiado ✓" : "Copiar"}</em>
      </button>
      <p class="c-nota">Para desfazer, o mesmo comando com <code>--desinstalar</code> no lugar de <code>--instalar</code>.</p>
    {/if}
  </section>
{/if}

<!-- ── O ARRANJO DESTE PAINEL (D244) ─────────────────────────────────────
     O pack traz o molde; o painel.json da base, escrito pelo assistente a
     pedido, ajusta por cima. A tela diz o que foi ajustado e o que foi
     ignorado — é aqui que se descobre por que um pedido não pegou. -->
<section class="c-secao" style="gap:var(--s2)" aria-label="arranjo do painel">
  <h2 class="c-h3">O arranjo deste painel</h2>
  {#if ajuste.daBase.length}
    <p class="c-corpo">Ajustado para esta base: {ajuste.daBase.join(", ")}, pelo <code>painel.json</code> dela.
      O resto segue o molde do pack.</p>
  {:else}
    <p class="c-corpo">Segue o molde do pack. Para mudar a ordem do início, os campos em destaque ou o
      texto dos botões, peça ao assistente — “põe o funil primeiro no painel”.</p>
  {/if}
  {#each ajuste.avisos as a (a)}<p class="c-nota p-falta">Ignorado no painel.json da base: {a}</p>{/each}
  <!-- o botão que chama o assistente sozinho: ligado por padrão, e a base o
       desliga com `"lancar": false` — o painel passa a copiar o pedido -->
  {#if execucao?.disponivel || execucao?.desligado}
    <p class="c-nota" data-lancar={execucao.desligado ? "desligado" : "ligado"}>{#if execucao.desligado}
      O botão que chama o assistente está desligado nesta base (<code>"lancar": false</code> no
      <code>painel.json</code> dela): o painel mostra o pedido para você colar no Claude.
    {:else}
      O botão que chama o assistente está ligado: ele trabalha sozinho e consome do seu plano. Para
      desligar, escreva <code>"lancar": false</code> no <code>painel.json</code> da base — ou peça ao assistente.
    {/if}</p>
  {/if}
</section>

{#if mapa.campos.length}
  <section class="c-secao" style="gap:var(--s2)">
    <h2 class="c-h3">Onde isto fica guardado</h2>
    <p class="c-nota">Tudo mora em arquivos de texto, no lugar abaixo — dá para
      abrir qualquer um deles num editor comum.</p>
    <Ficha dados={{ campos: mapa.campos, secoes: [] }} />
  </section>
{/if}
