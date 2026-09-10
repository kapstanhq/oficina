---
name: comecar
description: >-
  A primeira skill do pack, e a que todas as outras nove pressupõem: monta a
  carteira do prospector do zero, em oito passos, no computador ou no Google
  Drive. Cria as pastas, copia os sete modelos, escreve quem ele é, grava o modo
  — copiloto ou automático — e conecta Google Agenda, Gmail e Drive explicando
  cada botão e TESTANDO antes de escrever “sim”. Ensina a trazer conversa do
  WhatsApp, que entra colada. Termina com a carteira cheia: uma conta de
  verdade, vindo de um link — ou a planilha inteira de contas, em CSV —, e um
  contato, vindo de uma conversa colada. Todo passo é pulável, e se ele fechar
  no meio ela volta de onde parou. Use na primeira vez, e quando ele disser
  “instalei, e agora”, “como eu começo”, “configura isso pra mim”, “não tenho
  carteira nenhuma”, “importa minha planilha”, “tenho tudo numa planilha”,
  “quero ligar minha agenda”, “parei no meio da configuração”, “pulei o Gmail e
  quero ligar agora”, “mudei de computador” — e sempre que outra skill disser
  que não achou o INDICE.md da carteira.
license: MIT
compatibility: >-
  Precisa de um lugar para montar a carteira, numa pasta do computador, com
  ferramenta de arquivo. Sem ela — chat na web — ela não funciona, e diz isso
  em uma linha: o trabalho dela é montar a carteira. Google Agenda e Gmail são
  opcionais; sem eles, os passos 3 e 4 ficam anotados como pulados.
allowed-tools: Read Glob Grep Write Edit
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/comecar/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# Começar

## 1 · O que ela faz, e o que ela não faz

Ela monta a carteira no lugar que ele escolher no passo 1 — uma pasta no
computador ou a pasta `carteira` no Google Drive — e a entrega **cheia**: as
sete peças do contrato criadas, o modo escolhido, o que dá para conectar
conectado e testado, e dentro dela uma conta e um contato de verdade — não
exemplos.

**Ela não pede argumento.** Rodar sem nada é o normal: ela pergunta o que
precisa, um passo por vez. Com a carteira já montada, ou com “continuar”, é
retomada — seção 4.

Ela **executa o que dá e só pede o que só ele pode fazer.** Criar pasta, copiar
modelo, ler link, extrair fato de uma conversa colada: é com ela. Autorizar o
Google no navegador, com a conta dele: é com ele — e nesse ponto ela explica os
passos com o nome de cada botão e **espera**.

Ela não escreve texto de abordagem, não escreve mensagem para contato nenhum, não lê
CNPJ, não instala nada e não mexe em configuração do Claude Code. E
**nenhum passo dela pede senha**: a autorização do Google acontece na tela do
Google, no navegador dele, e ela não vê nada disso.

**Por que ela tem `Write` e `Edit`.** É a skill que cria a carteira: sete
arquivos novos a partir de `references/modelos/` (`Write`), mais o arquivo do
da primeira conta, o do primeiro contato e o primeiro bruto (`Write`), e as vistas
que eles mexem — os dois `_indice.md`, o `funil.md`, o
`## Quanto tem` e o `## O que está conectado` do `INDICE.md` (`Edit`).
**`Write` só em arquivo que não existe.** Sobrescrever é o único jeito de esta
skill fazer estrago, e o estrago seria a carteira inteira. A UI de perguntas e o
TODO da tela são interface do harness e não entram nessa lista.

No `drive` os verbos são os mesmos e as ferramentas são as do conector, pela
tabela de equivalência do contrato §1. Uma diferença muda o que ela faz:
**atualizar reescreve o arquivo inteiro**, então leia o arquivo antes de
atualizar, sempre — e devolva o texto inteiro com a sua mudança dentro.

---

## 2 · Antes de tudo

Leia, nesta ordem:

1. **O contrato, por seção.** Ele é a lei do pack, e ler o documento inteiro
   custa vinte a trinta mil tokens antes da primeira pergunta. Leia, em
   `references/contrato/`, estas seções antes de escrever uma linha:
   `01-0-onde-a-carteira-mora.md` (os dois transportes, e quem é dono de qual
   fato), `02-0-id-e-apelido.md` (o id, o apelido e o nome do arquivo),
   `03-0-as-tres-regras.md` (procedência é a que mais aparece aqui),
   `04-0-os-formatos.md` e os sete que o seguem, de `04-1-indice.md` a
   `04-7-o-bruto.md` (os gabaritos, e o que fazer com os comentários dos
   modelos), `05-0-os-dois-modos.md` (os dois modos, e a exceção da
   CNPJ), `07-0-a-conversa-entra.md` (como ler uma conversa colada, e o
   que fazer com ela depois), `07-1-a-mensagem-sai.md` (a linha `envio:`, que
   só existe com conector), `08-0-quando-perguntar.md` (o tamanho da pergunta,
   e a UI de escolha com o custo escrito) e `10-0-comeca-e-termina.md` (como
   uma skill termina). Nada do que está lá se reescreve aqui: divergiu, o
   contrato vence.

2. **`references/modelos/`** — os sete arquivos que ela vai copiar. Leia antes
   de escrever o primeiro: o que vai para a carteira é o que está neles, sem
   invenção.

