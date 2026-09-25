---
name: triar-vagas
description: >-
  Lê cada vaga `nova` contra o `perfil.md` e a `trajetoria.md` e escreve, no
  arquivo dela, o que a vaga pede, o que pesa a favor e o que pesa contra — cada
  linha apontando para o perfil, para a trajetória ou para o anúncio — e propõe
  o `encaixe:`. Mostra a pilha de uma vez para o candidato decidir: o que ele
  marcar `salvar` sobe de etapa, o que marcar `descartar` é aposentado com o
  motivo, e o que ele não marcar NÃO foi julgado. Nunca aposenta sozinha, nem
  no automático. Com um id, lê só aquela vaga, grava e não abre a pilha. Use
  quando o candidato disser "quais dessas valem", "tria as vagas", "julga a
  pilha", "essa vaga serve para mim?", "vale a pena me candidatar?", "o que
  você acha dessa aqui", "limpa as novas", ou colar um anúncio perguntando
  se vale. Não é ela que busca (/vagas:buscar-vagas), nem
  que escreve currículo (/vagas:montar-curriculo), nem que candidata
  (/vagas:candidatar), nem que muda o perfil (/vagas:perfil-de-busca).
license: MIT
compatibility: >-
  Precisa da busca montada, do `perfil.md` e de vagas em `nova`. Sem
  `trajetoria.md` ela tria só contra o perfil, e diz isso em uma linha. Sem
  busca nenhuma, julga na tela o anúncio colado contra o perfil colado e não
  grava nada. O painel é opcional: com ele a pilha vira uma tela só, com uma
  decisão por vaga; sem ele, a mesma pilha sai em texto, de cinco em cinco.
  Anúncio cortado pela fonte pede o conector ou ferramenta de web para ler o
  resto. O salário relatado pede o navegador.
allowed-tools: Read Glob Grep Write Edit WebFetch
---

# Triar as vagas

## 1 · O que ela faz, e o que ela não faz

Ela **lê o anúncio inteiro para o candidato não ter de ler trinta**, e escreve
o que leu de um jeito que se confere: três seções curtas no arquivo da vaga, em
que cada linha diz de onde veio. E então mostra a pilha, e **ele decide**.

**`encaixe:` é julgamento, e é a única linha do cabeçalho que não é fato.** Por
isso a palavra nunca anda sozinha: `alto` sem `## O que pesa a favor` é nota de
aplicativo, e ninguém confia numa. O que ela entrega não é a nota — é a razão,
escrita de modo que ele possa discordar em dez segundos.

**Ela nunca aposenta sozinha.** Dizer não a uma vaga é decisão dele, nos dois
modos: vaga aposentada por engano é vaga que ele não vê mais, e o erro só
aparece quando um colega conta que entrou lá. Dizer sim errado custa uma
releitura; dizer não errado custa a vaga.

**Ela não completa anúncio de cabeça.** O que a vaga não diz é `?` — contrato,
jornada, faixa, regime —, com o que resolve ao lado. "Deve ser CLT, pelo porte"
e "deve ser 44 horas" não existem.

## 2 · Antes de tudo

1. lê `~/busca/INDICE.md` — `references/contrato/10-0-comeca-e-termina.md` diz
   como começar. Não existe: passo 1b, e nada se grava
2. lê a linha `modo:`
3. **lê `~/busca/perfil.md` inteiro.** Não existe: pare, uma linha, e
   `/vagas:perfil-de-busca` — sem régua não há o que medir
4. **lê `~/busca/trajetoria.md`**, e nela o `## O que NÃO se diz`. Não existe:
   siga, triando só contra o perfil, e diga em uma linha que `## O que pesa a favor`
   vai sair mais fraco — metade dele é "isso eu já fiz"
5. lê o `funil.md`, seção `## nova`, e abre o arquivo de cada vaga dali. É a
   pilha. Vazia: uma linha, e `/vagas:buscar-vagas`

O formato da vaga está em `references/contrato/04-4-arquivo-de-vaga.md`; as
etapas, em `references/contrato/04-3-funil.md`; o perfil, em
`references/contrato/04-9-o-perfil.md`; a trajetória, em
`references/contrato/12-0-a-trajetoria-e-o-curriculo.md`; as três regras — e
os quatro passos de aposentar —, em
`references/contrato/03-0-as-tres-regras.md`; a linha do índice e do arquivo
morto, em `references/contrato/04-6-os-dois-indices.md`; os tetos, em
`references/contrato/09-0-os-tetos.md`; o que é seu e o que nunca entra, em
`references/contrato/03-1-o-que-e-seu.md`. O painel está em
`references/painel.md`, e os conectores em `references/conectores.md`.

