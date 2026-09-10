## 11 · Onde esta skill roda

O `SKILL.md` é padrão aberto, e este pack roda em mais de uma ferramenta. O que
muda de uma para outra não é o contrato: é o que existe embaixo dele.

```
Claude Code · Codex CLI · app do ChatGPT · Copilot · Cursor
  tudo funciona no transporte `local`, que é o único em que a carteira
  se MANTÉM. Ver o aviso da seção 1: no `drive` a carteira se cria e
  não se atualiza

chat do Claude e chat do ChatGPT na web
  não há pasta no computador, e o `drive` não substitui uma: funcionam
  as TRÊS skills que trabalham com o que for COLADO na conversa, e as
  sete que dependem da carteira não funcionam — nem com Drive ligado

o conector de WhatsApp (seções 7 e 7.1)
  só onde há linha de comando: Claude Code, Codex CLI, Cursor. Em
  prospecção ele é o canal DEPOIS que a pessoa responde, quase nunca o
  da primeira mensagem — e a razão está na seção 7.1: quem nunca trocou
  mensagem com você não recebe pelo conector, e é assim que quase toda
  conta nova chega. A primeira abordagem sai por e-mail ou pelo
  LinkedIn, e o bloco para copiar é a saída que nunca falta
```

Sem carteira nenhuma, três entregam o trabalho e não gravam nada:

| skill | o que ela ainda faz com o que for colado |
|---|---|
| `perfil-de-cliente` | as respostas coladas viram o `perfil.md` na tela — e ele fica com você para colar num arquivo |
| `estudar-conta` | o site ou a página colada vira a lista de fatos com procedência, e o que falta vira `?` |
| `escrever-abordagem` | a conta colada vira a mensagem; some o cruzamento com o que já foi mandado, que é a parte que evita repetir o gancho |

E sete não funcionam, porque o trabalho delas **é** a carteira:

| skill | do que ela depende |
|---|---|
| `comecar` | monta a carteira — sem transporte, não há onde montar |
| `o-que-fazer-hoje` | lê a carteira inteira para ordenar o dia |
| `retomar-contato` | conta os dias de silêncio e lê os ganchos já usados |
| `organizar-carteira` | é a manutenção da carteira |
| `laudo-da-carteira` | mede a carteira contra o contrato |
| `importar-a-conversa` | grava em `_bruto/` e distribui o fato |
| `cobrar-o-que-falta` | lê o que foi prometido e não chegou |

**Quem trabalha sem gravar diz isso.** O `## Guardei` do fecho (seção 10) vira
uma linha só: `- nada foi gravado — você está sem carteira aqui`. Trabalho que o
prospector acha que ficou guardado e não ficou é pior que trabalho não feito.

**E há uma coisa que o chat da web não faz, e ela é a mais importante deste
pack:** sem carteira não há `nao-perturbe.md`, e sem ele a
`/prospeccao:escrever-abordagem` não tem como saber quem pediu silêncio. Ali
ela escreve a mensagem e **diz, em uma linha, que não conferiu a lista** — quem
confere é você, antes de mandar. É a única coisa deste pack que não se degrada
em silêncio, porque a consequência dela não é sua.
