import { View } from "react-native";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Search, User } from "lucide-react-native";
import { Text } from "../ui/text";
import Icon from "~/lib/Icon";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { StablePressable } from "../shared/StablePressable";

interface ExploreHeaderProps {
  className?: string;
}

export const ExploreHeader = ({ className }: ExploreHeaderProps) => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <View
      className={cn(
        "flex flex-row justify-between items-center gap-2 p-2",
        className
      )}
    >
      <Text variant={"h1"}>Explore</Text>
      <View className="flex flex-row gap-2">
        <StablePressable
          className="p-2"
          onPress={() => navigation.navigate("explore/job-search")}
        >
          <Icon name={Search} size={28} />
        </StablePressable>
        <StablePressable
          className="p-2"
          onPress={() => navigation.navigate("my-space/index")}
        >
          <Icon name={User} size={28} />
        </StablePressable>
      </View>
    </View>
  );
};
