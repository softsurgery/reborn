import React from "react";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import * as Font from "expo-font";
import { setAndroidNavigationBar } from "@reborn/mobile-components";
import { ActivityIndicator, Appearance, Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { usePreferencePersistStore } from "@reborn/hooks/stores";
import { useTranslation } from "@reborn/i18n";
import * as Localization from "expo-localization";

SplashScreen.preventAutoHideAsync();

export default function ScreenRedirect() {
  const { i18n } = useTranslation();
  const { setColorScheme } = useColorScheme();
  const preferencePersistStore = usePreferencePersistStore();

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

  const hasBootstrapped = React.useRef(false);

  React.useEffect(() => {
    if (!preferencePersistStore.isReady || hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    setTimeout(() => {
      setColorScheme(preferencePersistStore.theme);
      if (Platform.OS === "android") {
        const activeTheme =
          preferencePersistStore.theme === "system"
            ? (Appearance.getColorScheme() ?? "light")
            : preferencePersistStore.theme;
        setAndroidNavigationBar(activeTheme === "dark" ? "dark" : "light");
      }

      let lang = preferencePersistStore.language;
      if (lang === "system") {
        lang =
          (Localization.getLocales()[0]?.languageCode as "en" | "fr" | "ar") ||
          "en";
      }
      i18n.changeLanguage(lang);
      router.replace("/main");
    }, 100);
  }, [preferencePersistStore.isReady, fontsLoaded]);

  return <ActivityIndicator className="flex-1" size="large" />;
}
