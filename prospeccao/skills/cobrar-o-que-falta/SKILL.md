---
name: cobrar-o-que-falta
description: >-
  Varre a carteira e lista o que está parado esperando OUTRA PESSOA — quem
  ficou de mandar, o que era, quando foi pedido e há quantos dias não chega — e
  escreve, para cada um, a cobrança que dá um jeito de ser fácil de responder em
  vez de constranger. Ordena por quem trava mais. Nunca cobra duas vezes na
  mesma semana, nunca cobra quem já respondeu, e grava a tentativa para a
  próxima execução saber. Com o conector ela também manda, uma por vez, com o
  texto e o destinatário na tela antes. Use quando o prospector disser — o
  que eu estou esperando? · quem ficou de me mandar alguma coisa · ninguém me
  respondeu · cobra o pessoal aí · o que está travado por causa dos outros ·
  preciso do documento e não chegou · dá um toque em quem está me devendo ·
  o que falta para eu fechar isso. Não é para quem sumiu do funil, que é
  /prospeccao:retomar-contato, nem para a lista do dia, que é
  /prospeccao:o-que-fazer-hoje.
license: MIT
compatibility: >-
  Precisa da carteira; sem ela diz isso em uma linha e manda rodar
  /prospeccao:comecar. Sem o conector ela escreve as cobranças para copiar e quem
  manda é o prospector — o trabalho sai inteiro do mesmo jeito. Com o
  conector ela manda uma por vez, e só para quem já escreveu antes: primeira
  mensagem para um número novo sai do celular dele. Precisa gravar no arquivo de
  quem deve, senão a próxima execução repete a cobrança de hoje.
allowed-tools: Read Glob Grep Write Edit
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/cobrar-o-que-falta/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# Cobrar o que falta

## 1 · O que ela faz, e o que ela não faz

Ela cuida de **uma classe só de pendência: a que depende de outra pessoa.**

Isso é o oposto do resto do pack. `/prospeccao:o-que-fazer-hoje` lista o que o
prospector tem que fazer; esta lista o que ele **não pode fazer** porque está
esperando alguém — e transforma cada espera numa mensagem que é fácil de
responder.

Quatro coisas que ela é, e uma que ela não é:

- **É a pendência com dono.** Toda linha tem nome: quem ficou de mandar.
- **É a pendência com data.** Quando foi pedido, e há quantos dias não chega.
- **É a pendência com consequência.** O que trava enquanto não chega.
- **É uma mensagem, não um lembrete.** O trabalho dela termina em texto pronto.
- **Não é retomada.** Quem sumiu do funil sem dever nada é
  `/prospeccao:retomar-contato`. Aqui a pessoa **deve uma coisa concreta**, e a
  diferença muda a mensagem inteira: uma traz novidade, esta traz o pedido.

## 2 · Antes de tudo

1. `~/carteira/INDICE.md`. Não existe: uma linha e `/prospeccao:comecar`.
2. A linha `modo:`.
3. `references/contrato/07-1-a-mensagem-sai.md` — **antes de escrever a primeira
   mensagem**, não depois. É ela que governa o par de ferramentas do envio, a
   prévia e o que a skill nunca faz sozinha.
4. `references/contrato/04-2-hoje.md`, para saber o formato do que já está
   registrado como pendente.
5. `references/contrato/10-0-comeca-e-termina.md` — o fecho, e os três títulos
   fixos. Nenhum deles se inventa, nem quando o resultado é uma fila vazia.

**É um TODO**: varrer, montar a fila, escrever e (se houver conector) mandar são
quatro passos, e três deles são demorados.

## 3 · O modo

`copiloto` — monta a fila inteira, mostra, e **para antes de mandar qualquer
coisa**. O prospector escolhe quem recebe.

`automatico` — escreve todas e, com conector, oferece mandar **uma por uma**,
sempre com o texto e o nome na tela. Automático não é lote: o contrato §7.1 é
explícito, e a razão é dele — uma cobrança errada em lote queima cinco relações
de uma vez, e não há como desfazer.

`## Decidi sozinho` traz o que ela escolheu: quem entrou na fila, quem ficou de
fora e por quê.

## 4 · O passo a passo

### Passo 1 · Achar o que está parado esperando alguém

Três lugares, nesta ordem, e o terceiro é o que ninguém lembra:

1. **`hoje.md`** — o que já foi registrado como pendente. Aqui o dono e a data
   costumam estar escritos.
2. **Os `?` com dono** nos arquivos de `contas/` e `contatos/`. Um
   `?` que diz `← pedido a fulano em <data>` é uma pendência de terceiro
   disfarçada de campo vazio, e é a maior fonte delas.
3. **O que foi prometido em conversa e nunca virou campo.** Em `_bruto/`, a
   frase "te mando amanhã" de alguém que não mandou. **Só conta o que tem data**
   — sem data não dá para dizer que atrasou, e cobrar sem atraso é assédio.

Uma pendência é `a resposta da proposta do E-083 (Móveis Bertoldo, Bento Gonçalves), enviada em 2026-08-13` — quem, o quê, desde quando.

### Passo 2 · Tirar da fila quem não deve ser cobrado

Nesta ordem, e cada corte tem um motivo que não é delicadeza:

- **Já respondeu.** Se o campo foi preenchido ou o arquivo chegou depois do
  pedido, a pendência morreu e ninguém apagou a linha. Cobrar aqui é o pior erro
  possível: prova que não se olhou.
