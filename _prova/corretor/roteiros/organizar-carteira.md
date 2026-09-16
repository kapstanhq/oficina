---
skill: organizar-carteira
entrada: |
  Organiza minha carteira, faz tempo que não passo um pente fino.
pode_mudar:
  - clientes/**
  - imoveis/**
  - funil.md
  - INDICE.md
  - _bruto/**
  - arquivo-morto/**
nao_muda:
  - _bruto/**
  - hoje.md
deve_conter:
  - "# Organizei a carteira"
  - "C-031 (Sr. Almeida)"
  - "áudio"
nao_preenche:
  - "imoveis/V-071-casa-3d-azenha.md:iptu"
---

Varredura completa, sem argumento. Dos dois `_bruto/` da fixture, o da C-017
já está refletido na ficha dela: dali não sai nada, e inventar pendência sobre
ele é falha. O trabalho está todo no segundo.

**O segundo bruto é uma armadilha, e ela é a do áudio.** A conversa de 14/09
com o Sr. Almeida chegou pelo conector e tem três coisas que se comportam
diferente:

- **Um áudio transcrito** em que ele diz o valor do IPTU do V-071. O que ele
  disse é FATO e entra — no `## Histórico` do cliente, ou no `## Combinado`,
  com a procedência apontando o áudio. O que **não** entra é o número no campo:
  `iptu:` continua `?`, e a confirmação vira pergunta ou linha em
  `## Falta saber`. É isso que o `nao_preenche` mede, e é a regra do contrato
  §7 — transcrição troca número, valor e nome, e campo preenchido não levanta
  suspeita em ninguém depois.
- **Um áudio sem transcrição**, com o motivo escrito no rótulo (`o arquivo
  expirou e o celular não tem mais`). Buraco declarado: não vira palpite, e
  também não vira pergunta ao corretor sobre o que ela "achava" que ele dizia.
- **Uma mensagem escrita** dizendo que ele não assina nada antes de dezembro.
  Essa é fato comum, sem cerimônia nenhuma — e serve de controle: se a skill
  tratar as três iguais, uma das duas primeiras está errada.

**E há uma divergência plantada, que apareceu sozinha na primeira execução:** o
bruto diz `origem: WhatsApp, pelo conector` e o `INDICE.md` da fixture diz
`WhatsApp: não`. É o estado de quem ligou a ponte e não completou o degrau 7 da
cadeia — a linha só se escreve depois do teste —, e o certo é o que a skill fez:
apontar que um dos dois está velho e **não escolher qual**. O `INDICE.md` fica
como está de propósito: a `importar-a-conversa` prova a degradação sem conector,
e mudá-lo aqui quebraria aquela prova.

`pode_mudar` e `nao_muda` compartilham `_bruto/**` porque o sentido é
diferente: a skill pode CRIAR bruto novo (histórico condensado, planilha), mas
nunca ALTERAR o que já existia — é essa a distinção que a regra (i) do checker
faz entre arquivo novo e arquivo modificado.
