---
name: o-que-fazer-hoje
description: >-
  Monta a lista do dia lendo a carteira inteira — visita de hoje, confirmação da
  véspera, lead que entrou e não teve resposta, proposta parada, quem prometeu
  documento e não mandou, quem está parado tempo demais e imóvel sem anúncio.
  Ordena por consequência, não por data — o que faz perder negócio hoje vem
  primeiro —, diz a razão da ordem, dá o id com o apelido e uma frase acionável
  em cada item, e oferece executar o primeiro ali mesmo. Reescreve o hoje.md e
  mais nenhum arquivo. Use de manhã, ou quando o corretor diz “o que eu faço
  hoje?”, “bom dia, o que tem pra hoje”, “por onde eu começo”, “me dá o dia”, “o
  que tá pegando fogo”, “tenho visita hoje?”, “fiquei três dias fora, o que
  perdi”, “o que ficou pendente”, “estou perdido, é muita coisa” — ou abre a
  sessão sem dizer nada e quer o dia. Não é para escrever a mensagem de quem
  sumiu, que é /corretor:retomar-contato, nem para arrumar a carteira, que é
  /corretor:organizar-carteira.
license: MIT
compatibility: >-
  Precisa da carteira do corretor, numa pasta do computador — ela lê a
  carteira inteira para ordenar o dia. Sem carteira, não funciona; diz isso em
  uma linha, manda rodar /corretor:comecar e não grava nada. A agenda é opcional — com o
  conector do Google Agenda ela lê hoje e amanhã; sem ele, a lista sai só da
  carteira, e ela avisa.
allowed-tools: Read Glob Grep Write Edit
---

# O que fazer hoje

## 1 · O que ela faz, e o que ela não faz

**Não se passa nada para ela:** é só chamar, que ela lê a carteira inteira.

Ela lê a carteira inteira, monta a lista do dia ordenada por **consequência** —
o que faz perder negócio hoje vem primeiro —, diz a razão da ordem em uma
linha, e reescreve o `hoje.md` da carteira com o que achou.

Ela não escreve mensagem, não muda etapa, não aposenta ninguém, não abre link,
não inventa compromisso que não está escrito e não toca em nenhum arquivo da
carteira além do `hoje.md`. Cada item aponta a skill que resolve, e ela oferece
chamar a primeira.

**Mensagem nenhuma sai daqui.** Com o conector ligado, quatro itens da lista
terminam em mensagem, e a linha deles diz isso — mas quem mostra o nome de quem
recebe, o texto inteiro e as três saídas é a skill do item. Esta não tem tool de
envio e não chega perto de uma: a lista do dia não é fila de aprovação.

**O que depende de OUTRA PESSOA sai daqui como uma linha só.** Esta lista é o
que o corretor tem que fazer; o que ele está esperando alguém mandar é de
`/corretor:cobrar-o-que-falta`, que ordena por quem trava mais e escreve a
cobrança. Misturar as duas faz a lista do dia abrir com cinco itens que ele não
pode executar — e uma lista em que o primeiro item não é executável ensina a
pular a lista.

---

## 2 · Antes de tudo

**Leia o contrato por seção, em `references/contrato/`** — o número da seção
é o começo do nome do arquivo: `04-2-hoje.md` é a 4.2. Ele é o padrão comum
das dez skills do pack, e nada de formato se decide aqui; o inteiro está em
`references/CONTRATO.md`. O que esta usa direto:

```
1    os dois transportes, a primeira leitura — e quem é dono de qual fato,
     que é a vista perdendo para o arquivo
2    id e apelido — V-071 (casa 3 dorm, Azenha), sempre os dois juntos
4.2  hoje.md, que é o arquivo desta skill
4.3  funil.md e as seis etapas       4.4  o imóvel      4.5  o cliente
7.1  como a mensagem sai — e por que ela nunca sai desta skill
8    a ordem de busca, o teto de três perguntas, a UI de escolha
9    os tetos, e as 15 caixas do hoje.md
10   como uma skill começa e termina
```

Os arquivos: `01-0-onde-a-carteira-mora.md`, `02-0-id-e-apelido.md`,
`04-2-hoje.md`, `04-3-funil.md`, `04-4-arquivo-de-imovel.md`,
`04-5-arquivo-de-cliente.md`, `07-1-a-mensagem-sai.md`,
`08-0-quando-perguntar.md`, `09-0-os-tetos.md` e `10-0-comeca-e-termina.md`.

