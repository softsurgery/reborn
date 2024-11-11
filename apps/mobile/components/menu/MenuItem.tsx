import React from "react";
import { LucideIcon } from "lucide-react-native";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Text } from "../ui/text";

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
  color = "blue",
}: MenuItemProps) => {
  return (
    <>
      <IconWithTheme
        icon={icon}
        size={size}
        color={active ? color : undefined} 
      />
      <Text
        className="text-xs"
        style={active ? { color: color } : {}}
      >
        {title}
      </Text>
    </>
  );
};
