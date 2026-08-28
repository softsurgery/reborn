import React from "react";
import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { ImageFile } from "../types";
import { cn } from "@/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";

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
  const { palette } = useColorPalette();
  return (
    <View
      className={cn(
        "rounded-t-xl overflow-hidden border border-border",
        item.progress < 100 && "opacity-70",
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        source={{ uri: item.uri }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />
      {/* X button */}
      <Pressable onPress={onRemove} className="absolute top-0 right-0 p-2">
        <X size={16} color={palette.foreground} />
      </Pressable>
      {/* Progress bar */}
      <View
        className=" absolute bottom-0 left-0 h-1 bg-primary"
        style={{
          width: `${item.progress}%`,
        }}
      />
    </View>
  );
};
