import { apiRequest, ApiError } from "@/services/http";
import { lerToken, observarSessao } from "@/services/sessao";

export interface Endereco {
  id_endereco: number;
  nome_endereco: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  principal_endereco: "SIM" | "NAO";
}
export type DadosEndereco = Omit<Endereco, "id_endereco" | "principal_endereco">;
interface EstadoEnderecos {
  enderecos: Endereco[];
  idSelecionado: number | null;
  carregando: boolean;
  carregado: boolean;
  processando: boolean;
  erro: string;
}
const inicial: EstadoEnderecos = { enderecos: [], idSelecionado: null, carregando: false, carregado: false, processando: false, erro: "" };
let estado = inicial;
let sessao = 0;
let revisao = 0;
let consultaPendente: Promise<void> | null = null;
let bloqueio: object | null = null;
const ouvintes = new Set<() => void>();
const mensagem = (erro: unknown) => erro instanceof Error ? erro.message : "Não foi possível atualizar os endereços.";

function publicar(novo: EstadoEnderecos) {
  estado = novo;
  ouvintes.forEach((ouvinte) => ouvinte());
}
observarSessao(() => {
  sessao += 1;
  revisao += 1;
  consultaPendente = null;
  bloqueio = null;
  publicar(inicial);
});
export const estadoEnderecos = () => estado;
export function observarEnderecos(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => { ouvintes.delete(ouvinte); };
}

function validarId(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) throw new ApiError("Endereço inválido.");
}
function normalizarEndereco(valor: unknown): Endereco {
  if (!valor || typeof valor !== "object") throw new ApiError("A API retornou um endereço inválido.");
  const item = valor as Record<string, unknown>;
  const id = typeof item.id_endereco === "string" || typeof item.id_endereco === "number" ? Number(item.id_endereco) : NaN;
  validarId(id);
  for (const chave of ["nome_endereco", "endereco", "numero", "bairro", "cidade", "uf", "cep"]) {
    if (typeof item[chave] !== "string" || !(item[chave] as string).trim()) throw new ApiError("A API retornou um endereço incompleto.");
  }
  if ((item.complemento !== null && typeof item.complemento !== "string")
    || !["SIM", "NAO"].includes(String(item.principal_endereco))) throw new ApiError("A API retornou um endereço inválido.");
  if (item.status_endereco !== undefined && item.status_endereco !== "ATIVO") throw new ApiError("A API retornou um endereço indisponível.");
  return {
    id_endereco: id, nome_endereco: item.nome_endereco as string, endereco: item.endereco as string,
    numero: item.numero as string, complemento: item.complemento as string | null,
    bairro: item.bairro as string, cidade: item.cidade as string, uf: item.uf as string, cep: item.cep as string,
    principal_endereco: item.principal_endereco as "SIM" | "NAO",
  };
}
function escolher(lista: Endereco[], atual: number | null) {
  return lista.some((item) => item.id_endereco === atual) ? atual : (lista.find((item) => item.principal_endereco === "SIM") ?? lista[0])?.id_endereco ?? null;
}

export function carregarEnderecos(): Promise<void> {
  if (consultaPendente) return consultaPendente;
  const versao = sessao;
  const atual = ++revisao;
  publicar({ ...estado, carregando: true, erro: "" });
  const consulta = (async () => {
    try {
      const token = await lerToken();
      if (versao !== sessao) return;
      const { data } = await apiRequest<unknown>("/enderecos", { autenticado: true, tokenEsperado: token });
      if (!Array.isArray(data)) throw new ApiError("A API retornou uma lista de endereços inválida.");
      const enderecos = data.map(normalizarEndereco);
      if (new Set(enderecos.map((item) => item.id_endereco)).size !== enderecos.length) throw new ApiError("A API retornou endereços duplicados.");
      if (versao === sessao && atual === revisao) publicar({ ...estado, enderecos, idSelecionado: escolher(enderecos, estado.idSelecionado), carregado: true });
    } catch (erro) {
      if (versao === sessao && atual === revisao) publicar({ ...estado, carregado: false, erro: mensagem(erro) });
    } finally {
      if (versao === sessao && atual === revisao) publicar({ ...estado, carregando: false });
    }
  })();
  consultaPendente = consulta;
  void consulta.then(() => { if (consultaPendente === consulta) consultaPendente = null; });
  return consulta;
}

