---
name: anunciar-imovel
description: >-
  Escreve o anúncio de um imóvel a partir do link da página da imobiliária, de
  uma ficha colada ou do que já está na carteira, e devolve duas versões prontas
  para publicar — uma longa para portal, com os campos que ele cobra, e uma
  curta para WhatsApp e redes. Grava o imóvel na carteira com o link e a
  procedência de cada dado, e não inventa dado de imóvel — o que não apurou sai
  como ? e vira pergunta. Use quando o corretor cola o link de um imóvel e pede
  o texto, ou diz — escreve o anúncio dessa casa, faz a descrição desse
  apartamento, monta o texto pro Zap, preciso de um anúncio pro VivaReal,
  reescreve esse anúncio que está ruim, faz uma versão curta pra mandar no
  WhatsApp, cadastra esse imóvel na carteira, anuncia o apto do Menino Deus.
  Também quando o site não abriu e ele traz a ficha colada. Não é ela que
  confere matrícula (/corretor:conferir-matricula), responde cliente
  (/corretor:responder-lead) nem escreve o roteiro do vídeo
  (/corretor:gravar-video-do-imovel).
license: MIT
compatibility: >-
  Precisa da carteira do corretor, numa pasta do computador — o transporte
  sai da linha carteira: do INDICE.md. Sem carteira, ela ainda
  escreve as duas versões do anúncio a partir do link ou da ficha colada, e não
  grava nada: o fecho diz isso em uma linha. Abrir o link precisa de ferramenta
  de web; sem ela, o caminho é a ficha colada.
allowed-tools: Read Glob Grep Write Edit
---

# Anunciar imóvel

Ela transforma um link — ou uma ficha colada — em duas versões do anúncio,
portal e WhatsApp, e grava o imóvel na carteira com a procedência de cada dado.
Ela **não** publica em portal nenhum, não decide preço, não descreve foto e não
inventa dado de imóvel.

---

## 1 · Antes de tudo

Leia, nesta ordem:

1. O contrato é a lei do pack, e está partido por seção em
   `references/contrato/`. Leia estas, antes de escrever uma linha:
   `01-0-onde-a-carteira-mora.md` (os dois transportes),
   `02-0-id-e-apelido.md`, `04-4-arquivo-de-imovel.md`, `04-6-os-dois-indices.md`,
   `04-7-o-bruto.md`, `06-0-o-que-sai.md` (o que sai para o WhatsApp),
   `08-0-quando-perguntar.md` e `10-0-comeca-e-termina.md`. O inteiro está em
   `references/CONTRATO.md`, para quando uma seção citar outra. O que está
   escrito lá vale aqui; nenhum formato é reescrito neste arquivo.
2. o `INDICE.md` da carteira — a primeira leitura do contrato §1 acha o arquivo,
   e a linha `carteira:` dele diz o transporte, que vale para toda leitura e
   toda gravação desta execução. De lá saem também quem ele é, a voz, o CRECI, a
   região, os portais onde anuncia e o horário de visita que costuma oferecer.

**A carteira não existe?** Sem `INDICE.md` em lugar nenhum — nem no computador,
nem no Drive —, faça uma coisa só, em uma linha: diga que a carteira ainda não
existe e mande rodar `/corretor:comecar`. Não crie pasta, não trabalhe sem ela,
não improvise em outro lugar. Se ele insistir em ver o texto agora, escreva o
anúncio e feche com a linha do contrato §11: `- nada foi gravado — você está sem
carteira aqui`.

A carteira é uma pasta no computador ou uma pasta no Google Drive, e é o
`INDICE.md` que diz qual. No `local`, toda chamada de ferramenta leva caminho
absoluto (`C:\Users\<nome>\carteira\…` ou `/Users/<nome>/carteira/…`); no
`drive` não há caminho — acha-se a pasta `carteira`, depois a pasta de dentro
dela, e **a busca é sempre presa à pasta**, porque `_indice.md` existe duas
vezes. Ao falar com o corretor, `~/carteira/…` no `local` e “a pasta `carteira`
do seu Drive” no `drive`.

