import { useFocusEffect } from "expo-router";
import { useCallback, useSyncExternalStore } from "react";

import { carregarCliente, estadoCliente, observarCliente } from "@/services/cliente";

export function useCliente() {
  const estado = useSyncExternalStore(observarCliente, estadoCliente, estadoCliente);

  useFocusEffect(useCallback(() => {
    void carregarCliente();
  }, []));

  return { ...estado, atualizarCliente: carregarCliente };
}
