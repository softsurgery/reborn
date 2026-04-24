import React from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "~/api";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { JobDetailsSkeleton } from "./JobDetailsSkeleton";
import { ServerErrorResponse } from "~/types";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { useServerImage } from "~/hooks/content/useServerImage";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useIsJobSaved } from "~/hooks/content/job/useIsJobSaved";
import { useJobSaveActions } from "~/hooks/content/job/useJobSaveActions";
import { useIsJobViewed } from "~/hooks/content/job/useIsJobViewed";
import { useJobViewActions } from "~/hooks/content/job/useJobViewActions";
import { JobCardHeader } from "./JobCardHeader";
import { JobClientInformation } from "./JobClientInformation";
import { JobDetailsBody } from "./JobDetailsBody";
import { StableScrollView } from "~/components/shared/StableScrollView";
import { useTranslation } from "react-i18next";
import { type ActionSheetRef } from "react-native-actions-sheet";
import { ApplyJobActionSheet } from "./ApplyJobActionSheet";
import { CancelApplicationActionSheet } from "./CancelApplicationActionSheet";
import { toast } from "sonner-native";

export const JobDetails = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  const { currentUser } = useCurrentUser();
  const { id, uploads: rawUploads } = useLocalSearchParams();

  const { data: jobResp, isPending: isJobPending } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.job.findById(id as string),
    enabled: !!id,
  });

  const job = React.useMemo(() => jobResp ?? null, [jobResp]);

  const uploads = React.useMemo(
    () =>
      (rawUploads && JSON.parse(rawUploads as string)) ||
      job?.uploads.map((upload) => upload.uploadId),
    [rawUploads, job?.uploads],
  );

  //application
  const applySheetRef = React.useRef<ActionSheetRef>(null);
  const cancelSheetRef = React.useRef<ActionSheetRef>(null);

  const {
    data: isJobRequested,
    isPending: isJobRequestedPending,
    refetch: refetchJobRequested,
  } = useQuery({
    queryKey: ["job-request", id],
    queryFn: () => api.jobRequest.findRequested(id as string),
    enabled: !!id,
  });

  //view & save
  const { isJobSaved, isSavedPending } = useIsJobSaved(id as string);
  const { isJobViewed, isViewedPending } = useIsJobViewed(id as string);

  const { saveJob, isSavePending, unsaveJob, isUnsavePending } =
    useJobSaveActions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["is-job-saved", id as string],
        });
      },
    });

  const { viewJob, isViewPending } = useJobViewActions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["is-job-viewed", id as string],
      });
    },
  });

  React.useEffect(() => {
    if (!isViewedPending && !isJobViewed && id) viewJob(id as string);
  }, [isViewedPending, isJobViewed, id]);

  const {
    data: jobMetadataResp,
    isPending: isJobMetadataPending,
    refetch: refetchJobMetadata,
  } = useQuery({
    queryKey: ["job-metadata", id],
    queryFn: () => api.job.findMetadataById(id as string),
  });

  const jobMetadata = React.useMemo(
    () => jobMetadataResp ?? null,
    [jobMetadataResp],
  );

  const { jsx: profilePicture } = useServerImage({
    id: job?.postedBy?.pictureId,
    fallback: identifyUserAvatar(job?.postedBy),
    size: { width: 40, height: 40 },
  });

  const { mutate: sendRequest, isPending: isSendRequestPending } = useMutation({
    mutationFn: () =>
      api.jobRequest.create({
        jobId: id as string,
      }),
    onSuccess: () => {
      refetchJobRequested();
      refetchJobMetadata();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data.message || "Failed to send request");
    },
  });

  const { mutate: cancelRequest, isPending: isCancelRequestPending } =
    useMutation({
      mutationFn: () => api.jobRequest.cancel(isJobRequested?.id as number),
      onSuccess: () => {
        refetchJobRequested();
        refetchJobMetadata();
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(error.response?.data.message || "Failed to cancel request");
      },
    });

  // Fetch each image individually
  const imageQueries = useQueries({
    queries: Array.isArray(uploads)
      ? uploads.map((uploadId) => ({
          queryKey: ["upload", uploadId],
          queryFn: () => api.upload.getUploadById(Number(uploadId)),
          enabled: !!uploadId,
        }))
      : [],
  });

  const handleSave = (e: any) => {
    e.stopPropagation();
    if (isSavePending || isUnsavePending) return;
    if (isJobSaved) unsaveJob(id as string);
    else saveJob(id as string);
  };

  const isPending =
    isJobPending || isJobRequestedPending || isJobMetadataPending;

  if (isPending)
    return (
      <JobDetailsSkeleton
        uploads={Array.isArray(uploads) ? (uploads as string[]) : []}
      />
    );

  if (!id) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-xl text-foreground">Job not found</Text>
        <Button onPress={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </View>
    );
  }
  return (
    <StableSafeAreaView className="flex-1 bg-card">
      <View className="flex-1">
        {/* Header */}
        <JobCardHeader
          job={job}
          metadata={jobMetadata}
          handleSave={handleSave}
          isJobSaved={!!isJobSaved}
          isSavePending={isSavePending || isUnsavePending}
          uploads={uploads as string[]}
          imageQueries={imageQueries}
        />

        <StableScrollView className={cn("flex-1 px-6")}>
          {/* Client Info */}
          <JobClientInformation
            className="mt-4"
            job={job}
            profilePicture={profilePicture}
          />
          <JobDetailsBody className="mb-4" job={job} />
        </StableScrollView>

        {/* Apply Button */}
        <View className="px-6 py-5 bg-card border-t border-border">
          <View
            className={cn(isJobRequested && "flex flex-row items-center gap-2")}
          >
            {isJobRequested ? (
              <Button
                className="w-[49%] rounded-lg"
                size="sm"
                onPress={() =>
                  router.navigate({
                    pathname: "/main/my-space/requests",
                    params: { variant: "outgoing" },
                  })
                }
              >
                <Text ellipsizeMode="tail" numberOfLines={1}>
                  View Requests
                </Text>
              </Button>
            ) : null}
            <View className={cn(isJobRequested && "w-[49%]")}>
              {job?.postedBy.id !== currentUser?.id ? (
                <Button
                  className="rounded-lg"
                  size="sm"
                  onPress={() => {
                    if (isJobRequested) {
                      cancelSheetRef.current?.show();
                    } else {
                      applySheetRef.current?.show();
                    }
                  }}
                  disabled={
                    isJobRequestedPending ||
                    isCancelRequestPending ||
                    isSendRequestPending
                  }
                  variant={isJobRequested ? "outline" : "default"}
                >
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {isJobRequested
                      ? "Cancel Application"
                      : "Apply for this job"}
                  </Text>
                </Button>
              ) : (
                <Button disabled={true} className="w-full py-3 rounded-lg">
                  <Text className="text-base font-semibold">
                    You cannot apply for your own job
                  </Text>
                </Button>
              )}
            </View>

            <ApplyJobActionSheet
              ref={applySheetRef}
              onConfirm={() => sendRequest()}
              isPending={isSendRequestPending}
            />

            <CancelApplicationActionSheet
              ref={cancelSheetRef}
              onConfirm={() => cancelRequest()}
              isPending={isCancelRequestPending}
            />
          </View>

          <View className="flex flex-row items-baseline gap-2 justify-center mt-2">
            <Text className="text-xs text-muted-foreground text-center">
              You'll be able to chat with{" "}
              <Text className="text-xs font-medium">
                {identifyUser(job?.postedBy)}
              </Text>{" "}
              before starting work
            </Text>
          </View>
        </View>
      </View>
    </StableSafeAreaView>
  );
};
