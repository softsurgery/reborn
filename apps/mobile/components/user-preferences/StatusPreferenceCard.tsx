import React from "react";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import Icon  from "~/lib/Icon";
import { CircleCheck, CircleX } from "lucide-react-native";

interface StatusPreferenceCardProps {
  onPress: () => void;
  switchState: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const StatusPreferenceCard = ({
  onPress,
  switchState,
  title,
  subtitle,
  className,
}: StatusPreferenceCardProps) => {
  return (
    <View
      className={cn("flex-row items-center justify-between gap-2", className)}
    >
      <View className="flex flex-col items-start">
        <View className="flex flex-row items-center gap-2">
          <Label className="text-lg" onPress={onPress}>
            {title}
          </Label>
          <Icon
            name={switchState ? CircleCheck : CircleX}
          />
        </View>
        <Text className="text-sm text-gray-400 dark:text-gray-500">
          {subtitle}
        </Text>
      </View>
      <Switch
        checked={switchState}
        onCheckedChange={onPress}
        className="justify-self-end"
      />
    </View>
  );
};
