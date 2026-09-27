import React from "react";
import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";
import { Text } from "../ui/text";
import { useRTL } from "@/hooks/useRTL";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Icon } from "../ui/icon";

export interface SettingRowProps {
  className?: string;
  title?: string;
  description?: string;
  rightComponent?: React.ReactNode;
  disabled?: boolean;
  Component?: React.ComponentType;
  onPress?: () => void;
}

export const SettingRow = ({
  className,
  title,
  description,
  rightComponent,
  disabled = false,
  Component,
  onPress,
}: SettingRowProps) => {
  const isRTL = useRTL();
  const isPressable = !!onPress && !disabled;

  const renderedComponent = React.useMemo(() => {
    if (!Component) return null;
    return <Component />;
  }, [Component]);

  if (Component) {
    const componentContent = (
      <View className={cn(className)}>{renderedComponent}</View>
    );

    return isPressable ? (
      <Pressable
        onPress={onPress}
        className={cn("w-full", disabled && "opacity-50")}
      >
        {componentContent}
      </Pressable>
    ) : (
      <View className={cn(disabled && "opacity-50")}>{componentContent}</View>
    );
  }

  const content = (
    <View
      className={cn(
        "flex w-full items-center justify-between",
        isRTL ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Main / left content */}
      <View className="flex flex-1 flex-row items-center gap-3">
        {title || description ? (
          <View className="flex-1">
            {title ? (
              <Text
                className={cn(
                  "font-semibold text-base",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {title}
              </Text>
            ) : null}

            {description ? (
              <Text
                className={cn(
                  "text-xs text-muted-foreground",
                  isRTL ? "text-right" : "text-left",
                )}
              >
                {description}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Right content */}
      <View className="flex flex-row items-center gap-2">
        {rightComponent}
        <Icon
          as={isRTL ? ChevronLeft : ChevronRight}
          size={18}
          className="text-muted-foreground"
        />
      </View>
    </View>
  );

  return isPressable ? (
    <Pressable
      onPress={onPress}
      className={cn(
        "w-full active:opacity-50",
        disabled && "opacity-50",
        className,
      )}
    >
      {content}
    </Pressable>
  ) : (
    <View className={cn(disabled && "opacity-50", className)}>{content}</View>
  );
};
