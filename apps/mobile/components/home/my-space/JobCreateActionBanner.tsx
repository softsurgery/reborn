import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "@/hooks/useRTL";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import { Briefcase, Plus } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

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
            "flex flex-row items-center justify-between rounded-2xl px-4 shadow-xs",
            isRTL && "flex-row-reverse",
          )}
        >
          <View className={cn("flex-row items-center gap-3 flex-1", isRTL && "flex-row-reverse")}>
            <View className="w-10 h-10 rounded-xl bg-background items-center justify-center">
              <Icon as={Briefcase} size={20} color={palette.foreground} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">
                Post a New Job
              </Text>
              <Text className="text-xs text-muted-foreground">
                Create a listing to hire talented workers
              </Text>
            </View>
          </View>
          <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
            <Icon as={Plus} size={18} color={palette.primaryForeground} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ height: searchBarHeight }} />
    </View>
  );
};
