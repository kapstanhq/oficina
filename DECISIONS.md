# Decisões — Oficina

Registro público das decisões que governam este repositório: o motor, os
packs, o painel, os conectores, os documentos e o montador. O código cita
cada uma pelo número — `(D232)` num comentário quer dizer "a razão está na
seção D232 deste arquivo".

As decisões nasceram no registro privado da Kapstan e foram extraídas para cá
na migração (D267), **com o número original mantido**: é por isso que a
numeração tem buracos. Só entram as que o código cita. Dado pessoal, empresa
e vaga reais de quem usou o pack na prova foram trocados por exemplo genérico;
a lição e a medição ficaram.

**Estado vazio quer dizer que a decisão vale como está escrita.** Preenchido,
ele diz quem mexeu nela.

## Índice

| # | Decisão | Estado |
|---|---|---|
| D111 | O buraco negro passa a vestir as duas cores da marca | emendada depois, no site |
| D145 | A Oficina é um plugin com carteira, e o primeiro pack é do corretor | emendada pela decisão da página do pack, no site |
| D167 | Tailwind e Svelte entram — só onde há o que é interativo, só por `import()` |  |
| D197 | O conector passa a ENVIAR, uma por vez e com o texto na tela — e a ferramenta informa em vez de impedir |  |
| D200 | O pack para de prometer o que não faz, o motor deixa de falar o ofício, e a página ganha o degrau do meio | fechada em parte pela decisão que fechou o molde de um pack |
| D229 | O motor vira sistema base: quatro bordas fixas, e o meio é do agente |  |
| D230 | O painel ganha casa — uma página inicial que lê a base —, e a candidatura pode apertar o botão depois do sim |  |
| D231 | O painel é de quem nunca abriu um terminal: três lugares, e a ação vem antes do arquivo |  |
| D232 | A pessoa decide quando quiser: a fila de decisões — e, depois, o botão que chama o assistente |  |
| D233 | Mudança no painel não pede mais para fechar o Claude |  |
| D234 | O painel depois do D233: seis defeitos, a fila barata, e o que a pessoa leiga percebe |  |
| D235 | O próximo passo: cada item diz o que vem agora, e o agente pode apontar |  |
| D236 | Os nomes são os de plataforma: nova · salva · candidatada · em contato, e o painel fala como o LinkedIn |  |
| D238 | A resposta não se perde: o que a pessoa responde depois de o agente parar de esperar fica guardado, e chega por todos os canais |  |
| D239 | Relações por id: o item é dono do seu id, e o resto que o carrega é documento dele |  |
| D240 | O regime é a primeira coisa que uma vaga diz — e o pack declara o que se lê antes de tudo |  |
| D241 | O filtro da busca não é fato: o regime que o LinkedIn "devolve" é o que a empresa cadastrou |  |
| D242 | Revisar uma por uma: o baralho do funil, o verbo de cada etapa, e o menu revisto | superada em parte por D244 |
| D243 | O painel sempre ligado: um processo por máquina que não depende de conversa aberta |  |
| D244 | Lista e detalhe no lugar do baralho, e o painel montado de blocos que a base pode reordenar |  |
| D245 | A pasta dos itens É o funil, e completar o que falta vira ação de um clique |  |
| D257 | O próximo passo sai do estado da vaga, "Mais" tem todas as ações, e a página do item é redesenhada |  |
| D258 | As pastas de documentos e de pessoas dizem de quem é cada coisa, e o arquivo longo se lê sem a procedência na frente |  |
| D259 | Toda tela que espera resposta tem um recado geral, e o campo ou item pode ter o seu |  |
| D260 | A Gupy entra nas sessões salvas, e a candidatura pede o login pela tela de Integrações |  |
| D262 | O que espera a pessoa fica gravado antes da espera, e o botão que ela aperta depois vira decisão |  |
| D263 | O modelo continua Opus; o esforço é por skill, declarado pelo pack e medido no livro | emendada por D277 |
| D264 | O início é uma fila de passos: um item por linha, com o botão, e a pilha a julgar à parte |  |
| D265 | A tela de tarefa lê como as outras: a origem atrás do interruptor, e o documento como documento |  |
| D266 | Entre salva e candidatada, duas fases que se leem da ficha: pesquisada e com currículo |  |
| D267 | A Oficina vira código aberto de fato: a fonte é o `kapstanhq/oficina`, e o vagas entra por último |  |
| D270 | Documentos: o motor faz o PDF, o pack faz o modelo |  |
| D271 | Completar vai atrás da vaga, e o botão enxerga o que a conversa enxerga |  |
| D272 | Entrar uma vez: a sessão do site fica salva, e todo agente a usa |  |
| D273 | A carta de apresentação: sob medida ou nenhuma, uma página, e rascunho até o candidato ler | emendada por D275 |
| D274 | A pasta dos itens abre numa tabela, e uma ordem só vale para as três vistas |  |
| D275 | A carta encolhe para meia página, e o resumo do currículo não repete a experiência |  |
| D276 | A candidatura espera o envio com o navegador aberto, e sugere o que só ele decide |  |
| D277 | O pack de vagas vai a público: qualquer profissão, fontes que os termos permitem, e o painel que o pack configura |  |

---

## D111 · O buraco negro passa a vestir as duas cores da marca

`data: 2026-08-13`
`estado: emendada depois, no site`

Decisão do site da Kapstan (a paleta de uma animação da home), citada aqui só
pela lição: quatro consumidores que liam a mesma cor de dois lugares
divergiram, e passaram a ler de um. Por isso o `@theme` do painel aponta para
os tokens de `base.css` em vez de declarar paleta própria — duas fontes de
token para a mesma cor foi como a página ganhou um segundo preto.

---

## D145 · A Oficina é um plugin com carteira, e o primeiro pack é do corretor

`data: 2026-08-19`
`estado: emendada pela decisão da página do pack, no site`

A decisão anterior que criou a Oficina dizia **"skills, agentes e MCPs"** e
**"para quem não é técnico"** no mesmo parágrafo — e instalar um MCP é editar
um JSON. É essa distância que esta decisão fecha. A Oficina continua gratuita
e nunca cobrada.

### O pack é um PLUGIN, e é disso que ele vive

Skill solta é arquivo que se copia. Plugin é conjunto que se instala **e se
atualiza**. Skill que envelhece no computador de alguém morre em silêncio — e
skill morta é pior que skill inexistente —, e um comando de atualização é o
que impede isso.

```
kapstanhq/oficina                   o repositório público, que é o marketplace
├── .claude-plugin/marketplace.json
├── corretor/     UM pack = UM plugin · skills/ + commands/corretor.md
├── contador/     └── advogado/
```

**O prefixo `corretor-` no NOME da skill caiu ao implementar:** o plugin já dá
o namespace. A pasta `skills/anunciar-imovel/` vira o comando
`/corretor:anunciar-imovel`; escrever `corretor-anunciar-imovel` daria
`/corretor:corretor-anunciar-imovel`. A preocupação com colisão continua
certa — skill instalada vive num espaço plano junto com as de todo mundo, e
`anuncio` colidiria na primeira semana —, e quem a resolve é o plugin, não o
nome.

### Duas camadas, uma fonte

O `SKILL.md` é escrito à mão e vai para dois destinos: o repositório público (o
instalável, que é o que vira fonte de terceiro) e a página, onde o **prompt para
colar** é DERIVADO dele — nunca reescrito. Uma função pura, dois chamadores,
divergência impossível.

Cinco das seis primeiras skills funcionam coladas num chat. A sexta —
`retomar-contato` — não funciona, porque um chat esquece e um sistema lembra.

### A carteira

Não é acessório das skills. É o produto, e as skills são as portas dele.

```
~/carteira/
  INDICE.md      o mapa. Toda skill lê primeiro. Teto: 120 linhas
  hoje.md        o que vence, o que travou, o que prometeram e não mandaram
  imoveis/       _indice.md + V-071-casa-3d-azenha.md
  clientes/      _indice.md + C-017-joana-ribeiro.md
  funil.md       quem está em que etapa, desde quando
  _bruto/        conversas coladas, PDFs, links — a ORIGEM, não a verdade
```

**Três regras:**

1. **Se dá para derivar, não se duplica.** O arquivo do cliente guarda FATO; a
   conversa inteira fica em `_bruto/`. Sem isso o arquivo cresce sem fim e o
   agente relê quarenta quilobytes para achar um telefone.
2. **Nada entra sem procedência.** Todo campo leva de onde veio — `← WhatsApp
   12 ago`. O que não se apurou entra como `?`, nunca como estimativa, e o `?`
   é a linha mais útil do arquivo: é o que a skill vai perguntar da próxima
   vez. Campo inventado com cara de apurado é pior que campo vazio.
3. **O que morre é aposentado com data e motivo.** Cliente parado há 120 dias e
   imóvel vendido vão para `arquivo-morto/`, e o índice fica com uma linha e o
   desfecho. Gaveta, não lixeira.

**O id nunca anda sozinho.** Toda menção leva o apelido: `V-071 (casa 3 dorm,
Azenha)`, nunca `V-071`. Ninguém decora quarenta códigos — o id serve para o
arquivo e o link não quebrarem quando o apelido mudar, e o apelido serve para o
corretor saber do que se fala sem abrir nada.

**O link é campo de primeira classe.** O corretor não digita ficha: ele cola o
link do site da imobiliária. *Onde isso para:* site que só monta a página por
JavaScript devolve nada — a skill diz isso na cara e pede a ficha colada, e não
chuta dado de imóvel.

