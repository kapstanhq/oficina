---
name: comecar
description: >-
  A primeira skill do pack, a que todas as outras pressupõem: monta a {base}
  do {profissional} do zero, no computador ou no Google Drive — as pastas, os
  arquivos do padrão, o nome dele e o modo —, um passo por vez, todo passo
  pulável, e retoma de onde parou se ele fechar no meio.
[[se comecar-roteiro:conexoes]]
  Liga Google Agenda, Gmail e Drive explicando cada botão e TESTANDO antes de
  escrever “sim”, ensina a trazer conversa do WhatsApp, e termina com a {base}
  cheia: {um-item} de verdade, vindo de um link — ou a planilha inteira, em
  CSV —, e {um-pessoa}, vindo de uma conversa colada.
[[fim]]
[[se comecar-roteiro:perfil]]
  {comecar-descricao}
[[fim]]
  Use na primeira vez, e quando ele disser “instalei, e agora”, “como eu
  começo”, “configura isso pra mim”, “não tenho {base} nenhuma”, “parei no
  meio da configuração”, “mudei de computador” — e sempre que outra skill
  disser que não achou o INDICE.md da {base}.
[[se comecar-roteiro:conexoes]]
  Também “importa minha planilha”, “quero ligar minha agenda”, “pulei o Gmail
  e quero ligar agora”.
[[fim]]
license: MIT
compatibility: >-
  Precisa de um lugar para montar a {base}: uma pasta do computador, com
  ferramenta de arquivo, ou o Google Drive pelo conector. Sem nenhum dos dois —
  chat na web — ela não funciona, e diz isso em uma linha. Os conectores são
  opcionais; o que não se ligar fica anotado.
allowed-tools: Read Glob Grep Write Edit
---

# Começar

## 1 · O que ela faz, e o que ela não faz

Ela monta a {base} no lugar que ele escolher no passo 1 — uma pasta no
computador ou a pasta `{pasta-base}` no Google Drive — com os arquivos do
padrão, o nome dele e o modo.
[[se comecar-roteiro:conexoes]]
E a entrega **cheia**: o que dá para conectar conectado e testado, e dentro
dela {um-item} e {um-pessoa} de verdade — não exemplos.
[[fim]]
[[se comecar-roteiro:perfil]]
{comecar-o-que-entrega}
[[fim]]

**Ela não pede argumento.** Rodar sem nada é o normal: ela pergunta o que
precisa, um passo por vez. Com a {base} já montada, ou com “continuar”, é
retomada — seção 4.

Ela **executa o que dá e só pede o que só ele pode fazer.** Criar pasta, copiar
modelo, ler link, extrair fato de uma conversa colada: é com ela. Autorizar uma
conta no navegador, com a conta dele: é com ele — ela explica os passos com o
nome de cada botão e **espera**.

Ela não escreve {exemplo-trabalho}, não escreve mensagem para {pessoa} nenhum,
não lê {documento-chave}, não instala nada e não mexe em configuração do Claude
Code. E **nenhum passo dela pede senha**: autorização acontece na tela do
serviço, no navegador dele, e ela não vê nada disso.

**Por que ela tem `Write` e `Edit`.** É a skill que cria a {base}: os arquivos
novos a partir de `references/modelos/` (`Write`) e as linhas que ela preenche
depois — `## Quem sou`, `## Quanto tem`, `## O que está conectado`, as vistas
(`Edit`). **`Write` só em arquivo que não existe.** Sobrescrever é o único
jeito de esta skill fazer estrago, e o estrago seria a {base} inteira.

No `drive` os verbos são os mesmos e as ferramentas são as do conector, pela
tabela de equivalência do contrato §1. Uma diferença muda o que ela faz:
**atualizar reescreve o arquivo inteiro**, então leia antes de atualizar,
sempre — e devolva o texto inteiro com a sua mudança dentro.

---

## 2 · Antes de tudo

Leia, nesta ordem:

1. **O contrato, por seção** — o inteiro custa vinte a trinta mil tokens antes
   da primeira pergunta. Em `references/contrato/`: `01-0-onde-a-{pasta-base}-mora.md`
   (os dois transportes), `02-0-id-e-apelido.md`, `03-0-as-tres-regras.md`
   (procedência é a que mais aparece aqui), `04-0-os-formatos.md` e os que o
   seguem, de `04-1-indice.md` a `04-7-o-bruto.md` (os gabaritos, e o que
   fazer com os comentários dos modelos), `05-0-os-dois-modos.md`,
   `07-0-a-conversa-entra.md`, `07-1-a-mensagem-sai.md`,
   `08-0-quando-perguntar.md` e `10-0-comeca-e-termina.md`. Divergiu, o
   contrato vence.

