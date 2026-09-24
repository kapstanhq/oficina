<!-- CÓPIA GERADA · não edite: a fonte é oficina/_motor/ ou oficina/<pack>/contrato/, e `npm run oficina -- --escrever` refaz. -->

### 4.4 · O arquivo de vaga — `vagas/V-014-vertice-saude.md`

Teto: **60 linhas**.

```markdown
# V-014 (Técnica de Enfermagem UTI, Vértice Saúde)

link: https://verticesaude.gupy.io/jobs/8812001  ← gupy, 2026-09-07
também em: https://www.linkedin.com/jobs/view/4000000001  ← linkedin-vagas, 2026-09-08
estado: aberta  ← gupy, 2026-09-13
etapa: salva · desde 2026-09-08
empresa: Vértice Saúde  ← gupy, 2026-09-07
cargo: Técnico(a) de Enfermagem — UTI Adulto  ← gupy, 2026-09-07
regime: presencial no Recife, bairro da Boa Vista  ← gupy, 2026-09-07
contrato: CLT  ← gupy, 2026-09-07
jornada: 12x36, plantão noturno  ← gupy, 2026-09-07
faixa: ?  ← a vaga não publica
salário relatado: R$ 3.100 a 3.900 por mês, média R$ 3.450 · Técnico de Enfermagem, 11 relatos de 2024 a 2026  ← _bruto/2026-09-07-glassdoor-vertice-saude.md
idioma: não pede  ← gupy, 2026-09-07
publicada: 2026-09-05  ← gupy, 2026-09-07
inscrições até: 2026-09-20  ← gupy, 2026-09-07
contato: ?
encaixe: alto  ← candidato, 2026-09-08

## O que a vaga pede
- COREN ativo em Pernambuco  ← gupy, 2026-09-07
- vivência em UTI adulto “é diferencial”; estágio conta  ← gupy, 2026-09-07
- processo: prova técnica, dinâmica, entrevista com a coordenação de enfermagem  ← gupy, 2026-09-07

## O que pesa a favor
- é o primeiro papel da lista do perfil, e o 12x36 é a jornada que eu aceito  ← perfil.md
- o estágio foi em UTI adulto, com seis meses de plantão supervisionado  ← trajetoria.md

## O que pesa contra
- não diz a faixa, e o salário relatado fica perto do piso  ← candidato, 2026-09-08

## Candidatura
- nada ainda.

## Combinado
- nada ainda.

## Histórico
- 2026-09-07 entrou pela busca  ← _bruto/2026-09-07-busca.md
- 2026-09-08 salva  ← candidato, 2026-09-08
```

`estado:` é da VAGA, e é um destes: `aberta`, `fechou`. `etapa:` é da SUA
candidatura, e é uma das seis da seção 4.3 — **é aqui que ela mora**, e o
`funil.md` só reflete. Mudou a etapa, mudam os dois na mesma passada, e a data
de `desde` é a da mudança. Vaga que `fechou` numa etapa viva é caso de aposentar
(regra 3): conferir o estado é a primeira coisa que `/vagas:buscar-vagas` faz
com o que já está na busca.

`contrato:` é o vínculo que a vaga oferece, com a palavra da lista —
`CLT`, `PJ`, `temporário`, `estágio`, `aprendiz`, `autônomo`, `intermitente`,
`cooperado`, `concurso` —, e se confere contra o `contrato:` do `## Aceito` do
perfil e a linha dele no `## Quanto`. `jornada:` vem logo abaixo, em texto
livre e como o anúncio a diz: `44h seg–sex`, `12x36`, `6x1`, `meio período`,
`flexível`. Para muita profissão é ela, e não o regime, que decide se a vaga
cabe na vida — pesa contra o perfil como qualquer outro campo, e só corta
sozinha se o `## Descarto` a nomear (`escala 6x1`, `plantão de 24 horas`).

`idioma:` é `não pede`, ou a língua e o nível que o anúncio exige —
`inglês avançado`, `espanhol básico`; duas línguas, separadas por ` · `. O
nível se lê contra o `## Idiomas` da trajetória, e o que a vaga pede acima dele
vai para `## O que pesa contra`, dito assim. `?` é o anúncio que não fala do
assunto — e não é o mesmo que `não pede`.

`inscrições até:` é a data em que a vaga deixa de aceitar candidatura, quando o
anúncio a traz — e é o único prazo deste arquivo que sobe sozinho para o
`hoje.md`. `?` é o comum.

