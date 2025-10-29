import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useDebounce } from "~/hooks/useDebounce";
import { ExploreCommon } from "./ExploreCommon";
import { Text } from "../ui/text";
import { ExploreFollowing } from "./ExploreFollowing";
import { cn } from "~/lib/utils";
import { StablePressable } from "../shared/StablePressable";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { Bell, Search, User } from "lucide-react-native";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { router } from "expo-router";

type TabType = "recent" | "followings";

interface ExploreProps {
  initialTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const Explore = ({
  initialTab = "recent",
  onTabChange,
}: ExploreProps) => {
  const [tab, setTab] = React.useState<TabType>(initialTab);
  const [search, setSearch] = React.useState("");

  const { newCount, resetCount } = useNotificationContext();

  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(search, 1000);

  // Use shared values for better performance
  const showHeader = useSharedValue(true);

  // Memoized tab change handler
  const handleTabChange = React.useCallback(
    (newTab: TabType) => {
      setTab(newTab);
      onTabChange?.(newTab);
    },
    [onTabChange]
  );

  // Memoized header visibility handler
  const handleHeaderVisibility = React.useCallback(
    (visible: boolean) => {
      showHeader.value = visible;
    },
    [showHeader]
  );

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(showHeader.value ? 0 : -100, {
          duration: 250,
        }),
      },
    ],
    opacity: withTiming(showHeader.value ? 1 : 0, { duration: 250 }),
    height: withTiming(showHeader.value ? 100 : 0, {
      duration: 250,
    }),
  }));

  // Memoized tab button renderer
  const renderTabButton = React.useCallback(
    (tabKey: TabType, label: string) => (
      <StablePressable
        key={tabKey}
        onPress={() => handleTabChange(tabKey)}
        className={cn(
          "h-12 flex-1 flex items-center justify-center",
          tab === tabKey ? "border-b-2 border-b-primary" : ""
        )}
      >
        <Text
          className={cn(
            "font-medium",
            tab === tabKey ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </Text>
      </StablePressable>
    ),
    [tab, handleTabChange]
  );

  // Memoized content renderer
  const renderContent = React.useMemo(() => {
    switch (tab) {
      case "recent":
        return (
          <ExploreCommon
            className="px-2"
            search={debouncedSearchTerm}
            searching={searching}
            setShowHeader={handleHeaderVisibility}
          />
        );
      case "followings":
        return (
          <ExploreFollowing
            className="px-2"
            search={debouncedSearchTerm}
            searching={searching}
            setShowHeader={handleHeaderVisibility}
          />
        );
      default:
        return null;
    }
  }, [tab, debouncedSearchTerm, searching, handleHeaderVisibility]);

  return (
    <StableSafeAreaView className={cn("flex flex-1 flex-col mx-2")}>
      {/* Animated Header */}
      <Animated.View style={animatedHeaderStyle}>
        <ApplicationHeader
          title="Explore"
          shortcuts={[
            {
              icon: Search,
              onPress: () => router.push("/main/explore/job-search"),
            },
            {
              icon: User,
              onPress: () => router.push("/main/my-space"),
            },
            {
              icon: Bell,
              onPress: () => {
                router.push("/main/notifications");
                resetCount();
              },
              badgeText: newCount > 0 ? `${newCount}` : undefined,
            },
          ]}
        />
        {/* Tab Navigation */}
        <View className="flex flex-row border-b border-border">
          {renderTabButton("recent", "Recent")}
          {renderTabButton("followings", "Following")}
        </View>
      </Animated.View>
      {/* Search Header */}
      {/* Content */}
      {renderContent}
    </StableSafeAreaView>
  );
};
