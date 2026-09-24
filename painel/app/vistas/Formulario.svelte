<script>
  /**
   * FORMULÁRIO — o que a PESSOA preenche ou corrige, campo a campo.
   *
   * É a sétima vista, e a justificativa que o teto cobra está no
   * `servidor.mjs`: revisar o que vai ser respondido EM NOME da pessoa, antes
   * de sair, não cabe em `ficha` (só mostra) nem em `texto` (um bloco só).
   *
   * ── ELE É A FICHA VIRADA DO AVESSO ────────────────────────────────────
   * A `ficha` mostra o que o agente sabe, com a procedência ao lado, e marca
   * em âmbar o `?` — o que ele declarou não saber. Aqui é a mesma informação
   * com o gesto invertido: o que tem seta é o que a pessoa CONFERE, e o `?`
   * é o que só ela RESPONDE. Por isso o `?` nasce VAZIO e marcado, e nunca
   * com o ponto de interrogação dentro da caixa: um `?` editável é um valor,
   * e voltaria como resposta.
   *
   * ── A PROCEDÊNCIA SOME QUANDO O VALOR MUDA ────────────────────────────
   * `← perfil.md` ao lado de um número que a pessoa acabou de trocar é uma
   * seta apontando para o lugar errado. No instante em que o campo deixa de
   * ser o que o agente mandou, a linha passa a dizer que foi mexido aqui —
   * que é, palavra por palavra, a origem que o contrato dá ao que o próprio
   * profissional disse.
   *
   * ── VOLTAM TODOS OS CAMPOS, MEXIDOS OU NÃO ────────────────────────────
   * Pela mesma razão do `texto`: o que sai tem de ser o que estava na tela.
   * Devolver só o que mudou obrigaria o agente a lembrar do resto, e
   * "lembrar" é onde a prévia e o envio divergem.
   *
   *   texto · texto-longo · escolha   string, `""` quando vazio
   *   data                            `AAAA-MM-DD`, que é a data do contrato
   *   numero                          número, `""` quando vazio
   *   sim-nao                         `true` · `false` · `""` sem resposta
   *   varias                          lista de chaves, `[]` quando vazia
   *
   * Vazio é `""` e não `?`: o `?` é a convenção da BASE, e quem decide se um
   * campo em branco vira `?` no arquivo é o agente, com as regras dele.
   */
  import { untrack } from "svelte";

  let { dados = {}, agir = () => {}, extra = $bindable({}), origem = true } = $props();

  const TIPOS = ["texto", "texto-longo", "numero", "data", "sim-nao", "escolha", "varias"];

  /* campo sem `chave` não tem por onde voltar. Ele não é desenhado — seria
     uma caixa que aceita texto e o joga fora —, e a tela diz quantos caíram. */
  const campos = $derived((dados.campos || []).filter((c) => c && c.chave));
  const semChave = $derived((dados.campos || []).length - campos.length);

  const naoSabe = (v) => v === undefined || v === null ||
    ["", "?"].includes(String(v).trim());

  /* `opcoes` chega como lista de textos ou de `{ chave, rotulo }`. O contrato
     só diz `opcoes`, e os dois jeitos são o que um agente escreve sem pensar:
     o texto solto é chave e rótulo de uma vez. */
  const opcoesDe = (c) => (c.opcoes || []).map((o) =>
    (o && typeof o === "object")
      ? { chave: String(o.chave ?? o.rotulo ?? ""), rotulo: String(o.rotulo ?? o.chave ?? "") }
      : { chave: String(o), rotulo: String(o) });

  const tipoDe = (c) => (TIPOS.includes(c.tipo) ? c.tipo : "texto");

  function inicial(c) {
    const v = c.valor;
    switch (tipoDe(c)) {
      case "varias":
        return Array.isArray(v) ? v.map(String) : [];
      case "sim-nao": {
        if (v === true || v === false) return v;
        const t = String(v ?? "").trim().toLowerCase();
        if (["sim", "true", "s"].includes(t)) return true;
        if (["não", "nao", "false", "n"].includes(t)) return false;
        return "";
      }
      case "numero": {
        if (naoSabe(v)) return "";
        const n = Number(v);
        return Number.isFinite(n) ? n : "";
      }
      default:
        return naoSabe(v) ? "" : String(v);
    }
  }

  /* ── O ESTADO NASCE UMA VEZ, E A CASCA GARANTE QUE BASTA ──────────────
     Os valores saem dos `dados` na montagem e daí em diante são da pessoa.
     Reler `dados` a cada mudança apagaria o que ela digitou na primeira
     atualização que chegasse. O que impede o estado de atravessar para a
     tela SEGUINTE é a casca, que remonta a vista a cada versão do documento
     (`{#key doc.versao}` em `Painel.svelte`). O `untrack` diz isso ao
     compilador, que de outro modo avisa — com razão, em qualquer outro
     componente — que `dados` só é lido uma vez. */
  let valores = $state(untrack(() => Object.fromEntries(
    (dados.campos || []).filter((c) => c && c.chave).map((c) => [c.chave, inicial(c)]))));

  /* `<input type="number">` vazio chega como `null` pelo `bind:value` */
  const vazio = (v) => v === "" || v === null || v === undefined ||
    (Array.isArray(v) && !v.length);
  const mudou = (c) =>
    JSON.stringify(valores[c.chave] ?? "") !== JSON.stringify(inicial(c));

  const faltam = $derived(campos.filter((c) => c.obrigatorio && vazio(valores[c.chave])));

  /* ── O QUE SOBE PARA A CASCA ──────────────────────────────────────────
     Escreve o objeto inteiro, sem ler `extra` — a razão está no `Texto`: um
     efeito que lê o que escreve é um laço que não dá erro, esquenta a aba.

     As chaves com `_` são recado para a CASCA, e ela as tira antes de mandar:
     `_faltam` é o que segura o botão de tom `forte`. Vai a lista de rótulos e
     não um booleano porque "falta alguma coisa" manda a pessoa procurar, e o
     nome do campo manda preencher. */
  $effect(() => {
    const saida = {};
    for (const c of campos) {
      const v = valores[c.chave];
      saida[c.chave] = Array.isArray(v) ? [...v] : (v === null || v === undefined ? "" : v);
    }
    const ditos = Object.fromEntries(Object.entries(comentarios)
      .map(([k, v]) => [k, String(v || "").trim()]).filter(([, v]) => v));
    extra = { campos: saida, ...(Object.keys(ditos).length ? { comentarios: ditos } : {}),
      _faltam: faltam.map((c) => c.rotulo || c.chave) };
  });

  /* o comentário de UM campo (D259): instrução ao assistente, fora do valor.
     Só existe onde a skill pediu — `comentar` no campo ou nos `dados`. */
  let comentarios = $state({});
  let comentando = $state({});
  const comenta = (c) => c.comentar === true || (dados.comentar === true && c.comentar !== false);

  function alternar(chave, opcao) {
    const atual = valores[chave] || [];
    valores[chave] = atual.includes(opcao)
      ? atual.filter((x) => x !== opcao) : [...atual, opcao];
  }
