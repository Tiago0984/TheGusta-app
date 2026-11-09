const assert = require("node:assert/strict");
const test = require("node:test");
const { ambiente } = require("./ambiente.cjs");

const resposta = (data, status = 200) => Response.json({ success: status < 400, data, message: status >= 400 ? "Falha de teste." : undefined }, { status });
const endereco = { id_endereco: 5, nome_endereco: "Casa", endereco: "Rua A", numero: "10", complemento: null, bairro: "Centro", cidade: "São Paulo", uf: "SP", cep: "01001-000", principal_endereco: "SIM", status_endereco: "ATIVO" };
const outro = { ...endereco, id_endereco: 6, nome_endereco: "Trabalho", principal_endereco: "NAO" };
const formulario = { nome_endereco: " Casa ", endereco: " Rua A ", numero: " 10 ", complemento: " ", bairro: "Centro", cidade: "São Paulo", uf: "sp", cep: "01001-000" };
const pedido = { id_venda: 8, valor_venda: "18.00", status_venda: "PENDENTE", status_descricao_venda: "Aguardando confirmação", entrega_venda: "NAO", data_venda: "2026-10-27T14:20:11.000000Z", data_entrega_venda: null, itens: [{ id_item: 12, qtde_item: "4", produto: { nome_produto: "Doce", foto_produto: null } }] };
const meta = { pagina_atual: 1, ultima_pagina: 2, por_pagina: 10, total: 11 };
const historico = (data = [pedido], paginacao = meta) => Response.json({ success: true, data, meta: paginacao });
function adiada() { let resolver; const promessa = new Promise((resolve) => { resolver = resolve; }); return { promessa, resolver }; }

test("endereços consultam com Bearer, normalizam IDs e mantêm seleção separada do principal", async () => {
  let lista = [{ ...endereco, id_endereco: "5" }, outro];
  const app = ambiente(() => resposta(lista), { token: "a" });
  const service = app.carregar("services/enderecos");
  await service.carregarEnderecos();
  assert.equal(service.estadoEnderecos().idSelecionado, 5);
  service.selecionarEndereco(6);
  await service.carregarEnderecos();
  assert.equal(service.estadoEnderecos().idSelecionado, 6);
  assert.equal(service.estadoEnderecos().enderecos[0].principal_endereco, "SIM");
  lista = [endereco];
  await service.carregarEnderecos();
  assert.equal(service.estadoEnderecos().idSelecionado, 5);
  assert.throws(() => service.selecionarEndereco(999), /não pertence/);
  assert.ok(app.chamadas.every((c) => c.url.endsWith("/enderecos") && c.headers.get("Authorization") === "Bearer a"));
});

test("endereços vazios não inventam destino e consultas simultâneas compartilham GET", async () => {
  const app = ambiente(() => resposta([]), { token: "a" });
  const service = app.carregar("services/enderecos");
  await Promise.all([service.carregarEnderecos(), service.carregarEnderecos()]);
  assert.equal(app.chamadas.length, 1);
  assert.equal(service.estadoEnderecos().carregado, true);
  assert.equal(service.estadoEnderecos().idSelecionado, null);
  assert.throws(() => service.selecionarEndereco(5), /não pertence/);
});

test("endereços recusam resposta inválida, duplicada ou inativa sem simular lista vazia", async () => {
  for (const data of [null, {}, [null], [{}], [endereco, endereco], [{ ...endereco, id_endereco: true }], [{ ...endereco, numero: null }], [{ ...endereco, complemento: {} }], [{ ...endereco, status_endereco: "INATIVO" }]]) {
    const app = ambiente(() => resposta(data), { token: "a" });
    const service = app.carregar("services/enderecos");
    await service.carregarEnderecos();
    assert.equal(service.estadoEnderecos().carregado, false);
    assert.ok(service.estadoEnderecos().erro);
    assert.throws(() => service.selecionarEndereco(5), /Atualize/);
  }
});

