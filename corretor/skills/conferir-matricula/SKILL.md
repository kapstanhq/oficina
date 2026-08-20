---
name: conferir-matricula
description: >-
  Lê a matrícula do imóvel (PDF ou texto colado) e devolve a lista do que consta
  nela — quem aparece como proprietário, a cadeia de transmissões, ônus como
  hipoteca, alienação fiduciária, penhora e usufruto, averbações de construção
  e, acima de tudo, o que não deu para ler. Explica cada termo em uma linha. Ela
  lista e não conclui, nunca diz que o imóvel está livre nem que pode ser
  vendido, e nunca opera em modo automático. Grava a matrícula em _bruto/ e as
  pendências no arquivo do imóvel. Use quando o corretor disser algo como —
  chegou a matrícula da casa da Azenha, dá uma olhada · o que tem nessa
  matrícula · esse imóvel tem hipoteca ou financiamento em cima · o proprietário
  é mesmo quem está vendendo · o banco pediu a matrícula, o que pode travar · a
  metragem da matrícula bate com a do anúncio · o dono morreu e os filhos querem
  vender, e agora · o comprador vai financiar e o banco vai analisar o
  documento. Use também quando um PDF ou uma foto de matrícula for colado na
  conversa sem pergunta junto.
license: MIT
compatibility: >-
  Funciona com a carteira no computador ou no Google Drive — o transporte sai da
  linha carteira do INDICE.md. Sem carteira nenhuma, lê a matrícula colada na
  conversa e entrega a ficha, mas não grava nada, e diz isso. Ler PDF depende de
  a ferramenta abrir o arquivo; escaneado sem camada de texto devolve pouco.
allowed-tools: Read Glob Grep Write Edit
---

# Conferir a matrícula do imóvel

## 1 · O que ela faz, e o que ela não faz

Ela lê a matrícula — o PDF que o corretor tem no computador ou no Drive, ou o
texto colado na conversa — e devolve a lista do que consta ali, na ordem em que um corretor
precisa: quem aparece como proprietário, como o imóvel chegou até ele, que ônus
estão registrados, o que foi averbado de construção e **o que não deu para ler**.

Ela não conclui nada: não diz que o imóvel está livre, não diz que pode ser
vendido, não diz que a documentação está em ordem. Quem lê uma matrícula para
valer é advogado ou o próprio cartório, e essa frase sai escrita em toda
execução, dentro do bloco que o corretor vai encaminhar.

**Por que ela grava.** Ela grava três coisas na carteira: o bruto (arquivo novo),
o `## Documentos` do arquivo do imóvel e a data da linha no `_indice.md`. Os dois
últimos já existem: **arquivo que já existe se edita, nunca se sobrescreve** —
sobrescrever apagaria o que outra skill escreveu ali. No `drive` não existe trocar
um trecho: atualizar reescreve o arquivo inteiro, então **leia antes de atualizar,
sempre** (contrato, seção 1). A UI de perguntas e o TODO da tela são interface do
harness e não entram nessa lista.

---

## 2 · Antes de tudo

1. Leia `references/CONTRATO.md`. Ele é a lei do pack e nada aqui o substitui.
   Nesta skill pesam as seções **1** (onde a carteira mora, e os dois
   transportes), **2** (id e apelido), **3** (as três regras), **4.4** (o arquivo
   do imóvel), **4.7** (o que entra em `_bruto/`), **8** (a ordem de busca e o
   tamanho da pergunta), **9** (os tetos) e **10** (como uma skill começa e
   termina). Se o contrato não abrir, **pare e diga** — formato inventado aqui
   quebra as outras nove skills.
2. Ache e leia o `INDICE.md` da carteira pelos degraus da primeira leitura
   (contrato, seção 1). A linha `carteira:` diz o transporte — `local` ou
   `drive` — e o lugar, e **toda leitura e toda gravação desta execução vão por
   ele**. No `local`, toda chamada usa caminho absoluto; no `drive`, cada busca
   vai presa à pasta, e não pelo nome solto.
