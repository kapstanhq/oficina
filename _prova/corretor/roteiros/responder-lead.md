---
skill: responder-lead
entrada: |
  Chegou essa conversa agora pelo WhatsApp, me ajuda a responder:

  [03/09/2026 09:14] Rafael Prado: oi, vi uma casa na Azenha no anúncio de vocês, ainda tá disponível?
  [03/09/2026 09:15] Rafael Prado: procuro até 550 mil, e preciso de pelo menos 3 quartos
  [03/09/2026 09:16] Rafael Prado: meu número é esse mesmo, pode chamar
pode_mudar:
  - _bruto/**
  - clientes/**
  - funil.md
  - imoveis/V-071-casa-3d-azenha.md
  - INDICE.md
nao_muda:
  - _bruto/**
  - hoje.md
  - arquivo-morto/**
  - imoveis/V-052-apto-3d-cidade-baixa.md
  - imoveis/A-014-apto-2d-menino-deus.md
deve_conter:
  - "## Guardei"
  - "## Falta saber"
---

Lead novo, sem ficha na carteira ainda — o próximo id `C-` é C-032 (o maior
já usado é C-031, contando o arquivo morto C-002). O pedido bate com o V-071
(casa 3 dorm, Azenha), que já tem outro cliente interessado: é o teste de que
a skill cruza o lead com a carteira sem duplicar imóvel nem inventar dado.
`WhatsApp: não` na fixture, então só o bloco para copiar deve sair — nada de
`preparar_envio`/`enviar_mensagem`.

**A regra (k) avisa aqui, e o aviso é dela.** A resposta diz "R$ 30.000 abaixo
do teto dele", e esse número não está na carteira nem na entrada: é a subtração
dos dois que estão (550.000 do lead, 520.000 do V-071). A regra (k) procura
valor inventado e não sabe somar — por isso o resultado é `!` e não `✗`.
Julgado em 2026-09-07: correto. Não é para consertar a skill nem a régua.
