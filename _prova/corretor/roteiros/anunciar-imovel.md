---
skill: anunciar-imovel
entrada: |
  Cola essa ficha e cadastra o imóvel, por favor:

  Casa 3 dormitórios, 95 m², bairro Tristeza, Porto Alegre.
  Preço R$ 398.000. Uma vaga de garagem, sem suíte.
  Endereço: rua Wenceslau Escobar, 1450.
  Contato do proprietário: Beatriz Nunes, 51 99123-8877.
  Não é exclusividade, ela também anuncia com outra imobiliária.
pode_mudar:
  - _bruto/**
  - imoveis/**
  - INDICE.md
nao_muda:
  - _bruto/**
  - clientes/**
  - funil.md
  - hoje.md
  - arquivo-morto/**
deve_conter:
  - "Título"
  - "Descrição"
  - "Ficha"
  - "## Guardei"
---

Testa a criação de um imóvel novo a partir de ficha colada — o próximo id de
prefixo `V-` na fixture é V-072 (o maior já usado é V-071, contando o arquivo
morto V-039). Não usa link porque `--rodar` não depende de acesso à internet.
