import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const enderecosStyle = StyleSheet.create({
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

  listaEnderecos: {
    gap: 20,
  },

  cardEndereco: {
    width: "100%",
    backgroundColor: cores.branco,
    borderRadius: 15,
    borderColor: cores.laranja,
    borderWidth: 2,
    padding: 15,
  },

  linhaTopo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  tituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconEndereco: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: cores.laranjaclaro,
    borderColor: cores.laranja,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  imgIconEndereco: {
    width: 22,
    height: 22,
  },

  tituloEndereco: {
    fontSize: 18,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  txtFavorito: {
    width: 30,
    height: 30,
    fontSize: 26,
    lineHeight: 30,
    color: cores.laranja,
    textAlign: "center",
    textAlignVertical: "center",
  },

  linhaConteudo: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: 8,
  },

  enderecoDetalhes: {
    marginLeft: 50,
    marginTop: 6,
    flexShrink: 1,
  },

  linhaEndereco: {
    fontSize: 12,
    color: cores.cinza,
  },

  areaBadge: {
    marginLeft: "auto",
  },

  badgeAtivo: {
    width: 100,
    borderColor: cores.verde,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.verdeClaro,
  },

  txtBadgeAtivo: {
    fontSize: 11,
    color: cores.verde,
    fontFamily: fontes.negrito,
    textAlign: "center",
  },

  badgeUsar: {
    width: 100,
    borderColor: cores.laranja,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.laranjaclaro,
  },

  txtBadgeUsar: {
    fontSize: 11,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    textAlign: "center",
  },

  divisorEndereco: {
    width: "100%",
    height: 1,
    backgroundColor: cores.laranja,
    marginVertical: 12,
  },

  linhaBotoes: {
    flexDirection: "row",
    gap: 10,
  },

  btnEditar: {
    flex: 1,
    height: 28,
    borderColor: cores.laranja,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  txtEditar: {
    fontSize: 13,
    color: cores.cinza,
    fontFamily: fontes.comum,
  },

  btnExcluir: {
    flex: 1,
    height: 28,
    borderColor: cores.laranja,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  txtExcluir: {
    fontSize: 13,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  btnAdicionar: {
    width: "100%",
    maxWidth: 300,
    height: 30,
    backgroundColor: cores.laranja,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },

  txtAdicionar: {
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

export default enderecosStyle;
