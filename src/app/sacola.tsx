import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import sacolaStyle from "@/styles/sacolaStyle";
import { cores } from "@/styles/variaveis";
import { router } from "expo-router";
import { Image, ImageBackground, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SacolaScreen() {
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
            <View style={sacolaStyle.conteudo}>
              <View style={sacolaStyle.header}>
                <View style={sacolaStyle.ladoEsquerdo}>
                  <Text style={sacolaStyle.titulo}>Sacola</Text>
                  <Text style={sacolaStyle.subtitulo}>
                    Revise seus itens antes de finalizar
                  </Text>
                </View>
                <Image
                  style={sacolaStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={sacolaStyle.main}>

                <View style={sacolaStyle.itemSacola}>
                    <Image
                        style={sacolaStyle.imgItem}
                        source={require('@/assets/images/img/bolo01.png')}
                        resizeMode="stretch"
                        />
                    <View style={sacolaStyle.centroItem}>
                      <Text style={sacolaStyle.tituloItem}>Bolo de Banana Fit</Text>
                      <Text style={sacolaStyle.descricaoItem}>Banana Prata com canela e gergilim</Text>
                      <View style={sacolaStyle.valoresItem}>
                        <Text style={sacolaStyle.valorUnitItem}>R$ 75,90</Text>
                        <Text style={sacolaStyle.valorTotalItem}>R$ 151,80</Text>
                      </View>
                    </View>
                    <View style={sacolaStyle.direitaItem}>
                        <Pressable style={sacolaStyle.btnExcluir}>
                            <Image
                                style={sacolaStyle.imgExcluir}
                                source={require('@/assets/images/img/lixeira.png')}
                            />
                        </Pressable>
                        <View style={sacolaStyle.caixaQtde}>
                          <Pressable style={sacolaStyle.btnQtde}>
                            <Image
                              style={sacolaStyle.imgQtde}
                              source={require("@/assets/images/img/retirar.png")}
                            />
                          </Pressable>
                          <Text style={sacolaStyle.quantidade}>2</Text>
                          <Pressable style={sacolaStyle.btnQtde}>
                            <Image
                              style={sacolaStyle.imgQtde}
                              source={require("@/assets/images/img/adicionar.png")}
                            />
                          </Pressable>
                        </View>
                    </View>
                </View>

                <View style={sacolaStyle.itemSacola}>
                    <Image
                        style={sacolaStyle.imgItem}
                        source={require('@/assets/images/img/bolo01.png')}
                        resizeMode="stretch"
                        />
                    <View style={sacolaStyle.centroItem}>
                      <Text style={sacolaStyle.tituloItem}>Bolo de Banana Fit</Text>
                      <Text style={sacolaStyle.descricaoItem}>Banana Prata com canela e gergilim</Text>
                      <View style={sacolaStyle.valoresItem}>
                        <Text style={sacolaStyle.valorUnitItem}>R$ 75,90</Text>
                        <Text style={sacolaStyle.valorTotalItem}>R$ 151,80</Text>
                      </View>
                    </View>
                    <View style={sacolaStyle.direitaItem}>
                        <Pressable style={sacolaStyle.btnExcluir}>
                            <Image
                                style={sacolaStyle.imgExcluir}
                                source={require('@/assets/images/img/lixeira.png')}
                            />
                        </Pressable>
                        <View style={sacolaStyle.caixaQtde}>
                          <Pressable style={sacolaStyle.btnQtde}>
                            <Image
                              style={sacolaStyle.imgQtde}
                              source={require("@/assets/images/img/retirar.png")}
                            />
                          </Pressable>
                          <Text style={sacolaStyle.quantidade}>2</Text>
                          <Pressable style={sacolaStyle.btnQtde}>
                            <Image
                              style={sacolaStyle.imgQtde}
                              source={require("@/assets/images/img/adicionar.png")}
                            />
                          </Pressable>
                        </View>
                    </View>
                </View> 

                <View style={sacolaStyle.itemSacola}>
                    <Image
                        style={sacolaStyle.imgItem}
                        source={require('@/assets/images/img/bolo01.png')}
                        resizeMode="stretch"
                        />
                    <View style={sacolaStyle.centroItem}>
                      <Text style={sacolaStyle.tituloItem}>Bolo de Banana Fit</Text>
                      <Text style={sacolaStyle.descricaoItem}>Banana Prata com canela e gergilim</Text>
                      <View style={sacolaStyle.valoresItem}>
                        <Text style={sacolaStyle.valorUnitItem}>R$ 75,90</Text>
                        <Text style={sacolaStyle.valorTotalItem}>R$ 151,80</Text>
                      </View>
                    </View>
                    <View style={sacolaStyle.direitaItem}>
                        <Pressable style={sacolaStyle.btnExcluir}>
                            <Image
                                style={sacolaStyle.imgExcluir}
                                source={require('@/assets/images/img/lixeira.png')}
                            />
                        </Pressable>
                        <View style={sacolaStyle.caixaQtde}>
                          <Pressable style={sacolaStyle.btnQtde}>
                            <Image
                              style={sacolaStyle.imgQtde}
                              source={require("@/assets/images/img/retirar.png")}
                            />
                          </Pressable>
                          <Text style={sacolaStyle.quantidade}>2</Text>
                          <Pressable style={sacolaStyle.btnQtde}>
                            <Image
                              style={sacolaStyle.imgQtde}
                              source={require("@/assets/images/img/adicionar.png")}
                            />
                          </Pressable>
                        </View>
                    </View>
                </View>

                <View style={sacolaStyle.cupom}>
                    <View style={sacolaStyle.cupomEsquerdo}>
                        <Text style={sacolaStyle.txtCupom}>Cupom de Desconto</Text>
                        <TextInput
                            style={sacolaStyle.tituloCupom}
                            placeholder="Digite o seu cupom"
                            placeholderTextColor={cores.cinza}
                        />
                    </View>
                    <Pressable style={sacolaStyle.btnAplicar}>
                        <Text style={sacolaStyle.txtAplicar}>Aplicar {`>`}</Text>
                    </Pressable>
                </View>

                <View style={sacolaStyle.endereço}>
                    <Image
                        style={sacolaStyle.imgEndereco}
                        source={require('@/assets/images/img/delivery-laranja.png')}
                        resizeMode="stretch"
                    />
                    <View style={sacolaStyle.infoEndereco}>
                        <Text style={sacolaStyle.tituloEndereco}>Entrega em:</Text>
                        <Text style={sacolaStyle.endereçoCompleto}>
                        Avenida Marechal Tito, 1500 - São Miguel Paulista - São Paulo - SP
                        </Text>
                        <Text style={sacolaStyle.telefone}>{'('}11{')'} 99999-9999</Text>
                        <View style={sacolaStyle.entrega}>
                            <Text style={sacolaStyle.tituloEntrega}>Entrega estima em:</Text>
                            <Text style={sacolaStyle.tempoEntrega}>40-60 minutos</Text>
                            <Pressable>
                                <Text style={sacolaStyle.txtEndereco}>Trocar endereço</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>

                  <View style={sacolaStyle.subtotal}>
                    <View style={sacolaStyle.areaSubtotal}>
                        <Text style={sacolaStyle.txtSubtotal}>Subtotal</Text>
                        <Text style={sacolaStyle.valorSubtotal}>R$ 531,30</Text>
                    </View>

                    <View style={sacolaStyle.areaEntrega}>
                      <Text style={sacolaStyle.txtEntrega}>Entrega</Text>
                      <Text style={sacolaStyle.valorEntrega}>R$ 10,00</Text>
                    </View>

                    <View style={sacolaStyle.areaDesconto}>
                      <Text style={sacolaStyle.txtDesconto}>Desconto</Text>
                      <Text style={sacolaStyle.cupmDesconto}>THEGUSTA10</Text>
                      <Text style={sacolaStyle.valorDesconto}>- R$ 54,13</Text>
                    </View>
                    <View style={globalStyle.separador}></View>
                    <View style={sacolaStyle.total}>
                        <Text style={sacolaStyle.txtTotal}>Total</Text>
                        <Text style={sacolaStyle.valorTotal}>R$ 487,17</Text>
                    </View>
                </View>
                <Pressable style={sacolaStyle.btnPagamento}>
                  <Text style={sacolaStyle.txtPagamento}>Continuar para pagamento</Text>
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
