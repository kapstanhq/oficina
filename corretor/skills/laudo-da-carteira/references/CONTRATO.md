<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte são as seções em oficina/_motor/ e oficina/corretor/contrato/, que
     este script funde em oficina/corretor/CONTRATO.md — e daí sai esta cópia,
     por `npm run oficina -- --escrever`. Correção feita aqui é perdida na
     próxima geração, e correção feita no CONTRATO.md também: ele é montado.

     A cópia existe porque o padrão Agent Skills quer a referência DENTRO da
     skill, em references/ — é o que faz o pack funcionar fora do Claude
     Code, onde ${CLAUDE_PLUGIN_ROOT} não é substituído. -->

# O contrato da carteira

Este arquivo é o padrão comum das catorze skills do pack. Ele não é leitura de
apoio: é onde estão os formatos literais, e formato inventado por uma skill
quebra as outras treze.

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

**A marca tem gênero, e o ARTIGO se deriva dele.** `{item}` e `{pessoa}`
resolvem para um substantivo masculino num pack e feminino no seguinte — quem
escolhe é o `vocabulario.json`, e este arquivo não sabe qual virá. Por isso o
pack declara `item-genero` e `pessoa-genero`, e a fonte escreve `{o-item}`,
`{do-item}`, `{um-item}`, `{dos-itens}` em vez de colar o artigo na
marca. O nome usa a forma masculina como RÓTULO, não como valor.

**O adjetivo NÃO se deriva, e por isso se evita.** Prefira o verbo — `8
{pessoas} entraram` em vez de `8 {pessoas} novas` — e a oração ao
particípio — `{item} que veio de ficha` em vez de `{item} vindo de ficha`.
É a única regra do motor que só se vê depois de gerar, e **nenhum alarme
pega**: a fonte está correta, o erro nasce na geração. Por isso ela mora aqui:
quem a lê está escrevendo a fonte, que é onde ela se cumpre.

**E este arquivo também é montado.** Ele não se edita: as seções moram
partidas em dois lugares — `oficina/_motor/` guarda as que valem para qualquer
profissão (68,8% das linhas), e `oficina/<pack>/contrato/` as que mudam com o
ofício. `npm run oficina -- --escrever` funde as duas listas pela ordenação do
nome, e o `npm run conferir` acusa quem escrever aqui em vez de lá. Um pack de
outra profissão herda o primeiro diretório inteiro e escreve só o segundo.

---

## O que está aqui

