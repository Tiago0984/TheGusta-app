import FooterScreen from "@/app/footer";
import detalheProdutoStyle from "@/styles/detalheProdutoStyle";
import globalStyle from "@/styles/globalStyle";
import { cores } from "@/styles/variaveis";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IMAGEM } from "@/config/api";
import { ApiError, getCategorias, getProduto } from "@/services/api";

function formatarPreco(valor: number) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function DetalheProdutoScreen() {
  const [favorito, setFavorito] = useState(false);

  const { slug } = useLocalSearchParams();

  // Estado para armazenar o produto carregado da API (Detalhe do produto)
  const [produto, setProduto] = useState<any>(null);
  const [descricaoCategoria, setDescricaoCategoria] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [semImagem, setSemImagem] = useState(false);
  const [quantidade, setQuantidade] = useState(1);

  const carregarProduto = useCallback(async () => {
    if (!slug) {
      setErro("Produto não encontrado.");
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const [produtoCarregado, categoriasData] = await Promise.all([
        getProduto(String(slug)),
        getCategorias(),
      ]);
      setProduto(produtoCarregado);

      const categoriaDoProduto = categoriasData.find(
        (categoria) => categoria.id_categoria === produtoCarregado.id_categoria,
      );
      setDescricaoCategoria(categoriaDoProduto?.descricao_categoria ?? "");
    } catch (error) {
      console.log("Erro ao carregar o produto", error);
      setErro(
        error instanceof ApiError
          ? error.message
          : "Não foi possível carregar o produto.",
      );
    } finally {
      setCarregando(false);
    }
  }, [slug]);

  useEffect(() => {
    carregarProduto();
  }, [carregarProduto]);

  function aumentarQuantidade() {
    setQuantidade(quantidade + 1);
  }

  function diminuirQuantidade() {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  }
  

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
                router.replace("/home");
              }
            }}
          >
            <Image
              style={globalStyle.imgVoltar}
              source={require("@/assets/images/img/voltar.png")}
            />
          </Pressable>
          <ScrollView style={globalStyle.scrollConteudo}>
            {carregando ? (
              <View style={detalheProdutoStyle.mensagem}>
                <ActivityIndicator size="large" color={cores.laranja} />
              </View>
            ) : erro || !produto ? (
              <View style={detalheProdutoStyle.mensagem}>
                <Text style={detalheProdutoStyle.txtMensagem}>
                  {erro || "Produto não encontrado."}
                </Text>
                <Pressable
                  style={detalheProdutoStyle.btnTentarNovo}
                  onPress={carregarProduto}
                >
                  <Text style={detalheProdutoStyle.txtTentarNovo}>
                    Tentar de novo
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={detalheProdutoStyle.conteudo}>
                <View style={detalheProdutoStyle.header}>
                  <View style={detalheProdutoStyle.ladoEsquerdo}>
                    <Text style={detalheProdutoStyle.titulo}>
                      {produto.nome_produto}
                    </Text>
                  </View>
                  <Pressable
                    style={detalheProdutoStyle.btnFavorito}
                    onPress={() => setFavorito((atual) => !atual)}
                  >
                    <Text style={detalheProdutoStyle.txtFavorito}>
                      {favorito ? "★" : "☆"}
                    </Text>
                  </Pressable>
                </View>
                <View style={detalheProdutoStyle.main}>
                  <Image
                    style={detalheProdutoStyle.imgProduto}
                    source={
                      semImagem || !produto.foto_produto
                        ? require("@/assets/images/img/sem-imagem.png")
                        : { uri: `${IMAGEM}/${produto.foto_produto}` }
                    }
                    onError={() => setSemImagem(true)}
                  />
                  <View style={detalheProdutoStyle.linhaCategoria}>
                    <Text style={detalheProdutoStyle.categoria}>
                      {produto.tamanho_produto}
                    </Text>
                    <Text style={detalheProdutoStyle.categoria}>
                      {produto.categoria_produto?.nome_categoria}
                    </Text>
                  </View>
                  <Text style={detalheProdutoStyle.valorProduto}>
                    {Number(produto.valor_produto).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                  <Text style={detalheProdutoStyle.descricaoCurta}>
                    {descricaoCategoria}
                  </Text>
                  <Text style={detalheProdutoStyle.tituloDescricao}>
                    Descrição
                  </Text>
                  <Text style={detalheProdutoStyle.descricao}>
                    {produto.descricao_produto}
                  </Text>

                  <View style={detalheProdutoStyle.areaVenda}>
                    <View style={detalheProdutoStyle.linhaQtdeSubtotal}>
                      <View style={detalheProdutoStyle.caixaQtde}>
                        <Pressable
                          style={detalheProdutoStyle.btnQtde}
                          onPress={diminuirQuantidade}
                        >
                          <Image
                            style={detalheProdutoStyle.imgQtde}
                            source={require("@/assets/images/img/retirar.png")}
                          />
                        </Pressable>
                        <Text style={detalheProdutoStyle.quantidade}>
                          {quantidade}
                        </Text>
                        <Pressable
                          style={detalheProdutoStyle.btnQtde}
                          onPress={aumentarQuantidade}
                        >
                          <Image
                            style={detalheProdutoStyle.imgQtde}
                            source={require("@/assets/images/img/adicionar.png")}
                          />
                        </Pressable>
                      </View>
                      <View style={detalheProdutoStyle.caixaSubtotal}>
                        <Text style={detalheProdutoStyle.txtSubtotal}>
                          Subtotal
                        </Text>
                        <Text style={detalheProdutoStyle.valorSubtotal}>
                          {formatarPreco(produto.valor_produto * quantidade)}
                        </Text>
                      </View>
                    </View>

                    <Pressable style={detalheProdutoStyle.btnSubtotal}>
                      <Text style={detalheProdutoStyle.txtSacola}>
                        Adicionar à Sacola
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
