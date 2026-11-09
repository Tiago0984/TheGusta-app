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

import cadClienteStyle from "@/styles/cadClienteStyle";
import globalStyle from "@/styles/globalStyle";

import TermosUsoModal from "@/components/termosUsoModal";
import { cadastrarCliente } from "@/services/auth";

export default function CadClienteScreen() {
  const [verSenha, setVerSenha] = useState(false);
  const [verConfirmarSenha, setVerConfirmarSenha] = useState(false);
  const [aceitarTermos, setAceitarTermos] = useState(false);

  const [modalTermosUso, setModalTermosUso] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const envioPendente = useRef(false);

  async function cadastrar() {
    if (envioPendente.current) return;
    envioPendente.current = true;
    setCarregando(true);
    setMensagem("");
    try {
      await cadastrarCliente({ nome, email, telefone, senha, confirmarSenha, aceitarTermos });
      router.replace("/home");
    } catch (erro) {
      setMensagem(erro instanceof Error ? erro.message : "Não foi possível criar sua conta. Tente novamente.");
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
            <View style={cadClienteStyle.conteudo}>
              <Image
                source={require("@/assets/images/img/logo.png")}
                style={globalStyle.logoMaior}
              />
              <Text style={cadClienteStyle.titulo}>Criar Conta</Text>
              <Text style={cadClienteStyle.subtitulo}>
                cadastre-se para fazer seus pedidos
              </Text>

              {/* Formulário de cadastro */}
              <View style={cadClienteStyle.form}>
                <View style={cadClienteStyle.input}>
                  <Image
                    source={require("@/assets/images/img/user.png")}
                    style={cadClienteStyle.icone}
                  />

                  <TextInput
                    placeholder="Nome completo"
                    value={nome}
                    onChangeText={setNome}
                    editable={!carregando}
                    autoComplete="name"
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
                    value={email}
                    onChangeText={setEmail}
                    editable={!carregando}
                    autoComplete="email"
                    autoCorrect={false}
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
                    placeholder="Telefone com DDD"
                    value={telefone}
                    onChangeText={setTelefone}
                    editable={!carregando}
                    autoComplete="tel"
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
                    value={senha}
                    onChangeText={setSenha}
                    editable={!carregando}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
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
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    editable={!carregando}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    onSubmitEditing={cadastrar}
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
                    onPress={() => setAceitarTermos((current) => !current)}
                    disabled={carregando}
                    accessibilityRole="checkbox"
                    accessibilityLabel="Aceitar os termos de uso"
                    aria-checked={aceitarTermos}
                    aria-disabled={carregando}
                  >
                    <View
                      style={[
                        cadClienteStyle.checkTermos,
                        aceitarTermos && cadClienteStyle.checkTermosAtivo,
                      ]}
                    >
                      {aceitarTermos && (
                        <Text style={cadClienteStyle.checkOK}>✓</Text>
                      )}
                    </View>
                  </Pressable>
                  <Text
                    style={[
                      cadClienteStyle.txtTermos,
                      aceitarTermos && cadClienteStyle.termoAceito,
                    ]}
                  >
                    Aceito os{" "}
                  </Text>
                  <Pressable onPress={() => setModalTermosUso(true)} disabled={carregando}>
                    <Text style={cadClienteStyle.linkTermos}>
                      Termos de uso
                    </Text>
                  </Pressable>
                </View>

                {mensagem ? (
                  <Text style={cadClienteStyle.erroCadastro} accessibilityRole="alert">{mensagem}</Text>
                ) : null}

                <Pressable
                  onPress={cadastrar}
                  disabled={carregando}
                  accessibilityRole="button"
                  aria-disabled={carregando}
                  aria-busy={carregando}
                  style={({ pressed }) => [
                    cadClienteStyle.btnEntrar,
                    pressed && cadClienteStyle.btnEntrarPressed,
                  ]}
                >
                  <Text style={cadClienteStyle.txtEntrar}>{carregando ? "Cadastrando..." : "Criar Conta"}</Text>
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
                  disabled={carregando}
                >
                  <Text style={cadClienteStyle.txtCriarConta}>Já tenho conta</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <TermosUsoModal
            visible={modalTermosUso}
            onClose={() => setModalTermosUso(false)}
          />

        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
