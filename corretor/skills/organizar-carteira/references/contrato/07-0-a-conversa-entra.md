<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 7 · Como a conversa entra

Há dois caminhos, e quem diz qual é a linha `WhatsApp:` do `INDICE.md`
(seção 4.1). **O padrão é colado**, e é o único que funciona em toda
ferramenta: o corretor exporta ou cola, e a skill lê os dois formatos que
chegam. O conector é opcional, não existe em metade dos lugares onde o pack
roda, e **nenhuma skill o exige** — skill que só funciona com ele quebrou o
contrato.

O caminho muda; o formato não. Conversa que entrou pelo conector e conversa
que entrou colada produzem o **mesmo** arquivo em `_bruto/`, com a mesma
procedência (seção 3). Nenhuma das outras precisa saber por onde ela veio,
e é isso que impede o conector de virar um segundo pack.

| a operação | colado | pelo conector |
|---|---|---|
| trazer a conversa de um cliente | o corretor exporta ou cola | achar a conversa pelo telefone do arquivo do cliente e ler o período que interessa |
| saber quando foi a última mensagem | está no que ele colou | pergunta-se à conversa |
| guardar em `_bruto/` | igual nos dois | igual nos dois |

**O conector lê sempre, e manda uma por vez** — nunca em lote, e nunca sem o
corretor ter visto o texto e o nome de quem recebe. Como isso funciona está em
7.1. O bloco para copiar **continua sendo o padrão**: é o que funciona em toda
ferramenta, e onde não há conector ele é a única saída.

### O pré-voo, e ele é obrigatório

**A primeira chamada ao conector, em qualquer skill, é `estado_da_ponte`.** Não
é zelo: a ponte é um programa que fica de pé numa janela, e janela fechada
congela o histórico no minuto em que ela fechou. Nada avisa. O que se lê depois
disso é um retrato do passado com cara de presente — e uma skill que ordena o
dia sobre ele entrega uma lista confiante e errada.

Ela responde em uma linha o que importa, e a ação sai daí:

```
de pé e conectada          trabalhe, e não diga nada ao corretor
de pé e desconectada       diga o que ela reporta, em uma linha, e siga com o
                           que já está guardado — dizendo que é isso que é
fora do ar, ou parada há   PARE de tratar o conector como fonte. Diga há quanto
mais de um dia             tempo, que o que passou não volta, e que a janela do
                           `serve` precisa ser reaberta. Depois ofereça o
                           caminho colado, que funciona igual
```

**Silêncio só se justifica quando está tudo certo.** Ponte velha e trabalho
normal é o único par que o corretor não pode ver, porque é o único em que
ele acharia que a carteira está em dia.

### Exportado do aplicativo

```
[12/08/2026 14:32] Joana Ribeiro: oi, vi a casa da Azenha no Zap, ainda tem?
[12/08/2026 14:40] Marcelo Fontes: tem sim! quer ver no sábado?
[12/08/2026 14:41] Joana Ribeiro: ‎<Mídia oculta>
[12/08/2026 14:55] Joana Ribeiro: sábado de manhã dá, mas tem que ser cedo
```

Aparece também sem colchetes, que é o formato antigo, e vale o mesmo:

```
12/08/2026 14:32 - Joana Ribeiro: oi, vi a casa da Azenha no Zap
```

A data é **dd/mm/aaaa** e a hora é de 24 horas — é o padrão brasileiro, e
`03/08` é 3 de agosto. Ano de dois dígitos (`12/08/26`) é 2026. Ao gravar,
converta para `2026-08-12`.

**Quem é o corretor na conversa:** é o remetente cujo nome bate com `nome:` do
`INDICE.md`. Não bateu de jeito nenhum? Uma pergunta, uma vez: “Nessa conversa,
qual dos dois é você?”. Nunca deduza pelo tom — o risco é gravar a fala do
cliente como promessa do corretor.

**O que não se lê, não se inventa:** `<Mídia oculta>`, `Esta mensagem foi
apagada`, áudio e figurinha viram um buraco declarado, não um palpite. Se o
buraco está no meio do que importa, ele vira uma linha em `## Combinado` ou uma
pergunta: “Tem um áudio de 12 de agosto no meio da conversa. O que ela disse
ali?”

### Texto solto

Colagem sem carimbo de data e sem nome — um pedaço de conversa, um anúncio, uma
ficha, um e-mail encaminhado. Trate assim: o conteúdo é fato do que está
escrito, a data é a que o corretor disser (ou a de hoje, e a procedência diz
`← corretor, <hoje>`), e o autor não se adivinha.

### O que fazer com ela depois, sempre nesta ordem

1. **Grava o bruto primeiro**, em `_bruto/AAAA-MM-DD-<canal>-<apelido-curto>.md`, com
   o cabeçalho de três linhas da seção 4.7 e o texto colado sem tocar. Primeiro
   porque, se algo der errado no meio, o material do corretor já está salvo.
2. **Extrai os fatos** para os arquivos donos — cliente e imóvel —, cada campo
   com `← _bruto/<aquele arquivo>`. Fato é o que está escrito: “dá sábado, mas
   cedo” é `## Combinado`, não “visita marcada às 9h”.
3. **Atualiza as vistas** que mudaram: `funil.md` se a etapa mudou,
   `_indice.md` se entrou item ou mudou o último contato.
4. **Diz onde guardou**, no bloco `## Guardei` da seção 10.

Conversa que menciona imóvel que não está na carteira: não crie o imóvel com o
que a conversa diz. Pergunte o link, uma vez. Sem link nem ficha, o imóvel não
entra — dado que se adivinhou vira preço errado na mensagem para o cliente.

---