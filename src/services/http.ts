import { router } from "expo-router";

import { API } from "@/config/api";
import { encerrarSessao, lerToken } from "@/services/sessao";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RespostaApi<T> {
  data: T;
  message?: string;
  meta?: unknown;
}

type OpcoesApi = RequestInit & {
  autenticado?: boolean;
  tokenEsperado?: string | null;
  json?: unknown;
};

export async function apiRequest<T>(
  caminho: string,
  { autenticado = false, tokenEsperado, json, ...opcoes }: OpcoesApi = {},
): Promise<RespostaApi<T>> {
  const token = autenticado ? await lerToken() : null;
  if (autenticado && !token) {
    if (await encerrarSessao(null)) router.replace("/");
    throw new ApiError("Sessão expirada. Faça login novamente.", 401);
  }
  if (autenticado && tokenEsperado !== undefined && token !== tokenEsperado) {
    throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
  }

  const headers = new Headers(opcoes.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (json !== undefined) headers.set("Content-Type", "application/json");

  let resposta: Response;
  try {
    resposta = await fetch(`${API}${caminho}`, {
      ...opcoes,
      headers,
      ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
    });
  } catch (erro) {
    if (erro instanceof Error && erro.name === "AbortError") throw erro;
    throw new ApiError("Não foi possível conectar ao servidor. Verifique sua internet.");
  }

  if (autenticado && resposta.status === 401) {
    if (await encerrarSessao(token)) router.replace("/");
    throw new ApiError("Sessão expirada. Faça login novamente.", 401);
  }
  if (autenticado && await lerToken() !== token) {
    throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
  }
  if (resposta.status === 204) return { data: undefined as T };

  let conteudo: unknown;
  try {
    conteudo = await resposta.json();
  } catch {
    throw new ApiError("O servidor retornou uma resposta inválida. Tente novamente.", resposta.status);
  }
  if (autenticado && await lerToken() !== token) {
    throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
  }
  if (!conteudo || typeof conteudo !== "object") {
    throw new ApiError("A API retornou uma resposta inesperada.", resposta.status);
  }

  const resultado = conteudo as { success?: boolean; message?: unknown; data?: T; meta?: unknown };
  const mensagem = typeof resultado.message === "string" ? resultado.message : undefined;
  if (!resposta.ok || resultado.success !== true) {
    throw new ApiError(
      mensagem || `Não foi possível concluir a solicitação (erro ${resposta.status}).`,
      resposta.status,
    );
  }
  return { data: resultado.data as T, message: mensagem, meta: resultado.meta };
}
