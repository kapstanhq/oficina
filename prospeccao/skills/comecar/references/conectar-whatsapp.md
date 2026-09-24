<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/referencias/conectar-whatsapp.md, e ela vale para qualquer
     profissão: as marcas do ofício são resolvidas na geração, pelo
     vocabulario.json do pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`. -->

# Conectar o WhatsApp — a cadeia

Isto é OPCIONAL. O padrão continua sendo colar, e quem não chegar até aqui não
perde nenhuma skill.

**Só siga se houver linha de comando** — Claude Code, Codex CLI, Cursor. Nos
chats da web não há como executar nada, e aí a resposta é uma linha: "esse
caminho precisa de um programa que rode comandos no seu computador; aqui a
gente cola, e funciona igual".

## Antes de instalar, o que ele tem que ouvir

Não são letra miúda: são o que faz o prospector decidir com o que ele tem, e o
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

**Não precisa de Go, de git nem de compilador.** O caminho principal é o
programa pronto, um arquivo por sistema. Compilar do código é a alternativa, no
fim da cadeia, para quem prefere.

### 1 · O programa, baixado

```
verificar   a pasta ~/whatsapp-reader existe e tem o programa dentro
agir        baixar da página de versões, github.com/kapstanhq/whatsapp-reader/releases/latest,
            o arquivo do sistema dele, e extrair em ~/whatsapp-reader
confirmar   o programa está lá: whatsapp-reader.exe no Windows,
            whatsapp-reader no Mac e no Linux
```

Qual arquivo — o harness diz o sistema; a arquitetura, se ele não souber, sai
de `uname -m` (Mac e Linux) ou de Configurações › Sistema › Sobre (Windows):

```
Windows              whatsapp-reader_<versão>_windows_amd64.zip
Windows em ARM       …_windows_arm64.zip     (Surface e notebooks Snapdragon)
Mac com chip Apple   …_darwin_arm64.tar.gz   (M1 em diante — `uname -m` diz arm64)
Mac com Intel        …_darwin_amd64.tar.gz
Linux                …_linux_amd64.tar.gz    (ou arm64)
```

**A pasta é fixa, e ela é o diretório da ponte**: a sessão, as conversas
copiadas, `qr.png`, `nao-contatar.txt` e o `vocabulario.txt` pessoal moram ao
lado do programa. Pasta de Downloads que ele limpa todo mês é ponte que some.

Quer conferir o arquivo? `checksums.txt`, na mesma página, tem o SHA-256 de
cada um: `certutil -hashfile <arquivo> SHA256` no Windows, `shasum -a 256
<arquivo>` no Mac e no Linux.

### 2 · Liberado para rodar

Programa baixado da internet e sem assinatura passa por uma trava do sistema.
Cada um tem a sua, e ela aparece uma vez:

```
Windows   antes de extrair: botão direito no .zip → Propriedades →
          marcar “Desbloquear” → OK. Se aparecer “O Windows protegeu o
          computador”: “Mais informações” → “Executar assim mesmo”
Mac       “não pode ser aberto porque a Apple não pode verificá-lo”:
          xattr -d com.apple.quarantine ~/whatsapp-reader/whatsapp-reader
          (ou Ajustes do Sistema › Privacidade e Segurança → “Abrir Mesmo Assim”)
Linux     chmod +x ~/whatsapp-reader/whatsapp-reader
```

**Quem decide liberar é ele.** Diga o que o aviso é — programa sem assinatura de
loja, não vírus detectado — e, se ele não quiser, pare aqui: colar continua.

### 3 · Ele responde

```
verificar   rodar o programa sem argumento mostra a ajuda
agir        —
confirmar   a ajuda lista serve, mcp, estado, verificar
```

**Nos comandos daqui em diante, `whatsapp-reader` é o caminho inteiro do
programa** — ou, dentro da pasta dele, `./whatsapp-reader` no Mac e no Linux e
`.\whatsapp-reader.exe` no Windows. Pôr a pasta no PATH é conforto, não degrau.

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
`whatsapp-reader estado` sabe dizer. Conte isso ao prospector: é mais barato
do que ele descobrir sozinho, e é o motivo do degrau seguinte.

### 4.5 · Vivo depois de desligar o computador

```
verificar   o prospector reinicia a máquina e `whatsapp-reader estado` ainda
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

