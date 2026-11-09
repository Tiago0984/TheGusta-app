const assert = require("node:assert/strict");
const test = require("node:test");
const { ambiente } = require("./ambiente.cjs");

const resposta = (data, status = 200, message) => Response.json({ success: status < 400, data, message }, { status });
const cliente = { id_cliente: 1, nome_cliente: "Cliente inicial", email_cliente: "teste@example.com", telefone_cliente: null, cpf_cnpj_cliente: null, data_nasc_cliente: null, foto_cliente: null };
const perfil = { nome_cliente: "Nome atualizado", email_cliente: "teste@example.com", telefone_cliente: "(11)99999-0000", tipo_cliente: "PF", cpf_cnpj_cliente: "000.000.000-00", data_nasc_cliente: "2000-01-01" };
function adiada() {
  let resolver;
  const promessa = new Promise((resolve) => { resolver = resolve; });
  return { promessa, resolver };
}

const produtoSacola = { id_produto: 7, nome_produto: "Bolo", descricao_produto: "Bolo de teste", foto_produto: null, valor_produto: 75.9, status_produto: "ATIVO" };
const itemSacola = { id_produto: 7, nome_produto: "Bolo", descricao_produto: "Bolo de teste", foto_produto: null, valor_produto: 75.9, quantidade: 2 };
const listaSalva = (app, id = 1) => JSON.parse(app.armazenamento.get(`sacola_cliente_${id}`));

test("sacola identifica cliente pela API, ignora cache antigo e soma o mesmo produto", async () => {
  const app = ambiente(() => resposta({ ...cliente, id_cliente: "1" }), { token: "a", cliente: JSON.stringify({ id_cliente: 999 }) });
  const sacola = app.carregar("config/sacola");
  assert.equal((await sacola.carregarSacola()).length, 0);
  await sacola.adicionarNaSacola({ ...produtoSacola, id_produto: "7", valor_produto: "75.90" }, 2);
  await sacola.adicionarNaSacola({ ...produtoSacola, nome_produto: "Nome novo", valor_produto: 80 }, 3);
  const itens = await sacola.carregarSacola();
  assert.equal(itens.length, 1);
  assert.equal(itens[0].quantidade, 5);
  assert.equal(itens[0].nome_produto, "Nome novo");
  assert.equal(sacola.subtotalSacola(itens), 400);
  assert.equal(app.chamadas.length, 4);
  assert.ok(app.chamadas.every((c) => c.url.endsWith("/cliente") && c.headers.get("Authorization") === "Bearer a"));
  assert.equal(app.armazenamento.has("sacola_cliente_999"), false);
});

test("sacola altera, remove e limpa apenas a conta autenticada", async () => {
  const app = ambiente((_url, op) => resposta({ ...cliente, id_cliente: op.headers.get("Authorization") === "Bearer b" ? 2 : 1 }), { token: "a" });
  const sacola = app.carregar("config/sacola");
  const sessao = app.carregar("services/sessao");
  await sacola.adicionarNaSacola(produtoSacola, 2);
  await sessao.salvarToken("b");
  assert.equal((await sacola.carregarSacola()).length, 0);
  await sacola.adicionarNaSacola({ ...produtoSacola, id_produto: 8 }, 1);
  await sessao.salvarToken("a");
  assert.equal((await sacola.carregarSacola())[0].quantidade, 2);
  await sacola.alterarQuantidadeSacola(7, 99);
  assert.equal(listaSalva(app)[0].quantidade, 99);
  await sacola.alterarQuantidadeSacola(7, 1);
  await sacola.adicionarNaSacola({ ...produtoSacola, id_produto: 9 }, 1);
  await sacola.removerDaSacola(7);
  assert.equal(listaSalva(app)[0].id_produto, 9);
  await sacola.limparSacola();
  assert.deepEqual(listaSalva(app), []);
  assert.equal(listaSalva(app, 2)[0].id_produto, 8);
});

test("sacola serializa adições concorrentes sem perder unidades", async () => {
  const app = ambiente(() => resposta(cliente), { token: "a" });
  const sacola = app.carregar("config/sacola");
  await Promise.all(Array.from({ length: 8 }, () => sacola.adicionarNaSacola(produtoSacola, 1)));
  assert.equal(listaSalva(app)[0].quantidade, 8);
});

test("sacola soma em centavos e não acumula erro de ponto flutuante", () => {
  const sacola = ambiente(() => resposta(cliente)).carregar("config/sacola");
  assert.equal(sacola.subtotalSacola([{ ...itemSacola, valor_produto: 0.1, quantidade: 1 }, { ...itemSacola, valor_produto: 0.2, quantidade: 1 }]), 0.3);
});

test("sacola recusa quantidade inválida e soma acima de 99 sem alterar o salvo", async () => {
  const app = ambiente(() => resposta(cliente), { token: "a" });
  const sacola = app.carregar("config/sacola");
  for (const quantidade of [0, -1, 100, 1.2, NaN, "2"]) {
    await assert.rejects(sacola.adicionarNaSacola(produtoSacola, quantidade), /entre 1 e 99/);
    await assert.rejects(sacola.alterarQuantidadeSacola(7, quantidade), /entre 1 e 99/);
  }
  assert.equal(app.chamadas.length, 0);
  await sacola.adicionarNaSacola(produtoSacola, 99);
  await assert.rejects(sacola.adicionarNaSacola(produtoSacola, 1), /entre 1 e 99/);
  assert.equal(listaSalva(app)[0].quantidade, 99);
});

test("sacola recusa produto inativo, preço e ID inválidos antes da API", async () => {
  const app = ambiente(() => resposta(cliente), { token: "a" });
  const sacola = app.carregar("config/sacola");
  for (const campos of [{ id_produto: 0 }, { id_produto: 1.5 }, { id_produto: null }, { valor_produto: null }, { valor_produto: -1 }, { valor_produto: Infinity }, { valor_produto: "" }, { valor_produto: true }, { nome_produto: "" }, { status_produto: "INATIVO" }]) {
    await assert.rejects(sacola.adicionarNaSacola({ ...produtoSacola, ...campos }, 1));
  }
  assert.equal(app.chamadas.length, 0);
  assert.equal(app.armazenamento.has("sacola_cliente_1"), false);
});

