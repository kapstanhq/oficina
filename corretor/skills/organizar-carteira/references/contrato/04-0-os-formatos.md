<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 4 · Os formatos, literais

Sete arquivos, sete gabaritos. O que vale como formato é o que está abaixo, e
`/corretor:comecar` copia os vazios de `modelos/`. Campo que não existe no
gabarito não se inventa: se o corretor trouxe um fato que não cabe em lugar nenhum, ele vai
para `## Histórico` com a data.

Nenhum arquivo da carteira tem frontmatter YAML. O cabeçalho é linha de
`campo: valor`, que o corretor lê sem saber que é um formato.

Os gabaritos ficam em `references/modelos/`, dentro da própria skill, e vão para
cá:

```
modelos/INDICE.md             → ~/carteira/INDICE.md
modelos/hoje.md               → ~/carteira/hoje.md
modelos/funil.md              → ~/carteira/funil.md
modelos/_indice-imoveis.md    → ~/carteira/imoveis/_indice.md
modelos/_indice-clientes.md   → ~/carteira/clientes/_indice.md
modelos/imovel.md             → ~/carteira/imoveis/<id>-<apelido>.md   (um por imóvel)
modelos/cliente.md            → ~/carteira/clientes/<id>-<apelido>.md  (um por cliente)
```

Cada modelo abre com um comentário `<!-- MODELO · … -->` explicando o que
preencher. **Ao gravar de verdade, esses comentários saem** — todos. Modelo que
chega ao corretor com o próprio manual dentro parece arquivo pela metade.

**E o mesmo vale para o que está entre `<` e `>`.** Os gabaritos marcam assim
o que se preenche: `<AAAA-MM-DD>`, `<nome do corretor>`, `<V-000 (apelido,
bairro)>`. **Nenhum `<…>` chega ao corretor.** Ou vira o valor, ou vira `?`
pela regra do não-apurado (seção 3) — e data nunca vira `?`, porque a data de
hoje sempre se sabe.

Isto é regra e não zelo: medido montando uma carteira do zero, o `hoje.md`
nascia com `# Hoje — <AAAA-MM-DD>` e ficava assim, porque nenhum passo o toca
depois de copiá-lo. Os outros três só escapavam quando o corretor NÃO pulava
os passos que preenchem as vistas — e esses passos são puláveis. O comentário
some e o esqueleto do gabarito fica: o arquivo que ele abre todo dia começa
com um campo de formulário em branco.
