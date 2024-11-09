import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useNavigation } from "expo-router";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import { Button } from "~/components/ui/button";

const GITHUB_AVATAR_URI =
  "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg";

export default function Screen() {
  const navigation = useNavigation();
  const { handleSignOut } = useAuthFunctions();
  return (
    <View className="flex justify-center items-center gap-2 p-6 px-12 bg-secondary/30">
      <Text className="text-lg font-normal">You are in</Text>
      <Button onPress={handleSignOut}>
        <Text>signout</Text>
      </Button>
    </View>
  );
}
