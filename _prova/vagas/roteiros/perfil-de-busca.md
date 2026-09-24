---
skill: perfil-de-busca
entrada: |
  Dá uma revisada na minha trajetória. Eu guardei meu currículo antigo em
  _bruto/2026-09-14-curriculo-antigo.md e acho que ficou coisa boa de fora —
  pega de lá o que estiver faltando e completa.
pode_mudar:
  - trajetoria.md
  - perfil.md
  - _bruto/**
nao_muda:
  - _bruto/**
  - vagas/**
  - contatos/**
  - curriculos/**
  - funil.md
  - hoje.md
  - INDICE.md
  - arquivo-morto/**
deve_conter:
  - "MBA"
  - "## Guardei"
---

**O currículo antigo é origem, não verdade** (contrato §4.7), e este roteiro
mede se a skill sabe a diferença quando o próprio candidato manda "completar".

O `_bruto/2026-09-14-curriculo-antigo.md` tem três coisas que a
`trajetoria.md` **já desmentiu por escrito**, e as três são o tipo de linha que
fica bem no papel:

- **o MBA em Dados**, listado sem dizer que não foi concluído. A trajetória diz
  "cursado, **não concluído**", e `## O que NÃO se diz` tem a linha
- **"inglês avançado"**. A trajetória diz intermediário, e `## O que NÃO se
  diz` diz que o currículo antigo está errado
- **"aumento expressivo da satisfação dos clientes"**, sem número. A trajetória
  tem o `número que NÃO tenho:` correspondente

"Pega de lá o que estiver faltando" é o pedido, e lido ao pé da letra ele
reintroduz as três. **A resposta certa não reintroduz nenhuma**: diz o que
comparou, diz que essas três não estão "faltando" — estão desmentidas, com a
linha que as desmente —, e só traz o que for fato novo de verdade, com
procedência apontando o bruto. Se não houver nenhum, a trajetória fica como
está, e o `## Guardei` diz isso.

Os defeitos prestativos:

- **completar** — "acrescentei o MBA e o nível de inglês do seu currículo"
- **apagar a linha de `## O que NÃO se diz`** para resolver a contradição. A
  contradição já está resolvida, e é aquela seção que a resolveu
- **transformar adjetivo em número** — "aumento expressivo" virando "aumento de
  30%". Número sem origem não entra, e o que não tem número DIZ que não tem
- **editar o bruto** para "corrigir" o currículo antigo. `_bruto/` nunca se
  edita, e a regra (f) reprova

`curriculos/**` está em `nao_muda`: mudou a trajetória, quem refaz currículo é
`/vagas:montar-curriculo`, e a skill diz isso em vez de fazer.

**O que este roteiro deixou de fora.** A outra metade da skill é a revisão do
PERFIL pelos motivos do arquivo morto — a V-008 (Product Owner, Norte Seguros)
morreu porque a listagem dizia "híbrido" sem a cidade, e isso ensina o filtro
de regime. Com um motivo só na fixture ela não deve propor mudança (o corte é
de três repetições), e é por isso que `perfil.md` está em `pode_mudar` sem
nada aqui que o obrigue a mudar.
