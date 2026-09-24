---
name: retomar-contato
description: >-
  Varre a busca e lista quem parou de responder — há quantos dias, em que
  etapa parou e o que já viu — e escreve, para cada um, a mensagem de retomada
  que traz uma novidade concreta em vez de cobrar resposta. Nunca repete o
  ângulo da última tentativa, deixa em paz quem já foi retomado duas vezes sem
  responder, e grava a tentativa no arquivo da vaga para a próxima execução
  saber. Com o conector de WhatsApp ligado ela também manda, uma por uma,
  depois de mostrar para quem vai e o texto inteiro. Use quando o
  candidato diz “quem sumiu?”, “quem parou de responder”, “preciso dar um toque em alguém”, “semana fraca, quem eu
  chamo”, “o que eu
  mando pra quem me entrevistou e sumiu”, “quero reativar contato de muito tempo atrás”, “tem
  gente parada há tempo demais aí?” ou pede a mensagem para um contato
  específico que ficou sem resposta. Não é para quem deve algo a você
  (/vagas:cobrar-o-que-falta), nem para responder quem respondeu
  (/vagas:escrever-ao-contato).
license: MIT
compatibility: >-
  Precisa da busca, numa pasta do computador — ela conta os dias de
  silêncio de cada vaga e lê as retomadas anteriores no `## Histórico`. Sem
  busca, NÃO funciona: não há o que varrer, nem onde gravar a tentativa para
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

Ela varre a busca, lista quem parou de responder — há quantos dias, em que
etapa parou e o que já viu — e escreve, para cada um, uma mensagem que traz
**novidade** e usa um ângulo diferente do da última tentativa.

O candidato pode chamar com o nome de um contato, e aí ela olha só esse; sem
nome nenhum, varre a busca inteira.

Aqui quem tem etapa é a vaga, e quem recebe a mensagem é o contato que o
arquivo da vaga nomeia. Chamar com uma vaga também vale — é o que o botão do
painel faz na página da vaga, com o id —, e aí ela olha só essa vaga: o
passo 1 roda sobre ele, e se ele não está parado, ou não tem contato, a saída
diz isso em uma linha e não escreve mensagem.

Ela não escreve mensagem sem novidade (retomada sem novidade é cobrança, e
cobrança queima o contato), não insiste com quem já foi retomado duas vezes sem
responder, e não inventa vaga, faixa nem prazo para ter o que dizer.

**Mandar é a segunda saída, e ela só existe com o conector.** Sem ele — o caso
normal, e o de toda ferramenta de chat na web — ela entrega os blocos prontos
para copiar e para. Com ele, ela monta a tela do passo 8 e manda o que o
candidato aprovar, uma mensagem por vez. O bloco não some em nenhum dos dois
casos: é o padrão, e é o que sobra quando a ponte cai.

---

## 2 · Antes de tudo

**Leia o contrato por seção, em `references/contrato/`** — o número da seção
é o começo do nome do arquivo: `04-5-arquivo-de-contato.md` é a 4.5. Ele é o
padrão comum das quinze skills do pack, e nada de formato se decide aqui; o
inteiro está em `references/CONTRATO.md`. O que esta usa direto:

```
1    onde a busca mora — os dois transportes — e a primeira leitura
2    id e apelido — V-019 (Gerente de Produto Sênior, Trilho Logística), sempre os dois juntos
3    as três regras: não duplicar, procedência, aposentar
4.2  hoje.md          4.5  o arquivo do contato        4.7  _bruto/
     e o arquivo da vaga — é nele que moram a etapa e a tentativa
6    o que sai para o WhatsApp, e o que sai por e-mail
8    a ordem de busca, e o teto de três perguntas
9    os tetos          10   como uma skill começa e termina
```

Os arquivos: `01-0-onde-a-busca-mora.md`, `02-0-id-e-apelido.md`,
`03-0-as-tres-regras.md`, `04-2-hoje.md`, `04-5-arquivo-de-contato.md`,
`04-7-o-bruto.md`, `06-0-o-que-sai.md`, `08-0-quando-perguntar.md`,
`09-0-os-tetos.md` e `10-0-comeca-e-termina.md`.
E `04-4-arquivo-de-vaga.md`: a etapa é da vaga, e a tentativa fica gravada no
`## Histórico` da vaga.

Depois leia o **`INDICE.md` da busca**, pela primeira leitura da seção 1 do
contrato: procura no computador e, não achando, a pasta `busca` no Drive. A
linha `busca:` dele diz o transporte — `local` ou `drive` —, e **toda
leitura e toda gravação desta execução vão por ele**. Se não há `INDICE.md` em
lugar nenhum, a busca não existe: diga isto e pare, sem criar pasta nenhuma.

