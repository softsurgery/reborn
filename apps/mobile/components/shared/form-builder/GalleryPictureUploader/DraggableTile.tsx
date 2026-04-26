import React, { useRef, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Layout,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { runOnJS } from "react-native-worklets";
import { Image } from "expo-image";
import { Icon } from "@/components/ui/icon";
import { X } from "lucide-react-native";
import { ImageFile } from "../types";

const SPRING_CONFIG = {
  damping: 10,
  stiffness: 100,
  mass: 1,
};

interface DraggableTileProps {
  item: ImageFile;
  index: number;
  itemSize: number;
  onRemove: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
  isFirst: boolean;
}

export const DraggableTile = React.memo(
  ({
    item,
    index,
    itemSize,
    onRemove,
    onDragStart,
    onDragMove,
    onDragEnd,
    isFirst,
  }: DraggableTileProps) => {
    const isDragging = useSharedValue(false);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const zIndex = useSharedValue(1);

    const startX = useSharedValue(0);
    const startY = useSharedValue(0);

    const onDragStartRef = useRef(onDragStart);
    const onDragMoveRef = useRef(onDragMove);
    const onDragEndRef = useRef(onDragEnd);

    onDragStartRef.current = onDragStart;
    onDragMoveRef.current = onDragMove;
    onDragEndRef.current = onDragEnd;

    const fireStart = useCallback(() => {
      onDragStartRef.current(index);
    }, [index]);

    const fireMove = useCallback((x: number, y: number) => {
      onDragMoveRef.current(x, y);
    }, []);

    const fireEnd = useCallback(() => {
      onDragEndRef.current();
    }, []);

    const gesture = useMemo(
      () =>
        Gesture.Pan()
          .activateAfterLongPress(250)

          .onBegin(() => {
            isDragging.value = true;

            startX.value = translateX.value;
            startY.value = translateY.value;

            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

            runOnJS(fireStart)();

            scale.value = withSpring(1.06, SPRING_CONFIG);
            opacity.value = withTiming(0.92, { duration: 120 });
            zIndex.value = 999;
          })

          .onUpdate((e) => {
            // IMPORTANT: no damping → prevents flicker
            translateX.value = startX.value + e.translationX;
            translateY.value = startY.value + e.translationY;

            runOnJS(fireMove)(e.absoluteX, e.absoluteY);
          })

          .onEnd((e) => {
            translateX.value = withSpring(0, {
              ...SPRING_CONFIG,
              velocity: e.velocityX,
            });

            translateY.value = withSpring(0, {
              ...SPRING_CONFIG,
              velocity: e.velocityY,
            });

            scale.value = withSpring(1, SPRING_CONFIG);
            opacity.value = withTiming(1, { duration: 120 });

            isDragging.value = false;
            zIndex.value = 1;

            runOnJS(fireEnd)();
          }),
      [],
    );

    const animatedStyle = useAnimatedStyle(() => {
      return {
        position: isDragging.value ? "absolute" : "relative",

        zIndex: zIndex.value,

        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { scale: scale.value },
        ],

        opacity: opacity.value,
      };
    });

    const height = itemSize * 1.25;

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          layout={Layout.springify()}
          style={[
            {
              width: itemSize,
              height,
            },
            animatedStyle,
          ]}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              overflow: "hidden",
              marginHorizontal: 8,
              backgroundColor: "#000",
            }}
          >
            <Image
              source={{ uri: item.uri }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={150}
            />

            {isFirst && (
              <View
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  backgroundColor: "#000",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10 }}>Cover</Text>
              </View>
            )}

            <Pressable
              onPress={() => onRemove(item.id)}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 20,
                padding: 4,
              }}
            >
              <Icon as={X} size={14} color="white" strokeWidth={3} />
            </Pressable>

            <View
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                backgroundColor: "rgba(0,0,0,0.4)",
                width: 20,
                height: 20,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 10 }}>{index + 1}</Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  },
);