### As ferramentas, e por que ela tem cada uma

- **Read, Glob, Grep** — uma execução lê de quatro a seis arquivos da carteira:
  o INDICE, o `_indice.md`, o arquivo do imóvel, o bruto. Pedir permissão em
  cada leitura torna a skill insuportável, e é a leitura que evita a pergunta
  repetida.
- **Write, Edit** — ela é a porta de entrada do imóvel na carteira. Sem escrever
  ela devolveria texto e deixaria o corretor digitando a ficha, que é
  exatamente o trabalho que ela existe para tirar. São dois arquivos criados (o
  bruto e o imóvel) e dois editados (`imoveis/_indice.md` e `INDICE.md`) — e
  nenhum outro. No `drive` os verbos são os do conector, e editar vira atualizar
  o arquivo inteiro: **leia antes de atualizar, sempre** (contrato §1).
- **Abrir o link é com a ferramenta de web do harness, que NÃO está na lista.**
  Buscar um endereço na internet vale um pedido de permissão, e o corretor vê
  qual endereço é antes de aprovar. Não há ferramenta de web no ambiente? Isso é
  o degrau 5 fechado — vá para a seção 7.

---

## 2 · O modo

Leia a linha `modo:` do `INDICE.md`. `automatico` e `automático` valem;
qualquer outro valor, linha ausente ou arquivo ilegível: **copiloto**.

**Copiloto.** Para nas bifurcações — o tamanho do anúncio, o ângulo, o que só
ele sabe — e entrega o que já ficou pronto antes de parar. Nunca para de mãos
vazias: o portal com três `?` já é útil.

**Automático.** Escolhe e segue, e fecha com `## Decidi sozinho` (contrato §5).
Ele escolhe sozinho o ângulo do texto, qual defeito entra na descrição, o
apelido, o id, e escrever as duas versões em vez de perguntar qual. Ele **não**
escolhe preencher fato que não apurou — `?` continua `?` no automático — nem o
preço, nunca.

---

## 3 · O passo a passo

Mostre o TODO na tela: são três ou mais passos demorados — abrir link, ler a
carteira, escrever quatro arquivos. Os passos são estes.

**1 · Reconheça a entrada.** São quatro, e mudam tudo o que vem depois:

```
link                      o caso comum · degrau 5 da ordem de busca
ficha ou texto colado     o site não abriu, ou ele colou o anúncio antigo
imóvel já na carteira     o arquivo é o dono do fato · não abra nada
nada                      pergunte o link, uma vez. É a única coisa que falta
```

**2 · Já está na carteira?** Antes de criar qualquer coisa, procure na pasta
`imoveis/` da carteira por um pedaço literal e estável da URL — o número da
ficha, `8812` por exemplo —, não pela URL inteira, porque ponto e barra são
metacaracteres na busca. Achou: **é atualização, não item novo.** Um segundo id
para o mesmo imóvel é o defeito que o contrato §9 manda parar e perguntar.
Confira também bairro mais dormitórios mais preço: bateu tudo e o link é outro,
pare, mostre os dois e pergunte qual fica.

**3 · Abra o link.** Voltou nada, ou só menu e rodapé — sem preço, sem metragem,
sem bairro? Trate como se não tivesse aberto: seção 7. Voltou conteúdo: siga.

**4 · Escolha o id e o apelido ANTES de gravar o bruto.** Ler o `_indice.md` é
leitura, e o cabeçalho do bruto leva `sobre: V-071 (casa 3 dorm, Azenha)` — como
`_bruto/` nunca se edita depois, o id tem de estar decidido antes de a primeira
linha ser escrita. As regras estão no contrato §2; o número é o maior já usado
**mais um, por prefixo**, contando o arquivo morto. Olhe os três lugares, porque
a vista pode estar atrasada e o arquivo vence:

