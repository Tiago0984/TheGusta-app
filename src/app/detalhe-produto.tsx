import FooterScreen from "@/app/footer";
import detalheProdutoStyle from "@/styles/detalheProdutoStyle";
import globalStyle from "@/styles/globalStyle";
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

export default function DetalheProdutoScreen() {
  const [favorito, setFavorito] = useState(false);

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
            <View style={detalheProdutoStyle.conteudo}>
              <View style={detalheProdutoStyle.header}>
                <View style={detalheProdutoStyle.ladoEsquerdo}>
                  <Text style={detalheProdutoStyle.titulo}>
                    Bolo de Banana Fit
                  </Text>
                </View>
                <Pressable
                  style={detalheProdutoStyle.btnFavorito}
                  onPress={() => setFavorito((atual) => !atual)}
                >
                  <Text style={detalheProdutoStyle.txtFavorito}>
                    {favorito ? "★" : "☆"}
                  </Text>
                </Pressable>
              </View>
              <View style={detalheProdutoStyle.main}>
                <Image
                  style={detalheProdutoStyle.imgProduto}
                  source={require("@/assets/images/img/bolo01.png")}
                  // resizeMode="stretch"
                />
                <Text style={detalheProdutoStyle.categoria}>Bolos</Text>
                <Text style={detalheProdutoStyle.valorProduto}>R$ 75,90</Text>
                <Text style={detalheProdutoStyle.descricaoCurta}>
                  Feito com aveia e adoçado naturalmente pela fruta, sem adição
                  de açucar ou farinha de trigo. A opção perfeita e saudável
                  para acompanhar seu café.
                </Text>
                <Text style={detalheProdutoStyle.tituloDescricao}>
                  Descrição
                </Text>
                <Text style={detalheProdutoStyle.descricao}>
                  Bolo de banana fit, uma alternativa leve, saudável e cheia de
                  energia para sua rotina. Desenvolvido sem farinha de trigo e
                  sem açucar refinado, ele é adoçado exclusivamente pela doçura
                  natural das bananas maduras, garantindo um sabor autêntico e
                  aconchegante. {"\n"}
                  Rico em fibras graças à adição de avei, este bolo é uma
                  excelente fonte de saciedade e energia natural, ideal para o
                  pré-treino, café da manhã ou lanche da tarde.
                </Text>

                <View style={detalheProdutoStyle.areaVenda}>
                  <View style={detalheProdutoStyle.linhaQtdeSubtotal}>
                    <View style={detalheProdutoStyle.caixaQtde}>
                      <Pressable style={detalheProdutoStyle.btnQtde}>
                        <Image
                          style={detalheProdutoStyle.imgQtde}
                          source={require("@/assets/images/img/retirar.png")}
                        />
                      </Pressable>
                      <Text style={detalheProdutoStyle.quantidade}>2</Text>
                      <Pressable style={detalheProdutoStyle.btnQtde}>
                        <Image
                          style={detalheProdutoStyle.imgQtde}
                          source={require("@/assets/images/img/adicionar.png")}
                        />
                      </Pressable>
                    </View>
                    <View style={detalheProdutoStyle.caixaSubtotal}>
                      <Text style={detalheProdutoStyle.txtSubtotal}>Subtotal</Text>
                      <Text style={detalheProdutoStyle.valorSubtotal}>R$ 151,80</Text>
                    </View>
                  </View>
                  <Pressable style={detalheProdutoStyle.btnSubtotal}>
                    <Text style={detalheProdutoStyle.txtSacola}>Adicionar à Sacola</Text>
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