## 3 · O modo

`copiloto` — o padrão. Ela lê, escreve as três seções, propõe o encaixe, e
**para na pilha**: quem sobe e quem sai é ele.

`automatico` — escolhe e declara (contrato §5), com dois limites que não se
negociam:

```
vira `salva` sozinha   SÓ a vaga de encaixe alto E sem nada em
                           `## O que pesa contra` que seja eliminatório ou `?`
                           em campo que o `## Descarto` olha. Cada uma vai
                           para `## Decidi sozinho`, com como desfazer

NUNCA aposenta sozinha     encaixe baixo fica em `nova`, com as três seções
                           escritas, esperando ele. A regra 3 só deixa o
                           automático aposentar por prazo de silêncio, e
                           "não vale" não é prazo: é decisão dele
```

Ela diz isso em uma linha, sem pedir desculpa: "deixei 6 em `nova` com a
leitura pronta — dizer não é seu."

## 4 · O passo a passo

### Passo 1 · A pilha, e a ordem dela

As vagas de `## nova`, **na ordem dos cargos do `## O que procuro`** — o
primeiro cargo da lista primeiro — e, dentro do mesmo cargo, a publicada há
mais tempo primeiro: é a que fecha antes.

Mais de quinze na pilha? Trie as quinze primeiras e diga quantas ficaram.
Leitura de trinta anúncios numa execução é leitura que piora do vigésimo em
diante, e ele não vai decidir trinta de uma vez.

**1a · Uma vaga só, pelo id.** Chegou um id como argumento
(`/vagas:triar-vagas V-019` — é o botão "Analisar esta vaga" do painel)? A
pilha é ela: passos 2 a 4 sobre essa vaga, e grave as três seções e o
`encaixe:` proposto. **Não abra tela e não mude a etapa** — quem decide é ele,
e o painel já está com a vaga na frente. O `## Guardei` diz o que a leitura
achou em uma linha, começando pelo regime.

**1b · O anúncio colado, sem busca.** Ele colou uma vaga — e o perfil, ou os
critérios de cabeça — e perguntou se vale? Faça os passos 2 a 4 **na tela**, e
não grave nada: o `## Guardei` diz `- nada foi gravado — você está sem busca
aqui`. Há busca e a vaga não está nela? Quem a guarda é `/vagas:buscar-vagas`;
diga isso em uma linha e julgue na tela do mesmo jeito.

### Passo 2 · Ler o anúncio, inteiro

O arquivo que `/vagas:buscar-vagas` criou tem o cabeçalho e o link. **O anúncio
inteiro quase nunca está na busca**: o `_bruto/` da busca guarda uma linha por
resultado, e o que a fonte mandou de descrição veio cortado. Antes de julgar:

```
ele colou o anúncio                 está inteiro em `_bruto/`. Leia de lá
ele colou só o LINK                 `ler-vaga` · `ler`, com a URL como ele
                                    colou — veja abaixo
veio de conector                    peça `detalhe`, se o conector tiver a
                                    operação; senão `ler-vaga` com o link;
                                    senão a ferramenta de web
não deu para ler o resto            julgue o que há, e TODO campo que dependia
                                    do fim do anúncio fica `?` — a exigência de
                                    idioma e o processo seletivo moram lá
```

**O link se lê pelo `ler-vaga`, e só o link que ELE colou** — nunca um que
você achou. Ele devolve os campos com `procedencia` (`<site>, <data>`), que é
o `← ` de cada fato. `recusado · os termos…` quer dizer que o site proíbe
leitura automática (Catho, InfoJobs, Indeed, Trampos): diga isso em uma
linha e peça o texto do anúncio — sem abrir por web nem por navegador, que o
termo vale igual. `encaminhado` aponta o conector que lê aquele site; `não
traz o bloco`, peça o texto. Sem conectores, a ferramenta de web abre o
link, menos o desses quatro sites. Colado como texto, segue como sempre.

**O anúncio que ela abriu vai para `_bruto/` antes de virar linha** —
`AAAA-MM-DD-anuncio-<empresa>.md`, com o cabeçalho de três linhas
(`references/contrato/04-7-o-bruto.md`) e o texto como veio. Anúncio sai do ar,
e é ele que o candidato relê na véspera da entrevista. O fato tirado dali leva
`← _bruto/<arquivo>`; o que já tinha vindo do conector continua com
`← <conector>, <data>`. E se a leitura mostrar que a vaga **saiu do ar**,
`estado: fechou`, ela não é julgada, e vai para o `## Falta saber` como caso de
`/vagas:organizar-busca`.

