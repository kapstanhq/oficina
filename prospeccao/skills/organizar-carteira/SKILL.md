---
name: organizar-carteira
description: >-
  Faz a manutenção da carteira: lê o que está em `_bruto/` e ainda não virou
  fato — conversa colada, ficha, e-mail —, extrai os campos com procedência e
  grava nos arquivos donos, e importa a planilha que estiver em _bruto/.
  Aposenta quem parou há mais de 90 dias, aplica os tetos e mostra o que
  sairia antes de podar. Acha o que só se vê de cima: contato no funil sem
  arquivo, conta que se cita e não existe, campo ? que uma conversa já
  respondeu. Relata cada arquivo que tocou: nada some em silêncio. Use quando
  o prospector disser — organiza minha carteira, dá um jeito nessa bagunça,
  colei um monte de conversa e não sei se entrou, coloquei a planilha na
  pasta, arquiva quem sumiu, tira o que eu já vendi, tem contato em dobro aí,
  o arquivo do contato está gigante, faz uma faxina. Também depois de uma
  semana colando material sem organizar. Não escreve a mensagem de quem sumiu
  (/prospeccao:retomar-contato), não monta a lista do dia
  (/prospeccao:o-que-fazer-hoje) nem lê CNPJ (/prospeccao:estudar-conta).
license: MIT
compatibility: >-
  Precisa da carteira, numa pasta do computador: ela é a manutenção da
  carteira e não funciona sem uma — diz isso em uma linha e manda rodar
  /prospeccao:comecar. Para aposentar, precisa de uma ferramenta que tire o
  arquivo do lugar; sem ela nada é movido, e a lista do que sairia vai para o
  relatório.
allowed-tools: Read Glob Grep Write Edit
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/organizar-carteira/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# Organizar a carteira

## 1 · O que ela faz, e o que ela não faz

Ela é a manutenção do pack: lê o que chegou e ainda não virou fato, aposenta o
que morreu, poda o que passou do teto, reescreve as vistas derivadas e aponta o
que só aparece olhando a carteira inteira de cima — e **relata cada arquivo que
tocou, com o caminho**, porque o prospector nunca pode abrir a carteira e não
achar o que tinha.

**O argumento é opcional:** sem nada, ela varre a carteira inteira; com o id de
um contato ou de uma conta, ela trabalha só esse item.

**Quem só OLHA é outra skill.** `/prospeccao:laudo-da-carteira` lê a carteira e
não escreve uma linha: ela diz o que está sem procedência, o que venceu, o que
ficou órfão e o que passou do teto. Esta aqui é a que conserta. A separação é
de propósito — a régua precisa ser barata o bastante para rodar antes e depois
de qualquer coisa, e o que escreve nunca é barato. Na dúvida sobre o estado da
carteira, roda-se o laudo primeiro; ele diz se vale chamar esta.

Ela não apaga nada, não abre link, não escreve mensagem para contato nenhum,
não lê CNPJ, não decide preço e não escolhe entre dois fatos que se
contradizem — o que ela não apurou sai como `?` e vira linha em `## Falta
saber`.

**Por que ela tem `Write` e `Edit`.** Ela grava em quatro lugares: ficha nova
— contato que veio de uma conversa colada e ainda não tinha ficha, conta que veio
de uma linha da planilha (`Write`); fato extraído para arquivo que já existe
(`Edit`); vistas derivadas — `funil.md`, os dois `_indice.md`, as contagens do
`INDICE.md` (`Edit`); e arquivo novo em `_bruto/` — o histórico condensado, ou
a planilha que ele colou na conversa (`Write`). **`Write` só em
arquivo que não existe.** Sobrescrever um arquivo da carteira apaga o que outra
skill gravou ali, e esta é a skill que mais mexe em arquivo dos outros. No
`drive` os verbos são outros — criar arquivo e atualizar arquivo —, e a regra é
a mesma: cria só o que não existe. Atualizar no `drive` reescreve o arquivo
inteiro, então **leia antes de atualizar, sempre**. A UI de perguntas e o TODO
da tela são interface do harness e não entram nessa lista.

---

## 2 · Antes de tudo

