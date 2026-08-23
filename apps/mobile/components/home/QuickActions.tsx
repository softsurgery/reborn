import { router } from "expo-router";
import {
  Bookmark,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Star,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "@/hooks/useRTL";

interface QuickActionsProps {
  className?: string;
}

export const QuickActions = ({ className }: QuickActionsProps) => {
  const { palette } = useColorPalette();
  const isRTL = useRTL();
  const { t } = useTranslation("home");

  const portalItems = [
    {
      id: "myJobs",
      title: t("quickActions.items.myJobs.title"),
      icon: BriefcaseBusiness,
      description: t("quickActions.items.myJobs.description"),
      onPress: () => router.push("/main/my-space/quick-actions/jobs"),
    },
    {
      id: "requests",
      title: t("quickActions.items.requests.title"),
      icon: Inbox,
      description: t("quickActions.items.requests.description"),
      onPress: () => router.push("/main/my-space/requests"),
    },
    {
      id: "savedJobs",
      title: t("quickActions.items.savedJobs.title"),
      icon: Bookmark,
      description: t("quickActions.items.savedJobs.description"),
      onPress: () => router.push("/main/my-space/quick-actions/saved"),
    },
    {
      id: "reviews",
      title: t("quickActions.items.reviews.title"),
      icon: Star,
      description: t("quickActions.items.reviews.description"),
      onPress: () => {},
      disabled: true,
    },
    {
      id: "viewed",
      title: t("quickActions.items.viewed.title"),
      icon: Eye,
      description: t("quickActions.items.viewed.description"),
      onPress: () => router.push("/main/my-space/quick-actions/viewed"),
    },
  ];
  return (
    <View className={cn("gap-4", className)}>
      <View className="py-1">
        {portalItems.map((item, index) => {
          const isLast = index === portalItems.length - 1;
          const isDisabled = !!item.disabled;

          return (
            <View key={item.id}>
              <Pressable
                className={cn(
                  "w-full py-3 rounded-none active:opacity-50",
                  isDisabled && "opacity-60",
                )}
                onPress={isDisabled ? undefined : item.onPress}
                disabled={isDisabled}
              >
                <View className={cn("flex-row items-center justify-between", isRTL && "flex-row-reverse")}>
                  <View className={cn("flex-row items-center gap-3 flex-1", isRTL && "flex-row-reverse")}>
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Icon
                        as={item.icon}
                        size={24}
                        color={palette.primaryForeground}
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-base font-semibold">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    {isDisabled ? (
                      <Badge variant="outline">
                        <Text>{t("quickActions.soon")}</Text>
                      </Badge>
                    ) : (
                      <Icon
                        as={isRTL ? ChevronLeft : ChevronRight}
                        size={18}
                        className="text-muted-foreground"
                      />
                    )}
                  </View>
                </View>
              </Pressable>

              {!isLast ? <Separator /> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
};
