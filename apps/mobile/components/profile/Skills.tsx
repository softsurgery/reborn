import React from "react";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { ChevronLeft, Loader2, Save } from "lucide-react-native";
import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "../ui/text";
import { useKeyboardVisible } from "~/hooks/useKeyboardVisible";
import { useSkills } from "@/hooks/content/reference-types/useSkills";
import { useTranslation } from "react-i18next";

interface SkillsProps {
  className?: string;
}

export const Skills = ({ className }: SkillsProps) => {
  const { t } = useTranslation("menu");
  const isKeyboardVisible = useKeyboardVisible();

  const { skills, isFetchSkillsPending, refetchSkills } = useSkills();

  const handleSave = async () => {};

  return (
    <StableSafeAreaView className={cn("flex-1", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2 bg-transparent" }}
        title={t("menu.skills.title")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ChevronLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <View className="flex-1 bg-background">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-sm text-muted-foreground leading-relaxed">
            {t("menu.skills.description")}
          </Text>
        </View>
      </View>
      {!isKeyboardVisible && (
        <View className="py-6 border-t border-border"></View>
      )}
    </StableSafeAreaView>
  );
};
