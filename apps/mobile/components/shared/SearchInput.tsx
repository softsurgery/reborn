import { Search } from "lucide-react-native";
import { View } from "react-native";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";
import { Pressable } from "@rn-primitives/slot";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  className?: string;
  disabled?: boolean;
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
  onChangeText?: (text: string) => void;
}

export const SearchInput = ({
  placeholder,
  onChangeText,
  value,
  onSubmitEditing,
  onFocus,
  onClick,
  className,
  disabled,
}: SearchInputProps) => {
  return (
    <View className={cn("w-full py-3", className)}>
      <View className="relative w-full justify-center">
        <View className="absolute left-3 z-10">
          <Search size={20} color="#9ca3af" />
        </View>
        <Pressable onPress={onClick}>
          <Input
            pointerEvents={disabled ? "none" : "auto"}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            className="pl-10 pr-4 py-2 rounded w-full"
            onChangeText={onChangeText}
            value={value}
            onSubmitEditing={onSubmitEditing}
            onFocus={onFocus}
          />
        </Pressable>
      </View>
    </View>
  );
};
