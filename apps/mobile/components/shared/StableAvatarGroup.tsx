import React from "react";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "./StableAvatar";
import { Text } from "../ui/text";
import { ImageSource } from "expo-image";
import { cn } from "~/lib/utils";

type AvatarGroupProps = {
  className?: string;
  images: {
    image: ImageSource;
    fallback: string;
  }[];
  max?: number; // optional limit (e.g., show only first 3 avatars + "+N")
  size?: number; // avatar size (default 40)
  overlap?: number; // how much to overlap (default 12)
};

export function AvatarGroup({
  className,
  images,
  max = images.length,
  size = 40,
  overlap = 12,
}: AvatarGroupProps) {
  const visible = images.slice(0, max);
  const extra = images.length - max;

  return (
    <View className={cn("flex flex-row relative justify-center", className)}>
      <View className={cn("flex flex-row")}>
        {visible.map((imgObj, i) => (
          <Avatar
            key={i}
            style={[
              {
                width: size,
                height: size,
                left: i * (size - overlap),
              },
            ]}
          >
            <AvatarImage source={{ uri: imgObj.image as string }} />
            <AvatarFallback>
              <Text>{imgObj.fallback}</Text>
            </AvatarFallback>
          </Avatar>
        ))}

        {extra > 0 && (
          <View
            style={[
              {
                left: visible.length * (size - overlap),
                width: size,
                height: size,
              },
            ]}
          >
            <Avatar
              style={{ width: size, height: size, backgroundColor: "#eee" }}
            >
              <AvatarFallback>
                <View
                  style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: "#ddd",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: size / 2.5, fontWeight: "600" }}>
                    +{extra}
                  </Text>
                </View>
              </AvatarFallback>
            </Avatar>
          </View>
        )}
      </View>
    </View>
  );
}
