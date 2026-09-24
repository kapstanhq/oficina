/**
 * A PORTA DE DEPURAÇÃO DO CHROME, falada à mão (D272).
 *
 * O painel precisa de uma coisa só dela: os cookies de uma janela de login,
 * por `Storage.getCookies`. O protocolo é JSON sobre WebSocket, e o Node 20
 * não traz cliente de WebSocket sem flag — então o aperto de mão e os
 * quadros estão aqui, no tamanho do que se usa: texto, mensagem em pedaços,
 * ping e fechamento. Sem dependência, pelo mesmo motivo do `protocolo.mjs`.
 */
import { request } from "node:http";
import { randomBytes } from "node:crypto";

/** um quadro de TEXTO do cliente — mascarado, como a RFC 6455 exige */
function quadro(texto, opcode = 0x1) {
  const dados = Buffer.from(texto, "utf8");
  const n = dados.length;
  const cabeca = n < 126 ? Buffer.from([0x80 | opcode, 0x80 | n])
    : n < 65536 ? Buffer.from([0x80 | opcode, 0x80 | 126, n >> 8, n & 255])
      : Buffer.concat([Buffer.from([0x80 | opcode, 0x80 | 127]), (() => {
        const b = Buffer.alloc(8); b.writeBigUInt64BE(BigInt(n)); return b;
      })()]);
  const mascara = randomBytes(4);
  const corpo = Buffer.alloc(n);
  for (let i = 0; i < n; i++) corpo[i] = dados[i] ^ mascara[i & 3];
  return Buffer.concat([cabeca, mascara, corpo]);
}

/**
 * Conecta a `ws://127.0.0.1:<porta>/devtools/browser/<id>` e devolve
 * `{ enviar(metodo, params), fechar(), aoFechar }`. `enviar` resolve com o
 * `result` ou rejeita com o `error` do Chrome.
 */
export function abrirCdp(enderecoWs, { teto = 10_000 } = {}) {
  const u = new URL(enderecoWs);
  return new Promise((pronto, falhou) => {
    const pedido = request({
      host: u.hostname, port: u.port, path: u.pathname,
      headers: { Connection: "Upgrade", Upgrade: "websocket",
        "Sec-WebSocket-Key": randomBytes(16).toString("base64"), "Sec-WebSocket-Version": "13" },
      timeout: teto,
    });
    pedido.on("timeout", () => pedido.destroy(new Error("a porta de depuração não respondeu")));
    pedido.on("error", falhou);
    pedido.on("response", (r) => falhou(new Error(`a porta de depuração recusou (${r.statusCode})`)));
    pedido.on("upgrade", (_r, socket, cabeca) => {
      let n = 0;
      const esperando = new Map();
      let aoFechar = () => {};
      let resto = cabeca?.length ? Buffer.from(cabeca) : Buffer.alloc(0);
      let pedacos = [];

      const entregar = (texto) => {
        let m;
        try { m = JSON.parse(texto); } catch { return; }
        const e = m.id && esperando.get(m.id);
        if (!e) return;
        esperando.delete(m.id);
        if (m.error) e.falhou(new Error(m.error.message || "o Chrome recusou"));
        else e.pronto(m.result || {});
      };
      const ler = () => {
        for (;;) {
          if (resto.length < 2) return;
          const fim = (resto[0] & 0x80) !== 0;
          const opcode = resto[0] & 0x0f;
          let n = resto[1] & 0x7f, i = 2;
          if (n === 126) { if (resto.length < 4) return; n = resto.readUInt16BE(2); i = 4; }
          else if (n === 127) { if (resto.length < 10) return; n = Number(resto.readBigUInt64BE(2)); i = 10; }
          if (resto.length < i + n) return;
          const dados = resto.subarray(i, i + n);
          resto = resto.subarray(i + n);
          if (opcode === 0x8) { socket.end(); return; }
          if (opcode === 0x9) { socket.write(quadro(dados.toString("utf8"), 0xA)); continue; }
          if (opcode === 0x1 || opcode === 0x0) {
            pedacos.push(Buffer.from(dados));
            if (fim) { entregar(Buffer.concat(pedacos).toString("utf8")); pedacos = []; }
          }
        }
      };
      socket.on("data", (d) => { resto = Buffer.concat([resto, d]); ler(); });
      socket.on("close", () => {
        for (const e of esperando.values()) e.falhou(new Error("a janela fechou"));
        esperando.clear();
        aoFechar();
      });
      socket.on("error", () => {});
      ler();

      pronto({
        enviar(metodo, params = {}) {
          const id = ++n;
          return new Promise((ok, erro) => {
            const relogio = setTimeout(() => { esperando.delete(id); erro(new Error(`${metodo} não respondeu`)); }, teto);
            esperando.set(id, { pronto: (r) => { clearTimeout(relogio); ok(r); },
              falhou: (e) => { clearTimeout(relogio); erro(e); } });
            socket.write(quadro(JSON.stringify({ id, method: metodo, params })));
          });
        },
        fechar() { socket.destroy(); },
        set aoFechar(f) { aoFechar = f; },
      });
    });
    pedido.end();
  });
}