Leia, nesta ordem:

1. **O contrato, por seção.** Ele é a lei do pack, e ler o documento inteiro
   custa vinte a trinta mil tokens antes da primeira leitura da carteira.
   Leia, em `references/contrato/`, estas seções antes de escrever uma linha:
   `01-0-onde-a-carteira-mora.md` (os dois transportes, e quem é dono de qual
   fato — a vista nunca vence o arquivo), `02-0-id-e-apelido.md` (o id, e por
   que o nome do arquivo não muda), `03-0-as-tres-regras.md` (as três regras,
   e os quatro passos de aposentar), `04-0-os-formatos.md` e os sete que o
   seguem, de `04-1-indice.md` a `04-7-o-bruto.md` (os formatos literais —
   `04-4-arquivo-de-conta.md` é o gabarito da ficha que a planilha gera),
   `07-0-a-conversa-entra.md` (como ler conversa colada, e o que fazer com ela
   depois), `07-1-a-mensagem-sai.md` (o pedido de silêncio, e a lista da
   ponte), `08-0-quando-perguntar.md` (a ordem de busca e o teto de três
   perguntas), `09-0-os-tetos.md` (os tetos e o que fazer quando estouram),
   `10-0-comeca-e-termina.md` (como uma skill começa e termina) e
   `11-0-onde-roda.md` (onde ela roda, e por que não funciona sem carteira).
   Nada do que está lá se reescreve aqui: divergiu, o contrato vence.

2. **o `INDICE.md` da carteira**, pela primeira leitura da seção 1 do contrato:
   procura no computador e, não achando, a pasta `carteira` no Drive. A linha
   `carteira:` dele diz o transporte — `local` ou `drive` —, e **toda leitura e
   toda gravação desta execução vão por ele**. Dali saem também o `modo:`, o
   nome do prospector, o `## Como eu trabalho` e o `## Pulado no começo`.

**A carteira não existe** — não há `INDICE.md` em transporte nenhum? Uma linha,
e só:

> Não achei a sua carteira, nem no computador nem no seu Drive. Rode
> `/prospeccao:comecar`: ele monta em alguns minutos e termina com uma conta e um
> contato de verdade dentro dela.

Não crie a carteira, não trabalhe sem ela, não improvise em outra pasta. Esta
skill organiza o que existe; ela não é o começo de nada.

**Recebeu um id como argumento?** Ele chega sozinho, como o prospector digitou, e
a primeira coisa é achar o apelido no `_indice.md` do tema: daí em diante é
P-017 (Carla Menezes) em toda linha que sair daqui. Trabalhe só esse item e o
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
automático    aposenta quem está parado há mais de 90 dias, poda o histórico
              velho, e declara cada uma em ## Decidi sozinho, com como desfazer
```

Três coisas que o automático **não** faz, e esta é a parte que separa a skill de
uma trituradora:

- **Não aposenta por outro motivo que não o prazo de 90 dias.** Conta que disse não,
  que fechou com outro fornecedor, ou que saiu do perfil, contato que desistiu: é
  decisão do prospector mesmo no automático (contrato, regra 3). Vai para
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
~/carteira/contas/*.md
~/carteira/contatos/*.md
~/carteira/_bruto/*
~/carteira/arquivo-morto/contas/*.md
~/carteira/arquivo-morto/contatos/*.md
```

Leia `INDICE.md`, `funil.md`, `hoje.md` e os dois `_indice.md` — cada um **preso
à pasta dele**: no `drive`, o nome `_indice.md` solto devolve o de `contas/` e
o de `contatos/` juntos, e gravar um por cima do outro perde uma lista. Depois
leia os arquivos de conta e de contato — **os tetos existem para que esta
leitura seja barata**: vinte contatos de sessenta linhas cabem numa passada. Se a carteira
estourou tanto que não cabe, é exatamente o problema que ela veio resolver:
comece pelos maiores, faça o passo 5 neles primeiro, e diga no relatório que o
resto ficou para a próxima execução.

### Passo 2 · O que ainda não virou fato

