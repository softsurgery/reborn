import React from "react";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Trash2 } from "lucide-react-native";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "@/hooks/useRTL";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface DeleteJobActionSheetProps {
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}

export const DeleteJobActionSheet = React.forwardRef<
  ActionSheetRef,
  DeleteJobActionSheetProps
>(({ onConfirm, onClose, isPending }, ref) => {
  const { palette } = useColorPalette();
  const isRTL = useRTL();
  const { t } = useTranslation("jobs");

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
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 32,
      }}
    >
      <View>
        <View className="p-4">
          <View
            className={cn(
              "flex-row items-center justify-between mb-2",
              isRTL && "flex-row-reverse",
            )}
          >
            <View
              className={cn(
                "flex-row items-center gap-2",
                isRTL && "flex-row-reverse",
              )}
            >
              <Icon as={Trash2} size={20} className="text-destructive" />
              <Text variant="large" className="text-destructive font-bold">
                {t("management.actions.sheets.delete.title")}
              </Text>
            </View>
          </View>

          <Text className="mt-1 mb-4 text-sm text-muted-foreground">
            {t("management.actions.sheets.delete.description")}
          </Text>

          <View
            className={cn(
              "flex-row items-center gap-2 mt-2",
              isRTL && "flex-row-reverse",
            )}
          >
            <Button
              onPress={onConfirm}
              variant="destructive"
              className="w-1/2"
              size="sm"
              disabled={isPending}
            >
              <Text className="text-base font-semibold text-destructive-foreground">
                {t("management.common.delete")}
              </Text>
            </Button>
            <Button
              className="w-1/2"
              size="sm"
              variant="outline"
              onPress={onClose}
              disabled={isPending}
            >
              <Text>{t("management.common.cancel")}</Text>
            </Button>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
});

DeleteJobActionSheet.displayName = "DeleteJobActionSheet";
