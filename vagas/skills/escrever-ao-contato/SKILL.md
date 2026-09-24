---
name: escrever-ao-contato
description: >-
  Escreve UMA mensagem, para UMA pessoa do outro lado de uma vaga: a primeira
  mensagem ao recrutador ou ao gestor, a resposta ao que ele perguntou —
  processo, disponibilidade, pretensão — ou o pedido de referência a quem já
  trabalhou com o candidato. Toda afirmação sai da `trajetoria.md`, com o
  número igual; a pretensão sai da frase que o `perfil.md` guarda para isso, e
  nunca o piso. **Recusa quem tem `não contatar: sim`**, nos dois modos. Grava
  uma linha em `## O que já mandei` do contato e uma no `## Histórico` da
  vaga. Use quando o candidato disser "escreve para o recrutador", "ele
  perguntou a pretensão, e agora", "responde a Helena", "o que eu digo para
  ele", "manda uma mensagem para quem cuida da vaga", "pede uma referência
  para o Caio", "confirma a entrevista", "ele respondeu, o que eu falo". Não é
  ela que escreve para quem sumiu (/vagas:retomar-contato), nem que prepara a
  candidatura (/vagas:candidatar), nem que escreve o currículo
  (/vagas:montar-curriculo).
license: MIT
compatibility: >-
  Precisa da busca, com a `trajetoria.md` e o `perfil.md`: sem a trajetória ela
  não afirma nada em nome dele. Sem busca, escreve com o que for colado e não
  grava. Sem conector entrega o bloco para copiar, o padrão em toda
  ferramenta. Com o de e-mail pessoal ou o de WhatsApp, manda uma por vez,
  depois de ele ver texto e destinatário; conversa que nunca existiu no
  WhatsApp sai por LINK (§7.1). Painel opcional.
allowed-tools: Read Glob Grep Write Edit
---

# Escrever ao contato

## 1 · O que ela faz, e o que ela não faz

Ela escreve **uma** mensagem, para **uma** pessoa, sobre **uma** vaga. É a única
skill do pack que fala com gente do outro lado — e por isso é a que mais
cuida do que afirma.

São três mensagens, e ela não faz uma quarta:

```
a primeira     ao recrutador ou ao gestor de uma vaga em que ele já se
               candidatou, ou vai se candidatar. Diz quem ele é, por qual
               vaga escreve, UMA prova, e uma pergunta de sim ou não

a resposta     ao que o contato perguntou: como é o processo, quando ele
               pode, quanto ele quer. Aqui não se procura assunto — o
               assunto é a pergunta, e a mensagem responde

a referência   a quem já trabalhou com ele (`papel: referência`). Pede
               REFERÊNCIA, não emprego — e só quando a vaga já existe
```

**Tudo o que a mensagem afirma sobre ele está na `trajetoria.md`**, e sai de lá
IGUAL: 31 mil não vira “mais de 30 mil” porque a frase ficou mais redonda. O
que a trajetória não tem, não entra — nem como “experiência sólida em”. E o que
está em `## O que NÃO se diz` não entra nem se o contato perguntar: aí a
resposta é a verdade curta, que aquela seção já escreveu.

**A recusa é parte do produto.** Quem tem `não contatar: sim` não recebe nada
— nem rascunho, nem “para você ver e decidir”. Rascunho que existe é rascunho
que alguém manda por engano. O contrato, em
`references/contrato/03-1-o-que-e-seu.md`, diz por quê.

## 2 · Antes de tudo

Nesta ordem, e **o degrau 4 não se pula em modo nenhum**:

1. lê `~/busca/INDICE.md` — `references/contrato/10-0-comeca-e-termina.md` diz
   como começar, e `references/contrato/04-1-indice.md` diz o que as linhas
   significam. Não existe: o passo 7 diz o que ela faz sem busca
2. lê `modo:`, `envio:`, `canal padrão com contato:`, `canal padrão depois que
   responde:` e a `assinatura de e-mail:`