3. **O `INDICE.md` da carteira, se já existir.** Faça a primeira leitura do
   contrato §1: procure no computador, e depois a pasta `carteira` no Drive.
   **Achou? Ela não sobrescreve nada:** é retomada, e a seção 4 diz por onde
   continuar. Achou nos dois lugares, isso é bifurcação: mostre as duas, com o
   lugar de cada uma, e pergunte qual fica — **não funde as duas**.

**No `local`, a pasta pessoal.** O harness já diz o diretório de trabalho e o
sistema da sessão; dele sai o começo do caminho — `C:\Users\<nome>` no Windows,
`/Users/<nome>` no Mac, `/home/<nome>` no Linux. **Toda chamada de ferramenta
usa caminho absoluto.** Ao falar com o prospector, escreva `~/carteira/…`, que é
curto e ele entende. Não teve certeza do caminho? A pergunta do passo 1 já pede
— mostre o que você achou como sugestão e deixe ele corrigir.

**No `drive` não existe caminho.** Pasta é um item com id, arquivo é filho de
pasta, e `/carteira` é o nome da pasta na raiz do Drive dele. Guarde o id de
cada pasta que criar ou abrir, e **prenda toda busca à pasta** — `_indice.md`
existe duas vezes, e o nome solto devolve os dois. Ao falar com o prospector,
escreva “a pasta `carteira` do seu Drive”.

Como no contrato, **`~/carteira/…` neste arquivo é o modo curto de nomear o
lugar, qualquer que seja o transporte** — inclusive na lista do passo 1 e no
fecho da seção 7.

---

## 3 · O TODO, na tela desde o primeiro passo

Mostre o TODO **antes da primeira pergunta**, não depois. Ele faz duas coisas
que nenhuma frase faz: mostra que a configuração acaba, e mostra onde ela está
enquanto demora. Demorar sem mostrar é onde o leigo acha que travou.

```
1  onde fica a carteira, e quem é você
2  o modo: copiloto ou automático
3  a agenda
4  e-mail e Drive          opcionais
5  as conversas do WhatsApp
6  a primeira conta, ou a planilha inteira
7  o primeiro contato
8  o que pedir agora
```

**Grave ao fim de cada passo, não no fim de tudo.** O que está gravado na
carteira é o que sobrevive a ele fechar a janela — e é o que a retomada vai ler.
Passo que fica só na conversa é passo que se perde.

---

## 4 · Retomar: onde está escrito até onde foi

Nenhum campo novo guarda o progresso. **O progresso é derivável do que está
gravado** (contrato, regra 1), e um `passo: 4` no `INDICE.md` seria a única cópia
de uma coisa que os arquivos já dizem — e mentiria no dia em que ele mexesse na
carteira à mão.

| passo | está pronto quando, na carteira |
|---|---|
| 1 | o `INDICE.md` da carteira existe, com a linha `carteira:`, e o título tem o nome dele |
| 2 | a linha `modo:` vale `copiloto` ou `automatico` |
| 3 | `Google Agenda:` tem `sim  ← testado <data>`, **ou** há linha de agenda em `## Pulado no começo` |
| 4 | o mesmo para `Gmail:` e `Google Drive:` |
| 5 | há qualquer arquivo em `_bruto/`, **ou** há linha em `## Pulado no começo` |
| 6 | a tabela de `contas/_indice.md` tem ao menos uma linha |
| 7 | a tabela de `contatos/_indice.md` tem ao menos uma linha |
| 8 | não grava nada — sempre acontece |

Retomando, faça três coisas e nada mais: diga em uma linha o que já está pronto,
vá para o primeiro passo que falta, e **não refaça o que já está**. Perguntar de
novo o que ele já respondeu é o defeito mais caro do pack.

Ele pulou um passo e agora quer aquele passo? Rode só ele. `comecar` chamada com
a carteira já montada é isso: a lista do que falta, e o item que ele escolher.

---

## 5 · Como ela pergunta

O contrato põe teto de **três perguntas** numa execução. **Esta skill é a
exceção, e a exceção não é licença:** ela É o questionário, e o teto existe
contra a skill que interrompe um trabalho para perguntar. O que substitui o teto
aqui é mais estrito que ele:

- **uma pergunta por passo.** O passo fecha, grava, e só então vem a próxima.
  Oito campos numa tela é o formulário que o contrato proíbe, e ele não fica
  permitido por estar dividido em duas telas seguidas.
- **todo passo é pulável**, e o pulado vira linha em `## Pulado no começo` com a
  data. Nunca insista: quem pulou a agenda vai ouvir a oferta de novo em
  `/prospeccao:o-que-fazer-hoje`, na hora em que ela faz sentido.
- **escolha entre dois e quatro caminhos usa a UI de perguntas** do harness —
  botões, não prosa —, com rótulo de até quatro palavras e **o custo escrito em
  cada opção**. A descrição declara o custo; ela não vende a opção.
- **toda pergunta traz o motivo na mesma frase.** É o que ensina o ofício
  enquanto ela trabalha, e é o que faz ele responder em vez de fugir.

**O modo, aqui, não muda nada.** O que falta nesta skill só ele sabe: onde ficam
os arquivos dele, o nome dele, qual conta do Google, qual conta. Automático não
inventa nenhuma dessas. Se ele escolher automático no passo 2, diga em uma linha
que aquilo vale da **próxima** skill em diante, e siga perguntando.

**E uma coisa sobre a permissão, porque ela aparece MAIS nesta skill que em
qualquer outra.** O `allowed-tools` do topo não restringe nada: ele dispensa a
pergunta de permissão, e **só no turno em que a skill é chamada** — a dispensa
cai na primeira resposta dele. Como aqui são oito passos com uma pergunta em
cada, do segundo em diante até gravar arquivo volta a pedir autorização.

