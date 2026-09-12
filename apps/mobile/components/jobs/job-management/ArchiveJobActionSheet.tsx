import React from "react";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Archive } from "lucide-react-native";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useTranslation } from "react-i18next";

interface ArchiveJobActionSheetProps {
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}

export const ArchiveJobActionSheet = React.forwardRef<
  ActionSheetRef,
  ArchiveJobActionSheetProps
>(({ onConfirm, onClose, isPending }, ref) => {
  const { palette } = useColorPalette();
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
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <Icon as={Archive} size={20} className="text-foreground" />
              <Text variant="large" className="text-foreground">
                {t("management.actions.sheets.archive.title")}
              </Text>
            </View>
          </View>

          <Text className="mt-1 mb-4 text-sm text-muted-foreground">
            {t("management.actions.sheets.archive.description")}
          </Text>

          <View className="flex-row items-center gap-2 mt-2">
            <Button
              onPress={onConfirm}
              className="w-1/2"
              size="sm"
              disabled={isPending}
            >
              <Text className="text-base font-semibold">
                {t("management.common.confirm")}
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

ArchiveJobActionSheet.displayName = "ArchiveJobActionSheet";
