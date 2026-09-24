---
name: montar-curriculo
description: >-
  Escreve o currículo — o base ou o de UMA vaga — a partir da `trajetoria.md`,
  e só dela: adaptar é escolher, ordenar e dizer com as palavras da vaga o que
  é verdade, nunca acrescentar. Número, cargo, data e nome próprio saem IGUAIS
  aos da trajetória; o que a vaga pede e o candidato não tem não aparece
  disfarçado, vira linha em `## Falta saber`. Lê `## O que NÃO se diz` antes de
  escrever. Sai em duas páginas, uma coluna, sem foto nem documento. Grava em
  `curriculos/`. Use quando o candidato disser "monta meu currículo", "faz o
  CV para essa vaga", "adapta o currículo", "atualiza meu currículo", "preciso
  do currículo em inglês", "o currículo está grande demais", "o que eu ponho
  no resumo", "escreve a carta de apresentação". No currículo de vaga, escreve
  também a carta, se o formulário tem o campo e há prova: sob medida ou
  nenhuma. Não é ela que escreve a trajetória (/vagas:perfil-de-busca), nem
  que julga se a vaga vale (/vagas:triar-vagas), nem que responde formulário
  e prepara o envio (/vagas:candidatar).
license: MIT
compatibility: >-
  Precisa da busca, com a `trajetoria.md`: sem ela a skill não inventa — manda
  para /vagas:perfil-de-busca, ou trabalha com a trajetória COLADA na conversa
  e não grava nada. Aí some a conferência linha a linha, e ela diz isso. O
  painel é opcional: com ele o currículo aparece inteiro e se corrige ali; sem
  ele, sai em texto. Entrega o markdown e, com o servidor de documentos e um
  Chrome ou Edge na máquina, o PDF pelo modelo do pack; .docx não.
allowed-tools: Read Glob Grep Write Edit
---

# Montar o currículo

## 1 · O que ela faz, e o que ela não faz

Ela escreve **um** currículo: o base, sem vaga em vista, ou o de **uma** vaga.
Os dois são vista derivada da `trajetoria.md` — o arquivo dono do que se pode
afirmar sobre o candidato — e a skill inteira cabe nas três regras do contrato
§12:

```
1  nada entra que não esteja na trajetoria.md. Adaptar é ESCOLHER e ORDENAR
   o que é verdade, e dizer com as palavras da vaga — nunca acrescentar
2  número, cargo, data e nome próprio saem IGUAIS aos da trajetória
3  o que a vaga pede e ele não tem NÃO aparece disfarçado: vai para
   `## Falta saber`, na conversa com ele
```

**A recusa é o produto tanto quanto o texto.** Currículo que “fica melhor” com
um número arredondado para cima, um curso que vira concluído ou um “inglês
avançado” que a vaga exigia é o currículo que cai na checagem de referência —
e quem perde a vaga na última etapa perdeu também as seis semanas de processo.
A skill escreve o que é verdade do jeito mais forte que ele pode ser dito, e
para aí.

**Ela nunca escreve a trajetória.** Fato novo — “esqueci de dizer que liderei
o time de dados” — não entra direto no currículo: entra na `trajetoria.md`, por
`/vagas:perfil-de-busca`, e chega a todos os currículos de uma vez. Currículo
corrigido à mão perde a correção na próxima geração.

## 2 · Antes de tudo

1. lê `~/busca/INDICE.md` — `references/contrato/10-0-comeca-e-termina.md` diz
   como começar. Não existe: uma linha e `/vagas:comecar`
2. lê a linha `modo:` e o `## Quem sou`, que é de onde sai o cabeçalho.
   **Faltou nome, cidade, e-mail ou telefone?** Uma pergunta só, pelos que
   faltam — “o cabeçalho leva cidade e telefone, e não tenho os dois” —, e a
   resposta vai para a linha dela no `## Quem sou`, para nenhuma skill
   perguntar de novo. Perfil profissional e portfólio vazios não se
   perguntam: o cabeçalho sai sem eles