test("sacola exige ID válido retornado pela consulta autenticada", async () => {
  for (const id_cliente of [undefined, null, 0, -1, 1.5, true, "abc"]) {
    const app = ambiente(() => resposta({ id_cliente }), { token: "a" });
    await assert.rejects(app.carregar("config/sacola").adicionarNaSacola(produtoSacola, 1), /identificar o cliente/);
    assert.equal(app.armazenamento.size, 1);
  }
});

test("sacola ausente ou expirada usa o tratamento central da sessão", async () => {
  for (const token of [undefined, "expirado"]) {
    const dados = { sacola_cliente_1: JSON.stringify([itemSacola]), ...(token ? { token } : {}) };
    const app = ambiente(() => resposta(null, 401), dados);
    await assert.rejects(app.carregar("config/sacola").carregarSacola(), { status: 401 });
    assert.equal(app.armazenamento.has("token"), false);
    assert.equal(listaSalva(app)[0].quantidade, 2);
    assert.deepEqual(app.navegacoes, ["/"]);
  }
});

test("sacola preserva JSON inválido até limpeza explícita, sem bloquear a fila", async () => {
  const app = ambiente(() => resposta(cliente), { token: "a", sacola_cliente_1: "JSON quebrado" });
  const sacola = app.carregar("config/sacola");
  await assert.rejects(sacola.carregarSacola(), { name: "ErroSacolaInvalida" });
  await assert.rejects(sacola.adicionarNaSacola(produtoSacola, 1), { name: "ErroSacolaInvalida" });
  assert.equal(app.armazenamento.get("sacola_cliente_1"), "JSON quebrado");
  await sacola.limparSacola();
  await sacola.adicionarNaSacola(produtoSacola, 1);
  assert.equal(listaSalva(app)[0].quantidade, 1);
});

test("sacola valida estrutura, duplicatas e limites dos itens recuperados", async () => {
  const dadosInvalidos = [null, {}, [null], [{}], [itemSacola, itemSacola], ...[
    { id_produto: "7" }, { id_produto: 0 }, { quantidade: 0 }, { quantidade: 100 }, { quantidade: "2" },
    { valor_produto: "10" }, { valor_produto: null }, { valor_produto: -1 }, { nome_produto: null }, { descricao_produto: null }, { foto_produto: {} },
  ].map((campos) => [{ ...itemSacola, ...campos }])];
  for (const dados of dadosInvalidos) {
    const salvo = JSON.stringify(dados);
    const app = ambiente(() => resposta(cliente), { token: "a", sacola_cliente_1: salvo });
    await assert.rejects(app.carregar("config/sacola").carregarSacola(), { name: "ErroSacolaInvalida" });
    assert.equal(app.armazenamento.get("sacola_cliente_1"), salvo);
  }
});

test("sacola informa falha de leitura e permite tentar novamente", async () => {
  const app = ambiente(() => resposta(cliente), { token: "a", sacola_cliente_1: JSON.stringify([itemSacola]) });
  const original = app.storage.getItem;
  app.storage.getItem = async (chave) => { if (chave.startsWith("sacola_")) throw new Error("Disco"); return original(chave); };
  const sacola = app.carregar("config/sacola");
  await assert.rejects(sacola.carregarSacola(), /Não foi possível ler/);
  app.storage.getItem = original;
  assert.equal((await sacola.carregarSacola())[0].quantidade, 2);
});

test("sacola informa falha de escrita, preserva itens e libera a fila", async () => {
  const app = ambiente(() => resposta(cliente), { token: "a", sacola_cliente_1: JSON.stringify([itemSacola]) });
  const original = app.storage.setItem;
  app.storage.setItem = async () => { throw new Error("Sem espaço"); };
  const sacola = app.carregar("config/sacola");
  await assert.rejects(sacola.alterarQuantidadeSacola(7, 3), /Não foi possível salvar/);
  assert.equal(listaSalva(app)[0].quantidade, 2);
  app.storage.setItem = original;
  await sacola.alterarQuantidadeSacola(7, 4);
  assert.equal(listaSalva(app)[0].quantidade, 4);
});

test("sacola não grava após troca de sessão durante a leitura", async () => {
  const app = ambiente(() => resposta(cliente), { token: "a", sacola_cliente_1: JSON.stringify([itemSacola]) });
  const inicio = adiada();
  const liberar = adiada();
  const original = app.storage.getItem;
  app.storage.getItem = async (chave) => {
    if (chave === "sacola_cliente_1") { inicio.resolver(); await liberar.promessa; }
    return original(chave);
  };
  const operacao = app.carregar("config/sacola").adicionarNaSacola(produtoSacola, 1);
  const rejeicao = assert.rejects(operacao, { status: 409 });
  await inicio.promessa;
  await app.carregar("services/sessao").salvarToken("b");
  liberar.resolver();
  await rejeicao;
  assert.equal(listaSalva(app)[0].quantidade, 2);
  assert.equal(app.armazenamento.has("sacola_cliente_2"), false);
});

test("sacola descarta operações enfileiradas da sessão anterior", async () => {
  const inicio = adiada();
  const liberar = adiada();
  const app = ambiente(async () => { inicio.resolver(); await liberar.promessa; return resposta(cliente); }, { token: "a" });
  const sacola = app.carregar("config/sacola");
  const a = assert.rejects(sacola.adicionarNaSacola(produtoSacola, 1), { status: 409 });
  const b = assert.rejects(sacola.limparSacola(), { status: 409 });
  await inicio.promessa;
  await app.carregar("services/sessao").salvarToken("b");
  liberar.resolver();
  await Promise.all([a, b]);
  assert.equal(app.chamadas.length, 1);
  assert.equal(app.armazenamento.size, 1);
});

