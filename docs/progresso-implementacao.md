# Progresso da implementação

Última atualização: **09/11/2026**. As entregas 1–6 do app foram implementadas e validadas com API simulada. O usuário relatou testes locais aprovados de endereços/pedidos e favoritos/foto no backend, ainda sem commit/publicação. A próxima entrega do app é o checkout; integração com o servidor publicado e dispositivos continua pendente.

Plano de referência: [plano-implementacao-pdfs.md](plano-implementacao-pdfs.md). Instalação e contexto: [CONTINUAR-AQUI.md](../CONTINUAR-AQUI.md). Materiais: [referencias/README.md](referencias/README.md).

Marque uma entrega somente após implementar e validar seus critérios de aceite. Quando houver trabalho parcial, registre abaixo sem marcar como concluída.

- [x] **1 — Fundação técnica:** contratos atuais de login/cliente conferidos no código existente; serviços autenticados, tipos/erros, tratamento de 401, atualização compartilhada do cliente e consultas públicas preservadas. Validada com testes isolados e build web; homologação com a API real ainda pendente.
- [x] **2 — Cadastro e recuperação:** formulário validado, cadastro/sessão, solicitação do código, quatro dígitos e redefinição; nascimento nulo no perfil. Testes de serviços e navegador com API simulada aprovados; recebimento de e-mail e API real ainda não homologados.
- [x] **3 — Foto e favoritos:** upload validado e sincronização do cliente; consulta/adição/remoção de favoritos em Home, Cardápio e Detalhe com erros e bloqueios. Serviços e navegador com API simulada aprovados; API real e câmera/permissões em dispositivo ainda pendentes.
- [x] **4 — Sacola:** armazenamento por cliente, adição/união/quantidade/remoção, limite 1–99, estados de carregamento/erro/vazio e subtotal real. Serviços e navegador com API simulada aprovados; persistência no dispositivo e API real ainda precisam de homologação. Integração do pagamento permanece na entrega 7.
- [x] **5 — Dependências do checkout:** consulta/cadastro/edição/principal/exclusão de endereços, seleção por sessão e histórico com filtros/paginação e ID para detalhe. Contratos da documentação do professor definidos pelo usuário; serviços e navegador com API simulada aprovados. Backend e dispositivos ainda pendentes de homologação.
- [x] **6 — Detalhes reais:** consulta por ID, itens/totais/modalidade/status reais, nulos, atualização leve de status, cancelamento confirmado e erros. Serviços e navegador com API simulada aprovados; integração com o backend publicado ainda pendente.
- [ ] **7 — Checkout:** agendamento, payload real, POST do pedido, total confirmado, limpeza da sacola e WhatsApp posterior ao registro sem duplicidade.
- [ ] **8 — Homologação:** critérios do plano exercitados, verificações de código e resultados registrados por plataforma.

Dependências adicionais para uma conta nova comprar com entrega:

- [x] Confirmar contratos para criar/editar endereços: documentação do professor indicada pelo usuário em 09/11/2026, registrada em [contratos-enderecos-pedidos.md](contratos-enderecos-pedidos.md).
- [x] Integrar `enderecos.tsx` e `editar-endereco.tsx` para cadastro e seleção no app, validados com API simulada. A conexão com pagamento fica na entrega 7; retirada deve funcionar sem endereço.
- [ ] Publicar e homologar essas rotas no servidor do projeto. O usuário relatou implementação e testes locais, ainda sem commit/publicação; ver [publicacao-backend.md](publicacao-backend.md).

**Registro da retomada**

