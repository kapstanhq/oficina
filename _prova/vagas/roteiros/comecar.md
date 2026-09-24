---
skill: comecar
entrada: |
  Quero montar minha busca de vaga. Vou usar a pasta que já existe aqui.
pode_mudar:
  - "**"
nao_muda:
  - _bruto/**
  - arquivo-morto/**
  - perfil.md
  - trajetoria.md
  - curriculos/**
deve_conter:
  - "## Guardei"
---

A busca **já existe** na fixture, e é isso que este roteiro mede: a skill tem
de reconhecer o `INDICE.md` e **não montar por cima**. O contrato §1 diz que
ela não cria a busca de novo, e §10 diz que ela para e conta o que achou.

Se ela seguir para os passos de montagem, o defeito aparece em `INDICE.md`
reescrito, com as contagens zeradas e o `funil.md` de volta ao gabarito — e é o
pior deste pack: apagar uma busca com quatro candidaturas em andamento.

`_bruto/` e `arquivo-morto/` em `nao_muda` são o controle de sempre. Os três
que este pack acrescenta — `perfil.md`, `trajetoria.md` e `curriculos/**` — são
o controle novo: nenhum dos três é dela. O perfil e a trajetória são de
`/vagas:perfil-de-busca`, o currículo é de `/vagas:montar-curriculo`, e uma
skill que "monta a busca" tem toda razão aparente para achar que pode
"completar" os três.

O que ela **pode** fazer, e é o comportamento certo: ler o que existe, dizer
quantas vagas e quantos contatos achou — **sete vagas vivas e quatro
contatos**, e dizer que contato a menos que vaga é o normal aqui —, apontar o
que está pulado (o navegador e o Google Drive estão em `## Pulado no começo`)
e oferecer os comandos do passo 8 com os ids de verdade da busca, não os do
exemplo.

O que se olha depois de rodar, e a régua não pega: se ela ofereceu "cadastrar
o primeiro contato" como pendência. Não é — a V-027 (Head de Produto, Aurora
Saúde) e a V-012 (PM de IA, Lumina Pagamentos) não têm contato, e isso é o
estado comum, não passo pulado.
