<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 4.8 · A vista, que é a carteira vista de fora

A carteira é do corretor e mora com ele. **A vista é o pedaço dela que uma
pessoa de fora pode ver** — e é a única coisa da carteira que sai do computador.

```
~/carteira/
  vistas/
    C-017-joana-ribeiro.md      uma vista por cliente, o mesmo id e o mesmo apelido
```

### Ela é DERIVADA, e é por isso que ela existe

Nada se escreve numa vista à mão. Ela é montada a partir dos arquivos donos, do
`funil.md` e do `hoje.md`, e é refeita inteira a cada execução — como o
`_indice.md` e o `funil.md`, e pela mesma razão: **duas fontes divergem na
primeira correção**, e aqui a divergência seria visível para alguém de fora.

Consequência prática: **apagar a vista não perde nada.** Se ela sumir, a próxima
execução a refaz. É o que a torna segura de compartilhar.

### O que entra, e o que nunca entra

| entra | nunca entra |
|---|---|
| o que está pendente, com dono e data | qualquer coisa de `_bruto/` |
| o que já foi entregue, com data | o que outra cliente disse ou fez |
| o que foi combinado, nas palavras do combinado | preço de custo, margem, comissão |
| o que falta decidir, e de quem é a decisão | o `?` que é dúvida interna do corretor |
| o link do que já é público | anotação de estratégia, ou de como negociar |

**A regra que resolve o caso duvidoso:** entra o que essa pessoa **já sabe ou já
deveria saber**. A vista não conta nada de novo — ela organiza o que já foi
combinado com ela. Se uma linha da vista pode surpreender quem a lê, ela está no
arquivo errado.

**O `_bruto/` nunca sai, em nenhuma hipótese.** Ele é a conversa inteira, o
e-mail encaminhado, o documento de terceiro. A vista é derivada dele, e derivar
é justamente o que separa o que pode sair do que não pode.

### O formato

```markdown
# o que falta para fechar o negócio — quem entrega cada documento, e o que já chegou

Atualizado em 2026-09-09 por corretor.

## Falta

- [ ] <o quê> — com <quem> — pedido em <data>
- [x] <o que já chegou> — em <data>

## Combinado

- <uma linha por combinado, com a data em que foi combinado>

## Onde estamos

<uma linha, em português, sem jargão de etapa>
```

`## Falta` é a única seção obrigatória: uma vista sem pendência é uma vista que
diz "nada com você agora", e isso também é informação.

**Sem etapa de funil, sem id solto e sem sigla.** `V-071 (casa 3 dorm, Azenha)` vira o
apelido; a etapa vira uma frase. Quem lê a vista não conhece o vocabulário da
carteira, e não deveria precisar conhecer.

### Quem escreve, e quem lê

Escreve o corretor, sempre — pela skill. **Quem recebe tem acesso de
leitura, nunca de escrita.** Duas pessoas escrevendo no mesmo arquivo é o
momento em que a carteira deixa de ter dono, e o contrato inteiro se apoia em
ela ter um.

Se a pessoa de fora responder, ela responde pelo canal de sempre — e aquilo
entra em `_bruto/` como qualquer conversa.

---