| Campo | Situação atual |
| --- | --- |
| Última entrega concluída | 6 — Detalhes/status/cancelamento do pedido, validada localmente em 09/11/2026 |
| Entrega em andamento | Nenhuma |
| Próxima ação | Entrega 7: checkout com sacola/endereço, modalidade, agendamento, POST, total confirmado e ações posteriores sem duplicidade |
| Base do código auditado | `cc4b1d6bd88186c8c2c5d24e955f336ae9f5fb13` |
| Contratos a esclarecer | Contratos da documentação do professor aplicados. Mensagens adicionais/normalização de CEP/status do backend registradas como provisórias pelo usuário; ainda confirmar fuso e idempotência |
| Verificação atual | 139 testes de serviços, TypeScript e lint dos arquivos alterados aprovados; export web com 22 rotas aprovado; cinco testes de navegador aprovados no Edge headless com API simulada. Lint global mantém 1 erro e 15 avisos preexistentes; configuração nativa do ImagePicker conferida na entrega 3 |
| Homologação funcional | App validado com respostas simuladas. Usuário relatou backend local aprovado para endereços/pedidos/favoritos/foto, sem commit/publicação. Integração publicada, e-mail e dispositivos Android/iOS pendentes. Sem operações na API do professor |

**Histórico de trabalho**

| Data | Entrega | O que mudou | Validação | Pendências e próxima ação |
| --- | --- | --- | --- | --- |
| 06/11/2026 | Preparação | Plano, contexto de retomada, checklist e oito PDFs no repositório | Comparação estática; verificações anteriores detalhadas no plano | Iniciar entrega 1 |
| 09/11/2026 | 1 — Fundação técnica | HTTP/sessão centralizados; login com erros visíveis; cliente compartilhado e atualizado por foco; salvamento do perfil atualiza Home/Configuração sem sobrescrever formulário em edição | 18 testes isolados, TypeScript, lint dos arquivos alterados e export web aprovados | Entrega 2; homologar API/dispositivos e confirmar contratos faltantes |
| 09/11/2026 | 2 — Cadastro e recuperação | Cadastro com validação, aceite e sessão; solicitação de código; quatro dígitos com foco/Backspace/colagem; validação e redefinição antes de voltar ao login; mensagens e bloqueios de envio | 53 testes de serviços, TypeScript, lint dos arquivos alterados, export web e teste de interface no Edge com API simulada aprovados | Entrega 3; homologar API real/e-mail e Android/iOS |
| 09/11/2026 | 3 — Foto e favoritos | Upload multipart com validação e foto compartilhada; favoritos autenticados nas três telas, sincronizados por foco e resposta da API; bloqueios e erros com nova tentativa; permissões nativas configuradas | 84 testes, TypeScript, lint dos arquivos alterados, export web, introspecção da configuração e os dois testes de navegador aprovados | Entrega 4; homologar API real, câmera, permissões e formatos nos dispositivos |
| 09/11/2026 | 4 — Sacola | Persistência local por cliente, fila de alterações e proteção contra troca de sessão; detalhe adiciona e soma produtos; sacola dinâmica com limites, remoção, subtotal em centavos e recuperação de erros | 101 testes de serviços, TypeScript, lint dos arquivos alterados, export web e os três testes de navegador aprovados | Entrega 5; validar persistência nativa/API real; pagamento ainda é o protótipo a integrar na entrega 7 |
| 09/11/2026 | 5 — Endereços e histórico | Contratos definidos pela documentação indicada pelo usuário; CRUD/principal/seleção de endereços; histórico paginado com filtro no servidor e navegação com ID; remoção dos exemplos de pedido no detalhe | 124 testes de serviços, TypeScript, lint dos arquivos alterados, export web e quatro testes de navegador aprovados | Entrega 6; backend ainda será implementado e homologado; detalhe tem mensagem provisória e pagamento permanece na entrega 7 |
| 09/11/2026 | 6 — Detalhes/status/cancelamento | Pedido por ID, itens/totais/endereço/pagamento/observação reais; acompanhamento por modalidade, status leve e cancelamento com confirmação; registro do backend local relatado pelo usuário | 139 testes de serviços, TypeScript, lint dos arquivos alterados, export web e cinco testes de navegador aprovados com API simulada | Entrega 7; publicar/homologar backend e dispositivos. Este agente não executou os testes locais do backend nem publicou migrations |

**Detalhes da fundação**

