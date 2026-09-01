---
name: organizar-carteira
description: >-
  Faz a manutenção da carteira: lê o que está em `_bruto/` e ainda não virou
  fato — conversa colada, ficha, e-mail —, extrai os campos com procedência e
  grava nos arquivos donos. Aposenta o cliente parado há mais de 120 dias,
  aplica os tetos e mostra o que sairia antes de podar. Acha o que só se vê de
  cima: cliente no funil sem arquivo, imóvel citado que não existe, campo ? que
  uma conversa já respondeu. Relata cada arquivo que tocou: nada some em
  silêncio e nada é apagado. Use quando o corretor disser — organiza minha
  carteira, dá um jeito nessa bagunça, colei um monte de conversa e não sei se
  entrou, arquiva quem sumiu, tira o que eu já vendi, tem cliente repetido aí, o
  arquivo do cliente está gigante, faz uma faxina. Também depois de uma semana
  colando material sem organizar, e quando a lista do dia traz coisa que já
  morreu. Não escreve a mensagem para quem sumiu (/corretor:retomar-contato),
  não monta a lista do dia (/corretor:o-que-fazer-hoje) nem lê matrícula
  (/corretor:conferir-matricula).
license: MIT
compatibility: >-
  Precisa da carteira, no computador ou no Google Drive: ela é a manutenção da
  carteira e não funciona sem uma — diz isso em uma linha e manda rodar
  /corretor:comecar. No Drive, precisa do conector ligado. Para aposentar,
  precisa de uma ferramenta que tire o arquivo do lugar; sem ela nada é movido,
  e a lista do que sairia vai para o relatório.
allowed-tools: Read Glob Grep Write Edit
---

# Organizar a carteira

## 1 · O que ela faz, e o que ela não faz

Ela é a manutenção do pack: lê o que chegou e ainda não virou fato, aposenta o
que morreu, poda o que passou do teto, reescreve as vistas derivadas e aponta o
que só aparece olhando a carteira inteira de cima — e **relata cada arquivo que
tocou, com o caminho**, porque o corretor nunca pode abrir a carteira e não
achar o que tinha.

**O argumento é opcional:** sem nada, ela varre a carteira inteira; com o id de
um cliente ou de um imóvel, ela trabalha só esse item.

Ela não apaga nada, não abre link, não escreve mensagem para cliente nenhum,
não lê matrícula, não decide preço e não escolhe entre dois fatos que se
contradizem — o que ela não apurou sai como `?` e vira linha em `## Falta
saber`.

**Por que ela tem `Write` e `Edit`.** Ela grava em quatro lugares: arquivo de
cliente novo, vindo de uma conversa colada que ainda não tinha ficha (`Write`);
fato extraído para arquivo que já existe (`Edit`); vistas derivadas — `funil.md`,
os dois `_indice.md`, as contagens do `INDICE.md` (`Edit`); e o arquivo de
histórico condensado em `_bruto/` (`Write`, arquivo novo). **`Write` só em
arquivo que não existe.** Sobrescrever um arquivo da carteira apaga o que outra
skill gravou ali, e esta é a skill que mais mexe em arquivo dos outros. No
`drive` os verbos são outros — criar arquivo e atualizar arquivo —, e a regra é
a mesma: cria só o que não existe. Atualizar no `drive` reescreve o arquivo
inteiro, então **leia antes de atualizar, sempre**. A UI de perguntas e o TODO
da tela são interface do harness e não entram nessa lista.

---

## 2 · Antes de tudo

Leia, nesta ordem:

1. **`references/CONTRATO.md`, inteiro.** Ele é a lei do pack, e
   **nenhum gabarito é reescrito aqui**. As seções que esta skill mais usa:

```
1    os dois transportes, e quem é dono de qual fato — a vista nunca vence
     o arquivo
2    id e apelido, e por que o nome do arquivo não muda
3    as três regras, e os quatro passos de aposentar
4    os sete formatos literais
7    como ler conversa colada, e o que fazer com ela depois
8    a ordem de busca e o teto de três perguntas
9    os tetos e o que fazer quando estouram
10   como uma skill começa e termina
11   onde ela roda, e por que ela não funciona sem carteira
```

