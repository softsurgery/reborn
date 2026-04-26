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
import { cn } from "~/lib/utils";
import { router } from "expo-router";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { ArrowLeft } from "lucide-react-native";
import { Loader } from "@/components/shared/Loader";
import { useLiveGeolocation } from "@/hooks/useLiveGeolocation";
import { toast } from "sonner-native";
import {
  defineJobValidationSchemas,
  detailedJobValidationSchemas,
  imagesJobValidationSchemas,
} from "@/types/validations/job.validation";
import { useUploadMutation } from "@/hooks/content/useUploadMutation";
import { Upload } from "@/types/upload";

interface JobCreateFormProps {
  className?: string;
}

export const JobCreateForm = ({ className }: JobCreateFormProps) => {
  const {
    latitude,
    longitude,
    locationName,
    isPending: isLocationPending,
  } = useLiveGeolocation();
  const jobStore = useJobStore();

  const { uploadFiles: uploadPicture, isUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[], variables: { files: File[] }) => {
      const uri = (variables.files[0] as any)?.uri as string | undefined;
      if (uri) {
        jobStore.setImageProgress(uri, 100);
      }
      jobStore.appendUploadId("create", { uploadId: response?.[0]?.id });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

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
    uploadPicture,
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
    // jobStore.setNested("createDto.currencyId", "TND");
    jobStore.setNested("createDto.latitude", latitude);
    jobStore.setNested("createDto.longitude", longitude);
    jobStore.set("locationName", locationName);

    return () => {
      jobStore.reset();
    };
  }, [latitude, longitude, locationName]);

  const handleSubmit = () => {
    const result = imagesJobValidationSchemas.safeParse(jobStore.createDto);
    if (!result.success) {
      jobStore.set("createDtoErrors", result.error.flatten().fieldErrors);
      return;
    }
    createJob(jobStore.createDto);
  };

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
        {isJobTagsPending || isJobCategoriesPending || isLocationPending ? (
          <Loader className="flex flex-1 justify-center items-center" />
        ) : (
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
                validation: () => {
                  const result = defineJobValidationSchemas.safeParse(
                    jobStore.createDto,
                  );
                  if (!result.success) {
                    jobStore.set(
                      "createDtoErrors",
                      result.error.flatten().fieldErrors,
                    );
                    return false;
                  }
                  return true;
                },
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
                validation: () => {
                  const result = detailedJobValidationSchemas.safeParse(
                    jobStore.createDto,
                  );
                  if (!result.success) {
                    jobStore.set(
                      "createDtoErrors",
                      result.error.flatten().fieldErrors,
                    );
                    return false;
                  }
                  return true;
                },
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
                validation: true,
              },
            ]}
            closingAction={{
              label: "Publish",
              onPress: () => {
                handleSubmit();
              },
              disabled: isUploadPending,
            }}
          />
        )}
      </View>
    </StableSafeAreaView>
  );
};