```
imoveis/_indice.md          a tabela e o ## Arquivo morto
imoveis/                    os nomes dos arquivos
arquivo-morto/imoveis/      idem
```

Três pastas da carteira, listadas pelo transporte que o `INDICE.md` disse.

**5 · Grave o bruto, e só então extraia.** Nada da carteira é escrito antes dele
(contrato §7). Depois, leve para o arquivo do imóvel **só o que está escrito na
página**, campo a campo, cada um com `← link, AAAA-MM-DD`. O que a página não
disser entra como `?`.

**6 · Complete pela carteira, não pela pergunta.** Voz, CRECI, região, portais e
horário de visita estão no `INDICE.md`, em `## Quem sou` e `## Como eu
trabalho`. Perguntar o que já está escrito é o defeito mais caro do pack.

**7 · Pergunte o que só ele sabe** — seção 4, teto de três.

**8 · Escreva as duas versões** — seção 5.

**9 · Grave** — seção 6 —, conferindo o teto de 40 linhas do arquivo de imóvel
no momento de gravar.

**10 · Feche** com os blocos do contrato §10, nesta ordem: o trabalho ·
`## Guardei` · `## Falta saber` · `## Decidi sozinho`.

---

## 4 · O que perguntar

O anúncio do portal qualquer um copia. O que separa o dele é o que ele viu e o
que ele sabe — e é só isso que se pergunta. **Três perguntas por execução, no
máximo, e a escolha de caminho conta como uma.** Uma por vez, cada uma com o
motivo na mesma frase.

Em ordem de quanto mudam o texto:

1. **O que você viu lá que a foto não mostra?** Sol da tarde, barulho da
   avenida, o que se vê da janela, a escada, o cheiro de mofo no porão. É a
   linha que o texto do portal nunca tem, e é ela que faz o cliente querer vir.
2. **O que tem a dois quarteirões que interessa a quem vai morar aí?** Escola,
   mercado, ônibus, parque — com a distância. “Perto” não é dado; “dois
   quarteirões do Colégio Rosário” é.
3. **Por que o dono está vendendo?** Muda o prazo e muda a conversa de proposta.
   **Esta resposta não entra no anúncio** — vai para o arquivo. “O dono precisa
   vender rápido” publicado é a proposta baixa que ele mesmo pediu.

Ele nunca entrou no imóvel? A primeira pergunta vira uma só: “você já entrou
nesse imóvel?”. Não entrou, o anúncio sai com o que a página tinha, e
`## Falta saber` diz o que falta — anúncio de imóvel que ninguém visitou é o
texto do portal com outras palavras, e isso se diz na cara.

### Escolha entre dois e quatro caminhos

Use a UI de perguntas do harness, com botões, e o custo escrito em cada opção —
rótulo de até quatro palavras. **O exemplo do contrato §8 é literalmente desta
skill**; use-o como está. Ele vale quando há escolha real de tamanho ou de
destino — só o Zap, só o site próprio, os dois —, não para enfeitar uma pergunta
simples.

---

## 5 · A saída

Duas versões, dois blocos para colar, cada um sozinho e **sem comentário
dentro**. O que você quiser explicar vai fora do bloco, depois. E antes de
escrever a primeira frase, a lista de banidas.

### As banidas, e o que entra no lugar

