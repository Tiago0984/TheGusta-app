import { StyleSheet } from "react-native";

import { cores } from "./variaveis";
import { fontes } from "./variaveis";

const linkSenhaModalStyle = StyleSheet.create({
  sobrepor: {
    flex: 1,
    backgroundColor: cores.preto80,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  conteudo: {
    width: "100%",
    backgroundColor: cores.branco,
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: cores.preto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: cores.preto,
    marginBottom: 16,
  },

  texto: {
    fontSize: 17,
    color: cores.cinza,
    lineHeight: 20,
    textAlign: "justify",
  },

  textoValidade: {
    fontSize: 14,
    color: cores.laranja,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },

  btnOk: {
    width: "60%",
    height: 50,
    marginTop: 24,
    backgroundColor: cores.laranja,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btnOkPressed: {
    opacity: 0.8,
  },

  txtOk: {
    color: cores.preto,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default linkSenhaModalStyle;
