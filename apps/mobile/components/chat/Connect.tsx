import React from "react";
import { View } from "react-native";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { Chat } from "./Chat";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { User } from "lucide-react-native";

export const Connect = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <StableSafeAreaView className="flex flex-1 mx-2">
      <ApplicationHeader
        title="Messages"
        shortcuts={[
          {
            icon: User,
            onPress: () => navigation.navigate("my-space/index", {}),
          },
        ]}
      />
      <View className="px-4"></View>

      <View className="flex-1 mx-2">
        {/* Manual Tabs */}

        <Chat />
      </View>
    </StableSafeAreaView>
  );
};
