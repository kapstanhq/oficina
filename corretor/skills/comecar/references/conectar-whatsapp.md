<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/referencias/conectar-whatsapp.md, e ela vale para qualquer
     profissão: as marcas do ofício são resolvidas na geração, pelo
     vocabulario.json do pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`. -->

# Conectar o WhatsApp — a cadeia

Isto é o caminho OPCIONAL do passo 5. O padrão continua sendo colar, e quem
não chegar até aqui não perde nenhuma das dez skills.

**Só siga se houver linha de comando** — Claude Code, Codex CLI, Cursor. Nos
chats da web não há como executar nada, e aí a resposta é uma linha: "esse
caminho precisa de um programa que rode comandos no seu computador; aqui a
gente cola, e funciona igual".

---

## Antes de instalar, o que ele tem que ouvir

Não são letra miúda: são o que faz o corretor decidir com o que ele tem, e o
que evita ele descobrir depois e culpar a ferramenta.

```
1  o conector LÊ as suas conversas, e MANDA mensagem pelo seu WhatsApp. Uma
   de cada vez, nunca em lote, nunca sem você ver antes — como o envio
   funciona está logo abaixo, e é a parte que mais muda para você

2  ele vira um "dispositivo conectado" da sua conta, como o WhatsApp Web.
   São quatro vagas, e ele ocupa uma. Some da lista quando você desconectar

3  de tempos em tempos (mais ou menos 20 dias) o WhatsApp pede o QR de novo.
   É do WhatsApp, não tem conserto do nosso lado

4  as conversas ficam num arquivo NO SEU COMPUTADOR. Nada sobe para lugar
   nenhum. E como são conversas de quem fala com você, o dono desses dados é você
```

E a que não se omite: **este não é um programa oficial do WhatsApp.** Ele fala
o mesmo protocolo do WhatsApp Web, e a Meta não aprova esse tipo de acesso.
Contas são bloqueadas quando disparam mensagem em massa — e disparo é o que
este conector não faz: uma por vez, espaçada, e com você vendo cada uma. O
risco é baixo, não é zero, e o número é o seu.

### E o envio, que são três coisas

Diga as três **uma vez**, aqui, e siga em frente. Elas não voltam a cada
mensagem: quem decide o que fazer com o WhatsApp dele é ele, e o que cabe à
ferramenta é informar.

```
1  toda mensagem aparece inteira na sua tela antes de sair, com o nome de
   quem vai receber. Nada sai que você não tenha lido

2  o programa que você está usando vai perguntar se pode enviar, e junto vai
   oferecer "não perguntar de novo". Se você marcar, as mensagens passam a
   sair direto. É a sua escolha, e ela se desfaz nas configurações do
   programa, quando você quiser

3  mandar para quem nunca te respondeu é o que faz uma conta ser RESTRINGIDA
   — e conta restrita não usa dispositivo conectado, ou seja, é esta ponte
   aqui que cai. Responder quem te escreveu é a coisa mais segura que existe
```

Dito isso, **não repita e não faça sermão.** Ele ouviu; daqui para a frente a
ferramenta obedece.

Se ele hesitar, **pare aqui e não insista**: colar funciona, e é o padrão.

---

## A cadeia, em nove degraus

Cada degrau é: **verifique · aja só se falhou · confirme**. Rodar a cadeia
inteira de novo é seguro — cada degrau já feito passa direto. Nunca pule a
confirmação: é ela que separa "instalei" de "funciona".

### 1 · Go

```
verificar   go version
agir        Windows:  winget install GoLang.Go
            macOS:    brew install go   (ou o instalador de go.dev/dl)
            sem gerenciador de pacotes: o instalador oficial de go.dev/dl,
            que é assinado e passa sem aviso de segurança
confirmar   go version responde
```

Depois de instalar, o terminal precisa ser reaberto para enxergar o `go` —
sessão velha guarda o caminho antigo. Se `go version` falhar logo após uma
instalação bem-sucedida, é isso.

**Não precisa de compilador C.** Se alguma instrução mandar instalar GCC ou
MinGW, está desatualizada.

### 2 · A ponte no computador

```
verificar   existe main.go na pasta baixada
agir        git clone https://github.com/kapstanhq/whatsapp-reader
confirmar   os arquivos .go estão lá
```

### 3 · Compilada

```
verificar   o binário existe e é mais novo que os arquivos .go
agir        CGO_ENABLED=0 go build -o whatsapp-reader .
            (no Windows o nome sai como whatsapp-reader.exe)