3. **lê `~/busca/trajetoria.md` inteira, e `## O que NÃO se diz` primeiro.**
   Não existe: **não escreva currículo nenhum a partir do que ele disser de
   passagem.** Uma linha — “sem a trajetória eu não tenho de onde tirar o
   currículo, e é ela que impede ele de dizer o que você não fez” — e
   `/vagas:perfil-de-busca`. A exceção é ele COLAR a trajetória na conversa: aí
   trabalhe com o colado, não grave, e diga as duas coisas (passo 7)
4. currículo de vaga: lê o arquivo dela em `vagas/` — `## O que a vaga pede` é
   o que decide a ordem. A vaga não está na busca: peça o anúncio colado, ou
   `/vagas:buscar-vagas` e `/vagas:triar-vagas` antes. Vaga com `estado:
   fechou`: diga, e pergunte se ainda quer o currículo
5. lê `curriculos/` — já existe o `CV-base.md`? e o desta vaga? Se existir,
   isto é reescrita, e o passo 6 diz o que mostrar

O formato da trajetória e as três regras estão em
`references/contrato/12-0-a-trajetoria-e-o-curriculo.md`, o da vaga em
`references/contrato/04-4-arquivo-de-vaga.md`, o que é dele e o que nunca
entra em `references/contrato/03-1-o-que-e-seu.md`, o teto em
`references/contrato/09-0-os-tetos.md`, e os gabaritos vazios em
`references/modelos/curriculo.md` e `references/modelos/carta.md`.

## 3 · O modo

`copiloto` — para nas bifurcações: qual das duas experiências abre a lista
quando as duas servem à vaga, o que sai quando estoura as duas páginas, se a
versão em inglês é mesmo necessária.

`automatico` — escolhe e declara em `## Decidi sozinho` (contrato §5): a ordem,
o que cortou para caber, com como desfazer. **O que não muda com o modo são as
três regras.** Automático decide a forma; nenhum modo autoriza um fato que a
trajetória não tem.

## 4 · O passo a passo

### Passo 1 · Qual currículo é este

```
sem vaga em vista     curriculos/CV-base.md — a trajetória inteira, na ordem
                      do `perfil.md` (`## O que procuro, em ordem`)
para uma vaga         curriculos/V-012-cv.md — o id da vaga, e só ele, no
                      nome. Parte do CV-base se ele existir; se não, da
                      trajetória direto. Não é preciso ter o base antes
```

Um currículo por vaga, e não um por “tipo de vaga”: o arquivo com o id é o que
`/vagas:candidatar` registra em `## Candidatura`, e é o que ele relê na véspera
da entrevista para saber o que aquela empresa leu.

### Passo 2 · O que a vaga pede, virado lista

De `## O que a vaga pede`, separe em três pilhas — e mostre as três a ele, em
copiloto, antes de escrever:

```
ele tem, e a trajetória prova      com a linha da trajetória ao lado. É o que
                                   sobe para o resumo e abre as experiências

ele tem, e a trajetória não diz    ele contou de passagem, ou é provável pelo
                                   cargo. NÃO entra. Vira pergunta: “a vaga
                                   pede X; você fez? Se fez, entra na
                                   trajetória primeiro”

ele não tem                        não entra, não se disfarça, e vai para
                                   `## Falta saber` com a frase inteira: “a
                                   vaga pede inglês avançado e a trajetória
                                   diz intermediário — o currículo diz
                                   intermediário”
```

A terceira pilha não é defeito do currículo: é informação para a decisão dele.
Se ela for grande, diga em uma linha que o encaixe pode estar pior do que o
`encaixe:` do arquivo diz, e que quem revê isso é `/vagas:triar-vagas`.

### Passo 3 · A forma, que é normativa

É a forma que um recrutador no Brasil espera em 2026 e que os sistemas de
triagem leem sem quebrar. Nenhum item abaixo é gosto:

```
tamanho        duas páginas — umas 90 linhas de markdown. Uma, se a
               trajetória tem menos de cinco anos
página         UMA coluna. Sem tabela, sem caixa de texto, sem ícone, sem
               barra de “nível” — é o que o sistema de triagem embaralha ou
               pula, e o candidato nunca fica sabendo
