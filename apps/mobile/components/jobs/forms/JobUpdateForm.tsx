import React from "react";
import { View } from "react-native";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useCreateJobFormStructure } from "./useCreateJobFormStructure";
import { useJobStore } from "~/hooks/stores/useJobStore";
import { useCurrencies } from "~/hooks/content/useCurrencies";
import { mapToSelectOptions } from "~/components/shared/form-builder/utils/mapToSelectOptions";
import { useJobTags } from "@/hooks/content/reference-types/useJobTags";
import { useJobCategories } from "@/hooks/content/reference-types/useJobCategories";
import { Stepper } from "~/components/shared/Stepper";
import { api } from "~/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateJobDto, ServerErrorResponse, UpdateJobDto } from "~/types";
import { cn } from "~/lib/utils";
import { router } from "expo-router";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { ChevronLeft } from "lucide-react-native";
import { Loader } from "@/components/shared/Loader";
import { useLiveGeolocation } from "@/hooks/useLiveGeolocation";
import * as Location from "expo-location";
import { toast } from "sonner-native";
import {
  defineJobValidationSchemas,
  detailedJobValidationSchemas,
  imagesJobValidationSchemas,
} from "@/types/validations/job.validation";
import { useUploadMutation } from "@/hooks/content/useUploadMutation";
import { Upload } from "@/types/upload";
import { useJob } from "@/hooks/content/job/useJob";
import { useUpdateJobFormStructure } from "./useUpdateJobFormStructure";
import { useServerImages } from "@/hooks/content/useServerImages";
import { ImageFile } from "~/components/shared/form-builder/types";

interface JobUpdateFormProps {
  className?: string;
  id: string;
}

export const JobUpdateForm = ({ className, id }: JobUpdateFormProps) => {
  const queryClient = useQueryClient();
  const {
    latitude,
    longitude,
    locationName,
    isPending: isLocationPending,
  } = useLiveGeolocation();
  const jobStore = useJobStore();

  const { job, isJobPending, refetchJob } = useJob({
    id,
    join: ["uploads", "uploads.upload"],
  });

  const { uploads, isPending: isUploadsPending } = useServerImages({
    ids: job?.uploads?.map((upload) => upload.upload.id) || [],
    enabled: !!job?.uploads,
  });

  React.useEffect(() => {
    if (job && uploads && uploads.length > 0 && job.uploads.length > 0) {
      console.log(JSON.stringify(job, null, 2));
      const imageFiles: ImageFile[] = job.uploads
        .sort((a, b) => b.order - a.order)
        .map((jobUpload, index) => {
          const uri = uploads[index];
          return {
            id: jobUpload.id,
            serverId: jobUpload.upload.id,
            uri: uri as string,
            name: jobUpload.upload.slug,
            type: "image/jpeg",
            progress: 100,
            order: jobUpload.order,
          };
        });
      jobStore.set("images", imageFiles);
    }
  }, [job]);

  React.useEffect(() => {
    if (job) {
      jobStore.set("updateDto", {
        title: job.title,
        description: job.description,
        price: job.price,
        pricingType: job.pricingType,
        latitude: job.latitude,
        longitude: job.longitude,

        categoryId: job.categoryId,
        difficulty: job.difficulty,
        style: job.style,
        tagIds: job.tags?.map((tag) => tag.id) || [],
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

  const { currencies } = useCurrencies();
  const { jobTags, isJobTagsPending } = useJobTags();
  const { jobCategories, isJobCategoriesPending } = useJobCategories();

  const {
    jobCreateFormStructure,
    jobDetailsFormStructure,
    jobImagePickerStructure,
  } = useUpdateJobFormStructure({
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

  const { mutate: updateJob, isPending: isUpdatePending } = useMutation({
    mutationFn: (job: UpdateJobDto) => api.job.update(id, job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      jobStore.reset();
      toast.success("Job updated successfully");
      router.push("/main/(tabs)");
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(`Failed to update job: ${error.response?.data.message}`);
    },
  });

  React.useEffect(() => {
    if (
      latitude !== 0 &&
      longitude !== 0 &&
      (!jobStore.updateDto?.latitude || jobStore.updateDto.latitude === 0) &&
      (!jobStore.updateDto?.longitude || jobStore.updateDto.longitude === 0) &&
      (!job?.latitude || job.latitude === 0) &&
      (!job?.longitude || job.longitude === 0)
    ) {
      jobStore.setNested("updateDto.latitude", latitude);
      jobStore.setNested("updateDto.longitude", longitude);
      jobStore.set("locationName", locationName);
    }
  }, [latitude, longitude, locationName, job]);

  const handleSubmit = () => {
    const uploads = jobStore.images
      .filter((img) => img.serverId)
      .map((img, index) => ({
        id: img.id as number,
        uploadId: img.serverId as number,
        order: img.order || index,
      }));

    const data = {
      ...jobStore.updateDto,
      uploads,
    };
    const result = imagesJobValidationSchemas.safeParse(data);
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
        title={"Update Job"}
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
            closingActions={[
              {
                id: "update",
                label: "Update",
                variant: "default",
                onPress: () => {
                  handleSubmit();
                },
                disabled: isUploadPending,
              },
            ]}
            pending={isUpdatePending || isUploadPending}
          />
        )}
      </View>
    </StableSafeAreaView>
  );
};
