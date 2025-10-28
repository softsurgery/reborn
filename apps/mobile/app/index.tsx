import React from "react";
import { router, SplashScreen } from "expo-router";
import { useColorScheme } from "~/lib/useColorScheme";
import * as Font from "expo-font";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { Platform } from "react-native";
import { Loader } from "~/components/shared/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ScreenRedirect() {
  const { setColorScheme } = useColorScheme();
  const [theme, setTheme] = React.useState<"light" | "dark" | null>(null);

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
  // Load dark mode from AsyncStorage
  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("@theme_preference");
        if (storedTheme === "dark" || storedTheme === "light") {
          setTheme(storedTheme);
        } else {
          // fallback to system default
          setTheme(Platform.OS === "web" ? "light" : "dark");
        }
      } catch (err) {
        console.error("Failed to load theme from storage", err);
        setTheme("light");
      }
    };
    loadTheme();
  }, []);

  React.useEffect(() => {
    if (fontsLoaded && theme) {
      // Set system color scheme
      setColorScheme(theme);

      // Set Android navigation bar
      setAndroidNavigationBar(theme === "dark" ? "light" : "dark");

      // Apply web background if on web
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }

      SplashScreen.hideAsync();
      router.replace("/main");
    }
  }, [fontsLoaded, theme]);

  return null;
}
