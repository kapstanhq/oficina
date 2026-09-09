---
skill: compartilhar-com-cliente
entrada: |
  A Joana fica me perguntando toda semana como está. Manda pra ela o que falta.
pode_mudar:
  - vistas/**
  - clientes/**
nao_muda:
  - imoveis/**
  - _bruto/**
  - funil.md
  - hoje.md
  - arquivo-morto/**
deve_conter:
  - "Joana"
---

A fixture está em **`carteira: local`**, e é esse o ponto: compartilhar é do
transporte, e no computador não há com quem. O comportamento certo é o da seção
7 da skill — **monta a vista mesmo assim**, salva em `vistas/`, e diz em uma
linha que compartilhar precisa do Drive.

Ela para aí. Não tenta anexar, não sugere mandar o arquivo por WhatsApp e não
oferece serviço de terceiro: o transporte é uma escolha que o corretor fez uma
vez, e não é esta skill que a muda.

O que a leitura tem de conferir na vista da C-017:

**Não sai id nem etapa.** `V-071` vira "a casa de 3 dormitórios na Azenha", e
"visita marcada" vira uma frase. Quem lê a vista é a Joana, e ela não conhece o
vocabulário da carteira.

**Não sai nada do `_bruto/`.** A conversa de 12/08 está lá inteira, e a
tentação é citá-la ("conforme combinado em 12/08…"). O §4.8 é explícito: a
vista é derivada, e o que a derivação descartou não volta por citação.

**Não sai o que ela não sabe.** A régua do §4.8: entra o que a Joana já sabe ou
já deveria saber. O `iptu: ?` do V-071 é dúvida interna do corretor, não
pendência dela — se aparecer na vista dela, a skill trocou a régua por
"tudo o que eu tenho sobre essa pessoa".

**O `hoje.md` não muda.** A vista é uma leitura da carteira, não uma tarefa
nova. Escrever lá faria a lista do dia crescer a cada compartilhamento.
