import { Image, Pressable, Text, View } from "react-native";
import globalStyle from "@/styles/globalStyle";
import { router } from "expo-router";

export default function FooterScreen() {
  return (
    <View style={globalStyle.footer}>
      <Pressable
        style={globalStyle.btnFooter}
        onPress={() => router.navigate("/home")}
      >
        <Image source={require("@/assets/images/img/home.png")} />
        <Text style={[globalStyle.txtFooter, globalStyle.txtFooterAtivo]}>
          Home
        </Text>
      </Pressable>

      <Pressable style={globalStyle.btnFooter}>
        <Image source={require("@/assets/images/img/cardapio.png")} />
        <Text style={globalStyle.txtFooter}>Cardápio</Text>
      </Pressable>

      <Pressable style={globalStyle.btnFooter}>
        <Image source={require("@/assets/images/img/sacola.png")} />
        <Text style={globalStyle.txtFooter}>Sacola</Text>
      </Pressable>

      <Pressable style={globalStyle.btnFooter}>
        <Image source={require("@/assets/images/img/pedido.png")} />
        <Text style={globalStyle.txtFooter}>Pedidos</Text>
      </Pressable>

      <Pressable style={globalStyle.btnFooter}>
        <Image source={require("@/assets/images/img/config.png")} />
        <Text style={globalStyle.txtFooter}>Config</Text>
      </Pressable>
    </View>
  );
}
