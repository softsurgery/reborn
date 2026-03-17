import { View } from "react-native";
import { cn } from "~/lib/utils";
import { router } from "expo-router";
import {
  ArrowLeft,
  Bookmark,
  ChevronRight,
  Eye,
  Inbox,
  Star,
} from "lucide-react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { useTranslation } from "react-i18next";
import { StableScrollView } from "~/components/shared/StableScrollView";

interface MySpacePortalProps {
  className?: string;
}

export const MySpacePortal = ({ className }: MySpacePortalProps) => {
  const { t } = useTranslation("common");
  const portalItems = [
    {
      title: "Requests",
      icon: Inbox,
      description: "Manage incoming and outgoing requests",
      onPress: () => router.push("/main/my-space/requests"),
    },
    {
      title: "Saved",
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
    <StableSafeAreaView className={cn("flex flex-1 bg-card", className)}>
      <ApplicationHeader
        className="border-b border-border pb-2"
        title={t("screens.myspace")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ArrowLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <StableScrollView className="bg-background">
        <View className="px-4 py-4 gap-4">
          <View className="rounded-2xl border border-border bg-card">
            <View className="p-4 gap-1">
              <Text className="text-lg font-semibold">Your Space</Text>
              <Text className="text-sm text-muted-foreground">
                A quick hub for requests, saves, and activity.
              </Text>
            </View>
          </View>

          <View className="rounded-2xl border border-border bg-card overflow-hidden">
            <View className="px-4 py-3 bg-background/75">
              <Text className="text-lg font-semibold">Quick Access</Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Jump straight to the sections you use most.
              </Text>
            </View>

            <View className="px-4 py-1">
              {portalItems.map((item, index) => {
                const isLast = index === portalItems.length - 1;
                const isDisabled = !!item.disabled;

                return (
                  <View key={item.title}>
                    <StablePressable
                      className={cn(
                        "w-full py-3 rounded-none",
                        isDisabled && "opacity-60",
                      )}
                      onPressClassname="bg-muted/40"
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
        </View>
      </StableScrollView>
    </StableSafeAreaView>
  );
};
