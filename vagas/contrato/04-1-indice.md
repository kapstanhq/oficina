### 4.1 · `INDICE.md`

O mapa e a configuração. Toda skill lê este arquivo antes de qualquer coisa.
Teto: **120 linhas**.

```markdown
# Busca de Rafael Duarte

busca: local · C:\Users\rafael\busca
modo: copiloto
atualizado: 2026-09-14

## Quem sou — é esta a voz das mensagens
nome: Rafael Duarte
o que eu faço: gerente de produto sênior, oito anos em fintech e logística
cidade: Florianópolis, SC
telefone: +55 48 90000-0101
e-mail: rafael@rafaelduarte.example
perfil profissional: https://linkedin.com/in/exemplo-rafael-duarte
portfólio: https://rafaelduarte.example
assinatura de e-mail: Rafael Duarte · gerente de produto · rafaelduarte.example

## Onde está o quê
perfil.md        o que procuro, o que aceito, o que descarto, quanto, e onde olhar
trajetoria.md    o que eu fiz, com os números que posso dizer — a fonte de todo currículo
hoje.md          o que vence, o que travou, o que prometeram e não mandaram
funil.md         que vaga está em que etapa, desde quando
vagas/           _indice.md tem a lista; um arquivo por vaga
contatos/        _indice.md tem a lista; um arquivo por pessoa — pode estar vazia
curriculos/      o currículo base e o de cada vaga. Derivados da trajetoria.md
cartas/          a carta de cada vaga que tem o campo, com o PDF — rascunho até você aprovar
_bruto/          o que as buscas devolveram, conversas, anúncios colados — a origem
arquivo-morto/   o que foi aposentado, com data e motivo

## Quanto tem (recontar ao gravar)
vagas novas, por julgar: 9
vagas salvas, por candidatar: 4
candidaturas em andamento: 6
contatos: 5
aposentadas: 31

## O que está conectado
fontes de vaga: sim  ← testado 2026-09-14
navegador: não — pulado no começo
Gmail: sim  ← testado 2026-09-14
Google Agenda: sim  ← testado 2026-09-14
WhatsApp: não
envio: pergunta sempre

## Como eu trabalho
canal padrão com contato: e-mail
canal padrão depois que responde: WhatsApp
horário que costumo oferecer para entrevista: terça a quinta, 9h às 11h ou depois das 16h
quantas candidaturas por dia: 3
quantas vagas por julgar no máximo: 30
envio de candidatura: eu aperto

## Pulado no começo
- ligar o navegador — 2026-09-14
```

`busca:` é a linha da seção 1 — o transporte e o lugar. `modo:` é a linha da
seção 5. `## Quem sou` é o que assina as mensagens e o cabeçalho de todo
currículo e carta — nome, cidade, e-mail, telefone, perfil profissional e
portfólio saem daqui, iguais —, e `o que eu faço:` é o que a primeira linha de
qualquer mensagem tem de conseguir dizer. `## Pulado no começo` é a lista que
`/vagas:comecar` deixa para depois, e qualquer skill pode oferecer retomar um
item dela — uma vez, sem insistir.

**`quantas candidaturas por dia:` é um teto, não uma meta.** Candidatura boa
custa uma hora de leitura e adaptação; dez por dia são dez candidaturas ruins.
Nenhuma skill o ultrapassa por achar que a fila está cheia.

**`quantas vagas por julgar no máximo:` segura a busca.** Fonte pública devolve
centenas de vagas, e pilha de cem por julgar é pilha que ninguém julga. Bateu
no teto, `/vagas:buscar-vagas` para de trazer e diz que a vez é de
`/vagas:triar-vagas`.

**`envio de candidatura:` decide quem aperta o botão de enviar.** `eu aperto`
é o padrão: a skill preenche e para com o botão na tela. `aperta depois de eu
aprovar no painel` deixa que ela aperte — depois do seu sim àquela
candidatura, uma por vez, com a tela inteira lida antes. O aviso do risco de
conta aparece UMA vez, no ato de trocar a linha, e a seção 12.1 diz o que não
muda de um regime para o outro. **Ela não é a linha `modo:`**: o modo decide
quanto a skill pergunta no caminho, e esta decide quem aperta.

**A pretensão NÃO mora aqui.** Ela está no `perfil.md`, e a razão é de uso: o
`INDICE.md` é o arquivo que mais aparece em tela compartilhada.
