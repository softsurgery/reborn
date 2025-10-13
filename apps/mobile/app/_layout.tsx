import React from "react";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "~/lib/constants";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toastable from "react-native-toastable";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { View } from "react-native";
import "~/global.css";
import { cn } from "~/lib/utils";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const preferencePersistStore = usePreferencePersistStore();
  const isDarkMode = React.useMemo(
    () => preferencePersistStore.theme === "dark",
    [preferencePersistStore.theme]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toastable position="top" />
      <View className={cn("flex-1", isDarkMode ? "dark" : "light")}>
        <StatusBar style={isDarkMode ? "light" : "dark"} translucent />

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
                ? NAV_THEME.dark.card
                : NAV_THEME.light.card,
            },
            headerTintColor: isDarkMode
              ? NAV_THEME.dark.text
              : NAV_THEME.light.text,
            headerTitleStyle: {
              fontFamily: "Poppins-SemiBold",
              fontSize: 18,
              color: isDarkMode ? NAV_THEME.dark.text : NAV_THEME.light.text,
            },
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
              headerShown: false,
            }}
          />

          {/* Explore */}
          <Stack.Screen
            name="explore/new-job"
            options={{
              title: "New Job",
            }}
          />
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
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="explore/user-profile"
            options={{
              title: "",
              animation: "slide_from_right",
            }}
          />

          {/* My Space */}
          <Stack.Screen
            name="my-space/index"
            options={{
              headerTitle: "My Space",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/requests"
            options={{
              headerTitle: "Requests",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/saved"
            options={{
              headerTitle: "Saved",
              animation: "slide_from_right",
            }}
          />

          {/* Test */}
          <Stack.Screen
            name="test"
            options={{
              title: "TEST",
              animation: "slide_from_right",
            }}
          />
        </Stack>
        <PortalHost />
      </View>
    </QueryClientProvider>
  );
}
