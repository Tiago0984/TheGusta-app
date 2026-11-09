import FooterScreen from "@/app/footer";
import detalheProdutoStyle from "@/styles/detalheProdutoStyle";
import globalStyle from "@/styles/globalStyle";
import { cores } from "@/styles/variaveis";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
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
import { adicionarNaSacola } from "@/config/sacola";
import { ApiError, getCategorias, getProduto, type Produto } from "@/services/api";
import { useFavoritos } from "@/hooks/use-favoritos";
import { BotaoFavorito, MensagemFavoritos } from "@/components/favoritos";

function formatarPreco(valor: number) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function DetalheProdutoScreen() {
  const { slug: parametro } = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = typeof parametro === "string" ? parametro : "";
  return <DetalheProdutoConteudo key={slug} slug={slug} />;
}

function DetalheProdutoConteudo({ slug }: { slug: string }) {
  const { erro: erroFavoritos, atualizarFavoritos } = useFavoritos(slug);

  // Estado para armazenar o produto carregado da API (Detalhe do produto)
  const [produto, setProduto] = useState<Produto | null>(null);
  const [descricaoCategoria, setDescricaoCategoria] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [semImagem, setSemImagem] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionando, setAdicionando] = useState(false);
  const [erroSacola, setErroSacola] = useState("");
  const envioSacola = useRef(false);
  const focada = useRef(false);

  const carregarProduto = useCallback(async () => {
    if (!slug) {
      setErro("Produto não encontrado.");
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setSemImagem(false);

      const [produtoCarregado, categoriasData] = await Promise.all([
        getProduto(String(slug)),
        getCategorias(),
      ]);
      setProduto(produtoCarregado);

      const categoriaDoProduto = categoriasData.find(
        (categoria) => Number(categoria.id_categoria) === Number(produtoCarregado.id_categoria),
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

  useFocusEffect(useCallback(() => {
    focada.current = true;
    void carregarProduto();
    return () => { focada.current = false; };
  }, [carregarProduto]));

  function aumentarQuantidade() {
    setQuantidade((atual) => Math.min(99, atual + 1));
  }

  function diminuirQuantidade() {
    setQuantidade((atual) => Math.max(1, atual - 1));
  }

  async function adicionar() {
    if (!produto || envioSacola.current) return;
    envioSacola.current = true;
    setAdicionando(true);
    setErroSacola("");
    try {
      await adicionarNaSacola(produto, quantidade);
      if (focada.current) router.push("/sacola");
    } catch (error) {
      if (focada.current) setErroSacola(error instanceof Error ? error.message : "Não foi possível adicionar o produto à sacola.");
    } finally {
      envioSacola.current = false;
      setAdicionando(false);
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
                  <BotaoFavorito idProduto={produto.id_produto} nomeProduto={produto.nome_produto} estiloBotao={detalheProdutoStyle.btnFavorito} estiloTexto={detalheProdutoStyle.txtFavorito} />
                </View>
                <MensagemFavoritos erro={erroFavoritos} tentarNovamente={atualizarFavoritos} />
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
                          accessibilityRole="button"
                          accessibilityLabel="Diminuir quantidade"
                          disabled={adicionando || quantidade <= 1}
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
                          accessibilityRole="button"
                          accessibilityLabel="Aumentar quantidade"
                          disabled={adicionando || quantidade >= 99}
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

                    {erroSacola ? <Text accessibilityRole="alert" style={detalheProdutoStyle.erroSacola}>{erroSacola}</Text> : null}
                    {produto.status_produto !== "ATIVO" ? <Text style={detalheProdutoStyle.erroSacola}>Produto indisponível para compra.</Text> : null}
                    <Pressable accessibilityRole="button" onPress={() => void adicionar()}
                      disabled={adicionando || produto.status_produto !== "ATIVO"}
                      style={[detalheProdutoStyle.btnSubtotal, (adicionando || produto.status_produto !== "ATIVO") && detalheProdutoStyle.desabilitado]}>
                      <Text style={detalheProdutoStyle.txtSacola}>
                        {adicionando ? "Adicionando..." : "Adicionar à Sacola"}
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
