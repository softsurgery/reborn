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
        "flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm",
        className
      )}
    >
      {/* Header section */}
      <View className="flex flex-row items-start justify-between p-4 pb-2 border-b border-border/50">
        <View className="flex-1 pr-3">
          {/* Job title */}
          <Skeleton className="h-5 w-2/3 mb-2 rounded" />

          {/* Status badge */}
          <View className="flex flex-row items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16 rounded" />
          </View>
        </View>

        {/* Profile image */}
        <Skeleton className="w-16 h-16 rounded-full border-2 border-border" />
      </View>

      {/* Body section */}
      <View className="flex flex-col gap-3 p-4">
        {/* Client info */}
        <View className="flex flex-row items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <View className="flex-1">
            <Skeleton className="h-3 w-12 mb-1 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </View>
        </View>

        {/* Requested at */}
        <View className="flex flex-row items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <View className="flex-1">
            <Skeleton className="h-3 w-16 mb-1 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
          </View>
        </View>
      </View>

      {/* Action buttons (pending state placeholder) */}
      <View className="flex flex-row items-center justify-center gap-2 px-4 py-4">
        <Skeleton className="h-10 rounded-lg flex-1" />
        <Skeleton className="h-10 rounded-lg flex-1" />
      </View>
    </View>
  );
};
