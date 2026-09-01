---
name: montar-visita
description: >-
  Monta a saída de visitas — escolhe quais imóveis da carteira mostrar a um
  cliente, propõe a ordem e a hora, e devolve os eventos prontos para a agenda
  mais a mensagem de confirmação para colar — ou para mandar pelo conector do
  WhatsApp, uma por vez e com o texto e o destinatário na tela antes. Cruza o
  que o cliente procura com o que ele já viu e por que descartou cada um. Lê a
  agenda do Google quando ela está conectada, e pergunta os horários quando não
  está. Grava a visita no arquivo do cliente e deixa o lembrete de confirmar na
  véspera. Use quando o corretor disser “vou levar a Joana para ver umas
  casas”, “o que eu mostro pra ela”, “monta meu sábado de visitas”, “que horas
  marco com a C-017 (Joana Ribeiro)”, “quais imóveis levo nessa saída”, “em que
  ordem eu mostro”, “marca visita com fulano”, “tenho três clientes e uma manhã
  só”. Também quando ele já escolheu os imóveis e quer só a ordem, o horário e
  a mensagem de confirmação.
license: MIT
compatibility: >-
  Precisa da carteira, no computador ou no Google Drive — sem ela esta skill não
  funciona, porque o trabalho dela é cruzar o que o cliente já viu com o que ele
  descartou. Em chat na web sem Drive, ela diz isso em uma linha e para. A
  agenda do Google é opcional; sem ela, pergunta os horários.
allowed-tools: Read Glob Grep Write Edit
---

# Montar a visita

Esta skill escolhe quais imóveis da carteira mostrar a um cliente, em que ordem
e a que horas, e devolve três coisas prontas — a ordem com a razão de cada
imóvel, os eventos para a agenda e a mensagem de confirmação para colar.

**Ela não cria evento, não calcula rota, e não manda mensagem sem mostrar antes
o texto e para quem.** Ela ordena o que já está apurado na carteira, mostra por
que ordenou assim, e diz na cara onde o julgamento é do corretor.

---

## 1 · Antes de tudo

Esta skill trabalha com um cliente — e, quando o corretor disser, com um dia ou
um período. Sem o cliente não há o que cruzar; sem o dia, ela olha os próximos
sete.

Leia, nesta ordem:

1. **`references/CONTRATO.md`, inteiro.** Ele é a lei do pack. As
   seções que esta skill mais usa são a 1 (onde a carteira mora, e os dois
   transportes), a 2 (id e apelido), a 4.2 (`hoje.md`), a
   4.4 (arquivo de imóvel), a 4.5 (arquivo de cliente), a 6 (o que sai para o
   WhatsApp), a 7.1 (como a mensagem sai), a 8 (quando perguntar) e a 10 (como
   termina). **Nenhum gabarito é reescrito aqui** — formato que esta skill
   inventar quebra as outras nove.
2. **o `INDICE.md` da carteira**, pela primeira leitura do CONTRATO §1.

Não achou o `INDICE.md` em lugar nenhum? Uma linha, e para:

> Não achei a sua carteira. Rode `/corretor:comecar` — ele monta a
> carteira com você e já entra com um imóvel e um cliente de verdade.

Do `INDICE.md`, guarde sete coisas antes de seguir:

```
carteira:                               o transporte e o lugar — vale para toda
                                        leitura e toda gravação desta execução
modo:                                   a seção 2 desta skill
nome:                                   é a voz da mensagem, e é quem assina
Google Agenda: <sim|não>                decide o passo 4.1
WhatsApp: <sim|não>                     com sim, o passo 6 tem a segunda saída
envio:                                  o que ele já autorizou ali — sem a
                                        linha, é `pergunta sempre`
horário de visita que costumo oferecer: é a janela padrão dele
```

No `local`, toda chamada de ferramenta usa **caminho absoluto**; no `drive`,
toda busca é presa à pasta pai, e a pasta que se abre tem o id guardado
(CONTRATO §1). Ao falar com o corretor, escreva `~/carteira/…` no `local` e “a
pasta `carteira` do seu Drive” no `drive`.

