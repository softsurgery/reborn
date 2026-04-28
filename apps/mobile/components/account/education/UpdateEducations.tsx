import { api } from "~/api";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { Tappable } from "~/components/shared/Tappable";
import { StablePressable } from "~/components/shared/StablePressable";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { StableScrollView } from "~/components/shared/StableScrollView";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { getExperienceYears } from "~/lib/dates.utils";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { ResponseEducationDto, ServerErrorResponse } from "~/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { router } from "expo-router";
import {
  ArrowLeft,
  GraduationCap,
  Building2,
  Calendar,
  FileText,
} from "lucide-react-native";
import { View } from "react-native";
import { toast } from "sonner-native";
import React from "react";
import { type ActionSheetRef } from "react-native-actions-sheet";
import { DeleteEducationActionSheet } from "./DeleteEducationActionSheet";

interface UpdateEducationsProps {
  className?: string;
}

export const UpdateEducations = ({ className }: UpdateEducationsProps) => {
  const userStore = useUserStore();
  const queryClient = useQueryClient();
  const deleteSheetRef = React.useRef<ActionSheetRef>(null);
  const [selectedEducationId, setSelectedEducationId] = React.useState<
    number | null
  >(null);

  const onUpdateEducationPress = (edu: ResponseEducationDto) => {
    userStore.set("responseEducation", edu);
    userStore.set("updateEducationDto", {
      title: edu.title,
      institution: edu.institution,
      startDate: new Date(edu.startDate),
      endDate: edu.endDate ? new Date(edu.endDate) : null,
      description: edu.description,
    });
    router.push("/main/account/update-education");
  };

  const { mutate: deleteEducation, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.education.remove(id),
    onSuccess: () => {
      toast.success("Education deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["educations", userStore.response?.id],
      });
      deleteSheetRef.current?.hide();
      setSelectedEducationId(null);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data?.message || "Failed to delete education",
      );
    },
  });

  const onDeleteEducationPress = (educationId: number) => {
    setSelectedEducationId(educationId);
    deleteSheetRef.current?.show();
  };

  const onCloseDeleteEducationSheet = () => {
    deleteSheetRef.current?.hide();
    setSelectedEducationId(null);
  };

  const onConfirmDeleteEducation = () => {
    if (!selectedEducationId) {
      toast.error("No education selected");
      return;
    }

    deleteEducation(selectedEducationId);
  };

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        className="border-b border-border pb-2"
        title="Educations"
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ArrowLeft,
            onPress: () => {
              router.back();
            },
          },
        ]}
      />
      <StableScrollView className="bg-background flex-1">
        <View className="flex flex-col flex-1 pb-10">
          {userStore.educations && userStore.educations.length > 0 ? (
            <View className="gap-5">
              {userStore.educations.map((edu, index) => {
                return (
                  <View
                    key={edu.id}
                    className="bg-card border border-border overflow-hidden shadow-sm"
                  >
                    {/* Header with index badge */}
                    <View className="flex flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-border">
                      <View className="flex flex-row items-center gap-2">
                        <View className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon as={GraduationCap} size={16} />
                        </View>
                        <Text className="text-base font-semibold">
                          Education {index + 1}
                        </Text>
                      </View>
                      {edu.endDate === null && (
                        <View className="bg-green-500/20 px-2.5 py-1 rounded-full">
                          <Text className="text-xs font-medium">Current</Text>
                        </View>
                      )}
                    </View>

                    {/* Content */}
                    <View className="px-4 py-4 gap-3.5">
                      {/* Degree/Title */}
                      <View className="gap-1.5">
                        <Text className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                          Degree/Field of Study
                        </Text>
                        <Text className="text-lg font-bold text-foreground">
                          {edu.title}
                        </Text>
                      </View>

                      {/* Institution */}
                      <View className="flex flex-row items-center gap-3">
                        <Icon as={Building2} size={18} />
                        <Text className="text-base text-muted-foreground flex-1">
                          {edu.institution}
                        </Text>
                      </View>

                      {/* Duration */}
                      <View className="flex flex-row items-center gap-3">
                        <Icon as={Calendar} size={18} />
                        <View>
                          <Text className="text-sm text-foreground font-medium">
                            {format(new Date(edu.startDate), "MMM yyyy")} -{" "}
                            {edu.endDate
                              ? format(new Date(edu.endDate), "MMM yyyy")
                              : "Present"}
                          </Text>
                          <Text className="text-xs text-muted-foreground">
                            {getExperienceYears(edu.startDate, edu.endDate)}{" "}
                            years
                          </Text>
                        </View>
                      </View>

                      {/* Description */}
                      {edu.description && (
                        <View className="flex flex-row gap-3 mt-1">
                          <Icon as={FileText} size={18} />
                          <Text className="text-sm text-foreground flex-1 leading-5">
                            {edu.description}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Action Buttons */}
                    <View className="flex flex-col border-t border-border">
                      <Tappable
                        className="p-4 flex flex-row border-b border-border"
                        classNames={{
                          content: "font-semibold text-sm",
                          pressable: "bg-primary/20",
                        }}
                        onPress={() => onUpdateEducationPress(edu)}
                      >
                        Edit education
                      </Tappable>

                      <Tappable
                        className="p-4 flex flex-row"
                        classNames={{
                          content: "font-semibold text-sm",
                          pressable: "bg-destructive/50",
                        }}
                        onPress={() => onDeleteEducationPress(edu.id)}
                      >
                        Delete education
                      </Tappable>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-12">
              <View className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <GraduationCap size={32} className="text-muted-foreground" />
              </View>
              <Text className="text-lg font-semibold mb-2">
                No Education Yet
              </Text>
              <Text className="text-sm text-muted-foreground text-center">
                Add your education to showcase your academic background
              </Text>
            </View>
          )}

          {/* Add Education Button */}
          {userStore.educations && userStore.educations.length >= 0 && (
            <StablePressable
              className="text-center mt-4 underline font-medium w-fit mx-auto rounded-lg"
              onPress={() => router.push("/main/account/create-education")}
            >
              <Text className="text-sm underline p-2">New Education?</Text>
            </StablePressable>
          )}
        </View>
      </StableScrollView>
      <DeleteEducationActionSheet
        ref={deleteSheetRef}
        onConfirm={onConfirmDeleteEducation}
        onClose={onCloseDeleteEducationSheet}
        isPending={isDeletePending}
      />
    </StableSafeAreaView>
  );
};
