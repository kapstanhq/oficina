<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

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
