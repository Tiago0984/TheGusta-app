# Progresso da implementação

Última atualização: **09/11/2026**. Fundação, cadastro/recuperação, foto de perfil, favoritos e sacola por cliente foram implementados e validados localmente. A próxima entrega é a integração de endereços e histórico, dependências do checkout.

Plano de referência: [plano-implementacao-pdfs.md](plano-implementacao-pdfs.md). Instalação e contexto: [CONTINUAR-AQUI.md](../CONTINUAR-AQUI.md). Materiais: [referencias/README.md](referencias/README.md).

Marque uma entrega somente após implementar e validar seus critérios de aceite. Quando houver trabalho parcial, registre abaixo sem marcar como concluída.

- [x] **1 — Fundação técnica:** contratos atuais de login/cliente conferidos no código existente; serviços autenticados, tipos/erros, tratamento de 401, atualização compartilhada do cliente e consultas públicas preservadas. Validada com testes isolados e build web; homologação com a API real ainda pendente.
- [x] **2 — Cadastro e recuperação:** formulário validado, cadastro/sessão, solicitação do código, quatro dígitos e redefinição; nascimento nulo no perfil. Testes de serviços e navegador com API simulada aprovados; recebimento de e-mail e API real ainda não homologados.
- [x] **3 — Foto e favoritos:** upload validado e sincronização do cliente; consulta/adição/remoção de favoritos em Home, Cardápio e Detalhe com erros e bloqueios. Serviços e navegador com API simulada aprovados; API real e câmera/permissões em dispositivo ainda pendentes.
- [x] **4 — Sacola:** armazenamento por cliente, adição/união/quantidade/remoção, limite 1–99, estados de carregamento/erro/vazio e subtotal real. Serviços e navegador com API simulada aprovados; persistência no dispositivo e API real ainda precisam de homologação. Integração do pagamento permanece na entrega 7.
- [ ] **5 — Dependências do checkout:** endereços reais e seleção; histórico com contrato confirmado e navegação com ID para detalhe.
- [ ] **6 — Detalhes reais:** consulta por ID, dados/totais/status/modalidade reais, nulos, cancelamento e erros.
- [ ] **7 — Checkout:** agendamento, payload real, POST do pedido, total confirmado, limpeza da sacola e WhatsApp posterior ao registro sem duplicidade.
- [ ] **8 — Homologação:** critérios do plano exercitados, verificações de código e resultados registrados por plataforma.

Dependências adicionais para uma conta nova comprar com entrega:

- [ ] Confirmar contratos para criar/editar endereços.
- [ ] Integrar `enderecos.tsx` e `editar-endereco.tsx` para permitir cadastro e seleção reais. O PDF de pagamento pressupõe endereço já existente; retirada deve funcionar sem endereço.

**Registro da retomada**

| Campo | Situação atual |
| --- | --- |
| Última entrega concluída | 4 — Sacola, validada localmente em 09/11/2026 |
| Entrega em andamento | Nenhuma |
| Próxima ação | Entrega 5: confirmar contratos complementares e integrar cadastro/seleção de endereços e histórico com navegação por ID |
| Base do código auditado | `cc4b1d6bd88186c8c2c5d24e955f336ae9f5fb13` |
| Contratos a esclarecer | Histórico/paginação/filtros; criação/edição de endereços; semântica de status e fuso; idempotência, se suportada |
| Verificação atual | 101 testes de serviços, TypeScript e lint dos arquivos alterados aprovados; export web com 22 rotas aprovado; testes de autenticação, perfil/favoritos e sacola aprovados no Edge headless com API simulada. Lint global ainda tem 1 erro e 15 avisos preexistentes nos arquivos restantes; configuração nativa do ImagePicker conferida na entrega 3 |
| Homologação funcional | Interface web exercitada com respostas simuladas. API real, recebimento de e-mail, câmera/permissões e dispositivos Android/iOS ainda não homologados |

**Histórico de trabalho**

| Data | Entrega | O que mudou | Validação | Pendências e próxima ação |
| --- | --- | --- | --- | --- |
| 06/11/2026 | Preparação | Plano, contexto de retomada, checklist e oito PDFs no repositório | Comparação estática; verificações anteriores detalhadas no plano | Iniciar entrega 1 |
| 09/11/2026 | 1 — Fundação técnica | HTTP/sessão centralizados; login com erros visíveis; cliente compartilhado e atualizado por foco; salvamento do perfil atualiza Home/Configuração sem sobrescrever formulário em edição | 18 testes isolados, TypeScript, lint dos arquivos alterados e export web aprovados | Entrega 2; homologar API/dispositivos e confirmar contratos faltantes |
| 09/11/2026 | 2 — Cadastro e recuperação | Cadastro com validação, aceite e sessão; solicitação de código; quatro dígitos com foco/Backspace/colagem; validação e redefinição antes de voltar ao login; mensagens e bloqueios de envio | 53 testes de serviços, TypeScript, lint dos arquivos alterados, export web e teste de interface no Edge com API simulada aprovados | Entrega 3; homologar API real/e-mail e Android/iOS |
| 09/11/2026 | 3 — Foto e favoritos | Upload multipart com validação e foto compartilhada; favoritos autenticados nas três telas, sincronizados por foco e resposta da API; bloqueios e erros com nova tentativa; permissões nativas configuradas | 84 testes, TypeScript, lint dos arquivos alterados, export web, introspecção da configuração e os dois testes de navegador aprovados | Entrega 4; homologar API real, câmera, permissões e formatos nos dispositivos |
| 09/11/2026 | 4 — Sacola | Persistência local por cliente, fila de alterações e proteção contra troca de sessão; detalhe adiciona e soma produtos; sacola dinâmica com limites, remoção, subtotal em centavos e recuperação de erros | 101 testes de serviços, TypeScript, lint dos arquivos alterados, export web e os três testes de navegador aprovados | Entrega 5; validar persistência nativa/API real; pagamento ainda é o protótipo a integrar na entrega 7 |

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

Ao encerrar uma sessão, acrescente uma linha ao histórico, atualize a tabela de retomada e registre resultados concretos dos testes. Diferencie código implementado de comportamento efetivamente homologado.
