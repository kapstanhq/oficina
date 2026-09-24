<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte são as seções em oficina/_motor/ e oficina/vagas/contrato/, que
     este script funde em oficina/vagas/CONTRATO.md — e daí sai esta cópia,
     por `npm run oficina -- --escrever`. Correção feita aqui é perdida na
     próxima geração, e correção feita no CONTRATO.md também: ele é montado.

     A cópia existe porque o padrão Agent Skills quer a referência DENTRO da
     skill, em references/ — é o que faz o pack funcionar fora do Claude
     Code, onde ${CLAUDE_PLUGIN_ROOT} não é substituído. -->

# O contrato da busca

Este arquivo é o padrão comum das quinze skills do pack. Ele não é leitura de
apoio: é onde estão os formatos literais, e formato inventado por uma skill
quebra as outras catorze.

Quem lê isto é o Claude executando uma skill. Quem lê o que sai dela é um
profissional procurando vaga com pressa, que não é técnico e não vai depurar nada.

**Regra zero — leia antes de escrever.** Nenhuma skill inventa nome de arquivo,
nome de campo, nome de etapa ou nome de seção. Tudo o que se escreve na
busca tem gabarito aqui embaixo. O que não tem gabarito não se escreve: se
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
1  onde a busca mora — os dois transportes —, e quem é dono de qual fato
2  id e apelido — V-014 (Técnica de Enfermagem UTI, Vértice Saúde) — e o nome do arquivo
3  as três regras: não duplicar, procedência, aposentar
3.1 o que é seu, o que é dos outros, e o que nunca entra
4  os formatos literais dos dez arquivos
5  os dois modos
6  o que sai para o WhatsApp, e o que sai por e-mail
7  como a conversa entra, e como a mensagem sai
8  a ordem de busca, e quando perguntar
9  os tetos
10 como uma skill começa e termina
11 onde esta skill roda, e o que funciona em cada lugar
12 a trajetória, o currículo que sai dela, e a candidatura que para antes do botão
```

---

## 1 · Onde a busca mora

```
~/busca/
  INDICE.md            o mapa. Toda skill lê primeiro. Teto: 120 linhas
  hoje.md              o que vence, o que travou, o que prometeram e não mandaram
  funil.md             quem está em que etapa, desde quando
  vagas/
    _indice.md         uma linha por vaga
    V-019-trilho-logistica.md
  contatos/
    _indice.md         uma linha por contato
    P-005-helena-prates.md
  _bruto/              conversas coladas, fichas, planilhas, PDFs, links — a ORIGEM
    2026-09-11-whatsapp-helena.md
    2026-09-14-planilha-vagas.csv
  vistas/              o pedaço que UMA pessoa de fora pode ver (seção 4.8).
    P-005-helena-prates.md   Derivado, refeito a cada execução, só de leitura
  arquivo-morto/
    vagas/
    contatos/
```

Quem anda no funil aqui é a vaga: o `etapa:` mora no arquivo da vaga, e o
`funil.md` tem uma linha por vaga. `contatos/` pode estar vazia, e isso
não é busca pela metade — vaga sem contato é o caso comum.

Essa árvore é a mesma nos dois transportes de que trata esta seção: **o formato
dos arquivos não muda com o lugar onde eles moram.** Os sete gabaritos, a
procedência, os ids com apelido, as etapas e os tetos são idênticos no
computador e no Drive. O que muda é só como se lê e como se grava — e confundir
o conteúdo com o transporte é o que faria uma skill virar duas.

Neste documento, `~/busca/…` é o modo curto de nomear o lugar, qualquer que
seja o transporte. É assim que se fala com o candidato no `local`; no `drive`,
diga “a pasta `busca` do seu Drive”.

### Os dois transportes

```
local    uma pasta no computador do candidato
drive    uma pasta no Google Drive dele, pelo conector
```

Quem escolhe é o candidato, uma vez, no `/vagas:comecar`. **Nenhuma skill
troca o transporte, e nenhuma trabalha em dois ao mesmo tempo.**

**No `local`**, `~` é a pasta pessoal do candidato. No Windows é
`C:\Users\<nome>`, no Mac é `/Users/<nome>`, no Linux é `/home/<nome>`. **Toda
chamada de ferramenta usa caminho absoluto** — caminho relativo depende de onde
a sessão abriu, e a sessão abre em qualquer lugar. Ao falar com o candidato,
escreva `~/busca/…`, que é curto e ele entende.

**No `drive` não existe caminho.** Pasta é um item com id, e arquivo é filho de
uma pasta. `/busca` é o **nome** da pasta na raiz do Drive dele, não um
caminho que se entrega a uma ferramenta: achar `vagas/_indice.md` é achar a
pasta `busca`, achar a pasta `vagas` dentro dela e procurar `_indice.md`
ali dentro. Guarde o id de cada pasta que abrir — reprocurar a mesma pasta a
cada operação é o que faz a execução demorar.

**A busca é sempre presa à pasta.** `_indice.md` existe duas vezes na busca,
em `vagas/` e em `contatos/`, e procurar pelo nome solto devolve os dois. Sem
saber de qual pasta veio, a skill grava a lista de vagas por cima da lista de
contatos.

**Os arquivos são texto, com extensão `.md`.** Nada é convertido para documento
do Google: o que volta de um documento convertido não é o que foi escrito, e o
contrato inteiro depende de a linha voltar como saiu.

### A linha `busca:` do `INDICE.md`

É ela que diz o transporte e o lugar, e é a primeira coisa que a skill lê:

```
busca: local · C:\Users\rafael\busca
busca: drive · /busca
```

Transporte, ponto médio, o lugar. O transporte é `local` ou `drive`, e não há um
terceiro valor. **Linha ausente ou valor desconhecido: o transporte é o lugar
onde o `INDICE.md` foi encontrado**, e a skill segue sem perguntar — busca
montada antes desta linha continua funcionando.

A linha `envio:` só existe quando `WhatsApp: sim`, e ela governa o que a seção
7.1 faz. Os três valores são `pergunta sempre` (o padrão, e o que vale se a
linha faltar), `responder sem perguntar` e `não`. Ela **não** se deriva do
`modo:` — envio é ato com terceiro, e quem ligou o automático para o trabalho
não ligou para a boca dele.

`busca: drive` implica `Google Drive: sim` em `## O que está conectado`: é o
mesmo conector, e a busca que abriu é o teste.

### A tabela de equivalência

O verbo é o mesmo nos dois; a ferramenta é outra. **O nome exato da ferramenta
muda com o programa que executa a skill; o verbo não.**

| a operação | no `local` | no `drive` |
|---|---|---|
| achar o `INDICE.md` | ler `<lugar>/INDICE.md` | procurar a pasta `busca`, e `INDICE.md` dentro dela |
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
  **Enquanto isso valer, a busca no `drive` pode ser criada e não pode ser
  mantida** — e quase toda skill existe para mudar arquivo que já existe.
  Uma skill que precise gravar por cima em `drive` PARA e diz isso ao candidato;
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
| o conector do Drive não está ligado, ou perdeu a autorização | diz que a busca está no Drive e o conector não respondeu, e para. Não procura pasta parecida no computador |
| a busca não achou o arquivo | **lista a pasta pai antes de concluir que ele não existe.** A pasta apareceu e o arquivo não está lá: aí sim é arquivo a criar, ou é `?`, ou é pergunta |
| a busca não achou a pasta pai | a busca não está onde a linha `busca:` diz. Mostra o lugar que tentou e para. **Não monta a busca de novo** |
| a leitura falhou no meio | para. O que voltou pela metade se descarta e não se grava por cima; a skill diz qual arquivo era |
| a gravação falhou | diz qual arquivo não foi gravado, com o lugar, e o que ele deveria conter. O candidato precisa saber o que ficou de fora |

Busca vazia não prova ausência: prova que a busca voltou vazia. Listar a pasta
custa uma chamada, e é o que separa “não existe” de “não achei”.

### A primeira leitura

Antes de qualquer outra coisa, a skill lê o `INDICE.md`:

1. procura no `local`, em `~/busca/INDICE.md`. Não há ferramenta de arquivo
   neste ambiente? Este degrau não existe: comece pelo 2
2. não achou, procura a pasta `busca` no Drive e o `INDICE.md` dentro dela
3. leu: a linha `busca:` diz o transporte, e **toda leitura e toda gravação
   da execução vão por ele**
4. a linha diz um transporte e o arquivo apareceu no outro? A linha vence: vá ao
   lugar que ela diz e leia o `INDICE.md` de lá
5. e há `INDICE.md` nos dois lugares? Isso é bifurcação, não detalhe: mostre as
   duas buscas, com o lugar de cada uma, e pergunte qual fica. **Não funde as
   duas**
6. não há `INDICE.md` em lugar nenhum: a busca não existe. A skill faz uma
   coisa só — diz isso em uma linha e manda rodar `/vagas:comecar`, que é
   quem pergunta o transporte. Vale em `local` e em `drive`

Não cria a busca por conta própria, não trabalha sem ela, não improvisa em
outra pasta. Depois do `INDICE.md` vem a linha `modo:` (seção 5), e então a
ordem de busca da seção 8.

### Quem é dono do quê

Um fato tem um dono, e só o dono é editado à mão:

| arquivo | é | quem manda |
|---|---|---|
| arquivo da vaga | **dono** dos fatos da vaga, inclusive `etapa:` | ele |
| arquivo do contato | **dono** dos fatos do contato — e ele não tem `etapa:` | ele |
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
toda mensagem para o candidato: `V-014 (Técnica de Enfermagem UTI, Vértice Saúde)`.
Nunca só `V-014`, nunca só “aquela do hospital”.

O id existe para o arquivo e o link não quebrarem quando a empresa republicar a
vaga com outro título — e ela republica. O apelido existe para o candidato saber
de qual se fala sem abrir nada. Os dois juntos, sempre — inclusive dentro de
listas, de tabelas e do histórico.

```
V-   vaga                              V-014
P-   contato (recrutador, gestor,      P-003
     referência — gente)
```

Número sequencial de três dígitos, por prefixo. **Id não se reaproveita**, nem
depois que a vaga vai para `arquivo-morto/`: o próximo é sempre o maior já usado
mais um, contando o arquivo morto junto. Para achar o maior, leia o `_indice.md`
do tema — ele lista os vivos e os aposentados.

**A mesma vaga em duas fontes é UMA vaga.** Ela aparece no site da empresa, no
agregador e na rede profissional, com três links e às vezes três títulos.
Mesma empresa, mesmo cargo, mesma cidade ou regime, publicada na mesma quinzena:
é uma, e o segundo link entra no campo `também em:`. Candidatar-se duas vezes à
mesma vaga por portas diferentes é o erro que o recrutador vê. Na dúvida,
pergunte.

**Vaga republicada meses depois é outra vaga**, com id novo — e a linha de
`## Histórico` dela aponta para a antiga, que continua no arquivo morto com o
que aconteceu da primeira vez.

### O apelido

- vaga: `<cargo curto>, <empresa>` — `Técnica de Enfermagem UTI, Vértice Saúde`,
  `Atendente de SAC, Rota Delivery`, `PM de IA, Lumina Pagamentos`. O cargo como
  a vaga o escreve, encurtado até caber; a empresa pelo nome que ela usa, não a
  razão social.
- contato: nome e sobrenome como ele assina — `Bruno Sato`.

### O nome do arquivo

Id, hífen, apelido em minúsculas, sem acento, sem vírgula, palavras ligadas por
hífen. Na vaga, **só a empresa** — o cargo fica de fora, porque é ele que muda
quando republicam, e o arquivo já é único pelo id:

```
V-014 (Técnica de Enfermagem UTI, Vértice Saúde)      → V-014-vertice-saude.md
V-020 (Atendente de SAC, Rota Delivery)               → V-020-rota-delivery.md
P-003 (Bruno Sato)                                    → P-003-bruno-sato.md
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
regime: remoto no Brasil  ← link, 2026-09-07
telefone: +55 48 90000-0105  ← _bruto/2026-09-11-whatsapp-helena.md
idioma: inglês intermediário, leitura técnica  ← ficha colada, 2026-09-07
prazo: querem fechar até o fim de outubro  ← candidato, 2026-09-11
```

As origens possíveis, e não há outras:

