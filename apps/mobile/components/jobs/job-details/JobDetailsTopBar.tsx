import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { ChevronLeft, Heart } from "lucide-react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";

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
  const progress = useSharedValue(showTitle ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(showTitle ? 1 : 0, { duration: 180 });
  }, [showTitle]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 6 }],
  }));

  return (
    <View
      className={cn(
        "flex-row items-center gap-2 border-b border-border bg-card px-2 py-2",
        className,
      )}
    >
      <StablePressable
        className="h-10 w-10 items-center justify-center rounded-full active:bg-muted"
        onPress={() => router.back()}
        hitSlop={8}
      >
        <ChevronLeft size={22} color={palette.foreground} />
      </StablePressable>

      <Animated.View style={[{ flex: 1 }, titleStyle]} pointerEvents="none">
        <Text
          numberOfLines={1}
          className="text-sm font-semibold tracking-tight"
        >
          {title}
        </Text>
      </Animated.View>

      <StablePressable
        className="h-10 w-10 items-center justify-center rounded-full active:bg-muted"
        onPress={handleSave}
        hitSlop={8}
      >
        <Heart
          size={20}
          color={isJobSaved ? palette.primary : palette.mutedForeground}
          fill={isJobSaved ? palette.primary : "none"}
        />
      </StablePressable>
    </View>
  );
};
