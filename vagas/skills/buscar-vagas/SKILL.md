---
name: buscar-vagas
description: >-
  Percorre o `## Onde olhar` do perfil pelos conectores de vaga, tira o que é
  repetido, descarta SÓ o que o `## Descarto` manda e que se lê no anúncio, e
  guarda o resto como vaga `nova`, com a procedência de cada campo. Tudo o
  que a busca devolveu fica num arquivo de `_bruto/` com o veredito de cada
  resultado — o que saiu continua conferível. Para antes de buscar se a pilha
  por julgar bateu no teto, e confere se as vagas vivas continuam no ar. Sem
  conector, trabalha com o anúncio colado; com o navegador ligado e a linha
  `linkedin (logado):` no perfil, busca também dentro da conta dele — e sem
  essa linha não entra em conta nenhuma. Use quando o candidato disser
  "busca vaga para mim", "tem vaga nova?", "roda a busca", "achei essa
  vaga, guarda", "essa vaga ainda está aberta?", "quanto gastei com a
  busca?", ou colar um anúncio ou um link. Não é ela que diz se a vaga vale
  (/vagas:triar-vagas), nem que define o que procurar
  (/vagas:perfil-de-busca), nem que aposenta (/vagas:organizar-busca).
license: MIT
compatibility: >-
  Precisa da busca montada e do `perfil.md`; sem perfil não há o que procurar,
  e ela manda para /vagas:perfil-de-busca. Os conectores são opcionais: sem
  eles, ou com todos desligados, ela pede o anúncio colado e grava igual, com
  `← ficha colada`. As fontes públicas não pedem conta nenhuma; a do LinkedIn
  logado pede o navegador ligado E a linha no perfil. Conector pago só com
  teto e orçamento. Sem busca, a vaga colada sai na tela e o `## Guardei` diz
  que nada foi gravado.
allowed-tools: Read Glob Grep Write Edit WebFetch
---

# Buscar vagas

## 1 · O que ela faz, e o que ela não faz

Ela **traz e guarda**. Pergunta às fontes o que há, confere contra o que já
entrou, aplica os cortes que o candidato escreveu, e grava cada vaga que sobrou
como um arquivo em `nova` — com o link, a fonte e a data em cada campo.

**Ela não julga.** `encaixe:` nasce `?`, e `## O que pesa a favor` nasce vazio: dizer
se uma vaga vale uma hora de candidatura é de `/vagas:triar-vagas`, com o
candidato olhando. Busca que já vem com nota é busca em que ninguém lê o
anúncio.

**Ela não descarta em silêncio.** Fonte pública devolve centenas de vagas, e a
maioria sai — repetida, fora do regime, júnior. Cada uma que sai fica escrita
no arquivo de `_bruto/` daquela busca, com o motivo. É o que deixa o candidato
abrir o arquivo daqui a um mês e descobrir que um corte estava tirando o que
ele queria.

## 2 · Antes de tudo

1. lê `~/busca/INDICE.md` — `references/contrato/10-0-comeca-e-termina.md` diz
   como começar. Não existe: uma linha e `/vagas:comecar`
2. lê a linha `modo:`, e em `## Como eu trabalho` a linha
   `quantas vagas por julgar no máximo:` — 30, se ela não estiver lá
3. **lê `~/busca/perfil.md`.** Não existe: pare, uma linha, e
   `/vagas:perfil-de-busca`. Sem `## Onde olhar` não há onde procurar, e sem
   `## Descarto` tudo entra. Em `## Onde olhar`, repare numa linha só —
   **`linkedin (logado):`**, que é a autorização de usar a conta dele; sem
   ela, nenhuma busca entra em conta nenhuma
4. lê `vagas/_indice.md` inteiro — **as vivas E o `## Arquivo morto`** — e os
   `_bruto/*-busca*.md` dos últimos 30 dias. É contra isso que se confere
   repetição no passo 4
5. conta, no `funil.md`, quantas vagas estão em `nova`

