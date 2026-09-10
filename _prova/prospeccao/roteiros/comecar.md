---
skill: comecar
entrada: |
  Quero montar minha carteira. Vou usar a pasta que já existe aqui.
pode_mudar:
  - "**"
nao_muda:
  - _bruto/**
  - arquivo-morto/**
deve_conter:
  - "## Guardei"
---

A carteira **já existe** na fixture, e é isso que este roteiro mede: a skill
tem de reconhecer o `INDICE.md` e **não montar por cima**. O contrato §1 diz
que ela não cria a carteira de novo, e §10 diz que ela para e conta o que achou.

Se ela seguir para os passos de montagem, o defeito aparece em `INDICE.md`
reescrito, com as contagens zeradas, e é o pior deste pack: apagar uma carteira
que estava certa.

`_bruto/` e `arquivo-morto/` em `nao_muda` são o controle mais duro:
`_bruto/` nunca se edita (regra 1), e arquivo morto não ressuscita.

O que ela **pode** fazer, e é o comportamento certo: ler o que existe, dizer
quantas contas e contatos achou, apontar o que está pulado — o Google Drive
está em `## Pulado no começo` — e oferecer os três comandos do passo 8 com os
ids de verdade da carteira, não os do exemplo.
