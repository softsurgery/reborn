import { Info } from "lucide-react-native";
import { Alert, TouchableOpacity } from "react-native";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { cn } from "~/lib/utils";

interface ChatHeaderRightProps {
  className?: string;
}

export const ChatHeaderRight = ({ className }: ChatHeaderRightProps) => {
  return (
    <TouchableOpacity
      className={cn("mx-2", className)}
      onPress={() => {
        Alert.alert("This is supposed to be informative");
      }}
    >
      <IconWithTheme icon={Info} size={24} color="#fff" />
    </TouchableOpacity>
  );
};
