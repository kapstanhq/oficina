# O contrato da carteira

Este arquivo é o padrão comum das dez skills do pack. Ele não é leitura de
apoio: é onde estão os formatos literais, e formato inventado por uma skill
quebra as outras nove.

Quem lê isto é o Claude executando uma skill. Quem lê o que sai dela é um
prospector B2B com pressa, que não é técnico e não vai depurar nada.

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
2  id e apelido — E-071 (VetorBank, Porto Alegre) — e o nome do arquivo
3  as três regras: não duplicar, procedência, aposentar
3.1 por que se pode escrever para quem não pediu, e o que isso cobra
4  os formatos literais dos nove arquivos
5  os dois modos, e a exceção do não-perturbe
6  o que sai para o WhatsApp, e o que sai por e-mail
7  como a conversa entra, e como a mensagem sai
7.2 quem pediu para não ser procurado
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
  contas/
    _indice.md         uma linha por conta
    E-071-vetorbank.md
  contatos/
    _indice.md         uma linha por contato
    P-017-carla-menezes.md
  _bruto/              conversas coladas, fichas, planilhas, PDFs, links — a ORIGEM
    2026-08-12-linkedin-carla.md
    2026-08-19-planilha-contas.csv
  vistas/              o pedaço que UMA pessoa de fora pode ver (seção 4.8).
    P-017-carla-menezes.md   Derivado, refeito a cada execução, só de leitura
  arquivo-morto/
    contas/
    contatos/
```

Essa árvore é a mesma nos dois transportes de que trata esta seção: **o formato
dos arquivos não muda com o lugar onde eles moram.** Os sete gabaritos, a
procedência, os ids com apelido, as etapas e os tetos são idênticos no
computador e no Drive. O que muda é só como se lê e como se grava — e confundir
o conteúdo com o transporte é o que faria uma skill virar duas.

Neste documento, `~/carteira/…` é o modo curto de nomear o lugar, qualquer que
seja o transporte. É assim que se fala com o prospector no `local`; no `drive`,
diga “a pasta `carteira` do seu Drive”.

### Os dois transportes

```
local    uma pasta no computador do prospector
drive    uma pasta no Google Drive dele, pelo conector
```

Quem escolhe é o prospector, uma vez, no `/prospeccao:comecar`. **Nenhuma skill
troca o transporte, e nenhuma trabalha em dois ao mesmo tempo.**

**No `local`**, `~` é a pasta pessoal do prospector. No Windows é
`C:\Users\<nome>`, no Mac é `/Users/<nome>`, no Linux é `/home/<nome>`. **Toda
chamada de ferramenta usa caminho absoluto** — caminho relativo depende de onde
a sessão abriu, e a sessão abre em qualquer lugar. Ao falar com o prospector,
escreva `~/carteira/…`, que é curto e ele entende.

**No `drive` não existe caminho.** Pasta é um item com id, e arquivo é filho de
uma pasta. `/carteira` é o **nome** da pasta na raiz do Drive dele, não um
caminho que se entrega a uma ferramenta: achar `contas/_indice.md` é achar a
pasta `carteira`, achar a pasta `contas` dentro dela e procurar `_indice.md`
ali dentro. Guarde o id de cada pasta que abrir — reprocurar a mesma pasta a
cada operação é o que faz a execução demorar.

**A busca é sempre presa à pasta.** `_indice.md` existe duas vezes na carteira,
em `contas/` e em `contatos/`, e procurar pelo nome solto devolve os dois. Sem
saber de qual pasta veio, a skill grava a lista de contas por cima da lista de
contatos.

**Os arquivos são texto, com extensão `.md`.** Nada é convertido para documento
do Google: o que volta de um documento convertido não é o que foi escrito, e o
contrato inteiro depende de a linha voltar como saiu.

### A linha `carteira:` do `INDICE.md`

É ela que diz o transporte e o lugar, e é a primeira coisa que a skill lê:

```
carteira: local · C:\Users\renata\carteira
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
  Uma skill que precise gravar por cima em `drive` PARA e diz isso ao prospector;
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
| a gravação falhou | diz qual arquivo não foi gravado, com o lugar, e o que ele deveria conter. O prospector precisa saber o que ficou de fora |

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
   coisa só — diz isso em uma linha e manda rodar `/prospeccao:comecar`, que é
   quem pergunta o transporte. Vale em `local` e em `drive`

Não cria a carteira por conta própria, não trabalha sem ela, não improvisa em
outra pasta. Depois do `INDICE.md` vem a linha `modo:` (seção 5), e então a
ordem de busca da seção 8.

### Quem é dono do quê

Um fato tem um dono, e só o dono é editado à mão:

| arquivo | é | quem manda |
|---|---|---|
| arquivo da conta | **dono** dos fatos da conta | ele |
| arquivo do contato | **dono** dos fatos do contato, inclusive `etapa:` | ele |
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
toda mensagem para o prospector: `E-071 (VetorBank, Porto Alegre)`. Nunca só
`E-071`, nunca só “o banco de Porto Alegre”.

O id existe para o arquivo e o link não quebrarem quando a empresa mudar de
nome — e ela muda, por fusão, por rebranding, por mudança de razão social. O
apelido existe para o prospector saber de quem se fala sem abrir nada. Os dois
juntos, sempre — inclusive dentro de listas, de tabelas e do histórico.

```
E-   conta (a empresa)     E-071
P-   contato (a pessoa)    P-017
```

Número sequencial de três dígitos, por prefixo. **Id não se reaproveita**, nem
depois que a conta vai para `arquivo-morto/`: o próximo é sempre o maior já
usado mais um, contando o arquivo morto junto. Para achar o maior, leia o
`_indice.md` do tema — ele lista os vivos e os aposentados.

**Uma conta, um id — mesmo com dois CNPJs.** Grupo com holding e operadora,
matriz e filial, duas razões sociais no mesmo prédio: se quem decide é a mesma
pessoa, é uma conta. Se são decisões separadas, são duas, e cada uma tem o
próprio contato. Na dúvida, pergunte — abrir duas contas para o mesmo comprador
faz a mesma abordagem sair duas vezes, e é assim que se queima um nome.

### O apelido

- conta: `<empresa>, <cidade>` — `VetorBank, Porto Alegre`, `Móveis Bertoldo,
  Bento Gonçalves`. O nome que a empresa usa, não a razão social: quem lê é
  gente, e ninguém reconhece “Bertoldo Indústria e Comércio de Móveis Ltda”.
- contato: nome e sobrenome como ele assina — `Carla Menezes`.

### O nome do arquivo

Id, hífen, apelido em minúsculas, sem acento, sem vírgula, palavras ligadas por
hífen. Na conta, **só a empresa** — a cidade fica de fora, porque ela muda menos
que o nome e o arquivo já é único pelo id:

```
E-071 (VetorBank, Porto Alegre)              → E-071-vetorbank.md
E-083 (Móveis Bertoldo, Bento Gonçalves)     → E-083-moveis-bertoldo.md
P-017 (Carla Menezes)                        → P-017-carla-menezes.md
```

Apelido mudou? O arquivo **não** é renomeado — o link do índice quebraria e o
histórico ficaria órfão. Muda-se o apelido no título dentro do arquivo e nas
vistas; o nome do arquivo fica como nasceu.

---

## 3 · As três regras

### Regra 1 · Se dá para derivar, não se duplica

