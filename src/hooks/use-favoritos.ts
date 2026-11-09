import { useFocusEffect } from "expo-router";
import { useCallback, useSyncExternalStore } from "react";

import { alterarFavorito, carregarFavoritos, estadoFavoritos, observarFavoritos } from "@/services/favoritos";

export function useFavoritos(chave?: string) {
  const estado = useSyncExternalStore(observarFavoritos, estadoFavoritos, estadoFavoritos);
  useFocusEffect(useCallback(() => {
    if (chave === "") return;
    void carregarFavoritos();
  }, [chave]));
  return { ...estado, alterarFavorito, atualizarFavoritos: carregarFavoritos };
}
