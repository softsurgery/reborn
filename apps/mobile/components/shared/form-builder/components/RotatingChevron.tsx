import { Icon } from "@/components/ui/icon";
import { ChevronDown } from "lucide-react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface RotatingChevronProps {
  expanded: boolean;
  size?: number;
  color?: string;
  className?: string;
}

export function RotatingChevron({
  expanded,
  size = 16,
  color = "gray",
  className,
}: RotatingChevronProps) {
  const rotation = useSharedValue(expanded ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(expanded ? 180 : 0, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
  }, [expanded, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={chevronStyle} className={className}>
      <Icon as={ChevronDown} size={size} color={color} />
    </Animated.View>
  );
}
