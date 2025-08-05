import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { Save } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Loader } from "~/components/Loader";
import { Button } from "~/components/ui/button";
import { firebaseFns } from "~/firebase";
import { useUpdateProfileManager } from "~/hooks/stores/useUpdateProfileManager";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import Icon from "~/lib/Icon";
import { Result, ResponseUserDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";
import { Text } from "~/components/ui/text";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useUpdateProfileFormStructure } from "./useUpdateProfileFormStructure";
import { showToastable } from "react-native-toastable";

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

  const { data: userData, isPending: isUserDataPending } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {},
  });

  console.log(userData);

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationFn: (data: Partial<ResponseUserDto>) =>
        firebaseFns.user.updateCurrent(data),
      onSuccess: (result: Result) => {
        if (result.success) {
          showToastable({
            message: "Profile Updated Successfully",
            status: "success",
          });
          navigation.goBack();
        } else {
          showToastable({ message: JSON.stringify(result), status: "danger" });
        }
      },
    });

  const handleUpdate = async () => {};
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
