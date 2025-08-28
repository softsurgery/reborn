import React from "react";
import { cn } from "~/lib/utils";
import { Pressable } from "react-native";

interface StablePressableProps
  extends React.ComponentPropsWithoutRef<typeof Pressable> {
  className?: string;
  onPressClassname?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

export const StablePressable = ({
  className,
  onPressClassname,
  onPress,
  children,
}: StablePressableProps) => {
  const [pressed, setPressed] = React.useState(false);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={cn(
        "rounded-lg",
        pressed && (onPressClassname || "bg-secondary/25"),
        className
      )}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};
