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

import esqueciSenhaStyle from "@/styles/esqueciSenhaStyle";
import globalStyle from "@/styles/globalStyle";
import LinkSenhaModal from "@/components/linkSenhaModal";

export default function EsqueciSenhaScreen() {
  const [modalLinkSenha, setModalLinkSenha] = useState(false);

  return (
    <View style={globalStyle.container}>
      <ImageBackground
        source={require("@/assets/images/img/00_fundo.png")}
        style={globalStyle.background}
        resizeMode="cover"
      >
        <SafeAreaView style={globalStyle.areaConteudo}>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={esqueciSenhaStyle.conteudo}>
              <Image
                source={require("@/assets/images/img/logo.png")}
                style={globalStyle.logoMaior}
              />
              <Text style={esqueciSenhaStyle.titulo}>
                Esqueci minha senha
              </Text>
              <Text style={esqueciSenhaStyle.subtitulo}>
                Informe seu e-mail para receber {'\n'} o link de redefinição
              </Text>

              <View style={esqueciSenhaStyle.form}>
                <View style={esqueciSenhaStyle.input}>
                  <Image
                    source={require("@/assets/images/img/email.png")}
                    style={esqueciSenhaStyle.icone}
                  />

                  <TextInput
                    placeholder="E-mail"
                    placeholderTextColor="#888888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={esqueciSenhaStyle.TextInput}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    esqueciSenhaStyle.btnEnviar,
                    pressed && esqueciSenhaStyle.btnEnviarPressed,
                  ]}
                  onPress={() => setModalLinkSenha(true)}
                >
                  <Text style={esqueciSenhaStyle.txtEnviar}>Enviar link</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    esqueciSenhaStyle.btnVoltar,
                    pressed && esqueciSenhaStyle.btnVoltarPressed,
                  ]}
                  onPress={() => router.navigate("/")}
                >
                  <Text style={esqueciSenhaStyle.txtVoltar}>
                    Voltar ao login
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <LinkSenhaModal
            visible={modalLinkSenha}
            onClose={() => {
                router.navigate("/");
                setModalLinkSenha(false);
            }}
          />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
