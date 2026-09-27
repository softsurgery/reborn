import React from "react";
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  GestureResponderEvent,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  AnimatedProps,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends Omit<
  AnimatedProps<PressableProps>,
  "children" | "onPressIn" | "onPressOut" | "key"
> {
  children?:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode);
  onPressIn?: PressableProps["onPressIn"];
  onPressOut?: PressableProps["onPressOut"];
  key?: React.Key | null;
  scaleTo?: number;
  opacityTo?: number;
  duration?: number;
  springDamping?: number;
  springStiffness?: number;
  springMass?: number;
  hapticFeedback?: boolean;
  withOverlay?: boolean;
  overlayOpacityTo?: number;
  overlayColor?: string;
}

export const AnimatedPressable = ({
  children,
  scaleTo = 0.95,
  opacityTo = 1,
  duration = 75,
  springDamping = 12,
  springStiffness = 320,
  springMass = 0.5,
  hapticFeedback = true,
  withOverlay = false,
  overlayOpacityTo = 0.2,
  overlayColor = "black",
  onPressIn,
  onPressOut,
  style,
  ...rest
}: AnimatedPressableProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const pressOverlay = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: pressOverlay.value,
  }));

  const handlePressIn = (e: GestureResponderEvent) => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withTiming(scaleTo, {
      duration,
      easing: Easing.out(Easing.quad),
    });
    opacity.value = withTiming(opacityTo, { duration });
    if (withOverlay) {
      pressOverlay.value = withTiming(overlayOpacityTo, { duration });
    }
    if (onPressIn) {
      onPressIn(e);
    }
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    scale.value = withSpring(1, {
      damping: springDamping,
      stiffness: springStiffness,
      mass: springMass,
    });
    opacity.value = withTiming(1, { duration: 120 });
    if (withOverlay) {
      pressOverlay.value = withTiming(0, { duration: 120 });
    }
    if (onPressOut) {
      onPressOut(e);
    }
  };

  return (
    <AnimatedPressableComponent
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style as any]}
      {...rest}
    >
      {(state: PressableStateCallbackType) => (
        <>
          {typeof children === "function" ? children(state) : children}
          {withOverlay && (
            <Animated.View
              style={[
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: overlayColor,
                },
                animatedOverlayStyle,
              ]}
              pointerEvents="none"
            />
          )}
        </>
      )}
    </AnimatedPressableComponent>
  );
};
