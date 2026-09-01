---
name: comecar
description: >-
  A primeira skill do pack, e a que todas as outras nove pressupõem: monta a
  carteira do corretor do zero, em oito passos, no computador ou no Google
  Drive. Cria as pastas, copia os sete modelos, escreve quem ele é, grava o modo
  — copiloto ou automático — e conecta Google Agenda, Gmail e Drive explicando
  cada botão e TESTANDO o que conectou antes de escrever “sim”. Ensina a
  trazer conversa do WhatsApp, que entra colada. Termina com a
  carteira cheia: um imóvel de verdade, vindo de um link, e um cliente de
  verdade, vindo de uma conversa colada. Todo passo é pulável, e se ele fechar
  no meio ela volta de onde parou. Use na primeira vez, sempre, e quando ele
  disser “instalei, e agora”, “como eu começo”, “configura isso pra mim”, “não
  tenho carteira nenhuma”, “quero ligar minha agenda”, “parei no meio da
  configuração”, “pulei o Gmail e quero ligar agora”, “mudei de computador” — e
  sempre que outra skill disser que não achou o INDICE.md da carteira.
license: MIT
compatibility: >-
  Precisa de um lugar para montar a carteira: uma pasta no computador, com
  ferramenta de arquivo, ou a pasta carteira no Google Drive, pelo conector. Sem
  nenhum dos dois — chat na web sem Drive — ela não funciona, e diz isso em uma
  linha: o trabalho dela é montar a carteira. Google Agenda e Gmail são
  opcionais; sem eles, os passos 3 e 4 ficam anotados como pulados.
allowed-tools: Read Glob Grep Write Edit
---

# Começar

## 1 · O que ela faz, e o que ela não faz

Ela monta a carteira no lugar que ele escolher no passo 1 — uma pasta no
computador ou a pasta `carteira` no Google Drive — e a entrega **cheia**: as
sete peças do contrato criadas, o modo escolhido, o que dá para conectar
conectado e testado, e dentro dela um imóvel e um cliente de verdade — não
exemplos.

**Ela não pede argumento.** Rodar sem nada é o normal: ela pergunta o que
precisa, um passo por vez. Com a carteira já montada, ou com “continuar”, é
retomada — seção 4.

Ela **executa o que dá e só pede o que só ele pode fazer.** Criar pasta, copiar
modelo, ler link, extrair fato de uma conversa colada: é com ela. Autorizar o
Google no navegador, com a conta dele: é com ele — e nesse ponto ela explica os
passos com o nome de cada botão e **espera**.

Ela não escreve anúncio, não escreve mensagem para cliente nenhum, não lê
matrícula, não instala nada e não mexe em configuração do Claude Code. E
**nenhum passo dela pede senha**: a autorização do Google acontece na tela do
Google, no navegador dele, e ela não vê nada disso.

**Por que ela tem `Write` e `Edit`.** É a skill que cria a carteira: sete
arquivos novos a partir de `references/modelos/` (`Write`), mais o arquivo do
primeiro imóvel, o do primeiro cliente e o primeiro bruto (`Write`), e as vistas
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

1. **`references/CONTRATO.md`, inteiro.** Ele é a lei do pack, e **nenhum
   gabarito é reescrito aqui**. O que esta skill usa direto:

```
1    onde a carteira mora — os dois transportes —, e quem é dono de qual fato
2    id e apelido, e o nome do arquivo
3    as três regras — procedência é a que mais aparece aqui
4    os sete formatos literais, e o que fazer com os comentários dos modelos
5    os dois modos, e a exceção da matrícula
7    como ler uma conversa colada, e o que fazer com ela depois
8    o tamanho da pergunta, e a UI de escolha com o custo escrito
10   como uma skill termina
```

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
usa caminho absoluto.** Ao falar com o corretor, escreva `~/carteira/…`, que é
curto e ele entende. Não teve certeza do caminho? A pergunta do passo 1 já pede
— mostre o que você achou como sugestão e deixe ele corrigir.

