import React from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
  Platform,
  StatusBar,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface UseScrollableElementProps {
  duration?: number; // Duration for the animation in milliseconds
  deltaThreshold?: number; // Minimum scroll delta to trigger header visibility change
  checkScrollable?: boolean; // Flag to only activate event if content is scrollable
  collapseHeight?: boolean; // Collapse layout height when header is hidden
  ignoreTopInset?: boolean; // Ignore top safe area inset when header is visible, but apply top inset when header is hidden
}

export const useScrollableElement = ({
  duration = 250,
  deltaThreshold = 10,
  checkScrollable = false,
  collapseHeight = true,
  ignoreTopInset = false,
}: UseScrollableElementProps) => {
  const showHeader = useSharedValue(true);
  const headerHeight = useSharedValue(-1);

  const isAnimatingRef = React.useRef(false);
  const animTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleHeaderVisibility = React.useCallback(
    (visible: boolean) => {
      if (showHeader.value === visible) return;
      showHeader.value = visible;

      isAnimatingRef.current = true;
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
      }, duration + 100);
    },
    [duration, showHeader],
  );

  const insets = useSafeAreaInsets();

  const topInset = React.useMemo(() => {
    return Platform.OS === "android"
      ? (StatusBar.currentHeight ?? 0) + insets.top * 0.2
      : insets.top;
  }, [insets.top]);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    if (ignoreTopInset) {
      return {
        paddingTop: withTiming(showHeader.value ? 0 : topInset, {
          duration,
        }),
      };
    }

    return {
      marginTop: withTiming(showHeader.value ? 0 : -insets.top, {
        duration,
      }),
    };
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const style: {
      transform: { translateY: number }[];
      opacity: number;
      height?: number;
    } = {
      transform: [
        {
          translateY: withTiming(
            showHeader.value
              ? 0
              : -(headerHeight.value > 0 ? headerHeight.value : deltaThreshold),
            { duration },
          ),
        },
      ],
      opacity: withTiming(showHeader.value ? 1 : 0, { duration }),
    };

    if (collapseHeight && headerHeight.value > 0) {
      style.height = withTiming(showHeader.value ? headerHeight.value : 0, {
        duration,
      });
    }

    return style;
  });

  const onLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h > 0 && showHeader.value && Math.abs(headerHeight.value - h) > 1) {
        headerHeight.value = h;
      }
    },
    [headerHeight, showHeader],
  );

  // Ref for programmatic scroll control
  const scrollRef = React.useRef<any>(null);

  // Track scroll direction with accumulated delta to filter out bounce noise.
  // NOTE: these store the *clamped* offset (see handleScroll), not the raw
  // native offset, so overscroll/rubber-banding never contributes real deltas.
  const lastOffsetY = React.useRef(0);
  const accumulatedDelta = React.useRef(0);

  const scrollToTop = React.useCallback(
    (animated = true) => {
      if (scrollRef.current) {
        if (typeof scrollRef.current.scrollTo === "function") {
          scrollRef.current.scrollTo({ y: 0, animated });
        } else if (typeof scrollRef.current.scrollToOffset === "function") {
          scrollRef.current.scrollToOffset({ offset: 0, animated });
        }
      }
      lastOffsetY.current = 0;
      accumulatedDelta.current = 0;
      handleHeaderVisibility(true);
    },
    [handleHeaderVisibility],
  );

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = e.nativeEvent.contentSize.height;
    const layoutHeight = e.nativeEvent.layoutMeasurement.height;
    const rawOffsetY = e.nativeEvent.contentOffset.y;

    const maxOffset = Math.max(0, contentHeight - layoutHeight);

    // --- Detect whether the content actually requires scrolling at all. ---
    // This is checked unconditionally (not just when `checkScrollable` is
    // set) so a hook consumer never ends up with a permanently-hidden
    // header just because content briefly measured as short.
    const canScroll = maxOffset > 0;

    // Ignore layout-shift scroll events while collapse/expand animation is playing
    if (isAnimatingRef.current) {
      lastOffsetY.current = Math.max(0, Math.min(rawOffsetY, maxOffset));
      accumulatedDelta.current = 0;
      return;
    }

    if (!canScroll) {
      // Content isn't tall enough to scroll (short content case) — always
      // keep the header visible, regardless of any stray offset events.
      handleHeaderVisibility(true);
      lastOffsetY.current = 0;
      accumulatedDelta.current = 0;
      return;
    }

    const effectiveHeaderHeight =
      headerHeight.value > 0 ? headerHeight.value : 0;
    const totalRequiredHeight =
      layoutHeight + (collapseHeight ? effectiveHeaderHeight : 0);

    if (checkScrollable && totalRequiredHeight > 0) {
      // If content is not tall enough to be scrollable with header collapsed, keep header visible
      if (contentHeight <= totalRequiredHeight) {
        handleHeaderVisibility(true);
        lastOffsetY.current = Math.max(0, Math.min(rawOffsetY, maxOffset));
        accumulatedDelta.current = 0;
        return;
      }
    }

    // --- Clamp the offset used for all zone/delta math. ---
    // This is the core fix: rubber-band overscroll pushes rawOffsetY below 0
    // (top bounce) or above maxOffset (bottom bounce), and then the OS
    // animates it back to the boundary. That "spring back" is a real change
    // in rawOffsetY that used to get misread as an intentional scroll.
    // By clamping to [0, maxOffset], the offset simply stops moving once
    // we're in overscroll territory, so bounce (and its settle-back) always
    // produces a delta of 0 and can never fake an intentional swipe.
    const offsetY = Math.max(0, Math.min(rawOffsetY, maxOffset));

    // 1. At the very top (or top bounce): show header immediately
    if (offsetY <= 0) {
      accumulatedDelta.current = 0;
      handleHeaderVisibility(true);
    }
    // 2. At or near the bottom (or bottom bounce): keep header hidden and
    //    ignore bounce deltas. Uses deltaThreshold (instead of a hardcoded
    //    magic number) so the "near bottom" buffer scales with the same
    //    sensitivity setting used for direction detection.
    else if (offsetY >= maxOffset - deltaThreshold) {
      accumulatedDelta.current = 0;
      // Do not allow bottom bounce to show header
    }
    // 3. Middle scroll range: track intentional scroll direction
    else {
      const delta = offsetY - lastOffsetY.current;

      if (Math.abs(delta) >= 1) {
        // Reset accumulator if scroll direction reverses
        if (
          (delta > 0 && accumulatedDelta.current < 0) ||
          (delta < 0 && accumulatedDelta.current > 0)
        ) {
          accumulatedDelta.current = 0;
        }

        accumulatedDelta.current += delta;

        if (accumulatedDelta.current > deltaThreshold) {
          // Intentional downward scroll — hide header
          handleHeaderVisibility(false);
          accumulatedDelta.current = 0;
        } else if (accumulatedDelta.current < -deltaThreshold) {
          // Intentional upward scroll — show header
          handleHeaderVisibility(true);
          accumulatedDelta.current = 0;
        }
      }
    }

    lastOffsetY.current = offsetY;
  };

  return {
    animatedHeaderStyle,
    contentAnimatedStyle,
    handleScroll,
    onLayout,
    scrollRef,
    scrollToTop,
    showHeader,
  };
};
