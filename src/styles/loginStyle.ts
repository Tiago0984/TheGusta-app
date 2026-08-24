import { StyleSheet, TextInput } from "react-native";

import { cores } from "./variaveis";
import { fontes } from "./variaveis";

const LoginStyle = StyleSheet.create({
  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  logo: {
    width: 195,
    height: 180,
  },

  titulo: {
    marginTop: 30,
    fontSize: 40,
    fontWeight: "bold",
    color: cores.preto,
    textAlign: "center",
  },
  subtitulo: {
    marginTop: 10,
    fontSize: 20,
    color: cores.cinza,
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
    borderColor: cores.laranja,
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
    color: cores.laranja,
    textDecorationLine: "underline",
  },

  btnEntrar: {
    width: "80%",
    height: 50,
    backgroundColor: cores.laranja,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },

  txtEntrar: {
    color: cores.preto,
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
    backgroundColor: cores.laranja,
  },

  textoSeparador: {
    fontSize: 15,
    color: cores.cinza,
  },

  btnCriarConta: {
    width: "80%",
    height: 50,
    backgroundColor: cores.laranjaclaro,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
  },

  txtCriarConta: {
    color: cores.preto,
    fontSize: 25,
    fontWeight: "bold",
  },

  btnCriarContaPressed: {
    backgroundColor: cores.laranja,
  },
});

export default LoginStyle;
