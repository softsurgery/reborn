import React from "react";
import { Stack, useRootNavigationState } from "expo-router";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "nativewind";
import { ThemeProvider } from "@react-navigation/native";
import { NAV_THEME } from "~/lib/theme";
import "~/global.css";
import "../i18n";
import { Platform, View } from "react-native";
import { cn } from "~/lib/utils";
import { useNotifications } from "~/hooks/content/notifications/useNotification";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { Toaster } from "sonner-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { NotificationContext } from "@/contexts/NotificationContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useColorPalette } from "@/hooks/useColorPalette";
import { usePreferencePersistStore } from "@/hooks/stores/usePreferencePersistStore";
import * as SplashScreen from "expo-splash-screen";
import { splashPrevented } from "@/lib/splash-screen";
import { asyncStoragePersister, queryClient } from "@/lib/query-client";
import { LoaderProvider } from "@/contexts/LoaderContext";

export { ErrorBoundary } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function RootLayoutContent() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { newCount, notifications, resetCount } = useNotifications();
  const [ready, setReady] = React.useState(false);

  const isDarkColorScheme = colorScheme === "dark";

  // Wait for navigation context to load
  const navigationState = useRootNavigationState();
  React.useEffect(() => {
    if (navigationState) {
      setReady(true);
    }
  }, [navigationState]);

  if (!ready) return null;
  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotificationContext.Provider
          value={{ newCount, notifications, resetCount }}
        >
          <View
            className={cn("flex-1 light dark:dark bg-background")}
            style={{
              paddingBottom: Platform.OS === "ios" ? 0 : insets.bottom,
            }}
          >
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  flex: 1,
                  backgroundColor: isDarkColorScheme
                    ? NAV_THEME.dark.colors.background
                    : NAV_THEME.light.colors.background,
                },
                headerStyle: {
                  backgroundColor: isDarkColorScheme
                    ? NAV_THEME.dark.colors.card
                    : NAV_THEME.light.colors.card,
                },
                headerTintColor: isDarkColorScheme
                  ? NAV_THEME.dark.colors.text
                  : NAV_THEME.light.colors.text,
                headerTitleStyle: {
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 18,
                  color: isDarkColorScheme
                    ? NAV_THEME.dark.colors.text
                    : NAV_THEME.light.colors.text,
                },
              }}
            />
            <Toaster
              duration={1000}
              style={{
                backgroundColor: isDarkColorScheme
                  ? NAV_THEME.dark.colors.card
                  : NAV_THEME.light.colors.card,
              }}
            />
            <PortalHost />
          </View>
        </NotificationContext.Provider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorPalette();
  const isPreferenceReady = usePreferencePersistStore((state) => state.isReady);

  React.useEffect(() => {
    if (!isPreferenceReady) return;

    void (async () => {
      try {
        await splashPrevented;
        await SplashScreen.hideAsync();
      } catch {}
    })();
  }, [isPreferenceReady]);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          maxAge: 1000 * 60 * 60 * 24,
        }}
      >
        <SafeAreaProvider>
          <LoaderProvider>
            <RootLayoutContent />
          </LoaderProvider>
        </SafeAreaProvider>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
