import { Tela } from "@/components/tela";
import { useHidratado } from "@/hooks/use-hidratado";
import { usePedido } from "@/hooks/use-pedido";
import { IMAGEM } from "@/config/api";
import { acompanhamentoPedido, formatarDataPedido, type ItemPedido } from "@/services/pedidos";
import { observarSessao } from "@/services/sessao";
import estilos from "@/styles/detalhePedidoStyle";
import { cores } from "@/styles/variaveis";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Linking, Modal, Pressable, Text, View } from "react-native";

const moeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const voltar = () => router.canGoBack() ? router.back() : router.replace("/meus-pedidos");

function LinhaItem({ item }: { item: ItemPedido }) {
  const [semImagem, setSemImagem] = useState(false);
  return <View style={estilos.itemResumo}>
    <View style={estilos.itemResumoEsquerdo}>
      <Image style={estilos.imgItemResumo} onError={() => setSemImagem(true)}
        source={semImagem || !item.produto?.foto_produto ? require("@/assets/images/img/sem-imagem.png") : { uri: `${IMAGEM}/${item.produto.foto_produto}` }} />
      <View style={estilos.nomeItem}>
        <Text style={estilos.txtItemResumo}>{item.qtde_item} × {item.produto?.nome_produto ?? "Produto indisponível"}</Text>
        <Text style={estilos.txtObservacaoPedido}>{moeda(item.valor_unit_item)} un.{item.status_item === "CANCELADO" ? " · Cancelado" : ""}</Text>
      </View>
    </View>
    <Text style={estilos.valorItemResumo}>{moeda(Math.round(item.valor_unit_item * 100) * item.qtde_item / 100)}</Text>
  </View>;
}

export default function DetalhePedidoScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const hidratado = useHidratado();
  const valido = hidratado && typeof id === "string" && /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;
  if (!hidratado) return <Tela titulo="Detalhes do pedido" subtitulo="Carregando pedido..."><ActivityIndicator color={cores.laranja} /></Tela>;
  if (valido) return <ConteudoPedido key={Number(id)} id={Number(id)} />;
  return <Tela titulo="Detalhes do pedido" subtitulo="Pedido não identificado" voltar={voltar}>
    <Text accessibilityRole="alert" style={estilos.mensagem}>Abra um pedido pelo seu histórico para consultar os detalhes.</Text>
    <Pressable accessibilityRole="button" style={estilos.botao} onPress={() => router.replace("/meus-pedidos")}><Text style={estilos.txtBotao}>Voltar aos pedidos</Text></Pressable>
  </Tela>;
}