títulos        os convencionais, nesta ordem: Resumo · Experiência ·
               Formação · Idiomas · Ferramentas e métodos. Título criativo é
               seção que o sistema não acha
cabeçalho      nome · cidade/UF · e-mail · telefone · perfil profissional ·
               portfólio — do `## Quem sou` do INDICE.md, como está lá. Linha
               vazia não vira campo inventado nem “a combinar”: sai do cabeçalho
               SEM foto, idade, estado civil, endereço, CPF, RG ou qualquer
               documento — contrato §3.1, e o padrão atual já não os pede
resumo         duas ou três frases: o papel, os anos e o fio da carreira
               para ESTA vaga. Ele POSICIONA; quem prova é a linha da
               experiência — número, contagem e lista técnica ficam lá, e
               nada do que a linha diz sobe para o resumo, nem com outras
               palavras (D275). Sem adjetivo sobre si — “dinâmico”,
               “apaixonado”, “orientado a resultado” não dizem nada
experiência    da mais nova para a mais antiga. Cada uma:
                 empresa · cargo · mês/ano a mês/ano — IGUAIS à trajetória
                 de três a cinco linhas, cada linha abrindo pelo RESULTADO
                 com o número, e depois o como
               experiência antiga que a vaga não pede encolhe para uma linha
formação       curso, instituição, anos — e a situação IGUAL à trajetória.
               “cursado, não concluído” sai escrito assim
idiomas        o nível IGUAL ao da trajetória, palavra por palavra
ferramentas    só as da trajetória; as que a vaga cita vêm primeiro
```

**As palavras da vaga, espelhadas só onde são verdade.** Se a vaga diz
“descoberta contínua” e a trajetória diz “entrevistas semanais com usuário”, o
currículo pode dizer “descoberta contínua, com entrevistas semanais” — é o
mesmo fato, na língua de quem vai ler. Se a vaga diz “gestão de P&L” e a
trajetória não tem isso, a expressão **não aparece em lugar nenhum**, nem no
resumo, nem numa lista de “competências”. Lista de palavras-chave solta no fim
é a forma mais comum de currículo afirmar o que não fez.

**A linha de resultado, e o que fazer sem número.** `número que NÃO tenho:` na
trajetória é ordem: aquela experiência sai sem número, com o fato — “pôs em
produção o primeiro fluxo de atendimento com IA da empresa” —, e nunca com
“reduziu significativamente”. Advérbio no lugar de número é número inventado
com vergonha.

### Passo 4 · A regra 2, conferida caractere a caractere

É onde o arredondamento vira mentira, e por isso se confere, não se confia:

```
31 mil lojistas             não vira “mais de 30 mil”, nem “cerca de 30 mil”
2022-03 a 2026-06           vira “mar/2022 a jun/2026” — o formato muda, a
                            data não. Nunca “2022 a 2026” se esconde um buraco
gerente de produto          não vira “head”, “líder” nem “product lead” porque
                            a vaga usa essa palavra
um time de nove             não vira “time multidisciplinar de dez pessoas”
contrato por consultoria    se `## O que NÃO se diz` manda dizer assim, o
                            currículo diz assim
```

### Passo 5 · A conferência, antes de mostrar

**Cada linha do currículo aponta para uma linha da trajetória.** Faça a
passada de verdade — linha a linha, do resumo às ferramentas — e separe:

```
bate                  segue
bate com outra        número, data, cargo ou nome escrito diferente: corrija
escrita               para o da trajetória, sem perguntar
não acha de onde      TIRE a linha, e ela vira uma linha em `## Falta saber`:
veio                  “tirei ‘experiência com meios de pagamento
                      internacionais’: não está na trajetória”