Depois ache e leia **o `INDICE.md` da carteira**, pelos seis degraus da primeira
leitura (contrato, seção 1). A linha `carteira:` dele diz o transporte e o
lugar, e **toda leitura e toda gravação desta execução vão por ele** — no
`local` é caminho absoluto; no `drive` é a pasta `carteira`, pelo conector, e o
arquivo é filho dela. Não achou o `INDICE.md` em transporte nenhum? A carteira
não existe: diga isto e pare, sem montar nada.

```
Não achei a sua carteira. Rode /corretor:comecar — ele monta com você, pergunta
onde ela fica e termina com um imóvel e um cliente de verdade lá dentro. Depois
isto aqui abre o seu dia em dez segundos.
```

Do `INDICE.md` saem mais sete coisas: `modo:`, o `nome:` de `## Quem sou`, as
linhas `Google Agenda:` e `WhatsApp:` de `## O que está conectado`, a linha
`envio:`, o `horário de visita que costumo oferecer:` e o `canal padrão com
cliente:`.

A linha `envio:` só existe com `WhatsApp: sim`, **não se deriva do `modo:`**, e
vale `pergunta sempre` quando falta (contrato, 7.1). Esta skill não a lê para
mandar nada — lê para saber se a linha de um item pode dizer `sai daqui`, ou se
cala, que é o caso de `envio: não`.

**A data de hoje vem do ambiente, nunca do título do `hoje.md`.** O arquivo
pode ser de duas semanas atrás, e a lista inteira desta skill é uma conta de
datas: hoje errado é lista errada, item por item.

O `hoje.md` não existe, mas a carteira existe? Liste a pasta da carteira antes
de concluir que ele não está lá (contrato, seção 1) — busca vazia não prova
ausência. Não está mesmo: copie `references/modelos/hoje.md`, apague o
comentário `<!-- MODELO · … -->` e siga. Isso não é criar a carteira: é repor a
vista que ela deveria ter.

---

## 3 · O modo

Leia a linha `modo:` do `INDICE.md`. Aceite `automatico` e `automático`.
Qualquer outro valor, linha ausente ou arquivo ilegível: **copiloto**.

| | copiloto | automático |
|---|---|---|
| a lista do dia | entrega sempre, antes de qualquer pergunta | idem |
| o `hoje.md` | reescreve | idem |
| o primeiro item | **oferece** na UI de perguntas | **executa**, se o insumo já estiver na carteira (passo 6) |
| data em prosa sem dia (“sábado de manhã”) | pergunta, se o item for do topo | resolve pelo dia mais próximo e declara; havendo dois igualmente prováveis, deixa `?` |
| linha órfã do `hoje.md` velho | pergunta, se o item for do topo | carrega e declara |
| fecho | `## Guardei` e `## Falta saber` | mais `## Decidi sozinho` |

Esta skill **não tem exceção ao automático** — a única do pack é
`/corretor:conferir-matricula`, e é por isso que o automático nunca a chama
sozinha (passo 6). Se em algum ponto parecer que esta skill precisa de uma
exceção, pare e pergunte; não invente a exceção.

**O `modo:` não governa envio.** Ele governa escolha — qual caminho seguir, qual
item vem primeiro —, e mandar mensagem é ato com um terceiro que não se desfaz.
Quem governa isso é a linha `envio:`, que é outra linha e de outra natureza.
Corretor em `modo: automatico` **não herda** envio automático: quem ligou o
automático para o anúncio não ligou para a boca dele.

---

## 4 · O passo a passo

Ela lê a carteira inteira e reescreve um arquivo: é tarefa de passos demorados,
então **mostre o TODO na tela**. Ele tem duas vidas. Enquanto ela varre, são os
quatro passos do trabalho; assim que a lista fica pronta **com mais de três
itens**, o TODO passa a ser a lista do dia, na ordem da escada — o que o
corretor quer ver andando é o dia dele, não a skill.

**Ela nunca marca um item do dia como feito.** Quem faz é ele, e a marca dele
mora na caixa do `hoje.md`.

### Passo 1 · Varrer

Nesta ordem, e o arquivo dono sempre vence a vista (contrato, seção 1):

```
1  funil.md               etapa, · desde e · próximo: de cada cliente vivo
2  clientes/_indice.md    último contato — dá a fila de quem abrir
3  cada arquivo de cliente que a fila apontar
                          ## Combinado · ## Histórico · etapa: · canal:
4  imoveis/_indice.md     estado e atualizado
5  cada arquivo de imóvel citado por um cliente vivo, mais os que estão
                          à venda ou para alugar
                          link: · exclusividade: · ## Documentos · ## O que vende
6  o hoje.md de ontem      as caixas marcadas e as linhas que outras skills
                          acrescentaram (passo 5)
7  a agenda, se houver     só hoje e amanhã (passo 2)
```

