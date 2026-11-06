# Verificação dos PDFs e plano de implementação

Data: 06/11/2026. Escopo: comparar os oito PDFs fornecidos com o código deste repositório e planejar sua conclusão.

Para continuar em outro computador, leia [CONTINUAR-AQUI.md](../CONTINUAR-AQUI.md) e atualize o [checklist de progresso](progresso-implementacao.md). As cópias dos oito PDFs estão em [referencias/](referencias/README.md).

Os comandos e trechos dos PDFs foram tratados como requisitos de referência. Esta entrega é uma auditoria e um plano; o código funcional do app não foi alterado.

**Resultado geral**

Nenhum dos oito guias está implementado por completo. As telas existem, mas a maior parte das integrações descritas ainda falta. Há implementações reais de login, consulta do cliente, atualização dos dados pessoais e catálogo que devem ser reaproveitadas.

| PDF | Já existe no código | Falta para concluir |
| --- | --- | --- |
| Atualizar foto perfil.pdf | Câmera, galeria, prévia local, foto do servidor e salvamento dos dados pessoais | Validar e enviar a foto, acompanhar o envio e atualizar os consumidores do cliente |
| Criar Conta - The Gusta - APP.pdf | Layout, termos, exibição das senhas e perfil tolerante a nascimento nulo | Controlar campos, validar, cadastrar pela API e iniciar a sessão |
| Detalhe_Produto_Favoritos.pdf | Produto real por slug, estrela local, quantidade e subtotal | Consultar, adicionar e remover favoritos persistidos |
| Documentação Detalhes do Pedido.pdf | Layout, trilha visual e contato com a loja | Receber ID, consultar pedido e exibir seus dados e status reais |
| Documentação Tela de Pagamento.pdf | Seleção local de modalidade/pagamento, observação e abertura do WhatsApp | Sacola e endereços reais, agendamento, criação do pedido e confirmação pela API |
| Documentação Tela Sacola.pdf | Layout e navegação para pagamento | Armazenamento por cliente, adição, edição, remoção e totais dinâmicos |
| Favoritos_Cardapio e Home.pdf | Catálogo real, filtros, destaques e estrelas locais | Integração de favoritos e sincronização entre telas |
| Guia Esqueci a Senha e Redefinição.pdf | Telas, modal e exibição das senhas | Solicitar código, informar quatro dígitos, validar e redefinir pela API |

**Como interpretar a verificação**

“Pronto” significa que o comportamento foi encontrado no código; não equivale a homologação no dispositivo. “Parcial” significa que uma parte da etapa existe. “Pendente” significa que a implementação necessária à etapa não foi encontrada, mesmo que haja um botão ou layout correspondente.

Foram lidas as 38 páginas dos oito PDFs e os arquivos relacionados em `src/app`, `src/hooks`, `src/services`, `src/config` e `src/styles`. A verificação foi estática, acompanhada de TypeScript e ESLint. Não foram executados cadastros, recuperação de senha, uploads, pedidos ou mensagens reais. A implementação do servidor não está neste repositório; os contratos apresentados nos PDFs precisam ser confirmados na homologação.

**1. Atualizar foto perfil.pdf — 4 páginas**

Evidência: [editar-perfil.tsx](../src/app/editar-perfil.tsx), especialmente seleção de imagem a partir da linha 81, envio de dados pessoais a partir da linha 226 e foto a partir da linha 344; [use-cliente.ts](../src/hooks/use-cliente.ts).

