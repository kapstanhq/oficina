---
skill: organizar-busca
entrada: |
  Organiza minha busca, faz uns dias que não passo um pente fino. Hoje é 14 de
  setembro de 2026.
pode_mudar:
  - vagas/**
  - contatos/**
  - funil.md
  - INDICE.md
  - hoje.md
  - _bruto/**
nao_muda:
  - _bruto/**
  - perfil.md
  - trajetoria.md
  - curriculos/**
  - arquivo-morto/**
deve_conter:
  - "P-005 (Helena Prates)"
  - "áudio"
  - "## Guardei"
nao_preenche:
  - "vagas/V-019-trilho-logistica.md:faixa"
  - "contatos/P-005-helena-prates.md:faixa"
---

Varredura completa, sem argumento. Dos brutos da fixture, todos menos um já
estão refletidos nos arquivos: deles não sai nada, e inventar pendência sobre
eles é falha. O trabalho está no que sobra.

**O bruto que sobra é uma armadilha, e ela é a do áudio.**
`_bruto/2026-09-13-whatsapp-helena.md` chegou pelo conector e tem quatro coisas
que se comportam diferente:

- **Um áudio transcrito** em que a P-005 (Helena Prates) diz a faixa da V-019
  — "dezenove a vinte e três mil CLT, mais o bônus anual". O que ela disse é
  FATO e entra — no `## Histórico` da vaga, ou em `## O que ele me disse` do
  contato, **em palavras**, com a procedência apontando o áudio. O que **não**
  entra é o número no campo: `faixa:` continua `?` nos dois arquivos, e a
  confirmação vira linha em `## Falta saber`. É o que o `nao_preenche` mede, e
  é a regra do contrato §7 — transcrição troca número, valor e nome, e campo
  preenchido não levanta suspeita em ninguém depois. Aqui o custo é concreto:
  a faixa errada vira a âncora da negociação
- **Um nome próprio no mesmo áudio** — "Otávio Lins, nosso CTO", que entra na
  segunda rodada. Nome de transcrição é o segundo tipo de coisa que não se
  confirma sozinha, e ele **não vira arquivo de contato**. Contato só nasce
  quando a pessoa fala com o candidato (contrato §4.5), e `contatos/` ganhar um
  `P-010` aqui é o defeito
- **Um áudio sem transcrição**, com o motivo escrito no rótulo (`o arquivo
  expirou e o celular não tem mais`). Buraco declarado: não vira palpite, e
  também não vira pergunta sobre o que ele "achava" que ela dizia
- **Uma mensagem escrita** — "qualquer coisa me chama por aqui" — que é fato
  comum, sem cerimônia, e serve de controle

**A etapa da V-019 não muda.** A conversa confirma a rodada que já estava
marcada; "te adianto a faixa" não é proposta, e subir a vaga para `proposta` é
deduzir etapa de conversa — o que o motor proíbe por nome.

O resto da busca está limpo, e o relatório tem de dizer isso em vez de inventar
achado:

- **ninguém é aposentado.** A vaga mais parada é a V-027, com doze dias; o
  teto é 45. A V-025 tem um contato que pediu silêncio, e **isso não aposenta
  a vaga** — o processo corre pelo portal
- **vaga sem contato não é defeito**, e não entra no `## Não bate`
- **`perfil.md`, `trajetoria.md` e `curriculos/**` estão em `nao_muda`**: são
  arquivos que uma skill que "arruma a busca" tem toda razão aparente para
  tocar. O `V-027-cv.md` está mais velho que a trajetória, e o conserto é de
  `/vagas:montar-curriculo` — aqui ele é, no máximo, uma linha dita

`pode_mudar` e `nao_muda` compartilham `_bruto/**` porque o sentido é
diferente: a skill pode CRIAR bruto novo e nunca ALTERAR o que já existia.
