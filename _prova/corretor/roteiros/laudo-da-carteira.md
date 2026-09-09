---
skill: laudo-da-carteira
entrada: |
  Antes de eu mandar proposta pra ninguém: dá uma conferida na minha carteira.
pode_mudar: []
nao_muda:
  - "**"
deve_conter:
  - "# Laudo da carteira"
  - "## Guardei"
---

**O roteiro que prova uma ausência.** `pode_mudar` é a lista vazia e `nao_muda`
é tudo: esta é a única skill do pack que não escreve, e a prova precisa medir
isso — uma régua que escreve deixa de ser barata, e ninguém a roda no meio de
outra coisa.

A fixture tem material para os cinco achados, e é de propósito que ela não
esteja limpa:

- `imoveis/V-071-casa-3d-azenha.md` tem `iptu: ?  ← pedir ao proprietário` — é
  o `?` com dono, e ele espera desde 13/08. Deve aparecer na pergunta 4.5.
- `hoje.md` registra que o Sr. Almeida ia mandar o IPTU em 2026-08-13 e não
  mandou. O laudo NÃO cobra — ele aponta `/corretor:cobrar-o-que-falta`.
- Nada está sem procedência na fixture. **Achado inventado aqui é falha**: a
  seção "Sem procedência" tem de sair com zero, escrita, e não sumir.

O que se olha no laudo depois de rodar, e que a regra automática não pega: se
ela abriu pelo veredito de uma linha, se cada achado tem o nome de quem
conserta, e se o `## Guardei` diz que nada foi gravado. Omitir o `## Guardei`
porque "não gravou nada" é o defeito que o CONTRATO §10 nomeia — e esta é a
skill em que ele é mais tentador.
