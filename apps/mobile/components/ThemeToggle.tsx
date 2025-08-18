import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Pressable, View } from "react-native";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { toggleColorScheme } = useColorScheme();
  const preferencePersistStore = usePreferencePersistStore();
  const isDarkMode = React.useMemo(
    () => preferencePersistStore.theme === "dark",
    [preferencePersistStore.theme]
  );
  return (
    <Pressable
      onPress={() => {
        preferencePersistStore.toggleTheme();
        toggleColorScheme();
      }}
    >
      {({ pressed }) => (
        <View
          className={cn(
            "flex-1 aspect-square pt-0.5 justify-center items-center",
            pressed && "opacity-70",
            className
          )}
        >
          {isDarkMode ? (
            <MoonStar
              className="text-foreground"
              size={23}
              strokeWidth={1.25}
            />
          ) : (
            <Sun className="text-foreground" size={24} strokeWidth={1.25} />
          )}
        </View>
      )}
    </Pressable>
  );
}
