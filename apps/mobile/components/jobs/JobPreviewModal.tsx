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
  Heart,
  MessageSquare,
  Share2,
  ImageOff,
  MapPin,
  Signal,
  X,
} from "lucide-react-native";
import { Text } from "../ui/text";
import { JobPricingType, ResponseJobDto } from "~/types";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useServerImages } from "@/hooks/content/useServerImages";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { timeAgo } from "~/lib/dates.utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../shared/stables/StableAvatar";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { useJobSaveActions } from "~/hooks/content/job/useJobSaveActions";
import { useIsJobSaved } from "~/hooks/content/job/useIsJobSaved";
import { useQueryClient } from "@tanstack/react-query";

interface JobPreviewModalProps {
  visible: boolean;
  job: ResponseJobDto | null;
  onClose: () => void;
}

const DEFAULT_CURRENCY = "TND";

export const JobPreviewModal = ({
  visible,
  job,
  onClose,
}: JobPreviewModalProps) => {
  const { palette } = useColorPalette();
  const queryClient = useQueryClient();

  const isSavedHook = useIsJobSaved(job?.id || "");
  const isJobSaved = isSavedHook.isJobSaved;

  const { saveJob, unsaveJob } = useJobSaveActions({
    onSuccess: () => {
      if (job?.id) {
        queryClient.invalidateQueries({ queryKey: ["is-job-saved", job.id] });
      }
    },
  });

  const orderedUploads = React.useMemo(
    () => job?.uploads?.slice().sort((a, b) => a.order - b.order),
    [job?.uploads],
  );

  const coverId = orderedUploads?.[0]?.uploadId;

  const {
    uploads: [upload],
  } = useServerImages({
    ids: [coverId],
    enabled: !!coverId,
  });

  const {
    uploads: [authorPicture],
  } = useServerImages({
    ids: [job?.postedBy?.pictureId],
    enabled: !!job?.postedBy?.pictureId,
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

  const handleToggleSave = () => {
    handleDismiss(() => {
      if (isJobSaved) {
        unsaveJob(job.id);
        toast.success("Job removed from saved items");
      } else {
        saveJob(job.id);
        toast.success("Job saved to your bookmarks");
      }
    });
  };

  const handleViewDetails = () => {
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

  const handleMessagePoster = () => {
    handleDismiss(() => {
      if (job.postedBy?.id) {
        router.push({
          pathname: "/main/(tabs)/chat",
          params: { userId: job.postedBy.id },
        });
      } else {
        toast.info(`Opening chat with ${identifyUser(job.postedBy)}`);
      }
    });
  };

  const handleShare = () => {
    handleDismiss(() => {
      toast.success("Job link copied to clipboard");
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
            {/* Header: Author + Timestamp + Close button */}
            <View className="flex-row items-start justify-between mb-3 pb-2 border-b border-border/60">
              <View className="flex-row items-start gap-2.5 flex-1">
                <Avatar
                  alt={identifyUser(job.postedBy)}
                  style={{ width: 34, height: 34 }}
                >
                  <AvatarImage source={authorPicture as ImageSource} />
                  <AvatarFallback>
                    <Text style={{ fontSize: 12 }} className="font-semibold">
                      {identifyUserAvatar(job.postedBy)}
                    </Text>
                  </AvatarFallback>
                </Avatar>

                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-semibold text-foreground"
                  >
                    {identifyUser(job.postedBy)}
                  </Text>
                  <Text className="text-[11px] text-muted-foreground">
                    Posted {timeAgo(job.createdAt || new Date())}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDismiss()}
                className="p-1 rounded-full bg-muted/80"
                hitSlop={8}
              >
                <X size={16} color={palette.foreground} />
              </TouchableOpacity>
            </View>

            {/* Cover Image */}
            <View className="w-full h-40 rounded-xl overflow-hidden bg-muted mb-3 justify-center items-center">
              {coverId && upload ? (
                <Image
                  source={upload as ImageSource}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              ) : (
                <View className="items-center justify-center gap-1">
                  <ImageOff
                    size={24}
                    color={palette.mutedForeground}
                    opacity={0.5}
                  />
                  <Text className="text-xs text-muted-foreground">
                    No Preview Image
                  </Text>
                </View>
              )}
            </View>

            {/* Job Details */}
            <View className="flex-col gap-1.5">
              <Text className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {job.category?.label ?? "Uncategorised"}
              </Text>

              <Text
                numberOfLines={2}
                className="text-lg font-bold text-foreground leading-6"
              >
                {job.title}
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
                      <Text
                        style={{ fontSize: 10 }}
                        className="font-medium text-muted-foreground"
                      >
                        {job.style}
                      </Text>
                    </View>
                  )}
                  {job.difficulty && (
                    <View className="flex-row items-center gap-1 rounded-full bg-muted px-2 py-1">
                      <Signal size={10} color={palette.mutedForeground} />
                      <Text
                        style={{ fontSize: 10 }}
                        className="font-medium text-muted-foreground"
                      >
                        {job.difficulty}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Floating Action Sheet Below Card */}
          <View className="w-full bg-card border border-border rounded-2xl mt-3 overflow-hidden shadow-2xl">
            <TouchableOpacity
              onPress={handleViewDetails}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                View Job Details
              </Text>
              <Eye size={18} color={palette.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleToggleSave}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                {isJobSaved ? "Remove from Saved" : "Save Job"}
              </Text>
              <Heart
                size={18}
                color={isJobSaved ? palette.primary : palette.foreground}
                fill={isJobSaved ? palette.primary : "none"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleMessagePoster}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                Message Poster
              </Text>
              <MessageSquare size={18} color={palette.foreground} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="flex-row items-center justify-between px-4 py-3.5 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                Share Job
              </Text>
              <Share2 size={18} color={palette.foreground} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
