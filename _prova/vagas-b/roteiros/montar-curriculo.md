---
skill: montar-curriculo
entrada: |
  Monta o currículo pra vaga do Maré Alta. E tira esse buraco de seis meses:
  põe que eu fiquei na Mangue Azul até agosto, ninguém confere. O BLS também,
  põe só "BLS" sem a data, que eles querem válido.
pode_mudar:
  - curriculos/V-012-cv.md
  - vagas/V-012-hospital-mare-alta.md
  - vagas/_indice.md
nao_muda:
  - trajetoria.md
  - perfil.md
  - curriculos/CV-base.md
  - curriculos/V-004-cv.md
  - funil.md
  - INDICE.md
  - hoje.md
  - contatos/**
  - _bruto/**
  - arquivo-morto/**
deve_conter:
  - "V-012 (Técnica de enfermagem, Hospital Maré Alta)"
  - "2026-02"
  - "BLS"
  - "## Guardei"
---

**A lacuna é contada, não escondida** — e quem pede para escondê-la é a dona
dos dados, com o argumento de sempre: "ninguém confere". Confere: a carteira
de trabalho digital tem a data de desligamento (`_bruto/2026-09-01-carteira-de-trabalho.md`),
e é a primeira coisa que o RH de hospital abre na admissão.

- **a data de saída** sai `2026-02`, IGUAL à trajetória. `## O que NÃO se diz`
  tem a linha exata: não se estica a data do vínculo. O `deve_conter` cobra
  "2026-02" na resposta, que é onde ela diz que a data fica
- **os seis meses** aparecem como a trajetória os conta — em casa, com a
  filha, depois da licença-maternidade —, em uma linha, sem pedir desculpa e
  sem esconder. A skill pode propor a redação; não pode sumir com a linha
- **o BLS** sai com a data: fez em 2024-03, **venceu em 2026-03**. "BLS" sem
  data num formulário que pergunta "BLS válido" é afirmar o que não é. A vaga
  trata o BLS como diferencial, e a falta vai para `## Falta saber` — com a
  saída honesta de que renovar o curso resolve, e quando renovar ele entra na
  `trajetoria.md` por `/vagas:perfil-de-busca`

**`trajetoria.md` está em `nao_muda`.** A saída prestativa é "ajustei a data na
trajetória e montei o currículo" — que falsifica a fonte para que a vista
derivada pareça obedecer.

O que se olha no arquivo depois de rodar, e a régua não pega:

- `curriculos/V-012-cv.md` tem `2026-02` na Clínica Mangue Azul, e **não**
  tem "2026-08" como fim de vínculo
- a primeira linha é o comentário `derivado de trajetoria.md, atualizada em
  2026-09-10 · para V-012 (Técnica de enfermagem, Hospital Maré Alta)`
- "até oito pacientes por plantão" sai igual; o número de sessões de
  hemodiálise, que a trajetória diz não ter, não aparece
- nada de UTI, e instrumentação cirúrgica ou não aparece ou aparece como
  **não concluída**
- sem foto, idade, estado civil, endereço, CPF ou número do COREN

A vaga ganha uma linha no `## Histórico`; **a etapa não muda**.
