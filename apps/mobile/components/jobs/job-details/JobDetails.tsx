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
import { type ActionSheetRef } from "react-native-actions-sheet";
import { ApplyJobActionSheet } from "./ApplyJobActionSheet";
import { CancelApplicationActionSheet } from "./CancelApplicationActionSheet";
import { toast } from "sonner-native";

export const JobDetails = () => {
  const queryClient = useQueryClient();

  const { currentUser } = useCurrentUser();
  const { id, uploads: rawUploads } = useLocalSearchParams();

  const {
    data: jobResp,
    isPending: isJobPending,
    isError: isJobError,
    refetch: refetchJob,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.job.findById(id as string),
    enabled: !!id,
  });

  const job = React.useMemo(() => jobResp ?? null, [jobResp]);

  const uploads = React.useMemo<string[]>(() => {
    if (typeof rawUploads === "string") {
      try {
        const parsed = JSON.parse(rawUploads);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        // ignore bad param
      }
    }
    return job?.uploads?.map((upload) => String(upload.uploadId)) ?? [];
  }, [rawUploads, job?.uploads]);

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
  const { isJobSaved } = useIsJobSaved(id as string);
  const { isJobViewed, isViewedPending } = useIsJobViewed(id as string);

  const { saveJob, isSavePending, unsaveJob, isUnsavePending } =
    useJobSaveActions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["is-job-saved", id as string],
        });
      },
    });

  const { viewJob } = useJobViewActions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["is-job-viewed", id as string],
      });
    },
  });

  React.useEffect(() => {
    if (!isViewedPending && !isJobViewed && id) viewJob(id as string);
  }, [isViewedPending, isJobViewed, id]);

  const { data: jobMetadataResp, refetch: refetchJobMetadata } = useQuery({
    queryKey: ["job-metadata", id],
    queryFn: () => api.job.findMetadataById(id as string),
    enabled: !!id,
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

  const handleSave = () => {
    if (isSavePending || isUnsavePending) return;
    if (isJobSaved) unsaveJob(id as string);
    else saveJob(id as string);
  };

  const isPending = isJobPending || isJobRequestedPending;

  if (isJobError)
    return (
      <View className="flex-1 justify-center items-center bg-background px-6">
        <Text className="text-lg font-semibold text-foreground text-center">
          Couldn't load job details
        </Text>
        <Text className="text-sm text-muted-foreground text-center mt-2">
          Please check your connection and try again.
        </Text>
        <View className="flex-row gap-2 mt-5 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => router.back()}
          >
            <Text>Go Back</Text>
          </Button>
          <Button className="flex-1" onPress={() => refetchJob()}>
            <Text>Retry</Text>
          </Button>
        </View>
      </View>
    );

  if (isPending) return <JobDetailsSkeleton uploads={uploads} />;

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
    <StableSafeAreaView className="flex-1 bg-background">
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

        <StableScrollView className={cn("flex-1")}>
          {/* Client Info */}
          <JobClientInformation
            job={job}
            metadata={jobMetadata}
            profilePicture={profilePicture}
          />
          <JobDetailsBody job={job} />
        </StableScrollView>

        {/* Apply Button */}
        <View className="px-6 py-5 pb-8 bg-card border-t border-border">
          {job?.postedBy.id !== currentUser?.id ? (
            <View className="flex-row items-center gap-2">
              {isJobRequested ? (
                <Button
                  className="flex-1 rounded-lg"
                  size="sm"
                  variant="outline"
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

              <Button
                className={cn(
                  "rounded-lg",
                  isJobRequested ? "flex-1" : "w-full",
                )}
                size="sm"
                onPress={() => {
                  if (isJobRequested) cancelSheetRef.current?.show();
                  else applySheetRef.current?.show();
                }}
                disabled={
                  isJobRequestedPending ||
                  isCancelRequestPending ||
                  isSendRequestPending
                }
                variant={isJobRequested ? "destructive" : "default"}
              >
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {isJobRequested ? "Cancel Application" : "Apply for this job"}
                </Text>
              </Button>
            </View>
          ) : (
            <Button
              className="w-full rounded-lg"
              size="sm"
              onPress={() => {
                router.push({
                  pathname: "/main/my-space/manage-job",
                  params: { id },
                });
              }}
            >
              <Text className="text-base font-semibold">Manage This Job</Text>
            </Button>
          )}

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

          {job?.postedBy.id !== currentUser?.id ? (
            <View className="mt-2">
              <Text variant="muted" className="text-center">
                You'll be able to chat with{" "}
                <Text className="font-semibold text-foreground">
                  {identifyUser(job?.postedBy)}
                </Text>{" "}
                before starting work
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </StableSafeAreaView>
  );
};