```
1  onde a carteira mora — os dois transportes —, e quem é dono de qual fato
2  id e apelido — V-071 (casa 3 dorm, Azenha) — e o nome do arquivo
3  as três regras: não duplicar, procedência, aposentar
4  os formatos literais dos sete arquivos
5  os dois modos, e a exceção da matrícula
6  o que sai para o WhatsApp, e o que sai por e-mail
7  como a conversa entra, e como a mensagem sai
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
  _bruto/              conversas coladas, fichas, planilhas, PDFs, links — a ORIGEM
    2026-08-12-whatsapp-joana.md
    2026-08-19-planilha-imoveis.csv
  vistas/              o pedaço que UMA pessoa de fora pode ver (seção 4.8).
    C-017-joana-ribeiro.md   Derivado, refeito a cada execução, só de leitura
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

A linha `envio:` só existe quando `WhatsApp: sim`, e ela governa o que a seção
7.1 faz. Os três valores são `pergunta sempre` (o padrão, e o que vale se a
linha faltar), `responder sem perguntar` e `não`. Ela **não** se deriva do
`modo:` — envio é ato com terceiro, e quem ligou o automático para o trabalho
não ligou para a boca dele.

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
| gravar arquivo que já existe | edição — troca o trecho, não reescreve tudo | **não existe** — ver o aviso abaixo |
| criar pasta | a escrita já cria o caminho | criar pasta, com a pasta pai declarada |
| listar uma pasta | busca por nome dentro do caminho | procurar com a pasta como pai |
| guardar um bruto | escrever o `.md` novo em `_bruto/` | criar arquivo `.md` na pasta `_bruto/` |

Duas diferenças mudam o que a skill faz, não só como faz:

- **No `drive` não se atualiza arquivo — e isto não é limitação da skill, é da
  ferramenta.** O schema do conector diz, com todas as letras, *"currently only
  title and parent_id are supported"*: a atualização troca o NOME e a PASTA, e
  não tem parâmetro de conteúdo. Ela não devolve erro — devolve sucesso e não
  muda um byte. E a leitura não lista `text/markdown` entre os tipos que suporta:
  o `.md` que hoje é lido é comportamento não documentado, que já mudou uma vez.
  **Enquanto isso valer, a carteira no `drive` pode ser criada e não pode ser
  mantida** — e quase toda skill existe para mudar arquivo que já existe.
  Uma skill que precise gravar por cima em `drive` PARA e diz isso ao corretor;
  não tenta, não contorna com criar-e-substituir (dois arquivos de mesmo título
  na mesma pasta, e a busca não desempata) e não finge que gravou.
- **`_bruto/` continua intocável nos dois.** No `drive`, isso quer dizer que o
  bruto se cria e nunca se atualiza — e é a única operação que o `drive` faz
  inteira.

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
de”, nunca um número de imóvel que se pareça. O `?` pode levar na procedência o que
resolve ele:

```
condomínio: ?  ← pedir ao proprietário
iptu: ?  ← está na matrícula, que ainda não chegou
e-mail: ?
```

Campo inventado com cara de apurado é pior que campo vazio: o corretor repassa
para o cliente e descobre na visita. E o `?` é a linha mais útil do arquivo —
é o que a próxima skill vai perguntar.

**Fato novo que contradiz o gravado:** o novo vale, com a procedência dele, e
o antigo desce para `## Histórico` com a procedência que tinha — nada se
apaga. Em copiloto a skill mostra os dois antes de trocar; em automático troca
e declara (seção 5).

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

**E o mesmo vale para o que está entre `<` e `>`.** Os gabaritos marcam assim
o que se preenche: `<AAAA-MM-DD>`, `<nome do corretor>`, `<V-000 (apelido,
bairro)>`. **Nenhum `<…>` chega ao corretor.** Ou vira o valor, ou vira `?`
pela regra do não-apurado (seção 3) — e data nunca vira `?`, porque a data de
hoje sempre se sabe.

Isto é regra e não zelo: medido montando uma carteira do zero, o `hoje.md`
nascia com `# Hoje — <AAAA-MM-DD>` e ficava assim, porque nenhum passo o toca
depois de copiá-lo. Os outros três só escapavam quando o corretor NÃO pulava
os passos que preenchem as vistas — e esses passos são puláveis. O comentário
some e o esqueleto do gabarito fica: o arquivo que ele abre todo dia começa
com um campo de formulário em branco.

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
WhatsApp: sim  ← testado 2026-08-31
envio: pergunta sempre

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

**Planilha importada entra inteira, e é o arquivo original.** O nome é
`AAAA-MM-DD-planilha-<nome-curto>.csv`, sem o cabeçalho de três linhas — ele é
para texto colado, e aqui o arquivo já diz o que é. O formato é CSV: Excel e
Google Sheets exportam em dois cliques, e a skill que importa ensina onde. Todo
campo que sair dela leva `← _bruto/AAAA-MM-DD-planilha-<nome-curto>.csv`,
que é a regra 2 sem origem nova. Coluna que não tem campo no gabarito não
inventa campo (seção 4), e linha que a skill não conseguiu ler vira `?` na
ficha e uma linha em `## Falta saber` — nunca um valor adivinhado. Quem importa
é `/corretor:comecar`, no primeiro dia, e `/corretor:organizar-carteira`, para
o `.csv` que apareceu em `_bruto/` depois.

---

## 4.8 · A vista, que é a carteira vista de fora

A carteira é do corretor e mora com ele. **A vista é o pedaço dela que uma
pessoa de fora pode ver** — e é a única coisa da carteira que sai do computador.

```
~/carteira/
  vistas/
    C-017-joana-ribeiro.md      uma vista por cliente, o mesmo id e o mesmo apelido
```

