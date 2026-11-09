import { useSyncExternalStore } from "react";
import { Pressable, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

import { alterarFavorito, estadoFavoritos, observarFavoritos } from "@/services/favoritos";

export function BotaoFavorito({ idProduto, nomeProduto, estiloBotao, estiloTexto }: {
  idProduto: number;
  nomeProduto: string;
  estiloBotao: StyleProp<ViewStyle>;
  estiloTexto: StyleProp<TextStyle>;
}) {
  const estado = useSyncExternalStore(observarFavoritos, estadoFavoritos, estadoFavoritos);
  const favorito = estado.ids.includes(Number(idProduto));
  const processando = estado.processando.includes(Number(idProduto));
  const desabilitado = estado.carregando || processando || (!estado.carregado && Boolean(estado.erro));
  return (
    <Pressable
      style={[estiloBotao, desabilitado && estilos.processando]}
      onPress={() => { void alterarFavorito(Number(idProduto)); }}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={`${favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}: ${nomeProduto}`}
      aria-pressed={favorito}
      aria-disabled={desabilitado}
      aria-busy={desabilitado}
    >
      <Text style={estiloTexto}>{favorito ? "★" : "☆"}</Text>
    </Pressable>
  );
}

export function MensagemFavoritos({ erro, tentarNovamente }: { erro: string; tentarNovamente: () => Promise<void> }) {
  if (!erro) return null;
  return (
    <Pressable onPress={tentarNovamente} accessibilityRole="button" accessibilityLabel="Tentar carregar favoritos">
      <Text style={estilos.erro} accessibilityRole="alert">{erro} Toque para tentar novamente.</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  erro: { color: "#B42318", textAlign: "center", marginVertical: 10 },
  processando: { opacity: 0.5 },
});