Isso não é defeito e não se conserta: diga uma vez, quando a primeira aparecer,
que é assim que o programa mostra o que está sendo feito, e que aprovar é rápido.
O que **não** se faz é pedir a ele que desligue as perguntas — a skill está
escrevendo na carteira dele, e ver isso acontecer na primeira vez é o que
constrói a confiança que as outras nove vão gastar.

---

## 6 · Os oito passos

### Passo 1 · Onde fica a carteira, e quem é você

**Primeiro, a pergunta do lugar.** É aqui que o transporte se escolhe, uma vez,
e o caminho que você achou já vai preenchido:

```
Onde eu monto a sua carteira?

  No computador       C:\Users\renata\carteira · você abre em qualquer editor,
                      e é onde as outras nove vão procurar sozinhas
  No Google Drive     a pasta carteira no seu Drive · funciona também no chat
                      do navegador, e precisa do conector do Drive ligado
  Outro lugar         você me diz onde · funciona, mas toda skill vai precisar
                      que você diga onde é
```

Já existe `INDICE.md` lá? **Pare e vá para a seção 4.** Não sobrescreva.

Não existe: crie, copiando **cinco** dos sete gabaritos da seção 4 do
contrato — os outros dois viram arquivo nos passos 6 e 7, um por item.

**Os comentários `<!-- MODELO · … -->` saem — todos.** E **o `<AAAA-MM-DD>` do
título de `hoje.md`, `funil.md` e dos dois `_indice.md` vira a data de hoje,
aqui, agora**: nenhum passo posterior os toca, e os passos que tocariam as
vistas são puláveis. Arquivo que chega ao prospector com o próprio manual dentro
parece arquivo pela metade — e com `<AAAA-MM-DD>` na primeira linha parece
formulário em branco.

```
modelos/INDICE.md            → ~/carteira/INDICE.md
modelos/hoje.md              → ~/carteira/hoje.md
modelos/funil.md             → ~/carteira/funil.md
modelos/_indice-contas.md   → ~/carteira/contas/_indice.md
modelos/_indice-contatos.md  → ~/carteira/contatos/_indice.md
```

**E a linha `envio:` do modelo sai junto com os comentários.** Ela governa
quanto a skill pergunta antes de mandar mensagem, e **só existe onde há
conector** (contrato §7.1). A carteira nasce com `WhatsApp: não`, então ela
ainda não tem o que governar — quem a escreve é o passo 5, se ele ligar a
ponte.

`modelos/conta.md` e `modelos/contato.md` **não se copiam agora**: eles viram
arquivo nos passos 6 e 7, um por item, com id e apelido no nome.

**A primeira linha do `INDICE.md` é a do transporte**, antes de `modo:`, no
formato do contrato §1 — `carteira: local · C:\Users\renata\carteira` ou
`carteira: drive · /carteira`. É ela que as outras nove leem para saber por onde
ler e gravar; sem ela, cada skill vai adivinhar pelo lugar em que o arquivo
apareceu.

**`_bruto/` e `arquivo-morto/` nascem vazias, e pasta vazia não se cria com
`Write`.** Elas aparecem quando o primeiro arquivo cai lá — `_bruto/` no passo
5 ou 6, e `arquivo-morto/` só quando algo for aposentado. **Diga isso em uma linha**, senão ele abre a
carteira, não as vê, e acha que faltou. No `drive` dá para criar pasta vazia, e
mesmo assim vale o mesmo: a carteira fica igual nos dois.

**A prova.** Depois de escrever, mostre a lista na tela, com o lugar de verdade:
no `local`, um `Glob` em `~/carteira/**/*.md`; no `drive`, liste a pasta
`carteira` e as de dentro pelo conector, e mostre os nomes. Dizer que criou não
é a mesma coisa que mostrar criado — e é o mesmo princípio do passo 3.

**Depois, o nome.** Uma pergunta, com o motivo dentro:

> Como você assina com contato? É esse nome que vai em toda mensagem que eu
> escrever, e é como eu vou saber quem é você quando você colar uma conversa.

O nome é a única coisa obrigatória do passo. Escreva `nome:` e o título
`# Carteira de <nome>`.

**Depois, o resto da identidade — uma pergunta só, em texto livre, e pulável:**

> Me diga o que souber de cabeça: cargo, empresa e
> os setores em que você já vendeu. Serve para o texto de abordagem e para a
> assinatura de e-mail. Pode pular.

`assinatura de e-mail:` **não se pergunta** — deriva de nome, cargo e
empresa (regra 1). O que ele não disser fica em branco e volta quando fizer
falta. `telefone:` também não se pergunta aqui: ele aparece sozinho na primeira
conversa colada.

Feche o passo gravando `atualizado:` com a data de hoje.

### Passo 2 · O modo

```
Como você quer que eu trabalhe?

  Copiloto      eu paro nas escolhas e pergunto · você decide tudo, e cada
                tarefa demora um pouco mais
  Automático    eu escolho e, no fim, digo o que escolhi e como desfazer ·
                mais rápido, e de vez em quando eu vou escolher diferente
                de você
```

Sugira **copiloto**, e diga por quê em uma linha: dá para trocar a palavra no
`INDICE.md` a qualquer hora, e trocar depois de ver a skill trabalhar é uma
escolha melhor que trocar antes.

