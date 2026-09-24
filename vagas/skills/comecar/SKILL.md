---
name: comecar
description: >-
  A primeira skill do pack, a que todas as outras pressupõem: monta a busca
  do candidato do zero, no computador ou no Google Drive — as pastas, os
  arquivos do padrão, o nome dele e o modo —, um passo por vez, todo passo
  pulável, e retoma de onde parou se ele fechar no meio.
  Pergunta como encontrá-lo — cidade, e-mail, telefone, LinkedIn e portfólio, o cabeçalho de todo currículo — e passa a vez à conversa de /vagas:perfil-de-busca, que diz que vaga procurar; depois vêm /vagas:buscar-vagas e /vagas:triar-vagas. Google, WhatsApp e LinkedIn com login não entram no começo: cada um é oferecido no dia em que uma skill precisar, com o caminho de ligar e o de desligar.
  Use na primeira vez, e quando ele disser “instalei, e agora”, “como eu
  começo”, “configura isso pra mim”, “não tenho busca nenhuma”, “parei no
  meio da configuração”, “mudei de computador” — e sempre que outra skill
  disser que não achou o INDICE.md da busca.
license: MIT
compatibility: >-
  Precisa de um lugar para montar a busca: uma pasta do computador, com
  ferramenta de arquivo, ou o Google Drive pelo conector. Sem nenhum dos dois —
  chat na web — ela não funciona, e diz isso em uma linha. Os conectores são
  opcionais; o que não se ligar fica anotado.
allowed-tools: Read Glob Grep Write Edit
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/comecar/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# Começar

## 1 · O que ela faz, e o que ela não faz

Ela monta a busca no lugar que ele escolher no passo 1 — uma pasta no
computador ou a pasta `busca` no Google Drive — com os arquivos do
padrão, o nome dele e o modo.
E pergunta como encontrá-lo — o que o currículo e o formulário de candidatura
pedem primeiro. **Ela não liga Google, WhatsApp nem LinkedIn**: cada um é
oferecido pela skill que precisar dele, no dia. Montada a busca, ela passa a
vez à conversa de `/vagas:perfil-de-busca`, que é o que diz que vaga procurar.

**Ela não pede argumento.** Rodar sem nada é o normal: ela pergunta o que
precisa, um passo por vez. Com a busca já montada, ou com “continuar”, é
retomada — seção 4.

Ela **executa o que dá e só pede o que só ele pode fazer.** Criar pasta, copiar
modelo, ler link, extrair fato de uma conversa colada: é com ela. Autorizar uma
conta no navegador, com a conta dele: é com ele — ela explica os passos com o
nome de cada botão e **espera**.

Ela não escreve currículo, não escreve mensagem para contato nenhum,
não lê candidatura, não instala nada e não mexe em configuração do Claude
Code. E **nenhum passo dela pede senha**: autorização acontece na tela do
serviço, no navegador dele, e ela não vê nada disso.

**Por que ela tem `Write` e `Edit`.** É a skill que cria a busca: os arquivos
novos a partir de `references/modelos/` (`Write`) e as linhas que ela preenche
depois — `## Quem sou`, `## Quanto tem`, `## O que está conectado`, as vistas
(`Edit`). **`Write` só em arquivo que não existe.** Sobrescrever é o único
jeito de esta skill fazer estrago, e o estrago seria a busca inteira.

No `drive` os verbos são os mesmos e as ferramentas são as do conector, pela
tabela de equivalência do contrato §1. Uma diferença muda o que ela faz:
**atualizar reescreve o arquivo inteiro**, então leia antes de atualizar,
sempre — e devolva o texto inteiro com a sua mudança dentro.

---

## 2 · Antes de tudo

Leia, nesta ordem:

1. **O contrato, por seção** — o inteiro custa vinte a trinta mil tokens antes
   da primeira pergunta. Em `references/contrato/`: `01-0-onde-a-busca-mora.md`
   (os dois transportes), `02-0-id-e-apelido.md`, `03-0-as-tres-regras.md`
   (procedência é a que mais aparece aqui), `04-0-os-formatos.md` e os que o
   seguem, de `04-1-indice.md` a `04-7-o-bruto.md` (os gabaritos, e o que
   fazer com os comentários dos modelos), `05-0-os-dois-modos.md`,
   `07-0-a-conversa-entra.md`, `07-1-a-mensagem-sai.md`,
   `08-0-quando-perguntar.md` e `10-0-comeca-e-termina.md`. Divergiu, o
   contrato vence.

2. **`references/modelos/`** — o que vai para a busca é o que está neles, sem
   invenção.

3. **O `INDICE.md` da busca, se já existir.** Primeira leitura do contrato §1:
   procure no computador, e depois a pasta `busca` no Drive. **Achou? Ela
   não sobrescreve nada:** é retomada (seção 4). Achou nos dois lugares: mostre
   as duas, com o lugar de cada uma, e pergunte qual fica — **não funde**.

**No `local`, a pasta pessoal.** O harness diz o diretório de trabalho e o
sistema; dele sai o começo do caminho — `C:\Users\<nome>` no Windows,
`/Users/<nome>` no Mac, `/home/<nome>` no Linux. **Toda chamada de ferramenta
usa caminho absoluto.** Ao falar com ele, escreva `~/busca/…`.

**No `drive` não existe caminho.** Pasta é um item com id, e `/busca` é
o nome da pasta na raiz do Drive dele. Guarde o id de cada pasta que criar ou
abrir, e **prenda toda busca à pasta** — `_indice.md` existe duas vezes, e o
nome solto devolve os dois. Ao falar com ele: “a pasta `busca` do seu
Drive”. Neste arquivo, `~/busca/…` é o modo curto de nomear o lugar,
qualquer que seja o transporte.

---

## 3 · O TODO, na tela desde o primeiro passo

Mostre o TODO **antes da primeira pergunta**. Ele mostra que a configuração
acaba, e onde ela está enquanto demora — demorar sem mostrar é onde o leigo
acha que travou.

```
1  onde fica a busca, e o seu nome
2  como te encontram        cidade, e-mail, telefone, LinkedIn
3  o que você procura       /vagas:perfil-de-busca
4  as primeiras vagas       /vagas:buscar-vagas
5  qual delas vale          /vagas:triar-vagas
```

Os passos 3 a 5 são de outras skills; esta faz o 1 e o 2 e passa a vez.

**Grave ao fim de cada passo, não no fim de tudo.** O que está gravado é o que
sobrevive a ele fechar a janela — e é o que a retomada vai ler.

---

## 4 · Retomar: onde está escrito até onde foi

Nenhum campo guarda o progresso: **ele é derivável do que está gravado**
(regra 1), e um `passo: 4` no `INDICE.md` mentiria no dia em que ele mexesse na
busca à mão.

| passo | está pronto quando, na busca |
|---|---|
| 1 | o `INDICE.md` existe, com a linha `busca:`, e o título tem o nome dele |
| 2 | `## Quem sou` tem ao menos um contato, **ou** há linha do passo 2 em `## Pulado no começo` |
| 3 | `perfil.md` existe na raiz da busca |
| 4 | a tabela de `vagas/_indice.md` tem ao menos uma linha |
| 5 | algum vaga saiu de `nova` |

Retomando, três coisas e nada mais: diga em uma linha o que já está pronto, vá
para o primeiro passo que falta, e **não refaça o que já está**. Perguntar de
novo o que ele já respondeu é o defeito mais caro do pack. Ele pulou um passo e
agora o quer? Rode só ele.

---

## 5 · Como ela pergunta · O modo

O contrato põe teto de **três perguntas** numa execução. **Esta skill é a
exceção, e a exceção não é licença:** ela É o questionário. O que substitui o
teto é mais estrito que ele:

- **uma pergunta por passo.** O passo fecha, grava, e só então vem a próxima.
  Oito campos numa tela é o formulário que o contrato proíbe, também dividido
  em duas telas seguidas.
- **todo passo é pulável**, e o pulado vira linha em `## Pulado no começo` com a
  data. Nunca insista: a oferta volta na skill em que aquilo faz falta.
- **escolha entre dois e quatro caminhos usa a UI de perguntas** do harness —
  botões, não prosa —, rótulo de até quatro palavras e **o custo escrito em
  cada opção**. A descrição declara o custo; não vende a opção.
- **toda pergunta traz o motivo na mesma frase.** É o que faz ele responder em
  vez de fugir.

**O modo não muda nada aqui.** O que falta nesta skill só ele sabe — onde ficam
os arquivos, o nome dele, qual conta. Automático não inventa nenhuma dessas.

**A permissão aparece MAIS nesta skill que em qualquer outra.** O
`allowed-tools` dispensa a pergunta só no turno em que a skill é chamada; da
segunda resposta em diante, até gravar arquivo volta a pedir autorização. Diga
uma vez, quando a primeira aparecer, que é assim que o programa mostra o que
está sendo feito, e que aprovar é rápido. **Não** peça que ele desligue as
perguntas — ver a busca sendo escrita na primeira vez é o que constrói a
confiança que as outras skills vão gastar.

---

## 6 · Os passos

### Passo 1 · Onde fica a busca, e quem é você

**Primeiro, o lugar.** O transporte se escolhe aqui, uma vez, com o caminho que
você achou já preenchido:

```
Onde eu monto a sua busca?

  No computador       C:\Users\rafael\busca · abre em qualquer
                      editor, e é onde as outras skills procuram sozinhas
  No Google Drive     a pasta busca no seu Drive · funciona também no chat
                      do navegador, e precisa do conector do Drive ligado
  Outro lugar         você me diz onde · funciona, mas toda skill vai precisar
                      que você diga onde é
```

Já existe `INDICE.md` lá? **Pare e vá para a seção 4.**

Não existe: crie estes, pelos gabaritos da seção 4 do contrato —

```
modelos/INDICE.md            → ~/busca/INDICE.md
modelos/hoje.md              → ~/busca/hoje.md
modelos/funil.md             → ~/busca/funil.md
modelos/_indice-vagas.md   → ~/busca/vagas/_indice.md
modelos/_indice-contatos.md  → ~/busca/contatos/_indice.md
```

Os outros modelos viram arquivo depois, pela skill que os escreve, um por item.
**Os comentários `<!-- MODELO · … -->` saem — todos**, e o `<AAAA-MM-DD>` dos
títulos vira a data de hoje, agora: arquivo que chega a ele com o próprio
manual dentro parece arquivo pela metade. **A linha `envio:` sai junto**: ela
só existe onde há conector de mensagem (contrato §7.1), e quem a escreve é o
degrau que prova o envio.

**A primeira linha do `INDICE.md` é a do transporte**, antes de `modo:` —
`busca: local · C:\Users\rafael\busca` ou
`busca: drive · /busca`. É ela que as outras skills leem para
saber por onde ler e gravar. **No `drive`, a busca que abriu é o teste do
Drive**: grave `Google Drive: sim  ← testado <data>`.

**Pasta vazia não se cria com `Write`**: `_bruto/`, `arquivo-morto/` e as que
só enchem depois nascem quando o primeiro arquivo cai nelas. Diga isso em uma
linha, senão ele abre a busca, não as vê, e acha que faltou.

**A prova.** Mostre a lista na tela, com o lugar de verdade: no `local`, um
`Glob` em `~/busca/**/*.md`; no `drive`, a pasta e as de dentro, pelo
conector. Dizer que criou não é mostrar criado.

