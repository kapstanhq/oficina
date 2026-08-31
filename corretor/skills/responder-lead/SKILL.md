---
name: responder-lead
description: >-
  Escreve a resposta pronta para o lead que chegou. O corretor cola a conversa
  ou o e-mail do portal, e ela devolve a mensagem para copiar, os imóveis da
  carteira que batem com o que o lead pediu — sempre com id e apelido, V-071
  (casa 3 dorm, Azenha) — e a lista do que ainda falta saber. Grava o material
  colado em `_bruto/` e o lead em `clientes/`, com a procedência de cada campo.
  Não manda a mensagem, não cria imóvel que não está na carteira, e não inventa
  preço, metragem, prazo nem nome de gente. Use quando chega contato novo pelo
  Zap, VivaReal, WhatsApp, Instagram ou site da imobiliária, e quando quem já
  está na carteira manda mensagem nova: “chegou um lead agora”, “colei a
  conversa aqui, o que eu respondo?”, “o que eu mando pra ela?”, “entrou um
  contato pelo Zap perguntando o preço da casa da Azenha”, “tem gente
  perguntando do apartamento do Menino Deus”. Não é para quem sumiu há semanas
  (/corretor:retomar-contato) nem para ordenar os imóveis de uma visita já
  marcada (/corretor:montar-visita).
license: MIT
compatibility: >-
  Funciona inteira com a carteira acessível, no computador ou no Google Drive
  pelo conector — o transporte sai da linha `carteira:` do `INDICE.md`. Sem
  carteira, ainda escreve a mensagem a partir da conversa colada, mas não cruza
  com os imóveis, não abre ficha de cliente e não grava nada: o `## Guardei`
  vira “nada foi gravado — você está sem carteira aqui”. Não manda mensagem: o
  conector de WhatsApp, onde existe, só lê — quem aperta enviar é o corretor.
allowed-tools: Read Glob Grep Write Edit
---

# Responder o lead que chegou

## 1 · O que ela faz, e o que não faz

Ela lê o que o corretor colou, cruza o que o lead pediu com os imóveis da
carteira, e devolve três coisas: a mensagem pronta para copiar, o que ainda não
se sabe sobre ele, e o lead gravado como cliente em `clientes/`, na carteira.

Ela **não manda** a mensagem, não cria imóvel que não está na carteira, não
marca visita em agenda nenhuma e não inventa preço, metragem, prazo nem nome —
o que não apurou sai como `?`, que é o que a próxima execução vai perguntar.

## 2 · Antes de tudo

1. **Leia `references/CONTRATO.md`, inteiro, antes de escrever uma
   linha.** Ele é a lei do pack e tem os formatos literais. As seções que mais
   pesam aqui: **1** (onde a carteira mora, e os dois transportes), **2** (id e
   apelido), **3** (as três regras), **4.5** (o arquivo
   de cliente), **4.7** (`_bruto/`), **6** (o que sai para o WhatsApp), **7**
   (como ler uma conversa colada), **8** (a ordem de busca) e **10** (como se
   termina). Nada do que está lá se reescreve aqui: divergiu, o contrato vence.
2. **Leia o `INDICE.md` da carteira**, pela primeira leitura da seção 1 do
   contrato: a linha `carteira:` diz o transporte, e toda leitura e toda
   gravação desta execução vão por ele. É de lá que saem também o nome do
   corretor — o que diz quem é ele na conversa colada —, o modo, o canal padrão,
   os portais e o horário de visita que ele costuma oferecer. E a linha
   `WhatsApp:` de `## O que está conectado`: em `sim`, a conversa pode vir sem
   ele colar nada (passo 4.1). Em `não`, ou ausente, é colado — o normal.
3. **Não achou `INDICE.md` em lugar nenhum?** Diga isso em uma linha, sem
   improvisar pasta nem criar carteira:

   > Não achei a sua carteira. Rode `/corretor:comecar` — ele monta
   > com você e volta aqui com esse lead.

   E então **escreva a mensagem assim mesmo**, da conversa colada (contrato
   §11): o que se perde é cruzar com os imóveis da carteira e abrir a ficha do
   cliente, não a resposta. Nada é gravado, e o fecho diz isso — o `## Guardei`
   vira uma linha só: `- nada foi gravado — você está sem carteira aqui`.

