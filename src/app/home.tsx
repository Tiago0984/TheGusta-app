import { useCallback, useRef, useState } from "react";
import { router, useFocusEffect } from "expo-router";
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
import { useCliente } from "@/hooks/use-cliente";
import { useFavoritos } from "@/hooks/use-favoritos";
import { BotaoFavorito, MensagemFavoritos } from "@/components/favoritos";

import { IMAGEM } from "@/config/api";
import {
  ApiError,
  getBanners,
  getCategorias,
  getProdutos,
  type Banner,
  type Categoria,
  type Produto,
} from "@/services/api";

export default function HomeScreen() {
  const { cliente, fotoUrl, erro: erroCliente, atualizarCliente } = useCliente();
  const { erro: erroFavoritos, atualizarFavoritos } = useFavoritos();
  const [fotoClienteErro, setFotoClienteErro] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerSemImagem, setBannerSemImagem] = useState<number[]>([]);
  const [larguraBanner, setLarguraBanner] = useState(0);

  const produtosEmDestaque = produtos.filter((produto) => produto.destaque_produto === "SIM");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDados = useCallback(async () => {
    try {
      const [produtosData, categoriasData, bannersData] = await Promise.all([
        getProdutos(),
        getCategorias(),
        getBanners(),
      ]);
      setErro("");

      const produtosAtivos = produtosData.filter((produto) => produto.status_produto === "ATIVO");
      setProdutos(produtosAtivos);

      // A API já devolve as categorias em ordem alfabética
      const categoriasAtivas = categoriasData.filter(
        (categoria) => categoria.status_categoria === "ATIVO",
      );
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

  const catalogoSolicitado = useRef(false);
  useFocusEffect(useCallback(() => {
    if (catalogoSolicitado.current) return;
    catalogoSolicitado.current = true;
    void carregarDados();
  }, [carregarDados]));

  function tentarCarregarDados() {
    setCarregando(true);
    setErro("");
    void carregarDados();
  }

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
        Number(produto.id_categoria) === Number(categoria.id_categoria),
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

  return (
    <View style={globalStyle.container}>
      <ImageBackground
        source={require("@/assets/images/img/00_fundo.png")}
        style={globalStyle.background}
        resizeMode="cover"
      >
        <SafeAreaView style={globalStyle.areaConteudo}>
          <ScrollView style={globalStyle.scrollConteudo}>
            {erroCliente ? (
              <Pressable onPress={atualizarCliente} accessibilityRole="button" accessibilityLabel="Tentar carregar perfil novamente">
                <Text style={{ color: "#B42318", textAlign: "center" }}>{erroCliente} Toque para tentar novamente.</Text>
              </Pressable>
            ) : null}
            <View style={homeStyle.header}>
              <View style={homeStyle.conteudo}>
                <Text style={homeStyle.titulo}>
                  Olá, {cliente?.nome_cliente ?? "Cliente"}
                </Text>
                <View style={homeStyle.bordaPerfil}>
                  <Image
                    style={homeStyle.perfil}
                    source={
                      fotoUrl && fotoClienteErro !== fotoUrl
                        ? { uri: fotoUrl }
                        : require("@/assets/images/img/user.png")
                    }
                    onError={() => setFotoClienteErro(fotoUrl)}
                    accessibilityLabel="Foto do perfil"
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
                    onPress={tentarCarregarDados}
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

                    <MensagemFavoritos erro={erroFavoritos} tentarNovamente={atualizarFavoritos} />
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
                                <BotaoFavorito idProduto={produto.id_produto} nomeProduto={produto.nome_produto} estiloBotao={homeStyle.btnFavorito} estiloTexto={homeStyle.txtFavorito} />
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
                                    {Number(
                                      produto.valor_produto,
                                    ).toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    })}
                                  </Text>
                                  <Pressable
                                    style={homeStyle.btnDetalhes}
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
