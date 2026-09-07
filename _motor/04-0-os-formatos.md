## 4 · Os formatos, literais

Sete arquivos, sete gabaritos. O que vale como formato é o que está abaixo, e
`/{plugin}:comecar` copia os vazios de `modelos/`. Campo que não existe no
gabarito não se inventa: se o {profissional} trouxe um fato que não cabe em lugar nenhum, ele vai
para `## Histórico` com a data.

Nenhum arquivo da carteira tem frontmatter YAML. O cabeçalho é linha de
`campo: valor`, que o {profissional} lê sem saber que é um formato.

Os gabaritos ficam em `references/modelos/`, dentro da própria skill, e vão para
cá:

```
modelos/INDICE.md             → ~/carteira/INDICE.md
modelos/hoje.md               → ~/carteira/hoje.md
modelos/funil.md              → ~/carteira/funil.md
{modelos-do-oficio}
```

Cada modelo abre com um comentário `<!-- MODELO · … -->` explicando o que
preencher. **Ao gravar de verdade, esses comentários saem** — todos. Modelo que
chega ao {profissional} com o próprio manual dentro parece arquivo pela metade.

**E o mesmo vale para o que está entre `<` e `>`.** Os gabaritos marcam assim
o que se preenche: `<AAAA-MM-DD>`, `<nome do {profissional}>`, `<{exemplo-gabarito-item}>`. **Nenhum `<…>` chega ao {profissional}.** Ou vira o valor, ou vira `?`
pela regra do não-apurado (seção 3) — e data nunca vira `?`, porque a data de
hoje sempre se sabe.

Isto é regra e não zelo: medido montando uma carteira do zero, o `hoje.md`
nascia com `# Hoje — <AAAA-MM-DD>` e ficava assim, porque nenhum passo o toca
depois de copiá-lo. Os outros três só escapavam quando o {profissional} NÃO pulava
os passos que preenchem as vistas — e esses passos são puláveis. O comentário
some e o esqueleto do gabarito fica: o arquivo que ele abre todo dia começa
com um campo de formulário em branco.
