import { Search } from "lucide-react-native";
import { View } from "react-native";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  className?: string;
}

export const SearchInput = ({
  placeholder,
  onChangeText,
  value,
  onSubmitEditing,
  onFocus,
  className,
}: SearchInputProps) => {
  return (
    <View className={cn("w-full py-3", className)}>
      <View className="relative w-full justify-center">
        <View className="absolute left-3 z-10">
          <Search size={20} color="#9ca3af" />
        </View>
        <Input
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          className="pl-10 pr-4 py-2 rounded w-full"
          onChangeText={onChangeText}
          value={value}
          onSubmitEditing={onSubmitEditing}
          onFocus={onFocus}
        />
      </View>
    </View>
  );
};
