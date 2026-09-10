### 4.3 · `funil.md`

Vista derivada do campo `etapa:` dos arquivos de contato. As etapas são estas
seis, nesta ordem, e **nenhuma skill cria etapa nova**:

```
a estudar · a abordar · abordado · respondeu · reunião marcada · virou cliente
```

Quem diz não, some por 90 dias ou sai do perfil não vira etapa: vira
`arquivo-morto/` pela regra 3.

**A etapa é do contato, não da conta.** Uma conta pode ter dois contatos em
etapas diferentes — um que respondeu e um que nem foi abordado —, e é assim
mesmo: quem responde é gente, não empresa. A conta tem `estado:`, que é outra
coisa (seção 4.4).

```markdown
# Funil — atualizado em 2026-08-19

## a estudar
- P-024 (Paulo Tavares) · E-052 (Clínica Sanare, Curitiba) · desde 2026-08-18 · veio de uma lista de evento · próximo: estudar a conta

## a abordar
- P-019 (Rui Baptista) · E-083 (Móveis Bertoldo, Bento Gonçalves) · desde 2026-08-11 · gancho: trocaram de ERP em junho · próximo: achar o e-mail

## abordado
- P-041 (Otávio Prado) · E-039 (Log Sul, Canoas) · desde 2026-08-14 · e-mail em 14/08, sem resposta · próximo: retomar em 21/08

## respondeu
- P-017 (Carla Menezes) · E-071 (VetorBank, Porto Alegre) · desde 2026-08-16 · perguntou o preço · próximo: propor terça ou quinta

## reunião marcada
- P-031 (Sandra Lisboa) · E-083 (Móveis Bertoldo, Bento Gonçalves) · desde 2026-08-17 · quinta 9h, com o time de compras · próximo: confirmar na véspera

## virou cliente
- P-008 (Diego Furtado) · E-052 (Clínica Sanare, Curitiba) · 2026-08-01
```

Uma linha por contato, sempre com a conta dele, `· desde AAAA-MM-DD` e
`· próximo: <ação>`. Contato aparece em uma etapa só.