**No `drive` não existe caminho.** Pasta é um item com id, arquivo é filho de
pasta, e `/carteira` é o nome da pasta na raiz do Drive dele. Guarde o id de
cada pasta que criar ou abrir, e **prenda toda busca à pasta** — `_indice.md`
existe duas vezes, e o nome solto devolve os dois. Ao falar com o corretor,
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
6  o primeiro imóvel
7  o primeiro cliente
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
| 6 | a tabela de `imoveis/_indice.md` tem ao menos uma linha |
| 7 | a tabela de `clientes/_indice.md` tem ao menos uma linha |
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
  `/corretor:montar-visita`, na hora em que ela faz sentido.
- **escolha entre dois e quatro caminhos usa a UI de perguntas** do harness —
  botões, não prosa —, com rótulo de até quatro palavras e **o custo escrito em
  cada opção**. A descrição declara o custo; ela não vende a opção.
- **toda pergunta traz o motivo na mesma frase.** É o que ensina o ofício
  enquanto ela trabalha, e é o que faz ele responder em vez de fugir.

**O modo, aqui, não muda nada.** O que falta nesta skill só ele sabe: onde ficam
os arquivos dele, o nome dele, qual conta do Google, qual imóvel. Automático não
inventa nenhuma dessas. Se ele escolher automático no passo 2, diga em uma linha
que aquilo vale da **próxima** skill em diante, e siga perguntando.

---

## 6 · Os oito passos

### Passo 1 · Onde fica a carteira, e quem é você

**Primeiro, a pergunta do lugar.** É aqui que o transporte se escolhe, uma vez,
e o caminho que você achou já vai preenchido:

```
Onde eu monto a sua carteira?

  No computador       C:\Users\marcelo\carteira · você abre em qualquer editor,
                      e é onde as outras nove vão procurar sozinhas
  No Google Drive     a pasta carteira no seu Drive · funciona também no chat
                      do navegador, e precisa do conector do Drive ligado
  Outro lugar         você me diz onde · funciona, mas toda skill vai precisar
                      que você diga onde é
```

Já existe `INDICE.md` lá? **Pare e vá para a seção 4.** Não sobrescreva.

Não existe: crie, copiando de `references/modelos/` para os sete destinos da
seção 4 do contrato. **Os comentários `<!-- MODELO · … -->` saem —
todos.** Arquivo que chega ao corretor com o próprio manual dentro parece
arquivo pela metade.

```
modelos/INDICE.md            → ~/carteira/INDICE.md
modelos/hoje.md              → ~/carteira/hoje.md
modelos/funil.md             → ~/carteira/funil.md
modelos/_indice-imoveis.md   → ~/carteira/imoveis/_indice.md
modelos/_indice-clientes.md  → ~/carteira/clientes/_indice.md
```

**E a linha `envio:` do modelo sai junto com os comentários.** Ela governa
quanto a skill pergunta antes de mandar mensagem, e **só existe onde há
conector** (contrato §7.1). A carteira nasce com `WhatsApp: não`, então ela
ainda não tem o que governar — quem a escreve é o passo 5, se ele ligar a
ponte.

`modelos/imovel.md` e `modelos/cliente.md` **não se copiam agora**: eles viram
arquivo nos passos 6 e 7, um por item, com id e apelido no nome.

**A primeira linha do `INDICE.md` é a do transporte**, antes de `modo:`, no
formato do contrato §1 — `carteira: local · C:\Users\marcelo\carteira` ou
`carteira: drive · /carteira`. É ela que as outras nove leem para saber por onde
ler e gravar; sem ela, cada skill vai adivinhar pelo lugar em que o arquivo
apareceu.

**`_bruto/` e `arquivo-morto/` nascem vazias, e pasta vazia não se cria com
`Write`.** Elas aparecem quando o primeiro arquivo cai lá — `_bruto/` no passo 5
ou 6, `arquivo-morto/` só quando algo for aposentado. **Diga isso em uma linha**,
senão ele abre a carteira, não vê as duas, e acha que faltou. No `drive` dá para
criar pasta vazia, e mesmo assim vale o mesmo: a carteira fica igual nos dois.

**A prova.** Depois de escrever, mostre a lista na tela, com o lugar de verdade:
no `local`, um `Glob` em `~/carteira/**/*.md`; no `drive`, liste a pasta
`carteira` e as de dentro pelo conector, e mostre os nomes. Dizer que criou não
é a mesma coisa que mostrar criado — e é o mesmo princípio do passo 3.

