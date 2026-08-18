import { api } from "@/api";
import { ApplicationHeader } from "@/components/shared/AppHeader";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { StableKeyboardAwareScrollView } from "@/components/shared/stables/StableKeyboardAwareScrollView";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { CreateExperienceDto, ServerErrorResponse } from "@/types";
import { createExperienceSchema } from "@/types/validations/experience.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { useCreateExperienceFormStructure } from "./useCreateExperienceFormStructure";
import { toast } from "sonner-native";
import React from "react";

import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { BottomButtonWrapper } from "@/components/shared/BottomButtonBlockWrapper";
import { useUserStore } from "@/hooks/stores/useUserStore";
interface CreateExperienceProps {
  className?: string;
}

export const CreateExperience = ({ className }: CreateExperienceProps) => {
  const { t } = useTranslation("menu");
  const isKeyboardVisible = useKeyboardVisible();
  const userStore = useUserStore();
  const queryClient = useQueryClient();



  const { mutate: createExperience, isPending } = useMutation({
    mutationFn: (experience: CreateExperienceDto) =>
      api.experience.createCurrent(experience),
    onSuccess: () => {
      toast.success(t("experience.toasts.created"), {
        description: t("experience.toasts.createdDescription"),
      });
      queryClient.invalidateQueries({
        queryKey: ["experiences"],
      });
      router.back();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data?.message || t("experience.toasts.error"),
        {},
      );
    },
  });

  const { structure } = useCreateExperienceFormStructure({
    store: userStore,
    isPending,
  });

  const handleCreateSubmit = () => {
    const data = userStore.createExperienceDto;
    const result = createExperienceSchema.safeParse(data);
    if (!result.success) {
      userStore.set("experienceErrors", result.error.flatten().fieldErrors);
    } else {
      createExperience(data);
    }
  };

  React.useEffect(() => {
    return () => {
      userStore.reset();
    };
  }, []);

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={t("experience.form.createHeader")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />

      {/* Scrollable content */}
      <StableKeyboardAwareScrollView className="flex-1 bg-background">
        <View className="p-4">
          <Text className="text-sm text-muted-foreground leading-relaxed">
            {t("experience.form.description")}
          </Text>
        </View>
        <FormBuilder structure={structure} className="px-2" />
      </StableKeyboardAwareScrollView>

      {/* Sticky bottom button */}
      {!isKeyboardVisible && (
        <BottomButtonWrapper>
          <Button size="lg" className="rounded-xl" onPress={handleCreateSubmit} disabled={isPending}>
            <Text className="text-md font-bold">
              {t("experience.form.actions.create")}
            </Text>
          </Button>
        </BottomButtonWrapper>
      )}
    </StableSafeAreaView>
  );
};