2. **o `INDICE.md` da carteira**, pela primeira leitura da seção 1 do contrato:
   procura no computador e, não achando, a pasta `carteira` no Drive. A linha
   `carteira:` dele diz o transporte — `local` ou `drive` —, e **toda leitura e
   toda gravação desta execução vão por ele**. Dali saem também o `modo:`, o
   nome do corretor, o `## Como eu trabalho` e o `## Pulado no começo`.

**A carteira não existe** — não há `INDICE.md` em transporte nenhum? Uma linha,
e só:

> Não achei a sua carteira, nem no computador nem no seu Drive. Rode
> `/corretor:comecar`: ele monta em alguns minutos e termina com um imóvel e um
> cliente de verdade dentro dela.

Não crie a carteira, não trabalhe sem ela, não improvise em outra pasta. Esta
skill organiza o que existe; ela não é o começo de nada.

**Recebeu um id como argumento?** Ele chega sozinho, como o corretor digitou, e
a primeira coisa é achar o apelido no `_indice.md` do tema: daí em diante é
C-017 (Joana Ribeiro) em toda linha que sair daqui. Trabalhe só esse item e o
que estiver em `_bruto/` sobre ele, e diga no relatório que a varredura foi
parcial. Sem argumento, a carteira inteira.

---

## 3 · O modo

Leia a linha `modo:` do `INDICE.md`. Vale `automatico` e `automático`; qualquer
outro valor, linha ausente ou arquivo ilegível, o modo é **copiloto**. Nunca se
deduz automático por pressa nem porque a escolha parece óbvia.

```
copiloto      extrai, reescreve as vistas e recontar é dela — isso é o
              contrato, não é bifurcação. PARA antes de aposentar qualquer
              coisa e antes de podar qualquer histórico, e mostra o que sairia
automático    aposenta o cliente parado há mais de 120 dias, poda o histórico
              velho, e declara cada uma em ## Decidi sozinho, com como desfazer
```

Três coisas que o automático **não** faz, e esta é a parte que separa a skill de
uma trituradora:

- **Não aposenta por outro motivo que não o prazo de 120 dias.** Imóvel vendido,
  alugado, fora do mercado, exclusividade vencida, cliente que desistiu: é
  decisão do corretor mesmo no automático (contrato, regra 3). Vai para
  `## Espera você`, não para `## Decidi sozinho`.
- **Não escolhe verdade.** Automático escolhe caminho — dois fatos apurados que
  se contradizem não são um caminho. Ele relata os dois com a procedência de
  cada um e segue.
- **Entre criar e apagar, ele cria.** Linha no funil sem arquivo, item no
  `_indice.md` sem arquivo: cria a ficha com o id, o apelido e todo o resto `?`.
  Criar deixa rastro; tirar a linha não deixa nenhum.

---

## 4 · O trabalho, passo a passo

Esta é a skill mais demorada do pack e ela **mostra o TODO na tela** — sempre,
não só quando a carteira é grande. Demorar sem mostrar é onde o leigo acha que
travou.

```
1  ler a carteira e listar o que precisa de atenção
2  ler o que está em _bruto/ e ainda não virou fato
3  gravar os fatos nos arquivos donos
4  aposentar o que morreu
5  podar o que passou do teto
6  reescrever as vistas e recontar o INDICE.md
7  escrever o relatório
```

### Passo 1 · O inventário

Liste, pelo verbo do transporte (contrato, seção 1, a tabela de equivalência):
no `local`, busca por nome dentro do caminho absoluto; no `drive`, procura com a
pasta como pai.

```
~/carteira/imoveis/*.md
~/carteira/clientes/*.md
~/carteira/_bruto/*
~/carteira/arquivo-morto/imoveis/*.md
~/carteira/arquivo-morto/clientes/*.md
```

Leia `INDICE.md`, `funil.md`, `hoje.md` e os dois `_indice.md` — cada um **preso
à pasta dele**: no `drive`, o nome `_indice.md` solto devolve o de `imoveis/` e
o de `clientes/` juntos, e gravar um por cima do outro perde uma lista. Depois
leia os arquivos de imóvel e de cliente — **os tetos existem para que esta
leitura seja barata**: vinte clientes de sessenta linhas cabem numa passada. Se a carteira
estourou tanto que não cabe, é exatamente o problema que ela veio resolver:
comece pelos maiores, faça o passo 5 neles primeiro, e diga no relatório que o
resto ficou para a próxima execução.

