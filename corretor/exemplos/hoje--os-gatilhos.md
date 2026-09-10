| gatilho | onde está escrito | vai para | quem resolve |
|---|---|---|---|
| visita hoje | `## Combinado` do cliente, ou a agenda | Vence hoje | — |
| confirmação da véspera | visita marcada para amanhã | Vence hoje | `/corretor:montar-visita` |
| lead sem resposta | `etapa: novo lead` e nenhuma fala do corretor depois da entrada | Vence hoje | `/corretor:responder-lead` |
| proposta parada | `etapa: proposta` com `· desde` de dois dias ou mais | Vence hoje | — |
| exclusividade acabando | `exclusividade: sim, até <data>`, faltando 7 dias ou menos | Vence hoje | — |
| prometido e não chegou | `## Combinado` com promessa de data já passada | Prometido e não chegou | `/corretor:documentos-do-negocio` |
| papel que trava | `conferida: não` ou `pendências: ?` num imóvel com cliente em `visitou` ou `proposta` | Travado | `/corretor:conferir-matricula` |
| parado tempo demais | sem manifestação dele há mais de 7 dias, em etapa viva | Travado | `/corretor:retomar-contato` |
| imóvel sem anúncio | `estado:` à venda ou para alugar, e `link:` ausente ou `?`, ou `## O que vende` vazio, há 7 dias ou mais | Travado | `/corretor:anunciar-imovel` |
