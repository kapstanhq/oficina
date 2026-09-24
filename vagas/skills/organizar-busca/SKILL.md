---
name: organizar-busca
description: >-
  Faz a manutenção da busca: lê o que está em `_bruto/` e ainda não virou
  fato — conversa colada, ficha, e-mail —, extrai os campos com procedência e
  grava nos arquivos donos, e importa a planilha posta em _bruto/ com a
  busca já montada (sem busca, a planilha é do /vagas:comecar).
  Aposenta quem parou há mais de 45 dias, aplica os tetos e mostra o que
  sairia antes de podar. Acha o que só se vê de cima: vaga no funil sem
  arquivo, vaga que se cita e não existe, campo ? que uma conversa já
  respondeu. Relata cada arquivo que tocou: nada some em silêncio. Use quando
  o candidato disser — organiza minha busca, dá um jeito nessa bagunça,
  colei um monte de conversa e não sei se entrou, coloquei a planilha na
  pasta, arquiva o que fechou, tira o que eu já desisti, tem contato em dobro aí,
  o arquivo do contato está gigante, faz uma faxina. Não escreve a mensagem
  de quem sumiu (/vagas:retomar-contato), não monta a lista do dia
  (/vagas:o-que-fazer-hoje) nem prepara candidatura
  (/vagas:candidatar).
license: MIT
compatibility: >-
  Precisa da busca, numa pasta do computador: ela é a manutenção da
  busca e não funciona sem uma — diz isso em uma linha e manda rodar
  /vagas:comecar. Para aposentar, precisa de uma ferramenta que tire o
  arquivo do lugar; sem ela nada é movido, e a lista do que sairia vai para o
  relatório.
allowed-tools: Read Glob Grep Write Edit
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/organizar-{pasta-base}/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# Organizar a busca

## 1 · O que ela faz, e o que ela não faz

Ela é a manutenção do pack: lê o que chegou e ainda não virou fato, aposenta o
que morreu, poda o que passou do teto, reescreve as vistas derivadas e aponta o
que só aparece olhando a busca inteira de cima — e **relata cada arquivo que
tocou, com o caminho**, porque o candidato nunca pode abrir a busca e não
achar o que tinha.

**O argumento é opcional:** sem nada, ela varre a busca inteira; com o id de
um contato ou de uma vaga, ela trabalha só esse item.

**Quem só OLHA é outra skill.** `/vagas:laudo-da-busca` lê a busca e
não escreve uma linha: ela diz o que está sem procedência, o que venceu, o que
ficou órfão e o que passou do teto. Esta aqui é a que conserta. A separação é
de propósito — a régua precisa ser barata o bastante para rodar antes e depois
de qualquer coisa, e o que escreve nunca é barato. Na dúvida sobre o estado da
busca, roda-se o laudo primeiro; ele diz se vale chamar esta.

Ela não apaga nada, não abre link, não escreve mensagem para contato nenhum,
não prepara candidatura, não decide pretensão e não escolhe entre dois fatos que se
contradizem — o que ela não apurou sai como `?` e vira linha em `## Falta
saber`.

**Por que ela tem `Write` e `Edit`.** Ela grava em quatro lugares: ficha nova
— contato que veio de uma conversa colada e ainda não tinha ficha, vaga que veio
de uma linha da planilha (`Write`); fato extraído para arquivo que já existe
(`Edit`); vistas derivadas — `funil.md`, os dois `_indice.md`, as contagens do
`INDICE.md` (`Edit`); e arquivo novo em `_bruto/` — o histórico condensado, ou
a planilha que ele colou na conversa (`Write`). **`Write` só em
arquivo que não existe.** Sobrescrever um arquivo da busca apaga o que outra
skill gravou ali, e esta é a skill que mais mexe em arquivo dos outros. No
`drive` os verbos são outros — criar arquivo e atualizar arquivo —, e a regra é
a mesma: cria só o que não existe. Atualizar no `drive` reescreve o arquivo
inteiro, então **leia antes de atualizar, sempre**. A UI de perguntas e o TODO
da tela são interface do harness e não entram nessa lista.

---

## 2 · Antes de tudo

Leia, nesta ordem:

1. **O contrato, por seção.** Ele é a lei do pack, e ler o documento inteiro
   custa vinte a trinta mil tokens antes da primeira leitura da busca.
   Leia, em `references/contrato/`, estas seções antes de escrever uma linha:
   `01-0-onde-a-busca-mora.md` (os dois transportes, e quem é dono de qual
   fato — a vista nunca vence o arquivo), `02-0-id-e-apelido.md` (o id, e por
   que o nome do arquivo não muda), `03-0-as-tres-regras.md` (as três regras,
   e os quatro passos de aposentar), `04-0-os-formatos.md` e os sete que o
   seguem, de `04-1-indice.md` a `04-7-o-bruto.md` (os formatos literais —
   `04-4-arquivo-de-vaga.md` é o gabarito da ficha que a planilha gera),
   `07-0-a-conversa-entra.md` (como ler conversa colada, e o que fazer com ela
   depois), `07-1-a-mensagem-sai.md` (o pedido de silêncio, e a lista da
   ponte), `08-0-quando-perguntar.md` (a ordem de busca e o teto de três
   perguntas), `09-0-os-tetos.md` (os tetos e o que fazer quando estouram),
   `10-0-comeca-e-termina.md` (como uma skill começa e termina) e
   `11-0-onde-roda.md` (onde ela roda, e por que não funciona sem busca).
   Nada do que está lá se reescreve aqui: divergiu, o contrato vence.

2. **o `INDICE.md` da busca**, pela primeira leitura da seção 1 do contrato:
   procura no computador e, não achando, a pasta `busca` no Drive. A linha
   `busca:` dele diz o transporte — `local` ou `drive` —, e **toda leitura e
   toda gravação desta execução vão por ele**. Dali saem também o `modo:`, o
   nome do candidato, o `## Como eu trabalho` e o `## Pulado no começo`.

**A busca não existe** — não há `INDICE.md` em transporte nenhum? Uma linha,
e só:

> Não achei a sua busca, nem no computador nem no seu Drive. Rode
> `/vagas:comecar`: ele monta em alguns minutos e termina com uma vaga e um
> contato de verdade dentro dela.

Não crie a busca, não trabalhe sem ela, não improvise em outra pasta. Esta
skill organiza o que existe; ela não é o começo de nada.

**Recebeu um id como argumento?** Ele chega sozinho, como o candidato digitou, e
a primeira coisa é achar o apelido no `_indice.md` do tema: daí em diante é
P-005 (Helena Prates) em toda linha que sair daqui. Trabalhe só esse item e o
que estiver em `_bruto/` sobre ele, e diga no relatório que a varredura foi
parcial. Sem argumento, a busca inteira.

---

## 3 · O modo

Leia a linha `modo:` do `INDICE.md`. Vale `automatico` e `automático`; qualquer
outro valor, linha ausente ou arquivo ilegível, o modo é **copiloto**. Nunca se
deduz automático por pressa nem porque a escolha parece óbvia.

```
copiloto      extrai, reescreve as vistas e recontar é dela — isso é o
              contrato, não é bifurcação. PARA antes de aposentar qualquer
              coisa e antes de podar qualquer histórico, e mostra o que sairia
automático    aposenta quem está parado há mais de 45 dias, poda o histórico
              velho, e declara cada uma em ## Decidi sozinho, com como desfazer
```

Três coisas que o automático **não** faz, e esta é a parte que separa a skill de
uma trituradora:

- **Não aposenta por outro motivo que não o prazo de 45 dias.** Vaga que fechou,
  que recusou a candidatura, ou que não vale: é
  decisão do candidato mesmo no automático (contrato, regra 3). Vai para
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
não só quando a busca é grande. Demorar sem mostrar é onde o leigo acha que
travou.

```
1  ler a busca e listar o que precisa de atenção
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
~/busca/vagas/*.md
~/busca/contatos/*.md
~/busca/_bruto/*
~/busca/arquivo-morto/vagas/*.md
~/busca/arquivo-morto/contatos/*.md
```

Leia `INDICE.md`, `funil.md`, `hoje.md` e os dois `_indice.md` — cada um **preso
à pasta dele**: no `drive`, o nome `_indice.md` solto devolve o de `vagas/` e
o de `contatos/` juntos, e gravar um por cima do outro perde uma lista. Depois
leia os arquivos de vaga e de contato — **os tetos existem para que esta
leitura seja barata**: vinte contatos de sessenta linhas cabem numa passada. Se a busca
estourou tanto que não cabe, é exatamente o problema que ela veio resolver:
comece pelos maiores, faça o passo 5 neles primeiro, e diga no relatório que o
resto ficou para a próxima execução.

### Passo 2 · O que ainda não virou fato

