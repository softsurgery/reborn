import React from "react";
import { ThreeDotsActionSheet } from "@/components/shared/ThreeDotsActionSheet";
import { Text } from "@/components/ui/text";
import { useServerImage } from "@/hooks/content/useServerImage";
import { cn } from "@/lib/utils";
import {
  JobEvents,
  JobPricingType,
  JobStatus,
  ResponseJobDto,
  Paginated,
} from "@/types";
import { View, TouchableOpacity, Image } from "react-native";
import {
  ExternalLink,
  FileText,
  Folder,
  PencilLine,
  Send,
  Telescope,
  Trash2,
  Settings2,
  ImageOff,
  MapPin,
  Signal,
} from "lucide-react-native";
import { router } from "expo-router";
import { Badge } from "@/components/ui/badge";
import { useNextWorkflowJob } from "@/hooks/content/job/workflow/useNextWorkflowJob";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { timeAgo } from "@/lib/dates.utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useColorPalette } from "@/hooks/useColorPalette";
import { toast } from "sonner-native";
import { useLoader } from "@/contexts/LoaderContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";

interface JobManagementCardProps {
  className?: string;
  job: ResponseJobDto;
}

export const THUMBNAIL_SIZE = 84;

const DEFAULT_CURRENCY = "TND";

interface CurrencyExtras {
  code?: string;
  symbol?: string;
  digitsAfterComma?: number;
}

const readCurrency = (job: ResponseJobDto) => {
  const extras = (job.currency?.extras ?? {}) as CurrencyExtras;
  return {
    code: extras.code || job.currency?.label || DEFAULT_CURRENCY,
    digits: extras.digitsAfterComma ?? 2,
  };
};

const getStatusStyle = (status: JobStatus | string) => {
  switch (status) {
    case JobStatus.POSTED:
      return {
        badge: "bg-green-500/15 border border-green-500/30",
        text: "text-green-600 dark:text-green-400 font-medium",
      };
    case JobStatus.DRAFT:
      return {
        badge: "bg-yellow-500/15 border border-yellow-500/30",
        text: "text-yellow-600 dark:text-yellow-400 font-medium",
      };
    case JobStatus.FINISHED:
    case JobStatus.SUCCESSFUL:
      return {
        badge: "bg-blue-500/15 border border-blue-500/30",
        text: "text-blue-600 dark:text-blue-400 font-medium",
      };
    case JobStatus.FAILED:
      return {
        badge: "bg-red-500/15 border border-red-500/30",
        text: "text-red-600 dark:text-red-400 font-medium",
      };
    default:
      return {
        badge: "bg-primary/15 border border-primary/30",
        text: "text-primary font-medium",
      };
  }
};

