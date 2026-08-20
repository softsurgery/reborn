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
      className={cn(
        "w-full py-3 px-1 border-b border-border/40 flex flex-col gap-2",
        className
      )}
    >
      {/* Top Row: Thumbnail + Info */}
      <View className="flex flex-row gap-3">
        <Skeleton className="w-[72px] h-[72px] rounded-xl shrink-0" />
        <View className="flex-1 justify-between gap-1.5">
          <View className="flex flex-row items-center justify-between gap-2">
            <Skeleton className="h-3.5 w-20 rounded-md" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </View>
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </View>
      </View>

      {/* Bottom Footer Row */}
      <View className="flex flex-row items-center justify-between pt-1">
        <View className="flex flex-row items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-3.5 w-24 rounded-md" />
          <Skeleton className="h-3.5 w-16 rounded-md" />
        </View>

        <Skeleton className="h-7 w-20 rounded-lg" />
      </View>
    </View>
  );
};



