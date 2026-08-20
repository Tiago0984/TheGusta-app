import { StyleSheet } from "react-native";

const globalStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  
  background: {
    width: "100%",
    height: "100%",
    flex: 1,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "semibold",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 20,
    color: "#0400ffff",
  },

  logoMaior: {
    width: 160,
    height: 150,
  },

  areaConteudo: {
    flex: 1,
   
  },

  scrollConteudo: {
    flexGrow: 1,
  },

});

export default globalStyle;