Não existe campo que marque um arquivo de `_bruto/` como já lido, e não se
inventa um — o contrato fecha os campos, e `_bruto/` não se edita. **A marca é a
procedência:** um bruto já virou fato quando o nome dele aparece como origem em
algum arquivo dono.

```
procure   o nome do bruto: 2026-08-12-linkedin-carla.md
          em: ~/carteira/contas/  ~/carteira/contatos/  ~/carteira/arquivo-morto/
          zero ocorrências → ainda não virou fato
```

No `local` é busca de conteúdo, com `Grep`. No `drive` não há busca dentro do
texto: a procura é nos arquivos donos que o passo 1 já leu.

O `arquivo-morto/` entra na busca: bruto de quem foi aposentado já foi lido, e
relê-lo ressuscitaria a ficha.

**Um `.csv` em `_bruto/` é bruto como os outros**, e a marca é a mesma: o nome
dele como procedência em alguma ficha. Zero ocorrências → é a planilha de
contas dele, e o passo 3 importa. O nome é o que ele deu ao pôr o arquivo
lá — `_bruto/` não se renomeia, e a procedência cita o nome como está. Veio
`.xlsx`? Ela não lê: peça o CSV, **uma vez**, e diga onde ele sai — no Excel,
Arquivo → Salvar como → em “Tipo”, “CSV UTF-8”; no Google Sheets, Arquivo →
Fazer download → “Valores separados por vírgula (.csv)”. Não há biblioteca nem
conversor aqui, e não se instala nenhum. Ele pode pôr o `.csv` em `_bruto/` ou
colar as linhas na conversa: colado vale como CSV, e a skill grava em
`_bruto/AAAA-MM-DD-planilha-<nome-curto>.csv`, inteiro e **sem o cabeçalho de
três linhas** da seção 4.7 — um `.csv` com três linhas de texto em cima deixa
de ser um `.csv`. O `.xlsx` fica onde está, e o relatório diz que não foi lido.

Trate **do mais antigo para o mais novo** — a data está no nome do arquivo. **Até
dez por execução.** Sobraram? Diga quantos são e que a próxima execução pega:
uma execução que lê quarenta arquivos e escreve trinta é onde o prospector perde o
fio do que aconteceu. A planilha conta como um dos dez, e tem teto próprio —
200 linhas, no passo 3.

### Passo 3 · Extrair o fato

Contrato, seção 7, e nada além dela. Para cada bruto não lido:

- **De quem é.** O cabeçalho tem `sobre:` — case com o `_indice.md` do tema.
  Sem `sobre:`, ache pelo nome ou pelo telefone no corpo. Não achou de jeito
  nenhum: fica sem tratar, e vira linha no relatório com o nome do arquivo.
- **Contato que ainda não tem ficha**, e a conversa traz nome, canal e ao menos
  um fato: crie o arquivo pelo gabarito da seção 4.5. O id é o maior do
  `_indice.md` mais um, **contando o `## Arquivo morto`** — id não se
  reaproveita. Todo o resto entra `?`.
- **Conta que não está na carteira: não crie.** Sem link e sem ficha a conta
  não entra (contrato, seção 7) — dado que se adivinhou vira preço errado no
  WhatsApp do contato. Vira pergunta, se couber no teto de três, ou linha em
  `## Falta saber`.
- **Documento — CNPJ, contrato social, edital: ela não extrai fato dali.**
  Registra que o documento está em `_bruto/` e manda para
  `/prospeccao:estudar-conta`, que é quem lê e é a única que nunca opera em
  automático.
- **Buraco é buraco.** `<Mídia oculta>`, mensagem apagada, áudio, figurinha: vira
  linha declarada em `## Combinado` ou pergunta ao prospector, nunca palpite.
- **Pedido de silêncio se lê e se grava, sempre.** “não me manda mais
  mensagem”, “para de me mandar isso”, “me tira daí”: grave
  `não contatar: sim  ← _bruto/<arquivo>, <data>` no arquivo do contato,
  escreva a linha dele em `nao-contatar.txt` no diretório da ponte se houver
  conector, e diga no relatório. **Não pergunte se ele quer insistir** — quem
  pediu silêncio saiu do alcance das dez, e a `/prospeccao:retomar-contato` para
  de elegê-lo na próxima execução. É o único fato desta lista que muda o
  comportamento de outra skill, e por isso ele nunca fica para depois.
