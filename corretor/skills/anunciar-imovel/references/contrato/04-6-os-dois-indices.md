<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

### 4.6 · Os dois `_indice.md`

Vista derivada, uma tabela, **uma linha por item**, e nada além disso. Quem
quer detalhe abre o arquivo — é para isso que a linha tem o id.

`imoveis/_indice.md`:

```markdown
# Imóveis — 12 à venda, 3 para alugar · atualizado em 2026-08-19

| imóvel | estado | preço | atualizado |
|---|---|---|---|
| V-071 (casa 3 dorm, Azenha) | à venda | R$ 520.000 | 2026-08-15 |
| V-052 (apto 3 dorm, Cidade Baixa) | reservado | R$ 480.000 | 2026-08-16 |
| A-014 (apto 2 dorm, Menino Deus) | para alugar | R$ 2.400/mês | 2026-08-11 |

## Arquivo morto
- V-039 (casa 2 dorm, Tristeza) · 2026-08-01 · vendida para C-002 (Léo Antunes)
```

`clientes/_indice.md` — sem a etapa, que é do `funil.md`:

```markdown
# Clientes — 21 ativos · atualizado em 2026-08-19

| cliente | procura | canal | último contato |
|---|---|---|---|
| C-017 (Joana Ribeiro) | 3 dorm até R$ 550.000, Azenha | WhatsApp | 2026-08-15 |
| C-019 (Rita Camargo) | 2 dorm até R$ 400.000, Menino Deus | WhatsApp | 2026-08-05 |
| C-031 (Sr. Almeida) | proprietário do V-071 (casa 3 dorm, Azenha) | telefone | 2026-08-13 |

## Arquivo morto
- C-002 (Léo Antunes) · 2026-08-01 · comprou o V-039 (casa 2 dorm, Tristeza)
```

Proprietário também é cliente e ganha `C-`: é dele que se cobra documento, e
cobrança sem ficha vira recado perdido. Na tabela, a coluna `procura` diz de
qual imóvel ele é dono.
