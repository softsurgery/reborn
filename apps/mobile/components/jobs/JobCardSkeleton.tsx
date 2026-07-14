import React from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";
import { cn } from "~/lib/utils";
import { THUMBNAIL_SIZE } from "./JobCard";

interface JobCardSkeletonProps {
  className?: string;
}

/** Mirrors JobCard: thumbnail, eyebrow, title, description, pay, author row. */
export const JobCardSkeleton = ({ className }: JobCardSkeletonProps) => {
  return (
    <View
      className={cn(
        "my-2 w-full rounded-2xl border border-border bg-card p-3",
        className,
      )}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Skeleton
          style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
          className="rounded-xl"
        />

        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton style={{ height: 10, width: 80 }} />
          <Skeleton style={{ height: 16 }} className="w-full" />
          <Skeleton style={{ height: 12 }} className="w-2/3" />
          <Skeleton style={{ height: 20, width: 110 }} />
        </View>
      </View>

      <View
        style={{
          marginTop: 12,
          paddingTop: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
        className="border-t border-border"
      >
        <Skeleton style={{ height: 20, width: 20 }} className="rounded-full" />
        <Skeleton style={{ height: 12, width: 90 }} />
        <Skeleton
          style={{ marginLeft: "auto", height: 20, width: 64 }}
          className="rounded-full"
        />
        <Skeleton style={{ height: 20, width: 64 }} className="rounded-full" />
      </View>
    </View>
  );
};