### Passo 2 · O que ainda não virou fato

Não existe campo que marque um arquivo de `_bruto/` como já lido, e não se
inventa um — o contrato fecha os campos, e `_bruto/` não se edita. **A marca é a
procedência:** um bruto já virou fato quando o nome dele aparece como origem em
algum arquivo dono.

```
procure   o nome do bruto: 2026-08-12-whatsapp-joana.md
          em: ~/carteira/imoveis/  ~/carteira/clientes/  ~/carteira/arquivo-morto/
          zero ocorrências → ainda não virou fato
```

No `local` é busca de conteúdo, com `Grep`. No `drive` não há busca dentro do
texto: a procura é nos arquivos donos que o passo 1 já leu.

O `arquivo-morto/` entra na busca: bruto de cliente aposentado já foi lido, e
relê-lo ressuscitaria a ficha.

Trate **do mais antigo para o mais novo** — a data está no nome do arquivo. **Até
dez por execução.** Sobraram? Diga quantos são e que a próxima execução pega:
uma execução que lê quarenta arquivos e escreve trinta é onde o corretor perde o
fio do que aconteceu.

### Passo 3 · Extrair o fato

Contrato, seção 7, e nada além dela. Para cada bruto não lido:

- **De quem é.** O cabeçalho tem `sobre:` — case com o `_indice.md` do tema.
  Sem `sobre:`, ache pelo nome ou pelo telefone no corpo. Não achou de jeito
  nenhum: fica sem tratar, e vira linha no relatório com o nome do arquivo.
- **Cliente que ainda não tem ficha**, e a conversa traz nome, canal e ao menos
  um fato: crie o arquivo pelo gabarito da seção 4.5. O id é o maior do
  `_indice.md` mais um, **contando o `## Arquivo morto`** — id não se
  reaproveita. Todo o resto entra `?`.
- **Imóvel que não está na carteira: não crie.** Sem link e sem ficha o imóvel
  não entra (contrato, seção 7) — dado de imóvel adivinhado vira preço errado no
  WhatsApp do cliente. Vira pergunta, se couber no teto de três, ou linha em
  `## Falta saber`.
- **Documento — matrícula, escritura, contrato: ela não extrai fato dali.**
  Registra que o documento está em `_bruto/` e manda para
  `/corretor:conferir-matricula`, que é quem lê e é a única que nunca opera em
  automático.
- **Buraco é buraco.** `<Mídia oculta>`, mensagem apagada, áudio, figurinha: vira
  linha declarada em `## Combinado` ou pergunta ao corretor, nunca palpite.
- **Pedido de silêncio se lê e se grava, sempre.** “não me manda mais
  mensagem”, “para de me mandar isso”, “me tira daí”: grave
  `não contatar: sim  ← _bruto/<arquivo>, <data>` no arquivo do cliente,
  escreva a linha dele em `nao-contatar.txt` no diretório da ponte se houver
  conector, e diga no relatório. **Não pergunte se ele quer insistir** — quem
  pediu silêncio saiu do alcance das dez, e a `/corretor:retomar-contato` para
  de elegê-lo na próxima execução. É o único fato desta lista que muda o
  comportamento de outra skill, e por isso ele nunca fica para depois.
- **Cada campo com `← _bruto/<arquivo>`**, e a data é a do material, não a de
  hoje. Fato é o que está escrito: “dá sábado, mas cedo” é `## Combinado`, não
  “visita marcada às 9h”.

### Passo 4 · Aposentar (a regra 3)

Duas listas, e elas não se misturam:

| motivo | quem decide |
|---|---|
| cliente sem contato há mais de 120 dias | **a skill** — nos dois modos |
| imóvel `vendido` ou `alugado` | o corretor, mesmo no automático |
| imóvel `fora do mercado`, exclusividade vencida | o corretor, mesmo no automático |
| cliente que fechou, ou desistiu por escrito | o corretor, mesmo no automático |

Os 120 dias contam da data mais nova entre o `## Histórico`, o `## Combinado` e
o `último contato` do `_indice.md`. **Nenhuma data em lugar nenhum: não aposenta
por dedução** — vira uma linha no relatório dizendo que o cliente está sem data
de contato desde que entrou.

