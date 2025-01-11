import React from "react";
import { Image, View } from "react-native";
import { StableScrollView } from "~/components/common/StableScrollView";
import { ProfileManagmentCard } from "~/components/profile/ProfileManagementCard";
import { Text } from "~/components/ui/text";

interface ProfileManagmentCardProps {
  className?: string;
}

export default function ProfileManagment({
  className,
}: ProfileManagmentCardProps) {
  return (
    <StableScrollView className={className}>
      <View className="flex flex-col gap-2 px-5 mb-7">
        <ProfileManagmentCard className="mt-5"/>
        <View className="flex flex-col gap-4 px-5">
          <View>
            <Text className="font-bold">Bio</Text>
            <Text className="border border-white/25 rounded-lg my-2 p-4">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi
              voluptatibus velit eveniet, praesentium mollitia, aliquid amet
              atque quo culpa veritatis adipisci facere porro quisquam
              voluptatum aut harum molestias iste expedita!
            </Text>
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
}
