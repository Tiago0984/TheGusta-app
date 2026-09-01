import { useState } from "react";
import { ImageBackground, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import globalStyle from "@/styles/globalStyle";
import cardapioStyle from "@/styles/cardapioStyle";
import { cores } from "@/styles/variaveis";
import FooterScreen from "@/app/footer";

export default function CardapioScreen() {
  const [favoritos, setFavoritos] = useState(
    Array(20).fill(false)
  );

  function alternarFavorito(indice: number) {
    setFavoritos((atual) =>
      atual.map((valor, i) => (i === indice ? !valor : valor))
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
                    <View style={cardapioStyle.itemCategoria}>
                        <Image style={cardapioStyle.imgCategoria}
                        source={require("@/assets/images/img/bolo.png")}
                        />
                        <Text style={cardapioStyle.txtCategoria}>Bolos</Text>
                    </View>
                    <View style={cardapioStyle.itemCategoria}>
                        <Image style={cardapioStyle.imgCategoria}
                         source={require("@/assets/images/img/brigadeiro.png")}
                        />
                        <Text style={cardapioStyle.txtCategoria}>Doces</Text>
                    </View>
                    <View style={cardapioStyle.itemCategoria}>
                        <Image style={cardapioStyle.imgCategoria}
                         source={require("@/assets/images/img/torta.png")}
                        />
                        <Text style={cardapioStyle.txtCategoria}>Tortas</Text>
                    </View>
                    <View style={cardapioStyle.itemCategoria}>
                        <Image style={cardapioStyle.imgCategoria}
                         source={require("@/assets/images/img/copo-de-plastico.png")}
                        />
                        <Text style={cardapioStyle.txtCategoria}>Bebidas</Text>
                    </View>
                    <View style={cardapioStyle.itemCategoria}>
                        <Image style={cardapioStyle.imgCategoria}
                        source={require("@/assets/images/img/presente-de-supermercado.png")}
                        />
                        <Text style={cardapioStyle.txtCategoria}>Kits</Text>
                    </View>
                </View>

                <View style={cardapioStyle.categorias}>
                    <Text style={cardapioStyle.tituloCategoria}>Bolos</Text>
                    <View style={cardapioStyle.produtos}>
                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(0)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[0] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(1)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[1] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com  canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(2)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[2] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(3)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[3] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                    </View>
                </View>

                <View style={cardapioStyle.categorias}>
                    <Text style={cardapioStyle.tituloCategoria}>Doces</Text>
                    <View style={cardapioStyle.produtos}>
                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(4)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[4] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(5)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[5] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(6)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[6] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(7)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[7] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                    </View>
                </View>

                <View style={cardapioStyle.categorias}>
                    <Text style={cardapioStyle.tituloCategoria}>Tortas</Text>
                    <View style={cardapioStyle.produtos}>
                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(8)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[8] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(9)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[9] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(10)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[10] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(11)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[11] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                    </View>
                </View>

                <View style={cardapioStyle.categorias}>
                    <Text style={cardapioStyle.tituloCategoria}>Bebidas</Text>
                    <View style={cardapioStyle.produtos}>
                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(12)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[12] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(13)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[13] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(14)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[14] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(15)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[15] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                    </View>
                </View>

                <View style={cardapioStyle.categorias}>
                    <Text style={cardapioStyle.tituloCategoria}>Kits</Text>
                    <View style={cardapioStyle.produtos}>
                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(16)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[16] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(17)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[17] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(18)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[18] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>

                        <View style={cardapioStyle.itemProduto}>
                          <View style={cardapioStyle.caixaImagem}>
                            <Image
                              style={cardapioStyle.imgDestaque}
                              source={require("@/assets/images/img/bolo01.png")}
                            />
                            <Pressable
                              style={cardapioStyle.btnFavorito}
                              onPress={() => alternarFavorito(19)}
                            >
                              <Text style={cardapioStyle.txtFavorito}>
                                {favoritos[19] ? "★" : "☆"}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={cardapioStyle.infoDestaque}>
                            <Text style={cardapioStyle.txtDestaque}>Bolo de Banana Fit</Text>
                            <Text style={cardapioStyle.txtDescricao}>
                              Banana Prata com canela e {'\n'} gergilim
                            </Text>
                            <View style={cardapioStyle.rodapeDestaque}>
                              <Text style={cardapioStyle.precoDestaque}>R$ 75,90</Text>
                              <Pressable style={cardapioStyle.btnDetalhes} onPress={() => router.navigate('/detalhe-produto')}>
                                <Image
                                  style={cardapioStyle.imgDetalhes}
                                  source={require("@/assets/images/img/mais.png")}
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                    </View>
                </View>

              </View>
            </View>
          </ScrollView>
          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
