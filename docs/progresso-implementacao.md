# Progresso da implementação

Atualização inicial: **06/11/2026**. Esta é a transferência do diagnóstico; nenhuma entrega de implementação foi concluída nesta preparação.

Plano de referência: [plano-implementacao-pdfs.md](plano-implementacao-pdfs.md). Instalação e contexto: [CONTINUAR-AQUI.md](../CONTINUAR-AQUI.md). Materiais: [referencias/README.md](referencias/README.md).

Marque uma entrega somente após implementar e validar seus critérios de aceite. Quando houver trabalho parcial, registre abaixo sem marcar como concluída.

- [ ] **1 — Fundação:** confirmar contratos; serviços autenticados, tipos/erros, tratamento de 401 e atualização do cliente; preservar consultas atuais.
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
| Última entrega concluída | Nenhuma; somente auditoria e preparação para transferência |
| Entrega em andamento | Nenhuma |
| Próxima ação | Entrega 1: revisar serviços/cliente e confirmar contratos de API |
| Base do código auditado | `cc4b1d6bd88186c8c2c5d24e955f336ae9f5fb13` |
| Contratos a esclarecer | Histórico/paginação/filtros; criação/edição de endereços; semântica de status e fuso; idempotência, se suportada |
| Verificação anterior | TypeScript passou; ESLint: 7 erros e 38 avisos preexistentes |
| Homologação funcional | Não realizada |

**Histórico de trabalho**

| Data | Entrega | O que mudou | Validação | Pendências e próxima ação |
| --- | --- | --- | --- | --- |
| 06/11/2026 | Preparação | Plano, contexto de retomada, checklist e oito PDFs no repositório | Comparação estática; verificações anteriores detalhadas no plano | Iniciar entrega 1 |

Ao encerrar uma sessão, acrescente uma linha ao histórico, atualize a tabela de retomada e registre resultados concretos dos testes. Diferencie código implementado de comportamento efetivamente homologado.
