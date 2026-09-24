<script>
  /**
   * O LEITOR — a lista numa coluna, o item aberto ao lado (D244).
   *
   * É a forma que a pessoa já conhece da caixa de entrada e da página de
   * vagas do LinkedIn, e substitui o baralho do D242, que escondia a lista e
   * espremia o item num cartão.
   *
   * ── NÃO SABE DE ONDE VÊM OS ITENS ─────────────────────────────────────
   * Recebe os itens, os filtros, as opções de cada item e um snippet que
   * desenha o detalhe. A rota do funil o monta com a página do arquivo dentro;
   * a vista `lista` do agente, com o que o agente mandou. Quem é dono da
   * seleção é quem o monta (`selecionado` + `selecionar`): na rota ela mora
   * no endereço, e voltar do navegador funciona.
   *
   * ── A BARRA DO ITEM ───────────────────────────────────────────────────
   * Acompanha a rolagem. Anterior e próxima com a posição, o PRÓXIMO PASSO
   * (a opção que vem com `destaque`; sem ela, a primeira que não é recusa) e
   * "Mais", que tem TODAS — o destaque marcado e Descartar no fim, com os
   * motivos ali dentro (D257). Marcou, vai para a próxima — como o e-mail
   * depois de arquivar.
   *
   * ── ANDAR ─────────────────────────────────────────────────────────────
   *   os botões da barra · o gesto lateral do trackpad (roda horizontal) ·
   *   os botões laterais do mouse · J/K e ←/→ · no telefone, o arrasto
   */
  let { itens = [], selecionado = "", selecionar = () => {}, filtros = [], filtro = "",
    filtrar = () => {}, opcoesDe = () => [], marcadaDe = () => "", escolher = () => {},
    motivos = [], detalhe, vazio = "Nada aqui.", rotuloDaLista = "itens",
    ordenacoes = [], ordem = { chave: "", desc: false }, ordenar = () => {}, voltar = "‹ Lista", voltarSempre = false } = $props();

  let procura = $state("");
  const semAcento = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const visiveis = $derived(procura.trim()
    ? itens.filter((it) => semAcento(`${it.titulo} ${it.id || ""} ${it.sub || ""}`).includes(semAcento(procura.trim())))
    : itens);
  const atual = $derived(itens.find((it) => it.chave === selecionado) || null);
  const pos = $derived(visiveis.findIndex((it) => it.chave === selecionado));

  const ops = $derived(atual ? opcoesDe(atual) || [] : []);
  const principal = $derived(ops.find((o) => o.destaque) || ops.find((o) => o.tom !== "recusa") || null);
  const marcada = $derived(atual ? marcadaDe(atual) : "");

  function andar(passo) {
    if (!visiveis.length) return;
    const i = pos < 0 ? (passo > 0 ? 0 : visiveis.length - 1) : pos + passo;
    if (i < 0 || i >= visiveis.length) return;
    selecionar(visiveis[i].chave);
  }
  let menu = $state("");
  function escolherAqui(op, motivo = "") {
    menu = "";
    if (!atual || !op) return;
    const desmarca = marcada === op.chave && !motivo;
    const item = atual;
    const seguinte = visiveis[pos + 1]?.chave || "";
    escolher(item, op, motivo);
    /* só a marca avança; ação (chamar o assistente) e desmarcar ficam aqui */
    if (op.tipo === "marca" && !desmarca && seguinte) setTimeout(() => selecionar(seguinte), 250);
  }

  /* ── A LISTA ACOMPANHA A SELEÇÃO ─────────────────────────────────────── */
  let lista;
  /* ── A ALTURA DA COLUNA É A QUE SOBRA NA JANELA ────────────────────────
     Presa ao topo ela cabe na janela; antes de a página rolar, o título a
     empurra para baixo, e com a altura fixa as últimas linhas ficavam fora da
     tela (medido: a coluna começava a 242 px, com 776 de altura, numa janela
     de 900). A altura é a da janela menos onde a coluna começa AGORA, menos a
     barra da fila. */
  $effect(() => {
    if (!lista) return;
    let quadro = 0;
    const medir = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        if (getComputedStyle(lista).position !== "sticky") { lista.style.maxHeight = ""; return; }
        const fila = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--altura-fila")) || 0;
        const topo = Math.max(lista.getBoundingClientRect().top, 12);
        lista.style.maxHeight = Math.max(240, innerHeight - topo - fila - 12) + "px";
      });
    };
    medir();
    addEventListener("scroll", medir, { passive: true });
    addEventListener("resize", medir);
    return () => { cancelAnimationFrame(quadro); removeEventListener("scroll", medir); removeEventListener("resize", medir); };
  });
  $effect(() => {
    selecionado;
    lista?.querySelector('[aria-current="true"]')?.scrollIntoView?.({ block: "nearest" });
  });
  /* e o detalhe começa do topo: trocar de item e ficar no meio do anterior
     é ler a vaga errada */
  let palco;
  $effect(() => {
    selecionado;
    if (palco && palco.getBoundingClientRect().top < 0) palco.scrollIntoView({ block: "start" });
  });

  /* ── TECLADO, MOUSE, TRACKPAD ─────────────────────────────────────────── */
  $effect(() => {
    const noCampo = (e) => e.target?.closest?.("input, textarea, select, [contenteditable]");
    const tecla = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || noCampo(e)) return;
      if (e.key === "Escape") { menu = ""; return; }
      if (e.key === "j" || e.key === "J" || e.key === "ArrowRight") { e.preventDefault(); andar(1); }
      else if (e.key === "k" || e.key === "K" || e.key === "ArrowLeft") { e.preventDefault(); andar(-1); }
    };
    /* os botões laterais do mouse (3 volta, 4 avança) navegariam o HISTÓRICO
       da aba; aqui eles andam na lista */
    const lateral = (e) => {
      if (e.button !== 3 && e.button !== 4) return;
      e.preventDefault();
      if (e.type === "mouseup") andar(e.button === 4 ? 1 : -1);
    };
    const fora = (e) => { if (menu && !e.target?.closest?.(".p-leitor-menu")) menu = ""; };
    addEventListener("keydown", tecla);
    addEventListener("mousedown", lateral);
    addEventListener("mouseup", lateral);
    addEventListener("click", fora);
    return () => {
      removeEventListener("keydown", tecla);
      removeEventListener("mousedown", lateral);
      removeEventListener("mouseup", lateral);
      removeEventListener("click", fora);
    };
  });
  /* o gesto lateral do trackpad chega como roda HORIZONTAL. Soma até passar
     do limiar e anda um só: sem a trava, um gesto andaria cinco itens */
  const LIMIAR_DA_RODA = 140;
  let somaDaRoda = 0, travado = false;
  $effect(() => {
    if (!palco) return;
    const roda = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (travado) return;
      somaDaRoda += e.deltaX;
      if (Math.abs(somaDaRoda) > LIMIAR_DA_RODA) {
        andar(somaDaRoda > 0 ? 1 : -1);
        somaDaRoda = 0;
        travado = true;
        setTimeout(() => { travado = false; }, 700);
      }
    };
    palco.addEventListener("wheel", roda, { passive: false });
    return () => palco.removeEventListener("wheel", roda);
  });
  /* no telefone, o arrasto lateral do item */
  let toque = null;
  const pegar = (e) => { if (e.pointerType !== "mouse") toque = { x: e.clientX, y: e.clientY }; };
  const soltar = (e) => {
    if (!toque) return;
    const dx = e.clientX - toque.x, dy = e.clientY - toque.y;
    toque = null;
    if (Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 1.5) andar(dx < 0 ? 1 : -1);
  };

  const estadoDa = (it) => {
    const m = marcadaDe(it);
    if (!m) return null;
    const op = (opcoesDe(it) || []).find((o) => o.chave === m);
    return { recusa: op?.tom === "recusa", rotulo: op?.rotulo || m };
  };
