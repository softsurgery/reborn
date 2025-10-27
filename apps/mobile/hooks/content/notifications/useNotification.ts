import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { ResponseNotificationDto } from "~/types/notifications";

const url = `${process.env.EXPO_PUBLIC_API_SOCKET_URL}/notifications`;

interface UseNotificationsOptions {}

export function useNotifications({}: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<ResponseNotificationDto[]>(
    []
  );
  const [newCount, setNewCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const authPersistStore = useAuthPersistStore();

  // 1️⃣ Request notification permissions
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permissions not granted");
      }
    }
    requestPermissions();
  }, []);

  // 2️⃣ Create Android notification channel
  useEffect(() => {
    async function createChannel() {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    }
    createChannel();
  }, []);

  // 3️⃣ Connect to the socket
  useEffect(() => {
    const socket = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${authPersistStore.accessToken}`,
      },
    });

    socketRef.current = socket;

    socket.on("notification", async (notification: ResponseNotificationDto) => {
      setNotifications((prev) => [...prev, notification]);
      setNewCount((prev) => prev + 1);

      // 4️⃣ Show local notification immediately
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.type || "New Notification",
          body: notification.type || "",
          sound: true,
        },
        trigger: null, // immediate
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authPersistStore.accessToken]);

  // Reset new notification count
  const resetCount = useCallback(() => {
    setNewCount(0);
  }, []);

  return {
    notifications,
    newCount,
    resetCount,
    socket: socketRef.current,
  };
}