**Por que esta skill tem `Write` e `Edit`:** visita marcada é fato do cliente, e
fato mora no arquivo dono. Ela grava em `clientes/<id>-<apelido>.md`, atualiza
`## Mostrado a` no arquivo de cada imóvel da saída, reflete no `funil.md` e — só
quando a véspera cai hoje — acrescenta uma linha no `hoje.md`. Não escreve em
mais nada, não cria arquivo novo, e **não apaga nada** (CONTRATO §3, regra 3).

---

## 2 · O modo

Leia a linha `modo:` do `INDICE.md`. `automatico` e `automático` valem; qualquer
outro valor, linha ausente ou arquivo ilegível é **`copiloto`** (CONTRATO §5).

**Copiloto.** Para na primeira bifurcação real — qual janela usar, quantos
imóveis levar, se o cliente já deu o sim. Antes de parar, entrega o que já
ficou pronto: a triagem dos imóveis e a razão de cada um valem sozinhas.

**Automático.** Escolhe a janela, os imóveis, a ordem e a duração, e fecha com
`## Decidi sozinho` — uma linha por escolha, *o que fiz — por que — como
desfazer*.

**O que o automático NÃO faz aqui, e é a linha que importa:**

- não cria evento na agenda, não edita e não apaga evento nenhum;
- **não manda mensagem por estar em automático.** Envio não se deriva do
  `modo:` — quem governa é a linha `envio:`, e o automático não a herda
  (passo 6);
- **não dá o sim do cliente por dado.** Visita proposta é proposta até ele
  aceitar. O automático escolhe entre caminhos de trabalho; ele não inventa
  fato, e “ela vai topar sábado” é fato inventado.

Esta skill não tem exceção escrita ao modo. A única do pack é
`/corretor:conferir-matricula`.

---

## 3 · O TODO

Montar visita é tarefa de passos demorados: lê a agenda, lê a carteira inteira
de imóveis, escreve em três ou quatro arquivos. Mostre o TODO na tela
(CONTRATO §10):

```
1  ler o cliente e o que ele já viu
2  achar os horários livres
3  triar os imóveis e montar a ordem
4  escrever os eventos e a mensagem
5  gravar na carteira
```

---

## 4 · O passo a passo

### 4.0 · Quem é o cliente

Ache o cliente pela ordem de busca (CONTRATO §8): `clientes/_indice.md` primeiro,
depois o arquivo dele. Do arquivo, leia **tudo**, e em especial:

```
etapa:                   a de agora, e desde quando
canal:                   decide o formato da mensagem (CONTRATO §6)
## O que procura         faixa, bairros, o que precisa ter, o que NÃO aceita,
                         prazo, pagamento, quem decide junto
## Imóveis mostrados     o que já foi enviado, o que ele visitou, e o que ele
                         disse de cada um
## Combinado             o que já ficou marcado, e o que ele prometeu e não mandou
```

Não existe arquivo de cliente com esse nome? Não invente um. Diga em uma linha
e aponte o caminho: cliente novo entra por `/corretor:responder-lead`, que é
quem abre a ficha. Sem ficha não há o que cruzar — a triagem desta skill é
inteira feita em cima de `## O que procura` e `## Imóveis mostrados`.

`## Imóveis mostrados` vazio **não quer dizer que ele nunca viu nada.** Quer
dizer que a carteira não sabe. Trate como `?`, não como zero.

Mais de um cliente na mesma saída (três clientes numa manhã)? Leia os três
arquivos. Um cliente por janela, nunca dois clientes no mesmo imóvel na mesma
hora, e a ordem entre eles obedece as mesmas regras de bairro do 4.3.

### 4.1 · Os horários

**`Google Agenda: sim` no `INDICE.md`.** Procure na sessão a ferramenta de
agenda do conector do Google — ela aparece com nome de `list_calendars`,
`list_events` ou `search_events`. Leia o período pedido (o dia que ele disse;
sem dia, os próximos sete). Avise em uma linha antes de chamar, porque a agenda
não está em `allowed-tools` e a primeira chamada pede permissão — isso é normal
e é bom que peça.

