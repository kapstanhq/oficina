---
name: o-que-fazer-hoje
description: >-
  Monta a lista do dia lendo a busca inteira — entrevista de hoje, resposta de
  recrutador que ficou sem retorno, vaga salva e não teve candidatura, candidatura parada, quem prometeu
  documento e não mandou, quem está parado tempo demais e vaga sem currículo.
  Ordena por consequência, não por data — o que faz perder vaga hoje vem
  primeiro —, diz a razão da ordem, dá o id com o apelido e uma frase acionável
  em cada item, e oferece executar o primeiro ali mesmo. Reescreve o hoje.md e
  mais nenhum arquivo. Use de manhã, ou quando o candidato diz “o que eu faço
  hoje?”, “bom dia, o que tem pra hoje”, “por onde eu começo”, “me dá o dia”, “o
  que tá pegando fogo”, “onde eu me candidato hoje?”, “fiquei três dias fora, o que
  perdi”, “o que ficou pendente”, “estou perdido, é muita coisa” — ou abre a
  sessão sem dizer nada e quer o dia. Não é para escrever a mensagem de quem
  sumiu, que é /vagas:retomar-contato, nem para arrumar a busca, que é
  /vagas:organizar-busca.
license: MIT
compatibility: >-
  Precisa da busca do candidato, numa pasta do computador — ela lê a
  busca inteira para ordenar o dia. Sem busca, não funciona; diz isso em
  uma linha, manda rodar /vagas:comecar e não grava nada. A agenda é opcional — com o
  conector do Google Agenda ela lê hoje e amanhã; sem ele, a lista sai só da
  busca, e ela avisa.
allowed-tools: Read Glob Grep Write Edit
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/o-que-fazer-hoje/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# O que fazer hoje

## 1 · O que ela faz, e o que ela não faz

**Não se passa nada para ela:** é só chamar, que ela lê a busca inteira.

Ela lê a busca inteira, monta a lista do dia ordenada por **consequência** —
o que faz perder vaga hoje vem primeiro —, diz a razão da ordem em uma
linha, e reescreve o `hoje.md` da busca com o que achou.

Ela não escreve mensagem, não muda etapa, não aposenta ninguém, não abre link,
não inventa compromisso que não está escrito e não toca em nenhum arquivo da
busca além do `hoje.md`. Cada item aponta a skill que resolve, e ela oferece
chamar a primeira.

**Mensagem nenhuma sai daqui.** Com o conector ligado, quatro itens da lista
terminam em mensagem, e a linha deles diz isso — mas quem mostra o nome de quem
recebe, o texto inteiro e as três saídas é a skill do item. Esta não tem tool de
envio e não chega perto de uma: a lista do dia não é fila de aprovação.

**O que depende de OUTRA PESSOA sai daqui como uma linha só.** Esta lista é o
que o candidato tem que fazer; o que ele está esperando alguém mandar é de
`/vagas:cobrar-o-que-falta`, que ordena por quem trava mais e escreve a
cobrança. Misturar as duas faz a lista do dia abrir com cinco itens que ele não
pode executar — e uma lista em que o primeiro item não é executável ensina a
pular a lista.

---

## 2 · Antes de tudo

**Leia o contrato por seção, em `references/contrato/`** — o número da seção
é o começo do nome do arquivo: `04-2-hoje.md` é a 4.2. Ele é o padrão comum
das quinze skills do pack, e nada de formato se decide aqui; o inteiro está em
`references/CONTRATO.md`. O que esta usa direto:

```
1    os dois transportes, a primeira leitura — e quem é dono de qual fato,
     que é a vista perdendo para o arquivo
2    id e apelido — V-019 (Gerente de Produto Sênior, Trilho Logística), sempre os dois juntos
4.2  hoje.md, que é o arquivo desta skill
4.3  funil.md e as seis etapas       4.4  a vaga      4.5  o contato
7.1  como a mensagem sai — e por que ela nunca sai desta skill
8    a ordem de busca, o teto de três perguntas, a UI de escolha
9    os tetos, e as 15 caixas do hoje.md
10   como uma skill começa e termina
```

Os arquivos: `01-0-onde-a-busca-mora.md`, `02-0-id-e-apelido.md`,
`04-2-hoje.md`, `04-3-funil.md`, `04-4-arquivo-de-vaga.md`,
`04-5-arquivo-de-contato.md`, `07-1-a-mensagem-sai.md`,
`08-0-quando-perguntar.md`, `09-0-os-tetos.md` e `10-0-comeca-e-termina.md`.

