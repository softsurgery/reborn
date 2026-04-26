import React from "react";
import { View, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import Animated, { LinearTransition } from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { ImageFile } from "../types";
import { DraggableTile } from "./DraggableTile";
import { AddTile } from "./AddTitle";
import { EmptyState } from "./EmptyState";

const GRID_COLUMNS = 3;
const GAP = 10;

interface GalleryPicturePickerProps {
  className?: string;
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  onUpload?: (file: File, onProgress: (percent: number) => void) => void;
  maxImages?: number;
}

// ── Main component ────────────────────────────────────────────────────
export const GalleryPicturePicker = ({
  images,
  onChange,
  onUpload,
  maxImages = 9,
  className,
}: GalleryPicturePickerProps) => {
  const screenWidth = Dimensions.get("window").width;
  const containerPadding = 10;
  const totalGap = GAP * (GRID_COLUMNS - 1);
  const itemSize =
    (screenWidth - containerPadding * 2 - totalGap) / GRID_COLUMNS;

  const dragIndex = React.useRef<number | null>(null);
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);
  const isDraggingRef = React.useRef(false);
  const tilePositions = React.useRef<{ x: number; y: number }[]>([]);
  const containerRef = React.useRef<View>(null);

  // Local images state – avoids parent re-renders during drag
  const [localImages, setLocalImages] = React.useState(images);
  const localImagesRef = React.useRef(localImages);
  localImagesRef.current = localImages;

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // Sync with parent prop when not dragging
  React.useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalImages(images);
    }
  }, [images]);

  const pickImage = async () => {
    const remaining = maxImages - localImages.length;
    if (remaining <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages: ImageFile[] = result.assets.map((asset) => ({
        id: Math.random().toString(36).substring(2, 11),
        uri: asset.uri,
        name: asset.uri.split("/").pop() || "photo.jpg",
        type: asset.type || "image/jpeg",
        progress: 0,
      }));

      onChange([...localImages, ...newImages].slice(0, maxImages));
      newImages.forEach((img) => {
        const file = {
          uri: img.uri,
          name: img.name,
          type: img.type,
        } as unknown as File;

        onUpload?.(file, () => {});
      });
    }
  };

  const removeImage = React.useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(localImages.filter((img) => img.id !== id));
    },
    [localImages, onChange],
  );

  // ── Drag-and-drop logic ───────────────────────────────────────────
  const computePositions = React.useCallback(() => {
    const positions: { x: number; y: number }[] = [];
    const tileHeight = itemSize * 1.25;
    for (let i = 0; i < localImagesRef.current.length; i++) {
      const col = i % GRID_COLUMNS;
      const row = Math.floor(i / GRID_COLUMNS);
      positions.push({
        x: containerPadding + col * (itemSize + GAP) + itemSize / 2,
        y: row * (tileHeight + GAP) + tileHeight / 2,
      });
    }
    tilePositions.current = positions;
  }, [itemSize]);

  const handleDragStart = React.useCallback(
    (index: number) => {
      isDraggingRef.current = true;
      dragIndex.current = index;
      setActiveDragId(localImagesRef.current[index]?.id ?? null);
      computePositions();
    },
    [computePositions],
  );

  const handleDragMove = React.useCallback(
    (absoluteX: number, absoluteY: number) => {
      if (dragIndex.current === null) return;

      containerRef.current?.measureInWindow((cx, cy) => {
        const relX = absoluteX - cx;
        const relY = absoluteY - cy;

        let closest = -1;
        let minDist = Infinity;
        for (let i = 0; i < tilePositions.current.length; i++) {
          if (i === dragIndex.current) continue;
          const pos = tilePositions.current[i];
          const dist = Math.hypot(pos.x - relX, pos.y - relY);
          if (dist < minDist) {
            minDist = dist;
            closest = i;
          }
        }

        if (closest !== -1 && minDist < itemSize * 0.7) {
          const from = dragIndex.current!;
          setLocalImages((prev) => {
            const reordered = [...prev];
            const [moved] = reordered.splice(from, 1);
            reordered.splice(closest, 0, moved);
            return reordered;
          });
          dragIndex.current = closest;
          Haptics.selectionAsync();
          computePositions();
        }
      });
    },
    [itemSize, computePositions],
  );

  const handleDragEnd = React.useCallback(() => {
    dragIndex.current = null;
    setActiveDragId(null);
    isDraggingRef.current = false;
    // Commit the reordered images to the parent
    onChangeRef.current(localImagesRef.current);
  }, []);

  const remaining = maxImages - localImages.length;
  const hasImages = localImages.length > 0;

  return (
    <View className={cn("my-4 w-full", className)}>
      {/* Counter */}
      {hasImages && (
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-muted-foreground text-xs">
            {localImages.length} / {maxImages} photos
          </Text>
          <Text className="text-muted-foreground text-[10px]">
            Hold &amp; drag to reorder
          </Text>
        </View>
      )}

      {hasImages ? (
        <View
          ref={containerRef}
          className={"flex-row flex-wrap"}
          style={{ gap: GAP, paddingHorizontal: containerPadding }}
        >
          {localImages.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                width: itemSize * 0.9,
                height: itemSize * 1.25,
                opacity: item.progress < 100 ? 0.6 : 1,
                zIndex: activeDragId === item.id ? 999 : 1,
              }}
              layout={
                activeDragId === item.id
                  ? undefined
                  : LinearTransition.springify()
                      .damping(20)
                      .stiffness(200)
                      .mass(0.8)
              }
            >
              <DraggableTile
                item={item}
                index={index}
                itemSize={itemSize}
                onRemove={removeImage}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                isFirst={index === 0}
              />
            </Animated.View>
          ))}

          {remaining > 0 && (
            <Animated.View
              key="add-tile"
              style={{ width: itemSize * 0.9, height: itemSize * 1.25 }}
              layout={LinearTransition.springify()
                .damping(20)
                .stiffness(200)
                .mass(0.8)}
            >
              <AddTile
                itemSize={itemSize}
                onPress={pickImage}
                remaining={remaining}
              />
            </Animated.View>
          )}
        </View>
      ) : (
        <View style={{ paddingHorizontal: containerPadding }}>
          <EmptyState onPress={pickImage} maxImages={maxImages} />
        </View>
      )}
    </View>
  );
};
