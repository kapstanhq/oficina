# O LinkedIn logado — o roteiro do site

Isto é o caminho OPCIONAL de quem ligou o conector `navegador`. O padrão
continua sendo a listagem PÚBLICA (o conector `linkedin-vagas`), que responde
sem conta nenhuma e não arrisca nada — e quem nunca chegar até aqui não perde
nenhuma skill do pack.

**Só siga com o conector `navegador` ligado e provado** (`browser_snapshot`
responde). Sem ele, este arquivo não existe para a execução: não o mencione.

---

## O que NÃO foi provado, e é o que você precisa saber antes de confiar

Este roteiro foi escrito **sem uma sessão logada para testar**. O que está
abaixo divide-se em duas metades, e elas não valem o mesmo:

```
CONFERIDO em 2026-09-19, na parte pública do site
  a URL de busca abre sem login, e os filtros da barra são links com os
  parâmetros escritos neles — foi de lá que saiu `f_AL=true`
  o cartão de resultado, no snapshot: `listitem` > `link` com o título,
  `heading` nível 3 (cargo), `heading` nível 4 (empresa) e `time` ("Há 4 dias")
  o link da vaga é `…/jobs/view/<apelido>-<id>?position=…&refId=…` e ABRE
  sem nenhum dos parâmetros depois do `?` — tirá-los é seguro
  `start=25` na URL pública é REESCRITO para `start=0`: ali não pagina
  a página de uma vaga traz o anúncio inteiro e um botão "Candidatar-se"

NÃO CONFERIDO — escrito de memória do produto, e a primeira execução real
manda mais do que este arquivo
  os nomes dos botões DENTRO do modal de candidatura simplificada
  a ordem e a quantidade dos passos do modal
  a paginação por `start=` na busca logada
  as vagas recomendadas (`/jobs/collections/recommended/`), que só existem
  logado
```

**Achou divergência?** Diga qual, siga pelo que a tela mostra — o snapshot é a
fonte, não este texto —, e escreva a linha em `## Falta saber`. Buraco
declarado é barato; certeza inventada custa a conta do candidato.

---

## O que o candidato tem de ouvir antes, uma vez

Não é letra miúda: é o que faz ele decidir com o que tem, em vez de descobrir
depois e culpar a ferramenta. São quatro frases, ditas **uma vez**, no ato de
usar a conta dele pela primeira vez.

```
1  isto age DENTRO da sua conta do LinkedIn. O que for clicado ali,
   clicou você — e é a sua conta que responde por isso

2  os termos do LinkedIn proíbem automação em conta logada. O risco é a
   conta ser restringida, e para quem procura emprego a conta É o ativo.
   Com ritmo de gente e uma coisa por vez o risco é BAIXO; não é zero

3  a listagem pública faz a busca sem entrar na sua conta de lugar nenhum,
   e é o caminho sem risco. O que se ganha aqui é o que só existe logado:
   as vagas recomendadas e a candidatura simplificada

4  quem decide é você. Dá para usar isto só para candidatar, só para
   buscar, ou para nada — e nada continua funcionando
```

Ele hesitou: **pare e não insista.** A listagem pública é o padrão, e o
trabalho sai igual.

---

## Degrau 0 · Conferir que ele está logado, antes de tudo

Não há roteiro nenhum numa janela deslogada: o site devolve a parede de
cadastro, e ler a parede como resultado é o defeito mais caro daqui.

```
verificar   browser_navigate para https://www.linkedin.com/feed/, e
            browser_snapshot
agir        caiu em login, "Entrar", "Cadastre-se agora", ou numa
            verificação: PARE e peça que ELE entre — dizendo QUAL janela
confirmar   o snapshot traz o feed: a barra com "Início", "Minha rede",
            "Vagas", e o nome dele
```

**Diga qual janela, com todas as letras.** São dois jeitos de o navegador estar
logado, e a janela é outra em cada um:

```
perfil persistente    a janela que o próprio servidor do navegador abriu.
                      Ela nasce vazia, ele entra UMA vez ali, e a sessão
                      fica guardada naquele perfil. É o de menor atrito
extensão              é o Chrome DELE, com as abas dele. Se não está logado
                      aqui, ele não está logado no LinkedIn, ponto
```

