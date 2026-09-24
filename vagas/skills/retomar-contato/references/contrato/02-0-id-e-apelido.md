<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 2 · Id e apelido

**O id nunca anda sozinho.** Em toda menção, em toda skill, em todo arquivo, em
toda mensagem para o candidato: `V-014 (Técnica de Enfermagem UTI, Vértice Saúde)`.
Nunca só `V-014`, nunca só “aquela do hospital”.

O id existe para o arquivo e o link não quebrarem quando a empresa republicar a
vaga com outro título — e ela republica. O apelido existe para o candidato saber
de qual se fala sem abrir nada. Os dois juntos, sempre — inclusive dentro de
listas, de tabelas e do histórico.

```
V-   vaga                              V-014
P-   contato (recrutador, gestor,      P-003
     referência — gente)
```

Número sequencial de três dígitos, por prefixo. **Id não se reaproveita**, nem
depois que a vaga vai para `arquivo-morto/`: o próximo é sempre o maior já usado
mais um, contando o arquivo morto junto. Para achar o maior, leia o `_indice.md`
do tema — ele lista os vivos e os aposentados.

**A mesma vaga em duas fontes é UMA vaga.** Ela aparece no site da empresa, no
agregador e na rede profissional, com três links e às vezes três títulos.
Mesma empresa, mesmo cargo, mesma cidade ou regime, publicada na mesma quinzena:
é uma, e o segundo link entra no campo `também em:`. Candidatar-se duas vezes à
mesma vaga por portas diferentes é o erro que o recrutador vê. Na dúvida,
pergunte.

**Vaga republicada meses depois é outra vaga**, com id novo — e a linha de
`## Histórico` dela aponta para a antiga, que continua no arquivo morto com o
que aconteceu da primeira vez.

### O apelido

- vaga: `<cargo curto>, <empresa>` — `Técnica de Enfermagem UTI, Vértice Saúde`,
  `Atendente de SAC, Rota Delivery`, `PM de IA, Lumina Pagamentos`. O cargo como
  a vaga o escreve, encurtado até caber; a empresa pelo nome que ela usa, não a
  razão social.
- contato: nome e sobrenome como ele assina — `Bruno Sato`.

### O nome do arquivo

Id, hífen, apelido em minúsculas, sem acento, sem vírgula, palavras ligadas por
hífen. Na vaga, **só a empresa** — o cargo fica de fora, porque é ele que muda
quando republicam, e o arquivo já é único pelo id:

```
V-014 (Técnica de Enfermagem UTI, Vértice Saúde)      → V-014-vertice-saude.md
V-020 (Atendente de SAC, Rota Delivery)               → V-020-rota-delivery.md
P-003 (Bruno Sato)                                    → P-003-bruno-sato.md
```

Apelido mudou? O arquivo **não** é renomeado — o link do índice quebraria e o
histórico ficaria órfão. Muda-se o apelido no título dentro do arquivo e nas
vistas; o nome do arquivo fica como nasceu.

---