// Seleção para a compra é local à sessão; principal é uma preferência salva na API.
export function selecionarEndereco(id: number) {
  validarId(id);
  if (!estado.carregado || estado.carregando || estado.processando || estado.erro) throw new ApiError("Atualize os endereços antes de selecionar.");
  if (!estado.enderecos.some((item) => item.id_endereco === id)) throw new ApiError("O endereço não pertence à lista atual do cliente.");
  publicar({ ...estado, idSelecionado: id });
}

export function validarDadosEndereco(dados: DadosEndereco): DadosEndereco {
  const limites = { nome_endereco: 30, endereco: 40, numero: 6, bairro: 40, cidade: 40 } as const;
  const normalizado = { ...dados };
  for (const [chave, limite] of Object.entries(limites)) {
    const campo = chave as keyof typeof limites;
    if (typeof dados[campo] !== "string" || !dados[campo].trim() || [...dados[campo].trim()].length > limite) {
      throw new ApiError(`Preencha ${campo === "nome_endereco" ? "o nome do endereço" : campo === "endereco" ? "o logradouro" : campo === "numero" ? "o número" : campo === "bairro" ? "o bairro" : "a cidade"} (até ${limite} caracteres).`);
    }
    normalizado[campo] = dados[campo].trim();
  }
  if (typeof dados.uf !== "string" || !/^[a-z]{2}$/i.test(dados.uf.trim())) throw new ApiError("Informe uma UF com duas letras.");
  if (typeof dados.cep !== "string" || !/^\d{5}-?\d{3}$/.test(dados.cep.trim())) throw new ApiError("Informe um CEP válido com oito dígitos.");
  if (dados.complemento !== null && (typeof dados.complemento !== "string" || [...dados.complemento.trim()].length > 50)) throw new ApiError("O complemento deve ter até 50 caracteres.");
  // Lista explícita: identidade e principal nunca vêm de campos extras do formulário.
  return { nome_endereco: normalizado.nome_endereco, endereco: normalizado.endereco, numero: normalizado.numero,
    bairro: normalizado.bairro, cidade: normalizado.cidade, complemento: dados.complemento?.trim() || null,
    uf: dados.uf.trim().toUpperCase(), cep: dados.cep.trim().replace("-", "") };
}

async function alterar(rota: string, metodo: string, json?: DadosEndereco) {
  if (bloqueio) throw new ApiError("Aguarde a alteração do endereço em andamento.");
  const chave = {};
  bloqueio = chave;
  const versao = sessao;
  publicar({ ...estado, processando: true, erro: "" });
  try {
    const token = await lerToken();
    if (versao !== sessao) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
    await apiRequest(rota, { autenticado: true, tokenEsperado: token, method: metodo, ...(json ? { json } : {}) });
    if (versao !== sessao) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
    // Sucesso da alteração é independente da atualização seguinte: não repetir um POST confirmado.
    revisao += 1;
    consultaPendente = null;
    publicar({ ...estado, carregado: false });
    await carregarEnderecos();
  } catch (erro) {
    if (versao === sessao) publicar({ ...estado, erro: mensagem(erro) });
    throw erro;
  } finally {
    if (bloqueio === chave) {
      bloqueio = null;
      publicar({ ...estado, processando: false });
    }
  }
}

export async function salvarEndereco(dados: DadosEndereco, id?: number) {
  const corpo = validarDadosEndereco(dados);
  if (id !== undefined) validarId(id);
  await alterar(id === undefined ? "/enderecos" : `/enderecos/${id}`, id === undefined ? "POST" : "PATCH", corpo);
}
export async function consultarEndereco(id: number): Promise<Endereco> {
  validarId(id);
  const versao = sessao;
  const token = await lerToken();
  if (versao !== sessao) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
  const { data } = await apiRequest<unknown>(`/enderecos/${id}`, { autenticado: true, tokenEsperado: token });
  if (versao !== sessao) throw new ApiError("A sessão foi alterada. Tente novamente.", 409);
  const endereco = normalizarEndereco(data);
  if (endereco.id_endereco !== id) throw new ApiError("A API retornou outro endereço.");
  return endereco;
}
export async function excluirEndereco(id: number) {
  validarId(id);
  await alterar(`/enderecos/${id}`, "DELETE");
}
export async function definirEnderecoPrincipal(id: number) {
  validarId(id);
  await alterar(`/enderecos/${id}/principal`, "PUT");
}
