import { useSyncExternalStore } from "react";

const assinar = () => () => {};
const noCliente = () => true;
const noServidor = () => false;

// A exportação estática não conhece a query da URL. O primeiro HTML do cliente
// precisa coincidir com o servidor antes de renderizar campos dependentes dela.
export function useHidratado() {
  return useSyncExternalStore(assinar, noCliente, noServidor);
}
