import FooterScreen from "@/app/footer";
import { IMAGEM } from "@/config/api";
import {
  alterarQuantidadeSacola, carregarSacola, ErroSacolaInvalida, limparSacola,
  removerDaSacola, subtotalSacola, type ItemSacola,
} from "@/config/sacola";
import { observarSessao } from "@/services/sessao";
import globalStyle from "@/styles/globalStyle";
import sacolaStyle from "@/styles/sacolaStyle";
import { cores } from "@/styles/variaveis";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const moeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ProdutoSacola({ item, bloqueado, alterar, remover }: {
  item: ItemSacola; bloqueado: boolean;
  alterar: (id: number, quantidade: number) => void;
  remover: (id: number) => void;
}) {
  const [semImagem, setSemImagem] = useState(false);
  return (
    <View style={sacolaStyle.itemSacola}>
      <Image style={sacolaStyle.imgItem}
        source={semImagem || !item.foto_produto ? require("@/assets/images/img/sem-imagem.png") : { uri: `${IMAGEM}/${item.foto_produto}` }}
        onError={() => setSemImagem(true)} accessibilityLabel={item.nome_produto} />
      <View style={sacolaStyle.centroItem}>
        <Text style={sacolaStyle.tituloItem}>{item.nome_produto}</Text>
        <Text style={sacolaStyle.descricaoItem} numberOfLines={3}>{item.descricao_produto}</Text>
        <View style={sacolaStyle.valoresItem}>
          <Text style={sacolaStyle.valorUnitItem}>{moeda(item.valor_produto)} un.</Text>
          <Text style={sacolaStyle.valorTotalItem}>{moeda(subtotalSacola([item]))}</Text>
        </View>
      </View>
      <View style={sacolaStyle.direitaItem}>
        <Pressable style={[sacolaStyle.btnExcluir, bloqueado && sacolaStyle.desabilitado]} accessibilityRole="button"
          accessibilityLabel={`Remover ${item.nome_produto} da sacola`} disabled={bloqueado} onPress={() => remover(item.id_produto)}>
          <Image style={sacolaStyle.imgExcluir} source={require("@/assets/images/img/lixeira.png")} />
        </Pressable>
        <View style={sacolaStyle.caixaQtde}>
          <Pressable style={sacolaStyle.btnQtde} accessibilityRole="button" accessibilityLabel={`Diminuir quantidade de ${item.nome_produto}`}
            disabled={bloqueado || item.quantidade <= 1} onPress={() => alterar(item.id_produto, item.quantidade - 1)}>
            <Image style={[sacolaStyle.imgQtde, (bloqueado || item.quantidade <= 1) && sacolaStyle.desabilitado]} source={require("@/assets/images/img/retirar.png")} />
          </Pressable>
          <Text style={sacolaStyle.quantidade} accessibilityLabel={`Quantidade de ${item.nome_produto}: ${item.quantidade}`}>{item.quantidade}</Text>
          <Pressable style={sacolaStyle.btnQtde} accessibilityRole="button" accessibilityLabel={`Aumentar quantidade de ${item.nome_produto}`}
            disabled={bloqueado || item.quantidade >= 99} onPress={() => alterar(item.id_produto, item.quantidade + 1)}>
            <Image style={[sacolaStyle.imgQtde, (bloqueado || item.quantidade >= 99) && sacolaStyle.desabilitado]} source={require("@/assets/images/img/adicionar.png")} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function SacolaScreen() {
  const [itens, setItens] = useState<ItemSacola[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [dadosInvalidos, setDadosInvalidos] = useState(false);
  const revisao = useRef(0);
  const ocupado = useRef(false);

  const carregar = useCallback(async () => {
    const atual = ++revisao.current;
    ocupado.current = true;
    setCarregando(true);
    setSalvando(false);
    setErro("");
    setDadosInvalidos(false);
    try {
      const lista = await carregarSacola();
      if (atual === revisao.current) setItens(lista);
    } catch (error) {
      if (atual === revisao.current) {
        setErro(error instanceof Error ? error.message : "Não foi possível carregar a sacola.");
        setDadosInvalidos(error instanceof ErroSacolaInvalida);
      }
    } finally {
      if (atual === revisao.current) {
        ocupado.current = false;
        setCarregando(false);
      }
    }
  }, []);

  useEffect(() => observarSessao(() => {
    revisao.current += 1;
    ocupado.current = false;
    setItens([]);
    setErro("A sessão foi alterada. Atualize a sacola para continuar.");
    setDadosInvalidos(false);
    setSalvando(false);
    setCarregando(false);
  }), []);

  useFocusEffect(useCallback(() => {
    void carregar();
    return () => {
      revisao.current += 1;
      ocupado.current = false;
    };
  }, [carregar]));

  async function modificar(operacao: () => Promise<ItemSacola[]>, recuperar = false) {
    if (ocupado.current || (erro && !recuperar)) return;
    ocupado.current = true;
    const atual = ++revisao.current;
    setSalvando(true);
    try {
      const lista = await operacao();
      if (atual === revisao.current) {
        setItens(lista);
        setErro("");
        setDadosInvalidos(false);
      }
    } catch (error) {
      if (atual === revisao.current) {
        setErro(error instanceof Error ? error.message : "Não foi possível alterar a sacola.");
        setDadosInvalidos(error instanceof ErroSacolaInvalida);
      }
    } finally {
      if (atual === revisao.current) {
        ocupado.current = false;
        setSalvando(false);
      }
    }
  }

  const bloqueado = carregando || salvando || !!erro;
  const subtotal = subtotalSacola(itens);

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={require("@/assets/images/img/00_fundo.png")} style={globalStyle.background} resizeMode="cover">
        <SafeAreaView style={globalStyle.areaConteudo}>
          <Pressable style={globalStyle.btnVoltar} accessibilityRole="button" accessibilityLabel="Voltar"
            onPress={() => router.canGoBack() ? router.back() : router.replace("/home")}>
            <Image style={globalStyle.imgVoltar} source={require("@/assets/images/img/voltar.png")} />
          </Pressable>
          <ScrollView style={globalStyle.scrollConteudo}>
            <View style={sacolaStyle.conteudo}>
              <View style={sacolaStyle.header}>
                <View style={sacolaStyle.ladoEsquerdo}>
                  <Text style={sacolaStyle.titulo}>Sacola</Text>
                  <Text style={sacolaStyle.subtitulo}>Confira seus produtos</Text>
                </View>
                <Image style={sacolaStyle.logo} source={require("@/assets/images/img/logo.png")} />
              </View>
              <View style={sacolaStyle.main}>
                {carregando ? <ActivityIndicator color={cores.laranja} accessibilityLabel="Carregando sacola" /> : null}
                {erro ? (
                  <View style={sacolaStyle.mensagem}>
                    <Text style={sacolaStyle.txtMensagem} accessibilityRole="alert">{erro}</Text>
                    <Pressable accessibilityRole="button" disabled={carregando || salvando} style={sacolaStyle.btnPagamento} onPress={() => void carregar()}>
                      <Text style={sacolaStyle.txtPagamento}>Tentar novamente</Text>
                    </Pressable>
                    {dadosInvalidos ? <Pressable accessibilityRole="button" disabled={carregando || salvando}
                      style={sacolaStyle.btnPagamento} onPress={() => void modificar(async () => { await limparSacola(); return []; }, true)}>
                      <Text style={sacolaStyle.txtPagamento}>Esvaziar sacola</Text>
                    </Pressable> : null}
                  </View>
                ) : null}
                {!carregando && !erro && itens.length === 0 ? (
                  <View style={sacolaStyle.mensagem}>
                    <Text style={sacolaStyle.txtMensagem}>Sua sacola está vazia.</Text>
                    <Pressable accessibilityRole="button" style={sacolaStyle.btnPagamento} onPress={() => router.navigate("/cardapio")}>
                      <Text style={sacolaStyle.txtPagamento}>Ver cardápio</Text>
                    </Pressable>
                  </View>
                ) : null}
                {!carregando ? itens.map((item) => <ProdutoSacola key={`${item.id_produto}-${item.foto_produto}`} item={item} bloqueado={bloqueado}
                  alterar={(id, quantidade) => void modificar(() => alterarQuantidadeSacola(id, quantidade))}
                  remover={(id) => void modificar(() => removerDaSacola(id))} />) : null}
                {salvando ? <ActivityIndicator color={cores.laranja} accessibilityLabel="Salvando sacola" /> : null}
                <View style={sacolaStyle.cupom}>
                  <View style={sacolaStyle.cupomEsquerdo}>
                    <Text style={sacolaStyle.txtCupom}>Cupom de desconto</Text>
                    <TextInput style={sacolaStyle.tituloCupom} placeholder="Indisponível no momento" editable={false} accessibilityLabel="Cupom de desconto indisponível" />
                  </View>
                  <Pressable disabled accessibilityRole="button" style={sacolaStyle.desabilitado}>
                    <Text style={sacolaStyle.txtAplicar}>Aplicar</Text>
                  </Pressable>
                </View>
                {!carregando && !erro ? <View style={sacolaStyle.subtotal}>
                  <View style={sacolaStyle.areaSubtotal}>
                    <Text style={sacolaStyle.txtSubtotal}>Subtotal dos produtos</Text>
                    <Text style={sacolaStyle.valorSubtotal} accessibilityLabel={`Subtotal dos produtos: ${moeda(subtotal)}`}>{moeda(subtotal)}</Text>
                  </View>
                  <View style={sacolaStyle.total}>
                    <Text style={sacolaStyle.txtTotal}>Total dos produtos</Text>
                    <Text style={sacolaStyle.valorTotal}>{moeda(subtotal)}</Text>
                  </View>
                </View> : null}
                <Pressable accessibilityRole="button" disabled={bloqueado || itens.length === 0}
                  style={[sacolaStyle.btnPagamento, (bloqueado || itens.length === 0) && sacolaStyle.desabilitado]}
                  onPress={() => { if (!ocupado.current && !bloqueado && itens.length) router.navigate("/pagamento"); }}>
                  <Text style={sacolaStyle.txtPagamento}>Continuar para pagamento</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
          <FooterScreen />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