test("escrita já iniciada termina apenas na chave capturada e rejeita resultado após troca", async () => {
  const app = ambiente((_url, op) => resposta({ ...cliente, id_cliente: op.headers.get("Authorization") === "Bearer b" ? 2 : 1 }), { token: "a" });
  const inicio = adiada();
  const liberar = adiada();
  const original = app.storage.setItem;
  app.storage.setItem = async (chave, valor) => {
    if (chave === "sacola_cliente_1") { inicio.resolver(); await liberar.promessa; }
    return original(chave, valor);
  };
  const sacola = app.carregar("config/sacola");
  const rejeicao = assert.rejects(sacola.adicionarNaSacola(produtoSacola, 2), { status: 409 });
  await inicio.promessa;
  await app.carregar("services/sessao").salvarToken("b");
  const novaOperacao = sacola.adicionarNaSacola({ ...produtoSacola, id_produto: 8 }, 1);
  liberar.resolver();
  await rejeicao;
  await novaOperacao;
  assert.equal(listaSalva(app)[0].id_produto, 7);
  assert.equal(listaSalva(app, 2)[0].id_produto, 8);
});

test("sacola detecta troca de conta e retorno ao mesmo token durante consulta", async () => {
  const inicio = adiada();
  const liberar = adiada();
  const app = ambiente(async () => { inicio.resolver(); await liberar.promessa; return resposta(cliente); }, { token: "a" });
  const rejeicao = assert.rejects(app.carregar("config/sacola").adicionarNaSacola(produtoSacola, 1), { status: 409 });
  await inicio.promessa;
  const sessao = app.carregar("services/sessao");
  await sessao.salvarToken("b");
  await sessao.salvarToken("a");
  liberar.resolver();
  await rejeicao;
  assert.equal(app.armazenamento.size, 1);
});

test("sacola falha na identificação sem escrever e sem contaminar próxima operação", async () => {
  let falhar = true;
  const app = ambiente(() => falhar ? resposta(null, 500, "Cliente indisponível.") : resposta(cliente), { token: "a" });
  const sacola = app.carregar("config/sacola");
  await assert.rejects(sacola.adicionarNaSacola(produtoSacola, 1), /Cliente indisponível/);
  assert.equal(app.armazenamento.size, 1);
  falhar = false;
  await sacola.adicionarNaSacola(produtoSacola, 1);
  assert.equal(listaSalva(app)[0].quantidade, 1);
  await assert.rejects(sacola.alterarQuantidadeSacola(999, 2), /não está mais/);
  assert.equal(listaSalva(app)[0].id_produto, 7);
});

test("catálogo preserva GET público sem enviar a sessão armazenada", async () => {
  const app = ambiente(() => resposta([{ id_produto: 7 }]), { token: "sessao-local" });
  const dados = await app.carregar("services/api").getProdutos();
  assert.equal(dados[0].id_produto, 7);
  assert.equal(app.chamadas[0].headers.get("Authorization"), null);
  assert.equal(app.chamadas[0].headers.get("Accept"), "application/json");
});

test("mensagem de validação da API chega ao chamador com status", async () => {
  const app = ambiente(() => resposta(null, 422, "E-mail já cadastrado."));
  await assert.rejects(app.carregar("services/http").apiRequest("/auth/cadastro", { method: "POST", json: {} }),
    { name: "ApiError", status: 422, message: "E-mail já cadastrado." });
});

test("HTML de erro não escapa como falha de parsing JSON", async () => {
  const app = ambiente(() => new Response("<html>erro</html>", { status: 502 }));
  await assert.rejects(app.carregar("services/http").apiRequest("/produtos"), { name: "ApiError", status: 502 });
});

test("sessão ausente não envia Bearer null nem chama a API", async () => {
  const app = ambiente(() => { throw new Error("Não deveria enviar"); }, { cliente: "cache-antigo" });
  await assert.rejects(app.carregar("services/http").apiRequest("/cliente", { autenticado: true }), { status: 401 });
  assert.equal(app.chamadas.length, 0);
  assert.equal(app.armazenamento.has("cliente"), false);
  assert.deepEqual(app.navegacoes, ["/"]);
});

test("401 autenticado sem JSON limpa a sessão e preserva device_id", async () => {
  const app = ambiente(() => new Response("", { status: 401 }), { token: "expirado", cliente: "cache", device_id: "dispositivo" });
  await assert.rejects(app.carregar("services/http").apiRequest("/cliente", { autenticado: true }), { status: 401 });
  assert.equal(app.chamadas[0].headers.get("Authorization"), "Bearer expirado");
  assert.equal(app.armazenamento.has("token"), false);
  assert.equal(app.armazenamento.has("cliente"), false);
  assert.equal(app.armazenamento.get("device_id"), "dispositivo");
  assert.deepEqual(app.navegacoes, ["/"]);
});

test("401 de login público mantém a mensagem e não encerra outra sessão", async () => {
  const app = ambiente(() => resposta(null, 401, "Credenciais inválidas."), { token: "atual" });
  await assert.rejects(app.carregar("services/auth").entrar("teste@example.com", "errada"), { message: "Credenciais inválidas." });
  assert.equal(app.armazenamento.get("token"), "atual");
  assert.equal(app.navegacoes.length, 0);
});

test("401 atrasado não apaga um novo login", async () => {
  const envio = adiada();
  const retorno = adiada();
  const app = ambiente(() => { envio.resolver(); return retorno.promessa; }, { token: "antigo" });
  const pendente = app.carregar("services/http").apiRequest("/cliente", { autenticado: true });
  await envio.promessa;
  await app.carregar("services/sessao").salvarToken("novo");
  retorno.resolver(new Response("", { status: 401 }));
  await assert.rejects(pendente, { status: 401 });
  assert.equal(app.armazenamento.get("token"), "novo");
  assert.equal(app.navegacoes.length, 0);
});

test("sucesso de uma sessão anterior é descartado", async () => {
  const envio = adiada();
  const retorno = adiada();
  const app = ambiente(() => { envio.resolver(); return retorno.promessa; }, { token: "antigo" });
  const pendente = app.carregar("services/http").apiRequest("/cliente", { autenticado: true });
  await envio.promessa;
  await app.carregar("services/sessao").salvarToken("novo");
  retorno.resolver(resposta(cliente));
  await assert.rejects(pendente, { status: 409 });
});

