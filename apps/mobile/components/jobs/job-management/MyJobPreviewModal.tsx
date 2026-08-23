import React from "react";
import { Modal, Pressable, View, TouchableOpacity } from "react-native";
import { Image, ImageSource } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import {
  Eye,
  Folder,
  PencilLine,
  Send,
  Share2,
  Trash2,
  ImageOff,
  MapPin,
  Signal,
  X,
  Telescope,
} from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { JobEvents, JobPricingType, JobStatus, ResponseJobDto } from "@/types";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useServerImages } from "@/hooks/content/useServerImages";
import { timeAgo } from "@/lib/dates.utils";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { useNextWorkflowJob } from "@/hooks/content/job/workflow/useNextWorkflowJob";
import { useDeleteJob } from "@/hooks/content/job/useDeleteJob";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface MyJobPreviewModalProps {
  visible: boolean;
  job: ResponseJobDto | null;
  onClose: () => void;
}

const DEFAULT_CURRENCY = "TND";

const getStatusStyle = (status: JobStatus | string) => {
  switch (status) {
    case JobStatus.POSTED:
      return {
        badge: "bg-emerald-500/10 border-emerald-500/25",
        text: "text-emerald-600 dark:text-emerald-400 font-semibold",
      };
    case JobStatus.DRAFT:
      return {
        badge: "bg-amber-500/10 border-amber-500/25",
        text: "text-amber-600 dark:text-amber-400 font-semibold",
      };
    case JobStatus.FINISHED:
    case JobStatus.SUCCESSFUL:
      return {
        badge: "bg-blue-500/10 border-blue-500/25",
        text: "text-blue-600 dark:text-blue-400 font-semibold",
      };
    case JobStatus.CANDIDATE_PENDING:
    case JobStatus.NOT_STARTED:
    case JobStatus.PENDING:
    case JobStatus.REVIEWED_BY_WORKER:
    case JobStatus.REVIEWED_BY_WORKER_AND_CLIENT:
      return {
        badge: "bg-indigo-500/10 border-indigo-500/25",
        text: "text-indigo-600 dark:text-indigo-400 font-semibold",
      };
    case JobStatus.ON_HOLD:
      return {
        badge: "bg-orange-500/10 border-orange-500/25",
        text: "text-orange-600 dark:text-orange-400 font-semibold",
      };
    case JobStatus.FAILED:
    case JobStatus.DELETED:
      return {
        badge: "bg-red-500/10 border-red-500/25",
        text: "text-red-600 dark:text-red-400 font-semibold",
      };
    default:
      return {
        badge: "bg-primary/10 border-primary/25",
        text: "text-primary font-semibold",
      };
  }
};