**Depois, o nome.** Uma pergunta, com o motivo dentro:

> Como você assina com cliente? É esse nome que vai em toda mensagem que eu
> escrever, e é como eu vou saber quem é você quando você colar uma conversa.

O nome é a única coisa obrigatória do passo. Escreva `nome:` e o título
`# Carteira de <nome>`.

**Depois, o resto da identidade — uma pergunta só, em texto livre, e pulável:**

> Me diga o que souber de cabeça: CRECI, imobiliária e os bairros onde você
> trabalha. Serve para o anúncio e para a assinatura de e-mail. Pode pular.

`assinatura de e-mail:` **não se pergunta** — deriva de nome, CRECI e
imobiliária (regra 1). O que ele não disser fica em branco e volta quando fizer
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
escrita: **`/corretor:conferir-matricula` nunca decide sozinha, nem no
automático** — quem conclui o que trava uma venda é gente.

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
aparece três dias depois, no meio de outra coisa — e aí o corretor não está
configurando nada, está com um cliente esperando.

Pulou ou falhou: diga em uma linha que `/corretor:montar-visita` vai oferecer
ligar de novo na hora de marcar a primeira visita, e que sem agenda ela pergunta
os horários em vez de travar.

### Passo 4 · E-mail e Drive

Opcionais, mesma mecânica do passo 3 — olhar antes, explicar, esperar, testar,
gravar com a data. **A carteira está no Drive?** Então o Drive já está ligado e
testado — a carteira que abriu é o teste (contrato §1). Grave
`Google Drive: sim  ← testado <data>` e pergunte só do Gmail.

**Uma pergunta só para os dois**, senão viram duas telas seguidas de
configuração e ele fecha:

```
Quer ligar mais alguma coisa agora?

  Gmail e Drive     e-mail de cliente e portal, e os documentos que você já
                    guarda no Drive · uns dois minutos, e é a mesma tela do
                    Google de agora há pouco
  Só o Gmail        se você fala com cliente por e-mail
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

### Passo 6 · O primeiro imóvel

Peça **um link** — a página de um imóvel que ele tem no site da imobiliária, ou
o anúncio dele num portal. Uma pergunta:

> Me manda o link de um imóvel seu. Qualquer um que esteja no ar. É com ele que
> eu monto a primeira ficha, e você vê como a carteira fica.

**Abrir o link é com a ferramenta de web do harness, que NÃO está em
`allowed-tools`.** Avise antes: ela pede permissão, e é bom que peça — ele vê
qual endereço vai ser aberto antes de aprovar.

Três entradas, e as três terminam com um arquivo:

```
o link abriu             siga
o link voltou nada,      site que só monta a página por JavaScript devolve
ou só menu e rodapé      vazio. Diga na cara — “esse site não abre para mim” —
                         e peça a ficha colada. NÃO chute dado de imóvel
ele não tem link         ele digita o básico: tipo, bairro, dormitórios, preço.
                         Todo o resto entra ?
```

Depois, nesta ordem, e ela importa:

1. **Escolha o id e o apelido antes de gravar o bruto**, porque o cabeçalho do
   bruto leva `sobre:` e `_bruto/` não se edita depois. Carteira nova: o
   primeiro é **`V-001`** — ou `A-001`, se for para alugar. O apelido é
   `<tipo> <n> dorm, <bairro>`: `V-001 (casa 3 dorm, Azenha)`.
2. **Grave o bruto**, com o cabeçalho de três linhas do contrato §4.7 e o que
   veio do link ou a ficha colada, sem tocar.
3. **Grave o arquivo do imóvel** pelo gabarito de `modelos/imovel.md`, cada
   campo com procedência — `← link, 2026-08-19` ou `← ficha colada, 2026-08-19`.
   O que não veio entra `?`, nunca uma estimativa.
4. **Uma linha na tabela** de `imoveis/_indice.md`, e o `## Quanto tem` do
   `INDICE.md` recontado.

**Mostre o arquivo na tela, inteiro, e diga onde ele ficou.** É a primeira vez
que ele vê o formato, e é aqui que ele entende o que comprou: texto, dele, que
abre em qualquer editor e vai junto se ele trocar de imobiliária.

