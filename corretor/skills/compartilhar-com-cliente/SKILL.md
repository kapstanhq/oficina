---
name: compartilhar-com-cliente
description: >-
  Monta uma vista — o pedaço da carteira que um cliente pode ver — e a
  compartilha com ele no Drive, só para leitura. O que falta, de quem, desde
  quando; o que já chegou; o que foi combinado. É derivada da carteira e refeita
  a cada execução, então o corretor não mantém dois lugares. Mostra o que
  vai ficar visível e para quem ANTES de aplicar a permissão. Use quando o
  corretor disser — manda pra ele o que falta · ele fica perguntando toda
  semana como está · queria que ele visse o andamento · como eu mostro isso pra
  ele sem ficar mandando print · faz um resumo pra mandar · ele pediu um
  relatório · quero que ele acompanhe. Ela não dá acesso à carteira: cria uma
  vista separada. Não é a cobrança em si, que é /corretor:cobrar-o-que-falta,
  nem a lista do dia, que é /corretor:o-que-fazer-hoje.
license: MIT
compatibility: >-
  Monta a vista nos dois transportes; COMPARTILHAR só existe no Drive, porque no
  computador não há com quem. No `local` ela salva em ~/carteira/vistas/, diz que
  o compartilhamento precisa do Drive, e para aí — o trabalho sai inteiro do
  mesmo jeito e nada é prometido a mais. Precisa do
  conector do Drive com permissão de compartilhar; sem ela, entrega a vista para
  o corretor compartilhar à mão. Nunca concede escrita, e nunca
  compartilha pasta — só o arquivo da vista.
allowed-tools: Read Glob Grep Write Edit
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/compartilhar-com-{pessoa}/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# Compartilhar com o cliente

## 1 · O que ela faz, e o que ela não faz

O corretor responde a mesma pergunta toda semana: **"e aí, como está?"**.
Ele responde por mensagem, de memória, e a resposta é diferente a cada vez
porque a memória é diferente a cada vez.

Esta skill troca isso por **um lugar que o cliente abre sozinho**. Não é um
aplicativo, não é um portal e não é um login: é um arquivo de texto no Drive do
corretor, com permissão de leitura para uma pessoa, refeito a cada
execução.

**A carteira passa a ter duas pontas.** A de dentro continua igual — os
arquivos, o `_bruto/`, as três regras. A de fora é a vista, e ela é derivada:

```
        a carteira                      a vista
        ──────────                      ───────
   clientes/…  ──┐
   imoveis/…    ──┼──▶  derivar  ──▶  vistas/C-017-joana-ribeiro.md
   funil.md           ──┤                        │
   hoje.md            ──┘                        └──▶  leitura, para uma pessoa
   _bruto/            ──✕  nunca
```

**O que ela não é:** não é acesso à carteira, não é uma pasta compartilhada, e
não é colaboração. O cliente **lê**; quem escreve é o corretor, sempre.
Duas pessoas escrevendo no mesmo lugar é o ponto em que a carteira deixa de ter
dono — e o contrato inteiro se apoia nela ter um.

## 2 · Antes de tudo

1. `~/carteira/INDICE.md`. Não existe: uma linha e `/corretor:comecar`.
2. A linha `modo:` e **a linha do transporte**. Se for `local`, leia a seção 7
   antes de seguir: ela monta a vista e não compartilha.
3. `references/contrato/04-8-a-vista.md` — **inteira**. É ela que diz o formato,
   o que entra e o que nunca entra. Este arquivo não repete a tabela: ele a
   aplica.
4. `references/contrato/03-0-as-tres-regras.md` — a regra 1 é o motivo de a
   vista ser derivada.
5. `references/contrato/10-0-comeca-e-termina.md` — o fecho. No `local` ela
   termina sem compartilhar, e o `## Guardei` continua sendo o título.

**É um TODO**: derivar, mostrar, gravar, compartilhar.

## 3 · O modo

`copiloto` — monta a vista, mostra o conteúdo **e a permissão que vai aplicar**,
e espera. Nada é compartilhado sem confirmação.

`automatico` — refaz e **reaplica** vistas que já existem, sem perguntar. Mas
**nunca compartilha com alguém pela primeira vez sozinha**: dar acesso a uma
pessoa nova é irreversível na prática — o que ela viu, viu —, e isso não é
decisão de automático. Vista nova sempre para e pergunta, nos dois modos.

`## Decidi sozinho` traz o que ela reescreveu e o que deixou como estava.

## 4 · O passo a passo

### Passo 1 · Escolher o cliente, e um só

Uma execução, uma pessoa. Sem nome, ela mostra quem tem vista e quem tem
pendência aberta, e pergunta.

**Nunca em lote.** Compartilhar com cinco pessoas de uma vez é cinco decisões de
permissão tomadas com uma confirmação, e basta uma estar errada.

### Passo 2 · Derivar

Leia o arquivo do cliente, os imóveis que o histórico dele cita, o `funil.md` e o
`hoje.md`. Monte as três seções do §4.8 — `## Falta`, `## Combinado`,
`## Onde estamos`.

Três coisas na hora de escrever, e as três são de tradução:

- **Sem sigla e sem id solto.** `V-071 (casa 3 dorm, Azenha)` vira o apelido. Quem lê não
  conhece o vocabulário da carteira e não deveria precisar conhecer.
- **Sem etapa de funil.** "Em negociação" é palavra de dentro. Vira uma frase em
  português que diz o que está acontecendo.
