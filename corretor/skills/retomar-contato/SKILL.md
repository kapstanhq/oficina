---
name: retomar-contato
description: >-
  Varre a carteira e lista quem parou de responder — há quantos dias, em que
  etapa parou e o que já viu — e escreve, para cada um, a mensagem de retomada
  que traz uma novidade concreta em vez de cobrar resposta. Nunca repete o
  ângulo da última tentativa, deixa em paz quem já foi retomado duas vezes sem
  responder, e grava a tentativa no arquivo do cliente para a próxima execução
  saber. Com o conector de WhatsApp ligado ela também manda — uma por uma,
  depois de mostrar na tela para quem vai, o texto inteiro e por que aquela
  pessoa está na lista. Use quando o corretor diz “quem sumiu?”, “quem parou
  de responder”, “preciso dar um toque em alguém”, “semana fraca, quem eu
  chamo”, “o que eu
  mando pra quem visitou e não voltou”, “quero reativar cliente antigo”, “tem
  gente parada há tempo demais aí?” ou pede a mensagem para um cliente
  específico que ficou sem resposta.
license: MIT
compatibility: >-
  Precisa da carteira, numa pasta do computador — ela conta os dias de
  silêncio de cada cliente e lê as retomadas anteriores no histórico dele. Sem
  carteira, NÃO funciona: não há o que varrer, nem onde gravar a tentativa para
  a próxima execução não repetir o ângulo. Não abre link. Sem conector de
  WhatsApp — que é o normal — escreve o texto e para; com o conector ligado,
  manda uma por vez, e só depois de mostrar na tela o texto inteiro e para
  quem vai.
allowed-tools: Read Glob Grep Write Edit
---

# Retomar contato

## 1 · O que ela faz, e o que ela não faz

Ela varre a carteira, lista quem parou de responder — há quantos dias, em que
etapa parou e o que já viu — e escreve, para cada um, uma mensagem que traz
**novidade** e usa um ângulo diferente do da última tentativa.

O corretor pode chamar com o nome de um cliente, e aí ela olha só esse; sem
nome nenhum, varre a carteira inteira.

Ela não escreve mensagem sem novidade (retomada sem novidade é cobrança, e
cobrança queima o contato), não insiste com quem já foi retomado duas vezes sem
responder, e não inventa imóvel, preço nem prazo para ter o que dizer.

**Mandar é a segunda saída, e ela só existe com o conector.** Sem ele — o caso
normal, e o de toda ferramenta de chat na web — ela entrega os blocos prontos
para copiar e para. Com ele, ela monta a tela do passo 8 e manda o que o
corretor aprovar, uma mensagem por vez. O bloco não some em nenhum dos dois
casos: é o padrão, e é o que sobra quando a ponte cai.

---

## 2 · Antes de tudo

**Leia o contrato por seção, em `references/contrato/`** — o número da seção
é o começo do nome do arquivo: `04-5-arquivo-de-cliente.md` é a 4.5. Ele é o
padrão comum das dez skills do pack, e nada de formato se decide aqui; o
inteiro está em `references/CONTRATO.md`. O que esta usa direto:

```
1    onde a carteira mora — os dois transportes — e a primeira leitura
2    id e apelido — V-071 (casa 3 dorm, Azenha), sempre os dois juntos
3    as três regras: não duplicar, procedência, aposentar
4.2  hoje.md          4.5  o arquivo do cliente        4.7  _bruto/
6    o que sai para o WhatsApp, e o que sai por e-mail
8    a ordem de busca, e o teto de três perguntas
9    os tetos          10   como uma skill começa e termina
```

Os arquivos: `01-0-onde-a-carteira-mora.md`, `02-0-id-e-apelido.md`,
`03-0-as-tres-regras.md`, `04-2-hoje.md`, `04-5-arquivo-de-cliente.md`,
`04-7-o-bruto.md`, `06-0-o-que-sai.md`, `08-0-quando-perguntar.md`,
`09-0-os-tetos.md` e `10-0-comeca-e-termina.md`.

Depois leia o **`INDICE.md` da carteira**, pela primeira leitura da seção 1 do
contrato: procura no computador e, não achando, a pasta `carteira` no Drive. A
linha `carteira:` dele diz o transporte — `local` ou `drive` —, e **toda
leitura e toda gravação desta execução vão por ele**. Se não há `INDICE.md` em
lugar nenhum, a carteira não existe: diga isto e pare, sem criar pasta nenhuma.

```
Não achei a carteira, nem no computador nem no seu Drive. Rode
/corretor:comecar — ele monta com você e termina com um imóvel e um cliente
de verdade lá dentro. Depois isto aqui funciona.
```

Do `INDICE.md` você tira seis coisas: `modo:`, o `nome:` de `## Quem sou` (é
a voz das mensagens), o `canal padrão com cliente:`, o `horário de visita que
costumo oferecer:` — este é o que fecha a mensagem sem inventar agenda — e as
duas linhas de `## O que está conectado`: `WhatsApp:` e `envio:`.

