import * as Notifications from "expo-notifications";
import React from "react";
import { Platform } from "react-native";

export async function showNotification(title: string, body: string) {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null, // immediate
  });
}

export function useNotificationPermissions() {
  React.useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permission not granted!");
      }
    }
    requestPermissions();
  }, []);
}
