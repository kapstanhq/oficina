<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

### 4.7 · O que entra em `_bruto/`

Nome do arquivo: `AAAA-MM-DD-<canal>-<apelido-curto>.md`, sempre a data em que
o material foi produzido — não a de hoje, quando dá para saber.

```
2026-08-12-whatsapp-joana.md
2026-08-12-ficha-8812.md
2026-08-17-email-almeida.md
2026-08-18-matricula-44812.md
```

Cabeçalho de três linhas e, abaixo do traço, o material **colado sem tocar**:

```markdown
origem: WhatsApp, exportado pelo corretor
recebido: 2026-08-12
sobre: C-017 (Joana Ribeiro), V-071 (casa 3 dorm, Azenha)

---

[12/08/2026 14:32] Joana: oi, vi a casa da Azenha no Zap, ainda tem?
[12/08/2026 14:40] Marcelo: tem sim! quer ver no sábado?
```

Bruto não se corrige, não se resume e não se apaga. Se o corretor disser que o
que está lá está errado, o certo vai para o arquivo dono com procedência
`← corretor, <data>`; o bruto continua como estava, porque ele é a prova do que
foi dito, não do que é verdade.

PDF, foto e áudio ficam onde estão e `_bruto/` guarda um arquivo `.md` que
aponta o caminho no computador. Áudio não se transcreve de ouvido: se o que
importa está num áudio, pergunte ao corretor o que ele diz.

**Planilha importada entra inteira, e é o arquivo original.** O nome é
`AAAA-MM-DD-planilha-<nome-curto>.csv`, sem o cabeçalho de três linhas — ele é
para texto colado, e aqui o arquivo já diz o que é. O formato é CSV: Excel e
Google Sheets exportam em dois cliques, e a skill que importa ensina onde. Todo
campo que sair dela leva `← _bruto/AAAA-MM-DD-planilha-<nome-curto>.csv`,
que é a regra 2 sem origem nova. Coluna que não tem campo no gabarito não
inventa campo (seção 4), e linha que a skill não conseguiu ler vira `?` na
ficha e uma linha em `## Falta saber` — nunca um valor adivinhado. Quem importa
é `/corretor:comecar`, no primeiro dia, e `/corretor:organizar-carteira`, para
o `.csv` que apareceu em `_bruto/` depois.

---
