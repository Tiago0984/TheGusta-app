import { Tela } from "@/components/tela";
import { useEnderecos } from "@/hooks/use-enderecos";
import { definirEnderecoPrincipal, excluirEndereco, selecionarEndereco, type Endereco } from "@/services/enderecos";
import { observarSessao } from "@/services/sessao";
import estilos from "@/styles/enderecosStyle";
import { cores } from "@/styles/variaveis";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, Text, View } from "react-native";

export default function EnderecosScreen() {
  const { enderecos, idSelecionado, carregando, carregado, processando, erro, atualizarEnderecos } = useEnderecos();
  const [exclusao, setExclusao] = useState<Endereco | null>(null);
  useEffect(() => observarSessao(() => setExclusao(null)), []);
  useFocusEffect(useCallback(() => () => setExclusao(null), []));
  const bloqueado = carregando || processando || !carregado || !!erro;
  const tentar = (operacao: () => Promise<void>) => { void operacao().catch(() => undefined); };

  return <Tela titulo="Endereços" subtitulo="Gerencie seus endereços de entrega"
    voltar={() => router.canGoBack() ? router.back() : router.replace("/configuracao")}>
    {carregando || processando ? <ActivityIndicator color={cores.laranja} accessibilityLabel={processando ? "Salvando endereço" : "Carregando endereços"} /> : null}
    {erro ? <View style={estilos.mensagem}>
      <Text accessibilityRole="alert" style={estilos.txtMensagem}>{erro}</Text>
      <Pressable accessibilityRole="button" disabled={carregando || processando} style={estilos.btnAdicionar} onPress={() => void atualizarEnderecos()}>
        <Text style={estilos.txtAdicionar}>Tentar novamente</Text>
      </Pressable>
    </View> : null}
    {carregado && !carregando && !erro && enderecos.length === 0 ? <Text style={estilos.txtMensagem}>Nenhum endereço cadastrado.</Text> : null}
    <View style={estilos.listaEnderecos}>
      {enderecos.map((item) => <View key={item.id_endereco} style={estilos.cardEndereco}>
        <View style={estilos.linhaTopo}>
          <View style={estilos.tituloLinha}>
            <View style={estilos.iconEndereco}><Image style={estilos.imgIconEndereco} source={require("@/assets/images/img/local.png")} /></View>
            <Text style={estilos.tituloEndereco}>{item.nome_endereco}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={`Definir ${item.nome_endereco} como principal`}
            disabled={bloqueado || item.principal_endereco === "SIM"}
            onPress={() => tentar(() => definirEnderecoPrincipal(item.id_endereco))}>
            <Text style={estilos.txtFavorito}>{item.principal_endereco === "SIM" ? "★" : "☆"}</Text>
          </Pressable>
        </View>
        <View style={estilos.linhaConteudo}>
          <View style={estilos.enderecoDetalhes}>
            <Text style={estilos.linhaEndereco}>{item.endereco}, {item.numero}</Text>
            {item.complemento ? <Text style={estilos.linhaEndereco}>{item.complemento}</Text> : null}
            <Text style={estilos.linhaEndereco}>{item.bairro}</Text>
            <Text style={estilos.linhaEndereco}>{item.cidade} - {item.uf}</Text>
            <Text style={estilos.linhaEndereco}>CEP {item.cep}</Text>
            {item.principal_endereco === "SIM" ? <Text style={estilos.txtBadgeAtivo}>Endereço principal</Text> : null}
          </View>
          <Pressable accessibilityRole="radio" aria-checked={idSelecionado === item.id_endereco}
            accessibilityLabel={`Usar endereço ${item.nome_endereco}`} disabled={bloqueado}
            style={[idSelecionado === item.id_endereco ? estilos.badgeAtivo : estilos.badgeUsar, bloqueado && estilos.desabilitado]}
            onPress={() => selecionarEndereco(item.id_endereco)}>
            <Text style={idSelecionado === item.id_endereco ? estilos.txtBadgeAtivo : estilos.txtBadgeUsar}>
              {idSelecionado === item.id_endereco ? "Selecionado" : "Usar este endereço"}
            </Text>
          </Pressable>
        </View>
        <View style={estilos.divisorEndereco} />
        <View style={estilos.linhaBotoes}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Editar endereço ${item.nome_endereco}`} disabled={bloqueado}
            style={[estilos.btnEditar, bloqueado && estilos.desabilitado]} onPress={() => router.push({ pathname: "/editar-endereco", params: { id: item.id_endereco } })}>
            <Text style={estilos.txtEditar}>Editar</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Excluir endereço ${item.nome_endereco}`} disabled={bloqueado}
            style={[estilos.btnExcluir, bloqueado && estilos.desabilitado]} onPress={() => setExclusao(item)}>
            <Text style={estilos.txtExcluir}>Excluir</Text>
          </Pressable>
        </View>
      </View>)}
    </View>
    <Pressable accessibilityRole="button" disabled={carregando || processando} style={estilos.btnAdicionar} onPress={() => router.push("/editar-endereco")}>
      <Text style={estilos.txtAdicionar}>+ Adicionar novo endereço</Text>
    </Pressable>
    <Text style={estilos.txtMensagem}>A estrela define o endereço principal. “Usar este endereço” seleciona o destino desta compra.</Text>
    <Modal visible={exclusao !== null} transparent animationType="fade" onRequestClose={() => { if (!processando) setExclusao(null); }}>
      <View style={estilos.fundoModal}><View style={estilos.cardModal}>
        <Text style={estilos.tituloEndereco}>Excluir endereço?</Text>
        <Text style={estilos.txtMensagem}>{exclusao?.nome_endereco}</Text>
        <Pressable accessibilityRole="button" disabled={processando} style={estilos.btnAdicionar} onPress={() => {
          if (!exclusao) return;
          const id = exclusao.id_endereco;
          setExclusao(null);
          tentar(() => excluirEndereco(id));
        }}><Text style={estilos.txtAdicionar}>Confirmar exclusão</Text></Pressable>
        <Pressable accessibilityRole="button" disabled={processando} style={estilos.btnCancelar} onPress={() => setExclusao(null)}>
          <Text style={estilos.txtCancelar}>Cancelar exclusão</Text>
        </Pressable>
      </View></View>
    </Modal>
  </Tela>;
}
