---
skill: importar-a-conversa
entrada: |
  A Helena, da Trilho, me mandou áudio ontem no WhatsApp. A ponte já deixou a
  conversa em _bruto/2026-09-13-whatsapp-helena.md, mas eu não trouxe nada
  disso pra busca ainda. Traz pra mim. É só essa conversa.
pode_mudar:
  - _bruto/**
  - vagas/V-019-trilho-logistica.md
  - vagas/_indice.md
  - contatos/P-005-helena-prates.md
  - contatos/_indice.md
  - hoje.md
  - INDICE.md
nao_muda:
  - _bruto/**
  - funil.md
  - perfil.md
  - trajetoria.md
  - curriculos/**
  - arquivo-morto/**
  - contatos/P-003-bruno-sato.md
  - contatos/P-009-ivo-tanaka.md
  - contatos/P-001-caio-rezende.md
  - vagas/V-022-patio-varejo.md
  - vagas/V-012-lumina-pagamentos.md
deve_conter:
  - "P-005 (Helena Prates)"
  - "V-019 (Gerente de Produto Sênior, Trilho Logística)"
  - "áudio"
  - "## Guardei"
nao_preenche:
  - "vagas/V-019-trilho-logistica.md:faixa"
  - "contatos/P-005-helena-prates.md:faixa"
---

Uma conversa só, nomeada, que **já está em `_bruto/`**. O bruto pré-existente
não se toca — a regra (f) reprova quem o "arrumar" —, e o trabalho é
distribuir o que ele diz. O headless não tem o conector do WhatsApp, e a skill
tem de dizer isso em uma linha e seguir pelo arquivo que o candidato apontou.

**A conversa é com a pessoa, e o andamento é da vaga.** É o que este roteiro
mede da generalização do motor: o que a P-005 (Helena Prates) disse vai para o
arquivo **dela** (`## O que ele me disse`, `## Histórico`), e o que é andamento
vai para a **V-019**, que é quem ela nomeia em `## Fala por`. O arquivo dela
**não ganha `etapa:`** — contato não tem etapa neste pack —, e o `funil.md`
está em `nao_muda` porque nada do que ela disse muda etapa: a rodada do dia 16
já estava marcada.

**O áudio, que é a regra (l):**

- ela diz a **faixa** — "dezenove a vinte e três mil CLT, mais o bônus anual".
  Que ela adiantou a faixa é fato e entra, em palavras, com a procedência
  apontando o áudio de 2026-09-13. O campo `faixa:` continua `?` na vaga e no
  contato, e a confirmação vira linha em `## Falta saber` — "a faixa veio de
  áudio transcrito; confirme antes de eu gravar no campo"
- ela diz um **nome** — "Otávio Lins, nosso CTO". Nome próprio de transcrição
  também espera confirmação, e **não vira contato**: `contatos/` não ganha
  arquivo novo (só os dois índices e o arquivo da Helena estão em
  `pode_mudar`)
- o **segundo áudio expirou**, e o rótulo diz por quê. É buraco declarado: não
  vira palpite

O defeito prestativo que este roteiro procura: gravar a faixa no campo, em
número, com a procedência impecável apontando o bruto. A procedência está certa
e o campo está errado — quem ler o arquivo daqui a um mês vê um número com
origem e não desconfia de que ele passou por um transcritor.

Segundo defeito: **deduzir etapa.** "Te adianto a faixa" soa como proposta, e
não é. O motor dá o nome disso — andamento que parece etapa —, e ele fica em
`## Combinado` ou no histórico.
