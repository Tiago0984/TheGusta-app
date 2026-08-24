import { StyleSheet } from "react-native";

import { cores } from "./variaveis";
import { fontes } from "./variaveis";

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
    color: cores.preto,
    textAlign: "center",
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 16,
    color: cores.cinza,
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

  btnEnviar: {
    width: "80%",
    height: 50,
    backgroundColor: cores.laranja,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 50,
  },

  txtEnviar: {
    color: cores.preto,
    fontSize: 22,
    fontWeight: "bold",
  },

  btnEnviarPressed: {
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
    marginTop: 15,
  },

  txtVoltar: {
    color: cores.preto,
    fontSize: 22,
    fontWeight: "bold",
  },

  btnVoltarPressed: {
    backgroundColor: cores.laranja,
  },
});

export default esqueciSenhaStyle;