Aponte o `?` que ficou — “o IPTU eu não tenho, e é a segunda coisa que perguntam
depois do preço” — e diga que o **anúncio** é de `/corretor:anunciar-imovel`.
Esta aqui só põe o imóvel dentro.

**Se ele quiser pular**, diga o custo em uma linha antes de aceitar: carteira
vazia não faz ninguém voltar, e as outras nove leem essa pasta. Insistiu: anote
em `## Pulado no começo` e siga.

### Passo 7 · O primeiro cliente

Peça **uma conversa colada** — a do passo 5, se ele já trouxe, ou qualquer
outra:

> Cola aqui uma conversa sua com um cliente. Pode ser um pedaço, as últimas
> mensagens bastam. Eu guardo o original e tiro dela a ficha dele.

Contrato §7, os quatro passos, sem atalho:

1. **O bruto primeiro**, em `_bruto/AAAA-MM-DD-whatsapp-<apelido>.md`. Primeiro
   porque, se algo der errado no meio, o material dele já está salvo.
2. **Os fatos** para o arquivo do cliente — `C-001` numa carteira nova —, cada
   campo com `← _bruto/<arquivo>`. Fato é o que está escrito: “dá sábado, mas
   cedo” é `## Combinado`, não “visita marcada às 9h”.
3. **As vistas**: uma linha em `clientes/_indice.md`, uma linha no `funil.md` na
   etapa que a conversa mostrar (na dúvida, `novo lead`), e o `## Quanto tem`.
4. **Diga onde guardou**, no `## Guardei`.

Três coisas que este passo resolve e que valem uma linha cada:

- **Quem é ele na conversa** é o remetente cujo nome bate com `nome:` do
  `INDICE.md`. Não bateu de jeito nenhum: pergunte uma vez — “Nessa conversa,
  qual dos dois é você?”. Nunca deduza pelo tom; o risco é gravar a fala do
  cliente como promessa dele.
- **Buraco é buraco.** `<Mídia oculta>`, mensagem apagada, áudio e figurinha
  viram linha declarada ou pergunta, nunca palpite. Áudio não se transcreve de
  ouvido.
- **Se a conversa fala do imóvel do passo 6, ligue os dois** — uma linha em
  `## Imóveis mostrados` no cliente e uma em `## Mostrado a` no imóvel. É a
  primeira vez que a carteira mostra o que ela é, e vale mostrar as duas linhas
  na tela.

Sem conversa à mão? Ele digita o básico — nome, telefone, o que procura — e o
resto entra `?`. Mostre o arquivo, aponte os `?`, e diga que a resposta ao lead é
de `/corretor:responder-lead`.

### Passo 8 · O que pedir agora

Feche com **três coisas que ele pode digitar hoje**, cada uma usando o que
acabou de entrar na carteira — e com o id e o apelido de verdade, não os do
exemplo:

```
o que eu faço hoje?
    /corretor:o-que-fazer-hoje lê a carteira inteira e monta a lista do dia,
    na ordem do que faz perder negócio

chegou um lead, colei a conversa aqui
    /corretor:responder-lead escreve a resposta na sua voz e guarda o cliente

escreve o anúncio do V-001 (casa 3 dorm, Azenha)
    /corretor:anunciar-imovel devolve duas versões, uma para portal e uma
    para WhatsApp
```

E a lista inteira, uma linha cada:

```
/corretor:comecar                 monta a carteira e testa o que conectou
/corretor:anunciar-imovel         o anúncio, a partir do link ou da ficha colada
/corretor:conferir-matricula      lista o que pode travar a venda — quem conclui é você
/corretor:gravar-video-do-imovel  o roteiro do vídeo, plano a plano
/corretor:responder-lead          a resposta pronta, e o que ainda falta perguntar
/corretor:montar-visita           quais imóveis mostrar, em que ordem e por quê
/corretor:retomar-contato         quem sumiu, e a mensagem que traz de volta
/corretor:o-que-fazer-hoje        a lista do dia, tirada da sua carteira
/corretor:documentos-do-negocio   que papel pedir de quem, e em que ordem
/corretor:organizar-carteira      guarda o que chegou, poda o que morreu
```