- **Sem o que ele não sabe.** A régua do §4.8: entra o que essa pessoa já sabe
  ou já deveria saber. **Se uma linha pode surpreender quem lê, ela está no
  arquivo errado** — e a surpresa aqui não é uma boa notícia, é uma conversa que
  o corretor não teve.

### Passo 3 · A prévia, e ela tem duas metades

A primeira é o **conteúdo**: a vista inteira, como o cliente vai ler.

A segunda é a **permissão**, e é a que ninguém lembra de mostrar:

```
arquivo     vistas/C-017-joana-ribeiro.md
quem        <o e-mail exato, escrito por extenso>
acesso      leitura
alcance     só quem tem este e-mail — não é "qualquer um com o link"
```

**Mostrar a permissão antes de aplicar é o ponto mais importante da skill.**
Permissão errada no Drive vaza mais rápido do que qualquer erro de texto, e não
tem desfazer útil: o que foi lido, foi lido. Um e-mail digitado errado
compartilha com um estranho, e ninguém descobre.

### Passo 4 · Gravar e compartilhar, nesta ordem

1. **Grave a vista** em `~/carteira/vistas/`. Ela é derivada, então sobrescrever
   é o certo — não versione, não acumule.
2. **Só então aplique a permissão**, e só a do arquivo. **Nunca a da pasta**: a
   pasta `vistas/` tem a vista de todas as pessoas, e compartilhá-la mostra a de
   um cliente para outro.
3. **Confira o que ficou aplicado** e diga em uma linha. "Compartilhei" sem
   conferir é a frase que a pessoa acredita e que não aconteceu.

### Passo 5 · O aviso, que é opcional e é curto

Se o corretor quiser avisar, ela escreve a mensagem — três linhas, com o
link, dizendo o que a pessoa vai achar lá e que ele continua no WhatsApp de
sempre.

O aviso **não substitui a conversa**. Quem manda um link e some fez o cliente
sentir que virou um número, e é o oposto do que a vista existe para fazer.

## 5 · O que perguntar, e como

**Duas perguntas, e a primeira só acontece uma vez por pessoa:**

1. **O e-mail**, quando não estiver no arquivo. Peça-o por extenso e **repita-o
   na prévia** para conferência. Não deduza a partir do nome, e não use um
   e-mail que apareceu numa conversa sem ser o dela — é assim que se compartilha
   com a pessoa errada.
2. **Confirmar a permissão**, sempre, na primeira vez com aquela pessoa.

Nada mais. O que entra na vista não se pergunta: está no §4.8, e perguntar
transferiria para o corretor uma decisão que o contrato já tomou.

## 6 · O formato da saída

O trabalho é a vista mais a permissão. O aviso, quando houver, sai em bloco
próprio para copiar.

````markdown
# A vista de C-017 (Joana Ribeiro) — 2026-09-09

## O que ele vai ler

```
# o que falta para fechar o negócio — quem entrega cada documento, e o que já chegou

Atualizado em 2026-09-09 por corretor.

## Falta
- [ ] a matrícula do V-071 (casa 3 dorm, Azenha), pedida ao proprietário em 2026-08-13
- [x] o que já chegou — em 2026-09-01

## Combinado
- <uma linha por combinado, com a data>

## Onde estamos
<uma frase, sem jargão>
```

## A permissão que vou aplicar

arquivo   ~/carteira/vistas/C-017-joana-ribeiro.md
quem      <e-mail por extenso>
acesso    leitura · só quem tem este e-mail

## Guardei
- ~/carteira/vistas/C-017-joana-ribeiro.md — refeita
- ~/carteira/clientes/C-017-joana-ribeiro.md — a data e para quem

## Falta saber
- o e-mail de C-017 (Joana Ribeiro) — sem ele a vista fica só no Drive dele
````

## 7 · Onde ela para

**Ela não compartilha pasta.** Só o arquivo da vista, um por pessoa. A pasta
`vistas/` guarda a de todo mundo, e uma permissão nela mostra a vista de um
cliente para outro — o erro mais fácil de cometer e o mais caro de descobrir.

**Ela não concede escrita, nem "comentar", em nenhum modo.** Leitura, e só.

**Ela não usa "qualquer um com o link".** É a opção que resolve todos os
problemas de e-mail e cria um pior: um link que vaza numa conversa fica aberto
para sempre, e o Drive não avisa. Se o corretor pedir, ela diz isso em uma
linha e faz o que ele mandar — a decisão é dele, mas informada (a régua do
`informar em vez de impedir`).

**No `local` ela para no Passo 4.** Monta a vista, salva em
`~/carteira/vistas/`, e diz que compartilhar precisa do Drive. Não tenta anexar,
não tenta mandar arquivo por WhatsApp e não sugere serviço de terceiro — o
transporte é uma escolha do corretor, feita uma vez, e não é esta skill que
a muda.

**Ela nunca põe `_bruto/` numa vista.** Nem trecho, nem citação, nem "conforme
combinado em 12/08" copiado da conversa. A vista é derivada; o que a derivação
descartou não volta por citação.

**Ela não revoga sozinha.** Se o corretor quiser tirar o acesso, ela mostra
como e faz quando ele mandar — mas não decide que uma relação acabou porque o
cliente foi aposentado na carteira. Aposentar é da carteira; revogar é da
relação, e as duas coisas não andam juntas.
