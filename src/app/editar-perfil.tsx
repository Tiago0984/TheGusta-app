import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import editarPerfilStyle from "@/styles/editarPerfilStyle";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores } from "@/styles/variaveis";

import { IMAGEM } from "@/config/api";
import { useCliente } from "@/hooks/use-cliente";

// Converte a data do banco (aaaa-mm-dd) para dd/mm/aaaa
function formatarData(data?: string) {
  if (!data) {
    return "";
  }
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function EditarPerfilScreen() {
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  const [modalFoto, setModalFoto] = useState(false);
  const [imagem, setImagem] = useState<string | null>(null);

  // Abre o modal para escolher entre câmera e galeria
  const escolherFoto = () => {
    setModalFoto(true);
  };

  // Abre a câmera (precisa de permissão, menos no navegador)
  const tirarFoto = async () => {
    setModalFoto(false);

    if (Platform.OS !== "web") {
      const permissao = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir o acesso à câmera.",
        );
        return;
      }
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  // Abre a galeria (não precisa de permissão)
  const selecionarGaleria = async () => {
    setModalFoto(false);

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  // Dados do cliente carregados da API (Editar perfil)
  const cliente = useCliente();
  const [fotoClienteErro, setFotoClienteErro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [documento, setDocumento] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [erro, setErro] = useState("");

  // Formatar data padrão Brasil (dd/mm/aaaa) e validar se é uma data válida
  function mascaraData(texto: string) {
    let numeros = texto.replace(/\D/g, "").slice(0, 8); // Só números, até 8 dígitos

    if (numeros.length > 4) {
      numeros = numeros.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (numeros.length > 2) {
      numeros = numeros.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }

    setDataNascimento(numeros);
    setErro("");

    if (numeros.length === 10 && !validarData(numeros)) {
      setErro("Informe uma data válida");
    }
  }

  // Validar a data seguindo os padrões de meses e anos Bissextos
  function validarData(valor: string): boolean {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
      return false;
    }
    const [dia, mes, ano] = valor.split("/").map(Number);

    if (ano < 1 || mes < 1 || mes > 12 || dia < 1) {
      return false;
    }

    // Não aceita data no futuro
    const hoje = new Date();
    const dataInformada = new Date(ano, mes - 1, dia);
    if (dataInformada > hoje) {
      return false;
    }

    // Calcular os anos bissextos
    const bissexto = ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0);

    const diasMes = [
      31, 
      bissexto ? 29 : 28, 
      31, 
      30, 
      31, 
      30, 
      31, 
      31, 
      30, 
      31, 
      30, 
      31
    ];
    return dia <= diasMes[mes - 1];
  }


  useEffect(() => {
    if (!cliente) {
      return;
    }
    setNome(cliente.nome_cliente ?? "");
    setEmail(cliente.email_cliente ?? "");
    setTelefone(cliente.telefone_cliente ?? "");
    setDocumento(cliente.cpf_cnpj_cliente ?? "");
    setDataNascimento(formatarData(cliente.data_nasc_cliente));
  }, [cliente]);

  // CNPJ tem 14 digitos, CPF tem 11
  const ehCnpj = documento.replace(/\D/g, "").length > 11;

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
                        source={
                          imagem
                            ? { uri: imagem }
                            : cliente?.foto_cliente && !fotoClienteErro
                              ? { uri: `${IMAGEM}/${cliente.foto_cliente}` }
                              : require("@/assets/images/img/user.png")
                        }
                        onError={() => setFotoClienteErro(true)}
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
                  <Pressable
                    style={editarPerfilStyle.btnAdicionarFoto}
                    onPress={escolherFoto}
                  >
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
                        value={nome}
                        onChangeText={setNome}
                        maxLength={50}
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
                        value={email}
                        editable={false}
                      />
                    </View>
                  </View>

                  <View style={editarPerfilStyle.campo}>
                    <Image
                      style={editarPerfilStyle.iconCampo}
                      source={require("@/assets/images/img/telefone.png")}
                    />
                    <View style={editarPerfilStyle.campoTextos}>
                      <Text style={editarPerfilStyle.campoLabel}>Telefone</Text>
                      <TextInput
                        style={editarPerfilStyle.campoInput}
                        placeholder="(11) 99999-9999"
                        placeholderTextColor={cores.cinza}
                        keyboardType="phone-pad"
                        value={telefone}
                        onChangeText={setTelefone}
                        maxLength={15}
                      />
                    </View>
                  </View>

                  <View style={editarPerfilStyle.campo}>
                    <Image
                      style={editarPerfilStyle.iconDocumento}
                      source={require("@/assets/images/img/documento.png")}
                    />
                    <View style={editarPerfilStyle.campoTextos}>
                      <Text style={editarPerfilStyle.campoLabel}>
                        {ehCnpj ? "CNPJ" : "CPF"}
                      </Text>
                      <TextInput
                        style={editarPerfilStyle.campoInput}
                        placeholder="000.000.000-00"
                        placeholderTextColor={cores.cinza}
                        keyboardType="numeric"
                        value={documento}
                        editable={false}
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
                        keyboardType="numeric"
                        value={dataNascimento}
                        onChangeText={mascaraData}
                        maxLength={10}
                        onBlur={() => {
                          // Ao sair do campo, avisa também se a data ficou incompleta
                          if (
                            dataNascimento.length > 0 &&
                            (dataNascimento.length < 10 ||
                              !validarData(dataNascimento))
                          ) {
                            setErro("Informe uma data válida");
                          }
                        }}
                      />
                      {erro !== "" && (
                        <Text style={editarPerfilStyle.txtErro}>{erro}</Text>
                      )}
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
                    onPress={() => setNotificacoesAtivas((atual) => !atual)}
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

          <Modal
            visible={modalFoto}
            transparent
            animationType="fade"
            onRequestClose={() => setModalFoto(false)}
          >
            <View style={editarPerfilStyle.fundoModal}>
              <View style={editarPerfilStyle.cardModal}>
                <Text style={editarPerfilStyle.tituloModal}>
                  Adicionar foto
                </Text>
                <Text style={editarPerfilStyle.subtituloModal}>
                  Como deseja adicionar sua foto?
                </Text>

                <Pressable
                  style={editarPerfilStyle.btnModal}
                  onPress={tirarFoto}
                >
                  <Text style={editarPerfilStyle.txtBtnModal}>
                    📷 Tirar foto
                  </Text>
                </Pressable>

                <Pressable
                  style={editarPerfilStyle.btnModal}
                  onPress={selecionarGaleria}
                >
                  <Text style={editarPerfilStyle.txtBtnModal}>
                    🖼️ Escolher da galeria
                  </Text>
                </Pressable>

                <Pressable
                  style={editarPerfilStyle.btnCancelarModal}
                  onPress={() => setModalFoto(false)}
                >
                  <Text style={editarPerfilStyle.txtCancelarModal}>
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
