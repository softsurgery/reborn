import React from "react";
import { View, SafeAreaView } from "react-native";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface SkeletonBlockProps {
  className?: string;
  uploads: string[];
}

export const JobDetailsSkeleton = ({
  className,
  uploads,
}: SkeletonBlockProps) => {
  return (
    <SafeAreaView className={cn("flex-1", className)}>
      {/* Header */}
      <View className="bg-card px-6 py-5 border-b border-border">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 pr-4">
            <Skeleton className="h-6 w-2/3 mb-2" />
            <View className="flex flex-row gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </View>
          </View>
          <Skeleton className="w-6 h-6 rounded-full" />
        </View>

        <View className="flex-row items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </View>
      </View>

      <View className="flex-1 px-6 pb-5 mt-4">
        {/* Images */}
        {uploads && uploads.length > 0 ? (
          <React.Fragment>
            <Skeleton className="h-5 w-24 mb-3" />
            <View className="flex flex-wrap flex-row justify-start items-center gap-x-[5%] mb-5">
              <Skeleton className="w-[30%] aspect-square rounded-lg" />
              <Skeleton className="w-[30%] aspect-square rounded-lg" />
              <Skeleton className="w-[30%] aspect-square rounded-lg" />
            </View>
            <Separator className="my-4" />
          </React.Fragment>
        ) : null}

        {/* About project */}
        <Skeleton className="h-5 w-40 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
        <Separator className="my-4" />

        {/* Tags + Project scope */}
        <View className="flex flex-row justify-between mt-6">
          <View className="w-1/2 pr-2">
            <Skeleton className="h-5 w-20 mb-3" />
            <View className="flex flex-row flex-wrap gap-2">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </View>
          </View>
          <View className="w-1/2 pl-2">
            <Skeleton className="h-5 w-28 mb-3" />
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-4 w-16" />
          </View>
        </View>
      </View>

      {/* Client Info */}
      <View className="px-6 py-4 border-t border-border">
        <Skeleton className="h-5 w-40 mb-3" />
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <View>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </View>
          </View>
          <View className="items-end">
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-3 w-14" />
          </View>
        </View>
      </View>

      {/* Apply button */}
      <View className="px-6 py-5 bg-card border-t border-border">
        <Skeleton className="h-12 w-full rounded-lg mb-2" />
      </View>
    </SafeAreaView>
  );
};
