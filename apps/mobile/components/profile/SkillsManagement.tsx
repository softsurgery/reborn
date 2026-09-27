import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { useSkills } from "@/hooks/content/reference-types/useSkills";
import { useUserSkills } from "@/hooks/content/user/useUserSkills";
import { cn } from "@/lib/utils";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "@/components/shared/AppHeader";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { Text } from "@/components/ui/text";
import { Loader2 } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/button";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { toast } from "sonner-native";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import {
  FieldVariant,
  FormStructure,
  MultiSelectFieldProps,
} from "@/components/shared/form-builder/types";
import { StableKeyboardAwareScrollView } from "@/components/shared/stables/StableKeyboardAwareScrollView";
import { BottomButtonWrapper } from "@/components/shared/BottomButtonBlockWrapper";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";

interface SkillsManagementProps {
  className?: string;
}

export const SkillsManagement = ({ className }: SkillsManagementProps) => {
  const { t } = useTranslation("menu");
  const isKeyboardVisible = useKeyboardVisible();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const { skills, isSkillsPending } = useSkills();
  const { userSkills, isUserSkillsPending } = useUserSkills({
    userId: currentUser?.id,
    enabled: !!currentUser?.id,
  });
  const [selectedSkills, setSelectedSkills] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (userSkills && userSkills.length > 0) {
      setSelectedSkills(userSkills);
    }
  }, [userSkills]);

  const { mutate: updateSkills, isPending: isMutationPending } = useMutation({
    mutationFn: async (skills: number[]) =>
      api.currentUser.updateCurrentSkills(skills),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", currentUser?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-skills", currentUser?.id],
      });
      toast.success(t("menu.skills.toasts.updated"), {
        description: t("menu.skills.toasts.updatedDescription"),
      });
      router.back();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("menu.skills.toasts.error"), {});
    },
  });

  const handleSave = () => {
    if (selectedSkills.length > 0) {
      updateSkills(selectedSkills);
    } else {
      toast.warning(t("menu.skills.toasts.noSelection"), {
        description: t("menu.skills.toasts.noSelectionDescription"),
      });
    }
  };

  const isPending = isSkillsPending || isUserSkillsPending || isMutationPending;

  const options = React.useMemo(
    () =>
      skills.map((skill) => ({
        label: skill.label,
        value: skill.id.toString(),
      })),
    [skills],
  );

  const structure: FormStructure = {
    title: t("menu.skills.title"),
    fieldsets: [
      {
        rows: [
          {
            id: 1,
            fields: [
              {
                id: "skills",
                variant: FieldVariant.MULTISELECT,
                label: t("menu.skills.labels.skills"),
                props: {
                  value: selectedSkills.map(String),
                  onSelect: (ids) => setSelectedSkills(ids.map(Number)),
                  options: options,
                  max: 5,
                } satisfies MultiSelectFieldProps,
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2 bg-transparent" }}
        title={t("menu.skills.title")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />
      <View className="flex-1 bg-background">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-sm text-muted-foreground leading-relaxed">
            {t("menu.skills.description")}
          </Text>
        </View>
        <StableKeyboardAwareScrollView className="flex-1 bg-background">
          <FormBuilder structure={structure} className="mt-4 px-2" />
        </StableKeyboardAwareScrollView>
      </View>
      {!isKeyboardVisible && (
        <BottomButtonWrapper>
          <Button
            size="lg"
            className="rounded-xl"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleSave();
            }}
            disabled={isPending || selectedSkills.length === 0}
          >
            {isPending ? (
              <React.Fragment>
                <Icon
                  as={Loader2}
                  size={18}
                  className="text-primary-foreground animate-spin"
                />
                <Text className="text-primary-foreground text-md font-bold">
                  {t("menu.skills.actions.updatePending")}
                </Text>
              </React.Fragment>
            ) : (
              <Text className="text-primary-foreground text-md font-bold">
                {t("menu.skills.actions.update")}
              </Text>
            )}
          </Button>
        </BottomButtonWrapper>
      )}
    </StableSafeAreaView>
  );
};
