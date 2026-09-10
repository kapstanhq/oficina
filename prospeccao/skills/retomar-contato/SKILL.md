---
name: retomar-contato
description: >-
  Varre a carteira e lista quem parou de responder — há quantos dias, em que
  etapa parou e o que já viu — e escreve, para cada um, a mensagem de retomada
  que traz uma novidade concreta em vez de cobrar resposta. Nunca repete o
  ângulo da última tentativa, deixa em paz quem já foi retomado duas vezes sem
  responder, e grava a tentativa no arquivo do contato para a próxima execução
  saber. Com o conector de WhatsApp ligado ela também manda — uma por uma,
  depois de mostrar na tela para quem vai, o texto inteiro e por que aquela
  pessoa está na lista. Use quando o prospector diz “quem sumiu?”, “quem parou
  de responder”, “preciso dar um toque em alguém”, “semana fraca, quem eu
  chamo”, “o que eu
  mando pra quem visitou e não voltou”, “quero reativar contato de muito tempo atrás”, “tem
  gente parada há tempo demais aí?” ou pede a mensagem para um contato
  específico que ficou sem resposta.
license: MIT
compatibility: >-
  Precisa da carteira, numa pasta do computador — ela conta os dias de
  silêncio de cada contato e lê as retomadas anteriores no histórico dele. Sem
  carteira, NÃO funciona: não há o que varrer, nem onde gravar a tentativa para
  a próxima execução não repetir o ângulo. Não abre link. Sem conector de
  WhatsApp — que é o normal — escreve o texto e para; com o conector ligado,
  manda uma por vez, e só depois de mostrar na tela o texto inteiro e para
  quem vai.
allowed-tools: Read Glob Grep Write Edit
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/retomar-contato/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# Retomar contato

## 1 · O que ela faz, e o que ela não faz

Ela varre a carteira, lista quem parou de responder — há quantos dias, em que
etapa parou e o que já viu — e escreve, para cada um, uma mensagem que traz
**novidade** e usa um ângulo diferente do da última tentativa.

O prospector pode chamar com o nome de um contato, e aí ela olha só esse; sem
nome nenhum, varre a carteira inteira.

Ela não escreve mensagem sem novidade (retomada sem novidade é cobrança, e
cobrança queima o contato), não insiste com quem já foi retomado duas vezes sem
responder, e não inventa conta, preço nem prazo para ter o que dizer.

**Mandar é a segunda saída, e ela só existe com o conector.** Sem ele — o caso
normal, e o de toda ferramenta de chat na web — ela entrega os blocos prontos
para copiar e para. Com ele, ela monta a tela do passo 8 e manda o que o
prospector aprovar, uma mensagem por vez. O bloco não some em nenhum dos dois
casos: é o padrão, e é o que sobra quando a ponte cai.

---

## 2 · Antes de tudo

**Leia o contrato por seção, em `references/contrato/`** — o número da seção
é o começo do nome do arquivo: `04-5-arquivo-de-contato.md` é a 4.5. Ele é o
padrão comum das dez skills do pack, e nada de formato se decide aqui; o
inteiro está em `references/CONTRATO.md`. O que esta usa direto:

```
1    onde a carteira mora — os dois transportes — e a primeira leitura
2    id e apelido — E-071 (VetorBank, Porto Alegre), sempre os dois juntos
3    as três regras: não duplicar, procedência, aposentar
4.2  hoje.md          4.5  o arquivo do contato        4.7  _bruto/
6    o que sai para o WhatsApp, e o que sai por e-mail
8    a ordem de busca, e o teto de três perguntas
9    os tetos          10   como uma skill começa e termina
```

Os arquivos: `01-0-onde-a-carteira-mora.md`, `02-0-id-e-apelido.md`,
`03-0-as-tres-regras.md`, `04-2-hoje.md`, `04-5-arquivo-de-contato.md`,
`04-7-o-bruto.md`, `06-0-o-que-sai.md`, `08-0-quando-perguntar.md`,
`09-0-os-tetos.md` e `10-0-comeca-e-termina.md`.

