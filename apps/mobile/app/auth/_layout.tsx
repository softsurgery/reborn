import React from "react";
import { Stack } from "expo-router";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useRTL } from "@/hooks/useRTL";

export default function AuthLayout() {
  const isRTL = useRTL();
  return (
    <Stack
      screenOptions={{
        // @ts-ignore: customAnimationOnGesture is supported by react-native-screens on iOS
        customAnimationOnGesture: true,
        fullScreenGestureEnabled: true,
      }}
    >
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
          animation: isRTL ? "slide_from_left" : "slide_from_right",
          animationDuration: 200,
        }}
      />
    </Stack>
  );
}
