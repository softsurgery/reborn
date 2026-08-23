import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Heart } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";
import { router } from "expo-router";

interface JobDetailsTopBarProps {
  className?: string;
  title?: string;
  showTitle?: boolean;
  isJobSaved: boolean;
  handleSave: () => void;
}

export const JobDetailsTopBar = ({
  className,
  title,
  showTitle = false,
  isJobSaved,
  handleSave,
}: JobDetailsTopBarProps) => {
  const { palette } = useColorPalette();
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(showTitle ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(showTitle ? 1 : 0, { duration: 180 });
  }, [showTitle]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 6 }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(showTitle ? palette.card : "transparent", {
      duration: 180,
    }),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          paddingTop: Math.max(insets.top, 8),
        },
        containerAnimatedStyle,
      ]}
      className={cn(
        "flex-row items-center justify-between px-3 pb-2",
        className,
      )}
    >
      <Pressable
        className={cn(
          "rounded-full p-2",
          showTitle ? "bg-transparent" : "bg-background/60",
        )}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color={palette.foreground} />
      </Pressable>
      <Animated.View
        style={[{ flex: 1, marginHorizontal: 4 }, titleStyle]}
        pointerEvents="none"
      >
        <Text
          numberOfLines={1}
          className="text-center text-sm font-semibold tracking-tight"
        >
          {title}
        </Text>
      </Animated.View>
      <Pressable
        className={cn(
          "h-10 w-10 items-center justify-center rounded-full active:bg-muted",
          showTitle ? "bg-transparent" : "bg-background/60",
        )}
        onPress={handleSave}
        hitSlop={8}
      >
        <Heart
          size={20}
          color={isJobSaved ? palette.primary : palette.foreground}
          fill={isJobSaved ? palette.primary : "none"}
        />
      </Pressable>
    </Animated.View>
  );
};
