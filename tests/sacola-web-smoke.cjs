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
  servidor.on("connection", (conexao) => {
    conexoes.add(conexao);
    conexao.once("close", () => conexoes.delete(conexao));
  });
  await new Promise((resolve) => servidor.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  let navegador;
  let pagina;
  try {
    navegador = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === "win32" ? "msedge" : undefined) });
    const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 } });
    await contexto.addInitScript(() => {
      const ler = Storage.prototype.getItem;
      const salvar = Storage.prototype.setItem;
      if (!ler.call(localStorage, "token")) salvar.call(localStorage, "token", "sessao-a");
      Storage.prototype.getItem = function (chave) {
        if (chave.startsWith("sacola_") && ler.call(this, "teste-falhar-leitura") === "sim") throw new Error("Falha simulada");
        return ler.call(this, chave);
      };
      Storage.prototype.setItem = function (chave, valor) {
        if (chave.startsWith("sacola_") && ler.call(this, "teste-falhar-gravacao") === "sim") throw new Error("Sem espaço simulado");
        return salvar.call(this, chave, valor);
      };
    });
    const produto = { id_produto: 7, id_categoria: 1, nome_produto: "Bolo de Banana", slug_produto: "bolo-banana", descricao_produto: "Produto simulado", tamanho_produto: "1", unid_med_produto: "UN", valor_produto: 75.9, foto_produto: null, status_produto: "ATIVO", destaque_produto: "SIM", categoria_produto: null };
    const produtos = [produto, { ...produto, id_produto: 8, nome_produto: "Brigadeiro", slug_produto: "brigadeiro", valor_produto: 10 }];
    const favoritos = new Map([["sessao-a", new Set()], ["sessao-b", new Set()]]);
    const chamadas = [];
    const erros = [];
    let falharCliente = false;
    await contexto.route("**/*", (route) => new URL(route.request().url()).origin === base ? route.continue() : route.abort("blockedbyclient"));
    await contexto.route("**/api/v1/**", async (route) => {
      const req = route.request();
      const rota = new URL(req.url()).pathname.split("/api/v1")[1];
      const headers = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,DELETE,OPTIONS", "access-control-allow-headers": "Content-Type,Authorization,Accept" };
      if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers });
      const token = (req.headers().authorization || "").replace("Bearer ", "");
      chamadas.push({ rota, metodo: req.method(), token });
      let data;
      let status = 200;
      let message;
      if (rota === "/auth/login") data = { token: req.postDataJSON().email.startsWith("conta-b") ? "sessao-b" : "sessao-a" };
      else if (rota === "/cliente") {
        await new Promise((resolve) => setTimeout(resolve, 80));
        if (falharCliente) { status = 500; message = "Cliente indisponível no teste."; }
        else data = { id_cliente: token === "sessao-b" ? 2 : 1, nome_cliente: "Cliente de teste", email_cliente: "teste@example.com", telefone_cliente: null, cpf_cnpj_cliente: null, data_nasc_cliente: null, foto_cliente: null };
      } else if (rota === "/produtos") data = produtos;
      else if (rota.startsWith("/produtos/")) data = produtos.find((p) => p.slug_produto === rota.split("/").at(-1));
      else if (rota === "/categorias") data = [{ id_categoria: 1, nome_categoria: "Bolos", descricao_categoria: "Categoria simulada", status_categoria: "ATIVO" }];
      else if (rota === "/banners") data = [];
      else if (rota === "/favoritos" && req.method() === "GET") data = [...favoritos.get(token)].map((id_produto) => ({ id_produto }));
      else if (rota === "/favoritos" && req.method() === "POST") { favoritos.get(token).add(req.postDataJSON().id_produto); data = {}; }
      else { status = 500; message = `Chamada não prevista: ${req.method()} ${rota}`; }
      return route.fulfill({ status, headers, contentType: "application/json", body: JSON.stringify({ success: status < 400, data, message }) });
    });
    pagina = await contexto.newPage();
    pagina.on("pageerror", (erro) => erros.push(erro.message));
    const botao = (name) => pagina.getByRole("button", { name, exact: true });
    const texto = (value) => pagina.getByText(value, { exact: true }).filter({ visible: true });
    const quantidade = (numero, nome = "Bolo de Banana") => pagina.getByLabel(`Quantidade de ${nome}: ${numero}`, { exact: true }).filter({ visible: true }).waitFor();
    const subtotal = (valor) => pagina.getByLabel(new RegExp(`^Subtotal dos produtos: R\\$\\s*${valor}$`)).filter({ visible: true }).waitFor();
    const alerta = (mensagem) => pagina.getByRole("alert").filter({ hasText: mensagem }).waitFor();
    const salva = (id = 1) => pagina.evaluate((cliente) => JSON.parse(localStorage.getItem(`sacola_cliente_${cliente}`) || "[]"), id);
    const flag = (chave, valor) => pagina.evaluate(({ chave, valor }) => localStorage.setItem(chave, valor), { chave, valor });
    const adicionar = async (slug = "bolo-banana", unidades = 1) => {
      await pagina.goto(`${base}/detalhe-produto?slug=${slug}`);
      await botao("Adicionar à Sacola").waitFor();
      assert.equal(await botao("Diminuir quantidade").isDisabled(), true);
      for (let i = 1; i < unidades; i++) await botao("Aumentar quantidade").click();
      await botao("Adicionar à Sacola").evaluate((elemento) => { elemento.click(); elemento.click(); });
      await pagina.waitForURL(`${base}/sacola`);
    };
    const entrar = async (conta) => {
      await pagina.goto(`${base}/`);
      await pagina.getByPlaceholder("E-mail", { exact: true }).fill(`conta-${conta}@example.com`);
      await pagina.getByPlaceholder("Senha", { exact: true }).fill("senha-teste");
      await pagina.getByText("Entrar", { exact: true }).click();
      await pagina.waitForURL(`${base}/home`);
      await botao("Ir para Sacola").click();
    };

    await pagina.goto(`${base}/sacola`);
    await texto("Sua sacola está vazia.").waitFor();
    assert.equal(await botao("Continuar para pagamento").isDisabled(), true);
    assert.equal(await botao("Aplicar").isDisabled(), true);
    await pagina.goto(`${base}/detalhe-produto?slug=bolo-banana`);
    await botao("Aumentar quantidade").evaluate((elemento) => { for (let i = 0; i < 110; i++) elemento.click(); });
    assert.equal(await botao("Aumentar quantidade").isDisabled(), true);
    await botao("Diminuir quantidade").evaluate((elemento) => { for (let i = 0; i < 110; i++) elemento.click(); });
    assert.equal(await botao("Diminuir quantidade").isDisabled(), true);
    await flag("teste-falhar-gravacao", "sim");
    await botao("Adicionar à Sacola").click();
    await alerta("Não foi possível salvar");
    assert.equal(new URL(pagina.url()).pathname, "/detalhe-produto");
    assert.deepEqual(await salva(), []);
    await flag("teste-falhar-gravacao", "nao");
    await adicionar("bolo-banana", 2);
    await quantidade(2);
    await subtotal("151,80");
    assert.equal((await salva()).length, 1);
    assert.equal((await salva())[0].quantidade, 2);
    await pagina.reload();
    await quantidade(2);
    await botao("Aumentar quantidade de Bolo de Banana").evaluate((elemento) => { elemento.click(); elemento.click(); });
    await quantidade(3);
    await subtotal("227,70");
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/sacola-web-itens.png"), fullPage: true });
    await botao("Diminuir quantidade de Bolo de Banana").click();
    await quantidade(2);
    await botao("Diminuir quantidade de Bolo de Banana").click();
    await quantidade(1);
    assert.equal(await botao("Diminuir quantidade de Bolo de Banana").isDisabled(), true);

    await flag("teste-falhar-gravacao", "sim");
    await botao("Aumentar quantidade de Bolo de Banana").click();
    await alerta("Não foi possível salvar");
    assert.equal((await salva())[0].quantidade, 1);
    assert.equal(await botao("Continuar para pagamento").isDisabled(), true);
    await flag("teste-falhar-gravacao", "nao");
    await botao("Tentar novamente").click();
    await quantidade(1);
    await adicionar();
    await quantidade(2);
    await adicionar("brigadeiro");
    await quantidade(1, "Brigadeiro");
    await subtotal("161,80");
    await botao("Remover Brigadeiro da sacola").click();
    await subtotal("151,80");
    assert.equal((await salva()).length, 1);

    // A troca passa pelo login real do app, sem escrever diretamente o token.
    await entrar("b");
    await texto("Sua sacola está vazia.").waitFor();
    assert.equal(await botao("Continuar para pagamento").isDisabled(), true);
    await adicionar("brigadeiro");
    await quantidade(1, "Brigadeiro");
    assert.equal((await salva(2))[0].id_produto, 8);
    await entrar("a");
    await quantidade(2);
    await subtotal("151,80");
    assert.equal(await botao("Remover Brigadeiro da sacola").count(), 0);

    await pagina.evaluate(() => {
      const itens = JSON.parse(localStorage.getItem("sacola_cliente_1"));
      itens[0].quantidade = 99;
      localStorage.setItem("sacola_cliente_1", JSON.stringify(itens));
    });
    await pagina.reload();
    await quantidade(99);
    assert.equal(await botao("Aumentar quantidade de Bolo de Banana").isDisabled(), true);
    await pagina.goto(`${base}/detalhe-produto?slug=bolo-banana`);
    await botao("Adicionar à Sacola").click();
    await alerta("entre 1 e 99");
    assert.equal(new URL(pagina.url()).pathname, "/detalhe-produto");
    assert.equal((await salva())[0].quantidade, 99);
    await botao("Adicionar aos favoritos: Bolo de Banana").click();
    await botao("Remover dos favoritos: Bolo de Banana").waitFor();
    await botao("Ir para Sacola").click();
    await quantidade(99);

    await flag("teste-falhar-leitura", "sim");
    await pagina.reload();
    await alerta("Não foi possível ler");
    assert.equal(await botao("Continuar para pagamento").isDisabled(), true);
    await flag("teste-falhar-leitura", "nao");
    await botao("Tentar novamente").click();
    await quantidade(99);
    falharCliente = true;
    await pagina.reload();
    await alerta("Cliente indisponível no teste");
    falharCliente = false;
    await botao("Tentar novamente").click();
    await quantidade(99);

    await flag("sacola_cliente_1", "JSON quebrado");
    await pagina.reload();
    await alerta("dados salvos da sacola estão inválidos");
    assert.equal(await botao("Continuar para pagamento").isDisabled(), true);
    assert.equal(await pagina.evaluate(() => localStorage.getItem("sacola_cliente_1")), "JSON quebrado");
    await botao("Esvaziar sacola").click();
    await texto("Sua sacola está vazia.").waitFor();
    assert.deepEqual(await salva(), []);
    assert.equal((await salva(2))[0].id_produto, 8);
    await adicionar();
    await quantidade(1);
    assert.equal(await botao("Continuar para pagamento").isDisabled(), false);
    await botao("Continuar para pagamento").click();
    await pagina.waitForURL(`${base}/pagamento`);
    // O checkout é tratado na entrega 7; não confirmar pedido nem abrir WhatsApp.
    await botao("Ir para Sacola").click();
    await quantidade(1);
    await botao("Remover Bolo de Banana da sacola").click();
    await texto("Sua sacola está vazia.").waitFor();
    assert.equal(await botao("Continuar para pagamento").isDisabled(), true);
    assert.ok(chamadas.every((chamada) => chamada.metodo === "GET" || ["/auth/login", "/favoritos"].includes(chamada.rota)));
    assert.deepEqual(erros, []);
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/sacola-web-aprovada.png"), fullPage: true });
    console.log("Sacola aprovada: adição/união, quantidades 1–99, remoção, subtotal, persistência, duas contas e cliques repetidos.");
    console.log("Falhas de leitura, gravação e API, recuperação de dados inválidos, favoritos e bloqueio do pagamento vazio aprovados.");
  } catch (erro) {
    if (pagina) await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/sacola-web-falha.png"), fullPage: true }).catch(() => {});
    throw erro;
  } finally {
    if (navegador) await navegador.close();
    await new Promise((resolve) => { servidor.close(resolve); conexoes.forEach((conexao) => conexao.destroy()); });
  }
}

executar().catch((erro) => { console.error(erro); process.exitCode = 1; });