| Etapas do PDF | Situação | Evidência e trabalho restante |
| --- | --- | --- |
| 1 — Imports e dependências | Pronto | ImagePicker, Platform, AsyncStorage, API e IMAGEM já são usados; as dependências já estão instaladas |
| 2 — Estado da foto e indicador de envio | Pendente | `imagem` ainda é `string \| null`; não guarda o asset nem há `enviandoFoto` |
| 3 — `enviarFoto` | Pendente | Não há POST `/cliente/foto`, FormData, validação de MIME ou limite de 2 MB |
| 4 e 5 — Galeria/câmera com upload | Parcial | Seleção, captura, cancelamento e permissão da câmera existem; as funções apenas guardam a URI, sem upload ou tratamento completo de falhas |
| 6 — Imagem local/servidor/padrão | Parcial | A cadeia de fontes existe; deve passar a usar `imagem.uri` e atualizar a foto confirmada pelo servidor |
| 7 — Bloqueio e progresso | Pendente | Botão não acompanha nem bloqueia envio de foto |
| 8 — Retorno no erro ao salvar dados | Pronto | `salvarPerfil` já retorna quando `!resposta.ok \|\| !json.success` |

O exemplo do PDF chama `setCliente`, mas o hook atual devolve somente `cliente`. Será necessário expor atualização/refetch ou adotar estado compartilhado e adaptar seus consumidores. Home e Configuração também usam o hook, que hoje consulta apenas na montagem; devem refletir a nova foto ao retornar. Limpar o indicador de erro de imagem quando a origem mudar e evitar que uma falha de upload seja exibida com estilo de sucesso de uma operação anterior.

**2. Criar Conta - The Gusta - APP.pdf — 4 páginas**

Evidência: [cad-cliente.tsx](../src/app/cad-cliente.tsx), [index.tsx](../src/app/index.tsx) e `formatarData` em [editar-perfil.tsx](../src/app/editar-perfil.tsx).

| Etapas do PDF | Situação | Evidência e trabalho restante |
| --- | --- | --- |
| 1 — Imports de API e armazenamento | Pendente | Ausentes na tela de cadastro |
| 2 — Estados do formulário | Parcial | Existem visibilidade das senhas, aceite e modal; faltam os cinco valores, mensagem e carregamento |
| 3 — Inputs controlados | Pendente | Campos sem `value` e `onChangeText` |
| 4 — Identificação do dispositivo | Pendente nesta tela | A função já existe no login; extrair para reutilizar |
| 5 — Cadastro e sessão | Pendente | Não há validação, POST `/auth/cadastro`, armazenamento da resposta ou redirecionamento após sucesso |
| 6 — Mensagens e estilo | Pendente | Não há mensagem de cadastro nem `erroCadastro` |
| 7 — Botão funcional | Pendente | “Criar Conta” não tem `onPress`; faltam bloqueio e progresso |
| 8 — Perfil com nascimento nulo | Pronto por comportamento equivalente | `formatarData` retorna vazio sem data e o campo tem placeholder; o arquivo real é `editar-perfil.tsx` |

O login salva somente `token`, enquanto o guia propõe salvar também `cliente`. Definir uma fonte consistente para a identidade e invalidar qualquer cache na troca de conta; a sacola não deve confiar em um cliente antigo salvo localmente. A data nula não quebra a abertura do perfil, mas salvar dados pessoais atualmente exige data válida, comportamento distinto da abertura.

**3. Detalhe_Produto_Favoritos.pdf — 3 páginas**

Evidência: [detalhe-produto.tsx](../src/app/detalhe-produto.tsx), estado na linha 34, carregamento na linha 46 e estrela na linha 151; [api.ts](../src/services/api.ts).

| Etapas do PDF | Situação | Evidência e trabalho restante |
| --- | --- | --- |
| 1 — Imports para integração | Parcial | React e parâmetros da rota existem; faltam armazenamento e atualização por foco |
| 2 — Mensagem e bloqueios | Pendente | Não existem controles por produto ou mensagem de favorito |
| 3 — Produto real e estrela inicial | Parcial | GET por slug funciona; a estrela está em um estado separado, sem estado real do servidor |
| 4 e 5 — Consulta de favoritos por foco | Pendente | Não há GET `/favoritos` nem sincronização ao retornar |
| 6 — POST/DELETE | Pendente | O botão apenas alterna um booleano local |
| 7 — Botão com bloqueio | Parcial | Estrela e clique existem; faltam persistência e bloqueio durante a operação |
| 8 — Erros visíveis | Pendente | Não há mensagem/estilo para erros de favoritos |

