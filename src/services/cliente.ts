import { apiRequest, ApiError } from "@/services/http";
import { observarSessao } from "@/services/sessao";
import type { Cliente, DadosPerfil } from "@/types/cliente";

interface EstadoCliente {
  cliente: Cliente | null;
  versaoFoto: number;
  carregando: boolean;
  erro: string;
}

let estado: EstadoCliente = { cliente: null, versaoFoto: 0, carregando: false, erro: "" };
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
  publicar({ cliente: null, versaoFoto: 0, carregando: false, erro: "" });
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
          versaoFoto: data.foto_cliente
            ? data.foto_cliente === estado.cliente?.foto_cliente && estado.versaoFoto > 0
              ? estado.versaoFoto
              : Math.max(Date.now(), estado.versaoFoto + 1)
            : 0,
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
    const camposRetornados = Object.fromEntries(
      Object.entries(resposta.data ?? {}).filter(([campo]) => Object.hasOwn(dados, campo)),
    ) as Partial<DadosPerfil>;
    revisao += 1;
    publicar({
      ...estado,
      cliente: {
        ...estado.cliente,
        ...dados,
        ...camposRetornados,
        id_cliente: clienteAnterior.id_cliente,
      },
      carregando: false,
      erro: "",
    });
  }
  return resposta.message || "Dados atualizados com sucesso.";
}

export function atualizarFotoCliente(foto: string, idCliente: number) {
  if (!estado.cliente || estado.cliente.id_cliente !== idCliente) {
    throw new ApiError("O perfil foi alterado. Abra novamente a tela de perfil.");
  }
  revisao += 1;
  publicar({
    ...estado,
    cliente: { ...estado.cliente, foto_cliente: foto },
    versaoFoto: Math.max(Date.now(), estado.versaoFoto + 1),
    carregando: false,
  });
}
