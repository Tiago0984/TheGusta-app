import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const depoimentosStyle = StyleSheet.create({
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

  cardFormulario: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
  },

  cardTituloForm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },

  iconFormulario: {
    width: 40,
    height: 40,
  },

  txtCardTitulo: {
    fontSize: 16,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  campoLabel: {
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.negrito,
    marginBottom: 8,
  },

  estrelasLinha: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 15,
  },

  estrela: {
    width: 30,
    height: 30,
    fontSize: 30,
    lineHeight: 30,
    textAlign: "center",
    textAlignVertical: "center",
    color: cores.laranja,
  },

  inputDepoimento: {
    width: "100%",
    maxWidth: 330,
    height: 100,
    alignSelf: "center",
    borderColor: cores.laranja,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.comum,
    textAlignVertical: "top",
    marginBottom: 15,
  },

  btnEnviar: {
    width: "100%",
    maxWidth: 300,
    height: 30,
    backgroundColor: cores.laranja,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  txtEnviar: {
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  tituloSecao: {
    fontSize: 20,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    marginTop: 20,
    marginBottom: 10,
  },

  cardAvaliacao: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    marginTop: 0,
    marginBottom: 10,
  },

  estrelasAvaliacao: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },

  estrelaAvaliacao: {
    width: 20,
    height: 20,
    fontSize: 20,
    lineHeight: 15,
    textAlign: "center",
    textAlignVertical: "center",
    color: cores.laranja,
  },

  txtAvaliacao: {
    fontSize: 13,
    color: cores.cinza,
    fontFamily: fontes.comum,
  },
});

export default depoimentosStyle;
