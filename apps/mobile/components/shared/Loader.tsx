import React from "react";
import { View, Button } from "react-native";
import LottieView from "lottie-react-native";
import { cn } from "~/lib/utils";

interface LoaderProps {
  className?: string;
  isPending?: boolean;
  size?: "small" | "large";
}

export const Loader = ({
  className,
  isPending = false,
  size = "large",
}: LoaderProps) => {
  const animation = React.useRef<LottieView>(null);

  // Adjust size dynamically
  const dimension = size === "small" ? 100 : 200;

  if (isPending)
    return (
      <View className={cn(className)}>
        <LottieView
          autoPlay
          ref={animation}
          style={{ width: dimension, height: dimension }}
          source={require("~/assets/sandy-loading.json")}
        />
      </View>
    );
};
