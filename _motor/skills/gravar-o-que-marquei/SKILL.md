---
name: gravar-o-que-marquei
description: >-
  Grava na {base} as decisões que o {profissional} marcou no painel sem estar
  numa conversa — {andante} que passa para a etapa seguinte do funil e
  {andante} que sai, com o motivo. Lê a fila do painel, grava cada decisão pelas
  regras de sempre (etapa, histórico, funil, índices, contadores, e o arquivo
  morto para o que sai), confirma ao painel o que gravou e para. Não refaz a
  lista do dia, não abre link, não escreve mensagem, não julga nada. Use quando
  o {profissional} disser — grava o que eu marquei no painel · grava as minhas
  marcações · passa pra {base} o que eu decidi no painel · salva o que eu
  marquei · atualiza o que eu marquei — ou quando o botão do painel a chamar.
  Não é para a lista do dia, que é /{plugin}:o-que-fazer-hoje, nem para arrumar
  a {base} inteira, que é /{plugin}:organizar-{pasta-base}.
license: MIT
compatibility: >-
  Precisa da {base} e do painel do pack — a fila mora nele, e chega por
  `painel_inicio` e `painel_fila`. Sem o painel nesta sessão, diz isso em uma
  linha e não grava nada. Sem {base}, manda rodar /{plugin}:comecar.
allowed-tools: Read Glob Grep Write Edit
---

# Gravar o que eu marquei

## 1 · O que ela faz, e o que ela não faz

Na página inicial do painel o {profissional} decide quando quiser: {o-andante}
que está numa etapa do funil tem dois botões — passar para a etapa seguinte, e
descartar. O clique não grava na {base}: vai para uma fila do painel, e fica lá
até alguém gravar.

**Esta skill grava a fila, e só a fila.** Ela existe para isso custar pouco:
toda skill grava a fila ao começar, mas a do dia lê a {base} inteira para
depois refazer a lista — e gravar três marcas não pede isso.

Ela não refaz o `hoje.md` além de tirar dele o que saiu, não abre link, não
escreve mensagem e não julga: as decisões chegam tomadas.

## 2 · Antes de tudo

Leia no contrato, em `references/contrato/`, só o que ela usa:

```
3    as três regras — a 2 (procedência) e a 3 (aposentar)
4.1  o INDICE.md e os contadores     4.3  o funil.md e as etapas
4.4  o arquivo {do-item}             4.5  o arquivo {do-pessoa}
4.6  os dois índices                 10   como uma skill começa e termina
```

Os arquivos: `03-0-as-tres-regras.md`, `04-1-indice.md`, `04-3-funil.md`,
`{secao-arquivo-item}`, `04-5-arquivo-de-{pessoa}.md`,
`04-6-os-dois-indices.md` e `10-0-comeca-e-termina.md`. E
`references/painel.md`, a seção "A fila de decisões".

Depois, o `INDICE.md` da {base}, pela linha `{pasta-base}:`. Sem {base}: uma
linha dizendo isso, `/{plugin}:comecar`, e nada gravado.

**A fila vem do painel.** Chame `painel_inicio` com o caminho da {base}: ele
devolve `fila` quando há. Sem a ferramenta nesta sessão, diga em uma linha que
a fila mora no painel e que ele não está aberto aqui. Fila vazia, o mesmo, com
o motivo. Nos dois casos o fecho diz que nada foi gravado.

## 3 · O modo

As decisões já são do {profissional}: ele as tomou no painel, com o botão. Por
isso a skill é igual em `copiloto` e em `automatico` — grava sem perguntar de
novo. Reabrir uma decisão tomada seria pedir o mesmo clique duas vezes.

`## Decidi sozinho` só aparece se ela precisou escolher alguma coisa que a fila
não dizia, e quase nunca precisa.

## 4 · O passo a passo

### Passo 1 · Ler a fila

Cada decisão traz `item`, `gesto` (`etapa` ou `descartar`), `de`, `para`,
`motivo` e a `frase` pronta. Trate cada frase como dita no terminal agora, pelo
{profissional}.