O arquivo guarda **fato**; `_bruto/` guarda a **origem**. A conversa inteira
nunca entra no arquivo do contato — entra em `_bruto/`, e o arquivo fica com as
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
telefone: +55 51 99999-0000  ← _bruto/2026-08-12-linkedin-carla.md
área: 120 m²  ← ficha colada, 2026-08-12
prazo: quer mudar até dezembro  ← prospector, 2026-08-19
```

As origens possíveis, e não há outras:

```
link              a página da conta que o prospector colou (a URL fica no campo link:)
ficha colada      o texto da ficha, quando o site não devolveu nada
_bruto/<arquivo>  conversa, e-mail ou documento que está em _bruto/
prospector          o próprio prospector disse agora, na conversa com a skill
site              a página da conta, lida com o link no campo site:
LinkedIn          o perfil público da conta ou do contato
```

**O que não se apurou entra como `?`.** Nunca uma estimativa, nunca “por volta
de”, nunca um número de conta que se pareça. O `?` pode levar na procedência o que
resolve ele:

```
funcionários: ?  ← olhar no LinkedIn da conta
faturamento: ?  ← não é público; perguntar na reunião
e-mail: ?
```

Campo inventado com cara de apurado é pior que campo vazio: o prospector repassa
para o contato e descobre na reunião. E o `?` é a linha mais útil do arquivo —
é o que a próxima skill vai perguntar.

**Fato novo que contradiz o gravado:** o novo vale, com a procedência dele, e
o antigo desce para `## Histórico` com a procedência que tinha — nada se
apaga. Em copiloto a skill mostra os dois antes de trocar; em automático troca
e declara (seção 5).

Data sempre em `AAAA-MM-DD`. É a única forma que ordena sozinha e em que
`12/08` não vira agosto de um lado e dezembro do outro. Ao FALAR com o prospector,
escreva `12 de agosto`; ao ESCREVER no arquivo, `2026-08-12`.

### Regra 3 · O que morre é aposentado com data e motivo

Gaveta, não lixeira. **Nenhuma skill apaga arquivo da carteira, nunca.**

Aposentar é isto, nesta ordem:

1. no alto do arquivo, logo abaixo do título, entra uma linha:
   `aposentado: 2026-08-19 · motivo: disse não por escrito, em 2026-08-19`
2. o arquivo é movido para `arquivo-morto/contas/` ou `arquivo-morto/contatos/`
3. no `_indice.md`, a linha sai da tabela de cima e entra em `## Arquivo morto`,
   com o desfecho em uma linha
4. some do `funil.md` e do `hoje.md`, que são vistas dos vivos

Quando aposentar, sem inventar outros critérios: conta que disse não por escrito, que fechou
com outro fornecedor, que saiu do perfil ou que está sem responder há
**90 dias**; contato que pediu silêncio, ou que saiu da empresa. Contato parado há menos que isso
não é morto — é assunto de `/prospeccao:retomar-contato`.

Aposentar em modo automático é permitido para o prazo de 90 dias. Aposentar por
qualquer outro motivo é decisão do prospector, mesmo no automático.

---

### 3.1 · Por que se pode escrever para quem não pediu

Este pack existe para escrever a alguém que não pediu para ser escrito. Isso é
legal no Brasil, e é legal sob **condições** — e as condições não são
formalidade: elas são o que separa prospecção de spam, e é a mesma linha que
separa a resposta de uma reunião marcada.

**A base é o legítimo interesse** (LGPD, art. 7º, IX) — não o consentimento.
Consentimento é o que você não tem e não vai ter: ninguém consente antes de
saber que você existe. O legítimo interesse cobre o tratamento de dado pessoal
para finalidade legítima, concreta e informada, e ele só vale **enquanto a
expectativa do titular for razoável**.

Na prática, e é isto que o pack cumpre:

```
dado profissional, e só ele    nome, cargo, e-mail e telefone corporativos,
                               empresa. NUNCA CPF, endereço residencial,
                               dado de família, foto pessoal, opinião
                               política, saúde ou qualquer dado sensível
                               (art. 11) — para esses o legítimo interesse
                               NÃO serve, e não há exceção neste pack

origem escrita, sempre         de onde veio o nome, e quando. É a regra 2
                               do contrato, e aqui ela também é a prova de
                               que o dado não foi comprado de lista

finalidade dita na mensagem    a primeira mensagem diz quem você é e por que
                               está escrevendo. Abordagem que esconde o
                               motivo não tem legítimo interesse nenhum

saída fácil, e cumprida        uma linha de como parar de receber, e o
                               `nao-perturbe.md` da seção 7.2, que é o
                               art. 18 virado arquivo
```

**O teste que isso obriga**, e ele se faz antes de escrever, não depois: a
finalidade é legítima? O dado é o mínimo para ela? A pessoa esperaria ser
procurada assim, no canal profissional dela, sobre o trabalho dela? Se a
resposta a qualquer uma for não, **não se escreve** — e a skill diz por quê,
em uma linha.

**O que ele proíbe, e nenhuma skill contorna:**

- **lista comprada não entra na carteira.** Nem “base enriquecida”, nem
  planilha de mailing, nem raspagem em massa. A origem de cada nome tem de
  caber numa linha que você diria em voz alta para o titular
- **nada de dado sensível**, nem “para qualificar melhor”
- **nada de e-mail pessoal** quando existe o corporativo
- **nada de mandar de novo para quem pediu para parar** — e “parar” inclui o
  não que veio em uma linha seca

Nada disto é conselho jurídico, e este arquivo não substitui advogado. É o
recorte que o pack cumpre por padrão, escrito para você saber o que ele faz
sozinho e o que continua sendo decisão sua.

---

## 4 · Os formatos, literais

Sete arquivos, sete gabaritos. O que vale como formato é o que está abaixo, e
`/prospeccao:comecar` copia os vazios de `modelos/`. Campo que não existe no
gabarito não se inventa: se o prospector trouxe um fato que não cabe em lugar nenhum, ele vai
para `## Histórico` com a data.

Nenhum arquivo da carteira tem frontmatter YAML. O cabeçalho é linha de
`campo: valor`, que o prospector lê sem saber que é um formato.

Os gabaritos ficam em `references/modelos/`, dentro da própria skill, e vão para
cá:

```
modelos/INDICE.md             → ~/carteira/INDICE.md
modelos/hoje.md               → ~/carteira/hoje.md
modelos/funil.md              → ~/carteira/funil.md
modelos/_indice-contas.md     → ~/carteira/contas/_indice.md
modelos/_indice-contatos.md   → ~/carteira/contatos/_indice.md
modelos/conta.md              → ~/carteira/contas/<id>-<apelido>.md      (uma por conta)
modelos/contato.md            → ~/carteira/contatos/<id>-<apelido>.md    (um por contato)
modelos/perfil.md             → ~/carteira/perfil.md
modelos/nao-perturbe.md       → ~/carteira/nao-perturbe.md
```

Cada modelo abre com um comentário `<!-- MODELO · … -->` explicando o que
preencher. **Ao gravar de verdade, esses comentários saem** — todos. Modelo que
chega ao prospector com o próprio manual dentro parece arquivo pela metade.

**E o mesmo vale para o que está entre `<` e `>`.** Os gabaritos marcam assim
o que se preenche: `<AAAA-MM-DD>`, `<nome do prospector>`, `<E-000 (empresa,
cidade)>`. **Nenhum `<…>` chega ao prospector.** Ou vira o valor, ou vira `?`
pela regra do não-apurado (seção 3) — e data nunca vira `?`, porque a data de
hoje sempre se sabe.

