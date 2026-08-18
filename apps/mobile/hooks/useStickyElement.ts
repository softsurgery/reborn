import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

export const useStickyElement = (initialOffset: number) => {
  const scrollY = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const stickyHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: Math.max(0, initialOffset - scrollY.value),
        },
      ],
    };
  }, [initialOffset]);

  return { scrollY, handleScroll, stickyHeaderStyle };
};
