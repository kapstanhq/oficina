<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 11 · Onde esta skill roda

O `SKILL.md` é padrão aberto, e este pack roda em mais de uma ferramenta. O que
muda de uma para outra não é o contrato: é o que existe embaixo dele.

```
Claude Code · Codex CLI · Cursor
  tudo funciona no transporte `local`, que é o único em que a busca se
  MANTÉM. Ver o aviso da seção 1: no `drive` a busca se cria e não se
  atualiza

chat do Claude e chat do ChatGPT na web
  não há pasta no computador: funcionam as QUATRO skills que trabalham com o
  que for COLADO na conversa, e as outras não — o trabalho delas é a busca

os conectores (opcional) — onde há linha de comando e `node`
  é o que dá ALCANCE a este pack. `conectores_estado` diz o que existe e o
  que está ligado; quem liga é você, num terminal seu, e cada um avisa o
  que custa no ato de ligar

    fontes de vaga    gupy, solides, greenhouse, lever, ashby,
                      linkedin-vagas. São listagens PÚBLICAS, lidas sem
                      entrar na sua conta de lugar nenhum — é por isso que
                      buscar não arrisca nada
    link colado       `ler-vaga` lê a vaga de UM link que você colou.
                      Catho, InfoJobs e Indeed proíbem leitura automática
                      nos termos: para eles, cole o texto do anúncio
    navegador         o seu navegador, com os seus logins — ou uma janela
                      só dele, em que você entra uma vez. É o único que age
                      DENTRO de uma conta sua: busca no LinkedIn logado, o
                      que só existe lá, e preenche a candidatura. Quem
                      aperta ENVIAR é a linha `envio de candidatura:` do
                      INDICE.md, e o padrão é você (seção 12.1)
    e-mail pessoal    o que sai daqui sai no SEU nome: toda mensagem passa
                      pela tela do envio (seção 7.1)
    e-mail do agente  uma caixa que é dele, para alerta de vaga e cadastro
                      de aviso — nada que fale em seu nome sai por ela
    WhatsApp          o canal DEPOIS que o recrutador responde. Quem nunca
                      trocou mensagem com você recebe por link (seção 7.1)
    serviços pagos    só com teto escrito por você, e orçamento antes de
                      cada chamada. Sem teto, não gasta

o painel (opcional)
  uma janela no navegador, servida pela sua própria máquina. É onde se
  julga uma pilha de vagas de uma vez, e onde se confere, campo a campo, o
  que vai ser respondido num formulário. Ele NÃO grava nada: devolve o que
  você marcou, e quem escreve na busca continua sendo a skill. Sem ele,
  tudo funciona igual, em texto
```

Sem conector nenhum, a busca é você colando o anúncio — e funciona: o anúncio
colado vira vaga com procedência `← ficha colada`, e o resto do pack não sabe
a diferença.

Sem busca nenhuma, quatro entregam o trabalho e não gravam nada:

| skill | o que ela ainda faz com o que for colado |
|---|---|
| `perfil-de-busca` | as respostas viram o `perfil.md` na tela — e ele fica com você para colar num arquivo |
| `triar-vagas` | o anúncio colado é julgado contra o perfil colado, com o que vale e o que pesa contra |
| `escrever-ao-contato` | a vaga e a trajetória coladas viram a mensagem; some a conferência do `não contatar:` e do que já foi mandado — e ela DIZ isso, em uma linha |
| `montar-curriculo` | a trajetória colada vira o currículo para a vaga colada; some a conferência contra a `trajetoria.md`, que é a parte que impede o currículo de dizer o que você não fez |

E as outras não funcionam, porque o trabalho delas **é** a busca:

| skill | do que ela depende |
|---|---|
| `comecar` | monta a busca — sem transporte, não há onde montar |
| `buscar-vagas` | confere contra o que já entrou, e grava o que achou |
| `candidatar` | lê a vaga, o currículo e a trajetória, e registra o que saiu |
| `o-que-fazer-hoje` | lê a busca inteira para ordenar o dia |
| `retomar-contato` | conta os dias de silêncio e lê o que já foi mandado |
| `organizar-busca` | é a manutenção da busca |
| `laudo-da-busca` | mede a busca contra o contrato |
| `importar-a-conversa` | grava em `_bruto/` e distribui o fato |
| `cobrar-o-que-falta` | lê o que foi prometido e não chegou |
| `completar-ficha` | procura o que falta num arquivo de vaga, e grava com a origem |
| `gravar-o-que-marquei` | grava na busca o que você marcou no painel |

**Quem trabalha sem gravar diz isso.** O `## Guardei` do fecho (seção 10) vira
uma linha só: `- nada foi gravado — você está sem busca aqui`. Trabalho que o
candidato acha que ficou guardado e não ficou é pior que trabalho não feito.

---
