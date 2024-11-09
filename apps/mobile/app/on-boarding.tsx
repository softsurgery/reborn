import * as React from "react";
import { Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";

export default function Screen() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View className="flex-1 justify-between items-center p-6 bg-secondary/30">
      <View className="flex-1 justify-center items-center">
        <Image
          className="h-80 w-80"
          source={require("~/assets/images/adaptive-icon.png")}
          style={{ resizeMode: "contain" }}
        />
        <Text className="text-[50px] font-bold italic">REBORN</Text>
        <Text className="text-xl font-semibold text-primary/70">
          The future of mobile apps
        </Text>
        <Text className="text-sm text-primary/70">
          Discover the future of mobile apps with REBORN
        </Text>
      </View>

      <Button
        className="w-full mb-6"
        onPress={() => navigation.navigate("auth/sign-in-screen")}
      >
        <Text className="text-3xl tracking-wider font-bold">GET STARTED</Text>
      </Button>
    </View>
  );
}