- **Cada campo com `← _bruto/<arquivo>`**, e a data é a do material, não a de
  hoje. Fato é o que está escrito: “dá sábado, mas cedo” é `## Combinado`, não
  “reunião marcada para terça”.

**A planilha é o bruto que gera mais de uma ficha**, e o desenho é o de
`/prospeccao:comecar`: uma ficha por linha, e nada gravado antes de ele confirmar
o mapeamento. A linha da planilha vale como ficha — é o prospector dizendo o que
ele tem, e a conta entra por ela —, e a procedência de tudo o que sai dela é
`← _bruto/<o csv>`: não existe origem chamada “planilha”, e a regra 2 já prevê
o arquivo em `_bruto/`.

1. **Mapeie as colunas** para os campos do gabarito da conta (contrato, seção
   4.4): site, estado, setor, cidade, funcionários, faturamento,
   cnpj, sistema que usam, quem decide, de onde veio. Cabeçalho óbvio se mapeia
   sozinho — empresa, razão social, cnpj, cidade, setor, site, url.
   Ambiguidade vira **uma pergunta**, com a UI de botões, mostrando o
   mapeamento inteiro para ele confirmar antes de gravar qualquer ficha.
   Coluna sem campo no gabarito **não cria campo** (regra zero do contrato):
   descrição vai para `## O que a conta faz`; o resto fica de fora, e o relatório
   diz quais colunas ficaram. `estado:` só recebe um dos seis valores da seção
   4.4: “ativa” vira `a estudar`, e o que já foi abordado
   vira `abordado`, e o
   que não casar entra `?`.
2. **Linha que já está na carteira atualiza, não duplica.** O `link:` ou o
   `endereço:` da linha bate com o de uma ficha viva? A ficha é essa, campo a
   campo: o que estava `?` ganha o valor com `← _bruto/<o csv>`; valor
   diferente do que a ficha tinha, o novo vale e o antigo desce para
   `## Histórico`, com a data e a procedência que tinha — nada se perde, e o
   relatório diz o que mudou. Bate com ficha do `arquivo-morto/`: não
   ressuscita e não cria segunda; vira linha em `## Não bate`, e quem decide é
   ele.
3. **Linha nova vira ficha**, pelo formato da seção 4.4, cada campo com
   `← _bruto/<o csv>`. O id é o maior do `_indice.md` mais um, contando o
   `## Arquivo morto`; e o prefixo é `E-`, e não há um segundo — a
   planilha não precisa dizer nada. O apelido é `<empresa>, <cidade>`; sem
   cidade na linha, use só o nome da empresa e diga isso. O que a linha não tem
   entra `?`. Linha vazia não vira ficha, e linha repetida dentro da própria
   planilha — mesmo link ou mesmo endereço — não vira duas.
4. **Depois das fichas:** uma linha por conta em `contas/_indice.md`, o
   `## Quanto tem` do `INDICE.md` recontado, e em cada ficha nova uma linha no
   `## Histórico`: `- AAAA-MM-DD entrou na carteira  ← _bruto/AAAA-MM-DD-planilha-<nome>.csv`.

**Teto: 200 linhas por execução.** Passou, pergunte se importa tudo ou só as
linhas marcadas como disponíveis. Na tela vai **a primeira ficha inteira** e a
contagem do resto — nunca as duzentas. E as perguntas daqui — o mapeamento, e
o setor se faltar — contam no teto de três da seção 5.

### Passo 4 · Aposentar (a regra 3)

Duas listas, e elas não se misturam:

| motivo | quem decide |
|---|---|
| contato sem contato há mais de 90 dias | **a skill** — nos dois modos |
| conta que disse não, ou que fechou com outro | o prospector, mesmo no automático |
| conta `fora do perfil` | o prospector, mesmo no automático |
| contato que pediu silêncio | **a skill** — nos dois modos, e junto com o nao-perturbe.md |