### Ela é DERIVADA, e é por isso que ela existe

Nada se escreve numa vista à mão. Ela é montada a partir dos arquivos donos, do
`funil.md` e do `hoje.md`, e é refeita inteira a cada execução — como o
`_indice.md` e o `funil.md`, e pela mesma razão: **duas fontes divergem na
primeira correção**, e aqui a divergência seria visível para alguém de fora.

Consequência prática: **apagar a vista não perde nada.** Se ela sumir, a próxima
execução a refaz. É o que a torna segura de compartilhar.

### O que entra, e o que nunca entra

| entra | nunca entra |
|---|---|
| o que está pendente, com dono e data | qualquer coisa de `_bruto/` |
| o que já foi entregue, com data | o que outro cliente disse ou fez |
| o que foi combinado, nas palavras do combinado | preço de custo, margem, comissão |
| o que falta decidir, e de quem é a decisão | o `?` que é dúvida interna do corretor |
| o link do que já é público | anotação de estratégia, ou de como negociar |

**A regra que resolve o caso duvidoso:** entra o que essa pessoa **já sabe ou já
deveria saber**. A vista não conta nada de novo — ela organiza o que já foi
combinado com ela. Se uma linha da vista pode surpreender quem a lê, ela está no
arquivo errado.

**O `_bruto/` nunca sai, em nenhuma hipótese.** Ele é a conversa inteira, o
e-mail encaminhado, o documento de terceiro. A vista é derivada dele, e derivar
é justamente o que separa o que pode sair do que não pode.

### O formato

```markdown
# o que falta para fechar o negócio — quem entrega cada documento, e o que já chegou

Atualizado em 2026-09-09 por corretor.

## Falta

- [ ] <o quê> — com <quem> — pedido em <data>
- [x] <o que já chegou> — em <data>

## Combinado

- <uma linha por combinado, com a data em que foi combinado>

## Onde estamos

<uma linha, em português, sem jargão de etapa>
```

`## Falta` é a única seção obrigatória: uma vista sem pendência é uma vista que
diz "nada com você agora", e isso também é informação.

**Sem etapa de funil, sem id solto e sem sigla.** `V-071 (casa 3 dorm, Azenha)` vira o
apelido; a etapa vira uma frase. Quem lê a vista não conhece o vocabulário da
carteira, e não deveria precisar conhecer.

### Quem escreve, e quem lê

Escreve o corretor, sempre — pela skill. **Quem recebe tem acesso de
leitura, nunca de escrita.** Duas pessoas escrevendo no mesmo arquivo é o
momento em que a carteira deixa de ter dono, e o contrato inteiro se apoia em
ela ter um.

Se a pessoa de fora responder, ela responde pelo canal de sempre — e aquilo
entra em `_bruto/` como qualquer conversa.

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

**O bloco tem duas saídas, e a segunda depende do conector** (seção 7.1). Sem
conector — que é o caso em toda ferramenta de chat na web — existe só a
primeira, e ela é o padrão:

```
Eu mesmo mando     o corretor copia o bloco e cola no WhatsApp dele
Mando agora        a skill envia, depois de ele ver o texto e o destinatário
Mudo o texto       ele diz o que trocar, e nada sai agora
```

O rótulo diz o que a PESSOA vai fazer, nunca o nome interno da peça: “Eu mesmo
mando” e não “só o bloco”.

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

## 7 · Como a conversa entra

Há dois caminhos, e quem diz qual é a linha `WhatsApp:` do `INDICE.md`
(seção 4.1). **O padrão é colado**, e é o único que funciona em toda
ferramenta: o corretor exporta ou cola, e a skill lê os dois formatos que
chegam. O conector é opcional, não existe em metade dos lugares onde o pack
roda, e **nenhuma skill o exige** — skill que só funciona com ele quebrou o
contrato.

O caminho muda; o formato não. Conversa que entrou pelo conector e conversa
que entrou colada produzem o **mesmo** arquivo em `_bruto/`, com a mesma
procedência (seção 3). Nenhuma das outras precisa saber por onde ela veio,
e é isso que impede o conector de virar um segundo pack.

