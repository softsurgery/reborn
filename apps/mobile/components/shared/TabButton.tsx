import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ColorValue,
  GestureResponderEvent,
  Pressable,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColorPalette } from "@/hooks/useColorPalette";
import { LucideIcon } from "lucide-react-native";

export interface TabButtonProps extends Omit<BottomTabBarButtonProps, "children"> {
  name: string;
  children?: React.ReactNode;
  title?: string;
  icon?: LucideIcon;
  iconSize?: number;
  customButton?: (props: BottomTabBarButtonProps) => React.ReactNode;
  customIcon?: (props: {
    focused: boolean;
    color: ColorValue;
    size: number;
  }) => React.ReactNode;
  hideLabel?: boolean;
  indicatorColor?: string;
  onLongPress?: () => void;
}

export const TabButton = ({
  accessibilityState,
  children,
  onPress,
  onLongPress,
  style,
  indicatorColor,
  ref: _ref,
  ...props
}: TabButtonProps) => {
  const { palette } = useColorPalette();
  const focused = accessibilityState?.selected;
  const scale = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0, {
      damping: 15,
      stiffness: 140,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scale.value, [0, 1], [1, 1.08]),
      },
    ],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: scale.value,
    transform: [
      {
        scaleX: withSpring(focused ? 1 : 0.4),
      },
    ],
  }));

  const handlePress = async (e: GestureResponderEvent) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.(e as unknown as React.MouseEvent<HTMLAnchorElement, MouseEvent>);
  };

  const handleLongPress = async () => {
    if (onLongPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onLongPress();
    }
  };

  return (
    <Pressable
      {...props}
      style={style}
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="mt-2"
    >
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
            style={{ backgroundColor: indicatorColor || palette.primary }}
            className="h-full w-full rounded-full"
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default TabButton;
