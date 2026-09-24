<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

### 4.6 · Os dois `_indice.md`

Vista derivada, uma tabela, **uma linha por item**, e nada além disso. Quem
quer detalhe abre o arquivo — é para isso que a linha tem o id.

`vagas/_indice.md` — sem a etapa, que é do `funil.md`:

```markdown
# Vagas — 11 vivas · atualizado em 2026-09-14

| vaga | estado | regime | encaixe | atualizada |
|---|---|---|---|---|
| V-014 (Técnica de Enfermagem UTI, Vértice Saúde) | aberta | presencial no Recife | alto | 2026-09-13 |
| V-011 (Técnica de Enfermagem, Hospital Boa Vista) | aberta | presencial no Recife | alto | 2026-09-11 |
| V-013 (Técnica de Enfermagem — sala de vacina, Rede Farma Sol) | aberta | presencial em Olinda | médio | 2026-09-13 |

## Arquivo morto
- V-006 (Técnica de Enfermagem, Aurora Saúde) · 2026-09-03 · não vale: presencial em Caruaru
- V-009 (Técnica de Enfermagem Home Care, Norte Seguros) · 2026-09-10 · fechou: a página saiu do ar
```

`contatos/_indice.md`:

```markdown
# Contatos — 8 · atualizado em 2026-09-14

| contato | papel | empresa | fala por | último contato |
|---|---|---|---|---|
| P-002 (Marta Lins) | recrutador | Hospital Boa Vista | V-011 (Técnica de Enfermagem, Hospital Boa Vista) | 2026-09-11 |
| P-004 (Sérgio Alves) | gestor | Aurora Saúde | V-016 (Técnica de Enfermagem — Pronto-Atendimento, Aurora Saúde) | 2026-09-05 |
| P-001 (Célia Moraes) | referência | Aurora Saúde | — | 2026-08-20 |

## Arquivo morto
- nada aqui.
```

**O motivo do arquivo morto é o que a busca aprende.** Dez linhas de
`não vale: presencial em Caruaru` dizem que o filtro de lugar está deixando
passar o que não devia — e quem lê isso é `/vagas:perfil-de-busca`, na
próxima vez que o perfil for revisto.

Duas linhas para a mesma **vaga** é id duplicado, e a regra da seção 9 vale:
pare, mostre as duas e pergunte qual fica.
