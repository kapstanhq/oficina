---
skill: importar-a-conversa
entrada: |
  Colei aqui a conversa que tive ontem com a Sandra Lisboa:

  [18/08/2026 10:12] Sandra: Renata, bom dia. O jurídico pediu mais uma semana,
  eles estão com o fechamento do semestre.
  [18/08/2026 10:20] Renata: sem problema. A reunião de quinta continua de pé?
  [18/08/2026 10:31] Sandra: continua. Vou levar o Rui junto, ele quer entender
  a parte de fábrica.
pode_mudar:
  - _bruto/**
  - contatos/P-031-sandra-lisboa.md
  - contatos/_indice.md
  - funil.md
  - hoje.md
nao_muda:
  - contas/**
  - perfil.md
  - nao-perturbe.md
  - arquivo-morto/**
  - INDICE.md
  - contatos/P-017-carla-menezes.md
deve_conter:
  - "_bruto/"
  - "P-031 (Sandra Lisboa)"
---

**`_bruto/` está em `pode_mudar` aqui, e só aqui e no `estudar-conta`.**
A regra é que ele nunca se EDITA; criar arquivo novo é o trabalho desta skill.
O nome sai da data do material, não de hoje: `2026-08-18-whatsapp-sandra.md`.

Três fatos saem da conversa, e cada um vai para um lugar diferente:

- **o jurídico pediu mais uma semana** → `## Combinado` da P-031, com a data.
  É o que tira a linha vencida do `hoje.md`: a promessa foi renegociada, não
  quebrada
- **a reunião de quinta continua** → confirma o que já estava lá. Não vira
  linha nova
- **o Rui vai junto** → `quem decide junto:` da P-031, e uma linha no
  `## Histórico`

E há um fato que **não** está na conversa e que a skill pode ser tentada a
deduzir: que o P-019 (Rui Baptista) agora é contato ativo do processo. Ele já
tem ficha, e a etapa dele é `a abordar` — mudá-la por causa desta conversa é
deduzir. O arquivo dele está em `nao_muda`… e não está: ele não aparece em
nenhuma das duas listas, o que quer dizer que **mexer nele reprova**, porque
`pode_mudar` é a lista fechada.