O formato da vaga está em `references/contrato/04-4-arquivo-de-vaga.md`; o que
faz duas vagas serem uma, em `references/contrato/02-0-id-e-apelido.md`; o
perfil, em `references/contrato/04-9-o-perfil.md`; as três regras, em
`references/contrato/03-0-as-tres-regras.md`; o formato do bruto, em
`references/contrato/04-7-o-bruto.md`; a linha do índice, em
`references/contrato/04-6-os-dois-indices.md`; a do funil, em
`references/contrato/04-3-funil.md`; os tetos, em
`references/contrato/09-0-os-tetos.md`. Os gabaritos são
`references/modelos/vaga.md` e `references/modelos/_indice-vagas.md`. Como se
fala com os conectores está em `references/conectores.md`, o painel em
`references/painel.md`, e o roteiro do LinkedIn logado — a URL de busca, como
se lê um cartão, o ritmo — em `references/linkedin.md`.

## 3 · O modo

`copiloto` — para em três lugares: quando duas vagas PARECEM a mesma e não dá
para ter certeza, quando um corte do `## Descarto` é ambíguo naquele anúncio, e
antes de qualquer chamada paga.

`automatico` — escolhe e declara em `## Decidi sozinho` (contrato §5): na
dúvida de repetição, **entra como vaga nova** com a suspeita escrita no
`## Histórico` — duas fichas se fundem depois, vaga perdida não volta; na
dúvida de corte, **entra**. Chamada paga só sai se ele autorizou gasto NESTA
execução; senão vira linha em `## Falta saber`.

**O teto de vagas por julgar vale nos dois modos**, e nenhum dos dois o
ultrapassa.

## 4 · O passo a passo

Três ou mais passos demorados: mostre o TODO na tela (contrato §10).

### Passo 1 · O que existe para buscar

Chame `conectores_estado` **uma vez**. Três respostas, três caminhos:

```
as ferramentas não existem    não há plugin ou não há `node`. Peça o anúncio
na sessão                     colado — passo 1b — e não mencione conector

existem, e os de vaga         use os ligados. Os desligados que aparecem em
estão ligados (ou parte)      `## Onde olhar`: diga UMA vez que existem, o que
                              trariam, e o comando de `como_ligar`. Siga sem

todos desligados              idem, e passo 1b
```

**Quem liga é o candidato, num terminal dele.** O conector que tem aviso —
`linkedin-vagas` tem — mostra o aviso no ato de ligar; não o repita a cada
busca.

**1a · O LinkedIn logado, que precisa das DUAS coisas.** Ele só entra quando
`navegador` está `ligado` e provado (`browser_snapshot` responde) **e** o
`## Onde olhar` tem a linha `linkedin (logado):`. Falta uma das duas:

```
tem a linha, navegador         diga o `como_ligar` do `navegador` UMA vez, e
desligado ou ausente           siga pelas fontes públicas
tem o navegador, não tem       **não use a conta dele.** Diga UMA vez que
a linha                        existe — que logado aparecem as vagas
                               recomendadas e as de candidatura simplificada,
                               que nenhuma listagem pública mostra —, que o
                               risco é a conta, e que quem escreve a linha é
                               `/vagas:perfil-de-busca`. E siga sem
```

**São TRÊS caminhos até uma vaga do LinkedIn, e eles não custam o mesmo:**

```
linkedin-vagas        a listagem PÚBLICA, de graça, sem conta nenhuma. É o
                      padrão e é o caminho SEM RISCO
apify · vagas-        a mesma listagem pública, PAGA, com o anúncio inteiro
linkedin              e mais filtro. Sem risco de conta, com risco de custo:
                      orçamento antes, como toda chamada paga
linkedin (logado)     age DENTRO da conta dele. Traz o que só existe logado —
                      as recomendadas, o filtro de candidatura simplificada —
                      e os termos do site proíbem automação ali: baixo com o
                      ritmo do roteiro, nunca zero
```

**Não use dois no mesmo termo.** É a mesma vaga chegando por duas portas, e o
passo 4 gasta o dobro para desfazer o que não precisava ter entrado duas
vezes.

**1b · O anúncio colado.** Ele colou um texto ou um link? É uma busca de um
resultado só, e segue pelos passos 4 a 7 igual. O texto vai para
`_bruto/AAAA-MM-DD-anuncio-<empresa>.md` antes de qualquer extração, e a
procedência de cada campo é `← ficha colada, <data>`. **Não chute campo de
vaga.**

