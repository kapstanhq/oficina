---
name: escrever-abordagem
description: >-
  Escreve a mensagem para um contato — a primeira abordagem ou a resposta ao
  que ele respondeu — a partir do que a carteira já sabe: o gancho com data, o
  cargo dele, e o que já foi mandado antes. **Lê o `nao-perturbe.md` antes de
  escrever qualquer coisa e recusa quem está lá**, nos dois modos. Toda
  afirmação da mensagem sai de um campo com procedência; o que não tem, não
  entra. Grava uma linha em `## O que já mandei` do contato e o `_indice.md`.
  Use quando o prospector disser "escreve para o fulano", "manda a
  abordagem", "o que eu digo para essa conta", "ele respondeu, e agora",
  "escreve o e-mail", "faz a mensagem do LinkedIn", "responde essa objeção",
  "ele perguntou o preço". Não é ela que estuda a conta
  (/prospeccao:estudar-conta), nem que decide quem abordar
  (/prospeccao:perfil-de-cliente), nem que escreve para quem sumiu
  (/prospeccao:retomar-contato).
license: MIT
compatibility: >-
  Precisa da carteira: sem ela não há `nao-perturbe.md`, e aí a skill escreve a
  mensagem e DIZ, em uma linha, que não conferiu a lista — quem confere é o
  prospector, antes de mandar. Sem conector ela entrega o bloco para copiar,
  que é o padrão em toda ferramenta. Com conector de WhatsApp, manda uma por
  vez, depois de ele ver o texto e o destinatário — e a primeira abordagem
  quase nunca sai por lá (contrato §7.1).
allowed-tools: Read Glob Grep Write Edit
---

# Escrever a abordagem

## 1 · O que ela faz, e o que ela não faz

Ela escreve **uma** mensagem, para **uma** pessoa, com o que está escrito na
carteira sobre a empresa dela. É o produto do pack, e é também o lugar onde o
pack mais recusa.

**A recusa é o produto tanto quanto a mensagem.** Quem está no
`nao-perturbe.md` não recebe nada — nem rascunho, nem “para você ver e
decidir”. Um rascunho que existe é um rascunho que alguém manda por engano, e
a diferença entre prospecção e spam mora exatamente aí. O contrato §3.1 e o
§7.2 dizem por quê, e o §7.2 diz como se compara.

**Ela não escreve o que a carteira não sabe.** Se o gancho é `?`, a mensagem
não sai com “vi que vocês estão crescendo”. Sai o que falta para haver
mensagem, em uma linha — e o caminho é `/prospeccao:estudar-conta`.

## 2 · Antes de tudo

Nesta ordem, e **o degrau 3 não se pula em modo nenhum**:

1. lê `~/carteira/INDICE.md` — `references/contrato/10-0-comeca-e-termina.md`
   diz como começar. Não existe: escreve a mensagem, e o passo 6 diz o que ela
   avisa
2. lê a linha `modo:` e a linha `envio:`
3. **lê `~/carteira/nao-perturbe.md` INTEIRO** e compara **id, e-mail, telefone
   e domínio** com o destinatário. Bateu: pare aqui, e o passo 5 diz o que
   dizer. O formato está em `references/contrato/07-2-nao-perturbe.md`
4. lê o arquivo do contato — `references/contrato/04-5-arquivo-de-contato.md`:
   `cargo:`, `canal:`, `etapa:`, `## O que ele me disse` e, sobretudo,
   `## O que já mandei`
5. lê o arquivo da conta — `## O que a conta faz` e `## O que abre a conversa`
6. lê `~/carteira/perfil.md`, para saber por que essa conta está na carteira

A base legal está em `references/contrato/03-1-a-base-legal.md`, o formato do
que sai em `references/contrato/06-0-o-que-sai.md`, e o envio em
`references/contrato/07-1-a-mensagem-sai.md`.

## 3 · O modo

`copiloto` — mostra o texto, o destinatário e o gancho, e espera.

`automatico` — escolhe o gancho e o canal sozinha e declara em
`## Decidi sozinho`. **O que ele não muda é o envio**: quem diz se a mensagem
sai sem perguntar é a linha `envio:` do `INDICE.md`, e o padrão dela é
`pergunta sempre` (contrato §7.1). Quem ligou o automático para o
texto de abordagem não ligou para a boca dele.

E há uma coisa que nenhum dos dois modos muda:

**`/prospeccao:escrever-abordagem` lê o `nao-perturbe.md` antes de escrever
qualquer coisa, nos dois modos, e não escreve para quem está lá.** Não é uma
escolha do modo: é o art. 18 da LGPD, e quem pediu para não ser procurado
pediu ao ofício inteiro. Ela diz isso em uma linha, sem pedir desculpa.

## 4 · O passo a passo

### Passo 1 · A recusa, que vem antes de tudo