```
link              a página da vaga que o candidato colou (a URL fica no campo link:)
ficha colada      o texto da ficha, quando o site não devolveu nada
_bruto/<arquivo>  conversa, e-mail ou documento que está em _bruto/
candidato          o próprio candidato disse agora, na conversa com a skill
<conector>        a fonte que devolveu a vaga, pelo nome — gupy, greenhouse, linkedin-vagas
perfil.md         o julgamento aponta o arquivo que o sustenta — perfil.md ou trajetoria.md
```

**O que não se apurou entra como `?`.** Nunca uma estimativa, nunca “por volta
de”, nunca um número de vaga que se pareça. O `?` pode levar na procedência o que
resolve ele:

```
faixa: ?  ← a vaga não publica; perguntar na primeira conversa
contrato: ?  ← o anúncio não diz se é PJ ou CLT
e-mail: ?
```

Campo inventado com cara de apurado é pior que campo vazio: o candidato repassa
para o contato e descobre na entrevista. E o `?` é a linha mais útil do arquivo —
é o que a próxima skill vai perguntar.

**Fato novo que contradiz o gravado:** o novo vale, com a procedência dele, e
o antigo desce para `## Histórico` com a procedência que tinha — nada se
apaga. Em copiloto a skill mostra os dois antes de trocar; em automático troca
e declara (seção 5).

Data sempre em `AAAA-MM-DD`. É a única forma que ordena sozinha e em que
`12/08` não vira agosto de um lado e dezembro do outro. Ao FALAR com o candidato,
escreva `12 de agosto`; ao ESCREVER no arquivo, `2026-08-12`.

### Regra 3 · O que morre é aposentado com data e motivo

Gaveta, não lixeira. **Nenhuma skill apaga arquivo da busca, nunca.**

Aposentar é isto, nesta ordem:

1. no alto do arquivo, logo abaixo do título, entra uma linha:
   `aposentado: 2026-08-19 · motivo: fechou: a página da vaga saiu do ar em 2026-08-19`
2. o arquivo é movido para `arquivo-morto/vagas/` ou `arquivo-morto/contatos/`
3. no `_indice.md`, a linha sai da tabela de cima e entra em `## Arquivo morto`,
   com o desfecho em uma linha
4. some do `funil.md` e do `hoje.md`, que são vistas dos vivos

Quando aposentar, sem inventar outros critérios: vaga que fechou, que recusou a
candidatura, que você julgou que não vale, de que você desistiu, cuja proposta
você aceitou (`aceitei`, o fim bom, que põe a busca em pausa), ou que está
`candidatada` e sem resposta nenhuma há **45 dias**; contato que pediu para não
ser procurado, ou que saiu da empresa. Vaga que parou há menos que isso
não vai para o arquivo morto — é assunto de `/vagas:retomar-contato`.

Aposentar em modo automático é permitido para o prazo de 45 dias. Aposentar por
qualquer outro motivo é decisão do candidato, mesmo no automático.

---

### 3.1 · O que é seu, o que é dos outros, e o que nunca entra

Esta busca guarda dois tipos de dado, e eles não têm o mesmo dono.

```
o que é SEU          a trajetória, a pretensão, o piso que você não diz em voz
                     alta, por que saiu do último lugar. Mora no seu computador
                     e sai dele só quando VOCÊ manda — numa candidatura, numa
                     mensagem, num currículo. Nenhuma skill põe a pretensão
                     numa mensagem sem você ter visto a mensagem

o que é DOS OUTROS   o recrutador e o gestor são gente, e o que se guarda deles
                     é o dado PROFISSIONAL: nome, cargo, empresa, o e-mail e o
                     telefone que eles mesmos publicaram ou usaram para falar
                     com você. A origem vai escrita, como em todo campo (regra 2)

o que NUNCA entra    CPF, RG, endereço, data de nascimento, dado de saúde, foto
                     e senha — nem os seus. Formulário que pede isso, VOCÊ
                     preenche na hora; a busca não é o lugar de guardar
                     documento, e uma pasta de texto não é cofre

o que você DECLARA   gênero, raça/cor, deficiência, pronomes: só se VOCÊ
                     escrever, na linha `autodeclaração, para formulário:` do
                     `## Quem sou`. Aí a candidatura marca a opção que bate;
                     o que a linha não diz continua seu, na hora, e nada se
                     deduz de nada (D256)
```

**A `autodeclaração` é dado sensível pela LGPD** — raça/cor e deficiência
estão na lista da lei (art. 5º, II), e gênero e pronomes se tratam com o mesmo
cuidado. Por isso a linha tem quatro condições, e nenhuma skill as afrouxa:

```
só o que está escrito    grava-se o que VOCÊ declarou por escrito, com as
                         suas palavras. Nada se infere do nome, da foto, da
                         conversa ou de uma resposta de formulário antiga
só na sua busca          a linha mora no seu `INDICE.md` e sai dele apenas
                         para o formulário que você está vendo preencher
apaga-se quando quiser   apagar a linha basta, a qualquer hora, e nenhuma
                         skill a reescreve depois
no Drive, vai junto      se a busca mora no Google Drive (seção 1), a linha
                         mora lá também, com as regras de acesso da sua conta
                         Google. Quem não quer esse dado fora do computador
                         deixa a linha em branco e marca na hora
```

**Escrever a um recrutador que não pediu é legítimo, e tem condição.** Ele
publicou a vaga e o contato profissional para ser procurado por candidato: a
expectativa existe. O que a sustenta é a mensagem dizer quem você é e por qual
vaga escreve, ir pelo canal profissional dele, e **parar quando ele pedir** —
`não contatar: sim` no arquivo do contato vale para todas as skills, nos dois
modos, e não tem exceção.

**O que nenhuma skill faz, nem a pedido:** candidatar-se em volume sem você ler
cada candidatura; responder pergunta de formulário com fato que não está na
`trajetoria.md`; escrever a mesma mensagem para dez recrutadores. As três têm o
mesmo defeito — trocam a sua reputação por velocidade, e a reputação é o que
você está vendendo.

Nada disto é conselho jurídico. É o recorte que o pack cumpre por padrão,
escrito para você saber o que ele faz sozinho e o que continua sendo decisão sua.

---

## 4 · Os formatos, literais

Sete arquivos, sete gabaritos. O que vale como formato é o que está abaixo, e
`/vagas:comecar` copia os vazios de `modelos/`. Campo que não existe no
gabarito não se inventa: se o candidato trouxe um fato que não cabe em lugar nenhum, ele vai
para `## Histórico` com a data.

Nenhum arquivo da busca tem frontmatter YAML. O cabeçalho é linha de
`campo: valor`, que o candidato lê sem saber que é um formato.

Os gabaritos ficam em `references/modelos/`, dentro da própria skill, e vão para
cá:

```
modelos/INDICE.md             → ~/busca/INDICE.md
modelos/hoje.md               → ~/busca/hoje.md
modelos/funil.md              → ~/busca/funil.md
modelos/_indice-vagas.md      → ~/busca/vagas/_indice.md
modelos/_indice-contatos.md   → ~/busca/contatos/_indice.md
modelos/vaga.md               → ~/busca/vagas/<id>-<apelido>.md         (uma por vaga)
modelos/contato.md            → ~/busca/contatos/<id>-<apelido>.md      (um por contato)
modelos/perfil.md             → ~/busca/perfil.md
modelos/trajetoria.md         → ~/busca/trajetoria.md
modelos/curriculo.md          → ~/busca/curriculos/CV-base.md
```

Cada modelo abre com um comentário `<!-- MODELO · … -->` explicando o que
preencher. **Ao gravar de verdade, esses comentários saem** — todos. Modelo que
chega ao candidato com o próprio manual dentro parece arquivo pela metade.

**E o mesmo vale para o que está entre `<` e `>`.** Os gabaritos marcam assim
o que se preenche: `<AAAA-MM-DD>`, `<nome do candidato>`, `<V-000 (cargo curto,
empresa)>`. **Nenhum `<…>` chega ao candidato.** Ou vira o valor, ou vira `?`
pela regra do não-apurado (seção 3) — e data nunca vira `?`, porque a data de
hoje sempre se sabe.

Isto é regra e não zelo: medido montando uma busca do zero, o `hoje.md`
nascia com `# Hoje — <AAAA-MM-DD>` e ficava assim, porque nenhum passo o toca
depois de copiá-lo. Os outros três só escapavam quando o candidato NÃO pulava
os passos que preenchem as vistas — e esses passos são puláveis. O comentário
some e o esqueleto do gabarito fica: o arquivo que ele abre todo dia começa
com um campo de formulário em branco.

### 4.1 · `INDICE.md`

O mapa e a configuração. Toda skill lê este arquivo antes de qualquer coisa.
Teto: **120 linhas**.

```markdown
# Busca de Rafael Duarte

busca: local · C:\Users\rafael\busca
modo: copiloto
atualizado: 2026-09-14

## Quem sou — é esta a voz das mensagens
nome: Rafael Duarte
o que eu faço: gerente de produto sênior, oito anos em fintech e logística
cidade: Florianópolis, SC
telefone: +55 48 90000-0101
e-mail: rafael@rafaelduarte.example
perfil profissional: https://linkedin.com/in/exemplo-rafael-duarte
portfólio: https://rafaelduarte.example
assinatura de e-mail: Rafael Duarte · gerente de produto · rafaelduarte.example

## Onde está o quê
perfil.md        o que procuro, o que aceito, o que descarto, quanto, e onde olhar
trajetoria.md    o que eu fiz na minha trajetória, com os números que posso dizer — a fonte de todo currículo
hoje.md          o que vence, o que travou, o que prometeram e não mandaram
funil.md         que vaga está em que etapa, desde quando
vagas/           _indice.md tem a lista; um arquivo por vaga
contatos/        _indice.md tem a lista; um arquivo por pessoa — pode estar vazia
curriculos/      o currículo base e o de cada vaga. Derivados da trajetoria.md
cartas/          a carta de cada vaga que tem o campo, com o PDF — rascunho até você aprovar
_bruto/          o que as buscas devolveram, conversas, anúncios colados — a origem
arquivo-morto/   o que foi aposentado, com data e motivo

## Quanto tem (recontar ao gravar)
vagas novas, por julgar: 9
vagas salvas, por candidatar: 4
candidaturas em andamento: 6
contatos: 5
aposentadas: 31

## O que está conectado
fontes de vaga: sim  ← testado 2026-09-14
navegador: não — pulado no começo
Gmail: sim  ← testado 2026-09-14
Google Agenda: sim  ← testado 2026-09-14
WhatsApp: não
envio: pergunta sempre

## Como eu trabalho
canal padrão com contato: e-mail
canal padrão depois que responde: WhatsApp
horário que costumo oferecer para entrevista: terça a quinta, 9h às 11h ou depois das 16h
quantas candidaturas por dia: 3
quantas vagas por julgar no máximo: 30
envio de candidatura: eu aperto

## Pulado no começo
- ligar o navegador — 2026-09-14
```

`busca:` é a linha da seção 1 — o transporte e o lugar. `modo:` é a linha da
seção 5. `## Quem sou` é o que assina as mensagens e o cabeçalho de todo
currículo e carta — nome, cidade, e-mail, telefone, perfil profissional e
portfólio saem daqui, iguais —, e `o que eu faço:` é o que a primeira linha de
qualquer mensagem tem de conseguir dizer. `## Pulado no começo` é a lista que
`/vagas:comecar` deixa para depois, e qualquer skill pode oferecer retomar um
item dela — uma vez, sem insistir.

**`quantas candidaturas por dia:` é um teto, não uma meta.** Candidatura boa
custa uma hora de leitura e adaptação; dez por dia são dez candidaturas ruins.
Nenhuma skill o ultrapassa por achar que a fila está cheia.

**`quantas vagas por julgar no máximo:` segura a busca.** Fonte pública devolve
centenas de vagas, e pilha de cem por julgar é pilha que ninguém julga. Bateu
no teto, `/vagas:buscar-vagas` para de trazer e diz que a vez é de
`/vagas:triar-vagas`.

