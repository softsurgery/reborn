import React from "react";
import { View } from "react-native";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface SkeletonBlockProps {
  className?: string;
  uploads?: string[];
}

export const JobDetailsSkeleton = ({
  className,
  uploads,
}: SkeletonBlockProps) => {
  const safeUploads = uploads ?? [];
  return (
    <StableSafeAreaView className={cn("flex-1 bg-background", className)}>
      {/* Header */}
      <View className="bg-card pb-5 border-b border-border">
        {safeUploads.length > 0 ? (
          <Skeleton className="h-48 w-full mt-4" />
        ) : null}

        <View className="flex-row items-start px-4 justify-between mt-4">
          <View className="flex-1 pr-3">
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-3 w-44" />
          </View>
          <Skeleton className="w-10 h-10 rounded-full" />
        </View>

        <View className="flex-row flex-wrap gap-2 mt-4 px-4">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {/* Client card */}
        <View className="bg-card border p-4">
          <Skeleton className="h-5 w-40 mb-3" />
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1 pr-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <View className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-40" />
              </View>
            </View>
            <View className="items-end">
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </View>
          </View>
        </View>

        {/* About */}
        <View className="mt-4 bg-card border p-4">
          <Skeleton className="h-5 w-44 mb-3" />
          <Skeleton className="h-10 w-full mb-2" />
        </View>

        {/* Details */}
        <View className="mt-4 bg-card border p-4">
          <Skeleton className="h-5 w-28 mb-3" />
          <Skeleton className="h-10 w-full rounded-lg mb-2" />
          <Skeleton className="h-10 w-full rounded-lg mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </View>
      </View>

      {/* Action bar */}
      <View className="flex-row gap-2 px-6 py-5 bg-card border-t border-border">
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </View>
    </StableSafeAreaView>
  );
};