3. **Não existe `INDICE.md`?** A carteira não existe. Diga isso em uma linha:

   > Você ainda não tem carteira. Rode `/corretor:comecar` — ele monta a
   > carteira com você, no computador ou no seu Drive, e termina com um imóvel
   > de verdade dentro dela.

   Não crie a carteira e não improvise em outra pasta. **A matrícula colada na
   conversa, porém, você lê agora** (contrato §11): a ficha é o trabalho desta
   skill, e o que falta é só onde guardá-la. Nada é gravado, e o fecho diz isso
   — o `## Guardei` vira uma linha só: `- nada foi gravado — você está sem
   carteira aqui`.

---

## 3 · O modo, e a exceção que é esta skill

Leia a linha `modo:` do `INDICE.md` como toda skill lê. E então **ignore-a**.

**Esta skill nunca opera em automático.** Nem com `modo: automatico` escrito no
`INDICE.md`, nem porque a resposta parece óbvia, nem porque só falta um detalhe.
Ela pergunta quando precisa perguntar e para onde tem de parar. Está no contrato,
seção 5, como a única exceção escrita do pack.

Se o modo estiver em automático, diga isso uma vez, em uma linha, sem pedir
desculpa e sem explicar o pack:

> Sua carteira está no automático. Aqui eu não decido sozinho — quem escolheu o
> automático escolheu para o anúncio, não para a matrícula.

**A seção `## Decidi sozinho` nunca aparece na saída desta skill.** Ela existe
para declarar escolha feita sem o corretor, e aqui não há nenhuma. Escolha que
apareceria ali vira pergunta, ou vira linha em `## Falta saber`.

---

## 4 · O passo a passo

Isto tem mais de três passos demorados — abre documento, lê muitas páginas,
escreve três arquivos. **Mostre o TODO na tela** antes de começar.

### Passo 1 · Achar o documento e o imóvel

Desça a ordem de busca do contrato, seção 8, sem pular degrau:

- o corretor colou o texto na conversa: siga para o passo 2.
- ele disse que a matrícula chegou: liste a pasta `_bruto/` da carteira e procure
  `matricula` no nome — no `local`, busca por nome dentro do caminho; no `drive`,
  procura com a pasta `_bruto/` como pai. Leia também o `## Documentos` do arquivo
  do imóvel — o número da matrícula e o cartório costumam já estar lá.
- ele apontou um documento fora da carteira (a pasta de downloads, uma pasta do
  Drive): use como ele deu — caminho absoluto no `local`, a pasta e o nome do
  arquivo no `drive`. O arquivo **fica onde está**.
- a busca voltou vazia: liste a pasta pai antes de concluir que não existe
  (contrato, seção 1). Continuou sem nada: uma pergunta, com o motivo junto
  (seção 5).

Ache também **de qual imóvel** é esta matrícula, em `imoveis/_indice.md`, e passe
a citá-lo sempre com id e apelido — `V-071 (casa 3 dorm, Azenha)`.

**O imóvel não está na carteira?** Leia a matrícula assim mesmo, grave o bruto e
entregue a ficha — ela é o trabalho. Mas **não crie o arquivo do imóvel a partir
da matrícula**: matrícula não tem preço, não tem link e não tem foto, e imóvel
pela metade some da vista. Diga que ele entra pelo `/corretor:anunciar-imovel`.

### Passo 2 · Gravar o bruto, antes de ler

Primeiro porque, se algo der errado no meio, o material do corretor já está
salvo. Nome do arquivo — contrato, seção 4.7 —, com o número da matrícula sem
pontos, e a data em que o documento foi **produzido** (a da certidão), não a de
hoje:

```
_bruto/2026-08-14-matricula-44812.md
```

Não sabe o número ainda? Use o id do imóvel: `2026-08-18-matricula-v-071.md`.
Não sabe a data da certidão? Use a de hoje e escreva isso no cabeçalho.

**PDF, foto ou digitalização ficam onde estão** e o `.md` aponta onde eles estão:
no `local`, o caminho no computador; no `drive`, a pasta e o nome do arquivo no
Drive.

```
origem: matrícula, PDF entregue pelo corretor
recebido: 2026-08-18
sobre: V-071 (casa 3 dorm, Azenha), matrícula 44.812

---

O PDF está em C:\Users\marcelo\Downloads\matricula-44812.pdf
4 páginas · certidão emitida em 2026-08-14
```