Preservar carregamento, erro, nova tentativa, imagens, contador e subtotal já existentes. Normalizar IDs e parâmetros da rota; ao mudar de produto, reinicializar quantidade, erros de imagem e estado transitório. Reutilizar a mesma integração de favoritos das listagens.

**4. Favoritos_Cardapio e Home.pdf — 4 páginas**

Evidência: [cardapio.tsx](../src/app/cardapio.tsx), carregamento na linha 33 e alteração local na linha 120; [home.tsx](../src/app/home.tsx), carregamento na linha 47 e alteração local na linha 169.

| Etapas do PDF | Situação | Evidência e trabalho restante |
| --- | --- | --- |
| 1 e 2 — Imports, mensagens e bloqueios | Parcial | Hooks básicos existem; faltam foco, token e controles de requisição |
| 3 — Categorias independentes | Parcial | Categorias reais são carregadas junto com produtos; separar o ciclo para atualizar favoritos sem perder o catálogo |
| 4 — União de produtos e favoritos | Parcial | Produtos ativos e ordenação no cardápio existem; todos recebem `favorito: false` |
| 5 — Atualização por foco | Pendente | Carregamento inicial usa `useEffect`; não sincroniza ao retornar |
| 6 — Alteração pela API | Pendente | Ambas as telas alteram somente estado local |
| 7 — Bloqueio e acessibilidade da estrela | Parcial | Estrela e clique existem; faltam controles descritos |
| 8 — Mensagem de favorito | Pendente | Há erro geral do catálogo, sem erro específico de favoritos |
| 9 — Aplicação na Home | Parcial | Filtro `destaque_produto === "SIM"` existe; falta integrar e sincronizar os favoritos |

A falha de favoritos deve manter o catálogo utilizável e apresentar a falha sem afirmar um estado não confirmado. Remover os arrays/funções de favoritos antigos sem uso. Preservar busca, categorias, banners e navegação por slug.

**5. Documentação Tela Sacola.pdf — 6 páginas**

Evidência: [sacola.tsx](../src/app/sacola.tsx) e botão “Adicionar à Sacola” em [detalhe-produto.tsx](../src/app/detalhe-produto.tsx). Não existe `src/config/sacola.ts`.

| Etapas do PDF | Situação | Evidência e trabalho restante |
| --- | --- | --- |
| 1 — Persistência compartilhada por cliente | Pendente | Criar tipos, identificação via GET `/cliente` e operações de carregar, adicionar, alterar, remover e limpar |
| 2 — Preparar detalhe | Parcial | Produto, quantidade mínima 1 e subtotal existem; falta limite 99 e estado de adição |
| 3 — Adicionar produto | Pendente | Não há gravação nem tratamento de erro |
| 4 — Botão de adição | Pendente | Botão existe sem `onPress`; deve navegar após salvar |
| 5 — Sacola dinâmica | Pendente | Três cartões fixos; remover e +/- não têm ações; valores e endereço são fixos |

Usar `sacola_cliente_<id_cliente>`, juntar unidades do mesmo produto, limitar cada item a 1–99 e validar preço/ID/quantidade. Validar também o conteúdo recuperado do armazenamento e serializar alterações para evitar perda em toques concorrentes. Capturar a identidade uma vez por operação para não ler uma conta e gravar em outra. Atualizar por foco, mostrar carregamento/erro/vazio e bloquear pagamento com sacola vazia ou operação em andamento. Retirar endereço e frete fictícios da sacola, como orienta o guia.

O PDF mantém a estrutura visual de cupom, mas não implementa aplicação ou validação. A conclusão deste guia não inclui inventar desconto ou endpoint de cupom. Sem integração contratada, o controle deve explicar sua indisponibilidade e não aparentar aplicar um benefício.

**6. Documentação Tela de Pagamento.pdf — 7 páginas**

Evidência: [pagamento.tsx](../src/app/pagamento.tsx), constantes fixas nas linhas 11–25, estados nas linhas 62–64 e confirmação a partir da linha 66.

