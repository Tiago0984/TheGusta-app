import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const alterarSenhaStyle = StyleSheet.create({
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

  cardSenhas: {
    width: "100%",
    backgroundColor: cores.branco,
    borderRadius: 15,
    borderColor: cores.laranja,
    borderWidth: 2,
    padding: 15,
  },

  listaCampos: {
    gap: 20,
  },

  campo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: cores.branco,
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

  imgOlho: {
    width: 22,
    height: 22,
  },

  cardDicas: {
    width: "100%",
    backgroundColor: cores.branco,
    borderRadius: 15,
    borderColor: cores.laranja,
    borderWidth: 2,
    padding: 15,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  imgDicas: {
    width: 50,
    height: 50,
  },

  dicasTextos: {
    flex: 1,
    minWidth: 0,
  },

  tituloDicas: {
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  itemDica: {
    fontSize: 12,
    color: cores.cinza,
    marginTop: 4,
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

export default alterarSenhaStyle;