No `drive`, essa mesma linha aponta o outro lugar: `O PDF está no seu Drive, na
pasta Documentos, como matricula-44812.pdf`.

**Texto colado** entra abaixo do traço **sem tocar** — sem corrigir, sem resumir,
sem arrumar quebra de linha. Bruto é a prova do que veio, não do que é verdade.
Depois de gravado, ele **nunca** é editado nem apagado.

### Passo 3 · Ler o documento inteiro

- PDF com mais de 10 páginas exige o parâmetro de páginas, e vão no máximo 20 por
  chamada. Leia **todas**, em blocos, e anote quantas o documento tem.
- **Nunca pare na primeira página.** O ônus mora no fim: a página 1 traz a
  descrição do imóvel e a abertura, e a hipoteca aparece três folhas depois. Ler
  só a frente é exatamente como uma alienação fiduciária passa despercebida.
- A matrícula continua **no verso e em folhas anexas**. Se o documento acaba no
  meio de um ato, ou a última página não traz o fecho da certidão, faltou folha.

### Passo 4 · Montar a lista de atos

Cada ato registrado sai com **número, data e natureza**, nesta forma:
`R-7 · 2019-04-02 · alienação fiduciária ao Banco Cruzeiro`.

- **`R-` é registro** (muda quem é dono, ou cria um direito sobre o imóvel) e
  **`Av-` é averbação** (anota um fato, ou altera e cancela algo já registrado).
  Em geral os dois dividem **uma numeração corrida**: R-1, Av-2, R-3, Av-4.
- **Confira a sequência.** Buraco na numeração — pulou do R-5 para o Av-7 — é
  folha faltando, e vai para “o que eu não consegui ler”, não para o silêncio.
- **Pareie cada ônus com o cancelamento dele.** Hipoteca ou alienação fiduciária
  sem uma averbação de baixa **continua constando**, mesmo que o corretor diga
  que a dívida foi paga. O que vale é o que está escrito na matrícula. Nunca
  escreva “quitado” porque alguém disse que está.
- Ato cuja natureza você não conseguiu classificar não vira palpite: sai com as
  palavras da própria matrícula e vai também para “o que eu não consegui ler”.

### Passo 5 · Conferir contra o arquivo do imóvel

Compare endereço, metragem, número da matrícula e proprietário com o que está no
arquivo do imóvel. **Divergência não é erro de um dos dois: é linha na ficha.**
Não corrija o arquivo do imóvel com o que a matrícula diz sem falar — a matrícula
pode estar desatualizada, e o cadastro pode ter sido preenchido de memória.
Metragem, endereço e nome de proprietário são as três divergências que mais
aparecem, e as três mudam o que vai no anúncio.

### Passo 6 · Escrever a ficha

O formato está na seção 6, e os títulos são fixos.

### Passo 7 · Gravar e fechar

A seção 7 diz o que vai para onde. Depois, o fecho do contrato, seção 10:
`## Guardei` e `## Falta saber`. Nunca `## Decidi sozinho`.

---

## 5 · O que perguntar, quando, e com que interface

Uma pergunta por vez. **Nunca mais de três numa execução** — e aqui isso aperta,
porque matrícula gera dúvida sem fim. O que passar de três **não vira pergunta:
vira linha em `## Falta saber`**, e a próxima execução ataca.

Toda pergunta traz o motivo na mesma frase. As que valem a pena:

- **onde está o arquivo**, quando não achou: “Onde está o PDF da matrícula? Se
  for a foto que você tirou no cartório, a pasta já serve.”
- **de qual imóvel é**, quando o endereço não bate com nenhum: “Esta matrícula é
  da rua Ramiro Barcelos, e não achei esse endereço na sua carteira. É de qual
  imóvel? Sem isso eu leio, mas não tenho onde guardar o resultado.”
- **quem é quem**, quando a matrícula traz proprietário que o cadastro não tem:
  “Na matrícula constam João Batista de Almeida e Maria Helena de Almeida. O Sr.
  Almeida do seu cadastro é um dos dois? Os dois assinam a venda.”

**Escolha entre dois e quatro caminhos usa a UI de perguntas do harness**, com o
custo escrito em cada opção e rótulo de até quatro palavras. O caso clássico é o
documento escaneado:

```
A matrícula do V-071 (casa 3 dorm, Azenha) veio escaneada e eu li pouco.

  Colar o texto        você abre o PDF, copia e cola aqui · a ficha sai completa
  Mandar de novo       foto da página inteira, sem corte · pode sair borrada igual
  Seguir com o que li  a ficha sai agora, com quatro trechos marcados como não lidos
```

**Quando não perguntar:** o dado está na carteira (use, e cite de onde veio); é
detalhe que não muda a ficha (deixe `?` e siga); é opinião jurídica (não é
pergunta para o corretor, é linha para o advogado).

---

## 6 · O formato da saída

Um bloco só, **para copiar e encaminhar** — é o que o corretor manda ao advogado,
ao proprietário ou ao gerente do banco. Sem comentário dentro dele: o que você
quiser explicar vai fora, depois.

**As sete seções são estas, nesta ordem, e nenhuma outra. Seção sem conteúdo fica
na página com uma linha dizendo o que não se achou** — seção que some faz o
corretor achar que ela foi esquecida, e aqui isso é grave.

**Datas em `AAAA-MM-DD` dentro da ficha**, e não em prosa: a ficha viaja junto com
o documento, tem ato de trinta anos atrás, e data que ordena sozinha é o que
deixa ler a cadeia de cima para baixo. Ao **falar** com o corretor, fora do
bloco, continua valendo `14 de agosto`.

```
Matrícula 44.812 · 3º Registro de Imóveis de Porto Alegre
Imóvel V-071 (casa 3 dorm, Azenha)
Certidão emitida em 2026-08-14 · documento com 4 páginas · li as 4
Lista do que consta na matrícula. Não é parecer — quem conclui se o negócio
pode andar é advogado ou o próprio cartório.

O imóvel
- casa e terreno na rua José do Patrocínio, 812, Azenha, Porto Alegre
- terreno 300 m² · área construída averbada 118 m² (Av-9, 2004-03-11)
- lote 14 da quadra 7 · contribuinte 0123456-7

Quem consta como proprietário
- João Batista de Almeida e Maria Helena de Almeida, casados em comunhão
  parcial de bens, desde o R-4 (1998-06-22, compra e venda)
- no seu cadastro o proprietário está como Sr. Almeida. A matrícula tem dois
  nomes, e a venda costuma exigir a assinatura dos dois

Como o imóvel chegou até aqui
- R-1 · 1979-11-30 · abertura da matrícula, vinda da transcrição 21.443
- R-2 · 1986-04-18 · compra e venda, de Ivo Prestes para Célia Prestes
- R-4 · 1998-06-22 · compra e venda, de Célia Prestes para os Almeida
- nenhuma outra transmissão até o último ato que li, o Av-11

Ônus e gravames
- R-7 · 2019-04-02 · alienação fiduciária ao Banco Cruzeiro, R$ 180.000
  Alienação fiduciária — no financiamento, o imóvel fica em nome do banco até a
  dívida ser quitada; quem mora nele tem a posse, não a propriedade registrada.
  Não encontrei averbação de baixa desse ato. Enquanto ela não existir, o
  gravame consta na matrícula, mesmo que as parcelas já tenham sido pagas.
- Av-11 · 2025-09-08 · averbação premonitória, processo 5001234-56.2025.8.21.0001
  Averbação premonitória — anotação de que corre um processo contra o dono;
  serve de aviso a quem for comprar.

Averbações de construção
- Av-9 · 2004-03-11 · construção de 118 m², com habite-se
  Averbação de construção — a obra foi anotada na matrícula; sem essa anotação,
  para o registro o terreno está vazio.
- o anúncio fala em 140 m². Os 22 m² de diferença não estão averbados aqui.

O que eu não consegui ler
- Av-5 e R-6 (página 2, terço de baixo) — carimbo por cima do texto. Dá para ver
  a palavra hipoteca e o ano de 2003, e nada mais.
- duas linhas manuscritas na margem da página 3, ao lado do R-7. Não leio
  manuscrito e não vou adivinhar o que dizem.
- a última página veio cortada na altura da assinatura: não consta quem emitiu
  a certidão.

O que costuma travar, do que está acima
- a alienação fiduciária do R-7 sem baixa averbada — costuma exigir a quitação
  do banco e a averbação dessa baixa antes de o comprador conseguir registrar.
  O prazo é do banco e do cartório, e ninguém aqui promete um.
- o ato ilegível que menciona hipoteca — enquanto não for lido, ele conta como
  ônus possível, nunca como ônus inexistente.
- os 140 m² do anúncio contra os 118 m² averbados — banco financia o que está
  averbado.
- a certidão é de 2026-08-14. Ato registrado depois disso não aparece aqui.

Quem lê isto para valer é advogado ou o cartório. Eu listei o que está escrito
na matrícula; não disse que o imóvel está livre nem que pode ser vendido.
```

