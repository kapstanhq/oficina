---
name: perfil-de-busca
description: >-
  A entrevista que abre a busca, pela pessoa: uma conversa, uma pergunta por
  vez — por que busca agora, o que quer do próximo trabalho, do que se
  orgulha, o que não quer mais, o momento (primeiro emprego, troca de área,
  volta depois de uma pausa). Dela saem os dois arquivos que todas as outras
  leem: o `perfil.md` — que vaga procurar, o que aceita, o que descarta,
  quanto e onde olhar — e a `trajetoria.md` — o que fez, com os números que
  pode dizer e o que NÃO se diz. O que ele colar (PDF do LinkedIn, currículo
  antigo) vira conferência; quem não tem currículo nem carteira assinada
  começa do que já fez. Pausa e volta sem perder o que ouviu. Use quando ele
  disser "monta meu perfil", "que vaga eu devo procurar", "toma meu
  currículo", "atualiza minha trajetória", "mudei a pretensão", "só aparece
  vaga errada" — ou quando outra skill acusar que falta um dos dois. Não
  busca (/vagas:buscar-vagas), não julga (/vagas:triar-vagas), não escreve
  currículo (/vagas:montar-curriculo).
license: MIT
compatibility: >-
  Precisa de uma busca montada (/vagas:comecar) para gravar. Sem busca ela
  ainda faz o trabalho: a conversa, o perfil e a trajetória saem na tela, e o
  `## Guardei` diz que nada foi gravado. Lê PDF pelo caminho do arquivo. Não
  abre link e não precisa de conector; com os conectores ligados, confere se
  o nome de empresa de `## Onde olhar` responde.
allowed-tools: Read Glob Grep Write Edit
---

# A entrevista: o perfil e a trajetória

## 1 · O que ela faz, e o que ela não faz

Ela escreve **as duas réguas do pack**. O `perfil.md` diz o que entra na busca
e o que sai dela; a `trajetoria.md` diz o que se pode afirmar em nome do
candidato. Com os dois, `/vagas:buscar-vagas` sabe o que trazer,
`/vagas:triar-vagas` sabe contra o que medir, e `/vagas:montar-curriculo` e
`/vagas:candidatar` sabem o que é verdade.

**Ela abre pela pessoa, não pelo papel.** Que vaga procurar depende do que ele
quer, do que o desgasta e do momento em que está — e nenhum currículo diz
isso. O currículo antigo conta o que ele fez para outra busca; a conversa conta
o que ele quer desta. Por isso o que ele colar chega **depois**, e serve para
conferir.

Ela **não** melhora a história. O que ele conta entra como ele contou, com
`← candidato, <hoje>`; o que cola entra com o arquivo de `_bruto/` de onde
saiu. Número que ninguém mediu não vira número: vira `número que NÃO tenho:` —
é o que impede o currículo de amanhã de preencher o buraco.

Ela **não** adivinha o perfil pelas vagas que já estão na busca: elas mostram
o que a fonte devolveu, não o que ele quer.

## 2 · Antes de tudo

1. lê `~/busca/INDICE.md` — `references/contrato/10-0-comeca-e-termina.md` diz
   como começar. Não existe: uma linha e `/vagas:comecar`
2. lê a linha `modo:` e o `## Quem sou`
3. **lê o `perfil.md` e a `trajetoria.md`, se existirem.** Existe? É revisão,
   não começo: mostre o que está lá, pergunte o que mudou, e mexa só no que ele
   disser. Arquivo reescrito por cima apaga a razão que ele levou dois meses
   para descobrir
4. **procura em `_bruto/` uma conversa pausada** — `*-conversa-perfil.md` com
   `estado: em andamento`. Achou: é dela que se continua (passo 8)
5. na revisão, lê o `## Arquivo morto` de `vagas/_indice.md` — é dele que sai
   o passo 7

Os formatos estão em `references/contrato/04-9-o-perfil.md` e em
`references/contrato/12-0-a-trajetoria-e-o-curriculo.md`; as três regras em
`references/contrato/03-0-as-tres-regras.md`; o que nunca entra, em
`references/contrato/03-1-o-que-e-seu.md`; o formato do que vai para
`_bruto/`, em `references/contrato/04-7-o-bruto.md`; os tetos em
`references/contrato/09-0-os-tetos.md`. Os gabaritos vazios estão em
`references/modelos/perfil.md` e `references/modelos/trajetoria.md`.

## 3 · O modo

`copiloto` — o padrão, e o modo em que esta skill trabalha melhor: uma
pergunta de cada vez, e o arquivo crescendo na tela.

