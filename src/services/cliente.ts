import { apiRequest, ApiError } from "@/services/http";
import { observarSessao } from "@/services/sessao";
import type { Cliente, DadosPerfil } from "@/types/cliente";

interface EstadoCliente {
  cliente: Cliente | null;
  carregando: boolean;
  erro: string;
}

let estado: EstadoCliente = { cliente: null, carregando: false, erro: "" };
let revisao = 0;
let consultaPendente: Promise<void> | null = null;
const ouvintes = new Set<() => void>();

function publicar(novoEstado: EstadoCliente) {
  estado = novoEstado;
  ouvintes.forEach((ouvinte) => ouvinte());
}

observarSessao(() => {
  revisao += 1;
  consultaPendente = null;
  publicar({ cliente: null, carregando: false, erro: "" });
});

export function observarCliente(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export function estadoCliente() {
  return estado;
}

export function carregarCliente(): Promise<void> {
  if (consultaPendente) return consultaPendente;
  const revisaoConsulta = revisao;
  publicar({ ...estado, carregando: true, erro: "" });

  const consulta = (async () => {
    try {
      const { data } = await apiRequest<Cliente>("/cliente", { autenticado: true });
      if (!data || !Number.isInteger(Number(data.id_cliente)) || Number(data.id_cliente) <= 0) {
        throw new ApiError("A API não retornou um cliente válido.");
      }
      if (revisaoConsulta === revisao) {
        publicar({
          cliente: { ...data, id_cliente: Number(data.id_cliente) },
          carregando: false,
          erro: "",
        });
      }
    } catch (erro) {
      if (revisaoConsulta === revisao) {
        publicar({
          ...estado,
          carregando: false,
          erro: erro instanceof Error ? erro.message : "Não foi possível carregar o perfil.",
        });
      }
    }
  })();
  consultaPendente = consulta;
  const liberarConsulta = () => {
    if (consultaPendente === consulta) consultaPendente = null;
  };
  void consulta.then(liberarConsulta, liberarConsulta);
  return consulta;
}

export async function salvarDadosPerfil(dados: DadosPerfil) {
  const clienteAnterior = estado.cliente;
  const resposta = await apiRequest<Partial<Cliente> | null>("/cliente", {
    autenticado: true,
    method: "PUT",
    json: dados,
  });
  if (clienteAnterior && estado.cliente?.id_cliente === clienteAnterior.id_cliente) {
    revisao += 1;
    publicar({
      cliente: {
        ...estado.cliente,
        ...dados,
        ...resposta.data,
        id_cliente: clienteAnterior.id_cliente,
      },
      carregando: false,
      erro: "",
    });
  }
  return resposta.message || "Dados atualizados com sucesso.";
}