macOS     um .plist em ~/Library/LaunchAgents (Label whatsapp-reader,
          ProgramArguments com o caminho e `serve`, RunAtLoad e KeepAlive
          true, WorkingDirectory a pasta da ponte); carregar com
          launchctl load -w ~/Library/LaunchAgents/<o arquivo>.plist

Linux     um serviço de usuário em ~/.config/systemd/user/whatsapp-reader.service
          (ExecStart=<caminho> serve, WorkingDirectory=<a pasta>,
          Restart=always, WantedBy=default.target); depois
          systemctl --user enable --now whatsapp-reader
```

**No Windows, o Agendador pode responder "Acesso negado"** — medido em
16/09/2026 numa máquina de trabalho comum, com `schtasks /create`. Ele quer
elevação, e o prospector pode não ter. A saída não precisa de nada disso: um
atalho para o `whatsapp-reader.exe`, com `serve` no campo de argumentos, dentro
da pasta `shell:startup` (cole isso no Executar). O que abre nela abre no logon.

Depois do agendador, **rodar `serve` na mão passa a recusar**: o daemon já
está de pé, e a recusa diz isso com o número do processo. É o certo — dois
`serve` na mesma sessão corrompem a decifragem das mensagens.

Uma coisa que o agendador **não** resolve, e o prospector tem que ouvir: de
tempos em tempos o WhatsApp repede o QR (item 3 dos avisos). Nesse dia o daemon
sobe e não conecta — e é o `estado` que diz isso, com todas as letras. O
agendador cuida do processo; o pareamento continua sendo dele.

### 5 · Pareado

```
verificar   whatsapp-reader estado diz "de pé e conectada"
agir        o QR está na janela do degrau 4, e também em qr.png ao lado do
            programa — use a imagem se o desenho no terminal sair quebrado
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
agir        no Claude Code:  claude mcp add -s user whatsapp -- <caminho> mcp
confirmar   a lista mostra "Connected"
```

`-s user` é o que faz a ponte valer em qualquer pasta — sem ele, ela só existe
na pasta em que o comando rodou. `<caminho>` é o do programa, inteiro, e **no
Windows com barra normal**: `C:/Users/<nome>/whatsapp-reader/whatsapp-reader.exe`
— a invertida some no caminho até o programa, e o erro não diz isso.

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

### 7.5 · Os áudios, se ele quiser

```
verificar   whatsapp-reader verificar
agir        instalar os dois programas, baixar um modelo e instalar o
            vocabulário do ofício (tudo abaixo)
confirmar   `verificar` diz "tudo pronto", e `estado_da_ponte` passa a mostrar
            a linha da transcrição
```

**Adiável como o 4.5, e pelo mesmo motivo: nada do que já funciona depende
disto.** Sem ele, nota de voz continua sendo buraco declarado, que é como o
pack viveu até agora.

O que muda com ele: nota de voz de conversa individual passa a chegar
transcrita, e o que o contato combinou falando entra na carteira como entra o
que ele escreveu.

**Nada sai da máquina** — a transcrição roda num programa local, e é o padrão.
Existe um modo que manda o áudio para um serviço na internet; ele não liga
sozinho, e não é este degrau. Diga a frase assim mesmo: é a primeira pergunta
de quem ouve que o computador vai "escutar" as conversas.

São dois programas e um modelo:

```
Windows   scoop install whisper-cpp ffmpeg   (o Scoop, se não houver, sai de
          scoop.sh, sem pedir administrador)
macOS     brew install whisper-cpp ffmpeg
Linux     o ffmpeg vem do gerenciador da distribuição (sudo apt install
          ffmpeg); o whisper.cpp se compila de github.com/ggml-org/whisper.cpp
