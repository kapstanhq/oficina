---
name: estudar-conta
description: >-
  Lê o que é público sobre uma conta — site, página de imprensa, vaga aberta,
  perfil no LinkedIn — e grava **fato com procedência** no arquivo dela: setor,
  tamanho, sistema que usam, o que mudou, e quem decide. O que não achar vira
  `?` com a pergunta ao lado, nunca uma estimativa. Mede a conta contra o
  `perfil.md` e diz se ela passa, sem concluir sozinha que ela serve. Grava
  `contas/<id>-<apelido>.md`, o `_indice.md` e o bruto de cada página que leu.
  Use quando o prospector disser "estuda essa empresa", "o que você acha
  dessa conta", "vale a pena abordar", "manda o que der para saber deles",
  "quem decide nessa empresa", "acha o e-mail do fulano", "entra essa aqui",
  ou colar um site, um CNPJ ou um perfil. Não é ela que escreve a mensagem
  (/prospeccao:escrever-abordagem), nem que define quem vale a pena
  (/prospeccao:perfil-de-cliente).
license: MIT
compatibility: >-
  Precisa de ferramenta de web para abrir link — sem ela, trabalha com a página
  colada e diz isso em uma linha. Precisa de carteira para gravar; sem carteira
  a ficha sai na tela e o `## Guardei` diz que nada foi gravado. Lê o
  `perfil.md` para medir a conta: se ele não existir, ela estuda do mesmo jeito
  e avisa que não tem contra o que medir.
allowed-tools: Read Glob Grep Write Edit WebFetch WebSearch
---

# Estudar a conta

## 1 · O que ela faz, e o que ela não faz

Ela transforma **o que qualquer um pode ler** em fato com data e origem. É a
skill que faz a abordagem seguinte mostrar leitura em vez de template — e é a
única deste pack que abre link.

**Ela nunca conclui que a conta serve.** Ela mede contra o `perfil.md`, mostra
onde bate e onde não bate, e para: quem decide se uma conta serve é gente. Essa
é a exceção escrita do contrato §5 — **ela pergunta mesmo em
`modo: automatico`**.

**Ela nunca inventa.** Faturamento que não é público entra `?`. Número de
funcionários que o LinkedIn não mostra entra `?`. "Provavelmente umas 200
pessoas" não existe: `?` é a linha mais útil do arquivo, porque é a pergunta da
próxima reunião. Dado inventado aqui vira frase errada na abordagem, e a pessoa
do outro lado sabe o número dela melhor que você.

## 2 · Antes de tudo

1. lê `~/carteira/INDICE.md` — `references/contrato/10-0-comeca-e-termina.md`
   diz como começar. Não existe: uma linha e `/prospeccao:comecar`
2. lê a linha `modo:`
3. **lê `~/carteira/perfil.md`.** É contra ele que a conta é medida no passo 5.
   Não existe: siga, e diga em uma linha que sem ele não há contra o que medir,
   e que `/prospeccao:perfil-de-cliente` leva uns dez minutos
4. lê `contas/_indice.md` — **a conta já está lá?** Se estiver, isto não é
   entrada nova: é atualização, e o passo 4 diz o que fazer com o que mudou

O formato da ficha está em `references/contrato/04-4-arquivo-de-conta.md`, as
três regras em `references/contrato/03-0-as-tres-regras.md`, o teto em
`references/contrato/09-0-os-tetos.md`, o formato da linha que ela grava em
`contas/_indice.md` está em `references/contrato/04-6-os-dois-indices.md`, e
o gabarito vazio em `references/modelos/conta.md`.

## 3 · O modo

`copiloto` — para nas bifurcações: qual das duas empresas de mesmo nome, se
cria a conta que não passa no perfil, qual dos três nomes é quem decide.

`automatico` — escolhe e declara (contrato §5), **com uma exceção que não se
negocia**: dizer que a conta serve continua sendo dele. Ela lista o que achou,
mostra o que bate e o que não bate no perfil, e para. É a exceção escrita do
contrato, e ela diz isso em uma linha, sem pedir desculpa.

