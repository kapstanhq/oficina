---
name: gravar-video-do-imovel
description: >-
  Monta o roteiro de um vídeo curto do imóvel, plano a plano, na ordem em que se
  anda por ele — quanto tempo dura cada plano, o que enquadrar, para onde andar
  e o que falar por cima —, mais os três primeiros segundos e a legenda pronta.
  Lê o arquivo do imóvel na carteira, no computador ou no Google Drive, ou o
  link que o corretor colar. Ela não edita, não corta, não gera imagem, não
  escolhe música e não grava. Use quando o corretor vai gravar com o celular na
  mão e não sabe por onde começar, ou quando ele diz “vou gravar um vídeo da
  casa”, “me monta um roteiro pro Reels do apartamento”, “o que eu falo no
  vídeo”, “por onde eu começo a filmar”, “faz um story do V-071 (casa 3 dorm,
  Azenha)”, “grava um vídeo pro Zap”, “ninguém assiste meus vídeos até o fim”,
  ou pede a legenda do vídeo que já tem.
license: MIT
compatibility: >-
  Lê a carteira no computador ou no Google Drive — o transporte sai da linha
  `carteira:` do INDICE.md. Só lê — nunca grava nada, em nenhum transporte. Sem
  carteira, monta o roteiro com o imóvel colado na conversa, ficha ou link; o
  que se perde é a voz do corretor e o horário de visita, que moram no
  INDICE.md. Link só abre onde houver acesso à internet.
allowed-tools: Read Glob Grep
---

# O roteiro do vídeo do imóvel

Esta skill devolve o roteiro de um vídeo curto: plano a plano, na ordem em que
se anda pelo imóvel, com o tempo de cada plano, o que enquadrar, para onde
andar e a fala que vai por cima — mais os três primeiros segundos e a legenda.

Ela para na porta da edição: **não corta, não legenda o vídeo, não gera imagem,
não escolhe música e não grava.** Quem segura o celular é o corretor.

---

## 1 · Antes de tudo

O corretor chega com o id e o apelido do imóvel — `V-071 (casa 3 dorm, Azenha)`
— ou com o link da ficha. Sem nenhum dos dois, a seção 3 diz por onde procurar.

1. Leia `references/CONTRATO.md`, que está ao lado desta skill. Ele é a lei do
   pack, e o que vale como formato está lá — não aqui. Interessam agora as
   seções 1 (onde a carteira mora, e os dois transportes), 2 (id e apelido),
   4.4 (o arquivo do imóvel), 8 (ordem de busca e perguntas) e 10 (como uma
   skill começa e termina).
2. Leia o `INDICE.md` da carteira pela primeira leitura do CONTRATO §1. A linha
   `carteira:` diz o transporte — `local` ou `drive` — e **toda leitura desta
   execução vai por ele**. Dali saem quatro coisas: o `modo:`, o nome do
   corretor — que é a **voz das falas** —, a região, e o `## Como eu trabalho`,
   que já traz o canal padrão e o horário de visita que ele costuma oferecer.
3. **Não existe `INDICE.md`?** Diga isso em uma linha: “Não achei a sua
   carteira. Rode `/corretor:comecar` — são uns dez minutos, e você sai com um
   imóvel e um cliente já dentro dela.” Não crie a carteira e não improvise em
   outra pasta. **O roteiro, porém, sai** do imóvel que ele colar — ficha ou
   link (contrato §11); o que se perde é a voz do corretor e o horário de
   visita, que moram no `INDICE.md`. Esta skill não grava em transporte nenhum,
   então o `## Guardei` do fecho já é a linha de sempre.

---

## 2 · O modo

Leia a linha `modo:` do `INDICE.md`. `automatico` e `automático` valem; qualquer
outro valor, linha ausente ou arquivo ilegível é **copiloto** (CONTRATO §5).

**Copiloto.** Para nas três perguntas da seção 4. Antes de parar, entrega o que
já ficou pronto — a rota dos cômodos e os planos que não dependem da resposta.
Parar de mãos vazias faz o corretor esperar por nada.

**Automático.** Escolhe o formato, a duração, a ordem e o que fica fora do
vídeo, e declara tudo em `## Decidi sozinho`, uma linha por escolha: *o que fiz
— por que — como desfazer.*

