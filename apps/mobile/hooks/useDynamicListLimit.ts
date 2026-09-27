import React from "react";
import { useWindowDimensions } from "react-native";

export interface UseDynamicListLimitOptions {
  staticHeight: number;
  itemHeight: number;
  minItems?: number;
  maxItems?: number;
}

export function useDynamicListLimit({
  staticHeight,
  itemHeight,
  minItems = 1,
  maxItems = 10,
}: UseDynamicListLimitOptions) {
  const { height: screenHeight } = useWindowDimensions();

  const dynamicLimit = React.useMemo(() => {
    const available = screenHeight - staticHeight;
    const items = Math.floor(available / itemHeight);

    return Math.max(minItems, Math.min(items, maxItems));
  }, [screenHeight, staticHeight, itemHeight, minItems, maxItems]);

  return dynamicLimit;
}
