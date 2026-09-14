import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import detalhePedidoStyle from "@/styles/detalhePedidoStyle";
import { router } from "expo-router";
import { Image, ImageBackground, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TELEFONE_LOJA = "5511958435174";

const RESUMO_TOTAIS = {
  subtotal: "R$ 531,30",
  entrega: "R$ 10,00",
  cupom: "THEGUSTA10",
  desconto: "- R$ 54,13",
  total: "R$ 487,17",
};

export default function DetalhePedidoScreen() {
  const itensResumo = [
    {
      id: 1,
      quantidade: 2,
      nome: "Bolo de Banana Fit",
      valor: "R$ 151,80",
      imagem: require("@/assets/images/img/bolo01.png"),
    },
    {
      id: 2,
      quantidade: 3,
      nome: "Bolo de Banana Fit",
      valor: "R$ 227,70",
      imagem: require("@/assets/images/img/bolo01.png"),
    },
    {
      id: 3,
      quantidade: 2,
      nome: "Bolo de Banana Fit",
      valor: "R$ 151,80",
      imagem: require("@/assets/images/img/bolo01.png"),
    },
  ];

  return (
    <View style={globalStyle.container}>
      <ImageBackground
        source={require("@/assets/images/img/00_fundo.png")}
        style={globalStyle.background}
        resizeMode="cover"
      >
        <SafeAreaView style={globalStyle.areaConteudo}>
          <Pressable
            style={globalStyle.btnVoltar}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/meus-pedidos");
              }
            }}
          >
            <Image
              style={globalStyle.imgVoltar}
              source={require("@/assets/images/img/voltar.png")}
            />
          </Pressable>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={detalhePedidoStyle.conteudo}>
              <View style={detalhePedidoStyle.header}>
                <View style={detalhePedidoStyle.ladoEsquerdo}>
                  <Text style={detalhePedidoStyle.titulo}>Detalhes do pedido</Text>
                  <Text style={detalhePedidoStyle.subtitulo}>
                    Acompanhe as informações do seu pedido
                  </Text>
                </View>
                <Image
                  style={detalhePedidoStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={detalhePedidoStyle.main}>
                <View style={detalhePedidoStyle.areaPedido}>
                  <View style={detalhePedidoStyle.infoPedido}>
                    <Image
                      style={detalhePedidoStyle.imgPedido}
                      source={require("@/assets/images/img/pedido.png")}
                    />
                    <View style={detalhePedidoStyle.resumoPedido}>
                      <Text style={detalhePedidoStyle.numeroPedido}>
                        Pedido {"#"}1035
                      </Text>
                      <Text style={detalhePedidoStyle.horarioPedido}>
                        Hoje, 08:00
                      </Text>
                    </View>
                  </View>
                  <View style={detalhePedidoStyle.statusPedido}>
                    <Image
                      style={detalhePedidoStyle.imgStatus}
                      source={require("@/assets/images/img/delivery.png")}
                      resizeMode="stretch"
                    />
                    <Text style={detalhePedidoStyle.txtStatus}>Saiu para entrega</Text>
                  </View>
                </View>
                <View style={detalhePedidoStyle.cardAcompanhar}>
                  <View style={detalhePedidoStyle.acompanharPedido}>
                    <View style={detalhePedidoStyle.colunaEtapa}>
                      <View
                        style={[
                          detalhePedidoStyle.areaIconeEtapa,
                          detalhePedidoStyle.etapaFinalizada,
                        ]}
                      >
                        <Image
                          style={detalhePedidoStyle.iconeEtapa}
                          source={require("@/assets/images/img/preparando-verde.png")}
                        />
                      </View>
                      <Text style={detalhePedidoStyle.txtEtapa}>
                        Em{"\n"}Preparo
                      </Text>
                    </View>

                    <View
                      style={[
                        detalhePedidoStyle.linhaEtapa,
                        detalhePedidoStyle.linhaEtapaVerde,
                      ]}
                    />

                    <View style={detalhePedidoStyle.colunaEtapa}>
                      <View
                        style={[
                          detalhePedidoStyle.areaIconeEtapa,
                          detalhePedidoStyle.etapaEmAndamento,
                        ]}
                      >
                        <Image
                          style={detalhePedidoStyle.iconeEtapa}
                          source={require("@/assets/images/img/delivery-laranja.png")}
                        />
                      </View>
                      <Text style={detalhePedidoStyle.txtEtapa}>
                        Saiu para{"\n"}entrega
                      </Text>
                    </View>

                    <View
                      style={[
                        detalhePedidoStyle.linhaEtapa,
                        detalhePedidoStyle.linhaEtapaLaranja,
                      ]}
                    />

                    <View style={detalhePedidoStyle.colunaEtapa}>
                      <View style={detalhePedidoStyle.areaIconeEtapa}>
                        <Image
                          style={detalhePedidoStyle.iconeEtapa}
                          source={require("@/assets/images/img/entregue-cinza.png")}
                        />
                      </View>
                      <Text style={detalhePedidoStyle.txtEtapa}>
                        Entrega{"\n"}realizada
                      </Text>
                    </View>
                  </View>

                  <View style={detalhePedidoStyle.areaPrevisaoEstimada}>
                    <Image
                      style={detalhePedidoStyle.imgPrevisaoEstimada}
                      source={require("@/assets/images/img/previsao.png")}
                    />
                    <Text style={detalhePedidoStyle.txtPrevisaoEstimada}>
                      Previsão estimada{" "}
                      <Text style={detalhePedidoStyle.txtPrevisaoEstimadaTempo}>
                        45 - 60 min
                      </Text>
                    </Text>
                  </View>
                </View>

                <View style={detalhePedidoStyle.card}>
                  <View style={detalhePedidoStyle.cardTitulo}>
                    <Image
                      style={detalhePedidoStyle.iconTitulo}
                      source={require("@/assets/images/img/pedido.png")}
                    />
                    <Text style={detalhePedidoStyle.txtCardTitulo}>Resumo do pedido</Text>
                  </View>

                  {itensResumo.map((item) => (
                    <View style={detalhePedidoStyle.itemResumo} key={item.id}>
                      <View style={detalhePedidoStyle.itemResumoEsquerdo}>
                        <Image
                          style={detalhePedidoStyle.imgItemResumo}
                          source={item.imagem}
                          resizeMode="cover"
                        />
                        <Text style={detalhePedidoStyle.txtItemResumo}>
                          {item.quantidade}x {item.nome}
                        </Text>
                      </View>
                      <Text style={detalhePedidoStyle.valorItemResumo}>{item.valor}</Text>
                    </View>
                  ))}

                  <View style={globalStyle.separador}></View>

                  <View style={detalhePedidoStyle.areaSubtotal}>
                    <Text style={detalhePedidoStyle.txtSubtotal}>Subtotal</Text>
                    <Text style={detalhePedidoStyle.valorSubtotal}>{RESUMO_TOTAIS.subtotal}</Text>
                  </View>
                  <View style={detalhePedidoStyle.areaEntrega}>
                    <Text style={detalhePedidoStyle.txtEntrega}>Entrega</Text>
                    <Text style={detalhePedidoStyle.valorEntrega}>{RESUMO_TOTAIS.entrega}</Text>
                  </View>
                  <View style={detalhePedidoStyle.areaDesconto}>
                    <Text style={detalhePedidoStyle.txtDesconto}>Desconto</Text>
                    <Text style={detalhePedidoStyle.cupmDesconto}>{RESUMO_TOTAIS.cupom}</Text>
                    <Text style={detalhePedidoStyle.valorDesconto}>{RESUMO_TOTAIS.desconto}</Text>
                  </View>

                  <View style={globalStyle.separador}></View>

                  <View style={detalhePedidoStyle.total}>
                    <Text style={detalhePedidoStyle.txtTotal}>Total</Text>
                    <Text style={detalhePedidoStyle.valorTotal}>{RESUMO_TOTAIS.total}</Text>
                  </View>
                </View>

                <View style={detalhePedidoStyle.card}>
                  <View style={detalhePedidoStyle.formaPagamentoPedido}>
                    <View
                      style={[
                        detalhePedidoStyle.cardTitulo,
                        detalhePedidoStyle.cardTituloSemMargem,
                      ]}
                    >
                      <Image
                        style={detalhePedidoStyle.iconTitulo}
                        source={require("@/assets/images/img/carteira.png")}
                        resizeMode="contain"
                      />
                      <Text style={detalhePedidoStyle.txtCardTitulo}>
                        Forma de pagamento
                      </Text>
                    </View>
                    <View style={detalhePedidoStyle.metodoPagamento}>
                      <Image
                        style={detalhePedidoStyle.imgMetodoPagamento}
                        source={require("@/assets/images/img/pix.png")}
                        resizeMode="contain"
                      />
                      <Text style={detalhePedidoStyle.txtMetodoPagamento}>Pix</Text>
                    </View>
                  </View>
                </View>

                <View style={detalhePedidoStyle.card}>
                  <View
                    style={[
                      detalhePedidoStyle.cardTitulo,
                      detalhePedidoStyle.cardTituloSemMargem,
                    ]}
                  >
                    <Image
                      style={detalhePedidoStyle.iconTitulo}
                      source={require("@/assets/images/img/mensagem.png")}
                      resizeMode="contain"
                    />
                    <View style={detalhePedidoStyle.colunaObservacao}>
                      <Text style={detalhePedidoStyle.txtCardTitulo}>Observação</Text>
                      <Text style={detalhePedidoStyle.txtObservacaoPedido}>
                        Nenhuma observação para seu pedido
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={detalhePedidoStyle.botoesPedido}>
                  <Pressable
                    style={detalhePedidoStyle.btnAcaoPedido}
                    onPress={() =>
                      Linking.openURL(
                        `https://wa.me/${TELEFONE_LOJA}?text=${encodeURIComponent(
                          "Gostaria de tirar uma dúvida"
                        )}`
                      )
                    }
                  >
                    <Image
                      style={detalhePedidoStyle.imgBtnAcaoPedido}
                      source={require("@/assets/images/img/mensagem.png")}
                      resizeMode="contain"
                    />
                    <Text style={detalhePedidoStyle.txtBtnAcaoPedido}>
                      Falar com a loja
                    </Text>
                  </Pressable>
                  <Pressable
                    style={detalhePedidoStyle.btnAcaoPedido}
                    onPress={() => router.push("/pagamento")}
                  >
                    <Image
                      style={detalhePedidoStyle.imgBtnAcaoPedido}
                      source={require("@/assets/images/img/repetir.png")}
                      resizeMode="contain"
                    />
                    <Text style={detalhePedidoStyle.txtBtnAcaoPedido}>
                      Pedir novamente
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>

          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