Isto é regra e não zelo: medido montando uma carteira do zero, o `hoje.md`
nascia com `# Hoje — <AAAA-MM-DD>` e ficava assim, porque nenhum passo o toca
depois de copiá-lo. Os outros três só escapavam quando o prospector NÃO pulava
os passos que preenchem as vistas — e esses passos são puláveis. O comentário
some e o esqueleto do gabarito fica: o arquivo que ele abre todo dia começa
com um campo de formulário em branco.

### 4.1 · `INDICE.md`

O mapa e a configuração. Toda skill lê este arquivo antes de qualquer coisa.
Teto: **120 linhas**.

```markdown
# Carteira de Renata Vasques

carteira: local · C:\Users\renata\carteira
modo: copiloto
atualizado: 2026-08-19

## Quem sou — é esta a voz das mensagens
nome: Renata Vasques
cargo: sócia
telefone: +55 11 99888-7766
empresa: Vasques Analytics
o que eu vendo: painel de dados e automação de fechamento
setores em que já vendi: financeiro, indústria moveleira, saúde
assinatura de e-mail: Renata Vasques · Vasques Analytics · vasquesanalytics.com.br

## Onde está o quê
perfil.md        quem vale a pena, por quê, e o que desqualifica
hoje.md          o que vence, o que travou, o que prometeram e não mandaram
funil.md         quem está em que etapa, desde quando
nao-perturbe.md  quem pediu para não ser procurado — lido antes de toda mensagem
contas/          _indice.md tem a lista; um arquivo por conta
contatos/        _indice.md tem a lista; um arquivo por contato
_bruto/          conversas coladas, páginas e planilhas — a origem, não a verdade
arquivo-morto/   o que foi aposentado, com data e motivo

## Quanto tem (recontar ao gravar)
contas a estudar: 12
contas a abordar: 8
contatos ativos: 21
aposentados: 8

## O que está conectado
Google Agenda: sim  ← testado 2026-08-19
Gmail: sim  ← testado 2026-08-19
Google Drive: não — pulado no começo
WhatsApp: não
envio: pergunta sempre

## Como eu trabalho
canal padrão de primeira abordagem: e-mail
canal padrão depois que responde: WhatsApp
horário de reunião que costumo oferecer: terça e quinta, 9h ou 15h
quantas abordagens novas por dia: 5

## Pulado no começo
- ligar o Google Drive — 2026-08-19
```

`carteira:` é a linha da seção 1 — o transporte e o lugar. `modo:` é a linha da
seção 5. `## Quem sou` é o que assina as mensagens, e `o que eu vendo:` é o que
a abordagem tem de conseguir dizer em uma linha. `## Pulado no começo` é a lista
que `/prospeccao:comecar` deixa para depois, e qualquer skill pode oferecer
retomar um item dela — uma vez, sem insistir.

**`quantas abordagens novas por dia:` é um teto, não uma meta.** Ele existe para
a lista do dia parar de crescer, e nenhuma skill o ultrapassa por achar que a
carteira está cheia.

### 4.2 · `hoje.md`

Vista derivada, reescrita por `/prospeccao:o-que-fazer-hoje`. Quatro seções,
nesta ordem, e nenhuma outra. Toda linha é uma caixa de marcar e cita id com
apelido.

```markdown
# Hoje — 2026-08-19

## Vence hoje
- [ ] Reunião 15h com P-017 (Carla Menezes), E-071 (VetorBank, Porto Alegre) — confirmar antes
- [ ] Responder P-024 (Paulo Tavares) — respondeu ontem e não teve retorno

## Travado
- [ ] E-083 (Móveis Bertoldo, Bento Gonçalves) — estudada em 2026-08-11 e sem abordagem desde então
- [ ] P-019 (Rui Baptista) — sem e-mail; a abordagem só sai pelo LinkedIn

## Prometido e não chegou
- [ ] P-031 (Sandra Lisboa) — ia levar a proposta ao jurídico em 2026-08-13, seis dias
- [ ] P-017 (Carla Menezes) — ia dizer se o time de risco entra na reunião, três dias

## Feito nos últimos sete dias
- [x] 2026-08-15 — abordagem enviada à P-017 (Carla Menezes)
```

Seção vazia continua na página, com uma linha só: `- nada aqui hoje.` Sumir com
a seção faz o prospector achar que a skill esqueceu.

### 4.3 · `funil.md`

Vista derivada do campo `etapa:` dos arquivos de contato. As etapas são estas
seis, nesta ordem, e **nenhuma skill cria etapa nova**:

```
a estudar · a abordar · abordado · respondeu · reunião marcada · virou cliente
```

Quem diz não, some por 90 dias ou sai do perfil não vira etapa: vira
`arquivo-morto/` pela regra 3.

**A etapa é do contato, não da conta.** Uma conta pode ter dois contatos em
etapas diferentes — um que respondeu e um que nem foi abordado —, e é assim
mesmo: quem responde é gente, não empresa. A conta tem `estado:`, que é outra
coisa (seção 4.4).

```markdown
# Funil — atualizado em 2026-08-19

## a estudar
- P-024 (Paulo Tavares) · E-052 (Clínica Sanare, Curitiba) · desde 2026-08-18 · veio de uma lista de evento · próximo: estudar a conta

## a abordar
- P-019 (Rui Baptista) · E-083 (Móveis Bertoldo, Bento Gonçalves) · desde 2026-08-11 · gancho: trocaram de ERP em junho · próximo: achar o e-mail

## abordado
- P-041 (Otávio Prado) · E-039 (Log Sul, Canoas) · desde 2026-08-14 · e-mail em 14/08, sem resposta · próximo: retomar em 21/08

## respondeu
- P-017 (Carla Menezes) · E-071 (VetorBank, Porto Alegre) · desde 2026-08-16 · perguntou o preço · próximo: propor terça ou quinta

## reunião marcada
- P-031 (Sandra Lisboa) · E-083 (Móveis Bertoldo, Bento Gonçalves) · desde 2026-08-17 · quinta 9h, com o time de compras · próximo: confirmar na véspera

## virou cliente
- P-008 (Diego Furtado) · E-052 (Clínica Sanare, Curitiba) · 2026-08-01
```

Uma linha por contato, sempre com a conta dele, `· desde AAAA-MM-DD` e
`· próximo: <ação>`. Contato aparece em uma etapa só.

### 4.4 · O arquivo de conta — `contas/E-071-vetorbank.md`

Teto: **40 linhas**.

```markdown
# E-071 (VetorBank, Porto Alegre)

site: https://vetorbank.com.br  ← prospector, 2026-08-12
estado: a abordar
setor: crédito para pequena empresa  ← site, 2026-08-12
cidade: Porto Alegre, RS  ← site, 2026-08-12
funcionários: 240  ← LinkedIn, 2026-08-12
faturamento: ?  ← não é público; perguntar na reunião
cnpj: 12.345.678/0001-90  ← site, rodapé, 2026-08-12
sistema que usam: Salesforce e um data warehouse próprio  ← vaga, 2026-08-18
de onde veio: post meu no LinkedIn, ela comentou  ← _bruto/2026-08-12-linkedin-carla.md

## O que a conta faz
- crédito com garantia para empresa de até 50 funcionários  ← site, 2026-08-12
- abriram vaga de analista de risco de crédito em 2026-08-18  ← _bruto/2026-08-19-vaga-vetorbank.md

## O que abre a conversa
- fecham o mês em nove dias e ninguém confia no número  ← _bruto/2026-08-12-linkedin-carla.md
- vaga aberta é orçamento aprovado para o problema  ← prospector, 2026-08-18

## Quem decide
- P-017 (Carla Menezes) · head de dados · falou comigo em 2026-08-12
- quem aprova orçamento: ?  ← perguntar à P-017 (Carla Menezes)

## Histórico
- 2026-08-12 entrou na carteira  ← _bruto/2026-08-12-linkedin-carla.md
- 2026-08-18 estudada, três fatos novos  ← _bruto/2026-08-18-site-vetorbank.md
```

