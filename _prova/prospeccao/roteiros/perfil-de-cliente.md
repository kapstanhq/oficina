---
skill: perfil-de-cliente
entrada: |
  Quero revisar meu perfil. Fechei um cliente novo semana passada: uma
  transportadora de 120 pessoas em Joinville, quem assinou foi o CFO, e eles
  tinham acabado de trocar de sistema de frota.
pode_mudar:
  - perfil.md
nao_muda:
  - contas/**
  - contatos/**
  - funil.md
  - hoje.md
  - nao-perturbe.md
  - _bruto/**
  - arquivo-morto/**
  - INDICE.md
deve_conter:
  - "## Por que"
  - "## Guardei"
---

**Isto não é escrever do zero: é revisar.** O `perfil.md` da fixture existe,
tem cinco critérios, quatro desqualificadores e uma dúvida escrita. A skill tem
de mostrar o que está lá antes de mexer, e mexer **só** no que o fato novo
toca.

O fato novo mexe em três lugares, e em nenhum outro:

- **setor** — transporte não estava na lista. Entra, ou vira pergunta
- **região** — Joinville é Sul, e a região já dizia Sul e Sudeste. Não muda
- **tamanho** — 120 está dentro de 80 a 600, e é o **quarto** caso. A dúvida
  escrita em `## O que eu não sei ainda` é "se o porte certo é 80 ou 150", e
  120 não a resolve: continua lá

Três defeitos que este roteiro procura:

- **reescrever o arquivo inteiro** e perder a razão de cada critério. As linhas
  de `## Por que` levaram meses para existir, e a skill não as reescreve por
  causa de um caso novo
- **apagar a dúvida** de `## O que eu não sei ainda` porque agora há quatro
  casos. Quatro casos entre 90 e 180 não separam 80 de 150
- **mexer na carteira.** Nenhuma conta é reclassificada por esta skill, nem que
  o perfil novo desqualifique dez delas. Ela conta quantas são, em uma linha, e
  manda para `/prospeccao:organizar-carteira`

O critério novo leva procedência — `← prospector, <hoje>` — como qualquer
campo.
