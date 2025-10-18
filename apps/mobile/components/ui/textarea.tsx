import * as React from "react";
import { Platform, TextInput, type TextInputProps } from "react-native";
import { cn } from "~/lib/utils";

const Textarea = React.forwardRef<
  TextInput,
  TextInputProps & { placeholderClassName?: string }
>(
  (
    {
      className,
      multiline = true,
      numberOfLines = Platform.select({ web: 2, native: 8 }),
      placeholderClassName,
      ...props
    },
    ref
  ) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "text-foreground placeholder:text-muted-foreground selection:text-primary-foreground border-input dark:bg-input/30 flex min-h-16 w-full flex-row rounded-md border bg-transparent px-3 py-2 text-base shadow-sm shadow-black/5 md:text-sm",
          Platform.select({
            web: "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content resize-y outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed",
            native: "placeholder:text-muted-foreground/50",
          }),
          props.editable === false && "opacity-50",
          "font-poppins",
          className
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