Depois ache e leia **o `INDICE.md` da busca**, pelos seis degraus da primeira
leitura (contrato, seção 1). A linha `busca:` dele diz o transporte e o
lugar, e **toda leitura e toda gravação desta execução vão por ele** — no
`local` é caminho absoluto; no `drive` é a pasta `busca`, pelo conector, e o
arquivo é filho dela. Não achou o `INDICE.md` em transporte nenhum? A busca
não existe: diga isto e pare, sem montar nada.

```
Não achei a sua busca. Rode /vagas:comecar — ele monta com você, pergunta
onde ela fica e termina com uma vaga e um contato de verdade lá dentro. Depois
isto aqui abre o seu dia em dez segundos.
```

Do `INDICE.md` saem mais sete coisas: `modo:`, o `nome:` de `## Quem sou`, as
linhas `Google Agenda:` e `WhatsApp:` de `## O que está conectado`, a linha
`envio:`, o `horário que costumo oferecer para entrevista:` e o `canal padrão com
contato:`.

A linha `envio:` só existe com `WhatsApp: sim`, **não se deriva do `modo:`**, e
vale `pergunta sempre` quando falta (contrato, 7.1). Esta skill não a lê para
mandar nada — lê para saber se a linha de um item pode dizer `sai daqui`, ou se
cala, que é o caso de `envio: não`.

**A data de hoje vem do ambiente, nunca do título do `hoje.md`.** O arquivo
pode ser de duas semanas atrás, e a lista inteira desta skill é uma conta de
datas: hoje errado é lista errada, item por item.

O `hoje.md` não existe, mas a busca existe? Liste a pasta da busca antes
de concluir que ele não está lá (contrato, seção 1) — busca vazia não prova
ausência. Não está mesmo: copie `references/modelos/hoje.md`, apague o
comentário `<!-- MODELO · … -->` e siga. Isso não é criar a busca: é repor a
vista que ela deveria ter.

---

## 3 · O modo

Leia a linha `modo:` do `INDICE.md`. Aceite `automatico` e `automático`.
Qualquer outro valor, linha ausente ou arquivo ilegível: **copiloto**.

| | copiloto | automático |
|---|---|---|
| a lista do dia | entrega sempre, antes de qualquer pergunta | idem |
| o `hoje.md` | reescreve | idem |
| o primeiro item | **oferece** na UI de perguntas | **executa**, se o insumo já estiver na busca (passo 6) |
| data em prosa sem dia (“sábado de manhã”) | pergunta, se o item for do topo | resolve pelo dia mais próximo e declara; havendo dois igualmente prováveis, deixa `?` |
| linha órfã do `hoje.md` velho | pergunta, se o item for do topo | carrega e declara |
| fecho | `## Guardei` e `## Falta saber` | mais `## Decidi sozinho` |

Esta skill **não tem exceção ao automático** — a única do pack é
`/vagas:candidatar`, e é por isso que o automático nunca a chama
sozinha (passo 6). Se em algum ponto parecer que esta skill precisa de uma
exceção, pare e pergunte; não invente a exceção.

**O `modo:` não governa envio.** Ele governa escolha — qual caminho seguir, qual
item vem primeiro —, e mandar mensagem é ato com um terceiro que não se desfaz.
Quem governa isso é a linha `envio:`, que é outra linha e de outra natureza.
Candidato em `modo: automatico` **não herda** envio automático: quem ligou o
automático para o currículo não ligou para a boca dele.

---

## 4 · O passo a passo

Ela lê a busca inteira e reescreve um arquivo: é tarefa de passos demorados,
então **mostre o TODO na tela**. Ele tem duas vidas. Enquanto ela varre, são os
quatro passos do trabalho; assim que a lista fica pronta **com mais de três
itens**, o TODO passa a ser a lista do dia, na ordem da escada — o que o
candidato quer ver andando é o dia dele, não a skill.

**Ela nunca marca um item do dia como feito.** Quem faz é ele, e a marca dele
mora na caixa do `hoje.md`.

### Passo 1 · Varrer

Nesta ordem, e o arquivo dono sempre vence a vista (contrato, seção 1):

```
1  funil.md               etapa, · desde e · próximo: de cada vaga na busca,
                          e o contato que a linha traz, quando traz
2  vagas/_indice.md     estado e atualizado — dá a fila de quem abrir
3  cada arquivo de vaga que a fila apontar, mais as vagas em
                          `estado: aberta`
                          etapa: · ## Combinado · ## Histórico ·
                          contato:
                          link: · estado: · encaixe: · ## Candidatura · ## O que a vaga pede
4  contatos/_indice.md    último contato — só de quem o passo 3 ligou
5  cada arquivo de contato que um contato: aponta
                          ## Combinado · ## Histórico · canal:
6  o hoje.md de ontem      as caixas marcadas e as linhas que outras skills
                          acrescentaram (passo 5)
7  a agenda, se houver     só hoje e amanhã (passo 2)
```

