import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import configuracaoStyle from "@/styles/configuracaoStyle";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfiguracaoScreen() {
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

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
                router.replace("/home");
              }
            }}
          >
            <Image
              style={globalStyle.imgVoltar}
              source={require("@/assets/images/img/voltar.png")}
            />
          </Pressable>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={configuracaoStyle.conteudo}>
              <View style={configuracaoStyle.header}>
                <View style={configuracaoStyle.ladoEsquerdo}>
                  <Text style={configuracaoStyle.titulo}>Configurações</Text>
                  <Text style={configuracaoStyle.subtitulo}>
                    Gerencie seu perfil, endereços, entre outros
                  </Text>
                </View>
                <Image
                  style={configuracaoStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={configuracaoStyle.main}>
                <View style={configuracaoStyle.cardSaudacao}>
                  <View style={configuracaoStyle.bordaPerfil}>
                    <Image
                      style={configuracaoStyle.imgPerfil}
                      source={require("@/assets/images/img/user.png")}
                    />
                  </View>
                  <View style={configuracaoStyle.textoSaudacao}>
                    <Text style={configuracaoStyle.tituloSaudacao}>
                      Olá, Cliente
                    </Text>
                    <Text style={configuracaoStyle.subtituloSaudacao}>
                      Acesse e organize sua experiência no app.
                    </Text>
                  </View>
                </View>

                <Text style={configuracaoStyle.tituloSecao}>Minha conta</Text>

                <View style={configuracaoStyle.cardConta}>
                  <Pressable
                    style={configuracaoStyle.itemConta}
                    onPress={() => router.push("/editar-perfil")}
                  >
                    <View style={configuracaoStyle.itemContaEsquerdo}>
                      <Image
                        style={configuracaoStyle.iconConta}
                        source={require("@/assets/images/img/perfil.png")}
                      />
                      <View style={configuracaoStyle.itemContaTextos}>
                        <Text style={configuracaoStyle.itemContaTitulo}>
                          Perfil
                        </Text>
                        <Text style={configuracaoStyle.itemContaSubtitulo}>
                          Dados pessoais, Telefone e e-mail
                        </Text>
                      </View>
                    </View>
                    <Text style={configuracaoStyle.itemContaSeta}>{">"}</Text>
                  </Pressable>

                  <View style={configuracaoStyle.itemContaDivisor} />

                  <Pressable
                    style={configuracaoStyle.itemConta}
                    onPress={() => router.push("/enderecos")}
                  >
                    <View style={configuracaoStyle.itemContaEsquerdo}>
                      <Image
                        style={configuracaoStyle.iconConta}
                        source={require("@/assets/images/img/local.png")}
                      />
                      <View style={configuracaoStyle.itemContaTextos}>
                        <Text style={configuracaoStyle.itemContaTitulo}>
                          Endereços
                        </Text>
                        <Text style={configuracaoStyle.itemContaSubtitulo}>
                          Gerencie seus endereços de entrega
                        </Text>
                      </View>
                    </View>
                    <Text style={configuracaoStyle.itemContaSeta}>{">"}</Text>
                  </Pressable>

                  <View style={configuracaoStyle.itemContaDivisor} />

                  <Pressable
                    style={configuracaoStyle.itemConta}
                    onPress={() => router.push("/alterar-senha")}
                  >
                    <View style={configuracaoStyle.itemContaEsquerdo}>
                      <Image
                        style={configuracaoStyle.iconConta}
                        source={require("@/assets/images/img/senha.png")}
                      />
                      <View style={configuracaoStyle.itemContaTextos}>
                        <Text style={configuracaoStyle.itemContaTitulo}>
                          Alterar senha
                        </Text>
                        <Text style={configuracaoStyle.itemContaSubtitulo}>
                          Atualize sua senha com segurança
                        </Text>
                      </View>
                    </View>
                    <Text style={configuracaoStyle.itemContaSeta}>{">"}</Text>
                  </Pressable>
                </View>

                <Text style={configuracaoStyle.tituloSecao}>App</Text>

                <View style={configuracaoStyle.cardConta}>
                  <View style={configuracaoStyle.itemConta}>
                    <View style={configuracaoStyle.itemContaEsquerdo}>
                      <Image
                        style={configuracaoStyle.iconConta}
                        source={require("@/assets/images/img/download.png")}
                      />
                      <View style={configuracaoStyle.itemContaTextos}>
                        <Text style={configuracaoStyle.itemContaTitulo}>
                          Instalar aplicativo
                        </Text>
                        <Text style={configuracaoStyle.itemContaSubtitulo}>
                          Adicione o app à sua tela inicial
                        </Text>
                      </View>
                    </View>
                    <Pressable style={configuracaoStyle.btnInstalar}>
                      <Text style={configuracaoStyle.txtInstalar}>
                        Instalar
                      </Text>
                    </Pressable>
                  </View>

                  <View style={configuracaoStyle.itemContaDivisor} />

                  <View style={configuracaoStyle.itemConta}>
                    <View style={configuracaoStyle.itemContaEsquerdo}>
                      <Image
                        style={configuracaoStyle.iconConta}
                        source={require("@/assets/images/img/notificacao.png")}
                      />
                      <View style={configuracaoStyle.itemContaTextos}>
                        <Text style={configuracaoStyle.itemContaTitulo}>
                          Ativar notificações
                        </Text>
                        <Text style={configuracaoStyle.itemContaSubtitulo}>
                          Receba avisos sobre pedidos e promoções
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={() =>
                        setNotificacoesAtivas((atual) => !atual)
                      }
                    >
                      <Image
                        style={configuracaoStyle.imgSwitch}
                        source={
                          notificacoesAtivas
                            ? require("@/assets/images/img/ativo.png")
                            : require("@/assets/images/img/inativo.png")
                        }
                      />
                    </Pressable>
                  </View>
                </View>

                <Text style={configuracaoStyle.tituloSecao}>
                  Relacionamento
                </Text>

                <View style={configuracaoStyle.cardConta}>
                  <Pressable style={configuracaoStyle.itemConta}>
                    <View style={configuracaoStyle.itemContaEsquerdo}>
                      <Image
                        style={configuracaoStyle.iconConta}
                        source={require("@/assets/images/img/depoimento.png")}
                      />
                      <View style={configuracaoStyle.itemContaTextos}>
                        <Text style={configuracaoStyle.itemContaTitulo}>
                          Depoimentos
                        </Text>
                        <Text style={configuracaoStyle.itemContaSubtitulo}>
                          Veja ou deixe sua avaliação
                        </Text>
                      </View>
                    </View>
                    <Text style={configuracaoStyle.itemContaSeta}>{">"}</Text>
                  </Pressable>

                  <View style={configuracaoStyle.itemContaDivisor} />

                  <Pressable style={configuracaoStyle.itemConta}>
                    <View style={configuracaoStyle.itemContaEsquerdo}>
                      <Image
                        style={configuracaoStyle.iconConta}
                        source={require("@/assets/images/img/fale_conosco.png")}
                      />
                      <View style={configuracaoStyle.itemContaTextos}>
                        <Text style={configuracaoStyle.itemContaTitulo}>
                          Fale conosco
                        </Text>
                        <Text style={configuracaoStyle.itemContaSubtitulo}>
                          Tire suas dúvidas e envie sugestões
                        </Text>
                      </View>
                    </View>
                    <Text style={configuracaoStyle.itemContaSeta}>{">"}</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={configuracaoStyle.btnSair}
                  onPress={() => router.replace("/")}
                >
                  <Text style={configuracaoStyle.txtSair}>Sair da conta</Text>
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