Compare o destinatário com o `nao-perturbe.md` por **quatro chaves**: o id, o
e-mail, o telefone e o domínio. Bateu qualquer uma, a saída é esta — **com o
fecho da seção 10, que não some nem aqui**:

```
Não escrevi. A P-017 (Carla Menezes) está no nao-perturbe.md desde 02/07 —
ela pediu, por e-mail, com estas palavras: “me tira dessa lista”.

Pedido de silêncio não tem retomada e não tem gancho novo. Se ela procurar
você, aí é outra conversa, e a linha sai daqui com você me dizendo.

## Guardei
- nada foi gravado — não houve mensagem, e escrever é o que vira linha em
  `## O que já mandei`
```

**O `## Guardei` é o mais importante desta saída.** Quem lê precisa saber que
a carteira **não** mudou, e o título é este — `## Não gravei nada` é título
inventado, e título inventado é o que a seção 4 proíbe. É o defeito que a
prova pegou na primeira execução desta skill: ela recusou certo, explicou
certo, e disse “não gravei nada” em prosa.

Sem carteira não há lista, e aí ela escreve **e avisa**, em uma linha, antes do
bloco: “não conferi o não-perturbe: aqui eu não chego nele”. É a única coisa
deste pack que não se degrada em silêncio, porque a consequência dela não é
do prospector.

### Passo 2 · Qual mensagem é esta

Três casos, e eles não se misturam:

```
primeira abordagem    etapa `a abordar`, e ## O que já mandei está vazio.
                      Precisa de gancho com data (passo 3)

resposta              etapa `respondeu`, e a última linha de ## O que já
                      mandei é dele. Aqui não se procura gancho: o gancho é
                      o que ele perguntou, e a mensagem responde

quem sumiu            abordado e sem resposta há mais de 7 dias. NÃO é aqui:
                      é `/prospeccao:retomar-contato`, que tem cadência, teto
                      de retomadas e a regra da terceira. Diga isso e pare
```

### Passo 3 · O gancho, e ele tem data

Procure nesta ordem e **pare no primeiro que existir**:

```
1  mudou agora                  o `## O que abre a conversa` da conta tem
                                linha com data dos últimos 90 dias: vaga
                                aberta, troca de sistema, rodada, aquisição
2  o cargo dele explica         o `cargo:` do contato é dono do problema que
                                você resolve — e o perfil.md diz que é esse
                                cargo que decide
3  alguém em comum              o `de onde veio` é indicação, evento ou um
                                post que ele comentou. É o gancho mais forte
                                que existe, e o mais raro
4  o que ele já perguntou       só quando NÃO é primeira mensagem: a última
                                linha de `## O que já mandei` é dele, e a
                                resposta é o gancho
5  nenhum                       NÃO escreve mensagem
```

**O gancho tem data, e a data envelhece.** Mais de 90 dias entre o fato e a
mensagem: ela avisa antes de escrever — “a vaga é de maio, e maio já passou” —
e oferece `/prospeccao:estudar-conta` para achar coisa nova. Notícia velha citada
como novidade diz, com todas as letras, que ninguém olhou.

**Nenhum gancho?** A saída não é uma mensagem: é **o que falta para haver
uma**, em uma linha — “o arquivo da conta não tem `cargo:` nem
`## O que a conta faz`, então não dá para saber o que dizer que interesse a
ele”.

### Passo 4 · Escrever

O formato é o do contrato §6, e o tamanho é este:

```
Carla, vi que o VetorBank abriu vaga para analista de risco de crédito.

Montei painel de inadimplência por safra para duas financeiras do mesmo porte —
nos dois casos o fechamento do mês caiu de nove dias para dois.

https://vasquesanalytics.com.br/casos/safra

Vale uma conversa de 20 minutos na semana que vem? Terça ou quinta?
```

Quatro coisas que essa mensagem faz, e que a régua cobra:

- **diz quem você é e por que está escrevendo** — é a finalidade informada do
  §3.1, e ela cabe na primeira linha
- **o gancho vem antes da oferta**, e ele é sobre a empresa dele, não sobre
  você. A primeira linha que fala de você é a terceira
- **um número, e ele é seu** — o resultado que você entregou, não o que a
  empresa dele fatura. Número sobre a empresa dele numa primeira mensagem é
  ou público (e ele sabe) ou errado (e ele sabe)
- **uma pergunta só, fácil de responder** — duas opções de horário batem “o
  que acha?”, e as duas batem qualquer pergunta aberta

O que não entra, além do que o §6 já proíbe: “espero que esteja bem”, “passando
para saber”, “sei que sua agenda é corrida”, “rapidinho”, “sem compromisso”,
promessa de percentual, e qualquer coisa que soe como se você conhecesse a
operação dele por dentro. **E nada de “conforme conversamos” quando não houve
conversa** — é a mentira que mais aparece em template e a que mais custa.

**Toda afirmação sai de um campo com procedência:**

