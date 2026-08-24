import { StyleSheet } from "react-native";

import { cores } from "./variaveis";
import { fontes } from "./variaveis";

const termosUsoStyle = StyleSheet.create({
  sobrepor: {
    flex: 1,
    backgroundColor: cores.preto80,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  conteudo: {
    width: "100%",
    height: "85%",
    backgroundColor: cores.branco,
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: cores.preto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: cores.preto,
    marginBottom: 12,
  },

  scroll: {
    flex: 1,
    width: "100%",
  },

  subtitulo:{
    fontSize: 18,
    color: cores.laranja,
    marginTop: 12,
    marginBottom: 4,
  },

  texto:{
    fontSize: 15,
    color: cores.cinza,
    lineHeight: 20,
    textAlign: "justify",
  },

  btnEntendi: {
    width: "60%",
    height: 50,
    marginTop: 16,
    padding: 10,
    backgroundColor: cores.laranja,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  txtEntendi: {
    color: cores.preto,
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default termosUsoStyle;
