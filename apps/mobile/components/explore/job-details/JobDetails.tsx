import React from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/api";
import { identifyUser } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { JobDetailsSkeleton } from "./JobDetailsSkeleton";
import { ServerErrorResponse } from "~/types";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useIsJobSaved } from "~/hooks/content/job/useIsJobSaved";
import { useJobSaveActions } from "~/hooks/content/job/useJobSaveActions";
import { useJobViewActions } from "~/hooks/content/job/useJobViewActions";
import { JobDetailsTopBar } from "./JobDetailsTopBar";
import { JobHero } from "./JobHero";
import { JobClientInformation } from "./JobClientInformation";
import { JobDetailsBody } from "./JobDetailsBody";
import { type ActionSheetRef } from "react-native-actions-sheet";

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
      api.job.findById(
        id as string,
        ["uploads", "postedBy", "currency", "category", "tags"].join(","),
      ),
    enabled: !!id,
  });

  const job = React.useMemo(() => jobResp ?? null, [jobResp]);

  const { data: jobMetadataResp, refetch: refetchJobMetadata } = useQuery({
    queryKey: ["job-metadata", id],
    queryFn: () => api.job.findMetadataById(id as string),
    enabled: !!id,
    retry: false,
  });

  const jobMetadata = React.useMemo(
    () => jobMetadataResp ?? null,
    [jobMetadataResp],
  );

  // job request *******************************************************************************************************

  const {
    data: isJobRequested,
    isPending: isJobRequestedPending,
    refetch: refetchJobRequested,
  } = useQuery({
    queryKey: ["job-request", id],
    queryFn: async () => {
      try {
        return await api.jobRequest.findRequested(id as string);
      } catch (err) {
        return null;
      }
    },
    enabled: !!id,
    retry: false,
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

  const { isJobSaved } = useIsJobSaved(id as string);

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
    if (id) viewJob(id as string);
  }, [id]);

  const handleSave = () => {
    if (isSavePending || isUnsavePending) return;
    if (isJobSaved) unsaveJob(id as string);
    else saveJob(id as string);
  };

  // Echo the title in the bar only once the hero title has scrolled past.
  const [isTitleScrolledAway, setIsTitleScrolledAway] = React.useState(false);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([
      refetchJob(),
      refetchJobMetadata(),
      refetchJobRequested(),
    ]).finally(() => {
      setRefreshing(false);
    });
  }, [refetchJob, refetchJobMetadata, refetchJobRequested]);

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

  if (isJobPending) {
    return (
      <JobDetailsSkeleton
        uploads={job?.uploads?.map((upload) => String(upload.uploadId)) ?? []}
      />
    );
  }

  if (!id || isJobError || !job) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-4">
        <Text className="text-xl font-semibold text-foreground">
          Job not found
        </Text>
        <Button onPress={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </View>
    );
  }

  const isOwner = job.postedBy?.id === currentUser?.id;

  return (
    <View className={cn("flex-1 bg-background", className)}>
      <JobDetailsTopBar
        title={job?.title}
        showTitle={isTitleScrolledAway}
        handleSave={handleSave}
        isJobSaved={!!isJobSaved}
      />

      <ScrollView
        className={cn("flex-1")}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        scrollEventThrottle={32}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <JobHero job={job} metadata={jobMetadata} />

        <JobDetailsBody job={job} />

        <JobClientInformation job={job} metadata={jobMetadata} />
      </ScrollView>

      {/* Apply Button */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="px-6 pt-5 bg-card border-t border-border"
      >
        {!isOwner ? (
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
                else
                  router.push({
                    pathname: "/main/explore/job-apply",
                    params: { id },
                  });
              }}
              disabled={isJobRequestedPending || isCancelRequestPending}
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

        <CancelApplicationActionSheet
          ref={cancelSheetRef}
          onConfirm={() => cancelRequest()}
          isPending={isCancelRequestPending}
        />

        {!isOwner ? (
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
