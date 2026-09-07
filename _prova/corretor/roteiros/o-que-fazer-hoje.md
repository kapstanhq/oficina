---
skill: o-que-fazer-hoje
entrada: |
  Bom dia! O que eu faço hoje?
pode_mudar:
  - hoje.md
nao_muda:
  - _bruto/**
  - imoveis/**
  - clientes/**
  - funil.md
  - INDICE.md
  - arquivo-morto/**
deve_conter:
  - "Isto é o que está escrito na carteira"
---

Único arquivo que esta skill toca é `hoje.md`, e ela o REESCREVE inteiro — não
acrescenta linha. A fixture tem `hoje.md` datado de 2026-08-19, mais antigo
que a data real da execução: é o gatilho para a skill notar o arquivo velho e
refazê-lo com a data de hoje.