No `drive`, cada `_indice.md` se procura **dentro** da pasta que a linha nomeia:
há dois arquivos com esse nome na busca, e o nome solto devolve os dois
(contrato, seção 1).

**Aqui quem tem `etapa:` é a vaga, e a fila sai das vagas.** O arquivo
do contato não tem etapa, e só é aberto quando um arquivo de vaga aponta
para ele pelo campo `contato:`. Campo vazio ali **não é
defeito**: é o caso comum, e a vaga entra na lista do mesmo jeito. O silêncio
se mede na última linha do `## Histórico` da vaga — e, quando o campo
aponta um contato, vale a data mais nova entre os dois arquivos.

**A busca em pausa.** O `## Arquivo morto` de `vagas/_indice.md` tem
uma linha com o motivo `aceitei`, e nada entrou na busca depois dela: ele
aceitou, e a busca está em pausa. A lista abre dizendo isso, com a data, e só
traz o que ainda anda — conversa em aberto, documento prometido, o que precisa
ser encerrado com educação. **Não oferece mais vagas**: nem
`/vagas:buscar-vagas`, nem a linha de captação do dia vazio. A pausa
acaba quando ele disser que volta a procurar, ou quando entrar uma vaga
depois dela.

Divergiu vista e arquivo — o `_indice.md` diz 5 de agosto e o histórico do
contato tem linha de 12? Vale o arquivo, e a divergência vira uma linha em
`## Falta saber` com o nome de `/vagas:organizar-busca`. **Esta skill não
conserta vista**, pelo motivo do passo 7.

### Passo 2 · A agenda, quando ela está ligada

**`Google Agenda: sim` no `INDICE.md`.** Procure na sessão a ferramenta de
agenda do conector do Google — ela aparece com nome de `list_events` ou
`search_events`. Leia **só hoje e amanhã**: o dia é o assunto, e a semana
inteira é peso sem uso. Avise em uma linha antes de chamar, porque a agenda não
está em `allowed-tools` e a primeira chamada pede permissão — isso é normal.

- **só leitura.** `create_event`, `update_event` e `delete_event` não se usam
  nesta skill, em nenhum modo.
- **agenda desligada, e a busca tem compromisso com hora para hoje ou
  amanhã:** ofereça ligar, em uma linha, pelo guia de
  `references/conectores.md` — e siga sem ela se a resposta for não.
- **evento sem contato na busca** entra na lista como está, com `?` no lugar
  do id, e vira uma linha em `## Falta saber`. Não se cria contato a partir de
  um título de evento.
- **evento que nomeia uma vaga da busca** é da vaga, com o campo
  `contato:` preenchido ou vazio: entra com o id e o apelido
  da vaga. O `?` fica para o evento que não bate com arquivo nenhum, nem de
  vaga nem de contato.
- **hora divergente** entre a agenda e o `## Combinado` da vaga: mostre as
  duas na mesma linha e **não escolha**. A agenda não é vista da busca nem
  arquivo dono — escolher errado faz ele chegar na hora errada.

**`Google Agenda: não`, linha ausente, ou a ferramenta não está na sessão:** a
lista sai só da busca e ela diz isso em uma linha. Não trava, não pergunta e
**não mexe na linha `Google Agenda:`** — `## O que está conectado` é
configuração do candidato.

### Passo 3 · Os gatilhos

Oito, e cada um sai de um campo que existe no gabarito. Gatilho que precisa de
campo inventado não é gatilho:

| gatilho | onde está escrito | vai para | quem resolve |
|---|---|---|---|
| entrevista hoje | `## Combinado` da vaga, ou a agenda | Vence hoje | — |
| confirmação da véspera | entrevista marcada para amanhã | Vence hoje | — |
| respondeu e não teve retorno | `etapa: em contato` e a última linha do `## Histórico` da vaga é do outro lado — só com `contato:` preenchido | Vence hoje | `/vagas:escrever-ao-contato` |
| retorno de entrevista parado | `etapa: entrevista`, a data combinada passou há 5 dias ou mais e nenhuma linha do outro lado depois — só com `contato:` preenchido | Vence hoje | `/vagas:cobrar-o-que-falta` |
| prometido e não chegou | `## Combinado` da vaga com promessa de data já passada — só com `contato:` preenchido | Aguardando retorno | `/vagas:cobrar-o-que-falta` |
| vaga salva e sem candidatura | `etapa: salva` com `· desde` de 3 dias ou mais — ou antes, se `## O que a vaga pede` traz data de encerramento | Parado | `/vagas:candidatar` |
| parado tempo demais | `etapa: candidatada` ou `em contato`, última linha do `## Histórico` há mais de 7 dias, e `contato:` preenchido | Parado | `/vagas:retomar-contato` |
| vaga parada e sem contato | o mesmo silêncio, e `contato: ?` | Parado | — achar com quem falar |
| vaga por julgar | `etapa: nova` com `· desde` de 3 dias ou mais | Parado | `/vagas:triar-vagas` |

