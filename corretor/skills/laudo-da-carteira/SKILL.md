---
name: laudo-da-carteira
description: >-
  A régua barata da carteira: lê tudo e não escreve nada. Diz o que está sem
  procedência, o que está com procedência VENCIDA, que imóvel ou cliente ficou
  órfão, que arquivo passou do teto e qual `?` está esperando há mais tempo — e
  em cada achado aponta a skill que resolve. Sai ordenado por consequência, não
  por pasta. Use antes de mexer na carteira e depois de escrever nela, e quando
  o corretor disser — a carteira está confiável? · dá uma conferida no que
  eu tenho aí · o que está faltando na minha carteira · tem coisa velha aqui? ·
  o que está desatualizado · essa informação ainda está certa? · antes de eu
  mandar isso, confere
  · será que perdi alguma coisa · minha carteira está uma bagunça, o que tem de
  errado. Também depois de importar planilha ou conversa em volume. Ela não
  arruma nada: quem arruma é /corretor:organizar-carteira, e quem cobra o que
  falta de outra pessoa é /corretor:cobrar-o-que-falta.
license: MIT
compatibility: >-
  Precisa da carteira e só de leitura — não escreve, não move e não apaga, em
  nenhum modo. Sem carteira ela diz isso em uma linha e manda rodar
  /corretor:comecar. Funciona igual no computador e no Drive; no Drive ela lê
  pelo conector e a busca é sempre presa à pasta. Sem ferramenta de busca por
  conteúdo ela ainda roda, lendo arquivo a arquivo, e avisa que ficou mais
  lenta.
allowed-tools: Read Glob Grep
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/laudo-da-{pasta-base}/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# O laudo da carteira

## 1 · O que ela faz, e o que ela não faz

Ela **lê a carteira inteira e não escreve uma linha**. O que ela devolve é um
laudo: o que está errado, o que está velho e o que ficou pela metade — cada
achado com o arquivo, o motivo e o nome de quem conserta.

É a régua que se roda **antes** de mexer e **depois** de escrever, e as duas
horas importam pela mesma razão: uma carteira pouco aberta desatualiza, e
carteira desatualizada faz toda skill mentir com confiança. O `?` honesto vira
frase afirmativa, o preço de março vira o preço de hoje, e o corretor
descobre no pior lugar possível — na frente do cliente.

**Ela não conserta nada.** Não move arquivo, não apaga, não reescreve índice,
não aposenta ninguém. Quem faz isso é `/corretor:organizar-carteira`, e a
separação é de propósito: a régua tem que ser barata o bastante para se rodar
dez vezes por semana, e o que escreve nunca é barato.

**Ela também não pergunta.** Um laudo que interrompe deixa de ser uma régua e
vira uma conversa. O que ela não sabe entra como achado, com o nome de quem
pergunta.

## 2 · Antes de tudo

1. Leia `~/carteira/INDICE.md`. Não existe: uma linha dizendo que não há
   carteira para conferir, e `/corretor:comecar`. Não invente carteira vazia.
2. Leia a linha `modo:` — ela muda uma coisa só, e está na seção 3.
3. Leia `references/contrato/03-0-as-tres-regras.md` e
   `references/contrato/09-0-os-tetos.md`. **São eles a régua**: este arquivo
   diz como medir, o contrato diz contra o quê. Se os dois divergirem, o
   contrato vence e o achado é sobre este arquivo.
4. `references/contrato/10-0-comeca-e-termina.md` — o fecho. **Os três títulos
   são fixos e o `## Guardei` nunca some**, nem quando nada foi gravado: é o
   caso desta skill em toda execução, e o título continua sendo esse.
5. Monte o inventário sem abrir tudo: os dois `_indice.md`, o `funil.md`, o
   `hoje.md` e a lista de nomes de `imoveis/`, `clientes/` e
   `_bruto/`. **Só então** abra os arquivos, e abra na ordem da seção 4.

**Não é um TODO.** São leituras, não passos demorados — o contrato §10 pede
TODO para três ou mais passos que abrem link ou escrevem. Este não escreve
nenhum.

## 3 · O modo

O laudo é o mesmo nos dois. `copiloto` e `automatico` mudam uma coisa só: em
`automatico`, quando um achado tem conserto óbvio e de uma linha, ela **oferece
rodar a skill que conserta** no fim, em vez de só nomeá-la. Ela continua não
consertando — oferecer é uma frase, não uma escrita.

Não há `## Decidi sozinho` neste laudo em nenhum modo: ela não decide nada.

## 4 · As seis perguntas, nesta ordem

A ordem é de **consequência**, e não de pasta: o que faz o corretor dizer
uma coisa errada hoje vem antes do que deixa a carteira feia.

### 4.1 · Que campo está sem procedência

