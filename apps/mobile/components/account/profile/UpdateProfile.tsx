import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react-native";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Loader } from "~/components/Loader";
import { Button } from "~/components/ui/button";
import { useUpdateClientStore } from "~/hooks/stores/useUpdateClientStore";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import Icon from "~/lib/Icon";
import { Result, ResponseClientDto, ServerErrorResponse } from "~/types";
import { Text } from "~/components/ui/text";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useUpdateProfileFormStructure } from "./useUpdateProfileFormStructure";
import { showToastable } from "react-native-toastable";
import { useNavigation } from "~/hooks/useNavigation";
import { useRegions } from "~/hooks/content/useRegions";
import { mapToSelectOptions } from "~/components/shared/form-builder/utils/mapToSelectOptions";
import {
  updateClientSchema,
  updateProfileSchema,
} from "~/types/validations/client.validation";
import { api } from "~/api";
import { StableKeyboardAwareScrollView } from "~/components/shared/KeyboardAwareScrollView";
import { useUploadMutation } from "~/hooks/useUploadMutation";
import { Upload } from "~/types/upload";

export const UpdateProfile = () => {
  const queryClient = useQueryClient();
  const { currentUser, isCurrentUserPending } = useCurrentUser();
  const { data: profilePicture } = useQuery({
    queryKey: ["profile-picture", currentUser?.profile?.pictureId],
    queryFn: () => api.upload.getUploadById(currentUser?.profile?.pictureId!),
    enabled: !!currentUser?.profile?.pictureId,
    staleTime: Infinity,
  });
  const updatClientStore = useUpdateClientStore();
  const navigation = useNavigation();
  const { regions, isFetchRegionsPending } = useRegions();

  const { uploadFiles: uploadPicture, isUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      updatClientStore.setNested(
        "updateDto.profile.pictureId",
        response?.[0]?.id
      );
    },
    onError: (error: any) => {
      updatClientStore.setNested("errors.pictureId", [error.message]);
    },
  });

  const { updateProfileStructure } = useUpdateProfileFormStructure({
    store: updatClientStore,
    regions: mapToSelectOptions({
      data: isFetchRegionsPending ? [] : regions,
      labelKey: "label",
      valueKey: "id",
    }),
    uploadPicture,
    isUploadPending,
  });

  React.useEffect(() => {
    if (currentUser) {
      updatClientStore.set("updateDto", {
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        dateOfBirth: currentUser.dateOfBirth
          ? new Date(currentUser.dateOfBirth)
          : undefined,
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
      updatClientStore.set("picture", profilePicture);
    }
    return () => {
      updatClientStore.reset();
    };
  }, [currentUser]);

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationFn: () => api.client.updateCurrent(updatClientStore.updateDto),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["current-user"],
        });
        showToastable({
          message: "Profile Updated Successfully",
          status: "success",
        });
        navigation.goBack();
      },
      onError: (error: ServerErrorResponse) => {
        showToastable({
          message: error.response?.data?.message,
          status: "danger",
        });
      },
    });

  const handleUpdate = async () => {
    const resultUser = updateClientSchema.safeParse(updatClientStore.updateDto);
    const resultProfile = updateProfileSchema.safeParse(
      updatClientStore.updateDto.profile
    );

    if (!resultUser.success || !resultProfile.success) {
      const userErrors = resultUser.success
        ? {}
        : resultUser.error.flatten().fieldErrors;

      const profileErrors = resultProfile.success
        ? {}
        : resultProfile.error.flatten().fieldErrors;

      updatClientStore.set("errors", {
        ...userErrors,
        ...profileErrors,
      });

      return;
    }

    updateProfile();
  };

  if (isCurrentUserPending) return <Loader />;

  return (
    <StableKeyboardAwareScrollView>
      <View className="flex flex-col gap-6 mx-4 mb-6">
        <FormBuilder structure={updateProfileStructure} className="my-4" />

        <Button
          onPress={handleUpdate}
          className="flex flex-row gap-2 w-full"
          disabled={isUpdateProfilePending || isUploadPending}
        >
          <Icon name={Save} size={24} />
          <Text>Update Profile</Text>
        </Button>
      </View>
    </StableKeyboardAwareScrollView>
  );
};
