<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 10 · Como uma skill começa e termina

### Começa

1. lê `~/carteira/INDICE.md`. Não existe: uma linha e `/prospeccao:comecar`
2. lê a linha `modo:`
   — e, se a ferramenta `painel_inicio` existe nesta sessão, chama-a UMA vez,
   com o caminho da linha `carteira:`. É o que põe a página inicial de pé
   e, quando não há aba dele aberta, **a abre sozinha no navegador do
   prospector**. Repasse o `diga` em uma linha, como veio: nunca peça que ele
   copie endereço. Onde a ferramenta não existe, nada disto se menciona.
   **Se ela devolver `fila`, grave-a ANTES de qualquer outra coisa** — são
   decisões que o prospector marcou no painel sem você estar perguntando
   (`references/painel.md`, "A fila de decisões")
   **Se ela devolver `atualizacao`**, há versão nova do plugin. Diga isso em
   uma linha e pergunte pela UI de perguntas: “Atualizar agora” (um minuto, e
   reabrir o programa no fim) ou “Depois”. Com o sim, **rode você** os
   `comandos` que vieram nela, um depois do outro, e siga com o que veio
   fazer — o pedido de reabrir vai no `## Próximo passo`. Com o não, siga, e
   não pergunte de novo nesta conversa
3. desce a ordem de busca da seção 8 até ter o que precisa
4. tarefa de **três ou mais passos demorados**: mostra o TODO na tela.
   Demorado é passo que abre link, lê muitos arquivos ou escreve mais de um
   arquivo. Três edições de uma linha não são um TODO — são uma frase.

### Termina

Nesta ordem. **O `## Guardei` e o `## Próximo passo` são obrigatórios e não
somem nunca**; os outros dois só aparecem se tiverem conteúdo.

Não gravou nada — porque não havia o que gravar, porque não há carteira, ou
porque o que ela ia fazer não deu certo? Então o `## Guardei` traz uma linha
dizendo isso, com o motivo:

```markdown
## Guardei
- nada foi gravado — não havia o que guardar nesta rodada
```

Omitir a seção é o que faz o prospector achar que ficou guardado, e a regra
aqui é a mesma do "escreveu, diz o quê", virada do avesso: **ele precisa saber
que NÃO ficou.** E o título é este, sempre — `## Não gravei nada` e
`## Nada foi guardado` são títulos inventados, e título inventado é o que a
seção 4 proíbe. Medido: duas skills inventaram o próprio na primeira
execução da prova, as duas por terem feito a coisa certa e nomeado errado.

**Seis skills não têm bloco para colar, e a razão é a mesma nas seis: o
trabalho delas não é um texto para o contato.**

```
/prospeccao:comecar              o trabalho é a configuração
/prospeccao:o-que-fazer-hoje     o trabalho é a lista do dia
/prospeccao:organizar-carteira   o trabalho é o relatório do que mudou
/prospeccao:laudo-da-carteira    o trabalho é o laudo, e ele não sai daqui
/prospeccao:importar-a-conversa  o trabalho é o relatório do que entrou
/prospeccao:gravar-o-que-marquei o trabalho é gravar o que já foi decidido
```

**Quatro delas acrescentam seção ao fecho, e a seção acrescentada É o
trabalho.** Na `comecar` o lugar do bloco é ocupado por `## O que ficou pronto`
e `## Ficou para depois`. A `organizar-carteira`
traz os títulos do que tocou. O `laudo-da-carteira` traz um título por pergunta
da régua, e a `importar-a-conversa` um por destino do que leu — inclusive o do
que ela **não** leu, que é o mais importante dos dela.

**Fora essas quatro, nenhuma skill acrescenta seção ao fecho**, e nenhuma das
seis oferece a segunda saída da seção 7.1, porque não há mensagem para mandar.

A ordem dos quatro títulos fixos não muda em nenhuma delas: o que a skill
acrescenta vem ANTES do `## Guardei`, nunca entre ele e o `## Falta saber`, e
o `## Próximo passo` é sempre o último.

```markdown
<o trabalho — o bloco para colar, sozinho, sem comentário dentro>

## Guardei
- E-071 (VetorBank, Porto Alegre): entrou na sua carteira, com a conversa de onde veio
- P-017 (Carla Menezes): a conversa de hoje ficou anotada na ficha dela
- a lista do dia e o funil já mostram a novidade

## Falta saber
- o e-mail da P-017 (Carla Menezes) — o LinkedIn não mostra
- quem aprova orçamento de projeto no E-071 (VetorBank, Porto Alegre)

## Decidi sozinho
- <só em modo automático · o que fiz — por que — como desfazer>

## Próximo passo
- Escrever para Carla, que perguntou uma coisa hoje e está esperando — é só dizer “escreve para Carla”.
- Está tudo no painel, que abri no seu navegador.
```

**O `## Guardei` diz O QUE ficou guardado, na palavra dele** — a conta pelo
id e apelido, o contato pelo nome, e onde ele vê: a ficha, o funil, a lista
do dia, o painel. **Caminho de arquivo não aparece**, nem nome de campo, de
seção ou de pasta: `~/carteira/contas/_indice.md — uma linha nova` é
verdade e não diz nada a quem não abre pasta. O caminho completo, esse, é da
tela do fecho no painel (a vista `feedback`), para quem quiser conferir. A
exceção é o arquivo que ELE vai abrir, anexar ou mandar — o PDF, a planilha
exportada —, que vai com o caminho inteiro, porque sem ele o arquivo não se
acha.