3. acha a pessoa e a vaga. A pessoa pelo id, pelo nome, ou pelo `contato:` da
   vaga; a vaga pelo id, ou pelo `## Fala por` da pessoa. **Uma pessoa que fala
   por duas vagas: pergunte de qual é esta mensagem** — o formato dos dois
   arquivos está em `references/contrato/04-5-arquivo-de-contato.md` e
   `references/contrato/04-4-arquivo-de-vaga.md`
4. **lê `não contatar:` no arquivo do contato.** `sim`: pare, e o passo 1 diz o
   que dizer
5. lê, do contato, `papel:`, `canal:`, `## O que ele me disse`, `## Combinado`
   e — sobretudo — `## O que já mandei`; da vaga, `etapa:`, `estado:`,
   `## O que a vaga pede`, `## Candidatura`, `## Combinado` e `## Histórico`
6. lê `~/busca/trajetoria.md` inteira, **começando por `## O que NÃO se diz`**
   (`references/contrato/12-0-a-trajetoria-e-o-curriculo.md`), e o
   `~/busca/perfil.md` — dele só importam `## Quanto` e `## Aceito`
   (`references/contrato/04-9-o-perfil.md`)

O formato do que sai está em `references/contrato/06-0-o-que-sai.md`, e o envio
em `references/contrato/07-1-a-mensagem-sai.md`.

**A pessoa não tem arquivo?** Ela ganha um, pelo gabarito de
`references/modelos/contato.md`, em duas situações e só nelas: **falou com o
candidato** (ele colou a mensagem, ou ela está em `_bruto/`), ou **a vaga a
nomeia como quem recebe candidatura**, com o contato profissional publicado no
anúncio. Nome que apareceu numa busca na rede não é contato: é alguém que não
sabe que ele existe. Os dois lados do vínculo se escrevem na mesma passada —
`contato:` na vaga, `## Fala por` no contato —, com a procedência de onde o
nome veio.

## 3 · O modo

`copiloto` — mostra o texto, quem recebe e a prova escolhida, e espera.

`automatico` — escolhe a prova e o canal sozinha e declara em
`## Decidi sozinho`. **O que ele não muda é o envio**: quem diz se a mensagem
sai sem perguntar é a linha `envio:` do `INDICE.md`, e o padrão dela é
`pergunta sempre` (contrato §7.1). Quem ligou o automático para o texto não
ligou para a boca dele.

Duas coisas que nenhum dos dois modos muda:

- **`não contatar: sim` é recusa**, sem rascunho
- **a mensagem que leva a pretensão nunca sai sem ele ler**, nem com
  `envio: responder sem perguntar`. Número dito a um recrutador não se desdiz,
  e é a frase da negociação inteira

## 4 · O passo a passo

### Passo 1 · A recusa, que vem antes de tudo

`não contatar: sim` no arquivo do contato. A saída é esta — **com o fecho da
seção 10, que não some nem aqui**:

```
Não escrevi. O P-009 (Ivo Tanaka) tem `não contatar: sim` desde 2 de setembro —
ele pediu, por e-mail, com estas palavras: “por favor, só pelo portal”.

Pedido de silêncio não tem exceção para “só confirmar”. A V-025 (Group PM,
Malha Telecom) continua andando pelo portal, que é por onde ele pediu.

## Guardei
- nada foi gravado — não houve mensagem, e escrever é o que vira linha em
  `## O que já mandei`
```

**O `## Guardei` é o mais importante desta saída**: quem lê precisa saber que a
busca **não** mudou. O título é esse — “não gravei nada” em prosa não é fecho.

### Passo 2 · Qual mensagem é esta

```
a primeira      `## O que já mandei` está vazio, e a pessoa é `recrutador`,
                `gestor` ou `indicação`. Precisa de prova (passo 3)

a resposta      a última coisa que aconteceu foi ELA falar: está em
                `## O que ele me disse`, em `## Combinado`, ou o candidato
                colou agora. A mensagem responde o que foi perguntado, e só