**O canal fica anotado, e ele decide o FORMATO.** Sendo WhatsApp: linha curta,
o link sozinho na própria linha (senão a pré-visualização não abre), uma
pergunta fácil no fim, negrito de asterisco usado quase nunca — e **a voz é a
do corretor, não a da Kapstan**, porque a mensagem sai do WhatsApp dele com o
nome dele.

### Os dois modos, e a obrigação do automático

O **copiloto** para nas bifurcações e devolve o trabalho pronto até ali. O
**automático** escolhe e **declara o que escolheu sozinho** — automático sem
essa declaração é caixa preta, e caixa preta na mão de quem é leigo queima a
confiança no primeiro erro.

Escolhe-se por linha no `INDICE.md` (uma vez), com exceção escrita na própria
skill: `conferir-matricula` NUNCA decide sozinha — ela lista o que pode travar
a venda e quem conclui é gente.

### A skill usa as interfaces do harness

```
escolha entre 2 e 4 caminhos    UI de perguntas — botões, não prosa, e cada
                                opção traz o porquê
tarefa de 3+ passos demorados   TODO na tela — demorar sem mostrar é onde o
                                leigo acha que travou
resultado para colar            bloco de texto e mais nada
resultado para guardar          escreve na carteira e DIZ ONDE
```

Uma pergunta por vez, nunca mais de três: skill que abre com formulário de oito
campos é abandonada na primeira execução.

### O que dá para conectar — conferido em 19 ago 2026

```
agenda de visitas     Google Agenda    conector nativo
e-mail com cliente    Gmail            idem
matrícula, contrato   Google Drive     idem

conversa com cliente  WhatsApp         NÃO EXISTE conector
CRM da imobiliária    Vista            API REST aberta, sandbox público
                      Kenlo            API oficial só depois de homologação
                      Jetimob          a integração documentada é feed de imóveis
portais               Zap, VivaReal    sem conector
```

**A lacuna é o canal principal.** A API oficial do WhatsApp é para número de
empresa, e o corretor atende do número pessoal. A ponte é ele exportar ou colar
a conversa, e a skill saber ler o formato exportado.

**E nenhum CRM é do corretor: todos exigem que a IMOBILIÁRIA autorize.** É o
que confirma a carteira própria como camada base — ela funciona sem pedir
permissão a ninguém, e o corretor troca de imobiliária levando-a junto.

### As dez skills, por etapa

O padrão de nome é **verbo mais objeto**; `triagem` e `roteiro` foram recusados
por não dizerem de quê. `lead` fica, porque é a palavra que o corretor usa.

```
COMEÇAR     /corretor:comecar                 configura tudo, passo a passo
CAPTAR      /corretor:anunciar-imovel         o anúncio, do link ou da ficha
            /corretor:conferir-matricula      o que pode travar a venda
            /corretor:gravar-video-do-imovel  o roteiro, plano a plano
ATENDER     /corretor:responder-lead          a resposta e o que falta saber
            /corretor:montar-visita           quais mostrar, em que ordem
ACOMPANHAR  /corretor:retomar-contato         quem sumiu, e o que traz de volta
            /corretor:o-que-fazer-hoje        a lista do dia, da carteira
FECHAR      /corretor:documentos-do-negocio   que papel pedir de quem
SEMPRE      /corretor:organizar-carteira      guarda o que chegou, poda o morto
```

O `comecar` **executa o que dá e só pede o que só a pessoa pode fazer**: termina
com a carteira já tendo um imóvel e um cliente REAIS (setup que acaba em pasta
vazia não faz ninguém voltar); todo passo é pulável e o pulado fica anotado; é
retomável; e **testa o que conectou**, porque "conectado" sem prova é o erro
que só aparece três dias depois.

### Por que corretor primeiro

Máximo de texto repetitivo, nenhuma trava ética, e quase nada pronto no
mercado. (A ordem dos packs seguintes foi refeita no D200.)

### Recusado

| o que | por quê |
|---|---|
| catálogo de skills soltas | não se atualiza, e morre em silêncio |
| receita só, sem instalável | ninguém dá estrela num parágrafo, e o repositório é a fonte de terceiro |
| "armário" como nome | o corretor já chama de **carteira** — nome não se inventa quando o mercado tem um |

### Ainda não decidido (na época)

- a conta e a licença do repositório público. Sem licença escrita ninguém
  forka, e **é o fork que faz a fonte de terceiro existir**
- meia hora com um corretor de verdade: as dez skills acima são DERIVADAS, não
  observadas

---

## D167 · Tailwind e Svelte entram — só onde há o que é interativo, só por `import()`

`data: 2026-08-21`

Decisão da página da Oficina no site. O que ela deixou para o painel, e é o
que o código cita: **marcação que nasce N vezes ganha nome** — o parágrafo de
utilitário (~600 bytes) repetido num `<li>` que nasce uma vez por seção levou
uma página de 24,2 para 26,3 kB contra um teto de 26, e classes nomeadas com
`@apply` voltaram a custar uma regra por página; o `@theme` aponta para os
tokens de sempre e não declara paleta (D111); `@import` com `layer(...)` põe o
utilitário numa camada que PERDE para qualquer regra sem camada (`padding` saía
0 com `p-s4`); e o build que não reclama não é a página certa — a verificação é
visual.

---

## D197 · O conector passa a ENVIAR, uma por vez e com o texto na tela — e a ferramenta informa em vez de impedir

`data: 2026-08-31`

Ordem do fundador: *"o whatsapp deve sim ter a possibilidade de enviar, mas
nunca em lotes e sempre confirmando antes com usuário o que vai enviar e para
quem"*.

A decisão anterior sobre o conector tinha fechado o contrário — **"O conector
lê. Não manda"** — com o argumento *"disparo automatizado é onde uma conta de
WhatsApp morre"*. A pesquisa mostra que a frase estava **certa sobre disparo e
errada sobre envio**.

### O que a pesquisa achou

Fontes primárias: Help Center do WhatsApp (consultado 30/08/2026), o white paper
*Stopping Abuse* da Meta (06/02/2019), issues do whatsmeow.

**A escada de sanção tem quatro degraus, e o que importa é o segundo.** Aviso →
**restrição** → ban temporário → ban permanente. A conta restrita continua
falando com quem já trocou mensagem, e **não pode iniciar conversa com contato
novo nem usar dispositivos vinculados**.

**A punição mais provável DESLIGA A PONTE**, que pareia como dispositivo
vinculado. O corretor não perde o WhatsApp — perde o produto, em silêncio. Daí
a regra: **nenhuma skill exige o conector, e o pack funciona inteiro sem ele.**

**A fronteira do risco é a relação prévia, não o volume.**

```
responder conversa que o cliente abriu   risco muito baixo — é o único caso que
                                         segue permitido com a conta restrita
contato que já conversou antes           risco baixo, histórico bidirecional
número que nunca respondeu               risco ALTO, e de outra ordem
```

**Volume, na escala de um corretor, não aparece em lugar nenhum.** O exemplo
oficial de abuso é *"conta registrada há cinco minutos tentando mandar 100
mensagens em 15 segundos"*. Os "20-30 por dia" que circulam em blogs não têm
fonte da Meta. Os tetos do `baileys-antiban` (200/hora, 1.500/dia) são
calibrados para quem dispara, e copiá-los protegeria do risco errado.

**A ausência do indicador de digitação é sinal de robô**, nomeado pela Meta. O
whatsmeow envia presença `composing`, e a ponte passa a enviá-la antes de todo
envio.

**O piso de risco já estava pago.** A issue #810 do whatsmeow (09/05/2025)
documenta contas banidas por usar a biblioteca **com uso legítimo, baixo volume
e só lendo**. Envio confirmado **não cria** essa exposição.

**Denúncia é o que rompe o E2E**: o WhatsApp recebe **as cinco últimas
mensagens** enviadas àquela pessoa. Um texto que PARECE disparo vira prova no
instante em que alguém reclama — a variação de texto é defesa técnica.

**Desfazer é teatro.** A notificação já entregou o texto e sobra a lápide "Esta
mensagem foi apagada". **A confirmação antes é a única trava real.**

**Brasil:** enforcement ativo — nas municipais de 2020 o WhatsApp baniu 1.004
contas denunciadas ao TSE, e 63% delas já tinham caído no classificador
automático antes. Mensagem comercial sem opt-in é exposição de LGPD, e ela não
some se a conta nunca cair.

### O princípio, e ele vale além do WhatsApp

O primeiro desenho punha a confirmação FORA do agente, porque o corretor com
quarenta conversas marca "não perguntar de novo" no terceiro envio. O fundador
recusou a premissa: *"isto dai é decisão do usuário, não cabe a nós limitarmos
o que o usuário é capaz de fazer, apenas orientar e informar."*

**A ferramenta informa e a pessoa decide.** Ela recusa o que a pessoa não
pediu — lote —, nunca o que ela pediu. Onde há risco, diz qual é **uma vez, no
ato de ligar**.

```
ESCOLHA DELE      marcar "não perguntar de novo", mandar para quem não
                  respondeu, usar o envio ou não
                  → avisa uma vez, no ato de ligar, e OBEDECE

ERRO              o agente mostra um texto e manda outro; a prévia envelhece
                  → RECUSA, porque ninguém escolheu isso

VETADO            lote, lista de transmissão, broadcast
                  → não existe como FORMA: `conversa` é string, nunca array
```

### O desenho

**Duas tools, e a segunda não aceita texto novo.** `preparar_envio(conversa,
texto)` devolve um código; `enviar_mensagem(previa, conversa, texto)` exige os
três batendo byte a byte. O veto ao lote mora no tipo do parâmetro.

**A prévia mora no daemon**, sob mutex, vale 10 minutos, uso único, e morre se
**chegou mensagem nova naquela conversa depois de criada**.

