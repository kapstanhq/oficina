# A base de prova do painel

Uma base mínima, de nenhum ofício, com **a forma inteira** do formato: o
`INDICE.md` com as seis seções, a lista do dia com caixas, o funil por etapa,
uma pasta com `_indice.md` e um arquivo por item, e o `_bruto/` com a origem
crua.

Ela existe por duas razões:

- é a raiz contra a qual `prova-guardas.mjs` mede a LEITURA — travessia,
  extensão fora da lista, arquivo que não existe. Um teste negativo precisa de
  um controle que devolva 200, e o controle é este `INDICE.md`
- é o alvo de `node painel/servidor.mjs --base painel/_prova-base`, que é
  como se vê a página inicial sem montar uma base de verdade

O vocabulário é genérico de propósito — `item`, `X-001` —, pela mesma razão
das demonstrações de `servidor.mjs`: este diretório é copiado para dentro de
todo pack, e palavra de ofício aqui é palavra vazando para o motor.

O `_bruto/2026-09-19-pagina.html` está aqui para ser RECUSADO: é um arquivo
que existe, dentro da raiz, com extensão fora da lista. Sem ele, a prova da
guarda de extensão mediria um arquivo inexistente — e um 403 sobre o que não
existe não prova guarda nenhuma.
