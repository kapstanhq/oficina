### 4.6 · Os dois `_indice.md`

Vista derivada, uma tabela, **uma linha por item**, e nada além disso. Quem
quer detalhe abre o arquivo — é para isso que a linha tem o id.

`contas/_indice.md`:

```markdown
# Contas — 12 a estudar, 8 a abordar · atualizado em 2026-08-19

| conta | estado | setor | atualizada |
|---|---|---|---|
| E-071 (VetorBank, Porto Alegre) | a abordar | crédito | 2026-08-18 |
| E-083 (Móveis Bertoldo, Bento Gonçalves) | em conversa | indústria moveleira | 2026-08-17 |
| E-052 (Clínica Sanare, Curitiba) | a estudar | saúde | 2026-08-11 |

## Arquivo morto
- E-039 (Log Sul, Canoas) · 2026-08-01 · disse não: acabaram de assinar com outro fornecedor
```

`contatos/_indice.md` — sem a etapa, que é do `funil.md`:

```markdown
# Contatos — 21 ativos · atualizado em 2026-08-19

| contato | conta | cargo | último contato |
|---|---|---|---|
| P-017 (Carla Menezes) | E-071 (VetorBank, Porto Alegre) | head de dados | 2026-08-16 |
| P-019 (Rui Baptista) | E-083 (Móveis Bertoldo, Bento Gonçalves) | diretor industrial | 2026-08-11 |
| P-031 (Sandra Lisboa) | E-083 (Móveis Bertoldo, Bento Gonçalves) | compras | 2026-08-17 |

## Arquivo morto
- P-041 (Otávio Prado) · 2026-08-01 · saiu da empresa; o E-039 (Log Sul, Canoas) ficou sem contato
```

**Duas linhas de contato para a mesma conta é normal** — é o que acontece quando
a decisão é dividida. Duas linhas para a mesma **pessoa** é id duplicado, e a
regra da seção 9 vale: pare, mostre as duas e pergunte qual fica.
