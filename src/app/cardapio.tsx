import { useState, useEffect, useRef } from "react";
import {
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import globalStyle from "@/styles/globalStyle";
import cardapioStyle from "@/styles/cardapioStyle";
import { cores } from "@/styles/variaveis";
import FooterScreen from "@/app/footer";

const SERVIDOR = "http://localhost:8081";
const API = `${SERVIDOR}/api/v1`;
const IMAGEM = `${SERVIDOR}/davilla/images`;

export default function CardapioScreen() {
  const [favoritos, setFavoritos] = useState(Array(20).fill(false));

  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [semImagem, setSemImagem] = useState<Number[]>([]);
  const {categoria} = useLocalSearchParams();

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await fetch(`${API}/produtos`);
        const json = await resposta.json();
        const produtosAtivos = json.data
          .filter((produto: any) => produto.status_produto === "ATIVO")
          .map((produto: any) => ({
            ...produto,
            favorito: false,
          }))
          .sort((a: any, b: any) => a.nome_produto - b.nome_produto);
        setProdutos(produtosAtivos);
      } catch (erro) {
        console.log("Erro ao carregar os produtos", erro);
      }
    }
    carregarProdutos();

    async function carregarCategorias() {
      try {
        const resposta = await fetch(`${API}/categorias`);
        const json = await resposta.json();
        const categoriasAtivas = json.data
          .filter((categoria: any) => categoria.status_categoria === "ATIVO")
          .sort((a: any, b: any) => a.ordem_categoria - b.ordem_categoria);
        setCategorias(categoriasAtivas);
      } catch (erro) {
        console.log("Erro ao carregar as categorias", erro);
      }
    }
    carregarCategorias();
  }, []);

  const categoriasComProdutos = categorias.filter((categoria) =>
    produtos.some(
      (produto) =>
        produto.categoria_produto.id_categoria === categoria.id_categoria,
    ),
  );

  const scrollRef = useRef<ScrollView>(null);
  const posicaoCategoria = useRef<{ [key: number]: number }>({});
  const scrollInicial = useRef(false);

  useEffect(() => {
    if (!categoria || scrollInicial.current) 
    {return;}
    const idCategoria = Number(categoria);
    const intervalo = setTimeout(() => {
      const posicao = posicaoCategoria.current[idCategoria];
      if (posicao != undefined) {
        scrollRef.current?.scrollTo({ 
        y: posicao, animated: true });
        scrollInicial.current = true;
        clearInterval(intervalo);
      }
    }, 100);
    return () => clearInterval(intervalo);
  }, [categoria, categorias, produtos]);

  function alterarFavorito(id: number) {
    setProdutos((produtoFavorito) =>
      produtoFavorito.map((produto) =>
        produto.id_produto === id
          ? { ...produto, favorito: !produto.favorito }
          : produto,
      ),
    );
  }

  function alternarFavorito(indice: number) {
    setFavoritos((atual) =>
      atual.map((valor, i) => (i === indice ? !valor : valor)),
    );
  }

  function irParaCategoria(idCategoria: number) {
    const posicao = posicaoCategoria.current[idCategoria];
    if (posicao !== undefined) {
      scrollRef.current?.scrollTo({ y: posicao, animated: true });
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
          <ScrollView ref={scrollRef} style={globalStyle.scrollConteudo}>
            <View style={cardapioStyle.conteudo}>
              <View style={cardapioStyle.header}>
                <View style={cardapioStyle.ladoEsquerdo}>
                  <Text style={cardapioStyle.titulo}>Cardápio</Text>
                  <Text style={cardapioStyle.subtitulo}>
                    Escolha suas delícias saudáveis
                  </Text>
                </View>
                <Image
                  style={cardapioStyle.logo}
                  source={require("@/assets/images/img/logo.png")}
                />
              </View>

              <View style={cardapioStyle.main}>
                <View style={cardapioStyle.buscarProduto}>
                  <TextInput
                    style={cardapioStyle.txtProduto}
                    placeholder="Buscar produtos"
                    placeholderTextColor={cores.cinza}
                  />
                  <Pressable style={cardapioStyle.btnBuscar}>
                    <Image
                      style={cardapioStyle.imgBuscar}
                      source={require("@/assets/images/img/lupa.png")}
                    />
                  </Pressable>
                </View>

                <View style={cardapioStyle.conteudoCategoria}>
                  {categoriasComProdutos.map((categoria, indice) => (
                    <Pressable
                      key={categoria.id_categoria}
                      onPress={() => irParaCategoria(categoria.id_categoria)}
                      style={[
                        cardapioStyle.itemCategoria,
                        (indice + 1) % 3 !== 0 && cardapioStyle.espacoCategoria,
                      ]}
                    >
                      <Text style={cardapioStyle.txtCategoria}>
                        {categoria.nome_categoria}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {categoriasComProdutos
                  .map((categoria) => (
                  <View
                    key={categoria.id_categoria}
                    style={cardapioStyle.categorias}
                    onLayout={(event) => {
                      posicaoCategoria.current[categoria.id_categoria] =
                        event.nativeEvent.layout.y;
                    }}
                  >
                    <Text style={cardapioStyle.tituloCategoria}>
                      {categoria.nome_categoria}
                    </Text>

                    <View style={cardapioStyle.produtos}>
                      {produtos
                        .filter(
                          (produto) =>
                            produto.categoria_produto.id_categoria ===
                            categoria.id_categoria,
                        )
                        .map((produto) => (
                          <View
                            key={produto.id_produto}
                            style={cardapioStyle.itemProduto}
                          >
                            <View style={cardapioStyle.caixaImagem}>
                              <Image
                                style={cardapioStyle.imgDestaque}
                                resizeMode="stretch"
                                source={
                                  semImagem.includes(produto.id_produto) ||
                                  !produto.foto_produto
                                    ? {
                                        uri: `${IMAGEM}/produto/sem-imagem.png`,
                                      }
                                    : {
                                        uri: `${IMAGEM}/${produto.foto_produto}`,
                                      }
                                }
                                onError={() => {
                                  setSemImagem((imagem) => [
                                    ...imagem,
                                    produto.id_produto,
                                  ]);
                                }}
                              />
                              <Pressable
                                style={cardapioStyle.btnFavorito}
                                onPress={() =>
                                  alterarFavorito(produto.id_produto)
                                }
                              >
                                <Text style={cardapioStyle.txtFavorito}>
                                  {produto.favorito ? "★" : "☆"}
                                </Text>
                              </Pressable>
                            </View>
                            <View style={cardapioStyle.infoDestaque}>
                              <Text style={cardapioStyle.txtDestaque}>
                                {produto.nome_produto}
                              </Text>
                              <Text style={cardapioStyle.txtDescricao}>
                                {produto.descricao_produto}
                              </Text>
                              <View style={cardapioStyle.rodapeDestaque}>
                                <Text style={cardapioStyle.precoDestaque}>
                                  {Number(produto.valor_produto).toLocaleString(
                                    "pt-BR",
                                    {
                                      style: "currency",
                                      currency: "BRL",
                                    },
                                  )}
                                </Text>
                                <Pressable
                                  style={cardapioStyle.btnDetalhes}
                                  onPress={() =>
                                    router.navigate("/detalhe-produto")
                                  }
                                >
                                  <Image
                                    style={cardapioStyle.imgDetalhes}
                                    source={require("@/assets/images/img/mais.png")}
                                  />
                                </Pressable>
                              </View>
                            </View>
                          </View>
                        ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