Regras da leitura, e são curtas:

- **leitura por padrão.** `create_event`, `update_event` e `delete_event` não
  entram no trabalho normal: quem cria o evento é o corretor, com o bloco que
  ela entrega. A única porta é ele pedir com todas as letras, e as travas estão
  na §8 — um por vez, lido de volta antes, nunca em lote e nunca no automático.
- **todo evento é ocupado**, inclusive o de dia inteiro e o que parece
  remarcável. A skill não sabe o que dá para mexer.
- **janela livre é só dentro de `horário de visita que costumo oferecer:`.** Ele
  não quer visita às 21h só porque a agenda está vazia às 21h. Essa linha vazia
  no `INDICE.md` é uma das perguntas do passo 5.

**`Google Agenda: não`, linha ausente, ou não há ferramenta de agenda na
sessão.** Não trava: pergunta os horários (passo 5) e segue. Ofereça o padrão
dele já preenchido, para ele só confirmar.

**Diz `sim` mas a leitura falhou.** Diga em uma linha o que não abriu, siga pelo
caminho da pergunta, e **não mexa na linha `Google Agenda:` do `INDICE.md`** —
`## O que está conectado` é configuração do corretor, e o que falhou foi agora,
não o teste dele.

### 4.2 · A triagem

Monte a lista de candidatos a partir de `imoveis/_indice.md` e abra o arquivo
de cada um que sobreviver. Corte nesta ordem, e **cada corte vira uma linha em
`## Não entraram`** — imóvel que some sem motivo faz o corretor achar que a
skill esqueceu.

| corta | por quê |
|---|---|
| `estado:` que não é `à venda` nem `para alugar` | vendido, alugado e fora do mercado não se mostram. **`reservado` também fica fora da rota**: mostrar reservado é oferecer o que pode não estar mais lá |
| o que ele procura não bate com o `estado:` | quem procura alugar não visita `V-`, e vice-versa |
| preço acima da `faixa:` | fica fora, **com o valor escrito na linha do corte**. Esticar a faixa é decisão dele, não da skill |
| falta o que está em `o que precisa ter:` | três dormitórios são três dormitórios |
| bate com `o que não aceita:` | e aqui vale a regra do 4.2.1 |
| ele já visitou | a não ser que tenha mudado o que travava — veja abaixo |

**Campo `?` no imóvel não corta nem entra.** Imóvel sem `dormitórios:` apurado
não é cortado por não ter três, nem incluído por talvez ter. Ele entra na saída
com o `?` declarado na própria linha da ordem, e o `?` vira `## Falta saber`.
Nunca preencha o buraco com o parecido do lado.

**O que ele já viu volta em um caso só:** quando mudou o que travava, e a
mudança está escrita com data — o preço caiu, a reforma saiu, o inquilino
desocupou. Aí a linha da ordem diz exatamente o que mudou e desde quando. Sem
mudança escrita, não volta: remostrar o que ele recusou é o jeito mais rápido
de parecer que ninguém anotou nada.

#### 4.2.1 · O descarte vale para a família

Motivo de descarte não é sobre um imóvel: é sobre um tipo. Ele recusou o
V-052 (apto 3 dorm, Cidade Baixa) por ser térreo de frente para avenida? **Todo
térreo de frente para avenida sai**, e a linha do corte diz que saiu por esse
motivo, citando quando ele disse. É isto que faz a segunda saída parecer
melhor que a primeira.

E o contrário: o que ele **elogiou** sobe na ordem. Elogiou o pátio do
V-071 (casa 3 dorm, Azenha)? Imóvel com pátio sobe, e a razão da linha é essa,
com a data em que ele disse.