Grave `modo: copiloto` ou `modo: automatico`. E diga, em uma linha, a exceção
escrita: **`/prospeccao:estudar-conta` nunca decide sozinha, nem no
automático** — quem decide se uma conta serve é gente.

### Passo 3 · A agenda

**Antes de mandar ele conectar coisa nenhuma, olhe se já está conectado.**
Procure na sessão a ferramenta de agenda do conector do Google: ela aparece com
nome de `list_calendars`, `list_events` ou `search_events`. Está lá? **Não peça
nada — vá direto para o teste.** Mandar conectar o que já está conectado é o
jeito mais rápido de fazer ele achar que a skill não sabe o que está fazendo.

**Não está.** Aí sim, os passos, e **espere**:

```
No Claude Code:
  1. digite  /mcp  e aperte Enter
  2. na lista, ache “Google Calendar”
  3. escolha “Authenticate” (em algumas versões, “Connect”)
  4. abre uma aba do navegador, na tela do Google — escolha a conta que você
     usa para trabalhar
  5. role a tela de permissões até o fim e clique em “Continuar”
  6. volte para cá

No Claude do navegador ou no Desktop:
  Configurações → Conectores → “Google Calendar” → “Conectar”, e a mesma tela
  do Google.
```

Se o rótulo do botão estiver diferente do que está escrito aí, é o botão do
lado direito da linha do Google Calendar — diga isso, em vez de deixar ele
procurando uma palavra exata.

Feche com a espera, e ela é literal: **“Me diga ‘pronto’ quando voltar, ou
‘pula’ se preferir deixar para depois.”** Não siga para o passo 4 antes da
resposta.

**O teste, e ele são duas chamadas com dois papéis diferentes:**

```
list_calendars              a prova para mim · conta conectada devolve pelo
                            menos uma agenda. Erro ou lista vazia = não colou
list_events, esta semana    a prova para ELE · mostre até três compromissos
                            com dia e hora, para ele reconhecer os próprios
```

Avise em uma linha antes de chamar: a agenda **não** está em `allowed-tools`, e
a primeira chamada pede permissão. Isso é normal e é bom que peça — ele vê o que
está sendo lido antes de aprovar.

Três resultados, e os três têm resposta:

- **Voltou a semana dele.** Mostre os três compromissos e o nome da agenda.
  Grave `Google Agenda: sim  ← testado 2026-08-19`.
- **Voltou a agenda, e a semana está vazia.** É passe, e diga por quê: conexão
  que não abriu dá **erro**, não devolve vazio. Mostre o nome da agenda que a
  primeira chamada trouxe, para ele conferir que é a conta certa. Grave `sim`.
- **Deu erro, ou os compromissos não são dele.** Conta trocada — pessoal em vez
  de trabalho — é o caso comum, e não é vergonha. Diga o que apareceu, ofereça
  refazer com a outra conta **uma vez**, e se não der: `Google Agenda: não`,
  mais uma linha em `## Pulado no começo` com a data.

**Nunca escreva `sim` sem o teste.** “Conectado” sem prova é o erro que só
aparece três dias depois, no meio de outra coisa — e aí o prospector não está
configurando nada, está com um contato esperando.

Pulou ou falhou: diga em uma linha que `/prospeccao:o-que-fazer-hoje` vai oferecer
ligar de novo no dia em que houver reunião marcada, e que sem agenda ela lê só
o que está escrito na carteira.

### Passo 4 · E-mail e Drive

Opcionais, mesma mecânica do passo 3 — olhar antes, explicar, esperar, testar,
gravar com a data. **A carteira está no Drive?** Então o Drive já está ligado e
testado — a carteira que abriu é o teste (contrato §1). Grave
`Google Drive: sim  ← testado <data>` e pergunte só do Gmail.

**Uma pergunta só para os dois**, senão viram duas telas seguidas de
configuração e ele fecha:

```
Quer ligar mais alguma coisa agora?

  Gmail e Drive     e-mail de contato e resposta de abordagem, e os documentos que você já
                    guarda no Drive · uns dois minutos, e é a mesma tela do
                    Google de agora há pouco
  Só o Gmail        se você fala com contato por e-mail
  Nenhum agora      eu anoto, e qualquer skill oferece de novo quando precisar
```

O caminho é o mesmo do passo 3, trocando o nome do conector — “Gmail”, “Google
Drive”. O teste de cada um:

```
Gmail    list_labels                          a prova para mim
         search_threads, newer_than:7d        três assuntos da semana, para ele
Drive    list_recent_files                    três nomes de arquivo, para ele
```

Diga em uma linha, no Gmail, o que o pack faz com ele: **só lê.** Nenhuma skill
do pack manda e-mail — todas escrevem o texto e quem aperta enviar é ele.

Grave `sim  ← testado <data>` só depois do teste, e `não` mais a linha em
`## Pulado no começo` quando pular ou falhar.

### Passo 5 · As conversas do WhatsApp

Comece pela verdade, em uma linha e sem rodeio: **aqui a conversa entra
colada**, e a API oficial do WhatsApp não resolve o caso dele — ela é para número de
empresa, e ele atende do número pessoal. A ponte é colar ou exportar, e é isso
que este passo ensina.

**E há um terceiro caminho, que só existe com o conector ligado:**
`/prospeccao:importar-a-conversa` lê o histórico e enche a carteira de uma vez —
ela abre só as conversas que parecem de trabalho e escreve no `INDICE.md` o que
leu e o que não leu. É o que troca a primeira semana de digitação por uma
execução. Se o Passo 6 tiver ligado o conector, ofereça-a aqui, em uma linha, e
**siga o passo mesmo assim**: os dois caminhos abaixo continuam sendo os que
funcionam em toda ferramenta, e são eles que ele vai usar no dia a dia.

