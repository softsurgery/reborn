import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { cn } from "~/lib/utils";
import { Text } from "../../ui/text";
import { UserBubble } from "../UserBubble";
import { User } from "~/types";

interface ChatHeaderLeftProps {
  className?: string;
  user?: User;
  lastSeen?: string;
  goBack?: () => void;
}

export const ChatHeaderLeft = ({
  className,
  user,
  lastSeen,
  goBack,
}: ChatHeaderLeftProps) => {
  return (
    <View className={cn("flex flex-row items-center justify-center", className)}>
      <TouchableOpacity  onPress={goBack}>
        <IconWithTheme icon={ChevronLeft} size={34} />
      </TouchableOpacity>
      <UserBubble className="w-9 h-9" gender={user?.isMale} uid={user?.uid} />
      <View className="px-3 flex flex-col justify-center">
        <Text>{`${user?.surname} ${user?.name}`}</Text>
        <Text className="font-thin">{lastSeen}</Text>
      </View>
    </View>
  );
};
