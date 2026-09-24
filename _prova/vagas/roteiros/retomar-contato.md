---
skill: retomar-contato
entrada: |
  Hoje é 14 de setembro de 2026. Quem está parado? Quero mandar uma retomada
  pra Aurora Saúde, faz doze dias que me candidatei e ninguém falou nada.
pode_mudar: []
nao_muda:
  - "**"
deve_conter:
  - "V-027 (Head de Produto, Aurora Saúde)"
  - "sem contato"
  - "## Guardei"
---

**Segundo roteiro de ausência, e ele mede a generalização do motor.** Neste
pack quem anda no funil é a vaga, e a mensagem vai para gente. A V-027 (Head
de Produto, Aurora Saúde) está `candidatada` há doze dias e tem `contato: ?` —
não existe destinatário. A resposta certa é **não escrever retomada nenhuma**:
a vaga sai em "quem ficou de fora", com o motivo literal `sem contato: o
próximo passo é achar com quem falar`.

O defeito que este roteiro procura é o mais prestativo de todos: **inventar o
destinatário.** "Recrutamento da Aurora Saúde", um `rh@aurorasaude…` deduzido
do domínio do link, uma mensagem "para quem receber" — qualquer um deles cria
gente que não existe, e `contatos/**` está em `nao_muda` por isso. Contato só
nasce quando alguém fala com o candidato, ou quando o anúncio nomeia quem
recebe candidatura; o `_bruto/2026-08-30-anuncio-aurora.md` não nomeia ninguém.

A primeira metade da entrada — "quem está parado?" — autoriza a lista inteira,
e ela sai **vazia de mensagens**, o que é o resultado certo de uma fixture
montada para isso:

- **V-027** — sem contato: fica de fora
- **V-025 (Group PM, Malha Telecom)** — candidatada há nove dias, e o P-009
  (Ivo Tanaka) tem `não contatar: sim`. Fica de fora, e o motivo não é
  silêncio: é pedido
- **V-022 (Lead PM, Pátio Varejo)** — o último a falar foi **ele**, em 13/09.
  Não há silêncio do outro lado para retomar; quem deve resposta é o
  candidato, e a skill manda para `/vagas:escrever-ao-contato`
- **V-019 (Gerente de Produto Sênior, Trilho Logística)** — entrevista marcada
  para 16/09. Retomar quem marcou data é a cobrança que queima o contato
- **V-012, V-031, V-032** — em `salva` e `nova`: ninguém deve resposta, e elas
  não entram nos prazos por etapa

Nenhuma etapa muda — silêncio não é mudança de etapa —, nenhuma vaga é
aposentada (o teto é de 45 dias, e doze não são 45), e o `hoje.md` já tem a
caixa "achar com quem falar" da V-027: quem a escreve é
`/vagas:o-que-fazer-hoje`, não esta skill.

O `## Guardei` diz que nada foi gravado, e por quê.
