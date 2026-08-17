import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { CopyPlus } from "lucide-react-native";
import { Icon } from "~/components/ui/icon";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { useColorScheme } from "nativewind";
import { THEME } from "~/lib/theme";

interface ApplyJobActionSheetProps {
  onConfirm: () => void;
  isPending: boolean;
}

export const ApplyJobActionSheet = React.forwardRef<
  ActionSheetRef,
  ApplyJobActionSheetProps
>(({ onConfirm, isPending }, ref) => {
  const { colorScheme } = useColorScheme();
  const isDarkColorScheme = colorScheme === "dark";

  return (
    <ActionSheet
      ref={ref}
      gestureEnabled
      statusBarTranslucent
      defaultOverlayOpacity={0.45}
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
      <View className="p-4">
        <View className="flex flex-row items-center gap-2 mb-2">
          <Icon as={CopyPlus} size={24} />
          <Text variant="large" className="text-foreground">
            Confirm Application
          </Text>
        </View>

        <Text className="mt-1 mb-4 text-sm text-muted-foreground">
          Are you sure you want to apply for this job? The client will be
          notified, and you'll be able to chat after the application is
          approved.
        </Text>

        <View className="flex flex-row items-center gap-2 mt-4">
          <Button
            onPress={() => {
              onConfirm();
              // @ts-ignore
              ref?.current?.hide();
            }}
            className="w-1/2"
            size="sm"
            disabled={isPending}
          >
            <Text className="text-base font-semibold">Confirm</Text>
          </Button>
          <Button
            className="w-1/2"
            size="sm"
            variant="outline"
            onPress={() => {
              // @ts-ignore
              ref?.current?.hide();
            }}
          >
            <Text>Cancel</Text>
          </Button>
        </View>
      </View>
    </ActionSheet>
  );
});
