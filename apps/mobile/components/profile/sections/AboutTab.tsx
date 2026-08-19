import { SeeMoreText } from "@/components/shared/SeeMoreText";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { hslToHex, THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { ResponseUserDto } from "@/types";
import { UserRound, LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

interface AboutTabProps {
  className?: string;
  user: ResponseUserDto | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef?: React.RefObject<any>;
}

const SectionHeader = ({
  icon,
  title,
  color = hslToHex(THEME.light.primary),
}: {
  icon: LucideIcon;
  title: string;
  color?: string;
}) => (
  <View className="mb-3 flex-row items-center gap-2">
    <Icon as={icon} size={18} color={color} />
    <Text className="text-base font-bold text-foreground">{title}</Text>
  </View>
);

export const AboutTab = ({
  className,
  user,
  refreshing,
  onRefresh,
  onScroll,
  scrollRef,
}: AboutTabProps) => {
  const { t } = useTranslation("menu");

  return (
    <ScrollView
      ref={scrollRef}
      className={cn(className)}
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}
      refreshControl={
        <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex flex-col gap-6 px-4">
        {/* Bio */}
        <View>
          <SectionHeader icon={UserRound} title={t("menu.tabs.about.title")} />
          {user?.bio ? (
            <SeeMoreText
              textClassname="text-sm leading-6 text-foreground"
              numberOfLines={4}
            >
              {user.bio}
            </SeeMoreText>
          ) : (
            <View className="items-center rounded-2xl border border-dashed border-border py-6">
              <Text className="text-sm italic text-muted-foreground">
                {t("menu.tabs.about.empty")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
