---
name: importar-a-conversa
description: >-
  Enche a busca com o que já está no WhatsApp: lê o histórico pelo conector,
  separa o que é do ofício do que é vida pessoal, e transforma conversa em
  contatos e vagas com procedência em cada campo. Mostra o que vai entrar
  ANTES de gravar, e escreve no INDICE.md o que leu e o que descartou. Sem
  conector ela ensina a exportar e processa o que for colado — o resultado é o
  mesmo arquivo. Use no primeiro dia, depois de /vagas:comecar, e quando o
  candidato disser — está tudo no meu WhatsApp · minha busca está vazia
  e eu tenho anos de conversa · importa as minhas conversas · puxa o histórico ·
  eu não vou digitar tudo isso · dá pra pegar do WhatsApp? · tenho conversa com
  gente que nem lembro. Também depois de trocar de computador. Ela só LÊ: não
  manda mensagem e não responde ninguém em nenhum modo. Quem arruma o que já
  entrou é /vagas:organizar-busca, e quem confere se ficou bom é
  /vagas:laudo-da-busca.
license: MIT
compatibility: >-
  Precisa da busca montada; sem ela manda rodar /vagas:comecar primeiro.
  Com o conector do WhatsApp ela lê o histórico — e a PRIMEIRA chamada é sempre
  estado_da_ponte, porque ponte parada congela o histórico sem avisar. Sem
  conector ela funciona igual pelo caminho colado, uma conversa por vez, e diz
  isso em uma linha. Ela só LÊ o conector: não manda mensagem em nenhum modo.
  Precisa escrever em _bruto/ e nos arquivos donos.
allowed-tools: Read Glob Grep Write Edit
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/importar-a-conversa/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# Importar a conversa

## 1 · O que ela faz, e o que ela não faz

**A busca não precisa nascer vazia.** O histórico da busca já está escrito:
quem é cada contato, o que foi combinado, que faixa foi dita, quem prometeu
mandar o quê. Está na conversa, com data, escrito pelas duas partes. Esta skill
é a que traz isso para dentro.

É o que separa uma busca que serve no primeiro dia de uma que serve no
trigésimo — e o trigésimo dia é onde a maioria desiste.

**Três coisas que ela é:**

- **Uma triagem antes de uma importação.** O trabalho difícil não é ler: é
  decidir o que NÃO entra.
- **Uma prévia antes de uma gravação.** Nada é escrito antes de o
  candidato ver o que vai entrar.
- **Um registro do que ficou de fora.** O que ela descartou fica escrito, com o
  motivo. Descarte silencioso é indistinguível de falha.

**E o que ela não é:** ela não responde ninguém, não manda nada e não abre
conversa. Ela **só lê** o conector, em todos os modos, sem exceção.

## 2 · Antes de tudo

1. `~/busca/INDICE.md`. Não existe: **pare** e mande rodar
   `/vagas:comecar`. Esta skill enche uma busca; ela não monta uma.
2. A linha `modo:` e a linha `WhatsApp:`.
3. `references/contrato/07-0-a-conversa-entra.md` — **inteira, antes do primeiro
   passo**. É ela que governa os dois caminhos, os dois formatos de exportação,
   o pré-voo e a ordem de gravação. Este arquivo não a repete: acrescenta o que
   é da importação em volume.
4. `references/contrato/04-7-o-bruto.md`, para o cabeçalho de três linhas.
5. `references/contrato/03-0-as-tres-regras.md` — a regra 2 é o produto aqui.
6. `references/contrato/10-0-comeca-e-termina.md` — **leia o fecho, e leia por
   inteiro**. Esta skill termina sem gravar nada com frequência (sem conector,
   sem consentimento, sem conversa que passe na triagem), e é exatamente aí que
   se inventa um título. `## Não gravei nada` e `## Nada foi guardado` estão
   nomeados no contrato como ERRADOS: o título é `## Guardei`, sempre, com uma
   linha dizendo que nada foi gravado e por quê.

   **Medido nesta skill, na primeira prova:** ela fez tudo certo — descobriu a
   busca cheia, leu a linha do conector, parou no pré-voo, pediu o
   consentimento e não gravou nada — e reprovou por escrever `## Não gravei
   nada`. O contrato prevê esse erro pelo nome, e ela não o tinha por perto.

**O pré-voo é obrigatório e é a primeira chamada ao conector:**
`estado_da_ponte`. Ponte parada devolve um retrato do passado com cara de
presente, e uma importação inteira sobre isso enche a busca de um estado que
não existe mais. A tabela dos três estados está no contrato §7; siga-a.

**É um TODO**, e dos grandes: listar, triar, mostrar, gravar.

## 3 · O modo

`copiloto` — mostra a prévia e **espera**. Grava só o que for confirmado.

