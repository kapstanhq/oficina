<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/corretor/CONTRATO.md, e esta cópia sai dela por
     `npm run oficina -- --escrever`. Correção feita aqui é perdida na
     próxima geração.

     A cópia existe porque o padrão Agent Skills quer a referência DENTRO da
     skill, em references/ — é o que faz o pack funcionar fora do Claude
     Code, onde ${CLAUDE_PLUGIN_ROOT} não é substituído. -->

# O contrato da carteira

Este arquivo é o padrão comum das dez skills do pack. Ele não é leitura de
apoio: é onde estão os formatos literais, e formato inventado por uma skill
quebra as outras nove.

Quem lê isto é o Claude executando uma skill. Quem lê o que sai dela é um
corretor de imóveis com pressa, que não é técnico e não vai depurar nada.

**Regra zero — leia antes de escrever.** Nenhuma skill inventa nome de arquivo,
nome de campo, nome de etapa ou nome de seção. Tudo o que se escreve na
carteira tem gabarito aqui embaixo. O que não tem gabarito não se escreve: se
pergunta.

**Onde este arquivo está.** Cada skill traz a própria cópia em
`references/CONTRATO.md`, caminho relativo à pasta da skill, e é assim que ela o
cita — `references/modelos/` vale o mesmo para os gabaritos. O caminho antigo,
`${CLAUDE_PLUGIN_ROOT}/…`, só existe no Claude Code: em qualquer outra
ferramenta que lê o padrão aberto ele chega como texto literal e o arquivo não
abre. `references/` é do padrão, e as cópias são geradas de uma fonte só por um
script — ninguém copia à mão.

---

## O que está aqui

```
1  onde a carteira mora — os dois transportes —, e quem é dono de qual fato
2  id e apelido — V-071 (casa 3 dorm, Azenha) — e o nome do arquivo
3  as três regras: não duplicar, procedência, aposentar
4  os formatos literais dos sete arquivos
5  os dois modos, e a exceção da matrícula
6  o que sai para o WhatsApp, e o que sai por e-mail
7  como ler uma conversa colada, e o que fazer com ela
8  a ordem de busca, e quando perguntar
9  os tetos
10 como uma skill começa e termina
11 onde esta skill roda, e o que funciona em cada lugar
```

---

## 1 · Onde a carteira mora

```
~/carteira/
  INDICE.md            o mapa. Toda skill lê primeiro. Teto: 120 linhas
  hoje.md              o que vence, o que travou, o que prometeram e não mandaram
  funil.md             quem está em que etapa, desde quando
  imoveis/
    _indice.md         uma linha por imóvel
    V-071-casa-3d-azenha.md
  clientes/
    _indice.md         uma linha por cliente
    C-017-joana-ribeiro.md
  _bruto/              conversas coladas, fichas, PDFs, links — a ORIGEM
    2026-08-12-whatsapp-joana.md
  arquivo-morto/
    imoveis/
    clientes/
```

Essa árvore é a mesma nos dois transportes de que trata esta seção: **o formato
dos arquivos não muda com o lugar onde eles moram.** Os sete gabaritos, a
procedência, os ids com apelido, as etapas e os tetos são idênticos no
computador e no Drive. O que muda é só como se lê e como se grava — e confundir
o conteúdo com o transporte é o que faria uma skill virar duas.

Neste documento, `~/carteira/…` é o modo curto de nomear o lugar, qualquer que
seja o transporte. É assim que se fala com o corretor no `local`; no `drive`,
diga “a pasta `carteira` do seu Drive”.

### Os dois transportes

```
local    uma pasta no computador do corretor
drive    uma pasta no Google Drive dele, pelo conector
```

Quem escolhe é o corretor, uma vez, no `/corretor:comecar`. **Nenhuma skill
troca o transporte, e nenhuma trabalha em dois ao mesmo tempo.**

**No `local`**, `~` é a pasta pessoal do corretor. No Windows é
`C:\Users\<nome>`, no Mac é `/Users/<nome>`, no Linux é `/home/<nome>`. **Toda
chamada de ferramenta usa caminho absoluto** — caminho relativo depende de onde
a sessão abriu, e a sessão abre em qualquer lugar. Ao falar com o corretor,
escreva `~/carteira/…`, que é curto e ele entende.

**No `drive` não existe caminho.** Pasta é um item com id, e arquivo é filho de
uma pasta. `/carteira` é o **nome** da pasta na raiz do Drive dele, não um
caminho que se entrega a uma ferramenta: achar `imoveis/_indice.md` é achar a
pasta `carteira`, achar a pasta `imoveis` dentro dela e procurar `_indice.md`
ali dentro. Guarde o id de cada pasta que abrir — reprocurar a mesma pasta a
cada operação é o que faz a execução demorar.

**A busca é sempre presa à pasta.** `_indice.md` existe duas vezes na carteira,
em `imoveis/` e em `clientes/`, e procurar pelo nome solto devolve os dois. Sem
saber de qual pasta veio, a skill grava a lista de imóveis por cima da lista de
clientes.

**Os arquivos são texto, com extensão `.md`.** Nada é convertido para documento
do Google: o que volta de um documento convertido não é o que foi escrito, e o
contrato inteiro depende de a linha voltar como saiu.

### A linha `carteira:` do `INDICE.md`

É ela que diz o transporte e o lugar, e é a primeira coisa que a skill lê:

```
carteira: local · C:\Users\marcelo\carteira
carteira: drive · /carteira
```

Transporte, ponto médio, o lugar. O transporte é `local` ou `drive`, e não há um
terceiro valor. **Linha ausente ou valor desconhecido: o transporte é o lugar
onde o `INDICE.md` foi encontrado**, e a skill segue sem perguntar — carteira
montada antes desta linha continua funcionando.

`carteira: drive` implica `Google Drive: sim` em `## O que está conectado`: é o
mesmo conector, e a carteira que abriu é o teste.

### A tabela de equivalência