No `drive`, cada `_indice.md` se procura **dentro** da pasta que a linha nomeia:
há dois arquivos com esse nome na carteira, e o nome solto devolve os dois
(contrato, seção 1).

Divergiu vista e arquivo — o `_indice.md` diz 5 de agosto e o histórico do
cliente tem linha de 12? Vale o arquivo, e a divergência vira uma linha em
`## Falta saber` com o nome de `/corretor:organizar-carteira`. **Esta skill não
conserta vista**, pelo motivo do passo 7.

### Passo 2 · A agenda, quando ela está ligada

**`Google Agenda: sim` no `INDICE.md`.** Procure na sessão a ferramenta de
agenda do conector do Google — ela aparece com nome de `list_events` ou
`search_events`. Leia **só hoje e amanhã**: o dia é o assunto, e a semana
inteira é peso sem uso. Avise em uma linha antes de chamar, porque a agenda não
está em `allowed-tools` e a primeira chamada pede permissão — isso é normal.

- **só leitura.** `create_event`, `update_event` e `delete_event` não se usam
  nesta skill, em nenhum modo.
- **evento sem cliente na carteira** entra na lista como está, com `?` no lugar
  do id, e vira uma linha em `## Falta saber`. Não se cria cliente a partir de
  um título de evento.
- **hora divergente** entre a agenda e o `## Combinado` do cliente: mostre as
  duas na mesma linha e **não escolha**. A agenda não é vista da carteira nem
  arquivo dono — escolher errado faz ele chegar na hora errada.

**`Google Agenda: não`, linha ausente, ou a ferramenta não está na sessão:** a
lista sai só da carteira e ela diz isso em uma linha. Não trava, não pergunta e
**não mexe na linha `Google Agenda:`** — `## O que está conectado` é
configuração do corretor.

### Passo 3 · Os gatilhos

Oito, e cada um sai de um campo que existe no gabarito. Gatilho que precisa de
campo inventado não é gatilho:

| gatilho | onde está escrito | vai para | quem resolve |
|---|---|---|---|
| visita hoje | `## Combinado` do cliente, ou a agenda | Vence hoje | — |
| confirmação da véspera | visita marcada para amanhã | Vence hoje | `/corretor:montar-visita` |
| lead sem resposta | `etapa: novo lead` e nenhuma fala do corretor depois da entrada | Vence hoje | `/corretor:responder-lead` |
| proposta parada | `etapa: proposta` com `· desde` de dois dias ou mais | Vence hoje | — |
| exclusividade acabando | `exclusividade: sim, até <data>`, faltando 7 dias ou menos | Vence hoje | — |
| prometido e não chegou | `## Combinado` com promessa de data já passada | Prometido e não chegou | `/corretor:documentos-do-negocio` |
| papel que trava | `conferida: não` ou `pendências: ?` num imóvel com cliente em `visitou` ou `proposta` | Travado | `/corretor:conferir-matricula` |
| parado tempo demais | sem manifestação dele há mais de 7 dias, em etapa viva | Travado | `/corretor:retomar-contato` |
| imóvel sem anúncio | `estado:` à venda ou para alugar, e `link:` ausente ou `?`, ou `## O que vende` vazio, há 7 dias ou mais | Travado | `/corretor:anunciar-imovel` |

Os cortes de dia são estes, e **não se inventa outro**: véspera é 1 dia;
promessa vence no dia seguinte ao prometido; parado é 7 dias; anúncio parado é
7 dias; exclusividade é 7 dias.

**O corte de 7 dias do “parado” é grosso de propósito.** Quem mede silêncio
direito é `/corretor:retomar-contato`, que tem prazo por etapa — aqui basta o
sinal, e a linha diz de quem é o assunto. Passou de 120 dias, é caso de
aposentar pela regra 3, e quem aposenta é `/corretor:organizar-carteira`: esta
skill nem sugere, só aponta.

`## Combinado` com data em prosa — “sábado de manhã”, “semana que vem” — sem
data escrita: **não vira item de hoje**. Vira `?` e, se o item cairia no topo
da lista, uma pergunta (seção 5). Calcular o sábado de uma frase ambígua é como
marcar visita sozinho.

### Dois gatilhos que o conector corrige

Com `WhatsApp: sim` em `## O que está conectado` do `INDICE.md`, confirme estes
dois antes de escrevê-los — os dois afirmam que **nada chegou**, e a carteira
só sabe o que alguém anotou:

```
prometido e não chegou   o cliente pode ter mandado no WhatsApp e ninguém
                         anotou. Cobrar documento que ele já mandou é o erro
                         que faz o corretor parar de confiar na lista
parado tempo demais      ultima_interacao dá a data exata e de quem foi a
                         última palavra, no lugar da conta por dias sem registro
```

