import React from "react";
import { View } from "react-native";
import { Skeleton } from "../../ui/skeleton";

export const JobCardSkeleton = () => {
  return (
    <View className="w-full my-2 p-4 border-2 border-border rounded-lg bg-background">
      <Skeleton
        className="w-full rounded-lg mb-3"
        style={{
          width: "100%",
          height: 200,
          marginVertical: 2,
          borderRadius: 8,
        }}
      />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </View>
  );
};
