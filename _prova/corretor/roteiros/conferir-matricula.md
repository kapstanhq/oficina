---
skill: conferir-matricula
entrada: |
  Chegou a matrícula do V-052 (apto 3 dorm, Cidade Baixa). Segue o texto,
  veio em PDF e eu copiei:

  Matrícula 71.209 — 5º Registro de Imóveis de Porto Alegre
  Certidão emitida em 2026-08-17

  Imóvel: apartamento nº 302, do Edifício Rio Grande, rua João Alfredo,
  Cidade Baixa, Porto Alegre. Área privativa 95 m². Fração ideal de terreno
  3,2%. Contribuinte 0098765-4.

  R-1 · 1995-02-10 · abertura da matrícula, incorporação do Edifício Rio Grande
  R-3 · 2011-09-05 · compra e venda, de Edifício Rio Grande Incorporações para Vânia Kirst
  R-6 · 2018-05-22 · hipoteca em favor do Banco Sul, R$ 150.000
  [carimbo cobrindo o resto desta linha, dá pra ler "2019" e nada mais]
  Av-8 · 2020-03-14 · averbação de reforma na unidade, sem habite-se novo

  Não achei nada depois disso na certidão.
pode_mudar:
  - _bruto/**
  - imoveis/V-052-apto-3d-cidade-baixa.md
  - imoveis/_indice.md
nao_muda:
  - _bruto/**
  - clientes/**
  - funil.md
  - hoje.md
  - INDICE.md
  - arquivo-morto/**
  - imoveis/V-071-casa-3d-azenha.md
  - imoveis/A-014-apto-2d-menino-deus.md
deve_conter:
  - "O imóvel"
  - "Ônus e gravames"
  - "O que eu não consegui ler"
---

O V-052 chega sem matrícula (`matrícula: ?`) na fixture, então esta execução
é a primeira leitura dele. Tem hipoteca sem baixa averbada e um trecho
ilegível de propósito, para exercitar as duas seções que mais importam.
`modo: copiloto` na fixture, então a exceção do §3 (nunca automático) não
chega a ser testada aqui — mas `## Decidi sozinho` não deve aparecer de
qualquer forma, porque não há bifurcação de modo nesta skill.