test("cadastro e edição de endereço enviam somente campos documentados e recarregam após confirmação", async () => {
  let lista = [];
  const app = ambiente((url, op) => {
    if (op.method === "POST" || op.method === "PATCH") { lista = [{ ...endereco, ...JSON.parse(op.body) }]; return resposta(lista[0], op.method === "POST" ? 201 : 200); }
    return resposta(lista);
  }, { token: "a" });
  const service = app.carregar("services/enderecos");
  await service.salvarEndereco({ ...formulario, id_cliente: 999, id_endereco: 777, principal_endereco: "SIM", status_endereco: "INATIVO" });
  const corpo = JSON.parse(app.chamadas[0].body);
  assert.deepEqual(corpo, { nome_endereco: "Casa", endereco: "Rua A", numero: "10", complemento: null, bairro: "Centro", cidade: "São Paulo", uf: "SP", cep: "01001000" });
  assert.equal(service.estadoEnderecos().enderecos.length, 1);
  await service.salvarEndereco({ ...formulario, numero: "11", cep: "02002-000" }, 5);
  assert.equal(app.chamadas[2].method, "PATCH");
  assert.ok(app.chamadas[2].url.endsWith("/enderecos/5"));
  assert.equal(service.estadoEnderecos().enderecos[0].numero, "11");
  assert.equal(service.estadoEnderecos().enderecos[0].cep, "02002000");
});

test("validação de endereço impede requisição com campos ausentes, longos, UF ou CEP inválidos", async () => {
  const app = ambiente(() => resposta(null), { token: "a" });
  const service = app.carregar("services/enderecos");
  for (const campos of [{ nome_endereco: " " }, { nome_endereco: "x".repeat(31) }, { endereco: "x".repeat(41) }, { numero: "1234567" }, { bairro: "" }, { cidade: null }, { uf: "S1" }, { uf: "SPA" }, { cep: "abc01001000" }, { cep: "01001" }, { complemento: "x".repeat(51) }]) {
    await assert.rejects(service.salvarEndereco({ ...formulario, ...campos }));
  }
  await assert.rejects(service.salvarEndereco(formulario, 0));
  assert.equal(app.chamadas.length, 0);
});

test("principal e exclusão usam rotas autenticadas e seleção inválida recebe novo destino", async () => {
  let lista = [endereco, outro];
  const app = ambiente((url, op) => {
    if (op.method === "PUT") { lista = lista.map((e) => ({ ...e, principal_endereco: e.id_endereco === 6 ? "SIM" : "NAO" })); return resposta(lista[1]); }
    if (op.method === "DELETE") { lista = lista.filter((e) => e.id_endereco !== 5); return new Response(null, { status: 204 }); }
    return resposta(lista);
  }, { token: "a" });
  const service = app.carregar("services/enderecos");
  await service.carregarEnderecos();
  await service.definirEnderecoPrincipal(6);
  assert.equal(service.estadoEnderecos().idSelecionado, 5);
  assert.equal(service.estadoEnderecos().enderecos[1].principal_endereco, "SIM");
  await service.excluirEndereco(5);
  assert.equal(service.estadoEnderecos().idSelecionado, 6);
  assert.ok(app.chamadas.some((c) => c.method === "PUT" && c.url.endsWith("/enderecos/6/principal") && !c.body));
  assert.ok(app.chamadas.some((c) => c.method === "DELETE" && c.url.endsWith("/enderecos/5")));
});

test("alterações de endereço bloqueiam envio concorrente e liberam nova tentativa", async () => {
  const inicio = adiada(); const liberar = adiada();
  const app = ambiente(async (_url, op) => { if (op.method === "POST") { inicio.resolver(); await liberar.promessa; return resposta(endereco, 201); } return resposta([endereco]); }, { token: "a" });
  const service = app.carregar("services/enderecos");
  const primeiro = service.salvarEndereco(formulario);
  await inicio.promessa;
  await assert.rejects(service.salvarEndereco(formulario), /Aguarde/);
  await assert.rejects(service.excluirEndereco(5), /Aguarde/);
  liberar.resolver(); await primeiro;
  assert.equal(service.estadoEnderecos().processando, false);
  assert.equal(app.chamadas.filter((c) => c.method === "POST").length, 1);
});

test("erro ao alterar endereço preserva dados e exige nova leitura antes de selecionar", async () => {
  let falhar = true;
  const app = ambiente((_url, op) => op.method === "PATCH" && falhar ? resposta(null, 422) : resposta([endereco]), { token: "a" });
  const service = app.carregar("services/enderecos");
  await service.carregarEnderecos();
  await assert.rejects(service.salvarEndereco(formulario, 5), /Falha de teste/);
  assert.equal(service.estadoEnderecos().enderecos[0].id_endereco, 5);
  assert.throws(() => service.selecionarEndereco(5), /Atualize/);
  falhar = false; await service.carregarEnderecos(); service.selecionarEndereco(5);
  assert.equal(service.estadoEnderecos().erro, "");
});

