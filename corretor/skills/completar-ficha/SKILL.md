---
name: completar-ficha
description: >-
  Procura o que falta em um imóvel da carteira — os campos do cabeçalho que estão
  em `?` — nas fontes que a carteira alcança: a origem guardada em `_bruto/`, o
  link de origem pelo conector ou pela web, o mesmo registro publicado em
  outro lugar, o navegador ligado e a página da própria organização. Grava o que achar com a procedência, guarda em `_bruto/`
  a página que leu, e deixa em `?`, com onde procurou, o que nenhuma fonte diz.
  Não julga, não estima, não muda etapa e não escreve a ninguém. Use quando o
  corretor disser — completa essa ficha · procura o que falta · o que ela
  não diz, vê se acha · preenche os campos em branco · busca mais informação
  sobre isso — com o id, ou quando o botão "Completar informações" do painel a
  chamar. Não é para julgar se serve, que é da skill de triagem do pack, nem
  para cobrar alguém, que é /corretor:cobrar-o-que-falta.
license: MIT
compatibility: >-
  Precisa da carteira e do id de um registro dela. O que ela alcança depende do
  que está ligado: conector com a operação `detalhe`, navegador, ferramentas de
  web e de busca. Sem nenhum deles, relê o `_bruto/` e diz em uma linha que
  não tinha como procurar fora. Chamada paga só com teto escrito e orçamento antes.
allowed-tools: Read Glob Grep Write Edit WebFetch WebSearch
---
<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/skills/completar-ficha/SKILL.md, e ela vale para
     QUALQUER profissão: o que muda de ofício está escrito em marcas — {item},
     {pessoa}, /{plugin}: — resolvidas na geração pelo vocabulario.json do
     pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`; a correção certa é na fonte, e ela
     chega a todos os packs de uma vez. -->


# Completar o que falta

## 1 · O que ela faz, e o que ela não faz

O cabeçalho de um registro tem campos em `?`: o que a fonte não disse quando
ele entrou. Alguns decidem se ele serve ao corretor, e ele abre a ficha,
vê "não diz" e não tem o que fazer. **Esta skill vai atrás de cada `?`**, fonte
por fonte, e volta com o fato e de onde ele veio — ou com o `?` e onde ela
procurou.

**Ela não inventa e não estima.** "Deve ser", "pelo porte", "a média do mercado
é" não existem aqui (Regra 2). Um número que só uma estimativa dá continua `?`;
a estimativa pode ir numa nota ao lado, dita como estimativa e com a fonte.

**Ela não julga.** Campo de julgamento — a proposta que o contrato manda o
corretor confirmar — não é fato, e não se completa aqui. Se ele e as
seções de análise estão vazios, o fecho diz que o próximo passo é a skill de
triagem do pack.

**Ela não mexe na etapa**, não aposenta e não escreve a ninguém.

## 2 · Antes de tudo

Leia no contrato, em `references/contrato/`, só o que ela usa:

```
2    id e apelido — o que é o mesmo registro em dois lugares
3    as três regras — a 2 (procedência) é o trabalho inteiro dela
4.4  o arquivo do imóvel             4.7  o bruto
4.6  os dois índices                 10   como uma skill começa e termina
```

Os arquivos: `02-0-id-e-apelido.md`, `03-0-as-tres-regras.md`,
`04-4-arquivo-de-imovel.md`, `04-6-os-dois-indices.md`, `04-7-o-bruto.md` e `10-0-comeca-e-termina.md`. E
`references/conectores.md`, se as ferramentas `conectores_*` estiverem aqui.

Depois, o `INDICE.md` da carteira, pela linha `carteira:`. Sem carteira: uma
linha dizendo isso, `/corretor:comecar`, e nada gravado.

**O id.** Chegou com o pedido (é o que o botão do painel manda)? Ache o arquivo
dono dele. Não chegou: pergunte qual, em uma linha. Não percorra a carteira
inteira — trinta registros completados de uma vez são trinta leituras que
ninguém confere.

## 3 · O modo

Fato com fonte se grava nos dois modos: completar não é decidir. O que muda é a
**divergência** — duas fontes dizendo coisas diferentes do mesmo campo.

`copiloto` — mostra as duas, com a fonte de cada uma, e pergunta qual vale.
`automatico` — fica com a da fonte mais próxima do registro (a origem dele
antes de uma página de terceiro), guarda a outra no `## Histórico`, e declara
em `## Decidi sozinho`, com como desfazer.