Os 90 dias contam da data mais nova entre o `## Histórico`, o `## Combinado` e
o `último contato` do `_indice.md`. **Nenhuma data em lugar nenhum: não aposenta
por dedução** — vira uma linha no relatório dizendo que o contato está sem data
de contato desde que entrou.

Aposentar é os quatro passos do contrato, nesta ordem: a linha
`aposentado: <data> · motivo: <desfecho>` logo abaixo do título; o arquivo para
`arquivo-morto/contas/` ou `arquivo-morto/contatos/`; a linha sai da tabela do
`_indice.md` e entra em `## Arquivo morto` com o desfecho; e some do `funil.md`
e do `hoje.md`.

**Do `hoje.md` ela tira só as linhas de quem aposentou.** O resto não se toca:
quem reescreve aquele arquivo é `/prospeccao:o-que-fazer-hoje`.

**Mover é duas operações, e a segunda não é dela.** A primeira é criar o arquivo
em `arquivo-morto/`. Tirar o original do lugar não está na tabela de
equivalência do contrato: no `local` é operação de sistema de arquivos — `mv` no
Mac e no Linux, `Move-Item` no Windows, sempre com caminho absoluto —, e ela
pede permissão na primeira vez; no `drive` é o que o conector tiver para tirar o
arquivo da pasta. **Confira que a execução tem como tirar o original do lugar
ANTES de mover o primeiro arquivo.** Não tem? Nada é movido nesta execução: a
lista do que deveria sair vai para o relatório com o motivo em uma linha, e a
carteira fica exatamente como estava. Carteira com o mesmo contato em duas
pastas é pior que carteira por organizar.

### Passo 5 · Os tetos

```
INDICE.md              120 linhas
arquivo de contato      60 linhas
arquivo de conta       40 linhas
_indice.md              uma linha por item, e nada mais
hoje.md                 15 caixas
```

Estourou um arquivo de contato ou de conta, quem condensa é o `## Histórico`:
linhas de mais de 90 dias viram uma por mês — `- 2026-05 duas abordagens, nenhuma
resposta`. Se ainda estourar, o excesso vai para um arquivo novo em `_bruto/` e
o histórico fica com a linha que aponta para ele:

```
~/carteira/_bruto/2026-08-19-historico-rui.md

origem: histórico condensado de P-019 (Rui Baptista)
recebido: 2026-08-19
sobre: P-019 (Rui Baptista)

---

<as linhas, exatamente como estavam no arquivo>
```

E no arquivo do contato: `- histórico até 2026-05-19 em _bruto/2026-08-19-historico-rita.md`.

Assim a poda **não perde uma palavra** — o que sai do arquivo entra inteiro em
outro, e o contrato manda gravar o excesso em `_bruto/` justamente por isso.

**Fato corrente nunca é cortado para caber.** Se o que estoura o teto é fato de
hoje, o arquivo passa do teto e a linha vai para o relatório — teto que come o
que importa é pior que teto estourado.

`INDICE.md` estourado: o que se corta é cópia dos `_indice.md`, e nada mais.
`hoje.md` com mais de 15 caixas não é assunto desta skill: é de
`/prospeccao:o-que-fazer-hoje`, e vira uma linha no relatório.

`_indice.md` com duas linhas para o mesmo id: **pare**. Mostre as duas e pergunte
qual fica — id duplicado é a única coisa que quebra a carteira inteira, porque
dois arquivos passam a disputar o mesmo nome.

### Passo 6 · O que só se vê de cima