```
Não achei a busca, nem no computador nem no seu Drive. Rode
/vagas:comecar — ele monta com você e termina com uma vaga e um contato
de verdade lá dentro. Depois isto aqui funciona.
```

Do `INDICE.md` você tira seis coisas: `modo:`, o `nome:` de `## Quem sou` (é
a voz das mensagens), o `canal padrão com contato:`, o
`horário que costumo oferecer para entrevista:` — este é o que fecha a mensagem sem
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
                          conversa viva, é o candidato começando de novo
não                       a skill nem oferece: entrega os blocos e para
```

**A data de hoje vem do ambiente, não da busca.** A última linha do
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
`/vagas:candidatar`. Se em algum ponto parecer que ela precisa de
uma, pare e pergunte; não invente a exceção.

**E o `modo:` não governa o envio.** No automático ela escolhe quem recebe e
qual ângulo usa sem perguntar; mandar continua passando pela tela do passo 8,
porque quem ligou o automático para o trabalho não ligou para a boca dele
(contrato, 7.1). Quem manda no envio é a linha `envio:`, e ela não tem valor
que faça retomada sair sem ser mostrada.

---

## 4 · O passo a passo

É tarefa de três ou mais passos demorados — lê a busca inteira e escreve em
vários arquivos. **Mostre o TODO na tela** com os passos 1 a 7. O passo 8 entra
no TODO só quando há conector: sem ele, não existe.

### Passo 1 · Quem está parado

Leia, nesta ordem: `funil.md` (dá a etapa e o `desde` de cada vaga),
`vagas/_indice.md` e depois o arquivo de cada vaga da lista. **O
arquivo vence a vista** — se o `_indice.md` diz 5 de agosto e o `## Histórico`
da vaga tem uma linha de 12, vale a do arquivo, e o `_indice.md` entra na
lista do que reescrever.

**Quem anda no funil é a vaga; quem recebe a mensagem é gente.** Para cada
vaga que parou, leia o campo `contato`: é ele que nomeia
o contato, e é o arquivo do contato que dá o telefone, o `canal:` e o
`não contatar:`. Campo vazio ou `?` é o caso comum, e não é defeito: a vaga
**não entra na lista de mensagens** — não há para quem escrever — e sai em
“quem ficou de fora” com o motivo literal `sem contato: o próximo passo é achar
com quem falar`. Quem transforma essa linha em caixa do `hoje.md` é
`/vagas:o-que-fazer-hoje`, não esta skill.

O que se mede é o **silêncio do outro lado**, não o último toque do candidato. A última
vez que o contato falou está, em ordem de busca:

```
1  o conector, quando a linha diz sim, e só para vaga com `contato:`
   preenchido e telefone no arquivo dele: chame `estado_da_ponte` UMA vez, aqui
   (é o pré-voo do contrato §7 — ponte parada faz esta skill listar quem
   respondeu ontem), e então ultima_interacao com o telefone do arquivo do
   contato devolve a data E de quem foi a última palavra — que é a pergunta
   inteira, sem adivinhação
2  a última linha do ## Histórico da vaga que registra fala ou ato do outro
   lado — resposta, convite, recusa, pedido de documento
3  ## Combinado da vaga — o que eles marcaram ou prometeram, com a data
4  a última linha de ## O que já mandei do contato, que diz o dia e o que a
   mensagem pedia — e se veio resposta
5  a última mensagem do outro lado em _bruto/ — a conversa, o e-mail, a
   resposta automática do formulário (leia o fim do arquivo)
6  o `· desde` da linha da vaga no funil.md — e aí diga que a conta é
   aproximada, porque ele diz quando a etapa mudou, não quem falou por último
```

Não deu para saber quem falou por último, em nenhum dos seis: a vaga entra
na lista com `parado há ?` e vira uma linha em `## Falta saber`. Não estime.

Onde não há contato, quem “falou” é o outro lado inteiro: a última resposta
que o `## Histórico` da vaga registra, de quem quer que tenha vindo.

**O conector viu o que a busca não sabia?** Acontece, e é informação nova,
não defeito: o contato respondeu e ninguém anotou. Diga na lista — “respondeu
dia 19, e a busca não registrou” — e ponha uma linha em `## Falta saber`.
**Não grave a conversa aqui**: quem traz conversa para `_bruto/` é
`/vagas:organizar-busca`, e uma skill que grava fora do escopo dela é a
que ninguém desconfia quando o arquivo aparece estranho.

E o contrário também vale: sem telefone no arquivo do contato, o conector não
serve para ele — não tem como achar a conversa. Siga pelos outros cinco.

### Passo 2 · Quando é silêncio, por etapa

O prazo muda com o que está em jogo. Estes são os cortes, e não se inventa
outro:

| etapa | entra na lista a partir de | por quê |
|---|---|---|
| proposta | 2 dias | há número na mesa — silêncio aqui é o mais caro que existe, de qualquer lado que ele venha |
| entrevista | só depois que a data passou, e aí 5 dias | antes disso é confirmação, e quem cobra é o `hoje.md`; depois, o retorno é deles |
| em contato | 3 dias | alguém do lado de lá já respondeu uma vez, e conversa que esfria aqui raramente reabre sozinha |
| candidatada | 10 dias | candidatura sem resposta em dez dias não foi lida — e só entra se a vaga tem `contato:`; sem ele, sai em “quem ficou de fora” |
| salva | não entra | ninguém deve resposta: você ainda não se candidatou; é caso de `/vagas:candidatar` |
| nova | não entra | ninguém deve resposta: é caso de `/vagas:triar-vagas` |

Passou de **45 dias** sem responder: não é assunto desta skill. Diga em uma
linha que é caso de aposentar pela regra 3 e que quem faz isso é
`/vagas:organizar-busca`. Não aposente aqui.

### Passo 3 · A ordem da lista

Primeiro pela etapa, na ordem da tabela acima — entrevista vale mais que
candidatura sem resposta, e é por isso que a lista não é cronológica. Empate entre dois
da mesma etapa: sobe quem **tem novidade** para receber (passo 4); persistindo,
sobe quem está parado há mais tempo.

### Passo 4 · O ângulo — e ele é a razão de a skill existir

Para cada um, procure novidade nesta ordem e **pare na primeira que existir**:

```
1  novidade sua que serve à vaga  a trajetoria.md ou o portfólio ganharam algo
                                DEPOIS da última mensagem — caso publicado,
                                projeto entregue, curso concluído — e o
                                `## O que a vaga pede` pede isso
2  a vaga ou a empresa mudou    fato novo no arquivo da vaga, com data depois
                                da última mensagem: anúncio republicado, regime
                                ou faixa que mudou, produto lançado, rodada
3  a pergunta que ficou         ele deixou pergunta sem resposta, ou prometeu
                                algo em ## Combinado e não mandou
4  o prazo que eles deram       ## O que ele me disse tem prazo (“querem fechar
                                até o fim de outubro”) e o calendário andou o
                                bastante para ser assunto
5  outra pessoa na mesma vaga   o anúncio ou a conversa nomeia quem nunca foi
                                procurado — o gestor, alguém que pode dar
                                referência. Aí não é retomada: é conversa nova,
                                e vira uma linha em ## Falta saber
6  nenhum                       NÃO escreve mensagem
```

**O filtro do ângulo 1**, e ele é literal: `estado:` é `aberta`; a `etapa:` é
`candidatada`, `em contato` ou `entrevista` (nunca `nova` nem `salva`: ali
ninguém deve resposta); a novidade está na `trajetoria.md`, com procedência, e
serve a uma linha de `## O que a vaga pede`; o contato não está com
`não contatar: sim`; e a novidade **não**
foi citada em retomada anterior da vaga. Faltou qualquer um desses campos —
está como `?` — o ângulo 1 não se usa: mandar novidade que “parece” servir é
como recomeçar do zero.

Só chame de **novo** o que entrou na busca depois do último contato dele. O
que é antigo e nunca foi dito é “não te contei ainda”, e a mensagem diz
assim.

**Pressa que não está escrita no arquivo não se escreve na mensagem.** “tenho
outra proposta na mesa”, “preciso de uma resposta até sexta”, “estou fechando com outra empresa”: só se
`etapa: proposta` em outra vaga ou uma linha de `## Histórico` disser isso, com data. Sem
isso, é pressão inventada — e é o candidato que atende o telefone depois.

### Passo 5 · O que já foi tentado

Antes de escrever, leia no `## Histórico` da vaga as linhas que começam com
`retomada` (formato no passo 7) e conte **quantas vieram depois da última
manifestação dele**:

```
0   caminho livre
1   escreva — e o ângulo TEM de ser diferente do da linha anterior
2+  não escreve. Respeita o silêncio (passo 6)
```

O ângulo repetido é o defeito que esta skill existe para não cometer. Se o
único ângulo disponível é o mesmo da última vez, a vaga vai para “sem ângulo
novo” — não se manda o mesmo assunto com outras palavras.

**Cadência mínima: 7 dias.** Quem recebeu retomada há menos de uma semana não
entra na lista, mesmo com ângulo novo. Duas mensagens na mesma semana é o que
faz o contato arquivar a conversa.

**A contagem é da vaga; a cadência é do contato.** Duas retomadas sem resposta
fecham aquela vaga, e a conta não passa para outra vaga. Os 7 dias valem para a GENTE: quando o contato
responde por mais de uma vaga, procure linha de `retomada` dos últimos 7 dias
no `## Histórico` de cada vaga que nomeia esse contato no campo
`contato`. Achou: a vaga desta vez espera a semana seguinte,
e sai em “quem ficou de fora” dizendo por quê.