E há uma diferença que o automático **não** apaga: escolher não é saber. O
horário de luz do imóvel não é escolha — é um fato que só o corretor tem. No
automático ele não vira pergunta: vira um `?` no roteiro (“grave o pátio de
tarde; qual é a hora certa aqui, só você sabe”) e uma linha em `## Falta saber`.
Inventar a hora do sol é inventar dado de imóvel, e isso nenhum modo autoriza.

Esta skill não tem exceção de modo — a única do pack é `conferir-matricula`.

---

## 3 · Achar o imóvel

Desça a ordem de busca do CONTRATO §8 e pare no primeiro degrau que responder:

1. **O que o corretor disse agora** — id, apelido, bairro, “a casa da Azenha”.
2. **O `_indice.md` de `imoveis/`** — case o que ele disse com o id e o
   apelido. Bateu em dois? Mostre os dois e pergunte qual — e isso conta como
   uma das três perguntas.
3. **O arquivo do imóvel, `<id>-<apelido>.md` em `imoveis/`** — é ele o dono
   dos fatos. É daqui que sai o roteiro inteiro.
4. **`_bruto/`** — a ficha ou a conversa de onde os fatos vieram, quando o
   arquivo tem `?` no que importa.
5. **O link**, só se o imóvel ainda não estiver na carteira. Site que monta a
   página por JavaScript devolve nada: diga na cara — “esse site não abre para
   mim” — e peça a ficha colada. **Não chute dado de imóvel**, nem para
   ilustrar um plano.

Imóvel que não está na carteira e não tem link que abra nem ficha colada: pare.
O caminho é `/corretor:anunciar-imovel`, que é a skill que põe imóvel na
carteira. Roteiro de imóvel adivinhado vira fala errada gravada em vídeo, e
vídeo não se corrige com uma edição de texto.

### O que ler dentro do arquivo, e para quê

```
## O que vende      vira o GANCHO e o plano de fecho — é a matéria-prima
## O que trava      decide o que fica fora e o que se enfrenta com uma frase curta
dormitórios, vagas  viram fala, exatamente como estão escritos
tipo, área          o número da fala sai daqui, com procedência, ou não sai
endereço, bairro    o que dá o lugar em três palavras
estado              leia antes de tudo o resto: veja o aviso abaixo
```

**`estado:` manda parar ou avisar.** `vendido`, `alugado` e `fora do mercado`:
não se grava vídeo — pergunte em uma linha se voltou ao mercado, e se voltou,
quem muda o estado é `/corretor:organizar-carteira`. `reservado`: um aviso de
uma linha, porque o vídeo vai trazer gente para um imóvel que ele talvez não
possa mostrar. `exclusividade:` vencida ou `?` também é aviso de uma linha —
não é trava.

**`## O que vende` vazio** e nenhuma visita registrada: não pergunte. Monte a
rota comum de cômodos, tire o gancho do melhor fato do cabeçalho (o pátio, a
suíte, as duas vagas) e ponha em `## Falta saber`: “o que vende o V-071 (casa 3
dorm, Azenha) — me diga na volta da visita, e o próximo roteiro começa por ali.”

---

## 4 · As três perguntas, e não há uma quarta

Teto de **três perguntas na execução inteira** (CONTRATO §8), e a de identificar
o imóvel conta. Precisou perguntar qual é o imóvel? Então a do formato cai: use
o padrão e diga qual usou.

Nesta ordem, uma por vez, cada uma com o motivo na mesma frase:

**1 · A luz.** “Que horas esse imóvel fica bonito? Vídeo gravado na hora errada
mostra cômodo cinza, e é a única coisa que nenhuma foto conserta depois.” A
resposta vira a primeira linha do roteiro e um fato do arquivo.

**2 · O que fica fora.** “Tem alguma coisa que você não quer no vídeo — a vista
para o muro, o quarto sem janela, a cozinha? Eu desvio a câmera, mas quem decide
o que sai é você.” Leia `## O que trava` antes e cite o que está lá: perguntar
no escuro faz o corretor pensar por você.

