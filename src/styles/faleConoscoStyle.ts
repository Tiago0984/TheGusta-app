import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const faleConoscoStyle = StyleSheet.create({
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
    borderRadius: 15,
    borderColor: cores.laranja,
    borderWidth: 2,
  },

  campoAssunto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  iconAssunto: {
    width: 30,
    height: 30,
  },

  inputAssunto: {
    flex: 1,
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.comum,
    padding: 0,
  },

  campoMensagem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    height: 220,
    marginBottom: 15,
  },

  iconMensagem: {
    width: 30,
    height: 30,
  },

  inputMensagem: {
    flex: 1,
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.comum,
    padding: 0,
    textAlignVertical: "top",
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

  cardAtendimento: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderColor: cores.laranja,
    borderWidth: 2,
    marginTop: 15,
  },

  tituloAtendimento: {
    fontSize: 16,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    marginBottom: 15,
  },

  conteudoAtendimento: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  colunaTextosAtendimento: {
    flex: 1,
    gap: 12,
  },

  grupoAtendimento: {
    gap: 2,
  },

  labelAtendimento: {
    fontSize: 13,
    color: cores.cinza,
    fontFamily: fontes.negrito,
  },

  valorAtendimento: {
    fontSize: 13,
    color: cores.cinza,
    fontFamily: fontes.comum,
  },

  imgAtendimento: {
    width: 80,
    height: 80,
  },
});

export default faleConoscoStyle;