| o que ela acha | o que ela faz |
|---|---|
| contato no `funil.md` sem arquivo em `contatos/` | pergunta: criar a ficha com `?` ou tirar a linha. No automático, cria |
| arquivo de contato com `etapa:` e sem linha no `funil.md` | reescreve o funil — a vista é derivada, o arquivo é dono |
| `etapa:` do arquivo diferente da do `funil.md` | o arquivo vence, o funil se reescreve |
| conta que um contato cita e não existe em `contas/` | não cria a conta. Pede o link, uma vez |
| item no `_indice.md` sem arquivo, ou arquivo sem linha | reescreve o `_indice.md` a partir dos arquivos |
| aposentado ainda na tabela viva, no funil ou no `hoje.md` | tira das três — ele já tem a linha em `## Arquivo morto` |
| campo `?` que uma conversa em `_bruto/` já respondeu | grava o valor com `← _bruto/<arquivo>` e diz no relatório |
| campo preenchido **sem** procedência | não inventa origem. Vai para `## Não bate`, e para `## Falta saber` se for campo que sai na mensagem (funcionários, faturamento, cargo) |
| `estado:` ou `etapa:` fora das listas fechadas | não corrige por conta própria: pergunta qual dos valores válidos é |
| dois contatos que parecem a mesma pessoa | mostra os dois e para. **Ela não funde ficha** |
| contagem do `## Quanto tem` diferente da real | reconta e grava |
| id duplicado | passo 5: pare e pergunte |

Divergiu um fato apurado de outro fato apurado — o contato diz que visitou em
15/08 e a conta diz 16/08? **Ela mantém os dois e relata os dois com a
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
2  aposentadoria que trava outra coisa   a conta que morreu e segue na vista
3  conta que se cita e não existe       pede o link, uma vez
```

O que não couber nas três **não some**: vira linha em `## Espera você` ou em
`## Falta saber`, e a próxima execução ataca. Skill que abre com formulário de
oito campos é abandonada na primeira execução.

Toda pergunta traz o motivo na mesma frase. E escolha entre dois e quatro
caminhos usa a **UI de perguntas do harness** — botões, não prosa —, com o custo
escrito em cada opção e rótulo de até quatro palavras:

```
O arquivo do P-019 (Rui Baptista) está com 74 linhas, e o teto é 60.

  Condensar o histórico   11 linhas viram 3, uma por mês · o texto inteiro
                          fica em _bruto/ e o arquivo aponta para lá
  Deixar como está        nada se perde de vista · toda skill relê 74 linhas
                          para achar um e-mail, em toda execução
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

Li 5 arquivos de _bruto/ — um deles a sua planilha, 20 linhas —, movi 1 contato
para arquivo-morto/, podei 1 histórico e achei 3 coisas que não batem.

## Li o que estava em _bruto/
- 2026-08-12-linkedin-carla.md → P-017 (Carla Menezes): cargo, a dor do
  fechamento e de onde ela veio
- 2026-08-17-email-bertoldo.md → P-031 (Sandra Lisboa): leva a proposta ao
  jurídico do E-083 (Móveis Bertoldo, Bento Gonçalves) até sexta
- 2026-08-18-site-vetorbank.md → nada extraído. É a página inteira do site, e
  quem lê é /prospeccao:estudar-conta
- 2026-08-14-email-desconhecido.md → nada extraído. Fala de uma transportadora
  em Canoas que não está na carteira, e sem o site eu não crio conta
- 2026-08-19-planilha-contas.csv → 18 fichas novas, de E-072 (Ferragens Kunz,
  Novo Hamburgo) a E-089 (Ótica Belmiro, Pelotas), e 2 atualizadas: E-071
  (VetorBank, Porto Alegre) trocou o número de funcionários e o antigo desceu
  para o histórico, E-083 (Móveis Bertoldo, Bento Gonçalves) ganhou o CNPJ.
  Ficaram de fora as colunas “vendedor” e “data do último contato”

## Movi para arquivo-morto/
- P-041 (Otávio Prado) · sem responder desde 2026-05-02, 109 dias · de
  contatos/ para arquivo-morto/contatos/P-041-otavio-prado.md
  Nada foi apagado: o arquivo está inteiro lá, e volta na hora que você pedir.

## Podei
- P-019 (Rui Baptista) estava com 74 linhas, teto 60. O histórico anterior a
  2026-05-19 virou 3 linhas, uma por mês. As 11 originais estão em
  ~/carteira/_bruto/2026-08-19-historico-rui.md, e o arquivo aponta para lá.
  O ## O que já mandei ficou inteiro: ele é o que impede a próxima abordagem
  de repetir o gancho.

## Não bate
- P-024 (Paulo Tavares) está no funil.md em “a estudar” e não tem arquivo em
  contatos/. Criei a ficha com o id, o apelido e o resto ?
- E-083 (Móveis Bertoldo, Bento Gonçalves) aparece com 180 funcionários no
  arquivo da P-031 (Sandra Lisboa), e o arquivo dele diz 240 ← LinkedIn,
  2026-08-17. Mantive os dois: quem sabe qual vale é você
- E-052 (Clínica Sanare, Curitiba) tem “faturamento: 40 mi” sem procedência.
  Não inventei de onde veio

## Espera você
- E-039 (Log Sul, Canoas) está com estado: disse não desde 2026-08-18 e
  continua na tabela viva. Aposentar conta que disse não é decisão sua, e eu
  não faço isso sozinha nem no automático. Me diga e eu movo, com a data e o
  motivo.

## Guardei
- ~/carteira/contatos/P-017-carla-menezes.md — 3 campos novos
- ~/carteira/contatos/P-024-paulo-tavares.md — criado, quase tudo ?
- ~/carteira/contatos/P-019-rui-baptista.md — histórico condensado
- ~/carteira/contas/ — 18 fichas criadas, E-072 a E-089
- ~/carteira/contas/E-071-vetorbank.md · E-083-moveis-bertoldo.md — 1 campo cada
- ~/carteira/contas/_indice.md — reescrito, 15 → 33 vivas
- ~/carteira/_bruto/2026-08-19-historico-rui.md — criado, com o que saiu de lá
- ~/carteira/arquivo-morto/contatos/P-041-otavio-prado.md — movido de contatos/
- ~/carteira/contatos/_indice.md — reescrito, 21 → 21 ativos, 1 aposentado novo
- ~/carteira/funil.md — reescrito
- ~/carteira/INDICE.md — contagens

## Falta saber
- o retorno do jurídico do E-083 (Móveis Bertoldo, Bento Gonçalves) — a P-031
  (Sandra Lisboa) leva até sexta
- o setor não está na planilha — ficou ? em 18 fichas
- de onde veio o faturamento do E-052 (Clínica Sanare, Curitiba)
- o site da transportadora de Canoas que aparece no e-mail de 14 de agosto

## Decidi sozinho
- Aposentei o P-041 (Otávio Prado): 109 dias sem responder, e o teto é 90. Para
  trazer de volta, me diga — o arquivo está em arquivo-morto/contatos/.
- Criei a ficha do P-024 (Paulo Tavares) em vez de tirar a linha do funil.
  Criar deixa rastro, tirar não. Se ele não é contato, me diga e eu aposento.
```

