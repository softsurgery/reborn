import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { PictureUploader } from "~/components/common/PictureUploader";
import { StableScrollView } from "~/components/common/StableScrollView";

export default function UpdateProfile() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <KeyboardAwareScrollView bounces={false}>
      <StableScrollView>
        <View className="flex flex-col gap-2 px-5">
          <PictureUploader image={image} onChange={setImage} />
          <Input placeholder="Name" />
          <Input placeholder="Email" keyboardType="email-address" />
          <Input placeholder="Phone" keyboardType="phone-pad" />
          <Button>
            <Text className="dark:text-black text-white">Update</Text>
          </Button>
        </View>
      </StableScrollView>
    </KeyboardAwareScrollView>
  );
}
