# Pack de prospecção

**Onze skills de IA, em português, para quem prospecta o próprio cliente —
fundador, consultor, dono de agência.**

Elas escrevem quem vale a pena procurar, estudam o que é público sobre cada
empresa, escrevem a abordagem e lembram de quem sumiu — usando o que você já
contou antes, numa carteira de arquivos numa pasta do seu computador.

---

## Como instalar

Pelo Claude Code, o caminho curto é o marketplace:

```
/plugin marketplace add https://github.com/kapstanhq/oficina.git
/plugin install prospeccao@kapstan-oficina
```

O pack tem duas partes: as skills, que são arquivos de texto, e três servidores
locais em Node.js — o painel, os conectores e os documentos. Pelo marketplace as
duas entram juntas. Os servidores precisam do Node.js 20.19 ou mais novo:
confira com `node --version` e, se faltar, instale de https://nodejs.org.

Não usa o Claude Code? O [README da Oficina](../README.md#sem-o-claude-code) tem
a instalação por outros agentes e o caminho sem instalar: o pack inteiro num
prompt só, em
[`PROMPT.md`](PROMPT.md), para colar num Gem do Gemini ou num Projeto do
ChatGPT.

Depois de instalar, monte a carteira:

```
/prospeccao:comecar
```

---

## As onze ferramentas

| Comando | O que faz |
|---|---|
| `/prospeccao:comecar` | Monta a carteira e testa o que está conectado |
| `/prospeccao:perfil-de-cliente` | Escreve quem vale a pena procurar, e o que desqualifica |
| `/prospeccao:estudar-conta` | Lê o que é público sobre uma empresa e grava fato com origem, nunca opinião |
| `/prospeccao:escrever-abordagem` | Escreve a mensagem a um contato, e recusa quem pediu silêncio |
| `/prospeccao:o-que-fazer-hoje` | Monta a lista do dia a partir da carteira |
| `/prospeccao:retomar-contato` | Acha quem parou de responder e escreve a volta com uma novidade concreta |
| `/prospeccao:cobrar-o-que-falta` | Cobra quem ficou de mandar e não mandou |
| `/prospeccao:importar-a-conversa` | Enche a carteira com o que já está no seu WhatsApp |
| `/prospeccao:organizar-carteira` | Guarda o que chegou e arquiva o que morreu |
| `/prospeccao:laudo-da-carteira` | Diz o que está errado na carteira, sem mexer nela |
| `/prospeccao:completar-ficha` | Procura o que falta na ficha de uma conta nas fontes que você tem, e grava com a origem |

E uma que o painel chama por você: `/prospeccao:gravar-o-que-marquei` grava na
carteira o que você marcou nele, e mais nada.

---

## Onde este pack para

- **Não dispara em massa.** Uma pessoa por vez, uma mensagem por vez; nenhuma
  skill aceita mais de um destinatário por chamada.
- **Não escreve para quem pediu silêncio** — nem rascunho. A lista
  `nao-perturbe.md` se compara por nome, e-mail, telefone e domínio, e dela
  nada sai.
- **A primeira mensagem não sai por WhatsApp.** O WhatsApp recusa mensagem para
  quem nunca falou com você por lá; a primeira vai por e-mail ou LinkedIn.
- **Fora do que é público, não sabe.** Faturamento, orçamento, quem assina: fica
  `?` e vira pergunta na reunião.
- **O CRM não conecta sozinho.** Se o seu liberar a API, a skill lê por ali; se
  não, exporte para planilha.
- **Não manda sem você ver.** O texto inteiro e o destinatário aparecem antes, e
  nada sai enquanto você não disser que sai.
- **Não decide o que é seu.** Preço, tamanho do projeto, se a conta serve: ela
  mede contra o seu perfil e para.

A base legal (LGPD) está escrita dentro do pack, em [`CONTRATO.md`](CONTRATO.md),
seção 3.1.

---

## Licença

MIT.