**Confira essa lista contra o que está instalado antes de mostrá-la.** Prometer
skill que não existe é o primeiro erro que ele encontra sozinho, e é o último em
que ele acredita. Dois caminhos, nesta ordem:

1. **Onde há ferramenta de arquivo** — as dez moram lado a lado, uma pasta cada:
   um `Glob` em `../*/SKILL.md` a partir da pasta desta.
2. **Onde não há** — chat da web, com a carteira no Drive: a lista das dez está
   na seção 11 do `references/CONTRATO.md`, que veio junto com esta skill. Leia
   de lá, e leia também a classificação: no chat da web sem carteira, cinco das
   dez não funcionam, e mostrar as dez como se todas funcionassem é a mesma
   promessa quebrada por outro caminho.

Ele já tem material de antes — planilha, agenda de papel, um monte de conversa?
Uma linha: ponha na pasta `_bruto/` da carteira e rode
`/corretor:organizar-carteira`, que lê o que está lá e transforma em ficha.

---

## 7 · A saída

O fecho é o do contrato §10, com os títulos exatos, e só as seções com conteúdo.
Não há bloco para colar nesta skill: o trabalho dela é a carteira.

```markdown
# Sua carteira está montada

Ela mora em ~/carteira/. É sua, é texto, e você abre em qualquer editor.

## O que ficou pronto
- a carteira, com os sete arquivos do padrão
- modo: copiloto — eu paro nas escolhas e pergunto
- Google Agenda ligada e testada: li os seus três compromissos desta semana
- V-001 (casa 3 dorm, Azenha), do link que você mandou
- C-001 (Joana Ribeiro), da conversa que você colou — e ela já aparece no
  funil, em “novo lead”

## Guardei
- ~/carteira/INDICE.md — criado, com o seu nome e o modo
- ~/carteira/hoje.md · funil.md — criados, vazios por enquanto
- ~/carteira/imoveis/V-001-casa-3d-azenha.md — criado
- ~/carteira/imoveis/_indice.md — uma linha
- ~/carteira/clientes/C-001-joana-ribeiro.md — criado
- ~/carteira/clientes/_indice.md — uma linha
- ~/carteira/_bruto/2026-08-12-whatsapp-joana.md — a conversa, como veio

## Falta saber
- IPTU e condomínio do V-001 (casa 3 dorm, Azenha) — o link não trazia
- até quando a C-001 (Joana Ribeiro) quer se mudar

## Ficou para depois
- ligar o Gmail e o Google Drive — anotei em “Pulado no começo”, e qualquer
  skill oferece de novo quando fizer falta

## O que pedir agora
<os três exemplos e a lista das dez>
```

O exemplo acima é o de uma carteira no computador. **No `drive`, o mesmo fecho
troca o lugar:** “Ela mora na pasta `carteira` do seu Drive”, e cada linha do
`## Guardei` nomeia a pasta e o arquivo — `imoveis/V-001-casa-3d-azenha.md, na
pasta carteira do seu Drive — criado`. O corretor precisa saber onde a coisa foi
parar nos dois.

Ao falar com o corretor, data em prosa — “12 de agosto”. **Nos arquivos, sempre
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

**Ela não chuta dado de imóvel.** Link que não abriu vira ficha colada ou vira
`?`. Nem para “ilustrar”, nem para a carteira parecer mais cheia no fim do
setup — que é justamente onde a tentação existe.

**Ela não escreve anúncio nem mensagem.** O anúncio é de
`/corretor:anunciar-imovel`, a resposta é de `/corretor:responder-lead`, a lista
do dia é de `/corretor:o-que-fazer-hoje`. Ela monta a carteira de onde as três
tiram o que dizem.

**Ela não lê matrícula, escritura nem contrato.** Documento que aparecer vira
arquivo em `_bruto/` e uma linha dizendo que quem lê é
`/corretor:conferir-matricula` — a única que nunca opera em automático.

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
skill em que aquilo faz falta. Insistir no setup é onde o corretor fecha a janela
e não volta.

E quando algo não der certo, uma linha: o que não deu e qual é o caminho. Sem
pedir desculpa duas vezes, e sem sumir do assunto.
