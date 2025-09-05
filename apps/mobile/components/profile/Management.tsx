import React from "react";
import { View } from "react-native";
import { StableScrollView } from "~/components/shared/StableScrollView";
import { ProfileManagmentCard } from "~/components/explore/users/ProfileManagementCard";
import { Text } from "~/components/ui/text";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { Image } from "expo-image";
import { Button } from "~/components/ui/button";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { useClientStore } from "~/hooks/stores/useClientStore";
import { ProfileManagmentCardSkeleton } from "~/components/explore/users/ProfileManagmentCardSkeleton";
import { cn } from "~/lib/utils";

interface ManagementProps {
  className?: string;
}

export const Management = ({ className }: ManagementProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { currentUser, isCurrentUserPending } = useCurrentUser();
  const clientStore = useClientStore();

  React.useEffect(() => {
    if (currentUser) clientStore.set("response", currentUser);
    navigation.setOptions({
      title: currentUser?.username,
    });
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
    <View className={cn("flex flex-col gap-2", className)}>
      {isCurrentUserPending ? (
        <ProfileManagmentCardSkeleton />
      ) : (
        <ProfileManagmentCard className="mt-5" clientStore={clientStore} />
      )}
      <Button
        onPress={() => navigation.navigate("account/update-profile")}
        className="w-full"
      >
        <Text className="bold">Update Your Profile</Text>
      </Button>
    </View>
  );
};