Decisão com `nota` veio de um botão de uma tela de outra skill, apertado
depois que ela parou de esperar (D262). A nota é de quem perguntou: o arquivo
que ela deixou pronto antes da espera e o que trocar nele. **Siga-a junto da
passagem** — é o que torna o registro igual ao que a skill faria —, e cite o
arquivo na linha do `## Histórico`. Um `recado:` dentro da nota é dele, e
entra como ele escreveu.

### Passo 2 · Separar o que envelheceu

Decisão com `envelheceu: true` é de {um-andante} que já não está na etapa `de`:
mudou depois do clique, e `agora` diz onde está. **Não grave.** Ela entra no
fecho como uma linha, e é confirmada ao painel mesmo assim (passo 6) — a barra
do painel já avisou o {profissional}.

### Passo 3 · As passagens de etapa

Para cada `etapa`, no arquivo {do-andante}: a linha `etapa:` passa a `para`,
com a procedência `← {profissional}, no painel, AAAA-MM-DD`, e o `## Histórico`
ganha a linha da passagem, no formato da seção do arquivo. O valor antigo não se
apaga (Regra 2).

`para` que o `funil.md` não tem **não se grava**: nenhuma skill cria etapa
(seção 4.3). Diga em uma linha e deixe a decisão na fila.

### Passo 4 · O que saiu

`descartar` é a Regra 3, na ordem dela: a linha `aposentado:` no alto do
arquivo, o arquivo para `arquivo-morto/{pasta-andantes}/`, a linha do
`_indice.md` para `## Arquivo morto`, e ela some do `funil.md` e do `hoje.md`.
O motivo é o da fila; sem motivo, `descartado no painel` — não pergunte.

### Passo 5 · As vistas, uma vez só

Depois de todas as decisões, e não a cada uma: as linhas do `funil.md` que
mudaram (sai da etapa velha, entra na nova com `· desde` de hoje), o
`_indice.md` e os contadores do `INDICE.md`. As vistas são derivadas (Regra 1):
o arquivo {do-andante} já é o dono do fato.

### Passo 5b · As respostas que chegaram atrasadas

`painel_inicio` pode trazer `respostas`: telas que o {profissional} respondeu
depois de a skill que as mostrou parar de esperar. As marcas com gesto **já
estão na fila** (`na_fila`) e você as gravou nos passos anteriores. O que sobrou
— um texto, um formulário, uma chave sem gesto — é resposta à tela em
`titulo`, e não é seu: diga em uma linha o que chegou e para qual skill, e
deixe a resposta lá. Confirme com `respostas_lidas` **só** as respostas em que
tudo o que havia era marca com gesto.

### Passo 6 · Confirmar ao painel

`painel_fila` com `gravadas`: os ids que você gravou, **e** os que envelheceram.
O que falhou fica de fora — continua na fila, e o painel continua mostrando.

## 5 · O formato da saída

Uma linha de abertura com a conta, uma linha por decisão, e o fecho:

````markdown
Gravei 3 das 4 decisões que você marcou no painel.

- <id> (<apelido>) — passou de “<etapa>” para “<etapa seguinte>”
- <id> (<apelido>) — foi para o arquivo morto: <motivo>
- <id> (<apelido>) — não gravei: mudou depois da marca, hoje está em “<etapa>”

## Guardei
- ~/{pasta-base}/{pasta-andantes}/<arquivo> — a etapa e o histórico
- ~/{pasta-base}/arquivo-morto/{pasta-andantes}/<arquivo> — aposentado
- ~/{pasta-base}/funil.md, _indice.md e INDICE.md — as vistas e os contadores

## Falta saber
- <o que ela notou de torto e não era dela consertar>
````

Nada de bloco para colar: o trabalho desta skill é gravar o que já foi
decidido, e não um texto para {o-pessoa} (contrato §10).

## 6 · Onde ela para

**Ela não julga.** Fila vazia não vira sugestão do que marcar — julgar é
conversa, e acontece no painel ou em `/{plugin}:{skill-de-julgar}`.

**Ela não refaz a lista do dia.** Tira do `hoje.md` o que foi aposentado, e só.
A lista nova é `/{plugin}:o-que-fazer-hoje`.

**Ela não arruma o resto.** O que ela notar de errado fora das decisões vai
para `## Falta saber` numa linha, e quem conserta é
`/{plugin}:organizar-{pasta-base}`.
