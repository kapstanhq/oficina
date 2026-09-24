---
skill: primeira-skill
entrada: |
  <<preencher: o que a pessoa digitaria, em português falado>>
pode_mudar:
  - <<preencher: o que esta skill pode gravar, em glob relativo à pasta>>
nao_muda:
  - _bruto/**
  - arquivo-morto/**
deve_conter:
  - "## Guardei"
---

<<preencher: o que esta prova mede, e o que da fixture ela usa. Renomeie o arquivo junto com a skill. Toda skill do pack — as do motor também — precisa de um roteiro aqui antes do `npm run provar -- --rodar`; o `--seco` não os lê. O roteiro que prova uma AUSÊNCIA (pode_mudar vazio, nao_muda "**") é o que mais ensina: veja _prova/prospeccao/roteiros/laudo-da-carteira.md>>