**O elo entre os dois processos é HTTP em `127.0.0.1`**, porta sorteada, segredo
de 24 bytes em `elo.json` (0600), comparado em tempo constante. Recusadas: fila
em arquivo, socket unix, **fundir `serve` e `mcp`** (o histórico congelaria
quando o agente fechasse) e **um segundo cliente whatsmeow** — dois clientes
sobre o mesmo `sessao.db` corrompem a sessão e derrubam o pareamento.

**Os tetos são ajustáveis e partem do histórico do próprio corretor.** Partida:
6 conversas distintas por hora, 30 envios, 5 s entre dois. Contados **do banco,
não da memória**. **O teto responde no `preparar`**, e a recusa diz o número e
como mudá-lo.

**Tabela `envios`, separada de `mensagens`**, incluindo o que a ferramenta
recusou. O envio grava `de_mim=true` na hora, sem esperar eco.

### A retomada

**Revisar várias e mandar NÃO é lista de transmissão:** N mensagens DIFERENTES,
uma por pessoa, saindo uma a uma espaçadas. A tela carrega **o texto de cada um
inteiro**, **o porquê de cada um estar na lista** e **quem ficou de fora, com o
motivo**. Travas: 7 dias de cadência, a terceira tentativa não sai, nunca o
mesmo ângulo duas vezes.

### O que muda no texto

O bloco para copiar **continua sendo o padrão**. A saída de confirmação "Só o
bloco" vira **"Eu mesmo mando · você copia e cola no WhatsApp"** — o rótulo diz
o que a pessoa vai fazer, não o nome interno da peça.

### O nome do repositório fica

`whatsapp-reader` desconvida quem chega querendo disparo em massa. Trocar
quebraria a URL publicada, o `git clone` da referência, o caminho
`~/.kapstan/whatsapp-reader` e o `serverInfo.name`. **Sem esta linha a próxima
sessão o troca achando que corrige uma mentira.**

### Fora da v1

**Grupo** (recusado pelo TIPO do jid), **anexo, foto e áudio**, **reenvio
automático** e **envio agendado sem ninguém na frente**. E entra a **lista de
quem pediu para não ser contatado**, obedecida antes de qualquer prévia.

### A prova de campo, em 01/09/2026

Pareada com uma conta real, a mensagem saiu para o próprio número do dono, com
confirmação humana de que chegou. Sete verificações passando: a mensagem saiu;
confirmação 71 ms depois da prévia RECUSADA; texto trocado RECUSADO; prévia
reusada RECUSADA; grupo RECUSADO; as recusas gravadas COM MOTIVO; 13 s de
digitação entre preparar e enviar.

**O defeito que só a prova achou:** para número sem nome na lista, a prévia
mostrava o jid duas vezes. **Todo lead novo chega de número não salvo.** Passou
a mostrar `+55 11 9XXXX-XXXX · não está salvo` — quem autoriza precisa saber
que não conhece a pessoa.

**Armadilha de operação:** trocar o binário não troca o daemon; o reinício não
pede QR de novo, porque a sessão vive no `sessao.db`.

### Ainda não fechado

- **`elicitation/create`** (protocolo 2025-06-18): quando o cliente declarar a
  capacidade, prévia→envio vira uma tool só.
- **Meta Verified**: único mitigador com relato consistente, não testado.
- **Os números 6/30/5s** são valor de partida arbitrário.

---

## D200 · O pack para de prometer o que não faz, o motor deixa de falar o ofício, e a página ganha o degrau do meio

`data: 2026-09-03`
`estado: fechada em parte pela decisão que fechou o molde de um pack`

Revisão pedida pelo fundador, com a réplica para outros ofícios no horizonte.

### O que a página vendia e o plugin não tinha

"Planilha" aparecia **26 vezes** na copy da página e **uma** no plugin. O
`comecar` real pedia **um link** e montava **uma ficha**. **A saída foi
construir o que a página prometia:** o `comecar` ganhou o segundo caminho (um
link agora · a planilha inteira), e a `organizar-carteira` importa o `.csv` que
aparecer em `_bruto/`. **A procedência é o arquivo** —
`← _bruto/2026-08-19-planilha-imoveis.csv`. Coluna sem campo no gabarito não
cria campo, linha repetida não vira ficha duas vezes, linha cujo link ou
endereço já existe **atualiza** a ficha. Teto de 200 linhas por lote.

**A causa era de processo:** a página é escrita do wireframe, o plugin do
contrato, e nada cruzava o que a página afirma sobre as skills.

### O motor era motor só no nome

**127 ocorrências do ofício em onze arquivos de `_motor/`** — "corretor" 55
vezes, "imóvel" 22, `/corretor:` 10. Um pack de médico chamaria o médico de
corretor.

Agora cada uma é **marca**, resolvida na montagem por
`<pack>/contrato/vocabulario.json`. São 102 substituições, e o `CONTRATO.md`
remontado sai **byte a byte igual**: 52.238 caracteres, `diff` vazio. Marca sem
valor fica de pé e o `conferir` a acusa; apagá-la daria frase mutilada sem erro.

**E o `conferir` recusa a volta.** `_proibido-no-motor` lista as 21 palavras do
ofício, e nenhuma pode aparecer em `_motor/**` — nem em cerca de código. Pegou
duas na mesma leva, uma delas "a versão do cliente" sobre uma biblioteca: a
palavra é do ofício num sentido e não no outro. Reescrever a frase custou menos
que ensinar a exceção.

`conectar-whatsapp.md` — 196 linhas de motor puro dentro da `comecar` — mudou
para `_motor/referencias/` e vai, resolvida, para a skill que a **cita**.

### O Drive sai da promessa

No Drive a carteira **se cria e não se mantém**: o conector só atualiza título e
pasta, e nove das dez skills existem para mudar arquivo que já existe. Sai do
`plugin.json`, do `marketplace.json`, dos READMEs e do `compatibility` de sete
skills. Saiu junto uma afirmação nunca verificada, a de que um Gem lê a pasta do
Drive.

### O repositório público estava atrás, e nada media

Em 01/09/2026 o `CONTRATO.md` público tinha 1.196 linhas contra 1.237 do local.
`npm run publicar-oficina` passou a espelhar, e `conferirPublicacao()` compara
**pelo sha de blob do git**, sem clonar. É **aviso e não erro**.

### O pack ganhou régua

```
conferirMotor()    as palavras do ofício, e a marca que ficou de pé
conferirSkills()   os quatro campos do frontmatter, os tetos e o molde
```

Tetos que **mordem**: 1.024 caracteres na `description` e 500 no
`compatibility` são teto duro da Skills API. O de 45.000 no `SKILL.md` é "não
cresce".

O molde: os quatro campos, "Antes de tudo", "O modo", "Onde ela para", e
`## Guardei` antes de `## Falta saber`. Achou defeito na primeira execução, e um
de si mesmo: `indexOf("## Falta saber")` casava com uma citação no meio do
texto. Âncora de linha, e o alarme parou de mentir.

### Ler o contrato inteiro custava 20 a 30 mil tokens por invocação

Cada skill leva, em `references/contrato/`, **só as seções que cita** — de 5 a
13 das 21 —, e a abertura nomeia os arquivos. O inteiro continua indo, porque
uma seção cita outra.

### Duas linhas menores

Promessa que a skill vizinha não cumpre é o mesmo defeito da planilha, em uma
linha. E o contrato escreve a regra da **contradição**: fato novo que contradiz
o gravado vale, com a procedência dele, e o antigo desce para `## Histórico`.

### A página e o próximo ofício

A página ganhou o degrau do meio (guardar o pack num Gem ou Projeto). A ordem
dos próximos packs passou a ser médico, advogado e gestor de investimentos, com
dois avisos escritos antes da primeira skill: prontuário é dado sensível pela
LGPD, e a carteira em arquivo local é a forma mais defensável dela; recomendar
ativo é ato regulado pela CVM, e o mecanismo que responde já existe — a
`conferir-matricula`, que **lista e não conclui**.

### E a prova ACHOU, que é o que prova que ela mede

`npm run prova-oficina` roda cada skill sobre uma carteira de fixture e confere
a saída contra o contrato. O `--seco` é o controle: não chama modelo, e prova
que não passa na PRÓPRIA fixture está medindo a fixture. Com um defeito plantado
por regra, as regras acusam com arquivo e linha.

Na primeira bateria: **sete limpas e três acusadas**. Dois achados eram da
régua (`_bruto/**` em `pode_mudar` E em `nao_muda`, de propósito). **O terceiro
é do contrato:** duas skills, fazendo a coisa CERTA, inventaram o próprio título
ou omitiram a seção de gravação. Omitir é o que faz a pessoa achar que ficou
guardado. **`## Guardei` passou a ser obrigatório**, com o motivo quando não
houve gravação. Depois dos consertos, **as dez passam com 12 ✓ e 0 ✗**.

Armadilha da régua: o `deve_conter` era lido como regex, e `C-019 (Rita
Camargo)` virava grupo. Separar em dois padrões soltos faz o teste passar e
deixar de verificar a regra. O padrão é literal; regex vai entre barras.

### Ainda não fechado (na época)

- A bateria inteira leva vinte minutos; o `--seco` é o que se roda sempre.
- As cinco skills de memória são as mais presas ao ofício; o molde de um pack
  precisa estar decidido antes do próximo ofício.
- ~24% de cada skill é o mesmo protocolo reescrito; a checagem de identidade
  byte a byte não existe ainda.

---

## D229 · O motor vira sistema base: quatro bordas fixas, e o meio é do agente

`data: 2026-09-19`

O que se construiu para a Oficina — motor, painel, ponte do WhatsApp — serve a
mais do que pack de ofício. O caso que prova é **busca de emprego**: achar,
triar, candidatar e conversar com recrutador é o mesmo laço da prospecção com
outro alvo.

