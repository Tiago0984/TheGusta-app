import { useFocusEffect } from "expo-router";
import { useCallback, useSyncExternalStore } from "react";

import { carregarCliente, estadoCliente, observarCliente } from "@/services/cliente";
import { IMAGEM } from "@/config/api";

export function useCliente() {
  const estado = useSyncExternalStore(observarCliente, estadoCliente, estadoCliente);

  useFocusEffect(useCallback(() => {
    void carregarCliente();
  }, []));

  const caminhoFoto = estado.cliente?.foto_cliente;
  const fotoUrl = caminhoFoto
    ? `${IMAGEM}/${caminhoFoto}${caminhoFoto.includes("?") ? "&" : "?"}v=${estado.versaoFoto}`
    : null;
  return { ...estado, fotoUrl, atualizarCliente: carregarCliente };
}
