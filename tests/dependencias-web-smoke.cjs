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
      res.writeHead(200, { "Content-Type": tipos[path.extname(arquivo)] || "application/octet-stream" });
      res.end(conteudo);
    } catch { res.writeHead(404).end(); }
  });
  servidor.on("connection", (conexao) => { conexoes.add(conexao); conexao.once("close", () => conexoes.delete(conexao)); });
  await new Promise((resolve) => servidor.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  let navegador; let pagina;
  try {
    navegador = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === "win32" ? "msedge" : undefined) });
    const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 } });
    await contexto.addInitScript(() => { if (!localStorage.getItem("token")) localStorage.setItem("token", "sessao-a"); });
    const chamadas = []; const erros = [];
    const enderecos = new Map([["sessao-a", []], ["sessao-b", []]]);
    let proximoId = 5;
    let falharConsulta = false; let falharSalvar = false; let falharDepoisSalvar = false;
    let falharPagina = false; let metaInvalida = false;
    let esperaSalvar = 100;
    const estados = ["PENDENTE", "ENTREGUE", "EM_PREPARO", "CANCELADO", "PRONTO", "FUTURO"];
    const pedidos = Array.from({ length: 12 }, (_, i) => ({
      id_venda: 20 - i, valor_venda: 18 + i, status_venda: estados[i % estados.length],
      status_descricao_venda: estados[i % estados.length], entrega_venda: i % 2 ? "SIM" : "NAO",
      data_venda: "2026-11-09T15:20:00.000000Z", data_entrega_venda: i === 0 ? null : "2026-11-15T18:00:00.000000Z",
      itens: [{ id_item: i + 1, qtde_item: 2, produto: i === 0 ? null : { nome_produto: "Doce simulado", foto_produto: null } }],
    }));
    await contexto.route("**/*", (route) => new URL(route.request().url()).origin === base ? route.continue() : route.abort("blockedbyclient"));
    await contexto.route("**/api/v1/**", async (route) => {
      const req = route.request(); const url = new URL(req.url()); const rota = url.pathname.split("/api/v1")[1];
      const headers = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS", "access-control-allow-headers": "Content-Type,Authorization,Accept" };
      if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers });
      const token = (req.headers().authorization || "").replace("Bearer ", "");
      const chamada = { rota, metodo: req.method(), token, query: url.search, body: req.postData() ? req.postDataJSON() : null };
      chamadas.push(chamada);
      let data; let meta; let status = 200; let message;
      if (rota === "/auth/login") data = { token: chamada.body.email.startsWith("conta-b") ? "sessao-b" : "sessao-a" };
      else if (rota === "/cliente") data = { id_cliente: token === "sessao-b" ? 2 : 1, nome_cliente: "Cliente simulado", email_cliente: "teste@example.com", telefone_cliente: null, cpf_cnpj_cliente: null, data_nasc_cliente: null, foto_cliente: null };
      else if (["/banners", "/produtos", "/categorias", "/favoritos"].includes(rota)) data = [];
      else if (rota === "/enderecos" && req.method() === "GET") {
        if (falharConsulta) { status = 500; message = "Endereços indisponíveis no teste."; } else data = enderecos.get(token);
      } else if (rota === "/enderecos" && req.method() === "POST") {
        await new Promise((resolve) => setTimeout(resolve, esperaSalvar));
        if (falharSalvar) { status = 422; message = "Endereço recusado no teste."; }
        else {
          const lista = enderecos.get(token);
          data = { ...chamada.body, id_endereco: proximoId++, principal_endereco: lista.length ? "NAO" : "SIM", status_endereco: "ATIVO" };
          lista.push(data); status = 201;
          if (falharDepoisSalvar) falharConsulta = true;
        }
      } else if (/^\/enderecos\/\d+/.test(rota)) {
        const id = Number(rota.split("/")[2]); const lista = enderecos.get(token); const item = lista.find((e) => e.id_endereco === id);
        if (!item) { status = 404; message = "Endereço não encontrado."; }
        else if (req.method() === "GET") data = item;
        else if (req.method() === "PATCH") { Object.assign(item, chamada.body); data = item; }
        else if (req.method() === "PUT" && rota.endsWith("/principal")) { lista.forEach((e) => { e.principal_endereco = e.id_endereco === id ? "SIM" : "NAO"; }); data = item; }
        else if (req.method() === "DELETE") {
          enderecos.set(token, lista.filter((e) => e.id_endereco !== id));
          if (item.principal_endereco === "SIM" && enderecos.get(token).length) enderecos.get(token).at(-1).principal_endereco = "SIM";
        } else { status = 500; message = "Método não previsto."; }
      } else if (rota === "/pedidos" && req.method() === "GET") {
        const numero = Number(url.searchParams.get("page")); const filtro = url.searchParams.get("status");
        if (filtro === "PENDENTE") await new Promise((resolve) => setTimeout(resolve, 180));
        else await new Promise((resolve) => setTimeout(resolve, 60));
        if (numero === 2 && falharPagina) { status = 500; message = "Segunda página indisponível no teste."; }
        else {
          const lista = token === "sessao-b" ? [] : pedidos.filter((p) => !filtro || p.status_venda === filtro);
          data = !filtro && numero === 2 ? lista.slice(9) : lista.slice((numero - 1) * 10, numero * 10);
          meta = metaInvalida ? null : { pagina_atual: numero, ultima_pagina: Math.max(1, Math.ceil(lista.length / 10)), por_pagina: 10, total: lista.length };
        }
      } else { status = 500; message = `Chamada não prevista: ${req.method()} ${rota}`; }
      return route.fulfill({ status, headers, contentType: "application/json", body: JSON.stringify({ success: status < 400, data, meta, message }) });
    });
    pagina = await contexto.newPage(); pagina.on("pageerror", (erro) => erros.push(erro.message));
    const botao = (name) => pagina.getByRole("button", { name, exact: true });
    const texto = (value) => pagina.getByText(value, { exact: true }).filter({ visible: true });
    const alerta = (value) => pagina.getByRole("alert").filter({ visible: true, hasText: value }).waitFor();
    const radio = (nome) => pagina.getByRole("radio", { name: `Usar endereço ${nome}`, exact: true });
    const selecionado = (nome) => pagina.getByRole("radio", { name: `Usar endereço ${nome}`, exact: true, checked: true }).waitFor();
    const contar = (metodo, rota) => chamadas.filter((c) => c.metodo === metodo && c.rota === rota).length;
    async function preencher(nome) {
      const campos = { "Nome do endereço": nome, "Logradouro": "Rua A", "Número": "10", "Complemento (opcional)": "Ap. 2", "Bairro": "Centro", "Cidade": "São Paulo", "UF": "sp", "CEP": "01001-000" };
      for (const [campo, valor] of Object.entries(campos)) await pagina.getByRole("textbox", { name: campo, exact: true }).fill(valor);
    }
    async function criar(nome) {
      await botao("+ Adicionar novo endereço").click(); await preencher(nome);
      await botao("Cadastrar endereço").evaluate((elemento) => { elemento.click(); elemento.click(); });
      await pagina.waitForURL(`${base}/enderecos`); await radio(nome).waitFor();
    }

    await pagina.goto(`${base}/enderecos`); await texto("Nenhum endereço cadastrado.").waitFor();
    await botao("+ Adicionar novo endereço").click();
    assert.equal(await pagina.getByRole("textbox", { name: "Nome do endereço", exact: true }).inputValue(), "");
    await botao("Cadastrar endereço").click(); await alerta("Preencha o nome");
    assert.equal(contar("POST", "/enderecos"), 0);
    await preencher("Casa"); falharSalvar = true;
    await botao("Cadastrar endereço").click(); await alerta("Endereço recusado");
    assert.equal(await pagina.getByRole("textbox", { name: "Nome do endereço", exact: true }).inputValue(), "Casa");
    falharSalvar = false;
    await botao("Cadastrar endereço").evaluate((elemento) => { elemento.click(); elemento.click(); });
    await pagina.waitForURL(`${base}/enderecos`); await radio("Casa").waitFor();
    assert.equal(contar("POST", "/enderecos"), 2);
    await selecionado("Casa");
    assert.equal(enderecos.get("sessao-a")[0].uf, "SP");
    assert.equal(enderecos.get("sessao-a")[0].cep, "01001000");
    await criar("Trabalho");
    await radio("Trabalho").click(); await selecionado("Trabalho");
    await botao("Ir para Home").click(); await pagina.goBack(); await radio("Trabalho").waitFor();
    await selecionado("Trabalho");
    await radio("Casa").click(); await botao("Definir Trabalho como principal").click();
    await pagina.waitForFunction(() => document.querySelector('[aria-label="Definir Trabalho como principal"]')?.getAttribute("aria-disabled") === "true");
    await selecionado("Casa");
    assert.equal(enderecos.get("sessao-a")[1].principal_endereco, "SIM");
    await botao("Editar endereço Trabalho").click();
    await pagina.getByRole("textbox", { name: "Número", exact: true }).fill("22");
    await pagina.getByRole("textbox", { name: "CEP", exact: true }).fill("02002-000");
    await botao("Salvar alterações").click(); await pagina.waitForURL(`${base}/enderecos`); await texto("Rua A, 22").waitFor();
    assert.equal(enderecos.get("sessao-a")[1].cep, "02002000");
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/enderecos-web.png"), fullPage: true });
    await botao("Excluir endereço Casa").click(); await botao("Cancelar exclusão").click();
    assert.equal(contar("DELETE", "/enderecos/5"), 0);
    await botao("Excluir endereço Casa").click(); await botao("Confirmar exclusão").click();
    await texto("Casa").waitFor({ state: "hidden" });
    await selecionado("Trabalho");

    falharConsulta = true; await pagina.reload(); await alerta("Endereços indisponíveis");
    falharConsulta = false; await botao("Tentar novamente").click(); await radio("Trabalho").waitFor();
    falharDepoisSalvar = true;
    await botao("+ Adicionar novo endereço").click(); await preencher("Academia");
    await botao("Cadastrar endereço").click(); await pagina.waitForURL(`${base}/enderecos`);
    await alerta("Endereços indisponíveis"); const posts = contar("POST", "/enderecos");
    falharDepoisSalvar = false; falharConsulta = false;
    await botao("Tentar novamente").click(); await radio("Academia").waitFor();
    assert.equal(contar("POST", "/enderecos"), posts);

    // Sair durante o envio e voltar ao formulário confirmado não cria outro endereço.
    esperaSalvar = 700;
    await botao("+ Adicionar novo endereço").click(); await preencher("Casa temporária");
    const atualizacao = pagina.waitForResponse((r) => new URL(r.url()).pathname.endsWith("/enderecos") && r.request().method() === "GET");
    await botao("Cadastrar endereço").click(); await botao("Ir para Home").click(); await pagina.waitForURL(`${base}/home`);
    await atualizacao; await pagina.goBack(); await pagina.waitForURL(`${base}/enderecos`); await radio("Casa temporária").waitFor();
    assert.equal(contar("POST", "/enderecos"), posts + 1);
    esperaSalvar = 100;

    await botao("Ir para Pedidos").click(); await texto("Pedido #20").waitFor();
    await texto("2 × Produto indisponível").waitFor(); await texto("Retirada: Não informada").waitFor();
    falharPagina = true; await botao("Carregar mais pedidos").click(); await alerta("Segunda página indisponível");
    assert.equal(await texto("Pedido #20").count(), 1);
    falharPagina = false; const paginasAntes = chamadas.filter((c) => c.rota === "/pedidos" && c.query.includes("page=2")).length;
    await botao("Tentar novamente").evaluate((elemento) => { elemento.click(); elemento.click(); });
    await texto("Pedido #9").waitFor();
    assert.equal(await texto("Pedido #11").count(), 1);
    assert.equal(chamadas.filter((c) => c.rota === "/pedidos" && c.query.includes("page=2")).length - paginasAntes, 1);
    await botao("Filtrar pedidos: Confirmados").click(); await texto("Nenhum pedido encontrado neste filtro.").waitFor();
    const respostaAntiga = pagina.waitForResponse((r) => r.url().includes("status=PENDENTE"));
    await botao("Filtrar pedidos: Pendentes").click();
    await botao("Filtrar pedidos: Entregues").click();
    await texto("Pedido #19").waitFor(); await respostaAntiga;
    assert.equal(await texto("Pedido #20").count(), 0);
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/historico-web.png"), fullPage: true });
    await botao("Ver detalhes do pedido 19").click(); await pagina.waitForURL(`${base}/detalhe-pedido?id=19`);
    await pagina.reload();
    await texto("Pedido #19").waitFor(); await texto("Os detalhes deste pedido estão indisponíveis no momento.").waitFor();
    await botao("Voltar aos pedidos").click(); await texto("Pedido #20").waitFor();
    metaInvalida = true; await botao("Atualizar pedidos").click(); await alerta("histórico inválido");
    metaInvalida = false; await botao("Tentar novamente").click(); await texto("Pedido #20").waitFor();

    await pagina.goto(`${base}/`);
    await pagina.getByPlaceholder("E-mail", { exact: true }).fill("conta-b@example.com");
    await pagina.getByPlaceholder("Senha", { exact: true }).fill("senha-teste");
    await pagina.getByText("Entrar", { exact: true }).click(); await pagina.waitForURL(`${base}/home`);
    await botao("Ir para Pedidos").click(); await texto("Nenhum pedido encontrado.").waitFor();
    assert.equal(await texto("Pedido #20").count(), 0);
    await pagina.goto(`${base}/enderecos`); await texto("Nenhum endereço cadastrado.").waitFor();
    assert.equal(await radio("Trabalho").count(), 0);
    await criar("Casa B"); assert.equal(enderecos.get("sessao-a").length, 3); assert.equal(enderecos.get("sessao-b").length, 1);
    await pagina.goto(`${base}/editar-endereco?id=6`); await alerta("Endereço não encontrado");
    assert.equal(await botao("Salvar alterações").isDisabled(), true);
    await pagina.goto(`${base}/editar-endereco?id=invalido`); await alerta("Endereço inválido");
    assert.equal(await botao("Salvar alterações").isDisabled(), true);
    assert.deepEqual(erros, []);
    assert.ok(chamadas.filter((c) => c.rota === "/pedidos").every((c) => c.metodo === "GET"));
    console.log("Endereços aprovados: cadastro/edição, validação, principal, seleção por foco, exclusão confirmada, erros e isolamento entre contas.");
    console.log("Histórico aprovado: paginação sem duplicatas, filtros no servidor, respostas atrasadas, nulos, erros, ID no detalhe e troca de conta.");
  } catch (erro) {
    if (pagina) await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/dependencias-web-falha.png"), fullPage: true }).catch(() => {});
    throw erro;
  } finally {
    if (navegador) await navegador.close();
    await new Promise((resolve) => { servidor.close(resolve); conexoes.forEach((conexao) => conexao.destroy()); });
  }
}
executar().catch((erro) => { console.error(erro); process.exitCode = 1; });
