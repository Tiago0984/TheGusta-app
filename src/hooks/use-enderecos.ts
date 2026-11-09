import { useFocusEffect } from "expo-router";
import { useCallback, useSyncExternalStore } from "react";
import { carregarEnderecos, estadoEnderecos, observarEnderecos } from "@/services/enderecos";

export function useEnderecos() {
  const estado = useSyncExternalStore(observarEnderecos, estadoEnderecos, estadoEnderecos);
  useFocusEffect(useCallback(() => { void carregarEnderecos(); }, []));
  return { ...estado, atualizarEnderecos: carregarEnderecos };
}