| Arquivo | Responsabilidade |
| --- | --- |
| `src/services/http.ts` | JSON/multipart, mensagens da API, erros de rede/resposta inválida, Bearer e expiração de sessão. Não repete requisições automaticamente |
| `src/services/sessao.ts` | Token, identificação do dispositivo e invalidação. Uma resposta 401 antiga não apaga um login novo |
| `src/services/auth.ts` | Login e, desde a entrega 2, cadastro/recuperação; valida token de sessão antes de armazenar e usa reset_token somente em memória |
| `src/services/cliente.ts` | Estado compartilhado, consulta deduplicada e atualização após PUT. Descarta respostas de outra sessão e GET anterior ao salvamento |
| `src/hooks/use-cliente.ts` | Assina o estado compartilhado e atualiza ao focar a tela; retorna `cliente`, `carregando`, `erro` e `atualizarCliente` |
| `src/types/cliente.ts` | Contratos de cliente e dados pessoais, incluindo nascimento e foto nulos |
| `tests/services.test.cjs` | Testes sem API real ou dependência nova; executar com `npm test` |

A conclusão da entrega 1 refere-se à base de código e às verificações locais. Não confirma a disponibilidade de endpoints no servidor nem substitui os testes manuais de sessão/perfil. Login e GET/PUT de cliente reutilizam os contratos já presentes no app; catálogo preserva as funções existentes. Contratos de histórico, mutação de endereços, fuso/status e idempotência continuam a esclarecer nas entregas correspondentes.

As telas Home, Configuração e Editar Perfil foram adaptadas ao retorno novo de `useCliente`. O formulário do perfil inicia por ID do cliente e preserva os valores em edição quando o estado compartilhado é atualizado. Uma troca de conta limpa o estado. Os erros de login agora aparecem no formulário e envios repetidos de login/perfil são bloqueados.

Comandos de validação usados nesta entrega:

```powershell
npm test
npx tsc --noEmit
npx eslint src/services src/types src/hooks/use-cliente.ts src/app/index.tsx src/app/home.tsx src/app/configuracao.tsx src/app/editar-perfil.tsx src/styles/loginStyle.ts tests/services.test.cjs
npx expo export --platform web --output-dir .expo/export-verificacao
```

O lint global restante aponta 3 erros no Cardápio, 1 no Detalhe do Produto e 1 em `use-color-scheme.web.ts`. Eles já existiam na auditoria e não foram suprimidos por configuração. O relatório inicial continua no plano como registro histórico.

**Detalhes de cadastro e recuperação**

O cadastro envia POST `/auth/cadastro` com `nome`, `email`, `telefone`, `senha`, `aceite_termo` e o `device_name` compartilhado com o login. Campos obrigatórios, formato de e-mail, telefone com DDD, senha de pelo menos oito caracteres, confirmação e aceite são validados antes de enviar. A navegação para Home só ocorre após receber e salvar um token válido; erros da API permanecem visíveis no formulário.

A adaptação do guia mantém a decisão da fundação: somente o token é persistido. O cliente é consultado pela API e compartilhado em memória, sem criar outro cache de identidade no AsyncStorage. O cenário de cliente novo com nascimento nulo foi exercitado no navegador ao abrir Editar Perfil.

A recuperação usa POST `/auth/esqueci-senha`, com mensagem genérica no modal somente após sucesso. O e-mail efetivamente enviado segue para a rota de redefinição. A segunda tela aceita quatro dígitos, avança o foco, volta com Backspace e permite colar o código. Não receber e-mail pela rota bloqueia o envio e oferece solicitar outro código.

Ao salvar, POST `/auth/validar-codigo` precisa retornar um `reset_token` válido antes de POST `/auth/redefinir-senha`, cujo corpo contém `reset_token`, `nova_senha` e `nova_senha_confirmation`. Esse token nunca é gravado no armazenamento nem substitui o token de login. Qualquer falha mantém a tela com mensagem e opção de solicitar novo código. O retorno ao login ocorre somente após o segundo POST ter sucesso.