Os cortes de dia são estes, e **não se inventa outro**: véspera é 1 dia;
promessa vence no dia seguinte ao prometido; parado é 7 dias; vaga por julgar é
3 dias; vaga salva e sem candidatura é 3 dias; retorno de entrevista é 5 dias.

**O corte de 7 dias do “parado” é grosso de propósito.** Quem mede silêncio
direito é `/vagas:retomar-contato`, que tem prazo por etapa — aqui basta o
sinal, e a linha diz de quem é o assunto. Passou de 45 dias, é caso de
aposentar pela regra 3, e quem aposenta é `/vagas:organizar-busca`: esta
skill nem sugere, só aponta.

`## Combinado` com data em prosa — “sábado de manhã”, “semana que vem” — sem
data escrita: **não vira item de hoje**. Vira `?` e, se o item cairia no topo
da lista, uma pergunta (seção 5). Calcular o sábado de uma frase ambígua é como
marcar entrevista sozinho.

### Dois gatilhos que o conector corrige

Com `WhatsApp: sim` em `## O que está conectado` do `INDICE.md`, confirme estes
dois antes de escrevê-los — os dois afirmam que **nada chegou**, e a busca
só sabe o que alguém anotou:

```
prometido e não chegou   o contato pode ter mandado no WhatsApp e ninguém
                         anotou. Cobrar documento que ele já mandou é o erro
                         que faz o candidato parar de confiar na lista
parado tempo demais      ultima_interacao dá a data exata e de quem foi a
                         última palavra, no lugar da conta por dias sem registro
```

Chegou e a busca não sabia? O item **não entra** em `## Prometido e não
chegou`. Ele vira uma linha em `## Falta saber` dizendo que a conversa tem algo
que os arquivos não têm — e o conserto é `/vagas:organizar-busca`, que é
quem traz conversa para dentro. Esta skill não grava conversa.

Arquivo de vaga com o campo `contato:` vazio não tem
conversa para reler, com conector ou sem: os dois gatilhos valem pelo que está
escrito no `## Histórico` da vaga. Não procure a conversa pelo apelido
da vaga — conversa se acha por telefone, e telefone é de gente.

A releitura paga duas vezes: ela tira da lista o item que já se resolveu, e é o
que entrega à skill dona o texto certo para mostrar. Cobrar documento que já
chegou é o erro que faz o candidato parar de confiar na lista; **mandar** essa
cobrança é o mesmo erro, com o contato de testemunha.

Sem conector — o normal —, os dois gatilhos valem como sempre valeram, e a
lista sai igual. **Nada aqui depende dele.**

### Quatro que terminam em mensagem

Com `WhatsApp: sim` e a linha `envio:` em qualquer coisa que não seja `não`,
quatro gatilhos chegam à skill dona com destinatário e texto prontos — e é só
por isso que a linha deles na lista diz `sai daqui` (seção 6):

```
respondeu, sem retorno    /vagas:escrever-ao-contato   conversa viva, e é o caso
                          de menor risco que existe — só com `contato:`
                          preenchido, como as outras três
retorno de entrevista     /vagas:cobrar-o-que-falta    só depois de reler a
parado                    conversa, senão cobra o que já chegou
prometido e não chegou    /vagas:cobrar-o-que-falta    idem
parado tempo demais       /vagas:retomar-contato       com as travas dela:
                          7 dias de cadência, nunca a terceira, ângulo novo
```

Os outros não terminam em mensagem, e o motivo é diferente em cada um: **entrevista
de hoje** é entrar na chamada, e a confirmação da véspera já é o gatilho de
cima; **vaga por julgar** não tem o que dizer a ninguém ainda — a vez é de
`/vagas:triar-vagas`; **vaga salva e sem candidatura** sai por formulário, e
o botão é do candidato; e **vaga parada e sem contato** não tem destinatário —
o que se faz com ela é achar com quem falar.
Item sem skill dona não ganha `sai daqui`, nem com o conector ligado — inventar
uma para ele é o lote entrando pela porta dos fundos.

**Arquivo de vaga que parou, com o campo `contato:`
vazio, não termina em mensagem, em gatilho nenhum** — não há para quem mandar.
Ele continua na lista, no degrau que o gatilho dá, e a frase acionável é
**achar com quem falar**: quem responde por essa vaga, e por onde. É assim
que a linha sai, na tela e no `hoje.md`, e ela nunca ganha `sai daqui`.
Inventar destinatário para fechar a linha é pior que deixá-la aberta.

### Passo 4 · A escada da consequência

