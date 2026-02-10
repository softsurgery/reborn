import React from "react";
import { View } from "react-native";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { cn } from "~/lib/utils";
import { StablePressable } from "./shared/StablePressable";
import { useColorScheme } from "nativewind";
import { Icon } from "./ui/icon";
import { MoonStar, Sun } from "lucide-react-native";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setColorScheme, toggleColorScheme } = useColorScheme();
  const { theme, toggleTheme } = usePreferencePersistStore();
  const isDarkMode = React.useMemo(() => theme === "dark", [theme]);

  return (
    <StablePressable
      onPress={() => {
        toggleTheme();
        setColorScheme(theme);
        setAndroidNavigationBar(theme);
        toggleColorScheme();
      }}
      onPressClassname="bg-none"
    >
      <View className={cn("mx-2", className)}>
        {isDarkMode ? (
          <Icon as={MoonStar} className="text-foreground" size={24} />
        ) : (
          <Icon as={Sun} className="text-foreground" size={24} />
        )}
      </View>
    </StablePressable>
  );
}