**Motivo de descarte que não está escrito não se deduz.** `## Imóveis
mostrados` que só diz “não gostou” não autoriza inferir de quê. Ou vira uma das
três perguntas, ou vira `?` em `## Falta saber` — nunca vira uma teoria sobre o
gosto dele.

### 4.3 · A ordem

**Três imóveis por saída, quatro no limite.** Do quinto em diante eles se
misturam na cabeça do cliente e o melhor perde para o último. Sobrou mais? Fica
para a próxima saída, e diga isso.

A ordem sai destas regras, e nenhuma delas é opinião solta:

1. **Bairro com bairro.** Imóveis do mesmo bairro ficam seguidos, pelo que está
   em `endereço:`. É agrupamento por nome de bairro, não cálculo de rota —
   leia o passo 8.
2. **O primeiro calibra.** Comece pelo que mais se parece com o que ele pediu.
   O primeiro imóvel vira a régua com que ele mede os outros dois.
3. **O melhor por último.** Fecha-se com o que bate mais requisitos e tem o que
   ele elogiou antes. É o que ele leva para casa e discute no jantar.
4. **O que trava não fecha a saída.** Imóvel com linha pesada em `## O que
   trava` não vai por último: sair com o defeito na cabeça é sair com o defeito
   na cabeça.
5. **A luz manda no horário.** `## O que vende` que fala em sol da tarde, vista
   ou pátio ensolarado marca o imóvel no horário em que aquilo aparece — mostrar
   o pátio do sol da tarde às 9h é jogar fora o argumento.
6. **Quem decide junto ancora.** `quem decide junto:` que só pode num horário
   fixa esse horário primeiro, e o resto da saída se organiza em volta. Visita
   sem quem decide é visita que se repete.

**A duração.** Reserve por padrão **40 minutos dentro do imóvel** e **20 minutos
de vão** quando o próximo é em outro bairro. Esses dois números são padrão de
agenda, não medição de nada — diga isso na saída e troque-os pelo que ele
disser. Em automático eles entram no `## Decidi sozinho`.

### 4.4 · A razão, uma linha por imóvel

Ordem sem razão é palpite com cara de método. **Cada imóvel da ordem leva uma
linha só**, que diz qual regra o pôs ali e o fato que sustenta, com a data:

```
1. 10h · V-071 (casa 3 dorm, Azenha) — primeiro porque é o mais parecido com o
   que ela pediu (3 dorm, Azenha, dentro da faixa), e serve de régua para os
   outros dois.
2. 11h · A-014 (apto 2 dorm, Menino Deus) — no meio porque a cozinha é o ponto
   fraco dele, e ela reclamou de cozinha pequena em 15 de agosto.
3. 12h · V-052 (apto 3 dorm, Cidade Baixa) — por último porque tem o pátio que
   ela elogiou, e o sol da tarde começa a bater ali por volta do meio-dia.
```

---

## 5 · O que perguntar

Uma pergunta por vez. **Nunca mais de três numa execução** (CONTRATO §8), e cada
uma com o motivo na mesma frase. Estas são as que esta skill costuma precisar,
em ordem de importância:

1. **O horário, quando a agenda não está conectada.** “Que horários você tem
   livres no sábado? Sem isso eu não consigo pôr hora no evento, e sem hora a
   mensagem para a Joana não fecha nada.” Ofereça o que está em `horário de
   visita que costumo oferecer:` já escrito, para ele só confirmar.
2. **O sim do cliente.** “A C-017 (Joana Ribeiro) já disse que sábado dá, ou
   essa mensagem é para propor? Isso muda a etapa dela no funil — visita
   marcada é depois do sim.”
3. **O que travou e não está escrito.** Só quando o descarte anterior for o que
   decide a saída inteira.

### A escolha entre dois e quatro caminhos

Bifurcação de verdade usa a UI de perguntas do harness — botões, não prosa
pedindo para digitar um número. Rótulo de até quatro palavras, e **cada opção
declara o custo** (CONTRATO §8):