`automatico` — ela **continua perguntando**. Automático aqui seria decidir por
ele onde quer trabalhar e o que fez. O que muda é o resto: como agrupar as
respostas, o que vira critério e o que vira `## O que eu não sei ainda`, e cada
escolha vai para `## Decidi sozinho` (contrato §5).

**Uma coisa não muda com o modo:** o que vai para `## O que NÃO se diz` é
confirmado por ele, linha a linha. É a lista que protege a reputação dele.

## 4 · O passo a passo

A ordem é **a pessoa, depois o papel, depois o perfil**. Se ele pedir só um
pedaço — “atualiza o piso”, “acrescenta essa empresa” —, faça só esse.

### Passo 0 · O que ele já contou e está esperando

Com a trajetória já escrita, procure em `_bruto/` os arquivos com
`estado: ainda NÃO entrou na trajetoria.md` — o que ele disse de si numa tela
de outra skill (contrato §12). Mostre cada fato como ele escreveu, com a linha
da trajetória em que entraria, e grave o que ele confirmar, com a procedência
do arquivo. Feito, troque a linha para `estado: levado para a trajetoria.md em
<hoje>` — o resto do arquivo não se edita.

### Passo 1 · A conversa, pela pessoa

**Uma pergunta por vez, aberta, com o motivo na mesma frase.** A ordem é a que
a conversa pedir; os assuntos são estes, e nenhum fica de fora:

```
por que agora         o que fez você começar a procurar — contrato que acaba,
                      demissão, cansaço, mudança, primeira vez. Não é
                      julgamento: é o que decide a pressa e o que você aceita
o que você quer       do próximo trabalho: o que precisa ter, e o que seria bom
do que se orgulha     uma ou duas coisas que você fez: a situação, o que VOCÊ
                      fez, o que mudou depois. Com número, se houver
o que desgasta        o que você não quer mais: escala, deslocamento, tipo de
                      chefia, tipo de tarefa
o momento             primeiro emprego · troca de área · volta depois de uma
                      pausa · recolocação na mesma área
quando começa         e se muda de cidade, ou para qual
formação, idiomas     perguntados, nunca deduzidos — o nível como é, não como
e ferramentas         a vaga gostaria
```

A **senioridade** sai do que ele contou, e ele confirma: “pelo que você fez,
eu procuraria vaga de pleno — faz sentido?”.

**Lacuna se conta, não se esconde.** Período sem trabalho — licença, cuidado
de alguém, doença, estudo, demissão — pergunta-se uma vez, com o motivo: “como
você quer que esse período apareça? Data escondida é a primeira coisa que o RH
pergunta.” Ele entra na trajetória como bloco próprio, com o período e as
palavras que ele escolher: `### pausa · licença-maternidade · 2024-02 a
2024-07`. O quanto se detalha é dele; a data sempre aparece.

**PcD e vaga afirmativa só se ele quiser.** Uma pergunta, oferecendo, nunca
supondo: “há vagas afirmativas — para pessoas com deficiência, pessoas
negras, mulheres, 50+, LGBTQIA+. Quer que a busca procure por elas?” Sim: a linha
`autodeclaração, para formulário:` do `INDICE.md` recebe o que ele disser, com
as palavras dele, e os termos entram em `## Termos de busca`. Não: nada se
escreve, e o assunto não volta.

**Quem não tem currículo nem carteira assinada tem por onde começar.** A
pergunta é o que ele já FEZ, com qualquer nome: bico, venda por conta própria,
ajudar no negócio da família, voluntariado, cuidar de gente, curso, estágio,
projeto da escola. Cada coisa entra como experiência com o nome verdadeiro —
`### venda de doces por encomenda · por conta própria · 2023-03 a 2025-01` —,
nunca promovida a emprego. Primeiro emprego: formação e cursos abrem a
trajetória.

**A cada três perguntas, alguma coisa pronta na tela** (contrato §8) — o
pedaço do perfil ou da experiência já escrito. Ver o formato ensina a
responder as próximas, e mostra que a conversa está virando arquivo.

### Passo 2 · O que ele tem no papel, para conferir

Com a conversa andada, peça o que existir:

> Você tem um currículo antigo, ou o PDF do seu LinkedIn? Eu confiro com o que
> você me contou — o que estiver lá e faltar aqui, eu pergunto.

**O PDF do LinkedIn sai em três cliques**: no seu perfil, o botão “Mais” (em
algumas versões, “Recursos”) → “Salvar como PDF”. Ele pode colar o texto ou só
**passar o caminho do arquivo** — `Read` lê o PDF direto.

