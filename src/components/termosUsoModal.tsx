import { Modal, View, Text, ScrollView, Pressable } from "react-native";

import termosUsoStyle from "@/styles/termosUsoStyle";
import globalStyle from "@/styles/globalStyle";

interface TermosUsoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermosUsoModal({
  visible,
  onClose,
}: TermosUsoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={termosUsoStyle.sobrepor}>
        <View style={termosUsoStyle.conteudo}>
          <Text style={termosUsoStyle.titulo}>Termos de Uso</Text>

          <ScrollView style={termosUsoStyle.scroll}>
            <Text style={termosUsoStyle. subtitulo}>1. Aceitação dos Termos</Text>
            <Text style={termosUsoStyle.texto}>Ao criar a conta e ao utilizar o aplicativo TheGusta, você declara que leu, compreendeu
            e concorda com os termos de uso.</Text>            
            <Text style={termosUsoStyle. subtitulo}>2. Cadastro do Usuario</Text>
            <Text style={termosUsoStyle.texto}>Para utilizar o aplicativo é necessário se cadastrar.</Text>
            <Text style={termosUsoStyle. subtitulo}>3. Responsabilidade pela conta</Text> 
            <Text style={termosUsoStyle.texto}>O usuário é responsável por manter a confidencialidade de todos os seus dados de acesso.</Text> 
            <Text style={termosUsoStyle. subtitulo}>4. Utilização do aplicativo</Text>
            <Text style={termosUsoStyle.texto}>O aplicativo The Gusta poderá ser utilizado para fazer pedidos, verificar produtos e cadastrar informações pessoais.</Text>
            <Text style={termosUsoStyle. subtitulo}>5. Pedidos e Produtos</Text>
            <Text style={termosUsoStyle.texto}>A disponibilidade de produtos pode variar. Informações relacionadas a descrição do produto, preços e ingredientes serão apresentados no aplicativo</Text>
            <Text style={termosUsoStyle. subtitulo}>6. Pagamentos</Text>   
            <Text style={termosUsoStyle.texto}>As formas de pagamento são apresentadas durante a finalização do pedido. O usuário é responsavel pela veracidade das informações fornecidas para a realização do pagamento.</Text>       
          </ScrollView>

          <Pressable style={termosUsoStyle.btnEntendi} onPress={onClose}>
            <Text style={termosUsoStyle.txtEntendi}>Entendi</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
