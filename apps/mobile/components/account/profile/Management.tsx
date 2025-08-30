import React from "react";
import { View } from "react-native";
import { StableScrollView } from "~/components/shared/StableScrollView";
import { ProfileManagmentCard } from "~/components/explore/users/ProfileManagementCard";
import { Text } from "~/components/ui/text";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { Image } from "expo-image";
import { Button } from "~/components/ui/button";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { useClientStore } from "~/hooks/stores/useClientStore";

interface ManagementProps {
  className?: string;
}

export const Management = ({ className }: ManagementProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { currentUser, isCurrentUserPending } = useCurrentUser();
  const clientStore = useClientStore();

  React.useEffect(() => {
    if (currentUser) clientStore.set("response", currentUser);
  }, [currentUser]);

  const { data: picture } = useQuery({
    queryKey: ["picture", currentUser?.profile?.pictureId],
    queryFn: () => api.upload.getUploadById(currentUser?.profile?.pictureId!),
    enabled: !!currentUser?.profile?.pictureId,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (currentUser) clientStore.set("picture", picture);
  }, [picture]);

  const { data: followDataCount, isPending: isFollowDataCountPending } =
    useQuery({
      queryKey: ["follow-data-count", currentUser?.id],
      queryFn: () => api.follow.findDataCount(currentUser?.id!),
      enabled: !!currentUser?.id,
    });

  React.useEffect(() => {
    if (followDataCount)
      clientStore.set("responseFollowCountsDto", followDataCount);
  }, [followDataCount]);

  React.useEffect(() => {
    return () => {
      clientStore.reset();
    };
  }, []);

  return (
    <StableScrollView className={className}>
      <View className="flex flex-col gap-2 px-5 mb-7">
        <ProfileManagmentCard className="mt-5" clientStore={clientStore} />
        <Button
          onPress={() => navigation.navigate("account/update-profile")}
          className="w-full"
        >
          <Text className="bold">Update Your Profile</Text>
        </Button>
        <View className="flex flex-col gap-4 px-5">
          <Text className="font-bold">Your Images</Text>
          <View className="flex flex-row gap-4 my-2">
            <Image
              style={{ width: 96, height: 96, borderRadius: 4 }}
              source={picture}
            />
            <Image
              style={{ width: 96, height: 96, borderRadius: 4 }}
              source={picture}
            />
            <Image
              style={{ width: 96, height: 96, borderRadius: 4 }}
              source={picture}
            />
          </View>
        </View>
      </View>
    </StableScrollView>
  );
};
