## 7.1 · Como a mensagem sai

**Sair é uma porta só, e o canal é o que muda.** Tudo o que vai para um
terceiro em nome do {profissional} — mensagem, e-mail, formulário preenchido — passa
pelas mesmas quatro garantias, e nenhum canal as dispensa:

```
ele vê antes      o destinatário pelo nome e o texto INTEIRO, como vai sair
uma de cada vez   nunca o mesmo texto para vários, em canal nenhum
ele pode parar    `não contatar` e a lista de silêncio valem em todo canal
fica escrito      o que saiu, para quem, quando — e só o que SAIU de verdade
```

```
WhatsApp          pelo conector, com o par de ferramentas descrito abaixo
e-mail            pelo conector de e-mail dele. A tela é a mesma; o que o
                  conector de e-mail oferece de melhor é o RASCUNHO na caixa
                  dele — e rascunho não é envio: não se registra como saído
formulário        pelo navegador dele, e a skill PARA antes do botão que
                  envia. Quem aperta é ele, em qualquer modo
sem conector      o bloco para copiar, que é a saída que nunca falta
```

O resto desta seção é o canal que mais tem regra, o WhatsApp — e vale **só com
o conector** (`WhatsApp: sim` no `INDICE.md`). Sem ele, a skill entrega o bloco
e para — e não pede desculpa por isso.

**A regra que governa tudo aqui: a ferramenta informa, e o {profissional} decide.**
Ela recusa o que ele não pediu, nunca o que ele pediu. Isso separa três coisas
que se confundem com facilidade:

```
escolha dele   usar o envio ou não, mandar para quem não respondeu, dizer ao
               programa dele para não perguntar mais
               → avise UMA VEZ, quando ele liga, e obedeça

erro           a skill mostrou um texto e mandou outro; a prévia envelheceu e o
               {pessoa} já respondeu no meio-tempo
               → a ponte recusa, porque ninguém escolheu isso

lote           mesma mensagem para vários, lista de transmissão
               → não existe: a ferramenta aceita UMA conversa por chamada
```

### O par que sai, sempre nesta ordem

```
preparar_envio    devolve um código de prévia e o texto exato que vai sair
enviar_mensagem   exige esse código, a mesma conversa e o mesmo texto
```

Entre as duas, a skill **mostra ao {profissional}**, e o que ela mostra tem três
partes obrigatórias — é o pedido literal, e resumo não serve:

```
para    o nome como ele conhece a pessoa, o id com apelido, e quando ela
        falou pela última vez
texto   INTEIRO, do jeito que vai sair. Nunca “a resposta que combinamos”
saídas  Mando agora · Mudo o texto · Eu mesmo mando
```

A prévia vale **10 minutos** e serve **uma vez**. Ela morre se chegar mensagem
nova naquela conversa depois de criada — senão o {profissional} responde pelo celular
e a skill manda a resposta velha logo atrás.

### Várias de uma vez não é lote

Uma skill pode mostrar quatro mensagens e o {profissional} aprovar as quatro numa
tela. Isso **não** é lista de transmissão, e a diferença é de forma:

```
lista de transmissão   uma mensagem, mesmo texto, muitos destinatários, junto
várias revisadas       N mensagens DIFERENTES, uma por pessoa, com o dado dela
                       dentro, saindo uma a uma e espaçadas
```

Quando mostrar várias, mostre **o texto inteiro de cada uma** — nunca “4
mensagens aguardando” — e o **porquê de cada uma estar ali**. Quem ficou de
fora aparece com o motivo: descarte em silêncio é o que faz o {profissional} parar de
confiar na lista.

Os rótulos da tela de várias são estes quatro, e valem para toda skill que
mostrar mais de uma — quem inventar um quinto reabre o problema que “Só o
bloco” criou:

```
Mando todas      uma por vez, espaçadas, na ordem mostrada
Escolho quais    ele diz os números que vão
Uma por uma      cada uma volta a aparecer antes de sair
Eu mesmo mando   ele copia os textos
```

### O que a ponte recusa, e o que ela só avisa

```
recusa    mais de uma conversa por chamada
          texto ou destinatário diferentes do que a prévia carimbou
          prévia vencida, usada duas vezes, ou com mensagem nova por cima
          grupo, canal e comunidade — o destinatário deixa de ser um
          quem está na lista de não contatar
avisa     o teto da hora, com o número e como mudá-lo
          que o destinatário nunca respondeu — é o caso de maior risco
          que não existe conversa nenhuma com aquela pessoa — e esse é outro
```

