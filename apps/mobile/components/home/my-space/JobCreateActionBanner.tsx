import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "@/hooks/useRTL";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface JobCreateActionBannerProps {
  className?: string;
  searchBarHeight: number;
  setBannerHeight: (height: number) => void;
}

export const JobCreateActionBanner = ({
  className,
  searchBarHeight,
  setBannerHeight,
}: JobCreateActionBannerProps) => {
  const { palette } = useColorPalette();
  const isRTL = useRTL();
  const { t } = useTranslation("home");
  return (
    <View>
      <View
        className={cn("flex flex-col", className)}
        onLayout={(e) => setBannerHeight(e.nativeEvent.layout.height)}
      >
        {/* Quick Action Banner */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            router.push("/main/my-space/new-job");
          }}
          className={cn(
            "flex flex-row items-center justify-between rounded-2xl px-2",
            isRTL && "flex-row-reverse",
          )}
        >
          <View
            className={cn(
              "flex-row items-center gap-3 flex-1",
              isRTL && "flex-row-reverse",
            )}
          >
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
              <Icon as={Plus} size={18} color={palette.primaryForeground} />
            </View>
            <View className={cn("flex-1", isRTL && "items-end")}>
              <Text className="text-base font-semibold text-foreground">
                {t("userJobs.createBanner.title")}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {t("userJobs.createBanner.subtitle")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ height: searchBarHeight }} />
    </View>
  );
};
