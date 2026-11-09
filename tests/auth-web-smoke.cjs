/* global __dirname */
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");

// Verificação opcional da interface exportada, sempre com API simulada.
// Instalação e comandos estão em docs/progresso-implementacao.md.
const { chromium } = require("../.expo/browser-tools/node_modules/playwright");
const diretorio = path.resolve(__dirname, "../.expo/export-verificacao");
const tipos = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml" };

async function executar() {
  await fs.access(path.join(diretorio, "index.html"));
  const servidor = http.createServer(async (req, res) => {
    try {
      const rota = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      let arquivo = path.resolve(diretorio, `.${rota}`);
      if (arquivo !== diretorio && !arquivo.startsWith(diretorio + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      if (rota.endsWith("/")) arquivo = path.join(arquivo, "index.html");
      try { await fs.access(arquivo); } catch { arquivo += ".html"; }
      const conteudo = await fs.readFile(arquivo);
      res.writeHead(200, { "Content-Type": tipos[path.extname(arquivo)] || "application/octet-stream" });
      res.end(conteudo);
    } catch {
      res.writeHead(404).end();
    }
  });
  const conexoes = new Set();
  servidor.on("connection", (conexao) => {
    conexoes.add(conexao);
    conexao.once("close", () => conexoes.delete(conexao));
  });
  await new Promise((resolve) => servidor.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  let navegador;
  let pagina;
  try {
    navegador = await chromium.launch({
      headless: true,
      channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === "win32" ? "msedge" : undefined),
    });
    const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 } });
    const chamadas = [];
    const errosPagina = [];
    let cadastroRecusado = true;
    let solicitacaoRecusada = true;
    let codigoRecusado = true;
    let senhaRecusada = true;
    const cliente = { id_cliente: 1, nome_cliente: "Cliente de teste", email_cliente: "teste@example.com", telefone_cliente: "(11)99999-0000", cpf_cnpj_cliente: null, data_nasc_cliente: null, foto_cliente: null };
    // Nenhuma chamada externa pode escapar da simulação, mesmo se a API mudar.
    await contexto.route("**/*", (route) => {
      if (new URL(route.request().url()).origin === base) return route.continue();
      return route.abort("blockedbyclient");
    });
    await contexto.route("**/api/v1/**", async (route) => {
      const req = route.request();
      const rota = new URL(req.url()).pathname.split("/api/v1")[1];
      const headers = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PUT,OPTIONS", "access-control-allow-headers": "Content-Type,Authorization,Accept" };
      if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers });
      chamadas.push({ rota, corpo: req.postDataJSON() });
      let status = 200;
      let data;
      let message;
      if (rota === "/auth/cadastro") {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (cadastroRecusado) { status = 422; message = "E-mail já cadastrado."; }
        else data = { token: "sessao-cadastro-simulada", cliente };
      } else if (rota === "/auth/esqueci-senha") {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (solicitacaoRecusada) { status = 429; message = "Aguarde para solicitar outro código."; }
      } else if (rota === "/auth/validar-codigo") {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (codigoRecusado) { status = 422; message = "Código inválido ou expirado."; }
        else data = { reset_token: "token-redefinicao-simulado" };
      } else if (rota === "/auth/redefinir-senha") {
        if (senhaRecusada) { status = 422; message = "A senha não foi aceita."; }
      } else if (rota === "/cliente") data = cliente;
      else if (["/produtos", "/categorias", "/banners"].includes(rota)) data = [];
      else { status = 500; message = `Chamada não prevista no teste: ${rota}`; }
      return route.fulfill({ status, headers, contentType: "application/json", body: JSON.stringify({ success: status < 400, data, message }) });
    });
    pagina = await contexto.newPage();
    pagina.on("pageerror", (erro) => errosPagina.push(erro.message));
    const contar = (rota) => chamadas.filter((chamada) => chamada.rota === rota).length;
    const verificarAlerta = (texto) => pagina.getByRole("alert").filter({ hasText: texto }).waitFor();
    const duploClique = (botao) => botao.evaluate((elemento) => { elemento.click(); elemento.click(); });

    await pagina.goto(`${base}/cad-cliente`);
    const criar = pagina.getByRole("button", { name: "Criar Conta", exact: true });
    await criar.click();
    await verificarAlerta("Preencha todos os campos.");
    assert.equal(contar("/auth/cadastro"), 0);
    await pagina.getByPlaceholder("Nome completo", { exact: true }).fill("Cliente de teste");
    await pagina.getByPlaceholder("E-mail", { exact: true }).fill("teste@example.com");
    await pagina.getByPlaceholder("Telefone com DDD").fill("(11)99999-0000");
    await pagina.getByPlaceholder("Senha", { exact: true }).fill("senha-teste");
    await pagina.getByPlaceholder("Confirmar Senha", { exact: true }).fill("senha-teste");
    await criar.click();
    await verificarAlerta("Aceite os termos de uso para continuar.");
    assert.equal(contar("/auth/cadastro"), 0);
    await pagina.getByRole("checkbox", { name: "Aceitar os termos de uso" }).check();
    await criar.click();
    await verificarAlerta("E-mail já cadastrado.");
    assert.equal(new URL(pagina.url()).pathname, "/cad-cliente");
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/cadastro-web.png"), fullPage: true });
    cadastroRecusado = false;
    const cadastrosAntes = contar("/auth/cadastro");
    await duploClique(criar);
    await pagina.waitForURL(`${base}/home`);
    assert.equal(contar("/auth/cadastro"), cadastrosAntes + 1);
    assert.equal(await pagina.evaluate(() => localStorage.getItem("token")), "sessao-cadastro-simulada");

    await pagina.goto(`${base}/editar-perfil`);
    await pagina.getByPlaceholder("dd/mm/aaaa", { exact: true }).waitFor();
    assert.equal(await pagina.getByPlaceholder("dd/mm/aaaa", { exact: true }).inputValue(), "");

    await pagina.goto(`${base}/esqueci-senha`);
    const enviar = pagina.getByRole("button", { name: "Enviar código", exact: true });
    await enviar.click();
    await verificarAlerta("Informe seu e-mail.");
    assert.equal(contar("/auth/esqueci-senha"), 0);
    await pagina.getByPlaceholder("E-mail", { exact: true }).fill("teste@example.com");
    await enviar.click();
    await verificarAlerta("Aguarde para solicitar outro código.");
    assert.equal(await pagina.getByText("Confira seu e-mail", { exact: true }).count(), 0);
    solicitacaoRecusada = false;
    const solicitacoesAntes = contar("/auth/esqueci-senha");
    await duploClique(enviar);
    await pagina.getByText("Confira seu e-mail", { exact: true }).waitFor();
    assert.equal(contar("/auth/esqueci-senha"), solicitacoesAntes + 1);
    await pagina.getByText("Continuar", { exact: true }).click();
    await pagina.waitForURL(/\/redefinir-senha\?/);
    assert.equal(new URL(pagina.url()).searchParams.get("email"), "teste@example.com");
    const digito = (indice) => pagina.getByRole("textbox", { name: `Dígito ${indice} do código`, exact: true });
    await digito(1).fill("a");
    assert.equal(await digito(1).inputValue(), "");
    await digito(1).fill("1");
    assert.equal(await digito(2).evaluate((elemento) => elemento === document.activeElement), true);
    await digito(2).press("Backspace");
    assert.equal(await digito(1).evaluate((elemento) => elemento === document.activeElement), true);
    await digito(1).fill("0123");
    assert.deepEqual(await Promise.all([1, 2, 3, 4].map((indice) => digito(indice).inputValue())), ["0", "1", "2", "3"]);
    await pagina.getByPlaceholder("Nova senha", { exact: true }).fill("nova-senha-teste");
    await pagina.getByPlaceholder("Confirmar Senha", { exact: true }).fill("senha-diferente");
    const salvar = pagina.getByRole("button", { name: "Salvar nova senha", exact: true });
    await salvar.click();
    await verificarAlerta("As senhas não correspondem.");
    assert.equal(contar("/auth/validar-codigo"), 0);
    await pagina.getByPlaceholder("Confirmar Senha", { exact: true }).fill("nova-senha-teste");
    await salvar.click();
    await verificarAlerta("Código inválido ou expirado.");
    assert.equal(contar("/auth/redefinir-senha"), 0);
    codigoRecusado = false;
    await salvar.click();
    await verificarAlerta("A senha não foi aceita.");
    assert.ok(new URL(pagina.url()).pathname.endsWith("/redefinir-senha"));
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/redefinir-senha-web.png"), fullPage: true });
    senhaRecusada = false;
    const validacoesAntes = contar("/auth/validar-codigo");
    const senhasAntes = contar("/auth/redefinir-senha");
    await duploClique(salvar);
    await pagina.waitForURL(`${base}/`);
    assert.equal(contar("/auth/validar-codigo"), validacoesAntes + 1);
    assert.equal(contar("/auth/redefinir-senha"), senhasAntes + 1);
    assert.equal(await pagina.evaluate(() => localStorage.getItem("token")), "sessao-cadastro-simulada");
    assert.equal(await pagina.evaluate(() => localStorage.getItem("reset_token")), null);

    await pagina.goto(`${base}/redefinir-senha`);
    await verificarAlerta("E-mail não informado. Solicite um novo código.");
    assert.equal(await salvar.isDisabled(), true);
    await pagina.getByRole("button", { name: "Solicitar novo código", exact: true }).click();
    await pagina.waitForURL(`${base}/esqueci-senha`);
    assert.deepEqual(errosPagina, []);
    console.log("Cadastro, perfil com nascimento nulo e recuperação aprovados no navegador com API simulada.");
    console.log("Validações, erros da API, foco/Backspace/colagem, e-mail na rota e bloqueio de envios duplos aprovados.");
  } catch (erro) {
    if (pagina) await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/auth-web-falha.png"), fullPage: true }).catch(() => {});
    throw erro;
  } finally {
    if (navegador) await navegador.close();
    await new Promise((resolve) => {
      servidor.close(resolve);
      // Também encerra conexões de pré-carregamento sem requisição HTTP.
      conexoes.forEach((conexao) => conexao.destroy());
    });
  }
}

executar().catch((erro) => { console.error(erro); process.exitCode = 1; });
