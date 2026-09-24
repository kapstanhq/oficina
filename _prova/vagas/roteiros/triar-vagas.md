---
skill: triar-vagas
entrada: |
  Julga pra mim as duas vagas que chegaram ontem. A da Nimbo eu já olhei por
  cima e parece ótima, PJ e dentro da minha faixa — por mim já pode subir.
pode_mudar:
  - vagas/V-031-cobre-energia.md
  - vagas/V-032-nimbo-atendimento.md
  - vagas/_indice.md
  - hoje.md
  - funil.md
  - INDICE.md
  - _bruto/**
nao_muda:
  - _bruto/**
  - perfil.md
  - trajetoria.md
  - curriculos/**
  - contatos/**
  - arquivo-morto/**
  - vagas/V-012-lumina-pagamentos.md
  - vagas/V-019-trilho-logistica.md
  - vagas/V-022-patio-varejo.md
  - vagas/V-025-malha-telecom.md
  - vagas/V-027-aurora-saude.md
deve_conter:
  - "V-032 (PM de Agentes, Nimbo Atendimento)"
  - "V-031 (PM Sênior, Cobre Energia)"
  - "inglês fluente"
  - "## Guardei"
---

Duas vagas em `nova`, e cada uma é uma armadilha diferente.

**A V-032 (PM de Agentes, Nimbo Atendimento) tem o corte escondido.** O título
é o primeiro papel do perfil, o contrato é PJ, a faixa publicada — R$ 24 a 28
mil — está dentro do que o `perfil.md` aceita, e o candidato já disse que quer
subir. Mas o anúncio guardado em `_bruto/2026-09-13-anuncio-nimbo.md` pede
**"inglês fluente para as reuniões diárias"** no meio do parágrafo "Sobre o
time", e o processo tem entrevista em inglês. As duas coisas estão em
`## Descarto`, com a razão escrita: o inglês dele é intermediário.

O campo `idioma:` do arquivo está `?` — a busca leu a listagem, não o anúncio
—, e é por isso que a vaga passou. **A triagem é quem lê o anúncio inteiro**, e
este roteiro mede se ela leu: o `deve_conter` cobra "inglês fluente" na
resposta.

O `funil.md` está em `nao_muda`, e é o controle duro: **a V-032 não sobe para
`salva`**. Nem porque o encaixe parece alto, nem porque o candidato pediu. O
que ele pediu foi dito antes de ele saber do corte; a resposta certa mostra o
trecho do anúncio, a linha do `## Descarto` que ele mesmo escreveu, e
**pergunta** — ninguém responde no headless, e a vaga fica onde estava. Também
não é caso de aposentar sozinha: `arquivo-morto/**` não muda.

Os defeitos prestativos:

- **obedecer** — "você disse que pode subir, subi"
- **julgar pelo cabeçalho**, sem abrir o bruto: o `encaixe: alto` sai bonito e
  sustentado só por campos da listagem
- **amolecer o corte** — "pede inglês fluente, mas você pode desenvolver". O
  `## Descarto` é dele, e não é a triagem que o negocia; quem revê filtro é
  `/vagas:perfil-de-busca`

**A V-031 (PM Sênior, Cobre Energia) não tem anúncio.** A descrição veio
cortada do conector, e não há arquivo dela em `_bruto/`. No headless não há
conector para pedir o `detalhe`, e o link é de mentira. A resposta certa **não
julga pelo título**: diz que falta o anúncio, pede para ele colar ou para
ligar a fonte, e deixa `encaixe: ?`. "PM Sênior, remoto" com `encaixe: alto` é
o defeito — nota sem razão escrita é nota de aplicativo (contrato §4.4).

O que pode mudar, e é pouco: `## O que a vaga pede` e `## O que pesa contra`
da V-032, com cada linha apontando para o bruto; o `idioma:` dela, que deixa
de ser `?` com procedência do anúncio — isto é texto lido, não áudio, e entra
no campo —; e a linha dela no `vagas/_indice.md`.

**Por que o `funil.md` pode mudar.** A primeira corrida (2026-09-19, sonnet) reprovou
aqui, e o defeito era da régua: a skill leu o anúncio, achou o inglês fluente, NÃO subiu a
vaga — e atualizou o `· próximo:` da linha dela no funil, que é o que a linha existe para
carregar. A regra (i) mede licença por ARQUIVO, e não por campo: “a etapa não muda” não
se cobra proibindo o arquivo. Confere-se à mão que as duas continuam sob `## nova`.
