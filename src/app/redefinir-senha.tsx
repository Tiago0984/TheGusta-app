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

import redefinirSenha from "@/styles/redefinirSenhaStyle";
import globalStyle from "@/styles/globalStyle";

export default function RedefinirSenhaScreen() {
  const [verSenha, setVerSenha] = useState(false);
  const [verConfirmarSenha, setVerConfirmarSenha] = useState(false);

  return (
    <View style={globalStyle.container}>
      <ImageBackground
        source={require("@/assets/images/img/00_fundo.png")}
        style={globalStyle.background}
        resizeMode="cover"
      >
        <SafeAreaView style={globalStyle.areaConteudo}>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={redefinirSenha.conteudo}>
              <Image
                source={require("@/assets/images/img/logo.png")}
                style={globalStyle.logoMaior}
              />
              <Text style={redefinirSenha.titulo}>Redefinir senha</Text>
              <Text style={redefinirSenha.subtitulo}>
                Crie uma nova senha para acessar {"\n"} sua conta
              </Text>

              <View style={redefinirSenha.form}>
                <View style={redefinirSenha.input}>
                  <Image
                    source={require("@/assets/images/img/senha.png")}
                    style={redefinirSenha.icone}
                  />
                  <TextInput
                    placeholder="Senha"
                    placeholderTextColor="#888888"
                    style={redefinirSenha.TextInput}
                    secureTextEntry={!verSenha}
                  />

                  <Pressable
                    style={redefinirSenha.btnMostrarSenha}
                    onPress={() => setVerSenha((current) => !current)}
                  >
                    <Image
                      source={
                        verSenha
                          ? require("@/assets/images/img/esconder.png")
                          : require("@/assets/images/img/mostrar.png")
                      }
                      style={redefinirSenha.mostrarSenha}
                    />
                  </Pressable>
                </View>

                <View style={redefinirSenha.input}>
                  <Image
                    source={require("@/assets/images/img/senha.png")}
                    style={redefinirSenha.icone}
                  />
                  <TextInput
                    placeholder="Confirmar Senha"
                    placeholderTextColor="#888888"
                    style={redefinirSenha.TextInput}
                    secureTextEntry={!verConfirmarSenha}
                  />

                  <Pressable
                    style={redefinirSenha.btnMostrarSenha}
                    onPress={() => setVerConfirmarSenha((current) => !current)}
                  >
                    <Image
                      source={
                        verConfirmarSenha
                          ? require("@/assets/images/img/esconder.png")
                          : require("@/assets/images/img/mostrar.png")
                      }
                      style={redefinirSenha.mostrarSenha}
                    />
                  </Pressable>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    redefinirSenha.btnSalvar,
                    pressed && redefinirSenha.btnSalvarPressed,
                  ]}
                  onPress={() => router.navigate("/")}
                >
                  <Text style={redefinirSenha.txtSalvar}>
                    Salvar nova senha
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    redefinirSenha.btnVoltar,
                    pressed && redefinirSenha.btnVoltarPressed,
                  ]}
                  onPress={() => router.navigate("/")}
                >
                  <Text style={redefinirSenha.txtVoltar}>
                    Voltar ao login
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