</script>

<!-- o contêiner e a grade são dois: container query não alcança o próprio
     contêiner, e é a largura DELE (não a da janela) que decide o desenho —
     o leitor mora na rota larga do funil e na coluna estreita da tarefa -->
<div class="p-leitor"><div class="p-leitor-grade" data-com-item={atual ? "" : undefined}>
  <!-- ── A COLUNA DA LISTA ───────────────────────────────────────────── -->
  <aside class="p-leitor-lista" aria-label={"lista de " + rotuloDaLista} bind:this={lista}>
    {#if filtros.length}
      <div class="p-leitor-filtros" role="group" aria-label="filtrar">
        {#each filtros as f (f.chave)}
          <button type="button" class="c-chip" aria-pressed={filtro === f.chave}
            onclick={() => filtrar(f.chave)}>{f.rotulo}{#if f.quantos !== undefined}<span> {f.quantos}</span>{/if}</button>
        {/each}
      </div>
    {/if}
    <!-- a ordem é a de quem monta o leitor (D274): na rota do funil, a mesma
         da tabela e do início -->
    {#if ordenacoes.length > 1}
      <div class="p-leitor-ordem">
        <label>
          <span>Ordenar</span>
          <select class="p-campo" value={ordem.chave} onchange={(e) => ordenar(e.currentTarget.value)}>
            {#each ordenacoes as o (o.chave)}<option value={o.chave}>{o.rotulo}</option>{/each}
          </select>
        </label>
        {#if ordem.chave}
          <button type="button" class="c-chip" onclick={() => ordenar(ordem.chave)}
            title="inverter" aria-label={ordem.desc ? "de cima para baixo: maior primeiro" : "de cima para baixo: menor primeiro"}>{ordem.desc ? "↓" : "↑"}</button>
        {/if}
      </div>
    {/if}
    {#if itens.length > 8}
      <input class="p-campo p-leitor-procura" type="search" bind:value={procura}
        placeholder="Procurar nesta lista" aria-label="procurar nesta lista" />
    {/if}
    {#if !visiveis.length}
      <p class="p-vazio">{procura.trim() ? `Nada com “${procura}”.` : vazio}</p>
    {:else}
      <ul>
        {#each visiveis as it (it.chave)}
          {@const e = estadoDa(it)}
          <li>
            <button type="button" class="p-leitor-linha" aria-current={it.chave === selecionado ? "true" : undefined}
              data-estado={e ? (e.recusa ? "recusa" : "sim") : undefined} onclick={() => selecionar(it.chave)}
              title={it.dica || (it.sub ? `${it.titulo} — ${it.sub}` : it.titulo)}>
              <!-- UMA linha por item (D245): o título, e à direita a marca ou a
                   etapa. Com o título, a linha miúda e a etiqueta empilhados,
                   cabiam sete de 46 na coluna; o resto da linha do funil está
                   no `title` e no item aberto -->
              <!-- o número vem antes, miúdo: é por ele que o quadro do assistente
                   e o histórico falam do item (D257) -->
              {#if it.id}<span class="p-leitor-id">{it.id}</span>{/if}
              <b>{it.titulo}</b>
              {#if e}<strong>{e.recusa ? "✕" : "✓"} {e.rotulo}</strong>
              {:else if it.etiqueta}<em>{it.etiqueta}</em>{/if}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </aside>

  <!-- ── O ITEM ──────────────────────────────────────────────────────── -->
  <section class="p-leitor-palco" bind:this={palco} aria-label="item aberto"
    onpointerdown={pegar} onpointerup={soltar} onpointercancel={() => { toque = null; }}>
    {#if !atual}
      <p class="p-vazio p-leitor-escolha">{itens.length ? "Escolha um item na lista." : vazio}</p>
    {:else}
      <div class="p-leitor-barra">
        <div class="p-leitor-andar">
          <button type="button" class="c-chip p-leitor-voltar" data-sempre={voltarSempre ? "" : undefined} onclick={() => selecionar("")}>{voltar}</button>
          <button type="button" class="c-acao" disabled={pos <= 0} onclick={() => andar(-1)} aria-label="anterior">‹ Anterior</button>
          <span class="p-leitor-pos">{pos >= 0 ? `${pos + 1} de ${visiveis.length}` : "—"}</span>
          <button type="button" class="c-acao" disabled={pos >= visiveis.length - 1} onclick={() => andar(1)} aria-label="próxima">Próxima ›</button>
        </div>
        {#if ops.length}
          <div class="p-leitor-gestos">
            <div class="p-leitor-menu">
              <button type="button" class="c-acao" aria-expanded={menu !== ""} aria-haspopup="menu"
                onclick={(e) => { e.stopPropagation(); menu = menu ? "" : "mais"; }}>Mais ações ▾</button>
              {#if menu === "mais"}
                <div class="p-leitor-pop" role="menu" aria-label="todas as ações">
                  {#each ops as o (o.chave)}
                    {@const desfaz = o.tipo === "marca" && marcada === o.chave}
                    <button type="button" role="menuitem" data-recusa={o.tom === "recusa" ? "" : undefined}
                      data-destaque={o === principal ? "" : undefined} disabled={!!o.ocupado}
                      title={o.dica || undefined}
                      onclick={(e) => {
                        if (o.motivo && motivos.length && marcada !== o.chave) { e.stopPropagation(); menu = "motivo:" + o.chave; }
                        else escolherAqui(o);
                      }}>
                      <span>{(desfaz ? "✓ " : "") + (o.tom === "recusa" && desfaz ? "Desfazer descarte" : o.rotulo) + (o.motivo && motivos.length && marcada !== o.chave ? " ›" : "")}</span>
                      {#if o === principal}<em>próximo passo</em>{:else if o.ocupado}<em>{o.ocupado}</em>{/if}
                      {#if o.dica}<small>{o.dica}</small>{/if}
                    </button>
                  {/each}
                </div>
              {:else if menu.startsWith("motivo:")}
                {@const op = ops.find((o) => "motivo:" + o.chave === menu)}
                <div class="p-leitor-pop" role="menu" aria-label="por que descartar">
                  <span>Por quê?</span>
                  {#each motivos as m (m)}
                    <button type="button" role="menuitem" onclick={() => escolherAqui(op, m)}>{m}</button>
                  {/each}
                  <button type="button" role="menuitem" onclick={() => escolherAqui(op)}>Sem motivo</button>
                </div>
              {/if}
            </div>
            <!-- o descarte marcado se desfaz à vista, e não dentro do menu -->
            {#if ops.some((o) => o.tom === "recusa" && marcada === o.chave)}
              <button type="button" class="c-acao" aria-pressed="true"
                onclick={() => escolherAqui(ops.find((o) => o.tom === "recusa"))}>Desfazer descarte</button>
            {/if}
            {#if principal}
              <button type="button" class="c-acao c-acao-cheia" disabled={!!principal.ocupado}
                aria-pressed={principal.tipo === "marca" ? marcada === principal.chave : undefined}
                title={principal.dica || undefined} onclick={() => escolherAqui(principal)}
                >{principal.tipo === "marca" && marcada === principal.chave ? "✓ " : ""}{principal.rotulo}{#if principal.ocupado} · {principal.ocupado}{/if}</button>
            {/if}
          </div>
        {/if}
      </div>
      {#key atual.chave}
        <div class="p-leitor-item">{@render detalhe?.(atual)}</div>
      {/key}
    {/if}
  </section>
</div></div>
