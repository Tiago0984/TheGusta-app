import { useState, useEffect, useRef, useCallback } from "react";
import {
  ActivityIndicator,
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

import { IMAGEM } from "@/config/api";
import { ApiError, getCategorias, getProdutos } from "@/services/api";

export default function CardapioScreen() {
  const [favoritos, setFavoritos] = useState(Array(20).fill(false));

  // Estado para armazenar os produtos e categorias carregados da API (Listar produtos e categorias)
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [semImagem, setSemImagem] = useState<Number[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const { categoria, busca: buscaParam } = useLocalSearchParams();

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const [produtosData, categoriasData] = await Promise.all([
        getProdutos(),
        getCategorias(),
      ]);

      const produtosAtivos = produtosData
        .filter((produto) => produto.status_produto === "ATIVO")
        .map((produto) => ({
          ...produto,
          favorito: false,
        }))
        .sort((a, b) => a.nome_produto.localeCompare(b.nome_produto));
      setProdutos(produtosAtivos);

      const categoriasAtivas = categoriasData
        .filter((categoria) => categoria.status_categoria === "ATIVO")
        .sort((a, b) => a.ordem_categoria - b.ordem_categoria);
      setCategorias(categoriasAtivas);
    } catch (error) {
      console.log("Erro ao carregar os dados do cardápio", error);
      setErro(
        error instanceof ApiError
          ? error.message
          : "Não foi possível carregar os dados.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    if (buscaParam) {
      const texto = String(buscaParam);
      setTextoBusca(texto);
      setBusca(texto);
    }

  },[buscaParam]);

  // Estado para armazenar o texto digitado no campo de busca (Buscar produtos)
  const [textoBusca, setTextoBusca] = useState(String(buscaParam ?? ""));
  const [busca, setBusca] = useState(String(buscaParam ?? ""));

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome_produto.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  const categoriasComProdutos = categorias.filter((categoria) =>
    produtosFiltrados.some(
      (produto) =>
        produto.categoria_produto.id_categoria === categoria.id_categoria,
    ),
  );

  const scrollRef = useRef<ScrollView>(null);
  const posicaoCategoria = useRef<{ [key: number]: number }>({});
  const scrollInicial = useRef(false);

  useEffect(() => {
    if (!categoria || scrollInicial.current) {
      return;
    }
    const idCategoria = Number(categoria);
    const intervalo = setTimeout(() => {
      const posicao = posicaoCategoria.current[idCategoria];
      if (posicao != undefined) {
        scrollRef.current?.scrollTo({
          y: posicao,
          animated: true,
        });
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
                    value={textoBusca}
                    onChangeText={setTextoBusca}
                    onSubmitEditing={() => setBusca(textoBusca)}
                  />
                  <Pressable
                    style={cardapioStyle.btnBuscar}
                    onPress={() => setBusca(textoBusca)}
                  >
                    <Image
                      style={cardapioStyle.imgBuscar}
                      source={require("@/assets/images/img/lupa.png")}
                    />
                  </Pressable>
                </View>

                {carregando ? (
                  <View style={cardapioStyle.semDestaque}>
                    <ActivityIndicator size="large" color={cores.laranja} />
                  </View>
                ) : erro ? (
                  <View style={cardapioStyle.semDestaque}>
                    <Text style={cardapioStyle.txtSemDestaque}>{erro}</Text>
                    <Pressable
                      style={cardapioStyle.btnTentarNovo}
                      onPress={carregarDados}
                    >
                      <Text style={cardapioStyle.txtTentarNovo}>
                        Tentar de novo
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <>
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

                {produtosFiltrados.length > 0 ? (
                  categoriasComProdutos.map((categoria) => (
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
                        {produtosFiltrados
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
                                    {Number(
                                      produto.valor_produto,
                                    ).toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    })}
                                  </Text>
                                  <Pressable
                                    style={cardapioStyle.btnDetalhes}
                                    onPress={() =>
                                      router.push({
                                        pathname: "/detalhe-produto",
                                        params: {
                                          slug: produto.slug_produto,
                                        },
                                        })
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
                  ))
                ) : (
                  <View style={cardapioStyle.semDestaque}>
                    <Text style={cardapioStyle.txtSemDestaque}>
                      Nenhum produto encontrado
                    </Text>
                  </View>
                )}
                  </>
                )}
              </View>
            </View>
          </ScrollView>

          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