| a operação | colado | pelo conector |
|---|---|---|
| trazer a conversa de um cliente | o corretor exporta ou cola | achar a conversa pelo telefone do arquivo do cliente e ler o período que interessa |
| saber quando foi a última mensagem | está no que ele colou | pergunta-se à conversa |
| guardar em `_bruto/` | igual nos dois | igual nos dois |

**O conector lê sempre, e manda uma por vez** — nunca em lote, e nunca sem o
corretor ter visto o texto e o nome de quem recebe. Como isso funciona está em
7.1. O bloco para copiar **continua sendo o padrão**: é o que funciona em toda
ferramenta, e onde não há conector ele é a única saída.

### O pré-voo, e ele é obrigatório

**A primeira chamada ao conector, em qualquer skill, é `estado_da_ponte`.** Não
é zelo: a ponte é um programa que fica de pé numa janela, e janela fechada
congela o histórico no minuto em que ela fechou. Nada avisa. O que se lê depois
disso é um retrato do passado com cara de presente — e uma skill que ordena o
dia sobre ele entrega uma lista confiante e errada.

Ela responde em uma linha o que importa, e a ação sai daí:

```
de pé e conectada          trabalhe, e não diga nada ao corretor
de pé e desconectada       diga o que ela reporta, em uma linha, e siga com o
                           que já está guardado — dizendo que é isso que é
fora do ar, ou parada há   PARE de tratar o conector como fonte. Diga há quanto
mais de um dia             tempo, que o que passou não volta, e que a janela do
                           `serve` precisa ser reaberta. Depois ofereça o
                           caminho colado, que funciona igual
```

**Silêncio só se justifica quando está tudo certo.** Ponte velha e trabalho
normal é o único par que o corretor não pode ver, porque é o único em que
ele acharia que a carteira está em dia.

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
entra — dado que se adivinhou vira preço errado na mensagem para o cliente.

---
## 7.1 · Como a mensagem sai

Isto vale **só com o conector** (`WhatsApp: sim` no `INDICE.md`). Sem ele, a
skill entrega o bloco e para — e não pede desculpa por isso.

**A regra que governa tudo aqui: a ferramenta informa, e o corretor decide.**
Ela recusa o que ele não pediu, nunca o que ele pediu. Isso separa três coisas
que se confundem com facilidade:

```
escolha dele   usar o envio ou não, mandar para quem não respondeu, dizer ao
               programa dele para não perguntar mais
               → avise UMA VEZ, quando ele liga, e obedeça

erro           a skill mostrou um texto e mandou outro; a prévia envelheceu e o
               cliente já respondeu no meio-tempo
               → a ponte recusa, porque ninguém escolheu isso

lote           mesma mensagem para vários, lista de transmissão
               → não existe: a ferramenta aceita UMA conversa por chamada
```

### O par que sai, sempre nesta ordem

```
preparar_envio    devolve um código de prévia e o texto exato que vai sair
enviar_mensagem   exige esse código, a mesma conversa e o mesmo texto
```

Entre as duas, a skill **mostra ao corretor**, e o que ela mostra tem três
partes obrigatórias — é o pedido literal, e resumo não serve:

```
para    o nome como ele conhece a pessoa, o id com apelido, e quando ela
        falou pela última vez
texto   INTEIRO, do jeito que vai sair. Nunca “a resposta que combinamos”
saídas  Mando agora · Mudo o texto · Eu mesmo mando
```

A prévia vale **10 minutos** e serve **uma vez**. Ela morre se chegar mensagem
nova naquela conversa depois de criada — senão o corretor responde pelo celular
e a skill manda a resposta velha logo atrás.

### Várias de uma vez não é lote

Uma skill pode mostrar quatro mensagens e o corretor aprovar as quatro numa
tela. Isso **não** é lista de transmissão, e a diferença é de forma:

```
lista de transmissão   uma mensagem, mesmo texto, muitos destinatários, junto
várias revisadas       N mensagens DIFERENTES, uma por pessoa, com o dado dela
                       dentro, saindo uma a uma e espaçadas
```