`automatico` — grava o que passou na triagem **sem perguntar caso a caso**, e
declara em `## Decidi sozinho` quantas conversas entraram, quantas ficaram de
fora e por qual regra. **A prévia continua saindo**, antes da gravação: ela é o
registro do que foi decidido, não um pedido de permissão.

**A exceção, e ela vale nos dois modos:** conversa que a triagem marcou como
**pessoal** nunca entra em automático. Ela vai para a lista do que ficou de
fora, e só entra se o candidato disser o nome dela. Automático é para
volume, não para julgar a vida de alguém.

## 4 · O passo a passo

### Passo 1 · Listar sem ler

Peça a lista de conversas ao conector — **nomes e datas, não conteúdo**. É aqui
que a economia acontece: ler o histórico inteiro de tudo para depois descartar é
lento, caro, e faz a skill passar por dentro de conversa que ela não deveria
abrir.

Se a lista for grande, ela diz o tamanho e propõe um recorte antes de seguir:
os últimos doze meses, ou os que trocaram mensagem depois de tal data.

### Passo 2 · A triagem, e ela recusa por padrão

**Esta é a seção mais importante da skill.** Ler o histórico de WhatsApp de
alguém é ler tudo — família, saúde, dinheiro, briga. A regra é uma:

> **Entra o que tem sinal do ofício. Todo o resto fica de fora, e o de fora é
> registrado como "não abri".**

Três grupos, e o terceiro é o que exige julgamento:

**Entra** — a conversa cujo nome bate com um contato que já está na busca; a
que tem, no que já se sabe dela, palavra do ofício; a que o candidato
nomear.

**Não entra, e não se abre** — grupo com muita gente, lista de transmissão,
número que é serviço automático (banco, entrega, código de verificação), e
conversa cujo nome é de contato marcado como família. Ela **não lê o conteúdo**
para decidir isso: decide pelo que a lista já diz.

**Na dúvida, pergunta pelo NOME e não pelo conteúdo** — em copiloto, uma lista
única no fim: "estas 14 eu não soube dizer; quais são de trabalho?". Em
automático, ficam de fora e aparecem no relatório. **Nunca abrir para decidir**
é o ponto: a decisão de ler vem antes da leitura, sempre.

### Passo 3 · Ler o que passou, e só isso

Para cada conversa aprovada, leia o período que interessa — não a conversa
inteira desde 2019, salvo se o candidato pedir. O padrão é **doze meses**,
e ela declara o padrão que usou.

Ao ler, valem as regras do contrato §7 sem nenhuma mudança: quem é o
candidato na conversa, as datas em dd/mm/aaaa, e **o que não se lê não se
inventa** — `<Mídia oculta>` e mensagem apagada viram buraco declarado.

**Áudio antigo quase nunca tem transcrição, e isso não é defeito.** A ponte
guarda o som do que chegou depois que ela subiu; o que é anterior a ela ficou
só com o rótulo. Num histórico de doze meses, os áudios das últimas semanas
vêm com `[áudio 0:42 · transcrição]` e os de meses atrás vêm sem — conte os
sem transcrição como buraco e escreva a razão **uma vez** no relatório. O
candidato vai reparar na diferença, e ela tem explicação.

Num histórico longo os buracos são muitos. **Não vire uma pergunta cada um**:
conte-os por conversa e traga o total no relatório. Só vira pergunta o buraco
que está no meio de um fato que entrou.

### Passo 4 · A prévia, antes de gravar

Mostre o que vai entrar **antes de escrever qualquer arquivo**:

- quantas conversas foram lidas, e quantas ficaram de fora, por qual regra
- quem entra na busca e quem já estava lá, pelo nome
- que campos vão ser preenchidos, com o valor e a procedência
- que vagas foram MENCIONADOS mas não entram (§7 do contrato: vaga sem link
  nem ficha não entra)
- quanto vai para `_bruto/`, em número de arquivos
- que `etapa:` muda, em que arquivo da vaga, e por qual conversa — e que
  andamento ficou SEM destino, porque a conversa não diz de que vaga fala

**Nada de mensagem inteira na prévia.** A prévia mostra o FATO extraído e a data
de onde ele veio, não o texto da conversa. O texto vai para `_bruto/`, que é
onde ele mora — pôr trechos na tela transforma a prévia num despejo do histórico
de alguém dentro do chat.

### Passo 5 · Gravar, na ordem do contrato

A ordem é a do §7, e ela não muda por ser em volume: **bruto primeiro**, depois
os fatos nos arquivos donos, depois as vistas, depois `## Guardei`.

Duas coisas que só aparecem no volume:

- **Um arquivo de bruto por conversa e por período**, nunca um arquivo gigante
  com tudo. O nome segue o §4.7.
- **Se der errado no meio, o que já entrou fica.** Ela relata onde parou e o que
  falta, e a próxima execução continua — importação que desfaz tudo ao falhar
  faz o candidato perder uma hora e a confiança junto.

**E uma terceira, porque aqui a etapa é da vaga e a conversa é com gente:**

