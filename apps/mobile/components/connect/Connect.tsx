import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { StablePressable } from "../shared/StablePressable";
import { cn } from "~/lib/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chat } from "./Chat";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { User } from "lucide-react-native";

export const Connect = () => {
  const [tab, setTab] = React.useState<"recent" | "followings">("recent");

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
      <View className="flex flex-row gap-2 pt-2">
        <StablePressable
          onPress={() => setTab("recent")}
          className={cn(
            "h-12 w-1/2 flex items-center justify-center",
            tab === "recent" ? "border-b-2 border-b-primary" : ""
          )}
        >
          <Text>Messages</Text>
        </StablePressable>
        <StablePressable
          onPress={() => setTab("followings")}
          className={cn(
            "h-12 w-1/2 flex items-center justify-center",
            tab === "followings" ? "border-b-2 border-b-primary" : ""
          )}
        >
          <Text>Requests</Text>
        </StablePressable>
      </View>
      <View className="flex-1 mx-2">
        {/* Manual Tabs */}

        <SafeAreaView>
          {tab === "recent" ? <Chat /> : <Text>Old</Text>}
        </SafeAreaView>
      </View>
    </StableSafeAreaView>
  );
};
