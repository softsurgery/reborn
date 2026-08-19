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
  Folder,
  PencilLine,
  Send,
  Telescope,
  Trash2,
  ImageOff,
  MapPin,
  Signal,
} from "lucide-react-native";
import { router } from "expo-router";
import { Badge } from "@/components/ui/badge";
import { useNextWorkflowJob } from "@/hooks/content/job/workflow/useNextWorkflowJob";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { timeAgo } from "@/lib/dates.utils";
import { useColorPalette } from "@/hooks/useColorPalette";
import { toast } from "sonner-native";
import { useLoader } from "@/contexts/LoaderContext";
import { Skeleton } from "@/components/ui/skeleton";

interface JobManagementCardProps {
  className?: string;
  job: ResponseJobDto;
}

export const THUMBNAIL_SIZE = 76;

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
      activeOpacity={0.75}
      onPress={navigateToManage}
      className={cn(
        "w-full py-3.5 px-1 border-b border-border/40 flex-col gap-2.5",
        className,
      )}
    >
      {/* Header Row: Category Tag, Status Badge & Positioned Action Menu */}
      <View className="flex-row items-center justify-between">
        <Text
          numberOfLines={1}
          className="flex-1 text-[10px] font-bold uppercase tracking-widest text-primary pr-2"
        >
          {job.category?.label ?? "Uncategorised"}
        </Text>

        <View className="flex-row items-center gap-2">
          <Badge
            variant="secondary"
            className={cn("px-2.5 py-0.5 rounded-full border", statusStyle.badge)}
          >
            <Text className={cn("text-[10px] capitalize", statusStyle.text)}>
              {job.status}
            </Text>
          </Badge>

          <ThreeDotsActionSheet
            size={20}
            options={[
              {
                label: "Manage Job",
                icon: Folder,
                onPress: navigateToManage,
              },
              {
                label: "Edit Listing",
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
                label: "View Public Details",
                icon: Telescope,
                onPress: () => {
                  router.push({
                    pathname: "/main/explore/job-details",
                    params: { id: job.id },
                  });
                },
              },
              {
                label: "Share Job",
                icon: ExternalLink,
                onPress: () => {},
              },
              {
                label: "Delete Listing",
                icon: Trash2,
                variant: "destructive",
                onPress: () => {},
              },
            ]}
          />
        </View>
      </View>

      {/* Main Body: Thumbnail & Job Metadata */}
      <View className="flex-row gap-3.5 items-start">
        <View className="w-[76px] h-[76px] overflow-hidden rounded-xl bg-muted/60 shrink-0 border border-border/30">
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
            <View className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5">
              <Text className="text-[9px] font-semibold text-white">
                +{extraPhotos}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1 gap-1">
          <Text
            numberOfLines={2}
            className="text-base font-semibold leading-tight text-foreground tracking-tight"
          >
            {job.title || "Untitled Job"}
          </Text>

          {job.description ? (
            <Text
              numberOfLines={1}
              className="text-xs text-muted-foreground leading-4"
            >
              {job.description}
            </Text>
          ) : null}

          <View className="flex-row items-baseline gap-1 mt-0.5">
            <Text className="text-base font-bold text-foreground tracking-tight">
              {job.price ? job.price.toFixed(digits) : "0.00"}
            </Text>
            <Text className="text-xs font-semibold text-muted-foreground">
              {code}
              {isHourly ? " / hr" : ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer Info: Date Ago & Metadata Pills */}
      <View className="flex-row items-center justify-between pt-0.5">
        <Text className="text-[11px] font-medium text-muted-foreground">
          {timeAgo(job?.createdAt || new Date())}
        </Text>

        <View className="flex-row items-center gap-1.5">
          {job.style ? (
            <View className="flex-row items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5">
              <MapPin size={10} color={palette.mutedForeground} />
              <Text className="text-[10px] font-medium text-muted-foreground">
                {job.style}
              </Text>
            </View>
          ) : null}

          {job.difficulty ? (
            <View className="flex-row items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5">
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


