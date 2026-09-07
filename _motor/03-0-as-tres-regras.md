## 3 · As três regras

### Regra 1 · Se dá para derivar, não se duplica

O arquivo guarda **fato**; `_bruto/` guarda a **origem**. A conversa inteira
nunca entra no arquivo do {pessoa} — entra em `_bruto/`, e o arquivo fica com as
seis linhas que ela produziu.

Sem isso o arquivo cresce sem fim e a skill relê quarenta quilobytes para achar
um telefone. Os tetos da seção 9 são essa regra virada número.

Vista derivada (`_indice.md`, `funil.md`, `hoje.md`) pode repetir um campo do
arquivo — é para isso que ela serve. O que não pode é a vista virar a única
cópia de alguma coisa: tudo que está nela tem de existir no arquivo dono.

### Regra 2 · Nada entra sem procedência

Todo campo leva de onde veio e quando. O formato é fixo — valor, dois espaços,
seta, origem, vírgula, data:

```
preço: R$ 520.000  ← link, 2026-08-12
telefone: +55 51 99999-0000  ← _bruto/{exemplo-bruto}
área: 120 m²  ← ficha colada, 2026-08-12
prazo: quer mudar até dezembro  ← {profissional}, 2026-08-19
```

As origens possíveis, e não há outras:

```
link              a página do {item} que o {profissional} colou (a URL fica no campo link:)
ficha colada      o texto da ficha, quando o site não devolveu nada
_bruto/<arquivo>  conversa, e-mail ou documento que está em _bruto/
{profissional}          o próprio {profissional} disse agora, na conversa com a skill
{origens-do-oficio}
```

**O que não se apurou entra como `?`.** Nunca uma estimativa, nunca “por volta
de”, nunca um número de {item} parecido. O `?` pode levar na procedência o que
resolve ele:

```
{exemplos-de-interrogacao}
e-mail: ?
```

Campo inventado com cara de apurado é pior que campo vazio: o {profissional} repassa
para o {pessoa} e descobre {exemplo-onde-descobre}. E o `?` é a linha mais útil do arquivo —
é o que a próxima skill vai perguntar.

**Fato novo que contradiz o gravado:** o novo vale, com a procedência dele, e
o antigo desce para `## Histórico` com a procedência que tinha — nada se
apaga. Em copiloto a skill mostra os dois antes de trocar; em automático troca
e declara (seção 5).

Data sempre em `AAAA-MM-DD`. É a única forma que ordena sozinha e em que
`12/08` não vira agosto de um lado e dezembro do outro. Ao FALAR com o {profissional},
escreva `12 de agosto`; ao ESCREVER no arquivo, `2026-08-12`.

### Regra 3 · O que morre é aposentado com data e motivo

Gaveta, não lixeira. **Nenhuma skill apaga arquivo da carteira, nunca.**

Aposentar é isto, nesta ordem:

1. no alto do arquivo, logo abaixo do título, entra uma linha:
   `aposentado: 2026-08-19 · motivo: {exemplo-motivo-aposentado}`
2. o arquivo é movido para `arquivo-morto/{pasta-itens}/` ou `arquivo-morto/{pasta-pessoas}/`
3. no `_indice.md`, a linha sai da tabela de cima e entra em `## Arquivo morto`,
   com o desfecho em uma linha
4. some do `funil.md` e do `hoje.md`, que são vistas dos vivos

Quando aposentar, sem inventar outros critérios: {criterios-de-aposentar}. {Pessoa} parado há menos que isso
não é morto — é assunto de `/{plugin}:retomar-contato`.

Aposentar em modo automático é permitido para o prazo de {prazo-de-silencio}. Aposentar por
qualquer outro motivo é decisão do {profissional}, mesmo no automático.

---
