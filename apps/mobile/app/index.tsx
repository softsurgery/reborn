import React from "react";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import * as Font from "expo-font";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { ActivityIndicator, Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { useTranslation } from "react-i18next";
import * as NavigationBar from "expo-navigation-bar";

SplashScreen.preventAutoHideAsync();

export default function ScreenRedirect() {
  const { i18n } = useTranslation();
  const { setColorScheme } = useColorScheme();
  const preferencePersistStore = usePreferencePersistStore();
  const isDarkMode = React.useMemo(
    () => preferencePersistStore.theme === "dark",
    [preferencePersistStore.theme]
  );

  const [fontsLoaded] = Font.useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-BlackItalic": require("../assets/fonts/Poppins/Poppins-BlackItalic.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-BoldItalic": require("../assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraBoldItalic": require("../assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
    "Poppins-ExtraLightItalic": require("../assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins/Poppins-Italic.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-LightItalic": require("../assets/fonts/Poppins/Poppins-LightItalic.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-MediumItalic": require("../assets/fonts/Poppins/Poppins-MediumItalic.ttf"),
    Poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-SemiBoldItalic": require("../assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins/Poppins-Thin.ttf"),
    "Poppins-ThinItalic": require("../assets/fonts/Poppins/Poppins-ThinItalic.ttf"),
  });

  React.useEffect(() => {
    if (fontsLoaded && preferencePersistStore.isReady) {
      // Set system color scheme
      setColorScheme(preferencePersistStore.theme);
      i18n.changeLanguage(preferencePersistStore.language);

      // Set Android navigation bar
      setAndroidNavigationBar(isDarkMode ? "light" : "dark");

      // Apply web background if on web
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }

      SplashScreen.hideAsync();
      if (Platform.OS === "android") {
        NavigationBar.setVisibilityAsync("hidden");
        NavigationBar.setBehaviorAsync("overlay-swipe");
      }
      router.replace("/main");
    }
  }, [
    fontsLoaded,
    preferencePersistStore.theme,
    preferencePersistStore.isReady,
  ]);

  return <ActivityIndicator size="large" />;
}