esbarra em            TIRE, e diga qual linha da lista ela contrariava
`## O que NÃO se diz`
```

Currículo que não passou por esta passada não se mostra. É a régua que a skill
aplica a si mesma, e o resultado dela é visível: o que saiu, e por quê.

### Passo 6 · Mostrar, corrigir, e usar o que voltou

**Se houver painel, é aqui que ele vale.** Mostre o currículo na vista `texto`,
com `editavel` ligado — o formato está em `references/painel.md` —, e as ações
com o rótulo do que ELE faz:

```
Está bom, guarda       grava o que está na tela
Mudo o texto           ele diz o que trocar, e nada é gravado agora
Não agora              nada é gravado
```

**Use o `texto` que voltou, e não o que você mandou** — ele pode ter mexido. E
o que ele mexeu passa pela conferência do passo 5 de novo, só nas linhas
mudadas: se ele escreveu à mão um número que a trajetória não tem, **não
grave em silêncio nem recuse em silêncio**. Diga a linha, e ofereça os dois
caminhos com o custo: o fato entra na trajetória primeiro
(`/vagas:perfil-de-busca`, dois minutos, e vale para todos os currículos), ou a
linha sai deste.

Sem painel, ou se ele expirar: o currículo inteiro em cerca de código no
terminal, e as mesmas três saídas em texto.

**Reescrita de currículo que já existia:** mostre o que mudou em relação ao
arquivo anterior — as linhas que entraram, as que saíram —, e não só o novo.
Se o anterior já foi usado numa candidatura (`## Candidatura` da vaga o cita),
**não sobrescreva**: aquele arquivo é o registro do que a empresa leu. Grave o
novo como `V-012-cv-2.md` e diga por quê.

### Passo 7 · Gravar

`curriculos/CV-base.md` ou `curriculos/V-012-cv.md`, pelo gabarito de
`modelos/curriculo.md`, sem os comentários do modelo e sem nenhum `<…>` de pé.
A primeira linha do arquivo, em comentário, diz de onde ele saiu —
`<!-- derivado de trajetoria.md, atualizada em 2026-09-14 · para V-012 -->` —,
que é o que deixa `/vagas:laudo-da-busca` saber que o currículo envelheceu
quando a trajetória mudar.

Currículo de vaga: uma linha no `## Histórico` do arquivo da vaga —
`- 2026-09-14 currículo montado: curriculos/V-012-cv.md` — e `atualizada` em
`vagas/_indice.md`. **Não muda `etapa:`**: currículo pronto não é candidatura.

**Trabalhou com a trajetória colada, sem busca:** nada é gravado, a conferência
do passo 5 foi feita só contra o que ele colou, e o `## Guardei` diz as duas
coisas.

**O PDF sai do markdown gravado, pelo modelo `curriculo` (D270).** Chame
`documento_modelos` antes de prometer o PDF, e então `documento_gerar` com a
busca, a origem (`curriculos/V-012-cv.md`) e `modelo: "curriculo"`: ela grava
`curriculos/V-012-cv.pdf` ao lado e volta com as páginas. `cabe: false` quer
dizer que passou de duas: corte NO MARKDOWN (a regra do passo 3 diz o que sai
primeiro), grave e gere de novo — nunca mexa no PDF, que é derivado. O
`## Guardei` ganha a linha do PDF com as páginas. **O PDF sai sempre por
ela**, nunca de editor nenhum: é o modelo que garante a forma do passo 3.

```
sem `documento_gerar`     o servidor de documentos do pack não subiu: `/mcp`
na sessão                 mostra “documentos” — desconectado, “Reconnect”; sem
                          Node na máquina ele não sobe. Diga isso em uma linha
`documento_modelos` diz   falta Chrome, Edge ou Chromium, que é o que imprime.
navegador: não            Instalado um deles, é gerar de novo
```

Nos dois casos o markdown está gravado e conferido, e o PDF vira uma linha em
`## Falta saber`, com o que falta para ele sair. `.docx` não é desta skill.

### Passo 8 · A versão em inglês

**Só se a vaga pedir** — anúncio em inglês, ou `## O que a vaga pede` dizendo
que o currículo vai em inglês. É o mesmo currículo, traduzido, em
`curriculos/V-012-cv-en.md`, e o PDF sai com `idioma: "en"`.

**Tudo em inglês** (D255): títulos das seções, cargos, cursos, datas (`Apr 2026
– present`), cidade. O cargo vira o equivalente de mercado — “Desenvolvedor de
software pleno” é `Mid-level Software Developer`, “Head de marketing de
produto” é `Head of Product Marketing` —, nunca o original com a tradução ao
lado: meio português num currículo em inglês é o que o recrutador lê como
descuido. A regra 2 continua valendo sobre o FATO, não sobre a língua: nível,
período e escopo do cargo não sobem na tradução (pleno é `Mid-level`, não
`Senior`). Ficam como são só os nomes próprios — empresa, instituição,
produto — e o título oficial de certificação.

