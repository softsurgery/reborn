import React from "react";
import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface IncomingRequestEntrySkeletonProps {
  className?: string;
}

export const IncomingRequestSkeleton = ({
  className,
}: IncomingRequestEntrySkeletonProps) => {
  return (
    <View
      className={cn(
        "flex flex-row items-center justify-between p-4 m border border-border rounded-lg animate-pulse",
        className
      )}
    >
      {/* Left side: text blocks */}
      <View className="flex flex-1 w-full">
        {/* Job title */}
        <Skeleton className="h-5 w-2/3 rounded mb-2" />

        {/* Requested by */}
        <View className="flex flex-row items-center gap-1 mb-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </View>

        {/* Requested at */}
        <View className="flex flex-row items-center gap-1 mb-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </View>

        {/* Status */}
        <View className="flex flex-row items-center gap-1">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </View>

        {/* Action buttons placeholder */}
        <View className="flex flex-row gap-2 mt-4">
          <Skeleton className="h-8 w-40 rounded-lg" />
        </View>
      </View>

      {/* Right side: profile picture */}
      <View className="w-1/4 flex items-end">
        <Skeleton className="h-20 w-20 rounded-full" />
      </View>
    </View>
  );
};
