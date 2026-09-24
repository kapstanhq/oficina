---
name: criar-pack
description: >-
  Cria um pack novo da Oficina neste repositório a partir do _modelo/:
  entrevista o contribuidor sobre o ofício, uma pergunta por vez, roda
  `npm run novo-pack`, preenche o vocabulario.json, os exemplos, as seções do
  contrato, os gabaritos, o README e a fixture com as respostas, e repete
  `npm run marcas <slug>` até dar zero; depois monta e roda a prova seca. Não
  inventa o ofício: o que a entrevista não respondeu vira pergunta, não
  palpite. Use quando alguém disser "quero criar um pack", "pack novo para
  <profissão>", "fazer a Oficina para dentista / advogado / fotógrafo",
  "novo ofício", "criar o pack de …", "como começo um pack", ou abrir o
  repositório para contribuir com uma profissão que ainda não existe. Não é
  ela que mexe no motor (`_motor/`) nem num pack que já existe.
allowed-tools: Read Glob Grep Write Edit Bash
---

# Criar um pack

Quem roda isto está com o Claude Code aberto na raiz do repositório
`kapstanhq/oficina`. Confira antes de tudo: tem de existir `_modelo/`,
`scripts/novo-pack.mjs` e `.claude-plugin/marketplace.json`. Se não existir,
diga que a skill só funciona na raiz do repositório e pare.

Leia `CONTRIBUTING.md` e `_motor/MOLDE.md` antes da primeira pergunta — o
molde é o que a régua cobra de toda skill, e as regras de gênero e de
`{andante}` que ele explica decidem metade das respostas.

## As regras da conversa

- **Uma pergunta por vez**, e espere a resposta. Diga por que pergunta quando
  não for óbvio ("isto vira o nome da pasta e do comando").
- **Nunca invente o ofício.** Etapa, campo, documento, prazo, jargão, o que
  trava um negócio: vem do contribuidor. Se uma marca pede um fato que a
  entrevista não trouxe, pergunte — agrupando as marcas que a mesma pergunta
  resolve. Dado de exemplo (nome de pessoa, empresa, telefone) é o contrário:
  inventado sempre, com nome fictício, domínio `.example` e telefone
  `+55 11 90000-00NN`.
- **Mostre o valor antes de gravar** quando ele for uma escolha de palavra
  (o nome do item, da base, das etapas). O resto grava e segue.
- Não faça commit. Fins de linha em LF.

## 1 · A entrevista

Na ordem. Cada resposta alimenta as seguintes.

1. **Quem é a pessoa.** A profissão como ela se chama (`{profissional}`,
   `{Profissional}`) e o ofício por extenso (`{oficio}`). Trabalha sozinha ou
   em equipe? Por que precisa disto?
2. **O slug e o nome.** O slug é o prefixo de todo comando (`/<slug>:…`):
   minúsculas, sem acento, hífen. O nome vai no título do README e no
   `displayName`.
3. **O item.** A coisa de que se fala e que tem ficha — o imóvel, a conta, a
   vaga. Singular, plural, **gênero** (m/f), a pasta (kebab-case sem acento),
   a forma do apelido, os campos que a ficha tem, e o teto em linhas.
4. **A pessoa.** Quem fala, quem recebe mensagem, quem tem telefone. Singular,
   plural, gênero, pasta, o que a ficha dela guarda, o teto.
5. **Quem anda no funil** (`etapa-de`): a pessoa ou o item? E as **etapas**,
   em ordem, da primeira à última — nenhuma skill cria etapa depois.
6. **O nome do lugar** (`{base}`): onde tudo mora. É **feminino por
   contrato** — o motor concorda com ele a distância. Se a resposta for
   masculina, explique e peça outra palavra.
7. **Os prefixos de id** — uma ou duas maiúsculas por tipo de ficha.
8. **O que ela reescreve toda semana.** É a primeira skill própria do pack:
   o que entra, o que sai, o que ela grava e o que só o profissional sabe.
9. **As palavras que só existem no ofício** — jargão, sigla, registro
   profissional. Vão para `_proibido-no-motor`; palavra comum do português
   fica de fora (leia o comentário de `conferirMotor` em `scripts/oficina.mjs`).