Aposentar é os quatro passos do contrato, nesta ordem: a linha
`aposentado: <data> · motivo: <desfecho>` logo abaixo do título; o arquivo para
`arquivo-morto/imoveis/` ou `arquivo-morto/clientes/`; a linha sai da tabela do
`_indice.md` e entra em `## Arquivo morto` com o desfecho; e some do `funil.md`
e do `hoje.md`.

**Do `hoje.md` ela tira só as linhas de quem aposentou.** O resto não se toca:
quem reescreve aquele arquivo é `/corretor:o-que-fazer-hoje`.

**Mover é duas operações, e a segunda não é dela.** A primeira é criar o arquivo
em `arquivo-morto/`. Tirar o original do lugar não está na tabela de
equivalência do contrato: no `local` é operação de sistema de arquivos — `mv` no
Mac e no Linux, `Move-Item` no Windows, sempre com caminho absoluto —, e ela
pede permissão na primeira vez; no `drive` é o que o conector tiver para tirar o
arquivo da pasta. **Confira que a execução tem como tirar o original do lugar
ANTES de mover o primeiro arquivo.** Não tem? Nada é movido nesta execução: a
lista do que deveria sair vai para o relatório com o motivo em uma linha, e a
carteira fica exatamente como estava. Carteira com o mesmo cliente em duas
pastas é pior que carteira por organizar.

### Passo 5 · Os tetos

```
INDICE.md              120 linhas
arquivo de cliente      60 linhas
arquivo de imóvel       40 linhas
_indice.md              uma linha por item, e nada mais
hoje.md                 15 caixas
```

Estourou um arquivo de cliente ou de imóvel, quem condensa é o `## Histórico`:
linhas de mais de 90 dias viram uma por mês — `- 2026-05 três visitas, nenhuma
proposta`. Se ainda estourar, o excesso vai para um arquivo novo em `_bruto/` e
o histórico fica com a linha que aponta para ele:

```
~/carteira/_bruto/2026-08-19-historico-rita.md

origem: histórico condensado de C-019 (Rita Camargo)
recebido: 2026-08-19
sobre: C-019 (Rita Camargo)

---

<as linhas, exatamente como estavam no arquivo>
```

E no arquivo do cliente: `- histórico até 2026-05-19 em _bruto/2026-08-19-historico-rita.md`.

Assim a poda **não perde uma palavra** — o que sai do arquivo entra inteiro em
outro, e o contrato manda gravar o excesso em `_bruto/` justamente por isso.

**Fato corrente nunca é cortado para caber.** Se o que estoura o teto é fato de
hoje, o arquivo passa do teto e a linha vai para o relatório — teto que come o
que importa é pior que teto estourado.

`INDICE.md` estourado: o que se corta é cópia dos `_indice.md`, e nada mais.
`hoje.md` com mais de 15 caixas não é assunto desta skill: é de
`/corretor:o-que-fazer-hoje`, e vira uma linha no relatório.

`_indice.md` com duas linhas para o mesmo id: **pare**. Mostre as duas e pergunte
qual fica — id duplicado é a única coisa que quebra a carteira inteira, porque
dois arquivos passam a disputar o mesmo nome.

### Passo 6 · O que só se vê de cima

| o que ela acha | o que ela faz |
|---|---|
| cliente no `funil.md` sem arquivo em `clientes/` | pergunta: criar a ficha com `?` ou tirar a linha. No automático, cria |
| arquivo de cliente com `etapa:` e sem linha no `funil.md` | reescreve o funil — a vista é derivada, o arquivo é dono |
| `etapa:` do arquivo diferente da do `funil.md` | o arquivo vence, o funil se reescreve |
| imóvel citado num cliente que não existe em `imoveis/` | não cria o imóvel. Pede o link, uma vez |
| item no `_indice.md` sem arquivo, ou arquivo sem linha | reescreve o `_indice.md` a partir dos arquivos |
| aposentado ainda na tabela viva, no funil ou no `hoje.md` | tira das três — ele já tem a linha em `## Arquivo morto` |
| campo `?` que uma conversa em `_bruto/` já respondeu | grava o valor com `← _bruto/<arquivo>` e diz no relatório |
| campo preenchido **sem** procedência | não inventa origem. Vai para `## Não bate`, e para `## Falta saber` se for campo que sai na mensagem (preço, área, dormitórios) |
| `estado:` ou `etapa:` fora das listas fechadas | não corrige por conta própria: pergunta qual dos valores válidos é |
| dois clientes que parecem a mesma pessoa | mostra os dois e para. **Ela não funde ficha** |
| contagem do `## Quanto tem` diferente da real | reconta e grava |
| id duplicado | passo 5: pare e pergunte |

