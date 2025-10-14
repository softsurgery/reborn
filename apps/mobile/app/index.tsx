import React from "react";
import * as Font from "expo-font";
import { SplashScreen } from "expo-router";
import { Platform } from "react-native";
import { Loader } from "~/components/shared/Loader";
import Application from "~/components/Application";
import OnBoarding from "~/components/OnBoarding";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useColorScheme } from "~/lib/useColorScheme";
import { useLocalSearchParams } from "expo-router/build/hooks";

SplashScreen.preventAutoHideAsync();

export default function Screen() {
  const { defaultTab } = useLocalSearchParams();
  const { isAuthenticated, isReady: isAuthPersistStoreReady } =
    useAuthPersistStore();
  const { setColorScheme } = useColorScheme();
  const { theme, isReady: isPreferencePersistStoreReady } =
    usePreferencePersistStore();

  const isDarkMode = React.useMemo(() => theme === "dark", [theme]);

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
    if (
      isPreferencePersistStoreReady &&
      isAuthPersistStoreReady &&
      fontsLoaded
    ) {
      setAndroidNavigationBar(isDarkMode ? "light" : "dark");

      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }

      setColorScheme(theme === "dark" ? "dark" : "light");
      setAndroidNavigationBar(theme);

      SplashScreen.hideAsync();
    }
  }, [
    fontsLoaded,
    isPreferencePersistStoreReady,
    isAuthPersistStoreReady,
    isDarkMode,
  ]);

  if (
    !fontsLoaded ||
    !isAuthPersistStoreReady ||
    !isPreferencePersistStoreReady
  )
    return <Loader isPending />;

  if (isAuthenticated)
    return (
      <Application
        defaultTab={defaultTab as "explore" | "messages" | "balance" | "menu"}
      />
    );
  return <OnBoarding />;
}