```
> Tudo o que a mensagem afirma veio do arquivo do E-083 (Móveis Bertoldo, Bento
> Gonçalves) — a vaga de controladoria de 15/08, o ERP novo de junho. Gancho da
> vez anterior: o ERP. Este é gancho novo.
```

Campo com mais de 90 dias: cite mesmo assim e **avise na margem**, fora do
bloco — “o número de funcionários é de 12 de julho; confira antes de mandar”.

### Passo 5 · O canal decide o tamanho

```
e-mail       o do §6. Assunto de até oito palavras, sem “Re:” de mentira.
             É o canal da primeira abordagem, e é onde cabe o caso

LinkedIn     mais curto que o e-mail: quatro linhas, um link no máximo, e
             a pergunta no fim. Sem anexo, sem negrito

WhatsApp     só depois que ele respondeu por lá. Quem nunca te escreveu não
             recebe pela ponte, e salvar o número não muda nada (§7.1) —
             nem é falha da ferramenta: é o próprio WhatsApp que recusa
```

O canal padrão está em `## Como eu trabalho` do `INDICE.md`; o do contato, em
`canal:`. **O do contato vence**, e quando os dois divergem ela diz por quê em
uma linha.

### Passo 6 · Gravar, e só então oferecer o envio

Grave **antes** de oferecer mandar, e grave o que é verdade:

- uma linha em **`## O que já mandei`** do contato, com data, canal e **o
  gancho usado** — e não em `## Onde trabalha`, que é onde mora a
  conta dele e não o que saiu para ele. É esta linha que impede a próxima
  mensagem de repetir o gancho, e ela entra mesmo quando quem manda é ele:
  escrever também é um fato
- `etapa:` muda de `a abordar` para `abordado`, com a data de hoje, e o
  `funil.md` muda junto (contrato §4.3)
- `último contato` do `contatos/_indice.md`

O bloco sai sozinho, em cerca de código, pronto para copiar, sem comentário
dentro. E as três saídas do §6:

```
Eu mesmo mando     você copia o bloco e cola
Mando agora        eu envio, depois de você ver o texto e o destinatário
Mudo o texto       você diz o que trocar, e nada sai agora
```

## 5 · O que perguntar, e como

No máximo duas perguntas, e as duas mais úteis são:

- **qual dos ganchos**, quando há dois com data parecida — com o custo escrito
  em cada opção
- **o e-mail dela**, quando o campo está `?` e o canal é e-mail. Uma vez, com o
  motivo na mesma frase (contrato §8)

**Quando não perguntar:** o gancho é claro, o canal está escrito, o tom já foi
decidido em `## Como eu trabalho`. Escrever e mostrar bate perguntar como
escrever — o texto na tela é a pergunta mais barata que existe.

## 6 · O formato da saída

O bloco, sozinho, e o fecho do contrato §10:

## Guardei
- ~/carteira/contatos/P-017-carla-menezes.md — uma linha em
  `## O que já mandei`, e a etapa para `abordado`
- ~/carteira/funil.md — a P-017 (Carla Menezes) mudou de etapa
- ~/carteira/contatos/_indice.md — último contato

## Falta saber
- se a P-017 (Carla Menezes) é mesmo quem decide, ou se ela leva para outra pessoa

## 7 · Onde ela para

**Ela não escreve para quem está no `nao-perturbe.md`.** Em modo nenhum, com
pedido explícito nenhum, nem “só um rascunho”. Se o prospector insistir,
ela diz uma vez o que a lista significa e continua não escrevendo: quem pediu
silêncio pediu ao ofício inteiro, e a skill não é dona desse pedido.

**Ela não manda em lote.** Uma conversa por chamada. Mostrar quatro mensagens
diferentes numa tela **não** é lote (§7.1) — lista de transmissão é, e ela não
existe neste pack.

**Ela não estuda a conta.** Se falta gancho, ela diz o que falta e manda para
`/prospeccao:estudar-conta`. Não abre link: não há ferramenta de web no
`allowed-tools` dela, e é de propósito — ela trabalha com o que já está apurado,
com a data da procedência.

**Ela não escreve para quem sumiu.** Sete dias sem resposta é
`/prospeccao:retomar-contato`, que tem cadência, teto e a regra da terceira
retomada. Escrever de novo por fora é como se queima um contato.

**Ela não decide preço nem promete prazo** de jurídico, de compras ou de
segurança da informação. Perguntaram o preço? A resposta que marca reunião é
o tamanho do projeto e o próximo passo —
o número é do prospector, e ela diz isso em uma linha.

**Ela não inventa proximidade.** Não diz que leu um post que não está em
`_bruto/`, não diz que foram apresentados por alguém que não está na ficha, e
não usa primeiro nome de quem assina com sobrenome. Cada uma dessas parece
detalhe e é a frase que a pessoa lembra.
