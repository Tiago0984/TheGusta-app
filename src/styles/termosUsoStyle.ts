import { StyleSheet } from "react-native";

const termosUsoStyle = StyleSheet.create({
  sobrepor: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  conteudo: {
    width: "100%",
    height: "85%",
    backgroundColor: "#ffff",
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    marginBottom: 12,
  },

  scroll: {
    flex: 1,
    width: "100%",
  },

  subtitulo:{
    fontSize: 18,
    color: "#ff9800",
    marginTop: 12,
    marginBottom: 4,
  },

  texto:{
    fontSize: 15,
    color: "#888888",
    lineHeight: 20,
    textAlign: "justify",
  },

  btnEntendi: {
    width: "60%",
    height: 50,
    marginTop: 16,
    padding: 10,
    backgroundColor: "#ff9800",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  txtEntendi: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default termosUsoStyle;
