import React from "react";
import { Pressable, View } from "react-native";
import Icon from "~/lib/Icon";
import { Text } from "../ui/text";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { NavigationProps, StackParamList } from "~/types/app.routes";
import { useNavigation } from "expo-router";
import { cn } from "~/lib/utils";

interface MenuItemProps {
  className?: string;
  title?: string;
  icon?: React.ElementType;
  link?: keyof StackParamList;
  onPress?: () => void;
}

export const MenuItem = ({
  className,
  title,
  icon,
  link,
  onPress,
}: MenuItemProps) => {
      const [pressed, setPressed] = React.useState(false);
      const navigation = useNavigation<NavigationProps>();
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={cn("rounded-lg", pressed && "bg-secondary", className)}
      onPress={
        link
          ? () => {
              //@ts-ignore
              navigation.push(link);
            }
          : onPress
      }
    >
      <View className="flex flex-row justify-between py-4 border-gray-100 dark:border-gray-900 px-2">
        <View className="flex flex-row items-center gap-4">
          <Icon name={icon as LucideIcon} size={20} strokeWidth={2.5} />
          <Text className="text-xl font-bold">{title}</Text>
        </View>
        <Icon name={ChevronRight} size={20} strokeWidth={2.5} />
      </View>
    </Pressable>
  );
};
