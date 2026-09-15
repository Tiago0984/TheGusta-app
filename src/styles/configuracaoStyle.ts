import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const configuracaoStyle = StyleSheet.create({
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

  cardSaudacao: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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

  textoSaudacao: {
    flexShrink: 1,
  },

  tituloSaudacao: {
    fontSize: 16,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  subtituloSaudacao: {
    fontSize: 12,
    color: cores.cinza,
    marginTop: 3,
  },

  tituloSecao: {
    fontSize: 18,
    color: cores.preto,
    fontFamily: fontes.negrito,
    marginTop: 20,
    marginBottom: 10,
  },

  cardConta: {
    width: "100%",
    backgroundColor: cores.branco,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    overflow: "hidden",
  },

  itemConta: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemContaDivisor: {
    width: "100%",
    height: 2,
    backgroundColor: cores.laranja,
  },

  itemContaEsquerdo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },

  iconConta: {
    width: 30,
    height: 30,
  },

  itemContaTextos: {
    flexShrink: 1,
  },

  itemContaTitulo: {
    fontSize: 14,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  itemContaSubtitulo: {
    fontSize: 11,
    color: cores.cinza,
    marginTop: 2,
  },

  itemContaSeta: {
    fontSize: 20,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  btnInstalar: {
    width: 100,
    borderColor: cores.laranja,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  txtInstalar: {
    fontSize: 13,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  imgSwitch: {
    width: 30,
    height: 30,
  },

  btnSair: {
    width: "80%",
    height: 30,
    backgroundColor: cores.laranja,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },

  txtSair: {
    fontSize: 16,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },
});

export default configuracaoStyle;
