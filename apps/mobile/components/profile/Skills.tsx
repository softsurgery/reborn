import React from "react";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { ArrowLeft, Loader2, Save } from "lucide-react-native";
import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "../ui/text";
import { useKeyboardVisible } from "~/hooks/useKeyboardVisible";
import { useSkills } from "@/hooks/content/reference-types/useSkills";

interface SkillsProps {
  className?: string;
}

export const Skills = ({ className }: SkillsProps) => {
  const isKeyboardVisible = useKeyboardVisible();

  const { skills, isFetchSkillsPending, refetchSkills } = useSkills();

  const handleSave = async () => {};

  return (
    <StableSafeAreaView className={cn("flex-1", className)}>
      <ApplicationHeader
        className="border-b border-border pb-2 bg-transparent"
        title="Industries"
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
      <View className="flex-1 bg-background">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-sm text-muted-foreground leading-relaxed">
            Select one or more industries that align with your professional
            goals and aspirations. This helps you connect with like-minded
            professionals and opportunities.
          </Text>
        </View>
      </View>
      {!isKeyboardVisible && (
        <View className="py-6 border-t border-border"></View>
      )}
    </StableSafeAreaView>
  );
};
