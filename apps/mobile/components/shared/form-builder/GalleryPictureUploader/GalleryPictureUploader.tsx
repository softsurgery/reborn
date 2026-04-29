import { Text } from "@/components/ui/text";
import React from "react";
import { Dimensions, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageFile } from "../types";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";
import { AddTile } from "./AddTitle";
import { DraggableTile } from "./DraggableTile";
import Sortable from "react-native-sortables";

interface GalleryPictureUploaderProps {
  className?: string;
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  onUpload?: (file: File, onProgress: (percent: number) => void) => void;
  cols: number;
  rows: number;
  editable?: boolean;
  quality?: number;
}

const screenWidth = Dimensions.get("window").width;

export const GalleryPictureUploader = ({
  className,
  images,
  onChange,
  onUpload,
  cols = 3,
  rows = 3,
  editable = true,
  quality = 0.8,
}: GalleryPictureUploaderProps) => {
  const [containerWidth, setContainerWidth] = React.useState(0);
  const imagesRef = React.useRef(images);

  React.useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const maxImages = cols * rows;
  const PADDING = 5;

  // dynamic gap based on layout
  const GAP = Math.max(10, Math.min(10, Math.floor(cols * 1.2)));

  const displayedImages = images.slice(0, maxImages);

  const availableWidth =
    containerWidth > 0
      ? containerWidth - PADDING * 2
      : screenWidth - PADDING * 2;

  const itemSize = (availableWidth - GAP * (cols - 1)) / cols;

  const showAddTile = editable && displayedImages.length < maxImages;

  // include add tile inside grid for proper alignment
  const gridData = showAddTile
    ? [...displayedImages, { id: "__add__", isAdd: true } as any]
    : displayedImages;

  const pickImage = async () => {
    if (!editable) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages: ImageFile[] = result.assets.map((asset) => ({
        id: Math.random().toString(36).substring(2, 11),
        uri: asset.uri,
        name: asset.uri.split("/").pop() || "photo.jpg",
        type: asset.type || "image/jpeg",
        progress: 0,
      }));

      const updated = [...images, ...newImages].slice(0, maxImages);

      imagesRef.current = updated;
      onChange(updated);

      newImages.forEach((img) => {
        const file = {
          uri: img.uri,
          name: img.name,
          type: img.type,
        } as unknown as File;

        onUpload?.(file, (progress) => {
          const updatedImages = imagesRef.current.map((i) =>
            i.id === img.id ? { ...i, progress } : i,
          );

          imagesRef.current = updatedImages;
          onChange(updatedImages);
        });
      });
    }
  };

  return (
    <View className={cn("my-2", className)}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-muted-foreground text-xs">
          {images.length} / {maxImages} photos
        </Text>
        <Text className="text-muted-foreground text-[10px]">
          Hold & drag to reorder
        </Text>
      </View>

      {/* Empty state */}
      {displayedImages.length === 0 ? (
        <EmptyState maxImages={maxImages} onPress={pickImage} />
      ) : (
        <View
          style={{
            paddingHorizontal: PADDING,
          }}
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          <Sortable.Grid
            data={gridData}
            columns={cols}
            keyExtractor={(item) => item.id}
            rowGap={GAP}
            columnGap={GAP}
            onDragEnd={({ data }) => {
              const filtered = data.filter((i: any) => !i.isAdd);

              imagesRef.current = filtered;
              onChange(filtered);
            }}
            renderItem={({ item }) => {
              if ((item as any).isAdd) {
                return (
                  <AddTile
                    itemSize={itemSize}
                    remaining={maxImages - displayedImages.length}
                    onPress={pickImage}
                  />
                );
              }

              return <DraggableTile item={item} size={itemSize} />;
            }}
          />
        </View>
      )}
    </View>
  );
};
