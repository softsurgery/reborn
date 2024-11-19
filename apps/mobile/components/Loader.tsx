import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

interface LoaderProps {
  size?: "small" | "large";
  color?: string;
  reverse?: boolean;
}

export const Loader = ({ size = "large", color, reverse = false }: LoaderProps) => {
  const { isDarkColorScheme } = useColorScheme();

  const themeColor =
    color ||
    (reverse
      ? isDarkColorScheme
        ? "#000000"
        : "#ffffff"
      : isDarkColorScheme
      ? "#ffffff"
      : "#000000");
      
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} color={themeColor} />
    </View>
  );
};
