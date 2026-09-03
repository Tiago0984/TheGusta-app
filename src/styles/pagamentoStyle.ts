import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const pagamentoStyle = StyleSheet.create({
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

  subtitulo: {
    marginTop: 10,
    fontSize: 17,
    color: cores.cinza,
  },

  logo: {
    width: 80,
    height: 75,
  },

  main: {
    width: "80%",
    margin: "auto",
    marginTop: 15,
  },

  card: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    marginVertical: 5,
  },

  cardTitulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  iconTitulo: {
    width: 30,
    height: 30,
    
  },

  txtCardTitulo: {
    fontSize: 16,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  txtCardTituloEndereco: {
    fontSize: 16,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    marginLeft: 40,
  },

  txtCardTituloEntrega: {
    fontSize: 16,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    marginLeft: 40,

  },

  txtCardTituloPagamento: {
    fontSize: 16,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    marginLeft: 40,
  },

  formaPagamentoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  imgCarteira: {
    width: 30,
    height: 30,
  },

  txtCardTituloObservacao: {
    fontSize: 16,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    marginLeft: 40,
  },

  observacaoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  imgObservacao: {
    width: 30,
    height: 30,
  },

  enderecoConteudo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  enderecoEsquerdo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },

  imgEndereco: {
    width: 30,
    height: 30,
    marginBottom: 40,

  },

  enderecoInfo: {
    flexShrink: 1,
  },

  rotuloEndereco: {
    fontSize: 12,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  txtAlterar: {
    fontSize: 12,
    color: cores.laranja,
    fontFamily: fontes.negrito,
    textDecorationLine: "underline",
    marginBottom: 40,
  },

  enderecoCompleto: {
    fontSize: 10,
    color: cores.preto,
    fontFamily: fontes.comum,
    marginTop: 5,
  },

  telefone: {
    fontSize: 10,
    color: cores.preto,
    fontFamily: fontes.comum,
    marginTop: 5,
  },

  entregaRetiradaLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  entregaRetiradaEsquerdo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    
  },

  

  imgEntrega: {
    width: 30,
    height: 30,  
    // marginBottom: 40, 
    
  },

  segmentado: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: cores.laranja,
    backgroundColor: cores.branco,
    overflow: "hidden",
  },

  segmentadoTriplo: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: cores.laranja,
    backgroundColor: cores.branco,
    overflow: "hidden",
  },

  segmentoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  segmentoBtnTriplo: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },

  segmentoBtnAtivo: {
    backgroundColor: cores.laranja,
  },

  segmentoDivisor: {
    borderLeftWidth: 2,
    borderLeftColor: cores.laranja,
  },

  segmentoTxt: {
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.comum,
  },

  segmentoTxtAtivo: {
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  previsaoArea: {
    alignItems: "flex-end",
    marginLeft: "auto",
  },

  previsaoTempo: {
    fontSize: 14,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  previsaoTxt: {
    fontSize: 11,
    color: cores.cinza,
    fontFamily: fontes.comum,
  },

  inputObservacao: {
    flex: 1,
    height: 30,
    borderWidth: 2,
    borderColor: cores.laranja,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 13,
    fontFamily: fontes.comum,
    textAlignVertical: "center",
  },

  itemResumo: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 3,
  },

  itemResumoEsquerdo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  imgItemResumo: {
    width: 25,
    height: 15,
    borderRadius: 3,
  },

  txtItemResumo: {
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.comum,
  },

  valorItemResumo: {
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.negrito,
    
  },

  areaSubtotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  txtSubtotal: {
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.comum,
  },

  valorSubtotal: {
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  areaEntrega: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  txtEntrega: {
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.comum,
  },

  valorEntrega: {
    fontSize: 13,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  areaDesconto: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  txtDesconto: {
    fontSize: 13,
    color: cores.verde,
    fontFamily: fontes.comum,
  },

  cupmDesconto: {
    fontSize: 13,
    color: cores.verde,
    fontFamily: fontes.negrito,
  },

  valorDesconto: {
    fontSize: 13,
    color: cores.verde,
    fontFamily: fontes.negrito,
  },

  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  txtTotal: {
    fontSize: 16,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },

  valorTotal: {
    fontSize: 16,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  btnConfirmar: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    backgroundColor: cores.laranja,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  txtConfirmar: {
    fontSize: 15,
    color: cores.preto,
    fontFamily: fontes.negrito,
  },
});

export default pagamentoStyle;
