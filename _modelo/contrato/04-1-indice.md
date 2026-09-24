### 4.1 · `INDICE.md`

O mapa e a configuração. Toda skill lê este arquivo antes de qualquer coisa.
Teto: **120 linhas**.

```markdown
# {Base} de <<preencher: nome fictício do profissional>>

{pasta-base}: local · <<preencher: um caminho de exemplo na pasta do usuário, terminando em {pasta-base}>>
modo: copiloto
atualizado: 2026-08-19

## Quem sou — é esta a voz das mensagens
nome: <<preencher: nome fictício>>
<<preencher: os campos de identidade do ofício — registro profissional, empresa, região, assinatura de e-mail>>

## Onde está o quê
hoje.md          o que vence, o que travou, o que prometeram e não mandaram
funil.md         quem está em que etapa, desde quando
{pasta-itens}/   _indice.md tem a lista; um arquivo por {item}
{pasta-pessoas}/ _indice.md tem a lista; um arquivo por {pessoa}
_bruto/          conversas coladas e documentos — a origem, não a verdade
arquivo-morto/   o que foi aposentado, com data e motivo

## Quanto tem (recontar ao gravar)
<<preencher: as contagens que o ofício olha — uma por linha, “rótulo: número”>>
aposentados: 0

## O que está conectado
Google Agenda: não
Gmail: não
Google Drive: não
WhatsApp: não

## Como eu trabalho
<<preencher: o que a skill segue sem perguntar de novo — canal padrão, horários, onde o profissional publica>>

## Pulado no começo
- nada.
```

`{pasta-base}:` é a linha da seção 1 — o transporte e o lugar. `modo:` é a linha
da seção 5. `## Quem sou` é o que assina as mensagens. `## Pulado no começo` é a
lista que `/{plugin}:comecar` deixa para depois, e qualquer skill pode oferecer
retomar um item dela — uma vez, sem insistir.

---
