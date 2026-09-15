import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const editarPerfilStyle = StyleSheet.create({
  conteudo: {
    marginTop: 30,
    marginBottom: 30,
  },

  header: {
    width: "80%",
    margin: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ladoEsquerdo: {
    flexShrink: 1,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: cores.preto,
    fontFamily: fontes.negrito,
    marginTop: 65,
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 17,
    color: cores.cinza,
  },

  logo: {
    width: 80,
    height: 75,
  },

  main: {
    width: "80%",
    margin: "auto",
    marginTop: 15,
  },

  cardFoto: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },

  fotoEsquerdo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  bordaPerfil: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    backgroundColor: cores.laranjaclaro,
    alignItems: "center",
    justifyContent: "center",
  },

  imgPerfil: {
    width: 50,
    height: 50,
  },

  textoFoto: {
    width: 120,
  },

  tituloFoto: {
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  subtituloFoto: {
    fontSize: 11,
    color: cores.cinza,
    marginTop: 3,
  },

  btnAdicionarFoto: {
    width: 100,
    height: 20,
    flexShrink: 0,
    borderColor: cores.laranja,
    backgroundColor: cores.laranjaclaro,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },

  txtAdicionarFoto: {
    fontSize: 12,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  cardFormulario: {
    width: "100%",
    backgroundColor: cores.branco,
    borderRadius: 15,
    borderColor: cores.laranja,
    borderWidth: 2,
    padding: 15,
    marginTop: 10,
    gap: 10,
  },

  campo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  iconCampo: {
    width: 30,
    height: 30,
  },

  iconDocumento: {
    width: 30,
    height: 21,
  },

  campoTextos: {
    flex: 1,
    minWidth: 0,
  },

  campoLabel: {
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  campoInput: {
    width: "100%",
    fontSize: 13,
    color: cores.cinza,
    fontFamily: fontes.comum,
    padding: 0,
    marginTop: 2,
  },

  cardNotificacao: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  notifEsquerdo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },

  iconNotif: {
    width: 30,
    height: 30,
  },

  textoNotif: {
    flexShrink: 1,
  },

  tituloNotif: {
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  subtituloNotif: {
    fontSize: 11,
    color: cores.cinza,
    marginTop: 3,
  },

  imgSwitch: {
    width: 30,
    height: 30,
  },

  btnSalvar: {
    width: "100%",
    maxWidth: 300,
    height: 30,
    backgroundColor: cores.laranja,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },

  txtSalvar: {
    fontSize: 16,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  btnCancelar: {
    width: "100%",
    maxWidth: 200,
    height: 30,
    backgroundColor: cores.laranjaclaro,
    borderColor: cores.laranja,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },

  txtCancelar: {
    fontSize: 16,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },
});

export default editarPerfilStyle;
