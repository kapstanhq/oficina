<!-- CÓPIA GERADA · não edite este arquivo.

     A fonte é oficina/_motor/referencias/conectores.md, e ela vale para qualquer
     profissão: as marcas do ofício são resolvidas na geração, pelo
     vocabulario.json do pack. Correção feita aqui é perdida no próximo
     `npm run oficina -- --escrever`. -->

# Os conectores — o que existe para ligar, e o que cada um custa

Isto é OPCIONAL. Sem conector nenhum, tudo funciona com o que o prospector cola —
é o caminho de sempre, e é o único nos chats da web.

**Só existe se o plugin estiver instalado e houver `node` na máquina.** Onde as
ferramentas `conectores_*` não aparecem, não mencione este arquivo.

---

## O que ele é

Uma lista do que PODE ser ligado — ler e mandar mensagem, e-mail, navegador,
fontes públicas, serviços pagos —, com o estado de cada coisa, e um programa
que faz as chamadas de rede no seu lugar. Ele existe por duas razões:

```
saber        você não adivinha o que a máquina tem. Pergunta, e ele responde
gastar       chamada paga passa por ele, que mede o custo de verdade e
             RECUSA acima do teto que o prospector escreveu
```

O teto mora no programa, e não nesta página, de propósito: regra de gasto
escrita em prosa é regra que se esquece na décima chamada.

## As quatro ferramentas

```
conectores_estado    o que existe, o que está ligado, quanto já gastou
conectores_orcar     quanto UMA chamada paga deve custar, e quanto sobra
conectores_chamar    faz a chamada. Se é paga, exige o orçamento de antes
conectores_extrato   o que foi gasto, chamada a chamada
```

**Comece por `conectores_estado`**, uma vez por execução, antes de prometer
qualquer coisa que dependa de conector. Ele devolve, por conector:

```
{ nome, tipo, oque, estado, custo, gasto_no_mes, teto_do_mes, resta,
  operacoes: [...], como_ligar }
```

## Os dois tipos

```
http    quem chama é o programa: `conectores_chamar`. Fonte pública ou
        serviço pago. O que volta já vem enxuto — só os campos que importam
mcp     quem chama é VOCÊ, com as ferramentas do próprio conector (as do
        WhatsApp, as do e-mail, as do navegador). Aqui o estado diz como
        ligar e com que ferramenta se PROVA que ligou
```

Para o tipo `mcp`, o programa não enxerga as suas ferramentas: `estado` vem
como `prove`, com o nome da ferramenta a chamar. Se ela não existe na sessão,
o conector está desligado — e o `como_ligar` diz o que fazer.

**O navegador pode trazer `sessoes`**: os sites em que o prospector já
entrou pelo painel, com `estado` (`logada`, `vencida`, `sem-sessao`) e a
validade. `logada`: o navegador que você abrir já entra com a conta — não
peça login. `sem-sessao` ou `vencida`: o site abre sem a conta; diga UMA
vez que ele entra pela tela Integrações, em "Onde o assistente entra com a sua
conta", e siga com o que se vê sem ela. Se o navegador abre sem login com a
sessão `logada`, ele não está ligado ao arquivo: o `guia` do navegador diz
como, com o caminho de `arquivo_das_sessoes`. Esse arquivo você nunca lê — é
a senha dele.

## Os três estados

```
ligado       pode usar
desligado    existe, e o prospector ainda não ligou. Diga que existe, o que faria
             com ele, e o comando de `como_ligar` — UMA vez, e siga sem ele
sem-chave    ligado, mas falta a chave do serviço. Idem
```

**Quem liga é o prospector, nunca você.** Ligar, guardar chave e escrever teto são
gestos DELE — e o lugar deles é a tela **Conectores** do painel, que é feita
para quem nunca abriu um terminal: o aviso aparece, ele confirma, cola a chave
num campo, escreve o teto, e aperta Testar. Se `painel_inicio` existe nesta
sessão, é para lá que você manda: “abra o painel e, no menu, vá em Configurações › Integrações” — e diga o
endereço, se ainda não disse hoje. Sem painel, o `como_ligar` traz a linha de
comando pronta, e ela é o caminho de quem é técnico. Não existe ferramenta para isso, e a razão é a mesma do teto: o
agente que pudesse subir o próprio teto não teria teto. A chave do serviço
nunca passa pela conversa.

Conector que tem um aviso — risco de conta, termos do serviço, custo — mostra
o aviso **no ato de ligar**, uma vez. Não o repita a cada uso: a decisão foi
tomada por quem podia tomá-la.

## Chamada paga: o orçamento vem antes

```
1  conectores_orcar   { conector, operacao, parametros }
                      → { orcamento, estimativa, moeda, resta, teto_do_mes }
2  mostre ao prospector — em copiloto, SEMPRE: o que vai buscar, quanto deve
   custar, quanto sobra do teto. Em automático, só se ele autorizou gasto
   nesta execução; senão a chamada vira linha em `## Falta saber`
3  conectores_chamar  { conector, operacao, parametros, orcamento }
                      → { itens, custo, medido, resta }
```

`orcamento` vale para UMA chamada com os MESMOS parâmetros, por dez minutos.
`medido: true` diz que o custo veio do serviço; `false`, que é a estimativa —
e aí o extrato marca a linha, e o número não se repete como fato.

Chamada gratuita não precisa de orçamento: vai direto no `conectores_chamar`.

## O que volta, e o que NÃO é fato

O que um conector devolve é **origem**, não é campo apurado. Entra na carteira
pela regra de sempre — procedência com o nome do conector e a data:

```
campo: valor  ← <conector>, AAAA-MM-DD
```

E o que veio truncado (`cortado: true` no item) não se completa de cabeça:
peça o detalhe, se o conector tiver a operação, ou deixe `?`.

## Quando falhar

| o que aparece | o que é | o que fazer |
|---|---|---|
| as ferramentas não existem na sessão | o plugin não está instalado, ou não há `node` | siga com o que o prospector cola. É o caminho normal |
| `conector desconhecido` | o nome está errado | os que existem são os do `conectores_estado` |
| `desligado` · `sem-chave` | ninguém ligou | diga o `como_ligar` uma vez e siga sem ele |
| `acima do teto` | a chamada passaria do que o prospector autorizou no mês | NÃO tente outra operação para contornar. Diga quanto falta e como ele muda o teto |
| `sem teto` | conector pago sem teto escrito | é recusa por desenho: sem teto, não gasta. O `como_ligar` traz o comando |
| `orçamento vencido` · `orçamento de outra chamada` | passou de dez minutos, ou os parâmetros mudaram | orce de novo |
| `devagar` | o ritmo do conector estourou | espere os segundos que ele disser. Não é erro |
| `o serviço respondeu 4xx/5xx` | a fonte recusou ou caiu | diga, e siga com as outras fontes. Não repita em laço |

**Falhou e você não sabe por quê?** Diga o que aconteceu e siga com o que
tem. Conector é alcance; o trabalho é o mesmo sem ele, só que menor.
