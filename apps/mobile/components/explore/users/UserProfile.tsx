import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { View } from "react-native";
import { api } from "~/api";
import { ProfileManagmentCard } from "~/components/account/profile/ProfileManagementCard";
import { StableScrollView } from "~/components/shared/StableScrollView";
import { Text } from "~/components/ui/text";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { NavigationProps } from "~/types/app.routes";

interface UserProfileProps {
  className?: string;
}

export const UserProfile = ({ className }: UserProfileProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { id } = useLocalSearchParams();

  const { data: userResp, isPending: isUserPending } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.client.findById(id as string),
  });

  const user = React.useMemo(() => userResp ?? null, [userResp]);

  const { data: profilePicture } = useQuery({
    queryKey: ["profile-picture", user?.profile?.pictureId],
    queryFn: () => api.upload.getUploadById(user?.profile?.pictureId!),
    enabled: !!user?.profile?.pictureId,
    staleTime: Infinity,
  });

  const identity = React.useMemo(() => identifyUser(user) ?? null, [user]);
  const fallback = React.useMemo(
    () => identifyUserAvatar(user) ?? null,
    [user]
  );

  return (
    <StableScrollView className={className}>
      <View className="flex flex-col gap-2 px-5 mb-7">
        <ProfileManagmentCard
          className="mt-5"
          uri={profilePicture}
          identity={identity}
          fallback={fallback}
        />
        <View className="flex flex-col gap-4 px-5">
          <View>
            <Text className="font-bold">Bio</Text>
            <Text className="my-2 p-2">{user?.profile?.bio}</Text>
          </View>
          <View>
            <Text className="font-bold">Your Images</Text>
            <View className="flex flex-row gap-4 my-2">
              <Image
                style={{ width: 96, height: 96, borderRadius: 4 }}
                source={profilePicture}
              />
              <Image
                style={{ width: 96, height: 96, borderRadius: 4 }}
                source={profilePicture}
              />
              <Image
                style={{ width: 96, height: 96, borderRadius: 4 }}
                source={profilePicture}
              />
            </View>
          </View>
        </View>
      </View>
    </StableScrollView>
  );
};
