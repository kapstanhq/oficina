# O painel — a janela do modo copiloto

Isto é OPCIONAL. Sem painel, tudo funciona igual no terminal — e é assim que
funciona na maior parte das ferramentas. Nada aqui acrescenta capacidade: o
painel dá **forma** ao que o contrato já obriga.

**Só existe se o plugin estiver instalado e houver `node` na máquina.** Nos
chats da web não há como rodar um programa, e ali a resposta é o texto de
sempre. Não mencione o painel onde ele não existe.

---

## O que ele é

Um endereço que abre no navegador de quem trabalha com você, servido pela
própria máquina dele. Nada sobe para lugar nenhum.

Ele serve para uma coisa só: **mostrar o que seria uma tabela ou um
formulário rolando no terminal**, e receber de volta o que a pessoa decidiu.

```
o que vai bem no painel          o que fica melhor no terminal
─────────────────────────        ─────────────────────────────
a lista do dia                   uma frase
o funil, por etapa               uma pergunta de sim ou não
a ficha inteira de {um-item}     um aviso curto
o texto antes de sair            a confirmação do que já foi feito
a bifurcação com os custos
o fecho do que foi guardado
```

## O que ele NÃO é

**Ele não escreve na {base}.** Nem um byte. O painel devolve a INTENÇÃO —
“clicou em tal coisa, no item tal” — e quem grava é você, com as regras de
sempre: procedência, histórico, id com apelido, os tetos.

Isso não é detalhe de implementação: se o painel gravasse, a {base} teria
duas fontes de escrita e as regras do contrato valeriam só numa delas.

**Ele não decide nada.** Não escolhe modo, não aprova envio, não muda etapa.

**E ele não substitui a tela do envio.** A seção 7.1 continua valendo inteira:
o nome de quem recebe, o texto inteiro, as três saídas.

---

## As duas ferramentas

```
painel_mostrar    desenha e volta na hora. Devolve o endereço
painel_esperar    bloqueia até a pessoa agir, com teto em segundos
```

Elas andam em par: mostrar sem esperar deixa uma tela que ninguém lê, e
esperar sem mostrar trava por nada.

**Diga o endereço em voz alta**, uma vez, quando abrir: quem está lendo o
terminal não percebe que uma aba nasceu.

## A página inicial, e a terceira ferramenta

```
painel_inicio     { base: "<caminho inteiro da pasta da {base}>" }
                  → { painel: "<endereço>", diga: "..." }
```

O painel tem **casa**: uma página que fica de pé entre uma tarefa e outra, e
mostra o que a {base} já tem — o mapa do `INDICE.md`, a lista do dia, o funil
por etapa, cada arquivo com a procedência de cada campo, o que está conectado.
Ela **lê** a {base} e **não grava nada nela**: o que a pessoa faz ali volta
como intenção, e quem grava continua sendo você.

**Chame `painel_inicio` uma vez, no começo de toda execução que tem a {base}**,
com o caminho que está na linha `{pasta-base}:` do `INDICE.md`. O endereço é
sempre o mesmo naquela máquina — diga-o uma vez, na primeira execução do dia, e
não repita. Sem `painel_inicio`, o painel é só de tarefa, como sempre foi.

A tela de tarefa (`painel_mostrar`) passa a aparecer DENTRO da casa, como "o
agente está esperando você" — e some quando a pessoa responde. Nada muda no
par mostrar/esperar nem no que volta.

**O que pode voltar da casa, sem você ter mostrado nada:**

```
{ acao: "pedir", pedido: "<o que a pessoa escreveu>", sobre: "<arquivo aberto>" }
```

É a pessoa pedindo alguma coisa a partir de um arquivo que está lendo — “prepara
a mensagem para este”. Chega pelo `painel_esperar`, como qualquer intenção.
Trate como trataria a mesma frase dita no terminal.

No `drive` a casa não existe: o painel lê pasta do computador, e só.

## A fila de decisões, e a quarta ferramenta

```
painel_fila       { }                          → { fila: [ … ] }
painel_fila       { gravadas: ["<id>", …] }    → { saiu, resta, fila }
```

O {profissional} **decide quando quiser**, e não só quando você pergunta: na
página inicial, o {andante} que está numa etapa do funil tem dois botões —
passar para a etapa seguinte, e descartar. O clique NÃO grava na {base}: vai
para uma fila do painel, e fica lá até você gravar.

