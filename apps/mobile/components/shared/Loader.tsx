import React from "react";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface LoaderProps {
  isPending?: boolean;
  size?: "small" | "large" | number;
  className?: string;
}

export const Loader = ({
  isPending = true,
  size = "large",
  className,
}: LoaderProps) => {
  const height = useSharedValue(isPending ? 1 : 0);
  const opacity = useSharedValue(isPending ? 1 : 0);

  React.useEffect(() => {
    height.value = withTiming(isPending ? 1 : 0, { duration: 300 });
    opacity.value = withTiming(isPending ? 1 : 0, { duration: 300 });
  }, [isPending]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: height.value * (size === "small" ? 100 : 200),
    overflow: "hidden",
  }));

  return (
    <Animated.View style={animatedStyle} className={className}>
      {isPending && (
        <LottieView
          autoPlay
          loop
          style={{
            width: size === "small" ? 100 : size === "large" ? 200 : size,
            height: size === "small" ? 100 : size === "large" ? 200 : size,
          }}
          source={require("~/assets/material-wave.json")}
        />
      )}
    </Animated.View>
  );
};
