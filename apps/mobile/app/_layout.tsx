import React from "react";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import "~/global.css";
import "../i18n";
import AppErrorBoundary from "./error";

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
  return (
    <AppErrorBoundary>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AppErrorBoundary>
  );
}
