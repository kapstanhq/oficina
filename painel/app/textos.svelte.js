/* os textos VIVOS da página: um `$state` só, trocado no lugar quando o
   `acoes.json` chega — quem lê `textos.x` num template ou num `$derived`
   (inclusive dentro de `rota.js`) redesenha sozinho */
import { TEXTOS_PADRAO, textosCom } from "./textos.js";

export const textos = $state({ ...TEXTOS_PADRAO });

export function aplicarTextos(doPack = {}) {
  Object.assign(textos, textosCom(doPack));
}
