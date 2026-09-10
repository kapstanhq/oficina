---
skill: organizar-carteira
entrada: |
  Dá uma arrumada na carteira, faz tempo que não olho.
pode_mudar:
  - contas/**
  - contatos/**
  - funil.md
  - INDICE.md
  - hoje.md
nao_muda:
  - _bruto/**
  - perfil.md
  - nao-perturbe.md
  - arquivo-morto/**
deve_conter:
  - "## Guardei"
---

A fixture tem **uma** coisa que não bate, e é de propósito que seja só uma: o
`contatos/_indice.md` diz 11/08 para o P-019 (Rui Baptista) e o arquivo dele
não tem linha depois disso — os dois estão certos, e a skill não tem o que
corrigir ali.

O que ela deve encontrar:

- **o `_bruto/` tem um arquivo**, o do LinkedIn da Carla, e ele **já foi
  extraído**: os fatos dele estão no arquivo dela com a procedência apontando
  para lá. Reprocessar e duplicar campo é a falha
- **nada está sem procedência.** A seção "Não bate" tem de sair vazia e
  **escrita**, não sumir
- **nada está fora do prazo de 90 dias.** Ninguém é aposentado nesta execução

**`nao-perturbe.md` e `perfil.md` estão em `nao_muda`**, e esse é o
controle novo deste pack: os dois são arquivos da raiz da carteira, e uma skill
que "arruma a carteira" tem toda razão para achar que pode mexer neles. Não
pode: o perfil é de `/prospeccao:perfil-de-cliente`, e do não-perturbe nada
sai, nunca.

A prova aqui é a de uma carteira **limpa**: o relatório certo é curto, diz o
que leu, diz que não achou nada para corrigir, e não inventa achado para
parecer útil.
