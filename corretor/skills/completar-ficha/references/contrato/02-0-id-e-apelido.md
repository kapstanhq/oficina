<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 2 · Id e apelido

**O id nunca anda sozinho.** Em toda menção, em toda skill, em todo arquivo, em
toda mensagem para o corretor: `V-071 (casa 3 dorm, Azenha)`. Nunca só `V-071`,
nunca só “a casa da Azenha”.

O id existe para o arquivo e o link não quebrarem quando o apelido mudar. O
apelido existe para o corretor saber do que se fala sem abrir nada. Os dois
juntos, sempre — inclusive dentro de listas, de tabelas e do histórico.

```
V-   imóvel à venda        V-071
A-   imóvel para alugar    A-014
C-   cliente               C-017
```

Número sequencial de três dígitos, por prefixo. **Id não se reaproveita**, nem
depois que o item vai para `arquivo-morto/`: o próximo é sempre o maior já
usado mais um, contando o arquivo morto junto. Para achar o maior, leia o
`_indice.md` do tema — ele lista os vivos e os aposentados.

### O apelido

- imóvel: `<tipo> <n> dorm, <bairro>` — `casa 3 dorm, Azenha`, `apto 2 dorm,
  Menino Deus`. Sem dormitório (terreno, sala): `<tipo> <número>m², <bairro>`.
- cliente: nome e sobrenome como ele se apresentou — `Joana Ribeiro`.

### O nome do arquivo

Id, hífen, apelido em minúsculas, sem acento, sem vírgula, palavras ligadas por
hífen, `3 dorm` vira `3d`:

```
V-071 (casa 3 dorm, Azenha)      → V-071-casa-3d-azenha.md
A-014 (apto 2 dorm, Menino Deus) → A-014-apto-2d-menino-deus.md
C-017 (Joana Ribeiro)            → C-017-joana-ribeiro.md
```

Apelido mudou? O arquivo **não** é renomeado — o link do índice quebraria e o
histórico ficaria órfão. Muda-se o apelido no título dentro do arquivo e nas
vistas; o nome do arquivo fica como nasceu.

---