**O que ele colar ou apontar vai inteiro para `_bruto/`, antes de qualquer
extração** — `AAAA-MM-DD-curriculo-antigo.md`, `AAAA-MM-DD-perfil-exportado.md`
—, com o cabeçalho de três linhas da seção 4.7 (de PDF, o texto lido, e o
caminho do arquivo no `de:`), e **não se edita nunca mais**. Currículo antigo
que exagera continua exagerando lá: ele é a prova do que foi escrito.

**O papel confirma; ele decide.** Cada diferença entre o papel e a conversa
vira uma pergunta: “o PDF diz ‘inglês avançado’, e você me disse intermediário
— qual eu escrevo?”. O que só o papel tem entra depois de ele confirmar.

**CPF, RG, endereço, data de nascimento e foto não saem do bruto** (seção
3.1), e ela diz em uma linha que deixou de fora.

### Passo 3 · A trajetória, experiência por experiência

Da mais nova para a mais antiga: período, empresa, cargo, e de duas a quatro
linhas do que ele FEZ — verbo no passado, coisa concreta. **Oito linhas** cada
(seção 9); o que não couber fica no bruto.

Em cada linha com número, uma pergunta, com o motivo:

```
ruim   Esse número está certo?
bom    "A base foi de 4 mil para 31 mil" — de onde vem esse número? Se alguém
       ligar para a empresa e perguntar, é isso que vão dizer? Ele vai sair
       IGUAL em todo currículo, e é o primeiro que se checa.
```

```
"vem do relatório / estava no currículo"   entra, com a procedência
"é mais ou menos isso" · "não sei"         NÃO entra como número. Entra o fato,
                                           e `número que NÃO tenho:` diz o que
                                           faltou medir
```

`## Formação`, `## Idiomas` e `## Ferramentas e métodos` saem do passo 1,
confirmados — formação sempre com “concluída” ou “não concluída”.

### Passo 4 · O que NÃO se diz

Não sai de “tem algo que eu não devo dizer?” — que devolve “não” —, e sim de
três perguntas concretas sobre o que ele acabou de contar:

```
curso e título      "o MBA de 2023 — você concluiu?" Cursado e não concluído é
                    a linha mais comum, e a que mais vira "concluído" por
                    arrasto na terceira versão do currículo
vínculo             "lá você era contratado deles, ou por uma terceirizada?"
                    Vínculo indireto dito como direto o RH desmente numa ligação
número e autoria    "esse resultado foi seu, do time, ou de uma área maior?"
```

Cada resposta vira **regra**, não confissão: `o MBA nunca aparece como
concluído`. Ele confirma a lista inteira antes de gravar — nos dois modos.

### Passo 5 · O perfil: que vaga procurar

**“Que vaga eu devo procurar?” tem resposta, e ela sai da conversa.** Com o que
ele quer, o que o desgasta e o que já fez na tela, proponha **duas ou três
direções**, cada uma com o porquê numa linha e o nome que o anúncio usa:

```
1  técnica de enfermagem em UTI      é onde você disse que se sente útil, e
                                     são os plantões que você já faz
2  técnica de enfermagem em clínica  sai do noturno, que você disse que cansa;
                                     paga menos adicional
```

Ele escolhe e ordena — “se aparecerem duas boas no mesmo dia, qual você abre
primeiro?” é a ordem que a triagem usa para desempatar. Os `## Termos de busca`
saem daqui: como o anúncio ESCREVE o cargo, com as variações.

Depois, o que ele aceita, na ordem em que mais separa:

```
regime e lugar   remoto, híbrido, presencial — e onde; a mudança de cidade
                 entra aqui. É o corte que mais elimina
contrato         a lista aberta: CLT, PJ, temporário, estágio, aprendiz,
                 autônomo, intermitente, cooperado, concurso — só os que ele
                 aceita
jornada          como ele escreve: 44h seg–sex, 12x36, 6x1, meio período
o que descarta   "que tipo de vaga você abre e fecha em dez segundos?"
```

**`## Descarto` só aceita corte que se LÊ no anúncio.** É a única seção que age
sozinha — `/vagas:buscar-vagas` descarta por ela sem perguntar:

```
passa        presencial fora de Recife · escala 6x1 · estágio ·
             inglês fluente exigido — está escrito no anúncio, ou não está
não passa    "chefia ruim" · "ambiente pesado" — ninguém escreve isso na
             vaga. Vai para `## Por que`, e `/vagas:triar-vagas` o pesa
