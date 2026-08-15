import React from "react";
import { Stack } from "expo-router";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          title: "",
          headerShown: false,
          headerRight: () => <ThemeToggle />,
          animation: "fade",
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "",
          headerShown: false,
          headerRight: () => <ThemeToggle />,
          animation: "fade",
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="legal"
        options={{
          title: "Legal",
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 200,
        }}
      />
    </Stack>
  );
}
