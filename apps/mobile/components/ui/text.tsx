import * as Slot from "@rn-primitives/slot";
import type { SlottableTextProps, TextRef } from "@rn-primitives/types";
import * as React from "react";
import { Text as RNText } from "react-native";
import { cn } from "~/lib/utils";

const TextClassContext = React.createContext<string | undefined>(undefined);

interface CustomSlottableTextProps extends SlottableTextProps {
  reversed?: boolean;
}

const Text = React.forwardRef<TextRef, CustomSlottableTextProps>(
  ({ className, asChild = false, reversed, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(
          "text-base text-foreground web:select-text ",
          reversed
            ? "text-white dark:text-black"
            : "text-black dark:text-white",
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text, TextClassContext };
