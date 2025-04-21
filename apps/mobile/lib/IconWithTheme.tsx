import React from "react";
import { View, useColorScheme } from "react-native";
import { cn } from "~/lib/utils";

interface IconWithThemeProps {
  className?: string;
  icon: React.ElementType;
  size: number;
}

export const IconWithTheme = ({
  className,
  icon: Icon,
  size,
}: IconWithThemeProps) => {
  const colorScheme = useColorScheme();
  
  const iconColorClass = colorScheme === 'dark' ? 'text-red-500' : 'text-foreground';
  
  console.log("colorScheme", colorScheme);
  return (
    <View className={cn("items-center justify-center", className)}>
      <Icon size={size} className={cn(iconColorClass)} />
    </View>
  );
};
