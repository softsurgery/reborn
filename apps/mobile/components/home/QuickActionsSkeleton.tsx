import React from "react";
import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

interface QuickActionsSkeletonProps {
  className?: string;
}

export const QuickActionsSkeleton = ({
  className,
}: QuickActionsSkeletonProps) => {
  return (
    <View className={cn("gap-4", className)}>
      <View className="flex-row items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-12" />
      </View>
      <View className="w-full">
        {[1, 2, 3, 4].map((i, index) => {
          const isLast = index === 3;
          return (
            <View key={i}>
              <View className="w-full py-3 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <View className="flex-1 justify-center">
                      <Skeleton className="h-4 w-32 mb-2 rounded-md" />
                      <Skeleton className="h-3 w-48 rounded-md" />
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-md" />
                  </View>
                </View>
              </View>
              {!isLast && <Separator />}
            </View>
          );
        })}
      </View>
    </View>
  );
};
