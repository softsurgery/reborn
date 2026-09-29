import React from "react";
import { View } from "react-native";
import { FormBuilder } from "@reborn/mobile-form-builder";
import { useCreateJobFormStructure } from "./useCreateJobFormStructure";
import { useJobStore } from "~/hooks/stores/useJobStore";
import { useCurrencies } from "~/hooks/content/useCurrencies";
import { mapToSelectOptions } from "@reborn/mobile-form-builder";
import { useJobTags } from "@/hooks/content/reference-types/useJobTags";
import { useJobCategories } from "@/hooks/content/reference-types/useJobCategories";
import { Stepper } from "~/components/shared/Stepper";
import { api } from "~/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateJobDto, ServerErrorResponse } from "~/types";
import { cn } from "@reborn/lib";
import { router } from "expo-router";
import { StableSafeAreaView } from "@reborn/mobile-components";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { ChevronLeft } from "lucide-react-native";
import { Loader } from "@reborn/mobile-components";
import { useLiveGeolocation } from "@/hooks/useLiveGeolocation";
import { toast } from "sonner-native";
import {
  getDefineJobValidationSchemas,
  getDetailedJobValidationSchemas,
  getImagesJobValidationSchemas,
} from "@/types/validations/job.validation";
import { useUploadMutation } from "@/hooks/content/useUploadMutation";
import { Upload } from "@/types/upload";
import { JobCreatedSuccess } from "./JobCreatedSuccess";
import { useBalance } from "@/hooks/content/finance/useBalance";
import { BudgetWarning } from "./BudgetWarning";
import { AppHeaderBack } from "@reborn/mobile-components";
import { useTranslation } from "react-i18next";

interface JobCreateFormProps {
  className?: string;
}

export const JobCreateForm = ({ className }: JobCreateFormProps) => {
  const { t } = useTranslation("jobs");
  const queryClient = useQueryClient();
  const [createdJobId, setCreatedJobId] = React.useState<string | null>(null);
  const {
    latitude,
    longitude,
    locationName,
    isPending: isLocationPending,
  } = useLiveGeolocation();
  const jobStore = useJobStore();

  const { data: balanceData, isPending: isBalancePending } = useBalance();

  const { uploadFiles: uploadPicture, isUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[], variables) => {
      const uri = (variables.files[0] as any)?.uri as string | undefined;
      if (uri) {
        jobStore.setServerImage(uri, response[0].id, 100);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { currencies, isCurrenciesPending } = useCurrencies();
  const { jobTags, isJobTagsPending } = useJobTags();
  const { jobCategories, isJobCategoriesPending } = useJobCategories();

  const {
    jobCreateFormStructure,
    jobDetailsFormStructure,
    jobImagePickerStructure,
  } = useCreateJobFormStructure({
    jobStore,
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
    mutationFn: (job: CreateJobDto) => api.job.save(job),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      jobStore.reset();
      setCreatedJobId(data.id);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        t("form.errors.createFailed", {
          message: error.response?.data.message,
        }),
      );
    },
  });

  React.useEffect(() => {
    jobStore.setNested("createDto.latitude", latitude);
    jobStore.setNested("createDto.longitude", longitude);
    jobStore.set("locationName", locationName);
  }, [latitude, longitude, locationName]);

  React.useEffect(() => {
    if (!currencies) return;
    const tnd = currencies?.find((c) => c.label === "TND");
    jobStore.setNested("createDto.currencyId", tnd?.id);
  }, [currencies]);

  const handleSubmit = (status: "Draft" | "Posted") => {
    const uploads = jobStore.images
      .filter((img) => img.serverId)
      .map((img) => ({
        uploadId: img.serverId as number,
      }));

    const data = {
      ...jobStore.createDto,
      status,
      uploads,
    };
    const result = getImagesJobValidationSchemas(t).safeParse(data);
    if (!result.success) {
      jobStore.set("createDtoErrors", result.error.flatten().fieldErrors);
      return;
    }

    createJob(data);
  };

  React.useEffect(() => {
    return () => {
      jobStore.reset();
    };
  }, []);

  if (createdJobId) {
    return (
      <StableSafeAreaView className="flex-1 bg-card">
        <ApplicationHeader
          classNames={{ wrapper: "border-b border-border pb-2" }}
          title={t("form.successTitle")}
          reverse
          titleVariant="large"
          shortcuts={[
            {
              key: "back",
              icon: ChevronLeft,
              onPress: () => {
                router.replace("/main/(tabs)");
              },
            },
          ]}
        />
        <View className={cn("flex-1 px-2 bg-background", className)}>
          <JobCreatedSuccess jobId={createdJobId} />
        </View>
      </StableSafeAreaView>
    );
  }

  return (
    <StableSafeAreaView className="flex-1 bg-card">
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={t("form.createTitle")}
        reverse
        titleVariant="large"
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />
      <View className={cn("flex-1 px-2 bg-background", className)}>
        {isJobTagsPending ||
        isJobCategoriesPending ||
        isLocationPending ||
        isCurrenciesPending ? (
          <Loader className="flex flex-1 justify-center items-center" />
        ) : (
          <Stepper
            classNames={{
              controlsWrapper: "pb-8",
            }}
            steps={[
              {
                title: t("form.steps.define.title"),
                description: t("form.steps.define.description"),
                component: <FormBuilder structure={jobCreateFormStructure} />,
                validation: () => {
                  const result = getDefineJobValidationSchemas(t).safeParse(
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
                title: t("form.steps.details.title"),
                description: t("form.steps.details.description"),
                component: <FormBuilder structure={jobDetailsFormStructure} />,
                validation: () => {
                  const result = getDetailedJobValidationSchemas(t).safeParse(
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
                title: t("form.steps.images.title"),
                description: t("form.steps.images.description"),
                component: (
                  <View className="flex-1">
                    <FormBuilder structure={jobImagePickerStructure} />
                    <BudgetWarning
                      requiredAmount={jobStore.createDto.price}
                      currentBalance={balanceData?.balance}
                      isPending={isBalancePending}
                    />
                  </View>
                ),
                validation: true,
              },
            ]}
            closingActions={[
              {
                id: "save-draft",
                label: t("form.saveDraft"),
                variant: "outline",
                onPress: () => {
                  handleSubmit("Draft");
                },
                disabled: isUploadPending,
              },
              {
                id: "publish",
                label: t("form.publish"),
                className: "bg-green-600",
                onPress: () => {
                  handleSubmit("Posted");
                },
                disabled:
                  isUploadPending ||
                  (jobStore.createDto.price
                    ? (balanceData?.balance ?? 0) < jobStore.createDto.price
                    : false),
              },
            ]}
            pending={isCreationPending || isUploadPending}
          />
        )}
      </View>
    </StableSafeAreaView>
  );
};
