import * as React from "react";
import { Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { router } from "expo-router";
import Logo from "~/assets/images/reborn.svg";

interface OnBoardingProps {
  className?: string;
}

export default function OnBoarding({ className }: OnBoardingProps) {
  return (
    <View
      className={cn(
        "flex-1 justify-between items-center p-6 bg-background",
        className
      )}
    >
      <View className="flex-1 justify-center items-center">
        <Logo width={320} height={320} />
        <Text className="text-[50px] font-bold italic">REBORN</Text>
        <Text className="text-xl font-semibold text-primary/70">
          The future of mobile apps
        </Text>
        <Text className="text-sm text-primary/70 text-center px-4">
          Discover the future of mobile apps with REBORN
        </Text>
      </View>

      <Button
        className="w-full mb-6"
        variant="outline"
        onPress={() => router.navigate("/auth/sign-in")}
      >
        <Text className="text-3xl tracking-wider font-bold">
          {"Get Started".toUpperCase()}
        </Text>
      </Button>
    </View>
  );
}