### Passo 6 · Quem sai da lista, e o que se diz

Duas retomadas seguidas sem resposta: **não escreva a terceira.** Ele sai da
lista de mensagens e vira uma linha em `## Parado` no `hoje.md` (passo 7),
sugerindo arquivar. Diga o motivo em uma frase, sem rodeio:

```
V-004 (Técnica de Enfermagem Plantonista, Aurora Saúde), com P-010 (Otto
Brandão) — duas retomadas sem resposta, a última em 2026-09-01. A terceira não
traz o processo de volta e queima o seu nome com o recrutador. Sugestão:
deixar parada até ele aparecer, ou arquivar por /vagas:organizar-busca.
```

Também não recebe mensagem quem caiu no ângulo 6 (nenhuma novidade). Aí a saída
não é uma mensagem: é **o que falta para haver uma**, em uma linha — “o arquivo
dela não tem `## O que a vaga pede` nem `## O que pesa a favor`, então não dá para saber o que é novidade
para ela”.

### Passo 7 · Escrever

Até **cinco mensagens por execução**, e o número é o mesmo com o conector
ligado. Ele é o tamanho de uma tela que alguém lê inteira antes de aprovar:
acima disso o candidato rola, para de ler o texto de cada um e aprova no
atacado — que é exatamente o que esta skill existe para não fazer. Candidato com
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
fala”, “alguma novidade sobre a vaga?”.

Toda afirmação da mensagem sai de um campo com procedência. Prazo com mais de
30 dias entra na mensagem assim mesmo, e **fora do bloco** vai a linha: “o
prazo do V-012 (PM de IA, Lumina Pagamentos) é de 12 de julho — confira antes de
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
candidato aprovar. Cinco por execução cabem no teto de partida de seis conversas
por hora; duas execuções na mesma hora não cabem, e a segunda diz isso na cara
em vez de falhar no fim.

O par sai por pessoa, sempre nesta ordem, com a tela no meio:

```
preparar_envio(conversa, texto)             devolve o código da prévia
<a tela, e a escolha do candidato>
enviar_mensagem(previa, conversa, texto)    os três, batendo byte a byte
```

**O que a tela carrega, por pessoa** — e resumo não serve. Nunca “4 mensagens
aguardando”: o que ele aprova é o texto, não a contagem.

```
id com apelido      P-005 (Helena Prates), sempre os dois juntos
de que se fala      V-019 (Gerente de Produto Sênior, Trilho Logística) — id com apelido também, porque a etapa
                    e o silêncio da linha de baixo são da vaga
etapa e silêncio    candidatada · parada há 12 dias
a última palavra    de quem foi, quando, e o que foi dito
qual tentativa      retomada 1, ou retomada 2 · a última
o ângulo            o que esta mensagem traz de novo
o texto             INTEIRO, do jeito que vai sair, na cerca de código dele
```

E a tela inteira:

```markdown
Três para retomar — busca lida agora, `não contatar:` de cada contato conferido agora

1 · P-002 (Marta Lins) · recrutadora
    V-011 (Técnica de Enfermagem, Hospital Boa Vista) · em contato · parada há 3 dias
    ela falou por último, 11/09: “te mando a data da prova técnica até sexta”
    retomada 1 · ângulo: o prazo que eles mesmos deram — preencher as vagas até o fim de outubro

<o bloco do passo 7, inteiro, na cerca de código dele>

2 · P-004 (Sérgio Alves) · gestor
    V-016 (Técnica de Enfermagem — Pronto-Atendimento, Aurora Saúde) · em contato · parada há 9 dias
    você falou por último, 05/09 — ele não respondeu
    retomada 2 · a última · ângulo: a Aurora abriu o pronto-atendimento de Olinda em 10/09

<o bloco do passo 7, inteiro, na cerca de código dele>

3 · P-007 (Luana Reis) · recrutadora
    V-013 (Técnica de Enfermagem — sala de vacina, Rede Farma Sol) · candidatada · parada há 12 dias
    ela nunca escreveu — o nome veio da página da vaga
    retomada 1 · ângulo: o curso de sala de vacina, concluído em 10/09

<o bloco do passo 7, inteiro, na cerca de código dele>

<quem ficou de fora, com o motivo de cada um — a lista da seção 6>

A Luana nunca te escreveu, e o canal dela é e-mail: esta sai por e-mail, não
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
é o que faz o candidato parar de confiar na lista.

#### 8.1 · Aprovar três de uma vez não é lista de transmissão

A diferença é de forma, não de intenção, e vale escrever:

```
lista de transmissão   uma mensagem, mesmo texto, muitos destinatários, tudo
                       junto. Não existe aqui — a ponte aceita UMA conversa
                       por chamada, e não há como pedir duas