O verbo é o mesmo nos dois; a ferramenta é outra. **O nome exato da ferramenta
muda com o programa que executa a skill; o verbo não.**

| a operação | no `local` | no `drive` |
|---|---|---|
| achar o `INDICE.md` | ler `<lugar>/INDICE.md` | procurar a pasta `carteira`, e `INDICE.md` dentro dela |
| ler um arquivo | leitura de arquivo, caminho absoluto | ler conteúdo, pelo id do arquivo achado na pasta |
| gravar arquivo que não existe | escrita de arquivo | criar arquivo, com a pasta declarada como pai |
| gravar arquivo que já existe | edição — troca o trecho, não reescreve tudo | atualizar arquivo, com o conteúdo inteiro |
| criar pasta | a escrita já cria o caminho | criar pasta, com a pasta pai declarada |
| listar uma pasta | busca por nome dentro do caminho | procurar com a pasta como pai |
| guardar um bruto | escrever o `.md` novo em `_bruto/` | criar arquivo `.md` na pasta `_bruto/` |

Duas diferenças mudam o que a skill faz, não só como faz:

- **Atualizar no `drive` reescreve o arquivo inteiro.** Não existe “troque esta
  linha”. Então **leia o arquivo antes de atualizar, sempre**, e devolva o texto
  inteiro com a sua mudança dentro. Atualizar sem ler apaga o que as outras nove
  skills escreveram ali.
- **`_bruto/` continua intocável nos dois.** No `drive`, isso quer dizer que o
  bruto se cria e nunca se atualiza.

PDF, foto e áudio (seção 4.7) ficam onde estão nos dois: no `local`, o `.md` de
`_bruto/` aponta o caminho no computador; no `drive`, aponta o nome do arquivo e
a pasta em que ele está no Drive.

### Quando o transporte falha

A regra é uma só: **diga o que houve, em uma linha, e pare.** Nunca invente o
conteúdo do arquivo que não conseguiu ler, e nunca crie um segundo arquivo
achando que o primeiro não existe.

| o que houve | o que a skill faz |
|---|---|
| o conector do Drive não está ligado, ou perdeu a autorização | diz que a carteira está no Drive e o conector não respondeu, e para. Não procura pasta parecida no computador |
| a busca não achou o arquivo | **lista a pasta pai antes de concluir que ele não existe.** A pasta apareceu e o arquivo não está lá: aí sim é arquivo a criar, ou é `?`, ou é pergunta |
| a busca não achou a pasta pai | a carteira não está onde a linha `carteira:` diz. Mostra o lugar que tentou e para. **Não monta a carteira de novo** |
| a leitura falhou no meio | para. O que voltou pela metade se descarta e não se grava por cima; a skill diz qual arquivo era |
| a gravação falhou | diz qual arquivo não foi gravado, com o lugar, e o que ele deveria conter. O corretor precisa saber o que ficou de fora |

Busca vazia não prova ausência: prova que a busca voltou vazia. Listar a pasta
custa uma chamada, e é o que separa “não existe” de “não achei”.

### A primeira leitura

Antes de qualquer outra coisa, a skill lê o `INDICE.md`:

1. procura no `local`, em `~/carteira/INDICE.md`. Não há ferramenta de arquivo
   neste ambiente? Este degrau não existe: comece pelo 2
2. não achou, procura a pasta `carteira` no Drive e o `INDICE.md` dentro dela
3. leu: a linha `carteira:` diz o transporte, e **toda leitura e toda gravação
   da execução vão por ele**
4. a linha diz um transporte e o arquivo apareceu no outro? A linha vence: vá ao
   lugar que ela diz e leia o `INDICE.md` de lá
5. e há `INDICE.md` nos dois lugares? Isso é bifurcação, não detalhe: mostre as
   duas carteiras, com o lugar de cada uma, e pergunte qual fica. **Não funde as
   duas**
6. não há `INDICE.md` em lugar nenhum: a carteira não existe. A skill faz uma
   coisa só — diz isso em uma linha e manda rodar `/corretor:comecar`, que é
   quem pergunta o transporte. Vale em `local` e em `drive`

Não cria a carteira por conta própria, não trabalha sem ela, não improvisa em
outra pasta. Depois do `INDICE.md` vem a linha `modo:` (seção 5), e então a
ordem de busca da seção 8.

### Quem é dono do quê

Um fato tem um dono, e só o dono é editado à mão:

| arquivo | é | quem manda |
|---|---|---|
| arquivo do imóvel | **dono** dos fatos do imóvel | ele |
| arquivo do cliente | **dono** dos fatos do cliente, inclusive `etapa:` | ele |
| `_indice.md` | vista derivada | reescrito a partir dos arquivos |
| `funil.md` | vista derivada | reescrito a partir dos `etapa:` |
| `hoje.md` | vista derivada, com caixas de marcar | reescrito a cada dia |
| `INDICE.md` | mapa e configuração | ele, para modo, identidade e conexões |
| `_bruto/` | origem crua | **nunca se edita** |

Vista e arquivo divergiram? **O arquivo vence** e a vista se reescreve. Nunca o
contrário — vista é resumo, e resumo não é prova.

---

## 2 · Id e apelido

**O id nunca anda sozinho.** Em toda menção, em toda skill, em todo arquivo, em
toda mensagem para o corretor: `V-071 (casa 3 dorm, Azenha)`. Nunca só `V-071`,
nunca só “a casa da Azenha”.

O id existe para o arquivo e o link não quebrarem quando o apelido mudar. O
apelido existe para o corretor saber do que se fala sem abrir nada. Os dois
juntos, sempre — inclusive dentro de listas, de tabelas e do histórico.

```
V-   imóvel à venda        V-071
A-   imóvel para alugar    A-014
C-   cliente               C-017
```

Número sequencial de três dígitos, por prefixo. **Id não se reaproveita**, nem
depois que o item vai para `arquivo-morto/`: o próximo é sempre o maior já
usado mais um, contando o arquivo morto junto. Para achar o maior, leia o
`_indice.md` do tema — ele lista os vivos e os aposentados.

