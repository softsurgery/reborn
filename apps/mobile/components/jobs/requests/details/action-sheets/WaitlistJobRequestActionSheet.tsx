import React from "react";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Clock } from "lucide-react-native";
import { useColorPalette } from "@/hooks/useColorPalette";
import { ResponseJobRequestDto } from "@/types";
import { identifyUser } from "@/lib/user.utils";

interface WaitlistJobRequestActionSheetProps {
  request: ResponseJobRequestDto;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}

export const WaitlistJobRequestActionSheet = React.forwardRef<
  ActionSheetRef,
  WaitlistJobRequestActionSheetProps
>(({ request, onConfirm, onClose, isPending }, ref) => {
  const { palette } = useColorPalette();

  return (
    <ActionSheet
      ref={ref}
      gestureEnabled
      statusBarTranslucent
      defaultOverlayOpacity={0.45}
      containerStyle={{
        backgroundColor: palette.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 32,
      }}
    >
      <View className="gap-4">
        <View className="flex flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-amber-500/10 items-center justify-center">
            <Icon as={Clock} size={20} className="text-amber-500" />
          </View>
          <Text className="text-lg font-extrabold text-foreground">
            Move to Waitlist
          </Text>
        </View>

        <Text className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to move this application from{" "}
          <Text className="font-bold text-foreground">
            {identifyUser(request.user)}
          </Text>{" "}
          to the waitlist? You can approve or decline it later.
        </Text>

        <View className="flex flex-row items-center gap-3 pt-2">
          <Button
            size="lg"
            className="flex flex-1 items-center justify-center rounded-2xl h-12 bg-amber-500"
            onPress={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="font-bold text-sm text-primary-foreground">
                Confirm
              </Text>
            )}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="flex flex-1 items-center justify-center rounded-2xl h-12"
            onPress={onClose}
            disabled={isPending}
          >
            <Text className="font-bold text-sm">Cancel</Text>
          </Button>
        </View>
      </View>
    </ActionSheet>
  );
});

WaitlistJobRequestActionSheet.displayName = "WaitlistJobRequestActionSheet";
