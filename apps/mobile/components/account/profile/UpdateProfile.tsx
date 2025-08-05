import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Save } from "lucide-react-native";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Loader } from "~/components/Loader";
import { Button } from "~/components/ui/button";
import { useUpdateClientStore } from "~/hooks/stores/useUpdateClientStore";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import Icon from "~/lib/Icon";
import { Result, ResponseClientDto } from "~/types";
import { Text } from "~/components/ui/text";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useUpdateProfileFormStructure } from "./useUpdateProfileFormStructure";
import { showToastable } from "react-native-toastable";
import { useNavigation } from "~/hooks/useNavigation";
import { useRegions } from "~/hooks/content/useRegions";
import { mapToSelectOptions } from "~/components/shared/form-builder/utils/mapToSelectOptions";

export const UpdateProfile = () => {
  const { currentUser, isCurrentUserPending } = useCurrentUser();
  const updatClientStore = useUpdateClientStore();
  const navigation = useNavigation();
  const [image, setImage] = React.useState<string | null>(null);
  const { regions, isFetchRegionsPending } = useRegions();

  const { updateProfileStructure } = useUpdateProfileFormStructure({
    store: updatClientStore,
    regions: mapToSelectOptions({
      data: isFetchRegionsPending ? [] : regions,
      labelKey: "label",
      valueKey: "id",
    }),
  });

  React.useEffect(() => {
    if (currentUser) {
      updatClientStore.set("updateDto", {
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        dateOfBirth: currentUser.dateOfBirth,
        isActive: currentUser.isActive,
        profile: {
          phone: currentUser.profile.phone,
          cin: currentUser.profile.cin,
          bio: currentUser.profile.bio,
          gender: currentUser.profile.gender,
          isPrivate: currentUser.profile.isPrivate,
          regionId: currentUser.profile.regionId,
        },
      });
    }
  }, [currentUser]);

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationFn: async (data: Partial<ResponseClientDto>) => {},
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
  if (isCurrentUserPending) return <Loader />;

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