Depois leia o **`INDICE.md` da carteira**, pela primeira leitura da seção 1 do
contrato: procura no computador e, não achando, a pasta `carteira` no Drive. A
linha `carteira:` dele diz o transporte — `local` ou `drive` —, e **toda
leitura e toda gravação desta execução vão por ele**. Se não há `INDICE.md` em
lugar nenhum, a carteira não existe: diga isto e pare, sem criar pasta nenhuma.

```
Não achei a carteira, nem no computador nem no seu Drive. Rode
/prospeccao:comecar — ele monta com você e termina com uma conta e um contato
de verdade lá dentro. Depois isto aqui funciona.
```

Do `INDICE.md` você tira seis coisas: `modo:`, o `nome:` de `## Quem sou` (é
a voz das mensagens), o `canal padrão com contato:`, o
`horário de reunião que costumo oferecer:` — este é o que fecha a mensagem sem
inventar agenda — e as duas linhas de `## O que está conectado`:
`WhatsApp:` e `envio:`.

`WhatsApp:` diz `sim` só depois de testada: aí existe conector, e ele dá uma
fonte a mais no passo 1 e uma saída a mais no passo 8. Diz `não`, ou não
existe: siga sem ele, que é o normal, e **não mencione o conector** — esta
skill não é lugar de oferecer instalação.

`envio:` só existe embaixo do `sim`, e é ela que governa o passo 8 (contrato,
7.1). Linha ausente, ou valor que você não reconhece: **`pergunta sempre`**.

```
pergunta sempre           mostra a tela e espera a escolha. É o padrão
responder sem perguntar   não muda nada aqui — retomada não é resposta a
                          conversa viva, é o prospector começando de novo
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
`/prospeccao:estudar-conta`. Se em algum ponto parecer que ela precisa de
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

Leia, nesta ordem: `funil.md` (dá a etapa e o `desde`), `contatos/_indice.md`
(dá a coluna `último contato`) e depois o arquivo de cada contato da lista. **O
arquivo vence a vista** — se o `_indice.md` diz 5 de agosto e o histórico do
contato tem uma linha de 12, vale a do arquivo, e o `_indice.md` entra na lista
do que reescrever.

O que se mede é o **silêncio dele**, não o último toque do prospector. A última
vez que o contato falou está, em ordem de busca:

```
1  o conector, quando a linha diz sim: chame `estado_da_ponte` UMA vez, aqui
   (é o pré-voo do contrato §7 — ponte parada faz esta skill listar quem
   respondeu ontem), e então ultima_interacao com o telefone do
   arquivo do contato devolve a data E de quem foi a última palavra — que é a
   pergunta inteira, sem adivinhação
2  a última linha de ## O que já mandei, que diz o dia e o gancho
3  a última linha de ## Histórico que registra fala ou ato dele
4  ## Combinado — o que ele marcou ou prometeu, com a data
5  a última mensagem dele na conversa em _bruto/ (leia o fim do arquivo)
6  a coluna último contato do _indice.md — e aí diga que a conta é aproximada,
   porque essa coluna não distingue quem falou
```

Não deu para saber quem falou por último, em nenhum dos seis: o contato entra
na lista com `parado há ?` e vira uma linha em `## Falta saber`. Não estime.

**O conector viu o que a carteira não sabia?** Acontece, e é informação nova,
não defeito: o contato respondeu e ninguém anotou. Diga na lista — “respondeu
dia 19, e a carteira não registrou” — e ponha uma linha em `## Falta saber`.
**Não grave a conversa aqui**: quem traz conversa para `_bruto/` é
`/prospeccao:organizar-carteira`, e uma skill que grava fora do escopo dela é a
que ninguém desconfia quando o arquivo aparece estranho.

E o contrário também vale: sem telefone no arquivo do contato, o conector não
serve para ele — não tem como achar a conversa. Siga pelos outros cinco.

### Passo 2 · Quando é silêncio, por etapa

O prazo muda com o que está em jogo. Estes são os cortes, e não se inventa
outro:

| etapa | entra na lista a partir de | por quê |
|---|---|---|
| respondeu | 2 dias | ele te escreveu e você sumiu — é o pior silêncio que existe, e é seu |
| reunião marcada | só depois que a data passou | antes disso é confirmação, e quem cobra é o `hoje.md` |
| abordado | 7 dias | uma mensagem não lida em sete dias não vai ser lida |
| a abordar | não entra | ela nunca foi abordada; é caso de `/prospeccao:escrever-abordagem` |
| a estudar | não entra | |
| virou cliente | não entra | |

