---
name: documentos-do-negocio
description: >-
  Monta o checklist de documentos do negócio — o que pedir, de quem, em que
  ordem, e o que trava se faltar —, separado por quem entrega: comprador,
  vendedor, imóvel e imobiliária. Cobre venda à vista, venda financiada, venda
  com FGTS, permuta, e locação com fiador, com seguro-fiança ou com caução.
  Marca o que já está na carteira e o que falta, e deixa os pendentes no hoje.md
  com o nome de quem tem que providenciar. A lista é ponto de partida: banco,
  cartório e prefeitura mudam a exigência. Use quando o corretor disser “o que
  eu preciso pedir para fechar”, “que documento pede numa venda financiada”, “a
  Joana vai usar FGTS, o que muda”, “que papel pede do fiador”, “o que falta
  para a escritura do V-071 (casa 3 dorm, Azenha)”, “o cliente quer permutar, e
  agora”, “o que a seguradora vai pedir”, “monta a lista de documentos da
  locação”, “o proprietário perguntou o que ele tem que mandar”. Também quando
  ele já juntou metade da papelada e quer saber o que ainda falta, de quem
  cobrar e o que cobrar primeiro.
license: MIT
compatibility: >-
  Precisa de acesso à carteira, no computador ou no Google Drive — o transporte
  sai da linha carteira: do INDICE.md. Sem carteira, monta o checklist com o
  tipo do negócio que for dito ou colado na conversa, não marca o que já existe
  e não grava nada: o ## Guardei vira uma linha só. Com o conector de WhatsApp
  ligado, a cobrança de quem prometeu documento também sai daqui — uma pessoa
  por vez, com o texto e o nome na tela antes, e só depois de reler a conversa
  para não cobrar o que já chegou.
allowed-tools: Read Glob Grep Write Edit
---

# Documentos do negócio

Esta skill devolve o checklist da papelada — o que pedir, de quem, em que ordem,
quanto costuma demorar e o que trava se faltar —, marcando o que a carteira já
tem e o que ainda falta.

**Ela não diz que um documento está em ordem, não promete prazo de cartório, de
banco ou de prefeitura, e não substitui o advogado, o despachante nem o
correspondente bancário.** Ela junta a lista para que a conversa com eles comece
com a papelada na mão.

---

## 1 · Antes de tudo

O corretor chama esta skill com o imóvel ou o cliente, e o tipo do negócio se
ele já souber: `V-071`, `C-017 venda financiada`, `a locação do A-014`. Veio sem
nada disso, é a seção 5.

Leia, nesta ordem:

1. **`references/CONTRATO.md`, inteiro.** Ele é a lei do pack. As seções que
   esta skill mais usa são a 1 (onde a carteira mora, e os dois transportes), a
   2 (id e apelido), a 3 (procedência e o `?`), a 4.2 (`hoje.md`), a 4.4
   (arquivo de imóvel), a 4.5 (arquivo de cliente), a 4.7 (`_bruto/`), a 6 (o
   que sai para o WhatsApp), a 7.1 (como a mensagem sai), a 8 (quando
   perguntar), a 10 (como termina) e a 11 (onde ela roda). **Nenhum gabarito é
   reescrito aqui** — formato que esta skill inventar quebra as outras nove.
2. **O `INDICE.md` da carteira**, pela primeira leitura do CONTRATO §1: procura
   no computador, depois a pasta `carteira` no Drive.

Não achou o `INDICE.md` em transporte nenhum? Diga isso em uma linha:

> Não achei a sua carteira, nem no computador nem no seu Drive. Rode
> `/corretor:comecar` — ele monta a carteira com você e já entra com um imóvel e
> um cliente de verdade.

E então **monte o checklist assim mesmo**, com o tipo do negócio que ele disser
ou colar (contrato §11): o que se perde é marcar o que a carteira já tinha e
deixar pendente no `hoje.md`, não a lista. Nada é gravado, e o fecho diz isso —
o `## Guardei` vira uma linha só: `- nada foi gravado — você está sem carteira
aqui`.

Do `INDICE.md`, guarde seis coisas antes de seguir:

```
carteira:               o transporte e o lugar — manda em TODA leitura e gravação
modo:                   a seção 2 desta skill
nome:                   é a voz da mensagem de cobrança, e é quem assina
imobiliária:            é o nome do bloco “Da imobiliária”
WhatsApp: e envio:      se a cobrança pode SAIR daqui, e como — a seção 6.1
## Como eu trabalho     o que a imobiliária dele já exige, e não se pergunta de novo
```

A linha `carteira:` decide como esta skill lê e grava, e a tabela de
equivalência do CONTRATO §1 dá o verbo de cada operação nos dois transportes. No
`local`, toda chamada de ferramenta usa **caminho absoluto**, e ao falar com o
corretor se escreve `~/carteira/…`; no `drive` não existe caminho — a busca é
sempre presa à pasta, e ao falar com ele se diz “a pasta `carteira` do seu
Drive”.

**Por que esta skill tem `Write` e `Edit`:** documento que falta é fato do
negócio, e fato mora no arquivo dono. Ela escreve `pendências:` em
`imoveis/<id>-<apelido>.md`, uma linha em `## Combinado` e `## Histórico` do
cliente de quem se cobra, e as caixas do que se pede hoje no `hoje.md`. Não
escreve em mais nada, **não cria arquivo de cliente nem de imóvel**, e **não
apaga nada** (CONTRATO §3, regra 3).

**O checklist inteiro não é gravado em lugar nenhum.** Ele é derivado — o tipo do
negócio mais o que a carteira tem —, e a regra 1 do CONTRATO manda não duplicar
o que se deriva. Rodar a skill de novo o refaz atualizado; gravado, ele envelhece
dentro do arquivo do imóvel e ainda estoura o teto de 40 linhas.