três aprovadas juntas  três mensagens DIFERENTES, uma por pessoa, com o nome
                       dela, a vaga dela e a novidade dela dentro. A ponte
                       manda uma, espera, manda a outra
```

O que o candidato aprova de uma vez é a **revisão**, não o disparo. Diga isso na
tela em poucas palavras — “uma por vez, espaçadas” — e não prometa hora de
chegada: quem controla o intervalo é a ponte.

#### 8.2 · `ultima_interacao` imediatamente antes de cada envio

A lista foi montada com o que está **escrito na busca**; a conversa é outra
coisa e anda sozinha. Entre a leitura e o envio passaram minutos, e é nesses
minutos que o contato responde.

Voltou palavra dele depois do que a busca registra: **a retomada não sai.**
Ela vira aviso, e o aviso é mais útil que a mensagem seria:

```
P-005 (Helena Prates) — ela respondeu 14 minutos atrás e a busca não sabe.
Não mandei a retomada: retomar quem já voltou é o que queima o contato. A
conversa está esperando resposta, e quem traz ela para dentro é
/vagas:organizar-busca.
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

Retomada é o candidato **começando** a conversa: o destinatário não escreveu
primeiro, e para o WhatsApp esse é o caso de outra ordem — a punição mais
provável não é perder a conta, é a ponte parar de parear, sem erro na tela.
Isso se diz em **uma linha, uma vez por execução**, junto das saídas, como no
desenho acima. Não repita por item, não repita depois que ele escolheu, e não
vire parágrafo: o aviso inteiro é do ato de ligar o conector e mora no
`/vagas:comecar`. Aqui é lembrete, e lembrete que vira sermão é o que faz o
candidato parar de ler a tela.

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
segunda rede, não a primeira: quem lê a busca é esta skill.

Recusa que não diz o número nem como mudá-lo está impedindo em vez de informar
(contrato, 7.1).

#### 8.6 · O que a tela devolve depois

Uma linha por pessoa, com o que aconteceu de verdade. Não é seção do fecho —
vem antes dele, junto do trabalho:

```
Saiu

P-002 (Marta Lins) · V-011 (Técnica de Enfermagem, Hospital Boa Vista)                    enviada 14:32
P-004 (Sérgio Alves) · V-016 (Técnica de Enfermagem — Pronto-Atendimento, Aurora Saúde)    não saiu — ele respondeu 14 minutos atrás
P-007 (Luana Reis) · V-013 (Técnica de Enfermagem — sala de vacina, Rede Farma Sol)        não saiu pelo WhatsApp — o canal dela é e-mail, e o bloco está acima
```

O que saiu vira linha no `## Histórico` da vaga (seção 7, com o fim de linha
que o envio muda). O que não saiu **não vira nada**.

---

## 5 · O que perguntar, quando, e como

Uma pergunta por vez, **nunca mais de três na execução**, e cada uma com o
motivo na mesma frase (contrato, seção 8). Antes de perguntar, desça a ordem de
busca: quase tudo que esta skill precisa já está escrito.

**No copiloto, a bifurcação é uma só, e vem depois da lista** — entregar a
lista antes de perguntar é o que impede o candidato de esperar por nada. Use a
UI de perguntas do harness, com o custo escrito em cada opção:

```
Quatro vagas sem resposta. Escrevo a mensagem de quem?

  Os três mais quentes   proposta, entrevista e entrevista · pronto agora
  Escolher na lista      você diz os nomes · uma volta a mais
  Só a lista hoje        nada escrito, nada gravado na vaga
```

Rótulo de até quatro palavras; a descrição declara o custo, não vende a opção.

**A tela do passo 8 não conta neste teto.** Ela não é pergunta de busca — é a
confirmação do ato, e sem ela não há envio. Perguntar “mando?” não é gastar uma
das três; perguntar de novo o que já está escrito na busca, é.

Pergunte só isto, e só quando faltar de verdade:

- **quem é o candidato na conversa colada**, quando nenhum remetente bate com
  `nome:` do `INDICE.md` — o risco é gravar a fala do contato como promessa dele
- **se o contato respondeu por fora**, quando o arquivo tem muitos `?` e o
  histórico é curto: “tem resposta dela depois de 5 de agosto que não está aqui?
  Se tiver, eu não retomo quem já voltou”
- **o que dizer**, quando o ângulo 4 depende de uma pergunta do contato que
  ficou num `<Mídia oculta>`, ou num áudio que o conector não transcreveu —
  buraco declarado, nunca palpite

No automático não se pergunta: escolhe e declara em `## Decidi sozinho`.

---

## 6 · O formato da saída

O trabalho primeiro, os três blocos de fecho depois, nesta ordem e com estes
títulos exatos.

### A lista