A regra 2 do contrato: todo campo leva de onde veio. Campo preenchido **sem** a
marca de origem é o achado mais grave da carteira, porque ele é indistinguível
de um campo apurado — e é exatamente o que a próxima skill vai afirmar para
alguém de fora.

Procure, em `imoveis/` e `clientes/`, a linha de campo que tem
valor e não tem a marca `←`. Liste **arquivo, campo e valor**, e nunca só o
arquivo: quem lê o laudo precisa saber o que apagar ou o que confirmar.

Não confunda com o `?`. O `?` é honesto e é a linha mais útil do arquivo; o
campo sem procedência é o que **finge** ter sido apurado.

### 4.2 · Que campo está com procedência VENCIDA

Procedência tem data, e dado tem prazo. Um valor apurado há tempo demais não é
falso — é **velho**, e a diferença importa: ele não sai do arquivo, ele sai
marcado.

```
preço e disponibilidade do imóvel   60 dias   o mercado anda, e o valor de março não é o de hoje
matrícula, certidão e ônus          90 dias   o cartório emite com validade, e o banco a cobra
documento pedido e não entregue     30 dias   passou disso foi esquecido, não está a caminho
condomínio e IPTU                  180 dias   mudam por reajuste anual, e o anúncio erra junto
o que o cliente disse que procura    90 dias   a vida dele muda mais rápido que a carteira
```

Regra geral, para o que não estiver na lista: **fato que depende de terceiro
vence; fato que depende do corretor não vence.** O nome de quem decide não
envelhece; o preço, a disponibilidade e o prazo de qualquer coisa, sim.

O achado é `arquivo · campo · apurado em <data> · há N dias`, e o conserto é
sempre perguntar de novo — nunca deduzir.

### 4.3 · Que imóvel ou cliente ficou órfão

Quatro formas, e as quatro são a mesma coisa vista de ângulos diferentes:

- **citado e inexistente** — o `funil.md`, o `hoje.md` ou um arquivo cita um id
  que não tem arquivo. É o pior dos quatro, porque a skill seguinte vai
  procurar e seguir sem ele.
- **existente e não citado** — o arquivo está lá e não aparece no `_indice.md`
  da pasta dele. Ele existe e ninguém o encontra.
- **id repetido** — dois arquivos com o mesmo id. A partir daqui, metade das
  leituras pega o errado.
- **id sem apelido** — o contrato pede `V-071 (casa 3 dorm, Azenha)`, nunca o id sozinho.
  Onde o apelido faltar, o corretor não sabe do que se está falando.

### 4.4 · Que arquivo passou do teto

Os tetos estão em `references/contrato/09-0-os-tetos.md`, e eles não são
estética: arquivo grande faz o agente reler quilobytes para achar um telefone,
e a execução fica lenta de um jeito que ninguém liga ao arquivo.

Meça e diga **quanto** passou — `120 linhas, teto 120` não é achado;
`186 linhas, teto 120` é. E diga o que sai: pelo contrato, o que passa do teto
não é apagado, é **derivado para `_bruto/`** ou aposentado.

### 4.5 · Qual `?` está esperando há mais tempo

O `?` é a lista de trabalho da carteira, e ela envelhece em silêncio. Ordene por
tempo de espera e mostre os cinco mais velhos, com o arquivo e o que o `?` está
pedindo:

```
condomínio: ?  ← pedir ao proprietário
iptu: ?  ← está na matrícula, que ainda não chegou
```

Um `?` que espera há mais tempo que o 120 dias não é mais uma
pergunta em aberto: é uma decisão de não perguntar. Ele aparece no laudo com
essa palavra, para o corretor decidir se ainda quer a resposta.

### 4.6 · Que campo o formato tem e a ficha não

Regra nova cria campo, e o campo não chega sozinho às fichas antigas: a ficha
gravada antes dele não tem a linha — nem valor, nem `?` —, e nenhuma skill
volta a ela. Em 2026-10-06, uma linha criada pela leitura chegou depois de 33
fichas já lidas, e as 33 ficaram sem ela para sempre: ninguém sabia que
faltava, porque linha ausente não aparece como `?`.

Compare o cabeçalho de cada ficha de `imoveis/` com o do formato em
`references/contrato/04-4-arquivo-de-imovel.md`, e liste **o campo e quantas
fichas, por etapa** quando a ficha tem uma: `<campo> · falta em 33 — 20 em
<etapa>, 13 em <etapa>`. Por etapa, porque o campo que a leitura escreve só falta em quem já passou
por ela: na novo lead, a ficha ainda não lida não é achado. O conserto
é de `/corretor:organizar-carteira`, que acrescenta a linha `?` e manda
para quem a preenche.

## 5 · O que perguntar, e como