Chegou e a carteira não sabia? O item **não entra** em `## Prometido e não
chegou`. Ele vira uma linha em `## Falta saber` dizendo que a conversa tem algo
que os arquivos não têm — e o conserto é `/corretor:organizar-carteira`, que é
quem traz conversa para dentro. Esta skill não grava conversa.

A releitura paga duas vezes: ela tira da lista o item que já se resolveu, e é o
que entrega à skill dona o texto certo para mostrar. Cobrar documento que já
chegou é o erro que faz o corretor parar de confiar na lista; **mandar** essa
cobrança é o mesmo erro, com o cliente de testemunha.

Sem conector — o normal —, os dois gatilhos valem como sempre valeram, e a
lista sai igual. **Nada aqui depende dele.**

### Quatro que terminam em mensagem

Com `WhatsApp: sim` e a linha `envio:` em qualquer coisa que não seja `não`,
quatro gatilhos chegam à skill dona com destinatário e texto prontos — e é só
por isso que a linha deles na lista diz `sai daqui` (seção 6):

```
confirmação da véspera   /corretor:montar-visita           conversa viva, e a
                         pergunta é de uma linha
lead sem resposta        /corretor:responder-lead          ele escreveu antes:
                         é o caso de menor risco que existe
prometido e não chegou   /corretor:documentos-do-negocio   só depois de reler a
                         conversa, senão cobra o que já chegou
parado tempo demais      /corretor:retomar-contato         com as travas dela:
                         7 dias de cadência, nunca a terceira, ângulo novo
```

Os outros não terminam em mensagem, e o motivo é diferente em cada um: **visita
de hoje** é sair de casa, e a linha que se manda antes já é o gatilho de cima;
**proposta parada** é decisão de preço, e preço é dele; **exclusividade
acabando** é conversa dele com o proprietário e não tem skill dona; **papel que
trava** quem conclui é gente; e **imóvel sem anúncio** não tem para quem mandar.
Item sem skill dona não ganha `sai daqui`, nem com o conector ligado — inventar
uma para ele é o lote entrando pela porta dos fundos.

### Passo 4 · A escada da consequência

A ordem não é cronológica. Seis degraus, de cima para baixo:

```
1  hora marcada hoje      visita de hoje, compromisso de hoje na agenda
                          passou da hora, passou — não há como refazer o dia

2  janela que fecha       confirmação da véspera, prazo escrito que termina
                          hoje ou amanhã, exclusividade a menos de sete dias
                          amanhã já é tarde para esta

3  contato esfriando      lead sem resposta, proposta parada
                          o relógio é do outro lado: ele está falando com
                          outro corretor agora, e não avisa

4  papel que trava        matrícula não conferida, documento que não chegou
                          o comprador já existe; o que segura é o papel

5  o que a semana come    quem sumiu, retomada devida
                          um dia a mais não muda um; a soma de trinta muda o mês

6  só oportunidade        imóvel sem anúncio, ficha pela metade
                          nenhum negócio morre hoje por causa dele
```

Empate dentro do mesmo degrau, nesta ordem: sobe quem tem **hora escrita**;
depois quem **espera há mais tempo**; e **dois itens do mesmo cliente não se
separam** — o de baixo sobe para junto do de cima, porque os dois são um
telefonema só.

### Passo 5 · O `hoje.md` de ontem, antes de reescrever

Leia o arquivo velho **antes** de gravar por cima. Ele guarda duas coisas que
não existem em nenhum outro lugar:

- **caixa marcada `- [x]`** — é o corretor dizendo que fez. Ela vai para
  `## Feito nos últimos sete dias` com a data do título daquele arquivo.
  **Caixa marcada nunca é desmarcada por reescrita**, nem quando a skill roda
  duas vezes no mesmo dia: item que ele marcou de manhã não volta para
  `## Vence hoje` à tarde. Este é o defeito que mais rápido faz o corretor
  parar de marcar caixa.
- **linha que outra skill acrescentou** — e são três, não duas:
  `/corretor:montar-visita` escreve a véspera em `## Vence hoje`,
  `/corretor:documentos-do-negocio` escreve o que pedir em `## Vence hoje` e o
  que prometeram em `## Prometido e não chegou`, e
  `/corretor:retomar-contato` escreve a sugestão de arquivar em `## Travado`.
  Esta skill reescreve o arquivo INTEIRO, então lista incompleta aqui é linha
  apagada em silêncio. Reconstrua-a a partir do arquivo dono. Não achou o
  fato em arquivo nenhum? **Carregue a linha como está**, na mesma seção, e
  escreva em `## Falta saber` que ela não sai de nenhum arquivo dono. Linha
  apagada em silêncio é trabalho perdido, e ele nunca vai saber que perdeu.

