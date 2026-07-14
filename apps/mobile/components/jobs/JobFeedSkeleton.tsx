import React from "react";
import { View } from "react-native";
import { JobCardSkeleton } from "./JobCardSkeleton";

interface JobFeedSkeletonProps {
  /** Cards to render while the first page loads. */
  count?: number;
}

export const JobFeedSkeleton = ({ count = 3 }: JobFeedSkeletonProps) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </View>
  );
};
