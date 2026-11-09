export interface Cliente {
  id_cliente: number;
  nome_cliente: string;
  email_cliente: string;
  telefone_cliente: string | null;
  tipo_cliente?: "PF" | "PJ";
  cpf_cnpj_cliente: string | null;
  data_nasc_cliente: string | null;
  foto_cliente: string | null;
}

export interface DadosPerfil {
  nome_cliente: string;
  tipo_cliente: "PF" | "PJ";
  cpf_cnpj_cliente: string;
  data_nasc_cliente: string;
  email_cliente: string;
  telefone_cliente: string;
}
