import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Briefcase, ChevronRight } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { useServerImages } from "@/hooks/content/useServerImages";
import { ResponseJobDto } from "@/types";
import { cn } from "@/lib/utils";

interface RequestJobEntryProps {
  job?: ResponseJobDto;
  className?: string;
}

export const RequestJobEntry = ({ job, className }: RequestJobEntryProps) => {
  const orderedUploads = React.useMemo(
    () => job?.uploads?.slice().sort((a, b) => a.order - b.order),
    [job?.uploads],
  );
  const coverUploadId = orderedUploads?.[0]?.uploadId;

  const {
    jsxArray: [coverJsx],
  } = useServerImages({
    ids: [coverUploadId],
    enabled: !!coverUploadId,
    size: { width: 56, height: 56 },
    className: "rounded-xl w-full h-full",
  });

  const navigateToJobDetails = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (job?.id) {
      router.push({
        pathname: "/main/explore/job-details",
        params: {
          id: job.id,
          uploads: JSON.stringify((job.uploads ?? []).map((u) => u.uploadId)),
        },
      });
    }
  };

  return (
    <View className={cn(className)}>
      <Text className="text-base font-bold uppercase tracking-widest text-muted-foreground">
        Job Specifications
      </Text>

      <Pressable
        className="flex flex-row items-center justify-between pt-3 pb-6 active:opacity-50 gap-3"
        onPress={navigateToJobDetails}
      >
        <View className="flex flex-row items-center gap-3 flex-1">
          {coverUploadId ? (
            <View className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 items-center justify-center">
              {coverJsx}
            </View>
          ) : (
            <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center shrink-0">
              <Icon as={Briefcase} size={24} className="text-primary" />
            </View>
          )}

          <View className="flex-1 min-w-0 justify-center">
            <Text
              className="text-sm font-bold uppercase tracking-widest text-primary mb-0.5"
              numberOfLines={2}
            >
              {job?.category?.label ?? "Uncategorised"}
            </Text>

            <Text
              className="text-sm font-medium text-foreground shrink min-w-0"
              numberOfLines={2}
            >
              {job?.title || "Untitled Job"}
            </Text>
          </View>
        </View>
        <View className="w-8 h-8 items-center justify-center shrink-0">
          <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
        </View>
      </Pressable>
    </View>
  );
};
