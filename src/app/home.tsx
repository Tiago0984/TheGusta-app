import { useCallback, useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import globalStyle from "@/styles/globalStyle";
import homeStyle from "@/styles/homeStyle";
import { cores } from "@/styles/variaveis";
import FooterScreen from "@/app/footer";

import { IMAGEM } from "@/config/api";
import { ApiError, getBanners, getCategorias, getProdutos } from "@/services/api";



export default function HomeScreen() {
  const [favoritos, setFavoritos] = useState([false, false, false]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerSemImagem, setBannerSemImagem] = useState<number[]>([]);
  const [larguraBanner, setLarguraBanner] = useState(0);

  function alternarFavorito(indice: number) {
    setFavoritos((atual) =>
      atual.map((valor, i) => (i === indice ? !valor : valor)),
    );
  }

  const [produtosEmDestaque, setProdutosEmDestaque] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const [produtosData, categoriasData, bannersData] = await Promise.all([
        getProdutos(),
        getCategorias(),
        getBanners(),
      ]);

      const produtosAtivos = produtosData
        .filter((produto) => produto.status_produto === "ATIVO")
        .map((produto) => ({
          ...produto,
          favorito: false,
        }));
      setProdutos(produtosAtivos);
      setProdutosEmDestaque(
        produtosAtivos.filter((produto) => produto.destaque_produto === "SIM"),
      );

      const categoriasAtivas = categoriasData
        .filter((categoria) => categoria.status_categoria === "ATIVO")
        .sort((a, b) => a.ordem_categoria - b.ordem_categoria);
      setCategorias(categoriasAtivas);

      const bannersAtivos = bannersData.filter(
        (banner) => banner.status_banner === "ATIVO",
      );

      // Embaralha os banners para exibir em ordem aleatoria
      for (let i = bannersAtivos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bannersAtivos[i], bannersAtivos[j]] = [
          bannersAtivos[j],
          bannersAtivos[i],
        ];
      }
      setBanners(bannersAtivos);
    } catch (error) {
      console.log("Erro ao carregar os dados da home", error);
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

  const [textoBusca, setTextoBusca] = useState("");

  function buscarProduto() {
    router.push({
      pathname: "/cardapio",
      params: {
        busca: textoBusca,
      },
    });
  }

  const categoriasComProdutos = categorias.filter((categoria) =>
    produtos.some(
      (produto) =>
        produto.categoria_produto.id_categoria === categoria.id_categoria,
    ),
  );

  const [semImagem, setSemImagem] = useState<number[]>([]);

  // const [produtosDestaque, setProdutosDestaque] = useState([
  //   {
  //     id: 1,
  //     nome: "Bolo de banana fit",
  //     descricao: "Banana prata com canela e gergilim da Noruega",
  //     categoria: "Bolos",
  //     valor: "R$ 75,90",
  //     imagem: require("@/assets/images/img/bolo01.png"),
  //     status: "ativo",
  //     favorito: false,
  //   },
  //   {
  //     id: 2,
  //     nome: "Bolo de cenoura",
  //     descricao: "Bolo de cenoura com cobertura de chocolate",
  //     categoria: "Bolos",
  //     valor: "R$ 75,90",
  //     imagem: require("@/assets/images/img/bolo01.png"),
  //     status: "ativo",
  //     favorito: false,
  //   },
  //   {
  //     id: 3,
  //     nome: "Brigadeiro Gourmet",
  //     descricao: "Brigadeiro de chocolate com cobertura de chantily",
  //     categoria: "Doces",
  //     valor: "R$ 75,90",
  //     imagem: require("@/assets/images/img/bolo01.png"),
  //     status: "ativo",
  //     favorito: false,
  //   },
  //   {
  //     id: 4,
  //     nome: "Bolo de aveia",
  //     descricao: "Massa integral de aveia com banana caramelizada e nozes",
  //     categoria: "Bolos",
  //     valor: "R$ 75,90",
  //     imagem: require("@/assets/images/img/bolo01.png"),
  //     status: "ativo",
  //     favorito: false,
  //   },

  // ]);

  function alterarFavorito(id: number) {
    setProdutosEmDestaque((produtoFavorito) =>
      produtoFavorito.map((produto) =>
        produto.id_produto === id
          ? { ...produto, favorito: !produto.favorito }
          : produto,
      ),
    );
  }

  return (
    <View style={globalStyle.container}>
      <ImageBackground
        source={require("@/assets/images/img/00_fundo.png")}
        style={globalStyle.background}
        resizeMode="cover"
      >
        <SafeAreaView style={globalStyle.areaConteudo}>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={homeStyle.header}>
              <View style={homeStyle.conteudo}>
                <Text style={homeStyle.titulo}>Olá, Cliente</Text>
                <View style={homeStyle.bordaPerfil}>
                  <Image
                    style={homeStyle.perfil}
                    source={require("@/assets/images/img/user.png")}
                  />
                </View>
              </View>
              <Text style={homeStyle.subtitulo}>
                O que vai adoçar seu dia hoje?
              </Text>
            </View>
            <View style={homeStyle.main}>
              <View style={homeStyle.buscarProduto}>
                <TextInput
                  style={homeStyle.txtProduto}
                  placeholder="Buscar produto"
                  placeholderTextColor={cores.cinza}
                  value={textoBusca}
                  onChangeText={setTextoBusca}
                  onSubmitEditing={buscarProduto}
                />
                <Pressable style={homeStyle.btnBuscar} onPress={buscarProduto}>
                  <Image
                    style={homeStyle.imgBuscar}
                    source={require("@/assets/images/img/lupa.png")}
                  />
                </Pressable>
              </View>

              {carregando ? (
                <View style={homeStyle.semDestaque}>
                  <ActivityIndicator size="large" color={cores.laranja} />
                </View>
              ) : erro ? (
                <View style={homeStyle.semDestaque}>
                  <Text style={homeStyle.txtSemDestaque}>{erro}</Text>
                  <Pressable
                    style={homeStyle.btnTentarNovo}
                    onPress={carregarDados}
                  >
                    <Text style={homeStyle.txtTentarNovo}>Tentar de novo</Text>
                  </Pressable>
                </View>
              ) : (
                <>
              <View
                style={homeStyle.areaBanner}
                onLayout={(event) =>
                  setLarguraBanner(event.nativeEvent.layout.width)
                }
              >
                {banners.length > 0 ? (
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                  >
                    {banners.map((banner) => {
                      const semFoto =
                        bannerSemImagem.includes(banner.id_banner) ||
                        !banner.foto_banner;

                      return (
                        <Image
                          key={banner.id_banner}
                          style={[
                            homeStyle.banner,
                            { width: larguraBanner },
                            semFoto && homeStyle.bannerVazio,
                          ]}
                          resizeMode={semFoto ? "contain" : "cover"}
                          source={
                            semFoto
                              ? require("@/assets/images/img/sem-imagem.png")
                              : { uri: `${IMAGEM}/${banner.foto_banner}` }
                          }
                          onError={() => {
                            setBannerSemImagem((imagem) => [
                              ...imagem,
                              banner.id_banner,
                            ]);
                          }}
                        />
                      );
                    })}
                  </ScrollView>
                ) : (
                  <Image
                    style={[homeStyle.banner, homeStyle.bannerVazio]}
                    source={require("@/assets/images/img/sem-imagem.png")}
                    resizeMode="contain"
                  />
                )}
              </View>

              <View style={homeStyle.categoria}>
                <Text style={homeStyle.tituloSecao}>Categoria</Text>

                <View style={homeStyle.conteudoCategoria}>
                  {categoriasComProdutos.map((categoria, indice) => (
                    <Pressable
                      key={categoria.id_categoria}
                      onPress={() =>
                        router.push({
                          pathname: "/cardapio",
                          params: {
                            categoria: categoria.id_categoria.toString(),
                          },
                        })
                      }
                      style={[
                        homeStyle.itemCategoria,
                        (indice + 1) % 3 !== 0 && homeStyle.espacoCategoria,
                      ]}
                    >
                      <Text style={homeStyle.txtCategoria}>
                        {categoria.nome_categoria}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={homeStyle.destaque}>
                  <Text style={homeStyle.tituloSecao}>Destaques</Text>
                  {produtosEmDestaque.length > 0 ? (
                    <ScrollView
                      contentContainerStyle={homeStyle.conteudoDestaque}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {/* CARD QUE IRA SE REPETIR */}
                      {produtosEmDestaque.map((produto) => (
                        <View
                          key={produto.id_produto}
                          style={homeStyle.itemDestaque}
                        >
                          <View style={homeStyle.caixaImagem}>
                            <Image
                              style={homeStyle.imgDestaque}
                              source={
                                semImagem.includes(produto.id_produto) ||
                                !produto.foto_produto
                                  ? { uri: `${IMAGEM}/produto/sem-imagem.png` }
                                  : { uri: `${IMAGEM}/${produto.foto_produto}` }
                              }
                              onError={() => {
                                setSemImagem((imagem) => [
                                  ...imagem,
                                  produto.id_produto,
                                ]);
                              }}
                            />
                            <Pressable
                              style={homeStyle.btnFavorito}
                              onPress={() =>
                                alterarFavorito(produto.id_produto)
                              }
                            >
                              <Text style={homeStyle.txtFavorito}>
                                {produto.favorito ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={homeStyle.infoDestaque}>
                            <Text style={homeStyle.txtDestaque}>
                              {produto.nome_produto}
                            </Text>
                            <Text style={homeStyle.txtDescricao}>
                              {produto.descricao_produto}
                            </Text>
                            <View style={homeStyle.rodapeDestaque}>
                              {/* <Text style={homeStyle.precoDestaque}>
                           R$ {Number(produto.valor_produto).toFixed(2).replace(".",",")}
                          </Text> */}
                              <Text style={homeStyle.precoDestaque}>
                                {Number(produto.valor_produto).toLocaleString(
                                  "pt-BR",
                                  { style: "currency", currency: "BRL" },
                                )}
                              </Text>
                              <Pressable
                                style={homeStyle.btnDetalhes}
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
                                  style={homeStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      ))}
                      {/* FINAL DO CARD */}
                    </ScrollView>
                  ) : (
                    <View style={homeStyle.semDestaque}>
                      <Text style={homeStyle.txtSemDestaque}>
                        Nenhum produto em destaque
                      </Text>
                    </View>
                  )}
                </View>
              </View>
                </>
              )}
            </View>
          </ScrollView>
          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
