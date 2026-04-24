import React from "react";
import { View } from "react-native";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { Separator } from "~/components/ui/separator";
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
    <StableSafeAreaView className={cn("flex-1", className)}>
      {/* Header */}
      <View className="h-40 bg-card px-6 py-5 border-b border-border"></View>

      {/* Client Info */}
      <View className="px-6 py-4 border-t border-border">
        <Skeleton className="h-5 w-40 mb-3" />
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <View>
              <Skeleton className="h-4 w-32 mb-3" />
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

      <View className="flex-1 px-6 pb-5 mt-4">
        <Separator className="my-2" />
        {/*  About project + Project scope */}
        <View className="flex flex-col justify-between mt-6">
          {/* About project */}
          <View>
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Separator className="my-4" />
          </View>
          {/* Project scope */}
          <View className="flex flex-col justify-between mb-4">
            <Skeleton className="h-5 w-28 mb-3" />
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-4 w-16" />
          </View>
        </View>

        <Separator className="my-4" />
        {/* tags */}
        <View className="flex flex-col justify-between mb-4">
          <Skeleton className="h-5 w-20 mb-3" />
          <View className="flex flex-row flex-wrap gap-2">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </View>
        </View>
        <Separator className="my-4" />

        {/* Images */}
        {safeUploads.length > 0 ? (
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
      </View>

      {/* Apply button */}
      <View className="flex flex-row gap-2 px-6 py-5 bg-card border-t border-border">
        <Skeleton className="h-8 w-1/2 rounded-lg mb-2" />
        <Skeleton className="h-8 rounded-lg mb-2" />
      </View>
    </StableSafeAreaView>
  );
};
