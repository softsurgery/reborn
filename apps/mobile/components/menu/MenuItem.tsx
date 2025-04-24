import React from "react";
import { LucideIcon } from "lucide-react-native";
import Icon from "~/lib/Icon";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { View } from "react-native";

interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  active?: boolean;
  size?: number;
  color?: string;
}

export const MenuItem = ({
  title,
  icon,
  active = false,
  size = 32,
}: MenuItemProps) => {
  return (
    <View className="flex-col items-center justify-between">
      <Icon
        name={icon as LucideIcon}
        className={cn(active ? "text-primary" : "text-foreground")}
        size={32}
      />
      <Text className={cn("text-xs", active ? "text-primary" : "text-foreground")}>{title}</Text>
    </View>
  );
};