---

## 2 · O modo

Leia a linha `modo:` do `INDICE.md`. `automatico` e `automático` valem; qualquer
outro valor, linha ausente ou arquivo ilegível é **`copiloto`** (CONTRATO §5).

**Copiloto.** Pergunta o tipo do negócio quando a carteira não responde (seção
5), e só isso. O resto ela resolve com o que está escrito.

**Automático.** Não pergunta o tipo: lê da carteira. Se a carteira não disser a
forma de pagamento ou a garantia, ela **não chuta** — monta o tronco, que vale
para qualquer venda ou qualquer locação, deixa o ramo específico como `?` e
declara isso em `## Decidi sozinho`. Escolher entre financiado e à vista sem
prova é inventar um fato do negócio, e é o que a regra 2 do CONTRATO proíbe.

Esta skill **não tem exceção de modo**. A única exceção escrita do pack é a
`/corretor:conferir-matricula` (CONTRATO §5), e ela é outra conversa: aquela lê
o documento, esta apenas diz que ele precisa existir.

**E o `modo:` não governa o envio.** Quem diz se a cobrança sai daqui é a linha
`envio:` do `INDICE.md`, que é outra linha e tem valores próprios (CONTRATO
§7.1): quem ligou o automático para o trabalho não ligou para a boca dele. Como
isso funciona está na seção 6.1.

---

## 3 · O TODO

Mostre o TODO na tela quando a execução tiver **três ou mais passos demorados**
(CONTRATO §10): é o caso normal aqui, porque ela lê o imóvel, lê o cliente,
varre `_bruto/` e escreve em dois ou três arquivos.

```
1  ler o INDICE, o imóvel e o cliente
2  ver o que já está em _bruto/
3  montar a lista do tipo do negócio
4  ler a conversa de quem vou cobrar   só com o conector · seção 6.1
5  gravar as pendências e as caixas do dia
```

Pergunta solta — “que documento pede numa venda com FGTS?”, sem imóvel e sem
cliente — não é TODO: é uma lista e pronto, e ela não grava nada.

---

## 4 · O passo a passo

### 4.1 · O tipo do negócio, da carteira antes da pergunta

Desça a ordem de busca do CONTRATO §8 antes de abrir a boca. O tipo quase sempre
já está escrito:

```
venda ou locação      estado: do imóvel — “à venda” ou “para alugar”
forma de pagamento    pagamento: do cliente — “financiamento, aprovação ainda
                      não saiu” resolve a pergunta inteira
garantia da locação   ## Como eu trabalho no INDICE.md, ou ## Combinado do cliente
permuta               só aparece se alguém disse; nunca se deduz
```

O que a carteira respondeu, **não se pergunta** — use e cite de onde veio
(CONTRATO §8, “Quando NÃO perguntar”). O que ela não respondeu vai para a
seção 5.

Os sete tipos, e não há outros nesta skill:

```
venda à vista · venda financiada · venda com FGTS · permuta
locação com fiador · locação com seguro-fiança · locação com caução
```

### 4.2 · Quem é quem

O checklist é separado por **quem entrega**, porque lista misturada é a que faz o
corretor cobrar a coisa errada da pessoa errada. Antes de montar, resolva os
papéis, cada um com id e apelido:

```
venda      comprador     o cliente C- que está comprando
           vendedor      o proprietário, que também é C- (CONTRATO §4.6)
           imóvel        V- ou A-, o arquivo dono dos fatos dele
           imobiliária   o nome que está em imobiliária: no INDICE.md

locação    inquilino · proprietário · garantia · imóvel · imobiliária
permuta    cada lado é vendedor de um imóvel e comprador do outro, e entrega
           os dois pacotes
```

**Papel sem id não trava a skill.** O proprietário costuma estar só como linha no
arquivo do imóvel (`proprietário: Sr. Almeida, +55 51 99777-1122`). Nesse caso,
cite-o pelo nome que está lá e ancore no imóvel: “Sr. Almeida, proprietário do
V-071 (casa 3 dorm, Azenha)”. **Não abra ficha de cliente para ele** — quem
organiza a carteira é `/corretor:organizar-carteira` — e deixe uma linha em
`## Falta saber` dizendo que sem ficha a cobrança fica sem histórico.

### 4.3 · O que a carteira já tem

Três marcas, e não há uma quarta:

```
tem      está na carteira, e a linha diz ONDE
falta    ninguém tem, e a linha diz QUEM providencia
?        não dá para saber daqui — vira pergunta ou fica em ## Falta saber
```

Onde procurar cada marca:

1. **`imoveis/<id>-<apelido>.md`, `## Documentos`** — `matrícula:`, `conferida:`
   e `pendências:`. Atenção: **saber o número da matrícula não é ter a
   certidão.** `matrícula: 44.812, 3º Registro de Imóveis` é o endereço do
   documento, não o documento. Isso é `falta`, e a linha fica mais fácil porque
   já se sabe em que cartório pedir.
2. **`_bruto/`** — liste a pasta `_bruto/` da carteira, pelo verbo do seu
   transporte (CONTRATO §1, a tabela de equivalência), e leia o nome:
   `2026-08-18-matricula-44812.md`, `2026-08-14-iptu-8812.md`. Confirme pela
   linha `sobre:` do cabeçalho (CONTRATO §4.7) que é do imóvel certo; nome de
   arquivo parecido não basta. Procurar o id do imóvel dentro de `_bruto/` acha
   o que o nome não diz. Busca vazia não prova ausência: liste a pasta antes de
   concluir que o documento não está lá.