`WhatsApp:` diz `sim` só depois de testada: aí existe conector, e ele dá uma
fonte a mais no passo 1 e uma saída a mais no passo 8. Diz `não`, ou não
existe: siga sem ele, que é o normal, e **não mencione o conector** — esta
skill não é lugar de oferecer instalação.

`envio:` só existe embaixo do `sim`, e é ela que governa o passo 8 (contrato,
7.1). Linha ausente, ou valor que você não reconhece: **`pergunta sempre`**.

```
pergunta sempre           mostra a tela e espera a escolha. É o padrão
responder sem perguntar   não muda nada aqui — retomada não é resposta a
                          conversa viva, é o corretor começando de novo
não                       a skill nem oferece: entrega os blocos e para
```

**A data de hoje vem do ambiente, não da carteira.** A última linha do
`hoje.md` pode ser de duas semanas atrás, e todo o cálculo de silêncio desta
skill depende de hoje estar certo.

---

## 3 · O modo

Leia a linha `modo:` do `INDICE.md`. Aceite `automatico` e `automático`.
Qualquer outro valor, linha ausente ou arquivo ilegível: **copiloto**.

| | copiloto | automático |
|---|---|---|
| a lista de quem parou | entrega sempre, antes de qualquer pergunta | idem |
| quem recebe mensagem | ele escolhe, na UI de perguntas | os cinco primeiros da lista |
| ângulo de cada mensagem | escolhe sozinha nos dois modos — é o trabalho dela | idem |
| quem está no limite de duas retomadas | mostra e não escreve | idem |
| quem recebe o envio | a tela do passo 8 | idem — o automático não pula a tela |
| fecho | `## Guardei` e `## Falta saber` | mais `## Decidi sozinho` |

Esta skill **não tem exceção ao automático** — a única do pack é
`/corretor:conferir-matricula`. Se em algum ponto parecer que ela precisa de
uma, pare e pergunte; não invente a exceção.

**E o `modo:` não governa o envio.** No automático ela escolhe quem recebe e
qual ângulo usa sem perguntar; mandar continua passando pela tela do passo 8,
porque quem ligou o automático para o trabalho não ligou para a boca dele
(contrato, 7.1). Quem manda no envio é a linha `envio:`, e ela não tem valor
que faça retomada sair sem ser mostrada.

---

## 4 · O passo a passo

É tarefa de três ou mais passos demorados — lê a carteira inteira e escreve em
vários arquivos. **Mostre o TODO na tela** com os passos 1 a 7. O passo 8 entra
no TODO só quando há conector: sem ele, não existe.

### Passo 1 · Quem está parado

Leia, nesta ordem: `funil.md` (dá a etapa e o `desde`), `clientes/_indice.md`
(dá a coluna `último contato`) e depois o arquivo de cada cliente candidato. **O
arquivo vence a vista** — se o `_indice.md` diz 5 de agosto e o histórico do
cliente tem uma linha de 12, vale a do arquivo, e o `_indice.md` entra na lista
do que reescrever.

O que se mede é o **silêncio dele**, não o último toque do corretor. A última
vez que o cliente falou está, em ordem de busca:

```
1  o conector, quando a linha diz sim: chame `estado_da_ponte` UMA vez, aqui
   (é o pré-voo do contrato §7 — ponte parada faz esta skill listar quem
   respondeu ontem), e então ultima_interacao com o telefone do
   arquivo do cliente devolve a data E de quem foi a última palavra — que é a
   pergunta inteira, sem adivinhação
2  a última linha de ## Histórico que registra fala ou ato dele
3  ## Combinado — o que ele marcou ou prometeu, com a data
4  ## Imóveis mostrados — a última reação registrada (“gostou do pátio”)
5  a última mensagem dele na conversa em _bruto/ (leia o fim do arquivo)
6  a coluna último contato do _indice.md — e aí diga que a conta é aproximada,
   porque essa coluna não distingue quem falou
```

Não deu para saber quem falou por último, em nenhum dos seis: o cliente entra
na lista com `parado há ?` e vira uma linha em `## Falta saber`. Não estime.

**O conector viu o que a carteira não sabia?** Acontece, e é informação nova,
não defeito: o cliente respondeu e ninguém anotou. Diga na lista — “respondeu
dia 19, e a carteira não registrou” — e ponha uma linha em `## Falta saber`.
**Não grave a conversa aqui**: quem traz conversa para `_bruto/` é
`/corretor:organizar-carteira`, e uma skill que grava fora do escopo dela é a
que ninguém desconfia quando o arquivo aparece estranho.

E o contrário também vale: sem telefone no arquivo do cliente, o conector não
serve para ele — não tem como achar a conversa. Siga pelos outros cinco.

### Passo 2 · Quando é silêncio, por etapa

O prazo muda com o que está em jogo. Estes são os cortes, e não se inventa
outro:

| etapa | entra na lista a partir de | por quê |
|---|---|---|
| proposta | 3 dias | proposta parada esfria e vira “vou pensar” |
| visitou | 5 dias | viu o imóvel e sumiu — é o contato mais quente que existe |
| visita marcada | só depois que a data passou | antes disso é confirmação, e quem cobra é o `hoje.md` |
| em conversa | 7 dias | |
| novo lead | 3 dias | lead sem resposta em três dias já falou com outro corretor |
| fechado | não entra | |

Passou de **120 dias** sem responder: não é assunto desta skill. Diga em uma
linha que ele é caso de aposentar pela regra 3 e que quem faz isso é
`/corretor:organizar-carteira`. Não aposente aqui.

### Passo 3 · A ordem da lista

Primeiro pela etapa, na ordem da tabela acima — quem visitou vale mais que quem
nunca respondeu, e é por isso que a lista não é cronológica. Empate entre dois
da mesma etapa: sobe quem **tem novidade** para receber (passo 4); persistindo,
sobe quem está parado há mais tempo.

### Passo 4 · O ângulo — e ele é a razão de a skill existir

Para cada um, procure novidade nesta ordem e **pare na primeira que existir**:

```
1  imóvel novo que bate       entrou na carteira DEPOIS do último contato dele e
                              passa no filtro de ## O que procura
2  mudou o que ele viu        no ## Histórico ou no estado: de um imóvel que está
                              em ## Imóveis mostrados — preço, estado, foto nova
3  chegou o que ele pediu     um ? do arquivo do imóvel virou fato: iptu,
                              condomínio, planta, matrícula conferida
4  a pergunta que ficou       ele deixou pergunta sem resposta, ou prometeu algo
                              em ## Combinado e não mandou
5  o prazo dele               ## O que procura tem prazo (“mudar antes das aulas”)
                              e o calendário andou o bastante para ser assunto
6  nenhuma                    NÃO escreve mensagem
```

**O filtro do ângulo 1**, e ele é literal: `estado:` é `à venda` ou `para
alugar` (nunca reservado, vendido, alugado ou fora do mercado); o preço cabe na
`faixa:`; o bairro está em `bairros:`; atende `o que precisa ter:`; não viola `o
que não aceita:`; e o imóvel **não** está em `## Imóveis mostrados` nem foi
citado em retomada anterior. Faltou qualquer um desses campos no cliente — está
como `?` — o ângulo 1 não se usa: mandar imóvel que “parece” bater é como
recomeçar do zero.

Só chame de **novo** o que entrou na carteira depois do último contato dele. O
que é antigo e nunca foi mostrado é “não te mostrei ainda”, e a mensagem diz
assim.

**Escassez que não está escrita no arquivo não se escreve na mensagem.** “Já
tem outro interessado”, “é o último dessa faixa”, “vai sair rápido”: só se
`estado: reservado` ou uma linha de `## Histórico` disser isso, com data. Sem
isso, é pressão inventada — e é o corretor que atende o telefone depois.

### Passo 5 · O que já foi tentado

Antes de escrever, leia no `## Histórico` do cliente as linhas que começam com
`retomada` (formato no passo 7) e conte **quantas vieram depois da última
manifestação dele**:

```
0   caminho livre
1   escreva — e o ângulo TEM de ser diferente do da linha anterior
2+  não escreve. Respeita o silêncio (passo 6)
```

O ângulo repetido é o defeito que esta skill existe para não cometer. Se o
único ângulo disponível é o mesmo da última vez, o cliente vai para “sem ângulo
novo” — não se manda o mesmo assunto com outras palavras.

**Cadência mínima: 7 dias.** Quem recebeu retomada há menos de uma semana não
entra na lista, mesmo com ângulo novo. Duas mensagens na mesma semana é o que
faz o cliente arquivar a conversa.

### Passo 6 · Quem sai da lista, e o que se diz

Duas retomadas seguidas sem resposta: **não escreva a terceira.** Ele sai da
lista de mensagens e vira uma linha em `## Travado` no `hoje.md` (passo 7),
sugerindo arquivar. Diga o motivo em uma frase, sem rodeio:

```
C-019 (Rita Camargo) — duas retomadas sem resposta, a última em 2026-08-05.
A terceira não traz ele de volta e queima o contato. Sugestão: deixar parado
até ele aparecer, ou arquivar por /corretor:organizar-carteira.
```

Também não recebe mensagem quem caiu no ângulo 6 (nenhuma novidade). Aí a saída
não é uma mensagem: é **o que falta para haver uma**, em uma linha — “o arquivo
dela não tem `faixa:` nem `bairros:`, então não dá para saber o que é novidade
para ela”.

### Passo 7 · Escrever