| banida | o que ela escondia | o que entra no lugar |
|---|---|---|
| imóvel dos sonhos | nada — é enfeite | a coisa concreta que separa este dos outros |
| oportunidade única | pressa fabricada | o prazo real, se existir — exclusividade até 30/11 |
| aconchegante | é pequeno | a metragem e o que cabe — sala de 14 m² |
| charmoso | é antigo | o ano e o que sobrou dele — casa de 1962, taco original |
| amplo, espaçoso | ninguém mediu | o número em m² |
| excelente localização | não conhecem o entorno | a distância a pé — dois quarteirões do Colégio Rosário |
| acabamento de primeira, alto padrão | não olharam | o material — bancada de granito, porcelanato no piso |
| pronto para morar | nada | o que está feito — pintura nova, hidráulica trocada em 2024 |
| reformado | quando, e o quê | cozinha e banheiro refeitos em 2023 |
| espaço gourmet | é uma churrasqueira | churrasqueira, pia e bancada na varanda de 6 m² |
| vista deslumbrante | vista de quê, de onde | do quarto da frente se vê o parque |
| condomínio completo | não listaram | três itens, e só os que existem |
| próximo a tudo | nada | duas linhas de ônibus na esquina, mercado a 300 m |
| ideal para famílias | nada | 3 dormitórios, escola a dois quarteirões, pátio fechado |
| imperdível, corre que voa, venha conferir | pressa fabricada | uma frase de próximo passo, sem exclamação |

**Não sabe o que põe no lugar? A frase não entra.** Ela vira `?` no arquivo e
uma linha em `## Falta saber`. A banida nunca volta por falta de substituto —
foi para tapar o buraco que ela nasceu.

Fora da tabela, e valem sempre: preço em maiúsculas, não; exclamação, nenhuma;
emoji no portal, nenhum; adjetivo empilhado — “lindo e charmoso apartamento” —,
não. **O anúncio é do corretor**: nenhuma ferramenta assina e nenhuma marca
aparece além da dele. E frase de anúncio antigo ou de portal não se copia; dele
se tira **fato**, número, nunca a prosa.

### O defeito visível entra na descrição

Defeito que a visita revela em cinco minutos — cozinha pequena, escada sem
corrimão, prédio sem elevador, térreo de frente para avenida — entra na
descrição, dito como fato e sem desculpa. Não é gosto: é o que evita o sábado
perdido numa visita que ia morrer de qualquer jeito. Defeito que você não
apurou não se inventa, e defeito de documento não é assunto daqui — é
`/corretor:conferir-matricula`.

### Versão 1 · portal

```
Título
Casa 3 dormitórios com pátio, 120 m² — Azenha

Descrição
Casa de 120 m² na Azenha, com pátio nos fundos que pega o sol da tarde inteira.

São 3 dormitórios, um deles suíte, e duas vagas cobertas. A sala dá para o
pátio. A cozinha é pequena para uma casa de três dormitórios — quem cozinha
muito vai sentir.

O Colégio Rosário fica a dois quarteirões, e tem ônibus na esquina.

Marco visita no sábado de manhã ou na quarta à noite.

Ficha
tipo: casa · 120 m²
dormitórios: 3 · suíte: 1 · vagas: 2
condomínio: —
IPTU: ?
preço: R$ 520.000
endereço: Azenha, Porto Alegre
CRECI: 12345-F RS
```

O título é uma linha que cabe na lista do celular sem virar reticências — em
torno de sessenta caracteres —, e o que separa este imóvel dos vizinhos vem
antes do bairro. A descrição vai de quatro a oito linhas, na ordem de quem entra
no imóvel, e termina no próximo passo com o horário que está em `## Como eu
trabalho`.

**O `?` aparece na ficha, nunca na prosa.** A descrição só afirma o que foi
apurado; o campo em aberto vai para a ficha como `?`, e ali o corretor vê o que
precisa buscar antes de publicar. O CRECI sai do `INDICE.md`; não está lá, é `?`
e uma pergunta — ela não confere se o número é válido nem se o anúncio cumpre a
norma do conselho.

### Versão 2 · WhatsApp e redes

O formato é o do contrato §6, sem variação: linha curta de até doze palavras com
o primeiro nome · um parágrafo de duas a três linhas, um assunto só · **o link
sozinho na linha, com linha em branco antes e depois** · uma pergunta fácil.

