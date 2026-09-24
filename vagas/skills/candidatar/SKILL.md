---
name: candidatar
description: >-
  Prepara a candidatura a UMA vaga: lê a vaga, o perfil, a trajetória e
  `## O que NÃO se diz`, escolhe o currículo, responde as perguntas do
  formulário só com o que a trajetória responde — o resto fica `?`, para o
  candidato —, e mostra tudo numa tela antes de qualquer coisa sair. Com o
  navegador ligado, preenche os campos na frente dele. Quem aperta ENVIAR é a
  linha `envio de candidatura:` do INDICE.md: no padrão ela para com o botão
  na tela; no outro, que só ele liga, aperta depois do sim dele no painel,
  e só registra se a página confirmar. A vaga vira `candidatada`, com o que saiu
  em `_bruto/`. Use quando o candidato disser "me candidata
  nessa", "vamos aplicar para a V-012", "preenche o formulário", "responde as
  perguntas da vaga", "escreve a carta", "manda meu currículo para eles", "já
  enviei, registra". Não é ela que acha a vaga (/vagas:buscar-vagas), nem que
  julga (/vagas:triar-vagas), nem que escreve o currículo
  (/vagas:montar-curriculo), nem que cobra resposta (/vagas:retomar-contato).
license: MIT
compatibility: >-
  Precisa da busca, com a vaga, o `perfil.md` e a `trajetoria.md`: sem a
  trajetória ela não responde nada em nome dele. Sem o conector de navegador,
  ele cola as perguntas e ela entrega as respostas para colar — é o caminho
  de sempre, e funciona em toda ferramenta. Com ele, preenche na frente do
  candidato; apertar enviar depende da linha `envio de candidatura:` e do
  sim no painel. Sem painel, a mesma tela sai em texto e o envio é dele.
allowed-tools: Read Glob Grep Write Edit
---

# Candidatar

## 1 · O que ela faz, e o que ela não faz

Ela prepara **uma** candidatura, inteira — as respostas, o texto livre, o
currículo certo —, e **mostra tudo junto antes de qualquer coisa sair**. É o
roteiro do contrato §12.1, e a tela não é zelo: candidatar-se é responder em
nome dele, numa conta que é dele, num lugar de onde não dá para voltar atrás.

**Quem aperta enviar é a linha `envio de candidatura:` do `INDICE.md`**, e ela
tem dois valores:

```
eu aperto                    o padrão. Ela preenche e PARA com o botão na
                             tela, dizendo o que falta. Ele envia, e a vaga
                             só vira `candidatada` quando ele DIZ que enviou
aperta depois de eu          o sim dele àquela candidatura, na tela inteira
aprovar no painel            do painel, É a decisão. Só então ela aperta “Enviar
                             candidatura”, CONFERE na página que o envio foi
                             confirmado, e registra
```

**A decisão é dele nos dois casos, e a linha é dele.** Ela não troca a linha
por conta própria, não troca “só desta vez que é urgente”, e não trata pedido
falado — “pode mandar” — como troca de regime: com `eu aperto` escrito, o
botão continua sendo dele, e ela diz em uma linha onde se muda isso.

Os termos de quase toda rede e de quase todo portal proíbem automação agindo
dentro de uma conta logada, e o que se arrisca é a conta — que, para quem
procura emprego, é o ativo. Uma candidatura por vez, com a tela inteira lida
antes e o teto do dia valendo, é a mesma cadência de uma pessoa. Quarenta
numa hora não é, e isso nenhum regime autoriza.

**O envio é desligado por padrão, e liga-se por uma linha que ELE escreve.**
Pediu a ela para ligar? Ela mostra o aviso do risco — UMA vez, é o ato de
trocar a linha — e a linha exata, e para: quem a escreve no `INDICE.md` é ele.
Ela nunca escreve `aperta depois de eu aprovar no painel`. Depois disso ela
obedece, sem sermão em cada candidatura.

**E cada envio passa pela aprovação dele NO PAINEL.** Com o envio ligado, o sim
que autoriza o clique é o botão “Preencher e enviar” da tela do passo 5,
daquela candidatura. Sem painel na sessão não há esse sim: ela preenche e para
com o botão na tela, como em `eu aperto`, e diz em uma linha por quê.

**Ela nunca responde por aproximação.** Pergunta que a `trajetoria.md` e o
`perfil.md` não respondem fica `?` — é o campo que só ele sabe. “Uns cinco
anos”, “inglês avançado” porque a vaga pedia, pretensão tirada da faixa do
anúncio: cada uma dessas é uma resposta que ele vai ter de sustentar numa
entrevista sem saber que deu.

**“Ficou pronto” não é “foi”.** A vaga vira `candidatada` quando ele DIZ que
enviou (`eu aperto`) ou quando a PÁGINA confirma o envio (o outro regime).
Formulário preenchido e não enviado não muda etapa nenhuma, e “apertei” sem
confirmação na tela também não.

## 2 · Antes de tudo

1. lê `~/busca/INDICE.md` — `references/contrato/10-0-comeca-e-termina.md` diz
   como começar. Não existe: uma linha e `/vagas:comecar`
2. lê `modo:`, `envio:`, `## Quem sou` e, em `## Como eu trabalho`, duas
   linhas: **`quantas candidaturas por dia:`** — o passo 1 é sobre ela — e
   **`envio de candidatura:`**, que decide quem aperta o botão no passo 6. A
   linha não existe no arquivo: o valor é **`eu aperto`**, que é o padrão do
   contrato. Valor que você não reconhece também é `eu aperto`, e vira linha
   em `## Falta saber`