**`envio de candidatura:` decide quem aperta o botão de enviar.** `eu aperto`
é o padrão: a skill preenche e para com o botão na tela. `aperta depois de eu
aprovar no painel` deixa que ela aperte — depois do seu sim àquela
candidatura, uma por vez, com a tela inteira lida antes. O aviso do risco de
conta aparece UMA vez, no ato de trocar a linha, e a seção 12.1 diz o que não
muda de um regime para o outro. **Ela não é a linha `modo:`**: o modo decide
quanto a skill pergunta no caminho, e esta decide quem aperta.

**A pretensão NÃO mora aqui.** Ela está no `perfil.md`, e a razão é de uso: o
`INDICE.md` é o arquivo que mais aparece em tela compartilhada.

### 4.2 · `hoje.md`

Vista derivada, reescrita por `/vagas:o-que-fazer-hoje`. Quatro seções, nesta
ordem, e nenhuma outra. Toda linha é uma caixa de marcar, cita id com apelido e **abre pela vaga** — o
contato vem depois, quando há.

```markdown
# Hoje — 2026-09-14

## Vence hoje
- [ ] V-019 (Gerente de Produto Sênior, Trilho Logística) — entrevista às 10h com P-005 (Helena Prates); reler a vaga antes
- [ ] V-022 (Lead PM, Pátio Varejo) — P-003 (Bruno Sato) perguntou a pretensão ontem, e não teve retorno

## Parado
- [ ] V-012 (PM de IA, Lumina Pagamentos) — salva desde 2026-09-08 e sem candidatura
- [ ] V-027 (Head de Produto, Aurora Saúde) — candidatada há 12 dias, sem contato: achar com quem falar

## Aguardando retorno
- [ ] V-022 (Lead PM, Pátio Varejo) — P-003 (Bruno Sato) ia mandar o estudo de caso até 2026-09-11, três dias

## Concluído nos últimos 7 dias
- [x] 2026-09-10 — V-022 (Lead PM, Pátio Varejo): resposta enviada a P-003 (Bruno Sato)
```

Seção vazia continua na página, com uma linha só: `- nada aqui hoje.` Sumir com
a seção faz o candidato achar que a skill esqueceu.

### 4.3 · `funil.md`

Vista derivada do campo `etapa:` dos arquivos de vaga. As etapas são estas
seis, nesta ordem, e **nenhuma skill cria etapa nova**:

```
nova · salva · candidatada · em contato · entrevista · proposta
```

```
nova          entrou pela busca ou colada, e passou no que descarta sozinho.
              Ainda não foi julgada por gente
salva         você olhou e quer se candidatar
candidatada   saiu, e está escrito por onde, quando e com que currículo
em contato    alguém do lado de lá respondeu
entrevista    marcada, ou em rodadas
proposta      há número na mesa
```

Quem sai do funil não vira etapa: vai para `arquivo-morto/` pela regra 3, com
o motivo — `não vale`, `fechou`, `recusada`, `sem resposta`, `desisti`.

**`aceitei` é o fim bom, e sai pelo mesmo caminho.** A vaga em `proposta` vai
para `arquivo-morto/` com o motivo `aceitei` e a data — o arquivo morto é onde
ela fica guardada, não um julgamento sobre ela. No painel ela não é descarte:
tem botão próprio, e não o vermelho. E ela **põe a busca em pausa**: com uma
vaga `aceitei` no arquivo morto, `/vagas:o-que-fazer-hoje` e
`/vagas:organizar-busca` dizem que a busca está em pausa e não oferecem vaga
nova.

**A etapa é da vaga, não do contato.** Vaga anda sozinha — a maior parte delas
passa de `nova` a `candidatada` sem que exista uma pessoa com nome do outro
lado. O contato, quando aparece, é quem FALA pela vaga; ele não tem etapa, e o
mesmo recrutador pode falar por duas vagas em etapas diferentes.

```markdown
# Funil — atualizado em 2026-09-14

## nova
- V-033 (Analista de Atendimento, Nimbo Atendimento) · desde 2026-09-13 · regime ? · veio de gupy · próximo: julgar

## salva
- V-024 (Assistente de Sucesso do Cliente, Malha Telecom) · desde 2026-09-08 · remoto · encaixe alto, 44h seg–sex · próximo: adaptar o currículo

## candidatada
- V-020 (Atendente de SAC, Rota Delivery) · desde 2026-09-02 · híbrido em São Paulo · pelo site, com V-020-cv.md · próximo: achar com quem falar

## em contato
- V-023 (Consultora de Relacionamento, Pátio Varejo) · P-004 (Lívia Matos) · desde 2026-09-09 · presencial em São Paulo, 44h seg–sex · perguntou a pretensão · próximo: responder hoje

## entrevista
- V-018 (Analista de CS Júnior, Lumina Pagamentos) · P-006 (Tiago Moura) · desde 2026-09-11 · remoto no Brasil · segunda rodada dia 14, 10h · próximo: reler a vaga

## proposta
- nada aqui.
```

Uma linha por vaga, com o contato dela quando há, `· desde AAAA-MM-DD` e
`· próximo: <ação>`. Vaga aparece em uma etapa só. O exemplo é a busca de
quem sai do balcão de loja para o atendimento: a jornada entra na nota quando
é ela que decide, como o regime.

**A nota da linha começa pelo regime e o lugar** — `remoto`, `híbrido em
Campinas`, `presencial em São Paulo`, ou `regime ?` quando o anúncio não diz. O
funil é o que se folheia, e o regime é o que decide se cabe: uma linha que abre
com "encaixe alto" e cala o regime fez o candidato perder tempo numa vaga que
não era para ele (D240).

### 4.4 · O arquivo de vaga — `vagas/V-014-vertice-saude.md`

Teto: **60 linhas**.

```markdown
# V-014 (Técnica de Enfermagem UTI, Vértice Saúde)

link: https://verticesaude.gupy.io/jobs/8812001  ← gupy, 2026-09-07
também em: https://www.linkedin.com/jobs/view/4000000001  ← linkedin-vagas, 2026-09-08
estado: aberta  ← gupy, 2026-09-13
etapa: salva · desde 2026-09-08
empresa: Vértice Saúde  ← gupy, 2026-09-07
cargo: Técnico(a) de Enfermagem — UTI Adulto  ← gupy, 2026-09-07
regime: presencial no Recife, bairro da Boa Vista  ← gupy, 2026-09-07
contrato: CLT  ← gupy, 2026-09-07
jornada: 12x36, plantão noturno  ← gupy, 2026-09-07
faixa: ?  ← a vaga não publica
salário relatado: R$ 3.100 a 3.900 por mês, média R$ 3.450 · Técnico de Enfermagem, 11 relatos de 2024 a 2026  ← _bruto/2026-09-07-glassdoor-vertice-saude.md
idioma: não pede  ← gupy, 2026-09-07
publicada: 2026-09-05  ← gupy, 2026-09-07
inscrições até: 2026-09-20  ← gupy, 2026-09-07
contato: ?
encaixe: alto  ← candidato, 2026-09-08

## O que a vaga pede
- COREN ativo em Pernambuco  ← gupy, 2026-09-07
- vivência em UTI adulto “é diferencial”; estágio conta  ← gupy, 2026-09-07
- processo: prova técnica, dinâmica, entrevista com a coordenação de enfermagem  ← gupy, 2026-09-07

## O que pesa a favor
- é o primeiro papel da lista do perfil, e o 12x36 é a jornada que eu aceito  ← perfil.md
- o estágio foi em UTI adulto, com seis meses de plantão supervisionado  ← trajetoria.md

## O que pesa contra
- não diz a faixa, e o salário relatado fica perto do piso  ← candidato, 2026-09-08

## Candidatura
- nada ainda.

## Combinado
- nada ainda.

## Histórico
- 2026-09-07 entrou pela busca  ← _bruto/2026-09-07-busca.md
- 2026-09-08 salva  ← candidato, 2026-09-08
```

`estado:` é da VAGA, e é um destes: `aberta`, `fechou`. `etapa:` é da SUA
candidatura, e é uma das seis da seção 4.3 — **é aqui que ela mora**, e o
`funil.md` só reflete. Mudou a etapa, mudam os dois na mesma passada, e a data
de `desde` é a da mudança. Vaga que `fechou` numa etapa viva é caso de aposentar
(regra 3): conferir o estado é a primeira coisa que `/vagas:buscar-vagas` faz
com o que já está na busca.

`contrato:` é o vínculo que a vaga oferece, com a palavra da lista —
`CLT`, `PJ`, `temporário`, `estágio`, `aprendiz`, `autônomo`, `intermitente`,
`cooperado`, `concurso` —, e se confere contra o `contrato:` do `## Aceito` do
perfil e a linha dele no `## Quanto`. `jornada:` vem logo abaixo, em texto
livre e como o anúncio a diz: `44h seg–sex`, `12x36`, `6x1`, `meio período`,
`flexível`. Para muita profissão é ela, e não o regime, que decide se a vaga
cabe na vida — pesa contra o perfil como qualquer outro campo, e só corta
sozinha se o `## Descarto` a nomear (`escala 6x1`, `plantão de 24 horas`).

`idioma:` é `não pede`, ou a língua e o nível que o anúncio exige —
`inglês avançado`, `espanhol básico`; duas línguas, separadas por ` · `. O
nível se lê contra o `## Idiomas` da trajetória, e o que a vaga pede acima dele
vai para `## O que pesa contra`, dito assim. `?` é o anúncio que não fala do
assunto — e não é o mesmo que `não pede`.

`inscrições até:` é a data em que a vaga deixa de aceitar candidatura, quando o
anúncio a traz — e é o único prazo deste arquivo que sobe sozinho para o
`hoje.md`. `?` é o comum.

`encaixe:` é `alto`, `médio` ou `baixo`, e é **julgamento** — a única linha do
cabeçalho que não é fato apurado. Por isso as duas seções abaixo dele existem:
`## O que pesa a favor` e `## O que pesa contra` são o que sustenta a palavra, e cada
linha aponta para o `perfil.md`, para a `trajetoria.md` ou para quem julgou.
Encaixe sem razão escrita é nota de aplicativo, e ninguém confia numa.

`## Candidatura` guarda **o que saiu**: a data, por onde (formulário, e-mail,
indicação), com que currículo, e o arquivo de `_bruto/` com as respostas como
foram enviadas. Seção 12 diz quando essa linha pode ser escrita — e não é
quando o formulário ficou pronto.

`salário relatado:` é o que quem trabalha na empresa contou ao Glassdoor para o
cargo mais perto do da vaga: a faixa e a média da remuneração total por mês, o
cargo como a página o chama, quantos relatos e de que anos. **Não é a faixa.**
`faixa:` é o que a vaga publica; este é o que funcionários relataram, de
senioridade e data que só a página do cargo diz. Os dois não se misturam: ele
nunca sobe para `faixa:`, e nunca entra numa mensagem como se fosse a faixa
deles — "vi que vocês pagam" é o tipo de frase que encerra a conversa.

Quem o procura é `/vagas:triar-vagas` (a vaga que ela lê) e
`/vagas:completar-ficha` (a vaga que o candidato pediu), e o caminho é este:

```
1  o _bruto/           `AAAA-MM-DD-glassdoor-<empresa>.md` de até 30 dias serve
                       a toda vaga da mesma empresa — não se relê a página
2  o navegador         o Glassdoor barra a ferramenta de web (403) e abre no
                       navegador. A sessão dele está no `conectores_estado`,
                       em `navegador.sessoes.glassdoor`: `logada` vê a lista
                       inteira; `vencida` ou `sem-sessao` vê o que é público,
                       e diz UMA vez que o login se faz na tela Integrações
                       do painel. Sem navegador ligado: `?` e a razão
3  a página da empresa glassdoor.com.br, a de salários (`/Salário/<Empresa>-
                       Salários-E<id>.htm`), pela busca do site ou da web.
                       Homônimo existe — a Vértice Saúde do Recife divide o
                       nome com uma Vértice Saúde de Lisboa: confira as cidades
4  a página do cargo   `…/Salário/<Empresa>-<Cargo>-Salários-E<id>_D_KO….htm`,
                       a partir do cargo da lista. É ela que decide: traz cada
                       relato com anos de experiência, cidade e data, e abre
                       mesmo sem sessão. Sem sessão, a página da empresa
                       mostra só os dez cargos com mais relatos: o cargo que
                       ficou de fora se acha montando o endereço dele
5  o cargo             o mesmo da vaga; não havendo, o vizinho mais perto
                       (Técnico de Enfermagem para Técnica de Enfermagem UTI),
                       nomeado na linha. Nada perto: `?  ← glassdoor,
                       <data>: a <empresa> não tem relato de <cargo>`
```