**O sistema só é rígido onde o agente toca o mundo**, e cada borda tem um
mecanismo em CÓDIGO — instrução em prosa o modelo esquece:

| borda | quem garante |
|---|---|
| **gravar** · o que entra na base, com que procedência | o contrato e o `prova-oficina` |
| **enviar** · o que sai para terceiros | a porta `canal`: prévia com destinatário, teto, silêncio, registro |
| **gastar** · o que custa dinheiro | o servidor de `conectores`: faz a chamada, mede o custo real, recusa acima do teto |
| **perguntar** · quando o humano decide | o painel |

Entre as bordas o agente escolhe sozinho como pesquisar, com que ferramenta e
em que ordem.

**A cintura fina**, que é o que se congela: na base, a linha
`campo: valor  ← origem, AAAA-MM-DD`, o `?`, o `## Histórico`, o `_bruto/` e o
id com apelido; no painel, `{vista, dados, acoes}` na ida e `{acao, item, …}`
na volta. Todo o resto pode mudar.

**`carteira` vira a marca `{base}`**, com gênero. O invariante: com
`base = "carteira"` as 263 cópias geradas não mudam um byte.

**Generaliza-se na fonte e concretiza-se na montagem.** O modelo obedece melhor
a "conta" do que a "entidade do tipo A".

| o que foi recusado | por quê |
|---|---|
| plugin base separado, com os packs dependendo dele | o `/plugin install` copia UM subdiretório; dependência que falta quebra a skill sem erro |
| interpretador de esquema · DSL · motor de workflow | o agente É o motor de workflow; o contrato fixa as bordas |
| tipos com herança | a lista de tipos é plana |
| HTML gerado pelo agente no painel | porta de injeção; o vocabulário de vistas é fechado |
| migrar para Hermes ou OpenClaw | são harness, a camada que o Claude Code já é |
| candidatura submetida sozinha no LinkedIn | os termos proíbem, e conta restrita é o pior desfecho. O agente preenche e PARA antes do botão — a mesma saída do link `wa.me` da primeira mensagem |
| buscar vaga pelo navegador | a listagem pública responde por HTTP sem login (medido em 19/09: Gupy, Greenhouse, Ashby, Lever e LinkedIn) |
| sempre ligado (VPS, Routines) | adiado (feito depois, no D243) |

**Não-objetivo:** dado tabular em volume. Um arquivo por item serve a dezenas
ou centenas de coisas com história, e estoura os tetos com milhares.

### O que o terceiro pack cobrou do motor, medido

O pack de vagas expôs **três camadas** de forma de venda, consertadas sob o
invariante de que os packs existentes não mudam um byte:

| camada | o que era | o que virou |
|---|---|---|
| a palavra | `carteira`, 351 vezes em 22 arquivos | `{base}` e `{pasta-base}`. Feminina por contrato |
| a forma | quem tem `etapa:` e quem recebe a mensagem eram a mesma marca, em ~200 lugares | `{andante}`, conforme o `etapa-de` do pack, e o bloco `[[se etapa-de:item]]`. Numa busca de vaga quem anda é a vaga |
| o exemplo | "quem visitou", "preço", `estado: reservado` — 49 pontos | 43 marcas nomeadas pelo PAPEL, nunca pelo ofício |

**Um pack custa ~145 marcas para nascer** — 121 no `vocabulario.json` e 36
blocos em `exemplos/`. `node scripts/motor-marcas.mjs <pack>` lista o que falta.

**`skill-anunciar` fazia três papéis**, e só se via com um pack em que os três
são skills diferentes. Partida em três.

### O teste real, em 19/09

As skills rodaram em modo headless sobre uma busca real: a `comecar` montou a
pasta em 84 s; a `perfil-de-busca` escreveu perfil e trajetória em 6 min; a
`buscar-vagas` trouxe 75 resultados em 7 min — 12 entraram, 48 descartadas com
motivo; a `triar-vagas` leu os doze anúncios em 12 min.

Dois defeitos que só o uso mostrou:

- **O corte de 600 caracteres ficava com o texto institucional e perdia os
  requisitos.** As fontes ganharam a operação `detalhe`, que é dado no catálogo.
- **Quadro que RESPONDE também pode ser o errado.** Um quadro do Greenhouse com
  o nome da empresa procurada era de uma fabricante de outro país; outro, no
  Ashby, de uma empresa de outro ramo. A skill de perfil confiou porque "o
  quadro respondeu"; agora confere cidade e ramo.

---

## D230 · O painel ganha casa — uma página inicial que lê a base —, e a candidatura pode apertar o botão depois do sim

`data: 2026-09-19`

No primeiro uso real do pack de vagas, **faltou o lugar de onde se volta**. O
painel era só de tarefa.

**A página inicial lê a base, e continua sem gravar nela.** "O painel propõe, o
agente dispõe." A propriedade verificável passa a ser "não importa função de
ESCRITA, e só lê dentro da raiz da base".

**A navegação sai do `INDICE.md`**: `## Onde está o quê` é o menu, `## Quanto
tem` são os números, `## O que está conectado` é o estado. Como a linha da base
tem formato fixo (D229), ficha, funil e lista do dia se desenham sem código por
ofício.

| o que foi recusado | por quê |
|---|---|
| página inicial escrita por pack | é o acoplamento que o D229 tirou do motor |
| o painel gravar | duas fontes de escrita. O gesto vira INTENÇÃO, e quem grava é a skill |
| endereço sem chave | qualquer página aberta alcança `127.0.0.1`. A chave é FIXA por máquina e vira cookie `SameSite=Strict` na primeira abertura |
| um servidor sempre de pé | adiado no D229 (feito no D243) |

**A candidatura pode apertar o botão — depois do sim, e só para quem ligar.** A
saída é a do D197: informar em vez de impedir. O `INDICE.md` ganha `envio de
candidatura:` — `eu aperto` (o padrão) ou `aperta depois de eu aprovar no
painel` —, o aviso aparece UMA vez, e o sistema obedece. Não muda: uma por vez,
a tela inteira antes, o teto por dia, nada sai sem o sim daquela candidatura.
A recusa do D229 continua valendo para o envio SEM aprovação.

### Ligar, colar a chave e escrever o teto passam a ser cliques — e continuam sendo de gente

"Gente" não é "linha de comando": quem vai usar nunca abriu um terminal. **O
painel é a interface DA PESSOA**, e ganhou a tela de conectores: o aviso inteiro
antes de ligar, um campo para a chave (que vai do navegador ao cofre local e
nunca passa pela conversa), o teto, o botão Testar e o extrato. São rotas HTTP
atrás das mesmas guardas, e **nunca viram ferramenta MCP**. A regra mora em
`conectores/nucleo/gestos.mjs`; CLI e painel são duas portas dela.

Não fecha: agente com ferramenta de navegador alcança a tela. O "Confirmo" é
mitigação, não prova. Desligar e apagar chave não pedem confirmação: cerimônia
no gesto que REDUZ risco treina a confirmar sem ler.

**A Apify, provada contra a API real em 19/09:** 25 vagas do LinkedIn em 24 s,
US$ 0,0061 medidos. A operação `vagas-linkedin` é dado no catálogo do pack
(`operacoes+`). Dois defeitos que só a chamada paga mostrou: a mesma vaga volta
uma vez por cidade, e a data de publicação veio com a data da coleta.

---

## D231 · O painel é de quem nunca abriu um terminal: três lugares, e a ação vem antes do arquivo

`data: 2026-09-20`

A casa do D230 nasceu como ESPELHO DO DISCO: onze pílulas iguais no topo, o
INDICE inteiro no início, quadro de seis colunas com 56 cartões numa e cinco
vazias, rótulo em mono maiúsculo. *"Os usuários são pessoas leigas… evite
confusões."*

**Três lugares, e cada coisa mora em um só.**

| lugar | pergunta | o que mora lá |
|---|---|---|
| Início | o que eu faço agora? | o que o assistente espera · o dia · o funil · o que dá para pedir |
| Seu material | onde está o que eu tenho? | as listas, os documentos, e — recolhido — o guardado |
| Ajustes | como isto está configurado? | Conectores · Sobre você |

**O agrupamento do menu é MECÂNICO**: arquivo solto é documento, pasta com
`_indice.md` é lista, pasta sem ele é pasta, nome com `_` ou `arquivo-morto` é
guardado. `hoje.md` e `funil.md` já SÃO o início. Menu lateral a partir de
900 px, gaveta abaixo.

**O funil deixa de ser quadro**: a régua das etapas com o número de cada uma, e
a lista da etapa escolhida embaixo.

**"O que dá para pedir" sai do README do pack** (tabela `comando · o que faz`),
que o montador vira em `<pack>/painel/acoes.json`. Sem assistente esperando, o
botão mostra a frase para dizer ao Claude, com copiar — botão que aceita pedido
que ninguém vai ler é pior que botão nenhum.

**A língua da tela:** sans, caixa normal; mono só para id e valor copiável. O
estado fala de gente. Caminho de disco e nome de arquivo descem para Ajustes. A
procedência (`←`) NÃO desce: é regra do contrato.

| o que era | por que caiu |
|---|---|
| fileira de pílulas no topo | onze itens iguais, internos misturados com o trabalho |
| INDICE inteiro no início | referência acima da ação |
| quadro de colunas | rolagem lateral, colunas vazias |
| "O que está conectado" no início + tela Conectores | duas fontes para a mesma pergunta |

---

## D232 · A pessoa decide quando quiser: a fila de decisões — e, depois, o botão que chama o assistente

`data: 2026-09-21`