Não existe campo que marque um arquivo de `_bruto/` como já lido, e não se
inventa um — o contrato fecha os campos, e `_bruto/` não se edita. **A marca é a
procedência:** um bruto já virou fato quando o nome dele aparece como origem em
algum arquivo dono.

```
procure   o nome do bruto: 2026-09-11-whatsapp-helena.md
          em: ~/busca/vagas/  ~/busca/contatos/  ~/busca/arquivo-morto/
          zero ocorrências → ainda não virou fato
```

No `local` é busca de conteúdo, com `Grep`. No `drive` não há busca dentro do
texto: a procura é nos arquivos donos que o passo 1 já leu.

O `arquivo-morto/` entra na busca: bruto de quem foi aposentado já foi lido, e
relê-lo ressuscitaria a ficha.

**Um `.csv` em `_bruto/` é bruto como os outros**, e a marca é a mesma: o nome
dele como procedência em alguma ficha. Zero ocorrências → é a planilha de
vagas dele, e o passo 3 importa. O nome é o que ele deu ao pôr o arquivo
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
uma execução que lê quarenta arquivos e escreve trinta é onde o candidato perde o
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
- **A etapa é da vaga, e a conversa é com o contato.** O fato de quem
  falou vai para o arquivo de quem falou; o que a conversa mostra de andamento
  vai para o `etapa:` da vaga que nomeia essa pessoa em
  `contato`. O arquivo do contato **não tem `etapa:`**, nem o
  que nasce agora. Ninguém a nomeia, ou mais de um arquivo a nomeia e a
  conversa não diz de qual se fala: **não escolha** — vira linha em
  `## Falta saber`, e etapa nenhuma muda.
- **Vaga que não está na busca: não crie.** Sem link e sem ficha a vaga
  não entra (contrato, seção 7) — dado que se adivinhou vira faixa errada no
  WhatsApp do contato. Vira pergunta, se couber no teto de três, ou linha em
  `## Falta saber`.
- **Documento — formulário de candidatura, enunciado de estudo de caso, proposta por escrito: ela não extrai fato dali.**
  Registra que o documento está em `_bruto/` e manda para
  `/vagas:candidatar`, que é quem lê e é a única que nunca opera em
  automático.
- **Buraco é buraco.** `<Mídia oculta>`, mensagem apagada, figurinha: vira
  linha declarada em `## Combinado` ou pergunta ao candidato, nunca palpite.
  **Áudio pelo conector chega transcrito**, e é fato como outro qualquer — mas
  número, valor e nome próprio saídos dali só viram campo depois de confirmados
  (contrato, seção 7). Áudio colado continua buraco.
- **Pedido de silêncio se lê e se grava, sempre.** “não me manda mais
  mensagem”, “para de me mandar isso”, “me tira daí”: grave
  `não contatar: sim  ← _bruto/<arquivo>, <data>` no arquivo do contato,
  escreva a linha dele em `nao-contatar.txt` no diretório da ponte se houver
  conector, e diga no relatório. **Não pergunte se ele quer insistir** — quem
  pediu silêncio saiu do alcance das dez, e a `/vagas:retomar-contato` para
  de elegê-lo na próxima execução. É o único fato desta lista que muda o
  comportamento de outra skill, e por isso ele nunca fica para depois.
- **Cada campo com `← _bruto/<arquivo>`**, e a data é a do material, não a de
  hoje. Fato é o que está escrito: “dá sábado, mas cedo” é `## Combinado`, não
  “entrevista marcada para sábado”.

**A planilha é o bruto que gera mais de uma ficha**, e o desenho é o de
`/vagas:comecar`: uma ficha por linha, e nada gravado antes de ele confirmar
o mapeamento. A linha da planilha vale como ficha — é o candidato dizendo o que
ele tem, e a vaga entra por ela —, e a procedência de tudo o que sai dela é
`← _bruto/<o csv>`: não existe origem chamada “planilha”, e a regra 2 já prevê
o arquivo em `_bruto/`.

