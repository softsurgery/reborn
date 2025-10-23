import React from "react";
import { View } from "react-native";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useCreateJobFormStructure } from "./forms/useCreateJobFormStructure";
import { useJobStore } from "~/hooks/stores/useJobStore";
import { useCurrencies } from "~/hooks/content/useCurrencies";
import { mapToSelectOptions } from "~/components/shared/form-builder/utils/mapToSelectOptions";
import { useJobTags } from "~/hooks/content/job/useJobTags";
import { useJobCategories } from "~/hooks/content/job/useJobCategories";
import { Stepper } from "~/components/shared/Stepper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { api } from "~/api";
import { useMutation } from "@tanstack/react-query";
import { CreateJobDto, ServerErrorResponse } from "~/types";
import { showToastable } from "react-native-toastable";
import { cn } from "~/lib/utils";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";

interface JobCreateFormProps {
  className?: string;
}

export const JobCreateForm = ({ className }: JobCreateFormProps) => {
  const navigation = useNavigation<NavigationProps>();
  const scrollRef = React.useRef<KeyboardAwareScrollView>(null);

  const jobStore = useJobStore();
  const { currencies } = useCurrencies();
  const { isFetchJobTagsPending, jobTags } = useJobTags();
  const { jobCategories, isFetchJobCategoriesPending } = useJobCategories();

  const { jobCreateFormStructure } = useCreateJobFormStructure({
    jobStore,
    currencies,
    jobTags: mapToSelectOptions({
      data: isFetchJobTagsPending ? [] : jobTags,
      labelKey: "label",
      valueKey: "id",
    }),
    jobCategories: mapToSelectOptions({
      data: isFetchJobCategoriesPending ? [] : jobCategories,
      labelKey: "label",
      valueKey: "id",
    }),
  });

  const { mutate: createJob, isPending: isCreationPending } = useMutation({
    mutationFn: (job: CreateJobDto) => api.job.create(job),
    onSuccess: () => {
      jobStore.reset();
      showToastable({
        message: "Job created successfully",
        status: "success",
      });
      navigation.navigate("index", { defaultTab: "explore", reset: true });
    },
    onError: (error: ServerErrorResponse) => {
      showToastable({
        message: `Failed to create job: ${error.response?.data.message}`,
        status: "danger",
      });
    },
  });

  React.useEffect(() => {
    //hardcoded tunisian value
    jobStore.setNested("createDto.currencyId", "TND");
    return () => {
      jobStore.reset();
    };
  }, []);

  return (
    <View className={cn("flex-1 mx-2", className)}>
      <Stepper
        steps={[
          <FormBuilder structure={jobCreateFormStructure} className="py-2" />,
        ]}
        closingAction={{
          label: "Publish",
          onPress: () => {
            createJob(jobStore.createDto);
          },
        }}
      />
    </View>
  );
};
