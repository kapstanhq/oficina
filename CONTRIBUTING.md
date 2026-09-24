# Contribuir com a Oficina

Metade do que está dentro de cada pack é **gerado**. Editar a cópia não adianta:
a próxima montagem a reescreve. Antes de mexer, ache a fonte na tabela.

| Você quer mudar | A fonte é | O gerado vai para |
|---|---|---|
| Uma regra que vale para todo ofício | `_motor/*.md`, `_motor/skills/`, `_motor/referencias/` | `<pack>/CONTRATO.md` e `<pack>/skills/*/references/` |
| Uma regra de um ofício só | `<pack>/contrato/*.md` | idem |
| A palavra de um ofício (`{item}`, `{pessoa}`, `{base}`…) | `<pack>/contrato/vocabulario.json` | todo texto do motor naquele pack |
| Uma skill própria do pack | `<pack>/skills/<skill>/SKILL.md` | — (é fonte) |
| O prompt colado (sem o Claude Code) | `prompts/<pack>.md` | `<pack>/PROMPT.md` |
| A tela do painel | `painel/app/*.svelte`, `painel/estilo.css` | `<pack>/painel/painel.html` |
| O servidor do painel, dos conectores ou dos documentos | `painel/`, `conectores/`, `documentos/` | `<pack>/painel/`, `<pack>/conectores/`, `<pack>/documentos/` |
| Como o painel se arranja num pack | `<pack>/painel.json` | `<pack>/painel/acoes.json` |

O gerado fica commitado de propósito: quem instala pelo `/plugin install` não
roda build nenhum. O CI refaz tudo a partir da fonte e recusa o PR em que os
dois divergem.

## O ciclo

Precisa do Node.js 20.19 ou mais novo, e de Chrome, Edge ou Chromium para as
provas de tela e de documentos.

```
npm ci
# … edite a fonte …
npm run painel                  # só se mexeu em painel/app ou painel/estilo.css
npm run montar -- --escrever    # refaz o gerado de todos os packs
npm run montar                  # sem --escrever só confere: tem de sair tudo ✓
```

E as provas, que não chamam modelo nenhum:

```
npm run prova:guardas           # as guardas do servidor local do painel
npm run prova:vigia             # a troca do servidor quando o código muda
npm run prova:tela              # o painel no navegador, a 1300 e a 390 px
npm run prova:montador          # o que o montador recusa num painel.json de pack
npm run prova:sempre            # os arquivos de login do Windows, Mac e Linux
npm run prova:lancar            # o botão que lança o assistente: modelo, pasta, fila
npm run prova:conectores        # `-- --rede` chama as fontes de verdade
npm run prova:documentos
npm run provar -- --seco --pack <pack>
npm run provar -- --seco --pack <pack> --fixture <pack>-b   # a segunda fixture
npm run captura                 # refaz a imagem do README: o painel sobre a fixture
```

`npm run provar -- --rodar --pack <pack>` executa cada skill de verdade contra a
fixture de `_prova/<pack>/`. Ele chama o `claude -p`, leva uns vinte minutos e
**gasta a sua conta** — é para antes de uma mudança grande numa skill, não para
todo PR.

## As regras que o montador cobra

- **O motor não fala o ofício.** Nada em `_motor/` pode ter palavra que só
  exista numa profissão; ela vira marca (`{item}`) e o `vocabulario.json` de
  cada pack a resolve. `npm run marcas <pack>` lista o que um pack ainda não
  resolve.
- **Os tetos de frontmatter** de cada skill (descrição e compatibilidade) e o
  tamanho da SKILL.md.
- **A lista de comandos do README do pack** tem de ser a das pastas em
  `skills/`.

## As que ninguém cobra, e valem igual

- **Exemplo é inventado.** Pessoa, empresa, telefone e e-mail de exemplo ou de
  fixture usam nome fictício e domínio `.example`; número de telefone, um que
  não exista (`+55 11 90000-0001`). Nada de dado seu, nem de empresa real.
- **O painel propõe, o agente dispõe.** A tela não grava na base: ela devolve a
  intenção, e quem escreve é a skill. Dois escritores no mesmo markdown apagam
  um ao outro.
- **Fins de linha em LF.** O `.gitattributes` cuida disso no clone; num editor
  do Windows, confira antes do commit.

## Um pack novo

Nasce do `_modelo/`, que tem tudo o que o montador e o marketplace exigem, com
o que é do ofício marcado `<<preencher…>>`. No Claude Code, aberto na raiz, o
caminho curto é `/criar-pack`: ela entrevista você sobre o ofício e preenche.
À mão:

```
npm run novo-pack -- <slug> --nome "Nome do ofício"
npm run marcas <slug>             # o que falta — repita até “total: 0”
npm run painel                    # a página do painel, uma por pack
npm run montar -- --escrever      # gera skills do motor, painel e contrato
npm run montar                    # tem de sair tudo ✓
npm run provar -- --seco --pack <slug>
```

O `novo-pack` copia o molde para `<slug>/`, a fixture para `_prova/<slug>/` e
registra o pack no `marketplace.json`. As skills do motor não vêm no molde: o
montador as gera. Antes do PR, cada skill precisa de um roteiro em
`_prova/<slug>/roteiros/`.