`estado:` é um destes: `a estudar`, `a abordar`, `em conversa`, `virou cliente`,
`disse não`, `fechou com outro`, `fora do perfil`. Os três últimos disparam a
regra 3.

**`## O que abre a conversa` é a seção que a abordagem lê**, e é a única do
arquivo em que uma linha pode ser leitura sua e não fato apurado — mas ela leva
procedência do mesmo jeito, com `← prospector, <data>`, para você saber depois
o que era dado e o que era aposta. Linha sem procedência aqui não entra na
mensagem.

**Nada de dado pessoal do contato neste arquivo.** Nome, cargo e e-mail moram no
arquivo do contato (4.5). Aqui mora a empresa — e a seção 3.1 diz por quê.

### 4.5 · O arquivo de contato — `contatos/P-017-carla-menezes.md`

Teto: **60 linhas**.

```markdown
# P-017 (Carla Menezes)

cargo: head de dados  ← LinkedIn, 2026-08-12
e-mail: carla.menezes@vetorbank.com.br  ← site, página de imprensa, 2026-08-18
telefone: ?
linkedin: https://linkedin.com/in/carlamenezes  ← prospector, 2026-08-12
canal: e-mail
etapa: respondeu · desde 2026-08-16
de onde veio: comentou um post meu no LinkedIn  ← _bruto/2026-08-12-linkedin-carla.md
não contatar: não

## Onde trabalha
- E-071 (VetorBank, Porto Alegre) · desde 2026-08-12 · head de dados

## O que ele me disse
dor: fecham o mês em nove dias e ninguém confia no número  ← _bruto/2026-08-12-linkedin-carla.md
prioridade do trimestre: ?
quem decide junto: o time de risco, que ela ia consultar  ← prospector, 2026-08-16
orçamento: ?  ← perguntar na reunião, não antes
prazo: quer resolver antes do fechamento do ano  ← prospector, 2026-08-16

## O que já mandei
- 2026-08-15 · e-mail · gancho: a vaga de analista de risco · abriu, respondeu em 16/08
- 2026-08-12 · LinkedIn · resposta ao comentário dela · respondeu no mesmo dia

## Combinado
- ela ia dizer até 2026-08-18 se o time de risco entra na reunião, e não disse
- reunião de 20 minutos, terça ou quinta  ← prospector, 2026-08-16

## Histórico
- 2026-08-12 primeiro contato pelo LinkedIn  ← _bruto/2026-08-12-linkedin-carla.md
- 2026-08-15 abordagem por e-mail
```

`etapa:` é uma das seis da seção 4.3, e é **aqui** que ela mora — `funil.md` só
reflete. Mudou a etapa, mudam os dois na mesma passada, e a data de `desde` é a
data da mudança.

`## O que já mandei` guarda **toda** mensagem que saiu, com o gancho usado. É o
que impede a segunda abordagem de repetir a primeira — e é o que a
`/prospeccao:retomar-contato` lê para achar ângulo novo. Uma linha por mensagem,
mesmo a que não teve resposta: sobretudo a que não teve resposta.

`não contatar: sim` só existe se ele pediu, e aí vale para todas as skills
(seção 7.2). Ele não substitui o `nao-perturbe.md`: os dois são obrigatórios, e
a razão está lá.

### 4.6 · Os dois `_indice.md`

Vista derivada, uma tabela, **uma linha por item**, e nada além disso. Quem
quer detalhe abre o arquivo — é para isso que a linha tem o id.

`contas/_indice.md`:

```markdown
# Contas — 12 a estudar, 8 a abordar · atualizado em 2026-08-19

| conta | estado | setor | atualizada |
|---|---|---|---|
| E-071 (VetorBank, Porto Alegre) | a abordar | crédito | 2026-08-18 |
| E-083 (Móveis Bertoldo, Bento Gonçalves) | em conversa | indústria moveleira | 2026-08-17 |
| E-052 (Clínica Sanare, Curitiba) | a estudar | saúde | 2026-08-11 |

## Arquivo morto
- E-039 (Log Sul, Canoas) · 2026-08-01 · disse não: acabaram de assinar com outro fornecedor
```

`contatos/_indice.md` — sem a etapa, que é do `funil.md`:

```markdown
# Contatos — 21 ativos · atualizado em 2026-08-19

| contato | conta | cargo | último contato |
|---|---|---|---|
| P-017 (Carla Menezes) | E-071 (VetorBank, Porto Alegre) | head de dados | 2026-08-16 |
| P-019 (Rui Baptista) | E-083 (Móveis Bertoldo, Bento Gonçalves) | diretor industrial | 2026-08-11 |
| P-031 (Sandra Lisboa) | E-083 (Móveis Bertoldo, Bento Gonçalves) | compras | 2026-08-17 |

## Arquivo morto
- P-041 (Otávio Prado) · 2026-08-01 · saiu da empresa; o E-039 (Log Sul, Canoas) ficou sem contato
```

**Duas linhas de contato para a mesma conta é normal** — é o que acontece quando
a decisão é dividida. Duas linhas para a mesma **pessoa** é id duplicado, e a
regra da seção 9 vale: pare, mostre as duas e pergunte qual fica.

### 4.7 · O que entra em `_bruto/`

Nome do arquivo: `AAAA-MM-DD-<canal>-<apelido-curto>.md`, sempre a data em que
o material foi produzido — não a de hoje, quando dá para saber.

```
2026-08-12-linkedin-carla.md
2026-08-17-email-bertoldo.md
2026-08-18-site-vetorbank.md
2026-08-19-vaga-vetorbank.md
```

Cabeçalho de três linhas e, abaixo do traço, o material **colado sem tocar**:

```markdown
origem: WhatsApp, exportado pelo prospector
recebido: 2026-08-12
sobre: P-017 (Carla Menezes), E-071 (VetorBank, Porto Alegre)

---

[12/08/2026 14:32] Carla: oi Renata, vi o seu post sobre o painel de inadimplência
[12/08/2026 14:40] Renata: obrigada! vocês já medem isso por safra?
```

Bruto não se corrige, não se resume e não se apaga. Se o prospector disser que o
que está lá está errado, o certo vai para o arquivo dono com procedência
`← prospector, <data>`; o bruto continua como estava, porque ele é a prova do que
foi dito, não do que é verdade.

PDF, foto e áudio ficam onde estão e `_bruto/` guarda um arquivo `.md` que
aponta o caminho no computador. Áudio não se transcreve de ouvido: se o que
importa está num áudio, pergunte ao prospector o que ele diz.

**Planilha importada entra inteira, e é o arquivo original.** O nome é
`AAAA-MM-DD-planilha-<nome-curto>.csv`, sem o cabeçalho de três linhas — ele é
para texto colado, e aqui o arquivo já diz o que é. O formato é CSV: Excel e
Google Sheets exportam em dois cliques, e a skill que importa ensina onde. Todo
campo que sair dela leva `← _bruto/AAAA-MM-DD-planilha-<nome-curto>.csv`,
que é a regra 2 sem origem nova. Coluna que não tem campo no gabarito não
inventa campo (seção 4), e linha que a skill não conseguiu ler vira `?` na
ficha e uma linha em `## Falta saber` — nunca um valor adivinhado. Quem importa
é `/prospeccao:comecar`, no primeiro dia, e `/prospeccao:organizar-carteira`, para
o `.csv` que apareceu em `_bruto/` depois.