### O apelido

- imóvel: `<tipo> <n> dorm, <bairro>` — `casa 3 dorm, Azenha`, `apto 2 dorm,
  Menino Deus`. Sem dormitório (terreno, sala): `<tipo> <número>m², <bairro>`.
- cliente: nome e sobrenome como ele se apresentou — `Joana Ribeiro`.

### O nome do arquivo

Id, hífen, apelido em minúsculas, sem acento, sem vírgula, palavras ligadas por
hífen, `3 dorm` vira `3d`:

```
V-071 (casa 3 dorm, Azenha)      → V-071-casa-3d-azenha.md
A-014 (apto 2 dorm, Menino Deus) → A-014-apto-2d-menino-deus.md
C-017 (Joana Ribeiro)            → C-017-joana-ribeiro.md
```

Apelido mudou? O arquivo **não** é renomeado — o link do índice quebraria e o
histórico ficaria órfão. Muda-se o apelido no título dentro do arquivo e nas
vistas; o nome do arquivo fica como nasceu.

---

## 3 · As três regras

### Regra 1 · Se dá para derivar, não se duplica

O arquivo guarda **fato**; `_bruto/` guarda a **origem**. A conversa inteira
nunca entra no arquivo do cliente — entra em `_bruto/`, e o arquivo fica com as
seis linhas que ela produziu.

Sem isso o arquivo cresce sem fim e a skill relê quarenta quilobytes para achar
um telefone. Os tetos da seção 9 são essa regra virada número.

Vista derivada (`_indice.md`, `funil.md`, `hoje.md`) pode repetir um campo do
arquivo — é para isso que ela serve. O que não pode é a vista virar a única
cópia de alguma coisa: tudo que está nela tem de existir no arquivo dono.

### Regra 2 · Nada entra sem procedência

Todo campo leva de onde veio e quando. O formato é fixo — valor, dois espaços,
seta, origem, vírgula, data:

```
preço: R$ 520.000  ← link, 2026-08-12
telefone: +55 51 99999-0000  ← _bruto/2026-08-12-whatsapp-joana.md
área: 120 m²  ← ficha colada, 2026-08-12
prazo: quer mudar até dezembro  ← corretor, 2026-08-19
```

As origens possíveis, e não há outras:

```
link              a página do imóvel que o corretor colou (a URL fica no campo link:)
ficha colada      o texto da ficha, quando o site não devolveu nada
_bruto/<arquivo>  conversa, e-mail ou documento que está em _bruto/
corretor          o próprio corretor disse agora, na conversa com a skill
visita            o corretor viu no imóvel
matrícula         está na matrícula que está em _bruto/
```

**O que não se apurou entra como `?`.** Nunca uma estimativa, nunca “por volta
de”, nunca um número de imóvel parecido. O `?` pode levar na procedência o que
resolve ele:

```
condomínio: ?  ← pedir ao proprietário
iptu: ?  ← está na matrícula, que ainda não chegou
e-mail: ?
```

Campo inventado com cara de apurado é pior que campo vazio: o corretor repassa
para o cliente e descobre na visita. E o `?` é a linha mais útil do arquivo —
é o que a próxima skill vai perguntar.

Data sempre em `AAAA-MM-DD`. É a única forma que ordena sozinha e em que
`12/08` não vira agosto de um lado e dezembro do outro. Ao FALAR com o corretor,
escreva `12 de agosto`; ao ESCREVER no arquivo, `2026-08-12`.

### Regra 3 · O que morre é aposentado com data e motivo

Gaveta, não lixeira. **Nenhuma skill apaga arquivo da carteira, nunca.**

Aposentar é isto, nesta ordem:

1. no alto do arquivo, logo abaixo do título, entra uma linha:
   `aposentado: 2026-08-19 · motivo: vendido para C-017 (Joana Ribeiro)`
2. o arquivo é movido para `arquivo-morto/imoveis/` ou `arquivo-morto/clientes/`
3. no `_indice.md`, a linha sai da tabela de cima e entra em `## Arquivo morto`,
   com o desfecho em uma linha
4. some do `funil.md` e do `hoje.md`, que são vistas dos vivos

Quando aposentar, sem inventar outros critérios: imóvel vendido, alugado, tirado
do mercado ou com exclusividade vencida; cliente que fechou, desistiu por
escrito, ou está sem responder há **120 dias**. Cliente parado há menos que isso
não é morto — é assunto de `/corretor:retomar-contato`.

Aposentar em modo automático é permitido para o prazo de 120 dias. Aposentar por
qualquer outro motivo é decisão do corretor, mesmo no automático.

---

## 4 · Os formatos, literais

Sete arquivos, sete gabaritos. O que vale como formato é o que está abaixo, e
`/corretor:comecar` copia os vazios de `modelos/`. Campo que não existe no
gabarito não se inventa: se o corretor trouxe um fato que não cabe em lugar nenhum, ele vai
para `## Histórico` com a data.

Nenhum arquivo da carteira tem frontmatter YAML. O cabeçalho é linha de
`campo: valor`, que o corretor lê sem saber que é um formato.

Os gabaritos ficam em `references/modelos/`, dentro da própria skill, e vão para
cá:

```
modelos/INDICE.md             → ~/carteira/INDICE.md
modelos/hoje.md               → ~/carteira/hoje.md
modelos/funil.md              → ~/carteira/funil.md
modelos/_indice-imoveis.md    → ~/carteira/imoveis/_indice.md
modelos/_indice-clientes.md   → ~/carteira/clientes/_indice.md
modelos/imovel.md             → ~/carteira/imoveis/<id>-<apelido>.md   (um por imóvel)
modelos/cliente.md            → ~/carteira/clientes/<id>-<apelido>.md  (um por cliente)
```