test("multipart preserva o body sem fixar Content-Type", async () => {
  const app = ambiente(() => resposta({ foto_cliente: "foto.jpg" }), { token: "atual" });
  const form = new FormData();
  form.append("foto_cliente", new Blob(["imagem"], { type: "image/jpeg" }), "foto.jpg");
  await app.carregar("services/http").apiRequest("/cliente/foto", { autenticado: true, method: "POST", body: form });
  assert.equal(app.chamadas[0].body, form);
  assert.equal(app.chamadas[0].headers.get("Content-Type"), null);
});

test("troca de sessão durante a leitura do JSON também descarta a resposta", async () => {
  const leitura = adiada();
  const corpo = adiada();
  const app = ambiente(() => ({
    ok: true,
    status: 200,
    json: () => { leitura.resolver(); return corpo.promessa; },
  }), { token: "antigo" });
  const pendente = app.carregar("services/http").apiRequest("/cliente", { autenticado: true });
  await leitura.promessa;
  await app.carregar("services/sessao").salvarToken("novo");
  corpo.resolver({ success: true, data: cliente });
  await assert.rejects(pendente, { status: 409 });
});

test("login usa device_id existente e salva apenas o token", async () => {
  const app = ambiente(() => resposta({ token: "novo-token" }), { device_id: "mesmo-dispositivo", cliente: "cache" });
  await app.carregar("services/auth").entrar(" teste@example.com ", "senha-teste");
  const corpo = JSON.parse(app.chamadas[0].body);
  assert.equal(corpo.device_name, "mesmo-dispositivo");
  assert.equal(corpo.email, "teste@example.com");
  assert.equal(app.armazenamento.get("token"), "novo-token");
  assert.equal(app.armazenamento.has("cliente"), false);
  assert.equal(app.armazenamento.has("senha"), false);
});

test("resposta de login sem token não inicia sessão", async () => {
  const app = ambiente(() => resposta({}));
  await assert.rejects(app.carregar("services/auth").entrar("teste@example.com", "senha"), { name: "ApiError" });
  assert.equal(app.armazenamento.has("token"), false);
});

test("consultas simultâneas compartilham uma requisição e aceitam nascimento nulo", async () => {
  const app = ambiente(() => resposta(cliente), { token: "atual" });
  const servico = app.carregar("services/cliente");
  const primeira = servico.carregarCliente();
  const segunda = servico.carregarCliente();
  assert.equal(primeira, segunda);
  await primeira;
  assert.equal(app.chamadas.length, 1);
  assert.equal(servico.estadoCliente().cliente.data_nasc_cliente, null);
  assert.equal(servico.estadoCliente().carregando, false);
});

test("salvar perfil atualiza os assinantes mesmo com resposta sem dados", async () => {
  const app = ambiente((url, opcoes) => opcoes.method === "PUT" ? resposta(undefined, 200, "Atualizado.") : resposta(cliente), { token: "atual" });
  const servico = app.carregar("services/cliente");
  await servico.carregarCliente();
  let notificacoes = 0;
  const remover = servico.observarCliente(() => { notificacoes += 1; });
  assert.equal(await servico.salvarDadosPerfil(perfil), "Atualizado.");
  assert.equal(servico.estadoCliente().cliente.nome_cliente, perfil.nome_cliente);
  assert.equal(notificacoes, 1);
  remover();
});

test("GET atrasado não sobrescreve um perfil salvo depois", async () => {
  const envio = adiada();
  const retorno = adiada();
  let atrasar = false;
  const app = ambiente((url, opcoes) => {
    if (opcoes.method === "PUT") return resposta(perfil);
    if (atrasar) { envio.resolver(); return retorno.promessa; }
    return resposta(cliente);
  }, { token: "atual" });
  const servico = app.carregar("services/cliente");
  await servico.carregarCliente();
  atrasar = true;
  const consulta = servico.carregarCliente();
  await envio.promessa;
  await servico.salvarDadosPerfil(perfil);
  retorno.resolver(resposta(cliente));
  await consulta;
  assert.equal(servico.estadoCliente().cliente.nome_cliente, perfil.nome_cliente);
});

test("PUT recusado mantém o cliente anterior sem anunciar atualização", async () => {
  const app = ambiente((url, opcoes) => opcoes.method === "PUT"
    ? resposta(null, 422, "Documento já utilizado.") : resposta(cliente), { token: "atual" });
  const servico = app.carregar("services/cliente");
  await servico.carregarCliente();
  await assert.rejects(servico.salvarDadosPerfil(perfil), { status: 422, message: "Documento já utilizado." });
  assert.equal(servico.estadoCliente().cliente.nome_cliente, cliente.nome_cliente);
});

test("troca de conta limpa o cliente compartilhado", async () => {
  const app = ambiente(() => resposta(cliente), { token: "antigo" });
  const servico = app.carregar("services/cliente");
  await servico.carregarCliente();
  await app.carregar("services/sessao").salvarToken("outro-cliente");
  assert.equal(servico.estadoCliente().cliente, null);
});

test("falha de atualização mantém dados anteriores e expõe erro para nova tentativa", async () => {
  let falhar = false;
  const app = ambiente(() => {
    if (falhar) throw new Error("Sem rede");
    return resposta(cliente);
  }, { token: "atual" });
  const servico = app.carregar("services/cliente");
  await servico.carregarCliente();
  falhar = true;
  await servico.carregarCliente();
  assert.equal(servico.estadoCliente().cliente.id_cliente, 1);
  assert.match(servico.estadoCliente().erro, /conectar ao servidor/);
  assert.equal(servico.estadoCliente().carregando, false);
});

const cadastro = {
  nome: "Cliente de teste",
  email: "teste@example.com",
  telefone: "(11)99999-0000",
  senha: "senha-teste",
  confirmarSenha: "senha-teste",
  aceitarTermos: true,
};
const redefinicao = {
  email: "teste@example.com",
  codigo: "0123",
  novaSenha: "nova-senha-teste",
  confirmarSenha: "nova-senha-teste",
};

