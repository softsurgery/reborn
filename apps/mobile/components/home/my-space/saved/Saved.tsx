import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { SavedList } from "./SavedList";

interface SavedProps {
  className?: string;
}

export const Saved = ({ className }: SavedProps) => {
  return (
    <View className={cn("flex flex-1 bg-background", className)}>
      <View className="flex-1">
        <SavedList search="" searching={false} />
      </View>
    </View>
  );
};
