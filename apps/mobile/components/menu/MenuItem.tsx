import React from "react";
import { LucideIcon } from "lucide-react-native";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

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
    <>
      <IconWithTheme
        icon={icon}
        size={size}
        className={cn(active && "text-primary")}
      />
      <Text className={cn("text-xs", active && "text-primary")}>{title}</Text>
    </>
  );
};
