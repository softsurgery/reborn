import React from "react";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { useColorScheme } from "~/lib/useColorScheme";

interface DarkModePreferenceCardProps {
  className?: string;
}

export const DarkModePreferenceCard = ({
  className,
}: DarkModePreferenceCardProps) => {
  const { toggleColorScheme } = useColorScheme();

  const preferencePersistStore = usePreferencePersistStore();

  const onPersistPress = () => {
    preferencePersistStore.toggleTheme();
    toggleColorScheme();
  };

  return (
    <View
      className={cn("flex-row items-center justify-between gap-2", className)}
    >
      <View className="flex flex-col items-start">
        <Label className="text-2xl font-bold" onPress={onPersistPress}>
          Dark Mode
        </Label>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          Switch between light and dark themes
        </Text>
      </View>
      <Switch
        checked={preferencePersistStore.theme == "dark"}
        onCheckedChange={onPersistPress}
      />
    </View>
  );
};
