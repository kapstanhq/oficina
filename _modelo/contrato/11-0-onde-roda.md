## 11 · Onde esta skill roda

O `SKILL.md` é padrão aberto, e este pack roda em mais de uma ferramenta. O que
muda de uma para outra não é o contrato: é o que existe embaixo dele.

```
Claude Code · Codex CLI · app do ChatGPT · Copilot · Cursor
  tudo funciona no transporte `local`, que é o único em que a {base}
  se MANTÉM. Ver o aviso da seção 1: no `drive` a {base} se cria e
  não se atualiza

chat do Claude e chat do ChatGPT na web
  não há pasta no computador: funcionam as skills que trabalham com o que
  for COLADO na conversa, e as que dependem da {base} não funcionam

o conector de WhatsApp (seções 7 e 7.1)
  só onde há linha de comando: Claude Code, Codex CLI, Cursor. Nos chats
  da web a conversa entra colada como sempre
```

Sem {base} nenhuma, estas entregam o trabalho e não gravam nada:

| skill | o que ela ainda faz com o que for colado |
|---|---|
| <<preencher: as skills do ofício que funcionam só com o texto colado, uma por linha>> | |

E estas não funcionam, porque o trabalho delas **é** a {base}:

| skill | do que ela depende |
|---|---|
| `comecar` | monta a {base} — sem transporte, não há onde montar |
| `o-que-fazer-hoje` | lê a {base} inteira para ordenar o dia |
| `retomar-contato` | conta os dias de silêncio e lê as retomadas anteriores |
| `organizar-{pasta-base}` | é a manutenção da {base} |

**Quem trabalha sem gravar diz isso.** O `## Guardei` do fecho (seção 10) vira
uma linha só: `- nada foi gravado — você está sem {base} aqui`. Trabalho que o
{profissional} acha que ficou guardado e não ficou é pior que trabalho não feito.

---
