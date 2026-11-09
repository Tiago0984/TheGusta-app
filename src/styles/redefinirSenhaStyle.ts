import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const redefinirSenhaStyle = StyleSheet.create({
  linhaCodigo: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 16,
  },
  campoCodigo: {
    width: 48,
    height: 52,
    borderWidth: 2,
    borderColor: cores.laranja,
    borderRadius: 10,
    fontSize: 24,
    textAlign: "center",
    fontFamily: fontes.negrito,
    color: cores.preto,
  },
  erroSenha: {
    color: "#B42318",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  btnNovoCodigo: {
    paddingVertical: 12,
    marginBottom: 12,
  },
  txtNovoCodigo: {
    color: cores.laranja,
    textDecorationLine: "underline",
    fontSize: 16,
  },
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
    flex: 1,
    minWidth: 0,
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
