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

SplashScreen.preventAutoHideAsync();

export default function Screen() {
  const { isAuthenticated, isReady: isAuthPersistStoreReady } =
    useAuthPersistStore();
  const { setColorScheme } = useColorScheme();
  const { theme, isReady: isPreferencePersistStoreReady } =
    usePreferencePersistStore();

  const isDarkMode = React.useMemo(() => theme === "dark", [theme]);

  const [fontsLoaded] = Font.useFonts({
    Poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins/Poppins-Thin.ttf"),
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

  if (isAuthenticated) return <Application />;
  return <OnBoarding />;
}
