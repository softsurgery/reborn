import React, { Children } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toastable from "react-native-toastable";
import { ThemeToggle } from "~/components/ThemeToggle";
import { NotificationContext } from "~/contexts/NotificationContext";
import { NAV_THEME } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

const queryClient = new QueryClient();

export default function AppLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const [ready, setReady] = React.useState(false);

  // Wait for navigation context to load
  const navigationState = useRootNavigationState();
  React.useEffect(() => {
    if (navigationState) {
      setReady(true);
    }
  }, [navigationState]);

  if (!ready) return <View className="flex-1" />;
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationContext.Provider value={{}}>
        <Toastable position="top" />
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} translucent />

        <Stack
          screenLayout={({ children }) => (
            <View
              className={cn("flex-1", isDarkColorScheme ? "dark" : "light")}
            >
              {children}
            </View>
          )}
          screenOptions={{
            contentStyle: {
              flex: 1,
              backgroundColor: isDarkColorScheme
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background,
            },
            headerStyle: {
              backgroundColor: isDarkColorScheme
                ? NAV_THEME.dark.card
                : NAV_THEME.light.card,
            },
            headerTintColor: isDarkColorScheme
              ? NAV_THEME.dark.text
              : NAV_THEME.light.text,
            headerTitleStyle: {
              fontFamily: "Poppins-SemiBold",
              fontSize: 18,
              color: isDarkColorScheme
                ? NAV_THEME.dark.text
                : NAV_THEME.light.text,
            },
          }}
        >
          {/* Auth */}
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "",
              headerShown: false,
              animation: "fade",
              animationDuration: 200,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              title: "",
              headerShown: false,
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
              title: "",
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
              title: "",
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
              title: "",
              headerTitle: "My Space",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/requests"
            options={{
              title: "",
              headerTitle: "Requests",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/saved"
            options={{
              title: "",
              headerTitle: "Saved",
              animation: "slide_from_right",
            }}
          />
          {/* Notifications */}
          <Stack.Screen
            name="notifications"
            options={{
              title: "Notifications",
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
      </NotificationContext.Provider>
    </QueryClientProvider>
  );
}
