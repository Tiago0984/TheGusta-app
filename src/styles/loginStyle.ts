import { StyleSheet, TextInput } from "react-native";

const LoginStyle = StyleSheet.create({
  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 195,
    height: 180,
  },

  titulo: {
    marginTop: 30,
    fontSize: 40,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  subtitulo: {
    marginTop: 10,
    fontSize: 20,
    color: "#888888",
  },
  form: {
    width: "100%",
    marginTop: 20,
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

  btnMostrarSenha: {
    justifyContent: "center",
  },

  mostrarSenha: {
    width: 20,
    height: 20,
    marginVertical: 5,
  },

  btnEsqueciSenha: {
    alignSelf: "flex-end",
  },

  txtEsqueciSenha: {
    fontSize: 12,
    color: "#ff9800",
    textDecorationLine: "underline",
  },

  btnEntrar: {
    width: "80%",
    height: 50,
    backgroundColor: "#ff9800",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },

  txtEntrar: {
    color: "#000000",
    fontSize: 25,
    fontWeight: "bold",
  },

  btnEntrarPressed: {
    opacity: 0.8,
  },

  Separador: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },

  linha: {
    flex: 1,
    height: 2,
    backgroundColor: "#ff9800",
  },

  textoSeparador: {
    fontSize: 15,
    color: "#888888",
  },

  btnCriarConta: {
    width: "80%",
    height: 50,
    backgroundColor: "#FFE8C5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "#ff9800",
    borderWidth: 2,
  },

  txtCriarConta: {
    color: "#000000",
    fontSize: 25,
    fontWeight: "bold",
  },

  btnCriarContaPressed: {
    backgroundColor: "#ff9800",
  },
});

export default LoginStyle;