a referência    `papel: referência`. Passo 5

quem sumiu      ele escreveu, ela não respondeu, e passaram sete dias. NÃO é
                aqui: é `/vagas:retomar-contato`, que tem cadência, teto de
                retomadas e o que dizer de novo. Diga isso e pare
```

**Vaga `fechou`, ou no `arquivo-morto/`:** não escreve primeira mensagem. Diz o
estado, com a data, e para. Resposta a quem escreveu sobre vaga fechada pode
sair — é educação, e é a pessoa que volta com a próxima.

**Vaga em `nova`:** ela ainda não foi julgada. Pergunte antes — escrever ao
recrutador de uma vaga que não vale é gastar o nome dele no que ele não quer.

### Passo 3 · A prova, e ela é UMA

A primeira mensagem leva **uma** linha da trajetória — a que mais serve ao que
**esta** vaga pede. Procure nesta ordem e **pare na primeira que existir**:

```
1  o que a vaga pede, e ele fez    uma linha de `## O que a vaga pede` casa
                                   com uma linha de experiência que tem
                                   NÚMERO com procedência
2  o que a vaga pede, e ele fez,   a mesma coisa, sem número: sai o fato, e
   sem número                      não se inventa o número para fechar a frase
3  alguém em comum                 o `de onde veio` do contato é indicação —
                                   aí a prova é o nome de quem indicou, e ele
                                   tem de estar em `contatos/`
4  nenhuma                         NÃO escreve a mensagem
```

**Nenhuma prova?** A saída não é uma mensagem: é **o que falta para haver
uma**, em uma linha — “a V-031 (PM Sênior, Cobre Energia) ainda não tem
`## O que a vaga pede`; quem escreve isso é `/vagas:triar-vagas`”. Mensagem que
diz “tenho o perfil que vocês procuram” sem dizer qual é a que o recrutador
recebe quarenta vezes por vaga.

**`número que NÃO tenho:` é para ser obedecido.** Se a trajetória diz que o
efeito não foi medido, a mensagem não diz que houve efeito.

### Passo 4 · Escrever

O formato é o de `06-0-o-que-sai.md`, e o tamanho é este — quem recruta lê no
celular, entre duas reuniões:

```
Bruno, bom dia. Sou o Rafael Duarte — me candidatei ontem à vaga de Lead PM.

Na Âncora Pagamentos liderei o produto de antecipação para lojista, e a base
ativa foi de 4 mil para 31 mil lojistas em dois anos.

https://linkedin.com/in/exemplo-rafael-duarte

Faz sentido uma conversa de 20 minutos nesta semana?
```

Quatro coisas que essa mensagem faz:

- **diz quem ele é e por qual vaga escreve**, na primeira linha. Recrutador
  cuida de dez vagas, e “a vaga de produto” não é nenhuma delas
- **uma prova, com o número igual ao da trajetória** — e ela é sobre o que ele
  FEZ, não sobre o que ele é. “Sou orientado a resultado” não é prova
- **um link, sozinho na linha**: o portfólio ou o perfil profissional do
  `INDICE.md`. O currículo não vai aqui — já foi na candidatura
- **uma pergunta só, de sim ou não**

E a procedência, **fora do bloco**:

```
> O que a mensagem afirma veio da trajetoria.md — a experiência na Âncora
> Pagamentos, e o número é o de `_bruto/2026-09-14-curriculo-antigo.md`. A
> candidatura é a de 2026-09-13, em `## Candidatura` da V-022 (Lead PM, Pátio
> Varejo).
```

O que não entra, além do que o §6 já proíbe: “espero que esteja bem”, “sei que
sua agenda é corrida”, “sou apaixonado por produto”, “acredito que meu perfil”,
“fico no aguardo”, adjetivo sobre si mesmo, e o pedido de “uma oportunidade”.
**E nada de “conforme conversamos” quando não houve conversa.**

#### A resposta

Responde **o que foi perguntado, na ordem em que foi perguntado**, e para. Se
ele perguntou duas coisas, são duas respostas curtas na mesma mensagem — e
nenhuma terceira informação que ninguém pediu.

```
disponibilidade   sai de `horário que costumo oferecer para entrevista:` do
                  INDICE.md — duas opções, nunca “quando for melhor para você”