### Passo 2b · O salário relatado

Toda vaga lida ganha o `salário relatado:` — o que funcionários da empresa
contaram ao Glassdoor para o cargo mais perto do dela —, pelo caminho da seção
4.4 (`references/contrato/04-4-arquivo-de-vaga.md`): o `_bruto/` de até 30
dias primeiro, depois o navegador, a página da empresa e a do cargo. **Uma
leitura por empresa por rodada**: duas vagas da Rota Delivery usam a mesma
página.
Vaga sem a linha no cabeçalho ganha a linha, abaixo de `faixa:`.

Ele é fato com fonte, e entra no Passo 3 como qualquer outro: abaixo do piso
que o `## Quanto` dá ao contrato da vaga, é linha de `## O que pesa contra`,
sem o número do piso. Contrato da vaga `?`: compare com o piso mais baixo que
ele aceita, e diga isso na linha. Não
corta e não muda o encaixe sozinho. E **nunca preenche `faixa:`** — o que a
vaga não publica continua `?`.

Sem navegador, ou sem página da empresa, ele fica `?  ← <razão>, <hoje>` e a
triagem segue: salário não trava a leitura do
anúncio. Uma linha no `## Falta saber` diz quantas ficaram sem ele.

### Passo 3 · As três seções, e de onde sai cada linha

**`## O que a vaga pede`** — de três a seis linhas, e só o que **decide**: o que
elimina, o que pesa, como é o processo. Cada uma com `← <fonte>, <data>`. O
anúncio inteiro não entra (teto de 60 linhas; seção 9): "somos uma empresa
inovadora" não é o que a vaga pede.

```
- cinco anos em produto, com entrega de produto de IA em produção  ← greenhouse, 2026-09-07
- inglês intermediário, leitura técnica  ← greenhouse, 2026-09-07
- processo: conversa, estudo de caso em casa, painel  ← greenhouse, 2026-09-07
```

**`## O que pesa a favor`** — cada linha liga uma coisa que a vaga pede a uma coisa
que está **escrita** no perfil ou na trajetória, e aponta o arquivo:

```
- é o primeiro cargo da lista, e o regime é o que eu aceito  ← perfil.md
- pagamentos é onde está o número mais forte: 4 mil para 31 mil lojistas  ← trajetoria.md
```

Número e nome próprio saem **iguais** aos da trajetória. E o que está em
`## O que NÃO se diz` não sustenta linha nenhuma daqui: "tem MBA em dados" não é
razão se o MBA não foi concluído.

**`## O que pesa contra`** — a seção que faz o resto valer. Três famílias:

```
o que a vaga pede e a        "pede experiência com meios de pagamento
trajetória não tem           internacionais, e a trajetória não tem"
                             ← trajetoria.md

o que o perfil quer          "não diz contrato nem faixa: pode estar abaixo
evitar, ou não sabe          do piso" · "o processo tem etapa ao vivo, e o
                             anúncio não diz se é código"  ← perfil.md

o que o anúncio cala         regime, contrato, jornada, faixa, idioma em `?`. Campo
                             calado que o `## Descarto` olha é o peso maior:
                             a vaga pode ser eliminada na primeira conversa
```

**O regime é a primeira coisa, e não sobe calado (D240).** É o campo que decide
se a vaga cabe — presencial fora da cidade do candidato é descarte do
`## Descarto`, e o candidato perdeu uma tarde numa vaga que o arquivo dizia
`remoto` só porque o cabeçalho do site dizia. Três regras:

- `regime:` que veio do cabeçalho do site com a descrição cortada é **declarado
  pelo site**, não lido do anúncio. Antes de salvar, abra o link (com o
  conector do navegador, se houver) e confira no texto; sem como abrir, diga
  isso na `linha` e deixe a decisão com ele
- `regime: ?` **não vira `salva` sem resolver**: abra o anúncio ou pergunte —
  é a única pergunta que vale mais que a do motivo do não. Se continuar `?`,
  `## O que pesa contra` ganha a linha "não diz o regime — se for presencial
  fora de <cidade do perfil>, sai", e a vaga fica em `nova`
- a `linha` de cada item da tela e a nota da linha do `funil.md` COMEÇAM pelo
  regime e o lugar: `remoto · encaixe alto, pede inglês` — é o que se lê
  primeiro, no cartão e na tela

