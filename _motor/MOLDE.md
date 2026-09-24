# O molde de uma skill da Oficina

Este arquivo não é seção do contrato e não entra em `CONTRATO.md` nenhum: o
montador só lê os arquivos com nome de seção (`NN-N-nome.md`). Ele é para quem
**escreve** uma skill — e é o arquivo que o comentário de `scripts/oficina.mjs`
prometia e que não existia até o segundo pack ir procurá-lo.

O que está aqui é o que o `npm run conferir` cobra. Onde a régua e este texto
divergirem, **a régua vence** e o defeito é deste arquivo.

---

## 1 · O frontmatter, e os quatro campos

```yaml
---
name: nome-da-pasta
description: >-
  O que ela faz · o que ela grava · o que ela NÃO faz · "Use quando o
  {profissional} disser —" com seis a dez gatilhos em português falado ·
  "Não é ela que… (/{plugin}:outra-skill)" para desambiguar das irmãs.
license: MIT
compatibility: >-
  O que ela precisa · o que acontece quando isso falta · o que é opcional.
allowed-tools: Read Glob Grep Write Edit
---
```

| campo | régua |
|---|---|
| `name` | **igual ao nome da pasta**, e o `conferir` compara |
| `description` | teto de **1.024** caracteres, contados por code point |
| `compatibility` | teto de **500** |
| `allowed-tools` | só o que ela usa. Skill que não escreve não pede `Write` |
| o arquivo inteiro | teto de **45.000** caracteres |

Os tetos de `description` e `compatibility` são da Skills API, não nossos. O
dobramento YAML (`>-`) é juntado com espaço antes de medir, que é como a API
mede.

**A `description` é o que faz a skill ser escolhida**, e é a única parte que o
agente lê antes de decidir. Ela não é resumo: é a lista de situações em que
esta skill — e não a irmã — é a certa. Escreva os gatilhos como a pessoa fala,
não como o produto se chama.

## 2 · As seções que a régua cobra

Três títulos, em qualquer nível de `#`, e a régua procura o texto dentro da
linha:

```
Antes de tudo      o que ela lê antes de agir, e o que ela faz se faltar
O modo             o que muda entre copiloto e automático (contrato §5)
Onde ela para      o que ela NÃO faz, nomeando quem faz
```

"Onde ela para" não é modéstia: é o que impede uma skill de crescer para
dentro do trabalho de outra. Escreva o que ela recusa e para quem manda.

## 3 · O fecho, que é cobrado duas vezes

```
## Guardei
## Falta saber
```

Os dois títulos são **exatos e ancorados em começo de linha** — `### Guardei`
não vale, `## Guardei —` não vale —, e `## Guardei` vem **antes** de
`## Falta saber`. O contrato §10 manda; a régua confere; a prova de execução
confere de novo na resposta que sai.

**`## Guardei` não some nunca**, nem quando nada foi gravado. Uma skill que
não escreveu nada diz isso ali, e é a linha mais importante dela: quem lê
precisa saber que a carteira **não** mudou.

## 4 · O contrato chega por citação, e só a quem cita

Cada skill leva a própria cópia em `references/`, gerada — ninguém copia à
mão. Mas **a seção só chega a quem a nomeia no texto**:

```
references/contrato/10-0-comeca-e-termina.md    ← obrigatória em TODA skill
references/contrato/09-0-os-tetos.md            ← quem mede arquivo
references/modelos/                             ← a pasta inteira
references/modelos/algum-gabarito.md            ← só esse
```

Duas réguas nascem daqui, e as duas custaram uma execução da prova para
aparecer:

- **Toda skill cita o fecho.** Sem a §10 na pasta dela, a skill inventa o
  título do fecho — e o defeito é convincente, porque ela faz o trabalho
  certo e só nomeia errado.
- **Seção citada tem de existir** no contrato do pack. Uma skill do motor
  pode citar seção que só o ofício escreve, e o pack que não a escrever herda
  uma skill quebrada.

## 5 · O que muda quando a skill mora no motor

Skill em `_motor/skills/` vale para qualquer profissão, e o pack recebe uma
cópia resolvida. Três coisas mudam ao escrever:

**As marcas valem também no nome da pasta.** `compartilhar-com-{pessoa}` vira
uma pasta por pack, porque o nome da pasta é o comando que a pessoa digita. O
valor precisa sair em kebab-case sem acento, ou a pasta quebra no terminal e
no marketplace sem erro nenhum.

**Nenhuma palavra do ofício, nem dentro de cerca de código.** Cada pack
declara as dele em `_proibido-no-motor`, e o `conferir` recusa todas em
`_motor/**`. Exemplo é marca, e marca se resolve.