1. **Mapeie as colunas** para os campos do gabarito da vaga (contrato, seção
   4.4): link, estado, etapa, empresa, cargo, regime, contrato, jornada,
   faixa, idioma, publicada, contato, encaixe. Cabeçalho óbvio se mapeia
   sozinho — empresa, cargo, vaga, título, link, url, regime, local.
   Ambiguidade vira **uma pergunta**, com a UI de botões, mostrando o
   mapeamento inteiro para ele confirmar antes de gravar qualquer ficha.
   Coluna sem campo no gabarito **não cria campo** (regra zero do contrato):
   descrição vai para `## O que a vaga pede`; o resto fica de fora, e o relatório
   diz quais colunas ficaram. `etapa:` só recebe uma das etapas da seção
   4.3: “salva” vira `salva` e “a ver” vira `nova`; “aplicada” ou
   “enviada” vira `candidatada`, e “entrevista” vira `entrevista`, e o
   que não casar entra em `nova`, nunca `?`.
2. **Linha que já está na busca atualiza, não duplica.** O `link:` ou o
   `endereço:` da linha bate com o de uma ficha viva? A ficha é essa, campo a
   campo: o que estava `?` ganha o valor com `← _bruto/<o csv>`; valor
   diferente do que a ficha tinha, o novo vale e o antigo desce para
   `## Histórico`, com a data e a procedência que tinha — nada se perde, e o
   relatório diz o que mudou. Bate com ficha do `arquivo-morto/`: não
   ressuscita e não cria segunda; vira linha em `## Não bate`, e quem decide é
   ele.
3. **Linha nova vira ficha**, pelo formato da seção 4.4, cada campo com
   `← _bruto/<o csv>`. O id é o maior do `_indice.md` mais um, contando o
   `## Arquivo morto`; e o prefixo é `V-`, e não há um segundo — a
   planilha não precisa dizer nada. O apelido é `<cargo curto>, <empresa>`; sem
   empresa na linha, a ficha não nasce: vaga sem empresa não se acha de novo. O que a linha não tem
   entra `?`. Linha vazia não vira ficha, e linha repetida dentro da própria
   planilha — mesmo link ou mesmo endereço — não vira duas.
4. **Depois das fichas:** uma linha por vaga em `vagas/_indice.md`, o
   `## Quanto tem` do `INDICE.md` recontado, e em cada ficha nova uma linha no
   `## Histórico`: `- AAAA-MM-DD entrou na busca  ← _bruto/AAAA-MM-DD-planilha-<nome>.csv`.

**Teto: 200 linhas por execução.** Passou, pergunte se importa tudo ou só as
linhas de vaga ainda aberta. Na tela vai **a primeira ficha inteira** e a
contagem do resto — nunca as duzentas. E as perguntas daqui — o mapeamento, e
o regime se faltar — contam no teto de três da seção 5.

### Passo 4 · Aposentar (a regra 3)

Duas listas, e elas não se misturam:

| motivo | quem decide |
|---|---|
| vaga sem movimento há mais de 45 dias | **a skill** — nos dois modos |
| vaga que `fechou`, ou que recusou você | o candidato, mesmo no automático |
| vaga que você julgou `não vale`, ou de que desistiu | o candidato, mesmo no automático |
| vaga em que você disse `aceitei` — o fim bom, que põe a busca em pausa | o candidato, mesmo no automático |
| contato que pediu silêncio | **a skill** — nos dois modos, e com `não contatar: sim` gravado antes de mover |

Os 45 dias contam da data mais nova entre o `## Histórico` e o
`## Combinado` do arquivo da vaga — e, se `contato` nomeia alguém, o
`## Histórico` dessa pessoa entra na conta: resposta que chegou por ela é
movimento da vaga. **Nenhuma data em lugar nenhum: não aposenta por dedução**
— vira uma linha no relatório dizendo que a vaga está sem data de movimento
desde que entrou.

**Quem sai é a vaga, e só.** O contato que `contato` nomeia
continua onde está: pode responder por outra vaga, e gente só sai da busca por
pedido de silêncio ou por decisão do candidato. Vaga que nunca teve
contato se aposenta pela mesma régua — não ter com quem falar é o caso comum,
e não é motivo nem impedimento.

Aposentar é os quatro passos do contrato, nesta ordem: a linha
`aposentado: <data> · motivo: <desfecho>` logo abaixo do título; o arquivo para
`arquivo-morto/vagas/` ou `arquivo-morto/contatos/`; a linha sai da tabela do
`_indice.md` e entra em `## Arquivo morto` com o desfecho; e some do `funil.md`
e do `hoje.md`.

**Do `hoje.md` ela tira só as linhas de quem aposentou.** O resto não se toca:
quem reescreve aquele arquivo é `/vagas:o-que-fazer-hoje`.