A fila chega de dois jeitos, e nos dois o trabalho é o mesmo:

- `painel_inicio` a devolve em `fila` quando há — é o caso normal, porque toda
  skill o chama ao começar
- o pedido “grave o que eu marquei no painel” chega pelo `painel_esperar`, e aí
  você lê a fila com `painel_fila`

Quem a grava SEM outro trabalho junto é `/{plugin}:gravar-o-que-marquei` — é a
skill que o botão "Gravar agora" do painel chama, porque a do dia lê a {base}
inteira para isso.

## A resposta que chega atrasada

O `painel_esperar` tem teto (15 minutos), e uma pilha grande se julga em mais
que isso. **O que a pessoa responder depois de você parar de esperar NÃO se
perde**: fica guardado no painel, e chega a você por três caminhos —

- `painel_esperar`, na hora, com `tardia: true`, se a tela atual tem o mesmo
  título (você reabriu a mesma pilha)
- `painel_inicio` e `painel_fila`, em `respostas`, com o título da tela e o
  `faca_respostas`; `painel_fila { respostas_lidas: [<em>, …] }` as tira

**Declare o `gesto` nas `decisoes`** de toda `lista` que julga {andantes}:
`etapa:<nome da etapa>` na chave que sobe de etapa, `descartar` na que
aposenta. Marca que chega atrasada com gesto vira entrada da fila de decisões
e é gravada pelo caminho de sempre — por qualquer skill, sem reabrir a
triagem. Chave sem gesto (“depois”) fica na resposta, para você.

```
decisoes: [{ chave: "salvar", rotulo: "Salvar", gesto: "etapa:<etapa seguinte>" },
           { chave: "descartar", rotulo: "Descartar", tom: "recusa", gesto: "descartar" },
           { chave: "depois", rotulo: "Depois" }]
```

**O botão do rodapé também leva gesto** (D262), quando a tela é sobre UM
{andante} e o botão equivale a mudá-lo de etapa:

```
acoes: [{ chave: "enviei", rotulo: "Enviei", tom: "forte",
          item: "<id>", gesto: "etapa:<etapa seguinte>",
          nota: "<o arquivo que você já gravou, e o que trocar nele>" }]
```

Com você esperando, nada muda. Apertado depois — a execução acabou —, vira
decisão da fila, com a `nota`. Por isso, **antes de uma espera longa, grave o
que já é fato**, e deixe como última linha do `## Histórico` o estado em que
parou: a execução pode morrer esperando, e a {base} tem de saber onde.

E **espere mais quando a tela é grande**: `expirou` não é recusa. Se a pessoa
ainda está olhando, chame `painel_esperar` de novo, até três vezes na mesma
tela; só então siga em texto, dizendo que a resposta chega no próximo
`painel_inicio`.

## A lista e o detalhe, sem você

O funil do início abre no **leitor** (`#/funil/<etapa>/<id>`, e `todas` no
lugar da etapa): a lista de uma etapa numa coluna e, ao lado, o arquivo INTEIRO
do que foi escolhido nela, como está — e em cima uma barra com anterior, próxima,
o passo principal, Descartar (com os `motivos` do pack num menu) e "Mais". O
que a pessoa decide ali vai para a fila de decisões e chega a você pelo
caminho de sempre — `painel_inicio` ou `painel_fila`. O descarte pode vir com
`motivo`, tirado da lista `motivos`: grave-o como veio.

Ao lado dos campos em destaque que estão sem resposta, o painel mostra
**Completar informações**: chama `/{plugin}:completar-ficha` com o id. Quando
ela chegar assim, faça o trabalho dela e pare — quem pediu está olhando a ficha.

Quando a pessoa disser "vou revisar a pilha", não abra a pilha você mesmo:
diga o endereço do painel seguido de `#/funil/<etapa>` e espere a fila.

## O arranjo do painel: o molde do pack, e o ajuste que você escreve

O painel é montado de blocos, e o pack traz o MOLDE no `painel.json` dele. A
{base} pode ter o PRÓPRIO `painel.json`, na raiz dela, e o que ele diz vale
por cima do molde. **Quando a pessoa pedir outro arranjo — "põe o funil
primeiro", "tira as ações do início", "mostra o salário em destaque",
"o botão deveria dizer Tenho interesse" —, escreva esse arquivo**, com só as
chaves que mudam:

```
{
  "inicio":   ["funil", "hoje", "novidades", "comeco", "acoes"],
  "destaque": ["regime", "faixa", "encaixe"],
  "resumo":   ["O que pesa contra", "O que pesa a favor"],
  "rotulos":  { "<etapa de destino ou skill>": "texto do botão" },
  "motivos":  ["motivo de descarte de um clique", "…"],
  "proximo":  { "<etapa>": ["marcar", "<skill>", "descartar"] },
  "lancar":   false
}
```

`inicio` é a ordem dos blocos da página inicial (`comeco`, `novidades`,
`numeros`, `hoje`, `funil`, `acoes`), e o que não estiver na lista some
dela. `destaque` são os rótulos de campo como estão no arquivo do
{andante}; `resumo`, títulos de seção; em `rotulos` e `proximo`, as skills
vão pelo nome, sem a barra. `"lancar": false` é para quem não quer que o
painel chame você sozinho ("tira o botão que chama o Claude"): os botões passam
a copiar o pedido. O painel só lê: chave errada é ignorada, e a
página **Conta** diz qual e por quê — confira lá depois de escrever. Para
voltar ao molde, apague a chave (ou o arquivo). Diga em uma linha o que mudou;
a aba se atualiza na próxima volta.

## O próximo passo, e como você o aponta

Na página de {um-andante}, no cartão do início e na linha da tabela, o painel
mostra **o que vem agora**: um botão em destaque e os outros ao lado. A ordem
por etapa é do pack. Mas **você pode apontar o destaque de UM {andante}**, e o
lugar é a linha dele no `funil.md`, que você já escreve:

```
- {exemplo-item} · desde 2026-09-08 · próximo: cobrar-o-que-falta — o documento que ficou de mandar
```

Quando o que vem depois de `próximo:` COMEÇA pelo nome de uma skill do pack —
`cobrar-o-que-falta`, ou `/{plugin}:cobrar-o-que-falta` —, ela vira o destaque daquele
{andante}, e o que vem depois do travessão é a nota que a pessoa lê debaixo do
botão. Sem o nome de skill, a frase é só a nota, e a ordem da etapa continua
valendo. Não invente skill: o nome tem de existir no pack, senão vira nota.

Cada decisão traz `item`, `gesto`, `para`, `de`, `motivo` e a `frase` pronta:

```
{ item: "<id>", gesto: "etapa", de: "<etapa em que está>", para: "<etapa seguinte>",
  frase: "<id> (<apelido>): passar de “…” para “…”" }
{ item: "<id>", gesto: "descartar", de: "<etapa>", motivo: "",
  frase: "<id> (<apelido>): descartar — estava em “…”" }
```

**Trate cada `frase` como dita no terminal, e grave ANTES de qualquer outra
coisa**, pelas regras de sempre: a linha `etapa:`, o `## Histórico`, o
`funil.md`, o `_indice.md` e os contadores do `INDICE.md`. A procedência é
`← {profissional}, no painel, AAAA-MM-DD`. `descartar` é a Regra 3 — aposentar,
com data e motivo; sem `motivo` na fila, o motivo é `descartado no painel`, e
você não pergunta. O fim BOM que o pack declara (o botão próprio da última
etapa) chega igual, como `descartar` com o motivo dele: grave esse motivo, sem
trocar por outro. A decisão que chega com `envelheceu: true` é de um item que
já não está na etapa `de` — mudou depois do clique, e `agora` diz onde ele está.
Não grave: diga em uma linha, e confirme-a mesmo assim; a barra do painel já
avisou o {profissional}.

Depois chame `painel_fila` com `gravadas` — **só os ids que você gravou de
verdade**. O que falhou continua na fila. Diga em uma linha o que gravou, e
siga com o que a skill veio fazer. A página se atualiza sozinha.

## As sete vistas

A vista é um campo de `painel_mostrar`, e o formato de `dados` muda com ela.