As três telas bloqueiam envios concorrentes com referência síncrona e indicador de progresso. Os inputs usam estado controlado e os campos de senha preservam mostrar/ocultar. Foi retirado o prazo fixo de dez minutos do modal: a validade real ainda precisa de confirmação no servidor.

O teste de navegador cobre formulário vazio, termos recusados, cadastro duplicado, criação da sessão, data nula no perfil, falha/sucesso na solicitação, e-mail na rota, dígitos/foco/Backspace/colagem, senhas divergentes, código inválido, falha ao salvar senha, retorno ao login, e-mail ausente e cliques duplos. Todas as chamadas de API são interceptadas, e qualquer outro destino externo é bloqueado para impedir operações reais durante o teste.

Para repetir as verificações de código:

```powershell
npm test
npx tsc --noEmit
npx eslint src/services/auth.ts src/app/cad-cliente.tsx src/app/esqueci-senha.tsx src/app/redefinir-senha.tsx src/components/linkSenhaModal.tsx src/styles/cadClienteStyle.ts src/styles/esqueciSenhaStyle.ts src/styles/redefinirSenhaStyle.ts tests/services.test.cjs tests/auth-web-smoke.cjs
```

O teste opcional de navegador usa Playwright instalado apenas na pasta ignorada `.expo/browser-tools`, sem alterar as dependências do app. No Windows ele usa o Edge instalado. Em outros sistemas, instale o Chromium do Playwright com `node .expo/browser-tools/node_modules/playwright/cli.js install chromium` após instalar a ferramenta.

```powershell
npm install --prefix .expo/browser-tools --no-save --package-lock=false playwright
npx expo export --platform web --output-dir .expo/export-verificacao
npm run test:web:auth
```

O teste inicia e encerra seu próprio servidor local e navegador headless. As capturas são salvas em `.expo/cadastro-web.png` e `.expo/redefinir-senha-web.png`, fora do Git. Receber o código em e-mail real, validade/uso único, regras adicionais do servidor e comportamento de teclado/autofill no Android/iOS seguem para homologação.

**Detalhes de foto e favoritos**

| Arquivo | Comportamento |
| --- | --- |
| `src/services/favoritos.ts` | GET/POST `/favoritos` e DELETE `/favoritos/{id_produto}` autenticados; IDs normalizados e estado compartilhado; bloqueio síncrono por produto; respostas antigas não desfazem alterações nem afetam outra sessão |
| `src/hooks/use-favoritos.ts` | Consulta por foco, independente do carregamento do catálogo; a mudança de produto também permite atualizar a consulta |
| `src/components/favoritos.tsx` | Estrela e mensagem reutilizadas nas três telas; estado muda após confirmação, bloqueia operação enquanto consulta/processa ou não conhece o estado após erro, e permite tentar a consulta novamente |
| `src/services/foto-perfil.ts` | Validação JPG/PNG/WEBP e limite de 2 MB; File/Blob na web e descritor de arquivo no FormData nativo; POST `/cliente/foto` com o campo `foto_cliente` e a sessão esperada |
| `src/services/cliente.ts` e `src/hooks/use-cliente.ts` | Foto atualizada sem substituir os outros dados; URL com versão para renovar a imagem mesmo se o servidor mantiver o nome; GET anterior não desfaz atualização e PUT de dados pessoais não sobrescreve a foto |
| `src/app/editar-perfil.tsx` | Câmera/galeria, prévia transitória, progresso, bloqueio de seleção/envio e mensagens separadas das alterações pessoais. Cancelar o seletor web não impede abrir outro |
| `app.json` | Plugin ImagePicker com textos de câmera/fotos em português e `microphonePermission: false` |
| `tests/perfil-favoritos-web-smoke.cjs` | Verificação da interface com dados e uploads simulados, sem permitir chamadas externas reais |

