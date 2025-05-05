import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "~/context/AuthContext";
import "~/global.css";
import { cn } from "~/lib/utils";

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
  const [colorScheme, setColorScheme] = React.useState<"light" | "dark">(
    "light"
  );
  const [isDarkColorScheme, setIsDarkColorScheme] = React.useState(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        const resolvedTheme = storedTheme === "dark" ? "dark" : "light";

        setColorScheme(resolvedTheme);
        setIsDarkColorScheme(resolvedTheme === "dark");

        await AsyncStorage.setItem("theme", resolvedTheme);
        setAndroidNavigationBar(resolvedTheme);

        if (Platform.OS === "web") {
          document.documentElement.classList.add("bg-background");
        }
      } finally {
        setIsColorSchemeLoaded(true);
        SplashScreen.hideAsync();
      }
    };

    loadTheme();
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <View className={cn("flex-1", isDarkColorScheme && "dark")}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <ToastProvider>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <Stack
                screenOptions={{
                  contentStyle: {
                    flex: 1,
                    backgroundColor: isDarkColorScheme
                      ? NAV_THEME.dark.background
                      : NAV_THEME.light.background,
                  },
                  headerStyle: {
                    backgroundColor: isDarkColorScheme
                      ? NAV_THEME.dark.background
                      : NAV_THEME.light.background,
                  },
                  headerTintColor: isDarkColorScheme
                    ? NAV_THEME.dark.text
                    : NAV_THEME.light.text,
                }}
              >
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
                    headerStyle: {
                      backgroundColor: "black",
                    },
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
                    headerBackTitle: "Chat",
                  }}
                />
              </Stack>
              <PortalHost />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </View>
  );
}
