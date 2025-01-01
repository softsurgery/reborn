import { View } from "react-native";
import { RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

export function RadioGroupItemWithLabel({
    value,
  }: {
    value: string;
  }) {
    return (
      <View className="flex-row gap-2 items-center">
        <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
        <Label nativeID={`label-for-${value}`}>
          {value}
        </Label>
      </View>
    );
  }