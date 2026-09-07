# Pack do corretor de imóveis

**Dez skills de IA, em português, para quem vende e aluga imóvel.**

Elas escrevem o anúncio, respondem o lead, montam a visita, cobram o documento e
lembram de quem sumiu — usando o que você já contou antes. Você não repete a
mesma informação duas vezes.

---

## Como funciona, na prática

Chegou uma mensagem pelo portal. Você cola a conversa no Claude Code:

```
Rafael Prado: oi, vi o anúncio do apartamento no Menino Deus. ainda tá disponível?
Rafael Prado: to procurando 2 dorm, com garagem
```

E digita:

```
/corretor:responder-lead
```

**Ela devolve a mensagem pronta para colar no WhatsApp:**

> Rafael, o do Menino Deus ainda está disponível.
>
> É 2 dormitórios com vaga, e entrou outro parecido essa semana, a duas quadras
> daí.
>
> https://imobiliaria.com.br/imovel/8812
>
> Quer ver os dois no sábado de manhã?

**E, embaixo, o que ela guardou e o que ficou faltando:**

```
## Guardei
- ~/carteira/clientes/C-032-rafael-prado.md — criado
- ~/carteira/_bruto/2026-08-19-whatsapp-rafael.md — a conversa, como veio

## Falta saber
- o telefone do C-032 (Rafael Prado) — a conversa colada não traz o número
- se ele quer comprar ou alugar — não disse
```

Da próxima vez que essa pessoa aparecer, a ferramenta já sabe o que ela procura,
o que ela viu e o que você prometeu.

---

## Como instalar

Duas portas, e a pergunta que decide é uma só: **o programa em que você usa IA
abre pastas do seu computador?**

| Onde você usa IA | Por onde entrar |
|---|---|
| Claude Code, Codex, ChatGPT do computador, Copilot, Cursor | **Porta 1** — o agente instala as dez ferramentas |
| ChatGPT na web ou no celular, Gemini, Claude no navegador | **Porta 2** — você cola um prompt |

---

## Porta 1 · O agente instala o pack

### 1. Tenha um agente aberto

