import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { PictureUploader } from "~/components/common/PictureUploader";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import { DatePicker } from "~/components/ui/date-picker";

export default function UpdateProfile() {
  const [image, setImage] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());

  return (
    <KeyboardAwareScrollView bounces={false}>
      <View className="flex flex-col gap-4 px-5">
        <PictureUploader image={image} onChange={setImage} />
        <View className="flex flex-row gap-2 px-1 justify-center mt-5">
          <View className="flex flex-col gap-2 w-1/2">
            <Label>Name</Label>
            <Input placeholder="Name" />
          </View>
          <View className="flex flex-col gap-2 w-1/2">
            <Label>Surname</Label>
            <Input
              placeholder="Surname"
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
          </View>
        </View>
        <View className="flex flex-col gap-2">
          <Label>E-mail</Label>
          <Input placeholder="Email" keyboardType="email-address" />
        </View>

        <View className="flex flex-col gap-2">
          <Label>Phone</Label>
          <Input placeholder="Phone" keyboardType="phone-pad" />
        </View>

        <View className="flex flex-col gap-2">
          <Label>Bio</Label>
          <Textarea />
        </View>

        <View className="flex flex-col gap-2 w-full">
          <Label>Date of Birth</Label>

          <DatePicker date={date} onChange={setDate} />
        </View>
        <Button>
          <Text className="dark:text-black text-white">Update</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
