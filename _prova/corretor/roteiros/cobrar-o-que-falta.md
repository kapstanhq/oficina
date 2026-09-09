---
skill: cobrar-o-que-falta
entrada: |
  O que eu tô esperando dos outros? Cobra o pessoal aí.
pode_mudar:
  - clientes/**
  - hoje.md
nao_muda:
  - imoveis/**
  - _bruto/**
  - funil.md
  - arquivo-morto/**
deve_conter:
  - "Almeida"
---

A fixture tem **uma** pendência de terceiro, escrita no `hoje.md`: o Sr. Almeida
ia mandar o IPTU do V-071 em 2026-08-13 e não mandou. É a única, e é por isso
que ela serve — o roteiro mede se a skill acha a que existe **sem inventar as
que não existem**.

Três coisas que a leitura do resultado tem de conferir, e nenhuma delas é
automática:

**A cobrança oferece um caminho.** "Manda uma foto do carnê que já resolve"
passa; "conforme solicitado em 13/08, reitero o pedido" reprova. É a regra de
ouro da seção 4 da skill, e é o que separa esta de um robô de lembrete.

**Ela não cobra a Joana.** A C-017 não deve nada — ela tem visita marcada. Uma
cobrança para ela é o erro mais grave possível, porque prova que a skill não
olhou quem deve o quê.

**`imoveis/**` não muda.** A pendência é do IPTU do V-071, e a tentação é
escrever no arquivo do imóvel. Não: a tentativa se grava no arquivo de **quem
deve** — é lá que a próxima execução vai ler para não repetir. Escrever no
imóvel faria a segunda execução cobrar de novo em cinco dias.

E a fixture está em `modo: copiloto`, então ela **para antes de mandar**. Não há
conector na prova; o esperado é o bloco para copiar.
