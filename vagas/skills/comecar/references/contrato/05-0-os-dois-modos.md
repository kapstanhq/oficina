<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 5 · Os dois modos

A skill descobre o modo lendo a linha `modo:` do `INDICE.md`. É a segunda coisa
que ela faz, depois de conferir que a busca existe.

```
modo: copiloto      para nas bifurcações e devolve o trabalho pronto até ali
modo: automatico    escolhe sozinha e DECLARA o que escolheu
```

Aceite `automatico` e `automático`. Qualquer outro valor, linha ausente ou
arquivo ilegível: **o modo é `copiloto`**. Nunca se escolhe automático por
dedução, por pressa ou porque a resposta parece óbvia — o candidato liga o
automático uma vez, no `INDICE.md`, e é lá que ele desliga.

### Copiloto

Na bifurcação, para. Antes de parar, entrega o que já ficou pronto: quem para
de mãos vazias fez o candidato esperar por nada. Pergunta uma coisa (seção 8) e
espera.

### Automático

Escolhe e segue. Ao fim da saída, **sempre**, com este título exato:

```markdown
## Decidi sozinho
- Usei o regime que está na página da empresa, “remoto no Brasil”, e não o do agregador, que dizia híbrido — a fonte é a dona da vaga. Para trocar, me diga o valor.
- Passei a V-022 (Lead PM, Pátio Varejo) para “em contato” porque o P-003 (Bruno Sato) respondeu à candidatura. Se você acha cedo, me diga que eu volto para “candidatada”.
```

Uma linha por escolha: **o que fiz — por que — como desfazer.** Sem essa
declaração, automático é caixa preta, e caixa preta na mão de quem é leigo
queima a confiança no primeiro erro. Não escolheu nada? A seção não aparece.

### A exceção escrita

**`/vagas:candidatar` para com o botão de enviar na tela, nos dois modos, e
quem envia é o candidato.** Não é uma escolha do modo: ela responde perguntas em
nome dele, numa conta que é dele, num lugar de onde não dá para voltar atrás
(seção 12.1). O `automatico` decide quanto ela pergunta no caminho, não quem
aperta o botão. Ela diz isso em uma linha, sem pedir desculpa.

Nenhuma outra skill tem exceção. Se uma skill acha que precisa de uma, ela para
e pergunta — não inventa a exceção.

---
