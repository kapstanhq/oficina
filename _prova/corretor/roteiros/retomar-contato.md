---
skill: retomar-contato
entrada: |
  Quem parou de responder? Quero mandar uma retomada pra Rita Camargo
  (C-019), ela sumiu.
pode_mudar:
  - clientes/C-019-rita-camargo.md
  - clientes/C-017-joana-ribeiro.md
  - clientes/_indice.md
  - hoje.md
nao_muda:
  - _bruto/**
  - imoveis/**
  - funil.md
  - INDICE.md
  - clientes/C-031-sr-almeida.md
  - arquivo-morto/**
deve_conter:
  - "C-019 (Rita Camargo)"
---

Rita está parada desde 2026-08-05 na fixture — sempre "há muitos dias"
relativo à data real da execução, o suficiente para entrar na lista sem
esbarrar no teto de duas retomadas sem resposta (o histórico dela não tem
nenhuma retomada anterior). `WhatsApp: não`, então a saída é só o bloco para
copiar.

**A entrada tem DUAS partes, e a primeira autoriza a lista inteira.** "Quem
parou de responder?" é a pergunta que a skill existe para responder; "quero
mandar uma retomada pra Rita" é o pedido dentro dela. Por isso a Joana está em
`pode_mudar`: a skill pode escrever para ela e registrar a retomada no arquivo
dela, que é o que o contrato manda.

A régua acusou isso uma vez, em 2026-09-07, com a Joana em `nao_muda` — e o que
a skill tinha feito era o comportamento CERTO: listou as duas, recusou a Rita
por não haver novidade (nenhum imóvel da carteira bate com o que ela procura, e
retomada sem novidade é cobrança) e escreveu para a Joana, que tinha ângulo.

**O controle negativo continua sendo o Sr. Almeida**, e ele é melhor: é
proprietário, não comprador, e o que está parado com ele é documento. A skill
deve deixá-lo de fora com esse motivo — mexer no arquivo dele é a falha que este
roteiro procura.