```

O modelo é um arquivo `.bin` em `modelos/`, no diretório da ponte, baixado de
huggingface.co/ggerganov/whisper.cpp:

```
ggml-large-v3-turbo-q5_0.bin   574 MB   o preferido, mais preciso
ggml-small-q5_1.bin            190 MB   para a máquina que não acompanha
```

**Qual dos dois é medida, não palpite.** `whatsapp-reader verificar <um
áudio>` transcreve e cronometra: *"0:42 de áudio em 0:31 (0,7× a duração)"*.
Abaixo de 1× a fila anda; acima, ela acumula e nunca alcança. Medido numa
máquina de trabalho comum em 16/09/2026, o `small` deu **0,8×** — ali o grande
não caberia.

Não precisa reiniciar nada depois de instalar: faltando peça a fila **pausa**,
e ela volta sozinha em até um minuto. O que a fila não faz é voltar atrás —
áudio que chegou antes de a ponte existir ficou só com o rótulo, e é por isso
que este degrau vale mais cedo do que tarde.

**E o vocabulário do ofício, que é uma linha:**

```
whatsapp-reader vocabulario instalar <o references/vocabulario.txt desta skill>
```

É a lista das palavras que ele fala todo dia e que a transcrição erra sozinha —
cargo entre elas — com a correção dos erros que ela já cometeu.
Sem ele a transcrição funciona; com ele, ela para de trocar o nome das coisas
do ofício. O arquivo pessoal é o passo seguinte, e é dele: `vocabulario.txt`,
no diretório da ponte, onde entram os nomes dos contatos e dos lugares que
só ele fala. `whatsapp-reader vocabulario` mostra o que está valendo.

### 8 · O envio, provado uma vez

```
verificar   a linha `envio:` existe no INDICE.md
agir        mandar UMA mensagem para o número do próprio prospector
confirmar   ele diz que ela chegou, no celular dele
```

Este degrau existe porque a alternativa é a primeira mensagem da vida daquela
instalação sair para um contato de verdade — e porque a agenda, o Gmail e o
Drive também só viram `sim` testados. Não há razão para o envio ser o único a
ganhar `sim` sem prova.

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
uma vez**. Quando um contato pedir para não ser contatado, o contrato (seção
7.1) manda escrever em dois lugares, e um deles é este — um arquivo no diretório
da ponte, que a carteira não alcança:

```
whatsapp-reader nao-contatar 5511900000012 "pediu em 12/08"
```

Diga ao prospector que ele mesmo pode rodá-lo, e que `--tirar` desfaz. Pedido
de silêncio que fica só na carteira continua valendo para as skills, mas não
segura o envio se alguém esquecer — e é para isso que os dois lugares existem.

---

### A alternativa · compilar do código

Para quem prefere não rodar programa baixado, ou quer a versão do dia. Troca os
degraus 1 a 3, e o resto da cadeia é igual:

```
Go         Windows: winget install GoLang.Go · Mac: brew install go ·
           Linux: o instalador de go.dev/dl (o do gerenciador costuma ser
           velho demais). Reabra o terminal, e `go version` responde
código     git clone https://github.com/kapstanhq/whatsapp-reader
           (sem git: “Code” → “Download ZIP” na mesma página, e extraia)
compilar   dentro da pasta, no Mac e no Linux:
             CGO_ENABLED=0 go build -o whatsapp-reader .
           no Windows (PowerShell):
             $env:CGO_ENABLED="0"; go build -o whatsapp-reader.exe .
```

A primeira compilação baixa as bibliotecas e demora alguns minutos em silêncio.
**Não precisa de compilador C**: instrução que mande instalar GCC ou MinGW está
desatualizada.

---

## Desligar, e o que some junto

É dele, e é curto. Nesta ordem, porque o primeiro já corta o acesso:

```
1  no celular: Configurações › Dispositivos conectados → o dispositivo →
   “Desconectar”. A partir daqui a ponte não lê nem manda nada