**Nada.** Esta é a única skill do pack que não pergunta em nenhum momento, e é
uma escolha, não um esquecimento: ela existe para caber no meio de outra coisa.
O que ela não conseguiu apurar vira achado com o nome de quem pergunta.

Se a carteira estiver ilegível — pasta sem permissão, arquivo corrompido, Drive
fora do ar —, ela diz o que não conseguiu ler, em uma linha por arquivo, e
**segue com o resto**. Laudo parcial declarado vale mais que laudo nenhum.

## 6 · O formato da saída

O trabalho é o laudo, então **não há bloco para colar** — é uma das skills que a
§10 do contrato lista assim. Nada de moldura desenhada, nada de emoji.

Abre pelo veredito em UMA linha, e o veredito é a primeira coisa que se lê:

```markdown
# Laudo da carteira — 2026-09-09

**3 coisas para olhar hoje, 8 para olhar esta semana, e 1 arquivo que não abriu.**

## Sem procedência — 2

- V-071 (casa 3 dorm, Azenha) · `preço` = 720.000, sem dizer de onde veio
  → confirme a origem, ou deixe em aberto — é só dizer “organiza minha carteira”
- C-017 (Joana Ribeiro) · o telefone, sem dizer de onde veio
  → veio de onde? — é só dizer “organiza minha carteira”

## Vencido — 1

- V-071 (casa 3 dorm, Azenha) · `preço` apurado em 2026-06-02, há 99 dias
  → pergunte de novo antes de usar em qualquer texto

## Órfãos — 3

- o funil cita V-071 (casa 3 dorm, Azenha), e a ficha não existe
- C-017 (Joana Ribeiro) tem ficha e não aparece na lista de clientes
- a lista do dia cita um id sem apelido, três vezes

## Acima do teto — 1

- C-017 (Joana Ribeiro) · a ficha tem 186 linhas, teto 120
  → o histórico antigo vai para os originais — é só dizer “organiza minha carteira”

## Os `?` mais velhos — 5

- V-071 (casa 3 dorm, Azenha) · há 41 dias · a ficha diz o que falta e onde perguntar
- … (cinco, sempre; menos que cinco, todos)

## Campo que a ficha não tem — 1

- um campo do formato falta em 12 fichas — 9 numa etapa, 3 na seguinte
  → a linha entra em `?`, e quem preenche é chamado — é só dizer “organiza minha carteira”

## Não consegui ler — 1

- a planilha 2026-08-30-planilha.csv, nos originais — o arquivo abriu vazio

## Guardei
- nada foi gravado — este laudo só lê

## Falta saber
- não sei por quanto tempo o campo metragem continua valendo; medi como se não vencesse

## Próximo passo
- Resolver as 3 coisas de hoje — o que está sem origem pode sair numa mensagem errada. É só dizer “organiza minha carteira”.
- No painel, cada ficha citada aqui abre com um clique.
```

`## Guardei` é obrigatório e não some nunca (§10). Aqui ele diz sempre a mesma
coisa, e é o ponto: quem lê precisa saber que a carteira **não mudou**.

`## Falta saber` é a régua se declarando incompleta, e só aparece quando isso
acontece: um campo que o laudo não soube medir porque o pack não disse o prazo
dele. Não é a lista dos `?` da carteira — essa é a seção 4.5, e ela é o
trabalho, não a confissão.

**Zero achados é um resultado, e ele se escreve:** `**A carteira está limpa:
nada sem procedência, nada vencido, nada órfão, nada acima do teto, nenhum
campo faltando.**` Um laudo
que some quando está tudo certo ensina o corretor a não rodá-lo.

## 7 · Onde ela para

**Ela não escreve, em nenhum modo, nunca.** Nem `hoje.md`, nem índice, nem uma
data de conferência dentro do arquivo conferido. É a garantia que torna barato
rodá-la no meio de qualquer coisa: se ela pudesse escrever, seria preciso pensar
antes de chamá-la.

**Ela não julga o conteúdo do ofício.** Ela diz que o campo está sem
procedência; não diz se o valor está certo. Ela diz que o dado venceu; não diz
qual é o novo. Julgar o imóvel é do corretor, e as skills que ajudam nisso
têm nome próprio.

**Ela não abre link e não sai da carteira.** O `?` que um link resolveria é
achado, não trabalho — varrer a carteira abrindo trinta páginas transforma uma
régua de dez segundos numa execução de meia hora, que é exatamente o que faz
ninguém rodá-la.

**Ela não mede o que o contrato não declara.** Se um pack quiser uma sétima
pergunta, ela entra em `_motor/skills/laudo-da-carteira/SKILL.md` e passa a
valer para todos os packs — nunca escrita à mão dentro de um.
