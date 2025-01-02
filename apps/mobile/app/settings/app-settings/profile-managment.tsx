import * as React from "react";
import { Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ProfileManagmentCard } from "~/components/profile/ProfileManagementCard";
import { Text } from "~/components/ui/text";

export default function ProfileManagment() {
  return (
    <KeyboardAwareScrollView className="flex flex-col gap-5 my-5 px-4">
      <View className="flex flex-col gap-5">
        <ProfileManagmentCard />
        <View className="flex flex-col gap-4 px-5">
          <View>
            <Text className="font-bold">About Me</Text>
            <Text className="border border-white/25 my-2">
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
    </KeyboardAwareScrollView>
  );
}
