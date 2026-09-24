---
skill: buscar-vagas
entrada: |
  Me mandaram três vagas no grupo de enfermagem. Colei aqui. Põe na minha busca.

  ===== 1 =====
  https://casaamparo.example/vagas/tecnico-de-enfermagem-12x36
  Técnico(a) de Enfermagem — Home Care — Casa Amparo
  Jaboatão dos Guararapes · CLT · publicada em 12/09/2026
  Plantão 12x36 noturno, das 19h às 7h, com paciente fixo em ventilação
  não invasiva. Requisitos: COREN-PE ativo, experiência com paciente
  acamado. Salário de R$ 3.350 mais adicional noturno.
  Dúvidas: Paulo Rêgo, da coordenação — paulo.rego@casaamparo.example

  ===== 2 =====
  https://trilhologistica.gupy.io/jobs/9072215
  Técnico(a) de Enfermagem — Ambulatório do Centro de Distribuição
  Trilho Logística · Jaboatão dos Guararapes · publicada em 12/09/2026
  COREN-PE ativo, experiência ambulatorial. 12x36 diurno. CLT.

  ===== 3 =====
  https://redefarmasol.gupy.io/jobs/9074430
  Técnico(a) de Enfermagem — Sala de Aplicação — Rede Farma Sol, loja Boa Viagem
  Recife · CLT · escala 6x1, das 7h às 15h20 · publicada em 13/09/2026
pode_mudar:
  - _bruto/**
  - vagas/V-015-casa-amparo.md
  - vagas/V-014-trilho-logistica.md
  - vagas/_indice.md
  - funil.md
  - INDICE.md
  - hoje.md
nao_muda:
  - _bruto/**
  - contatos/**
  - perfil.md
  - trajetoria.md
  - curriculos/**
  - arquivo-morto/**
  - vagas/V-004-hospital-boa-vista.md
  - vagas/V-006-vertice-saude.md
  - vagas/V-007-lar-cuidado.md
  - vagas/V-010-upa-norte.md
  - vagas/V-012-hospital-mare-alta.md
  - vagas/V-013-policlinica-beira-rio.md
deve_conter:
  - "V-015"
  - "V-014 (Técnica de enfermagem de ambulatório, Trilho Logística)"
  - "6x1"
  - "## Guardei"
---

**Três anúncios colados, três destinos diferentes** — e nenhum conector no
headless: a skill diz em uma linha que trabalha com o que foi colado.

**O primeiro é vaga nova.** Passa no `## Descarto` inteiro: Jaboatão, CLT,
12x36. Ganha o **V-015** — o maior id já usado é o V-014, e o V-009 no arquivo
morto conta para a numeração mas não é o maior. Nasce em `nova`, com
`encaixe: ?`, `jornada: 12x36 noturno` e `idioma: ?` ou `não pede` com
procedência do bruto, e o anúncio inteiro vai para `_bruto/` antes de qualquer
campo. A armadilha é a mesma do pack A: **Paulo Rêgo não vira contato** —
`contatos/**` está em `nao_muda`.

**O segundo é repetição da V-014 (Técnica de enfermagem de ambulatório,
Trilho Logística)**, por outra porta: o portal da gupy, e não o linkedin de
onde ela veio. Mesma empresa, mesmo título, mesma data. Não nasce V-016; o
link entra em `também em:`, que na V-014 ainda é `?` — aqui é caso de
preencher, não de perguntar. E o que o anúncio novo diz a mais (CLT, 12x36
diurno) pode entrar nos campos da V-014, com a procedência do bruto novo.

**O terceiro morre na regra.** Escala 6x1 está no `## Descarto` com a razão
escrita. Ele **não vira arquivo de vaga** — nem em `vagas/`, nem em
`arquivo-morto/` (que está em `nao_muda`): a que a busca descarta sozinha fica
na linha do `_bruto/` com o motivo (contrato §4.9). O `deve_conter` cobra
"6x1" na resposta, que é onde ela diz por que o terceiro não entrou. Ser da
mesma rede da V-009 (Técnica de enfermagem, Rede Farma Sol) não muda nada: é
outra vaga, e morre pelo mesmo corte.

As contagens do `INDICE.md` e a linha do `funil.md` acompanham a V-015 na
mesma passada.