## 4 · O passo a passo

### Passo 1 · O que ele deu

Três entradas, e as três terminam com uma ficha:

```
um link                  siga
um nome de empresa       procure o site oficial primeiro. Achou mais de um
                         candidato? Mostre os dois com a cidade e pergunte —
                         duas empresas de mesmo nome é o erro que só aparece
                         na reunião
o site voltou nada,      site que só monta a página por JavaScript devolve
ou só menu e rodapé      vazio. Diga na cara — “esse site não abre para mim” —
                         e peça a página colada. NÃO chute dado de conta
```

### Passo 2 · Onde olhar, nesta ordem

**Pare quando tiver o suficiente para a abordagem.** Estudo que abre doze
páginas é meia hora que termina com uma ficha grande e uma mensagem igual à de
sempre. O suficiente é: o que a conta faz, o tamanho, um gancho com data, e um
nome com cargo.

```
1  o site                   o que ela faz, em uma linha. A página "sobre",
                            "clientes" e o rodapé, que é onde mora o CNPJ

2  a página de imprensa     notícia com DATA. É o gancho mais barato que
   ou o blog                existe, e o que mais envelhece: notícia de seis
                            meses não é gancho, é constrangimento

3  as vagas abertas         a mais reveladora das quatro. Vaga aberta é
                            orçamento aprovado para um problema, e o texto
                            dela diz qual sistema eles usam e o que está
                            faltando

4  o LinkedIn da conta      número de funcionários e quem tem o cargo que o
   e do contato             perfil.md procura
```

**Cada página que virar fato vira um arquivo em `_bruto/`** (contrato §4.7),
com o cabeçalho de três linhas e o texto como veio:
`AAAA-MM-DD-<canal>-<apelido-curto>.md`, como
`2026-08-12-linkedin-carla.md`. Grave o bruto **antes** de extrair: se algo
der errado no meio, o material já está salvo.

### Passo 3 · O que é fato, e o que não é

A regra 2 vale campo a campo, e aqui ela é a skill inteira:

```
funcionários: ?  ← olhar no LinkedIn da conta
faturamento: ?  ← não é público; perguntar na reunião
```

Três coisas que parecem fato e não são:

- **“líder de mercado”, “referência no setor”, “+500 clientes”** — é o próprio
  site falando de si. Se entrar, entra como `← site, <data>`, e a abordagem não
  cita número que a empresa publicou sobre si mesma
- **faturamento de site de terceiro** — os agregadores estimam, e a estimativa
  vira “sei que vocês faturam X” numa mensagem para quem sabe que não. `?`
- **cargo tirado de organograma velho** — cargo em empresa média muda mais
  rápido do que se imagina. A procedência com data é o que salva: `← LinkedIn,
  2026-08-12`

**O `## O que abre a conversa` é a única seção em que uma linha pode ser
leitura sua** — “vaga aberta é orçamento aprovado para o problema” — e mesmo
ela leva `← prospector, <hoje>`. É o que deixa você saber, dois meses
depois, o que era dado e o que era aposta.

### Passo 4 · Gravar

**Conta nova:** id sequencial (contrato §2) — o primeiro é **`E-001`**, e não
há um segundo prefixo. Apelido `<empresa>, <cidade>`, ficha pelo gabarito de
`modelos/conta.md`, uma linha em `contas/_indice.md`, e o `## Quanto tem` do
`INDICE.md` recontado.

**Conta que já existia:** campo a campo. O que estava `?` ganha o valor com a
procedência; valor diferente do que estava lá, **o novo vale e o antigo desce
para `## Histórico`** com a procedência que tinha — nada se apaga (regra 2). Em
copiloto, mostre os dois antes de trocar.

