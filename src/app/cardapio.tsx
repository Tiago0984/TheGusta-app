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
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import globalStyle from "@/styles/globalStyle";
import cardapioStyle from "@/styles/cardapioStyle";
import { cores } from "@/styles/variaveis";
import FooterScreen from "@/app/footer";

import { IMAGEM } from "@/config/api";
import { ApiError, getCategorias, getProdutos, type Categoria, type Produto } from "@/services/api";
import { useFavoritos } from "@/hooks/use-favoritos";
import { BotaoFavorito, MensagemFavoritos } from "@/components/favoritos";

export default function CardapioScreen() {
  const { erro: erroFavoritos, atualizarFavoritos } = useFavoritos();

  // Estado para armazenar os produtos e categorias carregados da API (Listar produtos e categorias)
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [semImagem, setSemImagem] = useState<number[]>([]);
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
        .sort((a, b) => a.nome_produto.localeCompare(b.nome_produto, "pt-BR"));
      setProdutos(produtosAtivos);

      // A API já devolve as categorias em ordem alfabética
      const categoriasAtivas = categoriasData.filter(
        (categoria) => categoria.status_categoria === "ATIVO",
      );
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

  const catalogoSolicitado = useRef(false);
  useFocusEffect(useCallback(() => {
    if (catalogoSolicitado.current) return;
    catalogoSolicitado.current = true;
    void carregarDados();
  }, [carregarDados]));

  // Estado para armazenar o texto digitado no campo de busca (Buscar produtos)
  const [textoBusca, setTextoBusca] = useState(String(buscaParam ?? ""));
  const [busca, setBusca] = useState(String(buscaParam ?? ""));
  const buscaRecebida = String(buscaParam ?? "");
  const [parametroAplicado, setParametroAplicado] = useState(buscaRecebida);
  if (parametroAplicado !== buscaRecebida) {
    setParametroAplicado(buscaRecebida);
    setTextoBusca(buscaRecebida);
    setBusca(buscaRecebida);
  }

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome_produto.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  const categoriasComProdutos = categorias.filter((categoria) =>
    produtosFiltrados.some(
      (produto) =>
        Number(produto.id_categoria) === Number(categoria.id_categoria),
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
      if (posicao !== undefined) {
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
                <MensagemFavoritos erro={erroFavoritos} tentarNovamente={atualizarFavoritos} />
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
                              Number(produto.id_categoria) ===
                              Number(categoria.id_categoria),
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
                                      ? require("@/assets/images/img/sem-imagem.png")
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
                                <BotaoFavorito idProduto={produto.id_produto} nomeProduto={produto.nome_produto} estiloBotao={cardapioStyle.btnFavorito} estiloTexto={cardapioStyle.txtFavorito} />
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
                                    accessibilityRole="button"
                                    accessibilityLabel={`Ver detalhes: ${produto.nome_produto}`}
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