3. lê o arquivo da vaga em `vagas/`, e confere duas coisas antes de qualquer
   trabalho:
   - **`estado: fechou`** — não candidata. Diz em uma linha que a vaga saiu do
     ar, quando, e que aposentar é com `/vagas:organizar-busca`
   - **`etapa:`** — `salva` é o caso normal. `nova` **não foi julgada por
     ele**: pergunte antes — “essa ainda não passou por você; julgo agora com
     `/vagas:triar-vagas`, ou você já decidiu que vale?”. `candidatada` ou
     adiante: mostre a linha de `## Candidatura` que já existe e pare —
     candidatar-se duas vezes à mesma vaga é o erro que o recrutador vê
     (contrato §2). A vaga não está na busca: peça o link ou o anúncio, e
     `/vagas:buscar-vagas` a traz
4. lê `~/busca/perfil.md` — `## Quanto` e `## Descarto`
5. **lê `~/busca/trajetoria.md` inteira, e `## O que NÃO se diz` primeiro.** Não
   existe: ela **não responde nada em nome dele**. Uma linha e
   `/vagas:perfil-de-busca`
6. lê `curriculos/` — existe o `V-012-cv.md` desta vaga? o `CV-base.md`?
7. chama `conectores_estado`, uma vez — `references/conectores.md` diz como ler
   a resposta. O que importa aqui: `navegador` e `email-pessoal`. Se as
   ferramentas não existem na sessão, siga sem: é o caminho normal

O roteiro está em `references/contrato/12-1-a-candidatura.md`; o que é dele e o
que nunca entra, em `references/contrato/03-1-o-que-e-seu.md`; a trajetória e
as regras do que se afirma, em
`references/contrato/12-0-a-trajetoria-e-o-curriculo.md`; o arquivo da vaga em
`references/contrato/04-4-arquivo-de-vaga.md`, o do contato em
`references/contrato/04-5-arquivo-de-contato.md`, o funil em
`references/contrato/04-3-funil.md`, o `hoje.md` em
`references/contrato/04-2-hoje.md`, os índices em
`references/contrato/04-6-os-dois-indices.md`, o perfil em
`references/contrato/04-9-o-perfil.md`, o bruto em
`references/contrato/04-7-o-bruto.md`, a tela do envio em
`references/contrato/07-1-a-mensagem-sai.md`, e o gabarito do contato em
`references/modelos/contato.md`. A vaga é do LinkedIn: o modal da candidatura
simplificada, o ritmo e o que não se clica estão em `references/linkedin.md`.

## 3 · O modo

`copiloto` — para nas bifurcações: qual currículo, o que fazer com o campo que
a trajetória não responde, por onde sai quando a vaga aceita formulário e
e-mail.

`automatico` — escolhe e declara em `## Decidi sozinho` (contrato §5): qual
currículo usou, que tom deu à carta. Em automático a tela do passo 5 aparece
do mesmo jeito: não é pergunta de modo, é a leitura que o contrato §3.1 exige
antes de algo sair em nome dele.

**`modo:` NÃO decide quem aperta o botão.** São duas linhas e duas perguntas:
o modo decide quanto ela pergunta no caminho; `envio de candidatura:` decide
quem executa o último clique. As quatro combinações existem, e nenhuma delas
dispensa a tela do passo 5:

```
copiloto   · eu aperto        pergunta no caminho, e ele envia
copiloto   · aperta depois    pergunta no caminho, e ela envia depois do sim
automatico · eu aperto        escolhe e declara, e para com o botão na tela
automatico · aperta depois    escolhe e declara, e ainda assim ESPERA o sim
                              daquela candidatura. Automático não é sozinho
```

E três coisas continuam sendo dele em qualquer combinação: o `?`, a pretensão,
e o **sim daquela candidatura**.

## 4 · O passo a passo

### Passo 1 · O teto do dia

Conte as candidaturas de hoje: as linhas de `## Candidatura` com a data de
hoje, nos arquivos de `vagas/`. Bateu no número de `quantas candidaturas por
dia:`:

```
copiloto      diga o número e de onde ele vem — “já saíram 3 hoje, e o seu
              teto é 3 (INDICE.md, ## Como eu trabalho)” —, e que a razão do
              teto é a hora de leitura que cada uma custa. Ele disse para
              seguir assim mesmo: siga. O teto é dele, e a skill avisa UMA
              vez. O que ela não faz é passar do teto por conta própria
automatico    não prepara. Uma linha em `## Falta saber`, e a vaga vira caixa
              no `hoje.md` de amanhã
```

### Passo 2 · O currículo

```
existe curriculos/V-012-cv.md      é ele. Confira a primeira linha: se a
                                   trajetória mudou depois, diga, e ofereça
                                   refazer
só existe o CV-base.md             copiloto: pergunte, com o custo — “mando o
                                   base agora, ou adapto para esta vaga com
                                   /vagas:montar-curriculo, uns dez minutos?”
                                   automatico: use o base e declare
não existe nenhum                  pare e mande para /vagas:montar-curriculo.
                                   Candidatura sem currículo não se prepara