10. **Alguma skill do motor não faz sentido no ofício?** Mostre a lista
    (`ls _motor/skills`). Recusa vai para `_skills-do-motor-fora` com o motivo
    escrito ao lado.

## 2 · Criar e preencher

```
npm run novo-pack -- <slug> --nome "<Nome>"
npm run marcas <slug>
```

A lista do `marcas` é o roteiro. Comece pelo que destrava as outras:
`item-genero`, `pessoa-genero`, `etapa-de` e `base` — enquanto faltarem, o
vocabulário não carrega e todas as marcas aparecem como faltando.

- **`<slug>/contrato/vocabulario.json`.** Cada valor por preencher mostra o
  que o corretor e a prospecção escreveram. Para ver a frase em que a marca
  entra: `grep -rn "{<chave>}" _motor`. Escreva o equivalente no ofício — com
  a entrevista, não com o texto dos outros packs. `secao-arquivo-item` é o
  nome do arquivo da seção 4.4 deste pack.
- **`<slug>/exemplos/*.md`.** Cada um é colado inteiro onde o motor escreve a
  marca com o nome dele; os dois packs têm o mesmo arquivo para comparar.
- **As seções de `contrato/`**, os **gabaritos** de `modelos/` e a fixture em
  `_prova/<slug>/`. Mesmas etapas, na mesma ordem, em `04-3-funil.md`,
  `modelos/funil.md` e na fixture. Renomeie o que o `marcas` apontar: a seção
  4.4 com o nome do item sem acento, os gabaritos com o nome do ofício, e a
  pasta da fixture para o valor de `pasta-base`.
- **A primeira skill** (`skills/primeira-skill/`): renomeie a pasta, o
  `name:`, a linha do README e o roteiro em `_prova/<slug>/roteiros/`. Escreva
  pelo `_motor/MOLDE.md`. Skill própria é fonte: nada de `{marca}` nela.
- **README, `plugin.json`, a description no `marketplace.json` e o
  `painel.json`.** A tabela de comandos do README tem de ser exatamente as
  pastas de `skills/` depois de montar — as do motor com os nomes resolvidos
  (`compartilhar-com-<pessoa>`, `organizar-<pasta-base>`,
  `laudo-da-<pasta-base>`), menos as recusadas. Número de skills por extenso
  não se escreve: o montador confere. No `painel.json`, acrescente em `sobre`
  as skills do motor que agem sozinhas e a própria.

Rode `npm run marcas <slug>` depois de cada arquivo, até `total: 0`.

## 3 · Montar e provar

```
npm run painel
npm run montar -- --escrever
npm run montar
npm run provar -- --seco --pack <slug>
```

O primeiro `--escrever` pode acusar que o README cita skills que ainda não
existem: ele confere o README antes de gerar as skills do motor. Rode de novo.
Todo `✗` que sobrar nomeia o arquivo — conserte na fonte do pack, nunca na
cópia gerada. Se o defeito for uma frase do motor que não serve ao ofício,
não a reescreva aqui: anote e diga ao contribuidor, porque a correção vale
para todos os packs e é outro PR.

## 4 · O modo

Esta skill é sempre copiloto: quem decide o ofício é o contribuidor. Ela
preenche sozinha só o que é mecânico — renomes, a tabela do README, o
`painel.json` — e diz o que fez.

## 5 · Como termina

## Guardei
- os arquivos criados e preenchidos, por pasta
- o resultado das três réguas: `marcas`, `montar`, `provar --seco`

## Falta saber
- o que o contribuidor deixou em aberto, e o que ainda falta antes de um PR:
  os roteiros das skills do motor em `_prova/<slug>/roteiros/` (a prova
  `--rodar` cobra um por skill) e, se o pack terá prompt colado, o
  `prompts/<slug>.md`

## 6 · Onde ela para

Não mexe em `_motor/`, no painel, nos conectores nem no montador. Não edita
pack que já existe. Não roda `npm run provar -- --rodar`, que gasta a conta de
quem roda — só diz que é o próximo passo antes de uma mudança grande.