**Mover é duas operações, e a segunda não é dela.** A primeira é criar o arquivo
em `arquivo-morto/`. Tirar o original do lugar não está na tabela de
equivalência do contrato: no `local` é operação de sistema de arquivos — `mv` no
Mac e no Linux, `Move-Item` no Windows, sempre com caminho absoluto —, e ela
pede permissão na primeira vez; no `drive` é o que o conector tiver para tirar o
arquivo da pasta. **Confira que a execução tem como tirar o original do lugar
ANTES de mover o primeiro arquivo.** Não tem? Nada é movido nesta execução: a
lista do que deveria sair vai para o relatório com o motivo em uma linha, e a
busca fica exatamente como estava. Busca com o mesma vaga em duas
pastas é pior que busca por organizar.

### Passo 5 · Os tetos

```
INDICE.md              120 linhas
arquivo de contato      50 linhas
arquivo de vaga       60 linhas
_indice.md              uma linha por item, e nada mais
hoje.md                 15 caixas
```

Estourou um arquivo de contato ou de vaga, quem condensa é o `## Histórico`:
linhas de mais de 90 dias viram uma por mês — `- 2026-06 candidatura e duas retomadas, nenhuma
resposta`. Se ainda estourar, o excesso vai para um arquivo novo em `_bruto/` e
o histórico fica com a linha que aponta para ele:

```
~/busca/_bruto/2026-09-14-historico-caio.md

origem: histórico condensado de P-001 (Caio Rezende)
recebido: 2026-09-14
sobre: P-001 (Caio Rezende)

---

<as linhas, exatamente como estavam no arquivo>
```

E no arquivo do contato: `- histórico até 2026-05-19 em _bruto/2026-09-14-historico-caio.md`.

Assim a poda **não perde uma palavra** — o que sai do arquivo entra inteiro em
outro, e o contrato manda gravar o excesso em `_bruto/` justamente por isso.

**Fato corrente nunca é cortado para caber.** Se o que estoura o teto é fato de
hoje, o arquivo passa do teto e a linha vai para o relatório — teto que come o
que importa é pior que teto estourado.

`INDICE.md` estourado: o que se corta é cópia dos `_indice.md`, e nada mais.
`hoje.md` com mais de 15 caixas não é assunto desta skill: é de
`/vagas:o-que-fazer-hoje`, e vira uma linha no relatório.

`_indice.md` com duas linhas para o mesmo id: **pare**. Mostre as duas e pergunte
qual fica — id duplicado é a única coisa que quebra a busca inteira, porque
dois arquivos passam a disputar o mesmo nome.

### Passo 6 · O que só se vê de cima

| o que ela acha | o que ela faz |
|---|---|
| vaga no `funil.md` sem arquivo em `vagas/` | pergunta: criar a ficha com `?` ou tirar a linha. No automático, cria |
| arquivo de vaga com `etapa:` e sem linha no `funil.md` | reescreve o funil — a vista é derivada, o arquivo é dono |
| `etapa:` do arquivo diferente da do `funil.md` | o arquivo vence, o funil se reescreve |
| vaga que um contato cita e não existe em `vagas/` | não cria a vaga. Pede o link, uma vez |
| `contato` da vaga nomeia quem não tem arquivo em `contatos/` | pergunta: criar a ficha com `?` ou limpar o campo. No automático, cria |
| arquivo do contato com `etapa:` | não apaga e não copia para lugar nenhum: a etapa é da vaga. Vai para `## Não bate`, com o nome do arquivo |
| vaga com `etapa:` e `contato` vazio | **não é defeito**, e não entra no relatório: vaga sem contato é o caso comum |
| aposentado com o motivo `aceitei`, e nada entrou na busca depois dele | **a busca está em pausa**: diz isso na primeira linha do relatório e não oferece mais vagas. O que ainda estava vivo continua onde está — aposentar cada um é decisão dele |
| item no `_indice.md` sem arquivo, ou arquivo sem linha | reescreve o `_indice.md` a partir dos arquivos |
| aposentado ainda na tabela viva, no funil ou no `hoje.md` | tira das três — ele já tem a linha em `## Arquivo morto` |
| campo `?` que uma conversa em `_bruto/` já respondeu | grava o valor com `← _bruto/<arquivo>` e diz no relatório |
| campo preenchido **sem** procedência | não inventa origem. Vai para `## Não bate`, e para `## Falta saber` se for campo que sai na mensagem (cargo, empresa, o nome do contato) |
| `estado:` ou `etapa:` fora das listas fechadas | não corrige por conta própria: pergunta qual dos valores válidos é |
| dois contatos que parecem a mesma pessoa | mostra os dois e para. **Ela não funde ficha** |
| contagem do `## Quanto tem` diferente da real | reconta e grava |
| id duplicado | passo 5: pare e pergunte |