```

Ela **não escreve currículo**, nem “um resumo rápido para o campo de texto”
tirado de cabeça: o que descreve a experiência dele sai de um currículo já
conferido contra a trajetória, ou da trajetória, linha por linha.

### Passo 3 · Juntar as perguntas

**Com `navegador: ligado`** — abra a página da vaga (`browser_navigate`, o
`link:` do arquivo) e LEIA o formulário (`browser_snapshot`): o rótulo de cada
campo, o tipo, as opções das listas, o que é obrigatório. Três paradas:

```
a página pede login            pare, e peça que ELE entre. Site com sessão
                               no painel (LinkedIn, Glassdoor, Gupy —
                               `conectores_estado`, conector `navegador`):
                               pelas Integrações, "Entrar", uma vez, e você
                               reabre a página; entrar na SUA janela morre
                               com a execução (D260). Site sem sessão
                               declarada: na sua janela, dizendo QUAL.
                               A skill não digita senha, não lê senha, não
                               guarda senha e não resolve captcha
o formulário só abre por um    “Candidatar-se”, “Apply”: botão com esse nome
botão de candidatura, e o      é ambíguo — em alguns portais ele abre o
portal não é o LinkedIn        formulário, em outros ENVIA com o perfil
                               salvo. Não clique. Peça que ele clique, e leia
                               o que abrir
a vaga saiu do ar              `estado: fechou  ← navegador, <hoje>` no
                               arquivo, e pare (item 3 de “Antes de tudo”)
```

**Portal com currículo único — a Gupy, a candidatura simplificada do
LinkedIn —: o que a empresa lê é o PERFIL dele no portal**, e não um anexo:
lá a candidatura costuma não pedir arquivo nenhum. Leia o perfil (resumo,
experiências, idiomas, se há currículo anexado) e compare com a trajetória
ANTES da tela do passo 5; divergiu ou está vazio, diga na `linha` da tela o
que está velho. Atualizar o perfil é mexer na conta por fora da candidatura:
só com o sim dele, numa tela própria, bloco a bloco — e na Gupy vale para
todas as candidaturas ativas, as já enviadas inclusive.

**Página que não se edita depois de gravada** — a Gupy mostra uma pergunta
por página, e o que se grava fica —: a tela desta página traz TODOS os
campos dela, inclusive o que só aparece com uma opção ("Outro → qual?"). Não
grave a opção e deixe o texto para depois: o depois não existe.

**A vaga é do LinkedIn, com candidatura simplificada** — aí o roteiro é o de
`references/linkedin.md`, e ele é o único lugar em que abrir o botão é
conhecido e seguro. A ordem, que não se inverte:

```
1  abre a vaga e o modal de “Candidatura simplificada”
2  PERCORRE os passos LENDO — em cada um, todos os campos do snapshot: o
   rótulo, o tipo, se é obrigatório, as opções, e o que o LinkedIn JÁ
   PREENCHEU sozinho a partir do perfil dele. “Avançar”, “Próximo” e
   “Revisar” andam e não enviam; nada além deles se clica nesta volta
3  junta TODAS as perguntas, de todos os passos, numa lista só
4  fecha o modal — e a resposta a “descartar ou salvar” é **salvar** —, ou o
   deixa aberto e parado, se ele estiver olhando
5  só então o passo 4 (responder) e a tela do passo 5
6  e só depois disso preenche, do primeiro passo ao último
```

**Ler antes de responder não é preciosismo: é o que impede a tela parcial.**
Mostrar quatro campos do passo 1 e descobrir mais seis no passo 3 é pedir duas
leituras para uma candidatura — e a segunda ele não lê. O que ele revisa é a
candidatura inteira, de uma vez.

**O que já veio preenchido conta como resposta**, e entra na tela com a
procedência `← já preenchido pelo LinkedIn`. As caixas que vêm MARCADAS —
“seguir a empresa” — entram como campo `sim-nao`, com a nota dizendo que
vieram assim: mostrar é da skill, decidir é dele.

**Sem navegador** — é o caminho de sempre, e não é o pior: peça que ele cole as
perguntas do formulário, do jeito que estão na tela. Se o conector existe e
está `desligado`, diga o `como_ligar` **uma vez** e siga sem ele.

**Candidatura por e-mail** — a vaga manda escrever para um endereço: não há
formulário. As “perguntas” são o que o anúncio pede no corpo (pretensão,
disponibilidade, portfólio), e o passo 6 é o do e-mail.

### Passo 4 · Responder, campo a campo

Cada resposta tem **uma origem escrita**, e é ela que aparece na tela:

```
nome, e-mail, telefone, cidade,      INDICE.md, ## Quem sou
perfil profissional, portfólio
cargo, empresa, período,             trajetoria.md — IGUAIS, caractere a
formação, ferramentas                caractere (contrato §12, regra 2)
idioma e nível — inglês, espanhol,   trajetoria.md, ## Idiomas — a palavra de
libras                               lá. A lista do portal não tem
                                     “intermediário”? Escolha a opção IGUAL
                                     ou a imediatamente ABAIXO, nunca a acima,
                                     e diga qual escolheu
“anos de experiência com X”          só se a trajetória permite CONTAR: X
                                     aparece numa experiência com período.
                                     Senão, `?`
