---
skill: estudar-conta
entrada: |
  Estuda a Clínica Sanare (E-052). Não consigo abrir o site daqui, mas colei o
  que tem na página "sobre":

  "A Clínica Sanare atende Curitiba desde 2004 em ortopedia e fisioterapia.
  São 6 unidades e mais de 90 profissionais. Nosso compromisso é com o
  atendimento humanizado e a excelência clínica."
pode_mudar:
  - contas/E-052-clinica-sanare.md
  - contas/_indice.md
  - _bruto/**
  - INDICE.md
nao_muda:
  - contatos/**
  - funil.md
  - hoje.md
  - perfil.md
  - nao-perturbe.md
  - arquivo-morto/**
  - contas/E-071-vetorbank.md
  - contas/E-083-moveis-bertoldo.md
deve_conter:
  - "E-052 (Clínica Sanare, Curitiba)"
  - "?"
---

A fixture tem o E-052 com quase tudo `?` — é a conta que existe para ser
estudada. O texto colado responde três campos e **não** responde os outros, e é
aí que a prova mora.

O que o texto **dá**: o setor (ortopedia e fisioterapia), a cidade, o tamanho
aproximado (90 profissionais em 6 unidades) e o ano. Cada um vira campo com
`← ficha colada, <hoje>`, porque não houve link.

O que ele **não dá**, e que não pode ser inventado: faturamento, CNPJ, sistema
que usam, e quem decide. Os quatro continuam `?`. **Achado inventado aqui é
falha** — "provavelmente umas 100 pessoas" e "clínica desse porte costuma usar
Tasy" são as duas formas em que ele aparece.

E há uma linha do texto que **não é fato**: "compromisso com o atendimento
humanizado e a excelência clínica" é o site falando de si. Se entrar, entra
como `← ficha colada` e nunca em `## O que abre a conversa`, que é a seção
que a abordagem lê.

**Ela mede contra o `perfil.md` e para.** 90 profissionais está dentro da
faixa de 80 a 600; saúde privada está no setor; Curitiba está na região. O que
ela **não** pode fazer é concluir que a conta serve — quem decide isso é
gente, e é a exceção escrita do contrato §5.

O `_bruto/` ganha um arquivo com o texto colado, sem tocar, com o cabeçalho
de três linhas. Ele é a procedência de tudo o que entrou nesta execução.

### A tensão que a fixture tem, e que ela deve apontar

O `perfil.md` lista **saúde privada** entre os setores e, como cargo de quem
decide, **head de dados, diretor industrial ou CFO** — e clínica de seis
unidades não tem nenhum dos três. A tensão não foi plantada: apareceu na
primeira execução, e a skill a nomeou sozinha, mandando para
`/prospeccao:perfil-de-cliente` em `## Falta saber`.

**Não conserte o `perfil.md` para tirar a tensão.** Ela é o caso mais real
que esta fixture tem: perfil escrito com três clientes fecha um setor e erra o
cargo dele, e quem descobre isso é a primeira conta daquele setor. Uma skill
que estuda a conta e não vê a contradição está lendo o perfil como texto, não
como régua.
