import { View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../../ui/text";
import { StablePressable } from "~/components/shared/StablePressable";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import Icon from "~/lib/Icon";
import { ArrowLeft } from "lucide-react-native";

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
  const navigation = useNavigation<NavigationProps>();
  return (
    <View
      className={cn(
        "flex flex-row items-center justify-center gap-4",
        className
      )}
    >
      {/* backbuttin */}
      <StablePressable
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name={ArrowLeft} size={28} strokeWidth={3} className="p-2" />
      </StablePressable>
      <View>{profilePicture}</View>
      <View className="flex flex-col justify-center ">
        <Text variant={"large"}>{identifier}</Text>
        <Text className="font-thin">{lastSeen}</Text>
      </View>
    </View>
  );
};
