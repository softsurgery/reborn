import React from "react";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "../ui/text";
import { SelectBox } from "../shared/SelectBox";
import { Button } from "../ui/button";
import { useKeyboardVisible } from "~/hooks/useKeyboardVisible";
import { useSkills } from "@/hooks/content/useSkills";


interface SkillsProps {
  className?: string;
}

export const Skills = ({ className }: SkillsProps) => {
  const isKeyboardVisible = useKeyboardVisible();

  const { skills, isFetchSkillsPending, refetchSkills } = useSkills();

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
        <SelectBox
          params={options}
          selected={}
          isPending={isPending}
          onSelectParam={}
          onRemoveParam={}
          className="flex-1"
        />
      </View>
      {!isKeyboardVisible && (
        <View className="py-6 border-t border-border">
          <Button
            className="mx-6 mb-4 rounded-full"
            size="sm"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleSave();
            }}
            disabled={isPending || selectedIndustries.length === 0}
          >
            {isPending ? (
              <React.Fragment>
                <Icon
                  as={Loader2}
                  size={18}
                  className="text-primary-foreground animate-spin"
                />
                <Text className="text-primary-foreground font-semibold">
                  Saving...
                </Text>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Icon as={Save} size={18} className="text-primary-foreground" />
                <Text className="text-primary-foreground font-semibold">
                  Save Selection
                </Text>
              </React.Fragment>
            )}
          </Button>
        </View>
      )}
    </StableSafeAreaView>
  );
};