Divergiu um fato apurado de outro fato apurado — o contato diz que a entrevista é em
15/09 e a vaga diz 16/09? **Ela mantém os dois e relata os dois com a
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
1  id duplicado no _indice.md            quebra a busca
2  aposentadoria que trava outra coisa   a vaga que morreu e segue na vista
3  vaga que se cita e não existe       pede o link, uma vez
```

O que não couber nas três **não some**: vira linha em `## Espera você` ou em
`## Falta saber`, e a próxima execução ataca. Skill que abre com formulário de
oito campos é abandonada na primeira execução.

Toda pergunta traz o motivo na mesma frase. E escolha entre dois e quatro
caminhos usa a **UI de perguntas do harness** — botões, não prosa —, com o custo
escrito em cada opção e rótulo de até quatro palavras:

```
A V-026 (PM de Crédito, Sarça Financeira) está com `estado: fechou` desde 12 de
setembro — a página saiu do ar — e continua no funil, em “candidatada”.

  Aposentar como fechou   sai do funil e do hoje.md · o arquivo vai inteiro
                          para arquivo-morto/, e volta se republicarem
  Deixar mais uma semana  nada muda · ela segue contando como candidatura
                          viva, e a retomada vai procurar com quem falar
  Ver o arquivo antes     eu mostro a ficha e você decide depois
```

**Quando não perguntar:** o fato está na busca (use e cite de onde veio); é
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
# Organizei a busca — 2026-09-14

Li 5 arquivos de _bruto/ — um deles a sua planilha, 14 linhas —, movi 1 vaga
para arquivo-morto/, podei 1 histórico e achei 3 coisas que não batem.

## Li o que estava em _bruto/
- 2026-09-09-email-bruno.md → P-003 (Bruno Sato): o papel, o processo e o
  prazo que ele deu. E a V-022 (Lead PM, Pátio Varejo), que é por quem ele
  fala, passou de “candidatada” para “em contato” — a etapa mudou no arquivo
  DELA, com a data do e-mail
- 2026-09-11-whatsapp-helena.md → V-019 (Gerente de Produto Sênior, Trilho
  Logística): segunda rodada dia 14, às 10h, em ## Combinado. A P-005 (Helena
  Prates) ganhou a linha no histórico dela, e só
- 2026-09-07-busca.md → nada extraído. É o que as fontes devolveram, e quem lê
  é /vagas:buscar-vagas
- 2026-09-12-email-desconhecido.md → nada extraído. Fala de uma vaga numa
  seguradora de Curitiba que não está na busca, e sem o link eu não crio vaga
- 2026-09-14-planilha-candidaturas.csv → 12 fichas novas, de V-032 (PM de
  Risco, Banco Mirante) a V-043 (Gerente de Produto, Dobra Mobilidade), e 2
  atualizadas: V-027 (Head de Produto, Aurora Saúde) trocou o link e o antigo
  desceu para o histórico, V-031 (PM Sênior, Cobre Energia) ganhou a data de
  publicação. Ficaram de fora as colunas “salário que pedi” e “observações”

## Movi para arquivo-morto/
- V-017 (PM de Pagamentos, Porto Claro) · sem movimento desde 2026-07-28, 48
  dias · motivo: sem resposta · de vagas/ para
  arquivo-morto/vagas/V-017-porto-claro.md
  Nada foi apagado: o arquivo está inteiro lá, e volta na hora que você pedir.
  Ela nunca teve contato, e isso não pesou: a régua é a mesma.

## Podei
- P-001 (Caio Rezende) estava com 58 linhas, teto 50. O histórico anterior a
  2026-06-16 virou 3 linhas, uma por mês. As 11 originais estão em
  ~/busca/_bruto/2026-09-14-historico-caio.md, e o arquivo aponta para lá.
  O ## O que já mandei ficou inteiro: ele é o que impede a próxima mensagem de
  repetir o pedido.

## Não bate
- V-029 (PM de Dados, Farol Educação) está no funil.md em “salva” e não tem
  arquivo em vagas/. Criei a ficha com o id, o apelido e o resto ?