A ordem não é cronológica. Seis degraus, de cima para baixo:

```
1  hora marcada hoje      entrevista de hoje, compromisso de hoje na agenda
                          passou da hora, passou — não há como refazer o dia

2  janela que fecha       confirmação da véspera, proposta com prazo de
                          resposta, inscrição que o anúncio encerra hoje ou
                          amanhã
                          amanhã já é tarde para esta

3  quem respondeu         resposta sem retorno, pergunta em aberto
                          o relógio é do outro lado: ele te escreveu e você
                          não voltou, e é assim que um processo esfria

4  o que eles devem       retorno de entrevista parado, prometido e não chegou
                          o interesse já existe; o que segura é o processo
                          deles

5  o que a semana come    candidatura sem resposta, retomada devida, vaga que
                          vale e sem candidatura
                          um dia a mais não muda uma; a soma de trinta é a
                          vaga que fechou sem você

6  só oportunidade        vaga por julgar, e a vaga parada e sem contato —
                          achar com quem falar
                          nada aqui tem data, e nenhuma conversa morre hoje
                          por causa delas
```

Empate dentro do mesmo degrau, nesta ordem: sobe quem tem **hora escrita**;
depois quem **espera há mais tempo**; e **dois itens do mesmo contato não se
separam** — o de baixo sobe para junto do de cima, porque os dois são um
telefonema só.

### Passo 5 · O `hoje.md` de ontem, antes de reescrever

Leia o arquivo velho **antes** de gravar por cima. Ele guarda duas coisas que
não existem em nenhum outro lugar:

- **caixa marcada `- [x]`** — é o candidato dizendo que fez. Ela vai para
  `## Concluído nos últimos 7 dias` com a data do título daquele arquivo.
  **Caixa marcada nunca é desmarcada por reescrita**, nem quando a skill roda
  duas vezes no mesmo dia: item que ele marcou de manhã não volta para
  `## Vence hoje` à tarde. Este é o defeito que mais rápido faz o candidato
  parar de marcar caixa.
- **linha que outra skill acrescentou** — e são quatro:
  `/vagas:cobrar-o-que-falta` escreve o que pedir em `## Vence hoje` e o que
  prometeram em `## Aguardando retorno`,
  `/vagas:retomar-contato` escreve a sugestão de arquivar em `## Parado`,
  `/vagas:candidatar` escreve em `## Parado` o formulário que ficou pronto e
  não foi enviado, com o que falta, e
  `/vagas:buscar-vagas` escreve em `## Vence hoje` a empresa de `## Onde olhar`
  que só se olha à mão, no dia dela.
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

  Preparar a entrevista   releio com você a V-018 (Analista de CS Júnior,
                          Lumina Pagamentos) e o que saiu na candidatura, que
                          está em _bruto/ · pronto agora, e nada sai daqui
  Responder a Lívia       /vagas:escrever-ao-contato · a frase da pretensão vem do
                          perfil.md, e ela te mostra o texto e o nome antes de
                          sair qualquer coisa
  Só a lista              nada além do hoje.md, que já está gravado
```

Sem conector, ou com `envio: não`, o custo volta a ser o de sempre — “preciso da
conversa colada” — e o que a skill do item entrega no fim é o bloco para copiar.

**Se houver painel, a lista vai para lá.** Uma lista de seis itens com gatilho,
razão e frase acionável é uma tabela, e tabela no terminal se lê mal. Mostre a
lista na vista `lista`, agrupada pelas quatro seções do dia, com uma ação por
item; a pergunta de por onde começar vira os botões do rodapé. O formato está em
`references/painel.md`.

Duas coisas não mudam por causa dele: a lista sai **igual** — os mesmos itens, na
mesma ordem, com a mesma razão —, e ela também é dita no terminal, porque é lá
que o candidato está olhando. O painel não substitui a resposta; ele é onde
a resposta cabe melhor. Sem painel, ou se ele expirar, siga como sempre foi.

**Esta pergunta não aprova envio nenhum.** Ela escolhe por onde o dia começa. A
de mandar é outra, é da skill do item, e traz o nome de quem recebe, o texto
inteiro e as três saídas. Juntar as duas faz da lista do dia uma esteira de
aprovação: ele responde sete vezes e saem sete mensagens que ele não leu. É o
defeito que a seção 7.1 do contrato existe para impedir.

**No automático**, chame a skill do primeiro item — e só quando **todo o insumo
dela já estiver na busca**. Falta conversa colada, link, documento ou
decisão do candidato: não chame, e a linha do item diz o que falta. Quatro
travas, e elas não se negociam:

- **uma por execução.** A lista do dia não vira meia hora de trabalho sem
  ninguém olhando.
- **nunca `/vagas:candidatar`**, que é a exceção escrita do contrato:
  ela prepara a candidatura inteira e para com o botão de enviar na tela, e
  quem envia é gente.
- **nunca duas skills encadeadas** a partir do resultado da primeira.
- **chamar a skill dona não pula a tela dela.** O automático entrega o trabalho,
  não a decisão: quem diz se a mensagem sai sem perguntar é a linha `envio:` do
  candidato, e o padrão dela é `pergunta sempre`.

Cada chamada vira uma linha em `## Decidi sozinho`, com como desfazer. Saiu
mensagem, porque o `envio:` dele autoriza? A linha diz para quem foi e
transcreve o que foi, e **não oferece desfazer**: apagar para todos deixa a
lápide na conversa, e a notificação já entregou o texto na tela de bloqueio. O
que corrige uma mensagem é a seguinte.