### Nada encontrado não é “está livre”

Seção sem achado sai assim, e nunca de outro jeito:

```
Ônus e gravames
- não encontrei ônus nos atos que consegui ler (R-1 a Av-11). Isso não é o mesmo
  que dizer que o imóvel está livre — veja o que eu não consegui ler, e a data
  da certidão.
```

### Os termos, uma linha cada, na primeira vez que aparecem

Use a linha como está escrita aqui, **uma vez**, colada ao ato que a motivou. O
termo repetido não repete a explicação.

```
matrícula          a ficha única do imóvel no Registro de Imóveis; tudo o que
                   acontece com ele é anotado ali, em ordem
R- (registro)      ato que muda quem é dono, ou cria um direito sobre o imóvel
Av- (averbação)    anotação de um fato, ou alteração e cancelamento de um
                   registro que já existia
hipoteca           o imóvel foi dado como garantia de uma dívida; enquanto o
                   cancelamento não for averbado, a garantia consta
alienação          no financiamento, o imóvel fica em nome do banco até a dívida
fiduciária         ser quitada; quem mora nele tem a posse, não a propriedade
penhora            a justiça reservou o imóvel para pagar uma dívida do dono,
                   dentro de um processo
arresto,           bloqueio determinado por juiz ou por órgão público; enquanto
indisponibilidade  durar, o registro de uma venda é barrado
usufruto           alguém mantém o direito de morar ou de receber o aluguel
                   enquanto viver, mesmo sem ser o dono
inalienabilidade   o imóvel foi doado ou deixado com a proibição de vender
espólio,           o dono morreu e o imóvel ainda está no nome dele
inventário
formal de          o documento do inventário que diz com quem cada bem ficou; é
partilha           ele que se registra para o herdeiro constar como dono
usucapião          propriedade reconhecida pelo tempo de posse, por sentença ou
                   por escritura
compromisso de     alguém já comprou e registrou o direito de receber o imóvel
compra e venda
servidão           uma faixa do terreno serve a outro imóvel — passagem, rede —
                   e acompanha o imóvel para quem comprar
averbação de       a obra foi anotada na matrícula; sem ela, para o registro o
construção         terreno está vazio
averbação          anotação de que corre um processo contra o dono; serve de
premonitória       aviso a quem for comprar
arrolamento        a Receita listou os bens do dono por causa de dívida
fiscal             tributária
fração ideal       em apartamento, a parte do terreno do prédio que pertence
                   àquela unidade
transcrição        o sistema antigo, anterior a 1976; o imóvel não tem matrícula
                   própria e o livro é outro
certidão de        a cópia da matrícula com tudo o que está nela, emitida e
inteiro teor       datada pelo cartório
```

Termo que aparecer na matrícula e não estiver nesta lista: escreva-o **com as
palavras da própria matrícula** e diga em uma linha que você não sabe explicá-lo.
**Não cite número de lei nem de artigo** — o corretor não precisa, e um número
errado derruba a confiança na ficha inteira.

### O que costuma travar, e o que costuma resolver

Esta tabela alimenta a última seção da ficha. **Sempre “costuma”**, nunca “vai” e
nunca “impede”: quem decide o efeito é advogado, cartório ou banco.

