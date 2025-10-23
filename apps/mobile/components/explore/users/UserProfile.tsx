import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { View } from "react-native";
import { api } from "~/api";
import { ProfileManagmentCard } from "~/components/explore/users/ProfileManagementCard";
import { StableScrollView } from "~/components/shared/StableScrollView";
import { createClientStore } from "~/hooks/stores/useClientStore";
import { ProfileManagmentCardSkeleton } from "./ProfileManagmentCardSkeleton";
import { Inbox } from "lucide-react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import Icon from "~/lib/Icon";
import { NavigationProps } from "~/types/app.routes";

interface UserProfileProps {
  className?: string;
}

export const UserProfile = ({ className }: UserProfileProps) => {
  const navigation = useNavigation<NavigationProps>();

  const cards = [
    {
      title: "Open Jobs",
      icon: Inbox,
      description: "View all open jobs for this user",
      onPress: () => {
        navigation.navigate("index", { defaultTab: "explore", reset: true });
      },
    },
  ];

  const { id } = useLocalSearchParams();
  const storeRef = React.useRef(createClientStore());
  const clientStore = storeRef.current();

  const { data: userResp, isPending: isUserPending } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.client.findById(id as string),
  });

  React.useEffect(() => {
    if (userResp) clientStore.set("response", userResp);
    navigation.setOptions({
      title: userResp?.username,
    });
  }, [userResp]);

  const { data: picture } = useQuery({
    queryKey: ["picture", userResp?.profile?.pictureId],
    queryFn: () => api.upload.getUploadById(userResp?.profile?.pictureId!),
    enabled: !!userResp?.profile?.pictureId,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (userResp) clientStore.set("picture", picture);
  }, [picture]);

  const { data: followDataCount, isPending: isFollowDataCountPending } =
    useQuery({
      queryKey: ["follow-data-count", userResp?.id],
      queryFn: () => api.follow.findDataCount(userResp?.id!),
      enabled: !!userResp?.id,
    });

  React.useEffect(() => {
    if (followDataCount)
      clientStore.set("responseFollowCountsDto", followDataCount);
  }, [followDataCount]);

  React.useEffect(() => {
    return () => {
      clientStore.reset();
      storeRef.current = null as any;
    };
  }, []);

  return (
    <StableScrollView className={className}>
      <View className="flex flex-col gap-2 px-5 mb-7">
        {isUserPending || isFollowDataCountPending ? (
          <ProfileManagmentCardSkeleton className="my-4" />
        ) : (
          <ProfileManagmentCard className="mt-5" clientStore={clientStore} />
        )}
        <View className="flex flex-col gap-4">
          {cards.map((card) => (
            <StablePressable
              key={card.title}
              className="border-b-2 border-border bg-muted"
              onPressClassname="bg-secondary"
              onPress={() => card.onPress()}
            >
              <View className="flex flex-row justify-between items-center p-4">
                <View className="flex flex-col w-full flex-1">
                  <Text className="text-lg font-semibold">{card.title}</Text>
                  <Text className="text-xs text-muted-foreground">
                    {card.description}
                  </Text>
                </View>
                <Icon name={card.icon} size={28} />
              </View>
            </StablePressable>
          ))}
        </View>
      </View>
    </StableScrollView>
  );
};
