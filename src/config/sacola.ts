import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Produto } from "@/services/api";
import { ApiError, apiRequest } from "@/services/http";
import { lerToken, observarSessao } from "@/services/sessao";

export type ItemSacola = {
  id_produto: number;
  nome_produto: string;
  descricao_produto: string;
  foto_produto: string | null;
  valor_produto: number;
  quantidade: number;
};

export class ErroSacolaInvalida extends Error {
  constructor() {
    super("Os dados salvos da sacola estão inválidos. Tente novamente ou esvazie a sacola para recomeçar.");
    this.name = "ErroSacolaInvalida";
  }
}

let versaoSessao = 0;
let pendente: Promise<unknown> = Promise.resolve();
observarSessao(() => { versaoSessao += 1; });

type ContextoSacola = { chave: string; token: string | null; versao: number };

function conferirVersao(versao: number) {
  if (versao !== versaoSessao) {
    throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
  }
}

async function conferirSessao(contexto: ContextoSacola) {
  const token = await lerToken();
  conferirVersao(contexto.versao);
  if (token !== contexto.token) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
}

// A fila inclui leituras: nenhuma alteração pode partir de uma versão antiga.
// A identidade é resolvida uma única vez e a mesma chave vale até o fim da operação.
function operar<T>(operacao: (contexto: ContextoSacola) => Promise<T>): Promise<T> {
  const versao = versaoSessao;
  const resultado = pendente.then(async () => {
    conferirVersao(versao);
    const token = await lerToken();
    conferirVersao(versao);
    const { data } = await apiRequest<{ id_cliente?: unknown }>("/cliente", {
      autenticado: true, tokenEsperado: token,
    });
    const id = numero(data?.id_cliente);
    if (!Number.isSafeInteger(id) || id <= 0) throw new ApiError("Não foi possível identificar o cliente da sacola.");
    const contexto = { chave: `sacola_cliente_${id}`, token, versao };
    await conferirSessao(contexto);
    return operacao(contexto);
  });
  pendente = resultado.catch(() => undefined);
  return resultado;
}

function numero(valor: unknown) {
  return typeof valor === "number" || (typeof valor === "string" && valor.trim() !== "")
    ? Number(valor) : NaN;
}

function validarId(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Produto inválido para a sacola.");
}

function validarQuantidade(quantidade: number) {
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) {
    throw new Error("A quantidade de cada produto deve ficar entre 1 e 99.");
  }
}

function precoValido(preco: number) {
  return Number.isFinite(preco) && preco >= 0 && Number.isSafeInteger(Math.round(preco * 100) * 99);
}

function validarItem(item: ItemSacola) {
  validarId(item.id_produto);
  validarQuantidade(item.quantidade);
  if (typeof item.nome_produto !== "string" || !item.nome_produto.trim()
    || typeof item.descricao_produto !== "string"
    || (item.foto_produto !== null && typeof item.foto_produto !== "string")
    || typeof item.valor_produto !== "number" || !precoValido(item.valor_produto)) {
    throw new Error("Os dados do produto estão inválidos para a sacola.");
  }
}

// Valores monetários são somados em centavos, inclusive no subtotal de cada linha.
export function subtotalSacola(itens: readonly ItemSacola[]) {
  const centavos = itens.reduce((total, item) => total + Math.round(item.valor_produto * 100) * item.quantidade, 0);
  if (!Number.isSafeInteger(centavos)) throw new Error("O subtotal da sacola é inválido.");
  return centavos / 100;
}

async function ler(contexto: ContextoSacola): Promise<ItemSacola[]> {
  let valor: string | null;
  try {
    valor = await AsyncStorage.getItem(contexto.chave);
  } catch {
    throw new Error("Não foi possível ler a sacola neste aparelho. Tente novamente.");
  }
  await conferirSessao(contexto);
  if (valor === null) return [];
  try {
    const itens: unknown = JSON.parse(valor);
    if (!Array.isArray(itens)) throw new Error();
    const ids = new Set<number>();
    for (const item of itens) {
      if (!item || typeof item !== "object") throw new Error();
      validarItem(item);
      if (ids.has(item.id_produto)) throw new Error();
      ids.add(item.id_produto);
    }
    subtotalSacola(itens);
    return itens;
  } catch {
    // Não sobrescreve dados inválidos silenciosamente.
    throw new ErroSacolaInvalida();
  }
}

async function salvar(contexto: ContextoSacola, itens: ItemSacola[]) {
  subtotalSacola(itens);
  await conferirSessao(contexto);
  try {
    await AsyncStorage.setItem(contexto.chave, JSON.stringify(itens));
  } catch {
    throw new Error("Não foi possível salvar a sacola neste aparelho. Tente novamente.");
  }
  await conferirSessao(contexto);
  return itens;
}

export function carregarSacola(): Promise<ItemSacola[]> {
  return operar(ler);
}

export async function adicionarNaSacola(produto: Produto, quantidade: number): Promise<ItemSacola[]> {
  const item: ItemSacola = {
    id_produto: numero(produto.id_produto), nome_produto: produto.nome_produto,
    descricao_produto: produto.descricao_produto, foto_produto: produto.foto_produto,
    valor_produto: numero(produto.valor_produto), quantidade,
  };
  validarItem(item);
  if (produto.status_produto !== "ATIVO") throw new Error("Este produto está indisponível para compra.");
  return operar(async (contexto) => {
    const itens = await ler(contexto);
    const indice = itens.findIndex((atual) => atual.id_produto === item.id_produto);
    if (indice >= 0) {
      item.quantidade += itens[indice].quantidade;
      validarQuantidade(item.quantidade);
      // Uma nova adição atualiza o retrato do produto com os dados consultados.
      itens[indice] = item;
    } else {
      itens.push(item);
    }
    return salvar(contexto, itens);
  });
}

export async function alterarQuantidadeSacola(idProduto: number, quantidade: number): Promise<ItemSacola[]> {
  validarId(idProduto);
  validarQuantidade(quantidade);
  return operar(async (contexto) => {
    const itens = await ler(contexto);
    const item = itens.find((atual) => atual.id_produto === idProduto);
    if (!item) throw new Error("O produto não está mais na sacola. Atualize a tela.");
    item.quantidade = quantidade;
    return salvar(contexto, itens);
  });
}

export async function removerDaSacola(idProduto: number): Promise<ItemSacola[]> {
  validarId(idProduto);
  return operar(async (contexto) => salvar(contexto, (await ler(contexto)).filter((item) => item.id_produto !== idProduto)));
}

export async function limparSacola(): Promise<void> {
  await operar(async (contexto) => { await salvar(contexto, []); });
}
