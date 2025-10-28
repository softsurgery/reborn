import React from "react";
import { LucideIcon } from "lucide-react-native";
import Icon from "~/lib/Icon";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("common");
  return (
    <Pressable style={{ flex: 1, alignItems: "center" }}>
      <View className={cn("flex-col items-center justify-between", className)}>
        <Icon
          name={icon as LucideIcon}
          className={cn(active ? "text-primary" : "text-foreground")}
          size={size}
        />
        <Text className={cn(active ? "text-primary" : "text-foreground")}>
          {t(`screens.${title}`)}
        </Text>
      </View>
    </Pressable>
  );
};
