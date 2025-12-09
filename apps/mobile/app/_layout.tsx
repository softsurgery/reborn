import React from "react";
import { Stack, useRootNavigationState } from "expo-router";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "nativewind";
import { ThemeProvider } from "@react-navigation/native";
import { NAV_THEME } from "~/lib/theme";
import "~/global.css";
import "../i18n";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { useNotifications } from "~/hooks/content/notifications/useNotification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContext } from "~/contexts/NotificationContext";
import Toastable from "react-native-toastable";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";

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

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
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
      <QueryClientProvider client={queryClient}>
        <NotificationContext.Provider
          value={{ newCount, notifications, resetCount }}
        >
          <View className={cn("flex-1 light dark:dark")}>
            <Toastable position="top" />
            <StatusBar
              style={isDarkColorScheme ? "light" : "dark"}
              translucent
            />
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
            <PortalHost />
          </View>
        </NotificationContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