---

## 5 · O que perguntar, quando, e como

Esta skill quase não pergunta — ela lê e resume, e o candidato abriu a sessão
para ver o dia, não para responder formulário. **A lista vem primeiro, sempre.**
Perguntar antes de mostrar é fazer ele esperar por nada.

Uma pergunta por vez, **nunca mais de três na execução**, e cada uma com o
motivo na mesma frase (contrato, seção 8). Só estas três existem aqui:

- **a data em prosa**, e só quando o item cairia nos três primeiros: “o
  `## Combinado` da P-005 (Helena Prates) diz sábado de manhã, sem data — é o
  sábado 22? Se for, a confirmação é hoje e ela sobe para o primeiro lugar.”
- **a linha órfã do `hoje.md` velho**, e só quando ela cairia nos três
  primeiros: “esta linha estava no `hoje.md` de 15 de agosto e não acho o fato
  em nenhum arquivo — ainda vale?”
- **a bifurcação do passo 6**, na UI de perguntas, com o custo escrito.

Não pergunte: se ele quer a lista; se pode gravar o `hoje.md` (é a vista dela);
o que já está escrito na busca; se pode mandar a mensagem, que é pergunta da
skill do item e aqui seria a mesma pergunta duas vezes; nem gosto que
`## Como eu trabalho` já decidiu. Em modo automático não se pergunta: escolhe e
declara.

**Dia vazio** — nenhum item em nenhum degrau. Diga em uma linha, sem sermão:
que não há nada vencendo, e que busca sem vaga nova há dias é assunto de
lista, não dia livre — quem traz vaga é `/vagas:buscar-vagas`. Ofereça `/vagas:retomar-contato` ou
`/vagas:buscar-vagas`, uma vez.

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
Hoje, 14 de setembro — 7 itens

A entrevista das 10h é a única coisa que passa da hora hoje. A Lívia vem antes
das vagas paradas porque ela perguntou a pretensão ontem e ainda não teve
resposta — e recrutadora sem retorno em 24 horas é o processo esfriando na sua
mão.

1  V-018 (Analista de CS Júnior, Lumina Pagamentos) · P-006 (Tiago Moura) · hoje, 10h
   Segunda rodada, combinada em 11 de setembro. Releia o que a vaga pede e o
   que você respondeu na candidatura — está em _bruto/.

2  V-023 (Consultora de Relacionamento, Pátio Varejo) · P-004 (Lívia Matos) · respondeu ontem, sem retorno
   Ela perguntou a pretensão. A frase que você diz está no perfil.md, e ela só
   sai depois de você ler.
   → /vagas:escrever-ao-contato · sai daqui
     Mando agora · Mudo o texto · Eu mesmo mando

3  V-023 (Consultora de Relacionamento, Pátio Varejo) · P-004 (Lívia Matos) · prometido há 3 dias
   Ela ia mandar a escala da loja até 11 de setembro. Cobre o envio, não a
   decisão — é a escala que diz se esta vaga tira você do 6x1.
   → /vagas:cobrar-o-que-falta · sai daqui
     Mando agora · Mudo o texto · Eu mesmo mando

4  V-021 (Operadora de Chat, Trilho Logística) · P-007 (Rita Faria) · candidatada há 12 dias, sem resposta
   Precisa de ângulo novo, não de “passando para saber”.
   → /vagas:retomar-contato — o canal dela é e-mail

5  V-024 (Assistente de Sucesso do Cliente, Malha Telecom) · salva há 6 dias, sem candidatura
   É o primeiro papel do seu perfil, e o anúncio é de 5 de setembro. Ele
   envelhece.
   → /vagas:candidatar — precisa do currículo da vaga; /vagas:montar-curriculo antes

6  V-020 (Atendente de SAC, Rota Delivery) · candidatada há 12 dias, sem contato
   Não há para quem escrever ainda. Achar com quem falar: quem recruta para
   atendimento na Rota Delivery, e por onde.

