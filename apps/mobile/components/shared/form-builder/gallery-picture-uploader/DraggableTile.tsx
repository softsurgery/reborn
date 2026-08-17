import React from "react";
import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { ImageFile } from "../types";
import { cn } from "@/lib/utils";

interface DraggableTileProps {
  className?: string;
  item: ImageFile;
  size: number;
  onRemove?: () => void;
}

export const DraggableTile = ({
  className,
  item,
  size,
  onRemove,
}: DraggableTileProps) => {
  return (
    <View
      className={cn(
        "rounded-lg overflow-hidden bg-gray-200",
        item.progress < 100 && "opacity-70",
        className,
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

      {/* X button */}
      <Pressable
        onPress={onRemove}
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 12,
          padding: 2,
        }}
      >
        <X size={16} color="white" />
      </Pressable>

      {/* Progress bar */}
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
