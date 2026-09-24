import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";

/**
 * Compila `painel/app/entrada.js` (e os `.svelte` que ele importa) para
 * `painel/app/entrada.generated.js` — mais o `.css` que o esbuild extrai dos
 * blocos `<style>` dos componentes.
 *
 * ── TERCEIRO SCRIPT DE SVELTE, E ELE TEM CONTRATO PRÓPRIO ──────────────
 * `svelte-build.mjs` compila as ilhas do SITE (produção, dentro de `site/`) e
 * `svelte-build-estudio.mjs` compila a bancada (nunca vai ao ar). Este
 * compila uma coisa que não é nenhuma das duas: um alvo que vira ARQUIVO
 * INSTALADO na máquina de terceiro, por `/plugin install`.
 *
 * Três coisas mudam por causa disso:
 *
 *   `minify: true` SEMPRE, e não só fora do `--watch`. O HTML final é
 *   copiado para dentro de cada pack e vive no repositório público — o peso
 *   é pago por quem instala, e ele não tem por que carregar o nome das
 *   nossas variáveis.
 *
 *   `sourcemap: false` fora do `--watch`, pelo mesmo motivo: um `.map` de
 *   1,5 MB (o do Estúdio tem esse tamanho) não pode virar parte de um plugin.
 *
 *   `external: []` — nada fica de fora. O Estúdio deixa `/js/*` e
 *   `/estudio/lib/*` externos porque o servidor de dev os resolve em tempo
 *   de execução; aqui não há servidor de dev do outro lado, e o que não
 *   estiver dentro do arquivo não existe.
 */
const ENTRADA = "painel/app/entrada.js";
const SAIDA = "painel/app/entrada.generated.js";
const watch = process.argv.includes("--watch");

const opcoes = {
  entryPoints: [ENTRADA],
  outfile: SAIDA,
  bundle: true,
  format: "esm",
  minify: true,
  sourcemap: watch,
  plugins: [esbuildSvelte({ compilerOptions: { generate: "client" } })],
  logLevel: "info",
  /* o painel importa `marcacao.js` de `site/svelte/casca/` — o MESMO
     escapador que a Oficina usa. Caminho relativo, então o esbuild o resolve
     e o embute; não há nada a marcar como externo. */
};

if (watch) {
  const ctx = await esbuild.context(opcoes);
  await ctx.watch();
  console.log("svelte-build-painel · observando painel/app/**");
} else {
  await esbuild.build(opcoes);
}