3. **`clientes/<id>-<apelido>.md`, `## Combinado`** — “ia mandar o IPTU em
   2026-08-13” é `falta` **já pedido**, e o destino dele no `hoje.md` é
   `## Prometido e não chegou`, não `## Vence hoje`.
4. **`hoje.md`** — leia as caixas que já estão lá antes de acrescentar qualquer
   uma. Caixa repetida faz o corretor parar de ler o arquivo, e aí ele para de
   ler as que importam.

**Documento em `_bruto/` é `tem`, não é `serve`.** A matrícula que está na pasta
pode ser de dois anos atrás, e banco e cartório costumam querer certidão recente.
Se a data do material não estiver declarada no cabeçalho, a marca é `tem` com a
ressalva escrita na mesma linha: “confira a data — certidão velha volta”.

### 4.4 · A lista, e a ordem

Dentro de cada bloco de quem entrega, a ordem é sempre esta:

```
1  o que pode derrubar o negócio      matrícula, certidões do vendedor, aprovação
                                      de crédito, laudo de avaliação do banco
2  o que demora e não está na mão      cartório, prefeitura, banco, seguradora,
   dele                                síndico, fiador
3  o que é rápido e depende de uma     RG, CPF, holerite, comprovante de
   pessoa só                           residência, dados bancários
```

**Prazo entra como forma, nunca como data.** “Costuma sair em poucos dias úteis,
e quem dita é o cartório” pode; “sai quinta” não pode, e não pode virar promessa
ao cliente (CONTRATO §10, último item de “O que nenhuma skill faz”). Documento
que só depende de uma pessoa querer é do mesmo dia, e isso se diz.

#### 4.4.1 · O tronco da venda — vale para as três

**Do imóvel**

- **Matrícula atualizada**, com os ônus — Cartório de Registro de Imóveis da
  circunscrição do imóvel. É onde se lê quem é o dono e o que pesa sobre o bem:
  hipoteca, alienação fiduciária, penhora, usufruto, indisponibilidade. Sem ela
  não há financiamento nem escritura. Em várias capitais sai pelo portal do
  registro no mesmo dia; quem dita o prazo é o cartório.
- **Certidão negativa de tributos do imóvel, ou IPTU quitado** — Prefeitura. A
  dívida de IPTU acompanha o imóvel e o comprador herda; o tabelião costuma
  exigir antes de lavrar.
- **Negativa de débitos de condomínio**, assinada pelo síndico ou pela
  administradora — só em condomínio. A dívida também acompanha o imóvel.
- **Habite-se, e a construção averbada na matrícula** — Prefeitura e cartório.
  Área construída que não está na matrícula não é financiada e emperra a
  escritura. É a pendência que mais atrasa venda de casa reformada.
- **Se o imóvel ainda tem financiamento ou alienação fiduciária ativa:** saldo
  devedor e a anuência do banco credor. Sem isso não se transmite.

**Do vendedor**

- RG e CPF do vendedor e do cônjuge; comprovante de endereço.
- **Certidão de casamento atualizada, com as averbações** — ou de nascimento, se
  solteiro. O regime de bens decide se o cônjuge precisa assinar, e venda sem a
  assinatura devida é anulável. Pacto antenupcial registrado, quando houver.
- **Certidões pessoais dos vendedores** — cível, executivos fiscais, federal,
  trabalhista e de protesto. São a defesa do comprador contra fraude à execução:
  o negócio pode cair anos depois se o vendedor tinha dívida no dia da venda.
- **Procuração pública com poderes de venda**, quando não é o dono que assina.
  Procuração antiga ou genérica é recusada no cartório, e isso se descobre no dia
  da escritura.

**Do comprador**

- RG e CPF dele e do cônjuge, certidão de estado civil, comprovante de endereço,
  profissão e renda — é a qualificação que vai na escritura.
- **ITBI** — Prefeitura. Sem ITBI pago não se lavra escritura nem se registra.
  Quem paga costuma ser o comprador, mas quem manda é a lei do município e o que
  está escrito no contrato.

**Da imobiliária**

- Autorização de venda assinada pelo proprietário, e a exclusividade com a data
  de vencimento, se houver.
- Ficha cadastral das duas partes; proposta escrita e assinada; contrato de
  compra e venda ou promessa.

#### 4.4.2 · Venda à vista

Acrescenta ao tronco:

- **Escritura pública em tabelionato de notas**, obrigatória acima de trinta
  salários mínimos (art. 108 do Código Civil), e o **registro na matrícula**
  depois. Escritura assinada e não registrada não transfere nada.
- **Origem dos recursos** — o tabelionato pode pedir, e operação em dinheiro vivo
  acima de um limite tem comunicação obrigatória do cartório. O valor do limite
  muda: confirme no tabelionato, e não escreva número.

É o tipo que menos pede papel do comprador e mais depende de o vendedor estar
limpo. Se uma certidão do vendedor voltar com processo, **quem decide se segue é
o comprador com o advogado dele** — não é a skill e não é o corretor.

#### 4.4.3 · Venda financiada

Acrescenta ao tronco, do comprador:

- **Comprovante de renda** — CLT: três últimos holerites e carteira de trabalho.
  Autônomo ou pessoa jurídica: declaração de imposto de renda completa com o
  recibo de entrega, extratos bancários dos últimos meses, pró-labore ou decore.
- Declaração de imposto de renda completa com recibo; extrato do FGTS, se for
  usar; certidão de estado civil e comprovante de residência.

E dois passos que não são papel do cliente, e são onde o negócio mais quebra:

- **A avaliação do imóvel pelo engenheiro credenciado do banco.** O banco
  financia sobre o laudo, não sobre o preço combinado. Laudo abaixo do preço muda
  a entrada, e isso aparece já com todo mundo animado.
