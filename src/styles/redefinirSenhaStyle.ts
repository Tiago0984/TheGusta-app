import { StyleSheet, TextInput } from "react-native";

import { cores } from "./variaveis";
import { fontes } from "./variaveis";

const redefinirSenhaStyle = StyleSheet.create({
  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },

  titulo: {
    marginTop: 30,
    fontSize: 30,
    fontFamily: fontes.negrito,
    color: cores.preto,
    textAlign: "center",
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 18,
    color: cores.cinza,
    textAlign: "center",
    paddingHorizontal: "10%",
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

  btnSalvar: {
    width: "80%",
    height: 50,
    backgroundColor: cores.laranja,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 20,
  },

  txtSalvar: {
    color: cores.preto,
    fontSize: 25,
    fontWeight: "bold",
  },

  btnSalvarPressed: {
    opacity: 0.8,
  },

  btnVoltar: {
    width: "80%",
    height: 50,
    backgroundColor: cores.laranjaclaro,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
  },

  txtVoltar: {
    color: cores.preto,
    fontSize: 25,
    fontWeight: "bold",
  },

  btnVoltarPressed: {
    backgroundColor: cores.laranja,
  },
});

export default redefinirSenhaStyle;
