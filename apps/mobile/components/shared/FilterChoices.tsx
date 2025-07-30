import * as React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../ui/text";
import { Toggle, ToggleIcon } from "~/components/ui/toggle";
import { cn } from "~/lib/utils";

interface FilterChoicesProps {
  className?: string;
  Options?: string[];
  onPressChange?: (selected: string) => void;
}

export const FilterChoices = ({
  className,
  Options = ["Best Matches", "Most Recent", "Saved Jobs"],
  onPressChange,
}: FilterChoicesProps) => {
  const [selected, setSelected] = React.useState<string>(Options[0]);

  const handlePress = (option: string) => {
    setSelected(option);
    onPressChange?.(option);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View
        className={cn(
          "flex flex-row justify-start items-start p-2 gap-2",
          className
        )}
      >
        {Options?.map((option, index) => {
          const isActive = selected === option;

          return (
            <Toggle
              key={index}
              pressed={isActive}
              onPressedChange={() => handlePress(option)}
              variant="outline"
              className={cn(
                "rounded-full px-4",
                isActive
                  ? "border-black dark:border-white"
                  : "border-gray-300 dark:border-gray-700"
              )}
            >
              <Text
                className={cn(
                  isActive
                    ? "text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {option}
              </Text>
            </Toggle>
          );
        })}
      </View>
    </ScrollView>
  );
};
