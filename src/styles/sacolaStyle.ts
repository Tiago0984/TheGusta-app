import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const sacolaStyle = StyleSheet.create({
  conteudo: {
    marginTop: 30,
    marginBottom: 30,
  },

  header: {
    width: "80%",
    margin: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ladoEsquerdo: {
    flexShrink: 1,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: cores.preto,
    fontFamily: fontes.negrito,
    marginTop: 65,
  },

  logo: {
    width: 80,
    height: 75,
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 17,
    color: cores.cinza,
  },

  main: {
    width: "80%",
    margin: "auto",
    marginTop: 15,
  },

  itemSacola: {
    width: "100%",
    backgroundColor: cores.branco,
    // height: 90,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    flexDirection: "row",
    // columnGap: 10,
    justifyContent: "space-between",
    // alignItems: 'center',
    marginVertical: 5,
  },

  imgItem: {
    width: "27%",
    height: 60,
    borderRadius: 10,
    margin: "auto",
  },

  centroItem: {
    width: "45%",
  },

  tituloItem: {
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  descricaoItem: {
    fontSize: 11,
    color: cores.cinza,
    fontFamily: fontes.comum,
    marginTop: 5,
  },

  valoresItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },

  valorUnitItem: {
    fontSize: 10,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  valorTotalItem: {
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  direitaItem: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "25%",
  },

  btnExcluir: {
    width: 20,
    height: 20,
  },

  imgExcluir: {
    width: 20,
    height: 20,
  },

  caixaQtde: {
    flexDirection: "row",
    width: 50,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: cores.laranja,
    padding: 2,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.branco,
  },

  btnQtde: {},

  imgQtde: {
    width: 8,
    height: 8,
  },

  quantidade: {
    fontSize: 12,
    color: cores.cinza,
  },

  cupom: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },

  cupomEsquerdo: {
    width: "70%",
    gap: 5,
  },

  txtCupom: {
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.negrito,
    textTransform: "uppercase",
    height: 20,
  },

  tituloCupom: {
    fontSize: 15,
    color: cores.preto,
    borderBottomColor: cores.laranja,
    // fontFamily: fontes.negrito,
    borderBottomWidth: 2,
    height: 20,
  },

  btnAplicar: {},

  txtAplicar: {
    fontSize: 15,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  endereço: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },

  imgEndereco: {

  },

  infoEndereço: {

  },

  tituloEndereco: {

  },

  endereçoCompleto: {

  },

  telefone: {

  },

  entrega: {

  },

  tituloEntrega: {

  },

  tempoEntrega: {

  },

  btnEndereco: {

  },

  txtEndereco: {
    
  },
});

export default sacolaStyle;