Dois caminhos, **o mais barato primeiro**:

```
Copiar e colar        abre a conversa (no celular ou no WhatsApp Web),
                      seleciona as últimas mensagens, cola aqui. É o que você
                      vai fazer quase sempre, e não precisa de mais nada

Exportar              quando você quer a conversa inteira, com data e hora em
                      toda linha. São quatro toques, e é do celular — o
                      WhatsApp Web não exporta
```

Os quatro toques, com o nome de cada um:

```
iPhone    abra a conversa → toque no NOME DO CONTATO, no alto da tela →
          role até o fim → “Exportar conversa” → “Sem mídia”

Android   abra a conversa → ⋮ (os três pontinhos, canto de cima à direita) →
          “Mais” → “Exportar conversa” → “Sem mídia”
```

**“Sem mídia”, sempre.** Com mídia sai um arquivo pesado, demora, e as fotos não
entram na carteira de qualquer jeito. O resultado é um `.txt` — o jeito mais
simples de trazer para o computador é mandar para você mesmo por e-mail ou pelo
Drive, abrir, e colar aqui.

**Onde o arquivo mora:** na pasta `_bruto/` da carteira, com o nome
`AAAA-MM-DD-whatsapp-<apelido>.md` — a data é a da conversa, não a de hoje. Mas
diga o principal: **ele não precisa fazer isso à mão.** Cola aqui, e a skill
grava com o nome certo. `_bruto/` é a origem, não a verdade: nada lá se corrige,
se resume ou se apaga.

A linha do WhatsApp no `## O que está conectado` nasce `não`, e para quase todo
mundo é assim que ela fica: colar não é conexão que falhou, é como a coisa
funciona. A linha `envio:` não existe ainda — ela nasce com o conector, e quem
a escreve é a cadeia.

**Existe um caminho opcional, e ele não é para todos.** Só vale se ESTE programa
rodar comandos no computador dele — Claude Code, Codex CLI, Cursor. Nesse caso há
um conector que lê as conversas direto, sem colar, **e manda a resposta pelo
WhatsApp dele — uma por vez, com o texto inteiro e o nome de quem recebe na tela
antes de sair.** Custa uma instalação de uns quinze minutos, ocupa uma das quatro
vagas de dispositivo conectado do WhatsApp dele, e não é programa oficial da
Meta.

**Ofereça em duas linhas e não venda:** diga que existe, que colar continua
funcionando igual, e pergunte se ele quer agora, depois, ou não. **Os avisos do
envio não entram na oferta** — eles são da cadeia, e lá se dizem uma vez, antes
de qualquer instalação. Se quiser, leia `references/conectar-whatsapp.md` e siga
a cadeia de lá. Se não quiser, ou se aqui não houver linha de comando, siga em
frente e não toque mais no assunto.

Este passo é pulável, mas ele emenda no passo 7: se ele já tiver uma conversa à
mão agora, o passo 7 usa essa mesma.

### Passo 6 · A primeira conta, ou a planilha inteira

Dois caminhos, e a pergunta abre com os dois, com o custo escrito em cada um:

```
Como você quer pôr conta na carteira? É a primeira ficha que você vai ver, e é
o que as outras nove vão ler quando procurarem uma conta sua.

  Um site agora            1 minuto, uma ficha · o site de uma empresa que
                           você já quer abordar
  Minha planilha inteira   5 minutos, a carteira cheia · a planilha em que
                           você hoje controla quem já procurou, exportada
                           em CSV
```

Os dois terminam com ficha gravada, e o que vem depois da gravação é igual nos
dois — está no fim do passo.

#### O link

> Me manda o link de uma conta seu. Qualquer um que esteja no ar. É com ele que
> eu monto a primeira ficha, e você vê como a carteira fica.

**Abrir o link é com a ferramenta de web do harness, que NÃO está em
`allowed-tools`.** Avise antes: ela pede permissão, e é bom que peça — ele vê
qual endereço vai ser aberto antes de aprovar.

Três entradas, e as três terminam com um arquivo:

```
o link abriu             siga
o link voltou nada,      site que só monta a página por JavaScript devolve
ou só menu e rodapé      vazio. Diga na cara — “esse site não abre para mim” —
                         e peça a ficha colada. NÃO chute dado de conta
ele não tem link         ele digita o básico: empresa, cidade, setor, tamanho.
                         Todo o resto entra ?
```

Depois, nesta ordem, e ela importa:

1. **Escolha o id e o apelido antes de gravar o bruto**, porque o cabeçalho do
   bruto leva `sobre:` e `_bruto/` não se edita depois. Carteira nova: o
   primeiro é **`E-001`**, e não há um segundo prefixo. O apelido é
   `<empresa>, <cidade>`: `E-001 (VetorBank, Porto Alegre)`.
2. **Grave o bruto**, com o cabeçalho de três linhas do contrato §4.7 e o que
   veio do link ou a ficha colada, sem tocar.
3. **Grave o arquivo da conta** pelo gabarito de `modelos/conta.md`, cada
   campo com procedência — `← link, 2026-08-19` ou `← ficha colada, 2026-08-19`.
   O que não veio entra `?`, nunca uma estimativa.
4. **Uma linha na tabela** de `contas/_indice.md`, e o `## Quanto tem` do
   `INDICE.md` recontado.

#### A planilha