```
lista      { grupos: [{ rotulo, itens: [{ id, titulo, linha, marca, acoes }] }] }
           itens soltos: { itens: [...] }, sem grupo

ficha      { campos: [{ rotulo, valor, de, nota }],
             secoes: [{ titulo, linhas: [ "texto" | { texto, de } ] }] }
           `de` é a procedência, e ela aparece na tela
           valor `?` sai marcado, porque é o que a próxima tarefa ataca

texto      { markdown, editavel }
           o bloco que vai ser copiado ou corrigido

escolha    { pergunta, opcoes: [{ chave, rotulo, custo }] }
           de dois a quatro caminhos, cada um com o custo escrito (seção 8)

feedback   { guardei: [ "caminho" | { onde, oque } ],
             faltaSaber: [...], decidiSozinho: [{ oque, porque, desfazer }] }
           é o fecho da seção 10, desenhado

laudo      { errado: [...], duvida: [...], certo: [...] }
           cada item: "texto" ou { texto, onde, conserto }

formulario { campos: [{ chave, rotulo, tipo, valor, opcoes, obrigatorio,
                        de, nota }] }
           o que a PESSOA preenche ou corrige, campo a campo
           tipo: texto · texto-longo · numero · data · sim-nao · escolha ·
                 varias   (`opcoes` vale para os dois últimos)
           `valor` é o que você já sabe, com a procedência em `de`
           valor `?` sai marcado e VAZIO: é o campo que só ela sabe responder
           `comentar: true` abre o comentário daquele campo (veja O que volta)
```

O `formulario` é a sétima vista, e a justificativa que o teto cobra é esta:
revisar o que vai ser respondido em nome da pessoa — campo a campo, antes de
sair — não cabe em `ficha`, que só mostra, nem em `texto`, que é um bloco só.
Ele devolve `campos: { <chave>: <valor> }` com **todos** os campos, mexidos ou
não. Campo `obrigatorio` vazio segura o botão de tom `forte`, e só ele.

`opcoes` é lista de textos ou de `{ chave, rotulo }`, e o que volta é a
`chave`. `numero` volta número, `data` volta `AAAA-MM-DD`, `sim-nao` volta
`true` ou `false`, `varias` volta lista. **Campo que a pessoa deixou em
branco volta vazio — `""` ou `[]` —, nunca `?`**: se o vazio vira `?` na
{base} quem decide é você, pela regra do não apurado.

## Decidir em lote

Doze itens para julgar não são doze telas. A `lista` aceita `decisoes`, e aí
cada item ganha o seu seletor:

```
lista      { decisoes: [{ chave: "salvar", rotulo: "Salvar" },
                        { chave: "descartar", rotulo: "Descartar", tom: "recusa" }],
             modo: "leitor",
             grupos: [...] }
```

De duas a quatro decisões. A pessoa marca o que quiser e aperta o botão do
rodapé; volta `decisoes: { "<id do item>": "<chave>" }`, **só com o que ela
marcou**. Item sem marca não foi julgado — não é recusa, e não se grava como
se fosse. Item sem `id` não ganha seletor.

**Lista e detalhe.** Com duas ou mais decisões, a pessoa troca entre "Lista
compacta" e "Lista e detalhe": a lista numa coluna, o item aberto ao lado, e
as decisões numa barra em cima dele — a primeira que não é recusa em
destaque, a de `tom: "recusa"` ao lado, o resto em "Mais". Marcou, anda para
o próximo. As marcas são as mesmas nos dois modos, e o que volta não muda.
`modo: "leitor"` abre direto nele (`um_por_vez: true` ainda vale): use
quando cada item pede LEITURA para decidir (uma triagem), e deixe a lista
compacta quando a `linha` basta. Com a {base} aberta, o item cujo `id` tem
arquivo mostra o arquivo inteiro — você não precisa repetir no `detalhe` o
que já está nele.

## Mais de um bloco na mesma tela

Quando a decisão depende de ver duas coisas juntas — a ficha e o formulário,
a lista e o texto —, mande `blocos` no lugar de `vista` e `dados`:

```
blocos: [{ id: "vaga",      vista: "ficha",      titulo: "...", dados: {...} },
         { id: "respostas", vista: "formulario", titulo: "...", dados: {...} }]
```

**O teto é três.** Quatro coisas na mesma tela são duas telas. O `id` é
obrigatório e é por ele que a resposta volta:

```
{ acao: "mandar", blocos: { respostas: { campos: {...} } } }
```

