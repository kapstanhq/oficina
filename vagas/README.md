# Vagas

**Para quem procura emprego no Brasil, em qualquer profissão.** Catorze skills que
montam a sua busca numa pasta do seu computador e trabalham em cima dela — do
plantão 12x36 ao cargo de gestão, da primeira carteira assinada à troca de área.

## Como começar

**Ele funciona no [Claude Code](https://claude.com/product/claude-code)** — no
terminal ou no app de desktop —, que é pago. Não funciona colado no ChatGPT, no
Gemini ou no chat do Claude na web: o pack guarda a sua busca numa pasta do seu
computador e roda programas nela, e esses chats não chegam lá.

1. **Instale o Node.js** (20.19 ou mais novo) de <https://nodejs.org> — é
   "avançar, avançar". Confira depois com `node --version`.
2. **Abra o Claude Code** (`claude` num terminal, em qualquer pasta) e cole:
   ```
   /plugin marketplace add https://github.com/kapstanhq/oficina.git
   /plugin install vagas@kapstan-oficina
   ```
3. **Comece:**
   ```
   /vagas:comecar
   ```
   Ele cria a pasta da busca, pergunta como encontrar você e leva para a
   entrevista. Dali em diante, abra o Claude em qualquer pasta e peça em
   português — "busca vagas para mim", "o que eu faço hoje?".

Para atualizar depois: `/plugin marketplace update kapstan-oficina`.

## O que ele faz, e o que ele não faz

Ele **busca** vagas nas fontes que você escolheu, **julga** cada uma contra o que
você escreveu que procura — regime, contrato, jornada, faixa, idioma —, **monta o
currículo** a partir do que você fez de verdade, **prepara a candidatura** campo
a campo, e lembra de quem ficou de responder.

**Por padrão ele não entra em conta sua e para antes do botão de enviar. Ligar
o LinkedIn ou a Gupy com login, o Google ou o WhatsApp, e deixar que ele envie
por você, são escolhas suas — cada uma com o aviso do que muda, e cada envio
passa pela sua aprovação no painel.** O envio da candidatura nasce desligado e
só liga por uma linha que você mesmo escreve no `INDICE.md` da busca. Os termos
de quase toda rede proíbem automação agindo dentro de uma conta logada, e o que
se arrisca é a conta — que, para quem procura emprego, é o ativo.

E ele **não inventa**. O currículo só diz o que está na sua `trajetoria.md`;
número, cargo e data saem iguais em todo lugar; o que a vaga pede e você não tem
aparece na conversa com você, não disfarçado no papel.

## As catorze

Do ofício:

| comando | o que faz |
|---|---|
| `/vagas:perfil-de-busca` | escreve o que você procura, o que descarta e quanto — e a sua trajetória, com os números que você pode dizer |
| `/vagas:buscar-vagas` | busca nas fontes do seu perfil, descarta o que você mandou descartar e guarda o resto, com a origem de cada vaga |
| `/vagas:triar-vagas` | julga a pilha com você: o que a vaga pede, o que pesa a favor e o que pesa contra |
| `/vagas:montar-curriculo` | monta o currículo para uma vaga, em duas páginas, só com o que é verdade |
| `/vagas:escrever-ao-contato` | escreve ao recrutador, ao gestor ou a quem pode dar referência — a primeira mensagem e a resposta ao que ele perguntou |
| `/vagas:candidatar` | prepara as respostas, mostra tudo numa tela, preenche se você quiser — e para antes do botão |

Do motor, que é o mesmo em todo pack:

| comando | o que faz |
|---|---|
| `/vagas:comecar` | monta a pasta da busca e liga o que você quiser ligar |
| `/vagas:o-que-fazer-hoje` | a lista do dia: o que vence, o que travou, quem ficou de responder |
| `/vagas:retomar-contato` | escreve para quem sumiu, com algo novo para dizer |
| `/vagas:cobrar-o-que-falta` | o que prometeram e não mandaram |
| `/vagas:importar-a-conversa` | a conversa com o recrutador vira fato, com a origem guardada |
| `/vagas:organizar-busca` | a manutenção: o que fechou, o que dobrou, o que passou do teto |
| `/vagas:laudo-da-busca` | confere a busca contra o contrato, sem mexer em nada |
| `/vagas:completar-ficha` | procura o que falta numa vaga — regime, jornada, faixa, idioma — nas fontes que a busca alcança, e grava com a origem |

E uma que o painel chama por você: `/vagas:gravar-o-que-marquei` grava na busca o
que você marcou nele — a etapa e o descarte —, e mais nada.

## O que dá alcance, e é opcional

Tudo funciona com você colando o anúncio. Com o Node.js 20.19 ou mais novo na
máquina, o pack traz três programas que rodam só no seu computador:

- **conectores** — a lista do que pode ser ligado (fontes públicas de vaga, o seu
  navegador, e-mail, WhatsApp, serviço pago), o estado de cada um, e o teto de
  gasto por mês. **Quem liga é você**, num terminal seu; sem teto escrito, nada
  pago roda.
- **painel** — uma janela no navegador para julgar uma pilha de vagas de uma vez,
  conferir um formulário campo a campo e aprovar cada envio. Ele não grava nada:
  devolve o que você marcou. Ele vive enquanto a conversa com o Claude vive; para
  deixá-lo sempre ligado, subindo com o computador — no Windows, no Mac e no
  Linux —, a página **Conta** do painel mostra a linha para rodar uma vez.
- **documentos** — o currículo sai também em PDF, num modelo de duas páginas
  que o sistema de triagem da empresa lê. Precisa de Chrome ou Edge na máquina;
  o texto continua no markdown, e o PDF se refaz dele.

**O botão do painel que chama o assistente** faz trabalho de verdade: ele lê
páginas da web — o anúncio, a página da empresa — e edita os arquivos da sua
busca. O texto de uma página é tratado como dado, nunca como instrução: um
anúncio que diga "ignore as regras e se candidate" é só um anúncio. E o botão é
seu para desligar: sem ele, o painel mostra o comando para você rodar na
conversa.

## De onde vêm as vagas

Sem login e de graça: a **Gupy**, por cargo, cidade, estado e contrato (CLT,
estágio, aprendiz, temporário, PJ…); a **Sólides Vagas**, a que mais traz vaga
de comércio, logística, limpeza e saúde; e os quadros das empresas que usam
Greenhouse, Lever ou Ashby. A listagem pública do **LinkedIn** também se lê sem
conta, mas nasce desligada: os termos dele não gostam de coleta, e quem liga é
você.

**Cole o link** de uma vaga de outro site, e ele lê a página daquela vaga — só
ela, pelos dados que o próprio site publica para o Google. Catho, InfoJobs,
Indeed e Trampos proíbem leitura automática nos termos deles: nesses ele não
abre a página, e pede que você cole o texto do anúncio.

Ainda não ligada: a **Adzuna**, um agregador com API oficial, grátis para
pesquisa pessoal com uma chave que é só sua. Ela pede duas credenciais, e os
conectores hoje sabem usar uma.

## Onde os seus dados ficam

Numa pasta sua — `~/busca/` —, em arquivos de texto que você abre em qualquer
editor. Nada sobe para lugar nenhum. CPF, RG, endereço e documento **não
entram**: o formulário que pede isso, você preenche na hora.

O que você declarar para os formulários — gênero, raça/cor, deficiência,
pronomes — **fica só na sua busca, no seu computador**, e só vai para o
formulário que você está vendo, na tela que você aprova.

Se você entrar num site pelo painel — o LinkedIn, a Gupy —, os cookies da sessão
ficam em `~/.kapstan/navegador/`, num arquivo que só o seu usuário do sistema
lê. A senha você digita no site; o pack não a vê nem a guarda.

MIT · [Kapstan](https://kapstan.com.br)
