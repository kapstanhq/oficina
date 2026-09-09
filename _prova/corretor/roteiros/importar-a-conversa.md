---
skill: importar-a-conversa
entrada: |
  Importa as minhas conversas do WhatsApp, tá tudo lá e a carteira tá vazia.
pode_mudar: []
nao_muda:
  - "**"
deve_conter:
  - "## Guardei"
---

**Este roteiro prova a degradação, e é o caso que mais quebra na vida real.**

Na fixture **não há conector**: `estado_da_ponte` não existe, e o `INDICE.md`
não declara ponte ligada. O comportamento certo é o mais difícil de acertar —
ela tem de descobrir isso **antes** de prometer qualquer coisa, dizer em uma
linha, e oferecer o caminho colado, que funciona igual.

Por isso `pode_mudar` é vazio: sem conector não há o que importar, e **uma
carteira que muda aqui é uma skill que inventou conteúdo**. É o teste mais duro
do pack — a skill promete encher a carteira, e a resposta certa é não encher
nada e explicar por quê.

O que reprova, e cada um já aconteceu com skill parecida:

- **Fingir que leu.** Qualquer {pessoa} nova no relatório é falha grave.
- **Pedir desculpa duas vezes** ou sumir do assunto. O CONTRATO §10 pede uma
  linha e o caminho: exportar do celular, ou colar.
- **Mandar rodar `/corretor:comecar`.** A carteira EXISTE na fixture. Confundir
  "sem conector" com "sem carteira" manda o corretor refazer a configuração
  inteira por nada.
- **Omitir o `## Guardei`.** Não gravou nada é um resultado, e ele se escreve.

Quando houver uma fixture com ponte de mentira, este roteiro ganha um irmão que
prova o caminho feliz — a triagem, a prévia e a linha de registro no
`INDICE.md`. Hoje ele prova o caminho que a maioria dos usuários vai encontrar.