**A pretensão não aparece por extenso.** A linha diz "pode estar abaixo do
piso", nunca o número — o arquivo da vaga é o que vai para tela compartilhada
na véspera da entrevista (seção 3.1).

Seção sem nada tem uma linha: `- nada que eu tenha achado.` Seção vazia parece
seção esquecida.

### Passo 4 · O encaixe proposto

`alto`, `médio` ou `baixo` — e a palavra sai das duas seções, não o contrário:

```
alto     está entre os cargos do perfil, passa em tudo o que o `## Aceito`
         pede, e `## O que pesa a favor` tem linha da trajetória. O que pesa contra
         é dúvida, não falta
médio    o cargo bate e falta alguma coisa que a vaga pede; ou tudo bate e há
         `?` em campo que o `## Descarto` olha
baixo    o cargo está fora da lista ou no fim dela, ou o que a vaga pede de
         central a trajetória não tem
```

**Enquanto ele não decide, o cabeçalho fica `?`, com a proposta ao lado:**

```
encaixe: ?  ← a triagem propõe alto; falta você julgar
```

Quando ele decide, a linha vira dele — `encaixe: alto  ← candidato, <hoje>` —,
porque julgamento escrito como fato apurado é o que a regra 2 proíbe. No
automático, a vaga que sobe sozinha leva `← triagem, <hoje>`, e é por essa
procedência que ele acha depois o que não foi ele que julgou.

**Grave as três seções e a linha do encaixe antes de mostrar a pilha.** Se ele
fechar a tela no meio, a leitura não se perde — a vaga continua em `nova`,
já lida.

### Passo 5 · Mostrar a pilha, e receber as decisões

**Com painel**, é aqui que ele mais vale (`references/painel.md`): a vista
`lista`, com `decisoes`, agrupada pelo encaixe proposto —

```
decisoes    Salvar · chave `salvar` · gesto `etapa:salva`
            Descartar · chave `descartar` · tom `recusa` · gesto `descartar`
            Depois · chave `depois`
grupos      Encaixe alto · Encaixe médio · Encaixe baixo
item        id: o id da vaga · titulo: o id COM o apelido
            linha: a razão mais forte e o peso mais forte, numa frase só
            marca: o regime — ou `regime ?`, que a tela pinta de âmbar
rodapé      "Gravar o que marquei" (forte) · "Agora não" (recusa)
```

Volta `decisoes`, **só com o que ele marcou**. E a regra é literal: **vaga sem
marca não foi julgada.** Não é recusa, não é "depois", e não se grava como se
fosse — ela fica em `nova`, com a leitura pronta, para a próxima vez.
`expirou: true` é a mesma coisa para a pilha inteira: siga em texto, e diga em
uma linha que o painel não foi usado.

Uma vaga em que a razão não cabe numa linha — encaixe médio, dois pesos
sérios — pode ir sozinha, antes ou depois da pilha, em `blocos`: a `ficha` da
vaga e o `texto` com as duas seções. É exceção; a regra é a pilha.

**Sem painel**, a mesma pilha em texto, **de cinco em cinco**, e ele responde
numa linha — "1 e 3 valem, 2 não, o resto depois":

```
1  V-031 (PM Sênior, Cobre Energia) · remoto · proponho ALTO
   vale: segundo cargo da sua lista, e energia cruza com o que você fez na Rota Sul
   pesa: não diz o contrato; processo com "etapa técnica" sem dizer qual

2  V-033 (Product Owner, Norte Seguros) · híbrido em Florianópolis · proponho BAIXO
   vale: o regime é o que você aceita
   pesa: o cargo não está na sua lista, e pede certificação que a trajetória não tem
```

Número que ele não citou não foi julgado — a mesma regra do painel.

### Passo 6 · Gravar o que ele decidiu

**`salvar`** — no arquivo da vaga: `etapa: salva · desde <hoje>`,
`encaixe: <o proposto>  ← candidato, <hoje>`, e uma linha no `## Histórico`:
`- <hoje> salva  ← candidato, <hoje>`. Ele quis outro encaixe? Vale o
dele. No `funil.md`, a linha sai de `## nova` e entra em `## salva`, com o
regime na frente, a razão mais forte e `· próximo: adaptar o currículo`.

**`descartar`** — é aposentar, e são os quatro passos da regra 3, nesta ordem:

```
1  a linha no alto do arquivo: `aposentado: <hoje> · motivo: não vale: <motivo>`
2  o arquivo vai para `arquivo-morto/vagas/`
3  em `vagas/_indice.md`, a linha sai da tabela e entra em `## Arquivo morto`:
   `- V-033 (Product Owner, Norte Seguros) · <hoje> · não vale: <motivo>`
