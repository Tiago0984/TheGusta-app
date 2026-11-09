# Continuar a implementação em outro computador

Este repositório contém o app, os oito PDFs originais e o plano para concluir os fluxos. Você pode trabalhar em qualquer pasta; o projeto não depende de `C:\xampp\htdocs` nem do OneDrive do computador anterior.

**Preparar o computador**

Instale Git e Node.js com npm. O ambiente usado na auditoria tinha Node **24.11.1** e npm **11.6.2**; essas são as versões de referência para reproduzir a instalação. O mínimo documentado do SDK 57 é Node 22.13.x: [documentação versionada do Expo](https://docs.expo.dev/versions/v57.0.0/).

Para obter uma cópia nova:

```powershell
git clone https://github.com/Tiago0984/TheGusta-app.git
cd TheGusta-app
npm ci
```

Se já tiver o repositório nesse computador, confira `git status` e preserve suas alterações locais antes de atualizar a branch `main` com `git pull --ff-only`. Não é necessário clonar novamente. Execute `npm ci` na raiz após atualizar.

Para abrir no navegador:

```powershell
npm run web
```

Para iniciar o servidor de desenvolvimento e escolher o dispositivo:

```powershell
npm start
```

As dependências são reinstaladas a partir de `package-lock.json`. A pasta `node_modules`, os caches de `.expo` e builds locais não são transportados pelo Git. Não use `npm run reset-project`: esse comando reorganiza o projeto e não faz parte da retomada.

**Ler antes de implementar**

1. [AGENTS.md](AGENTS.md): exige consultar as APIs do Expo SDK 57 antes de escrever código.
2. [Plano detalhado](docs/plano-implementacao-pdfs.md): comparação por etapa dos oito PDFs, diferenças dos exemplos, contratos e critérios de aceite.
3. [Progresso da implementação](docs/progresso-implementacao.md): marque as entregas e registre o ponto de parada.
4. [Referências originais](docs/referencias/README.md): oito PDFs copiados para o repositório, com nomes preservados.

**Ponto de partida**

Auditoria realizada em **06/11/2026**, sobre o código do commit `cc4b1d6bd88186c8c2c5d24e955f336ae9f5fb13`, na branch `main`. A preparação para transferência acrescentou documentação e referências; não implementou os fluxos.

Nenhum dos oito guias estava completo. Login, catálogo, consulta do cliente e atualização dos dados pessoais já tinham integrações para reaproveitar. Cadastro, recuperação, favoritos persistentes, upload da foto, sacola dinâmica e pedidos reais ainda precisam das mudanças descritas no plano.

Retomada em **09/11/2026**, no computador original: as **entregas 1 — Fundação técnica, 2 — Cadastro e recuperação e 3 — Foto e favoritos** foram implementadas e validadas localmente. A próxima ação é a **entrega 4 — Sacola**. Consulte o checklist para o estado mais recente; contratos complementares e homologação com a API real continuam pendentes. Não repetir a auditoria inteira sem necessidade; o diagnóstico é a referência inicial e pode ficar desatualizado conforme o código evoluir.

**API e validação**

A configuração atual está em [src/config/api.ts](src/config/api.ts). O app aponta para uma API remota; este repositório não inclui o backend nem exige XAMPP para servir o frontend. Confirme com o responsável se esse endereço deve ser usado nos testes. As rotas nos PDFs são contratos de referência, não endpoints homologados nesta auditoria.

Credenciais e dados de sessão não estão neste material de continuidade. Faça login no novo dispositivo com uma conta de teste. O armazenamento local, incluindo a futura sacola, pertence ao navegador/dispositivo e não é transferido por um clone do Git.

Para obter a situação inicial após instalar as dependências:

```powershell
npx tsc --noEmit
npx eslint src
npm test
```

Na auditoria inicial, o TypeScript passou e o ESLint apontou **7 erros e 38 avisos preexistentes**. Após a entrega 3, os 84 testes de serviços, TypeScript, lint dos arquivos alterados e export web passaram; autenticação, foto e favoritos também passaram no navegador com API simulada. No lint global ainda restam **1 erro e 17 avisos**. Resultados, comandos dos testes web e pendências estão no checklist. Não houve homologação em dispositivo nem execução de operações reais na API. Recebimento de e-mail, câmera, permissões e abertura do WhatsApp precisam de validação nos ambientes apropriados.

**Mensagem pronta para o Codex do outro PC**

Copie a mensagem abaixo com este repositório aberto:

```text
Continue a implementação do The Gusta a partir do material salvo neste repositório.

Leia AGENTS.md, CONTINUAR-AQUI.md, docs/plano-implementacao-pdfs.md e
docs/progresso-implementacao.md. Os oito PDFs estão em docs/referencias/.
Consulte a documentação exata do Expo SDK 57 antes de escrever código.

Confira o progresso e o código atual; se o checklist ainda estiver vazio,
comece pela entrega 1 (Fundação). Implemente as pendências dos oito guias
na ordem de dependências do plano, preservando o layout e as integrações
existentes. Adapte os exemplos aos arquivos e estilos reais do projeto.

Não invente contratos de API: consulte a documentação ou o backend quando
disponíveis e identifique qualquer informação que falte. Continue as partes
independentes enquanto resolve essas dependências. Evite criar pedidos ou
enviar mensagens reais sem um ambiente de teste apropriado.

Execute as verificações adequadas a cada entrega. Atualize
docs/progresso-implementacao.md com alterações, evidências de validação,
pendências e a próxima ação, para permitir outra retomada.
```
