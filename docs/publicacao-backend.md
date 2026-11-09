# Estado e publicação do backend

Registro de **09/11/2026**, baseado no relato do usuário. O backend fica em outro repositório: os resultados abaixo não foram executados novamente por este agente. **Implementado e testado localmente, ainda sem commit e sem publicação no servidor**, conforme informado.

O pacote inclui endereços, pedidos, favoritos e foto do cliente. A recuperação de senha permanece dependente do pacote de e-mail/SMTP. Login, cadastro, cliente e catálogo mantêm os contratos anteriores.

**Alterações relatadas**

- Migration `2026_11_09_130426`: `tbl_vendas.id_usuario` aceita nulo, padrões `PENDENTE` na venda e `ATIVO` no item; `principal_endereco` é convertido de 0/1 para `NAO`/`SIM`.
- Models Venda, ItemVenda, EnderecoCliente, Cupom e Favorito; controllers e 17 rotas novas. Total, desconto e quantidade têm conversão numérica; subtotal e descrição de status são calculados.
- Pedidos com preço do catálogo, soma de produtos repetidos, produtos/categorias ativos, endereço do cliente, data futura, cupom percentual válido e gravação em transação. Limite de 20 pedidos/minuto.
- Fotos em `src/public/davilla/images/cliente/`, com `.gitignore` para uploads. Trocar/remover a foto apaga o arquivo anterior; limite da aplicação de 2 MB.
- Nginx local ajustado para 8 MB para permitir que Laravel valide os arquivos. O container foi recriado e o site respondeu 200. Esse ajuste não configura o servidor publicado.

**Validação local informada pelo usuário**

Endereços: primeiro principal automático, troca de principal, `NAO` ignorado na edição, UF maiúscula, CEP com hífen, promoção após exclusão e 404 entre contas/para removidos. Pedidos: exemplo subtotal 60,60, desconto 6,06 e total 54,54; união de quantidades; retirada sem endereço; validações de produto/endereço/cupom/data; paginação/filtros; isolamento por cliente; cancelamento da venda/itens e 422 ao repetir; 429 na 21ª tentativa do minuto.

Favoritos: adicionar, já existente, produto inexistente, remover, segunda remoção e reativar. Foto: arquivo ausente, formato, tamanho acima de 2 MB, aceitação de 1,9 MB, URL servida e remoção de arquivos antigos. Quatro rotas exercitadas sem token devolveram 401. As páginas `/`, `/cardapio`, `/pedidos`, `/admin/login` e `/api/documentacao` responderam 200. Não foram observados erros 500 nesses testes. Os registros/fotos de teste foram removidos ao final, segundo o usuário.

**Decisões e mensagens provisórias**

O CEP é gravado com hífen; o detalhe retorna o endereço completo e adicionar favorito retorna o produto completo. O app aceita esses campos adicionais e não compara respostas byte a byte. Descrições de status recebidas da API são exibidas diretamente; `ENTREGUE` pode ter a descrição “Concluído”, e `PRONTO`, “Pronto para retirada ou envio”. O acompanhamento usa o código do status e a modalidade para decidir as etapas.

Mensagens de validação não especificadas na referência continuam provisórias, incluindo produto indisponível, endereço não encontrado, data passada, limite de 50 itens, favorito já existente e erros de arquivo. O app propaga as mensagens de erro da API. A alteração administrativa dos status ainda é feita diretamente no banco; a tela de pedidos do admin não faz parte desse pacote.

**Sequência pendente no backend**

1. Conferir o diff, os testes e criar o commit no repositório do backend antes de publicar.
2. Fazer backup do servidor e conferir `SHOW COLUMNS` em `tbl_vendas`, `tbl_itens_venda` e `tbl_enderecos_cliente`. A migration pressupõe principal 0/1 e status da venda com 12 caracteres; comparar com o banco real antes de executá-la.
3. Atualizar o código e executar as migrations aprovadas e a limpeza de caches com `/opt/plesk/php/8.4/bin/php`, conforme o procedimento de implantação do projeto.
4. Garantir escrita pelo PHP em `src/public/davilla/images/cliente` e confirmar a URL pública usada pelo `IMAGEM` do app.
5. Conferir no Plesk `upload_max_filesize` de pelo menos 2M, `post_max_size` maior que esse limite e o limite do servidor HTTP/proxy, para a requisição chegar ao Laravel.
6. Homologar o app com uma conta de teste na API do projeto publicada: endereços, favoritos, foto, detalhe/status/cancelamento e, após a entrega 7, criação de pedido. Confirmar fuso e transições de status. Não usar a API do professor para gravar testes.

Este registro não confirma commit, migration ou publicação feitos no backend. A entrega 8 continua pendente até a homologação do conjunto app/servidor e dos dispositivos.