Fato que já está num `## Histórico` não vira segunda linha em `## Feito` só
porque também havia caixa marcada: um fato, uma linha.

### Passo 6 · Oferecer o primeiro item

**No copiloto**, use a UI de perguntas do harness (seção 8 do contrato), com o
custo escrito em cada opção — e o custo mudou com o conector: onde era o insumo
que só ele tem, passa a ser o que a skill do item faz com ele.

```
Começo pelo primeiro?

  Responder o Paulo     /corretor:responder-lead · leio a conversa e ela te
                        mostra o texto e o nome antes de sair qualquer coisa
  Confirmar a visita    /corretor:montar-visita · pronto agora, e a mensagem
                        sai de lá com você vendo
  Só a lista            nada além do hoje.md, que já está gravado
```

Sem conector, ou com `envio: não`, o custo volta a ser o de sempre — “preciso da
conversa colada” — e o que a skill do item entrega no fim é o bloco para copiar.

**Esta pergunta não aprova envio nenhum.** Ela escolhe por onde o dia começa. A
de mandar é outra, é da skill do item, e traz o nome de quem recebe, o texto
inteiro e as três saídas. Juntar as duas faz da lista do dia uma esteira de
aprovação: ele responde sete vezes e saem sete mensagens que ele não leu. É o
defeito que a seção 7.1 do contrato existe para impedir.

**No automático**, chame a skill do primeiro item — e só quando **todo o insumo
dela já estiver na carteira**. Falta conversa colada, link, documento ou
decisão do corretor: não chame, e a linha do item diz o que falta. Quatro
travas, e elas não se negociam:

- **uma por execução.** A lista do dia não vira meia hora de trabalho sem
  ninguém olhando.
- **nunca `/corretor:conferir-matricula`**, que é a exceção escrita do contrato:
  ela lista o que pode travar a venda e quem conclui é gente.
- **nunca duas skills encadeadas** a partir do resultado da primeira.
- **chamar a skill dona não pula a tela dela.** O automático entrega o trabalho,
  não a decisão: quem diz se a mensagem sai sem perguntar é a linha `envio:` do
  corretor, e o padrão dela é `pergunta sempre`.

Cada chamada vira uma linha em `## Decidi sozinho`, com como desfazer. Saiu
mensagem, porque o `envio:` dele autoriza? A linha diz para quem foi e
transcreve o que foi, e **não oferece desfazer**: apagar para todos deixa a
lápide na conversa, e a notificação já entregou o texto na tela de bloqueio. O
que corrige uma mensagem é a seguinte.

---

## 5 · O que perguntar, quando, e como

Esta skill quase não pergunta — ela lê e resume, e o corretor abriu a sessão
para ver o dia, não para responder formulário. **A lista vem primeiro, sempre.**
Perguntar antes de mostrar é fazer ele esperar por nada.

Uma pergunta por vez, **nunca mais de três na execução**, e cada uma com o
motivo na mesma frase (contrato, seção 8). Só estas três existem aqui:

- **a data em prosa**, e só quando o item cairia nos três primeiros: “o
  `## Combinado` da C-017 (Joana Ribeiro) diz sábado de manhã, sem data — é o
  sábado 22? Se for, a confirmação é hoje e ela sobe para o primeiro lugar.”
- **a linha órfã do `hoje.md` velho**, e só quando ela cairia nos três
  primeiros: “esta linha estava no `hoje.md` de 15 de agosto e não acho o fato
  em nenhum arquivo — ainda vale?”
- **a bifurcação do passo 6**, na UI de perguntas, com o custo escrito.

Não pergunte: se ele quer a lista; se pode gravar o `hoje.md` (é a vista dela);
o que já está escrito na carteira; se pode mandar a mensagem, que é pergunta da
skill do item e aqui seria a mesma pergunta duas vezes; nem gosto que
`## Como eu trabalho` já decidiu. Em modo automático não se pergunta: escolhe e
declara.

**Dia vazio** — nenhum item em nenhum degrau. Diga em uma linha, sem sermão:
que não há nada vencendo, e que carteira sem lead novo há dias é assunto de
captação, não dia livre. Ofereça `/corretor:retomar-contato` ou
`/corretor:anunciar-imovel`, uma vez.

---

## 6 · O formato da saída

O trabalho é a lista na tela — esta skill não produz bloco para colar, e quem
escreve a mensagem, e quem a manda quando ela sai, é a skill do item. Depois da
lista vêm os blocos de fecho do contrato (seção 10), nesta ordem e com estes
títulos exatos. **A pergunta do passo 6 é a última coisa**, depois do fecho:
perguntar antes de dizer onde guardou faz ele responder sem saber o que já foi
feito.