**Depois, o nome.** Uma pergunta, com o motivo dentro:

> Qual é o seu nome, do jeito que você assina? Vai em tudo que eu escrever por
> você, e é por ele que eu sei quem é você numa conversa colada.

É a única coisa obrigatória do passo. Escreva `nome:` e o título
`# Busca de <nome>`, e feche gravando `atualizado:` com a data de hoje.

O modo nasce `copiloto` — eu paro nas escolhas e pergunto. Diga isso em uma
linha, e que trocar é mudar a palavra `modo:` no `INDICE.md`; não pergunte.

### Passo 2 · Como te encontram

Uma pergunta, em texto livre, com o motivo dentro:

> Me passa a sua cidade, o e-mail, o telefone e o link do seu LinkedIn — e do
> portfólio, se tiver. Vão no cabeçalho de todo currículo, e são o que todo
> formulário de candidatura pede primeiro. O que não quiser dar agora fica em
> branco.

Cada resposta vai para a linha dela em `## Quem sou`, como ele escreveu. O que
ele não quiser dar fica em branco, e a skill que precisar pergunta de novo.
`assinatura de e-mail:` **não se pergunta** — deriva do que ele disse (regra
1). Pulou o passo inteiro: uma linha em `## Pulado no começo`.

**Conexão não entra aqui.** Agenda, e-mail, Drive, WhatsApp e o login em site
são oferecidos pela skill que precisar deles, no dia — cada um com o que muda,
como ligar e como desligar, em `references/conectores.md`; o WhatsApp tem a
cadeia própria, `references/conectar-whatsapp.md`, com o
`references/vocabulario.txt` do ofício ao lado. As linhas de
`## O que está conectado` ficam como o modelo as trouxe, e não viram
`## Pulado no começo`: não é pulo, é que a hora não chegou.

### Passo 3 · Passar a vez

Feche primeiro, com a saída da seção 7. Então diga em uma linha o que vem —
uma conversa sobre o que ele quer do próximo trabalho e o que já fez, uma pergunta por vez, que vira o perfil que diz que vaga procurar — e **passe a vez**: chame
`/vagas:perfil-de-busca` pela ferramenta de skill do harness, se a
sessão tiver uma; senão, peça que ele digite o comando. **Não faça a conversa
aqui**: ela tem as regras dela, e pode pausar e voltar sem perder o que ouviu.

Os passos 4 e 5 também são de outras skills: `/vagas:buscar-vagas`
traz as primeiras vagas pelo perfil, e `/vagas:triar-vagas` diz
qual delas vale. A conversa termina apontando as duas.

Ele já tem vagas em andamento, numa planilha ou em links? Uma linha: ponha em
`_bruto/` e rode `/vagas:organizar-busca`, que transforma em ficha.

---

## 7 · A saída

O fecho é o do contrato §10, com os títulos exatos. Não há bloco para colar: o
trabalho dela é a busca.

**O `## Guardei` sai sempre, inclusive quando nada foi gravado** — quem a chama
só para retomar um item e o teste não passa:

```markdown
## Guardei
- nada foi gravado — o teste do Google Drive não passou, e a linha só vira
  `sim` depois de uma chamada que voltou

## Ficou para depois
- ligar o Google Drive — continua em “Pulado no começo”, com a data de lá
```

`## Não gravei nada` e `## A busca está como estava` são títulos inventados, e
o contrato §4 os proíbe: quem lê o fecho procura os títulos fixos. Medido na
prova: esta skill inventou o próprio na primeira execução, tendo feito a coisa
certa.

```markdown
# Sua busca está montada

Ela mora em ~/busca/. É sua, é texto, e abre em qualquer editor.

## O que ficou pronto
- a busca, com os arquivos do padrão, no modo copiloto
- o seu nome e como te encontram, em `## Quem sou`

