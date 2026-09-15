import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import enderecosStyle from "@/styles/enderecosStyle";
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

export default function EnderecosScreen() {
  const [enderecoAtivo, setEnderecoAtivo] = useState<
    "casa" | "trabalho" | "academia"
  >("casa");

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
            <View style={enderecosStyle.conteudo}>
              <View style={enderecosStyle.header}>
                <View style={enderecosStyle.ladoEsquerdo}>
                  <Text style={enderecosStyle.titulo}>Endereços</Text>
                  <Text style={enderecosStyle.subtitulo}>
                    Gerencie seus endereços de entrega
                  </Text>
                </View>
                <Image
                  style={enderecosStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={enderecosStyle.main}>
                <View style={enderecosStyle.listaEnderecos}>
                <View style={enderecosStyle.cardEndereco}>
                  <View style={enderecosStyle.linhaTopo}>
                    <View style={enderecosStyle.tituloLinha}>
                      <View style={enderecosStyle.iconEndereco}>
                        <Image
                          style={enderecosStyle.imgIconEndereco}
                          source={require("@/assets/images/img/home.png")}
                        />
                      </View>
                      <Text style={enderecosStyle.tituloEndereco}>Casa</Text>
                    </View>
                    <Pressable onPress={() => setEnderecoAtivo("casa")}>
                      <Text style={enderecosStyle.txtFavorito}>
                        {enderecoAtivo === "casa" ? "★" : "☆"}
                      </Text>
                    </Pressable>
                  </View>

                  <View style={enderecosStyle.linhaConteudo}>
                    <View style={enderecosStyle.enderecoDetalhes}>
                      <Text style={enderecosStyle.linhaEndereco}>
                        Avenida Marechal Tito, 1500
                      </Text>
                      <Text style={enderecosStyle.linhaEndereco}>
                        São Miguel Paulista
                      </Text>
                      <Text style={enderecosStyle.linhaEndereco}>
                        São Paulo - SP
                      </Text>
                      <Text style={enderecosStyle.linhaEndereco}>
                        CEP - 00000-000
                      </Text>
                    </View>

                    <View style={enderecosStyle.areaBadge}>
                      {enderecoAtivo === "casa" ? (
                        <View style={enderecosStyle.badgeAtivo}>
                          <Text style={enderecosStyle.txtBadgeAtivo}>
                            Endereço ativo
                          </Text>
                        </View>
                      ) : (
                        <Pressable
                          style={enderecosStyle.badgeUsar}
                          onPress={() => setEnderecoAtivo("casa")}
                        >
                          <Text style={enderecosStyle.txtBadgeUsar}>
                            Usar este endereço
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>

                  <View style={enderecosStyle.divisorEndereco} />

                  <View style={enderecosStyle.linhaBotoes}>
                    <Pressable
                      style={enderecosStyle.btnEditar}
                      onPress={() => router.push("/editar-endereco")}
                    >
                      <Text style={enderecosStyle.txtEditar}>Editar</Text>
                    </Pressable>
                    <Pressable style={enderecosStyle.btnExcluir}>
                      <Text style={enderecosStyle.txtExcluir}>Excluir</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={enderecosStyle.cardEndereco}>
                  <View style={enderecosStyle.linhaTopo}>
                    <View style={enderecosStyle.tituloLinha}>
                      <View style={enderecosStyle.iconEndereco}>
                        <Image
                          style={enderecosStyle.imgIconEndereco}
                          source={require("@/assets/images/img/trabalho.png")}
                        />
                      </View>
                      <Text style={enderecosStyle.tituloEndereco}>
                        Trabalho
                      </Text>
                    </View>
                    <Pressable onPress={() => setEnderecoAtivo("trabalho")}>
                      <Text style={enderecosStyle.txtFavorito}>
                        {enderecoAtivo === "trabalho" ? "★" : "☆"}
                      </Text>
                    </Pressable>
                  </View>

                  <View style={enderecosStyle.linhaConteudo}>
                    <View style={enderecosStyle.enderecoDetalhes}>
                      <Text style={enderecosStyle.linhaEndereco}>
                        Avenida Marechal Tito, 1500
                      </Text>
                      <Text style={enderecosStyle.linhaEndereco}>
                        São Miguel Paulista
                      </Text>
                      <Text style={enderecosStyle.linhaEndereco}>
                        São Paulo - SP
                      </Text>
                      <Text style={enderecosStyle.linhaEndereco}>
                        CEP - 00000-000
                      </Text>
                    </View>

                    <View style={enderecosStyle.areaBadge}>
                      {enderecoAtivo === "trabalho" ? (
                        <View style={enderecosStyle.badgeAtivo}>
                          <Text style={enderecosStyle.txtBadgeAtivo}>
                            Endereço ativo
                          </Text>
                        </View>
                      ) : (
                        <Pressable
                          style={enderecosStyle.badgeUsar}
                          onPress={() => setEnderecoAtivo("trabalho")}
                        >
                          <Text style={enderecosStyle.txtBadgeUsar}>
                            Usar este endereço
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>

                  <View style={enderecosStyle.divisorEndereco} />

                  <View style={enderecosStyle.linhaBotoes}>
                    <Pressable
                      style={enderecosStyle.btnEditar}
                      onPress={() => router.push("/editar-endereco")}
                    >
                      <Text style={enderecosStyle.txtEditar}>Editar</Text>
                    </Pressable>
                    <Pressable style={enderecosStyle.btnExcluir}>
                      <Text style={enderecosStyle.txtExcluir}>Excluir</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={enderecosStyle.cardEndereco}>
                  <View style={enderecosStyle.linhaTopo}>
                    <View style={enderecosStyle.tituloLinha}>
                      <View style={enderecosStyle.iconEndereco}>
                        <Image
                          style={enderecosStyle.imgIconEndereco}
                          source={require("@/assets/images/img/academia.png")}
                        />
                      </View>
                      <Text style={enderecosStyle.tituloEndereco}>
                        Academia
                      </Text>
                    </View>
                    <Pressable onPress={() => setEnderecoAtivo("academia")}>
                      <Text style={enderecosStyle.txtFavorito}>
                        {enderecoAtivo === "academia" ? "★" : "☆"}
                      </Text>
                    </Pressable>
                  </View>

                  <View style={enderecosStyle.linhaConteudo}>
                    <View style={enderecosStyle.enderecoDetalhes}>
                      <Text style={enderecosStyle.linhaEndereco}>
                        Avenida Marechal Tito, 1500
                      </Text>
                      <Text style={enderecosStyle.linhaEndereco}>
                        São Miguel Paulista
                      </Text>
                      <Text style={enderecosStyle.linhaEndereco}>
                        São Paulo - SP
                      </Text>
                      <Text style={enderecosStyle.linhaEndereco}>
                        CEP - 00000-000
                      </Text>
                    </View>

                    <View style={enderecosStyle.areaBadge}>
                      {enderecoAtivo === "academia" ? (
                        <View style={enderecosStyle.badgeAtivo}>
                          <Text style={enderecosStyle.txtBadgeAtivo}>
                            Endereço ativo
                          </Text>
                        </View>
                      ) : (
                        <Pressable
                          style={enderecosStyle.badgeUsar}
                          onPress={() => setEnderecoAtivo("academia")}
                        >
                          <Text style={enderecosStyle.txtBadgeUsar}>
                            Usar este endereço
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>

                  <View style={enderecosStyle.divisorEndereco} />

                  <View style={enderecosStyle.linhaBotoes}>
                    <Pressable
                      style={enderecosStyle.btnEditar}
                      onPress={() => router.push("/editar-endereco")}
                    >
                      <Text style={enderecosStyle.txtEditar}>Editar</Text>
                    </Pressable>
                    <Pressable style={enderecosStyle.btnExcluir}>
                      <Text style={enderecosStyle.txtExcluir}>Excluir</Text>
                    </Pressable>
                  </View>
                </View>
                </View>

                <Pressable style={enderecosStyle.btnAdicionar}>
                  <Text style={enderecosStyle.txtAdicionar}>
                    + Adicionar novo endereço
                  </Text>
                </Pressable>

                <Pressable style={enderecosStyle.btnCancelar}>
                  <Text style={enderecosStyle.txtCancelar}>Cancelar</Text>
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