regime, contrato, jornada,           perfil.md, ## Aceito
disponibilidade de mudança
pretensão                            perfil.md, ## Quanto — a frase de `o que
                                     eu digo quando perguntam:`. NUNCA o piso
                                     de contrato nenhum. A frase fala de outro
                                     contrato que o da vaga (CLT, e a vaga é
                                     PJ ou temporário)? É `?`, com a nota.
                                     A frase não cabe no campo (lista de
                                     faixas, só número): SUGIRA, abaixo
“por que esta empresa”,              texto livre — passo 4.1
“conte um projeto”
como soube da vaga                   `fonte` do `link:` do arquivo da vaga
CPF, RG, nascimento, endereço,       NÃO é da skill. O campo fica em branco na
foto                                 tela, marcado “é seu, na hora”, e ela não
                                     pergunta o valor. Contrato §3.1
gênero, raça/cor, deficiência,       INDICE.md, `autodeclaração, para
pronomes                             formulário:` — a opção IGUAL à que ele
                                     escreveu, e segue as condições dele
                                     (“vale também quando…”). A lista não tem
                                     a opção, ou a linha não fala do campo:
                                     “é seu, na hora”, como antes. Nada se
                                     deduz — pronome não sai de gênero (D256)
indicação                            só se o arquivo da vaga tem `contato:`
                                     com `papel: indicação`. Nome de
                                     referência não entra sem ele ter dito
                                     que pode
```

**O que não tem origem é `?`.** Sem exceção e sem “provavelmente”: o `?` é o
campo que só ele sabe, e a tela o destaca para isso.

**Sugestão é outra coisa: a decisão continua dele, mas ele não parte do
vazio** (D276). Quando o campo é escolha dele e há base escrita para propor —
a pretensão numa lista de faixas, um número único, a data de início —, o
campo vem PREENCHIDO com a proposta, `de: "sugestão — perfil.md · salário
relatado da vaga"`, e a `nota` diz a conta em uma ou duas linhas:

```
pretensão     a faixa que contém o MEIO da frase do perfil — ou a âncora
              que o perfil der para aquele caso (remoto, outra cidade). Com o
              `salário relatado:` da vaga ao lado (média, faixa e variável),
              para ele ver onde a proposta fica no que a empresa paga.
              NUNCA abaixo do piso, e nunca por conta do relatado: o
              relatado informa, quem ancora é o perfil
número único  o número da frase do perfil — o do meio, se ela é faixa
```

Sem base escrita, não há sugestão: é `?`. E dado sensível (contrato §3.1)
nunca ganha sugestão. Resposta que esbarra em
`## O que NÃO se diz` não sai — diga qual linha da lista ela contrariava.

**A vaga pede o que ele não tem** — pergunta eliminatória, “possui inglês
fluente? sim/não” — responde-se a verdade, e diz-se a ele, antes da tela: “esse
campo costuma eliminar sozinho; a resposta verdadeira é ‘não’. Ainda vale a
candidatura?”. É decisão dele, e é melhor tomada antes de uma hora de trabalho.

#### 4.1 · O texto livre — carta, mensagem, “por que você”

**A carta de apresentação é de `/vagas:montar-curriculo`** (contrato §12,
D273): ela mora em `cartas/V-012-carta.md`, com o PDF ao lado, e só vai se a
primeira linha disser `aprovada`. Campo de arquivo: anexa o PDF. Campo de
texto: a mesma carta, em até 1.400 caracteres — a que ele aprovou, encurtada
sem trocar número. Carta em
`rascunho`: mostre-a no passo 5 e pergunte se vale; sem o sim, o campo fica
vazio — opcional vazio é melhor que carta que ele não leu. Não existe carta e o
campo existe: diga em uma linha que ela sai de `/vagas:montar-curriculo`, e
siga sem ela.

O resto do texto livre — mensagem ao recrutador, “por que você”, “fale sobre
você” — é desta skill. Curto: de 600 a 1.000 caracteres, salvo o campo pedir
outra coisa. Três parágrafos, e cada afirmação sai de um campo com procedência:

```
1  quem é, em uma linha — `o que eu faço:` do INDICE.md — e por qual vaga
   escreve, com o nome que o anúncio usa
2  A prova que serve a ESTA vaga: uma linha de `## O que pesa a favor`, sustentada
   por uma linha da trajetória, com o número IGUAL. Uma, não três
3  o próximo passo, como pergunta que se responde em uma linha
```

Sem adjetivo sobre si, sem “sou apaixonado por”, sem elogio à empresa que não
saia de um fato lido em `## O que a vaga pede`. E **sem pretensão** — ela só
aparece se o anúncio pediu, e aí com a frase do perfil.

### Passo 5 · MOSTRAR tudo junto, antes de qualquer coisa

**Com painel, é uma tela só**, em `blocos` — o formato está em
`references/painel.md`, e o teto de três é exatamente o que esta tela usa:

```
bloco `vaga`        vista `ficha`       V-012 (PM de IA, Lumina Pagamentos):
                                        link, regime, contrato, jornada,
                                        idioma, encaixe, o que pesa contra
                                        — com a
                                        procedência de cada campo
bloco `respostas`   vista `formulario`  um campo por pergunta do formulário,
                                        NA ORDEM do formulário. `rotulo` é a
                                        pergunta como está no portal;
                                        `valor` é a resposta; `de` é a
                                        origem — “trajetoria.md”,
                                        “INDICE.md”, “perfil.md”; `?` onde
                                        falta; `obrigatorio` como no portal;
                                        `nota` para o que ele precisa saber
                                        — “a lista não tinha intermediário;
                                        marquei básico”, “é seu, na hora”;
                                        `comentar: true` em todo campo que
                                        você SUGERIU ou escreveu por ele
bloco `carta`       vista `texto`       o texto livre, com `editavel` ligado
```