7  V-026 (Atendente de Chat, Cobre Energia) · nova há 5 dias, por julgar
   Julgar antes que ela feche — sem isso ela só ocupa lugar na pilha.
   → /vagas:triar-vagas
```

Cada item traz, sem exceção: **id com apelido**, o gatilho com o número de dias,
e **uma frase acionável** — o que fazer, com quem, sobre o quê. “Acompanhar o
contato” não é item; “cobrar do P-003 (Bruno Sato) o estudo de
caso da V-022 (Lead PM, Pátio Varejo)” é. O que ela não conseguiu apurar entra como `?` e vira linha em
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
Isto é o que está escrito na busca. Se você fez entrevista, mandou mensagem
ou recebeu documento e não anotou, eu vou cobrar de novo amanhã — passe o que
aconteceu para /vagas:organizar-busca e a lista de amanhã sai certa.
```

### O fecho

```markdown
## Guardei
- ~/busca/hoje.md — reescrito, 8 caixas abertas e 1 do que você marcou nos últimos sete dias

## Falta saber
- se a V-020 (Atendente de SAC, Rota Delivery) tem alguém com nome do outro lado — o arquivo dela diz contato: ?
- de quem é a chamada das 16h na agenda — não achei vaga nem contato com esse nome na busca
- o vagas/_indice.md diz 2 de setembro para a V-021 (Operadora de Chat, Trilho Logística) e o arquivo dela tem linha de 4; /vagas:organizar-busca acerta a vista

## Decidi sozinho
- Respondi a P-004 (Lívia Matos) pelo /vagas:escrever-ao-contato, que era o primeiro item com mensagem e tinha a conversa em _bruto/ — a mensagem está acima e não saiu: o seu envio: diz pergunta sempre, e ela está esperando você. Para não fazer isso, me diga e eu só listo.
- Pus a V-020 (Atendente de SAC, Rota Delivery) abaixo de tudo o que tem data, como “achar com quem falar”, e não escrevi a ninguém por ela. Se você souber quem recruta lá, me diga e ela sobe.
```

O `## Guardei` diz o lugar do jeito que o candidato reconhece, e o jeito muda com
o transporte: no `local`, `~/busca/hoje.md`; no `drive`, `hoje.md, na pasta
busca do seu Drive`. O resto da linha é o mesmo.

`## Decidi sozinho` só existe em modo automático, e cada linha traz **o que fiz
— por que — como desfazer**. A única exceção é a mensagem que saiu: ali não há
terceiro campo, e a linha transcreve o texto e nomeia quem recebeu, em vez de
prometer um desfazer que não existe.

---

## 7 · O que ela grava, e onde

Ela tem `Write` e `Edit` por um arquivo só: **o `hoje.md` da busca, que é a
vista dela e a única que se refaz inteira todo dia.** As outras skills
acrescentam linha nele; esta reescreve.

A gravação vai pelo transporte da linha `busca:` (contrato, seção 1): no
`local`, escrita de arquivo com caminho absoluto; no `drive`, atualizar o
arquivo com o conteúdo inteiro, ou criá-lo com a pasta `busca` declarada como
pai quando ele ainda não existe. Como ela reescreve o arquivo todo, e sempre
depois de ler o velho (passo 5), o “leia antes de atualizar” do contrato já está
no passo a passo — o que não pode é gravar o dia sem ter lido o de ontem.

**Nenhum outro arquivo é tocado.** Nem `funil.md`, nem os dois `_indice.md`,
nem arquivo de contato ou de vaga, nem `INDICE.md`, nem `_bruto/`. A razão é
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
# Hoje — 2026-09-14

## Vence hoje
- [ ] V-018 (Analista de CS Júnior, Lumina Pagamentos) · P-006 (Tiago Moura) — entrevista 10h, segunda rodada, combinada em 2026-09-11
- [ ] V-023 (Consultora de Relacionamento, Pátio Varejo) · P-004 (Lívia Matos) — responder: perguntou a pretensão ontem e não teve retorno
- [ ] V-023 (Consultora de Relacionamento, Pátio Varejo) · P-004 (Lívia Matos) — cobrar a escala da loja, prometida para 2026-09-11

## Parado
- [ ] V-021 (Operadora de Chat, Trilho Logística) · P-007 (Rita Faria) — candidatada há 12 dias, sem resposta; é caso de /vagas:retomar-contato
- [ ] V-024 (Assistente de Sucesso do Cliente, Malha Telecom) — salva desde 2026-09-08 e sem candidatura; é caso de /vagas:candidatar
- [ ] V-020 (Atendente de SAC, Rota Delivery) — candidatada desde 2026-09-02, sem contato: achar com quem falar
- [ ] V-026 (Atendente de Chat, Cobre Energia) — nova desde 2026-09-09 e por julgar; é caso de /vagas:triar-vagas

