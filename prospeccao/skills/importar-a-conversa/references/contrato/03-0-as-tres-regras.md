<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

## 3 · As três regras

### Regra 1 · Se dá para derivar, não se duplica

O arquivo guarda **fato**; `_bruto/` guarda a **origem**. A conversa inteira
nunca entra no arquivo do contato — entra em `_bruto/`, e o arquivo fica com as
seis linhas que ela produziu.

Sem isso o arquivo cresce sem fim e a skill relê quarenta quilobytes para achar
um telefone. Os tetos da seção 9 são essa regra virada número.

Vista derivada (`_indice.md`, `funil.md`, `hoje.md`) pode repetir um campo do
arquivo — é para isso que ela serve. O que não pode é a vista virar a única
cópia de alguma coisa: tudo que está nela tem de existir no arquivo dono.

### Regra 2 · Nada entra sem procedência

Todo campo leva de onde veio e quando. O formato é fixo — valor, dois espaços,
seta, origem, vírgula, data:

```
preço: R$ 520.000  ← link, 2026-08-12
telefone: +55 51 99999-0000  ← _bruto/2026-08-12-linkedin-carla.md
área: 120 m²  ← ficha colada, 2026-08-12
prazo: quer mudar até dezembro  ← prospector, 2026-08-19
```

As origens possíveis, e não há outras:

```
link              a página da conta que o prospector colou (a URL fica no campo link:)
ficha colada      o texto da ficha, quando o site não devolveu nada
_bruto/<arquivo>  conversa, e-mail ou documento que está em _bruto/
prospector          o próprio prospector disse agora, na conversa com a skill
site              a página da conta, lida com o link no campo site:
LinkedIn          o perfil público da conta ou do contato
```

**O que não se apurou entra como `?`.** Nunca uma estimativa, nunca “por volta
de”, nunca um número de conta que se pareça. O `?` pode levar na procedência o que
resolve ele:

```
funcionários: ?  ← olhar no LinkedIn da conta
faturamento: ?  ← não é público; perguntar na reunião
e-mail: ?
```

Campo inventado com cara de apurado é pior que campo vazio: o prospector repassa
para o contato e descobre na reunião. E o `?` é a linha mais útil do arquivo —
é o que a próxima skill vai perguntar.

**Fato novo que contradiz o gravado:** o novo vale, com a procedência dele, e
o antigo desce para `## Histórico` com a procedência que tinha — nada se
apaga. Em copiloto a skill mostra os dois antes de trocar; em automático troca
e declara (seção 5).

Data sempre em `AAAA-MM-DD`. É a única forma que ordena sozinha e em que
`12/08` não vira agosto de um lado e dezembro do outro. Ao FALAR com o prospector,
escreva `12 de agosto`; ao ESCREVER no arquivo, `2026-08-12`.

### Regra 3 · O que morre é aposentado com data e motivo

Gaveta, não lixeira. **Nenhuma skill apaga arquivo da carteira, nunca.**

Aposentar é isto, nesta ordem:

1. no alto do arquivo, logo abaixo do título, entra uma linha:
   `aposentado: 2026-08-19 · motivo: disse não por escrito, em 2026-08-19`
2. o arquivo é movido para `arquivo-morto/contas/` ou `arquivo-morto/contatos/`
3. no `_indice.md`, a linha sai da tabela de cima e entra em `## Arquivo morto`,
   com o desfecho em uma linha
4. some do `funil.md` e do `hoje.md`, que são vistas dos vivos

Quando aposentar, sem inventar outros critérios: conta que disse não por escrito, que fechou
com outro fornecedor, que saiu do perfil ou que está sem responder há
**90 dias**; contato que pediu silêncio, ou que saiu da empresa. Contato parado há menos que isso
não é morto — é assunto de `/prospeccao:retomar-contato`.

Aposentar em modo automático é permitido para o prazo de 90 dias. Aposentar por
qualquer outro motivo é decisão do prospector, mesmo no automático.

---