**Achou gente?** Cada pessoa com cargo vira uma linha em `## Quem decide` da
conta. Vira ficha de contato — `contatos/<id>-<apelido>.md` — **só quem
o prospector vai abordar**: ficha de pessoa é dado pessoal, e o contrato
§3.1 diz que o mínimo necessário é a regra, não o zelo. Na dúvida, pergunte
qual dos três é o certo.

### Passo 5 · Medir contra o perfil, e parar

Mostre o resultado em três blocos curtos, nesta ordem:

```
bate            os critérios do perfil.md que a conta atende, com o dado que
                prova cada um

não bate        os que ela não atende, com o dado. Se cair em
                ## O que desqualifica, diga isso primeiro e em uma linha

não deu para    os critérios que ficaram `?`, com onde se descobre cada um.
medir           É esta lista que vira o ## Falta saber
```

E então **pare**. A frase que fecha é uma, e ela não pede desculpa:

> Isso é o que dá para saber de fora. Se ela serve, quem diz é você — e o que
> falta para ter certeza está em “não deu para medir”.

**Conta que cai em `## O que desqualifica`:** ela **não** é criada em silêncio
nem descartada em silêncio. Mostre o critério que a derrubou, com a linha do
perfil, e pergunte: entra assim mesmo, entra como `fora do perfil`, ou não
entra? Em automático, ela entra com `estado: fora do perfil` e a escolha vai
para `## Decidi sozinho`, com como desfazer.

## 5 · O que perguntar, e como

Três perguntas por execução, no máximo (contrato §8). As que mais valem:

- **qual das duas empresas de mesmo nome** — antes de gravar qualquer coisa
- **qual dos nomes é quem decide** — quando o LinkedIn devolve três cargos
  parecidos
- **entra assim mesmo?** — quando ela não passa no perfil

**Quando não perguntar:** o dado está no `perfil.md`, está na ficha, ou é
detalhe que não muda a abordagem. Aí deixe `?` e siga — `?` é barato, pergunta
é cara.

## 6 · O formato da saída

Os três blocos do passo 5, a ficha inteira na tela **na primeira vez que a
conta entra** (é quando ele vê o formato), e o fecho do contrato §10:

## Guardei
- ~/carteira/contas/E-071-vetorbank.md — criada, 7 campos e 2 `?`
- ~/carteira/contas/_indice.md — uma linha nova
- ~/carteira/_bruto/2026-08-12-linkedin-carla.md — a página, como veio
- ~/carteira/INDICE.md — contagens

## Falta saber
- o e-mail da P-017 (Carla Menezes) — o LinkedIn não mostra
- quem aprova orçamento de projeto no E-071 (VetorBank, Porto Alegre)

## 7 · Onde ela para

**Ela não decide se a conta serve.** Quem decide isso é gente, e é a exceção
escrita do contrato §5: ela pergunta mesmo no automático. A conclusão é de
quem vende, e é na reunião.

**Ela não escreve mensagem nenhuma.** Nem rascunho, nem “um exemplo de como
seria”. A abordagem é de `/prospeccao:escrever-abordagem`, que lê o
`nao-perturbe.md` antes — e esta aqui não lê.

**Ela não define o perfil.** Se o estudo mostrar que o perfil está errado, ela
diz isso em uma linha, em `## Falta saber`, e manda para
`/prospeccao:perfil-de-cliente`. Mudar a régua no meio de medir é como se perde
a régua.

**Ela não lê o que não é público.** Nada de dado atrás de login, de base
comprada, de “enriquecimento”. E nada de dado sensível ou pessoal fora do
profissional — contrato §3.1, e ali está escrito por quê.

**Ela não abre mais de seis páginas por conta.** Passou disso, ela para, diz o
que leu e o que deixou de ler, e grava o que tem. Varredura de trinta páginas é
uma execução de meia hora que termina com o prospector sem saber o que
mudou.

**Ela não promete prazo** de jurídico, de compras ou de segurança da
informação, e não afirma o que a conta vai fazer. O que está no arquivo é o
que alguém publicou, com a data.
