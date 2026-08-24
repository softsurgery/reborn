import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OutgoingRequestEntrySkeletonProps {
  className?: string;
}

export const OutgoingRequestSkeleton = ({
  className,
}: OutgoingRequestEntrySkeletonProps) => {
  return (
    <View
      className={cn("w-full p-2 py-2 flex flex-col gap-3.5", className)}
    >
      {/* Main Section: Job Cover Thumbnail (84x84) with Floating Avatar + Info Column */}
      <View className="flex flex-row gap-3.5">
        {/* Left Thumbnail with Floating Client Avatar Skeleton */}
        <View className="relative shrink-0">
          <Skeleton className="w-[84px] h-[84px] rounded-2xl" />
          <Skeleton className="absolute -bottom-1.5 -right-1.5 w-[30px] h-[30px] rounded-full border-2 border-background" />
        </View>

        {/* Right Info Column */}
        <View className="flex-1 justify-between min-w-0 py-0.5">
          {/* Header row: Category + Status Dot + Chevron Right */}
          <View className="flex flex-row items-center justify-between gap-2">
            <View className="flex flex-row items-center gap-2 flex-1 min-w-0">
              <Skeleton className="h-3 w-20 rounded-md" />
              <View className="flex flex-row items-center gap-1 shrink-0">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="h-2.5 w-12 rounded-md" />
              </View>
            </View>
            <Skeleton className="w-4 h-4 rounded-sm shrink-0" />
          </View>

          {/* Job Title */}
          <Skeleton className="h-4 w-4/5 rounded-md mt-0.5" />

          {/* Action Button Skeleton */}
          <View className="flex flex-row justify-end mt-1">
            <Skeleton className="h-8 w-20 rounded-xl" />
          </View>
        </View>
      </View>
    </View>
  );
};
