import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import { cores, fontes } from "@/styles/variaveis";
import { router } from "expo-router";
import type { PropsWithChildren } from "react";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Tela({ titulo, subtitulo, children, voltar }: PropsWithChildren<{
  titulo: string; subtitulo: string; voltar?: () => void;
}>) {
  return <View style={globalStyle.container}>
    <ImageBackground source={require("@/assets/images/img/00_fundo.png")} style={globalStyle.background} resizeMode="cover">
      <SafeAreaView style={globalStyle.areaConteudo}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar" style={globalStyle.btnVoltar}
          onPress={voltar ?? (() => router.canGoBack() ? router.back() : router.replace("/home"))}>
          <Image style={globalStyle.imgVoltar} source={require("@/assets/images/img/voltar.png")} />
        </Pressable>
        <ScrollView style={globalStyle.scrollConteudo} keyboardShouldPersistTaps="handled">
          <View style={estilos.conteudo}>
            <View style={estilos.header}>
              <View style={estilos.esquerdo}>
                <Text style={estilos.titulo}>{titulo}</Text>
                <Text style={estilos.subtitulo}>{subtitulo}</Text>
              </View>
              <Image style={estilos.logo} source={require("@/assets/images/img/logo.png")} />
            </View>
            <View style={estilos.main}>{children}</View>
          </View>
        </ScrollView>
        <FooterScreen />
      </SafeAreaView>
    </ImageBackground>
  </View>;
}
const estilos = StyleSheet.create({
  conteudo: { marginTop: 30, marginBottom: 30 },
  header: { width: "80%", margin: "auto", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  esquerdo: { flex: 1 },
  titulo: { fontSize: 30, fontFamily: fontes.negrito, color: cores.preto, marginTop: 65 },
  subtitulo: { marginTop: 10, fontSize: 17, color: cores.cinza },
  logo: { width: 80, height: 75 },
  main: { width: "80%", margin: "auto", marginTop: 15 },
});