Até **cinco mensagens por execução**, e o número é o mesmo com o conector
ligado. Ele é o tamanho de uma tela que alguém lê inteira antes de aprovar:
acima disso o corretor rola, para de ler o texto de cada um e aprova no
atacado — que é exatamente o que esta skill existe para não fazer. Corretor com
pressa também não copia quinze, e mensagem escrita e não mandada envelhece na
tela. O resto fica na lista, com a posição, para a próxima rodada.

O formato é o da seção 6 do contrato — WhatsApp ou e-mail conforme o `canal:` do
arquivo do cliente. O que é próprio da retomada:

```
linha curta     o que MUDOU, com o primeiro nome. Nunca o silêncio como assunto
parágrafo       o que ele já viu e o que ele disse que queria, na boca dele —
                depois a novidade, e a diferença entre as duas
o link          sozinho na linha, um só (seção 6)
pergunta fácil  sobre a novidade, nunca sobre a demora. Sim ou não, ou duas
                opções de horário — e o horário sai de ## Como eu trabalho
```

Abertura proibida, e cada uma pela mesma razão — todas fazem do silêncio o
assunto: “tudo bem?”, “passando para saber se ainda tem interesse”, “não sei se
você viu minha mensagem”, “desculpa insistir”, “faz tempo que a gente não
fala”, “ainda está procurando?”.

Toda afirmação da mensagem sai de um campo com procedência. Preço com mais de
30 dias entra na mensagem assim mesmo, e **fora do bloco** vai a linha: “o
preço do V-083 (apto 2 dorm, Menino Deus) é de 12 de julho — confira antes de
mandar”.

### Passo 8 · A tela do envio

Só existe com `WhatsApp: sim` e `envio:` diferente de `não`. Sem os dois o
trabalho acabou no passo 7: os blocos estão prontos para copiar, e a skill não
pede desculpa duas vezes por não mandar.

O `estado_da_ponte` já foi chamado no passo 1 — é o pré-voo do contrato §7 —, e
o que ele disse lá vale aqui. Ponte fora do ar: entregue os blocos, diga em uma
linha e siga; nada nesta skill depende dela. As ferramentas da ponte não estão em
`allowed-tools`, e a primeira chamada pede permissão: é normal, e é bom que
peça.

**Prepare antes de mostrar.** Um `preparar_envio(conversa, texto)` por pessoa —
`conversa` é uma só, e é no tipo desse parâmetro que o lote deixa de existir. É
o `preparar_envio` que responde o teto, e quem for recusado por teto aparece
entre os que ficaram de fora, com o número e como mudá-lo, **antes** de o
corretor aprovar. Cinco por execução cabem no teto de partida de seis conversas
por hora; duas execuções na mesma hora não cabem, e a segunda diz isso na cara
em vez de falhar no fim.

O par sai por pessoa, sempre nesta ordem, com a tela no meio:

```
preparar_envio(conversa, texto)             devolve o código da prévia
<a tela, e a escolha do corretor>
enviar_mensagem(previa, conversa, texto)    os três, batendo byte a byte
```

**O que a tela carrega, por pessoa** — e resumo não serve. Nunca “4 mensagens
aguardando”: o que ele aprova é o texto, não a contagem.

```
id com apelido      C-017 (Joana Ribeiro), sempre os dois juntos
etapa e silêncio    visitou · parada há 4 dias
a última palavra    de quem foi, quando, e o que foi dito
qual tentativa      retomada 1, ou retomada 2 · a última
o ângulo            o que esta mensagem traz de novo
o texto             INTEIRO, do jeito que vai sair, na cerca de código dele
```

E a tela inteira:

```markdown
Três para retomar — carteira lida agora, conversas conferidas agora

1 · C-008 (Família Duarte) · proposta · parado há 3 dias
    ele falou por último, 16/08: “vou conversar em casa e te retorno”
    retomada 1 · ângulo: o proprietário respondeu sobre o prazo

<o bloco do passo 7, inteiro, na cerca de código dele>

2 · C-017 (Joana Ribeiro) · visitou · parada há 4 dias
    você falou por último, 15/08 — ela não responde desde a visita
    retomada 2 · a última · ângulo: o IPTU chegou

<o bloco do passo 7, inteiro, na cerca de código dele>

3 · C-041 (Nara Beltrão) · novo lead · parada há 8 dias
    ela nunca escreveu nesta conversa — o telefone veio do portal
    retomada 1 · ângulo: imóvel novo — V-083 (apto 2 dorm, Menino Deus)

<o bloco do passo 7, inteiro, na cerca de código dele>

<quem ficou de fora, com o motivo de cada um — a lista da seção 6>

A Nara nunca te escreveu: aí é você começando a conversa, e é o caso que o
WhatsApp olha com mais atenção.

  Mando todas      as 3, uma por vez, espaçadas
  Escolho quais    você me diz os números
  Uma por uma      mostro cada uma outra vez antes de sair
  Eu mesmo mando   você copia e cola no WhatsApp
```