E as ações do rodapé, com o rótulo do que vai acontecer — **e a forte muda de
nome com o regime**, porque o rótulo é a única coisa que ele lê antes de
apertar:

```
envio de candidatura: eu aperto
  Preencher no navegador    tom forte. Só existe com `navegador: ligado`
  Eu mesmo colo             sempre existe
  Não agora                 tom de recusa. Nada é gravado como candidatura

envio de candidatura: aperta depois de eu aprovar no painel
  Preencher e enviar        tom forte. Só existe com `navegador: ligado`
  Preencher e parar antes   sempre que há navegador — a saída de quem quer
  do envio                  olhar esta antes de mandar
  Eu mesmo colo             sempre existe
  Não agora                 tom de recusa. Nada é gravado como candidatura
```

**“Preencher e enviar” é o sim daquela candidatura**, e é por isso que ele
diz `enviar` em vez de `preencher`: rótulo que esconde o que o botão faz é o
que transforma uma aprovação em carimbo. A saída de parar antes existe nos
dois regimes — o regime é o padrão, não uma porta trancada.

O campo `obrigatorio` que ficou `?` segura o botão forte: é o painel dizendo
que falta o que só ele sabe. **Use o que VOLTOU, e não o que você mandou** —
`blocos.respostas.campos` e `blocos.carta.texto`. Ele mexeu numa resposta: a
dele vale. Ele escreveu um fato que a trajetória não tem: é afirmação dele, em
nome dele, e sai como ele escreveu — e vai, no mesmo turno, para
`_bruto/AAAA-MM-DD-painel-<vaga>.md` com `estado: ainda NÃO entrou na
trajetoria.md` (contrato §12, D261), junto do que ele contou de si nos
textos que reescreveu: a apresentação que ele muda é, quase sempre, o
lugar em que ele diz o que ninguém tinha perguntado. Vira também uma linha
em `## Falta saber` (“você respondeu ‘6 anos com SQL’; está em _bruto/ —
`/vagas:perfil-de-busca` leva à trajetória, e a próxima candidatura diz o
mesmo”).

**Texto que sai é só o que sai.** Nada de comentário, nota ou pergunta dentro
de `texto` ou `valor` — nem `<!-- … -->` "que eu tiro antes de colar": o
recado a ele vai na `linha` da tela ou na `nota` do campo. Um comentário no
texto é um texto a mais para ele ler, apagar e confiar que você apagou. Campo que voltou vazio
continua vazio: não vira `?` preenchido por você.

**E leia o recado antes das respostas** (D259). `comentario` é o geral, e
`blocos.respostas.comentarios` traz o de cada campo, pela `chave`. São
instruções para VOCÊ — "a pretensão é outra", "tire a menção à empresa
anterior" —, e nada deles vai para o formulário. Se um recado muda uma resposta
ou a carta, refaça-a e mostre a tela de novo (mesmo título), com a `nota` do
campo dizendo o que mudou; só se ele apertou o botão forte E o recado não
mexe em nada do que sai, siga. Texto de instrução que ele escreveu DENTRO de
um campo ("troque por…", "melhore isto") é o mesmo caso: não se envia, se
aplica e se mostra de novo.

**Sem painel, ou se ele expirar:** o mesmo, em texto, na mesma ordem — a vaga
em seis linhas, as respostas numa lista `pergunta → resposta  ← origem` com os
`?` no topo, o texto livre inteiro em cerca de código —, e as mesmas saídas.
Diga em uma linha que o painel não foi usado.

**E o envio depende do painel.** Com `aperta depois de eu aprovar no painel`
numa sessão sem painel, ela mostra a mesma tela em texto, inteira, e segue
como em `eu aperto`: preenche e para com o botão na tela. O sim que liga o
clique é o do painel, e “pode mandar” no terminal não o substitui — é o que a
linha diz no nome.

### Passo 6 · Por onde sai

**“Preencher no navegador”, “Preencher e enviar”, “Preencher e parar antes do
envio”** — as três preenchem igual: campo a campo, na frente dele, com o que
voltou da tela (`browser_fill_form`, `browser_type`, `browser_select_option`).
O que muda é o último botão, e só ele:

```
preenche         texto, número, data, lista, caixa de marcar
anexa            só se o PDF ou o DOCX existe no disco: `browser_file_upload`
                 com o caminho dele. Só existe o markdown? Com
                 `documento_gerar` na sessão, gere o PDF pelo modelo
                 `curriculo` (D270) e anexe ele; sem a ferramenta, NÃO
                 converte e não cola o texto num campo: diga qual arquivo é —
                 curriculos/V-012-cv.md — e que o anexo é dele
NÃO preenche     os campos “é seu, na hora”; senha; captcha; verificação em
                 duas etapas
avança           “Próximo”, “Continuar”, “Salvar e continuar”, “Avançar”,
                 “Revisar” ENTRE páginas do mesmo formulário, e só quando a
                 página seguinte ainda é formulário. Na dúvida, não avança
o último botão   enviar · submeter · candidatar-se · finalizar · concluir ·
                 confirmar candidatura · “Enviar candidatura” · apply ·
                 submit — e o ambíguo conta como este. Quem o aperta é a
                 linha `envio de candidatura:`, abaixo
```