```
A manhã de sábado tem três buracos. Qual saída eu monto?

  9h às 11h        dois imóveis · o V-052 (apto 3 dorm, Cidade Baixa) fica para outro dia
  9h às 12h30      os três · você fica sem intervalo até o almoço
  Só o primeiro    uma visita bem feita no V-071 (casa 3 dorm, Azenha) · ela decide com menos base
```

Mais de quatro caminhos: escolha os três melhores e diga que há outros.

### Quando NÃO perguntar

- o fato está na carteira — use, e cite de onde veio;
- é gosto dele já decidido em `## Como eu trabalho` — siga o que está escrito;
- é detalhe que não muda a saída — deixe `?` e siga;
- está em automático — escolha e declare.

E uma oferta, **uma vez, sem insistir**, só quando `Google Agenda: não`: dizer
em uma linha que com a agenda ligada ela lê os buracos da semana sozinha e não
oferece horário em cima de compromisso, e que `/corretor:comecar` liga. Se ele
não quiser, siga perguntando o horário sem tocar mais no assunto.

---

## 6 · O formato da saída

Na ordem da CONTRATO §10 — o trabalho, `## Guardei`, `## Falta saber`,
`## Decidi sozinho`. **Estes títulos de tela não vão para arquivo nenhum da
carteira**; na carteira valem só as seções do gabarito.

### O trabalho

````markdown
# Sábado, 22 de agosto — C-017 (Joana Ribeiro)

## A ordem, e por quê
1. 10h · V-071 (casa 3 dorm, Azenha) — <a razão, uma linha, com a data do fato>
2. 11h · A-014 (apto 2 dorm, Menino Deus) — <idem>
3. 12h · V-052 (apto 3 dorm, Cidade Baixa) — <idem, e por que é o último>

40 minutos em cada um e 20 de vão entre bairros. São números de agenda, não de
trânsito — o passo 8 diz o que eu não sei aqui.

## Não entraram
- V-063 (casa 4 dorm, Tristeza) — R$ 610.000, acima da faixa de R$ 550.000
- V-052 (apto 3 dorm, Cidade Baixa) — <se for o caso, com o motivo do descarte>
- e mais dois que ela já visitou e recusou

## Para a agenda
```
título      Visita — C-017 (Joana Ribeiro) — V-071 (casa 3 dorm, Azenha)
quando      2026-08-22, 10h00 às 10h40
onde        rua José do Patrocínio, Azenha, Porto Alegre
descrição   https://fontesimoveis.com.br/imovel/8812
            mostrar o pátio dos fundos · a cozinha é pequena, ela já falou
            o marido decide junto e vem nesta
```

```
título      Visita — C-017 (Joana Ribeiro) — A-014 (apto 2 dorm, Menino Deus)
quando      2026-08-22, 11h00 às 11h40
onde        ?
descrição   …
```

## Para mandar — C-017 (Joana Ribeiro), WhatsApp
```
Joana, fechei o sábado de manhã com três para você ver.

Começo na casa da Azenha às 10h e a gente termina por volta do meio-dia. Te
pego na frente da primeira ou você prefere me encontrar lá?

Consegue vir com seu marido?
```
````

O bloco da mensagem sai **sozinho, pronto para copiar, sem comentário dentro**
(CONTRATO §6). O que você quiser explicar vai fora dele.

**Um bloco de mensagem por cliente.** Três clientes na manhã, três blocos, cada
um com o nome do cliente no título do bloco — e, com o conector, três
confirmações separadas: uma tela por mensagem, nunca uma para as três.

**Link na mensagem de confirmação:** por padrão, nenhum. A mensagem de
confirmação é sobre hora e ponto de encontro, e link no meio dela rouba a
pergunta. A exceção é o imóvel que ancora a saída e que ele **ainda não viu** —
aí entra um link, sozinho na linha, com linha em branco antes e depois. Quer
mandar os outros dois antes? É uma mensagem por imóvel, um link cada, e você
escreve os blocos separados.

**A mensagem da véspera não se escreve hoje.** Ela depende do que acontecer até
lá. O que fica hoje é o lembrete, no passo 7 — e, quando ela sair pelo conector,
a véspera tem uma leitura a mais, no fim deste passo.