- **A análise jurídica do banco** sobre a matrícula e as certidões do vendedor. O
  banco recusa por coisa que passou batido na imobiliária.

O prazo é do banco. A aprovação de crédito costuma sair em poucos dias úteis; do
“aprovado” até a assinatura costuma levar semanas, e a assinatura é no banco.
**Nada disso vira data na mensagem para o cliente.**

#### 4.4.4 · Venda com FGTS

Vem em cima da venda financiada — ou sozinha, quando o FGTS entra só como parte
do pagamento. Acrescenta:

- Autorização de movimentação da conta do FGTS e extrato; carteira de trabalho.
- **As condições que o banco confere, e cada uma derruba o uso do FGTS:** três
  anos de trabalho sob o regime do FGTS, somados e não necessariamente seguidos;
  não ser proprietário de outro imóvel residencial no município onde mora ou
  trabalha, nem na região metropolitana; não ter outro financiamento ativo no
  SFH; o imóvel residencial, urbano, concluído e com matrícula individualizada,
  dentro do teto de valor do SFH.
- **Não escreva o teto de valor.** Ele muda por decisão do Conselho Curador, e o
  texto que vale é a resolução vigente. Quem confirma é o banco.

O intervalo mínimo desde o último uso do FGTS — do comprador e do próprio imóvel
— é o que mais muda de resolução para resolução: entra como `?` com a resolução
na procedência, `← pedir ao banco`.

#### 4.4.5 · Permuta

**É duas vendas amarradas num instrumento.** Cada lado entrega o pacote de
vendedor **e** o de comprador; cada imóvel entrega o pacote de imóvel. Não há
atalho, e quem trata permuta como meia venda descobre a metade que falta no
cartório.

Acrescenta:

- **Avaliação dos dois imóveis** e a **torna** escrita: quanto, quem paga, quando,
  e o que acontece se não pagar.
- **ITBI incide sobre cada transmissão.** Como a prefeitura calcula a permuta com
  torna muda de cidade para cidade — pergunte antes, e não prometa valor.
- **Se um dos imóveis tem financiamento ativo:** anuência do banco credor. É onde
  a permuta mais morre.

#### 4.4.6 · O tronco da locação — vale para as três garantias

**A lei permite uma garantia por contrato.** Fiador e caução no mesmo contrato é
nulo (Lei do Inquilinato, art. 37, parágrafo único). Se o corretor pedir as duas,
diga isso em uma linha, sem rodeio.

**Do inquilino** — RG e CPF dele e do cônjuge; comprovante de renda; comprovante
de residência atual; ficha cadastral. Pessoa jurídica: contrato social, CNPJ,
faturamento e quem assina. **A renda exigida é regra da imobiliária, não da lei**
— se `## Como eu trabalho` não disser, fica `?`.

**Do proprietário** — RG e CPF; prova de propriedade (matrícula ou IPTU no nome
dele); certidão de casamento; dados bancários; procuração, se não for ele quem
assina; contrato de administração com a imobiliária.

**Do imóvel** — IPTU do ano, e escrito no contrato quem paga durante a locação;
negativa de condomínio e o valor atual da taxa; contas de luz, água e gás para
transferir a titularidade; regularidade do gás quando o prédio exige. E o
documento que salva o corretor na saída:

- **Laudo de vistoria com fotos, assinado pelos dois, antes da entrega da
  chave.** Sem ele, a discussão da devolução é palavra contra palavra, e quem
  fica no meio é o corretor.

**Da imobiliária** — contrato de locação assinado pelas partes e por duas
testemunhas, ficha cadastral, e a garantia escolhida documentada.

#### 4.4.7 · Locação com fiador

- RG e CPF do fiador **e do cônjuge**, certidão de casamento, comprovante de
  renda, comprovante de residência.
- **O cônjuge assina.** Fiança dada sem a autorização do cônjuge não vale como
  garantia — é a Súmula 332 do STJ, e é o erro que só aparece na hora de
  executar.
- **Matrícula atualizada de imóvel quitado no nome do fiador**, e a certidão de
  ônus desse imóvel. Quantos imóveis, e se precisa ser na mesma cidade, é regra
  da imobiliária: `## Como eu trabalho`, ou `?`.
- Certidões pessoais do fiador.

É a garantia que mais demora, porque depende de um terceiro que não tem pressa
nenhuma. Pedir cedo é a única defesa.

#### 4.4.8 · Locação com seguro-fiança

- Ficha da seguradora, RG e CPF, comprovante de renda, comprovante de residência,
  e os dados do contrato: aluguel mais os encargos que a apólice vai cobrir.
- **Quem aprova é a seguradora**, por análise de crédito, e recusa não tem
  recurso — derruba a locação. A análise costuma ser rápida, mas o prazo é dela.
- **A apólice tem de estar emitida antes da entrega da chave**, e o prêmio costuma
  ser do inquilino. Isso se diz na proposta, não na assinatura.

#### 4.4.9 · Locação com caução

- **Caução em dinheiro: no máximo três aluguéis**, depositada em caderneta de
  poupança em nome do locador e do locatário, e o que render é do locatário no
  fim (Lei do Inquilinato, art. 38). Caução acima de três aluguéis é ilegal, e
  caução guardada na conta do proprietário é briga certa na saída.
- **Caução em imóvel** se averba na matrícula do imóvel dado em garantia — então
  ela pede matrícula atualizada e a certidão de ônus desse imóvel.
- O comprovante do depósito, em nome dos dois, vai junto do contrato.

### 4.5 · O que sai da lista comum

Seis situações em que a lista acima é ponto de partida curto demais, e a skill
diz isso em vez de completar sozinha:

```
espólio, inventário              formal de partilha ou alvará judicial
imóvel de menor ou interditado   autorização judicial
usufruto na matrícula            o usufrutuário também assina
vendedor pessoa jurídica         contrato social, certidões da empresa, quem assina
imóvel rural                     CCIR, ITR, georreferenciamento — outra lista
empresa em recuperação judicial  autorização do juízo
```

Apareceu uma delas? Ela vira o bloco `## Não cobre` da saída, com uma linha: o
que é, e que aqui quem monta a lista é advogado.

### 4.6 · Grava, e só então fecha

A ordem é esta, e a razão é a mesma da seção 7 do CONTRATO: primeiro o dono do
fato, depois as vistas.

1. `imoveis/<id>-<apelido>.md` — `pendências:`
2. `clientes/<id>-<apelido>.md` de quem se cobra — `## Combinado` e `## Histórico`
3. `hoje.md` — as caixas
4. `## Guardei` diz onde tudo foi parar

Os três arquivos já existem, e no `drive` atualizar reescreve o arquivo inteiro:
**leia antes de atualizar, sempre**, e devolva o texto todo com a sua linha
dentro (CONTRATO §1). Atualizar sem ler apaga o que as outras nove skills
escreveram ali.

---

## 5 · O que perguntar, quando, e com que interface

**Teto de três perguntas na execução inteira** (CONTRATO §8). Descobrir o tipo do
negócio pode custar duas; é por isso que a seção 4.1 vem antes — cada campo que a
carteira responde é uma pergunta que sobra para o que importa.

### O tipo do negócio, em duas perguntas de até três botões

Os sete tipos não cabem numa tela de escolha. Use a **UI de perguntas do
harness** — botões, com o custo escrito em cada opção, rótulo de até quatro
palavras (CONTRATO §8) — e faça em dois degraus, parando no primeiro se ele
resolver:

```
Que negócio é esse com a C-017 (Joana Ribeiro)?

  Venda      a lista mais longa · pede certidão do vendedor e do imóvel
  Locação    mais curta · a garantia decide metade da lista
  Permuta    os dois lados entregam tudo · é duas vendas amarradas
```

```
Como ela vai pagar?

  À vista       menos papel dela · tudo depende de o vendedor estar limpo
  Financiada    o banco monta o dossiê · a avaliação do imóvel entra no caminho
  Com FGTS      tem condição que derruba o uso · confiro o que o banco pede
```

E na locação:

```
Qual é a garantia?

  Fiador           a que mais demora · depende de terceiro e do cônjuge dele
  Seguro-fiança    a seguradora aprova ou não · sem recurso, e o prêmio é do inquilino
  Caução           três aluguéis no máximo · vai para poupança conjunta
```

**A escolha entre venda e locação quase nunca precisa ser feita:** o `estado:` do
imóvel já diz. Perguntar o que está escrito na carteira é o defeito mais caro do
pack.

### A terceira pergunta, se sobrar

Gaste-a no que muda a lista inteira, nesta ordem de valor:

1. qual banco — cada um pede um dossiê diferente
2. se há procuração, espólio ou usufruto — é a seção 4.5
3. quem é o proprietário, quando o arquivo do imóvel não diz

Toda pergunta traz o motivo na mesma frase (CONTRATO §8):

```
ruim   Qual é o banco?
bom    Qual banco vai financiar? Cada um pede um dossiê diferente, e pedir o
       errado faz o cliente juntar papel duas vezes.
```

### Quando NÃO perguntar

- o fato está na carteira: use, e cite de onde veio
- é regra da imobiliária que já está em `## Como eu trabalho`: siga
- é detalhe que não muda a lista: deixe `?` e siga
- em modo automático: não pergunte o tipo — leia, e se não achar, monte o tronco
  e declare (seção 2)

---

## 6 · O formato da saída

O trabalho primeiro, sozinho. Depois `## Guardei`, `## Falta saber` e — só no
automático — `## Decidi sozinho`, com estes títulos exatos e nesta ordem
(CONTRATO §10).

### O trabalho

```markdown
# Documentos — venda financiada · V-071 (casa 3 dorm, Azenha) · C-017 (Joana Ribeiro)

Ponto de partida. Banco, cartório e prefeitura mudam a exigência, e quem fecha a
lista é o correspondente do banco e o tabelião que vai lavrar.

## Peça nesta ordem
1. Matrícula atualizada do V-071 (casa 3 dorm, Azenha) — sem ela o banco não abre o processo
2. Certidões pessoais do Sr. Almeida, proprietário — é o que demora e ninguém lembra
3. Negativa de condomínio — a administradora emite, e a dívida segue o imóvel
4. Holerites e a declaração de IR da C-017 (Joana Ribeiro) — é do dia, se ela quiser

## Do comprador — C-017 (Joana Ribeiro)
- [ ] **Três últimos holerites e carteira de trabalho** · falta · ela mesma
      É do dia · sem renda comprovada o banco não abre a análise de crédito.
- [ ] **Declaração de IR completa, com o recibo de entrega** · falta · ela mesma
      É do dia, se ela tiver o arquivo · o banco recusa declaração sem recibo.
- [ ] **RG, CPF e certidão de estado civil** · ? · ela, e o marido se for casada
      A ficha não diz o estado civil, e o regime de bens muda quem assina.

## Do vendedor — Sr. Almeida, proprietário do V-071 (casa 3 dorm, Azenha)
- [ ] **Certidões pessoais: cível, fiscais, federal, trabalhista, protesto** · falta
      Cartório de distribuição e portais · é a defesa da compradora contra fraude
      à execução, e o banco confere uma por uma.
- [x] **RG e CPF** · tem · ~/carteira/_bruto/2026-08-12-ficha-8812.md

## Do imóvel — V-071 (casa 3 dorm, Azenha)
- [ ] **Matrícula atualizada, com os ônus** · falta · o proprietário pede
      Cartório de Registro de Imóveis, e o arquivo já diz qual: 3º ofício,
      matrícula 44.812 · quem dita o prazo é o cartório · sem ela não há
      financiamento nem escritura.
- [ ] **Negativa de débitos de condomínio** · falta · síndico ou administradora
      A dívida acompanha o imóvel, e é a compradora que herda.
- [x] **IPTU 2026** · tem · ~/carteira/_bruto/2026-08-14-iptu-8812.md
      Confira a data — a negativa de débito é outro papel.

## Da imobiliária — Fontes Imóveis
- [ ] **Autorização de venda assinada** · ? · o arquivo diz exclusividade até
      2026-11-30, mas não diz onde está o documento assinado.
```