**O formato é CSV**, e os dois programas exportam em dois cliques. Diga onde:

```
Excel           Arquivo → Salvar como → em “Tipo”, escolha “CSV UTF-8”
Google Sheets   Arquivo → Fazer download → “Valores separados por vírgula (.csv)”
```

Veio `.xlsx`? Peça o CSV com essas duas linhas, **uma vez** — não há
biblioteca nem conversor aqui, e não se instala nenhum. Ele colou as linhas da
planilha direto na conversa? Vale como CSV colado, e segue igual.

Depois, nesta ordem, e ela importa:

1. **O bruto primeiro, e inteiro.** O arquivo entra em
   `_bruto/AAAA-MM-DD-planilha-<nome-curto>.csv` sem tocar, e **sem o
   cabeçalho de três linhas** do contrato §4.7 — um `.csv` com três linhas de
   texto em cima deixa de ser um `.csv`. O que veio colado na conversa vira
   esse mesmo arquivo, com as linhas como vieram. A data é a da exportação —
   hoje, quase sempre. **É daqui que sai toda procedência:**
   `← _bruto/AAAA-MM-DD-planilha-<nome-curto>.csv`. Não existe origem chamada
   “planilha”: a origem é o arquivo em `_bruto/`, que a regra 2 já prevê.
2. **Mapeie as colunas** para os campos do gabarito da conta (contrato §4.4):
   site, estado, setor, cidade, funcionários, faturamento, cnpj,
   sistema que usam, quem decide, de onde veio. Cabeçalho óbvio se mapeia sozinho —
   empresa, razão social, cnpj, cidade, setor, site, url. Ambiguidade vira
   **uma pergunta**, com a UI de botões, e ela mostra o mapeamento inteiro para
   ele confirmar **antes de gravar qualquer ficha**:

   ```
   Li 18 linhas da sua planilha. É isto?

   razão social → empresa · município → cidade · ramo → setor · url → site
   ficam de fora: “prospector responsável”, “data do texto de abordagem”

     Está certo         eu gravo as 18 fichas agora
     Mudo uma coluna    você diz qual, e eu mostro de novo antes de gravar
   ```

   Coluna que não tem campo no gabarito **não cria campo** — regra zero do
   contrato. É descrição? O texto vai para `## O que a conta faz`. Não é? Fica de
   fora, e a resposta diz quais colunas ficaram. `estado:` só recebe um dos
   seis valores do §4.4: “ativa” vira `a estudar`, e o que já foi abordado
   vira `abordado`, e o que não casar entra `?`.
3. **Uma ficha por linha**, pelo gabarito de `modelos/conta.md`, cada campo
   com `← _bruto/<o csv>`. O id é sequencial (contrato §2) — `E-001`,
   `E-002`… numa carteira nova —, e o prefixo é `E-`, e não há um segundo — a
   planilha não precisa dizer nada. O apelido é `<empresa>, <cidade>`; sem
   cidade na linha, use só o nome da empresa e diga isso.
   O que a linha não tem entra `?`. Linha vazia não vira ficha, e linha
   repetida — mesmo link ou mesmo endereço — não vira duas.
4. **Uma linha por conta** em `contas/_indice.md`, o `## Quanto tem` do
   `INDICE.md` recontado, e em cada ficha uma linha no `## Histórico`:
   `- AAAA-MM-DD entrou na carteira  ← _bruto/AAAA-MM-DD-planilha-<nome>.csv`.

**Teto: 200 linhas por vez.** Passou disso, pergunte se importa tudo ou só as
linhas marcadas como disponíveis. E na tela vai **a primeira ficha inteira e a
contagem do resto** — nunca as duzentas.

#### Nos dois caminhos

**Mostre a ficha na tela, inteira — a única, ou a primeira das dezoito —, e
diga onde ela ficou.** É a primeira vez que ele vê o formato, e é aqui que ele
entende o que comprou: texto, dele, que abre em qualquer editor e vai junto se
ele trocar de empresa.

Aponte o `?` que ficou — “o e-mail eu não tenho, e sem ele a abordagem só sai
pelo LinkedIn”; na planilha, o `?` que se repete vira uma linha só, “o e-mail
não está na planilha, ficou ? em 18 fichas” — e diga que o **texto de abordagem** é de
`/prospeccao:escrever-abordagem`. Esta aqui só põe a conta dentro.

**Se ele quiser pular**, diga o custo em uma linha antes de aceitar: carteira
vazia não faz ninguém voltar, e as outras nove leem essa pasta. Insistiu: anote
em `## Pulado no começo` e siga.

### Passo 7 · O primeiro contato

Peça **uma conversa colada** — a do passo 5, se ele já trouxe, ou qualquer
outra:

> Cola aqui uma conversa sua com um contato. Pode ser um pedaço, as últimas
> mensagens bastam. Eu guardo o original e tiro dela a ficha dele.

Contrato §7, os quatro passos, sem atalho:

1. **O bruto primeiro**, em `_bruto/AAAA-MM-DD-whatsapp-<apelido>.md`. Primeiro
   porque, se algo der errado no meio, o material dele já está salvo.
2. **Os fatos** para o arquivo do contato — `P-001` numa carteira nova —, cada
   campo com `← _bruto/<arquivo>`. Fato é o que está escrito: “dá sábado, mas
   cedo” é `## Combinado`, não “reunião marcada para terça”.
3. **As vistas**: uma linha em `contatos/_indice.md`, uma linha no `funil.md` na
   etapa que a conversa mostrar (na dúvida, `a estudar`), e o `## Quanto tem`.
