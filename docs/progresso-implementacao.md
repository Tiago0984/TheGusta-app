# Progresso da implementação

Última atualização: **09/11/2026**. A implementação foi retomada no computador original. Fundação, cadastro e recuperação foram implementados e validados localmente. Foto e favoritos são a próxima entrega.

Plano de referência: [plano-implementacao-pdfs.md](plano-implementacao-pdfs.md). Instalação e contexto: [CONTINUAR-AQUI.md](../CONTINUAR-AQUI.md). Materiais: [referencias/README.md](referencias/README.md).

Marque uma entrega somente após implementar e validar seus critérios de aceite. Quando houver trabalho parcial, registre abaixo sem marcar como concluída.

- [x] **1 — Fundação técnica:** contratos atuais de login/cliente conferidos no código existente; serviços autenticados, tipos/erros, tratamento de 401, atualização compartilhada do cliente e consultas públicas preservadas. Validada com testes isolados e build web; homologação com a API real ainda pendente.
- [x] **2 — Cadastro e recuperação:** formulário validado, cadastro/sessão, solicitação do código, quatro dígitos e redefinição; nascimento nulo no perfil. Testes de serviços e navegador com API simulada aprovados; recebimento de e-mail e API real ainda não homologados.
- [ ] **3 — Foto e favoritos:** upload validado e sincronização do cliente; favoritos persistentes em Home, Cardápio e Detalhe com erros e bloqueios.
- [ ] **4 — Sacola:** armazenamento por cliente, adição/união/quantidade/remoção, limite 1–99, estados de carregamento/erro/vazio e subtotal real.
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
| Última entrega concluída | 2 — Cadastro e recuperação, validada localmente em 09/11/2026 |
| Entrega em andamento | Nenhuma |
| Próxima ação | Entrega 3: upload da foto e favoritos nas três telas; confirmar contratos complementares de histórico/endereços antes da entrega 5 |
| Base do código auditado | `cc4b1d6bd88186c8c2c5d24e955f336ae9f5fb13` |
| Contratos a esclarecer | Histórico/paginação/filtros; criação/edição de endereços; semântica de status e fuso; idempotência, se suportada |
| Verificação atual | 53 testes de serviços aprovados; TypeScript e lint dos arquivos alterados aprovados; export web com 22 rotas aprovado; fluxo de autenticação aprovado no Edge headless com API simulada. Lint global ainda tem 5 erros e 21 avisos preexistentes nos arquivos restantes |
| Homologação funcional | Interface web exercitada com respostas simuladas. API real, recebimento do e-mail e dispositivos Android/iOS ainda não homologados |

**Histórico de trabalho**

| Data | Entrega | O que mudou | Validação | Pendências e próxima ação |
| --- | --- | --- | --- | --- |
| 06/11/2026 | Preparação | Plano, contexto de retomada, checklist e oito PDFs no repositório | Comparação estática; verificações anteriores detalhadas no plano | Iniciar entrega 1 |
| 09/11/2026 | 1 — Fundação técnica | HTTP/sessão centralizados; login com erros visíveis; cliente compartilhado e atualizado por foco; salvamento do perfil atualiza Home/Configuração sem sobrescrever formulário em edição | 18 testes isolados, TypeScript, lint dos arquivos alterados e export web aprovados | Entrega 2; homologar API/dispositivos e confirmar contratos faltantes |
| 09/11/2026 | 2 — Cadastro e recuperação | Cadastro com validação, aceite e sessão; solicitação de código; quatro dígitos com foco/Backspace/colagem; validação e redefinição antes de voltar ao login; mensagens e bloqueios de envio | 53 testes de serviços, TypeScript, lint dos arquivos alterados, export web e teste de interface no Edge com API simulada aprovados | Entrega 3; homologar API real/e-mail e Android/iOS |

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

Ao encerrar uma sessão, acrescente uma linha ao histórico, atualize a tabela de retomada e registre resultados concretos dos testes. Diferencie código implementado de comportamento efetivamente homologado.
