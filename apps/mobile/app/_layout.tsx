import React from "react";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import "~/global.css";
import "../i18n";
import { useColorScheme } from "nativewind";
import { ThemeProvider } from "@react-navigation/native";
import { NAV_THEME } from "~/lib/theme";

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

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}