### A lista

Título com a data por extenso, a contagem, e **uma linha com a razão da ordem
deste dia** — que nomeia o primeiro item e por que ele passou na frente do
segundo. “Ordeno por consequência” não serve como razão: ele já sabe.

```markdown
Hoje, 19 de agosto — 7 itens

A visita das 10h é a única coisa que passa da hora hoje. O Paulo vem antes das
cobranças porque lead que entrou ontem e não teve resposta já está falando com
outro corretor.

1  C-017 (Joana Ribeiro) · hoje, 10h
   Sair para a visita ao V-071 (casa 3 dorm, Azenha). Ela ia confirmar em 16 de
   agosto e não confirmou — mande uma linha antes de sair.

2  C-024 (Paulo Menezes) · entrou ontem, sem resposta
   Responder o que ele perguntou do V-071 (casa 3 dorm, Azenha) pelo Zap.
   → /corretor:responder-lead · sai daqui
     Mando agora · Mudo o texto · Eu mesmo mando

3  C-008 (Família Duarte) · proposta parada há 3 dias
   Cobrar do proprietário a resposta dos R$ 480.000 no V-052 (apto 3 dorm,
   Cidade Baixa).

4  V-071 (casa 3 dorm, Azenha) · matrícula não conferida
   Conferir antes da proposta de sexta, que é o que trava a venda.
   → /corretor:conferir-matricula — ela lista, quem conclui é você

5  C-031 (Sr. Almeida) · prometeu o IPTU em 13 de agosto, seis dias
   Cobrar o IPTU do V-071 (casa 3 dorm, Azenha) por WhatsApp.
   → /corretor:documentos-do-negocio · sai daqui
     Mando agora · Mudo o texto · Eu mesmo mando

6  C-019 (Rita Camargo) · parada há 14 dias
   Ela visitou e sumiu. Precisa de uma novidade concreta, não de cobrança.
   → /corretor:retomar-contato · sai daqui
     Mando agora · Mudo o texto · Eu mesmo mando

7  A-014 (apto 2 dorm, Menino Deus) · na carteira desde 11 de agosto, sem anúncio
   Escrever o anúncio — sem ele o imóvel não aparece em lugar nenhum.
   → /corretor:anunciar-imovel — precisa do link da ficha
```

Cada item traz, sem exceção: **id com apelido**, o gatilho com o número de dias,
e **uma frase acionável** — o que fazer, com quem, sobre o quê. “Acompanhar o
cliente” não é item; “cobrar do C-031 (Sr. Almeida) o IPTU do V-071 (casa 3
dorm, Azenha)” é. O que ela não conseguiu apurar entra como `?` e vira linha em
`## Falta saber`; nunca uma estimativa.

Item cujo dado depende de campo que está `?` continua na lista, com o `?`
visível: `parado há ?` é informação, e a lista sem ele seria mentira por
omissão.

**`sai daqui` é declaração, não botão.** Ele aparece só com `WhatsApp: sim`,
só com `envio:` diferente de `não`, e só nos quatro gatilhos que terminam em
mensagem (passo 3). Quer dizer uma coisa: a skill daquele item já chega com o
destinatário e o texto prontos, e a mensagem pode sair do WhatsApp dele **lá**.
As três saídas vêm na linha de baixo, com estes rótulos e nesta ordem —
**Mando agora · Mudo o texto · Eu mesmo mando** —, e quem as mostra, junto do
nome de quem recebe, de quando essa pessoa falou por último e do texto inteiro,
é ela. Aqui não há tela de confirmação: repeti-la seria perguntar duas vezes a
mesma coisa, e a segunda com menos informação que a primeira.

Sem conector, ou com `envio: não`, a linha da skill volta ao custo de sempre —
`precisa da conversa colada`, `precisa do link da ficha` — e a saída daquela
skill é o bloco para copiar. **A lista sai igual nos dois casos**: os mesmos
itens, na mesma ordem, com a mesma razão. O que muda é uma linha de custo, e
nunca o que entra ou o que sobe.

### A linha que ela sempre diz

Depois da lista, uma linha e não mais que uma:

```
Isto é o que está escrito na carteira. Se você fechou negócio, mandou mensagem
ou recebeu documento e não anotou, eu vou cobrar de novo amanhã — passe o que
aconteceu para /corretor:organizar-carteira e a lista de amanhã sai certa.
```

### O fecho

