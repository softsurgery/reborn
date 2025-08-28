import { Search } from "lucide-react-native";
import { View } from "react-native";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  className?: string;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  onChangeText?: (text: string) => void;
}

export const SearchInput = ({
  className,
  placeholder,
  value,
  autoFocus,
  onChangeText,
  onSubmitEditing,
  onFocus,
}: SearchInputProps) => {
  return (
    <View className={cn("w-full py-3", className)}>
      <View className="relative w-full justify-center">
        <View className="absolute left-5 z-10">
          <Search size={20} color="#9ca3af" />
        </View>
        <Input
          placeholderTextColor="#9ca3af"
          className="pl-12 pr-4 py-2 rounded w-full"
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          onFocus={onFocus}
          />
      </View>
    </View>
  );
};
