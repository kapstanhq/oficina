### 4.9 · `perfil.md`, que é a régua de todas as outras

Um arquivo, na raiz da busca. Teto: **80 linhas**. Escrito por
`/vagas:perfil-de-busca` e lido por **todas** as skills que decidem se uma vaga
entra, se ela vale e se uma candidatura sai.

```markdown
# Perfil — atualizado em 2026-09-14

## O que procuro, em ordem
1. técnica de enfermagem em UTI adulto · hospital de médio ou grande porte
2. técnica de enfermagem em clínica médica ou pronto-atendimento
3. técnica de enfermagem em sala de vacina ou home care — se a escala couber

## Termos de busca
"Técnico de Enfermagem", "Técnica de Enfermagem", "Técnico de Enfermagem UTI",
"Técnico de Enfermagem Plantonista", "Técnico de Enfermagem 12x36"

## Aceito
regime: presencial no Recife, em Olinda ou em Jaboatão dos Guararapes
contrato: CLT
empresa: hospital, clínica, laboratório, rede de farmácia com sala de vacina

## Descarto — e é o que a busca descarta sozinha
- presencial fora do Recife, de Olinda e de Jaboatão  ← candidato, 2026-09-14
- escala 6x1 ou plantão de 24 horas  ← candidato, 2026-09-14
- contrato autônomo, cooperado ou intermitente  ← candidato, 2026-09-14
- vaga de auxiliar de enfermagem  ← candidato, 2026-09-14

## Quanto
CLT: R$ 3.200
o que eu digo quando perguntam: “a partir de R$ 3.400, conforme o adicional noturno”

## Onde olhar
gupy: pelos termos de busca, em Recife, CLT
solides: pelos termos de busca, em "Recife - PE"
linkedin-vagas: pelos termos de busca, em Recife
apify: —
linkedin (logado): —
greenhouse: —
ashby: —
lever: —
à mão, toda semana: hospitalboavista.example/trabalhe-conosco — não tem fonte que eu alcance

## Por que
- 12x36 porque a folga de 36 horas é o que me deixa dividir o bebê com a minha mãe  ← candidato, 2026-09-14
- só CLT: carteira assinada, adicional noturno e licença garantida são o que preciso agora  ← candidato, 2026-09-14
- o piso é o que fecha a conta de casa; abaixo dele, voltar a trabalhar não se paga  ← candidato, 2026-09-14

## O que eu não sei ainda
- se aceito plantão noturno fixo — depende do adicional
```

**`## Descarto` é a única seção que age sozinha.** O que está nela
`/vagas:buscar-vagas` descarta sem perguntar — e **registra**, com o motivo, no
arquivo de `_bruto/` daquela busca: o que saiu continua conferível. Por isso
cada linha dali tem de ser um corte que se LÊ no anúncio. “Cultura ruim” não é
corte de busca: é o que `/vagas:triar-vagas` pesa, com você olhando.

**Há três caminhos até uma vaga do LinkedIn, e as três linhas dizem qual você
quer.** `linkedin-vagas` lê a listagem pública, de graça e sem conta. `apify`
lê a mesma listagem por um serviço pago — centavos por cem vagas —, com filtro
de verdade e o anúncio inteiro. `linkedin (logado)` entra na SUA conta pelo
navegador: é o único que vê as vagas recomendadas para você, e o único que
arrisca alguma coisa. Linha com `—` é caminho que você não quer, e nenhuma
skill o usa por conta própria.

**`## Onde olhar` é o que faz a busca ser sua, e não a de todo mundo.** Os
agregadores mostram o que todos veem; a página de carreira da empresa que você
quer é onde a vaga aparece primeiro. Cada linha é um conector e o que passar a
ele (seção 11) — e a empresa que nenhum conector alcança **fica na lista
mesmo assim**, como tarefa de olhar à mão, e sobe para o `hoje.md` no dia dela.

**`## Quanto` tem uma linha por contrato que você aceita**, com o piso daquele
vínculo — `CLT: R$ 3.200`; quem aceita dois escreve dois, `CLT: R$ 13 mil` e
`PJ: R$ 17 mil`. As palavras são as do `contrato:` da vaga (seção 4.4): `CLT`,
`PJ`, `temporário`, `estágio`, `aprendiz`, `autônomo`, `intermitente`,
`cooperado`, `concurso`. O piso de um vínculo não vale pelo outro — PJ sem
férias nem FGTS não se compara a CLT pelo mesmo número —, e por isso o
`contrato:` do `## Aceito` é lista aberta e cada palavra dele tem a sua linha
aqui. Contrato aceito sem linha é piso `?`: a faixa de uma vaga naquele
vínculo fica sem julgamento até você dizer o número. `o que eu digo quando
perguntam:` é uma linha só — a frase inteira, como você a diria.

**`## Quanto` não sai daqui sozinho.** Nenhuma skill escreve o piso numa
mensagem, e a frase de `o que eu digo quando perguntam:` só entra numa resposta
que você vai ler antes de mandar (seção 3.1).

**`## Por que` é o que faz este arquivo valer.** Critério sem razão não
sobrevive ao segundo mês sem entrevista: quando a fila secar, é a razão que
decide o que afrouxar. Todo critério leva procedência, como qualquer campo
(regra 2) — e a origem aqui é quase sempre `← candidato, <data>`, porque quem
sabe é ele.

**A vaga que não passa no perfil não é apagada** — a que você julgou entra no
`arquivo-morto/` com o motivo; a que a busca descartou sozinha fica na linha do
`_bruto/`. Perfil muda; vaga apagada não volta.
