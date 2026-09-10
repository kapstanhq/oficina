---
skill: laudo-da-carteira
entrada: |
  Antes de eu mandar mais nada: dá uma conferida na minha carteira.
pode_mudar: []
nao_muda:
  - "**"
deve_conter:
  - "## Guardei"
---

**O roteiro que prova uma ausência.** `pode_mudar` é a lista vazia e
`nao_muda` é tudo: esta é a única skill do pack que não escreve, e a prova
precisa medir isso — uma régua que escreve deixa de ser barata, e ninguém a
roda no meio de outra coisa.

A fixture tem material para os achados, e é de propósito que ela não esteja
limpa:

- **`?` com dono e data:** `faturamento: ?  ← não é público; perguntar na
  reunião` no E-071, e `e-mail: ?  ← procurar no site da conta` no P-019.
  O segundo é o que trava uma abordagem inteira
- **o E-052 (Clínica Sanare, Curitiba) está quase todo `?`** — e isso não é
  defeito: é conta `a estudar`, e o laudo tem de dizer isso em vez de contar
  dez achados
- **nada está sem procedência.** A seção correspondente tem de sair com zero,
  **escrita**. Achado inventado aqui é falha
- **as validades do pack:** o cargo da Carla é de 12/08 e o prazo é 90 dias;
  nada venceu na fixture

O que se olha no laudo depois de rodar, e que a regra automática não pega: se
ele abriu pelo veredito de uma linha, se cada achado tem o nome de quem
conserta, e se o `## Guardei` diz que nada foi gravado. Omitir o
`## Guardei` porque "não gravou nada" é o defeito que o CONTRATO §10 nomeia —
e esta é a skill em que ele é mais tentador.