test("cadastro envia o contrato público e inicia a sessão sem salvar senha ou cache de cliente", async () => {
  const app = ambiente(() => resposta({ token: "sessao-cadastro", cliente: { ...cliente, data_nasc_cliente: null } }), { device_id: "dispositivo-cadastro" });
  await app.carregar("services/auth").cadastrarCliente({ ...cadastro, nome: " Cliente de teste ", email: " teste@example.com " });
  const chamada = app.chamadas[0];
  assert.ok(chamada.url.endsWith("/auth/cadastro"));
  assert.equal(chamada.method, "POST");
  assert.equal(chamada.headers.get("Authorization"), null);
  assert.deepEqual(JSON.parse(chamada.body), {
    nome: cadastro.nome,
    email: cadastro.email,
    telefone: cadastro.telefone,
    senha: cadastro.senha,
    aceite_termo: true,
    device_name: "dispositivo-cadastro",
  });
  assert.equal(app.armazenamento.get("token"), "sessao-cadastro");
  assert.equal(app.armazenamento.has("cliente"), false);
  assert.equal(app.armazenamento.has("senha"), false);
});

for (const [nome, alteracoes, mensagem] of [
  ["nome vazio", { nome: "  " }, "Preencha todos os campos."],
  ["e-mail vazio", { email: "" }, "Preencha todos os campos."],
  ["telefone vazio", { telefone: "" }, "Preencha todos os campos."],
  ["e-mail inválido", { email: "email-invalido" }, "Informe um e-mail válido."],
  ["telefone incompleto", { telefone: "1199" }, "Informe um telefone válido com DDD."],
  ["telefone com letras", { telefone: "abc11999990000" }, "Informe um telefone válido com DDD."],
  ["senha curta", { senha: "1234567", confirmarSenha: "1234567" }, "A senha deve ter pelo menos 8 caracteres."],
  ["confirmação ausente", { confirmarSenha: "" }, "Preencha todos os campos."],
  ["senhas divergentes", { confirmarSenha: "senha-diferente" }, "As senhas não correspondem."],
  ["termos recusados", { aceitarTermos: false }, "Aceite os termos de uso para continuar."],
]) {
  test(`cadastro rejeita ${nome} antes de enviar dados`, async () => {
    const app = ambiente(() => { throw new Error("Não deveria enviar"); });
    await assert.rejects(app.carregar("services/auth").cadastrarCliente({ ...cadastro, ...alteracoes }), { message: mensagem });
    assert.equal(app.chamadas.length, 0);
    assert.equal(app.armazenamento.has("token"), false);
  });
}

test("cadastro recusado não inicia sessão nem esconde a mensagem da API", async () => {
  const app = ambiente(() => resposta(null, 422, "E-mail já cadastrado."));
  await assert.rejects(app.carregar("services/auth").cadastrarCliente(cadastro), { status: 422, message: "E-mail já cadastrado." });
  assert.equal(app.armazenamento.has("token"), false);
});

test("cadastro com sucesso sem token não inicia uma sessão inválida", async () => {
  const app = ambiente(() => resposta({ cliente }));
  await assert.rejects(app.carregar("services/auth").cadastrarCliente(cadastro), { message: "A API não retornou uma sessão válida." });
  assert.equal(app.armazenamento.has("token"), false);
});

test("solicitação de código envia e-mail normalizado sem expor mensagem de sucesso da API", async () => {
  const app = ambiente(() => resposta(undefined, 200, "Mensagem específica do servidor"), { token: "sessao-existente" });
  const resultado = await app.carregar("services/auth").solicitarCodigo(" teste@example.com ");
  assert.equal(resultado, undefined);
  assert.ok(app.chamadas[0].url.endsWith("/auth/esqueci-senha"));
  assert.equal(app.chamadas[0].method, "POST");
  assert.deepEqual(JSON.parse(app.chamadas[0].body), { email: "teste@example.com" });
  assert.equal(app.chamadas[0].headers.get("Authorization"), null);
  assert.equal(app.armazenamento.get("token"), "sessao-existente");
});

for (const email of ["", "  ", "sem-arroba", "nome@@example.com"]) {
  test(`solicitação rejeita e-mail inválido ${JSON.stringify(email)} sem enviar`, async () => {
    const app = ambiente(() => { throw new Error("Não deveria enviar"); });
    await assert.rejects(app.carregar("services/auth").solicitarCodigo(email), { name: "ApiError" });
    assert.equal(app.chamadas.length, 0);
  });
}

test("limite de solicitações não gera reenvio automático", async () => {
  const app = ambiente(() => resposta(null, 429, "Aguarde para solicitar outro código."));
  await assert.rejects(app.carregar("services/auth").solicitarCodigo(cadastro.email), { status: 429 });
  assert.equal(app.chamadas.length, 1);
});

for (const [nome, alteracoes] of [
  ["e-mail ausente", { email: "" }],
  ["e-mail inválido", { email: "sem-arroba" }],
  ["código incompleto", { codigo: "123" }],
  ["código longo", { codigo: "12345" }],
  ["código com letras", { codigo: "12a3" }],
  ["nova senha vazia", { novaSenha: "" }],
  ["confirmação vazia", { confirmarSenha: "" }],
  ["senha curta", { novaSenha: "1234567", confirmarSenha: "1234567" }],
  ["senhas divergentes", { confirmarSenha: "outra-senha" }],
]) {
  test(`redefinição rejeita ${nome} antes de consumir o código`, async () => {
    const app = ambiente(() => { throw new Error("Não deveria enviar"); });
    await assert.rejects(app.carregar("services/auth").redefinirSenha({ ...redefinicao, ...alteracoes }), { name: "ApiError" });
    assert.equal(app.chamadas.length, 0);
  });
}