**O nível de inglês continua o da trajetória** (“Intermediate”, se é
intermediário — um currículo em inglês impecável com “Intermediate” escrito é
honesto; com “Fluent” escrito é a primeira pergunta da entrevista). Diga em uma
linha que a tradução é sua, e que vale ele ler em voz alta antes de mandar.

### Passo 9 · A carta de apresentação

**Só em currículo de vaga, e só se as duas coisas forem verdade** (contrato
§12, D273):

```
o campo existe      o formulário da vaga tem "carta de apresentação" / "cover
                    letter", obrigatório ou opcional — o _bruto/ do formulário,
                    a ficha, ou ele disse. Não sabe: uma linha em
                    `## Falta saber`, e a carta não se escreve
há prova            pelo menos UMA linha da pilha "ele tem" do passo 2 com
                    número, que responde a um requisito escrito no anúncio
```

Faltou uma: diga em uma linha por que não há carta — "a vaga não tem o campo"
ou "não achei prova que responda ao que o anúncio pede: carta sem ela é a
genérica" — e pare aqui. **A genérica não se escreve**, nem a pedido: rende um
terço da sob medida e é a que parece feita por máquina. Se ele insistir, a
resposta é o que falta para ela deixar de ser genérica.

**Os três parágrafos** do contrato §12, pelo gabarito de `references/modelos/carta.md`,
corpo de 900 a 1.500 caracteres — meia página (D275):

```
1  a vaga, com o nome do anúncio, e a tese numa frase
2  um fato da organização que não serviria a outra — do anúncio, da página
   dela, de notícia com fonte — e o que ele faria com ele. Procure: o que
   a organização publicou sobre o produto ou a área da vaga vale mais que
   o anúncio. Achou na web: grave num _bruto/, com a URL. Não há fato: a
   carta fica com dois parágrafos
3  UMA prova da pilha "ele tem", com o número IGUAL ao da trajetória, dizendo
   o requisito a que responde; o convite para conversar sobre o que ele
   aprendeu e o que interessa a ela — sem link (está no cabeçalho) e sem o
   projeto dele como vitrine (contrato §12)
```

**Não reconte o currículo**: ele vai junto. O nome do projeto entra; a lista
técnica dele — ferramentas, testes, contagens — não. Releia a carta ao lado do
currículo: frase que já está lá sai, ou diz o que significa para ESTA vaga.

**O arquivo é a versão final**: nenhum comentário no corpo, só a primeira
linha. A conferência do passo 5 passa pela carta do mesmo jeito, mas a origem
de cada afirmação vai na tela do painel — o `de` de cada linha do bloco que
a acompanha —, e não no texto que ele lê e edita.

**O tom**: primeira pessoa, direto, no idioma da vaga. "Prezada equipe de
<área> da <organização>," e "Atenciosamente,". Sem adjetivo sobre ele, sem
"venho por meio desta", sem repetir o currículo em prosa, sem elogio que não
saia de um fato, sem pretensão (salvo o anúncio pedir).

**Mostrar e gravar**: como o currículo, no passo 6 — e a carta nasce
`rascunho`, na primeira linha
(`<!-- rascunho · derivado de trajetoria.md, atualizada em … · para V-012 … -->`).
Ele leu e disse que vale — "Está boa, guarda" no painel conta —: a linha vira
`aprovada em AAAA-MM-DD`. Grava em `cartas/V-012-carta.md` (a pasta nasce, e a
linha dela entra no `## Onde está o quê` do INDICE.md se faltar), gera o PDF
com `documento_gerar` e `modelo: "carta"` — `cabe: false` é corte NO
MARKDOWN, e o parágrafo 2 é o primeiro a encurtar —, e uma linha no
`## Histórico` da vaga: `- AAAA-MM-DD carta escrita (rascunho): cartas/V-012-carta.md`.

## 5 · O que perguntar, e como

