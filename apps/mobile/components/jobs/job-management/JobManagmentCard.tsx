import React from "react";
import { ThreeDotsActionSheet } from "@/components/shared/ThreeDotsActionSheet";
import { Text } from "@/components/ui/text";
import { useServerImage } from "@/hooks/content/useServerImage";
import { cn } from "@/lib/utils";
import { JobEvents, JobStatus, ResponseJobDto, Paginated } from "@/types";
import { View, TouchableOpacity } from "react-native";
import {
  ExternalLink,
  FileText,
  Folder,
  PencilLine,
  Send,
  Telescope,
  Trash2,
  Clock,
  Wallet,
  Settings2,
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

interface JobManagementCardProps {
  className?: string;
  job: ResponseJobDto;
}

const getStatusStyle = (status: JobStatus | string) => {
  switch (status) {
    case JobStatus.POSTED:
      return {
        badge: "bg-green-500",
        text: "text-white font-bold",
      };
    case JobStatus.DRAFT:
      return {
        badge: "bg-yellow-500",
        text: "text-white font-bold",
      };
    case JobStatus.FINISHED:
    case JobStatus.SUCCESSFUL:
      return {
        badge: "bg-blue-500/15 border border-blue-500/30",
        text: "text-blue-600 dark:text-blue-400 font-medium",
      };
    case JobStatus.FAILED:
      return {
        badge: "bg-red-500 border border-red-500/30",
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
    () => job.uploads?.sort((a, b) => a.order - b.order),
    [job.uploads],
  );

  const { jsx: cover } = useServerImage({
    id: orderedUploads?.[0]?.uploadId,
    fallback: "No Image",
    className: "rounded-xl",
    wrapperClassName: "border border-border bg-muted overflow-hidden",
    size: { width: 76, height: 76 },
  });

  const primaryActionLabel =
    job.status === JobStatus.POSTED ? "Unpublish" : "Publish";
  const statusStyle = getStatusStyle(job.status);

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
        "flex flex-col gap-3.5 bg-card border border-border rounded-2xl p-4 shadow-xs",
        className,
      )}
    >
      <View className="flex flex-row items-start justify-between gap-3.5">
        <View className="flex-shrink-0">{cover}</View>

        <View className="flex-1 flex-col gap-1.5 justify-between min-h-[76px]">
          <View className="flex flex-row items-center justify-between gap-2">
            <Badge
              className={cn("px-2.5 py-0.5 rounded-full", statusStyle.badge)}
            >
              <Text className={cn("text-xs", statusStyle.text)}>
                {job.status}
              </Text>
            </Badge>

            <View className="flex flex-row items-center gap-1">
              <Clock size={12} color="#9ca3af" />
              <Text className="text-xs text-muted-foreground">
                {timeAgo(job?.createdAt || new Date())}
              </Text>
            </View>
          </View>

          <View className="gap-0.5">
            <Text
              className="text-base font-semibold text-foreground line-clamp-1"
              numberOfLines={1}
            >
              {job.title || "Untitled Job"}
            </Text>

            <Text
              className="text-xs text-muted-foreground line-clamp-2"
              numberOfLines={2}
            >
              {job.description || "No description provided"}
            </Text>
          </View>

          <View className="flex flex-row items-center gap-1.5 mt-0.5">
            <Wallet size={13} color="#9ca3af" />
            <Text className="text-xs font-semibold text-primary">
              {job?.price ? `${job.price.toFixed(2)} TND` : "Price negotiable"}
            </Text>
          </View>
        </View>

        <View className="self-start -mr-1 -mt-1">
          <ThreeDotsActionSheet
            size={24}
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

      <View className="flex flex-row items-center gap-2 pt-4 border-t border-border">
        <Button
          size="sm"
          variant="default"
          className="flex-1 rounded-xl h-9 flex-row items-center justify-center gap-1.5"
          onPress={navigateToManage}
        >
          <Icon as={Settings2} size={15} color={palette.primaryForeground} />
          <Text className="text-xs font-semibold text-primary-foreground">
            Manage
          </Text>
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-xl h-9 flex-row items-center justify-center gap-1.5 border-border"
          onPress={() => {
            router.push({
              pathname: "/main/my-space/update-job",
              params: { id: job.id },
            });
          }}
        >
          <Icon as={PencilLine} size={15} className="text-foreground" />
          <Text className="text-xs font-medium text-foreground">Edit</Text>
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="rounded-xl h-9 px-3 flex-row items-center justify-center border-border"
          disabled={isNextJobWorkflowPending}
          onPress={() => {
            if (job.status === JobStatus.DRAFT) {
              nextJobWorkflow(JobEvents.POST);
            } else if (job.status === JobStatus.POSTED) {
              nextJobWorkflow(JobEvents.UNPUBLISH);
            } else {
              router.push({
                pathname: "/main/explore/job-details",
                params: { id: job.id },
              });
            }
          }}
        >
          <Icon
            as={job.status === JobStatus.DRAFT ? Send : Telescope}
            size={15}
            className="text-foreground"
          />
        </Button>
      </View>
    </TouchableOpacity>
  );
};