processo          o que ele perguntar sobre o estudo de caso, a rodada, o
                  prazo: responde com o que está em `## Combinado`, e o que
                  não está vira `## Falta saber`, não promessa
o que ele fez     sai da trajetória, igual
```

#### A pretensão

É a pergunta que mais importa, e a regra é de uma linha: **sai a frase de
`o que eu digo quando perguntam:` do `perfil.md`, como está escrita.** Nunca o
piso de nenhuma linha de contrato do `## Quanto` (`CLT:`, `PJ:`,
`temporário:`…), nunca um número que ela calculou.

```
Bruno, obrigado pelo retorno.

Minha expectativa é entre R$ 14 e 16 mil CLT, conforme o pacote.

A faixa da vaga está nessa região?
```

- a frase está `?` no perfil: **não escreve a mensagem.** Diz que falta a frase,
  e que quem a escreve com ele é `/vagas:perfil-de-busca`. Pretensão improvisada
  na hora é a que fica abaixo do que a vaga pagaria
- a frase é de um contrato e a vaga é de outro — ela diz CLT e a vaga
  `contrato: PJ`, `temporário` ou `estágio`: diga isso **antes** do bloco, e
  pergunte qual número ele quer dizer. Não converta sozinha
- **devolver a pergunta é permitido, e é o padrão do exemplo acima**: quem
  perguntou primeiro costuma ter a faixa, e `faixa: ?` na vaga é o campo que
  esta mensagem tenta preencher
- **esta mensagem nunca sai sem ele ler** (seção 3). E a pretensão **não é
  gravada por extenso** em arquivo de vaga nem de contato: a linha de
  `## O que já mandei` diz “respondi a pretensão, com a frase do perfil”

### Passo 5 · A referência

`papel: referência` é quem já trabalhou com ele e pode falar dele. Três
condições, e faltando uma ela não escreve:

```
a vaga existe        está em `candidatada` ou adiante. Pedir referência
                     “para quando aparecer algo” é pedir emprego com outro nome
a pessoa o conhece   a experiência em comum está na trajetoria.md
pede-se REFERÊNCIA   “posso indicar você como referência?” — e não “você
                     conhece alguém lá?”, “pode me indicar?”, “fala bem de mim”
```

```
Caio, tudo certo? Estou num processo para Gerente de Produto Sênior na Trilho
Logística, e eles pedem uma referência de quem trabalhou comigo.

Posso indicar você? Seria uma ligação curta, sobre o período da Rota Sul.
```

Ela diz **qual empresa e qual cargo** — quem dá referência precisa saber do que
vai falar — e **não** diz a etapa, a faixa nem o nome de quem está do outro
lado. A pessoa da referência não recebe link e não recebe currículo, a não ser
que peça. E ela é **dele**, não da vaga: a linha vai para `## O que já mandei`
do contato, e `## Fala por` continua como estava.

### Passo 6 · O canal decide o tamanho

```
e-mail            o do §6: assunto de até oito palavras, com o CARGO da vaga
                  dentro, sem “Re:” de mentira. Saudação curta, dois
                  parágrafos, a assinatura do INDICE.md. É o canal da
                  primeira mensagem ao recrutador

rede profissional mais curta que o e-mail: quatro linhas, um link no máximo,
                  a pergunta no fim. Sai SEMPRE como bloco para copiar — ali
                  não há conector, e a conta é dele

WhatsApp          o canal de DEPOIS que a pessoa respondeu, e o da
                  referência, que já é conversa. Conversa que nunca existiu
                  não sai pelo conector: sai por LINK (passo 7)
```

