import React from "react";
import { View, Alert } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PictureUploader } from "~/components/common/PictureUploader";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { DatePicker } from "~/components/ui/date-picker";
import { useUpdateProfileManager } from "./hooks/useUpdateProfileManager";
import { firebaseFns } from "~/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { Loader } from "~/components/Loader";

export default function UpdateProfile() {
  const [image, setImage] = React.useState<string | null>(null);
  const { currentUser, isFetchingCurrentUser } = useCurrentUser();

  const updateProfileManager = useUpdateProfileManager();

  React.useEffect(() => {
    if (currentUser) {
      updateProfileManager.setUpdateProfile({
        ...currentUser,
        dateOfBirth: currentUser.dateOfBirth
          ? new Date(currentUser.dateOfBirth)
          : new Date(),
      });
    }
  }, [currentUser]);

  const handleUpdate = async () => {
    try {
      const uid = await AsyncStorage.getItem("uid");
      if (!uid) {
        Alert.alert("Error", "User ID is missing.");
        return;
      }

      const updatedData = {
        name: updateProfileManager.name,
        surname: updateProfileManager.surname,
        email: updateProfileManager.email,
        phone: updateProfileManager.phone,
        bio: updateProfileManager.bio,
        dateOfBirth: updateProfileManager.dateOfBirth?.toISOString(),
      };

      const response = await firebaseFns.user.update(uid, updatedData);
      if (response.success) {
        Alert.alert("Success", "Profile updated successfully.");
      } else {
        Alert.alert("Error", response.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };  

  if (isFetchingCurrentUser) return <Loader />;
  return (
    <KeyboardAwareScrollView bounces={false}>
      <View className="flex flex-col gap-4 px-5">
        <PictureUploader image={image} onChange={setImage} />
        <View className="flex flex-row gap-2 px-1 justify-center mt-5">
          <View className="flex flex-col gap-2 w-1/2">
            <Label>Name</Label>
            <Input
              placeholder="Name"
              value={updateProfileManager.name}
              onChangeText={(value) => updateProfileManager.set("name", value)}
            />
          </View>
          <View className="flex flex-col gap-2 w-1/2">
            <Label>Surname</Label>
            <Input
              placeholder="Surname"
              value={updateProfileManager.surname}
              onChangeText={(value) =>
                updateProfileManager.set("surname", value)
              }
            />
          </View>
        </View>
        <View className="flex flex-col gap-2">
          <Label>E-mail</Label>
          <Input
            placeholder="Email"
            keyboardType="email-address"
            value={updateProfileManager.email}
            onChangeText={(value) => updateProfileManager.set("email", value)}
          />
        </View>

        <View className="flex flex-col gap-2">
          <Label>Phone</Label>
          <Input
            placeholder="Phone"
            keyboardType="phone-pad"
            value={updateProfileManager.phone}
            onChangeText={(value) => updateProfileManager.set("phone", value)}
          />
        </View>

        <View className="flex flex-col gap-2">
          <Label>Bio</Label>
          <Textarea
            value={updateProfileManager.bio}
            onChangeText={(value) => updateProfileManager.set("bio", value)}
          />
        </View>

        <View className="flex flex-col gap-2 w-full">
          <Label>Date of Birth</Label>
          <DatePicker
            date={updateProfileManager.dateOfBirth || new Date()}
            onChange={(date) => updateProfileManager.set("dateOfBirth", date)}
          />
        </View>
        <Button onPress={handleUpdate}>
          <Text className="dark:text-black text-white">Update</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