test("redefinição valida o código antes de salvar e mantém o reset_token fora da sessão", async () => {
  const validacaoIniciada = adiada();
  const retornoValidacao = adiada();
  const app = ambiente((url) => {
    if (url.endsWith("/auth/validar-codigo")) {
      validacaoIniciada.resolver();
      return retornoValidacao.promessa;
    }
    return resposta(undefined);
  }, { token: "sessao-anterior" });
  const pendente = app.carregar("services/auth").redefinirSenha({ ...redefinicao, email: " teste@example.com " });
  await validacaoIniciada.promessa;
  assert.equal(app.chamadas.length, 1);
  assert.deepEqual(JSON.parse(app.chamadas[0].body), { email: "teste@example.com", codigo: "0123" });
  retornoValidacao.resolver(resposta({ reset_token: "token-apenas-redefinicao" }));
  await pendente;
  assert.equal(app.chamadas.length, 2);
  assert.ok(app.chamadas[1].url.endsWith("/auth/redefinir-senha"));
  assert.deepEqual(JSON.parse(app.chamadas[1].body), {
    reset_token: "token-apenas-redefinicao",
    nova_senha: redefinicao.novaSenha,
    nova_senha_confirmation: redefinicao.confirmarSenha,
  });
  assert.ok(app.chamadas.every((chamada) => chamada.headers.get("Authorization") === null));
  assert.equal(app.armazenamento.get("token"), "sessao-anterior");
  assert.equal(app.armazenamento.has("reset_token"), false);
  assert.equal(app.navegacoes.length, 0);
});

for (const data of [undefined, {}, { reset_token: "" }, { reset_token: 123 }]) {
  test(`redefinição interrompe resposta sem reset_token válido ${JSON.stringify(data)}`, async () => {
    const app = ambiente(() => resposta(data));
    await assert.rejects(app.carregar("services/auth").redefinirSenha(redefinicao), { message: "Token de redefinição não recebido. Solicite um novo código." });
    assert.equal(app.chamadas.length, 1);
    assert.equal(app.armazenamento.has("reset_token"), false);
  });
}

test("código inválido ou expirado impede o segundo POST", async () => {
  const app = ambiente(() => resposta(null, 422, "Código inválido ou expirado."));
  await assert.rejects(app.carregar("services/auth").redefinirSenha(redefinicao), { status: 422, message: "Código inválido ou expirado." });
  assert.equal(app.chamadas.length, 1);
});

test("falha no salvamento da nova senha não simula sucesso nem tenta novamente", async () => {
  const app = ambiente((url) => url.endsWith("/auth/validar-codigo")
    ? resposta({ reset_token: "redefinicao" }) : resposta(null, 422, "A senha não foi aceita."));
  await assert.rejects(app.carregar("services/auth").redefinirSenha(redefinicao), { status: 422, message: "A senha não foi aceita." });
  assert.equal(app.chamadas.length, 2);
  assert.equal(app.armazenamento.size, 0);
});

test("favoritos normalizam IDs, deduplicam a lista e usam Bearer", async () => {
  const app = ambiente(() => resposta([{ id_produto: "7" }, { id_produto: 7 }, { id_produto: 2 }]), { token: "sessao" });
  const servico = app.carregar("services/favoritos");
  const primeira = servico.carregarFavoritos();
  assert.equal(primeira, servico.carregarFavoritos());
  await primeira;
  assert.equal(servico.estadoFavoritos().ids.join(","), "7,2");
  assert.equal(app.chamadas.length, 1);
  assert.equal(app.chamadas[0].headers.get("Authorization"), "Bearer sessao");
});

test("sem sessão, favoritos mantêm o catálogo público e pedem login ao alterar", async () => {
  const app = ambiente(() => { throw new Error("Não deveria enviar"); });
  const servico = app.carregar("services/favoritos");
  await servico.carregarFavoritos();
  assert.equal(await servico.alterarFavorito(7), false);
  assert.match(servico.estadoFavoritos().erro, /Faça login/);
  assert.equal(app.chamadas.length, 0);
  assert.equal(app.navegacoes.length, 0);
});

for (const lista of [null, {}, [{}], [{ id_produto: "invalido" }], [{ id_produto: 0 }]]) {
  test(`favoritos recusam lista inválida ${JSON.stringify(lista)}`, async () => {
    const app = ambiente(() => resposta(lista), { token: "sessao" });
    const servico = app.carregar("services/favoritos");
    await servico.carregarFavoritos();
    assert.equal(servico.estadoFavoritos().carregado, false);
    assert.ok(servico.estadoFavoritos().erro);
  });
}

test("POST de favorito só muda a estrela após sucesso e bloqueia toque simultâneo", async () => {
  const envio = adiada();
  const retorno = adiada();
  const app = ambiente((url, opcoes) => {
    if (opcoes.method === "POST") { envio.resolver(); return retorno.promessa; }
    return resposta([]);
  }, { token: "sessao" });
  const servico = app.carregar("services/favoritos");
  await servico.carregarFavoritos();
  const primeira = servico.alterarFavorito(7);
  const segunda = servico.alterarFavorito(7);
  await envio.promessa;
  assert.equal(servico.estadoFavoritos().ids.length, 0);
  assert.equal(servico.estadoFavoritos().processando.join(","), "7");
  retorno.resolver(resposta(undefined));
  assert.equal(await primeira, true);
  assert.equal(await segunda, false);
  assert.equal(app.chamadas.filter((chamada) => chamada.method === "POST").length, 1);
  assert.equal(servico.estadoFavoritos().ids.join(","), "7");
  assert.deepEqual(JSON.parse(app.chamadas[1].body), { id_produto: 7 });
});

test("DELETE usa o ID do produto sem body JSON", async () => {
  const app = ambiente((url, opcoes) => opcoes.method === "DELETE"
    ? new Response(null, { status: 204 }) : resposta([{ id_favorito: 999, id_produto: 7 }]), { token: "sessao" });
  const servico = app.carregar("services/favoritos");
  await servico.carregarFavoritos();
  assert.equal(await servico.alterarFavorito(7), true);
  assert.ok(app.chamadas[1].url.endsWith("/favoritos/7"));
  assert.equal(app.chamadas[1].body, undefined);
  assert.equal(app.chamadas[1].headers.get("Content-Type"), null);
  assert.equal(servico.estadoFavoritos().ids.length, 0);
});

