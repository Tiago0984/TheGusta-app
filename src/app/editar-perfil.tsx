import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import editarPerfilStyle from "@/styles/editarPerfilStyle";
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
import { cores } from "@/styles/variaveis";

export default function EditarPerfilScreen() {
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
            <View style={editarPerfilStyle.conteudo}>
              <View style={editarPerfilStyle.header}>
                <View style={editarPerfilStyle.ladoEsquerdo}>
                  <Text style={editarPerfilStyle.titulo}>Editar perfil</Text>
                  <Text style={editarPerfilStyle.subtitulo}>
                    Atualize seus dados pessoais
                  </Text>
                </View>
                <Image
                  style={editarPerfilStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={editarPerfilStyle.main}>
                <View style={editarPerfilStyle.cardFoto}>
                  <View style={editarPerfilStyle.fotoEsquerdo}>
                    <View style={editarPerfilStyle.bordaPerfil}>
                      <Image
                        style={editarPerfilStyle.imgPerfil}
                        source={require("@/assets/images/img/user.png")}
                      />
                    </View>
                    <View style={editarPerfilStyle.textoFoto}>
                      <Text style={editarPerfilStyle.tituloFoto}>
                        Foto do perfil
                      </Text>
                      <Text style={editarPerfilStyle.subtituloFoto}>
                        A foto do perfil ajuda a personalizar sua conta
                      </Text>
                    </View>
                  </View>
                  <Pressable style={editarPerfilStyle.btnAdicionarFoto}>
                    <Text style={editarPerfilStyle.txtAdicionarFoto}>
                      Adicionar foto
                    </Text>
                  </Pressable>
                </View>

                <View style={editarPerfilStyle.cardFormulario}>
                  <View style={editarPerfilStyle.campo}>
                    <Image
                      style={editarPerfilStyle.iconCampo}
                      source={require("@/assets/images/img/perfil.png")}
                    />
                    <View style={editarPerfilStyle.campoTextos}>
                      <Text style={editarPerfilStyle.campoLabel}>
                        Nome completo
                      </Text>
                      <TextInput
                        style={editarPerfilStyle.campoInput}
                        placeholder="Seu nome completo aqui"
                        placeholderTextColor={cores.cinza}
                      />
                    </View>
                  </View>

                  <View style={editarPerfilStyle.campo}>
                    <Image
                      style={editarPerfilStyle.iconCampo}
                      source={require("@/assets/images/img/email.png")}
                    />
                    <View style={editarPerfilStyle.campoTextos}>
                      <Text style={editarPerfilStyle.campoLabel}>E-mail</Text>
                      <TextInput
                        style={editarPerfilStyle.campoInput}
                        placeholder="seuemail@exemplo.com"
                        placeholderTextColor={cores.cinza}
                        keyboardType="email-address"
                      />
                    </View>
                  </View>

                  <View style={editarPerfilStyle.campo}>
                    <Image
                      style={editarPerfilStyle.iconCampo}
                      source={require("@/assets/images/img/telefone.png")}
                    />
                    <View style={editarPerfilStyle.campoTextos}>
                      <Text style={editarPerfilStyle.campoLabel}>
                        Telefone
                      </Text>
                      <TextInput
                        style={editarPerfilStyle.campoInput}
                        placeholder="(11) 99999-9999"
                        placeholderTextColor={cores.cinza}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View style={editarPerfilStyle.campo}>
                    <Image
                      style={editarPerfilStyle.iconDocumento}
                      source={require("@/assets/images/img/documento.png")}
                    />
                    <View style={editarPerfilStyle.campoTextos}>
                      <Text style={editarPerfilStyle.campoLabel}>CPF</Text>
                      <TextInput
                        style={editarPerfilStyle.campoInput}
                        placeholder="000.000.000-00"
                        placeholderTextColor={cores.cinza}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={editarPerfilStyle.campo}>
                    <Image
                      style={editarPerfilStyle.iconCampo}
                      source={require("@/assets/images/img/calendario.png")}
                    />
                    <View style={editarPerfilStyle.campoTextos}>
                      <Text style={editarPerfilStyle.campoLabel}>
                        Data Nascimento
                      </Text>
                      <TextInput
                        style={editarPerfilStyle.campoInput}
                        placeholder="dd/mm/aaaa"
                        placeholderTextColor={cores.cinza}
                      />
                    </View>
                  </View>
                </View>

                <View style={editarPerfilStyle.cardNotificacao}>
                  <View style={editarPerfilStyle.notifEsquerdo}>
                    <Image
                      style={editarPerfilStyle.iconNotif}
                      source={require("@/assets/images/img/notificacao.png")}
                    />
                    <View style={editarPerfilStyle.textoNotif}>
                      <Text style={editarPerfilStyle.tituloNotif}>
                        Receber notificações
                      </Text>
                      <Text style={editarPerfilStyle.subtituloNotif}>
                        Receba ofertas exclusivas e novidades da The Gusta
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() =>
                      setNotificacoesAtivas((atual) => !atual)
                    }
                  >
                    <Image
                      style={editarPerfilStyle.imgSwitch}
                      source={
                        notificacoesAtivas
                          ? require("@/assets/images/img/ativo.png")
                          : require("@/assets/images/img/inativo.png")
                      }
                    />
                  </Pressable>
                </View>

                <Pressable style={editarPerfilStyle.btnSalvar}>
                  <Text style={editarPerfilStyle.txtSalvar}>
                    Salvar alterações
                  </Text>
                </Pressable>

                <Pressable style={editarPerfilStyle.btnCancelar}>
                  <Text style={editarPerfilStyle.txtCancelar}>Cancelar</Text>
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