- O arquivo da P-005 (Helena Prates) tem uma linha `etapa: entrevista`. Contato
  não tem etapa: quem anda é a vaga, e a V-019 (Gerente de Produto Sênior,
  Trilho Logística) já diz “entrevista” no arquivo dela. Não apaguei nem
  copiei — me diga e eu tiro a linha
- V-031 (PM Sênior, Cobre Energia) tem “faixa: R$ 16 mil” sem procedência.
  Não inventei de onde veio

## Espera você
- V-026 (PM de Crédito, Sarça Financeira) está com estado: fechou desde
  2026-09-12 e continua na tabela viva, em “candidatada”. Aposentar vaga que
  fechou é decisão sua, e eu não faço isso sozinha nem no automático. Me diga
  e eu movo, com a data e o motivo.

## Guardei
- ~/busca/contatos/P-003-bruno-sato.md — 3 campos novos
- ~/busca/vagas/V-022-patio-varejo.md — etapa: em contato · desde 2026-09-09,
  e uma linha no histórico
- ~/busca/vagas/V-019-trilho-logistica.md — uma linha em ## Combinado
- ~/busca/contatos/P-005-helena-prates.md — uma linha no histórico
- ~/busca/vagas/V-029-farol-educacao.md — criado, quase tudo ?
- ~/busca/contatos/P-001-caio-rezende.md — histórico condensado
- ~/busca/vagas/ — 12 fichas criadas, V-032 a V-043
- ~/busca/vagas/V-027-aurora-saude.md · V-031-cobre-energia.md — 1 campo cada
- ~/busca/vagas/_indice.md — reescrito, 19 → 31 vivas, 1 aposentada nova
- ~/busca/_bruto/2026-09-14-historico-caio.md — criado, com o que saiu de lá
- ~/busca/arquivo-morto/vagas/V-017-porto-claro.md — movido de vagas/
- ~/busca/contatos/_indice.md — reescrito, 5 contatos
- ~/busca/funil.md — reescrito
- ~/busca/INDICE.md — contagens

## Falta saber
- o estudo de caso da V-022 (Lead PM, Pátio Varejo) — o P-003 (Bruno Sato)
  ficou de mandar até 11 de setembro
- o regime não está na planilha — ficou ? em 12 fichas
- de onde veio a faixa da V-031 (PM Sênior, Cobre Energia)
- o link da vaga da seguradora de Curitiba que aparece no e-mail de 12 de
  setembro

## Decidi sozinho
- Aposentei a V-017 (PM de Pagamentos, Porto Claro): 48 dias sem movimento, e
  o teto é 45. Para trazer de volta, me diga — o arquivo está em
  arquivo-morto/vagas/.
- Criei a ficha da V-029 (PM de Dados, Farol Educação) em vez de tirar a linha
  do funil. Criar deixa rastro, tirar não. Se ela não é vaga sua, me diga e eu
  aposento.
```

Os caminhos do `## Guardei` são os do transporte: no `local`, `~/busca/…`,
como acima; no `drive`, a pasta e o arquivo dentro dela —
`contatos/P-005-helena-prates.md, na pasta busca do seu Drive`. A regra não
muda: **escreveu, diz onde.**

Ao falar com o candidato, data em prosa — “14 de agosto”. **Nos arquivos, sempre
`2026-08-14`.** Todo id aparece com o apelido junto, inclusive dentro de tabela e
de histórico.

---

## 7 · O que ela grava, onde, e com que procedência

| o que | onde | procedência |
|---|---|---|
| fato de contato vindo de conversa colada | `contatos/<id>-<apelido>.md` | `← _bruto/<arquivo>` |
| fato de vaga que veio de ficha em `_bruto/` | `vagas/<id>-<apelido>.md` | `← _bruto/<arquivo>` |
| o que o candidato respondeu agora | o arquivo dono | `← candidato, <hoje>` |
| a linha do aposentado | abaixo do título, no próprio arquivo | `aposentado: <data> · motivo: <desfecho>` |
| histórico condensado | `## Histórico` + arquivo novo em `_bruto/` | a linha aponta o arquivo |
| `funil.md`, os `_indice.md`, `## Quanto tem` | as vistas | **nenhuma** — vista derivada não leva seta |

