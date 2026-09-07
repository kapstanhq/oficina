---
skill: montar-visita
entrada: |
  A Joana (C-017) quer ver mais uma opção antes de decidir sobre a casa da
  Azenha. Monta uma visita pra ela no próximo sábado, mostrando o V-052
  (apto 3 dorm, Cidade Baixa) também.
pode_mudar:
  - clientes/C-017-joana-ribeiro.md
  - imoveis/V-071-casa-3d-azenha.md
  - imoveis/V-052-apto-3d-cidade-baixa.md
  - funil.md
  - hoje.md
nao_muda:
  - _bruto/**
  - INDICE.md
  - clientes/C-019-rita-camargo.md
  - clientes/C-031-sr-almeida.md
  - imoveis/A-014-apto-2d-menino-deus.md
  - arquivo-morto/**
deve_conter:
  - "## A ordem, e por quê"
  - "## Para a agenda"
---

C-017 já visitou o V-071 uma vez (está no `## Histórico` dela). Isto testa
uma SEGUNDA saída, com um imóvel novo no roteiro — V-052 fica fora da faixa
de bairro que ela pediu (Azenha ou Menino Deus), o que é uma boa chance de
ver a skill justificar a inclusão ou deixá-lo em `## Não entraram`.
`WhatsApp: não` na fixture, então a segunda saída do §7.1 não deve aparecer.
