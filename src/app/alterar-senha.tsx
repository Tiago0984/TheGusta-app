import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import alterarSenhaStyle from "@/styles/alterarSenhaStyle";
import { router } from "expo-router";
import { useState } from "react";
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

export default function AlterarSenhaScreen() {
  const [verSenhaAtual, setVerSenhaAtual] = useState(false);
  const [verNovaSenha, setVerNovaSenha] = useState(false);
  const [verConfirmarSenha, setVerConfirmarSenha] = useState(false);

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
                router.replace("/configuracao");
              }
            }}
          >
            <Image
              style={globalStyle.imgVoltar}
              source={require("@/assets/images/img/voltar.png")}
            />
          </Pressable>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={alterarSenhaStyle.conteudo}>
              <View style={alterarSenhaStyle.header}>
                <View style={alterarSenhaStyle.ladoEsquerdo}>
                  <Text style={alterarSenhaStyle.titulo}>Alterar senha</Text>
                  <Text style={alterarSenhaStyle.subtitulo}>
                    Atualize sua senha com segurança
                  </Text>
                </View>
                <Image
                  style={alterarSenhaStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={alterarSenhaStyle.main}>
                <View style={alterarSenhaStyle.cardSenhas}>
                <View style={alterarSenhaStyle.listaCampos}>
                  <View style={alterarSenhaStyle.campo}>
                    <Image
                      style={alterarSenhaStyle.iconCampo}
                      source={require("@/assets/images/img/senha.png")}
                    />
                    <View style={alterarSenhaStyle.campoTextos}>
                      <Text style={alterarSenhaStyle.campoLabel}>
                        Senha atual
                      </Text>
                      <TextInput
                        style={alterarSenhaStyle.campoInput}
                        placeholder="Digite sua senha atual"
                        placeholderTextColor={cores.cinza}
                        secureTextEntry={!verSenhaAtual}
                      />
                    </View>
                    <Pressable
                      onPress={() =>
                        setVerSenhaAtual((atual) => !atual)
                      }
                    >
                      <Image
                        style={alterarSenhaStyle.imgOlho}
                        source={
                          verSenhaAtual
                            ? require("@/assets/images/img/esconder.png")
                            : require("@/assets/images/img/mostrar.png")
                        }
                      />
                    </Pressable>
                  </View>

                  <View style={alterarSenhaStyle.campo}>
                    <Image
                      style={alterarSenhaStyle.iconCampo}
                      source={require("@/assets/images/img/senha.png")}
                    />
                    <View style={alterarSenhaStyle.campoTextos}>
                      <Text style={alterarSenhaStyle.campoLabel}>
                        Nova senha
                      </Text>
                      <TextInput
                        style={alterarSenhaStyle.campoInput}
                        placeholder="Digite a nova senha"
                        placeholderTextColor={cores.cinza}
                        secureTextEntry={!verNovaSenha}
                      />
                    </View>
                    <Pressable
                      onPress={() => setVerNovaSenha((atual) => !atual)}
                    >
                      <Image
                        style={alterarSenhaStyle.imgOlho}
                        source={
                          verNovaSenha
                            ? require("@/assets/images/img/esconder.png")
                            : require("@/assets/images/img/mostrar.png")
                        }
                      />
                    </Pressable>
                  </View>

                  <View style={alterarSenhaStyle.campo}>
                    <Image
                      style={alterarSenhaStyle.iconCampo}
                      source={require("@/assets/images/img/senha.png")}
                    />
                    <View style={alterarSenhaStyle.campoTextos}>
                      <Text style={alterarSenhaStyle.campoLabel}>
                        Confirmar nova senha
                      </Text>
                      <TextInput
                        style={alterarSenhaStyle.campoInput}
                        placeholder="Confirme a nova senha"
                        placeholderTextColor={cores.cinza}
                        secureTextEntry={!verConfirmarSenha}
                      />
                    </View>
                    <Pressable
                      onPress={() =>
                        setVerConfirmarSenha((atual) => !atual)
                      }
                    >
                      <Image
                        style={alterarSenhaStyle.imgOlho}
                        source={
                          verConfirmarSenha
                            ? require("@/assets/images/img/esconder.png")
                            : require("@/assets/images/img/mostrar.png")
                        }
                      />
                    </Pressable>
                  </View>
                </View>
                </View>

                <View style={alterarSenhaStyle.cardDicas}>
                  <Image
                    style={alterarSenhaStyle.imgDicas}
                    source={require("@/assets/images/img/info.png")}
                  />
                  <View style={alterarSenhaStyle.dicasTextos}>
                    <Text style={alterarSenhaStyle.tituloDicas}>
                      Dicas para uma senha segura
                    </Text>
                    <Text style={alterarSenhaStyle.itemDica}>
                      • Use pelo menos 8 caracteres
                    </Text>
                    <Text style={alterarSenhaStyle.itemDica}>
                      • Combine letras, números e símbolos
                    </Text>
                  </View>
                </View>

                <Pressable style={alterarSenhaStyle.btnSalvar}>
                  <Text style={alterarSenhaStyle.txtSalvar}>
                    Salvar nova senha
                  </Text>
                </Pressable>

                <Pressable style={alterarSenhaStyle.btnCancelar}>
                  <Text style={alterarSenhaStyle.txtCancelar}>Cancelar</Text>
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
