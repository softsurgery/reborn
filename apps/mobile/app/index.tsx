import React from "react";
import { SplashScreen } from "expo-router";
import { Platform } from "react-native";
import Application from "~/components/Application";
import { Loader } from "~/components/shared/Loader";
import OnBoarding from "~/components/OnBoarding";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useColorScheme } from "~/lib/useColorScheme";

export default function Screen() {
  const { isAuthenticated, isReady: isAuthPersistStoreReady } =
    useAuthPersistStore();

  const { setColorScheme } = useColorScheme();
  const { theme, isReady: isPreferencePersistStoreReady } =
    usePreferencePersistStore();
  const isDarkMode = React.useMemo(() => theme === "dark", [theme]);

  React.useEffect(() => {
    try {
      if (isPreferencePersistStoreReady) {
        setAndroidNavigationBar(isDarkMode ? "light" : "dark");

        if (Platform.OS === "web") {
          document.documentElement.classList.add("bg-background");
        }
        setColorScheme(theme == "dark" ? "dark" : "light");
        setAndroidNavigationBar(theme);
      }
    } finally {
      SplashScreen.hideAsync();
    }
  }, [isDarkMode]);

  if (!isAuthPersistStoreReady && !isPreferencePersistStoreReady)
    return <Loader />;
  if (isAuthenticated) return <Application />;
  return <OnBoarding />;
}