4. **Diga onde guardou**, no `## Guardei`.

Três coisas que este passo resolve e que valem uma linha cada:

- **Quem é ele na conversa** é o remetente cujo nome bate com `nome:` do
  `INDICE.md`. Não bateu de jeito nenhum: pergunte uma vez — “Nessa conversa,
  qual dos dois é você?”. Nunca deduza pelo tom; o risco é gravar a fala do
  contato como promessa dele.
- **Buraco é buraco.** `<Mídia oculta>`, mensagem apagada, áudio e figurinha
  viram linha declarada ou pergunta, nunca palpite. Áudio não se transcreve de
  ouvido.
- **Se a conversa fala da conta do passo 6, ligue os dois** — uma linha em
  `## Onde trabalha` no contato e uma em `## Quem decide` na conta. É a
  primeira vez que a carteira mostra o que ela é, e vale mostrar as duas linhas
  na tela.

Sem conversa à mão? Ele digita o básico — nome, telefone, o que procura — e o
resto entra `?`. Mostre o arquivo, aponte os `?`, e diga que a resposta ao prospect é
de `/prospeccao:escrever-abordagem`.

### Passo 8 · O que pedir agora

Feche com **três coisas que ele pode digitar hoje**, cada uma usando o que
acabou de entrar na carteira — e com o id e o apelido de verdade, não os do
exemplo:

```
o que eu faço hoje?
    /prospeccao:o-que-fazer-hoje lê a carteira inteira e monta a lista do dia,
    na ordem do que faz perder a janela

estuda a E-001 (VetorBank, Porto Alegre)
    /prospeccao:estudar-conta lê o que é público e grava fato com procedência
    — o que não achar vira ?

escreve a abordagem para a P-001 (Carla Menezes)
    /prospeccao:escrever-abordagem usa o que a carteira sabe e o gancho mais
    recente, e confere o nao-perturbe.md antes
```

E a lista inteira, uma linha cada:

```
/prospeccao:comecar             monta a carteira e testa o que conectou
/prospeccao:perfil-de-cliente   escreve quem vale a pena, e o que desqualifica
/prospeccao:estudar-conta       o que é público sobre a conta, com procedência
/prospeccao:escrever-abordagem  a mensagem, e a recusa quando ela é a resposta
/prospeccao:retomar-contato     quem não respondeu, e o gancho que ainda não usei
/prospeccao:o-que-fazer-hoje    a lista do dia, tirada da sua carteira
/prospeccao:cobrar-o-que-falta  o que prometeram e não mandou, e para quem cobrar
/prospeccao:importar-a-conversa a conversa colada vira fato no lugar certo
/prospeccao:organizar-carteira  guarda o que chegou, poda o que morreu
/prospeccao:laudo-da-carteira   o que está sem procedência, e o que envelheceu
```

**Confira essa lista contra o que está instalado antes de mostrá-la.** Prometer
skill que não existe é o primeiro erro que ele encontra sozinho, e é o último em
que ele acredita. Dois caminhos, nesta ordem:

1. **Onde há ferramenta de arquivo** — as dez moram lado a lado, uma pasta cada:
   um `Glob` em `../*/SKILL.md` a partir da pasta desta.
2. **Onde não há** — chat da web, com a carteira no Drive: a lista das dez está
   em `references/contrato/11-0-onde-roda.md`, que veio junto com esta skill. Leia
   de lá, e leia também a classificação: no chat da web sem carteira, cinco das
   dez não funcionam, e mostrar as dez como se todas funcionassem é a mesma
   promessa quebrada por outro caminho.

Ele já tem material de antes — planilha, agenda de papel, um monte de conversa?
Uma linha: ponha na pasta `_bruto/` da carteira e rode
`/prospeccao:organizar-carteira`, que lê o que está lá e transforma em ficha.

---

## 7 · A saída

O fecho é o do contrato §10, com os títulos exatos. Não há bloco para colar
nesta skill: o trabalho dela é a carteira.

**O `## Guardei` sai sempre, inclusive quando ela não gravou nada** — e é o
caso de quem a chama só para retomar um item de `## Pulado no começo` e o
teste da conexão não passa. Aí o fecho é este, e o título é este:

```markdown
## Guardei
- nada foi gravado — o teste do Google Drive não passou, e a linha só vira
  `sim` depois de uma chamada que voltou (passo 4)

## Ficou para depois
- ligar o Google Drive — continua em “Pulado no começo”, com a data de lá
```

`## Não gravei nada` e `## A carteira está como estava` são títulos
inventados, e a seção 4 do contrato os proíbe: quem lê o fecho procura os três
títulos fixos, e um quarto nome quebra quem vier atrás. Medido na prova: esta
skill inventou o próprio na primeira execução, tendo feito a coisa certa.

