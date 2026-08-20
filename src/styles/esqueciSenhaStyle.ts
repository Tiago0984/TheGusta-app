import { StyleSheet } from "react-native";

const esqueciSenhaStyle = StyleSheet.create({
  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },

  titulo: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    paddingHorizontal: "10%",
  },

  form: {
    width: "100%",
    marginTop: 50,
    alignItems: "center",
    paddingHorizontal: "5%",
  },

  input: {
    height: 50,
    flexDirection: "row",
    borderColor: "#ff9800",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginVertical: 10,
    justifyContent: "space-between",
  },

  icone: {
    width: 30,
    height: 30,
    marginRight: 10,
  },

  TextInput: {
    width: "100%",
  },

  btnEnviar: {
    width: "80%",
    height: 50,
    backgroundColor: "#ff9800",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 50,
  },

  txtEnviar: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "bold",
  },

  btnEnviarPressed: {
    opacity: 0.8,
  },

  btnVoltar: {
    width: "80%",
    height: 50,
    backgroundColor: "#FFE8C5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "#ff9800",
    borderWidth: 2,
    marginTop: 15,
  },

  txtVoltar: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "bold",
  },

  btnVoltarPressed: {
    backgroundColor: "#ff9800",
  },
});

export default esqueciSenhaStyle;
