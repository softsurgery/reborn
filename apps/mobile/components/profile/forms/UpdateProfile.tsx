import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { ServerErrorResponse, UpdateUserDto } from "~/types";
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
import { identifyUserAvatar } from "~/lib/user.utils";
import { StableKeyboardAwareScrollView } from "../../shared/stables/StableKeyboardAwareScrollView";
import { router } from "expo-router";
import { ApplicationHeader } from "../../shared/AppHeader";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../../shared/stables/StableSafeAreaView";
import { useKeyboardVisible } from "~/hooks/useKeyboardVisible";
import { toast } from "sonner-native";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { BottomButtonWrapper } from "@/components/shared/BottomButtonBlockWrapper";
import { useTranslation } from "react-i18next";
import { useServerImages } from "@/hooks/content/useServerImages";

interface UpdateProfileProps {
  className?: string;
}

export const UpdateProfile = ({ className }: UpdateProfileProps) => {
  const isKeyboardVisible = useKeyboardVisible();
  const userStore = useUserStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation("settings");
  const { regions, isRegionsPending } = useRegions();

  const { mutate: updateUser, isPending: isUpdatePending } = useMutation({
    mutationFn: (user: UpdateUserDto) => api.client.updateCurrent(user),
    onSuccess: () => {
      router.back();
      toast.success("Profile updated successfully", {
        description: "Your profile has been successfully updated.",
      });
      userStore.reset();
      queryClient.invalidateQueries({ queryKey: ["user", currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({
        queryKey: ["server-image", currentUser?.pictureId],
      });
      refetchCurrentUser();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data?.message || "Failed to update profile",
        {},
      );
    },
  });

  const handleUpdateSubmit = () => {
    const data = userStore.updateDto;
    const result = updateClientSchema.merge(updateProfileSchema).safeParse({
      ...data,
    });
    if (!result.success) {
      userStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      updateUser(data);
    }
  };

  const {
    uploadFiles: uploadProfilePicture,
    isUploadPending: isProfilePictureUploadPending,
  } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      userStore.setNested("updateDto.pictureId", response?.[0]?.id);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data?.message || "Failed to upload image",
        {},
      );
    },
  });

  const { currentUser, refetchCurrentUser, isCurrentUserPending } =
    useCurrentUser();

  const fallback = React.useMemo(
    () => identifyUserAvatar(currentUser),
    [currentUser],
  );

  const { structure } = useUpdateProfileFormStructure({
    store: userStore,
    fallback,
    regions: mapToSelectOptions({
      data: isRegionsPending ? [] : regions,
      labelKey: "label",
      valueKey: "id",
    }),
    uploadPicture: uploadProfilePicture,
    isProfilePictureUploadPending,
  });

  React.useEffect(() => {
    if (currentUser) {
      userStore.set("updateDto", {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        dateOfBirth: currentUser.dateOfBirth
          ? new Date(currentUser.dateOfBirth)
          : undefined,
        bio: currentUser.bio,
        gender: currentUser.gender,
        regionId: currentUser.regionId,
        isPrivate: currentUser.isPrivate,
      });
    }
    return () => {
      userStore.reset();
    };
  }, [currentUser]);

  const { uploads: profileUploads } = useServerImages({
    ids: [currentUser?.pictureId],
    fallbacks: [fallback],
    size: { width: 100, height: 100 },
  });

  React.useEffect(() => {
    if (
      profileUploads &&
      profileUploads[0] &&
      !userStore.hasInitializedPicture
    ) {
      userStore.set("picture", profileUploads[0] as string);
      userStore.set("hasInitializedPicture", true);
    }
  }, [profileUploads, currentUser?.pictureId]);
  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={"Update Profile"}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />
      <StableKeyboardAwareScrollView className="flex-1 bg-background ">
        <FormBuilder structure={structure} className="px-2" />
      </StableKeyboardAwareScrollView>
      {!isKeyboardVisible && (
        <BottomButtonWrapper>
          <Button
            size="lg"
            variant="default"
            className="rounded-xl"
            onPress={() => {
              handleUpdateSubmit();
            }}
            disabled={isUpdatePending}
          >
            <Text className="text-md font-bold">
              {isUpdatePending
                ? t(
                    "settings.account.screens.profile.actions.update-profile-pending",
                  )
                : t("settings.account.screens.profile.actions.update-profile")}
            </Text>
          </Button>
        </BottomButtonWrapper>
      )}
    </StableSafeAreaView>
  );
};
