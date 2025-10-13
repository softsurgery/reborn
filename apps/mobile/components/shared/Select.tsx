import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { Keyboard, ScrollView, View } from "react-native";
import * as Haptics from "expo-haptics";
import { ChevronDown, Check, Search } from "lucide-react-native";
import type { SelectOption } from "~/components/shared/form-builder/types";
import { Text } from "../ui/text";
import Icon from "~/lib/Icon";
import { StablePressable } from "./StablePressable";
import { Input } from "../ui/input";

interface SelectProps {
  className?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  options?: SelectOption[];
  searchable?: boolean;
}

const Select = React.memo(
  ({
    className,
    title,
    description,
    placeholder,
    value,
    onSelect,
    disabled,
    options = [],
    searchable = false,
  }: SelectProps) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<
      string | undefined
    >(value);
    const selectedValue = value ?? internalValue;

    React.useEffect(() => {
      if (value !== undefined) setInternalValue(value);
    }, [value]);

    const [rowHeight, setRowHeight] = React.useState(0);
    const scrollViewRef = React.useRef<ScrollView>(null);

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );

    React.useEffect(() => {
      if (
        isOpen &&
        selectedValue &&
        scrollViewRef.current &&
        filteredOptions.length > 0
      ) {
        const selectedIndex = filteredOptions.findIndex(
          (option) => option.value === selectedValue
        );
        if (selectedIndex !== -1 && rowHeight > 0) {
          const scrollOffset = selectedIndex * rowHeight;
          requestAnimationFrame(() => {
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, scrollOffset - rowHeight),
              animated: true,
            });
          });
        }
      }
    }, [isOpen, selectedValue, filteredOptions, rowHeight]);

    const handleSelect = (optionValue: string) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSelect?.(optionValue);
      if (value === undefined) setInternalValue(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    };

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (!open) setSearchQuery("");
    };

    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <View
            className={cn(
              "relative flex flex-row items-center w-full",
              disabled && "opacity-50 pointer-events-none",
              className
            )}
          >
            <Input
              onPress={() => {
                setIsOpen(true);
                Keyboard.dismiss();
              }}
              readOnly
              editable={!disabled}
              value={selectedOption?.label || ""}
              placeholder={placeholder || "Select an option"}
              className="pr-10 cursor-pointer"
            />
            <Icon
              name={ChevronDown}
              size={18}
              className={cn(
                "absolute right-3 -top-2 transition-transform duration-200 text-muted-foreground",
                isOpen && "rotate-180"
              )}
              color={disabled ? "#A1A1AA" : "#71717A"}
            />
          </View>
        </DialogTrigger>

        <DialogContent className="w-[85vw] max-w-md max-h-[70vh] flex flex-col bg-card border-border/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle>
              <Text className="text-xl font-semibold text-foreground">
                {title || "Select Option"}
              </Text>
            </DialogTitle>
            {description && (
              <DialogDescription>
                <Text className="text-lg text-muted-foreground leading-relaxed">
                  {description}
                </Text>
              </DialogDescription>
            )}
          </DialogHeader>

          {searchable && (
            <View className="px-1">
              <View className="relative">
                <Icon
                  name={Search}
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
                />
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-muted border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </View>
            </View>
          )}

          <ScrollView
            ref={scrollViewRef}
            className="flex flex-col max-h-[40vh] px-1"
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {filteredOptions.length === 0 ? (
              <View className="py-8 px-4 text-center">
                <Text className="text-muted-foreground text-sm">
                  {searchQuery ? "No options found" : "No options available"}
                </Text>
              </View>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <StablePressable
                    key={option.value}
                    className={cn(
                      "flex flex-row items-center justify-between py-3 px-4 mb-1 rounded-lg transition-all duration-200",
                      "hover:bg-accent/50 active:bg-accent/70",
                      isSelected && "bg-primary/10 border border-primary/20"
                    )}
                    onPress={() => handleSelect(option.value)}
                    onLayout={(e) => {
                      if (rowHeight === 0)
                        setRowHeight(e.nativeEvent.layout.height);
                    }}
                  >
                    <Text
                      className={cn(
                        "text-base font-medium flex-1",
                        isSelected
                          ? "text-primary font-semibold"
                          : "text-foreground"
                      )}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Icon
                        name={Check}
                        size={18}
                        className="text-primary ml-2"
                      />
                    )}
                  </StablePressable>
                );
              })
            )}
          </ScrollView>
        </DialogContent>
      </Dialog>
    );
  }
);

Select.displayName = "Select";

export default Select;
