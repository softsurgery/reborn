import React from "react";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { RadioButton } from "./RadioButton";
import { Pressable } from "react-native";

type Choice = { label: string; value: any };

interface DoubleChoiceProps {
  className?: string;
  disabled?: boolean;
  positiveChoice: Choice;
  negativeChoice: Choice;
  value?: any;
  onChange?: (value: string) => void | undefined;
}

export const DoubleChoice = ({
  className,
  disabled,
  positiveChoice,
  negativeChoice,
  value,
  onChange,
}: DoubleChoiceProps) => {
  const pressableBaseClassName =
    "flex flex-row gap-4 justify-center items-center h-16 w-1/2 border border-gray-300 dark:border-gray-400 rounded-lg";

  const getPressableExtendedClassName = (cValue : boolean) => {
    return disabled
      ? "bg-gray-50 dark:bg-zinc-700"
      : cValue === value
      ? "bg-gray-200 dark:bg-zinc-800"
      : "";
  };

  return (
    <View
      className={cn(
        "flex flex-row gap-4 justify-center items-center px-2",
        className
      )}
    >
      <Pressable
        className={cn(
          pressableBaseClassName,
          getPressableExtendedClassName(positiveChoice.value)
        )}
        onPress={() => !disabled && onChange?.(positiveChoice.value)}
      >
        <RadioButton selected={value === positiveChoice.value} />
        <Label className="text-sm">{positiveChoice.label}</Label>
      </Pressable>
      <Pressable
        className={cn(
          pressableBaseClassName,
          getPressableExtendedClassName(negativeChoice.value)
        )}
        onPress={() => !disabled && onChange?.(negativeChoice.value)}
      >
        <RadioButton selected={value === negativeChoice.value} />
        <Label>{negativeChoice.label}</Label>
      </Pressable>
    </View>
  );
};