4  some do `funil.md` e do `hoje.md`
```

**O motivo é o que a busca aprende, e por isso ele é escrito com cuidado.** Uma
frase, que nomeie o critério: `não vale: exige presença em São Paulo`, e não
`não vale: não gostei`. Dez motivos iguais no arquivo morto são o que
`/vagas:perfil-de-busca` lê para propor um corte novo. O motivo sai do peso
mais forte que ela escreveu; se ele disse outro, vale o dele — e se ele não
disse e o peso não é óbvio, pergunte. É a pergunta que mais vale desta skill.

**`depois`** — a vaga fica em `nova`, e o `## Histórico` ganha
`- <hoje> vista, e deixada para depois  ← candidato, <hoje>`. É o que separa
"ele viu e adiou" de "ele não viu". Segunda vez que a mesma vaga recebe
`depois`: diga isso, em uma linha — vaga adiada duas vezes costuma ser um não
que ninguém escreveu.

**As vistas, por último:** `vagas/_indice.md` (a coluna `encaixe` e a data de
cada linha tocada, a contagem do título), `funil.md`, e o `## Quanto tem` do
`INDICE.md`, recontado. Confira o teto de cada arquivo de vaga ao gravar.

## 5 · O que perguntar, e como

Três perguntas por execução, no máximo (contrato §8) — **a pilha não conta**:
ela é o trabalho, não uma pergunta. As que valem:

- **qual o motivo do não?** — quando ele marcou `não vale` e o peso não é óbvio
- **esse `?` elimina?** — quando o anúncio cala um campo que o `## Descarto`
  olha, e ele talvez saiba a resposta de outro lugar ("a Cobre é remota, eu
  conheço gente lá" entra com `← candidato, <hoje>`)
- **trio as outras?** — quando a pilha passou de quinze

**Quando não perguntar:** o critério está no perfil, o fato está na trajetória,
ou a resposta não muda o encaixe. Aí deixe `?` e siga — `?` é barato, pergunta
é cara.

## 6 · O formato da saída

A pilha — no painel ou em texto —, o que mudou depois das decisões numa linha
por vaga, e o fecho do contrato §10. No automático, `## Decidi sozinho` vem ao
fim, com **o que fiz — por que — como desfazer**.

## Guardei
- ~/busca/_bruto/2026-09-14-anuncio-cobre-energia.md — o anúncio, como veio
- ~/busca/_bruto/2026-09-14-glassdoor-cobre-energia.md — o que a Cobre paga a PM, no Glassdoor
- ~/busca/vagas/V-031-cobre-energia.md — três seções escritas; `salva`, encaixe alto
- ~/busca/vagas/V-034-aurora-saude.md — três seções escritas; ficou em `nova`, sem marca
- ~/busca/arquivo-morto/vagas/V-033-norte-seguros.md — aposentada: não vale, o cargo está fora da lista
- ~/busca/vagas/_indice.md · ~/busca/funil.md · ~/busca/INDICE.md — linhas e contagens

## Falta saber
- o contrato e a faixa da V-031 (PM Sênior, Cobre Energia) — a vaga não diz; é a primeira pergunta da conversa
- a V-034 (Head de Produto, Aurora Saúde) ficou sem marca: a leitura está pronta, e ela volta na próxima triagem
- ficaram 7 vagas em `nova` que não li nesta rodada

## 7 · Onde ela para

**Ela não aposenta sem ele dizer não** — nem encaixe baixo, nem no automático,
nem "para limpar a pilha". E não marca por ele o que ficou sem marca.

**Ela não muda o perfil.** Se a triagem mostrar que um critério está errado —
ele disse `salva` a três vagas que o perfil punha no fim da lista —, ela diz isso
em uma linha, em `## Falta saber`, e manda para `/vagas:perfil-de-busca`.
Mudar a régua no meio de medir é como se perde a régua.

**Ela não escreve currículo, carta nem resposta de formulário.** `salva` abre o
caminho para `/vagas:montar-curriculo` e `/vagas:candidatar`; ela diz os dois
comandos no fim, e para.

**Ela não busca vaga nova**, e não guarda a que ele colou: isso é de
`/vagas:buscar-vagas`.

**Ela não escreve a ninguém e não cria contato.** Nome de recrutador que
apareça no anúncio fica onde está.

**Ela não afirma o que a vaga não diz**, não escreve a pretensão por extenso em
arquivo de vaga, e não usa como razão nada que esteja em `## O que NÃO se diz`.
