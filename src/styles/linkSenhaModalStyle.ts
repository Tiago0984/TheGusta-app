import { StyleSheet } from "react-native";

const linkSenhaModalStyle = StyleSheet.create({
  sobrepor: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  conteudo: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    marginBottom: 16,
  },

  texto: {
    fontSize: 17,
    color: "#888888",
    lineHeight: 20,
    textAlign: "justify",
  },

  textoValidade: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },

  btnOk: {
    width: "60%",
    height: 50,
    marginTop: 24,
    backgroundColor: "#ff9800",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btnOkPressed: {
    opacity: 0.8,
  },

  txtOk: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default linkSenhaModalStyle;