Cada modelo abre com um comentário `<!-- MODELO · … -->` explicando o que
preencher. **Ao gravar de verdade, esses comentários saem** — todos. Modelo que
chega ao corretor com o próprio manual dentro parece arquivo pela metade.

### 4.1 · `INDICE.md`

O mapa e a configuração. Toda skill lê este arquivo antes de qualquer coisa.
Teto: **120 linhas**.

```markdown
# Carteira de Marcelo Fontes

carteira: local · C:\Users\marcelo\carteira
modo: copiloto
atualizado: 2026-08-19

## Quem sou — é esta a voz das mensagens
nome: Marcelo Fontes
creci: 12345-F RS
telefone: +55 51 99888-7766
imobiliária: Fontes Imóveis
região: Porto Alegre — Azenha, Menino Deus, Cidade Baixa
assinatura de e-mail: Marcelo Fontes · CRECI 12345-F · Fontes Imóveis

## Onde está o quê
hoje.md          o que vence, o que travou, o que prometeram e não mandaram
funil.md         quem está em que etapa, desde quando
imoveis/         _indice.md tem a lista; um arquivo por imóvel
clientes/        _indice.md tem a lista; um arquivo por cliente
_bruto/          conversas coladas e documentos — a origem, não a verdade
arquivo-morto/   o que foi aposentado, com data e motivo

## Quanto tem (recontar ao gravar)
imóveis à venda: 12
imóveis para alugar: 3
clientes ativos: 21
aposentados: 8

## O que está conectado
Google Agenda: sim  ← testado 2026-08-19
Gmail: sim  ← testado 2026-08-19
Google Drive: não — pulado no começo
WhatsApp: não tem conector. A conversa entra colada, e vai para _bruto/

## Como eu trabalho
portais onde anuncio: Zap, VivaReal
canal padrão com cliente: WhatsApp
horário de visita que costumo oferecer: sábado de manhã, quarta à noite

## Pulado no começo
- ligar o Google Drive — 2026-08-19
```

`carteira:` é a linha da seção 1 — o transporte e o lugar. `modo:` é a linha da
seção 5. `## Quem sou` é o que assina as mensagens. `## Pulado no começo` é a
lista que `/corretor:comecar` deixa para depois, e qualquer skill pode oferecer
retomar um item dela — uma vez, sem insistir.

### 4.2 · `hoje.md`

Vista derivada, reescrita por `/corretor:o-que-fazer-hoje`. Quatro seções, nesta
ordem, e nenhuma outra. Toda linha é uma caixa de marcar e cita id com apelido.

```markdown
# Hoje — 2026-08-19

## Vence hoje
- [ ] Confirmar a visita de sábado com C-017 (Joana Ribeiro) — combinado em 2026-08-14
- [ ] Responder C-024 (Paulo Menezes) — entrou ontem pelo Zap e não teve resposta

## Travado
- [ ] V-071 (casa 3 dorm, Azenha) — matrícula não conferida, e a proposta é sexta
- [ ] A-014 (apto 2 dorm, Menino Deus) — sem foto da sala; anúncio parado desde 2026-08-11

## Prometido e não chegou
- [ ] C-031 (Sr. Almeida) — ia mandar o IPTU do V-071 (casa 3 dorm, Azenha) em 2026-08-13, seis dias
- [ ] C-017 (Joana Ribeiro) — ia dizer se o marido pode sábado, três dias

## Feito nos últimos sete dias
- [x] 2026-08-15 — visita do C-017 (Joana Ribeiro) ao V-071 (casa 3 dorm, Azenha)
```

Seção vazia continua na página, com uma linha só: `- nada aqui hoje.` Sumir com
a seção faz o corretor achar que a skill esqueceu.

### 4.3 · `funil.md`

Vista derivada do campo `etapa:` dos arquivos de cliente. As etapas são estas
seis, nesta ordem, e **nenhuma skill cria etapa nova**:

```
novo lead · em conversa · visita marcada · visitou · proposta · fechado
```

Quem sai do funil sem fechar não vira etapa: vira `arquivo-morto/` pela regra 3.

```markdown
# Funil — atualizado em 2026-08-19

## novo lead
- C-024 (Paulo Menezes) · desde 2026-08-18 · veio do V-071 (casa 3 dorm, Azenha) no Zap · próximo: responder hoje

## em conversa
- C-019 (Rita Camargo) · desde 2026-08-05 · procura 2 dorm no Menino Deus · próximo: mandar A-014 (apto 2 dorm, Menino Deus)

## visita marcada
- C-017 (Joana Ribeiro) · desde 2026-08-14 · V-071 (casa 3 dorm, Azenha), sábado 10h · próximo: confirmar

## visitou
- nada aqui.

## proposta
- C-008 (Família Duarte) · desde 2026-08-16 · V-052 (apto 3 dorm, Cidade Baixa), R$ 480.000 · próximo: resposta do proprietário

## fechado
- C-002 (Léo Antunes) · 2026-08-01 · V-039 (casa 2 dorm, Tristeza)
```

Uma linha por cliente, sempre com `· desde AAAA-MM-DD` e `· próximo: <ação>`.
Cliente aparece em uma etapa só.

### 4.4 · O arquivo de imóvel — `imoveis/V-071-casa-3d-azenha.md`

Teto: **40 linhas**.

