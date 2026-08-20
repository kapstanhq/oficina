# Oficina

**Ferramentas de IA por profissão, em português. Gratuitas.**

Cada **pack** é um conjunto de ferramentas de um ofício. Você instala uma vez e
passa a ter comandos prontos para o que você faz todo dia — escrever, responder,
conferir, lembrar.

As ferramentas guardam o que você já contou, em arquivos seus — numa pasta do
seu computador ou no seu Google Drive. Você não repete a mesma informação duas
vezes.

---

## Packs

| Pack | Para quem | O que faz | Status |
|---|---|---|---|
| [**corretor**](corretor/) | Corretor de imóveis | Anúncio, matrícula, resposta de lead, visita, retomada de contato, documentos e a lista do dia | **Disponível** |
| **contador** | Escritório contábil | Cobrança de documento do cliente, conferência de nota, resumo de mudança na legislação | Em breve |
| **advogado** | Advogado e escritório | Resumo do andamento em português para o cliente, conferência de prazos, minuta a partir das suas peças | Em breve |
| **corretor-seguros** | Corretor de seguros | Renovação, cotação comparada, acompanhamento de sinistro | Em breve |

---

## Como instalar

Duas portas, e a pergunta que decide é uma só: **o programa em que você usa IA
abre pastas do seu computador?**

| Onde você usa IA | Por onde entrar |
|---|---|
| Claude Code, Codex, ChatGPT do computador, Copilot, Cursor | **Porta 1** — o agente instala o pack inteiro |
| ChatGPT na web ou no celular, Gemini, Claude no navegador | **Porta 2** — você cola um prompt |

A porta 2 não é o plano B. É onde está a maior parte das pessoas, e ali não se
instala nada: cola-se um texto.

---

## Porta 1 · O agente instala o pack

### 1. Tenha um agente aberto

