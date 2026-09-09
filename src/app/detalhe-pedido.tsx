import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import detalhePedidoStyle from "@/styles/detalhePedidoStyle";
import { router } from "expo-router";
import { Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetalhePedidoScreen() {
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

              </View>
            </View>
          </ScrollView>

          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
