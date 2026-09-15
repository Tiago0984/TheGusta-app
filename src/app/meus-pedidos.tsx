import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import meusPedidosStyle from "@/styles/meusPedidosStyle";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MeusPedidosScreen() {
  const [filtro, setFiltro] = useState<"andamento" | "entregue">("andamento");

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

  const valorTotal = "R$ 487,17";

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
                router.replace("/home");
              }
            }}
          >
            <Image
              style={globalStyle.imgVoltar}
              source={require("@/assets/images/img/voltar.png")}
            />
          </Pressable>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={meusPedidosStyle.conteudo}>
              <View style={meusPedidosStyle.header}>
                <View style={meusPedidosStyle.ladoEsquerdo}>
                  <Text style={meusPedidosStyle.titulo}>Meus pedidos</Text>
                  <Text style={meusPedidosStyle.subtitulo}>
                    Acompanhe seus pedidos e seu histórico
                  </Text>
                </View>
                <Image
                  style={meusPedidosStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={meusPedidosStyle.main}>
                <View style={meusPedidosStyle.segmentadoTriplo}>
                  <Pressable
                    style={[
                      meusPedidosStyle.segmentoBtnTriplo,
                      filtro === "andamento" && meusPedidosStyle.segmentoBtnAtivo,
                    ]}
                    onPress={() => setFiltro("andamento")}
                  >
                    <Text
                      style={[
                        meusPedidosStyle.segmentoTxt,
                        filtro === "andamento" && meusPedidosStyle.segmentoTxtAtivo,
                      ]}
                    >
                      Em andamento
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      meusPedidosStyle.segmentoBtnTriplo,
                      meusPedidosStyle.segmentoDivisor,
                      filtro === "entregue" && meusPedidosStyle.segmentoBtnAtivo,
                    ]}
                    onPress={() => setFiltro("entregue")}
                  >
                    <Text
                      style={[
                        meusPedidosStyle.segmentoTxt,
                        filtro === "entregue" && meusPedidosStyle.segmentoTxtAtivo,
                      ]}
                    >
                      Entregue
                    </Text>
                  </Pressable>
                </View>

                {filtro === "andamento" && (
                <>
                <View style={meusPedidosStyle.card}>
                  <View style={meusPedidosStyle.headerPedido}>
                    <View style={meusPedidosStyle.cardTitulo}>
                      <Image
                        style={meusPedidosStyle.iconTitulo}
                        source={require("@/assets/images/img/preparando-laranja.png")}
                      />
                      <Text style={meusPedidosStyle.txtCardTitulo}>
                        Pedido {"#"}1035
                      </Text>
                    </View>
                    <View style={meusPedidosStyle.topoPedido}>
                      <Image
                        style={meusPedidosStyle.imgStatus}
                        source={require("@/assets/images/img/preparando-laranja.png")}
                        resizeMode="stretch"
                      />
                      <Text style={meusPedidosStyle.txtStatus}>Em preparo</Text>
                    </View>
                  </View>
                  <View style={meusPedidosStyle.areaResumo}>
                    <View style={meusPedidosStyle.listaItensResumo}>
                      {itensResumo.map((item) => (
                        <View style={meusPedidosStyle.itemResumo} key={item.id}>
                          <View style={meusPedidosStyle.itemResumoEsquerdo}>
                            <Image
                              style={meusPedidosStyle.imgItemResumo}
                              source={item.imagem}
                              resizeMode="cover"
                            />
                            <Text style={meusPedidosStyle.txtItemResumo}>
                              {item.quantidade}x {item.nome}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View style={meusPedidosStyle.colunaImgAguardando}>
                      <Image
                        style={meusPedidosStyle.imgAguardando}
                        source={require("@/assets/images/img/preparando-laranja.png")}
                        resizeMode="stretch"
                      />
                    </View>
                  </View>

                  <View style={globalStyle.separador}></View>
                  <View style={meusPedidosStyle.rodapeResumo}>
                    <View style={meusPedidosStyle.total}>
                      <Text style={meusPedidosStyle.txtTotal}>Total</Text>
                      <Text style={meusPedidosStyle.valorTotal}>
                        {valorTotal}
                      </Text>
                    </View>
                    <View style={meusPedidosStyle.areaPrevisão}>
                      <Image
                        style={meusPedidosStyle.imgPrevisao}
                        source={require("@/assets/images/img/previsao.png")}
                        resizeMode="stretch"
                      />
                      <View style={meusPedidosStyle.tempoPrevisão}>
                        <Text style={meusPedidosStyle.previsaoTxt}>
                          Previsão
                        </Text>
                        <Text style={meusPedidosStyle.previsaoTempo}>
                          45 - 60 min
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    style={meusPedidosStyle.btnDetalhes}
                    onPress={() => router.push("/detalhe-pedido")}
                  >
                    <Text style={meusPedidosStyle.txtDetalhes}>
                      Ver detalhes
                    </Text>
                  </Pressable>
                </View>
                <View style={meusPedidosStyle.card}>
                  <View style={meusPedidosStyle.headerPedido}>
                    <View style={meusPedidosStyle.cardTitulo}>
                      <Image
                        style={meusPedidosStyle.iconTitulo}
                        source={require("@/assets/images/img/aguardando-laranja.png")}
                      />
                      <Text style={meusPedidosStyle.txtCardTitulo}>
                        Pedido {"#"}1032
                      </Text>
                    </View>
                    <View style={meusPedidosStyle.topoPedido}>
                      <Image
                        style={meusPedidosStyle.imgStatus}
                        source={require("@/assets/images/img/aguardando-laranja.png")}
                        resizeMode="stretch"
                      />
                      <Text style={meusPedidosStyle.txtStatus}>
                        Aguardando retira
                      </Text>
                    </View>
                  </View>
                  <View style={meusPedidosStyle.areaResumo}>
                    <View style={meusPedidosStyle.listaItensResumo}>
                      {itensResumo.map((item) => (
                        <View style={meusPedidosStyle.itemResumo} key={item.id}>
                          <View style={meusPedidosStyle.itemResumoEsquerdo}>
                            <Image
                              style={meusPedidosStyle.imgItemResumo}
                              source={item.imagem}
                              resizeMode="cover"
                            />
                            <Text style={meusPedidosStyle.txtItemResumo}>
                              {item.quantidade}x {item.nome}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View style={meusPedidosStyle.colunaImgAguardando}>
                      <Image
                        style={meusPedidosStyle.imgAguardando}
                        source={require("@/assets/images/img/aguardando-laranja.png")}
                        resizeMode="stretch"
                      />
                    </View>
                  </View>

                  <View style={globalStyle.separador}></View>
                  <View style={meusPedidosStyle.rodapeResumo}>
                    <View style={meusPedidosStyle.total}>
                      <Text style={meusPedidosStyle.txtTotal}>Total</Text>
                      <Text style={meusPedidosStyle.valorTotal}>
                        {valorTotal}
                      </Text>
                    </View>
                    <View style={meusPedidosStyle.areaPrevisão}>
                      <Image
                        style={meusPedidosStyle.imgPrevisao}
                        source={require("@/assets/images/img/previsao.png")}
                        resizeMode="stretch"
                      />
                      <View style={meusPedidosStyle.tempoPrevisão}>
                        <Text style={meusPedidosStyle.previsaoTxt}>
                          Previsão
                        </Text>
                        <Text style={meusPedidosStyle.previsaoTempo}>
                          40 - 55 min
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    style={meusPedidosStyle.btnDetalhes}
                    onPress={() => router.push("/detalhe-pedido")}
                  >
                    <Text style={meusPedidosStyle.txtDetalhes}>
                      Ver detalhes
                    </Text>
                  </Pressable>
                </View>
                <View style={meusPedidosStyle.card}>
                  <View style={meusPedidosStyle.headerPedido}>
                    <View style={meusPedidosStyle.cardTitulo}>
                      <Image
                        style={meusPedidosStyle.iconTitulo}
                        source={require("@/assets/images/img/delivery-laranja.png")}
                      />
                      <Text style={meusPedidosStyle.txtCardTitulo}>
                        Pedido {"#"}1027
                      </Text>
                    </View>
                    <View style={meusPedidosStyle.topoPedido}>
                      <Image
                        style={meusPedidosStyle.imgStatus}
                        source={require("@/assets/images/img/delivery-laranja.png")}
                        resizeMode="stretch"
                      />
                      <Text style={meusPedidosStyle.txtStatus}>A caminho</Text>
                    </View>
                  </View>
                  <View style={meusPedidosStyle.areaResumo}>
                    <View style={meusPedidosStyle.listaItensResumo}>
                      {itensResumo.map((item) => (
                        <View style={meusPedidosStyle.itemResumo} key={item.id}>
                          <View style={meusPedidosStyle.itemResumoEsquerdo}>
                            <Image
                              style={meusPedidosStyle.imgItemResumo}
                              source={item.imagem}
                              resizeMode="cover"
                            />
                            <Text style={meusPedidosStyle.txtItemResumo}>
                              {item.quantidade}x {item.nome}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View style={meusPedidosStyle.colunaImgAguardando}>
                      <Image
                        style={meusPedidosStyle.imgAguardando}
                        source={require("@/assets/images/img/delivery-laranja.png")}
                        resizeMode="stretch"
                      />
                    </View>
                  </View>

                  <View style={globalStyle.separador}></View>
                  <View style={meusPedidosStyle.rodapeResumo}>
                    <View style={meusPedidosStyle.total}>
                      <Text style={meusPedidosStyle.txtTotal}>Total</Text>
                      <Text style={meusPedidosStyle.valorTotal}>
                        {valorTotal}
                      </Text>
                    </View>
                    <View style={meusPedidosStyle.areaPrevisão}>
                      <Image
                        style={meusPedidosStyle.imgPrevisao}
                        source={require("@/assets/images/img/previsao.png")}
                        resizeMode="stretch"
                      />
                      <View style={meusPedidosStyle.tempoPrevisão}>
                        <Text style={meusPedidosStyle.previsaoTxt}>
                          Previsão
                        </Text>
                        <Text style={meusPedidosStyle.previsaoTempo}>
                          15 - 30 min
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={meusPedidosStyle.btnPedido}>
                    <Pressable
                      style={[meusPedidosStyle.btnDetalhes, { marginTop: 0 }]}
                      onPress={() => router.push("/detalhe-pedido")}
                    >
                      <Text style={meusPedidosStyle.txtDetalhes}>
                        Ver detalhes
                      </Text>
                    </Pressable>
                    <Pressable style={meusPedidosStyle.btnRastrear}>
                      <Text style={meusPedidosStyle.txtRastrear}>Rastrear entrega</Text>
                    </Pressable>
                  </View>
                </View>
                </>
                )}

                {filtro === "entregue" && (
                <View style={meusPedidosStyle.card}>
                  <View style={meusPedidosStyle.headerPedido}>
                    <View style={meusPedidosStyle.cardTitulo}>
                      <Image
                        style={meusPedidosStyle.iconTitulo}
                        source={require("@/assets/images/img/entregue-verde.png")}
                      />
                      <Text style={meusPedidosStyle.txtCardTituloVerde}>
                        Pedido {"#"}999
                      </Text>
                    </View>
                    <View style={meusPedidosStyle.topoPedidoVerde}>
                      <Image
                        style={meusPedidosStyle.imgStatus}
                        source={require("@/assets/images/img/entregue-verde.png")}
                        resizeMode="stretch"
                      />
                      <Text style={meusPedidosStyle.txtStatusVerde}>
                        Entregue
                      </Text>
                    </View>
                  </View>
                  <View style={meusPedidosStyle.areaResumo}>
                    <View style={meusPedidosStyle.listaItensResumo}>
                      {itensResumo.map((item) => (
                        <View style={meusPedidosStyle.itemResumo} key={item.id}>
                          <View style={meusPedidosStyle.itemResumoEsquerdo}>
                            <Image
                              style={meusPedidosStyle.imgItemResumo}
                              source={item.imagem}
                              resizeMode="cover"
                            />
                            <Text style={meusPedidosStyle.txtItemResumo}>
                              {item.quantidade}x {item.nome}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View style={meusPedidosStyle.colunaImgAguardando}>
                      <Image
                        style={meusPedidosStyle.imgAguardando}
                        source={require("@/assets/images/img/entregue-verde.png")}
                        resizeMode="stretch"
                      />
                    </View>
                  </View>

                  <View style={globalStyle.separador}></View>
                  <View style={meusPedidosStyle.rodapeResumo}>
                    <View style={meusPedidosStyle.total}>
                      <Text style={meusPedidosStyle.txtTotal}>Total</Text>
                      <Text style={meusPedidosStyle.valorTotalVerde}>
                        {valorTotal}
                      </Text>
                    </View>
                  </View>
                  <View style={meusPedidosStyle.btnPedido}>
                    <Pressable
                      style={[meusPedidosStyle.btnDetalhes, { marginTop: 0 }]}
                      onPress={() => router.push("/detalhe-pedido")}
                    >
                      <Text style={meusPedidosStyle.txtDetalhes}>
                        Ver detalhes
                      </Text>
                    </Pressable>
                    <Pressable
                      style={meusPedidosStyle.btnRastrear}
                      onPress={() => router.push("/pagamento")}
                    >
                      <Text style={meusPedidosStyle.txtRastrear}>
                        Pedir novamente
                      </Text>
                    </Pressable>
                  </View>
                </View>
                )}
              </View>
            </View>
          </ScrollView>

          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
