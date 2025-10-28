import React from "react";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useColorScheme } from "nativewind";

interface DarkModePreferenceCardProps {
  className?: string;
}

export const DarkModePreferenceCard = ({
  className,
}: DarkModePreferenceCardProps) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const isDarkColorScheme = colorScheme === "dark";

  return (
    <View
      className={cn("flex-row items-center justify-between gap-2", className)}
    >
      <View className="flex flex-col items-start">
        <Label className="text-2xl font-bold" onPress={toggleColorScheme}>
          Dark Mode
        </Label>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          Switch between light and dark themes
        </Text>
      </View>
      <Switch checked={isDarkColorScheme} onCheckedChange={toggleColorScheme} />
    </View>
  );
};
