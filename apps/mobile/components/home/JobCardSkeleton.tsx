import React from "react";
import { View } from "react-native";

export const JobCardSkeleton = () => {
  return (
    <View className="w-full my-2 p-4 border-2 border-border rounded-lg bg-gray-100 dark:bg-gray-800">
      <View className="w-full h-48 rounded-lg mb-3 bg-gray-300 dark:bg-gray-700" />
      <View className="h-5 w-3/4 mb-2 bg-gray-300 dark:bg-gray-700 rounded" />
      <View className="h-4 w-1/2 mb-2 bg-gray-300 dark:bg-gray-700 rounded" />
      <View className="h-4 w-1/3 mb-2 bg-gray-300 dark:bg-gray-700 rounded" />
      <View className="h-4 w-full mb-2 bg-gray-300 dark:bg-gray-700 rounded" />
      <View className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
    </View>
  );
};
