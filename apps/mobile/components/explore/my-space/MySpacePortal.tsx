import { Bookmark, Briefcase, Eye, Inbox, Star } from "lucide-react-native";
import { View } from "react-native";
import { Management } from "~/components/profile/Management";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { Separator } from "~/components/ui/separator";
import { Icon } from "~/components/ui/icon";

interface MySpacePortalProps {
  className?: string;
}

export const MySpacePortal = ({ className }: MySpacePortalProps) => {
  const navigation = useNavigation<NavigationProps>();
  const cards = [
    {
      title: "Requests",
      icon: Inbox,
      description: "View all your requests",
      onPress: () => {
        navigation.navigate("my-space/requests", {});
      },
    },
    {
      title: "Saved",
      icon: Bookmark,
      description: "View all your saved jobs",
      onPress: () => {
        navigation.navigate("my-space/saved", {});
      },
    },
    {
      title: "Reviews",
      icon: Star,
      description: "View all your reviews",
      onPress: () => {},
    },
    {
      title: "Viewed",
      icon: Eye,
      description: "Latest viewed jobs",
      onPress: () => {},
    },
  ];
  return (
    <View className={cn("flex-1 px-2", className)}>
      <Management className="px-3" />
      <View className="flex-row flex-wrap items-center justify-center gap-4 mt-5">
        {cards.map((card) => (
          <StablePressable
            key={card.title}
            className="w-[46%] border-b-2 border-border bg-muted"
            onPressClassname="bg-secondary"
            onPress={() => card.onPress()}
          >
            <View className="flex flex-col justify-between gap-2 p-4">
              <View className="flex flex-row  justify-between items-center w-full">
                <Text className="text-lg font-semibold">{card.title}</Text>
                <Icon as={card.icon} size={20} />
              </View>
              <Text className="text-xs text-muted-foreground">
                {card.description}
              </Text>
            </View>
          </StablePressable>
        ))}
      </View>
      <Separator className="my-4" />
    </View>
  );
};
