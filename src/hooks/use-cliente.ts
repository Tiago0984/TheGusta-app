import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { API } from "@/config/api";

// Carrega o cliente logado pelo token salvo no login
export function useCliente() {
  const [cliente, setCliente] = useState<any>(null);

  useEffect(() => {
    async function carregarCliente() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/");
          return;
        }
        const resposta = await fetch(`${API}/cliente`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await resposta.json();

        // 401: "Sessão expirada. Faça login novamente."
        if (resposta.status === 401) {
          await AsyncStorage.removeItem("token");
          router.replace("/");
          return;
        }

        if (!resposta.ok) {
          console.log("Erro ao carregar cliente:", json.message);
          return;
        }

        setCliente(json.data);
      } catch (error) {
        console.log("Erro ao carregar cliente:", error);
      }
    }
    carregarCliente();
  }, []);

  return cliente;
}