Os caminhos do `## Guardei` são os do transporte: no `local`, `~/carteira/…`,
como acima; no `drive`, a pasta e o arquivo dentro dela —
`contatos/P-017-carla-menezes.md, na pasta carteira do seu Drive`. A regra não
muda: **escreveu, diz onde.**

Ao falar com o prospector, data em prosa — “14 de agosto”. **Nos arquivos, sempre
`2026-08-14`.** Todo id aparece com o apelido junto, inclusive dentro de tabela e
de histórico.

---

## 7 · O que ela grava, onde, e com que procedência

| o que | onde | procedência |
|---|---|---|
| fato de contato vindo de conversa colada | `contatos/<id>-<apelido>.md` | `← _bruto/<arquivo>` |
| fato de conta que veio de ficha em `_bruto/` | `contas/<id>-<apelido>.md` | `← _bruto/<arquivo>` |
| o que o prospector respondeu agora | o arquivo dono | `← prospector, <hoje>` |
| a linha do aposentado | abaixo do título, no próprio arquivo | `aposentado: <data> · motivo: <desfecho>` |
| histórico condensado | `## Histórico` + arquivo novo em `_bruto/` | a linha aponta o arquivo |
| `funil.md`, os `_indice.md`, `## Quanto tem` | as vistas | **nenhuma** — vista derivada não leva seta |

O formato da procedência é o do contrato e não varia: valor, dois espaços, seta,
origem, vírgula, data — `preço: R$ 520.000  ← link, 2026-08-12`. As origens são
seis e não há outras: `link`, `ficha colada`, `_bruto/<arquivo>`, `prospector`,
`site`, `LinkedIn`. **Se o que ela apurou não cabe em nenhuma delas, o dado
não entra:** vira linha em `## Não bate`.