</script>

{#if !campos.length}
  <p class="c-nota p-falta">O agente pediu um formulário e não mandou campo nenhum.</p>
{/if}

{#if semChave > 0}
  <p class="c-nota p-falta">
    {semChave === 1 ? "Um campo veio" : `${semChave} campos vieram`} sem
    <code>chave</code> e não {semChave === 1 ? "foi desenhado" : "foram desenhados"}:
    sem ela a resposta não tem por onde voltar.
  </p>
{/if}

<div class="c-caixa">
  <div class="c-faixa" style="display:flex;flex-direction:column;gap:var(--s3)">
    {#each campos as c (c.chave)}
      {@const tipo = tipoDe(c)}
      {@const opcoes = opcoesDe(c)}
      {@const falta = c.obrigatorio && vazio(valores[c.chave])}
      {@const id = "campo-" + c.chave}
      <div class="p-campo-linha">
        <label class="c-selo" for={id} id={id + "-r"}>{c.rotulo || c.chave}
          {#if c.obrigatorio}<span style="color:var(--fio-forte)"> · obrigatório</span>{/if}
        </label>

        {#if tipo === "texto-longo"}
          <textarea {id} class="p-campo" class:p-campo-falta={falta} rows="4"
            bind:value={valores[c.chave]}></textarea>
        {:else if tipo === "numero"}
          <input {id} type="number" inputmode="decimal" class="p-campo p-campo-curto"
            class:p-campo-falta={falta} bind:value={valores[c.chave]} />
        {:else if tipo === "data"}
          <input {id} type="date" class="p-campo p-campo-curto"
            class:p-campo-falta={falta} bind:value={valores[c.chave]} />
        {:else if tipo === "sim-nao"}
          <div role="group" aria-labelledby={id + "-r"} class="p-item-acoes" style="grid-column:auto">
            {#each [[true, "Sim"], [false, "Não"]] as [v, rotulo] (rotulo)}
              <!-- clicar de novo DESMARCA: "sem resposta" é um estado que a
                   pessoa precisa poder recuperar depois de um clique errado -->
              <button type="button" class="c-chip" aria-pressed={valores[c.chave] === v}
                onclick={() => (valores[c.chave] = valores[c.chave] === v ? "" : v)}
              >{rotulo}</button>
            {/each}
          </div>
        {:else if tipo === "escolha" && opcoes.length > 7}
          <!-- acima de sete, a fileira de chips vira parede e a pessoa para
               de ler; a lista suspensa é pior de ver e melhor de achar -->
          <select {id} class="p-campo p-campo-curto" class:p-campo-falta={falta}
            bind:value={valores[c.chave]}>
            <option value="">—</option>
            {#each opcoes as o (o.chave)}<option value={o.chave}>{o.rotulo}</option>{/each}
          </select>
        {:else if tipo === "escolha"}
          <div role="group" aria-labelledby={id + "-r"} class="p-item-acoes" style="grid-column:auto">
            {#each opcoes as o (o.chave)}
              <button type="button" class="c-chip" aria-pressed={valores[c.chave] === o.chave}
                onclick={() => (valores[c.chave] = valores[c.chave] === o.chave ? "" : o.chave)}
              >{o.rotulo}</button>
            {/each}
          </div>
        {:else if tipo === "varias"}
          <div role="group" aria-labelledby={id + "-r"} class="p-item-acoes" style="grid-column:auto">
            {#each opcoes as o (o.chave)}
              <button type="button" class="c-chip"
                aria-pressed={(valores[c.chave] || []).includes(o.chave)}
                onclick={() => alternar(c.chave, o.chave)}>{o.rotulo}</button>
            {/each}
          </div>
        {:else}
          <input {id} type="text" class="p-campo" class:p-campo-falta={falta}
            bind:value={valores[c.chave]} />
        {/if}

        {#if (tipo === "escolha" || tipo === "varias") && !opcoes.length}
          <span class="c-nota p-falta">sem <code>opcoes</code> — não há o que escolher</span>
        {/if}
        {#if c.tipo && tipo !== c.tipo}
          <span class="c-nota p-falta">tipo <code>{c.tipo}</code> não existe — tratei como texto</span>
        {/if}

        <!-- a procedência vale para o valor que o agente mandou, e só para ele -->
        {#if mudou(c)}
          <span class="p-de">← mexido aqui, agora</span>
        {:else if c.de && origem}
          <span class="p-de">← {c.de}</span>
        {:else if naoSabe(c.valor) && vazio(valores[c.chave])}
          <span class="p-de p-falta">← só você sabe</span>
        {/if}
        {#if c.nota}<span class="c-nota">{c.nota}</span>{/if}
        {#if comenta(c)}
          {#if comentando[c.chave] || comentarios[c.chave]}
            <label class="p-recado" style="width:100%">
              <span class="c-nota">Comentário para o assistente — não vai para o formulário</span>
              <textarea class="p-campo p-comentario" rows="2"
                placeholder="O que mudar neste campo e por quê."
                bind:value={comentarios[c.chave]}></textarea>
            </label>
          {:else}
            <button type="button" class="p-comentar" onclick={() => (comentando[c.chave] = true)}>Comentar este campo</button>
          {/if}
        {/if}
      </div>
    {/each}
  </div>
</div>
