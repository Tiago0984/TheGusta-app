import { Tela } from "@/components/tela";
import { consultarPedidos, formatarDataPedido, type PaginaPedidos, type PedidoHistorico, type StatusPedido } from "@/services/pedidos";
import { observarSessao } from "@/services/sessao";
import estilos from "@/styles/meusPedidosStyle";
import { cores } from "@/styles/variaveis";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const filtros: { status?: StatusPedido; label: string }[] = [
  { label: "Todos" }, { status: "PENDENTE", label: "Pendentes" }, { status: "CONFIRMADO", label: "Confirmados" },
  { status: "EM_PREPARO", label: "Em preparo" }, { status: "PRONTO", label: "Prontos" },
  { status: "EM_ENTREGA", label: "Em entrega" }, { status: "ENTREGUE", label: "Entregues" }, { status: "CANCELADO", label: "Cancelados" },
];

export default function MeusPedidosScreen() {
  const [filtro, setFiltro] = useState<StatusPedido>();
  const [pedidos, setPedidos] = useState<PedidoHistorico[]>([]);
  const [paginacao, setPaginacao] = useState<PaginaPedidos | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const revisao = useRef(0);
  const ocupado = useRef(false);

  const carregar = useCallback(async (pagina = 1) => {
    if (pagina > 1 && ocupado.current) return;
    const atual = ++revisao.current;
    ocupado.current = true;
    setCarregando(true);
    setErro("");
    if (pagina === 1) { setPedidos([]); setPaginacao(null); }
    try {
      const resposta = await consultarPedidos(pagina, filtro);
      if (atual !== revisao.current) return;
      setPedidos((anteriores) => pagina === 1 ? resposta.pedidos : [...new Map([...anteriores, ...resposta.pedidos].map((pedido) => [pedido.id_venda, pedido])).values()]);
      setPaginacao(resposta);
    } catch (error) {
      if (atual === revisao.current) setErro(error instanceof Error ? error.message : "Não foi possível carregar os pedidos.");
    } finally {
      if (atual === revisao.current) { ocupado.current = false; setCarregando(false); }
    }
  }, [filtro]);

  useEffect(() => observarSessao(() => {
    revisao.current += 1;
    ocupado.current = false;
    setPedidos([]);
    setPaginacao(null);
    setCarregando(false);
    setErro("A sessão foi alterada. Atualize os pedidos para continuar.");
  }), []);
  useFocusEffect(useCallback(() => {
    void carregar();
    return () => { revisao.current += 1; ocupado.current = false; };
  }, [carregar]));

  return <Tela titulo="Meus pedidos" subtitulo="Acompanhe seus pedidos e seu histórico">
    <View style={estilos.filtros}>
      {filtros.map((item) => <Pressable key={item.label} accessibilityRole="button" accessibilityLabel={`Filtrar pedidos: ${item.label}`}
        aria-selected={filtro === item.status} style={[estilos.filtro, filtro === item.status && estilos.filtroAtivo]}
        onPress={() => setFiltro(item.status)}><Text style={estilos.txtFiltro}>{item.label}</Text></Pressable>)}
    </View>
    <Pressable accessibilityRole="button" disabled={carregando} style={estilos.btnAtualizar} onPress={() => void carregar()}>
      <Text style={estilos.txtDetalhes}>Atualizar pedidos</Text>
    </Pressable>
    {erro ? <View style={estilos.mensagem}>
      <Text style={estilos.txtMensagem} accessibilityRole="alert">{erro}</Text>
      <Pressable accessibilityRole="button" disabled={carregando} style={estilos.btnDetalhes}
        onPress={() => void carregar(paginacao ? paginacao.pagina + 1 : 1)}><Text style={estilos.txtDetalhes}>Tentar novamente</Text></Pressable>
    </View> : null}
    {carregando ? <ActivityIndicator color={cores.laranja} accessibilityLabel="Carregando pedidos" /> : null}
    {!carregando && !erro && pedidos.length === 0 ? <Text style={estilos.txtMensagem}>Nenhum pedido encontrado{filtro ? " neste filtro" : ""}.</Text> : null}
    {pedidos.map((pedido) => <View key={pedido.id_venda} style={estilos.card}>
      <View style={estilos.headerPedido}>
        <Text style={estilos.txtCardTitulo}>Pedido #{pedido.id_venda}</Text>
        <Text style={estilos.txtMensagem}>{pedido.status_descricao_venda}</Text>
      </View>
      {pedido.data_venda ? <Text style={estilos.txtMensagem}>Realizado em: {formatarDataPedido(pedido.data_venda)}</Text> : null}
      <Text style={estilos.txtMensagem}>{pedido.entrega_venda === "SIM" ? "Entrega" : "Retirada"}: {formatarDataPedido(pedido.data_entrega_venda)}</Text>
      {pedido.itens.map((item) => <Text key={item.id_item} style={estilos.txtMensagem}>{item.qtde_item} × {item.produto?.nome_produto ?? "Produto indisponível"}</Text>)}
      <Text style={estilos.txtTotal}>Total: {pedido.valor_venda.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Ver detalhes do pedido ${pedido.id_venda}`} style={estilos.btnDetalhes}
        onPress={() => router.push({ pathname: "/detalhe-pedido", params: { id: pedido.id_venda } })}>
        <Text style={estilos.txtDetalhes}>Ver detalhes</Text>
      </Pressable>
    </View>)}
    {paginacao ? <Text style={estilos.txtMensagem}>Página {paginacao.pagina} de {paginacao.ultimaPagina} · {paginacao.total} pedido(s)</Text> : null}
    {paginacao && paginacao.pagina < paginacao.ultimaPagina ? <Pressable accessibilityRole="button" disabled={carregando} style={estilos.btnDetalhes}
      onPress={() => void carregar(paginacao.pagina + 1)}><Text style={estilos.txtDetalhes}>{carregando ? "Carregando..." : "Carregar mais pedidos"}</Text></Pressable> : null}
  </Tela>;
}
