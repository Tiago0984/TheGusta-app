import { Tela } from "@/components/tela";
import { useHidratado } from "@/hooks/use-hidratado";
import { consultarEndereco, salvarEndereco, type DadosEndereco } from "@/services/enderecos";
import { observarSessao } from "@/services/sessao";
import estilos from "@/styles/editarEnderecoStyle";
import { cores } from "@/styles/variaveis";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from "react-native";

const vazio: DadosEndereco = { nome_endereco: "", endereco: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "", cep: "" };
const campos = [
  { chave: "nome_endereco", label: "Nome do endereço", limite: 30, placeholder: "Ex.: Casa" },
  { chave: "endereco", label: "Logradouro", limite: 40, placeholder: "Rua ou avenida" },
  { chave: "numero", label: "Número", limite: 6, placeholder: "Número ou s/n" },
  { chave: "complemento", label: "Complemento (opcional)", limite: 50, placeholder: "Apartamento, bloco..." },
  { chave: "bairro", label: "Bairro", limite: 40, placeholder: "Bairro" },
  { chave: "cidade", label: "Cidade", limite: 40, placeholder: "Cidade" },
  { chave: "uf", label: "UF", limite: 2, placeholder: "SP" },
  { chave: "cep", label: "CEP", limite: 9, placeholder: "00000-000" },
] as const;

export default function EditarEnderecoScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const hidratado = useHidratado();
  if (!hidratado) return <Tela titulo="Endereço" subtitulo="Carregando endereço..."><ActivityIndicator color={cores.laranja} /></Tela>;
  const parametro = typeof id === "string" ? id : id === undefined ? undefined : "invalido";
  return <FormularioEndereco key={parametro ?? "novo"} parametro={parametro} />;
}

function FormularioEndereco({ parametro }: { parametro?: string }) {
  const id = parametro === undefined ? undefined : /^\d+$/.test(parametro) ? Number(parametro) : NaN;
  const invalido = id !== undefined && (!Number.isSafeInteger(id) || id <= 0);
  const [dados, setDados] = useState<DadosEndereco>(vazio);
  const [carregando, setCarregando] = useState(id !== undefined);
  const [pronto, setPronto] = useState(id === undefined);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const envio = useRef(false);
  const revisao = useRef(0);
  const focada = useRef(false);
  const iniciado = useRef(false);
  const sessaoValida = useRef(true);
  const sessaoFormulario = useRef(0);
  const confirmado = useRef(false);

  const carregar = useCallback(async () => {
    if (invalido) { setErro("Endereço inválido."); setCarregando(false); return; }
    if (id === undefined) { sessaoValida.current = true; setPronto(true); return; }
    const atual = ++revisao.current;
    setCarregando(true);
    setErro("");
    setPronto(false);
    try {
      const endereco = await consultarEndereco(id);
      if (atual === revisao.current) { setDados(endereco); setPronto(true); iniciado.current = true; sessaoValida.current = true; }
    } catch (error) {
      if (atual === revisao.current) setErro(error instanceof Error ? error.message : "Não foi possível carregar o endereço.");
    } finally {
      if (atual === revisao.current) setCarregando(false);
    }
  }, [id, invalido]);

  useEffect(() => observarSessao(() => {
    revisao.current += 1;
    sessaoFormulario.current += 1;
    sessaoValida.current = false;
    confirmado.current = false;
    iniciado.current = false;
    setDados(vazio);
    setPronto(false);
    setCarregando(false);
    setErro("A sessão foi alterada. Volte à lista de endereços.");
  }), []);
  useFocusEffect(useCallback(() => {
    focada.current = true;
    if (confirmado.current) router.replace("/enderecos");
    else if (!iniciado.current) void carregar();
    return () => { focada.current = false; revisao.current += 1; };
  }, [carregar]));

  const voltar = () => router.canGoBack() ? router.back() : router.replace("/enderecos");
  async function salvar() {
    if (envio.current || confirmado.current || !sessaoValida.current || !pronto || carregando || invalido) return;
    envio.current = true;
    const atual = revisao.current;
    const versao = sessaoFormulario.current;
    setSalvando(true);
    setErro("");
    try {
      await salvarEndereco(dados, id);
      if (versao !== sessaoFormulario.current) return;
      confirmado.current = true;
      setPronto(false);
      if (focada.current) voltar();
    } catch (error) {
      if (atual === revisao.current) setErro(error instanceof Error ? error.message : "Não foi possível salvar o endereço.");
    } finally { envio.current = false; setSalvando(false); }
  }

  return <Tela titulo={id === undefined ? "Novo endereço" : "Editar endereço"} subtitulo="Informe o destino das suas entregas" voltar={() => { if (!envio.current) voltar(); }}>
    {carregando ? <ActivityIndicator color={cores.laranja} accessibilityLabel="Carregando endereço" /> : null}
    {erro ? <Text style={estilos.mensagem} accessibilityRole="alert">{erro}</Text> : null}
    {!pronto && !carregando && !invalido && id !== undefined ? <Pressable accessibilityRole="button" style={estilos.btnSalvar} onPress={() => void carregar()}>
      <Text style={estilos.txtSalvar}>Tentar novamente</Text>
    </Pressable> : null}
    {pronto && !carregando ? <View style={estilos.cardFormulario}>
      {campos.map((campo) => <View style={estilos.campo} key={campo.chave}>
        <Image style={estilos.iconCampo} source={require("@/assets/images/img/local.png")} />
        <View style={estilos.campoTextos}>
          <Text style={estilos.campoLabel}>{campo.label}</Text>
          <TextInput style={estilos.campoInput} accessibilityLabel={campo.label} value={dados[campo.chave] ?? ""}
            placeholder={campo.placeholder} placeholderTextColor={cores.cinza} maxLength={campo.limite} editable={!salvando}
            keyboardType={campo.chave === "cep" ? "number-pad" : "default"} autoCapitalize={campo.chave === "uf" ? "characters" : "words"}
            onChangeText={(texto) => setDados((atual) => ({ ...atual, [campo.chave]: campo.chave === "uf" ? texto.toUpperCase() : texto }))} />
        </View>
      </View>)}
    </View> : null}
    <Pressable accessibilityRole="button" style={[estilos.btnSalvar, (!pronto || salvando) && estilos.desabilitado]} disabled={!pronto || salvando || carregando || invalido} onPress={() => void salvar()}>
      <Text style={estilos.txtSalvar}>{salvando ? "Salvando..." : id === undefined ? "Cadastrar endereço" : "Salvar alterações"}</Text>
    </Pressable>
    <Pressable accessibilityRole="button" style={estilos.btnCancelar} disabled={salvando} onPress={voltar}><Text style={estilos.txtCancelar}>Cancelar</Text></Pressable>
  </Tela>;
}