Regras do bloco, e elas não variam:

- **Uma linha de marca, uma linha de razão.** A primeira diz o quê, a marca e
  quem providencia; a segunda diz quem emite, quanto costuma levar e o que trava.
  Nada de terceira linha: checklist que não cabe na tela não é lido.
- `- [x]` só para `tem`. `falta` e `?` são `- [ ]`.
- **`## Peça nesta ordem` tem no máximo cinco itens**, e é ele que vira as caixas
  do `hoje.md` (seção 7). Se a lista de pendências for maior, o que sobra fica nos
  blocos e não vai para o dia.
- Bloco sem nenhuma linha some. Bloco com tudo em `tem` fica, com as marcas — é o
  que dá ao corretor a sensação de que falta pouco, e nesse caso ela é verdadeira.
- `## Não cobre` só aparece quando a seção 4.5 apareceu.

### Para pedir, quando há a quem pedir

Uma mensagem por pessoa, no máximo duas por execução, e só quando a pendência é
dela. Formato inteiro no CONTRATO §6: linha curta com o primeiro nome, um
parágrafo de duas a três linhas, uma pergunta fácil no fim, sem assinatura, sem
emoji. **A voz é a do corretor.**

```markdown
### Para pedir — Sr. Almeida, proprietário do V-071 (casa 3 dorm, Azenha), WhatsApp
```

```
Sr. Almeida, preciso de dois papéis para a venda da Azenha.

A certidão da matrícula atualizada, que sai no registro de imóveis, e a negativa
de condomínio, que a administradora emite. O banco da compradora não abre o
processo sem os dois.

Consegue pedir os dois essa semana?
```

O bloco sai sozinho, pronto para copiar, sem comentário dentro. **A mensagem
pede, nunca promete prazo:** “consegue essa semana?” pergunta a ele; “sai em
cinco dias” promete pelo cartório, e o cartório não assinou nada.

Na carteira só tem “Sr. Almeida”? Use “Sr. Almeida” — é como ele é chamado, e
inventar o nome de batismo é inventar dado.

**O bloco tem uma segunda saída, e ela depende do conector.** Onde não há
conector — que é o caso de toda ferramenta de chat na web — existe só esta, o
bloco para copiar, e ela é o padrão. A outra é a seção 6.1.

---

## 6.1 · Quando a cobrança sai daqui

**O bloco para copiar é o padrão, e ele não muda.** É a única saída que existe
em toda ferramenta de chat na web, e é dele que a seção 6 trata. O que vem
agora é uma segunda saída, e ela só existe com `WhatsApp: sim` no `INDICE.md`
(CONTRATO §7.1). Sem conector, a skill entrega o bloco e para — e não pede
desculpa por isso.

Quem diz se ela pode oferecer o envio é a linha `envio:`, e ela não se deriva
do `modo:`:

```
envio: pergunta sempre           o padrão, e o que vale se a linha faltar
envio: responder sem perguntar   responde conversa viva direto; começar
                                 conversa ainda pergunta
envio: não                       nem ofereça — entregue o bloco
```

**Cobrança é quase sempre começar conversa**, mesmo com quem é cliente há
meses: ela reabre um assunto que parou. Só conta como resposta quando a última
palavra é dela e é sobre o documento — “peço a certidão amanhã”, e amanhã já
passou. Na dúvida, pergunta.

### Antes de enviar, leia a conversa

É a trava que mais importa aqui, e ela **não é sobre WhatsApp**: é sobre a
lista estar certa.

**Leia com `listar_mensagens` a conversa da pessoa que você vai cobrar, antes
de preparar o envio, sempre.** A carteira só sabe o que alguém anotou nela, e o
documento pode ter chegado por lá dias atrás.

Chegou, e ninguém anotou? **Não envia.** A cobrança não sai, o item não vira
caixa no `hoje.md`, e a linha vai para `## Falta saber`: a conversa tem algo
que os arquivos não têm, e quem conserta é `/corretor:organizar-carteira`, que
é a skill que traz conversa para dentro. Esta aqui não grava conversa, e a
marca **não vira `tem`** — vira `?`, porque o papel não está na carteira: está
no celular dele.

**Cobrar documento que o cliente já mandou é o erro que faz o corretor parar de
confiar na lista.** E cobrar por engano com o envio ligado é pior que cobrar
por engano no bloco para copiar: o bloco ainda passa pelos olhos dele antes de
virar mensagem; o envio já chegou do outro lado quando alguém percebe. A
leitura é o que separa os dois.

Ela vale também com `envio: responder sem perguntar`, e também com o programa
dele marcado para não perguntar mais. Não é tutela: ninguém escolheu cobrar o
que já chegou — a ferramenta recusa o que ele não pediu, nunca o que ele pediu
(CONTRATO §7.1).

