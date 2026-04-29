import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { ImageFile } from "../types";
import { cn } from "@/lib/utils";

interface DraggableTileProps {
  className?: string;
  item: ImageFile;
  size: number;
}

export const DraggableTile = ({
  className,
  item,
  size,
}: DraggableTileProps) => {
  return (
    <View
      className={cn(
        "rounded-lg overflow-hidden bg-gray-200",
        item.progress < 100 && "opacity-70",
        className
      )}
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Image
        source={{ uri: item.uri }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />

      {item.progress < 100 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 3,
            width: `${item.progress}%`,
            backgroundColor: "#22c55e",
          }}
        />
      )}
    </View>
  );
};
