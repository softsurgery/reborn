import * as React from "react";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { FEEDBACK_CATEGORIES } from "~/constants/feedback-categories";

function FeedbackCategorySelector() {
  const [value, setValue] = React.useState(FEEDBACK_CATEGORIES[0]); // Default to the first category

  function onLabelPress(label: string) {
    return () => {
      setValue(label);
    };
  }

  return (
    <View className="flex-1 justify-center items-center p-6">
      <RadioGroup value={value} onValueChange={setValue} className="gap-3" style={{ flexDirection: "row" }}>
        {FEEDBACK_CATEGORIES.map((category) => (
          <RadioGroupItemWithLabel
            key={category}
            value={category}
            onLabelPress={onLabelPress(category)}
          />
        ))}
      </RadioGroup>
    </View>
  );
}

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className="flex-row gap-2 items-center">
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}

export default FeedbackCategorySelector;