```markdown
Quem não respondeu — busca lida em 2026-09-14

| vaga | etapa | parada há | contato | tentativa | ângulo |
|---|---|---|---|---|---|
| V-011 (Técnica de Enfermagem, Hospital Boa Vista) | em contato | 3 dias | P-002 (Marta Lins) | retomada 1 | o prazo que eles deram: preencher as vagas até o fim de outubro |
| V-016 (Técnica de Enfermagem — Pronto-Atendimento, Aurora Saúde) | em contato | 9 dias | P-004 (Sérgio Alves) | retomada 2 · a última | a Aurora abriu o pronto-atendimento de Olinda em 10/09 |
| V-013 (Técnica de Enfermagem — sala de vacina, Rede Farma Sol) | candidatada | 12 dias | P-007 (Luana Reis) | retomada 1 | o curso de sala de vacina, concluído em 10/09 |
| V-010 (Técnica de Enfermagem, Vértice Saúde) | candidatada | 12 dias | — | — | não entra: sem contato |
| V-007 (Técnica de Enfermagem Home Care, Norte Seguros) | candidatada | 15 dias | P-008 (Nara Pires) | — | sem ângulo novo |
| V-030 (Técnica de Enfermagem — Clínica Médica, Vértice Saúde) | entrevista | — | P-012 (Rui Campos) | — | não entra: a prova técnica é hoje |
```

Uma linha por vaga, id com apelido sempre, e a coluna `ângulo` já diz quem
recebe mensagem e quem não recebe.

### Quem ficou de fora

Vem logo depois da lista, e não é opcional. Quem a skill considerou e descartou
aparece com o motivo em uma linha. Sem isto o candidato não tem como saber que
faltou alguém — e descarte em silêncio é o que faz ele parar de confiar na
lista inteira.

```markdown
Fora da lista

V-010 (Técnica de Enfermagem, Vértice Saúde)       sem contato: o próximo passo
                                                   é achar com quem falar
V-007 (Técnica de Enfermagem Home Care,            sem ângulo novo: nada mudou
  Norte Seguros) · P-008 (Nara Pires)              na vaga nem na sua trajetória
                                                   desde a candidatura, e
                                                   “passando para saber” não é
                                                   ângulo
V-017 (Técnica de Enfermagem UTI Neonatal,         a P-002 (Marta Lins) fala por
  Hospital Boa Vista) · P-002 (Marta Lins)         ela e recebe hoje a retomada
                                                   da V-011 (Técnica de
                                                   Enfermagem, Hospital Boa
                                                   Vista) — a cadência mínima é
                                                   7 dias, e ela é da pessoa
V-004 (Técnica de Enfermagem Plantonista,          duas retomadas sem resposta —
  Aurora Saúde) · P-010 (Otto Brandão)             a terceira não se escreve
V-003 (Técnica de Enfermagem, Rede Farma Sol)      parada há 61 dias — é caso de
                                                   aposentar, e quem faz isso é
                                                   /vagas:organizar-busca
V-005 (Técnica de Enfermagem — Hemodiálise,        sexta da fila — o teto é
  Vértice Saúde) · P-011 (Sara Couto)              cinco por execução
```

Com o conector, esta mesma lista entra na tela do passo 8, antes das saídas, e
ganha os motivos que só existem lá: sem telefone no arquivo, ou recusado pelo
teto da hora.

### Cada mensagem

Bloco sozinho, pronto para copiar, **sem comentário dentro**. O que houver para
explicar vai depois dele, fora do bloco, em uma ou duas linhas.

```
Luana, concluí o curso de sala de vacina na semana passada.

Quando me candidatei à vaga de Técnica de Enfermagem para a sala de vacina, no
começo de setembro, o anúncio pedia curso de imunização concluído — era o que
faltava no meu currículo, e agora está nele, com as 40 horas de prática
supervisionada.

Faz sentido eu seguir no processo? Se fizer, tenho folga na terça e na quinta,
de manhã, para uma primeira conversa.
```

> Tudo o que a mensagem afirma veio do arquivo da V-013 (Técnica de Enfermagem
> — sala de vacina, Rede Farma Sol) — o que a vaga pede, a candidatura de 02/09
> — e da trajetoria.md: o curso de sala de vacina, concluído em 10/09. O
> horário é o do INDICE.md. Ângulo da vez anterior: nenhum, esta é a primeira.
> Pretensão não entra em retomada.

Sem conector o bloco é o fim: ele copia e cola. Com conector, o bloco continua
igual — o que muda é que embaixo dele existem as saídas do passo 8, e o texto
que sai é **este**, byte a byte, porque é ele que a prévia carimbou.

### O fecho

