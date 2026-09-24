<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

### 12.1 · A candidatura, e quem aperta o botão

Candidatar-se é responder perguntas **em seu nome**, numa conta que é sua, num
lugar de onde não dá para voltar atrás. `/vagas:candidatar` prepara tudo — e
**quem decide é você, sempre.** O que muda entre uma busca e outra é só uma
coisa: se o dedo que aperta é o seu ou o da skill, depois do seu sim.

```
1  lê a vaga, o perfil, a trajetória e `## O que NÃO se diz`
2  escolhe o currículo — o da vaga, ou manda montar antes
3  junta o que o formulário pergunta, e responde o que a trajetória
   responde. O que ela não responde fica `?` — é o campo que só você sabe
4  MOSTRA tudo junto: a vaga, as respostas campo a campo, o texto livre.
   No painel é uma tela só; sem ele, é o mesmo em texto
5  com o navegador ligado, preenche o formulário na sua frente
6  quem aperta ENVIAR é a linha `envio de candidatura:` do `INDICE.md`
```

**A linha mora em `## Como eu trabalho`**, e tem dois valores:

```
envio de candidatura: eu aperto
    o padrão. A skill para com o botão de enviar na tela, e diz o que
    falta. Você envia. E só quando você DISSER que enviou, a vaga vira
    `candidatada` e `## Candidatura` ganha a linha

envio de candidatura: aperta depois de eu aprovar no painel
    o sim daquela candidatura — dado na tela que mostra a vaga, as
    respostas campo a campo e o texto livre — É a decisão. Só então a
    skill aperta “Enviar candidatura”, CONFERE na página que o envio foi
    confirmado, e registra
```

**Sem painel na sessão, a skill para antes do botão**, como no primeiro regime:
mostra a tela inteira em texto, na mesma ordem, e quem aperta é você. O envio
por você só existe com a aprovação dada na tela do painel — é o que a promessa
pública do pack diz, e um “sim” no terminal não a substitui.

**A página não confirmou o envio?** Não se registra nada. A skill diz o que
viu, e a caixa vai para `## Parado` no `hoje.md`. “Apertei” não é “saiu” — só
a confirmação do portal é, e é ela que a linha de `## Candidatura` afirma.

#### O que não muda em regime nenhum

```
uma candidatura por vez        uma vaga por execução. “Aplica nas dez que
                               valem” são dez execuções, com dez telas
a tela inteira antes           a vaga, as respostas campo a campo, o texto
                               livre. É a leitura que o §3.1 exige antes de
                               algo sair em seu nome
nada em lote                   o sim é DAQUELA candidatura. Aprovar várias
                               de uma vez não existe, e não é esquecimento:
                               é o que impede a tela de virar carimbo
o teto por dia                 `quantas candidaturas por dia:`, da seção 4.1
o `?` continua seu             pergunta que só você sabe nunca é respondida
                               por aproximação, em regime nenhum
dado sensível é seu            CPF, endereço, nascimento: na hora, por você.
                               A skill não pergunta o valor e não o guarda.
                               Gênero, raça, pronomes: só o que você declarou
                               no `## Quem sou` (§3.1)
```

**`modo: automatico` NÃO liga isto.** São duas linhas diferentes e duas
perguntas diferentes: o **modo** decide quanto a skill pergunta no caminho; o
**envio de candidatura** decide quem aperta. Um `automatico` com `eu aperto`
prepara sozinho e para com o botão na tela; um `copiloto` com
`aperta depois de eu aprovar no painel` pergunta no caminho e aperta depois do
sim.

#### Por que o padrão é `eu aperto`, e por que existe o outro

Os termos de quase toda rede e de quase todo portal proíbem automação agindo
dentro de uma conta logada, e o que se arrisca é a conta — que, para quem
procura emprego, é o ativo. Programa que preenche devagar, com você olhando, e
não aperta nada é indistinguível de você usando um preenchedor de formulário.
Programa que se candidata a quarenta vagas numa hora não é.

O segundo regime não apaga esse risco: ele o põe no seu nome, que é onde ele
sempre esteve. Uma por vez, com a tela inteira lida antes e o teto do dia
valendo, é a mesma cadência de uma pessoa — o que muda é quem executa o último
clique de uma decisão que já foi tomada. **Informar em vez de impedir**: o
aviso aparece **uma vez**, no ato de trocar a linha, e depois a ferramenta
obedece sem sermão.

**Quem troca a linha é você** — editando o `INDICE.md`, ou pedindo à skill,
que mostra o aviso e pede a confirmação antes de escrever. A skill não a troca
por conta própria, não a troca “só desta vez”, e não a troca para destravar
uma execução.

#### O que se guarda, e o que “ficou pronto” quer dizer

**“Ficou pronto” não é “foi”.** A linha de `## Candidatura` registra o que
SAIU. Formulário preenchido e não enviado não muda etapa; vira uma caixa em
`## Parado`, no `hoje.md`, com o que falta. Vale igual nos dois regimes — no
segundo, o que fica travado é a candidatura que a página não confirmou.

E a linha diz quem apertou, porque é isso que ela afirma:

```
eu aperto      …  ← candidato, 2026-09-14
               e o `_bruto/` abre com `enviada: 2026-09-14 — dito pelo
               candidato`
aperta depois  …  ← skill, 2026-09-14
do sim         e o `_bruto/` abre com `enviada: 2026-09-14 — enviada pela
               skill, depois do sim de 2026-09-14 14:32`
```

**Pergunta de formulário que pede fato que a trajetória não tem** — “anos de
experiência com X”, “pretensão”, “nível de inglês” — não se responde por
aproximação. Pretensão vem do `perfil.md` e passa pela sua leitura; nível de
idioma sai IGUAL ao da trajetória; o que não está em lugar nenhum vai para
você como `?`.

**O que se guarda da candidatura**, em `_bruto/AAAA-MM-DD-candidatura-V-012.md`:
as perguntas e as respostas como foram enviadas, o currículo usado, por onde
saiu. É o que você relê na véspera da entrevista — e é o que impede a resposta
de amanhã de contradizer a de hoje.

---