Os quatro rótulos são estes, e não se traduzem para outra coisa. **“Uma por
uma” é a tela do contrato (7.1) repetida por pessoa** — para, texto, e as três
saídas `Mando agora · Mudo o texto · Eu mesmo mando`. “Mudo o texto” refaz
aquela mensagem e volta a mostrá-la: prévia velha não vira mensagem nova, e é
por isso que trocar o texto obriga a preparar de novo.

**Quem ficou de fora vem antes das saídas**, sempre, e inteiro. Ele decide com
a lista dos que saem e a dos que não saem na mesma tela — descartar em silêncio
é o que faz o corretor parar de confiar na lista.

#### 8.1 · Aprovar três de uma vez não é lista de transmissão

A diferença é de forma, não de intenção, e vale escrever:

```
lista de transmissão   uma mensagem, mesmo texto, muitos destinatários, tudo
                       junto. Não existe aqui — a ponte aceita UMA conversa
                       por chamada, e não há como pedir duas
três aprovadas juntas  três mensagens DIFERENTES, uma por pessoa, com o nome
                       dela, o imóvel dela e a novidade dela dentro. A ponte
                       manda uma, espera, manda a outra
```

O que o corretor aprova de uma vez é a **revisão**, não o disparo. Diga isso na
tela em poucas palavras — “uma por vez, espaçadas” — e não prometa hora de
chegada: quem controla o intervalo é a ponte.

#### 8.2 · `ultima_interacao` imediatamente antes de cada envio

A lista foi montada com o que está **escrito na carteira**; a conversa é outra
coisa e anda sozinha. Entre a leitura e o envio passaram minutos, e é nesses
minutos que o cliente responde.

Voltou palavra dele depois do que a carteira registra: **a retomada não sai.**
Ela vira aviso, e o aviso é mais útil que a mensagem seria:

```
C-017 (Joana Ribeiro) — ela respondeu 14 minutos atrás e a carteira não sabe.
Não mandei a retomada: retomar quem já voltou é o que queima o contato. A
conversa está esperando resposta, e quem traz ela para dentro é
/corretor:organizar-carteira.
```

A linha entra em `## Falta saber`. **Não grave a conversa aqui** — a regra do
passo 1 não muda por estarmos perto do envio.

#### 8.3 · As três travas da escrita passam a valer no envio

Nenhuma delas é trava de plataforma. São a razão de a retomada funcionar, e já
valiam quando a única saída era o bloco:

```
7 dias de cadência     quem recebeu retomada há menos de uma semana não entra
                       na lista, e o que não entra na lista não sai
a terceira não sai     duas retomadas sem resposta e acabou (passo 6). Não se
                       escreve, então não há o que aprovar
o mesmo ângulo, não    o mesmo assunto com outras palavras é a mesma mensagem,
                       e o cliente lê como a mesma mensagem
```

O que muda com o conector é só o efeito: antes o bloco não escrito era uma
mensagem a menos para copiar, agora é uma mensagem que não sai. Ele pediu a
terceira com todas as letras? Diga o motivo em uma linha, uma vez, e não
escreva — o WhatsApp é dele e a mão também, mas a skill não escreve a mensagem
que ela acabou de dizer que erra.

#### 8.4 · O risco desta categoria, e ele se diz em uma linha

Retomada é o corretor **começando** a conversa: o destinatário não escreveu
primeiro, e para o WhatsApp esse é o caso de outra ordem — a punição mais
provável não é perder a conta, é a ponte parar de parear, sem erro na tela.
Isso se diz em **uma linha, uma vez por execução**, junto das saídas, como no
desenho acima. Não repita por item, não repita depois que ele escolheu, e não
vire parágrafo: o aviso inteiro é do ato de ligar o conector e mora no
`/corretor:comecar`. Aqui é lembrete, e lembrete que vira sermão é o que faz o
corretor parar de ler a tela.

Quem decide é ele. A skill informa, mostra e obedece.

#### 8.5 · Quando a ponte recusa

```
prévia vencida       passou de 10 minutos, ou já foi usada. Prepare de novo e
                     MOSTRE aquele item outra vez antes de mandar
mensagem nova por    a prévia morre. Não é erro: é o cliente falando. Volte ao
cima                 aviso de ultima_interacao, acima
texto diferente do   é a trava contra mostrar um e mandar outro. Refaça o par
que a prévia levou   inteiro — preparar e mostrar — nunca só o enviar
teto da hora         diga o número e como mudá-lo. Quem não saiu fica na lista
                     com a posição, para a próxima execução
grupo, canal,        a ponte não manda, e esta skill não tem por que pedir:
comunidade           retomada é para uma pessoa
na lista de não      ela pediu silêncio. Isto não se contorna: tire a pessoa da
contatar             lista desta execução e escreva no arquivo dela, se ainda
                     não estiver escrito. Não pergunte se ele quer insistir
```

