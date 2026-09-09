<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 10 · Como uma skill começa e termina

### Começa

1. lê `~/carteira/INDICE.md`. Não existe: uma linha e `/corretor:comecar`
2. lê a linha `modo:`
3. desce a ordem de busca da seção 8 até ter o que precisa
4. tarefa de **três ou mais passos demorados**: mostra o TODO na tela.
   Demorado é passo que abre link, lê muitos arquivos ou escreve mais de um
   arquivo. Três edições de uma linha não são um TODO — são uma frase.

### Termina

Nesta ordem. **O `## Guardei` é obrigatório e não some nunca**; as outras duas
só aparecem se tiverem conteúdo.

Não gravou nada — porque não havia o que gravar, porque não há carteira, ou
porque o que ela ia fazer não deu certo? Então o `## Guardei` traz uma linha
dizendo isso, com o motivo:

```markdown
## Guardei
- nada foi gravado — não havia o que guardar nesta rodada
```

Omitir a seção é o que faz o corretor achar que ficou guardado, e a regra
aqui é a mesma do "escreveu, diz onde", virada do avesso: **ele precisa saber
que NÃO ficou.** E o título é este, sempre — `## Não gravei nada` e
`## Nada foi guardado` são títulos inventados, e título inventado é o que a
seção 4 proíbe. Medido: duas das dez inventaram o próprio na primeira
execução da prova, as duas por terem feito a coisa certa e nomeado errado.

**Cinco skills não têm bloco para colar, e a razão é a mesma nas cinco: o
trabalho delas não é um texto para o cliente.**

```
/corretor:comecar              o trabalho é a configuração
/corretor:o-que-fazer-hoje     o trabalho é a lista do dia
/corretor:organizar-carteira   o trabalho é o relatório do que mudou
/corretor:laudo-da-carteira    o trabalho é o laudo, e ele não sai daqui
/corretor:importar-a-conversa  o trabalho é o relatório do que entrou
```

**Quatro delas acrescentam seção ao fecho, e a seção acrescentada É o
trabalho.** Na `comecar` o lugar do bloco é ocupado por `## O que ficou pronto`,
mais `## Ficou para depois` e `## O que pedir agora`. A `organizar-carteira`
traz os títulos do que tocou. O `laudo-da-carteira` traz um título por pergunta
da régua, e a `importar-a-conversa` um por destino do que leu — inclusive o do
que ela **não** leu, que é o mais importante dos dela.

**Fora essas quatro, nenhuma skill acrescenta seção ao fecho**, e nenhuma das
cinco oferece a segunda saída da seção 7.1, porque não há mensagem para mandar.

A ordem dos três títulos fixos não muda em nenhuma delas: o que a skill
acrescenta vem ANTES do `## Guardei`, nunca entre ele e o `## Falta saber`.

```markdown
<o trabalho — o bloco para colar, sozinho, sem comentário dentro>

## Guardei
- ~/carteira/imoveis/V-071-casa-3d-azenha.md — criado
- ~/carteira/imoveis/_indice.md — uma linha nova
- ~/carteira/_bruto/2026-08-12-whatsapp-joana.md — a conversa, como veio

## Falta saber
- condomínio do V-071 (casa 3 dorm, Azenha) — pedi ao proprietário em 2026-08-13
- se o marido da C-017 (Joana Ribeiro) pode sábado

## Decidi sozinho
- <só em modo automático · o que fiz — por que — como desfazer>
```

**O bloco vai em cerca de código, e NUNCA dentro de moldura desenhada.** Uma
caixa de `┌─┐` parece organizada na tela e é armadilha: o corretor seleciona,
copia e leva as bordas junto para dentro do WhatsApp do cliente. A cerca de
código dá o botão de copiar e devolve só o texto. Vale para tudo o que existe
para sair daqui e ir para outro lugar — mensagem, anúncio, roteiro, legenda,
título de evento. Nada de traço de enfeite antes ou depois, nada de `>` de
citação, nada de “copie o texto abaixo:” dentro do bloco.

Os três títulos são exatamente estes. **Escreveu na carteira, diz onde**: o
corretor precisa saber onde a coisa foi parar para confiar que ela está lá.

`## Falta saber` é a regra 2 aparecendo: são os `?` que esta execução criou ou
não conseguiu resolver. É a lista que a próxima skill vai atacar.

### O que nenhuma skill faz

- inventar dado de imóvel, de cliente ou de valor — `?` sempre bate palpite
- apagar arquivo da carteira, ou editar `_bruto/`
- criar campo, seção, etapa ou nome de arquivo fora deste contrato
- mandar mensagem **sozinha**: sem conector ela escreve e quem manda é o
  corretor; com conector ela manda uma por vez, e só depois de ele ver o texto
  e o nome de quem recebe (seção 7.1)
- falar em nome da Kapstan na mensagem que sai para o cliente
- decidir preço, decidir se aceita proposta, ou dizer que um documento está em
  ordem — isso é do corretor, e a skill diz o que olhar
- prometer prazo de financiamento, de cartório ou de prefeitura

### A língua

Português do Brasil, do jeito que o corretor fala. Frase curta, imperativo
direto, zero hype. “Lead” fica, porque é a palavra que ele usa todo dia.
Aspas curvas “ ”, travessão —, e nada de emoji no que a skill diz.

Quando a skill não conseguir fazer algo, ela diz em uma linha o que não deu e
qual é o caminho — não pede desculpa duas vezes e não some do assunto.

---
