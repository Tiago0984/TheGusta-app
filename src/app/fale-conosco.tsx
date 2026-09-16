import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import faleConoscoStyle from "@/styles/faleConoscoStyle";
import { cores } from "@/styles/variaveis";
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

export default function FaleConoscoScreen() {
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

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
            <View style={faleConoscoStyle.conteudo}>
              <View style={faleConoscoStyle.header}>
                <View style={faleConoscoStyle.ladoEsquerdo}>
                  <Text style={faleConoscoStyle.titulo}>Fale conosco</Text>
                  <Text style={faleConoscoStyle.subtitulo}>
                    Envie sua mensagem para a The Gusta
                  </Text>
                </View>
                <Image
                  style={faleConoscoStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={faleConoscoStyle.main}>
                <View style={faleConoscoStyle.cardFormulario}>
                  <View style={faleConoscoStyle.campoAssunto}>
                    <Image
                      style={faleConoscoStyle.iconAssunto}
                      source={require("@/assets/images/img/assunto.png")}
                    />
                    <TextInput
                      style={faleConoscoStyle.inputAssunto}
                      placeholder="Assunto"
                      placeholderTextColor={cores.cinza}
                      value={assunto}
                      onChangeText={setAssunto}
                    />
                  </View>

                  <View style={faleConoscoStyle.campoMensagem}>
                    <Image
                      style={faleConoscoStyle.iconMensagem}
                      source={require("@/assets/images/img/mensagem.png")}
                    />
                    <TextInput
                      style={faleConoscoStyle.inputMensagem}
                      placeholder="Mensagem"
                      placeholderTextColor={cores.cinza}
                      value={mensagem}
                      onChangeText={setMensagem}
                      multiline
                    />
                  </View>

                  <Pressable style={faleConoscoStyle.btnEnviar}>
                    <Text style={faleConoscoStyle.txtEnviar}>
                      Enviar mensagem
                    </Text>
                  </Pressable>
                </View>

                <View style={faleConoscoStyle.cardAtendimento}>
                  <Text style={faleConoscoStyle.tituloAtendimento}>
                    Atendimento
                  </Text>
                  <View style={faleConoscoStyle.conteudoAtendimento}>
                    <View style={faleConoscoStyle.colunaTextosAtendimento}>
                      <View style={faleConoscoStyle.grupoAtendimento}>
                        <Text style={faleConoscoStyle.labelAtendimento}>
                          WhatsApp
                        </Text>
                        <Text style={faleConoscoStyle.valorAtendimento}>
                          (11) 99999-9999
                        </Text>
                      </View>

                      <View style={faleConoscoStyle.grupoAtendimento}>
                        <Text style={faleConoscoStyle.labelAtendimento}>
                          E-mail
                        </Text>
                        <Text style={faleConoscoStyle.valorAtendimento}>
                          contato@thegusta.com.br
                        </Text>
                      </View>

                      <View style={faleConoscoStyle.grupoAtendimento}>
                        <Text style={faleConoscoStyle.labelAtendimento}>
                          Horário de atendimento
                        </Text>
                        <Text style={faleConoscoStyle.valorAtendimento}>
                          Seg à Sáb. das 9h às 18h
                        </Text>
                      </View>
                    </View>
                    <Image
                      style={faleConoscoStyle.imgAtendimento}
                      source={require("@/assets/images/img/fale_conosco.png")}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
