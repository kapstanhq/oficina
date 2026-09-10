---
name: perfil-de-cliente
description: >-
  Escreve o `perfil.md` da carteira — quem vale a pena procurar, por quê, e o
  que desqualifica —, a partir dos clientes que o prospector já fechou e
  das perdas que ele já teve. Faz de cinco a oito perguntas, uma por vez, e
  cada critério sai com a razão escrita ao lado; o que não dá para justificar
  vira `## O que eu não sei ainda` em vez de virar regra. Grava
  `~/carteira/perfil.md` e mais nenhum arquivo. Use quando o prospector
  disser "quem eu devo procurar", "qual é o meu cliente ideal", "monta meu
  ICP", "estou falando com empresa errada", "perdi três seguidas, o que elas
  tinham em comum", "vale a pena essa conta?", "quero refazer o perfil", "meu
  perfil está desatualizado" — ou quando outra skill acusar que o `perfil.md`
  não existe. Não é ela que estuda uma conta específica
  (/prospeccao:estudar-conta), nem que escreve mensagem
  (/prospeccao:escrever-abordagem).
license: MIT
compatibility: >-
  Precisa de uma carteira montada (/prospeccao:comecar) para gravar o
  `perfil.md`. Sem carteira ela ainda faz o trabalho: as perguntas e o perfil
  saem na tela, e o `## Guardei` diz que nada foi gravado. Não abre link, não
  lê a internet e não precisa de conector nenhum — o que ela usa é o que o
  prospector já sabe e o que a carteira já tem.
allowed-tools: Read Glob Grep Write Edit
---

# Escrever o perfil

## 1 · O que ela faz, e o que ela não faz

Ela escreve **a régua que todas as outras leem**. Depois que este arquivo
existe, `/prospeccao:estudar-conta` sabe o que procurar,
`/prospeccao:escrever-abordagem` sabe o que dizer, e `/prospeccao:o-que-fazer-hoje`
sabe o que é conta parada e o que é conta que nunca devia ter entrado.

Ela **não** adivinha o perfil a partir da carteira. A carteira mostra quem o
prospector procurou, não quem ele deveria procurar — e um perfil derivado
dela só repete o erro que ele já cometeu, agora por escrito. O que ela usa é o
que ele **fechou** e o que ele **perdeu**, que é a única evidência que existe.

Ela **não** escreve perfil de quem nunca vendeu nada. Se ele não tem cliente
fechado, o perfil é hipótese — e ela diz isso, escreve a hipótese em
`## O que eu não sei ainda`, e segue. Hipótese declarada bate certeza
inventada, e é a diferença entre um arquivo que se corrige em três meses e um
que se defende.

## 2 · Antes de tudo

1. lê `~/carteira/INDICE.md` — `references/contrato/10-0-comeca-e-termina.md`
   diz como começar. Não existe: uma linha e `/prospeccao:comecar`
2. lê a linha `modo:`
3. **lê o `perfil.md`, se ele existir.** Existe? Isto não é escrever do zero: é
   revisar. Mostre o que está lá, pergunte o que mudou, e mexa só no que ele
   disser. Perfil reescrito por cima apaga a razão que alguém levou meses para
   descobrir
4. lê `contatos/_indice.md` e o `funil.md` para saber **quem virou cliente** —
   é dessa lista que saem as perguntas do passo 3. Nenhum? O passo 3 muda, e o
   passo 4 diz como

O formato do arquivo está em `references/contrato/04-9-o-perfil.md`, e o teto
dele em `references/contrato/09-0-os-tetos.md`. O gabarito vazio está em
`references/modelos/perfil.md`.

## 3 · O modo

`copiloto` — o padrão, e o modo em que esta skill trabalha melhor. Ela pergunta
uma coisa de cada vez e mostra o perfil crescendo.

`automatico` — ela **continua perguntando**. É a única coisa que ela faz, e
automático aqui seria escrever a régua no lugar de quem vende. O que muda é o
resto: ela escolhe sozinha como agrupar as respostas, decide o que vira
critério e o que vira `## O que eu não sei ainda`, e declara cada escolha em
`## Decidi sozinho` (contrato §5).

## 4 · O passo a passo

### Passo 1 · Os três que fecharam

Comece pelo que existe, não pelo que se imagina:

> Me diga as três empresas que viraram cliente, ou as que chegaram mais perto.
> Só o nome, por enquanto — eu pergunto o resto uma de cada vez.

Menos de três? Trabalhe com o que houver e **diga que é pouco**, em uma linha,
sem sermão: com um caso o perfil é hipótese, com três é padrão, e a diferença
aparece em `## O que eu não sei ainda`.

Nenhum? Pule para o passo 4 e escreva o perfil da **intenção** dele — quem ele
QUER atender —, marcando o arquivo inteiro como hipótese na última seção. É um
perfil pior, e é melhor que nenhum: sem ele, `/prospeccao:estudar-conta` não tem
contra o que medir.

### Passo 2 · O que elas tinham em comum

Uma pergunta por vez, e **nunca mais de três nesta execução** (contrato §8).
Escolha as três que mais separam, na ordem:

```
tamanho          quantas pessoas tinham, mais ou menos? É o critério que mais
                 elimina, e o mais fácil de conferir de fora

quem decidiu     quem assinou, e quem trouxe você para dentro. Cargo, não nome
                 — é o cargo que se procura na próxima empresa

o que estava     o que tinha acabado de acontecer lá quando você chegou?
acontecendo      troca de sistema, vaga aberta, rodada, gente nova na área.
                 É o gancho, e é o que faz a hora ser agora e não em março
```

