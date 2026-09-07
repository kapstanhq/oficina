---
skill: documentos-do-negocio
entrada: |
  Monta os documentos da venda financiada do V-071 (casa 3 dorm, Azenha)
  para a C-017 (Joana Ribeiro). Ela vai financiar pela Caixa.
pode_mudar:
  - imoveis/V-071-casa-3d-azenha.md
  - clientes/C-017-joana-ribeiro.md
  - clientes/C-031-sr-almeida.md
  - hoje.md
nao_muda:
  - _bruto/**
  - funil.md
  - INDICE.md
  - clientes/C-019-rita-camargo.md
  - imoveis/V-052-apto-3d-cidade-baixa.md
  - imoveis/A-014-apto-2d-menino-deus.md
  - arquivo-morto/**
deve_conter:
  - "## Peça nesta ordem"
  - "Do comprador"
  - "Do vendedor"
  - "Do imóvel"
---

`WhatsApp: não` na fixture, então a cobrança pelo conector (§6.1) não deve
aparecer — só o bloco para copiar. C-031 (Sr. Almeida) é o proprietário do
V-071, e já tem um pedido de IPTU em aberto em `## Combinado`: é o teste de
que a skill não pede o mesmo documento duas vezes.