`onde: ?` quando o `endereço:` do imóvel é `?`. Não se completa endereço de
cabeça, e o `?` vira linha em `## Falta saber`.

E-mail em vez de WhatsApp quando `canal:` disser e-mail — outro gabarito,
CONTRATO §6, com a assinatura do `INDICE.md`.

### A segunda saída — mandar pelo conector

Só com `WhatsApp: sim` no `INDICE.md`. Sem conector — que é o caso em toda
ferramenta de chat na web — existe só o bloco, e **ele continua sendo o
padrão**: entregue e pare, sem pedir desculpa duas vezes.

A forma é a que o passo 8 já dá para criar evento na agenda: **uma por vez, lida
de volta antes, nunca em lote e nunca no automático.** Uma trava a mais que a
agenda não precisa — o texto e o destinatário aparecem literais antes de sair,
porque evento errado se apaga e mensagem enviada, não.

Três chamadas, sempre nesta ordem:

```
preparar_envio    a conversa e o texto — devolve o código da prévia
a tela            as três partes abaixo, e ele escolhe uma das três saídas
enviar_mensagem   a prévia, a MESMA conversa e o MESMO texto, batendo byte a
                  byte. Mudou uma vírgula depois de mostrar? Prepare de novo
```

O que a tela mostra, e resumo não serve (CONTRATO §7.1):

```
para      Joana Ribeiro · C-017 (Joana Ribeiro) · +55 51 99999-0000 · falou
          por último em 15 de agosto (ultima_interacao)
texto     a mensagem INTEIRA, do jeito que vai sair — nunca “a confirmação que
          a gente combinou”
saídas    Mando agora      sai do seu WhatsApp, na sua voz
          Mudo o texto     me diga o que trocar
          Eu mesmo mando   você copia e cola no WhatsApp
```

Os três rótulos são literais: cada um diz o que a PESSOA vai fazer, não o nome
interno da peça.

A prévia vale 10 minutos, serve uma vez, e morre se chegar mensagem nova naquela
conversa — o cliente respondeu pelo celular e a resposta velha ia sair logo
atrás. Venceu, prepare outra e diga em uma linha por quê; não é erro dele.

**Quem governa aqui é a linha `envio:`, não o `modo:`** (CONTRATO §7.1). Com
`pergunta sempre` — o padrão, e o que vale se a linha faltar — a tela sai
sempre. `responder sem perguntar` libera responder conversa viva, e a
confirmação da saída raramente é isso: ela ABRE assunto, então a tela sai do
mesmo jeito. Com `não`, nem ofereça.

As ferramentas da ponte não estão em `allowed-tools`, e a primeira chamada pede
permissão — isso é normal e é bom que peça. Diz `sim` mas a ponte não respondeu?
Uma linha dizendo o que não abriu, o bloco para copiar, e **não mexa na linha do
`INDICE.md`**: como no 4.1, o que falhou foi agora.

**A confirmação da véspera pede uma leitura a mais.** Antes de preparar o envio,
releia a conversa com `listar_mensagens`, do dia em que ficou combinado para cá.
Desmarcou, adiou ou perguntou alguma coisa no meio-tempo? Não prepare envio
nenhum: mostre o que ele escreveu, com a data, e trate isso primeiro — confirmar
visita que o cliente cancelou por escrito é o jeito mais rápido de parecer que
ninguém leu nada. **E sem hora escrita no `## Combinado` não sai confirmação
nenhuma**: véspera de visita que ainda espera o sim não é véspera de nada, e o
que falta ali é a pergunta, não a confirmação.

---

## 7 · O que gravar

Só depois que o corretor tiver a saída na tela. Confira o teto **ao gravar**
(CONTRATO §9): cliente 60 linhas, imóvel 40, `hoje.md` 15 caixas. Estourou,
quem condensa é o `## Histórico`; fato corrente nunca é cortado para caber.