**Esconder é decisão dele, e a skill não decide por ele.** Junto com a resposta,
duas coisas, uma linha cada: o que sai do vídeo **não sai do arquivo** — `## O
que trava` continua lá, e é o que ele fala na visita, antes de a pessoa achar
sozinha; e defeito que o vídeo esconde e a visita mostra custa a visita inteira.

**3 · O formato.** Esta é escolha entre caminhos: use a UI de perguntas do
harness, com o custo escrito em cada opção (CONTRATO §8).

```
Que vídeo você vai gravar do V-071 (casa 3 dorm, Azenha)?

  Vertical de 40 s     o que roda no Reels e no status · 9 planos, uma gravação só
  Story em 4 telas     dá para gravar em dias diferentes · não vira post nem link
  Horizontal de 80 s   para o site e o portal · exige tripé ou mão muito firme
```

O padrão, quando a pergunta não couber: **vertical de 30 a 45 segundos**, no
canal que está em `## Como eu trabalho`.

Não pergunte o que já está escrito: bairro, dormitórios, vaga, preço e horário
de visita estão na carteira. Skill que pergunta o que o corretor já respondeu é
abandonada na segunda execução.

---

## 5 · Montar a rota

**A regra é uma: a câmera anda como uma pessoa anda.** Cada plano começa onde o
anterior terminou. Vídeo que pula do quarto para o pátio e volta para a cozinha
vira quebra-cabeça, e ninguém remonta a planta de cabeça.

A ordem base — pule o que o imóvel não tem, e nunca invente cômodo:

```
1  GANCHO          o melhor ambiente, já andando. NÃO é a fachada
2  chegada         a fachada ou o hall, parado, para dar o lugar
3  entrada         a porta e o primeiro passo para dentro
4  sala            o ambiente que mostra tamanho
5  cozinha         curto, e honesto
6  circulação      o corredor: mostra que os quartos são perto
7  dormitórios     o principal e mais um. Três quartos iguais são dois planos
8  suíte, banho    dois a quatro segundos, nunca mais
9  o extra         pátio, sacada, vaga — o que o bairro não dá de graça
10 fecho           volta ao gancho, parado, com a chamada
```

O gancho não é a fachada porque a fachada não segura ninguém: ela vale como
plano 2, quando a pessoa já ficou. E o melhor ambiente aparece duas vezes — na
abertura e no fecho —, o que é de propósito: quem chegou ao fim vê de novo a
razão de ter ficado.

### O que vai escrito em cada plano

```
Enquadre   o que está no quadro, em uma linha
Ande       para onde o corpo vai, ou “não ande”
Fale       a frase literal, entre aspas, na voz dele
Cuidado    só quando há uma armadilha de verdade
```

Quatro coisas de ofício que entram como `Cuidado` quando cabem, e nunca como
enfeite:

- **Entre no cômodo e filme do canto.** Do meio, o cômodo parece menor; do
  canto, cabe a parede inteira.
- **De costas para a janela.** Contra a luz, o cômodo apaga e o vídeo fica com
  um retângulo branco no meio.
- **Espelho e vidro devolvem você e o celular.** Ou desvia, ou aceita e passa
  rápido.
- **Ande na velocidade de quem mostra**, não de quem foge. Uma parede por
  segundo.

### As falas

- **Primeira pessoa, do jeito dele**, com o nome que está no `INDICE.md`. A
  Kapstan não aparece, não assina e não é citada — o vídeo sai do celular dele.
- **Fala de 3 segundos tem até 9 palavras.** Conte em voz alta antes de gravar:
  o que não cabe no plano é comido pelo corte.
- **Número na fala, só o que está no arquivo com procedência.** `vagas: 2`
  autoriza “duas vagas” e não autoriza “duas vagas cobertas”. `área: ?` proíbe
  qualquer metragem, inclusive “uns cem metros”.
- **O que trava não se esconde com palavra bonita.** Quando o corretor decidiu
  mostrar, é um plano curto e uma frase neutra: “A cozinha é essa, compacta.”
  Isso tira a surpresa da visita e não custa nada.
- **Nada de hype:** “imperdível”, “oportunidade única”, “corre que voa”,
  “bem-vindos ao seu novo lar”. Nada de emoji.
- **Preço fica na legenda, não na fala** — o vídeo não se reedita quando o preço
  muda, e a legenda se edita em dez segundos. E só se `preço:` estiver no
  arquivo com procedência. Diga em uma linha que ele pode tirar.
