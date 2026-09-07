---
skill: organizar-carteira
entrada: |
  Organiza minha carteira, faz tempo que não passo um pente fino.
pode_mudar:
  - clientes/**
  - imoveis/**
  - funil.md
  - INDICE.md
  - _bruto/**
  - arquivo-morto/**
nao_muda:
  - _bruto/**
  - hoje.md
deve_conter:
  - "# Organizei a carteira"
---

Varredura completa, sem argumento. A fixture está limpa de propósito — o
único `_bruto/` já está refletido na ficha da C-017 —, então o resultado
esperado é um relatório curto que confirma que não há nada por extrair, sem
inventar pendência. `pode_mudar` e `nao_muda` compartilham `_bruto/**` porque
o sentido é diferente: a skill pode CRIAR bruto novo (histórico condensado,
planilha), mas nunca ALTERAR o que já existia — é essa a distinção que a
regra (i) do checker faz entre arquivo novo e arquivo modificado.
