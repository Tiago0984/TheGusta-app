import { StyleSheet } from "react-native";

import { cores } from "./variaveis";
import { fontes } from "./variaveis";

const detalheProdutoStyle = StyleSheet.create({
  conteudo: {
    marginTop: 60,
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

  btnFavorito: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: cores.branco,
    alignItems: "center",
    justifyContent: "center",
  },

  main: {
    width: "80%",
    margin: "auto",
    marginTop: 20,
  },

  imgProduto: {
    width: "100%",
    height: 220,
    borderRadius: 15,
  },

  txtFavorito: {
    width: 30,
    height: 30,
    fontSize: 50,
    lineHeight: 20,
    textAlign: "center",
    textAlignVertical: "center",
    color: cores.laranja,
    marginRight: 10,
  },

  categoria: {
    marginTop: 10,
    fontSize: 20,
    color: cores.preto,
    fontFamily: fontes.negrito,
    textAlign: "right",
  },

  valorProduto: {
    marginTop: 10,
    fontSize: 30,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    marginVertical: 10,
  },

  descricaoCurta: {
    fontSize: 15,
    color: cores.cinza,
   
  },

  tituloDescricao: {
    marginTop: 20,
    fontSize: 20,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  descricao:  {
    marginTop: 10,
    fontSize: 15  ,
    color: cores.cinza,
  },

  areaVenda: {
    marginTop: 20,
    marginVertical: 10,
  },

  linhaQtdeSubtotal: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },

  caixaQtde: {
    flexDirection: "row",
    width: 120,
    height: 50,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: cores.laranja,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.branco,
   
  },

  btnQtde: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  imgQtde: {
    width: 20,
    height: 20,
  },

  quantidade: {
    fontSize: 30,
    color: cores.cinza,
    fontFamily: fontes.negrito,
  },

  caixaSubtotal: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 20,
  },

  txtSubtotal: {
    fontSize: 15,
    color: cores.cinza,
    
  },

  valorSubtotal: {
    fontSize: 30,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    
  },

  btnSubtotal: {
    width: 200,
    height: 30,
    borderRadius: 10,
    backgroundColor: cores.laranja,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 15,
  },

  txtSacola: {
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },



});

export default detalheProdutoStyle;
