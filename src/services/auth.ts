import { apiRequest, ApiError } from "@/services/http";
import { nomeDoDispositivo, salvarToken } from "@/services/sessao";

export interface DadosCadastro {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  aceitarTermos: boolean;
}

export interface DadosRedefinicao {
  email: string;
  codigo: string;
  novaSenha: string;
  confirmarSenha: string;
}

function validarEmail(email: string) {
  if (!email.trim()) throw new ApiError("Informe seu e-mail.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new ApiError("Informe um e-mail válido.");
  }
}

function validarSenhas(senha: string, confirmarSenha: string) {
  if (!senha || !confirmarSenha) throw new ApiError("Preencha os campos de senha.");
  if (senha.length < 8) throw new ApiError("A senha deve ter pelo menos 8 caracteres.");
  if (senha !== confirmarSenha) throw new ApiError("As senhas não correspondem.");
}

async function iniciarSessao(data: { token: string } | undefined) {
  if (!data || typeof data.token !== "string" || !data.token.trim()) {
    throw new ApiError("A API não retornou uma sessão válida.");
  }
  await salvarToken(data.token);
}

export async function entrar(email: string, senha: string) {
  const { data } = await apiRequest<{ token: string }>("/auth/login", {
    method: "POST",
    json: { email: email.trim(), senha, device_name: await nomeDoDispositivo() },
  });
  await iniciarSessao(data);
}

export async function cadastrarCliente(dados: DadosCadastro) {
  if (!dados.nome.trim() || !dados.email.trim() || !dados.telefone.trim()
    || !dados.senha || !dados.confirmarSenha) {
    throw new ApiError("Preencha todos os campos.");
  }
  validarEmail(dados.email);
  const telefone = dados.telefone.trim();
  const quantidadeDigitos = telefone.replace(/\D/g, "").length;
  if (!/^[\d\s()+-]+$/.test(telefone) || quantidadeDigitos < 10 || quantidadeDigitos > 11) {
    throw new ApiError("Informe um telefone válido com DDD.");
  }
  validarSenhas(dados.senha, dados.confirmarSenha);
  if (!dados.aceitarTermos) throw new ApiError("Aceite os termos de uso para continuar.");

  const { data } = await apiRequest<{ token: string }>("/auth/cadastro", {
    method: "POST",
    json: {
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      telefone,
      senha: dados.senha,
      aceite_termo: dados.aceitarTermos,
      device_name: await nomeDoDispositivo(),
    },
  });
  await iniciarSessao(data);
}

export async function solicitarCodigo(email: string) {
  validarEmail(email);
  await apiRequest<void>("/auth/esqueci-senha", {
    method: "POST",
    json: { email: email.trim() },
  });
}

export async function redefinirSenha(dados: DadosRedefinicao) {
  if (!dados.email.trim()) {
    throw new ApiError("E-mail não informado. Solicite um novo código.");
  }
  validarEmail(dados.email);
  if (!/^\d{4}$/.test(dados.codigo)) throw new ApiError("Informe os 4 dígitos do código.");
  validarSenhas(dados.novaSenha, dados.confirmarSenha);

  const { data } = await apiRequest<{ reset_token: string }>("/auth/validar-codigo", {
    method: "POST",
    json: { email: dados.email.trim(), codigo: dados.codigo },
  });
  if (!data || typeof data.reset_token !== "string" || !data.reset_token.trim()) {
    throw new ApiError("Token de redefinição não recebido. Solicite um novo código.");
  }

  await apiRequest<void>("/auth/redefinir-senha", {
    method: "POST",
    json: {
      reset_token: data.reset_token,
      nova_senha: dados.novaSenha,
      nova_senha_confirmation: dados.confirmarSenha,
    },
  });
}