---

### 4.9 · `perfil.md`, que é a régua de todas as outras

Um arquivo, na raiz da carteira. Teto: **60 linhas**. Escrito por
`/prospeccao:perfil-de-cliente` e lido por **todas** as skills que decidem se
uma conta entra ou se uma abordagem sai.

```markdown
# Perfil — atualizado em 2026-08-19

## Quem vale
setor: financeiro de médio porte, indústria com fábrica própria, saúde privada
tamanho: 80 a 600 funcionários
cargo de quem decide: head de dados, diretor industrial, CFO
sinal de que a hora é agora: vaga aberta na área, troca de ERP, rodada de investimento
região: Sul e Sudeste — as três reuniões que fechei foram presenciais na primeira

## Por que
- os três clientes que fechei tinham fechamento manual e mais de 80 pessoas  ← prospector, 2026-08-19
- abaixo de 80 não há orçamento para projeto, e o dono decide sozinho e some  ← prospector, 2026-08-19
- vaga aberta é orçamento aprovado para o problema, e é o gancho que mais respondeu: 4 de 11  ← prospector, 2026-08-19

## O que desqualifica
- agência e consultoria — vendem o mesmo que eu, e viram concorrente
- empresa com time de dados montado (5 pessoas ou mais)  ← perdi duas assim
- órgão público: compra por edital, e eu não tenho estrutura para isso
- quem já disse não nos últimos 12 meses

## O que eu não sei ainda
- se o porte certo é 80 ou 150 — tenho três casos, e três é pouco
```

**`## Por que` é o que faz este arquivo valer.** Uma lista de critérios sem
razão é palpite escrito bonito, e ela não sobrevive ao primeiro trimestre ruim:
quando a fila secar, é a razão que decide o que afrouxar. Todo critério leva
procedência, como qualquer campo (regra 2) — e a origem mais comum aqui é
`← prospector, <data>`, porque quem sabe é ele.

**`## O que eu não sei ainda` não é enfeite.** Perfil escrito no primeiro dia é
hipótese, e o pack prefere hipótese declarada a certeza inventada. É desta
seção que sai a pergunta que a décima reunião responde.

**A conta que não passa no perfil não é apagada** — ela entra com
`estado: fora do perfil` e vai para `arquivo-morto/` pela regra 3, com o motivo.
Perfil muda; conta apagada não volta.

## 5 · Os dois modos

A skill descobre o modo lendo a linha `modo:` do `INDICE.md`. É a segunda coisa
que ela faz, depois de conferir que a carteira existe.

```
modo: copiloto      para nas bifurcações e devolve o trabalho pronto até ali
modo: automatico    escolhe sozinha e DECLARA o que escolheu
```

Aceite `automatico` e `automático`. Qualquer outro valor, linha ausente ou
arquivo ilegível: **o modo é `copiloto`**. Nunca se escolhe automático por
dedução, por pressa ou porque a resposta parece óbvia — o prospector liga o
automático uma vez, no `INDICE.md`, e é lá que ele desliga.

### Copiloto

Na bifurcação, para. Antes de parar, entrega o que já ficou pronto: quem para
de mãos vazias fez o prospector esperar por nada. Pergunta uma coisa (seção 8) e
espera.

### Automático

Escolhe e segue. Ao fim da saída, **sempre**, com este título exato:

```markdown
## Decidi sozinho
- Usei o número de funcionários do LinkedIn, 240, e não o da planilha de março — a fonte é mais nova. Para trocar, me diga o valor.
- Marquei a P-017 (Carla Menezes) como “respondeu” porque ela devolveu a pergunta. Se você acha cedo, me diga que eu volto para “abordado”.
```

Uma linha por escolha: **o que fiz — por que — como desfazer.** Sem essa
declaração, automático é caixa preta, e caixa preta na mão de quem é leigo
queima a confiança no primeiro erro. Não escolheu nada? A seção não aparece.

### A exceção escrita

**`/prospeccao:escrever-abordagem` lê o `nao-perturbe.md` antes de escrever
qualquer coisa, nos dois modos, e não escreve para quem está lá.** Não é uma
escolha do modo: é o art. 18 da LGPD, e quem pediu para não ser procurado
pediu ao ofício inteiro. Ela diz isso em uma linha, sem pedir desculpa.

Nenhuma outra skill tem exceção. Se uma skill acha que precisa de uma, ela para
e pergunta — não inventa a exceção.

---

## 6 · O que sai para o WhatsApp

O canal está no arquivo do contato (`canal:`) e **decide o formato**. Na dúvida,
WhatsApp.

**A voz é a do prospector.** A mensagem sai do WhatsApp dele, com o nome dele, e
quem vai responder por ela é ele. A Kapstan não aparece, não assina, não é
citada. Nada de “nossa equipe”, nada de “estamos à disposição”: é uma pessoa
falando com outra.

O formato, e não há variação:

```
uma linha curta        até doze palavras, com o primeiro nome do contato
um parágrafo           duas a três linhas. Um assunto só
o link sozinho         linha em branco antes e depois, um link por mensagem
uma pergunta fácil     de sim ou não, ou entre duas opções
```

Exemplo, e é deste tamanho:

```
Carla, vi que o VetorBank abriu vaga para analista de risco de crédito.

Montei painel de inadimplência por safra para duas financeiras do mesmo porte —
nos dois casos o fechamento do mês caiu de nove dias para dois.

https://vasquesanalytics.com.br/casos/safra

Vale uma conversa de 20 minutos na semana que vem? Terça ou quinta?
```

O link **sozinho na linha**, sem texto colado nem pontuação depois: senão a
pré-visualização do WhatsApp não abre, e é a pré-visualização que faz a foto do
conta aparecer.