```
Joana, achei uma com o pátio que você queria.

Casa de 3 dormitórios na Azenha, 120 m², dois quarteirões do Rosário. O pátio
dos fundos pega sol a tarde inteira. A cozinha é pequena, já aviso.

https://fontesimoveis.com.br/imovel/8812

Consigo te mostrar sábado de manhã. Prefere 10h ou 11h?
```

Sem destinatário — status, lista de transmissão, rede —, muda uma coisa só: a
primeira linha perde o nome e vira a coisa concreta. O resto é igual, e o link
continua sozinho na linha, senão a pré-visualização não abre e a foto do imóvel
não aparece.

```
Casa 3 dormitórios na Azenha, com pátio.

120 m², duas vagas, dois quarteirões do Colégio Rosário. O pátio dos fundos
pega o sol da tarde inteira.

https://fontesimoveis.com.br/imovel/8812

Quer ver por dentro?
```

Um link por mensagem. Negrito de asterisco no máximo uma vez, e só em hora ou
valor. Sem assinatura — o WhatsApp já dá.

---

## 6 · O que ela grava

Quatro arquivos, e nenhum outro:

```
_bruto/2026-08-19-link-8812.md       o que a página devolveu, sem tocar   cria
imoveis/V-071-casa-3d-azenha.md      o imóvel, tirado do modelo           cria
imoveis/_indice.md                   uma linha na tabela                  edita
INDICE.md                            a contagem e a linha atualizado:     edita
```

O arquivo do imóvel sai de `references/modelos/imovel.md`, com os
comentários `<!-- MODELO · … -->` **apagados** — todos. O bruto leva o cabeçalho
de três linhas do contrato §4.7 (`origem:`, `recebido:`, `sobre:`), o traço, e o
material como veio; `origem:` guarda a URL inteira. O apelido curto do nome do
bruto é o que identifica o imóvel numa palavra: o número da ficha na URL, ou o
bairro. Ficha colada em vez de link: o canal é `ficha`, e fica
`2026-08-19-ficha-8812.md`.

No `INDICE.md` mexa em duas coisas, porque o gabarito manda recontar ao gravar:
a linha `atualizado:` e o número de `## Quanto tem`. Nada mais. No `drive`, esse
arquivo e o `_indice.md` se leem inteiros antes de atualizar — atualizar lá
reescreve tudo, e o que as outras nove skills escreveram some sem aviso.

No `## Guardei`, diga onde cada um foi parar do jeito do transporte: no `local`,
`~/carteira/imoveis/V-071-casa-3d-azenha.md — criado`; no `drive`,
`imoveis/V-071-casa-3d-azenha.md, na pasta carteira do seu Drive — criado`.

**O que ela não toca:** `funil.md` e `hoje.md`, que são vistas de cliente e do
dia; `clientes/`, porque quem abre ficha `C-` de proprietário é
`/corretor:organizar-carteira`, na varredura, e não esta skill no meio de um
anúncio; e `_bruto/` que já existia — bruto
não se corrige e não se apaga, nunca.

**O texto do anúncio não vira arquivo.** Ele se refaz do arquivo do imóvel em
qualquer dia, e cópia guardada é a segunda verdade que ninguém atualiza. É a
regra 1 do contrato.

O fecho, depois dos dois blocos e nesta ordem (contrato §10):

```markdown
## Guardei
- ~/carteira/imoveis/V-071-casa-3d-azenha.md — criado, com o link e o preço da página
- ~/carteira/imoveis/_indice.md — uma linha nova
- ~/carteira/_bruto/2026-08-12-ficha-8812.md — a ficha, como veio
- ~/carteira/INDICE.md — imóveis à venda, 11 para 12

## Falta saber
- o IPTU do V-071 (casa 3 dorm, Azenha) — a página não traz, e é a segunda coisa que perguntam depois do preço
- se o pátio pega sol da tarde — você viu na visita e eu não tenho isso escrito
```

