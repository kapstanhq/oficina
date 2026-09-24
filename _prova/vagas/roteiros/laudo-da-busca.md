---
skill: laudo-da-busca
entrada: |
  Antes de eu me candidatar a mais alguma coisa: dá uma conferida na minha
  busca. Hoje é 14 de setembro de 2026.
pode_mudar: []
nao_muda:
  - "**"
deve_conter:
  - "## Guardei"
---

**Terceiro roteiro de ausência.** `pode_mudar` é a lista vazia e `nao_muda` é
tudo: esta é a única skill do pack que não escreve, e a prova precisa medir
isso — uma régua que escreve deixa de ser barata, e ninguém a roda no meio de
outra coisa.

A fixture tem material para os achados, e é de propósito que ela não esteja
limpa:

- **um bruto que ainda não virou fato:** `_bruto/2026-09-13-whatsapp-helena.md`
  tem a faixa da V-019 dita em áudio, e o arquivo da vaga continua `faixa: ?`.
  **Isso não é defeito a consertar aqui** — o laudo aponta, nomeia quem
  conserta (`/vagas:organizar-busca`), e não preenche o campo. E quem
  consertar também não preenche: o número veio de transcrição (contrato §7)
- **um currículo mais velho que a fonte:** `curriculos/V-027-cv.md` declara na
  primeira linha que saiu da trajetória de 01/09, e a `trajetoria.md` é de
  14/09. É o que o comentário de primeira linha existe para deixar ver
  (contrato §12)
- **`?` com dono:** `contrato: ?  ← a vaga não diz; perguntar na primeira
  conversa` na V-012, e `faixa: ?` em quase todas — o segundo é o estado normal
  de vaga brasileira, e contar oito achados por isso é ruído
- **a V-031 (PM Sênior, Cobre Energia) está quase toda `?`** — e isso não é
  defeito: é vaga `nova`, com a descrição cortada, por julgar
- **vaga sem contato não é órfã.** A V-012, a V-027, a V-031 e a V-032 têm
  `contato: ?`, e o laudo que as listar como "vínculo faltando" está medindo
  este pack com a régua de outro. Órfão aqui é `etapa:` em arquivo de contato,
  e a fixture não tem nenhum
- **nada está sem procedência, e os dois lados de cada vínculo batem**
  (`contato:` na vaga, `## Fala por` no contato). As seções correspondentes
  saem com zero, **escritas**. Achado inventado aqui é falha

O que se olha no laudo depois de rodar, e que a regra automática não pega: se
ele abriu pelo veredito de uma linha, se cada achado tem o nome de quem
conserta, se ele achou o currículo envelhecido, e se o `## Guardei` diz que
nada foi gravado. Omitir o `## Guardei` porque "não gravou nada" é o defeito
que o contrato §10 nomeia — e esta é a skill em que ele é mais tentador.