Divergiu um fato apurado de outro fato apurado — o cliente diz que visitou em
15/08 e o imóvel diz 16/08? **Ela mantém os dois e relata os dois com a
procedência de cada um.** Escolher qual é verdade é inventar dado com cara de
apurado, que é a única coisa que a regra 2 proíbe sem exceção.

### Passo 7 · Reescrever as vistas e recontar

Nesta ordem, sempre depois dos arquivos donos: `funil.md` (a partir dos `etapa:`),
os dois `_indice.md` (a partir dos arquivos), e o `## Quanto tem` do `INDICE.md`.
Atualize a data de `atualizado:` nos três lugares que a têm.

**Vista derivada não carrega procedência.** A seta `←` mora no arquivo dono; o
funil e os índices são resumo, e resumo não é prova.

---

## 5 · O que perguntar, e como

A ordem de busca do contrato vale inteira, e o degrau 5 — o link — **não existe
nesta skill**: ela não abre página nenhuma (seção 8 daqui). Só se pergunta o que
os arquivos não têm.

**Teto de três perguntas por execução**, e a fila de prioridade é esta:

```
1  id duplicado no _indice.md            quebra a carteira
2  aposentadoria que trava outra coisa   o imóvel vendido continua sendo mostrado
3  imóvel citado que não existe          pede o link, uma vez
```

O que não couber nas três **não some**: vira linha em `## Espera você` ou em
`## Falta saber`, e a próxima execução ataca. Skill que abre com formulário de
oito campos é abandonada na primeira execução.

Toda pergunta traz o motivo na mesma frase. E escolha entre dois e quatro
caminhos usa a **UI de perguntas do harness** — botões, não prosa —, com o custo
escrito em cada opção e rótulo de até quatro palavras:

```
O arquivo do C-019 (Rita Camargo) está com 74 linhas, e o teto é 60.

  Condensar o histórico   11 linhas viram 3, uma por mês · o texto inteiro
                          fica em _bruto/ e o arquivo aponta para lá
  Deixar como está        nada se perde de vista · toda skill relê 74 linhas
                          para achar um telefone, em toda execução
  Ver o que sairia        eu mostro as 11 linhas e você decide depois
```

**Quando não perguntar:** o fato está na carteira (use e cite de onde veio); é
gosto já decidido em `## Como eu trabalho`; é detalhe que não muda a saída
(deixe `?`); ou o modo é automático e a decisão é das que ele pode tomar.

Um item do `## Pulado no começo` pode ser oferecido de volta **uma vez, sem
insistir**, e fora das três perguntas — é oferta, não pergunta.

---

## 6 · O formato da saída

Esta skill **não tem bloco para colar**: o trabalho dela é o relatório. Os
títulos abaixo são do relatório na tela; os três do fecho são do contrato, vêm
por último e nesta ordem exata. Seção sem conteúdo não aparece.