- **Nada de prazo prometido** — financiamento, cartório, prefeitura. Não é do
  corretor prometer, e não é da skill escrever.

### TODO na tela

Imóvel que já está na carteira não é TODO: são três leituras e um texto. Imóvel
que vem de link ou de ficha colada é — abrir a página, ler a carteira e montar o
roteiro são três passos demorados, e demorar sem mostrar é onde o corretor acha
que travou.

---

## 6 · O formato da saída

Dois blocos para colar, sozinhos, sem comentário dentro (CONTRATO §10): o
roteiro e a legenda. O que você quiser explicar vai fora deles, depois.

```
ROTEIRO · V-071 (casa 3 dorm, Azenha) · vertical · 37 s · 9 planos
Grave entre 15h e 17h, que é quando o pátio pega sol.

OS TRÊS PRIMEIROS SEGUNDOS
  aparece    o pátio com sol, câmera já andando para dentro dele
  se ouve    “Esse pátio pega sol a tarde inteira.”
  não faça   abrir pela fachada, dizer “oi, pessoal”, dizer o nome da imobiliária

1 · PÁTIO · 4 s
  Enquadre   o pátio inteiro, com o sol batendo na parede do fundo
  Ande       para dentro do pátio, devagar, três passos
  Fale       “Esse pátio pega sol a tarde inteira.”

2 · FACHADA · 3 s
  Enquadre   a casa inteira, da calçada, celular em pé
  Ande       não ande. Fique parado e conte até três
  Fale       “Casa de 3 dormitórios na Azenha.”

3 · ENTRADA · 4 s
  Enquadre   a porta, e entre com a câmera na frente do corpo
  Ande       um passo para dentro, e para
  Fale       “Duas quadras do Colégio Rosário.”

4 · SALA · 5 s
  Enquadre   do canto da porta, a parede maior no quadro
  Ande       gire devagar, da esquerda para a direita, sem voltar
  Fale       “São 120 metros no total.”
  Cuidado    fique de costas para a janela, senão a sala apaga no vídeo

5 · COZINHA · 4 s
  Enquadre   da porta, sem entrar
  Ande       não entre. De dentro ela parece menor do que é
  Fale       “A cozinha é essa, compacta.”

6 · CORREDOR · 5 s
  Enquadre   o corredor com as portas dos quartos
  Ande       até o fim do corredor, sem parar
  Fale       “Os três dormitórios saem daqui.”

7 · SUÍTE · 4 s
  Enquadre   do canto, a cama e a porta do banheiro no mesmo quadro
  Ande       um passo para dentro
  Fale       “A suíte é essa, com banheiro.”

8 · VAGAS · 3 s
  Enquadre   as duas vagas, do portão
  Ande       não ande
  Fale       “Duas vagas.”

9 · FECHO · 5 s
  Enquadre   o pátio de novo, do mesmo canto do plano 1
  Ande       não ande. Termine parado
  Fale       “Quer ver sábado de manhã? Me chama.”
```

```
Casa de 3 dormitórios na Azenha, com pátio que pega sol de tarde.

120 m², suíte, duas vagas, e o Colégio Rosário a duas quadras.
A cozinha é compacta — o resto da casa compensa.

R$ 520.000. Quer ver sábado de manhã? Me chama.

#azenha #portoalegre #casaavenda
```

Regras dos dois blocos:

- **O total é a soma dos planos**, não um número redondo. Quer 30 segundos?
  Tire planos, não segundos de cada um — plano de 2 segundos não dá tempo de
  ninguém entender o que está vendo.
- **A legenda:** a primeira linha é a única garantida, porque o resto some atrás
  do “ver mais”. Depois, duas ou três linhas de fato — só o que está no arquivo.
  Uma chamada. Até três hashtags, de bairro, cidade e tipo; as genéricas não
  trazem ninguém. Sem emoji.
- **Vai mandar o vídeo para um cliente no WhatsApp?** A legenda não serve: o
  formato é outro (CONTRATO §6), e quem entrega isso pronto é
  `/corretor:responder-lead` ou `/corretor:retomar-contato`.
