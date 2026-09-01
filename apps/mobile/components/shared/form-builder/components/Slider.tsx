import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { hslToHex } from "@/lib/theme";
import { Slider as RNSlider } from "@miblanchard/react-native-slider";
import React from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { useColorPalette } from "@/hooks/useColorPalette";

interface SliderProps {
  initialValue: number;
  onValueChange: (value: number) => void;
  rangeMaxValue?: number;
  rangeMinValue?: number;
  step?: number;
  label?: string;
  unit?: string;
}

export const Slider = ({
  initialValue,
  onValueChange,
  rangeMinValue = 0,
  rangeMaxValue = 100,
  step = 50,
  label,
  unit = "",
}: SliderProps) => {
  const { palette } = useColorPalette();
  const [localValue, setLocalValue] = React.useState(initialValue);

  React.useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleValueChange = (value: number | number[]) => {
    setLocalValue(Array.isArray(value) ? value[0] : value);
  };

  const handleSlidingComplete = (value: number | number[]) => {
    Haptics.impactAsync();
    onValueChange(Array.isArray(value) ? value[0] : value);
  };

  return (
    <View className="flex flex-col">
      <View className="flex flex-row justify-between items-center">
        <View>
          {label && <Text className="font-semibold text-base">{label}</Text>}
        </View>
        <Badge variant="outline">
          <Text className="text-sm font-bold">
            {localValue} {unit}
          </Text>
        </Badge>
      </View>

      <View className="flex flex-col">
        <RNSlider
          thumbTintColor={hslToHex(palette.primary)}
          minimumTrackTintColor={hslToHex(palette.primary)}
          maximumTrackTintColor={hslToHex(palette.foreground)}
          animateTransitions
          value={localValue}
          minimumValue={rangeMinValue}
          maximumValue={rangeMaxValue}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          step={step}
        />
        <View className="flex flex-row justify-between">
          <Text className="text-xs text-muted-foreground">
            {rangeMinValue} {unit}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {rangeMaxValue} {unit}
          </Text>
        </View>
      </View>
    </View>
  );
};
