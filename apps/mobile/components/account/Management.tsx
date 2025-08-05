import React from "react";
import { Image, View } from "react-native";
import { StableScrollView } from "~/components/shared/StableScrollView";
import { ProfileManagmentCard } from "~/components/account/profile/ProfileManagementCard";
import { Text } from "~/components/ui/text";
import { useCurrentUser } from "~/hooks/useCurrentUser";

interface ManagementProps {
  className?: string;
}

export const Management = ({ className }: ManagementProps) => {
  const { currentUser, isCurrentUserPending } = useCurrentUser();
  return (
    <StableScrollView className={className}>
      <View className="flex flex-col gap-2 px-5 mb-7">
        <ProfileManagmentCard className="mt-5" currentUser={currentUser} />
        <View className="flex flex-col gap-4 px-5">
          <View>
            <Text className="font-bold">Bio</Text>
            <Text className="my-2 p-2">{currentUser?.profile?.bio}</Text>
          </View>
          <View>
            <Text className="font-bold">Your Images</Text>
            <View className="flex flex-row gap-4 my-2">
              <Image
                className="w-24 h-24 shadow-md"
                source={require("~/assets/images/adaptive-icon.png")}
              />
              <Image
                className="w-24 h-24 shadow-md"
                source={require("~/assets/images/adaptive-icon.png")}
              />
              <Image
                className="w-24 h-24 shadow-md"
                source={require("~/assets/images/adaptive-icon.png")}
              />
            </View>
          </View>
        </View>
      </View>
    </StableScrollView>
  );
};
