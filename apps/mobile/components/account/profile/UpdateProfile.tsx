import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react-native";
import { View } from "react-native";
import { Loader } from "~/components/shared/Loader";
import { Button } from "~/components/ui/button";
import { useClientStore } from "~/hooks/stores/useClientStore";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import Icon from "~/lib/Icon";
import { ServerErrorResponse } from "~/types";
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
import { useUploadMutation } from "~/hooks/useUploadMutation";
import { Upload } from "~/types/upload";
import { StableKeyboardAwareScrollView } from "~/components/shared/KeyboardAwareScrollView";

export const UpdateProfile = () => {
  const queryClient = useQueryClient();
  const { currentUser, isCurrentUserPending } = useCurrentUser();
  const { data: profilePicture } = useQuery({
    queryKey: ["profile-picture", currentUser?.profile?.pictureId],
    queryFn: () => api.upload.getUploadById(currentUser?.profile?.pictureId!),
    enabled: !!currentUser?.profile?.pictureId,
    staleTime: Infinity,
  });
  const clientStore = useClientStore();
  const navigation = useNavigation();
  const { regions, isFetchRegionsPending } = useRegions();

  const { uploadFiles: uploadPicture, isUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      clientStore.setNested("updateDto.profile.pictureId", response?.[0]?.id);
    },
    onError: (error: any) => {
      clientStore.setNested("errors.pictureId", [error.message]);
    },
  });

  const { updateProfileStructure } = useUpdateProfileFormStructure({
    store: clientStore,
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
      clientStore.set("updateDto", {
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
      clientStore.set("picture", profilePicture);
    }
  }, [currentUser]);

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationFn: () => api.client.updateCurrent(clientStore.updateDto),
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

  const formRef = React.useRef<{ scrollToError: (id: string) => void }>(null);

  const handleUpdate = async () => {
    const resultUser = updateClientSchema.safeParse(clientStore.updateDto);
    const resultProfile = updateProfileSchema.safeParse(
      clientStore.updateDto.profile
    );

    if (!resultUser.success || !resultProfile.success) {
      const userErrors = resultUser.success
        ? {}
        : resultUser.error.flatten().fieldErrors;

      const profileErrors = resultProfile.success
        ? {}
        : resultProfile.error.flatten().fieldErrors;

      const errors = { ...userErrors, ...profileErrors };
      clientStore.set("errors", errors);

      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        formRef.current?.scrollToError(firstErrorKey);
      }
      return;
    }

    updateProfile();
  };

  if (isCurrentUserPending) return <Loader />;

  return (
    <StableKeyboardAwareScrollView>
      <View className="flex flex-col gap-6 mx-4 mb-6">
        <FormBuilder
          ref={formRef}
          structure={updateProfileStructure}
          className="my-4"
        />

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
