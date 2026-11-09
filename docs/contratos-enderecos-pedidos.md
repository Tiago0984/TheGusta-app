# Contratos de endereços e pedidos

Referência definida pelo usuário em **09/11/2026**: [documentação da API do professor](https://xyzcode.tipi5.smpsistema.com.br/davilla/api/documentacao). A página foi consultada nesta entrega, incluindo corpos, validações, exemplos e paginação. O usuário informou que o backend do app ainda receberá essas rotas e será ajustado a esse contrato.

A API configurada em `src/config/api.ts` continua sendo a do projeto (`coderatech`), sem troca para o servidor do professor. Nenhuma conta foi criada, nem operação autenticada executada nesse servidor. Os testes do app usam respostas simuladas.

**Endereços**

Todas as rotas usam `Accept: application/json` e `Authorization: Bearer <token>`. Requisições JSON incluem `Content-Type: application/json`. O cliente é determinado pelo token; não enviar `id_cliente` no corpo.

| Operação | Rota | Resposta |
| --- | --- | --- |
| Listar | GET `/enderecos` | `success: true`, `data` com array de endereços ativos do cliente, principal primeiro |
| Cadastrar | POST `/enderecos` | 201, `success: true`, `data` do endereço |
| Consultar | GET `/enderecos/{id}` | 200, `success: true`, `data` do endereço; 404 se indisponível ou de outro cliente |
| Editar | PUT ou PATCH `/enderecos/{id}` | 200; campos parciais aceitos; o app usa PATCH com os campos do formulário |
| Principal | PUT `/enderecos/{id}/principal` | 200, confirmação e dados do endereço; sem corpo obrigatório |
| Remover | DELETE `/enderecos/{id}` | 200 com confirmação; remoção lógica |

| Campo de cadastro | Regra |
| --- | --- |
| `nome_endereco` | Obrigatório, até 30 caracteres |
| `endereco` | Logradouro obrigatório, até 40 caracteres |
| `numero` | String obrigatória, até 6 caracteres |
| `complemento` | Opcional/nulo, até 50 caracteres |
| `bairro`, `cidade` | Obrigatórios, até 40 caracteres cada |
| `uf` | Duas letras, salva em maiúsculas |
| `cep` | Oito dígitos, com ou sem hífen; o app envia sem hífen |
| `principal_endereco` | Opcional, `SIM` ou `NAO`; o formulário do app não envia esse campo |

O primeiro endereço é principal automaticamente. Marcar outro como principal substitui o anterior. Na edição, enviar `NAO` não desfaz o principal; é necessário marcar outro como `SIM`. Excluir o principal promove o endereço ativo mais recente. O app recarrega a lista para obter essa escolha do servidor.

O modelo de leitura inclui `id_endereco` positivo, os campos acima, `principal_endereco` e, na API, identificação do cliente/status. A seleção para a compra fica em memória na sessão, separada do principal salvo. Somente um ID da lista autenticada atual pode ser selecionado. Ao atualizar a lista, uma seleção que ainda existe é preservada; caso contrário, usa principal, primeiro endereço ou nenhum. Troca de conta apaga lista e seleção.

**Histórico de pedidos**

GET `/pedidos?page=1&por_pagina=10`, com Bearer, retorna pedidos do cliente em ordem decrescente. `page` começa em 1; `por_pagina` aceita 1–50 e tem padrão 10. O app usa 10. O parâmetro opcional `status` aceita `PENDENTE`, `CONFIRMADO`, `EM_PREPARO`, `PRONTO`, `EM_ENTREGA`, `ENTREGUE` ou `CANCELADO`.

O envelope tem `success`, `data` (array) e `meta` com `pagina_atual`, `ultima_pagina`, `por_pagina` e `total`. O HTTP compartilhado passou a preservar `meta`. O serviço valida esses metadados antes de mostrar a página; não estima a última página pelo número de itens.

Cada pedido usado pelo histórico contém `id_venda`, `valor_venda`, `status_venda`, `status_descricao_venda`, `entrega_venda`, datas e `itens`. Cada item tem `id_item`, `qtde_item` e `produto` com nome/foto, podendo o produto ser nulo. O total exibido vem de `valor_venda`. Não reconstruir o preço de um pedido antigo usando o catálogo atual.

Os filtros do app são enviados ao servidor; não filtram somente a página carregada. “Todos” inclui cancelados e eventuais status novos. Ao carregar outra página, IDs repetidos são unidos sem duplicar o cartão. Uma falha mantém as páginas já consultadas e permite repetir a página que falhou. Trocar o filtro ou a sessão descarta respostas anteriores.

A descrição de status recebida é exibida diretamente. Os textos de fallback do app não definem mensagens obrigatórias do backend. Datas nulas/inválidas mostram ausência de informação. Datas com offset são exibidas no fuso do dispositivo; datas sem offset mantêm os componentes informados, até confirmação do fuso do servidor.

**Próximas entregas e homologação**

GET `/pedidos/{id}`, GET `/pedidos/{id}/status` e PUT `/pedidos/{id}/cancelar` estão integrados desde a entrega 6, com testes simulados. A leitura completa valida o ID recebido, itens/preços e totais, endereço/cupom/datas/observação nulos. O endereço pode conter os campos adicionais do backend sem quebrar o exemplo mínimo do PDF. A atualização de status é manual e também ocorre ao retornar à tela pela consulta completa, sem polling em segundo plano.

O cancelamento usa PUT sem corpo, com confirmação e bloqueio de toque repetido. A resposta pode ser resumida: `id_venda` e status `CANCELADO` precisam confirmar o resultado, sem exigir outro GET para considerar a ação concluída. Depois de um erro ou resultado incerto, o app bloqueia novo cancelamento até atualizar o pedido. O servidor decide se ele ainda é `PENDENTE`; 422 é exibido e não tratado como sucesso. O acompanhamento diferencia `PRONTO` para envio/retirada e só marca conclusão quando o código é `ENTREGUE`.

POST `/pedidos` e a conexão entre sacola, endereço selecionado e confirmação ficam na entrega 7. Recompra automática não faz parte do contrato dos oito PDFs; o antigo botão que apenas abria pagamento não foi reintroduzido como uma ação de recompra.

O usuário relatou implementação e testes locais de endereços/pedidos e favoritos/foto no backend em 09/11/2026, ainda sem commit e publicação. O [registro de publicação](publicacao-backend.md) preserva essa evidência e as pendências do servidor. Recuperação de senha depende do envio de e-mail. Não tratar testes simulados do app como confirmação de rotas já disponíveis no servidor publicado. Na homologação, validar mensagens não especificadas, autorização entre clientes, datas/fuso e alterações de status pela confeitaria.