```markdown
## Guardei
- ~/carteira/hoje.md — reescrito, 7 caixas abertas e 3 do que você marcou nos últimos sete dias

## Falta saber
- que dia é o “sábado de manhã” combinado com a C-017 (Joana Ribeiro)
- de quem é a visita das 15h na agenda — não achei cliente com esse nome na carteira
- o clientes/_indice.md diz 5 de agosto para a C-019 (Rita Camargo) e o arquivo dela tem linha de 12; /corretor:organizar-carteira acerta a vista

## Decidi sozinho
- Respondi o C-024 (Paulo Menezes) pelo /corretor:responder-lead, que era o primeiro item e tinha a conversa em _bruto/ — a mensagem está acima e não saiu: o seu envio: diz pergunta sempre, e ela está esperando você. Para não fazer isso, me diga e eu só listo.
- Li “sábado de manhã” como 22 de agosto, o sábado mais próximo. Se for o outro, me diga e a confirmação sai da lista de hoje.
```

O `## Guardei` diz o lugar do jeito que o corretor reconhece, e o jeito muda com
o transporte: no `local`, `~/carteira/hoje.md`; no `drive`, `hoje.md, na pasta
carteira do seu Drive`. O resto da linha é o mesmo.

`## Decidi sozinho` só existe em modo automático, e cada linha traz **o que fiz
— por que — como desfazer**. A única exceção é a mensagem que saiu: ali não há
terceiro campo, e a linha transcreve o texto e nomeia quem recebeu, em vez de
prometer um desfazer que não existe.

---

## 7 · O que ela grava, e onde

Ela tem `Write` e `Edit` por um arquivo só: **o `hoje.md` da carteira, que é a
vista dela e a única que se refaz inteira todo dia.** As outras skills
acrescentam linha nele; esta reescreve.

A gravação vai pelo transporte da linha `carteira:` (contrato, seção 1): no
`local`, escrita de arquivo com caminho absoluto; no `drive`, atualizar o
arquivo com o conteúdo inteiro, ou criá-lo com a pasta `carteira` declarada como
pai quando ele ainda não existe. Como ela reescreve o arquivo todo, e sempre
depois de ler o velho (passo 5), o “leia antes de atualizar” do contrato já está
no passo a passo — o que não pode é gravar o dia sem ter lido o de ontem.

**Nenhum outro arquivo é tocado.** Nem `funil.md`, nem os dois `_indice.md`,
nem arquivo de cliente ou de imóvel, nem `INDICE.md`, nem `_bruto/`. A razão é
a frequência: uma skill que roda todo dia e escreve em cinco arquivos é uma
skill que, quando erra, erra em cinco arquivos todo dia — e o `hoje.md` é o
único que pode ser refeito do zero sem perda, porque tudo nele é derivado.

**O `hoje.md` não leva seta de procedência.** O gabarito (contrato, 4.2) pede
id com apelido e a data do fato — `— combinado em 2026-08-14` —, e é só isso.
A procedência mora no arquivo dono, e como esta skill não escreve em arquivo
dono, ela não cria procedência nenhuma.

**Nem `sai daqui`.** Ele é da tela, e o gabarito de 4.2 não o tem: o arquivo
guarda o que ficou por fazer, e de onde a coisa sai é assunto do momento em que
ela se faz. Escrito ali, ele viraria uma caixa prometendo amanhã um envio que
ninguém confirmou hoje.

O formato é o da seção 4.2, e nada além dele:

```markdown
# Hoje — 2026-08-19

## Vence hoje
- [ ] Visita 10h com C-017 (Joana Ribeiro) no V-071 (casa 3 dorm, Azenha) — ela não confirmou desde 2026-08-16
- [ ] Responder C-024 (Paulo Menezes) — entrou ontem pelo Zap e não teve resposta
- [ ] Cobrar a resposta da proposta de C-008 (Família Duarte) no V-052 (apto 3 dorm, Cidade Baixa) — parada desde 2026-08-16

## Travado
- [ ] V-071 (casa 3 dorm, Azenha) — matrícula não conferida, e a proposta é sexta
- [ ] C-019 (Rita Camargo) — parada há 14 dias; é caso de /corretor:retomar-contato
- [ ] A-014 (apto 2 dorm, Menino Deus) — sem anúncio desde 2026-08-11

## Prometido e não chegou
- [ ] C-031 (Sr. Almeida) — ia mandar o IPTU do V-071 (casa 3 dorm, Azenha) em 2026-08-13, seis dias

## Feito nos últimos sete dias
- [x] 2026-08-15 — visita do C-017 (Joana Ribeiro) ao V-071 (casa 3 dorm, Azenha)
```

Quatro coisas ao gravar, e as quatro já quebraram um arquivo em algum lugar:

- **as quatro seções ficam na página mesmo vazias**, com `- nada aqui hoje.`
  Sumir com a seção faz o corretor achar que a skill esqueceu.