O formato da procedência é o do contrato e não varia: valor, dois espaços, seta,
origem, vírgula, data — `regime: remoto no Brasil  ← link, 2026-09-07`. As origens são
seis e não há outras: `link`, `ficha colada`, `_bruto/<arquivo>`, `candidato`,
o nome do conector que devolveu a vaga (`gupy`, `greenhouse`) e o arquivo que sustenta um julgamento (`perfil.md`, `trajetoria.md`). **Se o que ela apurou não cabe em nenhuma delas, o dado
não entra:** vira linha em `## Não bate`.

O que não se apurou entra `?`, e o `?` pode carregar na seta o que resolve ele —
`faixa: ?  ← perguntar na primeira conversa`. Campo inventado com cara de apurado é pior
que campo vazio: o candidato repassa e descobre na entrevista.

Ordem de gravação, e ela importa: **primeiro os arquivos donos, depois as
vistas**. Vista escrita antes do dono é vista que descreve um estado que não
existe mais.

---

## 8 · Onde ela para

**Ela não apaga nada. Nunca.** Nem arquivo, nem linha de `_bruto/`, nem histórico
sem cópia. O que sai de vista continua na busca, e o relatório diz onde —
gaveta, não lixeira. Se algo precisa sumir de verdade, quem apaga é o candidato,
no computador ou no Drive dele.

**Ela não move sem ter como mover.** Aposentar é copiar para `arquivo-morto/` e
tirar da origem, e tirar da origem exige uma ferramenta que ela não concede
sozinha — o terminal no `local`, o que o conector tiver no `drive`. Sem ela, a
skill **não move nada** e escreve por quê: meia mudança — o arquivo em duas
pastas — é pior que a busca do jeito que estava.

**Ela não abre link.** As ferramentas dela leem a busca, não a internet, e é
de propósito: varrer uma busca abrindo trinta páginas é uma execução de meia
hora que termina com o candidato sem saber o que mudou. O `?` que um link
resolveria sai em `## Falta saber` com o nome de quem abre: `/vagas:buscar-vagas`
— e é lá que está escrito o que fazer quando o site só monta a página por
JavaScript e devolve nada.

**Ela não lê documento.** Formulário de candidatura, print de pergunta de formulário, enunciado de
estudo de caso, proposta por escrito: ela registra que está em `_bruto/` e manda para
`/vagas:candidatar`. Número de candidatura lido de foto vira número
errado no currículo, e concluir se um documento está em ordem não é dela nem de
skill nenhuma — é de quem vai assinar, e é depois de ler o papel inteiro.

**Ela não transcreve áudio de ouvido.** Quem transcreve é a ponte, e só o que
passou por ela. Áudio colado, de grupo ou anterior à ponte vira pergunta: “Tem
um áudio de 12 de agosto no meio dessa conversa. O que ela disse ali?”.
`<Mídia oculta>` e mensagem apagada viram buraco declarado.

**Ela não funde duas fichas.** Dois contatos que parecem a mesma pessoa: mostra
os dois e para. Fundir aposenta um id sem desfecho, e id não se reaproveita —
quando a fusão acontecer, é com o candidato olhando.

**Ela não escolhe verdade.** Dois fatos apurados que se contradizem ficam os
dois, cada um com a sua procedência. Nem o automático decide isso.

**Ela não escreve mensagem.** Nenhuma, para ninguém. A mensagem de quem sumiu é
de `/vagas:retomar-contato`; a lista do dia é de `/vagas:o-que-fazer-hoje`;
o currículo é de `/vagas:montar-curriculo`. Esta aqui arruma a busca de onde
as três tiram o que dizem.

**Ela não reescreve arquivo que já existe.** `Write` só em arquivo novo. Arquivo
fora do gabarito se corrige com `Edit`, linha a linha, e o que não der para
corrigir assim vira linha em `## Não bate` — reescrever inteiro é como se apaga
o trabalho de outra skill sem apagar nenhum arquivo. No `drive` não existe trocar
um trecho: atualizar devolve o arquivo inteiro, então **ela lê antes de
atualizar, sempre**, e o que ela devolve é o texto que estava lá com a mudança
dentro.

**Ela não sai da busca.** Não roda git, não sincroniza, não faz backup,
não toca em pasta nenhuma fora dali, e não sabe o que a empresa tem no CRM.

**Ela para no décimo bruto** e diz quantos ficaram. E se a busca estiver tão
estourada que a leitura não cabe, ela trata os maiores, diz o que sobrou, e não
finge que varreu tudo.

E quando algo não der certo, uma linha: o que não deu e qual é o caminho. Sem
pedir desculpa duas vezes, e sem sumir do assunto.
