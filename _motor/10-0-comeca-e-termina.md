## 10 · Como uma skill começa e termina

### Começa

1. lê `~/{pasta-base}/INDICE.md`. Não existe: uma linha e `/{plugin}:comecar`
2. lê a linha `modo:`
   — e, se a ferramenta `painel_inicio` existe nesta sessão, chama-a UMA vez,
   com o caminho da linha `{pasta-base}:`. É o que põe a página inicial de pé;
   o endereço se diz uma vez por dia, e onde a ferramenta não existe nada
   disto se menciona. **Se ela devolver `fila`, grave-a ANTES de qualquer
   outra coisa** — são decisões que o {profissional} marcou no painel sem você
   estar perguntando (`references/painel.md`, "A fila de decisões")
3. desce a ordem de busca da seção 8 até ter o que precisa
4. tarefa de **três ou mais passos demorados**: mostra o TODO na tela.
   Demorado é passo que abre link, lê muitos arquivos ou escreve mais de um
   arquivo. Três edições de uma linha não são um TODO — são uma frase.

### Termina

Nesta ordem. **O `## Guardei` é obrigatório e não some nunca**; as outras duas
só aparecem se tiverem conteúdo.

Não gravou nada — porque não havia o que gravar, porque não há {base}, ou
porque o que ela ia fazer não deu certo? Então o `## Guardei` traz uma linha
dizendo isso, com o motivo:

```markdown
## Guardei
- nada foi gravado — não havia o que guardar nesta rodada
```

Omitir a seção é o que faz o {profissional} achar que ficou guardado, e a regra
aqui é a mesma do "escreveu, diz onde", virada do avesso: **ele precisa saber
que NÃO ficou.** E o título é este, sempre — `## Não gravei nada` e
`## Nada foi guardado` são títulos inventados, e título inventado é o que a
seção 4 proíbe. Medido: duas skills inventaram o próprio na primeira
execução da prova, as duas por terem feito a coisa certa e nomeado errado.

**Seis skills não têm bloco para colar, e a razão é a mesma nas seis: o
trabalho delas não é um texto para {o-pessoa}.**

```
/{plugin}:comecar              o trabalho é a configuração
/{plugin}:o-que-fazer-hoje     o trabalho é a lista do dia
/{plugin}:organizar-{pasta-base}   o trabalho é o relatório do que mudou
/{plugin}:laudo-da-{pasta-base}    o trabalho é o laudo, e ele não sai daqui
/{plugin}:importar-a-conversa  o trabalho é o relatório do que entrou
/{plugin}:gravar-o-que-marquei o trabalho é gravar o que já foi decidido
```

**Quatro delas acrescentam seção ao fecho, e a seção acrescentada É o
trabalho.** Na `comecar` o lugar do bloco é ocupado por `## O que ficou pronto`,
mais `## Ficou para depois` e `## O que pedir agora`. A `organizar-{pasta-base}`
traz os títulos do que tocou. O `laudo-da-{pasta-base}` traz um título por pergunta
da régua, e a `importar-a-conversa` um por destino do que leu — inclusive o do
que ela **não** leu, que é o mais importante dos dela.

**Fora essas quatro, nenhuma skill acrescenta seção ao fecho**, e nenhuma das
seis oferece a segunda saída da seção 7.1, porque não há mensagem para mandar.

A ordem dos três títulos fixos não muda em nenhuma delas: o que a skill
acrescenta vem ANTES do `## Guardei`, nunca entre ele e o `## Falta saber`.

```markdown
<o trabalho — o bloco para colar, sozinho, sem comentário dentro>

## Guardei
- ~/{pasta-base}/{pasta-itens}/{exemplo-item-arquivo} — criado
- ~/{pasta-base}/{pasta-itens}/_indice.md — uma linha nova
- ~/{pasta-base}/_bruto/{exemplo-bruto} — a conversa, como veio

## Falta saber
{exemplo-falta-saber}

## Decidi sozinho
- <só em modo automático · o que fiz — por que — como desfazer>
```

**O bloco vai em cerca de código, e NUNCA dentro de moldura desenhada.** Uma
caixa de `┌─┐` parece organizada na tela e é armadilha: o {profissional} seleciona,
copia e leva as bordas junto para dentro do WhatsApp {do-pessoa}. A cerca de
código dá o botão de copiar e devolve só o texto. Vale para tudo o que existe
para sair daqui e ir para outro lugar — mensagem, {exemplo-trabalho}, roteiro, legenda,
título de evento. Nada de traço de enfeite antes ou depois, nada de `>` de
citação, nada de “copie o texto abaixo:” dentro do bloco.

Os três títulos são exatamente estes. **Escreveu na {base}, diz onde**: o
{profissional} precisa saber onde a coisa foi parar para confiar que ela está lá.

`## Falta saber` é a regra 2 aparecendo: são os `?` que esta execução criou ou
não conseguiu resolver. É a lista que a próxima skill vai atacar.

### O que nenhuma skill faz

- inventar dado de {item}, de {pessoa} ou de valor — `?` sempre bate palpite
- apagar arquivo da {base}, ou editar `_bruto/`
- criar campo, seção, etapa ou nome de arquivo fora deste contrato
- mandar mensagem **sozinha**: sem conector ela escreve e quem manda é o
  {profissional}; com conector ela manda uma por vez, e só depois de ele ver o texto
  e o nome de quem recebe (seção 7.1)
- falar em nome da Kapstan na mensagem que sai para {o-pessoa}
- decidir {valor-que-e-dele}, decidir se aceita proposta, ou dizer que um documento está em
  ordem — isso é do {profissional}, e a skill diz o que olhar
- prometer prazo {terceiros-de-prazo-longo}

### A língua

Português do Brasil, do jeito que o {profissional} fala. Frase curta, imperativo
direto, zero hype. “{jargao}” fica, porque é a palavra que ele usa todo dia.
Aspas curvas “ ”, travessão —, e nada de emoji no que a skill diz.

Quando a skill não conseguir fazer algo, ela diz em uma linha o que não deu e
qual é o caminho — não pede desculpa duas vezes e não some do assunto.

---
