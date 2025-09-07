import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { View } from "react-native";
import { api } from "~/api";
import { ProfileManagmentCard } from "~/components/explore/users/ProfileManagementCard";
import { StableScrollView } from "~/components/shared/StableScrollView";
import { Text } from "~/components/ui/text";
import { createClientStore } from "~/hooks/stores/useClientStore";
import { is } from "zod/v4/locales";
import { ProfileManagmentCardSkeleton } from "./ProfileManagmentCardSkeleton";

interface UserProfileProps {
  className?: string;
}

export const UserProfile = ({ className }: UserProfileProps) => {
  const navigation = useNavigation();

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
        <View className="flex flex-col gap-4 px-5">
          <View>
            <Text className="font-bold">Your Images</Text>
            <View className="flex flex-row gap-4 my-2">
              <Image
                style={{ width: 96, height: 96, borderRadius: 4 }}
                source={clientStore.picture}
              />
              <Image
                style={{ width: 96, height: 96, borderRadius: 4 }}
                source={clientStore.picture}
              />
              <Image
                style={{ width: 96, height: 96, borderRadius: 4 }}
                source={clientStore?.picture}
              />
            </View>
          </View>
        </View>
      </View>
    </StableScrollView>
  );
};
