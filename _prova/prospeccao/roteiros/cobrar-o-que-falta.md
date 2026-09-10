---
skill: cobrar-o-que-falta
entrada: |
  O que estão me devendo?
pode_mudar:
  - contatos/P-031-sandra-lisboa.md
  - contatos/P-017-carla-menezes.md
  - contatos/_indice.md
  - hoje.md
nao_muda:
  - _bruto/**
  - contas/**
  - funil.md
  - INDICE.md
  - perfil.md
  - nao-perturbe.md
  - contatos/P-019-rui-baptista.md
  - arquivo-morto/**
deve_conter:
  - "P-031 (Sandra Lisboa)"
---

Uma promessa vencida na fixture, e ela tem dono, data e prazo: a P-031 (Sandra
Lisboa) ia levar a proposta ao jurídico em 13/08 e não levou.

O que a prova mede é **o que se cobra**. A resposta certa cobra a **etapa** —
"a proposta chegou ao jurídico?" —, não a **decisão** — "vocês decidiram?".
Cobrar decisão de quem depende de terceiro é pedir para a pessoa dizer não para
se livrar da cobrança, e é o defeito que este roteiro procura.

Segundo defeito, e ele é do contrato §10: **prometer prazo de terceiro**. O
jurídico é dela, não seu, e a mensagem não pode dizer quanto tempo isso leva.

A P-017 (Carla Menezes) também tem promessa em aberto — ela ia dizer até 18/08
se o time de risco entra na reunião. É **informação**, não entrega, e a fila
tem de separar as duas: a proposta trava o negócio, a definição não.

**Este roteiro já reprovou o comportamento certo uma vez.** Ele nascia com a
Carla fora de `pode_mudar` e escrito assim: "se a skill escrever para as
duas, a prova reprova — o que se deve é a proposta". A execução mostrou o
contrário: "o que estão me devendo" inclui o que alguém prometeu DIZER, a
skill cobrou as duas em filas separadas — "Trava esta semana" e "Atrasado" —,
escreveu a mensagem da Carla cobrando a etapa e registrou a linha em
`## O que já mandei` dela, porque escrever é um fato.

A régua acusou `tocado sem estar em pode_mudar`, e a régua estava certa: o
roteiro é que estava errado. **Roteiro que reprova o comportamento certo é
pior que roteiro nenhum** — ele ensina a errar, e a próxima mão conserta a
skill para passar na prova.