### O primeiro contato, que não é escolha de ninguém

Quem **nunca trocou mensagem** com o {profissional} por ali é o único caso em que
o envio não sai, e a recusa não é da ferramenta: **desde julho de 2026 o próprio
WhatsApp recusa**, e salvar o número na agenda não muda nada. Quem abre a
conversa tem que ser o aplicativo do celular, uma vez; depois disso o conector
responde como em qualquer outra.

A prévia diz isso **antes**, quando vê que a conversa não existe.

**E o formato dessa primeira mensagem é um LINK.** Com conector, a prévia já vem
com ele montado; sem conector, a skill o escreve, porque é uma URL e não uma
ferramenta:

```
https://wa.me/<número com país, só dígitos>?text=<a mensagem>
```

O texto vai codificado — espaço é `%20`, quebra de linha é `%0A`. O link abre o
WhatsApp do {profissional} na conversa certa, **com a mensagem já escrita**: ele só
aperta enviar. Não é contorno da recusa; é o caminho oficial da Meta, e quem
abre a conversa continua sendo o aplicativo, que é o que o WhatsApp exige.

**O bloco para copiar continua junto, e não é redundância.** O link falha com
número errado, com aplicativo que não abre no computador, e com mensagem longa
demais para caber numa URL. O bloco é o plano B que funciona sempre.

**A guarda vale igual para o link.** Uma pessoa por vez, o texto inteiro na tela
antes, e quem está na lista de silêncio não recebe link nenhum: a recusa da
plataforma não é a nossa régua, e entregar dez links numa hora é o mesmo disparo
que a ponte não faz. Com conector isso é contado como envio; sem ele, quem conta
é a skill.

E o registro **fecha sozinho**: quando a mensagem sai do celular, ela volta ao
conector no sync, e o que era "link entregue" passa a ser "enviada". É o que
separa preparar de ter mandado.

Não é raro: é como quase {todo-pessoa} chega da primeira vez — o que deixou o telefone
{exemplo-origem-de-contato} e nunca escreveu.

### Quem pediu para não ser contatado

O {pessoa} que diz “não me manda mais mensagem” tem que sair do alcance de todas
as skills, e não só da que ele respondeu. São **dois lugares, e os dois são
obrigatórios**:

```
na {base}   o arquivo {do-pessoa} ganha  não contatar: sim  ← origem, data
              e ele é aposentado com esse motivo (seção 3)
na ponte      um comando, e é ele que escreve o arquivo — o diretório dela
              não é o da {base}, e a skill não tem como adivinhar onde é:

                  whatsapp-reader nao-contatar 5551900000012 "pediu em 12/08"

              sem argumento ele lista; `--tirar <número>` desfaz
```

A {base} é o que as {n-skills} skills leem; a ponte é o que segura o envio mesmo se
alguém esquecer. **Nenhuma skill escreve mensagem para quem tem `não contatar:
sim`**, nem para retomar, nem para avisar do que entrou, nem para desejar
feliz aniversário. Não é preferência de canal: é pedido de silêncio.

Quem coloca é o {profissional}, ou a skill que leu o pedido na conversa — e aí ela
diz o que fez, em uma linha, porque tirar alguém da {base} é do tamanho de
aposentar.

Os tetos de partida são 6 conversas diferentes por hora, 30 envios no total e 5
segundos entre dois quaisquer. **São ajustáveis, e o número certo sai do
histórico do próprio {profissional}.** Recusa que não diz o número nem como mudá-lo
está impedindo em vez de informar.

### Envio não é governado pelo `modo:`

O `modo:` da seção 5 governa **escolha** — qual {item} entra, qual caminho
seguir. Envio é ato com terceiro e não se desfaz, então tem linha própria no
`INDICE.md` (seção 4.1):

```
envio: pergunta sempre           o padrão, e o que vale se a linha faltar
envio: responder sem perguntar   responde conversa viva direto; começar
                                 conversa continua perguntando
envio: não                       a skill nem oferece
```

{Profissional} em `modo: automatico` **não herda** envio automático: quem ligou o
automático para o {exemplo-trabalho} não ligou para a boca dele.

### O que nunca sai por aqui

```
áudio, foto, documento e anexo    a ponte não os manda
{linha-do-valor-e-da-proposta}
aceite ou recusa de proposta      (seção 10)
{linha-prazo-de-terceiro}
reenvio porque não respondeu      cadência é decisão, não relógio: o caminho é
                                  /{plugin}:retomar-contato, com ângulo novo
```

---
