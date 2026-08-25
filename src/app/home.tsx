import { useState } from "react";
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
export default function HomeScreen() {
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

              <Image style={homeStyle.banner}
                source={require("@/assets/images/img/banner.png")}
                resizeMode="stretch"
              />

              <View style={homeStyle.categoria}>
                <Text style={homeStyle.tituloSecao}>Categoria</Text>
                <View style={homeStyle.conteudoCategoria}>
                    <View style={homeStyle.itemCategoria}>
                        <Image style={homeStyle.imgCategoria}
                        source={require("@/assets/images/img/bolo.png")}
                        />
                        <Text style={homeStyle.txtCategoria}>Bolos</Text>
                    </View>
                    <View style={homeStyle.itemCategoria}>
                        <Image style={homeStyle.imgCategoria}
                         source={require("@/assets/images/img/brigadeiro.png")}
                        
                        />
                        <Text style={homeStyle.txtCategoria}>Doces</Text>
                    </View>
                    <View style={homeStyle.itemCategoria}>
                        <Image style={homeStyle.imgCategoria}
                         source={require("@/assets/images/img/torta.png")}

                        />
                        <Text style={homeStyle.txtCategoria}>Tortas</Text>
                    </View>
                    <View style={homeStyle.itemCategoria}>
                        <Image style={homeStyle.imgCategoria}
                         source={require("@/assets/images/img/copo-de-plastico.png")}
                        
                        />
                        <Text style={homeStyle.txtCategoria}>Bebidas</Text>
                    </View>
                    <View style={homeStyle.itemCategoria}>
                        <Image style={homeStyle.imgCategoria}
                        source={require("@/assets/images/img/presente-de-supermercado.png")}
                        
                        />
                        <Text style={homeStyle.txtCategoria}>Kits</Text>
                    </View>
                </View>
              </View>

            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