test("erro na alteração preserva a estrela e libera nova tentativa", async () => {
  let recusar = true;
  const app = ambiente((url, opcoes) => opcoes.method === "POST"
    ? recusar ? resposta(null, 422, "Não foi possível favoritar.") : resposta(undefined) : resposta([]), { token: "sessao" });
  const servico = app.carregar("services/favoritos");
  await servico.carregarFavoritos();
  assert.equal(await servico.alterarFavorito(7), false);
  assert.equal(servico.estadoFavoritos().ids.length, 0);
  assert.equal(servico.estadoFavoritos().processando.length, 0);
  assert.equal(servico.estadoFavoritos().erro, "Não foi possível favoritar.");
  recusar = false;
  assert.equal(await servico.alterarFavorito(7), true);
});

test("consulta falha mantém os IDs anteriores e impede alterar um estado desconhecido", async () => {
  let falhar = false;
  const app = ambiente(() => falhar ? resposta(null, 500, "Favoritos indisponíveis.") : resposta([{ id_produto: 7 }]), { token: "sessao" });
  const servico = app.carregar("services/favoritos");
  await servico.carregarFavoritos();
  falhar = true;
  await servico.carregarFavoritos();
  assert.equal(await servico.alterarFavorito(7), false);
  assert.equal(servico.estadoFavoritos().ids.join(","), "7");
  assert.ok(app.chamadas.every((chamada) => !chamada.method));
});

test("GET atrasado não desfaz uma alteração de favorito confirmada", async () => {
  let atrasar = false;
  const envio = adiada();
  const retorno = adiada();
  const app = ambiente((url, opcoes) => {
    if (opcoes.method === "POST") return resposta(undefined);
    if (atrasar) { envio.resolver(); return retorno.promessa; }
    return resposta([]);
  }, { token: "sessao" });
  const servico = app.carregar("services/favoritos");
  await servico.carregarFavoritos();
  atrasar = true;
  const consulta = servico.carregarFavoritos();
  await envio.promessa;
  await servico.alterarFavorito(7);
  retorno.resolver(resposta([]));
  await consulta;
  assert.equal(servico.estadoFavoritos().ids.join(","), "7");
  assert.equal(servico.estadoFavoritos().carregando, false);
});

test("produtos diferentes podem ser alterados sem perder uma das respostas", async () => {
  const app = ambiente((url, opcoes) => resposta(opcoes.method === "POST" ? undefined : []), { token: "sessao" });
  const servico = app.carregar("services/favoritos");
  await servico.carregarFavoritos();
  await Promise.all([servico.alterarFavorito(7), servico.alterarFavorito(8)]);
  assert.equal(servico.estadoFavoritos().ids.slice().sort().join(","), "7,8");
});

test("troca de sessão limpa favoritos e uma resposta antiga não desbloqueia a operação nova", async () => {
  const envioAntigo = adiada();
  const retornoAntigo = adiada();
  const envioNovo = adiada();
  const retornoNovo = adiada();
  const app = ambiente((url, opcoes) => {
    if (opcoes.method === "DELETE") { envioAntigo.resolver(); return retornoAntigo.promessa; }
    if (opcoes.method === "POST") { envioNovo.resolver(); return retornoNovo.promessa; }
    return resposta(opcoes.headers.get("Authorization") === "Bearer antiga" ? [{ id_produto: 7 }] : []);
  }, { token: "antiga" });
  const servico = app.carregar("services/favoritos");
  await servico.carregarFavoritos();
  const antiga = servico.alterarFavorito(7);
  await envioAntigo.promessa;
  await app.carregar("services/sessao").salvarToken("nova");
  assert.equal(servico.estadoFavoritos().ids.length, 0);
  await servico.carregarFavoritos();
  const nova = servico.alterarFavorito(7);
  await envioNovo.promessa;
  retornoAntigo.resolver(new Response(null, { status: 401 }));
  await antiga;
  assert.equal(servico.estadoFavoritos().processando.join(","), "7");
  retornoNovo.resolver(resposta(undefined));
  await nova;
  assert.equal(servico.estadoFavoritos().ids.join(","), "7");
  assert.equal(app.armazenamento.get("token"), "nova");
});

async function ambienteFoto(responder, opcoes = {}) {
  const app = ambiente((url, parametros) => url.endsWith("/cliente") && !parametros.method
    ? resposta({ ...cliente, foto_cliente: "cliente/antiga.png" }) : responder(url, parametros), { token: "sessao" }, opcoes);
  await app.carregar("services/cliente").carregarCliente();
  return app;
}

function fotoWeb(tipo = "image/png", tamanho = 16) {
  return { uri: "blob:foto-local", width: 1, height: 1, fileSize: tamanho, mimeType: tipo, file: new File([new Uint8Array(tamanho)], "foto-teste", { type: tipo }) };
}

