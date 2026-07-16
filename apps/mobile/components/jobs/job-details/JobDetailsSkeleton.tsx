import React from "react";
import { View } from "react-native";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface SkeletonBlockProps {
  className?: string;
  uploads?: string[];
}

/** Mirrors JobDetails: top bar, gallery, identity, pay block, stats, body. */
export const JobDetailsSkeleton = ({
  className,
  uploads,
}: SkeletonBlockProps) => {
  const hasGallery = (uploads ?? []).length > 0;

  return (
    <StableSafeAreaView className={cn("flex-1 bg-background", className)}>
      {/* Top bar */}
      <View className="flex-row items-center gap-2 border-b border-border bg-card px-2 py-2">
        <Skeleton style={{ height: 40, width: 40 }} className="rounded-full" />
        <Skeleton style={{ height: 16 }} className="flex-1" />
        <Skeleton style={{ height: 40, width: 40 }} className="rounded-full" />
      </View>

      <View className="flex-1 gap-3">
        <View className="bg-card">
          {hasGallery ? (
            <Skeleton style={{ height: 220 }} className="w-full rounded-none" />
          ) : null}

          <View className="gap-3 px-5 pb-5 pt-5">
            <Skeleton style={{ height: 10, width: 90 }} />
            <Skeleton style={{ height: 24 }} className="w-3/4" />

            <View className="flex-row items-center gap-2">
              <Skeleton
                style={{ height: 22, width: 22 }}
                className="rounded-full"
              />
              <Skeleton style={{ height: 12, width: 140 }} />
            </View>

            {/* Pay block */}
            <Skeleton style={{ height: 62 }} className="w-full rounded-2xl" />

            {/* Stat strip */}
            <Skeleton style={{ height: 74 }} className="w-full rounded-2xl" />
          </View>
        </View>

        {/* About */}
        <View className="gap-2 bg-card px-5 py-5">
          <Skeleton style={{ height: 18, width: 120 }} className="mb-1" />
          <Skeleton style={{ height: 12 }} className="w-full" />
          <Skeleton style={{ height: 12 }} className="w-full" />
          <Skeleton style={{ height: 12 }} className="w-2/3" />
        </View>

        {/* At a glance */}
        <View className="gap-3 bg-card px-5 py-5">
          <Skeleton style={{ height: 18, width: 100 }} />
          <Skeleton style={{ height: 12 }} className="w-full" />
          <Skeleton style={{ height: 12 }} className="w-full" />
          <Skeleton style={{ height: 12 }} className="w-full" />
        </View>
      </View>

      {/* Action bar */}
      <View className="border-t border-border bg-card px-6 py-5 pb-8">
        <Skeleton style={{ height: 44 }} className="w-full rounded-xl" />
      </View>
    </StableSafeAreaView>
  );
};
