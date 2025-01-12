import { Pressable, View } from "react-native";
import { Label } from "../ui/label";
import { cn } from "~/lib/utils";
import { RadioButton } from "./Radio";

interface RadioGroupItemWithLabelProps {
  className?: string;
  label?: string;
  onSelect?: (value?: string) => void;
  selected: boolean;
}

export function RadioGroupItemWithLabel({
  className,
  label,
  onSelect,
  selected,
}: RadioGroupItemWithLabelProps) {
  return (
    <Pressable
      className={cn("flex flex-row items-center justify-between", className)}
      onPress={() => onSelect?.(label)}
    >
      <Label>{label}</Label>
      <RadioButton className="rounded-lg border" selected={selected} />
    </Pressable>
  );
}
