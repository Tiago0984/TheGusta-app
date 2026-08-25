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
});

export default homeStyle;
