import React from "react";
import { View } from "react-native";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { StablePressable } from "./shared/StablePressable";

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
          <MoonStar className="text-foreground" strokeWidth={1.25} />
        ) : (
          <Sun className="text-foreground" size={24} strokeWidth={1.25} />
        )}
      </View>
    </StablePressable>
  );
}