**A skill não digita senha, não lê senha, não guarda senha, não resolve
captcha e não faz verificação em duas etapas.** Isso é dele, na hora, e é a
mesma regra do dado sensível do contrato §3.1.

---

## O ritmo, que é regra e não gosto

O que separa "indistinguível de gente usando o site" de "programa" não é a
intenção: é a cadência. Estes números não são sugestão — são o teto da
execução, e passar deles é o que faz uma conta ser olhada.

```
uma ação por vez         nunca duas abas agindo ao mesmo tempo, nunca uma
                         ação disparada enquanto a anterior não voltou
espere entre navegações  browser_wait_for, alguns segundos, a cada troca de
                         página. Ler três páginas em três segundos é a
                         assinatura de um programa
3 páginas de resultado   por busca, no máximo — e ~40 cartões lidos. O que
                         não coube fica para a próxima execução
o teto de candidaturas   o do `INDICE.md`, `quantas candidaturas por dia:`.
por dia                  Ele vale aqui inteiro, e nada o ultrapassa
nada de rolar em laço    a página carrega mais ao rolar; rolar até o fim é
                         raspagem, e é exatamente o que os termos nomeiam
uma vaga por vez         o detalhe de UMA vaga aberto de cada vez, lido, e
                         só então a seguinte
```

**Apareceu aviso de atividade incomum, captcha, ou pedido de verificação:
PARE tudo.** Diga o que viu, com a frase que estava na tela, e **não tente de
novo naquela execução** — nem em outra aba, nem "só mais uma". Repetir depois
do aviso é o que transforma um alerta em restrição. Vira linha em
`## Falta saber`.

---

## Buscar

### A URL, com os parâmetros

```
https://www.linkedin.com/jobs/search?keywords=<termo>&location=<local>
```

E os filtros, que são os mesmos da barra do site:

```
f_WT=2              remoto
f_AL=true           candidatura simplificada (só ela abre o modal)
f_TPR=r604800       publicadas na última semana (é 7 × 24 × 3600 segundos;
                    r86400 é o último dia)
f_EA=true           menos de 10 candidaturas — não é pedido, mas é barato
start=25            a página seguinte, de 25 em 25, na busca LOGADA
```

`location` vai como o site entende, em geral em inglês (`Brazil`,
`Florianópolis, Santa Catarina, Brazil`). Um termo de `## Termos de busca` por
URL: juntar dois termos numa busca só devolve a interseção, não a soma.

**`start=` não vale na página pública** — ela reescreve para `start=0`
(medido em 19/09). Ali a paginação é por rolagem, e rolar é o que este roteiro
proíbe: quem pagina é a busca logada, e quem não estiver logado usa o conector
`linkedin-vagas`.

### Ler os cartões pelo SNAPSHOT, nunca por CSS

`browser_snapshot` devolve a árvore de acessibilidade, com PAPEL e NOME. É por
ela que se lê, e a razão é de manutenção: **as classes do LinkedIn mudam toda
semana**, e um seletor de classe quebra em silêncio — a busca volta vazia e
nada no terminal diz por quê. Papel e nome mudam quando o site muda de
desenho, o que é raro e barulhento.

O que cada cartão dá, na forma conferida em 19/09:

```
listitem            o cartão
  link "<título>"   o título, e o `/url` é o link da vaga
  heading nível 3   o cargo
  heading nível 4   a empresa, com link para /company/<apelido>
  generic           a cidade
  time              "Há 4 dias" — data relativa; converta com a data de hoje
                    e escreva a procedência com a data ABSOLUTA
```

**O id da vaga é o número no fim do caminho** de `/jobs/view/`:
`…/jobs/view/tecnico-de-enfermagem-uti-at-vertice-saude-4000000001` →
`4000000001`. É ele que identifica a vaga entre execuções, e é por ele que se
confere repetição — o apelido do caminho muda com o título.

**Tire tudo o que vem depois do `?`.** `position`, `pageNum`, `refId` e
`trackingId` são rastreio daquela sessão, e o link sem eles abre igual
(conferido). O que vai para o campo `link:` do arquivo da vaga é a forma
limpa.

