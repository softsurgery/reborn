import React from "react";
import { View } from "react-native";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useCreateJobFormStructure } from "./useCreateJobFormStructure";
import { useJobStore } from "~/hooks/stores/useJobStore";
import { useCurrencies } from "~/hooks/content/useCurrencies";
import { mapToSelectOptions } from "~/components/shared/form-builder/utils/mapToSelectOptions";
import { useJobTags } from "~/hooks/content/job/useJobTags";
import { useJobCategories } from "~/hooks/content/job/useJobCategories";
import { Stepper } from "~/components/shared/Stepper";
import { api } from "~/api";
import { useMutation } from "@tanstack/react-query";
import { CreateJobDto, ServerErrorResponse } from "~/types";
import { showToastable } from "react-native-toastable";
import { cn } from "~/lib/utils";
import { router } from "expo-router";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { ArrowLeft } from "lucide-react-native";
import { Loader } from "@/components/shared/Loader";
import { useLiveGeolocation } from "@/hooks/useLiveGeolocation";
import { toast } from "sonner-native";

interface JobCreateFormProps {
  className?: string;
}

export const JobCreateForm = ({ className }: JobCreateFormProps) => {
  const {} = useLiveGeolocation();
  const jobStore = useJobStore();
  const { currencies } = useCurrencies();
  const { jobTags, isJobTagsPending } = useJobTags();
  const { jobCategories, isJobCategoriesPending } = useJobCategories();

  const {
    jobCreateFormStructure,
    jobDetailsFormStructure,
    jobImagePickerStructure,
  } = useCreateJobFormStructure({
    jobStore,
    currencies,
    jobTags: mapToSelectOptions({
      data: jobTags,
      labelKey: "label",
      valueKey: "id",
    }),
    jobCategories: mapToSelectOptions({
      data: jobCategories,
      labelKey: "label",
      valueKey: "id",
    }),
  });

  const { mutate: createJob, isPending: isCreationPending } = useMutation({
    mutationFn: (job: CreateJobDto) => api.job.create(job),
    onSuccess: () => {
      jobStore.reset();
      toast.success("Job created successfully");
      router.push("/main/(tabs)");
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(`Failed to create job: ${error.response?.data.message}`);
    },
  });

  React.useEffect(() => {
    //hardcoded tunisian value

    // jobStore.setNested("createDto.currencyId", "TND");

    return () => {
      jobStore.reset();
    };
  }, []);

  if (isJobTagsPending || isJobCategoriesPending) return <Loader />;

  return (
    <StableSafeAreaView className="flex-1 bg-card">
      <ApplicationHeader
        className="border-b border-border pb-2"
        title={"New Job"}
        reverse
        titleVariant="large"
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
      <View className={cn("flex-1 px-2 bg-background", className)}>
        <Stepper
          classNames={{
            controlsWrapper: "pb-8",
          }}
          steps={[
            {
              title: "Define the job",
              description: "Start by providing the basic details of the job.",
              component: (
                <FormBuilder
                  structure={jobCreateFormStructure}
                  className="py-2"
                />
              ),
            },
            {
              title: "Add Details",
              description:
                "Enrich the job listing with more specific information.",
              component: (
                <FormBuilder
                  structure={jobDetailsFormStructure}
                  className="py-2"
                />
              ),
            },
            {
              title: "Add Images",
              description: "Upload images related to the job.",
              component: (
                <FormBuilder
                  structure={jobImagePickerStructure}
                  className="py-2"
                />
              ),
            },
          ]}
          closingAction={{
            label: "Publish",
            onPress: () => {
              createJob(jobStore.createDto);
            },
          }}
        />
      </View>
    </StableSafeAreaView>
  );
};
