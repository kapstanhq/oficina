import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { RAIZ, vistasDoPack, packsDoMarketplace } from "./vistas-do-pack.mjs";

/**
 * Compila `painel/app/entrada.js` (e os `.svelte` que ele importa) para
 * `painel/app/entrada.generated.js` — mais o `.css` que o esbuild extrai dos
 * blocos `<style>` dos componentes. E, para cada pack do marketplace que tem
 * `<pack>/painel/componentes/`, um segundo bundle,
 * `painel/app/entrada.generated.<pack>.js`, com as vistas dele dentro.
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
 *
 * ── A ENTRADA DO PACK É GERADA, E NÃO MORA NO DISCO ────────────────────
 * Ela é a `entrada.js` com uma diferença: passa `vistasDoPack` ao `Painel`.
 * O componente de pack alcança o comum por `@oficina/painel/…` (o alias
 * abaixo), sem depender de onde o pack mora em relação a `painel/`.
 */
const APP = join(RAIZ, "painel", "app");
const barra = (c) => c.replace(/\\/g, "/");

const opcoesComuns = (watch) => ({
  bundle: true,
  format: "esm",
  minify: true,
  sourcemap: watch,
  plugins: [esbuildSvelte({ compilerOptions: { generate: "client" } })],
  alias: { "@oficina/painel": APP },
  logLevel: watch ? "info" : "warning",
});

/**
 * Um bundle. `pack`: a pasta do pack (a que tem `painel/componentes/`), ou
 * vazio para o painel comum. `saida`: o `.js`; o `.css` sai ao lado, com o
 * mesmo nome. Devolve os nomes das vistas do pack que entraram.
 */
export async function compilarPainel({ pack = "", saida, watch = false }) {
  const opcoes = { ...opcoesComuns(watch), outfile: saida };
  const { vistas, erros } = pack ? vistasDoPack(pack) : { vistas: [], erros: [] };
  if (erros.length) throw new Error(`${pack}/painel/componentes: ${erros.join(" · ")}`);
  if (!vistas.length) {
    opcoes.entryPoints = [join(APP, "entrada.js")];
  } else {
    opcoes.stdin = {
      resolveDir: APP,
      sourcefile: "entrada-do-pack.js",
      contents: [
        `import { mount } from "svelte";`,
        `import Painel from "./Painel.svelte";`,
        ...vistas.map((v, i) => `import V${i} from ${JSON.stringify(barra(v.arquivo))};`),
        `mount(Painel, { target: document.getElementById("painel"), props: { vistasDoPack: {`,
        ...vistas.map((v, i) => `  ${JSON.stringify(v.nome)}: V${i},`),
        `} } });`,
      ].join("\n"),
    };
  }
  if (watch) {
    const ctx = await esbuild.context(opcoes);
    await ctx.watch();
    return ctx;
  }
  await esbuild.build(opcoes);
  return vistas.map((v) => v.nome);
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  if (process.argv.includes("--watch")) {
    await compilarPainel({ saida: join(APP, "entrada.generated.js"), watch: true });
    console.log("svelte-build-painel · observando painel/app/** (o painel comum)");
  } else {
    await compilarPainel({ saida: join(APP, "entrada.generated.js") });
    console.log("✓ svelte · o painel comum");
    for (const { nome, pasta } of packsDoMarketplace()) {
      const saida = join(APP, `entrada.generated.${nome}.js`);
      if (!vistasDoPack(pasta).vistas.length) {
        /* pack sem componentes usa o bundle comum: o do pack que deixou de
           ter componentes não pode ficar para trás e ganhar do comum */
        for (const n of await readdir(APP)) {
          if (n.startsWith(`entrada.generated.${nome}.`)) await rm(join(APP, n));
        }
        continue;
      }
      const vistas = await compilarPainel({ pack: pasta, saida });
      console.log(`✓ svelte · ${nome} · as vistas do pack: ${vistas.join(", ")}`);
    }
  }
}

