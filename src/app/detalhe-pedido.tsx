import { Tela } from "@/components/tela";
import { useHidratado } from "@/hooks/use-hidratado";
import estilos from "@/styles/meusPedidosStyle";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text } from "react-native";

// A consulta e o acompanhamento completos são a entrega 6. A lista já envia o ID
// real; enquanto isso, esta rota não apresenta o antigo pedido de demonstração.
export default function DetalhePedidoScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const hidratado = useHidratado();
  const valido = hidratado && typeof id === "string" && /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;
  return <Tela titulo="Detalhes do pedido" subtitulo={valido ? `Pedido #${id}` : "Pedido não identificado"}>
    <Text accessibilityRole="alert" style={estilos.txtMensagem}>
      {valido ? "Os detalhes deste pedido estão indisponíveis no momento." : "Abra um pedido pelo seu histórico para consultar os detalhes."}
    </Text>
    <Pressable accessibilityRole="button" style={estilos.btnDetalhes} onPress={() => router.replace("/meus-pedidos")}>
      <Text style={estilos.txtDetalhes}>Voltar aos pedidos</Text>
    </Pressable>
  </Tela>;
}