### O par, e o que aparece na tela

```
preparar_envio(conversa, texto)            devolve o código da prévia
enviar_mensagem(previa, conversa, texto)   os três batendo byte a byte
```

Entre uma e outra, mostre. São três partes obrigatórias, e resumo não serve:

```
para    C-031 (Sr. Almeida), proprietário do V-071 (casa 3 dorm, Azenha) ·
        falou por último em 12/08 — a data sai do ultima_interacao
texto   o bloco INTEIRO, do jeito que vai sair. Nunca “a cobrança que montei”
saídas  Mando agora · Mudo o texto · Eu mesmo mando
```

```
Mando agora       sai do seu WhatsApp, na sua voz
Mudo o texto      me diga o que trocar
Eu mesmo mando    você copia e cola no WhatsApp
```

Quem não tem ficha aparece pelo nome e pelo imóvel que o ancora — “Sr. Almeida,
proprietário do V-071 (casa 3 dorm, Azenha)” —, e a falta da ficha já é a linha
de `## Falta saber` da seção 4.2.

“Mudo o texto” pede **prévia nova**. A de antes carimbou o texto velho, e é
esse carimbo que impede a skill de mostrar um texto e mandar outro.

**Duas pendências, duas pessoas, duas telas.** O teto continua sendo duas
mensagens por execução, e com o envio cada uma tem a sua confirmação. O
contrato permite mostrar várias e aprovar de uma vez (§7.1); aqui não se faz, e
a razão é a leitura: cada cobrança depende de uma conversa diferente, lida
agora, e aprovar as duas juntas é o jeito de a segunda passar sem ninguém ler.

A prévia vale **10 minutos** e serve **uma vez**. Ela morre se chegar mensagem
nova naquela conversa — e aqui isso não é aborrecimento: a mensagem nova pode
ser o documento chegando. Prévia morta, releia a conversa antes de preparar
outra.

Os tetos são 6 conversas por hora, 30 envios no total e 5 segundos entre dois
quaisquer, e duas cobranças por execução quase nunca esbarram neles. Esbarrou:
diga o número e como mudá-lo, e entregue o bloco para copiar. Recusa que não
diz o número está impedindo em vez de informar.

**O documento não sai por aqui.** A ponte não manda anexo, foto nem áudio. O
que sai é o texto da seção 6, que pede e não promete prazo de cartório, de
banco nem de prefeitura.

---

## 7 · O que gravar, onde, com que procedência

### No arquivo do imóvel — `imoveis/<id>-<apelido>.md`, o dono

Uma linha, dentro de `## Documentos`, e só ela:

```markdown
## Documentos
matrícula: 44.812, 3º Registro de Imóveis de Porto Alegre  ← corretor, 2026-08-12
conferida: não
pendências: certidão da matrícula, negativa de condomínio  ← corretor, 2026-08-19
```

**Só entra em `pendências:` o que o corretor confirmou que falta**, ou o que a
carteira já dizia com `?`. O que a skill apenas supõe fica no bloco da saída e em
`## Falta saber` — pendência escrita no arquivo dono é fato, e fato inventado
volta na cara de todo mundo três semanas depois (CONTRATO §3, regra 2).

Nomes curtos, separados por vírgula. A explicação de cada documento não entra:
ela é derivável, e o arquivo do imóvel tem teto de 40 linhas.

`conferida:` **não se mexe.** Quem escreve ali é `/corretor:conferir-matricula`.

### No arquivo do cliente de quem se cobra

```markdown
## Combinado
- pedi a certidão da matrícula e a negativa de condomínio do V-071 (casa 3 dorm, Azenha) em 2026-08-19  ← corretor, 2026-08-19

## Histórico
- 2026-08-19 lista de documentos da venda financiada, dois pedidos
```

É daqui que a próxima execução sabe que já foi pedido — e é o que faz a caixa
mudar de `## Vence hoje` para `## Prometido e não chegou` quando o prazo passar.

**Saiu pelo conector?** Isso é fato com hora, e a linha diz: `mandei pelo
WhatsApp` no fim, antes da procedência. “Eu mesmo mando” não vira isso —
ninguém sabe se ele colou —, e a linha fica como sempre foi.

Não existe ficha do proprietário? **Não abra uma.** Deixe a linha em
`## Falta saber` e siga.

### No `hoje.md`

As caixas de `## Peça nesta ordem`, com o **nome de quem tem que entregar** e o
motivo curto:

```markdown
## Vence hoje
- [ ] Pedir a certidão da matrícula do V-071 (casa 3 dorm, Azenha) ao C-031 (Sr. Almeida), proprietário — o banco não abre o processo sem ela
- [ ] Pedir a negativa de condomínio do V-071 (casa 3 dorm, Azenha) à administradora — a dívida acompanha o imóvel

## Prometido e não chegou
- [ ] C-031 (Sr. Almeida) — ia mandar o IPTU do V-071 (casa 3 dorm, Azenha) em 2026-08-13, seis dias
```

Quatro regras ao escrever no `hoje.md`:

- **Documento já pedido vai para `## Prometido e não chegou`**, com a data em que
  foi prometido e quantos dias faz. O que ainda não foi pedido vai para
  `## Vence hoje`.
- **Documento cuja falta trava algo com data marcada** vai para `## Travado`, com
  a data do que trava: “a proposta é sexta”.
- **Teto de 15 caixas** no arquivo (CONTRATO §9). Confira **antes** de escrever.
  Não cabe? Entram só as do primeiro degrau da ordem — o que derruba o negócio —
  e a saída diz, em uma linha, quais ficaram de fora e onde elas estão.
