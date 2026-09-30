import { useState, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
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

const SERVIDOR = "http://localhost:8081";
const API = `${SERVIDOR}/api/v1`;
const IMAGEM = `${SERVIDOR}/davilla/images`;

export default function HomeScreen() {
  const [favoritos, setFavoritos] = useState([false, false, false]);

  function alternarFavorito(indice: number) {
    setFavoritos((atual) =>
      atual.map((valor, i) => (i === indice ? !valor : valor)),
    );
  }

  const [produtosEmDestaque, setProdutosEmDestaque] = useState<any[]>([]);
  //Carregar as informações da API
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await fetch(`${API}/produtos`);
        const json = await resposta.json();

        const produtos = json.data
          .filter(
            (produto: any) =>
              produto.destaque_produto === "SIM" &&
              produto.status_produto === "ATIVO",
          )
          .map((produto: any) => ({
            ...produto,
            favorito: false,
          }));
        setProdutosEmDestaque(produtos);
      } catch (erro) {
        console.log("Erro ao carregar os produtos em destque", erro);
      }
    }
    carregarProdutos();
  }, []);
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
                />
                <Pressable style={homeStyle.btnBuscar}>
                  <Image
                    style={homeStyle.imgBuscar}
                    source={require("@/assets/images/img/lupa.png")}
                  />
                </Pressable>
              </View>

              <Image
                style={homeStyle.banner}
                source={require("@/assets/images/img/banner.png")}
                resizeMode="stretch"
              />

              <View style={homeStyle.categoria}>
                <Text style={homeStyle.tituloSecao}>Categoria</Text>
                <View style={homeStyle.conteudoCategoria}>
                  <View style={homeStyle.itemCategoria}>
                    <Image
                      style={homeStyle.imgCategoria}
                      source={require("@/assets/images/img/bolo.png")}
                    />
                    <Text style={homeStyle.txtCategoria}>Bolos</Text>
                  </View>
                  <View style={homeStyle.itemCategoria}>
                    <Image
                      style={homeStyle.imgCategoria}
                      source={require("@/assets/images/img/brigadeiro.png")}
                    />
                    <Text style={homeStyle.txtCategoria}>Doces</Text>
                  </View>
                  <View style={homeStyle.itemCategoria}>
                    <Image
                      style={homeStyle.imgCategoria}
                      source={require("@/assets/images/img/torta.png")}
                    />
                    <Text style={homeStyle.txtCategoria}>Tortas</Text>
                  </View>
                  <View style={homeStyle.itemCategoria}>
                    <Image
                      style={homeStyle.imgCategoria}
                      source={require("@/assets/images/img/copo-de-plastico.png")}
                    />
                    <Text style={homeStyle.txtCategoria}>Bebidas</Text>
                  </View>
                  <View style={homeStyle.itemCategoria}>
                    <Image
                      style={homeStyle.imgCategoria}
                      source={require("@/assets/images/img/presente-de-supermercado.png")}
                    />
                    <Text style={homeStyle.txtCategoria}>Kits</Text>
                  </View>
                </View>
              </View>

              <View style={homeStyle.destaque}>
                <Text style={homeStyle.tituloSecao}>Destaques</Text>
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
                          onPress={() => alterarFavorito(produto.id_produto)}
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
                          {produto.descricao}
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
                            onPress={() => router.navigate("/detalhe-produto")}
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
              </View>
            </View>
          </ScrollView>
          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