Serve o **Claude Code** (<https://claude.com/product/claude-code>), o **Codex**,
o **ChatGPT do computador**, o **Copilot** ou o **Cursor**. Todos funcionam em
Windows, Mac e Linux.

> **Atenção:** todos são serviços pagos. Não existe versão gratuita. Se você não
> tem nenhum, vá pela porta 2 — o Gem do Gemini é grátis.

### 2. Copie este pedido e cole no seu agente

Ele faz a instalação sozinho. Você não precisa baixar nem procurar pasta
nenhuma.

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

### 3. Monte a sua base

```
/corretor:comecar
```

Leva cerca de 10 minutos. Ele pergunta uma coisa de cada vez — a primeira é onde
a sua base vai morar —, salva conforme avança e você pode fechar no meio e
voltar depois.

**Pronto.** A partir daí você digita o que precisa, em português.

---

## Porta 2 · Você cola um prompt

No chat pelo navegador ou pelo celular não se instala ferramenta: nem o ChatGPT
da web, nem o Gemini, nem o Claude sem plano pago recebem uma. O que funciona
ali é **colar um prompt** — o pack inteiro num texto só, que dá conta das dez
tarefas.

**O caminho mais curto é montar o seu em
<https://kapstan.com.br/oficina/corretor-de-imoveis>.** Ali você escolhe onde
usa IA, se já tem carteira e quais ferramentas quer, e o texto sai pronto,
menor e com os passos do seu serviço — tem um botão de copiar.

Prefere o arquivo? Ele está em [`corretor/PROMPT.md`](corretor/PROMPT.md):
abra e copie tudo o que estiver entre as duas marcas `---8<---`. É o pack
inteiro, com as dez tarefas. Cola uma vez e serve para tudo — não se cria um
assistente por tarefa.

### No Gemini — grátis, e o único que lê o seu Google Drive

1. Abra <https://gemini.google.com> e clique em **Gems**, no menu da esquerda.
2. **Novo Gem**: escreva o nome “Corretor” e cole o prompt no campo de
   instruções.
3. Em **Conhecimento**, anexe a pasta `carteira` do seu Google Drive. Salve.

O passo 3 é o que quase ninguém percebe: **um Gem lê arquivos do seu Drive**.
Com a carteira lá, ele para de trabalhar só com o que você cola e passa a
trabalhar com a sua carteira.

### No ChatGPT da web ou do celular

1. Em <https://chatgpt.com>, crie um **Projeto** pela barra lateral, ou um GPT
   personalizado em **GPTs** → **Criar** → aba **Configurar**.
2. Cole o prompt em **Instruções**.
3. Suba os arquivos da sua carteira em **Arquivos**, no Projeto, ou em
   **Conhecimento**, no GPT. Salve.

Ferramenta solta não entra no ChatGPT da web nem no celular. Entra no do
computador, que é a porta 1.

### No Claude do navegador

1. Em <https://claude.ai>, vá em **Projetos** → **Novo projeto**.
2. Abra **Instruções do projeto** e cole o prompt.
3. Adicione os arquivos da sua carteira ao conhecimento do projeto.

### Tem plano pago no Claude? Mande a ferramenta inteira

É melhor que o prompt: em vez de um resumo do pack, vai a ferramenta como ela é.
Leva uns 3 minutos.

1. Abra <https://github.com/kapstanhq/oficina>, clique no botão verde **Code**
   e depois em **Download ZIP**.
2. Descompacte o arquivo baixado e entre na pasta
   `oficina-main` → `corretor` → `skills`.
3. Ali dentro há uma pasta por ferramenta. Clique com o botão direito na que
   você quer e escolha **Enviar para → Pasta compactada** (no Mac:
   **Comprimir**).
4. No Claude, abra as **Configurações**, vá em **Recursos** e envie o `.zip`.
5. Repita para cada ferramenta que quiser usar.

> **Duas condições.** Precisa de plano Pro, Max, Team ou Enterprise, com
> **execução de código** ligada nas configurações. E a sua base precisa ficar no
> **Google Drive**: no navegador não existe pasta do seu computador.

### O que a porta 2 não faz

O prompt entrega o texto — anúncio, resposta de lead, roteiro de vídeo,
matrícula lida, lista de documentos. O que ele não faz sozinho é **lembrar**.

| O que se perde sem arquivos | Por quê |
|---|---|
| Retomar contato | Ela precisa saber há quantos dias a pessoa não responde e qual ângulo já foi tentado. A segunda retomada não pode repetir a primeira. |
| A lista do dia e a montagem de visita | As duas leem a carteira inteira de uma vez. Colar o suficiente para reproduzir isso é colar tudo. |
| Começar a carteira, e organizá-la | Uma monta e a outra arruma. As duas são a carteira em si, e sem arquivo não há o que montar nem o que arrumar. |
| O `?` que vira a pergunta de amanhã | Sem arquivo, a procedência vale dentro de uma conversa só, e a sessão seguinte recomeça do zero. |

Anexando arquivos — a pasta do Drive no Gem, os documentos no Projeto —, boa
parte disso volta.

---

## Onde funciona

O arquivo de cada ferramenta segue um formato aberto, e não um formato nosso.
Por isso o mesmo pack carrega em vários lugares. O que muda é **como ele entra**
e **onde a sua base pode ficar**.

| Onde você usa IA | Como o pack entra | Onde a base pode ficar |
|---|---|---|
| **Claude Code** | marketplace, ou o pedido da porta 1 | computador ou Drive |
| **Codex**, **ChatGPT do computador** | o pedido da porta 1, em `~/.agents/skills` | computador ou Drive |
| **Copilot**, **Cursor** | o pedido da porta 1, em `.agents/skills` | computador ou Drive |
| **Claude no navegador**, com plano pago | `.zip` pelas Configurações | só no Google Drive |
| **Claude no navegador**, sem plano pago | prompt colado num Projeto | os arquivos que você anexar |
| **ChatGPT na web ou no celular** | prompt colado num Projeto ou GPT | os arquivos que você anexar |
| **Gemini** | prompt colado num Gem | a pasta do Drive anexada ao Gem |

O Claude Code é o caminho que testamos. Nos outros, o pedido de instalação
descobre sozinho onde escrever — e, se a sua ferramenta não estiver na tabela,
vale o que a documentação dela indicar.

---

## O que você não precisa

- **Não precisa saber programar.** Tudo é digitado em português — no agente, se
  você foi pela porta 1; na caixa de mensagem, se foi pela 2.
- **Não precisa de planilha, CRM ou sistema novo.** As ferramentas criam os
  arquivos sozinhas.
- **Não precisa da autorização da sua empresa.** Os arquivos são seus e ficam
  com você — na sua máquina ou na sua conta Google.

---

## Onde ficam os seus dados

Numa pasta sua, e você escolhe uma vez qual: uma pasta no seu computador, ou
uma pasta no seu Google Drive.

| Onde | O que dá | O que cobra |
|---|---|---|
| **No computador** | Mais privado: os arquivos não saem da sua máquina | Só funciona onde existe pasta — no chat da web, não |
| **No Google Drive** | Funciona no chat e no celular: a carteira vai com você | Os arquivos ficam na sua conta Google |

São os mesmos arquivos nos dois casos. No pack do corretor:

```
carteira/
├── imoveis/
│   ├── V-071-casa-3d-azenha.md
│   └── A-014-apto-2d-menino-deus.md
├── clientes/
│   └── C-017-joana-ribeiro.md
├── hoje.md
└── funil.md
```

São arquivos de texto comuns. Você abre no Bloco de Notas, imprime, copia para
um pendrive, manda por e-mail.

**A Kapstan não recebe nada, nos dois casos.** Não existe servidor nosso no
meio: ou os arquivos ficam na sua máquina, ou vão para a nuvem que já é sua. E
nada fica preso — se você parar de usar as ferramentas amanhã, os arquivos
continuam lá e continuam legíveis.

---

## O que estas ferramentas nunca fazem

| Não fazem | Por quê |
|---|---|
| Enviar mensagem no seu lugar | Elas escrevem o texto. Quem aperta enviar é você. |
| Inventar informação | O que não foi apurado aparece como `?` e vira pergunta. |
| Decidir por você | Preço, aceitar proposta, dizer que um documento está em ordem: elas mostram o que olhar e param. |

Cada pack tem uma seção **“Onde este pack para”** com os limites daquele ofício,
escrita antes de instalar e não depois.

---

## Roadmap

| Quando | O que |
|---|---|
| Agora | Pack do corretor de imóveis, com 10 ferramentas |
| Próximo | Pack do contador e pack do advogado |
| Depois | Pack do corretor de seguros |
| Sempre | Novas ferramentas dentro dos packs que já existem |

---

## Contribuir

Conte **o que você reescreve toda semana**. É disso que sai a próxima
ferramenta, e é o que decide qual profissão entra depois.

Abra uma questão em <https://github.com/kapstanhq/oficina/issues>.

---

## Quem faz

[Kapstan](https://kapstan.com.br) — implantação de IA dentro da operação de
empresas.

A Oficina é aberta e gratuita, e continua assim.

## Licença

MIT. Pode usar, mudar e distribuir, inclusive comercialmente.
