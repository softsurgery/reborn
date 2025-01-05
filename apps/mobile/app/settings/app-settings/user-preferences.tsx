import * as React from "react";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ThemeToggle } from "~/components/ThemeToggle";
import { View } from "react-native";

export default function Screen() {
  return (
    <KeyboardAwareScrollView className="">
      <View className="h-fit mx-auto">
        <ThemeToggle />
      </View>
    </KeyboardAwareScrollView>
  );
}