## Aguardando retorno
- [ ] V-023 (Consultora de Relacionamento, Pátio Varejo) · P-004 (Lívia Matos) — ia mandar a escala da loja até 2026-09-11, três dias

## Concluído nos últimos 7 dias
- [x] 2026-09-10 — e-mail enviado à P-004 (Lívia Matos), V-023 (Consultora de Relacionamento, Pátio Varejo)
```

Quatro coisas ao gravar, e as quatro já quebraram um arquivo em algum lugar:

- **as quatro seções ficam na página mesmo vazias**, com `- nada aqui hoje.`
  Sumir com a seção faz o candidato achar que a skill esqueceu.
- **`## Vence hoje` é o que tem de ser feito hoje, não o que expira hoje.** É
  por isso que a confirmação de uma entrevista de sábado entra nele na sexta — é a
  leitura do próprio gabarito.
- **dentro de cada seção, a ordem é a da escada** (passo 4). Entre as seções, a
  ordem é a do gabarito, e não se troca.
- **o teto é 15 caixas no arquivo inteiro** (contrato, seção 9). Estourou: corte
  primeiro o `## Feito`, do mais antigo para o mais novo, porque nenhuma linha
  dele é trabalho a fazer; se ainda estourar, corte de baixo da escada para
  cima. **E diga na tela o que ficou de fora**, em uma linha, agrupado: “quatro
  vagas sem currículo ficaram fora do arquivo — estão na lista acima.” Item
  cortado em silêncio é item perdido.

Se o candidato colar uma conversa no meio da execução, a ordem é a da seção 7 do
contrato e **não é esta skill que faz isso**: grave o bruto primeiro no
`_bruto/` da busca, em `AAAA-MM-DD-<canal>-<apelido-curto>.md`, com o
cabeçalho de três linhas, e mande extrair fato com
`/vagas:organizar-busca` ou `/vagas:importar-a-conversa`, conforme o caso.

---

## 8 · Onde ela para

Sete limites. Ler os sete custa menos que descobrir um no meio da semana.

**Ela só sabe o que está escrito.** Vaga que você recusou ontem no telefone e
não anotou continua na lista de hoje como conversa parada — ela vai cobrar, com
toda a segurança do mundo, uma coisa que já acabou. É o limite mais caro do
pack, e a saída dela diz isso todo dia em uma linha, com o convite de passar o
que aconteceu para `/vagas:organizar-busca`. A lista de amanhã só é boa
se a busca de hoje for.

**O áudio saiu desse limite, e só ele.** Com o conector de pé, nota de voz
chega transcrita e conta como qualquer mensagem escrita. O que ficou fora
continua fora: telefone, conversa presencial, áudio de grupo e o que é
anterior à ponte.

**A escada é escrita, não medida.** Os seis degraus e os cortes de dia vieram
do que costuma fazer perder vaga, não do seu mês. Dois itens do mesmo degrau
podem estar na ordem errada para o seu dia — diga qual sobe, que a lista se
refaz na hora. O que ela não faz é fingir que a ordem é um cálculo.

**Da agenda ela só lê, e só enxerga o que está escrito lá.** Compromisso que
você guarda na cabeça, ou marcado no papel, não aparece — e a agenda ligada dá
a impressão contrária, que é o que torna isso perigoso. Sem conector, a lista
sai só da busca, e ela avisa.

**Ela não abre link e não confere se a vaga segue aberta.** Ela não desce ao degrau 5 da ordem
de busca: a lista do dia não precisa de dado novo de vaga, e site que monta a
página por JavaScript devolveria nada de qualquer jeito. A empresa, o cargo e o
regime saem do arquivo, com a data que está lá.

**Sem o conector, ela não sabe se o contato respondeu por fora.** A última
mensagem dele só entra na busca quando alguém cola a conversa, e por isso
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
busca como a única fonte (é o comportamento “sem conector”, que já está
escrito acima) e siga. **Não pare a skill por isso** — o dia dele continua
existindo.

**O silêncio ela mede grosso.** Sete dias em qualquer etapa, e é de propósito:
quem tem prazo por etapa é `/vagas:retomar-contato`. Uma vaga pode aparecer
aqui um dia antes ou um dia depois do que aquela skill diria.

**Ela não decide nada que é seu.** Não diz se a proposta é boa, não sugere
baixar a pretensão, não promete prazo de RH, do gestor ou de comitê de contratação, não
aposenta ninguém e **não manda mensagem nenhuma, nem com o conector ligado**.
Ela mostra o dia e aponta a porta de cada item; quem entra é você — e onde a
porta é uma mensagem, quem manda é você também, na tela da skill que a escreveu,
com o nome de quem recebe e o texto inteiro na frente.
