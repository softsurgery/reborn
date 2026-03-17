import React from "react";
import { View, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { X, Plus } from "lucide-react-native";
import { cn } from "~/lib/utils";

const GRID_COLUMNS = 3;
const GAP = 8;

export interface GalleryItem {
  id: string;
  uri: string;
  name: string;
  type: string;
}

interface GalleryPicturePickerProps {
  className?: string;
  images: GalleryItem[];
  onChange: (images: GalleryItem[]) => void;
  maxImages?: number;
}

export const GalleryPicturePicker = ({
  images,
  onChange,
  maxImages = 9,
  className,
}: GalleryPicturePickerProps) => {
  const screenWidth = Dimensions.get("window").width;
  const containerPadding = 16;
  const totalGap = GAP * (GRID_COLUMNS - 1);
  const itemSize =
    (screenWidth - containerPadding * 4 - totalGap) / GRID_COLUMNS;

  const pickImage = async () => {
    const remaining = maxImages - images.length;
    if (remaining <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages: GalleryItem[] = result.assets.map((asset) => ({
        id: Math.random().toString(36).substring(2, 11),
        uri: asset.uri,
        name: asset.uri.split("/").pop() || "photo.jpg",
        type: asset.type || "image/jpeg",
      }));

      onChange([...images, ...newImages].slice(0, maxImages));
    }
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const slots = Array.from({ length: maxImages }, (_, i) => images[i] ?? null);

  return (
    <View
      className={cn(
        "flex-row flex-wrap justify-between my-4 w-full",
        className,
      )}
      style={{ gap: GAP, paddingHorizontal: containerPadding }}
    >
      {slots.map((item, index) => (
        <View
          key={item?.id ?? `empty-${index}`}
          style={{ width: itemSize, height: itemSize * 1.25 }}
        >
          {item ? (
            <View className="relative flex-1 rounded-xl overflow-hidden">
              <Image
                source={{ uri: item.uri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
              <Pressable
                onPress={() => removeImage(item.id)}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
                hitSlop={8}
              >
                <X size={16} color="white" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={pickImage}
              className="flex-1 rounded-xl border-2 border-dashed border-muted-foreground/30 items-center justify-center"
            >
              <Plus size={28} color="#4b5563" />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
};
