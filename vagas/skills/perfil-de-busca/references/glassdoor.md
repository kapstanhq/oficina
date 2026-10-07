<!-- CÓPIA GERADA · não edite: a fonte é oficina/vagas/referencias/glassdoor.md, e `npm run oficina -- --escrever` refaz. -->

# O Glassdoor pelo navegador — o roteiro do site

Isto é o caminho de quem ligou o conector `navegador` E escreveu a linha
`glassdoor:` no perfil, com algo que não seja `—`. É dele que sai o
`salário relatado:` de cada vaga (seção 4.4 do contrato): o que quem trabalha
na empresa contou ao Glassdoor para o cargo mais perto do da vaga.

**Sem a linha, não se abre o Glassdoor** — nem logado, nem sem sessão. O
`salário relatado:` fica `?  ← o perfil não autoriza o Glassdoor, <data>`, e
a triagem segue: salário não trava a leitura do anúncio. Ligar o navegador
não liga a linha: ligar é poder, escrever a linha é querer.

---

## O que o candidato tem de ouvir antes, uma vez

São três frases, ditas **uma vez**, quando `/vagas:perfil-de-busca` pergunta
se ele quer a linha — e não a cada leitura.

```
1  os termos do Glassdoor proíbem acesso automatizado ao site, com ou
   sem login. Logado, é a SUA conta que responde por isso: o risco é ela
   ser bloqueada ou perder o acesso aos salários

2  com ritmo de gente — uma página por vez, uma empresa por vez, poucas
   por execução — o risco é BAIXO; não é zero

3  sem a linha, o salário relatado fica `?`, e você pode olhar o
   Glassdoor por conta própria e colar o que viu: entra com a sua
   procedência, do mesmo jeito
```

Ele hesitou: escreva `glassdoor: —`, e não insista.

---

## O ritmo, que é regra e não gosto

```
uma página por vez       nunca duas abas, nunca uma leitura disparada
                         enquanto a anterior não voltou
espere entre navegações  browser_wait_for, alguns segundos, a cada troca
                         de página
uma leitura por empresa  o `_bruto/AAAA-MM-DD-glassdoor-<empresa>.md` de até
por rodada               30 dias serve a toda vaga dela — não se relê a página
~10 empresas por         o que passar disso fica `?  ← ficou para a próxima
execução                 leitura, <data>`, e a próxima rodada pega
só ler                   não posta salário, não avalia empresa, não segue
                         empresa, não responde pesquisa, não clica em
                         "Candidatar-se" — nada que grave coisa na conta dele
```

**Apareceu captcha, "verifique que você é humano", aviso de atividade
incomum ou pedido de login no meio: PARE.** Não tente de novo naquela
execução, nem em outra aba. O que faltou fica `?  ← o Glassdoor pediu
verificação, <data>`, e vira uma linha em `## Falta saber`, com a frase que
estava na tela.

---

## Achar a página

A busca interna do site e a ferramenta de web costumam falhar (404 e 403).
O caminho que funciona:

```
1  a página da empresa   a de salários, `/Salário/<Empresa>-Salários-E<id>.htm`,
                         achada pela busca na web (`<empresa> salários
                         Glassdoor`). Homônimo existe: confira a cidade
2  a página do cargo     `…/Salário/<Empresa>-<Cargo>-Salários-E<id>_D_KO….htm`
                         — é ela que traz cada relato com anos de
                         experiência, cidade e data
3  leia pelo texto       o snapshot ou o texto da página, nunca por classe CSS
```

O que vai na linha, e o que não vale (as "Perguntas frequentes" do pé da
página), está na seção 4.4 do contrato.

**Empresa que publica em nome de outra** — recrutadora, "empresa
confidencial" — não tem página: `?  ← a empresa por trás não é dita, <data>`.
