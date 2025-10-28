import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react-native";
import { Loader } from "~/components/shared/Loader";
import { Button } from "~/components/ui/button";
import { useClientStore } from "~/hooks/stores/useClientStore";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
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
import { useUploadMutation } from "~/hooks/content/useUploadMutation";
import { Upload } from "~/types/upload";
import { useServerImage } from "~/hooks/content/useServerImage";
import { identifyUserAvatar } from "~/lib/user.utils";
import { StableKeyboardAwareScrollView } from "../shared/StableKeyboardAwareScrollView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Icon } from "../ui/icon";

export const UpdateProfile = () => {
  const queryClient = useQueryClient();
  const { currentUser, isCurrentUserPending } = useCurrentUser();

  const { upload } = useServerImage({
    id: currentUser?.profile?.pictureId,
    fallback: identifyUserAvatar(currentUser),
    size: { width: 40, height: 40 },
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
      clientStore.set("picture", upload!);
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

  const scrollRef = React.useRef<KeyboardAwareScrollView>(null);
  const formRef = React.useRef<{
    scrollToError: (id: string, scrollRef?: any) => void;
  }>(null);

  const handleUpdate = () => {
    const resultUser = updateClientSchema.safeParse(clientStore.updateDto);
    const resultProfile = updateProfileSchema.safeParse(
      clientStore.updateDto.profile
    );

    if (!resultUser.success || !resultProfile.success) {
      const errors = {
        ...(resultUser.success ? {} : resultUser.error.flatten().fieldErrors),
        ...(resultProfile.success
          ? {}
          : resultProfile.error.flatten().fieldErrors),
      };
      clientStore.set("errors", errors);

      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        formRef.current?.scrollToError(firstErrorKey, scrollRef);
      }
      return;
    }

    updateProfile();
  };

  if (isCurrentUserPending) return <Loader isPending={true} />;

  return (
    <StableKeyboardAwareScrollView
      className="flex flex-col flex-1 gap-6 mx-2 mb-10"
      ref={scrollRef}
    >
      <FormBuilder structure={updateProfileStructure} ref={formRef} />
      <Button
        onPress={handleUpdate}
        className="flex flex-row gap-2"
        disabled={isUpdateProfilePending || isUploadPending}
      >
        <Icon as={Save} size={24} />
        <Text>Update Profile</Text>
      </Button>
    </StableKeyboardAwareScrollView>
  );
};
