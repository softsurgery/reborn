import React from "react";
import { cn } from "~/lib/utils";
import { View, TouchableOpacity } from "react-native";
import { Heart, Clock, Wallet, Pen, Settings2 } from "lucide-react-native";
import { router } from "expo-router";
import { ResponseJobDto } from "~/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "~/api";
import { Image } from "expo-image";
import { Skeleton } from "../ui/skeleton";
import { timeAgo } from "~/lib/dates.utils";
import { Text } from "../ui/text";
import { useJobSaveActions } from "~/hooks/content/job/useJobSaveActions";
import { useIsJobSaved } from "~/hooks/content/job/useIsJobSaved";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { Badge } from "../ui/badge";
import { useServerImage } from "@/hooks/content/useServerImage";

interface JobCardProps {
  className?: string;
  job: ResponseJobDto;
  isOwner?: boolean;
}

export const JobCard = ({ className, job, isOwner }: JobCardProps) => {
  const queryClient = useQueryClient();
  const [showFullDesc, setShowFullDesc] = React.useState(false);

  const { isJobSaved, isSavedPending } = useIsJobSaved(job.id);
  const { saveJob, isSavePending, unsaveJob, isUnsavePending } =
    useJobSaveActions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["is-job-saved", job.id] });
      },
    });

  const orderedUploads = React.useMemo(
    () => job.uploads?.sort((a, b) => a.order - b.order),
    [job.uploads],
  );

  const { jsx: thumbnail } = useServerImage({
    id: orderedUploads?.[0]?.uploadId,
    fallback: "IMAGE",
    wrapperClassName: "border border-border bg-muted rounded-lg",
    size: { width: 50, height: 50 },
    rounded: false,
    enabled: !!orderedUploads?.[0]?.uploadId,
  });

  React.useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: ["job-thumbnail", job.id],
      });
      queryClient.invalidateQueries({ queryKey: ["is-job-saved", job.id] });
    };
  }, []);

  const handleSave = (e: any) => {
    e.stopPropagation();
    if (isSavePending || isUnsavePending) return;
    if (isJobSaved) unsaveJob(job.id);
    else saveJob(job.id);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/main/explore/job-details",
          params: {
            id: job.id,
            uploads: JSON.stringify(job.uploads.map((u) => u.uploadId)),
          },
        });
      }}
      className={cn(
        "w-full pb-4 gap-2 border-2 border-border rounded-lg",
        className,
      )}
      activeOpacity={0.7}
    >
      {!thumbnail ? (
        <Skeleton className="w-full h-[200px]" />
      ) : (
        <View>
          {thumbnail}
          {isOwner && (
            <Badge className="absolute top-4 right-4">
              <Text className="text-base">{job.status}</Text>
            </Badge>
          )}
        </View>
      )}

      <View className="flex-col justify-between items-start px-4">
        <View className="flex-row justify-between items-start">
          <Text className="font-semibold text-xl flex-1">{job.title}</Text>
        </View>

        <View className="mt-1">
          <Text className="text-sm">
            {showFullDesc
              ? job.description
              : `${job.description.slice(0, 100)}... `}
            {job.description.length > 100 && (
              <Text
                className="text-green-500 underline"
                onPress={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? "Show less" : "Show more"}
              </Text>
            )}
          </Text>
        </View>
      </View>

      <View className="flex flex-row justify-between px-4">
        <View className="flex flex-row gap-2">
          <View className="flex-row items-center gap-1">
            <Clock size={14} color="#9ca3af" />
            <Text className="text-sm text-muted-foreground">
              {timeAgo(job?.createdAt || new Date())}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Wallet size={14} color="#9ca3af" />
            <Text className="text-sm text-muted-foreground">
              {job?.price.toFixed(3)} TND
            </Text>
          </View>
        </View>

        {!isOwner && (
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSavePending || isUnsavePending}
          >
            {isSavePending || isUnsavePending || isSavedPending ? (
              <Heart size={24} color={"#FAA0A0"} fill={"#FAA0A0"} />
            ) : (
              <Heart
                size={24}
                color={"#EE4B2B"}
                fill={isJobSaved ? "#EE4B2B" : "none"}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      {isOwner && (
        <View className="flex flex-col justify-between gap-2 px-4">
          <Text className="font-bold">Actions</Text>
          <View className="flex flex-row gap-4">
            <Button
              className="flex-1"
              size={"sm"}
              onPress={() => {
                router.push({
                  pathname: "/main/my-space/manage-job",
                  params: { id: job.id },
                });
              }}
            >
              <Icon as={Settings2} size={16} />
              <Text>Manage</Text>
            </Button>
            <Button className="flex-1" size={"sm"} variant={"outline"}>
              <Icon as={Pen} size={16} />
              <Text>Update</Text>
            </Button>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
