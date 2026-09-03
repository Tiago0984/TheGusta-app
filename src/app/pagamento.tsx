import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import pagamentoStyle from "@/styles/pagamentoStyle";
import { cores } from "@/styles/variaveis";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ImageBackground, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PagamentoScreen() {
  const [entrega, setEntrega] = useState<"entrega" | "retirada">("entrega");
  const [pagamento, setPagamento] = useState<"pix" | "cartao" | "dinheiro">("pix");

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
                router.replace("/sacola");
              }
            }}
          >
            <Image
              style={globalStyle.imgVoltar}
              source={require("@/assets/images/img/voltar.png")}
            />
          </Pressable>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={pagamentoStyle.conteudo}>
              <View style={pagamentoStyle.header}>
                <View style={pagamentoStyle.ladoEsquerdo}>
                  <Text style={pagamentoStyle.titulo}>Pagamento</Text>
                  <Text style={pagamentoStyle.subtitulo}>
                    Confirme entrega e forma de pagamento
                  </Text>
                </View>
                <Image
                  style={pagamentoStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={pagamentoStyle.main}>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Text style={pagamentoStyle.txtCardTituloEndereco}>Endereço de entrega</Text>
                  </View>
                  <View style={pagamentoStyle.enderecoConteudo}>
                    <View style={pagamentoStyle.enderecoEsquerdo}>
                      <Image
                        style={pagamentoStyle.imgEndereco}
                        source={require("@/assets/images/img/local.png")}
                      />
                      <View style={pagamentoStyle.enderecoInfo}>
                        <Text style={pagamentoStyle.rotuloEndereco}>Casa</Text>
                        <Text style={pagamentoStyle.enderecoCompleto}>
                          Avenida Marechal Tito, 1500{"\n"}São Miguel Paulista - São Paulo - SP
                        </Text>
                        <Text style={pagamentoStyle.telefone}>{"("}11{")"} 99999-9999</Text>
                      </View>
                    </View>
                    <Pressable>
                      <Text style={pagamentoStyle.txtAlterar}>Alterar {`>`}</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Text style={pagamentoStyle.txtCardTituloEntrega}>Entrega / Retirada</Text>
                  </View>
                  <View style={pagamentoStyle.entregaRetiradaLinha}>
                    <View style={pagamentoStyle.entregaRetiradaEsquerdo}>
                      <Image
                        style={pagamentoStyle.imgEntrega}
                        source={require("@/assets/images/img/delivery-laranja.png")}
                        resizeMode="stretch"
                      />
                      <View style={pagamentoStyle.segmentado}>
                        <Pressable
                          style={[
                            pagamentoStyle.segmentoBtn,
                            entrega === "entrega" && pagamentoStyle.segmentoBtnAtivo,
                          ]}
                          onPress={() => setEntrega("entrega")}
                        >
                          <Text
                            style={[
                              pagamentoStyle.segmentoTxt,
                              entrega === "entrega" && pagamentoStyle.segmentoTxtAtivo,
                            ]}
                          >
                            Entrega
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[
                            pagamentoStyle.segmentoBtn,
                            entrega === "retirada" && pagamentoStyle.segmentoBtnAtivo,
                          ]}
                          onPress={() => setEntrega("retirada")}
                        >
                          <Text
                            style={[
                              pagamentoStyle.segmentoTxt,
                              entrega === "retirada" && pagamentoStyle.segmentoTxtAtivo,
                            ]}
                          >
                            Retirada
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={pagamentoStyle.previsaoArea}>
                      <Text style={pagamentoStyle.previsaoTempo}>45 - 60 min</Text>
                      <Text style={pagamentoStyle.previsaoTxt}>Previsão</Text>
                    </View>
                  </View>
                </View>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Text style={pagamentoStyle.txtCardTituloPagamento}>Forma de pagamento</Text>
                  </View>
                  <View style={pagamentoStyle.formaPagamentoLinha}>
                    <Image
                      style={pagamentoStyle.imgCarteira}
                      source={require("@/assets/images/img/carteira.png")}
                      resizeMode="contain"
                    />
                    <View style={pagamentoStyle.segmentadoTriplo}>
                    <Pressable
                      style={[
                        pagamentoStyle.segmentoBtnTriplo,
                        pagamento === "pix" && pagamentoStyle.segmentoBtnAtivo,
                      ]}
                      onPress={() => setPagamento("pix")}
                    >
                      <Text
                        style={[
                          pagamentoStyle.segmentoTxt,
                          pagamento === "pix" && pagamentoStyle.segmentoTxtAtivo,
                        ]}
                      >
                        Pix
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        pagamentoStyle.segmentoBtnTriplo,
                        pagamentoStyle.segmentoDivisor,
                        pagamento === "cartao" && pagamentoStyle.segmentoBtnAtivo,
                      ]}
                      onPress={() => setPagamento("cartao")}
                    >
                      <Text
                        style={[
                          pagamentoStyle.segmentoTxt,
                          pagamento === "cartao" && pagamentoStyle.segmentoTxtAtivo,
                        ]}
                      >
                        Cartão
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        pagamentoStyle.segmentoBtnTriplo,
                        pagamentoStyle.segmentoDivisor,
                        pagamento === "dinheiro" && pagamentoStyle.segmentoBtnAtivo,
                      ]}
                      onPress={() => setPagamento("dinheiro")}
                    >
                      <Text
                        style={[
                          pagamentoStyle.segmentoTxt,
                          pagamento === "dinheiro" && pagamentoStyle.segmentoTxtAtivo,
                        ]}
                      >
                        Dinheiro
                      </Text>
                    </Pressable>
                    </View>
                  </View>
                </View>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Text style={pagamentoStyle.txtCardTituloObservacao}>Observação</Text>
                  </View>
                  <View style={pagamentoStyle.observacaoLinha}>
                    <Image
                      style={pagamentoStyle.imgObservacao}
                      source={require("@/assets/images/img/mensagem.png")}
                      resizeMode="contain"
                    />
                    <TextInput
                      style={pagamentoStyle.inputObservacao}
                      placeholder="Alguma observação para o seu pedido"
                      placeholderTextColor={cores.cinza}
                      multiline
                    />
                  </View>
                </View>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Image
                      style={pagamentoStyle.iconTitulo}
                      source={require("@/assets/images/img/pedido.png")}
                    />
                    <Text style={pagamentoStyle.txtCardTitulo}>Resumo do pedido</Text>
                  </View>

                  <View style={pagamentoStyle.itemResumo}>
                    <View style={pagamentoStyle.itemResumoEsquerdo}>
                      <Image
                        style={pagamentoStyle.imgItemResumo}
                        source={require("@/assets/images/img/bolo01.png")}
                        resizeMode="cover"
                      />
                      <Text style={pagamentoStyle.txtItemResumo}>2x Bolo de Banana Fit</Text>
                    </View>
                    <Text style={pagamentoStyle.valorItemResumo}>R$ 151,80</Text>
                  </View>
                  <View style={pagamentoStyle.itemResumo}>
                    <View style={pagamentoStyle.itemResumoEsquerdo}>
                      <Image
                        style={pagamentoStyle.imgItemResumo}
                        source={require("@/assets/images/img/bolo01.png")}
                        resizeMode="cover"
                      />
                      <Text style={pagamentoStyle.txtItemResumo}>3x Bolo de Banana Fit</Text>
                    </View>
                    <Text style={pagamentoStyle.valorItemResumo}>R$ 227,70</Text>
                  </View>
                  <View style={pagamentoStyle.itemResumo}>
                    <View style={pagamentoStyle.itemResumoEsquerdo}>
                      <Image
                        style={pagamentoStyle.imgItemResumo}
                        source={require("@/assets/images/img/bolo01.png")}
                        resizeMode="cover"
                      />
                      <Text style={pagamentoStyle.txtItemResumo}>2x Bolo de Banana Fit</Text>
                    </View>
                    <Text style={pagamentoStyle.valorItemResumo}>R$ 151,80</Text>
                  </View>

                  <View style={globalStyle.separador}></View>

                  <View style={pagamentoStyle.areaSubtotal}>
                    <Text style={pagamentoStyle.txtSubtotal}>Subtotal</Text>
                    <Text style={pagamentoStyle.valorSubtotal}>R$ 531,30</Text>
                  </View>
                  <View style={pagamentoStyle.areaEntrega}>
                    <Text style={pagamentoStyle.txtEntrega}>Entrega</Text>
                    <Text style={pagamentoStyle.valorEntrega}>R$ 10,00</Text>
                  </View>
                  <View style={pagamentoStyle.areaDesconto}>
                    <Text style={pagamentoStyle.txtDesconto}>Desconto</Text>
                    <Text style={pagamentoStyle.cupmDesconto}>THEGUSTA10</Text>
                    <Text style={pagamentoStyle.valorDesconto}>- R$ 54,13</Text>
                  </View>

                  <View style={globalStyle.separador}></View>

                  <View style={pagamentoStyle.total}>
                    <Text style={pagamentoStyle.txtTotal}>Total</Text>
                    <Text style={pagamentoStyle.valorTotal}>R$ 487,17</Text>
                  </View>
                </View>

                <Pressable style={pagamentoStyle.btnConfirmar}>
                  <Text style={pagamentoStyle.txtConfirmar}>Confirmar pedido</Text>
                </Pressable>

              </View>
            </View>
          </ScrollView>
          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
