<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/referencias/painel.md, e ela vale para qualquer
     profissão: as marcas do ofício são resolvidas na geração, pelo
     vocabulario.json do pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`. -->

# O painel — a janela do modo copiloto

Isto é OPCIONAL. Sem painel, tudo funciona igual no terminal — e é assim que
funciona na maior parte das ferramentas. Nada aqui acrescenta capacidade: o
painel dá **forma** ao que o contrato já obriga.

**Só existe se o plugin estiver instalado e houver `node` na máquina.** Nos
chats da web não há como rodar um programa, e ali a resposta é o texto de
sempre. Não mencione o painel onde ele não existe.

---

## O que ele é

Um endereço que abre no navegador de quem trabalha com você, servido pela
própria máquina dele. Nada sobe para lugar nenhum.

Ele serve para uma coisa só: **mostrar o que seria uma tabela ou um
formulário rolando no terminal**, e receber de volta o que a pessoa decidiu.

```
o que vai bem no painel          o que fica melhor no terminal
─────────────────────────        ─────────────────────────────
a lista do dia                   uma frase
o funil, por etapa               uma pergunta de sim ou não
a ficha inteira de um imóvel     um aviso curto
o texto antes de sair            a confirmação do que já foi feito
a bifurcação com os custos
o fecho do que foi guardado
```

## O que ele NÃO é

**Ele não escreve na carteira.** Nem um byte. O painel devolve a INTENÇÃO —
“clicou em tal coisa, no item tal” — e quem grava é você, com as regras de
sempre: procedência, histórico, id com apelido, os tetos.

Isso não é detalhe de implementação: se o painel gravasse, a carteira teria
duas fontes de escrita e as regras do contrato valeriam só numa delas.

**Ele não decide nada.** Não escolhe modo, não aprova envio, não muda etapa.

**E ele não substitui a tela do envio.** A seção 7.1 continua valendo inteira:
o nome de quem recebe, o texto inteiro, as três saídas.

---

## As duas ferramentas

```
painel_mostrar    desenha e volta na hora. Devolve o endereço
painel_esperar    bloqueia até a pessoa agir, com teto em segundos
```

Elas andam em par: mostrar sem esperar deixa uma tela que ninguém lê, e
esperar sem mostrar trava por nada.

**Diga o endereço em voz alta**, uma vez, quando abrir: quem está lendo o
terminal não percebe que uma aba nasceu.

## As seis vistas

A vista é um campo de `painel_mostrar`, e o formato de `dados` muda com ela.

```
lista      { grupos: [{ rotulo, itens: [{ id, titulo, linha, marca, acoes }] }] }
           itens soltos: { itens: [...] }, sem grupo

ficha      { campos: [{ rotulo, valor, de, nota }],
             secoes: [{ titulo, linhas: [ "texto" | { texto, de } ] }] }
           `de` é a procedência, e ela aparece na tela
           valor `?` sai marcado, porque é o que a próxima tarefa ataca

texto      { markdown, editavel }
           o bloco que vai ser copiado ou corrigido

escolha    { pergunta, opcoes: [{ chave, rotulo, custo }] }
           de dois a quatro caminhos, cada um com o custo escrito (seção 8)

feedback   { guardei: [ "caminho" | { onde, oque } ],
             faltaSaber: [...], decidiSozinho: [{ oque, porque, desfazer }] }
           é o fecho da seção 10, desenhado

laudo      { errado: [...], duvida: [...], certo: [...] }
           cada item: "texto" ou { texto, onde, conserto }
```

E os botões do rodapé, que valem em qualquer vista:

```
acoes: [{ chave: "mandar", rotulo: "Mando agora", tom: "forte" }]
```

**O rótulo diz o que a PESSOA vai fazer**, nunca o nome interno da peça — a
seção 6 é literal nisso. `tom` aceita `normal`, `forte` e `recusa`.

## O que volta

```
{ acao: "mandar", item: "...", escolha: "...", texto: "..." }
```

`texto` vem quando a vista era `texto` — e vem **sempre**, corrigido ou não.
Use o que voltou, e não o que você mandou: a pessoa pode ter mexido.

E pode voltar isto, que não é falha:

```
{ expirou: true }
```

Ninguém mexeu dentro do tempo. **Siga em texto, no terminal, e diga em uma
linha que o painel não foi usado.** Não repita a chamada.

---

## Quando NÃO abrir o painel

- **Quando a resposta é uma frase.** Abrir uma aba para dizer uma linha custa
  mais atenção do que economiza.
- **Em modo automático.** Ali não há bifurcação para desenhar: o trabalho sai
  e a declaração vai para `## Decidi sozinho`. A exceção é o `feedback` no
  fim, que é leitura.
- **Duas vezes seguidas sem nada no meio.** Cada `painel_mostrar` apaga a
  tela anterior, e um clique que chegue depois da troca é recusado — a
  pessoa clicou numa pergunta que já não estava lá.
- **Quando o corretor pediu para não usar.** É a ferramenta dele.

## Quando falhar

| o que aparece | o que é | o que fazer |
|---|---|---|
| a ferramenta não existe na sessão | o plugin não está instalado, ou o programa não rodou o servidor | siga em texto e não insista. É o caminho normal na maior parte das ferramentas |
| `o painel não está aberto` | chamou `painel_esperar` sem ter mostrado nada | chame `painel_mostrar` antes |
| `vista desconhecida` | o nome da vista está errado | as que existem são as seis acima |
| `{ expirou: true }` | ninguém mexeu | siga em texto e diga isso em uma linha |
| a pessoa diz que abriu e está em branco | o endereço foi copiado sem o que vem depois do `#` | mande o endereço inteiro de novo — aquela parte é a chave |
| a pessoa diz que clicou e nada aconteceu | a tela mudou entre o clique e o envio | mostre de novo e peça para repetir |

**Falhou e você não sabe por quê?** Diga o que aconteceu, faça o trabalho no
terminal e siga. O painel é conveniência; o trabalho é o mesmo dos dois
jeitos, e nenhum passo do contrato depende dele.