O que não se apurou entra `?`, e o `?` pode carregar na seta o que resolve ele —
`e-mail: ?  ← procurar no site da conta`. Campo inventado com cara de apurado é pior
que campo vazio: o prospector repassa e descobre na reunião.

Ordem de gravação, e ela importa: **primeiro os arquivos donos, depois as
vistas**. Vista escrita antes do dono é vista que descreve um estado que não
existe mais.

---

## 8 · Onde ela para

**Ela não apaga nada. Nunca.** Nem arquivo, nem linha de `_bruto/`, nem histórico
sem cópia. O que sai de vista continua na carteira, e o relatório diz onde —
gaveta, não lixeira. Se algo precisa sumir de verdade, quem apaga é o prospector,
no computador ou no Drive dele.

**Ela não move sem ter como mover.** Aposentar é copiar para `arquivo-morto/` e
tirar da origem, e tirar da origem exige uma ferramenta que ela não concede
sozinha — o terminal no `local`, o que o conector tiver no `drive`. Sem ela, a
skill **não move nada** e escreve por quê: meia mudança — o arquivo em duas
pastas — é pior que a carteira do jeito que estava.

**Ela não abre link.** As ferramentas dela leem a carteira, não a internet, e é
de propósito: varrer uma carteira abrindo trinta páginas é uma execução de meia
hora que termina com o prospector sem saber o que mudou. O `?` que um link
resolveria sai em `## Falta saber` com o nome de quem abre: `/prospeccao:escrever-abordagem`
— e é lá que está escrito o que fazer quando o site só monta a página por
JavaScript e devolve nada.

**Ela não lê documento.** CNPJ, contrato social, edital, PDF de apresentação, foto
de crachá: ela registra que está em `_bruto/` e manda para
`/prospeccao:estudar-conta`. Número de CNPJ lido de foto vira número
errado no texto de abordagem, e concluir se um documento está em ordem não é dela nem de
skill nenhuma — é de quem vende, e é na reunião.

**Ela não transcreve áudio de ouvido.** Áudio no meio de uma conversa vira
pergunta: “Tem um áudio de 12 de agosto no meio dessa conversa. O que ela disse
ali?”. `<Mídia oculta>` e mensagem apagada viram buraco declarado.

**Ela não funde duas fichas.** Dois contatos que parecem a mesma pessoa: mostra
os dois e para. Fundir aposenta um id sem desfecho, e id não se reaproveita —
quando a fusão acontecer, é com o prospector olhando.

**Ela não escolhe verdade.** Dois fatos apurados que se contradizem ficam os
dois, cada um com a sua procedência. Nem o automático decide isso.

**Ela não escreve mensagem.** Nenhuma, para ninguém. A mensagem de quem sumiu é
de `/prospeccao:retomar-contato`; a lista do dia é de `/prospeccao:o-que-fazer-hoje`;
o texto de abordagem é de `/prospeccao:escrever-abordagem`. Esta aqui arruma a carteira de onde
as três tiram o que dizem.

**Ela não reescreve arquivo que já existe.** `Write` só em arquivo novo. Arquivo
fora do gabarito se corrige com `Edit`, linha a linha, e o que não der para
corrigir assim vira linha em `## Não bate` — reescrever inteiro é como se apaga
o trabalho de outra skill sem apagar nenhum arquivo. No `drive` não existe trocar
um trecho: atualizar devolve o arquivo inteiro, então **ela lê antes de
atualizar, sempre**, e o que ela devolve é o texto que estava lá com a mudança
dentro.

**Ela não sai da carteira.** Não roda git, não sincroniza, não faz backup,
não toca em pasta nenhuma fora dali, e não sabe o que a empresa tem no CRM.

**Ela para no décimo bruto** e diz quantos ficaram. E se a carteira estiver tão
estourada que a leitura não cabe, ela trata os maiores, diz o que sobrou, e não
finge que varreu tudo.

E quando algo não der certo, uma linha: o que não deu e qual é o caminho. Sem
pedir desculpa duas vezes, e sem sumir do assunto.
