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
const revisoes = new Map<number, number>();
const cancelamentos = new Map<number, object>();
observarSessao(() => { sessao += 1; revisoes.clear(); cancelamentos.clear(); });
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

export interface ItemPedido extends ItemHistorico {
  valor_unit_item: number;
  status_item: string | null;
}
export interface EnderecoPedido {
  nome_endereco: string; endereco: string; numero: string;
  complemento: string | null; bairro: string | null; cidade: string | null; uf: string | null; cep: string | null;
}
export interface PedidoDetalhado extends Omit<PedidoHistorico, "itens"> {
  itens: ItemPedido[];
  subtotal_venda: number;
  valor_desconto_venda: number;
  forma_pagamento_venda: string;
  observacao_venda: string | null;
  endereco: EnderecoPedido | null;
  cupom: { codigo_cupom: string } | null;
}
export interface StatusPedidoAtual {
  id_venda: number; status_venda: string; status_descricao_venda: string; atualizado_em_venda: string | null;
}
function validarIdPedido(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) throw new ApiError("Pedido inválido.");
}
function dinheiro(valor: unknown) {
  const preco = numero(valor);
  if (preco < 0 || !Number.isSafeInteger(Math.round(preco * 100))) throw invalido();
  return preco;
}
function textoNulo(valor: unknown) {
  if (valor == null) return null;
  if (typeof valor !== "string") throw invalido();
  return valor;
}
function normalizarDetalhe(valor: unknown, id: number): PedidoDetalhado {
  try {
    const dados = objeto(valor);
    const base = normalizarPedido(dados);
    if (base.id_venda !== id) throw invalido();
    const itens = base.itens.map((item, indice) => {
      const dadosItem = objeto((dados.itens as unknown[])[indice]);
      const preco = dinheiro(dadosItem.valor_unit_item);
      if (!Number.isSafeInteger(Math.round(preco * 100) * item.qtde_item)) throw invalido();
      return { ...item, valor_unit_item: preco, status_item: textoNulo(dadosItem.status_item) };
    });
    let endereco: EnderecoPedido | null = null;
    if (dados.endereco != null) {
      const e = objeto(dados.endereco);
      endereco = { nome_endereco: texto(e.nome_endereco), endereco: texto(e.endereco), numero: texto(e.numero),
        complemento: textoNulo(e.complemento), bairro: textoNulo(e.bairro), cidade: textoNulo(e.cidade), uf: textoNulo(e.uf), cep: textoNulo(e.cep) };
    }
    const cupom = dados.cupom == null ? null : { codigo_cupom: texto(objeto(dados.cupom).codigo_cupom) };
    return { ...base, itens, endereco, cupom, subtotal_venda: dinheiro(dados.subtotal_venda),
      valor_desconto_venda: dinheiro(dados.valor_desconto_venda), forma_pagamento_venda: texto(dados.forma_pagamento_venda),
      observacao_venda: textoNulo(dados.observacao_venda) };
  } catch { throw new ApiError("A API retornou um pedido inválido. Tente atualizar o pedido."); }
}
function normalizarStatus(valor: unknown, id: number): StatusPedidoAtual {
  try {
    const dados = objeto(valor);
    const status = texto(dados.status_venda);
    if (inteiro(dados.id_venda) !== id) throw invalido();
    return { id_venda: id, status_venda: status,
      status_descricao_venda: typeof dados.status_descricao_venda === "string" && dados.status_descricao_venda.trim()
        ? dados.status_descricao_venda : statusPedidos[status as StatusPedido] ?? status,
      atualizado_em_venda: textoNulo(dados.atualizado_em_venda) };
  } catch { throw new ApiError("A API retornou um status de pedido inválido."); }
}
async function lerPedido(id: number, somenteStatus: boolean) {
  validarIdPedido(id);
  const versao = sessao;
  const revisao = revisoes.get(id) ?? 0;
  const token = await lerToken();
  if (versao !== sessao) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
  const { data } = await apiRequest<unknown>(`/pedidos/${id}${somenteStatus ? "/status" : ""}`, { autenticado: true, tokenEsperado: token });
  if (versao !== sessao || revisao !== (revisoes.get(id) ?? 0)) throw new ApiError("O pedido foi alterado. Atualize a tela.", 409);
  return data;
}
export async function consultarPedido(id: number): Promise<PedidoDetalhado> {
  return normalizarDetalhe(await lerPedido(id, false), id);
}
export async function consultarStatusPedido(id: number): Promise<StatusPedidoAtual> {
  return normalizarStatus(await lerPedido(id, true), id);
}
export async function cancelarPedido(id: number): Promise<StatusPedidoAtual> {
  validarIdPedido(id);
  if (cancelamentos.has(id)) throw new ApiError("Aguarde o cancelamento em andamento.");
  const bloqueio = {};
  const versao = sessao;
  cancelamentos.set(id, bloqueio);
  revisoes.set(id, (revisoes.get(id) ?? 0) + 1);
  try {
    const token = await lerToken();
    if (versao !== sessao) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
    const { data } = await apiRequest<unknown>(`/pedidos/${id}/cancelar`, { autenticado: true, tokenEsperado: token, method: "PUT" });
    if (versao !== sessao) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
    // A documentação permite resposta resumida; não depende de outro GET para confirmar.
    const status = normalizarStatus(data, id);
    if (status.status_venda !== "CANCELADO") throw new ApiError("O cancelamento não foi confirmado. Atualize o pedido antes de tentar novamente.");
    return status;
  } finally {
    if (cancelamentos.get(id) === bloqueio) {
      cancelamentos.delete(id);
      revisoes.set(id, (revisoes.get(id) ?? 0) + 1);
    }
  }
}

export function acompanhamentoPedido(status: string, entrega: "SIM" | "NAO") {
  if (status === "CANCELADO") return [];
  const ordem = ["PENDENTE", "CONFIRMADO", "EM_PREPARO", "PRONTO", "EM_ENTREGA", "ENTREGUE"];
  const indice = ordem.indexOf(status);
  if (indice < 0) return [];
  const etapas = [
    { codigo: "EM_PREPARO", texto: "Em preparo" },
    { codigo: "PRONTO", texto: entrega === "SIM" ? "Pronto para envio" : "Pronto para retirada" },
    ...(entrega === "SIM" ? [{ codigo: "EM_ENTREGA", texto: "Saiu para entrega" }] : []),
    { codigo: "ENTREGUE", texto: entrega === "SIM" ? "Entrega realizada" : "Retirada concluída" },
  ];
  return etapas.map((etapa) => ({ ...etapa,
    estado: status === "ENTREGUE" || ordem.indexOf(etapa.codigo) < indice ? "concluida" : etapa.codigo === status ? "atual" : "aguardando",
  }));
}