```markdown
# V-071 (casa 3 dorm, Azenha)

link: https://fontesimoveis.com.br/imovel/8812  ← corretor, 2026-08-12
estado: à venda
tipo: casa · 120 m²  ← link, 2026-08-12
preço: R$ 520.000  ← link, 2026-08-12
condomínio: —
iptu: ?  ← pedir ao proprietário
dormitórios: 3 · suíte: 1 · vagas: 2  ← link, 2026-08-12
endereço: rua José do Patrocínio, Azenha, Porto Alegre  ← link, 2026-08-12
proprietário: Sr. Almeida, +55 51 99777-1122  ← corretor, 2026-08-12
exclusividade: sim, até 2026-11-30  ← corretor, 2026-08-12

## O que vende
- pátio nos fundos com sol da tarde  ← visita, 2026-08-15
- duas quadras do Colégio Rosário  ← corretor, 2026-08-12

## O que trava
- cozinha pequena para três dormitórios  ← visita, 2026-08-15
- escada sem corrimão, ruim para quem tem criança  ← visita, 2026-08-15

## Documentos
matrícula: 44.812, 3º Registro de Imóveis de Porto Alegre  ← corretor, 2026-08-12
conferida: não
pendências: ?

## Mostrado a
- C-017 (Joana Ribeiro) · enviado 2026-08-12 · visitou 2026-08-15

## Histórico
- 2026-08-12 entrou na carteira  ← _bruto/2026-08-12-ficha-8812.md
- 2026-08-15 visita com C-017 (Joana Ribeiro)
```

`estado:` é um destes: `à venda`, `para alugar`, `reservado`, `vendido`,
`alugado`, `fora do mercado`. Os três últimos disparam a regra 3.

Aluguel usa o mesmo gabarito com prefixo `A-`, e `preço:` é o aluguel mensal:
`preço: R$ 2.400/mês  ← link, 2026-08-12`.

### 4.5 · O arquivo de cliente — `clientes/C-017-joana-ribeiro.md`

Teto: **60 linhas**.

```markdown
# C-017 (Joana Ribeiro)

telefone: +55 51 99123-4567  ← _bruto/2026-08-12-whatsapp-joana.md
e-mail: ?
canal: WhatsApp
etapa: visita marcada · desde 2026-08-14
origem: anúncio do V-071 (casa 3 dorm, Azenha) no Zap  ← _bruto/2026-08-12-whatsapp-joana.md

## O que procura
faixa: até R$ 550.000  ← _bruto/2026-08-12-whatsapp-joana.md
bairros: Azenha, Menino Deus  ← _bruto/2026-08-12-whatsapp-joana.md
o que precisa ter: 3 dormitórios, uma vaga  ← _bruto/2026-08-12-whatsapp-joana.md
o que não aceita: térreo de frente para avenida  ← corretor, 2026-08-15
prazo: quer mudar antes das aulas, fevereiro  ← corretor, 2026-08-15
pagamento: financiamento, aprovação ainda não saiu  ← corretor, 2026-08-15
quem decide junto: o marido, que não veio na primeira visita  ← corretor, 2026-08-15

## Imóveis mostrados
- V-071 (casa 3 dorm, Azenha) · enviado 2026-08-12 · visitou 2026-08-15 · gostou do pátio, achou a cozinha pequena
- A-014 (apto 2 dorm, Menino Deus) · não enviado — fora da faixa de dormitórios

## Combinado
- visita sábado 2026-08-22, 10h, com o marido  ← corretor, 2026-08-14
- ela ia confirmar até 2026-08-16 e não confirmou

## Histórico
- 2026-08-12 primeiro contato pelo Zap  ← _bruto/2026-08-12-whatsapp-joana.md
- 2026-08-15 visita ao V-071 (casa 3 dorm, Azenha)
```

`etapa:` é uma das seis da seção 4.3, e é **aqui** que ela mora — `funil.md` só
reflete. Mudou a etapa, mudam os dois na mesma passada, e a data de `desde` é a
data da mudança.

`## Imóveis mostrados` guarda também o que foi descartado e por quê: é o que
impede a próxima skill de mandar de novo o que ele já recusou.

### 4.6 · Os dois `_indice.md`

Vista derivada, uma tabela, **uma linha por item**, e nada além disso. Quem
quer detalhe abre o arquivo — é para isso que a linha tem o id.

`imoveis/_indice.md`:

```markdown
# Imóveis — 12 à venda, 3 para alugar · atualizado em 2026-08-19

| imóvel | estado | preço | atualizado |
|---|---|---|---|
| V-071 (casa 3 dorm, Azenha) | à venda | R$ 520.000 | 2026-08-15 |
| V-052 (apto 3 dorm, Cidade Baixa) | reservado | R$ 480.000 | 2026-08-16 |
| A-014 (apto 2 dorm, Menino Deus) | para alugar | R$ 2.400/mês | 2026-08-11 |

## Arquivo morto
- V-039 (casa 2 dorm, Tristeza) · 2026-08-01 · vendida para C-002 (Léo Antunes)
```

`clientes/_indice.md` — sem a etapa, que é do `funil.md`:

```markdown
# Clientes — 21 ativos · atualizado em 2026-08-19

| cliente | procura | canal | último contato |
|---|---|---|---|
| C-017 (Joana Ribeiro) | 3 dorm até R$ 550.000, Azenha | WhatsApp | 2026-08-15 |
| C-019 (Rita Camargo) | 2 dorm até R$ 400.000, Menino Deus | WhatsApp | 2026-08-05 |
| C-031 (Sr. Almeida) | proprietário do V-071 (casa 3 dorm, Azenha) | telefone | 2026-08-13 |

## Arquivo morto
- C-002 (Léo Antunes) · 2026-08-01 · comprou o V-039 (casa 2 dorm, Tristeza)
```

Proprietário também é cliente e ganha `C-`: é dele que se cobra documento, e
cobrança sem ficha vira recado perdido. Na tabela, a coluna `procura` diz de
qual imóvel ele é dono.

### 4.7 · O que entra em `_bruto/`

Nome do arquivo: `AAAA-MM-DD-<canal>-<apelido-curto>.md`, sempre a data em que
o material foi produzido — não a de hoje, quando dá para saber.

```
2026-08-12-whatsapp-joana.md
2026-08-12-ficha-8812.md
2026-08-17-email-almeida.md
2026-08-18-matricula-44812.md
```

Cabeçalho de três linhas e, abaixo do traço, o material **colado sem tocar**:

```markdown
origem: WhatsApp, exportado pelo corretor
recebido: 2026-08-12
sobre: C-017 (Joana Ribeiro), V-071 (casa 3 dorm, Azenha)

---

[12/08/2026 14:32] Joana: oi, vi a casa da Azenha no Zap, ainda tem?
[12/08/2026 14:40] Marcelo: tem sim! quer ver no sábado?
```

Bruto não se corrige, não se resume e não se apaga. Se o corretor disser que o
que está lá está errado, o certo vai para o arquivo dono com procedência
`← corretor, <data>`; o bruto continua como estava, porque ele é a prova do que
foi dito, não do que é verdade.

PDF, foto e áudio ficam onde estão e `_bruto/` guarda um arquivo `.md` que
aponta o caminho no computador. Áudio não se transcreve de ouvido: se o que
importa está num áudio, pergunte ao corretor o que ele diz.

---

## 5 · Os dois modos

A skill descobre o modo lendo a linha `modo:` do `INDICE.md`. É a segunda coisa
que ela faz, depois de conferir que a carteira existe.

```
modo: copiloto      para nas bifurcações e devolve o trabalho pronto até ali
modo: automatico    escolhe sozinha e DECLARA o que escolheu
```

Aceite `automatico` e `automático`. Qualquer outro valor, linha ausente ou
arquivo ilegível: **o modo é `copiloto`**. Nunca se escolhe automático por
dedução, por pressa ou porque a resposta parece óbvia — o corretor liga o
automático uma vez, no `INDICE.md`, e é lá que ele desliga.

### Copiloto

Na bifurcação, para. Antes de parar, entrega o que já ficou pronto: quem para
de mãos vazias fez o corretor esperar por nada. Pergunta uma coisa (seção 8) e
espera.

### Automático

Escolhe e segue. Ao fim da saída, **sempre**, com este título exato:

```markdown
## Decidi sozinho
- Usei o preço do link, R$ 520.000, e não o que estava na conversa de junho — o link é mais novo. Para trocar, me diga o valor.
- Marquei a Joana como “visita marcada” porque ela aceitou o sábado. Se ela ainda não confirmou, me diga que eu volto para “em conversa”.
```

Uma linha por escolha: **o que fiz — por que — como desfazer.** Sem essa
declaração, automático é caixa preta, e caixa preta na mão de quem é leigo
queima a confiança no primeiro erro. Não escolheu nada? A seção não aparece.

### A exceção escrita

**`/corretor:conferir-matricula` nunca opera em automático.** Mesmo com
`modo: automatico` no `INDICE.md`, ela lista o que pode travar a venda e para;
quem conclui é gente. Ela diz isso em uma linha, sem pedir desculpa: quem
escolheu automático escolheu para o anúncio, não para a matrícula.

Nenhuma outra skill tem exceção. Se uma skill acha que precisa de uma, ela para
e pergunta — não inventa a exceção.

---

## 6 · O que sai para o WhatsApp

O canal está no arquivo do cliente (`canal:`) e **decide o formato**. Na dúvida,
WhatsApp.

**A voz é a do corretor.** A mensagem sai do WhatsApp dele, com o nome dele, e
quem vai responder por ela é ele. A Kapstan não aparece, não assina, não é
citada. Nada de “nossa equipe”, nada de “estamos à disposição”: é uma pessoa
falando com outra.

O formato, e não há variação:

```
uma linha curta        até doze palavras, com o primeiro nome do cliente
um parágrafo           duas a três linhas. Um assunto só
o link sozinho         linha em branco antes e depois, um link por mensagem
uma pergunta fácil     de sim ou não, ou entre duas opções
```

Exemplo, e é deste tamanho:

```
Joana, achei uma que tem o pátio que você queria.

São 3 dormitórios na Azenha, dois quarteirões do Rosário, dentro da sua faixa.
O pátio pega sol da tarde inteira.

https://fontesimoveis.com.br/imovel/8812

Consigo te mostrar sábado de manhã. Prefere 10h ou 11h?
```

O link **sozinho na linha**, sem texto colado nem pontuação depois: senão a
pré-visualização do WhatsApp não abre, e é a pré-visualização que faz a foto do
imóvel aparecer.

O que não entra: emoji (a não ser que a conversa colada mostre o corretor
usando, e aí no máximo um); `*negrito*` mais de uma vez, e só em hora ou
valor; saudação de escritório (“espero que esteja bem”, “tudo bem?”); preço em
maiúsculas; “imperdível”, “oportunidade única”, “corre que voa”; assinatura, que
o WhatsApp já dá; e mais de uma pergunta.

O bloco sai **sozinho, pronto para copiar**, sem comentário dentro dele. O que a
skill quiser explicar vai fora do bloco, depois.

### E-mail é outro tamanho

```
assunto        até oito palavras, sem “Re:” de mentira
saudação       “Joana, bom dia.”
corpo          dois parágrafos curtos. Pode ter até dois links, com o texto do link
fecho          uma pergunta, e a assinatura que está no INDICE.md
```

Mensagem por e-mail que seria melhor no WhatsApp: mande no WhatsApp e diga por
quê, em uma linha.

---

## 7 · Como ler uma conversa colada

Não existe conector de WhatsApp. A ponte é o corretor exportar ou colar a
conversa, e a skill saber ler os dois formatos que chegam.

### Exportado do aplicativo

```
[12/08/2026 14:32] Joana Ribeiro: oi, vi a casa da Azenha no Zap, ainda tem?
[12/08/2026 14:40] Marcelo Fontes: tem sim! quer ver no sábado?
[12/08/2026 14:41] Joana Ribeiro: ‎<Mídia oculta>
[12/08/2026 14:55] Joana Ribeiro: sábado de manhã dá, mas tem que ser cedo
```

Aparece também sem colchetes, que é o formato antigo, e vale o mesmo:

```
12/08/2026 14:32 - Joana Ribeiro: oi, vi a casa da Azenha no Zap
```

