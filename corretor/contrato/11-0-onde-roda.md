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
  as CINCO skills que trabalham com o que for COLADO na conversa, e as
  cinco que dependem da carteira não funcionam — nem com Drive ligado

o conector de WhatsApp (seções 7 e 7.1)
  só onde há linha de comando: Claude Code, Codex CLI, Cursor. Nos chats
  da web não existe, e lá a conversa entra colada como sempre — o que não
  tira nenhuma skill do ar. Ler e ENVIAR andam juntos: onde ele existe, as
  duas coisas existem; onde não existe, o bloco para copiar é a saída, e é
  ela que nunca falta
```

Sem carteira nenhuma, cinco entregam o trabalho e não gravam nada:

| skill | o que ela ainda faz com o que for colado |
|---|---|
| `anunciar-imovel` | a ficha ou o link colado vira as duas versões do anúncio |
| `conferir-matricula` | a matrícula colada vira a lista do que consta nela |
| `gravar-video-do-imovel` | o imóvel colado vira o roteiro plano a plano |
| `documentos-do-negocio` | o tipo do negócio vira o checklist; some o que a carteira já tinha marcado |
| `responder-lead` | a conversa colada vira a mensagem; some o cruzamento com os imóveis da carteira |

E cinco não funcionam, porque o trabalho delas **é** a carteira:

| skill | do que ela depende |
|---|---|
| `comecar` | monta a carteira — sem transporte, não há onde montar |
| `o-que-fazer-hoje` | lê a carteira inteira para ordenar o dia |
| `retomar-contato` | conta os dias de silêncio e lê as retomadas anteriores |
| `montar-visita` | cruza o que o cliente já viu e por que descartou cada imóvel |
| `organizar-carteira` | é a manutenção da carteira |

**Quem trabalha sem gravar diz isso.** O `## Guardei` do fecho (seção 10) vira
uma linha só: `- nada foi gravado — você está sem carteira aqui`. Trabalho que o
corretor acha que ficou guardado e não ficou é pior que trabalho não feito.

E quem não funciona diz por quê em uma linha, sem pedir desculpa duas vezes:
“Isto lê a sua carteira inteira, e aqui eu não chego nela. No Claude Code, ou
com a carteira no Drive, funciona.”
