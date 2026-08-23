import React from "react";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
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
import { useServerImage } from "~/hooks/content/useServerImage";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useIsJobSaved } from "~/hooks/content/job/useIsJobSaved";
import { useJobSaveActions } from "~/hooks/content/job/useJobSaveActions";
import { useIsJobViewed } from "~/hooks/content/job/useIsJobViewed";
import { useJobViewActions } from "~/hooks/content/job/useJobViewActions";
import { JobDetailsTopBar } from "./JobDetailsTopBar";
import { JobHero } from "./JobHero";
import { JobClientInformation } from "./JobClientInformation";
import { JobDetailsBody } from "./JobDetailsBody";
import StableScrollView from "@/components/shared/stables/StableScrollView";
import { type ActionSheetRef } from "react-native-actions-sheet";
import { ApplyJobActionSheet } from "./ApplyJobActionSheet";
import { CancelApplicationActionSheet } from "./CancelApplicationActionSheet";
import { toast } from "sonner-native";

interface JobDetailsProps {
  className?: string;
  id: string;
}

export const JobDetails = ({ className, id }: JobDetailsProps) => {
  const insets = useSafeAreaInsets();
  const { currentUser } = useCurrentUser();

  const queryClient = useQueryClient();

  const applySheetRef = React.useRef<ActionSheetRef>(null);
  const cancelSheetRef = React.useRef<ActionSheetRef>(null);

  // load data & metadata *******************************************************************************************************
  const {
    data: jobResp,
    isPending: isJobPending,
    isError: isJobError,
    refetch: refetchJob,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () =>
      // category/tags/postedBy are eager; currency is not, and the price needs it.
      api.job.findById(
        id as string,
        ["uploads", "postedBy", "currency"].join(","),
      ),
    enabled: !!id,
  });

  const job = React.useMemo(() => jobResp ?? null, [jobResp]);

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
    className: "rounded-full",
    fallback: identifyUserAvatar(job?.postedBy),
    size: { width: 40, height: 40 },
  });

  // Fetch each image individually
  const imageQueries = useQueries({
    queries: Array.isArray(job?.uploads)
      ? job.uploads?.map((upload) => ({
          queryKey: ["upload", upload.uploadId],
          queryFn: () => api.upload.getUploadById(Number(upload.uploadId)),
          enabled: !!upload.uploadId,
        }))
      : [],
  });

  const areImageComplete = imageQueries.every((query) => !query.isPending);

  // job request *******************************************************************************************************

  const {
    data: isJobRequested,
    isPending: isJobRequestedPending,
    refetch: refetchJobRequested,
  } = useQuery({
    queryKey: ["job-request", id],
    queryFn: () => api.jobRequest.findRequested(id as string),
    enabled: !!id,
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

  // job save  *******************************************************************************************************

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
    if (id) viewJob(id as string);
  }, [id]);

  const handleSave = () => {
    if (isSavePending || isUnsavePending) return;
    if (isJobSaved) unsaveJob(id as string);
    else saveJob(id as string);
  };

  // Echo the title in the bar only once the hero title has scrolled past.
  const [isTitleScrolledAway, setIsTitleScrolledAway] = React.useState(false);

  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrolledAway = e.nativeEvent.contentOffset.y > 120;
      // Only re-render on the crossing, not on every scroll frame.
      setIsTitleScrolledAway((current) =>
        current === scrolledAway ? current : scrolledAway,
      );
    },
    [],
  );

  const isPending = isJobPending || isJobRequestedPending || !areImageComplete;

  if (isPending)
    return (
      <JobDetailsSkeleton
        uploads={job?.uploads?.map((upload) => String(upload.uploadId)) ?? []}
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
    <View className="flex-1 bg-background">
      <JobDetailsTopBar
        title={job?.title}
        showTitle={isTitleScrolledAway}
        handleSave={handleSave}
        isJobSaved={!!isJobSaved}
      />

      <StableScrollView
        className={cn("flex-1")}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        scrollEventThrottle={32}
        onScroll={handleScroll}
      >
        <JobHero
          job={job}
          metadata={jobMetadata}
          uploads={job?.uploads?.map((upload) => String(upload.uploadId)) ?? []}
          imageQueries={imageQueries}
        />

        <JobDetailsBody job={job} />

        <JobClientInformation
          job={job}
          metadata={jobMetadata}
          profilePicture={profilePicture}
        />
      </StableScrollView>

      {/* Apply Button */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="px-6 pt-5 bg-card border-t border-border"
      >
        {job?.postedBy.id !== currentUser?.id ? (
          <View className="flex-row items-center gap-2">
            {isJobRequested ? (
              <Button
                className="flex-1 rounded-xl"
                variant="outline"
                onPress={() =>
                  router.navigate({
                    pathname: "/main/my-space/requests",
                    params: { variant: "outgoing" },
                  })
                }
              >
                <Text ellipsizeMode="tail" numberOfLines={1}>
                  View request
                </Text>
              </Button>
            ) : null}

            <Button
              className={cn("rounded-xl", isJobRequested ? "flex-1" : "w-full")}
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
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="font-semibold"
              >
                {isJobRequested ? "Cancel application" : "Apply for this job"}
              </Text>
            </Button>
          </View>
        ) : (
          <Button
            className="w-full rounded-xl"
            onPress={() => {
              router.push({
                pathname: "/main/my-space/manage-job",
                params: { id },
              });
            }}
          >
            <Text className="font-semibold">Manage this job</Text>
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
          <View className="mt-3">
            <Text className="text-center text-xs text-muted-foreground">
              You'll be able to chat with{" "}
              <Text className="text-xs font-semibold text-foreground">
                {identifyUser(job?.postedBy)}
              </Text>{" "}
              before starting work
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};
