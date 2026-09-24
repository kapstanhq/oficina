<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

### 4.5 · O arquivo de contato — `contatos/P-003-bruno-sato.md`

Teto: **50 linhas**. Contato é GENTE do outro lado: recrutador, gestor da vaga,
ou alguém que pode dar referência. **A pasta pode estar vazia**, e isso não é
busca malfeita — é busca no começo.

```markdown
# P-003 (Bruno Sato)

papel: recrutador  ← _bruto/2026-09-09-email-bruno.md
empresa: Pátio Varejo  ← _bruto/2026-09-09-email-bruno.md
cargo: talent partner  ← assinatura do e-mail, 2026-09-09
e-mail: bruno.sato@patiovarejo.example  ← _bruto/2026-09-09-email-bruno.md
telefone: ?
perfil profissional: ?
canal: e-mail
de onde veio: respondeu à candidatura da V-022  ← _bruto/2026-09-09-email-bruno.md
não contatar: não

## Fala por
- V-022 (Lead PM, Pátio Varejo) · desde 2026-09-09

## O que ele me disse
processo: três conversas e um estudo de caso  ← _bruto/2026-09-09-email-bruno.md
prazo: querem fechar até o fim de outubro  ← _bruto/2026-09-09-email-bruno.md
faixa: ?  ← perguntou a minha antes de dizer a deles

## O que já mandei
- 2026-09-10 · e-mail · agradeci e propus terça ou quinta · respondeu em 11/09

## Combinado
- ele ia mandar o estudo de caso até 2026-09-11, e não mandou

## Histórico
- 2026-09-09 primeiro contato, por e-mail  ← _bruto/2026-09-09-email-bruno.md
```

`papel:` é um destes: `recrutador`, `gestor`, `referência`, `indicação`. Ele
decide o tom e o que se pede: ao recrutador se pergunta prazo e processo; ao
gestor, o problema que a vaga resolve; à referência se pede **referência**, não
emprego — e só depois de a vaga existir.

**Contato não tem `etapa:`.** Quem anda no funil é a vaga (seção 4.3). O que
liga os dois é `## Fala por` aqui e `contato:` lá, e os dois se escrevem na
mesma passada.

`## O que já mandei` guarda **toda** mensagem que `/vagas:escrever-ao-contato`
escreveu, com o que ela pedia — uma linha por mensagem, mesmo a que não teve
resposta: sobretudo a que não teve resposta. A **retomada** é outra coisa, e
mora noutro lugar: é andamento da vaga, e vai para o `## Histórico` dela, com o
nome de quem recebeu (seção 4.4). `/vagas:retomar-contato` lê os dois para não
repetir a pergunta.

`não contatar: sim` só existe se ele pediu, e aí vale para todas as skills, nos
dois modos (seção 3.1).
