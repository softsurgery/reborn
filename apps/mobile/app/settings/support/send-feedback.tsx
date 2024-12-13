import * as React from "react";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Screen() {
 
  return (
    <KeyboardAwareScrollView className="">
          <Text className="text-2xl font-extrabold mx-auto ">
            Send Feedback
          </Text>
    </KeyboardAwareScrollView>
  );
}