confirmar   rodar o binário sem argumento mostra a ajuda
```

Demora alguns minutos na primeira vez: ele baixa as bibliotecas. Silêncio no
terminal é normal.

### 4 · O daemon de pé

```
verificar   whatsapp-reader estado
agir        abrir uma JANELA NOVA de terminal e rodar:  whatsapp-reader serve
confirmar   whatsapp-reader estado diz "de pé"
```

**Janela própria, e ela fica aberta.** O daemon é quem recebe as mensagens: se
a janela fechar, o histórico congela no último momento em que ele estava vivo,
e o que passou enquanto ele esteve fora **não volta**.

Isto não é advertência de manual: **já aconteceu com quem escreveu a ferramenta.**
O daemon da máquina de desenvolvimento morreu num 01/09 às 11:05 e ficou fora
seis dias, com tudo o mais funcionando — e ninguém percebeu, porque só o
`whatsapp-reader estado` sabe dizer. Conte isso ao corretor: é mais barato
do que ele descobrir sozinho, e é o motivo do degrau seguinte.

### 4.5 · Vivo depois de desligar o computador

```
verificar   o corretor reinicia a máquina e `whatsapp-reader estado` ainda
            diz "de pé", sem ninguém abrir nada
agir        pôr o `serve` no agendador do sistema (abaixo)
confirmar   o mesmo teste, depois de reiniciar de verdade
```

**Este degrau é o único que se pode adiar sem perder função** — e é o que
determina se a ponte sobrevive ao primeiro reboot. Ofereça, e se ele não quiser
agora, anote e siga: quem depende da própria disciplina para reabrir uma janela
todo dia vai perder uma semana de conversas, e não vai saber quando.

```
Windows   Agendador de Tarefas → Criar Tarefa Básica
          nome: whatsapp-reader · gatilho: "ao fazer logon"
          ação: iniciar programa → o caminho do whatsapp-reader.exe
          argumento: serve

macOS     um .plist em ~/Library/LaunchAgents com KeepAlive true e o mesmo
          caminho; carregar com launchctl load
```

Uma coisa que o agendador **não** resolve, e o corretor tem que ouvir: de
tempos em tempos o WhatsApp repede o QR (item 3 dos avisos). Nesse dia o daemon
sobe e não conecta — e é o `estado` que diz isso, com todas as letras. O
agendador cuida do processo; o pareamento continua sendo dele.

### 5 · Pareado

```
verificar   whatsapp-reader estado diz "de pé e conectada"
agir        o QR está na janela do passo 4, e também em qr.png ao lado do
            binário — use a imagem se o desenho no terminal sair quebrado