Passou de **90 dias** sem responder: não é assunto desta skill. Diga em uma
linha que ele é caso de aposentar pela regra 3 e que quem faz isso é
`/prospeccao:organizar-carteira`. Não aposente aqui.

### Passo 3 · A ordem da lista

Primeiro pela etapa, na ordem da tabela acima — quem visitou vale mais que quem
nunca respondeu, e é por isso que a lista não é cronológica. Empate entre dois
da mesma etapa: sobe quem **tem novidade** para receber (passo 4); persistindo,
sobe quem está parado há mais tempo.

### Passo 4 · O ângulo — e ele é a razão de a skill existir

Para cada um, procure novidade nesta ordem e **pare na primeira que existir**:

```
1  a conta mudou                mudou o `## O que a conta faz` ou o
                                `## O que abre a conversa` DEPOIS da última
                                mensagem: vaga aberta, rodada, aquisição, ERP novo
2  a pergunta que ficou         ele deixou pergunta sem resposta, ou prometeu
                                algo em ## Combinado e não mandou
3  chegou o que ele pediu       um ? do arquivo virou fato: o número, o caso,
                                a referência que ele tinha pedido
4  outra pessoa na mesma conta  o ## Quem decide tem alguém que nunca foi
                                abordado — e aí não é retomada, é conta nova
                                para /prospeccao:escrever-abordagem
5  o prazo dele                 ## O que ele me disse tem prazo (“antes do
                                fechamento do ano”) e o calendário andou o
                                bastante para ser assunto
6  nenhum                       NÃO escreve mensagem
```

**O filtro do ângulo 1**, e ele é literal: `estado:` é `a estudar` ou `a
abordar` (nunca “disse não”, “fechou com outro” ou “fora do perfil”); a conta
passa no `perfil.md`; o cargo do contato está em `cargo:`; o contato não está
em `nao-perturbe.md`; e a conta **não** está em `## Onde trabalha` nem foi
citado em retomada anterior. Faltou qualquer um desses campos no contato — está
como `?` — o ângulo 1 não se usa: mandar conta que “parece” bater é como
recomeçar do zero.

Só chame de **novo** o que entrou na carteira depois do último contato dele. O
que é antigo e nunca foi mostrado é “não te mostrei ainda”, e a mensagem diz
assim.

**Escassez que não está escrita no arquivo não se escreve na mensagem.** “Já
tem outro interessado”, “é o último dessa faixa”, “vai sair rápido”: só se
`estado: reservado` ou uma linha de `## Histórico` disser isso, com data. Sem
isso, é pressão inventada — e é o prospector que atende o telefone depois.

### Passo 5 · O que já foi tentado

Antes de escrever, leia no `## Histórico` do contato as linhas que começam com
`retomada` (formato no passo 7) e conte **quantas vieram depois da última
manifestação dele**:

```
0   caminho livre
1   escreva — e o ângulo TEM de ser diferente do da linha anterior
2+  não escreve. Respeita o silêncio (passo 6)
```

O ângulo repetido é o defeito que esta skill existe para não cometer. Se o
único ângulo disponível é o mesmo da última vez, o contato vai para “sem ângulo
novo” — não se manda o mesmo assunto com outras palavras.

**Cadência mínima: 7 dias.** Quem recebeu retomada há menos de uma semana não
entra na lista, mesmo com ângulo novo. Duas mensagens na mesma semana é o que
faz o contato arquivar a conversa.

### Passo 6 · Quem sai da lista, e o que se diz

Duas retomadas seguidas sem resposta: **não escreva a terceira.** Ele sai da
lista de mensagens e vira uma linha em `## Travado` no `hoje.md` (passo 7),
sugerindo arquivar. Diga o motivo em uma frase, sem rodeio:

```
P-036 (Vera Lins) — duas retomadas sem resposta, a última em 2026-08-05.
A terceira não traz ela de volta e queima o contato. Sugestão: deixar parado
até ela aparecer, ou arquivar por /prospeccao:organizar-carteira.
```

