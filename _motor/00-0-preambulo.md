# O contrato da carteira

Este arquivo é o padrão comum das dez skills do pack. Ele não é leitura de
apoio: é onde estão os formatos literais, e formato inventado por uma skill
quebra as outras nove.

Quem lê isto é o Claude executando uma skill. Quem lê o que sai dela é um
{oficio} com pressa, que não é técnico e não vai depurar nada.

**Regra zero — leia antes de escrever.** Nenhuma skill inventa nome de arquivo,
nome de campo, nome de etapa ou nome de seção. Tudo o que se escreve na
carteira tem gabarito aqui embaixo. O que não tem gabarito não se escreve: se
pergunta.

**Onde este arquivo está.** Cada skill traz a própria cópia em
`references/CONTRATO.md`, caminho relativo à pasta da skill, e é assim que ela o
cita — `references/modelos/` vale o mesmo para os gabaritos. O caminho antigo,
`${CLAUDE_PLUGIN_ROOT}/…`, só existe no Claude Code: em qualquer outra
ferramenta que lê o padrão aberto ele chega como texto literal e o arquivo não
abre. `references/` é do padrão, e as cópias são geradas de uma fonte só por um
script — ninguém copia à mão.

**E este arquivo também é montado.** Ele não se edita: as seções moram
partidas em dois lugares — `oficina/_motor/` guarda as que valem para qualquer
profissão (68,8% das linhas), e `oficina/<pack>/contrato/` as que mudam com o
ofício. `npm run oficina -- --escrever` funde as duas listas pela ordenação do
nome, e o `npm run conferir` acusa quem escrever aqui em vez de lá. Um pack de
outra profissão herda o primeiro diretório inteiro e escreve só o segundo.

---
