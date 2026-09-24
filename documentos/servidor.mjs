/**
 * OS DOCUMENTOS (D270) — o terceiro servidor do motor, ao lado do painel e dos
 * conectores, atrás do mesmo vigia.
 *
 * Ele faz uma coisa: um `.md` da base vira `.pdf` na base, pelo modelo do
 * pack e pelo navegador que a máquina já tem, e volta conferido — páginas
 * contra o teto do modelo, fonte embutida, links. Não edita texto, não
 * escreve fora da base e não escreve outra coisa que não `.pdf`: o texto é da
 * skill, e o PDF é derivado dele.
 *
 *   node documentos/servidor.mjs [--pack <pasta do pack>]
 *
 * `--pack` é da árvore-fonte, onde os modelos do ofício moram em
 * `oficina/<pack>/documentos/modelos/`. No pack instalado eles estão ao lado
 * deste arquivo, e ninguém passa nada.
 */
import { resolve } from "node:path";
import { servirPorStdio } from "../painel/nucleo/protocolo.mjs";
import { gerar, listarModelos, pastasDeModelos } from "./nucleo/documento.mjs";
import { acharNavegador } from "./nucleo/imprimir.mjs";

const registrar = (...partes) => process.stderr.write("[documentos] " + partes.join(" ") + "\n");
const i = process.argv.indexOf("--pack");
const PASTAS = pastasDeModelos(i >= 0 ? resolve(process.argv[i + 1] || "") : "");

const ferramentas = [
  {
    name: "documento_modelos",
    title: "Os modelos de documento",
    description:
      "Lista os modelos de documento deste pack — `{ nome, titulo, paginas_max }` — e se há " +
      "navegador para imprimir. Chame antes de prometer um PDF.",
    inputSchema: { type: "object", properties: {} },
    executar: async () => ({
      modelos: (await listarModelos(PASTAS)).map(({ nome, titulo, paginas_max }) => ({ nome, titulo, paginas_max })),
      navegador: acharNavegador() ? "sim" : "não — sem Chrome, Edge ou Chromium não há PDF",
    }),
  },
  {
    name: "documento_gerar",
    title: "Gerar o PDF de um documento da base",
    description:
      "Gera o PDF de um `.md` da base com um modelo do pack e grava AO LADO dele (ou em " +
      "`saida`, sempre `.pdf`, sempre dentro da base). Devolve `{ pdf, paginas, " +
      "paginas_max, cabe, fonte_embutida, links, kb }`. `cabe: false` quer dizer que passou " +
      "do teto do modelo: corte no MARKDOWN e gere de novo — nunca mexa no PDF. Ele não " +
      "edita texto: o `.md` é a fonte, e o PDF se refaz dele.",
    inputSchema: {
      type: "object",
      properties: {
        base: { type: "string", description: "o caminho inteiro da pasta da base" },
        origem: { type: "string", description: "o .md, relativo à base — ex.: curriculos/V-012-cv.md" },
        modelo: { type: "string", description: "o nome do modelo — ver documento_modelos" },
        saida: { type: "string", description: "opcional: o .pdf, relativo à base; sem ela, ao lado da origem" },
        idioma: { type: "string", description: "opcional: o idioma do texto, como \"en\" — vai no PDF para leitor de tela e triagem. Sem ele, o do modelo (pt-BR)" },
      },
      required: ["base", "origem", "modelo"],
    },
    executar: async (a) => {
      const r = await gerar({ ...a, pastas: PASTAS });
      registrar(`gerado ${r.pdf} · ${r.paginas} página(s)${r.cabe ? "" : " — passou do teto"}`);
      return {
        ...r,
        diga: r.cabe
          ? `O PDF está em ${r.pdf}: ${r.paginas} página(s).`
          : `Passou do teto: ${r.paginas} páginas, e o modelo pede até ${r.paginas_max}. Corte no markdown e gere de novo.`,
      };
    },
  },
];

servirPorStdio({
  servidor: { name: "documentos", title: "Documentos da Oficina", version: "0.1.0" },
  instrucoes:
    "Os documentos transformam um markdown da base em PDF, pelo modelo do pack, e conferem o " +
    "resultado. Gere quando a skill pedir o arquivo final (o currículo, por exemplo) e diga o " +
    "caminho do PDF. O texto continua no .md: para mudar o PDF, mude o .md e gere de novo.",
  ferramentas,
});
