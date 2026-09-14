import { StyleSheet } from "react-native";

import { cores, fontes } from "./variaveis";

const detalhePedidoStyle = StyleSheet.create({
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

  areaPedido: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  infoPedido: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  imgPedido: {
    width: 32,
    height: 32,
  },

  resumoPedido: {
    flexShrink: 1,
  },

  numeroPedido: {
    fontSize: 15,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  horarioPedido: {
    fontSize: 12,
    color: cores.cinza,
    fontFamily: fontes.comum,
    marginTop: 2,
  },

  statusPedido: {
    width: 120,
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 4,
    backgroundColor: cores.laranjaclaro,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    marginLeft: "auto",
  },

  imgStatus: {
    width: 20,
    height: 20,
  },

  txtStatus: {
    fontSize: 10,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },

  cardAcompanhar: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    marginTop: 10,
  },

  acompanharPedido: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  colunaEtapa: {
    width: 50,
    alignItems: "center",
  },

  areaIconeEtapa: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: cores.cinza,
    backgroundColor: cores.cinzaClaro,
    alignItems: "center",
    justifyContent: "center",
  },

  etapaFinalizada: {
    borderColor: cores.verde,
    backgroundColor: cores.verdeClaro,
  },

  etapaEmAndamento: {
    borderColor: cores.laranja,
    backgroundColor: cores.laranjaclaro,
  },

  iconeEtapa: {
    width: 30,
    height: 30,
  },

  linhaEtapa: {
    flex: 1,
    height: 2,
    marginTop: 24,
    backgroundColor: cores.cinzaClaro,
  },

  linhaEtapaVerde: {
    backgroundColor: cores.verde,
  },

  linhaEtapaLaranja: {
    backgroundColor: cores.laranja,
  },

  txtEtapa: {
    width: 80,
    marginTop: 6,
    fontSize: 11,
    color: cores.cinza,
    fontFamily: fontes.comum,
    textAlign: "center",
  },

  areaPrevisaoEstimada: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 15,
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: cores.cinza,
    backgroundColor: cores.cinzaClaro,
    padding: 2,
  },

  imgPrevisaoEstimada: {
    width: 15,
    height: 15,
  },

  txtPrevisaoEstimada: {
    fontSize: 11,
    color: cores.cinza,
    fontFamily: fontes.comum,
    
  },

  txtPrevisaoEstimadaTempo: {
    fontSize: 12,
    color: cores.preto,
    fontFamily: fontes.negrito,
    marginLeft: 10,
  },

  card: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: cores.laranja,
    borderWidth: 2,
    marginTop: 10,

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

  formaPagamentoPedido: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTituloSemMargem: {
    marginBottom: 0,
  },

  metodoPagamento: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  imgMetodoPagamento: {
    width: 26,
    height: 26,
  },

  txtMetodoPagamento: {
    fontSize: 14,
    color: cores.cinza,
    fontFamily: fontes.negrito,
  },

  colunaObservacao: {
    flexShrink: 1,
    gap: 4,
  },

  txtObservacaoPedido: {
    fontSize: 13,
    color: cores.cinza,
    fontFamily: fontes.comum,
  },

  botoesPedido: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    
  },

  btnAcaoPedido: {
    width: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: cores.laranja,
    borderRadius: 5,
    backgroundColor: cores.branco,
    padding: 2,
  },

  imgBtnAcaoPedido: {
    width: 15,
    height: 15,
  },

  txtBtnAcaoPedido: {
    fontSize: 11,
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },
});

export default detalhePedidoStyle;