Grave pelo transporte da linha `carteira:`. No `drive`, atualizar reescreve o
arquivo inteiro — **leia antes de atualizar, sempre**, e devolva o texto inteiro
com a sua mudança dentro (CONTRATO §1).

### No arquivo do cliente — `clientes/<id>-<apelido>.md`, o dono

```markdown
etapa: visita marcada · desde 2026-08-19

## Imóveis mostrados
- V-071 (casa 3 dorm, Azenha) · enviado 2026-08-12 · visita marcada 2026-08-22 10h
- A-014 (apto 2 dorm, Menino Deus) · visita marcada 2026-08-22 11h

## Combinado
- visita sábado 2026-08-22, 10h, três imóveis, com o marido  ← corretor, 2026-08-19
- confirmar na véspera, sexta 2026-08-21  ← corretor, 2026-08-19

## Histórico
- 2026-08-19 saída de sábado montada, três imóveis
```

- **`etapa:` só vira `visita marcada` depois do sim do cliente.** Sem o sim, a
  etapa fica onde está e o `## Combinado` recebe
  `- proposto sábado 2026-08-22, 10h — aguardando o sim  ← corretor, 2026-08-19`.
- **Ter mandado a mensagem não é o sim.** Enviada pelo conector ou colada por
  ele, ela continua sendo proposta: o que saiu foi a pergunta, e quem responde é
  o cliente. A etapa anda com a resposta, nunca com o envio.
- **Mandou pelo conector?** Uma linha em `## Histórico` com a data e o que saiu:
  `- 2026-08-19 confirmação da saída de sábado mandada para ela no WhatsApp`.
- imóvel que já está em `## Imóveis mostrados` **estende a linha existente**, não
  ganha linha nova.
- as seis etapas são as do CONTRATO §4.3, e nenhuma se inventa.

### No arquivo de cada imóvel da saída

Uma linha em `## Mostrado a`, no mesmo formato do gabarito (CONTRATO §4.4):

```markdown
## Mostrado a
- C-017 (Joana Ribeiro) · visita marcada 2026-08-22
```

Nada mais muda no imóvel. `estado:` não vira `reservado` por causa de visita.

### No `funil.md`

Vista derivada: reflete o `etapa:` que você acabou de gravar, uma linha por
cliente, com `· desde AAAA-MM-DD` e `· próximo:` (CONTRATO §4.3).

```markdown
## visita marcada
- C-017 (Joana Ribeiro) · desde 2026-08-19 · V-071 (casa 3 dorm, Azenha), sábado 10h · próximo: confirmar na sexta
```

Etapa não mudou porque falta o sim? Atualize só o `· próximo:` da linha onde ela
já está.

### No `hoje.md`, e só às vezes

`hoje.md` é vista de um dia, e quem a reescreve inteira é
`/corretor:o-que-fazer-hoje`. Esta skill **acrescenta linha, nunca reescreve o
arquivo**, e só nestes dois casos:

- **a véspera é hoje** → uma caixa em `## Vence hoje`:
  `- [ ] Confirmar a visita de amanhã com C-017 (Joana Ribeiro) — combinado em 2026-08-19`
- **a visita é hoje** → uma caixa em `## Vence hoje` com a hora e o primeiro
  imóvel.

**Confira a data do título do `hoje.md` antes de escrever nele.** Não é a de
hoje? Não escreva — o arquivo está velho, e a linha entraria no dia errado.
Diga isso em uma linha no `## Guardei`. O lembrete não se perde: ele está no
`## Combinado` do cliente, que é de onde o `o-que-fazer-hoje` o puxa no dia
certo.

### E o `## Guardei`

Escreveu, diz onde — caminho por caminho, com o que mudou em cada um:

```markdown
## Guardei
- ~/carteira/clientes/C-017-joana-ribeiro.md — etapa, a visita e o lembrete da véspera
- ~/carteira/imoveis/V-071-casa-3d-azenha.md — uma linha em Mostrado a
- ~/carteira/funil.md — a C-017 (Joana Ribeiro) foi para “visita marcada”
- ~/carteira/hoje.md — não mexi: o arquivo é de 2026-08-15, e quem o refaz é /corretor:o-que-fazer-hoje
```

