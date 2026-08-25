import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OutgoingRequestEntrySkeletonProps {
  className?: string;
}

export const OutgoingRequestSkeleton: React.FC<OutgoingRequestEntrySkeletonProps> = ({
  className,
}) => {
  return (
    <View
      className={cn(
        "w-full p-2 py-2 flex flex-col",
        className,
      )}
    >
      <View className="flex flex-row items-center gap-5 w-full">
        <View className="relative shrink-0 w-[76px] h-[76px]">
          {/* Big Circle: Job Picture */}
          <Skeleton className="w-[76px] h-[76px] rounded-[38px]" />

          {/* Bottom Right Cluster: Client Avatar & Status Indicator side-by-side with overlap */}
          <View style={{ position: 'absolute', bottom: -8, right: -8, zIndex: 10, flexDirection: 'row' }}>
            {/* Circle 1: User Picture */}
            <Skeleton className="w-[36px] h-[36px] rounded-full border-2 border-background" style={{ zIndex: 10 }} />
            
            {/* Circle 2: Status Indicator */}
            <Skeleton className="w-[36px] h-[36px] rounded-full border-2 border-background" style={{ marginLeft: -12, zIndex: 20 }} />
          </View>
        </View>

        {/* Right Section: Request Info (Lines of text) */}
        <View className="flex-1 justify-center gap-2">
          {/* User Name Line */}
          <Skeleton className="h-4 w-3/4 rounded-md" />
          
          {/* Job Title Line */}
          <Skeleton className="h-3 w-1/2 rounded-md" />
          
          {/* Time Ago Line */}
          <View className="flex flex-row items-center gap-2 mt-1">
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </View>
        </View>

        {/* Right Arrow Chevron (Centered Vertically) */}
        <Skeleton className="w-4 h-4 rounded-md" />
      </View>
    </View>
  );
};