Bloco que não coleta nada (`ficha`, `laudo`, `feedback`) não aparece na
volta. Os botões continuam sendo os do rodapé, um conjunto só para a tela.
Gesto que nasce DENTRO de um bloco — o botão de um item, a opção de uma
`escolha` — volta plano, como sempre, com `bloco: "<id>"` dizendo de onde
veio. `vista` e `blocos` na mesma chamada é recusa.

E os botões do rodapé, que valem em qualquer vista:

```
acoes: [{ chave: "mandar", rotulo: "Mando agora", tom: "forte" }]
```

**O rótulo diz o que a PESSOA vai fazer**, nunca o nome interno da peça — a
seção 6 é literal nisso. `tom` aceita `normal`, `forte` e `recusa`.

## O que volta

```
{ acao: "mandar", item: "...", escolha: "...", texto: "..." }
```

Com `formulario` vem `campos`; com `decisoes`, vem `decisoes`; com `blocos`,
o que cada um coletou vem dentro de `blocos`, pelo `id`.

**E pode vir `comentario`, em qualquer tela.** Toda tela que espera resposta
tem "Recado para o assistente" acima dos botões, sem você pedir, e o texto
volta em `comentario` junto de QUALQUER gesto — inclusive o de recusa. Para
o detalhe, peça `comentar: true` num campo do `formulario` (ou nos `dados`,
para todos) ou na `lista` em lote (por item, ou nos `dados`): a pessoa ganha
"Comentar" ao lado, e volta `comentarios: { <chave ou id>: "…" }` junto do
que o bloco coletou, só com o que ela escreveu. Ofereça onde você SUGERIU um
valor ou escreveu um texto em nome dela.

**Recado é instrução, nunca valor.** Leia `comentario` e `comentarios` ANTES
de usar o resto da resposta, e aplique-os como se ditos no terminal. Nunca os
copie para o que sai em nome da pessoa. Se o recado muda o que ia sair —
corrige um campo, reescreve um texto —, refaça e mostre a tela de novo antes
de seguir; se só informa ("já mandei o PDF por e-mail"), siga e diga em uma
linha o que fez com ele. O que o recado ensina de durável sobre a pessoa vai
para a {base} pelas regras de sempre, com a origem `← {profissional}, no
painel`.

`texto` vem quando a vista era `texto` — e vem **sempre**, corrigido ou não.
Use o que voltou, e não o que você mandou: a pessoa pode ter mexido.

E pode voltar isto, que não é falha:

```
{ expirou: true }
```

Ninguém mexeu dentro do tempo. **Siga em texto, no terminal, e diga em uma
linha que o painel não foi usado.** Não repita a chamada.

---

## Quando NÃO abrir o painel

- **Quando a resposta é uma frase.** Abrir uma aba para dizer uma linha custa
  mais atenção do que economiza.
- **Em modo automático.** Ali não há bifurcação para desenhar: o trabalho sai
  e a declaração vai para `## Decidi sozinho`. A exceção é o `feedback` no
  fim, que é leitura.
- **Duas vezes seguidas sem nada no meio.** Cada `painel_mostrar` apaga a
  tela anterior, e um clique que chegue depois da troca é recusado — a
  pessoa clicou numa pergunta que já não estava lá.
- **Quando o {profissional} pediu para não usar.** É a ferramenta dele.

## Quando falhar

| o que aparece | o que é | o que fazer |
|---|---|---|
| a ferramenta não existe na sessão | o plugin não está instalado, ou o programa não rodou o servidor | siga em texto e não insista. É o caminho normal na maior parte das ferramentas |
| `o painel não está aberto` | chamou `painel_esperar` sem ter mostrado nada | chame `painel_mostrar` antes |
| `vista desconhecida` | o nome da vista está errado | as que existem são as sete acima |
| `{ expirou: true }` | ninguém mexeu | siga em texto e diga isso em uma linha |
| a pessoa diz que abriu e está em branco | o endereço foi copiado sem o que vem depois do `#` | mande o endereço inteiro de novo — aquela parte é a chave |
| a pessoa diz que clicou e nada aconteceu | a tela mudou entre o clique e o envio | mostre de novo e peça para repetir |

**Falhou e você não sabe por quê?** Diga o que aconteceu, faça o trabalho no
terminal e siga. O painel é conveniência; o trabalho é o mesmo dos dois
jeitos, e nenhum passo do contrato depende dele.