Os exemplos dos PDFs foram adaptados ao estado compartilhado da fundação: os favoritos ficam separados dos objetos de catálogo. Assim, as três telas usam o mesmo estado confirmado, sem duplicar funções de POST/DELETE ou atualizar produtos apenas em memória. O catálogo e as categorias continuam utilizáveis quando a consulta de favoritos falha; as consultas de favoritos por foco não precisam recarregar os banners/categorias. A Home continua mostrando somente produtos ativos em destaque.

No perfil, a foto é enviada imediatamente após selecionar/capturar, de forma independente do botão de salvar os dados pessoais. Erros de formato, tamanho ou upload descartam a prévia e preservam a foto anterior. O retorno precisa confirmar `foto_cliente`; o serviço altera somente esse campo. A versão da URL e o fallback por URL permitem exibir uma nova imagem mesmo após uma falha anterior ou retorno do mesmo caminho pelo servidor.

Na web, a validação confere o tamanho do File/Blob efetivamente enviado, além dos metadados. No nativo, usa o tamanho informado pelo ImagePicker quando disponível; o servidor continua responsável por validar os bytes e o limite. Os testes dos descritores Android/iOS são simulações, não execução em aparelho. Uma troca de sessão durante a preparação do arquivo impede enviar a imagem com a conta nova.

Também foram corrigidos os erros de lint dos arquivos Cardápio/Detalhe tocados nesta entrega, preservados busca/contador/subtotal e adicionados rótulos acessíveis aos botões de navegação e favoritos. O erro global restante está em `src/hooks/use-color-scheme.web.ts`, fora desta entrega.

O teste no navegador confirmou favoritos existentes, adicionar/remover nas três telas, cliques duplos, persistência após recarregar, erro de consulta sem perder o catálogo, nova tentativa, busca e troca de conta. Para foto, confirmou cancelamento, rejeição de GIF e arquivo maior que 2 MB, falha do servidor, envio multipart com Bearer, progresso/bloqueio, manutenção do nome ainda não salvo e atualização das imagens em Home e Configurações.

Para repetir as verificações, usando a instalação opcional de Playwright descrita acima:

```powershell
npm test
npx tsc --noEmit
npx eslint src/services src/hooks/use-cliente.ts src/hooks/use-favoritos.ts src/components/favoritos.tsx src/app/home.tsx src/app/cardapio.tsx src/app/detalhe-produto.tsx src/app/editar-perfil.tsx src/app/configuracao.tsx src/app/footer.tsx tests
npx expo export --platform web --output-dir .expo/export-verificacao
npm run test:web:auth
npm run test:web:perfil
```

As capturas desta entrega ficam em `.expo/favoritos-web.png` e `.expo/foto-perfil-web.png`. `npx expo config --type introspect --json` foi usado para conferir os textos de permissão gerados, sem criar projetos nativos. Alterações do config plugin exigem um novo build nativo para aparecer no aplicativo instalado, conforme a [documentação do ImagePicker no SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/imagepicker/).

Antes da homologação final, validar a API real, persistência entre dispositivos, câmera permitida/negada, cancelamento no seletor nativo, recorte/qualidade e formatos/tamanho em Android/iOS. Nenhuma foto real foi enviada ao servidor nesta implementação.

**Detalhes da sacola**

`src/config/sacola.ts` implementa os cinco métodos do guia: carregar, adicionar, alterar quantidade, remover e limpar. Cada operação identifica o cliente pelo GET `/cliente` autenticado e captura uma única chave `sacola_cliente_<id_cliente>`; não confia no antigo cache local de cliente. A fila serializa leituras e alterações para preservar unidades em chamadas simultâneas. Mudanças de sessão invalidam operações antigas, inclusive as que estavam na fila. Uma gravação que já começou pode terminar somente na chave capturada da conta anterior; seu resultado é recusado após uma troca de sessão.

IDs, preços, quantidades, estrutura do JSON e duplicatas são validados. O limite de 1–99 vale também ao somar unidades de um produto existente. Ao adicionar novamente, nome, descrição, foto e preço são atualizados com o produto consultado. Produtos inativos não podem ser adicionados. Os subtotais são calculados em centavos; não representam o total final confirmado pelo servidor.