A data é **dd/mm/aaaa** e a hora é de 24 horas — é o padrão brasileiro, e
`03/08` é 3 de agosto. Ano de dois dígitos (`12/08/26`) é 2026. Ao gravar,
converta para `2026-08-12`.

**Quem é o corretor na conversa:** é o remetente cujo nome bate com `nome:` do
`INDICE.md`. Não bateu de jeito nenhum? Uma pergunta, uma vez: “Nessa conversa,
qual dos dois é você?”. Nunca deduza pelo tom — o risco é gravar a fala do
cliente como promessa do corretor.

**O que não se lê, não se inventa:** `<Mídia oculta>`, `Esta mensagem foi
apagada`, áudio e figurinha viram um buraco declarado, não um palpite. Se o
buraco está no meio do que importa, ele vira uma linha em `## Combinado` ou uma
pergunta: “Tem um áudio de 12 de agosto no meio da conversa. O que ela disse
ali?”

### Texto solto

Colagem sem carimbo de data e sem nome — um pedaço de conversa, um anúncio, uma
ficha, um e-mail encaminhado. Trate assim: o conteúdo é fato do que está
escrito, a data é a que o corretor disser (ou a de hoje, e a procedência diz
`← corretor, <hoje>`), e o autor não se adivinha.

### O que fazer com ela depois, sempre nesta ordem

1. **Grava o bruto primeiro**, em `_bruto/AAAA-MM-DD-<canal>-<apelido-curto>.md`, com
   o cabeçalho de três linhas da seção 4.7 e o texto colado sem tocar. Primeiro
   porque, se algo der errado no meio, o material do corretor já está salvo.
2. **Extrai os fatos** para os arquivos donos — cliente e imóvel —, cada campo
   com `← _bruto/<aquele arquivo>`. Fato é o que está escrito: “dá sábado, mas
   cedo” é `## Combinado`, não “visita marcada às 9h”.
3. **Atualiza as vistas** que mudaram: `funil.md` se a etapa mudou,
   `_indice.md` se entrou item ou mudou o último contato.
4. **Diz onde guardou**, no bloco `## Guardei` da seção 10.

Conversa que menciona imóvel que não está na carteira: não crie o imóvel com o
que a conversa diz. Pergunte o link, uma vez. Sem link nem ficha, o imóvel não
entra — dado de imóvel adivinhado vira preço errado na mensagem para o cliente.

---

## 8 · Quando perguntar, e como

Perguntar cedo demais é o defeito mais caro do pack: o corretor já respondeu
aquilo, está escrito na carteira, e a skill perguntou de novo.

### A ordem de busca

Só desce um degrau quando o de cima não respondeu:

```
1  INDICE.md                 quem ele é, modo, o que está conectado
2  o _indice.md do tema      imóveis/ ou clientes/ — acha o id e o apelido
3  o arquivo do item         é ele o dono do fato
4  _bruto/                   a conversa ou a ficha de onde o fato veio
5  o link                    a página do imóvel, quando há link e ela abre
6  PERGUNTA ao corretor      só o que nenhum dos cinco tinha
7  PEDE O DOCUMENTO          quando nem ele sabe: matrícula, IPTU, ficha
```

O degrau 5 tem um fim conhecido: site que só monta a página por JavaScript
devolve nada. Quando isso acontecer, diga na cara — “esse site não abre para
mim” — e peça a ficha colada. **Não chute dado de imóvel**, em hipótese
nenhuma, nem para “ilustrar”.

### O tamanho da pergunta

Uma por vez. **Nunca mais de três numa execução.** Skill que abre com
formulário de oito campos é abandonada na primeira execução, e não volta.

Toda pergunta traz o motivo na mesma frase, porque o motivo é o que ensina o
ofício enquanto a skill trabalha:

```
ruim   Qual o valor do condomínio?
bom    Quanto é o condomínio? É a primeira coisa que perguntam depois do
       preço, e sem ele o anúncio volta com a mesma dúvida dez vezes.
```

### Escolha entre dois e quatro caminhos

Use a UI de perguntas do harness (a ferramenta de perguntar ao usuário, com
botões) — não escreva as opções em prosa e peça para ele digitar o número.

Cada opção traz **o custo escrito**: o que ela exige e quanto demora.

```
Como quer o anúncio do V-071 (casa 3 dorm, Azenha)?

  Curto, para o Zap      3 linhas e as fotos falam · pronto agora
  Completo, para o site  15 linhas com metragem e condomínio · preciso do IPTU
  Os dois                pronto agora e o completo fica com um ? no IPTU
```

Rótulo curto, até quatro palavras. A descrição declara o custo, não vende a
opção. Mais de quatro caminhos: escolha os três melhores e diga que há outros.

### Quando NÃO perguntar

- o fato está na carteira: use, e cite de onde veio
- é gosto do corretor sobre o que ele já decidiu antes: siga o que está escrito
  em `## Como eu trabalho`
- é detalhe que não muda a saída: deixe `?` e siga
- em modo automático: escolha e declare (seção 5) — a exceção é
  `conferir-matricula`, que pergunta sempre

---

## 9 · Os tetos, e o que fazer quando estouram

```
INDICE.md              120 linhas
arquivo de cliente      60 linhas
arquivo de imóvel       40 linhas
_indice.md              uma linha por item, e nada mais
hoje.md                 o que cabe num dia. Passou de 15 caixas, priorize e diga
```

Confira o teto **ao gravar**, não depois. Estourou:

- **imóvel ou cliente:** o `## Histórico` é o que condensa. Linhas de mais de
  90 dias viram uma por mês (`- 2026-05 três visitas, nenhuma proposta`). Se
  ainda estourar, o excesso vai para um arquivo em `_bruto/` e o histórico fica
  com a linha que aponta para ele. Fato corrente nunca é cortado para caber.
- **INDICE.md:** a lista detalhada não mora aqui — mora nos `_indice.md`. Corte
  o que for cópia deles.
- **`_indice.md`:** duas linhas para o mesmo item é sinal de id duplicado.
  Pare, mostre os dois e pergunte qual fica.

