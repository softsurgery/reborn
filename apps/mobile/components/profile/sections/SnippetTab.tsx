import { useColorPalette } from "@reborn/mobile-components";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { cn } from "@reborn/lib";
import { RefreshControl } from "react-native";
import { useTranslation } from "@reborn/i18n";
import { Text } from "@reborn/mobile-ui";

interface SnippetsTabProps {
  className?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef?: React.RefObject<any>;
}

export const SnippetsTab = ({
  className,
  onRefresh,
  refreshing,
  onScroll,
  scrollRef,
}: SnippetsTabProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("menu");

  return (
    <ScrollView
      ref={scrollRef}
      onScroll={onScroll}
      className={cn("flex-1 bg-background", className)}
      refreshControl={
        <RefreshControl
          refreshing={!!refreshing}
          onRefresh={onRefresh}
          tintColor={palette.primary}
          colors={[palette.primary]}
        />
      }
    >
      <View className="flex flex-col gap-4 pb-8 pt-8 px-4">
        <View className="items-center rounded-2xl border border-dashed border-border py-6">
          <Text className="text-sm italic text-muted-foreground">
            {t("menu.tabs.gallery.empty")}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