for (const [tipo, extensao] of [["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]) {
  test(`upload web aceita ${tipo}, envia multipart e atualiza apenas a foto`, async () => {
    const app = await ambienteFoto(() => resposta({ foto_cliente: "cliente/nova.png", nome_cliente: "Não sobrescrever" }));
    await app.carregar("services/foto-perfil").enviarFotoPerfil(fotoWeb(tipo), 1);
    const chamada = app.chamadas.find((item) => item.url.endsWith("/cliente/foto"));
    assert.equal(chamada.headers.get("Content-Type"), null);
    assert.equal(chamada.headers.get("Authorization"), "Bearer sessao");
    assert.equal(chamada.body.get("foto_cliente").name, `foto.${extensao}`);
    assert.equal(chamada.body.get("foto_cliente").type, tipo);
    assert.equal(app.carregar("services/cliente").estadoCliente().cliente.foto_cliente, "cliente/nova.png");
    assert.equal(app.carregar("services/cliente").estadoCliente().cliente.nome_cliente, cliente.nome_cliente);
  });
}

for (const tipo of ["image/gif", "image/heic", "application/pdf"]) {
  test(`upload recusa ${tipo} antes do POST`, async () => {
    const app = await ambienteFoto(() => { throw new Error("Não deveria enviar"); });
    await assert.rejects(app.carregar("services/foto-perfil").enviarFotoPerfil(fotoWeb(tipo), 1), { message: "Escolha uma imagem JPG, PNG ou WEBP." });
    assert.equal(app.chamadas.length, 1);
  });
}

test("upload recusa tamanho acima de 2 MB mesmo com metadado menor", async () => {
  const app = await ambienteFoto(() => { throw new Error("Não deveria enviar"); });
  await assert.rejects(app.carregar("services/foto-perfil").enviarFotoPerfil({ ...fotoWeb("image/png", 2 * 1024 * 1024 + 1), fileSize: 1 }, 1), { message: "A imagem deve ter no máximo 2 MB." });
  assert.equal(app.chamadas.length, 1);
});

test("upload aceita exatamente 2 MB", async () => {
  const app = await ambienteFoto(() => resposta({ foto_cliente: "cliente/nova.png" }));
  await app.carregar("services/foto-perfil").enviarFotoPerfil(fotoWeb("image/png", 2 * 1024 * 1024), 1);
  assert.equal(app.chamadas.length, 2);
});

test("upload web sem File lê a URI e valida o Blob", async () => {
  const app = await ambienteFoto((url) => url === "blob:foto-local"
    ? new Response(new Blob(["imagem"], { type: "image/png" })) : resposta({ foto_cliente: "cliente/nova.png" }));
  await app.carregar("services/foto-perfil").enviarFotoPerfil({ uri: "blob:foto-local", width: 1, height: 1 }, 1);
  assert.equal(app.chamadas.length, 3);
  assert.equal(app.chamadas[2].body.get("foto_cliente").type, "image/png");
});

for (const plataforma of ["android", "ios"]) {
  test(`upload ${plataforma} usa descritor nativo sem serializar a URI como texto`, async () => {
    class FormDataNativo {
      valores = new Map();
      append(chave, valor) { this.valores.set(chave, valor); }
      get(chave) { return this.valores.get(chave); }
    }
    const app = await ambienteFoto(() => resposta({ foto_cliente: "cliente/nova.jpg" }), { plataforma, FormData: FormDataNativo });
    await app.carregar("services/foto-perfil").enviarFotoPerfil({ uri: "file:///foto.jpg", mimeType: "image/jpeg", fileSize: 16, width: 1, height: 1 }, 1);
    const arquivo = app.chamadas[1].body.get("foto_cliente");
    assert.equal(arquivo.uri, "file:///foto.jpg");
    assert.equal(arquivo.type, "image/jpeg");
    assert.equal(arquivo.name, "foto.jpg");
  });
}

test("resposta de upload sem confirmação da foto preserva o estado anterior", async () => {
  const app = await ambienteFoto(() => resposta({}));
  await assert.rejects(app.carregar("services/foto-perfil").enviarFotoPerfil(fotoWeb(), 1), { name: "ApiError" });
  assert.equal(app.carregar("services/cliente").estadoCliente().cliente.foto_cliente, "cliente/antiga.png");
});

test("upload recusado não altera a foto exibida", async () => {
  const app = await ambienteFoto(() => resposta(null, 422, "Imagem não aceita."));
  await assert.rejects(app.carregar("services/foto-perfil").enviarFotoPerfil(fotoWeb(), 1), { message: "Imagem não aceita." });
  assert.equal(app.carregar("services/cliente").estadoCliente().cliente.foto_cliente, "cliente/antiga.png");
});

test("upload com o mesmo caminho renova a versão e consultas seguintes preservam o cache", async () => {
  const app = await ambienteFoto(() => resposta({ foto_cliente: "cliente/antiga.png" }));
  const antes = app.carregar("services/cliente").estadoCliente().versaoFoto;
  await app.carregar("services/foto-perfil").enviarFotoPerfil(fotoWeb(), 1);
  assert.ok(app.carregar("services/cliente").estadoCliente().versaoFoto > antes);
  const aposUpload = app.carregar("services/cliente").estadoCliente().versaoFoto;
  await app.carregar("services/cliente").carregarCliente();
  assert.equal(app.carregar("services/cliente").estadoCliente().versaoFoto, aposUpload);
});

test("seleção de outro cliente é recusada antes de enviar foto", async () => {
  const app = await ambienteFoto(() => { throw new Error("Não deveria enviar"); });
  await assert.rejects(app.carregar("services/foto-perfil").enviarFotoPerfil(fotoWeb(), 2), { name: "ApiError" });
  assert.equal(app.chamadas.length, 1);
});

test("troca de conta durante leitura da imagem impede upload na nova sessão", async () => {
  const leitura = adiada();
  const retorno = adiada();
  const app = await ambienteFoto(() => { leitura.resolver(); return retorno.promessa; });
  const pendente = app.carregar("services/foto-perfil").enviarFotoPerfil({ uri: "blob:foto-local", width: 1, height: 1 }, 1);
  await leitura.promessa;
  await app.carregar("services/sessao").salvarToken("nova-sessao");
  retorno.resolver(new Response(new Blob(["imagem"], { type: "image/png" })));
  await assert.rejects(pendente, { status: 409 });
  assert.equal(app.chamadas.filter((chamada) => chamada.url.endsWith("/cliente/foto")).length, 0);
});

test("PUT atrasado de dados pessoais não desfaz uma foto atualizada", async () => {
  const envio = adiada();
  const retorno = adiada();
  const app = await ambienteFoto((url, opcoes) => {
    if (opcoes.method === "PUT") { envio.resolver(); return retorno.promessa; }
    return resposta({ foto_cliente: "cliente/nova.png" });
  });
  const servico = app.carregar("services/cliente");
  const salvamento = servico.salvarDadosPerfil(perfil);
  await envio.promessa;
  await app.carregar("services/foto-perfil").enviarFotoPerfil(fotoWeb(), 1);
  retorno.resolver(resposta({ ...cliente, ...perfil, foto_cliente: "cliente/antiga.png" }));
  await salvamento;
  assert.equal(servico.estadoCliente().cliente.foto_cliente, "cliente/nova.png");
  assert.equal(servico.estadoCliente().cliente.nome_cliente, perfil.nome_cliente);
});