*"Por que só consigo marcar o que vale depois de mandar o comando de triar?"*
Porque a tela de marcar era uma PERGUNTA do assistente. A regra de que o painel
não grava continua certa; errado era concluir que a pessoa só decide quando o
assistente pergunta.

**A fila.** O item numa etapa do funil ganha dois gestos: passar para a etapa
seguinte, e descartar. A marca vai para uma FILA do painel
(`~/.kapstan/painel/`, uma por base) — fora da base, que segue com um escritor
só. O assistente a recebe por `painel_inicio` e a grava ANTES de qualquer outra
coisa, com a procedência `← {profissional}, no painel, AAAA-MM-DD`; confirma com
`painel_fila`, e só então a marca sai da fila. Os gestos são do FORMATO: as
etapas vêm do `funil.md`, e o descarte é o arquivo-morto.

**O botão.** "Gravar agora" e "Fazer agora" disparam o assistente
(`claude -p`, Opus, na pasta da base, com o pack). Três condições: lista FECHADA
(a fila e os comandos do `acoes.json` — nada digitado vira comando), um por
vez, e o custo dito antes com segundo clique. Exige um painel só por máquina: o
segundo servidor vira cliente do primeiro.

| recusado | por quê |
|---|---|
| o painel gravar a etapa sozinho | quatro arquivos para manter coerentes, e dois escritores na base |
| texto livre disparando o assistente | viraria instrução de um agente com permissão de gravar |

### O que a primeira execução real mediu, em 21/09

`laudo-da-busca` pelo botão, em Opus, sobre uma cópia da base de prova:
**7 minutos, US$ 2,59** — cinco vezes o palpite. A confirmação passou a dizer o
que a MESMA coisa custou da última vez, lido do livro
(`~/.kapstan/painel/execucoes.jsonl`).

O defeito que só a execução real mostrou: o assistente chamado carrega a CÓPIA
do painel dentro do pack, e ela estava sem o modo hóspede. Painel mexido e pack
não reespalhado é painel velho no ar; o `npm run oficina` já acusa.

### O botão só aparece onde a skill declarou que age

`<pack>/painel.json` diz SOBRE O QUE cada skill age: `nada`, `item`, `pessoa`;
**ausente é conversa**, e conversa não vira botão. `resolverLancamento` cobra a
mesma regra no servidor. O gesto de etapa passou a se chamar "Marcar como …".

---

## D233 · Mudança no painel não pede mais para fechar o Claude

`data: 2026-09-21`

**A tela.** O servidor lê o `painel.html` do disco a cada abertura. A aba sabe
que envelheceu (o `/estado` diz de quando é a página) e OFERECE atualizar — não
recarrega sozinha, porque recarregar debaixo de quem está marcando apaga as
marcas.

**O código.** Node não recarrega módulo. Entra o VIGIA
(`painel/nucleo/vigia.mjs`): é ele que o `.mcp.json` declara; o servidor é
filho dele, trocado quando um `.mjs` ou `.json` de `painel/` ou `conectores/`
muda. Só troca OCIOSO (um `painel_esperar` em curso é uma pessoa no meio de uma
tela), refaz o aperto de mão, avisa `tools/list_changed`, e reabre na mesma
porta. Filho que não sobe não vira laço. `node painel/prova-vigia.mjs`, 12 de 12.

Continua pedindo gesto: mudar o PRÓPRIO vigia (`/mcp`). Pack instalado pelo
marketplace mora numa cópia: lá quem traz código novo é a atualização do plugin.

---

## D234 · O painel depois do D233: seis defeitos, a fila barata, e o que a pessoa leiga percebe

`data: 2026-09-21`

| defeito | remédio |
|---|---|
| arquivo mudando NO MEIO de uma troca fazia o vigia trocar de novo — dois filhos, o primeiro órfão segurando a porta | uma troca por vez |
| o vigia trocava o servidor com o assistente do botão RODANDO | o servidor diz ao vigia `ocupado` e `livre` |
| dois cliques rápidos na fila: a segunda escrita apagava a primeira | as escritas da fila passam em série |
| o resultado da execução vivia só na memória | `ultima-execucao.json` |
| o Parar nunca foi provado no Windows | prova com um `claude` falso que abre um neto: os três mortos |
| marca sobre item que o assistente já mexeu | o servidor confere o `de` contra o `funil.md`, e a decisão chega `envelheceu` |

**A fila barata.** Entra `gravar-o-que-marquei`, skill do motor que lê a fila,
grava, confirma e para. O montador a tira de "O que você pode pedir" e escreve o
comando em `acoes.json` → `fila`.

**O que a pessoa leiga percebe:** a execução diz o que está fazendo
(`stream-json`); terminou com a aba escondida, o título muda e a notificação
avisa; o Descartar ganha motivo opcional; base vazia abre com "Por onde
começar" (`painel.json` → `comeco`); "Desde a sua última visita"
(`localStorage`); `painel/prova-tela.mjs` percorre as telas a 1300 e 390 px.

| | skill do dia (D232) | `gravar-o-que-marquei` |
|---|---|---|
| custo, Opus | US$ 2,59 | **US$ 1,40** |
| tempo | ~7 min | **2 min 15 s** |

A economia é menor que a esperada: o que pesa é ler o contrato em Opus. O texto
final repetia o endereço do painel COM A CHAVE: o filho recebe
`KAPSTAN_LANCADO`, e o embrulho troca o `diga`.

O controle de cada régua nova rodou contra o código ANTIGO: a fila perdia a
marca em 20 de 20 cliques duplos, e o vigia derrubava o servidor no meio da
chamada do hóspede.

---

## D235 · O próximo passo: cada item diz o que vem agora, e o agente pode apontar

`data: 2026-09-22`

*"Sempre um em destaque e outros como secundários; uma UI que guie no que
fazer."*

**Quem sabe o próximo passo é o ofício, por etapa.** `<pack>/painel.json` ganha
`proximo`: por etapa, a lista do que vem, na ordem — o primeiro é o DESTAQUE.
Entradas são skills do pack ou os gestos `marcar` e `descartar`. O montador
cobra que a etapa exista no `04-3-funil.md` e a skill no README, e escreve em
`acoes.json` → `proximo`.

**O agente aponta por item, pela linha do funil.** `· próximo: <ação>` já é do
contrato; quando começa pelo nome de uma skill, ela vira o destaque daquele
item, e o resto é a nota debaixo do botão. Nenhum campo novo.

`Proximo.svelte` desenha os três lugares e substitui `Decidir.svelte`.

Dois defeitos: `partirLinha` cortava no primeiro marcador DA LISTA — agora corta
no que vem primeiro NO TEXTO; e duas escritas em voo chegavam fora de ordem — só
a resposta do último pedido escreve na tela.

---

## D236 · Os nomes são os de plataforma: nova · salva · candidatada · em contato, e o painel fala como o LinkedIn

`data: 2026-09-22`

*"Use termos que os usuários já conheçam de plataformas semelhantes."* O
vocabulário do LinkedIn.

| era | fica | onde |
|---|---|---|
| achada · vale · em conversa | **nova · salva · em contato** | etapas do funil de vagas |
| Vale · Não vale | **Salvar · Descartar** | botões da triagem |
| Travado · Prometido e não chegou · Feito nos últimos sete dias | **Parado · Aguardando retorno · Concluído nos últimos 7 dias** | seções do `hoje.md`, em TODO pack e no motor |
| Ajustes · Conectores · Sobre você | **Configurações · Integrações · Seu perfil** | menu |
| Seu material · Guardado · Para você responder | **Sua {base} · Arquivo · Sua vez** | menu |
| Em que pé está · O que você pode pedir · Desde a sua última visita · Para hoje | **Funil · Ações · Novidades · Hoje** | início |

Não mudou: `não vale: …` como motivo de descarte (prosa), e `arquivo-morto/` —
formato de todo pack, e renomear é migração de toda base.

O rename foi por regras ancoradas — nunca o "vale" de "vale a pena", que aparece
40 vezes no pack. Uma base real migrou por script, diff mostrado antes: 59
arquivos, 64 linhas, sem chamar modelo.

---

## D238 · A resposta não se perde: o que a pessoa responde depois de o agente parar de esperar fica guardado, e chega por todos os canais

`data: 2026-09-22`

O `painel_esperar` tinha expirado (15 minutos — triar cinquenta leva mais), e a
resposta sumiu. Três defeitos:

1. **A resposta só saía pelo `painel_esperar`**, e a primeira `painel_mostrar`
   a descartava. A troca do vigia também apagaria.
2. **A tela mentia**: "o assistente está esperando você" com base em haver
   botões.
3. **O contrato mandava seguir em texto** ao expirar — certo para pergunta
   curta, errado para uma pilha.

**Guarda em disco e entrega por todos os canais.** Intenção sem ninguém
esperando vai para `respostas-<base>.json`. `painel_esperar` a devolve
(`tardia: true`) se a tela atual tem o mesmo título; `painel_inicio` e
`painel_fila` a trazem em `respostas`; `painel_fila { respostas_lidas }` a tira.

**`gesto` nas decisões.** A `lista` com `decisoes` declara `etapa:<nome>` ou
`descartar` por chave. Marca atrasada com gesto vira entrada da FILA (D232).

**A tela diz a verdade, e o agente espera mais** (até três vezes na mesma tela).

---

## D239 · Relações por id: o item é dono do seu id, e o resto que o carrega é documento dele

`data: 2026-09-22`

Clicar numa vaga no funil levava ao CURRÍCULO dela: `curriculos/V-014-cv.md` e
`vagas/V-014-empresa-x.md` começam com o mesmo `V-014-`, e o índice ficava com
o que encontrasse primeiro.

