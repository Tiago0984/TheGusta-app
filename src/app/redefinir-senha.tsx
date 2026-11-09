import { router, useLocalSearchParams } from "expo-router";
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

import redefinirSenha from "@/styles/redefinirSenhaStyle";
import globalStyle from "@/styles/globalStyle";
import { redefinirSenha as redefinirSenhaCliente } from "@/services/auth";

export default function RedefinirSenhaScreen() {
  const [verSenha, setVerSenha] = useState(false);
  const [verConfirmarSenha, setVerConfirmarSenha] = useState(false);
  const { email } = useLocalSearchParams<{ email?: string | string[] }>();
  const emailRecuperacao = typeof email === "string" ? email.trim() : "";
  const [codigo, setCodigo] = useState(["", "", "", ""]);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const camposCodigo = useRef<(TextInput | null)[]>([]);
  const envioPendente = useRef(false);

  function alterarDigito(texto: string, indice: number) {
    const numeros = texto.replace(/\D/g, "");
    const digitos = indice === 3 ? numeros.slice(-1) : numeros.slice(0, 4 - indice);
    setCodigo((atual) => atual.map((digito, i) => {
      if (!digitos) return i === indice ? "" : digito;
      return i >= indice && i < indice + digitos.length ? digitos[i - indice] : digito;
    }));
    if (digitos) camposCodigo.current[Math.min(indice + digitos.length, 3)]?.focus();
  }

  function voltarDigito(indice: number, tecla: string) {
    if (tecla === "Backspace" && !codigo[indice] && indice > 0) {
      camposCodigo.current[indice - 1]?.focus();
    }
  }

  async function salvarNovaSenha() {
    if (envioPendente.current) return;
    envioPendente.current = true;
    setCarregando(true);
    setMensagem("");
    try {
      await redefinirSenhaCliente({
        email: emailRecuperacao,
        codigo: codigo.join(""),
        novaSenha,
        confirmarSenha,
      });
      router.replace("/");
    } catch (erro) {
      setMensagem(erro instanceof Error ? erro.message : "Não foi possível redefinir a senha. Tente novamente.");
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
            <View style={redefinirSenha.conteudo}>
              <Image
                source={require("@/assets/images/img/logo.png")}
                style={globalStyle.logoMaior}
              />
              <Text style={redefinirSenha.titulo}>Redefinir senha</Text>
              <Text style={redefinirSenha.subtitulo}>
                Informe o código recebido por e-mail {"\n"} e crie sua nova senha
              </Text>

              <View style={redefinirSenha.form}>
                <Text style={redefinirSenha.subtitulo}>Código de verificação</Text>
                <View style={redefinirSenha.linhaCodigo}>
                  {codigo.map((digito, indice) => (
                    <TextInput
                      key={indice}
                      ref={(campo) => { camposCodigo.current[indice] = campo; }}
                      style={redefinirSenha.campoCodigo}
                      value={digito}
                      onChangeText={(texto) => alterarDigito(texto, indice)}
                      onKeyPress={({ nativeEvent }) => voltarDigito(indice, nativeEvent.key)}
                      keyboardType="number-pad"
                      maxLength={4}
                      selectTextOnFocus
                      textAlign="center"
                      editable={!carregando}
                      autoComplete={indice === 0 ? "one-time-code" : "off"}
                      accessibilityLabel={`Dígito ${indice + 1} do código`}
                    />
                  ))}
                </View>
                <View style={redefinirSenha.input}>
                  <Image
                    source={require("@/assets/images/img/senha.png")}
                    style={redefinirSenha.icone}
                  />
                  <TextInput
                    placeholder="Nova senha"
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    editable={!carregando}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
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
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    editable={!carregando}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    onSubmitEditing={salvarNovaSenha}
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

                {mensagem || !emailRecuperacao ? (
                  <Text style={redefinirSenha.erroSenha} accessibilityRole="alert">
                    {mensagem || "E-mail não informado. Solicite um novo código."}
                  </Text>
                ) : null}

                <Pressable
                  style={({ pressed }) => [
                    redefinirSenha.btnSalvar,
                    pressed && redefinirSenha.btnSalvarPressed,
                  ]}
                  onPress={salvarNovaSenha}
                  disabled={carregando || !emailRecuperacao}
                  accessibilityRole="button"
                  aria-disabled={carregando || !emailRecuperacao}
                  aria-busy={carregando}
                >
                  <Text style={redefinirSenha.txtSalvar}>
                    {carregando ? "Salvando..." : "Salvar nova senha"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.replace("/esqueci-senha")}
                  disabled={carregando}
                  style={redefinirSenha.btnNovoCodigo}
                  accessibilityRole="button"
                >
                  <Text style={redefinirSenha.txtNovoCodigo}>Solicitar novo código</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    redefinirSenha.btnVoltar,
                    pressed && redefinirSenha.btnVoltarPressed,
                  ]}
                  onPress={() => router.navigate("/")}
                  disabled={carregando}
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