`encaixe:` é `alto`, `médio` ou `baixo`, e é **julgamento** — a única linha do
cabeçalho que não é fato apurado. Por isso as duas seções abaixo dele existem:
`## O que pesa a favor` e `## O que pesa contra` são o que sustenta a palavra, e cada
linha aponta para o `perfil.md`, para a `trajetoria.md` ou para quem julgou.
Encaixe sem razão escrita é nota de aplicativo, e ninguém confia numa.

`## Candidatura` guarda **o que saiu**: a data, por onde (formulário, e-mail,
indicação), com que currículo, e o arquivo de `_bruto/` com as respostas como
foram enviadas. Seção 12 diz quando essa linha pode ser escrita — e não é
quando o formulário ficou pronto.

`salário relatado:` é o que quem trabalha na empresa contou ao Glassdoor para o
cargo mais perto do da vaga: a faixa e a média da remuneração total por mês, o
cargo como a página o chama, quantos relatos e de que anos. **Não é a faixa.**
`faixa:` é o que a vaga publica; este é o que funcionários relataram, de
senioridade e data que só a página do cargo diz. Os dois não se misturam: ele
nunca sobe para `faixa:`, e nunca entra numa mensagem como se fosse a faixa
deles — "vi que vocês pagam" é o tipo de frase que encerra a conversa.

Quem o procura é `/vagas:triar-vagas` (a vaga que ela lê) e
`/vagas:completar-ficha` (a vaga que o candidato pediu), e o caminho é este:

```
1  o _bruto/           `AAAA-MM-DD-glassdoor-<empresa>.md` de até 30 dias serve
                       a toda vaga da mesma empresa — não se relê a página
2  o navegador         o Glassdoor barra a ferramenta de web (403) e abre no
                       navegador. A sessão dele está no `conectores_estado`,
                       em `navegador.sessoes.glassdoor`: `logada` vê a lista
                       inteira; `vencida` ou `sem-sessao` vê o que é público,
                       e diz UMA vez que o login se faz na tela Integrações
                       do painel. Sem navegador ligado: `?` e a razão
3  a página da empresa glassdoor.com.br, a de salários (`/Salário/<Empresa>-
                       Salários-E<id>.htm`), pela busca do site ou da web.
                       Homônimo existe — a Vértice Saúde do Recife divide o
                       nome com uma Vértice Saúde de Lisboa: confira as cidades
4  a página do cargo   `…/Salário/<Empresa>-<Cargo>-Salários-E<id>_D_KO….htm`,
                       a partir do cargo da lista. É ela que decide: traz cada
                       relato com anos de experiência, cidade e data, e abre
                       mesmo sem sessão. Sem sessão, a página da empresa
                       mostra só os dez cargos com mais relatos: o cargo que
                       ficou de fora se acha montando o endereço dele
5  o cargo             o mesmo da vaga; não havendo, o vizinho mais perto
                       (Técnico de Enfermagem para Técnica de Enfermagem UTI),
                       nomeado na linha. Nada perto: `?  ← glassdoor,
                       <data>: a <empresa> não tem relato de <cargo>`
```

O que vai na linha: a faixa e a média por mês, o cargo, quantos relatos e de
que anos, e — quando a vaga é sênior e os relatos variam — o do relato mais
experiente. As "Perguntas frequentes" do pé da página NÃO valem: na da Vértice
Saúde elas davam "R$ 3.467 por ano" para uma tabela de R$ 3.100 a 3.900 por mês.
As páginas lidas vão para o `_bruto/` antes de virar campo, como tudo.

`?` com a razão ao lado é o comum, e não se resolve com número de outro lugar:
agregador que esconde a empresa (Jobgether, Toptal), empresa sem página,
navegador desligado. A média do cargo no país é de outras empresas e não entra
no campo; se ajudar, vai numa linha de `## O que pesa contra`, dita como média
do mercado e com a fonte.

**Como ele pesa** — contra o `## Quanto` do perfil, na triagem. Abaixo do piso,
vai para `## O que pesa contra` como "o salário relatado fica abaixo do piso",
sem o número do piso (a pretensão não aparece por extenso, seção 3.1); passando
dele, pode ir para `## O que pesa a favor`. **Pesa e não corta**, a não ser que
o `## Descarto` do perfil diga — e poucos relatos, ou relatos antigos, dizem
isso na mesma linha.

`contato:` aponta para o arquivo de quem fala pela vaga — `P-003 (Bruno Sato)`
—, e `?` é o estado normal: a maioria das vagas nunca ganha um nome.
