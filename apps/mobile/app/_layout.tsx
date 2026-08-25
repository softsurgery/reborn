import React from "react";
import { Stack, useRootNavigationState } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import { hslToHex, NAV_THEME, THEME } from "~/lib/theme";
import "~/global.css";
import "../i18n";
import { Platform, View } from "react-native";
import { cn } from "~/lib/utils";
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
import { KeyboardProvider } from "react-native-keyboard-controller";

export { ErrorBoundary } from "expo-router";

interface RootLayoutContentProps {
  palette: typeof THEME.light | typeof THEME.dark;
  colorScheme: "light" | "dark";
}

function RootLayoutContent({ palette, colorScheme }: RootLayoutContentProps) {
  const insets = useSafeAreaInsets();

  const [ready, setReady] = React.useState(false);

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
                backgroundColor: hslToHex(palette.background),
              },
              headerStyle: {
                backgroundColor: hslToHex(palette.card),
              },
              headerTintColor: hslToHex(palette.foreground),
              headerTitleStyle: {
                fontFamily: "Poppins-SemiBold",
                fontSize: 18,
                color: hslToHex(palette.foreground),
              },
            }}
          />
          <Toaster
            duration={1000}
            style={{
              backgroundColor: hslToHex(palette.card),
            }}
          />
          <PortalHost />
        </View>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const { colorScheme, palette } = useColorPalette();
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
        <KeyboardProvider statusBarTranslucent>
          <SafeAreaProvider>
            <LoaderProvider>
              <RootLayoutContent
                colorScheme={colorScheme ?? "light"}
                palette={palette}
              />
            </LoaderProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
