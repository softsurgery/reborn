import { router } from "expo-router";
import {
  Bookmark,
  BriefcaseBusiness,
  ChevronRight,
  Eye,
  Inbox,
  Star,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { cn } from "~/lib/utils";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { useColorPalette } from "@/hooks/useColorPalette";

interface QuickActionsProps {
  className?: string;
}

export const QuickActions = ({ className }: QuickActionsProps) => {
  const { palette } = useColorPalette();
  const portalItems = [
    {
      title: "My jobs",
      icon: BriefcaseBusiness,
      description: "Preview your posted jobs",
      onPress: () => router.push("/main/my-space/quick-actions/jobs"),
    },
    {
      title: "Requests",
      icon: Inbox,
      description: "Manage incoming and outgoing requests",
      onPress: () => router.push("/main/my-space/requests"),
    },
    {
      title: "Saved jobs",
      icon: Bookmark,
      description: "Keep track of jobs you bookmarked",
      onPress: () => router.push("/main/my-space/quick-actions/saved"),
    },
    {
      title: "Reviews",
      icon: Star,
      description: "See your ratings and feedback",
      onPress: () => {},
      disabled: true,
    },
    {
      title: "Viewed",
      icon: Eye,
      description: "Revisit recently viewed opportunities",
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
            <View key={item.title}>
              <Pressable
                className={cn(
                  "w-full py-3 rounded-none active:opacity-50",
                  isDisabled && "opacity-60",
                )}
                onPress={isDisabled ? undefined : item.onPress}
                disabled={isDisabled}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
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
                        <Text>Soon</Text>
                      </Badge>
                    ) : (
                      <Icon
                        as={ChevronRight}
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
