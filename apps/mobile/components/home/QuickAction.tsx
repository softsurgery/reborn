import React from "react";
import { View, TouchableOpacity, Pressable } from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import {
  MinusCircle,
  PlusCircle,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react-native";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "@/hooks/useRTL";
import { useTranslation } from "react-i18next";

export interface QuickActionProps {
  item: {
    id: string;
    title: string;
    icon: LucideIcon;
    description: string;
    onPress: () => void;
    disabled?: boolean;
  };
  isActive?: boolean;
  isEditMode: boolean;
  isLast: boolean;
  type: "active" | "inactive";
  onRemove?: (id: string) => void;
  onAdd?: (id: string) => void;
  drag?: () => void;
}

export const QuickAction = ({
  item,
  isActive = false,
  isEditMode,
  isLast,
  type,
  onRemove,
  onAdd,
  drag,
}: QuickActionProps) => {
  const { palette } = useColorPalette();
  const isRTL = useRTL();
  const { t } = useTranslation("home");
  const isDisabled = !!item.disabled && !isEditMode;

  if (type === "inactive") {
    return (
      <View>
        <View className="w-full py-3 rounded-xl opacity-60">
          <View
            className={cn(
              "flex-row items-center justify-between",
              isRTL && "flex-row-reverse",
            )}
          >
            <View
              className={cn(
                "flex-row items-center gap-3 flex-1",
                isRTL && "flex-row-reverse",
              )}
            >
              <TouchableOpacity
                className="p-1 mr-1"
                onPress={() => onAdd?.(item.id)}
              >
                <Icon as={PlusCircle} size={20} className="text-primary" />
              </TouchableOpacity>

              <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Icon
                  as={item.icon}
                  size={24}
                  color={palette.primaryForeground}
                />
              </View>

              <View className="flex-1">
                <Text className="text-base font-semibold">{item.title}</Text>
                <Text className="text-sm text-muted-foreground mt-0.5">
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {!isLast && <Separator />}
      </View>
    );
  }

  // Active items
  return (
    <View>
      <Pressable
        className={cn(
          "w-full py-3 rounded-xl active:opacity-50",
          isDisabled && "opacity-60",
          isActive && "bg-muted/50",
        )}
        onPress={isEditMode ? undefined : isDisabled ? undefined : item.onPress}
        onLongPress={isEditMode ? drag : undefined}
        disabled={isEditMode ? false : isDisabled}
      >
        <View
          className={cn(
            "flex-row items-center justify-between",
            isRTL && "flex-row-reverse",
          )}
        >
          <Animated.View
            layout={Layout.springify()}
            className={cn(
              "flex-row items-center gap-3 flex-1",
              isRTL && "flex-row-reverse",
            )}
          >
            {isEditMode && (
              <Animated.View
                key="minus"
                entering={FadeIn}
                exiting={FadeOut}
                layout={Layout.springify()}
              >
                <TouchableOpacity
                  className="p-1 mr-1"
                  onPress={() => onRemove?.(item.id)}
                >
                  <Icon
                    as={MinusCircle}
                    size={20}
                    className="text-destructive"
                  />
                </TouchableOpacity>
              </Animated.View>
            )}

            <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Icon
                as={item.icon}
                size={24}
                color={palette.primaryForeground}
              />
            </View>

            <View className="flex-1">
              <Text className="text-base font-semibold">{item.title}</Text>
              <Text className="text-sm text-muted-foreground mt-0.5">
                {item.description}
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            layout={Layout.springify()}
            className="flex-row items-center gap-2"
          >
            {isEditMode ? (
              <Animated.View key="grip" entering={FadeIn} exiting={FadeOut}>
                <TouchableOpacity onPressIn={drag} className="p-2">
                  <Icon
                    as={GripVertical}
                    size={20}
                    className="text-muted-foreground"
                  />
                </TouchableOpacity>
              </Animated.View>
            ) : isDisabled ? (
              <Animated.View key="soon" entering={FadeIn} exiting={FadeOut}>
                <Badge variant="outline">
                  <Text>{t("quickActions.soon")}</Text>
                </Badge>
              </Animated.View>
            ) : (
              <Animated.View key="chevron" entering={FadeIn} exiting={FadeOut}>
                <Icon
                  as={isRTL ? ChevronLeft : ChevronRight}
                  size={18}
                  className="text-muted-foreground"
                />
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </Pressable>

      {!isLast && !isActive ? <Separator /> : null}
    </View>
  );
};