test("cadastro confirmado não falha nem repete POST quando somente a consulta seguinte falha", async () => {
  let falhar = true;
  const app = ambiente((_url, op) => op.method === "POST" ? resposta(endereco, 201) : falhar ? resposta(null, 500) : resposta([endereco]), { token: "a" });
  const service = app.carregar("services/enderecos");
  await service.salvarEndereco(formulario);
  assert.ok(service.estadoEnderecos().erro);
  assert.equal(service.estadoEnderecos().carregado, false);
  falhar = false; await service.carregarEnderecos();
  assert.equal(app.chamadas.filter((c) => c.method === "POST").length, 1);
});

test("consulta de endereço individual valida ID, resposta e propriedade no servidor", async () => {
  const app = ambiente(() => resposta(endereco), { token: "a" });
  const service = app.carregar("services/enderecos");
  assert.equal((await service.consultarEndereco(5)).nome_endereco, "Casa");
  await assert.rejects(service.consultarEndereco(6), /outro endereço/);
  await assert.rejects(service.consultarEndereco(-1), /inválido/);
  assert.equal(app.chamadas.length, 2);
  const negado = ambiente(() => resposta(null, 404), { token: "b" });
  await assert.rejects(negado.carregar("services/enderecos").consultarEndereco(5), { status: 404 });
});

test("troca de conta limpa lista e seleção e descarta GET antigo", async () => {
  const inicio = adiada(); const liberar = adiada();
  const app = ambiente(async (_url, op) => {
    if (op.headers.get("Authorization") === "Bearer a") { inicio.resolver(); await liberar.promessa; return resposta([endereco]); }
    return resposta([{ ...outro, id_endereco: 90 }]);
  }, { token: "a" });
  const service = app.carregar("services/enderecos");
  const antiga = service.carregarEnderecos(); await inicio.promessa;
  await app.carregar("services/sessao").salvarToken("b");
  assert.equal(service.estadoEnderecos().enderecos.length, 0);
  assert.equal(service.estadoEnderecos().idSelecionado, null);
  await service.carregarEnderecos(); liberar.resolver(); await antiga;
  assert.equal(service.estadoEnderecos().idSelecionado, 90);
  assert.equal(service.estadoEnderecos().enderecos.length, 1);
});

test("GET anterior ao salvamento não desfaz lista atualizada", async () => {
  const inicio = adiada(); const liberar = adiada(); let leituras = 0;
  const app = ambiente(async (_url, op) => {
    if (op.method === "PATCH") return resposta({ ...endereco, numero: "20" });
    if (++leituras === 1) { inicio.resolver(); await liberar.promessa; return resposta([endereco]); }
    return resposta([{ ...endereco, numero: "20" }]);
  }, { token: "a" });
  const service = app.carregar("services/enderecos");
  const antiga = service.carregarEnderecos(); await inicio.promessa;
  await service.salvarEndereco({ ...formulario, numero: "20" }, 5);
  liberar.resolver(); await antiga;
  assert.equal(service.estadoEnderecos().enderecos[0].numero, "20");
});

test("resposta de alteração da conta anterior não afeta a nova sessão", async () => {
  const inicio = adiada(); const liberar = adiada();
  const app = ambiente(async (_url, op) => { if (op.method === "POST") { inicio.resolver(); await liberar.promessa; return resposta(endereco, 201); } return resposta([outro]); }, { token: "a" });
  const service = app.carregar("services/enderecos");
  const rejeicao = assert.rejects(service.salvarEndereco(formulario), { status: 409 });
  await inicio.promessa;
  await app.carregar("services/sessao").salvarToken("b");
  await service.carregarEnderecos(); liberar.resolver(); await rejeicao;
  assert.equal(service.estadoEnderecos().enderecos[0].id_endereco, 6);
  assert.equal(service.estadoEnderecos().erro, "");
});

test("endereço sem sessão usa expiração central e não consulta a API", async () => {
  const app = ambiente(() => { throw new Error("Não enviar"); });
  const service = app.carregar("services/enderecos");
  await service.carregarEnderecos();
  assert.equal(app.chamadas.length, 0);
  assert.deepEqual(app.navegacoes, ["/"]);
  assert.equal(service.estadoEnderecos().carregado, false);
});

test("histórico preserva meta, filtros, nulos e total recebido sem recalcular preços", async () => {
  const app = ambiente(() => historico([{ ...pedido, id_venda: "8", itens: [{ id_item: "12", qtde_item: "4", produto: null }] }]), { token: "a" });
  const dados = await app.carregar("services/pedidos").consultarPedidos(1, "PENDENTE");
  assert.ok(app.chamadas[0].url.endsWith("/pedidos?page=1&por_pagina=10&status=PENDENTE"));
  assert.equal(app.chamadas[0].headers.get("Authorization"), "Bearer a");
  assert.equal(dados.pagina, 1); assert.equal(dados.ultimaPagina, 2); assert.equal(dados.total, 11);
  assert.equal(dados.pedidos[0].valor_venda, 18);
  assert.equal(dados.pedidos[0].itens[0].produto, null);
  assert.equal(dados.pedidos[0].itens[0].qtde_item, 4);
});