Sem carteira, o `## Guardei` vira uma linha só: `- nada foi gravado — você está
sem carteira aqui`. O anúncio sai igual.

### A procedência de cada campo

```
o que a página do link tinha          ← link, AAAA-MM-DD
o que ele colou porque o site fechou  ← ficha colada, AAAA-MM-DD
o que ele disse agora, na conversa    ← corretor, AAAA-MM-DD
o que ele viu dentro do imóvel        ← visita, AAAA-MM-DD
```

A data da visita é a da visita; ele não lembra, então é `← corretor, <hoje>` — a
data não se arredonda para hoje só para caber. O que ele viu vai para
`## O que vende` e `## O que trava`. O motivo da venda, que não é fato do imóvel
nem argumento de anúncio, vai para `## Histórico` com a data — é o que o
contrato §4 manda fazer com o fato que não tem seção.

Imóvel que já existia: edite o arquivo dono, acrescente uma linha em
`## Histórico` (`- 2026-08-19 anúncio reescrito`) e atualize a data no
`_indice.md`. Não crie id novo, não duplique.

---

## 7 · Onde ela para

Esta seção é a diferença entre uma ferramenta honesta e uma perigosa. Em todos
os casos: diga em uma linha o que não deu e qual é o caminho, sem pedir desculpa
duas vezes.

- **Site que só monta a página por JavaScript devolve nada.** É o caso mais
  comum, e o sintoma é claro: volta menu, rodapé, “carregando”, e nenhum preço,
  nenhuma metragem, nenhum bairro. Diga na cara — “esse site não abre para mim”
  — e peça a ficha colada, avisando que serve o texto do anúncio como está, com
  os números. **Não chute dado de imóvel**, nem para ilustrar, nem para mostrar
  como ficaria.
- **Link que abre mas é outra coisa** — página de busca, imóvel diferente, área
  de login da imobiliária, PDF que não se lê. A régua é a mesma: sem preço,
  metragem e bairro na página, trate como se não tivesse aberto.
- **Link de portal em vez do site próprio.** A página pode abrir, mas o texto de
  lá é de outro corretor. Tire dela número, não frase — e diga que tirou.
- **Ela não vê foto.** Não descreve o que aparece na imagem, não conta cômodo
  por foto, não diz “cozinha planejada” porque a foto do anúncio tem armário. Se
  o que importa está na imagem, pergunte ao corretor o que tem ali.
- **Área é o que a página escreveu.** Total e privativa quase nunca vêm
  separadas, e ela não afirma qual é. Não calcula metragem a partir de medidas,
  não converte, não soma pátio com construção. Não tinha, é `?`.
- **Preço é do corretor, e só dele.** “Por quanto anuncio?” não é pergunta para
  ela: mostra o que tem no link e o que ele disse, e para. O valor da página leva
  a data na procedência; se ele disser outro, o dele vence por ser mais novo, e
  no automático isso vai para `## Decidi sozinho`.
- **Ela não publica e não agenda.** Não tem acesso ao portal, não sobe foto, não
  mexe em CRM de imobiliária. Ela escreve o texto; quem cola e aperta enviar é
  ele.
- **Ela não diz se pode anunciar.** `exclusividade: ?` fica anotado e vai para
  `## Falta saber`. Autorização do proprietário é assunto dele — ela anota, não
  trava e não julga.
- **Documento não é com ela.** Matrícula, pendência, ônus, averbação: registra o
  que ele contou e aponta `/corretor:conferir-matricula`. Nunca diz que a
  documentação está em ordem, e nunca promete prazo de cartório, de prefeitura
  ou de banco.
- **Automático não completa fato.** Ele escolhe tom, ângulo e id; `?` continua
  `?`. Se a única saída for inventar um número para o texto fechar, ela para e
  pergunta — mesmo no automático.