| Etapas do PDF | Situação | Evidência e trabalho restante |
| --- | --- | --- |
| 1 e 2 — Imports e tipo de endereço | Pendente na parte de integração | Não há sacola, token, API ou tipo real de endereço |
| 3 — Estados e cálculos reais | Parcial | Modalidade, pagamento e observação existem; itens, endereço e totais são fixos; faltam agendamento e controles de envio |
| 4 — Carregamento por foco | Pendente | Não consulta sacola ou endereços |
| 5 — Endereço dinâmico/seleção | Parcial | Há navegação para Endereços, sem carregar ou retornar seleção real |
| 6 — Entrega/retirada | Parcial | Alterna visualmente; não oculta endereço, não muda payload nem remove previsão fictícia |
| 7 — Data e horário | Pendente | Não há campos, máscaras, conversão ou validação de data futura |
| 8 — Formas de pagamento | Parcial | Seleção local funciona; falta enviar os valores `PIX`, `CARTAO` e `DINHEIRO` |
| 9 — Observação | Parcial | Campo controlado e multiline existem; falta `maxLength={500}` e envio no pedido |
| 10 — Resumo e valores reais | Pendente | Usa exemplos e desconto/frete fixos; precisa ler itens e indicar subtotal provisório |
| 11 — Registrar pedido | Parcial apenas no WhatsApp | Abre mensagem com exemplos; não faz POST `/pedidos`, não recebe ID/total confirmado e não limpa sacola |
| 12 — Evitar reenvio | Pendente | Botão sempre habilitado, sem carregamento ou estado de pedido confirmado |

Enviar somente IDs/quantidades dos itens, modalidade `SIM`/`NAO`, endereço quando entrega, pagamento, data/hora e observação opcional. Preços finais são calculados pelo servidor. As opções de pagamento descritas registram a forma escolhida; os PDFs não especificam cobrança por gateway ou geração automática de Pix.

Após sucesso, guardar o ID confirmado na tela, impedir nova criação, tentar limpar a sacola e oferecer acesso ao pedido. WhatsApp é posterior ao registro: falha ao abrir o aplicativo ou limpar a sacola não pode provocar outro POST. Em resposta de rede inconclusiva, consultar histórico antes de reenviar; confirmar se o servidor oferece idempotência, sem presumir suporte.

**7. Documentação Detalhes do Pedido.pdf — 4 páginas**

Evidência: [detalhe-pedido.tsx](../src/app/detalhe-pedido.tsx), dados fixos desde a linha 9; [meus-pedidos.tsx](../src/app/meus-pedidos.tsx), links para detalhes nas linhas 194, 275, 355 e 430.

| Etapas do PDF | Situação | Evidência e trabalho restante |
| --- | --- | --- |
| 1 — Navegação com ID | Pendente | Todos os links abrem a rota sem `id`; a lista também é fictícia |
| 2 a 5 — Tipos, estados e consulta por foco | Pendente | Não há leitura do parâmetro, token ou GET `/pedidos/{id}` |
| 6 — Formatação e status | Pendente | Não existe mapeamento a partir de pedido real |
| 7 — Carregamento, erro e ausência | Pendente | Tela sempre desenha dados de exemplo |
| 8 — Cabeçalho real | Pendente | Número, horário e status são textos fixos |
| 9 — Acompanhamento e data | Parcial apenas no layout | Trilha existe com cores fixas; data/previsão e modalidade não vêm da API |
| 10 — Itens e totais | Parcial apenas no layout | Array e totais fixos; trocar por resposta e retirar frete sem campo documentado |
| 11 — Pagamento e observação | Parcial apenas no layout | Pix e mensagem padrão são fixos |

O guia depende de uma listagem real em “Meus Pedidos” descrita em um guia anterior que não foi fornecido. Confirmar contrato de listagem, paginação e filtros antes de implementar essa dependência. A API de detalhe está descrita; a listagem ainda precisa de contrato confirmado.