export const JobManagementCard = ({
  className,
  job,
}: JobManagementCardProps) => {
  const { palette } = useColorPalette();
  const queryClient = useQueryClient();
  const { setLoading } = useLoader();

  const orderedUploads = React.useMemo(
    () => job.uploads?.slice().sort((a, b) => a.order - b.order),
    [job.uploads],
  );

  const coverId = orderedUploads?.[0]?.uploadId;
  const extraPhotos = Math.max((orderedUploads?.length ?? 0) - 1, 0);

  const { upload: coverUpload, isUploadPending } = useServerImage({
    id: coverId,
    enabled: !!coverId,
  });

  const { upload: authorPicture } = useServerImage({
    id: job.postedBy?.pictureId,
    enabled: !!job.postedBy?.pictureId,
  });

  const primaryActionLabel =
    job.status === JobStatus.POSTED ? "Unpublish" : "Publish";
  const statusStyle = getStatusStyle(job.status);
  const { code, digits } = readCurrency(job);
  const isHourly = job.pricingType === JobPricingType.HOURLY;

  const { nextJobWorkflow, isNextJobWorkflowPending } = useNextWorkflowJob({
    id: job.id,
    onSuccess: (data) => {
      if (data.job.status === JobStatus.POSTED) {
        toast.success("Job published successfully");
      } else if (data.job.status === JobStatus.DRAFT) {
        toast.success("Job unpublished successfully");
      }

      queryClient.setQueriesData<InfiniteData<Paginated<ResponseJobDto>>>(
        { queryKey: ["jobs"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((j) =>
                j.id === job.id
                  ? {
                      ...j,
                      ...data.job,
                      uploads:
                        data.job.uploads?.length > 0
                          ? data.job.uploads
                          : j.uploads,
                    }
                  : j,
              ),
            })),
          };
        },
      );
    },
    onError: (error) => {
      console.error("Error updating job:", error);
      toast.error("Failed to update job status");
    },
  });

  React.useEffect(() => {
    setLoading(isNextJobWorkflowPending);
  }, [isNextJobWorkflowPending, setLoading]);

  const navigateToManage = () => {
    router.push({
      pathname: "/main/my-space/manage-job",
      params: { id: job.id },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        router.push({
          pathname: "/main/explore/job-details",
          params: {
            id: job.id,
            uploads: JSON.stringify((job.uploads ?? []).map((u) => u.uploadId)),
          },
        });
      }}
      className={cn("w-full rounded-lg p-3", className)}
    >
      <View className="flex-row gap-3">
        <View className="w-[84px] h-[84px] overflow-hidden rounded-xl bg-muted">
          {coverId && isUploadPending ? (
            <Skeleton className="h-full w-full" />
          ) : coverId && coverUpload ? (
            <Image
              source={{ uri: coverUpload }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <ImageOff
                size={18}
                color={palette.mutedForeground}
                opacity={0.4}
              />
            </View>
          )}

          {extraPhotos > 0 && (
            <View className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1.5 py-0.5">
              <Text className="text-[10px] font-semibold text-white">
                +{extraPhotos}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row items-center">
            <Text
              numberOfLines={1}
              className="flex-1 text-[10px] font-bold uppercase tracking-widest text-primary"
            >
              {job.category?.label ?? "Uncategorised"}
            </Text>

            <Badge
              variant="secondary"
              className={cn("ml-2 px-2 py-0.5", statusStyle.badge)}
            >
              <Text className={cn("text-[10px]", statusStyle.text)}>
                {job.status}
              </Text>
            </Badge>

            <View className="ml-1">
              <ThreeDotsActionSheet
                size={30}
                options={[
                  {
                    label: "View Job",
                    icon: Telescope,
                    onPress: () => {
                      router.push({
                        pathname: "/main/explore/job-details",
                        params: { id: job.id },
                      });
                    },
                  },
                  {
                    label: "Manage Job",
                    icon: Folder,
                    onPress: navigateToManage,
                  },
                  {
                    label: "Edit Job",
                    icon: PencilLine,
                    onPress: () => {
                      router.push({
                        pathname: "/main/my-space/update-job",
                        params: { id: job.id },
                      });
                    },
                  },
                  {
                    label: primaryActionLabel,
                    icon: Send,
                    onPress: () => {
                      if (job.status === JobStatus.DRAFT) {
                        nextJobWorkflow(JobEvents.POST);
                      } else if (job.status === JobStatus.POSTED) {
                        nextJobWorkflow(JobEvents.UNPUBLISH);
                      }
                    },
                  },
                  {
                    label: "View Requests",
                    icon: FileText,
                    onPress: () => {},
                  },
                  {
                    label: "Share Job",
                    icon: ExternalLink,
                    onPress: () => {},
                  },
                  {
                    label: "Delete",
                    icon: Trash2,
                    variant: "destructive",
                    onPress: () => {},
                  },
                ]}
              />
            </View>
          </View>

          <Text
            numberOfLines={2}
            className="mt-0.5 text-base font-semibold leading-5 tracking-tight"
          >
            {job.title || "Untitled Job"}
          </Text>

          {job.description ? (
            <Text
              numberOfLines={1}
              className="mt-0.5 text-xs leading-4 text-muted-foreground"
            >
              {job.description}
            </Text>
          ) : null}

          <View className="mt-1.5 flex-row items-baseline gap-1">
            <Text className="text-lg font-bold leading-6 tracking-tight">
              {job.price ? job.price.toFixed(digits) : "0.00"}
            </Text>
            <Text className="text-xs font-semibold text-muted-foreground">
              {code}
              {isHourly ? " / hr" : ""}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-3 pt-2.5 flex-row items-center gap-1.5 border-t border-border">
        {job.postedBy ? (
          <>
            <Avatar alt={identifyUser(job.postedBy)} className="w-5 h-5">
              <AvatarImage source={{ uri: authorPicture ?? "" }} />
              <AvatarFallback>
                <Text className="text-[9px] font-semibold">
                  {identifyUserAvatar(job.postedBy)}
                </Text>
              </AvatarFallback>
            </Avatar>
            <Text numberOfLines={1} className="flex-shrink text-xs font-medium">
              {identifyUser(job.postedBy)}
            </Text>

            <Text className="text-xs text-muted-foreground">
              · {timeAgo(job?.createdAt || new Date())}
            </Text>
          </>
        ) : (
          <Text className="text-xs text-muted-foreground">
            {timeAgo(job?.createdAt || new Date())}
          </Text>
        )}

        <View className="ml-auto flex-row items-center gap-1.5">
          {job.style ? (
            <View className="flex-row items-center gap-1 rounded-full bg-muted px-2 py-1">
              <MapPin size={10} color={palette.mutedForeground} />
              <Text className="text-[10px] font-medium text-muted-foreground">
                {job.style}
              </Text>
            </View>
          ) : null}

          {job.difficulty ? (
            <View className="flex-row items-center gap-1 rounded-full bg-muted px-2 py-1">
              <Signal size={10} color={palette.mutedForeground} />
              <Text className="text-[10px] font-medium text-muted-foreground">
                {job.difficulty}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};