**Quem tem `não contatar: sim` no arquivo não entra nesta lista, ponto** — e
não aparece nem em “fora hoje”, porque nomear alguém que pediu silêncio é
oferecer que se insista. A ponte recusa de novo se passar, mas essa recusa é a
segunda rede, não a primeira: quem lê a carteira é esta skill.

Recusa que não diz o número nem como mudá-lo está impedindo em vez de informar
(contrato, 7.1).

#### 8.6 · O que a tela devolve depois

Uma linha por pessoa, com o que aconteceu de verdade. Não é seção do fecho —
vem antes dele, junto do trabalho:

```
Saiu

C-008 (Família Duarte)  ok
C-017 (Joana Ribeiro)   não saiu — ela respondeu 14 minutos atrás
C-041 (Nara Beltrão)    ok
```

O que saiu vira linha no `## Histórico` do cliente (seção 7, com o fim de linha
que o envio muda). O que não saiu **não vira nada**.

---

## 5 · O que perguntar, quando, e como

Uma pergunta por vez, **nunca mais de três na execução**, e cada uma com o
motivo na mesma frase (contrato, seção 8). Antes de perguntar, desça a ordem de
busca: quase tudo que esta skill precisa já está escrito.

**No copiloto, a bifurcação é uma só, e vem depois da lista** — entregar a
lista antes de perguntar é o que impede o corretor de esperar por nada. Use a
UI de perguntas do harness, com o custo escrito em cada opção:

```
Quatro clientes parados. Escrevo a mensagem de quem?

  Os três mais quentes   proposta, visitou e visitou · pronto agora
  Escolher na lista      você diz os nomes · uma volta a mais
  Só a lista hoje        nada escrito, nada gravado no cliente
```

Rótulo de até quatro palavras; a descrição declara o custo, não vende a opção.

**A tela do passo 8 não conta neste teto.** Ela não é pergunta de busca — é a
confirmação do ato, e sem ela não há envio. Perguntar “mando?” não é gastar uma
das três; perguntar de novo o que já está escrito na carteira, é.

Pergunte só isto, e só quando faltar de verdade:

- **quem é o corretor na conversa colada**, quando nenhum remetente bate com
  `nome:` do `INDICE.md` — o risco é gravar a fala do cliente como promessa dele
- **se o cliente respondeu por fora**, quando o arquivo tem muitos `?` e o
  histórico é curto: “tem resposta dela depois de 5 de agosto que não está aqui?
  Se tiver, eu não retomo quem já voltou”
- **o que dizer**, quando o ângulo 4 depende de uma pergunta do cliente que
  ficou num áudio ou num `<Mídia oculta>` — buraco declarado, nunca palpite

No automático não se pergunta: escolhe e declara em `## Decidi sozinho`.

---

## 6 · O formato da saída

O trabalho primeiro, os três blocos de fecho depois, nesta ordem e com estes
títulos exatos.

### A lista

```markdown
Quem parou de responder — carteira lida em 2026-08-19

| cliente | etapa | parado há | já viu | ângulo |
|---|---|---|---|---|
| C-008 (Família Duarte) | proposta | 3 dias | V-052 (apto 3 dorm, Cidade Baixa) | o proprietário respondeu |
| C-017 (Joana Ribeiro) | visitou | 4 dias | V-071 (casa 3 dorm, Azenha) | o IPTU chegou |
| C-019 (Rita Camargo) | em conversa | 14 dias | — | imóvel novo — V-083 (apto 2 dorm, Menino Deus) |
| C-024 (Paulo Menezes) | novo lead | 8 dias | V-071 (casa 3 dorm, Azenha) | sem ângulo |
```

Uma linha por cliente, id com apelido sempre, e a coluna `ângulo` já diz quem
recebe mensagem e quem não recebe.

### Quem ficou de fora

Vem logo depois da lista, e não é opcional. Quem a skill considerou e descartou
aparece com o motivo em uma linha. Sem isto o corretor não tem como saber que
faltou alguém — e descarte em silêncio é o que faz ele parar de confiar na
lista inteira.

```markdown
Fora da lista

C-036 (Vera Lins)      duas retomadas sem resposta, a última em 05/08 — a
                       terceira não traz ela de volta
C-024 (Paulo Menezes)  sem ângulo: o arquivo dele não tem faixa nem bairros,
                       então não dá para saber o que é novidade para ele
C-045 (Tiago Ramos)    retomado há 3 dias — a cadência mínima é 7
C-042 (Bia Nogueira)   parada há 134 dias — é caso de aposentar, e quem faz
                       isso é /corretor:organizar-carteira
C-050 (Léo Prates)     sexto da fila — o teto é cinco por execução
```

Com o conector, esta mesma lista entra na tela do passo 8, antes das saídas, e
ganha os motivos que só existem lá: sem telefone no arquivo, ou recusado pelo
teto da hora.

### Cada mensagem

Bloco sozinho, pronto para copiar, **sem comentário dentro**. O que houver para
explicar vai depois dele, fora do bloco, em uma ou duas linhas.

