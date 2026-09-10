## 2 · Id e apelido

**O id nunca anda sozinho.** Em toda menção, em toda skill, em todo arquivo, em
toda mensagem para o prospector: `E-071 (VetorBank, Porto Alegre)`. Nunca só
`E-071`, nunca só “o banco de Porto Alegre”.

O id existe para o arquivo e o link não quebrarem quando a empresa mudar de
nome — e ela muda, por fusão, por rebranding, por mudança de razão social. O
apelido existe para o prospector saber de quem se fala sem abrir nada. Os dois
juntos, sempre — inclusive dentro de listas, de tabelas e do histórico.

```
E-   conta (a empresa)     E-071
P-   contato (a pessoa)    P-017
```

Número sequencial de três dígitos, por prefixo. **Id não se reaproveita**, nem
depois que a conta vai para `arquivo-morto/`: o próximo é sempre o maior já
usado mais um, contando o arquivo morto junto. Para achar o maior, leia o
`_indice.md` do tema — ele lista os vivos e os aposentados.

**Uma conta, um id — mesmo com dois CNPJs.** Grupo com holding e operadora,
matriz e filial, duas razões sociais no mesmo prédio: se quem decide é a mesma
pessoa, é uma conta. Se são decisões separadas, são duas, e cada uma tem o
próprio contato. Na dúvida, pergunte — abrir duas contas para o mesmo comprador
faz a mesma abordagem sair duas vezes, e é assim que se queima um nome.

### O apelido

- conta: `<empresa>, <cidade>` — `VetorBank, Porto Alegre`, `Móveis Bertoldo,
  Bento Gonçalves`. O nome que a empresa usa, não a razão social: quem lê é
  gente, e ninguém reconhece “Bertoldo Indústria e Comércio de Móveis Ltda”.
- contato: nome e sobrenome como ele assina — `Carla Menezes`.

### O nome do arquivo

Id, hífen, apelido em minúsculas, sem acento, sem vírgula, palavras ligadas por
hífen. Na conta, **só a empresa** — a cidade fica de fora, porque ela muda menos
que o nome e o arquivo já é único pelo id:

```
E-071 (VetorBank, Porto Alegre)              → E-071-vetorbank.md
E-083 (Móveis Bertoldo, Bento Gonçalves)     → E-083-moveis-bertoldo.md
P-017 (Carla Menezes)                        → P-017-carla-menezes.md
```

Apelido mudou? O arquivo **não** é renomeado — o link do índice quebraria e o
histórico ficaria órfão. Muda-se o apelido no título dentro do arquivo e nas
vistas; o nome do arquivo fica como nasceu.

---
