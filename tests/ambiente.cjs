/* global __dirname */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function ambiente(responder, dados = {}, opcoesAmbiente = {}) {
  const armazenamento = new Map(Object.entries(dados));
  const chamadas = [];
  const navegacoes = [];
  const cache = new Map();
  const storage = {
    getItem: async (chave) => armazenamento.get(chave) ?? null,
    setItem: async (chave, valor) => { armazenamento.set(chave, valor); },
    removeItem: async (chave) => { armazenamento.delete(chave); },
    multiRemove: async (chaves) => { chaves.forEach((chave) => armazenamento.delete(chave)); },
  };
  const contexto = vm.createContext({
    console, Error, Headers, Response, Blob, File,
    FormData: opcoesAmbiente.FormData || FormData,
    fetch: async (url, opcoes) => {
      chamadas.push({ url, ...opcoes });
      return responder(url, opcoes);
    },
  });
  function carregar(nome) {
    const arquivo = path.resolve(__dirname, "../src", `${nome}.ts`);
    if (cache.has(arquivo)) return cache.get(arquivo).exports;
    const modulo = { exports: {} };
    cache.set(arquivo, modulo);
    const codigo = ts.transpileModule(fs.readFileSync(arquivo, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    const importar = (id) => {
      if (id === "@react-native-async-storage/async-storage") return storage;
      if (id === "expo-router") return { router: { replace: (rota) => navegacoes.push(rota) } };
      if (id === "react-native") return { Platform: { OS: opcoesAmbiente.plataforma || "web" } };
      if (id.startsWith("@/")) return carregar(id.slice(2));
      throw new Error(`Import não previsto: ${id}`);
    };
    new vm.Script(`(function(require, module, exports) { ${codigo}\n})`, { filename: arquivo })
      .runInContext(contexto)(importar, modulo, modulo.exports);
    return modulo.exports;
  }
  return { carregar, armazenamento, chamadas, navegacoes, storage };
}

module.exports = { ambiente };