| o que consta | o que costuma travar | o que costuma resolver |
|---|---|---|
| alienação fiduciária sem baixa averbada | o comprador não registra enquanto o financiamento do vendedor não for quitado | quitação do credor e averbação da baixa — o prazo é do banco e do cartório |
| hipoteca sem cancelamento averbado | a garantia consta mesmo com a dívida paga | carta de quitação e averbação do cancelamento |
| penhora, arresto, indisponibilidade | o registro da venda pode ser barrado | é assunto de advogado; o processo está citado no próprio ato |
| imóvel ainda no nome de quem morreu | quem assina não é quem consta | formal de partilha registrado, ou alvará do juiz do inventário |
| usufruto | o usufrutuário costuma precisar concordar e assinar | o advogado diz como, e com quem |
| cláusula de inalienabilidade | a venda depende de autorização judicial | advogado |
| compromisso de compra e venda registrado a terceiro | já existe alguém com direito registrado sobre o imóvel | advogado |
| construção não averbada | banco financia o que está averbado | habite-se na prefeitura e averbação, pedidos pelo proprietário |
| metragem ou endereço que não batem com o anúncio | o anúncio e o financiamento passam a falar de coisas diferentes | conferir com o proprietário antes de repetir o número no anúncio |
| certidão antiga | ato registrado depois da emissão não aparece | certidão nova; até quando a antiga serve, quem diz é o cartório ou o banco |
| transcrição, e não matrícula | o imóvel está no sistema anterior a 1976 | cartório e advogado dizem o que fazer para abrir matrícula |

---

## 7 · O que fica gravado na carteira

Três arquivos, e só esses três.

**1 · `_bruto/` — a origem.** Já gravado no passo 2, antes da leitura.

**2 · O arquivo do imóvel — `imoveis/V-071-casa-3d-azenha.md`.** Só o
`## Documentos` e uma linha no `## Histórico`, editando o que já existe. No
`drive` não há edição de trecho: leia o arquivo inteiro antes de atualizar e
devolva o texto inteiro com a mudança dentro. Toda linha leva procedência
(contrato, regra 2):

```
## Documentos
matrícula: 44.812, 3º Registro de Imóveis de Porto Alegre  ← matrícula, 2026-08-18
conferida: lida em 2026-08-18 · falta a leitura de advogado ou do cartório  ← matrícula, 2026-08-18
pendências: alienação fiduciária ao Banco Cruzeiro (R-7) sem baixa averbada · ato ilegível que menciona hipoteca (Av-5 e R-6) · 22 m² construídos a mais que o averbado  ← matrícula, 2026-08-18
```

```
## Histórico
- 2026-08-18 matrícula 44.812 lida — 3 pendências, 2 trechos ilegíveis  ← _bruto/2026-08-14-matricula-44812.md
```

- **`conferida:` nunca vira `sim`.** `sim` se lê como “documento em ordem”, e essa
  é exatamente a frase que esta skill não escreve. O valor diz quem leu e o que
  falta.
- **`pendências:` nunca vira `nenhuma` sozinho.** Sem achado, escreva o que
  limita a leitura: `nada encontrado nos atos que consegui ler (R-1 a Av-11) · 2
  trechos ilegíveis · certidão de 2026-08-14  ← matrícula, 2026-08-18`.
- Itens separados por ` · `, e o teto de **40 linhas** do arquivo se confere **ao
  gravar**. Estourou, quem condensa é o `## Histórico` (contrato, seção 9). Fato
  corrente nunca é cortado para caber.
- **Não copie CPF, RG nem endereço pessoal** para o arquivo do imóvel: o nome
  basta, o resto está no documento, e o arquivo do imóvel é o que se abre todo
  dia. Na ficha da tela, a qualificação sai como consta — ela vai para o advogado.
- **Não sobrescreva o `proprietário:`** com o nome da matrícula. A divergência sai
  na ficha e em `## Falta saber`; quem decide o que fica no cadastro é o corretor.
- **`## O que trava` não é lugar de documento.** Aquela seção guarda o defeito que
  o cliente vai achar sozinho na visita. Pendência de matrícula mora em
  `## Documentos`.

**3 · `imoveis/_indice.md`.** Só a data da coluna `atualizado` na linha do imóvel,
e a data do título. O `estado:` não muda aqui — matrícula não tira imóvel do
mercado.

**O que ela não toca:** `hoje.md` (é vista de `/corretor:o-que-fazer-hoje`, e ele
acha a pendência no arquivo do imóvel), `funil.md`, `INDICE.md` (esta skill não
cria nem aposenta item, e recontar sem mudar nada é escrever por escrever) e o
arquivo de qualquer cliente. Proprietário que a matrícula revelou e que não tem
ficha **não vira cliente aqui** — isso é do `/corretor:organizar-carteira`; a
falta sai em `## Falta saber`.