Quando mostrar várias, mostre **o texto inteiro de cada uma** — nunca “4
mensagens aguardando” — e o **porquê de cada uma estar ali**. Quem ficou de
fora aparece com o motivo: descarte em silêncio é o que faz o corretor parar de
confiar na lista.

Os rótulos da tela de várias são estes quatro, e valem para toda skill que
mostrar mais de uma — quem inventar um quinto reabre o problema que “Só o
bloco” criou:

```
Mando todas      uma por vez, espaçadas, na ordem mostrada
Escolho quais    ele diz os números que vão
Uma por uma      cada uma volta a aparecer antes de sair
Eu mesmo mando   ele copia os textos
```

### O que a ponte recusa, e o que ela só avisa

```
recusa    mais de uma conversa por chamada
          texto ou destinatário diferentes do que a prévia carimbou
          prévia vencida, usada duas vezes, ou com mensagem nova por cima
          grupo, canal e comunidade — o destinatário deixa de ser um
          quem está na lista de não contatar
avisa     o teto da hora, com o número e como mudá-lo
          que o destinatário nunca respondeu — é o caso de maior risco
          que não existe conversa nenhuma com aquela pessoa — e esse é outro
```

### O primeiro contato, que não é escolha de ninguém

Quem **nunca trocou mensagem** com o corretor por ali é o único caso em que
o envio não sai, e a recusa não é da ferramenta: **desde julho de 2026 o próprio
WhatsApp recusa**, e salvar o número na agenda não muda nada. Quem abre a
conversa tem que ser o aplicativo do celular, uma vez; depois disso o conector
responde como em qualquer outra.

A prévia diz isso **antes**, quando vê que a conversa não existe. Ao ouvir,
a skill não insiste e não tenta outro caminho: ela entrega o **bloco para
copiar** — que é o padrão do pack de qualquer forma — e diz, em uma linha, que
a primeira mensagem sai do celular dele.

Não é raro: é como quase todo cliente chega da primeira vez — o que deixou o telefone
num portal e nunca escreveu.

### Quem pediu para não ser contatado

O cliente que diz “não me manda mais mensagem” tem que sair do alcance de todas
as skills, e não só da que ele respondeu. São **dois lugares, e os dois são
obrigatórios**:

```
na carteira   o arquivo do cliente ganha  não contatar: sim  ← origem, data
              e ele é aposentado com esse motivo (seção 3)
na ponte      um comando, e é ele que escreve o arquivo — o diretório dela
              não é o da carteira, e a skill não tem como adivinhar onde é:

                  whatsapp-reader nao-contatar 5551999998888 "pediu em 12/08"

              sem argumento ele lista; `--tirar <número>` desfaz
```

A carteira é o que as catorze skills leem; a ponte é o que segura o envio mesmo se
alguém esquecer. **Nenhuma skill escreve mensagem para quem tem `não contatar:
sim`**, nem para retomar, nem para avisar do que entrou, nem para desejar
feliz aniversário. Não é preferência de canal: é pedido de silêncio.

Quem coloca é o corretor, ou a skill que leu o pedido na conversa — e aí ela
diz o que fez, em uma linha, porque tirar alguém da carteira é do tamanho de
aposentar.

Os tetos de partida são 6 conversas diferentes por hora, 30 envios no total e 5
segundos entre dois quaisquer. **São ajustáveis, e o número certo sai do
histórico do próprio corretor.** Recusa que não diz o número nem como mudá-lo
está impedindo em vez de informar.

### Envio não é governado pelo `modo:`

O `modo:` da seção 5 governa **escolha** — qual imóvel entra, qual caminho
seguir. Envio é ato com terceiro e não se desfaz, então tem linha própria no
`INDICE.md` (seção 4.1):

```
envio: pergunta sempre           o padrão, e o que vale se a linha faltar
envio: responder sem perguntar   responde conversa viva direto; começar
                                 conversa continua perguntando
envio: não                       a skill nem oferece
```

Corretor em `modo: automatico` **não herda** envio automático: quem ligou o
automático para o anúncio não ligou para a boca dele.

### O que nunca sai por aqui

