/* global __dirname */
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("../.expo/browser-tools/node_modules/playwright");
const diretorio = path.resolve(__dirname, "../.expo/export-verificacao");
const tipos = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml" };

async function executar() {
  await fs.access(path.join(diretorio, "index.html"));
  const conexoes = new Set();
  const servidor = http.createServer(async (req, res) => {
    try {
      const rota = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      let arquivo = path.resolve(diretorio, `.${rota}`);
      if (arquivo !== diretorio && !arquivo.startsWith(diretorio + path.sep)) return res.writeHead(403).end();
      if (rota.endsWith("/")) arquivo = path.join(arquivo, "index.html");
      try { await fs.access(arquivo); } catch { arquivo += ".html"; }
      const conteudo = await fs.readFile(arquivo);
      res.writeHead(200, { "Content-Type": tipos[path.extname(arquivo)] || "application/octet-stream" }); res.end(conteudo);
    } catch { res.writeHead(404).end(); }
  });
  servidor.on("connection", (c) => { conexoes.add(c); c.once("close", () => conexoes.delete(c)); });
  await new Promise((resolve) => servidor.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  let navegador; let pagina;
  try {
    navegador = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === "win32" ? "msedge" : undefined) });
    const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 } });
    await contexto.addInitScript(() => { if (!localStorage.getItem("token")) localStorage.setItem("token", "sessao-a"); });
    const padrao = { id_venda: 3, data_venda: "2026-11-09T12:00:00Z", status_venda: "PENDENTE", status_descricao_venda: "Aguardando confirmação",
      entrega_venda: "SIM", data_entrega_venda: "2026-11-15T18:30:00Z", valor_venda: 54.54, subtotal_venda: 60.6, valor_desconto_venda: 6.06,
      forma_pagamento_venda: "PIX", observacao_venda: "Sem granulado", cupom: { codigo_cupom: "TESTE10" },
      endereco: { nome_endereco: "Casa", endereco: "Rua A", numero: "1", complemento: "Ap. 2", bairro: "Centro", cidade: "São Paulo", uf: "SP", cep: "01001-000" },
      itens: [{ id_item: 1, qtde_item: 3, valor_unit_item: 14.9, status_item: "ATIVO", produto: { nome_produto: "Bolo de teste", foto_produto: "produto/inexistente.png" } }] };
    const pedidos = new Map([3, 4, 5, 6, 7, 10, 11, 12].map((id) => [id, { ...structuredClone(padrao), id_venda: id }]));
    Object.assign(pedidos.get(4), { entrega_venda: "NAO", status_venda: "PRONTO", status_descricao_venda: "Pronto para retirada ou envio", data_venda: null, data_entrega_venda: "inválida", cupom: null, observacao_venda: null, forma_pagamento_venda: "DINHEIRO", valor_venda: 0, subtotal_venda: 0, valor_desconto_venda: 0,
      itens: [{ id_item: 1, qtde_item: 1, valor_unit_item: 0, produto: null }] });
    Object.assign(pedidos.get(5), { status_venda: "ENTREGUE", status_descricao_venda: "Concluído", forma_pagamento_venda: "CARTAO", endereco: null });
    Object.assign(pedidos.get(6), { status_venda: "CANCELADO", status_descricao_venda: "Cancelado" });
    Object.assign(pedidos.get(7), { status_venda: "FUTURO", status_descricao_venda: "Status novo do servidor", forma_pagamento_venda: "OUTRA", itens: [] });
    const chamadas = []; const erros = [];
    let falharDetalhe = false; let falharStatus = false; let recusarCancelamento = true;
    await contexto.route("**/*", (route) => new URL(route.request().url()).origin === base ? route.continue() : route.abort("blockedbyclient"));
    await contexto.route("**/api/v1/**", async (route) => {
      const req = route.request(); const rota = new URL(req.url()).pathname.split("/api/v1")[1];
      const headers = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PUT,OPTIONS", "access-control-allow-headers": "Content-Type,Authorization,Accept" };
      if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers });
      const token = (req.headers().authorization || "").replace("Bearer ", ""); chamadas.push({ rota, metodo: req.method(), token });
      let data; let meta; let status = 200; let message;
      if (rota === "/auth/login") data = { token: "sessao-b" };
      else if (rota === "/cliente") data = { id_cliente: token === "sessao-b" ? 2 : 1, nome_cliente: "Cliente simulado", email_cliente: "teste@example.com", telefone_cliente: null, cpf_cnpj_cliente: null, data_nasc_cliente: null, foto_cliente: null };
      else if (["/banners", "/produtos", "/categorias", "/favoritos"].includes(rota)) data = [];
      else if (rota === "/pedidos") { data = token === "sessao-b" ? [] : [...pedidos.values()]; meta = { pagina_atual: 1, ultima_pagina: 1, total: data.length, por_pagina: 10 }; }
      else if (/^\/pedidos\/\d+/.test(rota)) {
        const pedido = token === "sessao-b" ? null : pedidos.get(Number(rota.split("/")[2]));
        if (!pedido) { status = 404; message = "Recurso não encontrado."; }
        else if (rota.endsWith("/cancelar")) {
          await new Promise((resolve) => setTimeout(resolve, 120));
          if (recusarCancelamento || pedido.status_venda !== "PENDENTE") {
            pedido.status_venda = "CONFIRMADO"; pedido.status_descricao_venda = "Pedido confirmado";
            status = 422; message = "Este pedido não pode mais ser cancelado. Entre em contato com a confeitaria.";
          } else {
            pedido.status_venda = "CANCELADO"; pedido.status_descricao_venda = "Cancelado";
            pedido.itens.forEach((i) => { i.status_item = "CANCELADO"; });
            data = { id_venda: pedido.id_venda, status_venda: "CANCELADO", status_descricao_venda: "Cancelado", itens: pedido.itens.map((i) => ({ id_item: i.id_item, status_item: i.status_item })) };
          }
        } else if (rota.endsWith("/status")) {
          if (falharStatus) { status = 500; message = "Status indisponível no teste."; }
          else data = { id_venda: pedido.id_venda, status_venda: pedido.status_venda, status_descricao_venda: pedido.status_descricao_venda, atualizado_em_venda: "2026-11-09T15:00:00Z" };
        } else if (falharDetalhe) { status = 500; message = "Detalhe indisponível no teste."; }
        else data = pedido;
      } else { status = 500; message = `Chamada não prevista: ${rota}`; }
      return route.fulfill({ status, headers, contentType: "application/json", body: JSON.stringify({ success: status < 400, data, meta, message }) });
    });
    pagina = await contexto.newPage(); pagina.on("pageerror", (erro) => erros.push(erro.message));
    const botao = (name) => pagina.getByRole("button", { name, exact: true });
    const texto = (value) => pagina.getByText(value, { exact: true }).filter({ visible: true });
    const alerta = (value) => pagina.getByRole("alert").filter({ visible: true, hasText: value }).waitFor();
    const statusAtual = (value) => pagina.getByLabel(`Status do pedido: ${value}`, { exact: true }).filter({ visible: true }).waitFor();
    const abrir = async (id) => { await pagina.goto(`${base}/detalhe-pedido?id=${id}`); await texto(`Pedido #${id}`).waitFor(); };
    const contar = (rota, metodo) => chamadas.filter((c) => c.rota === rota && (!metodo || c.metodo === metodo)).length;

    for (const rota of ["/detalhe-pedido", "/detalhe-pedido?id=x", "/detalhe-pedido?id=0", "/detalhe-pedido?id=3&id=4"]) {
      await pagina.goto(base + rota); await alerta("Abra um pedido pelo seu histórico");
    }
    assert.equal(chamadas.length, 0);
    await abrir(3); await statusAtual("Aguardando confirmação");
    await pagina.getByLabel(/^Total do pedido: R\$\s*54,54$/).waitFor();
    await pagina.getByLabel(/^Subtotal do pedido: R\$\s*60,60$/).waitFor();
    await texto("Rua A, 1 - Ap. 2").waitFor(); await texto("TESTE10").waitFor(); await texto("Sem granulado").waitFor();
    assert.equal(await texto("Taxa de entrega").count(), 0);
    await pagina.reload(); await statusAtual("Aguardando confirmação");
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/detalhe-pedido-web.png"), fullPage: true });
    await botao("Cancelar pedido").click(); await botao("Manter pedido").click(); assert.equal(contar("/pedidos/3/cancelar"), 0);
    await botao("Cancelar pedido").click(); await botao("Confirmar cancelamento").click(); await alerta("Este pedido não pode mais ser cancelado");
    assert.equal(await botao("Cancelar pedido").isDisabled(), true);
    await botao("Atualizar pedido").click(); await statusAtual("Pedido confirmado"); assert.equal(await botao("Cancelar pedido").count(), 0);

    await abrir(4); await pagina.getByLabel("Pronto para retirada: etapa atual", { exact: true }).waitFor();
    await texto("1 × Produto indisponível").waitFor(); await texto("Dinheiro").waitFor(); await texto("Sem cupom").waitFor();
    await texto("Nenhuma observação para seu pedido.").waitFor();
    assert.equal(await texto("Endereço de entrega").count(), 0);
    await texto("Data desejada para retirada: Não informada").waitFor();
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/pedido-retirada-web.png"), fullPage: true });
    await abrir(5); await statusAtual("Concluído"); await texto("Cartão").waitFor(); await texto("Endereço indisponível.").waitFor();
    await pagina.getByLabel("Entrega realizada: concluída", { exact: true }).waitFor(); assert.equal(await botao("Cancelar pedido").count(), 0);
    await abrir(6); await texto("Pedido cancelado.").waitFor(); assert.equal(await pagina.getByLabel(/etapa atual|: concluída/).count(), 0);
    await abrir(7); await statusAtual("Status novo do servidor"); await texto("Nenhum item informado.").waitFor(); await texto("OUTRA").waitFor();

    await abrir(10); recusarCancelamento = false;
    await botao("Cancelar pedido").click(); await botao("Confirmar cancelamento").evaluate((e) => { e.click(); e.click(); });
    await statusAtual("Cancelado"); assert.equal(contar("/pedidos/10/cancelar", "PUT"), 1);
    assert.equal(contar("/pedidos/10", "GET"), 1);
    assert.equal(await botao("Cancelar pedido").count(), 0);
    falharDetalhe = true; await botao("Atualizar pedido").click(); await alerta("Detalhe indisponível");
    assert.equal(contar("/pedidos/10/cancelar", "PUT"), 1);
    falharDetalhe = false; await botao("Tentar novamente").click(); await statusAtual("Cancelado");

    await abrir(11); const consultas = contar("/pedidos/11");
    await Promise.all([pagina.waitForResponse((r) => r.url().endsWith("/pedidos/11/status")), botao("Atualizar status").click()]);
    await statusAtual("Aguardando confirmação");
    assert.equal(contar("/pedidos/11"), consultas);
    pedidos.get(11).status_venda = "EM_PREPARO"; pedidos.get(11).status_descricao_venda = "Em preparo";
    await botao("Atualizar status").click(); await pagina.getByLabel("Em preparo: etapa atual", { exact: true }).waitFor();
    assert.equal(contar("/pedidos/11"), consultas + 1);
    falharStatus = true; await botao("Atualizar status").click(); await alerta("Status indisponível");
    falharStatus = false; await botao("Atualizar pedido").click(); await statusAtual("Em preparo");

    await pagina.goto(`${base}/detalhe-pedido?id=404`); await alerta("Pedido não encontrado ou indisponível para esta conta");
    assert.equal(await botao("Cancelar pedido").count(), 0);
    await pagina.goto(`${base}/`); await pagina.getByPlaceholder("E-mail", { exact: true }).fill("outra@example.com");
    await pagina.getByPlaceholder("Senha", { exact: true }).fill("senha-teste"); await pagina.getByText("Entrar", { exact: true }).click();
    await pagina.waitForURL(`${base}/home`); await pagina.goto(`${base}/detalhe-pedido?id=3`); await alerta("Pedido não encontrado ou indisponível para esta conta");
    assert.equal(await texto("Rua A, 1 - Ap. 2").count(), 0);
    assert.deepEqual(erros, []);
    assert.ok(chamadas.filter((c) => c.metodo === "PUT").every((c) => c.rota.endsWith("/cancelar")));
    console.log("Detalhe aprovado: totais da API, itens/nulos, entrega/retirada, PRONTO, conclusão, status desconhecido e abertura direta.");
    console.log("Status e cancelamento aprovados: confirmação, cliques duplos, resposta resumida, 422, falhas, atualização e isolamento entre contas.");
  } catch (erro) {
    if (pagina) await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/detalhe-pedido-falha.png"), fullPage: true }).catch(() => {});
    throw erro;
  } finally {
    if (navegador) await navegador.close();
    await new Promise((resolve) => { servidor.close(resolve); conexoes.forEach((c) => c.destroy()); });
  }
}
executar().catch((erro) => { console.error(erro); process.exitCode = 1; });