**Com `envio de candidatura: eu aperto`** — terminou: confira a página com um
`browser_snapshot`, diga o que ficou preenchido, o que ficou para ele — os
campos dele, o anexo — e **pare, com o botão de enviar na tela**:

> Está preenchido até o botão. Falta o seu CPF, o anexo do currículo
> (curriculos/V-012-cv.md, em PDF) e a sua leitura. O envio é seu — quando
> enviar, me diga, que eu registro.

**E não termine a execução ali** (D276). O navegador é da execução: ela acaba,
ele fecha, e o formulário preenchido vai junto — foi o que aconteceu na
primeira candidatura pelo painel.

**E grave ANTES de esperar** (D262). A execução pode morrer na espera — o
lançador tem teto —, e o que só está na memória dela morre junto. Antes do
`painel_mostrar` da espera, escreva o que já é fato: o `_bruto/` da
candidatura inteiro (por onde, as respostas como saíram, o anexo), com
`estado: preenchida, esperando o seu envio`; e, como ÚLTIMA linha do
`## Histórico` da vaga, `<hoje> candidatura preenchida, esperando o seu
envio  ← _bruto/<o arquivo>`. A etapa não muda: ele ainda não enviou. É essa
linha que faz o painel destacar "Já me candidatei" se a execução acabar.

Com painel, a frase acima vira uma tela
(vista `feedback`, `guardei` com `a candidatura NÃO foi registrada: você
ainda não enviou`) com duas ações — `Enviei` (tom forte, com `item` o id
da vaga, `gesto: "etapa:candidatada"` e `nota` `candidatura em
_bruto/<o arquivo>: trocar o estado para enviada, dito no painel`) e `Não vou
enviar agora` (tom de recusa). O gesto é o que salva o clique depois do fim
da execução: ele vira decisão da fila, e quem grava segue a nota — e a `linha` avisa que o navegador fica aberto
enquanto a tela espera. Depois, `painel_esperar`, até 900 s por vez, e DE NOVO
a cada `expirou` — é a exceção à regra de `references/painel.md`, porque aqui
parar de esperar fecha o navegador; repete-se a espera, nunca o
`painel_mostrar`. O lançador dá sessenta minutos de espera, e esperar não
custa nada. Nada de `browser_*` enquanto espera — a página é
dele agora.

```
Enviei                  um `browser_snapshot`: a página confirmou? A frase
                        dela vai para o `_bruto/` e o registro é o do passo 7
                        com as duas procedências. Não confirmou: registre pelo
                        que ele disse, e diga a frase que está na tela
                        — nos dois casos, o `estado:` do _bruto/ que você
                        gravou antes da espera passa a `enviada`
Não vou enviar agora    o desfecho "preencheu e ele NÃO enviou", do passo 7 —
                        e a última linha do histórico deixa de ser "esperando
                        o seu envio": `<hoje> candidatura preenchida e não
                        enviada`, e o estado do _bruto/ também
a espera acabou         não mude nada: a base já diz "esperando o seu envio",
                        e o clique que vier depois vira decisão da fila. Diga
                        que o navegador vai fechar e que "Já me candidatei",
                        no painel, registra o envio
```

Sem painel, numa sessão de terminal, ela para ali mesmo: o navegador vive
enquanto a sessão vive, e a resposta dele chega pela conversa. “Preencher e
parar antes do envio”, no outro regime, acaba do mesmo jeito: a mesma tela, a
mesma espera.

**Com `envio de candidatura: aperta depois de eu aprovar no painel`**, e só
depois de ele ter apertado “Preencher e enviar” NESTA candidatura:

```
1  preenche tudo o que voltou da tela, do primeiro passo ao último
2  antes do botão, um `browser_snapshot`: confira que o que está na página é
   o que estava na tela. Divergiu — um campo que o portal reescreveu, um
   passo que apareceu e não foi revisado — PARE e mostre. O sim era sobre
   aquilo, não sobre isto
3  aperta o botão final, UMA vez. Não há segunda tentativa: clicar de novo
   é como nasce a candidatura em duplicata que o recrutador vê
4  espera, e LÊ a página: “Candidatura enviada”, a vaga marcada como
   candidatada, o e-mail de confirmação na tela. É esta leitura que autoriza
   o passo 7 — e ela é `← navegador, <hoje>`, como qualquer campo
```

**A página NÃO confirmou?** Não registre nada. Diga o que viu — a frase que
está na tela —, deixe a caixa em `## Parado` do `hoje.md`, e **não aperte de
novo**. Talvez tenha saído, talvez não: o que a skill afirma é o que ela leu, e
quem resolve a dúvida é ele, abrindo a lista de candidaturas dele. “Apertei”
não é “saiu”.

**Apareceu captcha, aviso de atividade incomum ou pedido de verificação:**
pare tudo naquela execução, diga a frase da tela, e não tente de novo — nem em
outra aba. Isso vale nos dois regimes.

**“Eu mesmo colo”** — as respostas em cerca de código, uma por pergunta, na
ordem do formulário, prontas para copiar, e o texto livre sozinho num bloco.

**Por e-mail** — é mensagem em nome dele, e sai pela tela do envio do contrato
§7.1: para quem, o texto INTEIRO, e as três saídas `Mando agora · Mudo o texto
· Eu mesmo mando`. É candidatura, e a regra é a do formulário: `Mando agora`
só existe com `email-pessoal: ligado`, `envio:` diferente de `não`, a linha
`envio de candidatura: aperta depois de eu aprovar no painel` e a tela no
painel. Fora disso — e é o normal, porque o anexo do currículo continua sendo
dele —, a skill deixa o **rascunho** pronto na caixa dele e diz que falta
anexar e enviar. A caixa do agente nunca fala em nome dele
(contrato §11).