- **Cobrado há menos de uma semana.** Duas cobranças em cinco dias não aceleram
  nada; ensinam a pessoa a ignorar as próximas.
- **Cobrado duas vezes sem resposta.** Passa a ser conversa do prospector,
  não de mensagem — ela para, diz isso, e sugere ligar.
- **Ainda não venceu.** Pedido de ontem com prazo de uma semana não é pendência.
  Se não houver prazo combinado, use o do ofício em §4.2 do laudo; sem isso,
  **sete dias** é o padrão, e ela declara que usou o padrão.

### Passo 3 · Ordenar por quem trava mais

Não é por data. É por **consequência**: primeiro o que impede uma coisa de
acontecer nesta semana; depois o que atrasa; por último o que só falta.

A ordem se explica em uma linha por item — o prospector precisa saber por que
aquilo está no topo, senão ele lê a fila de baixo para cima.

### Passo 4 · Escrever a cobrança

A regra de ouro, e ela é a diferença entre esta skill e um robô de lembrete:

> **Cobrança boa devolve o caminho, não a culpa.**

Quatro coisas em cada mensagem, e nada além:

1. **O que é**, com o nome exato da coisa — nunca "aquele documento".
2. **Por que agora**, ligado ao que a pessoa quer: o que destrava quando chegar.
3. **O jeito mais fácil de responder** — mandar foto serve, responder "não
   consegui" serve. Quem oferece uma saída recebe resposta; quem só pede recebe
   silêncio.
4. **Uma pergunta fechada no fim**, para a resposta caber em uma linha.

O que **nunca** entra: "conforme solicitado", "reiterando", "estou no aguardo",
contagem de quantas vezes já pediu, e qualquer frase que faça a pessoa se
sentir devedora. O tom é o de quem está resolvendo junto.

### Passo 5 · Gravar antes de mandar

A tentativa vai para o arquivo de quem deve — **antes** do envio, não depois. Se
gravar depois, um envio que falha no meio deixa a carteira dizendo que cobrou
quando não cobrou, e a próxima execução pula quem nunca foi cobrado.

Uma linha, com data, canal e o que foi pedido. É ela que faz o Passo 2
funcionar na próxima rodada.

## 5 · O que perguntar, e como

**Uma pergunta, no máximo, e só em `copiloto`:** quando duas pendências são da
mesma pessoa, ela pergunta se manda **uma mensagem com as duas** ou duas
mensagens. Nunca decide isso sozinha em copiloto — duas cobranças seguidas para
a mesma pessoa no mesmo minuto leem como cobrança dobrada.

Quando não souber o canal de alguém, ela **não pergunta**: escreve a mensagem
para copiar e diz que não achou o contato. Perguntar telefone no meio de uma
varredura para a execução inteira por um dado que está a um comando de
distância.

## 6 · O formato da saída

A fila primeiro, e cada mensagem no seu bloco de código, sozinha — o
prospector copia e cola. Nada de moldura desenhada.

````markdown
# O que falta, e de quem — 2026-09-09

**4 pendências: 2 travando algo esta semana, 1 atrasada, 1 só faltando.**
**1 fora da fila: cobrada anteontem.**

## Trava esta semana

**1 · a resposta da proposta do E-083 (Móveis Bertoldo, Bento Gonçalves), enviada em 2026-08-13**
há 27 dias · sem ela o negócio não anda
```
<a mensagem, sozinha, pronta para colar>
```

**2 · …**

## Atrasado

## Só falta

## Fora da fila
- P-017 (Carla Menezes) · cobrado em 2026-09-07, há 2 dias — espere até o dia 14
- P-017 (Carla Menezes) · já respondeu em 2026-09-05; tirei a pendência

## Guardei
- ~/carteira/contatos/P-017-carla-menezes.md — a tentativa de hoje
- ~/carteira/hoje.md — as pendências que saíram da fila

## Falta saber
- o prazo combinado para a resposta da proposta do E-083 (Móveis Bertoldo, Bento Gonçalves), enviada em 2026-08-13 — usei o padrão de 7 dias
````

O bloco da mensagem sai **sozinho, pronto para copiar, sem comentário dentro**
(CONTRATO §6), e é **um bloco por pessoa**: duas pendências da mesma pessoa
podem virar uma mensagem, mas duas pessoas nunca dividem um bloco.

## 7 · Onde ela para

**Ela não cobra dinheiro.** Parcela, honorário e comissão atrasada não são
pendência de documento: envolvem contrato, juros e uma conversa que não cabe
numa varredura. Ela lista, marca como financeiro e **não escreve a mensagem** —
quem escreve é o prospector, que sabe o que foi combinado.

**Ela não manda para quem nunca escreveu.** Contrato §7.1: a primeira mensagem
para um número novo sai do celular do prospector. Aqui isso quase nunca
aparece — quem deve alguma coisa já falou com ele —, mas quando aparecer, ela
escreve para copiar e diz por quê.

**Ela não inventa prazo combinado.** Se não achar a data em que a coisa foi
pedida, a pendência **não entra na fila**: vira uma linha em `## Falta saber`
perguntando quando foi. Cobrar sem saber desde quando é o jeito mais rápido de
cobrar quem entregou.

**Ela não decide que a pendência morreu.** Se o campo continua `?` mas há uma
conversa em `_bruto/` que parece respondê-lo, ela **não fecha**: aponta a
conversa e manda `/prospeccao:organizar-carteira`, que é quem extrai fato com
procedência. Fechar por dedução é inventar dado, e a regra 2 não abre exceção
para conveniência.
