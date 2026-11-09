# Progresso da implementação

Última atualização: **09/11/2026**. A implementação foi retomada no computador original. A fundação técnica foi implementada e validada localmente; as etapas funcionais seguintes continuam pendentes.

Plano de referência: [plano-implementacao-pdfs.md](plano-implementacao-pdfs.md). Instalação e contexto: [CONTINUAR-AQUI.md](../CONTINUAR-AQUI.md). Materiais: [referencias/README.md](referencias/README.md).

Marque uma entrega somente após implementar e validar seus critérios de aceite. Quando houver trabalho parcial, registre abaixo sem marcar como concluída.

- [x] **1 — Fundação técnica:** contratos atuais de login/cliente conferidos no código existente; serviços autenticados, tipos/erros, tratamento de 401, atualização compartilhada do cliente e consultas públicas preservadas. Validada com testes isolados e build web; homologação com a API real ainda pendente.
- [ ] **2 — Cadastro e recuperação:** formulário validado, cadastro/sessão, solicitação do código, quatro dígitos e redefinição; nascimento nulo no perfil.
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
| Última entrega concluída | 1 — Fundação técnica, validada localmente em 09/11/2026 |
| Entrega em andamento | Nenhuma |
| Próxima ação | Entrega 2: cadastro e recuperação usando os novos serviços; confirmar contratos complementares de histórico/endereços antes da entrega 5 |
| Base do código auditado | `cc4b1d6bd88186c8c2c5d24e955f336ae9f5fb13` |
| Contratos a esclarecer | Histórico/paginação/filtros; criação/edição de endereços; semântica de status e fuso; idempotência, se suportada |
| Verificação atual | 18 testes de serviços aprovados; TypeScript aprovado; lint dos arquivos alterados aprovado; export web aprovado com 22 rotas. Lint global ainda tem 5 erros e 31 avisos preexistentes nos arquivos restantes |
| Homologação funcional | API real e dispositivos ainda não homologados; testes usam transporte, armazenamento e navegação simulados |

**Histórico de trabalho**

| Data | Entrega | O que mudou | Validação | Pendências e próxima ação |
| --- | --- | --- | --- | --- |
| 06/11/2026 | Preparação | Plano, contexto de retomada, checklist e oito PDFs no repositório | Comparação estática; verificações anteriores detalhadas no plano | Iniciar entrega 1 |
| 09/11/2026 | 1 — Fundação técnica | HTTP/sessão centralizados; login com erros visíveis; cliente compartilhado e atualizado por foco; salvamento do perfil atualiza Home/Configuração sem sobrescrever formulário em edição | 18 testes isolados, TypeScript, lint dos arquivos alterados e export web aprovados | Entrega 2; homologar API/dispositivos e confirmar contratos faltantes |

**Detalhes da fundação**

| Arquivo | Responsabilidade |
| --- | --- |
| `src/services/http.ts` | JSON/multipart, mensagens da API, erros de rede/resposta inválida, Bearer e expiração de sessão. Não repete requisições automaticamente |
| `src/services/sessao.ts` | Token, identificação do dispositivo e invalidação. Uma resposta 401 antiga não apaga um login novo |
| `src/services/auth.ts` | Login com o contrato já usado no app; valida o token antes de armazenar |
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

Ao encerrar uma sessão, acrescente uma linha ao histórico, atualize a tabela de retomada e registre resultados concretos dos testes. Diferencie código implementado de comportamento efetivamente homologado.