O que vai na linha: a faixa e a média por mês, o cargo, quantos relatos e de
que anos, e — quando a vaga é sênior e os relatos variam — o do relato mais
experiente. As "Perguntas frequentes" do pé da página NÃO valem: na da Vértice
Saúde elas davam "R$ 3.467 por ano" para uma tabela de R$ 3.100 a 3.900 por mês.
As páginas lidas vão para o `_bruto/` antes de virar campo, como tudo.

`?` com a razão ao lado é o comum, e não se resolve com número de outro lugar:
agregador que esconde a empresa (Jobgether, Toptal), empresa sem página,
navegador desligado. A média do cargo no país é de outras empresas e não entra
no campo; se ajudar, vai numa linha de `## O que pesa contra`, dita como média
do mercado e com a fonte.

**Como ele pesa** — contra o `## Quanto` do perfil, na triagem. Abaixo do piso,
vai para `## O que pesa contra` como "o salário relatado fica abaixo do piso",
sem o número do piso (a pretensão não aparece por extenso, seção 3.1); passando
dele, pode ir para `## O que pesa a favor`. **Pesa e não corta**, a não ser que
o `## Descarto` do perfil diga — e poucos relatos, ou relatos antigos, dizem
isso na mesma linha.

`contato:` aponta para o arquivo de quem fala pela vaga — `P-003 (Bruno Sato)`
—, e `?` é o estado normal: a maioria das vagas nunca ganha um nome.

### 4.5 · O arquivo de contato — `contatos/P-003-bruno-sato.md`

Teto: **50 linhas**. Contato é GENTE do outro lado: recrutador, gestor da vaga,
ou alguém que pode dar referência. **A pasta pode estar vazia**, e isso não é
busca malfeita — é busca no começo.

```markdown
# P-003 (Bruno Sato)

papel: recrutador  ← _bruto/2026-09-09-email-bruno.md
empresa: Pátio Varejo  ← _bruto/2026-09-09-email-bruno.md
cargo: talent partner  ← assinatura do e-mail, 2026-09-09
e-mail: bruno.sato@patiovarejo.example  ← _bruto/2026-09-09-email-bruno.md
telefone: ?
perfil profissional: ?
canal: e-mail
de onde veio: respondeu à candidatura da V-022  ← _bruto/2026-09-09-email-bruno.md
não contatar: não

## Fala por
- V-022 (Lead PM, Pátio Varejo) · desde 2026-09-09

## O que ele me disse
processo: três conversas e um estudo de caso  ← _bruto/2026-09-09-email-bruno.md
prazo: querem fechar até o fim de outubro  ← _bruto/2026-09-09-email-bruno.md
faixa: ?  ← perguntou a minha antes de dizer a deles

## O que já mandei
- 2026-09-10 · e-mail · agradeci e propus terça ou quinta · respondeu em 11/09

## Combinado
- ele ia mandar o estudo de caso até 2026-09-11, e não mandou

## Histórico
- 2026-09-09 primeiro contato, por e-mail  ← _bruto/2026-09-09-email-bruno.md
```

`papel:` é um destes: `recrutador`, `gestor`, `referência`, `indicação`. Ele
decide o tom e o que se pede: ao recrutador se pergunta prazo e processo; ao
gestor, o problema que a vaga resolve; à referência se pede **referência**, não
emprego — e só depois de a vaga existir.

**Contato não tem `etapa:`.** Quem anda no funil é a vaga (seção 4.3). O que
liga os dois é `## Fala por` aqui e `contato:` lá, e os dois se escrevem na
mesma passada.

`## O que já mandei` guarda **toda** mensagem que `/vagas:escrever-ao-contato`
escreveu, com o que ela pedia — uma linha por mensagem, mesmo a que não teve
resposta: sobretudo a que não teve resposta. A **retomada** é outra coisa, e
mora noutro lugar: é andamento da vaga, e vai para o `## Histórico` dela, com o
nome de quem recebeu (seção 4.4). `/vagas:retomar-contato` lê os dois para não
repetir a pergunta.

`não contatar: sim` só existe se ele pediu, e aí vale para todas as skills, nos
dois modos (seção 3.1).

### 4.6 · Os dois `_indice.md`

Vista derivada, uma tabela, **uma linha por item**, e nada além disso. Quem
quer detalhe abre o arquivo — é para isso que a linha tem o id.

`vagas/_indice.md` — sem a etapa, que é do `funil.md`:

```markdown
# Vagas — 11 vivas · atualizado em 2026-09-14

| vaga | estado | regime | encaixe | atualizada |
|---|---|---|---|---|
| V-014 (Técnica de Enfermagem UTI, Vértice Saúde) | aberta | presencial no Recife | alto | 2026-09-13 |
| V-011 (Técnica de Enfermagem, Hospital Boa Vista) | aberta | presencial no Recife | alto | 2026-09-11 |
| V-013 (Técnica de Enfermagem — sala de vacina, Rede Farma Sol) | aberta | presencial em Olinda | médio | 2026-09-13 |

## Arquivo morto
- V-006 (Técnica de Enfermagem, Aurora Saúde) · 2026-09-03 · não vale: presencial em Caruaru
- V-009 (Técnica de Enfermagem Home Care, Norte Seguros) · 2026-09-10 · fechou: a página saiu do ar
```

`contatos/_indice.md`:

```markdown
# Contatos — 8 · atualizado em 2026-09-14

| contato | papel | empresa | fala por | último contato |
|---|---|---|---|---|
| P-002 (Marta Lins) | recrutador | Hospital Boa Vista | V-011 (Técnica de Enfermagem, Hospital Boa Vista) | 2026-09-11 |
| P-004 (Sérgio Alves) | gestor | Aurora Saúde | V-016 (Técnica de Enfermagem — Pronto-Atendimento, Aurora Saúde) | 2026-09-05 |
| P-001 (Célia Moraes) | referência | Aurora Saúde | — | 2026-08-20 |

## Arquivo morto
- nada aqui.
```

**O motivo do arquivo morto é o que a busca aprende.** Dez linhas de
`não vale: presencial em Caruaru` dizem que o filtro de lugar está deixando
passar o que não devia — e quem lê isso é `/vagas:perfil-de-busca`, na
próxima vez que o perfil for revisto.

Duas linhas para a mesma **vaga** é id duplicado, e a regra da seção 9 vale:
pare, mostre as duas e pergunte qual fica.

### 4.7 · O que entra em `_bruto/`

Nome do arquivo: `AAAA-MM-DD-<canal>-<apelido-curto>.md`, sempre a data em que
o material foi produzido — não a de hoje, quando dá para saber.

```
2026-09-11-whatsapp-helena.md
2026-09-07-busca.md
2026-09-09-email-bruno.md
2026-09-10-candidatura-V-027.md
```

Cabeçalho de três linhas e, abaixo do traço, o material **colado sem tocar**:

```markdown
origem: WhatsApp, exportado pelo candidato
recebido: 2026-08-12
sobre: P-005 (Helena Prates), V-019 (Gerente de Produto Sênior, Trilho Logística)

---

[11/09/2026 09:12] Helena: oi Rafael, gostamos da conversa de terça. consegue uma segunda rodada?
[11/09/2026 09:20] Rafael: consigo sim. terça a quinta, de manhã, fica bom para vocês?
```

Bruto não se corrige, não se resume e não se apaga. Se o candidato disser que o
que está lá está errado, o certo vai para o arquivo dono com procedência
`← candidato, <data>`; o bruto continua como estava, porque ele é a prova do que
foi dito, não do que é verdade.

PDF, foto e áudio ficam onde estão e `_bruto/` guarda um arquivo `.md` que
aponta o caminho no computador. **De ouvido não se transcreve nada.** O que
existe é a transcrição que o conector já fez, e ela entra no bruto com a marca
que veio junto — seção 7. Áudio colado, ou que o conector não transcreveu,
vira pergunta ao candidato.

**Planilha importada entra inteira, e é o arquivo original.** O nome é
`AAAA-MM-DD-planilha-<nome-curto>.csv`, sem o cabeçalho de três linhas — ele é
para texto colado, e aqui o arquivo já diz o que é. O formato é CSV: Excel e
Google Sheets exportam em dois cliques, e a skill que importa ensina onde. Todo
campo que sair dela leva `← _bruto/AAAA-MM-DD-planilha-<nome-curto>.csv`,
que é a regra 2 sem origem nova. Coluna que não tem campo no gabarito não
inventa campo (seção 4), e linha que a skill não conseguiu ler vira `?` na
ficha e uma linha em `## Falta saber` — nunca um valor adivinhado. Quem importa
é `/vagas:comecar`, no primeiro dia, e `/vagas:organizar-busca`, para
o `.csv` que apareceu em `_bruto/` depois.

---

### 4.9 · `perfil.md`, que é a régua de todas as outras

Um arquivo, na raiz da busca. Teto: **80 linhas**. Escrito por
`/vagas:perfil-de-busca` e lido por **todas** as skills que decidem se uma vaga
entra, se ela vale e se uma candidatura sai.

```markdown
# Perfil — atualizado em 2026-09-14

## O que procuro, em ordem
1. técnica de enfermagem em UTI adulto · hospital de médio ou grande porte
2. técnica de enfermagem em clínica médica ou pronto-atendimento
3. técnica de enfermagem em sala de vacina ou home care — se a escala couber

## Termos de busca
"Técnico de Enfermagem", "Técnica de Enfermagem", "Técnico de Enfermagem UTI",
"Técnico de Enfermagem Plantonista", "Técnico de Enfermagem 12x36"

## Aceito
regime: presencial no Recife, em Olinda ou em Jaboatão dos Guararapes
contrato: CLT
empresa: hospital, clínica, laboratório, rede de farmácia com sala de vacina

## Descarto — e é o que a busca descarta sozinha
- presencial fora do Recife, de Olinda e de Jaboatão  ← candidato, 2026-09-14
- escala 6x1 ou plantão de 24 horas  ← candidato, 2026-09-14
- contrato autônomo, cooperado ou intermitente  ← candidato, 2026-09-14
- vaga de auxiliar de enfermagem  ← candidato, 2026-09-14

## Quanto
CLT: R$ 3.200
o que eu digo quando perguntam: “a partir de R$ 3.400, conforme o adicional noturno”

## Onde olhar
gupy: pelos termos de busca, em Recife, CLT
solides: pelos termos de busca, em "Recife - PE"
linkedin-vagas: pelos termos de busca, em Recife
apify: —
linkedin (logado): —
greenhouse: —
ashby: —
lever: —
à mão, toda semana: hospitalboavista.example/trabalhe-conosco — não tem fonte que eu alcance

## Por que
- 12x36 porque a folga de 36 horas é o que me deixa dividir o bebê com a minha mãe  ← candidato, 2026-09-14
- só CLT: carteira assinada, adicional noturno e licença garantida são o que preciso agora  ← candidato, 2026-09-14
- o piso é o que fecha a conta de casa; abaixo dele, voltar a trabalhar não se paga  ← candidato, 2026-09-14

## O que eu não sei ainda
- se aceito plantão noturno fixo — depende do adicional
```

**`## Descarto` é a única seção que age sozinha.** O que está nela
`/vagas:buscar-vagas` descarta sem perguntar — e **registra**, com o motivo, no
arquivo de `_bruto/` daquela busca: o que saiu continua conferível. Por isso
cada linha dali tem de ser um corte que se LÊ no anúncio. “Cultura ruim” não é
corte de busca: é o que `/vagas:triar-vagas` pesa, com você olhando.

**Há três caminhos até uma vaga do LinkedIn, e as três linhas dizem qual você
quer.** `linkedin-vagas` lê a listagem pública, de graça e sem conta. `apify`
lê a mesma listagem por um serviço pago — centavos por cem vagas —, com filtro
de verdade e o anúncio inteiro. `linkedin (logado)` entra na SUA conta pelo
navegador: é o único que vê as vagas recomendadas para você, e o único que
arrisca alguma coisa. Linha com `—` é caminho que você não quer, e nenhuma
skill o usa por conta própria.

