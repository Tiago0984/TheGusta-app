import { API } from "@/config/api";

export interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  descricao_categoria: string | null;
  ordem_categoria: number;
  status_categoria: "ATIVO" | "INATIVO";
}

export interface Produto {
  id_produto: number;
  id_categoria: number;
  nome_produto: string;
  slug_produto: string;
  descricao_produto: string;
  tamanho_produto: string;
  unid_medida_produto: string;
  valor_produto: number;
  foto_produto: string | null;
  status_produto: "ATIVO" | "INATIVO";
  destaque_produto: "SIM" | "NAO";
  ordem_produto: number;
  categoria_produto?: {
    id_categoria: number;
    nome_categoria: string;
    descricao_categoria?: string;
  };
}

export interface Banner {
  id_banner: number;
  nome_banner: string;
  titulo_banner: string;
  subtitulo_banner: string | null;
  descricao_banner: string | null;
  texto_botao_banner: string | null;
  link_botao_banner: string | null;
  ordem_banner: number;
  foto_banner: string | null;
  status_banner: "ATIVO" | "INATIVO";
}

export interface CategoriaComProdutos {
  categoria: Categoria;
  produtos: Produto[];
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch<T>(caminho: string): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(`${API}${caminho}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique sua internet.",
    );
  }

  if (!resposta.ok) {
    throw new ApiError(
      `Não foi possível carregar os dados (erro ${resposta.status}).`,
      resposta.status,
    );
  }

  const json = await resposta.json();

  if (!json.success) {
    throw new ApiError("A API retornou uma resposta inesperada.");
  }

  return json.data as T;
}

export function getProdutos() {
  return apiFetch<Produto[]>("/produtos");
}

export function getProduto(slug: string) {
  return apiFetch<Produto>(`/produtos/${slug}`);
}

export function getCategorias() {
  return apiFetch<Categoria[]>("/categorias");
}

export function getProdutosPorCategoria(idCategoria: number) {
  return apiFetch<CategoriaComProdutos>(`/categorias/${idCategoria}/produtos`);
}

export function getBanners() {
  return apiFetch<Banner[]>("/banners");
}