- **O fato de quem falou vai para o arquivo de quem falou** — nome, canal, o
  que foi combinado —, e esse arquivo **não tem `etapa:`**, nem o que nasce
  agora.
- **O andamento vai para a vaga.** Se a conversa mostra que a coisa andou —
  com as palavras dela, não por dedução (§7) —, o `etapa:` que muda é o do
  arquivo da vaga que nomeia essa pessoa em `contato`.
- **Sem vaga para receber, nada se inventa.** Ninguém nomeia essa pessoa,
  mais de um arquivo a nomeia e a conversa não diz de qual se fala, ou ela
  fala de uma vaga que não está na busca: a pessoa entra, etapa nenhuma
  muda, e o andamento vira linha em `## Falta saber` — com a data da conversa
  e o que ela disse. Em volume isto acontece muito, e é o resultado certo.

### Passo 6 · Escrever o que leu, e o que não leu

No `INDICE.md`, uma linha de registro: a data da importação, o período coberto,
quantas conversas entraram e quantas ficaram de fora.

Isso não é burocracia — é o que impede a segunda execução de reabrir tudo, e é o
que responde à única pergunta que o candidato vai fazer depois:
**"você leu as minhas conversas?"** A resposta precisa estar escrita, na
busca dele, com data.

## 5 · O que perguntar, e como

**Uma pergunta antes de tudo, e ela nunca é pulada:**

> "Vou ler o seu histórico do WhatsApp para encher a busca. Eu abro só as
> conversas que parecem de trabalho e escrevo aqui o que li e o que não li.
> Posso começar?"

Ela é feita **uma vez**, na primeira importação, e a resposta fica no
`INDICE.md`. Não é formalidade: é a diferença entre uma ferramenta que o
candidato instalou e uma que leu o telefone dele sem avisar.

Depois disso, no máximo duas: o recorte de período (se a lista for grande) e a
lista única de conversas indecididas (Passo 2). **Nunca uma pergunta por
conversa** — trinta perguntas em fila fazem qualquer pessoa responder "sim" para
todas sem ler.

## 6 · O formato da saída

O trabalho é o relatório do que entrou. **Não há bloco para colar** — nada aqui
sai para outra pessoa.

````markdown
# Importei do WhatsApp — 2026-09-09

**37 conversas na lista · 12 lidas · 25 não abertas · 8 contatos entraram.**
Período: os últimos 12 meses (padrão).

## Entraram — 8 contatos, mais 4 que já existiam e foram atualizadas

- P-005 (Helena Prates) — entrou agora · papel, empresa, última conversa em 12/08
- … uma linha por pessoa, com os campos e nada do texto

## Mencionaram vagas que não entraram — 3

- uma conversa cita uma vaga que não está na busca e não tem link
  → mande o link, ou ele não entra (contrato §7)

## Não abri — 25

- 9 grupos e listas de transmissão
- 7 serviços automáticos (banco, entrega, verificação)
- 5 contatos de família
- 4 que eu não soube dizer — os nomes estão abaixo, me diga quais são de trabalho

## Buracos no que li — 23

- 18 áudios sem transcrição (anteriores à ponte), 4 mídias ocultas, 1 apagada
- 2 estão no meio de um fato que entrou, e viraram `?`

## Guardei
- ~/busca/_bruto/ — 12 arquivos, um por conversa
- ~/busca/contatos/ — 8 criados, 4 atualizados
- ~/busca/INDICE.md — a linha do que li e do que não li

## Falta saber
- o que o áudio de 12/08 dizia — está no meio do que foi combinado
````

## 7 · Onde ela para

**Ela nunca manda mensagem.** Em nenhum modo, por nenhum motivo. Ela usa o
conector só para ler, e a razão é de confiança: a skill que entra no histórico
inteiro de alguém não é a mesma que pode escrever em nome dele. Quem escreve tem
nome próprio, e sempre com prévia (contrato §7.1).

**Ela não abre conversa para decidir se deve abrir.** A triagem é pelo nome e
pelo que a lista já diz. Abrir "só para ver se é de trabalho" é exatamente o que
ela existe para não fazer, e não haveria como desfazer.

**Ela não deduz fato de conversa.** Vale o §7 inteiro: "dá sábado, mas cedo" é o
que foi combinado, não uma etapa nova. Em volume a tentação é maior, porque
trinta conversas parecem um padrão — e padrão não é procedência.

**Ela não cria vaga que a conversa menciona.** Sem link nem ficha, ele não
entra. Faixa dita em conversa de março é o pior dado possível: parece apurado,
tem data, e está errado.

**Ela não apaga nada do WhatsApp e não muda nada lá.** O que ela faz é copiar
para a busca. Se o candidato quiser que algo saia da busca depois,
quem tira é ele ou `/vagas:organizar-busca` — e o `_bruto/` tem prazo de
expurgo, que é do contrato e não desta skill.