**`## Onde olhar` é o que faz a busca ser sua, e não a de todo mundo.** Os
agregadores mostram o que todos veem; a página de carreira da empresa que você
quer é onde a vaga aparece primeiro. Cada linha é um conector e o que passar a
ele (seção 11) — e a empresa que nenhum conector alcança **fica na lista
mesmo assim**, como tarefa de olhar à mão, e sobe para o `hoje.md` no dia dela.

**`## Quanto` tem uma linha por contrato que você aceita**, com o piso daquele
vínculo — `CLT: R$ 3.200`; quem aceita dois escreve dois, `CLT: R$ 13 mil` e
`PJ: R$ 17 mil`. As palavras são as do `contrato:` da vaga (seção 4.4): `CLT`,
`PJ`, `temporário`, `estágio`, `aprendiz`, `autônomo`, `intermitente`,
`cooperado`, `concurso`. O piso de um vínculo não vale pelo outro — PJ sem
férias nem FGTS não se compara a CLT pelo mesmo número —, e por isso o
`contrato:` do `## Aceito` é lista aberta e cada palavra dele tem a sua linha
aqui. Contrato aceito sem linha é piso `?`: a faixa de uma vaga naquele
vínculo fica sem julgamento até você dizer o número. `o que eu digo quando
perguntam:` é uma linha só — a frase inteira, como você a diria.

**`## Quanto` não sai daqui sozinho.** Nenhuma skill escreve o piso numa
mensagem, e a frase de `o que eu digo quando perguntam:` só entra numa resposta
que você vai ler antes de mandar (seção 3.1).

**`## Por que` é o que faz este arquivo valer.** Critério sem razão não
sobrevive ao segundo mês sem entrevista: quando a fila secar, é a razão que
decide o que afrouxar. Todo critério leva procedência, como qualquer campo
(regra 2) — e a origem aqui é quase sempre `← candidato, <data>`, porque quem
sabe é ele.

**A vaga que não passa no perfil não é apagada** — a que você julgou entra no
`arquivo-morto/` com o motivo; a que a busca descartou sozinha fica na linha do
`_bruto/`. Perfil muda; vaga apagada não volta.

## 5 · Os dois modos

A skill descobre o modo lendo a linha `modo:` do `INDICE.md`. É a segunda coisa
que ela faz, depois de conferir que a busca existe.

```
modo: copiloto      para nas bifurcações e devolve o trabalho pronto até ali
modo: automatico    escolhe sozinha e DECLARA o que escolheu
```

Aceite `automatico` e `automático`. Qualquer outro valor, linha ausente ou
arquivo ilegível: **o modo é `copiloto`**. Nunca se escolhe automático por
dedução, por pressa ou porque a resposta parece óbvia — o candidato liga o
automático uma vez, no `INDICE.md`, e é lá que ele desliga.

### Copiloto

Na bifurcação, para. Antes de parar, entrega o que já ficou pronto: quem para
de mãos vazias fez o candidato esperar por nada. Pergunta uma coisa (seção 8) e
espera.

### Automático

Escolhe e segue. Ao fim da saída, **sempre**, com este título exato:

```markdown
## Decidi sozinho
- Usei o regime que está na página da empresa, “remoto no Brasil”, e não o do agregador, que dizia híbrido — a fonte é a dona da vaga. Para trocar, me diga o valor.
- Passei a V-022 (Lead PM, Pátio Varejo) para “em contato” porque o P-003 (Bruno Sato) respondeu à candidatura. Se você acha cedo, me diga que eu volto para “candidatada”.
```

Uma linha por escolha: **o que fiz — por que — como desfazer.** Sem essa
declaração, automático é caixa preta, e caixa preta na mão de quem é leigo
queima a confiança no primeiro erro. Não escolheu nada? A seção não aparece.

### A exceção escrita

**`/vagas:candidatar` para com o botão de enviar na tela, nos dois modos, e
quem envia é o candidato.** Não é uma escolha do modo: ela responde perguntas em
nome dele, numa conta que é dele, num lugar de onde não dá para voltar atrás
(seção 12.1). O `automatico` decide quanto ela pergunta no caminho, não quem
aperta o botão. Ela diz isso em uma linha, sem pedir desculpa.

Nenhuma outra skill tem exceção. Se uma skill acha que precisa de uma, ela para
e pergunta — não inventa a exceção.

---

## 6 · O que sai para o WhatsApp

O canal está no arquivo do contato (`canal:`) e **decide o formato**. Na dúvida,
WhatsApp.

**A voz é a do candidato.** A mensagem sai do WhatsApp dele, com o nome dele, e
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
Helena, confirmo a segunda rodada no dia 14, às 10h.

Você comentou que o diretor de operações participa. Publiquei o caso do rastreio
de carga que redesenhei na Rota Sul — é o mais próximo do que vocês descreveram:

https://rafaelduarte.example/casos/rastreio

Tem algum material que valha eu ler antes?
```

O link **sozinho na linha**, sem texto colado nem pontuação depois: senão a
pré-visualização do WhatsApp não abre, e é a pré-visualização que faz a foto do
vaga aparecer.

O que não entra: emoji (a não ser que a conversa colada mostre o candidato
usando, e aí no máximo um); `*negrito*` mais de uma vez, e só em hora ou
valor; saudação de escritório (“espero que esteja bem”, “tudo bem?”); cargo em
maiúsculas; “apaixonado por desafios”, “proativo”, “fora da caixa”; assinatura, que
o WhatsApp já dá; e mais de uma pergunta.

O bloco sai **sozinho, pronto para copiar**, sem comentário dentro dele. O que a
skill quiser explicar vai fora do bloco, depois.

**O bloco tem duas saídas, e a segunda depende do conector** (seção 7.1). Sem
conector — que é o caso em toda ferramenta de chat na web — existe só a
primeira, e ela é o padrão:

```
Eu mesmo mando     o candidato copia o bloco e cola no WhatsApp dele
Mando agora        a skill envia, depois de ele ver o texto e o destinatário
Mudo o texto       ele diz o que trocar, e nada sai agora
```

O rótulo diz o que a PESSOA vai fazer, nunca o nome interno da peça: “Eu mesmo
mando” e não “só o bloco”.

### E-mail é outro tamanho

```
assunto        até oito palavras, sem “Re:” de mentira
saudação       “Helena, bom dia.”
corpo          dois parágrafos curtos. Pode ter até dois links, com o texto do link
fecho          uma pergunta, e a assinatura que está no INDICE.md
```

Mensagem por e-mail que seria melhor no WhatsApp: mande no WhatsApp e diga por
quê, em uma linha.

---

## 7 · Como a conversa entra

Há dois caminhos, e quem diz qual é a linha `WhatsApp:` do `INDICE.md`
(seção 4.1). **O padrão é colado**, e é o único que funciona em toda
ferramenta: o candidato exporta ou cola, e a skill lê os dois formatos que
chegam. O conector é opcional, não existe em metade dos lugares onde o pack
roda, e **nenhuma skill o exige** — skill que só funciona com ele quebrou o
contrato.

O caminho muda; o formato não. Conversa que entrou pelo conector e conversa
que entrou colada produzem o **mesmo** arquivo em `_bruto/`, com a mesma
procedência (seção 3). Nenhuma das outras precisa saber por onde ela veio,
e é isso que impede o conector de virar um segundo pack.

Uma coisa só é diferente, e ela é do WhatsApp: **a exportação não leva o som.**
Pelo conector, nota de voz chega transcrita; colada, ela é buraco. Ver
“Áudio”, abaixo.

| a operação | colado | pelo conector |
|---|---|---|
| trazer a conversa de um contato | o candidato exporta ou cola | achar a conversa pelo telefone do arquivo do contato e ler o período que interessa |
| saber quando foi a última mensagem | está no que ele colou | pergunta-se à conversa |
| saber o que um áudio disse | perguntar ao candidato | vem transcrito, com a marca |
| guardar em `_bruto/` | igual nos dois | igual nos dois |

**O conector lê sempre, e manda uma por vez** — nunca em lote, e nunca sem o
candidato ter visto o texto e o nome de quem recebe. Como isso funciona está em
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
de pé e conectada          trabalhe, e não diga nada ao candidato
de pé e desconectada       diga o que ela reporta, em uma linha, e siga com o
                           que já está guardado — dizendo que é isso que é
fora do ar, ou parada há   PARE de tratar o conector como fonte. Diga há quanto
mais de um dia             tempo, que o que passou não volta, e que a janela do
                           `serve` precisa ser reaberta. Depois ofereça o
                           caminho colado, que funciona igual
```

**Silêncio só se justifica quando está tudo certo.** Ponte velha e trabalho
normal é o único par que o candidato não pode ver, porque é o único em que
ele acharia que a busca está em dia.

### Exportado do aplicativo

```
[11/09/2026 09:12] Helena Prates: oi Rafael, gostamos da conversa de terça. consegue uma segunda rodada?
[11/09/2026 09:20] Rafael Duarte: consigo sim. terça a quinta, de manhã, fica bom para vocês?
[11/09/2026 09:21] Helena Prates: ‎<Mídia oculta>
[11/09/2026 09:34] Helena Prates: dia 14, às 10h. vai ser com o diretor de operações junto
```

Aparece também sem colchetes, que é o formato antigo, e vale o mesmo:

```
11/09/2026 09:12 - Helena Prates: oi Rafael, gostamos da conversa de terça
```

A data é **dd/mm/aaaa** e a hora é de 24 horas — é o padrão brasileiro, e
`03/08` é 3 de agosto. Ano de dois dígitos (`12/08/26`) é 2026. Ao gravar,
converta para `2026-08-12`.

**Quem é o candidato na conversa:** é o remetente cujo nome bate com `nome:` do
`INDICE.md`. Não bateu de jeito nenhum? Uma pergunta, uma vez: “Nessa conversa,
qual dos dois é você?”. Nunca deduza pelo tom — o risco é gravar a fala do
contato como promessa do candidato.

**O que não se lê, não se inventa:** `<Mídia oculta>`, `Esta mensagem foi
apagada` e figurinha viram um buraco declarado, não um palpite. Se o buraco
está no meio do que importa, ele vira uma linha em `## Combinado` ou uma
pergunta: “Tem uma mídia oculta de 12 de agosto no meio da conversa. O que
tinha ali?”

### Áudio

Nota de voz que entra **pelo conector** chega transcrita, e a marca vem junto:

```
[12/08/2026 14:41] Helena: [áudio 0:42 · transcrição] amanhã de manhã eu consigo passar
```

Grave no `_bruto/` com a marca, como chegou. Ela não é enfeite: **é texto de
máquina**, e máquina troca nome, número e valor. Daí a regra, e ela tem duas
partes:

- **O que foi dito é fato**, e entra como qualquer outro. A procedência nomeia
  o áudio, com a data convertida como toda data de campo:
  `← _bruto/<arquivo>, áudio de 2026-08-12`. O `12/08` do rótulo é do bruto, e
  fica lá.
- **Número, valor, data e nome próprio saídos de transcrição não viram campo
  sem confirmação.** Campo preenchido não levanta suspeita em ninguém, e um
  “trezentos e cinquenta” ouvido errado sai na vaga e na mensagem que vai
  ao contato. Pergunte uma vez: “O áudio de 12/08 diz R$ 14 a 16 mil. Confere?”

Sem transcrição, o conector diz **por quê** no lugar do texto — e o motivo
decide o que fazer:

```
na fila para transcrever      ainda vem: siga, e não pergunte nada
não baixado: grupo            não vem: buraco declarado
o arquivo expirou e o
celular não tem mais          não vem: buraco declarado
```

**Colado, áudio continua buraco**, e aí vale o parágrafo de cima: vira pergunta
ao candidato.

### Texto solto

Colagem sem carimbo de data e sem nome — um pedaço de conversa, um anúncio de
vaga, um trecho do site da empresa, um e-mail encaminhado. Trate assim: o conteúdo é fato do que está
escrito, a data é a que o candidato disser (ou a de hoje, e a procedência diz
`← candidato, <hoje>`), e o autor não se adivinha.

### O que fazer com ela depois, sempre nesta ordem