```markdown
# Organizei a carteira — 2026-08-19

Li 4 arquivos de _bruto/, movi 1 cliente para arquivo-morto/, podei 1 histórico
e achei 3 coisas que não batem.

## Li o que estava em _bruto/
- 2026-08-12-whatsapp-joana.md → C-017 (Joana Ribeiro): telefone, faixa até
  R$ 550.000 e o que ela não aceita
- 2026-08-17-email-almeida.md → C-031 (Sr. Almeida): manda até sexta o IPTU
  do V-071 (casa 3 dorm, Azenha)
- 2026-08-18-matricula-44812.md → nada extraído. É matrícula, e quem lê é
  /corretor:conferir-matricula
- 2026-08-14-whatsapp-desconhecido.md → nada extraído. Fala de um apartamento na
  Cidade Baixa que não está na carteira, e sem link eu não crio imóvel

## Movi para arquivo-morto/
- C-002 (Léo Antunes) · sem responder desde 2026-04-02, 139 dias · de
  clientes/ para arquivo-morto/clientes/C-002-leo-antunes.md
  Nada foi apagado: o arquivo está inteiro lá, e volta na hora que você pedir.

## Podei
- C-019 (Rita Camargo) estava com 74 linhas, teto 60. O histórico anterior a
  2026-05-19 virou 3 linhas, uma por mês. As 11 originais estão em
  ~/carteira/_bruto/2026-08-19-historico-rita.md, e o arquivo aponta para lá.
  Nada corrente foi cortado.

## Não bate
- C-024 (Paulo Menezes) está no funil.md em “novo lead” e não tem arquivo em
  clientes/. Criei a ficha com o id, o apelido e o resto ?
- V-052 (apto 3 dorm, Cidade Baixa) aparece com preço R$ 480.000 no arquivo
  da C-008 (Família Duarte), e o arquivo dele diz R$ 495.000 ← link,
  2026-08-16. Mantive os dois: quem sabe qual vale é você
- A-014 (apto 2 dorm, Menino Deus) tem “área: 62 m²” sem procedência. Não
  inventei de onde veio

## Espera você
- V-052 (apto 3 dorm, Cidade Baixa) está com estado: vendido desde 2026-08-18 e
  continua na tabela viva. Aposentar imóvel vendido é decisão sua, e eu não
  faço isso sozinha nem no automático. Me diga e eu movo, com a data e o motivo.

## Guardei
- ~/carteira/clientes/C-017-joana-ribeiro.md — 3 campos novos
- ~/carteira/clientes/C-024-paulo-menezes.md — criado, quase tudo ?
- ~/carteira/clientes/C-019-rita-camargo.md — histórico condensado
- ~/carteira/_bruto/2026-08-19-historico-rita.md — criado, com o que saiu de lá
- ~/carteira/arquivo-morto/clientes/C-002-leo-antunes.md — movido de clientes/
- ~/carteira/clientes/_indice.md — reescrito, 21 → 21 ativos, 1 aposentado novo
- ~/carteira/funil.md — reescrito
- ~/carteira/INDICE.md — contagens

## Falta saber
- IPTU do V-071 (casa 3 dorm, Azenha) — o C-031 (Sr. Almeida) manda até sexta
- de onde veio a área do A-014 (apto 2 dorm, Menino Deus)
- o link do apartamento da Cidade Baixa que aparece na conversa de 14 de agosto

## Decidi sozinho
- Aposentei o C-002 (Léo Antunes): 139 dias sem responder, e o teto é 120. Para
  trazer de volta, me diga — o arquivo está em arquivo-morto/clientes/.
- Criei a ficha do C-024 (Paulo Menezes) em vez de tirar a linha do funil.
  Criar deixa rastro, tirar não. Se ele não é cliente, me diga e eu aposento.
```

Os caminhos do `## Guardei` são os do transporte: no `local`, `~/carteira/…`,
como acima; no `drive`, a pasta e o arquivo dentro dela —
`clientes/C-017-joana-ribeiro.md, na pasta carteira do seu Drive`. A regra não
muda: **escreveu, diz onde.**

Ao falar com o corretor, data em prosa — “14 de agosto”. **Nos arquivos, sempre
`2026-08-14`.** Todo id aparece com o apelido junto, inclusive dentro de tabela e
de histórico.

---

## 7 · O que ela grava, onde, e com que procedência

| o que | onde | procedência |
|---|---|---|
| fato de cliente vindo de conversa colada | `clientes/<id>-<apelido>.md` | `← _bruto/<arquivo>` |
| fato de imóvel vindo de ficha em `_bruto/` | `imoveis/<id>-<apelido>.md` | `← _bruto/<arquivo>` |
| o que o corretor respondeu agora | o arquivo dono | `← corretor, <hoje>` |
| a linha do aposentado | abaixo do título, no próprio arquivo | `aposentado: <data> · motivo: <desfecho>` |
| histórico condensado | `## Histórico` + arquivo novo em `_bruto/` | a linha aponta o arquivo |
| `funil.md`, os `_indice.md`, `## Quanto tem` | as vistas | **nenhuma** — vista derivada não leva seta |

