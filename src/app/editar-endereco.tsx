import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import editarEnderecoStyle from "@/styles/editarEnderecoStyle";
import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores } from "@/styles/variaveis";

export default function EditarEnderecoScreen() {
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
                router.replace("/enderecos");
              }
            }}
          >
            <Image
              style={globalStyle.imgVoltar}
              source={require("@/assets/images/img/voltar.png")}
            />
          </Pressable>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={editarEnderecoStyle.conteudo}>
              <View style={editarEnderecoStyle.header}>
                <View style={editarEnderecoStyle.ladoEsquerdo}>
                  <Text style={editarEnderecoStyle.titulo}>
                    Editar endereço
                  </Text>
                  <Text style={editarEnderecoStyle.subtitulo}>
                    Edite o endereço selecionado
                  </Text>
                </View>
                <Image
                  style={editarEnderecoStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={editarEnderecoStyle.main}>
                <View style={editarEnderecoStyle.cardFormulario}>
                  <View style={editarEnderecoStyle.campo}>
                    <Image
                      style={editarEnderecoStyle.iconCampo}
                      source={require("@/assets/images/img/local.png")}
                    />
                    <View style={editarEnderecoStyle.campoTextos}>
                      <Text style={editarEnderecoStyle.campoLabel}>
                        Nome do endereço
                      </Text>
                      <TextInput
                        style={editarEnderecoStyle.campoInput}
                        defaultValue="Casa"
                        placeholderTextColor={cores.cinza}
                      />
                    </View>
                  </View>

                  <View style={editarEnderecoStyle.campoEndereco}>
                    <Image
                      style={editarEnderecoStyle.iconCampo}
                      source={require("@/assets/images/img/local.png")}
                    />
                    <View style={editarEnderecoStyle.campoTextos}>
                      <Text style={editarEnderecoStyle.campoLabel}>
                        Endereço
                      </Text>
                      <TextInput
                        style={editarEnderecoStyle.campoInput}
                        defaultValue="Avenida Marechal Tito, 1500"
                        placeholderTextColor={cores.cinza}
                      />
                    </View>
                  </View>

                  <View style={editarEnderecoStyle.campo}>
                    <Image
                      style={editarEnderecoStyle.iconCampo}
                      source={require("@/assets/images/img/local.png")}
                    />
                    <View style={editarEnderecoStyle.campoTextos}>
                      <Text style={editarEnderecoStyle.campoLabel}>
                        Bairro
                      </Text>
                      <TextInput
                        style={editarEnderecoStyle.campoInput}
                        defaultValue="São Miguel Paulista"
                        placeholderTextColor={cores.cinza}
                      />
                    </View>
                  </View>

                  <View style={editarEnderecoStyle.campo}>
                    <Image
                      style={editarEnderecoStyle.iconCampo}
                      source={require("@/assets/images/img/local.png")}
                    />
                    <View style={editarEnderecoStyle.campoTextos}>
                      <Text style={editarEnderecoStyle.campoLabel}>
                        Cidade
                      </Text>
                      <TextInput
                        style={editarEnderecoStyle.campoInput}
                        defaultValue="São Paulo"
                        placeholderTextColor={cores.cinza}
                      />
                    </View>
                  </View>

                  <View style={editarEnderecoStyle.campo}>
                    <Image
                      style={editarEnderecoStyle.iconCampo}
                      source={require("@/assets/images/img/local.png")}
                    />
                    <View style={editarEnderecoStyle.campoTextos}>
                      <Text style={editarEnderecoStyle.campoLabel}>UF</Text>
                      <TextInput
                        style={editarEnderecoStyle.campoInput}
                        defaultValue="SP"
                        placeholderTextColor={cores.cinza}
                      />
                    </View>
                  </View>

                  <View style={editarEnderecoStyle.campo}>
                    <Image
                      style={editarEnderecoStyle.iconCampo}
                      source={require("@/assets/images/img/local.png")}
                    />
                    <View style={editarEnderecoStyle.campoTextos}>
                      <Text style={editarEnderecoStyle.campoLabel}>CEP</Text>
                      <TextInput
                        style={editarEnderecoStyle.campoInput}
                        defaultValue="00000-000"
                        placeholderTextColor={cores.cinza}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                <Pressable style={editarEnderecoStyle.btnSalvar}>
                  <Text style={editarEnderecoStyle.txtSalvar}>
                    Salvar alterações
                  </Text>
                </Pressable>

                <Pressable style={editarEnderecoStyle.btnCancelar}>
                  <Text style={editarEnderecoStyle.txtCancelar}>
                    Cancelar
                  </Text>
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