export const MyJobPreviewModal = ({
  visible,
  job,
  onClose,
}: MyJobPreviewModalProps) => {
  const { palette } = useColorPalette();
  const queryClient = useQueryClient();

  const { deleteJob } = useDeleteJob();

  const { nextJobWorkflow } = useNextWorkflowJob({
    id: job?.id || "",
    onSuccess: (data) => {
      if (data.job.status === JobStatus.POSTED) {
        toast.success("Job published successfully");
      } else if (data.job.status === JobStatus.DRAFT) {
        toast.success("Job unpublished successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      toast.error("Failed to update job status");
    },
  });

  const orderedUploads = React.useMemo(
    () => job?.uploads?.slice().sort((a, b) => a.order - b.order),
    [job?.uploads],
  );

  const coverId = orderedUploads?.[0]?.uploadId;
  const extraPhotos = Math.max((orderedUploads?.length ?? 0) - 1, 0);

  const { uploads: [upload] } = useServerImages({
    ids: [coverId],
    enabled: !!coverId,
  });

  const progress = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [0.82, 1]),
        },
        {
          translateY: interpolate(progress.value, [0, 1], [35, 0]),
        },
      ],
      opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0.6, 1]),
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  React.useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      progress.value = 0;
      backdropOpacity.value = 0;
    }
  }, [visible]);

  if (!visible || !job) return null;

  const isHourly = job.pricingType === JobPricingType.HOURLY;
  const statusStyle = getStatusStyle(job.status);
  const isDraft = job.status === JobStatus.DRAFT;
  const isPosted = job.status === JobStatus.POSTED;

  const handleDismiss = (callback?: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    progress.value = withTiming(
      0,
      {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(onClose)();
          if (callback) {
            runOnJS(callback)();
          }
        }
      },
    );
    backdropOpacity.value = withTiming(0, { duration: 200 });
  };

  const handleManage = () => {
    handleDismiss(() => {
      router.push({
        pathname: "/main/my-space/manage-job",
        params: { id: job.id },
      });
    });
  };

  const handleEdit = () => {
    handleDismiss(() => {
      router.push({
        pathname: "/main/my-space/update-job",
        params: { id: job.id },
      });
    });
  };

  const handleToggleWorkflow = () => {
    handleDismiss(() => {
      if (isDraft) {
        nextJobWorkflow(JobEvents.POST);
      } else if (isPosted) {
        nextJobWorkflow(JobEvents.UNPUBLISH);
      }
    });
  };

  const handleViewPublicDetails = () => {
    handleDismiss(() => {
      router.push({
        pathname: "/main/explore/job-details",
        params: {
          id: job.id,
          uploads: JSON.stringify((job.uploads ?? []).map((u) => u.uploadId)),
        },
      });
    });
  };

  const handleShare = () => {
    handleDismiss(() => {
      toast.success("Job link copied to clipboard");
    });
  };

  const handleDelete = () => {
    handleDismiss(async () => {
      try {
        await deleteJob(job.id);
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={() => handleDismiss()}
      animationType="none"
      statusBarTranslucent
    >
      {/* Dark Backdrop Layer */}
      <Animated.View
        style={[animatedBackdropStyle]}
        className="flex-1 bg-black/75 justify-center items-center px-4 py-8"
      >
        <Pressable
          style={{ position: "absolute", inset: 0 }}
          onPress={() => handleDismiss()}
        />

        <Animated.View
          style={[animatedCardStyle]}
          className="w-full max-w-sm flex-col items-center z-10"
        >
          {/* Main Floating Preview Card */}
          <View className="w-full bg-card border border-border p-4 shadow-2xl overflow-hidden rounded-xl">
            {/* Header: Category + Status Badge + Close Button */}
            <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-border/60">
              <View className="flex-row items-center gap-2 flex-1">
                <Text
                  numberOfLines={1}
                  className="text-xs font-bold uppercase tracking-wider text-primary flex-1"
                >
                  {job.category?.label ?? "Uncategorised"}
                </Text>
                <Badge
                  variant="secondary"
                  className={cn(
                    "px-2.5 py-0.5 rounded-full border",
                    statusStyle.badge,
                  )}
                >
                  <Text className={cn("text-[10px] capitalize", statusStyle.text)}>
                    {job.status}
                  </Text>
                </Badge>
              </View>
              <TouchableOpacity
                onPress={() => handleDismiss()}
                className="p-1 rounded-full bg-muted/80 ml-2"
                hitSlop={8}
              >
                <X size={16} color={palette.foreground} />
              </TouchableOpacity>
            </View>

            {/* Cover Image */}
            <View className="w-full h-40 rounded-xl overflow-hidden bg-muted mb-3 justify-center items-center relative">
              {coverId && upload ? (
                <Image
                  source={upload as ImageSource}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              ) : (
                <View className="items-center justify-center gap-1">
                  <ImageOff size={24} color={palette.mutedForeground} opacity={0.5} />
                  <Text className="text-xs text-muted-foreground">No Preview Image</Text>
                </View>
              )}

              {extraPhotos > 0 && (
                <View className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5">
                  <Text className="text-[10px] font-semibold text-white">
                    +{extraPhotos} photos
                  </Text>
                </View>
              )}
            </View>

            {/* Job Details */}
            <View className="flex-col gap-1.5">
              <Text
                numberOfLines={2}
                className="text-lg font-bold text-foreground leading-6"
              >
                {job.title || "Untitled Job"}
              </Text>

              {job.description ? (
                <Text
                  numberOfLines={2}
                  className="text-xs text-muted-foreground leading-4 mt-0.5"
                >
                  {job.description}
                </Text>
              ) : null}

              {/* Price & Meta Badges */}
              <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-border/50">
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-xl font-extrabold text-foreground">
                    {job.price?.toFixed(2)}
                  </Text>
                  <Text className="text-xs font-semibold text-muted-foreground">
                    {DEFAULT_CURRENCY}
                    {isHourly ? " / hr" : ""}
                  </Text>
                </View>

                <View className="flex-row items-center gap-1.5">
                  {job.style && (
                    <View className="flex-row items-center gap-1 rounded-full bg-muted px-2 py-1">
                      <MapPin size={10} color={palette.mutedForeground} />
                      <Text style={{ fontSize: 10 }} className="font-medium text-muted-foreground">
                        {job.style}
                      </Text>
                    </View>
                  )}
                  {job.difficulty && (
                    <View className="flex-row items-center gap-1 rounded-full bg-muted px-2 py-1">
                      <Signal size={10} color={palette.mutedForeground} />
                      <Text style={{ fontSize: 10 }} className="font-medium text-muted-foreground">
                        {job.difficulty}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Text className="text-[10px] text-muted-foreground mt-1">
                Posted {timeAgo(job.createdAt || new Date())}
              </Text>
            </View>
          </View>

          {/* Floating Action Sheet Below Card */}
          <View className="w-full bg-card border border-border rounded-2xl mt-3 overflow-hidden shadow-2xl">
            <TouchableOpacity
              onPress={handleManage}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                Manage Job & Applicants
              </Text>
              <Folder size={18} color={palette.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEdit}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                Edit Listing
              </Text>
              <PencilLine size={18} color={palette.foreground} />
            </TouchableOpacity>

            {(isDraft || isPosted) && (
              <TouchableOpacity
                onPress={handleToggleWorkflow}
                className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
              >
                <Text className="text-sm font-semibold text-foreground">
                  {isDraft ? "Publish Listing" : "Unpublish Listing"}
                </Text>
                <Send size={18} color={palette.foreground} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleViewPublicDetails}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                View Public Details
              </Text>
              <Telescope size={18} color={palette.foreground} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                Share Job
              </Text>
              <Share2 size={18} color={palette.foreground} />
            </TouchableOpacity>

            {isDraft && (
              <TouchableOpacity
                onPress={handleDelete}
                className="flex-row items-center justify-between px-4 py-3.5 active:bg-destructive/10"
              >
                <Text className="text-sm font-semibold text-destructive">
                  Delete Listing
                </Text>
                <Trash2 size={18} color={palette.destructive} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