2. **`references/modelos/`** — o que vai para a {base} é o que está neles, sem
   invenção.

3. **O `INDICE.md` da {base}, se já existir.** Primeira leitura do contrato §1:
   procure no computador, e depois a pasta `{pasta-base}` no Drive. **Achou? Ela
   não sobrescreve nada:** é retomada (seção 4). Achou nos dois lugares: mostre
   as duas, com o lugar de cada uma, e pergunte qual fica — **não funde**.

**No `local`, a pasta pessoal.** O harness diz o diretório de trabalho e o
sistema; dele sai o começo do caminho — `C:\Users\<nome>` no Windows,
`/Users/<nome>` no Mac, `/home/<nome>` no Linux. **Toda chamada de ferramenta
usa caminho absoluto.** Ao falar com ele, escreva `~/{pasta-base}/…`.

**No `drive` não existe caminho.** Pasta é um item com id, e `/{pasta-base}` é
o nome da pasta na raiz do Drive dele. Guarde o id de cada pasta que criar ou
abrir, e **prenda toda busca à pasta** — `_indice.md` existe duas vezes, e o
nome solto devolve os dois. Ao falar com ele: “a pasta `{pasta-base}` do seu
Drive”. Neste arquivo, `~/{pasta-base}/…` é o modo curto de nomear o lugar,
qualquer que seja o transporte.

---

## 3 · O TODO, na tela desde o primeiro passo

Mostre o TODO **antes da primeira pergunta**. Ele mostra que a configuração
acaba, e onde ela está enquanto demora — demorar sem mostrar é onde o leigo
acha que travou.

[[se comecar-roteiro:conexoes]]
```
1  onde fica a {base}, e quem é você
2  o modo: copiloto ou automático
3  a agenda
4  e-mail e Drive          opcionais
5  as conversas do WhatsApp
6  {o-primeiro-item}, ou a planilha inteira
7  {o-primeiro-pessoa}
8  o que pedir agora
```
[[fim]]
[[se comecar-roteiro:perfil]]
```
1  onde fica a {base}, e o seu nome
2  como te encontram        {comecar-campos-curto}
3  {comecar-passo-3}
4  as primeiras {itens}       /{plugin}:{skill-do-dia-vazio}
5  qual delas vale          /{plugin}:{skill-de-julgar}
```

Os passos 3 a 5 são de outras skills; esta faz o 1 e o 2 e passa a vez.
[[fim]]

**Grave ao fim de cada passo, não no fim de tudo.** O que está gravado é o que
sobrevive a ele fechar a janela — e é o que a retomada vai ler.

---

## 4 · Retomar: onde está escrito até onde foi

Nenhum campo guarda o progresso: **ele é derivável do que está gravado**
(regra 1), e um `passo: 4` no `INDICE.md` mentiria no dia em que ele mexesse na
{base} à mão.

| passo | está pronto quando, na {base} |
|---|---|
| 1 | o `INDICE.md` existe, com a linha `{pasta-base}:`, e o título tem o nome dele |
[[se comecar-roteiro:conexoes]]
| 2 | a linha `modo:` vale `copiloto` ou `automatico` |
| 3 | `Google Agenda:` tem `sim  ← testado <data>`, **ou** há linha de agenda em `## Pulado no começo` |
| 4 | o mesmo para `Gmail:` e `Google Drive:` |
| 5 | há qualquer arquivo em `_bruto/`, **ou** há linha em `## Pulado no começo` |
| 6 | a tabela de `{pasta-itens}/_indice.md` tem ao menos uma linha |
| 7 | a tabela de `{pasta-pessoas}/_indice.md` tem ao menos uma linha |
| 8 | não grava nada — sempre acontece |
[[fim]]
[[se comecar-roteiro:perfil]]
| 2 | `## Quem sou` tem ao menos um contato, **ou** há linha do passo 2 em `## Pulado no começo` |
| 3 | `perfil.md` existe na raiz da {base} |
| 4 | a tabela de `{pasta-itens}/_indice.md` tem ao menos uma linha |
| 5 | algum {item} saiu de `{etapa-inicial}` |
[[fim]]