O formato da procedência é o do contrato e não varia: valor, dois espaços, seta,
origem, vírgula, data — `preço: R$ 520.000  ← link, 2026-08-12`. As origens são
seis e não há outras: `link`, `ficha colada`, `_bruto/<arquivo>`, `corretor`,
`visita`, `matrícula`. **Se o que ela apurou não cabe em nenhuma delas, o dado
não entra:** vira linha em `## Não bate`.

O que não se apurou entra `?`, e o `?` pode carregar na seta o que resolve ele —
`iptu: ?  ← pedir ao proprietário`. Campo inventado com cara de apurado é pior
que campo vazio: o corretor repassa e descobre na visita.

Ordem de gravação, e ela importa: **primeiro os arquivos donos, depois as
vistas**. Vista escrita antes do dono é vista que descreve um estado que não
existe mais.

---

## 8 · Onde ela para

**Ela não apaga nada. Nunca.** Nem arquivo, nem linha de `_bruto/`, nem histórico
sem cópia. O que sai de vista continua na carteira, e o relatório diz onde —
gaveta, não lixeira. Se algo precisa sumir de verdade, quem apaga é o corretor,
no computador ou no Drive dele.

**Ela não move sem ter como mover.** Aposentar é copiar para `arquivo-morto/` e
tirar da origem, e tirar da origem exige uma ferramenta que ela não concede
sozinha — o terminal no `local`, o que o conector tiver no `drive`. Sem ela, a
skill **não move nada** e escreve por quê: meia mudança — o arquivo em duas
pastas — é pior que a carteira do jeito que estava.

**Ela não abre link.** As ferramentas dela leem a carteira, não a internet, e é
de propósito: varrer uma carteira abrindo trinta páginas é uma execução de meia
hora que termina com o corretor sem saber o que mudou. O `?` que um link
resolveria sai em `## Falta saber` com o nome de quem abre: `/corretor:anunciar-imovel`
— e é lá que está escrito o que fazer quando o site só monta a página por
JavaScript e devolve nada.

**Ela não lê documento.** Matrícula, escritura, contrato, PDF de cartório, foto
de papel: ela registra que está em `_bruto/` e manda para
`/corretor:conferir-matricula`. Número de matrícula lido de foto vira número
errado no anúncio, e concluir se um documento está em ordem não é dela nem de
skill nenhuma — é de advogado e de cartório.

**Ela não transcreve áudio de ouvido.** Áudio no meio de uma conversa vira
pergunta: “Tem um áudio de 12 de agosto no meio dessa conversa. O que ela disse
ali?”. `<Mídia oculta>` e mensagem apagada viram buraco declarado.

**Ela não funde duas fichas.** Dois clientes que parecem a mesma pessoa: mostra
os dois e para. Fundir aposenta um id sem desfecho, e id não se reaproveita —
quando a fusão acontecer, é com o corretor olhando.

**Ela não escolhe verdade.** Dois fatos apurados que se contradizem ficam os
dois, cada um com a sua procedência. Nem o automático decide isso.

**Ela não escreve mensagem.** Nenhuma, para ninguém. A mensagem de quem sumiu é
de `/corretor:retomar-contato`; a lista do dia é de `/corretor:o-que-fazer-hoje`;
o anúncio é de `/corretor:anunciar-imovel`. Esta aqui arruma a carteira de onde
as três tiram o que dizem.

**Ela não reescreve arquivo que já existe.** `Write` só em arquivo novo. Arquivo
fora do gabarito se corrige com `Edit`, linha a linha, e o que não der para
corrigir assim vira linha em `## Não bate` — reescrever inteiro é como se apaga
o trabalho de outra skill sem apagar nenhum arquivo. No `drive` não existe trocar
um trecho: atualizar devolve o arquivo inteiro, então **ela lê antes de
atualizar, sempre**, e o que ela devolve é o texto que estava lá com a mudança
dentro.

**Ela não sai da carteira.** Não roda git, não sincroniza, não faz backup,
não toca em pasta nenhuma fora dali, e não sabe o que a imobiliária tem no CRM.

**Ela para no décimo bruto** e diz quantos ficaram. E se a carteira estiver tão
estourada que a leitura não cabe, ela trata os maiores, diz o que sobrou, e não
finge que varreu tudo.

E quando algo não der certo, uma linha: o que não deu e qual é o caminho. Sem
pedir desculpa duas vezes, e sem sumir do assunto.