**A regra é do formato.** O arquivo na pasta de itens (ou de pessoas) é o DONO
do id — `acoes.json` → `pastas`. Todo outro arquivo com o mesmo id é DOCUMENTO
dele. A página do item lista "Documentos deste item"; a do documento diz
"Pertence a V-014 (Empresa X)".

**E todo id citado vira link** — `contato: P-005 (Marina, recrutadora)`, `## Fala
por`, `## Histórico`. É a mesma `idsDaLinha` do funil.

---

## D240 · O regime é a primeira coisa que uma vaga diz — e o pack declara o que se lê antes de tudo

`data: 2026-09-22`

O candidato abriu uma vaga sem saber se era remota — e presencial em outra
cidade não servia. O arquivo TINHA `regime: remoto`, na sexta linha de doze. E
oito das 56 vagas estavam em `regime: ?`.

**A ficha ganha um destaque, e quem o declara é o pack.** `painel.json` →
`destaque`: no de vagas, `regime · contrato · faixa · inglês · encaixe`. `?` sai
em âmbar como "não diz"; campo ausente, "não consta".

**A linha do funil começa pelo regime** — `remoto`, `híbrido em <cidade>`.

**A triagem não deixa `regime: ?` subir calado.** Regime só do cabeçalho do site
é "declarado pelo site": antes de salvar, a skill abre o anúncio ou pergunta.

---

## D241 · O filtro da busca não é fato: o regime que o LinkedIn "devolve" é o que a empresa cadastrou

`data: 2026-09-22`

Uma vaga dita `regime: remoto ← linkedin-vagas` era presencial no site da
empresa. O adaptador marcava `remoto: true` em TODO resultado de uma busca com o
filtro `f_WT=2`. Numa busca real, 31 das 56 vagas diziam `remoto`, 23 só pelo
filtro.

**O adaptador deixa de afirmar.** `remoto` sai `null`; o que a busca PEDIU vai em
`filtro: "remoto"`. A skill escreve `regime: ?  ← linkedin-vagas: a busca pediu
remoto; o cartão não diz`. Quem lê o anúncio escreve o regime.

A base foi corrigida por script: a vaga ganhou o fato dito pelo candidato
(`presencial em <cidade> ← candidato, 2026-09-22`, antigo no histórico); as
outras 23 foram a `regime: ?`. Regime lido do anúncio ficou.

---

## D242 · Revisar uma por uma: o baralho do funil, o verbo de cada etapa, e o menu revisto

`data: 2026-09-22`
`estado: superada em parte por D244` — o baralho saiu; ficam os rótulos, o resumo, os motivos, a triagem de uma vaga e o menu

37 vagas novas com três botões por cartão, e nenhum jeito de ler a vaga sem sair
da lista.

**O baralho.** `#/revisar/<etapa>`, um por vez: título, link, `destaque` e as
seções do `resumo`. `marcar` e `descartar` vão para a fila (D232) e o baralho
AVANÇA. Teclado e arrasto. Descartar abre os `motivos` do pack em um clique. O
componente (`Baralho.svelte`) serve à rota do funil e à `lista` com `decisoes`.