Tratar `produto`, `endereco`, `cupom` e datas nulos. Usar totais retornados, sem reconstruir o total final no app. Validar o comportamento de `PRONTO`, retirada e cancelamento: o exemplo do PDF associa `PRONTO` ao índice 0, o que precisa ser ajustado ao significado real do status para representar “Pronto para retirada”. O contato com a loja já abre WhatsApp; o botão “Pedir novamente” hoje só navega para pagamento e não repõe produtos na sacola. Recompra completa é um complemento a especificar, não uma implementação entregue por este PDF.

**8. Guia Esqueci a Senha e Redefinição.pdf — 6 páginas**

Evidência: [esqueci-senha.tsx](../src/app/esqueci-senha.tsx), [redefinir-senha.tsx](../src/app/redefinir-senha.tsx), [linkSenhaModal.tsx](../src/components/linkSenhaModal.tsx) e estilos correspondentes.

| Etapas do PDF | Situação | Evidência e trabalho restante |
| --- | --- | --- |
| 1 — Fluxo completo | Pendente | Não há integração; solicitar abre modal e salvar volta ao login |
| 2 — Imports/API | Parcial | Router existe, API ausente nas duas telas |
| 3 — E-mail e controles | Parcial | Modal existe; e-mail não é controlado e faltam carregamento/mensagem |
| 4 — Solicitar código | Pendente | Não há POST `/auth/esqueci-senha` |
| 5 — Botão/modal e e-mail na rota | Parcial | Modal existe, mas menciona link e retorna ao login sem passar e-mail |
| 6 — Preparar redefinição | Parcial | Visibilidade das senhas existe; faltam parâmetros, estados e refs do código |
| 7 — Quatro dígitos | Pendente | Campos, foco e Backspace não existem |
| 8 — Senhas controladas | Pendente | Inputs sem `value` e `onChangeText` |
| 9 — Validar e redefinir | Pendente | Não há POST `/auth/validar-codigo` ou `/auth/redefinir-senha` |
| 10 — Mensagens e salvar após sucesso | Pendente | Botão apenas navega, sem validação e sem requisição |
| 11 — Estilos específicos | Pendente | Não existem `erroSolicitacao`, `linhaCodigo`, `campoCodigo` e `erroSenha` |

Usar o `reset_token` apenas no fluxo de redefinição, sem sobrescrever o token de login. Trocar a linguagem de “link” para “código”, manter mensagem de solicitação sem revelar existência da conta e mostrar código inválido/expirado sem redirecionar. Confirmar validade com o servidor antes de manter o texto atual de dez minutos.

**Ajustes necessários ao adaptar os exemplos**