confirmar   a janela imprime "pareado" e começa a contar o histórico
```

O escaneamento é dele, no celular: **Configurações › Dispositivos conectados ›
Conectar dispositivo**. Peça que ele deixe essa tela aberta ANTES, porque o QR
expira em três minutos.

Depois de parear, o WhatsApp despeja o histórico de uma vez — pode levar
alguns minutos e a janela vai contando. Espere terminar antes do degrau 7.

O quanto vem varia muito de conta para conta, e a cobertura é irregular:
funda nas conversas ativas, rasa ou ausente nas paradas. **Não prometa
número.** O que veio, `estado_da_ponte` diz.

### 6 · Registrada no programa

```
verificar   a lista de servidores do programa mostra a ponte conectada
agir        no Claude Code:  claude mcp add whatsapp -- <caminho>/whatsapp-reader mcp
confirmar   a lista mostra "Connected"
```

As ferramentas só aparecem quando o programa reinicia. Avise antes: ele vai
precisar fechar e abrir, e isso é esperado, não é erro.

### 7 · Ponta a ponta

```
verificar   listar_conversas devolve conversas de verdade
agir        —
confirmar   as conversas que voltaram são as dele
```

**Só agora** escreva no `INDICE.md` a linha da leitura:

```
WhatsApp: sim  ← testado AAAA-MM-DD
```

Antes disso, ela continua `não`. "Conectado" sem prova é o defeito que aparece
três dias depois, no meio de outra coisa.

**A linha `envio:` ainda não.** Ela é do degrau 8, e pelo mesmo motivo: o que não
foi testado não se escreve como testado.

### 8 · O envio, provado uma vez

```
verificar   a linha `envio:` existe no INDICE.md
agir        mandar UMA mensagem para o número do próprio corretor
confirmar   ele diz que ela chegou, no celular dele
```

Este degrau existe porque a alternativa é a primeira mensagem da vida daquela
instalação sair para um cliente de verdade — e porque o mesmo princípio já vale
para a agenda, o Gmail e o Drive nos passos 3 e 4. Não há razão para o envio ser
o único a ganhar `sim` sem prova.

O número dele vem do próprio `estado_da_ponte`, junto com a saúde. **Mandar para
si mesmo não abre conversa com ninguém** e não conta risco nenhum — a prévia diz
isso, com essas palavras, em vez do aviso de primeiro contato.

O par é o de sempre, e mostrar a prévia inteira faz parte do teste: é a primeira
vez que ele vê como uma mensagem sai daqui, e é isso que a torna uma decisão
informada na próxima.

```
preparar_envio    o jid dele, e um texto qualquer que ele reconheça
enviar_mensagem   depois de ele ler a prévia e autorizar
```

Chegou: escreva a segunda linha, com a data, ao lado da primeira.

```
envio: pergunta sempre  ← testado AAAA-MM-DD
```

**Não pergunte agora qual das três ele quer.** Ele acabou de ver UMA saindo, e
escolher a política com uma amostra é escolher no escuro. Diga só que a linha
existe e que trocar é trocar uma palavra: `responder sem perguntar` responde
direto quem escreveu para ele — começar conversa continua perguntando —, e `não`
faz a skill nem oferecer.

Não chegou, ou deu erro: **não escreva a linha.** Diga o que apareceu, que a
leitura continua funcionando (a linha do degrau 7 fica), e que o caminho do
bloco para copiar não dependia disto.

### 9 · Quem não pode receber mensagem

```
verificar   whatsapp-reader nao-contatar lista alguma coisa
agir        —
confirmar   o comando responde, mesmo que a lista esteja vazia
```

Não há nada a fazer aqui hoje: o degrau existe para o comando ter sido **visto
uma vez**. Quando um cliente pedir para não ser contatado, o contrato (seção
7.1) manda escrever em dois lugares, e um deles é este — um arquivo no diretório
da ponte, que a carteira não alcança:

```
whatsapp-reader nao-contatar 5551999998888 "pediu em 12/08"
```

Diga ao corretor que ele mesmo pode rodá-lo, e que `--tirar` desfaz. Pedido
de silêncio que fica só na carteira continua valendo para as skills, mas não
segura o envio se alguém esquecer — e é para isso que os dois lugares existem.

---

## Quando falhar

| o que aparece | o que é | o conserto |
|---|---|---|
| `websocket: close 1006` | o WhatsApp recusou a versão da biblioteca, e o erro não diz isso | `go get -u go.mau.fi/whatsmeow@latest`, depois `go mod tidy` e compilar de novo. Se aparecer erro de compilação citando `context`, a biblioteca mudou e isso é conserto de mantenedor: pare e diga isso |
| `missing go.sum entry` | dependência não resolvida | `go mod tidy` e compilar de novo |
| o QR não aparece, ou sai como caracteres embaralhados | o terminal não desenha os blocos | use o `qr.png` que está ao lado do binário |
| "o QR expirou" | passou dos três minutos | rode `whatsapp-reader serve` de novo, com o celular já na tela de conectar |
| o antivírus reclama do binário | executável recém-compilado, sem assinatura | ele foi compilado ali, na máquina dele, a partir do código — mas **não insista**: se ele não quiser liberar, volte para o colado |
| `estado_da_ponte` diz zero conversas | o daemon não está rodando, ou nunca pareou | confira o degrau 4 antes do 5 |
| tudo funciona e as ferramentas não aparecem | o programa não reiniciou depois do `mcp add` | fechar e abrir |
| `estado` diz "fora do ar" e a janela parece aberta | a janela morreu, ou o computador reiniciou | rodar `serve` de novo, e fazer o degrau 4.5 desta vez |
| `estado` diz que outro dispositivo assumiu a sessão | o WhatsApp Web abriu no navegador, ou há um segundo `serve` | fechar o outro e rodar `serve` de novo — esta ponte não volta sozinha |
| o envio recusa dizendo que não existe conversa | primeiro contato: o WhatsApp recusa desde julho de 2026 | não há contorno pela ponte. Entregue o bloco para ele mandar a primeira do celular |
| a conta foi restringida | disparo, ou mensagem para quem nunca respondeu | conta restrita não usa dispositivo conectado: a ponte fica fora até passar, e o `estado` diz o prazo |

**Falhou em qualquer degrau e você não sabe consertar?** Diga em que degrau
parou, o que apareceu, e que o caminho colado continua valendo. Não tente
adivinhar: um conserto errado deixa a máquina dele pior do que estava.