Também não recebe mensagem quem caiu no ângulo 6 (nenhuma novidade). Aí a saída
não é uma mensagem: é **o que falta para haver uma**, em uma linha — “o arquivo
dela não tem `cargo:` nem `## O que a conta faz`, então não dá para saber o que é novidade
para ela”.

### Passo 7 · Escrever

Até **cinco mensagens por execução**, e o número é o mesmo com o conector
ligado. Ele é o tamanho de uma tela que alguém lê inteira antes de aprovar:
acima disso o prospector rola, para de ler o texto de cada um e aprova no
atacado — que é exatamente o que esta skill existe para não fazer. Prospector com
pressa também não copia quinze, e mensagem escrita e não mandada envelhece na
tela. O resto fica na lista, com a posição, para a próxima rodada.

O formato é o da seção 6 do contrato — WhatsApp ou e-mail conforme o `canal:` do
arquivo do contato. O que é próprio da retomada:

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
preço do E-083 (Móveis Bertoldo, Bento Gonçalves) é de 12 de julho — confira antes de
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
prospector aprovar. Cinco por execução cabem no teto de partida de seis conversas
por hora; duas execuções na mesma hora não cabem, e a segunda diz isso na cara
em vez de falhar no fim.

O par sai por pessoa, sempre nesta ordem, com a tela no meio:

```
preparar_envio(conversa, texto)             devolve o código da prévia
<a tela, e a escolha do prospector>
enviar_mensagem(previa, conversa, texto)    os três, batendo byte a byte
```

**O que a tela carrega, por pessoa** — e resumo não serve. Nunca “4 mensagens
aguardando”: o que ele aprova é o texto, não a contagem.

```
id com apelido      P-017 (Carla Menezes), sempre os dois juntos
etapa e silêncio    visitou · parada há 4 dias
a última palavra    de quem foi, quando, e o que foi dito
qual tentativa      retomada 1, ou retomada 2 · a última
o ângulo            o que esta mensagem traz de novo
o texto             INTEIRO, do jeito que vai sair, na cerca de código dele
```

E a tela inteira:

```markdown
Três para retomar — carteira lida agora, nao-perturbe.md conferido agora

1 · P-024 (Paulo Tavares) · respondeu · parado há 2 dias
    ele falou por último, 17/08: “quanto custa um projeto desses?”
    retomada 1 · gancho: a resposta que falta é sua

<o bloco do passo 7, inteiro, na cerca de código dele>

2 · P-019 (Rui Baptista) · abordado · parado há 8 dias
    você falou por último, 11/08 — ele não abriu o e-mail
    retomada 2 · a última · gancho: vaga de controladoria em 15/08

<o bloco do passo 7, inteiro, na cerca de código dele>

3 · P-050 (Iara Bastos) · abordado · parada há 9 dias
    ela nunca escreveu — o nome veio de uma lista de evento
    retomada 1 · gancho: a conta anunciou aquisição em 12/08

<o bloco do passo 7, inteiro, na cerca de código dele>

<quem ficou de fora, com o motivo de cada um — a lista da seção 6>

A Iara nunca te escreveu, e o canal dela é e-mail: esta sai por e-mail, não
pelo WhatsApp. A primeira mensagem por WhatsApp para quem nunca respondeu o
próprio WhatsApp recusa.

  Mando todas      as 3, uma por vez, espaçadas
  Escolho quais    você me diz os números
  Uma por uma      mostro cada uma outra vez antes de sair
  Eu mesmo mando   você copia e cola
```

Os quatro rótulos são estes, e não se traduzem para outra coisa. **“Uma por
uma” é a tela do contrato (7.1) repetida por pessoa** — para, texto, e as três
saídas `Mando agora · Mudo o texto · Eu mesmo mando`. “Mudo o texto” refaz
aquela mensagem e volta a mostrá-la: prévia velha não vira mensagem nova, e é
por isso que trocar o texto obriga a preparar de novo.

**Quem ficou de fora vem antes das saídas**, sempre, e inteiro. Ele decide com
a lista dos que saem e a dos que não saem na mesma tela — descartar em silêncio
é o que faz o prospector parar de confiar na lista.

#### 8.1 · Aprovar três de uma vez não é lista de transmissão

A diferença é de forma, não de intenção, e vale escrever:

```
lista de transmissão   uma mensagem, mesmo texto, muitos destinatários, tudo
                       junto. Não existe aqui — a ponte aceita UMA conversa
                       por chamada, e não há como pedir duas
três aprovadas juntas  três mensagens DIFERENTES, uma por pessoa, com o nome
                       dela, a conta dela e a novidade dela dentro. A ponte
                       manda uma, espera, manda a outra
```

O que o prospector aprova de uma vez é a **revisão**, não o disparo. Diga isso na
tela em poucas palavras — “uma por vez, espaçadas” — e não prometa hora de
chegada: quem controla o intervalo é a ponte.

#### 8.2 · `ultima_interacao` imediatamente antes de cada envio

A lista foi montada com o que está **escrito na carteira**; a conversa é outra
coisa e anda sozinha. Entre a leitura e o envio passaram minutos, e é nesses
minutos que o contato responde.

Voltou palavra dele depois do que a carteira registra: **a retomada não sai.**
Ela vira aviso, e o aviso é mais útil que a mensagem seria:

```
P-017 (Carla Menezes) — ela respondeu 14 minutos atrás e a carteira não sabe.
Não mandei a retomada: retomar quem já voltou é o que queima o contato. A
conversa está esperando resposta, e quem traz ela para dentro é
/prospeccao:organizar-carteira.
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
                       e o contato lê como a mesma mensagem
```

O que muda com o conector é só o efeito: antes o bloco não escrito era uma
mensagem a menos para copiar, agora é uma mensagem que não sai. Ele pediu a
terceira com todas as letras? Diga o motivo em uma linha, uma vez, e não
escreva — o WhatsApp é dele e a mão também, mas a skill não escreve a mensagem
que ela acabou de dizer que erra.

#### 8.4 · O risco desta categoria, e ele se diz em uma linha

Retomada é o prospector **começando** a conversa: o destinatário não escreveu
primeiro, e para o WhatsApp esse é o caso de outra ordem — a punição mais
provável não é perder a conta, é a ponte parar de parear, sem erro na tela.
Isso se diz em **uma linha, uma vez por execução**, junto das saídas, como no
desenho acima. Não repita por item, não repita depois que ele escolheu, e não
vire parágrafo: o aviso inteiro é do ato de ligar o conector e mora no
`/prospeccao:comecar`. Aqui é lembrete, e lembrete que vira sermão é o que faz o
prospector parar de ler a tela.

Quem decide é ele. A skill informa, mostra e obedece.

#### 8.5 · Quando a ponte recusa

```
prévia vencida       passou de 10 minutos, ou já foi usada. Prepare de novo e
                     MOSTRE aquele item outra vez antes de mandar
mensagem nova por    a prévia morre. Não é erro: é o contato falando. Volte ao
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

P-024 (Paulo Tavares)  ok
P-019 (Rui Baptista)   não saiu — ele respondeu 14 minutos atrás
P-050 (Iara Bastos)    ok
```

O que saiu vira linha no `## Histórico` do contato (seção 7, com o fim de linha
que o envio muda). O que não saiu **não vira nada**.

---

## 5 · O que perguntar, quando, e como

Uma pergunta por vez, **nunca mais de três na execução**, e cada uma com o
motivo na mesma frase (contrato, seção 8). Antes de perguntar, desça a ordem de
busca: quase tudo que esta skill precisa já está escrito.

**No copiloto, a bifurcação é uma só, e vem depois da lista** — entregar a
lista antes de perguntar é o que impede o prospector de esperar por nada. Use a
UI de perguntas do harness, com o custo escrito em cada opção:

```
Quatro contatos sem resposta. Escrevo a mensagem de quem?

  Os três mais quentes   proposta, visitou e visitou · pronto agora
  Escolher na lista      você diz os nomes · uma volta a mais
  Só a lista hoje        nada escrito, nada gravado no contato
```

Rótulo de até quatro palavras; a descrição declara o custo, não vende a opção.

**A tela do passo 8 não conta neste teto.** Ela não é pergunta de busca — é a
confirmação do ato, e sem ela não há envio. Perguntar “mando?” não é gastar uma
das três; perguntar de novo o que já está escrito na carteira, é.

Pergunte só isto, e só quando faltar de verdade:

- **quem é o prospector na conversa colada**, quando nenhum remetente bate com
  `nome:` do `INDICE.md` — o risco é gravar a fala do contato como promessa dele
- **se o contato respondeu por fora**, quando o arquivo tem muitos `?` e o
  histórico é curto: “tem resposta dela depois de 5 de agosto que não está aqui?
  Se tiver, eu não retomo quem já voltou”
- **o que dizer**, quando o ângulo 4 depende de uma pergunta do contato que
  ficou num áudio ou num `<Mídia oculta>` — buraco declarado, nunca palpite

No automático não se pergunta: escolhe e declara em `## Decidi sozinho`.

---

## 6 · O formato da saída

O trabalho primeiro, os três blocos de fecho depois, nesta ordem e com estes
títulos exatos.

### A lista

```markdown
Quem não respondeu — carteira lida em 2026-08-19

| contato | etapa | parado há | gancho já usado | gancho novo |
|---|---|---|---|---|
| P-024 (Paulo Tavares) | respondeu | 2 dias | ele perguntou o preço | a resposta que falta é sua |
| P-019 (Rui Baptista) | abordado | 8 dias | trocaram de ERP em junho | abriram vaga de controladoria em 15/08 |
| P-041 (Otávio Prado) | abordado | 14 dias | — | sem gancho |
| P-031 (Sandra Lisboa) | reunião marcada | — | — | não entra: a data é quinta |
```

Uma linha por contato, id com apelido sempre, e a coluna `ângulo` já diz quem
recebe mensagem e quem não recebe.

### Quem ficou de fora

Vem logo depois da lista, e não é opcional. Quem a skill considerou e descartou
aparece com o motivo em uma linha. Sem isto o prospector não tem como saber que
faltou alguém — e descarte em silêncio é o que faz ele parar de confiar na
lista inteira.

```markdown
Fora da lista

P-036 (Vera Lins)      está no nao-perturbe.md desde 02/07 — ela pediu, e
                       pedido de silêncio não tem retomada
P-041 (Otávio Prado)   sem gancho: o arquivo da conta dele não mudou desde a
                       primeira mensagem, e “passando para saber” não é gancho
P-045 (Tiago Ramos)    retomado há 3 dias — a cadência mínima é 7
P-042 (Bia Nogueira)   parada há 134 dias — é caso de aposentar, e quem faz
                       isso é /prospeccao:organizar-carteira
P-052 (Léo Prates)     sexto da fila — o teto é cinco por execução
```

Com o conector, esta mesma lista entra na tela do passo 8, antes das saídas, e
ganha os motivos que só existem lá: sem telefone no arquivo, ou recusado pelo
teto da hora.

### Cada mensagem

Bloco sozinho, pronto para copiar, **sem comentário dentro**. O que houver para
explicar vai depois dele, fora do bloco, em uma ou duas linhas.

```
Rui, vi que a Bertoldo abriu vaga de controladoria.

Quando entrei em contato em junho vocês tinham acabado de trocar de ERP — e
controladoria contratando logo depois costuma ser o mesmo problema: o número
existe e ninguém confia nele.

https://vasquesanalytics.com.br/casos/fechamento

Vale 20 minutos na semana que vem para eu te mostrar como duas indústrias do
mesmo porte resolveram? Terça ou quinta?
```

> Tudo o que a mensagem afirma veio do arquivo do E-083 (Móveis Bertoldo, Bento
> Gonçalves) — a vaga de controladoria de 15/08, o ERP novo de junho. Gancho da
> vez anterior: o ERP. Este é gancho novo.

Sem conector o bloco é o fim: ele copia e cola. Com conector, o bloco continua
igual — o que muda é que embaixo dele existem as saídas do passo 8, e o texto
que sai é **este**, byte a byte, porque é ele que a prévia carimbou.

### O fecho

