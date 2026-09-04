import FooterScreen from "@/app/footer";
import globalStyle from "@/styles/globalStyle";
import pagamentoStyle from "@/styles/pagamentoStyle";
import { cores } from "@/styles/variaveis";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ImageBackground, Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ENDERECO_ENTREGA = {
  rotulo: "Casa",
  logradouro: "Avenida Marechal Tito, 1500",
  bairroCidade: "São Miguel Paulista - São Paulo - SP",
  telefone: "(11) 99999-9999",
};

const RESUMO_TOTAIS = {
  subtotal: "R$ 531,30",
  entrega: "R$ 10,00",
  cupom: "THEGUSTA10",
  desconto: "- R$ 54,13",
  total: "R$ 487,17",
};

const ENTREGA_LABEL: Record<"entrega" | "retirada", string> = {
  entrega: "Entrega",
  retirada: "Retirada",
};

const PAGAMENTO_LABEL: Record<"pix" | "cartao" | "dinheiro", string> = {
  pix: "Pix",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
};

export default function PagamentoScreen() {

  const itensResumo = [
    {
      id: 1,
      quantidade: 2,
      nome: "Bolo de Banana Fit",
      valor: "R$ 37,60",
      imagem: require("@/assets/images/img/bolo01.png"),
    },
    {
      id: 2,
      quantidade: 3,
      nome: "Bolo de Banana Fit",
      valor: "R$ 56,40",
      imagem: require("@/assets/images/img/bolo01.png"),
    },
    {
      id: 3,
      quantidade: 2,
      nome: "Bolo de Banana Fit",
      valor: "R$ 37,60",
      imagem: require("@/assets/images/img/bolo01.png"),
    },

  ];
  const [entrega, setEntrega] = useState<"entrega" | "retirada">("entrega");
  const [pagamento, setPagamento] = useState<"pix" | "cartao" | "dinheiro">("pix");
  const [observacao, setObservacao] = useState("");

  const confirmarPedido = () => {
    const telefone = "5511958435174";

    const listaProdutos = itensResumo
      .map(
        (item) =>
          `${item.quantidade}x ${item.nome} - ${item.valor}`
      )
      .join("\n");

    const observacaoTexto = observacao.trim().length > 0
      ? `\n\n📝 *Observação:*\n${observacao.trim()}`
      : "";

    const mensagem = `
📦 *NOVO PEDIDO - THE GUSTA*

📋 *Itens do pedido:*

${listaProdutos}

--------------------------
💰 *Subtotal:* ${RESUMO_TOTAIS.subtotal}
🚚 *Entrega:* ${RESUMO_TOTAIS.entrega}
🎟️ *Desconto (${RESUMO_TOTAIS.cupom}):* ${RESUMO_TOTAIS.desconto}
✅ *Total:* ${RESUMO_TOTAIS.total}

🛵 *Entrega/Retirada:* ${ENTREGA_LABEL[entrega]}
💳 *Forma de Pagamento:* ${PAGAMENTO_LABEL[pagamento]}

📍 *Endereço (${ENDERECO_ENTREGA.rotulo}):*
${ENDERECO_ENTREGA.logradouro} - ${ENDERECO_ENTREGA.bairroCidade}
📞 ${ENDERECO_ENTREGA.telefone}${observacaoTexto}
`;

    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url);
  };

  return (
    <View style={globalStyle.container}>
      <ImageBackground
        source={require("@/assets/images/img/00_fundo.png")}
        style={globalStyle.background}
        resizeMode="cover"
      >
        <SafeAreaView style={globalStyle.areaConteudo}>
          <Pressable
            style={globalStyle.btnVoltar}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/sacola");
              }
            }}
          >
            <Image
              style={globalStyle.imgVoltar}
              source={require("@/assets/images/img/voltar.png")}
            />
          </Pressable>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={pagamentoStyle.conteudo}>
              <View style={pagamentoStyle.header}>
                <View style={pagamentoStyle.ladoEsquerdo}>
                  <Text style={pagamentoStyle.titulo}>Pagamento</Text>
                  <Text style={pagamentoStyle.subtitulo}>
                    Confirme entrega e forma de pagamento
                  </Text>
                </View>
                <Image
                  style={pagamentoStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={pagamentoStyle.main}>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Text style={pagamentoStyle.txtCardTituloEndereco}>Endereço de entrega</Text>
                  </View>
                  <View style={pagamentoStyle.enderecoConteudo}>
                    <View style={pagamentoStyle.enderecoEsquerdo}>
                      <Image
                        style={pagamentoStyle.imgEndereco}
                        source={require("@/assets/images/img/local.png")}
                      />
                      <View style={pagamentoStyle.enderecoInfo}>
                        <Text style={pagamentoStyle.rotuloEndereco}>{ENDERECO_ENTREGA.rotulo}</Text>
                        <Text style={pagamentoStyle.enderecoCompleto}>
                          {ENDERECO_ENTREGA.logradouro}{"\n"}{ENDERECO_ENTREGA.bairroCidade}
                        </Text>
                        <Text style={pagamentoStyle.telefone}>{ENDERECO_ENTREGA.telefone}</Text>
                      </View>
                    </View>
                    <Pressable>
                      <Text style={pagamentoStyle.txtAlterar}>Alterar {`>`}</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Text style={pagamentoStyle.txtCardTituloEntrega}>Entrega / Retirada</Text>
                  </View>
                  <View style={pagamentoStyle.entregaRetiradaLinha}>
                    <View style={pagamentoStyle.entregaRetiradaEsquerdo}>
                      <Image
                        style={pagamentoStyle.imgEntrega}
                        source={require("@/assets/images/img/delivery-laranja.png")}
                        resizeMode="stretch"
                      />
                      <View style={pagamentoStyle.segmentado}>
                        <Pressable
                          style={[
                            pagamentoStyle.segmentoBtn,
                            entrega === "entrega" && pagamentoStyle.segmentoBtnAtivo,
                          ]}
                          onPress={() => setEntrega("entrega")}
                        >
                          <Text
                            style={[
                              pagamentoStyle.segmentoTxt,
                              entrega === "entrega" && pagamentoStyle.segmentoTxtAtivo,
                            ]}
                          >
                            Entrega
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[
                            pagamentoStyle.segmentoBtn,
                            entrega === "retirada" && pagamentoStyle.segmentoBtnAtivo,
                          ]}
                          onPress={() => setEntrega("retirada")}
                        >
                          <Text
                            style={[
                              pagamentoStyle.segmentoTxt,
                              entrega === "retirada" && pagamentoStyle.segmentoTxtAtivo,
                            ]}
                          >
                            Retirada
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={pagamentoStyle.previsaoArea}>
                      <Text style={pagamentoStyle.previsaoTempo}>45 - 60 min</Text>
                      <Text style={pagamentoStyle.previsaoTxt}>Previsão</Text>
                    </View>
                  </View>
                </View>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Text style={pagamentoStyle.txtCardTituloPagamento}>Forma de pagamento</Text>
                  </View>
                  <View style={pagamentoStyle.formaPagamentoLinha}>
                    <Image
                      style={pagamentoStyle.imgCarteira}
                      source={require("@/assets/images/img/carteira.png")}
                      resizeMode="contain"
                    />
                    <View style={pagamentoStyle.segmentadoTriplo}>
                    <Pressable
                      style={[
                        pagamentoStyle.segmentoBtnTriplo,
                        pagamento === "pix" && pagamentoStyle.segmentoBtnAtivo,
                      ]}
                      onPress={() => setPagamento("pix")}
                    >
                      <Text
                        style={[
                          pagamentoStyle.segmentoTxt,
                          pagamento === "pix" && pagamentoStyle.segmentoTxtAtivo,
                        ]}
                      >
                        Pix
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        pagamentoStyle.segmentoBtnTriplo,
                        pagamentoStyle.segmentoDivisor,
                        pagamento === "cartao" && pagamentoStyle.segmentoBtnAtivo,
                      ]}
                      onPress={() => setPagamento("cartao")}
                    >
                      <Text
                        style={[
                          pagamentoStyle.segmentoTxt,
                          pagamento === "cartao" && pagamentoStyle.segmentoTxtAtivo,
                        ]}
                      >
                        Cartão
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        pagamentoStyle.segmentoBtnTriplo,
                        pagamentoStyle.segmentoDivisor,
                        pagamento === "dinheiro" && pagamentoStyle.segmentoBtnAtivo,
                      ]}
                      onPress={() => setPagamento("dinheiro")}
                    >
                      <Text
                        style={[
                          pagamentoStyle.segmentoTxt,
                          pagamento === "dinheiro" && pagamentoStyle.segmentoTxtAtivo,
                        ]}
                      >
                        Dinheiro
                      </Text>
                    </Pressable>
                    </View>
                  </View>
                </View>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Text style={pagamentoStyle.txtCardTituloObservacao}>Observação</Text>
                  </View>
                  <View style={pagamentoStyle.observacaoLinha}>
                    <Image
                      style={pagamentoStyle.imgObservacao}
                      source={require("@/assets/images/img/mensagem.png")}
                      resizeMode="contain"
                    />
                    <TextInput
                      style={pagamentoStyle.inputObservacao}
                      placeholder="Alguma observação para o seu pedido"
                      placeholderTextColor={cores.cinza}
                      value={observacao}
                      onChangeText={setObservacao}
                      multiline
                    />
                  </View>
                </View>

                <View style={pagamentoStyle.card}>
                  <View style={pagamentoStyle.cardTitulo}>
                    <Image
                      style={pagamentoStyle.iconTitulo}
                      source={require("@/assets/images/img/pedido.png")}
                    />
                    <Text style={pagamentoStyle.txtCardTitulo}>Resumo do pedido</Text>
                  </View>

                  {itensResumo.map((item) => (
                    <View style={pagamentoStyle.itemResumo} key={item.id}>
                      <View style={pagamentoStyle.itemResumoEsquerdo}>
                        <Image
                          style={pagamentoStyle.imgItemResumo}
                          source={item.imagem}
                          resizeMode="cover"
                        />
                        <Text style={pagamentoStyle.txtItemResumo}>
                          {item.quantidade}x {item.nome}
                        </Text>
                      </View>
                      <Text style={pagamentoStyle.valorItemResumo}>{item.valor}</Text>
                    </View>
                  ))}

                  <View style={globalStyle.separador}></View>

                  <View style={pagamentoStyle.areaSubtotal}>
                    <Text style={pagamentoStyle.txtSubtotal}>Subtotal</Text>
                    <Text style={pagamentoStyle.valorSubtotal}>{RESUMO_TOTAIS.subtotal}</Text>
                  </View>
                  <View style={pagamentoStyle.areaEntrega}>
                    <Text style={pagamentoStyle.txtEntrega}>Entrega</Text>
                    <Text style={pagamentoStyle.valorEntrega}>{RESUMO_TOTAIS.entrega}</Text>
                  </View>
                  <View style={pagamentoStyle.areaDesconto}>
                    <Text style={pagamentoStyle.txtDesconto}>Desconto</Text>
                    <Text style={pagamentoStyle.cupmDesconto}>{RESUMO_TOTAIS.cupom}</Text>
                    <Text style={pagamentoStyle.valorDesconto}>{RESUMO_TOTAIS.desconto}</Text>
                  </View>

                  <View style={globalStyle.separador}></View>

                  <View style={pagamentoStyle.total}>
                    <Text style={pagamentoStyle.txtTotal}>Total</Text>
                    <Text style={pagamentoStyle.valorTotal}>{RESUMO_TOTAIS.total}</Text>
                  </View>
                </View>

                <Pressable style={pagamentoStyle.btnConfirmar} onPress={confirmarPedido}>
                  <Text style={pagamentoStyle.txtConfirmar}>Confirmar pedido</Text>
                </Pressable>

              </View>
            </View>
          </ScrollView>
          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