**Só o link: `ler-vaga`, operação `ler`, com a URL exatamente como ele
colou** — uma por chamada, e nunca um link que você achou ou montou (para
buscar há as fontes). Ele lê o bloco da vaga que o site publica e devolve os
campos com `procedencia` (`<site>, <data>`), que é o `← ` de cada um. O que
pode voltar:

```
os campos                  grave o que veio; o que veio null é `?`
`recusado · os termos…`    o site proíbe leitura automática (Catho, InfoJobs,
                           Indeed…). Diga isso em uma linha e peça o TEXTO
                           do anúncio. Não abra por outro caminho — nem web,
                           nem navegador: o termo vale para os dois
`encaminhado · …`          outro conector lê aquele site (LinkedIn, Gupy):
                           siga o que a frase diz
`não traz o bloco`         a página abriu sem os dados da vaga. Peça o texto
`a página respondeu 404`   a vaga pode ter saído do ar. Diga, e peça o texto
```

Sem conectores na sessão, o link se abre pela ferramenta de web — **menos o
de site que proíbe leitura automática** (Catho, InfoJobs, Indeed, Trampos):
esse você nem abre, e pede o texto. A página voltou vazia? Diga na cara —
"essa página não abre para mim" — e peça o texto.

### Passo 2 · O teto, ANTES de buscar

```
nova, por julgar: 30 ou mais      PARE. "Tem 31 vagas por julgar, e o teto é
                                  30. A vez é de /vagas:triar-vagas." Nada é
                                  buscado — nem "só as da Lumina"
perto do teto (faltam N)          busque, e grave no máximo N. O que passar
                                  disso fica no bruto como `ficou de fora: teto
                                  de vagas por julgar`, e a próxima busca as
                                  reencontra
```

Não é defeito, e não se pede desculpa: pilha de cem por julgar é pilha que
ninguém julga, e a busca que a alimenta só piora o dia dele. O passo 6 — as
vagas que saíram do ar — **roda mesmo com a busca parada**: ele não traz nada.

### Passo 3 · Uma chamada por linha de `## Onde olhar`

```
gupy              `buscar` com cada termo de `## Termos de busca`. O lugar e
                  o vínculo saem do `## Aceito`: UMA cidade → `cidade`, com
                  acento, como se escreve (São Paulo, Jaboatão dos
                  Guararapes — sem acento volta vazio); várias no mesmo
                  estado → `estado` (sigla ou nome), e o `## Descarto`
                  corta o resto; só remoto → `modo: remoto`, sem lugar. UM
                  contrato aceito → `contrato` (CLT, estágio, aprendiz,
                  temporário, PJ…); mais de um → sem o filtro
solides           `buscar` com cada termo; `local` como “Cidade - UF” com
                  acento (Recife - PE) ou só a UF. Vem de 20 em 20, e a
                  busca é frouxa: traz parecidos, e quem os julga é a
                  triagem, não este passo
linkedin-vagas    `buscar` com cada termo; `local` em inglês, como a fonte
                  entende (o padrão é Brazil); `modo` idem; `dias` = 14 na
                  primeira busca, 7 nas seguintes. Vem de dez em dez
greenhouse        `buscar` com `empresa`, e `termo` com os cargos do perfil
ashby · lever     separados por vírgula — essas fontes não têm busca própria,
                  e sem `termo` volta o quadro inteiro da empresa
linkedin          NÃO é chamada de conector: é o navegador, pelo roteiro de
(logado)          `references/linkedin.md`. Uma URL de busca por termo, e a
                  lista de recomendadas — abaixo
à mão             NÃO é chamada. Vira linha em `## Falta saber`, com o
                  endereço — e, se ele colar o que achou lá, é o passo 1b
```

**As fontes são do Brasil inteiro e de qualquer ofício**: o termo, o lugar e
o contrato vêm do perfil dele, e nada aqui presume tecnologia. Gupy e Sólides
são as que mais trazem vaga de comércio, saúde, logística e serviço; uma
fonte pública ligada que o `## Onde olhar` não cita, diga UMA vez que existe e
o que traria — quem acrescenta a linha é `/vagas:perfil-de-busca`.

