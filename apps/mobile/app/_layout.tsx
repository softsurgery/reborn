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
import "~/global.css";
import { cn } from "~/lib/utils";
import { DefaultToast } from "~/components/DefaultToast";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";

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
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const authPersistStore = useAuthPersistStore();
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();

  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");

        const resolvedTheme =
          storedTheme === "dark" || storedTheme === "light"
            ? storedTheme
            : colorScheme;

        setColorScheme(resolvedTheme);
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

  return (
    <View className={cn("flex-1", isDarkColorScheme && "dark")}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <ToastProvider
            renderToast={(toastOptions) => (
              <View pointerEvents="none">
                <DefaultToast {...toastOptions} />
              </View>
            )}
          >
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
                }}
              />
              <Stack.Screen
                name="auth/sign-in"
                options={{
                  title: "",
                  headerRight: () => <ThemeToggle />,
                  animation: "fade",
                  animationDuration: 200,
                }}
              />
              <Stack.Screen
                name="auth/sign-up"
                options={{
                  title: "",
                  headerRight: () => <ThemeToggle />,
                  animation: "fade",
                  animationDuration: 200,
                }}
              />
              <Stack.Screen
                name="auth/sign-up-carry-on"
                options={{
                  title: "",
                  headerRight: () => <ThemeToggle />,
                }}
              />
              <Stack.Screen
                name="application"
                options={{
                  title: "",
                }}
              />
              {/* Account */}
              <Stack.Screen
                name="account/managment"
                options={{
                  title: "Profile Management",
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="account/update-profile"
                options={{
                  title: "Update Profile",
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="account/preferences"
                options={{
                  title: "User Preferences",
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="account/support/report-bug"
                options={{
                  title: "Report a Bug",
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="account/support/send-feedback"
                options={{
                  title: "Send us feedback",
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="account/support/faqs"
                options={{
                  title: "FAQs",
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
              {/* Jobs */}
              <Stack.Screen
                name="job-details"
                options={{
                  title: "Job Details",
                  animation: "slide_from_right",
                }}
              />
            </Stack>
            <PortalHost />
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </View>
  );
}
