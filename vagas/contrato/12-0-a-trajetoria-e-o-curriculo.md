## 12 · A trajetória, e o currículo que sai dela

### `trajetoria.md` — o que você fez, e o que se pode dizer

Um arquivo, na raiz da busca. Teto: **200 linhas**. É o **dono** de tudo o que
qualquer currículo, carta ou resposta de formulário afirma sobre você. Escrito
por `/vagas:perfil-de-busca`, a partir do que você conta e do que colar —
currículo antigo, perfil exportado, texto solto —, que fica em `_bruto/`.

```markdown
# Trajetória de Rafael Duarte — atualizada em 2026-09-14

## Em uma frase
gerente de produto sênior, oito anos entre fintech e logística, com produto de IA em produção

## Experiências — da mais nova para a mais antiga

### Âncora Pagamentos · gerente de produto · 2022-03 a 2026-06
- liderou o produto de antecipação para lojista, com um time de nove  ← candidato, 2026-09-14
- a base ativa foi de 4 mil para 31 mil lojistas em dois anos  ← _bruto/2026-09-14-curriculo-antigo.md
- pôs em produção o primeiro fluxo de atendimento com IA da empresa  ← candidato, 2026-09-14
número que NÃO tenho: quanto a IA reduziu o custo de atendimento — não medimos

### Rota Sul Logística · analista e depois gerente de produto · 2018-01 a 2022-02
- redesenhou o rastreio de carga, do pedido à entrega  ← _bruto/2026-09-14-curriculo-antigo.md
número que NÃO tenho: o efeito no prazo de entrega — saí antes da medição

## Formação
- Administração, UFSC, 2013 a 2017 — concluída
- MBA em Dados, 2023 — cursado, **não concluído**

## Ferramentas e métodos
SQL, Python para análise, Amplitude, Figma, métodos ágeis, descoberta contínua

## Idiomas
inglês: intermediário — leio bem, converso com esforço
espanhol: básico

## O que NÃO se diz
- o MBA nunca aparece como concluído
- a Rota Sul foi contrato por uma consultoria, não vínculo direto
- não há número de conversão nem de custo de aquisição confirmado: não se inventa métrica
```

**Todo número leva procedência, e o que não tem número diz que não tem.**
`número que NÃO tenho:` é a linha mais útil de uma experiência: é o que impede
o currículo de amanhã de preencher o buraco com um número redondo.

**`## O que NÃO se diz` é lida antes de escrever qualquer coisa em seu nome** —
currículo, carta, resposta de formulário, mensagem. É a lista do que parece
verdade, fica bem no papel, e é o tipo de coisa que uma checagem de referência
desmonta.

**O que você conta de si numa tela não morre na tela.** Quem escreve a
trajetória é `/vagas:perfil-de-busca`, e só ela. Mas toda skill que te
pergunta — ou que recebe de volta um texto que você reescreveu, um recado, uma
resposta de formulário que a trajetória não tinha — grava o que você disse
sobre si em `_bruto/AAAA-MM-DD-painel-<assunto>.md` NO MESMO TURNO, como você
escreveu, com `estado: ainda NÃO entrou na trajetoria.md`. E o fecho diz, em
`## Falta saber`, que há fato esperando e qual comando o leva. Uma resposta de
múltipla escolha também é fato: vai o rótulo das opções marcadas e das não
marcadas. `/vagas:perfil-de-busca` começa por esses arquivos.

### O currículo — `curriculos/`

```
curriculos/CV-base.md          o currículo sem vaga em vista
curriculos/V-012-cv.md         o currículo PARA a V-012 (PM de IA, Lumina Pagamentos)
```

Vista **derivada** da `trajetoria.md`, escrita por `/vagas:montar-curriculo`.
Teto: **duas páginas**. Três regras, e a régua da prova cobra as três:

```
1  nada entra que não esteja na trajetoria.md. Adaptar é ESCOLHER e ORDENAR
   o que é verdade, e dizer com as palavras da vaga — nunca acrescentar
2  número, cargo, data e nome próprio saem IGUAIS aos da trajetória. É aqui
   que o arredondamento vira mentira: 31 mil não vira “mais de 30 mil”
   num lugar e “quase 35 mil” no outro
3  o que a vaga pede e você não tem NÃO aparece disfarçado. Aparece na
   conversa com você, em `## Falta saber`: “a vaga pede inglês avançado e a
   trajetória diz intermediário — o currículo diz intermediário”
```

Divergiu o currículo e a trajetória? **A trajetória vence**, e o currículo se
reescreve (seção 1). Corrigiu um fato no currículo à mão? Ele some na próxima
geração — a correção é na trajetória, e chega a todos os currículos de uma vez.

O currículo sai em markdown, que é o que se confere, e o PDF sai dele pelo
modelo `curriculo` do pack (D270) — nunca se corrige o PDF. `.docx` não.

### A carta — `cartas/`

```
cartas/V-012-carta.md          a carta PARA a V-012, com o PDF de uma página ao lado
```

**Sob medida ou nenhuma** (D273). A carta só se escreve quando o formulário da
vaga tem o campo — obrigatório ou opcional — E há pelo menos uma prova da
trajetória que responde a um requisito ESCRITO no anúncio. Carta que serviria
a outra empresa é a genérica, e a genérica não se escreve: rende um terço da
sob medida, e é a que parece feita por máquina. As três regras do currículo
valem inteiras aqui.

Três parágrafos, corpo de 900 a 1.500 caracteres — meia página, que é o que
quem contrata prefere ler (D275):

```
1  a vaga, com o nome que o anúncio usa, e a tese numa frase: por que esta
2  um fato da organização — lido no anúncio, na página dela, numa notícia com
   fonte — que não serviria a outra, e o que se faria com ele
3  UMA prova com número, presa a um requisito do anúncio que a carta cita;
   o convite para conversar. O link não se repete: o cabeçalho já o traz
```

**O convite é para conversar, e não para conferir o projeto.** Diante de uma
organização que faz em escala o que ele fez em pequeno, oferecer o próprio
projeto como vitrine lê como prepotência: o convite fala do que ele aprendeu e
do que interessa a ela. O jargão do anúncio em inglês vai em português quando
existe o termo ("Brilliant Basics" → "o básico bem feito").

**A carta não reconta o currículo.** O nome do projeto entra; a lista técnica
dele — ferramentas, testes, contagens — fica no currículo, que vai junto.
Detalhe que já está lá só entra se a carta disser o que ele significa para
ESTA vaga.

Primeira pessoa, direto, no idioma da vaga. "Prezada equipe de <área> da
<organização>," e "Atenciosamente,". Nunca: adjetivo sobre si ("apaixonado",
"proativo"), "venho por meio desta", repetir o currículo em prosa, elogio à
empresa que não saia de um fato, pretensão salarial (salvo o anúncio pedir, e
aí com a frase do perfil).

O arquivo é a versão final, sem comentário no corpo. A primeira linha — e só
ela — é um comentário que diz a origem e o estado —
`<!-- rascunho · derivado de trajetoria.md, atualizada em AAAA-MM-DD, e de
vagas/V-012-… · para V-012 -->`. **`rascunho` até você ler e dizer que vale**, e
aí `aprovada em AAAA-MM-DD`: a candidatura só leva carta aprovada. Campo de
texto no formulário, em vez de arquivo: a mesma carta, em até 1.400 caracteres,
na hora de candidatar.
