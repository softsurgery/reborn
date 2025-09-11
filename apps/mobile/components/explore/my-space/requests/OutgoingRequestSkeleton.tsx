import React from "react";
import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface OutgoingRequestEntrySkeletonProps {
  className?: string;
}

export const OutgoingRequestSkeleton = ({
  className,
}: OutgoingRequestEntrySkeletonProps) => {
  return (
    <View
      className={cn(
        "flex flex-row items-center justify-between p-4 m border border-border rounded-lg animate-pulse",
        className
      )}
    >
      {/* Left side (text placeholders) */}
      <View className="flex flex-1 w-full">
        {/* Job Title */}
        <Skeleton className="h-5 w-2/3 bg-muted rounded mb-2" />

        {/* Client */}
        <View className="flex flex-row items-center gap-1 mb-2">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </View>

        {/* Requested At */}
        <View className="flex flex-row items-center gap-1 mb-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </View>

        {/* Status */}
        <View className="flex flex-row items-center gap-1 mb-2">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </View>

        {/* Actions */}
        <View className="flex flex-row gap-2 mt-4">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-36 rounded-lg" />
        </View>
      </View>

      {/* Right side (profile picture placeholder) */}
      <View className="w-1/4 flex items-end">
        <Skeleton className="h-20 w-20 rounded-full" />
      </View>
    </View>
  );
};
