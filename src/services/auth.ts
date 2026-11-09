import { apiRequest, ApiError } from "@/services/http";
import { nomeDoDispositivo, salvarToken } from "@/services/sessao";

export async function entrar(email: string, senha: string) {
  const { data } = await apiRequest<{ token: string }>("/auth/login", {
    method: "POST",
    json: { email: email.trim(), senha, device_name: await nomeDoDispositivo() },
  });
  if (!data || typeof data.token !== "string" || !data.token.trim()) {
    throw new ApiError("A API não retornou uma sessão válida.");
  }
  await salvarToken(data.token);
}
