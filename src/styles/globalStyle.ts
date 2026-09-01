import { StyleSheet } from "react-native";

import { cores } from "./variaveis";
import { fontes } from "./variaveis";

const globalStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: cores.branco,
  },
  
  background: {
    width: "100%",
    height: "100%",
    flex: 1,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "semibold",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 20,
    color: "#0400ffff",
  },

  logoMaior: {
    width: 160,
    height: 150,
  },

  areaConteudo: {
    flex: 1,
   
  },

  scrollConteudo: {
    flexGrow: 1,
  },

  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: cores.laranjaclaro,
    backgroundColor: cores.branco,
  },

  btnFooter: {
    alignItems: "center",
    justifyContent: "center",
  },

  txtFooter: {
    fontSize: 11,
    color: cores.cinza,
    marginTop: 4,
  },

  txtFooterAtivo: {
    color: cores.laranja,
  },

  btnVoltar: {
    backgroundColor: cores.laranjaclaro,
    borderRadius: "50%",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 60,
    left: "10%",
    zIndex: 10,
  },

  imgVoltar: {
    width: 50,
    height: 50,
    backgroundColor: cores.laranjaclaro,
    borderRadius: 50,
  },

});

export default globalStyle;