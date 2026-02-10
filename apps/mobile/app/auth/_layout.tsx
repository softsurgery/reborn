import React from "react";
import { Stack } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";

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
        name="sign-up-carry-on"
        options={{
          title: "",
          headerShown: false,
          headerRight: () => <ThemeToggle />,
          animation: "fade",
          animationDuration: 200,
        }}
      />
    </Stack>
  );
}
