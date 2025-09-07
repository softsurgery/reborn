import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { cn } from "~/lib/utils";
import { ScrollView, View } from "react-native";
import { RadioGroupItemWithLabel } from "./RadioGroupItemWithLabel";
import * as Haptics from "expo-haptics";
import { ChevronDown } from "lucide-react-native";
import { SelectOption } from "~/components/shared/form-builder/types";
import { Text } from "../ui/text";
import Icon from "~/lib/Icon";

interface SelectProps {
  className?: string;
  disabled?: boolean;
  title?: string;
  value?: string;
  onSelect?: (value: string) => void;
  description?: string;
  options?: SelectOption[];
}

const Select = React.memo(
  ({
    className,
    disabled,
    title,
    value,
    onSelect,
    description,
    options = [],
  }: SelectProps) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            className={cn(
              "flex flex-row justify-between items-start",
              className
            )}
          >
            <Text
              className={cn(
                value
                  ? "text-lg text-black dark:text-white"
                  : "text-gray-400 dark:text-gray-400"
              )}
            >
              {value
                ? options.find((option) => option.value === value)?.label
                : "Select an option"}
            </Text>
            <Icon
              name={ChevronDown}
              size={20}
              className={cn(
                value
                  ? "text-lg text-black dark:text-white"
                  : "text-gray-400 dark:text-gray-400"
              )}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80vw] max-h-[50vh]">
          <DialogHeader>
            <DialogTitle>
              <Label>{title}</Label>
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <ScrollView
            className="max-h-[30vh]"
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <View>
              {options.map((option) => (
                <RadioGroupItemWithLabel
                  className="pe-4 py-2 border-b border-gray-200 dark:border-gray-700 w-full"
                  key={option.label}
                  label={option.label}
                  selected={option.value == value}
                  onSelect={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                    onSelect?.(option.value);
                  }}
                />
              ))}
            </View>
          </ScrollView>

          <DialogFooter>
            <DialogClose asChild>
              <Button>
                <Text className="text-white">Save</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

export default Select;
