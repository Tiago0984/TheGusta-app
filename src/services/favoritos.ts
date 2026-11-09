import { apiRequest, ApiError } from "@/services/http";
import { lerToken, observarSessao } from "@/services/sessao";

interface EstadoFavoritos {
  ids: number[];
  carregando: boolean;
  carregado: boolean;
  processando: number[];
  erro: string;
}

const inicial: EstadoFavoritos = { ids: [], carregando: false, carregado: false, processando: [], erro: "" };
let estado = inicial;
let sessao = 0;
let revisao = 0;
let consultaPendente: Promise<void> | null = null;
const bloqueios = new Map<number, object>();
const ouvintes = new Set<() => void>();

function publicar(novoEstado: EstadoFavoritos) {
  estado = novoEstado;
  ouvintes.forEach((ouvinte) => ouvinte());
}

observarSessao(() => {
  sessao += 1;
  revisao += 1;
  bloqueios.clear();
  consultaPendente = null;
  publicar(inicial);
});

export function estadoFavoritos() {
  return estado;
}

export function observarFavoritos(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => { ouvintes.delete(ouvinte); };
}

export function carregarFavoritos(): Promise<void> {
  if (consultaPendente) return consultaPendente;
  const sessaoConsulta = sessao;
  const revisaoConsulta = revisao;
  publicar({ ...estado, carregando: true, erro: "" });

  const consulta = (async () => {
    try {
      if (!await lerToken()) {
        if (sessaoConsulta === sessao) publicar({ ...inicial, processando: estado.processando });
        return;
      }
      const { data } = await apiRequest<{ id_produto: number | string }[]>("/favoritos", { autenticado: true });
      if (!Array.isArray(data) || data.some((item) => !item || !Number.isInteger(Number(item.id_produto)) || Number(item.id_produto) <= 0)) {
        throw new ApiError("Não foi possível consultar seus favoritos. Tente novamente.");
      }
      if (sessaoConsulta === sessao && revisaoConsulta === revisao) {
        publicar({ ...estado, ids: [...new Set(data.map((item) => Number(item.id_produto)))], carregado: true });
      }
    } catch (erro) {
      if (sessaoConsulta === sessao && revisaoConsulta === revisao) {
        publicar({ ...estado, carregado: false, erro: erro instanceof Error ? erro.message : "Não foi possível consultar seus favoritos." });
      }
    } finally {
      if (sessaoConsulta === sessao) publicar({ ...estado, carregando: false });
    }
  })();
  consultaPendente = consulta;
  const liberar = () => { if (consultaPendente === consulta) consultaPendente = null; };
  void consulta.then(liberar, liberar);
  return consulta;
}

export async function alterarFavorito(id: number): Promise<boolean> {
  if (!Number.isInteger(id) || id <= 0) {
    publicar({ ...estado, erro: "Produto inválido." });
    return false;
  }
  if (bloqueios.has(id)) return false;
  const bloqueio = {};
  const sessaoOperacao = sessao;
  bloqueios.set(id, bloqueio);
  publicar({ ...estado, processando: [...estado.processando, id], erro: "" });
  try {
    if (!await lerToken()) throw new ApiError("Faça login para salvar seus favoritos.");
    if (!estado.carregado) await carregarFavoritos();
    if (sessaoOperacao !== sessao) return false;
    if (!estado.carregado) throw new ApiError(estado.erro || "Não foi possível consultar seus favoritos. Tente novamente.");
    const estavaFavorito = estado.ids.includes(id);
    await apiRequest<void>(estavaFavorito ? `/favoritos/${id}` : "/favoritos", {
      autenticado: true,
      method: estavaFavorito ? "DELETE" : "POST",
      ...(!estavaFavorito ? { json: { id_produto: id } } : {}),
    });
    if (sessaoOperacao !== sessao) return false;
    revisao += 1;
    publicar({ ...estado, ids: estavaFavorito ? estado.ids.filter((item) => item !== id) : [...new Set([...estado.ids, id])] });
    return true;
  } catch (erro) {
    if (sessaoOperacao === sessao) {
      publicar({ ...estado, erro: erro instanceof Error ? erro.message : "Não foi possível atualizar o favorito." });
    }
    return false;
  } finally {
    if (bloqueios.get(id) === bloqueio) {
      bloqueios.delete(id);
      publicar({ ...estado, processando: estado.processando.filter((item) => item !== id) });
    }
  }
}