O fecho, com os títulos exatos do contrato:

```markdown
## Guardei
- ~/carteira/_bruto/2026-08-14-matricula-44812.md — o caminho do PDF e a certidão como veio
- ~/carteira/imoveis/V-071-casa-3d-azenha.md — Documentos com o número, o cartório e três pendências; uma linha no Histórico
- ~/carteira/imoveis/_indice.md — a data da linha do V-071 (casa 3 dorm, Azenha)

## Falta saber
- o que dizem o Av-5 e o R-6 do V-071 (casa 3 dorm, Azenha) — o carimbo cobriu o texto
- se a alienação fiduciária do R-7 foi quitada, e se a baixa foi averbada — pedir a C-031 (Sr. Almeida)
- quem é Maria Helena de Almeida no seu cadastro — ela assina a venda junto
```

Esse `## Guardei` é o do `local`. No `drive`, as mesmas três linhas nomeiam a
pasta dentro da carteira: `- _bruto/2026-08-14-matricula-44812.md, na pasta
carteira do seu Drive — onde está o PDF e a certidão como veio`.

---

## 8 · Onde ela para

Isto não é aviso de rodapé: é o desenho da skill. Cada linha abaixo é um lugar
onde ela **diz que não consegue**, em vez de entregar um palpite com cara de
leitura.

- **Ela não é parecer, e não substitui um.** Ela lista o que está escrito na
  matrícula. Se o negócio pode andar, quem diz é advogado ou o cartório. Ela não
  responde “então pode vender?” nem com um talvez.
- **PDF escaneado como imagem devolve pouco ou nada.** Certidão fotografada ou
  digitalizada sem camada de texto chega quase vazia. Ela diz na cara — “esse
  arquivo veio como imagem e eu li quatro linhas” — e oferece os caminhos da
  seção 5. **Ela não adivinha o que estava na página.**
- **Manuscrito, carimbo por cima do texto e margem cortada não se leem.** Vão
  para “o que eu não consegui ler” com a página e a posição, e o ato ilegível
  conta como ônus possível até alguém ler.
- **Ela não abre o site do cartório, não consulta registro eletrônico e não busca
  na internet.** Não tem essas ferramentas. A certidão vem do corretor.
- **Ela não emite nem valida certidão.** Ler a cópia que chegou não é ter certidão
  atualizada, e ela não diz até quando a certidão em mãos serve — o prazo é do
  cartório e do banco (contrato, seção 10: nenhuma skill promete prazo de
  cartório, de banco ou de prefeitura).
- **A matrícula não é a documentação toda.** Faltam as certidões pessoais dos
  vendedores, o IPTU, a negativa de condomínio. Ela pode dizer que faltam; **não
  diz que, com elas, está tudo certo**, e listar documento é assunto do
  `/corretor:documentos-do-negocio`.
- **Documento que não é matrícula ela nomeia e devolve.** Escritura, contrato,
  IPTU, certidão de ônus e espelho de cadastro não são matrícula. Ela diz qual
  documento está lendo e que a matrícula continua faltando.
- **Transcrição do sistema antigo ela lê como transcrição**, avisa que o imóvel
  não tem matrícula própria, e para ali: é caso de cartório e de advogado.
- **Documento de outro imóvel ela flagra, não encaixa.** Endereço, lote ou
  unidade que não batem com o arquivo do imóvel viram pergunta, nunca uma
  suposição silenciosa de que é o mesmo.
- **Ela não calcula imposto, taxa, custo de cartório nem saldo devedor.** Valor
  que aparece na matrícula ela transcreve com a data do ato, e diz que é o valor
  daquele ato, não o de hoje.
- **Ela não decide o que é do corretor.** Preço, aceitar proposta, seguir ou não
  com o negócio: ela mostra o que olhar e para.
- **Ela nunca inventa dado.** O que não apurou sai como `?` e vira `## Falta
  saber`. Vale para metragem, valor, data, prazo e nome de gente — e em
  matrícula, nome errado é a pessoa errada assinando.