O canal do contato (`canal:`) **vence** o `canal padrão com contato:` do
`INDICE.md`; depois que ela respondeu, vale `canal padrão depois que responde:`
— e o canal **por onde ela escreveu** vence os três. Quando divergem, diga por
quê em uma linha. Mensagem por e-mail que seria melhor no WhatsApp: mande no
WhatsApp e diga por quê.

### Passo 7 · Gravar, e só então oferecer o envio

Grave **antes** de oferecer mandar, e grave o que é verdade:

- uma linha em **`## O que já mandei`** do contato:
  `- 2026-09-14 · e-mail · primeira mensagem, pedi 20 minutos · escrita, envio com o candidato`
  — data · canal · o que ela pedia · o que houve. É a linha que impede a
  próxima mensagem de repetir a pergunta, e ela entra mesmo quando quem manda é
  ele: escrever também é um fato
- uma linha no **`## Histórico` da vaga**, com o nome de quem recebeu:
  `- 2026-09-14 mensagem a P-003 (Bruno Sato): primeira mensagem  ← candidato, 2026-09-14`
  (a referência não entra aqui: ela não é andamento da vaga)
- `último contato` do `contatos/_indice.md`, e a linha nova se o contato nasceu
  agora (`references/contrato/04-6-os-dois-indices.md`)
- **a etapa só muda num caso**: a vaga está em `candidatada`, e esta mensagem é
  **resposta** — ou seja, alguém do lado de lá falou. Aí `etapa:` vira
  `em contato · desde <a data em que ELA falou>`, e o `funil.md` muda junto
  (`references/contrato/04-3-funil.md`). Primeira mensagem dele não é conversa:
  conversa é quando respondem

**A conversa em si ela não guarda.** O que o contato escreveu, e o candidato
colou aqui, serve para responder — quem leva conversa para `_bruto/` e tira os
fatos dela é `/vagas:importar-a-conversa`. Diga isso em `## Falta saber`, com o
comando, quando a mensagem colada trouxer fato novo (prazo, faixa, processo).

O bloco sai sozinho, em cerca de código, pronto para copiar, sem comentário
dentro. E as três saídas do §6:

```
Eu mesmo mando     você copia o bloco e cola
Mando agora        eu envio, depois de você ver o texto e quem recebe
Mudo o texto       você diz o que trocar, e nada sai agora
```

`Mando agora` só existe com conector, e quem diz o que está ligado é
`conectores_estado`, uma vez (`references/conectores.md`):

```
e-mail      `email-pessoal: ligado`. O que sai daqui sai no NOME dele: a tela
            mostra para quem, o assunto e o texto INTEIRO, e só então envia.
            Nunca pela caixa do agente — ela não fala em nome de ninguém
WhatsApp    `whatsapp: ligado`, pelo par `preparar_envio` e `enviar_mensagem`
            do §7.1. A prévia avisa quando a conversa não existe
```

**Conversa que nunca existiu no WhatsApp sai por LINK**, e não é escolha de
ninguém — é o próprio WhatsApp que recusa (§7.1). Com conector, a prévia já o
traz montado; sem ele, ela o escreve:

```
https://wa.me/<número com país, só dígitos>?text=<a mensagem codificada>
```

Espaço é `%20`, quebra de linha é `%0A`. O link abre o aplicativo dele na
conversa certa, com a mensagem escrita: ele só aperta enviar. **O bloco para
copiar vai junto**, porque o link falha com número errado e com texto longo. E
a guarda é a mesma: uma pessoa por vez, o texto inteiro na tela antes, e
`não contatar: sim` não recebe link nenhum.

**Se houver painel, é aqui que ele mais vale.** Mostre a mensagem na vista
`texto`, `editavel`, com os três rótulos acima como ações do rodapé — o formato
está em `references/painel.md`. **Use o `texto` que VOLTOU**, corrigido ou
não: é o que vai sair, e é o que se grava. Se ele escreveu à mão um fato que a
trajetória não tem, vale o que ele escreveu — a mensagem é dele —, e isso vira
uma linha em `## Falta saber`: “você disse X na mensagem, e a trajetória não
tem; entra lá?”. Sem painel, ou se ele expirar, o bloco no terminal é a saída
de sempre.

