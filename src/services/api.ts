import { apiRequest } from "@/services/http";

export { ApiError } from "@/services/http";

export interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  descricao_categoria: string | null;
  status_categoria: "ATIVO" | "INATIVO";
  criado_em_categoria?: string;
  atualizado_em_categoria?: string;
}

export interface Produto {
  id_produto: number;
  id_categoria: number;
  nome_produto: string;
  slug_produto: string;
  descricao_produto: string;
  tamanho_produto: string;
  unid_med_produto: string;
  valor_produto: number;
  foto_produto: string | null;
  status_produto: "ATIVO" | "INATIVO";
  destaque_produto: "SIM" | "NAO";
  criado_em_produto?: string;
  atualizado_em_produto?: string;
  categoria_produto?: Categoria;
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

async function apiFetch<T>(caminho: string): Promise<T> {
  const { data } = await apiRequest<T>(caminho);
  return data;
}

export function getProdutos() {
  return apiFetch<Produto[]>("/produtos");
}

export function getProduto(slug: string) {
  return apiFetch<Produto>(`/produtos/${encodeURIComponent(slug)}`);
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
