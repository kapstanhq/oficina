---
name: laudo-da-carteira
description: >-
  A régua barata da carteira: lê tudo e não escreve nada. Diz o que está sem
  procedência, o que está com procedência VENCIDA, que conta ou contato ficou
  órfão, que arquivo passou do teto e qual `?` está esperando há mais tempo — e
  em cada achado aponta a skill que resolve. Sai ordenado por consequência, não
  por pasta. Use antes de mexer na carteira e depois de escrever nela, e quando
  o prospector disser — a carteira está confiável? · dá uma conferida no que
  eu tenho aí · o que está faltando na minha carteira · tem coisa velha aqui? ·
  o que está desatualizado · isso ainda vale? · antes de eu mandar isso, confere
  · será que perdi alguma coisa · minha carteira está uma bagunça, o que tem de
  errado. Também depois de importar planilha ou conversa em volume. Ela não
  arruma nada: quem arruma é /prospeccao:organizar-carteira, e quem cobra o que
  falta de outra pessoa é /prospeccao:cobrar-o-que-falta.
license: MIT
compatibility: >-
  Precisa da carteira e só de leitura — não escreve, não move e não apaga, em
  nenhum modo. Sem carteira ela diz isso em uma linha e manda rodar
  /prospeccao:comecar. Funciona igual no computador e no Drive; no Drive ela lê
  pelo conector e a busca é sempre presa à pasta. Sem ferramenta de busca por
  conteúdo ela ainda roda, lendo arquivo a arquivo, e avisa que ficou mais
  lenta.
allowed-tools: Read Glob Grep
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/laudo-da-carteira/SKILL.md, e ela vale para
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
frase afirmativa, o preço de março vira o preço de hoje, e o prospector
descobre no pior lugar possível — na frente do contato.

**Ela não conserta nada.** Não move arquivo, não apaga, não reescreve índice,
não aposenta ninguém. Quem faz isso é `/prospeccao:organizar-carteira`, e a
separação é de propósito: a régua tem que ser barata o bastante para se rodar
dez vezes por semana, e o que escreve nunca é barato.

**Ela também não pergunta.** Um laudo que interrompe deixa de ser uma régua e
vira uma conversa. O que ela não sabe entra como achado, com o nome de quem
pergunta.

## 2 · Antes de tudo

1. Leia `~/carteira/INDICE.md`. Não existe: uma linha dizendo que não há
   carteira para conferir, e `/prospeccao:comecar`. Não invente carteira vazia.
2. Leia a linha `modo:` — ela muda uma coisa só, e está na seção 3.
3. Leia `references/contrato/03-0-as-tres-regras.md` e
   `references/contrato/09-0-os-tetos.md`. **São eles a régua**: este arquivo
   diz como medir, o contrato diz contra o quê. Se os dois divergirem, o
   contrato vence e o achado é sobre este arquivo.
4. `references/contrato/10-0-comeca-e-termina.md` — o fecho. **Os três títulos
   são fixos e o `## Guardei` nunca some**, nem quando nada foi gravado: é o
   caso desta skill em toda execução, e o título continua sendo esse.
5. Monte o inventário sem abrir tudo: os dois `_indice.md`, o `funil.md`, o
   `hoje.md` e a lista de nomes de `contas/`, `contatos/` e
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

## 4 · As cinco perguntas, nesta ordem

A ordem é de **consequência**, e não de pasta: o que faz o prospector dizer
uma coisa errada hoje vem antes do que deixa a carteira feia.

### 4.1 · Que campo está sem procedência

A regra 2 do contrato: todo campo leva de onde veio. Campo preenchido **sem** a
marca de origem é o achado mais grave da carteira, porque ele é indistinguível
de um campo apurado — e é exatamente o que a próxima skill vai afirmar para
alguém de fora.

Procure, em `contas/` e `contatos/`, a linha de campo que tem
valor e não tem a marca `←`. Liste **arquivo, campo e valor**, e nunca só o
arquivo: quem lê o laudo precisa saber o que apagar ou o que confirmar.

Não confunda com o `?`. O `?` é honesto e é a linha mais útil do arquivo; o
campo sem procedência é o que **finge** ter sido apurado.

### 4.2 · Que campo está com procedência VENCIDA

Procedência tem data, e dado tem prazo. Um valor apurado há tempo demais não é
falso — é **velho**, e a diferença importa: ele não sai do arquivo, ele sai
marcado.

```
quem é o contato, e o cargo dele        90 dias   cargo em empresa média muda mais rápido do que se imagina
o que a conta está fazendo            120 dias   notícia de seis meses não é gancho, é constrangimento
funcionários e faturamento            180 dias   sai de fonte pública que atualiza devagar
e-mail e telefone                     180 dias   a pessoa continua lá, o ramal não
o que o contato respondeu              90 dias   prioridade muda com o trimestre
```

