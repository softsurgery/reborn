import React from "react";
import { Button } from "./button";
import { Text } from "./text";
import DateTimePicker from "@react-native-community/datetimepicker";
import { toLongDateString } from "~/lib/dates.utils";
import { Platform, Pressable, View } from "react-native";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "~/lib/utils";

interface DatePickerProps {
  className?: string;
  date: Date;
  onChange: (date: Date) => void;
}

export const DatePicker = ({ className, date, onChange }: DatePickerProps) => {

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  return (
    <View className={cn("flex-1 justify-center items-center", className)}>
      <Popover className="w-full">
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="w-full">
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
};
