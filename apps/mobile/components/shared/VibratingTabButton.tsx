import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export interface VibratingTabButtonProps {
  accessibilityState?: { selected?: boolean };
  children?: React.ReactNode;
  onPress?: (e?: any) => void;
  indicatorColor: string;
}

export const VibratingTabButton = ({
  accessibilityState,
  children,
  onPress,
  indicatorColor,
}: VibratingTabButtonProps) => {
  const focused = !!accessibilityState?.selected;
  const progress = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, {
      damping: 15,
      stiffness: 140,
    });
  }, [focused, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [1, 1.08]),
      },
    ],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scaleX: interpolate(progress.value, [0, 1], [0.4, 1]),
      },
    ],
  }));

  const handlePress = async (e?: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.(e);
  };

  return (
    <Pressable onPress={handlePress} className="mt-2">
      <Animated.View
        style={animatedStyle}
        className="items-center justify-center gap-1"
      >
        {children}

        <Animated.View
          style={indicatorStyle}
          className="mt-1 h-1 w-8 rounded-full"
        >
          <View
            style={{ backgroundColor: indicatorColor }}
            className="h-full w-full rounded-full"
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};
