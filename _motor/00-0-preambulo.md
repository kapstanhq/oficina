# O contrato da carteira

Este arquivo é o padrão comum das {n-skills} skills do pack. Ele não é leitura de
apoio: é onde estão os formatos literais, e formato inventado por uma skill
quebra as outras {n-skills-1}.

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

**A marca tem gênero, e o ARTIGO se deriva dele.** `{{item}}` e `{{pessoa}}`
resolvem para um substantivo masculino num pack e feminino no seguinte — quem
escolhe é o `vocabulario.json`, e este arquivo não sabe qual virá. Por isso o
pack declara `item-genero` e `pessoa-genero`, e a fonte escreve `{{o-item}}`,
`{{do-item}}`, `{{um-item}}`, `{{dos-itens}}` em vez de colar o artigo na
marca. O nome usa a forma masculina como RÓTULO, não como valor.

**O adjetivo NÃO se deriva, e por isso se evita.** Prefira o verbo — `8
{{pessoas}} entraram` em vez de `8 {{pessoas}} novas` — e a oração ao
particípio — `{{item}} que veio de ficha` em vez de `{{item}} vindo de ficha`.
É a única regra do motor que só se vê depois de gerar, e **nenhum alarme
pega**: a fonte está correta, o erro nasce na geração. Por isso ela mora aqui:
quem a lê está escrevendo a fonte, que é onde ela se cumpre.

**E este arquivo também é montado.** Ele não se edita: as seções moram
partidas em dois lugares — `oficina/_motor/` guarda as que valem para qualquer
profissão (68,8% das linhas), e `oficina/<pack>/contrato/` as que mudam com o
ofício. `npm run oficina -- --escrever` funde as duas listas pela ordenação do
nome, e o `npm run conferir` acusa quem escrever aqui em vez de lá. Um pack de
outra profissão herda o primeiro diretório inteiro e escreve só o segundo.

---