No `drive` o bloco é o mesmo, nomeando a pasta em vez do caminho:

```markdown
## Guardei
- clientes/C-017-joana-ribeiro.md, na pasta carteira do seu Drive — etapa, a visita e o lembrete da véspera
- imoveis/V-071-casa-3d-azenha.md, na pasta carteira do seu Drive — uma linha em Mostrado a
```

---

## 8 · Onde ela para

Isto não é rodapé. É o que separa uma ferramenta honesta de uma perigosa, e vai
na saída em linguagem curta, sem pedido de desculpa.

- **Ela não sabe trânsito nem distância.** Ela agrupa pelo nome do bairro que
  está em `endereço:` e mais nada — não mede quilômetro, não sabe que a ponte
  está em obra, não sabe que sábado às 11h a avenida trava. **Conferir a rota é
  do corretor**, e é a primeira coisa que ela diz sobre a ordem. Os 20 minutos
  de vão são padrão de agenda, não medição.
- **Ela não cria o evento sozinha, e não manda mensagem sem mostrar.** Entrega
  os dois prontos e para. Se o corretor pedir com todas as letras para criar um
  evento, crie **um por vez**, leia de volta título, dia, hora e endereço antes
  de cada um, e diga o que criou. Nunca em automático, nunca em lote, nunca sem
  ele pedir. **O envio pelo conector tem exatamente essa forma**, e uma trava a
  mais: o texto e o destinatário aparecem literais antes de sair, porque evento
  errado se apaga e mensagem enviada, não (passo 6, a segunda saída).
- **Da agenda ela só lê, e só enxerga o que está escrito lá.** Compromisso que
  ele não anotou não existe para ela — a janela que ela achou livre pode estar
  ocupada de verdade. Com a agenda desconectada é pior e é honesto dizer: o
  horário que sai é o que ele falou, não um horário conferido.
- **Ela não abre página de imóvel.** O degrau 5 da ordem de busca não existe
  aqui — esta skill trabalha com o que já está apurado na carteira. Imóvel sem
  `preço:`, sem `endereço:` ou sem `dormitórios:` não vira dado novo nesta
  execução: ela declara o `?` e manda para `/corretor:anunciar-imovel`, que é
  quem lê link e ficha colada.
- **Ela não sabe se dá para entrar no imóvel.** Chave na imobiliária, inquilino
  morando, proprietário que só abre com aviso de 24 horas — nada disso tem campo
  na carteira. Se estiver escrito em `## O que trava` ou em `## Combinado`, ela
  usa; se não estiver, vira uma linha em `## Falta saber`, e conferir acesso
  antes de mandar a mensagem é dele.
- **Ela não decide o que é dele.** Não negocia preço, não diz que o imóvel serve
  para o cliente, não promete prazo de financiamento nem de cartório. Ela ordena
  o que está apurado e mostra a razão de cada posição.
- **Ela não deduz o gosto do cliente.** Descarte sem motivo escrito vira `?` ou
  pergunta, nunca teoria. E `## Imóveis mostrados` vazio não é “ele não viu
  nada”: é a carteira não sabendo.
- **O imóvel `reservado` fica fora da rota**, mesmo que caiba em tudo. Mostrar o
  que pode não estar mais disponível custa a visita inteira.
- **A ordem é uma proposta.** Ela é derivada de seis regras escritas no passo
  4.3, não de conhecer o cliente. Quem conhece o cliente é o corretor, e trocar
  a ordem dele vale mais que a razão dela.

---

## 9 · A língua

`CONTRATO §10`, sem exceção nesta skill. Os dois pontos que mais escapam aqui:
**todo id anda com o apelido**, inclusive dentro do bloco de mensagem e do
título do evento; e na mensagem ao cliente **a voz é a do corretor**, com o
nome dele.
