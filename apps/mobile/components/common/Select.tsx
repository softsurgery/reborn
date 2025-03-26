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
import { Text } from "@rn-primitives/label";
import { Label } from "../ui/label";
import { cn } from "~/lib/utils";
import { ScrollView, View } from "react-native";
import { RadioGroupItemWithLabel } from "./RadioGroupItemWithLabel";
import * as Haptics from "expo-haptics";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { ChevronDown } from "lucide-react-native";

interface SelectProps {
  className?: string;
  disabled?: boolean;
  title?: string;
  value?: string;
  onSelect?: (value: string) => void;
  description?: string;
  options?: { label: string; value: string }[];
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
      <Dialog className={cn(className)}>
        <DialogTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            className="flex flex-row justify-between items-start"
          >
            <Label>{value || title}</Label>
            <IconWithTheme size={24} icon={ChevronDown} />
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
                <Text className="text-white dark:text-black">Save</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

export default Select;
