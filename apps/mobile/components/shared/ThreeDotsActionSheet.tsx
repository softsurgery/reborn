import React from "react";
import { useColorScheme } from "nativewind";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import * as Haptics from "expo-haptics";
import { Keyboard, Pressable, View } from "react-native";
import { cn } from "@/lib/utils";
import {
  Ellipsis,
  EllipsisVertical,
  type LucideIcon,
} from "lucide-react-native";
import { Icon } from "../ui/icon";
import { THEME } from "@/lib/theme";
import { Text } from "../ui/text";
import { VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";

interface ThreeDotsActionSheetProps {
  icon?: LucideIcon;
  size?: number;
  disabled?: boolean;
  options: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: VariantProps<typeof Button>["variant"];
    icon?: LucideIcon;
  }[];
}

export const ThreeDotsActionSheet = ({
  icon,
  disabled,
  size,
  options,
}: ThreeDotsActionSheetProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkColorScheme = colorScheme === "dark";
  const sheetRef = React.useRef<ActionSheetRef>(null);

  const handleClose = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <Pressable
        className={cn(
          "flex justify-center active:opacity-75",
          disabled && "opacity-50 pointer-events-none",
        )}
        onPress={() => {
          if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            sheetRef.current?.show();
          }
        }}
      >
        <Icon as={icon || Ellipsis} size={size || 24} color={"gray"} />
      </Pressable>
      <ActionSheet
        ref={sheetRef}
        gestureEnabled
        statusBarTranslucent
        defaultOverlayOpacity={0.45}
        onClose={handleClose}
        containerStyle={{
          backgroundColor: isDarkColorScheme
            ? THEME.dark.background
            : THEME.light.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 32,
        }}
      >
        <View className="gap-2">
          {options.map((option) => (
            <Button
              key={option.label}
              disabled={option.disabled}
              variant={option.variant || "ghost"}
              onPress={async () => {
                if (option.disabled) return;
                await Haptics.selectionAsync();
                option.onPress();
                sheetRef.current?.hide();
              }}
              className={cn(
                "flex flex-row items-center gap-3 rounded-2xl px-2 py-1",
                option.disabled && "opacity-50",
              )}
            >
              <View
                className={cn(
                  "h-10 w-10 items-center justify-center rounded-full",
                )}
              >
                {option.icon ? (
                  <Icon as={option.icon} size={18} />
                ) : (
                  <Icon as={Ellipsis} size={18} color={"gray"} />
                )}
              </View>

              <View className="flex-1">
                <Text className={cn("text-base font-medium")}>
                  {option.label}
                </Text>
              </View>
            </Button>
          ))}
        </View>
      </ActionSheet>
    </>
  );
};