### O detalhe, uma vaga por vez

O cartão traz título, empresa, cidade e data — e **não traz os requisitos**,
que é o que a triagem lê. Abra o link da vaga, espere, e leia o anúncio
inteiro no snapshot. A página pública já traz o texto completo; logado, traz
também "Há 4 dias · 119 candidaturas", que é sinal útil e entra como campo com
procedência.

Uma por vez, com espera entre elas. Quarenta cartões lidos não são quarenta
detalhes abertos: abra o detalhe das que sobrevivem ao `## Descarto`.

**Conferido logado em 2026-09-23**, em 105 cartões e 40 vagas relidas:

```
a lista só pinta o que      dos 25 cartões de uma página, os que estão fora da
está à vista                tela vêm só com o id, sem título nem empresa. Não
                            é vaga vazia: abra o detalhe pelo id
o regime tem linha própria  logo abaixo de "Há N dias · N candidaturas" vem
                            "Remoto", "Híbrido" ou "Presencial". É ISTO que o
                            cartão público não mostra, e é daqui que sai
                            `regime:` — com a cidade do cabeçalho ao lado
dois avisos diferentes      "Não aceita mais candidaturas" é `estado: fechou`;
                            "Não aceita candidaturas agora" é pausa — a vaga
                            continua aberta, e o arquivo diz isso
o anúncio vem cortado       o botão "… mais" abre o resto; sem ele, o inglês e
                            o processo, que moram no fim, não são lidos
```

### As vagas recomendadas — o que só existe logado

```
https://www.linkedin.com/jobs/collections/recommended/
```

É o ganho real sobre a listagem pública: o LinkedIn cruza o perfil dele com o
que está aberto, e devolve o que nenhum termo de busca alcança. Leia como
qualquer lista de cartões, com o mesmo teto e o mesmo ritmo — e escreva a
procedência como `← linkedin, AAAA-MM-DD`, igual.

**Não confunda com o alerta de vaga.** Criar alerta é gravar coisa na conta
dele; não é deste roteiro, e não se faz sem ele pedir.

---

## A candidatura simplificada, passo a passo

"Candidatura simplificada" (em inglês "Easy Apply") é o único caminho que se
completa dentro do LinkedIn. Ela abre um **modal de vários passos** sobre a
página da vaga. Os nomes abaixo são os que o produto usa — e são a metade NÃO
conferida deste arquivo: leia o que o snapshot traz, e siga por ele.

### O que faz o quê

```
"Candidatar-se" sem mais nada     leva ao SITE DA EMPRESA, fora do LinkedIn.
                                  Não é este roteiro: é o formulário genérico
                                  da skill, no site de lá
"Candidatura simplificada"        abre o MODAL. É o que este roteiro cobre
"Avançar" · "Próximo" · "Revisar" andam entre os passos do modal, e são
                                  SEGUROS: nenhum envia
"Enviar candidatura"              o botão do passo final. É ESTE o botão da
                                  seção 12.1 do contrato — e quem o aperta
                                  depende da linha `envio de candidatura:`
```

Botão cujo nome você não reconhece **não é seguro por parecer seguro**. Leia o
passo inteiro antes de tocar em qualquer coisa.

### Em cada passo, LER antes de andar

```
1  browser_snapshot, e leia TODOS os campos do passo: o rótulo como está na
   tela, o tipo, se é obrigatório, as opções da lista, e o VALOR QUE JÁ VEIO
   PREENCHIDO pelo LinkedIn a partir do perfil dele
2  guarde o que leu, com o número do passo
3  só então "Avançar", e espere a próxima tela pintar
```

**Não avance sem ter lido.** O modal não deixa voltar de graça em todo passo, e
um campo que passou sem leitura é um campo que ele vai descobrir depois de
enviado.

**O valor que já veio preenchido conta como resposta.** Telefone, cidade,
currículo do perfil: o LinkedIn os traz sozinho, e eles saem na candidatura
como se fossem dele — porque são. Eles entram na tela do passo 5 da skill, com
a procedência `← já preenchido pelo LinkedIn`, e não somem só por você não ter
escrito nada.