Serve o **Claude Code** (<https://claude.com/product/claude-code>), o **Codex**,
o **ChatGPT do computador**, o **Copilot** ou o **Cursor**. Todos funcionam em
Windows, Mac e Linux.

> **Atenção:** todos são serviços pagos. Não existe versão gratuita. Se você não
> tem nenhum, vá pela porta 2 — o Gem do Gemini é grátis.

### 2. Copie este pedido e cole no seu agente

Ele instala sozinho. Você não precisa baixar nada nem procurar pasta nenhuma.

```
Instale o pack do corretor da Oficina Kapstan, que está no repositório público
https://github.com/kapstanhq/oficina

São arquivos de texto — SKILL.md e referências em markdown. Não há script para
executar e nada para compilar: a instalação é copiar pastas.

1. Se você for o Claude Code, o caminho curto é o marketplace:
       /plugin marketplace add https://github.com/kapstanhq/oficina.git
       /plugin install corretor@kapstan-oficina
   A URL inteira, e NÃO o atalho `kapstanhq/oficina`: o atalho clona por SSH
   por padrão e falha em quem não tem chave carregada no ssh-agent.
   Para atualizar depois, o pedido é explícito — marketplace de terceiro não
   atualiza sozinho: /plugin marketplace update kapstan-oficina
   Se você for o Codex, o atalho equivalente é o $skill-installer.
   Funcionando um dos dois, pule os passos abaixo.

2. Senão, descubra qual é a pasta de skills da ferramenta em que você roda:
       Claude Code                     ~/.claude/skills
       Codex ou ChatGPT no computador  ~/.agents/skills
       Copilot ou Cursor               .agents/skills
       outra                           a que a sua documentação indicar

3. Baixe o repositório para uma pasta temporária.

4. Copie as dez pastas de corretor/skills/ para a pasta de skills, inteiras —
   inclusive a subpasta references/, que as skills leem para funcionar.

5. Confira: cada pasta copiada tem um SKILL.md e um references/CONTRATO.md.
   Me diga quantas chegaram.

6. Apague a pasta temporária.

7. Me diga o comando para montar a carteira: /corretor:comecar, ou /comecar se
   a sua ferramenta não usar prefixo.

Antes de começar, me mostre o que você vai fazer e em que pastas vai escrever.
```

O pedido manda o agente **mostrar o que vai fazer antes de fazer**. Leia, e só
então deixe seguir.

### 3. Monte a sua carteira

```
/corretor:comecar
```

Leva cerca de 10 minutos. A primeira pergunta é em que pasta do seu computador a
carteira vai morar. Daí em diante ele pergunta uma coisa de cada vez, salva
conforme avança, e você pode fechar no meio e voltar depois. No fim, a sua
carteira já tem um imóvel e um cliente de verdade dentro.

**Você não precisa saber programar.** É tudo em português.

---

## Porta 2 · Você cola um prompt

**No chat pelo navegador ou pelo celular o pedido acima não funciona**, e não é
escolha: nenhum chat da web abre pastas do seu computador, e nem todos aceitam
receber ferramenta. O que funciona é **colar um prompt** — o pack inteiro num
texto só. Monte o seu em
<https://kapstan.com.br/oficina/corretor-de-imoveis>, que corta as tarefas
que você não usa e já traz os passos do seu serviço, ou copie o arquivo
inteiro de [`PROMPT.md`](PROMPT.md). Cola uma vez e serve para tudo.

| Onde | O que fazer | Quanto leva |
|---|---|---|
| **Gemini** | um Gem: o prompt nas instruções e os arquivos da sua carteira em **Conhecimento** | 3 min |
| **ChatGPT** na web ou no celular | um Projeto ou um GPT, com o prompt nas **Instruções** | 3 min |
| **Claude** no navegador | um Projeto, com o prompt nas **Instruções do projeto** | 3 min |
| **Claude** com plano Pro, Max, Team ou Enterprise | melhor que o prompt: a ferramenta em `.zip`, pelas **Configurações** | 3 min |

O passo a passo de cada um, com o nome de cada botão, está no
[README da Oficina](../README.md#porta-2--você-cola-um-prompt).

Duas coisas para saber antes: o `.zip` do Claude exige **execução de código**
ligada nas configurações, e em nenhum dos quatro a carteira mora — no navegador
não existe pasta do seu computador. O que a ferramenta sabe ali é o que você
anexar ou colar, e o que ela escreve sai na conversa.

---

## As dez ferramentas

| Comando | O que faz |
|---|---|
| `/corretor:comecar` | Monta a carteira e testa o que está conectado |
| `/corretor:anunciar-imovel` | Escreve o anúncio a partir do link ou da ficha |
| `/corretor:conferir-matricula` | Lista o que pode travar a venda |
| `/corretor:gravar-video-do-imovel` | Monta o roteiro do vídeo, plano a plano |
| `/corretor:responder-lead` | Escreve a resposta e diz o que falta perguntar |
| `/corretor:montar-visita` | Escolhe o que mostrar, em que ordem e a que horas |
| `/corretor:retomar-contato` | Acha quem sumiu e escreve a mensagem de volta |
| `/corretor:o-que-fazer-hoje` | Monta a lista do dia a partir da sua carteira |
| `/corretor:documentos-do-negocio` | Diz que papel pedir, de quem e em que ordem |
| `/corretor:organizar-carteira` | Guarda o que chegou e arquiva o que morreu |

Você também pode simplesmente escrever o que quer, em português — “escreve o
anúncio desse imóvel”, “o que eu faço hoje” — e a ferramenta certa é escolhida
sozinha.

---

## O que cada uma faz

### `/corretor:comecar`

Configura tudo. É a primeira coisa que você roda, e roda uma vez só.

- Pergunta em que pasta do seu computador a carteira vai morar, e cria.
- Pergunta se você quer que ela pare para perguntar ou decida sozinha.
- Se você usa Google Agenda, explica como conectar e **testa** — mostra os seus
  compromissos da semana para você confirmar que é a conta certa.
- Ensina a exportar uma conversa do WhatsApp, com o nome de cada botão.
- Pede um link de imóvel e uma conversa, e monta os dois primeiros arquivos na
  sua frente.

Todo passo pode ser pulado. O que você pular fica anotado, e ele volta a
oferecer no momento em que fizer falta.

---

### `/corretor:anunciar-imovel`

Escreve o anúncio do imóvel.

**Você digita:** o link do imóvel no site da imobiliária, ou cola a ficha.

**Ela devolve:**

- Uma versão **para o portal** — mais longa, com os campos que o portal cobra.
- Uma versão **para WhatsApp e redes** — curta, com o link separado.
- Nada de “imóvel dos sonhos” nem “oportunidade única”: ela troca clichê por
  descrição.

Antes de escrever, ela pergunta **o que o anúncio não tem e só você sabe** — o
que você viu na visita, por que o dono está vendendo, como é a rua. É isso que
separa o seu anúncio do texto do portal.

---

### `/corretor:conferir-matricula`

Lê a matrícula e lista o que pode travar a venda.

**Você digita:** o comando, e joga o PDF da matrícula na pasta `_bruto/` ou cola
o texto.

**Ela devolve:**

- Quem consta como proprietário e a cadeia de transmissões.
- Ônus e gravames: hipoteca, alienação fiduciária, penhora, usufruto — com uma
  explicação de uma linha para cada termo.
- Averbações de construção.
- **O que ela não conseguiu ler** — página cortada, carimbo ilegível, anotação à
  mão.

> **Ela lista, não conclui.** Nunca diz “pode vender” nem “está livre”. A leitura
> definitiva é de advogado ou do cartório, e ela repete isso em toda execução.
> É a única ferramenta do pack que nunca decide sozinha.

---

### `/corretor:gravar-video-do-imovel`

Monta o roteiro do vídeo para você gravar com o celular.

**Você digita:** qual imóvel.

**Ela devolve:**

- A sequência de planos, na ordem em que se anda pela casa.
- Para cada plano: quanto tempo, o que enquadrar, para onde andar e **o que
  falar** por cima.
- Os três primeiros segundos, que decidem se alguém assiste.
- A legenda.

Ela pergunta o que não tem como saber: qual o melhor horário de luz naquele
imóvel e o que você prefere não mostrar.

---

### `/corretor:responder-lead`

Escreve a resposta para quem chegou.

**Você digita:** a conversa colada, ou o e-mail que o portal mandou.

**Ela devolve:**

- A mensagem pronta para o WhatsApp, com o link do imóvel.
- Quais imóveis da sua carteira batem com o que a pessoa pediu.
- **O que ainda falta saber**, e uma pergunta só para a próxima mensagem.

Ela cria ou atualiza a ficha da pessoa, anotando por onde ela falou com você.

---

### `/corretor:montar-visita`

Monta a saída de visitas.

**Você digita:** para quem, e em que dia.

**Ela devolve:**

- Quais imóveis mostrar, cruzando o que a pessoa procura com o que ela **já viu
  e por que descartou**.
- A ordem, com o motivo de cada posição, e qual deixar por último.
- Os eventos prontos para você colocar na agenda.
- A mensagem de confirmação de cada visita, pronta para colar.

Se a Google Agenda estiver conectada, ela lê os horários livres. Se não estiver,
pergunta e segue — nunca trava por isso.

---

### `/corretor:retomar-contato`

Acha quem parou de responder e escreve a mensagem que traz de volta.

**Você digita:** só o comando.

**Ela devolve:**

- A lista de quem está parado, há quanto tempo, e em que ponto parou.
- Uma mensagem para cada um — que **cita o que a pessoa já viu** e traz algo
  novo. Mensagem de retomada sem novidade é cobrança.
- Ela nunca repete a abordagem anterior: lê o que já foi mandado e muda o
  ângulo.

Quem não respondeu a duas retomadas sai da lista, e ela sugere arquivar.
Insistir queima o contato.

---

### `/corretor:o-que-fazer-hoje`

A lista do dia. É a primeira coisa para abrir de manhã.

**Você digita:** só o comando.

**Ela devolve** os itens ordenados pelo que faz perder negócio hoje:

- Visita marcada e confirmação a fazer na véspera.
- Quem prometeu documento e não mandou.
- Quem está parado há tempo demais.
- Imóvel captado e ainda sem anúncio.

Cada item diz o que fazer numa frase, e ela se oferece para resolver o primeiro
ali mesmo.

---

### `/corretor:documentos-do-negocio`

Diz que papel pedir, de quem, e em que ordem.

**Você digita:** de qual negócio.

**Ela pergunta o tipo** — venda à vista, financiada, com FGTS, permuta, locação
com fiador, com seguro-fiança ou com caução — e **devolve a lista separada por
quem entrega**: comprador, vendedor, imóvel, imobiliária. Lista misturada é o
que faz cobrar a coisa errada da pessoa errada.

Para cada documento: o que é, quem emite, quanto costuma demorar e **o que trava
se ele faltar**. Ela marca o que já está na sua carteira e deixa os pendentes na
lista do dia com o nome de quem tem que providenciar.

> Exigência muda por banco, cartório e estado. Ela trata a lista como ponto de
> partida e avisa isso na primeira linha.

---

### `/corretor:organizar-carteira`

Guarda o que chegou e limpa o que morreu.

**Você digita:** só o comando.

**Ela faz:**

- Lê tudo o que você jogou na pasta `_bruto/` — conversas, PDFs, links — e
  transforma em informação nos arquivos certos.
- Arquiva cliente parado há mais de quatro meses e imóvel já vendido ou alugado,
  deixando uma linha com o desfecho.
- Aponta as inconsistências: cliente sem ficha, imóvel citado que não existe,
  informação que você já respondeu numa conversa e não foi anotada.

**Ela relata tudo o que moveu.** Nada sai em silêncio, e nada é apagado —
arquivar é mudar de gaveta.

---

## Onde ficam os seus dados

Numa pasta do seu computador. Você escolhe qual no `/corretor:comecar`:

```
carteira/
├── imoveis/
│   ├── V-071-casa-3d-azenha.md
│   └── A-014-apto-2d-menino-deus.md
├── clientes/
│   └── C-017-joana-ribeiro.md
├── _bruto/              ← onde você joga conversas, PDFs e prints
├── hoje.md              ← a lista do dia
├── funil.md             ← quem está em que etapa
└── INDICE.md            ← o resumo de tudo
```

A primeira linha do `INDICE.md` diz onde ela mora:

```
carteira: local · C:\Users\seu-nome\carteira
```

`local` é o seu computador, e depois do `·` vem a pasta. Quem escreve essa linha
é o `/corretor:comecar`, e as dez ferramentas leem e obedecem.

São arquivos de texto comuns. Você abre no Bloco de Notas, imprime, copia para
um pendrive. **Nenhum passa por servidor da Kapstan**: eles não saem da sua
máquina.

**A carteira é sua e vai com você.** Se trocar de imobiliária, ela vai junto. Se
parar de usar as ferramentas amanhã, os arquivos continuam lá e continuam
legíveis. Abri-la no celular ainda não existe: o que resolveria é uma cópia no
seu Google Drive, gravada a partir do computador, e ela não está pronta.

Cada informação guardada diz **de onde veio**:

```
o que precisa ter: 2 dormitórios, uma vaga  ← _bruto/2026-08-19-whatsapp-rafael.md
o que não aceita: térreo de frente para avenida  ← corretor, 2026-08-19
pagamento: ?  ← perguntar na próxima mensagem
```

O `?` é de propósito: é o que ninguém apurou ainda, e é o que ela vai perguntar
da próxima vez.

---

## Dois modos de trabalhar

No arquivo `INDICE.md` da sua carteira existe uma linha:

```
modo: copiloto
```

| Modo | Como se comporta |
|---|---|
| **copiloto** | Para nas escolhas e pergunta antes de decidir |
| **automatico** | Escolhe sozinha e, no fim, diz o que escolheu e como desfazer |

Troque a palavra quando quiser. Começa em `copiloto`.

`conferir-matricula` é a exceção: ela nunca decide sozinha, nem no modo
automático.

**Mandar mensagem não entra nesse acordo.** Com o conector de WhatsApp ligado
aparece uma segunda linha, `envio:`, que governa só isso e começa em `pergunta
sempre`. Troque para `responder sem perguntar` — responde conversa viva direto,
e continua perguntando para começar conversa nova — ou para `não`, e aí ela nem
oferece. O `automatico` não liga o envio: quem ligou o automático para o
anúncio não ligou para o que sai no seu nome.

---

## Em que programas isto roda

O passo a passo acima é o do Claude Code, que é o caminho testado. As mesmas dez
ferramentas também carregam no Codex e no ChatGPT do computador
(`~/.agents/skills`), no Copilot e no Cursor (`.agents/skills`) — e quem
descobre a pasta e escreve nela é o pedido colado da porta 1.

A carteira mora no computador, então tudo funciona nos programas que abrem pasta
— Claude Code, Codex, Copilot, Cursor, ChatGPT do computador. **No chat da web
não existe pasta**: lá não há carteira, e o que a ferramenta sabe é o que você
anexar — no Gemini, os arquivos que você põe em **Conhecimento** do Gem.

Sem carteira nenhuma — chat da web, só o [`PROMPT.md`](PROMPT.md) colado —
cinco ferramentas continuam entregando o trabalho, com o que você colar na
conversa:

| Ainda funciona | Com o quê |
|---|---|
| `/corretor:anunciar-imovel` | a ficha ou o link que você colar |
| `/corretor:conferir-matricula` | a matrícula colada |
| `/corretor:gravar-video-do-imovel` | o imóvel que você descrever |
| `/corretor:documentos-do-negocio` | o tipo do negócio — sem marcar o que você já tem |
| `/corretor:responder-lead` | a conversa colada — sem cruzar com os seus imóveis |

E aí elas avisam, no fim: `nada foi gravado — você está sem carteira aqui`.

As outras cinco — `comecar`, `o-que-fazer-hoje`, `retomar-contato`,
`montar-visita` e `organizar-carteira` — não funcionam sem carteira, porque o
trabalho delas **é** a carteira. Cada uma diz isso em uma linha e para.

---

## Onde este pack para

Vale saber antes de instalar, e não depois.

| Limite | O que isso significa na prática |
|---|---|
| **WhatsApp não conecta sozinho** | O padrão é você exportar ou colar a conversa, e isso funciona em qualquer lugar. Em programa que roda no seu computador dá para ligar um conector — não é da Meta, é instalação à parte de uns quinze minutos. Com ele, ela **lê** as suas conversas e **manda uma por vez**: quem vai receber e o texto inteiro aparecem na sua tela antes, e nada sai sem você mandar sair. Lote e lista de transmissão não existem em lugar nenhum do pack. |
| **CRM da imobiliária não conecta** | Nenhum conecta sem a imobiliária autorizar. Por isso a carteira é sua, e não do CRM. |
| **Alguns sites não são lidos** | Quando o link não abrir, ela avisa e pede a ficha colada. Ela não chuta dado de imóvel — preço adivinhado vira mentira no WhatsApp do cliente. |
| **Ela não manda áudio nem arquivo** | Pelo conector sai texto, e só para uma pessoa. Foto, áudio, documento e grupo saem do seu WhatsApp, na mão. |
| **Ela não decide o que é seu** | Preço, aceitar proposta, dizer que a documentação está em ordem: ela mostra o que olhar e para. |
| **Documento é assunto de advogado** | Ela lê a matrícula e lista o que olhar. Não faz as vezes de advogado nem de cartório. |

---

## Atualizar

```
/plugin update corretor@kapstan-oficina
```

Vale rodar de vez em quando. Ferramenta que envelhece parada no computador é
pior que ferramenta que não existe — é por isso que isto se instala e se
atualiza, em vez de ser uma pasta de arquivos para copiar.

Na porta 2 não há comando: atualizar é abrir o [`PROMPT.md`](PROMPT.md) de novo
e recolar por cima das instruções do Gem, do GPT ou do Projeto.

---

## Achou um erro, ou faltou alguma coisa?

Abra uma questão em <https://github.com/kapstanhq/oficina/issues>. O que você
reescreve toda semana e não está aqui vira a próxima ferramenta.

---

## Licença

MIT. Pode usar, mudar e distribuir, inclusive comercialmente.
