import React from "react";
import { Stack } from "expo-router";
import { NAV_THEME } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import { SceneProvider } from "~/components/shared/scene-builder/SceneContext";

export default function MainLayout() {
  const { colorScheme } = useColorScheme();

  const isDarkColorScheme = colorScheme === "dark";

  const [scenes, setScenes] = React.useState<{
    [key: string]: any;
  }>({});

  return (
    <SceneProvider
      value={{
        scenes,
        setScenes,
      }}
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "",
            headerShown: false,
            animation: "fade_from_bottom",
            animationDuration: 200,
          }}
        />
        {/* Main Application */}
        <Stack.Screen
          name="(tabs)"
          options={{
            title: "",
            headerShown: false,
            animation: "fade_from_bottom",
            animationDuration: 200,
          }}
        />
        {/* Account */}
        <Stack.Screen
          name="account/managment"
          options={{
            title: "My Profile",
            headerShown: false,
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
            title: "",
            animation: "slide_from_bottom",
            animationDuration: 300,
            headerStyle: {
              backgroundColor: isDarkColorScheme
                ? NAV_THEME.dark.colors.background
                : NAV_THEME.light.colors.background,
            },
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
          name="explore/inspect-profile"
          options={{
            title: "",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        {/* My Space */}
        <Stack.Screen
          name="my-space/index"
          options={{
            title: "",
            headerShown: false,
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
        {/* Scene */}
        <Stack.Screen
          name="scene-screen"
          options={{
            title: "",
            headerShown: false,
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
    </SceneProvider>
  );
}