```markdown
## Guardei
- ~/busca/vagas/V-011-hospital-boa-vista.md — uma linha de retomada no histórico
- ~/busca/vagas/V-016-aurora-saude.md — uma linha de retomada no histórico
- ~/busca/vagas/V-013-rede-farma-sol.md — uma linha de retomada no histórico
- ~/busca/vagas/_indice.md — atualizada da V-013 (Técnica de Enfermagem — sala de vacina, Rede Farma Sol) corrigida
- ~/busca/hoje.md — uma caixa em ## Parado: V-004 (Técnica de Enfermagem Plantonista, Aurora Saúde), arquivar ou deixar parada

## Falta saber
- com quem falar na V-010 (Técnica de Enfermagem, Vértice Saúde) — candidatada há 12 dias, e o arquivo diz contato: ?
- se o P-004 (Sérgio Alves) respondeu depois de 5 de setembro por fora da busca
- quem coordena a sala de vacina da V-013 (Técnica de Enfermagem — sala de vacina, Rede Farma Sol) — o anúncio fala em “farmacêutica responsável” e não dá nome

## Decidi sozinho
- Escrevi para as três mais quentes e deixei a V-030 (Técnica de Enfermagem — Clínica Médica, Vértice Saúde) de fora — a prova técnica é hoje, e quem cobra a véspera é o hoje.md. Para incluir, me diga.
- Usei a abertura do pronto-atendimento de Olinda como está no arquivo da V-016 (Técnica de Enfermagem — Pronto-Atendimento, Aurora Saúde), de 10 de setembro. Se você não quiser citar a unidade nova deles, me diga e eu refaço a mensagem.
```

`## Decidi sozinho` só existe em modo automático, e cada linha traz **o que fiz
— por que — como desfazer**.

Saiu pela ponte, o `## Guardei` diz isso na mesma linha — `— retomada enviada
14:32, e a linha no histórico`. O que ficou só escrito continua como está: o
arquivo guarda a tentativa, não o envio que não houve.

Os caminhos do `## Guardei` acima são os do `local`. No `drive`, a mesma lista
nomeia a pasta e o arquivo — `vagas/V-019-trilho-logistica.md, na pasta
busca do seu Drive — uma linha de retomada no histórico`.

---

## 7 · O que gravar na busca

Esta skill tem `Write` e `Edit` porque **a tentativa gravada é o que faz a
próxima execução não repetir o ângulo** — sem isso ela é um chat que esquece, e
o pack inteiro perde a razão. Ela escreve em três lugares, e em nenhum outro.

**No `drive`, atualizar reescreve o arquivo inteiro** (contrato, seção 1): leia
o arquivo da vaga, o `hoje.md` ou o `_indice.md` antes de gravar e devolva o
texto inteiro com a linha nova dentro.

### 1 · A tentativa, no `## Histórico` da vaga

Uma linha, no formato abaixo. É seção do gabarito (contrato,
`04-4-arquivo-de-vaga.md`): não se cria campo nem seção nova. No arquivo
do contato não entra linha de retomada — esse arquivo diz quem a pessoa é, e
não o andamento de cada vaga.

```
- 2026-09-14 retomada 2 · para P-004 (Sérgio Alves) · e-mail · ângulo: pronto-atendimento de Olinda aberto em 10/09 · mensagem escrita, envio com o candidato
```

O número é a contagem de retomadas seguidas **sem resposta dele**, esta
incluída; ele zera quando o contato responde. O número é para o candidato ler —
a contagem que governa o passo 5 vem de contar as linhas, não de confiar no
número escrito.

`mensagem escrita, envio com o candidato` fica porque é o que é verdade quando a
skill não mandou — e é o caso normal: `enviado` é fato, e o fato ainda não
aconteceu. Depois do bloco, uma linha só, sem insistir: “mandou? me diga e eu
troco o fim da linha no histórico.” Enquanto ele não disser, a linha que está lá
já basta para a próxima execução não repetir o ângulo.

**Saiu pela ponte, o fim da linha muda**, porque o fato mudou:

```
- 2026-09-14 retomada 2 · para P-004 (Sérgio Alves) · WhatsApp · ângulo: pronto-atendimento de Olinda aberto em 10/09 · enviado 14:32 pela ponte
```

Grave depois do `enviar_mensagem` voltar, nunca antes. Recusado — prévia
vencida, teto da hora, mensagem nova por cima —, **não grave nada**: não houve
retomada, e uma linha falsa de retomada tranca aquele contato por sete dias de
cadência e queima uma das duas tentativas dele.

Confira o teto de **60 linhas** ao gravar. Estourou: condense o `## Histórico`
pela seção 9 — linhas de mais de 90 dias viram uma por mês. Fato corrente nunca
é cortado para caber.

### 2 · A sugestão de arquivar, no `hoje.md`

Quem bateu as duas retomadas vira uma caixa em `## Parado` — a seção existe
para o que está parado esperando decisão:

```
- [ ] V-004 (Técnica de Enfermagem Plantonista, Aurora Saúde) — duas retomadas sem resposta a P-010 (Otto Brandão) desde 2026-08-25; arquivar ou deixar parada
```