```
Rita, entrou um dois dormitórios no Menino Deus.

É R$ 385.000, dentro do que você tinha me falado, e é de frente para a praça,
sem prédio na frente. Diferente do primeiro que te mandei, esse tem vaga
coberta.

https://fontesimoveis.com.br/imovel/9014

Consigo te mostrar quinta à noite. Prefere 18h ou 19h?
```

> Tudo o que a mensagem afirma veio do arquivo do V-083 (apto 2 dorm, Menino
> Deus) — preço e vaga do link em 2026-08-18, a praça da visita em 2026-08-18.
> Ângulo da vez anterior: a pergunta que ficou. Este é imóvel novo.

Sem conector o bloco é o fim: ele copia e cola. Com conector, o bloco continua
igual — o que muda é que embaixo dele existem as saídas do passo 8, e o texto
que sai é **este**, byte a byte, porque é ele que a prévia carimbou.

### O fecho

```markdown
## Guardei
- ~/carteira/clientes/C-008-familia-duarte.md — uma linha de retomada no histórico
- ~/carteira/clientes/C-017-joana-ribeiro.md — uma linha de retomada no histórico
- ~/carteira/clientes/C-019-rita-camargo.md — uma linha de retomada no histórico
- ~/carteira/clientes/_indice.md — último contato da C-017 (Joana Ribeiro) corrigido

## Falta saber
- se a C-017 (Joana Ribeiro) respondeu depois de 15 de agosto por fora da carteira
- o que o C-024 (Paulo Menezes) procura — o arquivo dele não tem faixa nem bairros

## Decidi sozinho
- Escrevi para os três mais quentes e deixei o C-031 (Sr. Almeida) de fora — ele é proprietário, e cobrar documento é de /corretor:documentos-do-negocio. Para incluir, me diga.
- Usei o preço do V-083 (apto 2 dorm, Menino Deus) como está no arquivo, de 18 de agosto. Se mudou, me diga o valor e eu refaço a mensagem.
```

`## Decidi sozinho` só existe em modo automático, e cada linha traz **o que fiz
— por que — como desfazer**.

Saiu pela ponte, o `## Guardei` diz isso na mesma linha — `— retomada enviada
14:32, e a linha no histórico`. O que ficou só escrito continua como está: o
arquivo guarda a tentativa, não o envio que não houve.

Os caminhos do `## Guardei` acima são os do `local`. No `drive`, a mesma lista
nomeia a pasta e o arquivo — `clientes/C-008-familia-duarte.md, na pasta
carteira do seu Drive — uma linha de retomada no histórico`.

---

## 7 · O que gravar na carteira

Esta skill tem `Write` e `Edit` porque **a tentativa gravada é o que faz a
próxima execução não repetir o ângulo** — sem isso ela é um chat que esquece, e
o pack inteiro perde a razão. Ela escreve em três lugares, e em nenhum outro.

**No `drive`, atualizar reescreve o arquivo inteiro** (contrato, seção 1): leia
o arquivo do cliente, o `hoje.md` ou o `_indice.md` antes de gravar e devolva o
texto inteiro com a linha nova dentro.

### 1 · A tentativa, no `## Histórico` do cliente

Uma linha, no formato abaixo. É seção do gabarito (contrato, 4.5): não se cria
campo nem seção nova.

```
- 2026-08-19 retomada 2 · WhatsApp · ângulo: imóvel novo — V-083 (apto 2 dorm, Menino Deus) · mensagem escrita, envio com o corretor
```

O número é a contagem de retomadas seguidas **sem resposta dele**, esta
incluída; ele zera quando o cliente responde. O número é para o corretor ler —
a contagem que governa o passo 5 vem de contar as linhas, não de confiar no
número escrito.

`mensagem escrita, envio com o corretor` fica porque é o que é verdade quando a
skill não mandou — e é o caso normal. Por isso **não** se escreve `enviado` em
`## Imóveis mostrados` agora: `enviado` é fato, e o fato ainda não aconteceu.
Depois do bloco, uma linha só, sem insistir: “mandou? me diga e eu marco o V-083
(apto 2 dorm, Menino Deus) como enviado no arquivo dela.” Enquanto ele não
disser, a linha do histórico já basta para a próxima execução não mandar o mesmo
imóvel de novo.

**Saiu pela ponte, o fim da linha muda**, porque o fato mudou:

```
- 2026-08-19 retomada 2 · WhatsApp · ângulo: imóvel novo — V-083 (apto 2 dorm, Menino Deus) · enviado 14:32 pela ponte
```

E aí, **e só aí**, o imóvel citado vira `enviado` em `## Imóveis mostrados`:
agora é fato, e não precisa mais perguntar.

Grave depois do `enviar_mensagem` voltar, nunca antes. Recusado — prévia
vencida, teto da hora, mensagem nova por cima —, **não grave nada**: não houve
retomada, e uma linha falsa de retomada tranca aquele cliente por sete dias de
cadência e queima uma das duas tentativas dele.