Retomando, três coisas e nada mais: diga em uma linha o que já está pronto, vá
para o primeiro passo que falta, e **não refaça o que já está**. Perguntar de
novo o que ele já respondeu é o defeito mais caro do pack. Ele pulou um passo e
agora o quer? Rode só ele.

---

## 5 · Como ela pergunta · O modo

O contrato põe teto de **três perguntas** numa execução. **Esta skill é a
exceção, e a exceção não é licença:** ela É o questionário. O que substitui o
teto é mais estrito que ele:

- **uma pergunta por passo.** O passo fecha, grava, e só então vem a próxima.
  Oito campos numa tela é o formulário que o contrato proíbe, também dividido
  em duas telas seguidas.
- **todo passo é pulável**, e o pulado vira linha em `## Pulado no começo` com a
  data. Nunca insista: a oferta volta na skill em que aquilo faz falta.
- **escolha entre dois e quatro caminhos usa a UI de perguntas** do harness —
  botões, não prosa —, rótulo de até quatro palavras e **o custo escrito em
  cada opção**. A descrição declara o custo; não vende a opção.
- **toda pergunta traz o motivo na mesma frase.** É o que faz ele responder em
  vez de fugir.

**O modo não muda nada aqui.** O que falta nesta skill só ele sabe — onde ficam
os arquivos, o nome dele, qual conta. Automático não inventa nenhuma dessas.

**A permissão aparece MAIS nesta skill que em qualquer outra.** O
`allowed-tools` dispensa a pergunta só no turno em que a skill é chamada; da
segunda resposta em diante, até gravar arquivo volta a pedir autorização. Diga
uma vez, quando a primeira aparecer, que é assim que o programa mostra o que
está sendo feito, e que aprovar é rápido. **Não** peça que ele desligue as
perguntas — ver a {base} sendo escrita na primeira vez é o que constrói a
confiança que as outras skills vão gastar.

---

## 6 · Os passos

### Passo 1 · Onde fica a {base}, e quem é você

**Primeiro, o lugar.** O transporte se escolhe aqui, uma vez, com o caminho que
você achou já preenchido:

```
Onde eu monto a sua {base}?

  No computador       C:\Users\{exemplo-usuario}\{pasta-base} · abre em qualquer
                      editor, e é onde as outras skills procuram sozinhas
  No Google Drive     a pasta {pasta-base} no seu Drive · funciona também no chat
                      do navegador, e precisa do conector do Drive ligado
  Outro lugar         você me diz onde · funciona, mas toda skill vai precisar
                      que você diga onde é
```

Já existe `INDICE.md` lá? **Pare e vá para a seção 4.**

Não existe: crie estes, pelos gabaritos da seção 4 do contrato —

```
modelos/INDICE.md            → ~/{pasta-base}/INDICE.md
modelos/hoje.md              → ~/{pasta-base}/hoje.md
modelos/funil.md             → ~/{pasta-base}/funil.md
modelos/_indice-{pasta-itens}.md   → ~/{pasta-base}/{pasta-itens}/_indice.md
modelos/_indice-{pasta-pessoas}.md  → ~/{pasta-base}/{pasta-pessoas}/_indice.md
```

Os outros modelos viram arquivo depois, pela skill que os escreve, um por item.
**Os comentários `<!-- MODELO · … -->` saem — todos**, e o `<AAAA-MM-DD>` dos
títulos vira a data de hoje, agora: arquivo que chega a ele com o próprio
manual dentro parece arquivo pela metade. **A linha `envio:` sai junto**: ela
só existe onde há conector de mensagem (contrato §7.1), e quem a escreve é o
degrau que prova o envio.

**A primeira linha do `INDICE.md` é a do transporte**, antes de `modo:` —
`{pasta-base}: local · C:\Users\{exemplo-usuario}\{pasta-base}` ou
`{pasta-base}: drive · /{pasta-base}`. É ela que as outras skills leem para
saber por onde ler e gravar. **No `drive`, a {base} que abriu é o teste do
Drive**: grave `Google Drive: sim  ← testado <data>`.

**Pasta vazia não se cria com `Write`**: `_bruto/`, `arquivo-morto/` e as que
só enchem depois nascem quando o primeiro arquivo cai nelas. Diga isso em uma
linha, senão ele abre a {base}, não as vê, e acha que faltou.

**A prova.** Mostre a lista na tela, com o lugar de verdade: no `local`, um
`Glob` em `~/{pasta-base}/**/*.md`; no `drive`, a pasta e as de dentro, pelo
conector. Dizer que criou não é mostrar criado.