```

Corte que não passa no teste **não é recusado: é movido**, e ela diz para onde.
O que desgasta e o que ele quer vão para `## Por que`, com procedência — é a
razão que decide o que afrouxar quando a fila secar. Quando pode começar, idem.

### Passo 6 · Quanto, e onde olhar

**Quanto: uma linha por contrato que ele aceita**, com o piso, e a frase pronta
de `o que eu digo quando perguntam:` — `CLT: R$ 3.200` e “a partir de R$ 3.400,
conforme o adicional noturno”. Pergunte o piso dizendo para que serve — “é o
número abaixo do qual a vaga não te serve; ele não sai deste arquivo” — e
cumpra: nenhuma skill escreve o piso numa mensagem (seção 3.1). Não quer dizer?
`?`, e a triagem pesa sem ele.

**Onde olhar.** Uma linha por fonte, com o que passar a ela:

```
gupy              pelos termos de busca, com a cidade (com acento) e o contrato
solides           pelos termos, com "Cidade - UF" — forte em vaga operacional
linkedin-vagas    pelos termos de busca — e o regime, se ele só aceita remoto
apify             os mesmos termos, pela listagem paga: `—` até ele dizer que quer
linkedin (logado) os mesmos termos, DENTRO da conta dele: `—` até ele dizer que quer
greenhouse        o nome de cada empresa como aparece no endereço do quadro
ashby · lever     idem
à mão             a empresa que nenhuma fonte alcança, com o endereço da
                  página de carreira e de quanto em quanto tempo olhar
```

**As três linhas do LinkedIn são escolha dele, e duas nascem `—`.** Diga a
diferença uma vez — público e grátis · público e pago, centavos por cem vagas ·
logado, que vê as recomendadas e age dentro da conta dele — e escreva só o que
ele escolher. Ligar o navegador não liga a linha `linkedin (logado)`: ligar é
poder, escrever a linha é querer (`04-9-o-perfil.md`). O login, quando ele
quiser, e como desfazê-lo: `references/conectores.md`.

Pergunte **as empresas onde ele gostaria de trabalhar**, e por onde cada uma
publica. Com os conectores ligados, confira o nome com uma chamada de limite
1: vazio ou erro é nome errado. **Quadro que RESPONDE também pode ser o
errado**: o nome no endereço é de quem o registrou primeiro — medido em
2026-09-19, dois nomes curtos de empresa brasileira eram, nos quadros, uma
fábrica de Los Angeles e uma previdência da Bélgica. Leia a cidade e o título
das vagas que voltaram; não bate, a empresa vai para `à mão`. A maior parte
das empresas brasileiras publica na gupy, que se busca por termo. Sem
conectores, escreva a linha e diga que não conferiu. **A empresa que nenhuma
fonte alcança fica na lista**, como tarefa de olhar à mão.

### Passo 7 · Na revisão: o que o arquivo morto ensina

Só quando o perfil já existia. Conte os motivos que se repetem no
`## Arquivo morto` de `vagas/_indice.md`:

```
8 × não vale: exige presença em São Paulo    o corte de regime deixa passar.
                                             Proponha a linha de `## Descarto`
5 × não vale: faixa abaixo do piso           piso não se lê em anúncio sem
                                             faixa — NÃO vira corte. Diga isso
6 × sem resposta, todas em agregador         não é filtro: é onde olhar
```

**Ela propõe; quem muda é ele.** Menos de três repetições não é padrão — diga
que viu, e não proponha nada.

### Passo 8 · Pausar e voltar

Ele pode parar a qualquer momento — “depois a gente continua” — e **nada do
que disse se perde**. Ao parar, e também a cada passo fechado:

- o que ele confirmou vai para o `perfil.md` e a `trajetoria.md` já, pelos
  gabaritos, com o que falta em `## O que eu não sei ainda`
- a conversa vai para `_bruto/AAAA-MM-DD-conversa-perfil.md`, como ele disse,
  com o cabeçalho da seção 4.7 e uma linha `estado: em andamento · falta:
  <os assuntos do passo 1 que não vieram>`

Na volta, diga em uma linha onde parou e siga do próximo assunto — **nunca
pergunte de novo o que está escrito**. Terminada a conversa, a linha vira
`estado: concluída em <hoje>`; o resto do arquivo não se edita.

### Passo 9 · Escrever, e mostrar

Grave `~/busca/trajetoria.md` e `~/busca/perfil.md` pelos gabaritos, e
**mostre os dois inteiros**. Quatro coisas que a régua cobra:

- **todo critério do perfil tem linha em `## Por que`**, com procedência
- **todo número da trajetória tem procedência**, e experiência sem número diz
  que não tem
- **o que ele não soube responder vira `## O que eu não sei ainda`**, escrito
  como pergunta
- **os tetos**: perfil em 80 linhas, trajetória em 200 — corta-se prosa, nunca
  experiência (seção 9)

`o que eu faço:` do `INDICE.md` vazio? Escreva a frase dele, de uma linha — é
o que abre toda mensagem. Preenchida, não se toca.

Fecha com o que vem, na ordem, com o comando de verdade:

```
busca vaga para mim
    /vagas:buscar-vagas percorre o `## Onde olhar`, descarta o que o
    `## Descarto` manda e guarda o resto como `nova`
qual delas vale?
    /vagas:triar-vagas julga cada uma contra o perfil, com o que pesa a favor
    e contra
```

**Ela não reclassifica a busca sozinha.** Vagas que o perfil novo descartaria
não são movidas aqui: ela conta quantas são e diz que quem faz isso é
`/vagas:organizar-busca`, com ele olhando.

## 5 · O que perguntar, e como

**Não há teto de perguntas: esta skill É a conversa.** O que substitui o teto
do contrato é mais estrito que ele: uma pergunta por vez, sempre com o motivo;
a cada três, algo pronto na tela; e ele para quando quiser (passo 8).
Formulário de doze campos numa tela é o que ela nunca faz.

Se houver painel (`references/painel.md`), ele serve a dois momentos e a mais
nenhum: a **confirmação do `## O que NÃO se diz`**, como `formulario` de
`sim-nao` por linha, e a **escolha entre caminhos**, com o custo escrito:

```
A trajetória tem onze experiências, e o teto é 200 linhas. Como fica?

  As seis mais novas inteiras    as cinco antigas viram uma linha cada · pronto agora
  Todas, em quatro linhas cada   cabe, e cada uma perde o detalhe
  Você escolhe quais             eu mostro a lista e você marca
```

A conversa não vai para o painel: pergunta de uma linha se responde onde ele já
está digitando.

**Quando não perguntar:** o fato está no `INDICE.md` (`o que eu faço:`,
`cidade:`), na conversa pausada, ou no arquivo antigo. Aí use, e cite de onde
veio.

## 6 · O formato da saída

Os dois arquivos inteiros na tela, e então o fecho do contrato §10. **A resposta
que termina numa pergunta também fecha** — é o caso mais comum desta skill: a
pergunta vem primeiro, e depois `## Guardei` (o que já foi gravado, ou `- nada
ainda: só gravo o que você confirmar`) e `## Falta saber` (os assuntos que
faltam). Sem o fecho, quem volta amanhã não sabe o que ficou guardado.


## Guardei
- ~/busca/_bruto/2026-09-14-conversa-perfil.md — a conversa, como você disse
- ~/busca/_bruto/2026-09-14-perfil-exportado.md — o PDF do LinkedIn, como veio
- ~/busca/trajetoria.md — criada, 4 experiências e uma pausa, 3 linhas em `## O que NÃO se diz`
- ~/busca/perfil.md — criado, 2 direções em ordem, 4 cortes, 5 linhas em `## Onde olhar`

## Falta saber
- de onde vem o número de pacientes por plantão — sem isso ele não entra em currículo
- se aceita temporário — está em `## O que eu não sei ainda`
- por onde o Hospital Boa Vista publica vaga: ficou "à mão", toda semana

## 7 · Onde ela para

**Ela não busca vaga.** Nem “só para testar os termos”. O que faz com conector
é conferir se um nome de empresa responde, e mais nada.

**Ela não julga vaga nenhuma.** Anúncio colado no meio da conversa: uma linha
dizendo que quem mede é `/vagas:triar-vagas`, e volta à pergunta.

**Ela não escreve currículo.** A trajetória é a fonte; o currículo é de
`/vagas:montar-curriculo`. Nenhuma “primeira versão” no fim — versão que existe
é versão que alguém manda.

**Ela não aposenta nem reclassifica vaga.** Conta e manda para
`/vagas:organizar-busca`.

**Ela não guarda documento nem dado sensível** (seção 3.1), e não escreve a
pretensão fora do `perfil.md`. Autodeclaração só com as palavras dele, e só se
ele quiser.

**Ela não corrige o bruto.** Currículo antigo errado: o certo vai para a
trajetória com `← candidato, <hoje>`, e o bruto fica como veio.
