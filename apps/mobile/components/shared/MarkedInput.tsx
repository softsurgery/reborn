import { LucideIcon, X } from "lucide-react-native";
import { TextInputProps, View, TouchableOpacity } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface MarkedInputProps extends TextInputProps {
  icon: LucideIcon;
  reverseIcon?: boolean;
  inputClassName?: string;
  enableClear?: boolean;
}

export const MarkedInput = ({
  className,
  value,
  onChangeText,
  icon,
  reverseIcon = false,
  inputClassName,
  enableClear = false,
  ...rest
}: MarkedInputProps) => {
  return (
    <View className={cn("relative justify-center", className)}>
      <View
        className={cn(
          "absolute h-full justify-center z-10",
          reverseIcon ? "right-3" : "left-3",
        )}
      >
        <Icon as={icon} size={18} className="text-muted-foreground" />
      </View>

      <Input
        {...rest}
        value={value}
        onChangeText={onChangeText}
        className={cn(
          "rounded-full",
          reverseIcon ? "pr-10" : "pl-10",
          enableClear && value ? "pr-10" : "",
          inputClassName,
        )}
      />

      {enableClear && value && value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText?.("")}
          className={cn(
            "absolute z-10 p-1 justify-center",
            reverseIcon ? "left-3" : "right-3",
          )}
        >
          <Icon as={X} size={16} className="text-muted-foreground" />
        </TouchableOpacity>
      )}
    </View>
  );
};
