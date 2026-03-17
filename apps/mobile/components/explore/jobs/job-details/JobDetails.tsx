import React from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { CopyX, CopyPlus } from "lucide-react-native";
import { showToastable } from "react-native-toastable";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useServerImage } from "~/hooks/content/useServerImage";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useIsJobSaved } from "~/hooks/content/job/useIsJobSaved";
import { useJobSaveActions } from "~/hooks/content/job/useJobSaveActions";
import { useIsJobViewed } from "~/hooks/content/job/useIsJobViewed";
import { useJobViewActions } from "~/hooks/content/job/useJobViewActions";
import { Icon } from "~/components/ui/icon";
import { JobCardHeader } from "./JobCardHeader";
import { JobClientInformation } from "./JobClientInformation";
import { JobDetailsBody } from "./JobDetailsBody";
import { StableScrollView } from "~/components/shared/StableScrollView";

export const JobDetails = () => {
  const queryClient = useQueryClient();

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
  const [requestDialogOpen, setRequestDialogOpen] = React.useState(false);

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
    id: job?.postedBy?.profile?.pictureId,
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
      setRequestDialogOpen(false);
    },
    onError: (error: ServerErrorResponse) => {
      showToastable({
        message: error.response?.data.message,
        status: "danger",
      });
    },
  });

  const { mutate: cancelRequest, isPending: isCancelRequestPending } =
    useMutation({
      mutationFn: () => api.jobRequest.cancel(isJobRequested?.id as number),
      onSuccess: () => {
        refetchJobRequested();
        refetchJobMetadata();
        setRequestDialogOpen(false);
      },
      onError: (error: ServerErrorResponse) => {
        showToastable({
          message: error.response?.data.message,
          status: "danger",
        });
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

  const handleApply = () => {
    if (!isJobRequested) sendRequest();
    else cancelRequest();
  };

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
    <StableSafeAreaView className="flex-1">
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
            <Dialog
              open={requestDialogOpen}
              onOpenChange={(value) => setRequestDialogOpen(value)}
            >
              <DialogTrigger asChild>
                {job?.postedBy.id !== currentUser?.id ? (
                  <Button
                    className="rounded-lg"
                    size="sm"
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
              </DialogTrigger>
              <DialogContent className="w-[90vw]">
                <DialogHeader>
                  <DialogTitle>
                    <View className="flex flex-row items-center gap-2">
                      <Icon as={isJobRequested ? CopyX : CopyPlus} size={24} />
                      <Text variant={"large"}>
                        {isJobRequested
                          ? "Cancel Application"
                          : "Confirm Application"}
                      </Text>
                    </View>
                  </DialogTitle>
                  <DialogDescription>
                    <View>
                      <Text>
                        {isJobRequested
                          ? "Are you sure you want to cancel your application? The client will no longer see you as a candidate."
                          : "Are you sure you want to apply for this job? The client will be notified, and you'll be able to chat after the application is approved."}
                      </Text>
                      <View className="flex flex-row items-center gap-2 mt-4">
                        <Button
                          onPress={handleApply}
                          className="w-1/2"
                          size="sm"
                          disabled={
                            isJobRequestedPending ||
                            isCancelRequestPending ||
                            isSendRequestPending
                          }
                        >
                          <Text className="text-base font-semibold">
                            Confirm
                          </Text>
                        </Button>
                        <Button
                          className="w-1/2"
                          size="sm"
                          variant={"outline"}
                          onPress={() => setRequestDialogOpen(false)}
                        >
                          <Text>Cancel</Text>
                        </Button>
                      </View>
                    </View>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </View>
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
    </StableSafeAreaView>
  );
};