```markdown
# Sua carteira está montada

Ela mora em ~/carteira/. É sua, é texto, e você abre em qualquer editor.

## O que ficou pronto
- a carteira, com os nove arquivos do padrão
- modo: copiloto — eu paro nas escolhas e pergunto
- Google Agenda ligada e testada: li os seus três compromissos desta semana
- E-001 (VetorBank, Porto Alegre), do site que você mandou
- P-001 (Carla Menezes), da conversa que você colou — e ela já aparece no
  funil, em “a estudar”
- nao-perturbe.md criado, vazio — e é ele que toda mensagem lê antes de sair

## Guardei
- ~/carteira/INDICE.md — criado, com o seu nome e o modo
- ~/carteira/hoje.md · funil.md — criados, vazios por enquanto
- ~/carteira/nao-perturbe.md — criado, vazio
- ~/carteira/contas/E-001-vetorbank.md — criado
- ~/carteira/contas/_indice.md — uma linha
- ~/carteira/contatos/P-001-carla-menezes.md — criado
- ~/carteira/contatos/_indice.md — uma linha
- ~/carteira/_bruto/2026-08-12-linkedin-carla.md — a conversa, como veio

## Falta saber
- o e-mail da P-001 (Carla Menezes) — o LinkedIn não mostra
- o faturamento do E-001 (VetorBank, Porto Alegre) — não é público

## Ficou para depois
- o perfil.md — sem ele eu não sei dizer se uma conta vale a pena, e
  /prospeccao:perfil-de-cliente leva uns 10 minutos
- ligar o Gmail e o Google Drive — anotei em “Pulado no começo”, e qualquer
  skill oferece de novo quando fizer falta

## O que pedir agora
<os três exemplos e a lista das dez>
```

Veio da planilha? As linhas da conta trocam por estas, e o resto fica:

```markdown
## O que ficou pronto
- 18 contas, de E-001 (VetorBank, Porto Alegre) a E-018 (Sanare, Curitiba), da
  planilha que você importou — duas colunas ficaram de fora, “vendedor” e
  “data do último contato”

## Guardei
- ~/carteira/contas/ — 18 fichas criadas, E-001 a E-018
- ~/carteira/contas/_indice.md — 18 linhas
- ~/carteira/_bruto/2026-08-19-planilha-contas.csv — a planilha, como veio

## Falta saber
- o setor não está na planilha — ficou ? em 18 fichas
- quem decide, nas 18: a planilha tem empresa e não tem pessoa
```

O exemplo acima é o de uma carteira no computador. **No `drive`, o mesmo fecho
troca o lugar:** “Ela mora na pasta `carteira` do seu Drive”, e cada linha do
`## Guardei` nomeia a pasta e o arquivo — `contas/E-001-vetorbank.md, na
pasta carteira do seu Drive — criado`. O prospector precisa saber onde a coisa foi
parar nos dois.

Ao falar com o prospector, data em prosa — “12 de agosto”. **Nos arquivos, sempre
`2026-08-12`.** Todo id aparece com o apelido junto, em toda linha, inclusive nas
tabelas.

`## Decidi sozinho` não aparece nesta skill: ela não decide nada sozinha, e é de
propósito (seção 5).

---

## 8 · Onde ela para

**Ela não conecta nada por ele.** Autorizar o Google é no navegador dele, com a
conta dele, na tela do Google. Ela explica com o nome de cada botão e espera. E
**não pede senha em passo nenhum** — se algo numa conversa parecer pedir senha,
não é ela.

**Ela não escreve `sim` sem testar.** Nem por pressa, nem porque ele disse que
conectou, nem porque a ferramenta apareceu na sessão. O que vale é a chamada que
voltou.

**Ela não sobrescreve carteira que já existe.** `Write` só em arquivo novo.
Carteira montada e ela rodando de novo é retomada, não recomeço — e o passo que
já está feito não se refaz.

**Ela não apaga nada, nunca.** Nem arquivo, nem linha, nem `_bruto/`. Se ele
quiser mover a carteira de lugar depois, quem move a pasta é ele — no computador
dele ou no Drive dele. Mover não é trabalho desta skill.

**Ela não chuta dado de conta.** Link que não abriu vira ficha colada ou vira
`?`. Nem para “ilustrar”, nem para a carteira parecer mais cheia no fim do
setup — que é justamente onde a tentação existe.

**Ela não escreve texto de abordagem nem mensagem.** A abordagem é de
`/prospeccao:escrever-abordagem`, o estudo da conta é de
`/prospeccao:estudar-conta`, a lista do dia é de
`/prospeccao:o-que-fazer-hoje`. Ela monta a carteira de onde as três tiram o
que dizem.

**Ela não lê CNPJ, contrato social nem edital.** Documento que aparecer vira
arquivo em `_bruto/` e uma linha dizendo que quem lê é
`/prospeccao:estudar-conta` — a única que nunca opera em automático.

**Dos conectores ela só lê, e só no teste.** Não cria evento, não manda e-mail,
não escreve no Drive, e não manda mensagem no WhatsApp — nem uma de teste para
provar que a ponte envia. Ela liga a ponte e escreve como o envio vai perguntar;
quem manda é a skill do dia, com o texto e o destinatário na tela dele antes
(contrato §7.1). O bloco para copiar segue sendo o padrão do pack.

**Ela não instala nada.** Não roda `/plugin`, não edita configuração do Claude
Code, não mexe em MCP. No passo 3 ela diz o que digitar; quem digita é ele.

**Ela não sai da carteira** nem toca em pasta nenhuma fora dela, em transporte
nenhum.

**Sem nenhum dos dois transportes ela não funciona**, e diz isso em uma linha, sem pedir
desculpa duas vezes: “Isto monta a sua carteira, e aqui eu não tenho onde
montar. No Claude Code, ou com a carteira no Drive, funciona.” Nada é gravado, e
ela não finge que foi.

**Ela não insiste.** Passo pulado é passo anotado, e a oferta volta uma vez, na
skill em que aquilo faz falta. Insistir no setup é onde o prospector fecha a janela
e não volta.

E quando algo não der certo, uma linha: o que não deu e qual é o caminho. Sem
pedir desculpa duas vezes, e sem sumir do assunto.