**Depois, o nome.** Uma pergunta, com o motivo dentro:

> Qual é o seu nome, do jeito que você assina? Vai em tudo que eu escrever por
> você, e é por ele que eu sei quem é você numa conversa colada.

É a única coisa obrigatória do passo. Escreva `nome:` e o título
`# {Base} de <nome>`, e feche gravando `atualizado:` com a data de hoje.
[[se comecar-roteiro:conexoes]]

**Depois, o resto da identidade — uma pergunta só, em texto livre, pulável:**

> Me diga o que souber de cabeça: {registro-do-oficio}, {sistema-do-oficio},
> {terceira-da-identidade} e o seu telefone. Serve para o {exemplo-trabalho} e
> para a assinatura de e-mail. Pode pular.

`assinatura de e-mail:` **não se pergunta** — deriva do que ele disse (regra
1). O que ele não disser fica em branco e volta quando fizer falta.

### Passo 2 · O modo

```
Como você quer que eu trabalhe?

  Copiloto      eu paro nas escolhas e pergunto · você decide tudo, e cada
                tarefa demora um pouco mais
  Automático    eu escolho e, no fim, digo o que escolhi e como desfazer ·
                mais rápido, e de vez em quando eu vou escolher diferente
                de você
```

Sugira **copiloto**: trocar a palavra no `INDICE.md` depois de ver a skill
trabalhar é escolha melhor que trocar antes. Grave `modo: copiloto` ou
`modo: automatico`, diga que automático vale da **próxima** skill em diante, e
a exceção escrita: **`/{plugin}:{skill-conferir}` nunca decide sozinha** —
{quem-conclui}.

### Passo 3 · A agenda

**Antes de mandar conectar, olhe se já está conectado:** a ferramenta de agenda
do Google aparece como `list_calendars`, `list_events` ou `search_events`.
Está lá? **Vá direto para o teste.** Não está: os passos, e **espere**:

```
No Claude Code:
  1. digite  /mcp  e aperte Enter
  2. na lista, ache “Google Calendar”
  3. escolha “Authenticate” (em algumas versões, “Connect”)
  4. abre uma aba na tela do Google — escolha a conta que você usa para
     trabalhar
  5. role a tela de permissões até o fim e clique em “Continuar”
  6. volte para cá

No Claude do navegador ou no Desktop:
  Configurações → Conectores → “Google Calendar” → “Conectar”, e a mesma tela
  do Google.
```

Rótulo diferente do escrito? É o botão do lado direito da linha do Google
Calendar — diga isso. Feche com a espera, literal: **“Me diga ‘pronto’ quando
voltar, ou ‘pula’ se preferir deixar para depois.”**

**O teste são duas chamadas, com dois papéis:**

```
list_calendars              a prova para mim · conta conectada devolve ao
                            menos uma agenda. Erro ou lista vazia = não colou
list_events, esta semana    a prova para ELE · até três compromissos com dia
                            e hora, para ele reconhecer os próprios
```

Avise antes: a agenda não está em `allowed-tools`, e a primeira chamada pede
permissão — é bom que peça.

- **Voltou a semana dele.** Mostre os três e o nome da agenda. Grave
  `Google Agenda: sim  ← testado <data>`.
- **Voltou a agenda, e a semana está vazia.** É passe: conexão que não abriu dá
  **erro**, não vazio. Mostre o nome da agenda para ele conferir a conta.
- **Deu erro, ou os compromissos não são dele.** Conta trocada é o caso comum.
  Ofereça refazer com a outra conta **uma vez**; não deu: `Google Agenda: não`
  e uma linha em `## Pulado no começo`.

**Nunca escreva `sim` sem o teste.** “Conectado” sem prova é o erro que aparece
três dias depois, e aí ele não está configurando nada:
{consequencia-de-conexao-sem-prova}. Pulou ou falhou: diga em uma linha
{comecar--a-agenda-volta}. E diga como se desfaz — tirar o acesso é um
caminho curto, e está em `references/conectores.md`.

### Passo 4 · E-mail e Drive

Opcionais, mesma mecânica do passo 3. **A {base} está no Drive?** O Drive já
está testado (passo 1): pergunte só do Gmail. **Uma pergunta para os dois**:

```
Quer ligar mais alguma coisa agora?

  Gmail e Drive     {de-onde-vem-o-email}, e os documentos que você já
                    guarda no Drive · uns dois minutos, a mesma tela do Google
  Só o Gmail        se você fala com {pessoa} por e-mail
  Nenhum agora      eu anoto, e qualquer skill oferece de novo quando precisar
```

O caminho é o do passo 3, trocando o nome do conector. O teste:

```
Gmail    list_labels                          a prova para mim
         search_threads, newer_than:7d        três assuntos da semana, para ele
Drive    list_recent_files                    três nomes de arquivo, para ele
```

Diga a verdade sobre o Gmail em uma linha: **esta skill só lê, para testar.**
As que escrevem mensagem podem deixar o rascunho na caixa dele ou enviar — e
cada envio passa pela tela dele antes, com o destinatário e o texto inteiro
(contrato §7.1).

### Passo 5 · As conversas do WhatsApp

Comece pela verdade: **aqui a conversa entra colada**, e a API oficial do
WhatsApp é para número de empresa — ele atende do pessoal. Dois caminhos, **o
mais barato primeiro**:

```
Copiar e colar        abre a conversa (no celular ou no WhatsApp Web),
                      seleciona as últimas mensagens, cola aqui. É o que você
                      vai fazer quase sempre

Exportar              a conversa inteira, com data e hora em toda linha. É do
                      celular — o WhatsApp Web não exporta

iPhone    abra a conversa → toque no NOME DO CONTATO, no alto → role até o
          fim → “Exportar conversa” → “Sem mídia”
Android   abra a conversa → ⋮ (canto de cima à direita) → “Mais” →
          “Exportar conversa” → “Sem mídia”
```

**“Sem mídia”, sempre** — com mídia sai pesado, e as fotos não entram na {base}.
Sai um `.txt`: mande para você mesmo por e-mail ou Drive, abra, cole aqui. **Ele
não grava nada à mão:** a skill grava em `_bruto/AAAA-MM-DD-whatsapp-<apelido>.md`
— a data é a da conversa. `_bruto/` é a origem: nada lá se corrige nem se apaga.

`WhatsApp:` nasce `não`, e para quase todo mundo fica assim: colar não é
conexão que falhou, é como a coisa funciona.

**Há um caminho opcional, e não é para todos.** Só vale se ESTE programa roda
comandos no computador dele — Claude Code, Codex CLI, Cursor. É um conector que
lê as conversas direto **e manda a resposta pelo WhatsApp dele — uma por vez,
com o texto inteiro e o nome de quem recebe na tela antes.** Custa uns quinze
minutos, ocupa uma das quatro vagas de dispositivo conectado, e não é programa
oficial da Meta. **Ofereça em duas linhas e não venda**: existe, colar continua
igual, agora, depois ou não? Os avisos do envio são da cadeia, não da oferta.
Quis: siga `references/conectar-whatsapp.md` — o `references/vocabulario.txt`
ao lado é o que o degrau 7.5 instala. Com a ponte ligada, ofereça em uma linha
`/{plugin}:importar-a-conversa`, que lê o histórico e enche a {base} de uma vez.

**O resto do que se liga mora num lugar só.** Se as ferramentas `conectores_*`
existem nesta sessão, chame `conectores_estado` UMA vez e leia
`references/conectores.md`: mostre a lista como veio — o que é, como está, o
que custa —, diga **uma vez** que quem liga é ele, e não ligue nada por ele. O
que ele ligar entra em `## O que está conectado` com a data do teste; o que não
quiser, em `## Pulado no começo`. Sem as ferramentas, não mencione.

### Passo 6 · {O-primeiro-item}, ou a planilha inteira

A pergunta abre com os dois caminhos, com o custo em cada um:

```
{comecar--o-primeiro-item}
```

#### O link

> Me manda o link de {um-item} seu. Qualquer um que esteja no ar. É com ele que
> eu monto a primeira ficha, e você vê como a {base} fica.

Abrir o link é com a ferramenta de web, que **não** está em `allowed-tools` —
avise que ela pede permissão.

```
o link abriu             siga
o link voltou nada,      site que só monta a página por JavaScript devolve
ou só menu e rodapé      vazio. Diga na cara — “esse site não abre para mim” —
                         e peça a ficha colada. NÃO chute dado de {item}
ele não tem link         ele digita o básico: {basico-do-item}.
                         Todo o resto entra ?
```

Depois, nesta ordem:

1. **O id e o apelido antes do bruto** — o cabeçalho do bruto leva `sobre:`.
   {Base} nova: {o-primeiro-id}; o apelido é {formato-do-apelido}:
   `{exemplo-item-novo}`.
2. **O bruto**, com o cabeçalho de três linhas do contrato §4.7 e o que veio,
   sem tocar.
3. **O arquivo {do-item}** pelo gabarito de `modelos/{modelo-item}`, cada campo
   com procedência — `← link, <data>` ou `← ficha colada, <data>`. O que não
   veio entra `?`.
4. **Uma linha** em `{pasta-itens}/_indice.md`, e o `## Quanto tem` recontado.

#### A planilha

**O formato é CSV:**

```
Excel           Arquivo → Salvar como → em “Tipo”, escolha “CSV UTF-8”
Google Sheets   Arquivo → Fazer download → “Valores separados por vírgula (.csv)”
```

Veio `.xlsx`? Peça o CSV **uma vez** — não há conversor aqui. Linhas coladas na
conversa valem como CSV colado.

1. **O bruto primeiro, e inteiro**, em `_bruto/AAAA-MM-DD-planilha-<nome-curto>.csv`,
   **sem o cabeçalho de três linhas** — `.csv` com texto em cima deixa de ser
   `.csv`. **É daqui que sai toda procedência**: `← _bruto/<o csv>`.
2. **Mapeie as colunas** para os campos do gabarito (contrato §4.4):
   {campos-do-item-em-linha}. Cabeçalho óbvio se mapeia sozinho —
   {exemplos-de-cabecalho}. Mostre o mapeamento inteiro **antes de gravar**:

   ```
   Li 18 linhas da sua planilha. É isto?

   {mapa-de-colunas}
   ficam de fora: {colunas-que-ficam-de-fora}

     Está certo         eu gravo as 18 fichas agora
     Mudo uma coluna    você diz qual, e eu mostro de novo antes de gravar
   ```

   Coluna sem campo no gabarito **não cria campo** (regra zero): descrição vai
   para {secao-descricao-do-item}; o resto fica de fora, e a resposta diz
   quais. `estado:` só recebe um dos valores do §4.4: {estado-da-planilha}, e
   o que não casar entra `?`.
3. **Uma ficha por linha**, cada campo com `← _bruto/<o csv>`. Id sequencial —
   `{exemplo-id-novo}`, `{exemplo-id-novo-2}`… —, e {o-prefixo-e-o-apelido}
   Linha vazia não vira ficha; repetida não vira duas.
4. **Uma linha por {item}** em `{pasta-itens}/_indice.md`, o `## Quanto tem`
   recontado, e em cada ficha no `## Histórico`:
   `- AAAA-MM-DD entrou na {base}  ← _bruto/<o csv>`.

**Teto: 200 linhas por vez.** Passou, pergunte se importa tudo ou só as
{filtro-da-planilha}. Na tela, **a primeira ficha inteira e a contagem do
resto**.

#### Nos dois caminhos

**Mostre a ficha inteira — a única, ou a primeira — e diga onde ela ficou.** É
aqui que ele entende o que comprou: texto, dele, que vai junto se ele trocar de
{sistema-do-oficio}. Aponte o `?` — “o {campo-que-falta} eu não tenho,
{por-que-ele-falta}”; na planilha, uma linha só para o que se repete — e diga
que o **{exemplo-trabalho}** é de `/{plugin}:{skill-anunciar}`.

**Se ele quiser pular**, diga o custo em uma linha: {base} vazia não faz
ninguém voltar. Insistiu: anote em `## Pulado no começo` e siga.

### Passo 7 · {O-primeiro-pessoa}

Peça **uma conversa colada** — a do passo 5, se ele já trouxe:

> Cola aqui uma conversa sua com {um-pessoa}. As últimas mensagens bastam. Eu
> guardo o original e tiro dela a ficha.

Contrato §7, sem atalho:

1. **O bruto primeiro**, em `_bruto/AAAA-MM-DD-whatsapp-<apelido>.md` — se algo
   der errado no meio, o material já está salvo.
2. **Os fatos** para o arquivo {do-pessoa} — `{exemplo-id-pessoa-novo}` numa
   {base} nova —, cada campo com `← _bruto/<arquivo>`. Fato é o que está
   escrito: “dá sábado, mas cedo” é `## Combinado`, não
   “{exemplo-etapa-deduzida}”.