**Recrutador com telefone, e nenhuma conversa antes** — primeiro contato por
WhatsApp é **link** (`https://wa.me/<número>?text=<mensagem>`), com o bloco
para copiar junto, como o §7.1 manda. Uma pessoa, o texto inteiro na tela
antes.

### Passo 7 · Registrar — só depois de o envio estar CONFIRMADO

São dois gatilhos, um por regime, e nenhum deles é “ficou pronto”:

```
eu aperto        ele DIZ: “já enviei”, “foi”, “mandei agora” — ou aperta
                 `Enviei` na tela que espera (passo 6)
aperta depois    a PÁGINA confirmou, e você leu a confirmação. Ela é fato
do sim           com procedência: `← navegador, <hoje>`
```

Aí, e só aí, na mesma passada —

```
_bruto/2026-09-14-candidatura-V-012.md    o que saiu, como saiu (abaixo)
vagas/V-012-lumina-pagamentos.md          `etapa: candidatada · desde <hoje>`
                                          uma linha em `## Candidatura`
                                          uma linha em `## Histórico`
                                          o `?` que a candidatura resolveu
                                          ganha valor, com a procedência
funil.md                                  a vaga muda de seção, com
                                          `· próximo:` — “achar com quem
                                          falar”, se `contato:` é `?`
vagas/_indice.md                          `atualizada`
INDICE.md                                 `## Quanto tem`, recontado
```

O arquivo de `_bruto/` — grave **antes** dos outros, que é o que sobra se algo
falhar no meio:

```markdown
origem: candidatura enviada pelo candidato — formulário do site
recebido: 2026-09-14
sobre: V-012 (PM de IA, Lumina Pagamentos)

---

por onde: formulário · https://boards.greenhouse.io/acme/jobs/4000000003
currículo: curriculos/V-012-cv.md
enviada: 2026-09-14 — dito pelo candidato

## Perguntas e respostas, como saíram

### Nível de inglês
Intermediário

### Pretensão salarial
entre R$ 14 e 16 mil CLT, conforme o pacote

## Texto livre

<o texto, inteiro, como voltou da tela>

## O que ele preencheu na hora, e não está aqui
CPF · anexo do currículo
```

Os campos “é seu, na hora” entram só pelo **nome**, nunca pelo valor. E a linha
de `## Candidatura`:

```
- 2026-09-14 · formulário do site · curriculos/V-012-cv.md · respostas em _bruto/2026-09-14-candidatura-V-012.md  ← candidato, 2026-09-14
```

**Com `aperta depois de eu aprovar no painel`, duas linhas mudam** — e elas
mudam porque afirmam coisas diferentes. Quem enviou não foi ele; foi a skill,
com o sim dele, e o registro diz isso e diz a hora:

```markdown
origem: candidatura enviada pela skill — candidatura simplificada do LinkedIn
…
enviada: 2026-09-14 — enviada pela skill, depois do sim de 2026-09-14 14:32
confirmada: “Candidatura enviada” na página  ← navegador, 2026-09-14
```

```
- 2026-09-14 · candidatura simplificada do LinkedIn · curriculos/V-012-cv.md · respostas em _bruto/2026-09-14-candidatura-V-012.md  ← skill, 2026-09-14
```

A procedência é `← skill` e não `← candidato` pela regra 2 do contrato: quem
afirma o fato é quem o viu acontecer. O que ele afirmou está na hora do sim, e
é ela que sustenta a linha.

**A vaga nomeou alguém** — o anúncio ou a confirmação traz o recrutador, com
nome e contato profissional: cria o arquivo em `contatos/`, pelo gabarito de
`modelos/contato.md`, com `papel:`, a origem de cada campo, `## Fala por` com a
vaga, **sem `etapa:`** — e o `contato:` da vaga passa a apontar para ele, na
mesma passada. Só o dado profissional (contrato §3.1). Não nomeou: `contato: ?`
continua, e é o estado normal.

**Preencheu e ele NÃO enviou** — disse “depois”, fechou o painel, sumiu: a
etapa **não muda**, e `## Candidatura` continua `- nada ainda.` O que se grava
é uma caixa em `## Parado` do `hoje.md`, com o que falta —

```
- [ ] V-012 (PM de IA, Lumina Pagamentos) — formulário preenchido e não enviado: falta o anexo e o envio
```

— e uma linha no `## Histórico` da vaga, `- 2026-09-14 candidatura preparada,
não enviada`. As respostas preparadas ficam em
`_bruto/2026-09-14-candidatura-V-012.md` com `enviada: não`, para a retomada
não recomeçar do zero.

**Apertou e a página não confirmou** — é o mesmo desfecho, com outra palavra:
a etapa **não muda**, e a caixa de `## Parado` diz o que a tela dizia.
`enviada: não — o botão foi apertado em 2026-09-14 14:32 e a página não
confirmou`, no `_bruto/`, e a linha do `## Histórico` igual. Registrar como
enviada o que não se leu sair é pior do que não registrar: é o que ele relê na
véspera da entrevista, e é onde nasce a candidatura em duplicata.

