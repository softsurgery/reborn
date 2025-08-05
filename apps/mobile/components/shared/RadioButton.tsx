import { View } from "react-native";
import { cn } from "~/lib/utils";

interface RadioButton {
  selected?: boolean;
}

export function RadioButton({ selected }: RadioButton) {
  return (
    <View
      className={cn(
        "h-6 w-6 rounded-full border-2 border-black dark:border-white flex justify-center items-center"
      )}
    >
      {selected ? (
        <View className="h-3 w-3 rounded-full bg-black dark:bg-white" />
      ) : null}
    </View>
  );
}