No máximo três perguntas por execução (contrato §8), e as que mais valem:

- **“a vaga pede X; você fez?”** — uma vez, para o que está na segunda pilha do
  passo 2, com o custo na frase: “se fez, entra na trajetória primeiro, e aí
  vale para todo currículo”
- **qual experiência abre**, quando duas servem à vaga por razões diferentes —
  com o que cada ordem faz o leitor pensar nos primeiros dez segundos
- **o que sai**, quando estoura as duas páginas e o corte não é óbvio

**A resposta dele não morre aqui** (contrato §12, D261): o que ele disse de si
— o texto, e na múltipla escolha o que marcou E o que não marcou — vai para
`_bruto/AAAA-MM-DD-painel-<vaga>.md` no mesmo turno, com `estado: ainda NÃO
entrou na trajetoria.md`, e o `## Guardei` o lista. Marcar "escrevo o PRD"
numa lista de opções e ver a marca sumir com a execução é ter de dizer de novo
na próxima vaga.

**Quando não perguntar:** a ordem está no `perfil.md`, o corte é a experiência
mais antiga que a vaga não pede (contrato §9), o cabeçalho está no `INDICE.md`.
Escrever e mostrar bate perguntar como escrever.

## 6 · O formato da saída

As três pilhas do passo 2 (em currículo de vaga), o currículo inteiro, o que a
conferência tirou, e o fecho do contrato §10:

## Guardei
- ~/busca/curriculos/V-012-cv.md — criado, 84 linhas, derivado da trajetória de 2026-09-14
- ~/busca/curriculos/V-012-cv.pdf — gerado pelo modelo `curriculo`, 2 páginas
- ~/busca/cartas/V-012-carta.md — rascunho, 2.140 caracteres no corpo, e o PDF de 1 página
- ~/busca/vagas/V-012-lumina-pagamentos.md — uma linha no `## Histórico`
- ~/busca/vagas/_indice.md — `atualizada`

## Falta saber
- a V-012 (PM de IA, Lumina Pagamentos) pede experiência com meios de pagamento
  internacionais, e a trajetória não tem — o currículo não diz
- tirei “reduziu o custo de atendimento”: a trajetória diz que esse número não
  foi medido

E quando nada foi gravado, o `## Guardei` diz isso, com o motivo — `- nada foi
gravado — você não aprovou o texto` ou `- nada foi gravado — você está sem
busca aqui`.

## 7 · Onde ela para

**Ela não acrescenta fato.** Nem a pedido, nem “só para esta vaga”, nem com a
promessa de que ele explica na entrevista. Se ele insistir, ela diz uma vez o
caminho — o fato entra na `trajetoria.md`, com a procedência `← candidato,
<data>`, e aí entra no currículo — e continua não acrescentando por fora. A
trajetória é dele, e o que ele afirma lá é responsabilidade dele; o que a skill
não faz é ser o lugar onde a afirmação aparece sem ter passado por lá.

**Ela não mexe na `trajetoria.md`.** Quem escreve e corrige a trajetória é
`/vagas:perfil-de-busca`. Divergiu currículo e trajetória: a trajetória vence.

**Ela não julga a vaga.** Pilha grande de “ele não tem” é informação, e quem
revê o encaixe é `/vagas:triar-vagas`.

**Ela não responde formulário e não prepara envio.** Isso é
`/vagas:candidatar`, que lê o currículo e a carta que esta aqui gravou — e só
leva a carta `aprovada`.

**Ela não põe dado sensível no currículo** — foto, idade, estado civil,
endereço, documento —, nem quando o portal tem o campo. Contrato §3.1.

**Ela não edita o PDF, não manda exportar de editor e não entrega `.docx`**, e não promete que um sistema de
triagem específico vai ler o arquivo de um jeito ou de outro. O que ela
garante é a forma que não quebra — uma coluna, títulos convencionais, texto
que se seleciona, fonte embutida —, e o PDF sempre refeito do markdown.

**Ela não faz dez currículos de uma vez.** Um por execução. Currículo em lote é
currículo que ninguém leu, e o teto de candidaturas por dia do `INDICE.md`
existe pela mesma razão.