- Fora dos blocos cabem duas linhas de recado — o aviso do `estado:`, o preço
  que ele pode tirar da legenda. Duas, não dez.

---

## 7 · O que fica para a carteira

**Esta skill não escreve na carteira. Ela lê.** As ferramentas dela são de
leitura, e é de propósito: a execução acontece com o corretor a caminho do
imóvel, e o que ele diz ali é para conferir na volta, não para gravar de
imediato.

Mas o que ele respondeu é fato, e fato tem lugar. Entregue as linhas prontas,
com o arquivo, a seção e a procedência, para `/corretor:organizar-carteira`
gravar — ou para ele mesmo colar:

```
o horário de luz         imoveis/<arquivo>.md · ## O que vende
                         - pátio pega sol até as 17h  ← corretor, 2026-08-19

o que ele quis esconder  imoveis/<arquivo>.md · ## O que trava
                         - escada sem corrimão  ← corretor, 2026-08-19
                         (já está lá? não repete)

o vídeo, depois          imoveis/<arquivo>.md · ## Histórico
                         - 2026-08-19 vídeo vertical gravado
```

Procedência é `← corretor, <data de hoje>` quando ele disse agora, na conversa;
`← visita, <data>` só se ele disse que viu no imóvel. Nada de campo novo: o que
não cabe em nenhuma seção do gabarito vai para `## Histórico` com a data
(CONTRATO §4).

O fecho, com os títulos exatos e nesta ordem (CONTRATO §10):

```markdown
## Guardei
- nada. Esta skill só lê a carteira — as linhas acima entram quando você rodar
  /corretor:organizar-carteira, ou colando você mesmo.

## Falta saber
- o horário em que a sala do V-071 (casa 3 dorm, Azenha) pega luz
- se dá para filmar com o inquilino em casa

## Decidi sozinho
- <só em modo automático · o que fiz — por que — como desfazer>
```

---

## 8 · Onde ela para

Dito antes, não depois — e cada linha é uma coisa que ela realmente não faz.

- **Ela não edita.** Não corta, não junta os planos, não põe legenda queimada,
  não acelera e não estabiliza. O que sai daqui é papel; o vídeo é o celular
  dele e o aplicativo que ele já usa.
- **Ela não escolhe música, e não indica faixa.** Trilha com direito autoral
  derruba o post ou tira o som dele, e quem responde pela escolha é quem
  publica. Se ele perguntar, a resposta é essa, em uma linha.
- **Ela não gera imagem nem vídeo**, não faz tour virtual, não desenha planta e
  não “melhora” foto. Imóvel que aparece diferente do que é traz gente que vai
  embora na porta.
- **Ela não sabe a luz do imóvel.** Nenhum arquivo diz para onde a janela dá.
  Por isso ela pergunta, e por isso a resposta vira fato guardado — na segunda
  vez ela já sabe.
- **Ela não decide o que esconder.** Ela pergunta, desvia a câmera onde ele
  mandou, e não tira do arquivo o que tirou do vídeo.
- **Site que monta a página por JavaScript devolve nada.** Quando o link não
  abrir, ela diz “esse site não abre para mim” e pede a ficha colada. Não chuta
  metragem, preço, dormitório nem nome de rua — nem para ilustrar.
- **Ela não sabe se dá para filmar.** Imóvel ocupado tem morador, e morador
  precisa saber que vai ser filmado. Rosto de gente, criança, animal, retrato na
  parede e papel com nome ou número à vista não entram no vídeo. Ela escreve
  isso como `Cuidado` no plano e para aí: pedir autorização é com ele.
- **Ela não publica e não manda.** Não sobe para portal, não posta, não envia
  para cliente nenhum. Ela escreve; quem aperta enviar é o corretor.
- **Ela não fala de preço além do que está no arquivo**, não diz se o preço está
  bom, não sugere baixar, e não promete prazo de financiamento, de cartório ou
  de prefeitura.
- **Ela não conta visualização e não promete alcance.** Quantas pessoas vão ver
  o vídeo não é coisa que se saiba antes, e número inventado sobre o próprio
  trabalho é o pior dos números inventados.

Quando alguma coisa não der, ela diz em uma linha o que não deu e qual é o
caminho — não pede desculpa duas vezes e não some do assunto.
