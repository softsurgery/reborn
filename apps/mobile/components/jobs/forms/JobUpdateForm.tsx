import React from "react";
import { View } from "react-native";
import { FormBuilder } from "@reborn/mobile-form-builder";
import { useJobStore } from "~/hooks/stores/useJobStore";
// import { useCurrencies } from "~/hooks/content/useCurrencies";
import { mapToSelectOptions } from "@reborn/mobile-form-builder";
import { useJobTags } from "@/hooks/content/reference-types/useJobTags";
import { useJobCategories } from "@/hooks/content/reference-types/useJobCategories";
import { Stepper } from "~/components/shared/Stepper";
import { api } from "~/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerErrorResponse, UpdateJobDto } from "~/types";
import { cn } from "@reborn/lib";
import { router } from "expo-router";
import { StableSafeAreaView } from "@reborn/mobile-components";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { ChevronLeft } from "lucide-react-native";
import { Loader } from "@reborn/mobile-components";
import { useLiveGeolocation } from "@/hooks/useLiveGeolocation";
import * as Location from "expo-location";
import { toast } from "sonner-native";
import {
  getDefineJobValidationSchemas,
  getDetailedJobValidationSchemas,
  getImagesJobValidationSchemas,
} from "@/types/validations/job.validation";
import { useUploadMutation } from "@/hooks/content/useUploadMutation";
import { UpdateGenericUploadDto, Upload } from "@/types/upload";
import { useJob } from "@/hooks/content/job/useJob";
import { useUpdateJobFormStructure } from "./useUpdateJobFormStructure";
import { useServerImages } from "@/hooks/content/useServerImages";
import { extractImageFiles } from "@/lib/uploads";
import { useBalance } from "@/hooks/content/finance/useBalance";
import { BudgetWarning } from "./BudgetWarning";
import { useTranslation } from "react-i18next";

interface JobUpdateFormProps {
  className?: string;
  id: string;
}

export const JobUpdateForm = ({ className, id }: JobUpdateFormProps) => {
  const { t } = useTranslation("jobs");
  const queryClient = useQueryClient();
  const {
    latitude,
    longitude,
    locationName,
    isPending: isLocationPending,
  } = useLiveGeolocation();
  const jobStore = useJobStore();
  
  const { data: balanceData, isPending: isBalancePending } = useBalance();

  const { job, isJobPending } = useJob({
    id,
    join: ["uploads", "uploads.upload"],
  });

  const uploadIds = React.useMemo(
    () =>
      [...(job?.uploads ?? [])]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((upload) => upload.uploadId),
    [job?.uploads],
  );

  const { uploads, isPending: isImagesPending } = useServerImages({
    ids: uploadIds,
    enabled: uploadIds.length > 0,
  });

  const extractedImages = React.useMemo(
    () => extractImageFiles(job?.uploads || [], uploads),
    [job?.uploads, uploads],
  );

  const hydratedJobId = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!job?.id || isImagesPending) return;
    if (hydratedJobId.current === job.id) return;
    jobStore.set("images", extractedImages);
    hydratedJobId.current = job.id;
  }, [job?.id, extractedImages, isImagesPending]);

  React.useEffect(() => {
    if (job) {
      jobStore.set("updateDto", {
        title: job.title,
        description: job.description,
        price: job.price,
        pricingType: job.pricingType,
        negotiablePrice: job.negotiablePrice,
        latitude: job.latitude,
        longitude: job.longitude,
        currencyId: job.currencyId,
        categoryId: job.categoryId,
        difficulty: job.difficulty,
        style: job.style,
        tagIds:
          (job.tags?.map((tag) => tag?.id).filter(Boolean) as number[]) || [],
      });
      if (
        job.latitude != null &&
        job.longitude != null &&
        (job.latitude !== 0 || job.longitude !== 0)
      ) {
        Location.reverseGeocodeAsync({
          latitude: job.latitude,
          longitude: job.longitude,
        })
          .then((results) => {
            if (results && results.length > 0) {
              const place = results[0];
              const parts = [place.street, place.city, place.region, place.country]
                .filter(Boolean)
                .filter((part, index, self) => self.indexOf(part) === index);
              if (parts.length > 0) {
                jobStore.set("locationName", parts.join(", "));
                return;
              }
            }
            jobStore.set(
              "locationName",
              `${job.latitude.toFixed(4)}, ${job.longitude.toFixed(4)}`,
            );
          })
          .catch(() => {
            jobStore.set(
              "locationName",
              `${job.latitude?.toFixed?.(4) || job.latitude}, ${job.longitude?.toFixed?.(4) || job.longitude}`,
            );
          });
      }
    }
  }, [job]);

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

  // const { currencies, isCurrenciesPending } = useCurrencies();
  const { jobTags, isJobTagsPending } = useJobTags();
  const { jobCategories, isJobCategoriesPending } = useJobCategories();

  const {
    jobCreateFormStructure,
    jobDetailsFormStructure,
    jobImagePickerStructure,
  } = useUpdateJobFormStructure({
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

  const { mutate: updateJob, isPending: isUpdatePending } = useMutation({
    mutationFn: (job: UpdateJobDto) => api.job.update(id, job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      jobStore.reset();
      toast.success(t("form.errors.updateSuccess"));
      router.push("/main/(tabs)");
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        t("form.errors.updateFailed", {
          message: error.response?.data.message,
        }),
      );
    },
  });

  React.useEffect(() => {
    jobStore.setNested("updateDto.latitude", latitude);
    jobStore.setNested("updateDto.longitude", longitude);
    jobStore.set("locationName", locationName);
  }, [latitude, longitude, locationName]);

  const handleSubmit = () => {
    const uploads = jobStore.images
      .filter((img) => img.serverId)
      .map((img, index) => {
        let payload: UpdateGenericUploadDto = {
          uploadId: img.serverId as number,
          order: index,
        };
        if (typeof img.id === "number") {
          payload.id = img.id;
        }
        return payload;
      });

    const data = {
      ...jobStore.updateDto,
      uploads,
    };
    const result = getImagesJobValidationSchemas(t).safeParse(data);
    if (!result.success) {
      jobStore.set("updateDtoErrors", result.error.flatten().fieldErrors);
      return;
    }

    updateJob(data);
  };

  React.useEffect(() => {
    return () => {
      jobStore.reset();
    };
  }, []);

  return (
    <StableSafeAreaView className="flex-1 bg-card">
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={t("form.updateTitle")}
        reverse
        titleVariant="large"
        shortcuts={[
          {
            key: "back",
            icon: ChevronLeft,
            onPress: () => {
              router.back();
            },
          },
        ]}
      />
      <View className={cn("flex-1 px-2 bg-background", className)}>
        {isJobTagsPending ||
        isJobCategoriesPending ||
        // isCurrenciesPending ||
        isLocationPending ||
        isJobPending ? (
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
                    jobStore.updateDto,
                  );
                  if (!result.success) {
                    jobStore.set(
                      "updateDtoErrors",
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
                    jobStore.updateDto,
                  );
                  if (!result.success) {
                    jobStore.set(
                      "updateDtoErrors",
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
                      requiredAmount={jobStore.updateDto?.price}
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
                id: "update",
                label: t("form.update"),
                variant: "default",
                onPress: () => {
                  handleSubmit();
                },
                disabled:
                  isUploadPending ||
                  (jobStore.updateDto?.price
                    ? (balanceData?.balance ?? 0) < jobStore.updateDto.price
                    : false),
              },
            ]}
            pending={isUpdatePending || isUploadPending}
          />
        )}
      </View>
    </StableSafeAreaView>
  );
};
