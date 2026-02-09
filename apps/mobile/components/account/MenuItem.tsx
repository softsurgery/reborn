import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../ui/text";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { Icon } from "../ui/icon";

interface MenuItemProps {
  className?: string;
  title?: string;
  icon?: React.ElementType;
  onPress?: () => void;
}

export const MenuItem = ({
  className,
  title,
  icon,
  onPress,
}: MenuItemProps) => {
  const [pressed, setPressed] = React.useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={cn(
        "transition-colors duration-150",
        pressed && "bg-secondary/50",
        className,
      )}
      onPress={() => {
        onPress?.();
      }}
    >
      <View className="flex flex-row justify-between py-3.5 px-2">
        <View className="flex flex-row items-center gap-4">
          <Icon as={icon as LucideIcon} size={22} strokeWidth={2} />
          <Text className="text-base font-medium">{title}</Text>
        </View>
        <Icon
          as={ChevronRight}
          size={20}
          strokeWidth={2}
          className="opacity-80"
        />
      </View>
    </Pressable>
  );
};
