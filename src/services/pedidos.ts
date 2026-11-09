import { apiRequest, ApiError } from "@/services/http";
import { lerToken, observarSessao } from "@/services/sessao";

export const statusPedidos = {
  PENDENTE: "Aguardando confirmação", CONFIRMADO: "Pedido confirmado", EM_PREPARO: "Em preparo",
  PRONTO: "Pronto", EM_ENTREGA: "Saiu para entrega", ENTREGUE: "Entregue", CANCELADO: "Cancelado",
} as const;
export type StatusPedido = keyof typeof statusPedidos;
export interface ItemHistorico {
  id_item: number;
  qtde_item: number;
  produto: { nome_produto: string; foto_produto: string | null } | null;
}
export interface PedidoHistorico {
  id_venda: number;
  valor_venda: number;
  status_venda: string;
  status_descricao_venda: string;
  data_venda: string | null;
  data_entrega_venda: string | null;
  entrega_venda: "SIM" | "NAO";
  itens: ItemHistorico[];
}
export interface PaginaPedidos {
  pedidos: PedidoHistorico[];
  pagina: number;
  ultimaPagina: number;
  porPagina: number;
  total: number;
}
let sessao = 0;
observarSessao(() => { sessao += 1; });
const invalido = () => new ApiError("A API retornou um histórico inválido. Atualize os pedidos.");
function objeto(valor: unknown): Record<string, unknown> {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) throw invalido();
  return valor as Record<string, unknown>;
}
function numero(valor: unknown) {
  const resultado = typeof valor === "number" || (typeof valor === "string" && valor.trim()) ? Number(valor) : NaN;
  if (!Number.isFinite(resultado)) throw invalido();
  return resultado;
}
function inteiro(valor: unknown, minimo = 1) {
  const resultado = numero(valor);
  if (!Number.isSafeInteger(resultado) || resultado < minimo) throw invalido();
  return resultado;
}
function texto(valor: unknown) {
  if (typeof valor !== "string" || !valor.trim()) throw invalido();
  return valor;
}
function dataOpcional(valor: unknown) {
  if (valor == null) return null;
  if (typeof valor !== "string") throw invalido();
  return valor;
}
function normalizarPedido(valor: unknown): PedidoHistorico {
  const pedido = objeto(valor);
  const status = texto(pedido.status_venda);
  const total = numero(pedido.valor_venda);
  if (total < 0 || !Number.isSafeInteger(Math.round(total * 100)) || !["SIM", "NAO"].includes(String(pedido.entrega_venda)) || !Array.isArray(pedido.itens)) throw invalido();
  const itens = pedido.itens.map((valor): ItemHistorico => {
    const item = objeto(valor);
    let produto: ItemHistorico["produto"] = null;
    if (item.produto !== null) {
      const dados = objeto(item.produto);
      if (dados.foto_produto !== null && typeof dados.foto_produto !== "string") throw invalido();
      produto = { nome_produto: texto(dados.nome_produto), foto_produto: dados.foto_produto as string | null };
    }
    return { id_item: inteiro(item.id_item), qtde_item: inteiro(item.qtde_item), produto };
  });
  if (new Set(itens.map((item) => item.id_item)).size !== itens.length) throw invalido();
  return { id_venda: inteiro(pedido.id_venda), valor_venda: total, status_venda: status,
    status_descricao_venda: typeof pedido.status_descricao_venda === "string" && pedido.status_descricao_venda.trim()
      ? pedido.status_descricao_venda : statusPedidos[status as StatusPedido] ?? status,
    data_venda: dataOpcional(pedido.data_venda), data_entrega_venda: dataOpcional(pedido.data_entrega_venda),
    entrega_venda: pedido.entrega_venda as "SIM" | "NAO", itens };
}

export async function consultarPedidos(pagina = 1, status?: StatusPedido): Promise<PaginaPedidos> {
  if (!Number.isSafeInteger(pagina) || pagina < 1 || (status !== undefined && !Object.hasOwn(statusPedidos, status))) {
    throw new ApiError("Filtro ou página de pedidos inválidos.");
  }
  const versao = sessao;
  const token = await lerToken();
  if (versao !== sessao) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
  const { data, meta: valorMeta } = await apiRequest<unknown>(`/pedidos?page=${pagina}&por_pagina=10${status ? `&status=${status}` : ""}`, { autenticado: true, tokenEsperado: token });
  if (versao !== sessao) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
  if (!Array.isArray(data)) throw invalido();
  const meta = objeto(valorMeta);
  const atual = inteiro(meta.pagina_atual);
  const ultima = inteiro(meta.ultima_pagina);
  const porPagina = inteiro(meta.por_pagina);
  if (atual !== pagina || atual > ultima || porPagina > 50 || data.length > porPagina) throw invalido();
  const pedidos = data.map(normalizarPedido);
  if (new Set(pedidos.map((pedido) => pedido.id_venda)).size !== pedidos.length) throw invalido();
  return { pedidos, pagina: atual, ultimaPagina: ultima, porPagina, total: inteiro(meta.total, 0) };
}

export function formatarDataPedido(valor: string | null) {
  if (!valor) return "Não informada";
  // Datas sem offset são exibidas como informadas, sem inventar um fuso do servidor.
  const partes = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(valor);
  if (partes) {
    const [, ano, mes, dia, hora, minuto, segundo = "00"] = partes;
    const data = new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}Z`);
    if (!Number.isNaN(data.getTime()) && data.toISOString().slice(0, 19) === `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`) return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    return "Não informada";
  }
  if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(valor)) return "Não informada";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "Não informada" : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
