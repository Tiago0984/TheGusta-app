import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import depoimentosStyle from "@/styles/depoimentosStyle";
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

export default function DepoimentosScreen() {
  const [avaliacao, setAvaliacao] = useState(3);
  const [comentario, setComentario] = useState("");

  const [avaliacoes, setAvaliacoes] = useState([
    {
      id: 1,
      nota: 4,
      texto:
        "Produtos deliciosos e saudáveis! O sabor é incrível e a entrega foi super rápida. Já virei fã da Gusta",
    },
    {
      id: 2,
      nota: 4,
      texto:
        "Produtos deliciosos e saudáveis! O sabor é incrível e a entrega foi super rápida. Já virei fã da Gusta",
    },
    {
      id: 3,
      nota: 4,
      texto:
        "Produtos deliciosos e saudáveis! O sabor é incrível e a entrega foi super rápida. Já virei fã da Gusta",
    },
  ]);

  function enviarDepoimento() {
    if (!comentario.trim()) {
      return;
    }

    setAvaliacoes((atual) => [
      { id: Date.now(), nota: avaliacao, texto: comentario.trim() },
      ...atual,
    ]);
    setComentario("");
    setAvaliacao(3);
  }

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
            <View style={depoimentosStyle.conteudo}>
              <View style={depoimentosStyle.header}>
                <View style={depoimentosStyle.ladoEsquerdo}>
                  <Text style={depoimentosStyle.titulo}>Depoimentos</Text>
                  <Text style={depoimentosStyle.subtitulo}>
                    Compartilhe sua experiência com a The Gusta
                  </Text>
                </View>
                <Image
                  style={depoimentosStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={depoimentosStyle.main}>
                <View style={depoimentosStyle.cardFormulario}>
                  <View style={depoimentosStyle.cardTituloForm}>
                    <Image
                      style={depoimentosStyle.iconFormulario}
                      source={require("@/assets/images/img/depoimento.png")}
                    />
                    <Text style={depoimentosStyle.txtCardTitulo}>
                      Deixe seu depoimento
                    </Text>
                  </View>

                  <Text style={depoimentosStyle.campoLabel}>
                    Sua avaliação
                  </Text>
                  <View style={depoimentosStyle.estrelasLinha}>
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <Pressable
                        key={valor}
                        onPress={() => setAvaliacao(valor)}
                      >
                        <Text style={depoimentosStyle.estrela}>
                          {valor <= avaliacao ? "★" : "☆"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={depoimentosStyle.campoLabel}>
                    Seu depoimento
                  </Text>
                  <TextInput
                    style={depoimentosStyle.inputDepoimento}
                    placeholder="Conte-nos como foi sua experiencia, sabor, atendimento ou entrega..."
                    placeholderTextColor={cores.cinza}
                    value={comentario}
                    onChangeText={setComentario}
                    multiline
                  />

                  <Pressable
                    style={depoimentosStyle.btnEnviar}
                    onPress={enviarDepoimento}
                  >
                    <Text style={depoimentosStyle.txtEnviar}>
                      Enviar depoimento
                    </Text>
                  </Pressable>
                </View>

                <Text style={depoimentosStyle.tituloSecao}>
                  Suas avaliações
                </Text>

                {avaliacoes.map((item) => (
                  <View style={depoimentosStyle.cardAvaliacao} key={item.id}>
                    <View style={depoimentosStyle.estrelasAvaliacao}>
                      {[1, 2, 3, 4, 5].map((valor) => (
                        <Text
                          style={depoimentosStyle.estrelaAvaliacao}
                          key={valor}
                        >
                          {valor <= item.nota ? "★" : "☆"}
                        </Text>
                      ))}
                    </View>
                    <Text style={depoimentosStyle.txtAvaliacao}>
                      {item.texto}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