function ConteudoPedido({ id }: { id: number }) {
  const { pedido, carregando, processando, erro, erroAcao, carregar, atualizarStatus, cancelar } = usePedido(id);
  const [confirmar, setConfirmar] = useState(false);
  const [erroContato, setErroContato] = useState("");
  const abrindoContato = useRef(false);
  useEffect(() => observarSessao(() => setConfirmar(false)), []);
  useFocusEffect(useCallback(() => () => setConfirmar(false), []));
  const etapas = pedido ? acompanhamentoPedido(pedido.status_venda, pedido.entrega_venda) : [];
  const bloqueado = carregando || processando || !!erroAcao;

  async function contato() {
    if (abrindoContato.current) return;
    abrindoContato.current = true; setErroContato("");
    try { await Linking.openURL(`https://wa.me/5511958435174?text=${encodeURIComponent(`Olá! Gostaria de falar sobre o pedido #${id}.`)}`); }
    catch { setErroContato("Não foi possível abrir o WhatsApp. Tente novamente."); }
    finally { abrindoContato.current = false; }
  }

  return <Tela titulo="Detalhes do pedido" subtitulo="Acompanhe sua compra" voltar={voltar}>
    {carregando ? <ActivityIndicator color={cores.laranja} accessibilityLabel="Carregando pedido" /> : null}
    {erro ? <Text accessibilityRole="alert" style={estilos.mensagem}>{erro}</Text> : null}
    <Pressable accessibilityRole="button" disabled={carregando || processando} style={estilos.botao} onPress={() => void carregar()}>
      <Text style={estilos.txtBotao}>{erro ? "Tentar novamente" : "Atualizar pedido"}</Text>
    </Pressable>
    {!carregando && pedido ? <>
      <View style={estilos.areaPedido}>
        <View style={estilos.resumoPedido}>
          <Text style={estilos.numeroPedido}>Pedido #{pedido.id_venda}</Text>
          <Text style={estilos.horarioPedido}>Realizado em: {formatarDataPedido(pedido.data_venda)}</Text>
        </View>
        <View style={estilos.statusPedido}><Text style={estilos.txtStatus} accessibilityLabel={`Status do pedido: ${pedido.status_descricao_venda}`}>{pedido.status_descricao_venda}</Text></View>
      </View>
      <View style={estilos.cardAcompanhar}>
        <Text style={estilos.txtCardTitulo}>Acompanhamento · {pedido.entrega_venda === "SIM" ? "Entrega" : "Retirada"}</Text>
        {etapas.map((etapa) => <View key={etapa.codigo} style={estilos.linhaAcompanhamento}
          accessibilityLabel={`${etapa.texto}: ${etapa.estado === "concluida" ? "concluída" : etapa.estado === "atual" ? "etapa atual" : "aguardando"}`}>
          <View style={[estilos.marcadorEtapa, etapa.estado === "concluida" && estilos.etapaFinalizada, etapa.estado === "atual" && estilos.etapaEmAndamento]}>
            <Text>{etapa.estado === "concluida" ? "✓" : etapa.estado === "atual" ? "●" : "○"}</Text>
          </View>
          <Text style={estilos.txtObservacaoPedido}>{etapa.texto}</Text>
        </View>)}
        {pedido.status_venda === "CANCELADO" ? <Text style={estilos.mensagem}>Pedido cancelado.</Text> : null}
        <Text style={estilos.mensagem}>Data desejada para {pedido.entrega_venda === "SIM" ? "entrega" : "retirada"}: {formatarDataPedido(pedido.data_entrega_venda)}</Text>
        <Pressable accessibilityRole="button" disabled={bloqueado} style={[estilos.botao, bloqueado && estilos.desabilitado]} onPress={() => void atualizarStatus()}>
          <Text style={estilos.txtBotao}>Atualizar status</Text>
        </Pressable>
      </View>
      {processando ? <ActivityIndicator color={cores.laranja} accessibilityLabel="Atualizando pedido" /> : null}
      {erroAcao ? <Text accessibilityRole="alert" style={estilos.mensagem}>{erroAcao} Atualize o pedido para continuar.</Text> : null}
      <View style={estilos.card}>
        <Text style={estilos.txtCardTitulo}>Resumo do pedido</Text>
        {pedido.itens.length === 0 ? <Text style={estilos.mensagem}>Nenhum item informado.</Text> : null}
        {pedido.itens.map((item) => <LinhaItem key={`${item.id_item}-${item.produto?.foto_produto}`} item={item} />)}
        <View style={estilos.areaSubtotal}><Text style={estilos.txtSubtotal}>Subtotal</Text><Text style={estilos.valorSubtotal} accessibilityLabel={`Subtotal do pedido: ${moeda(pedido.subtotal_venda)}`}>{moeda(pedido.subtotal_venda)}</Text></View>
        <View style={estilos.areaDesconto}><Text style={estilos.txtDesconto}>Desconto</Text><Text style={estilos.valorDesconto}>{moeda(pedido.valor_desconto_venda)}</Text></View>
        <Text style={estilos.cupmDesconto}>{pedido.cupom?.codigo_cupom ?? "Sem cupom"}</Text>
        <View style={estilos.total}><Text style={estilos.txtTotal}>Total</Text><Text style={estilos.valorTotal} accessibilityLabel={`Total do pedido: ${moeda(pedido.valor_venda)}`}>{moeda(pedido.valor_venda)}</Text></View>
      </View>
      {pedido.entrega_venda === "SIM" ? <View style={estilos.card}>
        <Text style={estilos.txtCardTitulo}>Endereço de entrega</Text>
        {pedido.endereco ? <>
          <Text style={estilos.txtMetodoPagamento}>{pedido.endereco.nome_endereco}</Text>
          <Text style={estilos.txtObservacaoPedido}>{pedido.endereco.endereco}, {pedido.endereco.numero}{pedido.endereco.complemento ? ` - ${pedido.endereco.complemento}` : ""}</Text>
          <Text style={estilos.txtObservacaoPedido}>{[pedido.endereco.bairro, pedido.endereco.cidade, pedido.endereco.uf].filter(Boolean).join(" - ")}</Text>
          {pedido.endereco.cep ? <Text style={estilos.txtObservacaoPedido}>CEP {pedido.endereco.cep}</Text> : null}
        </> : <Text style={estilos.mensagem}>Endereço indisponível.</Text>}
      </View> : null}
      <View style={estilos.card}>
        <Text style={estilos.txtCardTitulo}>Forma de pagamento</Text>
        <Text style={estilos.txtMetodoPagamento}>{({ PIX: "Pix", CARTAO: "Cartão", DINHEIRO: "Dinheiro" } as Record<string, string>)[pedido.forma_pagamento_venda] ?? pedido.forma_pagamento_venda}</Text>
      </View>
      <View style={estilos.card}><Text style={estilos.txtCardTitulo}>Observação</Text><Text style={estilos.txtObservacaoPedido}>{pedido.observacao_venda?.trim() || "Nenhuma observação para seu pedido."}</Text></View>
      {pedido.status_venda === "PENDENTE" ? <Pressable accessibilityRole="button" disabled={bloqueado} style={[estilos.botao, bloqueado && estilos.desabilitado]} onPress={() => setConfirmar(true)}>
        <Text style={estilos.txtBotao}>Cancelar pedido</Text>
      </Pressable> : null}
      <Pressable accessibilityRole="button" style={estilos.botao} onPress={() => void contato()}><Text style={estilos.txtBotao}>Falar com a confeitaria</Text></Pressable>
      {erroContato ? <Text accessibilityRole="alert" style={estilos.mensagem}>{erroContato}</Text> : null}
    </> : null}
    <Pressable accessibilityRole="button" style={estilos.botao} onPress={() => router.replace("/meus-pedidos")}><Text style={estilos.txtBotao}>Voltar aos pedidos</Text></Pressable>
    <Modal visible={confirmar} transparent animationType="fade" onRequestClose={() => setConfirmar(false)}>
      <View style={estilos.fundoModal}><View style={estilos.cardModal}>
        <Text style={estilos.txtCardTitulo}>Cancelar pedido #{id}?</Text>
        <Text style={estilos.mensagem}>Essa ação cancela todos os itens deste pedido.</Text>
        <Pressable accessibilityRole="button" disabled={bloqueado} style={estilos.botao} onPress={() => { setConfirmar(false); void cancelar(); }}><Text style={estilos.txtBotao}>Confirmar cancelamento</Text></Pressable>
        <Pressable accessibilityRole="button" style={estilos.botao} onPress={() => setConfirmar(false)}><Text style={estilos.txtBotao}>Manter pedido</Text></Pressable>
      </View></View>
    </Modal>
  </Tela>;
}
