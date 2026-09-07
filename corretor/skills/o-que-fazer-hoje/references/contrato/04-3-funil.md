<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

### 4.3 · `funil.md`

Vista derivada do campo `etapa:` dos arquivos de cliente. As etapas são estas
seis, nesta ordem, e **nenhuma skill cria etapa nova**:

```
novo lead · em conversa · visita marcada · visitou · proposta · fechado
```

Quem sai do funil sem fechar não vira etapa: vira `arquivo-morto/` pela regra 3.

```markdown
# Funil — atualizado em 2026-08-19

## novo lead
- C-024 (Paulo Menezes) · desde 2026-08-18 · veio do V-071 (casa 3 dorm, Azenha) no Zap · próximo: responder hoje

## em conversa
- C-019 (Rita Camargo) · desde 2026-08-05 · procura 2 dorm no Menino Deus · próximo: mandar A-014 (apto 2 dorm, Menino Deus)

## visita marcada
- C-017 (Joana Ribeiro) · desde 2026-08-14 · V-071 (casa 3 dorm, Azenha), sábado 10h · próximo: confirmar

## visitou
- nada aqui.

## proposta
- C-008 (Família Duarte) · desde 2026-08-16 · V-052 (apto 3 dorm, Cidade Baixa), R$ 480.000 · próximo: resposta do proprietário

## fechado
- C-002 (Léo Antunes) · 2026-08-01 · V-039 (casa 2 dorm, Tristeza)
```

Uma linha por cliente, sempre com `· desde AAAA-MM-DD` e `· próximo: <ação>`.
Cliente aparece em uma etapa só.
