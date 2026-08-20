import { router } from "expo-router";
import { useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";

import cadClienteStyle from "@/styles/cadClienteStyle";
import globalStyle from "@/styles/globalStyle";

export default function CadClienteScreen() {
  const [verSenha, setVerSenha] = useState(false);
  const [verConfirmarSenha, setVerConfirmarSenha] = useState(false);
  const [AceitarTermos, setVerAceitarTermos] = useState(false);

  return (
    <View style={globalStyle.container}>
      <ImageBackground
        source={require("@/assets/images/img/00_fundo.png")}
        style={globalStyle.background}
        resizeMode="cover"
      >
        <SafeAreaView style={globalStyle.areaConteudo}>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={cadClienteStyle.conteudo}>
              <Image
                source={require("@/assets/images/img/logo.png")}
                style={globalStyle.logoMaior}
              />
              <Text style={cadClienteStyle.titulo}>Criar Conta</Text>
              <Text style={cadClienteStyle.subtitulo}>
                cadastre-se para fazer seus pedidos
              </Text>

              {/* Formulario de login */}
              <View style={cadClienteStyle.form}>
                <View style={cadClienteStyle.input}>
                  <Image
                    source={require("@/assets/images/img/user.png")}
                    style={cadClienteStyle.icone}
                  />

                  <TextInput
                    placeholder="Nome completo"
                    placeholderTextColor="#888888"
                    style={cadClienteStyle.TextInput}
                  />
                </View>

                <View style={cadClienteStyle.input}>
                  <Image
                    source={require("@/assets/images/img/email.png")}
                    style={cadClienteStyle.icone}
                  />

                  <TextInput
                    placeholder="E-mail"
                    placeholderTextColor="#888888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={cadClienteStyle.TextInput}
                  />
                </View>

                <View style={cadClienteStyle.input}>
                  <Image
                    source={require("@/assets/images/img/telefone.png")}
                    style={cadClienteStyle.icone}
                  />

                  <TextInput
                    placeholder="Telefone"
                    placeholderTextColor="#888888"
                    keyboardType="phone-pad"
                    style={cadClienteStyle.TextInput}
                  />
                </View>

                <View style={cadClienteStyle.input}>
                  <Image
                    source={require("@/assets/images/img/senha.png")}
                    style={cadClienteStyle.icone}
                  />
                  <TextInput
                    placeholder="Senha"
                    placeholderTextColor="#888888"
                    style={cadClienteStyle.TextInput}
                    secureTextEntry={!verSenha}
                  />

                  <Pressable
                    style={cadClienteStyle.btnMostrarSenha}
                    onPress={() => setVerSenha((current) => !current)}
                  >
                    <Image
                      source={
                        verSenha
                          ? require("@/assets/images/img/esconder.png")
                          : require("@/assets/images/img/mostrar.png")
                      }
                      style={cadClienteStyle.mostrarSenha}
                    />
                  </Pressable>
                </View>

                <View style={cadClienteStyle.input}>
                  <Image
                    source={require("@/assets/images/img/senha.png")}
                    style={cadClienteStyle.icone}
                  />
                  <TextInput
                    placeholder="Confirmar Senha"
                    placeholderTextColor="#888888"
                    style={cadClienteStyle.TextInput}
                    secureTextEntry={!verConfirmarSenha}
                  />

                  <Pressable
                    style={cadClienteStyle.btnMostrarSenha}
                    onPress={() => setVerConfirmarSenha((current) => !current)}
                  >
                    <Image
                      source={
                        verConfirmarSenha
                          ? require("@/assets/images/img/esconder.png")
                          : require("@/assets/images/img/mostrar.png")
                      }
                      style={cadClienteStyle.mostrarSenha}
                    />
                  </Pressable>
                </View>

                <View style={cadClienteStyle.termosUso}>
                  <Pressable
                    style={cadClienteStyle.btnTermos}
                    onPress={() => setVerAceitarTermos((current) => !current)}
                  >
                    <View
                      style={[
                        cadClienteStyle.checkTermos,
                        AceitarTermos && cadClienteStyle.checkTermosAtivo,
                      ]}
                    >
                      {AceitarTermos && (
                        <Text style={cadClienteStyle.checkOK}>✓</Text>
                      )}
                    </View>
                  </Pressable>
                  <Text
                    style={[
                      cadClienteStyle.txtTermos,
                      AceitarTermos && cadClienteStyle.termoAceito,
                    ]}
                  >
                    Aceito os{" "}
                  </Text>
                  <Pressable>
                    <Text style={cadClienteStyle.linkTermos}>
                      Termos de uso
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    cadClienteStyle.btnEntrar,
                    pressed && cadClienteStyle.btnEntrarPressed,
                  ]}
                >
                  <Text style={cadClienteStyle.txtEntrar}>Criar Conta</Text>
                </Pressable>

                <View style={cadClienteStyle.Separador}>
                  <View style={cadClienteStyle.linha}></View>
                  <Text style={cadClienteStyle.textoSeparador}>OU</Text>
                  <View style={cadClienteStyle.linha}></View>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    cadClienteStyle.btnCriarConta,
                    pressed && cadClienteStyle.btnCriarContaPressed,
                  ]}
                  onPress={() => router.navigate("/")}
                >
                  <Text style={cadClienteStyle.txtCriarConta}>Já tenho conta</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