Teto não é sugestão: ele é a regra 1 medida. Arquivo de cliente com 200 linhas
faz toda skill reler 200 linhas para achar um telefone, em toda execução.

---

## 10 · Como uma skill começa e termina

### Começa

1. lê `~/carteira/INDICE.md`. Não existe: uma linha e `/corretor:comecar`
2. lê a linha `modo:`
3. desce a ordem de busca da seção 8 até ter o que precisa
4. tarefa de **três ou mais passos demorados**: mostra o TODO na tela.
   Demorado é passo que abre link, lê muitos arquivos ou escreve mais de um
   arquivo. Três edições de uma linha não são um TODO — são uma frase.

### Termina

Nesta ordem, e só as seções que tiverem conteúdo:

**Uma exceção, e ela é escrita porque exceção sem motivo é acidente:** a
`/corretor:comecar` é a única skill sem bloco para colar — o trabalho dela é a
configuração. Nela o lugar do bloco é ocupado por `## O que ficou pronto`, e
ela acrescenta `## Ficou para depois` e `## O que pedir agora` DEPOIS dos três
títulos fixos. Nenhuma outra skill acrescenta seção ao fecho.

```markdown
<o trabalho — o bloco para colar, sozinho, sem comentário dentro>

## Guardei
- ~/carteira/imoveis/V-071-casa-3d-azenha.md — criado
- ~/carteira/imoveis/_indice.md — uma linha nova
- ~/carteira/_bruto/2026-08-12-whatsapp-joana.md — a conversa, como veio

## Falta saber
- condomínio do V-071 (casa 3 dorm, Azenha) — pedi ao proprietário em 2026-08-13
- se o marido da C-017 (Joana Ribeiro) pode sábado

## Decidi sozinho
- <só em modo automático · o que fiz — por que — como desfazer>
```

**O bloco vai em cerca de código, e NUNCA dentro de moldura desenhada.** Uma
caixa de `┌─┐` parece organizada na tela e é armadilha: o corretor seleciona,
copia e leva as bordas junto para dentro do WhatsApp do cliente. A cerca de
código dá o botão de copiar e devolve só o texto. Vale para tudo o que existe
para sair daqui e ir para outro lugar — mensagem, anúncio, roteiro, legenda,
título de evento. Nada de traço de enfeite antes ou depois, nada de `>` de
citação, nada de “copie o texto abaixo:” dentro do bloco.

Os três títulos são exatamente estes. **Escreveu na carteira, diz onde**: o
corretor precisa saber onde a coisa foi parar para confiar que ela está lá.

`## Falta saber` é a regra 2 aparecendo: são os `?` que esta execução criou ou
não conseguiu resolver. É a lista que a próxima skill vai atacar.

### O que nenhuma skill faz

- inventar dado de imóvel, de cliente ou de valor — `?` sempre bate palpite
- apagar arquivo da carteira, ou editar `_bruto/`
- criar campo, seção, etapa ou nome de arquivo fora deste contrato
- mandar mensagem: ela **escreve** o texto, quem manda é o corretor
- falar em nome da Kapstan na mensagem que sai para o cliente
- decidir preço, decidir se aceita proposta, ou dizer que um documento está em
  ordem — isso é do corretor, e a skill diz o que olhar
- prometer prazo de financiamento, de cartório ou de prefeitura

### A língua

Português do Brasil, do jeito que o corretor fala. Frase curta, imperativo
direto, zero hype. “Lead” fica, porque é a palavra que ele usa todo dia.
Aspas curvas “ ”, travessão —, e nada de emoji no que a skill diz.

Quando a skill não conseguir fazer algo, ela diz em uma linha o que não deu e
qual é o caminho — não pede desculpa duas vezes e não some do assunto.

---

## 11 · Onde esta skill roda

O `SKILL.md` é padrão aberto, e este pack roda em mais de uma ferramenta. O que
muda de uma para outra não é o contrato: é o que existe embaixo dele.

```
Claude Code · Codex CLI · app do ChatGPT · Copilot · Cursor
  tudo funciona, nos dois transportes

chat do Claude e chat do ChatGPT na web
  não há pasta no computador. Com a carteira no drive, tudo funciona;
  sem ela, funcionam as skills que trabalham com o que for COLADO na
  conversa, e as que dependem de memória não funcionam
```

Sem carteira nenhuma, cinco entregam o trabalho e não gravam nada:

| skill | o que ela ainda faz com o que for colado |
|---|---|
| `anunciar-imovel` | a ficha ou o link colado vira as duas versões do anúncio |
| `conferir-matricula` | a matrícula colada vira a lista do que consta nela |
| `gravar-video-do-imovel` | o imóvel colado vira o roteiro plano a plano |
| `documentos-do-negocio` | o tipo do negócio vira o checklist; some o que a carteira já tinha marcado |
| `responder-lead` | a conversa colada vira a mensagem; some o cruzamento com os imóveis da carteira |

E cinco não funcionam, porque o trabalho delas **é** a carteira:

| skill | do que ela depende |
|---|---|
| `comecar` | monta a carteira — sem transporte, não há onde montar |
| `o-que-fazer-hoje` | lê a carteira inteira para ordenar o dia |
| `retomar-contato` | conta os dias de silêncio e lê as retomadas anteriores |
| `montar-visita` | cruza o que o cliente já viu e por que descartou cada imóvel |
| `organizar-carteira` | é a manutenção da carteira |

**Quem trabalha sem gravar diz isso.** O `## Guardei` do fecho (seção 10) vira
uma linha só: `- nada foi gravado — você está sem carteira aqui`. Trabalho que o
corretor acha que ficou guardado e não ficou é pior que trabalho não feito.

E quem não funciona diz por quê em uma linha, sem pedir desculpa duas vezes:
“Isto lê a sua carteira inteira, e aqui eu não chego nela. No Claude Code, ou
com a carteira no Drive, funciona.”