No `local`, caminho de ferramenta é sempre **absoluto** e, ao falar com o
corretor, escreve-se `~/carteira/…`. No `drive` não existe caminho: a busca é
sempre presa à pasta, e ao corretor se diz “a pasta `carteira` do seu Drive”
(contrato, seção 1).

**Por que ela tem `Write` e `Edit`:** o lead só vale se sobreviver à semana. Ela
grava o material colado em `_bruto/` e abre ou atualiza a ficha do cliente —
sem isso, o trabalho vira uma mensagem bonita que ninguém acha depois. `Write`
só para arquivo que **não existe** (o bruto novo, a ficha nova); `Edit` para
tudo que já existe. **Nunca reescreva com `Write` um arquivo que já tem
conteúdo** — trocar uma linha reescrevendo cinquenta perde quarenta e nove.

No `drive` os verbos são os do conector: criar arquivo para o que não existe,
atualizar arquivo para o que já existe. E **atualizar reescreve o arquivo
inteiro, então leia antes de atualizar, sempre** (contrato, seção 1) — atualizar
sem ler apaga o que as outras skills escreveram na ficha.

## 3 · O modo

Leia a linha `modo:` do `INDICE.md`. `automatico` e `automático` valem;
qualquer outro valor, linha ausente ou arquivo ilegível: **copiloto**. Nunca se
deduz automático por pressa nem porque a resposta parece óbvia.

Esta skill **não tem exceção de modo** — a única do pack é
`/corretor:conferir-matricula`.

| a bifurcação | copiloto | automático |
|---|---|---|
| a conversa cita imóvel que não está na carteira | pergunta o link, uma vez | deixa de fora, e o imóvel vira uma linha em `## Falta saber` |
| nenhum imóvel da carteira bate | pergunta antes de mandar qualquer coisa | não manda link nenhum, e a mensagem só pergunta |
| ele prometeu algo e não mandou | pergunta se cobra na mesma mensagem | não cobra junto — a mensagem fica com uma pergunta só |
| ele já está na carteira e o fato novo contradiz o gravado | mostra os dois e pergunta qual vale | o mais novo vale, e o antigo vira linha do `## Histórico` |

Em copiloto, **antes de parar, entregue o que já ficou pronto**: o bruto
gravado e a ficha aberta valem mesmo sem a resposta da pergunta.

Em automático, toda escolha dessas vira uma linha em `## Decidi sozinho` — o
que fiz, por que, como desfazer.

## 4 · O passo a passo

Isto é tarefa de três ou mais passos demorados — grava arquivo, lê a carteira
inteira, escreve em quatro ou cinco arquivos. **Mostre o TODO na tela** e vá
marcando.

### 4.1 · Grava o bruto, primeiro de tudo

