import React from "react";
import { View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface SkeletonBlockProps {
  className?: string;
  uploads?: string[];
}

export const JobDetailsSkeleton = ({ className }: SkeletonBlockProps) => {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;
  const imageHeight = screenHeight * 0.35;

  return (
    <View className={cn("flex-1 bg-background", className)}>
      {/* Floating top bar overlay */}
      <View
        style={{ paddingTop: Math.max(insets.top, 8) }}
        className="absolute top-0 left-0 right-0 z-30 flex-row items-center justify-between px-3 pb-2"
      >
        <Skeleton style={{ height: 40, width: 40 }} className="rounded-full" />
        <Skeleton style={{ height: 40, width: 40 }} className="rounded-full" />
      </View>

      <View className="flex-1 gap-3">
        {/* Hero Section */}
        <View className="bg-card">
          <Skeleton
            style={{ height: imageHeight }}
            className="w-full rounded-none"
          />

          <View className="gap-3 px-5 pb-5 pt-4">
            <Skeleton style={{ height: 12, width: 80 }} />
            <Skeleton style={{ height: 24 }} className="w-3/4" />

            <View className="flex-row items-center gap-2">
              <Skeleton
                style={{ height: 22, width: 22 }}
                className="rounded-full"
              />
              <Skeleton style={{ height: 12, width: 120 }} />
            </View>

            {/* Pay block */}
            <Skeleton style={{ height: 60 }} className="w-full rounded-2xl" />

            {/* Stat strip */}
            <Skeleton style={{ height: 70 }} className="w-full rounded-2xl" />
          </View>
        </View>

        {/* Content Section */}
        <View className="gap-3 bg-card px-5 py-5">
          <Skeleton style={{ height: 18, width: 120 }} />
          <Skeleton style={{ height: 12 }} className="w-full" />
          <Skeleton style={{ height: 12 }} className="w-4/5" />
        </View>
      </View>

      {/* Action bar */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="border-t border-border bg-card px-6 pt-4"
      >
        <Skeleton style={{ height: 44 }} className="w-full rounded-xl" />
      </View>
    </View>
  );
};