Três cuidados. O `hoje.md` é vista derivada e quem o reescreve é
`/vagas:o-que-fazer-hoje` — a linha sobrevive à próxima reescrita porque o
fato que a origina está no histórico da vaga, que é o dono. Se o título do
arquivo tiver data anterior à de hoje, acrescente a linha e **não mexa no
título**: o resto da página é de outro dia, e dizer o contrário seria mentir
sobre o que já foi feito. E se as caixas já forem quinze (teto da seção 9), não
acrescente: diga na saída que o `hoje.md` está cheio e que a sugestão fica na
lista desta execução.

### 3 · A vista que estava errada

Achou divergência entre `vagas/_indice.md` e o arquivo da vaga — a
data da última linha do histórico atrasada, vaga faltando: corrija a vista a
partir do arquivo e diga em `## Guardei`. Nunca o contrário.

**Não se grava mais nada.** Não se muda `etapa:` (silêncio não é mudança de
etapa), não se cria vaga nem contato, não se toca em `_bruto/`, não se apaga
coisa alguma. No arquivo do contato entra uma coisa só, e só quando ela
acontece: o `não contatar: sim` do passo 8.5.

Se o candidato colar uma conversa durante a execução, a ordem é a da seção 7 do
contrato: **grava o bruto primeiro**, em
`_bruto/AAAA-MM-DD-<canal>-<apelido-curto>.md` da busca — arquivo novo no
`local`, arquivo criado dentro da pasta `_bruto/` no `drive` — com o cabeçalho
de três linhas, e só depois extrai fato.

---

## 8 · Onde ela para

Sete limites, e é melhor saber deles antes de mandar a mensagem.

**O silêncio que ela mede é o silêncio do que está escrito.** Se o contato
respondeu no WhatsApp e a conversa não foi colada, ela vai propor retomar quem
já voltou — e uma retomada em cima de uma resposta ignorada é pior que
nenhuma. O sinal é arquivo com muitos `?` e histórico curto; o conserto é colar
a conversa e rodar `/vagas:organizar-busca` antes. Na dúvida, ela
pergunta uma vez, e é a pergunta que mais paga nesta skill. Com conector o
passo 8.2 pega isso no último segundo — mas só de quem ia receber, e só na hora
do envio: a lista continua sendo a do que está escrito.

**Sem os campos do filtro preenchidos, não há novidade computável.** Onde
`## O que a vaga pede` e `## O que pesa a favor` estão em `?`, o ângulo 1 não existe, por mais que a
semelhança convença. Ela devolve o que falta em vez de chutar — novidade que
não serve a quem lê não retoma o contato, encerra o assunto.

**E sem contato, não há mensagem.** Vaga que parou e não nomeia ninguém em
`contato` é a maior parte de “quem ficou de fora”, e está
certo que seja: esta skill escreve para gente. Achar com quem falar é trabalho
de outra, e ela só diz que falta.

**Ela não abre link nenhum.** Não há ferramenta de web no `allowed-tools` dela,
e é de propósito: ela trabalha com o que já está apurado na busca, com a data
da procedência, e avisa quando o dado passou de 30 dias. Estado desatualizado ela
declara; estado novo ela não busca — quem busca é `/vagas:buscar-vagas`.
Dado de vaga não se chuta, nem para ilustrar.

**Ela não sabe por que o contato sumiu.** Silêncio longo em vaga com entrevista feita
costuma ser a vaga ter sido congelada, outra pessoa ter avançado no processo
ou o recrutador ter trocado de prioridade — e nenhuma dessas coisas está na busca. Por isso a
mensagem pergunta sobre a novidade, e nunca afirma o que ele estaria pensando.

**Ela lê o fim das conversas longas.** Em `_bruto/` com centenas de linhas, ela
busca as últimas trocas para achar o ângulo, e diz que leu só o fim. O que está
no meio e importa tem de estar no arquivo da vaga, que é o dono do fato —
essa é a regra 1 e é o que impede a skill de reler quarenta quilobytes por
telefone.

**Ela não decide o que é do candidato.** Não sugere baixar a pretensão, não avalia se
a proposta é boa, não promete prazo de RH, do gestor ou de comitê de contratação, e
não aposenta ninguém — os 45 dias são de `/vagas:organizar-busca`.

**E ela só manda o que o candidato leu.** Sem conector ela escreve, diz onde
guardou e para. Com conector ela manda uma por vez, depois da tela do passo 8, e
nunca uma que ele não tenha visto inteira. A mensagem sai do WhatsApp dele, com
o nome dele, na voz dele — e é por isso que a Kapstan não aparece em uma sílaba
dela. Retomada que sai sozinha, sem ninguém na frente da tela, não existe em
modo nenhum.
