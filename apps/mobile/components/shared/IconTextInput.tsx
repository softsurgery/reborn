import { LucideIcon } from "lucide-react-native";
import { TextInputProps, View } from "react-native";
import { cn } from "~/lib/utils";
import { Icon } from "../ui/icon";
import { Input } from "../ui/input";

interface IconTextInputProps extends TextInputProps {
  className?: string;
  icon: LucideIcon;
  side?: "left" | "right";
  iClassame?: string;
}

export const IconTextInput = ({
  className,
  icon,
  iClassame,
  side = "left",
  ...props
}: IconTextInputProps) => {
  return (
    <View className={cn("w-full", className)}>
      <View className="relative w-full justify-center">
        {side == "left" ? (
          <View className="absolute left-4 z-10">
            <Icon as={icon} size={20} className={iClassame} />
          </View>
        ) : null}
        <Input
          {...props}
          className={cn(
            "py-2 rounded w-full",
            side == "left" && "pl-12 pr-4",
            side == "right" && "pr-12 pl-4"
          )}
        />
        {side == "right" ? (
          <View className="absolute right-4 z-10">
            <Icon as={icon} size={20} className={iClassame} />
          </View>
        ) : null}
      </View>
    </View>
  );
};
