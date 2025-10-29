import React from "react";
import { Stack } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function MainLayout() {
  return (
    <Stack>
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
  );
}
