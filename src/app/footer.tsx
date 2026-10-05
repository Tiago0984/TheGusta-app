import { Image, Pressable, Text, View } from "react-native";
import globalStyle from "@/styles/globalStyle";
import { router, usePathname } from "expo-router";

export default function FooterScreen() {
  const pathname = usePathname();
  function menuAtivo(rota: string) {
    return pathname === rota;
  }

  return (
    <View style={globalStyle.footer}>
      <Pressable
        style={globalStyle.btnFooter}
        onPress={() => router.navigate("/home")}
      >
        <Image source={require("@/assets/images/img/home.png")} />
        <Text
          style={[
            globalStyle.txtFooter,
            menuAtivo("/home") && globalStyle.txtFooterAtivo,
          ]}
        >
          Home
        </Text>
      </Pressable>

      <Pressable
        style={globalStyle.btnFooter}
        onPress={() => router.navigate("/cardapio")}
      >
        <Image source={require("@/assets/images/img/cardapio.png")} />
        <Text
          style={[
            globalStyle.txtFooter,
            menuAtivo("/cardapio") && globalStyle.txtFooterAtivo, 
          ]}
        >
          Cardápio
        </Text>
      </Pressable>

      <Pressable
        style={globalStyle.btnFooter}
        onPress={() => router.navigate("/sacola")}
      >
        <Image source={require("@/assets/images/img/sacola.png")} />
        <Text
          style={[
            globalStyle.txtFooter,
            menuAtivo("/sacola") && globalStyle.txtFooterAtivo,
          ]}
        >
          Sacola
        </Text>
      </Pressable>

      <Pressable
        style={globalStyle.btnFooter}
        onPress={() => router.navigate("/meus-pedidos")}
      >
        <Image source={require("@/assets/images/img/pedido.png")} />
        <Text
          style={[
            globalStyle.txtFooter,
            menuAtivo("/meus-pedidos") && globalStyle.txtFooterAtivo,
          ]}
        >
          Pedidos
        </Text>
      </Pressable>

      <Pressable
        style={globalStyle.btnFooter}
        onPress={() => router.navigate("/configuracao")}
      >
        <Image source={require("@/assets/images/img/config.png")} />
        <Text
          style={[
            globalStyle.txtFooter,
            menuAtivo("/configuracao") && globalStyle.txtFooterAtivo,
          ]}
        >
          Config
        </Text>
      </Pressable>
    </View>
  );
}