O detalhe bloqueia toques repetidos e navega somente após salvar. A sacola atualiza ao receber foco, mostra itens/fotos com fallback, permite alterar e remover, distingue carregamento/erro/vazio e bloqueia pagamento quando vazia, ocupada ou com erro. Trocar a conta limpa imediatamente os dados exibidos. Falhas ao salvar preservam a lista anterior e exigem nova leitura antes de continuar. JSON inválido nunca é apagado automaticamente: há nova tentativa e a ação explícita “Esvaziar sacola” para recomeçar.

Foram retirados endereço, frete e descontos fictícios da sacola. O cupom permanece visível e desabilitado, com indicação de indisponibilidade, pois o guia não define aplicação de desconto. O botão continua navegando para `/pagamento` quando há itens, conforme o guia; **a tela de pagamento ainda contém dados de demonstração e será integrada na entrega 7**. Nenhum pedido foi confirmado nem WhatsApp aberto nos testes.

Os 17 novos testes de serviços cobrem união e metadados, operações simultâneas, subtotal, limites, validação de produtos/identidade/dados locais, sessão ausente/expirada, troca de conta durante consulta/leitura/gravação, falhas de armazenamento e recuperação da fila. O teste de navegador cobre adição e união, quantidades 1 e 99 no detalhe e na sacola, cliques repetidos, remoção, subtotal, recarga, contas A/B e retorno a A, favoritos preservados, erros de API/leitura/gravação, recuperação de JSON inválido e bloqueio do pagamento vazio. Os testes anteriores de autenticação e perfil/favoritos também passaram.

Para repetir, com o Playwright opcional descrito acima:

```powershell
npm test
npx tsc --noEmit
npx eslint src/config/sacola.ts src/app/sacola.tsx src/app/detalhe-produto.tsx src/styles/sacolaStyle.ts src/styles/detalheProdutoStyle.ts tests/services.test.cjs tests/sacola-web-smoke.cjs
npx expo export --platform web --output-dir .expo/export-verificacao
npm run test:web:auth
npm run test:web:perfil
npm run test:web:sacola
```

As capturas ficam em `.expo/sacola-web-itens.png` e `.expo/sacola-web-aprovada.png`, fora do Git. O lint global mantém o erro anterior em `use-color-scheme.web.ts:11` e 15 avisos em outros arquivos. Não houve alteração de dependências do app.

A sacola é local ao navegador/aparelho e não sincroniza entre dispositivos; logout mantém os itens para o próximo login do mesmo cliente. A identificação exige acesso à API mesmo para ler a sacola. Ainda é necessário homologar GET `/cliente` e a persistência após reinício no Android/iOS, além de concluir as entregas 5–8 antes do fluxo completo de compra.

**Detalhes de endereços e histórico**

