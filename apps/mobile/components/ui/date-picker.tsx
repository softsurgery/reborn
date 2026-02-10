import React from "react";
import { Button } from "./button";
import { Text } from "./text";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, View } from "react-native";
import { toLongDateString, parseDateString } from "~/lib/dates.utils"; // you'll need a parse function
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { Icon } from "./icon";
import { Input } from "./input";

interface DatePickerProps {
  className?: string;
  disabled?: boolean;
  date?: Date | null;
  defaultDate?: Date | null;
  onChange: (date: Date | null) => void;
  nullable?: boolean;
}

export const DatePicker = ({
  className,
  disabled,
  date,
  defaultDate = null,
  onChange,
  nullable = false,
}: DatePickerProps) => {
  const [pickerVisible, setPickerVisible] = React.useState(
    Platform.OS === "ios"
  );
  const [inputValue, setInputValue] = React.useState(
    date
      ? toLongDateString(date)
      : defaultDate
      ? toLongDateString(defaultDate)
      : ""
  );

  const selectedDate = date ?? defaultDate ?? new Date();

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  // Handle picker change
  const handleDateChange = (newDate?: Date) => {
    if (newDate) {
      setInputValue(toLongDateString(newDate));
      onChange(newDate);
    }
    setPickerVisible(Platform.OS === "ios");
  };

  // Handle manual input blur
  const handleInputBlur = () => {
    const parsed = parseDateString(inputValue);
    if (parsed) {
      onChange(parsed);
      setInputValue(toLongDateString(parsed));
    } else if (!nullable) {
      setInputValue(toLongDateString(selectedDate));
      onChange(selectedDate);
    } else {
      onChange(null);
    }
  };

  const clearDate = () => {
    setInputValue("");
    onChange(null);
  };

  // Display text for button fallback
  const displayText = inputValue || "Select a date";

  // Android picker + input
  if (Platform.OS === "android") {
    return (
      <View className={cn("flex-1 justify-center items-center")}>
        <Input
          value={inputValue}
          placeholder="Select a date"
          editable={!disabled}
          className={cn("border p-2 rounded w-full", className)}
          onChangeText={setInputValue}
          onBlur={handleInputBlur}
        />

        {nullable && date && (
          <Button
            variant="ghost"
            className="mt-2"
            onPress={clearDate}
            disabled={disabled}
          >
            <Text className="text-red-500">Clear</Text>
          </Button>
        )}

        {pickerVisible && (
          <DateTimePicker
            display="default"
            value={selectedDate}
            onChange={(e, newDate) => handleDateChange(newDate)}
          />
        )}
      </View>
    );
  } else {
    return (
      <View
        className={cn(
          "flex flex-1 flex-row justify-center items-center px-6 gap-2"
        )}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Input
              value={inputValue}
              placeholder="Select a date"
              editable={!disabled}
              className={cn("border p-2 rounded w-full", className)}
              onChangeText={setInputValue}
              onBlur={handleInputBlur}
            />
          </PopoverTrigger>
          <PopoverContent
            side={Platform.OS === "web" ? "bottom" : "top"}
            insets={contentInsets}
            className="w-fit"
          >
            <DateTimePicker
              display="inline"
              value={selectedDate}
              onChange={(e, newDate) => handleDateChange(newDate)}
            />
            {nullable && date && (
              <Button
                variant="ghost"
                className="mt-2"
                onPress={clearDate}
                disabled={disabled}
              >
                <Text className="text-red-500">Clear</Text>
              </Button>
            )}
          </PopoverContent>
        </Popover>

        <Button variant="ghost" onPress={clearDate} size={"icon"}>
          <Icon as={X} size={24} />
        </Button>
      </View>
    );
  }
};