1. **Grava o bruto primeiro**, em `_bruto/AAAA-MM-DD-<canal>-<apelido-curto>.md`, com
   o cabeçalho de três linhas da seção 4.7 e o texto colado sem tocar. Primeiro
   porque, se algo der errado no meio, o material do candidato já está salvo.
2. **Extrai os fatos** para os arquivos donos — contato e vaga —, cada campo
   com `← _bruto/<aquele arquivo>`. Fato é o que está escrito: “dá sábado, mas
   cedo” é `## Combinado`, não “entrevista marcada para sábado”.
3. **Atualiza as vistas** que mudaram: `funil.md` se a etapa mudou,
   `_indice.md` se entrou item ou mudou o último contato.
   A etapa é da vaga: conversa com um contato que mostra que a vaga andou
   muda o `etapa:` no arquivo da vaga de que ela trata — o arquivo do contato
   não tem esse campo. Conversa que não diz de qual vaga fala não muda etapa
   nenhuma: vira pergunta.
4. **Diz onde guardou**, no bloco `## Guardei` da seção 10.

Conversa que menciona vaga que não está na busca: não crie a vaga com o
que a conversa diz. Pergunte o link, uma vez. Sem link nem ficha, a vaga não
entra — dado que se adivinhou vira faixa errada na mensagem para o contato.

---
## 7.1 · Como a mensagem sai

**Sair é uma porta só, e o canal é o que muda.** Tudo o que vai para um
terceiro em nome do candidato — mensagem, e-mail, formulário preenchido — passa
pelas mesmas quatro garantias, e nenhum canal as dispensa:

```
ele vê antes      o destinatário pelo nome e o texto INTEIRO, como vai sair
uma de cada vez   nunca o mesmo texto para vários, em canal nenhum
ele pode parar    `não contatar` e a lista de silêncio valem em todo canal
fica escrito      o que saiu, para quem, quando — e só o que SAIU de verdade
```

```
WhatsApp          pelo conector, com o par de ferramentas descrito abaixo
e-mail            pelo conector de e-mail dele. A tela é a mesma; o que o
                  conector de e-mail oferece de melhor é o RASCUNHO na caixa
                  dele — e rascunho não é envio: não se registra como saído
formulário        pelo navegador dele, e a skill PARA antes do botão que
                  envia. Quem aperta é ele, em qualquer modo
sem conector      o bloco para copiar, que é a saída que nunca falta
```

O resto desta seção é o canal que mais tem regra, o WhatsApp — e vale **só com
o conector** (`WhatsApp: sim` no `INDICE.md`). Sem ele, a skill entrega o bloco
e para — e não pede desculpa por isso.

**A regra que governa tudo aqui: a ferramenta informa, e o candidato decide.**
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

Entre as duas, a skill **mostra ao candidato**, e o que ela mostra tem três
partes obrigatórias — é o pedido literal, e resumo não serve:

```
para    o nome como ele conhece a pessoa, o id com apelido, e quando ela
        falou pela última vez
texto   INTEIRO, do jeito que vai sair. Nunca “a resposta que combinamos”
saídas  Mando agora · Mudo o texto · Eu mesmo mando
```

A prévia vale **10 minutos** e serve **uma vez**. Ela morre se chegar mensagem
nova naquela conversa depois de criada — senão o candidato responde pelo celular
e a skill manda a resposta velha logo atrás.

### Várias de uma vez não é lote

Uma skill pode mostrar quatro mensagens e o candidato aprovar as quatro numa
tela. Isso **não** é lista de transmissão, e a diferença é de forma:

```
lista de transmissão   uma mensagem, mesmo texto, muitos destinatários, junto
várias revisadas       N mensagens DIFERENTES, uma por pessoa, com o dado dela
                       dentro, saindo uma a uma e espaçadas
```

Quando mostrar várias, mostre **o texto inteiro de cada uma** — nunca “4
mensagens aguardando” — e o **porquê de cada uma estar ali**. Quem ficou de
fora aparece com o motivo: descarte em silêncio é o que faz o candidato parar de
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

Quem **nunca trocou mensagem** com o candidato por ali é o único caso em que
o envio não sai, e a recusa não é da ferramenta: **desde julho de 2026 o próprio
WhatsApp recusa**, e salvar o número na agenda não muda nada. Quem abre a
conversa tem que ser o aplicativo do celular, uma vez; depois disso o conector
responde como em qualquer outra.

A prévia diz isso **antes**, quando vê que a conversa não existe.

**E o formato dessa primeira mensagem é um LINK.** Com conector, a prévia já vem
com ele montado; sem conector, a skill o escreve, porque é uma URL e não uma
ferramenta:

```
https://wa.me/<número com país, só dígitos>?text=<a mensagem>
```

O texto vai codificado — espaço é `%20`, quebra de linha é `%0A`. O link abre o
WhatsApp do candidato na conversa certa, **com a mensagem já escrita**: ele só
aperta enviar. Não é contorno da recusa; é o caminho oficial da Meta, e quem
abre a conversa continua sendo o aplicativo, que é o que o WhatsApp exige.

**O bloco para copiar continua junto, e não é redundância.** O link falha com
número errado, com aplicativo que não abre no computador, e com mensagem longa
demais para caber numa URL. O bloco é o plano B que funciona sempre.

**A guarda vale igual para o link.** Uma pessoa por vez, o texto inteiro na tela
antes, e quem está na lista de silêncio não recebe link nenhum: a recusa da
plataforma não é a nossa régua, e entregar dez links numa hora é o mesmo disparo
que a ponte não faz. Com conector isso é contado como envio; sem ele, quem conta
é a skill.

E o registro **fecha sozinho**: quando a mensagem sai do celular, ela volta ao
conector no sync, e o que era "link entregue" passa a ser "enviada". É o que
separa preparar de ter mandado.

Não é raro: é como quase todo contato chega da primeira vez — o que deixou o telefone
na assinatura de um e-mail e nunca escreveu.

### Quem pediu para não ser contatado

O contato que diz “não me manda mais mensagem” tem que sair do alcance de todas
as skills, e não só da que ele respondeu. São **dois lugares, e os dois são
obrigatórios**:

```
na busca   o arquivo do contato ganha  não contatar: sim  ← origem, data
              e ele é aposentado com esse motivo (seção 3)
na ponte      um comando, e é ele que escreve o arquivo — o diretório dela
              não é o da busca, e a skill não tem como adivinhar onde é:

                  whatsapp-reader nao-contatar 5551900000012 "pediu em 12/08"

              sem argumento ele lista; `--tirar <número>` desfaz
```

A busca é o que as quinze skills leem; a ponte é o que segura o envio mesmo se
alguém esquecer. **Nenhuma skill escreve mensagem para quem tem `não contatar:
sim`**, nem para retomar, nem para avisar do que entrou, nem para desejar
feliz aniversário. Não é preferência de canal: é pedido de silêncio.

Quem coloca é o candidato, ou a skill que leu o pedido na conversa — e aí ela
diz o que fez, em uma linha, porque tirar alguém da busca é do tamanho de
aposentar.

Os tetos de partida são 6 conversas diferentes por hora, 30 envios no total e 5
segundos entre dois quaisquer. **São ajustáveis, e o número certo sai do
histórico do próprio candidato.** Recusa que não diz o número nem como mudá-lo
está impedindo em vez de informar.

### Envio não é governado pelo `modo:`

O `modo:` da seção 5 governa **escolha** — qual vaga entra, qual caminho
seguir. Envio é ato com terceiro e não se desfaz, então tem linha própria no
`INDICE.md` (seção 4.1):

```
envio: pergunta sempre           o padrão, e o que vale se a linha faltar
envio: responder sem perguntar   responde conversa viva direto; começar
                                 conversa continua perguntando
envio: não                       a skill nem oferece
```

Candidato em `modo: automatico` **não herda** envio automático: quem ligou o
automático para o currículo não ligou para a boca dele.

### O que nunca sai por aqui

```
áudio, foto, documento e anexo    a ponte não os manda
pretensão, contraproposta,        a skill não decide pretensão nem avalia proposta
aceite ou recusa de proposta      (seção 10)
prazo de RH, do gestor ou de      a skill não promete prazo de terceiro
comitê de contratação
reenvio porque não respondeu      cadência é decisão, não relógio: o caminho é
                                  /vagas:retomar-contato, com ângulo novo
```

---

## 8 · Quando perguntar, e como

Perguntar cedo demais é o defeito mais caro do pack: o candidato já respondeu
aquilo, está escrito na busca, e a skill perguntou de novo.

### A ordem de busca

Só desce um degrau quando o de cima não respondeu:

```
1  INDICE.md                 quem ele é, modo, o que está conectado
2  o _indice.md do tema      vagas/ ou contatos/ — acha o id e o apelido
3  o arquivo do item         é ele o dono do fato
4  _bruto/                   a conversa ou a ficha de onde o fato veio
5  o link                    a página da vaga, quando há link e ela abre
6  PERGUNTA ao candidato      só o que nenhum dos cinco tinha
7  PEDE O DOCUMENTO          quando nem ele sabe: o anúncio inteiro, o enunciado do estudo de caso, a proposta por escrito
```

O degrau 5 tem um fim conhecido: site que só monta a página por JavaScript
devolve nada. Quando isso acontecer, diga na cara — “esse site não abre para
mim” — e peça a ficha colada. **Não chute dado de vaga**, em hipótese
nenhuma, nem para “ilustrar”.

### O tamanho da pergunta

Uma por vez. **Nunca mais de três numa execução.** Skill que abre com
formulário de oito campos é abandonada na primeira execução, e não volta.

Toda pergunta traz o motivo na mesma frase, porque o motivo é o que ensina o
ofício enquanto a skill trabalha:

```
ruim   Qual o contrato dessa vaga?
bom    Você sabe se a V-012 é PJ ou CLT? O anúncio não diz, e sem isso não dá
       para saber se a faixa deles passa do seu piso.
```

### Escolha entre dois e quatro caminhos

Use a UI de perguntas do harness (a ferramenta de perguntar ao usuário, com
botões) — não escreva as opções em prosa e peça para ele digitar o número.

Cada opção traz **o custo escrito**: o que ela exige e quanto demora.

```
Como quer responder ao P-003 (Bruno Sato), que perguntou a pretensão?

  Com a frase do perfil     a que você já escreveu para essa pergunta · pronta agora
  Devolvendo a pergunta     pede a faixa deles antes · pronta agora, e pode alongar a conversa
  As duas, para escolher    prontas agora · você lê as duas antes de mandar uma
```

Rótulo curto, até quatro palavras. A descrição declara o custo, não vende a
opção. Mais de quatro caminhos: escolha os três melhores e diga que há outros.

### Quando NÃO perguntar

- o fato está na busca: use, e cite de onde veio
- é gosto do candidato sobre o que ele já decidiu antes: siga o que está escrito
  em `## Como eu trabalho`
- é detalhe que não muda a saída: deixe `?` e siga
- em modo automático: escolha e declare (seção 5) — a exceção é
  `candidatar`, que pergunta sempre

---

## 9 · Os tetos, e o que fazer quando estouram

```
INDICE.md              120 linhas
trajetoria.md          200 linhas
perfil.md               80 linhas
arquivo de vaga         60 linhas
arquivo de contato      50 linhas
um currículo           duas páginas — umas 90 linhas de markdown
_indice.md              uma linha por item, e nada mais
hoje.md                 o que cabe num dia. Passou de 15 caixas, priorize e diga
vagas por julgar        o número do INDICE.md — 30, se ele não disser outro
```

Confira o teto **ao gravar**, não depois. Estourou:

- **vaga:** o que cresce é `## O que a vaga pede`, porque o anúncio é longo. O
  anúncio inteiro mora em `_bruto/`; no arquivo ficam as linhas que decidem —
  o que elimina, o que pesa, o processo. Se ainda estourar, o `## Histórico` de
  mais de 60 dias vira uma linha por mês.
- **contato:** `## O que já mandei` **não se condensa por idade**. Ele é o que
  impede a retomada de repetir a pergunta, e uma mensagem de três meses atrás
  continua sendo uma mensagem que a pessoa leu.
- **`trajetoria.md`:** não se corta experiência para caber. O que se corta é a
  prosa — cada experiência cabe em oito linhas —, e o que não couber em oito
  linhas vai para um arquivo em `_bruto/` que a linha aponta.
