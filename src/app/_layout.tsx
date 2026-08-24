import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Oswald_400Regular, Oswald_700Bold} from "@expo-google-fonts/oswald"
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export const fontesCarregar = {
    Oswald_400Regular,
    Oswald_700Bold,
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontesCarregar);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}