import type { ImagePickerAsset } from "expo-image-picker";
import { Platform } from "react-native";

import { atualizarFotoCliente, estadoCliente } from "@/services/cliente";
import { apiRequest, ApiError } from "@/services/http";
import { lerToken } from "@/services/sessao";

const LIMITE_FOTO = 2 * 1024 * 1024;
const tipos = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);

function validarArquivo(tipo: string, tamanho?: number) {
  if (!tipos.has(tipo)) throw new ApiError("Escolha uma imagem JPG, PNG ou WEBP.");
  if (tamanho !== undefined && (!Number.isFinite(tamanho) || tamanho <= 0)) {
    throw new ApiError("Não foi possível ler o tamanho da imagem.");
  }
  if (tamanho !== undefined && tamanho > LIMITE_FOTO) {
    throw new ApiError("A imagem deve ter no máximo 2 MB.");
  }
}

export async function enviarFotoPerfil(foto: ImagePickerAsset, idCliente: number) {
  if (estadoCliente().cliente?.id_cliente !== idCliente) {
    throw new ApiError("O perfil foi alterado. Abra novamente a tela de perfil.");
  }
  if (!foto.uri) throw new ApiError("Não foi possível ler a imagem selecionada.");
  let tipo = foto.file?.type || foto.mimeType || "image/jpeg";
  validarArquivo(tipo, foto.fileSize);
  const tokenEsperado = await lerToken();
  const form = new FormData();
  if (Platform.OS === "web") {
    const arquivo = foto.file ?? await fetch(foto.uri).then((resposta) => {
      if (!resposta.ok) throw new ApiError("Não foi possível ler a imagem selecionada.");
      return resposta.blob();
    });
    if (!arquivo) throw new ApiError("Não foi possível ler a imagem selecionada.");
    tipo = arquivo.type || tipo;
    validarArquivo(tipo, arquivo.size);
    form.append("foto_cliente", arquivo, `foto.${tipos.get(tipo)}`);
  } else {
    // O FormData nativo aceita descritores de arquivo, embora o tipo DOM exija Blob.
    form.append("foto_cliente", {
      uri: foto.uri,
      name: `foto.${tipos.get(tipo)}`,
      type: tipo,
    } as unknown as Blob);
  }
  const { data } = await apiRequest<{ foto_cliente: string }>("/cliente/foto", {
    autenticado: true,
    tokenEsperado,
    method: "POST",
    body: form,
  });
  if (!data || typeof data.foto_cliente !== "string" || !data.foto_cliente.trim()) {
    throw new ApiError("Não foi possível confirmar a nova foto. Atualize o perfil para conferir.");
  }
  atualizarFotoCliente(data.foto_cliente, idCliente);
}
