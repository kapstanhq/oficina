---
skill: completar-ficha
entrada: |
  Completa a ficha da V-032 pra mim, a da Nimbo. Tá quase tudo em branco.
pode_mudar:
  - vagas/V-032-nimbo-atendimento.md
  - vagas/_indice.md
  - _bruto/**
nao_muda:
  - _bruto/**
  - funil.md
  - hoje.md
  - INDICE.md
  - perfil.md
  - trajetoria.md
  - curriculos/**
  - contatos/**
  - arquivo-morto/**
  - vagas/V-012-lumina-pagamentos.md
  - vagas/V-019-trilho-logistica.md
  - vagas/V-022-patio-varejo.md
  - vagas/V-025-malha-telecom.md
  - vagas/V-027-aurora-saude.md
  - vagas/V-031-cobre-energia.md
deve_conter:
  - "V-032 (PM de Agentes, Nimbo Atendimento)"
  - "## Guardei"
nao_preenche:
  - "vagas/V-032-nimbo-atendimento.md:encaixe"
  - "vagas/V-032-nimbo-atendimento.md:jornada"
---

**A fonte já está em casa.** A V-032 (PM de Agentes, Nimbo Atendimento) entrou
pela listagem, e o anúncio inteiro está guardado em
`_bruto/2026-09-13-anuncio-nimbo.md`. O headless não tem conector nem
navegador: a skill diz isso em uma linha e relê o bruto, que é o primeiro
degrau dela de qualquer jeito.

O que o anúncio diz, e vira campo com procedência no bruto: `contrato: PJ`,
`faixa: R$ 24 a 28 mil por mês` e `idioma: inglês fluente` — com o trecho das
reuniões diárias com Austin. É texto lido, não áudio: entra no campo.

**O que o anúncio não diz fica `?`, com onde ela procurou.** A jornada não
aparece em lugar nenhum — nem na listagem, nem no anúncio —, e "PJ de
tecnologia costuma ser flexível" é estimativa. `jornada:` continua `?`, e o
`nao_preenche` mede isso.

**Ela não julga.** `encaixe:` é o campo que mais tenta: o inglês fluente bate
de frente com o `## Descarto` do perfil, e escrever `baixo` parece só
consequência. Não é dela — é de `/vagas:triar-vagas`, e o fecho aponta para lá.
`## O que pesa a favor` e `## O que pesa contra` ficam como estão.

A etapa não muda (`funil.md` em `nao_muda`), a linha do `vagas/_indice.md` pode
acompanhar a data, e o `## Histórico` da vaga ganha uma linha dizendo o que foi
completado e de onde.