- O perfil real é `src/app/editar-perfil.tsx`, não `perfil.tsx`. O setter usado no exemplo de upload não está disponível nesse componente.
- Os assets reais estão em `assets/images/img/`, enquanto exemplos usam subpastas `icones/` e `logo/`. Preservar os caminhos existentes e usar fallback local para imagens ausentes.
- Os guias citam estilos com nomes diferentes dos atuais. Exemplos: `btnCriar` versus `btnEntrar`, `iconeFavorito` versus `txtFavorito` e `areaTotal` versus `total`. Adaptar o comportamento ao layout atual, acrescentando somente estilos necessários.
- O exemplo completo de Sacola usa `TextInput` e `cores` sem importá-los. Corrigir esses imports na implementação.
- A etapa 1 de Pagamento manda remover `Linking`, mas a etapa 11 o usa depois de registrar o pedido. Mantê-lo se o fluxo continuar abrindo WhatsApp.
- O telefone do exemplo de Pagamento difere do número atual do app, e o próprio texto orienta manter o número original. Preservar o configurado no app e centralizar a configuração da loja.
- A consulta de favoritos deve preservar uma mensagem de falha; o exemplo da Home limpa a mensagem ao final do carregamento e pode ocultá-la.
- O projeto já usa Expo 57. Não é necessária uma migração de SDK para executar os guias. Conferir APIs e configuração nativa na documentação versionada consultada: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [ImagePicker 57](https://docs.expo.dev/versions/v57.0.0/sdk/imagepicker/) e [Router 57](https://docs.expo.dev/versions/v57.0.0/sdk/router/). Para foto, revisar permissões/config plugin do build nativo; para atualização por foco, usar os exports do Expo Router.

**Contratos da API a validar**

As rotas abaixo vêm dos PDFs ou do código atual; sua disponibilidade e resposta no servidor não foram homologadas nesta auditoria.

| Fluxo | Contrato esperado | Confirmação necessária |
| --- | --- | --- |
| Cadastro | POST `/auth/cadastro` com nome, e-mail, telefone, senha, aceite e device_name | Token/cliente retornados, validações e erros |
| Recuperação | POST `/auth/esqueci-senha`, `/auth/validar-codigo`, `/auth/redefinir-senha` | Código de quatro dígitos, expiração, reset_token e política de reutilização |
| Cliente/foto | GET/PUT `/cliente`; POST `/cliente/foto` multipart `foto_cliente` | Formatos, limite de arquivo e campos retornados |
| Favoritos | GET/POST `/favoritos`; DELETE `/favoritos/{id_produto}` | Formato da lista, unicidade e ID usado na exclusão |
| Endereços | GET `/enderecos` | Lista, ID e principal; contratos de criação/edição não estão nos PDFs |
| Pedido | POST `/pedidos`; GET `/pedidos/{id}` | Campos, total, ID, datas/fuso, status e tratamento de duplicidade |
| Histórico | Contrato de listagem ainda a confirmar, candidato GET `/pedidos` | Rota efetiva, paginação e filtros; não presumir contrato só pelo nome |

**Plano de execução por dependência**

| Ordem | Entrega e arquivos principais | Critério de aceite |
| --- | --- | --- |
| 1 | Fundação: confirmar contratos; ampliar `src/services/api.ts` ou criar serviços por domínio para requisições autenticadas, tipos e erros; preparar atualização do cliente; corrigir erros de lint nos arquivos tocados | GETs existentes preservados; 401 encerra sessão de forma consistente; erro da API aparece na tela; estado do cliente pode ser atualizado sem sobrescrever formulário em edição |
| 2 | Cadastro e recuperação: `cad-cliente.tsx`, `esqueci-senha.tsx`, `redefinir-senha.tsx`, `linkSenhaModal.tsx` e estilos; reutilizar device_id do login | Conta válida inicia sessão; inválida não envia ou exibe erro; recuperação só retorna ao login após validar código e salvar senha; perfil de novo cliente abre com data nula |
| 3 | Foto e favoritos: `editar-perfil.tsx`, `use-cliente.ts`, `home.tsx`, `cardapio.tsx`, `detalhe-produto.tsx` e estilos; integração compartilhada de favoritos | Foto persiste e reaparece nas telas; favorito mantém estado ao navegar/reabrir; falhas não simulam sucesso; toques repetidos não disparam operações concorrentes do mesmo item |
| 4 | Sacola: criar `src/config/sacola.ts`; integrar `detalhe-produto.tsx` e `sacola.tsx` | Adicionar, somar, editar e remover persistem; limites 1–99; duas contas não compartilham itens; vazio bloqueia checkout; subtotal reflete itens |
| 5 | Preparar dependências do checkout: leitura/seleção de endereços reais e histórico em `meus-pedidos.tsx`; enviar ID ao detalhe | Endereço escolhido pertence ao cliente; histórico real fornece IDs e permite verificar um envio de resultado incerto; confirmar contrato de listagem antes de codificá-lo |
| 6 | Detalhes reais: `detalhe-pedido.tsx`, tipos/serviço de pedido e estilos | Pedido identificado por ID mostra itens, totais, pagamento, observação e status reais; estados nulos, inválidos, cancelados e retirada são tratados |
| 7 | Checkout: `pagamento.tsx` e estilos; conectar sacola, endereços, agendamento, POST e confirmação | Uma confirmação cria um pedido com payload correto; retirada omite endereço; total vem da API; após sucesso não há segundo POST por falha de WhatsApp ou limpeza; detalhe/histórico acessíveis |
| 8 | Homologação integrada e fechamento das pendências de qualidade | Fluxos abaixo aprovados em Android, iOS quando disponível e web; TypeScript e lint dos arquivos alterados aprovados; desvios globais remanescentes registrados |

As entregas 2 e 3 dependem da fundação, mas não da sacola. O caminho obrigatório para compra é 1 → 4 → 5 → 6 → 7 → 8. Cadastro e recuperação também devem estar concluídos antes do aceite final de todos os guias.

O cadastro/edição de endereços é outra dependência de produto: `enderecos.tsx` ainda mostra exemplos e `editar-endereco.tsx` não salva na API. O PDF de Pagamento pressupõe endereços já cadastrados. Para homologar esse guia pode-se usar conta de teste com endereço existente; para um cliente novo conseguir comprar com entrega, incluir a integração dessas telas após obter os contratos faltantes. Retirada deve funcionar sem endereço.

**Validação de cada entrega**

| Área | Cenários de aceite |
| --- | --- |
| Cadastro | Campos vazios, senha curta/divergente, termos recusados, e-mail duplicado, indisponibilidade da API, sucesso e perfil com nascimento nulo |
| Recuperação | E-mail ausente, solicitação com resposta genérica, quatro dígitos/foco/Backspace, código errado/expirado, e-mail de rota ausente, senhas divergentes, reset_token ausente e sucesso |
| Foto | Câmera negada, seleção cancelada, JPG/PNG/WEBP, arquivo acima de 2 MB, tipo inválido, falha de upload, sucesso e atualização em Home/Configuração |
| Favoritos | Consultar, adicionar, remover, retornar entre três telas, reiniciar app, toque rápido repetido, falha de rede e sessão expirada |
| Sacola | Mesmo produto somado, limites 1 e 99, remoção, reinício, troca entre contas A/B, dados locais inválidos, erro ao salvar e vazio |
| Endereço/checkout | Endereço principal e alternativo, nenhuma opção, retirada, data impossível/passada, horário inválido, observação até 500 caracteres e três formas de pagamento |
| Confirmação | Payload só com IDs/quantidades, total confirmado diferente da prévia, toque duplo, timeout após envio, WhatsApp indisponível e falha ao limpar sacola sem duplicar pedido |
| Detalhe/histórico | ID ausente/inválido, acesso negado, pedido não encontrado, lista vazia, nulos, produto indisponível, todos os status, retirada e cancelamento |

Priorizar testes automatizados nas regras de isolamento/alteração da sacola, validação de agendamento e confirmação sem duplicidade. Validar câmera, permissões, foco e abertura externa em dispositivo/navegador. Usar ambiente e contas de homologação para operações que criam registros ou enviam códigos.

**Verificações já executadas nesta auditoria**

- `node_modules/.bin/tsc.cmd --noEmit`: aprovado, sem erros.
- `node_modules/.bin/eslint.cmd src`: reprovado com 7 erros e 38 avisos preexistentes. Os erros estão em Cardápio (3), Detalhe do Produto (1), Editar Perfil (1), Home (1) e `use-color-scheme.web.ts` (1). Envolvem regras de estado em efeitos e referências a setters antes de sua declaração no Cardápio. Os avisos incluem código sem uso, tipo `Number`, comparação não estrita e imports duplicados.
- Nenhuma validação funcional no servidor ou em dispositivo foi realizada. Os resultados acima confirmam a situação do código, não a operação fim a fim da API.

**Limites do plano**

Cupom funcional, cobrança por gateway, recompra completa e tempo estimado de entrega calculado não têm contrato suficiente nos PDFs fornecidos. Os exemplos fictícios devem sair das telas, e essas extensões precisam de regras próprias antes de implementação. Os oito guias podem ser concluídos com os comportamentos documentados; a jornada de primeira compra com entrega também exige o fluxo real de cadastro de endereço descrito como dependência acima.
