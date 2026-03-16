import React from "react";
import { Stack } from "expo-router";
import { NAV_THEME } from "~/lib/theme";
import { useColorScheme } from "nativewind";
import { useCheckHealth } from "~/hooks/content/useCheckHealth";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";

export default function MainLayout() {
  const authPersistStore = useAuthPersistStore();
  const { colorScheme } = useColorScheme();
  const isDarkColorScheme = colorScheme === "dark";
  useCheckHealth({
    enabled: authPersistStore.isAuthenticated,
  });

  return (
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
          headerShown: false,
          title: "Update Profile",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="account/user-preferences"
        options={{
          title: "User Preferences",
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="account/support/report-bug"
        options={{
          headerShown: false,
          title: "Report a Bug",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="account/support/send-feedback"
        options={{
          headerShown: false,
          title: "Send us feedback",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="account/support/faqs"
        options={{
          headerShown: false,
          title: "FAQs",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="account/create-experience"
        options={{
          title: "Experiences",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account/update-experiences"
        options={{
          title: "Experiences",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account/update-experience"
        options={{
          title: "Edit Experiences",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account/delete-experience"
        options={{
          title: "Delete Experiences",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account/create-education"
        options={{
          title: "Create Education",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account/update-education"
        options={{
          title: "Edit Education",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account/update-educations"
        options={{
          title: "Educations",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account/delete-education"
        options={{
          title: "Delete Educations",
          headerShown: false,
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

      <Stack.Screen
        name="chat/conversation-details"
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
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          animation: "fade_from_bottom",
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: "Terms & Conditions",
          headerShown: false,
          animation: "fade_from_bottom",
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: "Privacy Policy",
          headerShown: false,
          animation: "fade_from_bottom",
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: "About Reborn",
          headerShown: false,
          animation: "fade_from_bottom",
          animationDuration: 200,
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
  );
}
