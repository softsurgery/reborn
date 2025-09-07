import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "~/lib/utils";

interface InputProps extends TextInputProps {
  placeholderClassName?: string;
  placeholderTextColor?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      className,
      placeholderClassName,
      placeholderTextColor = "#9CA3AF",
      ...props
    },
    ref
  ) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "web:flex h-10 text-foreground native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className
        )}
        placeholderClassName={cn(placeholderClassName)}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