- **Não reescreva o `hoje.md`.** Ele é vista de `/corretor:o-que-fazer-hoje`.
  Acrescente as caixas nas seções que já existem, não mexa no título nem na data,
  não reordene nada, e nunca apague caixa de outra skill. No `drive`, gravar é
  devolver o arquivo inteiro — devolvê-lo como estava, com as caixas novas
  dentro, não é reescrever. `hoje.md` não existe? Não crie: diga em
  `## Falta saber` que `/corretor:o-que-fazer-hoje` monta.

### E o fecho

```markdown
## Guardei
- ~/carteira/imoveis/V-071-casa-3d-azenha.md — `pendências:` com os dois que faltam
- ~/carteira/clientes/C-031-sr-almeida.md — `## Combinado` e `## Histórico`, o que pedi hoje
- ~/carteira/hoje.md — duas caixas em `## Vence hoje`

## Falta saber
- se a construção do V-071 (casa 3 dorm, Azenha) está averbada na matrícula — só a certidão diz, e ela não chegou
- qual banco vai financiar para a C-017 (Joana Ribeiro) — cada um pede um dossiê diferente
- o estado civil da C-017 (Joana Ribeiro) — o regime de bens decide quem assina a escritura

## Decidi sozinho
- Montei como venda financiada porque a ficha da C-017 (Joana Ribeiro) diz “pagamento: financiamento, aprovação ainda não saiu”. Se ela passou para à vista, me diga e eu troco a lista.
- Deixei o dossiê do banco genérico porque nenhum arquivo diz qual é o banco. Me diga o nome e eu ajusto o que muda.
```

O exemplo está no `local`. No `drive`, o mesmo lugar se escreve com a pasta e o
nome do arquivo — `imoveis/V-071-casa-3d-azenha.md, na pasta carteira do seu
Drive` —, e vale igual para o ONDE das linhas `tem` do checklist. O corretor
precisa saber onde a coisa foi parar, e o transporte é o dele.

---

## 8 · Onde ela para

A lista é ponto de partida, e isto não é modéstia: é a primeira linha da saída,
escrita para o corretor ler antes de repassar qualquer coisa ao cliente.

**1 · A exigência muda de banco, de cartório, de prefeitura e de estado.** O
mesmo financiamento em dois bancos pede dossiês diferentes. A validade que uma
certidão precisa ter quando chega na mesa é regra de quem recebe, não da skill. O
ITBI é municipal: alíquota, base de cálculo e quem paga mudam de cidade para
cidade, e a permuta é onde mais mudam. **A skill nunca escreve alíquota, teto de
valor ou limite de renda** — esses números envelhecem dentro do arquivo, e o
corretor repassa o velho.

**2 · Ela marca presença, não validade.** `tem` quer dizer “está na carteira”,
nunca “serve”. A matrícula de dois anos atrás está lá e não serve; a certidão do
cônjuge errado está lá e não serve. **Ela não diz que um documento está em
ordem** — é proibição escrita (CONTRATO §10). Ler a matrícula é
`/corretor:conferir-matricula`, e nem aquela aprova: quem conclui é gente.

**3 · Ela não promete prazo.** Cartório, banco, prefeitura, seguradora e síndico
ditam os próprios prazos, e a skill não tem como saber o de nenhum deles. Os
prazos que ela escreve são forma — “costuma sair em poucos dias úteis” —, nunca
data, e **nunca entram na mensagem para o cliente**. Dizer “sai quinta” e o
cartório levar três semanas custa a confiança do cliente no corretor, não no
cartório.

**4 · Documento em `_bruto/` sem data declarada é `tem` com ressalva.** A pasta
guarda a origem, não a validade, e `_bruto/` **não se edita nem se apaga**
(CONTRATO §4.7). Se o corretor disser que o que está lá está errado, o certo vai
para o arquivo dono com `← corretor, <data>`; o bruto fica como estava.

**5 · Ela não sabe o que a imobiliária dele exige.** Renda de três vezes o
aluguel, fiador com imóvel na mesma cidade, dois fiadores em vez de um: isso muda
de imobiliária para imobiliária, e não está em lei nenhuma. Se
`## Como eu trabalho` não disser, fica `?` — nunca o número que costuma se ver.

**6 · Ela não fecha a lista quando já há advogado, despachante ou correspondente
bancário no negócio.** Nesse caso a lista que vale é a deles, e esta serve para
chegar na reunião com a papelada junta, em vez de sair de lá com uma folha de
tarefas.

**7 · Os seis casos da seção 4.5 saem da lista comum.** Espólio, imóvel de menor
ou interditado, usufruto, vendedor pessoa jurídica, imóvel rural, empresa em
recuperação. A skill nomeia o caso e para — completar a lista de um espólio de
memória é o jeito mais rápido de fazer o corretor perder três semanas no
cartório.

**8 · Ela não julga o negócio.** Não decide preço, não diz se aceita a proposta,
não opina se o comprador é bom pagador, não avalia se o fiador é suficiente, e
não sugere pular documento para andar mais rápido. Quando a saída não sai, ela
diz em uma linha o que não deu e qual é o caminho (CONTRATO §10).

**9 · O que ela não apurou entra como `?`.** Metragem, valor, prazo, banco, nome
de gente, número de matrícula: `?` sempre bate palpite, e o `?` é o que a próxima
execução vai atacar.

**10 · Ela não cobra sem ler a conversa, e não manda documento.** Com o envio
ligado, a conversa de quem vai ser cobrado é lida antes, e cobrança que já
chegou não sai (seção 6.1). A ponte não manda anexo. E quem não tem conector
recebe o bloco para copiar, que é o padrão — não é consolo.

A língua e o fecho são os do CONTRATO §10, e não se reescrevem aqui.