## 4 · O passo a passo

### Passo 1 · O que falta

Liste os campos do cabeçalho com `?`. A seta ao lado de um `?` às vezes já diz
o que resolve ("← a fonte não publica", "← descrição cortada"): leia antes de
procurar — "não publica" não se resolve relendo a mesma página. Comece pelos
que decidem se o registro serve; os de data e contato vêm depois.

Conta também o campo que o `04-4-arquivo-de-imovel.md` tem e o arquivo não: registro
gravado antes de o campo existir não tem a linha, e ela entra agora, no lugar
em que o contrato a mostra.

### Passo 2 · As fontes, da mais barata para a mais cara

```
1  o _bruto/            a origem que já está guardada: procure pelo id e pelo
                        apelido. Custa nada, e às vezes o texto inteiro já
                        estava lá
2  o link, por conector  `conectores_estado`; o conector cuja base casa com o
                        link e tem `detalhe` lê a página inteira. Gratuito vai
                        direto; pago, orçamento antes (references/conectores.md)
3  a web                o link, pela ferramenta de web, quando nenhum conector
                        serve. E o MESMO registro publicado em outro lugar:
                        busque pelo nome e pela organização — o site dela,
                        outro portal, outro agregador — e aceite só o que a
                        seção 2 chama de o mesmo registro.
                        O endereço vai para onde a seção 2 manda guardar o
                        segundo link, e a página dele é lida como origem. Na
                        dúvida, não junta: vira `## Falta saber`
4  o navegador ligado   para a página que só abre com sessão. Ele não digita
                        senha, não resolve captcha, não passa por verificação
                        em dois passos: parou numa dessas, é `## Falta saber`
5  a própria organização a página dela (carreiras, contato, sobre) pode dizer
                        o que a origem calou. É fonte de terceiro: vale, com a
                        procedência dela
```

Pare de procurar um campo quando ele for achado. Pare a skill quando as cinco
fontes forem tentadas — não há sexta. **A exceção é o campo para o qual o
`04-4-arquivo-de-imovel.md` escreve um caminho próprio**: esse segue o caminho de
lá, e não esta ordem — é o contrato do ofício que sabe onde aquele dado mora.

### Passo 3 · A página lida vai para `_bruto/` antes de virar campo

`AAAA-MM-DD-<o que é>-<id>.md`, com o cabeçalho de três linhas do bruto (4.7) e
o texto como veio. Página sai do ar, e a procedência tem de continuar
apontando para alguma coisa.

### Passo 4 · Gravar

- o campo achado: `<valor>  ← _bruto/<arquivo>` — o valor antigo `?` não se
  apaga: vai para o `## Histórico` numa linha
- o campo que ficou: `?  ← procurado em <fontes>, AAAA-MM-DD: não diz`. É o que
  impede a próxima pessoa (ou a próxima execução) de procurar de novo onde já
  se procurou
- a divergência: pelo modo (seção 3)
- se a fonte diz que o registro **saiu do ar** ou fechou, isso é fato: o campo
  de estado muda, com a procedência, e o fecho diz que a arrumação é de
  `/corretor:organizar-carteira` — ela não aposenta
- o `## Histórico` ganha uma linha: `- AAAA-MM-DD completado: <campos> ← <fontes>`
- a linha do `funil.md` e o `_indice.md` que repetem um campo que mudou mudam
  juntos (Regra 1: o arquivo do imóvel é o dono, as vistas acompanham)

## 5 · O formato da saída

Uma linha com a conta, uma linha por campo, e o fecho:

````markdown
Completei 3 dos 5 campos em branco de <id> (<apelido>).

- <campo>: <valor> ← <fonte>
- <campo>: continua sem resposta — procurei em <fontes>

## Guardei
- ~/carteira/<arquivo do imóvel> — os campos e o histórico
- ~/carteira/_bruto/<arquivo> — a página que li

## Falta saber
- <o campo que só o corretor ou a organização respondem, e a quem perguntar>
````

Se o painel está aberto, a página se atualiza sozinha: não diga o endereço.

## 6 · Onde ela para

**Ela não julga.** Campo de julgamento e seções de análise vazios viram uma
linha no fecho, apontando a skill de triagem do pack.

**Ela não pergunta à organização.** Escrever para alguém perguntando o que
falta é mensagem, e mensagem tem skill própria no pack.

**Ela não completa em lote.** Um registro por vez: é o que deixa o
corretor conferir cada fonte antes de o campo virar verdade na carteira.
