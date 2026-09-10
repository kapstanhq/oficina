<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 8 · Quando perguntar, e como

Perguntar cedo demais é o defeito mais caro do pack: o prospector já respondeu
aquilo, está escrito na carteira, e a skill perguntou de novo.

### A ordem de busca

Só desce um degrau quando o de cima não respondeu:

```
1  INDICE.md                 quem ele é, modo, o que está conectado
2  o _indice.md do tema      contas/ ou contatos/ — acha o id e o apelido
3  o arquivo do item         é ele o dono do fato
4  _bruto/                   a conversa ou a ficha de onde o fato veio
5  o link                    a página da conta, quando há link e ela abre
6  PERGUNTA ao prospector      só o que nenhum dos cinco tinha
7  PEDE O DOCUMENTO          quando nem ele sabe: CNPJ, contrato social, edital
```

O degrau 5 tem um fim conhecido: site que só monta a página por JavaScript
devolve nada. Quando isso acontecer, diga na cara — “esse site não abre para
mim” — e peça a ficha colada. **Não chute dado de conta**, em hipótese
nenhuma, nem para “ilustrar”.

### O tamanho da pergunta

Uma por vez. **Nunca mais de três numa execução.** Skill que abre com
formulário de oito campos é abandonada na primeira execução, e não volta.

Toda pergunta traz o motivo na mesma frase, porque o motivo é o que ensina o
ofício enquanto a skill trabalha:

```
ruim   Qual o e-mail dela?
bom    Você tem o e-mail da Carla? Sem ele a abordagem só sai pelo LinkedIn,
       que tem teto de caracteres e some no meio de vinte outras.
```

### Escolha entre dois e quatro caminhos

Use a UI de perguntas do harness (a ferramenta de perguntar ao usuário, com
botões) — não escreva as opções em prosa e peça para ele digitar o número.

Cada opção traz **o custo escrito**: o que ela exige e quanto demora.

```
Como quer abordar a P-017 (Carla Menezes)?

  Curta, para o LinkedIn    4 linhas e um gancho só · pronto agora
  Completa, para e-mail     12 linhas com o caso e o número · preciso do e-mail dela
  As duas                   pronta agora, e a de e-mail fica com um ? no endereço
```

Rótulo curto, até quatro palavras. A descrição declara o custo, não vende a
opção. Mais de quatro caminhos: escolha os três melhores e diga que há outros.

### Quando NÃO perguntar

- o fato está na carteira: use, e cite de onde veio
- é gosto do prospector sobre o que ele já decidiu antes: siga o que está escrito
  em `## Como eu trabalho`
- é detalhe que não muda a saída: deixe `?` e siga
- em modo automático: escolha e declare (seção 5) — a exceção é
  `estudar-conta`, que pergunta sempre

---