### As caixas que vêm MARCADAS

Há caixas ligadas por padrão — "seguir a empresa" é a mais comum. **Mostre
cada uma ao candidato, e não decida por ele**: desmarcar é uma escolha dele
tanto quanto marcar. A caixa aparece na tela do passo 5 como campo `sim-nao`,
com `valor` no que o LinkedIn deixou e a `nota` dizendo que veio marcada.

### O currículo

O LinkedIn oferece o último currículo enviado, ou um envio novo. E a busca
guarda currículo em markdown, enquanto o portal quer PDF ou DOCX:

```
existe o PDF no disco        browser_file_upload com o caminho dele
só existe o markdown         DIGA qual arquivo é — curriculos/V-012-cv.md —
                             e que o anexo é dele, na hora. Não converta,
                             não cole o markdown num campo de texto
o do perfil serve            é escolha dele, e a tela do passo 5 mostra qual
                             está selecionado
```

### Fechar o modal no meio

O LinkedIn pergunta **"descartar" ou "salvar"**. A resposta é **salvar**:
descartar joga fora o passo a passo inteiro, e a retomada recomeça do zero.
Salvou, a candidatura reaparece como rascunho na vaga.

### O que não é candidatura simplificada

Vaga que leva ao site da empresa sai deste roteiro na hora: o formulário é o
de lá, e quem o percorre é o passo 3 da `candidatar`, com as regras de
formulário genérico. Diga ao candidato para onde a vaga levou — é informação
que muda o tempo que aquela candidatura custa.

---

## Mensagem a recrutador pelo LinkedIn

**Fora deste roteiro.** Mandar InMail ou mensagem pela caixa dele é falar em
nome dele num canal que não tem tela de envio, e é o que a
`/vagas:escrever-ao-contato` já resolve: ela entrega o bloco pronto para
copiar, e quem manda é ele.

Convite de conexão com nota é a mesma coisa, pela mesma razão.

---

## Quando falhar

| o que aparece | o que é | o que fazer |
|---|---|---|
| a tela de login, ou "Cadastre-se agora" | a janela não está logada | pare, diga QUAL janela, e peça que ele entre. Não tente contornar |
| um checkpoint, ou pedido de código por e-mail ou SMS | verificação em duas etapas | é dele, na hora. A skill não lê código de lugar nenhum |
| "atividade incomum", captcha, quebra-cabeça | o ritmo foi lido como automação | PARE tudo naquela execução. Diga o que viu, com a frase da tela, e não repita |
| a busca volta sem cartão nenhum e a página parece cheia | você leu por classe CSS, ou o snapshot veio antes de a lista pintar | leia por papel e nome, e `browser_wait_for` antes do snapshot |
| o link da vaga abre uma página de erro | o link foi copiado com o `?` e o rastreio de outra sessão | tire tudo depois do `?` e abra de novo |
| `start=25` devolve os mesmos resultados de `start=0` | a janela não está logada — a página pública reescreve para 0 | é a listagem pública: use o conector `linkedin-vagas`, que pagina sozinho |
| "Candidatar-se" abre uma aba nova em outro site | a vaga não é simplificada | é o formulário do site da empresa, e ele tem outro roteiro |
| o modal fecha sozinho, ou volta ao passo 1 | a sessão expirou no meio | não recomece sozinho. Diga em que passo parou e o que já tinha lido |
| o botão final não existe no último passo | há um passo que você não viu, ou um campo obrigatório vazio | leia o passo inteiro de novo: o portal costuma segurar o botão pelo campo, e o campo está marcado na tela |
| o modal pede um teste, uma avaliação ou um questionário longo | não é candidatura simplificada de verdade | pare e mostre a ele: isso custa tempo dele, e a decisão de seguir é dele |
| a página carrega e o snapshot vem enorme | é a página inteira, com menu e rodapé | leia a região do anúncio e a do modal, e não o documento todo |

**Falhou e você não sabe por quê?** Diga o que aconteceu, em que passo, e o
que estava na tela. Não adivinhe, e não tente outro caminho na mesma execução:
dentro da conta dele, tentativa é o que se conta contra ele.
