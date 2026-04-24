import React, { useCallback, useRef } from "react";
import { View, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { X, Plus, ImageIcon, GripVertical } from "lucide-react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  LinearTransition,
} from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { Icon } from "@/components/ui/icon";

const GRID_COLUMNS = 3;
const GAP = 10;

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.8 };

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

// ── Draggable image tile ──────────────────────────────────────────────
interface DraggableTileProps {
  item: GalleryItem;
  index: number;
  itemSize: number;
  onRemove: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
  isFirst: boolean;
}

const DraggableTile = ({
  item,
  index,
  itemSize,
  onRemove,
  onDragStart,
  onDragMove,
  onDragEnd,
  isFirst,
}: DraggableTileProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(1);
  const opacity = useSharedValue(1);

  const dragGesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .shouldCancelWhenOutside(false)
    .onStart(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      runOnJS(onDragStart)(index);
      scale.value = withSpring(1.08, SPRING_CONFIG);
      zIndex.value = 100;
      opacity.value = withTiming(0.9, { duration: 150 });
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      runOnJS(onDragMove)(e.absoluteX, e.absoluteY);
    })
    .onEnd(() => {
      translateX.value = withSpring(0, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
      scale.value = withSpring(1, SPRING_CONFIG);
      zIndex.value = 1;
      opacity.value = withTiming(1, { duration: 150 });
      runOnJS(onDragEnd)();
    })
    .onFinalize(() => {
      translateX.value = withSpring(0, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
      scale.value = withSpring(1, SPRING_CONFIG);
      zIndex.value = 1;
      opacity.value = withTiming(1, { duration: 150 });
      runOnJS(onDragEnd)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
    opacity: opacity.value,
  }));

  const tileHeight = itemSize * 1.25;

  return (
    <GestureDetector gesture={dragGesture}>
      <Animated.View
        style={[{ width: itemSize, height: tileHeight }, animatedStyle]}
      >
        <View
          className="relative flex-1 rounded-2xl overflow-hidden mx-2"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Image
            source={{ uri: item.uri }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={200}
          />

          {/* Gradient overlay at bottom */}

          {/* First image badge */}
          {isFirst && (
            <View className="absolute bottom-2 left-2 bg-primary rounded-md px-2 py-0.5">
              <Text className="text-primary-foreground text-[10px] font-poppins-semibold">
                Cover
              </Text>
            </View>
          )}

          {/* Remove button */}
          <Pressable
            onPress={() => onRemove(item.id)}
            className="absolute top-1.5 right-1.5 bg-black/50 rounded-full p-1"
            hitSlop={10}
          >
            <X size={14} color="white" strokeWidth={3} />
          </Pressable>

          {/* Index badge */}
          <View className="absolute top-1.5 left-1.5 bg-black/40 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-white text-[10px] font-poppins-semibold">
              {index + 1}
            </Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

// ── Add-image button ──────────────────────────────────────────────────
interface AddTileProps {
  itemSize: number;
  onPress: () => void;
  remaining: number;
}

const AddTile = ({ itemSize, onPress, remaining }: AddTileProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: itemSize * 0.9, height: itemSize * 1.25 }}
      className="rounded-2xl mx-2 border-2 border-dashed border-muted-foreground/40 items-center justify-center gap-1 bg-muted/30"
    >
      <View className="bg-muted rounded-full p-2.5">
        <Icon as={Plus} size={22} className="text-muted-foreground" />
      </View>
      <Text className="text-muted-foreground text-sm mt-1">
        {remaining} left
      </Text>
    </Pressable>
  );
};

// ── Empty state ───────────────────────────────────────────────────────
interface EmptyStateProps {
  onPress: () => void;
  maxImages: number;
}

const EmptyState = ({ onPress, maxImages }: EmptyStateProps) => (
  <Pressable
    onPress={onPress}
    className="w-full py-10 rounded-2xl border-2 border-dashed border-muted-foreground/40 items-center justify-center bg-muted/20"
  >
    <View className="bg-muted rounded-full p-4 mb-3">
      <Icon as={ImageIcon} size={28} className="text-muted-foreground" />
    </View>
    <Text className="text-foreground text-sm font-poppins-semibold">
      Add Photos
    </Text>
    <Text className="text-muted-foreground text-xs mt-1">
      Tap to select up to {maxImages} images
    </Text>
  </Pressable>
);

// ── Main component ────────────────────────────────────────────────────
export const GalleryPicturePicker = ({
  images,
  onChange,
  maxImages = 9,
  className,
}: GalleryPicturePickerProps) => {
  const screenWidth = Dimensions.get("window").width;
  const containerPadding = 10;
  const totalGap = GAP * (GRID_COLUMNS - 1);
  const itemSize =
    (screenWidth - containerPadding * 2 - totalGap) / GRID_COLUMNS;

  const dragIndex = useRef<number | null>(null);
  const tilePositions = useRef<{ x: number; y: number }[]>([]);
  const containerRef = useRef<View>(null);

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

  const removeImage = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(images.filter((img) => img.id !== id));
    },
    [images, onChange],
  );

  // ── Drag-and-drop logic ───────────────────────────────────────────
  const computePositions = useCallback(() => {
    const positions: { x: number; y: number }[] = [];
    const tileHeight = itemSize * 1.25;
    for (let i = 0; i < images.length; i++) {
      const col = i % GRID_COLUMNS;
      const row = Math.floor(i / GRID_COLUMNS);
      positions.push({
        x: containerPadding + col * (itemSize + GAP) + itemSize / 2,
        y: row * (tileHeight + GAP) + tileHeight / 2,
      });
    }
    tilePositions.current = positions;
  }, [images.length, itemSize]);

  const handleDragStart = useCallback(
    (index: number) => {
      dragIndex.current = index;
      computePositions();
    },
    [computePositions],
  );

  const handleDragMove = useCallback(
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
          const reordered = [...images];
          const [moved] = reordered.splice(from, 1);
          reordered.splice(closest, 0, moved);
          dragIndex.current = closest;
          Haptics.selectionAsync();
          onChange(reordered);
          computePositions();
        }
      });
    },
    [images, onChange, itemSize, computePositions],
  );

  const handleDragEnd = useCallback(() => {
    dragIndex.current = null;
  }, []);

  const remaining = maxImages - images.length;
  const hasImages = images.length > 0;

  return (
    <View className={cn("my-4 w-full", className)}>
      {/* Counter */}
      {hasImages && (
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-muted-foreground text-xs">
            {images.length} / {maxImages} photos
          </Text>
          <Text className="text-muted-foreground text-[10px]">
            Hold &amp; drag to reorder
          </Text>
        </View>
      )}

      {hasImages ? (
        <View
          ref={containerRef}
          className="flex-row flex-wrap"
          style={{ gap: GAP, paddingHorizontal: containerPadding }}
        >
          {images.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{ width: itemSize * 0.9, height: itemSize * 1.25 }}
              layout={LinearTransition.springify()
                .damping(20)
                .stiffness(200)
                .mass(0.8)}
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