## Guardei
- ~/busca/INDICE.md — criado, com o seu nome, os contatos e o modo
- ~/busca/hoje.md, funil.md e os dois _indice.md — criados, vazios

## Falta saber
- o portfólio — você disse que ainda não tem, e a linha ficou em branco

## Ficou para depois
- agenda, e-mail, WhatsApp e login em site — a skill que precisar oferece

## O que pedir agora
/vagas:perfil-de-busca   a conversa sobre o que você procura, e o que já fez
```

No `drive`, o mesmo fecho troca o lugar: “Ela mora na pasta `busca` do
seu Drive”, e cada linha do `## Guardei` nomeia a pasta e o arquivo. Ao falar
com ele, data em prosa — “12 de agosto”; **nos arquivos, sempre `2026-08-12`**.
Todo id aparece com o apelido junto, em toda linha. `## Decidi sozinho` não
aparece: ela não decide nada sozinha (seção 5).

**A lista de comandos, uma linha cada, e toda skill instalada nela.** Não a
escreva de memória: onde há ferramenta de arquivo, um `Grep` pelo padrão
`^description:` em `../*/SKILL.md` a partir da pasta desta, com duas linhas
depois, dá o nome e a primeira frase de cada uma — escreva
`/vagas:<nome>` e o que ela faz, encurtado. Sem ferramenta de arquivo, a
lista está em `references/contrato/11-0-onde-roda.md`, com o que não funciona
no chat da web. Prometer skill que não existe é o primeiro erro que ele
encontra sozinho.

---

## 8 · Onde ela para

**Ela não conecta nada por ele.** Autorizar é no navegador dele, com a conta
dele. Ela explica com o nome de cada botão e espera. **Não pede senha em passo
nenhum** — se algo parecer pedir senha, não é ela.

**Ela não escreve `sim` sem testar.** Nem por pressa, nem porque ele disse que
conectou, nem porque a ferramenta apareceu na sessão.

**Ela não sobrescreve busca que já existe.** `Write` só em arquivo novo;
busca montada é retomada, e o passo feito não se refaz.

**Ela não apaga nada, nunca** — nem arquivo, nem linha, nem `_bruto/`. Mover a
busca de lugar é com ele.

**Ela não chuta dado de vaga.** Link que não abriu vira ficha colada ou `?` —
nem para a busca parecer mais cheia no fim do setup.

**Ela não escreve currículo nem mensagem.** A candidatura é de
`/vagas:candidatar`, o currículo é de
`/vagas:montar-curriculo`, a lista do dia é de
`/vagas:o-que-fazer-hoje`. Ela monta a busca de onde as três tiram o
que dizem.

**Ela não lê formulário de candidatura, enunciado de estudo de caso nem proposta.** Documento que aparecer vira arquivo
em `_bruto/` e uma linha dizendo que quem lê é `/vagas:candidatar`.

**Dos conectores ela só lê, e só no teste.** Não cria evento, não manda e-mail,
não escreve no Drive. A única coisa que sai é a mensagem de prova da ponte do
WhatsApp, para o **próprio número dele**, com a prévia na tela e o sim dele
(degrau 8 de `references/conectar-whatsapp.md`, quando é ela que liga a ponte).
Para contato nenhum ela manda nada: quem manda é a skill do dia (contrato §7.1).

**Ela não instala nada.** Não roda `/plugin`, não edita configuração, não mexe
em MCP. Ela diz o que digitar; quem digita é ele.

**Ela não sai da busca**, em transporte nenhum. **Sem nenhum dos dois
transportes ela não funciona**, e diz em uma linha: “Isto monta a sua busca, e
aqui eu não tenho onde montar. No Claude Code, ou com a busca no Drive,
funciona.” Nada é gravado, e ela não finge que foi.

**Ela não insiste.** Passo pulado é passo anotado, e a oferta volta uma vez, na
skill em que aquilo faz falta. Quando algo não der certo, uma linha: o que não
deu e qual é o caminho.