2  na máquina: fechar a janela do `serve` e tirá-lo da inicialização —
   a tarefa do Agendador ou o atalho em shell:startup, o .plist
   (launchctl unload -w <arquivo>) ou o serviço
   (systemctl --user disable --now whatsapp-reader)
3  no programa: claude mcp remove -s user whatsapp
4  apagar a pasta ~/whatsapp-reader — a sessão e as conversas copiadas
   moram nela, e só nela
```

No `INDICE.md`, `WhatsApp:` volta a `não`, com a data, e a linha `envio:` sai.
O que já entrou na carteira fica: é dele, e tem procedência.

## Quando falhar

| o que aparece | o que é | o conserto |
|---|---|---|
| `websocket: close 1006` | o WhatsApp recusou a versão da biblioteca, e o erro não diz isso | baixe o programa da versão mais nova (degrau 1) e troque o arquivo, com o `serve` parado. Não há versão mais nova: é conserto de mantenedor — pare e diga isso. Quem compila: `go get -u go.mau.fi/whatsmeow@latest`, `go mod tidy` e compilar de novo |
| “não pode ser aberto porque a Apple não pode verificá-lo” · “O Windows protegeu o computador” · `Permission denied` | a trava do sistema para programa baixado | o degrau 2 |
| o QR não aparece, ou sai como caracteres embaralhados | o terminal não desenha os blocos | use o `qr.png` que está ao lado do programa |
| "o QR expirou" | passou dos três minutos | rode `whatsapp-reader serve` de novo, com o celular já na tela de conectar |
| o antivírus reclama do programa | executável sem assinatura de loja | o `checksums.txt` da página de versões prova que é o arquivo publicado; compilar do código é a outra saída — mas **não insista**: se ele não quiser liberar, volte para o colado |
| `estado_da_ponte` diz zero conversas | o daemon não está rodando, ou nunca pareou | confira o degrau 4 antes do 5 |
| tudo funciona e as ferramentas não aparecem | o programa não reiniciou depois do `mcp add` | fechar e abrir |
| `estado` diz "fora do ar" e a janela parece aberta | a janela morreu, ou o computador reiniciou | rodar `serve` de novo, e fazer o degrau 4.5 desta vez |
| `estado` diz que outro dispositivo assumiu a sessão | o WhatsApp Web abriu no navegador, ou há um segundo `serve` | fechar o outro e rodar `serve` de novo — esta ponte não volta sozinha |
| o envio recusa dizendo que não existe conversa | primeiro contato: o WhatsApp recusa desde julho de 2026 | não há contorno pela ponte. Entregue o bloco para ele mandar a primeira do celular |
| a conta foi restringida | disparo, ou mensagem para quem nunca respondeu | conta restrita não usa dispositivo conectado: a ponte fica fora até passar, e o `estado` diz o prazo |
| `estado_da_ponte` diz `transcrição: PARADA` | falta o ffmpeg, o whisper ou o modelo — e a fila pausou sem gastar tentativa | `whatsapp-reader verificar` na máquina da ponte diz qual peça, e a fila volta sozinha depois de instalada |
| `serve` recusa dizendo que já há uma ponte de pé | há outro daemon rodando — em geral o que subiu sozinho com o computador (degrau 4.5) | é o certo: dois `serve` na mesma sessão corrompem a decifragem. Use a janela que existe; se aquele processo morreu agora, um minuto e ele libera |
| os áudios novos vêm transcritos e os antigos não | a ponte só guarda o som do que chega depois que ela sobe | não tem conserto, e não é defeito: os antigos ficaram com o rótulo. Vale contar isso antes de ele reparar sozinho |

**Falhou em qualquer degrau e você não sabe consertar?** Diga em que degrau
parou, o que apareceu, e que o caminho colado continua valendo. Não tente
adivinhar: um conserto errado deixa a máquina dele pior do que estava.