Confira o teto de **60 linhas** ao gravar. Estourou: condense o `## Histórico`
pela seção 9 — linhas de mais de 90 dias viram uma por mês. Fato corrente nunca
é cortado para caber.

### 2 · A sugestão de arquivar, no `hoje.md`

Quem bateu as duas retomadas vira uma caixa em `## Travado` — a seção existe
para o que está parado esperando decisão:

```
- [ ] C-019 (Rita Camargo) — duas retomadas sem resposta desde 2026-08-05; arquivar ou deixar parado
```

Três cuidados. O `hoje.md` é vista derivada e quem o reescreve é
`/corretor:o-que-fazer-hoje` — a linha sobrevive à próxima reescrita porque o
fato que a origina está no histórico do cliente, que é o dono. Se o título do
arquivo tiver data anterior à de hoje, acrescente a linha e **não mexa no
título**: o resto da página é de outro dia, e dizer o contrário seria mentir
sobre o que já foi feito. E se as caixas já forem quinze (teto da seção 9), não
acrescente: diga na saída que o `hoje.md` está cheio e que a sugestão fica na
lista desta execução.

### 3 · A vista que estava errada

Achou divergência entre `clientes/_indice.md` e o arquivo do cliente — coluna
`último contato` atrasada, cliente faltando: corrija a vista a partir do
arquivo e diga em `## Guardei`. Nunca o contrário.

**Não se grava mais nada.** Não se muda `etapa:` (silêncio não é mudança de
etapa), não se cria cliente, não se mexe em arquivo de imóvel, não se toca em
`_bruto/`, não se apaga coisa alguma.

Se o corretor colar uma conversa durante a execução, a ordem é a da seção 7 do
contrato: **grava o bruto primeiro**, em
`_bruto/AAAA-MM-DD-<canal>-<apelido-curto>.md` da carteira — arquivo novo no
`local`, arquivo criado dentro da pasta `_bruto/` no `drive` — com o cabeçalho
de três linhas, e só depois extrai fato.

---

## 8 · Onde ela para

Sete limites, e é melhor saber deles antes de mandar a mensagem.

**O silêncio que ela mede é o silêncio do que está escrito.** Se o cliente
respondeu no WhatsApp e a conversa não foi colada, ela vai propor retomar quem
já voltou — e uma retomada em cima de uma resposta ignorada é pior que
nenhuma. O sinal é arquivo com muitos `?` e histórico curto; o conserto é colar
a conversa e rodar `/corretor:organizar-carteira` antes. Na dúvida, ela
pergunta uma vez, e é a pergunta que mais paga nesta skill. Com conector o
passo 8.2 pega isso no último segundo — mas só de quem ia receber, e só na hora
do envio: a lista continua sendo a do que está escrito.

**Sem `## O que procura` preenchido, não há novidade computável.** Cliente cujo
`faixa:` e `bairros:` estão em `?` não recebe imóvel novo, por mais parecido
que ele pareça. Ela devolve o que falta em vez de chutar — imóvel fora do que a
pessoa quer não retoma o contato, encerra o assunto.

**Ela não abre link nenhum.** Não há ferramenta de web no `allowed-tools` dela,
e é de propósito: ela trabalha com o que já está apurado na carteira, com a data
da procedência, e avisa quando o dado passou de 30 dias. Preço desatualizado ela
declara; preço novo ela não busca — quem busca é `/corretor:anunciar-imovel`.
Dado de imóvel não se chuta, nem para ilustrar.

**Ela não sabe por que o cliente sumiu.** Silêncio longo em quem visitou
costuma ser compra fechada com outro corretor, mudança de plano ou
financiamento negado — e nenhuma dessas coisas está na carteira. Por isso a
mensagem pergunta sobre a novidade, e nunca afirma o que ele estaria pensando.

**Ela lê o fim das conversas longas.** Em `_bruto/` com centenas de linhas, ela
busca as últimas trocas para achar o ângulo, e diz que leu só o fim. O que está
no meio e importa tem de estar no arquivo do cliente, que é o dono do fato —
essa é a regra 1 e é o que impede a skill de reler quarenta quilobytes por
telefone.

**Ela não decide o que é do corretor.** Não sugere baixar preço, não avalia se
a proposta é boa, não promete prazo de banco, de cartório ou de prefeitura, e
não aposenta ninguém — os 120 dias são de `/corretor:organizar-carteira`.

**E ela só manda o que o corretor leu.** Sem conector ela escreve, diz onde
guardou e para. Com conector ela manda uma por vez, depois da tela do passo 8, e
nunca uma que ele não tenha visto inteira. A mensagem sai do WhatsApp dele, com
o nome dele, na voz dele — e é por isso que a Kapstan não aparece em uma sílaba
dela. Retomada que sai sozinha, sem ninguém na frente da tela, não existe em
modo nenhum.
