import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import {
  Heart,
  FileText,
  CheckCircle,
  MapPin,
  Clock,
  Star,
  Calendar,
  Wallet,
  CopyX,
  CopyPlus,
} from "lucide-react-native";
import { showToastable } from "react-native-toastable";
import type { NavigationProps } from "~/types/app.routes";
import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "~/api";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { format } from "date-fns";
import { timeAgo } from "~/lib/dates.utils";
import { Image } from "expo-image";
import { StableKeyboardAwareScrollView } from "../../shared/StableKeyboardAwareScrollView";
import { Loader } from "../../shared/Loader";
import { Separator } from "../../ui/separator";
import { Badge } from "../../ui/badge";
import { StablePressable } from "~/components/shared/StablePressable";
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
import Icon from "~/lib/Icon";
import { useServerImage } from "~/hooks/content/useServerImage";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useIsJobSaved } from "~/hooks/content/job/useIsJobSaved";
import { useJobSaveActions } from "~/hooks/content/job/useJobSaveActions";
import { useIsJobViewed } from "~/hooks/content/job/useIsJobViewed";
import { useJobViewActions } from "~/hooks/content/job/useJobViewActions";

export const JobDetails = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProps>();
  const { currentUser } = useCurrentUser();
  const { id, uploads } = useLocalSearchParams();
  const [applicationDialogOpen, setApplicationDialogOpen] =
    React.useState(false);

  const { isJobSaved, isSavedPending } = useIsJobSaved(id as string);
  const { isJobViewed, isViewedPending } = useIsJobViewed(id as string);

  const { saveJob, isSavePending, unsaveJob, isUnsavePending } =
    useJobSaveActions({
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: ["is-job-saved", id as string],
        });
        showToastable({
          message: response,
        });
      },
    });

  const { viewJob, isViewPending } = useJobViewActions({
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["is-job-viewed", id as string],
      });
      showToastable({
        message: response,
      });
    },
  });

  React.useEffect(() => {
    if (!isJobViewed) viewJob(id as string);
  }, []);

  const { data: jobResp, isPending: isJobPending } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.job.findById(id as string),
  });

  const job = React.useMemo(() => jobResp ?? null, [jobResp]);

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
    [jobMetadataResp]
  );

  const { jsx: profilePicture } = useServerImage({
    id: job?.postedBy?.profile?.pictureId,
    fallback: identifyUserAvatar(job?.postedBy),
    size: { width: 40, height: 40 },
  });

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
      setApplicationDialogOpen(false);
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
        setApplicationDialogOpen(false);
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
          staleTime: Infinity,
        }))
      : [],
  });

  const handleApply = () => {
    if (!isJobRequested) {
      sendRequest();
    } else {
      cancelRequest();
    }
  };

  const handleSave = (e: any) => {
    e.stopPropagation();
    if (isSavePending || isUnsavePending) return;
    if (isJobSaved) unsaveJob(id as string);
    else saveJob(id as string);
  };

  if (!id) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-xl text-foreground">Job not found</Text>
        <Button onPress={() => navigation.goBack()} className="mt-4">
          Go Back
        </Button>
      </View>
    );
  }

  const isPending =
    isJobPending || isJobRequestedPending || isJobMetadataPending;

  if (isPending) return <JobDetailsSkeleton uploads={uploads as string[]} />;
  return (
    <StableSafeAreaView className="flex-1">
      {/* Header */}
      <View className="bg-card px-6 py-5 border-b border-border">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-bold text-foreground mb-1">
              {job?.title}
            </Text>
            <View className="flex flex-row gap-2">
              <View className="flex-row items-center gap-1">
                <Clock size={14} color="#9ca3af" />
                <Text className="text-xs text-muted-foreground">
                  {timeAgo(job?.createdAt || new Date())}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Wallet size={14} color="#9ca3af" />
                <Text className="text-xs text-muted-foreground">
                  {job?.price.toFixed(3)} TND
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSavePending || isUnsavePending}
          >
            {isSavePending || isUnsavePending ? (
              <Heart size={24} color={"#ef4444"} fill={"#ef4444"} />
            ) : (
              <Heart
                size={24}
                color={isJobSaved ? "#ef4444" : "#6b7280"}
                fill={isJobSaved ? "#ef4444" : "none"}
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <FileText size={14} color="#6366f1" />
            <Text className="text-xs text-card-foreground">
              {jobMetadata?.requestCount} proposals
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <CheckCircle size={14} color="#16a34a" />
            <Text className="text-xs text-card-foreground">
              Payment verified
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-xs text-card-foreground">
              4.8 client rating
            </Text>
          </View>
        </View>
      </View>

      <StableKeyboardAwareScrollView className={cn("flex-1 px-6 pb-5")}>
        {/* Client Info */}
        <StablePressable
          className="mt-4"
          onPress={() =>
            navigation.navigate("explore/user-profile", {
              id: job?.postedBy.id,
            })
          }
          onPressClassname="bg-transparent"
        >
          <Text className="text-lg font-semibold text-foreground mb-3">
            Client information
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              {profilePicture}
              <View>
                <Text className="text-base font-medium text-card-foreground">
                  {identifyUser(job?.postedBy)}
                </Text>
                <View className="flex-row items-center gap-4 mt-1">
                  <View className="flex-row items-center gap-1">
                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                    <Text className="text-xs text-muted-foreground">
                      4.9 (127 reviews)
                    </Text>
                  </View>
                  {job?.postedBy.profile?.region && (
                    <View className="flex-row items-center gap-1">
                      <MapPin size={12} color="#6366f1" />
                      <Text className="text-xs text-muted-foreground">
                        {job.postedBy.profile.region.label}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-xs text-muted-foreground">
                Member since
              </Text>
              <Text className="text-xs text-card-foreground font-medium">
                {job?.postedBy.createdAt
                  ? format(job.postedBy.createdAt, "MMMM yyyy")
                  : ""}
              </Text>
              <Text className="text-xs text-muted-foreground">
                89% hire rate
              </Text>
            </View>
          </View>
        </StablePressable>
        <Separator className="my-4 opacity-0" />
        <View className="flex flex-col gap-4">
          {/* About Project */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-2">
              About this project
            </Text>
            <Text className="text-card-foreground leading-6 text-sm">
              {job?.description}
            </Text>
          </View>
          {/* Project Scope */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-2">
              Project scope
            </Text>
            <View className="flex flex-col gap-1">
              <View className="flex-row items-center gap-2">
                <Calendar size={12} color="#6366f1" />
                <Text className="text-xs text-muted-foreground">
                  3-6 months
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground">
                {job?.difficulty}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {job?.style}
              </Text>
            </View>
          </View>
        </View>
        <Separator className="my-4 opacity-0" />
        {/* details */}
        <View className="flex flex-row gap-4">
          {/* Skills */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-2">
              Tags
            </Text>
            <View className="flex-row flex-wrap gap-1 mt-2 w-full">
              {job?.tags && job?.tags?.length > 0 ? (
                job?.tags.map((tag) => (
                  <Badge variant={"secondary"} key={tag.id}>
                    <Text className="text-xs font-medium">{tag.label}</Text>
                  </Badge>
                ))
              ) : (
                <Text className="text-xs font-semibold mx-auto opacity-70">
                  No tags found
                </Text>
              )}
            </View>
          </View>
        </View>
        {/* Images Grid */}
        <View className={cn(uploads?.length > 0 ? "" : "hidden")}>
          <Separator className="my-4 opacity-0" />
          <Text className="text-lg font-semibold text-foreground">Images</Text>
          <View className="flex flex-wrap flex-row gap-x-[5%] mt-2">
            {imageQueries.map((query, index) => {
              const uploadId = uploads[index];

              if (query.isLoading) {
                return (
                  <View
                    key={uploadId}
                    style={{
                      width: "30%",
                      height: 300,
                      aspectRatio: 1,
                      borderRadius: 8,
                      marginBottom: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Loader isPending={true} size="small" />
                  </View>
                );
              }

              if (query.isError || !query.data) return null;

              return (
                <Image
                  key={uploadId}
                  source={query.data}
                  style={{
                    width: "30%",
                    height: 300,
                    aspectRatio: 1,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                  contentFit="cover"
                />
              );
            })}
          </View>
        </View>
      </StableKeyboardAwareScrollView>

      {/* Apply Button */}
      <View className="px-6 py-5 bg-card border-t border-border">
        <View
          className={cn(isJobRequested && "flex flex-row items-center gap-2")}
        >
          {isJobRequested && (
            <Button
              className="w-[49%] rounded-lg"
              size="sm"
              onPress={() =>
                navigation.navigate("my-space/requests", {
                  variant: "outgoing",
                })
              }
            >
              <Text ellipsizeMode="tail" numberOfLines={1}>
                View Requests
              </Text>
            </Button>
          )}
          <View className={cn(isJobRequested && "w-[49%]")}>
            <Dialog
              open={applicationDialogOpen}
              onOpenChange={(value) => setApplicationDialogOpen(value)}
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
                      <Icon
                        name={isJobRequested ? CopyX : CopyPlus}
                        size={24}
                      />
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
                          onPress={() => setApplicationDialogOpen(false)}
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
          <Text variant={"small"} className="text-muted-foreground text-center">
            You'll be able to chat with{" "}
            <Text variant={"small"} className="font-medium ">
              {identifyUser(job?.postedBy)}
            </Text>{" "}
            before starting work
          </Text>
        </View>
      </View>
    </StableSafeAreaView>
  );
};