O que elas devolvem além dos oito campos já vem na palavra do contrato, e
entra com `← <conector>, <hoje>`: `regime`, `contrato`, `jornada` (a Sólides
manda o turno como a empresa escreveu), `faixa_de`/`faixa_ate` (null é "a
empresa não mostra": `faixa: ?`) e `inscricoes_ate`. Três casos:

```
`aviso: nada voltou — confira…`   a fonte leu o lugar de um jeito só (quase
                                  sempre o acento). Corrija e chame UMA vez
`banco_de_talentos: true`         é cadastro, não vaga aberta. Entra, com
                                  `contrato: ?` e a frase no `## Histórico`
`link: null` (Sólides)            a fonte não deu link que abra: `link: ?`,
                                  e o título e a empresa no bruto
```

**O LinkedIn logado, e o ritmo que é regra.** Siga `references/linkedin.md`
inteiro, e três coisas dele não se negociam por pressa: **confira que ele está
logado antes de tudo** (o feed no snapshot, não a parede de cadastro); **uma
ação por vez, com `browser_wait_for` entre as navegações**; e o teto de **3
páginas de resultado e ~40 cartões por busca**. Leia os cartões pelo snapshot
de acessibilidade — papel e nome —, nunca por classe CSS: as classes mudam
toda semana e o seletor quebra em silêncio, com a busca voltando vazia.

O que a linha do perfil pedir depois dos dois-pontos vira os parâmetros da URL
(`linkedin (logado): pelos termos de busca, só remoto, e as recomendadas`), e
a procedência de cada campo é **`← linkedin, AAAA-MM-DD`** — não
`linkedin-vagas`, que é a outra fonte e não viu a mesma página.

**Viu aviso de atividade incomum, captcha ou pedido de verificação: PARE.**
Não tente de novo naquela execução, nem em outra aba. Diga o que apareceu, com
a frase da tela, siga com as outras fontes, e escreva a linha em
`## Falta saber`.

O que pode voltar, e nada disso é motivo para parar a busca inteira:

```
`devagar`                     espere os segundos que ele disser, e siga. Não
                              é erro, e não se comenta
`o serviço respondeu 4xx/5xx` a fonte recusou ou caiu. Diga qual, siga com as
                              outras, e NÃO repita em laço
quadro vazio                  empresa sem vaga aberta para aqueles termos.
                              É resultado, e vai para o bruto como resultado
`conector desconhecido`       o nome em `## Onde olhar` está errado. Linha em
                              `## Falta saber`, para /vagas:perfil-de-busca
```

**Conector pago só pelo fluxo de orçamento** de `references/conectores.md`:
`conectores_orcar`, mostrar ao candidato o que vai buscar, quanto deve custar
e quanto sobra do teto, e só então `conectores_chamar` com o `orcamento`.
`acima do teto` e `sem teto` são recusa por desenho: não tente outra operação
para contornar. Diga quanto falta e como ele muda o teto.

**Não pagine sem precisar.** Uma página por termo por fonte basta na busca de
rotina; a segunda só quando a primeira veio cheia E tudo nela era novo.

**"Quanto gastei com a busca?"** não é busca: chame `conectores_extrato` (o mês
corrente, ou o que ele disser, em `AAAA-MM`) e mostre o gasto por conector e as
chamadas que custaram, com o teto do mês ao lado. Onde vier `medido: false`, o
número é estimativa e se diz assim. Nada é buscado e nada é gravado.

### Passo 4 · O que é repetido

A seção 2 do contrato define: **a mesma vaga em duas fontes é UMA vaga.** A
conferência é em duas voltas, contra as vivas, o arquivo morto e os brutos de
busca anteriores:

```
1  pelo link          o mesmo endereço, tirando o que vem depois de `?`.
                      É repetida, sem dúvida

2  por (empresa,      mesma empresa, mesmo cargo — ou o mesmo cargo com outro
    cargo,            título —, mesma cidade ou regime, publicadas na mesma
    quinzena)         quinzena. É a mesma, e o link novo entra no campo
                      `também em:` da que já existe, com a procedência dele
```

**A mesma vaga volta uma vez por CIDADE**, e é a repetição mais comum de todas
— medido na primeira busca paga, em 2026-09-19: uma vaga remota veio três
vezes, como “Brazil”, “Curitiba” e “São Paulo”, com três ids e três links
diferentes. O critério 1 não pega; o 2 pega, e é por isso que ele olha empresa
e cargo antes de olhar o link. Fica UMA, com o local mais amplo, e as outras
duas entram no bruto como `repetida de V-0xx, a mesma em outra cidade`.

**E a data de publicação de fonte paga não se confia sozinha**: na mesma
busca, as 25 vieram com a data do dia — a da coleta, não a da vaga. Quando
toda a leva traz a mesma data, `publicada:` entra como `?  ← a fonte devolveu a
data da coleta`, e quem conserta é o anúncio, lido na triagem.

Três desfechos, e cada um tem o seu veredito no bruto:

```
repetida de vaga VIVA      `repetida de V-012` — e `também em:` ganha o link
repetida de vaga MORTA     `repetida de V-008, aposentada: <motivo>`. NÃO
                           ressuscita: ele já disse não a ela
morta há mais de 60 dias,  é vaga REPUBLICADA: outra vaga, id novo, e a
mesmo cargo de volta       primeira linha do `## Histórico` aponta para a
                           antiga (seção 2)
```

Parece a mesma e não dá para ter certeza — o cargo mudou de "PM Sênior" para
"Lead PM", a cidade sumiu? Em copiloto, mostre as duas lado a lado e pergunte.
Candidatar-se duas vezes à mesma vaga por portas diferentes é o erro que o
recrutador vê.

### Passo 5 · O que o `## Descarto` tira — e só ele

Para cada resultado que sobrou, leia o anúncio contra **cada linha** de
`## Descarto`. A regra é literal: **só sai o que se LÊ.**

```
"Presencial em São Paulo"            está escrito. Sai, com a linha do perfil
                                     que a tirou
"Inglês avançado é obrigatório"      idem
"Escala 6x1, folga rotativa"         idem, quando o `## Descarto` diz 6x1
"Inglês será um diferencial"         NÃO é exigência. Entra, e quem pesa é a
                                     triagem
o anúncio não diz o regime           não se lê. ENTRA, com `regime: ?`
o conector devolve `filtro: remoto`  NÃO é regime: é o que a busca PEDIU, e a
                                     fonte devolve o que a empresa cadastrou —
                                     errado, às vezes. `regime: ?  ← <fonte>: a
                                     busca pediu remoto; o cartão não diz`. Só
                                     `remoto: true` (lido do anúncio) vira
                                     `regime: remoto`. No bruto, `filtro remoto`
```

**Descrição cortada não decide corte de idioma nem de regime.** O conector
manda o começo do anúncio, e `cortado: true` diz que havia mais — a exigência
de idioma mora no fim, em "requisitos". Antes de descartar OU de deixar entrar
por um desses dois cortes, leia o resto: `detalhe`, se o conector tiver a
operação; senão o link, se houver ferramenta de web. Não deu para ler? Entra,
com o campo `?` e a procedência dizendo o que faltou —
`idioma: ?  ← gupy cortou o anúncio, 2026-09-14`. O que veio truncado não se
completa de cabeça.

**Ela não aplica o que não está em `## Descarto`.** Faixa abaixo do piso,
empresa de que ele não gosta, "parece desorganizada": nada disso é corte de
busca. Entra, e a triagem pesa.

### Passo 6 · As vagas vivas que saíram do ar

Para cada vaga em `salva` ou `candidatada` cuja linha `estado:` tem mais de
**7 dias**: confira se ela ainda está no ar — aparece de novo na busca da mesma
fonte, ou o link abre.

```
está no ar       `estado: aberta  ← <fonte>, <hoje>` — só a data muda
saiu do ar       `estado: fechou  ← <fonte>, <hoje>`, o valor antigo desce
                 para `## Histórico` com a procedência que tinha, e ela DIZ,
                 no relatório, com a etapa em que a vaga estava
não deu para     nada muda. Linha em `## Falta saber`
saber
```

**Ela não aposenta.** Vaga que `fechou` numa etapa viva é caso da regra 3, e
quem faz os quatro passos é `/vagas:organizar-busca`. Aqui ela muda o campo,
diz, e manda para lá. E vaga `candidatada` que fechou **não é má notícia
certa**: muita empresa tira o anúncio do ar quando começa a entrevistar.

Sem conector e sem ferramenta de web, este passo não roda — e ela diz isso em
uma linha.

### Passo 7 · Gravar, nesta ordem

**1 · O bruto, antes de tudo.** `_bruto/AAAA-MM-DD-busca.md` — segunda busca no
mesmo dia é `AAAA-MM-DD-busca-2.md`, porque bruto não se edita. Cabeçalho de
três linhas, e abaixo do traço **todo** resultado, com o veredito:

```markdown
origem: conectores — gupy, greenhouse (acme), ashby (cobre) · navegador — linkedin (logado)
recebido: 2026-09-14
sobre: busca pelos termos do perfil de 2026-09-14

---

## gupy · "Product Manager Sênior" · 20 resultados
- PM Sênior — Cobre Energia · remoto · 2026-09-12 · https://cobre.gupy.io/jobs/881 · entrou V-031
- Product Manager Sênior — Norte Seguros · São Paulo, presencial · 2026-09-11 · https://… · descartada: presencial fora de Florianópolis
- Gerente de Produto Sênior — Trilho Logística · 2026-09-10 · https://… · repetida de V-019
- PM Pleno — Vetra · remoto · 2026-09-13 · https://… · descartada: júnior, pleno, estágio

## linkedin (logado) · "PM de IA" · 2 páginas · 38 cartões
- PM de IA — Lumina Pagamentos · filtro remoto · 2026-09-13 · https://www.linkedin.com/jobs/view/4000000001 · repetida de V-012
- Product Manager, Agentes — Norte Dados · filtro remoto · 2026-09-12 · https://www.linkedin.com/jobs/view/4000000002 · entrou V-032

## greenhouse · acme · 0 resultados
- nada para os termos.

## ashby · cobre · não respondeu
- o serviço respondeu 429. Não repeti.
```

Os vereditos são estes, e não há outros: `entrou V-0xx` ·
`descartada: <a linha do ## Descarto>` · `repetida de V-0xx` ·
`ficou de fora: teto de vagas por julgar`. Se algo der errado depois, o
material já está salvo.

**2 · O arquivo de cada vaga que entrou**, pelo gabarito, em
`vagas/<id>-<empresa>.md`:

- id sequencial — o maior já usado mais um, **contando o arquivo morto**
- apelido `<cargo curto>, <empresa>`; no nome do arquivo, só a empresa
- todo campo com `← <conector>, <hoje>`; o que o anúncio não diz é `?`, com o
  que resolve ao lado — `contrato: ?  ← a vaga não diz`
- `etapa: nova · desde <hoje>` · `estado: aberta` · `contato: ?` ·
  `encaixe: ?`
- `## O que a vaga pede`, `## O que pesa a favor` e `## O que pesa contra` nascem
  vazios: são da triagem. **O anúncio inteiro não é colado no arquivo** — o
  teto é 60 linhas, e o anúncio está no link e no bruto
- `## Histórico` com a primeira linha: `- <hoje> entrou pela busca  ←
  _bruto/AAAA-MM-DD-busca.md`

**Nome de gente que venha no anúncio** — "fale com a Bruna, do time de
pessoas" — **não vira arquivo de contato aqui.** Fica no bruto; contato nasce
quando alguém fala com o candidato (seção 3.1: o mínimo é a regra).

**3 · As vistas**, depois dos arquivos donos: `vagas/_indice.md` (uma linha por
vaga nova, e a contagem do título), `funil.md` (uma linha em `## nova`, com
`· veio de <conector> · próximo: julgar`), e o `## Quanto tem` do `INDICE.md`,
recontado.

### Passo 8 · Mostrar o que entrou

Com painel (`references/painel.md`), a vista `lista`, agrupada por fonte: cada
item com o id e o apelido no `titulo`, regime e data na `linha`, e o botão
`Abrir o anúncio`. **Sem `decisoes`**: aqui não se julga, e uma tela com "salva
· não vale" nesta skill é o convite a julgar sem ler. O botão do rodapé é
`Julgar agora`, e ele só devolve a intenção — quem julga é
`/vagas:triar-vagas`.

Sem painel, a mesma lista em texto, e então os números da busca numa linha só:
`62 resultados · 9 entraram · 14 repetidas · 39 descartadas — 31 por regime`.
**Diga o corte que mais descartou.** É o número que faz ele abrir o bruto
quando está errado.

## 5 · O que perguntar, e como

Três perguntas por execução, no máximo (contrato §8). As que valem:

- **é a mesma vaga?** — com as duas lado a lado, antes de gravar
- **esse corte vale aqui?** — quando a linha do `## Descarto` é ambígua naquele
  anúncio ("híbrido, com idas eventuais a São Paulo")
- **posso gastar?** — o orçamento, antes de chamada paga

**Quando não perguntar:** o regime não está no anúncio (é `?`, não pergunta), o
termo de busca não devolveu nada (é resultado), a fonte caiu (diga e siga).
`?` é barato, pergunta é cara.

## 6 · O formato da saída

A lista do que entrou, a linha dos números, o que saiu do ar, e o fecho do
contrato §10:

## Guardei
- ~/busca/_bruto/2026-09-14-busca.md — os 62 resultados, com o veredito de cada um
- ~/busca/vagas/V-031-cobre-energia.md — criada, em `nova`, 8 campos e 3 `?`
- ~/busca/vagas/V-012-lumina-pagamentos.md — `também em:` ganhou o link do linkedin-vagas
- ~/busca/vagas/V-015-vetra.md — `estado: fechou`; estava em `salva`
- ~/busca/vagas/_indice.md · ~/busca/funil.md · ~/busca/INDICE.md — linhas e contagens

## Falta saber
- a V-015 (PM de Plataforma, Vetra) saiu do ar em `salva`: é caso de aposentar, com /vagas:organizar-busca
- trilhologistica.example/carreiras é "à mão", e a última olhada foi há nove dias
- o ashby não respondeu nesta busca — não repeti

## 7 · Onde ela para

**Ela não diz se a vaga vale.** Nem nota, nem "essa parece boa". `encaixe:` é
de `/vagas:triar-vagas`, e o que sustenta a palavra são duas seções com
procedência que esta skill não escreve.

**Ela não mexe no perfil.** Se a busca mostrar que um corte está tirando
demais, ou que um termo não devolve nada, ela diz o número e manda para
`/vagas:perfil-de-busca`. Mudar a régua no meio de medir é como se perde a
régua.

**Ela não aposenta e não ressuscita.** Vaga que fechou vai para
`/vagas:organizar-busca`; vaga que ele já aposentou e reapareceu fica no bruto
como repetida.

**Ela não entra em conta.** Não digita senha, não lê senha, não resolve
captcha e não faz verificação em duas etapas: a janela deslogada é motivo de
PARAR e pedir que ele entre, nunca de contornar. E ela **não usa a conta dele
sem a linha no perfil** — a autorização é escrita, e "mas o navegador está
ligado" não é autorização. As listagens públicas continuam sendo o padrão, e é
por isso que buscar por elas não arrisca nada.

**Ela não se candidata a nada.** Dentro do LinkedIn logado ela lê: cartão,
anúncio, lista de recomendadas. Não clica em "Candidatar-se", não abre o modal
de candidatura simplificada, não salva vaga, não segue empresa e não cria
alerta — criar alerta é gravar coisa na conta dele. Candidatura é de
`/vagas:candidatar`, com a tela dela e o teto do dia.

**Ela não passa do teto**, nem a pedido dentro da mesma execução sem ele mudar
o número no `INDICE.md`. E não pagina uma fonte até o fim: busca de rotina é
uma página por termo.

**Ela não escreve a ninguém, não cria contato e não gasta sem orçamento.**