Os contratos foram obtidos na [documentação do professor indicada pelo usuário](https://xyzcode.tipi5.smpsistema.com.br/davilla/api/documentacao) e resumidos em [contratos-enderecos-pedidos.md](contratos-enderecos-pedidos.md). A informação anterior de contrato ausente no diagnóstico histórico foi resolvida. A API configurada não mudou; o usuário informou que o backend será ajustado à documentação. Nenhuma conta foi criada na API do professor e nenhum dado foi escrito nela.

`services/enderecos.ts` centraliza GET/POST/PATCH/DELETE e PUT de principal, valida campos/tamanhos/UF/CEP, usa Bearer, bloqueia alterações concorrentes e descarta respostas de sessões antigas. A lista/seleção são compartilhadas em memória e limpas ao trocar a conta. Somente endereços da lista autenticada atual podem ser selecionados. Principal salvo no servidor e destino selecionado para a compra são estados distintos. A lista é atualizada por foco e após alterações; uma leitura anterior não desfaz um salvamento confirmado. Se a alteração foi confirmada e somente a atualização da lista falhar, o formulário não tenta cadastrar novamente.

`enderecos.tsx` substitui os três exemplos pela lista real, com carregamento/erro/vazio, escolha do destino, estrela de principal e confirmação de exclusão por modal compatível com web. `editar-endereco.tsx` atende criação e edição por ID, inclui número/complemento separados, valida antes de enviar, preserva campos em caso de erro e bloqueia reenvios. O serviço envia somente os campos documentados, incluindo CEP na edição. Respostas 404 e parâmetros inválidos impedem salvar um endereço desconhecido.

`services/pedidos.ts` lê GET `/pedidos` e valida a lista e `meta`. `http.ts` agora preserva esse campo do envelope. `meus-pedidos.tsx` pagina sem duplicar IDs, envia filtros ao servidor, mostra total/status/datas retornados e trata produto nulo. Todos e cancelados estão acessíveis. Erros ao carregar mais mantêm os cartões anteriores; mudar o filtro/conta ignora respostas atrasadas. Não calcula o total histórico usando os preços atuais do catálogo.

O detalhe já recebe o ID da venda na rota. Seu conteúdo fixo foi substituído por uma mensagem de indisponibilidade para não mostrar dados fictícios enquanto a entrega 6 estiver pendente. A leitura completa e o cancelamento serão implementados nela. O pagamento ainda depende da entrega 7 para usar a sacola e o endereço selecionado. `components/tela.tsx` reúne o layout comum dessas telas. `use-hidratado.ts` evita divergência entre HTML estático e parâmetros da URL ao abrir diretamente o formulário/detalhe na web.

Os **23 novos testes** de serviços cobrem contratos, campos permitidos, validação, principal/seleção, remoção, IDs, paginação, status, nulos, datas e falhas, além de concorrência e troca de conta. A infraestrutura isolada existente passou para `tests/ambiente.cjs` e é compartilhada pelas duas suítes, sem dependência nova.

O teste web novo confirmou formulário vazio, erro de cadastro com campos preservados, salvamento/cliques repetidos, edição de número/CEP, seleção preservada por foco, principal independente da seleção, exclusão cancelada/confirmada, leitura após salvamento com falha sem novo POST, saída durante o envio e retorno sem repetir cadastro, histórico com paginação/duplicatas, filtro vazio, filtros rápidos/resposta atrasada, metadados inválidos, ID no detalhe, abertura direta sem erro de hidratação e contas A/B sem compartilhar dados. Os três testes web anteriores também passaram. As capturas ficam em `.expo/enderecos-web.png` e `.expo/historico-web.png`.

```powershell
npm test
npx tsc --noEmit
npx eslint src/services/enderecos.ts src/services/pedidos.ts src/services/http.ts src/hooks/use-enderecos.ts src/hooks/use-hidratado.ts src/components/tela.tsx src/app/enderecos.tsx src/app/editar-endereco.tsx src/app/meus-pedidos.tsx src/app/detalhe-pedido.tsx src/styles/enderecosStyle.ts src/styles/editarEnderecoStyle.ts src/styles/meusPedidosStyle.ts tests
npx expo export --platform web --output-dir .expo/export-verificacao
npm run test:web:auth
npm run test:web:perfil
npm run test:web:sacola
npm run test:web:dependencias
```

O pacote do backend definido durante esta entrega inclui endereços/pedidos e favoritos/foto; recuperação de senha fica para o próximo pacote com SMTP. Essa é uma dependência externa registrada, não código de backend implementado neste repositório. Ainda validar as rotas implantadas, autorização entre clientes, persistência após reinício, fuso/status e comportamento em Android/iOS. O erro global de lint anterior permanece em `use-color-scheme.web.ts:11`.

**Detalhes do pedido, status e cancelamento**

`services/pedidos.ts` passou a consultar GET `/pedidos/{id}` e `/pedidos/{id}/status`, validar o ID e os dados e cancelar com PUT `/pedidos/{id}/cancelar` sem corpo. Totais/subtotal/desconto são os retornados pelo servidor; apenas os valores de cada linha usam preço unitário histórico e quantidade em centavos. Produto/endereço/cupom/datas/observação nulos são tratados, e campos adicionais de endereço são aceitos. Descrições de status da API são preservadas; os códigos determinam as ações.

`hooks/use-pedido.ts` atualiza a consulta completa por foco e oferece atualização manual de status. Quando o código muda, atualiza os dados completos; quando permanece igual, usa a resposta leve. Não há polling em segundo plano. Troca de conta limpa o pedido/modal e descarta respostas antigas. Revisões por pedido impedem GET antigo de sobrescrever cancelamento; bloqueio síncrono no serviço impede PUTs simultâneos do mesmo pedido.

`detalhe-pedido.tsx` substitui a mensagem provisória da entrega 5 pelo pedido real, mantendo o layout comum e os cartões de resumo/pagamento/observação. O endereço aparece somente para entrega. O acompanhamento distingue preparo, pronto para envio/retirada, saída para entrega e conclusão; `PRONTO` não retorna à etapa de preparo. Em pendente não há etapas concluídas; cancelado e códigos desconhecidos não desenham uma trilha fictícia. Não há frete ou previsão fixa. O contato da loja foi preservado com o número já existente no app; a abertura externa não foi exercitada pelos testes.

O cancelamento só é oferecido para `PENDENTE` e exige um modal de confirmação. O servidor ainda decide se é permitido no instante do PUT. Uma confirmação resumida com o ID correto e `CANCELADO` atualiza a tela e os itens, sem depender de outro GET para confirmar a ação. 422, erro de rede ou resposta sem confirmação bloqueiam novo cancelamento até atualizar o pedido. Falha posterior na leitura não provoca novo PUT. IDs ausentes/inválidos, 404, erros de resposta e nova tentativa têm estados próprios. Recompra automática continua fora do escopo dos PDFs.

Os **15 novos testes de serviços** cobrem contratos, totais independentes dos itens, nulos, IDs inválidos/divergentes, resposta parcial de cancelamento, 422/401/404/500, concorrência, GET antigo, troca de conta e estados do acompanhamento. O teste web confirmou esses fluxos na interface, incluindo abertura direta/recarga sem erro de hidratação, retirada em `PRONTO`, conclusão, status desconhecido, imagem indisponível, cancelamento recusado/sucesso/clique duplo, GET posterior com falha sem novo PUT, status leve sem nova consulta completa quando não muda e isolamento entre contas. O teste da entrega 5 agora verifica o detalhe real. Os três testes web restantes também passaram.

```powershell
npm test
npx tsc --noEmit
npx eslint src/services/pedidos.ts src/hooks/use-pedido.ts src/app/detalhe-pedido.tsx src/styles/detalhePedidoStyle.ts tests/detalhe-pedido.test.cjs tests/detalhe-pedido-web-smoke.cjs tests/dependencias-web-smoke.cjs
npx expo export --platform web --output-dir .expo/export-verificacao
npm run test:web:auth
npm run test:web:perfil
npm run test:web:sacola
npm run test:web:dependencias
npm run test:web:pedido
```

Capturas em `.expo/detalhe-pedido-web.png` e `.expo/pedido-retirada-web.png`. Não foram criados/cancelados pedidos reais nem abertas mensagens no WhatsApp. O lint global mantém o erro anterior em `use-color-scheme.web.ts:11` e 15 avisos nos arquivos restantes. Nenhuma dependência do app foi adicionada.

O relato de backend local aprovado foi registrado separadamente em [publicacao-backend.md](publicacao-backend.md), com as alterações de estrutura, testes informados, mensagens provisórias e cuidados de implantação. Isso não confirma publicação nem testes de integração feitos por este agente. Ainda faltam checkout, implantação do backend, recuperação por e-mail e homologação em dispositivos.

Ao encerrar uma sessão, acrescente uma linha ao histórico, atualize a tabela de retomada e registre resultados concretos dos testes. Diferencie código implementado de comportamento efetivamente homologado.
