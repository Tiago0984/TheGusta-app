import AsyncStorage from "@react-native-async-storage/async-storage";

const ouvintes = new Set<() => void>();
let alteracaoPendente: Promise<unknown> = Promise.resolve();

function enfileirar<T>(operacao: () => Promise<T>): Promise<T> {
  const resultado = alteracaoPendente.then(operacao);
  alteracaoPendente = resultado.catch(() => undefined);
  return resultado;
}

function notificar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

export function observarSessao(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export async function lerToken() {
  await alteracaoPendente;
  return AsyncStorage.getItem("token");
}

export function salvarToken(token: string) {
  if (!token.trim()) throw new Error("A API não retornou uma sessão válida.");
  return enfileirar(async () => {
    await AsyncStorage.removeItem("cliente");
    await AsyncStorage.setItem("token", token);
    notificar();
  });
}

// Uma resposta atrasada de outra sessão não pode encerrar a sessão atual.
export function encerrarSessao(tokenEsperado: string | null) {
  return enfileirar(async () => {
    if (await AsyncStorage.getItem("token") !== tokenEsperado) return false;
    await AsyncStorage.multiRemove(["token", "cliente"]);
    notificar();
    return true;
  });
}

export async function nomeDoDispositivo() {
  let id = await AsyncStorage.getItem("device_id");
  if (!id) {
    id = `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await AsyncStorage.setItem("device_id", id);
  }
  return id;
}
