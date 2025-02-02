import React from "react";
import "~/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "~/context/AuthContext";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    regular: {
      fontFamily: "System",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "System",
      fontWeight: "600",
    },
    heavy: {
      fontFamily: "System",
      fontWeight: "700",
    },
  },
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {
    regular: {
      fontFamily: "System",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "System",
      fontWeight: "600",
    },
    heavy: {
      fontFamily: "System",
      fontWeight: "700",
    },
  },
};

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <ToastProvider>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <Stack>
                {/* Auth */}
                <Stack.Screen
                  name="index"
                  options={{
                    title: "",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="auth/sign-in-screen"
                  options={{
                    title: "",
                    headerRight: () => <ThemeToggle />,
                  }}
                />
                <Stack.Screen
                  name="auth/sign-up-screen"
                  options={{
                    title: "",
                    headerRight: () => <ThemeToggle />,
                  }}
                />
                {/* Account */}
                <Stack.Screen
                  name="settings/app-settings/profile-managment"
                  options={{
                    title: "Profile Management",
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="settings/app-settings/profile/update-profile"
                  options={{
                    title: "Update Profile",
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="settings/app-settings/user-preferences"
                  options={{
                    title: "User Preferences",
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="settings/support/report-bug"
                  options={{
                    title: "Report a Bug",
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="settings/support/send-feedback"
                  options={{
                    title: "Send us feedback",
                    animation: "slide_from_right",
                  }}
                />
                {/* Chat */}
                <Stack.Screen
                  name="chat/conversation"
                  options={{
                    title: "Chat",
                    animation: "slide_from_bottom",
                    headerBackTitle:"Chat"
                  }}
                />
              </Stack>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
      <PortalHost />
    </React.Fragment>
  );
}
