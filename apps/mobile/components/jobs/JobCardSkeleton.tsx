import React from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";
import { cn } from "~/lib/utils";
import { THUMBNAIL_SIZE } from "./JobCard";

interface JobCardSkeletonProps {
  className?: string;
}

/** Mirrors JobCard: thumbnail, eyebrow, title, description, pay, author row. */
export const JobCardSkeleton = ({ className }: JobCardSkeletonProps) => {
  return (
    <View className={cn("w-full rounded-lg p-3", className)}>
      <View className="flex-row gap-3">
        <Skeleton
          style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
          className="rounded-xl"
        />

        <View className="flex-1 gap-2">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-5 w-28" />
        </View>
      </View>

      <View className="mt-3 flex-row items-center gap-2 border-t border-border pt-2.5">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="ml-auto h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </View>
    </View>
  );
};
