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
   nenhum. E como são conversas de clientes, o dono desses dados é você
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

## A cadeia, em sete degraus

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
verificar   o processo `whatsapp-reader` está rodando
agir        abrir uma JANELA NOVA de terminal e rodar:  whatsapp-reader serve
confirmar   o processo aparece na lista de processos
```

**Janela própria, e ela fica aberta.** O daemon é quem recebe as mensagens: se
a janela fechar, o histórico congela no último momento em que ele estava vivo,
e o que passou enquanto ele esteve fora **não volta**. Diga isso ao corretor
com essas palavras — é o erro que ele vai cometer.

### 5 · Pareado

```
verificar   estado_da_ponte responde com mais de zero conversas
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

**Só agora** escreva no `INDICE.md` — as duas linhas, juntas:

```
WhatsApp: sim  ← testado AAAA-MM-DD
envio: pergunta sempre
```

Antes disso, a linha continua `não`. "Conectado" sem prova é o defeito que
aparece três dias depois, no meio de outra coisa.

A segunda linha não é resultado de teste: é o padrão do contrato (seção 7.1), e
ela **só existe onde há conector** — por isso nasce colada na primeira, no mesmo
ato. **Não pergunte agora qual ele quer.** Ele nunca viu o envio funcionar, e
escolha sem experiência é escolha jogada fora. Diga só que a linha existe e que
trocar é trocar uma palavra: `responder sem perguntar` responde direto quem
escreveu para ele — começar conversa continua perguntando —, e `não` faz a skill
nem oferecer.

---

## Quando falhar

| o que aparece | o que é | o conserto |
|---|---|---|
| `websocket: close 1006` | o WhatsApp recusou a versão do cliente, e o erro não diz isso | `go get -u go.mau.fi/whatsmeow@latest`, depois `go mod tidy` e compilar de novo. Se aparecer erro de compilação citando `context`, a biblioteca mudou e isso é conserto de mantenedor: pare e diga isso |
| `missing go.sum entry` | dependência não resolvida | `go mod tidy` e compilar de novo |
| o QR não aparece, ou sai como caracteres embaralhados | o terminal não desenha os blocos | use o `qr.png` que está ao lado do binário |
| "o QR expirou" | passou dos três minutos | rode `whatsapp-reader serve` de novo, com o celular já na tela de conectar |
| o antivírus reclama do binário | executável recém-compilado, sem assinatura | ele foi compilado ali, na máquina dele, a partir do código — mas **não insista**: se ele não quiser liberar, volte para o colado |
| `estado_da_ponte` diz zero conversas | o daemon não está rodando, ou nunca pareou | confira o degrau 4 antes do 5 |
| tudo funciona e as ferramentas não aparecem | o programa não reiniciou depois do `mcp add` | fechar e abrir |

**Falhou em qualquer degrau e você não sabe consertar?** Diga em que degrau
parou, o que apareceu, e que o caminho colado continua valendo. Não tente
adivinhar: um conserto errado deixa a máquina dele pior do que estava.
