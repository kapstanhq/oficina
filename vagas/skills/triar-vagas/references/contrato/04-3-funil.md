<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

### 4.3 · `funil.md`

Vista derivada do campo `etapa:` dos arquivos de vaga. As etapas são estas
seis, nesta ordem, e **nenhuma skill cria etapa nova**:

```
nova · salva · candidatada · em contato · entrevista · proposta
```

```
nova          entrou pela busca ou colada, e passou no que descarta sozinho.
              Ainda não foi julgada por gente
salva         você olhou e quer se candidatar
candidatada   saiu, e está escrito por onde, quando e com que currículo
em contato    alguém do lado de lá respondeu
entrevista    marcada, ou em rodadas
proposta      há número na mesa
```

Quem sai do funil não vira etapa: vai para `arquivo-morto/` pela regra 3, com
o motivo — `não vale`, `fechou`, `recusada`, `sem resposta`, `desisti`.

**`aceitei` é o fim bom, e sai pelo mesmo caminho.** A vaga em `proposta` vai
para `arquivo-morto/` com o motivo `aceitei` e a data — o arquivo morto é onde
ela fica guardada, não um julgamento sobre ela. No painel ela não é descarte:
tem botão próprio, e não o vermelho. E ela **põe a busca em pausa**: com uma
vaga `aceitei` no arquivo morto, `/vagas:o-que-fazer-hoje` e
`/vagas:organizar-busca` dizem que a busca está em pausa e não oferecem vaga
nova.

**A etapa é da vaga, não do contato.** Vaga anda sozinha — a maior parte delas
passa de `nova` a `candidatada` sem que exista uma pessoa com nome do outro
lado. O contato, quando aparece, é quem FALA pela vaga; ele não tem etapa, e o
mesmo recrutador pode falar por duas vagas em etapas diferentes.

```markdown
# Funil — atualizado em 2026-09-14

## nova
- V-033 (Analista de Atendimento, Nimbo Atendimento) · desde 2026-09-13 · regime ? · veio de gupy · próximo: julgar

## salva
- V-024 (Assistente de Sucesso do Cliente, Malha Telecom) · desde 2026-09-08 · remoto · encaixe alto, 44h seg–sex · próximo: adaptar o currículo

## candidatada
- V-020 (Atendente de SAC, Rota Delivery) · desde 2026-09-02 · híbrido em São Paulo · pelo site, com V-020-cv.md · próximo: achar com quem falar

## em contato
- V-023 (Consultora de Relacionamento, Pátio Varejo) · P-004 (Lívia Matos) · desde 2026-09-09 · presencial em São Paulo, 44h seg–sex · perguntou a pretensão · próximo: responder hoje

## entrevista
- V-018 (Analista de CS Júnior, Lumina Pagamentos) · P-006 (Tiago Moura) · desde 2026-09-11 · remoto no Brasil · segunda rodada dia 14, 10h · próximo: reler a vaga

## proposta
- nada aqui.
```

Uma linha por vaga, com o contato dela quando há, `· desde AAAA-MM-DD` e
`· próximo: <ação>`. Vaga aparece em uma etapa só. O exemplo é a busca de
quem sai do balcão de loja para o atendimento: a jornada entra na nota quando
é ela que decide, como o regime.

**A nota da linha começa pelo regime e o lugar** — `remoto`, `híbrido em
Campinas`, `presencial em São Paulo`, ou `regime ?` quando o anúncio não diz. O
funil é o que se folheia, e o regime é o que decide se cabe: uma linha que abre
com "encaixe alto" e cala o regime fez o candidato perder tempo numa vaga que
não era para ele (D240).
