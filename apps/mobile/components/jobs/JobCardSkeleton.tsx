import React from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";
import { cn } from "~/lib/utils";
import { THUMBNAIL_SIZE } from "./JobCard";
import { useRTL } from "~/hooks/useRTL";

interface JobCardSkeletonProps {
  className?: string;
}

/** Mirrors JobCard: thumbnail, eyebrow, title, description, pay, author row. */
export const JobCardSkeleton = ({ className }: JobCardSkeletonProps) => {
  const isRTL = useRTL();

  return (
    <View className={cn("w-full rounded-lg p-3", className)}>
      <View className={cn("gap-3", isRTL ? "flex-row-reverse" : "flex-row")}>
        <Skeleton
          style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
          className="rounded-xl"
        />

        <View
          className={cn(
            "flex-1 gap-2",
            isRTL ? "items-end" : "items-start",
          )}
        >
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-5 w-28" />
        </View>
      </View>

      <View
        className={cn(
          "mt-3 items-center gap-2 border-t border-border pt-2.5",
          isRTL ? "flex-row-reverse" : "flex-row",
        )}
      >
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton
          className={cn("h-5 w-16 rounded-full", isRTL ? "mr-auto" : "ml-auto")}
        />
        <Skeleton className="h-5 w-16 rounded-full" />
      </View>
    </View>
  );
};