O que não entra: emoji (a não ser que a conversa colada mostre o prospector
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
Eu mesmo mando     o prospector copia o bloco e cola no WhatsApp dele
Mando agora        a skill envia, depois de ele ver o texto e o destinatário
Mudo o texto       ele diz o que trocar, e nada sai agora
```

O rótulo diz o que a PESSOA vai fazer, nunca o nome interno da peça: “Eu mesmo
mando” e não “só o bloco”.

### E-mail é outro tamanho

```
assunto        até oito palavras, sem “Re:” de mentira
saudação       “Carla, bom dia.”
corpo          dois parágrafos curtos. Pode ter até dois links, com o texto do link
fecho          uma pergunta, e a assinatura que está no INDICE.md
```

Mensagem por e-mail que seria melhor no WhatsApp: mande no WhatsApp e diga por
quê, em uma linha.

---

## 7 · Como a conversa entra

Há dois caminhos, e quem diz qual é a linha `WhatsApp:` do `INDICE.md`
(seção 4.1). **O padrão é colado**, e é o único que funciona em toda
ferramenta: o prospector exporta ou cola, e a skill lê os dois formatos que
chegam. O conector é opcional, não existe em metade dos lugares onde o pack
roda, e **nenhuma skill o exige** — skill que só funciona com ele quebrou o
contrato.

O caminho muda; o formato não. Conversa que entrou pelo conector e conversa
que entrou colada produzem o **mesmo** arquivo em `_bruto/`, com a mesma
procedência (seção 3). Nenhuma das outras precisa saber por onde ela veio,
e é isso que impede o conector de virar um segundo pack.

| a operação | colado | pelo conector |
|---|---|---|
| trazer a conversa de um contato | o prospector exporta ou cola | achar a conversa pelo telefone do arquivo do contato e ler o período que interessa |
| saber quando foi a última mensagem | está no que ele colou | pergunta-se à conversa |
| guardar em `_bruto/` | igual nos dois | igual nos dois |

**O conector lê sempre, e manda uma por vez** — nunca em lote, e nunca sem o
prospector ter visto o texto e o nome de quem recebe. Como isso funciona está em
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
de pé e conectada          trabalhe, e não diga nada ao prospector
de pé e desconectada       diga o que ela reporta, em uma linha, e siga com o
                           que já está guardado — dizendo que é isso que é
fora do ar, ou parada há   PARE de tratar o conector como fonte. Diga há quanto
mais de um dia             tempo, que o que passou não volta, e que a janela do
                           `serve` precisa ser reaberta. Depois ofereça o
                           caminho colado, que funciona igual
```

**Silêncio só se justifica quando está tudo certo.** Ponte velha e trabalho
normal é o único par que o prospector não pode ver, porque é o único em que
ele acharia que a carteira está em dia.

### Exportado do aplicativo

```
[12/08/2026 14:32] Carla Menezes: oi Renata, vi o seu post sobre o painel de inadimplência
[12/08/2026 14:40] Renata Vasques: obrigada! vocês já medem isso por safra?
[12/08/2026 14:41] Carla Menezes: ‎<Mídia oculta>
[12/08/2026 14:55] Carla Menezes: medimos no fechamento do mês, mas ninguém confia no número
```

Aparece também sem colchetes, que é o formato antigo, e vale o mesmo:

```
12/08/2026 14:32 - Carla Menezes: oi Renata, vi o seu post sobre o painel
```

A data é **dd/mm/aaaa** e a hora é de 24 horas — é o padrão brasileiro, e
`03/08` é 3 de agosto. Ano de dois dígitos (`12/08/26`) é 2026. Ao gravar,
converta para `2026-08-12`.

**Quem é o prospector na conversa:** é o remetente cujo nome bate com `nome:` do
`INDICE.md`. Não bateu de jeito nenhum? Uma pergunta, uma vez: “Nessa conversa,
qual dos dois é você?”. Nunca deduza pelo tom — o risco é gravar a fala do
contato como promessa do prospector.

**O que não se lê, não se inventa:** `<Mídia oculta>`, `Esta mensagem foi
apagada`, áudio e figurinha viram um buraco declarado, não um palpite. Se o
buraco está no meio do que importa, ele vira uma linha em `## Combinado` ou uma
pergunta: “Tem um áudio de 12 de agosto no meio da conversa. O que ela disse
ali?”

### Texto solto

Colagem sem carimbo de data e sem nome — um pedaço de conversa, um perfil do
LinkedIn, uma vaga, um e-mail encaminhado. Trate assim: o conteúdo é fato do que está
escrito, a data é a que o prospector disser (ou a de hoje, e a procedência diz
`← prospector, <hoje>`), e o autor não se adivinha.

### O que fazer com ela depois, sempre nesta ordem

1. **Grava o bruto primeiro**, em `_bruto/AAAA-MM-DD-<canal>-<apelido-curto>.md`, com
   o cabeçalho de três linhas da seção 4.7 e o texto colado sem tocar. Primeiro
   porque, se algo der errado no meio, o material do prospector já está salvo.
2. **Extrai os fatos** para os arquivos donos — contato e conta —, cada campo
   com `← _bruto/<aquele arquivo>`. Fato é o que está escrito: “dá sábado, mas
   cedo” é `## Combinado`, não “reunião marcada para terça”.
3. **Atualiza as vistas** que mudaram: `funil.md` se a etapa mudou,
   `_indice.md` se entrou item ou mudou o último contato.
4. **Diz onde guardou**, no bloco `## Guardei` da seção 10.

Conversa que menciona conta que não está na carteira: não crie a conta com o
que a conversa diz. Pergunte o link, uma vez. Sem link nem ficha, a conta não
entra — dado que se adivinhou vira preço errado na mensagem para o contato.

---
## 7.1 · Como a mensagem sai

Isto vale **só com o conector** (`WhatsApp: sim` no `INDICE.md`). Sem ele, a
skill entrega o bloco e para — e não pede desculpa por isso.

**A regra que governa tudo aqui: a ferramenta informa, e o prospector decide.**
Ela recusa o que ele não pediu, nunca o que ele pediu. Isso separa três coisas
que se confundem com facilidade:

```
escolha dele   usar o envio ou não, mandar para quem não respondeu, dizer ao
               programa dele para não perguntar mais
               → avise UMA VEZ, quando ele liga, e obedeça

erro           a skill mostrou um texto e mandou outro; a prévia envelheceu e o
               contato já respondeu no meio-tempo
               → a ponte recusa, porque ninguém escolheu isso

lote           mesma mensagem para vários, lista de transmissão
               → não existe: a ferramenta aceita UMA conversa por chamada
```

### O par que sai, sempre nesta ordem

```
preparar_envio    devolve um código de prévia e o texto exato que vai sair
enviar_mensagem   exige esse código, a mesma conversa e o mesmo texto
```

Entre as duas, a skill **mostra ao prospector**, e o que ela mostra tem três
partes obrigatórias — é o pedido literal, e resumo não serve:

```
para    o nome como ele conhece a pessoa, o id com apelido, e quando ela
        falou pela última vez
texto   INTEIRO, do jeito que vai sair. Nunca “a resposta que combinamos”
saídas  Mando agora · Mudo o texto · Eu mesmo mando
```

A prévia vale **10 minutos** e serve **uma vez**. Ela morre se chegar mensagem
nova naquela conversa depois de criada — senão o prospector responde pelo celular
e a skill manda a resposta velha logo atrás.

### Várias de uma vez não é lote

Uma skill pode mostrar quatro mensagens e o prospector aprovar as quatro numa
tela. Isso **não** é lista de transmissão, e a diferença é de forma:

```
lista de transmissão   uma mensagem, mesmo texto, muitos destinatários, junto
várias revisadas       N mensagens DIFERENTES, uma por pessoa, com o dado dela
                       dentro, saindo uma a uma e espaçadas
```

Quando mostrar várias, mostre **o texto inteiro de cada uma** — nunca “4
mensagens aguardando” — e o **porquê de cada uma estar ali**. Quem ficou de
fora aparece com o motivo: descarte em silêncio é o que faz o prospector parar de
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

Quem **nunca trocou mensagem** com o prospector por ali é o único caso em que
o envio não sai, e a recusa não é da ferramenta: **desde julho de 2026 o próprio
WhatsApp recusa**, e salvar o número na agenda não muda nada. Quem abre a
conversa tem que ser o aplicativo do celular, uma vez; depois disso o conector
responde como em qualquer outra.

A prévia diz isso **antes**, quando vê que a conversa não existe. Ao ouvir,
a skill não insiste e não tenta outro caminho: ela entrega o **bloco para
copiar** — que é o padrão do pack de qualquer forma — e diz, em uma linha, que
a primeira mensagem sai do celular dele.

Não é raro: é como quase todo contato chega da primeira vez — o que deixou o telefone
numa lista de evento e nunca escreveu.

### Quem pediu para não ser contatado

O contato que diz “não me manda mais mensagem” tem que sair do alcance de todas
as skills, e não só da que ele respondeu. São **dois lugares, e os dois são
obrigatórios**:

```
na carteira   o arquivo do contato ganha  não contatar: sim  ← origem, data
              e ele é aposentado com esse motivo (seção 3)
na ponte      um comando, e é ele que escreve o arquivo — o diretório dela
              não é o da carteira, e a skill não tem como adivinhar onde é:

                  whatsapp-reader nao-contatar 5551999998888 "pediu em 12/08"

              sem argumento ele lista; `--tirar <número>` desfaz
```

A carteira é o que as dez skills leem; a ponte é o que segura o envio mesmo se
alguém esquecer. **Nenhuma skill escreve mensagem para quem tem `não contatar:
sim`**, nem para retomar, nem para avisar do que entrou, nem para desejar
feliz aniversário. Não é preferência de canal: é pedido de silêncio.

Quem coloca é o prospector, ou a skill que leu o pedido na conversa — e aí ela
diz o que fez, em uma linha, porque tirar alguém da carteira é do tamanho de
aposentar.

Os tetos de partida são 6 conversas diferentes por hora, 30 envios no total e 5
segundos entre dois quaisquer. **São ajustáveis, e o número certo sai do
histórico do próprio prospector.** Recusa que não diz o número nem como mudá-lo
está impedindo em vez de informar.

### Envio não é governado pelo `modo:`

O `modo:` da seção 5 governa **escolha** — qual conta entra, qual caminho
seguir. Envio é ato com terceiro e não se desfaz, então tem linha própria no
`INDICE.md` (seção 4.1):

```
envio: pergunta sempre           o padrão, e o que vale se a linha faltar
envio: responder sem perguntar   responde conversa viva direto; começar
                                 conversa continua perguntando
envio: não                       a skill nem oferece
```

Prospector em `modo: automatico` **não herda** envio automático: quem ligou o
automático para o texto de abordagem não ligou para a boca dele.

### O que nunca sai por aqui

```
áudio, foto, documento e anexo    a ponte não os manda
preço novo, contraproposta,       a skill não decide preço nem avalia proposta
aceite ou recusa de proposta      (seção 10)
prazo de jurídico, compras ou      a skill não promete prazo de terceiro
segurança da informação
reenvio porque não respondeu      cadência é decisão, não relógio: o caminho é
                                  /prospeccao:retomar-contato, com ângulo novo
```

---

### 7.2 · `nao-perturbe.md`, lido antes de toda mensagem

Um arquivo, na raiz da carteira, **sem teto de linhas** — ele só cresce, e
nunca encolhe. É o art. 18 da LGPD virado arquivo, e é a única leitura que
**nenhuma skill pula**, em nenhum modo, nem quando a carteira está lenta.

```markdown
# Não perturbe — 4 pedidos

<!-- Nada sai daqui. Linha errada se corrige acrescentando outra abaixo,
     com a data; a de cima fica. Quem entra aqui não recebe mensagem de
     skill nenhuma, nem para retomar, nem para avisar de nada. -->

| quem | onde | quando | quem pediu | o que ele disse |
|---|---|---|---|---|
| P-036 (Vera Lins) | e-mail | 2026-07-02 | ela | “me tira dessa lista” |
| P-042 (Bia Nogueira) | LinkedIn | 2026-07-19 | ela | “não temos interesse, obrigada” |
| carla.menezes@antigaempresa.com.br | e-mail | 2026-06-11 | volta automática | caixa desativada |
| todo @grupobrasa.com.br | e-mail | 2026-08-02 | jurídico deles | pediu por escrito, domínio inteiro |
```

Quatro coisas que este formato resolve, e as quatro já quebraram uma carteira
em algum lugar:

- **a linha vale mesmo sem ficha.** `carla.menezes@antigaempresa.com.br` não é
  um `P-` — é um endereço que voltou. A skill compara pelo **endereço e pelo
  telefone**, não só pelo id: pessoa que trocou de empresa ou de número
  continua sendo a mesma pessoa
- **domínio inteiro cabe numa linha.** `todo @dominio` bloqueia a empresa toda,
  e é o que o jurídico de uma delas vai pedir um dia
- **“não temos interesse” entra aqui.** Não é objeção a contornar: é pedido de
  silêncio, e tratá-lo como etapa do funil é o que faz alguém denunciar a sua
  caixa
- **quem pediu fica escrito.** Volta automática não é a pessoa; jurídico não é
  a pessoa. A coluna existe para você saber, meses depois, se cabe perguntar
  de novo — e a resposta é quase sempre não

**Como uma skill usa:** antes de escrever qualquer texto que vá para alguém,
ela lê este arquivo inteiro e compara **id, e-mail, telefone e domínio**. Bateu:
ela **não escreve a mensagem** — nem em rascunho, nem “para você ver e decidir”
— e diz em uma linha quem está na lista, desde quando e quem pediu. Um rascunho
que existe é um rascunho que alguém manda por engano.

**Quem escreve aqui:** o prospector, ou a skill que leu o pedido na conversa —
e aí ela diz o que fez, em uma linha, porque tirar alguém do alcance é do
tamanho de aposentar. Junto com a linha aqui, o arquivo do contato ganha
`não contatar: sim  ← origem, data` e é aposentado (regra 3). **Os dois lugares
são obrigatórios**: este arquivo é o que as dez skills leem; o campo é o que
sobrevive se alguém copiar a ficha para outra carteira.

---

## 8 · Quando perguntar, e como

Perguntar cedo demais é o defeito mais caro do pack: o prospector já respondeu
aquilo, está escrito na carteira, e a skill perguntou de novo.

### A ordem de busca

Só desce um degrau quando o de cima não respondeu:

```
1  INDICE.md                 quem ele é, modo, o que está conectado
2  o _indice.md do tema      contas/ ou contatos/ — acha o id e o apelido
3  o arquivo do item         é ele o dono do fato
4  _bruto/                   a conversa ou a ficha de onde o fato veio
5  o link                    a página da conta, quando há link e ela abre
6  PERGUNTA ao prospector      só o que nenhum dos cinco tinha
7  PEDE O DOCUMENTO          quando nem ele sabe: CNPJ, contrato social, edital
```

O degrau 5 tem um fim conhecido: site que só monta a página por JavaScript
devolve nada. Quando isso acontecer, diga na cara — “esse site não abre para
mim” — e peça a ficha colada. **Não chute dado de conta**, em hipótese
nenhuma, nem para “ilustrar”.

### O tamanho da pergunta

Uma por vez. **Nunca mais de três numa execução.** Skill que abre com
formulário de oito campos é abandonada na primeira execução, e não volta.

Toda pergunta traz o motivo na mesma frase, porque o motivo é o que ensina o
ofício enquanto a skill trabalha:

```
ruim   Qual o e-mail dela?
bom    Você tem o e-mail da Carla? Sem ele a abordagem só sai pelo LinkedIn,
       que tem teto de caracteres e some no meio de vinte outras.
```

### Escolha entre dois e quatro caminhos

Use a UI de perguntas do harness (a ferramenta de perguntar ao usuário, com
botões) — não escreva as opções em prosa e peça para ele digitar o número.

Cada opção traz **o custo escrito**: o que ela exige e quanto demora.

```
Como quer abordar a P-017 (Carla Menezes)?

  Curta, para o LinkedIn    4 linhas e um gancho só · pronto agora
  Completa, para e-mail     12 linhas com o caso e o número · preciso do e-mail dela
  As duas                   pronta agora, e a de e-mail fica com um ? no endereço
```

Rótulo curto, até quatro palavras. A descrição declara o custo, não vende a
opção. Mais de quatro caminhos: escolha os três melhores e diga que há outros.

### Quando NÃO perguntar

- o fato está na carteira: use, e cite de onde veio
- é gosto do prospector sobre o que ele já decidiu antes: siga o que está escrito
  em `## Como eu trabalho`
- é detalhe que não muda a saída: deixe `?` e siga
- em modo automático: escolha e declare (seção 5) — a exceção é
  `estudar-conta`, que pergunta sempre

---

## 9 · Os tetos, e o que fazer quando estouram

```
INDICE.md              120 linhas
perfil.md               60 linhas
arquivo de contato      60 linhas
arquivo de conta        40 linhas
nao-perturbe.md         sem teto — ele só cresce
_indice.md              uma linha por item, e nada mais
hoje.md                 o que cabe num dia. Passou de 15 caixas, priorize e diga
```

Confira o teto **ao gravar**, não depois. Estourou:

- **conta ou contato:** o `## Histórico` é o que condensa. Linhas de mais de
  90 dias viram uma por mês (`- 2026-05 duas abordagens, nenhuma resposta`). Se
  ainda estourar, o excesso vai para um arquivo em `_bruto/` e o histórico fica
  com a linha que aponta para ele. Fato corrente nunca é cortado para caber.
- **`## O que já mandei` não se condensa por idade.** Ele é o que impede a
  próxima abordagem de repetir o gancho da anterior, e uma abordagem de seis
  meses atrás continua sendo uma abordagem que a pessoa leu. Se ele sozinho
  estoura o arquivo, o contato tem histórico demais para a etapa em que está:
  isso é assunto de aposentar, não de podar.
- **INDICE.md:** a lista detalhada não mora aqui — mora nos `_indice.md`. Corte
  o que for cópia deles.
- **`_indice.md`:** duas linhas para a mesma pessoa é sinal de id duplicado.
  Pare, mostre as duas e pergunte qual fica.

Teto não é sugestão: ele é a regra 1 medida. Arquivo de contato com 200 linhas
faz toda skill reler 200 linhas para achar um e-mail, em toda execução.

---

## 10 · Como uma skill começa e termina

### Começa

1. lê `~/carteira/INDICE.md`. Não existe: uma linha e `/prospeccao:comecar`
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

Omitir a seção é o que faz o prospector achar que ficou guardado, e a regra
aqui é a mesma do "escreveu, diz onde", virada do avesso: **ele precisa saber
que NÃO ficou.** E o título é este, sempre — `## Não gravei nada` e
`## Nada foi guardado` são títulos inventados, e título inventado é o que a
seção 4 proíbe. Medido: duas skills inventaram o próprio na primeira
execução da prova, as duas por terem feito a coisa certa e nomeado errado.

**Cinco skills não têm bloco para colar, e a razão é a mesma nas cinco: o
trabalho delas não é um texto para o contato.**

```
/prospeccao:comecar              o trabalho é a configuração
/prospeccao:o-que-fazer-hoje     o trabalho é a lista do dia
/prospeccao:organizar-carteira   o trabalho é o relatório do que mudou
/prospeccao:laudo-da-carteira    o trabalho é o laudo, e ele não sai daqui
/prospeccao:importar-a-conversa  o trabalho é o relatório do que entrou
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
- ~/carteira/contas/E-071-vetorbank.md — criado
- ~/carteira/contas/_indice.md — uma linha nova
- ~/carteira/_bruto/2026-08-12-linkedin-carla.md — a conversa, como veio

## Falta saber
- o e-mail da P-017 (Carla Menezes) — o LinkedIn não mostra
- quem aprova orçamento de projeto no E-071 (VetorBank, Porto Alegre)

## Decidi sozinho
- <só em modo automático · o que fiz — por que — como desfazer>
```

**O bloco vai em cerca de código, e NUNCA dentro de moldura desenhada.** Uma
caixa de `┌─┐` parece organizada na tela e é armadilha: o prospector seleciona,
copia e leva as bordas junto para dentro do WhatsApp do contato. A cerca de
código dá o botão de copiar e devolve só o texto. Vale para tudo o que existe
para sair daqui e ir para outro lugar — mensagem, texto de abordagem, roteiro, legenda,
título de evento. Nada de traço de enfeite antes ou depois, nada de `>` de
citação, nada de “copie o texto abaixo:” dentro do bloco.

Os três títulos são exatamente estes. **Escreveu na carteira, diz onde**: o
prospector precisa saber onde a coisa foi parar para confiar que ela está lá.

`## Falta saber` é a regra 2 aparecendo: são os `?` que esta execução criou ou
não conseguiu resolver. É a lista que a próxima skill vai atacar.

### O que nenhuma skill faz

- inventar dado de conta, de contato ou de valor — `?` sempre bate palpite
- apagar arquivo da carteira, ou editar `_bruto/`
- criar campo, seção, etapa ou nome de arquivo fora deste contrato
- mandar mensagem **sozinha**: sem conector ela escreve e quem manda é o
  prospector; com conector ela manda uma por vez, e só depois de ele ver o texto
  e o nome de quem recebe (seção 7.1)
- falar em nome da Kapstan na mensagem que sai para o contato
- decidir preço, decidir se aceita proposta, ou dizer que um documento está em
  ordem — isso é do prospector, e a skill diz o que olhar
- prometer prazo de jurídico, de compras ou de segurança da informação

### A língua

Português do Brasil, do jeito que o prospector fala. Frase curta, imperativo
direto, zero hype. “Prospect” fica, porque é a palavra que ele usa todo dia.
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
  as TRÊS skills que trabalham com o que for COLADO na conversa, e as
  sete que dependem da carteira não funcionam — nem com Drive ligado

o conector de WhatsApp (seções 7 e 7.1)
  só onde há linha de comando: Claude Code, Codex CLI, Cursor. Em
  prospecção ele é o canal DEPOIS que a pessoa responde, quase nunca o
  da primeira mensagem — e a razão está na seção 7.1: quem nunca trocou
  mensagem com você não recebe pelo conector, e é assim que quase toda
  conta nova chega. A primeira abordagem sai por e-mail ou pelo
  LinkedIn, e o bloco para copiar é a saída que nunca falta
```

Sem carteira nenhuma, três entregam o trabalho e não gravam nada:

| skill | o que ela ainda faz com o que for colado |
|---|---|
| `perfil-de-cliente` | as respostas coladas viram o `perfil.md` na tela — e ele fica com você para colar num arquivo |
| `estudar-conta` | o site ou a página colada vira a lista de fatos com procedência, e o que falta vira `?` |
| `escrever-abordagem` | a conta colada vira a mensagem; some o cruzamento com o que já foi mandado, que é a parte que evita repetir o gancho |

E sete não funcionam, porque o trabalho delas **é** a carteira:

| skill | do que ela depende |
|---|---|
| `comecar` | monta a carteira — sem transporte, não há onde montar |
| `o-que-fazer-hoje` | lê a carteira inteira para ordenar o dia |
| `retomar-contato` | conta os dias de silêncio e lê os ganchos já usados |
| `organizar-carteira` | é a manutenção da carteira |
| `laudo-da-carteira` | mede a carteira contra o contrato |
| `importar-a-conversa` | grava em `_bruto/` e distribui o fato |
| `cobrar-o-que-falta` | lê o que foi prometido e não chegou |

**Quem trabalha sem gravar diz isso.** O `## Guardei` do fecho (seção 10) vira
uma linha só: `- nada foi gravado — você está sem carteira aqui`. Trabalho que o
prospector acha que ficou guardado e não ficou é pior que trabalho não feito.

**E há uma coisa que o chat da web não faz, e ela é a mais importante deste
pack:** sem carteira não há `nao-perturbe.md`, e sem ele a
`/prospeccao:escrever-abordagem` não tem como saber quem pediu silêncio. Ali
ela escreve a mensagem e **diz, em uma linha, que não conferiu a lista** — quem
confere é você, antes de mandar. É a única coisa deste pack que não se degrada
em silêncio, porque a consequência dela não é sua.