```markdown
## Guardei
- ~/carteira/contatos/P-024-paulo-tavares.md — uma linha em ## O que já mandei
- ~/carteira/contatos/P-019-rui-baptista.md — uma linha em ## O que já mandei
- ~/carteira/contatos/P-050-iara-bastos.md — uma linha em ## O que já mandei
- ~/carteira/contatos/_indice.md — último contato do P-019 (Rui Baptista) corrigido

## Falta saber
- se o P-019 (Rui Baptista) respondeu depois de 11 de agosto por fora da carteira
- o que o P-041 (Otávio Prado) procura — o arquivo da conta dele não mudou desde maio

## Decidi sozinho
- Escrevi para os três mais quentes e deixei a P-031 (Sandra Lisboa) de fora — ela tem reunião marcada para quinta, e quem cobra a véspera é o hoje.md. Para incluir, me diga.
- Usei a vaga do E-083 (Móveis Bertoldo, Bento Gonçalves) como está no arquivo, de 15 de agosto. Se ela já fechou, me diga e eu refaço a mensagem.
```

`## Decidi sozinho` só existe em modo automático, e cada linha traz **o que fiz
— por que — como desfazer**.

Saiu pela ponte, o `## Guardei` diz isso na mesma linha — `— retomada enviada
14:32, e a linha no histórico`. O que ficou só escrito continua como está: o
arquivo guarda a tentativa, não o envio que não houve.

Os caminhos do `## Guardei` acima são os do `local`. No `drive`, a mesma lista
nomeia a pasta e o arquivo — `contatos/P-008-diego-furtado.md, na pasta
carteira do seu Drive — uma linha de retomada no histórico`.

---

## 7 · O que gravar na carteira

Esta skill tem `Write` e `Edit` porque **a tentativa gravada é o que faz a
próxima execução não repetir o ângulo** — sem isso ela é um chat que esquece, e
o pack inteiro perde a razão. Ela escreve em três lugares, e em nenhum outro.

**No `drive`, atualizar reescreve o arquivo inteiro** (contrato, seção 1): leia
o arquivo do contato, o `hoje.md` ou o `_indice.md` antes de gravar e devolva o
texto inteiro com a linha nova dentro.

### 1 · A tentativa, no `## Histórico` do contato

Uma linha, no formato abaixo. É seção do gabarito (contrato, 4.5): não se cria
campo nem seção nova.

```
- 2026-08-19 retomada 2 · e-mail · gancho: vaga de controladoria em 15/08 · mensagem escrita, envio com o prospector
```

O número é a contagem de retomadas seguidas **sem resposta dele**, esta
incluída; ele zera quando o contato responde. O número é para o prospector ler —
a contagem que governa o passo 5 vem de contar as linhas, não de confiar no
número escrito.

`mensagem escrita, envio com o prospector` fica porque é o que é verdade quando a
skill não mandou — e é o caso normal. Por isso **não** se escreve `enviado` em
`## Onde trabalha` agora: `enviado` é fato, e o fato ainda não aconteceu.
Depois do bloco, uma linha só, sem insistir: “mandou? me diga e eu marco o
E-083 (Móveis Bertoldo, Bento Gonçalves) como enviado no arquivo dela.” Enquanto ele não
disser, a linha do histórico já basta para a próxima execução não mandar o mesmo
conta de novo.

**Saiu pela ponte, o fim da linha muda**, porque o fato mudou:

```
- 2026-08-19 retomada 2 · WhatsApp · gancho: vaga de controladoria em 15/08 · enviado 14:32 pela ponte
```

E aí, **e só aí**, a conta que a mensagem cita vira `enviado` em `## Onde trabalha`:
agora é fato, e não precisa mais perguntar.

Grave depois do `enviar_mensagem` voltar, nunca antes. Recusado — prévia
vencida, teto da hora, mensagem nova por cima —, **não grave nada**: não houve
retomada, e uma linha falsa de retomada tranca aquele contato por sete dias de
cadência e queima uma das duas tentativas dele.

Confira o teto de **60 linhas** ao gravar. Estourou: condense o `## Histórico`
pela seção 9 — linhas de mais de 90 dias viram uma por mês. Fato corrente nunca
é cortado para caber.

### 2 · A sugestão de arquivar, no `hoje.md`

Quem bateu as duas retomadas vira uma caixa em `## Travado` — a seção existe
para o que está parado esperando decisão:

```
- [ ] P-041 (Otávio Prado) — duas retomadas sem resposta desde 2026-08-05; arquivar ou deixar parado
```

