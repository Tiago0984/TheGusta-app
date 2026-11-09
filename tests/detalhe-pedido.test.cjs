const assert = require("node:assert/strict");
const test = require("node:test");
const { ambiente } = require("./ambiente.cjs");
const resposta = (data, status = 200, message) => Response.json({ success: status < 400, data, message }, { status });
const pedido = { id_venda: 3, data_venda: "2026-11-09T12:00:00Z", status_venda: "PENDENTE", status_descricao_venda: "Aguardando confirmação", entrega_venda: "SIM", data_entrega_venda: null,
  valor_venda: "54.54", valor_desconto_venda: "6.06", subtotal_venda: "60.60", forma_pagamento_venda: "PIX", observacao_venda: null,
  itens: [{ id_item: "1", qtde_item: "3", valor_unit_item: "14.90", status_item: "ATIVO", produto: { nome_produto: "Bolo", foto_produto: null } }],
  endereco: { nome_endereco: "Casa", endereco: "Rua A", numero: "1", complemento: "Ap. 2", bairro: "Centro", cidade: "São Paulo", uf: "SP", cep: "01001-000" }, cupom: { codigo_cupom: "TESTE10" } };
const cancelado = { id_venda: 3, status_venda: "CANCELADO", status_descricao_venda: "Cancelado", itens: [{ id_item: 1, status_item: "CANCELADO" }] };
function adiada() { let resolver; const promessa = new Promise((resolve) => { resolver = resolve; }); return { promessa, resolver }; }

test("detalhe usa ID e Bearer e preserva totais retornados independentemente dos itens", async () => {
  const app = ambiente(() => resposta(pedido), { token: "a" });
  const dados = await app.carregar("services/pedidos").consultarPedido(3);
  assert.ok(app.chamadas[0].url.endsWith("/pedidos/3"));
  assert.equal(app.chamadas[0].headers.get("Authorization"), "Bearer a");
  assert.equal(dados.valor_venda, 54.54); assert.equal(dados.subtotal_venda, 60.6); assert.equal(dados.valor_desconto_venda, 6.06);
  assert.equal(dados.itens[0].valor_unit_item, 14.9); assert.equal(dados.itens[0].qtde_item, 3);
  assert.equal(dados.endereco.complemento, "Ap. 2"); assert.equal(dados.cupom.codigo_cupom, "TESTE10");
});

test("detalhe aceita produto/endereço/cupom/datas/observação nulos e endereço mínimo do PDF", async () => {
  const app = ambiente(() => resposta({ ...pedido, data_venda: null, endereco: null, cupom: null, itens: [{ ...pedido.itens[0], produto: null }] }), { token: "a" });
  const dados = await app.carregar("services/pedidos").consultarPedido(3);
  assert.equal(dados.endereco, null); assert.equal(dados.cupom, null); assert.equal(dados.itens[0].produto, null);
  const minimo = ambiente(() => resposta({ ...pedido, endereco: { nome_endereco: "Casa", endereco: "Rua A", numero: "1" } }), { token: "a" });
  assert.equal((await minimo.carregar("services/pedidos").consultarPedido(3)).endereco.bairro, null);
});

test("detalhe recusa IDs inválidos antes de usar rede", async () => {
  const app = ambiente(() => resposta(pedido), { token: "a" }); const service = app.carregar("services/pedidos");
  for (const id of [0, -1, 1.5, NaN, "3", "3/status", null]) {
    await assert.rejects(service.consultarPedido(id), /Pedido inválido/);
    await assert.rejects(service.consultarStatusPedido(id), /Pedido inválido/);
    await assert.rejects(service.cancelarPedido(id), /Pedido inválido/);
  }
  assert.equal(app.chamadas.length, 0);
});

test("detalhe recusa outro ID, estruturas e preços inválidos", async () => {
  for (const dados of [null, {}, { ...pedido, id_venda: 4 }, { ...pedido, subtotal_venda: null }, { ...pedido, valor_desconto_venda: -1 },
    { ...pedido, endereco: {} }, { ...pedido, cupom: {} }, { ...pedido, observacao_venda: {} },
    { ...pedido, itens: [{ ...pedido.itens[0], valor_unit_item: null }] }, { ...pedido, itens: [{ ...pedido.itens[0], valor_unit_item: -1 }] }]) {
    const app = ambiente(() => resposta(dados), { token: "a" });
    await assert.rejects(app.carregar("services/pedidos").consultarPedido(3), /pedido inválido/);
  }
});

test("detalhe e status preservam descrições do backend e formas de pagamento futuras", async () => {
  const app = ambiente(() => resposta({ ...pedido, status_venda: "FUTURO", status_descricao_venda: "Descrição do servidor", forma_pagamento_venda: "OUTRA" }), { token: "a" });
  const dados = await app.carregar("services/pedidos").consultarPedido(3);
  assert.equal(dados.status_descricao_venda, "Descrição do servidor"); assert.equal(dados.forma_pagamento_venda, "OUTRA");
});

test("status usa rota leve, ID esperado e data de atualização", async () => {
  const app = ambiente(() => resposta({ id_venda: "3", status_venda: "PRONTO", status_descricao_venda: "Pronto para retirada ou envio", atualizado_em_venda: "2026-11-09T15:00:00Z" }), { token: "a" });
  const dados = await app.carregar("services/pedidos").consultarStatusPedido(3);
  assert.ok(app.chamadas[0].url.endsWith("/pedidos/3/status"));
  assert.equal(dados.status_descricao_venda, "Pronto para retirada ou envio");
  assert.equal(dados.atualizado_em_venda, "2026-11-09T15:00:00Z");
});

