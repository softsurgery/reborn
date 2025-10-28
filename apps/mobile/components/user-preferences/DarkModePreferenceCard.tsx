import React from "react";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useColorScheme } from "~/lib/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DarkModePreferenceCardProps {
  className?: string;
}

export const DarkModePreferenceCard = ({
  className,
}: DarkModePreferenceCardProps) => {
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  const onPersistPress = async () => {
    // Toggle color scheme
    toggleColorScheme();

    try {
      // Persist the new theme
      const newTheme = isDarkColorScheme ? "light" : "dark";
      await AsyncStorage.setItem("@theme_preference", newTheme);
    } catch (err) {
      console.error("Failed to persist theme:", err);
    }
  };

  return (
    <View
      className={cn("flex-row items-center justify-between gap-2", className)}
    >
      <View className="flex flex-col items-start">
        <Label className="text-2xl font-bold" onPress={onPersistPress}>
          Dark Mode
        </Label>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          Switch between light and dark themes
        </Text>
      </View>
      <Switch checked={isDarkColorScheme} onCheckedChange={onPersistPress} />
    </View>
  );
};
