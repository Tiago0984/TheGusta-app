/* global __dirname */
const assert = require("node:assert/strict");
const { Buffer } = require("node:buffer");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("../.expo/browser-tools/node_modules/playwright");

const diretorio = path.resolve(__dirname, "../.expo/export-verificacao");
const tipos = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml" };

async function executar() {
  await fs.access(path.join(diretorio, "index.html"));
  const imagem = await fs.readFile(path.resolve(__dirname, "../assets/images/img/user.png"));
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
    await contexto.addInitScript(() => { if (!localStorage.getItem("token")) localStorage.setItem("token", "sessao-a"); });
    const chamadas = [];
    const errosPagina = [];
    const favoritos = new Map([["sessao-a", new Set([7])], ["sessao-b", new Set()]]);
    let recusarMutacao = true;
    let falharConsulta = false;
    let recusarFoto = true;
    let liberarFoto;
    const categoria = { id_categoria: 1, nome_categoria: "Bolos", descricao_categoria: "Bolos de teste", status_categoria: "ATIVO" };
    const produto = { id_produto: 7, id_categoria: 1, nome_produto: "Bolo de Banana", slug_produto: "bolo-banana", descricao_produto: "Produto simulado", tamanho_produto: "1", unid_med_produto: "UN", valor_produto: 75.9, foto_produto: null, status_produto: "ATIVO", destaque_produto: "SIM", categoria_produto: null };
    const produtos = [produto, { ...produto, id_produto: 8, nome_produto: "Brigadeiro", slug_produto: "brigadeiro", destaque_produto: "NAO" }, { ...produto, id_produto: 9, nome_produto: "Produto inativo", status_produto: "INATIVO" }];
    const foto = "cliente/foto.png";
    await contexto.route("**/*", (route) => {
      const url = new URL(route.request().url());
      if (url.origin === base) return route.continue();
      if (url.pathname.includes("/davilla/images/")) return route.fulfill({ contentType: "image/png", body: imagem });
      return route.abort("blockedbyclient");
    });
    await contexto.route("**/api/v1/**", async (route) => {
      const req = route.request();
      const rota = new URL(req.url()).pathname.split("/api/v1")[1];
      const headers = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS", "access-control-allow-headers": "Content-Type,Authorization,Accept" };
      if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers });
      const token = (req.headers().authorization || "").replace("Bearer ", "");
      const chamada = { rota, method: req.method(), token, contentType: req.headers()["content-type"], body: req.postDataBuffer() };
      chamadas.push(chamada);
      let data;
      let status = 200;
      let message;
      if (rota === "/auth/login") data = { token: "sessao-b" };
      else if (rota === "/cliente") data = { id_cliente: token === "sessao-b" ? 2 : 1, nome_cliente: "Cliente simulado", email_cliente: "teste@example.com", telefone_cliente: "(11)99999-0000", cpf_cnpj_cliente: null, data_nasc_cliente: null, foto_cliente: foto };
      else if (rota === "/cliente/foto") {
        if (recusarFoto) { status = 422; message = "Imagem não aceita pelo servidor."; }
        else {
          await new Promise((resolve) => { liberarFoto = resolve; });
          data = { foto_cliente: foto };
        }
      } else if (rota === "/favoritos" && req.method() === "GET") {
        if (falharConsulta) { status = 500; message = "Favoritos indisponíveis."; }
        else data = [...(favoritos.get(token) || [])].map((id) => ({ id_produto: String(id) }));
      } else if (rota.startsWith("/favoritos") && ["POST", "DELETE"].includes(req.method())) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (recusarMutacao) { status = 422; message = "Não foi possível alterar o favorito."; }
        else if (req.method() === "POST") favoritos.get(token).add(req.postDataJSON().id_produto);
        else favoritos.get(token).delete(Number(rota.split("/").at(-1)));
      } else if (rota === "/produtos") data = produtos;
      else if (rota === "/produtos/bolo-banana") data = produto;
      else if (rota === "/categorias") data = [categoria];
      else if (rota === "/banners") data = [];
      else { status = 500; message = `Chamada não prevista no teste: ${rota}`; }
      return route.fulfill({ status, headers, contentType: "application/json", body: JSON.stringify({ success: status < 400, data, message }) });
    });
    pagina = await contexto.newPage();
    pagina.on("pageerror", (erro) => errosPagina.push(erro.message));
    const botaoFavorito = (ativo) => pagina.getByRole("button", { name: `${ativo ? "Remover dos favoritos" : "Adicionar aos favoritos"}: Bolo de Banana`, exact: true });
    const alerta = (texto) => pagina.getByRole("alert").filter({ hasText: texto }).waitFor();
    const contar = (rota, method) => chamadas.filter((chamada) => chamada.rota === rota && (!method || chamada.method === method)).length;
    const duploClique = (botao) => botao.evaluate((elemento) => { elemento.click(); elemento.click(); });
    const navegar = (destino) => pagina.getByRole("button", { name: `Ir para ${destino}`, exact: true }).click();
    const imagemPerfil = () => pagina.getByRole("img", { name: "Foto do perfil", exact: true }).first();
    const uriFoto = () => imagemPerfil().evaluate((elemento) => elemento.getAttribute("src") || elemento.querySelector("img")?.getAttribute("src") || elemento.style.backgroundImage);

    await pagina.goto(`${base}/home`);
    await botaoFavorito(true).waitFor();
    assert.equal(await pagina.getByText("Produto inativo", { exact: true }).count(), 0);
    await botaoFavorito(true).click();
    await alerta("Não foi possível alterar o favorito.");
    assert.equal(await botaoFavorito(true).getAttribute("aria-pressed"), "true");
    recusarMutacao = false;
    const exclusoesAntes = contar("/favoritos/7", "DELETE");
    await duploClique(botaoFavorito(true));
    await botaoFavorito(false).waitFor();
    assert.equal(contar("/favoritos/7", "DELETE"), exclusoesAntes + 1);
    const adicoesAntes = contar("/favoritos", "POST");
    await duploClique(botaoFavorito(false));
    await botaoFavorito(true).waitFor();
    assert.equal(contar("/favoritos", "POST"), adicoesAntes + 1);
    await pagina.getByRole("button", { name: "Ver detalhes: Bolo de Banana", exact: true }).click();
    await pagina.waitForURL(/\/detalhe-produto\?/);
    await botaoFavorito(true).click();
    await botaoFavorito(false).waitFor();
    await navegar("Cardápio");
    await pagina.waitForURL(`${base}/cardapio`);
    await botaoFavorito(false).click();
    await botaoFavorito(true).waitFor();
    await navegar("Home");
    await pagina.waitForURL(`${base}/home`);
    await botaoFavorito(true).waitFor();
    await pagina.reload();
    await botaoFavorito(true).waitFor();
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/favoritos-web.png"), fullPage: true });

    falharConsulta = true;
    await navegar("Cardápio");
    await alerta("Favoritos indisponíveis.");
    await pagina.getByText("Bolo de Banana", { exact: true }).filter({ visible: true }).waitFor();
    falharConsulta = false;
    const recarregado = pagina.waitForResponse((res) => res.url().endsWith("/favoritos") && res.status() === 200);
    await pagina.getByRole("button", { name: "Tentar carregar favoritos", exact: true }).click();
    await recarregado;
    await botaoFavorito(true).waitFor();
    await pagina.getByPlaceholder("Buscar produtos", { exact: true }).filter({ visible: true }).fill("Brigadeiro");
    await pagina.getByPlaceholder("Buscar produtos", { exact: true }).filter({ visible: true }).press("Enter");
    assert.equal(await pagina.getByText("Bolo de Banana", { exact: true }).filter({ visible: true }).count(), 0);
    await pagina.getByText("Brigadeiro", { exact: true }).filter({ visible: true }).waitFor();

    await navegar("Configurações");
    await pagina.getByText("Perfil", { exact: true }).click();
    await pagina.waitForURL(`${base}/editar-perfil`);
    const nome = pagina.getByPlaceholder("Seu nome completo aqui", { exact: true });
    await nome.fill("Nome ainda não salvo");
    const fotoAnterior = await uriFoto();
    async function escolherArquivo(arquivo) {
      await pagina.getByRole("button", { name: "Alterar foto do perfil", exact: true }).click();
      const [seletor] = await Promise.all([
        pagina.waitForEvent("filechooser"),
        pagina.getByRole("button", { name: "Escolher foto da galeria", exact: true }).click(),
      ]);
      await seletor.setFiles(arquivo);
    }
    await escolherArquivo([]);
    await escolherArquivo({ name: "foto.gif", mimeType: "image/gif", buffer: Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64") });
    await alerta("Escolha uma imagem JPG, PNG ou WEBP.");
    assert.equal(contar("/cliente/foto", "POST"), 0);
    await escolherArquivo({ name: "foto-grande.png", mimeType: "image/png", buffer: Buffer.concat([imagem, Buffer.alloc(2 * 1024 * 1024)]) });
    await alerta("A imagem deve ter no máximo 2 MB.");
    assert.equal(contar("/cliente/foto", "POST"), 0);
    const arquivoValido = { name: "foto.png", mimeType: "image/png", buffer: imagem };
    await escolherArquivo(arquivoValido);
    await alerta("Imagem não aceita pelo servidor.");
    assert.equal(await uriFoto(), fotoAnterior);
    assert.equal(await nome.inputValue(), "Nome ainda não salvo");
    recusarFoto = false;
    const fotosAntes = contar("/cliente/foto", "POST");
    await escolherArquivo(arquivoValido);
    await pagina.getByText("Enviando...", { exact: true }).waitFor();
    assert.equal(await pagina.getByRole("button", { name: "Alterar foto do perfil", exact: true }).isDisabled(), true);
    await duploClique(pagina.getByRole("button", { name: "Alterar foto do perfil", exact: true }));
    assert.equal(contar("/cliente/foto", "POST"), fotosAntes + 1);
    liberarFoto();
    await pagina.getByText("Foto atualizada com sucesso.", { exact: true }).waitFor();
    await pagina.getByRole("button", { name: "Escolher foto da galeria", exact: true }).waitFor({ state: "hidden" });
    assert.equal(await nome.inputValue(), "Nome ainda não salvo");
    assert.notEqual(await uriFoto(), fotoAnterior);
    const envioFoto = chamadas.findLast((chamada) => chamada.rota === "/cliente/foto");
    assert.match(envioFoto.contentType, /multipart\/form-data; boundary=/);
    assert.match(envioFoto.body.toString(), /name="foto_cliente"/);
    assert.equal(envioFoto.token, "sessao-a");
    await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/foto-perfil-web.png"), fullPage: true });
    await navegar("Home");
    await imagemPerfil().waitFor();
    assert.ok((await uriFoto()).includes("cliente/foto.png"));
    assert.ok((await uriFoto()).includes("v="));
    await navegar("Configurações");
    await imagemPerfil().waitFor();
    assert.ok((await uriFoto()).includes("cliente/foto.png"));

    await pagina.goto(`${base}/`);
    await pagina.getByPlaceholder("E-mail", { exact: true }).fill("outra-conta@example.com");
    await pagina.getByPlaceholder("Senha", { exact: true }).fill("senha-teste");
    await pagina.getByText("Entrar", { exact: true }).click();
    await pagina.waitForURL(`${base}/home`);
    await botaoFavorito(false).waitFor();
    assert.equal(await pagina.evaluate(() => localStorage.getItem("token")), "sessao-b");
    assert.deepEqual(errosPagina, []);
    console.log("Favoritos aprovados em Home, Cardápio e Detalhe, incluindo persistência, falhas, nova tentativa e troca de conta.");
    console.log("Upload pela galeria aprovado, com cancelamento, validação de tipo/tamanho, erro do servidor, multipart e formulário preservado.");
  } catch (erro) {
    if (pagina) await pagina.screenshot({ path: path.resolve(__dirname, "../.expo/perfil-favoritos-falha.png"), fullPage: true }).catch(() => {});
    throw erro;
  } finally {
    if (navegador) await navegador.close();
    await new Promise((resolve) => {
      servidor.close(resolve);
      conexoes.forEach((conexao) => conexao.destroy());
    });
  }
}

executar().catch((erro) => { console.error(erro); process.exitCode = 1; });
