import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { useExploreFilterStore } from "@/hooks/stores/userExploreFilterStore";
import { StableKeyboardAwareScrollView } from "@/components/shared/StableKeyboardAwareScrollView";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useJobCategories } from "@/hooks/content/reference-types/useJobCategories";
import { useJobTags } from "@/hooks/content/reference-types/useJobTags";
import { useExploreFilterFormStructure } from "./useExploreFiltersFormStructure";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";
import { useSkills } from "@/hooks/content/reference-types/useSkills";
import { Button } from "@/components/ui/button";
import { StableSafeAreaView } from "@/components/shared/StableSafeAreaView";
import { ApplicationHeader } from "@/components/shared/AppHeader";

interface JobFiltersProps {
  className?: string;
}

export const JobFiltersPortal = ({ className }: JobFiltersProps) => {
  const isKeyboardVisible = useKeyboardVisible();
  const exploreFilterStore = useExploreFilterStore();

  React.useEffect(() => {
    exploreFilterStore.set("dto", structuredClone(exploreFilterStore.filters));
    return () => {
      exploreFilterStore.resetDto();
    };
  }, []);

  const { jobCategories, isJobCategoriesPending } = useJobCategories();
  const { jobTags, isJobTagsPending } = useJobTags();
  const { skills, isFetchSkillsPending } = useSkills();

  const structure = useExploreFilterFormStructure({
    store: exploreFilterStore,
    categories: mapToSelectOptions({
      data: jobCategories,
      labelKey: "label",
      valueKey: "id",
    }),
    tags: mapToSelectOptions({
      data: jobTags,
      labelKey: "label",
      valueKey: "id",
    }),
    skills: mapToSelectOptions({
      data: skills,
      labelKey: "label",
      valueKey: "id",
    }),
    isPending:
      isJobCategoriesPending || isJobTagsPending || isFetchSkillsPending,
  });

  const handleApplyFilters = () => {
    exploreFilterStore.apply();
    router.back();
  };

  const handleResetFilters = () => {
    exploreFilterStore.reset();
  };

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={"Job Filters"}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ArrowLeft,
            onPress: () => {
              exploreFilterStore.reset();
              router.back();
            },
          },
        ]}
      />
      <View className="flex-1 bg-background">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-sm text-muted-foreground leading-relaxed">
            Apply filters to narrow down your search results and find the
            perfect job that matches your preferences.
          </Text>
        </View>

        <StableKeyboardAwareScrollView className="flex-1 bg-background">
          <FormBuilder structure={structure} className="mt-4 px-2" />
        </StableKeyboardAwareScrollView>
      </View>
      {!isKeyboardVisible && (
        <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-card px-5 pt-4 pb-8 gap-2">
          <Button
            size="lg"
            className="rounded-2xl"
            onPress={handleApplyFilters}
          >
            <Text className="font-semibold">Apply filters</Text>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl"
            onPress={handleResetFilters}
          >
            <Text className="text-muted-foreground">Reset</Text>
          </Button>
        </View>
      )}
    </StableSafeAreaView>
  );
};