**A marca tem gênero, e o ARTIGO se deriva.** `{item}` sai masculino num
pack e feminino no seguinte. O pack declara `item-genero` e `pessoa-genero` —
o `conferir` os cobra —, e o motor escreve `{o-item}`, `{do-item}`,
`{um-item}`, `{dos-itens}`. O nome da marca usa a forma masculina como
RÓTULO, não como valor: `{o-pessoa}` sai “a paciente” num pack de médico.
Medido: o motor tinha 111 artigos colados na marca, e o corretor nunca os
expôs porque “imóvel” é masculino.

**O adjetivo não se deriva, e por isso se evita.** Prefira o verbo — `8
{pessoas} entraram`, e não `8 {pessoas} novas` — e a oração ao particípio —
`{item} que veio de ficha`, e não `{item} vindo de ficha`. É a única regra
que só se vê depois de gerar, e nenhuma régua a pega.

**`{base}` é o lugar, e é feminina.** O motor não diz mais “carteira”: diz
`{base}` na prosa e `{pasta-base}` onde a palavra é caminho — a pasta, o campo
do `INDICE.md`, o nome de skill e de seção. O padrão é `base`; o pack declara a
dele. Ela é **feminina por contrato**, e o `conferir` cobra: o motor concorda
com ela a distância (“a {base} está montada”), e isso nenhuma flexão alcança.

**Quem tem etapa não é, necessariamente, quem recebe a mensagem.** Os dois
primeiros packs eram de venda e nos dois a etapa é da pessoa; o terceiro — a
busca de vaga — expôs que eram duas ideias na mesma marca. O pack declara
`etapa-de` (`pessoa`, o padrão, ou `item`), e o motor escolhe a marca pela
PERGUNTA que a frase responde:

```
{andante}   quem tem `etapa:`, quem aparece em linha do funil.md, quem fica
            “parado”, quem é aposentado por sumir — o DONO DA ETAPA
{pessoa}    quem fala, quem recebe a mensagem, quem tem telefone, quem pede
            silêncio — GENTE
{item}      a coisa de que se fala — o que se mostra, se estuda, se anuncia
```

`{andante}` é apelido, não um terceiro tipo: resolve para a palavra da pessoa
ou do item, com todas as flexões (`{o-andante}`, `{do-andante}`,
`{pasta-andantes}`). Quem lê a skill gerada lê “cliente” ou “vaga”, nunca
“andante”.

Onde o apelido não basta — o passo muda de NATUREZA —, usa-se o bloco, com as
duas marcas sozinhas na linha, sem aninhar:

```
[[se etapa-de:item]]
…o que só vale quando a etapa é {do-item}…
[[fim]]
```

E o que o ramo `etapa-de:item` tem de dizer, em toda skill que mexe com funil:

```
a etapa mora no arquivo {do-item}      o arquivo {do-pessoa} não tem `etapa:`
a linha do funil.md é {do-item}        e traz {o-pessoa} ligada, quando há
{item} pode não ter {pessoa}           não é defeito: é o caso comum
o silêncio se mede no {item}           a última linha do ## Histórico dele
a mensagem vai para {o-pessoa} ligada  pelo campo `{campo-da-pessoa-no-item}`
{item} parado e sem {pessoa}           NÃO entra em lista de mensagem: vira
                                       “achar com quem falar”, no hoje.md
```

**O invariante de quem mexe no motor:** com `etapa-de: pessoa`, os packs que
existem não mudam um byte. `npm run oficina` sem `--escrever` diz se mudou.

**E o pack pode recusar.** Nem toda skill do motor serve a todo ofício; quem
não a quer a declara em `_skills-do-motor-fora`, com o motivo ao lado.

## 6 · A prova, que é o que decide

Escrever a skill não termina em `npm run conferir`. Ela precisa de um roteiro
em `_prova/<pack>/roteiros/<skill>.md` — **a régua de cobertura reprova antes
de executar** se faltar — e de uma corrida contra a carteira de mentira.

O roteiro que mais ensina é o que prova a **ausência**: `pode_mudar: []` com
`nao_muda: ["**"]`, para o caso em que a resposta certa é não escrever nada e
dizer por quê. É o caso mais difícil de acertar, e o que mais aparece na vida
real.

## 7 · A ordem que funciona

```
## 1 · O que ela faz, e o que ela não faz
## 2 · Antes de tudo          ← cobrado
## 3 · O modo                 ← cobrado
## 4 · O passo a passo
## 5 · O que perguntar, e como
## 6 · O formato da saída
      ## Guardei              ← cobrado, ancorado
      ## Falta saber          ← cobrado, depois de Guardei
## 7 · Onde ela para          ← cobrado
```

A numeração é conveniência de leitura, não régua — o que a régua procura é o
texto do título. Mas a **ordem** é o roteiro de execução, e trocá-la faz a
skill agir antes de ler.