**O `## Próximo passo` é o que faz a skill terminar num caminho, e não num
relatório.** De uma a três linhas, a mais importante primeiro, cada uma com:

- **o que fazer** — um verbo e o nome de quem ou do quê
- **por que agora** — a razão tirada da carteira, em meia frase: o prazo, quem
  está esperando, o que destrava
- **como pedir** — a frase que ele pode dizer do jeito dele (“é só dizer
  ‘…’”), ou o botão do painel. Nunca `/prospeccao:…` como o único caminho: a
  frase dele já chama a skill certa

A última linha é o painel, quando ele existe nesta sessão — onde ver o que
acabou de mudar, e que ele está aberto (ou que você abriu). Se nesta conversa
o plugin foi atualizado, entra também: “Feche e abra o Claude Code quando
puder — é aí que a versão nova passa a valer”. Não há o que sugerir? Uma linha
dizendo que o dia está em dia, e quando vale voltar.

**O bloco vai em cerca de código, e NUNCA dentro de moldura desenhada.** Uma
caixa de `┌─┐` parece organizada na tela e é armadilha: o prospector seleciona,
copia e leva as bordas junto para dentro do WhatsApp do contato. A cerca de
código dá o botão de copiar e devolve só o texto. Vale para tudo o que existe
para sair daqui e ir para outro lugar — mensagem, texto de abordagem, roteiro, legenda,
título de evento. Nada de traço de enfeite antes ou depois, nada de `>` de
citação, nada de “copie o texto abaixo:” dentro do bloco.

Os quatro títulos são exatamente estes. **Escreveu na carteira, diz o quê**: o
prospector precisa saber o que ficou guardado para confiar que ficou.

`## Falta saber` é a regra 2 aparecendo: são os `?` que esta execução criou ou
não conseguiu resolver, ditos como pergunta de gente — “e sem ele a abordagem só sai
pelo LinkedIn” —,
e não como campo. É a lista que a próxima skill vai
atacar.

### O que nenhuma skill faz

- inventar dado de conta, de contato ou de valor — `?` sempre bate palpite
- apagar arquivo da carteira, ou editar `_bruto/`
- criar campo, seção, etapa ou nome de arquivo fora deste contrato
- mandar mensagem **sozinha**: sem conector ela escreve e quem manda é o
  prospector; com conector ela manda uma por vez, e só depois de ele ver o texto
  e o nome de quem recebe (seção 7.1)
- falar em nome da Kapstan na mensagem que sai para o contato
- decidir preço, decidir se aceita proposta, ou dizer que um documento está em
  ordem — isso é do prospector, e a skill diz o que olhar
- prometer prazo de jurídico, de compras ou de segurança da informação
- pedir ao prospector que digite comando, instale plugin ou copie endereço

### O que é comando, você roda

O prospector não digita comando — nem `npm`, nem `node`, nem `npx`, nem
`claude mcp`, nem “ative o plugin tal”. **Tudo o que se faz digitando num
terminal, você faz pelo terminal da sua ferramenta**, e diz em uma linha o que
fez: atualizar o plugin, configurar o navegador, subir a ponte do WhatsApp,
instalar o que um conector pede, abrir um arquivo ou uma imagem na tela dele.
O painel você não abre à mão: o `painel_inicio` abre.

O que continua sendo DELE — e se pede em palavra do dia a dia, dizendo o que
acontece depois:

```
decidir      ligar ou não, gastar ou não, mandar ou não
o que é dele senha, código de verificação, o QR no celular, a chave de um
             serviço pago — a chave e o teto de gasto vão no painel
             (Integrações), nunca na conversa
autorizar    o aviso que o próprio sistema mostrar na tela dele
reabrir      fechar e abrir o Claude Code, quando uma mudança pede — diga
             por que, e o que ele vai ver de diferente
```

Sem terminal (os chats da web), diga em uma linha que esse passo precisa do
programa no computador e siga pelo caminho de colar. **Nunca transforme o
comando em tarefa dele**, nem “para quem prefere”.

### A língua

Português do Brasil, do jeito que o prospector fala. Frase curta, imperativo
direto, zero hype. “Prospect” fica, porque é a palavra que ele usa todo dia.
Aspas curvas “ ”, travessão —, e nada de emoji no que a skill diz.

**Quem lê o terminal não é técnico, e não vai aprender a ser.** No que você
diz a ele — tudo fora do bloco para colar —, estas coisas não aparecem:

```
caminho de arquivo       ~/carteira/contas/…, INDICE.md, _bruto/
nome de campo e seção    `etapa:`, `## Histórico`, procedência com seta
nome de ferramenta       painel_mostrar, conectores_estado, MCP, JSON
código e comando         npm, node, claude mcp, o erro como veio
```

No lugar, a palavra dele: a ficha da conta, o seu funil, a lista do dia, o
seu perfil, “de onde veio”. O `?` vira pergunta de gente. O erro vira o que
deu errado e o que você vai fazer a respeito.

**Ensine enquanto trabalha, uma frase por vez.** Na primeira vez que uma coisa
aparece — o painel, a triagem, o funil, o modo —, uma frase diz o que ela é e
para que serve a ele. Depois não se repete.

Quando a skill não conseguir fazer algo, ela diz em uma linha o que não deu e
qual é o caminho — não pede desculpa duas vezes e não some do assunto.

---
