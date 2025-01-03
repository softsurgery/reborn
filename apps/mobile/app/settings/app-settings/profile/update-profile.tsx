import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Stack } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function UpdateProfile() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View className="flex flex-col gap-5 px-5">
        <View>
          
        </View>
        <Avatar
          alt="Zach Nugent's Avatar"
          className="w-40 h-40 mx-auto border-2"
        >
          
          <AvatarImage  source={require("~/assets/images/adaptive-icon.png")} />
          <AvatarFallback>
            <Text>ZN</Text>
          </AvatarFallback>
        </Avatar>
        <Text
         
          className="items-center justify-center text-xl"
        >
          Update Your Profile Picture
        </Text>
        <Input placeholder="Name" />
        <Input placeholder="Email" keyboardType="email-address" />
        <Input placeholder="Phone" keyboardType="phone-pad" />
        <Button>
          <Text className="dark:text-black text-white">Update</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
