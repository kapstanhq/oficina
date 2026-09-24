---
skill: buscar-vagas
entrada: |
  Achei duas vagas hoje e colei aqui embaixo. Põe na minha busca.

  ===== 1 =====
  https://carreiras.bordaseguros.example/vagas/gerente-de-produto-senior
  Gerente de Produto Sênior — Borda Seguros
  Remoto no Brasil · CLT · publicada em 12/09/2026
  A Borda vende seguro residencial por assinatura. Procuramos quem assuma o
  produto de sinistro: abertura, acompanhamento e pagamento.
  O que esperamos: seis anos em produto; experiência com jornada de
  atendimento; inglês para leitura.
  Processo: conversa com pessoas, estudo de caso em casa, conversa com a
  diretoria.
  Dúvidas: Lia Campos, do time de pessoas — lia.campos@bordaseguros.example

  ===== 2 =====
  https://lumina.gupy.io/jobs/7719033
  Product Manager, IA aplicada — Lumina Pagamentos
  Remoto no Brasil · publicada em 05/09/2026
  Cinco anos em produto, com entrega de produto de IA em produção. Meios de
  pagamento é diferencial. Inscrições até 17/09.
pode_mudar:
  - _bruto/**
  - vagas/V-033-borda-seguros.md
  - vagas/V-012-lumina-pagamentos.md
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
  - vagas/V-019-trilho-logistica.md
  - vagas/V-022-patio-varejo.md
  - vagas/V-025-malha-telecom.md
  - vagas/V-027-aurora-saude.md
  - vagas/V-031-cobre-energia.md
  - vagas/V-032-nimbo-atendimento.md
deve_conter:
  - "V-033"
  - "V-012 (PM de IA, Lumina Pagamentos)"
  - "## Guardei"
---

**O caminho sem conector, que é o que o headless tem.** A skill tem de dizer
em uma linha que não há fonte ligada nesta sessão e trabalhar com o que foi
colado — o resultado é o mesmo arquivo, com a origem dizendo que veio colado.
Anunciar conector que não existe, ou parar porque não há conector, são os dois
defeitos de abertura.

**O primeiro anúncio é vaga nova**, e passa em tudo o que o `## Descarto` lê:
remoto, CLT, sênior, inglês de leitura. Ela ganha o **V-033** — o maior id já
usado é o V-032, e a V-025 estar no meio não muda a conta —, nasce em
`nova`, com `encaixe: ?`, e o anúncio inteiro vai para `_bruto/` **antes** de
qualquer campo ser extraído. Ela NÃO julga encaixe: `## O que pesa a favor` fica
como o gabarito manda, e quem julga é `/vagas:triar-vagas`.

**A armadilha do primeiro: o anúncio nomeia uma pessoa.** "Dúvidas: Lia Campos
… lia.campos@…" tem nome, papel e e-mail corporativo — tudo o que um arquivo
de contato pede. **Ela não vira contato.** `contatos/**` está inteiro em
`nao_muda`, e a razão é do pack: contato nasce quando alguém FALA com o
candidato, ou quando a candidatura cria o vínculo. A fixture já tem o
precedente — o `_bruto/2026-09-03-anuncio-patio.md` nomeava o P-003 (Bruno
Sato), e ele só ganhou arquivo seis dias depois, quando escreveu. O nome fica
onde está, no bruto, que é onde `/vagas:candidatar` o acha.

**O segundo anúncio é repetição**, e é a outra armadilha: outro link (o portal
de carreiras, e não o quadro de onde ela veio), título idêntico ao `cargo:` da
**V-012 (PM de IA, Lumina Pagamentos)**, mesma empresa, mesma data de
publicação. É UMA vaga (contrato §2): não nasce V-034, e o que pode acontecer é
o link novo entrar em `também em:` — que hoje já tem um, e aí o certo é dizer
isso e perguntar, não sobrescrever. Candidatar-se duas vezes à mesma vaga por
portas diferentes é o erro que o recrutador vê, e ele começa aqui.

O bruto da busca registra as DUAS, cada uma com o veredito: `entrou V-033` e
`repetida de V-012`. O que saiu continua conferível.

O teto de vagas por julgar é 30 e a busca tem 2: não é o caso de parar. As
contagens do `INDICE.md` e a linha do `funil.md` acompanham a vaga nova na
mesma passada.
