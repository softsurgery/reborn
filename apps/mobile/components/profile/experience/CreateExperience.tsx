import { api } from "~/api";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { StableKeyboardAwareScrollView } from "~/components/shared/StableKeyboardAwareScrollView";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { CreateExperienceDto, ServerErrorResponse } from "~/types";
import { createExperienceSchema } from "~/types/validations/experience.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { toast } from "sonner-native";

import { useCreateExperienceFormStructure } from "./useCreateExperienceFormStructure";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";

interface CreateExperienceProps {
  className?: string;
}

export const CreateExperience = ({ className }: CreateExperienceProps) => {
  const { t } = useTranslation("common");
  const { currentUser } = useCurrentUser();
  const userStore = useUserStore();
  const queryClient = useQueryClient();

  const { structure } = useCreateExperienceFormStructure({
    store: userStore,
  });
  const { mutate: createExperience } = useMutation({
    mutationFn: (data: { experience: CreateExperienceDto }) =>
      api.experience.createCurrent(data.experience),
    onSuccess: () => {
      toast.success("Experience created successfully");
      queryClient.invalidateQueries({
        queryKey: ["experiences", userStore.response?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", currentUser?.id],
      });
      router.back();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data?.message || "Failed to create experience",
      );
    },
  });

  const handleCreateSubmit = () => {
    const data = userStore.createExperienceDto;
    const result = createExperienceSchema.safeParse(data);
    console.log(result);
    if (!result.success) {
      userStore.set("experienceErrors", result.error.flatten().fieldErrors);
    }
    createExperience({
      experience: data,
    });
  };

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        className="border-b border-border pb-2"
        title={t("screens.experience")}
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

      {/* Scrollable content */}
      <StableKeyboardAwareScrollView className="flex-1 bg-background">
        <FormBuilder structure={structure} className="mt-4 px-2" />
      </StableKeyboardAwareScrollView>

      {/* Sticky bottom button */}
      <View className="py-6 border-t border-border">
        <Button
          size="sm"
          className="mx-6 mb-4 rounded-full"
          onPress={handleCreateSubmit}
        >
          <Text>Create Experience</Text>
        </Button>
      </View>
    </StableSafeAreaView>
  );
};
