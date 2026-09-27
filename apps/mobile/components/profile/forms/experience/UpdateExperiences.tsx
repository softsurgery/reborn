import React from "react";
import { api } from "@/api";
import { ApplicationHeader } from "@/components/shared/AppHeader";
import { Tappable } from "@/components/shared/Tappable";
import { StablePressable } from "@/components/shared/stables/StablePressable";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import StableScrollView from "@/components/shared/stables/StableScrollView";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ResponseExperienceDto, ServerErrorResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Briefcase } from "lucide-react-native";
import { View } from "react-native";
import { toast } from "sonner-native";
import { ActionSheetRef } from "react-native-actions-sheet";
import { DeleteExperienceActionSheet } from "./DeleteExperienceActionSheet";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { ExperienceInstance } from "./ExperienceInstance";

import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { useUserStore } from "@/hooks/stores/useUserStore";

interface UpdateExperiencesProps {
  className?: string;
}

export const UpdateExperiences = ({ className }: UpdateExperiencesProps) => {
  const { t } = useTranslation("menu");
  const userStore = useUserStore();
  const queryClient = useQueryClient();
  const isRTL = useRTL();
  const deleteSheetRef = React.useRef<ActionSheetRef>(null);
  const [selectedExperienceId, setSelectedExperienceId] = React.useState<
    number | null
  >(null);

  const onUpdateExperiencePress = (exp: ResponseExperienceDto) => {
    userStore.set("responseExperience", exp);
    userStore.set("updateExperienceDto", {
      title: exp.title,
      company: exp.company,
      location: exp.location,
      workType: exp.workType,
      locationType: exp.locationType,
      startDate: new Date(exp.startDate!),
      endDate: exp.endDate ? new Date(exp.endDate) : undefined,
      description: exp.description,
    });
    userStore.set("present", exp.endDate === null);
    router.push("/main/account/career/update-experience");
  };

  const { mutate: deleteExperience, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.experience.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["experiences", userStore.response?.id],
      });
      toast.success(t("experience.toasts.deleted"), {
        description: t("experience.toasts.deletedDescription"),
      });
      deleteSheetRef.current?.hide();
      setSelectedExperienceId(null);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data?.message || t("experience.toasts.error"),
        {},
      );
    },
  });

  const onDeleteExperiencePress = (experienceId: number) => {
    setSelectedExperienceId(experienceId);
    deleteSheetRef.current?.show();
  };

  const onCloseDeleteExperienceSheet = () => {
    deleteSheetRef.current?.hide();
    setSelectedExperienceId(null);
  };

  const onConfirmDeleteExperience = () => {
    if (!selectedExperienceId) {
      toast.error(t("experience.toasts.noSelection"));
      return;
    }

    deleteExperience(selectedExperienceId);
  };

  return (
    <StableSafeAreaView className={cn("flex flex-1", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2 bg-transparent" }}
        title={t("experience.list.title")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />
      <StableScrollView className="bg-background flex-1">
        <View className="flex flex-col flex-1 pb-10">
          {userStore.experiences && userStore.experiences.length > 0 ? (
            <View className="gap-5">
              {userStore.experiences.map((exp, index) => {
                return (
                  <View
                    key={exp.id}
                    className="bg-card border border-border overflow-hidden shadow-sm"
                  >
                    {/* Content */}
                    <ExperienceInstance
                      experience={exp}
                      className="px-4 py-4"
                    />

                    {/* Action Buttons */}
                    <View className="flex flex-col border-t border-border">
                      <Tappable
                        className={cn(
                          "p-4 flex border-b border-border",
                          isRTL ? "flex-row-reverse" : "flex-row",
                        )}
                        classNames={{
                          content: "font-semibold text-sm",
                          pressable: "bg-primary/20",
                        }}
                        onPress={() => onUpdateExperiencePress(exp)}
                      >
                        {t("experience.list.actions.edit")}
                      </Tappable>
                      <Tappable
                        className={cn(
                          "p-4 flex",
                          isRTL ? "flex-row-reverse" : "flex-row",
                        )}
                        classNames={{
                          content: "font-semibold text-sm",
                          pressable: "bg-destructive/50",
                        }}
                        onPress={() => onDeleteExperiencePress(exp.id)}
                      >
                        {t("experience.list.actions.delete")}
                      </Tappable>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-12">
              <View className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon as={Briefcase} size={32} />
              </View>
              <Text className="text-lg font-semibold mb-2">
                {t("experience.list.empty.title")}
              </Text>
              <Text className="text-sm text-muted-foreground text-center">
                {t("experience.list.empty.description")}
              </Text>
              <StablePressable
                className="text-center mt-4 underline font-medium w-fit mx-auto rounded-lg"
                onPress={() =>
                  router.push("/main/account/career/create-experience")
                }
              >
                <Text className="text-sm underline p-2">
                  {t("experience.list.empty.action")}
                </Text>
              </StablePressable>
            </View>
          )}
        </View>
      </StableScrollView>
      <DeleteExperienceActionSheet
        ref={deleteSheetRef}
        onConfirm={onConfirmDeleteExperience}
        onClose={onCloseDeleteExperienceSheet}
        isPending={isDeletePending}
      />
    </StableSafeAreaView>
  );
};