**Sem busca nenhuma** (`references/contrato/11-0-onde-roda.md`): ela escreve
com a vaga, a trajetória e a pergunta do contato **colados**, avisa em uma
linha que não conferiu `não contatar:` nem `## O que NÃO se diz` — “aqui eu não
chego neles” —, e não grava nada.

## 5 · O que perguntar, e como

No máximo duas perguntas, uma de cada vez (contrato §8), e as mais úteis são:

- **de qual vaga é esta mensagem**, quando a pessoa fala por duas
- **qual das provas**, quando duas linhas da trajetória servem igual — com o
  custo escrito em cada opção: “a da Trilho tem número; a da Rota Sul é mais
  parecida com o que a vaga descreve, e não tem”
- **o e-mail dela**, quando o campo está `?` e o canal é e-mail. Uma vez, com o
  motivo na mesma frase

**Quando não perguntar:** a prova é clara, o canal está escrito, o horário está
no `INDICE.md`. Escrever e mostrar bate perguntar como escrever — o texto na
tela é a pergunta mais barata que existe.

## 6 · O formato da saída

O bloco, sozinho; a procedência, fora dele; as três saídas; e o fecho do
contrato §10:

## Guardei
- ~/busca/contatos/P-003-bruno-sato.md — uma linha em `## O que já mandei`
- ~/busca/vagas/V-022-patio-varejo.md — uma linha no `## Histórico`, e a etapa
  para `em contato`
- ~/busca/funil.md — a V-022 (Lead PM, Pátio Varejo) mudou de etapa
- ~/busca/contatos/_indice.md — último contato

## Falta saber
- a faixa da V-022 (Lead PM, Pátio Varejo) — a mensagem devolveu a pergunta ao
  P-003 (Bruno Sato)
- ele citou o prazo do estudo de caso na mensagem que você colou: para guardar,
  `/vagas:importar-a-conversa`

## 7 · Onde ela para

**Ela não escreve para quem tem `não contatar: sim`.** Em modo nenhum, com
pedido explícito nenhum, nem “só um rascunho”. Se o candidato insistir, ela diz
uma vez o que o campo significa e continua não escrevendo.

**Ela não manda em lote, e não escreve a mesma mensagem duas vezes.** Uma
pessoa por chamada. “Escreve para os recrutadores das cinco vagas” são cinco
execuções, com cinco provas — e a mesma mensagem para dez recrutadores é o que
o contrato §3.1 diz que nenhuma skill faz, nem a pedido.

**Ela não diz o piso, e não negocia.** Sai a frase do perfil. Contraproposta,
aceite e recusa de proposta são dele: ela escreve o que ele decidir dizer,
depois de ele decidir.

**Ela não escreve para quem sumiu.** Sete dias sem resposta é
`/vagas:retomar-contato`, que tem cadência, teto e a regra da terceira
retomada. Escrever de novo por fora é como se gasta um contato.

**Ela não candidata.** Mandar o currículo para o e-mail que o anúncio dá **é
candidatura**, e tem tela, registro e teto próprios: `/vagas:candidatar`. E ela
não escreve currículo — `/vagas:montar-curriculo`.

**Ela não procura gente.** Não abre link, não busca o nome do recrutador na
rede: não há ferramenta de web no `allowed-tools` dela, e é de propósito.
Contato nasce de quem falou com ele, ou de quem o anúncio nomeia.

**Ela não inventa proximidade nem entusiasmo.** Não diz que acompanha a empresa
há anos, não diz que usa o produto se isso não está escrito em lugar nenhum, e
não usa primeiro nome de quem assina com sobrenome. Cada uma dessas parece
detalhe e é a frase que a pessoa lembra.