- **currículo:** passou de duas páginas, sai a experiência mais antiga que a
  vaga não pede — nunca a fonte menor. Quem lê currículo de três páginas não
  leu a terceira.
- **vagas por julgar:** a busca para de trazer (seção 4.1). Não é defeito: é a
  vez de julgar.
- **INDICE.md:** a lista detalhada não mora aqui — mora nos `_indice.md`. Corte
  o que for cópia deles.
- **`_indice.md`:** duas linhas para a mesma vaga é sinal de id duplicado.
  Pare, mostre as duas e pergunte qual fica.

Teto não é sugestão: ele é a regra 1 medida. Arquivo de vaga com 300 linhas de
anúncio colado faz toda skill reler 300 linhas para achar o regime, em toda
execução.

---

## 10 · Como uma skill começa e termina

### Começa

1. lê `~/busca/INDICE.md`. Não existe: uma linha e `/vagas:comecar`
2. lê a linha `modo:`
   — e, se a ferramenta `painel_inicio` existe nesta sessão, chama-a UMA vez,
   com o caminho da linha `busca:`. É o que põe a página inicial de pé;
   o endereço se diz uma vez por dia, e onde a ferramenta não existe nada
   disto se menciona. **Se ela devolver `fila`, grave-a ANTES de qualquer
   outra coisa** — são decisões que o candidato marcou no painel sem você
   estar perguntando (`references/painel.md`, "A fila de decisões")
3. desce a ordem de busca da seção 8 até ter o que precisa
4. tarefa de **três ou mais passos demorados**: mostra o TODO na tela.
   Demorado é passo que abre link, lê muitos arquivos ou escreve mais de um
   arquivo. Três edições de uma linha não são um TODO — são uma frase.

### Termina

Nesta ordem. **O `## Guardei` é obrigatório e não some nunca**; as outras duas
só aparecem se tiverem conteúdo.

Não gravou nada — porque não havia o que gravar, porque não há busca, ou
porque o que ela ia fazer não deu certo? Então o `## Guardei` traz uma linha
dizendo isso, com o motivo:

```markdown
## Guardei
- nada foi gravado — não havia o que guardar nesta rodada
```

Omitir a seção é o que faz o candidato achar que ficou guardado, e a regra
aqui é a mesma do "escreveu, diz onde", virada do avesso: **ele precisa saber
que NÃO ficou.** E o título é este, sempre — `## Não gravei nada` e
`## Nada foi guardado` são títulos inventados, e título inventado é o que a
seção 4 proíbe. Medido: duas skills inventaram o próprio na primeira
execução da prova, as duas por terem feito a coisa certa e nomeado errado.

**Seis skills não têm bloco para colar, e a razão é a mesma nas seis: o
trabalho delas não é um texto para o contato.**

```
/vagas:comecar              o trabalho é a configuração
/vagas:o-que-fazer-hoje     o trabalho é a lista do dia
/vagas:organizar-busca   o trabalho é o relatório do que mudou
/vagas:laudo-da-busca    o trabalho é o laudo, e ele não sai daqui
/vagas:importar-a-conversa  o trabalho é o relatório do que entrou
/vagas:gravar-o-que-marquei o trabalho é gravar o que já foi decidido
```

**Quatro delas acrescentam seção ao fecho, e a seção acrescentada É o
trabalho.** Na `comecar` o lugar do bloco é ocupado por `## O que ficou pronto`,
mais `## Ficou para depois` e `## O que pedir agora`. A `organizar-busca`
traz os títulos do que tocou. O `laudo-da-busca` traz um título por pergunta
da régua, e a `importar-a-conversa` um por destino do que leu — inclusive o do
que ela **não** leu, que é o mais importante dos dela.

**Fora essas quatro, nenhuma skill acrescenta seção ao fecho**, e nenhuma das
seis oferece a segunda saída da seção 7.1, porque não há mensagem para mandar.

A ordem dos três títulos fixos não muda em nenhuma delas: o que a skill
acrescenta vem ANTES do `## Guardei`, nunca entre ele e o `## Falta saber`.

```markdown
<o trabalho — o bloco para colar, sozinho, sem comentário dentro>

## Guardei
- ~/busca/vagas/V-019-trilho-logistica.md — criado
- ~/busca/vagas/_indice.md — uma linha nova
- ~/busca/_bruto/2026-09-11-whatsapp-helena.md — a conversa, como veio

## Falta saber
- o contrato da V-012 (PM de IA, Lumina Pagamentos) — o anúncio não diz se é PJ ou CLT
- quem conduz o processo da V-027 (Head de Produto, Aurora Saúde): a vaga não tem contato

## Decidi sozinho
- <só em modo automático · o que fiz — por que — como desfazer>
```

**O bloco vai em cerca de código, e NUNCA dentro de moldura desenhada.** Uma
caixa de `┌─┐` parece organizada na tela e é armadilha: o candidato seleciona,
copia e leva as bordas junto para dentro do WhatsApp do contato. A cerca de
código dá o botão de copiar e devolve só o texto. Vale para tudo o que existe
para sair daqui e ir para outro lugar — mensagem, currículo, roteiro, legenda,
título de evento. Nada de traço de enfeite antes ou depois, nada de `>` de
citação, nada de “copie o texto abaixo:” dentro do bloco.

Os três títulos são exatamente estes. **Escreveu na busca, diz onde**: o
candidato precisa saber onde a coisa foi parar para confiar que ela está lá.

`## Falta saber` é a regra 2 aparecendo: são os `?` que esta execução criou ou
não conseguiu resolver. É a lista que a próxima skill vai atacar.

### O que nenhuma skill faz

- inventar dado de vaga, de contato ou de valor — `?` sempre bate palpite
- apagar arquivo da busca, ou editar `_bruto/`
- criar campo, seção, etapa ou nome de arquivo fora deste contrato
- mandar mensagem **sozinha**: sem conector ela escreve e quem manda é o
  candidato; com conector ela manda uma por vez, e só depois de ele ver o texto
  e o nome de quem recebe (seção 7.1)
- falar em nome da Kapstan na mensagem que sai para o contato
- decidir pretensão, decidir se aceita proposta, ou dizer que um documento está em
  ordem — isso é do candidato, e a skill diz o que olhar
- prometer prazo de RH, do gestor ou de comitê de contratação

### A língua

Português do Brasil, do jeito que o candidato fala. Frase curta, imperativo
direto, zero hype. “Recrutador” fica, porque é a palavra que ele usa todo dia.
Aspas curvas “ ”, travessão —, e nada de emoji no que a skill diz.

Quando a skill não conseguir fazer algo, ela diz em uma linha o que não deu e
qual é o caminho — não pede desculpa duas vezes e não some do assunto.

---

## 11 · Onde esta skill roda

O `SKILL.md` é padrão aberto, e este pack roda em mais de uma ferramenta. O que
muda de uma para outra não é o contrato: é o que existe embaixo dele.

```
Claude Code · Codex CLI · Cursor
  tudo funciona no transporte `local`, que é o único em que a busca se
  MANTÉM. Ver o aviso da seção 1: no `drive` a busca se cria e não se
  atualiza

chat do Claude e chat do ChatGPT na web
  não há pasta no computador: funcionam as QUATRO skills que trabalham com o
  que for COLADO na conversa, e as outras não — o trabalho delas é a busca

os conectores (opcional) — onde há linha de comando e `node`
  é o que dá ALCANCE a este pack. `conectores_estado` diz o que existe e o
  que está ligado; quem liga é você, num terminal seu, e cada um avisa o
  que custa no ato de ligar

    fontes de vaga    gupy, solides, greenhouse, lever, ashby,
                      linkedin-vagas. São listagens PÚBLICAS, lidas sem
                      entrar na sua conta de lugar nenhum — é por isso que
                      buscar não arrisca nada
    link colado       `ler-vaga` lê a vaga de UM link que você colou.
                      Catho, InfoJobs e Indeed proíbem leitura automática
                      nos termos: para eles, cole o texto do anúncio
    navegador         o seu navegador, com os seus logins — ou uma janela
                      só dele, em que você entra uma vez. É o único que age
                      DENTRO de uma conta sua: busca no LinkedIn logado, o
                      que só existe lá, e preenche a candidatura. Quem
                      aperta ENVIAR é a linha `envio de candidatura:` do
                      INDICE.md, e o padrão é você (seção 12.1)
    e-mail pessoal    o que sai daqui sai no SEU nome: toda mensagem passa
                      pela tela do envio (seção 7.1)
    e-mail do agente  uma caixa que é dele, para alerta de vaga e cadastro
                      de aviso — nada que fale em seu nome sai por ela
    WhatsApp          o canal DEPOIS que o recrutador responde. Quem nunca
                      trocou mensagem com você recebe por link (seção 7.1)
    serviços pagos    só com teto escrito por você, e orçamento antes de
                      cada chamada. Sem teto, não gasta

o painel (opcional)
  uma janela no navegador, servida pela sua própria máquina. É onde se
  julga uma pilha de vagas de uma vez, e onde se confere, campo a campo, o
  que vai ser respondido num formulário. Ele NÃO grava nada: devolve o que
  você marcou, e quem escreve na busca continua sendo a skill. Sem ele,
  tudo funciona igual, em texto
```

Sem conector nenhum, a busca é você colando o anúncio — e funciona: o anúncio
colado vira vaga com procedência `← ficha colada`, e o resto do pack não sabe
a diferença.

Sem busca nenhuma, quatro entregam o trabalho e não gravam nada:

| skill | o que ela ainda faz com o que for colado |
|---|---|
| `perfil-de-busca` | as respostas viram o `perfil.md` na tela — e ele fica com você para colar num arquivo |
| `triar-vagas` | o anúncio colado é julgado contra o perfil colado, com o que vale e o que pesa contra |
| `escrever-ao-contato` | a vaga e a trajetória coladas viram a mensagem; some a conferência do `não contatar:` e do que já foi mandado — e ela DIZ isso, em uma linha |
| `montar-curriculo` | a trajetória colada vira o currículo para a vaga colada; some a conferência contra a `trajetoria.md`, que é a parte que impede o currículo de dizer o que você não fez |

E as outras não funcionam, porque o trabalho delas **é** a busca:

| skill | do que ela depende |
|---|---|
| `comecar` | monta a busca — sem transporte, não há onde montar |
| `buscar-vagas` | confere contra o que já entrou, e grava o que achou |
| `candidatar` | lê a vaga, o currículo e a trajetória, e registra o que saiu |
| `o-que-fazer-hoje` | lê a busca inteira para ordenar o dia |
| `retomar-contato` | conta os dias de silêncio e lê o que já foi mandado |
| `organizar-busca` | é a manutenção da busca |
| `laudo-da-busca` | mede a busca contra o contrato |
| `importar-a-conversa` | grava em `_bruto/` e distribui o fato |
| `cobrar-o-que-falta` | lê o que foi prometido e não chegou |
| `completar-ficha` | procura o que falta num arquivo de vaga, e grava com a origem |
| `gravar-o-que-marquei` | grava na busca o que você marcou no painel |

**Quem trabalha sem gravar diz isso.** O `## Guardei` do fecho (seção 10) vira
uma linha só: `- nada foi gravado — você está sem busca aqui`. Trabalho que o
candidato acha que ficou guardado e não ficou é pior que trabalho não feito.

---

## 12 · A trajetória, e o currículo que sai dela

### `trajetoria.md` — o que você fez, e o que se pode dizer

Um arquivo, na raiz da busca. Teto: **200 linhas**. É o **dono** de tudo o que
qualquer currículo, carta ou resposta de formulário afirma sobre você. Escrito
por `/vagas:perfil-de-busca`, a partir do que você conta e do que colar —
currículo antigo, perfil exportado, texto solto —, que fica em `_bruto/`.

