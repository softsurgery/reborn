import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react-native";
import { Loader } from "~/components/shared/Loader";
import { Button } from "~/components/ui/button";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { ServerErrorResponse } from "~/types";
import { Text } from "~/components/ui/text";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useUpdateProfileFormStructure } from "./useUpdateProfileFormStructure";
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
import { router } from "expo-router";
import { ApplicationHeader } from "../shared/AppHeader";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { View } from "react-native";
import { useKeyboardVisible } from "~/hooks/useKeyboardVisible";
import { toast } from "sonner-native";

interface UpdateProfileProps {
  className?: string;
}

export const UpdateProfile = ({ className }: UpdateProfileProps) => {
  const isKeyboardVisible = useKeyboardVisible();
  const queryClient = useQueryClient();
  const { currentUser, isCurrentUserPending } = useCurrentUser();

  const { upload } = useServerImage({
    id: currentUser?.pictureId,
    fallback: identifyUserAvatar(currentUser),
    size: { width: 40, height: 40 },
  });

  const userStore = useUserStore();
  const { regions, isRegionsPending } = useRegions();

  const { uploadFiles: uploadPicture, isUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.setNested("updateDto.pictureId", response?.[0]?.id);
    },
    onError: (error: any) => {
      userStore.setNested("errors.pictureId", [error.message]);
    },
  });

  const { updateProfileStructure } = useUpdateProfileFormStructure({
    store: userStore,
    regions: mapToSelectOptions({
      data: isRegionsPending ? [] : regions,
      labelKey: "label",
      valueKey: "id",
    }),
    uploadPicture,
    isUploadPending,
  });

  React.useEffect(() => {
    if (currentUser) {
      userStore.set("updateDto", {
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        dateOfBirth: currentUser.dateOfBirth
          ? new Date(currentUser.dateOfBirth)
          : undefined,
        isActive: currentUser.isActive,
        phone: currentUser.phone,
        cin: currentUser.cin,
        bio: currentUser.bio,
        gender: currentUser.gender,
        isPrivate: currentUser.isPrivate,
        regionId: currentUser.regionId,
      });
      userStore.set("picture", upload!);
    }
  }, [currentUser]);

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationFn: () => api.client.updateCurrent(userStore.updateDto),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["current-user"],
        });
        queryClient.invalidateQueries({
          queryKey: ["user", currentUser?.id],
        });
        toast.success("Profile Updated Successfully", {
          description: "Your profile has been successfully updated.",
        });
        router.back();
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          error.response?.data?.message || "Failed to update profile",
        );
      },
    });

  const formRef = React.useRef<{
    scrollToError: (id: string, scrollRef?: any) => void;
  }>(null);

  const handleUpdate = () => {
    const resultUser = updateClientSchema.safeParse(userStore.updateDto);
    const resultProfile = updateProfileSchema.safeParse(userStore.updateDto);

    if (!resultUser.success || !resultProfile.success) {
      const errors = {
        ...(resultUser.success ? {} : resultUser.error.flatten().fieldErrors),
        ...(resultProfile.success
          ? {}
          : resultProfile.error.flatten().fieldErrors),
      };
      userStore.set("errors", errors);

      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        formRef.current?.scrollToError(firstErrorKey);
      }
      return;
    }

    updateProfile();
  };

  if (isCurrentUserPending) return <Loader isPending={true} />;

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        className="border-b border-border pb-2"
        title={"Update Profile"}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ArrowLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <StableKeyboardAwareScrollView className="flex-1 bg-background ">
        <FormBuilder structure={updateProfileStructure} className="mt-4 px-2" />
      </StableKeyboardAwareScrollView>
      {!isKeyboardVisible && (
        <View className="py-6 border-t border-border">
          <Button
            size="sm"
            className="mx-6 mb-4 rounded-full"
            onPress={handleUpdate}
            disabled={isUpdateProfilePending}
          >
            <Text>Update Profile</Text>
          </Button>
        </View>
      )}
    </StableSafeAreaView>
  );
};
