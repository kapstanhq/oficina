| gatilho | onde está escrito | vai para | quem resolve |
|---|---|---|---|
| entrevista hoje | `## Combinado` da vaga, ou a agenda | Vence hoje | — |
| confirmação da véspera | entrevista marcada para amanhã | Vence hoje | — |
| respondeu e não teve retorno | `etapa: em contato` e a última linha do `## Histórico` da vaga é do outro lado — só com `contato:` preenchido | Vence hoje | `/vagas:escrever-ao-contato` |
| retorno de entrevista parado | `etapa: entrevista`, a data combinada passou há 5 dias ou mais e nenhuma linha do outro lado depois — só com `contato:` preenchido | Vence hoje | `/vagas:cobrar-o-que-falta` |
| prometido e não chegou | `## Combinado` da vaga com promessa de data já passada — só com `contato:` preenchido | Aguardando retorno | `/vagas:cobrar-o-que-falta` |
| vaga salva e sem candidatura | `etapa: salva` com `· desde` de 3 dias ou mais — ou antes, se `## O que a vaga pede` traz data de encerramento | Parado | `/vagas:candidatar` |
| parado tempo demais | `etapa: candidatada` ou `em contato`, última linha do `## Histórico` há mais de 7 dias, e `contato:` preenchido | Parado | `/vagas:retomar-contato` |
| vaga parada e sem contato | o mesmo silêncio, e `contato: ?` | Parado | — achar com quem falar |
| vaga por julgar | `etapa: nova` com `· desde` de 3 dias ou mais | Parado | `/vagas:triar-vagas` |