**De onde vem a conversa.** Colou alguma coisa? É ela, e ponto — o que o
corretor traz na mão sempre vence. Não colou nada e disse um nome ("responde a
Joana"), com `WhatsApp: sim` no `INDICE.md`? Aí você pode buscar: ache a
conversa pelo telefone do arquivo do cliente, ou pelo nome, e leia as últimas
mensagens. **Mostre o que achou e confirme que é essa pessoa antes de
escrever** — nome parecido é comum, e responder ao cliente errado é o tipo de
erro que não tem desfazer.

Sem conector e sem nada colado, é uma pergunta só: peça a conversa.

O que veio do conector vira `_bruto/` do mesmo jeito que o colado: mesmo nome
de arquivo, mesmo cabeçalho, mesma procedência (contrato, seção 7). **O caminho
muda, o formato não** — nada em `clientes/` deve deixar rastro de por onde a
conversa entrou.

Agora grave, antes de extrair um fato sequer. Nome, cabeçalho de três linhas e
o texto sem tocar: contrato, seção 4.7. Se algo der errado no meio, o material
do corretor já está salvo. **`_bruto/` não se corrige, não se resume e não se
apaga.**

### 4.2 · Lê a conversa

Os dois formatos exportados, a data em dd/mm/aaaa, o ano de dois dígitos que é
2026, e quem é o corretor na conversa: contrato, seção 7. `<Mídia oculta>`,
mensagem apagada, áudio e figurinha viram **buraco declarado**, nunca palpite.

E-mail de portal é texto solto: o conteúdo é fato do que está escrito, o autor
não se adivinha, e o telefone que o portal mascarou fica `?` com a razão na
seta — `telefone: ?  ← o e-mail do portal veio com o número mascarado`.

### 4.3 · Acha o cliente, ou abre a ficha

Procure no `_indice.md` de `clientes/` pelo primeiro nome **e** pelo
telefone — a busca é presa a essa pasta, porque `_indice.md` existe duas vezes
na carteira. Achou, é ele: a ficha existente é a que se atualiza. Não achou,
**liste a pasta antes de concluir que ele não existe** (contrato, seção 1):
busca vazia prova que a busca voltou vazia. Aí sim é lead novo, e o id é o maior
do `_indice.md` — contando `## Arquivo morto` — mais um. **Id não se
reaproveita.**

Dois clientes com o mesmo primeiro nome e telefones diferentes: mostre os dois,
com id e apelido, e pergunte qual é. **Ficha não se funde por conta própria.**

**Sem nome, a ficha não abre.** O apelido do cliente é nome e sobrenome como
ele se apresentou (seção 2), e a primeira linha da mensagem precisa do primeiro
nome (seção 6): o nome é carga dupla. O bruto entra do mesmo jeito; a ficha
espera uma pergunta.

### 4.4 · Extrai o que ele pediu

Para a ficha do cliente, em `## O que procura`: faixa, bairros, o que precisa
ter, o que não aceita, prazo, pagamento, quem decide junto. Cada um com
`← _bruto/<o arquivo que você acabou de gravar>`, ou `?` se ele não disse.

**Fato é o que está escrito.** “Dá sábado, mas tem que ser cedo” é uma linha de
`## Combinado`, não `visita marcada às 9h`.

### 4.5 · Cruza com os imóveis da carteira

Leia o `_indice.md` de `imoveis/` e abra só os candidatos.

```
entra       estado à venda ou para alugar, conforme o que ele procura
não entra   reservado, vendido, alugado, fora do mercado — nem “só para ver”
não entra   o que ele já descartou (## Imóveis mostrados dele, ## Mostrado a do imóvel)
```

Ordem da volta: primeiro o que bate em faixa, bairro e o que ele precisa ter;
depois o que bate em quase tudo — e aí a linha diz **o que falta, com número**:
“está R$ 40.000 acima da faixa dele”, “tem 2 dormitórios, ele pediu 3”. No
máximo três imóveis, sempre com id e apelido.

`faixa: ?` na ficha? Cruze pelo resto e diga que a faixa é o que falta — não
estime uma.

**Um link por mensagem** (seção 6), então **um imóvel vai na mensagem**. Os
outros ficam listados fora do bloco, para o corretor mandar em seguida.

### 4.6 · Escreve a mensagem

Formato, tamanho e o que não entra: contrato, seção 6 — e a voz é a do
corretor, com o nome dele. **A Kapstan não aparece, não assina, não é citada.**

Três coisas que esta skill decide dentro daquele formato:

- **Ele perguntou o preço? A resposta traz o preço**, e o preço vem do arquivo
  do imóvel, com o valor que está lá. Não do que a conversa dizia em junho.
- **A pergunta do fim é a que faz ele responder sim** — de preferência a visita,
  com o horário que está em `## Como eu trabalho` do `INDICE.md`. Isso já está
  decidido: não se pergunta de novo.
- **Uma pergunta só.** O que mais falta saber vai para `## Falta saber` e espera
  a próxima mensagem.

### 4.7 · Grava, e só então fecha

A seção 7 daqui diz o quê e onde. Confira os tetos **ao gravar**: ficha de
cliente, 60 linhas; imóvel, 40.

## 5 · O que perguntar, quando, e com que interface

Desça a ordem de busca dos sete degraus (contrato, seção 8) antes de abrir a
boca: INDICE, `_indice` do tema, arquivo, `_bruto/`, link, **então** pergunta, e
por último pede o documento. Perguntar o que já está escrito na carteira é o
defeito mais caro do pack.

**Uma pergunta por vez, no máximo três na execução inteira**, cada uma com o
motivo na mesma frase. As três que costumam valer o gasto aqui, nesta ordem:

1. o nome, quando o lead chegou sem ele
2. a faixa de preço, quando ele não disse — sem ela não dá para escolher imóvel
3. o link do imóvel que ele citou e não está na carteira

Escolha entre dois e quatro caminhos usa a **UI de perguntas do harness**, com
botões, e cada opção declara o custo. Rótulo de até quatro palavras:

```
O Rafael perguntou de um imóvel que não está na sua carteira.

  Colo o link agora    entra com preço e metragem de verdade · 1 minuto seu
  Respondo sem ele     a mensagem sai sem link e sem preço · pronto agora
  Deixo de fora        respondo só com o que já está na carteira · pronto agora
```

```
Nenhum dos seus imóveis bate com o que ele pediu (3 dorm até R$ 400.000, Menino Deus).

  Mando o mais perto   V-052 (apto 3 dorm, Cidade Baixa), R$ 80.000 acima · ele pode achar caro
  Só pergunto          abro a faixa e o bairro antes de mandar · hoje vai sem link
```

## 6 · O formato da saída

Os títulos são exatamente estes e nesta ordem (contrato, seção 10). O bloco vem
primeiro, sozinho, **sem comentário dentro dele**.

```
Rafael, a casa da Azenha está disponível, sim.

São 3 dormitórios e 120 m², com pátio nos fundos que pega o sol da tarde
inteira. Fica a duas quadras do Colégio Rosário, dentro da faixa que você falou.

https://fontesimoveis.com.br/imovel/8812

Consigo te mostrar sábado de manhã. Prefere 10h ou 11h?
```

Bate em parte, se ele abrir o bairro — mande em outra mensagem, porque um link
por mensagem é o que faz a foto aparecer:

- V-052 (apto 3 dorm, Cidade Baixa) · R$ 480.000 · é apto, não casa, e fica
  fora dos dois bairros que ele pediu

Peça e eu escrevo a mensagem desse também.

```markdown
## Guardei
- ~/carteira/_bruto/2026-08-19-whatsapp-rafael.md — a conversa, como veio
- ~/carteira/clientes/C-032-rafael-prado.md — criado, etapa novo lead
- ~/carteira/clientes/_indice.md — uma linha nova
- ~/carteira/funil.md — C-032 (Rafael Prado) em novo lead
- ~/carteira/imoveis/V-071-casa-3d-azenha.md — uma linha em Mostrado a
- ~/carteira/INDICE.md — clientes ativos, 21 para 22

## Falta saber
- telefone do C-032 (Rafael Prado) — a conversa exportada não traz o número, e é
  por ele que a ficha acha o cliente da próxima vez
- prazo, pagamento e quem decide junto do C-032 (Rafael Prado) — ficaram em ?
- tem uma mídia oculta às 9h15 na conversa. Se era foto do que ele procura, me
  diga o que aparecia
- A próxima pergunta, quando ele responder: se a compra é financiada. É o que
  muda o que dá para mostrar, e a faixa ele já disse.
```

Aqueles caminhos são a forma do `local`. No `drive` a mesma lista nomeia a pasta
dentro da carteira — `clientes/C-032-rafael-prado.md, na pasta carteira do seu
Drive — criado` —, porque lá não existe caminho.

`## Decidi sozinho` só aparece em modo automático, e só se houve escolha — uma
linha por escolha, no formato da seção 5 do contrato.

**Uma pergunta sugerida, nunca três.** A lista de `?` é a lista de `?`; a
pergunta da próxima mensagem é uma, e é a que mais muda o que se manda.

## 7 · O que gravar, onde, com que procedência

Os lugares da tabela estão escritos na forma do `local`; no `drive` são as
mesmas pastas dentro da pasta `carteira` do Drive dele, com os verbos do
conector (contrato, seção 1).

| o que | onde | como |
|---|---|---|
| o que ele colou | `~/carteira/_bruto/AAAA-MM-DD-<canal>-<apelido-curto>.md` | seção 4.7 · arquivo novo · nunca mais se toca |
| lead novo | `~/carteira/clientes/C-0NN-nome-sobrenome.md` | do modelo `references/modelos/cliente.md`, **com os comentários `<!-- MODELO · … -->` apagados** |
| lead que já existe | a ficha dele | campo por campo, no arquivo que já existe |
| o imóvel que foi na mensagem | `## Mostrado a` do arquivo do imóvel | uma linha |
| a lista | `~/carteira/clientes/_indice.md` | linha nova, ou o último contato de hoje |
| a etapa | `~/carteira/funil.md` | só se ela mudou |
| a conta | `~/carteira/INDICE.md` | `clientes ativos:` e `atualizado:`, se entrou cliente |

`hoje.md` **não se escreve aqui** — quem o reescreve é
`/corretor:o-que-fazer-hoje`. O que ele prometeu mandar vai para `## Combinado`
da ficha dele, e é de lá que o `hoje.md` sai.

### A procedência de cada campo

Tudo que veio do material colado leva `← _bruto/<aquele arquivo>`. O que o
corretor disse agora, na conversa com a skill, leva `← corretor, <hoje>`. Não há
outras origens (contrato, seção 3).

### `canal:` e `origem:` não são a mesma coisa

`canal:` é onde ele escreveu e por onde a resposta vai — WhatsApp, e-mail ou
telefone. O portal em que ele viu o anúncio é `origem:`, junto com o imóvel:
`origem: anúncio do V-071 (casa 3 dorm, Azenha) no Zap`. Lead de portal com
telefone se responde no WhatsApp; diga isso em uma linha, fora do bloco.

### `etapa:` segue a conversa, não a mensagem que você escreveu

A etapa mora na ficha do cliente e o `funil.md` só reflete (contrato, 4.3 e
4.5). As seis são fixas, e **esta skill não cria etapa nenhuma.**

```
só a primeira mensagem dele, sem resposta ainda     novo lead
já teve ida e volta na conversa colada              em conversa
dia e hora combinados DENTRO da conversa            visita marcada
```

A mensagem que a skill acabou de escrever **não muda etapa**: ela ainda não foi
mandada. Propor o sábado não é `visita marcada`.

### A linha do imóvel, e por que ela diz isso

Em `## Mostrado a` do imóvel e em `## Imóveis mostrados` do cliente — e só
depois que ele disser que mandou. Enquanto não disser, a mensagem escrita é uma
linha no `## Histórico` do cliente, porque envio é fato e fato não se presume:

```
- C-032 (Rafael Prado) · enviado 2026-08-19
```

O envio é do corretor, então gravar `enviado` seria gravar um fato que não
aconteceu. Mas não gravar nada faz a próxima skill oferecer o mesmo imóvel de
novo. A linha fecha quando ele confirmar, ou quando a próxima conversa colada
mostrar o cliente respondendo.

## 8 · Onde ela para

- **Site que monta a página por JavaScript devolve nada.** Diga na cara — “esse
  site não abre para mim” — e peça a ficha colada. **Preço, metragem e
  dormitórios não se chutam**, nem para ilustrar: o corretor repassa no
  WhatsApp e descobre na visita.
- **Áudio não se transcreve de ouvido**, e mensagem apagada não se reconstitui.
  Vira buraco declarado e, se estava no meio do que importa, vira a pergunta.
- **Não sabe quem é o corretor na conversa?** Se nenhum remetente bate com
  `nome:` do `INDICE.md`, pergunte uma vez qual dos dois é ele. **Nunca deduza
  pelo tom** — o risco é gravar a fala do cliente como promessa do corretor.
- **Imóvel citado que não está na carteira não entra com o que a conversa diz.**
  Pede-se o link, uma vez. Sem link e sem ficha, ele fica de fora e vira linha
  do `## Falta saber`.
- **Ela não manda a mensagem.** O conector de WhatsApp, onde existe, só LÊ — e
  isso não é limitação técnica: a mensagem sai na voz do corretor, e disparo
  automático é onde uma conta de WhatsApp morre. Quem aperta enviar é ele.
- **Ela não marca visita em agenda nenhuma.** Propõe o horário que está no
  `INDICE.md` e para aí.
- **Ela não decide preço, não avalia proposta e não diz se um documento está em
  ordem.** Lead que já visitou e quer propor: responda e leve para o corretor.
  Documento é `/corretor:conferir-matricula` e
  `/corretor:documentos-do-negocio`.
- **Ela não promete prazo de financiamento, de cartório ou de prefeitura.** “A
  aprovação sai em cinco dias” não sai da boca dela.
- **Lead que sumiu há semanas não é assunto dela** — é
  `/corretor:retomar-contato`. Aqui é a mensagem que chegou agora.
- **Conversa de meses:** ela lê tudo, mas grava fato corrente. O histórico
  antigo condensa pela seção 9 do contrato; fato corrente nunca é cortado para
  caber.
- **Nada se apaga.** Nem ficha, nem `_bruto/`, nem linha de histórico.
  Contradição entre o que está gravado e o que ele disse hoje se resolve com o
  valor novo e a procedência nova — o antigo desce para o `## Histórico`.

Quando não der para fazer algo, diga em uma linha o que não deu e qual é o
caminho. Sem pedir desculpa duas vezes, e sem sumir do assunto.
