import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRTL } from "~/hooks/useRTL";

interface BaseProfileSkeletonProps {
  className?: string;
}

export const BaseProfileSkeleton = ({
  className,
}: BaseProfileSkeletonProps) => {
  const isRTL = useRTL();

  return (
    <View className={cn("flex-1 bg-background", className)}>
      {/* Cover Skeleton */}
      <Skeleton className="h-56 w-full rounded-none bg-primary/25" />

      {/* Header Container */}
      <View
        className={cn(
          "flex-col px-4 z-10 -mt-12",
          isRTL ? "items-end" : "items-start",
        )}
      >
        {/* Avatar */}
        <View
          className={cn(
            "w-full justify-between",
            isRTL ? "flex-row-reverse" : "flex-row",
          )}
        >
          <View className="rounded-full border-4 border-background bg-background">
            <Skeleton className="h-[100px] w-[100px] rounded-full" />
          </View>
        </View>
      </View>
    </View>
  );
};
