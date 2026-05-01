import React from "react";
import { cn } from "~/lib/utils";
import { Pressable } from "react-native";

export interface StablePressableProps extends React.ComponentPropsWithoutRef<
  typeof Pressable
> {
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

function extractActiveClasses(className?: string) {
  if (!className) return { base: "", active: "" };

  const classes = className.split(" ");

  const baseClasses: string[] = [];
  const activeClasses: string[] = [];

  classes.forEach((cls) => {
    if (cls.startsWith("active:")) {
      activeClasses.push(cls.replace("active:", ""));
    } else {
      baseClasses.push(cls);
    }
  });

  return {
    base: baseClasses.join(" "),
    active: activeClasses.join(" "),
  };
}

export const StablePressable = ({
  className,
  onPress,
  children,
  ...props
}: StablePressableProps) => {
  const [pressed, setPressed] = React.useState(false);

  const { base, active } = extractActiveClasses(className);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={cn("rounded-lg", base, pressed && active)}
      onPress={onPress}
      {...props}
    >
      {children}
    </Pressable>
  );
};