```markdown
# Trajetória de Rafael Duarte — atualizada em 2026-09-14

## Em uma frase
gerente de produto sênior, oito anos entre fintech e logística, com produto de IA em produção

## Experiências — da mais nova para a mais antiga

### Âncora Pagamentos · gerente de produto · 2022-03 a 2026-06
- liderou o produto de antecipação para lojista, com um time de nove  ← candidato, 2026-09-14
- a base ativa foi de 4 mil para 31 mil lojistas em dois anos  ← _bruto/2026-09-14-curriculo-antigo.md
- pôs em produção o primeiro fluxo de atendimento com IA da empresa  ← candidato, 2026-09-14
número que NÃO tenho: quanto a IA reduziu o custo de atendimento — não medimos

### Rota Sul Logística · analista e depois gerente de produto · 2018-01 a 2022-02
- redesenhou o rastreio de carga, do pedido à entrega  ← _bruto/2026-09-14-curriculo-antigo.md
número que NÃO tenho: o efeito no prazo de entrega — saí antes da medição

## Formação
- Administração, UFSC, 2013 a 2017 — concluída
- MBA em Dados, 2023 — cursado, **não concluído**

## Ferramentas e métodos
SQL, Python para análise, Amplitude, Figma, métodos ágeis, descoberta contínua

## Idiomas
inglês: intermediário — leio bem, converso com esforço
espanhol: básico

## O que NÃO se diz
- o MBA nunca aparece como concluído
- a Rota Sul foi contrato por uma consultoria, não vínculo direto
- não há número de conversão nem de custo de aquisição confirmado: não se inventa métrica
```

**Todo número leva procedência, e o que não tem número diz que não tem.**
`número que NÃO tenho:` é a linha mais útil de uma experiência: é o que impede
o currículo de amanhã de preencher o buraco com um número redondo.

**`## O que NÃO se diz` é lida antes de escrever qualquer coisa em seu nome** —
currículo, carta, resposta de formulário, mensagem. É a lista do que parece
verdade, fica bem no papel, e é o tipo de coisa que uma checagem de referência
desmonta.

**O que você conta de si numa tela não morre na tela.** Quem escreve a
trajetória é `/vagas:perfil-de-busca`, e só ela. Mas toda skill que te
pergunta — ou que recebe de volta um texto que você reescreveu, um recado, uma
resposta de formulário que a trajetória não tinha — grava o que você disse
sobre si em `_bruto/AAAA-MM-DD-painel-<assunto>.md` NO MESMO TURNO, como você
escreveu, com `estado: ainda NÃO entrou na trajetoria.md`. E o fecho diz, em
`## Falta saber`, que há fato esperando e qual comando o leva. Uma resposta de
múltipla escolha também é fato: vai o rótulo das opções marcadas e das não
marcadas. `/vagas:perfil-de-busca` começa por esses arquivos.

### O currículo — `curriculos/`

```
curriculos/CV-base.md          o currículo sem vaga em vista
curriculos/V-012-cv.md         o currículo PARA a V-012 (PM de IA, Lumina Pagamentos)
```

Vista **derivada** da `trajetoria.md`, escrita por `/vagas:montar-curriculo`.
Teto: **duas páginas**. Três regras, e a régua da prova cobra as três:

```
1  nada entra que não esteja na trajetoria.md. Adaptar é ESCOLHER e ORDENAR
   o que é verdade, e dizer com as palavras da vaga — nunca acrescentar
2  número, cargo, data e nome próprio saem IGUAIS aos da trajetória. É aqui
   que o arredondamento vira mentira: 31 mil não vira “mais de 30 mil”
   num lugar e “quase 35 mil” no outro
3  o que a vaga pede e você não tem NÃO aparece disfarçado. Aparece na
   conversa com você, em `## Falta saber`: “a vaga pede inglês avançado e a
   trajetória diz intermediário — o currículo diz intermediário”
```

Divergiu o currículo e a trajetória? **A trajetória vence**, e o currículo se
reescreve (seção 1). Corrigiu um fato no currículo à mão? Ele some na próxima
geração — a correção é na trajetória, e chega a todos os currículos de uma vez.

O currículo sai em markdown, que é o que se confere, e o PDF sai dele pelo
modelo `curriculo` do pack (D270) — nunca se corrige o PDF. `.docx` não.

### A carta — `cartas/`

```
cartas/V-012-carta.md          a carta PARA a V-012, com o PDF de uma página ao lado
```

**Sob medida ou nenhuma** (D273). A carta só se escreve quando o formulário da
vaga tem o campo — obrigatório ou opcional — E há pelo menos uma prova da
trajetória que responde a um requisito ESCRITO no anúncio. Carta que serviria
a outra empresa é a genérica, e a genérica não se escreve: rende um terço da
sob medida, e é a que parece feita por máquina. As três regras do currículo
valem inteiras aqui.

Três parágrafos, corpo de 900 a 1.500 caracteres — meia página, que é o que
quem contrata prefere ler (D275):

```
1  a vaga, com o nome que o anúncio usa, e a tese numa frase: por que esta
2  um fato da organização — lido no anúncio, na página dela, numa notícia com
   fonte — que não serviria a outra, e o que se faria com ele
3  UMA prova com número, presa a um requisito do anúncio que a carta cita;
   o convite para conversar. O link não se repete: o cabeçalho já o traz
```

**O convite é para conversar, e não para conferir o projeto.** Diante de uma
organização que faz em escala o que ele fez em pequeno, oferecer o próprio
projeto como vitrine lê como prepotência: o convite fala do que ele aprendeu e
do que interessa a ela. O jargão do anúncio em inglês vai em português quando
existe o termo ("Brilliant Basics" → "o básico bem feito").

**A carta não reconta o currículo.** O nome do projeto entra; a lista técnica
dele — ferramentas, testes, contagens — fica no currículo, que vai junto.
Detalhe que já está lá só entra se a carta disser o que ele significa para
ESTA vaga.

Primeira pessoa, direto, no idioma da vaga. "Prezada equipe de <área> da
<organização>," e "Atenciosamente,". Nunca: adjetivo sobre si ("apaixonado",
"proativo"), "venho por meio desta", repetir o currículo em prosa, elogio à
empresa que não saia de um fato, pretensão salarial (salvo o anúncio pedir, e
aí com a frase do perfil).

O arquivo é a versão final, sem comentário no corpo. A primeira linha — e só
ela — é um comentário que diz a origem e o estado —
`<!-- rascunho · derivado de trajetoria.md, atualizada em AAAA-MM-DD, e de
vagas/V-012-… · para V-012 -->`. **`rascunho` até você ler e dizer que vale**, e
aí `aprovada em AAAA-MM-DD`: a candidatura só leva carta aprovada. Campo de
texto no formulário, em vez de arquivo: a mesma carta, em até 1.400 caracteres,
na hora de candidatar.

### 12.1 · A candidatura, e quem aperta o botão

Candidatar-se é responder perguntas **em seu nome**, numa conta que é sua, num
lugar de onde não dá para voltar atrás. `/vagas:candidatar` prepara tudo — e
**quem decide é você, sempre.** O que muda entre uma busca e outra é só uma
coisa: se o dedo que aperta é o seu ou o da skill, depois do seu sim.

```
1  lê a vaga, o perfil, a trajetória e `## O que NÃO se diz`
2  escolhe o currículo — o da vaga, ou manda montar antes
3  junta o que o formulário pergunta, e responde o que a trajetória
   responde. O que ela não responde fica `?` — é o campo que só você sabe
4  MOSTRA tudo junto: a vaga, as respostas campo a campo, o texto livre.
   No painel é uma tela só; sem ele, é o mesmo em texto
5  com o navegador ligado, preenche o formulário na sua frente
6  quem aperta ENVIAR é a linha `envio de candidatura:` do `INDICE.md`
```

**A linha mora em `## Como eu trabalho`**, e tem dois valores:

```
envio de candidatura: eu aperto
    o padrão. A skill para com o botão de enviar na tela, e diz o que
    falta. Você envia. E só quando você DISSER que enviou, a vaga vira
    `candidatada` e `## Candidatura` ganha a linha

envio de candidatura: aperta depois de eu aprovar no painel
    o sim daquela candidatura — dado na tela que mostra a vaga, as
    respostas campo a campo e o texto livre — É a decisão. Só então a
    skill aperta “Enviar candidatura”, CONFERE na página que o envio foi
    confirmado, e registra
```

**Sem painel na sessão, a skill para antes do botão**, como no primeiro regime:
mostra a tela inteira em texto, na mesma ordem, e quem aperta é você. O envio
por você só existe com a aprovação dada na tela do painel — é o que a promessa
pública do pack diz, e um “sim” no terminal não a substitui.

**A página não confirmou o envio?** Não se registra nada. A skill diz o que
viu, e a caixa vai para `## Parado` no `hoje.md`. “Apertei” não é “saiu” — só
a confirmação do portal é, e é ela que a linha de `## Candidatura` afirma.

#### O que não muda em regime nenhum

```
uma candidatura por vez        uma vaga por execução. “Aplica nas dez que
                               valem” são dez execuções, com dez telas
a tela inteira antes           a vaga, as respostas campo a campo, o texto
                               livre. É a leitura que o §3.1 exige antes de
                               algo sair em seu nome
nada em lote                   o sim é DAQUELA candidatura. Aprovar várias
                               de uma vez não existe, e não é esquecimento:
                               é o que impede a tela de virar carimbo
o teto por dia                 `quantas candidaturas por dia:`, da seção 4.1
o `?` continua seu             pergunta que só você sabe nunca é respondida
                               por aproximação, em regime nenhum
dado sensível é seu            CPF, endereço, nascimento: na hora, por você.
                               A skill não pergunta o valor e não o guarda.
                               Gênero, raça, pronomes: só o que você declarou
                               no `## Quem sou` (§3.1)
```

**`modo: automatico` NÃO liga isto.** São duas linhas diferentes e duas
perguntas diferentes: o **modo** decide quanto a skill pergunta no caminho; o
**envio de candidatura** decide quem aperta. Um `automatico` com `eu aperto`
prepara sozinho e para com o botão na tela; um `copiloto` com
`aperta depois de eu aprovar no painel` pergunta no caminho e aperta depois do
sim.

#### Por que o padrão é `eu aperto`, e por que existe o outro

Os termos de quase toda rede e de quase todo portal proíbem automação agindo
dentro de uma conta logada, e o que se arrisca é a conta — que, para quem
procura emprego, é o ativo. Programa que preenche devagar, com você olhando, e
não aperta nada é indistinguível de você usando um preenchedor de formulário.
Programa que se candidata a quarenta vagas numa hora não é.

O segundo regime não apaga esse risco: ele o põe no seu nome, que é onde ele
sempre esteve. Uma por vez, com a tela inteira lida antes e o teto do dia
valendo, é a mesma cadência de uma pessoa — o que muda é quem executa o último
clique de uma decisão que já foi tomada. **Informar em vez de impedir**: o
aviso aparece **uma vez**, no ato de trocar a linha, e depois a ferramenta
obedece sem sermão.

**Quem troca a linha é você** — editando o `INDICE.md`, ou pedindo à skill,
que mostra o aviso e pede a confirmação antes de escrever. A skill não a troca
por conta própria, não a troca “só desta vez”, e não a troca para destravar
uma execução.

#### O que se guarda, e o que “ficou pronto” quer dizer

**“Ficou pronto” não é “foi”.** A linha de `## Candidatura` registra o que
SAIU. Formulário preenchido e não enviado não muda etapa; vira uma caixa em
`## Parado`, no `hoje.md`, com o que falta. Vale igual nos dois regimes — no
segundo, o que fica travado é a candidatura que a página não confirmou.

E a linha diz quem apertou, porque é isso que ela afirma:

```
eu aperto      …  ← candidato, 2026-09-14
               e o `_bruto/` abre com `enviada: 2026-09-14 — dito pelo
               candidato`
aperta depois  …  ← skill, 2026-09-14
do sim         e o `_bruto/` abre com `enviada: 2026-09-14 — enviada pela
               skill, depois do sim de 2026-09-14 14:32`
```

**Pergunta de formulário que pede fato que a trajetória não tem** — “anos de
experiência com X”, “pretensão”, “nível de inglês” — não se responde por
aproximação. Pretensão vem do `perfil.md` e passa pela sua leitura; nível de
idioma sai IGUAL ao da trajetória; o que não está em lugar nenhum vai para
você como `?`.

**O que se guarda da candidatura**, em `_bruto/AAAA-MM-DD-candidatura-V-012.md`:
as perguntas e as respostas como foram enviadas, o currículo usado, por onde
saiu. É o que você relê na véspera da entrevista — e é o que impede a resposta
de amanhã de contradizer a de hoje.

---