test("status recusa ID divergente e resposta incompleta", async () => {
  for (const dados of [null, {}, { id_venda: 4, status_venda: "PRONTO" }, { id_venda: 3, status_venda: "" }]) {
    const app = ambiente(() => resposta(dados), { token: "a" });
    await assert.rejects(app.carregar("services/pedidos").consultarStatusPedido(3), /status de pedido inválido/);
  }
});

test("cancelamento usa PUT sem corpo e aceita a confirmação resumida documentada", async () => {
  const app = ambiente(() => resposta(cancelado), { token: "a" });
  const dados = await app.carregar("services/pedidos").cancelarPedido(3);
  assert.equal(dados.status_venda, "CANCELADO"); assert.equal(app.chamadas.length, 1);
  assert.ok(app.chamadas[0].url.endsWith("/pedidos/3/cancelar"));
  assert.equal(app.chamadas[0].method, "PUT"); assert.equal(app.chamadas[0].body, undefined);
});

test("cancelamento bloqueia chamadas concorrentes do mesmo pedido", async () => {
  const inicio = adiada(); const liberar = adiada();
  const app = ambiente(async () => { inicio.resolver(); await liberar.promessa; return resposta(cancelado); }, { token: "a" });
  const service = app.carregar("services/pedidos"); const primeira = service.cancelarPedido(3); await inicio.promessa;
  await assert.rejects(service.cancelarPedido(3), /Aguarde/);
  liberar.resolver(); await primeira; assert.equal(app.chamadas.length, 1);
});

test("cancelamento não simula sucesso em 422 nem em resposta sem confirmação", async () => {
  const mensagem = "Este pedido não pode mais ser cancelado. Entre em contato com a confeitaria.";
  const app = ambiente(() => resposta(null, 422, mensagem), { token: "a" });
  await assert.rejects(app.carregar("services/pedidos").cancelarPedido(3), { status: 422, message: mensagem });
  const invalido = ambiente(() => resposta({ ...cancelado, status_venda: "PENDENTE" }), { token: "a" });
  await assert.rejects(invalido.carregar("services/pedidos").cancelarPedido(3), /não foi confirmado/);
});

test("GET antigo de detalhe/status não desfaz cancelamento confirmado", async () => {
  for (const status of [false, true]) {
    const inicio = adiada(); const liberar = adiada();
    const app = ambiente(async (_url, op) => {
      if (op.method === "PUT") return resposta(cancelado);
      inicio.resolver(); await liberar.promessa; return resposta(pedido);
    }, { token: "a" });
    const service = app.carregar("services/pedidos");
    const rejeicao = assert.rejects(status ? service.consultarStatusPedido(3) : service.consultarPedido(3), { status: 409 });
    await inicio.promessa; await service.cancelarPedido(3); liberar.resolver(); await rejeicao;
  }
});

test("troca de conta descarta detalhe e cancelamento antigos sem apagar novo login", async () => {
  for (const cancelar of [false, true]) {
    const inicio = adiada(); const liberar = adiada();
    const app = ambiente(async () => { inicio.resolver(); await liberar.promessa; return resposta(cancelar ? cancelado : pedido); }, { token: "a" });
    const service = app.carregar("services/pedidos");
    const rejeicao = assert.rejects(cancelar ? service.cancelarPedido(3) : service.consultarPedido(3), { status: 409 });
    await inicio.promessa; await app.carregar("services/sessao").salvarToken("b"); liberar.resolver(); await rejeicao;
    assert.equal(app.armazenamento.get("token"), "b"); assert.equal(app.navegacoes.length, 0);
  }
});

test("detalhe preserva 404 e 401 usa a expiração central", async () => {
  for (const status of [404, 401, 500]) {
    const app = ambiente(() => resposta(null, status), { token: "a" });
    await assert.rejects(app.carregar("services/pedidos").consultarPedido(3), { status });
    if (status === 401) { assert.equal(app.armazenamento.has("token"), false); assert.deepEqual(app.navegacoes, ["/"]); }
  }
});

test("acompanhamento de retirada coloca PRONTO na etapa de retirada e finaliza todas ao concluir", () => {
  const service = ambiente(() => resposta(null)).carregar("services/pedidos");
  const etapas = service.acompanhamentoPedido("PRONTO", "NAO");
  assert.equal(etapas.length, 3); assert.equal(etapas[0].estado, "concluida");
  assert.equal(etapas[1].texto, "Pronto para retirada"); assert.equal(etapas[1].estado, "atual");
  assert.equal(etapas[2].estado, "aguardando");
  assert.ok(service.acompanhamentoPedido("ENTREGUE", "NAO").every((e) => e.estado === "concluida"));
});

test("acompanhamento distingue envio/entrega e não marca etapas em pendente, cancelado ou status desconhecido", () => {
  const service = ambiente(() => resposta(null)).carregar("services/pedidos");
  assert.equal(service.acompanhamentoPedido("EM_ENTREGA", "SIM").find((e) => e.estado === "atual").codigo, "EM_ENTREGA");
  assert.ok(service.acompanhamentoPedido("PENDENTE", "SIM").every((e) => e.estado === "aguardando"));
  assert.equal(service.acompanhamentoPedido("CANCELADO", "SIM").length, 0);
  assert.equal(service.acompanhamentoPedido("FUTURO", "SIM").length, 0);
});
