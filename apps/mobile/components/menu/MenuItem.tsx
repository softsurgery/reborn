import React from "react";
import { LucideIcon } from "lucide-react-native";
import Icon from "~/lib/Icon";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { View } from "react-native";

interface MenuItemProps {
  className?: string;
  title: string;
  icon: LucideIcon;
  active?: boolean;
  size?: number;
  color?: string;
}

export const MenuItem = ({
  className,
  title,
  icon,
  active = false,
  size = 32,
}: MenuItemProps) => {
  return (
    <View className={cn("flex-col items-center justify-between", className)}>
      <Icon
        name={icon as LucideIcon}
        className={cn(active ? "text-primary" : "text-foreground")}
        size={size}
      />
      <Text className={cn(active ? "text-primary" : "text-foreground")}>
        {title}
      </Text>
    </View>
  );
};
