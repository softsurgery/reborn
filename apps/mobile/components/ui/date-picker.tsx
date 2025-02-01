import React from "react";
import { Button } from "./button";
import { Text } from "./text";
import DateTimePicker from "@react-native-community/datetimepicker";
import { toLongDateString } from "~/lib/dates.utils";
import { Platform, View } from "react-native";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DatePickerProps {
  className?: string;
  disabled?: boolean;
  date: Date;
  onChange: (date: Date) => void;
}

export const DatePicker = ({
  className,
  disabled,
  date,
  onChange,
}: DatePickerProps) => {
  const [pickerVisible, setPickerVisible] = React.useState(
    Platform.OS === "ios"
  );

  const handleDateChange = (date?: Date) => {
    if (date) onChange(date);
    setPickerVisible(Platform.OS === "ios");
  };

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  if (Platform.OS == "android")
    return (
      <View className={cn("flex-1 justify-center items-center", className)}>
        <Button
          disabled={disabled}
          variant={"outline"}
          className="w-full"
          onPress={() => setPickerVisible(true)}
        >
          <Text>{toLongDateString(date)}</Text>
        </Button>

        {React.useMemo(() => {
          return (
            pickerVisible && (
              <DateTimePicker
                display="default"
                value={date}
                onChange={(e, date) => {
                  handleDateChange(date);
                }}
              />
            )
          );
        }, [pickerVisible])}
      </View>
    );
  else {
    return (
      <View className={cn("flex-1 justify-center items-center", className)}>
        <Popover className="w-full">
          <PopoverTrigger asChild>
            <Button disabled={disabled} variant={"outline"} className="w-full">
              <Text>{toLongDateString(date)}</Text>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side={Platform.OS === "web" ? "bottom" : "top"}
            insets={contentInsets}
            className="w-fit"
          >
            <DateTimePicker
              display="inline"
              value={date}
              onChange={(e, date) => {
                onChange(date || new Date());
              }}
            />
          </PopoverContent>
        </Popover>
      </View>
    );
  }
};
