import { StyleSheet } from "react-native";

import { cores } from "./variaveis";
import { fontes } from "./variaveis";

const homeStyle = StyleSheet.create({
  header: {
    width: "80%",
    margin: "auto",
    marginTop: 80,
  },

  conteudo: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: cores.preto,
    textAlign: "left",
    fontFamily: fontes.negrito,
  },

  bordaPerfil: {
    padding: 15,
    borderColor: cores.laranja,
    borderRadius: "50%",
    borderWidth: 2,
    backgroundColor: cores.laranjaclaro,
  },

  perfil: {
    width: 50,
    height: 50,
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 18,
    color: cores.cinza,
  },

  main: {
    width: "80%",
    margin: "auto",
    marginTop: 30,
  },

  buscarProduto: {
    width: "100%",
    height: 50,
    borderColor: cores.laranja,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    backgroundColor: cores.laranjaclaro,
  },

  txtProduto: {
    marginVertical: "auto",
    color: cores.preto,
    fontSize: 15,
    width: "100%",
  },

  btnBuscar: {
    width: 30,
    height: 30,
  },

  imgBuscar: {
    width: "100%",
    height: "100%",
  },

  banner: {
    width: "100%",
    height: 160,
    borderRadius: 30,
    marginTop: 30,
  },

  categoria: {
    width: "100%",
    marginTop: 30,
  },

  tituloSecao: {
    fontSize: 30,
    fontFamily: fontes.negrito,
    marginBottom: 10,
  },

  conteudoCategoria: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },

  itemCategoria: {
    width: 55,
    height: 55,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    paddingVertical: 3,
    paddingHorizontal: 2,
    alignItems: "center",
    backgroundColor: cores.laranjaclaro,
  },

  imgCategoria: {
    width: 30,
    height: 30,
  },

  txtCategoria: {
    fontSize: 12,
    fontFamily: fontes.comum,
    color: cores.cinza,
  },

  destaque: {
    width: "100%",
    marginTop: 30,
  },

  conteudoDestaque: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  itemDestaque: {
    width: 110,
    height: 155,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    marginRight: 10,
    backgroundColor: cores.laranjaclaro,
    overflow: "hidden",
  },

  caixaImagem: {
    width: "100%",
    height: 70,
    position: "relative",
  },

  infoDestaque: {
    width: "100%",
    paddingHorizontal: 5,
    paddingBottom: 5,
  },

  imgDestaque: {
    width: "100%",
    height: "100%",
  },

  btnFavorito: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: cores.branco,
    alignItems: "center",
    justifyContent: "center",
  },

  txtFavorito: {
    width: 25,
    height: 25,
    fontSize: 20,
    lineHeight: 20,
    textAlign: "center",
    textAlignVertical: "center",
    color: cores.laranja,
    marginBottom: 4
  },

  txtDestaque: {
    width: "100%",
    fontSize: 12,
    fontFamily: fontes.negrito,
    color: cores.preto,
    textAlign: "center",
    marginTop: 5,
  },

  txtDescricao: {
    fontSize: 10,
    fontFamily: fontes.comum,
    color: cores.cinza,
    marginTop: 2,
    textAlign: 'center'
  },

  rodapeDestaque: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 20,
    marginTop: 5,
  },

  precoDestaque: {
    fontSize: 12,
    fontFamily: fontes.negrito,
    color: cores.preto,
    lineHeight: 15,
    marginLeft: 20,
  },

  btnDetalhes: {
    width: 15,
    height: 15,
    borderRadius: 4,
    borderColor: cores.laranja,
    borderWidth: 1,
    backgroundColor: cores.laranjaclaro,
    alignItems: "center",
    justifyContent: "center",
  },

  imgDetalhes: {
    width: "100%",
    height: "100%",
  },
});

export default homeStyle;
