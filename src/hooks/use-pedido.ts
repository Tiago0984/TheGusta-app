import { cancelarPedido, consultarPedido, consultarStatusPedido, type PedidoDetalhado } from "@/services/pedidos";
import { ApiError } from "@/services/http";
import { observarSessao } from "@/services/sessao";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

const mensagem = (erro: unknown) => erro instanceof ApiError && erro.status === 404
  ? "Pedido não encontrado ou indisponível para esta conta." : erro instanceof Error ? erro.message : "Não foi possível consultar o pedido.";

export function usePedido(id: number) {
  const [pedido, setPedido] = useState<PedidoDetalhado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");
  const [erroAcao, setErroAcao] = useState("");
  const revisao = useRef(0);
  const ocupado = useRef(false);

  const carregar = useCallback(async () => {
    if (ocupado.current) return;
    const atual = ++revisao.current;
    ocupado.current = true;
    setCarregando(true); setErro(""); setErroAcao(""); setPedido(null);
    try {
      const resposta = await consultarPedido(id);
      if (atual === revisao.current) setPedido(resposta);
    } catch (error) { if (atual === revisao.current) setErro(mensagem(error)); }
    finally { if (atual === revisao.current) { ocupado.current = false; setCarregando(false); setProcessando(false); } }
  }, [id]);

  useEffect(() => observarSessao(() => {
    revisao.current += 1; ocupado.current = false;
    setPedido(null); setCarregando(false); setProcessando(false); setErroAcao("");
    setErro("A sessão foi alterada. Atualize o pedido para continuar.");
  }), []);
  useFocusEffect(useCallback(() => {
    void carregar();
    return () => { revisao.current += 1; ocupado.current = false; };
  }, [carregar]));

  async function executar(cancelar: boolean) {
    if (ocupado.current || !pedido || erroAcao || (cancelar && pedido.status_venda !== "PENDENTE")) return;
    ocupado.current = true;
    const atual = ++revisao.current;
    setProcessando(true); setErroAcao("");
    try {
      const status = await (cancelar ? cancelarPedido(id) : consultarStatusPedido(id));
      let novo = pedido;
      if (cancelar) novo = { ...pedido, ...status, itens: pedido.itens.map((item) => ({ ...item, status_item: "CANCELADO" })) };
      else if (status.status_venda !== pedido.status_venda) novo = await consultarPedido(id);
      else novo = { ...pedido, ...status };
      if (atual === revisao.current) setPedido(novo);
    } catch (error) { if (atual === revisao.current) setErroAcao(mensagem(error)); }
    finally { if (atual === revisao.current) { ocupado.current = false; setProcessando(false); } }
  }
  return { pedido, carregando, processando, erro, erroAcao, carregar, atualizarStatus: () => executar(false), cancelar: () => executar(true) };
}