3. **As vistas**: uma linha em `{pasta-pessoas}/_indice.md`, uma no `funil.md`
   na etapa que a conversa mostrar (na dúvida, `{etapa-inicial}`), e o
   `## Quanto tem`.
4. **Diga onde guardou**, no `## Guardei`.

- **Quem é ele na conversa** é o remetente que bate com `nome:`. Não bateu:
  pergunte uma vez — “Nessa conversa, qual dos dois é você?”. Nunca deduza
  pelo tom.
- **Buraco é buraco.** `<Mídia oculta>`, mensagem apagada e figurinha viram
  linha declarada ou pergunta. Áudio colado vira pergunta; pelo conector ele já
  vem transcrito.
- **Se a conversa fala {do-item} do passo 6, ligue os dois** — uma linha em
  `{secao-itens-mostrados}` {no-pessoa} e uma em `{secao-mostrado-a}`
  {no-item}, e mostre as duas na tela.

Sem conversa à mão? Ele digita o básico — nome, telefone, o que procura — e o
resto entra `?`. A resposta ao {jargao-minusculo} é de `/{plugin}:{skill-atender}`.

### Passo 8 · O que pedir agora

**Três coisas que ele pode digitar hoje**, com o id e o apelido de verdade:

```
{comecar--o-que-pedir-agora}
```

E a lista inteira: veja a seção 7, “A lista de comandos”. Ele já tem material
de antes — planilha, agenda de papel, conversas? Uma linha: ponha em `_bruto/`
e rode `/{plugin}:organizar-{pasta-base}`, que transforma em ficha.
[[fim]]
[[se comecar-roteiro:perfil]]

O modo nasce `copiloto` — eu paro nas escolhas e pergunto. Diga isso em uma
linha, e que trocar é mudar a palavra `modo:` no `INDICE.md`; não pergunte.

### Passo 2 · Como te encontram

Uma pergunta, em texto livre, com o motivo dentro:

> {comecar-pergunta-contato}

Cada resposta vai para a linha dela em `## Quem sou`, como ele escreveu. O que
ele não quiser dar fica em branco, e a skill que precisar pergunta de novo.
`assinatura de e-mail:` **não se pergunta** — deriva do que ele disse (regra
1). Pulou o passo inteiro: uma linha em `## Pulado no começo`.

**Conexão não entra aqui.** Agenda, e-mail, Drive, WhatsApp e o login em site
são oferecidos pela skill que precisar deles, no dia — cada um com o que muda,
como ligar e como desligar, em `references/conectores.md`; o WhatsApp tem a
cadeia própria, `references/conectar-whatsapp.md`, com o
`references/vocabulario.txt` do ofício ao lado. As linhas de
`## O que está conectado` ficam como o modelo as trouxe, e não viram
`## Pulado no começo`: não é pulo, é que a hora não chegou.

### Passo 3 · Passar a vez

Feche primeiro, com a saída da seção 7. Então diga em uma linha o que vem —
{comecar-a-conversa} — e **passe a vez**: chame
`/{plugin}:{skill-da-conversa}` pela ferramenta de skill do harness, se a
sessão tiver uma; senão, peça que ele digite o comando. **Não faça a conversa
aqui**: ela tem as regras dela, e pode pausar e voltar sem perder o que ouviu.

Os passos 4 e 5 também são de outras skills: `/{plugin}:{skill-do-dia-vazio}`
traz as primeiras {itens} pelo perfil, e `/{plugin}:{skill-de-julgar}` diz
qual delas vale. A conversa termina apontando as duas.

Ele já tem {itens} em andamento, numa planilha ou em links? Uma linha: ponha em
`_bruto/` e rode `/{plugin}:organizar-{pasta-base}`, que transforma em ficha.
[[fim]]

---

## 7 · A saída

O fecho é o do contrato §10, com os títulos exatos. Não há bloco para colar: o
trabalho dela é a {base}.

**O `## Guardei` sai sempre, inclusive quando nada foi gravado** — quem a chama
só para retomar um item e o teste não passa:

```markdown
## Guardei
- nada foi gravado — o teste do Google Drive não passou, e a linha só vira
  `sim` depois de uma chamada que voltou

## Ficou para depois
- ligar o Google Drive — continua em “Pulado no começo”, com a data de lá
```

`## Não gravei nada` e `## A {base} está como estava` são títulos inventados, e
o contrato §4 os proíbe: quem lê o fecho procura os títulos fixos. Medido na
prova: esta skill inventou o próprio na primeira execução, tendo feito a coisa
certa.

