import React from "react";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import Toastable from "react-native-toastable";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
export { ErrorBoundary } from "expo-router";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";

import "~/global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const authPersistStore = useAuthPersistStore();
  const preferencePersistStore = usePreferencePersistStore();
  const isDarkMode = React.useMemo(
    () => preferencePersistStore.theme === "dark",
    [preferencePersistStore.theme]
  );

  return (
    <View className={cn("flex-1", isDarkMode ? "dark" : "light")}>
      <QueryClientProvider client={queryClient}>
        <Toastable
          statusMap={{
            success: isDarkMode
              ? NAV_THEME.dark.primary
              : NAV_THEME.light.primary,
            danger: isDarkMode
              ? NAV_THEME.dark.destructive
              : NAV_THEME.light.destructive,
            warning: "green",
            info: isDarkMode
              ? NAV_THEME.dark.notification
              : NAV_THEME.light.notification,
          }}
          position="top"
        />
        <StatusBar style={isDarkMode ? "dark" : "light"} translucent />
        <Stack
          screenOptions={{
            contentStyle: {
              flex: 1,
              backgroundColor: isDarkMode
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background,
            },
            headerStyle: {
              backgroundColor: isDarkMode
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background,
            },
            headerTintColor: isDarkMode
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
              animation: "fade",
              animationDuration: 200,
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
              animation: "fade",
              animationDuration: 200,
            }}
          />
          {/* Account */}
          <Stack.Screen
            name="account/managment"
            options={{
              title: "My Profile",
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
            name="account/user-preferences"
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
          {/* Explore */}
          <Stack.Screen
            name="explore/job-search"
            options={{
              title: "Job Search",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="explore/job-details"
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="explore/user-profile"
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="test"
            options={{
              title: "TEST",
              animation: "slide_from_right",
            }}
          />
        </Stack>
        <PortalHost />
      </QueryClientProvider>
    </View>
  );
}
