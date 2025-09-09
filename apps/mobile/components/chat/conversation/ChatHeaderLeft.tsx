import { View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../../ui/text";

interface ChatHeaderLeftProps {
  className?: string;
  identifier?: string;
  profilePicture?: React.ReactNode;
  lastSeen?: string;
}

export const ChatHeaderLeft = ({
  className,
  identifier,
  profilePicture,
  lastSeen,
}: ChatHeaderLeftProps) => {
  return (
    <View
      className={cn(
        "flex flex-row items-center justify-center gap-2",
        className
      )}
    >
      <View>{profilePicture}</View>
      <View className="flex flex-col justify-center ">
        <Text variant={"large"}>{identifier}</Text>
        <Text className="font-thin">{lastSeen}</Text>
      </View>
    </View>
  );
};