test("histórico aceita lista vazia e paginação numérica como texto", async () => {
  const app = ambiente(() => historico([], { pagina_atual: "1", ultima_pagina: "1", por_pagina: "10", total: "0" }), { token: "a" });
  const dados = await app.carregar("services/pedidos").consultarPedidos();
  assert.equal(dados.total, 0); assert.equal(dados.pedidos.length, 0);
  assert.ok(!app.chamadas[0].url.includes("status="));
});

test("histórico valida parâmetros antes de enviar requisição", async () => {
  const app = ambiente(() => historico(), { token: "a" });
  const service = app.carregar("services/pedidos");
  for (const pagina of [0, -1, 1.5, "1", NaN]) await assert.rejects(service.consultarPedidos(pagina), /inválidos/);
  await assert.rejects(service.consultarPedidos(1, "QUALQUER"), /inválidos/);
  assert.equal(app.chamadas.length, 0);
});

test("histórico rejeita meta ausente, incompleta, de outra página e limites inválidos", async () => {
  for (const paginacao of [null, {}, { ...meta, pagina_atual: 2 }, { ...meta, ultima_pagina: 0 }, { ...meta, por_pagina: 100 }, { ...meta, total: -1 }, { ...meta, total: true }]) {
    const app = ambiente(() => historico([], paginacao), { token: "a" });
    await assert.rejects(app.carregar("services/pedidos").consultarPedidos(), /histórico inválido/);
  }
});

test("histórico rejeita pedidos inválidos e duplicados sem substituir por exemplos", async () => {
  for (const data of [null, {}, [null], [pedido, pedido], ...[
    { id_venda: 0 }, { valor_venda: null }, { valor_venda: -1 }, { entrega_venda: "X" }, { status_venda: "" }, { itens: null },
    { itens: [{ id_item: 1, qtde_item: 0, produto: null }] }, { itens: [{ id_item: 1, qtde_item: 1, produto: {} }] },
  ].map((campos) => [{ ...pedido, ...campos }])]) {
    const app = ambiente(() => historico(data), { token: "a" });
    await assert.rejects(app.carregar("services/pedidos").consultarPedidos(), /histórico inválido/);
  }
});

test("histórico mantém status futuros visíveis e usa descrição quando fornecida", async () => {
  const app = ambiente(() => historico([{ ...pedido, status_venda: "FUTURO", status_descricao_venda: null }]), { token: "a" });
  assert.equal((await app.carregar("services/pedidos").consultarPedidos()).pedidos[0].status_descricao_venda, "FUTURO");
});

test("histórico trata erro de API e expiração sem retornar lista fictícia", async () => {
  for (const status of [401, 422, 500]) {
    const app = ambiente(() => resposta(null, status), { token: "a" });
    await assert.rejects(app.carregar("services/pedidos").consultarPedidos(), { status });
    if (status === 401) { assert.equal(app.armazenamento.has("token"), false); assert.deepEqual(app.navegacoes, ["/"]); }
  }
});

test("histórico descarta resposta após troca de conta e retorno ao mesmo token", async () => {
  const inicio = adiada(); const liberar = adiada();
  const app = ambiente(async () => { inicio.resolver(); await liberar.promessa; return historico(); }, { token: "a" });
  const rejeicao = assert.rejects(app.carregar("services/pedidos").consultarPedidos(), { status: 409 });
  await inicio.promessa;
  const sessao = app.carregar("services/sessao");
  await sessao.salvarToken("b"); await sessao.salvarToken("a");
  liberar.resolver(); await rejeicao;
});

test("datas de pedidos tratam nulos e inválidos e preservam horário sem fuso", () => {
  const service = ambiente(() => historico()).carregar("services/pedidos");
  assert.equal(service.formatarDataPedido(null), "Não informada");
  assert.equal(service.formatarDataPedido("inválido"), "Não informada");
  assert.equal(service.formatarDataPedido("2026-02-31 15:00:00"), "Não informada");
  assert.equal(service.formatarDataPedido("2026-11-09 15:30:00"), "09/11/2026 15:30");
  assert.ok(service.formatarDataPedido("2026-11-09T15:30:00.000000Z").includes("09/11/2026"));
});
