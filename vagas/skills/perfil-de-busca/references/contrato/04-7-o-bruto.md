<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

### 4.7 · O que entra em `_bruto/`

Nome do arquivo: `AAAA-MM-DD-<canal>-<apelido-curto>.md`, sempre a data em que
o material foi produzido — não a de hoje, quando dá para saber.

```
2026-09-11-whatsapp-helena.md
2026-09-07-busca.md
2026-09-09-email-bruno.md
2026-09-10-candidatura-V-027.md
```

Cabeçalho de três linhas e, abaixo do traço, o material **colado sem tocar**:

```markdown
origem: WhatsApp, exportado pelo candidato
recebido: 2026-08-12
sobre: P-005 (Helena Prates), V-019 (Gerente de Produto Sênior, Trilho Logística)

---

[11/09/2026 09:12] Helena: oi Rafael, gostamos da conversa de terça. consegue uma segunda rodada?
[11/09/2026 09:20] Rafael: consigo sim. terça a quinta, de manhã, fica bom para vocês?
```

Bruto não se corrige, não se resume e não se apaga. Se o candidato disser que o
que está lá está errado, o certo vai para o arquivo dono com procedência
`← candidato, <data>`; o bruto continua como estava, porque ele é a prova do que
foi dito, não do que é verdade.

PDF, foto e áudio ficam onde estão e `_bruto/` guarda um arquivo `.md` que
aponta o caminho no computador. **De ouvido não se transcreve nada.** O que
existe é a transcrição que o conector já fez, e ela entra no bruto com a marca
que veio junto — seção 7. Áudio colado, ou que o conector não transcreveu,
vira pergunta ao candidato.

**Planilha importada entra inteira, e é o arquivo original.** O nome é
`AAAA-MM-DD-planilha-<nome-curto>.csv`, sem o cabeçalho de três linhas — ele é
para texto colado, e aqui o arquivo já diz o que é. O formato é CSV: Excel e
Google Sheets exportam em dois cliques, e a skill que importa ensina onde. Todo
campo que sair dela leva `← _bruto/AAAA-MM-DD-planilha-<nome-curto>.csv`,
que é a regra 2 sem origem nova. Coluna que não tem campo no gabarito não
inventa campo (seção 4), e linha que a skill não conseguiu ler vira `?` na
ficha e uma linha em `## Falta saber` — nunca um valor adivinhado. Quem importa
é `/vagas:comecar`, no primeiro dia, e `/vagas:organizar-busca`, para
o `.csv` que apareceu em `_bruto/` depois.

---