```
áudio, foto, documento e anexo    a ponte não os manda
preço novo, contraproposta,       a skill não decide preço nem avalia proposta
aceite ou recusa de proposta      (seção 10)
prazo de banco, cartório          a skill não promete prazo de terceiro
ou prefeitura
reenvio porque não respondeu      cadência é decisão, não relógio: o caminho é
                                  /corretor:retomar-contato, com ângulo novo
```

---

## 8 · Quando perguntar, e como

Perguntar cedo demais é o defeito mais caro do pack: o corretor já respondeu
aquilo, está escrito na carteira, e a skill perguntou de novo.

### A ordem de busca

Só desce um degrau quando o de cima não respondeu:

```
1  INDICE.md                 quem ele é, modo, o que está conectado
2  o _indice.md do tema      imoveis/ ou clientes/ — acha o id e o apelido
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

Nesta ordem. **O `## Guardei` é obrigatório e não some nunca**; as outras duas
só aparecem se tiverem conteúdo.

Não gravou nada — porque não havia o que gravar, porque não há carteira, ou
porque o que ela ia fazer não deu certo? Então o `## Guardei` traz uma linha
dizendo isso, com o motivo:

```markdown
## Guardei
- nada foi gravado — não havia o que guardar nesta rodada
```

Omitir a seção é o que faz o corretor achar que ficou guardado, e a regra
aqui é a mesma do "escreveu, diz onde", virada do avesso: **ele precisa saber
que NÃO ficou.** E o título é este, sempre — `## Não gravei nada` e
`## Nada foi guardado` são títulos inventados, e título inventado é o que a
seção 4 proíbe. Medido: duas skills inventaram o próprio na primeira
execução da prova, as duas por terem feito a coisa certa e nomeado errado.

**Cinco skills não têm bloco para colar, e a razão é a mesma nas cinco: o
trabalho delas não é um texto para o cliente.**

```
/corretor:comecar              o trabalho é a configuração
/corretor:o-que-fazer-hoje     o trabalho é a lista do dia
/corretor:organizar-carteira   o trabalho é o relatório do que mudou
/corretor:laudo-da-carteira    o trabalho é o laudo, e ele não sai daqui
/corretor:importar-a-conversa  o trabalho é o relatório do que entrou
```

**Quatro delas acrescentam seção ao fecho, e a seção acrescentada É o
trabalho.** Na `comecar` o lugar do bloco é ocupado por `## O que ficou pronto`,
mais `## Ficou para depois` e `## O que pedir agora`. A `organizar-carteira`
traz os títulos do que tocou. O `laudo-da-carteira` traz um título por pergunta
da régua, e a `importar-a-conversa` um por destino do que leu — inclusive o do
que ela **não** leu, que é o mais importante dos dela.

**Fora essas quatro, nenhuma skill acrescenta seção ao fecho**, e nenhuma das
cinco oferece a segunda saída da seção 7.1, porque não há mensagem para mandar.

A ordem dos três títulos fixos não muda em nenhuma delas: o que a skill
acrescenta vem ANTES do `## Guardei`, nunca entre ele e o `## Falta saber`.

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
- mandar mensagem **sozinha**: sem conector ela escreve e quem manda é o
  corretor; com conector ela manda uma por vez, e só depois de ele ver o texto
  e o nome de quem recebe (seção 7.1)
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
  tudo funciona no transporte `local`, que é o único em que a carteira
  se MANTÉM. Ver o aviso da seção 1: no `drive` a carteira se cria e
  não se atualiza

chat do Claude e chat do ChatGPT na web
  não há pasta no computador, e o `drive` não substitui uma: funcionam
  as CINCO skills que trabalham com o que for COLADO na conversa, e as
  cinco que dependem da carteira não funcionam — nem com Drive ligado

o conector de WhatsApp (seções 7 e 7.1)
  só onde há linha de comando: Claude Code, Codex CLI, Cursor. Nos chats
  da web não existe, e lá a conversa entra colada como sempre — o que não
  tira nenhuma skill do ar. Ler e ENVIAR andam juntos: onde ele existe, as
  duas coisas existem; onde não existe, o bloco para copiar é a saída, e é
  ela que nunca falta
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
