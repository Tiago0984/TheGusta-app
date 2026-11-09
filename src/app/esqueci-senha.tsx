import { router } from "expo-router";
import { useRef, useState } from "react";

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
import { solicitarCodigo } from "@/services/auth";

export default function EsqueciSenhaScreen() {
  const [modalCodigo, setModalCodigo] = useState(false);
  const [email, setEmail] = useState("");
  const [emailEnviado, setEmailEnviado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const envioPendente = useRef(false);

  async function enviarCodigo() {
    if (envioPendente.current || modalCodigo) return;
    envioPendente.current = true;
    setCarregando(true);
    setMensagem("");
    try {
      const destino = email.trim();
      await solicitarCodigo(destino);
      setEmailEnviado(destino);
      setModalCodigo(true);
    } catch (erro) {
      setMensagem(erro instanceof Error ? erro.message : "Não foi possível solicitar o código. Tente novamente.");
    } finally {
      envioPendente.current = false;
      setCarregando(false);
    }
  }

  return (
    <View style={globalStyle.container}>
      <ImageBackground
        source={require("@/assets/images/img/00_fundo.png")}
        style={globalStyle.background}
        resizeMode="cover"
      >
        <SafeAreaView style={globalStyle.areaConteudo}>
          <ScrollView style={globalStyle.scrollConteudo} keyboardShouldPersistTaps="handled">
            <View style={esqueciSenhaStyle.conteudo}>
              <Image
                source={require("@/assets/images/img/logo.png")}
                style={globalStyle.logoMaior}
              />
              <Text style={esqueciSenhaStyle.titulo}>
                Esqueci minha senha
              </Text>
              <Text style={esqueciSenhaStyle.subtitulo}>
                Informe seu e-mail para receber {'\n'} o código de verificação
              </Text>

              <View style={esqueciSenhaStyle.form}>
                <View style={esqueciSenhaStyle.input}>
                  <Image
                    source={require("@/assets/images/img/email.png")}
                    style={esqueciSenhaStyle.icone}
                  />

                  <TextInput
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    editable={!carregando && !modalCodigo}
                    autoComplete="email"
                    autoCorrect={false}
                    onSubmitEditing={enviarCodigo}
                    placeholderTextColor="#888888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={esqueciSenhaStyle.TextInput}
                  />
                </View>

                {mensagem ? (
                  <Text style={esqueciSenhaStyle.erroSolicitacao} accessibilityRole="alert">{mensagem}</Text>
                ) : null}

                <Pressable
                  style={({ pressed }) => [
                    esqueciSenhaStyle.btnEnviar,
                    pressed && esqueciSenhaStyle.btnEnviarPressed,
                  ]}
                  onPress={enviarCodigo}
                  disabled={carregando || modalCodigo}
                  accessibilityRole="button"
                  aria-disabled={carregando || modalCodigo}
                  aria-busy={carregando}
                >
                  <Text style={esqueciSenhaStyle.txtEnviar}>{carregando ? "Enviando..." : "Enviar código"}</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    esqueciSenhaStyle.btnVoltar,
                    pressed && esqueciSenhaStyle.btnVoltarPressed,
                  ]}
                  onPress={() => router.navigate("/")}
                  disabled={carregando}
                >
                  <Text style={esqueciSenhaStyle.txtVoltar}>
                    Voltar ao login
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <LinkSenhaModal
            visible={modalCodigo}
            onClose={() => {
              setModalCodigo(false);
              router.push({ pathname: "/redefinir-senha", params: { email: emailEnviado } });
            }}
          />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