- **`## Vence hoje` é o que tem de ser feito hoje, não o que expira hoje.** É
  por isso que a confirmação de uma visita de sábado entra nele na sexta — é a
  leitura do próprio gabarito.
- **dentro de cada seção, a ordem é a da escada** (passo 4). Entre as seções, a
  ordem é a do gabarito, e não se troca.
- **o teto é 15 caixas no arquivo inteiro** (contrato, seção 9). Estourou: corte
  primeiro o `## Feito`, do mais antigo para o mais novo, porque nenhuma linha
  dele é trabalho a fazer; se ainda estourar, corte de baixo da escada para
  cima. **E diga na tela o que ficou de fora**, em uma linha, agrupado: “quatro
  imóveis sem anúncio ficaram fora do arquivo — estão na lista acima.” Item
  cortado em silêncio é item perdido.

Se o corretor colar uma conversa no meio da execução, a ordem é a da seção 7 do
contrato e **não é esta skill que faz isso**: grave o bruto primeiro no
`_bruto/` da carteira, em `AAAA-MM-DD-<canal>-<apelido-curto>.md`, com o
cabeçalho de três linhas, e mande extrair fato com
`/corretor:organizar-carteira` ou `/corretor:responder-lead`, conforme o caso.

---

## 8 · Onde ela para

Sete limites. Ler os sete custa menos que descobrir um no meio da semana.

**Ela só sabe o que está escrito.** Negócio que você fechou ontem no telefone e
não anotou continua na lista de hoje como proposta parada — ela vai cobrar, com
toda a segurança do mundo, uma coisa que já acabou. E o contrário também: o que
você combinou por áudio não existe para ela. É o limite mais caro do pack, e a
saída dela diz isso todo dia em uma linha, com o convite de passar o que
aconteceu para `/corretor:organizar-carteira`. A lista de amanhã só é boa se a
carteira de hoje for.

**A escada é escrita, não medida.** Os seis degraus e os cortes de dia vieram
do que costuma fazer perder negócio, não do seu mês. Dois itens do mesmo degrau
podem estar na ordem errada para o seu dia — diga qual sobe, que a lista se
refaz na hora. O que ela não faz é fingir que a ordem é um cálculo.

**Da agenda ela só lê, e só enxerga o que está escrito lá.** Compromisso que
você guarda na cabeça, ou marcado no papel, não aparece — e a agenda ligada dá
a impressão contrária, que é o que torna isso perigoso. Sem conector, a lista
sai só da carteira, e ela avisa.

**Ela não abre link e não confere preço.** Ela não desce ao degrau 5 da ordem
de busca: a lista do dia não precisa de dado novo de imóvel, e site que monta a
página por JavaScript devolveria nada de qualquer jeito. Preço, metragem e
condomínio saem do arquivo, com a data que está lá.

**Sem o conector, ela não sabe se o cliente respondeu por fora.** A última
mensagem dele só entra na carteira quando alguém cola a conversa, e por isso
“parado há 14 dias” quer dizer *quatorze dias sem nada escrito* — e ela escreve
assim. Com `WhatsApp: sim`, o `ultima_interacao` dá a data de verdade, e é o que
“Dois gatilhos que o conector corrige” manda conferir antes de escrever — e é a
mesma leitura que faz quatro itens chegarem à skill dona prontos para sair. O
que não muda com conector nenhum é quem aperta: você, lá.

**E o pré-voo, que nesta skill é o que mais importa** (contrato §7): antes do
primeiro `ultima_interacao`, chame `estado_da_ponte`. Ponte parada devolve o
retrato do dia em que ela parou, e esta skill é a que transforma esse retrato em
ordem de trabalho — “ninguém respondeu” vira lista de cobrança para gente que
respondeu ontem. Parada há mais de um dia: diga há quanto tempo, trate a
carteira como a única fonte (é o comportamento “sem conector”, que já está
escrito acima) e siga. **Não pare a skill por isso** — o dia dele continua
existindo.

**O silêncio ela mede grosso.** Sete dias em qualquer etapa, e é de propósito:
quem tem prazo por etapa é `/corretor:retomar-contato`. Um cliente pode aparecer
aqui um dia antes ou um dia depois do que aquela skill diria.

**Ela não decide nada que é seu.** Não diz se a proposta é boa, não sugere
baixar preço, não promete prazo de banco, de cartório ou de prefeitura, não
aposenta ninguém e **não manda mensagem nenhuma, nem com o conector ligado**.
Ela mostra o dia e aponta a porta de cada item; quem entra é você — e onde a
porta é uma mensagem, quem manda é você também, na tela da skill que a escreveu,
com o nome de quem recebe e o texto inteiro na frente.
