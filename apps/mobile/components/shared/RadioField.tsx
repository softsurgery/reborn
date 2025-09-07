import React from "react";
import { View, Pressable } from "react-native";
import { cn } from "~/lib/utils";
import { RadioButton } from "./RadioButton";
import { SelectOption } from "./form-builder/types";
import { getItemWidth } from "./form-builder/utils/item-width";
import { Text } from "../ui/text";

interface RadioFieldProps {
  className?: string;
  checked?: string;
  onCheckedChange?: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  itemWidthClass?: string;
}

export const RadioField = ({
  className,
  checked,
  onCheckedChange,
  options,
  disabled = false,
  itemWidthClass,
}: RadioFieldProps) => {
  const pressableBaseClassName =
    "flex flex-row gap-4 justify-center items-center h-16 border border-gray-300 dark:border-gray-400 rounded-lg";

  const getPressableExtendedClassName = (optionValue: string) => {
    if (disabled) return "bg-gray-50 dark:bg-zinc-700";
    if (checked === optionValue) return "bg-gray-200 dark:bg-zinc-800";
    return "";
  };

  return (
    <View
      className={cn(
        "flex flex-row flex-wrap justify-center items-center",
        className
      )}
    >
      {options.map((option) => (
        <Pressable
          key={option.value}
          className={cn(
            pressableBaseClassName,
            itemWidthClass || getItemWidth(options.length),
            getPressableExtendedClassName(option.value)
          )}
          onPress={() => !disabled && onCheckedChange?.(option.value)}
        >
          <RadioButton selected={checked === option.value} />
          <Text className="text-lg">{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};