Regra geral, para o que não estiver na lista: **fato que depende de terceiro
vence; fato que depende do prospector não vence.** O nome de quem decide não
envelhece; o preço, a disponibilidade e o prazo de qualquer coisa, sim.

O achado é `arquivo · campo · apurado em <data> · há N dias`, e o conserto é
sempre perguntar de novo — nunca deduzir.

### 4.3 · Que conta ou contato ficou órfão

Quatro formas, e as quatro são a mesma coisa vista de ângulos diferentes:

- **citado e inexistente** — o `funil.md`, o `hoje.md` ou um arquivo cita um id
  que não tem arquivo. É o pior dos quatro, porque a skill seguinte vai
  procurar e seguir sem ele.
- **existente e não citado** — o arquivo está lá e não aparece no `_indice.md`
  da pasta dele. Ele existe e ninguém o encontra.
- **id repetido** — dois arquivos com o mesmo id. A partir daqui, metade das
  leituras pega o errado.
- **id sem apelido** — o contrato pede `E-071 (VetorBank, Porto Alegre)`, nunca o id sozinho.
  Onde o apelido faltar, o prospector não sabe do que se está falando.

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
funcionários: ?  ← olhar no LinkedIn da conta
faturamento: ?  ← não é público; perguntar na reunião
```

Um `?` que espera há mais tempo que o 90 dias não é mais uma
pergunta em aberto: é uma decisão de não perguntar. Ele aparece no laudo com
essa palavra, para o prospector decidir se ainda quer a resposta.

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

- contas/E-071-vetorbank.md · campo `preço` = 720.000, sem `←`
  → confirme a origem ou marque `?` · /prospeccao:organizar-carteira
- contatos/P-017-carla-menezes.md · campo `telefone`, sem `←`
  → veio de onde? · /prospeccao:organizar-carteira

## Vencido — 1

- contas/E-071-vetorbank.md · `preço` apurado em 2026-06-02, há 99 dias
  → pergunte de novo antes de usar em qualquer texto

## Órfãos — 3

- `funil.md` cita E-071 (VetorBank, Porto Alegre) e o arquivo não existe
- contatos/P-017-carla-menezes.md não está no `_indice.md` da pasta
- `hoje.md` cita um id sem apelido, três vezes

## Acima do teto — 1

- contatos/P-017-carla-menezes.md · 186 linhas, teto 120
  → o histórico vai para `_bruto/` · /prospeccao:organizar-carteira

## Os `?` mais velhos — 5

- contas/E-071-vetorbank.md · há 41 dias · o que falta está na linha `←`
- … (cinco, sempre; menos que cinco, todos)

## Não consegui ler — 1

- `_bruto/2026-08-30-planilha.csv` — o arquivo abriu vazio

## Guardei
- nada foi gravado — este laudo só lê

## Falta saber
- o pack não declara prazo de validade para `setor`; medi como se não vencesse
```

`## Guardei` é obrigatório e não some nunca (§10). Aqui ele diz sempre a mesma
coisa, e é o ponto: quem lê precisa saber que a carteira **não mudou**.

`## Falta saber` é a régua se declarando incompleta, e só aparece quando isso
acontece: um campo que o laudo não soube medir porque o pack não disse o prazo
dele. Não é a lista dos `?` da carteira — essa é a seção 4.5, e ela é o
trabalho, não a confissão.

**Zero achados é um resultado, e ele se escreve:** `**A carteira está limpa:
nada sem procedência, nada vencido, nada órfão, nada acima do teto.**` Um laudo
que some quando está tudo certo ensina o prospector a não rodá-lo.

## 7 · Onde ela para

**Ela não escreve, em nenhum modo, nunca.** Nem `hoje.md`, nem índice, nem uma
data de conferência dentro do arquivo conferido. É a garantia que torna barato
rodá-la no meio de qualquer coisa: se ela pudesse escrever, seria preciso pensar
antes de chamá-la.

**Ela não julga o conteúdo do ofício.** Ela diz que o campo está sem
procedência; não diz se o valor está certo. Ela diz que o dado venceu; não diz
qual é o novo. Julgar a conta é do prospector, e as skills que ajudam nisso
têm nome próprio.

**Ela não abre link e não sai da carteira.** O `?` que um link resolveria é
achado, não trabalho — varrer a carteira abrindo trinta páginas transforma uma
régua de dez segundos numa execução de meia hora, que é exatamente o que faz
ninguém rodá-la.

**Ela não mede o que o contrato não declara.** Se um pack quiser uma sexta
pergunta, ela entra em `_motor/skills/laudo-da-carteira/SKILL.md` e passa a
valer para todos os packs — nunca escrita à mão dentro de um.