**O verbo de cada etapa.** O pack declara `rotulos` ("Salvar", "Já me
candidatei", "Analisar esta vaga"). Sem rótulo: "Mover para “X”".

**A triagem de UMA vaga.** `triar-vagas` aceita um id (`sobre: item nada`).

**`## Por que vale` vira `## O que pesa a favor`**, par de `## O que pesa
contra`.

**O menu.** "Seu perfil" vira "Conta"; `_bruto` vira "Originais" e
`arquivo-morto`, "Arquivados".

---

## D243 · O painel sempre ligado: um processo por máquina que não depende de conversa aberta

`data: 2026-09-22`

O painel é FILHO da sessão (MCP por stdio), e fechar ou atualizar a sessão o
encerra. Uma página que se deixa aberta o dia todo não pode ter a vida de uma
conversa.

**`painel/sempre.mjs` é o supervisor:** segura `servidor.mjs --base <pasta>`,
sobe de novo se cair (espera crescente) e o troca quando o código muda — como o
vigia do D233, sem trocar com assistente rodando nem tela esperando.
`--instalar` põe a partida no login do Windows (um `.vbs` na Inicializar, sem
janela e sem administrador); `--remover` desfaz. Fora do Windows ele diz a linha
para pôr no login, e não finge.

**As sessões viram hóspedes** (D232) e mandam PRESENÇA a cada 30 s;
"Assistente conectado" vale enquanto o sinal chega.

**E o solto não disputa a porta:** se uma sessão já abriu o próprio painel com a
mesma base, ele espera ela fechar.

---

## D244 · Lista e detalhe no lugar do baralho, e o painel montado de blocos que a base pode reordenar

`data: 2026-09-22`

O baralho do D242 era confuso. A forma que a pessoa já conhece é a caixa de
entrada de um e-mail: a lista numa coluna, o item inteiro ao lado.

**O leitor.** `#/funil/<etapa>/<id>` (ou `todas`): lista com busca à esquerda, o
item INTEIRO à direita. Barra com anterior/próxima ("3 de 37"), o passo
principal, Descartar com motivos, e "Mais". Marcou, vai para a próxima. J/K,
setas, trackpad, mouse; no telefone o item abre por cima.

**Um componente, dois donos, nenhum ofício.** `Leitor.svelte` recebe itens,
filtros, opções e um snippet de detalhe.

**O painel é montado de blocos.** O início sai na ordem de `inicio` do
`painel.json` do pack — o molde. A base pode ter o PRÓPRIO `painel.json`, que o
agente escreve quando a pessoa pede: `inicio`, `destaque`, `resumo`, `rotulos`,
`motivos` e `proximo` por cima dos do pack. Chave desconhecida é ignorada, e a
página Conta diz qual.

---

## D245 · A pasta dos itens É o funil, e completar o que falta vira ação de um clique

`data: 2026-09-22`

**Uma tela só.** A pasta dos itens abre o leitor do funil (`#/funil/todas`).
Item fora do funil entra no fim, marcado "fora do funil".

**Completar o que falta.** `completar-{item}` é skill do MOTOR: lê os campos em
`?` de UM item, procura nas fontes que a base tem — `_bruto/`, o link de origem
pelo conector com `detalhe` ou pela web, o navegador ligado, a página da
organização —, guarda a página lida em `_bruto/`, grava o que achar com
procedência e deixa o `?` com onde procurou. Não julga, não estima, não muda
etapa. `painel.json` → `completar` diz qual skill faz isso. O `encaixe` não é
fato: vazio, o próximo é a triagem.

---

## D257 · O próximo passo sai do estado da vaga, "Mais" tem todas as ações, e a página do item é redesenhada

`data: 2026-09-23`

Uma vaga completada oferecia "Candidatar-me" em destaque, e "Analisar" só no pé.
O próximo passo era escolhido pela ETAPA.

- **O pack declara o fluxo com condição.** `proximo` aceita `{ faz, se, porque }`;
  o destaque é a primeira entrada cujas condições valem. Vocabulário do motor:
  `faltam`, `sem:<campo>` · `com:<campo>`, `sem-documento:<pasta>` ·
  `com-documento:<pasta>`, `nunca:<palavra>` · `ja:<palavra>`. No de vagas, a
  salva: completar → analisar → currículo e carta → candidatar.
- **"Mais" lista tudo**, com o recomendado marcado.
- **O que está na fila ou rodando não se oferece de novo.**
- **A página do item, em ordem de pergunta:** quem é → e agora? → cabe para mim?
  → a análise → documentos → candidatura → histórico e ficha com procedência,
  atrás de um clique.
- **O número vem à vista**: a linha abre pelo id; o quadro do assistente dá o
  apelido e o link do item que cita.

---

## D258 · As pastas de documentos e de pessoas dizem de quem é cada coisa, e o arquivo longo se lê sem a procedência na frente

`data: 2026-09-23`

A pasta de cartas mostrava "V 007 carta" e "V-007-carta.pdf" em duas linhas; a
de contatos, o cabeçalho da tabela colado; a trajetória, uma parede com a origem
sob cada linha.

- **Pasta ligada a um modelo de documento** vira cartão por item dono, e dentro
  uma linha por documento com `.md` e `.pdf` juntos, tipo, língua, estado (da
  primeira linha), data, Abrir e PDF.
- **A pasta de pessoas** vira cartões: nome, cargo, papel, por qual item fala, o
  canal e o "não contatar" à vista.
- **O servidor lê mais do cabeçalho** (`/base/fichas`).
- **O arquivo que não é item** abre sem a procedência sob cada linha — um
  interruptor a mostra. A procedência continua no arquivo, a um clique.

---

## D259 · Toda tela que espera resposta tem um recado geral, e o campo ou item pode ter o seu

`data: 2026-09-23`

Numa candidatura, a única forma de corrigir o assistente era escrever DENTRO do
valor do campo que iria para o formulário da empresa.

- **Toda tela de tarefa com botões tem "Recado para o assistente"**, que volta
  como `comentario` em qualquer botão.
- **O detalhe é opt-in:** `comentar: true` num campo ou na `lista`; volta
  `comentarios: { <chave ou id>: texto }`.
- **Recado é instrução, nunca valor.** Ler antes, aplicar, e nunca copiar para o
  que sai em nome da pessoa. Recado que muda o que ia sair pede tela nova.

---

## D260 · A Gupy entra nas sessões salvas, e a candidatura pede o login pela tela de Integrações

`data: 2026-09-23`

O login feito na Gupy dentro do navegador do assistente morreu com a execução.

- **A Gupy é mais um site do D272**, em `navegador.sessoes+`: `login.gupy.io`,
  domínio `gupy.io` (os portais das empresas são subdomínios e partilham o
  login) e o sinal `candidate_secure_token` — o `candidate_token` do código da
  página de login NÃO é o nome que o navegador guarda (medido em 23/09).
- **A candidatura pede o login ANTES, pela tela de Integrações**, quando o site
  é declarado e está sem sessão.
- **O cookie da Gupy é de SESSÃO, e morria ao fechar a janela.** A janela e a
  leitura abrem com `--restore-last-session`. Medido num perfil descartável: sem
  a bandeira volta só o cookie com data; com ela, os dois. A preferência
  "continuar de onde parou" NÃO bastou.

---

## D262 · O que espera a pessoa fica gravado antes da espera, e o botão que ela aperta depois vira decisão

`data: 2026-09-23`

Uma candidatura foi enviada e não foi registrada: a execução esperou o "Enviei"
até o teto de 60 minutos e morreu sem escrever.

- **Escrita antes da espera.** A skill grava ANTES o `_bruto/` com
  `estado: preenchida, esperando o seu envio`, e a frase como última linha do
  `## Histórico`.
- **O botão do rodapé também tem gesto.** `acoes[]` aceita `item`, `gesto` e
  `nota`, como as `decisoes` (D238). Apertado depois, vira decisão da fila.
- **`agora:<palavra>`**, nova condição (D257): vale quando a ÚLTIMA linha do
  histórico tem a palavra. `ja:` continua dizendo "aconteceu alguma vez".
- **A tela diz o destino do clique** quando ninguém espera.

| o que era | por que caiu |
|---|---|
| lançador sem teto de espera | um "Enviei" esquecido prende a fila para sempre |
| conferir "Minhas candidaturas" do portal a cada dia | custo de navegador em toda execução para um caso que a escrita antecipada já cobre |

---

## D263 · O modelo continua Opus; o esforço é por skill, declarado pelo pack e medido no livro

`data: 2026-09-23`

`estado: emendada por D277`

- **Opus 5.5 fica.** Preço oficial (23/09): Opus 5.5 US$ 4 / 20 por milhão de
  tokens de entrada / saída, Sonnet 5 US$ 2 / 10 — mas a LEITURA DE CACHE, a
  maior parte de uma execução de skill, custa US$ 0,20 nos dois. A diferença
  fica na saída, e é a saída que o esforço corta. E as skills foram provadas no
  Opus.
- **O pack declara `esforco` por skill** — `low` · `medium` · `high` · `xhigh` ·
  `max`, o `--effort` do `claude`. No de vagas: `gravar-o-que-marquei` e
  `organizar-busca` em `low`, `completar-ficha` em `medium`.
- **O livro registra o esforço**, e o "da última vez custou" compara execuções
  de mesmo esforço. Antes: gravar a fila US$ 0,78 em 33 turnos; completar uma
  vaga US$ 1,66 a 3,40.

| o que era | por que caiu |
|---|---|
| Sonnet 5 nas skills de mover dado | metade do preço só na saída, cache igual; seria o terceiro modelo a provar |
| Haiku 4.5 | as skills escrevem na base com procedência e tetos; um erro ali custa mais que a execução |

---

## D264 · O início é uma fila de passos: um item por linha, com o botão, e a pilha a julgar à parte

`data: 2026-09-23`

*"Nos itens de hoje eu não consigo executar nenhuma ação neles."* Numa base
real, "Hoje" copiava o `hoje.md` do dia anterior, e o funil abria com 12
cartões de quatro botões na ordem do arquivo.

- **Régua no cabeçalho**, com link para cada etapa.
- **"Agora"** (bloco `hoje`): uma linha por item, com o `Proximo` em modo
  `linha`. Primeiro o que o `hoje.md` apontou, depois as etapas do fim para o
  começo. `hoje.md` com data antiga: a tela diz, e oferece o `o-que-fazer-hoje`.
- **"Para julgar"** (bloco `funil`): a primeira etapa, ordenada pela escala de
  `ordens` que está em `destaque`; enquanto o campo é `?`, vale a proposta da
  linha do funil ou do histórico. Cinco primeiras em modo `par`.
- **"Novidades" e "Pedir outra coisa" dobram.**

| o que era | por que caiu |
|---|---|
| espelho do `hoje.md` com caixas de só ler | sem gesto, sem link, e envelhece |
| 12 cartões de 4 botões | a parede de botões escondia a ordem |

---

## D265 · A tela de tarefa lê como as outras: a origem atrás do interruptor, e o documento como documento

`data: 2026-09-23`

Num currículo de vaga, a tela mostrava a origem sob cada linha
(`← trajetoria.md · Empresa A, Empresa B` doze vezes) e o currículo em mono,
com `##` e `**` à vista.

- **"Mostrar de onde veio cada linha"** (D258) entra na tarefa quando algum
  bloco traz `de`. "← só você sabe" e "← mexido aqui" continuam: são estado.
- **A vista `texto` com título `#` vira documento**, desenhado pelo Svelte sem
  `{@html}`. "Ver como texto puro" volta à cerca. Mensagem sem título continua na
  cerca, como vai sair.

---

## D266 · Entre salva e candidatada, duas fases que se leem da ficha: pesquisada e com currículo

`data: 2026-09-23`

- **Fase, e não etapa.** `painel.json` → `fases`, por etapa, degraus
  `{ nome, se }` com as condições do D257. Nenhuma skill move; o `funil.md` não
  muda. No de vagas: `pesquisada` (`ja:completado`) e `com currículo`
  (`com-documento:curriculos`).
- **A régua e os filtros são os mesmos trechos** (`trechosDoFunil`), e a soma
  fecha.
- **O montador valida** etapa, nome curto e diferente de etapa, e condições.

| o que era | por que caiu |
|---|---|
| duas etapas novas no `funil.md` | cada skill que move vaga teria de movê-la por mais duas, e a etapa escrita envelhece |

---

## D267 · A Oficina vira código aberto de fato: a fonte é o `kapstanhq/oficina`, e o vagas entra por último

`data: 2026-09-23`

**O que o público recebia não era código aberto:** o espelho levava só o
compilado. A fonte (`painel/app`, `conectores/`, `scripts/oficina.mjs`, as
provas) não saía, e um PR de fora caía numa cópia que a próxima geração apagava.

- **A fonte única é o `kapstanhq/oficina`**, monorepo: packs, `_motor`, painel,
  conectores, montador e provas. O histórico é o do público; o do repositório
  privado não migra (tem dado pessoal em commits).
- **O gerado continua commitado em cada pack** — quem instala não roda build —
  e um CI recusa o PR em que fonte e gerado divergem. PR aberto, com
  CONTRIBUTING.
- **O site consome a Oficina por dependência npm com tag.** O `prompt.md` de
  cada pack vem para cá; a página do pack fica no site.
- **As decisões da Oficina moram neste `DECISIONS.md` público**, sem dado
  pessoal e com o número mantido.
- **O reuso é entre packs, em três camadas:** os módulos comuns do painel, o
  `painel.json` como template, e `componentes/` do pack. Componente sobe ao
  comum no SEGUNDO uso. O CRUD grava só pelo agente (D232).
- **Pack novo nasce de `_modelo`**, por `novo-pack <slug>` e uma skill que
  entrevista sobre o ofício até o `motor-marcas` dar zero.
- **Ordem:** F0 fecha o ramo de trabalho · F1 migra núcleo, corretor e
  prospecção · F2 as três camadas, o molde e a skill · F3 o vagas, limpo.
- **O vagas é para qualquer profissão, no Brasil.** Sai a persona única (uma
  profissão, 173 menções), entram exemplos de três áreas e uma segunda fixture;
  `inglês:` vira idioma. A entrevista abre pela PESSOA — por que busca, do que
  se orgulha, o que desgasta, o momento. O começo é pasta → contato →
  entrevista → buscar → triar.
- **O envio é desligado por padrão**, ligado pela pessoa e aprovado a cada vez.
  O lançador roda Opus por padrão (D263), trocável.
- **A v1 do vagas exige** o painel sempre ligado no Mac e no Linux, fontes além
  de LinkedIn e Gupy e o WhatsApp por binário pronto.

| recusado | por que caiu |
|---|---|
| publicar o vagas corrigido e fazer o template depois | o template veio primeiro |
| espelho maior a partir do repositório privado | PR de fora vira porte à mão, para sempre |
| submódulo ou pasta irmã | dois commits por mudança; build que não se reproduz num worktree |
| registro aberto de vistas para plugins de terceiros | o reuso é só entre packs da Oficina |
| o painel gravando direto | dois escritores no mesmo markdown |
| levar o histórico filtrado | um commit que escape fica público sem volta |

---

## D270 · Documentos: o motor faz o PDF, o pack faz o modelo

`data: 2026-09-23`

A skill dizia "abra num editor e exporte". A prova (um currículo real, HTML com
CSS de página, Chrome em `--print-to-pdf`) deu 2 páginas A4, 79 kB, texto
selecionável na ordem certa — e dois defeitos: o último item de uma experiência
sozinho no topo da página 2, e o fim da linha de contato sozinho.

- `documentos/` é o terceiro servidor do motor, atrás do mesmo vigia.
  `documento_gerar { base, origem, modelo }` monta o HTML, imprime pelo
  navegador da máquina (Chrome, Edge ou Chromium — sem dependência) e confere:
  páginas contra o teto, fonte embutida, links. **Só escreve o `.pdf`
  derivado**, ao lado da origem; nunca edita o texto.
- A base de página é do motor: A4, margens, quebras (título não fica sozinho no
  pé, experiência não se parte no último item) e fonte EMBUTIDA — IBM Plex Sans
  —, porque com a do sistema o documento sairia diferente em cada máquina.
- O modelo é do pack: `<pack>/documentos/modelos/<nome>/` com CSS e
  `modelo.json`.

**A skill gera e confere**: passou de duas páginas, corta no markdown e gera de
novo. `candidatar` anexa o `.pdf`.

**O painel mostra, e não grava**: "Ver como PDF" e "Abrir o PDF".

---

## D271 · Completar vai atrás da vaga, e o botão enxerga o que a conversa enxerga

`data: 2026-09-23`

- **O botão rodava sem web e sem navegador.** O `claude -p` saía com
  `--allowedTools` só do painel e dos conectores; o `allowed-tools` da skill não
  vale ali. Passam a valer `WebFetch`, `WebSearch` e o servidor de documentos; o
  **navegador só quando a pessoa o ligou**, lido na hora de cada execução.
- **Ela não procurava a vaga.** Ganha a fonte "o mesmo registro em outro lugar":
  busca pelo nome e pela organização, e só aceita o achado que bate. O endereço
  entra em `também em:`. É frase do motor.
- **A espera vira fila** (até dez), cada um confirmado com o custo. Falha ou
  Parar **pausa** a fila; segue só com "Continuar".

| o que era | por que caiu |
|---|---|
| duas execuções ao mesmo tempo | gravam o mesmo `funil.md` e `_indice.md`: a última apaga a outra |
| confiar no `allowed-tools` da skill no `claude -p` | medido: a execução disse que não tinha permissão |

---

## D272 · Entrar uma vez: a sessão do site fica salva, e todo agente a usa

`data: 2026-09-23`

O Playwright rodava com `--isolated`, e login nenhum durava.

- **O pack declara os sites, o motor guarda a sessão.** `conectores.json` do
  pack acrescenta ao `navegador` as `sessoes+` — onde se entra, os domínios e o
  cookie de sinal. O motor grava `~/.kapstan/navegador/sessoes.json` no formato
  de estado do Playwright.
- **A pessoa entra em dois tempos.** "Entrar" abre o Chrome num perfil próprio
  (`~/.kapstan/navegador/perfil`), comum, na página de login. Fechada a janela,
  o mesmo perfil abre sem tela, com a porta de depuração, só para ler os
  cookies. Senha, captcha e dois fatores continuam da pessoa. Não existe
  ferramenta MCP para entrar ou sair.
- **Cada agente abre o próprio navegador, já logado**:
  `--isolated --storage-state <sessoes.json>`. A sessão não se renova sozinha.
- **Só nome e validade saem do arquivo**; o valor do cookie não volta em rota
  nenhuma.

| o que era | por que caiu |
|---|---|
| perfil fixo no Playwright, sem `--isolated` | um perfil abre num navegador por vez; e o cookie fica cifrado |
| ler os cookies pela porta com a janela de login aberta | o Google recusa entrar num Chrome com a porta, medido em 23/09 |
| um Chrome compartilhado por todos | as abas se misturam, e a porta aberta deixa qualquer programa dirigir o navegador logado |

---

## D273 · A carta de apresentação: sob medida ou nenhuma, uma página, e rascunho até o candidato ler

`data: 2026-09-23`
`estado: emendada por D275` — o corpo encolhe para três parágrafos e meia página, e os comentários de origem saem do arquivo

- **Sob medida ou nenhuma.** O único experimento de campo (ResumeGo 2020, 7.287
  candidaturas) mediu +53% de entrevistas com carta sob medida e +17% com a
  genérica. A carta só nasce quando o formulário tem o campo E há ao menos uma
  prova da trajetória que responde a um requisito do anúncio.
- **Quatro parágrafos**: a vaga e a tese; uma ou duas provas com número; um fato
  da organização que não serviria a outra; o convite e um link. Corpo de 1.800 a
  2.400 caracteres. Campo de texto: até 1.400 (a Gupy corta em 1.500).
- **Tom**: primeira pessoa, sem adjetivo sobre si, sem "venho por meio desta".
  O idioma é o da vaga.
- **Mesmas três camadas do D270.** O modelo `carta` é do pack de vagas; quem
  escreve é `montar-curriculo`; `candidatar` anexa ou cola a versão curta.
- **Rascunho até ele ler.** A carta nasce `rascunho`; a candidatura só a leva
  `aprovada`.

---

## D274 · A pasta dos itens abre numa tabela, e uma ordem só vale para as três vistas

`data: 2026-09-23`

- **Sem item no endereço, a tabela.** Uma linha por item: nome, etapa, os campos
  do `destaque` no trecho curto (o inteiro no `title`), os documentos, quantos
  campos estão sem resposta, a última linha do `## Histórico` e a data. Clicar
  abre o leitor (D244).
- **O servidor lê os cabeçalhos de uma vez**: `GET /base/fichas?pasta=<pasta>`.
- **Uma ordem só** vale na tabela, no leitor e no funil do início, guardada no
  navegador. O pack diz a ordem das escalas não alfabéticas (`ordens`).

---

## D275 · A carta encolhe para meia página, e o resumo do currículo não repete a experiência

`data: 2026-09-23`

Na primeira carta de verdade, o resumo do currículo repetia os números que a
primeira linha da experiência diz logo abaixo; a carta era longa, recontava o
currículo e saía com os comentários de origem no meio.

- **O resumo posiciona, a linha prova.** Nenhuma frase do resumo reaparece numa
  linha abaixo.
- **A carta: três parágrafos, 900 a 1.500 caracteres** — meia página, a
  preferência de 49% dos recrutadores (Zety 2024); o teto do D273 era o que CABE,
  não o que se lê. 1 · a vaga e a tese; 2 · um fato da organização com fonte;
  3 · uma prova com número e o convite — sem link, e sem o projeto como vitrine.
  A mesma carta serve ao campo de texto.
- **Não reconta o currículo.** Detalhe que já está lá só entra se a carta disser
  o que ele significa PARA esta vaga.
- **Sem comentário no corpo.** Só a primeira linha, de origem e estado. A origem
  de cada afirmação vai na tela do painel e, se veio da web, num `_bruto/`.

---

## D276 · A candidatura espera o envio com o navegador aberto, e sugere o que só ele decide

`data: 2026-09-23`

Na primeira candidatura pelo painel, a skill preencheu até o botão, parou e
TERMINOU — e o navegador fechou junto, com o formulário preenchido.

- **Preencheu, espera.** Mostra "preenchido até o botão" com `Enviei` · `Não vou
  enviar agora` e fica em `painel_esperar`. `Enviei` → lê a confirmação da
  página e registra; o resto → grava o preparo e termina.
- **Esperar não gasta o teto.** Os 30 minutos do lançador contam o trabalho; o
  tempo em `painel_esperar` tem teto próprio, de 60 minutos.
- **Sugerir não é responder.** Campo que é decisão dele — a pretensão numa lista
  de faixas — vem PREENCHIDO com a sugestão: a faixa que contém a frase do
  `perfil.md` (nunca abaixo do piso), com a média do `salário relatado` ao lado,
  e o `de` diz `sugestão`. Dado sensível (§3.1) continua sem sugestão.

## D277 · O pack de vagas vai a público: qualquer profissão, fontes que os termos permitem, e o painel que o pack configura

`data: 2026-09-24`

A F3 da D267. O que decidiu cada frente, em uma linha:

- **Para qualquer profissão, no Brasil.** Três personas fictícias nos exemplos
  (tecnologia, saúde, varejo) e duas fixtures (`_prova/vagas`, `_prova/vagas-b`;
  `--fixture` escolhe). A vaga ganha `jornada:`, `inglês:` vira `idioma:`, e o
  `contrato:` é lista aberta (CLT, PJ, estágio, aprendiz, temporário…).
- **A entrevista abre pela pessoa.** O `perfil-de-busca` começa por por que busca,
  do que se orgulha e o que desgasta; o material colado confirma. A lacuna se
  conta, não se esconde. O começo do vagas é pasta → contato → entrevista →
  buscar → triar; Google, WhatsApp e login em site entram no dia em que fazem
  falta, com guia de ligar e de revogar.
- **Fontes: só o que os termos permitem.** Gupy (com cidade, estado e contrato),
  Sólides e LinkedIn público; a vaga de um link colado é lida pelo `JobPosting`
  da página (`ler-vaga`). Catho, InfoJobs e Indeed proíbem acesso automatizado
  nos termos: para eles o conector recusa SEM requisição e pede o texto do
  anúncio. Adzuna fica para depois (duas credenciais).
- **A promessa pública diz a verdade:** por padrão não entra em conta e para
  antes do botão de enviar; login, Google, WhatsApp e envio por você são
  escolhas, com aviso, e cada envio passa pela aprovação no painel. Sem painel,
  a skill para antes do botão.
- **O painel é configurado pelo pack:** vistas próprias em
  `<pack>/painel/componentes/` (sobem ao comum no segundo uso), textos em
  `painel.json`, e o `fim` — o botão "Aceitei a proposta", que arquiva sem ser
  descarte e põe a busca em pausa.
- **O botão que lança o assistente** roda Opus por padrão (D263) e aceita outro
  modelo (`KAPSTAN_MODELO` ou `modelo` no `painel.json` da base); `"lancar": false`
  o desliga. A execução fica presa à pasta da base e trata texto de página como
  dado — o que é instrução ao modelo, não barreira: a base deve ter backup.
- **Dado sensível** (autodeclaração para formulário) fica só na base local, e a
  pessoa apaga a linha quando quiser.

| recusado | por que caiu |
|---|---|
| ler a página de qualquer link colado | três grandes classificados proíbem por escrito |
| seguir só com LinkedIn e Gupy | quem não é de escritório não acha vaga ali |
| aprovação de envio pelo terminal | a promessa é aprovação na tela, e o terminal não a mostra inteira |
