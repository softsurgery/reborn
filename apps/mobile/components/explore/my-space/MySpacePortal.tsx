import { Bookmark, Eye, Inbox, Star } from "lucide-react-native";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { router } from "expo-router";
import { Icon } from "~/components/ui/icon";
import { InspectProfile } from "~/components/profile/InspectProfile";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";

interface MySpacePortalProps {
  className?: string;
}

export const MySpacePortal = ({ className }: MySpacePortalProps) => {
  const { currentUser } = useCurrentUser();
  const cards = [
    {
      title: "Requests",
      icon: Inbox,
      description: "View all your requests",
      onPress: () => {
        router.push("/main/my-space/requests");
      },
    },
    {
      title: "Saved",
      icon: Bookmark,
      description: "View all your saved jobs",
      onPress: () => {
        router.push("/main/my-space/saved");
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
    <View className={cn("flex-1", className)}>
      <InspectProfile
        id={currentUser?.id as string}
        customContent={
          <View className="flex flex-col justify-center gap-4">
            {cards.map((card) => (
              <StablePressable
                key={card.title}
                className="border-b-2 border-border bg-muted"
                onPressClassname="bg-secondary"
                onPress={() => card.onPress()}
              >
                <View className="flex flex-row justify-between items-center gap-2 p-2">
                  <View className="flex flex-col">
                    <Text className="text-lg font-semibold">{card.title}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {card.description}
                    </Text>
                  </View>
                  <Icon as={card.icon} size={24} />
                </View>
              </StablePressable>
            ))}
          </View>
        }
      />
    </View>
  );
};
