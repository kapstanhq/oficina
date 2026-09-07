<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 5 · Os dois modos

A skill descobre o modo lendo a linha `modo:` do `INDICE.md`. É a segunda coisa
que ela faz, depois de conferir que a carteira existe.

```
modo: copiloto      para nas bifurcações e devolve o trabalho pronto até ali
modo: automatico    escolhe sozinha e DECLARA o que escolheu
```

Aceite `automatico` e `automático`. Qualquer outro valor, linha ausente ou
arquivo ilegível: **o modo é `copiloto`**. Nunca se escolhe automático por
dedução, por pressa ou porque a resposta parece óbvia — o corretor liga o
automático uma vez, no `INDICE.md`, e é lá que ele desliga.

### Copiloto

Na bifurcação, para. Antes de parar, entrega o que já ficou pronto: quem para
de mãos vazias fez o corretor esperar por nada. Pergunta uma coisa (seção 8) e
espera.

### Automático

Escolhe e segue. Ao fim da saída, **sempre**, com este título exato:

```markdown
## Decidi sozinho
- Usei o preço do link, R$ 520.000, e não o que estava na conversa de junho — o link é mais novo. Para trocar, me diga o valor.
- Marquei a Joana como “visita marcada” porque ela aceitou o sábado. Se ela ainda não confirmou, me diga que eu volto para “em conversa”.
```

Uma linha por escolha: **o que fiz — por que — como desfazer.** Sem essa
declaração, automático é caixa preta, e caixa preta na mão de quem é leigo
queima a confiança no primeiro erro. Não escolheu nada? A seção não aparece.

### A exceção escrita

**`/corretor:conferir-matricula` nunca opera em automático.** Mesmo com
`modo: automatico` no `INDICE.md`, ela lista o que pode travar a venda e para;
quem conclui é gente. Ela diz isso em uma linha, sem pedir desculpa: quem
escolheu automático escolheu para o anúncio, não para a matrícula.

Nenhuma outra skill tem exceção. Se uma skill acha que precisa de uma, ela para
e pergunta — não inventa a exceção.

---
