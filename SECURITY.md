# Segurança

Os packs rodam no seu computador, leem e escrevem numa pasta sua, e alguns
conectores guardam a sessão de um site em que você entrou (em
`~/.kapstan/navegador/`). Um defeito ali pode expor o que a pessoa tem de mais
sensível — a busca de emprego, a carteira de clientes, uma conversa.

## Como avisar

**Não abra questão pública.** Mande pelo
[aviso privado de segurança do GitHub](https://github.com/kapstanhq/oficina/security/advisories/new):
o que você achou, em que pack e versão, e como reproduzir. Não inclua dado real
de ninguém — troque por dado inventado.

Respondemos em até sete dias, e o conserto sai numa versão nova com o aviso
publicado depois que ela estiver disponível.

## O que conta

- O painel ou um servidor local aceitando pedido de fora da sua máquina, ou sem
  a chave da sessão.
- Uma skill ou o botão que lança o assistente tratando texto de uma página da
  web como instrução — um anúncio que manda "ignore as regras" e é obedecido.
- Um envio (mensagem, candidatura) que sai sem passar pela sua aprovação.
- Dado da sua pasta indo para qualquer lugar além do que você ligou.

## Versões

Só a versão mais nova recebe conserto. Para atualizar:
`/plugin marketplace update kapstan-oficina`.
