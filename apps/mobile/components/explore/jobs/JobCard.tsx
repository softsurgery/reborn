import React from "react";
import { cn } from "~/lib/utils";
import { View, TouchableOpacity } from "react-native";
import { Heart, Clock, Wallet } from "lucide-react-native";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { showToastable } from "react-native-toastable";
import { ResponseJobDto } from "~/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "~/api";
import { Image } from "expo-image";
import { Skeleton } from "../../ui/skeleton";
import { timeAgo } from "~/lib/dates.utils";
import { Text } from "../../ui/text";

interface JobCardProps {
  className?: string;
  job: ResponseJobDto;
}

export const JobCard = ({ className, job }: JobCardProps) => {
  const [saved, setSaved] = React.useState(false);
  const [showFullDesc, setShowFullDesc] = React.useState(false);
  const navigation = useNavigation<NavigationProps>();

  const orderedUploads = React.useMemo(
    () => job.uploads?.sort((a, b) => a.order - b.order),
    [job.uploads]
  );

  const queryClient = useQueryClient();
  const { data: thumbnail, isPending: isThumbnailPending } = useQuery({
    queryKey: ["job-thumbnail", orderedUploads?.[0]?.uploadId],
    queryFn: () => api.upload.getUploadById(orderedUploads?.[0]?.uploadId),
    enabled: !!orderedUploads?.[0]?.uploadId,
  });

  const imageSource =
    thumbnail && !isThumbnailPending
      ? { uri: thumbnail }
      : require("~/assets/images/icon.png");

  React.useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: ["job-thumbnail", job.id],
      });
    };
  }, []);

  const handleSave = (e: any) => {
    e.stopPropagation();
    setSaved(!saved);
    if (!saved) {
      showToastable({ message: "Job has been saved", status: "success" });
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("explore/job-details", {
          id: job.id,
          uploads: job.uploads.map((u) => u.uploadId) || [],
        });
      }}
      className={cn(
        "px-4 w-full py-4 gap-2 border-2 border-border rounded-lg",
        className
      )}
      activeOpacity={0.7}
    >
      {!imageSource ? (
        <Skeleton className="w-full h-[200px]" />
      ) : (
        <Image
          recyclingKey={job.id.toString()}
          source={imageSource}
          style={{
            width: "100%",
            height: 200,
            marginVertical: 2,
            borderRadius: 8,
          }}
          placeholder={require("~/assets/images/icon.png")}
          contentFit="cover"
          transition={300}
        />
      )}

      <View className="flex-col justify-between items-start">
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

      <View className="flex-row flex-wrap gap-2 mt-1">
        <Text className="text-sm">No tags specified</Text>
      </View>

      <View className="flex flex-row justify-between">
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

        <TouchableOpacity onPress={handleSave}>
          <Heart
            size={24}
            color={saved ? "#ef4444" : "#6b7280"}
            fill={saved ? "#ef4444" : "none"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