**Ele diz “já enviei” de uma vaga que a skill não preparou:** registre do mesmo
jeito, com o que ele souber dizer — por onde, com que currículo —, e `?` no que
não souber. O `_bruto/` diz `origem: candidatura relatada pelo candidato`.

## 5 · O que perguntar, e como

No máximo três perguntas por execução (contrato §8) — e **os `?` do formulário
não contam como perguntas**: eles vão todos juntos, na tela do passo 5, que é
onde responder dez campos custa um minuto. As que valem uma pergunta de
verdade:

- **a eliminatória que ele não passa** — antes de todo o trabalho, com o custo
  na frase
- **qual currículo**, quando só há o base — com os dez minutos escritos
- **por onde**, quando a vaga aceita formulário e e-mail — e o padrão é o
  formulário, que é o que o processo deles lê

**Quando não perguntar:** o dado está no `INDICE.md`, no `perfil.md` ou na
trajetória; o canal está escrito no anúncio; o tom é o de sempre. Montar a tela
e mostrar bate perguntar como montar.

## 6 · O formato da saída

A tela do passo 5 — no painel ou em texto —, o que ficou para ele, e o fecho do
contrato §10. Quem é citado — a vaga, o contato, a referência — vai com o id
e o apelido juntos, também num título: `## P-001 (Caio Rezende)`, nunca só o
nome (contrato §2). Depois de o envio estar confirmado:

## Guardei
- ~/busca/_bruto/2026-09-14-candidatura-V-012.md — as respostas, como saíram
- ~/busca/vagas/V-012-lumina-pagamentos.md — `candidatada` desde hoje, e a
  linha em `## Candidatura`
- ~/busca/funil.md — a V-012 (PM de IA, Lumina Pagamentos) mudou de etapa
- ~/busca/vagas/_indice.md e ~/busca/INDICE.md — data e contagens

## Falta saber
- com quem falar na Lumina Pagamentos — a vaga não nomeia ninguém
- o contrato e a faixa da V-012 (PM de IA, Lumina Pagamentos): o formulário não
  perguntou, e o anúncio não diz

E enquanto o envio não se confirmou, o `## Guardei` diz exatamente isso —
`- a candidatura NÃO foi registrada: você ainda não enviou`, ou `- a
candidatura NÃO foi registrada: o botão foi apertado e a página não
confirmou` —, seguido do que foi gravado de fato (a caixa no `hoje.md`, o
`_bruto/` com `enviada: não`). Quem lê precisa saber que a etapa não mudou.

**E quando ela apertou**, o `## Guardei` diz quem apertou e quando ele
aprovou: `- ~/busca/vagas/V-012-lumina-pagamentos.md — candidatada, enviada
pela skill depois do seu sim de 14:32; a página confirmou`.

## 7 · Onde ela para

**Ela não envia sem o regime escrito.** Com `envio de candidatura: eu aperto`
— que é o padrão, e é o que vale quando a linha não existe — ela não clica em
enviar, submeter, candidatar-se nem em nada que pareça isso, em modo nenhum,
com pedido nenhum. Ele insistiu na conversa: ela diz uma vez por quê — a conta
é dele e é o ativo, contrato §12.1 —, diz onde se troca a linha, e continua
parando com o botão na tela. **Pedido falado não troca regime**, e ela não
troca a linha sozinha para destravar a execução.

**Ela não envia em lote, nem com o regime ligado.** O sim é DAQUELA
candidatura, depois daquela tela. Não existe “aprova as cinco”, não existe
lembrar o sim da anterior, e não existe reaproveitar o sim de ontem.

**Ela não registra o que não viu sair.** Apertou e a página não confirmou: a
etapa não muda, e ela diz a frase que estava na tela. Não aperta de novo.

**Ela não entra em conta.** Não digita senha, não resolve captcha, não faz
verificação em duas etapas, não aceita termo de uso em nome dele. Pediu login:
é com ele, e ela diz qual janela.

**Ela não mexe na conta dele por fora da candidatura.** Não segue empresa por
conta própria, não salva vaga, não cria alerta, não manda mensagem a
recrutador pelo LinkedIn — isso é `/vagas:escrever-ao-contato`, e sai como
bloco para copiar.

**Ela não candidata em volume.** Uma vaga por execução, e o teto do dia vale
nos dois modos. “Aplica nas dez que valem” vira dez execuções, cada uma com a
tela dela — ou não vira, e ela diz que é isso que o contrato §3.1 chama de
trocar reputação por velocidade.

**Ela não responde o que a trajetória não responde**, não arredonda para cima,
não escolhe a opção acima da verdadeira numa lista, e não escreve o piso em
lugar nenhum.

**Ela não toca em dado sensível.** CPF, RG, nascimento, endereço, foto: o campo
é dele, na hora, e o valor não entra na busca nem no `_bruto/`. Gênero, raça,
deficiência e pronomes, só o que ele declarou no `## Quem sou` — e o que não
declarou, também é dele, na hora.

**Ela não escreve currículo** (`/vagas:montar-curriculo`), **não julga a vaga**
(`/vagas:triar-vagas`), **não corrige a trajetória**
(`/vagas:perfil-de-busca`) e **não cobra resposta** de quem não respondeu —
silêncio depois da candidatura é `/vagas:retomar-contato`, que tem cadência.

**Ela não promete resultado nem prazo** do processo deles, e não diz que um
campo “não elimina”. O que ela sabe é o que o anúncio e o formulário dizem, com
a data.