Toda pergunta traz o motivo na mesma frase — é o que ensina o ofício enquanto
a skill trabalha:

```
ruim   Qual o e-mail dela?
bom    Você tem o e-mail da Carla? Sem ele a abordagem só sai pelo LinkedIn,
       que tem teto de caracteres e some no meio de vinte outras.
```

### Passo 3 · O que deu errado

Esta é a pergunta que ninguém faz, e é a que mais economiza tempo:

> E as que **não** deram certo — as que você abordou e não foram para lugar
> nenhum, ou que viraram proposta e morreram? O que elas tinham?

O que sai daqui vai para `## O que desqualifica`, e vale mais que a lista de
cima: `## Quem vale` diz onde procurar, `## O que desqualifica` diz o que
**não** abrir, e é a segunda que faz a fila caber num dia.

Duas coisas que aparecem quase sempre e merecem ser perguntadas se ele não
disser:

- **empresa que vende o mesmo que ele** — vira concorrente, não cliente
- **empresa que já tem time montado para aquilo** — não compra, contrata

### Passo 4 · Escrever, e mostrar

Escreva `~/carteira/perfil.md` pelo formato da seção 4.9, e **mostre o arquivo
inteiro na tela**. É curto de propósito: se ele não couber numa tela, ele não
vai ser lido antes de abordar, e um perfil que ninguém lê é um arquivo morto
com data de hoje.

Três coisas que a régua cobra aqui:

- **todo critério de `## Quem vale` tem uma linha em `## Por que`.** Critério
  sem razão é palpite escrito bonito, e ele não sobrevive ao primeiro trimestre
  ruim: quando a fila secar, é a razão que decide o que afrouxar
- **toda linha de `## Por que` leva procedência** (contrato §3) — e a origem
  mais comum aqui é `← prospector, <hoje>`, porque quem sabe é ele
- **o que ele não soube responder vira `## O que eu não sei ainda`**, com a
  pergunta escrita como pergunta. Nunca um critério com cara de apurado: campo
  inventado aqui vira conta errada abordada por três meses

### Passo 5 · O que isto muda na carteira

Fecha dizendo, em duas ou três linhas, o que o perfil acabou de habilitar — e
com o comando de verdade, não o do exemplo:

```
o que eu faço hoje?
    /prospeccao:o-que-fazer-hoje lê a carteira inteira e monta a lista do dia,
    na ordem do que faz perder a janela

estuda a E-001 (VetorBank, Porto Alegre)
    /prospeccao:estudar-conta lê o que é público e grava fato com procedência
    — o que não achar vira ?

escreve a abordagem para a P-001 (Carla Menezes)
    /prospeccao:escrever-abordagem usa o que a carteira sabe e o gancho mais
    recente, e confere o nao-perturbe.md antes
```

**Ela não reclassifica a carteira sozinha.** Contas que já estão lá e que o
perfil novo desqualifica **não** são movidas por esta skill: ela conta quantas
são, em uma linha, e diz que quem faz isso é `/prospeccao:organizar-carteira`,
com ele olhando. Perfil novo que aposenta quinze contas em silêncio é a
primeira vez que ele deixa de confiar no arquivo.

## 5 · O que perguntar, e como

Cinco a oito perguntas na execução inteira, uma por vez, e nunca mais de três
seguidas sem mostrar alguma coisa pronta. Skill que abre com formulário de oito
campos é abandonada na primeira execução, e não volta.

Escolha entre dois e quatro caminhos usa a UI de perguntas do harness — botões,
não prosa —, com o custo escrito em cada opção:

```
Como quer abordar a P-017 (Carla Menezes)?

  Curta, para o LinkedIn    4 linhas e um gancho só · pronto agora
  Completa, para e-mail     12 linhas com o caso e o número · preciso do e-mail dela
  As duas                   pronta agora, e a de e-mail fica com um ? no endereço
```

**Quando não perguntar:** o fato está no `INDICE.md` (`o que eu vendo:`,
`setores em que já vendi:`), está no perfil antigo, ou não muda o arquivo. Aí
use, e cite de onde veio.

## 6 · O formato da saída

O perfil inteiro na tela, e então o fecho do contrato §10:

## Guardei
- ~/carteira/perfil.md — criado, 5 critérios e 4 desqualificadores

## Falta saber
- se o porte certo é 80 ou 150 — três casos é pouco para separar
- que cargo decide na indústria; nos dois casos financeiros foi o CFO

## 7 · Onde ela para

**Ela não estuda conta nenhuma.** Nem para "testar o perfil". Quem lê o que é
público sobre uma empresa é `/prospeccao:estudar-conta`, e ela é a única com
ferramenta de web neste pack.

**Ela não escreve mensagem.** A abordagem é de
`/prospeccao:escrever-abordagem`, o estudo da conta é de
`/prospeccao:estudar-conta`, a lista do dia é de
`/prospeccao:o-que-fazer-hoje`. Ela monta a carteira de onde as três tiram o
que dizem.

**Ela não aposenta nem reclassifica conta.** Conta o que o perfil novo
desqualifica e manda para `/prospeccao:organizar-carteira`, que é onde aposentar
tem os quatro passos da regra 3.

**Ela não decide o preço nem o tamanho do que ele vende.** Perfil é sobre quem
compra; o que se vende está no `INDICE.md`, e mudar isso é decisão dele.

**Ela não usa o que a carteira mostra como se fosse evidência.** Vinte contas
de um setor na carteira provam que ele procurou vinte, não que aquele setor
compra. Só `virou cliente` e `disse não` contam — e ela diz isso quando ele
perguntar por que não usou o resto.
