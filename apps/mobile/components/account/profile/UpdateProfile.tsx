import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { Save } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Toast } from "react-native-toast-notifications";
import { Loader } from "~/components/Loader";
import { Button } from "~/components/ui/button";
import { firebaseFns } from "~/firebase";
import { useUpdateProfileManager } from "~/hooks/stores/useUpdateProfileManager";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import Icon from "~/lib/Icon";
import { Result, User } from "~/types";
import { NavigationProps } from "~/types/app.routes";
import { Text } from "~/components/ui/text";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useUpdateProfileFormStructure } from "./useUpdateProfileFormStructure";

export const UpdateProfile = () => {
  const { currentUser, isFetchingCurrentUser } = useCurrentUser();
  const updateProfileManager = useUpdateProfileManager();
  const navigation = useNavigation<NavigationProps>();
  const [image, setImage] = React.useState<string | null>(null);

  const { updateProfileStructure } = useUpdateProfileFormStructure({});

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

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationFn: (data: Partial<User>) => firebaseFns.user.updateCurrent(data),
      onSuccess: (result: Result) => {
        if (result.success) {
          Toast.show("Profile Updated Successfully", {
            successColor: "#00FF00",
          });
          navigation.goBack();
        } else {
          Toast.show(JSON.stringify(result));
        }
      },
    });

  const handleUpdate = async () => {
    const updatedData: Partial<User> = {
      name: updateProfileManager.name,
      surname: updateProfileManager.surname,
      email: updateProfileManager.email,
      phone: updateProfileManager.phone,
      bio: updateProfileManager.bio,
      isMale: updateProfileManager.isMale,
      region: updateProfileManager.region,
      dateOfBirth: updateProfileManager.dateOfBirth?.toISOString(),
      nationalId: updateProfileManager.nationalId,
      isPublic: updateProfileManager.isPublic,
    };
    updateProfile(updatedData);
  };

  if (isFetchingCurrentUser) return <Loader />;

  return (
    <KeyboardAwareScrollView bounces={false}>
      <View className="flex flex-col gap-6 mx-4 mb-16">
        <FormBuilder structure={updateProfileStructure} className="my-4" />

        <Button
          onPress={handleUpdate}
          className="flex flex-row gap-2 w-full"
          disabled={isUpdateProfilePending}
        >
          <Icon name={Save} size={24} />
          <Text>Update Profile</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};