[[se comecar-roteiro:conexoes]]
```markdown
{comecar--saida-completa}
```

Veio da planilha? As linhas {do-item} trocam por estas, e o resto fica:

```markdown
{comecar--saida-curta}
```
[[fim]]
[[se comecar-roteiro:perfil]]
```markdown
# Sua {base} está montada

Ela mora em ~/{pasta-base}/. É sua, é texto, e abre em qualquer editor.

## O que ficou pronto
- a {base}, com os arquivos do padrão, no modo copiloto
- o seu nome e como te encontram, em `## Quem sou`

## Guardei
- ~/{pasta-base}/INDICE.md — criado, com o seu nome, os contatos e o modo
- ~/{pasta-base}/hoje.md, funil.md e os dois _indice.md — criados, vazios

## Falta saber
- o portfólio — você disse que ainda não tem, e a linha ficou em branco

## Ficou para depois
- agenda, e-mail, WhatsApp e login em site — a skill que precisar oferece

## O que pedir agora
/{plugin}:{skill-da-conversa}   {comecar-a-conversa-curta}
```
[[fim]]

No `drive`, o mesmo fecho troca o lugar: “Ela mora na pasta `{pasta-base}` do
seu Drive”, e cada linha do `## Guardei` nomeia a pasta e o arquivo. Ao falar
com ele, data em prosa — “12 de agosto”; **nos arquivos, sempre `2026-08-12`**.
Todo id aparece com o apelido junto, em toda linha. `## Decidi sozinho` não
aparece: ela não decide nada sozinha (seção 5).

**A lista de comandos, uma linha cada, e toda skill instalada nela.** Não a
escreva de memória: onde há ferramenta de arquivo, um `Grep` pelo padrão
`^description:` em `../*/SKILL.md` a partir da pasta desta, com duas linhas
depois, dá o nome e a primeira frase de cada uma — escreva
`/{plugin}:<nome>` e o que ela faz, encurtado. Sem ferramenta de arquivo, a
lista está em `references/contrato/11-0-onde-roda.md`, com o que não funciona
no chat da web. Prometer skill que não existe é o primeiro erro que ele
encontra sozinho.

---

## 8 · Onde ela para

**Ela não conecta nada por ele.** Autorizar é no navegador dele, com a conta
dele. Ela explica com o nome de cada botão e espera. **Não pede senha em passo
nenhum** — se algo parecer pedir senha, não é ela.

**Ela não escreve `sim` sem testar.** Nem por pressa, nem porque ele disse que
conectou, nem porque a ferramenta apareceu na sessão.

**Ela não sobrescreve {base} que já existe.** `Write` só em arquivo novo;
{base} montada é retomada, e o passo feito não se refaz.

**Ela não apaga nada, nunca** — nem arquivo, nem linha, nem `_bruto/`. Mover a
{base} de lugar é com ele.

**Ela não chuta dado de {item}.** Link que não abriu vira ficha colada ou `?` —
nem para a {base} parecer mais cheia no fim do setup.

**Ela não escreve {exemplo-trabalho} nem mensagem.** {comecar--quem-escreve-o-que}

**Ela não lê {documentos-que-ela-nao-le}.** Documento que aparecer vira arquivo
em `_bruto/` e uma linha dizendo que quem lê é `/{plugin}:{skill-conferir}`.

**Dos conectores ela só lê, e só no teste.** Não cria evento, não manda e-mail,
não escreve no Drive. A única coisa que sai é a mensagem de prova da ponte do
WhatsApp, para o **próprio número dele**, com a prévia na tela e o sim dele
(degrau 8 de `references/conectar-whatsapp.md`, quando é ela que liga a ponte).
Para {pessoa} nenhum ela manda nada: quem manda é a skill do dia (contrato §7.1).

**Ela não instala nada.** Não roda `/plugin`, não edita configuração, não mexe
em MCP. Ela diz o que digitar; quem digita é ele.

**Ela não sai da {base}**, em transporte nenhum. **Sem nenhum dos dois
transportes ela não funciona**, e diz em uma linha: “Isto monta a sua {base}, e
aqui eu não tenho onde montar. No Claude Code, ou com a {base} no Drive,
funciona.” Nada é gravado, e ela não finge que foi.

**Ela não insiste.** Passo pulado é passo anotado, e a oferta volta uma vez, na
skill em que aquilo faz falta. Quando algo não der certo, uma linha: o que não
deu e qual é o caminho.