Três cuidados. O `hoje.md` é vista derivada e quem o reescreve é
`/prospeccao:o-que-fazer-hoje` — a linha sobrevive à próxima reescrita porque o
fato que a origina está no histórico do contato, que é o dono. Se o título do
arquivo tiver data anterior à de hoje, acrescente a linha e **não mexa no
título**: o resto da página é de outro dia, e dizer o contrário seria mentir
sobre o que já foi feito. E se as caixas já forem quinze (teto da seção 9), não
acrescente: diga na saída que o `hoje.md` está cheio e que a sugestão fica na
lista desta execução.

### 3 · A vista que estava errada

Achou divergência entre `contatos/_indice.md` e o arquivo do contato — coluna
`último contato` atrasada, contato faltando: corrija a vista a partir do
arquivo e diga em `## Guardei`. Nunca o contrário.

**Não se grava mais nada.** Não se muda `etapa:` (silêncio não é mudança de
etapa), não se cria contato, não se mexe em arquivo de conta, não se toca em
`_bruto/`, não se apaga coisa alguma.

Se o prospector colar uma conversa durante a execução, a ordem é a da seção 7 do
contrato: **grava o bruto primeiro**, em
`_bruto/AAAA-MM-DD-<canal>-<apelido-curto>.md` da carteira — arquivo novo no
`local`, arquivo criado dentro da pasta `_bruto/` no `drive` — com o cabeçalho
de três linhas, e só depois extrai fato.

---

## 8 · Onde ela para

Sete limites, e é melhor saber deles antes de mandar a mensagem.

**O silêncio que ela mede é o silêncio do que está escrito.** Se o contato
respondeu no WhatsApp e a conversa não foi colada, ela vai propor retomar quem
já voltou — e uma retomada em cima de uma resposta ignorada é pior que
nenhuma. O sinal é arquivo com muitos `?` e histórico curto; o conserto é colar
a conversa e rodar `/prospeccao:organizar-carteira` antes. Na dúvida, ela
pergunta uma vez, e é a pergunta que mais paga nesta skill. Com conector o
passo 8.2 pega isso no último segundo — mas só de quem ia receber, e só na hora
do envio: a lista continua sendo a do que está escrito.

**Sem `## O que procura` preenchido, não há novidade computável.** Contato cujo
`cargo:` e `## O que a conta faz` estão em `?` não recebe conta que entrou depois, por mais
que a semelhança convença. Ela devolve o que falta em vez de chutar — conta fora do que a
pessoa quer não retoma o contato, encerra o assunto.

**Ela não abre link nenhum.** Não há ferramenta de web no `allowed-tools` dela,
e é de propósito: ela trabalha com o que já está apurado na carteira, com a data
da procedência, e avisa quando o dado passou de 30 dias. Preço desatualizado ela
declara; preço novo ela não busca — quem busca é `/prospeccao:escrever-abordagem`.
Dado de conta não se chuta, nem para ilustrar.

**Ela não sabe por que o contato sumiu.** Silêncio longo em quem visitou
costuma ser orçamento cortado, prioridade trocada no trimestre
ou a pessoa ter saído da empresa — e nenhuma dessas coisas está na carteira. Por isso a
mensagem pergunta sobre a novidade, e nunca afirma o que ele estaria pensando.

**Ela lê o fim das conversas longas.** Em `_bruto/` com centenas de linhas, ela
busca as últimas trocas para achar o ângulo, e diz que leu só o fim. O que está
no meio e importa tem de estar no arquivo do contato, que é o dono do fato —
essa é a regra 1 e é o que impede a skill de reler quarenta quilobytes por
telefone.

**Ela não decide o que é do prospector.** Não sugere baixar preço, não avalia se
a proposta é boa, não promete prazo de jurídico, de compras ou de segurança da informação, e
não aposenta ninguém — os 90 dias são de `/prospeccao:organizar-carteira`.

**E ela só manda o que o prospector leu.** Sem conector ela escreve, diz onde
guardou e para. Com conector ela manda uma por vez, depois da tela do passo 8, e
nunca uma que ele não tenha visto inteira. A mensagem sai do WhatsApp dele, com
o nome dele, na voz dele — e é por isso que a Kapstan não aparece em uma sílaba
dela. Retomada que sai sozinha, sem ninguém na frente da tela, não existe em
modo nenhum.
