import { router } from "expo-router";
import {
  Bookmark,
  BriefcaseBusiness,
  ChevronRight,
  Eye,
  Inbox,
  Star,
} from "lucide-react-native";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { StablePressable } from "~/components/shared/StablePressable";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

interface QuickActionsProps {
  className?: string;
}

export const QuickActions = ({ className }: QuickActionsProps) => {
  const portalItems = [
    {
      title: "My jobs",
      icon: BriefcaseBusiness,
      description: "Preview your posted jobs",
      onPress: () => router.push("/main/my-space/jobs"),
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
      onPress: () => router.push("/main/my-space/saved"),
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
      onPress: () => {},
      disabled: true,
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
              <StablePressable
                className={cn(
                  "w-full py-3 rounded-none active:bg-muted/40",
                  isDisabled && "opacity-60",
                )}
                onPress={isDisabled ? undefined : item.onPress}
                disabled={isDisabled}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Icon
                        as={item.icon}
                        size={18}
                        className="text-foreground"
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
              </StablePressable>

              {!isLast ? <Separator /> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
};
